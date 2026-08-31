/**
 * Content loaders for teaching material.
 *
 * A teaching unit is authored as one Markdown file, because that is how a unit
 * is written and revised: in one place, in order. It is not, however, how it is
 * read. A student looks for one class — "la sesión 7" — links to it, and comes
 * back to it, so every class is published as its own page.
 *
 * These two loaders do that split at build time. `unitLoader` publishes the
 * unit itself, carrying its frontmatter and the introduction that precedes the
 * first class. `lessonLoader` publishes one entry per class, plus the closing
 * recap. Both read the same files through `splitUnit`, and neither rewrites
 * them: the author keeps a single file per unit.
 *
 * Entry ids mirror the URLs: `<course>/<unit>` for a unit, and
 * `<course>/<unit>/<lesson>` for one of its pages.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
// The parser Astro's own loaders use for frontmatter, so a unit is read here
// exactly as the `glob` loader would have read it. It ships as a pinned
// dependency of `astro` itself.
import { parseFrontmatter } from "@astrojs/internal-helpers/frontmatter";

import { splitUnit, promoteHeadings } from "./unit-split.mjs";

/** Slug of the page that closes a unit, in the language the unit is written in. */
const RECAP_SLUG = { es: "recordar", en: "recap" };

function markdownFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) found.push(...markdownFiles(path));
    else if (entry.endsWith(".md")) found.push(path);
  }
  return found;
}

/** Entry ids are URLs, so a Windows path separator must not reach one. */
const posix = (path) => path.split(/[\\/]/).join("/");

/**
 * Every unit file under `baseDir`, with the course and unit slugs its path
 * declares. The path is the only source of both, so they cannot drift from the
 * course declared in `src/data/teaching.ts`.
 */
function unitFiles(baseDir) {
  return markdownFiles(baseDir).map((path) => {
    const segments = posix(relative(baseDir, path)).split("/");
    const unitSlug = segments.pop().replace(/\.md$/, "");
    return { path, courseSlug: segments.join("/"), unitSlug };
  });
}

function readUnit(file) {
  const { frontmatter, content } = parseFrontmatter(readFileSync(file.path, "utf8"));
  return { ...file, frontmatter, split: splitUnit(content) };
}

/**
 * The bookkeeping both loaders share: walk the files, hand each one to
 * `emit`, drop the entries of files that no longer exist, and re-run a single
 * file when the watcher reports it changed.
 */
function collectionLoader(name, base, emit) {
  return {
    name,
    async load(context) {
      const { store, config, watcher, logger } = context;
      const baseDir = fileURLToPath(new URL(base, config.root));

      const untouched = new Set(store.keys());
      const idsByFile = new Map();

      async function sync(file) {
        const ids = await emit(readUnit(file), context, baseDir);
        // A renamed lesson leaves its old entry behind; forget what this file
        // produced last time before recording what it produces now.
        for (const id of idsByFile.get(file.path) ?? []) {
          if (!ids.includes(id)) store.delete(id);
        }
        idsByFile.set(file.path, ids);
        for (const id of ids) untouched.delete(id);
        return ids;
      }

      const files = unitFiles(baseDir);
      let count = 0;
      for (const file of files) count += (await sync(file)).length;
      for (const id of untouched) store.delete(id);
      logger.info(`Loaded ${count} entries from ${files.length} unit files`);

      if (!watcher) return;

      watcher.add(baseDir);
      const reload = async (changed) => {
        if (!changed.endsWith(".md") || !posix(changed).includes(posix(baseDir))) return;
        const file = unitFiles(baseDir).find((candidate) => candidate.path === changed);
        if (!file) return;
        try {
          await sync(file);
          logger.info(`Reloaded ${posix(relative(baseDir, changed))}`);
        } catch (error) {
          logger.error(`Failed to reload ${changed}: ${error.message}`);
        }
      };
      watcher.on("change", reload);
      watcher.on("add", reload);
      watcher.on("unlink", (deleted) => {
        for (const id of idsByFile.get(deleted) ?? []) store.delete(id);
        idsByFile.delete(deleted);
      });
    }
  };
}

/**
 * Store one page, re-rendering its Markdown only when something about that page
 * changed. The digest covers one page rather than the whole file, so editing
 * session 12 does not re-render the other seventeen.
 *
 * It has to cover the data as well as the Markdown. The store drops any `set`
 * whose digest matches what it already holds, so a digest taken over the body
 * alone would make every frontmatter-only edit — a retitled unit, a corrected
 * `section`, a new `duration` — vanish silently until the store was deleted.
 */
async function put(context, { id, data, markdown, file, baseDir }) {
  const { store, parseData, generateDigest, renderMarkdown } = context;
  const digest = generateDigest({ data, markdown });
  const existing = store.get(id);

  // Same page as last time: what the store holds is already correct.
  if (existing?.digest === digest && existing.rendered) return id;

  const filePath = posix(relative(baseDir, file.path));
  store.set({
    id,
    data: await parseData({ id, data, filePath }),
    body: markdown,
    filePath,
    digest,
    rendered: await renderMarkdown(markdown, { fileURL: pathToFileURL(file.path) })
  });
  return id;
}

/** One entry per unit file: its frontmatter, and the text before class one. */
export function unitLoader({ base }) {
  return collectionLoader("teaching-units", base, async (unit, context, baseDir) => {
    const id = `${unit.courseSlug}/${unit.unitSlug}`;
    await put(context, {
      id,
      data: {
        ...unit.frontmatter,
        course: unit.courseSlug,
        slug: unit.unitSlug,
        lessonCount: unit.split.lessons.length,
        // Most units go straight into class one. The layout needs to know
        // before it decides whether to open a section for the introduction.
        hasIntro: unit.split.intro.length > 0
      },
      markdown: unit.split.intro,
      file: unit,
      baseDir
    });
    return [id];
  });
}

/** One entry per class inside a unit, plus the page that closes it. */
export function lessonLoader({ base }) {
  return collectionLoader("teaching-lessons", base, async (unit, context, baseDir) => {
    const lang = unit.frontmatter.lang ?? "es";
    const unitId = `${unit.courseSlug}/${unit.unitSlug}`;

    const pages = unit.split.lessons.map((lesson, index) => ({
      slug: lesson.slug,
      markdown: promoteHeadings(lesson.body),
      data: {
        role: "lesson",
        title: lesson.title,
        number: lesson.number,
        group: lesson.group,
        order: index + 1
      }
    }));

    if (unit.split.recap) {
      pages.push({
        slug: RECAP_SLUG[lang] ?? RECAP_SLUG.es,
        markdown: promoteHeadings(unit.split.recap.body),
        data: {
          role: "recap",
          title: unit.split.recap.title,
          order: pages.length + 1
        }
      });
    }

    const ids = [];
    for (const page of pages) {
      ids.push(
        await put(context, {
          id: `${unitId}/${page.slug}`,
          data: {
            ...page.data,
            unit: unitId,
            course: unit.courseSlug,
            slug: page.slug,
            lang,
            // A unit is published or held back as a whole; its classes cannot
            // disagree with it.
            draft: unit.frontmatter.draft ?? false,
            date: unit.frontmatter.date
          },
          markdown: page.markdown,
          file: unit,
          baseDir
        })
      );
    }
    return ids;
  });
}

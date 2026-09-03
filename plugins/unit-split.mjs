/**
 * Splits a teaching unit written as one Markdown file into the pieces the site
 * publishes as separate pages.
 *
 * A unit file is long — the HTML unit runs to 3.500 lines — but it is not one
 * document. It is an introduction, a sequence of `## Sesión N · Título` blocks
 * that are the actual classes, and a closing recap. Each class is what a
 * student looks for, links to and comes back to, so each one becomes its own
 * page. This module is the single place that decides where the cuts are: the
 * content loader uses it to build the entries, and `check-sessions.mjs` uses it
 * to fail the build when a file does not fit the shape.
 *
 * Nothing here rewrites the source. The Markdown stays exactly as it is written.
 */

/** `## Sesión 7 · Imágenes correctamente utilizadas` — one class. */
const LESSON = /^(sesi[oó]n|session)\s+(\d+)\s*(?:·|:|-|–|—)\s*(.+)$/i;

/**
 * `## Semana 3 · Imágenes y semántica estructural` — a label for the classes
 * that follow it, not a class itself. It carries no body of its own.
 */
const GROUP = /^(semana|week)\s+(\d+)\s*(?:·|:|-|–|—)\s*(.+)$/i;

/**
 * Opening or closing fence of a code block, with its indentation and length.
 *
 * Exported because `check-sessions.mjs` has to read fences exactly as the split
 * does. A fence written with three backticks is closed by the first line of
 * three backticks and nothing else, so a ` ```bash ` nested inside a
 * ` ```markdown ` block closes it early and the rest of the unit is parsed as
 * Markdown. That is a real bug this file has already met; the checker only
 * catches it if it agrees with this module about where a block ends.
 */
export const FENCE = /^ {0,3}(`{3,}|~{3,})(.*)$/;

/** An ATX heading of exactly level two, at the start of a line. */
const H2 = /^ {0,3}##(?!#)\s*(.+?)\s*#*\s*$/;

/**
 * Raise every heading of a lesson body by one level.
 *
 * Inside a unit file a class is a `##` and its sections are `###`, because the
 * whole unit is one document. Published, a class is a page of its own: its
 * title becomes the `h1`, and its sections would land on `h3` with no `h2`
 * between them — a document that skips a level and starts halfway down the
 * type scale, so every section looks like a subsection. Promoting them puts
 * the sections back on `h2` and their subsections on `h3`.
 *
 * `#` and `##` are left alone: a lesson body has no `##` (that is where it was
 * cut) and promoting one would make a second `h1`. Fenced code is never
 * touched — a unit shows an example `CLAUDE.md`, headings and all.
 */
export function promoteHeadings(body) {
  let fence;
  return body
    .split(/\r?\n/)
    .map((line) => {
      const fenceMatch = FENCE.exec(line);
      if (fenceMatch) {
        const [, marker, rest] = fenceMatch;
        if (!fence) fence = marker;
        else if (
          marker[0] === fence[0] &&
          marker.length >= fence.length &&
          rest.trim() === ""
        ) {
          fence = undefined;
        }
        return line;
      }
      if (fence) return line;
      return line.replace(/^( {0,3})(#{3,6})(\s)/, (_, indent, hashes, space) =>
        indent + hashes.slice(1) + space
      );
    })
    .join("\n");
}

/**
 * `Sesión` and `Session` give `sesion-7` and `session-7`. The word comes from
 * the heading itself, so a unit written in English needs no extra flag.
 */
function lessonSlug(word, number) {
  const stem = word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return `${stem}-${number}`;
}

/**
 * Cut the body at every top-level `##`, ignoring the ones inside fenced code.
 * A unit shows an example `CLAUDE.md` as a fenced block, headings included, and
 * splitting there would tear a lesson in half.
 */
function blocks(body) {
  const lines = body.split(/\r?\n/);
  const found = [];
  let current = { heading: undefined, line: 0, lines: [] };
  let fence;

  lines.forEach((line, index) => {
    const fenceMatch = FENCE.exec(line);
    if (fenceMatch) {
      const [, marker, rest] = fenceMatch;
      if (!fence) {
        // An info string ("```markdown") only ever opens a block.
        fence = marker[0].repeat(marker.length);
      } else if (marker[0] === fence[0] && marker.length >= fence.length && rest.trim() === "") {
        fence = undefined;
      }
      current.lines.push(line);
      return;
    }

    const heading = fence ? null : H2.exec(line);
    if (heading) {
      found.push(current);
      current = { heading: heading[1], line: index + 1, lines: [] };
      return;
    }

    current.lines.push(line);
  });

  found.push(current);
  return found;
}

/**
 * A block whose body is nothing but thematic breaks carries no content. The
 * week dividers are written with a rule under them, and a rule is punctuation.
 */
const isEmpty = (block) =>
  block.lines.every(
    (line) => line.trim() === "" || /^ {0,3}([-*_])(\s*\1){2,}\s*$/.test(line)
  );

/** The block as it was written, heading included, for the pages that keep it. */
const source = (block) =>
  (block.heading ? `## ${block.heading}\n` : "") + block.lines.join("\n");

/**
 * @returns {{
 *   intro: string,
 *   lessons: Array<{ number: number, title: string, slug: string, group?: string, body: string, line: number }>,
 *   recap: { title: string, body: string } | undefined,
 *   strays: Array<{ heading: string, line: number }>
 * }}
 */
export function splitUnit(body) {
  const parsed = blocks(body);

  const intro = [];
  const lessons = [];
  const trailing = [];
  const strays = [];
  let group;

  for (const block of parsed) {
    const heading = block.heading;

    if (heading === undefined) {
      // Whatever sits between the frontmatter and the first heading.
      if (!isEmpty(block)) intro.push(block.lines.join("\n"));
      continue;
    }

    const groupMatch = GROUP.exec(heading);
    if (groupMatch) {
      // A divider with a body of its own would lose that body here, so it is
      // reported rather than dropped.
      if (!isEmpty(block)) strays.push({ heading, line: block.line });
      group = heading;
      continue;
    }

    const lessonMatch = LESSON.exec(heading);
    if (lessonMatch) {
      const [, word, number, title] = lessonMatch;
      // A heading found after a lesson but before the next one belongs to that
      // lesson's page, not to the recap: flush what was held back.
      for (const held of trailing) strays.push({ heading: held.heading, line: held.line });
      trailing.length = 0;
      lessons.push({
        number: Number(number),
        title,
        slug: lessonSlug(word, number),
        group,
        body: block.lines.join("\n").trim(),
        line: block.line
      });
      continue;
    }

    if (lessons.length === 0) {
      intro.push(source(block));
      continue;
    }

    // Held: it is the recap only if no further lesson follows it.
    trailing.push(block);
  }

  // What closes a unit — "Lo que debes recordar" — is the sheet a student reads
  // before an exam, so it is published like a lesson: its own title, its own
  // page. Its heading is dropped from the body for the same reason a lesson's
  // is, and any further trailing section keeps its heading inside it.
  const [closing, ...rest] = trailing;
  const recap = closing
    ? {
        title: closing.heading,
        body: [closing.lines.join("\n"), ...rest.map(source)].join("\n").trim()
      }
    : undefined;

  return { intro: intro.join("\n").trim(), lessons, recap, strays };
}

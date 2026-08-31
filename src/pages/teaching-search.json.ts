import type { APIRoute } from "astro";
import { render } from "astro:content";

import { publishedCourses } from "@/data/teaching";
import {
  getUnits,
  getLessons,
  lessonLabel,
  lessonPath,
  unitLabel,
  unitPath
} from "@/data/units";

/**
 * The search index for the teaching material.
 *
 * The site serves no server, so searching happens in the reader's browser over
 * this file. It is fetched only when someone actually types in the box, which
 * is why it is a separate request rather than markup inside every page.
 *
 * Keys are short because the whole file travels: `t` title, `u` url, `l` label,
 * `k` kind, `c` course slug, `p` the unit a class belongs to, `h` the class's
 * own section headings joined into one haystack.
 */
interface IndexEntry {
  t: string;
  u: string;
  l: string;
  k: "unit" | "lesson" | "recap";
  c: string;
  p?: string;
  h?: string;
}

export const GET: APIRoute = async () => {
  const published = new Set(publishedCourses.map((course) => course.slug));
  const [units, lessons] = await Promise.all([getUnits(), getLessons()]);
  const visibleUnits = units.filter((unit) => published.has(unit.courseSlug));
  const unitById = new Map(visibleUnits.map((unit) => [unit.entry.id, unit]));

  const entries: IndexEntry[] = [];

  for (const unit of visibleUnits) {
    entries.push({
      t: unit.entry.data.title,
      u: unitPath(unit),
      l: unitLabel(unit),
      k: "unit",
      c: unit.courseSlug,
      h: unit.entry.data.summary
    });
  }

  for (const lesson of lessons) {
    const unit = unitById.get(lesson.unitId);
    if (!unit) continue;
    // The section headings are what makes a class findable by what is inside
    // it — "especificidad" lives under session 3, not in its title.
    const { headings } = await render(lesson.entry);
    entries.push({
      t: lesson.entry.data.title,
      u: lessonPath(lesson),
      l: lessonLabel(lesson),
      k: lesson.entry.data.role,
      c: lesson.courseSlug,
      p: unit.entry.data.title,
      h: headings
        .filter((heading) => heading.depth === 3)
        .map((heading) => heading.text)
        .join(" · ")
    });
  }

  return new Response(JSON.stringify(entries), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
};

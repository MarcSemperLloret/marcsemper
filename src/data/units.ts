import { getCollection, type CollectionEntry } from "astro:content";

import {
  publishedCourses,
  teachingCourses,
  type TeachingCourse
} from "@/data/teaching";

/**
 * Teaching material, as the site publishes it.
 *
 * A unit is one Markdown file; a lesson is one of the `## Sesión N · Título`
 * blocks inside it, split out by the content loader so that each class has its
 * own page and its own URL. Neither is authored twice: both collections are
 * derived from the same file.
 */

export type UnitEntry = CollectionEntry<"units">;
export type LessonEntry = CollectionEntry<"lessons">;

export interface Unit {
  entry: UnitEntry;
  /** Course slug, taken from the containing folder. */
  courseSlug: string;
  /** Unit slug, taken from the file name. */
  unitSlug: string;
  lang: "es" | "en";
}

export interface Lesson {
  entry: LessonEntry;
  courseSlug: string;
  /** Entry id of the unit this lesson belongs to. */
  unitId: string;
  /** The unit's own slug, which is the URL segment above the lesson. */
  unitSlug: string;
  slug: string;
  lang: "es" | "en";
}

function toUnit(entry: UnitEntry): Unit {
  return {
    entry,
    courseSlug: entry.data.course,
    unitSlug: entry.data.slug,
    lang: entry.data.lang
  };
}

function toLesson(entry: LessonEntry): Lesson {
  return {
    entry,
    courseSlug: entry.data.course,
    unitId: entry.data.unit,
    unitSlug: entry.data.unit.split("/").pop() ?? entry.data.unit,
    slug: entry.data.slug,
    lang: entry.data.lang
  };
}

/**
 * A unit's folder names its course and its `section` names a block inside it,
 * and neither is checked by the schema: both are just strings. A typo in either
 * used to fail quietly — the unit dropped out of its block and reappeared under
 * "Other units", or lost its page altogether — so it is checked here, once, and
 * loudly. This runs on every build and on every dev request.
 */
function assertUnitsArePlaced(units: Unit[]): void {
  const problems: string[] = [];

  for (const unit of units) {
    const course = teachingCourses.find(
      (candidate) => candidate.slug === unit.courseSlug
    );
    if (!course) {
      problems.push(
        `${unit.entry.id}: no course "${unit.courseSlug}" is declared in src/data/teaching.ts`
      );
      continue;
    }
    const section = unit.entry.data.section;
    if (section && !course.sections.some((block) => block.id === section)) {
      const declared = course.sections.map((block) => block.id).join(", ");
      problems.push(
        `${unit.entry.id}: section "${section}" is not one of ${course.slug}'s blocks (${declared || "none declared"})`
      );
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Teaching material does not match the courses it declares:\n  ${problems.join("\n  ")}`
    );
  }
}

/** Every published unit, ordered by course and then by `order`. */
export async function getUnits(): Promise<Unit[]> {
  const entries = await getCollection("units", ({ data }) => !data.draft);
  const units = entries
    .map(toUnit)
    .sort(
      (a, b) =>
        a.courseSlug.localeCompare(b.courseSlug) ||
        a.entry.data.order - b.entry.data.order
    );
  assertUnitsArePlaced(units);
  return units;
}

/** Every published lesson, ordered by unit and then by position inside it. */
export async function getLessons(): Promise<Lesson[]> {
  const entries = await getCollection("lessons", ({ data }) => !data.draft);
  return entries
    .map(toLesson)
    .sort(
      (a, b) =>
        a.unitId.localeCompare(b.unitId) || a.entry.data.order - b.entry.data.order
    );
}

export async function getCourseUnits(courseSlug: string): Promise<Unit[]> {
  return (await getUnits()).filter((unit) => unit.courseSlug === courseSlug);
}

/** Units belonging to a course, from an already-loaded list. */
export function unitsOfCourse(units: Unit[], courseSlug: string): Unit[] {
  return units.filter((unit) => unit.courseSlug === courseSlug);
}

/** The lessons of one unit, in teaching order, from an already-loaded list. */
export function lessonsOfUnit(lessons: Lesson[], unitId: string): Lesson[] {
  return lessons.filter((lesson) => lesson.unitId === unitId);
}

export const unitId = (unit: Unit): string => unit.entry.id;

/**
 * A unit is published under the language it is written in, because teaching
 * material is not translated. Both course pages link to that single URL.
 */
export function unitPath(unit: Unit): string {
  const base = unit.lang === "es" ? "/es/docencia" : "/teaching";
  return `${base}/${unit.courseSlug}/${unit.unitSlug}/`;
}

export function lessonPath(lesson: Lesson): string {
  const base = lesson.lang === "es" ? "/es/docencia" : "/teaching";
  return `${base}/${lesson.courseSlug}/${lesson.unitSlug}/${lesson.slug}/`;
}

export function unitLabel(unit: Unit): string {
  return unit.entry.data.label ?? unit.entry.data.title;
}

/**
 * How a lesson is named in a list: "Sesión 7" for a class, and its own title
 * for the section that closes the unit.
 */
export function lessonLabel(lesson: Lesson): string {
  const { role, number, lang } = lesson.entry.data;
  if (role !== "lesson" || number === undefined) return lesson.entry.data.title;
  return `${lang === "es" ? "Sesión" : "Session"} ${number}`;
}

/**
 * Lessons split into the `## Semana N · …` blocks the unit declares, in order.
 * A unit with no dividers comes back as a single unnamed run, so a caller can
 * render both shapes without asking which one it has.
 */
export function lessonGroups(
  lessons: Lesson[]
): Array<{ group?: string; lessons: Lesson[] }> {
  const groups: Array<{ group?: string; lessons: Lesson[] }> = [];
  for (const lesson of lessons) {
    const group = lesson.entry.data.group;
    const last = groups.at(-1);
    if (last && last.group === group) last.lessons.push(lesson);
    else groups.push({ group, lessons: [lesson] });
  }
  return groups;
}

/**
 * The number of classes a course teaches, counted from the units themselves.
 * `lessonCount` is written by the loader from the file it split, so the figure
 * cannot drift from the material the way a hand-written total does.
 */
export function courseTotalLessons(units: Unit[]): number {
  return units.reduce((total, unit) => total + unit.entry.data.lessonCount, 0);
}

/**
 * The most recent date declared by a course's units, so a course card can show
 * when its material last changed without maintaining the date by hand.
 */
export function latestUnitDate(units: Unit[]): string | undefined {
  const dates = units
    .map((unit) => unit.entry.data.date)
    .filter((date): date is string => Boolean(date))
    .sort();
  return dates.at(-1);
}

/**
 * The routes of both languages are built from the same two functions, so the
 * English and the Spanish page differ only in the language they ask for. What a
 * unit page or a lesson page IS lives in its layout, once.
 */
const courseOf = (slug: string): TeachingCourse | undefined =>
  publishedCourses.find((course) => course.slug === slug);

export async function unitRoutes(lang: "es" | "en") {
  const [units, lessons] = await Promise.all([getUnits(), getLessons()]);
  return units.flatMap((unit) => {
    const course = courseOf(unit.courseSlug);
    // A unit whose course is not published, or is written in the other
    // language, has no page here.
    if (!course || unit.lang !== lang) return [];
    return [
      {
        params: { course: unit.courseSlug, unit: unit.unitSlug },
        props: { unit, course, lessons: lessonsOfUnit(lessons, unit.entry.id) }
      }
    ];
  });
}

export async function lessonRoutes(lang: "es" | "en") {
  const [units, lessons] = await Promise.all([getUnits(), getLessons()]);
  return lessons.flatMap((lesson) => {
    const course = courseOf(lesson.courseSlug);
    const unit = units.find((candidate) => candidate.entry.id === lesson.unitId);
    if (!course || !unit || lesson.lang !== lang) return [];
    return [
      {
        params: {
          course: lesson.courseSlug,
          unit: lesson.unitSlug,
          lesson: lesson.slug
        },
        props: {
          lesson,
          unit,
          course,
          siblings: lessonsOfUnit(lessons, lesson.unitId)
        }
      }
    ];
  });
}

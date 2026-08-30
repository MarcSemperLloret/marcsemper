import { getCollection, type CollectionEntry } from "astro:content";

export type SessionEntry = CollectionEntry<"sessions">;

export interface Session {
  entry: SessionEntry;
  /** Course slug, taken from the containing folder. */
  courseSlug: string;
  /** Session slug, taken from the file name. */
  sessionSlug: string;
  lang: "es" | "en";
}

function toSession(entry: SessionEntry): Session {
  const segments = entry.id.split("/");
  const sessionSlug = segments.pop() ?? entry.id;
  return {
    entry,
    courseSlug: segments.join("/"),
    sessionSlug,
    lang: entry.data.lang
  };
}

/** Every published session, ordered by course and then by `order`. */
export async function getSessions(): Promise<Session[]> {
  const entries = await getCollection("sessions", ({ data }) => !data.draft);
  return entries
    .map(toSession)
    .sort(
      (a, b) =>
        a.courseSlug.localeCompare(b.courseSlug) ||
        a.entry.data.order - b.entry.data.order
    );
}

export async function getCourseSessions(courseSlug: string): Promise<Session[]> {
  const sessions = await getSessions();
  return sessions.filter((session) => session.courseSlug === courseSlug);
}

/**
 * A session is published under the language it is written in, because teaching
 * material is not translated. Both course pages link to that single URL.
 */
export function sessionPath(session: Session): string {
  return session.lang === "es"
    ? `/es/docencia/${session.courseSlug}/${session.sessionSlug}/`
    : `/teaching/${session.courseSlug}/${session.sessionSlug}/`;
}

/** Sessions belonging to a course, from an already-loaded list. */
export function sessionsOfCourse(
  sessions: Session[],
  courseSlug: string
): Session[] {
  return sessions.filter((session) => session.courseSlug === courseSlug);
}

/**
 * The most recent date declared by a course's sessions, so a course card can
 * show when its material last changed without maintaining the date by hand.
 */
export function latestSessionDate(sessions: Session[]): string | undefined {
  const dates = sessions
    .map((session) => session.entry.data.date)
    .filter((date): date is string => Boolean(date))
    .sort();
  return dates.at(-1);
}

export function sessionLabel(session: Session): string {
  return session.entry.data.label ?? session.entry.data.title;
}

/**
 * Sum the number of teaching sessions declared across a course's units.
 * Parses the "X sesiones" count from each unit's duration field.
 */
export function courseTotalSessions(sessions: Session[]): number {
  return sessions.reduce((total, session) => {
    const duration = session.entry.data.duration ?? "";
    const match = duration.match(/(\d+)\s+sesi/i);
    return total + (match ? parseInt(match[1], 10) : 1);
  }, 0);
}

/**
 * One `##` section of a session, as reported by the `session-parts` build
 * plugin through `remarkPluginFrontmatter`.
 */
export interface SessionOutlineItem {
  text: string;
  /** A heading that only labels the sections after it, such as "Semana 2 · …". */
  group: boolean;
  /** Position among the collapsible sections, matching their `data-part`. */
  part?: number;
}

export interface SessionOutlineEntry extends SessionOutlineItem {
  slug: string;
  /** Leading label of a "Sesión 3 · Título" heading, when there is one. */
  kicker?: string;
  /** The heading without its kicker, so the rail can set the two apart. */
  title: string;
  /** `###` headings inside the section, listed while the section is open. */
  children: Array<{ slug: string; text: string }>;
}

/**
 * A heading reads as "Sesión 3 · El laberinto de las rutas relativas": a short
 * label and a title. The rail shows them on two lines, so they are split here.
 * Headings without that shape ("Lo que debes recordar") keep their full text.
 */
function splitHeading(text: string): { kicker?: string; title: string } {
  const separator = text.indexOf(" · ");
  if (separator < 0) return { title: text };
  const kicker = text.slice(0, separator);
  if (kicker.split(/\s+/).length > 3) return { title: text };
  return { kicker, title: text.slice(separator + 3) };
}

/**
 * Join the outline reported by the build plugin with the heading slugs Astro
 * collected, so links in the rail and `data-part` on the accordion agree. Both
 * lists are in document order, which is what pairs them.
 */
export function sessionOutline(
  headings: Array<{ depth: number; slug: string; text: string }>,
  items: unknown
): SessionOutlineEntry[] {
  // `remarkPluginFrontmatter` carries no types, and the build plugin is its
  // only producer, so the shape is asserted once here rather than at each page.
  if (!Array.isArray(items) || items.length === 0) return [];
  const outline = items as SessionOutlineItem[];

  const entries: SessionOutlineEntry[] = [];
  let current: SessionOutlineEntry | undefined;
  let index = 0;

  for (const heading of headings) {
    if (heading.depth === 2) {
      const item = outline[index];
      index += 1;
      if (!item) break;
      current = { ...item, ...splitHeading(heading.text), slug: heading.slug, children: [] };
      entries.push(current);
    } else if (heading.depth === 3 && current && !current.group) {
      current.children.push({ slug: heading.slug, text: heading.text });
    }
  }

  return entries;
}

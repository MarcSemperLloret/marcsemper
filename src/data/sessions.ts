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

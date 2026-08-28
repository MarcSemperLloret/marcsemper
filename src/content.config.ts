import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/**
 * Teaching sessions written as Markdown.
 *
 * One file per session, stored as
 * `src/content/sessions/<course-slug>/<session-slug>.md`. The course and the
 * session slug are derived from that path, so they cannot drift from the
 * course declared in `src/data/teaching.ts`.
 *
 * A session is rendered at the route matching its own `lang`, because teaching
 * material is published in the language it is taught in and is not translated.
 */
const sessions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/sessions" }),
  schema: z.object({
    title: z.string(),
    /** Short label used in listings, e.g. "UD1 · Sesión 1". */
    label: z.string().optional(),
    /** Id of the section in `teaching.ts` this session belongs to. */
    section: z.string().optional(),
    /** Position within the course, ascending. */
    order: z.number(),
    lang: z.enum(["es", "en"]).default("es"),
    summary: z.string(),
    duration: z.string().optional(),
    modality: z.string().optional(),
    deliverable: z.string().optional(),
    /** ISO date the session was published or last revised. */
    date: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { sessions };

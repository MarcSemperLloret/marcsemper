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
    /**
     * What the student will be able to do once the session is finished.
     * Written from the student's point of view, not as a list of contents.
     */
    outcomes: z.array(z.string()).default([]),
    /** Tools that have to be installed and ready before the session starts. */
    requirements: z.array(z.string()).default([]),
    /** Skills the session takes for granted, from earlier sessions or modules. */
    priorKnowledge: z.array(z.string()).default([]),
    /** ISO date the session was published or last revised. */
    date: z.string().optional(),
    draft: z.boolean().default(false)
  })
});

/**
 * Blog posts written as Markdown or MDX.
 *
 * One file per post, stored under `src/content/posts/<post-slug>.md`.
 */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    /** Optional compact or targeted SEO title for the <title> tag. */
    seoTitle: z.string().optional(),
    description: z.string(),
    /** ISO date the post was published, e.g. "2026-08-28". */
    date: z.string(),
    /** ISO date of the last revision if applicable. */
    updatedDate: z.string().optional(),
    lang: z.enum(["es", "en"]).default("es"),
    tags: z.array(z.string()).default([]),
    author: z.string().default("Marc Semper Lloret"),
    draft: z.boolean().default(false),
    image: z.string().optional()
  })
});

export const collections = { sessions, posts };

import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

import { unitLoader, lessonLoader } from "../plugins/unit-loader.mjs";

const SESSIONS = "./src/content/sessions";

/**
 * Teaching units, written as Markdown.
 *
 * One file per unit, stored as
 * `src/content/sessions/<course-slug>/<unit-slug>.md`. The course and the unit
 * slug are derived from that path, so they cannot drift from the course
 * declared in `src/data/teaching.ts`.
 *
 * A unit is published at the route matching its own `lang`, because teaching
 * material is published in the language it is taught in and is not translated.
 */
const units = defineCollection({
  loader: unitLoader({ base: SESSIONS }),
  schema: z.object({
    title: z.string(),
    /** Short label used in listings, e.g. "UD1 · Guía y taller práctico". */
    label: z.string().optional(),
    /** Id of the section in `teaching.ts` this unit belongs to. */
    section: z.string().optional(),
    /** Position within the course, ascending. */
    order: z.number(),
    lang: z.enum(["es", "en"]).default("es"),
    summary: z.string(),
    duration: z.string().optional(),
    modality: z.string().optional(),
    deliverable: z.string().optional(),
    /**
     * What the student will be able to do once the unit is finished. Written
     * from the student's point of view, not as a list of contents.
     */
    outcomes: z.array(z.string()).default([]),
    /** Tools that have to be installed and ready before the unit starts. */
    requirements: z.array(z.string()).default([]),
    /** Skills the unit takes for granted, from earlier units or modules. */
    priorKnowledge: z.array(z.string()).default([]),
    /** ISO date the unit was published or last revised. */
    date: z.string().optional(),
    draft: z.boolean().default(false),
    /** Course and unit slugs, both read from the file's path by the loader. */
    course: z.string(),
    slug: z.string(),
    /** How many classes the file declares, counted rather than written by hand. */
    lessonCount: z.number(),
    /** Whether the file says anything before its first class. */
    hasIntro: z.boolean()
  })
});

/**
 * The individual pages of a unit, derived from it by the loader rather than
 * authored separately: one per `## Sesión N · Título` block, plus the section
 * that closes the unit. Nothing here is written by hand — editing a class means
 * editing its unit file.
 */
const lessons = defineCollection({
  loader: lessonLoader({ base: SESSIONS }),
  schema: z.object({
    /** A class, or the recap that closes the unit. */
    role: z.enum(["lesson", "recap"]),
    title: z.string(),
    /** The number in "Sesión 7"; the recap has none. */
    number: z.number().optional(),
    /** The `## Semana 3 · …` divider this class sits under, when there is one. */
    group: z.string().optional(),
    /** Position within the unit, ascending, with the recap last. */
    order: z.number(),
    /** Entry id of the unit this page belongs to, e.g. "digitalizacion/ud3-cloud". */
    unit: z.string(),
    course: z.string(),
    slug: z.string(),
    lang: z.enum(["es", "en"]).default("es"),
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

export const collections = { units, lessons, posts };

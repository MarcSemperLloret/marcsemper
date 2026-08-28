# Marc Semper Lloret — academic portfolio

Static academic website built with Astro. The site is designed to establish a
canonical research identity, make publications independently discoverable and
provide clear metadata for search engines and scholarly indexes.

Requires Node.js 22.12 or newer.
If your version manager supports `.nvmrc` or `.node-version`, run `nvm use`
or the equivalent before installing dependencies.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Publication metadata lives in `src/data/publications.ts`. Update that single
file to change the English and Spanish archives, individual pages, related
work, BibTeX output, RSS, LLM context files and CV.

Site identity, the last significant update date and the bilingual research-area
content live in `src/data/site.ts`.

Teaching material for students lives in `src/data/teaching.ts`.

## Publishing teaching material

`src/data/teaching.ts` holds the courses shown at `/teaching/` and
`/es/docencia/`. The array is empty until material is released; both pages then
show an explicit empty state instead of a course list.

To publish a course:

1. Add one entry to `teachingCourses`. Every visible field has an English and a
   Spanish variant, so both language versions stay aligned. A commented example
   entry sits above the array.
2. Put downloadable files under `public/teaching/<course-slug>/` and link them
   with a root-relative `href`. External links (campus virtual, course guide)
   are detected automatically and opened in a new tab.
3. Run `npm run build`. The course card, its English page at
   `/teaching/<slug>/`, its Spanish page at `/es/docencia/<slug>/` and the
   sitemap entries are generated from that single entry.

Each course holds its material in `sections`, which are deliberately generic.
A section can be a teaching unit, but equally `Lab sessions`, `Past exams`,
`Project` or `Further reading`, so subjects with different structures can
coexist without changing the templates. A section with an empty `resources`
array is listed as not yet published, which is the way to announce a unit
before its files exist. Material that belongs to the whole subject rather than
to one section goes in the course-level `resources` array.

Useful optional fields:

- `draft: true` keeps a course out of the site entirely while it is prepared.
- `status: "archived"` moves a past course out of the main list into the
  previous-years archive, and marks its page as archived.
- `updatedAt` drives the "last updated" line on the card and the course page.
- `announcements` renders a short dated list of course notes.
- `date` and `format` on a resource show when it was released and what it is
  (`"PDF · 2.4 MB"`).

This section is supporting material only. Syllabus, assessment criteria and
deadlines remain those published in the official university systems, so link to
the course guide with `officialUrl` rather than restating them here.

## Writing a session

Sessions are full pages of teaching material written in Markdown, as opposed to
`resources`, which are links to files. They live in

```
src/content/sessions/<course-slug>/<session-slug>.md
```

The course and the session slug come from that path, so they cannot drift from
the course declared in `src/data/teaching.ts`. Frontmatter:

| Field | Required | Purpose |
| --- | --- | --- |
| `title` | yes | Page heading and browser title |
| `summary` | yes | Intro paragraph and meta description |
| `order` | yes | Position within the course |
| `label` | no | Short tag in listings, e.g. `UD1 · Sesión 1` |
| `section` | no | Id of the section in `teaching.ts` it belongs to |
| `lang` | no | `es` (default) or `en` |
| `duration`, `modality`, `deliverable` | no | Shown in the fact strip |
| `date` | no | ISO date, shown at the end of the page |
| `draft` | no | `true` keeps the session off the site |

A session is published only under the route for its own `lang`, because
teaching material is written in the language it is taught in and is not
translated. The course page in the other language links to that same URL and
marks the language; a course whose material is entirely in the other language
also shows a notice saying so, so the translated section titles do not imply
translated material. Since a session has no equivalent page in the other
language, it emits no `hreflang`: the header language switcher falls back to
the course page through `languagePath`. A session whose `section` is missing or unknown is listed
under "Other sessions" at the end of the course page.

Two constraints on the Markdown, both from the site's Content-Security-Policy
(`style-src 'self'`), which strips inline `style` attributes:

- Do not use the alignment syntax `| ---: |` in tables. It compiles to an
  inline style. Write the table as HTML and use `class="align-right"` instead
  (`align-left` and `align-center` also exist).
- Syntax highlighting is off in `astro.config.mjs` for the same reason. Fenced
  code blocks render as plain `<pre>`, which suits ASCII process diagrams.

## Writing a blog post

Blog posts live in:

```
src/content/posts/<post-slug>.md
```

To create a new post, create a `.md` (or `.mdx`) file inside `src/content/posts/` with the following frontmatter:

```yaml
---
title: "Título de la entrada"
description: "Resumen breve que aparecerá en el listado y en los metadatos SEO."
date: "2026-08-28"
lang: "es" # "es" o "en"
tags:
  - "Inteligencia Artificial"
  - "Investigación"
draft: false # true para mantenerla oculta mientras se redacta
---
```

Frontmatter fields:

| Field | Required | Purpose |
| --- | --- | --- |
| `title` | yes | Page heading, browser title and RSS headline |
| `description` | yes | Intro summary and meta description |
| `date` | yes | ISO publication date (`YYYY-MM-DD`) used for ordering |
| `updatedDate` | no | ISO date of last significant revision |
| `lang` | no | `es` (default) or `en` |
| `tags` | no | Array of tags displayed on the post and cards |
| `author` | no | Author name (defaults to Marc Semper Lloret) |
| `draft` | no | `true` keeps the post off the public site |

Posts published in Spanish appear at `/es/blog/<post-slug>/` and in English at `/blog/<post-slug>/`. Both language indexes list all posts with language badges.

Start headings at `##`. The `#` level is reserved for the page title generated
from `title`. For blank numbered lines students write on, use
`<ol class="fill-in">` with empty `<li>` items.

### Diagrams

Do not draw diagrams as ASCII art in a code fence. Write them as markup, so
they stay selectable, readable by assistive technology and responsive.

A sequence of steps is an ordered list inside a figure:

```html
<figure class="diagram">
  <figcaption>What the diagram shows</figcaption>
  <ol class="flow">
    <li>First step</li>
    <li>Second step</li>
  </ol>
</figure>
```

`flow` renders a numbered vertical timeline. Modifiers: `flow--before` mutes a
process being replaced, `flow--row` lays a short chain out horizontally, and
`flow--chain` is the emphasised serif variant. A step can carry a marker with
`<span class="tag tag--it">IT</span>` or `tag--ot`.

Anything that branches is inline SVG with a `viewBox`, a `<title>` and a
`<desc>`, using the `diagram-svg`, `diagram-edges` and `diagram-node` classes
(`diagram-node--accent`, `diagram-node--data`) so it follows the site palette.
Style it from `global.css` only: an inline `style` attribute is dropped by the
Content-Security-Policy.

One Markdown trap: a blank line inside a raw HTML block ends that block, and
the indented lines that follow are then parsed as a code block. Keep multi-line
HTML such as an SVG free of blank lines.

## Updating the publication archive

The public archive intentionally contains only articles formally published in
peer-reviewed journals. Do not add preprints, working papers or conference
proceedings.

For each new journal article:

1. Verify the definitive bibliographic record on the journal website through
   its DOI.
2. Add one entry to `src/data/publications.ts`, including the DOI, journal,
   online publication date, volume year, issue or article number, original
   author overview, bilingual summaries and explicit related slugs.
3. Update `site.lastUpdated` in `src/data/site.ts` after a significant content,
   structured-data or link change. This date records when the academic
   publication record was last verified, and drives the CV and the review date
   on the archives.
4. Update the fixed `lastmod` date in `astro.config.mjs`. This one is the
   site-wide content date used by the sitemap and is deliberately separate: it
   moves whenever pages change, including teaching material, even if the
   publication record was not re-verified.
5. Run `npm run build`. The archives, article pages, RSS feed, sitemap, BibTeX,
   LLM context files and web CV will update automatically.

The DOI is the canonical external link. Repository manuscripts may be added as
an optional secondary link, but they do not replace or duplicate the journal
record.

The canonical production URL is configured as
`https://marcsemperlloret.com`. Change `site` in `astro.config.mjs`,
`src/data/site.ts`, `public/CNAME` and `public/robots.txt` if the final domain
changes.

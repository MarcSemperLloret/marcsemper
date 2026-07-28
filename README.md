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
   structured-data or link change.
4. Update the fixed `lastmod` date in `astro.config.mjs` to the same verified
   date.
5. Run `npm run build`. The archives, article pages, RSS feed, sitemap, BibTeX,
   LLM context files and web CV will update automatically.

The DOI is the canonical external link. Repository manuscripts may be added as
an optional secondary link, but they do not replace or duplicate the journal
record.

The canonical production URL is configured as
`https://marcsemperlloret.com`. Change `site` in `astro.config.mjs`,
`src/data/site.ts`, `public/CNAME` and `public/robots.txt` if the final domain
changes.

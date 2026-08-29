import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://marcsemperlloret.com",
  integrations: [
    sitemap({
      // Site-wide content date. It tracks changes to the pages themselves and
      // is deliberately separate from `site.lastUpdated`, which records when
      // the academic publication record was last verified.
      lastmod: new Date("2026-08-29")
    })
  ],
  markdown: {
    // Shiki emits inline style attributes, which the site's Content-Security-Policy
    // (style-src 'self') blocks. Session code blocks are ASCII process diagrams,
    // so plain <pre><code> styled from global.css is what we want anyway.
    syntaxHighlight: false
  },
  build: {
    format: "directory",
    inlineStylesheets: "never"
  }
});

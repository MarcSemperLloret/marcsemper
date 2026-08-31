import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";

import { tableAlignment } from "./plugins/table-alignment.mjs";

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
    // Prism, not Shiki: Shiki colours each token with an inline style attribute
    // and the site's Content-Security-Policy (style-src 'self') drops it, so the
    // code would come out unstyled. Prism emits classes instead, which are
    // themed from global.css like everything else.
    syntaxHighlight: "prism",
    processor: satteri({
      // Units are split into one page per class by the content loader, so
      // nothing here has to fold a long document into an accordion.
      hastPlugins: [tableAlignment()]
    })
  },
  build: {
    format: "directory",
    inlineStylesheets: "never"
  }
});

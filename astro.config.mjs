import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { satteri } from "@astrojs/markdown-satteri";

import { tableAlignment } from "./plugins/table-alignment.mjs";

export default defineConfig({
  site: "https://marcsemperlloret.com",
  integrations: [
    sitemap({
      // Site-wide content date, deliberately separate from `site.lastUpdated`,
      // which records when the academic publication record was last verified.
      //
      // It is the build time rather than a written date. A written one has to be
      // remembered on every content change, and when it is not, the sitemap tells
      // crawlers that nothing has changed since whatever day it was last edited —
      // the opposite of what it is there for. Every deploy rebuilds the whole
      // site, so the build time is a claim the site can actually keep.
      lastmod: new Date()
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

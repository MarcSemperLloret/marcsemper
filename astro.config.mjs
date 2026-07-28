import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://marcsemperlloret.com",
  integrations: [
    sitemap({
      lastmod: new Date("2026-07-29")
    })
  ],
  build: {
    format: "directory",
    inlineStylesheets: "never"
  }
});

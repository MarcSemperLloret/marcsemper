import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://marcsemperlloret.com",
  integrations: [
    sitemap({
      lastmod: new Date("2026-08-14")
    })
  ],
  build: {
    format: "directory",
    inlineStylesheets: "never"
  }
});

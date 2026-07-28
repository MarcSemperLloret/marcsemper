import type { APIRoute } from "astro";
import { publications } from "@/data/publications";
import { site } from "@/data/site";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = () => {
  const items = publications
    .map(
      (publication) => `
    <item>
      <title>${escapeXml(publication.title)}</title>
      <link>${site.url}/publications/${publication.slug}/</link>
      <guid isPermaLink="true">${site.url}/publications/${publication.slug}/</guid>
      <pubDate>${new Date(`${publication.onlineDate}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(publication.plainSummary ?? publication.abstract ?? "")}</description>
    </item>`
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${site.name} — Publications</title>
    <link>${site.url}/publications/</link>
    <description>${escapeXml(site.shortDescription)}</description>
    <language>en</language>${items}
  </channel>
</rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8"
      }
    }
  );
};

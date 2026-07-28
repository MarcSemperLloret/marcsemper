import type { APIRoute } from "astro";
import { publications } from "@/data/publications";
import { researchAreas, site } from "@/data/site";

export const GET: APIRoute = () => {
  const research = researchAreas
    .map(
      (area) =>
        `- ${area.title}: ${site.url}/research/${area.slug}/ — ${area.description}`
    )
    .join("\n");

  const publicationList = publications
    .map((publication) => {
      const distinctive = [
        ...(publication.models ?? []),
        ...(publication.dataSources ?? [])
      ].join("; ");
      return `- ${publication.title} (${publication.year}). DOI: https://doi.org/${publication.doi}\n  ${publication.plainSummary}\n  Models/data: ${distinctive}\n  Overview: ${site.url}/publications/${publication.slug}/`;
    })
    .join("\n");

  const text = `# Marc Semper Lloret

Marc Semper Lloret is a researcher and associate lecturer at the University of Alicante. He publishes scientific work as Marc Semper.

Canonical profile: ${site.url}/
ORCID: ${site.profiles.orcid}
Google Scholar: ${site.profiles.scholar}
University profile: ${site.profiles.university}
RUA repository: ${site.profiles.rua}

## Research areas

${research}

## Publications

${publicationList}

## Thesis and CV

- Doctoral thesis: ${site.url}/thesis/
- Curriculum vitae: ${site.url}/cv/
- Spanish-language profile: ${site.url}/es/

For longer author-written summaries, contributions and findings, see ${site.url}/llms-full.txt
`;

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};

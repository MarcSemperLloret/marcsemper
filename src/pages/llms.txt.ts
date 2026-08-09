import type { APIRoute } from "astro";
import { publications } from "@/data/publications";
import { researchAreas, site } from "@/data/site";

export const GET: APIRoute = () => {
  const researchLinks = researchAreas
    .map(
      (area) =>
        `- [${area.title}](${site.url}/research/${area.slug}/): ${area.description}`
    )
    .join("\n");

  const publicationLinks = publications
    .map((pub) => {
      const summary = pub.plainSummary ?? pub.metaDescription;
      return `- [${pub.title}](${site.url}/publications/${pub.slug}/): (${pub.year}, ${pub.venue}). ${summary} DOI: https://doi.org/${pub.doi}`;
    })
    .join("\n");

  const text = `# Marc Semper Lloret

> Researcher in reliable spatiotemporal artificial intelligence, graph neural networks, sensor data quality, and environmental forecasting at the University of Alicante.

## Research Areas

${researchLinks}

## Selected Publications

${publicationLinks}

## Profiles and Full Context

- [Canonical Profile](${site.url}/): Main academic profile page.
- [Spanish Academic Profile](${site.url}/es/): Perfil académico en español.
- [Curriculum Vitae](${site.url}/cv/): Academic appointment, teaching, and research achievements.
- [Doctoral Thesis](${site.url}/thesis/): Spatiotemporal modelling with neural networks for environmental forecasting.
- [Full Research Context](${site.url}/llms-full.txt): Complete author-written summaries, contributions, and key findings for all publications.
- [ORCID Record](${site.profiles.orcid}): Verified academic identity and publication history.
- [Google Scholar Profile](${site.profiles.scholar}): Citation index and scholarly activity.
- [Wikidata Entity](${site.profiles.wikidata}): Knowledge Graph entity record (Q140953650).
- [GitHub Repositories](${site.profiles.github}): Open-source code, benchmarks, and model implementations.
`;

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};

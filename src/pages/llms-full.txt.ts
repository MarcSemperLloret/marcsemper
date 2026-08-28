import type { APIRoute } from "astro";
import { publications } from "@/data/publications";
import { researchAreas, site } from "@/data/site";
import { publishedCourses } from "@/data/teaching";
import { getSessions, sessionPath, sessionsOfCourse } from "@/data/sessions";

export const GET: APIRoute = async () => {
  const sessions = await getSessions();

  const teaching = publishedCourses
    .map((course) => {
      const courseSessions = sessionsOfCourse(sessions, course.slug);
      const sessionLines = courseSessions.length
        ? courseSessions
            .map(
              (session) =>
                `- ${session.entry.data.title} (${session.entry.data.lang}): ${site.url}${sessionPath(session)}
  ${session.entry.data.summary}`
            )
            .join("\n")
        : "- No session material published yet.";

      return `## ${course.title}

URL: ${site.url}/teaching/${course.slug}/
Level: ${course.level}${course.institution ? `, ${course.institution}` : ""}
Academic year: ${course.term}

${course.overview}

Topics: ${course.topics.join("; ")}

Sessions:
${sessionLines}
`;
    })
    .join("\n");

  const research = researchAreas
    .map(
      (area) => `## ${area.title}

URL: ${site.url}/research/${area.slug}/

${area.overview}

Research questions:
${area.questions.map((question) => `- ${question}`).join("\n")}

Methods and topics: ${[...area.methods, ...area.topics].join("; ")}
`
    )
    .join("\n");

  const publicationList = publications
    .map(
      (publication) => `## ${publication.title}

Authors: ${publication.authors.join("; ")}
Journal record: ${publication.venue}, ${publication.year}
Published online: ${publication.onlineDate}
DOI: https://doi.org/${publication.doi}
Canonical overview: ${site.url}/publications/${publication.slug}/

Plain-language summary: ${publication.plainSummary}

Contribution: ${publication.contribution}

Key finding: ${publication.finding}

Models and methods: ${(publication.models ?? []).join("; ")}
Data and evaluation: ${(publication.dataSources ?? []).join("; ")}
Topics: ${publication.topics.join("; ")}
`
    )
    .join("\n");

  const text = `# Marc Semper Lloret — full research context

Marc Semper Lloret is a researcher and associate lecturer in the Department of Computer Science and Artificial Intelligence at the University of Alicante. He is a member of the Network Data Analysis and Visualisation research group (ANVIDA) and publishes scientific work as Marc Semper.

Canonical identity: ${site.url}/
ORCID: ${site.profiles.orcid}
Google Scholar: ${site.profiles.scholar}
Scopus: ${site.profiles.scopus}
Web of Science: ${site.profiles.webOfScience}

# Research programme

${research}

# Publication record

${publicationList}

# Doctoral thesis

Title: Modelado espacio-temporal con redes neuronales para la predicción de fenómenos ambientales
English title: Spatiotemporal modelling with neural networks for forecasting environmental phenomena
Defended: 11 December 2025
Institution: University of Alicante
Canonical overview: ${site.url}/thesis/

# Teaching

Course material published for students. Overview: ${site.url}/teaching/ (Spanish: ${site.url}/es/docencia/). Teaching material is published in the language each subject is taught in and is not translated.

${teaching}
`;

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};

import type { APIRoute } from "astro";
import { publications } from "@/data/publications";
import { researchAreas, site } from "@/data/site";
import { publishedCourses } from "@/data/teaching";
import {
  getUnits,
  getLessons,
  unitsOfCourse,
  lessonsOfUnit,
  unitPath,
  lessonPath
} from "@/data/units";

export const GET: APIRoute = async () => {
  const [units, lessons] = await Promise.all([getUnits(), getLessons()]);

  const teaching = publishedCourses
    .map((course) => {
      const courseUnits = unitsOfCourse(units, course.slug);
      // Every class has its own page, so each one is listed with its URL: this
      // file exists to be read whole, and a unit link alone would hide them.
      const unitLines = courseUnits.length
        ? courseUnits
            .map((unit) => {
              const classes = lessonsOfUnit(lessons, unit.entry.id)
                .map(
                  (lesson) =>
                    `  - ${lesson.entry.data.title}: ${site.url}${lessonPath(lesson)}`
                )
                .join("\n");
              return `- ${unit.entry.data.title} (${unit.entry.data.lang}): ${site.url}${unitPath(unit)}
  ${unit.entry.data.summary}
${classes}`;
            })
            .join("\n")
        : "- No unit material published yet.";

      // Both are optional, so the line is dropped rather than left as an
      // empty label when a course declares neither.
      const level = [course.level, course.institution].filter(Boolean).join(", ");
      const levelLine = level ? `Level: ${level}\n` : "";

      return `## ${course.title}

URL: ${site.url}/teaching/${course.slug}/
${levelLine}Academic year: ${course.term}

${course.overview}

Topics: ${course.topics.join("; ")}

Units and classes:
${unitLines}
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

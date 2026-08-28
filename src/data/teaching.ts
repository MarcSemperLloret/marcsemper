export type TeachingResourceKind =
  | "slides"
  | "notes"
  | "notebook"
  | "exercise"
  | "solution"
  | "exam"
  | "dataset"
  | "code"
  | "reading"
  | "video"
  | "link";

export interface TeachingResource {
  label: string;
  labelEs: string;
  href: string;
  kind: TeachingResourceKind;
  /** Optional one-line explanation shown under the link. */
  description?: string;
  descriptionEs?: string;
  /** ISO date (YYYY-MM-DD) the file was published or last revised. */
  date?: string;
  /** Free-form format hint shown next to the link, e.g. "PDF · 2.4 MB". */
  format?: string;
}

/**
 * A group of material inside a course. Sections are deliberately generic:
 * they can be teaching units ("Unit 01 — Search"), but equally "Lab sessions",
 * "Past exams", "Project" or "Further reading". Each course decides its own
 * grouping, so subjects with very different structures can coexist.
 */
export interface TeachingSection {
  /** Used as the anchor id, so keep it unique within the course. */
  id: string;
  /** Optional index shown next to the title, e.g. "01". */
  number?: string;
  title: string;
  titleEs: string;
  description?: string;
  descriptionEs?: string;
  resources: TeachingResource[];
}

export interface TeachingAnnouncement {
  /** ISO date (YYYY-MM-DD). */
  date: string;
  text: string;
  textEs: string;
}

export interface TeachingCourse {
  slug: string;
  /** Official subject code, if the university assigns one. */
  code?: string;
  title: string;
  titleEs: string;
  level: string;
  levelEs: string;
  /** Teaching centre. Omit while it is not confirmed. */
  institution?: string;
  institutionEs?: string;
  /** Academic year, e.g. "2025/2026". */
  term: string;
  /** "current" courses are listed first; "archived" ones move to past years. */
  status: "current" | "archived";
  /** Draft courses are excluded from the site until this is removed. */
  draft?: boolean;
  summary: string;
  summaryEs: string;
  overview: string;
  overviewEs: string;
  topics: string[];
  topicsEs: string[];
  /** ISO date (YYYY-MM-DD) of the last change to this course's material. */
  updatedAt?: string;
  announcements?: TeachingAnnouncement[];
  /** Material that belongs to the course as a whole, not to one section. */
  resources: TeachingResource[];
  sections: TeachingSection[];
  officialUrl?: string;
}

/**
 * Teaching material published for students.
 *
 * One entry per subject. Adding an entry creates its card in `/teaching/` and
 * `/es/docencia/` plus its own page in both languages, with the sections and
 * files declared here. Every visible field has an English and a Spanish
 * variant so the two versions of the site stay aligned.
 *
 * Put downloadable files under `public/teaching/<course-slug>/` and link them
 * with a root-relative href. External links are detected automatically.
 *
 * Example entry:
 *
 * {
 *   slug: "artificial-intelligence",
 *   code: "34047",
 *   title: "Artificial Intelligence",
 *   titleEs: "Inteligencia Artificial",
 *   level: "Bachelor's degree in Computer Engineering",
 *   levelEs: "Grado en Ingeniería Informática",
 *   institution: "University of Alicante",
 *   institutionEs: "Universidad de Alicante",
 *   term: "2025/2026",
 *   status: "current",
 *   summary: "Search, knowledge representation and machine-learning foundations.",
 *   summaryEs: "Búsqueda, representación del conocimiento y fundamentos de aprendizaje automático.",
 *   overview: "Longer description shown on the course page.",
 *   overviewEs: "Descripción más extensa que se muestra en la página de la asignatura.",
 *   topics: ["Search", "Machine learning"],
 *   topicsEs: ["Búsqueda", "Aprendizaje automático"],
 *   updatedAt: "2026-02-12",
 *   announcements: [
 *     { date: "2026-02-12", text: "Unit 02 slides updated.", textEs: "Diapositivas del tema 02 actualizadas." }
 *   ],
 *   resources: [
 *     { label: "Course guide", labelEs: "Guía docente", href: "https://cvnet.cpd.ua.es/…", kind: "link" }
 *   ],
 *   sections: [
 *     {
 *       id: "unit-01",
 *       number: "01",
 *       title: "Introduction",
 *       titleEs: "Introducción",
 *       resources: [
 *         {
 *           label: "Slides",
 *           labelEs: "Diapositivas",
 *           href: "/teaching/artificial-intelligence/unit-01.pdf",
 *           kind: "slides",
 *           format: "PDF · 2.4 MB",
 *           date: "2026-02-05"
 *         }
 *       ]
 *     },
 *     {
 *       id: "labs",
 *       title: "Lab sessions",
 *       titleEs: "Prácticas",
 *       resources: []
 *     }
 *   ]
 * }
 */
export const teachingCourses: TeachingCourse[] = [
  {
    slug: "digitalizacion",
    title: "Digitalización",
    titleEs: "Digitalización",
    level: "Higher Vocational Training",
    levelEs: "Ciclo Formativo de Grado Superior",
    term: "2026/2027",
    status: "current",
    summary:
      "Digitalisation applied to production systems: data, connectivity, artificial intelligence and cybersecurity in an industrial setting.",
    summaryEs:
      "Digitalización aplicada a los sistemas productivos: datos, conectividad, inteligencia artificial y ciberseguridad en el entorno industrial.",
    overview:
      "A cross-curricular module on how digital technologies change the way production systems are operated and managed. It covers where data comes from, how it travels, how it is analysed and what has to be protected, always tied to decisions taken in a real workplace rather than to the technology in isolation.",
    overviewEs:
      "Módulo transversal sobre cómo las tecnologías digitales cambian la forma de operar y gestionar los sistemas productivos. Recorre de dónde salen los datos, cómo viajan, cómo se analizan y qué hay que proteger, siempre ligado a decisiones de un entorno de trabajo real y no a la tecnología por separado.",
    topics: [
      "Industry 4.0",
      "Data and connectivity",
      "Artificial intelligence",
      "Cybersecurity"
    ],
    topicsEs: [
      "Industria 4.0",
      "Datos y conectividad",
      "Inteligencia artificial",
      "Ciberseguridad"
    ],
    resources: [],
    sections: [
      {
        id: "ud-01",
        number: "UD1",
        title: "Digitalising a company",
        titleEs: "Digitalizar una empresa",
        description:
          "What digitalisation actually changes: process before technology.",
        descriptionEs:
          "Qué cambia realmente al digitalizar: primero el proceso, después la tecnología.",
        resources: []
      },
      {
        id: "ud-02",
        number: "UD2",
        title: "Systems integration and automation",
        titleEs: "Integración y automatización de sistemas",
        description:
          "How separate applications exchange information and react to events.",
        descriptionEs:
          "Cómo intercambian información las aplicaciones y cómo reaccionan a los eventos.",
        resources: []
      },
      {
        id: "ud-03",
        number: "UD3",
        title: "Cloud and modern architectures",
        titleEs: "Cloud y arquitecturas modernas",
        description:
          "Publishing a real application: virtual machine, web server, network rules, DNS and certificates.",
        descriptionEs:
          "Publicar una aplicación real: máquina virtual, servidor web, reglas de red, DNS y certificados.",
        resources: []
      },
      {
        id: "ud-04",
        number: "UD4",
        title: "AI-assisted software development",
        titleEs: "Desarrollo de software asistido por IA",
        description:
          "Directing a coding agent: context, project instructions, skills, tools and verification.",
        descriptionEs:
          "Dirigir un agente de programación: contexto, instrucciones del proyecto, skills, herramientas y verificación.",
        resources: []
      },
      {
        id: "ud-05",
        number: "UD5",
        title: "Data, analytics and decision-making with AI",
        titleEs: "Datos, analítica y toma de decisiones con IA",
        description:
          "From a raw dataset to a decision: exploring, checking quality, analysing with AI and knowing what the data cannot answer.",
        descriptionEs:
          "De un dataset en bruto a una decisión: explorar, comprobar la calidad, analizar con IA y saber qué no pueden responder los datos.",
        resources: [
          {
            label: "Online Retail dataset",
            labelEs: "Dataset Online Retail",
            href: "https://archive.ics.uci.edu/dataset/352/online-retail",
            kind: "dataset",
            description:
              "Real transaction records from a UK online retailer, hosted by the UCI Machine Learning Repository.",
            descriptionEs:
              "Transacciones reales de un comercio electrónico británico, alojadas en el UCI Machine Learning Repository."
          }
        ]
      }
    ]
  },
  {
    slug: "sostenibilidad",
    title: "Sostenibilidad",
    titleEs: "Sostenibilidad",
    level: "Higher Vocational Training",
    levelEs: "Ciclo Formativo de Grado Superior",
    term: "2026/2027",
    status: "current",
    summary:
      "Sustainability applied to the production system: environmental impact, circular economy, energy efficiency and applicable regulation.",
    summaryEs:
      "Sostenibilidad aplicada al sistema productivo: impacto ambiental, economía circular, eficiencia energética y normativa aplicable.",
    overview:
      "A cross-curricular module on the environmental and social consequences of productive activity, and on the criteria used to reduce them. It works from measurable impact to the decisions and regulation that follow, so sustainability is treated as an operating requirement rather than as a declaration of intent.",
    overviewEs:
      "Módulo transversal sobre las consecuencias ambientales y sociales de la actividad productiva y sobre los criterios para reducirlas. Va del impacto medible a las decisiones y la normativa que se derivan, de modo que la sostenibilidad se trate como un requisito de funcionamiento y no como una declaración de intenciones.",
    topics: [
      "Sustainable development goals",
      "Circular economy",
      "Energy efficiency",
      "Environmental regulation"
    ],
    topicsEs: [
      "Objetivos de desarrollo sostenible",
      "Economía circular",
      "Eficiencia energética",
      "Normativa ambiental"
    ],
    resources: [],
    sections: [
      {
        id: "bloc-01",
        number: "01",
        title: "Sustainability and the sustainable development goals",
        titleEs: "Sostenibilidad y objetivos de desarrollo sostenible",
        resources: []
      },
      {
        id: "bloc-02",
        number: "02",
        title: "Environmental impact of productive activity",
        titleEs: "Impacto ambiental de la actividad productiva",
        resources: []
      },
      {
        id: "bloc-03",
        number: "03",
        title: "Circular economy and waste management",
        titleEs: "Economía circular y gestión de residuos",
        resources: []
      },
      {
        id: "bloc-04",
        number: "04",
        title: "Energy efficiency and carbon footprint",
        titleEs: "Eficiencia energética y huella de carbono",
        resources: []
      },
      {
        id: "bloc-05",
        number: "05",
        title: "Regulation and environmental certification",
        titleEs: "Normativa y certificación ambiental",
        resources: []
      }
    ]
  }
];

/** Courses actually shown on the site, in declaration order. */
export const publishedCourses: TeachingCourse[] = teachingCourses.filter(
  (course) => !course.draft
);

export const currentCourses: TeachingCourse[] = publishedCourses.filter(
  (course) => course.status === "current"
);

export const archivedCourses: TeachingCourse[] = publishedCourses.filter(
  (course) => course.status === "archived"
);

const resourceKindLabels: Record<TeachingResourceKind, { en: string; es: string }> = {
  slides: { en: "Slides", es: "Diapositivas" },
  notes: { en: "Notes", es: "Apuntes" },
  notebook: { en: "Notebook", es: "Cuaderno" },
  exercise: { en: "Exercises", es: "Ejercicios" },
  solution: { en: "Solutions", es: "Soluciones" },
  exam: { en: "Past exam", es: "Examen" },
  dataset: { en: "Dataset", es: "Datos" },
  code: { en: "Code", es: "Código" },
  reading: { en: "Reading", es: "Lectura" },
  video: { en: "Video", es: "Vídeo" },
  link: { en: "Link", es: "Enlace" }
};

export function resourceKindLabel(
  kind: TeachingResourceKind,
  lang: "en" | "es"
): string {
  return resourceKindLabels[kind][lang];
}

export function isExternalResource(href: string): boolean {
  return /^https?:\/\//.test(href);
}

/** Total number of files and links published for a course. */
export function courseResourceCount(course: TeachingCourse): number {
  return course.sections.reduce(
    (total, section) => total + section.resources.length,
    course.resources.length
  );
}

export function formatTeachingDate(date: string, lang: "en" | "es"): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(
    lang === "es" ? "es-ES" : "en-GB",
    { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  );
}

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
  /**
   * One verb naming what the student does in this block, e.g. "PUBLICAR".
   * Used by the course route, where the sequence of verbs is the story the
   * blocks tell together. Leave it out and the block is listed without one.
   */
  verb?: string;
  verbEs?: string;
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
  /**
   * Education level the course belongs to, e.g. a degree or a training cycle.
   * Optional on purpose, like `institution`: a module can be taught at more
   * than one level, and pinning one here would tie the material to it.
   */
  level?: string;
  levelEs?: string;
  /**
   * Teaching centre. Optional on purpose: leaving it out keeps a course
   * reusable across the centres where the same module is taught, so an empty
   * value here is a decision rather than a gap waiting to be filled.
   */
  institution?: string;
  institutionEs?: string;
  /** Academic year, e.g. "2025/2026". */
  term: string;
  /** Estimated or official workload, e.g. "~30 hours". */
  hours?: string;
  hoursEs?: string;
  /** "current" courses are listed first; "archived" ones move to past years. */
  status: "current" | "archived";
  /** Draft courses are excluded from the site until this is removed. */
  draft?: boolean;
  summary: string;
  summaryEs: string;
  overview: string;
  overviewEs: string;
  /**
   * What the student will be able to do once the course is over, written as
   * actions rather than as contents. Shown before the syllabus, because a
   * student decides whether a module is worth the effort from these and not
   * from a list of topics.
   */
  outcomes?: string[];
  outcomesEs?: string[];
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
    slug: "desarrollo-web-entorno-servidor",
    title: "Server-side web development",
    titleEs: "Desarrollo web en entorno servidor",
    term: "2026/2027",
    hours: "~156 hours",
    hoursEs: "~156 horas",
    status: "current",
    updatedAt: "2026-08-31",
    summary:
      "Building a complete backend with Java and Spring Boot: from HTTP and server-rendered pages to PostgreSQL, REST APIs, security, integrations and testing.",
    summaryEs:
      "Construcción de un backend completo con Java y Spring Boot: desde HTTP y las páginas renderizadas en servidor hasta PostgreSQL, APIs REST, seguridad, integraciones y testing.",
    overview:
      "A two-term, project-led module built around one application that grows with the class: an issue and project manager with users, projects, issues, comments and tags. It starts as an in-memory list, gains server-rendered views and persistence, is reorganised into professional layers, exposes a REST API, adds authentication and external integrations, and finishes with tests and technical documentation. Guidance is deliberately reduced as the course advances, so the final project is driven by a specification rather than a tutorial.",
    overviewEs:
      "Módulo de dos trimestres articulado alrededor de una única aplicación que crece con la clase: un gestor de proyectos e incidencias con usuarios, proyectos, incidencias, comentarios y etiquetas. Empieza como una lista en memoria, incorpora vistas renderizadas en servidor y persistencia, se reorganiza en capas profesionales, expone una API REST, añade autenticación e integraciones externas y termina con tests y documentación técnica. El andamiaje se retira de forma deliberada: al principio se trabaja con mucha guía y el proyecto final parte únicamente de una especificación.",
    outcomes: [
      "Explain what happens between an HTTP request and response, and diagnose it with browser tools.",
      "Build dynamic server-rendered applications with Spring MVC, Thymeleaf, forms, validation and session state.",
      "Organise a Spring application into controller, service, repository, model and DTO layers.",
      "Persist a relational domain model safely with JPA and PostgreSQL.",
      "Design, validate, document and consume resource-oriented REST APIs.",
      "Apply authentication, authorisation and common web-security controls with Spring Security.",
      "Integrate external services and handle files, timeouts and partial failures.",
      "Test, debug, document and defend a complete backend application."
    ],
    outcomesEs: [
      "Explicar qué ocurre entre una petición y una respuesta HTTP y diagnosticarlo con las herramientas del navegador.",
      "Construir aplicaciones dinámicas con Spring MVC, Thymeleaf, formularios, validación y estado de sesión.",
      "Organizar una aplicación Spring en capas controller, service, repository, model y DTO.",
      "Persistir con seguridad un modelo relacional mediante JPA y PostgreSQL.",
      "Diseñar, validar, documentar y consumir APIs REST orientadas a recursos.",
      "Aplicar autenticación, autorización y controles habituales de seguridad web con Spring Security.",
      "Integrar servicios externos y tratar ficheros, timeouts y fallos parciales.",
      "Probar, depurar, documentar y defender una aplicación backend completa."
    ],
    topics: [
      "HTTP and Spring Boot",
      "Spring MVC and Thymeleaf",
      "Forms, validation and session state",
      "Layered architecture",
      "JPA and PostgreSQL",
      "REST API design",
      "Spring Security",
      "External integrations",
      "Testing and documentation"
    ],
    topicsEs: [
      "HTTP y Spring Boot",
      "Spring MVC y Thymeleaf",
      "Formularios, validación y estado de sesión",
      "Arquitectura por capas",
      "JPA y PostgreSQL",
      "Diseño de APIs REST",
      "Spring Security",
      "Integraciones externas",
      "Testing y documentación"
    ],
    resources: [],
    sections: [
      {
        id: "ud-01",
        number: "UD1",
        verb: "UNDERSTAND",
        verbEs: "ENTENDER",
        title: "From Java to the Web: HTTP and Spring Boot",
        titleEs: "De Java a la Web: HTTP y Spring Boot",
        description: "From the browser request to a small in-memory CRUD API, understanding every Spring piece that appears.",
        descriptionEs: "De la petición del navegador a una pequeña API CRUD en memoria, entendiendo cada pieza de Spring que aparece.",
        resources: []
      },
      {
        id: "ud-02",
        number: "UD2",
        verb: "RENDER",
        verbEs: "RENDERIZAR",
        title: "MVC, Thymeleaf and dynamic pages",
        titleEs: "MVC, Thymeleaf y páginas dinámicas",
        description: "Server-rendered HTML, models, templates, reusable fragments and navigation between list and detail pages.",
        descriptionEs: "HTML generado en servidor, modelos, plantillas, fragmentos reutilizables y navegación entre listado y detalle.",
        resources: []
      },
      {
        id: "ud-03",
        number: "UD3",
        verb: "VALIDATE",
        verbEs: "VALIDAR",
        title: "Forms, validation and state",
        titleEs: "Formularios, validación y estado",
        description: "Turning pages into an application with forms, trustworthy input, complete CRUD and session state.",
        descriptionEs: "Convertir páginas en una aplicación con formularios, entrada fiable, CRUD completo y estado de sesión.",
        resources: []
      },
      {
        id: "ud-04",
        number: "UD4",
        verb: "ARCHITECT",
        verbEs: "ARQUITECTAR",
        title: "Professional architecture with Spring",
        titleEs: "Arquitectura profesional con Spring",
        description: "Refactoring a monolithic controller into clear layers with dependency injection, DTOs and centralised errors.",
        descriptionEs: "Refactorizar un controller monolítico en capas claras con inyección de dependencias, DTO y errores centralizados.",
        resources: []
      },
      {
        id: "ud-05",
        number: "UD5",
        verb: "PERSIST",
        verbEs: "PERSISTIR",
        title: "Persistence with JPA and PostgreSQL",
        titleEs: "Persistencia con JPA y PostgreSQL",
        description: "A real relational database, entity relationships, queries, transactions, pagination and introductory performance analysis.",
        descriptionEs: "Una base de datos relacional real, relaciones entre entidades, consultas, transacciones, paginación y rendimiento introductorio.",
        resources: []
      },
      {
        id: "ud-06",
        number: "UD6",
        verb: "INTEGRATE",
        verbEs: "INTEGRAR",
        title: "First-term project",
        titleEs: "Proyecto del primer trimestre",
        description: "Integrating MVC, architecture, validation, sessions and persistence from a set of requirements.",
        descriptionEs: "Integrar MVC, arquitectura, validación, sesiones y persistencia a partir de unos requisitos.",
        resources: []
      },
      {
        id: "ud-07",
        number: "UD7",
        verb: "DESIGN",
        verbEs: "DISEÑAR",
        title: "Well-designed REST APIs",
        titleEs: "APIs REST bien diseñadas",
        description: "Resource-oriented endpoints, input and output DTOs, HTTP semantics, filtering, pagination and OpenAPI.",
        descriptionEs: "Endpoints orientados a recursos, DTO de entrada y salida, semántica HTTP, filtros, paginación y OpenAPI.",
        resources: []
      },
      {
        id: "ud-08",
        number: "UD8",
        verb: "PROTECT",
        verbEs: "PROTEGER",
        title: "Authentication and Spring Security",
        titleEs: "Autenticación y Spring Security",
        description: "Identity, passwords, roles, permissions, protected endpoints, sessions, tokens, CORS and CSRF.",
        descriptionEs: "Identidad, contraseñas, roles, permisos, endpoints protegidos, sesiones, tokens, CORS y CSRF.",
        resources: []
      },
      {
        id: "ud-09",
        number: "UD9",
        verb: "CONNECT",
        verbEs: "CONECTAR",
        title: "Advanced backend and external integration",
        titleEs: "Backend avanzado e integración externa",
        description: "HTTP clients, external DTOs, unavailable services, file handling, email and webhooks.",
        descriptionEs: "Clientes HTTP, DTO externos, servicios no disponibles, gestión de ficheros, correo y webhooks.",
        resources: []
      },
      {
        id: "ud-10",
        number: "UD10",
        verb: "VERIFY",
        verbEs: "VERIFICAR",
        title: "Testing, errors, logs and documentation",
        titleEs: "Testing, errores, logs y documentación",
        description: "JUnit, Mockito, controller tests, logging, debugging, OpenAPI and maintainability review.",
        descriptionEs: "JUnit, Mockito, tests de controllers, logging, depuración, OpenAPI y revisión de mantenibilidad.",
        resources: []
      },
      {
        id: "ud-11",
        number: "UD11",
        verb: "DEFEND",
        verbEs: "DEFENDER",
        title: "Complete backend project",
        titleEs: "Proyecto backend completo",
        description: "An autonomous project from specification and modelling through implementation, testing, documentation and technical defence.",
        descriptionEs: "Un proyecto autónomo desde la especificación y el modelado hasta la implementación, los tests, la documentación y la defensa técnica.",
        resources: []
      }
    ]
  },
  {
    slug: "digitalizacion",
    title: "Digitalización",
    titleEs: "Digitalización",
    term: "2026/2027",
    hours: "~30 hours",
    hoursEs: "~30 horas",
    status: "current",
    updatedAt: "2026-08-30",
    summary:
      "How a developer works in a digital company: publishing to the cloud, directing AI agents, analysing real data, auditing security and designing a digital transformation.",
    summaryEs:
      "Cómo trabaja hoy un desarrollador en una empresa digital: publicar en cloud, dirigir agentes de IA, analizar datos reales, auditar la seguridad y diseñar una transformación digital.",
    overview:
      "A cross-curricular module that follows the real work of a developer inside a company that is digitalising: publishing an application to the cloud, connecting systems that do not talk to each other, directing and verifying a coding agent, turning a dataset into a decision, auditing an application before it goes live and, finally, designing the digital transformation of a whole company. Every unit ends in a real deliverable — a working URL, a repository, an analysis, an audit — rather than in an exam.",
    overviewEs:
      "Módulo transversal que recorre el trabajo real de un desarrollador dentro de una empresa que se digitaliza: publicar una aplicación en cloud, conectar sistemas que no se hablan entre sí, dirigir y verificar a un agente de programación, convertir un dataset en una decisión, auditar una aplicación antes de publicarla y, al final, diseñar la transformación digital de una empresa entera. Cada unidad termina en un producto real —una URL que funciona, un repositorio, un análisis, una auditoría— y no en un examen.",
    outcomes: [
      "Publish a real website on the internet, with your own domain and HTTPS.",
      "Work with a coding agent the way a professional does: context, instructions, tools and verification.",
      "Analyse a real dataset with AI and defend the conclusions you draw from it.",
      "Detect, explain and correct the security mistakes a junior developer should recognise.",
      "Connect systems that do not talk to each other and automate what is worth automating.",
      "Design the digital transformation of a company, and say what you would not do."
    ],
    outcomesEs: [
      "Publicar una web real en Internet, con nombre propio y HTTPS.",
      "Trabajar con un agente de programación como se hace profesionalmente: contexto, instrucciones, herramientas y verificación.",
      "Analizar un dataset real con IA y defender las conclusiones que sacáis de él.",
      "Detectar, explicar y corregir los errores de seguridad que un desarrollador junior debe reconocer.",
      "Conectar sistemas que no se hablan entre sí y automatizar lo que merece la pena automatizar.",
      "Diseñar la transformación digital de una empresa, y saber decir qué no haríais."
    ],
    topics: [
      "Cloud and deployment",
      "Integration and automation",
      "AI-assisted development",
      "Data and decisions",
      "Application security"
    ],
    topicsEs: [
      "Cloud y despliegue",
      "Integración y automatización",
      "Desarrollo asistido por IA",
      "Datos y decisiones",
      "Seguridad de aplicaciones"
    ],
    resources: [],
    sections: [
      {
        id: "ud-01",
        number: "UD1",
        verb: "UNDERSTAND",
        verbEs: "ENTENDER",
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
        verb: "CONNECT",
        verbEs: "CONECTAR",
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
        verb: "PUBLISH",
        verbEs: "PUBLICAR",
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
        verb: "PROGRAM",
        verbEs: "PROGRAMAR",
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
        verb: "DECIDE",
        verbEs: "DECIDIR",
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
      },
      {
        id: "ud-06",
        number: "UD6",
        verb: "PROTECT",
        verbEs: "PROTEGER",
        title: "Cybersecurity for developers",
        titleEs: "Ciberseguridad para desarrolladores",
        description:
          "Auditing a web application, explaining its risks and correcting common vulnerabilities with AI as a review aid.",
        descriptionEs:
          "Auditar una aplicación web, explicar sus riesgos y corregir vulnerabilidades comunes con la IA como apoyo de revisión.",
        resources: []
      },
      {
        id: "ud-07",
        number: "UD7",
        verb: "INTEGRATE",
        verbEs: "INTEGRAR",
        title: "Digital transformation of a company",
        titleEs: "Transformación digital de una empresa",
        description:
          "Final project: analyse a traditional company and design a viable digital transformation proposal.",
        descriptionEs:
          "Proyecto final: analizar una empresa tradicional y diseñar una propuesta viable de transformación digital.",
        resources: []
      }
    ]
  },
  {
    slug: "sostenibilidad",
    title: "Sostenibilidad",
    titleEs: "Sostenibilidad",
    term: "2026/2027",
    hours: "~30 hours",
    hoursEs: "~30 horas",
    status: "current",
    updatedAt: "2026-08-29",
    summary:
      "Deciding with sustainability criteria inside a digital product: ESG impact, life cycle, a website that consumes less, accessibility, and infrastructure sized to the problem.",
    summaryEs:
      "Decidir con criterio de sostenibilidad dentro de un producto digital: impactos ASG, ciclo de vida, una web que consume menos, accesibilidad e infraestructura proporcional al problema.",
    overview:
      "A cross-curricular module on the environmental and social consequences of technology, and on the criteria used to reduce them. Every unit ends in a decision that has to be defended with evidence rather than with intentions: which impacts actually matter, whether a device should be replaced, what a page really costs to load, who cannot use the interface, how much infrastructure a problem deserves and, finally, designing the digital sustainability plan of a whole company. Regulation appears throughout, where it belongs — as a constraint on a technical decision rather than as a list to memorise.",
    overviewEs:
      "Módulo transversal sobre las consecuencias ambientales y sociales de la tecnología y sobre los criterios para reducirlas. Cada unidad termina en una decisión que hay que defender con evidencias y no con intenciones: qué impactos importan de verdad, si conviene sustituir un dispositivo, cuánto cuesta realmente cargar una página, quién no puede usar la interfaz, cuánta infraestructura merece un problema y, al final, diseñar el plan de sostenibilidad digital de una empresa entera. La normativa aparece a lo largo del módulo, donde le corresponde: como límite de una decisión técnica y no como una lista que memorizar.",
    outcomes: [
      "Analyse the environmental, social and governance impacts of a company.",
      "Tell a real improvement from a claim with no evidence behind it.",
      "Follow the whole life cycle of a device before deciding what to do with it.",
      "Measure a website, optimise it and prove the improvement with data.",
      "Find and fix the barriers that stop people using an interface.",
      "Size infrastructure, data and AI in proportion to the problem.",
      "Relate an ESG issue to a risk or an opportunity for the company.",
      "Turn a diagnosis into a plan with objectives, indicators, owners and dates."
    ],
    outcomesEs: [
      "Analizar los impactos ambientales, sociales y de gobernanza de una empresa.",
      "Distinguir una mejora real de una afirmación sin evidencias detrás.",
      "Recorrer el ciclo de vida completo de un dispositivo antes de decidir sobre él.",
      "Medir una web, optimizarla y demostrar la mejora con datos.",
      "Encontrar y corregir las barreras que impiden usar una interfaz.",
      "Dimensionar infraestructura, datos e IA de forma proporcional al problema.",
      "Relacionar un asunto ASG con un riesgo o una oportunidad para la empresa.",
      "Convertir un diagnóstico en un plan con objetivos, indicadores, responsables y plazos."
    ],
    topics: [
      "Environmental, social and governance impact",
      "Life cycle and circular economy",
      "Sustainable web and software",
      "Accessibility",
      "Cloud, data and AI",
      "Sustainability plan",
      "Applicable regulation"
    ],
    topicsEs: [
      "Impacto ambiental, social y de gobernanza",
      "Ciclo de vida y economía circular",
      "Web y software sostenible",
      "Accesibilidad",
      "Cloud, datos e IA",
      "Plan de sostenibilidad",
      "Normativa aplicable"
    ],
    resources: [],
    sections: [
      {
        id: "ud-01",
        number: "UD1",
        verb: "UNDERSTAND",
        verbEs: "ENTENDER",
        title: "What makes a company sustainable",
        titleEs: "Qué significa que una empresa sea sostenible",
        description:
          "Environmental, social and governance impacts, and how to tell a real improvement from a claim with nothing behind it.",
        descriptionEs:
          "Impactos ambientales, sociales y de gobernanza, y cómo distinguir una mejora real de una afirmación sin evidencias.",
        resources: []
      },
      {
        id: "ud-02",
        number: "UD2",
        verb: "MEASURE",
        verbEs: "MEDIR",
        title: "The environmental footprint of technology",
        titleEs: "La huella ambiental de la tecnología",
        description:
          "The full life cycle of a device, circular economy, and what a data centre actually consumes.",
        descriptionEs:
          "El ciclo de vida completo de un dispositivo, economía circular y qué consume de verdad un centro de datos.",
        resources: []
      },
      {
        id: "ud-03",
        number: "UD3",
        verb: "OPTIMISE",
        verbEs: "OPTIMIZAR",
        title: "Sustainable web and software development",
        titleEs: "Desarrollo web y software sostenible",
        description:
          "Measuring a web page, finding the waste, optimising it and proving the improvement with data.",
        descriptionEs:
          "Medir una web, encontrar el desperdicio, optimizarla y demostrar la mejora con datos.",
        resources: [
          {
            label: "PixelStore · starting project",
            labelEs: "PixelStore · proyecto de partida",
            href: "https://github.com/MarcSemperLloret/webssos",
            kind: "code",
            description:
              "A shop that works and transfers far more than it needs. Clone it, measure it, optimise it.",
            descriptionEs:
              "Una tienda que funciona y transfiere mucho más de lo necesario. Clonadla, medidla y optimizadla."
          }
        ]
      },
      {
        id: "ud-04",
        number: "UD4",
        verb: "INCLUDE",
        verbEs: "INCLUIR",
        title: "Accessibility and inclusive digital design",
        titleEs: "Accesibilidad y diseño digital inclusivo",
        description:
          "Finding the barriers that stop people using a site, fixing them and proving the site is better afterwards.",
        descriptionEs:
          "Encontrar las barreras que impiden usar un sitio, corregirlas y demostrar que después es mejor.",
        resources: [
          {
            label: "PixelStore · starting project, barriers branch",
            labelEs: "PixelStore · proyecto de partida, rama barreras",
            href: "https://github.com/MarcSemperLloret/webssos/tree/barreras",
            kind: "code",
            description:
              "The same shop, now with a cart and a modal, and unusable without a mouse.",
            descriptionEs:
              "La misma tienda, ahora con carrito y modal, e inservible sin ratón."
          }
        ]
      },
      {
        id: "ud-05",
        number: "UD5",
        verb: "RIGHT-SIZE",
        verbEs: "DIMENSIONAR",
        title: "Sustainable cloud, data and artificial intelligence",
        titleEs: "Cloud, datos e inteligencia artificial sostenibles",
        description:
          "Sizing infrastructure to real load, deciding what data is worth keeping, and choosing a solution proportionate to the problem.",
        descriptionEs:
          "Ajustar la infraestructura a la carga real, decidir qué datos merece la pena guardar y elegir una solución proporcional al problema.",
        resources: []
      },
      {
        id: "ud-06",
        number: "UD6",
        verb: "PLAN",
        verbEs: "PLANIFICAR",
        title: "Audit and digital sustainability plan",
        titleEs: "Auditoría y plan de sostenibilidad digital",
        description:
          "Final project: audit a digital company and turn the diagnosis into objectives, actions, indicators and a roadmap.",
        descriptionEs:
          "Proyecto final: auditar una empresa digital y convertir el diagnóstico en objetivos, acciones, indicadores y un roadmap.",
        resources: []
      }
    ]
  },
  {
    slug: "lenguaje-de-marcas",
    title: "Lenguaje de marcas",
    titleEs: "Lenguaje de marcas",
    term: "2026/2027",
    hours: "~36 hours",
    hoursEs: "~36 horas",
    status: "current",
    updatedAt: "2026-08-30",
    summary:
      "Structuring and styling web information with modern semantic HTML, accessible forms, CSS layout systems, and responsive design.",
    summaryEs:
      "Estructuración y presentación de la información web con HTML semántico, formularios accesibles, maquetación moderna con CSS y diseño responsive.",
    overview:
      "A foundational software development module focused, for now, on the two layers used to build a web interface: semantic HTML for structure, meaning and accessibility, followed by modern CSS for visual design, Flexbox, Grid and responsive layouts.",
    overviewEs:
      "Módulo fundamental de desarrollo centrado, de momento, en las dos capas con las que se construye una interfaz web: HTML semántico para la estructura, el significado y la accesibilidad, seguido de CSS moderno para el diseño visual, Flexbox, Grid y la adaptación a distintas pantallas.",
    outcomes: [
      "Write valid, accessible and semantic HTML5 documents.",
      "Design modern, responsive user interfaces using Flexbox, CSS Grid and design tokens."
    ],
    outcomesEs: [
      "Escribir documentos HTML5 válidos, accesibles y con semántica estricta.",
      "Maquetar interfaces web modernas y adaptables con Flexbox, CSS Grid y diseño responsive."
    ],
    topics: [
      "Semantic HTML5 and accessibility",
      "Modern CSS, Flexbox and Grid"
    ],
    topicsEs: [
      "HTML5 semántico y accesibilidad",
      "CSS moderno, Flexbox y Grid"
    ],
    resources: [],
    sections: [
      {
        id: "ud-01",
        number: "UD1",
        verb: "STRUCTURE",
        verbEs: "ESTRUCTURAR",
        title: "HTML: Structure and content of the Web",
        titleEs: "HTML: estructura y contenido de la Web",
        description:
          "Write modern, organized, semantic and accessible HTML documents without CSS.",
        descriptionEs:
          "Crear documentos HTML modernos, organizados, semánticos y accesibles como base sólida antes de aplicar presentación.",
        resources: []
      },
      {
        id: "ud-02",
        number: "UD2",
        verb: "LAY OUT",
        verbEs: "MAQUETAR",
        title: "CSS: design, layout and responsive",
        titleEs: "CSS: diseño, maquetación y responsive",
        description:
          "Turn the HTML site into a responsive, accessible one, using Flexbox and Grid rather than a framework.",
        descriptionEs:
          "Convertir el sitio HTML en una web adaptable y accesible, maquetada con Flexbox y Grid en lugar de con un framework.",
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

export type Lang = "en" | "es";

/**
 * Reading a course, a section or a resource in one language.
 *
 * Every visible field of a course exists twice, once per language. Left as is,
 * every page that shows a course has to spell out that choice for each field,
 * which is what made the English and the Spanish page of a course two separate
 * files. These readers make the choice once, so a single page component can
 * render either language.
 */
export function courseText(course: TeachingCourse, lang: Lang) {
  const es = lang === "es";
  return {
    title: es ? course.titleEs : course.title,
    summary: es ? course.summaryEs : course.summary,
    overview: es ? course.overviewEs : course.overview,
    level: es ? course.levelEs : course.level,
    institution: es ? course.institutionEs : course.institution,
    topics: es ? course.topicsEs : course.topics,
    outcomes: (es ? course.outcomesEs : course.outcomes) ?? []
  };
}

export function sectionText(section: TeachingSection, lang: Lang) {
  const es = lang === "es";
  return {
    title: es ? section.titleEs : section.title,
    description: es ? section.descriptionEs : section.description,
    // A block keeps its English verb when no Spanish one is given, because a
    // missing verb would break the sequence the blocks read as.
    verb: es ? (section.verbEs ?? section.verb) : section.verb
  };
}

export function resourceText(resource: TeachingResource, lang: Lang) {
  const es = lang === "es";
  return {
    label: es ? resource.labelEs : resource.label,
    description: es ? resource.descriptionEs : resource.description
  };
}

/** Root of the teaching section in each language. */
export const teachingBase = (lang: Lang): string =>
  lang === "es" ? "/es/docencia" : "/teaching";

export const coursePath = (slug: string, lang: Lang): string =>
  `${teachingBase(lang)}/${slug}/`;

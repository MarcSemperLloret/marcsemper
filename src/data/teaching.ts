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
  /** Optional phase used to group several consecutive sections visually. */
  phase?: string;
  phaseEs?: string;
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
  /** Course-wide milestones shown as a persistent project checklist. */
  milestones?: string[];
  milestonesEs?: string[];
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
    updatedAt: "2026-09-09",
    summary:
      "Building a complete backend with Java and Spring Boot: from HTTP and the first endpoints to PostgreSQL, REST APIs, security, integrations, testing and Angular connection.",
    summaryEs:
      "Construcción de un backend completo con Java y Spring Boot: desde HTTP y los primeros endpoints hasta PostgreSQL, APIs REST, seguridad, integraciones, testing y conexión con Angular.",
    overview:
      "One student-chosen CRUD project grows throughout the module, with enough domain complexity for relationships, business rules, transactions and testing. Two three-hour workshops per week: 25 minutes of explanation and demonstration, 140 minutes of project work and 15 minutes of verification. The existing 156-hour plan keeps 28 sessions (84 hours) in the first term and 24 (72 hours) in the second, subject to the centre calendar. The first term delivers a persistent backend in production; the second adds authentication, permissions, advanced APIs, integrations and Angular. The same repository and version are used in Intermodular Project: this module assesses the backend, while Intermodular assesses workflow, reviews, CI and deployment. The project manager in the notes is a worked example, not a mandatory topic.",
    overviewEs:
      "Un mismo CRUD elegido por el alumnado crece durante el módulo, con complejidad suficiente para trabajar relaciones, reglas de negocio, transacciones y pruebas. Dos talleres semanales de tres horas: 25 minutos de explicación y demostración, 140 de trabajo sobre el proyecto y 15 de comprobación. Se mantienen las 156 horas previstas: 28 sesiones (84 horas) en el primer trimestre y 24 (72 horas) en el segundo, ajustables al calendario del centro. El primero termina con un backend persistente en producción; el segundo incorpora autenticación, permisos, APIs avanzadas, integraciones y Angular. Se comparte repositorio y versión con Proyecto Intermodular: aquí se evalúa el servidor y allí el workflow, las revisiones, el CI y la puesta en producción. El gestor de los apuntes es un ejemplo resuelto, no un tema obligatorio.",
    outcomes: [
      "Explain what happens between an HTTP request and response, and diagnose it with browser tools and an HTTP client.",
      "Build and verify HTTP backends with controllers, JSON, DTOs, validation, errors and session state.",
      "Organise a Spring application into controller, service, repository, model and DTO layers.",
      "Persist a relational domain model safely with JPA and PostgreSQL.",
      "Design, validate, document and consume resource-oriented REST APIs.",
      "Apply authentication, authorisation and common web-security controls with Spring Security.",
      "Integrate external services and handle files, timeouts and partial failures.",
      "Connect a browser client, and finally Angular, to the finished API without making backend verification depend on the interface.",
      "Test, debug, document and defend a complete backend application."
    ],
    outcomesEs: [
      "Explicar qué ocurre entre una petición y una respuesta HTTP y diagnosticarlo con las herramientas del navegador y un cliente HTTP.",
      "Construir y comprobar backends HTTP con controllers, JSON, DTO, validación, errores y estado de sesión.",
      "Organizar una aplicación Spring en capas controller, service, repository, model y DTO.",
      "Persistir con seguridad un modelo relacional mediante JPA y PostgreSQL.",
      "Diseñar, validar, documentar y consumir APIs REST orientadas a recursos.",
      "Aplicar autenticación, autorización y controles habituales de seguridad web con Spring Security.",
      "Integrar servicios externos y tratar ficheros, timeouts y fallos parciales.",
      "Conectar un cliente de navegador, y finalmente Angular, a la API terminada sin hacer que la comprobación del backend dependa de la interfaz.",
      "Probar, depurar, documentar y defender una aplicación backend completa."
    ],
    topics: [
      "HTTP and Spring Boot",
      "Requests, responses and in-memory CRUD",
      "REST design, DTOs, validation and errors",
      "Layered architecture",
      "JPA and PostgreSQL",
      "Advanced REST APIs",
      "Browser clients and CORS",
      "Spring Security",
      "External integrations",
      "Testing, quality and documentation"
    ],
    topicsEs: [
      "HTTP y Spring Boot",
      "Peticiones, respuestas y CRUD en memoria",
      "Diseño REST, DTO, validación y errores",
      "Arquitectura por capas",
      "JPA y PostgreSQL",
      "APIs REST avanzadas",
      "Clientes de navegador y CORS",
      "Spring Security",
      "Integraciones externas",
      "Testing, calidad y documentación"
    ],
    resources: [{"label": "Shared sequence and assessment", "labelEs": "Secuencia y evaluación conjunta con Servidor", "href": "/es/docencia/coordinacion-servidor-intermodular/", "kind": "link", "descriptionEs": "26 semanas, dependencias concretas y una entrega común con criterios diferenciados."}],
    sections: [
      {
        id: "ud-01",
        number: "UD1",
        verb: "UNDERSTAND",
        verbEs: "ENTENDER",
        title: "From Java to the Web: HTTP and Spring Boot",
        titleEs: "De Java a la Web: HTTP y Spring Boot",
        description: "Choose the course project and build its first in-memory CRUD, understanding HTTP and each Spring component. Four three-hour workshops.",
        descriptionEs: "Elegir el proyecto del curso y construir su primer CRUD en memoria, comprendiendo HTTP y cada pieza de Spring. Cuatro talleres de tres horas.",
        resources: []
      },
      {
        id: "ud-02",
        number: "UD2",
        verb: "COMMUNICATE",
        verbEs: "COMUNICAR",
        title: "Requests, responses and in-memory CRUD",
        titleEs: "Peticiones, respuestas y CRUD en memoria",
        description: "How Spring turns HTTP into Java and back: request bodies, write operations, response control and repeatable checks.",
        descriptionEs: "Cómo transforma Spring HTTP en Java y de vuelta: cuerpos de petición, operaciones de escritura, control de respuestas y pruebas repetibles.",
        resources: []
      },
      {
        id: "ud-03",
        number: "UD3",
        verb: "DESIGN",
        verbEs: "DISEÑAR",
        title: "REST APIs: resources, DTOs, validation and errors",
        titleEs: "APIs REST: recursos, DTO, validación y errores",
        description: "The design rules that turn a pile of endpoints into a defensible API, taught before the application grows enough to make a redesign expensive.",
        descriptionEs: "Las reglas de diseño que convierten un montón de endpoints en una API defendible, antes de que la aplicación crezca lo suficiente como para que rediseñarla salga caro.",
        resources: []
      },
      {
        id: "ud-04",
        number: "UD4",
        verb: "ARCHITECT",
        verbEs: "ARQUITECTAR",
        title: "Layered architecture",
        titleEs: "Arquitectura por capas",
        description: "Refactoring a monolithic controller into clear layers with dependency injection, business rules and the first automated tests.",
        descriptionEs: "Refactorizar un controller monolítico en capas claras con inyección de dependencias, reglas de negocio y los primeros tests automáticos.",
        resources: []
      },
      {
        id: "ud-05",
        number: "UD5",
        verb: "PERSIST",
        verbEs: "PERSISTIR",
        title: "Persistence with JPA and PostgreSQL",
        titleEs: "Persistencia con JPA y PostgreSQL",
        description: "A real relational database, entity relationships, queries, transactions, repository tests and introductory performance analysis.",
        descriptionEs: "Una base de datos relacional real, relaciones entre entidades, consultas, transacciones, tests de repositorio y rendimiento introductorio.",
        resources: []
      },
      {
        id: "ud-06",
        number: "UD6",
        verb: "INTEGRATE",
        verbEs: "INTEGRAR",
        title: "First-term project",
        titleEs: "Proyecto del primer trimestre",
        description: "Close, review and defend the persistent, deployed version of the project chosen in the first session. Two sessions; the project continues throughout the term.",
        descriptionEs: "Cerrar, revisar y defender la versión persistente y publicada del proyecto elegido en la primera sesión. Dos sesiones; el proyecto se construye durante todo el trimestre.",
        resources: []
      },
      {
        id: "ud-07",
        number: "UD7",
        verb: "REFINE",
        verbEs: "REFINAR",
        title: "Advanced REST APIs",
        titleEs: "APIs REST avanzadas",
        description: "Exposed relationships, filtering, pagination, endpoint tests with MockMvc, OpenAPI and contract evolution.",
        descriptionEs: "Relaciones expuestas, filtros, paginación, tests de endpoint con MockMvc, OpenAPI y evolución del contrato.",
        resources: []
      },
      {
        id: "ud-08",
        number: "UD8",
        verb: "CONNECT",
        verbEs: "CONECTAR",
        title: "The project client: browser and CORS",
        titleEs: "El cliente del proyecto: navegador y CORS",
        description: "Build the first browser client, diagnose CORS, and verify the integration before publishing it in Intermodular and adding authentication.",
        descriptionEs: "Construir el primer cliente de navegador, diagnosticar CORS y verificar la integración antes de publicarla en Intermodular y añadir autenticación.",
        resources: []
      },
      {
        id: "ud-09",
        number: "UD9",
        verb: "PROTECT",
        verbEs: "PROTEGER",
        title: "Session, authentication and Spring Security",
        titleEs: "Sesión, autenticación y Spring Security",
        description: "From why HTTP forgets you to a protected API with persistent users, roles, permissions, sessions, tokens and CSRF.",
        descriptionEs: "Desde por qué HTTP no recuerda quién eres hasta una API protegida con usuarios persistentes, roles, permisos, sesiones, tokens y CSRF.",
        resources: []
      },
      {
        id: "ud-10",
        number: "UD10",
        verb: "EXTEND",
        verbEs: "AMPLIAR",
        title: "External integrations",
        titleEs: "Integraciones externas",
        description: "HTTP clients, external DTOs, unavailable services, file handling, email and webhooks.",
        descriptionEs: "Clientes HTTP, DTO externos, servicios no disponibles, gestión de ficheros, correo y webhooks.",
        resources: []
      },
      {
        id: "ud-11",
        number: "UD11",
        verb: "VERIFY",
        verbEs: "VERIFICAR",
        title: "Quality, observability and documentation",
        titleEs: "Calidad, observabilidad y documentación",
        description: "Consolidating into a strategy what has been tested since UD4, plus logging, debugging, OpenAPI and peer review.",
        descriptionEs: "Consolidar en una estrategia lo que se viene probando desde la UD4, más logging, depuración, OpenAPI y revisión por pares.",
        resources: []
      },
      {
        id: "ud-12",
        number: "UD12",
        verb: "DEFEND",
        verbEs: "DEFENDER",
        title: "Complete backend project",
        titleEs: "Proyecto backend completo",
        description: "Complete and defend the evolution of the same product: specification, modelling, implementation, Angular integration, tests and documentation.",
        descriptionEs: "Completar y defender la evolución del mismo producto: especificación, modelado, implementación, integración con Angular, tests y documentación.",
        resources: []
      }
    ]
  },
  {
    slug: "proyecto-intermodular",
    title: "Intermodular project",
    titleEs: "Proyecto Intermodular",
    level: "Second year of Web Application Development",
    levelEs: "2.º de Desarrollo de Aplicaciones Web",
    term: "2026/2027",
    hours: "78 hours · 26 sessions",
    hoursEs: "78 horas · 26 sesiones",
    status: "current",
    updatedAt: "2026-09-09",
    summary: "One product shared with Server-side: reviewed changes, CI, deployment and a coordinated assessment across two terms.",
    summaryEs: "El mismo producto de Servidor durante dos trimestres: cambios revisados, CI, despliegue y evaluación coordinada sobre una entrega común.",
    overview: "26 three-hour workshops, one at the start of each week, using the previous week’s Server-side work: 14 in the first term and 12 in the second. The student-chosen product and backend repository are retained throughout. The first term publishes the persistent backend; the second coordinates its client, security, integrations and final delivery after those topics are taught in Server-side. The product demonstration and evidence are shared, with distinct implementation and process criteria. Each workshop has 25 minutes of explanation, 140 of guided work and 15 of closing.",
    overviewEs: "26 talleres de tres horas, uno al principio de cada semana, sobre el trabajo de Servidor de la semana anterior: 14 en el primer trimestre y 12 en el segundo. Se mantienen el producto elegido, su autoría/equipo y el repositorio del backend. El primero termina con el backend persistente publicado; el segundo coordina cliente, seguridad, integraciones y entrega final después de su explicación en Servidor. La demostración y las evidencias se comparten, con criterios diferenciados de implementación y proceso. Cada taller dedica 25 minutos a explicación, 140 a trabajo guiado y 15 a cierre.",
    outcomes: [
      "Turn work into issues with checkable acceptance criteria.",
      "Publish a static site on Azure with continuous deployment from GitHub.",
      "Take every change through a branch and a reviewed pull request.",
      "Protect the main branch and show that the circuit cannot be bypassed.",
      "Write a verification pipeline that can block a merge.",
      "Review someone else's work against stated criteria instead of approving on trust.",
      "Coordinate the existing product client and API after their implementation in Server-side.",
      "Defend the working method with dated evidence: board, pull requests and pipeline failures."
    ],
    outcomesEs: [
      "Convertir el trabajo en issues con criterios de aceptación comprobables.",
      "Publicar un sitio estático en Azure con despliegue continuo desde GitHub.",
      "Hacer pasar cada cambio por una rama y una pull request revisada.",
      "Proteger la rama principal y demostrar que el circuito no se puede saltar.",
      "Escribir un pipeline de comprobación capaz de bloquear una fusión.",
      "Revisar el trabajo de otra persona con criterios explícitos en vez de aprobar por confianza.",
      "Coordinar el cliente y la API del mismo producto después de su implementación en Servidor.",
      "Defender el método de trabajo con evidencias fechadas: tablero, pull requests y fallos del pipeline."
    ],
    milestones: [
      "Repository and public URL",
      "Board and protected main",
      "Portfolio through pull requests",
      "Verification pipeline",
      "CRUD integrated",
      "Shared final delivery"
    ],
    milestonesEs: [
      "Repositorio y URL pública",
      "Tablero y main protegida",
      "Portfolio por pull requests",
      "Pipeline de comprobación",
      "CRUD integrado",
      "Entrega y defensa conjunta"
    ],
    topics: [
      "Working method",
      "Git and GitHub",
      "Continuous integration",
      "Continuous deployment",
      "Code review",
      "Professional portfolio"
    ],
    topicsEs: [
      "Método de trabajo",
      "Git y GitHub",
      "Integración continua",
      "Despliegue continuo",
      "Revisión de código",
      "Portfolio profesional"
    ],
    resources: [{"label": "Shared sequence and assessment", "labelEs": "Secuencia y evaluación conjunta con Servidor", "href": "/es/docencia/coordinacion-servidor-intermodular/", "kind": "link", "descriptionEs": "26 semanas, dependencias concretas y una entrega común con criterios diferenciados."}],
    sections: [
      {
            "id": "ud-01",
            "number": "UD1",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Poner el circuito en marcha",
            "titleEs": "Poner el circuito en marcha",
            "description": "Preparar una URL de presentación y el circuito de issues, ramas, revisión y despliegue, conservando el repositorio de backend creado en Servidor.",
            "descriptionEs": "Preparar una URL de presentación y el circuito de issues, ramas, revisión y despliegue, conservando el repositorio de backend creado en Servidor.",
            "phase": "1 · FIRST TERM",
            "phaseEs": "1 · PRIMER TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-02",
            "number": "UD2",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Que lo compruebe la máquina",
            "titleEs": "Que lo compruebe la máquina",
            "description": "Construir el portfolio de verdad haciendo entrar cada sección por pull request, y escribir un pipeline propio que valide HTML, formato, enlaces y accesibilidad, y que impida fusionar cuando algo de eso falla.",
            "descriptionEs": "Construir el portfolio de verdad haciendo entrar cada sección por pull request, y escribir un pipeline propio que valide HTML, formato, enlaces y accesibilidad, y que impida fusionar cuando algo de eso falla.",
            "phase": "1 · FIRST TERM",
            "phaseEs": "1 · PRIMER TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-03",
            "number": "UD3",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Cerrar y publicar la versión",
            "titleEs": "Cerrar y publicar la versión",
            "description": "Escribir el README que hace comprensible el repositorio para quien llega de fuera, publicar la primera versión con nombre, y auditar el rastro de trabajo del compañero contra la definición de terminado.",
            "descriptionEs": "Escribir el README que hace comprensible el repositorio para quien llega de fuera, publicar la primera versión con nombre, y auditar el rastro de trabajo del compañero contra la definición de terminado.",
            "phase": "1 · FIRST TERM",
            "phaseEs": "1 · PRIMER TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-04",
            "number": "UD4",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Poner el backend en producción",
            "titleEs": "Poner el backend en producción",
            "description": "Reutilizar el repositorio de Servidor, ejecutar su CI, publicar el backend, comprobar el contrato con la colección y preparar PostgreSQL en pruebas y producción.",
            "descriptionEs": "Reutilizar el repositorio de Servidor, ejecutar su CI, publicar el backend, comprobar el contrato con la colección y preparar PostgreSQL en pruebas y producción.",
            "phase": "1 · FIRST TERM",
            "phaseEs": "1 · PRIMER TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-05",
            "number": "UD5",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Priorizar la evolución del producto",
            "titleEs": "Priorizar la evolución del producto",
            "description": "Priorizar una mejora del mismo producto a partir de necesidades observadas, sin cambiar de tema ni de repositorio.",
            "descriptionEs": "Priorizar una mejora del mismo producto a partir de necesidades observadas, sin cambiar de tema ni de repositorio.",
            "phase": "1 · FIRST TERM",
            "phaseEs": "1 · PRIMER TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-06",
            "number": "UD6",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Defender el método",
            "titleEs": "Defender el método",
            "description": "Cerrar la evaluación defendiendo cómo se ha trabajado, con tres evidencias que no se pueden improvisar: el tablero, la pull request más discutida y una ejecución del pipeline que falló.",
            "descriptionEs": "Cerrar la evaluación defendiendo cómo se ha trabajado, con tres evidencias que no se pueden improvisar: el tablero, la pull request más discutida y una ejecución del pipeline que falló.",
            "phase": "1 · FIRST TERM",
            "phaseEs": "1 · PRIMER TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-07",
            "number": "UD7",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Planificar y revisar el incremento",
            "titleEs": "Planificar y revisar el incremento",
            "description": "Organizar el incremento del mismo producto y revisar las búsquedas y la paginación ya implementadas en Servidor.",
            "descriptionEs": "Organizar el incremento del mismo producto y revisar las búsquedas y la paginación ya implementadas en Servidor.",
            "phase": "2 · SECOND TERM",
            "phaseEs": "2 · SEGUNDO TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-08",
            "number": "UD8",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Revisar el contrato e integrar el cliente",
            "titleEs": "Revisar el contrato e integrar el cliente",
            "description": "Comprobar el contrato versionado e integrar el cliente construido en Servidor, con sus versiones y configuración identificadas.",
            "descriptionEs": "Comprobar el contrato versionado e integrar el cliente construido en Servidor, con sus versiones y configuración identificadas.",
            "phase": "2 · SECOND TERM",
            "phaseEs": "2 · SEGUNDO TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-09",
            "number": "UD9",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Preparar y comprobar los permisos",
            "titleEs": "Preparar y comprobar los permisos",
            "description": "Preparar los casos de acceso y comprobar roles y propiedad sobre la implementación de Servidor.",
            "descriptionEs": "Preparar los casos de acceso y comprobar roles y propiedad sobre la implementación de Servidor.",
            "phase": "2 · SECOND TERM",
            "phaseEs": "2 · SEGUNDO TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-10",
            "number": "UD10",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Publicar JWT y comprobar integraciones",
            "titleEs": "Publicar JWT y comprobar integraciones",
            "description": "Publicar el acceso con JWT y comprobar la respuesta del producto ante fallos de un proveedor externo.",
            "descriptionEs": "Publicar el acceso con JWT y comprobar la respuesta del producto ante fallos de un proveedor externo.",
            "phase": "2 · SECOND TERM",
            "phaseEs": "2 · SEGUNDO TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-11",
            "number": "UD11",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Verificar efectos y revisar la candidata",
            "titleEs": "Verificar efectos y revisar la candidata",
            "description": "Verificar los efectos de archivos y notificaciones y revisar las pruebas que permiten aceptar una candidata.",
            "descriptionEs": "Verificar los efectos de archivos y notificaciones y revisar las pruebas que permiten aceptar una candidata.",
            "phase": "2 · SECOND TERM",
            "phaseEs": "2 · SEGUNDO TRIMESTRE",
            "resources": []
      },
      {
            "id": "ud-12",
            "number": "UD12",
            "verb": "WORKSHOP",
            "verbEs": "TALLER",
            "title": "Recuperar, publicar y defender el producto",
            "titleEs": "Recuperar, publicar y defender el producto",
            "description": "Ensayar la recuperación, comprobar la publicación y defender el proceso del mismo producto trabajado en Servidor.",
            "descriptionEs": "Ensayar la recuperación, comprobar la publicación y defender el proceso del mismo producto trabajado en Servidor.",
            "phase": "2 · SECOND TERM",
            "phaseEs": "2 · SEGUNDO TRIMESTRE",
            "resources": []
      }
]
  },
  {
    slug: "digitalizacion",
    title: "Digitalización",
    titleEs: "Digitalización",
    term: "2026/2027",
    hours: "30 hours",
    hoursEs: "30 horas",
    status: "current",
    updatedAt: "2026-09-09",
    summary:
      "How a developer works in a digital company: publishing to the cloud, directing AI agents, analysing real data, auditing security and designing a digital transformation.",
    summaryEs:
      "Cómo trabaja hoy un desarrollador en una empresa digital: publicar en cloud, dirigir agentes de IA, analizar datos reales, auditar la seguridad y diseñar una transformación digital.",
    overview: "Thirty one-hour workshops: ten minutes of contextual explanation, forty-five of guided activity and five to check progress. Self-contained starting materials support learners without Server or Intermodular prerequisites. Each unit has an assessed activity; weights follow unit hours, with individual evidence and revision of unmet criteria.",
    overviewEs: "30 talleres de una hora: 10 minutos de explicación contextualizada, 45 de actividad guiada y 5 de cierre. Siete actividades acumulativas permiten analizar procesos, integración, cloud, IA, datos, seguridad y una transformación empresarial. Los materiales iniciales están incluidos y no se necesita el proyecto de Servidor o Intermodular. Se evalúan las actividades con rúbricas y peso proporcional a sus horas; cada integrante aporta evidencias y puede revisar los criterios pendientes.",
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
    resources: [{ label: "Workshop setup and assessment", labelEs: "Guía de arranque, materiales y evaluación", href: "/es/docencia/talleres-transversales/", kind: "notes", description: "Starting materials and activity-based assessment.", descriptionEs: "Materiales iniciales, herramientas y criterios para trabajar sin depender de otros módulos." }],
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
    hours: "30 hours",
    hoursEs: "30 horas",
    status: "current",
    updatedAt: "2026-09-09",
    summary:
      "Deciding with sustainability criteria inside a digital product: ESG impact, life cycle, a website that consumes less, accessibility, and infrastructure sized to the problem.",
    summaryEs:
      "Decidir con criterio de sostenibilidad dentro de un producto digital: impactos ASG, ciclo de vida, una web que consume menos, accesibilidad e infraestructura proporcional al problema.",
    overview: "Thirty one-hour workshops: ten minutes of contextual explanation, forty-five of guided activity and five to check progress. Self-contained starting materials support learners without Server or Intermodular prerequisites. Each unit has an assessed activity; weights follow unit hours, with individual evidence and revision of unmet criteria.",
    overviewEs: "30 talleres de una hora: 10 minutos de explicación contextualizada, 45 de actividad guiada y 5 de cierre. PixelStore sirve como caso independiente para analizar impactos ASG, equipos, recursos web, accesibilidad, infraestructura y un plan de sostenibilidad. No se presupone haber cursado Digitalización, Servidor o Intermodular. Se evalúan seis actividades con rúbricas y peso proporcional a sus horas; el plan final reutiliza las evidencias sin duplicar informes.",
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
    resources: [{ label: "Workshop setup and assessment", labelEs: "Guía de arranque, materiales y evaluación", href: "/es/docencia/talleres-transversales/", kind: "notes", description: "Starting materials and activity-based assessment.", descriptionEs: "Materiales iniciales, herramientas y criterios para trabajar sin depender de otros módulos." }],
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
    hours: "~108 hours",
    hoursEs: "~108 horas",
    status: "current",
    updatedAt: "2026-09-04",
    summary:
      "The whole front-to-back path over three terms: semantic HTML and modern CSS, then JavaScript and the DOM, and finally Node.js and an Express API the site consumes as its own.",
    summaryEs:
      "El camino completo a lo largo de tres trimestres: HTML semántico y CSS moderno, después JavaScript y el DOM, y finalmente Node.js y una API con Express que el propio sitio consume.",
    overview:
      "A three-term, project-led module built around a single site that grows with the class. The first term writes it as a document —semantic HTML, accessible forms, then modern CSS with Flexbox, Grid and responsive layout without a framework. The second term makes it behave: JavaScript as a language first, deliberately away from the page, so that a filter that does not filter is diagnosed as logic rather than as a button; then the DOM, events, state and fetch, with one rule throughout — data is the truth and the page is its reflection. The third term crosses to the other side: Node.js, npm, files, and an HTTP server written by hand before Express, so that every piece of the framework answers a problem the student has already felt; it closes with a designed REST API, layered code, an error contract, security, tests and a deployed application. Scaffolding is withdrawn on purpose: the first unit explains every step, and the last one starts from a specification.",
    overviewEs:
      "Módulo de tres trimestres articulado alrededor de un único sitio que crece con la clase. El primer trimestre lo escribe como documento: HTML semántico, formularios accesibles y después CSS moderno con Flexbox, Grid y diseño adaptable sin frameworks. El segundo lo hace comportarse: primero JavaScript como lenguaje, deliberadamente lejos de la página, para que un filtro que no filtra se diagnostique como un problema de lógica y no del botón; después el DOM, los eventos, el estado y fetch, con una regla que gobierna todo: los datos mandan y la página es su reflejo. El tercero cruza al otro lado: Node.js, npm, ficheros y un servidor HTTP escrito a mano antes de Express, para que cada pieza del framework responda a un problema ya sufrido; termina con una API REST diseñada, código por capas, contrato de errores, seguridad, pruebas y una aplicación desplegada. El andamiaje se retira de forma deliberada: la primera unidad explica cada paso y la última parte de una especificación.",
    outcomes: [
      "Write valid, accessible and semantic HTML5 documents.",
      "Design modern, responsive user interfaces using Flexbox, CSS Grid and design tokens.",
      "Program with JavaScript: data, decisions, functions, arrays of objects, modules and error handling.",
      "Build an interface driven by a single source of truth, with events, rendering and fetch.",
      "Run JavaScript outside the browser with Node.js, working with files, npm and HTTP.",
      "Design and implement a REST API with Express, layered code, tests and a deployment."
    ],
    outcomesEs: [
      "Escribir documentos HTML5 válidos, accesibles y con semántica estricta.",
      "Maquetar interfaces web modernas y adaptables con Flexbox, CSS Grid y diseño responsive.",
      "Programar con JavaScript: datos, decisiones, funciones, arrays de objetos, módulos y errores.",
      "Construir una interfaz gobernada por una única fuente de verdad, con eventos, render y fetch.",
      "Ejecutar JavaScript fuera del navegador con Node.js, trabajando con ficheros, npm y HTTP.",
      "Diseñar e implementar una API REST con Express, separada en capas, probada y desplegada."
    ],
    topics: [
      "Semantic HTML5 and accessibility",
      "Modern CSS, Flexbox and Grid",
      "JavaScript: the language",
      "DOM, events, state and fetch",
      "Node.js, npm and HTTP",
      "REST APIs with Express, testing and deployment"
    ],
    topicsEs: [
      "HTML5 semántico y accesibilidad",
      "CSS moderno, Flexbox y Grid",
      "JavaScript: el lenguaje",
      "DOM, eventos, estado y fetch",
      "Node.js, npm y HTTP",
      "APIs REST con Express, pruebas y despliegue"
    ],
    resources: [],
    sections: [
      {
        id: "ud-01",
        number: "UD1",
        verb: "STRUCTURE",
        verbEs: "ESTRUCTURAR",
        phase: "TERM 1 · THE DOCUMENT",
        phaseEs: "TRIMESTRE 1 · EL DOCUMENTO",
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
        phase: "TERM 1 · THE DOCUMENT",
        phaseEs: "TRIMESTRE 1 · EL DOCUMENTO",
        title: "CSS: design, layout and responsive",
        titleEs: "CSS: diseño, maquetación y responsive",
        description:
          "Turn the HTML site into a responsive, accessible one, using Flexbox and Grid rather than a framework.",
        descriptionEs:
          "Convertir el sitio HTML en una web adaptable y accesible, maquetada con Flexbox y Grid en lugar de con un framework.",
        resources: []
      },
      {
        id: "ud-03",
        number: "UD3",
        verb: "REASON",
        verbEs: "RAZONAR",
        phase: "TERM 2 · BEHAVIOUR IN THE BROWSER",
        phaseEs: "TRIMESTRE 2 · EL COMPORTAMIENTO EN EL NAVEGADOR",
        title: "JavaScript: the language",
        titleEs: "JavaScript: el lenguaje",
        description:
          "Learn the language away from the page: data, decisions, functions, arrays of objects, modules and errors.",
        descriptionEs:
          "Aprender el lenguaje lejos de la página: datos, decisiones, funciones, arrays de objetos, módulos y errores.",
        resources: []
      },
      {
        id: "ud-04",
        number: "UD4",
        verb: "REACT",
        verbEs: "REACCIONAR",
        phase: "TERM 2 · BEHAVIOUR IN THE BROWSER",
        phaseEs: "TRIMESTRE 2 · EL COMPORTAMIENTO EN EL NAVEGADOR",
        title: "The DOM: the web that responds",
        titleEs: "El DOM: la web que responde",
        description:
          "Connect the three layers: rendering from data, events, a single source of truth, accessible forms and fetch.",
        descriptionEs:
          "Conectar las tres capas: render desde datos, eventos, una única fuente de verdad, formularios accesibles y fetch.",
        resources: []
      },
      {
        id: "ud-05",
        number: "UD5",
        verb: "SERVE",
        verbEs: "SERVIR",
        phase: "TERM 3 · JAVASCRIPT ON THE SERVER",
        phaseEs: "TRIMESTRE 3 · JAVASCRIPT EN EL SERVIDOR",
        title: "Node.js: JavaScript outside the browser",
        titleEs: "Node.js: JavaScript fuera del navegador",
        description:
          "The same language without a browser: npm, files, and an HTTP server written by hand before rewriting it with Express.",
        descriptionEs:
          "El mismo lenguaje sin navegador: npm, ficheros y un servidor HTTP escrito a mano antes de reescribirlo con Express.",
        resources: []
      },
      {
        id: "ud-06",
        number: "UD6",
        verb: "PUBLISH",
        verbEs: "PUBLICAR",
        phase: "TERM 3 · JAVASCRIPT ON THE SERVER",
        phaseEs: "TRIMESTRE 3 · JAVASCRIPT EN EL SERVIDOR",
        title: "Web server and API with Node",
        titleEs: "Servidor web y API con Node",
        description:
          "A designed REST API: full CRUD, layered code, an error contract, security, tests and a deployed application.",
        descriptionEs:
          "Una API REST diseñada: CRUD completo, código por capas, contrato de errores, seguridad, pruebas y despliegue.",
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
    outcomes: (es ? course.outcomesEs : course.outcomes) ?? [],
    milestones: (es ? course.milestonesEs : course.milestones) ?? []
  };
}

export function sectionText(section: TeachingSection, lang: Lang) {
  const es = lang === "es";
  return {
    title: es ? section.titleEs : section.title,
    description: es ? section.descriptionEs : section.description,
    phase: es ? (section.phaseEs ?? section.phase) : section.phase,
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

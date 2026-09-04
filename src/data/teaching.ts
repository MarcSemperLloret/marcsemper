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
    updatedAt: "2026-09-02",
    summary:
      "Building a complete backend with Java and Spring Boot: from HTTP and the first endpoints to PostgreSQL, REST APIs, security, integrations, testing and Angular connection.",
    summaryEs:
      "Construcción de un backend completo con Java y Spring Boot: desde HTTP y los primeros endpoints hasta PostgreSQL, APIs REST, seguridad, integraciones, testing y conexión con Angular.",
    overview:
      "A two-term, project-led module built around one application that grows with the class: a project manager with projects, tasks, tags and users. It starts as an in-memory API verified with an HTTP client from the very first unit, learns REST design before the code grows enough to make a redesign expensive, is reorganised into layers, gains persistence, meets a real browser client before security is added, with Angular kept for the final project, and finishes with authentication, integrations, testing and a technical defence. Automated tests appear from the architecture unit onwards rather than at the end. Guidance is deliberately reduced as the course advances, so the final project is driven by a specification rather than a tutorial.",
    overviewEs:
      "Módulo de dos trimestres articulado alrededor de una única aplicación que crece con la clase: un gestor de proyectos con proyectos, tareas, etiquetas y usuarios. Empieza como una API en memoria comprobada con un cliente HTTP desde la primera unidad, aprende a diseñarse como API REST antes de que rediseñarla salga caro, se reorganiza en capas, incorpora persistencia, se enfrenta a un navegador real antes de añadir la seguridad, dejando Angular para el proyecto final, y termina con autenticación, integraciones, pruebas y defensa técnica. Los tests automáticos aparecen desde la unidad de arquitectura y no al final. El andamiaje se retira de forma deliberada: al principio se trabaja con mucha guía y el proyecto final parte únicamente de una especificación.",
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
    resources: [],
    sections: [
      {
        id: "ud-01",
        number: "UD1",
        verb: "UNDERSTAND",
        verbEs: "ENTENDER",
        title: "From Java to the Web: HTTP and Spring Boot",
        titleEs: "De Java a la Web: HTTP y Spring Boot",
        description: "From the browser request to a small in-memory CRUD API checked with an HTTP client, understanding every Spring piece that appears.",
        descriptionEs: "De la petición del navegador a una pequeña API CRUD en memoria comprobada con un cliente HTTP, entendiendo cada pieza de Spring que aparece.",
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
        description: "Integrating REST design, layered architecture and persistence from a set of requirements, with a code review and a technical defence.",
        descriptionEs: "Integrar diseño REST, arquitectura por capas y persistencia a partir de unos requisitos, con revisión de código y defensa técnica.",
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
        title: "The first client: a page in the browser",
        titleEs: "El primer cliente: una página en el navegador",
        description: "A framework-free page calling the API with no authentication, so that the browser and CORS are learned in isolation before security is added.",
        descriptionEs: "Una página sin framework llamando a la API y sin autenticación, para que el navegador y CORS se aprendan aislados antes de añadir la seguridad.",
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
        description: "An autonomous project from specification and modelling through implementation, Angular integration, testing, documentation and technical defence.",
        descriptionEs: "Un proyecto autónomo desde la especificación y el modelado hasta la implementación, la integración con Angular, los tests, la documentación y la defensa técnica.",
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
    hours: "~78 hours",
    hoursEs: "~78 horas",
    status: "current",
    updatedAt: "2026-08-31",
    summary: "A complete web product taken from a defensible idea to a public release, a professional portfolio case study and a technical defence.",
    summaryEs: "Un producto web completo llevado desde una idea defendible hasta una versión pública, un caso de portfolio profesional y una defensa técnica.",
    overview: "A longitudinal project module that connects the rest of the programme without teaching the same content again. Students identify a real problem, define and prototype a viable product, design its data, API and architecture, organise the work, build and improve an MVP, assure its quality, deploy it and turn the result into a portfolio case study. Git, GitHub, AI, diagrams, mockups, APIs, documentation and deployment are used throughout as working tools rather than as isolated units.",
    overviewEs: "Módulo longitudinal que conecta el resto del ciclo sin volver a enseñar sus contenidos. El alumnado identifica un problema real, define y prototipa un producto viable, diseña sus datos, API y arquitectura, organiza el trabajo, construye y mejora un MVP, asegura su calidad, lo despliega y convierte el resultado en un caso de portfolio. Git, GitHub, IA, diagramas, mockups, APIs, documentación y despliegue se utilizan durante todo el recorrido como herramientas de trabajo, no como unidades aisladas.",
    outcomes: [
      "Distinguish an academic exercise from a project worth presenting in a junior portfolio.",
      "Select a relevant, viable and defensible problem using explicit criteria.",
      "Define users, value, scope, requirements, acceptance criteria and an achievable MVP.",
      "Publish an accessible, responsive prototype before committing to implementation.",
      "Design the data model, API contract and system architecture before building.",
      "Organise a repository, backlog, roadmap and collaborative Git workflow.",
      "Build and evolve a full-stack MVP by reusing learning from the other modules.",
      "Test, review, secure, deploy and monitor a public release.",
      "Present the project professionally and defend its technical decisions and limitations."
    ],
    outcomesEs: [
      "Distinguir un ejercicio académico de un proyecto que merece aparecer en un portfolio junior.",
      "Seleccionar un problema relevante, viable y defendible mediante criterios explícitos.",
      "Definir usuarios, valor, alcance, requisitos, criterios de aceptación y un MVP alcanzable.",
      "Publicar un prototipo accesible y responsive antes de comprometer la implementación.",
      "Diseñar el modelo de datos, el contrato de API y la arquitectura antes de construir.",
      "Organizar repositorio, backlog, roadmap y flujo colaborativo con Git.",
      "Construir y evolucionar un MVP full stack reutilizando lo aprendido en los demás módulos.",
      "Probar, revisar, asegurar, desplegar y observar una versión pública.",
      "Presentar profesionalmente el proyecto y defender sus decisiones técnicas y limitaciones."
    ],
    milestones: [
      "Idea selected",
      "MVP defined",
      "Prototype published",
      "Data model",
      "API designed",
      "Architecture defined",
      "Repository ready",
      "Working backend",
      "Working frontend",
      "Authentication",
      "Tests",
      "Deployment",
      "README",
      "Portfolio",
      "Technical defence"
    ],
    milestonesEs: [
      "Idea elegida",
      "MVP definido",
      "Prototipo publicado",
      "Modelo de datos",
      "API diseñada",
      "Arquitectura definida",
      "Repositorio preparado",
      "Backend funcional",
      "Frontend funcional",
      "Autenticación",
      "Tests",
      "Despliegue",
      "README",
      "Portfolio",
      "Defensa técnica"
    ],
    topics: [
      "Product discovery",
      "Prototyping and UX",
      "Data and API design",
      "Architecture",
      "Project management",
      "Full-stack development",
      "Quality and release",
      "Deployment",
      "Professional portfolio"
    ],
    topicsEs: [
      "Descubrimiento de producto",
      "Prototipado y UX",
      "Diseño de datos y API",
      "Arquitectura",
      "Gestión de proyecto",
      "Desarrollo full stack",
      "Calidad y release",
      "Despliegue",
      "Portfolio profesional"
    ],
    resources: [],
    sections: [
      {
        id: "ud-01",
        number: "UD1",
        verb: "EVALUATE",
        verbEs: "EVALUAR",
        title: "What makes a good project",
        titleEs: "Qué hace bueno a un proyecto",
        description: "Understand what separates an exercise from a project that demonstrates professional potential.",
        descriptionEs: "Entender qué separa un ejercicio de un proyecto que demuestra potencial profesional.",
        phase: "1 · DEFINE THE PROJECT",
        phaseEs: "1 · DEFINIR EL PROYECTO",
        resources: []
      },
      {
        id: "ud-02",
        number: "UD2",
        verb: "DISCOVER",
        verbEs: "DESCUBRIR",
        title: "Find a good idea",
        titleEs: "Encontrar una buena idea",
        description: "Explore real problems, compare alternatives and select one viable idea with evidence.",
        descriptionEs: "Explorar problemas reales, comparar alternativas y seleccionar una idea viable con evidencias.",
        phase: "1 · DEFINE THE PROJECT",
        phaseEs: "1 · DEFINIR EL PROYECTO",
        resources: []
      },
      {
        id: "ud-03",
        number: "UD3",
        verb: "DEFINE",
        verbEs: "DEFINIR",
        title: "Define the product",
        titleEs: "Definir el producto",
        description: "Turn the selected problem into users, value, requirements, scope, acceptance criteria and an MVP.",
        descriptionEs: "Convertir el problema elegido en usuarios, valor, requisitos, alcance, criterios de aceptación y un MVP.",
        phase: "1 · DEFINE THE PROJECT",
        phaseEs: "1 · DEFINIR EL PROYECTO",
        resources: []
      },
      {
        id: "ud-04",
        number: "UD4",
        verb: "PROTOTYPE",
        verbEs: "PROTOTIPAR",
        title: "Design the experience",
        titleEs: "Diseñar la experiencia",
        description: "Move from requirements to flows, navigation, wireframes and a public responsive prototype.",
        descriptionEs: "Pasar de los requisitos a flujos, navegación, wireframes y un prototipo responsive público.",
        phase: "1 · DEFINE THE PROJECT",
        phaseEs: "1 · DEFINIR EL PROYECTO",
        resources: []
      },
      {
        id: "ud-05",
        number: "UD5",
        verb: "MODEL",
        verbEs: "MODELAR",
        title: "Design the data",
        titleEs: "Diseñar los datos",
        description: "Identify entities, attributes, relationships, cardinalities and integrity constraints.",
        descriptionEs: "Identificar entidades, atributos, relaciones, cardinalidades y restricciones de integridad.",
        phase: "1 · DEFINE THE PROJECT",
        phaseEs: "1 · DEFINIR EL PROYECTO",
        resources: []
      },
      {
        id: "ud-06",
        number: "UD6",
        verb: "SPECIFY",
        verbEs: "ESPECIFICAR",
        title: "Design the API",
        titleEs: "Diseñar la API",
        description: "Describe what the frontend needs through resources, operations, representations and errors.",
        descriptionEs: "Describir lo que necesita el frontend mediante recursos, operaciones, representaciones y errores.",
        phase: "1 · DEFINE THE PROJECT",
        phaseEs: "1 · DEFINIR EL PROYECTO",
        resources: []
      },
      {
        id: "ud-07",
        number: "UD7",
        verb: "ARCHITECT",
        verbEs: "ARQUITECTAR",
        title: "System architecture",
        titleEs: "Arquitectura del sistema",
        description: "Connect frontend, backend, database and external services and justify every technology choice.",
        descriptionEs: "Conectar frontend, backend, base de datos y servicios externos y justificar cada elección tecnológica.",
        phase: "1 · DEFINE THE PROJECT",
        phaseEs: "1 · DEFINIR EL PROYECTO",
        resources: []
      },
      {
        id: "ud-08",
        number: "UD8",
        verb: "PLAN",
        verbEs: "PLANIFICAR",
        title: "Prepare development",
        titleEs: "Preparar el desarrollo",
        description: "Turn the product into a backlog, roadmap, repository and collaborative workflow.",
        descriptionEs: "Convertir el producto en backlog, roadmap, repositorio y flujo de trabajo colaborativo.",
        phase: "1 · DEFINE THE PROJECT",
        phaseEs: "1 · DEFINIR EL PROYECTO",
        resources: []
      },
      {
        id: "ud-09",
        number: "UD9",
        verb: "BUILD",
        verbEs: "CONSTRUIR",
        title: "MVP development",
        titleEs: "Desarrollo del MVP",
        description: "Build the first usable version by integrating backend, persistence, API, frontend and authentication.",
        descriptionEs: "Construir la primera versión utilizable integrando backend, persistencia, API, frontend y autenticación.",
        phase: "2 · BUILD AND PUBLISH",
        phaseEs: "2 · CONSTRUIR Y PUBLICAR",
        resources: []
      },
      {
        id: "ud-10",
        number: "UD10",
        verb: "EVOLVE",
        verbEs: "EVOLUCIONAR",
        title: "Evolve the product",
        titleEs: "Evolucionar el producto",
        description: "Use feedback, bugs and changing requirements to produce a better second version.",
        descriptionEs: "Usar feedback, errores y cambios de requisitos para producir una segunda versión mejor.",
        phase: "2 · BUILD AND PUBLISH",
        phaseEs: "2 · CONSTRUIR Y PUBLICAR",
        resources: []
      },
      {
        id: "ud-11",
        number: "UD11",
        verb: "ASSURE",
        verbEs: "ASEGURAR",
        title: "Quality and release candidate",
        titleEs: "Calidad y release candidate",
        description: "Consolidate testing, validation, errors, security, performance, accessibility and code review.",
        descriptionEs: "Consolidar testing, validación, errores, seguridad, rendimiento, accesibilidad y revisión de código.",
        phase: "2 · BUILD AND PUBLISH",
        phaseEs: "2 · CONSTRUIR Y PUBLICAR",
        resources: []
      },
      {
        id: "ud-12",
        number: "UD12",
        verb: "PUBLISH",
        verbEs: "PUBLICAR",
        title: "Deployment",
        titleEs: "Despliegue",
        description: "Move from development to a public production environment with configuration, HTTPS, logs and final checks.",
        descriptionEs: "Pasar de desarrollo a un entorno público de producción con configuración, HTTPS, logs y comprobaciones finales.",
        phase: "2 · BUILD AND PUBLISH",
        phaseEs: "2 · CONSTRUIR Y PUBLICAR",
        resources: []
      },
      {
        id: "ud-13",
        number: "UD13",
        verb: "PRESENT",
        verbEs: "PRESENTAR",
        title: "Turn it into a portfolio case study",
        titleEs: "Convertirlo en portfolio",
        description: "Prepare the repository, README, visuals, demo and professional narrative used to show the project.",
        descriptionEs: "Preparar repositorio, README, elementos visuales, demo y relato profesional con el que enseñar el proyecto.",
        phase: "3 · TURN IT INTO A PORTFOLIO",
        phaseEs: "3 · CONVERTIRLO EN PORTFOLIO",
        resources: []
      },
      {
        id: "ud-14",
        number: "UD14",
        verb: "DEFEND",
        verbEs: "DEFENDER",
        title: "Technical defence",
        titleEs: "Defensa técnica",
        description: "Explain the problem, demonstrate the solution and defend architecture, decisions, mistakes and limitations.",
        descriptionEs: "Explicar el problema, demostrar la solución y defender arquitectura, decisiones, errores y limitaciones.",
        phase: "3 · TURN IT INTO A PORTFOLIO",
        phaseEs: "3 · CONVERTIRLO EN PORTFOLIO",
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

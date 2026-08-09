export const site = {
  name: "Marc Semper Lloret",
  publishingName: "Marc Semper",
  shortDescription:
    "Marc Semper Lloret is a researcher at the University of Alicante working on spatiotemporal AI, graph neural networks, environmental forecasting and sensor data quality.",
  shortDescriptionEs:
    "Marc Semper Lloret es investigador en la Universidad de Alicante centrado en IA espacio-temporal, redes neuronales en grafos, predicción ambiental y calidad de datos de sensores.",
  url: "https://marcsemperlloret.com",
  portrait: "/marc-semper-lloret.jpg",
  defaultSocialImage: "/og-default.png",
  lastUpdated: "2026-08-09",
  email: "marc.semper@ua.es",
  affiliation: "University of Alicante",
  department: "Department of Computer Science and Artificial Intelligence",
  group: "Network Data Analysis and Visualisation research group (ANVIDA)",
  profiles: {
    orcid: "https://orcid.org/0009-0002-5552-1420",
    scholar: "https://scholar.google.com/citations?user=yQoG3_kAAAAJ",
    github: "https://github.com/MarcSemperLloret",
    rua: "https://rua.ua.es/entities/person/bef73845-d7fe-433d-a19f-da79a65a9269",
    university:
      "https://observatorio-cientifico.ua.es/investigadores/871592/detalle",
    cvnet:
      "https://cvnet.cpd.ua.es/curriculum-breve/es/semper-lloret-marc/357798",
    linkedin: "https://www.linkedin.com/in/marcsemper/",
    researchgate: "https://www.researchgate.net/profile/Marc-Semper-2",
    academia: "https://alicante.academia.edu/MarcSemperLloret",
    scopus:
      "https://www.scopus.com/authid/detail.uri?authorId=59404623900",
    webOfScience:
      "https://www.webofscience.com/wos/author/record/QAY-4055-2026",
    wikidata: "https://www.wikidata.org/wiki/Q140953650"
  }
} as const;

export const researchAreas = [
  {
    number: "01",
    slug: "reliable-spatiotemporal-ai",
    title: "Reliable spatiotemporal AI",
    titleEs: "IA espacio-temporal fiable",
    description:
      "Evaluation and selection methods for forecasting systems that must remain dependable under missing data, sensor failures, spatial misalignment and changing deployment conditions.",
    descriptionEs:
      "Métodos de evaluación y selección para sistemas de predicción que deben seguir siendo fiables ante datos ausentes, fallos de sensores, desalineación espacial y cambios en el despliegue.",
    overview:
      "A forecasting model is useful only when the decision to deploy it remains defensible outside a single clean benchmark. This area studies the full post-training decision: how evaluation references can fail, when that failure changes model rankings and which selection rule is justified under an explicit performance budget.",
    overviewEs:
      "Un modelo predictivo solo es útil cuando la decisión de desplegarlo sigue siendo defendible fuera de un único benchmark limpio. Esta área estudia la decisión posterior al entrenamiento: cómo puede fallar la referencia de evaluación, cuándo ese fallo altera el ranking de modelos y qué regla de selección se justifica bajo un presupuesto explícito de rendimiento.",
    questions: [
      "Does the selected model remain the same when the evaluation reference is missing, shifted or degraded?",
      "Is the observed selection instability larger than ordinary training-seed variability?",
      "When does robustness justify a measurable clean-performance cost?"
    ],
    questionsEs: [
      "¿Se mantiene el modelo elegido cuando la referencia de evaluación está incompleta, desplazada o degradada?",
      "¿Es la inestabilidad observada mayor que la variabilidad ordinaria entre semillas de entrenamiento?",
      "¿Cuándo justifica la robustez un coste medible en rendimiento limpio?"
    ],
    methods: ["Stress testing", "Selection regret", "Decision rules", "Audit trails"],
    topics: ["Robust evaluation", "Distribution shift", "Model selection"],
    publicationSlugs: ["robust-post-training-model-selection"]
  },
  {
    number: "02",
    slug: "graph-learning-sensor-systems",
    title: "Graph learning for sensor systems",
    titleEs: "Aprendizaje en grafos para sistemas de sensores",
    description:
      "Graph neural networks that capture relationships across distributed environmental sensors, cities and global observational grids.",
    descriptionEs:
      "Redes neuronales de grafos que capturan relaciones entre sensores ambientales distribuidos, ciudades y mallas de observación global.",
    overview:
      "Environmental observations are connected by geography, transport processes and shared context. Graph learning makes those relationships explicit, from local monitoring stations to global grids, and combines them with temporal models that represent how signals evolve.",
    overviewEs:
      "Las observaciones ambientales están conectadas por la geografía, los procesos de transporte y el contexto compartido. El aprendizaje en grafos hace explícitas esas relaciones, desde estaciones locales hasta mallas globales, y las combina con modelos temporales que representan la evolución de las señales.",
    questions: [
      "Which graph structure captures both local and long-range environmental dependencies?",
      "How can node representations transfer across related sensor networks?",
      "Which spatial and temporal components account for an observed performance gain?"
    ],
    questionsEs: [
      "¿Qué estructura de grafo captura dependencias ambientales locales y de largo alcance?",
      "¿Cómo pueden transferirse las representaciones de nodos entre redes de sensores relacionadas?",
      "¿Qué componentes espaciales y temporales explican una mejora observada?"
    ],
    methods: ["GraphSAGE", "Spectral learning", "Message passing", "Graph transformers"],
    topics: ["Graph neural networks", "Sensor networks", "Forecasting"],
    publicationSlugs: [
      "multi-dataset-training-spatiotemporal",
      "global-aerosol-optical-depth",
      "inter-city-air-quality",
      "noise-pollution-madrid",
      "global-carbon-concentration"
    ]
  },
  {
    number: "03",
    slug: "environmental-data-quality",
    title: "Environmental data quality",
    titleEs: "Calidad de datos ambientales",
    description:
      "The effect of missingness, observational uncertainty, aggregation and measurement inconsistencies on learned models and the decisions built on them.",
    descriptionEs:
      "El efecto de los datos ausentes, la incertidumbre observacional, la agregación y las inconsistencias de medida sobre los modelos aprendidos y las decisiones resultantes.",
    overview:
      "Sensor and reference data are part of the model-selection system, not neutral inputs. This line examines how missingness, substitution, spatial mismatch and measurement degradation propagate into evaluation results and deployment recommendations.",
    overviewEs:
      "Los datos de sensores y de referencia forman parte del sistema de selección, no son entradas neutrales. Esta línea analiza cómo los datos ausentes, la sustitución, la desalineación espacial y la degradación de medidas se propagan hasta la evaluación y la recomendación de despliegue.",
    questions: [
      "Which data-quality failures are credible for a particular deployment?",
      "How sensitive are reported conclusions to aggregation and reference choice?",
      "Can provenance and perturbation assumptions be made auditable?"
    ],
    questionsEs: [
      "¿Qué fallos de calidad son plausibles para un despliegue concreto?",
      "¿Hasta qué punto dependen las conclusiones de la agregación y de la referencia elegida?",
      "¿Pueden auditarse la procedencia y los supuestos de perturbación?"
    ],
    methods: ["Reference perturbation", "Missing-data analysis", "Provenance", "Sensitivity analysis"],
    topics: ["Data quality", "Uncertainty", "Provenance"],
    publicationSlugs: [
      "gpm-imerg-precipitation-extremes-valencia",
      "robust-post-training-model-selection",
      "inter-city-air-quality"
    ]
  },
  {
    number: "04",
    slug: "environmental-forecasting",
    title: "Environmental forecasting",
    titleEs: "Predicción ambiental",
    description:
      "AI methods for air quality, atmospheric aerosols, greenhouse-gas concentrations, urban noise and other environmental phenomena.",
    descriptionEs:
      "Métodos de IA para calidad del aire, aerosoles atmosféricos, concentraciones de gases de efecto invernadero, ruido urbano y otros fenómenos ambientales.",
    overview:
      "This application area develops spatiotemporal forecasts from monitoring networks, satellite observations, CAMS products, ERA5 meteorology and contextual variables. The goal is to represent the relevant spatial structure and temporal scale while keeping evaluation tied to the intended environmental decision.",
    overviewEs:
      "Esta área desarrolla predicciones espacio-temporales a partir de redes de monitorización, observaciones por satélite, productos CAMS, meteorología ERA5 y variables contextuales. El objetivo es representar la estructura espacial y la escala temporal relevantes, manteniendo la evaluación vinculada a la decisión ambiental prevista.",
    questions: [
      "How should global and urban environmental observations be represented?",
      "Which temporal scales matter for aerosols, gases, air quality and noise?",
      "How can forecasts support monitoring and environmental management?"
    ],
    questionsEs: [
      "¿Cómo deben representarse las observaciones ambientales globales y urbanas?",
      "¿Qué escalas temporales importan para aerosoles, gases, calidad del aire y ruido?",
      "¿Cómo pueden las predicciones apoyar la monitorización y la gestión ambiental?"
    ],
    methods: ["CAMS", "ERA5", "Satellite observations", "Environmental sensor networks"],
    topics: ["Air quality", "Climate data", "Decision support"],
    publicationSlugs: [
      "gpm-imerg-precipitation-extremes-valencia",
      "global-aerosol-optical-depth",
      "inter-city-air-quality",
      "noise-pollution-madrid",
      "global-carbon-concentration"
    ]
  }
] as const;

export type ResearchArea = (typeof researchAreas)[number];

export function formatSiteDate(locale: "en-GB" | "es-ES"): string {
  return new Date(`${site.lastUpdated}T00:00:00Z`).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  });
}

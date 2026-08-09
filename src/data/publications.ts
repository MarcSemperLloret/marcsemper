import { formatSiteDate } from "./site";

export type PublicationType = "Journal article";

export interface Publication {
  slug: string;
  title: string;
  authors: string[];
  year: number;
  onlineDate: string;
  type: PublicationType;
  venue: string;
  volume?: string;
  issue?: string;
  pages?: string;
  articleNumber?: string;
  doi: string;
  status?: string;
  selected?: boolean;
  abstract?: string;
  metaDescription: string;
  plainSummary?: string;
  plainSummaryEs?: string;
  contribution?: string;
  contributionEs?: string;
  finding?: string;
  findingEs?: string;
  topics: string[];
  models?: string[];
  dataSources?: string[];
  relatedSlugs: string[];
  manuscriptUrl?: string;
  pdfUrl?: string;
  codeUrl?: string;
}

export const publications: Publication[] = [
  {
    slug: "gpm-imerg-precipitation-extremes-valencia",
    title:
      "Performance limits of GPM IMERG for sub-daily precipitation extremes over the Comunitat Valenciana, eastern Spain: Representativeness, attenuation, and pixel-scale displacement",
    authors: [
      "Marc Semper",
      "Manuel Curado",
      "Jose F. Vicent",
      "Leandro Tortosa"
    ],
    year: 2026,
    onlineDate: "2026-08-07",
    type: "Journal article",
    venue: "Atmospheric Research",
    articleNumber: "109244",
    doi: "10.1016/j.atmosres.2026.109244",
    status: "Available online",
    selected: true,
    metaDescription:
      "Evaluation of GPM IMERG satellite precipitation limits under sub-daily extreme rainfall events in the Comunitat Valenciana.",
    plainSummary:
      "This study evaluates the operational boundaries and fidelity of GPM IMERG satellite precipitation estimates during sub-daily extreme rainfall events across eastern Spain. By auditing half-hourly gauge co-availability, spatial displacement, and peak attenuation, the work establishes where satellite observations reliably capture extreme dynamics and where observational uncertainty requires auditable correction.",
    plainSummaryEs:
      "Este estudio evalúa los límites operativos y la fidelidad del producto satelital GPM IMERG en episodios de precipitación extrema subdiaria en el levante español. Mediante una auditoría de coincidencia de pluviómetros semihorarios, desplazamiento espacial y atenuación de picos, el trabajo establece en qué condiciones la observación satelital representa los extremos locales y dónde exige corrección auditable.",
    contribution:
      "A rigorous empirical audit of sub-daily GPM IMERG satellite estimates during Mediterranean extreme precipitation, quantifying pixel displacement, peak attenuation, and gauge representation uncertainty.",
    contributionEs:
      "Una auditoría empírica rigurosa de las estimaciones satelitales GPM IMERG subdiarias durante eventos extremos mediterráneos, cuantificando el desplazamiento por píxel, la atenuación de picos y la incertidumbre de representación.",
    finding:
      "GPM IMERG captures general temporal dynamics during extreme events but exhibits significant peak attenuation and spatial misalignment at half-hourly resolution, setting empirical bounds for operational flood and hydrological risk modeling.",
    findingEs:
      "GPM IMERG captura la dinámica temporal general durante eventos extremos, pero muestra una atenuación de picos y una desalineación espacial significativas en resolución semihoraria, fijando límites empíricos para la modelización hidrológica.",
    topics: [
      "Precipitation extremes",
      "GPM IMERG",
      "Observational uncertainty",
      "Remote sensing"
    ],
    models: ["GPM IMERG V07", "Sub-daily coarsening audit", "Displacement & attenuation diagnostics"],
    dataSources: ["GPM IMERG half-hourly precipitation", "AEMET & CHJ rain-gauge network"],
    relatedSlugs: [
      "robust-post-training-model-selection",
      "global-aerosol-optical-depth"
    ],
    codeUrl: "https://github.com/MarcSemperLloret/Operational-limits-of-GPM-IMERG"
  },
  {
    slug: "robust-post-training-model-selection",
    title:
      "A practical decision-support system for robust post-training model selection in spatiotemporal forecasting",
    authors: [
      "Marc Semper",
      "Manuel Curado",
      "Jose F. Vicent",
      "Leandro Tortosa"
    ],
    year: 2026,
    onlineDate: "2026-07-23",
    type: "Journal article",
    venue: "Knowledge-Based Systems",
    articleNumber: "116673",
    doi: "10.1016/j.knosys.2026.116673",
    status: "Available online",
    selected: true,
    abstract:
      "Model selection in spatiotemporal forecasting is commonly based on performance against one evaluation reference, although that reference may be incomplete, spatially displaced or degraded in operation. This work introduces a post-training decision-support workflow that reuses fixed prediction bundles to test a selected model across declared reference perturbations. It compares selection instability with variability across training seeds, measures selection regret, evaluates alternative decision rules and reports a deployment recommendation constrained by a clean-performance budget. Experiments cover six real datasets and a synthetic benchmark. The results show that no robust rule is universally preferable: the justified choice depends on the measured instability, the credibility of the perturbations and the available budget. On EEA-PM25-ES, robust selection changes the recommendation and reduces median decision regret from 0.1403 to 0.0000 under the declared perturbation family. The resulting workflow makes the assumptions, trade-offs and deployment recommendation traceable.",
    metaDescription:
      "A decision-support workflow for robust model selection when spatiotemporal evaluation references are uncertain.",
    plainSummary:
      "Choosing the best forecasting model from one clean validation set can produce a fragile deployment decision. This work tests whether that decision survives realistic changes to the evaluation reference and turns the diagnosis into an auditable recommendation.",
    plainSummaryEs:
      "Elegir el mejor modelo predictivo con un único conjunto de validación limpio puede producir una decisión frágil. Este trabajo comprueba si la elección sobrevive a cambios realistas en la referencia de evaluación y convierte el diagnóstico en una recomendación auditable.",
    contribution:
      "A post-training workflow that reevaluates fixed predictions, measures selection instability relative to ordinary training variability, and compares robust decision rules under a declared performance budget.",
    contributionEs:
      "Un flujo posterior al entrenamiento que reevalúa predicciones fijas, compara la inestabilidad de selección con la variabilidad ordinaria del entrenamiento y contrasta reglas robustas bajo un presupuesto declarado.",
    finding:
      "Robust selection is not automatically better. It is useful when the diagnosed instability is material and the assumed perturbations are credible; otherwise, clean selection may remain the justified choice.",
    findingEs:
      "La selección robusta no es automáticamente mejor. Resulta útil cuando la inestabilidad diagnosticada es relevante y las perturbaciones son plausibles; en caso contrario, la selección limpia puede seguir estando justificada.",
    topics: [
      "Robust model selection",
      "Evaluation uncertainty",
      "Decision support"
    ],
    models: ["Post-training decision-support system"],
    dataSources: ["EEA-PM25-ES", "Six real-world datasets", "Synthetic benchmark"],
    relatedSlugs: [
      "inter-city-air-quality",
      "multi-dataset-training-spatiotemporal"
    ],
    manuscriptUrl: "https://ssrn.com/abstract=6677988",
    codeUrl: "https://github.com/MarcSemperLloret/Decision-Support-Protocol-for-Spatiotemporal-Forecasting"
  },
  {
    slug: "multi-dataset-training-spatiotemporal",
    title:
      "Multi-Dataset Training for Improved Accuracy in Spatio-Temporal Problems: An Explainable Analysis",
    authors: [
      "Javier García-Sigüenza",
      "Alberto Real-Fernández",
      "Faraón Llorens-Largo",
      "Rafael Molina-Carmona",
      "Marc Semper"
    ],
    year: 2026,
    onlineDate: "2026-03-07",
    type: "Journal article",
    venue: "Mathematics",
    volume: "14",
    issue: "5",
    articleNumber: "908",
    doi: "10.3390/math14050908",
    selected: true,
    abstract:
      "Graph forecasting models learn an embedding for each node, but those representations are often trained independently for every dataset. This study examines whether related spatiotemporal graphs can instead contribute to a shared representation. It constructs a training collection from subgraphs of several traffic datasets, trains an adapted model across those graphs and then transfers and fine-tunes the resulting embeddings on target forecasting tasks. An explainability analysis is used to examine how multi-dataset training changes the learned node space. The transferred embeddings improve prediction accuracy on several validation datasets and remain competitive on the others, supporting multi-graph training as a practical route to stronger reusable representations.",
    metaDescription:
      "Multi-dataset graph training improves transferable node embeddings for spatiotemporal traffic forecasting.",
    plainSummary:
      "This study asks whether a graph forecasting model can learn better node representations by training across several related datasets instead of learning every representation from scratch.",
    plainSummaryEs:
      "Este estudio analiza si un modelo de predicción en grafos puede aprender mejores representaciones de nodos entrenando con varios conjuntos relacionados en lugar de comenzar desde cero en cada uno.",
    contribution:
      "A subgraph-based multi-dataset training procedure, followed by embedding transfer and fine-tuning, together with an explainability analysis of the representations.",
    contributionEs:
      "Un procedimiento de entrenamiento multiconjunto basado en subgrafos, seguido de transferencia y ajuste fino de embeddings, junto con un análisis explicativo de las representaciones.",
    finding:
      "Transferred embeddings improved prediction accuracy on several traffic datasets while remaining competitive on the others.",
    findingEs:
      "Los embeddings transferidos mejoraron la precisión en varios conjuntos de tráfico y mantuvieron resultados competitivos en los demás.",
    topics: ["Graph embeddings", "Transfer learning", "Explainability"],
    models: ["Multi-dataset graph training", "Transferable node embeddings"],
    dataSources: ["Traffic forecasting graphs", "Generated subgraph dataset"],
    relatedSlugs: [
      "inter-city-air-quality",
      "robust-post-training-model-selection"
    ]
  },
  {
    slug: "global-aerosol-optical-depth",
    title:
      "Global forecasting of aerosol optical depth through a deep learning spatiotemporal modeling",
    authors: ["Marc Semper", "Manuel Curado", "Jose F. Vicent"],
    year: 2026,
    onlineDate: "2025-12-01",
    type: "Journal article",
    venue: "International Journal of Environmental Science and Technology",
    volume: "23",
    issue: "1",
    articleNumber: "69",
    doi: "10.1007/s13762-025-06905-4",
    selected: true,
    abstract:
      "This study forecasts global aerosol optical depth by combining monthly CAMS aerosol observations with meteorological variables from ERA5. The proposed MultiscaleTCNGraphSAGE architecture uses temporal convolutions with several kernel sizes and dilation rates to represent short- and long-range dynamics, while GraphSAGE layers learn spatial dependence across the global observation graph. Against the strongest evaluated benchmark, Transformer+GCN, the model reduces RMSE by 5.4% and MAE by 6.4%, while increasing the coefficient of determination by 2.7% and Pearson correlation by 1.3%. The results also indicate improved representation of extreme aerosol events.",
    metaDescription:
      "MultiscaleTCNGraphSAGE combines CAMS, ERA5 and graph learning to forecast global aerosol optical depth.",
    plainSummary:
      "The work models how atmospheric aerosols evolve across the planet by combining a global graph of observations with temporal patterns at several scales.",
    plainSummaryEs:
      "El trabajo modela la evolución de los aerosoles atmosféricos combinando un grafo global de observaciones con patrones temporales a varias escalas.",
    contribution:
      "MultiscaleTCNGraphSAGE combines multi-scale temporal convolutions, GraphSAGE spatial learning, CAMS aerosol observations and ERA5 meteorology.",
    contributionEs:
      "MultiscaleTCNGraphSAGE combina convoluciones temporales multiescala, aprendizaje espacial GraphSAGE, observaciones de aerosoles CAMS y meteorología ERA5.",
    finding:
      "The proposed model improved all reported headline metrics over the strongest benchmark and better captured extreme aerosol events.",
    findingEs:
      "El modelo mejoró todas las métricas principales frente al benchmark más sólido y representó mejor los episodios extremos de aerosoles.",
    topics: ["Aerosols", "GraphSAGE", "Global forecasting"],
    models: ["MultiscaleTCNGraphSAGE", "Transformer+GCN"],
    dataSources: ["CAMS AOD550", "ERA5 meteorology"],
    relatedSlugs: ["global-carbon-concentration", "inter-city-air-quality"]
  },
  {
    slug: "inter-city-air-quality",
    title:
      "Spatio-temporal graph neural network for inter-city air quality forecasting",
    authors: ["Jose F. Vicent", "Manuel Curado", "Marc Semper"],
    year: 2026,
    onlineDate: "2025-11-28",
    type: "Journal article",
    venue: "International Journal of Environmental Science and Technology",
    volume: "23",
    issue: "1",
    articleNumber: "63",
    doi: "10.1007/s13762-025-06850-2",
    abstract:
      "Air-quality conditions at one monitoring station depend on both nearby observations and processes acting across longer distances. This work models those relationships using pollutant and meteorological records from a Spanish monitoring network covering 2010–2020. The architecture combines hierarchical message passing with spectral information obtained through singular value decomposition of the adjacency matrix, allowing local exchange and global graph structure to contribute to the forecast. A multilayer perceptron performs adaptive feature fusion and a trainable aggregation mechanism combines messages. Comparisons with contemporary deep-learning baselines show better results across the evaluated pollutants, supporting the combination of graph spectral information and spatiotemporal learning for inter-city forecasting.",
    metaDescription:
      "A spectral spatiotemporal graph network forecasts multiple pollutants across Spain's air-quality monitoring network.",
    plainSummary:
      "Air quality at one monitoring station is connected to conditions elsewhere. This work learns both nearby and long-range relationships across the Spanish monitoring network.",
    plainSummaryEs:
      "La calidad del aire de una estación está conectada con las condiciones de otros lugares. Este trabajo aprende relaciones cercanas y de largo alcance en la red española de monitorización.",
    contribution:
      "A graph architecture that combines hierarchical message passing, spectral information from the adjacency matrix and adaptive fusion of pollutant and meteorological variables.",
    contributionEs:
      "Una arquitectura de grafos que combina paso de mensajes jerárquico, información espectral de la matriz de adyacencia y fusión adaptativa de contaminantes y meteorología.",
    finding:
      "The approach outperformed the evaluated deep-learning baselines across the atmospheric pollutants considered.",
    findingEs:
      "El método superó a los baselines de aprendizaje profundo evaluados para todos los contaminantes atmosféricos considerados.",
    topics: ["Air quality", "Spectral graph learning", "Sensor networks"],
    models: ["Hierarchical message passing", "SVD graph representation"],
    dataSources: ["Spanish air-quality monitoring network", "Meteorological variables", "2010–2020 observations"],
    relatedSlugs: ["global-aerosol-optical-depth", "noise-pollution-madrid"]
  },
  {
    slug: "noise-pollution-madrid",
    title:
      "Noise Pollution Prediction in a Densely Populated City Using a Spatio-Temporal Deep Learning Approach",
    authors: [
      "Marc Semper",
      "Manuel Curado",
      "Jose Luis Oliver",
      "Jose F. Vicent"
    ],
    year: 2025,
    onlineDate: "2025-05-16",
    type: "Journal article",
    venue: "Applied Sciences",
    volume: "15",
    issue: "10",
    articleNumber: "5576",
    doi: "10.3390/app15105576",
    selected: true,
    abstract:
      "Urban noise varies across both time and the structure of a city. Using Madrid as a case study, this research compares convolutional, recurrent and graph-based deep-learning approaches for noise prediction. The models test complementary ways of representing local patterns, longer temporal dependencies and relationships between observation locations. The hybrid CNN1D+LSTM+TransformerConv architecture produces the strongest result, with an RMSE of 0.0169 and a correlation coefficient of 0.9601. Its error is 5.1% lower than that of the second-best evaluated model. The comparison provides evidence that an explicit graph representation adds useful spatial information to temporal sequence modelling for urban-noise forecasting.",
    metaDescription:
      "CNN1D+LSTM+TransformerConv models spatial and temporal urban-noise patterns across Madrid.",
    plainSummary:
      "Urban noise has both a temporal rhythm and a spatial structure. The study compares deep-learning approaches that represent those two dimensions explicitly across Madrid.",
    plainSummaryEs:
      "El ruido urbano tiene un ritmo temporal y una estructura espacial. El estudio compara métodos de aprendizaje profundo que representan explícitamente ambas dimensiones en Madrid.",
    contribution:
      "A hybrid CNN1D, LSTM and graph-transformer model evaluated against temporal, convolutional and graph-based alternatives.",
    contributionEs:
      "Un modelo híbrido CNN1D, LSTM y transformador de grafos evaluado frente a alternativas temporales, convolucionales y basadas en grafos.",
    finding:
      "Explicit graph structure produced the best prediction accuracy, reaching an RMSE of 0.0169 and a correlation coefficient of 0.9601.",
    findingEs:
      "La estructura explícita de grafo obtuvo la mejor precisión, con un RMSE de 0,0169 y un coeficiente de correlación de 0,9601.",
    topics: ["Urban noise", "Graph transformers", "Smart cities"],
    models: ["CNN1D+LSTM+TransformerConv", "Transformer"],
    dataSources: ["Madrid urban-noise observations"],
    relatedSlugs: ["inter-city-air-quality", "global-carbon-concentration"],
    manuscriptUrl:
      "https://rua.ua.es/server/api/core/bitstreams/63d1155c-813e-460a-a187-ca270d6945e3/content",
    pdfUrl:
      "https://rua.ua.es/server/api/core/bitstreams/63d1155c-813e-460a-a187-ca270d6945e3/content"
  },
  {
    slug: "global-carbon-concentration",
    title:
      "Global forecasting of carbon concentration through a deep learning spatiotemporal modeling",
    authors: ["Marc Semper", "Manuel Curado", "Jose F. Vicent"],
    year: 2024,
    onlineDate: "2024-11-15",
    type: "Journal article",
    venue: "Journal of Environmental Management",
    volume: "371",
    articleNumber: "122922",
    doi: "10.1016/j.jenvman.2024.122922",
    selected: true,
    abstract:
      "This research compares deep-learning strategies for six-month global forecasts of carbon dioxide and methane concentrations. The models combine satellite observations with dynamic and static environmental variables and represent measurements distributed across the planet. The comparison tests how temporal learning and an explicit spatial graph contribute to prediction quality. Graph-neural approaches obtain the strongest overall results, indicating that global relationships between observation locations add useful information beyond temporal and contextual inputs alone. The study demonstrates a practical route for integrating heterogeneous environmental information into global greenhouse-gas forecasting.",
    metaDescription:
      "Graph neural networks forecast global carbon dioxide and methane from satellite and environmental data.",
    plainSummary:
      "This research tests deep-learning strategies for forecasting global carbon dioxide and methane concentrations six months ahead from satellite and environmental data.",
    plainSummaryEs:
      "Esta investigación evalúa estrategias de aprendizaje profundo para predecir concentraciones globales de dióxido de carbono y metano a seis meses usando datos satelitales y ambientales.",
    contribution:
      "A global spatiotemporal forecasting comparison that integrates satellite observations with dynamic and static environmental variables.",
    contributionEs:
      "Una comparación global de predicción espacio-temporal que integra observaciones por satélite con variables ambientales dinámicas y estáticas.",
    finding:
      "Graph neural networks delivered the strongest results, showing the value of explicitly representing global spatial relationships.",
    findingEs:
      "Las redes neuronales de grafos obtuvieron los mejores resultados, mostrando el valor de representar explícitamente las relaciones espaciales globales.",
    topics: ["Greenhouse gases", "Satellite data", "Global forecasting"],
    models: ["Graph neural networks", "Spatiotemporal deep learning"],
    dataSources: ["Global satellite observations", "Dynamic environmental variables", "Static environmental variables"],
    relatedSlugs: ["global-aerosol-optical-depth", "noise-pollution-madrid"]
  }
];

export const selectedPublications = publications.filter(
  (publication) => publication.selected
);

export const publicationRecordReviewed = formatSiteDate("en-GB");

export function publicationCitation(publication: Publication): string {
  const details = [
    publication.venue,
    publication.volume ? `vol. ${publication.volume}` : "",
    publication.issue ? `no. ${publication.issue}` : "",
    publication.pages ? `pp. ${publication.pages}` : "",
    publication.articleNumber ? `article ${publication.articleNumber}` : "",
    `${publication.year}`
  ].filter(Boolean);

  return details.join(", ");
}

export function publicationBibtex(publication: Publication): string {
  const firstAuthorFamilyName =
    publication.authors[0]?.split(" ").at(-1)?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ??
    "article";
  const key = `${firstAuthorFamilyName}${publication.year}${publication.slug.split("-")[0]}`;
  const fields = [
    `  title = {${publication.title}}`,
    `  author = {${publication.authors.join(" and ")}}`,
    `  journal = {${publication.venue}}`,
    `  year = {${publication.year}}`,
    publication.volume ? `  volume = {${publication.volume}}` : "",
    publication.issue ? `  number = {${publication.issue}}` : "",
    publication.pages ? `  pages = {${publication.pages.replace("–", "--")}}` : "",
    publication.articleNumber ? `  eid = {${publication.articleNumber}}` : "",
    `  doi = {${publication.doi}}`
  ].filter(Boolean);

  return `@article{${key},\n${fields.join(",\n")}\n}`;
}

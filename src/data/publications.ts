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
    slug: "graph-multivariable-bias-correction-era5",
    title:
      "Graph-based multivariable bias correction of meteorological variables under strict temporal validation in a western mediterranean region prone to atmospheric instability",
    authors: ["Marc Semper", "Manuel Curado", "Jose F. Vicent"],
    year: 2026,
    onlineDate: "2026-08-25",
    type: "Journal article",
    venue: "Journal of Computational Science",
    articleNumber: "102988",
    doi: "10.1016/j.jocs.2026.102988",
    status: "Available online",
    selected: true,
    abstract:
      "Global meteorological reanalyses such as ERA5 provide spatially coherent atmospheric fields, yet sub-grid orography and complex coastal dynamics induce systematic local biases that limit their direct utility in regional hydrology, wildfire risk assessment, renewable energy, and agriculture. While traditional bias correction approaches operate variable-by-variable and tabular machine-learning baselines neglect spatial topology, this study introduces a multivariable graph-based post-processing framework designed to model both spatial-neighborhood structure and inter-variable physical dependencies. Using ground observations from the dense AVAMET weather station network across the Valencian Community (a Western Mediterranean region with complex terrain prone to severe convective instability), station records are projected onto the ERA5 grid to train a GraphSAGE architecture with Jumping Knowledge under strict, leakage-free chronological validation splits. The graph model is benchmarked against raw ERA5, an oracle classical reference, and a fixed Random Forest baseline using block-bootstrap uncertainty estimation, fixed-window seasonal robustness diagnostics, and spatial and cross-variable consistency evaluations. On the temporal test partition, GraphSAGE+JK achieves substantial error reductions across six non-precipitation variables—cutting RMSE and MAE for surface pressure, relative humidity, 2-m temperature, wind speed, wind direction, and maximum wind gust by up to 81% relative to classical models. Conversely, precipitation remains an unresolved challenge: the graph model does not improve aggregate pointwise accuracy or high-threshold extreme occurrence detection. These findings confirm the effectiveness of graph neural networks for local predictive bias correction of continuous meteorological variables while highlighting localized precipitation extremes as a key open frontier.",
    metaDescription:
      "Graph-based multivariable bias correction of ERA5 meteorological variables under strict temporal validation in the Western Mediterranean.",
    plainSummary:
      "Global atmospheric reanalyses like ERA5 exhibit persistent regional biases over complex terrain that can distort downstream hydrological, energy, and risk models. Combining local weather station networks (AVAMET) with spatial neighborhood graphs via GraphSAGE and Jumping Knowledge enables simultaneous correction across multiple meteorological variables. Rigorous chronological validation shows up to an 81% error reduction in pressure, humidity, temperature, and wind compared to classical baselines, while revealing clear operational boundaries for localized extreme precipitation.",
    plainSummaryEs:
      "Los reanálisis atmosféricos globales como ERA5 presentan sesgos orográficos y costeros sistemáticos que distorsionan modelos hidrológicos y de riesgo. Integrar la red de estaciones meteorológicas de AVAMET en una topología de grafo espacial mediante GraphSAGE y Jumping Knowledge permite corregir múltiples variables de forma simultánea. Bajo una estricta partición cronológica, el enfoque en grafos reduce el error hasta en un 81% en presión, humedad, temperatura y viento frente a modelos clásicos, delimitando a su vez las fronteras operativas en precipitación extrema.",
    contribution:
      "A multivariable graph neural network post-processing framework that captures spatial-neighborhood context and inter-variable dependencies to correct ERA5 biases, evaluated under leakage-free chronological splits, uncertainty bounds, and seasonal robustness tests.",
    contributionEs:
      "Un marco de post-procesamiento multivariable mediante redes neuronales en grafos que captura la topología espacial de vecindad y las dependencias entre variables para corregir sesgos de ERA5, evaluado bajo particiones cronológicas sin fugas, intervalos de incertidumbre y robustez estacional.",
    finding:
      "GraphSAGE with Jumping Knowledge reduces RMSE and MAE across six non-precipitation variables (surface pressure, relative humidity, 2-m temperature, wind speed, wind direction, and wind gust) by up to 81% over classical and tabular baselines, while extreme precipitation remains an open challenge for spatial graph post-processing.",
    findingEs:
      "GraphSAGE con Jumping Knowledge reduce el RMSE y el MAE en seis variables no pluviométricas (presión superficial, humedad relativa, temperatura a 2 m, velocidad, dirección y ráfaga de viento) hasta en un 81% respecto a modelos clásicos y tabulares, mientras que la precipitación extrema sigue siendo un desafío abierto.",
    topics: [
      "Bias correction",
      "ERA5 reanalysis",
      "Graph neural networks",
      "Meteorological post-processing",
      "Spatial dependencies"
    ],
    models: [
      "GraphSAGE + Jumping Knowledge",
      "Random Forest reference",
      "Oracle classical reference"
    ],
    dataSources: [
      "ERA5 reanalysis (ECMWF)",
      "AVAMET weather station network (Valencian Community)"
    ],
    relatedSlugs: [
      "out-of-sample-correctability-limits-imerg-precipitation-extremes",
      "gpm-imerg-precipitation-extremes-valencia",
      "global-aerosol-optical-depth"
    ]
  },
  {
    slug: "out-of-sample-correctability-limits-imerg-precipitation-extremes",
    title:
      "Out-of-sample statistical correctability limits under an uncertain operational reference: the case of IMERG sub-daily areal precipitation extremes",
    authors: [
      "Marc Semper",
      "Manuel Curado",
      "Jose F. Vicent",
      "Leandro Tortosa"
    ],
    year: 2026,
    onlineDate: "2026-08-14",
    type: "Journal article",
    venue: "Stochastic Environmental Research and Risk Assessment",
    volume: "40",
    issue: "8",
    articleNumber: "202",
    doi: "10.1007/s00477-026-03336-6",
    status: "Available online",
    selected: true,
    abstract:
      "We present a statistical assessment of out-of-sample correctability limits under observational uncertainty, using GPM IMERG Final V07 sub-daily areal precipitation extremes over the Comunitat Valenciana (eastern Spain) and the dense AVAMET network (556 gauges, 2019–2025). Rather than treating gauges as point truth, we construct a gauge-derived multi-station operational areal reference proxy at 30 min over 126 IMERG cells and build a closed benchmark at 1, 3, and 6 h under year-holdout, province-holdout, and event-fold validation. The benchmark compares raw IMERG (M0), two simple statistical corrections (M1–M2), a continuous LightGBM corrector (M3), a two-stage tail-oriented LightGBM model (M3b), and a conservative patch-based CNN specialist (M4). We further evaluate reference sensitivity under alternative proxy definitions and pseudo leave-one-gauge-out perturbations, and we treat direct probabilistic exceedance modelling as a core benchmark component alongside deterministic correction. Under the main operational-median proxy, M3 is the best global continuous corrector at all scales, reducing event-fold RMSE from 0.461 to 0.360 at 1 h, from 0.801 to 0.578 at 3 h, and from 1.445 to 1.259 at 6 h. However, these gains do not translate into clean recovery of severe and extreme events under fixed operational thresholds. Tail-oriented models improve severe-event skill relative to M3 at 3 h and 6 h, but only modestly, while fixed extreme recovery remains weak across reference perturbations and hard holdouts. The conservative local deep-learning specialist does not materially improve the tail-oriented tabular baseline. About half of the severe and extreme cases occur in cells with the minimum observational support of two gauges, and local jackknife diagnostics show increasing proxy sensitivity in the upper tail. Peak and alignment-oracle diagnostics indicate that residual error is only partly explained by local spatiotemporal misalignment; substantial amplitude underestimation persists even after temporal and neighborhood tolerance, and IMERG often enters far below the operational threshold in observed extreme cases. Importantly, direct probabilistic exceedance modelling emerges as the main positive result: it provides robust out-of-sample risk ranking for severe and extreme exceedance across split families, although operational precision remains limited by event rarity. Overall, the results support partial out-of-sample correctability of IMERG sub-daily areal extremes under an operational areal proxy, while probabilistic risk ranking emerges as the central operational output when clean deterministic recovery of the fixed extreme tail remains unattained. For operational use, the most cautious interpretation is to pair continuous correction with direct probabilistic risk ranking rather than rely on corrected satellite estimates alone for threshold-based event detection in early-warning or hazard-screening applications.",
    metaDescription:
      "Out-of-sample statistical correctability limits of GPM IMERG sub-daily areal precipitation extremes under observational reference uncertainty.",
    plainSummary:
      "Correcting sub-daily satellite precipitation extremes (GPM IMERG V07) with machine learning becomes challenging when the ground observational reference itself carries spatial and density uncertainties. Benchmarking tabular models (LightGBM) and spatial deep learning (CNN) across strict temporal, spatial, and event-based holdouts demonstrates that continuous post-processing reliably reduces bulk error, but deterministic recovery of heavy rainfall tails hits fundamental limits. Direct probabilistic exceedance modeling provides the most dependable operational ranking for early warning and hazard screening.",
    plainSummaryEs:
      "La corrección de extremos satelitales subdiarios de precipitación (GPM IMERG V07) mediante aprendizaje automático se complica cuando la propia referencia en superficie presenta incertidumbre observacional. La evaluación de modelos tabulares (LightGBM) y redes convolucionales (CNN) bajo particiones estrictas por año, provincia y evento demuestra que el post-procesamiento continuo reduce eficazmente el error global, pero la reconstrucción determinista de colas extremas alcanza límites estructurales. En su lugar, el modelado probabilístico de superación de umbrales se consolida como la salida operativa más sólida para alerta temprana.",
    contribution:
      "A systematic evaluation of satellite precipitation extreme correctability limits under operational reference uncertainty, benchmarking tabular, deep learning, and probabilistic exceedance models across out-of-sample validation splits.",
    contributionEs:
      "Una evaluación sistemática de los límites de corregibilidad de precipitación satelital extrema bajo incertidumbre de referencia operativa, comparando modelos tabulares, de aprendizaje profundo y de superación probabilística bajo particiones fuera de muestra.",
    finding:
      "Continuous correction with LightGBM reduces global RMSE significantly across sub-daily timescales (e.g. from 0.461 to 0.360 at 1 h), but fixed extreme events remain difficult to reconstruct deterministically. Direct probabilistic exceedance modeling provides the most robust risk ranking for operational hazard screening.",
    findingEs:
      "La corrección continua con LightGBM reduce sustancialmente el RMSE global en escalas subdiarias (de 0.461 a 0.360 a 1 h), pero los eventos extremos fijos son difíciles de reconstruir de forma determinista. El modelado probabilístico directo ofrece la ordenación de riesgo más robusta para sistemas de alerta temprana.",
    topics: [
      "Precipitation extremes",
      "GPM IMERG",
      "Correctability limits",
      "Probabilistic risk ranking",
      "Remote sensing"
    ],
    models: ["LightGBM (M3/M3b)", "CNN spatial specialist (M4)", "Probabilistic exceedance model"],
    dataSources: ["GPM IMERG Final V07", "AVAMET rain-gauge network (556 gauges, 2019-2025)"],
    relatedSlugs: [
      "graph-multivariable-bias-correction-era5",
      "gpm-imerg-precipitation-extremes-valencia",
      "robust-post-training-model-selection"
    ]
  },
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
      "Operational satellite precipitation products often struggle during Mediterranean flash floods due to rapid convective dynamics and steep orography. Auditing half-hourly GPM IMERG estimates against high-density rain-gauge networks quantifies pixel-scale spatial displacement, severe peak attenuation, and gauge co-availability limits, defining empirical boundaries for satellite-driven hydrological and flood modeling.",
    plainSummaryEs:
      "Las estimaciones satelitales de precipitación suelen presentar discrepancias críticas durante episodios torrenciales mediterráneos debido a la rápida convección y la orografía escarpada. Auditar el producto semihorario GPM IMERG frente a redes pluviométricas de alta densidad cuantifica desplazamientos espaciales por píxel, atenuaciones severas de picos e incertidumbres de muestreo, delimitando con precisión su validez empírica en modelización hidrológica y alertas por inundación.",
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
      "Selecting the best forecasting model from a single clean validation set often leads to brittle deployment decisions when real-world evaluation data is missing, displaced, or degraded. Re-evaluating fixed predictions across declared reference perturbations, quantifying selection instability relative to training-seed variance, and balancing performance budgets transforms fragile model selection into an auditable decision-support system.",
    plainSummaryEs:
      "Seleccionar el mejor modelo predictivo a partir de un único conjunto de validación limpio suele generar decisiones de despliegue frágiles ante referencias de evaluación incompletas, degradadas o desplazadas en entornos reales. Reevaluar predicciones fijas bajo perturbaciones plausibles, comparar la inestabilidad de elección con la varianza del entrenamiento y ajustar presupuestos de pérdida controlada convierte la selección de modelos en un sistema auditable de apoyo a la decisión.",
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
      "Graph forecasting architectures typically train individual node embeddings in isolation for every separate dataset. Extracting subgraphs across multiple related spatiotemporal networks and transferring the learned representations enables cross-domain knowledge reuse, improving prediction accuracy on target tasks while providing explainable insights into the shared node space.",
    plainSummaryEs:
      "Las arquitecturas de predicción en grafos suelen entrenar representaciones de nodos desde cero y de forma aislada para cada conjunto de datos. Extraer subgrafos de múltiples redes espacio-temporales y transferir los embeddings aprendidos permite reutilizar conocimiento estructural entre dominios, mejorando la precisión predictiva en tareas de destino y aportando explicabilidad sobre el espacio latente compartido.",
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
      "Forecasting global atmospheric aerosols requires capturing both worldwide spatial transport mechanisms and multi-scale temporal dynamics. Combining CAMS aerosol records with ERA5 meteorological forcing in a hybrid architecture (MultiscaleTCNGraphSAGE) outperforms state-of-the-art transformer and graph baselines, yielding superior representation of extreme aerosol episodes.",
    plainSummaryEs:
      "Predecir la distribución global de aerosoles atmosféricos exige capturar tanto el transporte espacial a escala planetaria como dinámicas temporales en múltiples frecuencias. La combinación de observaciones de CAMS con variables meteorológicas de ERA5 en una arquitectura híbrida (MultiscaleTCNGraphSAGE) supera a transformadores y modelos de grafos de referencia, mejorando notablemente la estimación de episodios de polvo y contaminación extrema.",
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
      "Air pollutant concentrations at any given station depend simultaneously on local emissions, nearby sensor readings, and long-range atmospheric transport across distant urban centers. Coupling hierarchical message passing with spectral graph representations from adjacency singular value decomposition enables accurate multi-pollutant forecasting across extensive national monitoring networks.",
    plainSummaryEs:
      "La concentración de contaminantes atmosféricos en una estación depende tanto de emisiones locales y lecturas de sensores vecinos como del transporte aéreo de largo alcance entre ciudades. Combinar el paso de mensajes jerárquico con información espectral de la matriz de adyacencia (mediante descomposición en valores singulares) permite modelar simultáneamente dinámicas locales y estructurales en la red nacional de monitorización.",
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
      "Urban acoustic pollution exhibits strong cyclic temporal patterns driven by human activity alongside spatial correlations governed by street topology and urban morphology. Integrating 1D temporal convolutions, recurrent LSTM memory, and graph transformer layers (CNN1D+LSTM+TransformerConv) delivers highly accurate predictive mapping across Madrid's urban sensor grid.",
    plainSummaryEs:
      "La contaminación acústica en grandes urbes combina ritmos temporales marcados por la actividad humana con dependencias espaciales fijadas por la morfología y el trazado de la ciudad. Una arquitectura híbrida que une convoluciones temporales 1D, memoria recurrente LSTM y capas de transformadores de grafos (CNN1D+LSTM+TransformerConv) alcanza una alta precisión predictiva sobre la red de sensores de Madrid.",
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
      "Projecting global carbon dioxide and methane concentrations up to six months ahead demands architectures capable of synthesizing satellite observations with dynamic and static environmental covariates. Formulating the planetary observation system as an explicit spatiotemporal graph neural network provides superior predictive accuracy over purely temporal methods, underscoring the importance of global spatial connectivity in greenhouse gas dynamics.",
    plainSummaryEs:
      "Proyectar las concentraciones globales de dióxido de carbono y metano a seis meses vista requiere integrar observaciones por satélite con covariables ambientales dinámicas y estáticas. Modelar el sistema de monitorización planetario mediante redes neuronales de grafos espacio-temporales supera a los enfoques exclusivamente temporales, demostrando el valor de representar explícitamente la conectividad espacial global en los gases de efecto invernadero.",
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

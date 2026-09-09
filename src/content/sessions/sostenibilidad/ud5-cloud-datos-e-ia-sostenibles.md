---
title: "Cloud, datos e inteligencia artificial sostenibles"
label: "UD5 · Proyecto"
section: "ud-05"
order: 5
lang: "es"
summary: "Una aplicación puede estar perfectamente programada y consumir muchos más recursos de los necesarios. Aprendemos a decidir sobre cloud, almacenamiento, datos e IA teniendo en cuenta a la vez rendimiento, coste y sostenibilidad."
duration: "4 horas · 4 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Decisiones de cloud, datos e IA. Una actividad acumulativa por unidad, con evidencias y aportación individual."
outcomes:
  - "Explicar por qué usar cloud no elimina el impacto físico de una aplicación."
  - "Detectar infraestructura sobredimensionada y recursos olvidados."
  - "Aplicar la idea de right-sizing sin caer en dimensionar por debajo."
  - "Decidir qué datos merece la pena guardar y durante cuánto tiempo."
  - "Escribir una política de retención sencilla y defendible, contando con lo que exige la normativa."
  - "Elegir entre una regla, un algoritmo, un modelo pequeño y uno generativo."
  - "Justificar una decisión técnica por utilidad, coste y recursos a la vez."
requirements:
  - "Guía de arranque y materiales de esta unidad, enlazados en la página."
  - "Carpeta o documento de actividad compartido con el docente."
priorKnowledge:
  - "Las unidades anteriores de este módulo. No se requiere Servidor, Intermodular ni el otro módulo transversal."
date: "2026-09-09"
---

<p class="lead">Decisiones de cloud, datos e IA. Cada sesión introduce los conceptos que necesita y continúa una misma actividad de la unidad. Conserva sus resultados para revisarlos y utilizarlos después.</p>

## Cómo trabajar esta unidad

Son 4 sesiones de una hora: 10 minutos de explicación, 45 de trabajo guiado y 5 de cierre. Si el periodo del centro es de 55 minutos, se ajusta el trabajo a 40 minutos. Los ejemplos ampliados son material de consulta durante la práctica; no añaden otra clase teórica ni tareas obligatorias.

Abre la [guía de arranque y evaluación](/es/docencia/talleres-transversales/). Incluye archivos, herramientas y alternativas de acceso. Para los casos utiliza la [ficha común](/teaching/transversales/casos.pdf). No se necesita el CRUD de Servidor ni el workflow de Intermodular. Quien ya conozca una herramienta utiliza ese conocimiento para justificar y comprobar la actividad nueva, sin repetir una entrega ya evaluada.

## Actividad y criterios de evaluación

**Decisiones de cloud, datos e IA.** Guarda el trabajo en `sostenibilidad/ud5/`, y redacta la actividad en Word, LibreOffice o un documento en línea; exporta la entrega a PDF. Cada sesión añade su avance, comprobación y pendiente; no se entrega un informe diferente por sesión. Cuando haya código, enlaza el repositorio y la versión o adjunta la carpeta identificada según el canal del aula. Nunca incluyas credenciales.

Esta actividad se valora sobre 10 puntos y aporta **4/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Cada integrante registra y explica su aportación. La rúbrica se conoce desde el inicio:

| Criterio                                        | Puntos |
| ----------------------------------------------- | -----: |
| Comprensión del uso de recursos cloud           |    1,5 |
| Aplicación de right-sizing y escalado           |    1,5 |
| Gestión razonada del ciclo de vida de los datos |      2 |
| **Elección proporcional de soluciones de IA**   |  **2** |
| Análisis de coste, rendimiento y sostenibilidad |    1,5 |
| Uso crítico de IA                               |      1 |
| Claridad de la entrega                          |    0,5 |

En cada criterio, una evidencia ausente no permite acreditar el logro; una evidencia incompleta requiere revisión; una evidencia correcta permite comprobar el resultado; el logro completo añade una justificación coherente y reconoce sus límites. Los puntos se asignan según el grado de logro del criterio, no por cantidad de archivos, commits o texto. Consulta la guía para revisar y volver a presentar los criterios pendientes.

## Sesión 1 · Cloud no significa recursos infinitos

**Punto de partida.** Actividad «Decisiones de cloud, datos e IA», sesión 1 de 4. Abre los materiales enlazados y crea el registro de la unidad. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

El **dimensionamiento** ajusta recursos a una necesidad. Tener cuatro máquinas casi vacías puede indicar una oportunidad de revisión, pero reducirlas sin comprobar disponibilidad o redundancia puede deteriorar el servicio. Necesitamos observar carga, picos y requisitos antes de decidir.

El escalado permite ajustar capacidad según demanda; mantener el máximo de una campaña durante todo el año no siempre es proporcional. En esta unidad trabajaremos con cifras del caso, sin contratar servicios ni configurar infraestructura. Digitalización y Servidor no son requisitos de acceso.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### Right-sizing

<p class="term">Right-sizing</p>

Usar recursos adecuados a la carga real de la aplicación. Ni demasiado pocos, ni muchos más de los necesarios.

Un ejemplo típico: una aplicación que usa de media un 15 % de CPU y un 25 % de RAM, sobre una máquina virtual de 16 CPU y 64 GB. Eso significa mayor coste, más recursos reservados e infraestructura infrautilizada.

Pero cuidado con la conclusión fácil:

<div class="compare-pair">
  <div>
    <p class="compare-label">Falso</p>
    <p class="compare-body">Menos recursos siempre es mejor.</p>
  </div>
  <div>
    <p class="compare-label">Cierto</p>
    <p class="compare-body">Los recursos se ajustan a la necesidad real, incluidos los picos.</p>
  </div>
</div>

Una máquina demasiado pequeña provoca lentitud, errores, caídas, mala experiencia y falta de capacidad justo cuando más gente llega. Dimensionar por debajo no es sostenibilidad: es un fallo de servicio con otro nombre.

#### Escalado

No hace falta mantener siempre toda la capacidad que necesitaremos en un pico:

<figure class="diagram">
  <figcaption>La capacidad sigue a la carga</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Carga baja · pocos recursos</li>
    <li>Carga alta · más recursos</li>
    <li>Carga baja otra vez · se devuelven</li>
  </ol>
</figure>

A eso lo llamamos **escalado**, y cuando ocurre solo:

<p class="term">Autoscaling</p>

La idea es tener capacidad cuando hace falta y dejar de pagarla —y de ocuparla— cuando deja de hacer falta.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre los siete escenarios de PixelStore y crea la tabla de UD5: necesidad, datos, propuesta, riesgo y comprobación. Empieza por la web corporativa, distinta de la tienda.
2. Examina sus cuatro máquinas al 5 % de CPU y 12 % de RAM. Explica por qué sugieren revisar capacidad y qué falta saber antes de retirar una máquina.
3. Compara conservar todo, reducir capacidad y usar un servicio más sencillo. Anota un beneficio y un riesgo de cada alternativa, sin inventar una factura real.
4. Analiza la campaña de 2.000 a 40.000 usuarios simultáneos. Propón cómo comprobar la capacidad necesaria y cuándo ampliar o reducir recursos.
5. Incluye quién revisaría recursos olvidados y con qué frecuencia. Guarda una decisión provisional y los datos que la harían cambiar.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Las propuestas responden a carga y servicio. «Menos máquinas» no se presenta como solución correcta sin comprobar las condiciones de uso.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD5 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 1»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 2 · ¿Hay que guardarlo todo para siempre?

**Punto de partida.** Actividad «Decisiones de cloud, datos e IA», sesión 2 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

El **ciclo de vida del dato** empieza cuando se recoge y termina cuando se elimina o conserva de forma justificada. Una política de retención define finalidad, acceso, plazo o criterio de revisión y tratamiento posterior. No basta con guardar todo «por si acaso» ni con borrar por ocupar espacio.

Logs y copias tienen finalidades distintas. Un backup sirve para recuperar; los logs pueden ayudar a investigar incidencias. Debemos considerar necesidades operativas y restricciones aplicables antes de proponer plazos. Los plazos del ejercicio son decisiones a justificar, no asesoramiento legal.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### El ciclo de vida del dato

<figure class="diagram">
  <figcaption>Un dato también tiene etapas</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Crear</li>
    <li>Utilizar</li>
    <li>Almacenar</li>
    <li>Consultar</li>
    <li>Archivar</li>
    <li>Eliminar</li>
  </ol>
</figure>

Y no todos se usan igual:

<div class="compare-pair">
  <div>
    <p class="compare-label">Hot data</p>
    <p class="compare-body">Se consulta a menudo. Necesita acceso rápido, y ese acceso cuesta.</p>
  </div>
  <div>
    <p class="compare-label">Cold data</p>
    <p class="compare-body">Casi nunca se toca. Puede vivir en almacenamiento más lento y más barato.</p>
  </div>
</div>

#### Una política de retención

<p class="term">Política de retención</p>

Responde a una pregunta por cada tipo de dato: ¿cuánto tiempo lo conservamos, y qué pasa después?

| Tipo de dato | Retención de ejemplo |
| ------------ | -------------------- |
| Logs operativos | 90 días |
| Backups diarios | 30 días |
| Backups mensuales | 12 meses |

Las cifras dependen del contexto. Lo que no depende del contexto es que **exista la decisión y esté escrita**.

Y no se decide solo por sostenibilidad: hay datos que deben conservarse por legislación, contratos, seguridad, auditorías o necesidades del negocio. La política equilibra las cuatro cosas.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Selecciona logs y backups de la ficha. Anota qué función cumplen, quién los utiliza y qué dato aportaría evidencia de su necesidad.
2. Calcula cuánto incorporan los logs a 500 GB mensuales durante doce meses, antes de compresión o borrado. Escribe las unidades y los supuestos de la operación.
3. Diseña una tabla de retención con tipo de dato, finalidad, acceso, periodo de consulta frecuente, archivo o eliminación y responsable. Señala restricciones que deban confirmarse.
4. Compara conservar todos los backups completos seis años con una política por ventanas y pruebas de recuperación. No propongas borrar copias hasta comprobar qué recuperación se necesita y si existe otra válida.
5. Añade un mecanismo de revisión periódica de excepciones y duplicados. Explica qué evidencia permitiría saber si la política reduce almacenamiento manteniendo su función.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La política distingue datos y finalidades, declara supuestos y evita tanto retención ilimitada como borrado indiscriminado.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD5 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 2»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 3 · ¿Hace falta de verdad la IA?

**Punto de partida.** Actividad «Decisiones de cloud, datos e IA», sesión 3 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

La IA es una opción entre varias. Una regla determinista puede resolver una condición exacta; un modelo puede resultar útil cuando la tarea exige reconocer patrones o trabajar con lenguaje. Su coste incluye recursos, datos, errores y necesidad de revisión, no solo la cuota de acceso.

Un **token** es una unidad de texto que utiliza un modelo; su número no equivale directamente a una medida de emisiones. Elegir un modelo menor puede reducir recursos en determinadas condiciones, pero la decisión debe comprobar también calidad y utilidad para la tarea.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### El tamaño del modelo también cuenta

Si dos modelos resuelven la tarea y uno es mucho más pequeño, conviene preguntarse si de verdad hace falta el grande. Pero no hay regla universal: uno mayor puede funcionar mejor, cometer menos errores o habilitar funciones que el pequeño no da. La pregunta sigue siendo qué necesita **esta** aplicación.

#### Tokens

Los modelos de lenguaje procesan el texto en unidades llamadas:

<p class="term">Tokens</p>

Más texto enviado significa más procesamiento. Enviar información innecesaria genera trabajo innecesario, exactamente igual que transferir una imagen de 4000 px para mostrarla a 300.

Si tenemos un documento de 500 páginas y queremos el número de factura de la página 3, mandar las 500 páginas es la versión moderna del mismo error. Primero se busca lo relevante, después se pregunta.

Y lo mismo con lo que pedimos de vuelta: generar veinte alternativas cuando necesitamos una, o una imagen 4K para mostrarla a 300 × 200 px. Vuelve el principio de la unidad anterior:

> **No procesar lo que no necesitamos.**

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Lee los escenarios de clasificación de mensajes, reglas de contraseña y consulta de documentación. Define la salida correcta de cada tarea antes de elegir una herramienta.
2. Resuelve el ejemplo de contraseña: una condición como longitud mínima se comprueba con una regla. Explica por qué un resultado variable de un modelo complicaría esa decisión.
3. Para clasificar mensajes compara reglas, clasificador y modelo generativo. Diseña una muestra de evaluación con categorías conocidas y cómo tratarías casos dudosos.
4. Para documentación compara búsqueda y respuesta asistida con referencias. Indica qué ocurriría si el sistema no encuentra evidencia suficiente para contestar.
5. Completa por opción recursos, datos necesarios, error tolerable y revisión humana. Justifica una elección y una alternativa descartada sin afirmar que conoces su consumo real si no se ha medido.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Las tres decisiones parten de la tarea y de una comprobación de calidad. Se valora proporcionalidad, no utilizar siempre IA ni descartarla siempre.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD5 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 3»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 4 · Arquitectos tecnológicos

**Punto de partida.** Actividad «Decisiones de cloud, datos e IA», sesión 4 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una arquitectura proporcional integra servicio, recursos, coste y consecuencias sobre personas. Una mejora ambiental aparente puede crear otro problema: reducir almacenamiento sin conservar recuperación o automatizar atención sin resolver casos excepcionales.

La solución mínima suficiente cubre la necesidad con una complejidad justificable. «Mínima» no significa frágil: incluye las comprobaciones y responsabilidades necesarias para que siga siendo útil. Hoy consolidaremos las decisiones ya trabajadas sobre los siete escenarios.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre la tabla de escenarios y completa los siete casos utilizando las decisiones de las sesiones anteriores. Mantén referencias a cálculos y supuestos en vez de volver a escribirlos.
2. En cada caso indica propuesta, alternativa descartada, ventaja, riesgo y comprobación. Revisa que la web corporativa y la tienda no comparten por error las mismas cifras de carga.
3. Analiza una decisión desde ambiental, social, gobernanza y coste. Explica un compromiso real, como conservación de datos frente a capacidad de investigar una incidencia.
4. Pide a otra pareja o al asistente que cuestione una suposición. Registra la objeción y decide si cambia la propuesta; confirma cualquier cifra que no proceda de la ficha.
5. Entrega las decisiones y una síntesis de la solución mínima suficiente. Cada integrante explica un caso y el criterio que justificaría revisarlo después.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La actividad usa datos del caso y comprobaciones futuras explícitas. No se exige desplegar máquinas, construir IA ni repetir el taller cloud de Digitalización.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD5 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 4»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. La actividad de la unidad queda lista para valorar con su rúbrica; las correcciones se documentan en el mismo registro.

## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

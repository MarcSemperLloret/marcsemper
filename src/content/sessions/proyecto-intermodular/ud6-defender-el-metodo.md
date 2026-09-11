---
title: "Defender el método"
label: "UD6 · Defender"
section: "ud-06"
order: 6
lang: "es"
summary: "Cerrar la evaluación defendiendo cómo se ha trabajado, con tres evidencias que no se pueden improvisar: el tablero, la pull request más discutida y una ejecución del pipeline que falló."
duration: "3 horas · 1 sesión"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Demostración del proceso de trabajo y del backend persistente del primer trimestre."
date: "2026-09-09"
outcomes:
  - "Reconstruir el rastro de trabajo propio y analizarlo desde el criterio de quien evalúa."
  - "Explicar una decisión de proceso sin refugiarse en la tecnología."
  - "Defender una revisión hecha y una recibida."
  - "Leer un fallo del pipeline y explicar qué lo provocó y cómo se resolvió."
  - "Reconocer las limitaciones del propio trabajo antes de que las señale otro."
requirements:
  - "El producto de Servidor publicado y su ficha de portfolio accesible."
  - "Los tres artefactos preparados: tablero, pull request y ejecución fallida."
priorKnowledge:
  - "Todo el trimestre."
---

<p class="lead">Hoy se presenta la misma versión que en Servidor 27–28. La demostración del producto se comparte; aquí se justifican su organización, revisión, pruebas en CI y puesta en producción.</p>

<div class="rule">
  <p class="rule-label">Fundamento de la defensa del proceso</p>
  <p>Un producto admite ser copiado, encargado o improvisado en un plazo breve; un rastro de desarrollo de catorce semanas, no. El término rastro no designa aquí las fechas de los commits, que pueden reescribirse, sino los registros no modificables por el autor: las issues, las revisiones registradas en el repositorio de otra persona y las ejecuciones de GitHub Actions. La defensa se articula sobre tres evidencias que solo existen si el trabajo se realizó conforme al método.</p>
</div>

## Sesión 14 · La defensa del proceso

**Antes de empezar.** El CRUD persistente del primer trimestre ya ha pasado sus comprobaciones de integración. Hoy explicarás cómo lo has organizado, revisado y publicado; en Servidor continuarás con su demostración técnica.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Si hubiera que acreditar con una sola pantalla el trabajo sostenido durante todas las semanas, ¿cuál sería?</li>
    <li>¿Qué cambio del trimestre generó mayor discusión, propia o con la pareja de revisión?</li>
    <li>¿Cuándo bloqueó el pipeline por última vez una fusión? ¿El bloqueo estaba justificado?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Los tres artefactos, y qué demuestra cada uno

No son tres al azar. Cada uno responde a una pregunta que no se puede contestar de palabra.

<figure class="diagram">
  <figcaption>Qué se enseña y qué prueba</figcaption>
  <ol class="flow">
    <li><span class="flow-role">El tablero</span>Acredita la distribución temporal y la trazabilidad: si el trabajo estaba descompuesto en tareas, si las tarjetas avanzaron conforme al desarrollo real y si cada una se cerró desde su pull request.</li>
    <li><span class="flow-role">La pull request más discutida</span>Acredita la existencia de revisión efectiva: una observación concreta de otra persona que produjo una modificación del código.</li>
    <li><span class="flow-role">Una ejecución fallida del pipeline</span>Acredita que las comprobaciones son vinculantes y que su registro resulta interpretable: qué falló, por qué causa y qué corrección se aplicó.</li>
  </ol>
</figure>

El tercer artefacto requiere una precisión: **se solicita la presentación de un fallo**. La verificación local previa al envío es una práctica correcta y no se exige ninguna frecuencia de fallos; resulta válido el fallo controlado provocado en una rama de diagnóstico en sesiones anteriores, acompañado de su corrección y de la evidencia de que impidió la fusión.

#### Qué se pregunta, y qué no

<div class="compare-pair">
  <div>
    <p class="compare-label">No se pregunta</p>
    <p class="compare-body">La valoración estética del diseño, la redacción del CSS, la arquitectura interna de la API o el número de funcionalidades implementadas. Esos aspectos se evalúan en los módulos que los imparten.</p>
  </div>
  <div>
    <p class="compare-label">Sí se pregunta</p>
    <p class="compare-body">El criterio de descomposición de una issue, quién revisó un cambio y qué verificó, qué mecanismo impide que un defecto alcance producción, qué consecuencias tiene una modificación del contrato de la API y qué limitaciones presenta el estado actual.</p>
  </div>
</div>

Las preguntas proceden del contenido del trimestre y se publican íntegramente con antelación a la defensa:

| De la sesión | Pregunta |
| ------------ | -------- |
| 1 | ¿Qué sucede exactamente entre la ejecución de un push y la actualización de la URL pública? |
| 2 | ¿Por qué se protege la rama principal aun siendo el repositorio de propiedad propia? |
| 2 | Selecciona una issue propia. ¿Conforme a qué criterio se determinó que estaba terminada? |
| 3 | ¿Por qué la comprobación de despliegue resultaba insuficiente? |
| 4 | Un enlace externo falla en el CI pero responde correctamente. ¿Qué procedimiento se aplicó? |
| 5 | ¿Qué magnitudes controla el presupuesto de calidad y cómo se justifican sus umbrales? |
| 6 | ¿Qué información contiene el README que no contendría el de un ejercicio académico? |
| 7 | ¿En qué se diferencia el CI de la API del correspondiente al portfolio? |
| 8 | La URL devuelve un error y el despliegue ha concluido con éxito. ¿Cuál es la secuencia de diagnóstico? |
| 9 | ¿Qué protege efectivamente el mecanismo CORS en la API? |
| 10 | Provoca un error de validación en la interfaz. ¿En qué componente se origina ese mensaje? |
| 11 | ¿Dónde reside la base de datos y qué procedimiento se aplica ante la exposición de sus credenciales? |
| 12 | Ante la modificación de un campo de la API, ¿qué componentes se ven afectados y qué mecanismo lo detecta? |
| 13 | ¿Qué mejora se ha priorizado para el producto y de qué dependencias está condicionada? |

#### Cómo se puntúa

| Se mira | Qué lo demuestra |
| ------- | ---------------- |
| Ritmo | Actividad repartida en semanas, no concentrada |
| Trazabilidad | Issues cerradas por su pull request, ramas con su número |
| Puertas | Ninguna fusión con checks en rojo, ningún commit directo a la rama principal |
| Revisión | Revisiones propias registradas en el repositorio de la pareja, con contenido sustantivo |
| Cierre | Releases publicadas y README comprensible para un lector externo |
| Defensa | Capacidad de explicar lo anterior sin apoyo de un texto leído |

<div class="rule">
  <p class="rule-label">Error de preparación más frecuente</p>
  <p>Preparar la demostración del producto en lugar de la del proceso. La presentación del portfolio y del CRUD en funcionamiento es pertinente, pero corresponde al ámbito evaluativo de Servidor. En este módulo se evalúa el proceso que los ha producido. Resulta aconsejable revisar el repositorio propio con anterioridad a la defensa, adoptando el criterio de un observador externo: la mayoría de las incidencias de esta sesión se concentran en quien omite esa revisión.</p>
</div>

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Reconstrucción del rastro propio

<p class="stage stage--solo">Trabajo individual, con ambos repositorios abiertos</p>

Antes de preparar la defensa, analiza el material disponible con el criterio que se aplicaría a un repositorio ajeno. Es la misma auditoría realizada sobre la pareja en la sesión 6, aplicada ahora al trabajo propio.

| Dónde mirar | Qué anotar |
| ----------- | ---------- |
| Insights → Commits, o el listado de pull requests | En cuántas semanas distintas hay actividad |
| Pull requests cerradas | Cuántas dicen qué issue cierran, y cuántas no |
| Historial de <code>main</code> | Si hay algún commit que no venga de una fusión |
| Pestaña Actions | Cuántas ejecuciones fallaron, y cuál fue la última |
| Releases | Qué versiones hay y si sus notas se entienden |

<dl class="answer">
  <dt>Semanas con actividad, de catorce</dt>
  <dd></dd>
  <dt>Pull requests sin issue asociada</dt>
  <dd></dd>
  <dt>El elemento más débil del rastro propio, identificado antes de que lo señale la evaluación</dt>
  <dd></dd>
</dl>

<div class="rule">
  <p class="rule-label">Reconocimiento anticipado de las limitaciones</p>
  <p>Una semana sin actividad consta en el registro y será detectada durante la evaluación. Su reconocimiento explícito —«esa semana no hubo avance y el registro lo refleja; se recuperó en la siguiente»— tiene menor coste evaluativo que el silencio o la justificación. La capacidad de auditar el trabajo propio e identificar sus deficiencias forma parte de los criterios de calificación.</p>
</div>

#### Bloque B · Selección de los tres artefactos

<p class="stage stage--solo">Trabajo individual, con una formulación escrita para cada artefacto</p>

**1 · El tablero.** Déjalo abierto en la vista que mejor documente la evolución del trabajo. Formulación exigible: *«la descomposición del trabajo siguió este criterio, y esta tarjeta avanzó en este momento porque…»*.

**2 · La pull request más discutida.** No la de mayor volumen, sino la que generó la revisión más productiva. Puede ser una propia que resultó modificada tras la revisión, o una de la pareja en la que se detectó una deficiencia. Formulación exigible: *«la revisión señaló esto, el criterio era correcto en este punto, y la modificación aplicada fue esta»*.

**3 · La ejecución fallida.** Localízala en Actions, ábrela por la etapa marcada como fallida y revisa su registro. Formulación exigible: *«la causa fue esta, constaba en esta línea del registro, y la corrección aplicada fue esta»*.

<details class="aside aside--help">
  <summary>Si no consta ninguna ejecución fallida del CI</summary>
  <p>La defensa debe entonces justificar esa ausencia. Una justificación válida es la verificación local sistemática previa al envío, acreditada mediante el comando empleado. La ausencia de justificación no lo es. Existe además un tercer supuesto, detectable de inmediato en la configuración del repositorio: que las comprobaciones no estuvieran declaradas como obligatorias y, en consecuencia, nunca hayan podido bloquear una fusión.</p>
</details>

<dl class="answer">
  <dt>Tablero · la frase</dt>
  <dd></dd>
  <dt>Pull request · la frase</dt>
  <dd></dd>
  <dt>Fallo del pipeline · la frase</dt>
  <dd></dd>
</dl>

#### Bloque C · Ensayo cruzado

<p class="stage stage--guided">Por parejas, con las preguntas de la tabla delante</p>

La pareja asume la función de tribunal durante ocho minutos: selecciona al azar cuatro preguntas de la tabla anterior y las formula. A continuación se invierten los papeles.

Reglas del ensayo, que coinciden con las de la defensa:

<ul class="checklist">
  <li>Toda respuesta se acredita sobre la pantalla, no de memoria. La afirmación «consta en el tablero» requiere abrir el tablero.</li>
  <li>«No lo sé» constituye una respuesta admisible de forma puntual. Su reiteración sustituye a la defensa.</li>
  <li>Una pregunta sobre el proceso no se responde con una elección tecnológica: ante el criterio de descomposición de una issue, la mención del framework empleado no constituye respuesta.</li>
</ul>

Quien ejerce de tribunal registra **la pregunta peor resuelta** y la comunica. Esa es la que debe prepararse en el tiempo restante.

#### Bloque D · La defensa

La defensa se coordina con Servidor 27–28 sobre el mismo commit. Explica aquí el proceso sobre la versión que ya has comprobado; las sesiones 27–28 de Servidor completarán la explicación técnica de ese mismo producto.

1. Abre el balance del primer trimestre con URL, SHA, PR, CI y pruebas. Comprueba que la release final incluye persistencia, relaciones y reglas de Servidor 25–26; una release intermedia no sustituye esta comprobación.
2. Demuestra un recorrido del CRUD, una entrada rechazada y persistencia tras reinicio. Servidor evalúa implementación, integridad y pruebas de esos casos.
3. Sigue una issue del mismo recorrido hasta su rama, revisión, ejecución y despliegue. Intermodular evalúa la trazabilidad, la revisión y la entrega reproducible.
4. Explica un fallo controlado del CI y su diagnóstico. No se puntúa haber roto producción ni acumular errores.
5. Cada integrante identifica su contribución según la autoría/equipo acordado en Servidor. Quienes no estén defendiendo realizan una comprobación cruzada y registran observaciones.
6. Contrasta el resultado con las limitaciones identificadas. Las comprobaciones y la versión son comunes; los criterios y las calificaciones de cada módulo se mantienen diferenciados.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint">
  <p class="checkpoint-label">Producto de la evaluación</p>
  <ul class="checklist">
    <li>Portfolio publicado, con contenido real y su pipeline de cuatro comprobaciones.</li>
    <li>API persistente desplegada, con CI y operaciones CRUD comprobadas mediante la colección de peticiones.</li>
    <li>Releases publicadas en los dos repositorios, con READMEs que se entienden.</li>
    <li>Un rastro de catorce semanas: issues, ramas, pull requests, revisiones y fallos resueltos.</li>
    <li>La evolución del mismo producto, priorizada y con sus dependencias.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Retrospectiva · tres minutos por escrito</p>
  <ol>
    <li>¿Qué elemento del método resultó burocrático en septiembre y demostró su utilidad posteriormente?</li>
    <li>¿Qué se habría hecho de otro modo al reiniciar la primera semana?</li>
    <li>¿Qué aspecto del flujo de trabajo resulta más costoso de sostener y por qué?</li>
    <li>¿Qué recomendación se formularía a quien inicie este módulo el próximo curso?</li>
  </ol>
</div>

<div class="rule">
  <p class="rule-label">Continuidad en el segundo trimestre</p>
  <p>El trabajo continúa sobre el mismo producto y sobre la mejora priorizada en la sesión 13. La persistencia estará ya publicada, de modo que en enero se abordan el cliente, los permisos y las integraciones, siempre con posterioridad a su impartición en Servidor. No se construye ninguna infraestructura nueva: el flujo de integración de este trimestre es el que permanece en uso.</p>
</div>

## Lo que debes recordar

### El método

| Idea | Por qué |
| ---- | ------- |
| **El proceso se acredita con evidencias, no con valoraciones** | Una afirmación sobre el esfuerzo dedicado no es verificable; un tablero con marcas temporales sí lo es |
| **Un fallo controlado comprueba el bloqueo** | Probar en local es correcto; se demuestra la eficacia del check sin exigir fallos frecuentes |
| **Las limitaciones se declaran de forma anticipada** | Una limitación reconocida por su autor demuestra criterio; la misma limitación detectada por el evaluador constituye un defecto |
| **Toda afirmación se acredita sobre la pantalla** | Cualquier enunciado de la defensa consta registrado en algún punto del repositorio |
| **Una pregunta de proceso no se responde con tecnología** | Corresponden a dos ámbitos evaluativos distintos y su confusión es inmediatamente identificable |

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Rastro | El conjunto de evidencias fechadas que deja el trabajo: issues, commits, pull requests, revisiones y ejecuciones |
| Trazabilidad | Poder ir de un cambio a la tarea que lo pedía, y al revés |
| Ritmo | Distribución temporal del trabajo. Es observable de forma directa en el registro y no admite reconstrucción posterior |
| Retrospectiva | Mirar hacia atrás para decidir qué cambiar en el siguiente ciclo, no para justificar el anterior |

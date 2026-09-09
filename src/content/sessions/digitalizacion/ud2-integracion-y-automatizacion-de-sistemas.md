---
title: "Integración y automatización de sistemas"
label: "UD2 · Actividad"
section: "ud-02"
order: 2
lang: "es"
summary: "Cuando las aplicaciones tienen que hablar entre ellas. API, polling, webhook, eventos, colas y automatización: qué problema resuelve cada mecanismo y cuándo tiene sentido usarlo."
duration: "3 horas · 3 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Automatización diseñada y simulada. Una actividad acumulativa por unidad, con evidencias y aportación individual."
date: "2026-09-09"
outcomes:
  - "Explicar qué es una API y qué no es una API."
  - "Elegir entre polling y webhook con un argumento, no por costumbre."
  - "Identificar el evento que dispara una automatización."
  - "Decidir qué NO conviene automatizar."
requirements:
  - "Guía de arranque y materiales de esta unidad, enlazados en la página."
  - "Carpeta o documento de actividad compartido con el docente."
priorKnowledge:
  - "Las unidades anteriores de este módulo. No se requiere Servidor, Intermodular ni el otro módulo transversal."
---

<p class="lead">Automatización diseñada y simulada. Cada sesión introduce los conceptos que necesita y continúa una misma actividad de la unidad. Conserva sus resultados para revisarlos y utilizarlos después.</p>

## Cómo trabajar esta unidad

Son 3 sesiones de una hora: 10 minutos de explicación, 45 de trabajo guiado y 5 de cierre. Si el periodo del centro es de 55 minutos, se ajusta el trabajo a 40 minutos. Los ejemplos ampliados son material de consulta durante la práctica; no añaden otra clase teórica ni tareas obligatorias.

Abre la [guía de arranque y evaluación](/es/docencia/talleres-transversales/). Incluye archivos, herramientas y alternativas de acceso. Para los casos utiliza la [ficha común](/teaching/transversales/casos.pdf). No se necesita el CRUD de Servidor ni el workflow de Intermodular. Quien ya conozca una herramienta utiliza ese conocimiento para justificar y comprobar la actividad nueva, sin repetir una entrega ya evaluada.

## Actividad y criterios de evaluación

**Automatización diseñada y simulada.** Guarda el trabajo en `digitalizacion/ud2/`, y redacta la actividad en Word, LibreOffice o un documento en línea; exporta la entrega a PDF. Cada sesión añade su avance, comprobación y pendiente; no se entrega un informe diferente por sesión. Cuando haya código, enlaza el repositorio y la versión o adjunta la carpeta identificada según el canal del aula. Nunca incluyas credenciales.

Esta actividad se valora sobre 10 puntos y aporta **3/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Cada integrante registra y explica su aportación. La rúbrica se conoce desde el inicio:

<table>
  <thead>
    <tr>
      <th>Criterio</th>
      <th class="align-right">Puntos</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Identificación adecuada de tareas automatizables</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Comprensión de eventos, APIs, polling y webhooks</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Coherencia del flujo diseñado</td>
      <td class="align-right">3</td>
    </tr>
    <tr>
      <td>Tratamiento razonable de posibles fallos</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Claridad de la propuesta</td>
      <td class="align-right">1</td>
    </tr>
  </tbody>
</table>

En cada criterio, una evidencia ausente no permite acreditar el logro; una evidencia incompleta requiere revisión; una evidencia correcta permite comprobar el resultado; el logro completo añade una justificación coherente y reconoce sus límites. Los puntos se asignan según el grado de logro del criterio, no por cantidad de archivos, commits o texto. Consulta la guía para revisar y volver a presentar los criterios pendientes.

## Sesión 1 · Cómo se comunican las aplicaciones

**Punto de partida.** Actividad «Automatización diseñada y simulada», sesión 1 de 3. Abre los materiales enlazados y crea el registro de la unidad. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una **API** permite que una aplicación solicite datos o acciones a otra siguiendo un acuerdo. La petición indica qué se necesita; la respuesta dice qué ocurrió y puede aportar datos. Un **evento** comunica que algo ya ha pasado: «reparación terminada». No son sinónimos: un evento puede provocar que otra aplicación llame a una API.

En Reparaciones Rápidas, terminar una reparación puede iniciar la preparación de su factura. Para conectar ambas tareas hay que saber qué datos se necesitan y qué aplicación los conoce. Hoy representaremos ese intercambio sobre papel o en un diagrama; no hace falta programar el backend.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### API: una puerta para comunicarse con una aplicación

Ya conocéis las APIs desde el punto de vista de programación.

Aquí nos interesa entender **para qué sirven dentro de una empresa**.

Una API permite que otra aplicación pueda solicitar o enviar información de forma controlada.

Por ejemplo:

<figure class="diagram">
  <figcaption>Consultar un servicio externo</figcaption>
  <ol class="flow flow--row">
    <li>Nuestra aplicación</li>
    <li><strong>API</strong></li>
    <li>Servicio meteorológico</li>
  </ol>
</figure>

Nuestra aplicación podría preguntar:

> ¿Qué temperatura hace ahora en Alicante?

y recibir:

```json
{
  "temperature": 31,
  "condition": "sunny"
}
```

La API actúa como una especie de **puerta de entrada definida por el sistema**.

No necesitamos saber cómo funciona internamente el servicio meteorológico.

Solo necesitamos conocer:

* qué podemos solicitar;
* qué datos debemos enviar;
* qué respuesta obtendremos.

#### Polling

El funcionamiento puede representarse así:

<figure class="diagram">
  <figcaption>Polling · la aplicación A lleva la iniciativa</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 232" role="img" aria-labelledby="poll-title poll-desc" preserveAspectRatio="xMidYMid meet">
    <title id="poll-title">Ciclo de polling entre dos aplicaciones</title>
    <desc id="poll-desc">La aplicación A pregunta a la aplicación B si hay novedades, la aplicación B responde, y el ciclo vuelve a empezar pasado un intervalo de tiempo.</desc>
    <defs>
      <marker id="poll-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 240 82 L 474 82" marker-end="url(#poll-arrow)" />
      <path d="M 480 116 L 246 116" marker-end="url(#poll-arrow)" />
      <path class="is-dashed" d="M 570 130 L 570 178 L 150 178 L 150 130" marker-end="url(#poll-arrow)" />
    </g>
    <text class="diagram-label" x="357" y="68">¿Hay novedades?</text>
    <text class="diagram-label" x="363" y="136">Respuesta</text>
    <text class="diagram-label diagram-label--accent" x="360" y="200">y vuelve a preguntar pasado el intervalo</text>
    <g class="diagram-node">
      <rect x="60" y="74" width="180" height="56" rx="3" />
      <text x="150" y="102">Aplicación A</text>
    </g>
    <g class="diagram-node">
      <rect x="480" y="74" width="180" height="56" rx="3" />
      <text x="570" y="102">Aplicación B</text>
    </g>
  </svg>
</figure>

Es sencillo de implementar.

Pero puede ser poco eficiente.

Imaginemos que preguntamos cada minuto y el estado cambia una vez al día.

Estamos realizando miles de preguntas innecesarias.

#### Otra posibilidad: webhook

En lugar de preguntar continuamente:

> ¿Ha ocurrido algo?

podemos decir:

> **Avísame cuando ocurra.**

Ese es el concepto fundamental de un **webhook**.

<figure class="diagram">
  <figcaption>Webhook · la iniciativa cambia de lado</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 208" role="img" aria-labelledby="hook-title hook-desc" preserveAspectRatio="xMidYMid meet">
    <title id="hook-title">Aviso mediante webhook</title>
    <desc id="hook-desc">La aplicación A espera sin preguntar nada. Cuando ocurre un evento en la aplicación B, esta avisa a la aplicación A mediante un webhook.</desc>
    <defs>
      <marker id="hook-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 460 112 L 272 112" marker-end="url(#hook-arrow)" />
    </g>
    <text class="diagram-label diagram-label--accent" x="560" y="66">ocurre el evento</text>
    <text class="diagram-label" x="366" y="98">webhook: te aviso</text>
    <text class="diagram-label" x="160" y="176">no pregunta nada</text>
    <g class="diagram-node">
      <rect x="60" y="84" width="206" height="56" rx="3" />
      <text x="163" y="112">Aplicación A</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="460" y="84" width="200" height="56" rx="3" />
      <text x="560" y="112">Aplicación B</text>
    </g>
  </svg>
</figure>

Por ejemplo:

<figure class="diagram">
  <figcaption>Un aviso de pago</figcaption>
  <ol class="flow flow--row">
    <li>Pago completado</li>
    <li><strong>Webhook</strong></li>
    <li>Nuestra tienda</li>
  </ol>
</figure>

El servicio de pago avisa automáticamente a nuestra aplicación.

#### Polling vs webhook

Una forma sencilla de recordarlo:

##### Polling

> Yo te pregunto periódicamente si ha ocurrido algo.

##### Webhook

> Tú me avisas cuando ocurra.

Comparación:

| | Polling | Webhook |
| --- | --- | --- |
| Quién inicia la comunicación | El interesado | El sistema donde ocurre el evento |
| Consultas repetidas | Sí | No normalmente |
| Tiempo de reacción | Depende del intervalo | Normalmente inmediato |
| Sencillez | Alta | Requiere preparar un receptor |
| Ejemplo | Consultar estado cada minuto | Avisar cuando cambia el estado |

Ninguno es siempre mejor.

Depende del problema.

#### Los eventos

Muchas aplicaciones modernas funcionan alrededor de acontecimientos.

Por ejemplo:

* usuario registrado;
* pedido creado;
* pago realizado;
* paquete enviado;
* reparación terminada;
* contraseña modificada.

Podemos llamar a estos acontecimientos:

<p class="term">Eventos</p>

Un evento significa simplemente:

> **ha ocurrido algo relevante dentro del sistema.**

Por ejemplo:

<p class="single-node">Evento: reparación terminada</p>

A partir de ese evento podrían ejecutarse varias acciones:

<figure class="diagram">
  <figcaption>Un evento, varias reacciones</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 300" role="img" aria-labelledby="fan-title fan-desc" preserveAspectRatio="xMidYMid meet">
    <title id="fan-title">Un evento desencadena tres acciones</title>
    <desc id="fan-desc">Al terminar una reparación se emite un evento, y a partir de él se ejecutan tres acciones: enviar un correo, generar la factura y actualizar el estado.</desc>
    <defs>
      <marker id="fan-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 62 L 360 104" marker-end="url(#fan-arrow)" />
      <path d="M 360 158 L 360 196" />
      <path d="M 130 196 L 590 196" />
      <path d="M 130 196 L 130 224" marker-end="url(#fan-arrow)" />
      <path d="M 360 196 L 360 224" marker-end="url(#fan-arrow)" />
      <path d="M 590 196 L 590 224" marker-end="url(#fan-arrow)" />
    </g>
    <g class="diagram-node">
      <rect x="250" y="14" width="220" height="48" rx="3" />
      <text x="360" y="38">Reparación terminada</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="285" y="110" width="150" height="48" rx="3" />
      <text x="360" y="134">Evento</text>
    </g>
    <g class="diagram-node">
      <rect x="40" y="230" width="180" height="48" rx="3" />
      <text x="130" y="254">Enviar correo</text>
    </g>
    <g class="diagram-node">
      <rect x="270" y="230" width="180" height="48" rx="3" />
      <text x="360" y="254">Generar factura</text>
    </g>
    <g class="diagram-node">
      <rect x="500" y="230" width="180" height="48" rx="3" />
      <text x="590" y="254">Actualizar estado</text>
    </g>
  </svg>
</figure>

Una única acción puede desencadenar muchas otras.

#### Cola de mensajes

Imagina una cola en un supermercado.

Una persona no desaparece porque la caja esté ocupada.

Espera su turno.

Una cola de mensajes utiliza una idea parecida:

<figure class="diagram">
  <figcaption>Los mensajes esperan su turno</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 330" role="img" aria-labelledby="queue-title queue-desc" preserveAspectRatio="xMidYMid meet">
    <title id="queue-title">Cola de mensajes entre dos sistemas</title>
    <desc id="queue-desc">La aplicación deja sus mensajes en una cola. Los mensajes esperan ahí hasta que el sistema receptor puede procesarlos, de modo que no se pierden si el receptor no está disponible.</desc>
    <defs>
      <marker id="queue-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 58 L 360 90" marker-end="url(#queue-arrow)" />
      <path d="M 360 230 L 360 262" marker-end="url(#queue-arrow)" />
    </g>
    <g class="diagram-node">
      <rect x="270" y="14" width="180" height="44" rx="3" />
      <text x="360" y="36">Aplicación</text>
    </g>
    <g class="diagram-node diagram-node--container">
      <rect x="240" y="96" width="240" height="134" rx="3" />
      <text x="360" y="116">COLA</text>
    </g>
    <g class="diagram-node diagram-node--data diagram-node--small">
      <rect x="262" y="132" width="196" height="26" rx="2" />
      <text x="360" y="145">mensaje 1</text>
    </g>
    <g class="diagram-node diagram-node--data diagram-node--small">
      <rect x="262" y="164" width="196" height="26" rx="2" />
      <text x="360" y="177">mensaje 2</text>
    </g>
    <g class="diagram-node diagram-node--data diagram-node--small">
      <rect x="262" y="196" width="196" height="26" rx="2" />
      <text x="360" y="209">mensaje 3</text>
    </g>
    <g class="diagram-node">
      <rect x="260" y="268" width="200" height="44" rx="3" />
      <text x="360" y="290">Sistema receptor</text>
    </g>
  </svg>
</figure>

Si el receptor está ocupado o temporalmente no disponible, los mensajes pueden esperar.

Tecnologías como:

* RabbitMQ;
* Apache Kafka;
* Amazon SQS;

se utilizan para resolver problemas relacionados con este tipo de comunicación.

**No necesitamos aprenderlas en esta unidad.**

Lo importante es entender el problema que solucionan.

#### Low-Code y No-Code

No todas las integraciones tienen que programarse desde cero.

Existen herramientas como:

* n8n;
* Zapier;
* Make;
* Power Automate.

Permiten construir flujos visualmente.

Por ejemplo:

<figure class="diagram">
  <figcaption>Un flujo construido sin escribir código</figcaption>
  <ol class="flow">
    <li>Nuevo formulario</li>
    <li>Crear registro</li>
    <li>Enviar correo</li>
    <li>Avisar por Teams</li>
  </ol>
</figure>

La idea es similar a programar:

<figure class="diagram">
  <figcaption>La misma lógica de siempre</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Si ocurre A</li>
    <li>entonces ejecuta B</li>
    <li>después ejecuta C</li>
  </ol>
</figure>

Estas herramientas son especialmente útiles para:

* automatizaciones sencillas;
* conectar servicios;
* prototipos;
* tareas internas.

Pero tampoco sustituyen siempre al desarrollo tradicional.

Cuando necesitamos:

* lógica compleja;
* rendimiento;
* control;
* gran escalabilidad;

puede ser mejor desarrollar la solución mediante código.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre la ficha de Reparaciones Rápidas y crea el registro de la UD2. Copia únicamente el fragmento de vuestro proceso que empieza cuando un técnico termina una reparación.
2. Escribe el evento en pasado y enumera sus datos mínimos: identificador de reparación, fecha de cierre y referencia del cliente. Explica por qué cada dato resulta necesario.
3. Dibuja tres participantes: gestión de reparaciones, facturación y servicio de avisos. Asigna a cada uno una responsabilidad; evita que dos piezas mantengan estados contradictorios sin explicarlo.
4. Simula un intercambio: una persona prepara una tarjeta con la petición de factura y otra responde «creada» con su identificador. Si falta un dato, devuelve «petición incompleta» e indica cuál.
5. Registra la petición, la respuesta y una condición que impida continuar. Comprueba que otra pareja entiende quién solicita, quién responde y qué cambia al terminar.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Hay un intercambio completo con datos, respuesta y responsables. Distingue la orden «crear factura» del evento «factura creada».

**Entrega de la sesión.** Actualiza el documento de la actividad de UD2 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 1»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 2 · Diseña la automatización de una empresa

**Punto de partida.** Actividad «Automatización diseñada y simulada», sesión 2 de 3. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Con **polling**, una aplicación pregunta periódicamente si hay novedades. Con un **webhook**, el sistema que conoce el cambio envía una notificación a una dirección acordada. El webhook puede reducir consultas vacías, pero también puede fallar o llegar repetido. Elegirlo no elimina la necesidad de comprobar el resultado.

Una **cola** conserva mensajes pendientes para procesarlos después. Si facturación está temporalmente caída, puede guardar la solicitud sin detener toda la reparación. Reintentar exige evitar duplicados: la misma reparación no debe originar dos facturas por recibir dos veces su mensaje. Low-code ofrece piezas configurables; no evita definir estas reglas.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Retoma el intercambio anterior. Compara dos opciones para conocer el cierre de una reparación: consultar cada cierto tiempo o recibir un aviso. Escribe qué retraso admite el negocio y elige una opción.
2. Añade al diagrama una zona de pendientes para las solicitudes que facturación no pueda atender. Explica quién vuelve a intentarlo y cómo se sabe que finalmente se resolvió.
3. Define un identificador estable, por ejemplo `reparacion-42`, que acompañe al mensaje original y a sus reintentos. Escribe qué debe ocurrir si ya existe una factura asociada.
4. Completa una tabla con situación, acción y resultado: funcionamiento normal, servicio caído, mensaje duplicado y dato incompleto. No trates todos los fallos como «reintentar siempre».
5. Decide qué parte configurarías con low-code y cuál podría necesitar programación. Justifica con las reglas y las integraciones necesarias, no con el prestigio de una herramienta.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

El flujo incluye gestión de fallos y duplicados. Debes poder explicar qué mensaje queda pendiente y qué hecho permite darlo por terminado.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD2 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 2»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 3 · Pruebas de integración, gestión de fallos y consolidación

**Punto de partida.** Actividad «Automatización diseñada y simulada», sesión 3 de 3. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una simulación recorre el diseño con entradas conocidas y compara lo ocurrido con lo esperado. Sirve para descubrir reglas que faltan antes de programar. Simular una caída en este taller significa retener una tarjeta de respuesta o marcar un servicio como no disponible en una tabla; no atacar ni apagar un servicio real.

Un caso de prueba necesita situación inicial, acción, resultado esperado y resultado observado. Si esos dos resultados difieren, corregimos el diseño o explicamos por qué la expectativa estaba equivocada.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Crea una tabla con esas cuatro columnas. Prepara cuatro casos: cierre normal, facturación no disponible, mensaje repetido y reparación sin datos necesarios.
2. Reparte los papeles de reparaciones y facturación entre dos personas. En el caso normal, pasa el mensaje y registra la respuesta y el estado final de la reparación.
3. Repite con facturación marcada como caída. Guarda el mensaje en pendientes; cuando vuelva a estar disponible, procésalo y anota cómo cambia su estado.
4. Envía dos veces el mismo identificador. Comprueba en el diseño si se crea una factura o dos. Si no hay regla que lo impida, añádela y repite la simulación.
5. Intercambia los casos con otra pareja para que los siga sin explicaciones. Corrige las ambigüedades y entrega flujo, tabla de pruebas y justificación de la solución elegida.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Se evalúa la automatización diseñada y simulada, incluida su respuesta al fallo. No se exige una aplicación real ni pruebas de Servidor.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD2 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 3»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. La actividad de la unidad queda lista para valorar con su rúbrica; las correcciones se documentan en el mismo registro.

## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

---
title: "¿Qué significa digitalizar una empresa?"
label: "UD1 · Actividad"
section: "ud-01"
order: 1
lang: "es"
summary: "De una empresa tradicional a una empresa digital. Recorremos el camino problema → necesidad → solución tecnológica, y no al revés."
duration: "3 horas · 3 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Rediseño de Reparaciones Rápidas. Una actividad acumulativa por unidad, con evidencias y aportación individual."
date: "2026-09-09"
outcomes:
  - "Distinguir digitalizar un dato de rediseñar un proceso."
  - "Recorrer el camino problema → necesidad → tecnología, y no al revés."
  - "Reconocer las tecnologías habituales de una empresa y para qué sirve cada una."
  - "Justificar por qué una tecnología hace falta, o por qué no."
requirements:
  - "Guía de arranque y materiales de esta unidad, enlazados en la página."
  - "Materiales del caso y herramientas indicadas en la unidad."
priorKnowledge:
  - "No se requieren conocimientos previos de estos contenidos. La guía explica cómo abrir y guardar el trabajo; no se necesita ningún otro módulo."
---

<p class="lead">Rediseño de Reparaciones Rápidas. Cada sesión introduce los conceptos que necesita y continúa una misma actividad de la unidad. Conserva sus resultados para revisarlos y utilizarlos después.</p>

## Cómo trabajar esta unidad

Son 3 sesiones de una hora: 10 minutos de explicación, 45 de trabajo guiado y 5 de cierre. Los ejemplos ampliados son material de consulta durante la práctica; no añaden otra clase teórica ni tareas obligatorias.

Abre la [guía de arranque y evaluación](/es/docencia/talleres-transversales/). Incluye archivos, herramientas y alternativas de acceso. Para los casos utiliza la [ficha común](/teaching/transversales/casos.pdf). No se necesita el CRUD de Servidor ni el workflow de Intermodular. Quien ya conozca una herramienta utiliza ese conocimiento para justificar y comprobar la actividad nueva, sin repetir un trabajo ya evaluado.

## Actividad y criterios de evaluación

**Rediseño de Reparaciones Rápidas.** La actividad se construye durante las sesiones de la unidad: cada avance incorpora el resultado, su comprobación y las decisiones que lo justifican. Debes poder explicar cualquier decisión que contenga.

**Qué se entrega.** Un único documento, el **registro de la unidad**, que se crea en la sesión 1 y crece en cada sesión hasta quedar completo al final. No hay tareas sueltas ni examen: la calificación sale de ese documento y de que puedas explicar cualquier parte de él. Esto es lo que debe contener al cerrar cada sesión:

| Al terminar la sesión | El registro contiene |
| :--- | :--- |
| 1 | El dictamen razonado de las ocho propuestas de la dirección: categoría, hecho de la ficha que lo respalda y qué seguiría ocurriendo tras aplicar cada una |
| 2 | Lo anterior más el proceso futuro, la arquitectura propuesta, cada tecnología con la necesidad concreta que resuelve, y una alternativa descartada con el motivo del descarte |
| 3 | La versión defendida ante el profesor, corregida con las observaciones recibidas |

Los apartados de la tabla son los mismos que puntúa la rúbrica, de modo que un registro completo es un registro evaluable.

Esta actividad se valora sobre 10 puntos y aporta **3/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Registras y explicas cada decisión propia. La rúbrica se conoce desde el inicio:

<table>
  <thead>
    <tr>
      <th>Criterio</th>
      <th class="align-right">Puntuación</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Identificación de los problemas reales</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Calidad del nuevo proceso propuesto</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Coherencia de la arquitectura</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Selección y justificación de tecnologías</td>
      <td class="align-right">3</td>
    </tr>
    <tr>
      <td>Claridad de la presentación</td>
      <td class="align-right">1</td>
    </tr>
  </tbody>
</table>

En cada criterio, una evidencia ausente no permite acreditar el logro; una evidencia incompleta requiere revisión; una evidencia correcta permite comprobar el resultado; el logro completo añade una justificación coherente y reconoce sus límites. Los puntos se asignan según el grado de logro del criterio, no por cantidad de archivos, commits o texto. Consulta la guía para revisar y volver a presentar los criterios pendientes.

## Sesión 1 · Qué cambia realmente al digitalizar

**Punto de partida.** Actividad «Rediseño de Reparaciones Rápidas», sesión 1 de 3. Abre los materiales enlazados y crea el registro de la unidad: el documento que recoge la actividad completa y que se describe arriba, en «Qué se entrega». La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

**El caso.** Reparaciones Rápidas es una empresa ficticia que repara ordenadores, móviles y tabletas. El cliente llama o acude al local, y un trabajador anota en papel su nombre, su teléfono, el dispositivo y la avería. Cada mañana el responsable reparte el trabajo de palabra o por WhatsApp, y las fotografías de los dispositivos quedan en el teléfono de cada técnico. El cliente no puede consultar en qué estado está su reparación, de modo que llama para preguntar, y el histórico queda repartido entre documentos, hojas de cálculo y mensajes. La [ficha del caso](/teaching/transversales/casos.pdf) recoge esa descripción y los datos que utilizarás; el trabajo de la unidad parte de ahí.

**Antes de empezar · solicita hoy el acceso a las herramientas de IA.** La verificación de estudiante de GitHub la resuelve un tercero y puede tardar días, así que se lanza la primera semana y no el día en que hace falta, que es la UD4. Accede a [GitHub Education](https://github.com/education/students) con tu cuenta y solicita la verificación con el correo del centro y la documentación que te pida.

Mientras se resuelve no quedas bloqueado: **Copilot Free** funciona desde el primer día, con un límite mensual de completados. La verificación amplía ese límite y añade créditos de IA y acceso a agentes. Una vez concedida sirve en cualquier módulo, no solo en este.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una empresa digitaliza para resolver un problema de su trabajo. Un **proceso** es una secuencia de acciones con un inicio, un resultado y personas responsables. Pasar una ficha de papel a un PDF cambia su soporte; evitar que administración vuelva a copiar sus datos cambia el proceso. Antes de elegir herramientas necesitamos entender quién hace qué y dónde se atasca el trabajo.

En Reparaciones Rápidas se reciben dispositivos, se asignan técnicos y se avisa al cliente. «Usar IA» no describe una necesidad. «Evitar que el técnico y administración escriban dos veces la misma reparación» sí permite comprobar una mejora. IT gestiona información; OT actúa sobre equipos o procesos físicos. No todos los problemas de esta empresa necesitan ambas.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### Digitalizar no es simplemente utilizar ordenadores

Imagina una pequeña empresa en la que las citas se apuntan en una libreta.

Si sustituimos la libreta por un Excel:

**hemos digitalizado información.**

El proceso, sin embargo, permanece prácticamente inalterado.

<figure class="diagram">
  <figcaption>Antes · el proceso con la libreta</figcaption>
  <ol class="flow flow--before">
    <li>Cliente llama</li>
    <li>Empleado consulta disponibilidad</li>
    <li>Empleado apunta la cita</li>
    <li>Empleado avisa al trabajador</li>
  </ol>
</figure>

Podríamos rediseñar completamente el proceso:

<figure class="diagram">
  <figcaption>Después · el proceso rediseñado</figcaption>
  <ol class="flow flow--after">
    <li>Cliente</li>
    <li>Página web</li>
    <li>Selecciona día y hora</li>
    <li>Sistema comprueba disponibilidad</li>
    <li>Guarda automáticamente la cita</li>
    <li>Cliente recibe confirmación</li>
    <li>Trabajador ve la cita</li>
  </ol>
</figure>

Ahora no solo hemos sustituido papel por una pantalla.

**Hemos cambiado la forma en que funciona el proceso.**

A esto lo llamamos **transformación digital**.

#### Algunas tecnologías que encontrarás en las empresas

No necesitas conocerlas en profundidad todavía. Solo necesitas entender qué función pueden tener.

##### Aplicación web

Permite que clientes o trabajadores interactúen con un sistema utilizando un navegador.

Ejemplos:

* reservar una cita;
* realizar un pedido;
* consultar una reparación;
* gestionar clientes.

---

##### API

Una API permite que **dos aplicaciones intercambien información**.

Por ejemplo:

<figure class="diagram">
  <figcaption>Una API conecta dos aplicaciones</figcaption>
  <ol class="flow flow--row">
    <li>Tienda online</li>
    <li><strong>API</strong></li>
    <li>Empresa de transporte</li>
  </ol>
</figure>

La tienda puede enviar automáticamente a la empresa de transporte los datos necesarios para realizar un envío.

---

##### Base de datos

Permite almacenar información de forma organizada.

Por ejemplo:

* clientes;
* productos;
* pedidos;
* reparaciones;
* citas;
* facturas.

---

##### Cloud

En lugar de ejecutar una aplicación únicamente en los ordenadores de la empresa, podemos utilizar infraestructura accesible a través de Internet.

Esto facilita, entre otras cosas:

* acceder desde diferentes lugares;
* desplegar aplicaciones;
* almacenar información;
* aumentar recursos cuando sea necesario.

Más adelante estudiaremos este concepto con mayor profundidad.

---

##### Automatización

Una automatización permite que ciertas tareas se ejecuten sin que una persona tenga que hacerlas manualmente cada vez.

Por ejemplo:

<figure class="diagram">
  <figcaption>Una automatización encadena tareas</figcaption>
  <ol class="flow">
    <li>Pedido confirmado</li>
    <li>Generar factura</li>
    <li>Enviar email</li>
    <li>Actualizar stock</li>
  </ol>
</figure>

---

##### Datos y analítica

Las aplicaciones generan datos.

Estos datos pueden utilizarse para responder preguntas:

* ¿qué producto se vende más?
* ¿cuándo tenemos más clientes?
* ¿cuánto tarda una reparación?
* ¿qué problemas aparecen con mayor frecuencia?

---

##### Inteligencia artificial

La IA puede utilizarse para tareas concretas como:

* clasificar textos;
* resumir información;
* buscar información;
* detectar patrones;
* generar contenido;
* ayudar a tomar determinadas decisiones.

Pero:

> **no todo necesita inteligencia artificial.**

Utilizar IA donde una solución sencilla funciona mejor puede aumentar el coste y la complejidad sin aportar valor.

#### IT y OT

Hay dos conceptos que aparecen frecuentemente cuando hablamos de digitalización.

##### IT — Information Technology

Son los sistemas utilizados principalmente para gestionar información.

Por ejemplo:

* aplicaciones web;
* servidores;
* bases de datos;
* correo electrónico;
* software empresarial.

##### OT — Operational Technology

Son tecnologías que interactúan con procesos físicos.

Por ejemplo:

* sensores;
* maquinaria;
* robots;
* sistemas de control;
* dispositivos industriales.

Ejemplo:

<figure class="diagram">
  <figcaption>Del mundo OT al mundo IT</figcaption>
  <ol class="flow">
    <li>Sensor de temperatura <span class="tag tag--ot">OT</span></li>
    <li>Internet</li>
    <li>Servidor <span class="tag tag--it">IT</span></li>
    <li>Aplicación web <span class="tag tag--it">IT</span></li>
  </ol>
</figure>

El sensor pertenece al mundo **OT**.

La aplicación y el servidor pertenecen principalmente al mundo **IT**.

La digitalización está haciendo que ambos mundos estén cada vez más conectados.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

La dirección de Reparaciones Rápidas ha recogido ocho propuestas de distintas personas de la empresa. Tu trabajo consiste en dictaminar cada una contra la [ficha del caso](/teaching/transversales/casos.pdf): qué problema aborda, qué seguiría ocurriendo después de aplicarla y en qué categoría de las tres cae. No se trata de elegir la mejor, sino de sostener por qué cada una hace lo que hace.

| Categoría | Qué significa |
| :--- | :--- |
| **Cambia el proceso** | Altera quién hace qué, cuándo o con qué información, de modo que el problema deja de producirse |
| **Cambia solo el soporte** | La misma secuencia de trabajo con otra herramienta: el problema sobrevive al cambio |
| **No es una propuesta** | No identifica un dato, una decisión ni un cambio que pueda comprobarse |

| | Propuesta recogida por la dirección |
| :--- | :--- |
| 1 | Escanear las fichas de papel y guardarlas en una carpeta compartida, ordenadas por fecha |
| 2 | Un formulario en una tableta en el mostrador, que registre la reparación y le asigne un número |
| 3 | Formalizar el reparto diario en un grupo de mensajería |
| 4 | Que cada técnico suba las fotografías del dispositivo a la ficha de su reparación |
| 5 | Una pantalla en el local con el estado de las reparaciones del día |
| 6 | Un aviso automático al cliente cuando su reparación pasa a «terminada» |
| 7 | Implantar inteligencia artificial para optimizar el taller |
| 8 | Una hoja de cálculo compartida donde administración anote cada reparación al cerrarla, para obtener estadísticas |

Cada dictamen necesita tres cosas: la categoría, **el hecho de la ficha** al que se refiere —citado, no resumido de memoria— y **qué seguiría ocurriendo** en la empresa después de aplicar la propuesta. Cuando concluyas que una resuelve algo, añade qué se podría observar para demostrarlo: una espera que desaparece, unas llamadas que dejan de producirse, un dato que deja de escribirse dos veces.

Dos advertencias. Una propuesta puede resolver un problema y crear otro, y eso forma parte del dictamen. Ninguna de las ocho es tampoco acertada o desacertada por sí misma: lo que se evalúa es si tu razonamiento se sostiene sobre lo que dice la ficha, no si coincide con una respuesta esperada.

**Entrega.** Exporta el documento a PDF con los ocho dictámenes razonados. Ese PDF es el registro de la unidad en su primer estado.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

El registro contiene los ocho dictámenes, cada uno con su categoría, el hecho de la ficha que lo respalda y lo que seguiría ocurriendo. Debes poder sostener en voz alta por qué una propuesta que suena razonable, como digitalizar las fichas de papel, deja intacto el problema que dice resolver. Guarda el documento: la sesión 2 continúa sobre él, no empieza otro.


## Sesión 2 · Rediseña una empresa

**Punto de partida.** Actividad «Rediseño de Reparaciones Rápidas» —el taller ficticio de reparación de dispositivos del caso—, sesión 2 de 3. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

El **proceso futuro** describe cómo queremos trabajar, no una lista de programas. Una tecnología solo está justificada si resuelve una necesidad y podemos explicar quién la utilizará. Una arquitectura conceptual muestra las piezas y los datos que pasan entre ellas, sin exigir código ni servidores reales.

Por ejemplo, un formulario de recepción puede guardar una reparación en un registro compartido. El técnico actualiza su estado y administración consulta ese mismo registro. Hemos eliminado una copia de datos. Añadir una aplicación móvil propia puede resultar innecesario si una página accesible desde el navegador cubre la necesidad.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Recupera de la sesión anterior los problemas que, según tus dictámenes, ninguna de las ocho propuestas dejaba resueltos. Son el punto de partida del proceso futuro, que describes en una sección nueva para que pueda compararse con el estado actual del caso.
2. Elige dos de los problemas documentados. Para cada uno escribe una necesidad, una acción nueva y una persona responsable. Comprueba que no has dejado sin dueño el aviso al cliente.
3. Completa una tabla con necesidad, solución propuesta y motivo. Utiliza categorías como registro compartido, formulario o notificación antes de elegir un proveedor.
4. Dibuja las piezas de la solución y escribe sobre cada flecha qué dato viaja: identificador de reparación, estado o contacto. Si una caja no tiene una función explicable, elimínala o aclárala.
5. Añade una alternativa descartada, su ventaja y por qué no compensa en este caso. Prepara una comparación de antes/después basada en el problema, sin inventar cifras de ahorro.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

El documento contiene proceso actual, proceso futuro, arquitectura y una alternativa descartada. Cada tecnología tiene una necesidad concreta asociada.


## Sesión 3 · Revisión y defensa de la propuesta

**Punto de partida.** Actividad «Rediseño de Reparaciones Rápidas» —el taller ficticio de reparación de dispositivos del caso—, sesión 3 de 3. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Defender una propuesta significa relacionar una decisión con sus motivos y límites. La persona que la escucha necesita reconocer el problema, comprender el cambio y saber qué habría que comprobar antes de aplicarlo. «Es más moderno» no permite tomar una decisión; «evita registrar el teléfono dos veces» sí describe un efecto verificable.

Una observación útil señala una parte concreta y propone cómo comprobarla. «No se entiende» es demasiado general; «no aparece quién avisa si el cliente no responde» identifica una omisión que se puede corregir.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Selecciona en el documento tres elementos: problema prioritario, cambio propuesto y alternativa descartada. Escribe una frase para explicar cada uno sin leer toda la entrega.
2. Ensaya la explicación en voz alta durante tres minutos. Anota después las dos preguntas que plantearía quien no conoce el caso, una sobre responsables y otra sobre viabilidad, y respóndelas en el documento.
3. Responde con el diagrama delante. Si el caso no proporciona un dato, indica qué información pedirías; no improvises un presupuesto como si fuera real.
4. Revisa la propuesta incorporando al menos una observación justificada. Guarda una nota «observación → decisión → cambio» para que se vea la mejora.
5. Entrega el enlace al documento final con sus versiones o su registro de cambios, e incluye una decisión propia que puedas explicar. La defensa es individual: expones tu propuesta y respondes a las preguntas que se te planteen.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Se evalúa el rediseño de la UD1, actualizado con feedback. La exposición explica la actividad; no requiere otra presentación ni un examen adicional.


## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

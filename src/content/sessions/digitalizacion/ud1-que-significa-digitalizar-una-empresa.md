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

**Rediseño de Reparaciones Rápidas.** La actividad se construye durante las sesiones de la unidad: cada avance incorpora el resultado, su comprobación y las decisiones que lo justifican. Cada integrante debe poder explicar su aportación.

Esta actividad se valora sobre 10 puntos y aporta **3/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Cada integrante registra y explica su aportación. La rúbrica se conoce desde el inicio:

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

**Punto de partida.** Actividad «Rediseño de Reparaciones Rápidas», sesión 1 de 3. Abre los materiales enlazados y crea el registro de la unidad. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

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

1. Abre la [ficha de Reparaciones Rápidas](/teaching/transversales/casos.pdf). Identifica el objetivo del trabajo: mejorar la gestión de reparaciones.
2. Lee la entrada, asignación y cierre de una reparación. Dibuja una caja por acción y une las cajas con flechas; escribe encima quién realiza cada acción. No añadas todavía aplicaciones nuevas.
3. Marca tres dificultades que aparezcan en la ficha. Para cada una anota el hecho, a quién afecta y su consecuencia. Ejemplo: las fotos quedan en el móvil del técnico; administración no puede consultarlas al preparar la factura.
4. Elige un problema y formúlalo como necesidad sin mencionar marcas: «la información de una reparación debe estar disponible para quien la tramita». Distingue el dato que aporta el caso de una suposición propia.
5. Intercambia el dibujo con otra pareja. Pídele que siga una reparación desde la llegada hasta el aviso al cliente. Corrige una flecha o un responsable que no pueda explicar.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Debe quedar un proceso actual comprensible y tres problemas respaldados por el caso. Explica por qué digitalizar un papel no garantiza resolverlos.


## Sesión 2 · Rediseña una empresa

**Punto de partida.** Actividad «Rediseño de Reparaciones Rápidas», sesión 2 de 3. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

El **proceso futuro** describe cómo queremos trabajar, no una lista de programas. Una tecnología solo está justificada si resuelve una necesidad y podemos explicar quién la utilizará. Una arquitectura conceptual muestra las piezas y los datos que pasan entre ellas, sin exigir código ni servidores reales.

Por ejemplo, un formulario de recepción puede guardar una reparación en un registro compartido. El técnico actualiza su estado y administración consulta ese mismo registro. Hemos eliminado una copia de datos. Añadir una aplicación móvil propia puede resultar innecesario si una página accesible desde el navegador cubre la necesidad.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre el proceso actual de la sesión anterior y conserva una copia con ese título. En otra sección dibuja el proceso futuro; así podrá compararse qué ha cambiado.
2. Elige dos de los problemas documentados. Para cada uno escribe una necesidad, una acción nueva y una persona responsable. Comprueba que no has dejado sin dueño el aviso al cliente.
3. Completa una tabla con necesidad, solución propuesta y motivo. Utiliza categorías como registro compartido, formulario o notificación antes de elegir un proveedor.
4. Dibuja las piezas de la solución y escribe sobre cada flecha qué dato viaja: identificador de reparación, estado o contacto. Si una caja no tiene una función explicable, elimínala o aclárala.
5. Añade una alternativa descartada, su ventaja y por qué no compensa en este caso. Prepara una comparación de antes/después basada en el problema, sin inventar cifras de ahorro.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

El documento contiene proceso actual, proceso futuro, arquitectura y una alternativa descartada. Cada tecnología tiene una necesidad concreta asociada.


## Sesión 3 · Puesta en común, debate y defensa de propuestas

**Punto de partida.** Actividad «Rediseño de Reparaciones Rápidas», sesión 3 de 3. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Defender una propuesta significa relacionar una decisión con sus motivos y límites. La persona que la escucha necesita reconocer el problema, comprender el cambio y saber qué habría que comprobar antes de aplicarlo. «Es más moderno» no permite tomar una decisión; «evita registrar el teléfono dos veces» sí describe un efecto verificable.

Una observación útil señala una parte concreta y propone cómo comprobarla. «No se entiende» es demasiado general; «no aparece quién avisa si el cliente no responde» identifica una omisión que se puede corregir.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Selecciona en el documento tres elementos: problema prioritario, cambio propuesto y alternativa descartada. Escribe una frase para explicar cada uno sin leer toda la entrega.
2. Ensaya durante tres minutos con otra pareja. Mientras una persona explica, la otra anota una duda sobre responsables y otra sobre viabilidad. Después intercambiad los papeles.
3. Responde con el diagrama delante. Si el caso no proporciona un dato, indica qué información pedirías; no improvises un presupuesto como si fuera real.
4. Revisa la propuesta incorporando al menos una observación justificada. Guarda una nota «observación → decisión → cambio» para que se vea la mejora.
5. Entrega el enlace al documento final con sus versiones o registro de cambios. Cada integrante añade una decisión propia que pueda explicar. Los turnos ante toda la clase se reparten dentro del tiempo disponible; todas las parejas realizan la revisión cruzada.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Se evalúa el rediseño de la UD1, actualizado con feedback. La exposición explica la actividad; no requiere otra presentación ni un examen adicional.


## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

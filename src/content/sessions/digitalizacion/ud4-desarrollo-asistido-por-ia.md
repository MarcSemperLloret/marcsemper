---
title: "Desarrollo de software asistido por Inteligencia Artificial"
label: "UD4 · Proyecto"
section: "ud-04"
order: 4
lang: "es"
summary: "Aprende a trabajar con un agente de programación construyendo tu propio portfolio. Contexto, instrucciones, skills, herramientas y MCP: dirigir la IA y verificar lo que produce."
duration: "4 horas · 4 sesiones"
modality: "Individual o parejas"
deliverable: "Vuestro portfolio publicado en GitHub, con instrucciones de proyecto, una skill de revisión y evidencias del trabajo con el agente."
date: "2026-08-28"
outcomes:
  - "Escribir una petición con objetivo, contexto, restricciones y criterios de aceptación."
  - "Configurar las instrucciones del repositorio para que el agente conozca vuestro proyecto."
  - "Crear una skill reutilizable para una tarea que repetís."
  - "Explicar qué son las tools y MCP, y por qué no se da acceso a todo."
  - "Revisar plan, diff y tests antes de aceptar un cambio."
requirements:
  - "Visual Studio Code con GitHub Copilot activado (GitHub Student)."
  - "Git y una cuenta de GitHub."
priorKnowledge:
  - "Clonar un repositorio, hacer commits y leer un diff."
  - "Publicar un sitio estático (UD3)."
---

## Sesión 1 · Dirige bien a la IA

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> La diferencia entre autocompletado y agentes autónomos, y cómo estructurar prompts profesionales con objetivo, contexto, restricciones y criterios de aceptación.</li>
    <li><strong>2. Haz:</strong> Configura GitHub Copilot en VS Code y crea la estructura inicial de tu portfolio mediante peticiones dirigidas.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el Checkpoint de la sesión 1.</li>
  </ol>
</div>

### ¿Qué vamos a aprender?

La Inteligencia Artificial está cambiando la forma de desarrollar software.

Hace unos años, un asistente de programación se limitaba principalmente a completar unas líneas de código.

Actualmente puede:

* leer un proyecto;
* localizar archivos;
* explicar código;
* modificar varios archivos;
* ejecutar comandos;
* crear tests;
* detectar errores;
* revisar cambios;
* consultar documentación;
* utilizar herramientas externas.

Esto cambia también el papel del desarrollador.

El objetivo ya no es simplemente:

> **«conseguir que la IA escriba código».**

El objetivo es aprender a:

> **darle contexto, definir correctamente una tarea, controlar lo que hace y comprobar que el resultado es correcto.**

---

### Activar GitHub Copilot Student

Los estudiantes que cumplen los requisitos de GitHub Education pueden solicitar **Copilot Student**.

Acceded a vuestra cuenta de GitHub y comprobad que disponéis del beneficio educativo.

Una vez activado, utilizaremos Copilot desde Visual Studio Code.

---

### De autocompletado a agente

La forma de utilizar IA para programar ha evolucionado rápidamente.

Podemos simplificarla en cuatro etapas.

#### Nivel 1 — Autocompletado

El sistema intenta continuar lo que estamos escribiendo.

Por ejemplo:

```javascript
function calcularPrecioConIVA(precio) {
```

y propone:

```javascript
return precio * 1.21;
```

Esto ahorra tiempo, pero el desarrollador sigue realizando casi todo el trabajo.

#### Nivel 2 — Chat

Podemos preguntar:

> ¿Qué hace esta función?

o:

> Encuentra el error de este código.

El modelo recibe código y responde con texto o propuestas de modificación.

#### Nivel 3 — Edición del proyecto

El asistente puede trabajar con diferentes archivos del proyecto.

Por ejemplo:

> Añade un campo `telefono` a los clientes.

Esto podría requerir modificar:

<figure class="diagram">
  <figcaption>Un cambio pequeño que toca muchas capas</figcaption>
  <ol class="flow">
    <li>Modelo</li>
    <li>Base de datos</li>
    <li>Servicio</li>
    <li>API</li>
    <li>Frontend</li>
    <li>Tests</li>
  </ol>
</figure>

Ya no estamos simplemente completando una línea.

#### Nivel 4 — Agente

Un agente puede recibir un objetivo y realizar diferentes acciones para intentar conseguirlo.

Por ejemplo:

<figure class="diagram">
  <figcaption>Objetivo: añadir paginación a productos</figcaption>
  <ol class="flow">
    <li>Analizar el repositorio</li>
    <li>Localizar el código relacionado</li>
    <li>Modificar archivos</li>
    <li>Ejecutar los tests</li>
    <li>Detectar un error</li>
    <li>Corregirlo</li>
    <li>Volver a ejecutar los tests</li>
  </ol>
</figure>

Aquí aparece una idea fundamental:

> **Un agente no solo genera texto. Puede actuar sobre nuestro entorno.**

---

### Modelo y agente no son lo mismo

Un modelo de lenguaje recibe información y genera una respuesta.

Podemos imaginar:

<figure class="diagram">
  <figcaption>Un modelo, por sí solo</figcaption>
  <ol class="flow flow--row">
    <li>Texto</li>
    <li>LLM</li>
    <li>Texto</li>
  </ol>
</figure>

Un agente añade más elementos:

<figure class="diagram">
  <figcaption>Un agente: modelo, contexto y herramientas</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 390" role="img" aria-labelledby="agent-title agent-desc" preserveAspectRatio="xMidYMid meet">
    <title id="agent-title">Componentes de un agente</title>
    <desc id="agent-desc">El agente recibe un objetivo y un contexto, dispone de herramientas para trabajar con archivos, la terminal y Git, y a partir de ahí produce un resultado.</desc>
    <defs>
      <marker id="agent-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 52 L 360 80" marker-end="url(#agent-arrow)" />
      <path d="M 190 110 L 274 110" marker-end="url(#agent-arrow)" />
      <path d="M 360 134 L 360 172" />
      <path d="M 130 172 L 590 172" />
      <path d="M 130 172 L 130 194" marker-end="url(#agent-arrow)" />
      <path d="M 360 172 L 360 194" marker-end="url(#agent-arrow)" />
      <path d="M 590 172 L 590 194" marker-end="url(#agent-arrow)" />
      <path d="M 130 244 L 130 290" />
      <path d="M 360 244 L 360 290" />
      <path d="M 590 244 L 590 290" />
      <path d="M 130 290 L 590 290" />
      <path d="M 360 290 L 360 320" marker-end="url(#agent-arrow)" />
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="290" y="12" width="140" height="40" rx="3" />
      <text x="360" y="32">Contexto</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="40" y="88" width="150" height="44" rx="3" />
      <text x="115" y="110">Objetivo</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="86" width="160" height="48" rx="3" />
      <text x="360" y="110">Agente</text>
    </g>
    <g class="diagram-node">
      <rect x="45" y="200" width="170" height="44" rx="3" />
      <text x="130" y="222">Archivos</text>
    </g>
    <g class="diagram-node">
      <rect x="275" y="200" width="170" height="44" rx="3" />
      <text x="360" y="222">Terminal</text>
    </g>
    <g class="diagram-node">
      <rect x="505" y="200" width="170" height="44" rx="3" />
      <text x="590" y="222">Git</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="326" width="160" height="44" rx="3" />
      <text x="360" y="348">Resultado</text>
    </g>
  </svg>
</figure>

Por tanto:

> **Agente ≈ modelo + contexto + herramientas + capacidad para realizar varios pasos.**

---

### La IA no conoce automáticamente nuestro proyecto

Imaginad que acabáis de entrar a trabajar en una empresa.

El primer día alguien os dice:

> Haz el sistema de login.

Probablemente preguntaríais:

* ¿qué tecnología utilizamos?
* ¿qué arquitectura tiene el proyecto?
* ¿cómo almacenamos los usuarios?
* ¿qué librerías utilizamos?
* ¿cómo hacemos los tests?
* ¿qué convenciones sigue el equipo?

Un agente tiene exactamente el mismo problema.

Si no conoce el proyecto, tendrá que adivinar, inferir o utilizar soluciones genéricas.

Y puede equivocarse.

---

### Context engineering

Una de las habilidades más importantes al trabajar con IA es proporcionar el **contexto adecuado**.

Comparad:

#### Petición A

> Haz el login.

#### Petición B

> Implementa autenticación mediante email y contraseña.
>
> El proyecto utiliza Node.js, Express y PostgreSQL.
>
> Mantén la arquitectura existente.
>
> No añadas nuevas dependencias salvo que sean necesarias.
>
> Las contraseñas nunca deben almacenarse en texto plano.
>
> Añade tests para: login correcto, contraseña incorrecta y usuario inexistente.
>
> Antes de modificar el proyecto, explica qué archivos necesitas cambiar.

La segunda petición proporciona mucha más información.

Por tanto:

<figure class="diagram">
  <figcaption>Por qué el contexto cambia el resultado</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Mejor contexto</li>
    <li>Menos suposiciones</li>
    <li>Mejor resultado</li>
  </ol>
</figure>

A esta idea se la suele denominar:

<p class="term">Context engineering</p>

No consiste únicamente en escribir un prompt largo.

Consiste en conseguir que el agente tenga disponible **la información correcta en el momento adecuado**.

---

### Cómo describir una tarea profesionalmente

Una buena tarea debería contener al menos cuatro partes.

#### Objetivo

¿Qué queremos conseguir?

> Añadir búsqueda de productos por nombre.

#### Contexto

¿Qué sistema tenemos?

> La aplicación utiliza Express y PostgreSQL. Existe un endpoint `/products`.

#### Restricciones

¿Qué debe respetarse?

> No cambies el formato actual de las respuestas de la API.

#### Criterios de aceptación

¿Cómo sabemos que la tarea está terminada?

> Una búsqueda por `lap` debe encontrar `Laptop`.
>
> Una búsqueda sin resultados debe devolver una lista vacía.
>
> Deben existir tests.

Podemos utilizar esta plantilla:

<figure class="diagram">
  <figcaption>Plantilla · describid vuestra tarea</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Objetivo</span><span class="write-line"></span></li>
    <li><span class="flow-role">Contexto</span><span class="write-line"></span></li>
    <li><span class="flow-role">Restricciones</span><span class="write-line"></span></li>
    <li><span class="flow-role">Criterios de aceptación</span><span class="write-line"></span></li>
    <li><span class="flow-role">Forma de verificación</span><span class="write-line"></span></li>
  </ol>
</figure>

Esta estructura no es útil únicamente para la IA.

Es también una buena forma de escribir tareas para otros desarrolladores.

---

### Primera actividad — El mismo problema con dos peticiones

Durante toda la unidad trabajaremos sobre **vuestro propio portfolio**: una web
personal que iréis construyendo con ayuda del agente y que quedará publicada en
GitHub.

Para empezar necesitáis muy poco: una página con un formulario de contacto.
Podéis escribirla vosotros en cinco minutos o pedírsela al agente.

Con esa página delante, pedid a Copilot:

> Añade validación al formulario de contacto.

Observad qué propone.

No aceptéis todavía los cambios.

Ahora cread una segunda petición utilizando objetivo, contexto, restricciones, criterios de aceptación y verificación.

Comparad ambos resultados y responded:

##### ¿Qué diferencias aparecen?

<p class="write-line"></p>

##### ¿Cuál de las dos respuestas necesita menos correcciones?

<p class="write-line"></p>

##### ¿Qué información adicional ha resultado útil?

<p class="write-line"></p>

---

<details class="aside aside--help">
  <summary>Estoy atascado · Copilot me responde cualquier cosa</summary>
  <ol>
    <li>¿Le habéis dicho el objetivo, o solo la acción? «Arregla esto» no es un objetivo.</li>
    <li>¿Sabe en qué ficheros tiene que mirar? Si no se lo decís, se lo inventa.</li>
    <li>¿Le habéis dado alguna restricción? Sin ellas hará lo más habitual, que rara vez es lo vuestro.</li>
    <li>¿Le habéis dicho cómo sabréis que ha terminado bien? Sin criterio de aceptación, cualquier respuesta le vale.</li>
    <li>Si la respuesta es genérica, vuestra petición también lo era. Reescribidla antes de volver a preguntar.</li>
  </ol>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Copilot activado y funcionando en VS Code.</li>
    <li>Sabes distinguir autocompletado, chat y agente.</li>
    <li>Sabes distinguir el modelo del agente.</li>
    <li>Has escrito la misma tarea dos veces, mal y bien, y has comparado los resultados.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre un modelo y un agente?</li>
    <li>¿Qué cuatro cosas debe llevar una petición bien escrita?</li>
    <li>¿Por qué la IA no conoce vuestro proyecto por defecto?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El modelo genera texto. El agente puede además actuar: leer ficheros, ejecutar comandos, modificar código.</p>
  <p>2 · Objetivo, contexto, restricciones y criterios de aceptación.</p>
  <p>3 · Porque solo ve lo que le entra en el contexto. Si no se lo damos, se lo inventa a partir de lo que suele ser habitual.</p>
</details>

---

## Sesión 2 · Haz que conozca tu proyecto

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo dotar de reglas persistentes al agente mediante instrucciones de proyecto (<code>.github/copilot-instructions.md</code>) y skills especializadas.</li>
    <li><strong>2. Haz:</strong> Redacta las directrices de tu repositorio y crea una skill de revisión automática de código.</li>
    <li><strong>3. Comprueba:</strong> Valida que el agente respeta las directrices del proyecto sin tener que repetírselas en cada prompt.</li>
  </ol>
</div>

### El problema de repetir siempre las mismas instrucciones

Imaginemos que trabajamos en una empresa y siempre tenemos que recordar al agente:

* utiliza Java 21;
* no uses field injection;
* utiliza nombres en inglés;
* añade tests;
* sigue la arquitectura Controller → Service → Repository;
* no cambies contratos públicos sin autorización.

Sería absurdo repetirlo en cada conversación.

Por eso podemos guardar **instrucciones del proyecto**.

---

### Instrucciones del repositorio

GitHub Copilot permite guardar instrucciones generales en:

<p class="single-node single-node--mono">.github/copilot-instructions.md</p>

Estas instrucciones se aplican al trabajar con el repositorio.

También existen instrucciones específicas para determinadas rutas y archivos `AGENTS.md`.

La idea es sencilla:

<figure class="diagram">
  <figcaption>El proyecto explica cómo se trabaja en él</figcaption>
  <ol class="flow">
    <li>Repositorio</li>
    <li>Instrucciones permanentes</li>
    <li>Agente</li>
  </ol>
</figure>

El proyecto empieza a **explicar al agente cómo debe trabajar**.

---

### Ejemplo de instrucciones

Creamos <code>.github/copilot-instructions.md</code>:

```markdown
# Project instructions

## Stack

- Node.js 22
- Express
- PostgreSQL
- Jest

## Architecture

The project follows:

route -> controller -> service -> repository

Do not bypass layers.

## Coding rules

- Use clear variable names.
- Avoid duplicated code.
- Do not add dependencies unless necessary.
- Never place secrets in source code.

## Testing

Every new feature must include tests.

Before considering a task complete:

1. run the test suite;
2. check for errors;
3. summarize the files modified.
```

Estas instrucciones no corresponden a una tarea concreta.

Describen:

> **cómo debe trabajar el agente en este proyecto.**

---

### Prompt vs instrucciones

Es importante distinguirlos.

<div class="compare-pair">
  <div>
    <p class="compare-label">Prompt</p>
    <p class="compare-body">¿Qué quiero hacer ahora?</p>
  </div>
  <div>
    <p class="compare-label">Instrucciones</p>
    <p class="compare-body">¿Cómo se trabaja aquí siempre?</p>
  </div>
</div>

Un prompt describe lo que queremos ahora:

> Añade paginación a productos.

Las instrucciones describen reglas permanentes:

> Utiliza la arquitectura existente. Añade tests. No añadas dependencias innecesarias.

---

### Segunda actividad — Enseñar el proyecto al agente

Cread en vuestro repositorio <code>.github/copilot-instructions.md</code>.

Incluid como mínimo:

* stack tecnológico;
* arquitectura;
* convenciones de código;
* reglas de testing;
* reglas de seguridad;
* qué debe comprobar antes de terminar una tarea.

Después pedid nuevamente a Copilot una pequeña modificación y responded:

##### ¿Ha seguido las instrucciones?

<p class="write-line"></p>

##### ¿Qué instrucciones han sido útiles?

<p class="write-line"></p>

##### ¿Hay alguna que haya ignorado?

<p class="write-line"></p>

---

### Una instrucción no siempre debe estar cargada

Imaginad que tenemos una guía de 100 líneas sobre cómo revisar seguridad.

No necesitamos esa guía cuando simplemente estamos cambiando el color de un botón.

Cargar constantemente información irrelevante también puede empeorar el contexto.

Por eso existen las:

<p class="term">Skills</p>

---

### ¿Qué es una skill?

Una **skill** contiene instrucciones especializadas para realizar bien un determinado tipo de tarea.

Por ejemplo:

<p class="single-node single-node--mono">.github/skills/security-review/SKILL.md</p>

La skill podría explicar:

> Cuando revises seguridad:
>
> * busca credenciales;
> * revisa validación de entradas;
> * comprueba SQL Injection;
> * revisa autenticación;
> * comprueba dependencias;
> * genera un informe.

GitHub Copilot puede cargar una skill cuando detecta que es relevante para la tarea.

---

### Instructions vs Skills

La diferencia puede entenderse fácilmente.

<figure class="diagram">
  <figcaption>Lo que siempre está frente a lo que se carga cuando hace falta</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 220" role="img" aria-labelledby="skills-title skills-desc" preserveAspectRatio="xMidYMid meet">
    <title id="skills-title">Instrucciones frente a skills</title>
    <desc id="skills-desc">El agente dispone siempre de las instrucciones del proyecto, mientras que las skills se cargan únicamente cuando la tarea las necesita.</desc>
    <defs>
      <marker id="skills-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 60 L 360 100" />
      <path d="M 200 100 L 520 100" />
      <path d="M 200 100 L 200 126" marker-end="url(#skills-arrow)" />
      <path d="M 520 100 L 520 126" marker-end="url(#skills-arrow)" />
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="12" width="160" height="48" rx="3" />
      <text x="360" y="36">Agente</text>
    </g>
    <g class="diagram-node">
      <rect x="90" y="132" width="220" height="56" rx="3" />
      <text x="200" y="152">Instrucciones</text>
      <text class="diagram-subtext" x="200" y="172">siempre disponibles</text>
    </g>
    <g class="diagram-node">
      <rect x="410" y="132" width="220" height="56" rx="3" />
      <text x="520" y="152">Skills</text>
      <text class="diagram-subtext" x="520" y="172">cuando hacen falta</text>
    </g>
  </svg>
</figure>

Las **instrucciones** son información útil casi siempre: «utilizamos Node.js», «todos los cambios deben tener tests».

Una **skill** es información útil para una tarea especializada: el procedimiento para realizar una revisión de seguridad.

---

### Crear nuestra primera skill

Crearemos <code>.github/skills/code-review/SKILL.md</code>.

Una skill sencilla podría tener:

```markdown
---
name: code-review
description: Review code changes looking for bugs, maintainability problems and missing tests.
---

# Code review procedure

When reviewing code:

1. Identify the files that changed.
2. Look for obvious bugs.
3. Check duplicated code.
4. Check error handling.
5. Check input validation.
6. Check whether tests cover the new behaviour.
7. Do not modify the code automatically.

Return:

- Problem
- Severity: low / medium / high
- File
- Proposed solution
```

No queremos una skill enorme.

Queremos comprender la idea de:

> **encapsular una forma de trabajar que podamos reutilizar.**

---

### Tercera actividad — Crear una skill

Cread vuestra propia skill de <code>code-review</code>.

Después modificad deliberadamente algo de vuestro portfolio. Por ejemplo:

* eliminad una validación;
* introducid código duplicado;
* eliminad un test;
* dejad un `console.log`;
* cread un tratamiento deficiente de errores.

Pedid a Copilot:

> Revisa los cambios del proyecto.

Comprobad:

##### ¿Detecta el problema?

<p class="write-line"></p>

##### ¿Utiliza el procedimiento indicado?

<p class="write-line"></p>

##### ¿Propone una solución razonable?

<p class="write-line"></p>

---

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Tu repositorio tiene un fichero de instrucciones de proyecto.</li>
    <li>Las instrucciones dicen cómo se trabaja aquí, no qué hacer ahora.</li>
    <li>Tienes creada al menos una skill.</li>
    <li>Sabes cuándo algo es una instrucción y cuándo es una skill.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre un prompt y unas instrucciones de proyecto?</li>
    <li>¿Cuándo conviene una skill en lugar de una instrucción?</li>
    <li>¿Por qué no metemos todo en las instrucciones?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El prompt dice qué quiero ahora; las instrucciones dicen cómo trabajamos siempre en este proyecto.</p>
  <p>2 · Cuando es un procedimiento especializado que solo hace falta a veces: una auditoría, una migración, un tipo de revisión.</p>
  <p>3 · Porque todo lo que está cargado ocupa contexto y compite con el problema real. Lo que no se usa siempre, no debe estar siempre.</p>
</details>

---

## Sesión 3 · Dale herramientas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo funcionan las herramientas internas de ejecución y el protocolo MCP (Model Context Protocol) bajo el principio de mínimo privilegio.</li>
    <li><strong>2. Haz:</strong> Configura herramientas para que el agente pueda inspeccionar ficheros, ejecutar tests y consultar documentación externa de forma controlada.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall sobre seguridad e integración de herramientas.</li>
  </ol>
</div>

### Las herramientas: darle manos al agente

Hasta ahora el agente conoce información.

Pero también puede disponer de herramientas.

Una herramienta permite ejecutar una acción.

<figure class="diagram">
  <figcaption>Herramientas dentro del propio proyecto</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 200" role="img" aria-labelledby="tools-title tools-desc" preserveAspectRatio="xMidYMid meet">
    <title id="tools-title">Herramientas internas de un agente</title>
    <desc id="tools-desc">El agente puede leer archivos, ejecutar tests y buscar código dentro del proyecto.</desc>
    <defs>
      <marker id="tools-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 60 L 360 96" />
      <path d="M 130 96 L 590 96" />
      <path d="M 130 96 L 130 124" marker-end="url(#tools-arrow)" />
      <path d="M 360 96 L 360 124" marker-end="url(#tools-arrow)" />
      <path d="M 590 96 L 590 124" marker-end="url(#tools-arrow)" />
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="12" width="160" height="48" rx="3" />
      <text x="360" y="36">Agente</text>
    </g>
    <g class="diagram-node">
      <rect x="45" y="130" width="170" height="44" rx="3" />
      <text x="130" y="152">Leer archivos</text>
    </g>
    <g class="diagram-node">
      <rect x="275" y="130" width="170" height="44" rx="3" />
      <text x="360" y="152">Ejecutar tests</text>
    </g>
    <g class="diagram-node">
      <rect x="505" y="130" width="170" height="44" rx="3" />
      <text x="590" y="152">Buscar código</text>
    </g>
  </svg>
</figure>

O herramientas externas:

<figure class="diagram">
  <figcaption>Herramientas fuera del proyecto</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 200" role="img" aria-labelledby="ext-title ext-desc" preserveAspectRatio="xMidYMid meet">
    <title id="ext-title">Herramientas externas de un agente</title>
    <desc id="ext-desc">El agente puede conectarse con GitHub, con una base de datos o con una API externa.</desc>
    <defs>
      <marker id="ext-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 60 L 360 96" />
      <path d="M 130 96 L 590 96" />
      <path d="M 130 96 L 130 124" marker-end="url(#ext-arrow)" />
      <path d="M 360 96 L 360 124" marker-end="url(#ext-arrow)" />
      <path d="M 590 96 L 590 124" marker-end="url(#ext-arrow)" />
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="12" width="160" height="48" rx="3" />
      <text x="360" y="36">Agente</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="45" y="130" width="170" height="44" rx="3" />
      <text x="130" y="152">GitHub</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="275" y="130" width="170" height="44" rx="3" />
      <text x="360" y="152">Base de datos</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="505" y="130" width="170" height="44" rx="3" />
      <text x="590" y="152">API</text>
    </g>
  </svg>
</figure>

Esto cambia mucho lo que puede hacer.

---

### Una analogía

Imaginad dos técnicos.

<div class="compare-pair">
  <div>
    <p class="compare-label">Técnico A</p>
    <p class="compare-body">Conocimientos y documentación, pero no puede tocar ningún ordenador.</p>
  </div>
  <div>
    <p class="compare-label">Técnico B</p>
    <p class="compare-body">Lo mismo, más terminal, acceso al proyecto y herramientas de diagnóstico.</p>
  </div>
</div>

El segundo puede realizar muchas más acciones.

Con un agente ocurre algo parecido.

---

### ¿Qué es MCP?

Aquí aparece:

<p class="term">Model Context Protocol — MCP</p>

No necesitamos estudiar internamente el protocolo.

Lo importante es comprender **el problema que intenta resolver**.

Un agente puede necesitar conectarse con GitHub, una base de datos, documentación, APIs o herramientas empresariales.

Podríamos crear una integración diferente para cada combinación.

MCP intenta proporcionar una forma común de conectar agentes con sistemas externos.

Simplificando:

<figure class="diagram">
  <figcaption>Una interfaz común para muchas conexiones</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 274" role="img" aria-labelledby="mcp-title mcp-desc" preserveAspectRatio="xMidYMid meet">
    <title id="mcp-title">MCP como interfaz común</title>
    <desc id="mcp-desc">El agente se conecta mediante MCP con sistemas externos como GitHub, una base de datos o la documentación, en lugar de tener una integración distinta para cada uno.</desc>
    <defs>
      <marker id="mcp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 60 L 360 86" marker-end="url(#mcp-arrow)" />
      <path d="M 360 136 L 360 172" />
      <path d="M 130 172 L 590 172" />
      <path d="M 130 172 L 130 200" marker-end="url(#mcp-arrow)" />
      <path d="M 360 172 L 360 200" marker-end="url(#mcp-arrow)" />
      <path d="M 590 172 L 590 200" marker-end="url(#mcp-arrow)" />
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="12" width="160" height="48" rx="3" />
      <text x="360" y="36">Agente</text>
    </g>
    <g class="diagram-node">
      <rect x="300" y="92" width="120" height="44" rx="3" />
      <text x="360" y="114">MCP</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="45" y="206" width="170" height="44" rx="3" />
      <text x="130" y="228">GitHub</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="275" y="206" width="170" height="44" rx="3" />
      <text x="360" y="228">Base de datos</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="505" y="206" width="170" height="44" rx="3" />
      <text x="590" y="228">Documentación</text>
    </g>
  </svg>
</figure>

La idea importante es:

> **MCP permite ampliar las capacidades del agente conectándolo con herramientas y fuentes externas mediante una interfaz común.**

---

### Una analogía para MCP

Pensad en USB.

Antes de los estándares, cada dispositivo podía necesitar un conector diferente.

USB proporciona una interfaz común para muchos dispositivos.

MCP intenta resolver un problema conceptualmente parecido en el mundo de los agentes:

<figure class="diagram">
  <figcaption>Un solo conector en lugar de muchos</figcaption>
  <ol class="flow flow--row">
    <li>Agente</li>
    <li>Interfaz común</li>
    <li>Muchas herramientas</li>
  </ol>
</figure>

La analogía no es perfecta, pero ayuda a entender la idea.

---

### MCP no significa «dar acceso a todo»

Aquí aparece un problema importante.

Si conectamos un agente a una base de datos: ¿puede únicamente leer? ¿Puede modificar? ¿Puede eliminar?

Si le damos acceso a GitHub: ¿puede leer Issues? ¿Puede crear commits? ¿Puede borrar repositorios?

Por tanto:

> **dar una herramienta a un agente significa darle capacidad para actuar.**

Siempre debemos pensar en:

* permisos;
* mínimo privilegio;
* información sensible;
* consecuencias de las acciones.

---

### Cuarta actividad — Diseñar un MCP

No vamos a desarrollar un servidor MCP.

Queremos comprender su utilidad.

Para cada situación indicad qué herramientas tendría sentido proporcionar al agente.

##### Caso A — Agente de documentación

Debe responder preguntas sobre el proyecto. ¿Qué necesitaría?

<p class="write-line"></p>

##### Caso B — Agente de soporte

Debe consultar incidencias de GitHub. ¿Qué necesitaría?

<p class="write-line"></p>

##### Caso C — Agente de análisis de datos

Debe responder preguntas sobre una base de datos empresarial. ¿Qué necesitaría?

<p class="write-line"></p>

##### Caso D — Agente programador

Debe resolver un Issue y comprobar los tests. ¿Qué herramientas necesitaría?

<p class="write-line"></p>

Después indicad, para todos ellos:

##### ¿Qué permisos NO le daríais?

<p class="write-line"></p>

---

### Custom agents

También podemos crear agentes especializados.

<figure class="diagram">
  <figcaption>Agentes con responsabilidades distintas</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 200" role="img" aria-labelledby="custom-title custom-desc" preserveAspectRatio="xMidYMid meet">
    <title id="custom-title">Agentes especializados en un proyecto</title>
    <desc id="custom-desc">Un mismo proyecto puede tener un agente que desarrolla, otro que revisa y otro que prueba, cada uno con permisos distintos.</desc>
    <defs>
      <marker id="custom-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 56 L 360 92" />
      <path d="M 130 92 L 590 92" />
      <path d="M 130 92 L 130 120" marker-end="url(#custom-arrow)" />
      <path d="M 360 92 L 360 120" marker-end="url(#custom-arrow)" />
      <path d="M 590 92 L 590 120" marker-end="url(#custom-arrow)" />
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="12" width="160" height="44" rx="3" />
      <text x="360" y="34">Proyecto</text>
    </g>
    <g class="diagram-node">
      <rect x="45" y="126" width="170" height="52" rx="3" />
      <text x="130" y="146">Developer</text>
      <text class="diagram-subtext" x="130" y="164">agent</text>
    </g>
    <g class="diagram-node">
      <rect x="275" y="126" width="170" height="52" rx="3" />
      <text x="360" y="146">Reviewer</text>
      <text class="diagram-subtext" x="360" y="164">agent</text>
    </g>
    <g class="diagram-node">
      <rect x="505" y="126" width="170" height="52" rx="3" />
      <text x="590" y="146">Tester</text>
      <text class="diagram-subtext" x="590" y="164">agent</text>
    </g>
  </svg>
</figure>

Cada agente puede tener instrucciones, herramientas, permisos y responsabilidades diferentes.

Por ejemplo, el **Developer** puede leer código, modificarlo y ejecutar tests. El **Reviewer** puede leer código y revisar cambios, pero no modificar archivos.

Esta separación puede reducir errores.

---

### No necesitamos crear diez agentes

Un error habitual consiste en pensar:

> Más agentes = mejor sistema.

No necesariamente.

Cada elemento añade complejidad, configuración, contexto y posibles errores.

Utilizaremos agentes especializados únicamente cuando resuelvan un problema concreto.

---

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 3</p>
  <ul class="checklist">
    <li>Sabes qué es una tool y qué la diferencia de una respuesta de texto.</li>
    <li>Puedes explicar MCP con tus palabras.</li>
    <li>Has diseñado un MCP acotado, con lo que sí puede hacer y lo que no.</li>
    <li>Sabes cuándo NO hace falta crear un agente propio.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué es MCP, en una frase?</li>
    <li>¿Por qué un MCP no debería tener acceso a todo?</li>
    <li>Un agente propone ejecutar un comando destructivo. ¿Qué hacéis?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Una forma estándar de conectar un agente con herramientas y datos externos, para no inventar una integración distinta cada vez.</p>
  <p>2 · Mínimo privilegio: cada permiso que le dais es un permiso que puede usar mal, o que alguien puede aprovechar a través de él.</p>
  <p>3 · No aceptarlo. Preguntar qué problema cree que resuelve y buscar la alternativa reversible.</p>
</details>

---

## Sesión 4 · Nunca delegues la verificación

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> La regla de oro del desarrollo asistido: nunca aceptar código sin revisar su diff, ejecutar tests y verificar que cumple los criterios.</li>
    <li><strong>2. Haz:</strong> Audita los cambios generados por la IA en tu portfolio, detecta posibles alucinaciones y ejecuta la suite de verificación.</li>
    <li><strong>3. Entrega:</strong> Publica tu portfolio en GitHub con sus instrucciones de proyecto, la skill de revisión y la memoria técnica.</li>
  </ol>
</div>

### El concepto más importante de toda la unidad

La IA puede equivocarse.

Puede:

* inventar una API;
* utilizar una librería inexistente;
* introducir un error;
* eliminar comportamiento necesario;
* escribir código inseguro;
* crear tests que no comprueban realmente lo necesario.

Por tanto:

> **El código generado por IA debe tratarse como código escrito por otra persona que todavía no hemos revisado.**

Nunca como código automáticamente correcto.

---

### El flujo profesional

Evitemos esto:

<figure class="diagram">
  <figcaption>Antes · el atajo que no comprueba nada</figcaption>
  <ol class="flow flow--before">
    <li>Pedir código</li>
    <li>La IA genera</li>
    <li>Parece funcionar</li>
    <li>Fin</li>
  </ol>
</figure>

Nuestro flujo será:

<figure class="diagram">
  <figcaption>Después · el flujo profesional</figcaption>
  <ol class="flow">
    <li>Entender el problema</li>
    <li>Definir la tarea</li>
    <li>Dar contexto</li>
    <li>Pedir un plan</li>
    <li>Revisar el plan</li>
    <li>Implementar</li>
    <li>Revisar el diff</li>
    <li>Ejecutar los tests</li>
    <li>Comprobar el resultado</li>
    <li>Code review</li>
    <li>Commit</li>
  </ol>
</figure>

---

### Antes de modificar: planificar

Para tareas que no sean triviales podemos pedir:

> Antes de cambiar ningún archivo:
>
> 1. analiza el proyecto;
> 2. identifica los archivos implicados;
> 3. propón un plan;
> 4. indica posibles riesgos;
> 5. espera antes de implementar.

Esto permite detectar errores **antes de generar cien líneas incorrectas**.

---

### Después de modificar: revisar el diff

Git nos permite comprobar exactamente qué ha cambiado.

Utilizad:

```bash
git diff
```

Nunca os limitéis a preguntar al agente:

> ¿Está todo bien?

El propio agente que escribió el código puede no detectar sus errores.

Revisad vosotros los cambios.

---

### La IA debe aportar evidencias

En lugar de pedir «implementa esto», es preferible «implementa esto y añade tests que demuestren que funciona».

El flujo se convierte en:

<figure class="diagram">
  <figcaption>Qué debe entregar el agente</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Código</li>
    <li>Tests</li>
    <li>Resultado</li>
  </ol>
</figure>

El agente no solamente nos entrega una solución.

También debe ayudar a proporcionar **evidencias de que la solución funciona**.

---

### Seguridad al trabajar con IA

#### Nunca compartáis secretos innecesariamente

Por ejemplo: `password`, `API_KEY`, `token`, `.env` o cualquier credencial.

#### Revisad comandos

Un agente con acceso a terminal puede ejecutar comandos.

Antes de autorizar una acción peligrosa, comprobad qué hace.

#### Revisad dependencias

Si propone:

```bash
npm install paquete-desconocido
```

preguntaos:

* ¿es necesario?
* ¿existe?
* ¿es mantenido?
* ¿podemos resolverlo sin añadir otra dependencia?

#### Menos permisos es mejor

Si una herramienta únicamente necesita leer, no necesita permisos de escritura.

Este principio se denomina:

<p class="term">Mínimo privilegio</p>

---

### Actividad final — Construid vuestro portfolio con un agente

Vais a crear **vuestro propio portfolio profesional** y a publicarlo en GitHub.

No se os entrega ningún repositorio: el proyecto es vuestro desde la primera
línea. Si hicisteis la web de la UD3, podéis partir de ella.

Ojo con el objetivo, porque es fácil confundirlo. No se trata de conseguir el
portfolio más vistoso, ni de generar el máximo de código con IA. Se trata de
**dirigir al agente y demostrar que entendéis y verificáis lo que produce**.

Un portfolio es un buen proyecto para esto por tres motivos: lo entendéis
perfectamente, sois vosotros quienes decidís qué debe hacer, y os quedáis con
algo que podéis enseñar en una entrevista.

#### Parte A — Definir qué vais a construir

Antes de escribir código, decidid qué debe contener vuestro portfolio. Por
ejemplo: presentación, proyectos, tecnologías, formulario de contacto, versión
en dos idiomas, modo oscuro.

Escribid la tarea con la plantilla de la sección 7:

<figure class="diagram">
  <figcaption>Vuestra tarea</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Objetivo</span><span class="write-line"></span></li>
    <li><span class="flow-role">Contexto</span><span class="write-line"></span></li>
    <li><span class="flow-role">Restricciones</span><span class="write-line"></span></li>
    <li><span class="flow-role">Criterios de aceptación</span><span class="write-line"></span></li>
    <li><span class="flow-role">Forma de verificación</span><span class="write-line"></span></li>
  </ol>
</figure>

Pedid después un plan al agente, **sin dejarle tocar todavía ningún archivo**:

> Antes de crear nada, propón la estructura de archivos, las tecnologías y los
> pasos que seguirías. Indica qué decisiones no tienes claras.

Revisad ese plan antes de continuar. Si algo no os convence, corregidlo ahora:
es mucho más barato que corregirlo con el proyecto a medio hacer.

#### Parte B — Crear el repositorio

Cread un repositorio nuevo en vuestra cuenta de GitHub y haced el primer commit
con la estructura mínima acordada en el plan.

A partir de aquí, cada avance importante debería ser un commit. Así podréis
enseñar en la memoria qué hizo el agente y qué decidisteis vosotros.

#### Parte C — Escribir las instrucciones del proyecto

Cread <code>.github/copilot-instructions.md</code>.

Debe incluir como mínimo stack, estructura, convenciones, accesibilidad,
seguridad y qué debe comprobar el agente antes de dar una tarea por terminada.

No copiéis el ejemplo de la sección 11 literalmente: aquel es de un proyecto
Node con Express y PostgreSQL, y el vuestro probablemente no lo sea. Las
instrucciones tienen que describir **vuestro** proyecto.

#### Parte D — Implementación asistida

Construid el portfolio con ayuda del agente. En cada tarea:

1. revisad su plan antes de aceptarlo;
2. revisad los archivos que ha modificado;
3. abrid la página en el navegador;
4. comprobad que se ve bien también en móvil.

#### Parte E — Crear una skill

Cread <code>.github/skills/code-review/SKILL.md</code>.

La skill debe definir vuestro procedimiento de revisión. Para un portfolio web,
como mínimo debería comprobar HTML semántico, accesibilidad, enlaces rotos,
duplicación, imágenes sin texto alternativo y seguridad básica.

#### Parte F — Revisar el trabajo de la IA

Utilizad la skill para revisar vuestro propio repositorio.

Clasificad cada posible problema como <span class="tag tag--low">Bajo</span> <span class="tag tag--mid">Medio</span> <span class="tag tag--high">Alto</span>.

No es obligatorio aceptar todas las recomendaciones del agente.

Para cada recomendación importante decidid si la aceptáis o la rechazáis, y explicad por qué.

#### Parte G — Que el agente os explique vuestro propio proyecto

Esta parte es la más interesante, y solo funciona ahora: cuando ya conocéis el
proyecto mejor que nadie.

Abrid una conversación nueva y pedid:

> Analiza este repositorio. Explícame qué hace, su estructura, sus tecnologías
> y cómo se ejecuta. Indica también qué aspectos no puedes determinar con
> seguridad.

Contrastad la respuesta con lo que realmente hicisteis y anotad:

##### Una cosa que haya explicado correctamente.

<p class="write-line"></p>

##### Una cosa que haya interpretado incorrectamente o con demasiada seguridad.

<p class="write-line"></p>

Aquí es donde se ve por qué importan las instrucciones del proyecto: sobre un
repositorio que no conoce, un agente deduce, y a veces deduce mal.

#### Parte H — MCP

No desarrollaremos todavía un servidor MCP.

Dibujad qué conexión MCP podría resultar útil para este proyecto. Por ejemplo:

<figure class="diagram">
  <figcaption>Ejemplo de conexión</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 348" role="img" aria-labelledby="pg-title pg-desc" preserveAspectRatio="xMidYMid meet">
    <title id="pg-title">Ejemplo de conexión MCP con GitHub</title>
    <desc id="pg-desc">Copilot se conecta mediante MCP con GitHub, y a través de él puede acceder a las incidencias y a las pull requests.</desc>
    <defs>
      <marker id="pg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 56 L 360 86" marker-end="url(#pg-arrow)" />
      <path d="M 360 136 L 360 166" marker-end="url(#pg-arrow)" />
      <path d="M 360 216 L 360 248" />
      <path d="M 225 248 L 495 248" />
      <path d="M 225 248 L 225 276" marker-end="url(#pg-arrow)" />
      <path d="M 495 248 L 495 276" marker-end="url(#pg-arrow)" />
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="12" width="160" height="44" rx="3" />
      <text x="360" y="34">Copilot</text>
    </g>
    <g class="diagram-node">
      <rect x="300" y="92" width="120" height="44" rx="3" />
      <text x="360" y="114">MCP</text>
    </g>
    <g class="diagram-node">
      <rect x="280" y="172" width="160" height="44" rx="3" />
      <text x="360" y="194">GitHub</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="140" y="282" width="170" height="44" rx="3" />
      <text x="225" y="304">Issues</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="410" y="282" width="170" height="44" rx="3" />
      <text x="495" y="304">Pull requests</text>
    </g>
  </svg>
</figure>

Indicad:

##### Qué información podría consultar.

<p class="write-line"></p>

##### Qué acciones podría realizar.

<p class="write-line"></p>

##### Qué permisos le concederíais.

<p class="write-line"></p>

##### Qué permisos NO le concederíais.

<p class="write-line"></p>

#### Parte I — Git y publicación

Antes de terminar:

```bash
git diff
```

Revisad todos los cambios. Después:

```bash
git status
```

y cread vuestro commit. Finalmente:

```bash
git push
```

Vuestro portfolio debe quedar visible en GitHub. Si queréis publicarlo también
como página web, podéis activar GitHub Pages en el repositorio o desplegarlo en
el servidor que montasteis en la UD3.

---

### Producto final

Entregaréis el repositorio de vuestro portfolio y una memoria breve.

La memoria debe tener aproximadamente **2–3 páginas**, no una documentación enorme.

Debe incluir:

#### 1. Tarea

Qué querías construir y cómo lo definiste.

#### 2. Instrucciones

Qué información habéis proporcionado al agente y por qué.

#### 3. Skill

Qué procedimiento habéis creado.

#### 4. Evidencia

Captura o fragmento donde se observe al agente proponiendo un plan, modificando código y revisando cambios, y cómo comprobasteis vosotros el resultado.

#### 5. Error o limitación de la IA

Debéis identificar al menos **una cosa que Copilot no haya hecho perfectamente**. Puede ser una mala decisión, código innecesario, una interpretación incorrecta, una recomendación que habéis rechazado o un error detectado mediante tests.

#### 6. Verificación

Explicad cómo habéis comprobado que el resultado funciona.

#### 7. MCP

Incluid vuestro pequeño diseño conceptual.

---

### Evaluación

<table>
  <thead>
    <tr>
      <th>Criterio</th>
      <th class="align-right">Puntos</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Definición clara de la tarea y criterios de aceptación</td>
      <td class="align-right">1,5</td>
    </tr>
    <tr>
      <td>Calidad de <code>copilot-instructions.md</code></td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Uso razonado del agente durante el desarrollo</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Skill de revisión</td>
      <td class="align-right">1,5</td>
    </tr>
    <tr>
      <td>Verificación del resultado: diff, comprobación en el navegador y tests si procede</td>
      <td class="align-right"><strong>2</strong></td>
    </tr>
    <tr>
      <td>Comprensión conceptual de MCP y permisos</td>
      <td class="align-right">1</td>
    </tr>
  </tbody>
</table>

#### Lo que NO se evalúa

No obtiene mejor nota quien genera más código con IA, utiliza más prompts, crea más agentes o utiliza más herramientas.

#### Lo que SÍ se evalúa

Obtiene mejor nota quien demuestra que sabe dirigir el trabajo de un agente:

<figure class="diagram">
  <figcaption>Lo que de verdad se evalúa</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Definir</li>
    <li>Contextualizar</li>
    <li>Dirigir</li>
    <li>Revisar</li>
    <li>Verificar</li>
  </ol>
</figure>

---

<details class="aside aside--help">
  <summary>Estoy atascado · el agente ha tocado cosas que yo no pedí</summary>
  <ol>
    <li>No aceptéis el cambio entero. Mirad el diff fichero por fichero.</li>
    <li>Revertid lo que no forme parte de la tarea, aunque parezca una mejora.</li>
    <li>Si ha añadido una dependencia, preguntadle qué problema creía resolver con ella.</li>
    <li>Volved a pedirlo acotando el alcance: qué ficheros puede tocar y cuáles no.</li>
    <li>Si ha reformateado medio proyecto, el problema no es el agente: faltaba esa restricción en las instrucciones del repositorio.</li>
  </ol>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · entrega</p>
  <ul class="checklist">
    <li>Portfolio publicado y accesible.</li>
    <li>Instrucciones de proyecto en el repositorio.</li>
    <li>Al menos una skill propia.</li>
    <li>Evidencias del flujo: plan, diff revisado y comprobaciones.</li>
    <li>Un cambio del agente que rechazasteis, y por qué.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Cuál es el único paso del flujo que no se delega nunca?</li>
    <li>¿Qué miráis en un diff antes de aceptar?</li>
    <li>El agente dice que ha terminado y todo funciona. ¿Os lo creéis?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · La verificación. El plan y el código se pueden delegar; la decisión de que eso entra en el proyecto, no.</p>
  <p>2 · Que no haya cambios que no pedisteis, dependencias nuevas, ficheros tocados de más ni funcionalidad rota.</p>
  <p>3 · No hasta comprobarlo. «Funciona» dicho por el agente es una afirmación, no una evidencia.</p>
</details>

---

## Lo que debes recordar

### El mapa que debéis recordar

Cuando trabajamos con IA para desarrollar software tenemos diferentes piezas:

<figure class="diagram">
  <figcaption>Todas las piezas y cómo encajan</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 680" role="img" aria-labelledby="ia-title ia-desc" preserveAspectRatio="xMidYMid meet">
    <title id="ia-title">Mapa del desarrollo asistido por IA</title>
    <desc id="ia-desc">El proyecto aporta instrucciones al agente, que recibe además una tarea y su contexto. El agente se apoya en skills, herramientas y MCP para producir código, que pasa por tests, revisión y finalmente Git.</desc>
    <defs>
      <marker id="ia-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 54 L 360 82" marker-end="url(#ia-arrow)" />
      <path d="M 360 130 L 360 152" marker-end="url(#ia-arrow)" />
      <path d="M 130 185 L 144 185" marker-end="url(#ia-arrow)" />
      <path d="M 260 185 L 274 185" marker-end="url(#ia-arrow)" />
      <path d="M 360 212 L 360 240" />
      <path d="M 130 240 L 590 240" />
      <path d="M 130 240 L 130 262" marker-end="url(#ia-arrow)" />
      <path d="M 360 240 L 360 262" marker-end="url(#ia-arrow)" />
      <path d="M 590 240 L 590 262" marker-end="url(#ia-arrow)" />
      <path d="M 130 310 L 130 352" />
      <path d="M 360 310 L 360 352" />
      <path d="M 590 310 L 590 352" />
      <path d="M 130 352 L 590 352" />
      <path d="M 360 352 L 360 382" marker-end="url(#ia-arrow)" />
      <path d="M 360 430 L 360 458" marker-end="url(#ia-arrow)" />
      <path d="M 360 506 L 360 534" marker-end="url(#ia-arrow)" />
      <path d="M 360 582 L 360 610" marker-end="url(#ia-arrow)" />
    </g>
    <g class="diagram-node">
      <rect x="280" y="12" width="160" height="42" rx="3" />
      <text x="360" y="33">Proyecto</text>
    </g>
    <g class="diagram-node">
      <rect x="250" y="88" width="220" height="42" rx="3" />
      <text x="360" y="109">Instrucciones</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="20" y="164" width="110" height="42" rx="3" />
      <text x="75" y="185">Tarea</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="150" y="164" width="110" height="42" rx="3" />
      <text x="205" y="185">Contexto</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="158" width="160" height="54" rx="3" />
      <text x="360" y="185">Agente</text>
    </g>
    <g class="diagram-node">
      <rect x="45" y="268" width="170" height="42" rx="3" />
      <text x="130" y="289">Skills</text>
    </g>
    <g class="diagram-node">
      <rect x="275" y="268" width="170" height="42" rx="3" />
      <text x="360" y="289">Tools</text>
    </g>
    <g class="diagram-node">
      <rect x="505" y="268" width="170" height="42" rx="3" />
      <text x="590" y="289">MCP</text>
    </g>
    <g class="diagram-node">
      <rect x="280" y="388" width="160" height="42" rx="3" />
      <text x="360" y="409">Código</text>
    </g>
    <g class="diagram-node">
      <rect x="280" y="464" width="160" height="42" rx="3" />
      <text x="360" y="485">Tests</text>
    </g>
    <g class="diagram-node">
      <rect x="260" y="540" width="200" height="42" rx="3" />
      <text x="360" y="561">Code review</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="300" y="616" width="120" height="42" rx="3" />
      <text x="360" y="637">Git</text>
    </g>
  </svg>
</figure>

Podemos resumir cada concepto así:

| Concepto | Pregunta |
| --- | --- |
| **Prompt / tarea** | ¿Qué quiero hacer ahora? |
| **Contexto** | ¿Qué necesita saber para hacerlo? |
| **Instructions** | ¿Cómo se trabaja siempre en este proyecto? |
| **Skill** | ¿Cómo se realiza bien este tipo de tarea? |
| **Agent** | ¿Quién realiza la tarea y con qué autonomía? |
| **Tool** | ¿Qué puede hacer fuera del modelo? |
| **MCP** | ¿Cómo lo conectamos con sistemas externos? |
| **Tests** | ¿Cómo demostramos que funciona? |
| **Git** | ¿Cómo sabemos exactamente qué ha cambiado? |

---

### La idea más importante

La IA puede aumentar muchísimo la productividad de un desarrollador.

Pero utilizarla profesionalmente no significa:

> **«hacer menos caso al código».**

Significa exactamente lo contrario:

> **poder producir más, manteniendo la capacidad de entender, revisar y verificar lo producido.**

El objetivo de esta unidad no es que la IA programe por vosotros.

El objetivo es que aprendáis a **dirigir una herramienta que puede programar con vosotros**.

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Prompt | Qué quiero ahora |
| Contexto | Qué necesita saber para hacerlo |
| Instructions | Cómo trabajamos siempre en este proyecto |
| Skill | Cómo hacemos una tarea especializada concreta |
| Modelo | Lo que genera el texto |
| Agente | El modelo que además puede actuar |
| Tool | Una acción que el agente puede ejecutar |
| MCP | La forma estándar de conectarlo con herramientas y datos |
| Criterio de aceptación | Cómo sabremos que ha terminado bien |
| Diff | Qué ha cambiado exactamente |
| Verificación | Lo único que no se delega nunca |

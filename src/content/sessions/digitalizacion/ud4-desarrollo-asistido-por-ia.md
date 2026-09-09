---
title: "Desarrollo de software asistido por Inteligencia Artificial"
label: "UD4 · Proyecto"
section: "ud-04"
order: 4
lang: "es"
summary: "Aprende a dirigir un agente mediante una mejora del sitio ya trabajado en UD3: contexto, instrucciones, procedimientos de revisión, herramientas y verificación."
duration: "4 horas · 4 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Mejora del sitio asistida por IA. Una actividad acumulativa por unidad, con evidencias y aportación individual."
date: "2026-09-09"
outcomes:
  - "Escribir una petición con objetivo, contexto, restricciones y criterios de aceptación."
  - "Configurar las instrucciones del repositorio para que el agente conozca vuestro proyecto."
  - "Crear una skill reutilizable para una tarea que repetís."
  - "Explicar qué son las tools y MCP, y por qué no se da acceso a todo."
  - "Revisar plan, diff y tests antes de aceptar un cambio."
requirements:
  - "Guía de arranque y materiales de esta unidad, enlazados en la página."
  - "Carpeta o documento de actividad compartido con el docente."
priorKnowledge:
  - "Las unidades anteriores de este módulo. No se requiere Servidor, Intermodular ni el otro módulo transversal."
---

<p class="lead">Mejora del sitio asistida por IA. Cada sesión introduce los conceptos que necesita y continúa una misma actividad de la unidad. Conserva sus resultados para revisarlos y utilizarlos después.</p>

## Cómo trabajar esta unidad

Son 4 sesiones de una hora: 10 minutos de explicación, 45 de trabajo guiado y 5 de cierre. Si el periodo del centro es de 55 minutos, se ajusta el trabajo a 40 minutos. Los ejemplos ampliados son material de consulta durante la práctica; no añaden otra clase teórica ni tareas obligatorias.

Abre la [guía de arranque y evaluación](/es/docencia/talleres-transversales/). Incluye archivos, herramientas y alternativas de acceso. Para los casos utiliza la [ficha común](/teaching/transversales/casos.pdf). No se necesita el CRUD de Servidor ni el workflow de Intermodular. Quien ya conozca una herramienta utiliza ese conocimiento para justificar y comprobar la actividad nueva, sin repetir una entrega ya evaluada.

## Actividad y criterios de evaluación

**Mejora del sitio asistida por IA.** Guarda el trabajo en `digitalizacion/ud4/`, y redacta la actividad en Word, LibreOffice o un documento en línea; exporta la entrega a PDF. Cada sesión añade su avance, comprobación y pendiente; no se entrega un informe diferente por sesión. Cuando haya código, enlaza el repositorio y la versión o adjunta la carpeta identificada según el canal del aula. Nunca incluyas credenciales.

Esta actividad se valora sobre 10 puntos y aporta **4/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Cada integrante registra y explica su aportación. La rúbrica se conoce desde el inicio:

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
      <td>Calidad y aplicación de las instrucciones del proyecto en el agente utilizado</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Uso razonado del agente durante el desarrollo</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Procedimiento reutilizable de revisión, como skill o ficha aplicada</td>
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

En cada criterio, una evidencia ausente no permite acreditar el logro; una evidencia incompleta requiere revisión; una evidencia correcta permite comprobar el resultado; el logro completo añade una justificación coherente y reconoce sus límites. Los puntos se asignan según el grado de logro del criterio, no por cantidad de archivos, commits o texto. Consulta la guía para revisar y volver a presentar los criterios pendientes.

## Sesión 1 · Dirige bien a la IA

**Punto de partida.** Actividad «Mejora del sitio asistida por IA», sesión 1 de 4. Abre los materiales enlazados y crea el registro de la unidad. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un **modelo** genera una respuesta; un **agente** puede utilizar herramientas para leer archivos, proponer cambios o ejecutar comprobaciones. Que pueda actuar no significa que conozca tu objetivo. Necesita contexto y un criterio de aceptación: una condición observable que permita decir si la tarea está resuelta.

«Mejora la web» deja abiertas muchas decisiones. «Añade un enlace de contacto visible, conserva las secciones y comprueba que abre el correo indicado» delimita la tarea. Usaremos el sitio de Digitalización UD3; quien ya tenga portfolio estudiará un cambio nuevo, sin reconstruirlo ni repetir su evaluación de Intermodular.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### Modelo y agente no son lo mismo

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

#### Context engineering

Una de las habilidades más importantes al trabajar con IA es proporcionar el **contexto adecuado**.

Comparad:

##### Petición A

> Haz el login.

##### Petición B

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

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre el sitio inicial y guarda su estado antes de editar. Utiliza el agente disponible en el aula con la guía de arranque; comprueba que puede leer esta carpeta y no otra.
2. Escribe una petición vaga para añadir contacto y pide solo un plan. Guarda qué información supone el agente y qué decisiones deja abiertas; todavía no aceptes cambios.
3. Redacta otra petición con objetivo, archivos permitidos, restricciones y dos criterios de aceptación. Por ejemplo: enlace visible y destino correcto, manteniendo el contenido anterior.
4. Compara ambos planes. Señala una diferencia atribuible al contexto y escoge la propuesta que puedas verificar. Si propone una dependencia, pide qué necesidad concreta cubre.
5. Aplica el cambio elegido, abre la página y prueba el enlace. Guarda petición, decisión, archivos cambiados y resultado en la actividad de UD4.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Se puede comprobar qué pediste, por qué elegiste la propuesta y si cumple los criterios. No se puntúa el número de prompts ni de líneas generadas.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD4 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 1»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 2 · Haz que conozca tu proyecto

**Punto de partida.** Actividad «Mejora del sitio asistida por IA», sesión 2 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Las instrucciones del repositorio describen reglas que siguen siendo válidas entre tareas: estructura, estilo y forma de comprobar el sitio. El prompt describe el cambio de hoy. Una **skill** reúne un procedimiento reutilizable para un tipo de trabajo; no sustituye los criterios específicos de la tarea.

Una regla como «trabaja bien» no guía una decisión. «No añadas dependencias para un cambio de texto; verifica los enlaces modificados» sí puede contrastarse. No hace falta escribir muchos archivos: crearemos instrucciones breves y una lista de revisión que utilizaremos realmente.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### Ejemplo de instrucciones

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

#### Prompt vs instrucciones

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

#### ¿Qué es una skill?

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

#### Instructions vs Skills

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

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Revisa el cambio de la sesión anterior y anota dos decisiones que no quieras explicar de nuevo. Distingue una regla permanente de una instrucción exclusiva de aquel cambio.
2. Crea `.github/copilot-instructions.md` si utilizas Copilot, o el archivo de instrucciones que reconozca el agente del aula. Escribe objetivo del sitio, archivos relevantes, límites y comprobación manual.
3. Pide al agente que explique qué instrucciones ha encontrado. Verifica el contenido indicado; no des por leído un archivo solo porque exista.
4. Crea una ficha de revisión con cuatro pasos: abrir cambio, comparar con objetivo, probar comportamiento y registrar resultado. Si el entorno admite skills, usa la plantilla enlazada en la guía; si no, aplica el mismo procedimiento desde el prompt.
5. Prueba las instrucciones con una modificación pequeña de texto y comprueba si respeta los límites. Corrige una regla ambigua y conserva el ejemplo que motivó su revisión.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Las instrucciones y la ficha se han usado en una tarea real. Explica qué información pertenece al prompt y cuál debe permanecer en el repositorio.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD4 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 2»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 3 · Dale herramientas

**Punto de partida.** Actividad «Mejora del sitio asistida por IA», sesión 3 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una herramienta permite que un agente realice una acción concreta, como leer documentación o consultar un repositorio. **MCP** es un protocolo para conectar herramientas y fuentes con aplicaciones de IA. No es un permiso universal ni significa que debamos programar una integración para cada actividad.

Antes de conceder acceso debemos conocer qué datos necesita la tarea y qué acciones requiere. Consultar una incidencia puede necesitar lectura; resolver una duda no necesita borrar archivos ni escribir en producción. Hoy diseñaremos y comprobaremos esos límites mediante un caso, sin conectar cuentas de otras personas.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### ¿Qué es MCP?

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

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Define la tarea «preparar una propuesta para corregir un enlace del sitio». Enumera las fuentes necesarias: archivo del enlace, destino esperado y criterio de comprobación.
2. Dibuja usuario → agente → herramienta → recurso. Escribe qué dato entra y qué resultado sale de cada llamada. Separa lectura de escritura.
3. Completa una tabla con herramienta, permiso mínimo, dato accesible y acción excluida. Resuelve primero lectura del repositorio; después compara con una herramienta capaz de modificarlo.
4. Pide al agente un plan sin ejecutar cambios. Revisa si solicita capacidades innecesarias. Si el entorno permite consultar herramientas, inspecciona su descripción y contrástala con tu tabla.
5. Simula una instrucción hallada dentro de un documento que pide ampliar el acceso. Explica por qué ese texto es contenido que se analiza y no una autorización del usuario. Guarda la decisión junto al esquema.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Se evalúa comprender herramientas y permisos. El diagrama y el caso razonado bastan para MCP; no se exige desplegar un servidor MCP ni crear varios agentes.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD4 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 3»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 4 · Nunca delegues la verificación

**Punto de partida.** Actividad «Mejora del sitio asistida por IA», sesión 4 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un **diff** compara dos versiones y muestra líneas añadidas y eliminadas. Permite revisar qué cambió, pero no demuestra que funcione. Necesitamos dos comprobaciones: que el cambio corresponde a la tarea y que el comportamiento esperado se observa al ejecutarlo.

La revisión empieza por el criterio de aceptación. Si pedimos mejorar el contacto, una reescritura de todo el sitio necesita justificación y dificulta comprobar el resultado. Podemos rechazar una propuesta de la IA: lo que se evalúa es la decisión y su evidencia, no aceptar todo lo generado.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Elige una mejora pendiente del sitio de UD3 y escribe dos criterios observables. Recupera las instrucciones y la ficha de revisión de esta unidad.
2. Pide un plan acotado y revisa los archivos que pretende tocar. Aplica el cambio por partes; conserva el punto inicial para poder comparar o volver atrás.
3. Abre la comparación de cambios en el editor. Para cada archivo explica por qué se modificó. Retira o justifica cualquier cambio fuera del alcance antes de darlo por terminado.
4. Abre la web, prueba los criterios y revisa un comportamiento anterior que deba mantenerse. Anota paso, resultado esperado y resultado observado; no basta con copiar «tests correctos» de la conversación.
5. Entrega el sitio actualizado y el registro con tarea, instrucciones, procedimiento de revisión, decisión sobre permisos y pruebas. Cada integrante explica un cambio aceptado o rechazado.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La actividad de IA termina sobre el mismo sitio y con una mejora verificable. Enlaza las evidencias existentes en lugar de volver a entregar un portfolio desde cero.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD4 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 4»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. La actividad de la unidad queda lista para valorar con su rúbrica; las correcciones se documentan en el mismo registro.

## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

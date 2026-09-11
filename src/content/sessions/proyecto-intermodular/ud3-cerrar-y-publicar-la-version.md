---
title: "Cerrar y publicar la versión"
label: "UD3 · Publicar"
section: "ud-03"
order: 3
lang: "es"
summary: "Escribir el README que hace comprensible el repositorio para quien llega de fuera, publicar la primera versión con nombre, y auditar el rastro de trabajo del compañero contra la definición de terminado."
duration: "3 horas · 1 sesión"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Versión del portfolio identificada, revisada y documentada."
date: "2026-09-09"
outcomes:
  - "Escribir un README dirigido a quien no conoce el proyecto ni a su autor."
  - "Etiquetar una versión y publicarla como release con sus notas."
  - "Explicar el significado de las tres cifras del versionado semántico."
  - "Auditar un repositorio ajeno contra la definición de terminado y comunicar los hallazgos mediante issues."
  - "Identificar en el rastro de desarrollo propio los elementos que se evalúan en la defensa."
requirements:
  - "El portfolio de la UD2 publicado, con las cuatro comprobaciones en estado correcto."
priorKnowledge:
  - "El flujo de integración completo y el pipeline propio de las unidades anteriores."
---

<p class="lead">El primer proyecto se cierra en esta unidad. Cerrar un proyecto no consiste en interrumpir su desarrollo, sino en dejarlo en un estado comprensible para una persona ajena a él e identificar ese estado con una referencia estable a la que sea posible regresar.</p>

<div class="rule">
  <p class="rule-label">El trabajo pendiente no es de programación</p>
  <p>El portfolio funciona, está publicado y dispone de cuatro comprobaciones automáticas que condicionan la integración. Restan dos elementos, ninguno de los cuales se implementa en código: un punto de entrada documental para quien accede al repositorio sin contexto previo, y una referencia fija en el historial que permita identificar el estado actual como versión 1.</p>
</div>

## Sesión 6 · Cierre y publicación de la primera versión

**Antes de empezar.** El portfolio supera ya las comprobaciones del pipeline. En esta sesión se cierra una versión identificada y se verifica si una persona ajena al proyecto es capaz de comprenderlo y utilizarlo.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Evaluación inicial · sin apuntes</p>
  <ol>
    <li>Una persona accede a tu repositorio sin conocer el proyecto. ¿Cuánto tiempo necesita para determinar qué es y verlo en funcionamiento?</li>
    <li>El portfolio actual y el de dentro de dos meses serán distintos. ¿Mediante qué mecanismo se identifica de forma inequívoca el estado de hoy?</li>
    <li>Si hubiera que acreditar dieciocho horas de trabajo distribuidas en seis semanas, ¿qué evidencias lo demostrarían?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación conceptual y demostración técnica</p>

#### El README como punto de entrada del repositorio

A un repositorio público acceden dos perfiles de visitante: quien evalúa el uso del proyecto y quien evalúa profesionalmente a su autor. Ambos consultan el mismo documento, le dedican menos de un minuto y abandonan si en ese intervalo no identifican qué están consultando.

<div class="compare-pair">
  <div>
    <p class="compare-label">README de ejercicio académico</p>
    <p class="compare-body">«Proyecto de la primera evaluación del módulo de Proyecto Intermodular. Alumno: … Curso: 2.º DAW.» Está redactado para el docente, que ya dispone de esa información. Para cualquier otro lector carece de contenido informativo.</p>
  </div>
  <div>
    <p class="compare-label">README de producto profesional</p>
    <p class="compare-body">Qué es el proyecto, enlace a la versión en funcionamiento, con qué tecnologías está construido y cómo se publica. Está redactado para quien no conoce ni el proyecto ni a su autor y decide en menos de un minuto si continúa la lectura.</p>
  </div>
</div>

La estructura acordada consta de seis apartados. Un documento extenso no cumple su función, porque no se lee.

| Apartado | Contenido | Defecto habitual |
| -------- | --------- | ---------------- |
| **Título y descripción** | Qué es el proyecto, en una línea y sin adjetivación | Consignar el nombre del módulo en lugar del proyecto |
| **Enlace a la versión publicada** | La URL pública, en posición destacada | Situarlo al final del documento u omitirlo |
| **Captura** | Una imagen de la interfaz real | Omitirla, lo que obliga a abrir el enlace para valorar el proyecto |
| **Arquitectura y tecnologías** | Relación breve y verificable de lo empleado | Ampliar la relación con tecnologías de uso marginal |
| **Procedimiento de despliegue** | Qué lo desencadena, qué proceso lo ejecuta y cuál es el destino | Redactarlo presuponiendo conocimiento previo del repositorio |
| **Validaciones del pipeline** | Las cuatro comprobaciones, con una frase cada una | Omitirlo, con la consiguiente pérdida del elemento más diferenciador |

<div class="rule">
  <p class="rule-label">El apartado con mayor valor diferencial</p>
  <p>El último. Un sitio web personal es un producto habitual en cualquier promoción; un repositorio en el que cada cambio ha superado una pull request que impedía la fusión ante marcado inválido, enlaces no resolubles o una puntuación de accesibilidad inferior a 90 constituye una evidencia metodológica infrecuente. Esa información no es deducible desde el exterior del repositorio: debe documentarse de forma explícita.</p>
</div>

#### La versión como referencia inmutable

<p class="term">Etiqueta (<em>tag</em>)</p>

Referencia asignada a un commit determinado. A diferencia de una rama, que avanza conforme se incorporan nuevos commits, una etiqueta es inmutable: `v1.0.0` identifica hoy y de forma indefinida el mismo estado del proyecto.

<p class="term">Release</p>

Publicación de una etiqueta acompañada de un título y unas notas que describen su contenido. La etiqueta es una referencia del sistema de control de versiones; la release es el documento dirigido a las personas.

Sin un esquema de versionado, la única forma de referirse a un estado del proyecto consiste en una referencia temporal imprecisa o en el identificador hexadecimal de un commit. El versionado permite afirmar que una demostración concreta correspondió a la versión 1.0 y recuperar ese estado de forma exacta.

#### Versionado semántico

El esquema empleado es el **versionado semántico** (*Semantic Versioning 2.0.0*), convención adoptada de forma generalizada en la distribución de software.

<dl class="worked">
  <dt>Estructura</dt>
  <dd><code>MAYOR.MENOR.PARCHE</code>, por ejemplo <code>1.4.2</code>. Cada posición responde a un criterio distinto y su incremento transmite información al consumidor del software.</dd>
  <dt>Incremento del parche</dt>
  <dd>Corrección de un defecto sin incorporación de funcionalidad: un enlace no resoluble, un contraste insuficiente, una errata. De <code>1.0.0</code> a <code>1.0.1</code>.</dd>
  <dt>Incremento de la versión menor</dt>
  <dd>Incorporación de funcionalidad nueva que mantiene la compatibilidad con la anterior. Una sección adicional del portfolio: de <code>1.0.1</code> a <code>1.1.0</code>.</dd>
  <dt>Incremento de la versión mayor</dt>
  <dd>Modificación incompatible con la versión precedente (<em>breaking change</em>). Es una situación infrecuente en un sitio estático, pero habitual en el diseño de la API de la segunda evaluación.</dd>
  <dt>Reinicio de las posiciones inferiores</dt>
  <dd>Al incrementar una posición, las situadas a su derecha se restablecen a cero: de <code>1.4.2</code>, al añadir una sección, se pasa a <code>1.5.0</code> y no a <code>1.5.2</code>.</dd>
</dl>

La versión que se publica en esta sesión es la `1.0.0`, y no porque el desarrollo haya concluido, sino porque el producto **satisface íntegramente el alcance comprometido**. Un proyecto que nunca alcanza la versión 1.0 refleja la ausencia de una decisión sobre su alcance.

#### Criterios de auditoría del rastro de desarrollo

Los criterios de evaluación de diciembre son públicos, dado que corresponden a la aplicación de la definición de terminado de la UD1 sobre seis semanas de trabajo.

<figure class="diagram">
  <figcaption>Evidencias evaluables en el historial del repositorio</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Distribución temporal</span>Commits y pull requests repartidos entre las semanas del periodo, sin concentración en fechas próximas a la entrega.</li>
    <li><span class="flow-role">Trazabilidad</span>Cada pull request referencia la issue que resuelve, y cada issue se cierra desde la pull request correspondiente.</li>
    <li><span class="flow-role">Controles</span>Ninguna fusión con comprobaciones en estado fallido y ningún commit directo sobre la rama principal.</li>
    <li><span class="flow-role">Revisión</span>Revisiones propias registradas en el repositorio de la pareja asignada, con indicación de qué se verificó.</li>
    <li><span class="flow-role">Cierre</span>Una versión publicada con notas comprensibles sin acceso al código fuente.</li>
  </ol>
</figure>

La sesión incluye la auditoría de ese rastro en un repositorio ajeno, procedimiento que constituye la forma más eficaz de aprender a evaluar el propio.

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo práctico guiado sobre el proyecto base</p>

#### Bloque A · Redacción del README

<p class="stage stage--solo">Trabajo individual: issue, rama y pull request</p>

**1 · Issue.** «Escribir el README del portfolio», con el siguiente criterio de aceptación: *una persona que desconoce el proyecto comprende qué es, accede a la versión en funcionamiento y deduce cómo se publica, sin formular ninguna consulta*.

**2 · Captura.** Antes de redactar, genera una captura del portfolio en su estado actual y almacénala en el repositorio, por ejemplo en `docs/portada.png`. Controla su peso: el job de calidad de la UD2 penaliza los recursos de tamaño desproporcionado.

**3 · Redacción de los seis apartados.** Sin contenido de relleno y sin fórmulas de disculpa. Expresiones como «es un proyecto sencillo hecho para clase» degradan la percepción del trabajo y esa valoración corresponde a quien lee.

<details class="aside aside--help">
  <summary>Redacción del apartado de despliegue para un lector externo</summary>
  <p>Formulación insuficiente: «Se ejecuta el workflow de despliegue», que no aporta información a quien desconoce el repositorio. Formulación adecuada: «Cada cambio incorporado a <code>main</code> se publica de forma automática en GitHub Pages mediante GitHub Actions. Con anterioridad a su incorporación, cada pull request debe superar cuatro comprobaciones automáticas y la revisión de otra persona». Dos frases permiten comprender el procedimiento completo sin consultar ningún archivo.</p>
</details>

**4 · Insignias de estado.** Una línea situada bajo el título que refleja en tiempo real el resultado del pipeline:

```markdown
![CI](https://github.com/TU-USUARIO/portfolio/actions/workflows/ci.yml/badge.svg)
```

No constituye un elemento decorativo: es el primer indicador que consulta un lector con criterio técnico.

**5 · Pull request, revisión y fusión.** Conforme al procedimiento establecido. La revisión de la pareja asignada resulta aquí especialmente pertinente, dado que corresponde exactamente al perfil de lector para el que se redacta el documento: solicítale que identifique qué apartados **no** ha comprendido.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación del bloque A</p>
  <ul class="checklist">
    <li>Los seis apartados, en el orden establecido y sin apartados adicionales.</li>
    <li>La URL pública visible sin necesidad de desplazamiento vertical.</li>
    <li>La captura se renderiza correctamente en el repositorio y su ruta resuelve.</li>
    <li>La pareja de revisión ha identificado los apartados no comprendidos y se han corregido.</li>
  </ul>
</div>

#### Bloque B · Publicación de la versión 1.0.0

<p class="stage stage--solo">Trabajo individual, desde <code>main</code> actualizada</p>

**1 · Creación de la etiqueta.** Se asigna sobre `main`, con el README ya fusionado:

```bash
git switch main
git pull
git tag -a v1.0.0 -m "Primera version publica del portfolio"
git push origin v1.0.0
```

La opción `-a` genera una etiqueta anotada, que constituye un objeto propio del repositorio con autoría, fecha y mensaje, frente a la etiqueta ligera, que es únicamente un puntero. El envío de la etiqueta requiere una instrucción específica: `git push` sin argumentos no transfiere las etiquetas al repositorio remoto.

**2 · Creación de la release.** En GitHub: pestaña **Releases** → **Draft a new release** → en **Choose a tag**, selecciona `v1.0.0` → título `v1.0.0 · Portfolio publicado`.

**3 · Redacción de las notas.** La opción **Generate release notes** produce un borrador a partir de las pull requests fusionadas. Ese borrador constituye material de partida, no el documento final: sobre él se redactan tres o cuatro líneas que respondan al criterio que interesa a quien consulta una release, esto es, **qué permite hacer esta versión que la anterior no permitía**.

<div class="compare-pair">
  <div>
    <p class="compare-label">Notas generadas automáticamente</p>
    <p class="compare-body">«Merge pull request #12 from usuario/12-seccion-proyectos». La información es exacta, pero solo resulta interpretable para quien participó en el desarrollo.</p>
  </div>
  <div>
    <p class="compare-label">Notas redactadas</p>
    <p class="compare-body">«Primera versión pública. Portfolio con presentación, proyectos y contacto, publicado automáticamente en cada cambio. Toda incorporación supera cuatro comprobaciones: validez del marcado, disponibilidad de los enlaces, formato y una puntuación mínima de accesibilidad de 90.»</p>
  </div>
</div>

**4 · Publicación** mediante **Publish release**, y verificación de que la versión figura en la portada del repositorio.

#### Bloque C · Auditoría por pares del repositorio

<p class="stage stage--guided">Por parejas, cada persona sobre el repositorio de la otra</p>

El objeto de esta auditoría no es una pull request concreta, sino seis semanas de desarrollo en conjunto. Recorre el repositorio de tu pareja conforme a la siguiente relación de criterios y **registra la evidencia concreta**, no la valoración general.

| Criterio | Ubicación de la evidencia | Dato que se registra |
| -------- | ------------------------- | -------------------- |
| Distribución temporal | Pestaña Insights → Commits, o el listado de pull requests con sus fechas | Número de semanas distintas con actividad registrada |
| Trazabilidad | Cada pull request cerrada | Cuántas referencian la issue que resuelven y cuántas no |
| Cumplimiento de los controles | Historial de <code>main</code> | Existencia de commits que no procedan de una fusión |
| Calidad del README | Lectura del documento sin conocimiento previo del proyecto | Qué apartados resultan incomprensibles, con la cita literal |
| Release | Pestaña Releases | Si las notas resultan interpretables sin acceso al código |

**Procedimiento de comunicación de los hallazgos.** Mediante la apertura de **issues en el repositorio auditado**. La condición de colaborador no es necesaria: el repositorio es público. Se abre una issue por hallazgo, con el formato establecido para las propias, esto es, título con verbo en infinitivo y cuerpo con la descripción de lo observado y su ubicación.

<div class="rule">
  <p class="rule-label">Naturaleza de una auditoría técnica</p>
  <p>Una auditoría no consiste en un inventario de defectos. Se registran las incidencias susceptibles de corrección y también los elementos correctamente resueltos, dado que quien recibe el informe necesita conocer qué debe conservar. Un informe que únicamente consigna deficiencias se interpreta como una descalificación y se desatiende en su totalidad; un informe que no consigna ninguna evidencia el auditor no ha realizado la revisión.</p>
</div>

<dl class="answer">
  <dt>Semanas distintas con actividad en el repositorio auditado</dt>
  <dd></dd>
  <dt>Pull requests sin issue asociada</dt>
  <dd></dd>
  <dt>Apartados no comprendidos del README, con la cita literal</dt>
  <dd></dd>
  <dt>El elemento mejor resuelto del repositorio auditado, y su fundamento</dt>
  <dd></dd>
</dl>

#### Bloque D · Respuesta a la auditoría recibida

<p class="stage stage--solo">Trabajo individual, sobre el repositorio propio</p>

El repositorio propio contiene ahora issues abiertas por una persona externa al desarrollo. Es la primera vez que se produce esta situación y corresponde exactamente a la dinámica de un entorno profesional.

1. Lee la totalidad de las issues antes de responder a ninguna.
2. Las aceptadas se incorporan al tablero y se resuelven conforme al flujo de integración establecido.
3. Las no aceptadas se cierran **acompañadas de un comentario que motive la decisión**. «No procede» no constituye una respuesta; «la captura ocupa 800 KB de forma deliberada porque el presupuesto de calidad no penaliza ese peso y la nitidez de la imagen es relevante en este contexto» sí lo es.
4. Si se han incorporado correcciones, publica la versión `v1.0.1` repitiendo el procedimiento del bloque B. Se trata de un incremento de parche: corrección sin funcionalidad nueva.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>README con los seis apartados, <code>v1.0.0</code> publicada con notas redactadas, y la auditoría del repositorio de la pareja completada con sus issues abiertas.</span></div>
  <div><strong>Ampliación</strong><span>La totalidad de las issues recibidas atendidas: resueltas o cerradas con motivación explícita.</span></div>
  <div><strong>Reto</strong><span>Incorporar al README un enlace dinámico a la última release publicada y verificar que continúa siendo correcto tras publicar la <code>v1.0.1</code>.</span></div>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint">
  <p class="checkpoint-label">Trabajo esperado de la unidad</p>
  <ul class="checklist">
    <li>README de seis apartados, incorporado mediante pull request y revisado.</li>
    <li><code>v1.0.0</code> etiquetada y publicada como release, con notas de elaboración propia.</li>
    <li>Una auditoría completada sobre el repositorio de la pareja asignada, con sus issues correspondientes.</li>
    <li>La totalidad de las issues recibidas, atendidas.</li>
    <li>El primer proyecto de la evaluación, cerrado.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Autoevaluación conceptual · sin consulta de apuntes</p>
  <ol>
    <li>¿A qué destinatario se dirige un README y qué apartado aporta mayor valor diferencial?</li>
    <li>¿Qué diferencia existe entre una etiqueta y una rama?</li>
    <li>Se ha corregido un enlace no resoluble. ¿Qué versión corresponde publicar?</li>
    <li>Se ha incorporado una sección nueva sobre la versión <code>1.2.3</code>. ¿Qué versión corresponde publicar?</li>
    <li>¿Por qué es posible abrir una issue en el repositorio de otra persona sin ser colaborador?</li>
    <li>¿Qué procedimiento corresponde ante una issue de la auditoría con la que no se coincide?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · A una persona que no conoce el proyecto ni a su autor. El apartado de mayor valor diferencial es el de las validaciones del pipeline, por tratarse de una evidencia metodológica infrecuente.</p>
  <p>2 · La rama avanza conforme se incorporan commits; la etiqueta identifica un commit determinado y es inmutable.</p>
  <p>3 · Un incremento de parche: <code>1.0.1</code>. Corrección sin funcionalidad nueva.</p>
  <p>4 · <code>1.3.0</code>. Se incrementa la versión menor y la posición del parche se restablece a cero.</p>
  <p>5 · Porque el repositorio es público. La escritura sobre el código requiere permisos; la apertura de una issue, no.</p>
  <p>6 · Se cierra acompañada de un comentario que motive la decisión. El cierre sin justificación no es un procedimiento admisible.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 7</p>
  <ul class="checklist">
    <li>El portfolio dispone de una release publicada y de un README validado por la pareja de revisión.</li>
    <li>Las issues de la auditoría están cerradas, resueltas o motivadas.</li>
    <li>Una propuesta escrita sobre qué datos gestionará el CRUD del segundo proyecto: en la sesión 7 comienza su desarrollo y el flujo de integración pasa a aplicarse sin explicación previa.</li>
  </ul>
</div>

## Lo que debes recordar

### El método

| Concepto | Fundamento |
| -------- | ---------- |
| **El README se dirige a quien desconoce el proyecto** | Es el único documento que se consulta antes de decidir si continuar. Un README redactado para el docente deja de cumplir su función ante cualquier otro lector |
| **Las validaciones del pipeline deben documentarse** | Constituyen la evidencia metodológica de mayor valor y no son observables desde el exterior del repositorio |
| **Una versión es una referencia inmutable** | Permite identificar un estado concreto del producto y recuperarlo de forma exacta en cualquier momento posterior |
| **Las notas generadas son un borrador** | Enumeran las pull requests incorporadas; el lector necesita saber qué permite hacer la versión que la anterior no permitía |
| **Alcanzar la versión 1.0 es una decisión de alcance** | No significa desarrollo concluido, sino cumplimiento íntegro del alcance comprometido |
| **La apertura de issues no requiere permisos de escritura** | De ahí que la revisión cruzada funcione sin conceder acceso al repositorio |

### El vocabulario de la unidad

| Concepto | Definición |
| -------- | ---------- |
| README | Documento de entrada del repositorio. Se consulta en menos de un minuto |
| Etiqueta | Referencia inmutable asignada a un commit determinado |
| Release | Publicación de una etiqueta con título y notas, dirigida a personas |
| Versionado semántico | <code>MAYOR.MENOR.PARCHE</code>: cambio incompatible, funcionalidad añadida, defecto corregido |
| Notas de versión | Descripción de lo que la versión permite hacer frente a la anterior |
| Insignia | Imagen que refleja en tiempo real el estado del pipeline en el README |
| Auditoría | Revisión del rastro completo de un proyecto contra una relación de criterios acordada, comunicada mediante issues |

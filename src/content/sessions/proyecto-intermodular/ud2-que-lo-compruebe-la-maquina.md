---
title: "Que lo compruebe la máquina"
label: "UD2 · Comprobar"
section: "ud-02"
order: 2
lang: "es"
summary: "Construir el portfolio de verdad haciendo entrar cada sección por pull request, y escribir un pipeline propio que valide HTML, formato, enlaces y accesibilidad, y que impida fusionar cuando algo de eso falla."
duration: "9 horas · 3 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Pipeline que comprueba HTML, enlaces, formato y umbrales de calidad."
date: "2026-09-09"
outcomes:
  - "Escribir un workflow de GitHub Actions desde cero y explicar qué lo dispara."
  - "Distinguir lo que puede comprobar una máquina de lo que solo puede comprobar una persona."
  - "Validar HTML, formato y enlaces de forma automática en cada pull request."
  - "Medir accesibilidad con Lighthouse y acordar un umbral por debajo del cual no se fusiona."
  - "Leer el registro de una ejecución fallida y localizar la línea que la provocó."
  - "Corregir un fallo de accesibilidad real y demostrar que el pipeline lo confirma."
requirements:
  - "El repositorio de la UD1, con la web publicada y main protegida."
  - "La pareja de revisión asignada."
priorKnowledge:
  - "El flujo de integración de la UD1: issue, rama, pull request, revisión y fusión."
  - "HTML y CSS del módulo de Lenguaje de Marcas."
---

<p class="lead">La única comprobación automatizada disponible hasta ahora certifica la transferencia de los archivos al servidor. No evalúa la corrección del marcado, la disponibilidad de los recursos enlazados ni el uso del documento mediante tecnologías de apoyo. A lo largo de estas tres sesiones el portfolio incorpora su contenido definitivo y, de forma simultánea, un pipeline de validación que detecta los defectos con anterioridad a su publicación.</p>

<div class="rule">
  <p class="rule-label">Acoplamiento entre construcción y validación</p>
  <p>Cada sesión comprende una fase de ampliación del pipeline y una fase de desarrollo del portfolio, y ambas están acopladas de forma deliberada: la sección implementada en una sesión debe superar la comprobación incorporada en esa misma sesión. Este acoplamiento impide que la integración continua quede reducida a una configuración inicial que nadie vuelve a consultar.</p>
</div>

<div class="rule">
  <p class="rule-label">Alcance de la evaluación: la accesibilidad como criterio medible</p>
  <p>El diseño gráfico permanece fuera del alcance evaluativo de este módulo, con una excepción deliberada: la accesibilidad. Su inclusión no responde a criterios estéticos, sino a que constituye la única dimensión de la interfaz cuantificable mediante métricas objetivas y verificables de forma automatizada, con independencia del criterio subjetivo de quien evalúa. La tipografía, el color y la composición se evalúan en los módulos que los imparten.</p>
</div>

## Sesión 3 · El primer flujo de integración continua

**Antes de empezar.** Ya has trabajado con issues, ramas de funcionalidad y revisión por pares. En esta sesión el portfolio incorpora su primera validación automatizada, ejecutada sobre cada propuesta de integración antes de que el código alcance la rama principal. El backend continúa su desarrollo en el repositorio del módulo de Servidor.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Evaluación inicial · sin apuntes</p>
  <ol>
    <li>Tu página se publica con estado de éxito en GitHub Actions. ¿Qué certifica exactamente ese estado y qué queda fuera de su alcance?</li>
    <li>Si integras un documento HTML con una etiqueta sin cerrar, ¿qué mecanismo lo detecta actualmente?</li>
    <li>¿En qué máquina se ejecuta un workflow de GitHub Actions y qué implica eso sobre las herramientas disponibles durante la ejecución?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación conceptual y demostración técnica</p>

#### Ausencia de validación previa a la integración

El único proceso automatizado disponible hasta ahora es el despliegue, que presenta dos limitaciones estructurales. La primera afecta a su posición en el ciclo de vida: se ejecuta **después** de la fusión, cuando el cambio ya forma parte de `main`, de modo que cualquier diagnóstico que emitiera llegaría con el defecto ya publicado. La segunda afecta a su alcance: el flujo de publicación empaqueta los archivos del repositorio y los transfiere al servidor. Un documento con etiquetas sin cerrar, imágenes sin texto alternativo o enlaces internos no resolubles supera ese proceso con estado de éxito, porque la operación de transferencia se ha completado correctamente.

Conviene formalizar la distinción, dado que estructura el resto del ciclo de vida del software:

<div class="compare-pair">
  <div>
    <p class="compare-label">Despliegue continuo (CD)</p>
    <p class="compare-body">Verifica la entrega del artefacto al entorno de producción. Emite un resultado binario sobre la operación de publicación y no evalúa las propiedades del contenido entregado.</p>
  </div>
  <div>
    <p class="compare-label">Integración continua (CI)</p>
    <p class="compare-body">Verifica que el incremento propuesto satisface los criterios de calidad acordados. Se ejecuta sobre la <em>pull request</em>, con anterioridad a la fusión, y su función es impedir la integración cuando el resultado es negativo.</p>
  </div>
</div>

En esta sesión se implementa la segunda mediante un workflow redactado manualmente: a diferencia del flujo de publicación, esta definición no la genera ningún asistente del portal.

#### El entorno de ejecución: runners efímeros y reproducibilidad

<p class="term">Runner</p>

Máquina virtual que GitHub aprovisiona para ejecutar un workflow y destruye al finalizar. Su sistema de archivos parte de una imagen base estandarizada: no contiene el proyecto, ni las dependencias instaladas en la estación de trabajo local, ni la configuración personal de quien desarrolla. Cada ejecución parte del mismo estado inicial conocido.

Esta naturaleza efímera determina las dos reglas que previenen la mayoría de los errores de esta sesión:

| Propiedad del entorno de ejecución | Consecuencia en la definición del workflow |
| ---------------------------------- | ------------------------------------------ |
| El runner no dispone del código fuente | La primera etapa debe clonar el repositorio, función que cumple la acción <code>actions/checkout</code> |
| El runner no dispone de las herramientas del proyecto | Toda dependencia debe declararse e instalarse de forma explícita dentro del propio flujo |

La consecuencia metodológica es la **reproducibilidad**: al partir de un estado inicial conocido, el resultado obtenido en el runner es reproducible por cualquier persona o sistema que ejecute la misma definición. Un entorno local, por el contrario, acumula dependencias globales, variables de entorno y versiones no declaradas. Esa divergencia progresiva entre entornos (*configuration drift*) constituye el origen técnico del argumento «en mi equipo funciona», que un pipeline de integración continua invalida como criterio de aceptación.

#### Estructura declarativa de un workflow

La especificación de GitHub Actions se articula en torno a cuatro elementos:

<dl class="worked">
  <dt><code>on</code></dt>
  <dd>Declara los eventos que desencadenan la ejecución. En esta implementación serán la apertura o actualización de una <em>pull request</em> y la integración de cambios en <code>main</code>.</dd>
  <dt><code>jobs</code></dt>
  <dd>Unidades de trabajo independientes. Cada job se aprovisiona en su propia máquina virtual y se ejecuta en paralelo, salvo que se declare una dependencia explícita mediante <code>needs</code>. Cada job se publica como un <em>check</em> verificable en la pull request.</dd>
  <dt><code>steps</code></dt>
  <dd>Secuencia ordenada de etapas dentro de un job. El fallo de una etapa interrumpe la ejecución de las restantes.</dd>
  <dt><code>uses</code> frente a <code>run</code></dt>
  <dd><code>uses</code> invoca una acción reutilizable publicada por terceros; <code>run</code> ejecuta una instrucción en el intérprete de comandos del runner.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Delimitación entre validación automatizada y revisión humana</p>
  <p>La automatización asume los criterios objetivos, deterministas y repetibles: validez sintáctica del marcado, disponibilidad de los recursos enlazados, conformidad con el formato acordado y ratio de contraste mínimo. La revisión por pares asume los criterios que requieren juicio profesional: la claridad de la exposición, la pertinencia del contenido y la correspondencia entre el cambio propuesto y el requisito formulado en la issue. La confusión entre ambos planos produce dos disfunciones habituales: destinar la revisión humana a detectar defectos de formato que un analizador estático resuelve en segundos, o atribuir al estado verde del pipeline una garantía de corrección funcional que no posee.</p>
</div>

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo práctico guiado sobre el proyecto base</p>

#### Bloque A · Implementación del workflow de validación

Antes de abrir el editor, verifica la disponibilidad del entorno de ejecución. **Node.js** permite ejecutar JavaScript fuera del navegador, **npm** es su gestor de paquetes y **npx** el ejecutor que invoca un paquete sin instalarlo de forma permanente en el sistema. En este módulo intervienen exclusivamente como herramientas de análisis estático del marcado; no guardan relación con el desarrollo del backend. Ejecuta `node --version` y `npm --version` en la terminal: la versión requerida es Node 22, idéntica a la declarada en el workflow, de modo que el entorno local y el del runner sean equivalentes. Si la instalación acaba de realizarse, abre una terminal nueva, ya que una sesión previa conserva las variables de entorno anteriores. En PowerShell, la política de ejecución puede bloquear `npm.ps1`; en ese caso invoca `npm.cmd` y `npx.cmd`.

Ambos archivos se ubican en la raíz del repositorio del portfolio: `.htmlvalidate.json` y `.github/workflows/ci.yml`. En las sesiones siguientes, los nuevos trabajos de validación se incorporarán dentro de ese mismo `ci.yml`, bajo la clave `jobs`, y no en archivos independientes. El workflow de despliegue de la sesión 1 se conserva sin modificaciones: uno publica y el otro valida, y ambos resultan necesarios.

<p class="stage stage--solo">Trabajo individual, siguiendo el flujo de integración establecido</p>

**1 · Issue y rama de funcionalidad.** Crea una issue titulada «Añadir un workflow de CI que valide el HTML», con el siguiente criterio de aceptación: *cada pull request muestra un check denominado HTML válido, y ese check falla cuando el marcado contiene errores*. A continuación, genera la rama correspondiente:

```bash
git switch main
git pull
git switch -c 7-ci-html
```

**2 · Configuración del analizador estático.** Crea en la raíz el archivo `.htmlvalidate.json`:

```json
{
  "extends": ["html-validate:recommended"]
}
```

Esa declaración selecciona el conjunto de reglas aplicables. Sin archivo de configuración, la herramienta carece de criterio normativo con el que evaluar el documento.

**3 · Definición del workflow.** Crea `.github/workflows/ci.yml`, junto al workflow de despliegue y no dentro de él: son procesos con responsabilidades distintas y se declaran en archivos independientes.

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  html:
    name: HTML válido
    runs-on: ubuntu-latest
    steps:
      - name: Descargar el repositorio
        uses: actions/checkout@v4

      - name: Preparar Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Validar el HTML
        run: npx --yes html-validate@9 "**/*.html"
```

**4 · Análisis de la definición antes de integrarla.** Responde sin consultar documentación externa:

<dl class="answer">
  <dt>¿Cuántos jobs define el archivo y con qué nombre aparecerá el check en la pull request?</dt>
  <dd></dd>
  <dt>¿Qué etapas invocan una acción de terceros y cuál ejecuta una instrucción propia?</dt>
  <dd></dd>
  <dt>Si se suprimiera la etapa de checkout, ¿qué error se produciría y cuál sería su causa?</dt>
  <dd></dd>
</dl>

**5 · Integración y apertura de la pull request.**

```bash
git add .github/workflows/ci.yml .htmlvalidate.json
git commit -m "Anadir un workflow de CI que valida el HTML"
git push -u origin 7-ci-html
```

Abre la pull request incluyendo `Closes #7` en su descripción. La definición queda sometida a sí misma: **la propia pull request que incorpora el CI es validada por él**. En la sección de comprobaciones aparece un único check, el recién declarado; el workflow de despliegue no figura porque su evento de activación no contempla `pull_request`. Con ello queda cubierta la etapa de validación que la sesión anterior identificó como ausente en el ciclo.

<details class="aside aside--help">
  <summary>Si el check resulta fallido en la primera ejecución</summary>
  <p>Es el resultado más frecuente e indica que el analizador está evaluando efectivamente el documento. Abre la ejecución en la pestaña <strong>Actions</strong>, accede a la etapa «Validar el HTML» y localiza las líneas que comienzan por la ruta del archivo: cada una indica el número de línea y la regla incumplida. Corrige sobre la misma rama, confirma y envía los cambios; el check se reejecuta de forma automática.</p>
</details>

#### Bloque B · Provocación controlada de fallos

<p class="stage stage--guided">Ejecución simultánea sobre la misma rama</p>

Un pipeline cuyo comportamiento ante el error no ha sido observado no ofrece garantías operativas. Introduce las tres alteraciones siguientes, de forma individual, y analiza el diagnóstico que emite cada una:

| Alteración introducida | Resultado esperado |
| ---------------------- | ------------------ |
| Cierre incorrecto de una etiqueta de sección | Error de sintaxis, con indicación del número de línea exacto |
| Supresión del atributo de idioma en la etiqueta raíz | Incumplimiento de regla y no de sintaxis: el documento es sintácticamente válido pero infringe el conjunto normativo configurado |
| Valor <code>tururu</code> en <code>node-version</code> | Fallo en una etapa previa: el job no alcanza la validación porque el aprovisionamiento del entorno no se completa |

<div class="rule">
  <p class="rule-label">Lectura del registro de ejecución</p>
  <p>El registro de una ejecución contiene un volumen elevado de información sin valor diagnóstico. El dato relevante se concentra en la etapa marcada como fallida y, dentro de ella, en sus últimas líneas, donde el proceso escribe el motivo de la terminación anómala. La lectura secuencial desde el inicio del registro es el procedimiento menos eficiente para localizar la causa.</p>
</div>

Restablece el estado correcto y verifica que el check vuelve a completarse con éxito antes de continuar.

#### Bloque C · Conversión del check en requisito de fusión

<p class="stage stage--solo">Trabajo individual en la configuración del repositorio</p>

Una comprobación que informa pero no condiciona la integración termina siendo ignorada. La configuración siguiente la convierte en comprobación obligatoria (*required status check*).

1. Fusiona previamente la pull request del bloque A, de modo que el check conste en el historial de `main`.
2. Accede a **Settings → Rules → Rulesets → main protegida → Edit**.
3. En **Require status checks to pass** —la regla que en la sesión anterior no pudo configurarse porque la lista de comprobaciones disponibles estaba vacía— selecciona **Add checks** e incorpora **HTML válido**.
4. Guarda la configuración.

Verificación: crea una rama con un error de marcado deliberado, abre la pull request y comprueba que la acción de fusión queda bloqueada. Cierra esa pull request sin fusionarla.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación del bloque C</p>
  <ul class="checklist">
    <li>La pull request con marcado inválido no admite la fusión y la interfaz indica el motivo del bloqueo.</li>
    <li>El nombre de la comprobación obligatoria coincide con el valor de <code>name</code> declarado en el job.</li>
    <li>La rama de prueba está cerrada y eliminada.</li>
  </ul>
</div>

#### Bloque D · Primera sección del portfolio definitivo

<p class="stage stage--solo">Trabajo individual, con la validación automática ya activa</p>

Concluye la fase del documento mínimo de verificación. Selecciona del tablero la issue correspondiente a la cabecera e implementa la primera sección real del portfolio con estructura semántica: un encabezado con navegación, un contenido principal y un pie de página. Sin hojas de estilo todavía: en esta fase el objetivo es la corrección estructural del documento.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La cabecera y una sección de presentación, integradas mediante pull request y con ambos checks en estado correcto.</span></div>
  <div><strong>Ampliación</strong><span>La navegación enlazando las secciones aún no implementadas, registradas previamente como issues.</span></div>
  <div><strong>Reto</strong><span>Incorporar al workflow un segundo job que verifique la ausencia de archivos con mayúsculas o espacios en el nombre, mediante una única instrucción <code>run</code>.</span></div>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Autoevaluación conceptual · sin consulta de apuntes</p>
  <ol>
    <li>¿Por qué la primera etapa de casi todos los jobs es <code>actions/checkout</code>?</li>
    <li>¿Qué diferencia existe entre <code>uses</code> y <code>run</code>?</li>
    <li>Un workflow se completa con éxito en el runner pero falla en la estación local de otra persona. ¿Cuál de los dos entornos constituye la referencia y por qué?</li>
    <li>¿Por qué una comprobación que no bloquea la fusión pierde eficacia con el tiempo?</li>
    <li>¿En qué punto del registro de ejecución se localiza el motivo de un fallo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el runner se aprovisiona a partir de una imagen base que no contiene el código fuente del repositorio; su obtención debe declararse de forma explícita.</p>
  <p>2 · <code>uses</code> invoca una acción reutilizable ya publicada por terceros; <code>run</code> ejecuta una instrucción propia en el intérprete de comandos del runner.</p>
  <p>3 · El runner, por tratarse de un entorno reproducible que parte de un estado inicial conocido. La estación local acumula configuración no declarada que ningún otro sistema comparte.</p>
  <p>4 · Porque una advertencia que no condiciona la integración se omite en cuanto existe presión de entrega. Una comprobación no vinculante deja de ejercer función de control de calidad.</p>
  <p>5 · En la etapa marcada como fallida, comenzando la lectura por sus últimas líneas.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 4</p>
  <ul class="checklist">
    <li>Dos issues adicionales del portfolio recorridas íntegramente fuera del aula, con ambos checks en estado correcto.</li>
    <li>Una revisión registrada en el repositorio de tu pareja, indicando qué aspectos se verificaron.</li>
    <li>La relación de enlaces externos que incluirá el portfolio: GitHub, LinkedIn, correo electrónico y proyectos.</li>
  </ul>
</div>

## Sesión 4 · Validación de enlaces y normalización del formato

**Antes de empezar.** El workflow valida ya la corrección del marcado. En esta sesión se incorporan dos comprobaciones adicionales, la disponibilidad de los recursos enlazados y la conformidad del formato, que detectan defectos con anterioridad a la fusión.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Evaluación inicial · sin apuntes</p>
  <ol>
    <li>¿Cuántos enlaces contiene actualmente tu portfolio y cuándo se verificó por última vez que todos resuelven?</li>
    <li>Dos personas escriben el mismo documento HTML con sangrías distintas. ¿Qué criterio determina cuál de las dos es la correcta?</li>
    <li>Si una comprobación automática emite un resultado negativo sobre un elemento que en realidad es correcto, ¿qué procedimiento debe seguirse?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación conceptual y demostración técnica</p>

#### Dos defectos objetivos: enlaces no resolubles y formato inconsistente

Un enlace que no resuelve y un archivo con estilos de sangría heterogéneos constituyen dos defectos ajenos a la competencia en programación, pero perceptibles de inmediato en cualquier revisión profesional.

Ambos comparten una propiedad determinante: son **objetivamente verificables**. Establecer si un recurso responde a una petición, o si un archivo se ajusta a un formato declarado, no exige juicio profesional alguno, de modo que corresponden por completo al ámbito de la validación automatizada.

#### Granularidad de los jobs: una comprobación por criterio

La definición actual del workflow contiene un único job. En esta sesión pasará a contener tres, decisión de diseño que conviene fundamentar:

<div class="compare-pair">
  <div>
    <p class="compare-label">Agrupación en un único job</p>
    <p class="compare-body">Se publica una sola comprobación. Ante un resultado negativo resulta necesario abrir el registro para determinar si el defecto corresponde al marcado, a los enlaces o al formato. Además, el fallo de una etapa interrumpe las siguientes, por lo que los defectos se descubren de forma secuencial, uno por iteración.</p>
  </div>
  <div>
    <p class="compare-label">Un job por criterio de validación</p>
    <p class="compare-body">Se publican tres comprobaciones identificadas por su nombre y ejecutadas en paralelo. La pull request informa de qué criterio incumple el cambio sin necesidad de consultar el registro, y una sola ejecución revela todos los defectos presentes.</p>
  </div>
</div>

Los jobs de un workflow se ejecutan en paralelo salvo declaración explícita de dependencias mediante `needs`, de modo que la duración total no equivale a la suma de las tres validaciones, sino a la de la más lenta.

#### Normalización del formato mediante un formateador

<p class="term">Formateador (<em>formatter</em>)</p>

Herramienta que reescribe el código fuente conforme a un conjunto fijo de reglas de estilo. Su valor no reside en la superioridad técnica de ese estilo concreto, sino en dos consecuencias: la discusión sobre el formato desaparece del proceso de revisión, y las diferencias que muestra una pull request corresponden a cambios funcionales y no a reordenaciones de espacios en blanco.

Ejecutado en modo de comprobación no modifica ningún archivo: se limita a informar de cuáles no se ajustan al formato declarado y a terminar con código de error.

#### Tratamiento de los falsos positivos

La situación se producirá, en particular durante la verificación de enlaces: determinados servidores responden con un código de error a cualquier petición que no proceda de un navegador convencional, aunque el recurso exista y el enlace sea correcto. Ante un falso positivo caben dos respuestas, de las cuales solo una resulta admisible:

| Respuesta ante el falso positivo | Consecuencia sobre el pipeline |
| -------------------------------- | ------------------------------ |
| Eliminar la comprobación o suprimir su carácter obligatorio | El pipeline deja de ejercer control sobre ese criterio y la reactivación queda indefinidamente pendiente |
| Declarar la excepción documentando su motivo | La comprobación permanece activa, la excepción es explícita y puede auditarse en cualquier revisión posterior |

Un pipeline del que se desactivan reglas cada vez que emiten un resultado incómodo queda reducido a una definición decorativa. Las excepciones se declaran y se justifican.

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo práctico guiado sobre el proyecto base</p>

#### Bloque A · Job de verificación de enlaces

<p class="stage stage--solo">Trabajo individual, con issue y rama previas</p>

Incorpora este job a `.github/workflows/ci.yml`, al mismo nivel de indentación que el ya existente:

```yaml
  enlaces:
    name: Enlaces vivos
    runs-on: ubuntu-latest
    steps:
      - name: Descargar el repositorio
        uses: actions/checkout@v4

      - name: Comprobar los enlaces
        uses: lycheeverse/lychee-action@v2
        with:
          args: --no-progress --max-retries 2 "**/*.html"
          fail: true
```

La indentación es significativa en YAML: `enlaces` se declara con dos espacios, alineado con `html`. Una indentación mayor lo convertiría en contenido del job anterior e invalidaría la definición.

Abre la pull request y analiza el resultado. Es previsible que la comprobación señale algún enlace del menú de navegación dirigido a una sección todavía no implementada: ese resultado **no constituye un falso positivo**, sino la detección correcta de un recurso no resoluble.

<details class="aside aside--help">
  <summary>Si un enlace externo falla pese a ser correcto</summary>
  <p>Verifícalo primero en el navegador. Si el recurso responde, se trata de un servidor que rechaza las peticiones automatizadas. Declara la excepción añadiendo su dirección al argumento <code>--exclude</code> y documenta el motivo en la descripción de la pull request. Una exclusión sin justificación escrita impide determinar, meses después, si el recurso sigue disponible.</p>
</details>

#### Bloque B · Job de verificación del formato

<p class="stage stage--solo">Trabajo individual, sobre la misma rama o sobre una nueva</p>

```yaml
  formato:
    name: Formato
    runs-on: ubuntu-latest
    steps:
      - name: Descargar el repositorio
        uses: actions/checkout@v4

      - name: Preparar Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Comprobar el formato
        run: npx --yes prettier@3 --check "**/*.{html,css,json,md}"
```

Esta comprobación emitirá un resultado negativo en su primera ejecución, dado que el proyecto no se ha normalizado previamente. Aplica el formato en local con la misma herramienta en modo de escritura:

```bash
npx --yes prettier@3 --write "**/*.{html,css,json,md}"
```

Examina las diferencias antes de confirmar los cambios: conviene identificar con precisión qué ha modificado la herramienta sobre el código fuente.

<div class="rule">
  <p class="rule-label">Aislamiento del commit de normalización</p>
  <p>Una operación de formateo modifica un número elevado de líneas sin alterar el comportamiento del documento. Si esas modificaciones se confunden con un cambio funcional en la misma confirmación, la revisión por pares debe localizar el cambio real entre cientos de líneas de indentación desplazada. El reformateo se registra por tanto en un commit independiente y con un mensaje explícito: «Aplicar el formato de Prettier a todo el proyecto».</p>
</div>

#### Bloque C · Incorporación de las dos comprobaciones obligatorias

<p class="stage stage--solo">Trabajo individual, posterior a la fusión</p>

Siguiendo el procedimiento de la sesión anterior: fusiona las pull requests y accede después a **Settings → Rules → Rulesets → main protegida → Edit → Require status checks** para incorporar **Enlaces vivos** y **Formato**. El conjunto queda en cuatro comprobaciones obligatorias.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación del bloque C</p>
  <ul class="checklist">
    <li>Una pull request muestra cuatro comprobaciones identificadas con nombres legibles.</li>
    <li>Las cuatro figuran como obligatorias en el ruleset de la rama principal.</li>
    <li>Es posible determinar cuál de las cuatro ha fallado sin abrir el registro de ejecución.</li>
  </ul>
</div>

#### Bloque D · Sección de proyectos

<p class="stage stage--solo">Trabajo individual, con enlaces reales</p>

Implementa la sección de proyectos del portfolio. En esta fase contendrá una única ficha, la del propio portfolio: descripción, tecnologías empleadas, enlace al repositorio y enlace a la versión publicada. Constituye el primer proyecto documentado y verificable del expediente.

Incorpora asimismo los enlaces externos previstos: GitHub, LinkedIn si procede y dirección de contacto. El job de verificación detectará los que estén mal formados antes de su publicación.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La sección de proyectos con una ficha y los enlaces externos, con las cuatro comprobaciones en estado correcto.</span></div>
  <div><strong>Ampliación</strong><span>Los estilos base del portfolio, en un commit propio y en su propia pull request.</span></div>
  <div><strong>Reto</strong><span>Programar la ejecución semanal del job de enlaces sin intervención de una pull request, con el fin de detectar los recursos externos que dejan de estar disponibles. Indicación: la clave <code>on</code> admite <code>schedule</code>.</span></div>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Autoevaluación conceptual · sin consulta de apuntes</p>
  <ol>
    <li>¿Por qué tres jobs independientes y no tres etapas dentro de un único job?</li>
    <li>¿La ejecución de tres jobs triplica la duración del pipeline?</li>
    <li>Un enlace externo falla en el CI pero responde correctamente en el navegador. ¿Qué procedimiento corresponde aplicar y cuál queda descartado?</li>
    <li>¿Por qué la normalización del formato se registra en un commit independiente?</li>
    <li>¿Qué aporta un formateador a un equipo, si su estilo no es objetivamente superior a otro?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para que cada criterio de validación disponga de una comprobación identificada por su nombre y para que todos los defectos se manifiesten en una misma ejecución, en lugar de secuencialmente.</p>
  <p>2 · No: los jobs se ejecutan en paralelo, de modo que la duración total equivale a la del job más lento.</p>
  <p>3 · Corresponde declarar la exclusión de ese recurso concreto documentando el motivo en la pull request. Queda descartado eliminar la comprobación o suprimir su carácter obligatorio.</p>
  <p>4 · Porque modifica un número elevado de líneas sin alterar el comportamiento, y su mezcla con un cambio funcional impide una revisión efectiva.</p>
  <p>5 · La eliminación de la discusión sobre el estilo y la garantía de que las diferencias mostradas en una pull request corresponden a cambios reales.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 5</p>
  <ul class="checklist">
    <li>El portfolio integra cabecera, presentación y proyectos, incorporados mediante pull request.</li>
    <li>Las cuatro comprobaciones se encuentran en estado correcto sobre <code>main</code>.</li>
    <li>Debe constar en el repositorio una imagen propia o del proyecto: la sesión 5 trabajará sobre ella.</li>
  </ul>
</div>

## Sesión 5 · El presupuesto de calidad

**Antes de empezar.** El portfolio dispone ya de validación automática de marcado, enlaces y formato. En esta sesión se define y se verifica un umbral cuantitativo de calidad.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Evaluación inicial · sin apuntes</p>
  <ol>
    <li>Una página «funciona». ¿Es posible expresar mediante una magnitud numérica en qué grado lo hace?</li>
    <li>¿Cómo utilizaría tu portfolio una persona que no percibe la pantalla?</li>
    <li>Si se estableciera una puntuación mínima de accesibilidad, ¿la superaría tu página en su estado actual?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación conceptual y demostración técnica</p>

#### De la verificación binaria a la métrica cuantitativa

Las cuatro comprobaciones implementadas hasta ahora emiten un resultado binario. Queda fuera de su alcance la pregunta que formula cualquier cliente y que el pipeline todavía no responde: **en qué grado**.

<p class="term">Lighthouse</p>

Herramienta de auditoría automatizada que carga el documento en una instancia de navegador, ejecuta sobre él un conjunto de comprobaciones y emite cuatro puntuaciones normalizadas de 0 a 100: rendimiento, accesibilidad, buenas prácticas y posicionamiento (SEO). Junto a cada puntuación detalla las comprobaciones incumplidas, con la ubicación exacta del defecto en el documento.

#### El presupuesto de calidad como umbral acordado

<p class="term">Presupuesto de calidad (<em>quality budget</em>)</p>

Valor mínimo pactado con antelación al desarrollo y declarado en un archivo de configuración versionado. Un resultado inferior impide la fusión. Su formalización numérica y su registro en el repositorio son precisamente lo que evita el aplazamiento indefinido de las correcciones de calidad.

El presupuesto acordado para el portfolio es el siguiente:

| Categoría | Umbral mínimo | Fundamento del valor |
| --------- | ------------- | -------------------- |
| Accesibilidad | 90 | Alcanzable en un sitio estático; por debajo de ese valor existen barreras de uso reales |
| SEO | 90 | Un portfolio no indexable no cumple su función de difusión profesional |
| Buenas prácticas | 90 | Evalúa mayoritariamente defectos cuya corrección no implica coste de desarrollo |
| Rendimiento | advertencia | La puntuación depende de la capacidad de la máquina que ejecuta la medición; informa, pero no bloquea la integración |

#### Fundamento de la evaluación de la accesibilidad

La UD1 estableció que el diseño gráfico no forma parte del alcance evaluativo de este módulo, criterio que se mantiene. La accesibilidad constituye una excepción fundamentada en tres razones: es **objetiva**, al expresarse mediante métricas verificables de forma automática; es **exigible legalmente** en los productos destinados al sector público, conforme al Real Decreto 1112/2018 y a la norma EN 301 549, que adopta como referencia técnica las pautas WCAG 2.1 en nivel AA; y la mayoría de los defectos que reducen su puntuación son omisiones cuya corrección es inmediata.

<dl class="worked">
  <dt>Imagen sin texto alternativo</dt>
  <dd>Un lector de pantalla anuncia únicamente la existencia de una imagen, sin información sobre su contenido. Corrección: un atributo.</dd>
  <dt>Idioma del documento no declarado</dt>
  <dd>El sintetizador de voz aplica la fonética del idioma por defecto al texto en español. Corrección: un atributo.</dd>
  <dt>Enlace cuyo texto es «aquí»</dt>
  <dd>La navegación secuencial por enlaces, habitual con lector de pantalla, produce una lista de destinos indistinguibles entre sí. Corrección: reformular el texto del enlace.</dd>
  <dt>Contraste insuficiente entre texto y fondo</dt>
  <dd>El texto resulta ilegible con iluminación intensa o con baja visión. La WCAG establece una ratio mínima de 4,5:1 para el texto normal. Corrección: ajustar un color.</dd>
  <dt>Salto de un encabezado de nivel 1 a uno de nivel 3</dt>
  <dd>La estructura jerárquica del documento queda inconsistente para quien navega mediante encabezados. Corrección: ajustar el nivel.</dd>
</dl>

Ninguno de los cinco defectos depende de una apreciación subjetiva y todos son detectables de forma automatizada.

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo práctico guiado sobre el proyecto base</p>

#### Bloque A · Medición inicial de referencia

<p class="stage stage--solo">Trabajo individual, en el navegador</p>

Antes de automatizar la auditoría, conviene ejecutarla manualmente una vez. Abre el portfolio publicado, accede a las herramientas de desarrollo, selecciona la pestaña **Lighthouse** en modo escritorio y ejecuta **Analizar**.

Registra las cuatro puntuaciones obtenidas sin aplicar corrección alguna. Constituyen la medición de referencia con la que se compararán los resultados al final de la sesión.

<dl class="answer">
  <dt>Rendimiento / Accesibilidad / Buenas prácticas / SEO</dt>
  <dd></dd>
  <dt>Las tres incidencias de accesibilidad con mayor prioridad en el informe</dt>
  <dd></dd>
</dl>

#### Bloque B · Declaración del presupuesto en el repositorio

<p class="stage stage--solo">Trabajo individual, con issue y rama previas</p>

**1 · Archivo de configuración.** Crea en la raíz el archivo `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./"
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.9 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:performance": ["warn", { "minScore": 0.8 }]
      }
    }
  }
}
```

La directiva `staticDistDir` declara que el sitio consiste en archivos estáticos ubicados en esa ruta: la propia herramienta los sirve durante la auditoría, por lo que la medición no requiere que la página esté desplegada. El nivel `error` bloquea la integración; el nivel `warn` únicamente informa.

**2 · Definición del job.** Incorpora a `ci.yml`, al mismo nivel que los tres anteriores:

```yaml
  calidad:
    name: Presupuesto de calidad
    runs-on: ubuntu-latest
    steps:
      - name: Descargar el repositorio
        uses: actions/checkout@v4

      - name: Auditar con Lighthouse
        uses: treosh/lighthouse-ci-action@v12
        with:
          configPath: ./lighthouserc.json
          uploadArtifacts: true
```

**3 · Ejecución y recuperación del informe.** Abre la pull request. La duración de este job es superior a la de los anteriores, dado que instancia un navegador completo para auditar el documento. Al finalizar, accede a la ejecución y descarga el informe desde la sección de artefactos: es equivalente al obtenido en el navegador, pero generado en un entorno reproducible.

#### Bloque C · Corrección de los defectos detectados

<p class="stage stage--guided">Trabajo individual, con puesta en común de los defectos que resulten frecuentes en el grupo</p>

Recorre la relación de incidencias de accesibilidad del informe en orden de prioridad y aplica las correcciones. Los cinco defectos siguientes aparecen en la práctica totalidad de los portfolios y su fundamento se ha expuesto en la parte teórica:

<ul class="checklist">
  <li>Imágenes sin texto alternativo. En las imágenes decorativas el atributo se declara vacío, pero debe declararse.</li>
  <li>Idioma no declarado en la etiqueta raíz del documento.</li>
  <li>Enlaces cuyo texto no identifica el destino.</li>
  <li>Contraste insuficiente entre el texto y su fondo.</li>
  <li>Encabezados que omiten un nivel de la jerarquía.</li>
</ul>

Cada corrección se registra en su propio commit. Cuando el informe deje de señalar incidencias, repite la auditoría en el navegador y compara el resultado con la medición de referencia del bloque A.

<div class="rule">
  <p class="rule-label">Elevación del umbral tras alcanzar la mejora</p>
  <p>Si la puntuación de accesibilidad alcanza 96, el mínimo declarado en el archivo debe elevarse a 95 e integrarse ese cambio. El principio aplicable es que toda mejora conseguida se protege mediante el umbral: mantenerlo en 90 permite que una incorporación posterior —una imagen sin texto alternativo, por ejemplo— degrade la puntuación hasta 92 sin que ninguna comprobación lo detecte. Un presupuesto situado por debajo del estado real del producto no ejerce ninguna función de control.</p>
</div>

#### Bloque D · Cierre del primer proyecto

<p class="stage stage--solo">Trabajo individual, última pull request de la unidad</p>

<div class="checkpoint">
  <p class="checkpoint-label">Trabajo esperado de la unidad</p>
  <ul class="checklist">
    <li>Portfolio con cabecera, presentación, proyectos y contacto, publicado y con estilos propios.</li>
    <li>Un archivo <code>ci.yml</code> de elaboración propia con cuatro jobs: marcado, enlaces, formato y calidad.</li>
    <li>Las cuatro comprobaciones declaradas como obligatorias en el ruleset de la rama principal.</li>
    <li>Puntuación de accesibilidad superior a 90, con el umbral del archivo ajustado al valor alcanzado.</li>
    <li>La totalidad del contenido de estas tres semanas incorporado mediante pull request, ninguna fusionada sin revisión previa de la pareja asignada.</li>
  </ul>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Los cuatro jobs en estado correcto y el portfolio publicado con contenido definitivo.</span></div>
  <div><strong>Ampliación</strong><span>El umbral de accesibilidad elevado al valor alcanzado y justificado en la descripción de la pull request.</span></div>
  <div><strong>Reto</strong><span>Incorporar al presupuesto una aserción sobre el peso total de la página e identificar qué recurso concentra la mayor parte de ese peso.</span></div>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Autoevaluación conceptual · sin consulta de apuntes</p>
  <ol>
    <li>¿Qué diferencia existe entre una comprobación de resultado binario y un presupuesto de calidad?</li>
    <li>¿Por qué la accesibilidad se evalúa en este módulo y la tipografía no?</li>
    <li>¿Por qué el rendimiento se declara como advertencia y no como bloqueo?</li>
    <li>La puntuación ha alcanzado 96. ¿Por qué debe modificarse el archivo de configuración?</li>
    <li>¿Qué función cumple la directiva <code>staticDistDir</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · La primera verifica el cumplimiento de una condición y responde sí o no; el segundo mide una magnitud y la contrasta con un mínimo acordado previamente.</p>
  <p>2 · Porque es objetiva, cuantificable y jurídicamente exigible en el sector público. La tipografía responde a criterio profesional, y ese criterio se evalúa en el módulo que lo imparte.</p>
  <p>3 · Porque la puntuación depende de la capacidad de la máquina que ejecuta la medición, de modo que bloquearía la integración por causas ajenas al código evaluado.</p>
  <p>4 · Porque una mejora que no se protege mediante el umbral puede perderse sin detección: con el mínimo en 90 caben sucesivas degradaciones inadvertidas.</p>
  <p>5 · Declara que la herramienta debe servir por sí misma los archivos estáticos de esa ruta, lo que permite auditar el sitio sin haberlo desplegado previamente.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 6</p>
  <ul class="checklist">
    <li>Las cuatro comprobaciones en estado correcto sobre <code>main</code> y el portfolio publicado con el contenido de la unidad.</li>
    <li>Cuatro revisiones propias registradas en el repositorio de la pareja asignada a lo largo de estas tres semanas.</li>
    <li>Un registro escrito de qué se mostraría a una persona que accede al repositorio sin conocer el proyecto: la sesión 6 se dedica a la redacción del README y a la publicación de la primera versión etiquetada.</li>
  </ul>
</div>

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Comprobaciones del portfolio y responsable de cada una</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Despliegue</span>¿Se ha publicado el artefacto? Se ejecuta tras la fusión y no evalúa la calidad del contenido: no constituye un control previo, sino una confirmación de entrega.</li>
    <li><span class="flow-role">HTML válido</span>¿El documento cumple la especificación del marcado? Validación automatizada.</li>
    <li><span class="flow-role">Enlaces vivos</span>¿Todos los recursos enlazados resuelven? Validación automatizada.</li>
    <li><span class="flow-role">Formato</span>¿El código se ajusta al formato declarado? Validación automatizada.</li>
    <li><span class="flow-role">Calidad</span>¿Se alcanzan los umbrales de accesibilidad y SEO? Validación automatizada contra un valor acordado.</li>
    <li><span class="flow-role">Revisión</span>¿El cambio satisface el requisito de la issue y resulta comprensible? Revisión humana: ninguna herramienta automática puede emitir este juicio.</li>
  </ol>
</figure>

| Concepto | Fundamento |
| -------- | ---------- |
| **El runner parte de un entorno limpio en cada job** | De ahí la necesidad de clonar el código e instalar las herramientas dentro del flujo. El resultado es reproducible en ese entorno documentado; otros entornos requieren comprobación propia |
| **Una comprobación por criterio** | Permite identificar el criterio incumplido sin consultar el registro y manifiesta todos los defectos en una misma ejecución |
| **Una comprobación no vinculante pierde eficacia** | Una validación que solo informa se omite en cuanto existe presión de entrega |
| **Las excepciones se declaran y se documentan** | Un pipeline del que se desactivan reglas cuando resultan incómodas deja de ejercer control |
| **El umbral se eleva al alcanzar la mejora** | Un presupuesto situado por debajo del estado real permite degradaciones inadvertidas |

### El vocabulario de la unidad

| Concepto | Definición |
| -------- | ---------- |
| Runner | Máquina virtual que GitHub aprovisiona para ejecutar un workflow y destruye al finalizar |
| Job | Unidad de trabajo del workflow. Se ejecuta en su propia máquina, en paralelo con las demás, y se publica como una comprobación independiente |
| Step | Etapa ordenada dentro de un job. <code>uses</code> invoca una acción de terceros; <code>run</code>, una instrucción propia |
| Integración continua | Validación automatizada de cada cambio con anterioridad a su incorporación, frente al descubrimiento tardío de los defectos |
| Formateador | Herramienta que aplica un formato fijo al código. En modo de comprobación no modifica archivos: informa y termina con código de error |
| Lighthouse | Auditoría automatizada de una página en rendimiento, accesibilidad, buenas prácticas y SEO, con puntuaciones de 0 a 100 |
| Presupuesto de calidad | Umbral mínimo acordado con antelación y declarado en un archivo versionado. Por debajo de él no se autoriza la fusión |
| Falso positivo | Resultado negativo del CI sobre un elemento correcto. Se resuelve declarando y documentando la excepción, nunca desactivando la comprobación |

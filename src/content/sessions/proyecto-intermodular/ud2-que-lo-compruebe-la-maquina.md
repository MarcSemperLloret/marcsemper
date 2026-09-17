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
  <p>En este módulo se evalúa cómo configuras, interpretas y utilizas las comprobaciones para revisar y publicar cambios. Algunas propiedades de accesibilidad pueden analizarse automáticamente, pero requieren también revisión humana. Las puntuaciones de las herramientas no certifican por sí solas que toda la web sea accesible. La calidad del diseño gráfico corresponde a los módulos que lo trabajan.</p>
</div>

## Sesión 3 · El primer flujo de integración continua

**Antes de empezar.** Continúas con el portfolio y la cabecera o mejora integrada en la sesión 2. Necesitas su carpeta local, el tablero, `main` protegida y tu pareja de revisión. El backend sigue desarrollándose en Servidor; el validador de esta sesión se configura únicamente en el repositorio del portfolio.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Punto de partida · primeros 3 minutos de la explicación</p>
  <ol>
    <li>¿Qué has comprobado cuando el despliegue aparece en verde y abres la URL pública?</li>
    <li>¿Quién detecta actualmente un error de HTML antes de fusionar una PR?</li>
    <li>¿Dónde puedes consultar los pasos ejecutados por GitHub Actions?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · punto de partida, explicación y demostración</p>

#### Validar antes de integrar

El workflow de la sesión 1 publica los archivos después de incorporar un cambio a `main`. Puede terminar correctamente aunque el HTML tenga errores: su trabajo consiste en publicar, y todavía no incluye un validador del documento. La revisión humana es actualmente la comprobación previa a la fusión.

Hoy añadirás un **flujo de integración continua** (CI) que comprueba el HTML cada vez que abres o actualizas una PR. Su resultado aparecerá como un **check**: una comprobación con estado pendiente, correcto o fallido. Después configurarás GitHub para impedir la fusión si ese check falla.

El recorrido será: **editar en tu ordenador → guardar y hacer commit → subir la rama → abrir o actualizar su PR → esperar la comprobación en GitHub**. Guardar un archivo en el editor no inicia Actions. El runner solo puede comprobar el código que has publicado.

| Archivo | Cuándo se ejecuta en este proyecto | Qué hace |
| --- | --- | --- |
| `.github/workflows/static.yml` | Después de un cambio en `main`, o al iniciarlo manualmente | Publica el portfolio en GitHub Pages. |
| `.github/workflows/ci.yml` | Al abrir o actualizar una PR y tras cambios en `main` | Valida el HTML y comunica el resultado. |

Son dos workflows con responsabilidades distintas. **En la PR habrá un check de HTML; el despliegue de Pages se comprobará después de fusionar.** Si realizaste la ampliación de Azure, su workflow puede mostrar comprobaciones adicionales; no son el check de HTML que crearás hoy.

Encontrarás tres nombres relacionados: **CI** es el workflow completo, **HTML válido** es el nombre del único trabajo (*job*) que contiene y **Validar el HTML** es el paso de ese trabajo que ejecuta el analizador. El check que exigirás para fusionar se llama **HTML válido**. Un check fallido informa del problema; el bloqueo de la fusión se configura por separado en el bloque C.

#### Runner y herramientas del proyecto

**Dónde se comprueba tu código**

La comprobación se ejecuta **en los servidores que GitHub pone a disposición de GitHub Actions, a través de Internet**. No se ejecuta en tu ordenador ni en el navegador.

Cuando abres la pull request, GitHub prepara un **ordenador virtual**: un entorno que funciona como un ordenador independiente, aunque utiliza los recursos de un servidor físico. Ese ordenador virtual recibe el nombre de *runner* porque ejecuta los pasos del workflow.

En esta práctica, `ubuntu-latest` indica que ese entorno utiliza **Ubuntu Linux**. Aunque tú trabajes en Windows, GitHub hará la comprobación en Linux. Una vez que hayas subido el código y abierto la PR, puedes apagar tu ordenador: la comprobación continuará en GitHub.

**Por qué aparece Node.js si estamos trabajando con HTML**

Para revisar el HTML utilizaremos un programa llamado **HTML-Validate**. Ese programa está escrito en JavaScript y necesita **Node.js** para ejecutarse.

JavaScript puede ejecutarse dentro de una página web, mediante el navegador. Node.js permite ejecutar programas escritos en JavaScript **fuera del navegador**, por ejemplo desde una terminal. Aquí sirve para ejecutar el programa que busca errores en tu HTML.

No necesitas escribir JavaScript para esta actividad. Preparas Node.js para poder utilizar el validador.

**Qué hará el ordenador de GitHub**

1. **Obtener los archivos del portfolio.** `actions/checkout` copia desde el repositorio el código que se va a comprobar. Solo puede obtener los cambios que hayas subido; no tiene acceso a los archivos sin publicar de tu ordenador.
2. **Preparar Node.js.** `actions/setup-node` deja disponible la versión necesaria para ejecutar el validador.
3. **Comprobar el HTML.** El comando `npx` obtiene y ejecuta HTML-Validate, que lee tus archivos y señala los errores que encuentre según las reglas configuradas.

Al terminar, GitHub muestra el resultado en la pull request y conserva el registro de la comprobación. El ordenador virtual utilizado se descarta.

#### Estructura de un workflow

El archivo utiliza **YAML**, un formato de configuración cuya estructura depende de la sangría. Usa espacios y conserva los niveles del ejemplo: `steps` pertenece al job `html`, y cada guion bajo `steps` inicia un paso.

| Clave | Significado en el ejemplo |
| --- | --- |
| `on` | Eventos que inician la ejecución: `pull_request` y envíos a `main`. |
| `jobs` | Trabajos del workflow. Hoy habrá uno, con identificador `html`. |
| `name` del job | Nombre visible de su check: `HTML válido`. |
| `runs-on` | Entorno que ejecuta el job: `ubuntu-latest`. |
| `steps` | Pasos ordenados. Normalmente, si uno falla, los siguientes se omiten. |
| `uses` | Invoca una acción reutilizable, como descargar el repositorio. |
| `run` | Ejecuta un comando en el runner, como lanzar el validador. |

<div class="rule">
  <p class="rule-label">Alcance de la validación automática</p>
  <p>Un check verde indica que los archivos cumplen las reglas ejecutadas. No demuestra que el contenido responda a la issue ni que todos los enlaces funcionen. Tu pareja seguirá comprobando los criterios de aceptación. En la sesión 4 añadirás verificaciones de enlaces y formato.</p>
</div>

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el portfolio</p>

Distribución orientativa: 45 minutos para crear el workflow, 35 para provocar y corregir fallos, 25 para exigir el check y 35 para aplicar el proceso a una mejora del portfolio. Si una ejecución falla, resuelve su causa antes de pasar al bloque siguiente.

#### Bloque A · Implementación del workflow de validación

**1 · Comprueba el entorno local.** Abre la terminal en la raíz del portfolio, donde está `index.html`. Ejecuta:

```bash
node --version
npm --version
```

**Node.js** ejecuta JavaScript fuera del navegador; **npm** gestiona paquetes, y **npx** permite ejecutar una herramienta de un paquete, descargándolo si hace falta. Aquí se utilizan para analizar HTML, no para programar el backend Java. Utiliza Node **22.x**, como el workflow. Si falta, instala esa versión desde las [descargas de Node.js](https://nodejs.org/en/download) y abre una terminal nueva. Si PowerShell bloquea `npm.ps1` o `npx.ps1`, utiliza `npm.cmd` y `npx.cmd` en los comandos locales, sin cambiar la política de ejecución.

El primer comando debe mostrar una versión que empiece por `v22.`; el segundo, un número de versión de npm. Si aparece «comando no encontrado» o «no se reconoce», resuelve la instalación antes de seguir. Abre en el editor la carpeta completa del portfolio y utiliza su terminal integrada: al listar los archivos con `dir` en PowerShell o `ls` en macOS/Linux debes ver `index.html`. No ejecutes estos comandos en la carpeta del backend.

En este ejercicio `npx` descargará el validador cuando lo necesite. No necesitas ejecutar `npm init`, crear un `package.json` ni añadir una carpeta `node_modules` al repositorio.

**2 · Crea la issue y su rama.** Registra «Añadir validación automática del HTML». Criterios: la PR muestra `HTML válido`, un error de HTML hace fallar el check y su corrección lo devuelve a verde. Asígnate la tarea y ponla en `In Progress`.

En los ejemplos se usa el número **7**: sustitúyelo por el número real de tu issue en la rama y en la descripción de la PR. No lo deduzcas contando las tareas: las PR también consumen números.

Con `git status` sin cambios pendientes, ejecuta:

```bash
git switch main
git pull --ff-only
git switch -c 7-ci-html
```

**3 · Declara las reglas.** En el explorador del editor, crea `.htmlvalidate.json` junto a `index.html` y pega:

```json
{
  "extends": ["html-validate:recommended"]
}
```

Este archivo declara explícitamente las reglas recomendadas del proyecto y permite modificarlas de forma compartida más adelante. HTML-Validate también dispone de configuración predeterminada; el archivo sirve para conservar nuestra elección en el repositorio.

Escribe el nombre completo, incluido el punto inicial. Debe ser un archivo llamado `.htmlvalidate.json`, no una carpeta ni un archivo terminado en `.json.txt`. Guarda el contenido: este fragmento JSON se escribe en el archivo, no en la terminal.

**4 · Crea el workflow.** Dentro de la carpeta existente `.github/workflows`, crea `ci.yml`. Conserva `static.yml`: no pegues un workflow dentro del otro.

En el explorador del editor, abre `.github` y después `workflows`. Si no existen, crea esas dos carpetas, una dentro de la otra. La estructura debe quedar así; los demás archivos del portfolio se conservan:

```text
portfolio/
├── index.html
├── .htmlvalidate.json
└── .github/
    └── workflows/
        ├── static.yml
        └── ci.yml
```

Si tu workflow de publicación tiene otro nombre, conserva ese archivo. Abre `ci.yml` y pega el siguiente contenido completo, desde `name: CI` hasta el comando final:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

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

`permissions: contents: read` permite leer el repositorio. `@9` selecciona la versión mayor 9 del validador; `--yes` permite su descarga sin pedir confirmación interactiva. El patrón entre comillas busca archivos HTML también en subcarpetas.

Guarda `ci.yml`. Cada nivel del ejemplo añade dos espacios; no utilices tabulaciones. `pull_request` y `push` están al mismo nivel, y `branches: [main]` pertenece únicamente a `push`. Por eso subir por primera vez `7-ci-html` no inicia este workflow hasta que abras su PR. Los siguientes envíos a esa rama actualizarán la PR e iniciarán una nueva comprobación.

El comando de `run` se ejecutará en Linux: conserva `npx` en el YAML aunque en tu PowerShell utilices `npx.cmd`.

**5 · Comprueba el HTML en local.** Guarda ambos archivos y ejecuta desde la raíz:

```bash
npx --yes html-validate@9 "**/*.html"
```

La primera vez necesita conexión para descargar el paquete. Si hay errores, lee el archivo, la línea y la regla que aparecen en la salida. Por ejemplo, `element-required-attributes` junto a `html` puede indicar que falta `lang`. Corrige el archivo señalado y repite el comando; si termina sin diagnósticos, ha superado estas reglas.

**Una ejecución correcta puede no imprimir ningún mensaje.** Espera a que reaparezca el indicador de la terminal. Inmediatamente después puedes consultar el código de salida: en PowerShell escribe `$LASTEXITCODE`; en macOS/Linux, `echo $?`. `0` indica que el comando terminó correctamente y un valor distinto de cero indica un fallo. Ejecuta esta consulta justo después del validador, antes de otro comando.

Si aparece un diagnóstico como `index.html`, seguido de `12:5`, `error` y un nombre de regla, localiza el archivo y la línea 12, columna 5, en el editor. Los números dependen de tu documento. Corrige primero el error señalado, guarda y vuelve a ejecutar el mismo comando: abrir la página en el navegador no sustituye esta comprobación.

El documento inicial de la sesión 1 utiliza `<!doctype html>`. Con estas reglas puede aparecer `doctype-style`: cambia esa primera línea a `<!DOCTYPE html>` y repite la comprobación. Ambas formas son válidas en HTML; el diagnóstico exige la convención de estilo seleccionada por el analizador. Un incumplimiento de sus reglas no siempre significa que la sintaxis HTML sea inválida.

<dl class="answer">
  <dt>¿Cuántos jobs has creado y qué nombre verá tu pareja en la PR?</dt>
  <dd></dd>
  <dt>¿Qué pasos utilizan uses y cuál utiliza run?</dt>
  <dd></dd>
  <dt>¿Por qué el runner necesita checkout aunque el proyecto ya exista en tu ordenador?</dt>
  <dd></dd>
</dl>

**6 · Publica la propuesta.** Comprueba con `git status` que sigues en `7-ci-html`, utilizando tu número real, y revisa los archivos modificados. Prepara los dos archivos nuevos:

```bash
git add .github/workflows/ci.yml .htmlvalidate.json
```

Si has corregido `index.html`, ejecuta también `git add index.html`; si corregiste otro HTML, añádelo por su ruta. Después revisa exactamente lo que vas a publicar y crea el commit:

```bash
git diff --cached
git commit -m "Anadir validacion automatica del HTML"
git push -u origin 7-ci-html
```

En GitHub, entra en el repositorio del portfolio y abre **Pull requests → New pull request**. Selecciona **base: main** y **compare: 7-ci-html**, con tu número real. Pulsa **Create pull request**, escribe un título como «Añadir validación automática del HTML» y explica en la descripción qué comando has ejecutado y qué resultado obtuviste. Incluye `Closes #7` con el número real de la issue y confirma la creación.

La propia PR que añade el workflow lo ejecuta. Para consultar el resultado:

1. En la PR, abre la pestaña **Checks** y selecciona **HTML válido**. También puedes desplegar las comprobaciones de **Conversation**, junto al área de fusión, y pulsar **Details** en ese check.
2. Si accedes desde el repositorio, abre **Actions**, selecciona **CI** y entra en la ejecución correspondiente a tu rama y a tu último commit. Dentro de ella, abre **HTML válido**.
3. Despliega **Descargar el repositorio**, **Preparar Node** y **Validar el HTML**. Además pueden aparecer pasos de preparación o limpieza añadidos automáticamente por GitHub.
4. Espera a que termine: pendiente o en ejecución todavía no significa correcto. Si termina con éxito, el check aparece en verde; si falla, abre el paso marcado como fallido y lee su registro de ejecución (*log*).

**Deja esta PR abierta y sin fusionar** para hacer las pruebas del bloque B. Copia su enlace: seguirás utilizando la misma PR después de cada corrección.

<details class="aside aside--extra">
  <summary>Repetir la comprobación: herramientas y versiones</summary>
  <p>Ahora que has visto la ejecución, observa que el workflow deja escritas las instrucciones para obtener el código, preparar las herramientas y ejecutar el validador. Esto facilita la <strong>reproducibilidad</strong>: repetir las comprobaciones sin depender de que alguien recuerde los pasos o tenga los programas preparados en su ordenador.</p>
  <p>No garantiza un entorno idéntico para siempre: <code>ubuntu-latest</code> puede actualizarse, <code>22</code> permite distintas actualizaciones de Node 22 y <code>@9</code> permite distintas actualizaciones de HTML-Validate 9. Si el resultado local y el de GitHub difieren, compara las versiones, la configuración, los archivos publicados y el sistema operativo.</p>
</details>

<details class="aside aside--help">
  <summary>Si el check no aparece o falla</summary>
  <ul>
    <li><strong>No aparece ninguna ejecución:</strong> comprueba que la PR esté abierta, que el archivo publicado se llame <code>.github/workflows/ci.yml</code> y que declare <code>pull_request</code>. En la pestaña <strong>Code</strong>, selecciona tu rama para comprobar que el archivo llegó a GitHub. Si Actions muestra una petición explícita de habilitación o autorización, atiende ese aviso.</li>
    <li><strong>Workflow no válido:</strong> revisa la línea señalada y la sangría del YAML. El trabajo puede no llegar a iniciarse si GitHub no puede interpretar el archivo.</li>
    <li><strong>Falla Preparar Node:</strong> comprueba <code>node-version: 22</code>. El validador todavía no se ha ejecutado.</li>
    <li><strong>Falla Validar el HTML:</strong> busca en el registro el archivo, la línea y la regla. Si el mensaje trata de red o descarga del paquete, distingue ese fallo de herramienta de un diagnóstico del HTML.</li>
    <li><strong>En local pasa y en GitHub falla:</strong> comprueba que hayas guardado, añadido al commit y subido la corrección. Compara también el comando, la versión y la configuración.</li>
  </ul>
  <p>Corrige sobre la misma rama, añade el archivo modificado, crea un commit y ejecuta <code>git push</code>. La PR se actualiza automáticamente. Volver a ejecutar un commit fallido sin publicar la corrección comprueba el mismo código anterior.</p>
</details>

#### Bloque B · Provocación controlada de fallos

Realiza las pruebas **una a una en la rama `7-ci-html`**, con la PR aún abierta. Antes de cada prueba, el check debe estar verde. Para que el diagnóstico sea claro, introduce solo el cambio indicado.

**1 · Provoca un error de cierre.** En `index.html`, cambia únicamente el cierre del encabezado principal de `</h1>` a `</h2>`. Guarda y publica:

Conserva el texto real de tu cabecera. La modificación afecta solo a la etiqueta de cierre:

```html
<!-- Antes -->
<h1>Nombre Apellido</h1>

<!-- Durante la prueba: cierre incorrecto -->
<h1>Nombre Apellido</h2>
```

No pegues las dos versiones en el archivo. El navegador puede seguir mostrando el título porque intenta recuperarse de ciertos errores; el validador comprobará el marcado escrito.

```bash
git add index.html
git commit -m "Probar deteccion de cierre HTML incorrecto"
git push
```

**2 · Localiza el fallo.** Abre la ejecución que corresponde a ese último commit, no una anterior. En el job `HTML válido`, abre el paso fallido **Validar el HTML**. Identifica la ruta, el número de línea, el mensaje y la regla. Contrasta la línea con tu editor; un error puede señalar el cierre inesperado o el elemento que quedó abierto.

Busca la ejecución con el mensaje «Probar deteccion de cierre HTML incorrecto» o compara su identificador de commit con `git log -1 --oneline` en tu terminal. La última línea del registro puede indicar que el proceso terminó con código `1`; la causa concreta está en los diagnósticos anteriores. Anota el enlace de esa ejecución y el mensaje que permite localizar el error.

**3 · Corrige y comprueba.** Restituye `</h1>`, guarda y ejecuta:

```bash
git add index.html
git commit -m "Restaurar cierre correcto del encabezado"
git push
```

Espera a que la nueva ejecución termine en verde. Los dos resultados quedan en el historial de Actions y permiten observar que el check detecta el fallo y reconoce su corrección.

**4 · Repite con otros dos tipos de fallo.** Aplica el mismo recorrido: cambio → guardar → commit → push → diagnóstico → corrección → nuevo commit y push → verde.

| Prueba | Cambio exacto | Qué observar | Cómo restaurar |
| --- | --- | --- | --- |
| Regla de calidad | Sustituye `<html lang="es">` por `<html>` en `index.html`. | El analizador informa de un atributo requerido aunque la página pueda verse igual. | Recupera `lang="es"`. |
| Entorno de ejecución | Cambia `node-version: 22` por `node-version: tururu` en `ci.yml`. | Falla **Preparar Node**; **Validar el HTML** no llega a ejecutarse. | Recupera `node-version: 22`. |

Para la segunda prueba, utiliza `git add .github/workflows/ci.yml` en lugar de `git add index.html`. Redacta mensajes que identifiquen cada prueba y su corrección. No desactives reglas del validador para obtener verde.

<div class="checkpoint">
  <p class="checkpoint-label">Resultado del diagnóstico</p>
  <p>Puedes localizar las ejecuciones fallidas, explicar qué cambiaste y señalar la ejecución final correcta. Distingues un error del documento de un fallo al preparar la herramienta que lo analiza.</p>
</div>

#### Bloque C · Conversión del check en requisito de fusión

**1 · Integra el workflow revisado.** Con todos los cambios de prueba corregidos y el check verde, solicita la revisión de tu pareja. Debe comprobar los archivos de configuración, ejecutar el validador en su copia y revisar las ejecuciones. Tras su aprobación, fusiona mediante **Squash and merge** y comprueba el despliegue de Pages.

Tu pareja debe utilizar la rama de esta PR, siguiendo el procedimiento de revisión de la sesión 2: su copia de `main` todavía no contiene el workflow nuevo. Antes de fusionar, revisa **Files changed** para confirmar que `index.html` conserva su cierre correcto y su atributo `lang`, y que `ci.yml` vuelve a utilizar Node 22. En el desplegable del botón de fusión, elige **Squash and merge** y confirma. Después entra en **Actions**: la ejecución de **CI** sobre `main` debe terminar correctamente y el workflow de Pages debe completar la publicación. Abre también la URL pública.

**2 · Exige el check en el portfolio.** Ahora configurarás la condición que impide fusionar si falla. En GitHub, abre el repositorio `portfolio`, no el tablero de Projects, y sigue estos pasos:

1. Abre **Settings** en la barra del repositorio. En el menú lateral, entra en **Rules → Rulesets**.
2. Abre **main protegida**, el ruleset creado en la sesión 2, y pulsa **Edit** si aparece ese botón. Si le diste otro nombre, abre el que protege `main`.
3. Comprueba **Enforcement status → Active** y que **Target branches** incluya la rama predeterminada `main`. Conserva las reglas que ya configuraste en la sesión 2.
4. En las reglas de la rama, marca **Require status checks to pass**. Pulsa **Add checks**, busca **HTML válido** y selecciónalo. Debe quedar en la lista de checks requeridos; escribirlo en el buscador sin seleccionarlo no lo añade.
5. Guarda los cambios con **Save changes**. Vuelve a abrir el ruleset y comprueba que **HTML válido** sigue en la lista.

Si no aparece en la búsqueda, vuelve a **Actions → CI** y comprueba que **HTML válido** haya terminado correctamente en la ejecución reciente de `main`. Después vuelve a abrir la configuración. Selecciona el check del job, no el nombre `CI` del workflow ni el despliegue de Pages. Puedes consultar la [documentación de GitHub sobre checks obligatorios](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-status-checks-to-pass-before-merging).

El backend no ejecuta este validador de HTML: no añadas allí este check obligatorio, porque quedaría esperando una comprobación que nunca se ejecuta.

**3 · Verifica el bloqueo.** Con la copia local limpia, prepara una rama de diagnóstico desde el nuevo `main`:

```bash
git switch main
git pull --ff-only
git switch -c prueba-bloqueo-html
```

Vuelve a cambiar `</h1>` por `</h2>` en `index.html` y publica la rama:

```bash
git add index.html
git commit -m "Comprobar bloqueo de HTML invalido"
git push -u origin prueba-bloqueo-html
```

Abre una PR de prueba hacia `main`, titulada «Comprobar bloqueo de HTML inválido», sin `Closes` para no vincularla a una tarea funcional. Espera al fallo y comprueba que GitHub impide fusionar por **HTML válido**. Si permite fusionar, revisa el ruleset y las excepciones; no pulses el botón de fusión.

En **Conversation**, junto al área de fusión, debe figurar el check requerido como fallido y un aviso de que la integración está bloqueada. Un icono rojo por sí solo no demuestra el bloqueo: debe impedirse la fusión por esa comprobación. Si tu cuenta puede omitir las reglas, revisa **Bypass list** en el ruleset y evita utilizar esa excepción durante la prueba. Anota el enlace de la PR y el motivo de bloqueo antes de cerrarla.

**4 · Cierra la prueba.** Pulsa **Close pull request**, sin fusionar, y **Delete branch** para borrar la rama remota de prueba. En local ejecuta `git switch main`: el error queda fuera de la versión integrada. La rama local de diagnóstico puede conservarse; no necesitas forzar su borrado.

Comprueba con `git status` que estás en `main` y no quedan cambios pendientes. Abre `index.html` en el editor: debe recuperar `</h1>`. Cambiar de rama actualiza los archivos locales; cerrar la PR en GitHub por sí solo no cambia la rama que tienes abierta en tu ordenador.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación del bloque C</p>
  <ul class="checklist">
    <li>El workflow corregido está integrado y su check es obligatorio en el portfolio.</li>
    <li>La PR de diagnóstico mostró el bloqueo y se cerró sin fusionar.</li>
    <li>Main y la página publicada conservan el HTML correcto.</li>
  </ul>
</div>

#### Bloque D · Mejora del portfolio con validación activa

**1 · Selecciona una tarea pendiente.** Conserva la cabecera creada en la sesión 2. Añade ahora una sección de presentación: un encabezado y un párrafo que expliquen tu perfil y el tipo de proyecto que estás construyendo. Si esa sección ya está terminada, elige otra mejora pendiente con un alcance equivalente. Especifica el resultado en su issue antes de editar.

**2 · Desarrolla sobre una nueva rama.** Repite el flujo de la sesión 2: `main` actualizada → rama con el número real → edición → comprobación local → commit → publicación → PR. No reutilices las ramas de diagnóstico ni rehagas la cabecera. Ejecuta también el comando de validación local del bloque A.

Por ejemplo, si la issue de presentación es la **8**, prepara la rama así; sustituye ese número por el real:

```bash
git switch main
git pull --ff-only
git switch -c 8-presentacion-personal
```

Edita `index.html`, guarda y ejecuta `npx --yes html-validate@9 "**/*.html"` desde la raíz. En PowerShell utiliza `npx.cmd` si lo necesitaste en el bloque A. Corrige los diagnósticos antes de continuar. Abre también el HTML local en el navegador para comprobar el texto y la disposición de la sección. Después publica:

```bash
git add index.html
git diff --cached
git commit -m "Anadir presentacion personal al portfolio"
git push -u origin 8-presentacion-personal
```

Si la mejora requiere otros archivos, revísalos y añádelos por su ruta antes del commit. Abre la PR con **base: main** y **compare: tu rama**, describe la mejora e incluye `Closes #8` con el número real. Los archivos del validador ya vienen de `main`: no necesitas crearlos de nuevo.

**3 · Integra y verifica.** En la PR comprueba **HTML válido**, solicita la revisión de tu pareja y atiende sus comentarios. Fusiona después de ambas comprobaciones. Espera al despliegue de Pages y verifica la mejora en la URL pública.

<div class="practice-levels">
  <div><strong>Objetivo esencial</strong><span>Workflow de HTML obligatorio, pruebas de fallo y recuperación realizadas, y una mejora del portfolio integrada con revisión y validación.</span></div>
  <div><strong>Consolidación</strong><span>Otra tarea pendiente con el mismo recorrido. Si añades navegación, enlaza únicamente secciones que ya existan.</span></div>
  <div><strong>Continuación</strong><span>Si puedes explicar el workflow y has verificado todo el recorrido, continúa con la validación de enlaces de la sesión 4.</span></div>
</div>

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

<div class="checkpoint">
  <p class="checkpoint-label">Resultados esperados de la sesión</p>
  <ul class="checklist">
    <li>El repositorio contiene la configuración del validador y el workflow CI, además del workflow de publicación.</li>
    <li>Puedes explicar los tres pasos del job y localizar un diagnóstico de HTML y un fallo de preparación de Node.</li>
    <li>HTML válido es obligatorio y has observado una PR bloqueada por su resultado.</li>
    <li>La última versión de main supera el check; las pruebas incorrectas no permanecen en el código integrado.</li>
    <li>Una mejora nueva del portfolio ha pasado revisión, validación y comprobación en la URL pública.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Autoevaluación</p>
  <ol>
    <li>¿Qué diferencia hay entre validar una PR y publicar el cambio?</li>
    <li>¿Qué aporta checkout y qué diferencia hay entre uses y run?</li>
    <li>¿Qué revisarías si el mismo comando funciona en CI pero falla en tu equipo?</li>
    <li>¿Qué condición convierte un check fallido en un bloqueo de la fusión?</li>
    <li>¿Qué debe seguir comprobando tu pareja aunque HTML válido esté verde?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · La validación analiza la propuesta antes de integrarla. La publicación de Pages sirve los archivos después de fusionar en main.</p>
  <p>2 · Checkout obtiene el código en el runner. Uses llama a una acción reutilizable; run ejecuta un comando.</p>
  <p>3 · Las versiones, el commit utilizado, los archivos de configuración, el directorio de ejecución y las diferencias del sistema operativo. El estado del runner no demuestra por sí solo la causa del fallo local.</p>
  <p>4 · Un ruleset activo que incluya la rama de destino y exija ese check, sin una excepción que permita saltarlo.</p>
  <p>5 · Que se cumplan los criterios de aceptación y que el cambio haga lo solicitado. El validador solo cubre las reglas configuradas.</p>
</details>

Conserva las tareas pendientes en el tablero. La sesión 4 ampliará este mismo workflow para comprobar enlaces y formato; no necesitas crear otro proyecto ni completar tareas adicionales fuera del aula para empezar.

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

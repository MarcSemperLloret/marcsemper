---
title: "Que lo compruebe la máquina"
label: "UD2 · Comprobar"
section: "ud-02"
order: 2
lang: "es"
summary: "Construir el portfolio de verdad haciendo entrar cada sección por pull request, y escribir un pipeline propio que valide HTML, formato, enlaces y accesibilidad, y que impida fusionar cuando algo de eso falla."
duration: "9 horas · 3 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Repositorio de GitHub, commit de cada sesión y enlaces a PR, CI y documentos comunes con Servidor."
date: "2026-09-09"
outcomes:
  - "Escribir un workflow de GitHub Actions desde cero y explicar qué lo dispara."
  - "Distinguir lo que puede comprobar una máquina de lo que solo puede comprobar una persona."
  - "Validar HTML, formato y enlaces de forma automática en cada pull request."
  - "Medir accesibilidad con Lighthouse y acordar un umbral por debajo del cual no se fusiona."
  - "Leer el registro de una ejecución fallida y localizar la línea que la provocó."
  - "Corregir un fallo de accesibilidad real y demostrar que el pipeline lo confirma."
requirements:
  - "El repositorio de la UD1, con la web publicada en Azure y main protegida."
  - "Vuestra pareja de revisión asignada."
priorKnowledge:
  - "El circuito de la UD1: issue, rama, pull request, revisión y fusión."
  - "HTML y CSS del módulo de Lenguaje de Marcas."
---

**Cómo preparar los documentos.** Redacta las fichas, registros y memorias en Word, LibreOffice o un documento en línea. Conserva el original editable y usa «Exportar» o «Descargar como PDF» para guardarlo con el nombre y en la carpeta indicados. Cuando se pida ampliar un documento, modifica ese mismo original y sustituye su PDF por la versión actualizada. Comprueba que los enlaces del PDF se puedan abrir. La entrega sigue siendo el enlace al repositorio de GitHub y al commit de la sesión, con el código y los PDF correspondientes. El `README.md` es la portada técnica del repositorio y se edita como texto; las fichas y memorias se entregan en PDF.

<p class="lead">Hasta ahora vuestro único check dice que los ficheros se subieron. No dice que la página esté bien escrita, ni que sus enlaces lleven a algún sitio, ni que se pueda usar con un lector de pantalla. En estas tres sesiones el portfolio se llena de contenido de verdad y, a la vez, se le pone debajo una red que avisa antes de que lo vea nadie.</p>

<div class="rule">
  <p class="rule-label">Las dos cosas ocurren a la vez</p>
  <p>Cada sesión tiene una parte de pipeline y una parte de portfolio, y no son independientes: la sección que escribís hoy tiene que pasar por la puerta que habéis montado hoy. Es la única forma de que el CI no se convierta en un adorno que alguien añadió una vez y nadie volvió a mirar.</p>
</div>

<div class="rule">
  <p class="rule-label">Sigue sin evaluarse vuestro diseño</p>
  <p>Con una excepción, y es deliberada: la accesibilidad. No porque sea bonita, sino porque es lo único de la interfaz que se puede medir con un número, sin depender de mi gusto ni del vuestro. Todo lo demás —la tipografía, los colores, la composición— se evalúa donde se enseña.</p>
</div>

## Sesión 3 · Vuestro primer workflow

**Punto de partida compartido.** Semana lectiva 3: sitúa este taller después de las sesiones 5–6 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-3). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Vuestra página se despliega en verde. ¿Qué significa exactamente ese verde?</li>
    <li>Si os dejáis una etiqueta sin cerrar, ¿quién os avisa hoy?</li>
    <li>¿Dónde se ejecuta un workflow de GitHub Actions: en vuestro ordenador o en otro sitio?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### El check que tenéis no comprueba nada

El workflow que escribió Azure hace una cosa: coge los ficheros y los sube. Si el HTML tiene etiquetas sin cerrar, si falta el texto alternativo de todas las imágenes, si tres enlaces del menú van a páginas que no existen, ese workflow sale **en verde igualmente**, porque la subida ha funcionado.

Es un check de despliegue, no de calidad. Y esa distinción es la que os va a acompañar el resto del ciclo:

<div class="compare-pair">
  <div>
    <p class="compare-label">Comprobación de despliegue</p>
    <p class="compare-body">¿Ha llegado el código a producción? Responde sí o no. No opina sobre lo que ha llegado.</p>
  </div>
  <div>
    <p class="compare-label">Comprobación de calidad</p>
    <p class="compare-body">¿Lo que va a llegar cumple lo que acordamos? Se ejecuta antes de fusionar, y su trabajo es impedir el paso.</p>
  </div>
</div>

Hoy escribís la segunda, y a partir de hoy la escribís vosotros: nadie os la va a generar.

#### Qué es un runner, y por qué eso explica casi todo

<p class="term">Runner</p>

Una máquina virtual limpia que GitHub crea para ejecutar vuestro workflow y destruye al terminar. No tiene vuestro proyecto, ni vuestras herramientas, ni vuestra configuración: empieza vacía cada vez.

De ahí salen las dos reglas que evitan el 90 % de los fallos de esta sesión:

| Regla | Consecuencia práctica |
| ----- | --------------------- |
| El runner no tiene vuestro código | El primer paso siempre es descargarlo, y eso es lo que hace <code>actions/checkout</code> |
| El runner no tiene vuestras herramientas | Todo lo que uséis se instala dentro del workflow. Que funcione en vuestro portátil no significa nada |

Y de ahí sale también la propiedad que hace útil todo esto: como la máquina empieza limpia, **si pasa allí, es reproducible en ese entorno documentado; otros entornos deben comprobarse**. Se acabó el «en mi ordenador funciona».

#### Anatomía de un workflow

Cuatro palabras y ya sabéis leer cualquiera:

<dl class="worked">
  <dt><code>on</code></dt>
  <dd>Qué lo dispara. En el vuestro va a ser: cada pull request, y cada cambio que entre en <code>main</code>.</dd>
  <dt><code>jobs</code></dt>
  <dd>Los trabajos que se hacen. Cada job corre en su propia máquina y, salvo que digáis lo contrario, todos a la vez. Cada job aparece como un check independiente en la pull request.</dd>
  <dt><code>steps</code></dt>
  <dd>Los pasos de un job, en orden. Si uno falla, el job se detiene ahí.</dd>
  <dt><code>uses</code> frente a <code>run</code></dt>
  <dd><code>uses</code> ejecuta una acción que ya existe, escrita por otra persona. <code>run</code> ejecuta un comando de terminal, exactamente el mismo que escribiríais vosotros.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Lo que se delega a una máquina y lo que no</p>
  <p>A la máquina se le da lo objetivo, lo repetible y lo aburrido: si el HTML es válido, si un enlace responde, si el formato es el acordado, si el contraste llega al mínimo. A la persona se le deja lo que exige criterio: si la sección se entiende, si el texto dice algo, si el cambio hace lo que pedía la issue. Confundir las dos cosas produce, o bien equipos que revisan comas a mano, o bien equipos que creen que un check verde significa que está bien.</p>
</div>

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Escribir el workflow

Antes de editar, prepara las herramientas de esta práctica. **Node.js** permite ejecutar herramientas JavaScript fuera del navegador; **npm** gestiona sus paquetes y **npx** ejecuta una herramienta del paquete indicado. Aquí se usan para revisar el HTML, no para implementar el backend. Comprueba `node --version` y `npm --version` en la terminal. Usa Node 22 como el workflow del ejemplo; si faltan, instala la versión preparada para el aula y abre una terminal nueva. En PowerShell, si la política impide ejecutar npm.ps1 o npx.ps1, utiliza `npm.cmd` y `npx.cmd`.

Trabaja en la raíz del repositorio del portfolio: allí crearás .htmlvalidate.json y .github/workflows/ci.yml. Los bloques de jobs de las sesiones siguientes se añaden bajo jobs en ese mismo archivo, no como workflows completos separados. Conserva el workflow de despliegue generado por Azure.

<p class="stage stage--solo">Individual, y por el circuito de siempre</p>

**1 · Issue y rama.** Abrid una issue titulada «Añadir un workflow de CI que valide el HTML», con este criterio de aceptación: *cada pull request muestra un check llamado HTML válido, y ese check falla si el HTML tiene errores*. Después, la rama de siempre.

```bash
git switch main
git pull
git switch -c 7-ci-html
```

**2 · La configuración del validador.** En la raíz, un fichero `.htmlvalidate.json`:

```json
{
  "extends": ["html-validate:recommended"]
}
```

Esa línea elige el conjunto de reglas. Sin ella, la herramienta no sabe con qué criterio juzgar vuestro HTML.

**3 · El workflow.** Cread `.github/workflows/ci.yml`. Junto al de Azure, no en su lugar: son dos cosas distintas y por eso son dos ficheros distintos.

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

**4 · Leedlo antes de subirlo.** Responded sin buscar en internet:

<dl class="answer">
  <dt>¿Cuántos jobs tiene y cómo se llama el check que va a aparecer?</dt>
  <dd></dd>
  <dt>¿Qué pasos usan una acción de otra persona y cuál ejecuta un comando vuestro?</dt>
  <dd></dd>
  <dt>Si quitáis el paso de checkout, ¿qué error daría y por qué?</dt>
  <dd></dd>
</dl>

**5 · Subir y abrir la pull request.**

```bash
git add .github/workflows/ci.yml .htmlvalidate.json
git commit -m "Anadir un workflow de CI que valida el HTML"
git push -u origin 7-ci-html
```

Abrid la pull request con `Closes #7`. Fijaos en algo que tiene gracia: **la propia pull request que añade el CI ya se comprueba con él**. Abajo aparecen ahora dos checks, el de Azure y el vuestro.

<details class="aside aside--help">
  <summary>Si el check aparece en rojo a la primera</summary>
  <p>Es lo más probable, y es una buena noticia: significa que está mirando de verdad. Abrid la ejecución en la pestaña <strong>Actions</strong>, entrad en el paso «Validar el HTML» y leed las líneas que empiezan por la ruta del fichero. Cada una trae el número de línea y la regla incumplida. Corregidlo en la misma rama, haced commit y push: el check se vuelve a ejecutar solo.</p>
</details>

#### Bloque B · Romperlo a propósito

<p class="stage stage--guided">Todos a la vez, sobre la misma rama</p>

Un pipeline en el que nunca habéis visto un fallo es un pipeline en el que no confiáis. Provocad estos tres, uno a uno, y mirad qué dice cada uno:

| Qué rompéis | Qué esperáis ver |
| ----------- | ---------------- |
| Cerrar mal una etiqueta de sección | Un error con el número de línea exacto |
| Quitar el atributo del idioma en la etiqueta raíz | Un error de regla, no de sintaxis: el HTML es válido pero incumple lo acordado |
| Cambiar <code>node-version</code> a <code>tururu</code> | Un fallo en un paso anterior: el job ni siquiera llega a validar |

<div class="rule">
  <p class="rule-label">Leer un fallo por abajo, no por arriba</p>
  <p>El registro de una ejecución es largo y casi todo es ruido. La información está en el paso marcado en rojo, y dentro de él, en las últimas líneas. Empezar a leer por el principio es la forma más rápida de perder veinte minutos en un error que estaba escrito en la línea final.</p>
</div>

Dejadlo arreglado y con el check en verde antes de seguir.

#### Bloque C · Convertirlo en puerta

<p class="stage stage--solo">Individual, en los ajustes del repositorio</p>

Un check que informa pero no impide nada acaba ignorado en noviembre. Vamos a hacerlo obligatorio.

1. Fusionad primero la pull request del bloque A, para que el check exista en `main`.
2. **Settings → Rules → Rulesets → main protegida → Edit**.
3. En **Require status checks to pass**, botón **Add checks**, y añadid **HTML válido** junto al de Azure que ya estaba.
4. Guardad.

Comprobadlo: abrid una rama nueva con un error de HTML deliberado, abrid la pull request y verificad que el botón de fusionar está bloqueado. Cerrad esa pull request sin fusionar.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación del bloque C</p>
  <ul class="checklist">
    <li>La pull request con HTML roto no se puede fusionar, y GitHub dice por qué.</li>
    <li>El check obligatorio se llama igual que el <code>name</code> del job.</li>
    <li>Vuestra rama de prueba está cerrada y borrada.</li>
  </ul>
</div>

#### Bloque D · El portfolio de verdad, primera sección

<p class="stage stage--solo">Individual, y ya con la red puesta</p>

Se acabó la página de tres líneas. Coged del tablero la issue de la cabecera y escribid la primera sección real, con estructura semántica: una cabecera con navegación, un contenido principal y un pie. Sin CSS todavía; hoy interesa que el documento esté bien construido.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La cabecera y una sección de presentación, entradas por pull request, con los dos checks en verde.</span></div>
  <div><strong>Si lo tenéis</strong><span>La navegación enlazando a las secciones que todavía no existen, anotadas como issues nuevas.</span></div>
  <div><strong>Reto</strong><span>Añadid al workflow un segundo job que compruebe que no hay ficheros con nombres en mayúsculas ni con espacios, usando un único comando <code>run</code>.</span></div>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 3.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-03.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-05.pdf` y `sesion-06.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Por qué el primer paso de casi todos los jobs es <code>actions/checkout</code>?</li>
    <li>¿Qué diferencia hay entre <code>uses</code> y <code>run</code>?</li>
    <li>Vuestro workflow pasa en el runner pero falla en el portátil de un compañero. ¿Cuál de los dos entornos es el que manda?</li>
    <li>¿Por qué un check que no bloquea acaba sirviendo de poco?</li>
    <li>¿Dónde se lee primero el motivo de un fallo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el runner es una máquina limpia que no tiene vuestro código hasta que alguien lo descarga.</p>
  <p>2 · <code>uses</code> ejecuta una acción ya escrita; <code>run</code> ejecuta un comando de terminal vuestro.</p>
  <p>3 · El runner. Es el entorno reproducible y limpio; el portátil tiene años de configuración encima que nadie más comparte.</p>
  <p>4 · Porque en cuanto hay prisa se ignora, y un aviso que se ignora es ruido. Lo que no bloquea, con el tiempo, no existe.</p>
  <p>5 · En el paso marcado en rojo, empezando por sus últimas líneas.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 4</p>
  <ul class="checklist">
    <li>Dos issues más del portfolio recorridas enteras fuera de clase, con los dos checks en verde.</li>
    <li>Una revisión dejada en el repositorio de vuestra pareja diciendo qué comprobasteis.</li>
    <li>Traéis la lista de enlaces externos que va a tener vuestro portfolio: GitHub, LinkedIn, correo, proyectos.</li>
  </ul>
</div>

## Sesión 4 · Enlaces rotos y formato

**Punto de partida compartido.** Semana lectiva 4: sitúa este taller después de las sesiones 7–8 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-4). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>¿Cuántos enlaces tiene ahora mismo vuestro portfolio y cuándo comprobasteis el último por última vez?</li>
    <li>Dos personas escriben el mismo HTML con sangrías distintas. ¿Quién tiene razón?</li>
    <li>Si un check falla por algo que en realidad está bien, ¿qué haríais?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Los dos fallos que delatan un portfolio junior

Un enlace muerto y un fichero con cuatro estilos de sangría distintos. Ninguno de los dos tiene que ver con saber programar, y los dos se ven en los primeros diez segundos.

Lo interesante es que ambos son **objetivos**: no hace falta criterio para decidir si un enlace responde o si un fichero sigue un formato. Por eso son trabajo de máquina, y por eso hoy dejan de ser cosa vuestra.

#### Un job, un check, un motivo

Vuestro workflow tiene un job. Hoy va a tener tres, y aquí hay una decisión de diseño que conviene entender:

<div class="compare-pair">
  <div>
    <p class="compare-label">Todo en un job</p>
    <p class="compare-body">Un solo check. Si falla, hay que abrir el registro para saber si fue el HTML, los enlaces o el formato. Y si falla el primer paso, los otros dos ni se ejecutan: arregláis uno y aparece el siguiente.</p>
  </div>
  <div>
    <p class="compare-label">Un job por comprobación</p>
    <p class="compare-body">Tres checks con nombre propio, ejecutándose a la vez. La pull request dice de un vistazo qué falla y qué no, y en una sola vuelta veis todos los problemas.</p>
  </div>
</div>

Los jobs de un workflow corren en paralelo salvo que digáis lo contrario. Tres jobs no tardan tres veces más: tardan lo que el más lento.

#### El formato deja de ser una opinión

<p class="term">Formateador</p>

Una herramienta que reescribe el código con un formato fijo. No se discute con ella: se acepta lo que hace. Su valor no está en que su estilo sea el mejor, sino en que **desaparece la discusión** y en que los cambios de una pull request son cambios de verdad, no reordenaciones de espacios.

En modo comprobación no toca nada: solo dice qué ficheros no están como deberían, y falla.

#### Cuando el CI se equivoca

Va a pasar, sobre todo con los enlaces: hay sitios que responden con un error a cualquier petición que no venga de un navegador, aunque el enlace sea perfectamente válido. Ante eso hay dos reacciones, y solo una es aceptable.

| Reacción | Qué provoca |
| -------- | ----------- |
| Quitar la comprobación, o dejar de exigirla | El pipeline deja de proteger nada, y nadie se acuerda de volver a activarlo |
| Configurar la excepción, con su motivo escrito | La comprobación sigue viva, la excepción es explícita y se puede revisar |

Un pipeline al que se le van desactivando reglas cada vez que molesta acaba siendo un fichero decorativo. Las excepciones se escriben y se justifican.

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · El job de enlaces

<p class="stage stage--solo">Individual, issue y rama primero</p>

Añadid este job a `.github/workflows/ci.yml`, al mismo nivel que el que ya tenéis:

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

Ojo a la sangría: `enlaces` va con dos espacios, alineado con `html`. Si lo ponéis más adentro se convierte en parte del job anterior y el workflow deja de ser válido.

Abrid la pull request y mirad el resultado. Casi seguro que os saca algún enlace del menú que apunta a una sección que aún no existe: eso **no es un falso positivo**, es exactamente lo que queríais que os dijera.

<details class="aside aside--help">
  <summary>Si un enlace externo falla y sabéis que funciona</summary>
  <p>Comprobadlo primero en el navegador. Si de verdad abre, es de los que rechazan las peticiones automáticas. Excluidlo añadiendo su dirección al argumento <code>--exclude</code>, y escribid en la descripción de la pull request por qué lo habéis excluido. Un enlace excluido sin explicación es un enlace que dentro de dos meses nadie sabe si está vivo.</p>
</details>

#### Bloque B · El job de formato

<p class="stage stage--solo">Individual, en la misma rama o en otra</p>

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

Este va a fallar la primera vez, y con razón. Arregladlo desde vuestro ordenador con el mismo comando en modo escritura:

```bash
npx --yes prettier@3 --write "**/*.{html,css,json,md}"
```

Mirad el diff antes de hacer commit: es la primera vez que veis a una herramienta reescribiendo vuestro código, y conviene saber qué ha tocado.

<div class="rule">
  <p class="rule-label">Este commit va solo</p>
  <p>Un reformateo toca muchas líneas sin cambiar nada de lo que la página hace. Si lo mezcláis con la sección que estabais escribiendo, quien revise tiene que buscar vuestro cambio entre trescientas líneas de sangría movida. Commit aparte, con mensaje claro: «Aplicar el formato de Prettier a todo el proyecto».</p>
</div>

#### Bloque C · Las dos puertas nuevas

<p class="stage stage--solo">Individual, después de fusionar</p>

Igual que en la sesión anterior: fusionad, y después **Settings → Rules → Rulesets → main protegida → Edit → Require status checks**, y añadid **Enlaces vivos** y **Formato**. Cuatro checks obligatorios ahora.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación del bloque C</p>
  <ul class="checklist">
    <li>Una pull request muestra cuatro checks con nombres legibles.</li>
    <li>Los cuatro son obligatorios en el ruleset.</li>
    <li>Sabéis decir, sin abrir el registro, cuál de los cuatro ha fallado.</li>
  </ul>
</div>

#### Bloque D · La sección de proyectos

<p class="stage stage--solo">Individual, con enlaces de verdad</p>

Escribid la sección de proyectos del portfolio. De momento tendrá una sola ficha, la de este mismo portfolio: qué es, cómo está hecho, enlace al repositorio y enlace a la web publicada. Es el primer proyecto que podéis enseñar, y es este.

Añadid también los enlaces externos que traíais: GitHub, LinkedIn si lo tenéis, correo de contacto. El job de enlaces os dirá cuáles están mal escritos antes de que lo vea nadie.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La sección de proyectos con una ficha y los enlaces externos, todo con los cuatro checks en verde.</span></div>
  <div><strong>Si lo tenéis</strong><span>Los estilos base del portfolio, en un commit propio y en su propia pull request.</span></div>
  <div><strong>Reto</strong><span>Haced que el job de enlaces se ejecute también una vez por semana sin que nadie abra una pull request, para enteraros de los enlaces que se mueren solos. Pista: <code>on</code> admite <code>schedule</code>.</span></div>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 4.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-04.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-07.pdf` y `sesion-08.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Por qué tres jobs y no tres pasos dentro de un job?</li>
    <li>¿Tardan tres jobs el triple que uno?</li>
    <li>Un enlace externo falla en el CI pero abre bien en vuestro navegador. ¿Qué hacéis, y qué no hacéis?</li>
    <li>¿Por qué el reformateo va en un commit aparte?</li>
    <li>¿Qué gana un equipo al usar un formateador, si su estilo no es mejor que el vuestro?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para que cada comprobación tenga su propio check con nombre, y para verlas todas fallar en la misma vuelta en lugar de una detrás de otra.</p>
  <p>2 · No: corren en paralelo, así que tardan lo que el más lento.</p>
  <p>3 · Se excluye ese enlace concreto explicando por qué en la pull request. Lo que no se hace es quitar la comprobación o dejar de exigirla.</p>
  <p>4 · Porque mueve muchas líneas sin cambiar el comportamiento, y mezclado con otro cambio hace la revisión imposible.</p>
  <p>5 · Que desaparece la discusión y que los diffs solo contienen cambios reales.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 5</p>
  <ul class="checklist">
    <li>El portfolio tiene ya cabecera, presentación y proyectos, todo entrado por pull request.</li>
    <li>Los cuatro checks están en verde en <code>main</code>.</li>
    <li>Traéis una imagen vuestra o del proyecto, en el repositorio. En la sesión 5 se va a hablar mucho de ella.</li>
  </ul>
</div>

## Sesión 5 · El presupuesto de calidad

**Punto de partida compartido.** Semana lectiva 5: sitúa este taller después de las sesiones 9–10 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-5). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Una web «funciona». ¿Se puede decir con un número cuánto de bien funciona?</li>
    <li>¿Cómo usaría vuestro portfolio alguien que no ve la pantalla?</li>
    <li>Si os pusiera una nota mínima de accesibilidad, ¿creéis que vuestra página la pasaría hoy?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### De «funciona» a «cuánto de bien»

Vuestras cuatro puertas responden sí o no. Falta la pregunta que un cliente hace siempre y que hasta ahora nadie os ha obligado a responder: **cuánto de bien**.

<p class="term">Lighthouse</p>

Una herramienta que abre vuestra página como lo haría un navegador, la audita y devuelve cuatro puntuaciones de 0 a 100: rendimiento, accesibilidad, buenas prácticas y SEO. Junto con cada puntuación da la lista de lo que la ha bajado, con la línea concreta.

#### Presupuesto: el número que se acuerda antes

<p class="term">Presupuesto de calidad</p>

Un mínimo pactado por adelantado. Por debajo de él no se fusiona. Que sea un número y que esté escrito en un fichero es lo que impide la conversación de siempre: «bueno, ya lo miraremos más adelante».

El nuestro, para el portfolio:

| Categoría | Mínimo | Por qué ese |
| --------- | ------ | ----------- |
| Accesibilidad | 90 | Es alcanzable en una web estática, y por debajo hay barreras reales |
| SEO | 90 | Un portfolio que no se puede encontrar no sirve de nada |
| Buenas prácticas | 90 | Casi todo lo que mide aquí son errores que no cuestan nada evitar |
| Rendimiento | aviso | Depende mucho de la máquina que ejecuta la medición; informa, pero no bloquea |

#### Por qué la accesibilidad sí se evalúa aquí

Dije en la UD1 que el diseño no se evaluaba en este módulo, y lo mantengo. La accesibilidad es distinta por tres razones: **es objetiva** —se mide con un número, no con mi gusto—, **es obligatoria por ley** en cualquier producto que hagáis para una administración pública, y casi todo lo que la baja son descuidos de treinta segundos.

<dl class="worked">
  <dt>Una imagen sin texto alternativo</dt>
  <dd>Quien usa un lector de pantalla oye «imagen» y nada más. Coste de arreglarlo: un atributo.</dd>
  <dt>El idioma del documento sin declarar</dt>
  <dd>El lector de pantalla lee vuestro español con fonética inglesa. Coste: un atributo.</dd>
  <dt>Un enlace que pone «aquí»</dt>
  <dd>Quien navega saltando de enlace en enlace oye «aquí, aquí, aquí». Coste: reescribir tres palabras.</dd>
  <dt>Texto gris claro sobre fondo blanco</dt>
  <dd>Ilegible con luz de sol o con baja visión. Coste: cambiar un color.</dd>
  <dt>Saltar de un encabezado de nivel 1 a uno de nivel 3</dt>
  <dd>El índice del documento queda roto para quien lo navega por encabezados. Coste: cambiar un número.</dd>
</dl>

Ninguno de los cinco es una cuestión de gusto, y los cinco los detecta la máquina.

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Medir antes de tocar nada

<p class="stage stage--solo">Individual, en vuestro navegador</p>

Antes de automatizarlo, vedlo una vez a mano. Abrid vuestro portfolio publicado, herramientas de desarrollo, pestaña **Lighthouse**, modo escritorio, y **Analizar**.

Anotad las cuatro puntuaciones tal cual salgan, sin arreglar nada todavía. Son vuestro punto de partida y las vais a comparar al final de la sesión.

<dl class="answer">
  <dt>Rendimiento / Accesibilidad / Buenas prácticas / SEO</dt>
  <dd></dd>
  <dt>Los tres problemas que Lighthouse pone más arriba en accesibilidad</dt>
  <dd></dd>
</dl>

#### Bloque B · El presupuesto, en un fichero

<p class="stage stage--solo">Individual, issue y rama primero</p>

**1 · La configuración.** En la raíz, `lighthouserc.json`:

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

`staticDistDir` le dice que vuestra web son ficheros sueltos en esa carpeta: los sirve él mismo, así que no hace falta que la página esté desplegada para medirla. `error` bloquea; `warn` solo informa.

**2 · El job.** Al `ci.yml`, al mismo nivel que los otros tres:

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

**3 · Abrid la pull request y esperad.** Este job tarda más que los otros: está abriendo vuestra página en un navegador de verdad. Cuando termine, entrad en la ejecución y descargad el informe desde la sección de artefactos: es el mismo que visteis en el navegador, pero generado en una máquina limpia.

#### Bloque C · Arreglar lo que ha salido

<p class="stage stage--guided">Individual, y en voz alta cuando alguien encuentre algo que le pase a más gente</p>

Ahora la parte que de verdad importa. Id por la lista de accesibilidad del informe, de arriba abajo, y arreglad. Estos son los cinco que salen en casi todos los portfolios; los tenéis explicados arriba:

<ul class="checklist">
  <li>Imágenes sin texto alternativo. Si la imagen es decorativa, el atributo va vacío, pero va.</li>
  <li>El idioma sin declarar en la etiqueta raíz del documento.</li>
  <li>Enlaces cuyo texto no dice adónde llevan.</li>
  <li>Contraste insuficiente entre el texto y su fondo.</li>
  <li>Encabezados que se saltan un nivel.</li>
</ul>

Cada arreglo, su commit. Y cuando el informe deje de quejarse, volved a pasar Lighthouse en el navegador y comparad con lo que anotasteis en el bloque A.

<div class="rule">
  <p class="rule-label">El umbral se sube ahora, no al final</p>
  <p>Si vuestra accesibilidad ha quedado en 96, subid el mínimo del fichero a 95 y fusionad ese cambio. Lo que se consigue se protege: si el umbral se queda en 90, dentro de tres semanas alguien mete una imagen sin texto alternativo, baja a 92 y nadie se entera. Un presupuesto que va por detrás de la realidad no defiende nada.</p>
</div>

#### Bloque D · Cerrar el primer proyecto

<p class="stage stage--solo">Individual, la última pull request de la semana</p>

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <ul class="checklist">
    <li>Portfolio con cabecera, presentación, proyectos y contacto, publicado y con estilos propios.</li>
    <li>Un <code>ci.yml</code> escrito por vosotros con cuatro jobs: HTML, enlaces, formato y calidad.</li>
    <li>Los cinco checks —los cuatro vuestros y el de Azure— obligatorios en el ruleset.</li>
    <li>Accesibilidad por encima de 90, con el umbral del fichero puesto en lo que habéis conseguido.</li>
    <li>Todo el contenido de estas tres semanas entrado por pull request, ninguna fusionada sin revisión de vuestra pareja.</li>
  </ul>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Los cuatro jobs en verde y el portfolio publicado con contenido real.</span></div>
  <div><strong>Si lo tenéis</strong><span>El umbral de accesibilidad subido a lo que habéis alcanzado y defendido en la descripción de la pull request.</span></div>
  <div><strong>Reto</strong><span>Añadid al presupuesto una aserción sobre el peso total de la página y descubrid cuál de vuestras imágenes se lo come entero.</span></div>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 5.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-05.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-09.pdf` y `sesion-10.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre un check que dice sí o no y un presupuesto de calidad?</li>
    <li>¿Por qué la accesibilidad sí se evalúa en este módulo y la tipografía no?</li>
    <li>¿Por qué el rendimiento avisa en vez de bloquear?</li>
    <li>Habéis subido a 96. ¿Por qué hay que tocar el fichero?</li>
    <li>¿Para qué sirve <code>staticDistDir</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El primero comprueba una condición binaria; el segundo mide y compara con un mínimo acordado por adelantado.</p>
  <p>2 · Porque es objetiva, medible y obligatoria por ley en el sector público. La tipografía es criterio, y el criterio se evalúa donde se enseña.</p>
  <p>3 · Porque la puntuación depende mucho de la máquina que ejecuta la medición, y bloquearía por motivos ajenos a vuestro código.</p>
  <p>4 · Porque lo que no se protege se pierde: con el umbral en 90 se puede empeorar veinte veces sin que nadie se entere.</p>
  <p>5 · Le dice a Lighthouse que sirva él mismo los ficheros de esa carpeta, así que se puede auditar la web sin haberla desplegado.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 6</p>
  <ul class="checklist">
    <li>Los cinco checks en verde en <code>main</code> y el portfolio publicado con todo lo de esta unidad.</li>
    <li>Cuatro revisiones vuestras en el repositorio de vuestra pareja a lo largo de estas tres semanas.</li>
    <li>Traéis anotado qué le enseñaríais a alguien que abre vuestro repositorio sin conoceros: en la sesión 6 se escribe el README y se publica la primera versión con nombre.</li>
  </ul>
</div>

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Las puertas del portfolio, y quién las vigila</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Azure</span>¿Ha subido? Es un check de despliegue, no dice nada de la calidad.</li>
    <li><span class="flow-role">HTML válido</span>¿El documento está bien construido? Máquina.</li>
    <li><span class="flow-role">Enlaces vivos</span>¿Todos los enlaces llevan a algún sitio? Máquina.</li>
    <li><span class="flow-role">Formato</span>¿El código sigue el formato acordado? Máquina.</li>
    <li><span class="flow-role">Calidad</span>¿Llega al mínimo de accesibilidad y SEO? Máquina, con un número pactado.</li>
    <li><span class="flow-role">Revisión</span>¿Hace lo que la issue pedía y se entiende? Persona. Ninguna máquina puede responder esto.</li>
  </ol>
</figure>

| Idea | Por qué |
| ---- | ------- |
| **El runner empieza en un entorno limpio para el job** | Por eso hay que descargar el código e instalar las herramientas dentro. Y por eso, si pasa allí, es reproducible en ese entorno documentado; otros entornos deben comprobarse |
| **Un job, un check, un motivo** | Se ve de un vistazo qué ha fallado, y todos los fallos aparecen en la misma vuelta |
| **Lo que no bloquea, acaba ignorado** | Una comprobación que solo informa desaparece en cuanto hay prisa |
| **Las excepciones se escriben** | Un pipeline al que se le desactivan reglas cuando molestan deja de proteger nada |
| **El umbral se sube al conseguirlo** | Un presupuesto por debajo de la realidad permite empeorar sin que salte ninguna alarma |

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Runner | Máquina limpia que GitHub crea para ejecutar un workflow y destruye al acabar |
| Job | Un trabajo dentro del workflow. Corre en su propia máquina, en paralelo con los demás, y aparece como un check propio |
| Step | Un paso de un job, en orden. <code>uses</code> ejecuta una acción ajena; <code>run</code>, un comando vuestro |
| Integración continua | Comprobar automáticamente cada cambio antes de incorporarlo, en lugar de descubrir los problemas al final |
| Formateador | Herramienta que impone un formato fijo. En modo comprobación no toca nada: informa y falla |
| Lighthouse | Auditoría automática de una página: rendimiento, accesibilidad, buenas prácticas y SEO, de 0 a 100 |
| Presupuesto de calidad | Mínimo acordado por adelantado y escrito en un fichero. Por debajo, no se fusiona |
| Falso positivo | Un fallo del CI sobre algo que en realidad está bien. Se resuelve configurando la excepción y explicándola, nunca apagando la comprobación |

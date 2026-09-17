---
title: "Poner el circuito en marcha"
label: "UD1 · Arrancar"
section: "ud-01"
order: 1
lang: "es"
summary: "Preparar una URL de presentación y el flujo de integración continua de issues, ramas, revisión y despliegue, preparando el método que aplicarás al backend de Servidor."
duration: "6 horas · 2 semanas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Portfolio publicado y flujo de integración continua de issues, ramas y revisión de cambios en funcionamiento."
date: "2026-09-09"
outcomes:
  - "Explicar qué evalúa este módulo y qué evalúa Desarrollo Web en Entorno Servidor sobre el mismo código."
  - "Publicar un sitio estático con GitHub Pages y el workflow de GitHub Actions que lo despliega."
  - "Leer el workflow de GitHub Actions que genera el despliegue y decir qué lo dispara."
  - "Trabajar el ciclo completo: issue, rama, commit, pull request, revisión, fusión y despliegue."
  - "Proteger la rama principal, comprobar el rechazo de envíos directos y explicar qué condiciones exige la configuración."
requirements:
  - "Cuenta de GitHub con el correo del centro añadido."
  - "Git instalado y configurado con tu nombre y tu correo."
  - "Un editor de código."
priorKnowledge:
  - "Fundamentos de Git: clonar, hacer commit y subir cambios."
  - "HTML mínimo: un documento que abre en el navegador."
---

<p class="lead">Publicarás un portfolio bajo una URL pública y practicarás cómo organizar tareas, desarrollar en ramas y revisar cambios antes de fusionarlos. La protección inicial exigirá una pull request para modificar main; la validación automática del HTML se incorporará en la sesión 3.</p>

<div class="rule">
  <p class="rule-label">Enfoque de evaluación: metodología sobre diseño</p>
  <p>Durante estas primeras semanas el contenido y la maquetación visual del portfolio se mantendrán deliberadamente mínimos. La evaluación de este módulo no juzga el diseño gráfico ni la estética de la interfaz (aspectos evaluados en Lenguaje de Marcas y Diseño de Interfaces Web), sino <strong>el rigor metodológico y la ingeniería del proceso</strong>: la descomposición de requisitos en <em>issues</em> atómicas, la gestión de ramas de funcionalidad, la revisión formal de cambios mediante <em>pull requests</em>, la automatización del despliegue y la trazabilidad de un historial de desarrollo constante y verificable.</p>
</div>

<div class="rule">
  <p class="rule-label">Coordinación intermodular: producto y escaparate</p>
  <p>En Desarrollo Web en Entorno Servidor diseñarás e implementarás una aplicación backend completa orientada a un servicio CRUD, cuyo repositorio mantendrás a lo largo de todo el curso académico. El portfolio que inicias en este módulo constituye el escaparate público y la plataforma de despliegue de ese producto. A final del trimestre se presentará una entrega integrada entre ambos módulos: en Servidor se evaluará la arquitectura, la persistencia y la corrección técnica del código; en Proyecto Intermodular se evaluará el ciclo de vida, la calidad del flujo de integración y la reproducibilidad del despliegue.</p>
</div>

## Sesión 1 · Del repositorio vacío a una URL pública

**Antes de empezar.** En esta primera sesión crearás la estructura inicial del portfolio profesional y configurarás su flujo de despliegue automatizado. Para ello necesitarás tu cuenta de GitHub institucional, el cliente de Git configurado en tu entorno local y un editor de código. El backend se desarrollará en paralelo en el módulo de Servidor; para este taller basta con un documento HTML base que permita validar el canal de entrega continua.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Evaluación inicial · sin apuntes</p>
  <ol>
    <li>Cuando envías un cambio mediante <code>git push</code> a un repositorio remoto, ¿qué mecanismo comprueba la integridad del código antes de que quede publicado en producción?</li>
    <li>¿Qué infraestructura y protocolo hacen posible que un documento HTML almacenado en un repositorio se sirva públicamente a través de una URL?</li>
    <li>Si eliminas o corrompes por error un archivo imprescindible en tu proyecto y subes el cambio, ¿qué barrera técnica impide que la versión pública quede inutilizada?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación conceptual y demostración técnica</p>

#### Criterios de evaluación técnica entre módulos

Ambos módulos se imparten de forma coordinada. En Desarrollo Web en Entorno Servidor se diseña, implementa y prueba la lógica de negocio y los servicios de la aplicación; en Proyecto Intermodular se aprende a planificar, revisar, validar y desplegar ese trabajo siguiendo metodologías profesionales de ingeniería del software. Cada herramienta del flujo de automatización se introduce y analiza antes de su aplicación práctica.

La consecuencia directa es que el mismo proyecto es auditado desde dos dimensiones complementarias:

| Dimensión evaluada en **Servidor** | Dimensión evaluada en **Proyecto Intermodular** |
| ---------------------------------- | ----------------------------------------------- |
| Arquitectura interna y separación de responsabilidades | Descomposición del trabajo en tareas técnicas comprobables (<em>issues</em>) |
| Modelo relacional, persistencia y consultas eficientes | Gestión de ramas de funcionalidad y trazabilidad de cambios |
| Validación de entradas y gestión coherente de excepciones | Revisión formal por pares (<em>code review</em>) previa a la fusión |
| Cobertura de pruebas unitarias y de integración | Automatización del pipeline de integración y despliegue continuo (CI/CD) |
| Cumplimiento de especificaciones y lógica de negocio | Registro histórico de trabajo continuo y distribuido en el tiempo |

Un proyecto puede presentar una interfaz atractiva o un backend avanzado y, sin embargo, no superar este módulo si carece de metodología, control de versiones o revisiones de código. De igual forma, una implementación inicial sencilla con un flujo de integración impecable y rigurosamente documentado obtiene la máxima calificación.

<div class="rule">
  <p class="rule-label">Trazabilidad y constancia en el desarrollo</p>
  <p>En el desarrollo profesional de software, el valor del repositorio reside en la trazabilidad inmutable de su evolución temporal. La planificación y el avance no pueden concentrarse de manera artificial antes de una entrega. Los registros de <em>issues</em>, <em>commits</em>, revisiones y ejecuciones de GitHub Actions incorporan marcas temporales auditables que certifican la constancia del trabajo. No se evalúa el volumen bruto de <em>commits</em>, sino la distribución temporal del esfuerzo, la coherencia de las iteraciones y la autoría de cada aportación.</p>
</div>

#### El flujo de trabajo profesional: del requisito a producción

Durante todo el ciclo de desarrollo, cualquier modificación en el software debe seguir un flujo riguroso compuesto por siete etapas secuenciales. En esta sesión se establece la base del despliegue automatizado; en la siguiente se protegerá la rama principal y se practicará el flujo colaborativo, y en la sesión 3 se incorporarán las pruebas automatizadas de validación estática:

<figure class="diagram">
  <figcaption>Flujo de integración y entrega continua (Feature Branch Workflow)</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Issue</span>Definición clara de un requisito o tarea técnica con criterios de aceptación explícitos.</li>
    <li><span class="flow-role">Rama de funcionalidad</span>Línea de desarrollo aislada que permite trabajar y experimentar sin alterar la versión estable de producción.</li>
    <li><span class="flow-role">Commit atómico</span>Registro de un cambio autocontenido y justificado mediante un mensaje descriptivo en modo imperativo.</li>
    <li><span class="flow-role">Pull request</span>Propuesta formal de integración para auditar las diferencias de código e iniciar el proceso de validación.</li>
    <li><span class="flow-role">Validación automática (CI)</span>Ejecución desasistida de pruebas, analizadores de código y comprobaciones de integridad en GitHub Actions. <em>(Se incorpora en la sesión 3).</em></li>
    <li><span class="flow-role">Revisión por pares</span>Inspección manual del código por parte de otro miembro del equipo, quien aprueba o solicita modificaciones.</li>
    <li><span class="flow-role">Despliegue continuo (CD)</span>Tras la fusión autorizada en la rama principal, el pipeline publica automáticamente la nueva versión en el entorno público.</li>
  </ol>
</figure>

<p class="term">Flujo de integración continua (Pipeline)</p>

El protocolo estandarizado e inmutable que recorre cualquier cambio de código desde su formulación hasta su puesta en producción. Se define como un proceso cerrado porque no admite excepciones manuales ni atajos: si un cambio pudiera llegar a producción sin superar las validaciones y revisiones establecidas, el equipo carecería de una política de calidad real, dependiendo de la falibilidad de la intervención humana.

#### Justificación del despliegue temprano: patrón Walking Skeleton

Un enfoque intuitivo pero erróneo consiste en postergar el despliegue del software hasta disponer de una interfaz avanzada y un backend completo. En ingeniería del software se adopta el principio contrario: la implantación temprana de un **Walking Skeleton** (esqueleto funcional mínimo).

La experiencia demuestra que la mayoría de incidencias críticas en un despliegue no proceden de la lógica del código fuente, sino de la infraestructura subyacente: errores de configuración de red, permisos de acceso insuficientes, variables de entorno mal declaradas, conflictos de nombres de dominio o directivas de empaquetado incorrectas.

Resolver estas fricciones de infraestructura desde la primera sesión con un documento elemental garantiza aislar los problemas de configuración de los problemas de lógica de aplicación, aplicando el principio fundamental de **fallo temprano (fail-early)**.

<div class="compare-pair">
  <div>
    <p class="compare-label">Despliegue diferido al final</p>
    <p class="compare-body">Los fallos de infraestructura, credenciales y empaquetado emergen simultáneamente junto con las incidencias propias del código, en una fase avanzada y con escaso margen de resolución. Este patrón suele comprometer la entrega final del proyecto.</p>
  </div>
  <div>
    <p class="compare-label">Despliegue continuo desde el inicio (Walking Skeleton)</p>
    <p class="compare-body">Las incidencias de configuración y entorno se aíslan, diagnostican y resuelven sobre una base controlada. A partir de ese momento, cada integración avanza de forma predecible y el despliegue se convierte en un proceso rutinario y desatendido.</p>
  </div>
</div>

#### Infraestructura de alojamiento y automatización con GitHub Pages

<p class="term">GitHub Pages y Actions</p>

GitHub Pages es un servicio de alojamiento para sitios web estáticos (HTML, CSS y JavaScript) que se sirve directamente desde un repositorio de Git. En lugar de limitarse a una copia pasiva de archivos, la configuración profesional de GitHub Pages se gestiona mediante <strong>GitHub Actions</strong>, integrando Infraestructura como Código (IaC). Cada evento de integración en la rama principal desencadena la ejecución de un flujo de trabajo declarativo que empaqueta y publica el contenido de forma automatizada.

<div class="rule">
  <p class="rule-label">Selección de plataforma e independencia tecnológica</p>
  <p>Este mismo flujo de publicación declarativa es extrapolable a plataformas como Microsoft Azure Static Web Apps, Cloudflare Pages o AWS S3/CloudFront. Se utiliza GitHub Pages en esta fase introductoria para operar de forma inmediata en el mismo entorno de control de versiones sin introducir demoras administrativas en la provisión de cuentas de terceros. Los principios arquitectónicos aprendidos (definición declarativa de despliegue, eventos de disparo y automatización por pipeline) son idénticos en cualquier proveedor <em>cloud</em> profesional.</p>
</div>

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo práctico guiado sobre el proyecto base</p>

#### Bloque A · Creación del repositorio y estructura inicial

<p class="stage stage--solo">Trabajo individual. Este repositorio constituirá la base permanente de tu portfolio profesional.</p>

**1 · Creación del repositorio en GitHub.** Accede a github.com y selecciona **New repository** (o el icono «+» superior derecho).

| Parámetro | Valor requerido | Justificación técnica |
| --------- | --------------- | --------------------- |
| Repository name | <code>portfolio</code> | Nombre conciso y semántico. La dirección final ya contendrá tu nombre de usuario. |
| Description | Descripción profesional breve | Visible en el perfil de GitHub y metadatos del proyecto. |
| Visibilidad | **Public** | Requisito técnico: las políticas de protección de ramas y reglas de CI son gratuitas en repositorios públicos. |
| Add a README file | **Activado** | Inicializa la rama principal con un commit base para permitir la clonación inmediata. |
| .gitignore | Ninguno | En esta fase no se generan artefactos ni binarios que requieran ser ignorados. |
| License | **MIT License** | Licencia de código abierto estándar para proyectos académicos y profesionales abiertos. |

**2 · Clonación en el entorno local.** En la interfaz del repositorio, pulsa el botón **Code**, copia la URL bajo la pestaña HTTPS y ejecuta en tu terminal de trabajo:

```bash
git clone https://github.com/TU-USUARIO/portfolio.git
cd portfolio
```

**3 · Creación del documento HTML inicial de verificación.** Crea el archivo `index.html` en la raíz del repositorio con una estructura HTML5 válida y mínima. Su función técnica es servir de comprobante para certificar que el servidor web entrega correctamente los archivos:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Portfolio de Nombre Apellido</title>
  </head>
  <body>
    <h1>Nombre Apellido</h1>
    <p>Documento inicial para verificar la automatización del despliegue continuo.</p>
  </body>
</html>
```

En esta fase inicial es prioritario no añadir hojas de estilo ni scripts complejos. El propósito del ejercicio es validar la publicación. En la sesión 2 comenzarás a ampliar el contenido mediante ramas y revisiones; en la 3 añadirás la validación automática del HTML.

**4 · Registro y envío del cambio al repositorio remoto.**

```bash
git add index.html
git commit -m "Anadir estructura inicial del documento index.html"
git push
```

**5 · Estándares profesionales para mensajes de commit.** A partir de este momento, los mensajes de confirmación deben ajustarse rigurosamente a las convenciones estándar de la industria:

| Criterio | Práctica incorrecta | Estándar recomendado |
| -------- | ------------------- | -------------------- |
| **Modo imperativo** | «cambios», «actualizado», «subiendo código» | «Anadir seccion de proyectos en el inicio» |
| **Longitud máxima (72 caracteres)** | Descripciones excesivamente extensas en una sola línea | Una frase breve, clara y sintética |
| **Atomicidad (un cambio lógico)** | «Cabecera, estilos, enlaces y correcciones varias» | Dividir en confirmaciones independientes y específicas |

<div class="rule">
  <p class="rule-label">Codificación de caracteres en mensajes de Git</p>
  <p>Por compatibilidad multiplataforma y para prevenir discrepancias de codificación entre terminales locales (donde configuraciones como CP850 o Windows-1252 pueden generar caracteres corruptos o <em>mojibake</em> en interfaces remotas como GitHub), es habitual redactar mensajes breves sin caracteres diacríticos o bien asegurarse de que el cliente de Git tenga configurada la codificación UTF-8 de forma global mediante <code>git config --global i18n.commitEncoding utf-8</code>.</p>
</div>

<details class="aside aside--help">
  <summary>Resolución de incidencias de autenticación en <code>git push</code></summary>
  <p>GitHub no admite contraseñas de cuenta convencionales para operaciones remotas por HTTPS. Si el comando solicita credenciales y falla, debe utilizarse <strong>Git Credential Manager</strong> (integrado de forma nativa en Git para Windows, que autentica mediante el navegador) o generar un <em>Personal Access Token</em> (PAT) con permisos de lectura y escritura en repositorios desde <strong>Settings → Developer settings → Personal access tokens</strong>.</p>
</details>

#### Bloque B · Automatización del despliegue con GitHub Pages

<p class="stage stage--guided">Procedimiento guiado · Configuración del origen de integración continua</p>

**1 · Acceso a la configuración del servicio.** En la interfaz del repositorio en GitHub, accede a la pestaña **Settings** (en la barra superior). En el menú lateral izquierdo, dentro de la sección *Code and automation*, selecciona **Pages**.

**2 · Configuración del origen de compilación (Build and deployment).** En el selector desplegable **Source**, modifica la opción por defecto (*Deploy from a branch*) y selecciona **GitHub Actions**.

<div class="rule">
  <p class="rule-label">Infraestructura declarativa frente a publicación opaca</p>
  <p>La modalidad tradicional <em>Deploy from a branch</em> delega la publicación a un proceso interno de GitHub que no deja registro auditable de su ejecución. Por el contrario, seleccionar <strong>GitHub Actions</strong> implementa el principio de Infraestructura como Código (IaC): genera un archivo de flujo de trabajo versionado en el repositorio, permitiendo auditar, versionar, modificar y validar en pull requests cada fase del proceso de despliegue.</p>
</div>

**3 · Selección de la plantilla de flujo de trabajo.** En las sugerencias presentadas bajo *Suggested workflows*, localiza la plantilla **Static HTML** y pulsa **Configure**. Se abrirá el editor web mostrando el archivo de definición `static.yml`.

**4 · Confirmación e integración del workflow.** Pulsa el botón superior **Commit changes...**, selecciona la opción **Commit directly to the `main` branch** y confirma pulsando **Commit changes**.

En este primer paso no debe alterarse la configuración predeterminada del YAML. Dicha plantilla está preconfigurada para empaquetar y publicar la raíz del repositorio, que es donde se encuentra el archivo `index.html`. En la sesión 3 se profundizará en la edición y personalización de flujos de trabajo propios.

**5 · Monitorización de la ejecución en GitHub Actions.** Accede a la pestaña **Actions** del repositorio. Observarás una ejecución en curso identificada con un indicador amarillo. Al hacer clic sobre ella y acceder al trabajo (*job*) denominado `deploy`, podrás inspeccionar en tiempo real los cuatro pasos que componen el pipeline: checkout del código, configuración del entorno de Pages, empaquetado de artefactos y publicación.

**6 · Verificación del entorno de producción.** Una vez que la ejecución finalice con estado de éxito (indicador verde), regresa a **Settings → Pages**. En el panel superior se indicará la dirección pública bajo la leyenda **Your site is live at**, con un formato similar a `https://tu-usuario.github.io/portfolio/`. Accede a dicha URL para verificar que el documento HTML se visualiza en el navegador.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación del bloque B</p>
  <ul class="checklist">
    <li>La URL pública responde correctamente y visualiza el documento HTML inicial con tu nombre.</li>
    <li>La pestaña Actions registra una ejecución completada con éxito (icono verde).</li>
    <li>Se ha incorporado al repositorio el archivo de definición en la ruta <code>.github/workflows/static.yml</code>.</li>
  </ul>
</div>

<details class="aside aside--help">
  <summary>Diagnóstico de errores habituales en el despliegue</summary>
  <p><strong>La URL responde con código de estado HTTP 404.</strong> En una primera publicación, el enrutamiento DNS y el aprovisionamiento de certificados SSL pueden requerir entre uno y dos minutos tras la finalización del workflow. Si el error persiste, comprueba que la ruta en el navegador incluye la barra final requerida (<code>/portfolio/</code>).</p>
  <p><strong>HTTP 404 pese a que Actions finalizó en verde.</strong> El archivo de entrada debe llamarse con exactitud <code>index.html</code> (en minúsculas y sin tildes) y encontrarse estrictamente en la raíz del repositorio, no dentro de un subdirectorio.</p>
  <p><strong>No se muestra la sugerencia de plantilla Static HTML.</strong> Haz clic en <em>browse all workflows</em> y utiliza el campo de búsqueda escribiendo <code>static</code>. Selecciona la opción oficial denominada «Deploy static content to Pages».</p>
  <p><strong>No se inicia ninguna ejecución en Actions.</strong> El origen de implementación no se guardó correctamente. Vuelve al paso 2 y asegúrate de que el selector <em>Source</em> indica <strong>GitHub Actions</strong>.</p>
</details>

#### Bloque C · Análisis técnico del workflow de despliegue

<p class="stage stage--solo">Trabajo individual · Inspección de la infraestructura como código</p>

El archivo generado en el paso anterior se ha confirmado remotamente en la rama principal. Para sincronizar tu espacio de trabajo local con el repositorio remoto, ejecuta:

```bash
git pull
```

Examina el nuevo archivo ubicado en `.github/workflows/static.yml`:

```yaml
name: Deploy static content to Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

<p class="term">Flujo de trabajo (Workflow)</p>

Un descriptor declarativo en formato YAML que define qué procesos automatizados debe ejecutar GitHub Actions, bajo qué circunstancias de disparo y con qué permisos y dependencias. Al residir dentro del sistema de control de versiones, la configuración de despliegue goza de trazabilidad, puede auditarse en revisiones de código y evoluciona al mismo ritmo que la aplicación.

<dl class="worked">
  <dt><code>on: push: branches: ['main']</code></dt>
  <dd>Disparador por evento de código. Cualquier incorporación o fusión confirmada en la rama <code>main</code> activa automáticamente el proceso de compilación y despliegue.</dd>
  <dt><code>workflow_dispatch</code></dt>
  <dd>Disparador manual. Habilita la interfaz interactiva con el botón <em>Run workflow</em> en GitHub Actions para ejecutar el despliegue bajo demanda sin necesidad de realizar modificaciones en el código.</dd>
  <dt>Ausencia de la directiva <code>pull_request</code></dt>
  <dd>Este flujo se ejecuta exclusivamente sobre el código ya integrado en la rama principal. Las pull requests aún no disponen de validaciones previas a la fusión; dicha protección constituirá el núcleo de la Unidad 2.</dd>
  <dt><code>permissions: id-token: write</code> y <code>pages: write</code></dt>
  <dd>Asignación de privilegios de ejecución mediante autenticación OIDC (OpenID Connect). El runner obtiene un token efímero de corta duración con privilegios acotados exclusivamente a la publicación en Pages. No se requieren secretos estáticos de larga duración (PAT) almacenados en el repositorio.</dd>
  <dt><code>path: '.'</code></dt>
  <dd>Ruta del directorio que se empaqueta como artefacto publicable. En este proyecto corresponde a la raíz (<code>.</code>). En aplicaciones que incorporan empaquetadores o compiladores, esta directiva apuntaría al directorio de distribución (por ejemplo, <code>./dist</code>).</dd>
  <dt><code>concurrency: group: 'pages'</code></dt>
  <dd>Control de concurrencia para evitar condiciones de carrera (<em>race conditions</em>). Si se suceden varias confirmaciones consecutivas, se serializa su ejecución para garantizar que los despliegues se apliquen en estricto orden cronológico sin corromper el estado del sitio.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Seguridad en CI/CD: credenciales efímeras frente a secretos estáticos</p>
  <p>La concesión de permisos de escritura a una máquina de automatización representa uno de los vectores más sensibles en seguridad informática. Existen dos estrategias: almacenar credenciales de larga duración (contraseñas o tokens personales como secretos del repositorio) o utilizar autorización federada de corta duración (OIDC). GitHub Actions emplea esta segunda vía para GitHub Pages: un token efímero generado al iniciar el trabajo que caduca de forma automática tras concluir la ejecución, eliminando el riesgo de filtración de claves estáticas.</p>
</div>

<dl class="answer">
  <dt>¿Qué dos eventos distintos pueden activar la ejecución de este workflow?</dt>
  <dd></dd>
  <dt>Si se confirma un commit en local sin ejecutar <code>git push</code>, ¿se desencadena el despliegue? Justifica técnicamente la respuesta.</dt>
  <dd></dd>
  <dt>¿Por qué no es necesario configurar un secreto de repositorio en Settings para que este workflow pueda publicar?</dt>
  <dd></dd>
  <dt>Si se abre una pull request, ¿se ejecuta este workflow? ¿En qué directiva del archivo se evidencia?</dt>
  <dd></dd>
</dl>

#### Bloque C-bis · Diagnóstico de fallos: error de pipeline frente a fallo funcional

<p class="stage stage--solo">Trabajo individual · Práctica de diagnóstico y observabilidad</p>

Una vez comprendida la estructura del archivo de automatización, provocaremos deliberadamente dos fallos de distinta naturaleza técnica para analizar la diferencia entre un fallo en la infraestructura del pipeline y un fallo funcional del servicio.

**Caso 1 · Fallo de infraestructura en el pipeline (Ruta de artefacto inexistente).** Modifica `.github/workflows/static.yml` alterando la ruta del paso de empaquetado:

```yaml
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
```

Envía la modificación a la rama principal:

```bash
git add .github/workflows/static.yml
git commit -m "Simular error de infraestructura en la ruta del artefacto"
git push
```

Accede a la pestaña **Actions**. La ejecución concluirá con un indicador de error (aspa roja). Al inspeccionar el trabajo `deploy`, observarás que el paso **Upload artifact** ha fallado y que los pasos sucesivos han cancelado su ejecución. El registro técnico explicita que el directorio especificado no existe en el sistema de archivos del *runner*.

A continuación, **sin modificar el código, accede a la URL pública de tu portfolio**. El sitio continuará respondiendo con la versión anterior. En entornos de entrega continua, los despliegues son operaciones **atómicas**: si una fase del pipeline falla antes de la publicación, la versión estable previa permanece inalterada en producción.

Restaura el archivo devolviendo la directiva a `path: '.'` y confirma el cambio:

```bash
git add .github/workflows/static.yml
git commit -m "Restaurar ruta raiz para empaquetado de artefactos"
git push
```

La nueva ejecución volverá a completarse con éxito.

**Caso 2 · Fallo semántico con pipeline exitoso (Ausencia del archivo de entrada).** Modifica ahora el nombre del documento principal mediante Git:

```bash
git mv index.html inicio.html
git commit -m "Renombrar documento principal a inicio.html"
git push
```

Esta ejecución **concluye con estado de éxito (verde)**. Los cuatro pasos se completan sin advertencias técnicas. Sin embargo, al abrir la URL pública en el navegador, el servidor web responderá con un error **HTTP 404**. (Si el navegador muestra la versión en caché, fuerza la recarga sin caché mediante `Ctrl+Shift+R`).

No existe contradicción técnica: el pipeline ejecutó fielmente las instrucciones declaradas (empaquetar el contenido del repositorio y desplegarlo). Lo que ha fallado es el cumplimiento de los estándares del servidor web, el cual requiere un archivo de entrada predeterminado denominado `index.html`. Este ejercicio evidencia por qué **un estado verde en el pipeline certifica la ejecución de los comandos, pero no valida por sí solo la corrección funcional del producto**.

Restablece el nombre correcto del archivo y confirma el cambio:

```bash
git mv inicio.html index.html
git commit -m "Restablecer index.html como punto de entrada de la aplicacion"
git push
```

<div class="rule">
  <p class="rule-label">La limitación de un pipeline sin validación automatizada</p>
  <p>Un indicador verde en GitHub Actions certifica exclusivamente que los comandos del flujo de trabajo concluyeron con código de salida 0 (sin excepciones a nivel de proceso). No verifica que los hipervínculos sean válidos, que el marcado HTML cumpla con los estándares W3C ni que la página sea accesible. Un despliegue continuo sin pruebas de validación automatizadas únicamente acelera la publicación de errores a producción. En la Unidad 2 se abordará la solución a este problema mediante la incorporación de suites de prueba y linters en el pipeline.</p>
</div>

<dl class="answer">
  <dt>¿En qué paso concreto falló el Caso 1 y cuál fue el mensaje exacto registrado en el log?</dt>
  <dd></dd>
  <dt>Mientras la ejecución del Caso 1 permanecía en error, ¿qué mostraba la URL pública y qué principio de despliegue justifica ese comportamiento?</dt>
  <dd></dd>
  <dt>En el Caso 2 GitHub Actions finalizó en verde pese al error 404. ¿Qué validó la máquina y qué quedó sin comprobar?</dt>
  <dd></dd>
  <dt>¿Cuál de los dos escenarios representa un mayor riesgo en un entorno de producción profesional y por qué motivos de observabilidad?</dt>
  <dd></dd>
</dl>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación del bloque C-bis</p>
  <ul class="checklist">
    <li>El historial del repositorio registra una confirmación que reprodujo un fallo en el pipeline y otra que lo subsanó.</li>
    <li>La ejecución más reciente en Actions concluye en verde y la URL pública muestra el contenido correcto.</li>
    <li>Sabes localizar e interpretar el registro de errores de un paso fallido en GitHub Actions.</li>
  </ul>
</div>

<details class="aside aside--help">
  <summary>Pautas de resolución ante discrepancias en el estado</summary>
  <p><strong>La URL pública persiste con error 404 tras corregir el código.</strong> Consulta la pestaña Actions: cada corrección inicia una nueva ejecución que requiere tiempo de compilación y distribución en red. Una vez finalizada en verde, limpia la caché del navegador recargando la página.</p>
  <p><strong>Desorientación en el árbol de confirmaciones.</strong> Ejecuta <code>git log --oneline --graph</code> para inspeccionar el historial cronológico. Para deshacer un commit sin alterar el historial, <code>git revert HASH</code> genera una confirmación inversa limpia.</p>
  <p><strong>Comportamiento del sistema de archivos según el sistema operativo.</strong> Los sistemas de archivos en Windows y macOS son a menudo insensibles a mayúsculas y minúsculas (<em>case-insensitive</em>), mientras que los servidores de producción basados en Linux distinguen estrictamente entre <code>index.html</code> e <code>Index.html</code>. Se recomienda utilizar siempre nombres en minúsculas para prevenir discrepancias de despliegue.</p>
</details>

#### Bloque D · Documentación técnica del proyecto en README

<p class="stage stage--solo">Fase de consolidación · Documentación técnica del repositorio</p>

Actualiza el archivo `README.md` incorporando la información técnica esencial del proyecto. En esta primera sesión se realiza la modificación directamente sobre la rama `main`; a partir de la próxima sesión la rama principal quedará protegida y cualquier cambio deberá canalizarse mediante ramas de funcionalidad y pull requests.

<div class="checkpoint">
  <p class="checkpoint-label">Especificaciones del archivo README.md</p>
  <ul class="checklist">
    <li>Título del proyecto junto con tu nombre completo y una descripción concisa de su propósito.</li>
    <li>Enlace directo a la URL pública del entorno de producción.</li>
    <li>Explicación técnica de la arquitectura de despliegue: evento disparador y servicio ejecutor.</li>
    <li>Ruta relativa del archivo de definición del workflow dentro del repositorio (<code>.github/workflows/static.yml</code>).</li>
  </ul>
</div>

```bash
git add README.md
git commit -m "Documentar arquitectura de despliegue y URL publica en README"
git push
```

Al inspeccionar la pestaña Actions se verificará una nueva ejecución desatendida provocada por el evento de actualización de la rama `main`.

#### Bloque E · Modelos de flujo de trabajo y colaboración en la industria

<p class="stage stage--solo">Trabajo de investigación y síntesis técnica · Tarea individual</p>

Los procedimientos adoptados en este módulo (descomposición en *issues*, ramificación, revisión por pares y despliegue automatizado) se corresponden con los estándares metodológicos de la ingeniería de software actual. Sin embargo, los equipos profesionales adaptan estas prácticas a su arquitectura y cadencia de entrega.

Selecciona **una** de las siguientes referencias de la industria para analizarla en detalle:

| Referencia | Enfoque metodológico | Cuestiones clave para el análisis |
| ---------- | -------------------- | --------------------------------- |
| [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) | Modelo ágil basado en ramas de corta duración y despliegue continuo | Cantidad de ramas simultáneas y tiempo de vida promedio de cada una. |
| [Trunk-based development](https://trunkbaseddevelopment.com/) | Integración continua directa en la línea principal | Argumentos contra las ramas de larga duración y gestión de riesgos mediante feature flags. |
| [Git branching model (Vincent Driessen)](https://nvie.com/posts/a-successful-git-branching-model/) | «Git flow», el modelo clásico para ciclos de entrega empaquetados | La nota retrospectiva añadida por el autor analizando la evolución del desarrollo web. |
| [Guía de revisión de código de Google](https://google.github.io/eng-practices/review/) | Estándar corporativo de inspección y aprobación por pares | Expectativas de velocidad de respuesta y responsabilidades de revisor y autor. |
| [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) | Especificación semántica formal para mensajes de confirmación | Puntos de convergencia con las reglas del módulo y automatización de versionado semántico. |

<div class="compare-pair">
  <div>
    <p class="compare-label">Ramas de ciclo corto (horas/días)</p>
    <p class="compare-body">Los incrementos son reducidos y se integran con frecuencia, minimizando los conflictos de fusión y manteniendo la rama principal en estado desplegable. Requiere una descomposición rigurosa de las tareas técnicas.</p>
  </div>
  <div>
    <p class="compare-label">Ramas de ciclo largo (semanas/meses)</p>
    <p class="compare-body">Aíslan el desarrollo individual durante períodos extensos, pero incrementan exponencialmente la complejidad de integración, generando conflictos de fusión costosos y demorando la detección de incompatibilidades.</p>
  </div>
</div>

**Entregable técnico.** Genera un documento en formato **PDF** de una página y almacénalo en el repositorio bajo la ruta `docs/flujo-de-trabajo.pdf`. Debe recoger un análisis personal estructurado:

<div class="checkpoint">
  <p class="checkpoint-label">Estructura del entregable del bloque E</p>
  <ul class="checklist">
    <li>Identificación de la referencia seleccionada e hipervínculo correspondiente.</li>
    <li>Modelo de gobernanza: qué perfiles autorizan la integración de cambios y qué validaciones automáticas se exigen.</li>
    <li>Cadencia de despliegue: periodicidad de publicación a producción y grado de automatización.</li>
    <li>Análisis de aplicabilidad: un aspecto del modelo que resulte idóneo para un equipo de dos desarrolladores y otro que resulte desproporcionado, justificando técnicamente la respuesta.</li>
  </ul>
</div>

```bash
git add docs/flujo-de-trabajo.pdf
git commit -m "Anadir analisis tecnico sobre modelos de flujo de trabajo"
git push
```

<div class="rule">
  <p class="rule-label">Rigor y análisis crítico en los entregables</p>
  <p>El análisis debe reflejar tu propia comprensión y criterio técnico tras la lectura del documento original. En el ejercicio profesional se valora la capacidad de sintetizar cómo se aplican los principios de integración continua y control de versiones a un contexto productivo real, evitando reproducciones literales o superficiales.</p>
</div>

<div class="rule">
  <p class="rule-label">Adaptación del flujo de trabajo al contexto productivo</p>
  <p>Ningún modelo metodológico se implementa de manera idéntica en todas las organizaciones. La arquitectura del producto y los requisitos del negocio determinan la cadencia: un servicio web con millones de usuarios puede realizar decenas de despliegues diarios con integración continua estricta, mientras que el firmware de un dispositivo médico o un sistema aeroespacial exige ciclos de auditoría exhaustivos y despliegues espaciados. Sin embargo, los pilares esenciales se mantienen universales: trazabilidad, automatización y revisión colegiada.</p>
</div>

<details class="aside aside--extra">
  <summary>Ampliación conceptual: Métricas DORA</summary>
  <p>El consorcio de investigación <a href="https://dora.dev/">DORA (DevOps Research and Assessment)</a> analiza anualmente los factores que determinan el rendimiento de los equipos de ingeniería de software. Sus cuatro métricas clave son: la frecuencia de despliegue (<em>deployment frequency</em>), el tiempo de entrega de cambios (<em>lead time for changes</em>), la tasa de fallos en producción (<em>change failure rate</em>) y el tiempo medio de recuperación (<em>time to restore service</em>). Ninguna de estas métricas evalúa líneas de código brutas ni horas de presencia, sino la agilidad y estabilidad del proceso de entrega continua.</p>
</details>

#### Bloque F · Práctica complementaria: Despliegue en Microsoft Azure

<p class="stage stage--solo">Opcional · Exploración práctica de provisión cloud</p>

El portfolio ya dispone de un entorno de producción activo en GitHub Pages. Este bloque complementario introduce el aprovisionamiento en un proveedor de infraestructura en la nube (*cloud provider*) comercial como Microsoft Azure, anticipando la arquitectura requerida para el backend en evaluaciones posteriores.

Al concluir este bloque dispondrás de dos pipelines independientes publicando concurrentemente el mismo repositorio en dos plataformas distintas. Ambas URLs serán plenamente funcionales.

**1 · Aprovisionamiento de la suscripción académica.**

1. Accede a **azure.microsoft.com/es-es/free/students**.
2. Selecciona **Empezar gratis** e inicia sesión con las credenciales de tu **correo institucional**, acreditando la condición de estudiante.
3. Acepta las condiciones del servicio. Esta modalidad no requiere tarjeta de crédito.
4. Accede a **portal.azure.com** y verifica en la sección **Suscripciones** (*Subscriptions*) la presencia activa de la suscripción *Azure for Students*.

<details class="aside aside--help">
  <summary>Incidencias en la validación de la cuenta educativa</summary>
  <p>Si la verificación académica no se completa inmediatamente, comprueba haber utilizado la cuenta institucional del centro educativo. Si el dominio requiere validación adicional por parte del proveedor, no interrumpe el desarrollo del curso, ya que el flujo principal de CI/CD opera sobre GitHub Pages.</p>
</details>

**2 · Creación del recurso en Azure.** En la barra superior del portal de Azure, busca `Static Web Apps` y pulsa **Crear** (*Create*).

**3 · Configuración de parámetros básicos.** Cumplimenta el formulario con los siguientes valores:

| Campo | Valor requerido |
| ----- | --------------- |
| Suscripción (*Subscription*) | Azure for Students |
| Grupo de recursos (*Resource group*) | **Crear nuevo** → <code>rg-portfolio</code> |
| Nombre (*Name*) | <code>swa-portfolio-TUUSUARIO</code> |
| Tipo de plan (*Hosting plan*) | **Gratuito (Free)** |
| Región (*Region*) | West Europe |
| Origen de la implementación (*Deployment source*) | **GitHub** |

<div class="rule">
  <p class="rule-label">Gestión de costes y planes en plataformas cloud</p>
  <p>Asegúrate de seleccionar la modalidad <strong>Gratuito (Free)</strong>. El plan Standard aplica cargos recurrentes que consumirían el crédito asignado a la suscripción estudiantil, el cual se reservará para el aprovisionamiento de bases de datos relacionales y servicios de backend en la segunda evaluación.</p>
</div>

**4 · Vinculación con GitHub.** Pulsa **Iniciar sesión con GitHub** y concede los permisos de autorización a Azure. A continuación, selecciona en los menús desplegables:

| Parámetro | Valor |
| --------- | ----- |
| Organización (*Organization*) | Tu cuenta de usuario de GitHub |
| Repositorio (*Repository*) | <code>portfolio</code> |
| Rama (*Branch*) | <code>main</code> |

**5 · Parámetros de compilación (Build Presets).** Especifica la configuración técnica para sitios estáticos sin paso de empaquetado intermedio:

| Parámetro | Valor requerido | Justificación técnica |
| --------- | --------------- | --------------------- |
| Preajustes de compilación (*Build presets*) | **Custom** | Define manualmente las rutas del proyecto. |
| Ubicación de la aplicación (*App location*) | <code>/</code> | Los archivos fuente residen directamente en la raíz del repositorio. |
| Ubicación de la API (*Api location*) | *vacío* | El proyecto actual carece de funciones serverless de backend. |
| Ubicación de salida (*Output location*) | *vacío* | Al no requerir compilación (Vite, Webpack), no existe una carpeta de salida intermediaria (como <code>dist</code>). |

**6 · Revisión y provisión.** Accede a la pestaña **Revisar y crear** y confirma pulsando **Crear**. El aprovisionamiento de la infraestructura tomará entre uno y dos minutos. Al finalizar, pulsa **Ir al recurso**.

**7 · Monitorización del despliegue.** Regresa a tu repositorio en GitHub y accede a la pestaña **Actions**. Observarás un nuevo flujo de trabajo generado automáticamente por Azure en ejecución.

**8 · Comprobación de la URL pública.** Tras completarse la ejecución con éxito, regresa a la vista general del recurso en el portal de Azure. En el campo **URL** figurará el dominio asignado (con formato `nombre-aleatorio.azurestaticapps.net`). Accede a dicho enlace para comprobar que el sitio web se encuentra en línea.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación del bloque F</p>
  <ul class="checklist">
    <li>La URL asignada por Azure carga y muestra el documento HTML correctamente.</li>
    <li>La pestaña Actions en GitHub registra el workflow de Azure con estado completado en verde.</li>
    <li>Ambos proveedores (GitHub Pages y Azure Static Web Apps) publican concurrentemente el repositorio.</li>
  </ul>
</div>

<details class="aside aside--help">
  <summary>Diagnóstico de incidencias en Azure Static Web Apps</summary>
  <p><strong>La URL muestra una página de bienvenida de Azure o código 404.</strong> El despliegue inicial puede requerir unos instantes adicionales para propagar el contenido a través de la red perimetral (CDN). Comprueba en Actions que el workflow ha finalizado satisfactoriamente.</p>
  <p><strong>El repositorio no aparece en la selección de GitHub.</strong> La aplicación OAuth de Azure requiere autorización de lectura sobre tu cuenta de GitHub. Comprueba los permisos concedidos en GitHub bajo <strong>Settings → Applications → Authorized OAuth Apps</strong>.</p>
  <p><strong>El workflow finaliza en error.</strong> Revisa el registro de ejecución en GitHub Actions. La causa habitual se debe a rutas incorrectas en <em>App location</em> u <em>Output location</em> en el paso 5.</p>
  <p><strong>Conflicto con el nombre del recurso.</strong> Los nombres de los recursos deben ser globalmente únicos en el espacio de nombres de Azure. Añade un sufijo numérico o tus iniciales al nombre.</p>
</details>

---

### Cierre

<p class="stage">15 minutos · evaluación y consolidación de competencias</p>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Autoevaluación conceptual · sin consulta de apuntes</p>
  <ol>
    <li>¿Por qué es preferible validar el flujo de despliegue continuo desde la primera sesión con un documento mínimo en lugar de postergarlo hasta disponer del diseño final?</li>
    <li>¿Qué entidad genera el archivo <code>.github/workflows/static.yml</code> y mediante qué acción se incorpora a la rama principal?</li>
    <li>¿Qué secuencia de eventos técnicos se produce entre la ejecución de <code>git push</code> y la actualización del contenido en el entorno de producción?</li>
    <li>¿Qué justificación técnica exige que el repositorio sea público en este módulo?</li>
    <li>Si un desarrollador abre una pull request, ¿se ejecuta el workflow configurado hoy en GitHub Actions? Justifica por qué.</li>
    <li>Si el pipeline finaliza con indicador verde pero la URL pública devuelve un código HTTP 404, ¿qué aspectos ha certificado la máquina y qué fallos no han sido detectados?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Respuestas a la autoevaluación</summary>
  <p>1 · Porque la mayor parte de las incidencias críticas en un despliegue corresponden a la configuración de infraestructura, permisos y dominios, y no al código. Resolver estos aspectos tempranamente sobre un Walking Skeleton evita acumular problemas en fases avanzadas del desarrollo.</p>
  <p>2 · El archivo es proporcionado como plantilla oficial por GitHub al configurar la opción <em>Static HTML</em>, y se incorpora al repositorio mediante una confirmación directa en la rama <code>main</code> realizada desde la interfaz web.</p>
  <p>3 · GitHub detecta el evento <code>push</code> en la rama <code>main</code>, inicializa un runner limpio en un contenedor Linux, descarga el repositorio, empaqueta los archivos como artefacto de Pages y los publica mediante credenciales efímeras OIDC.</p>
  <p>4 · Porque las directivas de protección de ramas y reglas avanzadas de pull request en GitHub son gratuitas exclusivamente en repositorios públicos en cuentas personales, y porque un portfolio profesional está destinado a ser público.</p>
  <p>5 · No. El descriptor actual restringe el disparador exclusivamente al evento <code>push</code> en la rama <code>main</code>. Una pull request no fusionada no altera dicha rama; las validaciones automáticas sobre pull requests se implementarán en la Unidad 2.</p>
  <p>6 · Ha verificado que todos los comandos declarados concluyeron con código de salida 0 (sin excepciones de infraestructura). No ha verificado la existencia del punto de entrada requerido por el servidor web (<code>index.html</code>) ni la corrección funcional del contenido.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Criterios de logro de la sesión</p>
  <ul class="checklist">
    <li>La URL pública responde con éxito y muestra el documento HTML con tu nombre; en caso de incidencia, puedes identificar el paso y el registro de error en el pipeline.</li>
    <li>El archivo README.md documenta la URL pública, el evento de disparo del pipeline y la ruta del workflow.</li>
    <li>Puedes identificar el descriptor de GitHub Actions y explicar qué directiva controla su ejecución.</li>
    <li>Has comprobado que una nueva confirmación en la rama principal actualiza la versión pública a través del pipeline.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">Anticipación de la sesión 2</p>
  <p>En la siguiente sesión protegerás <code>main</code> para rechazar envíos directos. Practicarás cada cambio mediante una rama, una <em>pull request</em> y una revisión por tu pareja. Distinguirás qué operaciones bloquean las reglas y qué comprobaciones debes realizar antes de fusionar.</p>
</div>

## Sesión 2 · Issues, tablero y la primera pull request

**Antes de empezar.** Necesitas el portfolio publicado en la sesión 1, su carpeta local y acceso a GitHub. El backend ya se ha iniciado en las sesiones 1–2 de Servidor, pero hoy practicarás el flujo de trabajo con cambios pequeños en el portfolio. Después aplicarás ese mismo método al código Java, sin repetir aquí su implementación.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Punto de partida · primeros 3 minutos de la explicación</p>
  <ol>
    <li>¿Cómo compruebas que la página publicada contiene tu último cambio?</li>
    <li>¿Qué información falta en una tarea que solo dice «mejorar el portfolio»?</li>
    <li>¿Qué diferencia hay entre guardar un archivo, hacer un commit y ejecutar un push?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · punto de partida, explicación y demostración</p>

#### Especificación de una tarea y criterios de aceptación

Una *issue* es una tarea registrada en GitHub: describe qué quieres cambiar y permite seguir su estado. Sus **criterios de aceptación** indican cómo comprobar que has terminado. Se redactan antes de programar, para que quien revise el cambio sepa qué resultado esperar.

<dl class="worked">
  <dt>Descripción insuficiente</dt>
  <dd>«Mejorar la cabecera». No indica qué información debe mostrar ni qué comportamiento debe tener.</dd>
  <dt>Título de la issue</dt>
  <dd>Añadir una cabecera con datos profesionales y enlace al repositorio.</dd>
  <dt>Criterios de aceptación</dt>
  <dd>La cabecera muestra tu nombre y titulación. Incluye un enlace cuyo texto es «Repositorio del portfolio». Al pulsarlo, se abre el repositorio correcto.</dd>
</dl>

El **alcance** delimita lo que entra en la tarea. Añadir la cabecera y rehacer todas las páginas son cambios distintos: sepáralos para poder comprobar cada uno. La lista de tareas pendientes se denomina *backlog*; el tablero las organiza por estado.

#### Ramas de funcionalidad y pull requests

Una **rama de funcionalidad** (*feature branch*) permite registrar los commits de una tarea sin incorporarlos todavía a `main`. Git cambia los archivos de tu carpeta al cambiar de rama; no tienes que copiar el proyecto a otra carpeta. Antes de cambiar de rama, comprueba que no quedan modificaciones sin guardar en un commit.

Por ejemplo, partes del portfolio publicado en `main`, creas una rama para la cabecera y trabajas allí. El sitio público conserva su versión anterior hasta que integres el cambio y termine el despliegue.

Una *pull request* es una solicitud para integrar los cambios de una rama en otra. GitHub muestra las diferencias de código, llamadas *diff*, y permite añadir comentarios y revisiones. La rama **base** recibe el cambio; la rama **compare** contiene la propuesta. En esta práctica, la base siempre será `main`.

<figure class="diagram">
  <figcaption>Recorrido de una modificación del portfolio</figcaption>
  <ol class="flow">
    <li>Issue: concretar el cambio</li>
    <li>Rama: implementarlo y guardar commits</li>
    <li>Pull request: mostrar la propuesta</li>
    <li>Revisión: probarla y corregirla</li>
    <li>Fusión: incorporarla a main</li>
    <li>Despliegue: comprobar la URL pública</li>
  </ol>
</figure>

#### Definición de terminado

La **definición de terminado** (*Definition of Done*) reúne las condiciones comunes a todas las tareas. Los criterios de aceptación describen la cabecera concreta; esta definición describe el proceso que seguirá cualquier cambio:

1. La issue describe el resultado y la rama contiene solo los cambios necesarios.
2. La pull request enlaza la issue y explica cómo comprobar el resultado.
3. Tu pareja prueba la rama y deja una revisión; corriges lo necesario antes de fusionar.
4. Tras la fusión, compruebas que la issue se cierra y que el despliegue del portfolio termina correctamente.
5. Abres la URL pública y verificas el cambio real.

Hoy aún no hay un análisis automático del HTML en las pull requests. Lo añadirás en la sesión 3. El backend se comprueba ejecutándolo en local hasta que llegue su taller de despliegue; no necesita una URL pública para cerrar las tareas de esta semana.

#### Protección de la rama principal

Un **conjunto de reglas** (*ruleset*) permite a GitHub rechazar operaciones sobre una rama. Hoy exigirás una pull request para modificar `main` y bloquearás su borrado y los envíos forzados que reescriben el historial.

<div class="rule">
  <p class="rule-label">Alcance de la protección inicial</p>
  <p>La configuración de hoy exige una pull request, pero establece cero aprobaciones obligatorias. La revisión por tu pareja es un requisito de la actividad que debes cumplir antes de fusionar; GitHub todavía no obliga a obtenerla. Exigir una aprobación desde la plataforma requiere configurar esa condición y contar con un revisor con permisos adecuados. En la sesión 3 añadirás también un check obligatorio de HTML.</p>
</div>

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el portfolio</p>

Los tiempos son orientativos: 30 minutos para el tablero, 25 para la protección y 85 para implementar y revisar cambios. El bloque D es el procedimiento de revisión que usarás dentro del bloque C; forma parte de esos 85 minutos. El resultado esencial es una pull request completa. Si lo alcanzas antes, repite el recorrido con otra tarea.

#### Bloque A · Planificación en GitHub Projects y especificación de issues

**1 · Define seis tareas pequeñas.** Parte de lo que ya tiene tu portfolio. Puedes planificar una cabecera profesional, una presentación personal, una lista de competencias, una ficha del CRUD, enlaces de contacto y un pie de página. Si algo ya existe, describe una mejora concreta. La ficha del CRUD puede enlazar su repositorio y explicar su estado actual: todavía no hay una demo pública del backend.

**2 · Crea el tablero.** Desde tu perfil de GitHub, abre **Projects → New project**, elige **Board**, escribe `Portfolio` y confirma. Después, en la pestaña **Projects** del repositorio `portfolio`, usa **Link a project** para vincularlo si todavía no aparece. El tablero pertenece a tu cuenta; las issues se registran en el repositorio de GitHub y no se descargan mediante `git clone`.

**3 · Comprueba los estados.** Utiliza `Todo` para tareas pendientes, `In Progress` para la que estás realizando y `Done` para tareas cerradas. Las columnas muestran el campo **Status**. Si aparecen otros nombres, identifica o configura esos tres estados antes de continuar.

**4 · Configura las automatizaciones.** Una automatización (*workflow*) es una regla que ejecuta una acción cuando ocurre un evento. Prepararás tres: incorporar al tablero las issues que crees en `portfolio`, asignarles el estado pendiente y actualizar su estado cuando se cierren. Estas reglas se configuran en GitHub Projects; no necesitas crear un archivo de GitHub Actions.

**Abre la configuración del proyecto.** Entra en el tablero `Portfolio` que acabas de crear. En la esquina superior derecha del proyecto, pulsa **···** y selecciona **Workflows**. En la lista **Default workflows** encontrarás las reglas siguientes.

**A · Añadir las issues al tablero**

1. Selecciona **Auto-add to project** y pulsa **Edit**, arriba a la derecha.
2. En **Filters**, selecciona tu repositorio `portfolio`. Comprueba también el propietario si aparece más de un repositorio con ese nombre.
3. En el campo de filtro situado junto al repositorio, escribe `is:issue is:open`. La primera parte selecciona issues y la segunda exige que estén abiertas; juntas seleccionan únicamente issues abiertas.
4. Pulsa **Save and turn on workflow** para guardar y activar la regla.

**B · Asignar el estado inicial**

1. En la lista de reglas, selecciona **Item added to project** y pulsa **Edit**.
2. En la acción que establece el estado, selecciona **Status → Todo**. El campo **Status** indica en qué columna se muestra la tarjeta; **Todo** significa pendiente.
3. Pulsa **Save and turn on workflow**.

Añadir una issue al tablero y asignarle un estado son operaciones distintas. La regla A incorpora la tarjeta al proyecto y la regla B la sitúa en **Todo**.

**C · Actualizar el estado al cerrar una issue**

1. Selecciona **Item closed**.
2. Comprueba que la regla está activada y que su acción asigna **Status → Done**. Si ya está configurada así, puedes dejarla como está.
3. Si necesitas cambiarla o activarla, pulsa **Edit**, selecciona **Done** como estado de destino y guarda con **Save and turn on workflow**.

Esta regla actúa cuando se cierra una issue del proyecto, incluido el cierre automático al fusionar una pull request vinculada. Lo practicarás más adelante en esta sesión.

**Resumen de las reglas**

| Cuando ocurre… | La regla realiza… |
| --- | --- |
| Creas una issue abierta en `portfolio` | **Auto-add to project** la incorpora al tablero. |
| Se añade un elemento al tablero | **Item added to project** le asigna **Todo**. |
| Se cierra una issue del tablero | **Item closed** cambia su estado a **Done**. |

**Activa las tres reglas antes de crear las tareas.** La incorporación automática se aplica cuando una issue se crea o se actualiza y cumple el filtro. Activar la regla no incorpora por sí solo las issues que ya existían. Puedes consultar las instrucciones de GitHub sobre [automatizaciones de Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations) e [incorporación automática](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically).

**Comprueba el resultado con la primera tarea.** En el paso 5, crea la primera issue desde el repositorio `portfolio` y vuelve al tablero. Debe aparecer en **Todo** sin que la añadas ni le asignes el estado manualmente. Compruébalo antes de crear las otras cinco. Cuando completes esa tarea y se cierre su issue al fusionar la pull request, verifica que pasa a **Done**; mantenla abierta mientras esté pendiente.

<details class="aside aside--help">
  <summary>La issue no aparece o su tarjeta no tiene estado</summary>
  <ul>
    <li><strong>No aparece:</strong> actualiza la página del tablero. Si sigue faltando, revisa en <strong>Auto-add to project</strong> el propietario y el repositorio seleccionados, el filtro <code>is:issue is:open</code> y que hayas guardado y activado la regla. Comprueba que la issue esté abierta.</li>
    <li><strong>La creaste antes de activar la regla:</strong> añádela al proyecto mediante su enlace, como se indica en el paso 5. La activación no importa automáticamente las issues existentes.</li>
    <li><strong>Aparece sin estado:</strong> revisa que <strong>Item added to project</strong> esté activado y asigne <strong>Todo</strong>. Para corregir la tarjeta ya añadida, ábrela y selecciona <strong>Todo</strong> en su campo <strong>Status</strong>; después comprueba la automatización con la siguiente issue.</li>
    <li><strong>La issue está cerrada pero la tarjeta no pasa a Done:</strong> revisa <strong>Item closed</strong>. Corrige el estado de esa tarjeta manualmente y comprueba el comportamiento en el siguiente cierre.</li>
  </ul>
</details>

**5 · Registra las seis issues.** En **Issues → New issue** del repositorio, escribe para cada una un título y dos o tres criterios comprobables, siguiendo el ejemplo de la explicación. Créala y observa el número que GitHub le asigna. Regresa al tablero y verifica su incorporación. Si falta una issue que creaste antes de activar el flujo, añádela mediante su enlace desde la opción de añadir elementos del tablero.

**6 · Prioriza.** Coloca primero la cabecera, si falta, o una mejora pequeña de esta. Reserva una segunda tarea para repetir el proceso. Deja las demás pendientes: no tienes que implementar las seis hoy.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación del bloque A</p>
  <ul class="checklist">
    <li>Hay seis issues con criterios de aceptación que otra persona puede comprobar.</li>
    <li>Las tarjetas están en el tablero con su estado correcto.</li>
    <li>Puedes identificar la primera tarea y explicar qué resultado se espera.</li>
  </ul>
</div>

#### Bloque B · Configuración de la protección de main

**1 · Crea el conjunto de reglas.** En el repositorio del portfolio, abre **Settings → Rules → Rulesets → New ruleset → New branch ruleset** y configura:

| Campo | Valor |
| --- | --- |
| Ruleset Name | `main protegida` |
| Enforcement status | `Active` |
| Target branches | `Add target → Include default branch`; comprueba que la predeterminada es `main` |
| Bypass list | Vacía: no añadas excepciones para saltar las reglas |

Activa **Restrict deletions**, **Block force pushes** y **Require a pull request before merging**, con **Required approvals: 0**. Mantén **Require status checks to pass** desactivado: aún no has creado el check de HTML. Pulsa **Create** y vuelve a abrir el ruleset para comprobar lo guardado.

**2 · Comprueba el bloqueo con un cambio de prueba.** Abre una terminal en la carpeta del portfolio y ejecuta `git status`. Antes de continuar, debe indicar que no hay cambios pendientes. Si los hay, termina de registrarlos en su rama; no los descartes para realizar esta prueba.

```bash
git switch main
git pull --ff-only
git switch -c prueba-proteccion-main
```

Añade al final del README una línea que diga «Prueba temporal de protección», guarda y ejecuta:

```bash
git add README.md
git commit -m "Comprobar proteccion de main"
git push origin HEAD:main
```

`HEAD:main` intenta enviar el commit actual directamente a la rama remota `main`, sin pull request. **El resultado esperado es un rechazo por las reglas**, por ejemplo `GH013` o `GH006`, acompañado de un mensaje que exige una pull request. Un error de contraseña o de conexión no demuestra que la protección funcione.

Tras el rechazo, ejecuta `git switch main`. El commit de prueba queda conservado únicamente en la rama local `prueba-proteccion-main`, y tu README vuelve a la versión anterior. Puedes dejar esa rama sin utilizar; no hace falta borrar cambios ni ejecutar `git reset --hard`.

<details class="aside aside--help">
  <summary>Si el envío directo se acepta</summary>
  <p>La protección no está funcionando como se esperaba. Revisa que el ruleset esté activo, que incluya <code>main</code> y que no haya excepciones en <em>Bypass list</em>. No repitas el envío. Actualiza tu <code>main</code> local con <code>git switch main</code> y <code>git pull --ff-only</code>; elimina la línea temporal mediante una nueva rama y una pull request siguiendo el bloque C. No reviertas el historial con un envío forzado.</p>
</details>

**3 · Aplica las mismas reglas al backend.** En GitHub, abre el repositorio que contiene `pom.xml` y `src/`, y configura el mismo ruleset. Comprueba su nombre para no confundirlo con `portfolio`. A partir de las sesiones 3–4 de Servidor, sus cambios también se publican mediante ramas y pull requests. No copies el workflow de Pages al backend: una aplicación Java requiere otro despliegue, que se trabajará más adelante.

<dl class="answer">
  <dt>¿Qué mensaje demuestra que GitHub rechazó el envío por la protección de main?</dt>
  <dd></dd>
  <dt>¿Dónde ha quedado el commit de prueba después de volver a main?</dt>
  <dd></dd>
  <dt>¿Qué parte de la revisión sigue dependiendo de tu actuación con la configuración actual?</dt>
  <dd></dd>
</dl>

#### Bloque C · Recorrido completo de una tarea y segunda iteración

Trabaja con una pareja de revisión: cada persona desarrolla en su repositorio y revisa el de la otra. Intercambia los enlaces de los repositorios públicos. Si trabajas en un grupo de tres, cada persona revisa a la siguiente.

**1 · Selecciona la issue.** Asígnatela mediante **Assignees** y mueve su tarjeta a `In Progress`. Anota su número. En los ejemplos se utiliza `3`: **sustitúyelo por el número real en la rama y en `Closes #3`**. GitHub comparte la numeración entre issues y pull requests, por lo que los números pueden no ser consecutivos entre tareas.

**2 · Prepara la rama.** En la carpeta del portfolio, comprueba con `git status` que no quedan cambios pendientes y ejecuta:

```bash
git switch main
git pull --ff-only
git switch -c 3-cabecera-con-nombre
```

`-c` crea la rama y cambia a ella. `--ff-only` actualiza `main` sin crear una fusión local inesperada. Si Git informa de historias divergentes, revisa los commits pendientes antes de continuar. Comprueba con `git branch --show-current` que estás en la rama de la tarea.

**3 · Implementa y comprueba.** Modifica únicamente lo acordado en la issue. En el ejemplo, agrupa el nombre, la titulación y el enlace en un `header` dentro del `body`. Conserva el resto de la página. Guarda, abre `index.html` en el navegador y verifica cada criterio. Si encuentras otra mejora, regístrala como tarea separada.

**4 · Guarda y publica la rama.** Revisa los cambios con `git diff` y registra los archivos modificados:

```bash
git add index.html
git commit -m "Anadir cabecera con nombre y titulacion"
git push -u origin 3-cabecera-con-nombre
```

Si tu tarea modifica otros archivos, añádelos también por su nombre. `-u` configura el seguimiento de la rama remota; los siguientes envíos de esta misma rama se realizan con `git push`.

**5 · Abre la pull request.** En GitHub, pulsa **Compare & pull request** o **Pull requests → New pull request**. Comprueba **base: main** y **compare: tu rama**. Escribe un título descriptivo y una descripción con el cambio, los pasos para probarlo y `Closes #3`, usando el número real. Publica la pull request y comparte su enlace con tu pareja. Si no puedes seleccionarla en **Reviewers**, puede acceder mediante el enlace y revisar el repositorio público.

**6 · Revisa antes de fusionar.** Sigue ahora el **bloque D** para probar la rama de tu pareja. La URL pública todavía muestra `main`; por eso la revisión del cambio se realiza en local. Espera también su revisión sobre tu pull request.

**7 · Atiende las correcciones.** Si te piden cambios, edita en la misma rama, comprueba el resultado, crea otro commit y ejecuta `git push`. La pull request se actualiza automáticamente; no abras otra. Solicita una nueva revisión del resultado corregido.

**8 · Fusiona.** Cuando la revisión confirme los criterios, elige **Squash and merge** en el desplegable del botón de fusión y confirma. Esta opción reúne los commits de la tarea en uno nuevo en `main`. Pulsa **Delete branch** para eliminar la rama remota ya integrada.

**9 · Comprueba el resultado.** La issue debe cerrarse, su tarjeta pasar a `Done` y **Actions** iniciar el despliegue. Espera a que termine y abre la URL pública. Si el despliegue falla, la tarea aún necesita atención: anota el fallo y corrígelo mediante otra pull request; que la tarjeta esté en `Done` no demuestra que la web funcione.

**10 · Sincroniza tu copia local.**

```bash
git switch main
git pull --ff-only
git branch -d 3-cabecera-con-nombre
```

<details class="aside aside--help">
  <summary>Si Git no permite borrar la rama tras Squash and merge</summary>
  <p>El squash crea un commit nuevo, por lo que Git puede no reconocer los commits originales como integrados. Puedes conservar la rama y seguir trabajando desde <code>main</code>. Si quieres eliminarla, comprueba primero en GitHub que la pull request está fusionada, que no quedan commits adicionales sin publicar y que <code>main</code> contiene el resultado. Solo después usa <code>git branch -D nombre-de-la-rama</code>, sustituyendo el nombre: esta opción fuerza el borrado de esa rama local.</p>
</details>

<div class="practice-levels">
  <div><strong>Objetivo esencial</strong><span>Una issue completada mediante rama, pull request, revisión documentada y comprobación del despliegue y la URL pública.</span></div>
  <div><strong>Consolidación</strong><span>Una segunda tarea pequeña con el mismo recorrido, cambiando el número de issue y el nombre de rama en cada comando.</span></div>
  <div><strong>Continuación</strong><span>Si completas y puedes explicar ambos recorridos, continúa con la sesión 3 sobre este mismo portfolio.</span></div>
</div>

#### Bloque D · Revisión de código por pares

Este bloque se realiza cuando llegas al paso 6 del bloque C. Necesitas el enlace a la pull request de tu pareja y el nombre de su rama, que aparece en la cabecera de la solicitud.

**1 · Lee la propuesta.** Abre la issue enlazada y la pestaña **Files changed** de la pull request. Identifica qué criterios debes comprobar y qué archivos han cambiado.

**2 · Descarga la rama para probarla.** Desde la carpeta de tu propio portfolio, ejecuta una sola vez esta clonación, sustituyendo `USUARIO-DEL-AUTOR` por la cuenta de tu pareja:

```bash
cd ..
git clone https://github.com/USUARIO-DEL-AUTOR/portfolio.git portfolio-auditoria
cd portfolio-auditoria
git fetch origin
git switch 3-cabecera-con-nombre
```

Sustituye también el nombre de rama por el de la pull request que revisas. En las siguientes revisiones de esa persona, entra directamente en `portfolio-auditoria`, ejecuta `git fetch origin` y cambia a la rama correspondiente. Si ya la habías descargado y recibió correcciones, actualízala con `git pull --ff-only`.

**3 · Comprueba el cambio.** Abre el `index.html` de **esa carpeta de auditoría** en el navegador. Verifica nombre, titulación y destino del enlace, o los criterios de la tarea que corresponda. No modifiques el código de tu pareja en esta copia: comunica los problemas en la pull request.

**4 · Registra la revisión.** En **Files changed → Review changes**, selecciona:

| Opción | Cuándo utilizarla |
| --- | --- |
| Comment | Necesitas aclarar algo o propones una mejora opcional. |
| Request changes | Hay un criterio incumplido; indica cómo reproducirlo y qué resultado esperabas. |
| Approve | Has probado la rama y todos los criterios se cumplen. Explica qué comprobaste. |

Una revisión útil sería: «He abierto la rama en local. Aparecen nombre y titulación, pero el enlace lleva a otro repositorio. Debe abrir el portfolio de esta cuenta». Tras la corrección, vuelve a probar y registra la aprobación. Una frase como «todo bien» no explica la comprobación realizada.

**5 · Vuelve a tu proyecto.** En la terminal de auditoría, ejecuta `git switch main` y después `cd ../portfolio`. Comprueba con `git remote -v` que has regresado a tu repositorio antes de continuar tu tarea. Cada persona debe terminar con una revisión recibida y otra realizada.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

<div class="checkpoint">
  <p class="checkpoint-label">Resultados esperados de la sesión</p>
  <ul class="checklist">
    <li>El tablero contiene seis tareas con criterios claros y estados actualizados; al menos una está completada.</li>
    <li>El portfolio y el backend tienen las reglas de protección configuradas; has comprobado el rechazo del envío directo en el portfolio.</li>
    <li>Has integrado al menos una pull request después de recibir una revisión y has revisado una pull request de tu pareja.</li>
    <li>Has verificado el despliegue y el cambio en la URL pública del portfolio.</li>
    <li>Sabes qué rama contiene tu trabajo y has sincronizado main antes de empezar otra tarea.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Autoevaluación</p>
  <ol>
    <li>¿Qué diferencia hay entre el criterio de aceptación de una tarea y la definición de terminado?</li>
    <li>¿Dónde se escribe <code>Closes #id</code> y cuándo se cierra la issue?</li>
    <li>¿Qué obliga a hacer el ruleset actual y qué sigue dependiendo de la revisión entre compañeros?</li>
    <li>¿Por qué debes probar la rama de la pull request en lugar de la URL pública?</li>
    <li>¿Qué compruebas después de fusionar?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El criterio describe un resultado concreto, como el destino de un enlace. La definición de terminado establece las comprobaciones comunes a todas las tareas.</p>
  <p>2 · En la descripción de la pull request, con el número real. La issue se cierra cuando la pull request se fusiona en la rama predeterminada; el tablero actualiza su estado si está activo el flujo correspondiente.</p>
  <p>3 · Exige una pull request y bloquea el borrado y los envíos forzados a main. Con cero aprobaciones obligatorias, eres responsable de obtener y atender la revisión antes de fusionar.</p>
  <p>4 · La URL pública muestra la versión ya desplegada desde main, que todavía no incluye la propuesta.</p>
  <p>5 · El cierre de la issue, el estado del tablero, el resultado del despliegue y el funcionamiento real de la URL pública.</p>
</details>

En la sesión 3 añadirás un check de HTML a las pull requests. La comprobación de enlaces y formato llegará en la sesión 4, y los umbrales de calidad en la 5.

## Lo que debes recordar

### El flujo de trabajo profesional

<figure class="diagram">
  <figcaption>Ciclo de vida de un cambio: de la issue a producción</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Issue</span>Definición atómica con título explícito y criterios de aceptación verificables.</li>
    <li><span class="flow-role">Rama</span>Nomenclatura <code>id-descripcion-corta</code>, bifurcada a partir de <code>main</code> sincronizada.</li>
    <li><span class="flow-role">Commit</span>Confirmación atómica con mensaje claro en modo imperativo.</li>
    <li><span class="flow-role">Pull request</span>Documentación del cambio técnico y vinculación formal con <code>Closes #id</code>.</li>
    <li><span class="flow-role">Checks</span>Comprobaciones automatizadas previas a la integración, incorporadas a partir de la sesión 3.</li>
    <li><span class="flow-role">Revisión</span>Auditoría por pares basada en la ejecución local y la verificación de criterios.</li>
    <li><span class="flow-role">Merge</span>Fusión mediante <em>Squash and merge</em>, eliminación de la rama y despliegue automático.</li>
  </ol>
</figure>

Principios metodológicos fundamentales:

| Principio de ingeniería | Justificación metodológica |
| ----------------------- | -------------------------- |
| **Despliegue continuo desde el inicio del proyecto** | Los defectos de configuración e infraestructura deben detectarse de forma temprana, cuando el coste de corrección es mínimo. |
| **Reglas de protección y revisión** | Las reglas bloquean las operaciones configuradas. La revisión comprueba además el cumplimiento de los requisitos; con cero aprobaciones obligatorias, debes obtenerla aunque la plataforma no la exija. |
| **Trazabilidad integral del historial** | El registro temporal de issues, confirmaciones, revisiones e integraciones constituye la evidencia auditable del trabajo desarrollado. |

### Glosario técnico de la unidad

| Concepto | Significado |
| -------- | ----------- |
| Issue | Unidad de trabajo atómica con criterios de aceptación verificables. Se clausura de forma automática desde la pull request vinculada. |
| Rama (*Branch*) | Línea de desarrollo independiente que aísla los cambios de código respecto a la rama principal productiva. |
| Pull request | Solicitud formal de integración de una rama secundaria en una base. Espacio central donde concurren la validación automatizada y la revisión humana. |
| Workflow | Archivo de configuración YAML ubicado en <code>.github/workflows/</code> que define tareas automatizadas en GitHub Actions, versionado conjuntamente con el código. |
| Check | Estado resultante de una comprobación automatizada en CI ejecutada sobre una pull request, configurable como condición de bloqueo de fusión. |
| Entorno de vista previa (*Preview Deployment*) | Instancia efímera generada automáticamente para evaluar una rama en un entorno idéntico a producción durante la vigencia de una pull request. En entornos estáticos estándar, se replica localmente mediante <code>git fetch</code> y <code>git switch</code>. |
| Secreto (*Secret*) | Parámetro confidencial almacenado de forma segura en el repositorio, accesible únicamente durante la ejecución de workflows autenticados. |
| Ruleset | Conjunto normativo aplicado a ramas en GitHub para hacer cumplir de manera ineludible las políticas de integración del proyecto. |
| Definición de terminado (*Definition of Done*) | Conjunto de criterios de calidad objetivos y estandarizados que todo entregable debe satisfacer antes de considerarse completado. |

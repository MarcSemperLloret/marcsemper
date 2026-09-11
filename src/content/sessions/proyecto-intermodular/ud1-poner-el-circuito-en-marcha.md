---
title: "Poner el circuito en marcha"
label: "UD1 · Arrancar"
section: "ud-01"
order: 1
lang: "es"
summary: "Preparar una URL de presentación y el circuito de issues, ramas, revisión y despliegue, preparando el método que aplicarás al backend de Servidor."
duration: "6 horas · 2 semanas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Portfolio publicado y circuito de issues, ramas y revisión de cambios funcionando."
date: "2026-09-09"
outcomes:
  - "Explicar qué evalúa este módulo y qué evalúa Desarrollo Web en Entorno Servidor sobre el mismo código."
  - "Publicar un sitio estático con GitHub Pages y el workflow de GitHub Actions que lo despliega."
  - "Leer el workflow de GitHub Actions que genera el despliegue y decir qué lo dispara."
  - "Trabajar el ciclo completo: issue, rama, commit, pull request, revisión, fusión y despliegue."
  - "Proteger la rama principal y demostrar que el circuito no se puede saltar."
requirements:
  - "Cuenta de GitHub con el correo del centro añadido."
  - "Git instalado y configurado con tu nombre y tu correo."
  - "Un editor de código."
priorKnowledge:
  - "Fundamentos de Git: clonar, hacer commit y subir cambios."
  - "HTML mínimo: un documento que abre en el navegador."
---

<p class="lead">Objetivo de la unidad: publicar un portfolio web accesible bajo una URL pública y establecer un flujo de trabajo profesional donde cualquier cambio deba superar un pipeline de integración continua y una revisión de código por pares antes de incorporarse a producción.</p>

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

En esta fase inicial es prioritario no añadir hojas de estilo ni scripts complejos. El propósito exclusivo del ejercicio es validar la conectividad de extremo a extremo del canal de entrega continua. La maquetación semántica y los componentes visuales se incorporarán progresivamente a partir de la sesión 3, canalizando cada incremento mediante ramas y revisiones formales.

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
  <p>En la siguiente sesión se establecerán las directivas de protección sobre la rama <code>main</code>. A partir de ese momento quedará bloqueada cualquier confirmación directa sobre la rama principal, requiriendo de forma estricta que cualquier cambio se canalice a través de una rama de funcionalidad, una <em>pull request</em> documentada y una revisión por pares aprobada por tu compañero de equipo.</p>
</div>

## Sesión 2 · Issues, tablero y la primera pull request

**Antes de empezar.** Con el portfolio publicado y el backend en desarrollo en Servidor, en esta sesión aprenderás a planificar requisitos técnicos mediante tareas (*issues*), estructurar el desarrollo mediante ramas de funcionalidad y validar los cambios a través de revisiones formales de código (*code review*) en *pull requests*.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Evaluación inicial · sin apuntes</p>
  <ol>
    <li>Ante un requisito formulado como «mejorar el portfolio», ¿qué elementos técnicos faltan para determinar con certeza objetiva cuándo se encuentra finalizado?</li>
    <li>En un proyecto individual, ¿qué ventajas metodológicas y de seguridad aporta aislar cada modificación en una rama independiente en lugar de trabajar directamente sobre <code>main</code>?</li>
    <li>¿Qué mecanismos de gobernanza en Git y en las plataformas de alojamiento impiden que código defectuoso o no auditado se integre en la rama de producción?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · fundamentación metodológica y demostración técnica</p>

#### Especificación de requisitos: estructura de una issue y criterios de aceptación

En ingeniería de software, la gestión eficaz de un proyecto depende de formular tareas con un alcance preciso y comprobable. Una tarea ambigua carece de valor operativo si no define con exactitud las condiciones que certifican su conclusión:

<dl class="worked">
  <dt>Formulación informal o ambigua</dt>
  <dd>«Mejorar la cabecera», «Estilos generales», «Añadir proyectos», «Revisar detalles pendientes».</dd>
  <dt>Especificación técnica como issue</dt>
  <dd>«Añadir cabecera accesible con datos personales, titulación y enlace al repositorio». «Publicar sección de proyectos con ficha descriptiva del servicio CRUD y enlace a la demo».</dd>
  <dt>Criterio diferencial</dt>
  <dd>La especificación técnica define un alcance acotado y observable. Cualquier evaluador o miembro del equipo puede contrastar el resultado de forma independiente sin requerir aclaraciones adicionales del autor.</dd>
</dl>

Cada *issue* técnica debe estructurarse atendiendo a tres directrices:

| Componente | Directriz de redacción técnica |
| ---------- | ------------------------------ |
| **Título** | Modo imperativo o infinitivo junto con el objeto específico del cambio («Añadir cabecera...», «Configurar enrutamiento...»). |
| **Criterios de aceptación** | Condiciones objetivas y comprobables que describen el estado observable («Se muestra en la zona superior...», «Al accionar el enlace se abre en nueva pestaña...»). |
| **Dimensión (Scope)** | La tarea debe ser atómica y asumible dentro de una sesión de trabajo. Si abarca múltiples componentes no relacionados, debe descomponerse en varias tareas independientes. |

<div class="rule">
  <p class="rule-label">Validación de la especificación de un requisito</p>
  <p>Un requisito técnico está correctamente formulado cuando cualquier desarrollador del equipo puede implementar y verificar la solución ateniéndose exclusivamente a su descripción y criterios de aceptación, sin necesidad de consultar al autor para descifrar el alcance esperado.</p>
</div>

#### Ramas de funcionalidad (Feature Branches) en Git

<p class="term">Rama de funcionalidad (Feature branch)</p>

En Git, una rama no es una duplicación física de archivos, sino una referencia ligera y móvil (un puntero de 41 bytes) hacia un commit específico dentro del grafo de historial (DAG). Al derivar una rama a partir de `main`, se crea una línea de desarrollo aislada que preserva intacta la versión de producción.

El desarrollo basado en ramas de funcionalidad (*Feature Branch Workflow*) aporta tres ventajas críticas:

- **Aislamiento y estabilidad del entorno productivo**: Cualquier cambio en curso, fallo temporal o refactorización permanece encapsulado sin alterar la versión estable publicada en `main`.
- **Independencia y no bloqueo entre tareas**: Si surge una corrección prioritaria o una tarea queda temporalmente bloqueada, es posible alternar a otra rama limpia derivada de `main` sin mezclar código incompleto.
- **Trazabilidad semántica y auditoría**: Cada rama vinculada a una issue convierte el historial de Git en una secuencia estructurada de aportaciones lógicas, facilitando el análisis retrospectivo y el mantenimiento.

<p class="term">Pull Request</p>

Una solicitud formal de integración de una rama secundaria en la rama principal. No es una simple operación de fusión: constituye un espacio colaborativo y auditable donde se exponen las diferencias de código (*diff*), se ejecutan los pipelines de integración continua y se documenta la discusión técnica y la aprobación entre pares antes de autorizar la incorporación definitiva.

#### Definición de terminado (Definition of Done)

<p class="term">Definición de terminado (Definition of Done - DoD)</p>

El conjunto explícito de condiciones de calidad que cualquier incremento de software debe satisfacer rigurosamente antes de ser considerado apto para producción. En este módulo se establecen cinco condiciones innegociables:

<figure class="diagram">
  <figcaption>Definición de terminado en el flujo de entrega</figcaption>
  <ol class="flow">
    <li>El desarrollo reside en una rama de funcionalidad identificada con el número de su issue correspondiente.</li>
    <li>Se ha canalizado mediante una pull request que vincula formalmente el cierre de la tarea.</li>
    <li>Todas las comprobaciones automáticas del pipeline de CI concluyen con estado favorable (verde).</li>
    <li>Se cuenta con la aprobación formal de al menos un revisor por pares tras la inspección del código.</li>
    <li>El cambio se encuentra efectivamente desplegado y operativo en la URL del entorno de producción.</li>
  </ol>
</figure>

La evaluación se focaliza en el cumplimiento de estas garantías metodológicas del ciclo de vida del software, con independencia de la complejidad visual del frontend en esta etapa inicial.

#### Gobernanza y protección de la rama principal (Branch Protection)

En desarrollo profesional, la integridad de la rama principal no se delega en la memoria o en acuerdos informales: se garantiza mediante directivas técnicas de la plataforma (**Branch Rulesets**).

Al activar la protección de `main` se aseguran tres garantías críticas:

1. **Imposibilidad de alteración no auditada**: Ninguna modificación puede incorporarse sin haber pasado por una pull request con su correspondiente revisión.
2. **Inmutabilidad y preservación de la historia**: Se bloquea la reescritura del historial (`git push --force`) y el borrado de la rama, protegiendo las evidencias temporales del proyecto.
3. **Puerta de enlace para validación continua (CI)**: Establece la infraestructura técnica necesaria para supeditar la fusión a la superación de análisis de calidad y pruebas automatizadas (incorporados en la sesión 3).

<div class="compare-pair">
  <div>
    <p class="compare-label">Rama principal desprotegida</p>
    <p class="compare-body">El cumplimiento del flujo depende de la disciplina voluntaria. Ante situaciones de urgencia o descuido, es habitual omitir revisiones y realizar confirmaciones directas, desalineando el código de los requisitos planificados y arriesgando caídas de servicio en producción.</p>
  </div>
  <div>
    <p class="compare-label">Rama principal protegida (Branch Rulesets)</p>
    <p class="compare-body">La plataforma impone el cumplimiento estricto del circuito de forma programática. Cualquier intento de confirmación directa o reescritura del historial es rechazado en el servidor remoto, garantizando que todo cambio en producción quede registrado y auditado.</p>
  </div>
</div>

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el proyecto base</p>

#### Bloque A · Planificación en GitHub Projects y especificación de issues

<p class="stage stage--solo">Trabajo individual · Definición del alcance y backlog inicial</p>

**0 · Formulación preliminar de requisitos.** Antes de abrir la plataforma, redacta de forma sintética **seis requisitos funcionales** que compondrán las primeras versiones de tu portfolio profesional (por ejemplo: cabecera semántica con datos personales, sección de proyectos vinculada al servicio backend de Servidor, listado de competencias técnicas o enlaces a perfiles profesionales). Cada requisito debe constituir una unidad de entrega independiente.

**1 · Arquitectura de datos de GitHub Projects.**

<p class="term">Tablero (GitHub Projects)</p>

Una herramienta de gestión y seguimiento basada en metodologías ágiles (Kanban) que actúa como una capa de visualización sobre las tareas del repositorio. Es fundamental distinguir que los datos (las *issues*) residen en el repositorio Git; el tablero proporciona una vista estructurada según el ciclo de vida de cada elemento. Al ser una entidad asociada a la cuenta u organización, un mismo tablero puede sincronizar y proyectar tareas procedentes de múltiples repositorios.

**2 · Creación y vinculación del tablero.**

1. En la interfaz del repositorio, accede a la pestaña **Projects**.
2. Selecciona **Link a project** y, en el menú inferior desplegable, pulsa **New project**.
3. En el asistente de selección de plantillas, escoge la modalidad **Board** (visualización Kanban por columnas).
4. Asigna como nombre `Portfolio` y confirma mediante **Create**.

**3 · Estructura de estados del ciclo de trabajo.** El tablero se inicializa con tres columnas predeterminadas: *Todo* (pendiente), *In Progress* (en desarrollo) y *Done* (completado y verificado). Estas columnas representan los posibles valores del campo de estado (**Status**), permitiendo monitorizar visualmente el flujo de entrega de cada tarea.

**4 · Automatización de transiciones de estado.** Para sincronizar automáticamente el tablero con la actividad de Git: accede al menú de configuración del tablero (**···** superior derecho) → **Workflows** y configura:

| Flujo automatizado | Acción técnica | Configuración requerida |
| ------------------ | -------------- | ----------------------- |
| **Item closed** | Al cerrarse una issue mediante una pull request o commit, su tarjeta transiciona automáticamente a *Done*. | Activado de forma predeterminada. |
| **Auto-add to project** | Cualquier nueva issue creada en el repositorio se vincula e inserta automáticamente en la columna *Todo*. | Seleccionar **Edit**, vincular el repositorio <code>portfolio</code>, establecer el filtro <code>is:issue is:open</code> y confirmar con **Save and turn on workflow**. |

<div class="rule">
  <p class="rule-label">Secuencia de activación de flujos automatizados</p>
  <p>La regla de incorporación automática opera sobre eventos generados a partir de su activación. Configurar este automatismo antes de redactar las tareas garantiza que todas las <em>issues</em> ingresen directamente en el tablero sin necesidad de vinculación manual.</p>
</div>

<details class="aside aside--help">
  <summary>Límites de automatización en cuentas estándar de GitHub</summary>
  <p>Las cuentas individuales permiten un automatismo de adición automática por tablero. Esta restricción cubre adecuadamente las necesidades del portfolio. Cuando se integre el repositorio del backend en unidades posteriores, se valorará la creación de un tablero de coordinación global o la asignación de flujos específicos.</p>
</details>

**5 · Registro formal de issues en el repositorio.** Accede a la pestaña **Issues** del repositorio y pulsa **New issue**. Registra cada uno de los seis requisitos planificados siguiendo la estructura estándar:

| Campo | Contenido requerido |
| ----- | ------------------- |
| **Add a title** | Modo imperativo o infinitivo junto al componente («Añadir cabecera con perfil profesional»). |
| **Add a description** | Criterios de aceptación observables que determinen las condiciones de entrega del requisito. |
| **Assignees** | Asignación personal al iniciar la tarea; puede mantenerse sin asignar en esta fase de definición. |
| **Labels** | Opcional en esta fase introductoria. |
| **Projects** | No requiere intervención manual: el workflow automatizado se encarga de la vinculación. |

Ejemplo de especificación de issue:

<dl class="worked">
  <dt>Título</dt>
  <dd>Añadir cabecera semántica con datos profesionales</dd>
  <dt>Descripción y criterios de aceptación</dt>
  <dd>Se muestra en la zona superior del documento el nombre completo, titulación académica y un hipervínculo funcional al repositorio de GitHub configurado para abrirse en una nueva pestaña (<code>target="_blank" rel="noopener noreferrer"</code>).</dd>
</dl>

<div class="rule">
  <p class="rule-label">Dimensionamiento y granularidad de las tareas</p>
  <p>En metodologías iterativas, definir un backlog inicial acotado a seis tareas evita la sobreplanificación de requisitos inciertos. Cada issue recibe un identificador numérico correlativo e inmutable (<code>#id</code>), el cual se utilizará para trazar las ramas de Git, las pull requests y el historial de commits.</p>
</div>

**6 · Priorización en el tablero.** Regresa al tablero de Projects. Las seis *issues* deben figurar automáticamente en la columna *Todo*. Reordena las tarjetas verticalmente situando en primer lugar las dos tareas prioritarias que abordarás en esta sesión.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación del bloque A</p>
  <ul class="checklist">
    <li>Seis issues registradas formalmente con criterios de aceptación explícitos e identificadores asignados.</li>
    <li>Las seis tareas se muestran sincronizadas en la columna <em>Todo</em> del tablero sin intervención manual.</li>
    <li>El orden de las tareas en el tablero refleja una priorización funcional coherente.</li>
  </ul>
</div>

#### Bloque B · Configuración de directivas de protección en la rama principal

<p class="stage stage--guided">Procedimiento guiado · Implantación de políticas de gobernanza en Git</p>

Las políticas de protección que se configuran a continuación en el repositorio del portfolio deben replicarse igualmente en el repositorio del backend desarrollado en Servidor, asegurando un estándar homogéneo de calidad.

**1 · Definición del conjunto de reglas (Branch Ruleset).** En GitHub, accede a **Settings → Rules → Rulesets → New ruleset → New branch ruleset**.

| Campo | Configuración requerida |
| ----- | ----------------------- |
| Ruleset Name | <code>main protegida</code> |
| Enforcement status | **Active** |
| Target branches | **Add target → Include default branch** |

**2 · Configuración de directivas de seguridad.** Activa estrictamente las siguientes directivas:

| Directiva | Finalidad técnica |
| --------- | ----------------- |
| **Restrict deletions** | Impide el borrado accidental o deliberado de la rama principal <code>main</code>. |
| **Block force pushes** | Deshabilita la reescritura forzada del historial (<code>git push --force</code>), protegiendo la inmutabilidad de los registros de auditoría. |
| **Require a pull request before merging** | Bloquea confirmaciones directas en <code>main</code>, obligando a canalizar todo cambio mediante una pull request. Se configura inicialmente con <em>Required approvals:</em> **0** para permitir la integración tras la revisión entre pares. |

<div class="rule">
  <p class="rule-label">Integración de verificaciones de estado (Status Checks)</p>
  <p>La directiva <strong>Require status checks to pass</strong> permite supeditar la fusión a la superación de pipelines de CI. En esta fase se mantiene desactivada porque GitHub exige que un workflow se haya ejecutado al menos una vez en el contexto de una pull request para poder seleccionarlo como verificación obligatoria. En la sesión 3 se incorporará el pipeline de validación estática y se activará esta directiva.</p>
</div>

<details class="aside aside--extra">
  <summary>Repositorios con despliegue en Azure Static Web Apps</summary>
  <p>Si se completó el bloque opcional de Azure en la sesión 1, el workflow generado por dicha plataforma ya incluye el evento <code>pull_request</code>. Una vez ejecutada la primera pull request del bloque C, su job de comprobación podrá ser seleccionado dentro de las comprobaciones requeridas del ruleset.</p>
</details>

**3 · Activación de la directiva.** Pulsa **Create** para persistir el conjunto de reglas.

<div class="rule">
  <p class="rule-label">Políticas de revisión por pares en repositorios públicos</p>
  <p>La configuración con cero aprobaciones técnicas obligatorias en el ruleset permite al autor completar la fusión tras recibir el visto bueno de su revisor. En repositorios públicos, cualquier miembro del equipo puede auditar el código, añadir anotaciones en líneas específicas y emitir una revisión formal con fecha y autoría verificables.</p>
</div>

**4 · Verificación técnica del bloqueo en el entorno local.** Comprueba empíricamente que la política de protección rechaza los intentos de subida directa a la rama principal:

```bash
git switch main
git pull
echo "prueba de proteccion" >> README.md
git commit -am "Verificar politica de proteccion en main"
git push
```

El servidor remoto de GitHub debe rechazar la operación con un error de protección de rama (`GH006: Protected branch hook declined`). Una vez constatado el rechazo, descarta el commit local y sincroniza el espacio de trabajo con el estado remoto:

```bash
git reset --hard origin/main
```

<div class="rule">
  <p class="rule-label">Operación atómica de sincronización con git reset</p>
  <p>El comando <code>git reset --hard origin/main</code> es una operación destructiva que descarta de forma inmediata todos los commits locales no sincronizados y devuelve el árbol de trabajo (<em>working tree</em>) y el índice (<em>index</em>) al estado exacto del commit remoto. Se utiliza en este paso exclusivamente para eliminar la confirmación de prueba local.</p>
</div>

<dl class="answer">
  <dt>¿Cuál es el código de error y mensaje exacto devuelto por GitHub al rechazar el push?</dt>
  <dd></dd>
  <dt>¿Por qué el servidor rechaza la operación incluso tratándose del propietario del repositorio?</dt>
  <dd></dd>
</dl>

#### Bloque C · El circuito entero, dos veces

<p class="stage stage--solo">Práctica individual con revisión cruzada por pares</p>

**Organización para la revisión por pares (*Peer Code Review*).** Trabaja en pareja estable durante el módulo: la revisión cruzada de código audita la calidad técnica y simula la dinámica de un equipo de desarrollo profesional; la trazabilidad de estas revisiones en GitHub forma parte de las evidencias evaluables. Intercambia con tu pareja el enlace al repositorio público para habilitar la inspección en local durante el Bloque D. En caso de número impar, se establece una rotación circular donde cada participante revisa al siguiente.

Sigue con atención el protocolo completo de diez pasos en la primera iteración. En la segunda, aplica el flujo asegurando cada comprobación técnica.

**1 · Selección y asignación de la tarea.** En el tablero del proyecto, selecciona la primera issue de la columna *Todo*. Desplázala a *In Progress* y asígnatela en el campo *Assignees* para reflejar la autoría. Anota el identificador numérico de la issue (por ejemplo, `#3`).

**2 · Creación de la rama de característica (*feature branch*).** El nombre de la rama debe incorporar como prefijo el número de la issue correspondiente para garantizar la trazabilidad entre el gestor de tareas y el historial de Git:

```bash
git switch main
git pull
git switch -c 3-cabecera-con-nombre
```

Ejecuta siempre esta secuencia estricta: sitúate en `main`, descarga la última versión sincronizada desde el remoto con `git pull` y bifurca la rama a partir de dicho estado. El modificador `-c` (abreviatura de *create*) instruye a `git switch` para crear la rama y cambiar el puntero activo a ella en una única operación. Verifica mediante `git status` o en la barra de estado del editor que te encuentras en la nueva rama antes de realizar cualquier modificación.

**3 · Desarrollo atómico.** Implementa con precisión técnica exclusivamente lo estipulado en los criterios de aceptación de la issue. Si identificas anomalías secundarias o posibles mejoras accesorias, no las incorpores en este cambio: regístralas como nuevas issues en el tablero para mantener la atomicidad del cambio.

**4 · Confirmación y publicación en el remoto.** Registra los ficheros modificados y redacta un mensaje de confirmación descriptivo en modo imperativo:

```bash
git add index.html
git commit -m "Anadir cabecera semantica con nombre y titulacion"
git push -u origin 3-cabecera-con-nombre
```

El argumento `-u` (equivalente a `--set-upstream`) vincula la rama local con la rama homónima en el repositorio remoto `origin`. Este enlace de seguimiento sólo debe configurarse en la primera publicación; en envíos sucesivos sobre esta rama, bastará ejecutar `git push`.

**5 · Apertura de la pull request.** Tras el empuje, la interfaz de GitHub mostrará la sugerencia **Compare & pull request**. Si no se visualiza, navega a la pestaña **Pull requests** → **New pull request**, seleccionando base `main` y compare `3-cabecera-con-nombre`.

| Campo | Contenido técnico requerido |
| ----- | --------------------------- |
| Título | Equivalente al título de la issue para mantener coherencia en el registro |
| Descripción | Resumen del cambio técnico implementado y vinculación formal: <code>Closes #3</code> |
| Reviewers | Asigna a tu compañero/a de revisión por pares. Si no cuenta con permisos directos de colaboración, comparte el enlace directo para que realice la revisión formal |

<div class="rule">
  <p class="rule-label">Cierre automático mediante directivas en Git y GitHub</p>
  <p>Incluir la directiva <code>Closes #3</code> (o <code>Fixes #3</code>) en el cuerpo de la pull request establece un vínculo transaccional en el motor de GitHub: cuando la solicitud se fusiona en la rama predeterminada, la issue referenciada se clausura de forma automática y su correspondiente tarjeta en GitHub Projects transiciona a <em>Done</em> sin requerir intervención manual.</p>
</div>

**6 · Notificación y solicitud de revisión.** Proporciona a tu evaluador el enlace directo a la pull request. En flujos de trabajo sin despliegues efímeros automáticos, el código en revisión reside únicamente en la rama remota de GitHub y la producción continúa sirviendo la rama `main`; el revisor deberá sincronizar la rama en su entorno local para inspeccionarla (procedimiento detallado en el Bloque D).

<details class="aside aside--extra">
  <summary>Despliegues de previsualización efímeros (Preview Deployments)</summary>
  <p>En plataformas de alojamiento avanzadas (o entornos como Azure Static Web Apps o Vercel), la apertura de una pull request desencadena un pipeline CI/CD que aprovisiona una <strong>URL de previsualización temporal</strong>. Dicho entorno efímero se destruye automáticamente al cerrar o fusionar la PR, permitiendo la verificación funcional sin descargas locales previas.</p>
</details>

**7 · Ejecución de la revisión por pares.** Tu evaluador ejecuta el protocolo de inspección del Bloque D sobre la solicitud. De forma paralela, procede a auditar la suya.

**8 · Fusión mediante *Squash and merge*.** Tras obtener la aprobación formal en la revisión, pulsa **Merge pull request**. Selecciona rigurosamente la estrategia **Squash and merge**: esta operación condensa la totalidad de confirmaciones de la rama de característica en una única confirmación atómica en `main`, preservando un historial lineal, legible y bisectable en la rama principal. A continuación, pulsa **Delete branch** para depurar la referencia remota ya integrada.

**9 · Verificación de efectos secundarios automáticos.** Inspecciona que se desencadenen los cuatro eventos sistémicos esperados:

<div class="checkpoint">
  <p class="checkpoint-label">Efectos transaccionales tras la fusión</p>
  <ul class="checklist">
    <li>La issue vinculada ha quedado clausurada automáticamente.</li>
    <li>La tarjeta asociada ha transicionado a <em>Done</em> en el tablero de proyecto.</li>
    <li>GitHub Actions ha iniciado una ejecución automática del pipeline de despliegue sobre <code>main</code>.</li>
    <li>El entorno de producción refleja las modificaciones en cuanto concluye la ejecución del workflow.</li>
  </ul>
</div>

**10 · Limpieza y sincronización local.** Antes de iniciar una nueva iteración de desarrollo, restablece el entorno local:

```bash
git switch main
git pull
git branch -d 3-cabecera-con-nombre
```

<div class="rule">
  <p class="rule-label">Higiene de ramas y prevención de bifurcaciones espurias</p>
  <p>El comando <code>git branch -d</code> elimina la rama local cuya integración ya ha sido completada en el repositorio remoto. Omitir el retorno a <code>main</code> y la ejecución de <code>git pull</code> previo a crear una nueva rama provocará que la siguiente tarea se bifurque a partir de una rama obsoleta o no sincronizada, arrastrando confirmaciones no deseadas a la subsiguiente pull request y dificultando la auditoría de código.</p>
</div>

<p class="stage stage--solo">Segunda iteración: ejecuta el ciclo completo para una nueva issue</p>

<div class="practice-levels">
  <div><strong>Objetivo esencial</strong><span>Completar el ciclo de vida íntegro de una issue con trazabilidad, revisión por pares y despliegue exitoso en producción.</span></div>
  <div><strong>Consolidación</strong><span>Culminar una segunda iteración completa, asegurando el cierre automático de las dos issues mediante sus respectivas pull requests.</span></div>
  <div><strong>Caso de estudio</strong><span>Simula un fallo de regresión introduciendo sintaxis HTML no válida en una rama y procediendo a su fusión. Observa cómo la ausencia de validación automatizada permite que el defecto alcance el entorno de producción. Este escenario fundamentará la implementación de pipelines de integración continua en la Sesión 3.</span></div>
</div>

#### Bloque D · Auditoría técnica y revisión de código (*Code Review*)

<p class="stage stage--guided">Actividad colaborativa: auditoría cruzada de solicitudes de incorporación</p>

La revisión de código por pares (*Peer Code Review*) constituye un filtro de calidad esencial en el ciclo de vida del software, cuyo propósito es garantizar el cumplimiento de los requisitos técnicos, evitar la propagación de defectos a ramas productivas y fomentar la transferencia de conocimiento entre miembros del equipo.

**Descarga y verificación en el entorno local.** Si el repositorio no dispone de entornos de despliegue efímeros con URL de previsualización, es imperativo inspeccionar el artefacto en local. En la primera ocasión, clona el repositorio del autor en un directorio independiente ajeno a tu espacio de trabajo principal:

```bash
cd ..
git clone https://github.com/USUARIO-DEL-AUTOR/portfolio.git portfolio-auditoria
cd portfolio-auditoria
```

Posteriormente, para inspeccionar cualquier rama sometida a revisión, sincroniza las referencias remotas y conmuta a la rama indicada en la pull request:

```bash
git fetch origin
git switch 3-cabecera-con-nombre
```

Abre a continuación el fichero `index.html` en el navegador web local para contrastar visualmente el comportamiento frente a los criterios de aceptación. Una vez finalizada la verificación, regresa a la rama principal con `git switch main`.

<div class="rule">
  <p class="rule-label">Rigor metodológico en la verificación</p>
  <p>Inspeccionar el código en ejecución en local complementa el análisis estático del diff. Validar que la interfaz se renderiza conforme a la especificación antes de emitir un veredicto formal previene sorpresas y fallos de integración en el entorno de despliegue final.</p>
</div>

Durante la auditoría de una pull request se evalúan sistemáticamente tres dimensiones técnicas:

| Dimensión evaluada | Procedimiento de verificación |
| ------------------ | ----------------------------- |
| **Claridad y contexto** | Evaluar el título y la descripción técnica de la PR sin examinar aún el diff. Si el propósito no resulta nítido, debe requerirse mayor documentación. |
| **Fidelidad funcional** | Contrastar el comportamiento de la rama en ejecución contra los criterios de aceptación estipulados en la issue original. |
| **Principio de responsabilidad única (Atomicidad)** | Inspeccionar la pestaña *Files changed*. Una pull request debe restringir sus modificaciones estrictamente al alcance definido, sin incluir refactorizaciones accesorias ni ficheros ajenos. |

<dl class="worked">
  <dt>Aprobación deficiente</dt>
  <dd>«Revisado y conforme 👍»</dd>
  <dt>Petición formal de modificaciones (Request changes)</dt>
  <dd>«El criterio de aceptación exige que el enlace externo se abra en una nueva pestaña mediante <code>target="_blank"</code> y <code>rel="noopener"</code>. La implementación actual navega en el mismo contexto. Se requieren cambios.»</dd>
  <dt>Aprobación técnica documentada (Approve)</dt>
  <dd>«Rama <code>3-cabecera-con-nombre</code> descargada y validada en local. La cabecera semántica incorpora correctamente la identidad y la titulación académica requeridas. Criterios de aceptación satisfechos.»</dd>
  <dt>Criterio diferenciador</dt>
  <dd>Una revisión profesional explicita <strong>qué elementos técnicos han sido auditados</strong> y valida el cumplimiento de las condiciones pactadas, aportando valor al ciclo de entrega.</dd>
</dl>

**Emisión formal del veredicto.** En la pestaña **Files changed**, selecciona el botón **Review changes** situado en el extremo superior derecho:

| Veredicto | Escenario de aplicación |
| --------- | ----------------------- |
| **Comment** | Dudas metodológicas, sugerencias menores no vinculantes o solicitud de aclaraciones que no impiden la integración |
| **Approve** | Verificación local completada y conformidad total con los criterios de aceptación técnicos |
| **Request changes** | Discrepancia con los criterios de aceptación o presencia de defectos que deben corregirse antes de autorizar la fusión en <code>main</code> |

<div class="rule">
  <p class="rule-label">Responsabilidad compartida en la calidad del código</p>
  <p>La aprobación técnica de una solicitud de incorporación no constituye un mero trámite administrativo, sino una asunción de corresponsabilidad sobre la estabilidad del código que se integra en <code>main</code>. Dado que en este estadio aún no existen comprobaciones de análisis estático automatizadas, el rigor en la revisión humana representa la única barrera de contención frente a regresiones.</p>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

<div class="checkpoint">
  <p class="checkpoint-label">Resultados esperados de la unidad</p>
  <ul class="checklist">
    <li>Entorno de producción operativo en la URL pública con enlace al repositorio de código fuente.</li>
    <li>Tablero Kanban con seis issues registradas, de las cuales al menos dos se encuentren en estado <em>Done</em> tras su integración por pull request.</li>
    <li>Rama <code>main</code> formalmente protegida mediante ruleset en GitHub, verificada mediante rechazo de envíos directos.</li>
    <li>Al menos dos pull requests integradas mediante <em>Squash and merge</em> tras recibir revisiones por pares documentadas.</li>
    <li>Registro de dos auditorías de código completadas en el repositorio de otro desarrollador.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Preguntas de autoevaluación conceptual</p>
  <ol>
    <li>¿Por qué un enunciado genérico como «mejorar el diseño» no califica como una issue viable en ingeniería de software?</li>
    <li>¿Cuál es la función técnica de la directiva <code>Closes #id</code> en la descripción de una pull request?</li>
    <li>En la configuración actual del repositorio, ¿por qué un cambio defectuoso podría integrarse en producción a pesar de haber protegido la rama?</li>
    <li>¿Qué anomalías en el historial de Git se previenen al regresar a <code>main</code> y sincronizar con <code>git pull</code> antes de crear una nueva rama?</li>
    <li>¿Qué secuencia de comandos Git permite a un revisor descargar e inspeccionar una rama remota en su entorno local?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Soluciones de autoevaluación</summary>
  <p>1 · Carece de criterios de aceptación verificables: sin una definición precisa del estado final esperado, la tarea no es estimable ni auditable en una revisión de código.</p>
  <p>2 · Se ubica en el cuerpo de la pull request e instruye al motor de GitHub para clausurar automáticamente la issue correspondiente y transicionar su estado a <em>Done</em> una vez formalizada la fusión.</p>
  <p>3 · Porque la regla <em>Require status checks to pass</em> no puede activarse hasta disponer de un pipeline de CI (integración continua) que valide las pull requests. La integridad actual del código recae exclusivamente en la auditoría humana.</p>
  <p>4 · Garantiza que la nueva rama derive del último estado estable desplegado en producción, evitando arrastrar confirmaciones espurias de ramas de trabajo precedentes.</p>
  <p>5 · <code>git fetch origin</code> para actualizar el catálogo de ramas remotas y <code>git switch nombre-de-rama</code> para posicionar el entorno local en dicha rama antes de examinarla en el navegador.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Tareas de consolidación autónoma</p>
  <ul class="checklist">
    <li>Implementar una tercera issue completa de forma autónoma, con su correspondiente pull request y auditoría técnica documentada.</li>
    <li>Depurar las ramas de características locales ya integradas mediante <code>git branch -d</code>.</li>
    <li>Mantener el repositorio local del evaluador sincronizado para futuras auditorías de código.</li>
    <li>Planificar la estructura de contenido del portfolio profesional de cara a la incorporación de comprobaciones automatizadas.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">Avance: Integración continua en la Sesión 3</p>
  <p>En la actualidad, la protección de <code>main</code> exige la apertura de pull requests pero depende exclusivamente de la auditoría humana. En la Sesión 3 diseñaremos workflows automatizados en GitHub Actions para validar sintaxis HTML, verificar enlaces rotos y auditar directrices de accesibilidad sobre cada pull request, configurando el estado de estos análisis como requisito indispensable para autorizar la integración del código.</p>
</div>

## Lo que debes recordar

### El flujo de trabajo profesional

<figure class="diagram">
  <figcaption>Ciclo de vida de un cambio: de la issue a producción</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Issue</span>Definición atómica con título explícito y criterios de aceptación verificables.</li>
    <li><span class="flow-role">Rama</span>Nomenclatura <code>id-descripcion-corta</code>, bifurcada a partir de <code>main</code> sincronizada.</li>
    <li><span class="flow-role">Commit</span>Confirmación atómica con mensaje claro en modo imperativo.</li>
    <li><span class="flow-role">Pull request</span>Documentación del cambio técnico y vinculación formal con <code>Closes #id</code>.</li>
    <li><span class="flow-role">Checks</span>Comprobaciones automatizadas que deben culminar en estado favorable previo a la integración.</li>
    <li><span class="flow-role">Revisión</span>Auditoría por pares basada en la ejecución local y la verificación de criterios.</li>
    <li><span class="flow-role">Merge</span>Fusión mediante <em>Squash and merge</em>, eliminación de la rama y despliegue automático.</li>
  </ol>
</figure>

Principios metodológicos fundamentales:

| Principio de ingeniería | Justificación metodológica |
| ----------------------- | -------------------------- |
| **Despliegue continuo desde el inicio del proyecto** | Los defectos de configuración e infraestructura deben detectarse de forma temprana, cuando el coste de corrección es mínimo. |
| **Restricciones formales y reglas de protección** | La calidad del software debe garantizarse mediante políticas del sistema (rulesets y checks) y no mediante acuerdos informales. |
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


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
  - "Git instalado y configurado con vuestro nombre y correo."
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

**Antes de empezar.** Ya tienes el portfolio publicado y has iniciado el backend en Servidor. Hoy aprenderás a organizar tareas y revisar cambios mediante ramas y pull requests.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>«Mejorar el portfolio». ¿Cómo sabríais que esa tarea está terminada?</li>
    <li>Si trabajáis solos en vuestro repositorio, ¿para qué querríais una rama?</li>
    <li>¿Qué creéis que impide, técnicamente, subir algo roto a una web publicada?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Una issue no es un recordatorio

La diferencia entre un tablero que sirve y una lista de la compra está en una sola pregunta: **¿cómo sabemos que esto está hecho?** Si la respuesta es «cuando me parezca», no es una tarea.

<dl class="worked">
  <dt>Lista de deseos</dt>
  <dd>«Mejorar la parte de arriba». «Estilos». «Sección de proyectos». «Revisar cosas».</dd>
  <dt>Issues</dt>
  <dd>«Añadir una cabecera con nombre, titulación y enlace al repositorio». «Publicar la ficha del proyecto CRUD con título, tres líneas de descripción y enlace a la demo».</dd>
  <dt>Qué cambia</dt>
  <dd>La segunda se puede terminar. Se sabe qué hay que ver en pantalla para cerrarla, cabe en una sesión y quien la revise puede comprobarla sin preguntaros.</dd>
</dl>

Cada issue de este curso lleva tres cosas:

| Parte | Cómo se escribe |
| ----- | --------------- |
| **Título** | Un verbo en infinitivo y un objeto concreto. «Añadir…», «Corregir…», «Publicar…» |
| **Criterio de aceptación** | Una o dos frases que empiezan por «Se ve…» o «Al pulsar…». Es lo que mira quien revisa |
| **Tamaño** | Si no cabe en una sesión de clase, no es una issue: son dos |

<div class="rule">
  <p class="rule-label">La prueba de que una issue está bien escrita</p>
  <p>Se la podéis dar a vuestra pareja y la puede hacer sin hablar con vosotros. Si necesita preguntaros qué querías decir, la issue está a medio escribir y el que va a perder media hora sois vosotros dentro de tres semanas, cuando ya no os acordéis.</p>
</div>

#### Una rama es una copia con nombre

<p class="term">Rama</p>

Una línea de trabajo paralela dentro del mismo repositorio. Al crear una os lleváis una copia de `main` tal como está en ese momento, y trabajáis encima sin tocar lo publicado. Podéis romperlo todo: la web pública sigue enseñando `main`.

Arriba os he preguntado para qué queréis una rama si trabajáis solos. Por tres cosas:

- **Para poder enseñar un cambio que todavía no está publicado.** Sin rama, o está en la web o no está hecho, y no hay ningún momento intermedio en el que alguien pueda mirarlo. La revisión de la que va esta sesión no cabría en ninguna parte.
- **Para que lo que está a medias no bloquee lo demás.** Si en mitad de una tarea aparece otra urgente, dejáis la rama como está, volvéis a `main` y abrís otra. Nadie tiene que terminar nada a las prisas.
- **Para que el historial cuente algo.** Una rama por issue convierte el historial en una lista de tareas hechas, en lugar de un montón de commits sueltos que no se sabe a qué venían.

<p class="term">Pull request</p>

La propuesta de meter una rama dentro de otra. No es un botón de fusionar: es una página donde vuestro cambio queda expuesto —qué líneas cambia, qué comprobaciones ha pasado, qué dice quien lo revisa— antes de que nadie decida nada. Se abre en cuanto la rama está subida, aunque el trabajo no esté terminado, y se puede seguir subiendo commits mientras está abierta: la pull request se actualiza sola.

#### Terminado quiere decir esto

<p class="term">Definición de terminado</p>

La lista de condiciones que cumple cualquier trabajo antes de considerarse hecho. Es la misma para todas las tareas del curso, se acuerda una vez y no se negocia tarea a tarea. En este módulo son cinco, y cuatro de ellas las comprueba GitHub por su cuenta:

<figure class="diagram">
  <figcaption>Terminado, en este módulo</figcaption>
  <ol class="flow">
    <li>El cambio está en una rama con el número de su issue.</li>
    <li>Ha entrado por una pull request que dice qué issue cierra.</li>
    <li>La comprobación automática está en verde.</li>
    <li>Otra persona la ha revisado. Esta es la única que no comprueba ninguna máquina.</li>
    <li>Está visible en la URL pública.</li>
  </ol>
</figure>

Fijaos en lo que **no** aparece: nada sobre si la web es bonita, si el CSS está bien escrito o si el diseño gusta. Eso se evalúa donde se enseña.

#### Por qué se cierra la rama principal

Hasta hoy podíais hacer `git push` a `main` y publicar. A partir de hoy no, y no es por desconfianza: es que **una regla que se puede saltar no es una regla, es una recomendación**.

Cuando `main` está protegida pasan tres cosas a la vez. La primera, que ningún cambio llega a la web sin pasar por una pull request, donde queda a la vista de quien quiera mirarla. La segunda, que el historial del repositorio se convierte en **una prueba** de cómo trabajasteis, porque ya no se puede reescribir a posteriori. Y la tercera llegará en la sesión 3: cuando exista un pipeline, esta misma protección impedirá que entre nada con las comprobaciones en rojo.

<div class="compare-pair">
  <div>
    <p class="compare-label">Sin protección</p>
    <p class="compare-body">El circuito depende de que os acordéis. En noviembre, con prisa, nadie se acuerda, y el tablero deja de reflejar lo que pasa en el código.</p>
  </div>
  <div>
    <p class="compare-label">Con protección</p>
    <p class="compare-body">El circuito es el único camino posible. No hay que acordarse: GitHub rechaza cualquier otra cosa, incluso si sois los dueños del repositorio.</p>
  </div>
</div>

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · El tablero y seis issues

<p class="stage stage--solo">Individual, y lo primero es decidir qué vais a construir</p>

**0 · Las seis frases.** Cinco minutos, en una nota o en un papel, sin abrir GitHub. Escribid **seis cosas que queréis que tenga vuestro portfolio**: una cabecera con vuestro nombre, una sección de proyectos, un formulario de contacto, lo que sea. Una frase cada una, tal como os salga. Todavía no son issues; son la materia prima del paso 5.

Si os atascáis, mirad dos portfolios de gente que ya terminó el ciclo y quedaos con lo que os parezca imprescindible. Y no os paséis de seis; el paso 5 explica por qué.

**1 · Antes de crear nada, qué es esto.**

<p class="term">Tablero · GitHub Projects</p>

Una vista de vuestras issues repartidas en columnas. La palabra importante es **vista**: el tablero no guarda nada. Las issues viven en el repositorio, y el tablero se limita a enseñarlas colocadas. Si borrarais el tablero, las issues seguirían ahí tan tranquilas.

De eso salen dos cosas que si no despistan bastante. Una: el tablero nace vacío aunque el repositorio ya tenga issues, porque hay que decirle cuáles mirar. Y dos: un tablero no pertenece al repositorio sino a vuestra cuenta, así que puede enseñar issues de varios repositorios a la vez.

**2 · Crear el tablero.**

1. En vuestro repositorio, pestaña **Projects**.
2. Botón verde **Link a project** y, en el desplegable que se abre, abajo, **New project**.
3. Sale un selector de plantillas. Elegid **Board**, la de las columnas. *Table* es la misma información en forma de hoja de cálculo y *Roadmap* en forma de calendario; las tres valen y se puede cambiar de vista cuando queráis, pero hoy vamos con columnas.
4. Nombre: `Portfolio`. **Create**.

Fijaos en que el botón decía *Link a project* y no *Create project*. Es por lo de antes: el tablero es vuestro, no del repositorio, y lo que habéis hecho es enlazarlo. Si algún día cerráis la pestaña y no sabéis volver, no lo busquéis en el repositorio: está en vuestro perfil de GitHub, pestaña **Projects**.

**3 · Mirar las columnas antes de tocarlas.** El tablero llega con tres: *Todo*, *In Progress* y *Done*. No son carpetas ni sitios donde se guarde nada; son los tres valores de un campo llamado **Status** que la plantilla ha creado por vosotros. Arrastrar una tarjeta de una columna a otra es cambiarle ese campo, y ya está. Se pueden añadir más, pero hoy no: con saber si algo está sin empezar, empezado o hecho, vais servidos.

**4 · Automatizarlo antes de llenarlo.** Abrid el tablero y, arriba a la derecha, el menú **···** → **Workflows**. Hay una lista de automatismos. Nos interesan dos:

| Workflow | Qué hace | Cómo lo dejáis |
| -------- | -------- | -------------- |
| **Item closed** | Al cerrarse una issue, su tarjeta pasa a *Done* sin que la toquéis | Ya viene activado. Abridlo y comprobad que es así |
| **Auto-add to project** | Cualquier issue nueva del repositorio entra sola en el tablero | Hay que encenderlo: **Edit**, elegid vuestro repositorio, dejad el filtro <code>is:issue is:open</code> y **Save and turn on workflow** |

Con esos dos, el tablero deja de ser algo que hay que mantener a mano y pasa a ser un reflejo de lo que hay en el repositorio. Un tablero que se mantiene a mano se abandona en tres semanas.

<div class="rule">
  <p class="rule-label">Por qué este paso va antes que el siguiente</p>
  <p>El automatismo recoge lo que se cree <strong>a partir de ahora</strong>, no lo que ya existe. Si escribís las seis issues primero y lo encendéis después, el tablero se queda vacío y tendréis que arrastrarlas una a una. Es el orden, no el invento.</p>
</div>

<details class="aside aside--help">
  <summary>Solo os deja un «Auto-add to project», y con un repositorio dentro</summary>
  <p>Es el límite de las cuentas gratuitas: un automatismo de ese tipo por tablero, y un único repositorio dentro de él. Hoy no molesta, porque solo tenéis el portfolio. Cuando en la UD4 entre en juego el repositorio del backend, o le hacéis su propio tablero o metéis sus issues a mano.</p>
</details>

**5 · Escribir seis issues.** Pestaña **Issues** del repositorio → botón verde **New issue**. Convertid cada una de vuestras seis frases en una issue. El formulario tiene menos cosas de las que parece:

| Campo | Qué ponéis hoy |
| ----- | -------------- |
| **Add a title** | El título: verbo en infinitivo y objeto concreto |
| **Add a description** | El criterio de aceptación, una o dos frases. Es el cuerpo de la issue |
| **Assignees** | Vosotros, y solo cuando la empecéis. Hoy se puede dejar vacío |
| **Labels** | Vacío. Sirven para clasificar, y con seis issues no hay nada que clasificar |
| **Projects** | No lo toquéis: de eso se encarga el automatismo que acabáis de encender |

Ejemplo del formato exacto:

<dl class="worked">
  <dt>Título</dt>
  <dd>Añadir la cabecera con nombre y titulación</dd>
  <dt>Cuerpo</dt>
  <dd>Se ve, en la parte superior de la página, el nombre completo, el ciclo que se está cursando y un enlace al perfil de GitHub. El enlace abre en una pestaña nueva.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Seis, ni una más</p>
  <p>La tentación es escribir veinte issues hoy y no volver a mirarlas nunca. Pero veinte issues escritas el primer día están inventadas: describen una web que todavía no sabéis cómo va a ser. Seis es más o menos lo que cabe en dos semanas. Las siguientes las escribiréis cuando sepáis algo más que hoy.</p>
</div>

Al pulsar **Create** cada issue recibe un **número**, y ese número no cambia nunca ni se reutiliza aunque la borréis. Es el que va a aparecer en el nombre de la rama, en la pull request que la cierre y en el historial del repositorio durante todo el curso. Apuntad los seis, que los vais a usar dentro de un rato.

**6 · Ordenar.** Volved al tablero: las seis tienen que estar ahí solas, en *Todo*. Subid arriba las dos que haríais hoy. Ese orden es una decisión y os la voy a preguntar.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación del bloque A</p>
  <ul class="checklist">
    <li>Seis issues abiertas, todas con criterio de aceptación y con su número apuntado.</li>
    <li>Las seis aparecen solas en el tablero, en la columna <em>Todo</em>. Si habéis tenido que arrastrar alguna, el automatismo del paso 4 no está bien puesto.</li>
    <li>Sabéis volver al tablero desde cero, sin buscarlo a ciegas.</li>
  </ul>
</div>

#### Bloque B · Cerrar la rama principal

<p class="stage stage--guided">A la vez, y al final se comprueba rompiéndolo</p>

Esto que vais a hacer ahora en el portfolio hacedlo también, hoy mismo, en el repositorio del backend que ya tenéis abierto en Servidor. Es la misma pantalla y las mismas casillas. Lo que no hay que hacer nunca es copiar código de un repositorio al otro: son dos proyectos distintos que se llevan bien, no uno partido en dos.

**1 · Crear la regla.** **Settings → Rules → Rulesets → New ruleset → New branch ruleset**.

| Campo | Valor |
| ----- | ----- |
| Ruleset Name | <code>main protegida</code> |
| Enforcement status | **Active** |
| Target branches | **Add target → Include default branch** |

**2 · Marcar estas tres reglas**, y solo estas:

| Regla | Qué impide |
| ----- | ---------- |
| **Restrict deletions** | Que alguien borre <code>main</code> |
| **Block force pushes** | Que se reescriba el historial y desaparezcan las pruebas de vuestro trabajo |
| **Require a pull request before merging** → *Required approvals:* **0** | Que entre nada sin pasar por una pull request, ni siquiera vuestro |

<div class="rule">
  <p class="rule-label">Falta una cuarta regla, y hoy no se puede poner</p>
  <p>Hay una regla más, <strong>Require status checks to pass</strong>, que impide fusionar si una comprobación automática está en rojo. Abridla y mirad la lista: está vacía. GitHub solo ofrece checks que haya visto ejecutarse sobre una pull request, y el workflow que os despliega solo se dispara con un push a <code>main</code> —lo leísteis la semana pasada, en la línea que <em>no</em> ponía <code>pull_request</code>.</p>
  <p>Así que hoy vuestra rama principal está cerrada, pero <strong>nadie comprueba nada</strong> antes de fusionar. Dejadla sin marcar y no la olvidéis: en la sesión 3 escribís el workflow que valida el HTML, los enlaces y la accesibilidad, y volvéis aquí a marcarla. Vais a ver el agujero de primera mano en el reto del bloque C.</p>
</div>

<details class="aside aside--extra">
  <summary>Si hicisteis el bloque F de la sesión 1 y tenéis Azure conectado</summary>
  <p>Entonces vosotros sí tenéis un check, porque el workflow que escribió Azure sí se dispara con <code>pull_request</code>. Seguirá sin aparecer en la lista ahora mismo, porque todavía no ha corrido nunca sobre una pull request: dejad la regla sin marcar, haced la primera vuelta del bloque C y volved aquí después. Ya estará en la lista, con el nombre del job.</p>
  <p>Marcadla. Tened claro qué comprueba y qué no: dice que el despliegue subió, no que la página esté bien. Una web rota se despliega perfectamente. El check que mira el contenido lo escribís igual en la sesión 3, y el reto del bloque C lo vais a hacer igual que el resto de la clase.</p>
</details>

**3 · Guardar** con **Create**.

<div class="rule">
  <p class="rule-label">Cero aprobaciones no significa que nadie revise</p>
  <p>Con cero aprobaciones obligatorias podéis fusionar vosotros mismos, pero solo desde una pull request. Vuestra pareja no necesita ningún permiso para revisaros: el repositorio es público, así que cualquiera con cuenta de GitHub puede entrar, comentar línea a línea y dejar su revisión. Que lo haga o no, GitHub no lo comprueba. Lo compruebo yo. Cada proyecto se entrega con las revisiones que habéis dejado en el repositorio del otro, y ésas son públicas y llevan fecha.</p>
</div>

**4 · Comprobar que os bloquea a vosotros.** Esto no es opcional: una protección que nadie ha probado no se sabe si está activa.

```bash
git switch main
git pull
echo "prueba" >> README.md
git commit -am "Probar que main esta protegida"
git push
```

Tiene que fallar. Copiad el mensaje de error; lo vais a ver muchas veces y conviene reconocerlo de un vistazo. Después deshaced el intento:

```bash
git reset --hard origin/main
```

Cuidado con ese comando, que es de los que hacen daño. Deja vuestra carpeta exactamente como está `main` en GitHub y **tira todo lo que no hayáis subido**, sin preguntar y sin papelera. Aquí es lo que queremos, porque lo único que hay sin subir es el commit de prueba que acabáis de hacer. No lo uséis con trabajo a medias encima de la mesa.

<dl class="answer">
  <dt>Mensaje exacto con el que GitHub os ha rechazado el push</dt>
  <dd></dd>
  <dt>¿Por qué os rechaza a vosotros, siendo los dueños del repositorio?</dt>
  <dd></dd>
</dl>

#### Bloque C · El circuito entero, dos veces

<p class="stage stage--solo">Individual, pero con vuestra pareja al lado: sus pull requests las revisáis vosotros</p>

**Antes de empezar, las parejas.** Poneos de dos en dos y quedaos así el resto del trimestre: vais a revisaros el trabajo mutuamente hasta diciembre, y cambiar de pareja a mitad rompe el rastro de revisiones que se evalúa en la defensa. Intercambiad las direcciones de vuestros repositorios, que las vais a necesitar en el bloque D. Si sois impares, uno de los grupos será de tres y cada cual revisa al siguiente.

La primera vuelta se hace despacio, mirando los diez pasos. La segunda sale sola.

**1 · Coger una tarea.** En el tablero, coged la primera issue de la columna *Todo*: movedla a *In Progress* y asignáosla (campo *Assignees*). Apuntad su número; supongamos que es la 3.

**2 · Crear la rama.** El nombre lleva el número de la issue delante. Es lo que permite, dentro de un mes, saber por qué existe una rama.

```bash
git switch main
git pull
git switch -c 3-cabecera-con-nombre
```

Los tres en orden: volved a `main`, traeos lo último que haya en GitHub y cread la rama a partir de ahí. La `-c` es de *create*; sin ella `git switch` os lleva a una rama que ya existe, y con ella la crea y os lleva de un golpe. Comprobad abajo a la izquierda del editor, o con `git status`, que estáis dentro de la rama nueva antes de tocar nada.

**3 · Hacer solo eso.** Únicamente lo que pide la issue. Si veis otra cosa que arreglar, se anota como issue nueva y se sigue.

**4 · Commit y subida.**

```bash
git add index.html
git commit -m "Anadir la cabecera con nombre y titulacion"
git push -u origin 3-cabecera-con-nombre
```

Este `push` lleva más cosas de lo normal porque la rama todavía no existe en GitHub: `origin` es vuestro repositorio de allí y `-u` enlaza la rama de vuestro ordenador con la suya. Solo hace falta la primera vez; a partir de ahí, dentro de esta rama, basta con `git push` a secas.

**5 · Abrir la pull request.** GitHub muestra un aviso amarillo con **Compare & pull request**. Si no aparece: pestaña **Pull requests** → **New pull request** → base `main`, compare vuestra rama.

| Campo | Qué poner |
| ----- | --------- |
| Título | El mismo que la issue |
| Descripción | Qué habéis hecho, en dos líneas, y en una línea aparte: <code>Closes #3</code> |
| Reviewers | Vuestra pareja. Si GitHub no la ofrece en la lista, por no ser colaboradora, le pasáis el enlace de la pull request y revisa igual |

<div class="rule">
  <p class="rule-label">La línea que ata el código a la tarea</p>
  <p>Escribir <code>Closes #3</code> en la descripción hace que, al fusionar, la issue 3 se cierre sola y su tarjeta pase a <em>Done</em>. Sin esa línea el tablero se convierte en un sitio donde nada se cierra nunca y hay que ir a mano. Cuesta once caracteres.</p>
</div>

**6 · Avisar a vuestra pareja.** Pasadle el enlace de la pull request. Salvo que tengáis Azure conectado, no hay ninguna URL que abrir: lo que hay publicado sigue siendo <code>main</code>, y vuestra rama no está en ningún sitio salvo en GitHub. Para verla hay que traérsela, y eso lo hace quien revisa en el bloque D.

<details class="aside aside--extra">
  <summary>Si tenéis Azure conectado</summary>
  <p>Abajo del todo aparecen los checks, y en un minuto un comentario automático con un enlace: es <strong>vuestra rama publicada en una URL temporal</strong>, que se borra al cerrar la pull request. Pasádsela a vuestra pareja junto al enlace de la pull request. En el paso 8, además, esperad a que el check esté en verde antes de fusionar.</p>
</details>

**7 · Revisión.** Vuestra pareja hace el bloque D sobre esta pull request. Mientras tanto, vosotros hacéis lo mismo con la suya.

**8 · Fusionar.** Con la revisión hecha, **Merge pull request**. Fusionar antes de que vuestra pareja haya respondido es saltarse el circuito aunque GitHub os deje. Elegid **Squash and merge**: los commits de la rama se resumen en uno solo en `main`, y el historial de la rama principal queda con una entrada por tarea. Después, **Delete branch**.

**9 · Comprobar los cuatro efectos.** Sin tocar nada más:

<div class="checkpoint">
  <p class="checkpoint-label">Lo que ocurre solo al fusionar</p>
  <ul class="checklist">
    <li>La issue 3 se ha cerrado.</li>
    <li>Su tarjeta ha pasado a <em>Done</em> en el tablero.</li>
    <li>En Actions hay un despliegue nuevo a producción.</li>
    <li>La URL pública ya muestra el cambio, en cuanto termine el despliegue de Actions.</li>
  </ul>
</div>

**10 · Volver al punto de partida.** Antes de empezar la segunda vuelta:

```bash
git switch main
git pull
git branch -d 3-cabecera-con-nombre
```

<div class="rule">
  <p class="rule-label">El error que va a cometer media clase esta semana</p>
  <p>El tercer comando borra la copia local de la rama; la de GitHub ya la borrasteis vosotros al fusionar, en el paso 8. El error es otro: empezar la segunda tarea sin volver a <code>main</code> y sin <code>git pull</code>. La rama nueva sale entonces de la anterior, la pull request incluye cambios que no le tocan y quien revisa ve el doble de lo que esperaba. Los tres comandos de arriba se hacen siempre, juntos, antes de cada rama.</p>
</div>

<p class="stage stage--solo">Segunda vuelta: repetid los diez pasos con la siguiente issue</p>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Una issue recorrida entera, con revisión de vuestra pareja y visible en la URL pública.</span></div>
  <div><strong>Si lo tenéis</strong><span>La segunda vuelta completa, y las dos issues cerradas por su pull request y no a mano.</span></div>
  <div><strong>Reto</strong><span>Romped la web a propósito: en una rama, cambiad <code>index.html</code> por algo inservible, abrid la pull request y fusionadla. Nadie os lo va a impedir, y la URL pública se rompe. Anotad cuántos minutos pasan hasta que os dais cuenta y quién debería haberlo parado. Arregladlo con otra issue y guardad las dos pull requests: son el argumento de la sesión 3.</span></div>
</div>

#### Bloque D · Revisar sin escribir «ok»

<p class="stage stage--guided">Por parejas, sobre la pull request del otro</p>

Una revisión no es un trámite de cortesía. En un equipo real es el último sitio donde un error cuesta barato.

**Primero, traeros lo que vais a revisar.** Mirad la pull request: si tiene un comentario automático con un enlace de vista previa —solo lo tendrá si esa persona conectó Azure en el bloque E—, abridlo y os ahorráis lo que viene ahora. Si no lo tiene, que es lo normal, la rama está en su repositorio y en ningún sitio más. La primera vez se clona, en una carpeta aparte y fuera de vuestro proyecto:

```bash
cd ..
git clone https://github.com/USUARIO-DE-VUESTRA-PAREJA/portfolio.git portfolio-pareja
cd portfolio-pareja
```

A partir de ahí, para cada revisión, con el nombre de rama que aparece en la cabecera de la pull request. El primer comando se trae las ramas nuevas del repositorio de esa persona sin tocar nada de lo vuestro, y el segundo os mete dentro de la suya:

```bash
git fetch origin
git switch 3-cabecera-con-nombre
```

Abrid ahora ese `index.html` con doble clic. Lo que veis en el navegador es exactamente lo que esa pull request propone publicar. Al acabar la revisión, `git switch main`.

<div class="rule">
  <p class="rule-label">Por qué se revisa así</p>
  <p>Hay servicios que publican cada rama en una URL temporal y os ahorrarían estos dos comandos. Cuando los hay, se usan. Pero no siempre los hay, y bajarse el trabajo de otra persona para ejecutarlo es lo que se hace en cualquier equipo, con o sin URL temporal. Lo vais a repetir todo el curso, así que mejor aprenderlo hoy con dos ficheros que en marzo con un backend entero.</p>
</div>

En este módulo, y sobre una web cuyo diseño no se evalúa, se miran tres cosas y solo tres:

| Se comprueba | Cómo |
| ------------ | ---- |
| **Que se entiende qué hace** | Leyendo el título y la descripción, sin abrir el código. Si no se entiende, ya hay algo que comentar |
| **Que hace lo que la issue pedía** | Con su rama abierta en vuestro navegador, comparándola con el criterio de aceptación. No se lee el código imaginándoselo: se mira |
| **Que hace solo eso** | En la pestaña *Files changed*. Un cambio que toca cinco ficheros para una tarea de uno trae cosas de más |

<dl class="worked">
  <dt>Comentario inútil</dt>
  <dd>«Ok, todo bien 👍»</dd>
  <dt>Comentario útil, pidiendo cambios</dt>
  <dd>«La issue dice que el enlace abre en pestaña nueva y en tu rama se abre en la misma. Falta ese detalle.»</dd>
  <dt>Comentario útil, aprobando</dt>
  <dd>«Bajada la rama 3 y abierta: nombre, titulación y enlace están, y el enlace abre fuera. Apruebo.»</dd>
  <dt>Qué los diferencia</dt>
  <dd>Los dos últimos dicen <strong>qué se ha mirado</strong>. Eso es lo que convierte una aprobación en una comprobación y no en una firma.</dd>
</dl>

**Cómo se deja la revisión.** En la pestaña **Files changed**, botón **Review changes** arriba a la derecha:

| Opción | Cuándo |
| ------ | ------ |
| **Comment** | Tenéis una duda pero no bloqueáis |
| **Approve** | Habéis abierto su rama en el navegador y cumple el criterio |
| **Request changes** | Falta algo del criterio. No bloquea técnicamente, pero queda escrito: fusionar con cambios pedidos sin contestarlos se ve, y se pregunta en diciembre |

<div class="rule">
  <p class="rule-label">Aprobar sin mirar es la falta grave de este módulo</p>
  <p>Vuestra aprobación no bloquea nada, y justamente por eso vale: nadie os obliga a darla, así que cuando la dais estáis afirmando que habéis mirado. Hoy además sois lo único que hay mirando, porque todavía no existe ningún check que pare nada. Si aprobáis sin bajaros la rama y luego resulta que lo publicado no cumple la issue, el fallo es de los dos. En la defensa de diciembre voy a abrir una pull request vuestra al azar y os voy a preguntar por la revisión que dejasteis.</p>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint">
  <p class="checkpoint-label">Trabajo esperado de la unidad</p>
  <ul class="checklist">
    <li>URL pública funcionando, y el repositorio público enlazado desde ella.</li>
    <li>Tablero con seis issues, dos de ellas en <em>Done</em> cerradas por su pull request.</li>
    <li><code>main</code> protegida con las tres reglas —cuatro si conectasteis Azure—, comprobado con un push rechazado.</li>
    <li>Dos pull requests fusionadas después de que vuestra pareja las revisara, con comentarios que dicen qué se miró.</li>
    <li>Dos revisiones hechas por vosotros en el repositorio de vuestra pareja.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Qué le falta a la tarea «mejorar la página de inicio» para ser una issue?</li>
    <li>¿Qué hace exactamente <code>Closes #7</code> y dónde se escribe?</li>
    <li>Hoy podéis fusionar una pull request que rompe la web publicada. ¿Qué regla falta y por qué no se ha podido activar?</li>
    <li>¿Por qué se vuelve a <code>main</code> y se hace <code>pull</code> antes de crear cada rama?</li>
    <li>Vuestra pareja quiere ver su cambio funcionando antes de aprobarlo. ¿Qué dos comandos necesita?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Un criterio de aceptación: qué se tiene que ver en pantalla para darla por hecha. Sin eso no se puede terminar ni revisar.</p>
  <p>2 · En la descripción de la pull request. Al fusionar, cierra la issue 7 y su tarjeta pasa a <em>Done</em> sola.</p>
  <p>3 · Falta <em>Require status checks to pass</em>. No se ha podido activar porque no existe todavía ninguna comprobación que se ejecute sobre una pull request: el workflow de despliegue solo corre sobre <code>main</code>. Hoy la única condición para fusionar es que haya una pull request; que lo que entra funcione depende únicamente de la revisión humana.</p>
  <p>4 · Para que la rama nueva salga de lo último publicado. Si sale de la rama anterior, la pull request arrastra cambios que no le corresponden.</p>
  <p>5 · <code>git fetch origin</code> y <code>git switch nombre-de-la-rama</code>, en su copia del repositorio de quien abrió la pull request. Después abre el <code>index.html</code> en el navegador.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 3</p>
  <ul class="checklist">
    <li>Una tercera issue recorrida entera <strong>fuera de clase</strong>, con su pull request revisada. El historial tiene que enseñar trabajo en más de un día.</li>
    <li>Ninguna rama vieja abierta en vuestro repositorio: lo fusionado se borra.</li>
    <li>Vuestra pareja clonada en una carpeta aparte, y las dos revisiones hechas con su rama abierta delante, no leyendo el diff a ojo.</li>
    <li>Traéis una idea de qué secciones va a tener el portfolio. En la sesión 3 empieza la web de verdad y se le añade un pipeline que la comprueba.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">Qué pasa en la sesión 3</p>
  <p>Hasta ahora no tenéis ningún check: <code>main</code> está cerrada, pero lo que entra por la pull request no lo comprueba nadie salvo vuestra pareja. En la sesión 3 se escribe un workflow propio que valida el HTML, busca enlaces rotos y mide accesibilidad, se ejecuta <strong>sobre cada pull request</strong> y se añade a las reglas de <code>main</code> como cuarta regla. A partir de ahí una pull request puede quedar bloqueada por algo que ni vosotros ni vuestra pareja habíais visto, y el reto del bloque C deja de poder repetirse.</p>
</div>

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>De la tarea a la URL, sin atajos</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Issue</span>Título con verbo y criterio de aceptación. Si no cabe en una sesión, son dos.</li>
    <li><span class="flow-role">Rama</span><code>numero-descripcion-corta</code>, sacada siempre de <code>main</code> actualizada.</li>
    <li><span class="flow-role">Commit</span>Un cambio, un mensaje en imperativo, una línea.</li>
    <li><span class="flow-role">Pull request</span>Con <code>Closes #n</code> y una persona asignada para revisar.</li>
    <li><span class="flow-role">Checks</span>Cuando existan, verde no será una formalidad: será la condición para poder fusionar.</li>
    <li><span class="flow-role">Revisión</span>Se baja la rama, se abre, y se dice qué se ha comprobado.</li>
    <li><span class="flow-role">Merge</span>Squash, borrar rama, y el despliegue sale solo.</li>
  </ol>
</figure>

Tres ideas que sostienen todo lo demás:

| Idea | Por qué |
| ---- | ------- |
| **Se despliega antes de tener contenido** | Los fallos de despliegue son de cuentas y permisos, no de código. Cuanto antes aparezcan, más baratos son |
| **Una regla que se puede saltar no es una regla** | Por eso <code>main</code> se protege en lugar de acordar que no se toca |
| **El historial es la prueba** | Fechas de issues, commits, pull requests y revisiones. Es lo que se evalúa aquí, y no se puede reconstruir la última semana |

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Issue | Una tarea con criterio de aceptación. Se cierra sola desde la pull request que la resuelve |
| Rama | Línea de trabajo paralela donde se puede romper todo sin tocar lo publicado |
| Pull request | Propuesta de incorporar una rama a otra. Es donde ocurren la comprobación automática y la revisión humana |
| Workflow | Fichero en <code>.github/workflows/</code> que dice qué ejecuta GitHub y cuándo. Va versionado con el proyecto |
| Check | Resultado de una comprobación automática sobre una pull request. Puede bloquear la fusión |
| Entorno de vista previa | URL temporal donde algunos proveedores publican una rama mientras su pull request está abierta. GitHub Pages no lo hace: aquí una rama se revisa trayéndosela con <code>git fetch</code> y <code>git switch</code> |
| Secreto | Credencial guardada en el repositorio, legible por los workflows y por nadie más. Nunca se escribe en un fichero. El despliegue de esta unidad no necesita ninguno: usa un permiso temporal que caduca al acabar la ejecución |
| Ruleset | Conjunto de reglas que GitHub aplica sobre una rama. Es lo que convierte el circuito en obligatorio |
| Definición de terminado | Las cinco condiciones que cumple cualquier trabajo de este módulo antes de darse por hecho |

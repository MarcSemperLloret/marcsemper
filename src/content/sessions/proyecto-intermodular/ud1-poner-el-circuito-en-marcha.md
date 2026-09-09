---
title: "Poner el circuito en marcha"
label: "UD1 · Arrancar"
section: "ud-01"
order: 1
lang: "es"
summary: "Preparar una URL de presentación y el circuito de issues, ramas, revisión y despliegue, conservando el repositorio de backend creado en Servidor."
duration: "6 horas · 2 semanas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Repositorio de GitHub, commit de cada sesión y enlaces a PR, CI y documentos comunes con Servidor."
date: "2026-09-09"
outcomes:
  - "Explicar qué evalúa este módulo y qué evalúa Desarrollo Web en Entorno Servidor sobre el mismo código."
  - "Publicar un sitio estático en Azure Static Web Apps conectado a un repositorio de GitHub."
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

**Cómo preparar los documentos.** Redacta las fichas, registros y memorias en Word, LibreOffice o un documento en línea. Conserva el original editable y usa «Exportar» o «Descargar como PDF» para guardarlo con el nombre y en la carpeta indicados. Cuando se pida ampliar un documento, modifica ese mismo original y sustituye su PDF por la versión actualizada. Comprueba que los enlaces del PDF se puedan abrir. La entrega sigue siendo el enlace al repositorio de GitHub y al commit de la sesión, con el código y los PDF correspondientes. El `README.md` es la portada técnica del repositorio y se edita como texto; las fichas y memorias se entregan en PDF.

<p class="lead">Objetivo de la unidad: que exista una URL pública con vuestro nombre y que el único camino para cambiar lo que hay en ella pase por una pull request revisada por otra persona.</p>

<div class="rule">
  <p class="rule-label">Lo que se evalúa aquí no es vuestra web</p>
  <p>La web de estas primeras semanas va a ser fea, y da igual. Lo que se mira en este módulo es <strong>cómo trabajáis</strong>: si el trabajo está troceado en issues, si entra por ramas, si alguien lo revisa, si el despliegue es automático y si el historial cuenta una semana de trabajo en lugar de una noche. La calidad del código y el diseño se evalúan en los módulos que los enseñan.</p>
</div>

<div class="rule">
  <p class="rule-label">Un producto de negocio y su presentación</p>
  <p>El CRUD elegido en Servidor se mantiene durante los dos trimestres. El portfolio es su presentación y un soporte sencillo para aprender el workflow; no sustituye ese producto. El backend conserva desde el primer día su repositorio e historial. En diciembre se demuestra una versión común: funcionamiento en Servidor y proceso de revisión, CI y despliegue en Intermodular.</p>
</div>

## Sesión 1 · Del repositorio vacío a una URL pública

**Punto de partida compartido.** Semana lectiva 1: sitúa este taller después de las sesiones 1–2 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-1). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Cuando subís un cambio a GitHub, ¿quién lo comprueba antes de que quede publicado?</li>
    <li>Habéis abierto alguna web y visto que está «en una URL». ¿Dónde está guardado ese HTML?</li>
    <li>Si mañana borrarais por error un fichero de vuestro proyecto y lo subierais, ¿qué lo pararía?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Cómo se evalúa el mismo producto en ambos módulos

Los dos módulos se imparten al mismo grupo. Servidor explica e implementa el backend; aquí se aprende a organizar, revisar, comprobar y publicar ese trabajo. Cada herramienta de workflow se introduce antes de utilizarla.

La consecuencia práctica es que el mismo código puede recibir dos notas muy distintas.

| Lo evalúa **Servidor** | Lo evalúa **este módulo** |
| ---------------------- | ------------------------- |
| Que el código esté bien construido por dentro | Que el trabajo esté troceado en tareas comprobables |
| El modelo de datos y las consultas | Que cada cambio entre por una rama y una pull request |
| La validación y el manejo de errores | Que otra persona lo haya revisado antes de fusionar |
| Que la funcionalidad haga lo que dice | Que el despliegue sea automático y repetible |
| La calidad del código | Que el historial demuestre trabajo repartido en el tiempo |

Se puede tener una web preciosa y suspender aquí. Se puede tener una presentación sencilla y sacar un diez. Si eso no pudiera pasar, os estaríamos evaluando dos veces lo mismo.

<div class="rule">
  <p class="rule-label">La consecuencia incómoda</p>
  <p>Un tablero montado entero el domingo anterior a la entrega se ve. Las issues, los commits y las pull requests llevan fecha y hora, y esas fechas deben contrastarse con revisiones y ejecuciones, porque un historial de Git puede reescribirse. La evidencia debe reflejar el trabajo realizado durante las sesiones y la aportación de cada integrante. No se puntúa acumular commits.</p>
</div>

#### El circuito

Todo lo que hagáis de aquí a diciembre pasa por estos siete pasos, con comprobaciones automáticas y revisión antes de fusionar. Hoy se prepara el circuito; la semana que viene se recorre entero.

<figure class="diagram">
  <figcaption>El circuito, de la tarea a la URL</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Issue</span>Una tarea escrita, con un criterio para saber cuándo está hecha.</li>
    <li><span class="flow-role">Rama</span>Una copia de trabajo donde se puede romper todo sin afectar a lo publicado.</li>
    <li><span class="flow-role">Commit</span>El cambio, con un mensaje que dice qué cambia.</li>
    <li><span class="flow-role">Pull request</span>La propuesta de meter ese cambio en la rama principal.</li>
    <li><span class="flow-role">Comprobación</span>GitHub Actions construye y publica una vista previa de esa propuesta.</li>
    <li><span class="flow-role">Revisión</span>Otra persona la mira y aprueba o pide cambios.</li>
    <li><span class="flow-role">Despliegue</span>Al fusionar, la URL pública se actualiza sola.</li>
  </ol>
</figure>

<p class="term">Circuito</p>

El camino obligatorio que recorre cualquier cambio desde que se decide hasta que está publicado. Se llama circuito porque no tiene atajos: si un cambio ha llegado a producción sin pasar por él, el circuito no existe, existe una costumbre.

#### Por qué se despliega hoy, con la web vacía

Lo intuitivo sería construir la web y desplegarla cuando esté presentable. Se hace justo al revés, y por una razón que no es pedagógica sino estadística: **lo que falla en un despliegue casi nunca es el código**. Es una cuenta sin verificar, un permiso que no está, un token mal copiado, un nombre repetido, una región que no admite el plan gratuito.

Si eso se descubre hoy, con una página de tres líneas, se arregla hoy. Si se descubre en diciembre con el portfolio terminado, se descubre el día de la entrega.

<div class="compare-pair">
  <div>
    <p class="compare-label">Desplegar al final</p>
    <p class="compare-body">Todos los problemas aparecen a la vez, mezclados con los del código, cuando ya no hay margen. Es el patrón que hace que un proyecto terminado no se pueda enseñar.</p>
  </div>
  <div>
    <p class="compare-label">Desplegar el primer día</p>
    <p class="compare-body">Los problemas aparecen de uno en uno y sobre algo que no importa. A partir de ahí, cada cambio se publica solo y desplegar deja de ser un evento.</p>
  </div>
</div>

#### Dónde va a vivir vuestra web

<p class="term">Azure Static Web Apps</p>

Un servicio de Microsoft que publica sitios estáticos —HTML, CSS, JavaScript— conectándose a un repositorio de GitHub. Tiene un plan gratuito que no consume crédito. Lo importante para nosotros no es Azure: es que al conectarlo **escribe él solo el workflow de GitHub Actions** que despliega en cada cambio, y que publica una vista previa por cada pull request abierta.

Esa vista previa es la pieza que hace que la revisión de la semana que viene sea real: quien revisa no lee código imaginándoselo, abre una URL y lo ve.

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · La cuenta de Azure

<p class="stage stage--solo">Individual, y lo primero de todo</p>

Se hace antes que nada porque es el único paso que depende de que un tercero os diga que sí.

1. Entrad en **azure.microsoft.com/es-es/free/students**.
2. Pulsad **Empezar gratis** e iniciad sesión con **el correo del centro**, siguiendo los requisitos de elegibilidad de la oferta. Tener ese correo no garantiza por sí solo que la suscripción sea admitida.
3. Aceptad los términos. **No se pide tarjeta de crédito.** Si en algún momento os la pide, os habéis salido de la oferta de estudiantes: volved atrás y empezad de nuevo desde el enlace anterior.
4. Cuando termine, entrad en **portal.azure.com** y comprobad que en **Suscripciones** aparece una llamada *Azure for Students*.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación del bloque A</p>
  <p>Abrís portal.azure.com y veis una suscripción activa. Si es así, el resto de la sesión va a ir rodado.</p>
</div>

<details class="aside aside--help">
  <summary>Si la verificación falla</summary>
  <p>Tres causas, en orden de frecuencia. <strong>Una:</strong> habéis usado el correo personal. Repetid con el del centro. <strong>Dos:</strong> no cumplís los requisitos de edad o de centro de la oferta; avisad al docente y utilizad el entorno alternativo acordado, pero no os quedéis parados. <strong>Tres:</strong> el dominio no está reconocido todavía; es cuestión de días y no depende de vosotros.</p>
  <p>En cualquiera de los tres casos <strong>no se pierde la sesión</strong>: seguid con el bloque B, y en el bloque C usad el plan alternativo con GitHub Pages que está al final de ese bloque. El circuito es el mismo; solo cambia quién sirve los ficheros. Cuando la cuenta esté lista, se migra sin rehacer nada.</p>
</details>

#### Bloque B · El repositorio y la página básica

<p class="stage stage--solo">Individual. Este repositorio es vuestro y os lo lleváis</p>

**1 · Crear el repositorio.** En github.com, botón **New** (o el «+» arriba a la derecha, *New repository*).

| Campo | Qué poner | Por qué |
| ----- | --------- | ------- |
| Repository name | <code>portfolio</code> | Corto y sin vuestro nombre dentro: la URL ya lo lleva |
| Description | Una línea | Se ve en vuestro perfil de GitHub |
| Visibilidad | **Public** | Obligatorio: las protecciones de rama que usaremos son de pago en repositorios privados |
| Add a README file | Sí | Para que el repositorio nazca con algo dentro y se pueda clonar |
| .gitignore | Ninguno | Todavía no hay nada que ignorar |
| License | MIT | Es vuestro trabajo y vais a enseñarlo |

**2 · Clonarlo.** En la página del repositorio, botón verde **Code**, pestaña HTTPS, copiad la dirección. En vuestra carpeta de trabajo:

```bash
git clone https://github.com/VUESTRO-USUARIO/portfolio.git
cd portfolio
```

**3 · Escribir la página más fea posible.** Cread un fichero `index.html` con esto y nada más. Sin CSS, sin imágenes, sin fuentes.

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
    <p>Esta pagina existe para comprobar que el despliegue funciona.</p>
  </body>
</html>
```

<div class="rule">
  <p class="rule-label">Resistid la tentación</p>
  <p>Alguien va a empezar a maquetar aquí. No lo hagáis. Lo que se está probando es la tubería, y una tubería se prueba con agua, no con champán. La web bonita empieza en la sesión 3, cuando cada trozo pueda entrar por su pull request.</p>
</div>

**4 · Subirlo.**

```bash
git add index.html
git commit -m "Anadir la pagina inicial del portfolio"
git push
```

**5 · El mensaje de commit.** A partir de hoy los mensajes siguen tres reglas, y se corrigen:

| Regla | Mal | Bien |
| ----- | --- | ---- |
| En imperativo, describiendo el cambio | «cambios», «update», «asdf» | «Anadir la cabecera con el nombre» |
| Una línea, menos de 72 caracteres | Un párrafo | Una frase |
| Un commit, un cambio | «Cabecera, estilos, favicon y arreglos» | Tres commits distintos |

<details class="aside aside--help">
  <summary>Si <code>git push</code> pide usuario y contraseña y la contraseña no funciona</summary>
  <p>GitHub no acepta la contraseña de la cuenta desde la línea de comandos. Instalad <strong>Git Credential Manager</strong> (viene con Git para Windows y abre una ventana del navegador la primera vez) o usad un <em>personal access token</em> como contraseña: foto de perfil → Settings → Developer settings → Personal access tokens.</p>
</details>

#### Bloque C · Conectar Azure

<p class="stage stage--guided">Se hace a la vez, paso a paso, todos a la misma pantalla</p>

**1 · Crear el recurso.** En **portal.azure.com**, buscad arriba `Static Web Apps` y pulsad **Crear** (*Create*).

**2 · Rellenar la primera pestaña.** Los nombres del portal aparecen en español o en inglés según cómo tengáis la cuenta; van los dos.

| Campo | Valor |
| ----- | ----- |
| Suscripción (*Subscription*) | Azure for Students |
| Grupo de recursos (*Resource group*) | **Crear nuevo** → <code>rg-portfolio</code> |
| Nombre (*Name*) | <code>swa-portfolio-VUESTROUSUARIO</code> |
| Tipo de plan (*Hosting plan*) | **Gratuito (Free)** |
| Región (*Region*) | West Europe |
| Origen de la implementación (*Deployment source*) | **GitHub** |

<div class="rule">
  <p class="rule-label">El plan, mirado dos veces</p>
  <p>Si el plan no dice <strong>Gratuito</strong>, paradlo. El plan Standard consume crédito de la suscripción, y ese crédito lo vais a necesitar en la segunda evaluación. No hay nada en este curso que necesite el plan de pago.</p>
</div>

**3 · Conectar GitHub.** Pulsad **Iniciar sesión con GitHub** y autorizad a Azure. Después se rellenan tres desplegables:

| Campo | Valor |
| ----- | ----- |
| Organización (*Organization*) | Vuestro usuario de GitHub |
| Repositorio (*Repository*) | <code>portfolio</code> |
| Rama (*Branch*) | <code>main</code> |

**4 · Detalles de compilación.** Es donde falla la mitad de la clase, así que copiadlo literal:

| Campo | Valor |
| ----- | ----- |
| Preajustes de compilación (*Build presets*) | **Custom** |
| Ubicación de la aplicación (*App location*) | <code>/</code> |
| Ubicación de la API (*Api location*) | *vacío* |
| Ubicación de salida (*Output location*) | *vacío* |

Vuestra web no se compila: los ficheros que hay en la raíz del repositorio son exactamente los que se publican. Cualquier otro preajuste esperaría encontrar una carpeta construida que no existe, y el despliegue fallaría diciendo que no encuentra nada que subir.

**5 · Revisar y crear.** Pestaña **Revisar y crear** → **Crear**. Tarda entre uno y tres minutos. Cuando acabe, **Ir al recurso**.

**6 · Mirar el despliegue mientras ocurre.** No abráis todavía la URL. Id a vuestro repositorio en GitHub, pestaña **Actions**. Hay un workflow ejecutándose con un punto amarillo: es Azure desplegando. Entrad, abrid el job y ved los pasos en directo.

**7 · Abrir la URL.** Cuando el punto se ponga verde, volved al portal de Azure: en la vista general del recurso está la **URL** (algo como `nombre-aleatorio.azurestaticapps.net`). Abridla. Ahí está vuestra página básica.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación del bloque C</p>
  <ul class="checklist">
    <li>La URL abre y muestra vuestro nombre.</li>
    <li>En la pestaña Actions del repositorio hay una ejecución en verde.</li>
    <li>Habéis pegado la URL en el canal de clase.</li>
  </ul>
</div>

<details class="aside aside--help">
  <summary>Los cinco fallos de este bloque, y qué son</summary>
  <p><strong>La URL da 404 o una página de bienvenida de Azure.</strong> El despliegue todavía no ha terminado, o terminó antes de que existiera el <code>index.html</code>. Mirad Actions: si está en verde y sigue mal, comprobad que el fichero se llama exactamente <code>index.html</code>, en minúsculas y en la raíz.</p>
  <p><strong>El repositorio no aparece en el desplegable.</strong> Azure no tiene permiso sobre él. Abrid github.com → Settings → Applications → Authorized OAuth Apps y revisad el acceso concedido a Azure, o repetid el paso 3.</p>
  <p><strong>El workflow sale en rojo.</strong> Abrid la ejecución y leed el paso que falló, no el resumen. Casi siempre dice que no encuentra el contenido: revisad la ubicación de la aplicación y la de salida del paso 4.</p>
  <p><strong>El nombre del recurso está cogido.</strong> El nombre forma parte de una dirección pública, así que es único en todo Azure. Añadid algo vuestro al final.</p>
  <p><strong>No hay ninguna ejecución en Actions.</strong> Azure no llegó a escribir el workflow: el recurso se creó sin conectar el repositorio. Borrad el recurso y repetid desde el paso 1.</p>
</details>

<details class="aside aside--extra">
  <summary>Plan alternativo si Azure no está disponible todavía</summary>
  <p>En vuestro repositorio: <strong>Settings → Pages → Build and deployment → Source: GitHub Actions</strong>, y elegid la plantilla <em>Static HTML</em>. GitHub escribe un workflow equivalente y publica en <code>vuestrousuario.github.io/portfolio</code>. El circuito de la sesión 2 funciona igual; lo único que pierde es la vista previa por pull request, así que en cuanto tengáis Azure hay que migrar.</p>
</details>

#### Bloque D · Leer lo que Azure ha escrito

<p class="stage stage--solo">Individual, con el fichero abierto</p>

Azure ha hecho un commit en vuestro repositorio. Traedlo:

```bash
git pull
```

Ha aparecido una carpeta `.github/workflows/` con un fichero llamado `azure-static-web-apps-algo-aleatorio.yml`. Abridlo. Es largo; interesan estos trozos.

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_... }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: ""
```

<p class="term">Workflow</p>

Un fichero que le dice a GitHub qué ejecutar y cuándo. Vive dentro del repositorio, así que va versionado como el resto: se puede leer, revisar en una pull request y romper. Es la diferencia entre un despliegue automático y un despliegue que hace siempre el mismo compañero desde su portátil.

<dl class="worked">
  <dt><code>on: push: branches: main</code></dt>
  <dd>Cada vez que algo entra en <code>main</code>, se despliega a la URL pública. Esto es lo que acabáis de ver funcionando.</dd>
  <dt><code>on: pull_request</code></dt>
  <dd>Cada vez que se abre o se actualiza una pull request también se ejecuta, pero publica en una URL temporal aparte. Esta es la línea que hace posible la revisión de la semana que viene.</dd>
  <dt><code>types: [... closed]</code> y el <code>if</code></dt>
  <dd>Cuando la pull request se cierra hay un segundo job que borra esa URL temporal. Por eso el primero pregunta si la acción no es <em>closed</em>: para no desplegar lo que se está retirando.</dd>
  <dt><code>${{ secrets.AZURE_... }}</code></dt>
  <dd>La credencial que permite subir a vuestro Azure. No está en el fichero: está guardada en el repositorio, en Settings → Secrets and variables → Actions. Comprobadlo ahora. Se ve el nombre y no se puede ver el valor, ni siquiera siendo el dueño.</dd>
  <dt><code>app_location</code> y <code>output_location</code></dt>
  <dd>Los dos valores del paso 4 del bloque anterior, escritos aquí. Si os equivocasteis en el portal, se corrigen editando este fichero, no volviendo a Azure.</dd>
</dl>

<div class="rule">
  <p class="rule-label">El motivo por el que este bloque existe</p>
  <p>Un token en un fichero del repositorio es una credencial pública para siempre, aunque luego se borre el fichero. Que Azure lo haya guardado como secreto y no escrito en el YAML es la primera decisión de seguridad del curso, y la tomó una máquina por vosotros. La segunda vez no habrá nadie tomándola.</p>
</div>

<dl class="answer">
  <dt>¿Qué dos cosas distintas disparan este workflow?</dt>
  <dd></dd>
  <dt>Si cambiáis algo y no hacéis push, ¿se despliega? ¿Por qué?</dt>
  <dd></dd>
  <dt>¿Dónde está el token y por qué no está en el fichero?</dt>
  <dd></dd>
  <dt>Nombre exacto del secreto de vuestro repositorio</dt>
  <dd></dd>
</dl>

#### Bloque E · Evidencia

<p class="stage stage--solo">Antes de salir del aula</p>

Editad el `README.md` para que tenga estas cuatro cosas y nada más. Se escribe en la rama `main` directamente porque es la última vez que se va a poder hacer: la semana que viene esa rama queda cerrada.

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la sesión 1</p>
  <ul class="checklist">
    <li>Título con vuestro nombre y una línea diciendo qué es esto.</li>
    <li>La URL pública, como enlace, en la segunda línea.</li>
    <li>Una frase explicando cómo se despliega: qué lo dispara y quién lo hace.</li>
    <li>El nombre del recurso de Azure y el del grupo de recursos, para saber dónde mirar en diciembre.</li>
  </ul>
</div>

```bash
git add README.md
git commit -m "Documentar la URL publica y como se despliega"
git push
```

Volved a Actions: hay una segunda ejecución. Ese punto verde es el circuito funcionando sin que nadie lo empuje.

---

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 1.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-01.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-01.pdf` y `sesion-02.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Por qué se despliega una página vacía el primer día en lugar de esperar a tener contenido?</li>
    <li>¿Quién ha escrito el fichero de <code>.github/workflows/</code> y cuándo?</li>
    <li>¿Qué pasa exactamente entre que hacéis <code>git push</code> y la URL cambia?</li>
    <li>¿Por qué el repositorio tiene que ser público en este curso?</li>
    <li>Un compañero abre una pull request. ¿Se despliega algo? ¿Dónde?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque lo que falla en un despliegue no suele ser el código, sino cuentas, permisos y configuración. Cuanto antes falle y menos importe lo que hay dentro, más barato es.</p>
  <p>2 · Azure, al crear el recurso conectado al repositorio, con un commit propio en <code>main</code>.</p>
  <p>3 · GitHub ve un push a <code>main</code>, arranca el workflow, este coge los ficheros de la raíz y los sube a Azure con el token guardado como secreto.</p>
  <p>4 · Porque las reglas de protección de rama que vamos a poner la semana que viene solo son gratuitas en repositorios públicos. Y porque un portfolio que no se puede enseñar no es un portfolio.</p>
  <p>5 · Sí: en una URL temporal e independiente, que se borra al cerrar la pull request.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 2</p>
  <ul class="checklist">
    <li>La URL de Azure abre y muestra vuestra página. Si no, escribid en el canal de clase antes del jueves, no el día antes de la sesión.</li>
    <li>El README tiene la URL y las cuatro cosas del bloque E.</li>
    <li>Traéis pensadas <strong>seis cosas concretas</strong> que le faltan al portfolio, en frases cortas y empezando por un verbo. Serán las issues de la próxima sesión.</li>
    <li>Sabéis quién es vuestra pareja de revisión: la lista está publicada en Aules.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">Qué pasa en la sesión 2</p>
  <p>Se cierra <code>main</code>. A partir del martes que viene ninguno vais a poder subir un cambio directamente a la rama principal, ni siquiera siendo los dueños del repositorio. Todo entrará por pull request, y ninguna se fusiona sin que vuestra pareja la haya revisado antes. La sesión consiste en montar eso y recorrerlo dos veces.</p>
</div>

## Sesión 2 · Issues, tablero y la primera pull request

**Punto de partida compartido.** Semana lectiva 2: sitúa este taller después de las sesiones 3–4 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-2). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


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

Cuando `main` está protegida pasan tres cosas a la vez. La primera, que ningún cambio llega a la web sin pasar por una pull request, donde queda a la vista de quien quiera mirarla. La segunda, que nada llega a producción con el pipeline en rojo. Y la tercera, la que os importa para la nota: el historial del repositorio se convierte en **una prueba** de cómo trabajasteis, porque ya no se puede reescribir a posteriori.

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

<p class="stage stage--solo">Individual, con las seis frases que traíais de casa</p>

**1 · Crear el tablero.** En vuestro repositorio, pestaña **Projects** → **Link a project** → **New project** → plantilla **Board** → nombre `Portfolio`.

**2 · Automatizarlo antes de llenarlo.** Dentro del proyecto, arriba a la derecha, menú **···** → **Workflows**. Activad dos:

| Workflow | Qué hace |
| -------- | -------- |
| **Auto-add to project** | Toda issue nueva del repositorio entra sola en el tablero. Filtro: <code>is:issue is:open</code> |
| **Item closed** | Al cerrarse la issue, la tarjeta pasa a *Done* sin que la mováis |

Con esos dos activados, el tablero deja de ser algo que hay que mantener a mano y pasa a ser un reflejo automático de lo que hay en el repositorio. Un tablero que se mantiene a mano se abandona en tres semanas.

**3 · Escribir seis issues.** Pestaña **Issues** → **New issue**. Convertid vuestras seis frases en issues con título y criterio de aceptación. Ejemplo del formato exacto:

<dl class="worked">
  <dt>Título</dt>
  <dd>Añadir la cabecera con nombre y titulación</dd>
  <dt>Cuerpo</dt>
  <dd>Se ve, en la parte superior de la página, el nombre completo, el ciclo que se está cursando y un enlace al perfil de GitHub. El enlace abre en una pestaña nueva.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Seis, ni una más</p>
  <p>La tentación es escribir veinte issues hoy y no volver a mirarlas. Un backlog largo escrito el primer día es un backlog inventado: describe una web que todavía no sabéis cómo va a ser. Seis tareas es lo que cabe en las próximas dos semanas, y las siguientes se escriben cuando se sepa más.</p>
</div>

**4 · Ordenar.** En el tablero, dejad las seis en *Todo* y subid arriba las dos que haríais hoy. Ese orden es una decisión y os la voy a preguntar.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación del bloque A</p>
  <ul class="checklist">
    <li>Seis issues abiertas, todas con criterio de aceptación.</li>
    <li>Las seis aparecen solas en el tablero, en la columna <em>Todo</em>.</li>
    <li>Los dos workflows están activos.</li>
  </ul>
</div>

#### Bloque B · Cerrar la rama principal

Aplica el procedimiento al portfolio y también al repositorio de backend que ya entregas en Servidor. No copies código entre ellos. En el backend todavía no existe el check de Maven: exige PR desde ahora y añade «Compilar y probar» después de su primera ejecución en Intermodular 7. Hasta entonces conserva la comprobación local de Servidor en la descripción de la PR. Si la revisión usa cero aprobaciones obligatorias, el control es docente; si requiere una aprobación, el revisor debe tener el permiso que exige GitHub.

<p class="stage stage--guided">A la vez, y al final se comprueba rompiéndolo</p>

<div class="rule">
  <p class="rule-label">Revisión y permisos del repositorio</p>
  <p>El portfolio conserva la autoría acordada; los permisos de revisión se configuran según la política del grupo. Vuestra pareja puede revisar sin ningún acceso especial, porque el repositorio es público y cualquiera con una cuenta de GitHub puede entrar en una pull request, comentar sobre las líneas y dejar su revisión. Con Required approvals en 0, GitHub exige PR y checks, pero no bloquea por ausencia de aprobación: la revisión se comprueba mediante su evidencia docente. Para exigirla técnicamente, el docente configura un revisor con permiso de escritura y al menos una aprobación, con sustitución prevista si falta. Conservad la política acordada para la autoría/equipo de Servidor.</p>
</div>

**1 · Crear la regla.** **Settings → Rules → Rulesets → New ruleset → New branch ruleset**.

| Campo | Valor |
| ----- | ----- |
| Ruleset Name | <code>main protegida</code> |
| Enforcement status | **Active** |
| Target branches | **Add target → Include default branch** |

**2 · Marcar estas cuatro reglas**, y solo estas:

| Regla | Qué impide |
| ----- | ---------- |
| **Restrict deletions** | Que alguien borre <code>main</code> |
| **Block force pushes** | Que se reescriba el historial y desaparezcan las pruebas de vuestro trabajo |
| **Require a pull request before merging** → *Required approvals:* **0** | Que entre nada sin pasar por una pull request, ni siquiera vuestro |
| **Require status checks to pass** → añadid el check de Azure | Que entre nada con el despliegue en rojo |

<details class="aside aside--help">
  <summary>Si el check de Azure no aparece en la lista para añadirlo</summary>
  <p>GitHub solo ofrece los checks que ha visto ejecutarse al menos una vez, y el vuestro solo ha corrido sobre <code>main</code>. Dejad la regla sin marcar de momento, haced la primera pull request del bloque C y volved aquí después: ya estará en la lista, con el nombre del job del workflow.</p>
</details>

**3 · Guardar** con **Create**.

<div class="rule">
  <p class="rule-label">Cero aprobaciones no significa que nadie revise</p>
  <p>Con cero aprobaciones obligatorias podéis fusionar vosotros mismos, pero solo desde una pull request y solo con los checks en verde. Quien vigila que el trabajo sea correcto es la máquina; quien vigila que <em>haga lo que la issue pedía</em> es vuestra pareja, y esa revisión no la comprueba GitHub: la comprueba la nota. Cada proyecto se entrega con las revisiones que habéis dejado en el repositorio del otro, y son públicas y llevan fecha.</p>
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

<dl class="answer">
  <dt>Mensaje exacto con el que GitHub os ha rechazado el push</dt>
  <dd></dd>
  <dt>¿Por qué os rechaza a vosotros, siendo los dueños del repositorio?</dt>
  <dd></dd>
</dl>

#### Bloque C · El circuito entero, dos veces

<p class="stage stage--solo">Individual, pero con vuestra pareja al lado: sus pull requests las revisáis vosotros</p>

La primera vuelta se hace despacio, mirando los diez pasos. La segunda sale sola.

**1 · Coger una tarea.** En el tablero, la primera issue de *Todo*: movedla a *In Progress* y asignáosla (campo *Assignees*). Apuntad su número; supongamos que es la 3.

**2 · Crear la rama.** El nombre lleva el número de la issue delante. Es lo que permite, dentro de un mes, saber por qué existe una rama.

```bash
git switch main
git pull
git switch -c 3-cabecera-con-nombre
```

**3 · Hacer solo eso.** Únicamente lo que pide la issue. Si veis otra cosa que arreglar, se anota como issue nueva y se sigue.

**4 · Commit y subida.**

```bash
git add index.html
git commit -m "Anadir la cabecera con nombre y titulacion"
git push -u origin 3-cabecera-con-nombre
```

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

**6 · Esperar a las comprobaciones.** Abajo del todo aparecen los checks. En un minuto, un comentario automático de Azure con un enlace: es **vuestra rama publicada en una URL temporal**. Abridla. Eso es lo que va a revisar vuestra pareja.

**7 · Revisión.** Vuestra pareja hace el bloque D sobre esta pull request. Mientras tanto, vosotros hacéis lo mismo con la suya.

**8 · Fusionar.** Con la revisión hecha y los checks en verde, **Merge pull request**. Fusionar antes de que vuestra pareja haya respondido es saltarse el circuito aunque GitHub os deje. Elegid **Squash and merge**: los commits de la rama se resumen en uno solo en `main`, y el historial de la rama principal queda con una entrada por tarea. Después, **Delete branch**.

**9 · Comprobar los cuatro efectos.** Sin tocar nada más:

<div class="checkpoint">
  <p class="checkpoint-label">Lo que ocurre solo al fusionar</p>
  <ul class="checklist">
    <li>La issue 3 se ha cerrado.</li>
    <li>Su tarjeta ha pasado a <em>Done</em> en el tablero.</li>
    <li>En Actions hay un despliegue nuevo a producción.</li>
    <li>La URL pública ya muestra el cambio, y la URL temporal ha dejado de existir.</li>
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
  <p>Empezar la segunda tarea sin volver a <code>main</code> y sin <code>git pull</code>. La rama nueva sale entonces de la anterior, la pull request incluye cambios que no le tocan y quien revisa ve el doble de lo que esperaba. Los tres comandos de arriba se hacen siempre, juntos, antes de cada rama.</p>
</div>

<p class="stage stage--solo">Segunda vuelta: repetid los diez pasos con la siguiente issue</p>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Una issue recorrida entera, con revisión de vuestra pareja y visible en la URL pública.</span></div>
  <div><strong>Si lo tenéis</strong><span>La segunda vuelta completa, y las dos issues cerradas por su pull request y no a mano.</span></div>
  <div><strong>Reto</strong><span>Provocad un fallo a propósito: abrid una pull request que rompa el despliegue, comprobad que el check sale en rojo y que GitHub no os deja fusionar. Después arregladlo en la misma rama y ved cómo el check se pone verde solo.</span></div>
</div>

#### Bloque D · Revisar sin escribir «ok»

<p class="stage stage--guided">Por parejas, sobre la pull request del otro</p>

Una revisión no es un trámite de cortesía. En un equipo real es el último sitio donde un error cuesta barato.

En este módulo, y sobre una web cuyo diseño no se evalúa, se miran tres cosas y solo tres:

| Se comprueba | Cómo |
| ------------ | ---- |
| **Que se entiende qué hace** | Leyendo el título y la descripción, sin abrir el código. Si no se entiende, ya hay algo que comentar |
| **Que hace lo que la issue pedía** | Abriendo la URL temporal y comparándola con el criterio de aceptación. No se lee el código imaginándoselo: se mira |
| **Que hace solo eso** | En la pestaña *Files changed*. Un cambio que toca cinco ficheros para una tarea de uno trae cosas de más |

<dl class="worked">
  <dt>Comentario inútil</dt>
  <dd>«Ok, todo bien 👍»</dd>
  <dt>Comentario útil, pidiendo cambios</dt>
  <dd>«La issue dice que el enlace abre en pestaña nueva y en la vista previa se abre en la misma. Falta ese detalle.»</dd>
  <dt>Comentario útil, aprobando</dt>
  <dd>«Comprobado en la vista previa: nombre, titulación y enlace están, y el enlace abre fuera. Apruebo.»</dd>
  <dt>Qué los diferencia</dt>
  <dd>Los dos últimos dicen <strong>qué se ha mirado</strong>. Eso es lo que convierte una aprobación en una comprobación y no en una firma.</dd>
</dl>

**Cómo se deja la revisión.** En la pestaña **Files changed**, botón **Review changes** arriba a la derecha:

| Opción | Cuándo |
| ------ | ------ |
| **Comment** | Tenéis una duda pero no bloqueáis |
| **Approve** | Habéis abierto la vista previa y cumple el criterio |
| **Request changes** | Falta algo del criterio. No bloquea técnicamente, pero queda escrito: fusionar con cambios pedidos sin contestarlos se ve, y se pregunta en diciembre |

<div class="rule">
  <p class="rule-label">Aprobar sin mirar es la falta grave de este módulo</p>
  <p>Vuestra aprobación ya no bloquea nada, y por eso vale más: es una afirmación de que habéis comprobado algo, sin ninguna máquina detrás obligándoos. Si aprobáis sin abrir la vista previa y luego lo publicado no cumple la issue, el fallo es de los dos. En la defensa de diciembre voy a abrir una pull request vuestra al azar y voy a preguntar por la revisión que dejasteis.</p>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 2.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-02.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-03.pdf` y `sesion-04.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <ul class="checklist">
    <li>URL pública en Azure funcionando, y el repositorio público enlazado desde ella.</li>
    <li>Tablero con seis issues, dos de ellas en <em>Done</em> cerradas por su pull request.</li>
    <li><code>main</code> protegida con las cuatro reglas, comprobado con un push rechazado.</li>
    <li>Dos pull requests fusionadas después de que vuestra pareja las revisara, con comentarios que dicen qué se miró.</li>
    <li>Dos revisiones hechas por vosotros en el repositorio de vuestra pareja.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Qué le falta a la tarea «mejorar la página de inicio» para ser una issue?</li>
    <li>¿Qué hace exactamente <code>Closes #7</code> y dónde se escribe?</li>
    <li>Vuestra pareja ha revisado y aprobado, pero el check está en rojo. ¿Podéis fusionar?</li>
    <li>¿Por qué se vuelve a <code>main</code> y se hace <code>pull</code> antes de crear cada rama?</li>
    <li>¿En qué se diferencia la URL que aparece en el comentario de una pull request de la URL del README?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Un criterio de aceptación: qué se tiene que ver en pantalla para darla por hecha. Sin eso no se puede terminar ni revisar.</p>
  <p>2 · En la descripción de la pull request. Al fusionar, cierra la issue 7 y su tarjeta pasa a <em>Done</em> sola.</p>
  <p>3 · No. La regla de <em>status checks</em> lo impide, y esa es justamente su función: la revisión humana y la comprobación automática son dos condiciones distintas, y esta segunda no se negocia.</p>
  <p>4 · Para que la rama nueva salga de lo último publicado. Si sale de la rama anterior, la pull request arrastra cambios que no le corresponden.</p>
  <p>5 · La del README es producción y refleja <code>main</code>. La de la pull request es temporal, refleja solo esa rama y desaparece al cerrarla.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 3</p>
  <ul class="checklist">
    <li>Una tercera issue recorrida entera <strong>fuera de clase</strong>, con su pull request revisada. El historial tiene que enseñar trabajo en más de un día.</li>
    <li>Ninguna rama vieja abierta en vuestro repositorio: lo fusionado se borra.</li>
    <li>La regla del check de Azure marcada, si os la dejasteis pendiente en el bloque B.</li>
    <li>Traéis una idea de qué secciones va a tener el portfolio. En la sesión 3 empieza la web de verdad y se le añade un pipeline que la comprueba.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">Qué pasa en la sesión 3</p>
  <p>Hasta ahora el único check que teníais es el de Azure, que solo dice si el despliegue subió. En la sesión 3 se escribe un workflow propio que valida el HTML, busca enlaces rotos y mide accesibilidad, y se añade a las reglas de <code>main</code>. A partir de ahí una pull request puede quedar bloqueada por algo que ni vosotros ni vuestra pareja habíais visto.</p>
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
    <li><span class="flow-role">Checks</span>Verde no es una formalidad: es la condición para poder fusionar.</li>
    <li><span class="flow-role">Revisión</span>Se abre la vista previa y se dice qué se ha comprobado.</li>
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
| Entorno de vista previa | URL temporal donde se publica una rama mientras su pull request está abierta. Desaparece al cerrarla |
| Secreto | Credencial guardada en el repositorio, legible por los workflows y por nadie más. Nunca se escribe en un fichero |
| Ruleset | Conjunto de reglas que GitHub aplica sobre una rama. Es lo que convierte el circuito en obligatorio |
| Definición de terminado | Las cinco condiciones que cumple cualquier trabajo de este módulo antes de darse por hecho |

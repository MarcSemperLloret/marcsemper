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

<p class="lead">Objetivo de la unidad: que exista una URL pública con vuestro nombre y que el único camino para cambiar lo que hay en ella pase por una pull request revisada por otra persona.</p>

<div class="rule">
  <p class="rule-label">Lo que se evalúa aquí no es vuestra web</p>
  <p>La web de estas primeras semanas va a ser fea, y da igual. Lo que se mira en este módulo es <strong>cómo trabajáis</strong>: si el trabajo está troceado en issues, si entra por ramas, si alguien lo revisa, si el despliegue es automático y si el historial cuenta una semana de trabajo en lugar de una noche. La calidad del código y el diseño se evalúan en los módulos que los enseñan.</p>
</div>

<div class="rule">
  <p class="rule-label">Un producto, y el escaparate del producto</p>
  <p>En Servidor vais a elegir un CRUD, y ese producto os acompaña los dos trimestres enteros. El portfolio que empezáis hoy es su escaparate, y de paso la excusa para aprender a trabajar; no lo sustituye. En cuanto arranquéis el backend allí, quedaos con ese repositorio y con su historial hasta final de curso: no se empieza de cero en enero. En diciembre se enseña una sola cosa entre los dos módulos. En Servidor se mira si funciona. Aquí se mira cómo llegasteis a que funcionara.</p>
</div>

## Sesión 1 · Del repositorio vacío a una URL pública

**Antes de empezar.** Hoy empiezas preparando un portfolio y su publicación automática. Necesitas tu cuenta de GitHub, Git y un editor. El backend se iniciará después en Servidor; para este taller basta una página HTML.

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
  <p class="rule-label">Las fechas se miran</p>
  <p>Un tablero montado entero el domingo antes de la entrega se nota. Las issues, los commits y las pull requests llevan fecha y hora, y yo las miro. Un historial de Git se puede reescribir, así que no me fío solo de él: lo cruzo con las revisiones que habéis dejado y con las ejecuciones de Actions, que ésas no se tocan. Y no cuento commits. Miro si hubo trabajo repartido en el tiempo y quién lo hizo.</p>
</div>

#### El circuito

Todo lo que hagáis de aquí a diciembre pasa por estos siete pasos. No se montan todos hoy: hoy se prepara el despliegue, la semana que viene se cierra la rama principal y se recorre el circuito entero, y en la sesión 3 se añade la comprobación automática, que es el único paso que hoy va a faltar.

<figure class="diagram">
  <figcaption>El circuito, de la tarea a la URL</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Issue</span>Una tarea escrita, con un criterio para saber cuándo está hecha.</li>
    <li><span class="flow-role">Rama</span>Una copia de trabajo donde se puede romper todo sin afectar a lo publicado.</li>
    <li><span class="flow-role">Commit</span>El cambio, con un mensaje que dice qué cambia.</li>
    <li><span class="flow-role">Pull request</span>La propuesta de meter ese cambio en la rama principal.</li>
    <li><span class="flow-role">Comprobación</span>GitHub Actions ejecuta sobre la propuesta las validaciones que hayáis escrito, y dice si pasa o no. <em>Se añade en la sesión 3.</em></li>
    <li><span class="flow-role">Revisión</span>Otra persona la mira y aprueba o pide cambios.</li>
    <li><span class="flow-role">Despliegue</span>Al fusionar, la URL pública se actualiza sola.</li>
  </ol>
</figure>

<p class="term">Circuito</p>

El camino obligatorio que recorre cualquier cambio desde que se decide hasta que está publicado. Se llama circuito porque no tiene atajos. Si un cambio puede llegar a producción sin pasarlo, lo que tenéis no es un circuito: es una costumbre, y las costumbres se saltan el día que hay prisa.

#### Por qué se despliega hoy, con la web vacía

Lo intuitivo sería construir la web y desplegarla cuando esté presentable. Aquí se hace al revés, y no por gusto: **lo que falla en un despliegue casi nunca es el código**. Es una cuenta sin verificar. Un permiso que no está. Un nombre ya cogido. Un token mal copiado. Cosas que no tienen nada que ver con lo que habéis programado y que se comen una tarde entera.

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

<p class="term">GitHub Pages</p>

El servicio con el que GitHub publica sitios estáticos —HTML, CSS, JavaScript— desde un repositorio. Es gratuito en repositorios públicos y no hay que dar de alta ninguna cuenta más: ya la tenéis. Lo importante para nosotros no es quién sirve los ficheros: es que al activarlo **se escribe un workflow de GitHub Actions** dentro de vuestro repositorio, y que a partir de ese momento cada cambio que entre en `main` se publica solo.

<div class="rule">
  <p class="rule-label">Por qué aquí y no en un proveedor de nube</p>
  <p>Esto mismo se publica igual de bien en Azure, en Cloudflare o en Netlify, y en diciembre lo haréis. Hoy no, porque todos ellos piden un alta que puede tardar días en verificarse y que no depende de vosotros. Lo que aprendéis hoy es lo mismo en cualquiera de los cuatro: que hay una URL, que se actualiza sola y que el despliegue es un fichero que podéis abrir. Mudarse de sitio, más adelante, es media hora.</p>
</div>

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · El repositorio y la página básica

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

Alguien va a empezar a maquetar aquí. No lo hagáis. Lo que estamos probando es que la tubería lleva agua de un lado a otro, y para eso da igual lo que haya dentro. La web de verdad empieza en la sesión 3, cuando cada trozo pueda entrar por su propia pull request.

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

Habréis visto que los ejemplos van sin tildes. No es dejadez mía: algunas consolas de Windows todavía guardan mal los acentos dentro del mensaje del commit, y un historial lleno de «AÃ±adir» no hay quien lo lea. Probad a escribir uno con tilde y mirad cómo queda en GitHub. Si se ve bien, seguid poniéndolas.

<details class="aside aside--help">
  <summary>Si <code>git push</code> pide usuario y contraseña y la contraseña no funciona</summary>
  <p>GitHub no acepta la contraseña de la cuenta desde la línea de comandos. Instalad <strong>Git Credential Manager</strong> (viene con Git para Windows y abre una ventana del navegador la primera vez) o usad un <em>personal access token</em> como contraseña: foto de perfil → Settings → Developer settings → Personal access tokens.</p>
</details>

#### Bloque B · Publicar con GitHub Pages

<p class="stage stage--guided">Se hace a la vez, paso a paso, todos a la misma pantalla</p>

**1 · Abrir la configuración.** En vuestro repositorio, pestaña **Settings**, arriba del todo a la derecha. En la columna de la izquierda, **Pages**.

**2 · Elegir quién despliega.** En **Build and deployment**, desplegable **Source**: cambiadlo de *Deploy from a branch* a **GitHub Actions**.

<div class="rule">
  <p class="rule-label">Los dos modos, y por qué usamos el segundo</p>
  <p><em>Deploy from a branch</em> coge una carpeta y la publica, y no queda constancia de cómo lo ha hecho. <strong>GitHub Actions</strong> escribe un fichero en vuestro repositorio y despliega ejecutándolo. Nos interesa el segundo porque ese fichero se puede abrir, se puede cambiar dentro de una pull request y se puede romper. Con una casilla de un menú no podéis hacer nada de eso.</p>
</div>

**3 · Coger la plantilla.** Debajo aparecen sugerencias de workflow. Buscad **Static HTML** y pulsad **Configure**. Se abre un editor con un fichero ya escrito, `static.yml`.

**4 · No tocar nada y confirmar.** Botón verde **Commit changes...** → dejad marcado **Commit directly to the `main` branch** → **Commit changes**.

No cambiéis nada del YAML aunque os pique. Esa plantilla publica la raíz del repositorio, que es justo donde está vuestro `index.html`, así que ya hace lo que necesitáis. En la sesión 3 escribiréis uno vuestro y ahí tocaréis lo que queráis.

**5 · Mirar el despliegue mientras ocurre.** No abráis todavía la URL. Id a la pestaña **Actions** del repositorio: hay una ejecución con un punto amarillo. Entrad, abridla y ved los pasos en directo. Son cuatro, dentro de un único trabajo llamado `deploy`: coge vuestro repositorio, prepara Pages, empaqueta los ficheros y los publica.

**6 · Abrir la URL.** Cuando esté en verde, volved a **Settings → Pages**. Arriba aparece un recuadro con **Your site is live at** y la dirección, del estilo `vuestrousuario.github.io/portfolio/`. Abridla. Ahí está vuestra página básica.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación del bloque B</p>
  <ul class="checklist">
    <li>La URL abre y muestra vuestro nombre.</li>
    <li>En la pestaña Actions del repositorio hay una ejecución en verde.</li>
    <li>Ha aparecido un fichero nuevo en <code>.github/workflows/</code> que no habéis escrito vosotros.</li>
  </ul>
</div>

<details class="aside aside--help">
  <summary>Los cuatro fallos de este bloque, y qué son</summary>
  <p><strong>La URL da 404.</strong> Lo normal la primera vez: el despliegue ha terminado pero la dirección tarda un minuto más en responder. Esperad y recargad. Si sigue, comprobad que la dirección acaba en <code>/portfolio/</code> con la barra final.</p>
  <p><strong>404 y en Actions está todo verde.</strong> El fichero no se llama exactamente <code>index.html</code>, en minúsculas, o no está en la raíz del repositorio sino dentro de una carpeta.</p>
  <p><strong>No aparece la plantilla Static HTML.</strong> Pulsad <em>browse all workflows</em> y buscad <code>static</code>. Es la que se llama «Deploy static content to Pages».</p>
  <p><strong>En Actions no hay ninguna ejecución.</strong> El desplegable <em>Source</em> se quedó en <em>Deploy from a branch</em>. Volved al paso 2; hasta que no diga <strong>GitHub Actions</strong> no se escribe ningún workflow.</p>
</details>

#### Bloque C · Leer el workflow que despliega

<p class="stage stage--solo">Individual, con el fichero abierto</p>

El commit del paso 4 lo hicisteis vosotros, pero el contenido no lo escribisteis vosotros. Traedlo:

```bash
git pull
```

Ha aparecido una carpeta `.github/workflows/` con un fichero llamado `static.yml`. Abridlo entero: es corto y hoy se lee entero.

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

<p class="term">Workflow</p>

Un fichero que le dice a GitHub qué ejecutar y cuándo. Vive dentro del repositorio, así que va versionado como el resto: se puede leer, revisar en una pull request y romper. Es la diferencia entre un despliegue automático y un despliegue que hace siempre el mismo compañero desde su portátil.

<dl class="worked">
  <dt><code>on: push: branches: ['main']</code></dt>
  <dd>Cada vez que algo entra en <code>main</code>, se despliega a la URL pública. Esto es lo que acabáis de ver funcionando.</dd>
  <dt><code>workflow_dispatch</code></dt>
  <dd>La segunda forma de dispararlo: un botón <em>Run workflow</em> en la pestaña Actions, para lanzarlo a mano sin cambiar nada. Probadlo ahora y ved que sale un despliegue idéntico.</dd>
  <dt>Lo que <strong>no</strong> pone: <code>pull_request</code></dt>
  <dd>Este workflow solo se ejecuta sobre <code>main</code>, es decir, sobre lo que ya ha entrado. Sobre una pull request no corre nada todavía. Retenedlo, porque es el agujero que abre la sesión 3.</dd>
  <dt><code>permissions: id-token: write</code></dt>
  <dd>El permiso que le da a esta ejecución, y solo a esta, el derecho a publicar. Id a Settings → Secrets and variables → Actions y comprobadlo: <strong>no hay ningún secreto guardado</strong>. Aquí no hace falta ninguna contraseña porque quien despliega y quien aloja son la misma casa.</dd>
  <dt><code>path: '.'</code></dt>
  <dd>Qué se publica: el punto es la raíz del repositorio. Si algún día vuestra web se construyera en una carpeta <code>dist</code>, esta es la línea que cambiaría.</dd>
  <dt><code>concurrency: group: 'pages'</code></dt>
  <dd>Si llegan dos cambios seguidos, no se despliegan a la vez. Evita que dos publicaciones se pisen y que la web quede a medias entre las dos.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Por qué os hago leer esto</p>
  <p>Para desplegar solo, una máquina necesita permiso para escribir en algún sitio. Ese permiso es siempre la parte frágil. Se puede dar de dos formas: guardando una credencial que dura para siempre —un <em>token</em>— o pidiendo una autorización que caduca en cuanto acaba la ejecución. Aquí se usa la segunda, y por eso no tenéis ningún secreto guardado que se os pueda escapar. En la segunda evaluación, cuando publiquéis el backend fuera de GitHub, sí habrá un token y tendréis que decidir vosotros dónde vive.</p>
</div>

<dl class="answer">
  <dt>¿Qué dos cosas distintas disparan este workflow?</dt>
  <dd></dd>
  <dt>Si cambiáis algo y no hacéis push, ¿se despliega? ¿Por qué?</dt>
  <dd></dd>
  <dt>¿Cuántos secretos hay guardados en vuestro repositorio, y por qué?</dt>
  <dd></dd>
  <dt>Si abrís una pull request, ¿se ejecuta este workflow? ¿En qué línea se ve?</dt>
  <dd></dd>
</dl>

#### Bloque D · Evidencia

<p class="stage stage--solo">Antes de salir del aula</p>

Editad el `README.md` para que tenga estas cuatro cosas y nada más. Se escribe en la rama `main` directamente porque es la última vez que se va a poder hacer: la semana que viene esa rama queda cerrada.

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la sesión 1</p>
  <ul class="checklist">
    <li>Título con vuestro nombre y una línea diciendo qué es esto.</li>
    <li>La URL pública, como enlace, en la segunda línea.</li>
    <li>Una frase explicando cómo se despliega: qué lo dispara y quién lo hace.</li>
    <li>El nombre del fichero que despliega y su ruta dentro del repositorio, para saber dónde mirar en diciembre.</li>
  </ul>
</div>

```bash
git add README.md
git commit -m "Documentar la URL publica y como se despliega"
git push
```

Volved a Actions: hay una segunda ejecución. Ese punto verde es el circuito funcionando sin que nadie lo empuje.

#### Bloque E · Opcional · Si tenéis cuenta de Azure

<p class="stage stage--solo">Opcional. Solo si os sobra tiempo y el alta de Azure os ha funcionado</p>

Vuestro portfolio ya está publicado y no necesita esto para nada. Este bloque existe porque en la segunda evaluación vais a publicar el backend en un proveedor de nube, y la primera vez que se pelea uno con un portal de nube conviene que sea con algo que no importa.

Aviso de lo que os vais a encontrar: al acabar tendréis dos workflows publicando lo mismo en dos direcciones distintas, y las dos funcionando. No está roto. Pero decidid cuál es la buena y dejadla puesta en el `README`, porque es la que voy a abrir en diciembre.

**1 · La cuenta.** Este es el paso que depende de que un tercero os diga que sí, y por eso ya no está al principio de la sesión.

1. Entrad en **azure.microsoft.com/es-es/free/students**.
2. Pulsad **Empezar gratis** e iniciad sesión con **el correo del centro**, siguiendo los requisitos de elegibilidad de la oferta. Tener ese correo no garantiza por sí solo que la suscripción sea admitida.
3. Aceptad los términos. **No se pide tarjeta de crédito.** Si en algún momento os la pide, os habéis salido de la oferta de estudiantes: volved atrás y empezad de nuevo desde el enlace anterior.
4. Entrad en **portal.azure.com** y comprobad que en **Suscripciones** aparece una llamada *Azure for Students*.

<details class="aside aside--help">
  <summary>Si la verificación falla</summary>
  <p>Tres causas, en orden de frecuencia. <strong>Una:</strong> habéis usado el correo personal. Repetid con el del centro. <strong>Dos:</strong> la oferta exige ser estudiante a tiempo completo de un centro reconocido por Microsoft, y no todos los centros lo están. <strong>Tres:</strong> el dominio no está reconocido todavía; es cuestión de días y no depende de vosotros.</p>
  <p>No perdéis nada: vuestro portfolio ya está publicado desde el bloque B y el circuito de la sesión 2 funciona igual. Este bloque es una práctica de portal de nube, no un requisito.</p>
</details>

**2 · Crear el recurso.** En **portal.azure.com**, buscad arriba `Static Web Apps` y pulsad **Crear** (*Create*).

**3 · Rellenar la primera pestaña.** Los nombres del portal aparecen en español o en inglés según cómo tengáis la cuenta; van los dos.

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

**4 · Conectar GitHub.** Pulsad **Iniciar sesión con GitHub** y autorizad a Azure. Después se rellenan tres desplegables:

| Campo | Valor |
| ----- | ----- |
| Organización (*Organization*) | Vuestro usuario de GitHub |
| Repositorio (*Repository*) | <code>portfolio</code> |
| Rama (*Branch*) | <code>main</code> |

**5 · Detalles de compilación.** Es donde falla la mitad de la clase, así que copiadlo literal:

| Campo | Valor |
| ----- | ----- |
| Preajustes de compilación (*Build presets*) | **Custom** |
| Ubicación de la aplicación (*App location*) | <code>/</code> |
| Ubicación de la API (*Api location*) | *vacío* |
| Ubicación de salida (*Output location*) | *vacío* |

Vuestra web no se compila: los ficheros que hay en la raíz del repositorio son exactamente los que se publican. Cualquier otro preajuste esperaría encontrar una carpeta construida que no existe, y el despliegue fallaría diciendo que no encuentra nada que subir.

**6 · Revisar y crear.** Pestaña **Revisar y crear** → **Crear**. Tarda entre uno y tres minutos. Cuando acabe, **Ir al recurso**.

**7 · Mirar el despliegue mientras ocurre.** No abráis todavía la URL. Id a vuestro repositorio en GitHub, pestaña **Actions**. Hay un workflow ejecutándose con un punto amarillo: es Azure desplegando. Entrad, abrid el job y ved los pasos en directo.

**8 · Abrir la URL.** Cuando el punto se ponga verde, volved al portal de Azure: en la vista general del recurso está la **URL** (algo como `nombre-aleatorio.azurestaticapps.net`). Abridla. Ahí está vuestra página básica.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación del bloque E</p>
  <ul class="checklist">
    <li>La URL abre y muestra vuestro nombre.</li>
    <li>En la pestaña Actions del repositorio hay una ejecución en verde.</li>
    <li>Habéis abierto la URL publicada y comprobado su contenido.</li>
  </ul>
</div>

<details class="aside aside--help">
  <summary>Los cinco fallos de este bloque, y qué son</summary>
  <p><strong>La URL da 404 o una página de bienvenida de Azure.</strong> El despliegue todavía no ha terminado, o terminó antes de que existiera el <code>index.html</code>. Mirad Actions: si está en verde y sigue mal, comprobad que el fichero se llama exactamente <code>index.html</code>, en minúsculas y en la raíz.</p>
  <p><strong>El repositorio no aparece en el desplegable.</strong> Azure no tiene permiso sobre él. Abrid github.com → Settings → Applications → Authorized OAuth Apps y revisad el acceso concedido a Azure, o repetid el paso 4.</p>
  <p><strong>El workflow sale en rojo.</strong> Abrid la ejecución y leed el paso que falló, no el resumen. Casi siempre dice que no encuentra el contenido: revisad la ubicación de la aplicación y la de salida del paso 5.</p>
  <p><strong>El nombre del recurso está cogido.</strong> El nombre forma parte de una dirección pública, así que es único en todo Azure. Añadid algo vuestro al final.</p>
  <p><strong>No hay ninguna ejecución en Actions.</strong> Azure no llegó a escribir el workflow: el recurso se creó sin conectar el repositorio. Borrad el recurso y repetid desde el paso 2.</p>
</details>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


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
  <p>2 · Lo escribió GitHub, como plantilla, al elegir <em>Static HTML</em>; el commit que lo metió en <code>main</code> lo hicisteis vosotros desde el navegador.</p>
  <p>3 · GitHub ve un push a <code>main</code>, arranca el workflow, este empaqueta los ficheros de la raíz y los publica, con un permiso temporal y sin ninguna credencial guardada.</p>
  <p>4 · Porque las reglas de protección de rama que vamos a poner la semana que viene solo son gratuitas en repositorios públicos. Y porque un portfolio que no se puede enseñar no es un portfolio.</p>
  <p>5 · No. El workflow solo se dispara con un push a <code>main</code>, y una pull request abierta todavía no ha entrado en <code>main</code>. Hoy no hay nada que compruebe una pull request antes de fusionarla: ese hueco es el trabajo de la sesión 3.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Al terminar la sesión</p>
  <ul class="checklist">
    <li>La URL pública abre y muestra vuestra página; si hay un fallo, podéis identificar el paso y el mensaje de error.</li>
    <li>El README tiene la URL y las cuatro cosas del bloque E.</li>
    <li>Podéis localizar el workflow y explicar qué cambio dispara una publicación.</li>
    <li>Habéis comprobado que un segundo cambio actualiza la página mediante el mismo circuito.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">Qué pasa en la sesión 2</p>
  <p>Se cierra <code>main</code>. En la próxima sesión ninguno vais a poder subir un cambio directamente a la rama principal, ni siquiera siendo los dueños del repositorio. Todo entrará por pull request, y ninguna se fusiona sin que vuestra pareja la haya revisado antes. La sesión consiste en montar eso y recorrerlo dos veces.</p>
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
  <p>La tentación es escribir veinte issues hoy y no volver a mirarlas nunca. Pero veinte issues escritas el primer día están inventadas: describen una web que todavía no sabéis cómo va a ser. Seis es más o menos lo que cabe en dos semanas. Las siguientes las escribiréis cuando sepáis algo más que hoy.</p>
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
  <summary>Si hicisteis el bloque E de la sesión 1 y tenéis Azure conectado</summary>
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

La primera vuelta se hace despacio, mirando los diez pasos. La segunda sale sola.

**1 · Coger una tarea.** En el tablero, coged la primera issue de la columna *Todo*: movedla a *In Progress* y asignáosla (campo *Assignees*). Apuntad su número; supongamos que es la 3.

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
  <p>Empezar la segunda tarea sin volver a <code>main</code> y sin <code>git pull</code>. La rama nueva sale entonces de la anterior, la pull request incluye cambios que no le tocan y quien revisa ve el doble de lo que esperaba. Los tres comandos de arriba se hacen siempre, juntos, antes de cada rama.</p>
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

A partir de ahí, para cada revisión, con el nombre de rama que aparece en la cabecera de la pull request:

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

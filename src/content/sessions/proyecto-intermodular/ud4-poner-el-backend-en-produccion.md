---
title: "Poner el backend en producción"
label: "UD4 · Conectar"
section: "ud-04"
order: 4
lang: "es"
summary: "Llevar al circuito la API que se está construyendo en Servidor —repositorio propio, CI que compila y prueba, despliegue en Azure App Service— y escribir el cliente que la consume: listar, crear, modificar y borrar desde el portfolio."
duration: "15 horas · 5 sesiones de 3 h"
modality: "Taller · el 80 % de la sesión es trabajo del alumnado"
deliverable: "API desplegada en una URL pública con su propio pipeline, y el CRUD completo funcionando desde el portfolio publicado."
date: "2026-09-09"
outcomes:
  - "Poner un proyecto Java bajo el mismo circuito de trabajo que el portfolio."
  - "Escribir un CI que compila y ejecuta los tests, y explicar en qué se diferencia de uno que pasa linters."
  - "Desplegar una aplicación de Spring Boot en Azure App Service desde GitHub Actions."
  - "Diagnosticar un fallo de arranque en producción leyendo el registro del servicio."
  - "Explicar qué es CORS y configurarlo sin abrirlo a todo el mundo."
  - "Consumir una API desde el navegador contemplando carga, error y vacío."
  - "Escribir contra la API creando, modificando y borrando, con los errores de validación junto al campo que los provoca."
  - "Coordinar dos piezas que se despliegan por separado y saber qué se rompe cuando una va por delante."
requirements:
  - "El portfolio de las unidades anteriores, publicado y con su pipeline."
  - "La API de Spring Boot que estáis construyendo en Desarrollo Web en Entorno Servidor."
  - "Java y Maven instalados, y la API arrancando en local."
priorKnowledge:
  - "El circuito completo: issue, rama, pull request, revisión, fusión y despliegue."
  - "De Servidor: controladores REST, DTO, validación y manejo de errores."
---

<p class="lead">Vuestra API funciona en el portátil de quien la escribió. Este proyecto consiste en que funcione en una URL, con el mismo circuito que el portfolio, y en que el portfolio la use.</p>

<div class="rule">
  <p class="rule-label">Quién evalúa qué, otra vez</p>
  <p>El código de la API es de <strong>Servidor</strong>: sus capas, sus validaciones, sus errores y sus tests. Aquí no se corrige nada de eso. Lo que se evalúa aquí es que ese código viva en un repositorio con su circuito, que un pipeline lo compile y lo pruebe antes de dejarlo entrar, que esté desplegado y que el portfolio lo consuma. Podéis tener la mejor API de la clase y suspender esta unidad si solo existe en vuestro ordenador.</p>
</div>

<div class="rule">
  <p class="rule-label">Sin base de datos, y se dice</p>
  <p>Se despliega el mismo CRUD que elegisteis y estáis construyendo en Servidor. La primera publicación puede guardar datos en memoria: esa limitación se documenta. PostgreSQL llega en la UD5 de Servidor, dentro del <strong>primer trimestre</strong>, y desde entonces se publica la versión persistente por este mismo workflow. No se crea otra API para Intermodular.</p>
</div>

### Los hitos compartidos del primer trimestre

| Lo que entrega Servidor | Lo que se trabaja aquí |
| --- | --- |
| CRUD en memoria con DTO, validación y errores, al terminar la UD3 | Repositorio del backend, CI y primera puesta en producción |
| Capas y tests de servicio, en la UD4 | Ejecutar las pruebas en cada pull request y comprobar que un fallo bloquea la fusión |
| CRUD con PostgreSQL y tests de repositorio, en la UD5 | Configurar la base de datos del entorno desplegado, sus variables y el entorno de pruebas del CI; publicar la misma API persistente |
| Versión del primer trimestre revisada y defendida, en la UD6 | Identificar el mismo commit desplegado y conservar las evidencias del workflow, CI, revisiones y puesta en producción |

Los hitos se coordinan por versión disponible: no se exige una funcionalidad antes de trabajarla en Servidor. Las cinco sesiones de esta unidad se mantienen. El circuito que queda montado se sigue utilizando con cada avance del backend hasta el cierre del trimestre. Si al terminar la sesión 11 todavía falta parte de la UD5 de Servidor, se publica la versión disponible y sus siguientes mejoras recorren el mismo circuito; la entrega del trimestre sí incluye persistencia en producción.

## Sesión 7 · El segundo repositorio

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Vuestra API arranca en local. ¿Qué haría falta para que la usara alguien que no está en esta aula?</li>
    <li>El pipeline del portfolio comprueba HTML, enlaces, formato y accesibilidad. ¿Qué tendría que comprobar el de una API?</li>
    <li>¿Qué carpetas de vuestro proyecto de Java no deberían subirse nunca a un repositorio?</li>
  </ol>
</div>

---

### Se explica

#### Dos repositorios, y por qué no uno

El portfolio y la API son dos cosas distintas: se escriben en lenguajes distintos, se compilan de forma distinta, se despliegan en sitios distintos y se rompen por motivos distintos. Van a vivir en dos repositorios.

<div class="compare-pair">
  <div>
    <p class="compare-label">Todo junto</p>
    <p class="compare-body">Un repositorio con la web y el proyecto Java dentro. Cada cambio en el HTML dispara la compilación de la API, y el portfolio que os lleváis arrastra un proyecto de backend que no tiene nada que ver con él.</p>
  </div>
  <div>
    <p class="compare-label">Separados</p>
    <p class="compare-body">Cada uno con su pipeline, su ritmo y su versión. Es como está montado casi cualquier producto que vayáis a tocar fuera, y obliga a aprender lo que de verdad cuesta: que dos piezas independientes se pongan de acuerdo.</p>
  </div>
</div>

#### Un CI que compila no se parece al que ya tenéis

El pipeline del portfolio ejecuta herramientas que **miran** los ficheros. El de la API hace algo más ambicioso: **construye el proyecto entero** y **ejecuta sus tests**. Si algo no compila, no hay nada que revisar.

| Vuestro CI del portfolio | El CI de la API |
| ------------------------ | --------------- |
| Comprueba que los ficheros cumplen unas reglas | Compila el código fuente a un artefacto ejecutable |
| Falla por un enlace muerto o un contraste bajo | Falla por un error de compilación o un test en rojo |
| Tarda segundos | Tarda minutos: descarga dependencias y construye |
| No produce nada | Produce un `.jar`, que es lo que después se despliega |

<p class="term">Artefacto</p>

El resultado de construir el proyecto: en vuestro caso un fichero `.jar` con la aplicación entera dentro. Es lo que se despliega. No se guarda en el repositorio: se genera cada vez a partir del código, y por eso el código es lo único que hay que conservar.

#### Lo que no se sube

<div class="rule">
  <p class="rule-label">La carpeta de construcción no va al repositorio</p>
  <p>Al compilar aparece una carpeta con el resultado, y subirla es uno de los errores clásicos: pesa mucho, cambia entera con cada compilación, provoca conflictos imposibles de resolver y no aporta nada, porque se regenera con un comando. Al repositorio va lo que escribís vosotros; lo que produce la máquina, no. Lo mismo con los ficheros de configuración de vuestro editor.</p>
</div>

---

### Se trabaja

#### Bloque A · El repositorio de la API

<p class="stage stage--solo">Individual, con vuestro proyecto de Servidor a mano</p>

**1 · Comprobad que compila donde está ahora.** Antes de mover nada, en la carpeta de vuestro proyecto de Servidor:

```bash
./mvnw -B verify
```

Si eso no termina en «BUILD SUCCESS», paradlo aquí: hoy no es el día de arreglar la compilación. Un proyecto que no compila en vuestro ordenador no va a compilar en ninguna máquina del mundo, y si lo movéis roto vais a estar media sesión creyendo que el problema es GitHub.

**2 · Anotad la versión de Java que declara el proyecto.** Abrid el `pom.xml` y buscad `<java.version>` o `maven.compiler.release`. Ese número lo vais a necesitar dos veces hoy y una en la sesión siguiente, y si en alguna de las tres ponéis otro, compilaréis dos cosas distintas sin enteraros.

<dl class="answer">
  <dt>Versión de Java de vuestro proyecto</dt>
  <dd></dd>
</dl>

**3 · Crear el repositorio** en GitHub, igual que el del portfolio pero con una diferencia importante:

| Campo | Valor |
| ----- | ----- |
| Repository name | <code>api-</code> y el tema de vuestro proyecto |
| Visibilidad | **Public** |
| Add a README file | Sí |
| **.gitignore template** | **Maven** |
| License | MIT |

<div class="rule">
  <p class="rule-label">Maven, no Java</p>
  <p>En ese desplegable hay dos plantillas que parecen valer y solo una vale. La de <strong>Java</strong> no ignora la carpeta de construcción, y en cambio sí ignora todo lo que acabe en <code>.jar</code>, que es exactamente lo que produce vuestro proyecto. La de <strong>Maven</strong> ignora la carpeta de construcción entera, que es lo que queréis. Si os equivocáis lo vais a notar en el tamaño del primer commit y en un CI que se comporta de forma rarísima.</p>
</div>

**4 · Copiar el proyecto dentro.** Clonad el repositorio recién creado, que está vacío salvo por el README y el `.gitignore`:

```bash
git clone https://github.com/VUESTRO-USUARIO/api-loquesea.git
cd api-loquesea
```

Y copiad ahí, desde vuestro proyecto de Servidor:

| Sí se copia | No se copia |
| ----------- | ----------- |
| <code>pom.xml</code> | La carpeta <code>target</code>: se regenera |
| La carpeta <code>src</code> entera | La carpeta <code>.git</code>, si vuestro proyecto ya era un repositorio |
| <code>mvnw</code> y <code>mvnw.cmd</code> | Las carpetas de vuestro editor: <code>.idea</code>, <code>.vscode</code> |
| La carpeta <code>.mvn</code> | Nada que contenga una contraseña |

<details class="aside aside--help">
  <summary>Si vuestro proyecto de Servidor ya tenía su propio <code>.git</code></summary>
  <p>Copiar esa carpeta traería también su historial y su origen remoto, y acabaríais empujando a un sitio que no es este. Copiad todo lo demás y dejadla fuera. Vuestro historial de Servidor no se pierde: sigue donde estaba.</p>
</details>

**5 · Comprobad qué va a subirse, antes de subirlo.**

```bash
git add .
git status
```

Leed la lista entera y comprobad las dos direcciones:

<ul class="checklist">
  <li>No aparece la carpeta <code>target</code> ni ningún fichero compilado.</li>
  <li>Sí aparecen <code>mvnw</code>, <code>mvnw.cmd</code> y el contenido de <code>.mvn</code>. Sin ellos, el CI de la siguiente parte no arranca.</li>
</ul>

```bash
git commit -m "Anadir el proyecto inicial de la API"
git push
```

**6 · Cerrar la rama principal.** El mismo ruleset de la sesión 2, porque este repositorio empieza igual de desprotegido que aquel. **Settings → Rules → Rulesets → New ruleset → New branch ruleset**, nombre <code>main protegida</code>, *Enforcement* en **Active**, *Target branches* con **Include default branch**, y estas reglas:

| Regla | Valor |
| ----- | ----- |
| Restrict deletions | marcada |
| Block force pushes | marcada |
| Require a pull request before merging | marcada, con *Required approvals* en **0** |
| Require status checks to pass | marcada, pendiente de añadir el check que aún no existe |

Este repositorio tampoco lleva colaboradores: vuestra pareja revisará aquí igual que en el portfolio, sin acceso de escritura.

#### Bloque B · El CI que compila

<p class="stage stage--solo">Individual, por el circuito: issue, rama, pull request</p>

Cread `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    name: Compilar y probar
    runs-on: ubuntu-latest
    steps:
      - name: Descargar el repositorio
        uses: actions/checkout@v4

      - name: Preparar Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - name: Compilar y ejecutar los tests
        run: ./mvnw -B verify
```

<dl class="worked">
  <dt><code>distribution</code> y <code>java-version</code></dt>
  <dd><strong>Poned aquí la versión que anotasteis en el paso 2</strong>, no el 21 del ejemplo. El runner no trae Java preparado para vosotros: se le dice qué distribución y qué versión, y si no coincide con la que declara el <code>pom.xml</code> la compilación falla con un error que no menciona ninguna de las dos.</dd>
  <dt><code>cache: maven</code></dt>
  <dd>Guarda las dependencias descargadas entre ejecuciones. Sin esto, cada pull request se baja medio internet y tarda el triple.</dd>
  <dt><code>./mvnw</code></dt>
  <dd>El wrapper de Maven que viene con el proyecto. Usa la versión de Maven que el proyecto declara, no la que tenga instalada la máquina, así que compila igual en el runner que en vuestro portátil.</dd>
  <dt><code>-B</code></dt>
  <dd>Modo por lotes: sin colores ni barras de progreso. El registro queda legible en vez de lleno de basura.</dd>
  <dt><code>verify</code></dt>
  <dd>Compila, ejecuta los tests y construye el artefacto. Si cualquiera de las tres cosas falla, el job falla.</dd>
</dl>

<details class="aside aside--help">
  <summary>Si el job falla con «permission denied» al ejecutar <code>./mvnw</code></summary>
  <p>Es el fallo más común de esta sesión y no tiene nada que ver con vuestro código. El runner es Linux y en Linux un fichero necesita permiso de ejecución; Windows no guarda ese permiso, así que el wrapper llegó al repositorio sin él. Se arregla marcándolo en el índice de Git y subiéndolo:</p>
  <p><code>git update-index --chmod=+x mvnw</code>, después commit y push.</p>
  <p>Merece la pena entender por qué pasa: es la primera vez que os choca que la máquina donde se construye no es la vuestra, y no va a ser la última.</p>
</details>

<details class="aside aside--help">
  <summary>Si no tenéis <code>mvnw</code> en el proyecto</summary>
  <p>Usad <code>mvn -B verify</code> sin el <code>./</code>: los runners traen Maven instalado. Funciona, pero es peor, porque la versión de Maven la elige la máquina y no vosotros. Si podéis, regenerad el proyecto con el wrapper incluido.</p>
</details>

**Romperlo a propósito, como siempre.** Provocad estos dos fallos y mirad qué dice cada uno:

| Qué rompéis | Qué demuestra |
| ----------- | ------------- |
| Un punto y coma que falta en una clase | El CI no deja pasar código que ni siquiera compila |
| Un test que devuelve lo contrario de lo que debe | El CI no deja pasar código que compila pero está mal |

Ese segundo fallo es la diferencia entre este pipeline y el del portfolio, y conviene verla una vez con los ojos.

#### Bloque C · Convertirlo en puerta y estrenar el circuito

<p class="stage stage--solo">Individual</p>

1. Fusionad la pull request del CI.
2. **Settings → Rules → Rulesets → main protegida → Edit → Require status checks**, y añadid **Compilar y probar**.
3. Abrid tres issues con lo siguiente que vayáis a tocar de la API, y recorred al menos una entera por el circuito.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación de la sesión 7</p>
  <ul class="checklist">
    <li>El repositorio de la API existe, es público y no contiene la carpeta de construcción.</li>
    <li>Cada pull request muestra el check «Compilar y probar».</li>
    <li>El check es obligatorio y habéis visto una pull request bloqueada por un test en rojo.</li>
    <li>Una issue de la API recorrida entera.</li>
  </ul>
</div>

---

### Cierre

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Por qué la carpeta de construcción no va al repositorio?</li>
    <li>¿Qué hace <code>verify</code> que no haría solo compilar?</li>
    <li>¿Para qué sirve <code>cache: maven</code>?</li>
    <li>¿Por qué el wrapper compila igual en el runner que en vuestro portátil?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque se regenera con un comando, pesa, cambia entera en cada compilación y provoca conflictos. Al repositorio va lo que escribe una persona.</p>
  <p>2 · Ejecuta los tests y construye el artefacto, además de compilar.</p>
  <p>3 · Para reutilizar las dependencias ya descargadas y no bajarlas en cada ejecución.</p>
  <p>4 · Porque fija la versión de Maven en el propio proyecto, en lugar de usar la que tenga instalada cada máquina.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 8</p>
  <ul class="checklist">
    <li>La API arranca en vuestro ordenador y responde a una petición desde el navegador.</li>
    <li>Sabéis decir en qué puerto escucha —lo dice al arrancar— y qué ruta devuelve la lista de vuestros datos.</li>
    <li>El check de compilación está en verde en <code>main</code>.</li>
  </ul>
</div>

## Sesión 8 · La API en una URL

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Vuestra API escucha en un puerto concreto de vuestro ordenador. ¿Quién decide ese número?</li>
    <li>En producción no hay nadie mirando la consola. Si la aplicación no arranca, ¿dónde se lee el motivo?</li>
    <li>¿Qué diferencia hay entre desplegar unos ficheros HTML y desplegar un programa que se ejecuta?</li>
  </ol>
</div>

---

### Se explica

#### Desplegar algo que se ejecuta

Hasta ahora habéis desplegado ficheros: Azure los copiaba y un servidor los servía tal cual. Hoy despliegan un programa, y eso añade tres preguntas que con un sitio estático no existían.

<figure class="diagram">
  <figcaption>Lo que cambia al desplegar una aplicación</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Construcción</span>Hay que compilar antes de subir. Lo que se despliega no es lo que escribisteis, es el artefacto.</li>
    <li><span class="flow-role">Arranque</span>Alguien tiene que ejecutar el programa, y el programa puede fallar al arrancar aunque el despliegue haya ido bien.</li>
    <li><span class="flow-role">Entorno</span>El programa necesita saber cosas del sitio donde vive: en qué puerto escuchar, quién puede llamarlo. Y esas cosas cambian entre vuestro portátil y producción.</li>
  </ol>
</figure>

#### Configuración que cambia según dónde estéis

<p class="term">Variable de entorno</p>

Un valor que el programa lee del sistema donde se está ejecutando, en lugar de tenerlo escrito dentro. Es lo que permite que el mismo artefacto funcione en vuestro portátil y en producción sin cambiar ni una línea.

La primera que os va a hacer falta es el puerto, y ahí hay un desencuentro que os va a pasar a todos. **App Service manda las peticiones al puerto 80** de vuestra aplicación, porque es lo que espera por defecto. **Spring Boot escucha en el 8080**, porque es lo que hace siempre. Nadie está equivocado, sencillamente no se han puesto de acuerdo.

Se arregla por cualquiera de los dos lados: o la aplicación escucha en el 80, o se le dice a App Service que vosotros estáis en el 8080. Vamos a hacer lo segundo, porque no toca el código y porque el mismo artefacto sigue arrancando igual en vuestro portátil.

Si no se hace, pasa lo más desconcertante de la sesión: **la aplicación arranca perfectamente y no la encuentra nadie**. No hay ningún error, solo una URL que no responde.

#### El plan gratuito, con sus dos peajes

Vais a desplegar en el plan **F1**, que no consume crédito. A cambio tiene dos limitaciones que hay que conocer antes de la demostración, no durante:

| Limitación | Qué se nota | Qué hacer |
| ---------- | ----------- | --------- |
| Se duerme tras un rato sin uso | La primera petición después de un rato tarda medio minuto o más | Abrir la URL unos minutos antes de enseñarla |
| Cuota diaria de CPU | Si se abusa, el servicio deja de responder hasta el día siguiente | No es un problema para lo que vais a hacer, pero conviene saber que existe |

---

### Se trabaja

#### Bloque A · Comprobar en qué puerto escucháis

<p class="stage stage--solo">Individual, en local</p>

Arrancad la API en vuestro ordenador y leed la línea que escribe al arrancar. Dice el puerto. Si no habéis tocado nada, será el **8080**, que es el de Spring Boot por defecto.

<dl class="answer">
  <dt>Puerto en el que escucha vuestra API</dt>
  <dd></dd>
</dl>

Ese número lo vais a necesitar en el bloque siguiente, en cuanto exista el servicio donde configurarlo. No cambiéis nada en el código: lo que se va a ajustar es el servicio, no la aplicación.

#### Bloque B · Crear el servicio en Azure

<p class="stage stage--guided">Todos a la vez, a la misma pantalla</p>

En **portal.azure.com**, buscad `App Services` y pulsad **Crear** → **Aplicación web**.

| Campo | Valor |
| ----- | ----- |
| Suscripción | Azure for Students |
| Grupo de recursos | El mismo del portfolio, o uno nuevo |
| Nombre | <code>api-</code> y algo vuestro: forma parte de la URL pública |
| Publicar | **Código** |
| Pila del entorno de ejecución | **La versión de Java que anotasteis en la sesión 7**, no la que venga sugerida |
| Servidor web de Java | **Java SE (servidor web integrado)** |
| Sistema operativo | **Linux** |
| Región | West Europe |
| Plan de precios | **F1 gratuito** |

Revisar y crear. Cuando termine, **Ir al recurso** y abrid la URL: veréis la página por defecto de App Service, porque todavía no hay nada vuestro dentro.

**El ajuste del puerto, ahora que ya hay dónde ponerlo.** En el menú del servicio: **Configuración → Variables de entorno**, y añadid una nueva:

| Nombre | Valor |
| ------ | ----- |
| <code>WEBSITES_PORT</code> | El puerto que anotasteis en el bloque A, normalmente <code>8080</code> |

Guardad. Con eso le habéis dicho a App Service dónde escucháis, en lugar de obligar a vuestra aplicación a mudarse al 80.

#### Bloque C · Conectarlo con GitHub

<p class="stage stage--guided">A la vez</p>

1. En el recurso, menú lateral → **Centro de implementación** (*Deployment Center*).
2. Origen: **GitHub**. Autorizad si lo pide.
3. Organización, repositorio `api-loquesea`, rama `main`.
4. Si os pregunta por el tipo de autenticación, dejad la opción que venga marcada por defecto.
5. **Guardar**.

<details class="aside aside--help">
  <summary>Si al guardar se queja de la autenticación básica</summary>
  <p>Algunos servicios se crean con la autenticación básica desactivada, y entonces el centro de implementación no puede usar el método del perfil de publicación. Tenéis dos salidas. La limpia: elegir la opción de <strong>identidad</strong> en ese mismo desplegable, que no necesita contraseñas. La rápida: en el menú del servicio, <strong>Configuración → General</strong>, activar la autenticación básica y volver a intentarlo. Las dos funcionan; la primera es la que se usa fuera de clase.</p>
</details>

Igual que hizo Static Web Apps en la sesión 1, Azure escribe un workflow en vuestro repositorio y guarda las credenciales como secreto. Traedlo y leedlo:

```bash
git switch main
git pull
```

Buscad en el fichero nuevo las dos diferencias con el del portfolio: **hay un paso que compila** antes de desplegar, y **hay dos jobs**, uno que construye y otro que despliega, con el segundo esperando al primero.

<dl class="answer">
  <dt>¿Qué comando de construcción usa el workflow que ha escrito Azure?</dt>
  <dd></dd>
  <dt>¿Qué se pasa del primer job al segundo, y por qué no se compila otra vez?</dt>
  <dd></dd>
  <dt>¿Cómo se llama el secreto que ha creado?</dt>
  <dd></dd>
  <dt>¿Qué versión de Java usa, y coincide con la vuestra?</dt>
  <dd></dd>
</dl>

<div class="rule">
  <p class="rule-label">Ahora tenéis dos workflows, y hacen cosas distintas</p>
  <p>El vuestro, <code>ci.yml</code>, se ejecuta en cada pull request y su trabajo es <strong>impedir</strong> que entre algo roto. El de Azure se ejecuta cuando algo ya ha entrado en <code>main</code> y su trabajo es <strong>publicar</strong>. Si algún día veís dos ejecuciones por cada cambio, no es un error de configuración: es el circuito funcionando, exactamente igual que en el portfolio.</p>
</div>

#### Bloque D · Que arranque, y si no, por qué

<p class="stage stage--solo">Individual, y aquí se separa quien sabe diagnosticar de quien adivina</p>

Cuando el workflow termine en verde, abrid la URL de vuestra API con la ruta que devuelve datos. Hay dos finales posibles y los dos enseñan algo.

**Si responde:** abridla también con la misma ruta desde el móvil, con los datos móviles y sin la wifi del centro. Eso es lo que significa «está en producción».

**Si no responde:** no toquéis nada todavía. Id al recurso en el portal, menú lateral → **Flujo de registro** (*Log stream*), y mirad lo que la aplicación está escribiendo. Es la consola que teníais en el portátil, ahora en producción.

| Lo que veis en el registro | Qué significa |
| -------------------------- | ------------- |
| La aplicación arranca y dice el puerto | Arrancó bien: el problema es de ruta, probad otra vez la URL completa |
| Una excepción al arrancar | Es vuestro código o vuestra configuración: mismo error que veríais en local |
| Nada, y la URL da error de aplicación | Casi siempre el puerto: comprobad que <code>WEBSITES_PORT</code> vale lo mismo que dice vuestra aplicación al arrancar |

<div class="rule">
  <p class="rule-label">El registro es la primera herramienta, no la última</p>
  <p>La reacción habitual ante una URL que no responde es volver a desplegar por si acaso. Desplegar otra vez tarda cinco minutos y no os dice nada; abrir el registro tarda diez segundos y os dice exactamente qué pasó. Este orden —leer antes que tocar— es la mitad de lo que separa a alguien que arregla cosas de alguien que las prueba a ver.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La API responde en su URL pública desde una red que no es la del aula.</span></div>
  <div><strong>Si lo tenéis</strong><span>Sabéis abrir el registro y explicar qué escribe vuestra aplicación al arrancar.</span></div>
  <div><strong>Reto</strong><span>Añadid una ruta de estado que devuelva simplemente que la aplicación está viva, y comprobadla con <code>curl</code> desde vuestra terminal.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Plan alternativo si el plan gratuito no da de sí</summary>
  <p>El F1 tiene dos límites que pueden apretar. Uno es 1 GB de memoria. El otro son <strong>60 minutos de CPU al día</strong>, contados por región y por suscripción y compartidos entre todas vuestras aplicaciones gratuitas de esa región: si se agotan, el servicio se para y todo responde 403 hasta la medianoche UTC. Una aplicación que arranca y muere en bucle se los come en una mañana.</p>
  <p>La alternativa es <strong>Azure Container Apps</strong>, que tiene franja mensual gratuita —180.000 segundos de vCPU, 360.000 de memoria y dos millones de peticiones— y que <em>escala a cero</em>: mientras nadie la usa no consume nada.</p>
  <p>Lo importante es lo que <strong>no</strong> cambia: el repositorio, el circuito, el CI, el ajuste del puerto, CORS y la coordinación entre las dos piezas son idénticos. Lo único distinto es que allí se despliega una imagen en lugar de un artefacto, y Spring Boot la construye solo con <code>./mvnw spring-boot:build-image</code>, sin que tengáis que escribir un Dockerfile.</p>
  <p>Esto se decide en clase y para todo el grupo. No os cambiéis por vuestra cuenta.</p>
</details>

---

### Cierre

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>App Service manda las peticiones al 80 y vuestra aplicación escucha en el 8080. ¿De cuántas formas se puede arreglar y cuál habéis usado?</li>
    <li>¿Por qué el workflow de la API tiene dos jobs y el del portfolio uno?</li>
    <li>La URL da error y el despliegue está en verde. ¿Cuál es vuestro primer movimiento?</li>
    <li>¿Por qué la primera petición del día tarda tanto?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · De dos: que la aplicación escuche en el 80, o decirle a App Service que escucháis en el 8080 con <code>WEBSITES_PORT</code>. Hemos usado la segunda, porque no toca el código y el artefacto sigue siendo el mismo en local y en producción.</p>
  <p>2 · Porque hay que construir antes de desplegar: un job produce el artefacto y el otro lo sube.</p>
  <p>3 · Abrir el flujo de registro del servicio. Leer antes que tocar.</p>
  <p>4 · Porque el plan gratuito duerme el servicio tras un rato sin uso y la primera petición lo despierta.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 9</p>
  <ul class="checklist">
    <li>La API responde en su URL pública, comprobado fuera de la red del centro.</li>
    <li>Tenéis anotadas la URL de la API y la ruta que devuelve la lista de datos.</li>
    <li>Traéis dibujado, en papel, cómo va a ser la pantalla del portfolio que muestre esos datos.</li>
  </ul>
</div>

## Sesión 9 · El cliente que lee

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Vuestra página está en un dominio y vuestra API en otro. ¿Debería el navegador dejar que una llame a la otra sin más?</li>
    <li>¿Qué debería ver el usuario mientras la respuesta viaja?</li>
    <li>¿Y si la API está dormida y tarda medio minuto?</li>
  </ol>
</div>

---

### Se explica

#### El JavaScript ya lo sabéis; lo nuevo es contra qué

Pedir datos con `fetch`, recorrer un array y pintarlo en el documento es de primero. Lo que cambia hoy es que al otro lado no hay un fichero de ejemplo ni una API pública de prácticas: **está vuestro propio servidor**, escrito por vosotros, desplegado por vosotros y con los fallos que le hayáis dejado dentro.

Eso tiene una consecuencia práctica desde el primer minuto: cuando algo no funcione, el problema puede estar en tres sitios distintos, y hay que saber en cuál mirar.

| Síntoma | Dónde está el problema |
| ------- | ---------------------- |
| La consola habla de CORS o de política de origen | En la API: no ha dado permiso a vuestro origen |
| La petición sale y devuelve 404 | En la ruta: la que pide el cliente no es la que expone la API |
| La petición devuelve 500 | En la API: hay una excepción, y el registro del servicio dice cuál |
| Todo responde bien y no se ve nada | En el cliente: los datos llegaron y no los estáis pintando |

Esa tabla es media sesión. Sabed en qué fila estáis antes de tocar nada.

#### CORS, o por qué el navegador os corta

Vuestra primera petición va a fallar, y no por un error vuestro. El navegador impide que una página de un origen lea la respuesta de otro origen distinto, salvo que ese otro origen dé permiso explícito.

<p class="term">Origen</p>

La combinación de esquema, dominio y puerto. Vuestro portfolio y vuestra API tienen dominios distintos, así que son orígenes distintos, y para el navegador eso basta.

No es una molestia arbitraria: sin esa regla, cualquier web que visitarais podría hacer peticiones en vuestro nombre a cualquier servicio donde tuvierais sesión abierta y leer la respuesta.

<div class="compare-pair">
  <div>
    <p class="compare-label">Lo que la gente hace</p>
    <p class="compare-body">Permitir cualquier origen para que deje de dar la lata. Funciona, y significa que cualquier página del mundo puede llamar a vuestra API desde el navegador de sus visitantes.</p>
  </div>
  <div>
    <p class="compare-label">Lo que se hace</p>
    <p class="compare-body">Permitir exactamente el origen de vuestro portfolio, y ponerlo en una variable de entorno para no tener la URL escrita en el código.</p>
  </div>
</div>

<div class="rule">
  <p class="rule-label">CORS no protege vuestra API</p>
  <p>Conviene decirlo claro porque se malinterpreta siempre: CORS es una regla del navegador, no del servidor. Cualquiera puede llamar a vuestra API desde una terminal, con o sin CORS. Lo que decide quién puede hacer qué es la autorización, y eso lo veréis en Servidor. CORS solo dice qué páginas pueden leer la respuesta desde el navegador de una persona.</p>
</div>

#### Una llamada de red tiene tres finales, no uno

Cuando pedís datos a otra máquina, hay tres cosas que el usuario puede ver, y en clase se programa siempre solo la primera:

| Estado | Qué se enseña | Qué pasa si no lo contempláis |
| ------ | ------------- | ----------------------------- |
| **Cargando** | Un aviso de que se está pidiendo | La página parece rota durante los segundos que tarda, y con el plan gratuito pueden ser treinta |
| **Error** | Un mensaje que dice qué ha fallado y qué hacer | Pantalla vacía sin explicación: el usuario cree que el fallo es suyo |
| **Vacío** | «Todavía no hay nada» | No se distingue de un error, y da la sensación de que la aplicación no funciona |

Los tres son parte de la funcionalidad, no un adorno que se añade si sobra tiempo.

---

### Se trabaja

#### Bloque A · Abrir la puerta en el servidor

<p class="stage stage--solo">Individual, en el repositorio de la API</p>

**1 · La propiedad**, en `application.properties`:

```properties
app.cors.origin=${APP_CORS_ORIGIN:http://localhost:5500}
```

**2 · La configuración**, en una clase nueva del proyecto:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${app.cors.origin}")
    private String origin;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(origin)
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

**3 · El valor real, en Azure.** Portal → vuestro App Service → **Configuración** → **Variables de entorno** → añadid `APP_CORS_ORIGIN` con la URL de vuestro portfolio, sin barra final. Guardad: el servicio se reinicia.

Fijaos en lo que acabáis de hacer: **la URL de vuestro portfolio no está en el código**. Si mañana cambia, se cambia la variable y no hace falta compilar nada.

#### Bloque B · La dirección de la API, en un solo sitio

<p class="stage stage--solo">Individual, en el repositorio del portfolio</p>

Vuestro portfolio no se compila, así que no hay dónde meter una configuración por entorno. Se resuelve con un fichero pequeño y explícito, `js/config.js`:

```js
export const API = location.hostname === "localhost"
  ? "http://localhost:8080"
  : "https://VUESTRA-API.azurewebsites.net";
```

Es simple a propósito. Lo importante no es la técnica, es la regla: **una dirección que cambia entre entornos se escribe en un solo sitio**. El día que la tengáis repetida en cuatro ficheros y cambie, os enteraréis por un usuario.

#### Bloque C · Una sola función habla con la red

<p class="stage stage--solo">Individual</p>

Antes de pintar nada, escribid la función por la que van a pasar **todas** vuestras peticiones, esta sesión y la siguiente. Se hace ahora porque en la sesión 10 vais a añadir tres llamadas más, y sin esto acabaréis con la misma lógica de errores copiada cuatro veces.

```js
import { API } from "./config.js";

export class ErrorDeApi extends Error {
  constructor(estado, detalle) {
    super(`El servidor respondió ${estado}`);
    this.estado = estado;
    this.detalle = detalle;
  }
}

export async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(`${API}${ruta}`, {
    headers: { "Content-Type": "application/json" },
    ...opciones
  });

  if (!respuesta.ok) {
    const detalle = await respuesta.json().catch(() => null);
    throw new ErrorDeApi(respuesta.status, detalle);
  }

  return respuesta.status === 204 ? null : respuesta.json();
}
```

<dl class="worked">
  <dt>Por qué una clase de error propia</dt>
  <dd>Porque en la sesión 10 vais a necesitar distinguir un 400 de validación —culpa de lo que escribió el usuario— de un 500 —culpa vuestra—. Con un error genérico no se puede.</dd>
  <dt>Por qué se intenta leer el cuerpo del error</dt>
  <dd>Porque vuestra API, tal como la habéis hecho en Servidor, no devuelve un error vacío: devuelve un cuerpo que explica qué ha fallado. Tirarlo y enseñar «ha habido un error» es desperdiciar el trabajo que hicisteis allí.</dd>
  <dt>Por qué el 204</dt>
  <dd>Es la respuesta correcta a un borrado: «hecho, y no tengo nada que devolverte». Si intentáis leer JSON de un 204, revienta.</dd>
</dl>

#### Bloque D · Pintar desde una sola fuente de verdad

<p class="stage stage--solo">Individual</p>

Nada de ir añadiendo elementos al documento a medida que llegan. Se guardan los datos en una variable y se pinta desde ella, porque en la sesión 10 esa variable va a cambiar y la pantalla tendrá que reflejarlo sin que reescribáis el renderizado.

```js
let estado = { carga: "cargando", datos: [], error: null };

function pintar() {
  const zona = document.querySelector("#lista");
  if (estado.carga === "cargando") return pintarCargando(zona);
  if (estado.error) return pintarError(zona, estado.error);
  if (estado.datos.length === 0) return pintarVacio(zona);
  pintarFilas(zona, estado.datos);
}

async function cargar() {
  estado = { carga: "cargando", datos: [], error: null };
  pintar();
  try {
    estado = { carga: "listo", datos: await pedir("/api/vuestro-recurso"), error: null };
  } catch (error) {
    estado = { carga: "listo", datos: [], error };
  }
  pintar();
}
```

**Y probad los estados de verdad**, no de palabra:

| Cómo se provoca | Qué tenéis que ver |
| --------------- | ------------------ |
| Parar la API en Azure desde el portal | El mensaje de error, no una página en blanco |
| Vaciar los datos de la API | El mensaje de vacío, distinto del de error |
| Abrir la página con la API dormida | El aviso de carga durante todo el rato que tarde |
| Quitar la variable del origen permitido | El fallo de CORS en la consola, para reconocerlo cuando os pase de verdad |

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La lista se ve en el portfolio publicado leyendo de la API publicada, con los tres estados contemplados.</span></div>
  <div><strong>Si lo tenéis</strong><span>Los cuatro fallos de la tabla provocados y reconocidos, sabiendo decir en qué fila de la tabla del principio cae cada uno.</span></div>
  <div><strong>Reto</strong><span>Haced que el aviso de carga solo aparezca si la respuesta tarda más de un cuarto de segundo, para que las cargas rápidas no den un parpadeo.</span></div>
</div>

---

### Cierre

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Qué es un origen y por qué el portfolio y la API son dos distintos?</li>
    <li>¿Protege CORS vuestra API de que alguien la llame?</li>
    <li>¿Por qué la URL permitida está en una variable de entorno y no en el código?</li>
    <li>La consola dice 404. ¿En qué lado está el problema?</li>
    <li>¿Por qué se pinta desde una variable en vez de ir añadiendo elementos según llegan?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Esquema, dominio y puerto. Están en dominios distintos, así que para el navegador son orígenes distintos.</p>
  <p>2 · No. Es una regla del navegador: cualquiera puede llamarla desde una terminal. Quien decide qué se puede hacer es la autorización.</p>
  <p>3 · Para poder cambiarla sin recompilar ni tocar el código, y para que el mismo artefacto sirva en cualquier entorno.</p>
  <p>4 · En la ruta: la que pide el cliente no coincide con la que expone la API. La petición sí llegó al servidor.</p>
  <p>5 · Porque la pantalla tiene que poder repintarse cuando los datos cambien, y eso empieza en la sesión siguiente.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 10</p>
  <ul class="checklist">
    <li>El portfolio publicado lee datos de la API publicada, con los tres estados probados.</li>
    <li>Traéis a mano el contrato de errores de vuestra API: qué devuelve exactamente cuando una validación falla.</li>
    <li>Traéis dibujado en papel el formulario que va a crear elementos, con sus campos y sus reglas.</li>
  </ul>
</div>

## Sesión 10 · El cliente que escribe

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>El usuario envía un formulario y la API responde que un campo no vale. ¿De quién es el fallo y qué debería ver?</li>
    <li>Acabáis de crear un elemento. ¿Cómo se entera la lista que ya estaba pintada?</li>
    <li>¿Qué debería pasar si alguien pulsa dos veces seguidas el botón de guardar?</li>
  </ol>
</div>

---

### Se explica

#### Escribir no es leer con otro verbo

Una lectura que falla es una molestia: se reintenta. Una escritura que falla puede dejar al usuario sin saber si sus datos se han guardado, y puede duplicarlos si insiste. Por eso escribir trae tres problemas que leer no tiene.

<figure class="diagram">
  <figcaption>Lo que aparece al escribir</figcaption>
  <ol class="flow">
    <li><span class="flow-role">La respuesta importa</span>Un 400 no es un fallo del programa: es el servidor diciendo que lo enviado no vale, y con el detalle de por qué.</li>
    <li><span class="flow-role">La pantalla se ha quedado vieja</span>La lista que estaba pintada ya no refleja lo que hay al otro lado. Alguien tiene que actualizarla.</li>
    <li><span class="flow-role">El usuario puede insistir</span>Si el botón sigue activo mientras la petición viaja, se envía dos veces y se crean dos elementos.</li>
  </ol>
</figure>

#### El 400 de vuestra API es información, no un error

En Servidor habéis dedicado semanas a que la API valide lo que recibe y devuelva errores con una forma acordada. Ese trabajo se tira a la basura en el momento en que el cliente lo convierte en un «ha habido un error».

<div class="compare-pair">
  <div>
    <p class="compare-label">Lo que hace casi todo el mundo</p>
    <p class="compare-body">Un mensaje rojo genérico arriba del formulario. El usuario tiene que adivinar qué campo está mal y qué se esperaba de él.</p>
  </div>
  <div>
    <p class="compare-label">Lo que se hace</p>
    <p class="compare-body">Se lee el detalle del 400, se busca cada campo del formulario que aparece en él y se pone el mensaje al lado. Vuestra API ya os ha dicho exactamente eso.</p>
  </div>
</div>

<div class="rule">
  <p class="rule-label">Validar en el cliente no sustituye a validar en el servidor</p>
  <p>El navegador valida para ser amable: avisa antes de molestar al servidor. El servidor valida porque <strong>es el único sitio donde la validación no se puede saltar</strong>: cualquiera puede mandar una petición sin pasar por vuestro formulario. Que existan las dos no es duplicar trabajo; quitar la del servidor sí es dejar la puerta abierta.</p>
</div>

#### Después de escribir, la lista miente

Tenéis dos formas de arreglarlo, y conviene elegir a sabiendas:

| Estrategia | Cómo funciona | Cuándo conviene |
| ---------- | ------------- | --------------- |
| **Recargar del servidor** | Después de crear o borrar, se vuelve a pedir la lista entera | Casi siempre, mientras las listas sean pequeñas. Es simple y no puede desincronizarse |
| **Tocar el estado local** | Se añade o se quita el elemento del array que ya tenéis y se repinta | Cuando recargar sea caro. Es más rápido, y se desincroniza en cuanto os equivoquéis en un detalle |

Empezad por la primera. La segunda es una optimización, y optimizar antes de tener el problema es como se introducen los fallos que nadie sabe reproducir.

#### Lo que cambia en pantalla hay que anunciarlo

Un elemento que aparece o desaparece sin recargar la página es invisible para quien usa un lector de pantalla, salvo que se lo digáis. Y quien acaba de borrar la fila donde tenía el foco se queda con el foco en ninguna parte.

Dos reglas, y las dos las mide el job de calidad que ya tenéis:

<ul class="checklist">
  <li>La zona donde aparecen los avisos —guardado, error, vacío— se marca como región activa para que se anuncie sola al cambiar.</li>
  <li>Después de borrar una fila, el foco se lleva a un sitio con sentido: la fila siguiente, o el encabezado de la lista.</li>
</ul>

---

### Se trabaja

#### Bloque A · Crear

<p class="stage stage--solo">Individual, issue y rama como siempre</p>

**1 · El formulario**, en HTML de verdad: etiquetas asociadas a sus campos, tipos correctos y los atributos de obligatoriedad que correspondan. Nada de una fila de cajas de texto sueltas.

**2 · El envío**, sin recargar la página:

```js
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  limpiarErrores();
  boton.disabled = true;
  try {
    await pedir("/api/vuestro-recurso", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(new FormData(formulario)))
    });
    formulario.reset();
    anunciar("Elemento creado");
    await cargar();
  } catch (error) {
    mostrarFallo(error);
  } finally {
    boton.disabled = false;
  }
});
```

Fijaos en el `finally`: el botón se vuelve a activar **pase lo que pase**. Si eso estuviera dentro del `try`, un error dejaría el formulario bloqueado para siempre.

**3 · Mirad la pestaña de red mientras guardáis.** Vais a ver dos peticiones donde esperabais una.

<details class="aside aside--help">
  <summary>Por qué aparecen dos peticiones en vez de una</summary>
  <p>Para las peticiones que modifican datos, el navegador manda antes una petición de sondeo preguntando si tiene permiso, y solo después manda la de verdad. Se llama <em>preflight</em>. Si veis una petición <code>OPTIONS</code> en la pestaña de red, no es un error: es el navegador comprobando el permiso que configurasteis en la sesión anterior.</p>
</details>

#### Bloque B · Los errores del servidor, en su campo

<p class="stage stage--solo">Individual, con el contrato de errores de vuestra API delante</p>

Enviad a propósito algo que vuestra API rechace: un campo vacío, un número fuera de rango, un texto demasiado largo. Mirad en la pestaña de red **qué cuerpo devuelve exactamente** ese 400. Esa forma la acordasteis vosotros en Servidor, así que el código que la lee tiene que corresponderse con ella y no con la que salga en un tutorial.

```js
function mostrarFallo(error) {
  if (error.estado === 400 && error.detalle) {
    for (const [campo, mensaje] of Object.entries(erroresPorCampo(error.detalle))) {
      const destino = formulario.querySelector(`[name="${campo}"]`);
      if (destino) ponerMensajeJunto(destino, mensaje);
    }
    anunciar("Revisa los campos marcados");
    return;
  }
  anunciar("No se ha podido guardar. Inténtalo de nuevo en unos segundos.");
}
```

`erroresPorCampo` la escribís vosotros, y es donde se traduce **vuestro** contrato a un objeto de campo y mensaje. Si no sabéis qué poner ahí, es que no habéis mirado la respuesta real todavía.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación del bloque B</p>
  <ul class="checklist">
    <li>Un campo obligatorio vacío muestra el mensaje junto a ese campo, no arriba del formulario.</li>
    <li>Un fallo que no sea de validación muestra un mensaje distinto, y no dice «400».</li>
    <li>Con la API parada, el formulario avisa y el botón vuelve a estar activo.</li>
  </ul>
</div>

#### Bloque C · Borrar

<p class="stage stage--solo">Individual</p>

**1 · Un solo escuchador para todas las filas.** Las filas se crean y se destruyen, así que el escuchador va en la lista, no en cada botón:

```js
lista.addEventListener("click", async (evento) => {
  const boton = evento.target.closest("[data-borrar]");
  if (!boton) return;
  if (!confirm("¿Seguro que quieres borrarlo?")) return;
  await pedir(`/api/vuestro-recurso/${boton.dataset.borrar}`, { method: "DELETE" });
  anunciar("Elemento borrado");
  await cargar();
});
```

**2 · El foco.** Después de recargar la lista, el elemento donde estaba el foco ya no existe. Llevadlo al encabezado de la lista o a la fila siguiente. Probadlo navegando solo con el teclado: si después de borrar hay que pulsar el tabulador quince veces para volver, está mal.

**3 · La confirmación.** `confirm` sirve hoy. Si os apetece hacerlo bien, un diálogo propio; si no, no pasa nada. Lo que no vale es borrar sin preguntar.

#### Bloque D · Cerrar el CRUD

<p class="stage stage--solo">Individual</p>

Con crear, listar y borrar funcionando contra la API publicada, falta la operación que más se salta todo el mundo: **modificar**. Añadidla reutilizando el mismo formulario en modo edición.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Crear, listar y borrar funcionando desde la web publicada contra la API publicada, con los errores de validación en su campo.</span></div>
  <div><strong>Si lo tenéis</strong><span>Modificar, reutilizando el formulario, y el foco bien llevado después de cada operación.</span></div>
  <div><strong>Reto</strong><span>Haced que pulsar dos veces muy rápido el botón de guardar cree un solo elemento, y demostradlo en la pestaña de red.</span></div>
</div>

---

### Cierre

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>Un 400 con detalle, ¿es un fallo de vuestro programa?</li>
    <li>Si el navegador ya valida el formulario, ¿para qué valida también el servidor?</li>
    <li>¿Por qué el botón se reactiva en el <code>finally</code> y no al final del <code>try</code>?</li>
    <li>¿Por qué el escuchador del borrado va en la lista y no en cada botón?</li>
    <li>Habéis borrado la fila donde estaba el foco. ¿Qué hay que hacer?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · No: es el servidor diciendo que lo enviado no cumple las reglas, con el detalle de cuál. Mostrarlo bien es aprovechar el trabajo hecho en Servidor.</p>
  <p>2 · Porque la del navegador se puede saltar mandando la petición por otro medio. La del servidor es la única que no.</p>
  <p>3 · Para que se reactive también cuando haya un error; si no, un fallo deja el formulario bloqueado.</p>
  <p>4 · Porque las filas se crean y se destruyen: un escuchador en la lista sigue funcionando con las filas que todavía no existen.</p>
  <p>5 · Llevarlo a un sitio con sentido —la fila siguiente o el encabezado— para que quien navega con teclado no se quede perdido.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 12</p>
  <ul class="checklist">
    <li>El CRUD completo funcionando entre las dos URL públicas, no en local.</li>
    <li>Los errores de validación de vuestra API se ven junto al campo que los provocó.</li>
    <li>Traéis anotado qué pasaría si mañana cambiarais el nombre de un campo en la API.</li>
  </ul>
</div>

## Sesión 11 · Dos piezas, una entrega

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Cambiáis el nombre de un campo en la API y desplegáis. ¿Qué le pasa al portfolio?</li>
    <li>¿En qué orden desplegaríais los dos si el cambio afecta a los dos?</li>
    <li>¿Qué tendría que decir el README de la API que no dice el del portfolio?</li>
  </ol>
</div>

---

### Se explica

#### El contrato es lo que os une, y nadie lo vigila

Entre vuestras dos piezas hay un acuerdo: qué rutas existen, qué reciben y qué devuelven. Ninguna herramienta comprueba que se cumpla. El portfolio no se entera de que la API ha cambiado hasta que un usuario abre la página y no ve nada.

<figure class="diagram">
  <figcaption>Lo que pasa cuando una pieza va por delante</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Cambio</span>Renombráis un campo en la API porque el nombre nuevo es mejor.</li>
    <li><span class="flow-role">Despliegue</span>El pipeline de la API está en verde y publica. Todo correcto por su lado.</li>
    <li><span class="flow-role">Silencio</span>El portfolio sigue pidiendo el campo viejo. No falla ningún check: cada repositorio se compruebe a sí mismo.</li>
    <li><span class="flow-role">Descubrimiento</span>Alguien abre la web y ve la lista vacía. Ese alguien no deberíais ser el tribunal en diciembre.</li>
  </ol>
</figure>

De ahí sale una regla práctica que se usa en cualquier equipo con frontend y backend separados: **primero se despliega lo que añade, después lo que consume**. La API acepta el campo nuevo *y* el viejo durante un tiempo, el portfolio pasa a usar el nuevo, y solo entonces se retira el viejo. Se llama cambio compatible, y es la diferencia entre poder desplegar cuando queráis y tener que desplegar las dos cosas al mismo segundo.

#### Dos repositorios, dos versiones, un producto

Cada repositorio lleva su propio número de versión: no hay una versión conjunta. Lo que sí hay es la obligación de que **cada uno diga con quién habla**, y ahí es donde los dos README se cruzan: el del portfolio enlaza a la API que consume, el de la API enlaza al portfolio que la usa y a su documentación.

---

### Se trabaja

#### Bloque A · Provocar la ruptura

<p class="stage stage--guided">Por parejas, y merece la pena hacerlo de verdad</p>

Vais a romper vuestro propio producto a propósito, en un entorno donde no importa.

1. En la API, renombrad un campo de la respuesta. Entra por el circuito y se despliega.
2. Sin tocar el portfolio, abridlo. Miradlo bien: qué se ve, qué dice la consola del navegador y qué **no** avisó.
3. Anotad en qué momento exacto os habríais enterado si no lo hubierais provocado vosotros.
4. Arregladlo aplicando la regla: primero la API acepta los dos nombres, después el portfolio usa el nuevo, y al final se retira el viejo. Tres pull requests, en ese orden.

<dl class="answer">
  <dt>¿Qué check habría podido detectarlo, y por qué ninguno lo hizo?</dt>
  <dd></dd>
  <dt>¿Cuánto tiempo habría estado roto en producción?</dt>
  <dd></dd>
</dl>

#### Bloque B · El README de la API

<p class="stage stage--solo">Individual, por el circuito</p>

No es el mismo que el del portfolio, porque el lector es otro: alguien que quiere **usar** vuestra API o entender cómo está desplegada.

| Apartado | Qué contiene |
| -------- | ------------ |
| Título y una frase | Qué gestiona esta API |
| URL pública | La dirección base, y la ruta de estado si la hicisteis |
| Endpoints | Tabla con método, ruta y para qué sirve. Solo eso: no es documentación completa |
| Cómo se ejecuta en local | Los comandos exactos, del clonado al arranque |
| Cómo se despliega | Qué lo dispara, adónde va y en qué plan |
| Persistencia y limitaciones conocidas | Estado real de la versión: memoria en el primer despliegue o PostgreSQL cuando se incorpora en Servidor; documentad también las limitaciones del alojamiento |
| Portfolio que la consume | Enlace |

<div class="rule">
  <p class="rule-label">Las limitaciones conocidas suman, no restan</p>
  <p>El README describe la versión publicada. Si todavía guarda en memoria, se indica; al incorporar PostgreSQL se actualiza y se comprueba la persistencia. Mantener una limitación que ya no existe desinforma igual que ocultar una real. La entrega del primer trimestre conserva los datos al reiniciar el backend.</p>
</div>

#### Bloque C · Publicar las dos versiones

<p class="stage stage--solo">Individual</p>

1. En la API, etiquetad y publicad `v1.0.0` con sus notas, como en la sesión 6.
2. En el portfolio, subid la versión: hay algo nuevo que antes no estaba, así que sube la menor. La `1.0.1` pasa a ser `1.1.0`.
3. En las notas del portfolio, decid qué hace ahora que antes no hacía y enlazad la versión de la API con la que se probó.

#### Bloque D · El ensayo de la demostración

<p class="stage stage--guided">Por parejas, cronómetro en mano</p>

Vuestra pareja abre las dos URL sin tocar nada más y vosotros contáis, en tres minutos: qué es, qué hace, cómo llega el código a producción y qué limitaciones tiene. Después al revés.

<div class="checkpoint">
  <p class="checkpoint-label">Lo que hay que haber previsto antes de enseñar nada</p>
  <ul class="checklist">
    <li>Abrir la API unos minutos antes, para que no la pillen dormida.</li>
    <li>Tener datos de ejemplo cargados: una lista vacía no demuestra nada.</li>
    <li>Explicar dónde guarda los datos la versión publicada y comprobarlo reiniciando el backend: la entrega del trimestre debe conservarlos en PostgreSQL.</li>
    <li>Tener a mano las dos pestañas de Actions, por si os piden ver el pipeline.</li>
  </ul>
</div>

---

### Cierre

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <ul class="checklist">
    <li>Repositorio de la API, público, con su ruleset y su CI que compila y ejecuta tests.</li>
    <li>API desplegada en App Service, respondiendo desde fuera de la red del centro.</li>
    <li>Portfolio publicado leyendo y escribiendo datos contra esa API, con los tres estados.</li>
    <li>CORS permitiendo exactamente vuestro origen, configurado por variable de entorno.</li>
    <li>Los dos README, con las limitaciones conocidas escritas.</li>
    <li>Dos releases publicadas, y las notas del portfolio diciendo con qué versión de la API se probó.</li>
    <li>Al cerrar el primer trimestre, PostgreSQL conectado en producción, datos conservados tras reiniciar y el mismo commit identificado para las evaluaciones de Servidor e Intermodular.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Por qué ningún check detecta que la API y el portfolio han dejado de entenderse?</li>
    <li>¿En qué orden se despliega un cambio que afecta a las dos piezas?</li>
    <li>¿Qué es un cambio compatible?</li>
    <li>¿Por qué las limitaciones conocidas van escritas en el README?</li>
    <li>Vuestra API lleva una hora sin usarse y tenéis que enseñarla en dos minutos. ¿Qué hacéis?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque cada repositorio se comprueba solo a sí mismo, y el acuerdo entre los dos no vive en ninguno.</p>
  <p>2 · Primero lo que añade —la API—, después lo que consume —el portfolio—, y al final se retira lo viejo.</p>
  <p>3 · Uno que se puede desplegar sin romper a quien todavía usa lo anterior.</p>
  <p>4 · Porque demuestran que sabéis dónde está el límite de lo que habéis hecho, y evitan que lo descubra otro delante de vosotros.</p>
  <p>5 · Abrirla ya, para que despierte antes de que la vea nadie.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 11</p>
  <ul class="checklist">
    <li>Las dos piezas publicadas, enlazadas entre sí desde sus README.</li>
    <li>Una revisión vuestra en cada repositorio de vuestra pareja: el del portfolio y el de la API.</li>
    <li>Traéis pensado, de las dos semanas siguientes, qué proyecto os gustaría hacer de verdad: en la sesión 12 se empieza a elegir el problema del proyecto grande.</li>
  </ul>
</div>

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Lo que añade desplegar un programa</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Construir</span>Lo que se despliega es el artefacto, no el código. El CI lo compila y ejecuta los tests antes de dejar pasar nada.</li>
    <li><span class="flow-role">Arrancar</span>Un despliegue en verde no significa una aplicación viva. El registro del servicio dice cuál de las dos cosas ha pasado.</li>
    <li><span class="flow-role">Configurar</span>Lo que cambia entre entornos —el puerto, el origen permitido— se lee del entorno, no se escribe en el código.</li>
    <li><span class="flow-role">Conectar</span>Dos orígenes distintos necesitan permiso explícito del servidor, y ese permiso nombra a uno, no a todos.</li>
    <li><span class="flow-role">Coordinar</span>Dos piezas que se despliegan por separado se rompen en silencio. Primero se despliega lo que añade.</li>
  </ol>
</figure>

| Idea | Por qué |
| ---- | ------- |
| **El artefacto no se guarda, se genera** | El repositorio guarda lo que escribe una persona; lo que produce la máquina se reconstruye cuando hace falta |
| **Leer antes que tocar** | El registro tarda diez segundos en decir qué pasó; volver a desplegar tarda cinco minutos en no decir nada |
| **La configuración vive fuera del código** | Es lo que permite que el mismo artefacto funcione en el portátil y en producción |
| **CORS no es seguridad** | Es una regla del navegador. Quien decide qué se puede hacer es la autorización |
| **Cargando, error y vacío son funcionalidad** | Sin ellos, cualquier lentitud o cualquier fallo se ve igual: una pantalla rota sin explicación |
| **Se pinta desde una sola fuente de verdad** | La pantalla es el reflejo de una variable. Así puede repintarse cuando los datos cambien, sin reescribir el renderizado |
| **El error del servidor es información** | Un 400 con detalle dice qué campo falla. Convertirlo en «ha habido un error» tira el trabajo hecho en Servidor |
| **Las limitaciones se escriben** | Un límite conocido y documentado es criterio; el mismo límite descubierto en directo es un fallo |

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Artefacto | El resultado de construir el proyecto, que es lo que se despliega |
| Variable de entorno | Valor que el programa lee del sistema donde se ejecuta, en vez de tenerlo escrito dentro |
| Origen | Esquema, dominio y puerto. Dos direcciones con dominios distintos son orígenes distintos |
| CORS | Regla del navegador que impide leer respuestas de otro origen sin permiso explícito de ese origen |
| Preflight | Petición previa que hace el navegador para preguntar si tiene permiso, antes de la que modifica datos |
| Arranque en frío | El retraso de la primera petición cuando el servicio llevaba un rato dormido |
| Flujo de registro | La salida de vuestra aplicación en producción, leída en directo |
| Contrato | El acuerdo entre dos piezas sobre qué se pide y qué se devuelve. No lo vigila ninguna herramienta |
| Cambio compatible | Un cambio que se puede desplegar sin romper a quien todavía usa lo anterior |
| Fuente de verdad | La variable de la que se pinta la pantalla. Cambia ella, se repinta todo |
| Delegación de eventos | Un solo escuchador en el contenedor, que sigue funcionando con los elementos que aún no existen |

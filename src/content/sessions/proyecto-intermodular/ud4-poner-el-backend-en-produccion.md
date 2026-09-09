---
title: "Poner el backend en producción"
label: "UD4 · Conectar"
section: "ud-04"
order: 4
lang: "es"
summary: "Llevar al circuito la API que se está construyendo en Servidor: repositorio propio, un CI que compila y ejecuta los tests, despliegue en Azure App Service, y el portfolio consumiéndola desde el navegador."
duration: "12 horas · 4 sesiones de 3 h"
modality: "Taller · el 80 % de la sesión es trabajo del alumnado"
deliverable: "API desplegada en una URL pública con su propio pipeline, y el portfolio mostrando y modificando sus datos."
date: "2026-09-09"
outcomes:
  - "Poner un proyecto Java bajo el mismo circuito de trabajo que el portfolio."
  - "Escribir un CI que compila y ejecuta los tests, y explicar en qué se diferencia de uno que pasa linters."
  - "Desplegar una aplicación de Spring Boot en Azure App Service desde GitHub Actions."
  - "Diagnosticar un fallo de arranque en producción leyendo el registro del servicio."
  - "Explicar qué es CORS y configurarlo sin abrirlo a todo el mundo."
  - "Consumir una API desde el navegador contemplando carga, error y vacío."
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
  <p>En estas semanas vuestra API guarda los datos en memoria, porque la persistencia se estudia en Servidor más adelante. Eso significa que al reiniciarse pierde todo lo que hubiera. No es un defecto que haya que esconder: es una limitación conocida que se escribe en el README y que se explica en la demostración. La base de datos llega en la segunda evaluación.</p>
</div>

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

**1 · Crear el repositorio** en GitHub, igual que el del portfolio pero con una diferencia importante:

| Campo | Valor |
| ----- | ----- |
| Repository name | <code>api-</code> y el tema de vuestro proyecto |
| Visibilidad | **Public** |
| Add a README file | Sí |
| **.gitignore template** | **Java** |
| License | MIT |

Esa plantilla de `.gitignore` es la que evita el error del recuadro anterior. Abridla cuando esté creado el repositorio y ved qué contiene: reconoceréis la carpeta de construcción y las extensiones de los ficheros compilados.

**2 · Meter dentro el proyecto que ya tenéis.** Clonad el repositorio vacío y copiad ahí el contenido de vuestro proyecto de Servidor: el `pom.xml`, la carpeta `src`, y los ficheros del wrapper de Maven —`mvnw`, `mvnw.cmd` y la carpeta `.mvn`— si los tenéis.

```bash
git clone https://github.com/VUESTRO-USUARIO/api-loquesea.git
cd api-loquesea
```

**3 · Comprobad qué va a subirse antes de subirlo.**

```bash
git add .
git status
```

Leed la lista entera. Si aparece la carpeta de construcción o ficheros con extensión de clase compilada, el `.gitignore` no está haciendo su trabajo: revisadlo antes de continuar.

```bash
git commit -m "Anadir el proyecto inicial de la API"
git push
```

**4 · Cerrar la rama principal.** Repetid el ruleset de la sesión 2, con las mismas cuatro reglas y cero aprobaciones obligatorias. Este repositorio tampoco lleva colaboradores.

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
  <dd>El runner no trae Java preparado para vosotros: se le dice qué distribución y qué versión. Tiene que ser la misma con la que compiláis en clase, o compilaréis dos cosas distintas sin enteraros.</dd>
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
    <li>Sabéis decir en qué puerto escucha y qué ruta devuelve la lista de vuestros datos.</li>
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

La primera que os va a hacer falta es el puerto. En vuestro ordenador mandáis vosotros; en un servicio gestionado manda el servicio, que le dice a la aplicación por dónde tiene que escuchar. Una aplicación que ignora esa indicación arranca correctamente y **no la encuentra nadie**, que es el fallo más desconcertante de esta sesión porque no aparece ningún error.

#### El plan gratuito, con sus dos peajes

Vais a desplegar en el plan **F1**, que no consume crédito. A cambio tiene dos limitaciones que hay que conocer antes de la demostración, no durante:

| Limitación | Qué se nota | Qué hacer |
| ---------- | ----------- | --------- |
| Se duerme tras un rato sin uso | La primera petición después de un rato tarda medio minuto o más | Abrir la URL unos minutos antes de enseñarla |
| Cuota diaria de CPU | Si se abusa, el servicio deja de responder hasta el día siguiente | No es un problema para lo que vais a hacer, pero conviene saber que existe |

---

### Se trabaja

#### Bloque A · Decirle a la aplicación en qué puerto escuchar

<p class="stage stage--solo">Individual, en el proyecto de la API</p>

En `src/main/resources/application.properties`:

```properties
server.port=${PORT:8080}
```

Se lee así: «escucha en el puerto que diga la variable de entorno `PORT`, y si no hay ninguna, en el 8080». Con eso, el mismo artefacto sirve para las dos situaciones. Comprobad que en local sigue arrancando igual que antes, y que entra por el circuito como cualquier otro cambio.

#### Bloque B · Crear el servicio en Azure

<p class="stage stage--guided">Todos a la vez, a la misma pantalla</p>

En **portal.azure.com**, buscad `App Services` y pulsad **Crear** → **Aplicación web**.

| Campo | Valor |
| ----- | ----- |
| Suscripción | Azure for Students |
| Grupo de recursos | El mismo del portfolio, o uno nuevo |
| Nombre | <code>api-</code> y algo vuestro: forma parte de la URL pública |
| Publicar | **Código** |
| Pila del entorno de ejecución | **Java 21** |
| Servidor web de Java | **Java SE (servidor web integrado)** |
| Sistema operativo | **Linux** |
| Región | West Europe |
| Plan de precios | **F1 gratuito** |

Revisar y crear. Cuando termine, **Ir al recurso** y abrid la URL: veréis la página por defecto de App Service, porque todavía no hay nada vuestro dentro.

#### Bloque C · Conectarlo con GitHub

<p class="stage stage--guided">A la vez</p>

1. En el recurso, menú lateral → **Centro de implementación** (*Deployment Center*).
2. Origen: **GitHub**. Autorizad si lo pide.
3. Organización, repositorio `api-loquesea`, rama `main`.
4. Si os pregunta por el tipo de autenticación, dejad la opción que venga marcada por defecto.
5. **Guardar**.

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
</dl>

#### Bloque D · Que arranque, y si no, por qué

<p class="stage stage--solo">Individual, y aquí se separa quien sabe diagnosticar de quien adivina</p>

Cuando el workflow termine en verde, abrid la URL de vuestra API con la ruta que devuelve datos. Hay dos finales posibles y los dos enseñan algo.

**Si responde:** abridla también con la misma ruta desde el móvil, con los datos móviles y sin la wifi del centro. Eso es lo que significa «está en producción».

**Si no responde:** no toquéis nada todavía. Id al recurso en el portal, menú lateral → **Flujo de registro** (*Log stream*), y mirad lo que la aplicación está escribiendo. Es la consola que teníais en el portátil, ahora en producción.

| Lo que veis en el registro | Qué significa |
| -------------------------- | ------------- |
| La aplicación arranca y dice el puerto | Arrancó bien: el problema es de ruta, probad otra vez la URL completa |
| Una excepción al arrancar | Es vuestro código o vuestra configuración: mismo error que veríais en local |
| Nada, y la URL da error de aplicación | Casi siempre el puerto: revisad el bloque A |

<div class="rule">
  <p class="rule-label">El registro es la primera herramienta, no la última</p>
  <p>La reacción habitual ante una URL que no responde es volver a desplegar por si acaso. Desplegar otra vez tarda cinco minutos y no os dice nada; abrir el registro tarda diez segundos y os dice exactamente qué pasó. Este orden —leer antes que tocar— es la mitad de lo que separa a alguien que arregla cosas de alguien que las prueba a ver.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La API responde en su URL pública desde una red que no es la del aula.</span></div>
  <div><strong>Si lo tenéis</strong><span>Sabéis abrir el registro y explicar qué escribe vuestra aplicación al arrancar.</span></div>
  <div><strong>Reto</strong><span>Añadid una ruta de estado que devuelva simplemente que la aplicación está viva, y comprobadla con <code>curl</code> desde vuestra terminal.</span></div>
</div>

---

### Cierre

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Qué hace <code>server.port=${PORT:8080}</code> y por qué no vale con dejar el 8080 a secas?</li>
    <li>¿Por qué el workflow de la API tiene dos jobs y el del portfolio uno?</li>
    <li>La URL da error y el despliegue está en verde. ¿Cuál es vuestro primer movimiento?</li>
    <li>¿Por qué la primera petición del día tarda tanto?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Escucha en el puerto que indique el entorno y, si no hay ninguno, en el 8080. Sin eso, en producción la aplicación arranca donde nadie la busca.</p>
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

## Sesión 9 · Que las dos piezas se hablen

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

#### CORS, o por qué el navegador os corta

Vuestra petición va a fallar hoy, y no por un error vuestro. El navegador impide que una página de un origen lea la respuesta de otro origen distinto, salvo que ese otro origen dé permiso explícito.

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

<details class="aside aside--help">
  <summary>Por qué al guardar aparecen dos peticiones en vez de una</summary>
  <p>Para las peticiones que modifican datos, el navegador manda antes una petición de sondeo preguntando si tiene permiso, y solo después manda la de verdad. Se llama <em>preflight</em>. Si veis una petición <code>OPTIONS</code> en la pestaña de red, no es un error: es el navegador comprobando lo que acabáis de configurar.</p>
</details>

#### Bloque B · La URL de la API en el portfolio

<p class="stage stage--solo">Individual, en el repositorio del portfolio</p>

Vuestro portfolio no se compila, así que no hay dónde meter una configuración por entorno. Se resuelve con un fichero pequeño y explícito, `js/config.js`:

```js
export const API = location.hostname === "localhost"
  ? "http://localhost:8080"
  : "https://VUESTRA-API.azurewebsites.net";
```

Es simple a propósito. Lo importante no es la técnica, es la regla: **una dirección que cambia entre entornos se escribe en un solo sitio**. El día que la tengáis repetida en cuatro ficheros y cambie, os enteraréis por un usuario.

#### Bloque C · Leer los datos

<p class="stage stage--solo">Individual, con los tres estados</p>

Escribid la pantalla que lista los datos de vuestra API contemplando los tres finales:

```js
async function cargar() {
  mostrarCargando();
  try {
    const respuesta = await fetch(`${API}/api/vuestro-recurso`);
    if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`);
    const datos = await respuesta.json();
    datos.length === 0 ? mostrarVacio() : mostrarLista(datos);
  } catch (error) {
    mostrarError(error.message);
  }
}
```

Y probad los tres de verdad, no de palabra:

| Cómo se provoca | Qué tenéis que ver |
| --------------- | ------------------ |
| Parar la API en Azure desde el portal | El mensaje de error, no una página en blanco |
| Borrar todos los datos de la API | El mensaje de vacío, distinto del de error |
| Abrir la página con la API dormida | El aviso de carga durante todo el rato que tarde |

#### Bloque D · Escribir datos

<p class="stage stage--solo">Individual</p>

Añadid el formulario que crea un elemento nuevo y el botón que borra uno. Al terminar, el portfolio hace las cuatro operaciones del CRUD contra una API que está en otra máquina.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La lista se ve en el portfolio publicado, con los tres estados contemplados.</span></div>
  <div><strong>Si lo tenéis</strong><span>Crear y borrar funcionando desde la web publicada, no solo en local.</span></div>
  <div><strong>Reto</strong><span>Haced que un fallo de validación de la API —de los que devuelven 400 con el detalle del error— se muestre en el formulario junto al campo que lo provocó, en vez de como un mensaje genérico.</span></div>
</div>

---

### Cierre

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Qué es un origen y por qué el portfolio y la API son dos distintos?</li>
    <li>¿Protege CORS vuestra API de que alguien la llame?</li>
    <li>¿Por qué la URL permitida está en una variable de entorno y no en el código?</li>
    <li>¿Qué tres estados tiene una pantalla que pide datos por la red?</li>
    <li>¿Por qué la dirección de la API se escribe en un solo fichero?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Esquema, dominio y puerto. Están en dominios distintos, así que para el navegador son orígenes distintos.</p>
  <p>2 · No. Es una regla del navegador: cualquiera puede llamarla desde una terminal. Quien decide qué se puede hacer es la autorización.</p>
  <p>3 · Para poder cambiarla sin recompilar ni tocar el código, y para que el mismo artefacto sirva en cualquier entorno.</p>
  <p>4 · Cargando, error y vacío. Los tres son funcionalidad.</p>
  <p>5 · Para que cambiarla sea un cambio en un sitio y no una búsqueda por todo el proyecto.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 10</p>
  <ul class="checklist">
    <li>El portfolio publicado lee datos de la API publicada.</li>
    <li>Los tres estados están probados provocándolos, no imaginándolos.</li>
    <li>Traéis anotado qué pasaría si mañana cambiarais el nombre de un campo en la API.</li>
  </ul>
</div>

## Sesión 10 · Dos piezas, una entrega

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
| Limitaciones conocidas | **Los datos están en memoria y se pierden al reiniciar.** Y que el plan gratuito duerme |
| Portfolio que la consume | Enlace |

<div class="rule">
  <p class="rule-label">Las limitaciones conocidas suman, no restan</p>
  <p>Escribir que los datos se pierden al reiniciar no os deja en mal lugar: demuestra que sabéis dónde está el límite de lo que habéis hecho y por qué está ahí. Lo que deja en mal lugar es que lo descubra quien os está evaluando, en directo, mientras vosotros ponéis cara de sorpresa.</p>
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
    <li>Saber decir en una frase por qué los datos se pierden al reiniciar y cuándo dejará de pasar.</li>
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
    <li>Traéis pensado, de las dos semanas siguientes, qué proyecto os gustaría hacer de verdad: en la sesión 11 se empieza a elegir el problema del proyecto grande.</li>
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

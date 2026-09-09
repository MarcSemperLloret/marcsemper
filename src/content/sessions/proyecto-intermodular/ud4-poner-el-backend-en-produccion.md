---
title: "Poner el backend en producción"
label: "UD4 · Conectar"
section: "ud-04"
order: 4
lang: "es"
summary: "Reutilizar el repositorio de Servidor, ejecutar su CI, publicar el backend, comprobar el contrato con la colección y preparar PostgreSQL en pruebas y producción."
duration: "18 horas · 6 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Backend publicado con persistencia, CI y contrato comprobados."
date: "2026-09-09"
outcomes: ["Configurar el CI de Java sobre el repositorio existente.", "Desplegar el artefacto y diagnosticar su arranque.", "Comprobar el contrato publicado con la colección de Servidor.", "Preparar PostgreSQL aislado para CI y persistente en producción.", "Identificar versión, configuración y evidencias del producto compartido."]
requirements: ["Portfolio publicado con pipeline.", "Repositorio de Spring Boot creado en Servidor y su wrapper de Maven.", "Java 21 y colección de peticiones existente."]
priorKnowledge:
  - "El circuito completo: issue, rama, pull request, revisión, fusión y despliegue."
  - "De Servidor: controladores REST, DTO, validación y manejo de errores."
---

<p class="lead">Vuestra API funciona en el portátil de quien la escribió. Este proyecto consiste en que funcione en una URL, con el mismo circuito que el portfolio, y en que el portfolio la use.</p>

<div class="rule">
  <p class="rule-label">Quién evalúa qué, otra vez</p>
  <p>El código de la API es de <strong>Servidor</strong>: sus capas, sus validaciones, sus errores y sus tests. Los defectos técnicos se corrigen en el mismo repositorio y su criterio de evaluación pertenece a Servidor. Lo que se evalúa aquí es que ese código viva en un repositorio con su circuito, que un pipeline lo compile y lo pruebe antes de dejarlo entrar, que esté desplegado y que la colección compruebe su contrato; el cliente completo llega tras Servidor 33–34. Podéis tener la mejor API de la clase y suspender esta unidad si solo existe en vuestro ordenador.</p>
</div>

<div class="rule">
  <p class="rule-label">La persistencia llega dentro del trimestre</p>
  <p>Se despliega el mismo CRUD que elegisteis y estáis construyendo en Servidor. La primera publicación puede guardar datos en memoria: esa limitación se documenta. PostgreSQL llega en la UD5 de Servidor, dentro del <strong>primer trimestre</strong>, y desde entonces se publica la versión persistente por este mismo workflow. No se crea otra API para Intermodular.</p>
</div>

### Los hitos compartidos del primer trimestre

| Lo que entrega Servidor | Lo que se trabaja aquí |
| --- | --- |
| CRUD en memoria con DTO, validación y errores, al terminar la UD3 | Repositorio del backend, CI y primera puesta en producción |
| Capas y tests de servicio, en la UD4 | Ejecutar las pruebas en cada pull request y comprobar que un fallo bloquea la fusión |
| CRUD con PostgreSQL y tests de repositorio, en la UD5 | Configurar la base de datos del entorno desplegado, sus variables y el entorno de pruebas del CI; publicar la misma API persistente |
| Versión del primer trimestre revisada y defendida, en la UD6 | Identificar el mismo commit desplegado y conservar las evidencias del workflow, CI, revisiones y puesta en producción |

Los hitos se coordinan por versión disponible: no se exige una funcionalidad antes de trabajarla en Servidor. Las seis sesiones de esta unidad mantienen sus 18 horas. El circuito que queda montado se sigue utilizando con cada avance del backend hasta el cierre del trimestre. Si al terminar la sesión 11 todavía falta parte de la UD5 de Servidor, se publica la versión disponible y sus siguientes mejoras recorren el mismo circuito; la entrega del trimestre sí incluye persistencia en producción.

## Sesión 7 · El CI del repositorio de Servidor

**Antes de empezar.** La API de Servidor ya tiene DTO, validaciones y respuestas de error. Hoy configurarás su compilación y pruebas automáticas utilizando el Maven Wrapper del proyecto.

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

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Reutilizar el repositorio desde el primer día

El backend ya está en GitHub desde Servidor 1. Conservamos ese repositorio, sus ramas y su historial; no se copia a otro para Intermodular. El portfolio puede tener su propio repositorio de presentación. Si el cliente del producto vive dentro del backend, también se conserva esa estructura: un monorepo puede configurar rutas de trabajo por job.

#### Qué hace el CI de Java

Maven lee pom.xml, compila el código, ejecuta las pruebas y construye el JAR. GitHub Actions repetirá ese proceso en un runner limpio. El wrapper fija Maven, pero para reproducir la construcción también deben coincidir Java, dependencias y configuración.

Un artefacto es el resultado construido, en este caso el JAR. No se guarda en Git: el workflow lo genera y lo entrega al despliegue. Las pruebas se implementan en Servidor; aquí se comprueba que el proceso las ejecuta y que su fallo bloquea la fusión.

#### Antes de publicar

Primero se reproduce verify en local y después en CI. Un fallo local se registra y se corrige sobre la misma rama del producto. Un fallo del runner puede deberse a Java, permisos del wrapper o configuración; los logs permiten distinguirlo de un defecto de implementación.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · El repositorio de la API

1. Abre la carpeta del backend de Servidor. Ejecuta `git remote -v`, `git status` y `git log -5 --oneline`; comprueba que es el repositorio utilizado desde la sesión 1, con su historial. No ejecutes git init ni crees otro remoto.
2. En main actualizada, crea una rama para la issue del CI. Ejecuta `.\mvnw.cmd -B verify` en PowerShell (`./mvnw -B verify` en Linux/macOS). Si falla, guarda el mensaje causal y corrige la configuración o enlaza la issue técnica; conserva el trabajo útil de la sesión.
3. Abre pom.xml y anota Java 21, la versión del proyecto y la presencia del wrapper. Revisa que target y credenciales no se rastrean. `git status` permite ver qué subirás; el historial de Servidor se conserva completo.
4. Comprueba las reglas configuradas en Intermodular 2 también en el backend. Si aún falta el check de Java, se añadirá después de su primera ejecución. La política de revisión debe ser la misma en ambos módulos.
5. Continúa con el workflow del bloque B. El código que compilamos es el CRUD con DTO y errores disponible después de Servidor 12.

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
        run: bash ./mvnw -B verify
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
  <p>Usad <code>mvn -B verify</code> sin el <code>./</code>: los runners traen Maven instalado. Funciona, pero es peor, porque la versión de Maven la elige la máquina y no vosotros. Recuperad los archivos del wrapper desde el historial o la plantilla de Servidor, conservando vuestro código y repositorio.</p>
</details>

**Romperlo a propósito, como siempre.** Provocad estos dos fallos en una rama de diagnóstico, sin fusionarlos, y restauradla antes de aprobar:

| Qué rompéis | Qué demuestra |
| ----------- | ------------- |
| Un punto y coma que falta en una clase | El CI no deja pasar código que ni siquiera compila |
| Una aserción invertida temporalmente en una rama de diagnóstico | El CI no deja pasar código que compila pero está mal |

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

<p class="stage">15 minutos · comprobación del resultado</p>


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

**Antes de empezar.** El backend está organizado por capas y su CI ya funciona. Hoy publicarás esa versión en memoria y comprobarás su respuesta desde una URL pública.

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

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Del JAR a un proceso accesible

Una web estática publica archivos; una aplicación Java necesita además un proceso en ejecución. El CI produce el JAR y el despliegue lo entrega al servicio. Un workflow verde no demuestra todavía que el proceso haya arrancado o responda en su ruta.

#### Puerto y configuración del runtime elegido

Este taller utiliza App Service con publicación Código y runtime Java SE. No es un contenedor personalizado. El entorno Java proporciona SERVER_PORT, que Spring Boot puede leer; mantened la configuración compatible con ese entorno y comprobad el puerto efectivo en los logs. WEBSITES_PORT pertenece a la configuración de contenedores personalizados y no se añade aquí como solución genérica. [Referencia oficial de App Service](https://learn.microsoft.com/en-us/azure/app-service/reference-app-settings).

#### Entorno de aula

Antes de crear recursos comprobad la oferta y los límites que muestra vuestra suscripción. El plan F1, cuando esté disponible para la combinación elegida, tiene cuotas y puede suspender la aplicación por inactividad. La primera respuesta puede tardar más que las siguientes. Utiliza el entorno de prácticas disponible conservando el mismo repositorio y artefacto.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Comprobar en qué puerto escucháis

Abre application.properties y revisa si existe una propiedad server.port. En este taller puede escribirse `server.port=${SERVER_PORT:8080}`: usa el puerto del entorno cuando esté definido y 8080 en local. Conserva el resto de configuración. Arranca la API, anota el puerto de los logs y prueba una ruta conocida. Más adelante repetirás esa comprobación en el runtime Java SE del proveedor.

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

**Verificar el runtime.** Confirma Código, Java SE y la misma versión de Java del pom. No añadas WEBSITES_PORT: no estamos publicando una imagen propia. Después del despliegue comprueba SERVER_PORT y el puerto de arranque en el registro del servicio. Si no coincide, revisa la propiedad server.port y los argumentos de arranque antes de cambiar otras opciones.

#### Bloque C · Conectarlo con GitHub

<p class="stage stage--guided">A la vez</p>

1. En el recurso, menú lateral → **Centro de implementación** (*Deployment Center*).
2. Origen: **GitHub**. Autorizad si lo pide.
3. Organización, repositorio `api-loquesea`, rama `main`.
4. Elige la identidad federada del entorno de prácticas y comprueba que el workflow declara los permisos y la conexión esperados; no habilites autenticación básica para ocultar un fallo de configuración.
5. **Guardar**.

<p>Si el centro de implementación intenta escribir en main protegida, prepara el workflow en una rama y revísalo por PR. No desactives las reglas para generar el archivo. Comprueba la identidad de despliegue configurada y guarda las credenciales en Secrets o en la conexión federada, nunca en YAML.</p>

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
| Nada, y la URL da error de aplicación | Revisad artefacto, comando de arranque, runtime Java SE y variables; activad los logs si todavía no muestran información |

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

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Qué runtime habéis elegido y cómo comprobáis el puerto efectivo?</li>
    <li>¿Por qué el workflow de la API tiene dos jobs y el del portfolio uno?</li>
    <li>La URL da error y el despliegue está en verde. ¿Cuál es vuestro primer movimiento?</li>
    <li>¿Por qué la primera petición del día tarda tanto?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Java SE con publicación de código. Contrastamos SERVER_PORT, la configuración de Spring Boot y los logs; WEBSITES_PORT se reserva al caso de contenedores personalizados.</p>
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

## Sesión 9 · Comprobar el contrato publicado

**Antes de empezar.** Tienes una API publicada y una colección de peticiones. Hoy comprobarás que la versión pública conserva el contrato que funciona en local.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Un **contrato de API** describe lo que otro programa puede pedir y lo que recibirá: método, ruta, campos y estados HTTP. Ya habéis construido esas respuestas en Servidor. Hoy comprobaremos que la versión publicada cumple el mismo contrato que la local, sin volver a implementar sus controladores.

El consumidor puede ser Bruno, una prueba o un navegador. Para detectar un cambio incompatible no hace falta haber programado todavía una interfaz. El cliente completo con fetch y CORS se trabajará después de las sesiones 33–34 de Servidor, en Intermodular 18. Ahora utilizamos la colección que ya conoce el grupo.

**Una base URL cambia el destino, no el contrato.** La ruta `/tareas` debe seguir llamándose igual en local y en producción. El prefijo `/api/v1` llegará en Servidor 32; no lo añadáis por copiar un tutorial. Un 404 puede indicar una ruta equivocada, aunque el programa haya arrancado correctamente.

La demostración consiste en enviar la misma petición a dos entornos, comparar sus estados y campos y localizar el commit que produjo la respuesta pública. El resultado se documenta una vez y sirve a los dos módulos.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Preparar dos entornos de la misma colección

1. Abre la colección de Servidor. Conserva sus peticiones; crea los entornos `local` y `produccion` con una variable `baseUrl` en cada uno.
2. Local usa `http://localhost:8080`; producción usa la URL HTTPS de Intermodular 8. Retira la barra final si las rutas ya empiezan por `/`.
3. Cambia una petición a `{{baseUrl}}/tu-ruta-real`. Elige una lectura de Servidor que ya funcione, no una ruta inventada.
4. Envía con cada entorno y anota estado, Content-Type y estructura del JSON. Los ids y datos pueden diferir; los tipos y nombres de campos deben cumplir el mismo contrato.

#### Bloque B · Escribir un caso comprobable

1. En la descripción del contrato de la API añade una tabla con método, ruta, entrada mínima, estado esperado y campos de respuesta.
2. Selecciona tres casos ya implementados: lectura correcta, recurso inexistente y entrada inválida. Copia ejemplos de tu API y elimina datos sensibles.
3. Ejecuta cada caso en ambos entornos. Si difieren, comprueba primero versión desplegada y configuración; después abre una issue con petición y respuesta que reproduzcan el fallo.
4. La corrección de implementación se realiza sobre el código compartido de Servidor. Intermodular conserva la prueba que detectó el desajuste y la PR que lo corrige.

#### Bloque C · Enlazar el producto desde el portfolio

1. Actualiza la ficha existente con qué resuelve el producto, el repositorio y su estado actual. Utiliza el tema elegido al principio de Servidor.
2. Añade un enlace al contrato y a una ruta GET pública de demostración. No necesitas construir hoy un formulario ni un cliente CRUD.
3. Abre los enlaces desde la web publicada. Si el backend aún usa memoria, indica que los datos se reinician; esa limitación cambiará al publicar PostgreSQL.
4. Lleva la modificación por issue, rama y PR. La persona revisora sigue los enlaces y reproduce uno de los casos del contrato.

#### Bloque D · Registrar la compatibilidad

Anota los dos entornos usados y el SHA del backend desplegado en las comprobaciones de la sesión. Enlaza la descripción del contrato de la API y las peticiones existentes, sin copiarlas a otra colección. Comprueba que una persona que llegue al README pueda localizar producto, versión y forma de probarlo.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** La API publicada está contrastada con la colección: rutas, estados y datos coinciden con el contrato, y las diferencias encontradas están identificadas. Explica por qué terminar un despliegue no demuestra por sí solo que el producto funciona.

## Sesión 10 · Preparar la transición a persistencia

**Antes de empezar.** La API aún utiliza memoria. Hoy prepararás los casos y las tareas que permitirán comprobar su transición a PostgreSQL.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

La API ya está publicada y su contrato está comprobado. En Servidor todavía trabaja en memoria: los datos se pierden al reiniciar. Antes de incorporar PostgreSQL necesitamos una referencia del comportamiento actual y un plan para verificar que el cambio conserva las operaciones del producto.

Una transición tiene un punto de partida, un cambio y una comprobación posterior. Preparar sus casos ahora permite detectar después si un fallo procede del contrato, de la configuración o del almacenamiento.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado</p>

#### Bloque A · Comprobar la versión actual

Arranca la API publicada y repite alta, listado, detalle, modificación y borrado con la colección existente. Anota para cada operación el estado HTTP y el resultado esperado. Identifica el commit desplegado y comprueba que coincide con el código revisado.

#### Bloque B · Observar el límite de la memoria

Crea un dato ficticio en local, reinicia la aplicación y vuelve a consultarlo. Explica por qué desaparece. Escribe el resultado que esperarás cuando se incorpore persistencia: el dato debe seguir disponible tras un reinicio, sin volver a crearlo.

#### Bloque C · Preparar los casos de transición

Añade casos de identificador inexistente, datos inválidos y relación entre dos recursos del dominio. Separa las reglas que ya puedes ejecutar de las comprobaciones de persistencia pendientes. Conserva la colección actual como referencia del contrato; todavía no añadas configuración JPA a la aplicación.

#### Bloque D · Organizar el cambio

En el tablero prepara las tareas de configurar el entorno de pruebas, conectar la base de datos y verificar los datos tras reiniciar. Marca qué tarea depende de la implementación de Servidor. Añade criterios de aceptación observables y revisa con tu pareja que ninguna tarjeta dé por realizado un cambio futuro.

#### Bloque E · Ensayar la revisión

Tu pareja ejecuta dos casos de la colección sin pedirte instrucciones adicionales. Corrige los datos o pasos ambiguos y comprueba que las tareas pendientes indican cómo se reconocerá su finalización. Deja la versión publicada funcionando como referencia.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** el contrato actual está comprobado, has observado la pérdida de datos al reiniciar y tienes preparados los casos y las tareas para verificar la futura persistencia. Debes poder distinguir lo que funciona hoy de lo que se comprobará al incorporar PostgreSQL.

## Sesión 11 · Preparar el CI de la versión persistente

**Antes de empezar.** En Servidor ya has conectado PostgreSQL y trabajado el acceso a los datos. Hoy prepararás una base de pruebas aislada para ejecutar esa versión en CI.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

En Servidor 19–20 el proyecto comienza a utilizar PostgreSQL. El código deja de bastar para arrancar: también necesita una base de datos. Si el pipeline no prepara esa dependencia, puede fallar aunque la implementación sea correcta.

Un **servicio del job** es un contenedor que GitHub Actions crea para esa ejecución. Tendrá una base de datos vacía, credenciales ficticias y un comprobador de disponibilidad. Al terminar el job se descarta. La base de pruebas del CI nunca es la de producción.

El trabajo de Servidor es escribir pruebas que verifiquen las reglas y, en su sesión 22, las consultas. Aquí aseguramos que se ejecutan con el entorno correcto y que un fallo impide fusionar. No cambiamos una aserción para conseguir un check verde.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Reproducir la construcción local

1. Abre el repositorio de backend existente y crea una issue para preparar PostgreSQL en CI. Anota qué dependencia añadió la versión de Servidor y qué error aparece en el runner.
2. Ejecuta `.\mvnw.cmd -B verify` en PowerShell, con PostgreSQL local encendido y las variables del README. En Linux/macOS utiliza `./mvnw -B verify`.
3. Separa un fallo de conexión de un fallo de test leyendo el primer mensaje causal. Guarda ese fragmento sin contraseñas.

#### Bloque B · Preparar PostgreSQL en el job

En `.github/workflows/ci.yml`, añade `services` y `env` dentro del job `build`, al mismo nivel que `runs-on` y `steps`. Conserva checkout, Java y verify de la sesión 7. Usa la misma versión mayor de PostgreSQL que en vuestro proyecto; 16 es el ejemplo.

```yaml
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: gestor_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: prueba_ci
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres -d gestor_test"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      SPRING_PROFILES_ACTIVE: test
      SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/gestor_test
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: prueba_ci
      TEST_DB_PASSWORD: prueba_ci
      SPRING_JPA_HIBERNATE_DDL_AUTO: create-drop
      SPRING_SQL_INIT_MODE: never
```

El ejemplo está indentado para pegarlo dentro del job. `create-drop` se permite aquí porque el contenedor es exclusivo y desechable. Nunca lo copies a las variables del App Service. El perfil `test` de Servidor 22 reutilizará este entorno; hasta entonces verifica las pruebas ya disponibles.

#### Bloque C · Comprobar el aislamiento

1. Sube la rama y abre la PR. En Actions localiza la creación del servicio, su comprobación de disponibilidad y la ejecución Maven.
2. Revisa el informe de tests: debe indicar cuántas pruebas se ejecutaron. Un build sin pruebas no demuestra las reglas del producto.
3. En una rama de prueba cambia temporalmente el nombre de la base de datos a uno inexistente. Comprueba que falla por conexión, no por compilación. Restaura el nombre antes de fusionar.
4. Confirma que `Compilar y probar` sigue siendo obligatorio. Al llegar los tests JPA de Servidor 22, ejecútalos en este mismo job; no abras otro proyecto de pruebas.

#### Bloque D · Conservar las evidencias

En las comprobaciones de la sesión enlaza la ejecución correcta y el fallo controlado. Documenta por qué la contraseña del contenedor de pruebas es ficticia y dónde se configura la de producción. La siguiente sesión prepara la base pública y comprobará que sus datos sobreviven al reinicio.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** El CI prepara una base aislada, ejecuta las pruebas existentes y permite localizar su resultado. Explica qué recursos crea el job y cómo distingues pruebas superadas de pruebas no ejecutadas.

## Sesión 12 · La base de datos en producción

**Antes de empezar.** La API ya trabaja con PostgreSQL y relaciones entre entidades; su entorno de pruebas está preparado en CI. Hoy conectarás la versión publicada a una base de datos persistente.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Vuestra API se reinicia. ¿Qué pasa hoy con lo que habíais guardado?</li>
    <li>La contraseña de vuestra base de datos local, ¿dónde está escrita ahora mismo?</li>
    <li>Añadís un campo a una entidad y desplegáis. ¿Quién cambia la tabla?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Publicar el estado persistente

Servidor 19–22 ya ha preparado JPA, PostgreSQL y pruebas de repositorio. Hoy cambia su entorno: utilizamos el mismo backend y publicamos la base de datos que necesita. No reescribimos entidades ni consultas para Intermodular.

Distinguimos desarrollo, prueba/CI y producción. Cada uno tiene su propia base y configuración. La de CI se destruye al terminar; la pública conserva los datos de demostración. Un cambio de esquema debe quedar identificado y comprobado antes de aplicarlo sobre datos que queremos mantener.

#### Comprobar la oferta antes de crear

La oferta de Azure for Students tiene requisitos de elegibilidad y límites por servicio. La página oficial incluye una cantidad gratuita de PostgreSQL durante un periodo limitado para cuentas elegibles; no garantiza que toda cuenta del alumnado tenga activada esa oferta. Revisad suscripción, región, tamaño, almacenamiento y coste estimado. Si no encaja, utilizad el recurso de aula acordado: no es necesario contratar un plan para superar la sesión. [Condiciones y servicios de Azure for Students](https://azure.microsoft.com/en-us/free/students/).

#### Configuración y esquema

Las credenciales reales se configuran en el proveedor; los nombres de variables y el procedimiento se guardan en el repositorio. Para producción seguimos la decisión de Servidor: esquema preparado y ddl-auto=validate. La creación automática update de desarrollo no se convierte en el procedimiento de actualización de producción.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Crear el servidor

<p class="stage stage--guided">Todos a la vez, a la misma pantalla</p>

En **portal.azure.com**, buscad `Azure Database for PostgreSQL` y elegid **Servidor flexible** (*Flexible server*) → **Crear**.

| Campo | Valor |
| ----- | ----- |
| Suscripción y grupo de recursos | Los mismos que la API |
| Nombre del servidor | <code>db-</code> y algo vuestro: forma parte de una dirección pública |
| Región | La misma que vuestro App Service |
| Tipo de carga de trabajo | **Desarrollo** |
| Proceso y almacenamiento | **Burstable B1ms**, 32 GB |
| Nombre de usuario administrador | Uno vuestro, y **no** <code>admin</code> |
| Contraseña | Larga, y guardada donde podáis recuperarla |

<div class="rule">
  <p class="rule-label">Comprobad el tamaño antes de crear</p>
  <p>Si el proceso no dice <strong>B1ms</strong>, paradlo. Es el tamaño de referencia de esta práctica; comprobad que está cubierto por vuestra oferta antes de crear el recurso, y un servidor de base de datos encendido gasta esté o no atendiendo peticiones.</p>
</div>

**La red.** En la pestaña de conectividad, acceso **público**, y permitid las direcciones de salida del App Service y la IP del aula que necesite acceso. Revisad la conectividad elegida; no asumáis que abrir el acceso a todos los servicios de Azure limita las conexiones a vuestra suscripción.

**La base de datos.** Cuando el servidor exista, cread dentro una base de datos con el nombre de vuestro proyecto. Un servidor puede contener varias; la aplicación se conecta a una.

#### Bloque B · La conexión, como secreto

<p class="stage stage--solo">Individual, sin escribir nada en el código</p>

En vuestro App Service: **Configuración → Variables de entorno**, y tres nuevas:

| Nombre | Valor |
| ------ | ----- |
| <code>SPRING_DATASOURCE_URL</code> | <code>jdbc:postgresql://VUESTRO-SERVIDOR.postgres.database.azure.com:5432/VUESTRA-BD?sslmode=require</code> |
| <code>SPRING_DATASOURCE_USERNAME</code> | El usuario administrador que creasteis |
| <code>SPRING_DATASOURCE_PASSWORD</code> | Su contraseña |

<details class="aside aside--help">
  <summary>Por qué <code>sslmode=require</code> no es opcional</summary>
  <p>El servidor rechaza las conexiones sin cifrar. Si lo omitís, el fallo que veréis no dice «falta SSL»: dice que no se puede conectar, y os pasaréis media sesión mirando el cortafuegos. Es de los errores que solo se reconocen una vez.</p>
</details>

**Lo que va al repositorio.** Nada de lo anterior. Lo que sí va es un fichero de ejemplo con los nombres de las variables y valores inventados, para que quien clone el proyecto sepa qué tiene que rellenar. Esa es la diferencia entre un proyecto que otra persona puede arrancar y uno que solo funciona en vuestro ordenador.

#### Bloque C · Que las tablas existan, y sepáis quién las creó

1. En la base local de ensayo, comprueba que el esquema coincide con las entidades y que los tests de Servidor 22 pasan. Genera un script de esquema a partir de esa versión, por ejemplo con pg_dump, instalado con las herramientas de PostgreSQL. En PowerShell ajusta usuario, base y ruta del ejecutable a tu instalación:

```powershell
pg_dump --host=localhost --port=5432 --username=postgres --schema-only --no-owner --no-privileges --file=docs/esquema-inicial.sql gestor_db
```

El comando pide la contraseña si la conexión lo necesita; no la escribas en el script. El archivo contiene estructura, no una copia de tus registros. Revisa nombres y restricciones en una PR y enlaza el commit que lo produjo.

2. Prueba el script en una base vacía de ensayo. No lo ejecutes sobre la base pública si ya contiene tablas. Para la primera instalación pública, comprueba que el destino esté vacío y aplica el script mediante el cliente PostgreSQL conectado con TLS.
3. En las variables del App Service configura `SPRING_JPA_HIBERNATE_DDL_AUTO=validate` y `SPRING_SQL_INIT_MODE=never`. Conserva URL, usuario y contraseña de su propio entorno. No copies create-drop de CI.
4. Arranca el backend y comprueba que valida el esquema. Si falta una columna, revisa la versión de script y JAR; no cambies validate por update para ocultar la discrepancia.
5. Carga datos ficticios mediante la colección. En las siguientes semanas los cambios de relaciones de Servidor 23–26 requieren scripts incrementales revisados y una prueba sobre copia de datos; no se vuelve a aplicar el esquema completo.

#### Bloque D · La comprobación que importa

<p class="stage stage--solo">Individual, y esta es la que decide si la sesión ha salido</p>

1. Cread un elemento con la colección contra la URL pública.
2. En el portal, **reiniciad** vuestro App Service.
3. Esperad a que arranque y consultad el mismo id desde la colección.
4. El elemento sigue ahí.

La comprobación demuestra que ese registro sobrevive al reinicio del backend. Completadla verificando que está en la base pública y en la versión identificada.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación de la sesión</p>
  <ul class="checklist">
    <li>El servidor de base de datos existe, es B1ms y está en la misma región que la API.</li>
    <li>Las tres variables están en el App Service y ninguna en el repositorio.</li>
    <li>Hay datos de ejemplo cargados.</li>
    <li>Los datos sobreviven a un reinicio del servicio, comprobado por vosotros.</li>
  </ul>
</div>

<details class="aside aside--help">
  <summary>Si en Servidor todavía no habéis terminado la persistencia</summary>
  <p>Haced igualmente los bloques A y B: el servidor y las variables son trabajo de esta asignatura y no dependen de que vuestra aplicación sepa usarlos todavía. En cuanto la versión con persistencia esté lista, entra por el circuito de siempre y el bloque D se hace entonces. Lo que no vale es llegar a la entrega del trimestre sin haberlo comprobado nunca.</p>
</details>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Servidor creado, conexión por variables de entorno y datos que sobreviven a un reinicio.</span></div>
  <div><strong>Si lo tenéis</strong><span>El fichero de ejemplo en el repositorio, con los nombres de las variables y ningún valor real.</span></div>
  <div><strong>Reto</strong><span>Comprobad que los tests de repositorio de Servidor 22 pasan en la base aislada configurada en Intermodular 11.</span></div>
</div>

<p>El servicio PostgreSQL del CI se configuró en Intermodular 11. Reutilizad ese job y verificad ahora que ejecuta los tests de repositorio de Servidor 22.</p>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Por qué la contraseña de la base de datos no puede estar en <code>application.properties</code>?</li>
    <li>Subís una credencial por error y la quitáis en el commit siguiente. ¿Está resuelto?</li>
    <li>Quitáis un campo de una entidad y desplegáis. ¿Qué le pasa a la columna?</li>
    <li>¿Por qué el servidor rechaza vuestra conexión si no pedís SSL?</li>
    <li>¿Qué demuestra reiniciar el servicio y volver a mirar?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el repositorio es público y porque la dirección cambia entre entornos. Va en el entorno, y en el repositorio solo un ejemplo con valores falsos.</p>
  <p>2 · No. Sigue en el historial. Lo único que lo resuelve es cambiar la contraseña en el servidor.</p>
  <p>3 · Con validate, el arranque comprueba el esquema y no lo modifica. Un cambio se prepara mediante un script incremental revisado y ensayado.</p>
  <p>4 · Porque solo acepta conexiones cifradas, y el error que da no menciona el cifrado: parece un problema de red.</p>
  <p>5 · Que los datos viven fuera de la aplicación. Es la única comprobación que distingue persistencia de casualidad.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 13</p>
  <ul class="checklist">
    <li>Los datos de vuestra API sobreviven a un reinicio, comprobado.</li>
    <li>Ninguna credencial en ninguno de vuestros dos repositorios, revisado mirando el historial y no solo los ficheros de hoy.</li>
    <li>Traéis anotado qué pasaría si mañana cambiarais el nombre de un campo en la API.</li>
  </ul>
</div>

## Lo que debes recordar

| Decisión | Comprobación |
| --- | --- |
| Conservar el repositorio de Servidor | Historial, remoto y aportaciones continúan desde el comienzo |
| Ejecutar las pruebas en CI | El informe muestra tests ejecutados y un fallo bloquea la fusión |
| Identificar el artefacto | El despliegue corresponde a un commit y una ejecución concretos |
| Separar despliegue y arranque | El workflow termina y después la aplicación responde en su ruta |
| Mantener entornos separados | Desarrollo, CI y producción usan bases y credenciales propias |
| Preparar el esquema | validate comprueba la estructura; el script revisado prepara sus cambios |
| Reutilizar el contrato | La misma colección se ejecuta contra local y producción |
| Coordinar el cierre | La versión completa se comprueba con Servidor 27–28 e Intermodular 14 |

### Vocabulario que utilizarás

Un **artefacto** es el resultado construido. Un **entorno** reúne servicios y configuración de una ejecución. Un **contrato** describe peticiones y respuestas y puede comprobarse con tests. Un **script incremental** modifica una versión del esquema conservando los datos previstos. Una **release** identifica una versión y declara qué se ha comprobado y qué queda pendiente.

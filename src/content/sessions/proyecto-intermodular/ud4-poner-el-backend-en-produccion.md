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

<p class="lead">La API desarrollada en Servidor se ejecuta actualmente en la estación de trabajo de quien la programó. El objeto de esta unidad es su puesta en producción bajo una URL pública, sometida al mismo flujo de integración que el portfolio y consumida desde él.</p>

<div class="rule">
  <p class="rule-label">Delimitación de competencias evaluativas</p>
  <p>El código de la API corresponde al módulo de <strong>Servidor</strong>: su arquitectura por capas, sus validaciones, su tratamiento de errores y sus pruebas. Los defectos técnicos se corrigen en ese mismo repositorio y su evaluación pertenece a dicho módulo. En Proyecto Intermodular se evalúa que ese código resida en un repositorio sometido a un flujo de integración, que un pipeline lo compile y ejecute sus pruebas antes de autorizar la fusión, que se encuentre desplegado y que una colección de peticiones verifique su contrato; el cliente completo se aborda tras las unidades 33 y 34 de Servidor. Una implementación técnicamente excelente que solo se ejecute en un entorno local no supera los criterios de esta unidad.</p>
</div>

<div class="rule">
  <p class="rule-label">Incorporación de la persistencia dentro del trimestre</p>
  <p>El artefacto desplegado es el mismo CRUD seleccionado y desarrollado en Servidor. La primera publicación puede mantener el estado en memoria, con la consiguiente pérdida de los datos en cada reinicio del proceso: no constituye un defecto, pero debe documentarse en el README para conocimiento de quien consulte el proyecto. PostgreSQL se incorpora en la UD5 de Servidor, dentro todavía del <strong>primer trimestre</strong>, y a partir de ese momento la versión persistente se publica mediante este mismo workflow. En ningún caso se crea una segunda API.</p>
</div>

### Los hitos compartidos del primer trimestre

| Lo que entrega Servidor | Lo que se trabaja aquí |
| --- | --- |
| CRUD en memoria con DTO, validación y errores, al terminar la UD3 | Repositorio del backend, CI y primera puesta en producción |
| Capas y tests de servicio, en la UD4 | Ejecutar las pruebas en cada pull request y comprobar que un fallo bloquea la fusión |
| CRUD con PostgreSQL y tests de repositorio, en la UD5 | Configurar la base de datos del entorno desplegado, sus variables y el entorno de pruebas del CI; publicar la misma API persistente |
| Versión del primer trimestre revisada y defendida, en la UD6 | Identificar el mismo commit desplegado y conservar las evidencias del workflow, CI, revisiones y puesta en producción |

La secuencia está coordinada con Servidor: ninguna sesión exige contenidos que no se hayan impartido allí previamente, y cada una opera sobre la versión del backend disponible en esa fecha. El flujo de integración construido en estas seis sesiones permanece operativo y se aplica a cada incremento del backend hasta el cierre del trimestre. Si al llegar a la sesión 11 la UD5 de Servidor no estuviera completa, se publica el estado disponible y las mejoras posteriores se incorporan por el mismo procedimiento. La entrega del trimestre sí requiere, en todo caso, persistencia en producción.

## Sesión 7 · El CI del repositorio de Servidor

**Antes de empezar.** La API de Servidor ya tiene DTO, validaciones y respuestas de error. Hoy le montas la compilación y las pruebas automáticas, con el Maven Wrapper que ya trae el proyecto.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>La API se ejecuta en el entorno local. ¿Qué condiciones serían necesarias para que la consumiera una persona ajena al aula?</li>
    <li>El pipeline del portfolio comprueba HTML, enlaces, formato y accesibilidad. ¿Qué tendría que comprobar el de una API?</li>
    <li>¿Qué directorios de un proyecto Java no deben incorporarse nunca a un repositorio de código, y por qué?</li>
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

<p class="stage stage--solo">Trabajo individual, por el flujo establecido: issue, rama, pull request</p>

Crea el archivo `.github/workflows/ci.yml`:

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
  <dd><strong>Debe declararse la versión registrada en el paso 2</strong>, no el valor 21 del ejemplo. El runner no aprovisiona ningún JDK por defecto: la distribución y la versión se declaran de forma explícita. Si el valor declarado no coincide con el que especifica el <code>pom.xml</code>, la compilación falla con un mensaje que no menciona ninguna de las dos versiones.</dd>
  <dt><code>cache: maven</code></dt>
  <dd>Conserva entre ejecuciones el repositorio local de dependencias. Sin esta directiva, cada pull request vuelve a descargar el árbol completo de dependencias, con el consiguiente incremento de la duración del job.</dd>
  <dt><code>./mvnw</code></dt>
  <dd>El <em>Maven Wrapper</em> incluido en el proyecto. Utiliza la versión de Maven declarada por el propio proyecto y no la instalada en la máquina anfitriona, lo que garantiza una construcción equivalente en el runner y en cualquier entorno local.</dd>
  <dt><code>-B</code></dt>
  <dd>Modo por lotes (<em>batch</em>): suprime el coloreado y los indicadores de progreso, que en un registro no interactivo generan ruido y dificultan el diagnóstico.</dd>
  <dt><code>verify</code></dt>
  <dd>Fase del ciclo de vida de Maven que compila el código, ejecuta las pruebas y construye el artefacto empaquetado. El fallo de cualquiera de las tres etapas determina el fallo del job.</dd>
</dl>

<details class="aside aside--help">
  <summary>Si el job falla con «permission denied» al ejecutar <code>./mvnw</code></summary>
  <p>Es la incidencia más frecuente de esta sesión y no guarda relación con el código de la aplicación. El runner ejecuta Linux, donde un archivo requiere el bit de permiso de ejecución; el sistema de archivos de Windows no conserva ese atributo, de modo que el wrapper se incorporó al repositorio sin él. Se corrige registrando el permiso en el índice de Git y publicando el cambio:</p>
  <p><code>git update-index --chmod=+x mvnw</code>, después commit y push.</p>
  <p>Conviene retener la causa: es la primera manifestación práctica de que el entorno de construcción no coincide con el entorno de desarrollo, diferencia que reaparecerá en otros contextos.</p>
</details>

<details class="aside aside--help">
  <summary>Si el proyecto no incorpora <code>mvnw</code></summary>
  <p>Utiliza <code>mvn -B verify</code>, sin el prefijo <code>./</code>: los runners incorporan Maven preinstalado. La construcción se completa, pero la solución es inferior, dado que la versión de la herramienta la determina la máquina y no el proyecto. Restaura los archivos del wrapper desde el historial o desde la plantilla de Servidor, conservando el código y el repositorio actuales.</p>
</details>

**Provocación controlada de fallos.** Introduce las dos alteraciones siguientes en una rama de diagnóstico, sin fusionarlas, y restaura su estado antes de aprobar la pull request:

| Alteración introducida | Propiedad que demuestra |
| ---------------------- | ----------------------- |
| Supresión de un punto y coma en una clase | El pipeline impide la integración de código que no compila |
| Inversión temporal de una aserción de prueba | El pipeline impide la integración de código que compila pero incumple su especificación |

El segundo caso constituye la diferencia sustancial entre este pipeline y el del portfolio: la validación no se limita a la corrección sintáctica del artefacto, sino que verifica su comportamiento.

#### Bloque C · Convertirlo en puerta y estrenar el circuito

<p class="stage stage--solo">Trabajo individual</p>

1. Fusiona la pull request que incorpora el CI.
2. Accede a **Settings → Rules → Rulesets → main protegida → Edit → Require status checks** e incorpora **Compilar y probar**.
3. Abre tres issues correspondientes a los siguientes incrementos previstos de la API y recorre al menos una de forma completa por el flujo de integración.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión 7</p>
  <ul class="checklist">
    <li>El repositorio de la API existe, es público y no contiene la carpeta de construcción.</li>
    <li>Cada pull request muestra el check «Compilar y probar».</li>
    <li>La comprobación es obligatoria y se ha verificado una pull request bloqueada por una prueba fallida.</li>
    <li>Una issue de la API recorrida entera.</li>
  </ul>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Por qué el directorio de construcción no se incorpora al repositorio?</li>
    <li>¿Qué hace <code>verify</code> que no haría solo compilar?</li>
    <li>¿Para qué sirve <code>cache: maven</code>?</li>
    <li>¿Por qué el wrapper produce una construcción equivalente en el runner y en el entorno local?</li>
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
    <li>La API se ejecuta en el entorno local y responde a una petición efectuada desde el navegador.</li>
    <li>Es posible identificar el puerto en el que escucha —el proceso lo indica al arrancar— y la ruta que devuelve la colección de datos.</li>
    <li>El check de compilación está en verde en <code>main</code>.</li>
  </ul>
</div>

## Sesión 8 · La API en una URL

**Antes de empezar.** El backend está organizado por capas y su CI ya funciona. Hoy publicarás esa versión en memoria y comprobarás su respuesta desde una URL pública.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>La API escucha en un puerto determinado del entorno local. ¿Qué elemento del sistema establece ese número?</li>
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

Este taller emplea App Service con publicación de tipo Código y runtime Java SE, no un contenedor personalizado. El entorno Java expone la variable SERVER_PORT, cuyo valor Spring Boot puede resolver; la configuración debe mantenerse compatible con ese entorno y el puerto efectivo debe verificarse en el registro del servicio. WEBSITES_PORT pertenece a la configuración de contenedores personalizados y no se añade aquí como solución genérica. [Referencia oficial de App Service](https://learn.microsoft.com/en-us/azure/app-service/reference-app-settings).

#### Entorno de aula

Antes de aprovisionar recursos conviene verificar la oferta y los límites que declara la suscripción. El plan F1, cuando esté disponible para la combinación seleccionada, impone cuotas y puede suspender la aplicación por inactividad. La primera respuesta puede tardar más que las siguientes. Utiliza el entorno de prácticas disponible conservando el mismo repositorio y artefacto.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Verificación del puerto de escucha

Abre application.properties y revisa si existe una propiedad server.port. En este taller puede escribirse `server.port=${SERVER_PORT:8080}`: usa el puerto del entorno cuando esté definido y 8080 en local. Conserva el resto de configuración. Arranca la API, anota el puerto de los logs y prueba una ruta conocida. Más adelante repetirás esa comprobación en el runtime Java SE del proveedor.

#### Bloque B · Crear el servicio en Azure

<p class="stage stage--guided">Todos a la vez, a la misma pantalla</p>

En **portal.azure.com**, localiza `App Services` y selecciona **Crear** → **Aplicación web**.

| Campo | Valor |
| ----- | ----- |
| Suscripción | Azure for Students |
| Grupo de recursos | El mismo del portfolio, o uno nuevo |
| Nombre | Prefijo <code>api-</code> seguido de un identificador propio: forma parte de la URL pública |
| Publicar | **Código** |
| Pila del entorno de ejecución | **La versión de Java registrada en la sesión 7**, no la propuesta por defecto |
| Servidor web de Java | **Java SE (servidor web integrado)** |
| Sistema operativo | **Linux** |
| Región | West Europe |
| Plan de precios | **F1 gratuito** |

Revisar y crear. Al finalizar el aprovisionamiento, accede mediante **Ir al recurso** y abre la URL: el servicio devuelve la página predeterminada de App Service, dado que aún no se ha desplegado ningún artefacto.

**Verificar el runtime.** Confirma Código, Java SE y la misma versión de Java del pom. No añadas WEBSITES_PORT: no estamos publicando una imagen propia. Después del despliegue comprueba SERVER_PORT y el puerto de arranque en el registro del servicio. Si no coincide, revisa la propiedad server.port y los argumentos de arranque antes de cambiar otras opciones.

#### Bloque C · Conexión del servicio con el repositorio

<p class="stage stage--guided">Ejecución simultánea</p>

1. En el recurso, menú lateral → **Centro de implementación** (*Deployment Center*).
2. Origen: **GitHub**. Autoriza el acceso si el portal lo solicita.
3. Organización, repositorio `api-loquesea`, rama `main`.
4. Selecciona la identidad federada del entorno de prácticas y verifica que el workflow declara los permisos y la conexión previstos. Ante un fallo de configuración, la activación de la autenticación básica no constituye una solución: sustituye un mecanismo de credenciales efímeras por uno de credenciales permanentes y oculta el defecto en lugar de corregirlo.
5. **Guardar**.

Es previsible que el centro de implementación intente escribir directamente sobre `main` y sea rechazado por la protección configurada en la UD1. El comportamiento esperado es precisamente ese. El workflow se prepara en una rama y se incorpora mediante pull request, como cualquier otro cambio; la desactivación de las reglas de protección para permitir esa escritura no es un procedimiento admisible. Las credenciales residen en Secrets o en la conexión federada, nunca en el propio archivo YAML.

Conviene contrastar esta configuración con la de la sesión 1. La plantilla de GitHub Pages no requería credencial alguna porque el sistema que despliega y el que aloja pertenecen al mismo proveedor, lo que permite emitir un token efímero de ámbito interno. Aquí intervienen dos proveedores distintos, de modo que resulta necesario acreditar la identidad de uno ante el otro: es el caso de credenciales al que se aludió entonces. Obtén el archivo generado y analízalo:

```bash
git switch main
git pull
```

Localiza en el archivo las dos diferencias respecto al del portfolio: **existe una etapa de compilación** previa al despliegue, y **existen dos jobs**, uno de construcción y otro de publicación, declarando el segundo una dependencia sobre el primero.

<dl class="answer">
  <dt>¿Qué comando de construcción usa el workflow que ha escrito Azure?</dt>
  <dd></dd>
  <dt>¿Qué se pasa del primer job al segundo, y por qué no se compila otra vez?</dt>
  <dd></dd>
  <dt>¿Cómo se llama el secreto que ha creado?</dt>
  <dd></dd>
  <dt>¿Qué versión de Java declara, y coincide con la del proyecto?</dt>
  <dd></dd>
</dl>

<div class="rule">
  <p class="rule-label">Dos workflows con responsabilidades diferenciadas</p>
  <p>El workflow propio, <code>ci.yml</code>, se ejecuta sobre cada pull request y su función es <strong>impedir</strong> la integración de un cambio defectuoso. El generado por Azure se ejecuta una vez el cambio se ha incorporado a <code>main</code> y su función es <strong>publicar</strong>. La aparición de dos ejecuciones por cada cambio no indica un error de configuración: corresponde a la separación entre integración continua y despliegue continuo ya establecida en el portfolio.</p>
</div>

#### Bloque D · Verificación del arranque y diagnóstico

<p class="stage stage--solo">Trabajo individual · práctica de diagnóstico en producción</p>

Una vez el workflow concluya con éxito, accede a la URL de la API por la ruta que devuelve datos. Los dos resultados posibles requieren actuaciones distintas.

**Si responde:** repite la petición desde un dispositivo móvil con la red del operador y sin la red del centro. Esa comprobación acredita la accesibilidad pública efectiva del servicio.

**Si no responde:** no modifiques todavía la configuración. Accede al recurso en el portal, menú lateral → **Flujo de registro** (*Log stream*), y examina la salida que emite la aplicación. Corresponde a la salida de consola del entorno local, ahora en el entorno de producción.

| Salida observada en el registro | Diagnóstico |
| ------------------------------- | ----------- |
| La aplicación arranca e indica el puerto | El proceso se ha iniciado correctamente: el defecto está en la ruta solicitada. Verifica la URL completa |
| Excepción durante el arranque | El defecto reside en el código o en la configuración: es el mismo error que se produciría en el entorno local |
| Ausencia de salida y error de aplicación en la URL | Revisa el artefacto, el comando de arranque, el runtime Java SE y las variables de entorno; habilita el registro si todavía no emite información |

<div class="rule">
  <p class="rule-label">El registro como primera herramienta de diagnóstico</p>
  <p>La reacción habitual ante un servicio que no responde consiste en repetir el despliegue. Esa operación consume varios minutos y no aporta información diagnóstica; la consulta del registro requiere segundos y determina la causa con precisión. El principio aplicable —obtener evidencia antes de modificar el sistema— distingue la corrección fundamentada de la prueba por tanteo.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La API responde en su URL pública desde una red que no es la del aula.</span></div>
  <div><strong>Ampliación</strong><span>Capacidad de consultar el registro e interpretar la salida que emite la aplicación durante el arranque.</span></div>
  <div><strong>Reto</strong><span>Implementar un <em>endpoint</em> de estado que acredite que la aplicación se encuentra operativa y verificarlo mediante <code>curl</code> desde la terminal.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Plan alternativo si el plan gratuito no da de sí</summary>
  <p>El plan F1 impone dos límites relevantes. El primero es 1 GB de memoria. El segundo son <strong>60 minutos de CPU diarios</strong>, contabilizados por región y suscripción y compartidos entre todas las aplicaciones gratuitas de esa región: al agotarse, el servicio se detiene y responde con código 403 hasta la medianoche UTC. Una aplicación que entra en un ciclo de arranque y terminación consume esa cuota en pocas horas.</p>
  <p>La alternativa es <strong>Azure Container Apps</strong>, que tiene franja mensual gratuita —180.000 segundos de vCPU, 360.000 de memoria y dos millones de peticiones— y que <em>escala a cero</em>: mientras nadie la usa no consume nada.</p>
  <p>Los elementos que <strong>no</strong> varían son los determinantes: el repositorio, el flujo de integración, el CI, la resolución del puerto, la configuración de CORS y la coordinación entre ambos componentes son idénticos. La única diferencia consiste en desplegar una imagen de contenedor en lugar de un artefacto, imagen que Spring Boot construye mediante <code>./mvnw spring-boot:build-image</code> sin necesidad de redactar un Dockerfile.</p>
  <p>La elección de plataforma se acuerda en clase y para el conjunto del grupo; no procede modificarla de forma individual.</p>
</details>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Qué runtime se ha seleccionado y mediante qué procedimiento se verifica el puerto efectivo?</li>
    <li>¿Por qué el workflow de la API tiene dos jobs y el del portfolio uno?</li>
    <li>La URL devuelve un error y el despliegue ha concluido con éxito. ¿Cuál es la primera actuación?</li>
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
    <li>Constan registradas la URL de la API y la ruta que devuelve la colección de datos.</li>
    <li>Consta un esquema de la interfaz del portfolio que mostrará esos datos.</li>
  </ul>
</div>

## Sesión 9 · Comprobar el contrato publicado

**Antes de empezar.** Tienes una API publicada y una colección de peticiones. Hoy comprobarás que la versión pública conserva el contrato que funciona en local.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Un **contrato de API** especifica qué puede solicitar un programa consumidor y qué obtendrá a cambio: método, ruta, campos y códigos de estado HTTP. Esas respuestas ya están implementadas en Servidor. En esta sesión se verifica que la versión publicada cumple el mismo contrato que la local, sin reimplementar sus controladores.

El consumidor puede ser Bruno, una prueba o un navegador. Para detectar un cambio incompatible no hace falta haber programado todavía una interfaz. El cliente completo con fetch y CORS se trabajará después de las sesiones 33–34 de Servidor, en Intermodular 18. Ahora utilizamos la colección que ya conoce el grupo.

**La URL base determina el destino, no el contrato.** La ruta `/tareas` debe mantener su denominación en el entorno local y en producción. El prefijo de versión `/api/v1` se introduce en Servidor 32 y no procede incorporarlo antes por analogía con otras fuentes. Un código 404 puede indicar una ruta incorrecta aunque el proceso haya arrancado sin incidencias.

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

En `.github/workflows/ci.yml`, añade `services` y `env` dentro del job `build`, al mismo nivel que `runs-on` y `steps`. Conserva las etapas de checkout, Java y verify de la sesión 7. Declara la misma versión mayor de PostgreSQL que emplea el proyecto; 16 es el valor del ejemplo.

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
    <li>El proceso de la API se reinicia. ¿Qué ocurre en el estado actual con los datos almacenados?</li>
    <li>¿En qué ubicación está registrada actualmente la contraseña de la base de datos local?</li>
    <li>Se añade un campo a una entidad y se despliega. ¿Qué elemento del sistema modifica la tabla?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Publicar el estado persistente

Servidor 19–22 ya ha preparado JPA, PostgreSQL y pruebas de repositorio. Hoy cambia su entorno: utilizamos el mismo backend y publicamos la base de datos que necesita. No reescribimos entidades ni consultas para Intermodular.

Distinguimos desarrollo, prueba/CI y producción. Cada uno tiene su propia base y configuración. La de CI se destruye al terminar; la pública conserva los datos de demostración. Un cambio de esquema debe quedar identificado y comprobado antes de aplicarlo sobre datos que queremos mantener.

#### Comprobar la oferta antes de crear

La oferta de Azure for Students establece requisitos de elegibilidad y límites por servicio. La documentación oficial contempla una cantidad gratuita de PostgreSQL durante un periodo limitado para las cuentas elegibles, sin garantizar que toda cuenta del alumnado tenga esa oferta activada. Debe verificarse la suscripción, la región, el tamaño, el almacenamiento y el coste estimado. Si la configuración no encaja, se emplea el recurso de aula acordado: la superación de la sesión no requiere la contratación de ningún plan. [Condiciones y servicios de Azure for Students](https://azure.microsoft.com/en-us/free/students/).

#### Configuración y esquema

Las credenciales reales se configuran en el proveedor; los nombres de variables y el procedimiento se guardan en el repositorio. Para producción seguimos la decisión de Servidor: esquema preparado y ddl-auto=validate. La creación automática update de desarrollo no se convierte en el procedimiento de actualización de producción.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Crear el servidor

<p class="stage stage--guided">Todos a la vez, a la misma pantalla</p>

En **portal.azure.com**, localiza `Azure Database for PostgreSQL` y selecciona **Servidor flexible** (*Flexible server*) → **Crear**.

| Campo | Valor |
| ----- | ----- |
| Suscripción y grupo de recursos | Los mismos que la API |
| Nombre del servidor | Prefijo <code>db-</code> seguido de un identificador propio: forma parte de una dirección pública |
| Región | La misma en la que se aprovisionó el App Service |
| Tipo de carga de trabajo | **Desarrollo** |
| Proceso y almacenamiento | **Burstable B1ms**, 32 GB |
| Nombre de usuario administrador | Un identificador propio; **no** <code>admin</code> |
| Contraseña | De longitud suficiente y almacenada en un medio recuperable |

<div class="rule">
  <p class="rule-label">Verificación del dimensionamiento previa al aprovisionamiento</p>
  <p>Si la configuración no indica <strong>B1ms</strong>, debe interrumpirse el proceso. Ese es el dimensionamiento de referencia de la práctica; conviene comprobar que está cubierto por la oferta antes de crear el recurso. A diferencia de un plan de cómputo con escalado a cero, un servidor de base de datos consume recursos de forma continua, con independencia de que esté atendiendo peticiones.</p>
</div>

**Configuración de red.** En la pestaña de conectividad, selecciona acceso **público** y autoriza las direcciones de salida del App Service y la dirección IP del aula que requiera acceso. Revisa la conectividad configurada: habilitar el acceso a todos los servicios de Azure no restringe las conexiones a la propia suscripción.

**Creación de la base de datos.** Una vez aprovisionado el servidor, crea en él una base de datos con el nombre del proyecto. Una instancia de servidor puede alojar varias bases de datos; la aplicación establece la conexión con una de ellas.

#### Bloque B · La cadena de conexión como configuración externa

<p class="stage stage--solo">Trabajo individual, sin incorporar ningún valor al código fuente</p>

En el App Service: **Configuración → Variables de entorno**. Declara tres variables nuevas:

| Nombre | Valor |
| ------ | ----- |
| <code>SPRING_DATASOURCE_URL</code> | <code>jdbc:postgresql://TU-SERVIDOR.postgres.database.azure.com:5432/TU-BD?sslmode=require</code> |
| <code>SPRING_DATASOURCE_USERNAME</code> | El usuario administrador declarado en el bloque A |
| <code>SPRING_DATASOURCE_PASSWORD</code> | Su contraseña |

<details class="aside aside--help">
  <summary>Por qué <code>sslmode=require</code> no es opcional</summary>
  <p>El servidor rechaza las conexiones no cifradas. Si el parámetro se omite, el mensaje de error no identifica la ausencia de TLS como causa: informa únicamente de que la conexión no ha podido establecerse, lo que orienta el diagnóstico hacia la configuración del cortafuegos. Conviene retener este caso, porque el síntoma no señala la causa.</p>
</details>

**Contenido versionable.** Ninguno de los valores anteriores se incorpora al repositorio. Sí se incorpora un archivo de ejemplo con los nombres de las variables y valores ficticios, de modo que quien clone el proyecto conozca qué configuración debe aportar. Esa distinción separa un proyecto reproducible por terceros de uno que solo se ejecuta en el entorno de su autor.

#### Bloque C · Creación controlada del esquema

1. En la base local de ensayo, comprueba que el esquema coincide con las entidades y que los tests de Servidor 22 pasan. Genera un script de esquema a partir de esa versión, por ejemplo con pg_dump, instalado con las herramientas de PostgreSQL. En PowerShell ajusta usuario, base y ruta del ejecutable a tu instalación:

```powershell
pg_dump --host=localhost --port=5432 --username=postgres --schema-only --no-owner --no-privileges --file=docs/esquema-inicial.sql gestor_db
```

El comando pide la contraseña si la conexión lo necesita; no la escribas en el script. El archivo contiene estructura, no una copia de tus registros. Revisa nombres y restricciones en una PR y enlaza el commit que lo produjo.

2. Prueba el script en una base vacía de ensayo. No lo ejecutes sobre la base pública si ya contiene tablas. Para la primera instalación pública, comprueba que el destino esté vacío y aplica el script mediante el cliente PostgreSQL conectado con TLS.
3. En las variables del App Service configura `SPRING_JPA_HIBERNATE_DDL_AUTO=validate` y `SPRING_SQL_INIT_MODE=never`. Conserva URL, usuario y contraseña de su propio entorno. No copies create-drop de CI.
4. Arranca el backend y comprueba que valida el esquema. Si falta una columna, revisa la versión de script y JAR; no cambies validate por update para ocultar la discrepancia.
5. Carga datos ficticios mediante la colección. En las siguientes semanas los cambios de relaciones de Servidor 23–26 requieren scripts incrementales revisados y una prueba sobre copia de datos; no se vuelve a aplicar el esquema completo.

#### Bloque D · Verificación de la persistencia

<p class="stage stage--solo">Trabajo individual · comprobación determinante de la sesión</p>

1. Crea un elemento mediante la colección de peticiones contra la URL pública.
2. En el portal, **reinicia** el App Service.
3. Espera a que el proceso arranque y consulta el mismo identificador desde la colección.
4. El elemento debe persistir.

La comprobación acredita que el registro sobrevive al reinicio del proceso, esto es, que el estado reside en el sistema gestor de base de datos y no en la memoria de la aplicación. Complétala verificando que el dato consta en la base pública y bajo la versión identificada.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>El servidor de base de datos existe, es B1ms y está en la misma región que la API.</li>
    <li>Las tres variables están en el App Service y ninguna en el repositorio.</li>
    <li>Hay datos de ejemplo cargados.</li>
    <li>Los datos sobreviven al reinicio del servicio, con la comprobación realizada de forma directa.</li>
  </ul>
</div>

<details class="aside aside--help">
  <summary>Si la persistencia no está terminada todavía en Servidor</summary>
  <p>Los bloques A y B se realizan igualmente: el aprovisionamiento del servidor y la configuración de las variables corresponden a este módulo y no dependen de que la aplicación las consuma todavía. Cuando la versión con persistencia esté disponible, se incorpora por el flujo de integración habitual y el bloque D se ejecuta en ese momento. Lo que no resulta admisible es alcanzar la entrega del trimestre sin haber verificado nunca la persistencia.</p>
</details>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Servidor creado, conexión por variables de entorno y datos que sobreviven a un reinicio.</span></div>
  <div><strong>Ampliación</strong><span>El archivo de ejemplo incorporado al repositorio, con los nombres de las variables y ningún valor real.</span></div>
  <div><strong>Reto</strong><span>Verificar que las pruebas de repositorio de Servidor 22 se superan sobre la base aislada configurada en Intermodular 11.</span></div>
</div>

<p>El servicio PostgreSQL del CI se configuró en Intermodular 11. Reutiliza ese job y verifica que ejecuta las pruebas de repositorio de Servidor 22.</p>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Por qué la contraseña de la base de datos no puede estar en <code>application.properties</code>?</li>
    <li>Se incorpora una credencial por error y se elimina en el commit siguiente. ¿Queda resuelta la incidencia?</li>
    <li>Se suprime un campo de una entidad y se despliega. ¿Qué ocurre con la columna correspondiente?</li>
    <li>¿Por qué el servidor rechaza la conexión si no se solicita cifrado TLS?</li>
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
    <li>Los datos de la API sobreviven al reinicio del servicio, con la comprobación realizada.</li>
    <li>Ninguna credencial presente en ninguno de los dos repositorios, verificado sobre el historial completo y no solo sobre el estado actual de los archivos.</li>
    <li>Un análisis escrito de las consecuencias de renombrar un campo de la API.</li>
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

---
title: "De Java a la Web: HTTP y Spring Boot"
label: "UD1 · Entender"
section: "ud-01"
order: 1
lang: "es"
summary: "Entender qué ocurre entre el navegador y el servidor, y construir con Spring Boot una primera API en memoria que ya se comprueba con un cliente HTTP."
duration: "12 horas · 2 semanas · 4 sesiones de 3 h"
modality: "Taller de proyecto · 25 min de explicación, 140 min de trabajo y 15 min de cierre"
deliverable: "Repositorio de GitHub actualizado con el código, la documentación y las comprobaciones de las sesiones de esta unidad."
date: "2026-09-09"
outcomes:
  - "Explicar el recorrido completo de una petición y una respuesta HTTP."
  - "Crear y ejecutar un proyecto Spring Boot entendiendo su estructura básica."
  - "Diseñar rutas con parámetros y devolver objetos serializados como JSON."
  - "Comprobar una API con Postman o Bruno leyendo estado, cabeceras y cuerpo."
  - "Implementar un CRUD en memoria con GET, POST, PUT y DELETE."
  - "Enumerar los defectos conocidos de la API construida y en qué unidad se resuelve cada uno."
requirements:
  - "JDK 21 o superior."
  - "Un IDE con soporte para Java y Maven."
  - "Un navegador con DevTools."
  - "Git instalado y una cuenta de GitHub para entregar el repositorio."
  - "Postman o Bruno instalado, a partir de la sesión 3."
priorKnowledge:
  - "Sintaxis básica de Java."
  - "Clases, objetos, métodos y colecciones."
---

### El proyecto que eliges hoy

Durante todo el primer trimestre construyes el mismo CRUD y utilizas su mismo repositorio en Servidor e Intermodular. El tema lo eliges tú y se acuerda con el profesor al comenzar. Puedes gestionar préstamos de material, reservas de instalaciones, pedidos, actividades de una asociación u otro problema que conozcas. El gestor de proyectos de los ejemplos es una referencia para entender el código; tu entrega utiliza el vocabulario y las reglas de tu dominio.

| Complejidad mínima del primer trimestre | Evidencia en tu producto |
| --- | --- |
| Un recurso principal y al menos tres entidades relacionadas con una función real | Modelo y casos de uso; no se añaden tablas de relleno |
| CRUD completo del recurso principal y gestión de los relacionados | Crear, listar, consultar, modificar y borrar mediante la API |
| Una relación uno a muchos y otra muchos a muchos | Asociar, consultar y desasociar sin perder integridad |
| DTO, validación y errores coherentes | Entradas rechazadas, ausencia de recursos y conflictos reproducibles |
| Capas y PostgreSQL | Responsabilidades separadas y datos que sobreviven al reinicio |
| Consultas, filtros y un listado paginado | Respuestas útiles y acotadas; se profundiza en la UD7 |
| Al menos tres reglas de negocio y una operación transaccional con varios cambios | Una reserva con elementos, un pedido con líneas o una operación equivalente; prueba de rollback |
| Consultas con relaciones revisadas | Detección y corrección de N+1 con evidencias SQL |
| Pruebas y contrato ejecutable | Tests de servicios y repositorios, y colección HTTP |
| Backend en producción durante el primer trimestre | La misma versión pasa por el workflow, CI y despliegue de Intermodular |

La autenticación y la autorización se incorporan en el segundo trimestre. Una entidad que represente a un socio, responsable o cliente en el primero todavía no implica cuentas con inicio de sesión. En la primera sesión basta con un esquema inicial que permita alcanzar esta complejidad; se concreta a medida que se aprende.

### Qué se entrega en cada sesión

La entrega de cada sesión es el **enlace al repositorio de GitHub con el trabajo realizado**, acompañado del enlace al commit que identifica esa versión. Se utiliza el mismo repositorio durante el módulo. El código, los ejercicios escritos y las comprobaciones quedan guardados allí; cada sesión tiene un registro en `docs/sesiones/sesion-NN.md`, donde `NN` es su número con dos cifras. La página de cada sesión indica su archivo concreto y los pasos para entregar.

### Tiempo y coordinación

Cada semana tiene dos sesiones de tres horas. Cada sesión reserva 25 minutos para explicar y demostrar, 140 minutos para trabajar sobre tu proyecto y 15 minutos para comprobar el resultado: 180 minutos. Las consultas durante el taller se atienden sobre el código. La explicación aparece completa en «Se explica» y los procedimientos, el código y las comprobaciones están desarrollados en «Se trabaja». Las ayudas desplegables se reservan para respuestas o dudas puntuales.

Se mantienen las 156 horas previstas: primer trimestre, 28 sesiones y 84 horas; segundo trimestre, 24 sesiones y 72 horas. Las semanas son bloques docentes orientativos, no fechas de evaluación del centro. La [GVA fija para FP en 2026/2027](https://sede.gva.es/es/detall-tramit?id_proc=G25685) el inicio el 9 de septiembre de 2026, Navidad del 22 de diciembre al 6 de enero y Pascua del 25 de marzo al 5 de abril. El tramo de septiembre a Navidad es mayor que el de enero a Pascua; los días concretos se ajustarán al horario, las evaluaciones, la formación en empresa y los festivos locales del centro.

Servidor evalúa implementación, arquitectura, persistencia, contrato, reglas y pruebas. Intermodular evalúa cómo ese mismo código recorre issues, ramas, revisiones, CI y puesta en producción. La API se publica primero en memoria cuando llega su taller de despliegue y se actualiza con PostgreSQL dentro del primer trimestre. El cliente del portfolio se trabaja allí; la UD8 de Servidor retoma esa integración para comprender el navegador antes de añadir seguridad.

## Semana 1 · Elegir el CRUD y arrancar el servidor

## Sesión 1 · Elegir el CRUD y arrancar el servidor

### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

#### Qué ocurre entre el navegador y tu aplicación

El navegador es un cliente: envía una petición. El programa Java es el servidor: permanece escuchando y responde cuando recibe una. Son dos programas y pueden ejecutarse en el mismo ordenador; por eso usaremos localhost. El puerto identifica dónde escucha el servidor, por ejemplo 8080, y la ruta indica qué recurso se solicita.

Una petición contiene método, ruta, cabeceras y, a veces, cuerpo. En `GET /prestamos/7`, GET expresa una consulta y la ruta identifica el préstamo 7. La respuesta tiene un código de estado, cabeceras y cuerpo: 200 indica que la consulta ha tenido éxito; 404 que no se ha encontrado el recurso. Si la aplicación está apagada, no hay respuesta HTTP: el navegador informa de que no puede conectarse. Distinguir esos dos fallos evita empezar a cambiar rutas cuando el servidor ni siquiera está arrancado.

#### Qué ponen Spring Boot y Maven

Spring Boot arranca la aplicación con un servidor web embebido. El servidor recibe los bytes; Spring interpreta la petición, busca el método asociado a la ruta y convierte su resultado en una respuesta. Una clase marcada con `@RestController` atiende peticiones. `@GetMapping("/estado")` conecta un GET a esa ruta con un método Java. El nombre del método puede cambiar sin modificar la URL: la ruta la fija la anotación.

Maven descarga las dependencias declaradas en pom.xml, compila y ejecuta las pruebas. El wrapper incluido en el proyecto permite usarlo sin instalar otra versión manualmente. El proyecto Java se abre desde la carpeta que contiene pom.xml; esperar a que termine la descarga de dependencias forma parte del primer arranque.

#### La demostración que haremos

Abriremos una petición en la pestaña Red del navegador y localizaremos método, ruta y estado. Después arrancaremos una aplicación, consultaremos una ruta existente y otra inexistente, y pararemos el proceso para comparar el 404 con el fallo de conexión. Durante la práctica repetirás esa secuencia en el proyecto que elijas. El CRUD irá creciendo en ese mismo repositorio durante todo el trimestre.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

Hoy terminarás con una aplicación Spring Boot que responde a unas primeras rutas y con su código subido a GitHub. El CRUD completo se construirá durante las próximas sesiones.

El orden es este: elegir qué quieres gestionar, preparar las herramientas, observar una petición HTTP, generar la aplicación, hacerla responder y subir el resultado a GitHub. Al empezar todavía no necesitas tener un repositorio ni clases Java creadas.

#### Paso 1 · Elegir qué va a gestionar tu aplicación

Un **CRUD** permite crear, consultar, modificar y borrar información. Antes de programarlo, decide qué información tendrá sentido gestionar. El **dominio** es simplemente el tema de tu aplicación: préstamos de material, reservas de pistas, pedidos de una tienda o actividades de una asociación.

1. Abre una nota provisional y escribe un nombre para tu aplicación. Todavía no hace falta guardarla en GitHub.
2. Completa esta frase: «Mi aplicación la utilizará ___ para ___». Por ejemplo: «La utilizará una asociación para registrar qué material presta a cada socio y cuándo debe devolverlo».
3. Anota cuatro tipos de cosas sobre las que guardarás información. A cada tipo lo llamaremos **entidad**. No son cuatro pantallas ni cuatro registros de la misma cosa: son clases distintas de información.

| Entidad del ejemplo | Un registro concreto | Datos que guardarías |
| --- | --- | --- |
| Socio | Ana, socia número 18 | Nombre y número de socio |
| Ejemplar | Proyector número 4 | Nombre, número de inventario y disponibilidad |
| Préstamo | Préstamo número 27 | Socio, fechas y material prestado |
| Categoría | Audiovisual | Nombre y descripción |

4. Escribe tres condiciones que deba cumplir la aplicación. Son las **reglas de negocio**. Ejemplos: «un ejemplar no puede estar en dos préstamos activos», «la devolución no puede ser anterior a la salida» y «un socio bloqueado no puede abrir un préstamo».
5. Describe una acción un poco más completa que guardar un único dato. Por ejemplo: «prestar varios ejemplares a un socio; si alguno no está disponible, no se registra el préstamo». Más adelante aprenderás a implementarla con una transacción. Hoy basta con contar qué debería pasar.
6. Enseña la propuesta al profesor para comprobar que permite trabajar la complejidad del trimestre. No tienes que diseñar todavía tablas, relaciones JPA ni clases. Guarda la nota: la copiarás al README cuando generes la aplicación.

**Al terminar este paso:** tienes una propuesta breve con usuario, finalidad, entidades, reglas y una operación de negocio. Los nombres y el diseño se podrán concretar durante el curso; no estás comprometiendo ahora todos los detalles técnicos.

#### Paso 2 · Preparar las herramientas y la carpeta de trabajo

1. Abre una terminal y ejecuta los dos comandos siguientes, uno después del otro:

```text
java -version
git --version
```

2. El primero debe mostrar el JDK previsto para clase, Java 21 en los ejemplos; el segundo, una versión de Git. Si un comando no se reconoce o el JDK no coincide, resuélvelo con el profesor antes de continuar. No necesitas instalar Maven por separado: el proyecto incluirá su wrapper.
3. Abre el IDE que utilizarás para Java. Todavía no abras un proyecto vacío: lo generarás en el paso 6.
4. Crea una carpeta de trabajo, por ejemplo `Documentos/DAW`. Ahí descomprimirás la aplicación que genere Spring Initializr. Su carpeta raíz será la que contenga `pom.xml`.
5. Abre GitHub en el navegador y comprueba que puedes entrar con tu cuenta. La creación y subida del repositorio se hacen en el paso 14, después de tener la aplicación. Si ya tienes el repositorio del backend preparado en Intermodular, usarás ese mismo.

**Al terminar este paso:** Java y Git responden, tienes el IDE listo, una carpeta para trabajar y acceso a GitHub. No se exige todavía ningún endpoint, prueba automática ni colección HTTP.

<p class="stage">Cliente, servidor y HTTP</p>

#### Paso 3 · Abre la caja negra

Ya no hay nada que creer: se puede mirar. Vamos a hacerlo juntos, paso a paso.

1. Abre el navegador y ve a una web cualquiera que uses a diario.
2. Pulsa `F12`, o `Ctrl + Shift + I`, para abrir las herramientas de desarrollo.
3. Selecciona la pestaña **Network** («Red»).
4. **Está vacía, y es correcto.** El panel solo registra lo que ocurre mientras está abierto.
5. Recarga con `F5`.

Ahora la lista se llena. Cada fila de esa lista **es una petición HTTP completa**, con todo lo que acabamos de estudiar dentro.

Mira abajo del todo del panel: verás algo como `48 requests · 1.2 MB transferred`.

Detente un segundo en ese número. Tú has escrito **una** dirección y has pedido **una** página. El navegador ha hecho cuarenta y ocho peticiones. Ha pedido el HTML, lo ha leído, ha descubierto que necesita hojas de estilo, tipografías e imágenes, y ha ido a buscar cada una **con una petición independiente**.

<div class="rule">
  <p class="rule-label">Idea que hay que retener</p>
  <p>Una página no se descarga: se <strong>reconstruye</strong> a partir de muchas respuestas separadas, que además llegan en desorden. Cuando en la UD10 hablemos de rendimiento y de <em>timeouts</em> al llamar a servicios ajenos, este será el punto de partida.</p>
</div>

La primera fila es el documento HTML: es la que provocó todas las demás. Haz clic en ella y se abrirá un panel lateral con pestañas.

En **Headers** («Cabeceras») verás varios bloques. Localiza exactamente esto:

| Búscalo aquí | Qué es, en lo que hemos estudiado |
| :--- | :--- |
| *General → Request URL* | La URL completa: esquema, host, puerto y ruta |
| *General → Request Method* | El método. Debería poner `GET` |
| *General → Status Code* | El código de estado. Debería poner `200` |
| *Request Headers* | Las cabeceras que envió **tu** navegador |
| *Response Headers* | Las cabeceras que devolvió **el servidor** |

Y ahora abre la pestaña **Response**. Eso que ves ahí es el **cuerpo** de la respuesta: el HTML tal cual salió del servidor, antes de que el navegador lo dibujara.

Abre en otra pestaña una API pública de pruebas:

```text
https://jsonplaceholder.typicode.com/posts/1
```

No hay diseño ni imágenes: solo datos.

```json
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere repellat provident",
  "body": "quia et suscipit suscipit recusandae"
}
```

Míralo en el panel de red y compáralo con la petición anterior. La estructura es idéntica —método, ruta, estado, cabeceras, cuerpo—; lo único que cambia es el `Content-Type`, que ahora es `application/json` en lugar de `text/html`.

**Esto es lo que vas a construir en este proyecto:** una API que devuelve datos y un cliente que los representa. Un backend también puede generar HTML, pero aquí trabajaremos con esa separación entre API y cliente.

<details class="aside aside--extra">
  <summary>Verlo aún más crudo, desde el terminal</summary>
  <p>Si quieres leer la respuesta HTTP entera, cabeceras incluidas, sin que el navegador la interprete:</p>
  <p>En Linux o macOS: <code>curl -i https://jsonplaceholder.typicode.com/posts/1</code></p>
  <p>En Windows escribe <code>curl.exe</code>, con la extensión. En PowerShell, <code>curl</code> a secas es otra cosa distinta y no acepta los mismos parámetros.</p>
  <p>La opción <code>-i</code> significa «incluye las cabeceras de la respuesta». Lo que aparece en pantalla es, letra por letra, el formato que hemos estudiado hoy.</p>
</details>

#### Paso 4 · Los filtros del panel, y qué es eso de Fetch/XHR

Justo encima de la lista de peticiones hay una fila de filtros: `All`, `Doc`, `CSS`, `JS`, `Font`, `Img`, `Media`, `Manifest`, `WS`, `Fetch/XHR`, `Other`. Cada uno deja a la vista un solo tipo de petición, y son la única forma razonable de encontrar algo en una lista de cincuenta.

Casi todos se entienden por el nombre: `Doc` es el documento HTML, `Img` son las imágenes, `Font` las tipografías. El que no se entiende por el nombre es el que más nos interesa.

<p class="term">Fetch / XHR</p>

Las peticiones que hace **el JavaScript de la página por su cuenta**, sin que tú navegues a ningún sitio y sin que la página se recargue. `XHR` es el mecanismo antiguo, *XMLHttpRequest*; `fetch` es el moderno. Las herramientas los agrupan en un mismo filtro porque, para quien mira, son lo mismo: peticiones que ha decidido hacer el código, no el navegador.

<div class="compare-pair">
  <div>
    <p class="compare-label">Las decide el navegador</p>
    <p class="compare-body">Lee el HTML, descubre que necesita una hoja de estilos, una tipografía o una imagen, y va a buscarla sin preguntar. Salen en <code>Doc</code>, <code>CSS</code>, <code>Font</code> e <code>Img</code>.</p>
  </div>
  <div>
    <p class="compare-label">Las decide el código de la página</p>
    <p class="compare-body">El JavaScript pide datos cuando le hacen falta: al pulsar algo, al escribir en un buscador, al llegar al final de la lista. Salen en <code>Fetch/XHR</code>.</p>
  </div>
</div>

El ejemplo de todos los días: escribes en un buscador y aparecen sugerencias debajo **sin que la página parpadee**. No has navegado a ninguna parte y la página es la misma; simplemente su código ha hecho una petición, ha recibido datos y los ha pintado. Eso es una petición Fetch/XHR.

<div class="rule">
  <p class="rule-label">Por qué te insisto con este filtro y no con los otros</p>
  <p>Las peticiones de <code>Fetch/XHR</code> son las que van a buscar <strong>datos</strong> a una API, y son exactamente el tipo de petición que atenderá el servidor que vas a escribir. Las de <code>Img</code> o <code>CSS</code> no las verás nunca en tu backend.</p>
  <p>Cuando en la UD8 conectes una página del navegador con tu API, sus peticiones aparecerán en este filtro y en ningún otro. Acostumbrarte hoy a mirarlo te ahorrará semanas de confusión entonces.</p>
</div>

#### Paso 5 · Ficha de tres peticiones

Trabajo individual. Elige **una web que uses de verdad** y rellena esta ficha para tres peticiones distintas de su carga.

La primera columna va rellenada como ejemplo, para que veas el nivel de detalle que se pide. Es una petición real de esta misma web.

<div class="table-scroll">

| Campo | Ejemplo resuelto | Petición A | Petición B | Petición C |
| :--- | :--- | :--- | :--- | :--- |
| Ruta, solo el *path* | `/es/docencia/` | | | |
| Método | `GET` | | | |
| Código de estado | `200` | | | |
| `Content-Type` de la respuesta | `text/html; charset=utf-8` | | | |
| ¿Tenía cuerpo la petición? | No | | | |
| ¿Qué crees que devuelve? | El HTML de la página de docencia | | | |

</div>

##### De dónde sale cada fila

Todo está en el panel lateral que abriste en el paso 3. Fila por fila:

1. **Ruta.** En `General → Request URL` tienes la dirección entera. Copia **solo desde la primera barra después del dominio**: de `https://marcsemperlloret.com/es/docencia/` se anota `/es/docencia/`.
2. **Método.** En `General → Request Method`.
3. **Código de estado.** En `General → Status Code`. Anota solo el número.
4. **`Content-Type`.** En **Response Headers**, no en Request Headers. Es la confusión más habitual: las dos listas tienen cabeceras con nombres parecidos, y aquí nos interesa lo que declaró el servidor sobre lo que envía.
5. **¿Tenía cuerpo la petición?** Si en el detalle no aparece ninguna pestaña de `Payload` o `Request`, no había cuerpo. En un `GET` la respuesta será casi siempre «no».
6. **¿Qué devuelve?** Ábrelo en la pestaña `Response` o `Preview` y descríbelo en tus palabras. No hace falta entenderlo entero.

##### Qué tres peticiones elegir

Que **no se parezcan entre sí**. Una de cada tipo:

| Petición | Cómo la encuentras |
| :--- | :--- |
| El documento HTML | Filtro `Doc`. Suele ser la primera de la lista |
| Un recurso estático | Filtro `Img` o `Font`. Una imagen o una tipografía |
| Una llamada a datos | Filtro `Fetch/XHR` |

Para la tercera, deja puesto solo el filtro `Fetch/XHR` y **navega por la web haciendo cosas**: pulsa botones, abre un menú, busca algo, baja hasta el final de una lista. Con la página quieta puede que no aparezca ninguna; en cuanto interactúas, empiezan a salir.

<details class="aside aside--help">
  <summary>Estoy atascado · con ese filtro no me aparece nada</summary>
  <p>Hay webs, sobre todo las hechas con HTML estático, que no hacen ninguna petición de datos. No es que lo estés haciendo mal.</p>
  <p>Prueba con una web que cargue contenido a medida que bajas, con un buscador que sugiera mientras escribes, o con cualquier aplicación donde inicies sesión. Si aun así no encuentras ninguna, anota en la tercera columna otro recurso estático distinto y escribe una frase explicando por qué crees que esa web no necesita llamadas a datos.</p>
</details>

Debajo de la tabla, responde en dos o tres frases a cada pregunta:

1. ¿Cuál de las tres tardó más, y por qué crees que fue?
2. Alguna petición de esa web seguro que no devolvió `200`. Busca una: usa el filtro de estado o recorre la lista. ¿Qué código era y qué le está diciendo al navegador?
3. Si el servidor de esa web se apagara ahora mismo y volvieras a recargar, ¿qué parte de lo que ves en pantalla seguiría apareciendo?

<p class="stage">Nuestra primera aplicación servidor</p>

#### Paso 6 · Generar el proyecto

Vamos a la web oficial que genera esqueletos de proyecto Spring Boot:

```text
https://start.spring.io
```

Rellena el formulario con estos valores de referencia. En Artifact, Name y Package name usa el nombre de tu propio proyecto:

| Campo | Valor | Por qué |
| :--- | :--- | :--- |
| Project | **Maven** | Es el gestor de dependencias que usaremos todo el curso |
| Language | **Java** | — |
| Spring Boot | **la versión estable que salga marcada por defecto** | Evita las que ponen `SNAPSHOT`, `M` o `RC`: son versiones en pruebas |
| Group | `com.ejemplo` | Identifica a la organización. Se escribe como un dominio al revés |
| Artifact | `gestor` | El nombre del proyecto |
| Name | `gestor` | Se rellena solo |
| Package name | `com.ejemplo.gestor` | Se rellena solo. **Anótalo: hoy va a importar** |
| Packaging | **Jar** | Un único archivo ejecutable que ya lleva el servidor dentro |
| Java | **21** | Salvo que se indique otra en clase |

A la derecha, en **Dependencies**, pulsa `ADD DEPENDENCIES` y añade una sola:

<p class="single-node">Spring Web</p>

Esa dependencia es la que trae Tomcat, el mapeo de rutas y la conversión a JSON. Hoy no necesitamos ninguna más, y añadir dependencias «por si acaso» es una mala costumbre: cada una arrastra configuración automática que después hay que entender.

Pulsa **GENERATE**. Se descarga un `.zip`.

<div class="rule">
  <p class="rule-label">Antes de abrirlo</p>
  <p><strong>Descomprime el archivo</strong> en una carpeta de trabajo estable, no dentro de la carpeta de descargas ni de una unidad de red sincronizada. Y descomprímelo de verdad: abrir el zip y arrastrar desde dentro suele dejar carpetas incompletas. Después, en el IDE, <em>abre la carpeta del proyecto</em>, la que contiene el <code>pom.xml</code>, no la carpeta que la contiene.</p>
</div>

#### Paso 7 · Qué te acaban de dar

Ábrela en el IDE y espera a que termine de descargar dependencias. Esto es lo que hay:

```text
gestor/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/ejemplo/gestor/
    │   │       └── GestorApplication.java
    │   └── resources/
    │       ├── application.properties
    │       ├── static/
    │       └── templates/
    └── test/
        └── java/
            └── com/ejemplo/gestor/
                └── GestorApplicationTests.java
```

| Archivo o carpeta | Qué es |
| :--- | :--- |
| `pom.xml` | La lista de dependencias y la configuración de la compilación |
| `mvnw` y `mvnw.cmd` | Maven incluido en el proyecto, para no tener que instalarlo |
| `src/main/java` | **Tu código.** Aquí trabajarás siempre |
| `GestorApplication.java` | La clase que arranca la aplicación |
| `src/main/resources` | Configuración y archivos que no son código |
| `application.properties` | Los ajustes de la aplicación. Hoy está vacío |
| `static/` | Archivos servidos tal cual: imágenes, CSS. Este curso apenas la usa |
| `src/test/java` | Las pruebas automáticas. Llegan en la UD4 |

##### El `pom.xml`, sin miedo

Es largo, pero solo tienes que reconocer tres zonas:

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.5.0</version>
</parent>
```

El **padre**. El número de versión que veas será el que hayas generado tú. De ahí hereda tu proyecto las versiones ya probadas de todas las librerías, para que no tengas que decidir tú si esta versión de Spring encaja con aquella de Tomcat.

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

Las **dependencias**. Fíjate en que no lleva número de versión: la pone el padre. Y fíjate en la palabra `starter`: un *starter* no es una librería, es un paquete de librerías que suelen ir juntas. `spring-boot-starter-web` arrastra Tomcat, Spring MVC y Jackson, el conversor de JSON, de una vez.

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

El **plugin** que sabe arrancar y empaquetar la aplicación.

##### La clase que arranca todo

```java
package com.ejemplo.gestor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GestorApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestorApplication.class, args);
    }
}
```

Son diez líneas y hay que entenderlas, porque explican casi todo lo raro que pasará después.

`main` es el mismo `main` de siempre. La diferencia está en que `SpringApplication.run(...)` **no termina**: monta la aplicación, arranca Tomcat y se queda escuchando. Cuando lo ejecutes verás que el botón de parar del IDE sigue rojo indefinidamente. Eso no es que se haya colgado: es un servidor haciendo su trabajo.

`@SpringBootApplication` es una anotación que en realidad son tres:

| Contiene | Qué hace |
| :--- | :--- |
| `@SpringBootConfiguration` | Marca esta clase como el punto donde se define la configuración |
| `@EnableAutoConfiguration` | Mira qué dependencias hay en el proyecto y configura lo que haga falta. Como encuentra `spring-boot-starter-web`, arranca Tomcat en el 8080 |
| `@ComponentScan` | **Recorre el paquete de esta clase y todos sus subpaquetes** buscando clases tuyas que deba gestionar |

Subraya la tercera. Dentro de un rato te va a explicar un error.

#### Paso 8 · Arráncala y léele el arranque

Tienes dos formas. Usa la que prefieras, pero prueba las dos al menos una vez.

**Desde el IDE:** abre `GestorApplication.java` y ejecuta su `main` como cualquier programa Java.

**Desde el terminal**, situado en la carpeta del proyecto:

```bash
./mvnw spring-boot:run
```

En Windows, con PowerShell o CMD:

```bash
.\mvnw.cmd spring-boot:run
```

En la consola aparece un rótulo de Spring y varias líneas. Estas tres son las que hay que aprender a leer:

```text
Starting GestorApplication using Java 21
Tomcat started on port 8080 (http) with context path '/'
Started GestorApplication in 1.842 seconds
```

| Línea | Qué te está confirmando |
| :--- | :--- |
| `Starting… using Java 21` | Qué versión de Java está usando de verdad, que no siempre es la que crees |
| `Tomcat started on port 8080` | **Ya hay un servidor escuchando.** Esta es la línea importante |
| `Started … in 1.842 seconds` | El arranque ha terminado sin errores |

Las líneas exactas cambian algo de una versión a otra; lo que no cambia es que esas tres informaciones están ahí.

<div class="rule">
  <p class="rule-label">Regla de oro para todo el curso</p>
  <p>Cuando algo no funcione, la respuesta está casi siempre en <strong>la consola del servidor</strong>, no en el navegador. El navegador te enseña el resultado; la consola te enseña el motivo. Antes de preguntar nada, lee las últimas veinte líneas de la consola y localiza la primera que empiece por <code>Caused by:</code>.</p>
</div>

#### Paso 9 · Visita un servidor que aún no sabe nada

Con la aplicación arrancada, abre el navegador en:

```text
http://localhost:8080
```

Lo que sale es esto:

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>Lo que dibuja el navegador</strong></figcaption>
  <div class="lesson-demo__stage">
    <div class="lesson-browser" aria-label="Página de error por defecto de Spring Boot">
      <div class="lesson-browser__page">
        <p class="demo-title">Whitelabel Error Page</p>
        <p>This application has no explicit mapping for /error, so you are seeing this as a fallback.</p>
        <p>There was an unexpected error (type=Not Found, status=404).</p>
      </div>
    </div>
  </div>
  <p class="lesson-demo__note">Un 404 servido por tu propia aplicación. Es la mejor noticia posible.</p>
</figure>

Parece un fallo y no lo es. **Es la prueba de que todo funciona.** Piénsalo con lo de la sesión 1: para que aparezca un 404, alguien ha tenido que recibir tu petición, entenderla, comprobar que no tiene nada publicado en `/` y contestarte. Ese alguien es tu programa.

Compruébalo mirando la consola: no hay ninguna excepción. Y compruébalo por contraste: para la aplicación con el botón de parar y recarga la página. Ahora sí verás un error de verdad, el de «no se ha podido establecer conexión», que es lo que ocurre cuando **no hay nadie escuchando**.

<div class="rule">
  <p class="rule-label">Dos fallos que se confunden siempre</p>
  <p><strong>404 Not Found:</strong> el servidor está vivo y esa ruta no existe. Revisa la URL o revisa tu código.</p>
  <p><strong>No se puede conectar / ERR_CONNECTION_REFUSED:</strong> no hay ningún programa en ese puerto. Revisa si la aplicación está arrancada y si el puerto es el que crees.</p>
</div>

#### Paso 10 · Tu primer endpoint

Ahora vamos a publicar algo. Y vamos a hacerlo despacio, porque aquí se concentran los errores del primer día.

Dentro de `src/main/java/com/ejemplo/gestor/`, crea un paquete llamado `controller`. El nombre completo queda:

```text
com.ejemplo.gestor.controller
```

Fíjate en que **cuelga del paquete de `GestorApplication`**. Recuerda la tercera anotación de antes.

Dentro de ese paquete, una clase nueva: `HolaController`.

```java
package com.ejemplo.gestor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HolaController {

    @GetMapping("/hola")
    public String hola() {
        return "Hola, mundo. Te responde mi servidor.";
    }
}
```

<dl class="worked">
  <dt>@RestController</dt>
  <dd>Dos cosas a la vez. Una: <em>esta clase atiende peticiones HTTP</em>, así que el escaneo de componentes debe recogerla y registrarla. Dos: <em>lo que devuelvan sus métodos es el cuerpo de la respuesta</em>, tal cual, sin buscar ninguna plantilla que dibujar.</dd>
  <dt>@GetMapping("/hola")</dt>
  <dd>Conecta una petición concreta con este método: método <code>GET</code> y ruta <code>/hola</code>. Si llega un <code>GET /hola</code>, Spring ejecuta este método. Si llega un <code>POST /hola</code>, no lo ejecuta, y responde <code>405 Method Not Allowed</code>.</dd>
  <dt>El nombre del método</dt>
  <dd><code>hola()</code> es solo un nombre Java, y no aparece en ninguna URL. La ruta la fija la anotación, no el nombre. Puedes llamarlo <code>saludarAlMundo()</code> y la URL seguirá siendo <code>/hola</code>.</dd>
  <dt>El valor devuelto</dt>
  <dd>El <code>String</code> que devuelves se convierte en el cuerpo de la respuesta. El código de estado será <code>200</code> porque no ha fallado nada. Todavía no estás decidiendo tú el código; eso llega en la UD2.</dd>
</dl>

Java no recarga clases nuevas en caliente: **para la aplicación y vuelve a arrancarla**. Después:

```text
http://localhost:8080/hola
```

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>Lo que dibuja el navegador</strong></figcaption>
  <div class="lesson-demo__stage">
    <div class="lesson-browser" aria-label="Respuesta de texto del endpoint hola">
      <div class="lesson-browser__page">
        <p>Hola, mundo. Te responde mi servidor.</p>
      </div>
    </div>
  </div>
  <p class="lesson-demo__note">Sin diseño, sin HTML. Es texto plano, y sale de un método Java tuyo.</p>
</figure>

Y ahora haz lo que aprendiste en la sesión 1: abre `F12`, pestaña **Network**, recarga y mira la respuesta. Estado `200`, y `Content-Type: text/plain`. Acabas de cerrar el círculo entre los dos pasos.

#### Paso 11 · La trampa del paquete

Este es **el error número uno del primer día**, así que vamos a provocarlo a propósito para que lo reconozcas cuando aparezca solo.

`@ComponentScan` recorre el paquete donde vive `GestorApplication` y sus subpaquetes. Nada más.

<figure class="diagram">
  <figcaption>Dónde ve Spring tus clases</figcaption>
  <ol class="flow flow--before">
    <li><code>com.ejemplo.gestor</code> — aquí está la clase principal</li>
    <li><code>com.ejemplo.gestor.controller</code> — dentro. <strong>Spring la ve</strong></li>
    <li><code>com.ejemplo.gestor.web.publico</code> — dentro. Spring la ve</li>
    <li class="is-error"><code>com.ejemplo.otro</code> — fuera. <strong>Spring no la ve</strong></li>
  </ol>
</figure>

Pruébalo: mueve `HolaController` a un paquete `com.ejemplo.otro`, reinicia y pide `/hola`. Obtendrás un `404`.

Y fíjate bien en lo desconcertante que es: **la consola no dice absolutamente nada**. No hay error, no hay aviso, la aplicación arranca perfecta. Simplemente esa clase no existe para Spring, porque nunca pasó por delante de ella. Devuelve el controlador a su sitio antes de seguir.

#### Paso 12 · Cuando algo no arranca

| Lo que ves | Qué ha pasado | Qué haces |
| :--- | :--- | :--- |
| `Port 8080 was already in use` | Ya hay otra aplicación en ese puerto, casi siempre una tuya que no cerraste | Ciérrala, o cambia el puerto en `application.properties` |
| `404` en una ruta que has escrito | El controlador está fuera del paquete, o la ruta no coincide letra por letra | Revisa el paquete y revisa la barra inicial de la ruta |
| `ERR_CONNECTION_REFUSED` | La aplicación no está arrancada | Míralo en la consola: ¿aparece `Started`? |
| `invalid target release` o similar | El JDK del IDE no es el que espera el proyecto | Ajusta el JDK del proyecto a la versión 21 |
| Los cambios no se aplican | No has reiniciado | Para y arranca otra vez |

##### Cambiar el puerto

Abre `src/main/resources/application.properties` y escribe:

```properties
server.port=8081
spring.application.name=gestor
```

Reinicia y comprueba en la consola que ahora dice `Tomcat started on port 8081`. Vuelve a dejarlo en el 8080 al terminar, para que todo el grupo trabaje con la misma dirección.

#### Paso 13 · Dos endpoints más

Sobre el mismo proyecto, y sin copiar el ejemplo anterior a la vista:

1. Crea un endpoint `GET /estado` que devuelva el texto `El servidor funciona`.
2. Crea una ruta de resumen para tu tema: por ejemplo, `GET /prestamos/resumen` si has elegido préstamos. Debe devolver dos líneas explicando qué gestiona tu aplicación. Para el salto de línea usa `\n` dentro del `String` de Java.
3. Comprueba los dos en el navegador **y en el panel de red**: anota el código de estado y el `Content-Type` de cada uno.

Piensa antes de escribir: ¿hacen falta dos clases nuevas, o los dos métodos pueden vivir en la misma? Justifica tu decisión en un comentario dentro del código.

#### Paso 14 · Subir la aplicación y sus comprobaciones a GitHub

##### Preparar lo que vas a subir

1. En la carpeta que contiene `pom.xml`, crea `README.md`. Copia la propuesta del paso 1 y añade cómo arrancar la aplicación desde el IDE y con el wrapper de Maven. Escribe también las rutas que has implementado.
2. Crea las carpetas `docs/sesiones` y, dentro, el archivo `sesion-01.md`. Guarda ahí la ficha de peticiones del paso 5 y una tabla con tus rutas: método, URL, estado esperado, estado observado y respuesta. Prueba una ruta inexistente, como `/ruta-que-no-existe`, y anota su 404. Los ejercicios escritos forman parte de este archivo en el repositorio.
3. Revisa el `.gitignore` generado por Spring Initializr. Debe excluir `target/`, los archivos locales del IDE y los archivos de configuración con secretos, como `.env`. Conserva `pom.xml`, el código de `src/`, `mvnw`, `mvnw.cmd` y `.mvn/` para que otra persona pueda ejecutar el proyecto.

##### Si todavía no tienes repositorio del backend

En GitHub crea un repositorio vacío con el nombre de tu aplicación. No añadas README ni `.gitignore` desde la web: ya los tienes en tu carpeta. Copia la URL HTTPS que te muestra GitHub.

Abre la terminal **en la carpeta de `pom.xml`** y ejecuta:

```bash
git init -b main
git status
git add .gitignore README.md pom.xml mvnw mvnw.cmd .mvn src docs
git diff --cached --stat
git commit -m "Completar sesión 01: primera aplicación servidor"
```

Antes del commit, comprueba en la lista que has preparado el código y la documentación y que no aparece `target/` ni ninguna credencial. Si Git indica que falta tu identidad, configura tu nombre y correo de autor siguiendo las indicaciones del profesor y repite el commit.

Conecta tu carpeta con GitHub. **Sustituye la URL del ejemplo por la que acabas de copiar**, sin escribir literalmente `TU_USUARIO` ni `TU_REPOSITORIO`:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git remote -v
git push -u origin main
```

Completa el inicio de sesión si Git lo solicita. Este procedimiento sigue la [guía de GitHub para subir un proyecto local](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

##### Si el repositorio ya se creó en Intermodular

Trabaja en su carpeta clonada y coloca allí los archivos del proyecto, con `pom.xml` en la raíz. No copies una carpeta `.git` dentro de otra ni vuelvas a ejecutar `git init` o a añadir `origin`. Guarda el código y la documentación mediante el circuito de rama, commit y pull request que tengáis establecido; si `main` está protegida, respeta esa protección.

##### Comprobar la entrega en GitHub

Abre el repositorio en el navegador y verifica que puedes leer `README.md`, `docs/sesiones/sesion-01.md` y el controlador dentro de `src/main/java`. Abre el commit que contiene tu trabajo y copia su enlace. Guardar un archivo en tu ordenador o hacer un commit local todavía no lo sube: la comprobación termina viendo los cambios en GitHub. El profesor debe poder acceder al repositorio; si es privado, comprueba que tiene acceso.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Dos formas distintas de no encontrar algo

Este reto va de una distinción que confunde a casi todo el mundo, y de una costumbre que te va a acompañar toda la carrera: **escribir qué esperas antes de mirar**. Si aciertas, has entendido la regla. Si fallas, acabas de localizar exactamente el hueco que te faltaba, que es información mucho más valiosa que un acierto.

Volvemos a la API pública que has inspeccionado en el panel de red. Dos cosas que hay que saber antes de empezar:

* `/posts` es una **colección**: todos los mensajes que tiene esa API.
* `/posts/1` es **un elemento** de esa colección: el mensaje número 1.

Para no repetir el dominio entero, escribo `…/posts/1` en lugar de `https://jsonplaceholder.typicode.com/posts/1`.

Copia esta tabla y rellena **las dos columnas del medio sin abrir nada**. La última se queda vacía de momento.

La primera fila va resuelta como ejemplo. Es una URL que **no forma parte del ejercicio**: está ahí para que veas cuánto detalle se espera en la columna del motivo, que es la que todo el mundo deja en blanco.

| URL | Código que espero | Por qué lo espero | Código real |
| :--- | :---: | :--- | :---: |
| *Ejemplo · `…/users/1`* | `200` | La ruta `/users` existe en esta API y el usuario 1 también, así que el servidor encuentra el recurso y lo devuelve | `200` |
| `…/posts/1` | | | |
| `…/posts/999999` | | | |
| `…/pooosts/1` | | | |
| `…/posts` | | | |

Un motivo es una frase que empieza por «porque» y menciona **qué existe y qué no**. «Porque sí» y «porque me suena» no son motivos: si no sabes justificar la predicción, escribe la duda concreta que tienes y esa será tu predicción.

Fíjate en qué es distinto en cada fila:

1. Un elemento que existe. Es el control: si esta falla, algo va mal en tu conexión y no en el ejercicio.
2. Una ruta correcta con un identificador que **no corresponde a ningún mensaje**.
3. Una ruta **mal escrita**: `pooosts` no existe en esa API.
4. La colección entera, sin pedir ningún elemento concreto.

Una a una, con el panel de red abierto. Anota el código real en la última columna y echa un vistazo al cuerpo de cada respuesta.

Dos de las cuatro se suelen fallar. Cuando encuentres una predicción equivocada, **no la borres**: al lado escribe qué regla habías aplicado y por qué no valía.

1. Las filas 2 y 3 son situaciones distintas: en una la ruta existe y el elemento no; en la otra no existe ni la ruta. ¿Han devuelto el mismo código? ¿Te parece razonable que sea así?
2. ¿Podría el servidor distinguirlas si quisiera? ¿Qué ganaría y qué perdería haciéndolo?
3. La fila 4 devuelve algo aunque no hayas pedido ningún elemento concreto. ¿Qué devuelve exactamente, y qué código? ¿Y qué crees que devolvería si esa colección estuviera vacía: un error, o algo?

<details class="aside aside--help">
  <summary>Estoy atascado · no sé por dónde coger la pregunta 1</summary>
  <p>Piensa desde fuera, desde quien hace la petición y no desde quien la programa. Para el cliente, una URL nombra una cosa. Si esa cosa no aparece, ¿le cambia en algo el plan saber <em>por qué</em> no aparece?</p>
  <p>Y piensa también en la pregunta 2 desde el otro lado: si el servidor respondiera «esta ruta no existe» frente a «este elemento no existe», estaría contando algo sobre cómo está construido por dentro. Eso, a veces, es justo lo que no interesa contar.</p>
</details>

Guarda la tabla con sus cuatro filas completas —predicción, motivo y código real— y las tres respuestas del análisis en `docs/sesiones/sesion-01.md`, junto con el resto de la entrega de esta sesión en GitHub.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La ficha de las tres peticiones completa y correcta, con las tres bien diferenciadas.</span></div>
  <div><strong>Si lo tienes</strong><span>Encuentra en una web real una petición que no sea 2xx y explica qué la ha provocado.</span></div>
  <div><strong>Reto</strong><span>Localiza una redirección 3xx y sigue la cadena: qué se pidió, adónde te mandó y qué se pidió después.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Una línea en blanco. Es la marca que indica que las cabeceras han terminado y que lo siguiente son datos.</p>
  <p>2 · En el servidor, y muy concretamente en su consola: un 5xx significa que el fallo se ha producido atendiendo la petición, así que casi siempre hay una traza de excepción esperando.</p>
  <p>3 · Porque el modelo es petición-respuesta y siempre lo inicia el cliente. El servidor no conoce tu dirección ni tiene ninguna conexión abierta contigo hasta que tú le escribes.</p>
  <p>4 · Que cada petición se atiende de forma independiente y el servidor no recuerda nada de las anteriores. Si hay que mantener una sesión, el cliente tiene que volver a identificarse en cada petición.</p>
</details>

##### Reto · Diagnóstico a ciegas

Un compañero te dice: «he escrito el controlador, la aplicación arranca sin ningún error y `/estado` me da 404».

1. Escribe **tres hipótesis distintas** de qué puede estar pasando, ordenadas de más probable a menos.
2. Para cada una, escribe **la comprobación exacta** que la confirma o la descarta. No vale «revisar el código»: tiene que ser una acción concreta, como «mirar la primera línea del archivo del controlador y comparar el paquete con el de la clase principal».
3. Provoca tú mismo dos de esas tres situaciones en tu proyecto y confirma que producen el síntoma descrito.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Proyecto arrancando, <code>/hola</code> y <code>/estado</code> respondiendo 200, y sabes leer la línea del puerto en la consola.</span></div>
  <div><strong>Si lo tienes</strong><span>Los dos endpoints propios funcionando y comprobados en el panel de red, con su código y su Content-Type anotados.</span></div>
  <div><strong>Reto</strong><span>Las tres hipótesis con su comprobación, y dos de ellas reproducidas a propósito.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque <code>SpringApplication.run</code> arranca un servidor que se queda escuchando. Un servidor que termina es un servidor que ya no atiende a nadie.</p>
  <p>2 · Una marca la clase como configuración, otra configura automáticamente lo que corresponda según las dependencias encontradas —incluido arrancar Tomcat—, y la tercera escanea el paquete de esa clase y sus subpaquetes buscando componentes tuyos.</p>
  <p>3 · El paquete del controlador: tiene que colgar del paquete de la clase principal. Después, que la ruta coincida exactamente, barra inicial incluida.</p>
  <p>4 · Que viene dentro del proyecto como una librería más. No se instala aparte ni se despliega nada en él: la aplicación se arranca y lleva su propio servidor dentro.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

Otra persona arranca el proyecto siguiendo el README y recibe vuestra primera respuesta. El dominio elegido permite cumplir la matriz de complejidad de la unidad.

Cada integrante explica una decisión del código o reproduce una comprobación. Anotad los defectos pendientes y dejad identificado el commit con el que termináis.


#### Entrega de la sesión 1 · Repositorio de GitHub

**Entrega el enlace al mismo repositorio de GitHub del proyecto, actualizado con el trabajo de esta sesión, y el enlace al commit que permite identificar esa versión.** El repositorio acumula el trabajo de todo el módulo.

Antes de entregar:

1. Sube el código realizado y actualiza el README si ha cambiado la forma de arrancar, configurar o utilizar la aplicación. Incluye en el repositorio las pruebas, colecciones HTTP, scripts y demás archivos que hayas trabajado hoy, cuando correspondan.
2. Crea o actualiza `docs/sesiones/sesion-01.md` con cuatro apartados: **qué has realizado**, **qué archivos has cambiado**, **cómo lo has comprobado y qué resultado has obtenido**, y **qué queda pendiente**. Las tablas, respuestas y observaciones solicitadas en esta página se guardan ahí o se enlazan desde ese archivo a otros archivos del repositorio.
3. Guarda los cambios en un commit y súbelos a GitHub siguiendo el workflow establecido en Intermodular. Si trabajáis mediante pull request, conserva también su enlace. Un commit que solo está en tu ordenador no constituye la entrega.
4. Abre GitHub y comprueba que se ven el código, el documento de esta sesión y el commit entregado. Verifica que el profesor puede acceder al repositorio. Si algo no funciona todavía, descríbelo en pendientes y entrega igualmente la versión que has realizado.

| Dato de la entrega | Qué debes facilitar |
| --- | --- |
| Repositorio | Enlace a la página del proyecto en GitHub |
| Versión de esta sesión | Enlace al commit que contiene el trabajo entregado |
| Registro del trabajo | `docs/sesiones/sesion-01.md`, dentro de ese repositorio |

La comprobación o explicación en clase acompaña a esta entrega. El código y las evidencias de Servidor se evalúan en la versión indicada; el flujo de trabajo se evalúa en Intermodular.

## Sesión 2 · Rutas y primeras consultas del proyecto

### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Una ruta identifica recursos; los parámetros seleccionan qué recurso devolver. Spring convierte el valor devuelto por el controlador en una respuesta HTTP.

#### El problema de tener una sola puerta

El endpoint de ayer siempre responde lo mismo:

```java
@GetMapping("/hola")
public String hola() {
    return "Hola, mundo. Te responde mi servidor.";
}
```

Con esto, para saludar a cinco personas harían falta cinco métodos. Y para consultar mil incidencias, mil rutas. Es evidente que no es así como funciona: el cliente tiene que poder **enviar datos dentro de la petición**, y el mismo método tiene que servir para todos los casos.

Hoy vemos las dos formas de hacerlo con un `GET`.

<figure class="diagram">
  <figcaption>Los dos sitios donde caben datos en una URL</figcaption>
  <ol class="flow flow--before">
    <li><strong>En la ruta:</strong> <code>/usuarios/3</code> — el dato forma parte del camino</li>
    <li><strong>En la query string:</strong> <code>/usuarios?rol=admin</code> — el dato va detrás de la interrogación</li>
  </ol>
</figure>

Se parecen, pero **no significan lo mismo**, y elegir mal es el origen de la mitad de las APIs incómodas de usar. Al final de la sesión tendrás una regla para decidir.

#### La query string, por dentro

Es lo que va después del `?`. Son pares `clave=valor` separados por `&`:

```text
/incidencias?estado=abierta&prioridad=alta&pagina=2
```

```text
?              empieza la query string
estado=abierta primer par
&              separador
prioridad=alta segundo par
&              separador
pagina=2       tercer par
```

Tres cosas que conviene saber desde hoy:

* El **orden no importa**: `?a=1&b=2` y `?b=2&a=1` son la misma petición.
* Todo llega como **texto**. `pagina=2` no es un número: es la cadena `"2"`. Que acabe siendo un `int` en tu método es trabajo de Spring, no del navegador.
* Los caracteres raros se codifican. Un espacio viaja como `%20` o como `+`, y una `ñ` como `%C3%B1`. Lo verás en el panel de red y no debe alarmarte.

#### La regla para decidir dónde va cada dato

<div class="rule">
  <p class="rule-label">Ruta o query string</p>
  <p><strong>En la ruta va lo que identifica al recurso.</strong> Sin ese dato, la petición no tiene sentido: <code>/usuarios/3</code> pregunta por un usuario concreto, y <code>/usuarios/</code> a secas ya es otra cosa distinta.</p>
  <p><strong>En la query string va lo que modifica una consulta.</strong> Filtros, orden, paginación, búsqueda. Si lo quitas, la petición sigue teniendo sentido: solo devuelve más resultados o en otro orden.</p>
  <p>La prueba rápida: <em>¿puedo borrar este dato de la URL y que siga significando algo?</em> Si sí, es query string. Si no, es ruta.</p>
</div>

| URL | Correcto | Por qué |
| :--- | :---: | :--- |
| `/usuarios/3` | Sí | El 3 identifica al usuario |
| `/usuarios?id=3` | Mejorable | Un identificador no es un filtro |
| `/incidencias?estado=abierta` | Sí | Es un filtro sobre una lista |
| `/incidencias/abierta` | No | Parece una incidencia llamada «abierta» |
| `/proyectos/7/incidencias?prioridad=alta` | Sí | Identifica el proyecto y filtra sus incidencias |

Esa última fila combina las dos ideas, y es la forma que tendrá casi toda tu API a partir de la UD3.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

Construid el listado y el detalle de la entidad principal con datos en memoria. Seguid una petición desde la URL hasta el método Java.

Añadid datos de vuestro dominio y probad identificadores existentes y ausentes. Explicad qué ocurre en cada caso.

Los ejemplos de código usan proyectos y tareas para mostrar el procedimiento. Aplica cada paso a las entidades y reglas del CRUD que elegiste: conserva tu repositorio, cambia los nombres de clases, rutas y campos de forma coherente y adapta las comprobaciones. No crees una segunda aplicación para copiar el ejemplo.

#### Paso 1 · Preparar el punto de partida

1. Abre el repositorio y comprueba qué versión tienes. Arranca la aplicación y ejecuta la colección o las pruebas de la sesión anterior antes de cambiar código; si ya falla, registra y resuelve ese fallo primero.
2. Localiza la clase principal y el controlador que vas a utilizar. Anota el resultado esperado antes de editar.
3. Prepara un caso válido y otro que deba rechazarse o no encontrarse. Los usarás para comparar el comportamiento antes y después.

<p class="stage">Rutas y datos</p>

#### Paso 2 · `@RequestParam` · leer la query string

Vamos paso a paso, de la versión más simple a la que usarás de verdad.

Crea un `SaludoController` en `com.ejemplo.gestor.controller`:

```java
package com.ejemplo.gestor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SaludoController {

    @GetMapping("/saludo")
    public String saludo(@RequestParam(name = "nombre") String nombre) {
        return "Hola, " + nombre + ".";
    }
}
```

Reinicia y prueba:

```text
http://localhost:8080/saludo?nombre=Marc
```

Responde `Hola, Marc.` Cambia el valor de la URL y responde otra cosa. **Un método, infinitas respuestas.**

Lo que ha ocurrido por dentro es esto:

<figure class="diagram">
  <figcaption>De la URL al parámetro Java</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Llega <code>GET /saludo?nombre=Marc</code></li>
    <li>Spring busca el método de <code>/saludo</code></li>
    <li>Ve <code>@RequestParam(name = "nombre")</code></li>
    <li>Busca <code>nombre</code> en la query string</li>
    <li>Pasa <code>"Marc"</code> al método</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">Escribe siempre el nombre</p>
  <p>Verás mucho código con <code>@RequestParam String nombre</code>, sin el <code>name</code>. Funciona porque el proyecto se compila conservando los nombres de los parámetros, pero eso depende de cómo se compile: si alguien cambia la configuración, o si el compilador ofusca los nombres, deja de funcionar sin ningún aviso. <strong>Escribe el nombre explícitamente.</strong> Cuesta ocho caracteres y no vuelve a fallar nunca.</p>
</div>

Ahora pide la ruta **sin el parámetro**:

```text
http://localhost:8080/saludo
```

Y observa:

```json
{
  "timestamp": "2026-09-02T09:22:14.831+00:00",
  "status": 400,
  "error": "Bad Request",
  "path": "/saludo"
}
```

`400 Bad Request`. Con lo de la sesión 1 ya sabes leerlo: empieza por 4, así que **el problema es de quien pide**, no del servidor. Tu método ni siquiera se ha ejecutado; Spring ha rechazado la petición antes de llegar a él.

Mira además la consola: hay un aviso que dice, más o menos, `Required request parameter 'nombre' is not present`. El mensaje bueno está siempre ahí.

Esto es importante porque enseña algo que se repetirá todo el curso: **Spring valida antes de ejecutar**. Cuando tu método arranca, ya se ha comprobado que la petición encaja con lo que has declarado.

Casi nunca queremos un 400 por un parámetro que podría tener un valor razonable:

```java
@GetMapping("/saludo")
public String saludo(
        @RequestParam(name = "nombre", defaultValue = "mundo") String nombre) {
    return "Hola, " + nombre + ".";
}
```

| Petición | Respuesta |
| :--- | :--- |
| `/saludo` | `Hola, mundo.` |
| `/saludo?nombre=Marc` | `Hola, Marc.` |
| `/saludo?nombre=` | `Hola, .` — llega vacío, que no es lo mismo que no llegar |

Esa tercera fila conviene mirarla dos veces. `defaultValue` solo actúa cuando el parámetro **no viene**. Si viene vacío, viene vacío, y el valor por defecto no se aplica. Distinguir «ausente» de «vacío» te ahorrará depuraciones enteras.

Existe también `required = false`, que hace opcional el parámetro sin darle valor por defecto. En ese caso, si no llega, el parámetro vale `null`, y comprobarlo es cosa tuya.

```java
@RequestParam(name = "nombre", required = false) String nombre
```

```java
@GetMapping("/incidencias")
public String buscar(
        @RequestParam(name = "estado", defaultValue = "todas") String estado,
        @RequestParam(name = "pagina", defaultValue = "1") int pagina) {

    return "Buscando incidencias con estado " + estado
            + ", página " + pagina;
}
```

Pruébalo con `/incidencias?estado=abierta&pagina=3`, y también sin ningún parámetro.

Fíjate en `int pagina`. Por la URL llegó el texto `"3"` y en tu método hay un entero: **Spring ha convertido el tipo por ti**. Lo hace con `int`, `long`, `boolean`, `LocalDate` y muchos más.

Y ahora rómpelo otra vez:

```text
http://localhost:8080/incidencias?pagina=abc
```

Otro `400`. Es exactamente el mismo mecanismo: no se puede construir un `int` con `"abc"`, así que la petición no encaja con lo declarado y se rechaza antes de ejecutar nada. **Declarar el tipo ya es validar.** En la UD3 aprenderemos a devolver un mensaje de error mucho mejor que este, pero el comportamiento de base ya te protege.

#### Paso 3 · `@PathVariable` · leer un trozo de la ruta

La otra forma. Aquí el dato no va detrás del `?`: es parte del camino.

```java
package com.ejemplo.gestor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsuarioController {

    @GetMapping("/usuarios/{id}")
    public String usuario(@PathVariable(name = "id") int id) {
        return "Ficha del usuario " + id;
    }
}
```

Prueba `/usuarios/3`, `/usuarios/41`, `/usuarios/999`. Un solo método atiende todos los usuarios que existan.

Las llaves marcan un hueco: **`{id}` no es texto literal, es una variable**. Lo que aparezca ahí se captura y se entrega al parámetro que lleva ese mismo nombre.

<div class="rule">
  <p class="rule-label">El nombre tiene que coincidir</p>
  <p>El texto entre llaves de la ruta y el <code>name</code> de la anotación deben ser idénticos. Si escribes <code>/usuarios/{id}</code> y anotas <code>@PathVariable(name = "identificador")</code>, la aplicación ni siquiera arrancará: Spring no encuentra en la ruta ninguna variable con ese nombre.</p>
</div>

Puede haber varias, y se anidan con toda naturalidad:

```java
@GetMapping("/proyectos/{proyectoId}/incidencias/{incidenciaId}")
public String incidenciaDeProyecto(
        @PathVariable(name = "proyectoId") int proyectoId,
        @PathVariable(name = "incidenciaId") int incidenciaId) {

    return "Incidencia " + incidenciaId + " del proyecto " + proyectoId;
}
```

`/proyectos/7/incidencias/41` se lee de un vistazo: la incidencia 41, que pertenece al proyecto 7. Esa legibilidad no es casualidad, y es justo lo que vamos a convertir en regla ahora.

#### Paso 4 · Agrupar rutas con `@RequestMapping`

Cuando un controlador tiene varios métodos sobre lo mismo, repetir el prefijo se vuelve frágil: el día que cambie `/usuarios` por `/personas` habrá que tocar cinco sitios y se olvidará uno.

```java
package com.ejemplo.gestor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @GetMapping
    public String lista(
            @RequestParam(name = "rol", defaultValue = "todos") String rol) {
        return "Lista de usuarios con rol " + rol;
    }

    @GetMapping("/{id}")
    public String detalle(@PathVariable(name = "id") int id) {
        return "Ficha del usuario " + id;
    }
}
```

La ruta final es la del `@RequestMapping` de la clase más la del método:

| Método | Ruta que atiende |
| :--- | :--- |
| `lista` | `/usuarios` |
| `detalle` | `/usuarios/3` |

Un `@GetMapping` sin argumento significa «la ruta de la clase, tal cual».

<details class="aside aside--extra">
  <summary>Curiosidad · qué pasa si dos rutas encajan a la vez</summary>
  <p>Imagina que añades <code>/usuarios/nuevo</code> y ya tienes <code>/usuarios/{id}</code>. Una petición a <code>/usuarios/nuevo</code> encaja con las dos.</p>
  <p>Spring no elige al azar ni por orden de escritura: prefiere siempre <strong>la ruta más específica</strong>, y un texto literal es más específico que una variable. Gana <code>/usuarios/nuevo</code>.</p>
  <p>Aun así, mezclar identificadores y palabras en el mismo nivel envejece mal. Cuando lleguemos al diseño REST de la UD3 veremos por qué se evita.</p>
</details>

#### Paso 5 · Las rutas del gestor

Vamos a dejar el proyecto con un mapa de rutas coherente. Todavía devolvemos texto: los objetos y el JSON llegan en la sesión 3.

Escribe un `ProyectoController` que atienda estas cuatro:

| Ruta | Qué devuelve |
| :--- | :--- |
| `GET /proyectos` | `Lista de proyectos` |
| `GET /proyectos?estado=activo` | `Lista de proyectos con estado activo` |
| `GET /proyectos/{id}` | `Ficha del proyecto 7` |
| `GET /proyectos/{id}/incidencias` | `Incidencias del proyecto 7` |

Condiciones:

1. Usa `@RequestMapping` a nivel de clase. No repitas `/proyectos` en cada método.
2. El parámetro `estado` es opcional, con `todos` como valor por defecto.
3. El `id` debe ser un `int`, no un `String`. Después comprueba qué pasa con `/proyectos/abc` y anótalo.

Amplía tu controlador con dos rutas más, decidiendo tú dónde va cada dato:

* Una para consultar **una incidencia concreta dentro de un proyecto concreto**.
* Una para buscar incidencias **filtrando por prioridad y por página**.

Para cada una, escribe en un comentario del código la respuesta a esto: qué datos has puesto en la ruta, cuáles en la query string, y qué prueba de la regla has aplicado para decidirlo.

#### Paso 6 · Comprobar y registrar el resultado de vuestro proyecto

1. Ejecuta el recorrido trabajado con datos de tu dominio. Anota método, ruta, estado y cuerpo observado en la pestaña Red del navegador. La colección HTTP se prepara a partir de la sesión 3.
2. Ejecuta el caso de rechazo preparado al inicio. Comprueba tanto la respuesta como que el estado de los datos no se haya alterado indebidamente.
3. Compara el resultado con la tarea de esta sesión: **construid rutas de listado y detalle**. Explica qué clase o configuración produce el comportamiento observado.
4. Registra la versión y los defectos pendientes en el mismo repositorio. Usa el workflow aprendido en Intermodular y conserva el enlace al resultado del CI cuando esté disponible.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Cuatro peticiones sin ejecutar nada

Con este controlador delante:

```java
@RestController
@RequestMapping("/tareas")
public class TareaController {

    @GetMapping("/{id}")
    public String detalle(
            @PathVariable(name = "id") int id,
            @RequestParam(name = "formato", defaultValue = "corto") String formato) {

        return "Tarea " + id + " en formato " + formato;
    }
}
```

Predice, **antes de probarlo**, qué devuelve cada petición: el código de estado y el cuerpo si lo hay. Escribe también por qué.

1. `GET /tareas/5`
2. `GET /tareas/5?formato=largo`
3. `GET /tareas/cinco`
4. `GET /tareas`
5. `POST /tareas/5`

Después copia el controlador en tu proyecto y compruébalas una a una. **De las cinco, dos suelen fallarse.** Cuando encuentres una predicción equivocada, no la corrijas y ya está: escribe qué regla habías aplicado mal.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las rutas <code>/saludo</code>, <code>/saludo?nombre=Marc</code> y <code>/usuarios/3</code> funcionando, y sabes provocar el 400.</span></div>
  <div><strong>Si lo tienes</strong><span>El <code>ProyectoController</code> completo con sus cuatro rutas y las dos que has diseñado tú, justificadas.</span></div>
  <div><strong>Reto</strong><span>Las cinco predicciones escritas antes de ejecutar, comprobadas y con los fallos explicados.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>defaultValue</code> pone un valor cuando el parámetro no llega, así que el parámetro nunca es nulo. <code>required = false</code> lo deja llegar como <code>null</code> y te obliga a comprobarlo.</p>
  <p>2 · Un <code>400 Bad Request</code>. Spring intenta convertir el texto al tipo declarado antes de invocar el método; como la conversión falla, la petición se rechaza y el método no llega a ejecutarse.</p>
  <p>3 · El identificador en la ruta, el año en la query string. La prueba: si quito el año, <code>/facturas</code> sigue significando algo; si quito el identificador, <code>/facturas/</code> ya no pregunta por esa factura.</p>
  <p>4 · Exactamente <code>/usuarios</code>: la ruta de la clase, sin añadir nada.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

El listado y el detalle devuelven los datos esperados y podéis localizar el método que atendió cada petición.

Cada integrante explica una decisión del código o reproduce una comprobación. Anotad los defectos pendientes y dejad identificado el commit con el que termináis.


#### Entrega de la sesión 2 · Repositorio de GitHub

**Entrega el enlace al mismo repositorio de GitHub del proyecto, actualizado con el trabajo de esta sesión, y el enlace al commit que permite identificar esa versión.** El repositorio acumula el trabajo de todo el módulo.

Antes de entregar:

1. Sube el código realizado y actualiza el README si ha cambiado la forma de arrancar, configurar o utilizar la aplicación. Incluye en el repositorio las pruebas, colecciones HTTP, scripts y demás archivos que hayas trabajado hoy, cuando correspondan.
2. Crea o actualiza `docs/sesiones/sesion-02.md` con cuatro apartados: **qué has realizado**, **qué archivos has cambiado**, **cómo lo has comprobado y qué resultado has obtenido**, y **qué queda pendiente**. Las tablas, respuestas y observaciones solicitadas en esta página se guardan ahí o se enlazan desde ese archivo a otros archivos del repositorio.
3. Guarda los cambios en un commit y súbelos a GitHub siguiendo el workflow establecido en Intermodular. Si trabajáis mediante pull request, conserva también su enlace. Un commit que solo está en tu ordenador no constituye la entrega.
4. Abre GitHub y comprueba que se ven el código, el documento de esta sesión y el commit entregado. Verifica que el profesor puede acceder al repositorio. Si algo no funciona todavía, descríbelo en pendientes y entrega igualmente la versión que has realizado.

| Dato de la entrega | Qué debes facilitar |
| --- | --- |
| Repositorio | Enlace a la página del proyecto en GitHub |
| Versión de esta sesión | Enlace al commit que contiene el trabajo entregado |
| Registro del trabajo | `docs/sesiones/sesion-02.md`, dentro de ese repositorio |

La comprobación o explicación en clase acompaña a esta entrega. El código y las evidencias de Servidor se evalúan en la versión indicada; el flujo de trabajo se evalúa en Intermodular.

## Semana 2 · JSON y primera escritura con un cliente HTTP

## Sesión 3 · JSON y primera escritura con un cliente HTTP

### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

JSON representa los datos que cruzan la red. Una petición de escritura incorpora un cuerpo; el cliente HTTP permite enviarlo y examinar la respuesta completa.

#### Devolver texto no escala

Hasta ahora tus métodos devuelven frases:

```java
return "Ficha del usuario " + id;
```

Eso está bien para comprobar que una ruta responde, y no sirve para nada más. Imagina que otro programa recibe esto:

```text
Tarea 3: Revisar el login, prioridad alta, sin terminar
```

Para saber la prioridad tendría que buscar la palabra «prioridad», contar comas y confiar en que nadie cambie nunca la redacción. El día que alguien escriba «Prioridad: alta» en lugar de «prioridad alta», el programa que lo lee se rompe.

Un backend no habla con personas: **habla con programas**. Y los programas necesitan datos con forma, no frases.

```json
{
  "id": 3,
  "titulo": "Revisar el login",
  "prioridad": "alta",
  "completada": false
}
```

Ahora la prioridad se pide por su nombre, y el orden, los espacios o la redacción dan igual.

#### JSON en cinco minutos

<p class="term">JSON</p>

*JavaScript Object Notation*. Un formato de texto para representar datos estructurados. Nació en JavaScript, pero hoy lo entienden todos los lenguajes: es el idioma común de las APIs.

Solo tiene dos estructuras:

```json
{ "clave": "valor" }
```

Un **objeto**: llaves, y dentro pares de clave y valor separados por comas. Las claves van siempre entre comillas dobles.

```json
[ 1, 2, 3 ]
```

Un **array**: corchetes y valores separados por comas.

Y los valores pueden ser de seis tipos, incluidos otro objeto y otro array, que es lo que permite anidar cuanto haga falta:

| Valor JSON | Ejemplo | Equivalente en Java |
| :--- | :--- | :--- |
| Cadena | `"alta"` | `String` |
| Número | `3` o `2.5` | `int`, `long`, `double` |
| Booleano | `true` | `boolean` |
| Nulo | `null` | `null` |
| Objeto | `{ "id": 3 }` | Un objeto de una clase tuya |
| Array | `[1, 2]` | `List`, array |

<div class="rule">
  <p class="rule-label">Los tres errores de sintaxis de todo el mundo</p>
  <p><strong>Comillas simples:</strong> <code>{ 'id': 3 }</code> no es JSON. Siempre dobles.</p>
  <p><strong>Coma final:</strong> <code>{ "id": 3, }</code> no es JSON. La última pareja no lleva coma.</p>
  <p><strong>Claves sin comillas:</strong> <code>{ id: 3 }</code> es un objeto de JavaScript, no JSON.</p>
  <p>Los tres producen el mismo resultado cuando los envíes en el trabajo siguiente: un <code>400</code>, porque el servidor no consigue interpretar el cuerpo.</p>
</div>

#### El experimento que deja sin herramientas

Añade este método a tu `TareaController` y reinicia:

```java
@PostMapping
public String crear() {
    return "Alguien ha hecho un POST";
}
```

Ahora intenta ejecutarlo. Abre el navegador en `http://localhost:8080/tareas` y…

```json
{
  "status": 405,
  "error": "Method Not Allowed",
  "path": "/tareas"
}
```

`405 Method Not Allowed`. La ruta existe, pero no con ese método.

Y aquí está el problema, que conviene ver con claridad: **no hay ninguna forma de escribir una URL que provoque un POST**. La barra de direcciones siempre hace `GET`. Siempre. No es una limitación que se pueda rodear con un truco.

Tu servidor ya tiene una puerta que nadie de los presentes sabe abrir. Necesitas otra herramienta.

<figure class="diagram">
  <figcaption>Lo que puede pedir cada cliente</figcaption>
  <ol class="flow flow--before">
    <li><strong>Barra de direcciones:</strong> solo <code>GET</code>, sin cuerpo, sin cabeceras propias</li>
    <li><strong>Cliente HTTP:</strong> cualquier método, con el cuerpo y las cabeceras que decidas</li>
  </ol>
</figure>

#### Dos cosas raras que tienes que entender antes de irte

##### ¿Por qué se conserva la lista, si HTTP no recuerda nada?

En la sesión 1 quedó claro que cada petición llega sola y el servidor no recuerda la anterior. Y sin embargo la tarea que creaste sigue ahí.

No hay contradicción. Lo que no recuerda nada es **el protocolo**: la petición número 3 no sabe que existió la número 2. Pero **el programa sigue vivo entre una y otra**, con su memoria intacta, y tu `ArrayList` es un atributo de un objeto que Spring creó una sola vez al arrancar y reutiliza para todas las peticiones.

<div class="rule">
  <p class="rule-label">Compruébalo de la peor manera posible</p>
  <p>Crea dos o tres tareas. Después <strong>para la aplicación y vuelve a arrancarla</strong>. Pide <code>GET /tareas</code>.</p>
  <p>Vacío. Todo perdido. La memoria es del proceso, y el proceso ha muerto. Esto no es un defecto de lo que has hecho hoy: es exactamente el problema que resuelve una base de datos, y por eso existe la UD5.</p>
</div>

##### ¿Por qué `GET /tareas/999` no da error?

Pruébalo. Devuelve `200` y un cuerpo vacío, porque tu método devuelve `null` y Spring no tiene nada que serializar.

Está mal, y conviene que sepas por qué: **le estás diciendo al cliente que todo ha ido bien cuando no has encontrado lo que pedía**. Lo correcto sería un `404`. Todavía no sabemos fijar el código de estado a mano —eso es la UD2—, así que hoy lo dejamos anotado como defecto conocido.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

Modelad los objetos de vuestro recurso y cread una colección de Postman o Bruno. Implementad el alta a partir de un cuerpo JSON.

Encadenad crear, listar y consultar el recurso creado. Comparad el objeto Java con el JSON enviado y recibido.

Los ejemplos de código usan proyectos y tareas para mostrar el procedimiento. Aplica cada paso a las entidades y reglas del CRUD que elegiste: conserva tu repositorio, cambia los nombres de clases, rutas y campos de forma coherente y adapta las comprobaciones. No crees una segunda aplicación para copiar el ejemplo.

#### Paso 1 · Preparar el punto de partida

1. Abre el repositorio y comprueba qué versión tienes. Arranca la aplicación y ejecuta la colección o las pruebas de la sesión anterior antes de cambiar código; si ya falla, registra y resuelve ese fallo primero.
2. Localiza la clase principal y el controlador que vas a utilizar. Anota el resultado esperado antes de editar.
3. Prepara un caso válido y otro que deba rechazarse o no encontrarse. Los usarás para comparar el comportamiento antes y después.

<p class="stage">Objetos y JSON</p>

#### Paso 2 · El modelo · una clase Java normal

Vamos a representar una tarea del gestor. Crea el paquete `com.ejemplo.gestor.model` y dentro la clase:

```java
package com.ejemplo.gestor.model;

public class Tarea {

    private int id;
    private String titulo;
    private String prioridad;
    private boolean completada;

    public Tarea() {
    }

    public Tarea(int id, String titulo, String prioridad, boolean completada) {
        this.id = id;
        this.titulo = titulo;
        this.prioridad = prioridad;
        this.completada = completada;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public boolean isCompletada() {
        return completada;
    }

    public void setCompletada(boolean completada) {
        this.completada = completada;
    }
}
```

No hay ni una anotación. **Es Java de primero, exactamente el que ya sabes escribir.** Cuatro atributos privados, dos constructores y los métodos de acceso que genera el IDE por ti.

Fíjate solo en dos detalles, porque los dos van a importar:

* El **constructor vacío** parece inútil hoy. Lo necesitaremos en la sesión 3, cuando haya que construir una tarea a partir de un JSON que llega de fuera.
* El *getter* de un `boolean` se llama `isCompletada()`, no `getCompletada()`. Es la convención de Java, y tiene consecuencias visibles dentro de un momento.

<details class="aside aside--extra">
  <summary>¿No sería más corto un <code>record</code>?</summary>
  <p>Sí, y funcionaría. Un <code>record Tarea(int id, String titulo, String prioridad, boolean completada)</code> hace lo mismo en una línea.</p>
  <p>Usamos una clase normal por dos razones. La primera es que a partir de la sesión 3 vamos a <strong>modificar</strong> tareas, y un <code>record</code> es inmutable. La segunda es que el modelo que persistiremos con JPA en la UD5 tiene que ser una clase con constructor vacío, así que empezar así evita reescribirlo todo más adelante.</p>
</details>

#### Paso 3 · Devolver el objeto y ver qué pasa

En tu controlador de tareas:

```java
package com.ejemplo.gestor.controller;

import com.ejemplo.gestor.model.Tarea;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tareas")
public class TareaController {

    @GetMapping("/ejemplo")
    public Tarea ejemplo() {
        return new Tarea(1, "Revisar el login", "alta", false);
    }
}
```

Reinicia y abre `http://localhost:8080/tareas/ejemplo`:

```json
{"id":1,"titulo":"Revisar el login","prioridad":"alta","completada":false}
```

**Tú has devuelto un objeto Java y ha salido JSON.** Nadie ha escrito una sola línea para convertirlo.

Mira además el panel de red: el `Content-Type` ya no es `text/plain`, es `application/json`. Spring ha cambiado también la cabecera, porque ha cambiado lo que devuelve.

##### Quién ha hecho la conversión

Recuerda el reparto de la sesión 1. Cuando tu método termina, Spring tiene un valor Java en la mano y tiene que meterlo en el cuerpo de la respuesta. Para eso usa **Jackson**, la librería que entró en el proyecto con `spring-boot-starter-web` sin que la pidieras.

<figure class="diagram">
  <figcaption>De objeto Java a cuerpo de respuesta</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Tu método devuelve un <code>Tarea</code></li>
    <li>Spring ve que es <code>@RestController</code></li>
    <li>Jackson recorre sus <em>getters</em></li>
    <li>Construye el texto JSON</li>
    <li>Se envía con <code>Content-Type: application/json</code></li>
  </ol>
</figure>

<p class="term">Serializar</p>

Convertir un objeto en memoria a un formato de texto que se pueda transmitir o guardar. Lo contrario —texto a objeto— es *deserializar*, y llega en el trabajo siguiente.

#### Paso 4 · Jackson lee los getters, no los atributos

Esta frase parece un detalle y explica el 90 % de las sorpresas con JSON. Vamos a demostrarlo rompiendo algo a propósito.

En `Tarea`, renombra `getTitulo()` a `getNombre()`. **No toques el atributo**, que sigue llamándose `titulo`.

Escribe qué clave esperas ver en el JSON: ¿`titulo` o `nombre`?

```json
{"id":1,"nombre":"Revisar el login","prioridad":"alta","completada":false}
```

La clave es `nombre`. Jackson nunca miró el atributo privado: recorrió los métodos públicos que empiezan por `get` o por `is`, les quitó ese prefijo y pasó a minúscula la primera letra.

<dl class="worked">
  <dt>Qué significa en la práctica</dt>
  <dd>El JSON que ve el cliente lo determinan tus <em>getters</em>, no tus atributos. Renombrar un <em>getter</em> es un cambio visible desde fuera.</dd>
  <dt>Por qué <code>completada</code> aparece bien</dt>
  <dd>Porque para los <code>boolean</code> la convención es <code>is</code>, y Jackson también quita ese prefijo. Si lo hubieras llamado <code>getCompletada()</code>, la clave seguiría siendo <code>completada</code>. Si lo llamas <code>estaCompletada()</code>, sin prefijo reconocible, <strong>el campo desaparece del JSON</strong> sin ningún error.</dd>
  <dt>El fallo típico que provoca</dt>
  <dd>«Le he puesto el campo a la clase y no sale en el JSON.» Casi siempre es que falta el <em>getter</em>, o que no sigue la convención de nombres.</dd>
</dl>

Deja `getTitulo()` como estaba antes de seguir.

<details class="aside aside--help">
  <summary>Y si quiero que la clave se llame distinta al getter</summary>
  <p>Se puede, con <code>@JsonProperty("titulo_tarea")</code> sobre el <em>getter</em>. Hoy no lo usamos y conviene saber por qué: retocar el modelo para que el JSON salga bonito acaba mezclando dos cosas distintas —cómo guardas los datos y cómo los publicas—.</p>
  <p>La solución buena es tener una clase aparte para lo que se publica. Se llama DTO y es el contenido central de la UD2. Hasta entonces, el modelo se devuelve tal cual.</p>
</details>

#### Paso 5 · Devolver varias tareas

Un objeto sale como objeto JSON. Una lista sale como array JSON, sin que haya que hacer nada especial:

```java
@GetMapping
public List<Tarea> lista() {
    return List.of(
        new Tarea(1, "Revisar el login", "alta", false),
        new Tarea(2, "Actualizar dependencias", "baja", true)
    );
}
```

Recuerda importar `java.util.List`.

`GET /tareas` responde:

```json
[{"id":1,"titulo":"Revisar el login","prioridad":"alta","completada":false},
 {"id":2,"titulo":"Actualizar dependencias","prioridad":"baja","completada":true}]
```

El navegador lo mostrará todo seguido en una línea. No es un problema: es que nadie ha pedido que se formatee. En Chrome y Firefox tienes una pestaña de visualización de JSON que lo ordena, y en el trabajo siguiente Postman te lo dará indentado y coloreado.

<div class="rule">
  <p class="rule-label">Objeto o array: la decisión importa</p>
  <p>Una ruta que devuelve <strong>una cosa</strong> —<code>/tareas/3</code>— devuelve un objeto JSON. Una ruta que devuelve <strong>un conjunto</strong> —<code>/tareas</code>— devuelve un array, y lo devuelve <strong>aunque solo haya un elemento, y aunque no haya ninguno</strong>.</p>
  <p>Un array vacío se escribe <code>[]</code>. Nunca <code>null</code>, y nunca un texto diciendo «no hay tareas»: quien te llama espera una lista y sabe perfectamente recorrer una lista de cero elementos.</p>
</div>

#### Paso 6 · Cuando un campo vale null

Prueba a devolver una tarea con la prioridad sin asignar:

```java
return new Tarea(1, "Revisar el login", null, false);
```

```json
{"id":1,"titulo":"Revisar el login","prioridad":null,"completada":false}
```

La clave aparece, con el valor `null`. Es la representación correcta de «este campo existe y no tiene valor», que no es lo mismo que «este campo no existe». Es la misma distinción entre ausente y vacío que ya viste con `defaultValue` en la sesión 2, y la volverás a encontrar en la validación de la UD3.

#### Paso 7 · Definir el modelo de tu propio dominio

Sobre tu proyecto:

1. Crea la clase `Proyecto` en el paquete `model`, con al menos: `id`, `nombre`, `descripcion`, `activo` y `numeroDeIncidencias`.
2. Escribe un `ProyectoController` con dos rutas:
   * `GET /proyectos` devuelve una lista con tres proyectos inventados.
   * `GET /proyectos/{id}` devuelve **uno solo**, construido con el `id` recibido.
3. Comprueba las dos en el navegador y anota, del panel de red, el código de estado y el `Content-Type`.
4. Escribe en un comentario qué claves exactas tiene tu JSON y de qué método sale cada una.

Añade después un atributo `private String notaInterna` **sin escribir su getter**. Reinicia, mira el JSON y explica en una frase por qué no aparece.

<p class="stage">Postman y la primera escritura</p>

#### Paso 8 · Postman, y solo lo imprescindible

<p class="term">Cliente HTTP</p>

Un programa cuyo único trabajo es construir peticiones a mano y enseñarte la respuesta entera. Es al backend lo que el navegador al frontend: la ventana por la que ves lo que estás construyendo.

Usaremos **Postman**. Si prefieres **Bruno**, que es más ligero y guarda las peticiones como archivos dentro del proyecto, todo lo de hoy funciona igual y cambian los nombres de dos botones.

<div class="rule">
  <p class="rule-label">Hoy Postman es una herramienta, no un tema</p>
  <p>Vamos a dedicarle veinte minutos y vamos a aprender <strong>cuatro cosas</strong>: elegir el método, escribir la URL, enviar un cuerpo JSON y leer la respuesta.</p>
  <p>Postman tiene además colecciones, entornos, variables, <em>scripts</em>, ejecución automatizada y gestión de credenciales. <strong>Nada de eso se toca hoy.</strong> Todo eso llega en la UD2, cuando ya tengas peticiones que merezca la pena guardar y repetir. Aprender la herramienta antes de tener el problema que resuelve es la forma más rápida de olvidarla.</p>
</div>

Descarga Postman de su web oficial e instálalo. Te pedirá crear una cuenta: puedes **saltártelo**, buscando el enlace pequeño de trabajar sin conexión. No necesitamos sincronizar nada.

Antes de probar nada nuevo, comprueba la herramienta con algo cuyo resultado ya conoces. Es una costumbre que te ahorrará muchas confusiones: si falla, sabrás que falla la herramienta y no tu código.

1. Crea una petición nueva.
2. Deja el método en `GET`.
3. Escribe la URL: `http://localhost:8080/tareas`.
4. Pulsa `Send`.

Abajo aparece la respuesta. Localiza estas cuatro cosas, que son las mismas de la sesión 1 y ahora se ven mucho mejor que en el navegador:

| Dónde mirar | Qué es |
| :--- | :--- |
| Arriba a la derecha del panel inferior | El **código de estado**: `200 OK` |
| Junto a él | El tiempo que ha tardado y el tamaño de la respuesta |
| Pestaña `Body` | El **cuerpo**, con el JSON ya indentado y coloreado |
| Pestaña `Headers` | Las **cabeceras de respuesta**, con el `Content-Type` entre ellas |

Compara ese JSON con el que veías en el navegador. Es el mismo texto: lo único que cambia es que aquí se lee.

Cambia el método de `GET` a `POST` en el desplegable, sin tocar la URL, y pulsa `Send` otra vez.

```text
Alguien ha hecho un POST
```

Ese método que hace un minuto era inalcanzable acaba de ejecutarse. **Eso es todo lo que Postman aporta hoy**, y es suficiente para trabajar tres semanas.

#### Paso 9 · Recibir datos · `@RequestBody`

Un POST que no recibe nada sirve de poco. Vamos a mandarle una tarea.

```java
@PostMapping
public Tarea crear(@RequestBody Tarea tarea) {
    return tarea;
}
```

Este método, de momento, devuelve exactamente lo que recibe. Es un espejo, y es la mejor forma de comprobar que la entrada llega bien antes de hacer nada con ella.

<p class="term">Deserializar</p>

Lo contrario de lo que hiciste en la sesión 3: convertir el texto JSON que llega en el cuerpo de la petición en un objeto Java. También lo hace Jackson.

<figure class="diagram">
  <figcaption>De cuerpo de petición a objeto Java</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Llega <code>POST /tareas</code> con un cuerpo JSON</li>
    <li>Spring ve <code>@RequestBody</code></li>
    <li>Jackson crea un <code>Tarea</code> con el constructor vacío</li>
    <li>Llama a los <em>setters</em> que correspondan a cada clave</li>
    <li>Pasa el objeto ya montado a tu método</li>
  </ol>
</figure>

Ahí está la respuesta a la pregunta que dejamos abierta en la sesión 3: **para esto hacía falta el constructor vacío**. Jackson necesita poder crear el objeto antes de saber qué valores va a ponerle. Si borras ese constructor, este endpoint deja de funcionar.

Y por la misma razón hacen falta los *setters*: al serializar, Jackson lee con los *getters*; al deserializar, escribe con los *setters*.

1. Método `POST`, URL `http://localhost:8080/tareas`.
2. Abre la pestaña **Body**, debajo de la URL.
3. Marca la opción **raw**.
4. En el desplegable de la derecha, que por defecto pone `Text`, elige **JSON**.
5. Escribe el cuerpo:

```json
{
  "id": 1,
  "titulo": "Revisar el login",
  "prioridad": "alta",
  "completada": false
}
```

6. `Send`.

La respuesta devuelve el mismo objeto. Ha hecho un viaje completo: texto JSON, objeto Java, texto JSON otra vez.

<div class="rule">
  <p class="rule-label">El paso 4 es el que se olvida</p>
  <p>Elegir <strong>JSON</strong> en ese desplegable no cambia el color del texto: hace que Postman envíe la cabecera <code>Content-Type: application/json</code>. Sin ella, tu servidor no sabe cómo interpretar el cuerpo y contesta <code>415 Unsupported Media Type</code>.</p>
  <p>Compruébalo ahora: cambia el desplegable a <code>Text</code>, envía, y mira el error. Después vuelve a dejarlo en JSON. Ese 415 te va a pasar de verdad, y así lo reconocerás.</p>
</div>

#### Paso 10 · Tres formas de romperlo, y qué contesta cada una

Pruébalas las tres. Anota el código y quédate con el patrón.

| Qué envías | Respuesta | Por qué |
| :--- | :---: | :--- |
| Cuerpo con una coma de más | `400` | No es JSON válido, Jackson no puede leerlo |
| `Content-Type` sin poner | `415` | El servidor no acepta un cuerpo de ese tipo |
| `{"titulo": "Algo", "color": "azul"}` | `200` | **Ojo con esta** |

La tercera merece detenerse. `color` no existe en la clase `Tarea`, y aun así la petición **funciona**: Spring Boot está configurado para **ignorar en silencio las claves que no reconoce**.

Y lo mismo pasa con una errata. Envía esto:

```json
{
  "titulo": "Revisar el login",
  "prioridadd": "alta"
}
```

Responde `200`, y la prioridad llega como `null`. Nadie te avisa de nada.

<div class="rule">
  <p class="rule-label">Recuerda esto para la UD3</p>
  <p>Lo que un cliente te envía <strong>no está comprobado</strong>. Ahora mismo tu API acepta una tarea sin título, con prioridad nula, con el id que le dé la gana al cliente y con campos inventados. No se queja porque nadie le ha dicho todavía qué es una tarea válida.</p>
  <p>Eso se llama validación de entrada, y es un tema entero. Hasta entonces, trabaja siempre con la sospecha de que lo que llega puede ser cualquier cosa.</p>
</div>

#### Paso 11 · Guardar las tareas en memoria

Hasta ahora el POST no guardaba nada. Vamos a darle una lista donde vivir.

```java
package com.ejemplo.gestor.controller;

import com.ejemplo.gestor.model.Tarea;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/tareas")
public class TareaController {

    private final List<Tarea> tareas = new ArrayList<>();

    @GetMapping
    public List<Tarea> lista() {
        return tareas;
    }

    @GetMapping("/{id}")
    public Tarea detalle(@PathVariable(name = "id") int id) {
        for (Tarea tarea : tareas) {
            if (tarea.getId() == id) {
                return tarea;
            }
        }
        return null;
    }

    @PostMapping
    public Tarea crear(@RequestBody Tarea tarea) {
        tareas.add(tarea);
        return tarea;
    }
}
```

Es Java corriente: una `ArrayList`, un bucle y un `add`. Toda la parte web son cinco anotaciones que ya conoces.

Ejecuta estas cuatro peticiones **en este orden** y ve prediciendo cada respuesta antes de pulsar `Send`:

| # | Petición | Qué debe pasar |
| :---: | :--- | :--- |
| 1 | `GET /tareas` | `[]`, la lista vacía |
| 2 | `POST /tareas` con la tarea 1 | Devuelve la tarea creada |
| 3 | `GET /tareas` | Ahora sale un array con una tarea |
| 4 | `GET /tareas/1` | Sale esa tarea sola, como objeto |

Cuando la cuarta responda, para y date cuenta de lo que acabas de construir: **una petición ha cambiado lo que devuelve otra**. Eso ya es una aplicación, no un ejercicio.

#### Paso 12 · Aplicar el patrón a la segunda entidad de tu proyecto

Sobre el `ProyectoController` de la sesión 3, y sin mirar el código de tareas:

1. Sustituye la lista inventada por un `ArrayList` vacío, como atributo del controlador.
2. Deja funcionando `GET /proyectos`, `GET /proyectos/{id}` y `POST /proyectos`.
3. Comprueba las tres en Postman siguiendo la misma secuencia de cuatro pasos de antes, y anota el código de estado de cada una.
4. Envía un POST con **un campo mal escrito a propósito** y anota qué llega y qué responde.

#### Paso 13 · Comprobar y registrar el resultado de vuestro proyecto

1. Ejecuta el recorrido trabajado con datos de tu dominio. Conserva método, ruta, entrada y resultado esperado en la colección HTTP o en un test.
2. Ejecuta el caso de rechazo preparado al inicio. Comprueba tanto la respuesta como que el estado de los datos no se haya alterado indebidamente.
3. Compara el resultado con la tarea de esta sesión: **construid los objetos json y el alta del recurso**. Explica qué clase o configuración produce el comportamiento observado.
4. Registra la versión y los defectos pendientes en el mismo repositorio. Usa el workflow aprendido en Intermodular y conserva el enlace al resultado del CI cuando esté disponible.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Predice el JSON

Dada esta clase, y **sin ejecutarla**, escribe el JSON exacto que produciría `new Incidencia(7, "Caída del servidor", 3)`:

```java
public class Incidencia {

    private int id;
    private String titulo;
    private int prioridad;
    private String autor;

    public Incidencia(int id, String titulo, int prioridad) {
        this.id = id;
        this.titulo = titulo;
        this.prioridad = prioridad;
    }

    public int getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public int getNivel() {
        return prioridad;
    }

    public String autor() {
        return autor;
    }

    public boolean isUrgente() {
        return prioridad >= 3;
    }
}
```

Presta atención a las cuatro trampas: hay un *getter* renombrado, un método sin prefijo, un atributo sin *getter* y un *getter* que no corresponde a ningún atributo. Cuando lo tengas escrito, cópiala al proyecto y compruébalo.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La clase <code>Tarea</code> y las rutas de ejemplo devolviendo JSON, con el <code>Content-Type</code> comprobado.</span></div>
  <div><strong>Si lo tienes</strong><span>El modelo <code>Proyecto</code> completo con sus dos rutas, y explicado por qué el campo sin getter no aparece.</span></div>
  <div><strong>Reto</strong><span>El JSON de <code>Incidencia</code> predicho entero antes de ejecutarlo, con las cuatro trampas identificadas.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · De los métodos públicos que empiezan por <code>get</code> o por <code>is</code>, quitándoles el prefijo y bajando a minúscula la primera letra. No de los atributos privados.</p>
  <p>2 · Que tenga <em>getter</em> y que su nombre siga la convención. Un método llamado <code>autor()</code> o <code>estaCompletada()</code> no lo es, y el campo desaparece sin ningún error.</p>
  <p>3 · Un array vacío: <code>[]</code>. Nunca <code>null</code> ni un mensaje de texto.</p>
  <p>4 · Convertir un objeto que está en memoria en texto transmisible, en nuestro caso JSON.</p>
</details>

##### Reto · Diagnóstico de tres respuestas

Un compañero te enseña estas tres respuestas de su API y te pregunta qué le pasa. Para cada una, escribe **la causa más probable** y **qué le pides que compruebe**, sin ver su código:

1. Hace un `POST` y recibe `415`.
2. Hace un `POST`, recibe `200`, y en el JSON de vuelta todos los campos están a `null` o a `0` menos uno.
3. Hace un `POST` y recibe `200`, pero el `GET` siguiente devuelve `[]`.

Después provoca las tres en tu proyecto para confirmar tus hipótesis. La tercera es la más interesante: hay al menos dos formas distintas de conseguirla.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Postman instalado, un GET repetido y un POST con cuerpo JSON que responde 200.</span></div>
  <div><strong>Si lo tienes</strong><span>La lista en memoria funcionando en tareas y en proyectos, con la secuencia de cuatro peticiones comprobada.</span></div>
  <div><strong>Reto</strong><span>Las tres respuestas diagnosticadas y reproducidas, con dos causas distintas para la tercera.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque crea el objeto primero, vacío, y solo después le asigna los valores llamando a los <em>setters</em>. Sin constructor sin argumentos no puede dar el primer paso.</p>
  <p>2 · <code>Content-Type: application/json</code>. Si falta, el servidor responde <code>415 Unsupported Media Type</code>. En Postman se pone sola al elegir JSON en el desplegable del cuerpo.</p>
  <p>3 · Se ignora en silencio, sin error y sin aviso. Por eso una errata en un nombre de campo deja ese valor a <code>null</code> y la petición parece correcta.</p>
  <p>4 · Todo lo guardado. La lista vive en la memoria del proceso, y al reiniciar el proceso se crea de nuevo, vacía.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

La colección reproduce el alta y la consulta sin editar el código entre peticiones; el identificador lo asigna el servidor.

Cada integrante explica una decisión del código o reproduce una comprobación. Anotad los defectos pendientes y dejad identificado el commit con el que termináis.


#### Entrega de la sesión 3 · Repositorio de GitHub

**Entrega el enlace al mismo repositorio de GitHub del proyecto, actualizado con el trabajo de esta sesión, y el enlace al commit que permite identificar esa versión.** El repositorio acumula el trabajo de todo el módulo.

Antes de entregar:

1. Sube el código realizado y actualiza el README si ha cambiado la forma de arrancar, configurar o utilizar la aplicación. Incluye en el repositorio las pruebas, colecciones HTTP, scripts y demás archivos que hayas trabajado hoy, cuando correspondan.
2. Crea o actualiza `docs/sesiones/sesion-03.md` con cuatro apartados: **qué has realizado**, **qué archivos has cambiado**, **cómo lo has comprobado y qué resultado has obtenido**, y **qué queda pendiente**. Las tablas, respuestas y observaciones solicitadas en esta página se guardan ahí o se enlazan desde ese archivo a otros archivos del repositorio.
3. Guarda los cambios en un commit y súbelos a GitHub siguiendo el workflow establecido en Intermodular. Si trabajáis mediante pull request, conserva también su enlace. Un commit que solo está en tu ordenador no constituye la entrega.
4. Abre GitHub y comprueba que se ven el código, el documento de esta sesión y el commit entregado. Verifica que el profesor puede acceder al repositorio. Si algo no funciona todavía, descríbelo en pendientes y entrega igualmente la versión que has realizado.

| Dato de la entrega | Qué debes facilitar |
| --- | --- |
| Repositorio | Enlace a la página del proyecto en GitHub |
| Versión de esta sesión | Enlace al commit que contiene el trabajo entregado |
| Registro del trabajo | `docs/sesiones/sesion-03.md`, dentro de ese repositorio |

La comprobación o explicación en clase acompaña a esta entrega. El código y las evidencias de Servidor se evalúan en la versión indicada; el flujo de trabajo se evalúa en Intermodular.

## Sesión 4 · Primera versión CRUD en memoria

### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Las cuatro operaciones comparten un almacén y un contrato. La demostración modifica y elimina un recurso, y muestra qué se pierde al reiniciar.

#### Dónde estamos

Esto es lo que responde tu API al terminar la sesión 3:

| Método y ruta | Estado |
| :--- | :--- |
| `GET /tareas` | Funciona |
| `GET /tareas/{id}` | Funciona, con un defecto conocido |
| `POST /tareas` | Funciona, con un defecto conocido |
| `PUT /tareas/{id}` | No existe |
| `DELETE /tareas/{id}` | No existe |

Hoy se cierra la tabla.

#### Qué significa que el CRUD esté completo

Las operaciones comparten el mismo estado. Si creas un registro, tiene que aparecer en el listado y poder consultarse por su identificador; si lo modificas, las lecturas siguientes deben reflejar el cambio; si lo borras, tiene que desaparecer tanto del listado como del detalle. Cinco métodos que funcionan aislados no bastan si cada uno utiliza una colección diferente.

El identificador pertenece al servidor. El cliente envía los datos que desea crear y recibe el identificador asignado; no debe poder sustituir accidentalmente otro registro eligiendo su número. En una modificación, el identificador de la ruta selecciona el registro existente. Primero se busca y después se cambia: que no exista es un caso que la aplicación debe tratar.

Hoy la colección vive en el proceso Java. El reinicio elimina sus datos y es una limitación conocida de esta versión. No se corrige guardando el JSON en el navegador: la persistencia del servidor se incorporará con PostgreSQL. La prueba de hoy recorre crear, consultar, modificar, volver a consultar, borrar y comprobar la ausencia, en ese orden, sin editar el código entre peticiones.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

Completad creación, listado, detalle, actualización y borrado de la entidad principal del proyecto.

Ejecutad el recorrido completo, repetidlo con otro recurso y anotad las limitaciones que resolveréis en las próximas unidades.

Los ejemplos de código usan proyectos y tareas para mostrar el procedimiento. Aplica cada paso a las entidades y reglas del CRUD que elegiste: conserva tu repositorio, cambia los nombres de clases, rutas y campos de forma coherente y adapta las comprobaciones. No crees una segunda aplicación para copiar el ejemplo.

#### Paso 1 · Preparar el punto de partida

1. Abre el repositorio y comprueba qué versión tienes. Arranca la aplicación y ejecuta la colección o las pruebas de la sesión anterior antes de cambiar código; si ya falla, registra y resuelve ese fallo primero.
2. Localiza la clase principal y el controlador que vas a utilizar. Anota el resultado esperado antes de editar.
3. Prepara un caso válido y otro que deba rechazarse o no encontrarse. Los usarás para comparar el comportamiento antes y después.

<div class="rule">
  <p class="rule-label">Cómo es esta sesión</p>
  <p>Es la sesión de integración de la unidad, así que el andamiaje baja. Vas a recibir <strong>un ejemplo resuelto y una especificación</strong>, no el código completo. Todo lo que necesitas se ha explicado en las cinco sesiones anteriores; lo que cambia hoy es que tienes que combinarlo tú.</p>
</div>

<p class="stage">Mini-API de tareas en memoria</p>

#### Paso 2 · El primer defecto · el id lo pone el cliente

Mira otra vez tu método de creación. El cliente envía el `id` dentro del JSON y tú lo guardas tal cual. Prueba a hacer esto en Postman:

1. `POST /tareas` con `"id": 1` y el título que quieras.
2. `POST /tareas` otra vez, **también con `"id": 1`** y otro título.
3. `GET /tareas/1`.

Tienes dos tareas distintas con el mismo identificador, y la consulta solo encuentra una: la primera que aparece en la lista. La otra existe y es inalcanzable.

<div class="rule">
  <p class="rule-label">Quién decide el identificador</p>
  <p>El identificador de un recurso <strong>lo asigna siempre el servidor</strong>, nunca quien lo crea. El cliente no puede saber qué ids están libres, no puede coordinarse con los demás clientes, y no tiene ningún motivo para que le importe.</p>
  <p>Lo que envía el cliente es el <em>contenido</em> de la tarea. Lo que devuelve el servidor es la tarea <em>ya creada</em>, con su id puesto. Por eso un <code>POST</code> devuelve el objeto: es la única forma que tiene quien llama de enterarse del identificador.</p>
</div>

La solución, en dos líneas:

```java
private final List<Tarea> tareas = new ArrayList<>();
private int siguienteId = 1;

@PostMapping
public Tarea crear(@RequestBody Tarea tarea) {
    tarea.setId(siguienteId);
    siguienteId = siguienteId + 1;
    tareas.add(tarea);
    return tarea;
}
```

Ahora el `id` que llegue en el JSON se descarta: se sobrescribe antes de guardar. Compruébalo enviando `"id": 999` y viendo qué te devuelve.

#### Paso 3 · `PUT` · sustituir una tarea entera

Este es el ejemplo resuelto de hoy. Léelo entero antes de copiarlo.

```java
@PutMapping("/{id}")
public Tarea actualizar(
        @PathVariable(name = "id") int id,
        @RequestBody Tarea datos) {

    for (int i = 0; i < tareas.size(); i++) {
        if (tareas.get(i).getId() == id) {
            datos.setId(id);
            tareas.set(i, datos);
            return datos;
        }
    }
    return null;
}
```

<dl class="worked">
  <dt>Por qué el id va en la ruta y no en el cuerpo</dt>
  <dd>Porque identifica <em>qué</em> tarea se sustituye. Es la regla de la sesión 2: sin ese dato la petición no significa nada. Lo que va en el cuerpo es el contenido nuevo.</dd>
  <dt>Por qué <code>datos.setId(id)</code></dt>
  <dd>Para que mande la ruta. Si el cuerpo trae un id distinto —o ninguno— y no lo forzamos, la tarea se guardaría con un identificador equivocado y desaparecería de las consultas. Cuando dos sitios dicen lo mismo, hay que decidir cuál gana y dejarlo escrito.</dd>
  <dt>Por qué <code>set</code> y no modificar campo a campo</dt>
  <dd>Porque <code>PUT</code> significa «sustituye el recurso por este». Si el cuerpo no trae prioridad, la tarea se queda sin prioridad, y eso es correcto. Cambiar solo algunos campos es <code>PATCH</code>, que es otra operación distinta y no la haremos hasta la UD2.</dd>
  <dt>Qué pasa si el id no existe</dt>
  <dd>Devuelve <code>null</code>, y por tanto un <code>200</code> con el cuerpo vacío. Es el mismo defecto que ya anotaste en <code>GET /tareas/{id}</code>. Sigue anotado.</dd>
</dl>

#### Paso 4 · el resto de la API

A partir de aquí no hay código resuelto. Esta es la especificación de lo que tiene que existir al terminar la sesión.

| Método y ruta | Recibe | Devuelve |
| :--- | :--- | :--- |
| `GET /tareas` | Nada | El array de todas las tareas |
| `GET /tareas?completada=true` | Filtro opcional | Solo las que coincidan |
| `GET /tareas/{id}` | El id en la ruta | Esa tarea como objeto |
| `POST /tareas` | La tarea en el cuerpo | La tarea creada, con su id asignado |
| `PUT /tareas/{id}` | El id en la ruta y la tarea en el cuerpo | La tarea sustituida |
| `DELETE /tareas/{id}` | El id en la ruta | Nada |

Requisitos que se comprueban:

1. El identificador lo asigna el servidor y nunca se repite, ni siquiera después de borrar una tarea.
2. El filtro `completada` es opcional. Sin él, salen todas.
3. `DELETE` no devuelve cuerpo. Declara el método como `void` y comprueba en Postman qué código de estado sale.
4. Todas las rutas cuelgan de un único `@RequestMapping` a nivel de clase.
5. No se escribe ninguna ruta con un verbo dentro, del tipo `/tareas/borrar/3`. La acción la expresa el método HTTP.

<details class="aside aside--help">
  <summary>Estoy atascado · el filtro opcional</summary>
  <p>Ya lo has hecho en la sesión 2, pero con un <code>String</code>. Aquí el parámetro es un <code>Boolean</code> con <code>required = false</code>: si no llega, vale <code>null</code>, y entonces devuelves la lista entera.</p>
  <p>Usa el envoltorio <code>Boolean</code> y no el tipo primitivo <code>boolean</code>. Un <code>boolean</code> no puede valer <code>null</code>, así que no podrías distinguir «no me han filtrado» de «me han pedido las no completadas».</p>
</details>

<details class="aside aside--help">
  <summary>Estoy atascado · el borrado</summary>
  <p>Sobre una <code>List</code> tienes <code>removeIf</code>, que recibe la condición y devuelve <code>true</code> si ha borrado algo. Una línea.</p>
  <p>Si prefieres el bucle, recuerda no borrar de una lista mientras la recorres con un <code>for</code> normal: es la forma clásica de saltarte elementos.</p>
</details>

#### Paso 5 · La prueba de aceptación

Una API no está terminada porque compile. Está terminada cuando **una secuencia de peticiones se comporta como se esperaba**.

Ejecuta esto en Postman, en orden, y anota el código de estado y el cuerpo de cada paso. Predice cada respuesta antes de pulsar `Send`.

| # | Petición | Qué debe ocurrir |
| :---: | :--- | :--- |
| 1 | `GET /tareas` | `[]` |
| 2 | `POST /tareas` · «Revisar el login», alta | Devuelve la tarea con `id` 1 |
| 3 | `POST /tareas` · «Actualizar dependencias», baja | Devuelve la tarea con `id` 2 |
| 4 | `GET /tareas` | Array con las dos |
| 5 | `GET /tareas/2` | Solo la segunda, como objeto |
| 6 | `PUT /tareas/2` · misma tarea con `completada: true` | La devuelve modificada |
| 7 | `GET /tareas?completada=true` | Solo la tarea 2 |
| 8 | `DELETE /tareas/1` | Sin cuerpo |
| 9 | `GET /tareas` | Solo queda la tarea 2 |
| 10 | `POST /tareas` · una tercera | Su id **no** es 1 |

El paso 10 es el que suspende a más gente. Si tu contador vuelve a repartir el 1, es que lo estás calculando a partir del tamaño de la lista en lugar de llevar la cuenta de cuántas has creado.

<div class="rule">
  <p class="rule-label">Guarda estas diez peticiones</p>
  <p>No las borres al terminar. En la UD2 aprenderás a agruparlas en una colección, ponerles nombre, sacar la dirección del servidor a una variable y ejecutarlas todas de una vez. Esta lista de diez pasos es el primer borrador de esa colección, y es también la primera versión de lo que en la UD10 serán tests automáticos.</p>
</div>

#### Paso 6 · Lo que tu API todavía hace mal

Esto no es un apartado de autocrítica: es el índice de las cuatro unidades siguientes. Comprueba tú mismo cada punto y anota qué responde.

| Prueba esto | Lo que pasa | Lo correcto | Dónde se arregla |
| :--- | :--- | :--- | :--- |
| `GET /tareas/999` | `200` con cuerpo vacío | `404 Not Found` | UD2 |
| `POST` con `{}` | Crea una tarea sin título | `400` explicando qué falta | UD3 |
| `POST` correcto | Responde `200` | `201 Created` | UD2 |
| `POST` con `"completada": "quizás"` | `400` sin explicación útil | Un error legible | UD3 |
| Reiniciar la aplicación | Se pierde todo | Los datos siguen ahí | UD5 |
| Un campo interno del modelo | Se publica sin querer | Solo se publica lo que decidas | UD2, con DTO |

Que sepas enumerar estos seis defectos vale tanto como haber hecho funcionar la API. **Saber qué le falta a lo que has construido es la parte difícil de este oficio.**

#### Paso 7 · Preparar la evidencia de esta versión

Sube a tu repositorio del módulo:

1. El proyecto completo, arrancable con `mvnw spring-boot:run`.
2. Un archivo `PRUEBAS.md` con la tabla de las diez peticiones y el resultado real de cada una.
3. Al final de ese archivo, tres apartados breves:
   * **Decisiones.** Por qué el id lo pone el servidor y por qué el filtro va en la query string.
   * **Defectos conocidos.** Los seis de la tabla anterior, con tus palabras.
   * **Una pregunta.** Algo que hayas hecho funcionar sin acabar de entender del todo por qué.

Ese tercer apartado no resta nota. Se lee en la primera sesión de la UD2.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Los cinco métodos funcionando y la secuencia de diez peticiones ejecutada entera.</span></div>
  <div><strong>Si lo tienes</strong><span>El filtro opcional resuelto y el paso 10 correcto, con el contador independiente del tamaño de la lista.</span></div>
  <div><strong>Reto</strong><span>La misma API completa sobre <code>Proyecto</code>, escrita sin volver a mirar la de tareas.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el cliente no sabe qué ids están ocupados ni puede coordinarse con los demás clientes. Dos peticiones simultáneas elegirían el mismo y una de las dos tareas quedaría inalcanzable.</p>
  <p>2 · <code>PUT</code> sustituye el recurso entero por lo que envías, así que lo que no mandas se pierde. <code>PATCH</code> modifica solo los campos que envías.</p>
  <p>3 · En cuanto borras algo. Si creas dos tareas, borras la primera y creas otra, el tamaño vuelve a ser 1 y repartes un id que ya existe.</p>
  <p>4 · Porque mete la acción en la ruta cuando la acción es el método HTTP. Además sería un <code>GET</code> que modifica datos, con el problema de la caché y las precargas que vimos en la sesión 1.</p>
</details>

#### Paso 8 · Comprobar y registrar el resultado de vuestro proyecto

1. Ejecuta el recorrido trabajado con datos de tu dominio. Conserva método, ruta, entrada y resultado esperado en la colección HTTP o en un test.
2. Ejecuta el caso de rechazo preparado al inicio. Comprueba tanto la respuesta como que el estado de los datos no se haya alterado indebidamente.
3. Compara el resultado con la tarea de esta sesión: **completad el crud sobre el mismo almacén**. Explica qué clase o configuración produce el comportamiento observado.
4. Registra la versión y los defectos pendientes en el mismo repositorio. Usa el workflow aprendido en Intermodular y conserva el enlace al resultado del CI cuando esté disponible.

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

El CRUD funciona desde la colección HTTP y el README declara que esta primera versión pierde datos al reiniciar.

Cada integrante explica una decisión del código o reproduce una comprobación. Anotad los defectos pendientes y dejad identificado el commit con el que termináis.


#### Entrega de la sesión 4 · Repositorio de GitHub

**Entrega el enlace al mismo repositorio de GitHub del proyecto, actualizado con el trabajo de esta sesión, y el enlace al commit que permite identificar esa versión.** El repositorio acumula el trabajo de todo el módulo.

Antes de entregar:

1. Sube el código realizado y actualiza el README si ha cambiado la forma de arrancar, configurar o utilizar la aplicación. Incluye en el repositorio las pruebas, colecciones HTTP, scripts y demás archivos que hayas trabajado hoy, cuando correspondan.
2. Crea o actualiza `docs/sesiones/sesion-04.md` con cuatro apartados: **qué has realizado**, **qué archivos has cambiado**, **cómo lo has comprobado y qué resultado has obtenido**, y **qué queda pendiente**. Las tablas, respuestas y observaciones solicitadas en esta página se guardan ahí o se enlazan desde ese archivo a otros archivos del repositorio.
3. Guarda los cambios en un commit y súbelos a GitHub siguiendo el workflow establecido en Intermodular. Si trabajáis mediante pull request, conserva también su enlace. Un commit que solo está en tu ordenador no constituye la entrega.
4. Abre GitHub y comprueba que se ven el código, el documento de esta sesión y el commit entregado. Verifica que el profesor puede acceder al repositorio. Si algo no funciona todavía, descríbelo en pendientes y entrega igualmente la versión que has realizado.

| Dato de la entrega | Qué debes facilitar |
| --- | --- |
| Repositorio | Enlace a la página del proyecto en GitHub |
| Versión de esta sesión | Enlace al commit que contiene el trabajo entregado |
| Registro del trabajo | `docs/sesiones/sesion-04.md`, dentro de ese repositorio |

La comprobación o explicación en clase acompaña a esta entrega. El código y las evidencias de Servidor se evalúan en la versión indicada; el flujo de trabajo se evalúa en Intermodular.

## Lo que debes recordar

### El método

Ante cualquier funcionalidad que tengas que exponer por HTTP, esta es la secuencia. No cambia con el framework ni con los años:

<figure class="diagram">
  <figcaption>Cómo se decide un endpoint</figcaption>
  <ol class="flow">
    <li>¿Sobre <em>qué</em> actúo? Un recurso concreto o una colección</li>
    <li>¿Qué quiero hacerle? Eso, y solo eso, elige el método HTTP</li>
    <li>¿Qué datos necesito? Identifican, filtran o son contenido: ruta, query o cuerpo</li>
    <li>¿Qué devuelvo y con qué código de estado?</li>
    <li>Compruébalo con un cliente HTTP: un caso correcto y un caso que falle</li>
  </ol>
</figure>

El paso dos separa a quien ha entendido la unidad de quien ha memorizado anotaciones. Si tu respuesta al «qué quiero hacerle» acaba metida en la ruta —`/tareas/borrar/3`—, es que la has contestado con el nombre en lugar de con el método.

### La idea más importante

Si dentro de un año has olvidado las anotaciones, que quede esta:

> **Nada de esto es magia. Es texto que viaja entre dos programas, y uno de ellos se queda esperando. Todo lo que Spring hace por ti se puede leer en el panel de red o en la consola.**

De ahí sale el resto de la unidad. Por eso abrimos DevTools antes de escribir una línea de Java, por eso un 404 es una respuesta y no un fallo, por eso el 415 se arregla mirando una cabecera, y por eso cuando algo no funciona se leen las últimas veinte líneas de la consola antes de tocar el código.

<p class="term">Un backend publica datos, no páginas</p>

Esa frase es la que hace posible el resto del curso. Si tu servidor devuelve datos con una forma clara, quien los pinte —una web, una app de móvil, otro servidor— es una decisión posterior y sustituible.

### Las decisiones que tienes que saber justificar

No basta con que funcione. En la defensa del proyecto se pregunta por qué:

| Decisión | Lo que tienes que poder decir |
| :--- | :--- |
| El id va en la ruta y el filtro en la query | Si quito el filtro, la URL sigue significando algo; si quito el id, no |
| Borrar es `DELETE`, nunca `GET` | Un `GET` se considera seguro y el navegador lo repite, lo cachea y lo precarga |
| El id lo asigna el servidor | El cliente no sabe qué ids están libres ni puede coordinarse con otros clientes |
| El controlador cuelga del paquete de la clase principal | `@ComponentScan` solo recorre ese paquete y sus subpaquetes, y no avisa de lo que no ve |
| Una colección vacía devuelve `[]` y no `null` | Quien llama espera una lista y sabe recorrer una lista de cero elementos |
| El modelo necesita constructor vacío | Jackson crea el objeto antes de asignarle valores, y luego usa los *setters* |
| Una tarea sin título se acepta hoy | Porque todavía no hay validación, y eso es un defecto conocido, no una decisión |

Esa última fila es la más importante de la tabla. **Saber qué le falta a lo que has construido vale tanto como haberlo construido.**

### Al terminar deberías poder responder

1. ¿Qué hace un servidor que no hace un programa de consola?
2. ¿Qué separa las cabeceras del cuerpo en un mensaje HTTP?
3. ¿Qué te dice la primera cifra de un código de estado?
4. ¿Por qué un `404` demuestra que la comunicación ha funcionado?
5. ¿Qué diferencia hay entre un `404` y un `ERR_CONNECTION_REFUSED`?
6. ¿Qué significa que HTTP no tenga estado, y cómo «recuerda» entonces una web quién eres?
7. ¿Qué es un puerto y por qué dos aplicaciones no pueden compartirlo?
8. ¿Qué hacen las tres anotaciones que contiene `@SpringBootApplication`?
9. ¿Por qué un controlador fuera del paquete de la clase principal devuelve `404` sin ningún error en consola?
10. ¿Cuándo se usa `@PathVariable` y cuándo `@RequestParam`?
11. ¿Qué diferencia hay entre `defaultValue` y `required = false`?
12. Declaras `int` y llega texto. ¿Qué responde el servidor y por qué no se ejecuta tu método?
13. ¿De dónde saca Jackson los nombres de las claves del JSON?
14. ¿Por qué la barra de direcciones no puede hacer un `POST`?
15. ¿Qué cabecera falta cuando recibes un `415`?
16. Envías una clave que no existe en la clase. ¿Qué ocurre, y por qué es peligroso?
17. ¿Por qué la lista sobrevive entre peticiones pero no a un reinicio?
18. ¿Cuándo falla calcular el siguiente id con `size() + 1`?

Si además puedes añadir un recurso nuevo a la mini-API —modelo, controlador, cinco métodos y su secuencia de pruebas— sin copiar el de tareas, tienes la base para continuar.

### El vocabulario de la unidad

| Concepto | Significa |
| :--- | :--- |
| Cliente | El programa que pide. Un navegador, Postman, `curl`, otro servidor |
| Servidor | El programa que espera y responde. El que escribes tú |
| HTTP | El acuerdo sobre qué forma tiene un mensaje de petición y uno de respuesta |
| URL | Esquema, host, puerto, ruta y *query string* |
| Puerto | El número que distingue a qué programa de una máquina le hablas |
| `localhost` | Esta misma máquina |
| Método | La intención: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` |
| Cabecera | Un dato sobre el mensaje, con formato `Nombre: valor` |
| Cuerpo | El contenido que se envía o se devuelve, tras una línea en blanco |
| Código de estado | Tres cifras; la primera dice quién tiene el problema |
| *Stateless* | Cada petición llega sola: el servidor no recuerda la anterior |
| Endpoint | Una ruta con un método que tu aplicación atiende |
| Framework | Armazón que resuelve lo repetitivo y que te llama a ti, no al revés |
| Spring Boot | La forma de usar Spring que trae el servidor web ya montado |
| Tomcat embebido | El servidor, incluido como librería dentro de tu propia aplicación |
| Maven | Quien descarga las dependencias, compila y empaqueta |
| Dependencia | Una librería que tu proyecto necesita, declarada en el `pom.xml` |
| *Starter* | Un paquete de dependencias que suelen ir juntas |
| *Component scan* | El barrido que hace Spring buscando tus clases, solo bajo el paquete principal |
| `@RestController` | Esta clase atiende peticiones y lo que devuelve es el cuerpo de la respuesta |
| `@GetMapping` | Conecta un método `GET` y una ruta con un método Java |
| `@RequestParam` | Lee un valor de la *query string* |
| `@PathVariable` | Captura un trozo de la ruta declarado entre llaves |
| `@RequestBody` | Convierte el cuerpo JSON de la petición en un objeto Java |
| JSON | El formato de texto en el que viajan los datos entre programas |
| Serializar | Convertir un objeto en memoria a texto |
| Deserializar | Convertir texto en un objeto en memoria |
| Jackson | La librería que hace las dos conversiones, leyendo *getters* y *setters* |
| Cliente HTTP | Postman o Bruno: construye peticiones a mano y enseña la respuesta entera |
| CRUD | Las cuatro operaciones: crear, leer, actualizar y borrar |

### Comprobación final del producto

Antes de dar la unidad por cerrada, tu proyecto tiene que superar esto:

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación final · con el proyecto delante</p>
  <ul class="checklist">
    <li>La aplicación arranca y la consola muestra la línea de Tomcat con el puerto.</li>
    <li>Los cinco métodos de la mini-API responden sobre una lista en memoria.</li>
    <li>La secuencia de diez peticiones de la sesión 4 pasa entera y está en <code>PRUEBAS.md</code>.</li>
    <li>El identificador lo asigna el servidor y no se repite después de un borrado.</li>
    <li>Ninguna ruta lleva un verbo dentro.</li>
    <li>Sabes provocar a voluntad un 404, un 405, un 415 y un 400, y explicar cada uno.</li>
    <li>Puedes enumerar los seis defectos conocidos y decir en qué unidad se resuelve cada uno.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Resultados de la unidad</p>
  <ul class="checklist">
    <li>Explicar el recorrido completo de una petición y una respuesta HTTP.</li>
    <li>Crear y ejecutar un proyecto Spring Boot entendiendo su estructura básica.</li>
    <li>Diseñar rutas con parámetros y devolver objetos serializados como JSON.</li>
    <li>Comprobar una API con Postman o Bruno leyendo estado, cabeceras y cuerpo.</li>
    <li>Implementar un CRUD en memoria con GET, POST, PUT y DELETE.</li>
    <li>Enumerar los defectos conocidos de la API construida y en qué unidad se resuelve cada uno.</li>
  </ul>
</div>

### La siguiente unidad

Durante dos semanas hemos respondido a una pregunta:

> **¿Cómo consigo que esto responda?**

En la UD2 empezamos a responder la otra:

> **¿Cómo consigo que responda bien?**

<figure class="diagram">
  <figcaption>De que funcione a que esté bien hecho</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>UD1 · una API que responde</li>
    <li>UD2 · una API que responde con el código y el formato correctos</li>
  </ol>
</figure>

Partiremos exactamente del proyecto que has construido aquí, y de su lista de defectos conocidos:

| Lo que hoy hace mal | Se arregla en |
| :--- | :--- |
| Un recurso que no existe responde `200` con el cuerpo vacío | UD2, con `ResponseEntity` |
| Crear algo responde `200` en lugar de `201` | UD2 |
| El modelo interno se publica entero, tal cual | UD3, con DTO |
| Una tarea sin título se acepta sin protestar | UD3, con validación |
| Los errores no explican qué corregir | UD3 |
| Al reiniciar se pierde todo | UD5, con PostgreSQL |

Y aquí se cobra el trabajo de estas dos semanas: cuando en la UD2 aparezcan `ResponseEntity`, los códigos de estado y la colección de pruebas, no será material nuevo cayendo del cielo. Será la respuesta a problemas que **ya has visto fallar en tu propio proyecto**.

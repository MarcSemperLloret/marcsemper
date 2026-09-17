---
title: "De Java a la Web: HTTP y Spring Boot"
label: "UD1 · Entender"
section: "ud-01"
order: 1
lang: "es"
summary: "Entender qué ocurre entre el navegador y el servidor, y construir con Spring Boot una primera API en memoria que ya se comprueba con un cliente HTTP."
duration: "12 horas · 2 semanas · 4 sesiones de 3 h"
modality: "Taller de proyecto · 25 min de explicación, 140 min de trabajo y 15 min de cierre"
deliverable: "Aplicación Spring Boot con rutas HTTP y CRUD en memoria, comprobada con un cliente HTTP."
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
  - "Git instalado y una cuenta de GitHub para conservar las versiones del proyecto."
  - "Postman o Bruno instalado, a partir de la sesión 3."
priorKnowledge:
  - "Sintaxis básica de Java."
  - "Clases, objetos, métodos y colecciones."
---

### La meta del proyecto durante el primer trimestre

Durante todo el primer trimestre construyes el mismo CRUD y utilizas su mismo repositorio en Servidor e Intermodular. El tema lo eliges tú y se acuerda con el profesor al comenzar. Puedes gestionar préstamos de material, reservas de instalaciones, pedidos, actividades de una asociación u otro problema que conozcas. El gestor de proyectos de los ejemplos es una referencia para entender el código; tu entrega utiliza el vocabulario y las reglas de tu dominio.

Esta tabla describe lo que aprenderás a construir durante el trimestre. No presupone que conozcas hoy todos sus términos: cada técnica se explica cuando llega su sesión. Para elegir tema, utiliza las preguntas del paso 1 de la primera sesión.

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

### Qué debe quedar hecho en cada sesión

El cierre indica qué debe funcionar, qué debes haber comprobado y qué decisiones debes poder explicar. El mismo proyecto crece durante el módulo; conserva sus cambios y distingue los resultados comprobados de los problemas pendientes.

### Tiempo y coordinación

Cada semana tiene dos sesiones de tres horas. Cada sesión reserva 25 minutos para explicar y demostrar, 140 minutos para trabajar sobre tu proyecto y 15 minutos para comprobar el resultado: 180 minutos. Las consultas durante el taller se atienden sobre el código. La explicación aparece completa en «Se explica» y los procedimientos, el código y las comprobaciones están desarrollados en «Se trabaja». Las ayudas desplegables se reservan para respuestas o dudas puntuales.

Se mantienen las 156 horas previstas: primer trimestre, 28 sesiones y 84 horas; segundo trimestre, 24 sesiones y 72 horas. La [GVA fija para FP en 2026/2027](https://sede.gva.es/es/detall-tramit?id_proc=G25685) el inicio el 9 de septiembre de 2026, Navidad del 22 de diciembre al 6 de enero y Pascua del 25 de marzo al 5 de abril. El tramo de septiembre a Navidad es mayor que el de enero a Pascua.

Servidor evalúa implementación, arquitectura, persistencia, contrato, reglas y pruebas. Intermodular evalúa cómo ese mismo código recorre issues, ramas, revisiones, CI y puesta en producción. La API se publica primero en memoria cuando llega su taller de despliegue y se actualiza con PostgreSQL dentro del primer trimestre. El portfolio presenta el producto; el cliente que consume la API se construye en la UD8 de Servidor y se publica en Intermodular 18, antes de incorporar autenticación.

## Semana 1 · Elegir el CRUD y arrancar el servidor

## Sesión 1 · Elegir el CRUD y arrancar el servidor

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [del repositorio vacío a una url pública](/es/docencia/proyecto-intermodular/ud1-poner-el-circuito-en-marcha/sesion-1/). En Servidor continúas la implementación del mismo producto.



### Qué vas a construir este trimestre

Este módulo no se evalúa con ejercicios independientes. Durante todo el primer trimestre construyes **una sola aplicación de servidor**, un CRUD cuyo tema eliges tú, y esa aplicación es la evidencia que se evalúa. Cada sesión le incorpora una capacidad nueva —rutas, JSON, validación, capas, base de datos, pruebas— sobre el mismo código y el mismo repositorio, de modo que lo que decidas hoy te acompaña catorce semanas.

Ese repositorio es también el que utilizas en Proyecto Intermodular, donde se evalúa **cómo** lo construyes: la descomposición en tareas, las ramas, la revisión por pares y el despliegue. Aquí se evalúa el producto; allí, el método.

La sesión de hoy tiene dos mitades. En la primera decides qué vas a construir; en la segunda dejas el proyecto en marcha, respondiendo por una URL desde tu propio equipo. No necesitas saber todavía diseñar tablas ni interpretar términos como JPA o transacción: [la meta del proyecto durante el primer trimestre](/es/docencia/desarrollo-web-entorno-servidor/ud1-http-y-spring-boot/) recoge el nivel de complejidad exigible al final, y cada técnica se explica en la sesión que le corresponde.

### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

#### De un programa Java a una aplicación web

Hasta ahora has escrito programas Java que ejecutan instrucciones desde `main`. Para que otra persona utilice uno de esos programas desde un navegador, necesitamos que pueda recibir peticiones y responderlas. Esa será la parte **servidor**, o **backend**, de nuestro proyecto. La parte que muestra pantallas y recoge las acciones del usuario se llama **cliente** o **frontend**.

Por ejemplo, en una aplicación de préstamos, el cliente podría mostrar un formulario para solicitar un proyector. El servidor comprobaría su disponibilidad y registraría el préstamo. Hoy empezamos por algo más pequeño: escribir una dirección en el navegador y recibir un texto producido por nuestro programa Java. Todavía no habrá formulario ni datos guardados.

El navegador y el servidor son dos programas distintos. Durante el desarrollo ambos funcionarán en tu ordenador. Más adelante, en Intermodular, publicaremos este mismo backend para acceder a él por Internet.

#### Qué son Spring, Spring Boot y Maven, y para qué los necesitamos

**Spring** es un framework de Java: un conjunto de herramientas y convenciones para construir aplicaciones. Nos proporciona, entre otras cosas, una forma de relacionar una petición web con un método Java. Así podemos centrarnos en lo que hace nuestra aplicación.

**Spring Boot** facilita preparar y arrancar una aplicación que utiliza Spring. Con la opción web incluye un servidor llamado **Tomcat**, que escucha las peticiones del navegador. «Incluido» significa que se pone en marcha junto con nuestro programa; no tenemos que instalar Tomcat por separado. Spring Boot no sustituye a Java: seguiremos escribiendo clases y métodos Java.

Para utilizar ese código de otras bibliotecas, nuestro proyecto necesita **dependencias**. Una dependencia es código externo que nuestra aplicación utiliza. **Maven** es la herramienta que descarga esas bibliotecas, compila nuestro código, ejecuta pruebas y prepara la aplicación para distribuirla. Lee lo que necesita el proyecto en un archivo llamado `pom.xml`. No escribimos código de la aplicación en Maven.

| Elemento | Para qué lo utilizaremos hoy |
| --- | --- |
| JDK de Java | Incluye las herramientas para compilar y ejecutar Java |
| IDE | Editor en el que abrimos el proyecto, escribimos clases y vemos errores |
| Spring Boot con Spring Web | Prepara una aplicación Java capaz de responder a peticiones web |
| Maven | Prepara y ejecuta el proyecto con las dependencias declaradas |
| Navegador | Envía una petición y muestra lo que responde nuestra aplicación |
| Git y GitHub | Git guarda versiones del código; GitHub aloja el repositorio del proyecto |

El proyecto incluirá **Maven Wrapper**: los archivos `mvnw` y `mvnw.cmd`. Permiten utilizar la versión de Maven configurada en el proyecto sin instalar Maven por separado. La primera ejecución necesita Internet para descargarla y obtener las dependencias. El JDK sí debe estar instalado.

#### Qué significa la dirección que vamos a abrir

Usaremos `http://localhost:8080/hola`. Cada parte tiene una función:

| Parte | Significado |
| --- | --- |
| `http://` | Usamos HTTP, las reglas con las que cliente y servidor intercambian peticiones y respuestas |
| `localhost` | El ordenador desde el que estás abriendo el navegador |
| `8080` | El puerto en el que escuchará nuestra aplicación; permite distinguirla de otros servicios del ordenador |
| `/hola` | La ruta que pedimos a esa aplicación |

Al escribir esa dirección, el navegador envía una petición de consulta, llamada **GET**. En Java crearemos un método que devuelva un texto y lo asociaremos a esa ruta. A la combinación de método HTTP y ruta, como `GET /hola`, la llamaremos **endpoint**.

La respuesta contiene un **estado** que indica el resultado, unas **cabeceras** con información sobre la respuesta y un **cuerpo** con su contenido. Hoy reconoceremos `200 OK` cuando nuestra ruta responde y `404 Not Found` cuando pedimos una ruta que no hemos creado. Si el servidor está apagado, no llega ninguno de esos estados: el navegador no consigue conectarse.

En la demostración el profesor arrancará el programa, abrirá `/hola` y señalará el método que produce su texto. Después cambiará el texto, reiniciará y repetirá la petición. Ese es el recorrido que vas a construir, observar y explicar.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

Al terminar tendrás el tema de tu CRUD, una aplicación que responde a tres rutas y su primera versión en GitHub. **CRUD** significa crear, consultar, modificar y borrar información: lo construiremos progresivamente en este mismo proyecto. Los tiempos de los pasos orientan el taller; si una comprobación falla, utiliza la ayuda de ese paso antes de continuar.

#### Paso 1 · Elegir un problema que tu aplicación resolverá · 15 min

Este paso fija el tema del proyecto del trimestre. Conviene uno acotado y con reglas propias: algo que conozcas, con cuatro tipos de información y unas pocas condiciones que deban cumplirse siempre. No se trata de una idea original, sino de una que puedas seguir ampliando durante catorce semanas.

1. Abre una nota y completa: «Mi aplicación la utilizará ___ para ___». Por ejemplo: «Una asociación la utilizará para organizar los préstamos de su material».
2. Enumera cuatro tipos de información que necesitarás. Los llamaremos **entidades**. En el ejemplo serían socios, ejemplares de material, préstamos y categorías. Escribe dos datos de cada tipo, como nombre y número de socio. Cuatro socios distintos son cuatro registros, no cuatro entidades.
3. Elige la entidad principal y describe sus cuatro operaciones CRUD con tus palabras: registrar un préstamo, consultarlo, corregirlo y eliminar un registro equivocado.
4. Anota tres reglas reales: un ejemplar no se presta dos veces a la vez, una devolución no puede preceder a la salida y un socio bloqueado no puede pedir material.
5. Describe una acción que afecte a varias cosas: prestar varios ejemplares juntos y cancelar toda la operación si alguno no está disponible. Más adelante aprenderemos cómo garantizarlo.
6. Acuerda la propuesta con el profesor. Guarda la nota para copiarla después al README, el archivo que presenta el proyecto.

**Comprueba:** puedes explicar quién lo usará, qué guardará y qué debe impedir, y tu propuesta está acordada con el profesor. La tabla de [la meta del proyecto durante el primer trimestre](/es/docencia/desarrollo-web-entorno-servidor/ud1-http-y-spring-boot/) fija el nivel exigible en diciembre; hoy no tienes que saber diseñar sus tablas ni interpretar sus términos.

#### Paso 2 · Comprobar las herramientas y preparar el editor · 15 min

1. Abre el IDE preparado para Java en clase. La **terminal** es su panel para escribir comandos; no es la consola del navegador. Abre ese panel desde el menú de terminal del IDE.
2. Escribe los siguientes comandos, uno cada vez, y pulsa Intro después de cada uno:

```text
java -version
javac -version
git --version
```

3. Comprueba que `java` y `javac` muestran Java 21 o una versión compatible posterior. `javac` es el compilador: si solo funciona `java`, la preparación del JDK está incompleta. Si un comando «no se reconoce», resuelve la instalación o configuración con el profesor antes de generar el proyecto.
4. Crea una carpeta de trabajo, por ejemplo `Documentos/DAW`. Abre GitHub en el navegador e inicia sesión con tu cuenta; todavía no crees otro repositorio si ya tienes uno para este proyecto en Intermodular.

**Comprueba:** funcionan los tres comandos y sabes dónde guardarás el proyecto. No necesitas ejecutar `mvn`: utilizaremos el wrapper que se descargará con él.

##### Si trabajas con Visual Studio Code

Visual Studio Code recién instalado **no sabe nada de Java**. Abre los archivos y los colorea, pero no compila, no te avisa de errores y no tiene ningún botón para arrancar la aplicación. Todo eso lo aportan dos extensiones, y sin ellas los pasos siguientes no te van a funcionar. Puede que en el equipo del aula ya estén puestas; míralo igualmente, que cuesta un minuto.

1. Pulsa **Ctrl+Shift+X** (en macOS, Cmd+Shift+X) o el icono de las piezas de puzle en la barra lateral.
2. Busca **Extension Pack for Java**, de Microsoft, y pulsa **Install**. No es una extensión sino seis: el lenguaje, el depurador, las pruebas, Maven, el explorador de proyectos y las sugerencias de código.
3. Busca **Spring Boot Extension Pack** y pulsa **Install**. Añade el autocompletado de `application.properties` y el panel desde el que se arrancan las aplicaciones Spring.
4. Si aparece un aviso pidiendo recargar la ventana, recárgala.

**Comprueba:** buscando cada uno de los dos en el panel de extensiones, el botón ya no dice *Install* sino que aparecen como instalados. Todavía no vas a ver ningún proyecto Java por ninguna parte, y es normal: aún no has abierto ninguno. Eso llega en el paso 3.

<details class="aside aside--extra">
  <summary>Si trabajas con IntelliJ</summary>
  <p>Sáltate este apartado entero: IntelliJ trae de serie el soporte de Java y de Maven. Lo único que tendrás que hacer es confirmar el JDK 21 cuando abras el proyecto en el paso 3.</p>
</details>

#### Paso 3 · Generar la estructura inicial y abrirla · 20 min

**Spring Initializr** es una web que genera los archivos iniciales de un proyecto Spring Boot. No aloja tu aplicación ni escribe las reglas de tu CRUD.

1. Abre [Spring Initializr](https://start.spring.io). Cada campo determina qué archivos contendrá el ZIP. Rellénalos con estos valores, que son los que utiliza el módulo:

| Campo | Valor y motivo |
| --- | --- |
| Project | **Maven**: es la herramienta de construcción que acabamos de explicar |
| Language | **Java**: el lenguaje que conoces |
| Spring Boot | **4.1.1**: la versión estable, que el generador ofrece marcada por defecto. Ninguna terminada en `SNAPSHOT` ni en `M1` |
| Group | `com.ejemplo`: primera parte del identificador técnico del proyecto |
| Artifact y Name | `gestor`: nombre técnico del proyecto y de su carpeta |
| Package name | `com.ejemplo.gestor`: paquete base de nuestras clases |
| Packaging | **Jar**: formato con el que empaquetaremos la aplicación Java |
| Java | **21** |
| Dependencies | **Spring Web**, que aporta el soporte web y el servidor embebido |

<details class="aside aside--extra">
  <summary>Por qué no se elige una versión en previsualización</summary>
  <p>Junto a la versión estable, el generador ofrece otras marcadas como <code>SNAPSHOT</code> o <code>M1</code>: compilaciones en curso y entregas preliminares, sujetas a cambios y sin garantía de estabilidad. Un proyecto de trabajo toma siempre la estable. Spring Boot mantiene además varias <strong>líneas de versión</strong> en paralelo y retira cada una del generador cuando concluye su soporte abierto, de modo que la lista cambia a lo largo del curso. Eso no afecta a tu proyecto: en el momento de generarlo, la versión queda escrita en el <code>pom.xml</code> y la construcción deja de depender de lo que el generador proponga después. Es el mismo principio de reproducibilidad que Proyecto Intermodular aplica al pipeline.</p>
</details>

Usamos `gestor` como nombre técnico para que las rutas de archivos de estos primeros pasos coincidan en clase. El nombre público y el tema de tu aplicación quedan en el README. La configuración puede contrastarse con la [guía oficial de Spring Boot](https://docs.spring.io/spring-boot/tutorial/first-application/index.html).

2. Pulsa **Generate**. El navegador descarga un ZIP con el nombre del artefacto.
3. **Extrae** el ZIP en la carpeta de trabajo. No abras el código dentro del ZIP.
4. En el IDE elige **Abrir carpeta/proyecto** y selecciona la carpeta que contiene `pom.xml`, no la carpeta `src`. Si pregunta cómo importarlo, elige Maven. Espera a que termine la descarga de dependencias.

En Visual Studio Code es **Archivo → Abrir carpeta**, y después pasan tres cosas que conviene no despachar a golpe de Intro:

- Sale un aviso preguntando **si confías en los autores** de los archivos de esa carpeta. Responde que sí. Si dices que no, el editor entra en modo restringido, Java se queda apagado y nada de lo que viene después va a funcionar.
- Abajo a la derecha aparece un aviso de que está **importando el proyecto Maven**, con una barra de progreso. La primera vez tarda un rato largo: está descargando Spring entero. Déjalo terminar antes de tocar nada.
- En el explorador de archivos, abajo del todo, aparece una sección nueva, **JAVA PROJECTS**, con `gestor` dentro. Ésa es la señal de que la importación ha ido bien.

Ahora que el proyecto está abierto, mira qué Java está usando el editor: **Ctrl+Shift+P**, escribe `Java: Configure Java Runtime` y ábrelo. Se abre una pestaña con las versiones detectadas y tiene que aparecer **21**. Que `java -version` funcionara en la terminal del paso 2 no significa que el editor use esa misma; son dos cosas que se configuran por separado, y es el fallo que más tiempo hace perder en esta sesión.

**Comprueba:** ves `pom.xml`, `src`, `mvnw` y `mvnw.cmd`. Si el IDE muestra otra carpeta `gestor` dentro, entra en ella: la raíz del proyecto es donde está `pom.xml`.

<details class="aside aside--help">
  <summary>Lo que te puedes encontrar en Visual Studio Code, y qué significa</summary>
  <p><strong>No aparece la sección JAVA PROJECTS, o está vacía.</strong> O has abierto una carpeta que no contiene <code>pom.xml</code>, o dijiste que no confiabas en los autores. Cierra la carpeta, vuelve a abrirla y esta vez confía.</p>
  <p><strong>Abajo a la derecha pone «Java: Lightweight Mode», o ves un rayo.</strong> Es un modo reducido en el que Visual Studio Code lee el código pero no lo compila. Pulsa encima y elige <em>Switch to Standard</em>. Hasta que no esté en modo estándar no vas a tener ni errores marcados ni botón para arrancar.</p>
  <p><strong>Los <code>import org.springframework...</code> salen subrayados en rojo.</strong> Casi siempre es que todavía está descargando las bibliotecas; abajo verás la barra de progreso. Espera a que acabe. Si termina y siguen en rojo, Ctrl+Shift+P → <code>Java: Clean Java Language Server Workspace</code> y acepta reiniciar.</p>
  <p><strong>Dice «The JAVA_HOME environment variable is not defined correctly».</strong> El editor no encuentra el JDK. Abre <code>Java: Configure Java Runtime</code> y mira qué versiones detecta; si no sale ninguna, avisa antes de seguir.</p>
</details>

#### Paso 4 · Localizar el código y entender el primer arranque · 15 min

Antes de editar, comprueba que el IDE utiliza el JDK 21 también para este proyecto: que `java -version` funcione en la terminal no configura automáticamente el compilador del IDE. Abre los archivos de la tabla y señala cuál contiene Java, cuál configura Maven y cuál configura la aplicación. No copies el bloque de `GestorApplication` si ese archivo ya coincide con la plantilla: se muestra para leerlo y entenderlo.

| Archivo o carpeta | Qué contiene y qué haces ahora |
| --- | --- |
| `pom.xml` | Configuración de Maven. Localiza `dependencies` y comprueba su contenido con la lista de abajo |
| `src/main/java/com/ejemplo/gestor/GestorApplication.java` | Clase de arranque. Localiza el método `main` |
| `src/main/resources/application.properties` | Ajustes de la aplicación. Hoy puede estar vacío o contener su nombre |
| `src/test/java` | Código de pruebas. Lo utilizaremos en próximas sesiones |
| `.mvn`, `mvnw` y `mvnw.cmd` | Configuración y comandos del wrapper de Maven |

**Comprueba el `pom.xml` antes de seguir.** Con los valores de la tabla anterior, el generador declara exactamente dos dependencias, y de ellas depende que la aplicación arranque como servidor:

```xml
<dependencies>
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-webmvc</artifactId>
	</dependency>

	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-webmvc-test</artifactId>
		<scope>test</scope>
	</dependency>
</dependencies>
```

| Dependencia | Qué aporta |
| --- | --- |
| `spring-boot-starter-webmvc` | Spring MVC y el servidor Tomcat embebido. Es la que mantiene el proceso vivo a la escucha en un puerto; sin ella la aplicación arranca y termina |
| `spring-boot-starter-webmvc-test` | El instrumental de pruebas, en ámbito `test`: JUnit, AssertJ, Mockito y el soporte para probar controladores. No se empaqueta con la aplicación |

Si tu archivo declara otras dependencias, o si le falta la primera, seleccionaste una lista distinta en el generador: vuelve a generarlo con **Spring Web** y solo con ella.

La clase de arranque tendrá esta forma:

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

`main` sigue siendo el punto de entrada que conoces. Su llamada a `SpringApplication.run` pone en marcha Spring Boot. Una **anotación** es una marca que empieza por `@` y aporta información sobre el código: aquí `@SpringBootApplication` identifica la configuración de arranque. Conserva este archivo; el controlador irá en otro.

**Comprueba:** puedes señalar dónde se inicia el programa y dónde se declaran sus dependencias. Todavía no hay ninguna ruta `/hola`: la crearemos en el paso 6.

#### Paso 5 · Arrancar y reconocer una aplicación que escucha · 15 min

1. Abre la terminal del IDE en la carpeta de `pom.xml`. Comprueba su ubicación con `pwd` y lista los archivos con `ls`; ambos comandos funcionan también en PowerShell. Si no ves `pom.xml`, cambia a la carpeta correcta antes de seguir.
2. En **Windows con PowerShell**, ejecuta:

```powershell
.\mvnw.cmd spring-boot:run
```

En **Linux o macOS**, el mismo paso se escribe:

```bash
./mvnw spring-boot:run
```

El primer fragmento llama al wrapper de Maven de esta carpeta. `spring-boot:run` le pide ejecutar la aplicación. Si Linux o macOS dice que no tienes permiso para ejecutar el archivo, aplica `chmod +x mvnw` y repite el comando.

Con las extensiones instaladas aparecen controles para esta operación: encima del método `main` aparecen las palabras **Run | Debug**, y el panel de Spring Boot arranca la aplicación con un play. Hacen lo mismo. En esta sesión se lanza desde la terminal para que la salida sea idéntica para todo el grupo y pueda aprenderse a interpretarla; a partir de la sesión 2 usa el botón si prefieres.

3. Espera a que aparezcan mensajes que contengan `Tomcat started on port 8080` y `Started GestorApplication`. El texto alrededor puede variar. La terminal queda ocupada porque el servidor sigue funcionando: no es un bloqueo.
4. Abre `http://localhost:8080/` en el navegador. Aparecerá una respuesta de error, normalmente una página **Whitelabel Error Page** con estado `404`. Has llegado al servidor, pero todavía no has programado qué debe devolver la ruta `/`.

| Si ocurre esto | Qué revisar |
| --- | --- |
| La aplicación escribe `Started ...Application` y termina con `BUILD SUCCESS` | El proyecto no tiene servidor web: se generó sin la dependencia **Spring Web**. Sin servidor no hay nada que mantenga el proceso vivo, así que termina. Comprueba que `spring-boot-starter-webmvc` está en el `pom.xml` y, si falta, vuelve a generar el proyecto con esa dependencia seleccionada |
| No se encuentra `mvnw.cmd` | La terminal debe estar en la carpeta que contiene ese archivo y `pom.xml` |
| Falla la descarga de una dependencia | Lee el primer error de descarga y revisa la conexión; no borres bibliotecas al azar |
| `Port 8080 was already in use` | Puede haber otra ejecución tuya abierta. Detén esa ejecución con el botón Stop del IDE o Ctrl+C en su terminal y repite |
| El navegador no conecta | Comprueba que aparece `Started`, que el proceso sigue activo y que escribiste `http` y el puerto correcto |

Si otro servicio necesita el puerto 8080, escribe `server.port=8081` en `application.properties`, reinicia y usa 8081 en las direcciones de la práctica. Regístralo en el README.

**Comprueba:** distingues «el programa ha arrancado» de «existe la ruta que he pedido».

#### Paso 6 · Crear una ruta que devuelva un texto · 20 min

Un **controlador** es una clase que agrupa métodos para atender peticiones. Vamos a crear uno dentro del paquete base que Spring Boot revisa al arrancar.

1. En `src/main/java/com/ejemplo/gestor`, crea la carpeta o paquete `controller` desde el IDE. Dentro crea la clase `HolaController`. Su archivo debe quedar en `src/main/java/com/ejemplo/gestor/controller/HolaController.java`.
2. Escribe la clase completa:

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

3. Relaciona cada parte con su función: `package` coincide con la ubicación; los `import` permiten usar las anotaciones; `@RestController` indica que los resultados de los métodos se envían como respuesta; `@GetMapping("/hola")` asocia un GET a esa ruta; `return` proporciona el cuerpo de la respuesta. El nombre del método Java no determina la URL.
4. Guarda el archivo. En la terminal donde corre el servidor pulsa **Ctrl+C**, espera a que vuelva el indicador para escribir y ejecuta otra vez el comando de arranque. No hemos añadido recarga automática: editar y refrescar el navegador no basta para ejecutar el código nuevo.
5. Abre `http://localhost:8080/hola`. Debes leer exactamente la frase de `return`.
6. Cambia la frase por una que presente tu aplicación, guarda, reinicia y recarga. Comprueba que cambia la respuesta.

<details class="aside aside--extra">
  <summary>Qué es exactamente una anotación, y por qué <code>@RestController</code> y no <code>@Controller</code></summary>
  <p>Una anotación no ejecuta nada por sí misma: es <strong>metadato</strong> adherido al código, que permanece en el archivo compilado hasta que algún proceso lo lee. Aquí quien lo lee es Spring durante el arranque.</p>
  <p><code>@SpringBootApplication</code> agrupa tres anotaciones, y una de ellas es <code>@ComponentScan</code>, que activa el <strong>escaneo de componentes</strong>: Spring recorre el paquete de la clase de arranque y sus subpaquetes, localiza las clases marcadas, las instancia y las registra. De ahí que <code>HolaController</code> atienda peticiones sin que nadie lo invoque desde <code>main</code>, y de ahí que deba colgar de <code>com.ejemplo.gestor</code>, porque fuera de ese paquete no se escanea. Las otras dos habilitan la autoconfiguración y el registro de la configuración propia.</p>
  <p><code>@RestController</code> es una anotación compuesta: está meta-anotada con <code>@Controller</code> y <code>@ResponseBody</code>. La diferencia está en cómo se interpreta el valor que devuelve el método. Con <code>@Controller</code> por separado, ese valor se entiende como el <em>nombre de una plantilla</em> que debe renderizarse como HTML; con <code>@RestController</code> se escribe directamente en el cuerpo de la respuesta, que es lo que requiere una API. Si un método devuelve el texto correcto y el servidor responde con un error de vista, la causa es precisamente esa.</p>
</details>

Si obtienes 404, revisa la ruta letra a letra, el reinicio y que `HolaController` esté bajo `com.ejemplo.gestor`. Si el IDE marca un error de Java, corrígelo antes de arrancar; no hace falta cambiar el navegador.

**Comprueba:** puedes recorrer navegador → ruta → método Java → texto de respuesta y señalar tu archivo en ese recorrido.

#### Paso 7 · Ver tu propia petición en el navegador · 15 min

Las **herramientas de desarrollo** del navegador permiten observar las peticiones. Vamos a inspeccionar solo la que acabas de crear, cuyo resultado ya conoces.

1. Con `/hola` abierto, pulsa **F12** o abre el menú del navegador → Herramientas de desarrollo. Elige la pestaña **Red** o **Network**.
2. Deja seleccionado **Todo/All** y recarga con Ctrl+R. El panel registra lo que se solicita mientras está abierto; por eso hay que recargar después de abrirlo.
3. Pulsa la fila cuya dirección acaba en `/hola`. Puede aparecer además `favicon.ico`, el icono de la pestaña: no es nuestra petición y puedes ignorarlo.
4. En **Cabeceras/Headers**, busca URL, método `GET` y estado `200`. Localiza `Content-Type` entre las cabeceras de respuesta: describe el tipo de contenido. En **Respuesta/Response**, lee el texto de tu método.
5. Abre `/ruta-que-no-existe`, selecciona su fila y observa el `404`. Después detén tu servidor y recarga: ahora verás un fallo de conexión, sin respuesta HTTP. Arranca de nuevo y vuelve a `/hola` para dejarlo funcionando.

Guarda estas observaciones en una tabla provisional; la incorporarás al repositorio en el paso 9:

| Situación | Método y ruta | Resultado observado | Explicación |
| --- | --- | --- | --- |
| Servidor encendido, ruta creada | `GET /hola` | Completa estado y texto | Se ejecuta el método del controlador |
| Servidor encendido, ruta no creada | `GET /ruta-que-no-existe` | Completa el estado | No existe un método para esa ruta |
| Servidor apagado | `GET /hola` | Describe el mensaje | No hay un proceso escuchando para responder |

**Comprueba:** sabes localizar método, dirección, estado, cabeceras y cuerpo sin confundirlos con el código Java.

#### Paso 8 · Aplicar el patrón a tu proyecto · 10 min

1. En `HolaController`, debajo del método `hola` y **antes de la última llave de la clase**, añade:

```java
@GetMapping("/estado")
public String estado() {
    return "Servidor en funcionamiento";
}

@GetMapping("/prestamos/resumen")
public String resumen() {
    return "Esta aplicación gestionará los préstamos de material";
}
```

2. Cambia `prestamos` y el texto del segundo método por el recurso principal de tu tema, por ejemplo `/reservas/resumen`. La respuesta describe el proyecto: todavía no cuenta datos ni consulta una base de datos.
3. Guarda, reinicia y abre las dos direcciones completas en el navegador. Anota en tu tabla sus estados y textos.

**Comprueba:** responden tres rutas diferentes y sabes qué método atiende cada una. No copies otra clase completa dentro de `HolaController`: aquí estás añadiendo dos métodos a la clase existente.

#### Paso 8-bis · Comprobar lo que la sesión afirma · opcional

Este paso no introduce contenido nuevo: comprueba con evidencia cuatro afirmaciones que la sesión ha hecho sin demostrar. Está previsto para quien termine antes de tiempo; la prioridad es el paso 9, que cierra la sesión con la primera versión publicada. Deshaz cada alteración antes de continuar.

| Alteración | Resultado esperado | Qué demuestra |
| --- | --- | --- |
| Renombra el método `hola()` como `saluda()`, sin tocar su `@GetMapping` | `/hola` responde igual que antes | El nombre del método Java no determina la URL |
| Comenta la línea `@RestController` y reinicia | `/hola` devuelve 404 | Sin esa anotación la clase compila igual, pero el escaneo de componentes no la registra como controlador y su ruta no existe |
| Añade un segundo método, con otro nombre, anotado también con `@GetMapping("/hola")` | La aplicación no llega a arrancar: el registro informa de `Ambiguous mapping` | La correspondencia entre rutas y métodos se resuelve durante el arranque, no al recibir la petición |
| Añade el método de abajo y compara las cabeceras de ambas rutas | Cada una declara un `Content-Type` distinto | El tipo que devuelve el método determina cómo se escribe la respuesta |

```java
@GetMapping("/anyo")
public int anyo() {
    return 2026;
}
```

Para la última comprobación, abre las herramientas de desarrollo del navegador en la pestaña **Red** y contrasta la cabecera `Content-Type` de las dos respuestas:

| Ruta | Tipo devuelto | Cabecera `Content-Type` |
| --- | --- | --- |
| `/hola` | `String` | `text/plain;charset=UTF-8` |
| `/anyo` | `int` | `application/json` |

Ninguna de las dos ha necesitado configuración alguna: el servidor decide cómo escribir el cuerpo a partir del tipo declarado en el método. Qué componente toma esa decisión, y cómo se gobierna cuando lo que se devuelve es un objeto de tu dominio, es el contenido de la sesión 3.

**Comprueba:** las cuatro alteraciones están deshechas, `/hola` devuelve su texto y la aplicación arranca sin errores en el registro.

#### Paso 9 · Guardar la primera versión en GitHub · 25 min

Un **repositorio** guarda los archivos y su historial. Un **commit** registra una versión local; **push** envía los commits a GitHub. Es el mismo repositorio que utilizaremos en Intermodular para practicar el flujo de trabajo y el despliegue.

Si ya has hecho la primera sesión de Intermodular, estos comandos los has visto con el portfolio. Lo único distinto es que aquí el proyecto ya existe en tu ordenador antes que en GitHub, y por eso se empieza con `git init` en lugar de con `git clone`.

1. En la carpeta de `pom.xml`, crea el archivo `README.md`. El generador no lo incluye: entrega un `HELP.md` con enlaces a la documentación que su propio `.gitignore` excluye del repositorio. Escribe en el README la propuesta del paso 1, el comando de arranque y tus tres rutas.
2. Revisa la tabla de comprobaciones de los pasos 7 y 8. Debe indicar la petición, la respuesta observada y cualquier dificultad pendiente. Explica qué parte de la aplicación produce cada respuesta.
3. Abre `.gitignore`, el archivo que indica a Git qué no debe subir. Comprueba que excluye `target/` (archivos generados al compilar), la configuración local del IDE y `.env` si lo utilizas más adelante. Conserva los archivos del wrapper, incluidos `.mvn/`, `mvnw` y `mvnw.cmd`.

Conviene entender qué queda dentro del repositorio y qué queda fuera, porque determina cómo se recupera el proyecto en cualquier otro equipo:

| Se versiona | No se versiona |
| --- | --- |
| `src`, tu código fuente | `target/`, todo lo que produce la compilación |
| `pom.xml`, que **declara** las dependencias | Las bibliotecas de las que depende el proyecto |
| `mvnw`, `mvnw.cmd` y `.mvn/`, el wrapper | La configuración local del editor |
| `README.md` y `.gitignore` | Credenciales y archivos de entorno |

**Las dependencias no se guardan: se declaran.** Maven las descarga una sola vez y las conserva en el repositorio local de tu equipo, una carpeta `.m2` de tu perfil de usuario que queda fuera del proyecto. Por eso el repositorio ocupa unos pocos kilobytes mientras que las bibliotecas que utiliza suman decenas de megabytes, y por eso lo que se comparte es la declaración y no el contenido descargado.

La consecuencia práctica aparece al llevar el proyecto a otro ordenador: basta clonar el repositorio y ejecutar el arranque con el wrapper. Maven lee el `pom.xml`, resuelve cada dependencia y reconstruye `target/` desde cero. No se copian carpetas entre equipos ni se envían bibliotecas por mensajería: se clona y se ejecuta. Es la misma propiedad que hace reproducible el flujo de integración de Proyecto Intermodular, donde la máquina que construye tampoco conserva nada entre ejecuciones.

**Si aún no hay repositorio del proyecto**, crea uno vacío en GitHub con el botón **New repository**. No añadas allí README ni `.gitignore`: ya existen en tu ordenador. Copia su dirección HTTPS. En la terminal del proyecto, ejecuta cada comando por separado:

```bash
git init -b main
git status
git add .gitignore README.md pom.xml mvnw mvnw.cmd .mvn src
git diff --cached --stat
```

`init` crea el repositorio local, `status` muestra los cambios, `add` prepara los archivos para la versión y `diff --cached --stat` resume lo preparado. Revisa que aparezcan el código y la documentación, sin `target/` ni credenciales. Después crea el commit:

```bash
git commit -m "Completar sesión 01: primera aplicación servidor"
```

Si Git pide identidad, configura tu nombre y correo de autor con `git config user.name "Tu nombre"` y `git config user.email "Tu correo de autor"`, sustituyendo ambos textos por tus datos, y repite el commit.

Conecta el repositorio y sube la versión. **Sustituye la dirección siguiente por la que copiaste de GitHub**:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

Completa el inicio de sesión que solicite Git. La [guía de GitHub para subir código local](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github) desarrolla este procedimiento.

**Si ya hay repositorio en Intermodular**, utiliza su carpeta clonada. Sitúa allí el proyecto sin copiar otra carpeta `.git`; conserva el README existente y complétalo. No repitas `git init` ni `git remote add`: guarda y publica los cambios mediante las ramas y revisiones establecidas en ese módulo.

**Comprueba en GitHub:** abre el README y el controlador. Contrasta su contenido con tu copia local y localiza en el historial el cambio que acabas de guardar. Debes poder recuperar esa versión del proyecto.

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Con tu proyecto abierto, explica para qué utilizas Spring Boot y Maven, señala el método que atiende una de tus rutas y reproduce una respuesta correcta y un 404. Explica qué cambia si detienes el programa. Comprueba también que tu propuesta tiene las entidades y reglas necesarias para seguir ampliándola durante el trimestre.

**Para casa · recuperar el proyecto desde el repositorio**

La entrega de la sesión no termina en el `push`: un repositorio solo sirve si otra persona, u otro equipo, puede partir de él. Compruébalo sobre el tuyo.

1. Clona tu repositorio en una carpeta distinta de la de trabajo, o en otro ordenador si dispones de él: `git clone <la dirección de tu repositorio> gestor-copia`.
2. Antes de ejecutar nada, inspecciona la copia. No existe `target/` ni ninguna biblioteca: solo el código, el `pom.xml` y el wrapper.
3. Abre la carpeta en el editor y espera a que termine de importar el proyecto Maven. Si los `import` aparecen marcados como error, la importación no ha concluido; el código es correcto y lo que falta es que el editor resuelva las dependencias declaradas en el `pom.xml`.
4. Arranca con el wrapper y comprueba que `/hola` responde el mismo texto que en tu carpeta original.
5. Ejecuta `git status` en la copia. Pese a haber compilado, `target/` no aparece como cambio pendiente: el `.gitignore` lo excluye.

**Qué traer a la sesión 2:** la dirección del repositorio clonado y una nota con lo que tuviste que hacer para ponerlo en marcha, incluido cualquier paso que no estuviera en este guion.

<details class="aside aside--extra">
  <summary>Reto · simular un equipo que nunca ha visto Spring</summary>
  <p>En tu propio ordenador las bibliotecas ya están descargadas, de modo que la copia arranca de inmediato y la descarga inicial no vuelve a verse. Para reproducirla, indica a Maven un repositorio local vacío:</p>
  <p><code>.\mvnw.cmd -Dmaven.repo.local=..\m2-limpio spring-boot:run</code> en PowerShell, o <code>./mvnw -Dmaven.repo.local=../m2-limpio spring-boot:run</code> en Linux y macOS.</p>
  <p>Maven descargará en esa carpeta todo lo que declara el <code>pom.xml</code>, que es exactamente lo que ocurre la primera vez en una máquina nueva. Compara cuánto tarda esa ejecución con la siguiente, y consulta el tamaño de la carpeta creada: esa cifra es la que <strong>no</strong> viaja en el repositorio.</p>
</details>



## Sesión 2 · Rutas y primeras consultas del proyecto

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [del repositorio vacío a una url pública](/es/docencia/proyecto-intermodular/ud1-poner-el-circuito-en-marcha/sesion-1/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Ya tienes rutas que devuelven un texto fijo. Hoy el cliente enviará datos en la URL y un mismo método responderá según esos datos. Un parámetro es un valor de entrada del método; Spring lo obtiene de la ruta o de la consulta. Todavía devolveremos texto, sin buscar registros reales.

#### Recibir datos distintos en una misma ruta

El endpoint de ayer siempre responde lo mismo:

```java
@GetMapping("/hola")
public String hola() {
    return "Hola, mundo. Te responde mi servidor.";
}
```

Si mantuviéramos una respuesta fija, no podríamos elegir a quién saludar ni qué incidencia consultar. Para reutilizar el método, el cliente enviará un dato dentro de la petición y el método lo utilizará al construir su respuesta.

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
* Todo llega como **texto**. `pagina=2` no constituye un número, sino la cadena `"2"`. Que acabe siendo un `int` en tu método es trabajo de Spring, no del navegador.
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

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Abrir el proyecto y comprobar el punto de partida · 10 min

Antes de añadir rutas, comprueba que puedes ejecutar la versión de la sesión anterior. En este paso trabajarás con `HolaController`; crearás `SaludoController` en el paso 2.

1. En el IDE, abre la **carpeta del proyecto que contiene `pom.xml`**. Usa tu carpeta habitual de trabajo. Si hiciste la tarea de clonar el repositorio para comprobarlo, evita abrir a la vez las dos copias: podrías editar una y ejecutar la otra.
2. Dentro de `src/main/java`, despliega tu paquete base y su carpeta `controller`. Abre `HolaController.java`. Localiza el método con `@GetMapping("/hola")` y lee su `return`: ese es el texto que vas a comprobar. Si elegiste otro paquete base, utiliza su carpeta y conserva el `package` de tus clases.
3. Arranca la aplicación desde la terminal situada en la carpeta de `pom.xml`, con el comando correspondiente a tu sistema:

**Windows · PowerShell**

```powershell
.\mvnw.cmd spring-boot:run
```

**Linux o macOS**

```bash
./mvnw spring-boot:run
```

Si ya está ejecutándose, detén esa ejecución antes de volver a arrancar. Puedes usar **Stop** si la lanzaste desde el IDE o **Ctrl+C** en la terminal donde se está ejecutando.

4. Espera al mensaje `Started ...Application` y abre **`http://localhost:8080/hola`** en el navegador. Debe aparecer la frase del `return` de tu método, incluida la personalización que hiciste en la sesión 1. Si cambiaste el puerto, úsalo en todas las URL de esta sesión.
5. En la tabla de comprobaciones que guardaste con el proyecto, anota la URL y el texto observado. Para ver también el estado HTTP, abre **F12 → Red/Network**, recarga la página y selecciona la petición a `hola`: debe mostrar **200**.

**Antes de continuar:** el servidor sigue ejecutándose y `/hola` responde con tu texto. Si no conecta, revisa el arranque; si devuelve 404, revisa la ruta y que estés ejecutando el proyecto correcto. Los identificadores y filtros de tu aplicación se elegirán al aplicar los ejemplos en el paso 5.

#### Paso 2 · `@RequestParam` · leer la query string · 30 min

Vas a realizar tres cambios en orden: **crear** una clase con un saludo, **modificar** ese saludo para darle un valor por defecto y **añadir** una consulta con dos parámetros. Prueba cada versión antes de pasar a la siguiente. `HolaController` se conserva.

##### 2.1 · Crear el saludo con un parámetro obligatorio

Crea **`SaludoController.java`** en la misma carpeta que `HolaController.java`. Con el paquete del ejemplo, la ruta completa es:

```text
src/main/java/com/ejemplo/gestor/controller/SaludoController.java
```

Copia esta **clase completa**; si tu paquete base es distinto, adapta la primera línea para que coincida con el de `HolaController`. Si el archivo ya existe, revisa su contenido en lugar de crear otra clase con el mismo nombre.

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

**Guarda el archivo, detén la aplicación y vuelve a arrancarla** como en el paso 1. Repite esa secuencia después de cada cambio de Java: recargar el navegador solo envía otra petición, no ejecuta el código que acabas de editar.

Abre estas URL, una cada vez, y registra el estado HTTP y la respuesta. Cambiar la URL no requiere reiniciar el servidor.

| URL completa | Estado esperado | Respuesta o motivo |
| --- | --- | --- |
| `http://localhost:8080/saludo?nombre=Marc` | 200 | `Hola, Marc.` |
| `http://localhost:8080/saludo?nombre=Ana` | 200 | `Hola, Ana.` |
| `http://localhost:8080/saludo` | 400 | Falta el parámetro obligatorio `nombre`. |
| `http://localhost:8080/saludo?nombre=` | 200 | `Hola, .` El parámetro está presente, pero su texto está vacío. |

<figure class="diagram">
  <figcaption>De la URL al parámetro Java</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Llega <code>GET /saludo?nombre=Marc</code></li>
    <li>Spring localiza el método de <code>/saludo</code></li>
    <li><code>@RequestParam(name = "nombre")</code> indica qué dato leer</li>
    <li>Spring entrega <code>"Marc"</code> al parámetro Java <code>nombre</code></li>
    <li>El método devuelve <code>Hola, Marc.</code></li>
  </ol>
</figure>

`@RequestParam` es obligatorio por defecto. Cuando falta `nombre`, Spring responde **400 Bad Request antes de ejecutar `saludo`**. En el navegador puedes ver una página HTML de error; otro cliente que solicite JSON puede recibir un objeto con `status: 400`. Comprueba el estado en **Red/Network**, sin esperar una apariencia concreta del cuerpo. La consola del servidor también puede indicar que falta `nombre`.

La petición con `?nombre=` permite distinguir **ausencia** de **texto vacío**: exigir que el parámetro exista no exige que contenga un nombre válido.

<div class="rule">
  <p class="rule-label">Nombre del parámetro de consulta</p>
  <p>En <code>@RequestParam(name = "nombre")</code>, <code>name</code> indica la clave que Spring debe buscar en la URL. Escribirla explícitamente evita depender de que la compilación conserve el nombre del parámetro Java.</p>
</div>

##### 2.2 · Sustituir el método para añadir un valor por defecto

En **el mismo archivo `SaludoController.java`**, sustituye únicamente el bloque que empieza en `@GetMapping("/saludo")` y termina en la llave de cierre del método `saludo` por este:

```java
@GetMapping("/saludo")
public String saludo(
        @RequestParam(name = "nombre", defaultValue = "mundo") String nombre) {
    return "Hola, " + nombre + ".";
}
```

Conserva `package`, los tres imports, `@RestController`, la declaración `public class SaludoController` y su última llave. Debe quedar **un solo método para `GET /saludo`**. Guarda, detén y arranca de nuevo la aplicación; después repite estas pruebas:

| URL completa | Estado esperado | Respuesta |
| --- | --- | --- |
| `http://localhost:8080/saludo?nombre=Marc` | 200 | `Hola, Marc.` |
| `http://localhost:8080/saludo` | 200 | `Hola, mundo.` |
| `http://localhost:8080/saludo?nombre=` | 200 | `Hola, mundo.` |

**Compara con la versión anterior:** la petición sin `nombre` deja de producir 400 y la petición con `nombre=` deja de devolver un saludo vacío. `defaultValue` proporciona `"mundo"` en ambos casos y hace que el parámetro sea opcional. Este comportamiento está definido en la [documentación de `RequestParam`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/RequestParam.html). Un texto formado por espacios requiere comprobar su contenido; no equivale a enviar `nombre=`.

<details class="aside aside--extra">
<summary>Consulta · parámetro opcional sin valor por defecto</summary>

La opción `required = false` permite omitir el parámetro sin asignarle un texto alternativo:

```java
@RequestParam(name = "nombre", required = false) String nombre
```

Este fragmento representa la declaración del parámetro de un método. Si no llega, su valor será `null` y el método tendrá que decidir cómo tratarlo. Es otra opción de la anotación; para continuar esta práctica conserva la versión con `defaultValue = "mundo"`.

</details>

##### 2.3 · Añadir una consulta con dos parámetros

Ahora **añade** el siguiente método `buscar` dentro de `SaludoController`, **debajo del método `saludo` y antes de la última llave de la clase**. Conserva `saludo`: atienden rutas distintas. Los imports que ya tienes sirven para ambos métodos. En esta práctica reunimos los ejemplos en la misma clase; el paso 4 enseñará a agrupar las rutas por recurso.

```java
@GetMapping("/incidencias")
public String buscar(
        @RequestParam(name = "estado", defaultValue = "todas") String estado,
        @RequestParam(name = "pagina", defaultValue = "1") int pagina) {

    return "Buscando incidencias con estado " + estado
            + ", página " + pagina;
}
```

Si ya programaste un `GET /incidencias` en otro controlador, elige cuál conservar antes de arrancar: dos métodos registrados para la misma petición pueden impedir el arranque por un mapeo ambiguo (*ambiguous mapping*).

Guarda, detén y vuelve a arrancar. Comprueba las tres peticiones:

| URL completa | Estado esperado | Respuesta o motivo |
| --- | --- | --- |
| `http://localhost:8080/incidencias?estado=abierta&pagina=3` | 200 | `Buscando incidencias con estado abierta, página 3` |
| `http://localhost:8080/incidencias` | 200 | `Buscando incidencias con estado todas, página 1` |
| `http://localhost:8080/incidencias?pagina=abc` | 400 | Spring no puede convertir `abc` al tipo `int` de `pagina`. |

En la primera petición, `&` separa los dos parámetros: `estado` recibe `"abierta"` y `pagina` recibe el entero `3`. En la última, la conversión falla antes de ejecutar `buscar`. Un entero negativo sí puede convertirse a `int`; decidir si es una página admisible requiere una validación adicional.

**Al terminar el paso 2:** `HolaController` conserva `/hola`. `SaludoController` contiene dos métodos: `saludo`, con valor por defecto, y `buscar`, con `estado` y `pagina`. Guarda en tu tabla las comprobaciones de ambas versiones del saludo y de la consulta. Estos métodos devuelven texto construido con los parámetros recibidos; todavía no consultan incidencias ni aplican paginación sobre datos reales.


#### Paso 2-bis · Otros tipos que Spring convierte · 15 min

El paso anterior ha convertido `"3"` en un `int`. El mecanismo no se limita a los números: Spring construye el tipo declarado siempre que sepa interpretar el texto recibido. Añade este método a `SaludoController`, con `import java.time.LocalDate;` entre los imports.

```java
@GetMapping("/informes")
public String informes(
        @RequestParam(name = "desde") LocalDate desde,
        @RequestParam(name = "activo", defaultValue = "true") boolean activo) {

    return "Desde " + desde + " (día " + desde.getDayOfMonth()
            + " del mes " + desde.getMonthValue() + "), activo=" + activo;
}
```

Reinicia y comprueba las cuatro peticiones:

| Petición | Respuesta |
| :--- | :--- |
| `/informes?desde=2026-09-13` | `200` · el booleano toma su valor por defecto |
| `/informes?desde=2026-09-13&activo=false` | `200` · el booleano llega convertido desde el texto |
| `/informes?desde=13-09-2026` | `400` · el formato no es el que `LocalDate` interpreta |
| `/informes` | `400` · falta un parámetro declarado como obligatorio |

Dos observaciones sobre lo que acaba de ocurrir:

* `desde.getMonthValue()` devuelve `9`. Lo que recibe el método no es el texto de la URL, sino un objeto `LocalDate` con sus operaciones disponibles. La conversión no es un cambio de apariencia.
* El formato que se interpreta por defecto es el de la norma **ISO 8601**, `aaaa-mm-dd`. Una fecha escrita como `13-09-2026` produce un `400` por el mismo motivo que `pagina=abc`: la petición no encaja con lo declarado y se rechaza antes de ejecutar el método. Cuando un cliente imponga otro formato, habrá que declararlo de forma explícita en el parámetro.

#### Paso 3 · `@PathVariable` · leer un trozo de la ruta · 20 min

Crea `UsuarioController.java` con el bloque completo. Las llaves de `{id}` pertenecen a la anotación Java: en el navegador escribe un valor concreto, como `/usuarios/3`. El método de rutas anidadas se añade **dentro de esa clase**, antes de su última llave; conserva los métodos existentes mientras las combinaciones de método y ruta sean distintas. Prueba un número y luego texto para observar la conversión a `int`.

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

Prueba `/usuarios/3`, `/usuarios/41`, `/usuarios/999`. Un solo método admite esos tres números y devuelve un texto con cada uno. Todavía no consulta una colección, por lo que no comprueba si existe ese usuario.

Las llaves marcan un hueco: **`{id}` no es texto literal, es una variable**. Lo que aparezca ahí se captura y se entrega al parámetro que lleva ese mismo nombre.

<div class="rule">
  <p class="rule-label">El nombre tiene que coincidir</p>
  <p>El texto entre llaves de la ruta y el <code>name</code> de la anotación deben ser idénticos. Si escribes <code>/usuarios/{id}</code> y anotas <code>@PathVariable(name = "identificador")</code>, Spring no podrá resolver ese argumento al atender la petición. Corrige la coincidencia entre ambos nombres; no lo confundas con un error de conversión del valor.</p>
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

#### Paso 4 · Agrupar rutas con `@RequestMapping` · 15 min

Sustituye la versión anterior de `UsuarioController` por la clase que aparece aquí. Hemos movido el prefijo común a `@RequestMapping`: comprueba que los métodos ya no repiten `/usuarios`, o la dirección resultante sería `/usuarios/usuarios/...`. Después de reiniciar, vuelve a probar listado y detalle para comprobar que la agrupación no ha cambiado sus direcciones.

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

Un `@GetMapping` sin argumento designa la ruta declarada en la clase, sin segmento adicional.

<details class="aside aside--extra">
  <summary>Curiosidad · qué pasa si dos rutas encajan a la vez</summary>
  <p>Imagina que añades <code>/usuarios/nuevo</code> y ya tienes <code>/usuarios/{id}</code>. Una petición a <code>/usuarios/nuevo</code> encaja con las dos.</p>
  <p>Spring no elige al azar ni por orden de escritura: prefiere siempre <strong>la ruta más específica</strong>, y un texto literal es más específico que una variable. Gana <code>/usuarios/nuevo</code>.</p>
  <p>Aun así, mezclar identificadores y palabras en el mismo nivel envejece mal. Cuando lleguemos al diseño REST de la UD3 veremos por qué se evita.</p>
</details>

#### Paso 5 · Las rutas del gestor · 30 min

Construye el controlador de tu entidad principal siguiendo este orden: crea la clase en `controller`, anótala con `@RestController` y `@RequestMapping`, añade el listado y compruébalo; después añade el detalle y compruébalo; por último incorpora los parámetros opcionales y las rutas anidadas. El controlador `ProyectoController` de la tabla es el patrón: en reservas sería `ReservaController` y `/reservas`. Mantén tus nombres en todos los pasos posteriores. Hoy cada método devuelve una frase con los parámetros, no una lista de registros reales.

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

#### Paso 5-bis · Revisión cruzada del diseño de rutas · 10 min

La regla de esta sesión —lo que identifica al recurso va en la ruta, lo que acota una consulta va en la query string— se verifica cuando alguien ajeno al código interpreta la URL. Intercambia con tu pareja **únicamente las URL** de las dos rutas que has diseñado, sin mostrar el controlador.

Responde por escrito sobre las que recibas:

1. Qué devuelve cada una, deducido solo de su forma.
2. Qué dato actúa como identificador y cuál como filtro.
3. Si trasladarías alguno al otro sitio, y qué prueba de la regla lo justifica.

Contrastad después las respuestas con el código. Una URL que la otra persona no logra interpretar sin leer el controlador señala un problema de diseño, no de comunicación: dentro de tres semanas su autor estará en la misma situación.

#### Paso 6 · Comprobar y registrar el resultado del proyecto · 10 min

1. Prueba el saludo con el parámetro ausente, vacío y con un nombre. Con `defaultValue="mundo"`, los dos primeros deben devolver `Hola, mundo.`.
2. Consulta el detalle con `7` y con `abc`: el primero devuelve el texto que has programado y el segundo produce 400 al no poder convertirse a entero. Un número como `999` todavía no permite saber si existe un registro: esa búsqueda aún no está implementada.

#### Criterios de diseño de las consultas GET

La regla de la ruta y la query string resuelve dónde colocar cada dato, pero no agota el diseño de una consulta. El método `GET` tiene un significado fijado por el protocolo, y de ese significado salen los criterios que aplicarás a cada ruta de consulta que escribas durante el curso.

##### Para qué se usa un GET en una aplicación real

Las pantallas de una aplicación de gestión se sostienen sobre un repertorio corto de consultas. Las cuatro rutas del `ProyectoController` cubren las tres primeras filas, y la búsqueda por prioridad y página que has añadido en el paso 5 corresponde a las dos últimas.

| Necesidad de la aplicación | Petición | Forma de consulta |
| :--- | :--- | :--- |
| Mostrar la pantalla de listado | `GET /proyectos` | colección |
| Abrir la ficha de un elemento | `GET /proyectos/7` | recurso individual |
| Recorrer lo que pertenece a ese elemento | `GET /proyectos/7/incidencias` | subcolección |
| Acotar una lista extensa | `GET /incidencias?estado=abierta&prioridad=alta` | filtro |
| Rellenar un desplegable de un formulario | `GET /usuarios?rol=tecnico` | filtro |
| Recorrer una lista larga por partes | `GET /incidencias?pagina=2&tamano=20` | paginación |

Las seis comparten una característica que conviene nombrar antes de seguir: ninguna modifica nada.

##### `GET` es un método seguro

<p class="term">Método seguro</p>

Un método HTTP es *seguro* (*safe*) cuando la petición no solicita ningún cambio en el estado del servidor y se limita a pedir una representación de algo que ya existe. `GET`, `HEAD` y `OPTIONS` son seguros; `POST`, `PUT`, `PATCH` y `DELETE` no lo son. La definición figura en la [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-safe-methods), la norma vigente de la semántica de HTTP.

De esa propiedad depende el comportamiento de toda la infraestructura situada entre el cliente y tu servidor.

<div class="rule">
  <p class="rule-label">Consecuencias de la seguridad del método</p>
  <p>Un <code>GET</code> se repite sin consultar a nadie. El navegador lo reemite al recargar la página y al usar el botón de retroceso, la caché conserva su respuesta, un intermediario lo reintenta cuando la red falla, el navegador lo precarga cuando anticipa que el enlace se va a seguir y los rastreadores de los buscadores recorren cuantas direcciones encuentran publicadas.</p>
  <p>Por ese motivo, una dirección como <code>GET /incidencias/41/cerrar</code> constituye un defecto de diseño y no un atajo cómodo. La incidencia se cerraría al recargar la página, al volver atrás o al abrir el enlace guardado en marcadores, sin que nadie hubiera solicitado esa operación. Las acciones que modifican datos se envían con los métodos que aparecen en la sesión 3.</p>
</div>

##### La URL es el identificador de la consulta

Un `GET` no lleva cuerpo, de modo que la URL contiene todo lo que determina la respuesta. De ahí se derivan dos prácticas.

La primera: **una misma URL debe devolver la misma respuesta mientras los datos no cambien.** Una consulta cuyo resultado dependa de un estado oculto, como el orden en que se hayan pedido otras rutas antes, no se puede cachear, ni guardar en marcadores, ni compartir con otra persona, ni reproducir en un informe de error.

La segunda afecta a la privacidad:

<div class="rule">
  <p class="rule-label">Datos que no pueden viajar en la query string</p>
  <p>La URL queda escrita en el historial del navegador, en los registros de acceso del servidor y de los intermediarios, y en la cabecera <code>Referer</code> que el navegador envía al sitio que se visite a continuación. HTTPS la cifra durante el tránsito, pero no impide que el destino y esos registros la conserven en claro de forma indefinida.</p>
  <p>Por tanto, una contraseña, un token de sesión o un dato personal identificable no se envían como parámetro de consulta. Su lugar son las cabeceras de la petición, que se tratan en la UD9.</p>
</div>

##### Criterios para declarar los parámetros

Tres decisiones se repiten cada vez que escribes la firma de un método de consulta:

* **Obligatorio solo lo imprescindible.** Un parámetro se declara obligatorio cuando la consulta carece de sentido sin él. Para el resto existe `defaultValue`, y cada `400` evitable es una petición que el cliente había construido con una intención razonable.
* **El mismo concepto recibe el mismo nombre en toda la API.** Si la página se llama `pagina` en un controlador, no puede llamarse `page` en el siguiente. Quien consume la API aprende ese vocabulario una sola vez y lo aplica a todos los recursos.
* **Toda colección acaba necesitando un límite superior.** Hoy tus listados devuelven una frase fija y el problema no se manifiesta. Cuando los datos procedan de PostgreSQL en la UD5, un `GET /incidencias` sin acotar recorrerá la tabla entera; la paginación se introduce en la UD7.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación del diseño de una consulta GET</p>
  <ul class="checklist">
    <li>Ninguna ruta contiene un verbo ni produce cambios en los datos.</li>
    <li>Lo que identifica al recurso está en la ruta, y lo que acota la consulta, en la query string.</li>
    <li>Cada parámetro obligatorio lo es porque la consulta no significa nada sin él.</li>
    <li>Los parámetros opcionales declaran un valor por defecto, o su ausencia se comprueba dentro del método.</li>
    <li>El mismo concepto recibe el mismo nombre en todos los controladores.</li>
    <li>Ninguna credencial ni dato personal aparece en la URL.</li>
  </ul>
</div>

Repasa con esta lista las rutas escritas hoy antes de pasar al cierre.


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

Después copia el controlador en tu proyecto y comprueba las cuatro primeras en el navegador. La quinta exige enviar un `POST`, y la barra de direcciones solo emite `GET`. Para esa, abre la terminal integrada del editor y lanza una única orden:

```powershell
curl.exe -i -X POST http://localhost:8080/tareas/5
```

En PowerShell debe escribirse `curl.exe`, con su extensión: `curl` a secas es un alias de `Invoke-WebRequest`, que no admite `-X` y produce otra salida. En Linux y macOS basta `curl`. La opción `-i` muestra la línea de estado y las cabeceras además del cuerpo, que es justo lo que hay que leer aquí. El cliente HTTP que se instala en la sesión 3 hace esto mismo con una interfaz encima. **De las cinco, dos suelen fallarse.** Cuando una predicción resulte equivocada, no basta con corregirla: escribe qué regla habías aplicado mal.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las rutas <code>/saludo</code>, <code>/saludo?nombre=Marc</code> y <code>/usuarios/3</code> funcionando, y sabes provocar el 400.</span></div>
  <div><strong>Si lo tienes</strong><span>El <code>ProyectoController</code> completo con sus cuatro rutas y las dos que has diseñado tú, justificadas.</span></div>
  <div><strong>Reto</strong><span>Las cinco predicciones escritas antes de ejecutar, comprobadas y con los fallos explicados.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>200</code>, con el cuerpo <code>Tarea 5 en formato corto</code>. El parámetro no llega en la petición, de modo que <code>defaultValue</code> lo sustituye; mientras esté declarado, <code>formato</code> nunca es nulo.</p>
  <p>2 · <code>200</code>, con el cuerpo <code>Tarea 5 en formato largo</code>. El valor recibido en la query string sustituye al valor por defecto.</p>
  <p>3 · <code>400 Bad Request</code>. Spring convierte el texto de la ruta al tipo declarado antes de invocar el método; <code>cinco</code> no admite conversión a <code>int</code>, así que la petición se rechaza y el método no llega a ejecutarse.</p>
  <p>4 · <code>404 Not Found</code>, y es una de las dos que suelen fallarse, porque se espera un listado vacío. El controlador declara <code>/tareas/{id}</code> y ninguna ruta para <code>/tareas</code>: el prefijo declarado en la clase no atiende peticiones por sí mismo.</p>
  <p>5 · <code>405 Method Not Allowed</code>, que es la otra. La ruta existe, pero únicamente para <code>GET</code>. El servidor distingue entre no encontrar un recurso y encontrarlo con un método que no admite, distinción sobre la que se construye toda la UD2.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Las rutas de listado y detalle devuelven textos que incorporan los parámetros recibidos. Debe ser posible localizar el método que atendió cada petición; la consulta de objetos reales comienza en la sesión 3.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.

**Antes de cerrar, sube el trabajo a GitHub.** Los controladores de hoy no existen fuera de tu equipo mientras no los publiques, y el historial forma parte de lo que se evalúa en Proyecto Intermodular: una sesión sin rastro en el repositorio no se distingue de una sesión sin trabajo.

```bash
git status
git add .
git commit -m "Completar sesión 02: parámetros de ruta y de consulta"
git push
```

`git status` antes de confirmar evita subir el trabajo a medias: comprueba que aparecen los controladores escritos hoy y que no aparece `target/`, que el `.gitignore` excluye. Si el `push` es el primero desde otro equipo, Git pedirá de nuevo tus credenciales.


## Semana 2 · JSON y primera escritura con un cliente HTTP

## Sesión 3 · JSON y primera escritura con un cliente HTTP

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [issues, tablero y la primera pull request](/es/docencia/proyecto-intermodular/ud1-poner-el-circuito-en-marcha/sesion-2/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Tus rutas ya reciben parámetros, pero responden con frases. Hoy responderán con datos estructurados en JSON y recibirán un objeto enviado por el cliente. Jackson es la biblioteca que convierte entre JSON y objetos Java; veremos ambas direcciones antes de guardar datos en una lista.

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

Un backend no habla con personas: **habla con programas**, y los programas requieren datos estructurados, no frases.

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

Los valores admiten seis tipos, incluidos otro objeto y otro array, que es lo que permite anidar cuanto haga falta:

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

#### Por qué necesitamos un cliente que pueda enviar POST

En este ejemplo se utiliza un controlador temporal con solo este método bajo la ruta `/tareas`. Observa el resultado; crearás tu controlador durante la práctica:

```java
@PostMapping
public String crear() {
    return "Alguien ha hecho un POST";
}
```

Al abrir `http://localhost:8080/tareas` en la barra del navegador, se envía GET. Si el controlador de la demostración solo admite POST, devuelve:

```json
{
  "status": 405,
  "error": "Method Not Allowed",
  "path": "/tareas"
}
```

`405 Method Not Allowed`. La ruta existe, pero no con ese método.

El problema conviene enunciarlo con claridad: **no existe forma de escribir una URL que provoque un POST**. La barra de direcciones siempre hace `GET`. Siempre. No es una limitación que se pueda rodear con un truco.

Si existe también un método GET para esa ruta, el navegador ejecutará ese GET y no aparecerá el 405. Para elegir POST y enviar un cuerpo utilizaremos el cliente HTTP de la práctica.

<figure class="diagram">
  <figcaption>Lo que puede pedir cada cliente</figcaption>
  <ol class="flow flow--before">
    <li><strong>Barra de direcciones:</strong> solo <code>GET</code>, sin cuerpo, sin cabeceras propias</li>
    <li><strong>Cliente HTTP:</strong> cualquier método, con el cuerpo y las cabeceras que decidas</li>
  </ol>
</figure>

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

**Prepara la rama antes de editar.** En Intermodular 2 has protegido `main` también en este backend. Crea aquí una issue para añadir el modelo JSON y la primera escritura, con criterios que permitan comprobar el listado y el POST. Asígnatela. En el ejemplo su número es `12`: sustitúyelo por el real en la rama y, al abrir la PR, en `Closes #12`.

Abre una terminal en la carpeta del backend, donde está `pom.xml`, y comprueba con `git status` que no quedan cambios pendientes. Con el trabajo anterior publicado en `main`, ejecuta:

```bash
git switch main
git pull --ff-only
git switch -c 12-json-y-escritura
```

Si todavía queda una PR de trabajo anterior sin integrar, completa primero su revisión e integración. Durante esta sesión guarda los cambios en esta rama; el [procedimiento de ramas y revisión de Intermodular](/es/docencia/proyecto-intermodular/ud1-poner-el-circuito-en-marcha/sesion-2/) es el mismo para este código Java.

1. Arranca el proyecto y abre una ruta de la sesión 2. Mantén el navegador para comprobar las primeras respuestas; instalarás y usarás Postman o Bruno en el paso dedicado al cliente HTTP.
2. Crea el paquete `model` bajo tu paquete base y localiza el paquete `controller`. Las clases de datos irán en el primero y los métodos HTTP en el segundo.
3. Identifica las dos entidades de tu proyecto y sus controladores. El recorrido utiliza `Tarea` y `Proyecto`: primero comprobarás la salida JSON de ambas; después añadirás la entrada y el almacenamiento a `Tarea` y aplicarás el mismo procedimiento a `Proyecto`.

**Mantén los nombres de tu proyecto.** Si elegiste otro dominio en la sesión 1, anota antes de seguir qué entidad corresponde a `Tarea` y cuál a `Proyecto`, junto con sus clases, campos y rutas. Sustituye esos nombres de forma consistente en el código, las URL y los cuerpos JSON. No necesitas crear un segundo proyecto Spring Boot ni entidades adicionales solo para copiar el ejemplo.

**Localiza tu paquete base.** Es el que aparece en la línea `package` de la clase principal con `@SpringBootApplication`. Los ejemplos usan `com.ejemplo.gestor`: si el tuyo es `com.ejemplo.biblioteca`, utiliza `com.ejemplo.biblioteca.model` y `com.ejemplo.biblioteca.controller`, cambia los imports y guarda los archivos bajo `src/main/java/com/ejemplo/biblioteca/`. Mantén los paquetes `model` y `controller` dentro de ese paquete base.

Durante la práctica, **reiniciar** significa guardar los archivos, detener la ejecución anterior y volver a arrancar la aplicación como en la sesión 1. Espera a que termine el arranque antes de enviar peticiones. Modificar el JSON en el cliente HTTP no requiere reiniciar el servidor.

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

Esta clase utiliza Java sin anotaciones: cuatro atributos privados, dos constructores y métodos para leer y cambiar los valores. Guarda el archivo en `src/main/java/com/ejemplo/gestor/model/Tarea.java`, ajustando el paquete y la entidad según el paso 1. Conserva la correspondencia entre nombre de clase, archivo, atributos y métodos de acceso.

Fíjate solo en dos detalles, porque los dos van a importar:

* El **constructor vacío** se utilizará más adelante en esta misma práctica para construir el objeto a partir del JSON recibido.
* El *getter* de un `boolean` se llama `isCompletada()`, no `getCompletada()`. Es la convención de Java, y tiene consecuencias visibles dentro de un momento.

<details class="aside aside--extra">
  <summary>¿No sería más corto un <code>record</code>?</summary>
  <p>Un <code>record Tarea(int id, String titulo, String prioridad, boolean completada)</code> permite representar y serializar esos datos, pero no proporciona setters para modificarlos. Utilizamos aquí una clase mutable porque la modificaremos en la sesión 4 y la prepararemos para JPA en la UD5. Más adelante usaremos records para DTO.</p>
</details>

#### Paso 3 · Devolver el objeto y ver qué pasa

Crea `TareaController.java` en `src/main/java/com/ejemplo/gestor/controller` con este contenido. Si ya lo creaste para el reto de la sesión 2, edita ese archivo: no declares una segunda clase con el mismo nombre.

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

Recuerda el reparto de la sesión 1. Cuando tu método termina, Spring tiene un valor Java en la mano y tiene que meterlo en el cuerpo de la respuesta. Para eso usa **Jackson**, la biblioteca que entró en el proyecto con `spring-boot-starter-webmvc` sin que la pidieras.

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

#### Paso 4 · Los getters y las claves del JSON en este modelo

El experimento se hace en el modelo, no en el controlador: cambia temporalmente un getter de `Tarea.java`, guarda, reinicia y consulta `/tareas/ejemplo`. Compara las claves del JSON con las que tenía antes. Restaura el getter al terminar para que los pasos de entrada de datos partan del modelo completo. No cambies simultáneamente el nombre del campo y el de la ruta.

En `Tarea`, renombra `getTitulo()` a `getNombre()`. **No toques el atributo**, que sigue llamándose `titulo`.

Escribe qué clave esperas ver en el JSON: ¿`titulo` o `nombre`?

```json
{"id":1,"nombre":"Revisar el login","prioridad":"alta","completada":false}
```

La clave es `nombre`. En este modelo, con atributos privados y sin anotaciones de Jackson, los getters permiten detectar las propiedades de salida. Para estos nombres, `getNombre()` produce `nombre` e `isCompletada()` produce `completada`. Jackson también admite campos públicos, anotaciones y otras configuraciones; aquí comprobamos el comportamiento de la clase que acabas de escribir.

<dl class="worked">
  <dt>Qué significa en la práctica</dt>
  <dd>En este ejemplo, renombrar un <em>getter</em> cambia una clave que ve el cliente, aunque conserves el nombre del atributo privado.</dd>
  <dt>Por qué <code>completada</code> aparece bien</dt>
  <dd>Porque para los <code>boolean</code> la convención es <code>is</code>, y Jackson también quita ese prefijo. Si lo hubieras llamado <code>getCompletada()</code>, la clave seguiría siendo <code>completada</code>. Si lo llamas <code>estaCompletada()</code>, sin prefijo reconocible, <strong>el campo desaparece del JSON</strong> sin ningún error.</dd>
  <dt>El fallo típico que provoca</dt>
  <dd>«Le he puesto el campo a la clase y no sale en el JSON.» Casi siempre es que falta el <em>getter</em>, o que no sigue la convención de nombres.</dd>
</dl>

Deja `getTitulo()` como estaba antes de seguir.

<details class="aside aside--help">
  <summary>Y si quiero que la clave se llame distinta al getter</summary>
  <p>Se puede, con <code>@JsonProperty("titulo_tarea")</code> sobre el <em>getter</em>. Hoy no lo usamos y conviene saber por qué: retocar el modelo para que el JSON salga bonito acaba mezclando dos cosas distintas —cómo guardas los datos y cómo los publicas—.</p>
  <p>La solución adecuada consiste en declarar una clase independiente para lo que se publica. Se denomina DTO y constituye el contenido central de la UD2. Hasta entonces el modelo se devuelve sin transformación.</p>
</details>

#### Paso 5 · Devolver varias tareas

Añade el método de listado al mismo `TareaController`, conservando `/ejemplo`. Si ya tienes un método con `@GetMapping` sin ruta adicional, sustituye ese método: solo debe quedar uno que atienda `GET /tareas`. Importa `java.util.List` al principio del archivo. Esta primera lista contiene objetos escritos en el código para observar un array JSON; en el paso 11 se sustituirá por una lista mutable compartida entre peticiones.

```java
@GetMapping
public List<Tarea> lista() {
    return List.of(
        new Tarea(1, "Revisar el login", "alta", false),
        new Tarea(2, "Actualizar dependencias", "baja", true)
    );
}
```

Guarda y reinicia. Abre `http://localhost:8080/tareas` y comprueba que los corchetes exteriores indican una lista y las llaves delimitan cada objeto.

`GET /tareas` responde:

```json
[{"id":1,"titulo":"Revisar el login","prioridad":"alta","completada":false},
 {"id":2,"titulo":"Actualizar dependencias","prioridad":"baja","completada":true}]
```

El navegador lo mostrará todo seguido en una línea. No se trata de un defecto: nadie ha solicitado que la salida se formatee. En Chrome y Firefox tienes una pestaña de visualización de JSON que lo ordena, y en el trabajo siguiente Postman te lo dará indentado y coloreado.

<div class="rule">
  <p class="rule-label">Objeto o array: la decisión importa</p>
  <p>Una ruta que devuelve <strong>una cosa</strong> —<code>/tareas/3</code>— devuelve un objeto JSON. Una ruta que devuelve <strong>un conjunto</strong> —<code>/tareas</code>— devuelve un array, y lo devuelve <strong>aunque solo haya un elemento, y aunque no haya ninguno</strong>.</p>
  <p>Un array vacío se escribe <code>[]</code>. Nunca <code>null</code>, y nunca un texto diciendo «no hay tareas»: quien te llama espera una lista y sabe perfectamente recorrer una lista de cero elementos.</p>
</div>

#### Paso 6 · Cuando un campo vale null

En `TareaController.java`, localiza el método `ejemplo()` del paso 3 y sustituye únicamente su línea `return` por esta. Conserva el método `lista()` del paso 5:

```java
return new Tarea(1, "Revisar el login", null, false);
```

Guarda, reinicia y abre `http://localhost:8080/tareas/ejemplo`. La respuesta debe contener:

```json
{"id":1,"titulo":"Revisar el login","prioridad":null,"completada":false}
```

La clave aparece con el valor `null`: el campo está presente y no tiene valor. Distingue ese caso de omitir la clave y de enviar una cadena vacía `""`. No son lo mismo, aunque una configuración concreta pueda tratarlos de forma equivalente. Volveremos a esta distinción al validar entradas en la UD3. Al terminar, restaura `"alta"` en esa línea, guarda y reinicia para continuar con el ejemplo inicial.

#### Paso 7 · Preparar la salida JSON de la segunda entidad

Conserva `Tarea.java` y `TareaController.java`: volverás a ellos en el paso 8. Ahora prepara la segunda entidad, `Proyecto` en el ejemplo, en archivos independientes. Escribe primero sus campos y tipos, después el constructor vacío, el constructor con datos y los métodos de acceso. Revisa que una propiedad `nombre` tenga `getNombre()` y `setNombre(...)`.

1. Crea la clase `Proyecto` en el paquete `model`, con al menos: `id`, `nombre`, `descripcion`, `activo` y `numeroDeIncidencias`.
2. En el paquete `controller`, crea `ProyectoController` o edita el que ya preparaste en la sesión 2. Utiliza `@RestController` y `@RequestMapping("/proyectos")`. Sustituye las respuestas de texto de estas dos rutas por objetos, sin duplicar sus métodos:
   * `GET /proyectos` devuelve una lista con tres proyectos inventados.
   * `GET /proyectos/{id}` devuelve **uno solo**, construido con el `id` recibido.
3. Guarda, reinicia y abre `http://localhost:8080/proyectos` y `http://localhost:8080/proyectos/1`. Compara las claves y los valores del JSON con los objetos que construiste. Anota, del panel de red, el código de estado y el `Content-Type`.
4. Escribe en un comentario qué claves exactas tiene tu JSON y de qué método sale cada una.

Añade después a `Proyecto.java` un atributo `private String notaInterna` **sin escribir su getter**. Reinicia, consulta `/proyectos/1` y explica en una frase por qué no aparece. Después retira ese atributo experimental. Deja los dos archivos de `Proyecto` guardados: en el paso 12 les añadirás el almacenamiento. Los pasos 8–11 continúan sobre `TareaController`.

<p class="stage">Postman y la primera escritura</p>

#### Paso 8 · Postman, y solo lo imprescindible

<p class="term">Cliente HTTP</p>

Un programa cuyo único trabajo es construir peticiones a mano y enseñarte la respuesta entera. Es al backend lo que el navegador al frontend: la ventana por la que ves lo que estás construyendo.

Usaremos **Postman** para los ejemplos. Puedes utilizar **Bruno** para enviar las mismas peticiones: elige método y URL, selecciona cuerpo JSON y observa estado, cabeceras y cuerpo de respuesta. En la sesión 7 encontrarás las instrucciones específicas de ambas herramientas para variables y pruebas; sus scripts no son intercambiables.

<div class="rule">
  <p class="rule-label">Hoy Postman es una herramienta, no un tema</p>
  <p>Vamos a dedicarle veinte minutos y vamos a aprender <strong>cuatro cosas</strong>: elegir el método, escribir la URL, enviar un cuerpo JSON y leer la respuesta.</p>
  <p>Postman tiene además colecciones, entornos, variables, <em>scripts</em>, ejecución automatizada y gestión de credenciales. <strong>Nada de eso se toca hoy.</strong> Todo eso llega en la UD2, cuando ya tengas peticiones que merezca la pena guardar y repetir. Aprender la herramienta antes de tener el problema que resuelve es la forma más rápida de olvidarla.</p>
</div>

Instala la aplicación de escritorio de [Postman](https://www.postman.com/downloads/). Hoy puedes utilizar el cliente ligero sin iniciar sesión para enviar peticiones. En la sesión 7 necesitarás una cuenta y un espacio de trabajo para colecciones y entornos, o utilizar Bruno siguiendo su recorrido. Mantén el historial de las peticiones válidas para recuperarlas después.

Mantén el servidor arrancado. Antes de probar nada nuevo, consulta desde Postman el listado que ya funciona en el navegador. Si las respuestas difieren, compara el método, la URL y el puerto antes de cambiar el código.

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

Antes de enviar POST, abre `TareaController.java`. Conserva `ejemplo()` y `lista()` y añade este método dentro de la clase, antes de su última llave. Si ya copiaste el método de la demostración, utiliza ese; no lo dupliques.

```java
@PostMapping
public String crear() {
    return "Alguien ha hecho un POST";
}
```

Añade `import org.springframework.web.bind.annotation.PostMapping;` junto a los demás imports. Guarda y reinicia. En Postman, cambia el método de `GET` a `POST`, mantén `http://localhost:8080/tareas` y deja **Body → none**: esta primera prueba no necesita cuerpo. Pulsa **Send**. Debes recibir `200 OK` y este texto:

```text
Alguien ha hecho un POST
```

Ese método que hace un minuto era inalcanzable acaba de ejecutarse. **Eso es todo lo que Postman aporta hoy**, y es suficiente para trabajar tres semanas.

#### Paso 9 · Recibir datos · `@RequestBody`

Un POST que no recibe nada sirve de poco. Sustituye el método temporal `crear()` por el siguiente; no conserves los dos con la misma ruta POST. Añade `import org.springframework.web.bind.annotation.RequestBody;` al principio del archivo. Guarda y reinicia antes de enviar el JSON.

```java
@PostMapping
public Tarea crear(@RequestBody Tarea tarea) {
    return tarea;
}
```

Este método, de momento, devuelve exactamente lo que recibe. Es un espejo, y es la mejor forma de comprobar que la entrada llega bien antes de hacer nada con ella.

<p class="term">Deserializar</p>

Lo contrario de la serialización que acabas de observar: convertir el texto JSON que llega en el cuerpo de la petición en un objeto Java. También lo hace Jackson.

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

En este modelo con constructor vacío y setters, Jackson puede crear primero la instancia y asignarle después los valores recibidos. Conserva el constructor vacío para seguir este procedimiento. No es un requisito universal de Jackson: otras clases pueden usar records o constructores configurados para recibir las propiedades, pero aquí no necesitas cambiar la forma de construcción.

En el modelo de este ejercicio ofrecemos getters para leer y setters para escribir. Jackson también puede utilizar campos y otras formas de construcción según su configuración: quitar un setter no garantiza que una propiedad deje de admitirse. Mantén los accesos del ejemplo y comprueba el JSON recibido y devuelto.

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

La respuesta debe mostrar `200 OK` y devolver los mismos valores en JSON, aunque cambien el orden de las claves o los espacios. Ha hecho un viaje completo: texto JSON, objeto Java, texto JSON otra vez. Todavía no se guarda nada: `GET /tareas` sigue devolviendo los dos objetos escritos en el código. El almacenamiento se añade en el paso 11.

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

El mismo comportamiento se produce ante una errata. Envía esto:

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

Hasta ahora el POST devolvía el objeto recibido sin almacenarlo. Sustituye el contenido de `TareaController.java` por esta versión, que conserva una lista entre peticiones. El ejemplo incluye los imports y todos los métodos necesarios: no lo pegues dentro de la clase anterior. Mantén el paquete y los nombres de tu dominio acordados en el paso 1. Conserva el modelo `Tarea.java` y los archivos de la segunda entidad.

Este cambio sustituye el listado fijo y el POST anterior, añade la consulta por identificador y retira el método `/ejemplo`. Desde ahora comprobarás `GET /tareas`, `POST /tareas` y `GET /tareas/{id}`. La dirección `/tareas/ejemplo` deja de ser una prueba válida.

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

La lista `tareas` se declara como atributo de la clase, fuera de los métodos, para que el POST y los dos GET accedan a los mismos datos. `tareas.add(tarea)` incorpora el objeto recibido; el listado devuelve la lista y el bucle de `detalle()` busca una tarea por su identificador. Si declararas una lista nueva dentro de cada método, no compartirían los registros.

**Guarda y reinicia una vez antes de empezar.** En Postman, utiliza la base `http://localhost:8080`. Para el POST, recupera el JSON válido del paso 9, con `"id": 1`, y comprueba **Body → raw → JSON**. Ejecuta estas cuatro peticiones **en este orden, sin reiniciar ni editar código entre ellas**, y predice cada respuesta antes de pulsar **Send**. En esta versión las cuatro responden con `200 OK`:

| # | Petición | Qué debe pasar |
| :---: | :--- | :--- |
| 1 | `GET /tareas` | `[]`, la lista vacía |
| 2 | `POST /tareas` con la tarea 1 | Devuelve la tarea creada |
| 3 | `GET /tareas` | Ahora sale un array con una tarea |
| 4 | `GET /tareas/1` | Sale esa tarea sola, como objeto |

Cuando la cuarta responda, comprueba la diferencia con el paso 9: **el POST ha cambiado los datos que devuelven los GET posteriores**. Antes de pasar a la segunda entidad, verifica que recuperas el título y la prioridad que acabas de enviar.

##### Estado de la aplicación y pérdida de datos al reiniciar

HTTP trata cada petición como un intercambio independiente, pero la aplicación puede conservar datos entre peticiones. Con la configuración de este ejercicio, Spring reutiliza la misma instancia del controlador y su lista mientras la aplicación sigue ejecutándose.

Detén ahora la aplicación, vuelve a arrancarla y envía `GET /tareas`. Debe devolver `[]`: la lista se crea de nuevo al arrancar y los datos anteriores solo estaban en la memoria del proceso. La persistencia en una base de datos se incorporará en la UD5. Vuelve a enviar el POST válido si necesitas recuperar la tarea para otra comprobación.

##### Consulta de un identificador inexistente

Envía `GET http://localhost:8080/tareas/999`, asegurándote de no haber creado una tarea con ese identificador. Observa el estado `200 OK` y el cuerpo vacío. El bucle termina sin encontrar la tarea y el método devuelve `null`.

Anótalo como defecto conocido: la respuesta debería ser `404 Not Found` para indicar que el recurso no existe. En la UD2 aprenderás a establecer ese estado. Distingue este cuerpo vacío del array `[]` que devuelve un listado sin elementos.

<details class="aside aside--help">
  <summary>Diagnóstico de errores durante las comprobaciones</summary>
  <table>
    <thead><tr><th>Resultado observado</th><th>Primera comprobación</th></tr></thead>
    <tbody>
      <tr><td>Conexión rechazada o ausencia de respuesta HTTP</td><td>Comprueba que la aplicación haya terminado de arrancar y que la URL utilice el puerto mostrado en la consola. Si el puerto 8080 está ocupado, detén la ejecución anterior antes de arrancar otra.</td></tr>
      <tr><td>La aplicación no arranca y muestra <code>Ambiguous mapping</code></td><td>Busca dos métodos con la misma combinación de ruta y método HTTP. Al sustituir un ejemplo, elimina la versión anterior; GET y POST sí pueden compartir la ruta.</td></tr>
      <tr><td><code>404 Not Found</code> en una ruta que debería existir</td><td>Compara la URL con <code>@RequestMapping</code> y la anotación del método. Comprueba también que el controlador esté dentro del paquete base y que hayas reiniciado tras editarlo.</td></tr>
      <tr><td><code>400 Bad Request</code> al enviar el POST</td><td>Revisa comillas dobles, comas y tipos de los valores del cuerpo. Recupera primero el JSON válido del paso 9.</td></tr>
      <tr><td><code>415 Unsupported Media Type</code></td><td>Selecciona <strong>Body → raw → JSON</strong> y comprueba que la petición envía <code>Content-Type: application/json</code>.</td></tr>
      <tr><td>POST correcto, pero el listado no contiene la tarea</td><td>Comprueba que <code>crear()</code> ejecute <code>tareas.add(tarea)</code>, que ambos métodos usen la lista declarada como atributo y que no hayas reiniciado entre peticiones.</td></tr>
    </tbody>
  </table>
</details>

#### Paso 12 · Aplicar el patrón a la segunda entidad de tu proyecto

Retoma `Proyecto.java` y `ProyectoController.java`, que dejaste preparados en el paso 7. Conserva los campos y accesos del modelo. En su controlador, aplica el almacenamiento que acabas de comprobar con `Tarea`; mantén también funcionando el controlador de tareas. Usa estos criterios para comprobarlo:

1. Sustituye la lista inventada por un `ArrayList` vacío, como atributo del controlador.
2. Deja funcionando `GET /proyectos`, `GET /proyectos/{id}` y `POST /proyectos`. El listado debe devolver la lista compartida, el detalle debe buscar en ella y el POST debe añadir el objeto recibido. Sustituye el detalle inventado del paso 7 por esa búsqueda.
3. Guarda y reinicia. Comprueba las tres rutas en Postman siguiendo la misma secuencia de cuatro pasos de antes, sin reiniciar entre envíos, y anota el código de estado de cada una. Utiliza un cuerpo JSON con los campos de `Proyecto`, no los de `Tarea`.
4. Envía un POST con **un campo mal escrito a propósito** y anota qué llega y qué responde.

Para el modelo propuesto en el paso 7, puedes empezar con este cuerpo en `POST http://localhost:8080/proyectos` y recuperar después el registro con `GET http://localhost:8080/proyectos/1`:

```json
{
  "id": 1,
  "nombre": "Gestor de tareas",
  "descripcion": "Organizar las tareas del equipo",
  "activo": true,
  "numeroDeIncidencias": 0
}
```

Ajusta las claves y los valores si tu segunda entidad pertenece a otro dominio. Al terminar, ambos controladores deben conservar y consultar sus propios registros.

#### Paso 13 · Comprobar y registrar el resultado del proyecto

1. Envía un POST con un objeto JSON válido y consulta el listado con GET sin reiniciar. Debe aparecer el objeto; en esta primera versión el identificador aún puede venir del cliente.
2. Reinicia y vuelve a consultar: los datos añadidos desaparecen porque estaban en memoria. Conserva la petición válida y otra con JSON mal formado, que debe producir 400.

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
  <div><strong>Comprobación del reto</strong><span>El JSON predicho coincide con la respuesta y puedes explicar cada propiedad.</span></div>
  <div><strong>Si lo tienes</strong><span>El modelo <code>Proyecto</code> completo con sus dos rutas, y explicado por qué el campo sin getter no aparece.</span></div>
  <div><strong>Reto</strong><span>El JSON de <code>Incidencia</code> predicho entero antes de ejecutarlo, con las cuatro trampas identificadas.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver la solución del reto</summary>
  <p>El JSON es <code>{"id":7,"titulo":"Caída del servidor","nivel":3,"urgente":true}</code>.</p>
  <p><strong>El <em>getter</em> renombrado:</strong> <code>getNivel()</code> devuelve el atributo <code>prioridad</code>, y la clave que sale es <code>nivel</code>. El nombre del atributo no interviene.</p>
  <p><strong>El método sin prefijo:</strong> <code>autor()</code> no empieza por <code>get</code> ni por <code>is</code>, de modo que no se reconoce como <em>getter</em>.</p>
  <p><strong>El atributo sin <em>getter</em>:</strong> <code>autor</code> no aparece en el JSON por la razón anterior, y además valdría <code>null</code>, porque el constructor no lo asigna.</p>
  <p><strong>El <em>getter</em> sin atributo:</strong> <code>isUrgente()</code> no corresponde a ningún campo y aun así produce la clave <code>urgente</code>, con el valor calculado <code>true</code>. Lo que se publica son los métodos, no el estado.</p>
</details>

##### Reto · Diagnóstico de tres respuestas

Un compañero te enseña estas tres respuestas de su API y te pregunta qué le pasa. Para cada una, escribe **la causa más probable** y **qué le pides que compruebe**, sin ver su código:

1. Hace un `POST` y recibe `415`.
2. Hace un `POST`, recibe `200`, y en el JSON de vuelta todos los campos están a `null` o a `0` menos uno.
3. Hace un `POST` y recibe `200`, pero el `GET` siguiente devuelve `[]`.

Después provoca las tres en tu proyecto para confirmar tus hipótesis. La tercera es la más interesante: hay al menos dos formas distintas de conseguirla.

<div class="practice-levels">
  <div><strong>Objetivo esencial de la sesión</strong><span>Las dos entidades de tu proyecto admiten POST y conservan registros en memoria, consultables mediante listado y detalle. Has comprobado un JSON mal formado, un tipo de contenido incorrecto y la pérdida de datos al reiniciar.</span></div>
  <div><strong>Comprobación adicional</strong><span>Un segundo registro conserva datos distintos del primero y ambos se recuperan por su id sin confundir sus respuestas.</span></div>
  <div><strong>Reto</strong><span>Las tres respuestas diagnosticadas y reproducidas, con dos causas distintas para la tercera.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver la solución del reto</summary>
  <p>1 · Falta la cabecera <code>Content-Type: application/json</code>: el servidor no acepta un cuerpo cuyo tipo desconoce. Comprueba el desplegable del cuerpo en Postman, que debe estar en <code>JSON</code> y no en <code>Text</code>.</p>
  <p>2 · Las claves del JSON no coinciden con los <em>setters</em> del modelo, casi siempre por una errata o por un campo renombrado. Las claves que no se reconocen se descartan en silencio, y el único campo que llega es el único escrito bien. Pídele el JSON enviado y la lista de <em>setters</em> de su clase.</p>
  <p>3 · Hay dos causas posibles. La primera: el método del POST devuelve el objeto recibido sin añadirlo a la lista. La segunda: la aplicación se ha reiniciado entre las dos peticiones, y la lista vive en la memoria del proceso. Pídele que repita las dos peticiones seguidas sin reiniciar, para distinguir un caso del otro.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Las peticiones de alta y consulta funcionan sin editar el código entre envíos. Debe ser posible explicar la conversión entre JSON y Java, y por qué los datos se pierden al reiniciar. En la sesión 4 el servidor pasará a asignar el identificador.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Comprobación de lo aprendido · 3 minutos, sin mirar los apuntes</p>
  <ol>
    <li>¿De dónde salen los nombres de las claves del JSON?</li>
    <li>¿Qué hace falta para que un campo de tu clase aparezca en la respuesta?</li>
    <li>¿Qué devuelve una ruta de listado cuando no hay ningún elemento?</li>
    <li>¿Qué significa serializar?</li>
    <li>¿Por qué el modelo necesita un constructor sin argumentos?</li>
    <li>¿Qué cabecera debe acompañar a un POST con cuerpo JSON, y qué ocurre si falta?</li>
    <li>¿Qué hace el servidor con una clave que no existe en la clase?</li>
    <li>¿Qué se pierde al reiniciar la aplicación, y por qué?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · En el modelo de esta práctica, de los getters: <code>getTitulo()</code> produce <code>titulo</code> e <code>isCompletada()</code> produce <code>completada</code>. Otras configuraciones o anotaciones de Jackson pueden cambiar cómo se detectan y nombran las propiedades.</p>
  <p>2 · Que tenga <em>getter</em> y que su nombre siga la convención. Un método llamado <code>autor()</code> o <code>estaCompletada()</code> no lo es, y el campo desaparece sin ningún error.</p>
  <p>3 · Un array vacío: <code>[]</code>. Nunca <code>null</code> ni un mensaje de texto.</p>
  <p>4 · Convertir un objeto que está en memoria en texto transmisible, en nuestro caso JSON.</p>
  <p>5 · En el modelo utilizado, permite crear el objeto antes de asignarle los valores recibidos. Es la forma de construcción elegida para esta práctica; Jackson también admite otras, como records o constructores configurados para recibir las propiedades.</p>
  <p>6 · <code>Content-Type: application/json</code>. Si falta, el servidor responde <code>415 Unsupported Media Type</code>. En Postman se pone sola al elegir JSON en el desplegable del cuerpo.</p>
  <p>7 · Se ignora en silencio, sin error y sin aviso. Por eso una errata en un nombre de campo deja ese valor a <code>null</code> y la petición parece correcta.</p>
  <p>8 · Todo lo guardado. La lista vive en la memoria del proceso, y al reiniciar el proceso se crea de nuevo, vacía.</p>
</details>

**Antes de cerrar, publica la rama y abre su PR.** Comprueba que estás en la rama creada al inicio, con su número real de issue, y que `target/` está excluido por `.gitignore`.

```bash
git status
git add .
git diff --cached
git commit -m "Anadir modelo JSON y primera escritura"
git push -u origin 12-json-y-escritura
```

Revisa el contenido preparado con `git diff --cached` antes de confirmar. Abre la PR hacia `main`, incluye `Closes #12` con el número real y explica qué peticiones permiten comprobar el listado y la escritura. Tu pareja revisa la rama y ejecuta esas peticiones en su copia del backend; debe detener cualquier otra aplicación que ocupe el puerto 8080 antes de arrancarla. Corrige sobre la misma rama si hace falta y fusiona después de la revisión. Todavía no se exige un despliegue público ni el check de HTML del portfolio.

Los commits deben reflejar cambios comprensibles durante el trabajo; no necesitas limitarte a uno al final de la sesión. El resultado evaluable es el código y sus comprobaciones en Servidor, y el recorrido de la issue, la rama y la revisión en Intermodular.


## Sesión 4 · Primera versión CRUD en memoria

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [issues, tablero y la primera pull request](/es/docencia/proyecto-intermodular/ud1-poner-el-circuito-en-marcha/sesion-2/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Ya puedes añadir y listar objetos en memoria. Hoy completas la consulta individual, la sustitución y el borrado. El identificador permitirá distinguir registros y pasará a asignarlo el servidor. PUT sustituye los datos de un recurso; DELETE solicita su eliminación.

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

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

**Continúa con el flujo del backend.** Comprueba que la PR de la sesión 3 está revisada e integrada. Crea una issue para completar el CRUD en memoria, indicando las operaciones que comprobarás. En los comandos se usa el número `13`: sustitúyelo por el número real de tu nueva issue.

En la carpeta del backend, con `git status` sin cambios pendientes:

```bash
git switch main
git pull --ff-only
git switch -c 13-crud-en-memoria
```

Realiza los cambios de hoy en esa rama. No vuelvas a enviar código directamente a `main`: se integra mediante una PR, como has practicado en Intermodular.

1. Abre el controlador y la clase del modelo utilizados en la sesión 3. Arranca y reproduce el alta y el listado con tu cliente HTTP.
2. Localiza la lista que guarda los objetos y el método POST. Ahí revisarás la asignación de identificadores; conserva las rutas que ya funcionan.
3. Prepara dos objetos con datos diferentes. Guarda las peticiones de alta para recrearlos después de cada reinicio, ya que todavía no hay base de datos.

#### Paso 2 · El primer defecto · el id lo pone el cliente

Antes de modificar el POST, reinicia para partir de la lista vacía de la sesión 3. Reproduce primero el fallo de los identificadores elegidos por el cliente con estas peticiones:

1. `POST /tareas` con `"id": 1` y el título que quieras.
2. `POST /tareas` otra vez, **también con `"id": 1`** y otro título.
3. `GET /tareas/1`.

Tienes dos tareas distintas con el mismo identificador, y la consulta solo encuentra una: la primera que aparece en la lista. La otra existe y es inalcanzable.

<div class="rule">
  <p class="rule-label">Quién decide el identificador</p>
  <p>El identificador de un recurso <strong>lo asigna siempre el servidor</strong>, nunca quien lo crea. El cliente no puede saber qué ids están libres, no puede coordinarse con los demás clientes, y no tiene ningún motivo para que le importe.</p>
  <p>Lo que envía el cliente es el <em>contenido</em> de la tarea. Lo que devuelve el servidor es la tarea <em>ya creada</em>, con su id puesto. Por eso un <code>POST</code> devuelve el objeto: es la única forma que tiene quien llama de enterarse del identificador.</p>
</div>

Ahora corrige el POST. En `TareaController`, conserva la lista existente, añade a su lado `private int siguienteId = 1;` y sustituye únicamente el método `crear` por esta versión:

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

Guarda y reinicia para eliminar los registros duplicados de la prueba anterior. Crea dos tareas sin enviar `id`: deben recibir identificadores distintos. Envía además `"id": 999` y comprueba que el servidor lo sustituye. La prueba de borrar y crear llegará después de implementar DELETE; el contador conserva su valor solo mientras el proceso sigue en marcha.

#### Paso 3 · `PUT` · sustituir una tarea entera

Añade el PUT dentro del controlador y los imports de `PutMapping` y `RequestBody` si faltan. Para probarlo, crea primero una tarea y copia el id devuelto: sustituye por ese número el `{id}` de la URL. Envía los campos editables completos, ejecuta el PUT y después un GET de detalle. La comprobación consiste en observar el nuevo contenido conservando la identidad del registro.

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

#### Paso 4 · Completar consulta individual, listado y borrado

Conserva el GET de detalle de la sesión 3 y el POST y PUT que acabas de comprobar. Sustituye el GET de listado por el siguiente e importa `RequestParam`. El parámetro `Boolean` puede valer `null`, lo que permite distinguir «sin filtro» de `false`:

```java
@GetMapping
public List<Tarea> lista(
        @RequestParam(name = "completada", required = false) Boolean completada) {
    if (completada == null) {
        return tareas;
    }
    List<Tarea> resultado = new ArrayList<>();
    for (Tarea tarea : tareas) {
        if (tarea.isCompletada() == completada) {
            resultado.add(tarea);
        }
    }
    return resultado;
}
```

Añade DELETE e importa `org.springframework.web.bind.annotation.DeleteMapping`:

```java
@DeleteMapping("/{id}")
public void eliminar(@PathVariable(name = "id") int id) {
    tareas.removeIf(tarea -> tarea.getId() == id);
}
```

`removeIf` elimina los elementos que cumplen la condición. En este caso compara su id con el de la ruta. Guarda, reinicia y recrea los registros con POST. Comprueba listado sin filtro, filtro `true`, filtro `false` y borrado seguido de listado. No conserves dos GET con la misma ruta ni declares otra lista dentro de un método.

| Método y ruta | Recibe | Devuelve |
| :--- | :--- | :--- |
| `GET /tareas` | Nada | El array de todas las tareas |
| `GET /tareas?completada=true` | Filtro opcional | Solo las que coincidan |
| `GET /tareas/{id}` | El id en la ruta | Esa tarea como objeto |
| `POST /tareas` | La tarea en el cuerpo | La tarea creada, con su id asignado |
| `PUT /tareas/{id}` | El id en la ruta y la tarea en el cuerpo | La tarea sustituida |
| `DELETE /tareas/{id}` | El id en la ruta | Nada |

Requisitos que se comprueban:

1. El identificador lo asigna el servidor y no se repite durante esta ejecución, ni después de borrar una tarea. Tras reiniciar, la lista y el contador comienzan de nuevo.
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

Para este escenario concreto, reinicia una vez y comprueba que el listado está vacío. Ejecuta las diez peticiones sin reiniciar entre ellas. Así los ids 1 y 2 corresponden a las altas indicadas. Anota estado y cuerpo y predice cada resultado antes de enviar.

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
| 10 | `POST /tareas` · una tercera | Recibe id **3**: no reutiliza el 1 borrado ni el 2 que sigue existiendo |

Después del paso 10, consulta el listado: debe contener dos registros con ids distintos, 2 y 3. Si calculas el nuevo id con `tareas.size() + 1`, obtendrás 2 y duplicarás el registro existente. La prueba debe detectar también ese caso, no solo que se reutilice el 1.

<div class="rule">
  <p class="rule-label">Guarda estas diez peticiones</p>
  <p>No las borres al terminar. En la UD2 aprenderás a agruparlas en una colección, ponerles nombre, sacar la dirección del servidor a una variable y ejecutarlas todas de una vez. Esta lista de diez pasos es el primer borrador de esa colección, y es también la primera versión de lo que en la UD7 serán tests automatizados de Java.</p>
</div>

#### Paso 6 · Lo que tu API todavía hace mal

Este apartado no constituye un ejercicio de autocrítica, sino el índice de las cuatro unidades siguientes. Comprueba tú mismo cada punto y anota qué responde.

| Prueba esto | Lo que pasa | Lo correcto | Dónde se arregla |
| :--- | :--- | :--- | :--- |
| `GET /tareas/999` | `200` con cuerpo vacío | `404 Not Found` | UD2 |
| `POST` con `{}` | Crea una tarea sin título | `400` explicando qué falta | UD3 |
| `POST` correcto | Responde `200` | `201 Created` | UD2 |
| `POST` con `"completada": "quizás"` | `400` sin explicación útil | Un error legible | UD3 |
| Reiniciar la aplicación | Se pierde todo | Los datos siguen ahí | UD5 |
| Un campo interno del modelo | Se publica sin querer | Solo se publica lo que decidas | UD3, con DTO |

Que sepas enumerar estos seis defectos vale tanto como haber hecho funcionar la API. **Saber qué le falta a lo que has construido es la parte difícil de este oficio.**

#### Paso 7 · Preparar la evidencia de esta versión

Sube a tu repositorio del módulo:

1. El proyecto completo, arrancable con `mvnw spring-boot:run`.
2. El resultado real de las diez peticiones y las diferencias que hayas corregido.
3. Una explicación breve de estas tres cuestiones:
   * **Decisiones.** Por qué el id lo pone el servidor y por qué el filtro va en la query string.
   * **Defectos conocidos.** Los seis de la tabla anterior, con tus palabras.
   * **Una pregunta.** Algo que hayas hecho funcionar sin acabar de entender del todo por qué.

Conserva la pregunta pendiente para contrastarla con las explicaciones de la siguiente unidad.

<div class="practice-levels">
  <div><strong>Objetivo esencial</strong><span>Las dos entidades tienen su CRUD y filtro opcional comprobados. La secuencia de diez peticiones verifica también que borrar y crear no duplica identificadores.</span></div>
  <div><strong>Comprobación adicional</strong><span>Un filtro sin coincidencias devuelve un array vacío; quitar el filtro recupera todos los registros existentes.</span></div>
  <div><strong>Trabajo sobre tu dominio</strong><span>Completa las mismas operaciones en la segunda entidad, ya iniciada en la sesión 3. Comprueba sus ids, sustitución y borrado. Ambas se utilizarán en la sesión 6.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el cliente no sabe qué ids están ocupados ni puede coordinarse con los demás clientes. Dos peticiones simultáneas elegirían el mismo y una de las dos tareas quedaría inalcanzable.</p>
  <p>2 · <code>PUT</code> sustituye el recurso entero por lo que envías, así que lo que no mandas se pierde. <code>PATCH</code> modifica solo los campos que envías.</p>
  <p>3 · En cuanto borras algo. Si creas dos tareas, borras la primera y creas otra, el tamaño vuelve a ser 1 y repartes un id que ya existe.</p>
  <p>4 · Porque utiliza una consulta GET para cambiar datos. Los clientes pueden repetir o precargar consultas suponiendo que no modifican el estado; reserva las escrituras para los métodos HTTP correspondientes.</p>
</details>

#### Paso 8 · Comprobar y registrar el resultado del proyecto

1. Ejecuta en orden crear, listar, consultar por id, modificar, consultar de nuevo y borrar. Comprueba los datos después de cada escritura, no solo el estado HTTP.
2. Crea dos registros sin elegir sus ids: el servidor debe asignar valores diferentes. Consulta un id ausente y anota la limitación que aún tenga la respuesta; los estados se ajustarán en la UD2.

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

El CRUD de ambas entidades funciona mediante las peticiones del cliente HTTP y el README declara que pierde los datos al reiniciar. La colección automatizada se construirá en la sesión 7; hoy deben quedar comprobados los efectos de cada operación.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.

**Antes de cerrar, publica la rama y abre su PR.** Utiliza el nombre de rama con el número real de la issue creada al inicio.

```bash
git status
git add .
git diff --cached
git commit -m "Completar CRUD en memoria"
git push -u origin 13-crud-en-memoria
```

Antes del commit, revisa que solo preparas los archivos del proyecto y que `target/` queda excluido. En la PR hacia `main`, incluye `Closes #13` con el número real y los pasos para comprobar crear, listar, consultar, modificar y borrar. Solicita la revisión sobre la rama, atiende las correcciones y fusiona cuando se hayan comprobado los criterios. Comprueba además que el README integrado declara la pérdida de datos al reiniciar. La revisión se realiza sobre el backend local; su puesta en producción llegará más adelante en Intermodular.


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
| Tomcat embebido | El servidor, incluido como biblioteca dentro de tu propia aplicación |
| Maven | Quien descarga las dependencias, compila y empaqueta |
| Dependencia | Una biblioteca que tu proyecto necesita, declarada en el `pom.xml` |
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
| Jackson | La biblioteca que hace las dos conversiones, leyendo *getters* y *setters* |
| Cliente HTTP | Postman o Bruno: construye peticiones a mano y enseña la respuesta entera |
| CRUD | Las cuatro operaciones: crear, leer, actualizar y borrar |

### Comprobación final del producto

Antes de dar la unidad por cerrada, tu proyecto tiene que superar esto:

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación final · con el proyecto delante</p>
  <ul class="checklist">
    <li>La aplicación arranca y la consola muestra la línea de Tomcat con el puerto.</li>
    <li>Los cinco métodos de la mini-API responden sobre una lista en memoria.</li>
    <li>La secuencia de diez peticiones de la sesión 4 pasa entera y está en la tabla de comprobaciones.</li>
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
| El modelo interno se publica íntegro y sin transformación | UD3, con DTO |
| Una tarea sin título se acepta sin protestar | UD3, con validación |
| Los errores no explican qué corregir | UD3 |
| Al reiniciar se pierde todo | UD5, con PostgreSQL |

El trabajo de estas dos semanas demuestra aquí su utilidad: cuando en la UD2 aparezcan `ResponseEntity`, los códigos de estado y la colección de pruebas, no será material nuevo cayendo del cielo. Será la respuesta a problemas que **ya has visto fallar en tu propio proyecto**.

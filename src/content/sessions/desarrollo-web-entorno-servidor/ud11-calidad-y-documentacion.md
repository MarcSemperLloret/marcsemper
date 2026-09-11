---
title: "Calidad, observabilidad y documentación"
label: "UD11 · Verificar"
section: "ud-11"
order: 11
lang: "es"
summary: "Consolidar en una estrategia lo que se ha ido probando desde la UD4, y dejar la aplicación observable, documentada y revisada por otros."
duration: "6 horas · 1 semana · 2 sesiones de 3 h"
modality: "Taller de proyecto · 25 min de explicación, 140 min de trabajo y 15 min de cierre"
deliverable: "Pruebas y documentación técnica que permiten comprobar y utilizar el backend."
date: "2026-09-09"
outcomes:
  - "Explicar qué cubre y qué no cubre la suite de pruebas existente."
  - "Completar los casos límite que faltan y medir la cobertura con criterio."
  - "Dejar trazas útiles y depurar un fallo con ellas."
  - "Publicar documentación técnica y someterla a una revisión por pares."
requirements:
  - "La aplicación completa con sus tests de la UD4, la UD5 y la UD7."
priorKnowledge:
  - "JUnit, tests de repositorio y MockMvc."
  - "OpenAPI y diseño de API."
---

<p class="lead">La calidad se viene trabajando desde las primeras pruebas. Aquí se completa la estrategia, se diagnostican defectos y se revisa que documentación y versión real coincidan.</p>

## Semana 23 · Estrategia de pruebas y diagnóstico

## Sesión 45 · Estrategia de pruebas y diagnóstico

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [verificar archivos y efectos externos](/es/docencia/proyecto-intermodular/ud11-preparar-la-entrega-y-recuperacion/sesion-23/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

El producto funciona, pero necesitas saber qué protegen sus pruebas y cómo investigar un fallo. Cobertura indica qué código se ejecutó, no si está bien comprobado. Un identificador de correlación permite reconocer en los logs los mensajes de una misma petición.

#### La falacia de la cobertura: Cantidad frente a Calidad

En muchas empresas se impone un objetivo numérico ciego: *«Todo el código debe tener al menos un 80 % de cobertura de tests»*.

Cumplir ese número es fácil y peligroso:
* Puedes escribir un test que invoque un método con datos ideales, no añada ninguna aserción (`assertNotNull`, `assertEquals`) y el reporte de cobertura marcará el 100 % de esas líneas en verde.
* La cobertura de líneas solo mide si el compilador pasó por esa instrucción; **no mide si el test verificó el resultado, si probó valores nulos ni si comprobó qué pasa cuando la base de datos o la red fallan**.

<div class="rule">
  <p class="rule-label">La ley de los casos límite</p>
  <p><strong>El código no se rompe en el camino feliz; se rompe en las fronteras.</strong></p>
  <p>Una suite de pruebas profesional no busca probar mil veces lo evidente. Busca probar con rigor las condiciones de frontera: valores cero o negativos, cadenas vacías, desbordamientos de longitud, caracteres no ASCII, duplicados en concurrencia y excepciones transaccionales.</p>
</div>

#### La Pirámide de Pruebas en Spring Boot

Para que una batería de pruebas sea rápida, mantenible y fiable, se organiza siguiendo la **Pirámide de Pruebas**:

<figure class="diagram">
  <figcaption>La Pirámide de Pruebas en el ecosistema Spring</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Base: Tests Unitarios puros (JUnit 5 + Mockito) · Ejecución en milisegundos</li>
    <li>Corte Web: @WebMvcTest (Rutas, validación, HTTP, Spring Security)</li>
    <li>Corte Datos: @DataJpaTest (Consultas SQL, repositorios, constraints de DB)</li>
    <li>Cima: @SpringBootTest (Integración de extremo a extremo con servidor real)</li>
  </ol>
</figure>

1. **Tests Unitarios puros (Base):** No levantan el contexto de Spring. Mockean las dependencias con Mockito (`@Mock`, `@InjectMocks`). Prueban la lógica matemática, los cálculos de negocio y los adaptadores de integración en milisegundos.
2. **Tests de Corte (*Slice Tests*):** Levantan solo un fragmento del framework:
   * `@WebMvcTest`: Arranca solo controladores, serialización Jackson y filtros de seguridad.
   * `@DataJpaTest`: Arranca solo Hibernate, entidades y repositorios contra una base de datos de pruebas.
3. **Tests de Integración completa (Cima):** Levantan la aplicación completa con `@SpringBootTest(webEnvironment = RANDOM_PORT)`. Son lentos y pesados; se reservan para verificar los 3 o 4 flujos de negocio más críticos del sistema.

#### La amnesia del servidor en producción

Cuando desarrollas en tu portátil, si algo falla miras la terminal de IntelliJ o VS Code y ves la excepción de inmediato.

En producción la realidad es muy distinta:
* La aplicación corre en un contenedor Docker o en un servidor Linux en la nube a cientos de kilómetros.
* Un usuario llama diciendo: *«Hace 10 minutos la web me dio un error al guardar una factura»*.
* Si tu código no registró trazas útiles con contexto (quién era, qué identificadores envió, qué falló), **no puedes hacer nada más que conjeturas**.

<div class="rule">
  <p class="rule-label">Por qué System.out.println() está prohibido</p>
  <p><strong>System.out no es observabilidad: es ruido incontrolado.</strong></p>
  <p>1. Es una operación síncrona bloqueante que ralentiza los hilos de Tomcat.<br>
     2. No incluye marcas temporales, nombre de clase ni identificador de hilo.<br>
     3. No se puede desactivar o filtrar por gravedad sin recompilar el código.<br>
     4. No permite escribir en archivos rotativos ni exportar a sistemas centralizados (Elasticsearch, Grafana Loki).</p>
</div>

#### Los 5 niveles estándar de log

En Spring Boot utilizamos la interfaz **SLF4J** respaldada por el motor **Logback**:

```java
private static final Logger log = LoggerFactory.getLogger(MiServicio.class);
```

| Nivel de log | Cuándo se utiliza | Ejemplo en nuestro proyecto |
| :--- | :--- | :--- |
| **`ERROR`** | El sistema no pudo completar una operación requerida y necesita atención técnica. | Base de datos inaccesible, fallo de escritura en disco, error 500 no controlado. |
| **`WARN`** | Ocurrió una anomalía pero el sistema pudo recuperarse o degradar el servicio. | Timeout con API de Open-Meteo aplicando degradación, token expirado, intento de acceso sin rol. |
| **`INFO`** | Hitos relevantes del ciclo de vida normal de la aplicación. | Arranque del sistema, proyecto creado, tarea asignada, fichero subido con éxito. |
| **`DEBUG`** | Información detallada de diagnóstico útil para desarrolladores. | Parámetros recibidos en DTO, tiempo de ejecución de una consulta, cabeceras procesadas. |
| **`TRACE`** | Inspección forense extrema paso a paso (muy ruidoso). | Volcado byte a byte de tramas de red o inicialización interna de beans del framework. |

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Ejecuta los tests actuales y abre el servicio con reglas más relevantes. Enumera casos de negocio que quedarían sin detectar si el código estuviera mal.
2. Localiza `pom.xml`, la configuración de logs y los tests. El informe de JaCoCo se generará a partir de la ejecución indicada en el taller.
3. Prepara dos peticiones distinguibles y un fallo de desarrollo. Los usarás para comprobar que el identificador permite seguir cada recorrido.

#### Paso 2 · Auditoría de cobertura con JaCoCo y tests parametrizados

Vamos a ampliar las pruebas que ya existen. JaCoCo mide qué código se ejecuta; no decide si las aserciones comprueban el comportamiento correcto.

1. Añade este plugin dentro de `build/plugins` en `pom.xml`, junto al plugin de Spring Boot, y sincroniza Maven:

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution><goals><goal>prepare-agent</goal></goals></execution>
        <execution>
            <id>report</id><phase>verify</phase>
            <goals><goal>report</goal></goals>
        </execution>
    </executions>
</plugin>
```

2. Ejecuta `.\mvnw.cmd verify` en PowerShell (`./mvnw verify` en Linux/macOS). Si falla un test previo, corrígelo antes de analizar cobertura. Abre `target/site/jacoco/index.html` y localiza una clase de tu servicio y una regla aún sin comprobar.
3. Crea `src/test/java/com/ejemplo/gestor/ProyectoBoundaryTest.java` para probar el `ProyectoRequest(nombre, descripcion)` usado en la sesión 31. Si tu DTO ya tiene más componentes, conserva el mismo caso y rellena los restantes con datos válidos. No cambies el DTO del producto para encajar el test.

```java
package com.ejemplo.gestor;

import com.ejemplo.gestor.dto.ProyectoRequest;
import jakarta.validation.Validation;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ProyectoBoundaryTest {
    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   ", "\t", "\n"})
    void nombreVacioIncumpleLaValidacion(String nombre) {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var errores = factory.getValidator().validate(
                new ProyectoRequest(nombre, "Descripción válida"));
            assertTrue(errores.stream().anyMatch(error ->
                error.getPropertyPath().toString().equals("nombre")));
        }
    }

    @ParameterizedTest
    @ValueSource(strings = {"Portal", "Gestor de préstamos", "Reservas de aula"})
    void nombreValidoNoProduceErrores(String nombre) {
        try (var factory = Validation.buildDefaultValidatorFactory()) {
            var errores = factory.getValidator().validate(
                new ProyectoRequest(nombre, "Descripción válida"));
            assertTrue(errores.isEmpty());
        }
    }
}
```

`@ParameterizedTest` ejecuta el método una vez por dato. Validator comprueba las anotaciones del DTO directamente: no arranca HTTP ni llama al servicio. No esperes que una llamada Java normal al servicio active automáticamente `@Valid` del controlador.

4. Ejecuta solo esta clase con `.\mvnw.cmd test "-Dtest=ProyectoBoundaryTest"`. Retira temporalmente `@NotBlank` de nombre para comprobar que los casos nulos o en blanco detectan la regresión; restáurala y deja los tests en verde.
5. Para las coordenadas que añadiste en la sesión 41, prepara por separado latitud (-90 a 90) y longitud (-180 a 180). Comprueba cada límite aceptado y un valor justo fuera. No uses el límite de longitud como si fuera el de latitud. Añade estas entradas al test de tu DTO real, conservando válidos todos los otros campos.
6. Reutiliza el test de clonación de la sesión 25 para verificar rollback. Prepara el proyecto original con sus tareas en `gestor_test`, llama al servicio inyectado por Spring y provoca el fallo controlado usado en aquel taller. El test que observa el rollback no debe envolver esa llamada en su propia transacción: comprueba desde una transacción posterior que no quedaron filas nuevas. Retira el fallo de producción y conserva el caso mediante el doble de prueba correspondiente.
7. Clasifica en el análisis de las pruebas las evidencias reales: DTO/validación, servicio/reglas, repositorio/SQL, controlador/HTTP y seguridad. Para cada regla pendiente escribe primero entrada, resultado esperado y capa responsable; después añade la prueba. Repite `verify` y compara qué regla ha quedado cubierta, además del porcentaje.

#### Paso 3 · Ejecutar y analizar el informe JaCoCo

Ejecuta el ciclo de verificación de Maven:

```bash
./mvnw clean verify jacoco:report
```

1. **Localiza el informe generado:** Entra en la carpeta `target/site/jacoco/` y abre el archivo `index.html` en tu navegador.
2. **Inspecciona las columnas:**
   * **Element:** Paquetes y clases del proyecto.
   * **Line Coverage:** Porcentaje de líneas ejecutadas.
   * **Branch Coverage:** Porcentaje de ramas lógicas (`if`, `switch`, operadores ternarios) recorridas.
3. **Análisis crítico:**
   * Entra en `ProyectoService` o `ClimaAdapter`.
   * Si una línea aparece en **amarillo**, significa que solo se probó una rama del condicional (ej: se probó el caso `if (true)` pero nunca el caso `else`).
   * Comprueba cómo tras añadir los tests de casos límite, las ramas críticas pasan a color **verde completo**.

#### Paso 4 · Las cuatro familias de caso límite que siempre faltan

Cuando alguien dice «no sé qué más probar», casi siempre es porque solo ha pensado en valores razonables. Recorre estas cuatro listas sobre cada regla de negocio de tu aplicación y aparecerán los huecos solos:

<dl class="worked">
  <dt>1 · Los bordes de un rango</dt>
  <dd>Si el presupuesto máximo son 150.000 €, hay que probar <strong>149.999, 150.000 y 150.001</strong>. El error de programación más común del mundo es confundir <code>&gt;</code> con <code>&gt;=</code>, y solo el valor exacto del borde lo detecta. Lo mismo con longitudes: un campo de 3 a 80 caracteres se prueba con 2, 3, 80 y 81.</dd>
  <dt>2 · El vacío y la ausencia</dt>
  <dd>No son lo mismo y se comportan distinto: una cadena vacía, una cadena de espacios, un <code>null</code> y un campo que ni siquiera consta en el JSON. En las colecciones, el caso equivalente es la lista vacía, que invalida cualquier cálculo de media o de máximo.</dd>
  <dt>3 · Lo que rompe el formato</dt>
  <dd>Acentos y eñes, emojis, comillas simples dentro de un texto, cadenas de 10.000 caracteres, números negativos donde esperas positivos, y una fecha de fin anterior a la de inicio. Ninguno es rebuscado: todos llegan de usuarios reales.</dd>
  <dt>4 · El orden y la repetición</dt>
  <dd>Hacer dos veces la misma operación, deshacer algo que no se ha hecho, borrar un recurso que ya se borró, cerrar un proyecto ya cerrado. La pregunta en todos: ¿es un error, o debería ser idempotente y responder lo mismo?</dd>
</dl>

Cuando varios de estos casos comparten la misma lógica, `@ParameterizedTest` con `@ValueSource` o `@CsvSource` te ahorra escribir el mismo test cinco veces cambiando un número.

#### Paso 5 · Añadir pruebas para las reglas y casos límite del servicio

1. **Haz primero el inventario, antes de escribir ningún test.** Una tabla con una fila por regla de negocio de tu aplicación y tres columnas: qué la comprueba hoy, qué caso límite le falta, y qué pasaría en producción si fallase. Sin ese inventario, escribirás tests de lo que ya está probado, que es lo que hace subir la cobertura sin mejorar nada.
2. Revisa en el informe JaCoCo qué métodos o ramas de `TareaService` tienen menos del 70 % de cobertura de **ramas** —no de líneas—, y crúzalo con tu inventario.
3. Aplica las cuatro familias de arriba a las reglas de tarea: valores en el borde del presupuesto, título vacío o con solo espacios, título de 10.000 caracteres, fecha de fin anterior a la de inicio, transición de estado repetida y asignación a un usuario inactivo.
4. Escribe los tests correspondientes, usando `@ParameterizedTest` donde se repita la lógica, y vuelve a compilar hasta que la cobertura de ramas supere el 80 %.
5. **Comprueba el rollback**, que es el caso límite que casi nadie prueba: provoca un fallo a mitad de una operación que escribe en dos tablas y verifica en PostgreSQL que **no ha quedado nada** de la primera escritura. Una transacción que no revierte deja datos corruptos que ningún test de código detecta.
6. Cierra con la pregunta honesta que ordena toda la unidad: **¿qué parte de tu aplicación sigue sin estar probada, y por qué has decidido dejarla así?** Esa respuesta, escrita, vale más que un porcentaje: es el punto de partida de la sesión 46 y un apartado de la memoria de la UD12.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Tienes el inventario de reglas con sus huecos identificados; la cobertura de ramas de <code>service</code> supera el 80 %; cada rango numérico está probado en sus tres valores frontera; has comprobado al menos un <code>rollback</code> mirando la base de datos; y puedes decir qué queda sin probar y por qué.</dd>
</dl>

<p class="stage">Logging y depuración</p>

#### Paso 6 · Correlación de peticiones con MDC (Mapped Diagnostic Context)

Cuando 50 usuarios lanzan peticiones simultáneas, las líneas de log de todos los hilos se intercalan en el mismo archivo.

Para no volverse loco buscando qué línea corresponde a qué petición, utilizamos el patrón **`Correlation ID`** mediante el **MDC** de SLF4J:
* Al entrar una petición, un filtro genera un identificador único (ej: `req-7f3a1b`).
* Se almacena en el hilo actual con `MDC.put("correlationId", id)`.
* **Cada línea de log que se emita en cualquier servicio o repositorio imprimirá automáticamente ese identificador**.
* Se añade la cabecera `X-Correlation-ID: req-7f3a1b` en la respuesta HTTP para que el cliente pueda reportar ese código ante cualquier incidencia.

#### Paso 7 · Configuración de observabilidad con MDC

Crea `config/CorrelationIdFilter.java` y comprueba sus imports antes de configurar Logback. El filtro asigna el identificador al entrar y limpia el MDC en `finally`, incluso si se produce una excepción. Añade el archivo `logback-spring.xml` en resources sin duplicar otra configuración de logs activa. Después incorpora los mensajes a los métodos existentes del servicio; no reemplaces el servicio por un ejemplo que omite sus reglas. Haz dos peticiones y comprueba que sus identificadores son diferentes y no se mezclan.

```java
package com.ejemplo.gestor.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // Debe ejecutarse antes que cualquier filtro de seguridad o negocio
public class CorrelationIdFilter extends OncePerRequestFilter {

    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    public static final String MDC_KEY = "correlationId";

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Si el cliente envía un ID lo respetamos; si no, generamos un UUID corto
        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString().substring(0, 8);
        }

        try {
            // 2. Registramos el identificador en el contexto de diagnóstico del hilo
            MDC.put(MDC_KEY, correlationId);

            // 3. Devolvemos la cabecera en la respuesta para trazabilidad del cliente
            response.setHeader(CORRELATION_ID_HEADER, correlationId);

            filterChain.doFilter(request, response);

        } finally {
            // 4. Limpieza obligatoria para evitar fugas en pools de hilos reutilizados
            MDC.remove(MDC_KEY);
        }
    }
}
```

Creamos el archivo `src/main/resources/logback-spring.xml` configurando consola y archivo rotativo con inclusión del `[correlationId]`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- Patrón de log con fecha, hilo, identificador MDC, nivel, logger y mensaje -->
    <property name="LOG_PATTERN"
              value="%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] [%X{correlationId}] %-5level %logger{36} - %msg%n"/>

    <!-- Salida por consola -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- Archivo rotativo: guarda un fichero por día, máximo 30 días o 100MB por archivo -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/aplicacion.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>logs/aplicacion-%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
            <maxFileSize>10MB</maxFileSize>
            <maxHistory>30</maxHistory>
            <totalSizeCap>1GB</totalSizeCap>
        </rollingPolicy>
        <encoder>
            <pattern>${LOG_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- Niveles de log según entorno -->
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>

    <!-- Nivel específico para nuestro paquete de negocio -->
    <logger name="com.ejemplo.gestor" level="DEBUG"/>
</configuration>
```

<div class="rule">
  <p class="rule-label">Privacidad y cumplimiento normativo (GDPR / OWASP)</p>
  <p>Nunca registres contraseñas en claro, tokens JWT completos ni datos personales sensibles en los logs. Usa identificadores o máscaras:</p>
</div>

```java
package com.ejemplo.gestor.service;

import com.ejemplo.gestor.dto.ProyectoRequest;
import com.ejemplo.gestor.dto.ProyectoResponse;
import com.ejemplo.gestor.model.Proyecto;
import com.ejemplo.gestor.repository.ProyectoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ProyectoService {

    private static final Logger log = LoggerFactory.getLogger(ProyectoService.class);
    private final ProyectoRepository proyectoRepository;

    public ProyectoService(ProyectoRepository proyectoRepository) {
        this.proyectoRepository = proyectoRepository;
    }

    public ProyectoResponse crearProyecto(ProyectoRequest request, String usuario) {
        log.info("Solicitud de creación de proyecto '{}' por usuario '{}'", request.nombre(), usuario);

        if (proyectoRepository.existsByNombre(request.nombre())) {
            log.warn("Rechazada creación de proyecto: el nombre '{}' ya existe en base de datos", request.nombre());
            throw new IllegalArgumentException("Ya existe un proyecto con el nombre: " + request.nombre());
        }

        Proyecto nuevo = new Proyecto();
        nuevo.setNombre(request.nombre());
        nuevo = proyectoRepository.save(nuevo);

        log.debug("Proyecto persistido en base de datos con id={}", nuevo.getId());
        return new ProyectoResponse(nuevo.getId(), nuevo.getNombre());
    }
}
```

#### Paso 8 · Relacionar una petición fallida con sus mensajes de log

1. **Lanza una petición en Bruno:**
   * Haz un `POST /api/v1/proyectos` intentando crear un proyecto con un nombre que ya existe.
   * En la respuesta de Bruno, revisa la pestaña **Headers**:
     Comprueba la cabecera devuelta: `X-Correlation-ID: a1b2c3d4`.
2. **Abre el archivo `logs/aplicacion.log`:**
   Filtra las líneas buscando ese código:
   ```text
   2026-09-03 08:30:15.120 [http-nio-8080-exec-3] [a1b2c3d4] INFO  c.e.p.s.ProyectoService - Solicitud de creación de proyecto 'Hospital Norte' por usuario 'admin'
   2026-09-03 08:30:15.135 [http-nio-8080-exec-3] [a1b2c3d4] WARN  c.e.p.s.ProyectoService - Rechazada creación de proyecto: el nombre 'Hospital Norte' ya existe en base de datos
   2026-09-03 08:30:15.142 [http-nio-8080-exec-3] [a1b2c3d4] INFO  c.e.p.e.GlobalExceptionHandler - Error 409 Conflict devuelto al cliente: Ya existe un proyecto con el nombre: Hospital Norte
   ```
3. **El poder de la correlación:**
   Aunque hubiera 50 usuarios operando en paralelo, con un simple `grep a1b2c3d4 aplicacion.log` reconstruyes la película completa de esa llamada en 5 segundos sin mezclarte con las acciones de otros clientes.

#### Paso 9 · Integrar el Correlation ID en las respuestas RFC 7807

Abre el manejador creado en la UD3, aunque en otros ejemplos se llame GlobalExceptionHandler: no crees un segundo manejador. En el auxiliar que construye ProblemDetail añade `problem.setProperty("correlationId", MDC.get("correlationId"))`, utilizando el nombre real de tu variable e importando `org.slf4j.MDC`. Reproduce un 409 y comprueba que el id del cuerpo coincide con el de la cabecera y los logs. Si el fallo ocurre en un filtro de seguridad, deberá utilizar su propio manejador de respuesta.

#### Paso 10 · Comprobar y registrar el resultado del proyecto

1. Añade pruebas para los casos ausentes y verifica que fallan al introducir temporalmente el defecto que deberían detectar; restaura después el código correcto.
2. Reproduce las dos peticiones y localiza cada una por su identificador. El mensaje público debe permitir relacionar el fallo sin revelar trazas internas ni datos sensibles.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Umbrales de cobertura mínimos obligatorios en CI/CD

En proyectos profesionales se configura Maven para que la compilación **falle automáticamente** si un desarrollador introduce código nuevo sin tests suficientes.

Configura una regla de verificación en `jacoco-maven-plugin`:
1. Añade una ejecución con el objetivo `check` en `pom.xml`.
2. Establece un límite mínimo de cobertura de ramas (*BRANCH*) del 75 % a nivel de paquete de servicios (`com.ejemplo.gestor.service.*`).
3. Comprueba que si borras un test crítico, `./mvnw verify` termina con código de error y aborta el empaquetado del archivo JAR.

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Incluye esta explicación en el registro de la sesión dentro del repositorio de GitHub, junto al código y las comprobaciones. La entrega es el enlace al repositorio y al commit de la sesión.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Plugin JaCoCo integrado en <code>pom.xml</code> e informe HTML generado con <code>./mvnw verify</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Tests parametrizados con <code>@ParameterizedTest</code> cubriendo valores límite y verificación de rollback.</span></div>
  <div><strong>Reto</strong><span>Regla obligatoria de umbral de cobertura (<code>jacoco:check</code>) bloqueando compilaciones sin tests.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Mide si todas las posibles decisiones lógicas booleanas de una estructura condicional (ambas ramas de un if, todos los case de un switch) han sido ejecutadas y evaluadas en los tests.</p>
  <p>2 · Porque los tests unitarios con Mockito se ejecutan en pocos milisegundos sin levantar el contenedor Spring ni la base de datos, permitiendo ciclos de feedback casi instantáneos.</p>
  <p>3 · Inyecta automáticamente dos casos de prueba: un valor null y una cadena vacía ("") para verificar que el método receptor los gestiona adecuadamente.</p>
  <p>4 · Que ante un error a mitad de una operación compuesta, todas las modificaciones previas se revierten (rollback), garantizando que o se guarda todo o no se guarda nada.</p>
</details>

##### Reto · Enmascaramiento automático de datos sensibles

Diseña un filtro o conversor personalizado en Logback (`PatternLayoutEncoder` o `CompositeConverter`):
1. Investiga cómo aplicar expresiones regulares en Logback para sustituir números de tarjetas bancarias o emails por valores enmascarados (ej: `j***@empresa.com`).
2. Comprueba que si un programador despistado escribe `log.info("Usuario: {}", usuario)` la contraseña o datos protegidos nunca lleguen en texto plano al archivo de disco.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Sustitución de <code>System.out</code> por <code>Logger</code> de SLF4J y niveles clasificados con criterio.</span></div>
  <div><strong>Si lo tienes</strong><span>Filtro de <code>CorrelationIdFilter</code> con MDC y rotación de archivos en <code>logback-spring.xml</code>.</span></div>
  <div><strong>Reto</strong><span>Inclusión de <code>correlationId</code> en respuestas RFC 7807 y enmascaramiento automático de datos sensibles.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque Tomcat reutiliza hilos de su pool de trabajo; si no limpias el MDC, la siguiente petición procesada por ese mismo hilo heredaría el ID de la petición anterior causando contaminación de trazas.</p>
  <p>2 · WARN indica una contingencia o comportamiento anómalo donde el sistema pudo seguir funcionando o aplicar una degradación; ERROR indica que una operación requerida falló de forma irrecuperable.</p>
  <p>3 · Evita que el archivo de log crezca hasta agotar el disco duro de la máquina, comprime los históricos antiguos (.gz) y facilita las búsquedas delimitadas por fecha.</p>
  <p>4 · Permite al ingeniero buscar directamente ese código alfanumérico en el archivo de logs y obtener exactamente las líneas de traza de esa petición aisladas de la concurrencia de otros usuarios.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

La corrección tiene evidencia reproducible y los logs no exponen credenciales ni datos innecesarios.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Sesión 46 · Documentación y revisión de calidad

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [verificar archivos y efectos externos](/es/docencia/proyecto-intermodular/ud11-preparar-la-entrega-y-recuperacion/sesion-23/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Ya has revisado pruebas y diagnóstico. Hoy comprobarás que la documentación representa la API real. Una revisión de código contrasta implementación y criterios de calidad; necesita peticiones reproducibles y observaciones concretas, no solo preferencias de estilo.

#### La documentación viva frente a los documentos muertos

Un documento Word o PDF con la descripción de una API queda obsoleto en el mismo instante en que un programador cambia el nombre de un atributo en un DTO.

La solución de la industria es la **documentación viva y autogenerada a partir del código**:
* Con la librería `springdoc-openapi-starter-webmvc-ui`, Spring Boot inspecciona los controladores, las anotaciones de validación (`@NotNull`, `@Size`) y las reglas de seguridad.
* Genera la especificación **OpenAPI 3 (JSON)** y una interfaz web interactiva en `/swagger-ui.html`.

Para que esa documentación sea profesional y no una cáscara vacía, debemos enriquecerla con **semántica, ejemplos realistas y respuestas de error documentadas**:

```java
@Operation(
    summary = "Crear un nuevo proyecto",
    description = "Registra un nuevo proyecto en el sistema. Requiere rol JEFE_PROYECTO o ADMINISTRADOR."
)
@ApiResponses({
    @ApiResponse(responseCode = "201", description = "Proyecto creado con éxito"),
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (RFC 7807)"),
    @ApiResponse(responseCode = "401", description = "No autenticado (falta token Bearer)"),
    @ApiResponse(responseCode = "403", description = "Permisos insuficientes para esta acción"),
    @ApiResponse(responseCode = "409", description = "Ya existe un proyecto con ese nombre")
})
```

#### Metodología de Revisión de Código por Pares (Peer Code Review)

El software no se evalúa únicamente por si compila y pasa los tests: se evalúa por su **mantenibilidad a largo plazo**.

Durante un Code Review, los desarrolladores revisan el código de sus compañeros siguiendo una **rúbrica técnica estructurada en 5 dimensiones**:

<figure class="diagram">
  <figcaption>Las 5 dimensiones de la revisión técnica de código</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Arquitectura: Separación estricta de capas sin fugas</li>
    <li>2. Seguridad: Autenticación, RBAC y sanitización</li>
    <li>3. Resiliencia: Timeouts en red y degradación</li>
    <li>4. Rendimiento: JPA sin N+1 y transacciones acotadas</li>
    <li>5. Calidad: Tests de casos límite y logs con MDC</li>
  </ol>
</figure>

#### Rúbrica de Auditoría Técnica de Código Backend

Utiliza esta lista de comprobación para auditar la aplicación:

| Dimensión | Pregunta de auditoría | Señal de alarma (*Red Flag*) | Criterio de excelencia |
| :--- | :--- | :--- | :--- |
| **Arquitectura** | ¿Están los DTOs desacoplados de las entidades JPA? | Un controlador recibe o devuelve una entidad `@Entity` de JPA directamente. | DTOs inmutables (`record`) para peticiones y respuestas; mapeo en servicios. |
| **Seguridad** | ¿Están protegidos todos los endpoints destructivos? | Un `DELETE` o `POST` sin `@PreAuthorize` ni regla en `SecurityFilterChain`. | Matriz RBAC verificada; contraseñas con BCrypt factor 12; sin secretos en código. |
| **Integración** | ¿Tienen las llamadas externas timeouts y degradación? | Llamadas con `RestClient` sin timeout o reenvío del JSON externo crudo. | Timeouts de 2s/3s; Capa Anticorrupción; degradación elegante sin lanzar 500. |
| **Rendimiento** | ¿Existen consultas N+1 en relaciones JPA? | Relaciones `@OneToMany` con `FetchType.EAGER` o bucles `for` llamando a repositorios. | Consultas con `JOIN FETCH`, paginación en listados y transacciones de solo lectura (`readOnly = true`). |
| **Observabilidad** | ¿Están las trazas estructuradas con Correlation ID? | Uso de `System.out.println` o logs que imprimen contraseñas / tokens. | SLF4J en niveles adecuados, `logback-spring.xml` rotativo y `X-Correlation-ID` en MDC. |

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre Swagger UI, la colección, el README y los DTO actuales. Selecciona una ruta pública y otra protegida.
2. Anota qué necesita un compañero para arrancar, autenticarse y ejecutar ambas. Comprueba si esos pasos están escritos y si las variables tienen ejemplos sin secretos.
3. Selecciona una operación con validación y conflicto para revisar también los casos que no terminan con éxito.

#### Paso 2 · Enriquecimiento de OpenAPI y Swagger UI

Actualiza el único OpenApiConfig de la sesión 31. Añade el esquema HTTP bearer y referencia exactamente el mismo nombre en SecurityRequirement. En los controladores añade las anotaciones sobre los métodos existentes, conservando sus argumentos y cuerpo. El ejemplo de subida abreviado ilustra esas anotaciones: no se copia `...` como firma Java. Arranca y verifica primero `/v3/api-docs`, después el botón Authorize y finalmente una petición protegida.

```java
package com.ejemplo.gestor.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
            .info(new Info()
                .title("API REST del Gestor de Proyectos e Incidencias")
                .description("Servicio backend modular para gestión de proyectos, tareas, meteorología y adjuntos.")
                .version("1.0.0")
                .contact(new Contact().name("Equipo de Desarrollo Backend").email("soporte@empresa.com")))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                    .name(securitySchemeName)
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")));
    }
}
```

```java
    @Operation(summary = "Subir un archivo adjunto a una tarea",
               description = "Sube un archivo (PDF, PNG, JPG) de hasta 5 MB vinculado a una tarea específica.")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Fichero subido y registrado con éxito"),
        @ApiResponse(responseCode = "400", description = "Tipo de archivo no permitido o fichero vacío"),
        @ApiResponse(responseCode = "401", description = "No autenticado"),
        @ApiResponse(responseCode = "403", description = "Permisos insuficientes"),
        @ApiResponse(responseCode = "404", description = "Tarea no encontrada")
    })
    @PostMapping(value = "/tareas/{id}/adjuntos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('DESARROLLADOR', 'JEFE_PROYECTO', 'ADMINISTRADOR')")
    // Coloca estas anotaciones sobre tu método subirAdjunto existente.
    // Conserva su firma, sus parámetros multipart y todo su cuerpo.
```

#### Paso 3 · Inspección de Swagger UI y sesión de Code Review

1. **Abre Swagger UI en tu navegador:**
   `http://localhost:8080/swagger-ui.html`
2. **Verifica la documentación interactiva:**
   * Pulsa el botón **Authorize** en la esquina superior derecha e introduce tu token JWT.
   * Lanza peticiones directamente desde la interfaz y comprueba que las respuestas documentadas coinciden exactamente con los códigos y cuerpos JSON devueltos por tu backend.
3. **Simulación de revisión por pares:**
   * Intercambia el repositorio de código con un compañero de clase (o revisa una rama secundaria de tu propio proyecto).
   * Aplica la Rúbrica de Auditoría Técnica de las 5 dimensiones.
   * Identifica y redacta los 3 hallazgos principales con sugerencias constructivas de mejora.

<div class="rule">
  <p class="rule-label">Cómo se revisa el código de otra persona sin que la revisión se estropee</p>
  <p>Una revisión existe para mejorar el código, no para puntuar a quien lo escribió. Tres reglas que la mantienen útil:</p>
  <p><strong>Se comenta el código, no a la persona.</strong> «Este método hace tres cosas» se puede discutir; «no has separado responsabilidades» se defiende. La primera abre una conversación técnica, la segunda la cierra.</p>
  <p><strong>Cada hallazgo lleva una razón y una consecuencia.</strong> «Cambia esto» no es revisable. «Este listado carga las tareas dentro del bucle: con 200 proyectos son 201 consultas» sí lo es, porque quien lo lee puede comprobarlo y decidir.</p>
  <p><strong>Se separa lo que bloquea de lo que es opinión.</strong> Marca cada comentario como <em>bloqueante</em> (un fallo de seguridad, una pérdida de datos), <em>recomendado</em> o <em>sugerencia</em>. Sin esa etiqueta, quien recibe la revisión no sabe qué es urgente y acaba ignorándola entera o rehaciéndolo todo.</p>
</div>

#### Paso 4 · Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| Swagger sale vacío tras añadir seguridad | Las rutas de documentación no están permitidas | `/v3/api-docs/**` y `/swagger-ui/**` con `permitAll()` en tu `SecurityFilterChain` |
| *Try it out* devuelve `401` en todo | Falta declarar el esquema de seguridad | Añade el `SecurityScheme` `bearer`/`JWT` a `OpenApiConfig` para que aparezca el botón **Authorize** |
| La revisión del compañero no encuentra nada | El proyecto no se puede arrancar | Si no arranca en la máquina del revisor, ese ya es el primer hallazgo, y de los graves |
| Corriges un hallazgo y se rompen tres tests | Estabas cambiando comportamiento, no forma | Es información valiosa: significa que el comportamiento estaba probado. Decide cuál de los dos es correcto |
| SonarLint devuelve cientos de avisos | Estás mirando todas las severidades | Filtra por *Blocker* y *Critical*: el resto es ruido para lo que toca hoy |

#### Paso 5 · Auditar y ser auditado

Utiliza un clon y una configuración de desarrollo separados. Para cada dimensión de la rúbrica registra la comprobación realizada y su resultado; si no encuentras un defecto, indica la evidencia favorable en lugar de inventar un hallazgo. Cuando haya fallo, incluye petición, esperado, observado y ubicación. La persona autora corrige el caso, repite la comprobación y deja ambos resultados enlazados en el registro de sesión.

1. **Recibe:** intercambia repositorios con otro equipo. Clona el suyo desde cero y arráncalo siguiendo solo su documentación, sin preguntarles nada. Cronometra cuánto tardas.
2. **Audita:** recorre las cinco dimensiones de la rúbrica y anota **al menos un hallazgo en cada una**, con la etiqueta de gravedad y la razón. Un informe con quince comentarios de estilo y ninguno de seguridad es un informe que no ha hecho su trabajo.
3. **Busca específicamente estas cinco cosas**, que son las que más se repiten a estas alturas del curso:
   * Un endpoint de escritura sin `@PreAuthorize` ni regla en el `filterChain`.
   * Un listado que carga una relación dentro del bucle (el N+1 de la UD5).
   * Un `catch (Exception e)` vacío o que solo hace `printStackTrace()`.
   * Un DTO de respuesta que publica un campo que no debería salir (una contraseña, un campo interno).
   * Un endpoint sin ningún test.
4. **Entrega:** pásales el informe ordenado por gravedad, no por el orden en que fuiste encontrando las cosas.
5. **Recibe el tuyo y respóndelo entero**, punto por punto. Por cada hallazgo, una de tres respuestas: lo corrijo, no lo corrijo y este es el motivo, o lo anoto como deuda técnica para la UD12. Ninguna de las tres es peor que las otras; lo que no vale es dejar un hallazgo sin respuesta.
6. **Corrige los bloqueantes** y vuelve a ejecutar `./mvnw verify` para comprobar que ninguna corrección rompió nada.
7. Guarda el informe recibido: el apartado de deuda técnica de la memoria de la UD12 sale casi entero de aquí.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Has arrancado el proyecto de otro equipo sin ayuda; tu informe tiene hallazgos en las cinco dimensiones, etiquetados por gravedad y con su razón; has respondido a todos los que te hicieron; los bloqueantes están corregidos y la suite sigue verde.</dd>
</dl>

#### Paso 6 · Comprobar y registrar el resultado del proyecto

1. Ejecuta desde la documentación los casos válidos y rechazados y contrasta estados, campos, ejemplos y requisitos de acceso.
2. Intercambia la revisión con otra persona, corrige discrepancias reproducibles y registra qué cambió en código o documentación y cómo se verificó.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Detección estática de deuda técnica con SonarLint

Instala la extensión **SonarLint** en tu entorno de desarrollo (IntelliJ o VS Code):
1. Analiza todos los archivos Java de tu proyecto.
2. Revisa la pestaña de problemas de SonarLint y clasifica los hallazgos según su tipología:
   * *Code Smells* (mantenibilidad).
   * *Bugs* potenciales (valores que pueden ser nulos, recursos no cerrados).
   * *Vulnerabilidades de seguridad*.
3. Resuelve las incidencias detectadas hasta dejar el código con cero advertencias de severidad alta.

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Incluye esta explicación en el registro de la sesión dentro del repositorio de GitHub, junto al código y las comprobaciones. La entrega es el enlace al repositorio y al commit de la sesión.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Documentación OpenAPI 3 enriquecida con seguridad JWT visible en Swagger UI.</span></div>
  <div><strong>Si lo tienes</strong><span>Rúbrica de 5 dimensiones aplicada y corrección de hallazgos de arquitectura y rendimiento.</span></div>
  <div><strong>Reto</strong><span>Inspección estática de código con SonarLint y resolución completa de advertencias de deuda técnica.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Garantiza que la documentación nunca quede desactualizada respecto a la implementación real, ya que se autogenera directamente a partir del código y sus anotaciones.</p>
  <p>2 · Definiendo un SecurityScheme de tipo HTTP con esquema "bearer" y formato "JWT" en el bean de configuración de OpenAPI.</p>
  <p>3 · Porque el formateo estético debe delegarse a herramientas automáticas (linters/formatters); el criterio humano del revisor debe concentrarse en la lógica de negocio, la seguridad, la concurrencia y la mantenibilidad.</p>
  <p>4 · Ocurre cuando al consultar una lista de N entidades se dispara una consulta adicional individual por cada elemento para cargar sus relaciones perezosas (1 + N consultas SQL); se detecta revisando logs de SQL o buscando relaciones sin JOIN FETCH.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Otra persona puede arrancar la API, comprender sus permisos y reproducir un recorrido documentado.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Lo que debes recordar

### El método

En esta unidad has consolidado la estrategia de calidad y verificación para transformar un prototipo funcional en software profesional listo para producción.

Para garantizar la calidad y observabilidad de cualquier backend empresarial, aplica siempre este decálogo de ingeniería:

<figure class="diagram">
  <figcaption>El decálogo de calidad, observabilidad y documentación</figcaption>
  <ol class="flow">
    <li>Organiza tus pruebas según la <strong>Pirámide de Pruebas</strong>: maximiza tests unitarios rápidos y minimiza tests completos de integración.</li>
    <li><strong>Desconfía de la cobertura de líneas</strong>: audita la <strong>cobertura de ramas (<em>Branch Coverage</em>)</strong> para asegurar que todas las decisiones lógicas han sido probadas.</li>
    <li>Prueba siempre los <strong>casos límite y frontera</strong> (nulos, vacíos, desbordamientos, duplicados) mediante <strong><code>@ParameterizedTest</code></strong>.</li>
    <li>Verifica la <strong>atomicidad transaccional</strong> con tests de reversión (rollback) ante fallos intencionados.</li>
    <li><strong>Prohíbe terminantemente <code>System.out.println</code></strong>: utiliza la fachada <strong>SLF4J</strong> y clasifica cada mensaje en su nivel exacto (ERROR, WARN, INFO, DEBUG, TRACE).</li>
    <li>Configura <strong>Logback con rotación y compresión de archivos</strong> para evitar la saturación del almacenamiento del servidor.</li>
    <li>Inyecta un <strong>Correlation ID único mediante MDC</strong> en cada petición HTTP para enlazar todas las trazas de un mismo usuario.</li>
    <li><strong>Respeta la privacidad (GDPR / OWASP)</strong>: nunca registres contraseñas, tokens completos ni datos personales en los logs.</li>
    <li>Genera <strong>documentación viva con OpenAPI 3 y Swagger UI</strong>, describiendo códigos de respuesta, esquemas de error y seguridad JWT.</li>
    <li>Somete todo cambio a una <strong>Revisión de Código por Pares (<em>Peer Code Review</em>)</strong> evaluando arquitectura, seguridad, resiliencia y rendimiento.</li>
  </ol>
</figure>

### La idea más importante

> **El software no termina cuando funciona en tu máquina: termina cuando otro desarrollador puede leerlo y entenderlo, un pipeline de CI puede verificarlo automáticamente con tests que cubren casos límite, un operador puede monitorizarlo y depurarlo en producción mediante logs correlacionados, y un equipo cliente puede integrarlo sin dudas gracias a su documentación técnica.**

Hacer que un programa funcione con datos perfectos en local lo consigue cualquiera. La verdadera ingeniería de software consiste en construir aplicaciones observables, mantenibles y robustas que resistan el paso del tiempo y los fallos del mundo real.

### Las decisiones que tienes que saber justificar

| Decisión de ingeniería | Lo que tienes que poder defender ante un tribunal |
| :--- | :--- |
| **Pirámide de Pruebas frente a solo tests de controlador** | Los tests unitarios con Mockito se ejecutan en milisegundos y aíslan la lógica; abusar de `@SpringBootTest` ralentiza el pipeline de integración continua de minutos a horas. |
| **Cobertura de ramas (*Branch Coverage*) frente a líneas** | La cobertura de líneas puede engañar al auditor si no hay aserciones; la cobertura de ramas garantiza que tanto el camino verdadero como el falso de cada condicional fueron verificados. |
| **Tests parametrizados con `@ParameterizedTest`** | Permiten comprobar decenas de combinaciones y valores frontera (nulos, vacíos, límites numéricos) con un único método de prueba limpio y mantenible. |
| **SLF4J + Logback frente a `System.out.println`** | SLF4J permite filtrar por gravedad en tiempo de ejecución, es asíncrono no bloqueante, incluye marcas de tiempo e hilos, y permite rotación de archivos en disco. |
| **Identificador de correlación con MDC** | Permite reconstruir la secuencia completa de operaciones de una petición HTTP específica en entornos concurrentes con miles de usuarios simultáneos. |
| **Prohibición de registrar datos sensibles (PII) en logs** | Cumplimiento estricto del RGPD y estándares de seguridad OWASP para evitar que una fuga de logs exponga contraseñas, credenciales o datos protegidos. |
| **OpenAPI 3 autogenerado frente a documentos estáticos** | Los documentos manuales quedan obsoletos de inmediato; la documentación viva se actualiza automáticamente con cada cambio en el código fuente. |
| **Revisión de código estructurada por rúbrica** | Asegura que el code review evalúe aspectos críticos de ingeniería (seguridad, arquitectura, consultas N+1) y no meras preferencias estéticas de formateo. |
| **Inclusión de `correlationId` en respuestas RFC 7807** | Conecta el soporte al usuario con la depuración técnica: el cliente reporta el código de error y el ingeniero localiza la traza exacta en segundos. |
| **Configuración de fallos de compilación por umbrales (`jacoco:check`)** | Garantiza la disciplina del equipo en integración continua: ningún código nuevo sin cobertura suficiente puede fusionarse en la rama principal. |

### Al terminar la unidad deberías poder responder

1. ¿Por qué una suite de pruebas con 90 % de cobertura de líneas puede permitir fallos graves en producción?
2. ¿Qué tres niveles componen la Pirámide de Pruebas y qué proporción debe mantenerse entre ellos?
3. ¿Cómo se utiliza `@ParameterizedTest` junto a `@ValueSource` para probar valores frontera en JUnit 5?
4. ¿Qué comprueba un test de integración transaccional que simula un fallo en un método `@Transactional`?
5. ¿Qué cuatro problemas graves presenta el uso de `System.out.println` en aplicaciones web de servidor?
6. ¿Cuál es el significado y propósito de cada uno de los 5 niveles de log (ERROR, WARN, INFO, DEBUG, TRACE)?
7. ¿Cómo opera el patrón MDC (Mapped Diagnostic Context) en un filtro HTTP de Spring Boot?
8. ¿Por qué es obligatorio limpiar el MDC mediante `MDC.remove()` al terminar de procesar una petición?
9. ¿Qué directivas de rotación de archivos en Logback evitan que los logs saturen el disco duro del servidor?
10. ¿Por qué nunca deben registrarse tokens JWT completos ni contraseñas en las trazas de log?
11. ¿Cómo se vincula el `X-Correlation-ID` de la cabecera HTTP con el objeto de error estándar RFC 7807?
12. ¿Qué ventajas aporta la especificación OpenAPI 3 y su visor Swagger UI para el equipo de desarrollo frontend?
13. ¿Cómo se documenta en OpenAPI que un endpoint requiere autenticación mediante Bearer Token?
14. ¿Qué cinco dimensiones estructuran la Rúbrica de Auditoría Técnica en una revisión de código por pares?
15. ¿Qué es el problema de las consultas N+1 en Spring Data JPA y cómo se previene con `JOIN FETCH`?
16. ¿Por qué las entidades JPA nunca deben exponerse directamente en los métodos de un controlador REST?
17. ¿Cuál es la diferencia entre un test que usa `@WebMvcTest` y uno que usa `@DataJpaTest`?
18. ¿Cómo ayuda la herramienta JaCoCo a detectar ramas condicionales sin probar (*Yellow Lines*)?
19. ¿Por qué un Code Review debe centrarse en el diseño, la seguridad y la resiliencia y no en el formateo de llaves?
20. ¿Qué significa el principio *«Fail Fast»* en la gestión de excepciones de un servicio backend?

### El vocabulario de la unidad

| Concepto | Significa |
| :--- | :--- |
| **Pirámide de Pruebas** | Modelo arquitectónico que promueve una base amplia de tests unitarios rápidos, una capa media de tests de corte y una cima reducida de tests de integración completa. |
| **Branch Coverage** | Métrica de calidad que mide el porcentaje de ramas lógicas y caminos de decisión ejecutados por una suite de pruebas. |
| **Slice Test** | Prueba focalizada que levanta exclusivamente una capa o subconjunto de beans de Spring (ej: `@WebMvcTest` o `@DataJpaTest`). |
| **JaCoCo** | Herramienta estándar de Java para análisis y generación de informes de cobertura de código fuente. |
| **SLF4J** | Fachada abstracta de logging en Java que permite desacoplar el código del motor de trazas subyacente. |
| **Logback** | Motor de registro de trazas por defecto en Spring Boot, sucesor moderno de Log4j. |
| **MDC** | *Mapped Diagnostic Context*: almacén basado en ThreadLocal de SLF4J para adjuntar información contextual (como identificadores de usuario o petición) a todas las líneas de log. |
| **Correlation ID** | Identificador alfanumérico único asignado a una petición HTTP para rastrear su ejecución a través de todos los componentes y servicios del sistema. |
| **Log Rotation** | Política de archivado automático que divide los ficheros de log por fecha o tamaño y comprime los históricos antiguos para ahorrar espacio. |
| **PII** | *Personally Identifiable Information*: datos personales sensibles protegidos por normativas de privacidad que nunca deben exponerse en registros de log. |
| **OpenAPI 3** | Especificación estándar e independiente del lenguaje para describir de forma exhaustiva las interfaces de programación REST. |
| **Swagger UI** | Herramienta web que renderiza visualmente un contrato OpenAPI permitiendo explorar e interactuar con los endpoints de la API. |
| **Peer Code Review** | Práctica de ingeniería donde los desarrolladores inspeccionan y comentan el código de sus compañeros antes de integrarlo en la rama principal. |
| **N+1 Problem** | Ineficiencia en ORMs donde una consulta inicial genera N consultas adicionales para cargar entidades relacionadas en bucle. |
| **Rollback** | Operación transaccional que anula todos los cambios realizados en la base de datos durante una transacción ante la ocurrencia de un error. |

### Comprobación final del producto de la unidad

<div class="checkpoint">
  <p class="checkpoint-label">Calidad, observabilidad y documentación · criterios de producción</p>
  <ul class="checklist">
    <li>La suite de pruebas combina tests unitarios puros, tests de corte (<code>@WebMvcTest</code>, <code>@DataJpaTest</code>) y tests de integración.</li>
    <li>Se audita y alcanza una cobertura de ramas (*Branch Coverage*) superior al 75 % en la capa de servicios con JaCoCo.</li>
    <li>Los casos límite (nulos, vacíos, límites numéricos y caracteres especiales) están probados con <code>@ParameterizedTest</code>.</li>
    <li>Se verifica la atomicidad transaccional comprobando que los fallos provocan el rollback íntegro en la base de datos.</li>
    <li>El código fuente está libre de llamadas a <code>System.out.println</code>, utilizando exclusivamente el <code>Logger</code> de SLF4J.</li>
    <li>Los mensajes de log están clasificados con criterio estricto entre ERROR, WARN, INFO y DEBUG.</li>
    <li>El archivo <code>logback-spring.xml</code> implementa rotación y compresión de archivos diarios con límite de tamaño.</li>
    <li>Cada petición HTTP dispone de un <code>X-Correlation-ID</code> inyectado en el MDC y devuelto en las cabeceras de respuesta.</li>
    <li>Los contratos OpenAPI 3 están enriquecidos y sincronizados con descripciones, códigos de error y seguridad JWT.</li>
    <li>El código ha superado una revisión por pares con rúbrica técnica corrigiendo defectos de arquitectura y consultas N+1.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Resultados de la unidad</p>
  <ul class="checklist">
    <li>Explicar qué cubre y qué no cubre la suite de pruebas existente.</li>
    <li>Completar los casos límite que faltan y medir la cobertura con criterio.</li>
    <li>Dejar trazas útiles y depurar un fallo con ellas.</li>
    <li>Publicar documentación técnica y someterla a una revisión por pares.</li>
  </ul>
</div>

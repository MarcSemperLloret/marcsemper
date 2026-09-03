---
title: "Calidad, observabilidad y documentación"
label: "UD11 · Verificar"
section: "ud-11"
order: 11
lang: "es"
summary: "Consolidar en una estrategia lo que se ha ido probando desde la UD4, y dejar la aplicación observable, documentada y revisada por otros."
duration: "6 horas · 1 semana · 3 sesiones"
modality: "Taller de calidad · 30 % guía / 70 % autonomía"
deliverable: "Una estrategia de pruebas documentada, logs útiles y documentación técnica revisada por pares."
date: "2026-09-02"
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

<p class="lead">Esta no es la unidad en la que aparecen los tests: es la unidad en la que se ordenan. Llevas probando desde la UD4, y ahora toca decidir qué falta, qué sobra y qué se documenta.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje bajo. Se audita la propia aplicación con una rúbrica y se corrige lo que la auditoría revele.</p>
</div>

<div class="rule">
  <p class="rule-label">Tres cosas que ya has hecho, y en qué se diferencian ahora</p>
  <p>Nada de lo que aparece en estas tres sesiones es nuevo, y es intencionado. <strong>Los tests</strong> los escribes desde la UD4; aquí decides cuáles faltan. <strong>La documentación OpenAPI</strong> la generaste en la UD7; aquí deja de ser una cáscara autogenerada y pasa a documentar errores, seguridad y ejemplos. <strong>La revisión por pares</strong> la practicaste en la UD6 sobre una API sin seguridad ni integraciones; aquí la rúbrica tiene cinco dimensiones porque la aplicación ya las tiene.</p>
  <p>Son seis horas para auditar un proyecto de veintitrés semanas, así que el inventario de la sesión 67 no es un trámite: es lo que decide en qué se gastan las otras dos sesiones.</p>
</div>

## Semana 23 · Demostrar que funciona y contarlo

## Sesión 67 · Estrategia de pruebas y cobertura

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la Pirámide de Pruebas (unitarias puras, tests por corte con <code>@WebMvcTest</code> y <code>@DataJpaTest</code>, e integración global), la falacia de la métrica de cobertura de líneas, la identificación de huecos ciegos (<em>blind spots</em>) y la verificación de condiciones límite con <code>@ParameterizedTest</code>.</li>
    <li><strong>2. Haz:</strong> configura el plugin JaCoCo en Maven, inventaría la suite de pruebas construida desde la UD4 hasta la UD10, y programa los tests de casos límite que faltaban (validación de límites numéricos, cadenas extremas, caracteres especiales y reversión transaccional ante error).</li>
    <li><strong>3. Comprueba:</strong> ejecutas <code>./mvnw clean verify jacoco:report</code>, abres el informe HTML en el navegador y analizas con criterio técnico la cobertura de ramas (<em>Branch Coverage</em>) de la capa de servicios demostrando que las bifurcaciones lógicas críticas están probadas.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué un proyecto con un 85 % de cobertura de líneas de código puede contener errores críticos en producción?</li>
    <li>¿Qué diferencia hay en velocidad y coste computacional entre un test unitario con JUnit 5 + Mockito y un test de integración con <code>@SpringBootTest</code>?</li>
    <li>¿Qué anotación de JUnit 5 permite ejecutar un mismo método de prueba múltiples veces inyectándole una colección de argumentos distintos?</li>
  </ol>
</div>

### La falacia de la cobertura: Cantidad frente a Calidad

En muchas empresas se impone un objetivo numérico ciego: *«Todo el código debe tener al menos un 80 % de cobertura de tests»*.

Cumplir ese número es fácil y peligroso:
* Puedes escribir un test que invoque un método con datos ideales, no añada ninguna aserción (`assertNotNull`, `assertEquals`) y el reporte de cobertura marcará el 100 % de esas líneas en verde.
* La cobertura de líneas solo mide si el compilador pasó por esa instrucción; **no mide si el test verificó el resultado, si probó valores nulos ni si comprobó qué pasa cuando la base de datos o la red fallan**.

<div class="rule">
  <p class="rule-label">La ley de los casos límite</p>
  <p><strong>El código no se rompe en el camino feliz; se rompe en las fronteras.</strong></p>
  <p>Una suite de pruebas profesional no busca probar mil veces lo evidente. Busca probar con rigor las condiciones de frontera: valores cero o negativos, cadenas vacías, desbordamientos de longitud, caracteres no ASCII, duplicados en concurrencia y excepciones transaccionales.</p>
</div>

### La Pirámide de Pruebas en Spring Boot

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

### Paso a paso guiado · Auditoría de cobertura con JaCoCo y tests parametrizados

<p class="stage">Paso 1 · Configurar el plugin de JaCoCo en pom.xml</p>

Añadimos el plugin oficial de cobertura en el bloque `<plugins>` de nuestro proyecto:

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>verify</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

<p class="stage">Paso 2 · Matriz de inventario de la suite existente</p>

Antes de escribir nuevos tests, clasificamos las pruebas construidas durante el curso:

| Módulo / Capa | Tipo de prueba | Anotaciones utilizadas | Qué cubre actualmente | Hueco o caso límite detectado |
| :--- | :--- | :--- | :--- | :--- |
| **Servicio de Proyectos** | Unitaria con Mockito | `@ExtendWith(MockitoExtension.class)` | Creación y búsqueda básica. | No prueba nombres duplicados ni fechas de inicio posteriores a fin. |
| **Repositorio JPA** | Corte de persistencia | `@DataJpaTest` | Consultas derivadas `findBy...` | No prueba integridad referencial al borrar proyectos con tareas activas. |
| **Controlador Web** | Corte HTTP y Seguridad | `@WebMvcTest` + `@WithMockUser` | Rutas 401, 403 y 201. | No prueba envío de payloads gigantes ni caracteres extraños en JSON. |
| **Servicio de Clima** | Unitaria de Adaptador | JUnit 5 puro | Mapeo de códigos a texto. | No prueba comportamiento ante coordenadas polares o valores nulos. |

<p class="stage">Paso 3 · Implementar tests parametrizados para casos límite de negocio</p>

Utilizamos `@ParameterizedTest` para probar múltiples valores frontera sin duplicar código:

```java
package com.ejemplo.gestor;

import com.ejemplo.gestor.dto.ProyectoRequest;
import com.ejemplo.gestor.service.ProyectoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertThrows;

class ProyectoBoundaryTest {

    private final ProyectoService proyectoService = new ProyectoService(/* mocks */);

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"   ", "\t", "\n"})
    @DisplayName("El alta de proyecto debe fallar ante nombres vacíos o solo con espacios en blanco")
    void crearProyecto_conNombreInvalido_lanzaIllegalArgumentException(String nombreInvalido) {
        var request = new ProyectoRequest(
            nombreInvalido, 
            "Cliente A", 
            LocalDate.now(), 
            LocalDate.now().plusMonths(1),
            39.47, -0.38
        );

        assertThrows(IllegalArgumentException.class, () -> {
            proyectoService.crearProyecto(request);
        });
    }

    @ParameterizedTest
    @ValueSource(doubles = {-91.0, 91.0, -180.5, 200.0})
    @DisplayName("Las coordenadas geográficas deben estar acotadas entre -90/90 y -180/180")
    void crearProyecto_conLatitudFueraDeRango_lanzaExcepcion(double latitudInvalida) {
        var request = new ProyectoRequest(
            "Planta Solar", 
            "Cliente B", 
            LocalDate.now(), 
            LocalDate.now().plusMonths(1),
            latitudInvalida, 0.0
        );

        assertThrows(IllegalArgumentException.class, () -> {
            proyectoService.validarCoordenadas(request);
        });
    }
}
```

<p class="stage">Paso 4 · Test de reversión transaccional ante fallo (Rollback Test)</p>

Verificamos que si se produce un fallo durante la creación de un proyecto con tareas iniciales, ninguna fila queda persistida a medias en la base de datos:

```java
package com.ejemplo.gestor;

import com.ejemplo.gestor.model.Proyecto;
import com.ejemplo.gestor.repository.ProyectoRepository;
import com.ejemplo.gestor.repository.TareaRepository;
import com.ejemplo.gestor.service.ProyectoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProyectoTransaccionalTest {

    @Autowired
    private ProyectoService proyectoService;

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private TareaRepository tareaRepository;

    @Test
    void crearProyectoConTareas_siFallaUnaTarea_haceRollbackCompleto() {
        long proyectosAntes = proyectoRepository.count();
        long tareasAntes = tareaRepository.count();

        // Se simula la creación donde la tercera tarea contiene un fallo forzado
        assertThrows(RuntimeException.class, () -> {
            proyectoService.crearProyectoConLoteTareasDefectuoso();
        });

        // Verificamos la atomicidad ACID: la base de datos vuelve a su estado exacto inicial
        assertEquals(proyectosAntes, proyectoRepository.count(), "El proyecto no debe haberse guardado");
        assertEquals(tareasAntes, tareaRepository.count(), "Ninguna tarea del lote debe persistir");
    }
}
```

### La comprobación · Ejecutar y analizar el informe JaCoCo

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

### Las cuatro familias de caso límite que siempre faltan

Cuando alguien dice «no sé qué más probar», casi siempre es porque solo ha pensado en valores razonables. Recorre estas cuatro listas sobre cada regla de negocio de tu aplicación y aparecerán los huecos solos:

<dl class="worked">
  <dt>1 · Los bordes de un rango</dt>
  <dd>Si el presupuesto máximo son 150.000 €, hay que probar <strong>149.999, 150.000 y 150.001</strong>. El error de programación más común del mundo es confundir <code>&gt;</code> con <code>&gt;=</code>, y solo el valor exacto del borde lo detecta. Lo mismo con longitudes: un campo de 3 a 80 caracteres se prueba con 2, 3, 80 y 81.</dd>
  <dt>2 · El vacío y la ausencia</dt>
  <dd>No son lo mismo y se comportan distinto: una cadena vacía, una cadena de espacios, un <code>null</code> y un campo que ni siquiera viene en el JSON. Y en las colecciones: la lista vacía, que es el caso que revienta cualquier cálculo de media o de máximo.</dd>
  <dt>3 · Lo que rompe el formato</dt>
  <dd>Acentos y eñes, emojis, comillas simples dentro de un texto, cadenas de 10.000 caracteres, números negativos donde esperas positivos, y una fecha de fin anterior a la de inicio. Ninguno es rebuscado: todos llegan de usuarios reales.</dd>
  <dt>4 · El orden y la repetición</dt>
  <dd>Hacer dos veces la misma operación, deshacer algo que no se ha hecho, borrar un recurso que ya se borró, cerrar un proyecto ya cerrado. La pregunta en todos: ¿es un error, o debería ser idempotente y responder lo mismo?</dd>
</dl>

Cuando varios de estos casos comparten la misma lógica, `@ParameterizedTest` con `@ValueSource` o `@CsvSource` te ahorra escribir el mismo test cinco veces cambiando un número.

### Ahora tú · Auditar y blindar el servicio de Tareas

1. **Haz primero el inventario, antes de escribir ningún test.** Una tabla con una fila por regla de negocio de tu aplicación y tres columnas: qué la comprueba hoy, qué caso límite le falta, y qué pasaría en producción si fallase. Sin ese inventario, escribirás tests de lo que ya está probado, que es lo que hace subir la cobertura sin mejorar nada.
2. Revisa en el informe JaCoCo qué métodos o ramas de `TareaService` tienen menos del 70 % de cobertura de **ramas** —no de líneas—, y crúzalo con tu inventario.
3. Aplica las cuatro familias de arriba a las reglas de tarea: valores en el borde del presupuesto, título vacío o con solo espacios, título de 10.000 caracteres, fecha de fin anterior a la de inicio, transición de estado repetida y asignación a un usuario inactivo.
4. Escribe los tests correspondientes, usando `@ParameterizedTest` donde se repita la lógica, y vuelve a compilar hasta que la cobertura de ramas supere el 80 %.
5. **Comprueba el rollback**, que es el caso límite que casi nadie prueba: provoca un fallo a mitad de una operación que escribe en dos tablas y verifica en PostgreSQL que **no ha quedado nada** de la primera escritura. Una transacción que no revierte deja datos corruptos que ningún test de código detecta.
6. Cierra con la pregunta honesta que ordena toda la unidad: **¿qué parte de tu aplicación sigue sin estar probada, y por qué has decidido dejarla así?** Esa respuesta, escrita, vale más que un porcentaje: es el punto de partida de la sesión 69 y un apartado de la memoria de la UD12.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Tienes el inventario de reglas con sus huecos identificados; la cobertura de ramas de <code>service</code> supera el 80 %; cada rango numérico está probado en sus tres valores frontera; has comprobado al menos un <code>rollback</code> mirando la base de datos; y puedes decir qué queda sin probar y por qué.</dd>
</dl>

### Reto · Umbrales de cobertura mínimos obligatorios en CI/CD

En proyectos profesionales se configura Maven para que la compilación **falle automáticamente** si un desarrollador introduce código nuevo sin tests suficientes.

Configura una regla de verificación en `jacoco-maven-plugin`:
1. Añade una ejecución con el objetivo `check` en `pom.xml`.
2. Establece un límite mínimo de cobertura de ramas (*BRANCH*) del 75 % a nivel de paquete de servicios (`com.ejemplo.gestor.service.*`).
3. Comprueba que si borras un test crítico, `./mvnw verify` termina con código de error y aborta el empaquetado del archivo JAR.

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Si en la evaluación se solicita un documento de auditoría de pruebas y análisis de casos límite, el formato oficial de entrega de texto es siempre un <strong>documento en PDF</strong> (<code>estrategia-pruebas.pdf</code>), nunca un archivo markdown suelto.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Plugin JaCoCo integrado en <code>pom.xml</code> e informe HTML generado con <code>./mvnw verify</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Tests parametrizados con <code>@ParameterizedTest</code> cubriendo valores límite y verificación de rollback.</span></div>
  <div><strong>Reto</strong><span>Regla obligatoria de umbral de cobertura (<code>jacoco:check</code>) bloqueando compilaciones sin tests.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 67</p>
  <ul class="checklist">
    <li>Se supera la falacia de evaluar la calidad de los tests únicamente por líneas cubiertas.</li>
    <li>Se conoce y aplica la estructura de la Pirámide de Pruebas en el ecosistema Spring.</li>
    <li>El plugin JaCoCo genera informes visuales diferenciando cobertura de líneas y de ramas.</li>
    <li>Se utilizan tests parametrizados (<code>@ParameterizedTest</code>) para verificar valores frontera.</li>
    <li>Se comprueba la atomicidad transaccional verificando rollbacks ante fallos imprevistos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué mide exactamente la métrica de «cobertura de ramas» (*Branch Coverage*) a diferencia de la cobertura de líneas?</li>
    <li>¿Por qué es preferible escribir 20 tests unitarios con Mockito que 20 tests con <code>@SpringBootTest</code>?</li>
    <li>¿Para qué se utiliza la fuente <code>@NullAndEmptySource</code> en una prueba parametrizada?</li>
    <li>¿Qué significa que una prueba transaccional verifique la propiedad de atomicidad (la A de ACID)?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Mide si todas las posibles decisiones lógicas booleanas de una estructura condicional (ambas ramas de un if, todos los case de un switch) han sido ejecutadas y evaluadas en los tests.</p>
  <p>2 · Porque los tests unitarios con Mockito se ejecutan en pocos milisegundos sin levantar el contenedor Spring ni la base de datos, permitiendo ciclos de feedback casi instantáneos.</p>
  <p>3 · Inyecta automáticamente dos casos de prueba: un valor null y una cadena vacía ("") para verificar que el método receptor los gestiona adecuadamente.</p>
  <p>4 · Que ante un error a mitad de una operación compuesta, todas las modificaciones previas se revierten (rollback), garantizando que o se guarda todo o no se guarda nada.</p>
</details>

## Sesión 68 · Logging y depuración

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la observabilidad en producción, por qué <code>System.out.println</code> es un antipatrón prohibido, la jerarquía de los 5 niveles de log (ERROR, WARN, INFO, DEBUG, TRACE), la configuración de Logback con rotación de archivos, y el identificador de correlación con <strong>MDC (Mapped Diagnostic Context)</strong>.</li>
    <li><strong>2. Haz:</strong> configura <code>logback-spring.xml</code>, crea un filtro que asigna un <code>X-Correlation-ID</code> a cada petición HTTP entrante y añade trazas contextuales estructuradas sin filtrar datos confidenciales (PII).</li>
    <li><strong>3. Comprueba:</strong> lanzas peticiones desde Bruno y demuestras cómo seguir la traza completa de un incidente técnico en los archivos de log filtrando por su identificador de correlación único en menos de un minuto.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué está totalmente desaconsejado utilizar <code>System.out.println()</code> en el código de un backend empresarial?</li>
    <li>¿En qué nivel de log (ERROR, WARN, INFO o DEBUG) clasificarías un intento fallido de login por contraseña incorrecta de un usuario?</li>
    <li>¿Qué problema surge al inspeccionar un archivo de log con 100.000 líneas cuando 50 usuarios concurrentes están usando la aplicación a la vez?</li>
  </ol>
</div>

### La amnesia del servidor en producción

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

### Los 5 niveles estándar de log

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

### Correlación de peticiones con MDC (Mapped Diagnostic Context)

Cuando 50 usuarios lanzan peticiones simultáneas, las líneas de log de todos los hilos se intercalan en el mismo archivo.

Para no volverse loco buscando qué línea corresponde a qué petición, utilizamos el patrón **`Correlation ID`** mediante el **MDC** de SLF4J:
* Al entrar una petición, un filtro genera un identificador único (ej: `req-7f3a1b`).
* Se almacena en el hilo actual con `MDC.put("correlationId", id)`.
* **Cada línea de log que se emita en cualquier servicio o repositorio imprimirá automáticamente ese identificador**.
* Se añade la cabecera `X-Correlation-ID: req-7f3a1b` en la respuesta HTTP para que el cliente pueda reportar ese código ante cualquier incidencia.

### Paso a paso guiado · Configuración de observabilidad con MDC

<p class="stage">Paso 1 · Crear el filtro de correlación CorrelationIdFilter</p>

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

<p class="stage">Paso 2 · Configurar el patrón de log en logback-spring.xml</p>

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

<p class="stage">Paso 3 · Añadir trazas de log útiles y seguras en ProyectoService</p>

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

### La comprobación · Depuración forense de un fallo en Bruno

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

### Ahora tú · Integrar el Correlation ID en las respuestas RFC 7807

Modifica tu manejador global de excepciones `GlobalExceptionHandler`:
1. Al capturar cualquier error (400, 404, 500), inyecta el `MDC.get("correlationId")` en el objeto de error Problem Details:
   ```json
   {
     "status": 409,
     "title": "Conflicto",
     "detail": "El proyecto ya existe",
     "instance": "/api/v1/proyectos",
     "correlationId": "a1b2c3d4"
   }
   ```
2. De este modo, si un usuario recibe una pantalla de error en el frontend, solo tiene que enviar ese `correlationId` al equipo de soporte para que los ingenieros localicen el incidente inmediatamente en los logs del servidor.

### Reto · Enmascaramiento automático de datos sensibles

Diseña un filtro o conversor personalizado en Logback (`PatternLayoutEncoder` o `CompositeConverter`):
1. Investiga cómo aplicar expresiones regulares en Logback para sustituir números de tarjetas bancarias o emails por valores enmascarados (ej: `j***@empresa.com`).
2. Comprueba que si un programador despistado escribe `log.info("Usuario: {}", usuario)` la contraseña o datos protegidos nunca lleguen en texto plano al archivo de disco.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Sustitución de <code>System.out</code> por <code>Logger</code> de SLF4J y niveles clasificados con criterio.</span></div>
  <div><strong>Si lo tienes</strong><span>Filtro de <code>CorrelationIdFilter</code> con MDC y rotación de archivos en <code>logback-spring.xml</code>.</span></div>
  <div><strong>Reto</strong><span>Inclusión de <code>correlationId</code> en respuestas RFC 7807 y enmascaramiento automático de datos sensibles.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 68</p>
  <ul class="checklist">
    <li>Se erradica por completo el uso de <code>System.out.println</code> en el código backend.</li>
    <li>Se utiliza la jerarquía estricta de 5 niveles de log (ERROR, WARN, INFO, DEBUG, TRACE).</li>
    <li>El archivo <code>logback-spring.xml</code> gestiona la rotación y compresión diaria de trazas.</li>
    <li>El patrón MDC asigna un <code>Correlation ID</code> único a cada hilo de petición HTTP.</li>
    <li>Se respeta la privacidad de datos personales garantizando que no se loguean secretos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es fundamental ejecutar <code>MDC.remove("correlationId")</code> en el bloque <code>finally</code> de un filtro?</li>
    <li>¿Cuál es la diferencia de severidad entre emitir un log a nivel <code>WARN</code> y uno a nivel <code>ERROR</code>?</li>
    <li>¿Qué ventaja ofrece la rotación de archivos de log (*Log Rolling*) frente a escribir en un único archivo infinito?</li>
    <li>¿Cómo ayuda el <code>Correlation ID</code> al equipo de soporte cuando un cliente reporta una incidencia en producción?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque Tomcat reutiliza hilos de su pool de trabajo; si no limpias el MDC, la siguiente petición procesada por ese mismo hilo heredaría el ID de la petición anterior causando contaminación de trazas.</p>
  <p>2 · WARN indica una contingencia o comportamiento anómalo donde el sistema pudo seguir funcionando o aplicar una degradación; ERROR indica que una operación requerida falló de forma irrecuperable.</p>
  <p>3 · Evita que el archivo de log crezca hasta agotar el disco duro de la máquina, comprime los históricos antiguos (.gz) y facilita las búsquedas delimitadas por fecha.</p>
  <p>4 · Permite al ingeniero buscar directamente ese código alfanumérico en el archivo de logs y obtener exactamente las líneas de traza de esa petición aisladas de la concurrencia de otros usuarios.</p>
</details>

## Sesión 69 · OpenAPI, documentación y code review

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el valor del código autodocumentado, la especificación profesional de contratos con <strong>OpenAPI 3 / Swagger</strong>, y la metodología de <strong>Revisión de Código por Pares (Peer Code Review)</strong> mediante una rúbrica de auditoría técnica.</li>
    <li><strong>2. Haz:</strong> enriquece la documentación OpenAPI en controladores con anotaciones declarativas (<code>@Operation</code>, <code>@ApiResponse</code>, esquemas y ejemplos), y audita una aplicación funcional buscando defectos de seguridad, rendimiento (consultas N+1) y acoplamiento.</li>
    <li><strong>3. Comprueba:</strong> abres Swagger UI interactivo verificando que los contratos reflejan fielmente los códigos de error RFC 7807 y la seguridad JWT, y redactas un informe de revisión por pares priorizado con recomendaciones constructivas.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué una interfaz Swagger generada automáticamente con anotaciones vacías no es suficiente para que un equipo frontend externo consuma tu API sin dudas?</li>
    <li>¿Qué defecto de rendimiento de JPA se conoce como el problema de las «consultas N+1»?</li>
    <li>¿Cuál es el propósito principal de una revisión de código entre compañeros (*Peer Code Review*) en un equipo de desarrollo?</li>
  </ol>
</div>

### La documentación viva frente a los documentos muertos

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

### Metodología de Revisión de Código por Pares (Peer Code Review)

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

### Rúbrica de Auditoría Técnica de Código Backend

Utiliza esta lista de comprobación para auditar la aplicación:

| Dimensión | Pregunta de auditoría | Señal de alarma (*Red Flag*) | Criterio de excelencia |
| :--- | :--- | :--- | :--- |
| **Arquitectura** | ¿Están los DTOs desacoplados de las entidades JPA? | Un controlador recibe o devuelve una entidad `@Entity` de JPA directamente. | DTOs inmutables (`record`) para peticiones y respuestas; mapeo en servicios. |
| **Seguridad** | ¿Están protegidos todos los endpoints destructivos? | Un `DELETE` o `POST` sin `@PreAuthorize` ni regla en `SecurityFilterChain`. | Matriz RBAC verificada; contraseñas con BCrypt factor 12; sin secretos en código. |
| **Integración** | ¿Tienen las llamadas externas timeouts y degradación? | Llamadas con `RestClient` sin timeout o reenvío del JSON externo crudo. | Timeouts de 2s/3s; Capa Anticorrupción; degradación elegante sin lanzar 500. |
| **Rendimiento** | ¿Existen consultas N+1 en relaciones JPA? | Relaciones `@OneToMany` con `FetchType.EAGER` o bucles `for` llamando a repositorios. | Consultas con `JOIN FETCH`, paginación en listados y transacciones de solo lectura (`readOnly = true`). |
| **Observabilidad** | ¿Están las trazas estructuradas con Correlation ID? | Uso de `System.out.println` o logs que imprimen contraseñas / tokens. | SLF4J en niveles adecuados, `logback-spring.xml` rotativo y `X-Correlation-ID` en MDC. |

### Paso a paso guiado · Enriquecimiento de OpenAPI y Swagger UI

<p class="stage">Paso 1 · Configuración global de OpenAPI con seguridad JWT</p>

Configuramos el bean de OpenAPI para que Swagger UI incluya el botón **Authorize** permitiendo probar endpoints protegidos con tokens Bearer:

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

<p class="stage">Paso 2 · Documentación declarativa en el controlador</p>

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
    public ResponseEntity<Void> subirAdjunto( ... )
```

### La comprobación · Inspección de Swagger UI y sesión de Code Review

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

### Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| Swagger sale vacío tras añadir seguridad | Las rutas de documentación no están permitidas | `/v3/api-docs/**` y `/swagger-ui/**` con `permitAll()` en tu `SecurityFilterChain` |
| *Try it out* devuelve `401` en todo | Falta declarar el esquema de seguridad | Añade el `SecurityScheme` `bearer`/`JWT` a `OpenApiConfig` para que aparezca el botón **Authorize** |
| La revisión del compañero no encuentra nada | El proyecto no se puede arrancar | Si no arranca en la máquina del revisor, ese ya es el primer hallazgo, y de los graves |
| Corriges un hallazgo y se rompen tres tests | Estabas cambiando comportamiento, no forma | Es información valiosa: significa que el comportamiento estaba probado. Decide cuál de los dos es correcto |
| SonarLint devuelve cientos de avisos | Estás mirando todas las severidades | Filtra por *Blocker* y *Critical*: el resto es ruido para lo que toca hoy |

### Ahora tú · Auditar y ser auditado

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

### Reto · Detección estática de deuda técnica con SonarLint

Instala la extensión **SonarLint** en tu entorno de desarrollo (IntelliJ o VS Code):
1. Analiza todos los archivos Java de tu proyecto.
2. Revisa la pestaña de problemas de SonarLint y clasifica los hallazgos según su tipología:
   * *Code Smells* (mantenibilidad).
   * *Bugs* potenciales (valores que pueden ser nulos, recursos no cerrados).
   * *Vulnerabilidades de seguridad*.
3. Resuelve las incidencias detectadas hasta dejar el código con cero advertencias de severidad alta.

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Si en la evaluación se solicita una memoria de auditoría técnica y revisión por pares de la aplicación, el formato oficial de entrega de texto es siempre un <strong>documento en PDF</strong> (<code>informe-revision-pares.pdf</code>), nunca un archivo markdown suelto.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Documentación OpenAPI 3 enriquecida con seguridad JWT visible en Swagger UI.</span></div>
  <div><strong>Si lo tienes</strong><span>Rúbrica de 5 dimensiones aplicada y corrección de hallazgos de arquitectura y rendimiento.</span></div>
  <div><strong>Reto</strong><span>Inspección estática de código con SonarLint y resolución completa de advertencias de deuda técnica.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 69</p>
  <ul class="checklist">
    <li>La documentación OpenAPI 3 se genera de forma viva y sincronizada con el código.</li>
    <li>La interfaz Swagger UI permite probar endpoints autenticados mediante tokens Bearer.</li>
    <li>Se aplica con rigor la metodología de revisión de código por pares (*Code Review*).</li>
    <li>Se utiliza una rúbrica estructurada evaluando arquitectura, seguridad y rendimiento.</li>
    <li>El código resultante es mantenible, legible y preparado para su entrega profesional.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué ventaja ofrece la documentación generada con OpenAPI frente a un manual de API redactado a mano?</li>
    <li>¿Cómo se configura OpenAPI para permitir autenticación por Bearer JWT en Swagger UI?</li>
    <li>¿Por qué una revisión de código debe centrarse en la arquitectura y la resiliencia y no en el estilo estético de formateo?</li>
    <li>¿Qué es el problema de las consultas N+1 en JPA y cómo se detecta durante una revisión de código?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Garantiza que la documentación nunca quede desactualizada respecto a la implementación real, ya que se autogenera directamente a partir del código y sus anotaciones.</p>
  <p>2 · Definiendo un SecurityScheme de tipo HTTP con esquema "bearer" y formato "JWT" en el bean de configuración de OpenAPI.</p>
  <p>3 · Porque el formateo estético debe delegarse a herramientas automáticas (linters/formatters); el criterio humano del revisor debe concentrarse en la lógica de negocio, la seguridad, la concurrencia y la mantenibilidad.</p>
  <p>4 · Ocurre cuando al consultar una lista de N entidades se dispara una consulta adicional individual por cada elemento para cargar sus relaciones perezosas (1 + N consultas SQL); se detecta revisando logs de SQL o buscando relaciones sin JOIN FETCH.</p>
</details>

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


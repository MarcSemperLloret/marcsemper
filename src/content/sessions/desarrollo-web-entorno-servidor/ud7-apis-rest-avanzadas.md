---
title: "APIs REST avanzadas"
label: "UD7 · Refinar"
section: "ud-07"
order: 7
lang: "es"
summary: "Lo que distingue una API que funciona de una que se puede consumir: relaciones expuestas con criterio, filtros, paginación, documentación y tests de endpoint."
duration: "12 horas · 2 semanas · 6 sesiones"
modality: "Taller de diseño · 40 % guía / 60 % autonomía"
deliverable: "Una API REST con relaciones, filtros, paginación, documentación OpenAPI y tests de endpoint."
date: "2026-09-02"
outcomes:
  - "Exponer relaciones sin filtrar el modelo interno ni provocar respuestas gigantes."
  - "Diseñar filtros y búsquedas que no se conviertan en un lenguaje de consulta improvisado."
  - "Paginar y ordenar colecciones declarando siempre el total."
  - "Comprobar endpoints con MockMvc sin depender de un cliente manual."
  - "Documentar la API con OpenAPI y evolucionar el contrato sin romper a quien lo consume."
requirements:
  - "El proyecto del primer trimestre terminado."
priorKnowledge:
  - "Diseño REST básico, DTO, validación y errores."
  - "JPA, relaciones y consultas."
---

<p class="lead">La API ya persiste datos y ya está bien nombrada. Falta lo que se nota cuando otro la consume: relaciones, filtros, páginas y documentación.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje bajo. Se plantean requisitos de consumo y el diseño concreto lo decide el alumnado, justificándolo.</p>
</div>

<div class="rule">
  <p class="rule-label">De dónde sale lo de hoy</p>
  <p>Esta unidad no abre nada nuevo: cobra las deudas de las anteriores. Las <strong>relaciones</strong> de la sesión 43 son las que modelaste en la UD5 y que hasta ahora solo existían en la base de datos. Los <strong>filtros y la paginación</strong> resuelven el «buscar recorre la lista entera» que la UD4 dejó anotado como defecto conocido. Los <strong>tests de endpoint</strong> con MockMvc son la capa que faltaba sobre los tests de service de la UD4 y los de repositorio de la UD5. Y la <strong>documentación</strong> convierte en contrato público el diseño REST que decidiste en la UD3.</p>
</div>

## Semana 15 · Consultar sin ahogar la respuesta

## Sesión 43 · Exponer relaciones sin romper el contrato

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> los tres patrones para exponer recursos relacionados en REST (incrustación resumida, subrecurso dedicado y enlace por ID), cómo prevenir respuestas gigantes (*payload bloat*) y cómo romper ciclos de serialización JSON.</li>
    <li><strong>2. Haz:</strong> diseña DTOs específicos de relación (<code>ProyectoResponse</code>, <code>TareaResumenResponse</code> y <code>TareaDetalleResponse</code>) e implementa el subrecurso REST canónico <code>GET /proyectos/{id}/tareas</code> sin filtrar entidades internas.</li>
    <li><strong>3. Comprueba:</strong> ejecutas peticiones HTTP en Bruno o Postman verificando que la respuesta es compacta, no arrastra datos innecesarios y elimina cualquier riesgo de recursión infinita.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué ocurre a nivel de serialización JSON si un controlador devuelve directamente una entidad JPA que tiene una relación bidireccional <code>@OneToMany</code> y <code>@ManyToOne</code>?</li>
    <li>¿Qué tres opciones existen para representar un recurso relacionado en el JSON de respuesta de una API REST?</li>
    <li>¿Por qué incluir la lista completa de tareas dentro del detalle de un proyecto puede convertirse en un problema grave de rendimiento cuando el sistema crece?</li>
  </ol>
</div>

### El dilema de la profundidad relacional en REST

En la UD5 aprendiste a modelar relaciones en PostgreSQL y JPA: un proyecto tiene muchas tareas, una tarea pertenece a un proyecto y tiene muchas etiquetas.

Cuando trasladas ese grafo relacional a una API REST surge una pregunta crítica de diseño: **¿cuánta información relacionada debe devolver un endpoint?**

Si un cliente solicita `GET /proyectos/1`, existen dos extremos desastrosos:

<dl class="worked">
  <dt>❌ El extremo del bucle infinito y el volcado masivo</dt>
  <dd>Si devuelves la entidad directamente o incrustas todo su grafo, el serializador Jackson intentará convertir el <code>Proyecto</code> a JSON; al leer sus tareas, convertirá cada <code>Tarea</code>; al leer el proyecto de la tarea, volverá a serializar el <code>Proyecto</code>, provocando un <code>StackOverflowError</code> por ciclo infinito. Incluso rompiendo el ciclo con anotaciones, una sola petición acabará devolviendo miles de filas de la base de datos (tareas, etiquetas, usuarios).</dd>
  <dt>❌ El extremo de la pobreza de datos (over-fetching / under-fetching)</dt>
  <dd>Si devuelves solo los datos planos del proyecto sin ninguna información de sus tareas, obligas al cliente a realizar decenas de peticiones adicionales para saber siquiera si el proyecto tiene trabajo asignado.</dd>
</dl>

<div class="rule">
  <p class="rule-label">La ley del contrato acotado</p>
  <p><strong>Un recurso nunca debe exponer el grafo completo de persistencia.</strong></p>
  <p>Cada endpoint debe responder únicamente a las necesidades de su caso de uso de cliente, delimitando la frontera de datos mediante DTOs específicos.</p>
</div>

### Los tres patrones para exponer recursos relacionados

Para diseñar una API REST limpia y predecible, disponemos de tres patrones fundamentales:

<figure class="diagram">
  <figcaption>Patrones de diseño para exponer relaciones en APIs REST</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Incrustación resumida (Embedded Summary)</li>
    <li>2. Subrecurso dedicado (/padre/{id}/hijos)</li>
    <li>3. Identificador plano o URI de enlace</li>
  </ol>
</figure>

| Patrón | En qué consiste | Cuándo utilizarlo | Ejemplo en nuestra API |
| :--- | :--- | :--- | :--- |
| **1 · Incrustación resumida** (*Embedded Summary*) | El DTO padre incluye un resumen compacto del hijo (solo los campos que el cliente necesita para pintar la vista principal). | La relación es 1:1 o 1:N pequeña, y los datos del hijo son inseparables del padre en la interfaz. | En `TareaResponse`: incluir `proyectoId` y `proyectoNombre`. |
| **2 · Subrecurso dedicado** (*Sub-resource endpoint*) | La colección hija no se incrusta en el padre; se expone a través de una ruta jerárquica propia. | La colección hija puede ser numerosa, tiene ciclo de vida propio o requiere paginación y filtros independientes. | `GET /proyectos/{id}/tareas` para listar las tareas de un proyecto. |
| **3 · Identificador o Enlace** | El DTO devuelve únicamente la clave ajena (`Long responsableId`) o un enlace URI al recurso completo. | El cliente rara vez necesita los datos del recurso vinculado de forma inmediata. | En `TareaResponse`: `Long responsableId` en lugar del usuario completo. |

### Paso a paso guiado · Subrecursos desacoplados y DTOs específicos

Vamos a aplicar estos patrones al gestor de proyectos para que un cliente pueda consultar tanto el proyecto de forma ligera como su colección de tareas asociadas sin saturar la red.

<p class="stage">Paso 1 · Diseñar los DTOs de salida específicos</p>

Creamos dos representaciones distintas según la vista del cliente:

```java
// DTO ligero para listar proyectos sin arrastrar colecciones
public record ProyectoResponse(
    Long id,
    String nombre,
    String descripcion,
    boolean activo,
    LocalDateTime creadoEn
) {}

// DTO resumen de tarea para subrecursos y listados
public record TareaResumenResponse(
    Long id,
    String titulo,
    String prioridad,
    boolean completada
) {}

// DTO detallado de tarea cuando se consulta una tarea individual
public record TareaDetalleResponse(
    Long id,
    String titulo,
    String prioridad,
    boolean completada,
    Long proyectoId,
    String proyectoNombre,
    List<String> etiquetas
) {}
```

<div class="rule">
  <p class="rule-label">Lo que el DTO deja fuera a propósito</p>
  <p>Observa cómo <code>TareaDetalleResponse</code> no contiene un objeto <code>Proyecto</code> anidado con todos sus campos ni entidades <code>Etiqueta</code>, sino solo los datos planos que la pantalla necesita (<code>proyectoId</code>, <code>proyectoNombre</code> y nombres de etiquetas). El contrato es completamente inmune a cambios internos del esquema.</p>
</div>

<p class="stage">Paso 2 · Definir la consulta en TareaRepository</p>

Para resolver el subrecurso sin provocar problemas N+1, definimos la consulta filtrada por la clave foránea en `TareaRepository`:

```java
public interface TareaRepository extends JpaRepository<Tarea, Long> {

    @Query("SELECT t FROM Tarea t WHERE t.proyecto.id = :proyectoId ORDER BY t.id ASC")
    List<Tarea> findByProyectoId(@Param("proyectoId") Long proyectoId);
}
```

<p class="stage">Paso 3 · Implementar la regla en TareaService</p>

El servicio valida primero la existencia del proyecto padre antes de buscar sus tareas, garantizando que un identificador erróneo devuelva un código HTTP semántico:

```java
@Service
@Transactional(readOnly = true)
public class TareaService {

    private final TareaRepository tareaRepository;
    private final ProyectoRepository proyectoRepository;
    private final TareaMapper tareaMapper;

    public TareaService(TareaRepository tareaRepository,
                        ProyectoRepository proyectoRepository,
                        TareaMapper tareaMapper) {
        this.tareaRepository = tareaRepository;
        this.proyectoRepository = proyectoRepository;
        this.tareaMapper = tareaMapper;
    }

    public List<TareaResumenResponse> listarTareasDeProyecto(Long proyectoId) {
        if (!proyectoRepository.existsById(proyectoId)) {
            throw new RecursoNoEncontradoException("No existe proyecto con id " + proyectoId);
        }
        return tareaRepository.findByProyectoId(proyectoId).stream()
                .map(tareaMapper::toResumenResponse)
                .toList();
    }
}
```

<p class="stage">Paso 4 · Exponer el subrecurso en ProyectoController</p>

En la arquitectura REST, los subrecursos jerárquicos se definen colgando de la ruta del padre:

```java
@RestController
@RequestMapping("/proyectos")
public class ProyectoController {

    private final ProyectoService proyectoService;
    private final TareaService tareaService;

    public ProyectoController(ProyectoService proyectoService, TareaService tareaService) {
        this.proyectoService = proyectoService;
        this.tareaService = tareaService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProyectoResponse> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(proyectoService.buscarPorId(id));
    }

    // Subrecurso canónico: GET /proyectos/{id}/tareas
    @GetMapping("/{id}/tareas")
    public ResponseEntity<List<TareaResumenResponse>> obtenerTareas(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.listarTareasDeProyecto(id));
    }
}
```

### La comprobación · Verificar la frontera de datos en Bruno

Arranca tu aplicación y ejecuta estas dos peticiones en **Bruno** o **Postman**:

1. **Consulta del proyecto:** `GET http://localhost:8080/proyectos/1`
   * Código de respuesta: `200 OK`.
   * El cuerpo JSON contiene únicamente los atributos del proyecto (`id`, `nombre`, `descripcion`, etc.). Cero tareas incrustadas. Payload inferior a 500 bytes.
2. **Consulta de las tareas del subrecurso:** `GET http://localhost:8080/proyectos/1/tareas`
   * Código de respuesta: `200 OK`.
   * El cuerpo JSON devuelve un array con las tareas correspondientes a ese proyecto, con su id, título, prioridad y estado.
3. **Caso límite (proyecto inexistente):** `GET http://localhost:8080/proyectos/999/tareas`
   * Código de respuesta: `404 Not Found`.
   * El servicio intercepta la ausencia del padre y emite el error estándar RFC 7807 sin devolver un array vacío engañoso.

### Ahora tú · Subrecurso de etiquetas por tarea

Aplica el mismo principio para exponer la relación Many-to-Many entre tareas y etiquetas mediante un subrecurso dedicado:

1. Define el DTO `EtiquetaResponse(Long id, String nombre, String colorHex)`.
2. Implementa en `TareaController` el endpoint de subrecurso:
   `GET /tareas/{id}/etiquetas`
3. En el servicio, valida que la tarea exista (`existsById`) y recupera sus etiquetas asociadas.
4. Asegúrate de que `EtiquetaResponse` no incluya la lista de tareas de vuelta (para no generar ciclos de datos).
5. Comprueba en Bruno que al consultar las etiquetas de una tarea se devuelve la lista limpia con código `200 OK`.

### Reto · ¿Incrustar o enlazar? El parámetro `?expand` frente al subrecurso

En APIs públicas de gran escala (como Stripe o GitHub) a veces se utiliza un parámetro de consulta para permitir al cliente decidir si quiere incrustar un recurso relacionado en una sola llamada:

* *Ejemplo:* `GET /proyectos/1?expand=tareas` frente a `GET /proyectos/1/tareas`.

Analiza y responde con criterio de ingeniería:
1. ¿Qué ventaja de latencia tiene el parámetro `?expand` para una aplicación móvil conectada con cobertura 4G inestable?
2. ¿Qué coste arquitectónico introduce soportar `?expand` en la capa de servicios y en los mappers de DTOs en comparación con mantener dos endpoints separados?
3. ¿Cómo resolverías la consulta en JPA si el cliente envía `?expand=tareas` para evitar que Hibernate ejecute consultas adicionales innecesarias?

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Si en la evaluación se solicita una justificación de diseño de endpoints de relaciones, el formato de entrega de texto es siempre un <strong>documento en PDF</strong> (<code>analisis-relaciones.pdf</code>), nunca un archivo markdown suelto.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>DTOs de salida desacoplados y subrecurso <code>GET /proyectos/{id}/tareas</code> devolviendo <code>TareaResumenResponse</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Subrecurso <code>GET /tareas/{id}/etiquetas</code> implementado con validación de existencia del padre y código 404 semántico.</span></div>
  <div><strong>Reto</strong><span>Análisis del compromiso técnico de <code>?expand</code> frente a subrecursos justificado con métricas de red y complejidad en JPA.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 43</p>
  <ul class="checklist">
    <li>Ninguna entidad JPA se serializa directamente en las respuestas HTTP de controladores.</li>
    <li>Las respuestas de detalle de proyectos no arrastran colecciones masivas de tareas en su carga inicial.</li>
    <li>Los subrecursos jerárquicos (<code>/proyectos/{id}/tareas</code>) responden a colecciones de recursos relacionados.</li>
    <li>La petición a un subrecurso de un padre inexistente responde <code>404 Not Found</code> en lugar de un array vacío.</li>
    <li>Las relaciones Many-to-Many no provocan recursión infinita ni bucles circulares en Jackson.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué se produce una excepción <code>StackOverflowError</code> al serializar directamente entidades JPA bidireccionales?</li>
    <li>¿Cuál es la diferencia entre el patrón <em>Embedded Summary</em> y el patrón <em>Sub-resource</em>?</li>
    <li>¿Por qué una consulta a <code>GET /proyectos/999/tareas</code> debe devolver 404 y no un array vacío <code>[]</code>?</li>
    <li>¿Qué beneficio aporta devolver <code>Long proyectoId</code> en el DTO de tarea en lugar de un objeto <code>Proyecto</code> anidado completo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque Jackson serializa el padre, que contiene a los hijos; al serializar cada hijo, Jackson lee la referencia hacia el padre y vuelve a serializarlo recursivamente sin fin hasta agotar la pila de memoria (call stack).</p>
  <p>2 · Embedded Summary incrusta un resumen compacto de los datos del hijo dentro del propio JSON del recurso padre; Sub-resource externaliza la colección a una URL jerárquica independiente (/padre/{id}/hijos).</p>
  <p>3 · Porque el recurso padre (el proyecto 999) no existe en el sistema. Devolver un array vacío induciría al cliente a pensar erróneamente que el proyecto existe pero que simplemente no tiene tareas asignadas todavía.</p>
  <p>4 · Reduce el tamaño del JSON transmitido por red (payload), evita consultas SQL innecesarias de atributos no utilizados y aísla el contrato de la API de cambios en la estructura interna de la entidad proyecto.</p>
</details>

## Sesión 44 · Filtros y búsqueda

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> cómo diseñar filtros combinables con parámetros de consulta (<em>Query Parameters</em>), cómo formular búsquedas textuales parciales insensibles a mayúsculas y cómo implementar consultas dinámicas en Spring Data JPA sin explosión combinatoria de endpoints.</li>
    <li><strong>2. Haz:</strong> implementa un endpoint de consulta multicriterio <code>GET /tareas?proyectoId=...&prioridad=...&completada=...&q=...</code> con JPQL condicional y manejo de valores opcionales en el repositorio.</li>
    <li><strong>3. Comprueba:</strong> ejecutas peticiones en Bruno combinando criterios en distintas variaciones y auditas la consola SQL para verificar que PostgreSQL solo filtra por los parámetros enviados.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué crear rutas específicas como <code>/tareas/urgentes</code> o <code>/tareas/por-proyecto</code> es un antipatrón cuando la aplicación crece?</li>
    <li>¿Qué diferencia técnica y semántica existe entre un <code>@PathVariable</code> y un <code>@RequestParam</code> en Spring MVC?</li>
    <li>Si un cliente no envía un parámetro opcional en la URL, ¿qué valor recibe el método del controlador y cómo debe tratarlo la consulta en la base de datos?</li>
  </ol>
</div>

### La trampa de la explosión combinatoria de endpoints

Cuando una API empieza a usarse, los clientes necesitan filtrar información:
* El frontend de proyectos necesita ver *las tareas de un proyecto*.
* El panel de incidencias necesita ver *las tareas de prioridad alta*.
* El informe de calidad necesita ver *las tareas completadas de un proyecto*.
* El buscador necesita encontrar tareas cuyo título contenga una palabra clave.

Un desarrollador principiante suele caer en la **explosión combinatoria de rutas**:
* `GET /tareas/proyecto/{id}`
* `GET /tareas/prioridad/{prioridad}`
* `GET /tareas/completadas`
* `GET /tareas/proyecto/{id}/prioridad/{prioridad}`
* `GET /tareas/proyecto/{id}/completadas`

Con tan solo 4 criterios combinables, ¡necesitarías crear $2^4 = 16$ endpoints distintos en tu controlador!

<div class="rule">
  <p class="rule-label">La convención REST para filtros</p>
  <p><strong>Un recurso de colección tiene una única ruta canónica en plural (<code>/tareas</code>).</strong></p>
  <p>Todas las variaciones de filtrado, búsqueda y ordenación se transmiten mediante parámetros de consulta en la URL (<em>Query Parameters</em>): <code>GET /tareas?prioridad=ALTA&completada=false</code>.</p>
</div>

### Estrategias de filtrado en Spring Data JPA

Para resolver consultas con parámetros opcionales en Spring Data existen tres enfoques principales:

| Enfoque | Cómo funciona | Ventajas y Desventajas |
| :--- | :--- | :--- |
| **Métodos derivados** (`findBy...`) | Nombres de método largos como `findByProyectoIdAndPrioridadAndCompletada`. | Inviable con filtros opcionales: si un parámetro viene nulo, Spring busca filas con valor `NULL` en lugar de omitir el filtro. |
| **JPQL condicional con comprobación de nulos** | Consulta `@Query` con cláusulas `(:param IS NULL OR columna = :param)`. | **Recomendado para 2-5 filtros comunes.** Muy legible, nativo de JPA, sin librerías externas y con excelente rendimiento. |
| **Spring Data Specifications (Criteria API)** | Objetos `Specification<T>` que componen el predicado SQL dinámicamente con la API de criterios de JPA. | Máxima flexibilidad para catálogos con 15+ filtros dinámicos, pero introduce mayor complejidad de código y boiler plate. |

### Búsqueda textual insensible a mayúsculas y acentos

Para que un buscador sea usable, escribir `"bug"`, `"Bug"` o `"BUG"` debe devolver exactamente los mismos resultados. 

En JPQL aplicamos la función `LOWER()` a ambos lados de la comparación y utilizamos el operador `LIKE` con comodines:

```sql
LOWER(t.titulo) LIKE LOWER(CONCAT('%', :q, '%'))
```

Si el parámetro `:q` es nulo o viene vacío, la cláusula `(:q IS NULL OR ...)` desactiva la condición y devuelve todos los registros.

### Paso a paso guiado · Consulta multicriterio de tareas

Vamos a construir el buscador de tareas combinable en nuestra aplicación:

<p class="stage">Paso 1 · Diseñar la consulta JPQL en TareaRepository</p>

Añadimos el método de búsqueda en `TareaRepository` asegurándonos de incluir `JOIN FETCH` sobre el proyecto para evitar el problema N+1:

```java
public interface TareaRepository extends JpaRepository<Tarea, Long> {

    @Query("""
        SELECT t FROM Tarea t
        JOIN FETCH t.proyecto p
        WHERE (:proyectoId IS NULL OR p.id = :proyectoId)
          AND (:prioridad IS NULL OR t.prioridad = :prioridad)
          AND (:completada IS NULL OR t.completada = :completada)
          AND (:q IS NULL OR LOWER(t.titulo) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY t.id ASC
    """)
    List<Tarea> buscarConFiltros(
        @Param("proyectoId") Long proyectoId,
        @Param("prioridad") String prioridad,
        @Param("completada") Boolean completada,
        @Param("q") String q
    );
}
```

<div class="rule">
  <p class="rule-label">Por qué un filtro nulo no penaliza la consulta</p>
  <p>Al escribir <code>(:proyectoId IS NULL OR p.id = :proyectoId)</code>, si el cliente no envía el parámetro en la petición, el valor es <code>null</code>. La primera mitad de la condición se evalúa como <code>TRUE</code> y el motor de base de datos descarta ese filtro sin examinar la columna, evaluando únicamente los filtros que sí fueron proporcionados.</p>
</div>

<p class="stage">Paso 2 · Implementar el servicio con sanitización de texto</p>

En `TareaService`, limpiamos los espacios en blanco del término de búsqueda y tratamos cadenas vacías como nulos:

```java
@Service
@Transactional(readOnly = true)
public class TareaService {

    private final TareaRepository tareaRepository;
    private final TareaMapper tareaMapper;

    public TareaService(TareaRepository tareaRepository, TareaMapper tareaMapper) {
        this.tareaRepository = tareaRepository;
        this.tareaMapper = tareaMapper;
    }

    public List<TareaResumenResponse> buscarTareas(Long proyectoId,
                                                  String prioridad,
                                                  Boolean completada,
                                                  String q) {
        // Normalizamos el texto de búsqueda: cadena vacía o espacios se tratan como null
        String terminoLimpio = (q != null && !q.isBlank()) ? q.trim() : null;
        String prioridadLimpia = (prioridad != null && !prioridad.isBlank()) ? prioridad.toUpperCase().trim() : null;

        return tareaRepository.buscarConFiltros(proyectoId, prioridadLimpia, completada, terminoLimpio)
                .stream()
                .map(tareaMapper::toResumenResponse)
                .toList();
    }
}
```

<p class="stage">Paso 3 · Exponer el endpoint unificado en TareaController</p>

En `TareaController`, definimos los parámetros como `@RequestParam(required = false)`:

```java
@RestController
@RequestMapping("/tareas")
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @GetMapping
    public ResponseEntity<List<TareaResumenResponse>> listar(
        @RequestParam(required = false) Long proyectoId,
        @RequestParam(required = false) String prioridad,
        @RequestParam(required = false) Boolean completada,
        @RequestParam(required = false) String q
    ) {
        List<TareaResumenResponse> resultado = tareaService.buscarTareas(proyectoId, prioridad, completada, q);
        return ResponseEntity.ok(resultado);
    }
}
```

### La comprobación · Pruebas combinatorias en Bruno

Abre **Bruno** o **Postman** y verifica cómo se comporta el mismo endpoint `/tareas` según los parámetros que envíes:

1. **Sin parámetros:** `GET http://localhost:8080/tareas`
   * Devuelve la lista completa de todas las tareas del sistema.
2. **Un solo filtro:** `GET http://localhost:8080/tareas?prioridad=ALTA`
   * Devuelve únicamente tareas con prioridad `ALTA`.
3. **Filtros combinados:** `GET http://localhost:8080/tareas?proyectoId=1&completada=false`
   * Devuelve solo las tareas pendientes que pertenecen al proyecto 1.
4. **Búsqueda textual:** `GET http://localhost:8080/tareas?q=auth`
   * Devuelve tareas cuyo título contenga la palabra `"auth"`, `"Auth"` o `"AUTORIZACION"`.
5. **Todos los filtros a la vez:** `GET http://localhost:8080/tareas?proyectoId=1&prioridad=ALTA&completada=false&q=login`
   * Devuelve la intersección exacta de todos los criterios.
6. **Auditoría de consola SQL:**
   * Observa la sentencia emitida en la terminal: verás una única consulta SQL con `LEFT/INNER JOIN` y la cláusula `WHERE` evaluada de forma limpia en PostgreSQL.

### Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| Sin filtros no devuelve nada | El `IS NULL` de la condición falta | Un parámetro ausente debe desactivar su filtro, no filtrar por vacío |
| `?activo=true` devuelve todo | El tipo es `boolean` y no `Boolean` | Un primitivo nunca puede ser `null`, así que el filtro se aplica siempre con `false` |
| La búsqueda distingue mayúsculas | Falta normalizar los dos lados | `LOWER(p.nombre) LIKE LOWER(:q)`, y el `%` se añade en Java, no en el JPQL |
| `Parameter with that name did not exist` | El `@Param` no coincide | El nombre del `@Param` debe ser idéntico al `:nombre` de la consulta |
| Filtrar por texto con acentos no encuentra nada | Colación de PostgreSQL | Es comportamiento del motor, no de tu código: anótalo como limitación conocida |

### Ahora tú · Filtro de proyectos por estado y nombre

Aplica el patrón de filtrado a la entidad `Proyecto`:

1. Añade en `ProyectoRepository` una consulta `buscarConFiltros` que reciba `Boolean activo` y `String q`. Fíjate en que es `Boolean` con mayúscula: necesitas poder distinguir «filtra por activos» de «no filtres por este campo», y un `boolean` primitivo no puede expresar esa diferencia.
2. En `ProyectoService`, normaliza el término de búsqueda: recorta espacios, pásalo a minúsculas y trata la cadena vacía como si no hubieran enviado nada. Un `?q=` vacío no debe vaciar la lista.
3. Actualiza `GET /proyectos` para admitir `?activo=true&q=portal`.
4. Comprueba las **cuatro** combinaciones, no solo la que funciona: sin filtros, solo `activo`, solo `q`, y los dos a la vez. La tabla de verdad completa es lo que demuestra que la consulta condicional está bien escrita.
5. Prueba los casos incómodos y decide qué hace cada uno: `?q=` vacío, `?q=%`, `?q=` con 300 caracteres y `?activo=quizas`. Ese último debe dar `400`, y lo da solo si el tipo es `Boolean`: compruébalo.
6. Añade un test de `@WebMvcTest` que verifique que `?activo=true` llega al servicio como `Boolean.TRUE` y que una petición sin parámetros lo recibe como `null`. Es la forma de blindar que el filtro opcional sigue siendo opcional dentro de seis meses.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Las cuatro combinaciones de filtros devuelven lo que deben; una petición sin parámetros devuelve la lista completa y no una vacía; un valor no booleano devuelve <code>400</code>; y la búsqueda encuentra igual escribiendo en mayúsculas o en minúsculas.</dd>
</dl>

### Reto · Caracteres especiales y seguridad en búsquedas `LIKE`

En las consultas con operador `LIKE`, los caracteres `%` (cualquier secuencia) y `_` (cualquier carácter único) son comodines del motor SQL.

Analiza qué ocurre si un usuario malicioso o despistado introduce en el buscador la cadena `?q=%`:
1. ¿Qué consulta SQL acabaría ejecutando PostgreSQL y qué impacto tendría en el uso de CPU si la tabla tiene 2.000.000 de filas?
2. ¿Por qué una búsqueda que empieza con comodín a la izquierda (`%texto`) anula la capacidad de la base de datos de utilizar un índice B-Tree convencional?
3. Diseña una función de saneamiento en Java que escape los caracteres comodín (`\%` y `\_`) antes de pasar el parámetro a la consulta JPQL.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Endpoint <code>GET /tareas</code> con filtros combinables opcionales de proyecto, prioridad y completada.</span></div>
  <div><strong>Si lo tienes</strong><span>Búsqueda textual insensible a mayúsculas con <code>LOWER()</code> y filtro de proyectos implementado.</span></div>
  <div><strong>Reto</strong><span>Escape de comodines SQL (<code>%</code>, <code>_</code>) implementado y análisis de impacto en índices B-Tree justificado.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 44</p>
  <ul class="checklist">
    <li>La API utiliza una única ruta canónica en plural para consultar colecciones (<code>/tareas</code>, <code>/proyectos</code>).</li>
    <li>Todos los filtros se transmiten como parámetros de consulta (<code>@RequestParam(required = false)</code>).</li>
    <li>La consulta JPQL resuelve combinaciones arbitrarias de filtros sin requerir múltiples métodos en el repositorio.</li>
    <li>La búsqueda textual es insensible a mayúsculas mediante <code>LOWER()</code> y limpia espacios superfluos.</li>
    <li>La consulta no provoca el problema N+1 al incluir <code>JOIN FETCH</code> sobre las entidades relacionadas.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es preferible usar parámetros de consulta (query params) frente a crear rutas dedicadas para cada filtro?</li>
    <li>¿Cómo funciona el truco de <code>(:param IS NULL OR columna = :param)</code> en una consulta JPQL?</li>
    <li>¿Por qué debemos usar <code>LOWER()</code> en ambos lados de una comparación <code>LIKE</code>?</li>
    <li>¿Qué ocurre con los índices tradicionales de base de datos cuando una búsqueda utiliza <code>%termino%</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque evita la explosión combinatoria de rutas (2^N endpoints), respeta la semántica REST de tener una única URI canónica por recurso y permite al cliente combinar cualquier número de filtros opcionales libremente.</p>
  <p>2 · Si el parámetro es null (no se envió en la petición HTTP), la primera parte se evalúa como verdadera y desactiva ese filtro para toda la consulta. Si no es null, se evalúa la segunda parte comparando con el valor de la columna.</p>
  <p>3 · Porque muchos motores relacionales (incluido PostgreSQL con ciertas configuraciones de intercalación o JPQL estándar) distinguen mayúsculas de minúsculas en LIKE; convertir ambos operandos a minúsculas garantiza coincidencias uniformes.</p>
  <p>4 · El motor de base de datos no puede utilizar un índice B-Tree para saltar directamente a los registros porque no conoce el prefijo de inicio, obligando a un escaneo secuencial completo de la tabla (Full Table Scan).</p>
</details>

## Sesión 45 · Paginación y ordenación en la API

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> los riesgos del consumo sin límites, la abstracción <code>Pageable</code>, <code>Page&lt;T&gt;</code> y <code>Sort</code> de Spring Data, y la estructura estándar de una respuesta paginada con metadatos para el cliente.</li>
    <li><strong>2. Haz:</strong> implementa paginación y ordenación automática en los endpoints de proyectos y tareas utilizando <code>@PageableDefault</code> y mapeo funcional sobre páginas.</li>
    <li><strong>3. Comprueba:</strong> ejecutas peticiones en Bruno variando <code>page</code>, <code>size</code> y <code>sort</code>, verificando en los registros SQL que PostgreSQL ejecuta cláusulas <code>LIMIT</code>, <code>OFFSET</code> y <code>ORDER BY</code> reales.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué consecuencias fatales tiene para un servidor backend ejecutar <code>findAll()</code> sobre una tabla con 500.000 registros en un entorno real de producción?</li>
    <li>¿Qué cuatro metadatos numéricos necesita conocer cualquier interfaz de usuario (web o móvil) para poder renderizar una barra de paginación completa?</li>
    <li>¿Por qué los parámetros de ordenación recibidos desde el cliente deben ser validados para evitar exponer nombres de columnas de base de datos?</li>
  </ol>
</div>

### El colapso del `findAll()` sin límites

Durante las primeras semanas de desarrollo, todas las tablas tienen 10 o 20 filas. En ese escenario, hacer `tareaRepository.findAll()` parece inofensivo: responde en 3 milisegundos y todo funciona.

El desastre ocurre cuando la aplicación entra en producción:
* La tabla `tareas` alcanza **200.000 registros**.
* Un usuario entra al panel y el controlador ejecuta `findAll()`.
* Hibernate crea 200.000 objetos Java en la memoria Heap.
* El recolector de basura (Garbage Collector) se satura intentando liberar memoria, congelando la JVM.
* Jackson genera un JSON de **65 Megabytes** que satura el ancho de banda y bloquea el navegador del cliente.

<div class="rule">
  <p class="rule-label">La ley de la colección acotada</p>
  <p><strong>Ninguna API de producción debe devolver una colección sin paginar.</strong></p>
  <p>Todo endpoint que devuelva múltiples registros debe exigir un límite de tamaño por página y declarar el número total de elementos existentes.</p>
</div>

### Anatomía de una respuesta paginada profesional

Un cliente que consume una API paginada no solo necesita los datos: necesita **metadatos de navegación**. 

Spring Boot proporciona el objeto contenedor `Page<T>`, que se serializa en un JSON estructurado con esta información:

```json
{
  "content": [
    { "id": 1, "nombre": "Portal Web", "activo": true },
    { "id": 2, "nombre": "App Móvil", "activo": true }
  ],
  "page": {
    "size": 2,
    "number": 0,
    "totalElements": 15,
    "totalPages": 8
  },
  "first": true,
  "last": false
}
```

| Metadato | Significado para el cliente |
| :--- | :--- |
| `content` | La lista de elementos correspondiente a la página actual. |
| `number` | El índice de la página actual (**en Spring empieza en 0**). |
| `size` | Cantidad máxima de registros devueltos por página. |
| `totalElements` | Total absoluto de registros que cumplen los filtros en toda la base de datos. |
| `totalPages` | Número total de páginas disponibles (`ceil(totalElements / size)`). |
| `first` / `last` | Booleanos que indican si estamos en la primera o en la última página (para deshabilitar botones de anterior/siguiente en la UI). |

### Paginación en PostgreSQL: `LIMIT` y `OFFSET`

Cuando Spring Data JPA procesa un objeto `Pageable`, traduce automáticamente la petición a dos consultas SQL nativas en PostgreSQL:

```sql
-- 1. Consulta de datos acotada a la página solicitada (page=1, size=10)
SELECT p.id, p.nombre, p.descripcion, p.activo, p.creado_en
FROM proyectos p
ORDER BY p.creado_en DESC
LIMIT 10 OFFSET 10;

-- 2. Consulta de conteo para calcular el total de páginas
SELECT COUNT(p.id) FROM proyectos p;
```

De esta forma, la memoria de la máquina virtual solo almacena 10 objetos, con independencia de que la tabla contenga millones de filas.

### Paso a paso guiado · Implementar paginación y ordenación

Vamos a paginar el listado de proyectos con ordenación configurable:

<p class="stage">Paso 1 · Habilitar Pageable en ProyectoRepository</p>

En `ProyectoRepository`, `JpaRepository` ya hereda soporte para `Pageable`. Añadimos además un método derivado para filtrar por estado con paginación:

```java
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {

    // Heredado: Page<Proyecto> findAll(Pageable pageable);

    // Consulta filtrada por estado con paginación integrada
    Page<Proyecto> findByActivo(boolean activo, Pageable pageable);
}
```

<p class="stage">Paso 2 · Mapear la página en ProyectoService</p>

La interfaz `Page<T>` de Spring incluye un método funcional `.map()` que transforma los elementos internos preservando intactos todos los metadatos de paginación:

```java
@Service
@Transactional(readOnly = true)
public class ProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final ProyectoMapper proyectoMapper;

    public ProyectoService(ProyectoRepository proyectoRepository, ProyectoMapper proyectoMapper) {
        this.proyectoRepository = proyectoRepository;
        this.proyectoMapper = proyectoMapper;
    }

    public Page<ProyectoResponse> listarProyectos(Boolean activo, Pageable pageable) {
        Page<Proyecto> paginaEntidades;

        if (activo != null) {
            paginaEntidades = proyectoRepository.findByActivo(activo, pageable);
        } else {
            paginaEntidades = proyectoRepository.findAll(pageable);
        }

        // El método .map() convierte cada Proyecto a ProyectoResponse manteniendo la estructura de Page
        return paginaEntidades.map(proyectoMapper::toResponse);
    }
}
```

<p class="stage">Paso 3 · Configurar el endpoint en ProyectoController con @PageableDefault</p>

En el controlador, utilizamos `@PageableDefault` para establecer valores por defecto seguros en caso de que el cliente no envíe parámetros de paginación:

```java
@RestController
@RequestMapping("/proyectos")
public class ProyectoController {

    private final ProyectoService proyectoService;

    public ProyectoController(ProyectoService proyectoService) {
        this.proyectoService = proyectoService;
    }

    @GetMapping
    public ResponseEntity<Page<ProyectoResponse>> listar(
        @RequestParam(required = false) Boolean activo,
        @PageableDefault(page = 0, size = 10, sort = "creadoEn", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ProyectoResponse> pagina = proyectoService.listarProyectos(activo, pageable);
        return ResponseEntity.ok(pagina);
    }
}
```

### La comprobación · Navegar por páginas y ordenar en Bruno

Ejecuta estas peticiones en **Bruno** o **Postman** y analiza los resultados:

1. **Petición por defecto:** `GET http://localhost:8080/proyectos`
   * Devuelve un máximo de 10 proyectos ordenados por fecha de creación descendente (`page=0, size=10`).
2. **Cambiar tamaño de página:** `GET http://localhost:8080/proyectos?size=2`
   * Devuelve solo 2 proyectos y calcula el total de páginas correspondiente (`totalPages = totalElements / 2`).
3. **Navegar a la segunda página:** `GET http://localhost:8080/proyectos?page=1&size=2`
   * Devuelve los elementos del 3 al 4. Observa que `"number": 1` y `"first": false`.
4. **Ordenar por nombre ascendente:** `GET http://localhost:8080/proyectos?sort=nombre,asc`
   * Los proyectos aparecen en estricto orden alfabético.
5. **Comprobar la consola SQL:**
   * Verifica que Hibernate emite la cláusula `LIMIT ? OFFSET ?` en PostgreSQL junto con el `SELECT count(...)`.

### Ahora tú · Combinar filtros multicriterio con paginación en Tareas

Combina lo aprendido en la sesión 44 con la paginación de esta sesión en la entidad `Tarea`:

1. Modifica `TareaRepository.buscarConFiltros` para que reciba como último argumento `Pageable pageable` y devuelva `Page<Tarea>`.
2. Actualiza `TareaService` para que devuelva `Page<TareaResumenResponse>` usando `.map()`.
3. Configura en `TareaController`:
   `@PageableDefault(page = 0, size = 15, sort = "id", direction = Sort.Direction.ASC) Pageable pageable`
4. Prueba en Bruno la combinación de filtros y paginación:
   `GET /tareas?prioridad=ALTA&completada=false&page=0&size=5&sort=titulo,asc`
5. Verifica que los metadatos `totalElements` reflejan el total de tareas **filtradas**, no el total absoluto de la tabla. Es el error más habitual: si pides `?completada=false&size=5` y `totalElements` te devuelve el número de filas de toda la tabla, el cliente calculará mal el número de páginas y mostrará páginas vacías al final.
6. **Mira el SQL.** Con `show-sql=true` activado, comprueba que una petición paginada genera **dos** sentencias: un `SELECT ... LIMIT ? OFFSET ?` y un `SELECT count(*)`. Esa segunda es el precio de poder decirle al cliente cuántas páginas hay. Si no la necesitas, devolver `Slice` en vez de `Page` la evita.
7. **Comprueba los límites**, que es donde se rompe la paginación:
   * `?page=999` sobre una tabla de 20 filas: debe devolver `200` con una lista vacía y los metadatos correctos, nunca un `404` ni un error.
   * `?size=10000`: decide si lo permites. Si no pones techo, un cliente puede pedirte la tabla entera en una sola petición y tirarte la memoria, que es justo lo que la paginación venía a evitar. Configura `spring.data.web.pageable.max-page-size`.
   * `?sort=campoQueNoExiste`: comprueba qué pasa y decide si un `500` es aceptable como respuesta a un parámetro mal escrito.
8. Documenta en tu cuaderno el contrato de paginación que has fijado: nombre de los parámetros, tamaño por defecto, tamaño máximo y orden por defecto. En la sesión 47 esto se convierte en documentación OpenAPI, y en la UD12 en parte del contrato que defiendes.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Filtros y paginación funcionan combinados; <code>totalElements</code> cuenta lo filtrado; una página fuera de rango devuelve <code>200</code> con lista vacía; hay un tamaño máximo de página configurado; y has visto en los logs las dos sentencias SQL que genera cada petición paginada.</dd>
</dl>

### Reto · El problema de la paginación profunda (Deep Paging)

Cuando una base de datos relacional ejecuta `OFFSET 1000000 LIMIT 10`, PostgreSQL debe leer un millón diez filas de disco y descartar el primer millón en memoria antes de devolver las diez solicitadas. A esto se le conoce como el **problema de la paginación profunda** (*Deep Paging*).

Analiza las consecuencias técnicas y diseña una alternativa:
1. ¿Por qué la latencia de una consulta con `OFFSET` crece de forma lineal a medida que avanzan las páginas?
2. Investiga qué es la **paginación por cursor o por clave de búsqueda** (*Keyset Pagination* o *Cursor-based Pagination*), que sustituye `OFFSET` por una cláusula del tipo:
   `WHERE t.id > :ultimoIdVisto ORDER BY t.id ASC LIMIT 10`.
3. ¿Por qué las aplicaciones con scroll infinito (como Twitter, Instagram o feeds de noticias) utilizan siempre paginación por cursor en lugar de `Pageable` basado en desplazamiento (*offset*)?

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Si en la evaluación se solicita un informe de optimización de bases de datos o comparativa de rendimiento, el formato de entrega de texto es siempre un <strong>documento en PDF</strong> (<code>informe-paginacion.pdf</code>), nunca un archivo markdown suelto.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Paginación en <code>GET /proyectos</code> implementada con <code>@PageableDefault</code> y metadatos completos en la respuesta JSON.</span></div>
  <div><strong>Si lo tienes</strong><span>Paginación combinada con los filtros multicriterio de <code>Tarea</code> funcionando con ordenación dinámica.</span></div>
  <div><strong>Reto</strong><span>Estudio del problema de rendimiento de Deep Paging completado y propuesta técnica de paginación por cursor documentada.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 45</p>
  <ul class="checklist">
    <li>Los endpoints de listado devuelven una estructura paginada <code>Page&lt;T&gt;</code> con metadatos completos.</li>
    <li>La aplicación utiliza <code>@PageableDefault</code> para establecer límites de tamaño de página seguros.</li>
    <li>PostgreSQL ejecuta sentencias con <code>LIMIT</code> y <code>OFFSET</code> reales, sin cargar colecciones masivas en memoria.</li>
    <li>La ordenación por columnas (<code>sort=campo,asc/desc</code>) funciona de forma transparente en las consultas.</li>
    <li>Los filtros multicriterio y la paginación conviven en un único endpoint coherente.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué un endpoint de listado en producción nunca debe devolver un array plano sin paginar?</li>
    <li>¿Qué convención de numeración de páginas utiliza Spring Data (<code>0-based</code> o <code>1-based</code>)?</li>
    <li>¿Cómo traduce PostgreSQL la paginación a nivel de sintaxis SQL nativa?</li>
    <li>¿Qué ventaja ofrece el método <code>.map()</code> sobre un objeto <code>Page&lt;Entidad&gt;</code> en comparación con extraer la lista con <code>getContent()</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque si la tabla crece a decenas o cientos de miles de registros, la aplicación sufrirá consumo desmedido de memoria RAM, saturará el recolector de basura (GC) y enviará payloads gigantes por red que congelarán al cliente.</p>
  <p>2 · Spring Data utiliza numeración basada en 0 (0-based indexing): la primera página es la página 0.</p>
  <p>3 · Utiliza la cláusula LIMIT para definir la cantidad máxima de filas a retornar y OFFSET para saltar el número de filas correspondiente a las páginas previas (OFFSET = page * size).</p>
  <p>4 · Mantiene intactos todos los metadatos de paginación (totalElements, totalPages, number, size, first, last) mientras transforma limpiamente cada elemento individual de entidad a DTO.</p>
</details>

## Semana 16 · Un contrato que otros pueden usar

## Sesión 46 · Tests de endpoints con MockMvc

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> cómo verificar el contrato HTTP completo (rutas, códigos de estado, cabeceras y cuerpos JSON) mediante <code>@WebMvcTest</code> y <code>MockMvc</code> sin arrancar un servidor Tomcat real ni levantar la base de datos.</li>
    <li><strong>2. Haz:</strong> escribe una suite de pruebas de capa web para <code>ProyectoController</code> cubriendo el caso exitoso (201 con cabecera <code>Location</code>), errores de validación (400 con RFC 7807) y recursos no encontrados (404).</li>
    <li><strong>3. Comprueba:</strong> ejecutas <code>./mvnw test</code> verificando que la batería de pruebas de controladores se ejecuta en milisegundos y garantiza la estabilidad del contrato ante cualquier refactorización.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué tener tests unitarios del servicio al 100 % de cobertura no garantiza que la API responda con código HTTP 201 en lugar de 200 en un alta?</li>
    <li>¿Qué ventaja de velocidad y aislamiento tiene utilizar <code>@WebMvcTest</code> frente a arrancar toda la aplicación con <code>@SpringBootTest</code>?</li>
    <li>¿Qué librería utiliza Spring Boot para evaluar aserciones sobre campos anidados dentro de un JSON de respuesta (expresiones como <code>$.nombre</code>)?</li>
  </ol>
</div>

### La brecha entre el servicio y el protocolo HTTP

Hasta ahora has probado tus servicios con tests unitarios y tus repositorios con `@DataJpaTest`. Esas pruebas garantizan que la lógica de negocio y las consultas SQL funcionan.

Sin embargo, **ninguna de esas pruebas valida la capa web**:
* ¿Qué pasa si alguien cambia por error la ruta `@PostMapping("/proyectos")` a `@PostMapping("/proyecto")`?
* ¿Qué pasa si el controlador olvida la anotación `@Valid` y acepta cuerpos con campos en blanco?
* ¿Qué pasa si el controlador devuelve un `200 OK` plano en lugar de un `201 Created` con la cabecera `Location` obligatoria?
* ¿Qué pasa si el serializador Jackson omite un campo o cambia el nombre de una propiedad en el JSON?

Para responder a estas preguntas sin tener que arrancar manualmente la aplicación y probar peticiones en Bruno una a una, utilizamos **pruebas de slice web con MockMvc**.

<figure class="diagram">
  <figcaption>El slice de pruebas web con @WebMvcTest</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Petición HTTP simulada (MockMvc)</li>
    <li>Filtros y Routing de Spring MVC</li>
    <li>Validación de DTOs (@Valid)</li>
    <li>Controlador (@RestController)</li>
    <li>Servicio simulado (@MockBean)</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">La ventaja de @WebMvcTest</p>
  <p><strong><code>@WebMvcTest</code> no arranca un servidor HTTP real ni conecta con PostgreSQL.</strong></p>
  <p>Carga únicamente los componentes de la capa web (controladores, mappers de Jackson, validadores de Bean Validation y manejadores <code>@RestControllerAdvice</code>), ejecutando docenas de tests en menos de un segundo.</p>
</div>

### Sintaxis y aserciones fluidas con MockMvc y JSONPath

`MockMvc` utiliza un patrón fluido para construir la petición y comprobar las expectativas de la respuesta:

```java
mockMvc.perform(post("/proyectos")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {"nombre": "Portal Clientes", "descripcion": "Acceso web"}
        """))
    .andExpect(status().isCreated())
    .andExpect(header().exists("Location"))
    .andExpect(jsonPath("$.id").value(1))
    .andExpect(jsonPath("$.nombre").value("Portal Clientes"));
```

Para evaluar el contenido del JSON utilizamos **JSONPath**:
* `$.id`: el atributo `id` de la raíz del objeto.
* `$.nombre`: el atributo `nombre`.
* `$.content`: el array de elementos en una respuesta paginada.
* `$.content.length()`: la cantidad de elementos devueltos en el array.
* `$.content[0].titulo`: el título del primer elemento de la lista.

### Paso a paso guiado · Crear la suite de ProyectoControllerTest

Vamos a construir la suite de pruebas automatizadas para el contrato de `ProyectoController`:

<p class="stage">Paso 1 · Estructura de la clase de prueba con @WebMvcTest</p>

Crea `src/test/java/com/ejemplo/gestor/controller/ProyectoControllerTest.java`. Aislamos el controlador inyectando `MockMvc` y simulando el colaborador de negocio con `@MockBean`.

Los `import` estáticos del final son la parte que más se atasca, porque sin ellos `post(...)`, `status()` o `jsonPath(...)` no compilan. Cópialos tal cual:

```java
package com.ejemplo.gestor.controller;

import com.ejemplo.gestor.dto.ProyectoRequest;
import com.ejemplo.gestor.dto.ProyectoResponse;
import com.ejemplo.gestor.error.RecursoNoEncontradoException;
import com.ejemplo.gestor.service.ProyectoService;
import com.ejemplo.gestor.service.TareaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProyectoController.class)
class ProyectoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProyectoService proyectoService;

    @MockBean
    private TareaService tareaService;
```

<dl class="worked">
  <dt>Qué carga <code>@WebMvcTest(ProyectoController.class)</code> y qué no</dt>
  <dd><strong>Sí:</strong> ese controlador, Jackson, Bean Validation, los <code>@ControllerAdvice</code> y los conversores HTTP. <strong>No:</strong> servicios, repositorios, la conexión a PostgreSQL ni ningún otro controlador. Por eso arranca en centésimas y por eso cada colaborador del controlador tiene que llegar como <code>@MockBean</code>.</dd>
  <dt>Por qué hay que declarar <code>TareaService</code> si el test no lo usa</dt>
  <dd>Porque <code>ProyectoController</code> lo recibe por constructor. El contexto no arranca si falta un bean que alguien necesita, aunque este test concreto no lo llame nunca. Si te olvidas, el fallo es <code>No qualifying bean of type ...TareaService</code> y ocurre antes de ejecutar ningún test.</dd>
  <dt>Las tres partes de todo test</dt>
  <dd><strong>Arrange</strong>: preparas los datos y programas qué debe devolver el <code>@MockBean</code> (<code>when(...).thenReturn(...)</code>). <strong>Act</strong>: lanzas la petición con <code>mockMvc.perform(...)</code>. <strong>Assert</strong>: encadenas los <code>.andExpect(...)</code>. Verlas separadas te dice de un vistazo qué se estaba probando cuando un test falla dentro de seis meses.</dd>
</dl>

<p class="stage">Paso 2 · Test del caso feliz de creación (POST 201 Created)</p>

Verificamos que un cuerpo válido responde con código `201`, emite la cabecera `Location` correcta y devuelve el recurso creado:

```java
    @Test
    void crearProyecto_conDatosValidos_devuelve201YLocation() throws Exception {
        // 1. Arrange: preparamos el DTO de entrada y la respuesta simulada del servicio
        ProyectoRequest request = new ProyectoRequest("Plataforma SaaS", "Gestión cloud");
        ProyectoResponse response = new ProyectoResponse(
            1L, "Plataforma SaaS", "Gestión cloud", true, LocalDateTime.now()
        );

        when(proyectoService.crearProyecto(any(ProyectoRequest.class))).thenReturn(response);

        // 2. Act & Assert: ejecutamos la petición HTTP y evaluamos el contrato
        mockMvc.perform(post("/proyectos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(header().string("Location", "http://localhost/proyectos/1"))
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.nombre").value("Plataforma SaaS"))
            .andExpect(jsonPath("$.activo").value(true));
    }
```

<p class="stage">Paso 3 · Test de validación con datos inválidos (POST 400 Bad Request)</p>

Comprobamos que si el cliente envía un nombre en blanco, Bean Validation intercepta la petición antes de llegar al servicio y emite el formato estándar RFC 7807:

```java
    @Test
    void crearProyecto_conNombreEnBlanco_devuelve400ProblemDetails() throws Exception {
        // Nombre inválido (vacío)
        ProyectoRequest requestInvalido = new ProyectoRequest("", "Descripción válida");

        mockMvc.perform(post("/proyectos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestInvalido)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.status").value(400))
            .andExpect(jsonPath("$.title").value("Error de validación"))
            .andExpect(jsonPath("$.invalidParams.nombre").exists());

        // Verificamos que el servicio jamás llegó a ejecutarse ante datos corruptos
        verify(proyectoService, never()).crearProyecto(any());
    }
```

<p class="stage">Paso 4 · Test de recurso no encontrado (GET 404 Not Found)</p>

Simulamos que el servicio lanza `RecursoNoEncontradoException` y comprobamos que el `@RestControllerAdvice` lo transforma limpiamente en un `404`:

```java
    @Test
    void obtenerPorId_cuandoNoExiste_devuelve404NotFound() throws Exception {
        when(proyectoService.buscarPorId(999L))
            .thenThrow(new RecursoNoEncontradoException("No existe proyecto con id 999"));

        mockMvc.perform(get("/proyectos/999"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.status").value(404))
            .andExpect(jsonPath("$.detail").value("No existe proyecto con id 999"));
    }
}
```

### La comprobación · Ejecutar la batería en terminal

Ejecuta tu suite desde la terminal de tu IDE o consola:

```bash
./mvnw test -Dtest=ProyectoControllerTest
```

Observa la salida de Maven:
* La suite arranca en menos de **1.5 segundos**.
* No se realizan conexiones TCP a PostgreSQL.
* Los 3 tests pasan en verde confirmando que rutas, DTOs, validaciones, códigos de estado y respuestas JSON están blindados.

<p class="stage">Comprobación 2 · Rompe cada test y míralo caer</p>

Un test que solo has visto en verde no te ha demostrado que vigile algo. Provoca los tres fallos, uno a uno, y devuelve el código a su sitio después de cada uno:

| Rompe esto | El test que debe fallar | El mensaje que verás |
| :--- | :--- | :--- |
| Cambia el `@PostMapping` para que devuelva `200` en vez de `201` | `crearProyecto_conDatosValidos…` | `Status expected:<201> but was:<200>` |
| Quita la anotación `@Valid` del parámetro del controlador | `crearProyecto_conNombreEnBlanco…` | `Status expected:<400> but was:<201>` |
| Comenta el `@ExceptionHandler` de `RecursoNoEncontradoException` | `obtenerPorId_cuandoNoExiste…` | `Status expected:<404> but was:<500>` |

Ese tercer caso es el más instructivo: sin el manejador, una excepción de negocio se convierte en un `500`, que es el código que le dice a quien consume tu API «el fallo es mío», cuando en realidad había pedido algo que no existe.

### Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| `No qualifying bean of type '…Service'` al arrancar el test | Falta un `@MockBean` | Declara **todos** los colaboradores del constructor del controlador, los use el test o no |
| `cannot find symbol: method post/status/jsonPath` | Faltan los `import` estáticos | Los tres `import static …MockMvcRequestBuilders.*`, `…MockMvcResultMatchers.*` y `org.mockito.Mockito.*` |
| El `Location` esperado no coincide | MockMvc no conoce tu dominio real | Dentro de MockMvc el host siempre es `http://localhost`, sin puerto |
| `Status expected:<201> but was:<415>` | Falta el tipo de contenido | Añade `.contentType(MediaType.APPLICATION_JSON)` a la petición |
| El servicio simulado devuelve `null` | El `when(...)` no encaja con la llamada real | Usa `any(ProyectoRequest.class)`: si programas `when(servicio.crear(request))` con un objeto concreto y el controlador construye otro, Mockito no lo reconoce |
| `JSONPath "$.id" does not exist` | La respuesta no es la que crees | Encadena `.andDo(print())` antes de los `andExpect` para volcar en consola la respuesta entera |

### Ahora tú · Batería de pruebas para TareaController

Aplica el mismo patrón para blindar el contrato de `TareaController`:

1. Crea `TareaControllerTest` anotada con `@WebMvcTest(TareaController.class)` y declara como `@MockBean` todos los colaboradores que reciba el controlador.
2. Escribe `crearTarea_conDatosValidos_devuelve201YLocation`, calcado del caso feliz del paso 2.
3. Escribe `crearTarea_conPrioridadInvalida_devuelve400`, comprobando además con `verify(..., never())` que el servicio no llegó a ejecutarse.
4. Escribe `listarTareas_conFiltros_devuelveListaPaginada200` verificando que devuelve el array en `$.content` y los metadatos `$.page.totalElements`.
5. Escribe `obtenerTarea_cuandoNoExiste_devuelve404`, programando el simulacro para que lance `RecursoNoEncontradoException`.
6. Escribe el subrecurso: `listarTareasDeProyecto_cuandoElProyectoNoExiste_devuelve404`. Esta es la regla que implementaste en la sesión 43 y hasta ahora solo habías comprobado a mano.
7. Ejecuta `./mvnw test` (la suite completa, no solo esta clase) y confirma que siguen en verde los tests de service de la UD4 y los de repositorio de la UD5. Tienes ya los tres niveles de la pirámide.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Seis tests nuevos en verde; cada test de rechazo comprueba el código de estado <strong>y</strong> que el servicio no se invocó; y has visto fallar en rojo, al menos una vez, cada uno de los tres del guion.</dd>
</dl>

### Reto · Validación de cabeceras de caché HTTP (ETag y Cache-Control)

En APIs REST de alto rendimiento, los endpoints de consulta devuelven cabeceras de control de caché para que los clientes no descarguen datos repetidos si no han cambiado.

Diseña un test con MockMvc que verifique el soporte de cabeceras condicionales:
1. Simula una petición `GET /proyectos/1` que incluya la cabecera `If-None-Match: "v1-abc"`.
2. Si el recurso no ha cambiado, comprueba que el endpoint devuelve código **`304 Not Modified`** con el cuerpo completamente vacío.
3. Analiza qué ahorro de ancho de banda y procesamiento representa este mecanismo para una API consumida por miles de clientes simultáneos.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tests de <code>ProyectoControllerTest</code> cubriendo casos 201 y 400 con MockMvc y JSONPath.</span></div>
  <div><strong>Si lo tienes</strong><span>Suite de <code>TareaControllerTest</code> completa incluyendo validaciones, 404 y respuestas paginadas.</span></div>
  <div><strong>Reto</strong><span>Test de cabeceras condicionales de caché HTTP (ETag / 304 Not Modified) implementado y verificado.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 46</p>
  <ul class="checklist">
    <li>El contrato HTTP se valida de forma automatizada sin requerir peticiones manuales en clientes externos.</li>
    <li><code>@WebMvcTest</code> se utiliza para aislar la capa web sin arrancar servidores Tomcat ni bases de datos.</li>
    <li>Las respuestas de error por validación (400) se comprueban campo a campo mediante JSONPath.</li>
    <li>Los códigos de estado semánticos (201, 204, 400, 404) están garantizados por aserciones estrictas.</li>
    <li>La suite completa de tests de controladores pasa al 100 % en verde con <code>./mvnw test</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué <code>@WebMvcTest</code> es mucho más rápido que <code>@SpringBootTest</code>?</li>
    <li>¿Qué rol cumple <code>@MockBean</code> en una prueba de controlador?</li>
    <li>¿Cómo se comprueba con MockMvc que una petición POST devuelve la cabecera <code>Location</code>?</li>
    <li>¿Qué expresión JSONPath utilizarías para comprobar el total de elementos de una respuesta paginada?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque no levanta el contexto completo de Spring: ignora repositorios, conexiones JDBC a base de datos y servicios, cargando únicamente los componentes del dispatcher web.</p>
  <p>2 · Reemplaza el servicio real en el contexto de Spring por un doble de prueba de Mockito, permitiendo definir respuestas simuladas (when/then) e inspeccionar llamadas sin ejecutar lógica de negocio real.</p>
  <p>3 · Mediante andExpect(header().exists("Location")) o andExpect(header().string("Location", valorEsperado)).</p>
  <p>4 · jsonPath("$.page.totalElements").value(numeroEsperado) o jsonPath("$.totalElements").value(...).</p>
</details>

## Sesión 47 · OpenAPI y Swagger

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el estándar OpenAPI 3.0, la diferencia entre la especificación interpretable por máquinas (JSON/YAML) y la interfaz visual interactiva (Swagger UI), y cómo generar documentación viva a partir del código con <code>springdoc-openapi</code>.</li>
    <li><strong>2. Haz:</strong> integra <code>springdoc-openapi-starter-webmvc-ui</code> en tu proyecto Spring Boot, decora controladores y DTOs con anotaciones semánticas y publica la especificación en <code>/v3/api-docs</code>.</li>
    <li><strong>3. Comprueba:</strong> abres Swagger UI en el navegador, ejecutas peticiones interactivas reales contra la API y verificas que todos los endpoints, esquemas y códigos de error están documentados.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué mantener la documentación de una API en un documento externo de texto siempre acaba en desincronización con el código?</li>
    <li>¿Qué diferencia conceptual existe entre la especificación **OpenAPI** y la herramienta **Swagger UI**?</li>
    <li>¿Cómo permite un archivo OpenAPI generar automáticamente el código del cliente frontend (TypeScript, Axios) o colecciones de pruebas sin programarlas a mano?</li>
  </ol>
</div>

### La documentación como código vivo (Living Documentation)

En desarrollo de software profesional existe una regla demostrada por la experiencia: **toda documentación que no se genere automáticamente a partir del código acaba mintiendo**.

Un desarrollador añade un campo al DTO, renombra un query param o cambia un código de estado de `200` a `201`. Si la documentación vive en un documento estático, nadie se acuerda de actualizarlo. Al cabo de dos meses, el equipo de frontend intenta consumir la API y nada encaja.

<div class="rule">
  <p class="rule-label">El principio de la documentación viva</p>
  <p><strong>El código fuente es la única fuente de verdad (Single Source of Truth).</strong></p>
  <p>Utilizamos el estándar <strong>OpenAPI 3.0</strong> para que el propio framework inspeccione nuestros controladores, rutas y DTOs, generando una especificación técnica interactiva que se actualiza automáticamente con cada compilación.</p>
</div>

### OpenAPI frente a Swagger UI

Conviene distinguir con precisión ambos términos:

| Concepto | Qué es | Para qué sirve | Dónde se consulta |
| :--- | :--- | :--- | :--- |
| **OpenAPI 3.0** | Estándar formal independiente de cualquier lenguaje que describe APIs REST en formato JSON o YAML. | Lo consumen las máquinas: generadores de código de clientes, pasarelas de API (API Gateways) y herramientas de pruebas automáticas. | `http://localhost:8080/v3/api-docs` |
| **Swagger UI** | Aplicación web interactiva que lee la especificación OpenAPI y la renderiza visualmente. | La consumen los humanos: permite a cualquier desarrollador explorar los endpoints, ver ejemplos y lanzar peticiones en vivo (*Try it out*). | `http://localhost:8080/swagger-ui.html` |

### Paso a paso guiado · Integrar y documentar con springdoc-openapi

<p class="stage">Paso 1 · Añadir la dependencia en pom.xml</p>

En proyectos Spring Boot 3 utilizamos la librería oficial de la comunidad `springdoc-openapi`:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

Al compilar y arrancar la aplicación, Spring Boot habilitará automáticamente los endpoints de documentación sin necesidad de escribir una sola línea de configuración inicial.

<p class="stage">Paso 2 · Mirar lo que se genera solo, antes de tocar nada</p>

Antes de anotar una sola clase, arranca y abre `http://localhost:8080/swagger-ui.html`. Ya tienes una documentación completa que no has escrito.

Léela con ojo crítico y anota en tu cuaderno **tres cosas que un desarrollador externo no podría deducir de ahí**. La lista suele salir así:

* Los endpoints aparecen agrupados bajo un nombre horrible del tipo `proyecto-controller`.
* Ningún método explica qué hace: solo se ve la firma.
* Solo aparece el código de respuesta feliz. Nada dice que un nombre duplicado devuelve `409`, ni que un nombre vacío devuelve `400` con formato RFC 7807.
* Los campos de los DTO no traen ejemplo, así que quien pruebe *Try it out* tiene que inventarse los valores.

Esas cuatro carencias son exactamente lo que arreglan los pasos 3 a 5. **Documentar no es activar Swagger: es rellenar lo que Swagger no puede adivinar.**

<p class="stage">Paso 3 · Configurar metadatos globales del proyecto</p>

Creamos una clase de configuración para definir el título, descripción y versión de nuestra API:

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API de Gestión de Proyectos e Incidencias")
                .version("1.0.0")
                .description("Servicio RESTful con persistencia relacional en PostgreSQL, filtros dinámicos y paginación.")
                .contact(new Contact()
                    .name("Equipo de Ingeniería Backend")
                    .email("backend@empresa.com")));
    }
}
```

<p class="stage">Paso 4 · Anotar controladores con @Tag y @Operation</p>

Decoramos `ProyectoController` para estructurar la interfaz en bloques lógicos y documentar el propósito de cada método:

```java
@Tag(name = "Proyectos", description = "Endpoints para la gestión del ciclo de vida de proyectos de desarrollo")
@RestController
@RequestMapping("/proyectos")
public class ProyectoController {

    private final ProyectoService proyectoService;

    public ProyectoController(ProyectoService proyectoService) {
        this.proyectoService = proyectoService;
    }

    @Operation(
        summary = "Crear un nuevo proyecto",
        description = "Registra un proyecto con nombre único y estado activo por defecto. Emite cabecera Location con la URI del nuevo recurso."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Proyecto creado exitosamente"),
        @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (Bean Validation)"),
        @ApiResponse(responseCode = "409", description = "Conflicto: ya existe un proyecto con ese nombre")
    })
    @PostMapping
    public ResponseEntity<ProyectoResponse> crear(@Valid @RequestBody ProyectoRequest request) {
        ProyectoResponse nuevo = proyectoService.crearProyecto(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(nuevo.id())
            .toUri();
        return ResponseEntity.created(location).body(nuevo);
    }
```

<p class="stage">Paso 5 · Enriquecer los DTOs con @Schema</p>

Anotamos los atributos de nuestros records para mostrar descripciones claras y ejemplos reales en Swagger:

```java
@Schema(description = "Datos para el registro o actualización de un proyecto")
public record ProyectoRequest(

    @Schema(description = "Nombre único del proyecto en la organización", example = "Portal de Clientes B2B")
    @NotBlank(message = "El nombre no puede estar en blanco")
    @Size(min = 3, max = 80, message = "El nombre debe tener entre 3 y 80 caracteres")
    String nombre,

    @Schema(description = "Descripción detallada de los objetivos del proyecto", example = "Migración de la interfaz corporativa a arquitectura desacoplada")
    @Size(max = 500, message = "La descripción no puede superar 500 caracteres")
    String descripcion
) {}
```

<dl class="worked">
  <dt>Los imports de las anotaciones</dt>
  <dd>Todas viven bajo <code>io.swagger.v3.oas.annotations</code>: <code>…annotations.tags.Tag</code>, <code>…annotations.Operation</code>, <code>…annotations.Parameter</code>, <code>…annotations.media.Schema</code> y <code>…annotations.responses.ApiResponse</code> / <code>ApiResponses</code>. Cuidado con <code>Tag</code>: tu IDE te ofrecerá primero el de JUnit, que no es este.</dd>
  <dt><code>@Schema</code> sobre un <code>record</code></dt>
  <dd>Se coloca delante de cada componente, en la misma línea o encima, tal y como se hace con <code>@NotBlank</code>. Las anotaciones de validación que ya tenías desde la UD3 <strong>también</strong> se documentan solas: <code>@Size(min=3, max=80)</code> aparece en Swagger como <code>minLength: 3, maxLength: 80</code> sin que hagas nada. Es la recompensa de haber validado con anotaciones en vez de con <code>if</code>.</dd>
  <dt>Por qué el <code>@ApiResponse</code> de error hay que escribirlo a mano</dt>
  <dd>Springdoc lee los tipos, no la lógica. Puede deducir qué devuelve tu método cuando todo va bien, pero no puede saber que tu servicio lanza <code>NombreDuplicadoException</code> y que tu <code>@RestControllerAdvice</code> la convierte en un <code>409</code>. Ese conocimiento solo está en tu cabeza, y por eso se declara.</dd>
</dl>

### La comprobación · Explorar Swagger UI en vivo

Arranca tu aplicación Spring Boot y realiza estas comprobaciones:

1. **Abrir Swagger UI:** Navega en tu navegador a `http://localhost:8080/swagger-ui.html`.
   * Comprueba que aparece el título *«API de Gestión de Proyectos e Incidencias»* y el bloque agrupado *«Proyectos»*.
2. **Examinar esquemas de datos:** Baja a la sección inferior de *Schemas*.
   * Comprueba que `ProyectoRequest` muestra las descripciones de los campos, los ejemplos y qué atributos son obligatorios.
3. **Lanzar una petición interactiva (*Try it out*):**
   * Despliega `POST /proyectos`, pulsa en *Try it out*, edita el JSON de ejemplo y pulsa *Execute*.
   * Comprueba que la consola responde con código `201 Created` y muestra las cabeceras de respuesta reales.
4. **Inspeccionar la especificación pura:**
   * Abre `http://localhost:8080/v3/api-docs` en una pestaña nueva para ver el documento JSON completo que consumirán los clientes automatizados.

5. **Comparar antes y después:** vuelve a leer las tres carencias que anotaste en el paso 2 y comprueba, una por una, que ya no están.

### Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| `/swagger-ui.html` devuelve `404` | La ruta redirige y el navegador no la sigue | Prueba `http://localhost:8080/swagger-ui/index.html`; si esa funciona, es solo la redirección |
| Swagger carga pero está vacío | Springdoc no encuentra tus controladores | Deben estar en un subpaquete de donde vive `GestorApplication` |
| Los `@Schema` de los DTO no se ven | Estás anotando la clase pero no los componentes | En un `record`, cada `@Schema` va delante de su componente |
| `cannot find symbol: class Tag` | Import equivocado | Debe ser `io.swagger.v3.oas.annotations.tags.Tag`, no el de JUnit |
| *Try it out* devuelve `403` en las escrituras | Es el CSRF de Spring Security | Todavía no aplica: llegará en la UD9, y allí se resuelve |

### Ahora tú · Documentar los endpoints de Tareas y Filtros

Documenta el controlador de tareas aplicando las anotaciones correspondientes:

1. Añade `@Tag(name = "Tareas", description = "Gestión de tareas, filtros multicriterio y paginación")` en `TareaController`.
2. Documenta el endpoint de búsqueda `GET /tareas` decorando cada parámetro `@RequestParam` con `@Parameter`:
   ```java
   @Parameter(description = "Filtro por identificador del proyecto asociado", example = "1")
   @RequestParam(required = false) Long proyectoId
   ```
3. Añade ejemplos descriptivos a `TareaRequest` y `TareaDetalleResponse` con `@Schema`.
4. Recarga Swagger UI y verifica que la documentación de tareas permite filtrar interactivamente desde la propia página web.
5. Documenta los **errores** de todos los endpoints de tareas, que es la parte que Swagger no puede deducir: `400` de validación, `404` cuando el proyecto padre no existe (la regla de la sesión 43) y `409` si tu dominio tiene alguna restricción de unicidad. Usa `@ApiResponse` para cada uno.
6. Documenta la paginación de la sesión 45: cada `@RequestParam` de `page`, `size` y `sort` debe llevar su `@Parameter` con `description` y `example`, porque son justo los que un consumidor externo no puede adivinar.
7. **La prueba del consumidor:** dale la URL de tu Swagger a un compañero, sin explicarle nada de palabra, y pídele que cree un proyecto con una tarea dentro usando solo *Try it out*. Cada vez que tenga que preguntarte algo, apunta la pregunta: cada una es un `@Schema` o un `@Operation` que te falta. Corrígelos y repite.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Los dos bloques se llaman «Proyectos» y «Tareas», no <code>proyecto-controller</code>; cada endpoint declara sus códigos de error además del feliz; todos los campos de los DTO traen ejemplo; y un compañero ha conseguido usar tu API entera desde Swagger sin preguntarte nada.</dd>
</dl>

### Reto · Generación de clientes TypeScript con openapi-generator

El mayor superpoder de OpenAPI no es que los humanos lean Swagger UI: es que **las máquinas generen código sin fallos humanos**.

Investiga cómo funciona la herramienta de código abierto `openapi-generator-cli`:
1. ¿Cómo permite el comando:
   `npx @openapitools/openapi-generator-cli generate -i http://localhost:8080/v3/api-docs -g typescript-axios -o ./frontend/api`
   generar automáticamente todas las interfaces TypeScript y llamadas Axios para un frontend en React o Vue?
2. Si cambias el tipo de un campo en Java de `Long` a `String` y vuelves a ejecutar el generador, ¿cómo detecta el compilador de TypeScript el error en el frontend antes de que la aplicación llegue a producción?

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Si en la evaluación se solicita un informe sobre adopción de OpenAPI en pipelines de integración continua, el formato de entrega de texto es siempre un <strong>documento en PDF</strong> (<code>informe-openapi.pdf</code>), nunca un archivo markdown suelto.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Dependencia <code>springdoc-openapi</code> integrada y Swagger UI accesible en <code>/swagger-ui.html</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Controladores y DTOs documentados con <code>@Tag</code>, <code>@Operation</code>, <code>@ApiResponses</code> y <code>@Schema</code> con ejemplos.</span></div>
  <div><strong>Reto</strong><span>Flujo de generación automática de clientes cliente-servidor mediante OpenAPI justificado y comprendido.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 47</p>
  <ul class="checklist">
    <li>La especificación técnica OpenAPI 3.0 se genera automáticamente a partir del código en <code>/v3/api-docs</code>.</li>
    <li>Swagger UI está disponible para pruebas interactivas en <code>/swagger-ui.html</code>.</li>
    <li>Todos los endpoints declaran sus códigos de respuesta esperados (200, 201, 400, 404, 409).</li>
    <li>Los DTOs muestran ejemplos representativos y restricciones de validación documentadas.</li>
    <li>Los parámetros de consulta para filtros y paginación disponen de descripciones semánticas.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué la documentación viva generada con OpenAPI previene la desincronización entre frontend y backend?</li>
    <li>¿Qué diferencia hay entre la ruta <code>/v3/api-docs</code> y <code>/swagger-ui.html</code>?</li>
    <li>¿Para qué se utiliza la anotación <code>@Schema(example = "...")</code> en un DTO?</li>
    <li>¿Cómo se agrupan varios endpoints relacionados bajo una misma categoría en la interfaz de Swagger UI?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque inspecciona directamente las anotaciones y clases compiladas de Java en cada ejecución; si el código cambia, la documentación cambia de forma simultánea e inmediata.</p>
  <p>2 · /v3/api-docs devuelve el documento JSON estandarizado OpenAPI para ser procesado por herramientas y librerías; /swagger-ui.html es la interfaz gráfica web interactiva para usuarios humanos.</p>
  <p>3 · Para proporcionar valores de ejemplo representativos que aparecen precargados en la documentación interactiva, facilitando las pruebas de consumo.</p>
  <p>4 · Mediante la anotación @Tag(name = "NombreGrupo", description = "...") a nivel de clase controladora.</p>
</details>

## Sesión 48 · Evolucionar el contrato sin romper a quien lo consume

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> qué distingue a un cambio compatible (*Non-breaking change*) de uno incompatible (*Breaking change*), la Ley de Postel (Principio de Robustez), las tres estrategias de versionado de APIs y el ciclo de vida de obsolescencia (*Deprecation*).</li>
    <li><strong>2. Haz:</strong> implementa una estrategia de versionado en las rutas de tu API (<code>/api/v1/...</code>), aplica una evolución compatible sobre un DTO existente y utiliza cabeceras HTTP estándar de obsolescencia (<code>Deprecation</code> y <code>Sunset</code>).</li>
    <li><strong>3. Comprueba:</strong> ejecutas peticiones en Bruno simulando tanto clientes antiguos como clientes nuevos, verificando que ambos conviven con éxito sin errores de deserialización.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué es un «breaking change» (cambio incompatible) en una API REST y por qué es una de las causas más graves de caída de sistemas en producción?</li>
    <li>Menciona dos cambios en un endpoint que sean compatibles hacia atrás y dos que rompan la compatibilidad de inmediato.</li>
    <li>¿Qué significa el principio de robustez o Ley de Postel en el diseño de protocolos y comunicaciones web?</li>
  </ol>
</div>

### El coste invisible de romper un contrato publicado

Cuando desarrollas un proyecto en local, cambiar el nombre de un campo es tan fácil como pulsar `Shift+F6` en IntelliJ y renombrar `titulo` por `nombreTarea`.

En producción, ese renombramiento es una **bomba de relojería**:
* La aplicación móvil de los usuarios (que no se actualiza al mismo tiempo que el backend) sigue enviando y esperando `titulo`.
* El serializador no encuentra el campo y asigna `null`.
* Las validaciones fallan, la pantalla del cliente se congela y la tienda de aplicaciones se llena de reseñas de 1 estrella.

<div class="rule">
  <p class="rule-label">La ley de la inmutabilidad de contratos</p>
  <p><strong>Un contrato publicado en producción jamás se modifica de forma destructiva.</strong></p>
  <p>Las APIs evolucionan mediante adición compatible o mediante versionado explícito. Quien rompe un contrato sin aviso ni periodo de transición destruye la confianza de sus consumidores.</p>
</div>

### Cambios compatibles frente a cambios incompatibles

Antes de tocar una sola línea de código en un controlador o DTO, debes clasificar tu cambio:

| Tipo de cambio | Ejemplos concretos | ¿Rompe a los clientes existentes? |
| :--- | :--- | :--- |
| **Compatible** (*Non-breaking*) | • Añadir un nuevo endpoint a la API.<br>• Añadir un campo nuevo opcional en la petición de entrada.<br>• Añadir un campo nuevo en el JSON de respuesta.<br>• Relajar una restricción (ej: admitir nombres de hasta 100 caracteres en lugar de 80). | **NO.** Si los clientes están bien programados (lectores tolerantes), ignorarán los campos nuevos y seguirán funcionando. |
| **Incompatible** (*Breaking*) | • Renombrar o eliminar un campo existente en el JSON.<br>• Cambiar el tipo de dato de un campo (ej: de número a cadena de texto).<br>• Hacer obligatorio un campo que antes era opcional.<br>• Modificar los códigos HTTP semánticos devueltos habitualmente.<br>• Cambiar la estructura de una respuesta (ej: transformar un array plano en un objeto paginado). | **SÍ.** Provoca errores inmediatos de deserialización o validación en cualquier cliente no actualizado. |

### La Ley de Postel (Principio de Robustez)

> *«Sé conservador con lo que envías, y liberal con lo que aceptas.»* — Jon Postel

Aplicado a APIs REST modernas:
1. **Al recibir datos ( liberal ):** El backend debe ignorar propiedades desconocidas que envíe el cliente en lugar de rechazar la petición con error 400. En Spring Boot esto es el comportamiento por defecto de Jackson (`FAIL_ON_UNKNOWN_PROPERTIES = false`).
2. **Al enviar datos ( conservador ):** El backend debe enviar únicamente los campos acordados en el contrato, sin alterar sus nombres ni sus tipos de datos.

### Estrategias de versionado de APIs

Cuando un cambio incompatible es estrictamente necesario, la API debe ofrecer **versionado**:

<figure class="diagram">
  <figcaption>Las tres estrategias de versionado en REST</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Versionado en URI (/api/v1/proyectos)</li>
    <li>2. Versionado por Header (Accept / Custom)</li>
    <li>3. Versionado por Query Param (?version=1)</li>
  </ol>
</figure>

* **1 · Versionado en la URI (Recomendado en la industria):** `GET /api/v1/proyectos` frente a `GET /api/v2/proyectos`.
  * *Ventajas:* Totalmente explícito, fácil de probar en el navegador y almacenable en cachés HTTP intermedias sin problemas.
* **2 · Versionado por Cabecera (Content Negotiation):** `Accept: application/vnd.empresa.v1+json`.
  * *Ventajas:* Mantiene la URI limpia y puramente orientada al recurso; sin embargo, dificulta las pruebas manuales y complica la configuración de proxies.
* **3 · Versionado por Parámetro:** `GET /proyectos?v=2`.
  * *Ventajas:* Sencillo de añadir; sin embargo, no suele considerarse una buena práctica arquitectónica para cambios estructurales de recursos.

### El protocolo de obsolescencia (Deprecation y Sunset Headers)

Cuando una versión o endpoint va a desaparecer, no se apaga sin previo aviso. Se aplica un periodo de gracia informando a los clientes a través de cabeceras HTTP estándar (RFC 8594):

```http
HTTP/1.1 200 OK
Content-Type: application/json
Deprecation: true
Sunset: Wed, 11 Nov 2026 00:00:00 GMT
Link: </api/v2/proyectos>; rel="successor-version"
```

* `Deprecation: true`: Advierte a las herramientas de monitorización de que el endpoint está obsoleto.
* `Sunset`: Declara la fecha y hora exacta a partir de la cual el endpoint dejará de existir y devolverá `410 Gone` o `404 Not Found`.

### Paso a paso guiado · Versionar rutas y añadir campos de forma compatible

<p class="stage">Paso 1 · Configurar el prefijo de versión en application.properties o controladores</p>

Podemos establecer el prefijo `/api/v1` de forma explícita en nuestros controladores:

```java
@RestController
@RequestMapping("/api/v1/proyectos")
public class ProyectoV1Controller { ... }
```

<p class="stage">Paso 2 · Evolucionar un DTO de forma compatible</p>

Supongamos que el equipo de producto nos pide que los proyectos incluyan una etiqueta de color corporativo opcional:

```java
// Evolución compatible: el nuevo campo tiene valor por defecto si no viene
public record ProyectoResponse(
    Long id,
    String nombre,
    String descripcion,
    boolean activo,
    String colorHex, // Campo nuevo añadido sin eliminar ninguno anterior
    LocalDateTime creadoEn
) {}
```

Un cliente antiguo que solo lea `id` y `nombre` seguirá funcionando al 100 %, mientras que los nuevos clientes podrán hacer uso del nuevo campo `colorHex`.

<p class="stage">Paso 3 · Añadir cabecera de deprecación en un endpoint obsoleto</p>

Si un método antiguo va a ser reemplazado, inyectamos las cabeceras estándar en el `ResponseEntity`:

```java
@Deprecated(since = "1.5.0", forRemoval = true)
@Operation(summary = "Endpoint legado de detalle", deprecated = true)
@GetMapping("/legado/{id}")
public ResponseEntity<ProyectoResponse> obtenerLegado(@PathVariable Long id) {
    ProyectoResponse dto = proyectoService.buscarPorId(id);

    return ResponseEntity.ok()
        .header("Deprecation", "true")
        .header("Sunset", "Fri, 01 Jan 2027 00:00:00 GMT")
        .header("Link", "</api/v1/proyectos/" + id + ">; rel=\"successor-version\"")
        .body(dto);
}
```

### La comprobación · Simular clientes antiguos en Bruno

1. **Petición del cliente tolerante:** Ejecuta `POST /api/v1/proyectos` enviando un campo adicional desconocido en el JSON:
   ```json
   {
     "nombre": "Proyecto Beta",
     "descripcion": "Prueba",
     "campoExtraClienteAntiguo": "valor-ignorado"
   }
   ```
   * Comprueba que Spring Boot responde con código `201 Created` sin fallar, demostrando el cumplimiento de la Ley de Postel.
2. **Petición al endpoint legado:** Ejecuta `GET /api/v1/proyectos/legado/1`.
   * Comprueba en la pestaña de *Headers* de Bruno que la respuesta contiene `Deprecation: true` y la fecha de expiración en `Sunset`.

### Ahora tú · Migrar tu API entera a /api/v1

Esta es la sesión en la que tus rutas dejan de ser `/proyectos` y pasan a ser `/api/v1/proyectos`, para el resto del curso. Hazlo entero y de una vez, porque a partir de la UD8 todo lo que escribas dará por supuesto ese prefijo.

1. Añade el prefijo `/api/v1` al `@RequestMapping` de **todos** tus controladores. No lo pongas endpoint a endpoint: un solo sitio por controlador.
2. Actualiza tu colección de peticiones. Si has usado una variable de entorno para la URL base —como enseñaba la sesión 11—, este paso es un único cambio; si escribiste la URL a mano en cada petición, hoy descubres por qué aquello importaba.
3. Ejecuta la suite de tests. Los de `@WebMvcTest` van a fallar en bloque porque las rutas han cambiado: **eso es exactamente lo que deben hacer**. Corrígelos y observa que la suite acaba de avisarte de un cambio que rompe el contrato, que es para lo que existe.
4. Comprueba que la cabecera `Location` de los `201 Created` también lleva el prefijo. Si la construyes con `ServletUriComponentsBuilder.fromCurrentRequest()`, se actualiza sola; si la escribiste a mano, ahora apunta a una ruta que ya no existe.
5. Regenera la documentación OpenAPI de la sesión 47 y comprueba que Swagger refleja las rutas nuevas.
6. Aplica una **evolución compatible** sobre `TareaResponse`: añade el campo `diasActiva`, calculado a partir de la fecha de creación, sin tocar ningún campo existente. Vuelve a ejecutar los tests y comprueba que siguen en verde: añadir un campo no rompe a nadie, y esa asimetría —añadir es seguro, quitar y renombrar no— es la regla que hay que memorizar de esta sesión.
7. Escribe en tu cuaderno los tres cambios que **sí** romperían a un consumidor: quitar un campo, renombrarlo y cambiar su tipo. Junto a cada uno, cómo se hace de forma segura con `/v2` y las cabeceras `Deprecation` y `Sunset`.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>No queda ninguna ruta sin el prefijo <code>/api/v1</code>; la colección entera vuelve a pasar; los tests están corregidos y en verde; la cabecera <code>Location</code> apunta a una URL que existe; y Swagger muestra las rutas nuevas.</dd>
</dl>

### Reto · Matriz de compatibilidad y contratos automatizados

Cuando múltiples servicios independientes colaboran en producción, la compatibilidad no puede dejarse a la memoria de los programadores.

Investiga el concepto de **pruebas de contrato dirigidas por el consumidor** (*Consumer-Driven Contract Testing*) con herramientas como **Pact**:
1. ¿Cómo permite un test de contrato asegurar que un cambio en el backend no romperá a la aplicación móvil antes de desplegar en producción?
2. ¿Por qué las pruebas de contrato son infinitamente más rápidas y estables que desplegar todos los servicios juntos en un entorno de pruebas End-to-End (E2E)?

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Si en la evaluación se solicita un informe técnico sobre la estrategia de versionado y ciclo de obsolescencia de la API, el formato de entrega de texto es siempre un <strong>documento en PDF</strong> (<code>informe-versionado.pdf</code>), nunca un archivo markdown suelto.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Clasificación de cambios compatibles e incompatibles comprendida y prefijo <code>/api/v1</code> configurado.</span></div>
  <div><strong>Si lo tienes</strong><span>Evolución compatible de DTOs aplicada con tests en verde y cabeceras <code>Deprecation</code> y <code>Sunset</code> configuradas.</span></div>
  <div><strong>Reto</strong><span>Propuesta técnica de Consumer-Driven Contracts documentada y justificada para entornos distribuidos.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 48</p>
  <ul class="checklist">
    <li>Los cambios sobre el contrato de la API se clasifican rigurosamente antes de su implementación.</li>
    <li>La aplicación sigue el principio de robustez (Ley de Postel), tolerando propiedades desconocidas sin fallar.</li>
    <li>Las rutas de la API declaran su versión de forma explícita (<code>/api/v1/...</code>).</li>
    <li>Los endpoints obsoletos emiten las cabeceras estándar de aviso <code>Deprecation</code> y <code>Sunset</code>.</li>
    <li>Los clientes existentes continúan operando sin sufrir caídas ante adiciones compatibles de datos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué renombrar un campo en una respuesta JSON es siempre un cambio incompatible (*breaking change*)?</li>
    <li>¿Qué establece la Ley de Postel y cómo se aplica al consumo de JSON en Spring Boot?</li>
    <li>¿Qué ventajas ofrece el versionado en la URI (<code>/api/v1</code>) frente al versionado por cabeceras HTTP?</li>
    <li>¿Qué información obligatoria transmite la cabecera HTTP estándar <code>Sunset</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque cualquier cliente previamente desplegado que busque el nombre antiguo recibirá null o sufrirá un error de deserialización, provocando fallos en su interfaz o lógica.</p>
  <p>2 · «Sé conservador con lo que envías y liberal con lo que aceptas». En Spring Boot implica no rechazar peticiones que incluyan campos adicionales desconocidos (FAIL_ON_UNKNOWN_PROPERTIES=false).</p>
  <p>3 · Es explícito, directamente legible y fácil de probar en navegadores y herramientas, y compatible de forma nativa con todas las capas de infraestructura y caché HTTP intermedias.</p>
  <p>4 · La fecha y hora exacta (en formato HTTP-date estándar) a partir de la cual el endpoint dejará de estar disponible y será definitivamente eliminado del servidor.</p>
</details>

## Lo que debes recordar

### El método

En esta unidad has aprendido lo que distingue a una API de juguete de una API industrial: la capacidad de ser consumida por terceros de forma predecible, eficiente y sostenible en el tiempo.

Para diseñar y publicar contratos de servidor profesionales, aplica siempre este decálogo de refinamiento:

<figure class="diagram">
  <figcaption>El ciclo de refinamiento de una API REST profesional</figcaption>
  <ol class="flow">
    <li>Delimita la profundidad relacional: utiliza <strong>subrecursos canónicos</strong> (<code>/padres/{id}/hijos</code>) para colecciones numerosas y evita la recursión infinita de Jackson.</li>
    <li>Ofrece una <strong>única ruta de colección en plural</strong> y gestiona filtros y búsquedas mediante parámetros de consulta (<code>@RequestParam</code>).</li>
    <li>Resuelve búsquedas multicriterio con <strong>JPQL condicional con evaluación de nulos</strong> evitando explosiones de métodos en el repositorio.</li>
    <li>Blinda la memoria del servidor: <strong>ninguna colección se devuelve sin paginar</strong>; utiliza <code>Pageable</code>, <code>Page&lt;T&gt;</code> y <code>@PageableDefault</code>.</li>
    <li>Traduce la paginación a nivel de base de datos con <strong><code>LIMIT</code> y <code>OFFSET</code> reales</strong> en PostgreSQL.</li>
    <li>Comprueba el contrato HTTP completo (rutas, estados, validaciones y cabeceras) con <strong>tests de slice web usando <code>MockMvc</code></strong>.</li>
    <li>Genera <strong>documentación viva OpenAPI 3.0</strong> a partir del código con <code>springdoc-openapi</code> y Swagger UI.</li>
    <li>Aplica el <strong>principio de robustez de Postel</strong>: sé tolerante con lo que recibes y riguroso con lo que envías.</li>
    <li>Versiona de forma explícita tus rutas públicas (<code>/api/v1/...</code>) para aislar evoluciones destructivas.</li>
    <li>Avisa de la obsolescencia con antelación utilizando las cabeceras estándar <strong><code>Deprecation</code> y <code>Sunset</code></strong>.</li>
  </ol>
</figure>

### La idea más importante

> **Una API no se diseña para quien la programa, sino para quien la consume. La calidad de un backend se mide por la predictibilidad de sus contratos, la contención de sus respuestas y la capacidad de evolucionar sin romper a sus clientes.**

Un backend descuidado devuelve árboles gigantes de datos, inventa rutas para cada filtro, agota la memoria del servidor al primer millón de registros y rompe a los clientes móviles con cada cambio de código. Una API profesional mantiene contratos estables, acota el tráfico de red y comunica con claridad cada decisión a través de estándares abiertos.

### Las decisiones que tienes que saber justificar

| Decisión de ingeniería | Lo que tienes que poder defender ante un tribunal |
| :--- | :--- |
| **Subrecursos frente a incrustación masiva** | La incrustación de colecciones completas satura el ancho de banda y provoca problemas de rendimiento; externalizar colecciones dinámicas a subrecursos (`/proyectos/{id}/tareas`) permite paginarlas y consultarlas bajo demanda. |
| **Parámetros de consulta frente a explosión de rutas** | Expresar filtros mediante Query Params (`/tareas?prioridad=ALTA`) respeta la semántica de recurso único en REST y evita crear combinaciones factoriales de endpoints en el controlador. |
| **JPQL condicional con evaluación de nulos** | La cláusula `(:param IS NULL OR columna = :param)` permite resolver filtros combinables opcionales en una única consulta limpia sin requerir librerías complejas para catálogos medianos. |
| **Paginación obligatoria con metadatos** | Devolver `Page<T>` protege la memoria Heap de la JVM, previene colapsos del recolector de basura y proporciona al cliente los metadatos indispensables (`totalElements`, `totalPages`) para renderizar interfaces de navegación. |
| **`@PageableDefault` con ordenación segura** | Fija límites por defecto (ej: 10 o 20 registros) para clientes que no envíen parámetros, impidiendo que peticiones maliciosas o despistadas descarguen tablas enteras. |
| **`@WebMvcTest` con `MockMvc`** | Valida el protocolo HTTP real (rutas, Bean Validation, deserialización Jackson y códigos semánticos) en milisegundos sin coste de arrancar Tomcat ni conectar a bases de datos. |
| **Documentación viva OpenAPI con springdoc** | Evita la desincronización entre código y documentación al generarse automáticamente de las clases compiladas, permitiendo la generación de clientes frontend sin errores manuales. |
| **Versionado en la URI (`/api/v1`)** | Es la estrategia más explícita y compatible con la infraestructura de red (cachés HTTP, proxies inversos y balanceadores), facilitando el mantenimiento simultáneo de contratos durante transiciones. |
| **Ley de Postel en la deserialización** | Ignorar propiedades desconocidas en el cuerpo JSON permite desplegar nuevas versiones de clientes sin romper a clientes antiguos que envíen campos heredados o adicionales. |
| **Cabeceras `Deprecation` y `Sunset`** | Informan de forma estandarizada y automatizada a las herramientas de observabilidad de la próxima retirada de un endpoint, ofreciendo un periodo de migración predecible. |

### Al terminar la unidad deberías poder responder

1. ¿Qué problemas técnicos provoca devolver directamente una entidad JPA con relaciones bidireccionales en un `@RestController`?
2. ¿Qué tres patrones existen para modelar relaciones en una API REST y cuándo se aplica cada uno?
3. ¿Por qué una petición a `GET /proyectos/999/tareas` debe responder con `404 Not Found` y no con un array vacío `[]`?
4. ¿Por qué crear rutas como `/tareas/urgentes` o `/tareas/completadas` viola las buenas prácticas de diseño REST?
5. ¿Cómo funciona la evaluación de nulos `(:prioridad IS NULL OR t.prioridad = :prioridad)` en una consulta JPQL?
6. ¿Por qué una búsqueda textual con operador `LIKE` debe aplicar la función `LOWER()` a ambos lados de la comparación?
7. ¿Qué riesgo de rendimiento asume una base de datos cuando una consulta utiliza un comodín inicial (`%termino%`)?
8. ¿Qué diferencia de consumo de memoria existe entre un método que devuelve `List<Tarea>` y uno que devuelve `Page<Tarea>` sobre una tabla con 300.000 filas?
9. ¿Cuáles son los metadatos indispensables que componen una respuesta paginada con `Page<T>` en Spring Boot?
10. ¿Cómo traduce PostgreSQL la paginación de Spring Data a nivel de sintaxis SQL física?
11. ¿En qué consiste el problema de la «paginación profunda» (*Deep Paging*) con `OFFSET` elevado y cómo lo resuelve la paginación por cursor?
12. ¿Por qué los tests unitarios con Mockito de la capa de servicio no detectan errores de validación de Bean Validation?
13. ¿Qué componentes del contexto de Spring se cargan al utilizar la anotación `@WebMvcTest`?
14. ¿Qué expresiones JSONPath se utilizan para comprobar el estado de un campo y la longitud de un array en `MockMvc`?
15. ¿Qué diferencia conceptual y práctica existe entre la especificación OpenAPI 3.0 y la herramienta Swagger UI?
16. ¿Cómo permite un endpoint `/v3/api-docs` generar automáticamente un cliente TypeScript para una aplicación frontend?
17. ¿Qué distingue a un cambio compatible (*non-breaking*) de un cambio incompatible (*breaking*) en una API pública?
18. ¿Qué establece la Ley de Postel y por qué es un principio de resiliencia fundamental en el desarrollo web?
19. ¿Cuáles son las tres estrategias principales para versionar una API REST y qué ventajas tiene el versionado por URI?
20. ¿Qué propósito tienen las cabeceras HTTP estándar `Deprecation` y `Sunset` durante la retirada de un endpoint?

### El vocabulario de la unidad

| Concepto | Significa |
| :--- | :--- |
| **Payload Bloat** | Envío de respuestas JSON con volumen excesivo de datos innecesarios que saturan el ancho de banda y degradan la experiencia de cliente. |
| **Subrecurso** | Ruta REST jerárquica (`/padres/{id}/hijos`) que modela la relación entre dos recursos subordinados. |
| **Query Parameter** | Parámetro transmitido tras el signo `?` en la URL para configurar filtros, búsquedas y paginación en colecciones canónicas. |
| **JPQL condicional** | Consulta JPQL que evalúa condiciones opcionales mediante la comprobación de nulos (`:param IS NULL OR ...`). |
| **Pageable** | Interfaz de Spring Data que encapsula la información de paginación solicitada (página, tamaño y orden). |
| **Page&lt;T&gt;** | Contenedor de Spring que agrupa los elementos de la página actual junto con los metadatos globales de conteo y navegación. |
| **Deep Paging** | Degradación severa del rendimiento en bases de datos relacionales al solicitar páginas con desplazamientos (*offset*) muy elevados. |
| **Keyset Pagination** | Técnica de paginación por cursor basada en comparar la clave del último registro visto (`WHERE id > :ultimoId LIMIT n`). |
| **MockMvc** | Utilidad de pruebas de Spring MVC que simula peticiones y respuestas HTTP completas sin levantar un servidor de red real. |
| **JSONPath** | Lenguaje de expresiones de consulta para inspeccionar y validar atributos anidados dentro de un cuerpo JSON en tests. |
| **OpenAPI 3.0** | Estándar de especificación abierta e independiente de plataforma para describir contratos de APIs RESTful. |
| **Swagger UI** | Interfaz web interactiva generada a partir de OpenAPI para explorar y ejecutar peticiones contra una API en vivo. |
| **Breaking Change** | Modificación en el contrato de una API que rompe el funcionamiento de los clientes existentes no actualizados. |
| **Ley de Postel** | Principio de diseño: *«sé conservador con lo que envías y liberal con lo que aceptas»* para maximizar la robustez del sistema. |
| **Sunset Header** | Cabecera HTTP estandarizada (RFC 8594) que comunica la fecha programada para la retirada definitiva de un endpoint. |

### Comprobación final del producto de la unidad

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría de API REST avanzada · criterios de producción</p>
  <ul class="checklist">
    <li>Los recursos relacionados se exponen mediante subrecursos desacoplados (<code>/proyectos/{id}/tareas</code>) con DTOs específicos que eliminan riesgos de recursión infinita.</li>
    <li>Las colecciones se filtran a través de parámetros de consulta (<code>@RequestParam</code>) en una única ruta canónica en plural sin duplicar endpoints.</li>
    <li>La búsqueda textual parcial es insensible a mayúsculas y acentos mediante <code>LOWER()</code> y limpia espacios en blanco.</li>
    <li>Todos los endpoints de listado están protegidos por paginación obligatoria con <code>@PageableDefault</code> y metadatos completos (<code>Page&lt;T&gt;</code>).</li>
    <li>PostgreSQL ejecuta sentencias con <code>LIMIT</code>, <code>OFFSET</code> y <code>ORDER BY</code> físicos, auditables en consola.</li>
    <li>El contrato HTTP completo está blindado por una suite de pruebas automatizadas con <code>@WebMvcTest</code> y <code>MockMvc</code>.</li>
    <li>La documentación técnica OpenAPI 3.0 se genera en <code>/v3/api-docs</code> y se visualiza interactivamente en <code>/swagger-ui.html</code>.</li>
    <li>Las rutas públicas incorporan prefijo de versión (<code>/api/v1/...</code>) para garantizar la estabilidad de los consumidores.</li>
    <li>Los endpoints u operaciones legadas emiten cabeceras estándar de obsolescencia (<code>Deprecation</code> y <code>Sunset</code>).</li>
    <li>La aplicación tolera propiedades desconocidas en peticiones entrantes sin provocar errores 400 injustificados.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Resultados de la unidad</p>
  <ul class="checklist">
    <li>Exponer relaciones sin filtrar el modelo interno ni provocar respuestas gigantes.</li>
    <li>Diseñar filtros y búsquedas que no se conviertan en un lenguaje de consulta improvisado.</li>
    <li>Paginar y ordenar colecciones declarando siempre el total.</li>
    <li>Comprobar endpoints con MockMvc sin depender de un cliente manual.</li>
    <li>Documentar la API con OpenAPI y evolucionar el contrato sin romper a quien lo consume.</li>
  </ul>
</div>

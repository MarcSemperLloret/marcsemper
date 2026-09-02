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

## Semana 15 · Consultar sin ahogar la respuesta

## Sesión 43 · Exponer relaciones sin romper el contrato

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> los tres patrones para exponer recursos relacionados en REST (incrustación resumida, subrecurso dedicado y enlace por ID), cómo prevenir respuestas gigantes (*payload bloat*) y cómo romper ciclos de serialización JSON.</li>
    <li><strong>2. Haz:</strong> diseña DTOs específicos de relación (<code>ProyectoResumenResponse</code>, <code>TareaDetalleResponse</code>) e implementa el subrecurso REST canónico <code>GET /proyectos/{id}/tareas</code> sin filtrar entidades internas.</li>
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

> [!NOTE]
> Observa cómo `TareaDetalleResponse` no contiene un objeto `Proyecto` anidado con todos sus campos ni entidades `Etiqueta`, sino solo los datos planos que la pantalla necesita (`proyectoId`, `proyectoNombre` y nombres de etiquetas). El contrato es completamente inmune a cambios internos del esquema.

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

> [!NOTE]
> Si en la evaluación se solicita una justificación de diseño de endpoints de relaciones, el formato de entrega de texto es siempre un **documento en PDF** (`analisis-relaciones.pdf`), nunca un archivo markdown suelto.

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
    <li>Los subrecursos jerárquicos (`/proyectos/{id}/tareas`) responden a colecciones de recursos relacionados.</li>
    <li>La petición a un subrecurso de un padre inexistente responde `404 Not Found` en lugar de un array vacío.</li>
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

> [!TIP]
> Al escribir `(:proyectoId IS NULL OR p.id = :proyectoId)`, si el cliente no envía el parámetro en la petición, el valor es `null`. La primera mitad de la condición se evalúa como `TRUE` y el motor de base de datos descarta ese filtro sin examinar la columna, evaluando únicamente los filtros que sí fueron proporcionados.

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

### Ahora tú · Filtro de proyectos por estado y nombre

Aplica el patrón de filtrado a la entidad `Proyecto`:

1. Añade en `ProyectoRepository` una consulta `buscarConFiltros` que reciba `Boolean activo` y `String q`.
2. En `ProyectoService`, normaliza el término de búsqueda.
3. Actualiza `GET /proyectos` en `ProyectoController` para admitir `?activo=true&q=portal`.
4. Comprueba en Bruno que si pides `GET /proyectos?activo=true` solo se listan proyectos habilitados, y que `GET /proyectos?q=web` localiza proyectos con independencia de mayúsculas y minúsculas.

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
    <li>La API utiliza una única ruta canónica en plural para consultar colecciones (`/tareas`, `/proyectos`).</li>
    <li>Todos los filtros se transmiten como parámetros de consulta (`@RequestParam(required = false)`).</li>
    <li>La consulta JPQL resuelve combinaciones arbitrarias de filtros sin requerir múltiples métodos en el repositorio.</li>
    <li>La búsqueda textual es insensible a mayúsculas mediante `LOWER()` y limpia espacios superfluos.</li>
    <li>La consulta no provoca el problema N+1 al incluir `JOIN FETCH` sobre las entidades relacionadas.</li>
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
5. Verifica que los metadatos `totalElements` reflejan el total de tareas filtradas, no el total absoluto de la tabla.

### Reto · El problema de la paginación profunda (Deep Paging)

Cuando una base de datos relacional ejecuta `OFFSET 1000000 LIMIT 10`, PostgreSQL debe leer un millón diez filas de disco y descartar el primer millón en memoria antes de devolver las diez solicitadas. A esto se le conoce como el **problema de la paginación profunda** (*Deep Paging*).

Analiza las consecuencias técnicas y diseña una alternativa:
1. ¿Por qué la latencia de una consulta con `OFFSET` crece de forma lineal a medida que avanzan las páginas?
2. Investiga qué es la **paginación por cursor o por clave de búsqueda** (*Keyset Pagination* o *Cursor-based Pagination*), que sustituye `OFFSET` por una cláusula del tipo:
   `WHERE t.id > :ultimoIdVisto ORDER BY t.id ASC LIMIT 10`.
3. ¿Por qué las aplicaciones con scroll infinito (como Twitter, Instagram o feeds de noticias) utilizan siempre paginación por cursor en lugar de `Pageable` basado en desplazamiento (*offset*)?

> [!NOTE]
> Si en la evaluación se solicita un informe de optimización de bases de datos o comparativa de rendimiento, el formato de entrega de texto es siempre un **documento en PDF** (`informe-paginacion.pdf`), nunca un archivo markdown suelto.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Paginación en <code>GET /proyectos</code> implementada con <code>@PageableDefault</code> y metadatos completos en la respuesta JSON.</span></div>
  <div><strong>Si lo tienes</strong><span>Paginación combinada con los filtros multicriterio de <code>Tarea</code> funcionando con ordenación dinámica.</span></div>
  <div><strong>Reto</strong><span>Estudio del problema de rendimiento de Deep Paging completado y propuesta técnica de paginación por cursor documentada.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 45</p>
  <ul class="checklist">
    <li>Los endpoints de listado devuelven una estructura paginada `Page<T>` con metadatos completos.</li>
    <li>La aplicación utiliza `@PageableDefault` para establecer límites de tamaño de página seguros.</li>
    <li>PostgreSQL ejecuta sentencias con `LIMIT` y `OFFSET` reales, sin cargar colecciones masivas en memoria.</li>
    <li>La ordenación por columnas (`sort=campo,asc/desc`) funciona de forma transparente en las consultas.</li>
    <li>Los filtros multicriterio y la paginación conviven en un único endpoint coherente.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué un endpoint de listado en producción nunca debe devolver un array plano sin paginar?</li>
    <li>¿Qué convención de numeración de páginas utiliza Spring Data (`0-based` o `1-based`)?</li>
    <li>¿Cómo traduce PostgreSQL la paginación a nivel de sintaxis SQL nativa?</li>
    <li>¿Qué ventaja ofrece el método `.map()` sobre un objeto `Page<Entidad>` en comparación con extraer la lista con `getContent()`?</li>
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
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> los tests del service no detectan que una ruta cambió, que un código de estado es incorrecto o que el JSON dejó de tener un campo.</li>
    <li><strong>Construye:</strong> tests de endpoint que cubren un caso correcto y un caso de error de un recurso.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **comprobar el contrato HTTP completo —ruta, estado, cuerpo— sin arrancar un servidor real**.

### 2. El problema

Los tests del service no detectan que una ruta cambió, que un código de estado es incorrecto o que el JSON dejó de tener un campo.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido tests de endpoint que cubren un caso correcto y un caso de error de un recurso.</li>
    <li>Puedes explicar qué parte resuelve el problema de partida.</li>
    <li>Has probado al menos un caso correcto y un caso límite o de error.</li>
    <li>El cambio queda integrado en la aplicación común del curso.</li>
  </ul>
</div>

### 8. Antes de irte

1. ¿Qué problema resolvía la decisión principal de hoy?
2. ¿Qué parte podrías modificar mañana sin volver a consultar el ejemplo?
3. ¿Qué prueba distingue una solución que parece funcionar de una que realmente funciona?

<div class="rule">
  <p class="rule-label">Estado del material</p>
  <p>La secuencia, el objetivo y la evidencia ya están definidos. La explicación, el código guiado, la actividad y el reto se completarán al desarrollar esta sesión.</p>
</div>

## Sesión 47 · OpenAPI y Swagger

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una API no documentada obliga a descubrirla por ensayo y error y se vuelve difícil de verificar.</li>
    <li><strong>Construye:</strong> una especificación OpenAPI navegable con ejemplos y respuestas.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **generar, leer y corregir documentación que refleje el contrato real**.

### 2. El problema

Una API no documentada obliga a descubrirla por ensayo y error y se vuelve difícil de verificar.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una especificación OpenAPI navegable con ejemplos y respuestas.</li>
    <li>Puedes explicar qué parte resuelve el problema de partida.</li>
    <li>Has probado al menos un caso correcto y un caso límite o de error.</li>
    <li>El cambio queda integrado en la aplicación común del curso.</li>
  </ul>
</div>

### 8. Antes de irte

1. ¿Qué problema resolvía la decisión principal de hoy?
2. ¿Qué parte podrías modificar mañana sin volver a consultar el ejemplo?
3. ¿Qué prueba distingue una solución que parece funcionar de una que realmente funciona?

<div class="rule">
  <p class="rule-label">Estado del material</p>
  <p>La secuencia, el objetivo y la evidencia ya están definidos. La explicación, el código guiado, la actividad y el reto se completarán al desarrollar esta sesión.</p>
</div>

## Sesión 48 · Evolucionar el contrato sin romper a quien lo consume

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> renombrar un campo publicado rompe todas las aplicaciones que ya lo leían, y nadie se entera hasta que fallan.</li>
    <li><strong>Construye:</strong> un cambio del contrato aplicado con su análisis de compatibilidad y su nota de versión.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **clasificar un cambio como compatible o incompatible y decidir cómo introducirlo**.

### 2. El problema

Renombrar un campo publicado rompe todas las aplicaciones que ya lo leían, y nadie se entera hasta que fallan.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un cambio del contrato aplicado con su análisis de compatibilidad y su nota de versión.</li>
    <li>Puedes explicar qué parte resuelve el problema de partida.</li>
    <li>Has probado al menos un caso correcto y un caso límite o de error.</li>
    <li>El cambio queda integrado en la aplicación común del curso.</li>
  </ul>
</div>

### 8. Antes de irte

1. ¿Qué problema resolvía la decisión principal de hoy?
2. ¿Qué parte podrías modificar mañana sin volver a consultar el ejemplo?
3. ¿Qué prueba distingue una solución que parece funcionar de una que realmente funciona?

<div class="rule">
  <p class="rule-label">Estado del material</p>
  <p>La secuencia, el objetivo y la evidencia ya están definidos. La explicación, el código guiado, la actividad y el reto se completarán al desarrollar esta sesión.</p>
</div>

## Lo que debes recordar

Esta página cerrará la unidad con el mapa conceptual, las decisiones que deben poder justificarse, preguntas de recuperación y una comprobación final del producto.

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

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

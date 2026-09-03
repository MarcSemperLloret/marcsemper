---
title: "Proyecto del primer trimestre"
label: "UD6 · Integrar"
section: "ud-06"
order: 6
lang: "es"
summary: "Integrar en un único producto todo lo construido hasta ahora, defenderlo técnicamente y recibir una revisión de código real."
duration: "6 horas · 1 semana · 3 sesiones"
modality: "Proyecto evaluable · 20 % guía / 80 % autonomía"
deliverable: "Una API Spring Boot completa, revisada, defendida y verificable con Postman o Bruno."
date: "2026-09-02"
outcomes:
  - "Traducir unos requisitos en un modelo y un contrato de API."
  - "Integrar diseño REST, capas y persistencia en un producto que funciona."
  - "Revisar el código de otro equipo y aceptar una revisión del propio."
  - "Defender oralmente las decisiones técnicas tomadas."
requirements:
  - "Todo lo construido de la UD1 a la UD5."
priorKnowledge:
  - "Diseño REST, DTO, validación, capas y JPA."
---

<p class="lead">Cierre del primer trimestre. No hay contenido nuevo: hay una especificación, un plazo y una defensa.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje muy bajo. La especificación técnica y los criterios de aceptación están publicados en esta misma unidad; el diseño de detalle, la implementación y el reparto del trabajo son del equipo.</p>
</div>

## Semana 14 · Integración y defensa

## Sesión 40 · Especificación y planificación

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> cómo interpretar un pliego de requisitos técnicos, acordar el contrato de endpoints en una colección ejecutable y diseñar el esquema relacional en PostgreSQL.</li>
    <li><strong>2. Haz:</strong> diseña el script DDL (<code>src/main/resources/schema.sql</code>), traslada los requisitos a una colección de peticiones en Bruno o Postman y organiza las prioridades de desarrollo en tu repositorio.</li>
    <li><strong>3. Comprueba:</strong> verificas que cada endpoint tiene definidos sus DTOs, códigos HTTP de éxito y error (400, 404, 409), y que la colección de Bruno/Postman queda preparada antes de programar una sola línea de código backend.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué empezar a programar controladores y entidades antes de acordar el contrato de la API y el esquema relacional genera retrabajo y código desechable?</li>
    <li>¿Qué diferencia a un requisito informal (<em>«las tareas deben poder etiquetarse»</em>) de un criterio de aceptación verificable (<em>Given-When-Then</em>)?</li>
    <li>¿Por qué la colección de pruebas HTTP (Bruno o Postman) debe crearse al inicio de la planificación y no al final del proyecto?</li>
  </ol>
</div>

### El coste del código sin contrato previo

El impulso más común del programador inexperto cuando recibe un proyecto es abrir el IDE y empezar a picar clases Java: un controlador por aquí, una entidad por allá, un método que se le acaba de ocurrir sobre la marcha.

Al cabo de cuatro horas, la catástrofe es inevitable:
* El endpoint `POST /tareas` espera un JSON con nombres de campos distintos a los que diseñó el compañero que hace las pruebas.
* La base de datos tiene una columna que no admite nulos, pero el DTO no lleva `@NotNull`, provocando errores `500` incomprensibles.
* Las rutas no siguen una convención REST consistente: unas usan plural (`/proyectos`), otras singular (`/tarea`) y otras verbos (`/crear-usuario`).
* La mitad del código escrito hay que refactorizarlo o tirarlo a la basura.

<div class="rule">
  <p class="rule-label">La ley de la especificación previa</p>
  <p><strong>En ingeniería de software profesional, el contrato de la API y el modelo relacional se pactan y documentan antes de abrir el IDE.</strong></p>
  <p>El código es barato de cambiar antes de escribirlo; reescribir entidades JPA, migraciones de PostgreSQL y controladores en marcha cuesta diez veces más tiempo.</p>
</div>

### El Pliego Técnico del Primer Trimestre: Gestor de Proyectos e Incidencias

El proyecto integrador de este trimestre consiste en consolidar en una única aplicación de producción todo lo aprendido desde la UD1 hasta la UD5.

<figure class="diagram">
  <figcaption>Arquitectura del entregable del primer trimestre</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>API REST (Spring Boot, DTOs, @Valid)</li>
    <li>Arquitectura en 3 capas desacopladas</li>
    <li>Persistencia JPA (Hibernate, proxies LAZY)</li>
    <li>PostgreSQL (tablas, FKs, secuencias, índices)</li>
  </ol>
</figure>

La aplicación debe satisfacer **cinco bloques de requisitos indispensables**:

<p class="stage">1 · Gestión de Proyectos</p>

* `POST /proyectos`: Alta de proyecto con `nombre` (único, no en blanco, máx. 80 caracteres) y `descripcion` opcional. Devuelve `201 Created` con cabecera `Location`.
* `GET /proyectos`: Listado paginado con `Pageable` o filtrado por estado `activo`.
* `GET /proyectos/{id}`: Detalle del proyecto. Si no existe, `404 Not Found`.
* `PUT /proyectos/{id}`: Modificación completa validando unicidad de nombre.
* `DELETE /proyectos/{id}`: Borrado físico o desactivación lógica, controlando restricciones de integridad referencial (`204 No Content`).

<p class="stage">2 · Gestión de Tareas e Incidencias</p>

* `POST /tareas`: Alta de tarea asociada obligatoriamente a un proyecto existente (`@ManyToOne`, `FetchType.LAZY`). Campos: `titulo`, `prioridad` (`ALTA`, `MEDIA`, `BAJA`) y `proyectoId`. Nace con `completada = false`.
* `GET /proyectos/{id}/tareas`: Subrecurso que devuelve todas las tareas de un proyecto específico.
* `PATCH /tareas/{id}/completar`: Modificación parcial para marcar tarea como resuelta.
* `PUT /tareas/{id}` y `DELETE /tareas/{id}`: Actualización y borrado con validación de existencia previa (`existsById`).

<p class="stage">3 · Asignaciones y Usuarios</p>

* Cada tarea puede tener opcionalmente un usuario responsable asignado (`@ManyToOne` nullable).
* Endpoint de consulta: `GET /tareas?responsableId={id}` para ver la carga de trabajo de un desarrollador.

<p class="stage">4 · Categorización por Etiquetas (Many-to-Many)</p>

* Catálogo de etiquetas independientes (`Etiqueta`: `id`, `nombre` único, `colorHex`).
* Tabla puente en PostgreSQL: `tareas_etiquetas`.
* Endpoints para asociar y desasociar: `POST /tareas/{id}/etiquetas/{etiquetaId}` y `DELETE /tareas/{id}/etiquetas/{etiquetaId}`.
* **Restricción estricta:** borrar una tarea jamás debe borrar la etiqueta del catálogo maestro.

<p class="stage">5 · Operaciones Transaccionales Complejas y Rendimiento</p>
* Caso de uso atómico multioperación: <code>POST /proyectos/{id}/clonar?nuevoNombre=...</code> protegido con <code>@Transactional(rollbackFor = Exception.class)</code>. Si una tarea falla, el proyecto clonado se revierte por completo.
* Cero consultas N+1: el listado de tareas con proyecto y etiquetas debe resolverse mediante <code>JOIN FETCH</code> en una sola sentencia SQL verificable en consola.

### De requisitos informales a criterios de aceptación (Gherkin)

Para que una tarea esté «terminada» (*Definition of Done*), su comportamiento debe especificarse mediante criterios de aceptación objetivos. Utilizaremos el formato **Dado / Cuando / Entonces** (*Given / When / Then*):

```gherkin
Escenario: Intento de asociar tarea a un proyecto inexistente
  Dado que no existe ningún proyecto con id 999 en PostgreSQL
  Cuando el cliente envía una petición POST /tareas con cuerpo {"titulo": "Fix", "prioridad": "ALTA", "proyectoId": 999}
  Entonces el servidor responde con código de estado HTTP 404 Not Found
  Y el cuerpo JSON contiene {"title": "Not Found", "status": 404, "detail": "No existe proyecto con id 999"}
  Y la consola SQL demuestra que no se ejecutó ninguna sentencia INSERT en la tabla tareas
```

```gherkin
Escenario: Alta de proyecto con nombre duplicado
  Dado que ya existe un proyecto registrado con nombre "Portal Web"
  Cuando el cliente envía POST /proyectos con nombre "Portal Web"
  Entonces el servidor responde con código HTTP 409 Conflict
  Y el cuerpo JSON detalla la regla de negocio violada
```

### Los tres artefactos de partida del proyecto

Antes de tirar código en la sesión 41, el equipo debe dejar listos tres elementos tangibles:

<p class="stage">1 · El contrato ejecutable: la colección de Bruno o Postman</p>

En lugar de redactar un documento de texto que nadie mantiene, el contrato de la API se define directamente en la **colección de peticiones HTTP**:

| Método | Endpoint | Descripción | Body Request | Códigos HTTP esperados |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/proyectos` | Crea un proyecto nuevo | `ProyectoRequest` | `201`, `400`, `409` |
| `GET` | `/proyectos` | Lista proyectos con filtro | Ninguno | `200` |
| `GET` | `/proyectos/{id}` | Detalle de proyecto | Ninguno | `200`, `404` |
| `POST` | `/tareas` | Crea tarea en proyecto | `TareaRequest` | `201`, `400`, `404` |
| `GET` | `/proyectos/{id}/tareas` | Tareas de un proyecto | Ninguno | `200`, `404` |
| `POST` | `/proyectos/{id}/clonar` | Clona proyecto y tareas | Query param | `201`, `400`, `404`, `409` |

<p class="stage">2 · El esquema relacional: src/main/resources/schema.sql</p>

El script DDL de referencia con los tipos exactos de PostgreSQL, secuencias, claves primarias, claves foráneas e índices:

```sql
-- Tablas principales
CREATE TABLE proyectos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE etiquetas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(40) NOT NULL UNIQUE,
    color_hex VARCHAR(7) NOT NULL
);

CREATE TABLE tareas (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(120) NOT NULL,
    prioridad VARCHAR(20) NOT NULL,
    completada BOOLEAN NOT NULL DEFAULT FALSE,
    proyecto_id BIGINT NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
    responsable_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE tareas_etiquetas (
    tarea_id BIGINT NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
    etiqueta_id BIGINT NOT NULL REFERENCES etiquetas(id) ON DELETE RESTRICT,
    PRIMARY KEY (tarea_id, etiqueta_id)
);

-- Índices para optimizar búsquedas frecuentes
CREATE INDEX idx_tareas_proyecto ON tareas(proyecto_id);
CREATE INDEX idx_tareas_prioridad ON tareas(prioridad);
```

<p class="stage">3 · La hoja de ruta técnica en el README.md</p>

El orden de trabajo del sprint organizado por dependencias técnicas:
1. **Fase 1 (Fundamentos):** Entidades base, DDL en `schema.sql`, Repositorios JPA y tests `@DataJpaTest`.
2. **Fase 2 (Casos de Uso Core):** Servicios y endpoints CRUD de Proyecto y Tarea con DTOs y validación `@Valid`.
3. **Fase 3 (Relaciones N:M y Subrecursos):** Catálogo de etiquetas, tabla puente y endpoints de asignación.
4. **Fase 4 (Integridad y Transacciones):** Caso de uso multioperación `clonarProyecto` con reversión atómica ante fallos.
5. **Fase 5 (Calidad y Rendimiento):** Erradicación de N+1 con `JOIN FETCH`, paginación y suite de tests en verde.

### Ahora tú · Preparar la suite de pruebas y el esquema

En esta sesión no se programa lógica Java. Tu entregable de hoy es la planificación rigurosa:

1. Crea el archivo `src/main/resources/schema.sql` con las sentencias DDL correspondientes a tu diseño de base de datos.
2. Abre tu cliente HTTP de cabecera (**Bruno** o **Postman**):
   * Crea una nueva colección llamada `Gestor-Proyectos-Trimestre-1`.
   * Configura la variable de entorno `baseUrl = http://localhost:8080`.
   * Crea las peticiones correspondientes a los endpoints pactados en la tabla superior con sus rutas, métodos y ejemplos de JSON en el cuerpo.
3. Anota en el `README.md` del repositorio el orden de las fases técnicas acordadas con tu equipo.
4. Revisa con tu compañero que las rutas y nombres de campos en la colección coincidan exactamente con lo que espera el modelo.

### Reto · Detección de ambigüedades en pliegos técnicos

Analiza estas tres frases extraídas de pliegos de clientes reales y detecta sus trampas de ingeniería:

<p class="stage stage--solo">1 · La trampa de «el sistema debe ser rápido»</p>
* *Frase del cliente:* «La consulta de proyectos y tareas debe cargar rápido».
* Explica por qué «rápido» no es un criterio de aceptación verificable.
* Reescribe esa frase como un criterio de ingeniería preciso y medible (definiendo percentiles de latencia, volumen de registros y número máximo de consultas SQL permitidas).

<p class="stage stage--solo">2 · La trampa de «eliminar un proyecto»</p>
* *Frase del cliente:* «Los usuarios pueden borrar proyectos cuando ya no los necesiten».
* ¿Qué ambigüedad mortal esconde esa frase respecto a las tareas que contiene el proyecto?
* ¿Qué tres alternativas técnicas existen y qué consecuencias tiene cada una para la base de datos?

<p class="stage stage--solo">3 · La trampa de la unicidad blanda</p>
* *Frase del cliente:* «No puede haber dos proyectos con el mismo nombre».
* ¿Qué ocurre si un usuario intenta crear <code>"Mi Proyecto"</code> y otro intenta crear <code>"mi proyecto"</code> o <code>"Mi Proyecto "</code> (con espacio al final)?
* ¿Cómo debe formularse este criterio a nivel de DTO, de Servicio y de base de datos relacional para que sea invulnerable?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Esquema <code>schema.sql</code> y tabla de correspondencia de endpoints definidos sin ambigüedades de nombres ni tipos.</span></div>
  <div><strong>Si lo tienes</strong><span>Colección completa en Bruno/Postman preparada con variables de entorno y fases ordenadas en <code>README.md</code>.</span></div>
  <div><strong>Reto</strong><span>Análisis de ambigüedades técnicas completado con criterios Gherkin rigurosos y gestión de borrados definida.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 40</p>
  <ul class="checklist">
    <li>Tienes pactado el contrato público de la API antes de escribir la primera línea de código backend.</li>
    <li>El esquema relacional de PostgreSQL está normalizado con tipos precisos, restricciones y claves foráneas explícitas.</li>
    <li>Las historias de usuario cuentan con criterios de aceptación en formato Dado / Cuando / Entonces.</li>
    <li>La colección de pruebas HTTP en Bruno o Postman está creada y lista para actuar como validador continuo durante el desarrollo.</li>
    <li>El backlog del equipo está ordenado por dependencias técnicas para no bloquear el avance del sprint.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué definir la colección de Bruno/Postman antes de programar acelera el desarrollo en lugar de retrasarlo?</li>
    <li>¿Qué tres partes componen un criterio de aceptación en formato Gherkin?</li>
    <li>¿Por qué las restricciones de unicidad deben declararse tanto en la lógica del servicio como en la tabla de PostgreSQL?</li>
    <li>¿Qué significa el concepto de «camino crítico» en la planificación de un sprint de desarrollo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque actúa como especificación ejecutable y contrato compartido: permite validar de inmediato cada endpoint conforme se construye sin tener que inventar peticiones sobre la marcha.</p>
  <p>2 · Dado (el contexto o estado inicial del sistema), Cuando (la acción o petición que realiza el cliente) y Entonces (el resultado observable, código de respuesta y cambios en base de datos).</p>
  <p>3 · El servicio permite emitir un error de negocio limpio (409 Conflict) con un mensaje comprensible, mientras que la restricción UNIQUE física de PostgreSQL garantiza la integridad ante condiciones de carrera concurrentes que el servicio no pueda prever.</p>
  <p>4 · Es la secuencia de tareas que determina la duración mínima del proyecto porque cada una depende estrictamente de que la anterior esté terminada (ej: no se pueden mapear relaciones JPA sin haber creado primero las entidades base).</p>
</details>

## Sesión 41 · Desarrollo del proyecto

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la disciplina del desarrollo por cortes verticales (<em>Tracer Bullets</em>), cómo mantener la suite de pruebas en verde continuo y la gestión de incidencias de persistencia.</li>
    <li><strong>2. Haz:</strong> implementa los casos de uso priorizados en la hoja de ruta de tu <code>README.md</code> conectando entidad, repositorio, servicio, controlador y manejo de errores.</li>
    <li><strong>3. Comprueba:</strong> ejecutas <code>./mvnw test</code> tras cada historia completada, validas las respuestas en Bruno/Postman y preparas las evidencias técnicas de resolución de incidencias.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué desarrollar «todas las entidades primero, luego todos los repositorios y al final los controladores» suele acabar en un atasco masivo de integración?</li>
    <li>¿Qué es un corte vertical (<em>Vertical Slice</em>) y por qué reduce el riesgo de errores en un proyecto con fecha límite?</li>
    <li>Si tras modificar una clase un test de repositorio que antes pasaba se pone en rojo, ¿cuál es la primera regla antes de seguir picando código?</li>
  </ol>
</div>

### La trampa del corte horizontal frente al corte vertical

El error más destructivo cuando el plazo es corto es organizar el trabajo por «capas horizontales»:
* **Primer tramo:** escribir todas las clases `@Entity`.
* **Segundo tramo:** escribir todas las interfaces `JpaRepository`.
* **Tercer tramo:** escribir todos los servicios.
* **Último tramo:** escribir los controladores e intentar arrancar por primera vez.

¿Qué ocurre el jueves por la tarde? La aplicación arroja 35 errores en cascada: tipos de datos incompatibles, dependencias circulares, mapeos erróneos de Hibernate y excepciones `PropertyReferenceException`. Como has tocado 40 archivos de golpe, **es imposible saber qué línea originó el desastre**.

En ingeniería de software profesional utilizamos **cortes verticales** (*Vertical Slices* o *Tracer Bullets*):

<figure class="diagram">
  <figcaption>Desarrollo por corte vertical (un caso de uso completo cada vez)</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Entidad y Repositorio</li>
    <li>2. Test de persistencia (@DataJpaTest)</li>
    <li>3. Servicio y Reglas de Negocio</li>
    <li>4. DTOs y Controlador REST</li>
    <li>5. Validación en Bruno/Postman</li>
  </ol>
</figure>

1. Coges la primera historia del backlog: *«Alta de Proyecto con validación de nombre único»*.
2. Creas su entidad, su repositorio y su test `@DataJpaTest`. Ejecutas `./mvnw test` → **VERDE**.
3. Creas su servicio con la regla de negocio y su excepción.
4. Creas sus DTOs, su controlador y su manejador de errores.
5. Ejecutas la petición en Bruno/Postman → **`201 Created`**.
6. Haces commit: `git commit -m "feat(proyectos): implementar alta con validacion de unicidad"`.

Ahora tu aplicación ya hace algo real, está probada, compila y no se romperá al avanzar.

<div class="rule">
  <p class="rule-label">La regla del semáforo en verde</p>
  <p><strong>Bajo ningún concepto se empieza un nuevo caso de uso si la suite de tests existente no está completamente en verde.</strong></p>
  <p>Si introduces un cambio y un test previo falla, detente inmediatamente. Arregla el fallo antes de escribir una sola línea de la siguiente funcionalidad. Arrastrar errores multiplica el coste de solución por diez.</p>
</div>

### Guía de diagnóstico rápido ante bloqueos típicos

Durante el sprint te toparás con errores reales de integración. Esta tabla resume la causa raíz de los cuatro bloqueos más frecuentes y su solución inmediata:

| Síntoma en la consola | Causa raíz | Solución de ingeniería |
| :--- | :--- | :--- |
| `LazyInitializationException: could not initialize proxy - no Session` | Se intentó acceder a una relación perezosa (`FetchType.LAZY`) fuera de la frontera transaccional (ej: en el controlador o Jackson). | Mapea la entidad a DTO **dentro del servicio** bajo `@Transactional(readOnly = true)`, o añade `JOIN FETCH` a la consulta del repositorio. |
| `DataIntegrityViolationException: null value in column violates not-null constraint` | El DTO aceptó un campo nulo que la tabla de PostgreSQL prohíbe, o la entidad se persistió sin asignar una clave foránea obligatoria. | Añade `@NotNull` / `@NotBlank` en el DTO con `@Valid` en el controlador, y valida en el servicio antes de llamar a `save()`. |
| `PropertyReferenceException: No property 'xyz' found for type 'Entidad'` | El nombre de un método en `JpaRepository` tiene una errata o hace referencia a un atributo inexistente. | Revisa el nombre exacto de la propiedad Java en la entidad (respetando mayúsculas y minúsculas). |
| `MultipleBagFetchException: cannot simultaneously fetch multiple bags` | Se intentó hacer `JOIN FETCH` simultáneo sobre dos colecciones de tipo `List` en la misma consulta JPQL. | Cambia las colecciones a `Set` o divide la carga en dos consultas dirigidas dentro de la misma transacción. |

### El registro de incidencias técnicas

En ingeniería de software no se esconden los problemas: se diagnostican y se resuelven con método. Si la tarea o evaluación requiere entregar una memoria escrita de incidencias técnicas resueltas, el formato oficial de entrega de texto es siempre un **documento en PDF** (`memoria-incidencias.pdf`), estructurado con este esquema:

```text
1. Incidencia: LazyInitializationException al listar proyectos con tareas
   - Síntoma: Al llamar a GET /proyectos/1/detalle, Jackson lanzaba error 500 por sesión cerrada.
   - Causa raíz: El mapper se ejecutaba en el controlador después de que la transacción del servicio hubiera cerrado la conexión con PostgreSQL.
   - Solución de ingeniería: Añadimos @Query("SELECT p FROM Proyecto p LEFT JOIN FETCH p.tareas WHERE p.id = :id") en ProyectoRepository para traer las tareas en la misma sentencia SQL.
```

Tener identificados y resueltos estos casos te servirá además como evidencia directa para la defensa técnica oral de la sesión 42.

<div class="rule">
  <p class="rule-label">Cuánto trabajo cabe aquí, dicho sin rodeos</p>
  <p>Esta unidad son <strong>tres sesiones de aula</strong>. En dos horas no se construye un proyecto completo, y nadie espera que lo hagas: lo que se construye aquí es la <strong>integración</strong> de piezas que ya sabes escribir, y por eso las cuatro iteraciones de abajo no son contenido nuevo, sino ensamblaje.</p>
  <p>Trabaja siempre en este orden: <strong>termina una iteración entera antes de empezar la siguiente</strong>. Es preferible entregar dos iteraciones que funcionan de punta a punta que cuatro a medias. La rúbrica valora lo que funciona, no lo que está empezado.</p>
  <p>Al final de cada sesión, haz un <code>commit</code> de lo que funcione, aunque esté incompleto. Un repositorio con historial es también una evidencia de cómo trabajas.</p>
</div>

### Ahora tú · Ejecutar el sprint de desarrollo

Sigue la planificación pactada en la sesión 40 y desarrolla el proyecto iteración a iteración:

<p class="stage">Iteración 1 · El núcleo de Proyectos y Tareas</p>

1. Desarrolla `Proyecto` y `Tarea` con la relación `@ManyToOne(fetch = FetchType.LAZY)`.
2. Implementa los repositorios con sus tests `@DataJpaTest`.
3. Conecta los servicios y controladores para altas y consultas.
4. Valida en Bruno/Postman que las peticiones devuelven `201 Created` y `404 Not Found`.

<p class="stage">Iteración 2 · Validaciones y Excepciones limpias</p>

1. Añade anotaciones de Bean Validation en todos los DTOs de petición (`@NotBlank`, `@Size`, `@Pattern`).
2. Configura `@RestControllerAdvice` para capturar errores de validación y de dominio, emitiendo respuestas con formato estándar RFC 7807 (Problem Details).
3. Prueba en Bruno casos de fallo con cuerpos JSON inválidos y verifica que la API devuelve `400 Bad Request` con mensajes detallados por campo.

<p class="stage">Iteración 3 · Etiquetas y relación Many-to-Many</p>

1. Implementa la entidad `Etiqueta` y la relación `@ManyToMany` con `@JoinTable` en `Tarea` utilizando `Set`.
2. Añade los endpoints de asignación y desasignación.
3. Comprueba en PostgreSQL que la tabla `tareas_etiquetas` se puebla y que borrar una tarea no elimina la etiqueta maestra.

<p class="stage">Iteración 4 · Operación transaccional y optimización N+1</p>

1. Desarrolla el caso de uso `clonarProyecto` protegido con `@Transactional(rollbackFor = Exception.class)`.
2. Audita la consola de Spring Boot con `spring.jpa.show-sql=true`:
   * Identifica cualquier consulta N+1 en los listados.
   * Sustitúyela por una consulta con `JOIN FETCH` o paginación con `Pageable`.
3. Ejecuta la suite completa: `./mvnw test` debe pasar al 100 % en verde.

### Reto · Diagnóstico forense de pruebas intermitentes (Flaky Tests)

Analiza este escenario crítico de integración continua (CI):

<p class="stage stage--solo">1 · El test que falla una de cada cinco veces</p>

Un compañero de equipo sube un cambio y el pipeline de GitHub Actions se pone en rojo de forma intermitente: unas veces los tests pasan y otras fallan sin tocar una sola línea de código:
* ¿Por qué los tests que dependen de secuencias autoincrementales (`assertThat(tarea.getId()).isEqualTo(1L)`) son la causa número uno de tests intermitentes (*Flaky Tests*) en persistencia?
* ¿Por qué un test que no limpia su base de datos o que olvida la transacción con rollback puede romper el test de otra clase que se ejecuta a continuación?
* Escribe tres reglas de diseño que garanticen que una batería de pruebas de persistencia sea **100 % determinista, independiente del orden de ejecución e inmune a las secuencias de PostgreSQL**.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Iteraciones 1 y 2 completadas: CRUD de Proyectos y Tareas funcionando con validación y DTOs limpios.</span></div>
  <div><strong>Si lo tienes</strong><span>Iteraciones 3 y 4 completadas: Etiquetas N:M, clonación transaccional y cero consultas N+1 con tests en verde.</span></div>
  <div><strong>Reto</strong><span>Registro de incidencias resueltas preparado para la defensa técnica y suite de tests 100 % determinista.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 41</p>
  <ul class="checklist">
    <li>Has desarrollado la aplicación siguiendo la estrategia de cortes verticales, manteniendo el sistema ejecutable en todo momento.</li>
    <li>Todos los endpoints devuelven códigos de estado HTTP semánticamente correctos (200, 201, 204, 400, 404, 409).</li>
    <li>La suite de pruebas automatizadas pasa en verde íntegramente mediante <code>./mvnw test</code>.</li>
    <li>La base de datos PostgreSQL mantiene la integridad referencial sin registros huérfanos ni anomalías transaccionales.</li>
    <li>Las incidencias técnicas encontradas están diagnosticadas con su causa raíz y preparadas para la defensa.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué el desarrollo por cortes verticales reduce drásticamente el tiempo total de integración?</li>
    <li>¿Cuál es la causa técnica de que un método @Transactional no haga rollback si lanza una excepción comprobada?</li>
    <li>¿Qué herramienta utilizas durante el desarrollo para verificar el número de sentencias SQL que genera una petición HTTP?</li>
    <li>¿Por qué un test nunca debe verificar que un id autoincremental sea exactamente igual a un número fijo como <code>1L</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque valida la integración completa de cada pieza en pequeños incrementos funcionales, detectando inconsistencias entre capas de inmediato en lugar de acumularlas para el final.</p>
  <p>2 · Porque Spring Boot por defecto solo revierte la transacción ante excepciones no comprobadas (RuntimeException o Error), a menos que se especifique <code>rollbackFor = Exception.class</code>.</p>
  <p>3 · Las propiedades de logging de SQL en <code>application.properties</code> (<code>spring.jpa.show-sql=true</code> y el formateador de Hibernate).</p>
  <p>4 · Porque el valor exacto de la secuencia depende del orden de ejecución de los tests y de inserciones previas; se debe comprobar que no sea nulo (<code>assertThat(id).isNotNull()</code> o <code>isPositive()</code>).</p>
</details>

## Sesión 42 · Code review, corrección y defensa

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el método profesional de revisión de código entre pares (<em>Peer Code Review</em>), los cinco vectores de auditoría backend y la estructura de una defensa técnica oral de 5 minutos.</li>
    <li><strong>2. Haz:</strong> audita el repositorio de otro equipo aplicando la rúbrica de 5 vectores de esta sesión (mediante comentarios en su Pull Request o una revisión guiada en el aula), aplica las refactorizaciones solicitadas en tu código y prepara el guion de defensa.</li>
    <li><strong>3. Comprueba:</strong> superas la defensa técnica individual justificando tus decisiones de diseño con evidencias de código y demostrando la ejecución de tests y peticiones en vivo.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué diferencia a un comentario subjetivo de estilo de una observación de revisión de código técnica fundamentada?</li>
    <li>¿Qué tres «olores de código» (<em>code smells</em>) en persistencia JPA delatan de inmediato a un desarrollador que no domina Hibernate?</li>
    <li>Durante una defensa técnica, ¿por qué admitir una limitación conocida puntúa mucho más alto que intentar ocultarla ante el tribunal?</li>
  </ol>
</div>

### La revisión de código no es buscar erratas

En muchas empresas novatas la revisión de código se limita a mirar si faltan espacios o si los nombres de variables son bonitos. Eso es una pérdida de tiempo que debería resolver un formateador automático.

Un **Code Review de ingeniería de software** audita la salud estructural y la viabilidad técnica del sistema a través de **cinco vectores críticos**:

<figure class="diagram">
  <figcaption>Los cinco vectores de una auditoría backend</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Arquitectura (capas desacopladas)</li>
    <li>2. Persistencia (LAZY, N+1, transacciones)</li>
    <li>3. Seguridad y Contrato (validación DTOs)</li>
    <li>4. Manejo de Errores (códigos semánticos)</li>
    <li>5. Calidad de Tests (sin mocks en BD)</li>
  </ol>
</figure>

| Vector de auditoría | Qué debes buscar activamente en el código ajeno |
| :--- | :--- |
| **1 · Arquitectura y Capas** | ¿Se cuelan entidades `@Entity` en las respuestas de los controladores? ¿Hay llamadas a repositorios desde el controlador sin pasar por el servicio? ¿El servicio conoce clases web o códigos HTTP? |
| **2 · Persistencia y Rendimiento** | ¿Hay relaciones con `FetchType.EAGER`? ¿Se usa `List` en `@ManyToMany`? ¿Están los métodos de escritura cubiertos por `@Transactional(rollbackFor = Exception.class)`? ¿Hay riesgo evidente de problema N+1? |
| **3 · Validación y Contrato** | ¿Tienen los DTOs anotaciones Bean Validation (`@NotBlank`, `@NotNull`, `@Size`)? ¿Lleva el controlador `@Valid` en los `@RequestBody`? ¿Se devuelven cabeceras `Location` en los `POST`? |
| **4 · Manejo de Errores** | ¿La API devuelve códigos de estado coherentes (`404` para no encontrado, `409` para conflicto de unicidad, `400` para validación)? ¿Se evitan errores `500` con trazas de pila expuestas al cliente? |
| **5 · Batería de Pruebas** | ¿La suite compila y pasa al 100 % con `./mvnw test`? ¿Los tests de repositorio usan `TestEntityManager` con `flush()` y `clear()` para evitar falsos positivos de caché? |

### Los niveles de severidad en la revisión de código

Para que la revisión sea profesional, constructiva y trazable, clasificamos cada observación según su **nivel de severidad** (ya sea como comentarios en la Pull Request de GitHub o en las notas de revisión del aula):

<dl class="worked">
  <dt>🔴 Bloqueante (<em>Blocker</em>)</dt>
  <dd>Fallos graves de integridad, corrupción de datos, consultas N+1 masivas, exposición de secretos o ausencia de validación que provoca errores 500 no capturados. <strong>El código no puede fusionarse hasta que se resuelva.</strong></dd>
  <dt>🟡 Mayor (<em>Major</em>)</dt>
  <dd>Violación de separación de capas (ej: DTOs dentro del servicio), ausencia de <code>rollbackFor = Exception.class</code> o tests con aserciones frágiles.</dd>
  <dt>🟢 Sugerencia (<em>Nitpick</em>)</dt>
  <dd>Oportunidades de simplificación con streams, nombres de métodos más expresivos o mejoras en el README.</dd>
</dl>

Ejemplo de observación técnica bien formulada:

```markdown
### [🔴 Bloqueante] Riesgo de problema N+1 en GET /tareas
* **Ubicación:** `TareaService.java`, línea 42.
* **Problema:** Se llama a `tareaRepo.findAll()` y en el bucle del mapper se accede a `t.getProyecto().getNombre()`. Al estar configurado `FetchType.LAZY`, esto provocará una consulta SQL adicional a PostgreSQL por cada tarea devuelta.
* **Propuesta de solución:** Añadir en `TareaRepository` un método con `@Query("SELECT t FROM Tarea t JOIN FETCH t.proyecto")` para recuperar la relación en una única sentencia SQL unificada.
```

### El protocolo de la defensa técnica individual (5 minutos cronometrados)

La defensa ante el tribunal de aula no es una lectura de diapositivas: es una conversación técnica entre ingenieros donde debes defender tus decisiones con evidencias del repositorio.

El tiempo se reparte con precisión militar:

```text
[ Minuto 1 ]  Visión general: arquitectura de capas y modelo relacional en PostgreSQL.
[ Minuto 2 ]  La decisión técnica más difícil: qué problema tuviste y cómo lo resolviste.
[ Minuto 3 ]  Evidencia de bitácora: muestra un bloqueo técnico real que superaste y su solución.
[ Minuto 4 ]  Demostración en vivo: ejecución de ./mvnw test y petición real en Bruno con SQL.
[ Minuto 5 ]  Pregunta sorpresa del tribunal: respuesta conceptual y justificación teórica.
```

<div class="rule">
  <p class="rule-label">El principio de honestidad técnica</p>
  <p><strong>Si el tribunal te señala un error o limitación en tu diseño, jamás inventes una excusa ni intentes taparlo.</strong></p>
  <p>Un ingeniero profesional responde: <em>«Tienes razón; en esta versión priorizamos X y aceptamos ese compromiso técnico. Para solucionarlo en producción implementaríamos Y mediante este cambio...»</em>. Esa respuesta demuestra madurez y dominio real de la materia.</p>
</div>

### Ahora tú · Auditoría cruzada y refactorización

En esta sesión realizarás la revisión de código de otro equipo y corregirás tu propio repositorio:

<p class="stage">1 · Audita el repositorio asignado</p>

1. Clona el repositorio de tus compañeros en una carpeta independiente.
2. Ejecuta `./mvnw test` para verificar si su suite pasa en verde a la primera.
3. Abre su código y revisa los cinco vectores de auditoría con la tabla anterior.
4. Deja al menos **un aspecto positivo bien resuelto** y **tres observaciones técnicas justificadas** categorizadas por severidad (como comentarios en su Pull Request de GitHub o en la sesión de revisión de aula).

<p class="stage">2 · Refactoriza tu propio proyecto</p>

1. Revisa las observaciones que te han dejado tus revisores.
2. Aplica las correcciones a las observaciones bloqueantes y mayores.
3. Vuelve a ejecutar `./mvnw test` para asegurar que nada se ha roto.
4. Haz un commit de entrega final: `git commit -m "refactor(review): resolver observaciones de auditoria tecnica"`.

<p class="stage">3 · Ensaya la defensa oral</p>

Prepara tu guion de 5 minutos asegurándote de tener la terminal lista con PostgreSQL arrancado, el proyecto corriendo y las peticiones preparadas en pestañas.

Estructura el guion en cuatro bloques breves, y para cada uno ten preparado **qué vas a enseñar en pantalla** mientras hablas:

| Tiempo | Qué cuentas | Qué enseñas mientras |
| :--- | :--- | :--- |
| 0–1 min | El modelo: qué entidades hay y cómo se relacionan | El diagrama y las clases `@Entity` |
| 1–3 min | El camino feliz completo | La colección ejecutándose: alta, consulta y borrado |
| 3–4 min | Un caso de error de verdad | Un `400` de validación y un `404`, con su cuerpo RFC 7807 |
| 4–5 min | Qué no está terminado | La lista de deuda técnica |

Las tres preguntas que caen casi siempre en esta primera defensa, y que conviene llevar preparadas:

* *«Enséñame dónde está la regla de negocio.»* No se contesta con palabras: se abre el `service` y se señala el método.
* *«¿Por qué este endpoint devuelve 404 y este otro 409?»* Es la pregunta que comprueba si entendiste la UD3 o si copiaste los códigos.
* *«Si te pido cambiar de PostgreSQL a otra base de datos, ¿qué tendrías que tocar?»* La respuesta correcta señala que el `service` no cambia, y es la prueba de que la arquitectura de la UD4 sirvió para algo.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Tu proyecto arranca desde cero en la máquina del equipo revisor; has dejado y recibido observaciones categorizadas por severidad; las bloqueantes están corregidas y la suite sigue en verde; y has ensayado la defensa entera con el cronómetro delante al menos una vez.</dd>
</dl>

### Reto · El simulador de preguntas de tribunal técnico

Ensaya tu respuesta a estas tres preguntas típicas de tribunal de evaluación y entrevistas técnicas:

<p class="stage stage--solo">1 · La optimización de lectura en transacciones</p>
* *Pregunta del tribunal:* «Veo que en tus consultas de lectura pones <code>@Transactional(readOnly = true)</code>. ¿Qué optimización concreta hace Hibernate y el driver JDBC con esa anotación?»
* *(Respuesta esperada: Hibernate desactiva el dirty checking sobre las entidades leídas, ahorrando ciclos de CPU y memoria RAM al no tener que mantener copias de comparación para actualización).*

<p class="stage stage--solo">2 · El impacto de desacoplar contratos</p>
* *Pregunta del tribunal:* «Si mañana el equipo de frontend te pide que en la respuesta de <code>GET /proyectos/{id}</code> el campo <code>activo</code> se llame <code>estaHabilitado</code>, ¿cuántos archivos de tu aplicación tendrías que modificar?»
* *(Respuesta esperada: Únicamente el DTO <code>ProyectoResponse</code> y el <code>ProyectoMapper</code>. La entidad JPA, la base de datos PostgreSQL y las reglas del servicio permanecen 100 % inalteradas gracias a la arquitectura desacoplada).*

<p class="stage stage--solo">3 · Concurrencia y condiciones de carrera</p>
* *Pregunta del tribunal:* «¿Qué ocurriría si dos peticiones HTTP intentan crear simultáneamente un proyecto con el mismo nombre en el mismo milisegundo?»
* *(Respuesta esperada: Ambas pasarían la validación del servicio <code>existsByNombre</code>, pero la restricción física <code>UNIQUE</code> de PostgreSQL abortaría una de ellas con <code>DataIntegrityViolationException</code>, garantizando la integridad de datos).*

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Revisión de código completada con observaciones técnicas fundamentadas en los 5 vectores.</span></div>
  <div><strong>Si lo tienes</strong><span>Refactorizaciones del feedback aplicadas con tests en verde y guion de defensa de 5 minutos preparado.</span></div>
  <div><strong>Reto</strong><span>Defensa técnica superada con demostración en vivo de peticiones HTTP, logs SQL y respuesta solvente a la pregunta sorpresa.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 42</p>
  <ul class="checklist">
    <li>Has realizado una revisión de código técnica objetiva basada en los cinco vectores de calidad backend.</li>
    <li>Has recibido feedback de tus pares y aplicado las refactorizaciones necesarias en tu propio repositorio.</li>
    <li>Tu aplicación compila, arranca limpiamente contra PostgreSQL y pasa la batería completa de pruebas automatizadas.</li>
    <li>Has defendido oralmente las decisiones de diseño arquitectónico y de persistencia ante el tribunal.</li>
    <li>Has culminado con éxito el proyecto integrador del primer trimestre.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Cuáles son los tres niveles de severidad con los que se categoriza una observación de Code Review?</li>
    <li>¿Por qué exponer entidades JPA directamente como respuesta de un controlador se considera un fallo bloqueante?</li>
    <li>¿Qué optimización de rendimiento aporta <code>@Transactional(readOnly = true)</code> a nivel de memoria en Hibernate?</li>
    <li>¿Cómo debe reaccionar un desarrollador ante una pregunta de tribunal cuya respuesta desconoce en el momento?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Bloqueante (Blocker: impide la fusión hasta solucionarse), Mayor (Major: problema de arquitectura o robustez importante) y Sugerencia (Nitpick: mejora de estilo o simplificación menor).</p>
  <p>2 · Porque acopla el contrato público de la API al esquema físico de la base de datos, puede provocar bucles infinitos de serialización JSON (StackOverflowError) y expone datos internos no deseados.</p>
  <p>3 · Desactiva el mecanismo de Dirty Checking (Hibernate no toma una instantánea en memoria de la entidad para comparar cambios al cerrar la transacción, ahorrando memoria y tiempo de CPU).</p>
  <p>4 · Reconociendo con sinceridad el límite del conocimiento puntual, explicando qué hipótesis técnica tiene y describiendo cómo investigaría o verificaría la solución en la documentación oficial.</p>
</details>

## Lo que debes recordar

### El método

En las catorce semanas de este primer trimestre has recorrido el camino completo de la ingeniería backend: desde entender cómo viaja un byte por un socket HTTP hasta construir una API REST completa, persistida en PostgreSQL, protegida por transacciones atómicas y validada por una batería de tests automatizados.

Para construir cualquier sistema de servidor con solvencia profesional, aplica siempre este ciclo de integración:

<figure class="diagram">
  <figcaption>El ciclo completo de desarrollo backend</figcaption>
  <ol class="flow">
    <li>Pacta el <strong>contrato público de la API</strong> y la colección de pruebas HTTP antes de programar.</li>
    <li>Diseña el <strong>esquema relacional físico</strong> con restricciones estrictas en PostgreSQL.</li>
    <li>Avanza en <strong>cortes verticales</strong> (un caso de uso completo a la vez) manteniendo los tests en verde.</li>
    <li>Separa responsabilidades en <strong>tres capas desacopladas</strong> comunicadas mediante DTOs.</li>
    <li>Protege la integridad mediante <strong>transacciones atómicas</strong> y audita el SQL para evitar el N+1.</li>
    <li>Somete el código a <strong>revisión de pares (*Code Review*)</strong> categorizada por severidades.</li>
    <li>Defiende tus decisiones con <strong>evidencias observables</strong> de código, tests y base de datos.</li>
  </ol>
</figure>

### La idea más importante

> **Un backend no se evalúa por la cantidad de código que tiene, sino por la solidez de sus contratos públicos, la integridad inquebrantable de sus datos y la capacidad del equipo para justificar sus decisiones técnicas con evidencias.**

El código es un activo que se deprecia con el tiempo; lo que permanece es la arquitectura que permite cambiarlo sin romperlo. Una API con contratos claros, capas desacopladas y datos consistentes sobrevive a cambios de framework, migraciones de base de datos y rotaciones de equipo.

<p class="term">El valor de la evidencia frente a la opinión</p>

En ingeniería de software no decimos *«creo que esto funciona»* o *«a mí me parece rápido»*. Decimos: *«Aquí está la colección de pruebas en verde, este es el tiempo de respuesta del percentil 95 y esta es la única sentencia SQL con JOIN que ejecuta PostgreSQL»*.

### Las decisiones que tienes que saber justificar

| Decisión de ingeniería | Lo que tienes que poder defender ante un tribunal |
| :--- | :--- |
| **Contrato previo y colección antes que código** | Permite acordar la interfaz con los clientes antes de gastar horas implementando, detecta inconsistencias de diseño a coste cero y actúa como especificación ejecutable viva. |
| **Desarrollo por cortes verticales** | Integra todas las capas en pequeños incrementos funcionales, garantizando que el sistema siempre compile y pase los tests, evitando el atasco masivo de integrar todas las capas al final. |
| **Tres capas estrictas con DTOs** | La capa web habla HTTP, el servicio decide reglas de negocio y el repositorio gestiona almacenamiento. Los DTOs aíslan el contrato exterior del esquema interno y erradican ciclos infinitos de serialización. |
| **Excepciones de dominio hacia Problem Details (RFC 7807)** | El servicio expresa fallos en lenguaje de negocio (`RecursoNoEncontradoException`); el controlador traduce a códigos HTTP semánticos (404, 409, 400) con formato estructurado estándar. |
| **`FetchType.LAZY` por defecto en JPA** | Evita la carga descontrolada de grafos de entidades en memoria y previene el colapso del pool de conexiones. |
| **`JOIN FETCH` en consultas de listado** | Resuelve de raíz el antipatrón N+1, convirtiendo decenas de viajes por red en una sola sentencia SQL con `INNER JOIN` relacional en PostgreSQL. |
| **`rollbackFor = Exception.class`** | Asegura la atomicidad de la transacción ante cualquier fallo, evitando que excepciones comprobadas hagan un `COMMIT` accidental sobre datos inconsistentes. |
| **`Set` en relaciones `@ManyToMany`** | Garantiza la unicidad y permite a Hibernate actualizar únicamente las filas modificadas en la tabla puente sin borrar y reinsertar toda la colección. |
| **Code Review categorizado por severidades** | Separa lo bloqueante (seguridad, integridad, rendimiento) de sugerencias menores de estilo, permitiendo priorizar la refactorización sin debates subjetivos estériles. |
| **Honestidad técnica en la defensa** | Reconocer una limitación y explicar cómo se solucionaría en producción demuestra madurez ingenieril y dominio del sistema. |

### Al terminar el trimestre deberías poder responder

1. ¿Cómo viaja una petición HTTP desde que el cliente la emite hasta que llega al método de tu `@RestController`?
2. ¿Por qué una API REST debe usar nombres en plural para recursos (`/proyectos`) y métodos HTTP para las acciones (`GET`, `POST`, `PUT`, `DELETE`)?
3. ¿Qué problema de diseño e información resuelve utilizar DTOs en lugar de recibir o devolver directamente entidades de la base de datos?
4. ¿Qué diferencia a nivel de arquitectura existe entre una validación de formato (`@NotBlank`) y una regla de negocio (`existsByNombre`)?
5. ¿Por qué el servicio nunca debe importar clases de `org.springframework.http` ni devolver `ResponseEntity`?
6. ¿Qué significa la Inversión de Control (IoC) y por qué la inyección por constructor es el estándar en Spring Boot?
7. ¿Cómo garantiza HikariCP que el servidor no agote los recursos del sistema operativo al recibir cientos de peticiones simultáneas?
8. ¿Qué diferencia al ciclo de vida de una entidad en estado *transient*, *managed* y *detached*?
9. ¿Cómo funciona el mecanismo de *Dirty Checking* de Hibernate y por qué hace innecesario llamar a `save()` al modificar una entidad gestionada?
10. ¿Por qué un test de repositorio que use mocks no aporta ninguna certeza sobre la validez de tus consultas SQL?
11. ¿Por qué es imprescindible llamar a `flush()` y `clear()` en `TestEntityManager` al verificar consultas personalizadas?
12. ¿Qué significa el «lado propietario» de una relación JPA y en qué tabla física reside la clave foránea?
13. ¿Por qué `@OneToMany(mappedBy = "...")` requiere métodos helper sincronizados (`agregarTarea`, `eliminarTarea`)?
14. ¿Por qué está terminantemente prohibido utilizar `CascadeType.REMOVE` en relaciones `@ManyToMany`?
15. ¿Qué cuatro garantías ofrecen las propiedades ACID y qué significa que una operación sea atómica?
16. ¿Qué excepciones provocan un `ROLLBACK` automático por defecto en Spring y cómo se configura para abarcar todas?
17. ¿Por qué llamar a un método `@Transactional` desde otro método de la misma clase anula la transacción (problema de autoinvocación)?
18. ¿Qué es el problema N+1, cómo se diagnostica observando la consola y cómo se soluciona con `JOIN FETCH`?
19. ¿Cuáles son los cinco vectores de auditoría técnica que se evalúan en una revisión de código backend?
20. ¿Cómo se estructura una defensa técnica oral de 5 minutos ante un tribunal de evaluación?

### El vocabulario del primer trimestre

| Concepto | Significa |
| :--- | :--- |
| **API REST** | Interfaz basada en recursos, URIs sin verbos, métodos HTTP semánticos y representación en JSON. |
| **DTO** | Objeto de Transferencia de Datos: contrato plano e inmutable entre el cliente HTTP y la capa web. |
| **RFC 7807** | Estándar de la IETF (*Problem Details*) para representar errores HTTP con formato JSON estructurado. |
| **Inversión de Control** | Principio donde el framework gestiona la creación y ciclo de vida de los componentes (*beans*). |
| **Inyección por constructor** | Suministrar colaboradores como parámetros finales en el constructor, facilitando pruebas unitarias. |
| **Arquitectura en Capas** | Separación en Controller (web), Service (negocio) y Repository (acceso a datos). |
| **ORM / Hibernate** | Motor que traduce grafos de objetos Java en tablas, filas y consultas en PostgreSQL. |
| **HikariCP** | Pool de conexiones JDBC de alto rendimiento que reutiliza sockets TCP con el motor de base de datos. |
| **Dirty Checking** | Sincronización automática de cambios de entidades gestionadas al final de la transacción. |
| **Slice Testing** | Pruebas de integración acotadas (`@DataJpaTest`) que solo levantan los componentes de persistencia. |
| **Lado propietario** | La entidad que contiene `@JoinColumn` y administra el valor de la clave foránea física. |
| **FetchType.LAZY** | Carga perezosa bajo demanda que utiliza proxies de Hibernate para diferir el acceso a datos. |
| **Problema N+1** | Fallo grave de rendimiento donde una consulta inicial genera N consultas adicionales repetidas. |
| **JOIN FETCH** | Instrucción JPQL que obliga a Hibernate a traer entidades asociadas en una única sentencia SQL unificada. |
| **Transacción ACID** | Unidad de trabajo atómica, consistente, aislada y duradera confirmada con `COMMIT` o deshecha con `ROLLBACK`. |
| **Corte vertical** | Estrategia de desarrollo que implementa un caso de uso completo a través de todas las capas cada vez. |
| **Code Review** | Auditoría técnica entre pares para evaluar arquitectura, persistencia, validación, errores y tests. |
| **Blocker (Bloqueante)** | Defecto de gravedad máxima que impide fusionar código por riesgo de corrupción, seguridad o caída del sistema. |
| **Defensa técnica** | Justificación oral individual de decisiones de diseño y resolución de problemas ante tribunal. |

### Comprobación final del producto del primer trimestre

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría final · el entregable completo del trimestre</p>
  <ul class="checklist">
    <li>El repositorio contiene <code>README.md</code> con instrucciones de arranque, <code>src/main/resources/schema.sql</code>, la suite de tests en verde y la colección de pruebas para Bruno o Postman.</li>
    <li>La aplicación arranca conectada a una base de datos PostgreSQL real sin errores de dialecto ni tablas desalineadas.</li>
    <li>Todos los endpoints de Proyectos, Tareas y Etiquetas responden con códigos HTTP semánticos y DTOs validados.</li>
    <li>La arquitectura en tres capas es estricta: ninguna entidad JPA llega al cliente ni el servicio conoce HTTP.</li>
    <li>Las operaciones complejas (clonación / transferencia) son atómicas y reverten limpiamente en PostgreSQL ante excepciones.</li>
    <li>El problema N+1 está erradicado mediante <code>JOIN FETCH</code> o paginación en todos los métodos de consulta.</li>
    <li>La suite completa de pruebas unitarias y de integración pasa al 100 % en verde con <code>./mvnw test</code>.</li>
    <li>La colección de pruebas HTTP (Bruno / Postman) se ejecuta con éxito de principio a fin.</li>
    <li>El equipo ha superado la revisión de código cruzada y la defensa técnica oral individual.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Resultados de la unidad</p>
  <ul class="checklist">
    <li>Traducir unos requisitos en un modelo y un contrato de API.</li>
    <li>Integrar diseño REST, capas y persistencia en un producto que funciona.</li>
    <li>Revisar el código de otro equipo y aceptar una revisión del propio.</li>
    <li>Defender oralmente las decisiones técnicas tomadas.</li>
  </ul>
</div>

---
title: "Proyecto del primer trimestre"
label: "UD6 · Integrar"
section: "ud-06"
order: 6
lang: "es"
summary: "Cerrar, revisar y defender la versión persistente y publicada del CRUD elegido al comenzar el trimestre."
duration: "6 horas · 1 semana · 2 sesiones de 3 h"
modality: "Taller de proyecto · 25 min de explicación, 140 min de trabajo y 15 min de cierre"
deliverable: "CRUD persistente del primer trimestre, con reglas de negocio comprobadas y explicación de sus decisiones."
date: "2026-09-09"
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

<p class="lead">Estas dos sesiones cierran las 84 horas del primer trimestre. Se revisa y defiende el CRUD elegido y construido desde la primera sesión; no se inicia otro proyecto. La matriz de complejidad de la UD1 es el criterio de alcance y la versión publicada es común a Servidor e Intermodular.</p>

## Semana 14 · Cerrar la primera versión del proyecto elegido

## Sesión 27 · Cerrar la primera versión del proyecto elegido

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [la defensa del proceso](/es/docencia/proyecto-intermodular/ud6-defender-el-metodo/sesion-14/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

El primer trimestre termina con el mismo proyecto que elegiste al comienzo. Hoy usarás una matriz de aceptación: cada requisito debe tener una comprobación que demuestre si se cumple. El taller se dedica a cerrar carencias de esa versión, sin iniciar otro CRUD.

#### De requisitos informales a criterios de aceptación (Gherkin)

Para que una tarea esté «terminada» (*Definition of Done*), su comportamiento debe especificarse mediante criterios de aceptación objetivos. Utilizaremos el formato **Dado / Cuando / Entonces** (*Given / When / Then*):

```gherkin
Escenario: Intento de asociar tarea a un proyecto inexistente
  Dado que no existe ningún proyecto con id 999 en PostgreSQL
  Cuando el cliente envía una petición POST /tareas con cuerpo {"titulo": "Fix", "prioridad": "alta", "proyectoId": 999}
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

#### La trampa del corte horizontal frente al corte vertical

El error más destructivo cuando el plazo es corto es organizar el trabajo por «capas horizontales»:
* **Primer tramo:** escribir todas las clases `@Entity`.
* **Segundo tramo:** escribir todas las interfaces `JpaRepository`.
* **Tercer tramo:** escribir todos los servicios.
* **Último tramo:** escribir los controladores e intentar arrancar por primera vez.

¿Qué ocurre el jueves por la tarde? La aplicación arroja 35 errores en cascada: tipos de datos incompatibles, dependencias circulares, mapeos erróneos de Hibernate y excepciones `PropertyReferenceException`. Al haberse modificado 40 archivos en una sola operación, **resulta imposible determinar qué línea originó el fallo**.

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

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre la propuesta del README, las pruebas, la colección y la versión desplegada. Anota el commit que estás revisando.
2. Relaciona cada criterio del trimestre con una ruta, test o consulta que lo demuestre. Marca cumple, falla o pendiente con una evidencia concreta.
3. Ordena los fallos por impacto y elige primero los que impiden ejecutar el flujo principal, conservar datos o respetar reglas.

#### Paso 2 · El coste del código sin contrato previo

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

#### Paso 3 · Ejemplo de matriz de aceptación: gestor de proyectos e incidencias

El siguiente ejemplo muestra cómo comprobar el alcance de un gestor. Usa los mismos criterios técnicos para revisar el CRUD de tu dominio, construido desde la UD1.

<figure class="diagram">
  <figcaption>Arquitectura del entregable del primer trimestre</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>API REST (Spring Boot, DTOs, @Valid)</li>
    <li>Arquitectura en 3 capas desacopladas</li>
    <li>Persistencia JPA (Hibernate, proxies LAZY)</li>
    <li>PostgreSQL (tablas, FKs, secuencias, índices)</li>
  </ol>
</figure>

En el gestor de referencia, los criterios se concretan así. En tu proyecto, escribe las operaciones equivalentes y conserva sus reglas de negocio:

* `POST /proyectos`: Alta de proyecto con `nombre` (único, no en blanco, máx. 80 caracteres) y `descripcion` opcional. Devuelve `201 Created` con cabecera `Location`.
* `GET /proyectos`: Listado paginado con `Pageable` o filtrado por estado `activo`.
* `GET /proyectos/{id}`: Detalle del proyecto. Si no existe, `404 Not Found`.
* `PUT /proyectos/{id}`: Modificación completa validando unicidad de nombre.
* `DELETE /proyectos/{id}`: Borrado físico o desactivación lógica, controlando restricciones de integridad referencial (`204 No Content`).

* `POST /tareas`: Alta de tarea asociada obligatoriamente a un proyecto existente (`@ManyToOne`, `FetchType.LAZY`). Campos: `titulo`, `prioridad` (`ALTA`, `MEDIA`, `BAJA`) y `proyectoId`. Nace con `completada = false`.
* `GET /proyectos/{id}/tareas`: Subrecurso que devuelve todas las tareas de un proyecto específico.
* `PATCH /tareas/{id}/completar`: Modificación parcial para marcar tarea como resuelta.
* `PUT /tareas/{id}` y `DELETE /tareas/{id}`: Actualización y borrado con validación de existencia previa (`existsById`).

* Cada tarea puede tener opcionalmente un usuario responsable asignado (`@ManyToOne` nullable).
* Endpoint de consulta: `GET /tareas?responsableId={id}` para ver la carga de trabajo de un desarrollador.

* Catálogo de etiquetas independientes (`Etiqueta`: `id`, `nombre` único, `colorHex`).
* Tabla puente en PostgreSQL: `tareas_etiquetas`.
* Endpoints para asociar y desasociar: `POST /tareas/{id}/etiquetas/{etiquetaId}` y `DELETE /tareas/{id}/etiquetas/{etiquetaId}`.
* **Restricción estricta:** borrar una tarea jamás debe borrar la etiqueta del catálogo maestro.

* Caso de uso atómico multioperación: <code>POST /proyectos/{id}/clonar?nuevoNombre=...</code> protegido con <code>@Transactional(rollbackFor = Exception.class)</code>. Si una tarea falla, el proyecto clonado se revierte por completo.
* Cero consultas N+1: el listado de tareas con proyecto y etiquetas debe resolverse mediante <code>JOIN FETCH</code> en una sola sentencia SQL verificable en consola.

#### Paso 4 · Los tres artefactos de partida del proyecto

Antes de cerrar la versión del trimestre, revisa estos tres elementos en tu proyecto existente:

En lugar de redactar un documento de texto que nadie mantiene, el contrato de la API se define directamente en la **colección de peticiones HTTP**:

| Método | Endpoint | Descripción | Body Request | Códigos HTTP esperados |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/proyectos` | Crea un proyecto nuevo | `ProyectoRequest` | `201`, `400`, `409` |
| `GET` | `/proyectos` | Lista proyectos con filtro | Ninguno | `200` |
| `GET` | `/proyectos/{id}` | Detalle de proyecto | Ninguno | `200`, `404` |
| `POST` | `/tareas` | Crea tarea en proyecto | `TareaRequest` | `201`, `400`, `404` |
| `GET` | `/proyectos/{id}/tareas` | Tareas de un proyecto | Ninguno | `200`, `404` |
| `POST` | `/proyectos/{id}/clonar` | Clona proyecto y tareas | Query param | `201`, `400`, `404`, `409` |

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

El orden de trabajo del sprint organizado por dependencias técnicas:
1. **Fase 1 (Fundamentos):** Entidades base, DDL en `schema.sql`, Repositorios JPA y tests `@DataJpaTest`.
2. **Fase 2 (Casos de Uso Core):** Servicios y endpoints CRUD de Proyecto y Tarea con DTOs y validación `@Valid`.
3. **Fase 3 (Relaciones N:M y Subrecursos):** Catálogo de etiquetas, tabla puente y endpoints de asignación.
4. **Fase 4 (Integridad y Transacciones):** Caso de uso multioperación `clonarProyecto` con reversión atómica ante fallos.
5. **Fase 5 (Calidad y Rendimiento):** Erradicación de N+1 con `JOIN FETCH`, paginación y suite de tests en verde.

#### Paso 5 · Preparar la suite de pruebas y el esquema

1. Abre las entidades y el esquema de PostgreSQL. Compara nombres de tablas, tipos, claves y restricciones. Guarda el esquema revisado en `docs/esquema.sql` como documentación; no actives su ejecución automática sobre tablas existentes.
2. En la colección del proyecto añade una carpeta «Aceptación trimestre 1» y conserva la variable `baseUrl`. Ordena los casos: crear padre → crear recursos relacionados → consultar → modificar → comprobar rechazos → borrar datos de prueba.
3. En cada petición utiliza el id devuelto por el alta anterior. Añade una aserción de estado y otra sobre el dato importante; reutiliza los casos que ya funcionan.
4. Ejecuta la carpeta completa y revisa las discrepancias entre colección, modelo y README. Corrige primero una discrepancia, repite su caso y después vuelve a ejecutar la carpeta.
5. Registra qué requisitos están comprobados y cuál falta por resolver. Esta es la misma aplicación que se pondrá en producción con Intermodular.

#### Paso 6 · Guía de diagnóstico rápido ante bloqueos típicos

Durante el sprint te toparás con errores reales de integración. Esta tabla resume la causa raíz de los cuatro bloqueos más frecuentes y su solución inmediata:

| Síntoma en la consola | Causa raíz | Solución de ingeniería |
| :--- | :--- | :--- |
| `LazyInitializationException: could not initialize proxy - no Session` | Se intentó acceder a una relación perezosa (`FetchType.LAZY`) fuera de la frontera transaccional (ej: en el controlador o Jackson). | Mapea la entidad a DTO **dentro del servicio** bajo `@Transactional(readOnly = true)`, o añade `JOIN FETCH` a la consulta del repositorio. |
| `DataIntegrityViolationException: null value in column violates not-null constraint` | El DTO aceptó un campo nulo que la tabla de PostgreSQL prohíbe, o la entidad se persistió sin asignar una clave foránea obligatoria. | Añade `@NotNull` / `@NotBlank` en el DTO con `@Valid` en el controlador, y valida en el servicio antes de llamar a `save()`. |
| `PropertyReferenceException: No property 'xyz' found for type 'Entidad'` | El nombre de un método en `JpaRepository` tiene una errata o hace referencia a un atributo inexistente. | Revisa el nombre exacto de la propiedad Java en la entidad (respetando mayúsculas y minúsculas). |
| `MultipleBagFetchException: cannot simultaneously fetch multiple bags` | Se intentó hacer `JOIN FETCH` simultáneo sobre dos colecciones de tipo `List` en la misma consulta JPQL. | Cambia las colecciones a `Set` o divide la carga en dos consultas dirigidas dentro de la misma transacción. |

#### Paso 7 · El registro de incidencias técnicas

En ingeniería de software no se esconden los problemas: se diagnostican y se resuelven con método. Registra las incidencias técnicas resueltas en las comprobaciones de la sesión, dentro del mismo repositorio, con este esquema:

```text
1. Incidencia: LazyInitializationException al listar proyectos con tareas
   - Síntoma: Al llamar a GET /proyectos/1/detalle, Jackson lanzaba error 500 por sesión cerrada.
   - Causa raíz: El mapper se ejecutaba en el controlador después de que la transacción del servicio hubiera cerrado la conexión con PostgreSQL.
   - Solución de ingeniería: Añadimos @Query("SELECT p FROM Proyecto p LEFT JOIN FETCH p.tareas WHERE p.id = :id") en ProyectoRepository para traer las tareas en la misma sentencia SQL.
```

Tener identificados y resueltos estos casos te servirá además como evidencia directa para la defensa técnica oral de la sesión 28.

<div class="rule">
  <p class="rule-label">Cuánto trabajo cabe aquí, dicho sin rodeos</p>
  <p>Esta unidad ocupa <strong>dos sesiones de tres horas</strong>. El proyecto se lleva construyendo desde la primera sesión del trimestre. Las iteraciones de este ejemplo sirven para revisar e integrar lo que ya existe antes de la defensa; no son el comienzo de otra aplicación.</p>
  <p>Trabaja siempre en este orden: <strong>termina una iteración entera antes de empezar la siguiente</strong>. Es preferible entregar dos iteraciones que funcionan de punta a punta que cuatro a medias. La rúbrica valora lo que funciona, no lo que está empezado.</p>
  <p>Al final de cada sesión, haz un <code>commit</code> de lo que funcione, aunque esté incompleto. Un repositorio con historial es también una evidencia de cómo trabajas.</p>
</div>

#### Paso 8 · Ejecutar el sprint de desarrollo

Elige el primer requisito pendiente de la matriz y reproduce su fallo. Localiza la capa responsable, realiza un cambio pequeño y repite esa comprobación; después ejecuta las pruebas relacionadas para detectar regresiones. Actualiza la fila con archivo, commit y resultado. Continúa con el siguiente pendiente hasta que el recorrido principal, las relaciones y las reglas puedan demostrarse en la versión publicada mediante Intermodular.

1. Desarrolla `Proyecto` y `Tarea` con la relación `@ManyToOne(fetch = FetchType.LAZY)`.
2. Implementa los repositorios con sus tests `@DataJpaTest`.
3. Conecta los servicios y controladores para altas y consultas.
4. Valida en Bruno/Postman que las peticiones devuelven `201 Created` y `404 Not Found`.

1. Añade anotaciones de Bean Validation en todos los DTOs de petición (`@NotBlank`, `@Size`, `@Pattern`).
2. Configura `@RestControllerAdvice` para capturar errores de validación y de dominio, emitiendo respuestas con formato estándar RFC 7807 (Problem Details).
3. Prueba en Bruno casos de fallo con cuerpos JSON inválidos y verifica que la API devuelve `400 Bad Request` con mensajes detallados por campo.

1. Implementa la entidad `Etiqueta` y la relación `@ManyToMany` con `@JoinTable` en `Tarea` utilizando `Set`.
2. Añade los endpoints de asignación y desasignación.
3. Comprueba en PostgreSQL que la tabla `tareas_etiquetas` se puebla y que borrar una tarea no elimina la etiqueta maestra.

1. Desarrolla el caso de uso `clonarProyecto` protegido con `@Transactional(rollbackFor = Exception.class)`.
2. Audita la consola de Spring Boot con `spring.jpa.show-sql=true`:
   * Identifica cualquier consulta N+1 en los listados.
   * Sustitúyela por una consulta con `JOIN FETCH` o paginación con `Pageable`.
3. Ejecuta la suite completa: `./mvnw test` debe pasar al 100 % en verde.

#### Paso 9 · Comprobar y registrar el resultado del proyecto

1. Ejecuta de nuevo cada comprobación que antes fallaba y registra qué cambio la ha corregido.
2. Repite el recorrido completo del producto y confirma que el repositorio contiene instrucciones suficientes para arrancar esa versión con su base de datos.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Detección de ambigüedades en pliegos técnicos

Analiza estas tres frases extraídas de pliegos de clientes reales y detecta sus trampas de ingeniería:

* *Frase del cliente:* «La consulta de proyectos y tareas debe cargar rápido».
* Explica por qué «rápido» no es un criterio de aceptación verificable.
* Reescribe esa frase como un criterio de ingeniería preciso y medible (definiendo percentiles de latencia, volumen de registros y número máximo de consultas SQL permitidas).

* *Frase del cliente:* «Los usuarios pueden borrar proyectos cuando ya no los necesiten».
* ¿Qué ambigüedad mortal esconde esa frase respecto a las tareas que contiene el proyecto?
* ¿Qué tres alternativas técnicas existen y qué consecuencias tiene cada una para la base de datos?

* *Frase del cliente:* «No puede haber dos proyectos con el mismo nombre».
* ¿Qué ocurre si un usuario intenta crear <code>"Mi Proyecto"</code> y otro intenta crear <code>"mi proyecto"</code> o <code>"Mi Proyecto "</code> (con espacio al final)?
* ¿Cómo debe formularse este criterio a nivel de DTO, de Servicio y de base de datos relacional para que sea invulnerable?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Esquema <code>schema.sql</code> y tabla de correspondencia de endpoints definidos sin ambigüedades de nombres ni tipos.</span></div>
  <div><strong>Si lo tienes</strong><span>Colección completa en Bruno/Postman preparada con variables de entorno y fases ordenadas en <code>README.md</code>.</span></div>
  <div><strong>Reto</strong><span>Análisis de ambigüedades técnicas completado con criterios Gherkin rigurosos y gestión de borrados definida.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque actúa como especificación ejecutable y contrato compartido: permite validar de inmediato cada endpoint conforme se construye sin tener que inventar peticiones sobre la marcha.</p>
  <p>2 · Dado (el contexto o estado inicial del sistema), Cuando (la acción o petición que realiza el cliente) y Entonces (el resultado observable, código de respuesta y cambios en base de datos).</p>
  <p>3 · El servicio permite emitir un error de negocio limpio (409 Conflict) con un mensaje comprensible, mientras que la restricción UNIQUE física de PostgreSQL garantiza la integridad ante condiciones de carrera concurrentes que el servicio no pueda prever.</p>
  <p>4 · Es la secuencia de tareas que determina la duración mínima del proyecto porque cada una depende estrictamente de que la anterior esté terminada (ej: no se pueden mapear relaciones JPA sin haber creado primero las entidades base).</p>
</details>

##### Reto · Diagnóstico forense de pruebas intermitentes (Flaky Tests)

Analiza este escenario crítico de integración continua (CI):

Un compañero de equipo sube un cambio y el pipeline de GitHub Actions se pone en rojo de forma intermitente: unas veces los tests pasan y otras fallan sin tocar una sola línea de código:
* ¿Por qué los tests que dependen de secuencias autoincrementales (`assertThat(tarea.getId()).isEqualTo(1L)`) son la causa número uno de tests intermitentes (*Flaky Tests*) en persistencia?
* ¿Por qué un test que no limpia su base de datos o que olvida la transacción con rollback puede romper el test de otra clase que se ejecuta a continuación?
* Escribe tres reglas de diseño que garanticen que una batería de pruebas de persistencia sea **100 % determinista, independiente del orden de ejecución e inmune a las secuencias de PostgreSQL**.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Iteraciones 1 y 2 completadas: CRUD de Proyectos y Tareas funcionando con validación y DTOs limpios.</span></div>
  <div><strong>Si lo tienes</strong><span>Iteraciones 3 y 4 completadas: Etiquetas N:M, clonación transaccional y cero consultas N+1 con tests en verde.</span></div>
  <div><strong>Reto</strong><span>Registro de incidencias resueltas preparado para la defensa técnica y suite de tests 100 % determinista.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque valida la integración completa de cada pieza en pequeños incrementos funcionales, detectando inconsistencias entre capas de inmediato en lugar de acumularlas para el final.</p>
  <p>2 · Porque Spring Boot por defecto solo revierte la transacción ante excepciones no comprobadas (RuntimeException o Error), a menos que se especifique <code>rollbackFor = Exception.class</code>.</p>
  <p>3 · Las propiedades de logging de SQL en <code>application.properties</code> (<code>spring.jpa.show-sql=true</code> y el formateador de Hibernate).</p>
  <p>4 · Porque el valor exacto de la secuencia depende del orden de ejecución de los tests y de inserciones previas; se debe comprobar que no sea nulo (<code>assertThat(id).isNotNull()</code> o <code>isPositive()</code>).</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

El mismo commit identifica la API evaluable y su despliegue; el CRUD, las relaciones y las operaciones complejas tienen evidencias.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Sesión 28 · Revisión y defensa del backend en producción

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [la defensa del proceso](/es/docencia/proyecto-intermodular/ud6-defender-el-metodo/sesion-14/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Ya has revisado los criterios del primer trimestre. Hoy defenderás cómo funciona el backend y comprobarás que otra persona puede verificarlo. En Servidor explicarás código, reglas, persistencia y pruebas; en Intermodular se evalúa el flujo seguido para publicar esa versión.

Esta demostración es común con Intermodular 14. Relaciona la explicación técnica con las evidencias de proceso del mismo producto. El bloque de cinco minutos descrito abajo corresponde a la parte técnica, no a una segunda defensa independiente.

#### La revisión de código no es buscar erratas

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

#### Los niveles de severidad en la revisión de código

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

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre el repositorio y la URL del backend. Identifica el mismo commit en las evidencias de la versión que vas a defender.
2. Prepara datos de demostración y selecciona una operación completa, una regla rechazada y una consulta con relaciones.
3. Localiza el controlador, servicio, repositorio y test de esa operación para poder recorrerlos sin buscar durante la explicación.

#### Paso 2 · El protocolo de la defensa técnica individual (5 minutos cronometrados)

Prepara una secuencia breve en tu colección: consulta correcta, escritura válida, regla rechazada y una consulta que use relaciones. Abre también los métodos que las atienden. Ensaya con un compañero: uno ejecuta y explica; el otro comprueba que la respuesta y la versión corresponden al repositorio entregado. Si aparece un fallo, registra la petición exacta y corrige su causa antes de volver a ensayar. No memorices respuestas sobre una arquitectura distinta de la tuya.

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

#### Paso 3 · Auditoría cruzada y refactorización

Clona la versión de otro equipo en otra carpeta y utiliza una base de desarrollo propia, configurada como indica su README. Ejecuta primero los tests y después la colección, con el backend encendido. Para cada observación escribe requisito, archivo o petición, resultado esperado y observado. Corrige después tu propio proyecto con esos mismos criterios, una observación cada vez, y actualiza el registro de la sesión en GitHub.

1. Clona el repositorio de tus compañeros en una carpeta independiente.
2. Ejecuta `./mvnw test` para verificar si su suite pasa en verde a la primera.
3. Abre su código y revisa los cinco vectores de auditoría con la tabla anterior.
4. Deja al menos **un aspecto positivo bien resuelto** y **tres observaciones técnicas justificadas** categorizadas por severidad (como comentarios en su Pull Request de GitHub o en la sesión de revisión de aula).

1. Revisa las observaciones que te han dejado tus revisores.
2. Aplica las correcciones a las observaciones bloqueantes y mayores.
3. Vuelve a ejecutar `./mvnw test` para asegurar que nada se ha roto.
4. Haz un commit de entrega final: `git commit -m "refactor(review): resolver observaciones de auditoria tecnica"`.

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

#### Paso 4 · Comprobar y registrar el resultado del proyecto

1. Reproduce el caso permitido y el rechazado, y explica qué capa decide cada resultado y qué datos quedan almacenados.
2. Haz que otra persona siga el README y registre cualquier paso que falte. Incorpora la corrección y deja el commit final de la revisión identificado.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · El simulador de preguntas de tribunal técnico

Ensaya tu respuesta a estas tres preguntas típicas de tribunal de evaluación y entrevistas técnicas:

* *Pregunta del tribunal:* «Veo que en tus consultas de lectura pones <code>@Transactional(readOnly = true)</code>. ¿Qué optimización concreta hace Hibernate y el driver JDBC con esa anotación?»
* *(Respuesta esperada: Hibernate desactiva el dirty checking sobre las entidades leídas, ahorrando ciclos de CPU y memoria RAM al no tener que mantener copias de comparación para actualización).*

* *Pregunta del tribunal:* «Si mañana el equipo de frontend te pide que en la respuesta de <code>GET /proyectos/{id}</code> el campo <code>activo</code> se llame <code>estaHabilitado</code>, ¿cuántos archivos de tu aplicación tendrías que modificar?»
* *(Respuesta esperada: Únicamente el DTO <code>ProyectoResponse</code> y el <code>ProyectoMapper</code>. La entidad JPA, la base de datos PostgreSQL y las reglas del servicio permanecen 100 % inalteradas gracias a la arquitectura desacoplada).*

* *Pregunta del tribunal:* «¿Qué ocurriría si dos peticiones HTTP intentan crear simultáneamente un proyecto con el mismo nombre en el mismo milisegundo?»
* *(Respuesta esperada: Ambas pasarían la validación del servicio <code>existsByNombre</code>, pero la restricción física <code>UNIQUE</code> de PostgreSQL abortaría una de ellas con <code>DataIntegrityViolationException</code>, garantizando la integridad de datos).*

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Revisión de código completada con observaciones técnicas fundamentadas en los 5 vectores.</span></div>
  <div><strong>Si lo tienes</strong><span>Refactorizaciones del feedback aplicadas con tests en verde y guion de defensa de 5 minutos preparado.</span></div>
  <div><strong>Reto</strong><span>Defensa técnica superada con demostración en vivo de peticiones HTTP, logs SQL y respuesta solvente a la pregunta sorpresa.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Bloqueante (Blocker: impide la fusión hasta solucionarse), Mayor (Major: problema de arquitectura o robustez importante) y Sugerencia (Nitpick: mejora de estilo o simplificación menor).</p>
  <p>2 · Porque acopla el contrato público de la API al esquema físico de la base de datos, puede provocar bucles infinitos de serialización JSON (StackOverflowError) y expone datos internos no deseados.</p>
  <p>3 · Desactiva el mecanismo de Dirty Checking (Hibernate no toma una instantánea en memoria de la entidad para comparar cambios al cerrar la transacción, ahorrando memoria y tiempo de CPU).</p>
  <p>4 · Reconociendo con sinceridad el límite del conocimiento puntual, explicando qué hipótesis técnica tiene y describiendo cómo investigaría o verificaría la solución en la documentación oficial.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Se entrega la misma versión en ambos módulos: aquí se evalúan código y funcionamiento; en Intermodular, workflow, CI, revisión y puesta en producción.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Lo que debes recordar

La versión final del trimestre es el mismo proyecto iniciado en la UD1. Comprueba toda su matriz de complejidad: CRUD, DTO, errores, capas, relaciones uno a muchos y muchos a muchos, PostgreSQL, consultas, una operación transaccional, control de N+1 y pruebas. La defensa técnica utiliza código y resultados de esa versión.

Intermodular recibe el mismo repositorio y commit para evaluar issues, ramas, revisiones, CI y despliegue. El backend debe estar publicado y conservar datos al reiniciar; un README que todavía lo describa como una API solo en memoria está desactualizado.

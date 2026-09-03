---
title: "Persistencia con JPA y PostgreSQL"
label: "UD5 · Persistir"
section: "ud-05"
order: 5
lang: "es"
summary: "Sustituir las listas en memoria por una base de datos relacional real, con relaciones, consultas, transacciones y sus propios tests."
duration: "24 horas · 4 semanas · 12 sesiones"
modality: "Taller técnico · 50 % guía / 50 % autonomía"
deliverable: "El gestor de proyectos persistido en PostgreSQL con relaciones, consultas, integridad y tests de repositorio."
date: "2026-09-02"
outcomes:
  - "Explicar qué resuelve un ORM y qué problemas introduce."
  - "Configurar PostgreSQL y mapear entidades con JPA."
  - "Implementar un CRUD persistente y consultas derivadas."
  - "Comprobar el acceso a datos con tests de repositorio."
  - "Modelar relaciones uno a muchos y muchos a muchos sin romper la integridad."
  - "Reconocer y corregir el problema N+1."
requirements:
  - "La aplicación por capas de la UD4."
  - "PostgreSQL instalado o accesible."
  - "Un cliente de base de datos para inspeccionar las tablas."
priorKnowledge:
  - "Arquitectura por capas e inyección de dependencias."
  - "SQL básico: tablas, claves y consultas."
  - "Tests unitarios con JUnit."
---

<p class="lead">La capa repository deja de ser una lista y pasa a ser una base de datos. La arquitectura no cambia: cambia una implementación, y esa es exactamente la lección.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio y decreciente. La primera entidad se hace en común; las relaciones y el rendimiento se abordan con criterios y sin solución cerrada.</p>
</div>

## Semana 10 · Primera base de datos

## Sesión 28 · Persistencia y ORM

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué los objetos en memoria y las tablas relacionales chocan por diseño (el desajuste de impedancia) y qué resuelven JDBC, JPA y Hibernate.</li>
    <li><strong>2. Haz:</strong> diseña sobre el papel y en Markdown la traducción de tus modelos a un esquema relacional con tablas, tipos SQL y restricciones físicas.</li>
    <li><strong>3. Comprueba:</strong> sabes señalar qué diferencias entre ambos mundos no se resuelven solas y qué coste oculto introduce delegar las consultas en un ORM.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En la UD4 tenías <code>TareaRepositorioEnMemoria</code>. ¿Qué ocurría con todas tus tareas cada vez que parabas el proceso de Spring Boot?</li>
    <li>En Java, dos referencias apuntan al mismo objeto si <code>a == b</code> o si su <code>equals()</code> devuelve <code>true</code>. ¿Cómo se identifica de forma inequívoca una fila en una tabla SQL?</li>
    <li>Si un objeto <code>Tarea</code> contiene una referencia directa a un objeto <code>Proyecto</code>, ¿cómo se representa ese vínculo en el modelo relacional?</li>
  </ol>
</div>

### El día en que reiniciar duele

Durante cuatro unidades hemos fingido que un `ArrayList` dentro de una clase de repositorio era suficiente. Servía para validar los endpoints HTTP, comprobar los códigos de estado en Postman y escribir tests unitarios de las reglas de negocio.

Pero tenía un defecto conocido que llevamos arrastrando desde la UD1: **cada vez que el servidor se reinicia, el estado se evapora por completo**.

La solución inmediata que a todo programador principiante se le pasa por la cabeza es volcar los objetos en un archivo JSON o en un fichero binario en el disco. Parece sencillo hasta que te haces tres preguntas:

1. ¿Qué ocurre si dos peticiones HTTP intentan escribir en el archivo en el mismo milisegundo?
2. Si la aplicación cae a mitad de una escritura, ¿cómo evitas que el archivo quede corrupto e ilegible?
3. Para buscar una tarea por título entre dos millones de registros, ¿vas a cargar dos millones de objetos en la memoria RAM para filtrarlos con un bucle?

Por eso no guardamos archivos a mano: delegamos en un **Sistema Gestor de Bases de Datos Relacionales (RDBMS)** como PostgreSQL. Un sistema independiente, optimizado durante décadas, capaz de gestionar accesos concurrentes sin corromper datos, con índices para búsquedas en microsegundos y garantías matemáticas de atomicidad y durabilidad.

<div class="rule">
  <p class="rule-label">La base de datos no es tu disco duro particular</p>
  <p>Una base de datos relacional <strong>no es un trastero donde volcar la memoria de Java</strong>. Es un motor de datos con su propio ciclo de vida, sus propios tipos, su propio lenguaje (SQL) y sus propias reglas de integridad.</p>
  <p>Tu aplicación es solo un cliente más conectándose a través de la red. Si mañana otra aplicación escrita en Python o Node.js necesita consultar los proyectos, hablará con las mismas tablas sin saber nada de tus clases Java.</p>
</div>

### Dos mundos que chocan: el desajuste de impedancia

Traspasar información entre Java y una base de datos relacional no es una simple copia de campos. Es conectar dos paradigmas concebidos bajo premisas incompatibles. En ingeniería de software este choque se conoce como **el desajuste de impedancia objeto-relacional** (*Object-Relational Impedance Mismatch*).

<figure class="diagram">
  <figcaption>El abismo entre objetos y tablas</figcaption>
  <ol class="flow flow--before">
    <li><strong>Objetos (Java):</strong> grafos de memoria, referencias navegables, herencia, encapsulación y tipos ricos</li>
    <li><strong>Tablas (SQL):</strong> conjuntos bidimensionales, relaciones por clave foránea, tipos escalares y operaciones basadas en álgebra relacional</li>
  </ol>
</figure>

Las diferencias se manifiestan en cuatro áreas críticas:

| Dimensión | En el mundo de los objetos (Java) | En el mundo relacional (SQL) |
| :--- | :--- | :--- |
| **Identidad** | Dos objetos son iguales por referencia de memoria (`==`) o por estado semántico (`equals()`). | Dos filas son iguales si comparten el mismo valor en su **clave primaria (PK)**. |
| **Relaciones** | Direccionales (`tarea.getProyecto()`). Para que sea navegable en ambos sentidos, necesitas dos punteros independientes. | Bidireccionales por naturaleza: una clave foránea (`FK`) permite consultar en ambas direcciones mediante `JOIN`. |
| **Navegación** | Recorrer un grafo de punteros en memoria: `tarea.getProyecto().getCliente().getNombre()`. | Realizar operaciones de conjunto (`SELECT ... JOIN ... WHERE ...`) proyectando datos escalares. |
| **Granularidad** | Frecuente crear tipos ricos (`Email`, `Dinero`, `Direccion`) dentro de una clase. | Todo se aplana a columnas primitivas (`VARCHAR`, `NUMERIC`, `INTEGER`, `BOOLEAN`). |

### De dónde venimos: JDBC, Hibernate y JPA

Para salvar ese abismo, el ecosistema Java ha atravesado tres etapas bien diferenciadas.

<p class="stage">1 · El infierno manual de JDBC</p>

En los inicios de Java la única opción estándar era **JDBC (Java Database Connectivity)**. Con JDBC eres tú quien escribe las sentencias SQL en cadenas de texto, gestiona las conexiones y traduce fila a fila cada resultado:

```java
// Lo que había que escribir con JDBC puro para guardar una tarea
String sql = "INSERT INTO tareas (titulo, prioridad, completada) VALUES (?, ?, ?)";
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
    ps.setString(1, tarea.getTitulo());
    ps.setString(2, tarea.getPrioridad());
    ps.setBoolean(3, tarea.isCompletada());
    ps.executeUpdate();
    try (ResultSet rs = ps.getGeneratedKeys()) {
        if (rs.next()) {
            tarea.setId(rs.getLong(1));
        }
    }
}
```

Funciona, pero el coste es altísimo: código repetitivo, propenso a errores tipográficos que el compilador no detecta, y la necesidad de escribir manualmente la traducción de cada objeto que entra o sale de la base de datos.

<p class="stage">2 · Los ORM y el nacimiento de Hibernate</p>

A principios de los 2000 surgió **Hibernate**, un *Object-Relational Mapper* (ORM). Su promesa: tú defines tus clases Java, configuras un mapa que indique qué clase corresponde a qué tabla y qué atributo a qué columna, y el ORM se encarga de generar el SQL, ejecutarlo y devolver objetos ya instanciados.

<p class="stage">3 · La estandarización: JPA (Jakarta Persistence)</p>

Como cada fabricante de ORM inventaba sus propias anotaciones y métodos, la comunidad estandarizó la solución bajo una especificación oficial: **JPA** (originalmente *Java Persistence API*, hoy *Jakarta Persistence*).

<p class="term">Especificación frente a implementación</p>

**JPA no es una librería ejecutable: es un documento de especificación**. Define interfaces (`EntityManager`, `EntityTransaction`) y anotaciones (`@Entity`, `@Table`, `@Id`, `@Column`).

**Hibernate es la implementación real** que contiene el código que ejecuta esas interfaces. Si usas JPA, tu código depende de la norma estándar, no de una librería particular, aunque por debajo el motor que haga el trabajo pesado sea Hibernate.

<figure class="diagram">
  <figcaption>La jerarquía de abstracción en Spring Boot</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Spring Data JPA</li>
    <li>JPA (Jakarta)</li>
    <li>Hibernate (ORM)</li>
    <li>Driver JDBC</li>
    <li>PostgreSQL</li>
  </ol>
</figure>

Spring Data JPA se sitúa en la cúspide: nos permitirá declarar interfaces sin escribir ni una sola línea de implementación para las operaciones comunes.

### La ley de las abstracciones con fugas

Aquí aparece la gran mentira que muchos cursos y tutoriales transmiten: *«Como tenemos un ORM, ya no necesitas saber SQL»*.

**Es exactamente lo contrario.**

Joel Spolsky formuló en 2002 la célebre *Ley de las abstracciones con fugas* (*Law of Leaky Abstractions*): *todas las abstracciones no triviales tienen fugas en algún momento*. El ORM intenta ocultar que debajo hay un motor relacional, pero esa ilusión se rompe rápidamente:

* Si no entiendes cómo traduce Hibernate una relación, generarás una consulta inicial seguida de 50 consultas individuales para cargar detalles (el demoledor **problema N+1** que resolveremos en la sesión 39).
* Si no entiendes de claves primarias y secuencias, bloquearás la base de datos o harás que las inserciones masivas vayan a paso de tortuga.
* Si ignoras cómo funcionan las transacciones y los bloqueos, dos usuarios simultáneos sobrescribirán datos sin que nadie se entere.

El ORM te quita el trabajo aburrido de teclear `rs.getString("titulo")`, pero **tú sigues siendo el responsable de qué SQL se ejecuta en tu servidor**.

### Práctica guiada · El mapa de traducción: de Java a PostgreSQL

Antes de tocar una sola línea de código o instalar librerías, vamos a diseñar la correspondencia exacta entre nuestro modelo `Tarea` de la UD4 y la tabla que vivirá en PostgreSQL.

Miremos nuestra clase Java de partida:

```java
public class Tarea {
    private Long id;
    private String titulo;
    private String prioridad;
    private boolean completada;
    private Long proyectoId;
}
```

Para cada atributo debemos tomar tres decisiones:
1. ¿Qué tipo de dato SQL en PostgreSQL puede almacenar ese valor sin pérdida ni desperdicio?
2. ¿Qué restricciones de integridad (`NULL`, `UNIQUE`, `CHECK`) debe imponer la base de datos?
3. ¿Cómo se genera la identidad de cada registro?

| Atributo Java | Tipo Java | Columna SQL | Tipo PostgreSQL | Restricción / Propósito |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `Long` | `id` | `BIGINT` | `PRIMARY KEY GENERATED ALWAYS AS IDENTITY` |
| `titulo` | `String` | `titulo` | `VARCHAR(120)` | `NOT NULL` (no se admiten tareas sin nombre) |
| `prioridad` | `String` | `prioridad` | `VARCHAR(20)` | `NOT NULL CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA'))` |
| `completada` | `boolean` | `completada` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` |
| `proyectoId` | `Long` | `proyecto_id` | `BIGINT` | `REFERENCES proyectos(id)` (clave foránea) |

<dl class="worked">
  <dt>Por qué <code>Long</code> y <code>BIGINT</code> en lugar de <code>int</code></dt>
  <dd>Un <code>INTEGER</code> de 32 bits permite unos dos mil millones de identificadores positivos. En aplicaciones reales con alto volumen de registros esa cifra se alcanza antes de lo que parece. Pasar de <code>INTEGER</code> a <code>BIGINT</code> en una base de datos en producción con millones de filas exige reconstruir índices y tablas enteras con cortes de servicio. Usar <code>BIGINT</code> desde el primer día cuesta cero y previene una migración traumática.</dd>
  <dt>Por qué la restricción vive en la base de datos y no solo en el DTO</dt>
  <dd>En la UD3 validamos en el DTO con <code>@NotBlank</code> y <code>@Size</code>. Esa es la aduana de entrada HTTP. Pero la base de datos es la última línea de defensa: si mañana entra un script de migración, una carga desde CSV o una consulta manual por consola SQL, las restricciones de la tabla garantizan que ningún dato corrupto quede almacenado.</dd>
</dl>

### Ahora tú · El esquema de proyectos y usuarios

Diseña en un archivo `schema.sql` (o directamente en tu consola SQL) la definición completa para las tablas `proyectos` y `usuarios`.

<p class="stage stage--solo">1 · La tabla <code>proyectos</code></p>

Tu clase `Proyecto` tiene los campos `id`, `nombre`, `descripcion`, `activo` y `fechaCreacion` (`LocalDate`).
* Escribe la sentencia `CREATE TABLE` con los tipos de PostgreSQL correspondientes.
* Asegúrate de que el nombre del proyecto sea obligatorio y único en el sistema.
* Define el valor por defecto para `activo`.

<p class="stage stage--solo">2 · La tabla <code>usuarios</code></p>

Diseña la tabla para almacenar los miembros del equipo:
* Campos: `id`, `email`, `nombreCompleto`, `rol` (`ADMIN`, `DEV`, `VIEWER`), `fechaAlta`.
* ¿Qué restricción fundamental debe tener la columna `email`?
* ¿Qué tipo de dato de PostgreSQL se adapta a `fechaAlta` si necesitamos guardar también la hora y minuto exactos?

### Reto · Las tres trampas de la identidad y los tipos

Examina estas tres situaciones reales y explica por qué son decisiones técnicas erróneas:

1. **El identificador primitivo:** Un desarrollador decide que el atributo `id` de su entidad sea un `long` primitivo en lugar de `Long` (objeto). ¿Qué valor tiene ese campo en memoria antes de guardar el objeto por primera vez en la base de datos? ¿Por qué eso confunde por completo a un ORM al decidir si debe hacer un `INSERT` o un `UPDATE`?
2. **La lista en un solo campo:** Para no crear otra tabla, alguien propone guardar las etiquetas de una tarea como un `VARCHAR` separado por comas: `"backend,urgente,seguridad"`. Explica qué ocurre cuando un usuario pide: *«dame todas las tareas con etiqueta seguridad ordenadas por fecha»*. ¿Puede la base de datos usar un índice en esa consulta?
3. **El hashcode como clave:** Otro compañero propone: *«En lugar de que PostgreSQL genere un id, podemos usar el `hashCode()` del objeto Java como clave primaria»*. Describe exactamente cómo fallará esa idea el día que dos tareas distintas generen la misma colisión de hash o cuando se reinicie la máquina virtual.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La tabla de correspondencia de <code>Tarea</code> comprendida, con tipos SQL y restricciones justificadas.</span></div>
  <div><strong>Si lo tienes</strong><span><code>schema.sql</code> completo con <code>proyectos</code> y <code>usuarios</code>, incluyendo tipos temporales y restricciones de unicidad.</span></div>
  <div><strong>Reto</strong><span>Las tres trampas analizadas en profundidad: primitivos frente a wrappers, violación de la 1ª Forma Normal y debilidades del hash como identidad.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 28</p>
  <ul class="checklist">
    <li>Sabes definir qué es el desajuste de impedancia objeto-relacional y citar al menos tres divergencias entre objetos y tablas.</li>
    <li>Distingues con precisión entre JDBC (API de bajo nivel), Hibernate (motor ORM) y JPA (especificación estándar).</li>
    <li>Entiendes por qué usar un ORM exige conocer SQL mejor, no peor (la ley de las abstracciones con fugas).</li>
    <li>Has traducido tipos Java (<code>Long</code>, <code>String</code>, <code>boolean</code>, <code>LocalDate</code>) a sus equivalentes precisos en PostgreSQL (<code>BIGINT</code>, <code>VARCHAR</code>, <code>BOOLEAN</code>, <code>DATE</code>).</li>
    <li>Comprendes la necesidad de duplicar restricciones: en la capa web para informar al usuario y en la base de datos para blindar el dato.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué JPA no puede ejecutar consultas por sí mismo y necesita una librería como Hibernate?</li>
    <li>¿Cuál es la diferencia fundamental entre cómo se relacionan dos entidades en Java y cómo se relacionan dos filas en SQL?</li>
    <li>¿Por qué un archivo JSON en disco no sustituye a una base de datos relacional en una API concurrente?</li>
    <li>¿Qué ocurriría si intentamos guardar una tarea con un título de 200 caracteres si la columna se definió como <code>VARCHAR(120)</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque JPA es únicamente una especificación: un conjunto de interfaces y anotaciones sin código ejecutable. Hibernate es la implementación que contiene el motor real que traduce a SQL y gestiona conexiones.</p>
  <p>2 · En Java las relaciones son referencias direccionales en memoria (punteros). En SQL son valores escalares en columnas de clave foránea (FK) que se vinculan de manera bidireccional mediante operaciones JOIN.</p>
  <p>3 · Porque carece de control de concurrencia seguro ante escrituras simultáneas, no tiene soporte transaccional para recuperarse de caídas a mitad de escritura ni índices eficientes para consultar sin cargar todo en memoria.</p>
  <p>4 · El motor PostgreSQL rechazará la operación lanzando un error de violación de longitud de cadena (<code>value too long for type character varying(120)</code>), provocando que la transacción aborte y el ORM propague una excepción.</p>
</details>

## Sesión 29 · Configurar PostgreSQL y Spring

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> cómo se comunican Spring Boot y PostgreSQL, qué papel desempeñan el driver JDBC, el DataSource y el pool de conexiones HikariCP, y cómo aislar credenciales sin exponer secretos.</li>
    <li><strong>2. Haz:</strong> levanta una base de datos PostgreSQL, declara las dependencias en tu <code>pom.xml</code> y configura <code>application.properties</code> con parámetros trazables y seguros.</li>
    <li><strong>3. Comprueba:</strong> arrancas la aplicación, verificas en los logs la conexión de HikariCP y la detección del dialecto PostgreSQL, y sabes diagnosticar los tres errores de arranque más habituales.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué es un pool de conexiones y por qué abrir un socket TCP nuevo para cada petición HTTP arruinaría el rendimiento de tu API?</li>
    <li>Si subes a GitHub un archivo que contiene <code>spring.datasource.password=1234</code>, ¿por qué no basta con borrar la contraseña en el commit siguiente?</li>
    <li>¿Por qué necesitamos dos dependencias en Maven: <code>spring-boot-starter-data-jpa</code> y el driver de PostgreSQL?</li>
  </ol>
</div>

### La anatomía del acceso a datos

En la sesión anterior dejamos claro que PostgreSQL es un proceso independiente que se ejecuta en su propio espacio de memoria (o en un contenedor) y escucha peticiones a través de la red, habitualmente en el puerto TCP `5432`.

Para que un método de tu repositorio pueda enviar una sentencia SQL y recibir registros, deben intervenir varios componentes en cadena:

<figure class="diagram">
  <figcaption>El camino de una consulta desde tu código hasta el disco</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Tu Servicio</li>
    <li>JPA / Hibernate</li>
    <li>HikariCP (Pool)</li>
    <li>Driver JDBC</li>
    <li>PostgreSQL (TCP 5432)</li>
  </ol>
</figure>

1. **Tu Servicio y Repositorio:** trabajan con objetos del dominio (`Tarea`, `Proyecto`) e invocan métodos Java.
2. **JPA y Hibernate:** traducen las intenciones de tu código en sentencias SQL estándar y dialecto específico de PostgreSQL.
3. **DataSource y HikariCP:** gestionan el estanque (*pool*) de conexiones abiertas. Abrir una conexión TCP con autenticación y cifrado SSL cuesta entre 20 y 80 milisegundos. Si lo hiciéramos en cada petición HTTP, la API colapsaría con unos pocos usuarios. HikariCP mantiene un conjunto de conexiones calientes listas para prestar y recuperar en microsegundos.
4. **Driver JDBC de PostgreSQL:** la librería (`org.postgresql.Driver`) que sabe hablar el protocolo binario nativo que entiende el servidor PostgreSQL a través del cable de red.
5. **Servidor PostgreSQL:** ejecuta el SQL, accede a los ficheros del sistema de archivos y devuelve los bloques de datos.

### Paso 1 · Levantar la base de datos PostgreSQL

Necesitamos un servidor PostgreSQL en marcha. Tienes dos formas estándar de disponer de él:

<p class="stage">Opción A · Mediante Docker (Recomendada)</p>

Es la opción más limpia porque no instala servicios permanentes en tu sistema operativo, no ensucia el registro y garantiza que todo el equipo trabaja con la misma versión exacta:

```bash
docker run --name gestor-postgres \
  -e POSTGRES_DB=gestor_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:16-alpine
```

O si prefieres definirlo en un archivo `docker-compose.yml` en la raíz de tu proyecto:

```yaml
services:
  database:
    image: postgres:16-alpine
    container_name: gestor-postgres
    environment:
      POSTGRES_DB: gestor_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - datos_postgres:/var/lib/postgresql/data

volumes:
  datos_postgres:
```

Basta con ejecutar `docker compose up -d` para tener la base de datos lista en dos segundos.

<p class="stage">Opción B · Instalación nativa local</p>

Si tienes PostgreSQL instalado como servicio en tu máquina (Windows, macOS o Linux), entra en el cliente de línea de comandos `psql` o abre tu herramienta de administración (como pgAdmin o DBeaver) y crea la base de datos para la aplicación:

```sql
CREATE DATABASE gestor_db;
```

Asegúrate de recordar el usuario, la contraseña y el puerto que configuraste durante la instalación (el estándar es `5432`).

### Paso 2 · Declarar las dependencias en el pom.xml

Abre el archivo `pom.xml` de tu proyecto Spring Boot y añade las dos dependencias necesarias dentro del bloque `<dependencies>`:

```xml
<!-- Spring Data JPA: trae Hibernate, HikariCP y la API de persistencia -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- Driver JDBC oficial de PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

<dl class="worked">
  <dt>Por qué el driver tiene <code>&lt;scope&gt;runtime&lt;/scope&gt;</code></dt>
  <dd>Porque tu código Java jamás debe importar clases de <code>org.postgresql.*</code>. Tu código se compila contra las interfaces universales de JDBC y JPA. La implementación concreta del driver solo se necesita en tiempo de ejecución, cuando la aplicación arranca y necesita abrir los sockets de red contra PostgreSQL.</dd>
  <dt>Qué nos ahorra <code>spring-boot-starter-data-jpa</code></dt>
  <dd>Incluye de forma transitiva Hibernate Core, Jakarta Persistence API, el pool de conexiones HikariCP y toda la infraestructura de Spring Data. No necesitas gestionar versiones individuales: el gestor de dependencias de Spring Boot garantiza que todas las piezas sean compatibles entre sí.</dd>
</dl>

### Paso 3 · Configuración profesional en application.properties

Abre `src/main/resources/application.properties`. Vamos a configurar el acceso a datos aplicando principios de seguridad y observabilidad:

```properties
# ------------------------------------------------------------------------------
# Conexión a la base de datos PostgreSQL
# ------------------------------------------------------------------------------
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:gestor_db}
spring.datasource.username=${DB_USER:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver

# ------------------------------------------------------------------------------
# Pool de conexiones HikariCP
# ------------------------------------------------------------------------------
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000

# ------------------------------------------------------------------------------
# JPA y Hibernate
# ------------------------------------------------------------------------------
# Estrategia de creación del esquema (update para desarrollo local)
spring.jpa.hibernate.ddl-auto=update

# Mostrar las consultas SQL en la consola formateadas
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.highlight_sql=true

# Desactivar Open Session In View para evitar consultas perezosas fuera de la transacción
spring.jpa.open-in-view=false
```

Detengámonos en tres decisiones de configuración críticas:

<p class="term">La sintaxis ${VARIABLE:valor_por_defecto}</p>

Fíjate en `${DB_PASSWORD:postgres}`. Esta directiva le dice a Spring: *«Si existe una variable de entorno llamada DB_PASSWORD en el sistema operativo, usa su valor; si no existe, usa "postgres" como alternativa local»*.

Esto permite que en tu máquina de desarrollo el proyecto arranque sin configuraciones manuales complejas, mientras que en un servidor de despliegue o en GitHub Actions se inyecte la contraseña real de producción desde el entorno, **sin escribir secretos en archivos rastreados por Git**.

<p class="term">El parámetro ddl-auto: poderes y peligros</p>

La propiedad `spring.jpa.hibernate.ddl-auto` controla qué hace Hibernate con la estructura física de la base de datos al arrancar la aplicación:

| Valor | Qué hace al iniciar | Cuándo se utiliza |
| :--- | :--- | :--- |
| `none` | No toca la base de datos. Si las tablas no existen, fallará. | **Producción.** |
| `validate` | Comprueba que las tablas y columnas coinciden con tus entidades `@Entity`. Si algo falta o difiere, aborta el arranque. | **Entornos de integración y producción.** |
| `update` | Compara las entidades con las tablas. Si falta una tabla o una columna, la crea. Nunca borra columnas ni tablas existentes. | **Desarrollo inicial y talleres.** |
| `create-drop` | Borra todas las tablas al arrancar, crea el esquema desde cero y lo borra todo al apagar la aplicación. | **Tests automatizados.** |

<div class="rule">
  <p class="rule-label">La regla de oro de ddl-auto</p>
  <p>En este taller usaremos <code>update</code> para comprobar de forma inmediata cómo nuestras entidades crean tablas en PostgreSQL sin escribir DDL a mano.</p>
  <p><strong>En un entorno profesional real, ddl-auto jamás se pone en update en producción.</strong> Un cambio involuntario de tipo de dato o una mala interpretación del ORM podría bloquear tablas o alterar esquemas en caliente. En producción el esquema se gestiona con herramientas de migración versionadas (como Flyway o Liquibase) y <code>ddl-auto=validate</code>.</p>
</div>

<p class="term">open-in-view=false</p>

Por defecto Spring Boot activa *Open Session In View* (OSIV). Es un mecanismo que mantiene la conexión a la base de datos abierta durante todo el ciclo de vida de la petición HTTP, incluso mientras se renderiza el JSON en el controlador. Aunque parece cómodo para novatos, es un antipatrón que monopoliza conexiones del pool y permite que ocurran consultas inesperadas en la capa web. Ponerlo a `false` fuerza a que todo acceso a datos termine en la capa del servicio.

### Paso 4 · Arrancar y saber leer los logs

Ejecuta tu aplicación Spring Boot desde el IDE o con `./mvnw spring-boot:run`.

No te limites a mirar si sale la palabra `STARTED`. Aprende a leer la secuencia de inicialización del subsistema de datos en la consola:

```text
2026-09-02T10:15:30.102+02:00  INFO 12345 --- [gestor] [main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2026-09-02T10:15:30.340+02:00  INFO 12345 --- [gestor] [main] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@5c80cf32
2026-09-02T10:15:30.342+02:00  INFO 12345 --- [gestor] [main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2026-09-02T10:15:30.510+02:00  INFO 12345 --- [gestor] [main] org.hibernate.jpa.internal.util.LogHelper : HHH000204: Processing PersistenceUnitInfo [name: default]
2026-09-02T10:15:30.590+02:00  INFO 12345 --- [gestor] [main] org.hibernate.dialect.Dialect             : HHH000400: Using dialect: org.hibernate.dialect.PostgreSQLDialect
2026-09-02T10:15:31.850+02:00  INFO 12345 --- [gestor] [main] com.ejemplo.gestor.GestorApplication      : Started GestorApplication in 2.451 seconds (process running for 2.890)
```

Fíjate en los tres hitos clave:
1. `HikariPool-1 - Added connection`: el pool ha podido negociar un socket TCP con PostgreSQL y autenticarse con éxito.
2. `Using dialect: org.hibernate.dialect.PostgreSQLDialect`: Hibernate ha detectado que habla con PostgreSQL y adaptará su SQL a sus tipos específicos (`BIGINT`, `BOOLEAN`, secuencias).
3. `Started GestorApplication`: la aplicación está viva y conectada a la base de datos.

### Laboratorio de diagnóstico · Los tres fallos inevitables

En algún momento de este curso tu aplicación no arrancará por culpa de la base de datos. Cuando eso ocurra, no reinicies a ciegas: busca en el *stack trace* la última línea que empiece por `Caused by:`.

Vamos a provocar intencionadamente los tres errores más comunes para aprender a reconocerlos:

<p class="stage">Fallo 1 · Servidor apagado o puerto incorrecto</p>

Detén el contenedor o servicio de PostgreSQL e intenta arrancar Spring Boot. La aplicación fallará con un mensaje similar a:

```text
Caused by: java.net.ConnectException: Connection refused: no further information
Caused by: org.postgresql.util.PSQLException: Connection to localhost:5432 refused.
```

**Diagnóstico:** tu código está bien, pero no hay ningún proceso escuchando en la IP y puerto especificados. Comprueba que el contenedor de Docker está levantado (`docker ps`) o que el servicio de PostgreSQL está iniciado.

<p class="stage">Fallo 2 · Contraseña o usuario equivocados</p>

Cambia temporalmente la propiedad a `spring.datasource.password=password_inventada` y arranca:

```text
Caused by: org.postgresql.util.PSQLException: FATAL: password authentication failed for user "postgres"
```

**Diagnóstico:** la red funciona y PostgreSQL responde, pero las credenciales han sido rechazadas. Revisa mayúsculas, espacios en blanco o si el usuario configurado tiene permisos de conexión.

<p class="stage">Fallo 3 · Base de datos no creada</p>

Cambia la URL a `jdbc:postgresql://localhost:5432/base_que_no_existe`:

```text
Caused by: org.postgresql.util.PSQLException: FATAL: database "base_que_no_existe" does not exist
```

**Diagnóstico:** PostgreSQL no crea la base de datos automáticamente por conectarse a ella. Debe existir previamente antes de que Spring Boot intente iniciar el pool.

### Ahora tú · Conectar un cliente SQL externo

Configura el acceso a PostgreSQL desde una herramienta de cliente gráfico (DBeaver, IntelliJ Database Tools, pgAdmin o la extensión de PostgreSQL para VS Code) y comprueba la salud del servidor.

1. Abre tu cliente y crea una nueva conexión seleccionando el driver **PostgreSQL**.
2. Introduce los mismos parámetros configurados en tu `application.properties`:
   * Host: `localhost`
   * Puerto: `5432`
   * Base de datos: `gestor_db`
   * Usuario: `postgres`
   * Contraseña: `postgres` (o la que hayas definido)
3. Pulsa en *Test Connection* y confirma que conecta.
4. Abre una ventana de consola SQL y ejecuta:

```sql
SELECT current_database(), current_user, version();
```

Comprueba que devuelve una fila con el nombre de tu base de datos y la versión del motor. Esta consola será tu ventana de verificación durante las próximas tres semanas para comprobar qué hace Hibernate por debajo.

### Reto · Variables de entorno reales y dimensionamiento del pool

Resuelve estas dos cuestiones de ingeniería práctica:

<p class="stage stage--solo">1 · Arranque sin tocar application.properties</p>

Demuestra que la configuración de `${DB_PASSWORD:postgres}` funciona en la práctica. Modifica la contraseña en tu servidor PostgreSQL para que sea `secreto_seguro_2026`.
* Si arrancas directamente con `./mvnw spring-boot:run`, la aplicación debe fallar con un error de autenticación.
* Arranca ahora la aplicación pasándole la variable de entorno desde la terminal sin modificar una sola línea de código:
  * En Linux / macOS / Git Bash: `DB_PASSWORD=secreto_seguro_2026 ./mvnw spring-boot:run`
  * En Windows PowerShell: `$env:DB_PASSWORD="secreto_seguro_2026"; ./mvnw spring-boot:run`
* Comprueba que arranca limpiamente.

<p class="stage stage--solo">2 · ¿Por qué el pool por defecto tiene solo 10 conexiones?</p>

Muchos programadores novatos razonan así: *«Si mi servidor va a recibir 500 peticiones por segundo, debo configurar `maximum-pool-size=500` para que nadie espere»*.
* Investiga la fórmula de dimensionamiento recomendada por los creadores de HikariCP:
  ```text
  conexiones = (núcleos de CPU × 2) + husos de disco
  ```
* Explica por qué tener 500 conexiones simultáneas compitiendo por 4 núcleos de CPU provoca que la base de datos vaya **más lenta** y consuma más recursos que teniendo solo 10 conexiones encoladas de forma ordenada.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>PostgreSQL levantado, dependencias añadidas y Spring Boot arrancando con HikariCP verificado en los logs.</span></div>
  <div><strong>Si lo tienes</strong><span>Cliente SQL externo conectado y los tres errores comunes provocados, leídos y solucionados.</span></div>
  <div><strong>Reto</strong><span>Arranque verificado inyectando variables de entorno en la terminal y justificación física del límite del pool de conexiones.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 29</p>
  <ul class="checklist">
    <li>Tu servidor PostgreSQL está en ejecución y accesible en el puerto 5432.</li>
    <li>El archivo <code>pom.xml</code> incluye <code>spring-boot-starter-data-jpa</code> y el driver con ámbito <code>runtime</code>.</li>
    <li><code>application.properties</code> utiliza variables con valor por defecto para no exponer credenciales fijas.</li>
    <li>Has configurado <code>ddl-auto=update</code>, <code>show-sql=true</code> y <code>open-in-view=false</code> comprendiendo el motivo de cada línea.</li>
    <li>Identificas en los logs la línea de conexión de HikariCP y la detección del dialecto de PostgreSQL.</li>
    <li>Sabes diagnosticar si un fallo de arranque se debe a la red, a las credenciales o a la ausencia de la base de datos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es preferible reutilizar conexiones de un pool como HikariCP en lugar de abrir una nueva en cada petición HTTP?</li>
    <li>¿Qué diferencia hay entre configurar <code>ddl-auto=validate</code> y <code>ddl-auto=update</code>?</li>
    <li>¿Qué significa la directiva <code>${DB_PORT:5432}</code> en un archivo de propiedades de Spring?</li>
    <li>Si en el log ves <code>Connection refused: localhost:5432</code>, ¿dónde está el problema?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque la negociación TCP, el cifrado SSL y la autenticación con la base de datos consumen decenas de milisegundos y ciclos de CPU; el pool mantiene conexiones precalentadas que se reutilizan en microsegundos.</p>
  <p>2 · <code>validate</code> solo comprueba que el esquema existente coincide con el modelo Java y aborta si hay diferencias (seguro para producción); <code>update</code> modifica las tablas para añadir tablas o columnas nuevas que falten (cómodo en desarrollo).</p>
  <p>3 · Que Spring buscará una variable de entorno llamada <code>DB_PORT</code> en el sistema; si no está definida, utilizará el valor por defecto <code>5432</code>.</p>
  <p>4 · El servidor PostgreSQL no está en ejecución, está detenido en Docker o está escuchando en un puerto distinto al 5432.</p>
</details>

## Sesión 30 · Primera entidad y JpaRepository

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> qué requisitos impone la especificación JPA a una clase para ser una <code>@Entity</code>, cómo se delega la identidad en PostgreSQL y cómo Spring Data JPA genera repositorios completos a partir de una interfaz.</li>
    <li><strong>2. Haz:</strong> anota tu clase <code>Tarea</code>, define <code>TareaRepository extends JpaRepository&lt;Tarea, Long&gt;</code> y elimina <code>TareaRepositorioEnMemoria</code> sin alterar el servicio.</li>
    <li><strong>3. Comprueba:</strong> creas una tarea por HTTP POST, apagas y reinicias el servidor, ejecutas un GET y demuestras que el dato persiste en PostgreSQL, auditando el SQL en la consola.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En la sesión 24 definiste la interfaz <code>TareaRepository</code> con <code>findAll</code>, <code>findById</code>, <code>save</code>, <code>deleteById</code> y <code>existsById</code>. ¿Por qué elegimos exactamente esos nombres?</li>
    <li>¿Qué constructor exige obligatoriamente JPA en cualquier clase anotada con <code>@Entity</code> y qué ocurre si falta?</li>
    <li>¿Por qué debemos cambiar el tipo del identificador de <code>int</code> primitivo a <code>Long</code> (objeto envoltorio)?</li>
  </ol>
</div>

### Cobrando la promesa de la UD4

Al final de la UD4 dejamos escrita una promesa formal:

> *«En la UD5, `TareaRepositorioEnMemoria` se borra y en su lugar aparece una interfaz que extiende `JpaRepository`. Spring la implementa solo. Y el service, que ya depende de una interfaz con esos mismos nombres de método, no se entera. Cambias dónde se guardan los datos sin abrir la capa que decide las reglas.»*

Hoy es el día de cobrar esa promesa.

En la UD4 resististe la tentación de meter el código de acceso a datos en el controlador o en el servicio. Aceptaste escribir una interfaz `TareaRepository` e inyectarla por constructor. Parecía ceremonia innecesaria para una simple lista en memoria.

Ahora vas a ver la recompensa: vamos a cambiar por completo el motor de persistencia de la aplicación —sustituyendo la memoria volátil por PostgreSQL— y **nuestro servicio no va a cambiar ni una sola línea de lógica de negocio**.

<figure class="diagram">
  <figcaption>La sustitución limpia de la capa de acceso a datos</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>TareaController (intacto)</li>
    <li>TareaService (intacto)</li>
    <li>TareaRepository (ahora con Spring Data)</li>
    <li>PostgreSQL</li>
  </ol>
</figure>

### Paso 1 · Mapear la primera entidad: Tarea

Para que JPA sepa cómo trasladar instancias de nuestra clase a filas de la base de datos, debemos marcarla como una **entidad**.

Abre `src/main/java/com/ejemplo/gestor/model/Tarea.java` y anótala:

```java
package com.ejemplo.gestor.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tareas")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titulo", nullable = false, length = 120)
    private String titulo;

    @Column(name = "prioridad", nullable = false, length = 20)
    private String prioridad;

    @Column(name = "completada", nullable = false)
    private boolean completada;

    // Constructor sin argumentos obligatorio para JPA
    public Tarea() {
    }

    // Constructor de conveniencia para crear tareas nuevas
    public Tarea(String titulo, String prioridad) {
        this.titulo = titulo;
        this.prioridad = prioridad;
        this.completada = false;
    }

    // Constructor completo
    public Tarea(Long id, String titulo, String prioridad, boolean completada) {
        this.id = id;
        this.titulo = titulo;
        this.prioridad = prioridad;
        this.completada = completada;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

Detengámonos en cada decisión técnica:

<dl class="worked">
  <dt><code>@Entity</code></dt>
  <dd>Registra la clase en el metamodelo de JPA. Le dice a Hibernate: «esta clase representa un registro persistente y tú eres responsable de su ciclo de vida».</dd>
  <dt><code>@Table(name = "tareas")</code></dt>
  <dd>Especifica el nombre explícito de la tabla física en plural y minúsculas. Si lo omites, Hibernate usará el nombre de la clase (<code>tarea</code>), lo que puede colisionar con palabras reservadas de SQL (como <code>User</code> u <code>Order</code>).</dd>
  <dt><code>@Id</code> y <code>@GeneratedValue(strategy = GenerationType.IDENTITY)</code></dt>
  <dd>Marca la clave primaria. La estrategia <code>IDENTITY</code> le indica a Hibernate que confíe en la columna autonumérica de PostgreSQL (<code>GENERATED BY DEFAULT AS IDENTITY</code> o <code>SERIAL</code>), delegando la generación del valor al motor de la base de datos al ejecutar el <code>INSERT</code>.</dd>
  <dt>El constructor vacío <code>public Tarea() {}</code></dt>
  <dd>Es <strong>estrictamente obligatorio por la especificación JPA</strong>. Cuando Hibernate recupera filas de la base de datos mediante JDBC, no conoce tus constructores de negocio: necesita instanciar el objeto vacío por reflexión (<code>Class.getDeclaredConstructor().newInstance()</code>) y luego rellenar los atributos campo a campo.</dd>
  <dt>Por qué <code>Long</code> y no <code>int</code> ni <code>long</code></dt>
  <dd>Un tipo primitivo no admite <code>null</code>: un <code>long</code> por defecto vale <code>0</code>. Si el id valiera <code>0</code> al nacer, Hibernate dudaría de si estás intentando actualizar un registro existente con id 0 o si es un registro nuevo. Al usar el objeto <code>Long</code>, una tarea nueva tiene <code>id = null</code>, lo que señala de forma inequívoca que aún no existe en PostgreSQL.</dd>
</dl>

### Paso 2 · La magia sin misterio de JpaRepository

Ahora sustituimos nuestra interfaz manual de la UD4 por la interfaz estándar de Spring Data.

Abre `src/main/java/com/ejemplo/gestor/repository/TareaRepository.java` y déjala exactamente así:

```java
package com.ejemplo.gestor.repository;

import com.ejemplo.gestor.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
}
```

Mira con atención ese archivo: **tiene cero líneas de implementación**. No hay métodos escritos, no hay sentencias SQL, no hay bucles.

¿Cómo es posible que esto funcione?

<p class="term">El patrón Dynamic Proxy de Spring Data</p>

Cuando Spring Boot arranca y encuentra una interfaz que extiende `JpaRepository`, **crea dinámicamente en tiempo de ejecución una clase oculta que la implementa** (un *proxy* dinámico de Java).

Esa clase generada internamente por Spring inyecta el `EntityManager` de JPA y traduce cada llamada a operaciones de base de datos dentro de una transacción.

Y mira qué métodos hereda gratis nuestra interfaz:

| Método heredado de JpaRepository | Lo que hace en PostgreSQL | Lo que teníamos en la UD4 |
| :--- | :--- | :--- |
| `List<Tarea> findAll()` | `SELECT ... FROM tareas` | Devolvía una copia del `ArrayList` |
| `Optional<Tarea> findById(Long id)` | `SELECT ... FROM tareas WHERE id = ?` | Recorría la lista con un bucle `for` |
| `Tarea save(Tarea tarea)` | `INSERT` o `UPDATE` en la tabla | Asignaba id manual y hacía `.add()` |
| `void deleteById(Long id)` | `DELETE FROM tareas WHERE id = ?` | `tareas.removeIf(...)` |
| `boolean existsById(Long id)` | `SELECT count(*) ... WHERE id = ?` | `findById(id).isPresent()` |
| `long count()` | `SELECT count(*) FROM tareas` | `tareas.size()` |

Los nombres de métodos que diseñamos en la sesión 24 no fueron casualidad: **eran exactamente los métodos que `JpaRepository` ya tiene estandarizados**.

### Paso 3 · Borrar la memoria y conectar el servicio

Ha llegado el momento más satisfactorio de la unidad:

1. **Borra el archivo** `TareaRepositorioEnMemoria.java` (o quítale la anotación `@Repository`). Ya no lo necesitamos.
2. Abre `TareaService.java`. Tu servicio ya declaraba:

```java
@Service
public class TareaService {

    private final TareaRepository repositorio;

    public TareaService(TareaRepository repositorio) {
        this.repositorio = repositorio;
    }
    // ...
```

Como `repositorio` es de tipo `TareaRepository`, Spring inyectará automáticamente el bean generado por Spring Data JPA en lugar del antiguo repositorio en memoria.

Si tu servicio o tus controladores usaban `int` para los identificadores, actualízalos a `Long` para que coincidan con el tipo de la clave primaria. El resto de métodos (`listar()`, `obtener(id)`, `crear(tarea)`, `eliminar(id)`) **no tocan ni una coma**. La regla de negocio de que una tarea nace sin completar sigue en su sitio, protegida y aislada.

### Paso 4 · La gran comprobación: el dato sobrevive al reinicio

Vamos a demostrar empíricamente que la persistencia es real.

<p class="stage">1 · Arranca la aplicación y lee el DDL</p>

Ejecuta tu aplicación Spring Boot. Como en la sesión 29 configuramos `ddl-auto=update` y `show-sql=true`, mira la consola en los primeros segundos de arranque. Verás a Hibernate ejecutar:

```sql
create table if not exists tareas (
    id bigint generated by default as identity,
    completada boolean not null,
    prioridad varchar(20) not null,
    titulo varchar(120) not null,
    primary key (id)
)
```

Hibernate ha leído las anotaciones `@Entity`, `@Id` y `@Column` de tu clase `Tarea` y ha creado la tabla correspondiente en PostgreSQL con todas sus restricciones.

<p class="stage">2 · Inserta una tarea por HTTP</p>

Abre Postman, Thunder Client o la terminal con `curl` y envía una petición POST para crear una tarea:

```http
POST http://localhost:8080/tareas
Content-Type: application/json

{
  "titulo": "Aprender persistencia con JPA y PostgreSQL",
  "prioridad": "ALTA"
}
```

Observa la consola de Spring Boot. En el instante exacto en que llega la petición, verás aparecer:

```sql
Hibernate: 
    insert 
    into
        tareas
        (completada, prioridad, titulo) 
    values
        (?, ?, ?)
```

Y la respuesta HTTP devolverá el JSON con `id: 1` asignado por PostgreSQL:

```json
{
  "id": 1,
  "titulo": "Aprender persistencia con JPA y PostgreSQL",
  "prioridad": "ALTA",
  "completada": false
}
```

<p class="stage">3 · El momento cumbre: apaga el servidor</p>

Ve a la terminal o al IDE y **detén por completo el proceso de Spring Boot** (`Ctrl + C` o botón rojo de stop).

En la UD4, este paso borraba todo lo que hubieras creado.

<p class="stage">4 · Vuelve a arrancar y comprueba</p>

Vuelve a arrancar la aplicación (`./mvnw spring-boot:run`).

Envía ahora una petición GET:

```http
GET http://localhost:8080/tareas
```

Mira la respuesta:

```json
[
  {
    "id": 1,
    "titulo": "Aprender persistencia con JPA y PostgreSQL",
    "prioridad": "ALTA",
    "completada": false
  }
]
```

**El dato sigue ahí.** Ha sobrevivido al apagado de la máquina virtual Java porque no estaba en la memoria volátil de Tomcat: estaba guardado en los ficheros de datos de PostgreSQL.

<p class="stage">5 · Verifica directamente en la base de datos</p>

Abre tu consola SQL de DBeaver o `psql` y consulta la tabla sin pasar por Spring Boot:

```sql
SELECT * FROM tareas;
```

Verás la fila real:
```text
 id | completada | prioridad |                      titulo                       
----+------------+-----------+---------------------------------------------------
  1 | f          | ALTA      | Aprender persistencia con JPA y PostgreSQL
```

La lista en memoria es oficialmente parte del pasado.

### Ahora tú · Persistir la entidad Proyecto

Aplica de forma autónoma el mismo procedimiento para migrar la entidad `Proyecto`:

1. Abre `com.ejemplo.gestor.model.Proyecto`.
2. Añade las anotaciones `@Entity` y `@Table(name = "proyectos")`.
3. Anota su clave primaria con `@Id` y `@GeneratedValue(strategy = GenerationType.IDENTITY)`. Asegúrate de que su tipo sea `Long`.
4. Mapea `nombre` (`VARCHAR(100)`, obligatorio), `descripcion` (`VARCHAR(255)`), `activo` (`BOOLEAN`) y `fechaCreacion` (`DATE`).
5. Añade el constructor vacío obligatorio sin argumentos.
6. Crea la interfaz `ProyectoRepository extends JpaRepository<Proyecto, Long>`.
7. Borra `ProyectoRepositorioEnMemoria`.
8. Arranca la aplicación, inserta dos proyectos mediante `POST /proyectos`, reinicia el servidor y comprueba con `GET /proyectos` que ambos persisten en PostgreSQL.

### Reto · ¿Cómo sabe save() si debe hacer INSERT o UPDATE?

El método `save()` de Spring Data parece mágico: le pasas un objeto y él solo decide si ejecuta una sentencia `INSERT` o un `UPDATE`.

Investiga cómo toma esa decisión analizando el ciclo de vida de las entidades en JPA:

<p class="stage stage--solo">1 · La regla del identificador nuevo</p>

Spring Data comprueba el valor del atributo `@Id`:
* Si `id == null`, Hibernate considera que la entidad es **transitoria** (*transient*, nueva en memoria). Invoca internamente `EntityManager.persist()` y genera un `INSERT`.
* Si `id != null`, Hibernate considera que la entidad es **separada** (*detached*, existente). Invoca `EntityManager.merge()` y asume que debe actualizar.

<p class="stage stage--solo">2 · El experimento del id fantasma</p>

¿Qué ocurre si creas un objeto `Tarea` manualmente, le asignas un `id = 9999L` (que no existe en la base de datos) y llamas a `repositorio.save(tarea)`?

* Pruébalo en un test o en un endpoint de prueba y **observa con atención las sentencias SQL que Hibernate imprime en la consola**.
* ¿Qué consulta ejecuta Hibernate antes de decidir qué hacer?
* Explica por qué intentar actualizar un registro con un `id` inexistente provoca un `SELECT` previo inútil y qué consecuencias tiene eso sobre el rendimiento de un sistema con alta concurrencia.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span><code>Tarea</code> anotada como entidad, <code>TareaRepository</code> creado con Spring Data y persistencia comprobada tras reiniciar.</span></div>
  <div><strong>Si lo tienes</strong><span><code>Proyecto</code> migrado a JPA, repositorio en memoria borrado y ambas tablas verificadas en el cliente SQL.</span></div>
  <div><strong>Reto</strong><span>El mecanismo interno de <code>save()</code> documentado, explicando la diferencia entre <code>persist()</code> y <code>merge()</code> y el coste del <code>SELECT</code> previo ante IDs asignados a mano.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 30</p>
  <ul class="checklist">
    <li>Tu modelo <code>Tarea</code> tiene las anotaciones <code>@Entity</code>, <code>@Table</code>, <code>@Id</code> y <code>@GeneratedValue(strategy = IDENTITY)</code>.</li>
    <li>La clase incluye un constructor vacío obligatorio para que Hibernate pueda instanciarla por reflexión.</li>
    <li>El identificador es de tipo <code>Long</code> para admitir <code>null</code> en objetos nuevos antes de persistir.</li>
    <li><code>TareaRepository</code> extiende <code>JpaRepository&lt;Tarea, Long&gt;</code> sin código manual de implementación.</li>
    <li>Has eliminado <code>TareaRepositorioEnMemoria</code> sin tener que modificar la lógica de negocio en <code>TareaService</code>.</li>
    <li>Has comprobado mediante reinicio de servidor que los datos persisten en PostgreSQL y has auditado el SQL generado en la consola.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es obligatorio que una clase <code>@Entity</code> tenga un constructor sin argumentos?</li>
    <li>¿Quién escribe el código real de los métodos <code>findAll()</code> o <code>findById()</code> cuando usamos <code>JpaRepository</code>?</li>
    <li>¿Por qué el servicio <code>TareaService</code> no necesitó cambiar su lógica de negocio al cambiar de lista en memoria a PostgreSQL?</li>
    <li>¿Cómo decide Spring Data JPA si una llamada a <code>save()</code> debe traducirse en un <code>INSERT</code> o en un <code>UPDATE</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque Hibernate utiliza reflexión de Java para instanciar la clase vacía al recuperar registros de la base de datos antes de poblar sus campos con los valores de las columnas.</p>
  <p>2 · Spring Data genera dinámicamente en tiempo de arranque una clase intermediaria (proxy dinámico) que implementa la interfaz e invoca al EntityManager de JPA dentro de una transacción.</p>
  <p>3 · Porque en la UD4 aplicamos inversión de dependencias: el servicio dependía de una abstracción (la interfaz) y no de una implementación concreta, con exactamente las mismas signaturas que ofrece Spring Data.</p>
  <p>4 · Comprobando el campo <code>@Id</code>: si es <code>null</code> asume que es nueva y ejecuta un <code>INSERT</code>; si tiene un valor asignado asume que ya existe, ejecuta un <code>SELECT</code> para verificar su estado y emite un <code>UPDATE</code>.</p>
</details>

## Semana 11 · CRUD real y comprobado

## Sesión 31 · Crear y recuperar entidades

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> los cuatro estados del ciclo de vida de una entidad en JPA (transitoria, gestionada, separada y eliminada) y por qué debes usar siempre la instancia devuelta por <code>save()</code>.</li>
    <li><strong>2. Haz:</strong> implementa el circuito completo de alta y consulta individual en tu servicio y controlador, conectando DTOs de entrada y salida con la entidad persistida.</li>
    <li><strong>3. Comprueba:</strong> insertas registros mediante POST, recuperas con GET individual y general, y verificas en PostgreSQL el avance de la secuencia y el SQL generado.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si ejecutas <code>Tarea t = new Tarea("Revisar logs", "MEDIA");</code>, ¿qué valor tiene su atributo <code>id</code> antes de llamar al repositorio?</li>
    <li>¿Qué devuelve el método <code>findById(id)</code> de <code>JpaRepository</code> y qué método encadenas para lanzar una excepción si no existe?</li>
    <li>¿Por qué en una API REST profesional nunca se debe devolver una clase <code>@Entity</code> directamente en la respuesta del controlador?</li>
  </ol>
</div>

### De un objeto en memoria a una fila con identidad

En la UD2 creábamos un objeto con `new`, le asignábamos un contador incremental a mano (`siguienteId++`) y lo metíamos en un `ArrayList`. Si el objeto cambiaba de campos en cualquier momento, la lista lo reflejaba al instante porque compartían la misma posición de memoria RAM.

Con una base de datos relacional, **la vida de un objeto es mucho más sofisticada**. Un objeto Java no nace conectado a una tabla: tiene que atravesar una serie de transiciones de estado coordinadas por el **Contexto de Persistencia** (*Persistence Context*) de JPA.

<p class="term">El Contexto de Persistencia y el EntityManager</p>

El contexto de persistencia es una zona de memoria gestionada por Hibernate donde residen todas las entidades que la aplicación está manipulando en una transacción activa. El objeto responsable de interactuar con él es el `EntityManager`.

Cuando utilizas Spring Data JPA no ves al `EntityManager` de forma directa, pero está ahí detrás de cada llamada a `save()` o `findById()`.

### Los cuatro estados del ciclo de vida de una entidad

Para no cometer errores sutiles con JPA, debes ser capaz de situar cualquier objeto en uno de estos cuatro estados:

<figure class="diagram">
  <figcaption>El ciclo de vida de una entidad JPA</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Transitoria (new)</li>
    <li>Gestionada (persist / find)</li>
    <li>Separada (close / detach)</li>
    <li>Eliminada (remove)</li>
  </ol>
</figure>

| Estado | ¿Tiene ID en BD? | ¿La conoce Hibernate? | ¿Qué ocurre al modificarla? |
| :--- | :---: | :---: | :--- |
| **Transitoria (*Transient*)** | No (`null`) | No | Cambia en la memoria JVM, la BD no se entera. |
| **Gestionada (*Managed*)** | Sí | **Sí** | Hibernate detecta cambios automáticamente (*dirty checking*). |
| **Separada (*Detached*)** | Sí | No | Cambia en la memoria JVM, pero no se sincroniza con la BD. |
| **Eliminada (*Removed*)** | Sí | Sí | Se borrará de la tabla físicamente al confirmar la transacción. |

<p class="stage">1 · Transitoria (Transient)</p>

El objeto acaba de ser instanciado con `new Tarea(...)`. Vive en la memoria ordinaria de Java:
```java
Tarea nueva = new Tarea("Configurar HTTPS", "ALTA");
// nueva.getId() es null. PostgreSQL no sabe que esta tarea existe.
```

<p class="stage">2 · Gestionada (Managed / Persistent)</p>

Cuando llamas a `repositorio.save(nueva)` o cuando recuperas una tarea con `repositorio.findById(1L)`, el objeto pasa al contexto de persistencia:
* Tiene un identificador único asignado por PostgreSQL.
* Hibernate lo monitoriza: cualquier cambio en sus atributos durante la transacción será volcado a la base de datos al finalizar sin necesidad de volver a llamar a `save()`.

<p class="stage">3 · Separada (Detached)</p>

Ocurre cuando la transacción termina o la conexión se cierra y el objeto viaja hacia el controlador:
* Sigue teniendo su `id` (por ejemplo, `id = 1L`).
* Pero Hibernate ya no la vigila. Si modificas un campo en una entidad separada, esa modificación **no** se guarda en la base de datos a menos que la reenganches explícitamente con `save()` (que invoca `merge()`).

<p class="stage">4 · Eliminada (Removed)</p>

La entidad estaba gestionada y se ha solicitado su borrado (`delete()`). Al confirmarse la transacción, Hibernate ejecutará la sentencia SQL `DELETE`.

### La regla de oro: usa siempre lo que devuelve save()

Mira con atención estas dos líneas. Una de ellas contiene un error conceptual gravísimo:

```java
// INCORRECTO: confiar en el parámetro original
repositorio.save(tarea);
return tarea; 

// CORRECTO: utilizar la instancia gestionada que devuelve el método
Tarea guardada = repositorio.save(tarea);
return guardada;
```

<div class="rule">
  <p class="rule-label">Por qué save() devuelve una instancia</p>
  <p>En JPA, el método <code>save()</code> no garantiza que modifique el mismo objeto que le pasaste por parámetro. Lo que hace es sincronizar con el contexto de persistencia y <strong>devolver la referencia gestionada</strong>.</p>
  <p>Esa instancia devuelta tiene garantizado el identificador generado por la secuencia de PostgreSQL, las columnas con valores por defecto y el estado interno actualizado. Si devuelves el parámetro original, puedes estar propagando un objeto sin id o con valores desincronizados.</p>
</div>

### Paso 1 · Altas en el Service y Controller

Vamos a conectar el circuito de creación de tareas respetando el aislamiento entre capas que construimos en las unidades 3 y 4.

<p class="stage">1 · El método crear en TareaService</p>

Abre `TareaService.java`. Observa cómo aplica las reglas de negocio y delega en el repositorio:

```java
package com.ejemplo.gestor.service;

import com.ejemplo.gestor.error.RecursoNoEncontradoException;
import com.ejemplo.gestor.model.Tarea;
import com.ejemplo.gestor.repository.TareaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TareaService {

    private final TareaRepository repositorio;

    public TareaService(TareaRepository repositorio) {
        this.repositorio = repositorio;
    }

    @Transactional
    public Tarea crear(Tarea tarea) {
        // Regla de negocio: una tarea nueva siempre nace sin completar
        tarea.setCompletada(false);

        // Guardamos y devolvemos la entidad gestionada por JPA
        return repositorio.save(tarea);
    }

    @Transactional(readOnly = true)
    public List<Tarea> listar() {
        return repositorio.findAll();
    }

    @Transactional(readOnly = true)
    public Tarea obtener(Long id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("tarea", id));
    }
}
```

<dl class="worked">
  <dt><code>@Transactional</code></dt>
  <dd>Delimita la frontera de la transacción en la base de datos. Si el método termina con éxito, Spring confirma (<code>COMMIT</code>) la transacción en PostgreSQL. Si se lanza una excepción no comprobada (<code>RuntimeException</code>), hace un <code>ROLLBACK</code> automático.</dd>
  <dt><code>@Transactional(readOnly = true)</code></dt>
  <dd>Optimización para lecturas. Le indica a Hibernate que no necesita vigilar cambios en los objetos (desactiva el <em>dirty checking</em>), lo que ahorra memoria y tiempo de CPU.</dd>
  <dt><code>orElseThrow</code> con excepción de dominio</dt>
  <dd>Si <code>findById</code> devuelve una caja <code>Optional</code> vacía, lanzamos nuestra <code>RecursoNoEncontradoException</code>. Recuerda: esta excepción pertenece al dominio, no a la capa web; será el manejador global (<code>@RestControllerAdvice</code>) quien la traduzca a un código HTTP <code>404 Not Found</code>.</dd>
</dl>

<p class="stage">2 · El endpoint en TareaController</p>

Abre `TareaController.java`. Asegúrate de que las peticiones se traducen mediante el mapper:

```java
@PostMapping
public ResponseEntity<TareaResponse> crear(@Valid @RequestBody TareaRequest peticion) {
    // 1. Traducir de DTO de entrada a entidad del dominio
    Tarea entidad = TareaMapper.aModelo(peticion);

    // 2. Ejecutar el caso de uso en el servicio
    Tarea creada = servicio.crear(entidad);

    // 3. Construir la URI del nuevo recurso para la cabecera Location
    URI ubicacion = ServletUriComponentsBuilder
            .fromCurrentRequest().path("/{id}")
            .buildAndExpand(creada.getId()).toUri();

    // 4. Devolver 201 Created con el DTO de respuesta
    return ResponseEntity.created(ubicacion).body(TareaMapper.aRespuesta(creada));
}

@GetMapping("/{id}")
public TareaResponse detalle(@PathVariable Long id) {
    return TareaMapper.aRespuesta(servicio.obtener(id));
}
```

<div class="rule">
  <p class="rule-label">Por qué los DTO siguen siendo obligatorios con JPA</p>
  <p>Ahora que tenemos <code>@Entity</code>, la tentación de devolver la entidad directamente en el controlador es enorme. <strong>No lo hagas jamás.</strong></p>
  <p>Si devuelves la entidad directamente: expones nombres de columnas de tu base de datos, corres el riesgo de romper Jackson al serializar relaciones perezosas (<em>Lazy Loading</em>) fuera de la sesión, y cualquier cambio en una tabla romperá el contrato de los clientes de tu API. Los DTO son el contrato público; las entidades son un detalle interno de almacenamiento.</p>
</div>

### Paso 2 · La comprobación: secuencias y SQL en PostgreSQL

Arranca la aplicación y ejecuta las siguientes comprobaciones en orden:

<p class="stage">1 · Crea dos tareas distintas</p>

Envía dos peticiones `POST /tareas`:

```http
POST http://localhost:8080/tareas
Content-Type: application/json

{
  "titulo": "Auditar índices en PostgreSQL",
  "prioridad": "ALTA"
}
```

Y luego:

```http
POST http://localhost:8080/tareas
Content-Type: application/json

{
  "titulo": "Escribir tests de repositorio",
  "prioridad": "MEDIA"
}
```

Observa la consola de Spring Boot. Verás dos sentencias `INSERT`:

```sql
Hibernate: 
    insert 
    into
        tareas
        (completada, prioridad, titulo) 
    values
        (?, ?, ?)
```

Y las respuestas HTTP recibirán `id: 1` e `id: 2` respectivamente, con cabeceras `Location: http://localhost:8080/tareas/1` y `Location: http://localhost:8080/tareas/2`.

<p class="stage">2 · Inspecciona la secuencia física en PostgreSQL</p>

Abre tu cliente de base de datos (DBeaver o `psql`) y consulta qué ha ocurrido por debajo:

```sql
SELECT * FROM tareas;
```

Y ahora consulta la secuencia que PostgreSQL creó automáticamente para la columna `id`:

```sql
SELECT sequence_name, last_value FROM information_schema.sequences;
```

Verás una secuencia llamada `tareas_id_seq` cuyo último valor generado es `2`. Las secuencias de PostgreSQL son independientes de las transacciones: garantizan identificadores únicos incluso si decenas de peticiones escriben a la vez.

<p class="stage">3 · Consulta un recurso existente y uno inexistente</p>

1. Haz un `GET http://localhost:8080/tareas/1`:
   * Código de respuesta: `200 OK`.
   * En la consola verás: `select t1_0.id, t1_0.completada, t1_0.prioridad, t1_0.titulo from tareas t1_0 where t1_0.id=?`.
2. Haz un `GET http://localhost:8080/tareas/999`:
   * Código de respuesta: `404 Not Found`.
   * Cuerpo JSON estructurado: `{"title": "Not Found", "status": 404, "detail": "No existe tarea con id 999"}`.

### Ahora tú · Altas y consultas para proyectos

Replica de forma autónoma el circuito completo de creación y consulta para la entidad `Proyecto`:

1. Crea o actualiza `ProyectoRequest` con validaciones `@NotBlank` en el nombre y fechas coherentes.
2. Crea `ProyectoResponse` para proyectar los datos hacia la API.
3. Escribe `ProyectoMapper` para transformar bidireccionalmente entre DTOs y la entidad `@Entity Proyecto`.
4. Implementa en `ProyectoService` los métodos:
   * `crear(Proyecto proyecto)` con `@Transactional`: valida que el nombre no esté duplicado antes de guardar (lanzando `409 Conflict` si ya existe).
   * `obtener(Long id)` con `@Transactional(readOnly = true)`.
   * `listar()` con `@Transactional(readOnly = true)`.
5. Implementa en `ProyectoController` los endpoints:
   * `POST /proyectos` devolviendo `201 Created` con cabecera `Location`.
   * `GET /proyectos` devolviendo `200 OK` con la lista de DTOs.
   * `GET /proyectos/{id}` devolviendo `200 OK` o `404 Not Found`.
6. Inserta tres proyectos desde tu cliente HTTP y verifica en la consola SQL que la secuencia `proyectos_id_seq` avanza correctamente.

### Reto · La caché de primer nivel y el aislamiento de DTO

Resuelve estas dos preguntas de análisis técnico:

<p class="stage stage--solo">1 · El experimento de la caché de primer nivel</p>

En `TareaService`, crea un método temporal de prueba anotado con `@Transactional`:

```java
@Transactional(readOnly = true)
public void experimentoCache(Long id) {
    System.out.println("--- Primera búsqueda ---");
    repositorio.findById(id);

    System.out.println("--- Segunda búsqueda ---");
    repositorio.findById(id);
}
```

* Invoca ese método y observa la salida de la consola con las consultas SQL.
* ¿Cuántas sentencias `SELECT` ves entre los dos mensajes?
* Explica qué es la **caché de primer nivel** de Hibernate, dónde reside en memoria y por qué dentro de una misma transacción no se repiten lecturas para la misma entidad.

<p class="stage stage--solo">2 · ¿Qué pasa si la secuencia salta?</p>

Haz un `POST /tareas` enviando un JSON con un título de más de 300 caracteres (violando la restricción física `VARCHAR(120)`).
* La base de datos rechazará la inserción y la transacción terminará en `ROLLBACK`.
* Envía ahora una tarea correcta. ¿Qué `id` recibe? ¿Ha recibido el id anterior o ha saltado al siguiente?
* Explica por qué las secuencias de PostgreSQL nunca reutilizan números ni retroceden tras un fallo, y por qué las claves primarias numéricas **no garantizan ser correlativas sin huecos**.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Altas y consultas de <code>Tarea</code> funcionando con <code>JpaRepository</code>, usando la instancia de <code>save()</code> y devolviendo 201/404.</span></div>
  <div><strong>Si lo tienes</strong><span>Circuito completo para <code>Proyecto</code> con DTOs, mappers, regla de unicidad en el servicio y secuencias verificadas.</span></div>
  <div><strong>Reto</strong><span>Demostración de la caché de primer nivel con una sola consulta SQL en logs y explicación de los huecos en secuencias de PostgreSQL.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 31</p>
  <ul class="checklist">
    <li>Distingues los cuatro estados del ciclo de vida de JPA: transitoria, gestionada, separada y eliminada.</li>
    <li>Utilizas siempre el valor retornado por <code>repositorio.save()</code> en lugar de la variable original.</li>
    <li>Los métodos del servicio llevan anotaciones <code>@Transactional</code> y <code>@Transactional(readOnly = true)</code> según corresponda.</li>
    <li>El endpoint de creación responde <code>201 Created</code> con la cabecera <code>Location</code> apuntando al nuevo recurso.</li>
    <li>Las consultas por id inexistente retornan un <code>404 Not Found</code> limpio mediante <code>orElseThrow</code>.</li>
    <li>Entiendes por qué las entidades no cruzan hacia el controlador y los DTOs siguen siendo el contrato de la API.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿En qué estado se encuentra una entidad inmediatamente después de ejecutar <code>new Tarea()</code>?</li>
    <li>¿Por qué una entidad en estado *managed* no necesita llamar a <code>save()</code> para que sus cambios se guarden al final de una transacción?</li>
    <li>¿Qué diferencia a nivel de rendimiento aporta marcar un método como <code>@Transactional(readOnly = true)</code>?</li>
    <li>Si una inserción falla por violar una restricción de PostgreSQL, ¿qué ocurre con el valor de la secuencia autoincremental?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · En estado transitorio (*transient*): vive solo en la memoria ordinaria de Java, no tiene clave primaria asignada y JPA no la conoce.</p>
  <p>2 · Por el mecanismo de comprobación de suciedad (*dirty checking*): Hibernate compara el estado del objeto con la copia que tomó al entrar en el contexto de persistencia y genera automáticamente el UPDATE antes del commit.</p>
  <p>3 · Indica a Hibernate que no mantenga copias de comparación para *dirty checking*, ahorrando consumo de memoria heap y procesamiento de inspección en cada consulta.</p>
  <p>4 · La secuencia no retrocede: el número consumido se pierde y la siguiente inserción correcta recibirá el valor siguiente, dejando un hueco en la numeración.</p>
</details>

## Sesión 32 · Modificar y eliminar

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la diferencia entre reemplazo total (<code>PUT</code>) y modificación parcial (<code>PATCH</code>), cómo funciona la comprobación de suciedad (<em>dirty checking</em>) y qué restricciones impone la integridad referencial al borrar.</li>
    <li><strong>2. Haz:</strong> implementa las operaciones de actualización y borrado en tu servicio y controlador, garantizando códigos <code>200 OK</code>, <code>204 No Content</code> y <code>404 Not Found</code> ante recursos ausentes.</li>
    <li><strong>3. Comprueba:</strong> ejecutas modificaciones y eliminaciones por HTTP, auditas en la consola las sentencias SQL <code>UPDATE</code> y <code>DELETE</code> y compruebas el estado físico resultante en PostgreSQL.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué diferencia conceptual existe entre una petición HTTP <code>PUT</code> y una petición <code>PATCH</code>?</li>
    <li>¿Qué código de estado HTTP debe devolver una eliminación (<code>DELETE</code>) completada con éxito que no envía cuerpo en la respuesta?</li>
    <li>Si una tabla de tareas tiene una clave foránea hacia la tabla de proyectos, ¿qué ocurre en PostgreSQL si intentas borrar el proyecto directamente?</li>
  </ol>
</div>

### Modificar en JPA no es hacer un UPDATE a ciegas

En una aplicación primitiva con JDBC, modificar un registro consistía en concatenar una sentencia SQL de actualización:
`UPDATE tareas SET titulo = 'Nuevo', prioridad = 'BAJA' WHERE id = 5;`

Si la tarea con id 5 no existía, PostgreSQL respondía que se habían actualizado cero filas, pero la aplicación no se enteraba a menos que comprobaras el contador de retorno.

En JPA y Spring Data, la modificación sigue un patrón mucho más seguro y riguroso:

<figure class="diagram">
  <figcaption>El flujo de modificación en JPA</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Recuperar entidad (404 si falta)</li>
    <li>Modificar campos (setters)</li>
    <li>Dirty Checking automático</li>
    <li>Commit / UPDATE</li>
  </ol>
</figure>

1. **Recuperamos la entidad existente:** llamamos a `findById(id)`. Si no existe, lanzamos de inmediato nuestra `RecursoNoEncontradoException` (que se traduce en un `404 Not Found`). No se actualizan fantasmas.
2. **La entidad pasa a estar gestionada (*managed*):** entra en el contexto de persistencia de Hibernate.
3. **Modificamos sus atributos:** aplicamos los nuevos valores mediante sus métodos *setters*.
4. **Hibernate detecta el cambio (*dirty checking*):** al terminar la transacción (`@Transactional`), Hibernate compara el objeto con la foto que tomó al recuperarlo de la base de datos. Si detecta campos modificados, emite automáticamente la sentencia `UPDATE` correspondiente.

<div class="rule">
  <p class="rule-label">¿Hace falta llamar a save() para actualizar?</p>
  <p>Dentro de un método anotado con <code>@Transactional</code>, <strong>no es estrictamente necesario llamar a <code>repositorio.save(entidad)</code> si la entidad ya estaba gestionada</strong>. El mecanismo de <em>dirty checking</em> de Hibernate detecta cualquier llamada a un <em>setter</em> y lanza el <code>UPDATE</code> al confirmar la transacción.</p>
  <p>Sin embargo, en Spring Data se recomienda mantener la llamada a <code>save()</code> al final del método por claridad y coherencia arquitectónica: hace que el código sea autodocumentado y señala de forma explícita dónde se sella la operación.</p>
</div>

### Reemplazo total (PUT) frente a modificación parcial (PATCH)

En la UD3 diseñamos el contrato REST distinguiendo claramente estas dos intenciones:

* **`PUT /tareas/{id}`:** Reemplazo completo. El cliente envía todos los campos editables del recurso. Si omite uno, ese campo se sobrescribe o se anula.
* **`PATCH /tareas/{id}` o `PATCH /tareas/{id}/completar`:** Modificación parcial o cambio de estado. Solo se alteran los campos especificados en la petición, dejando el resto intactos.

Veamos cómo se traduce esto en nuestro `TareaService`:

```java
@Transactional
public Tarea reemplazar(Long id, Tarea nuevosDatos) {
    // 1. Asegurar existencia: 404 si no existe
    Tarea existente = obtener(id);

    // 2. Sobrescribir todos los campos editables
    existente.setTitulo(nuevosDatos.getTitulo());
    existente.setPrioridad(nuevosDatos.getPrioridad());
    existente.setCompletada(nuevosDatos.isCompletada());

    // 3. Sellar cambios
    return repositorio.save(existente);
}

@Transactional
public Tarea cambiarEstado(Long id, boolean completada) {
    Tarea existente = obtener(id);
    existente.setCompletada(completada);
    return repositorio.save(existente);
}
```

<dl class="worked">
  <dt>Por qué no hacemos <code>nuevosDatos.setId(id); repositorio.save(nuevosDatos);</code></dt>
  <dd>Ese es el error clásico de quien usa JPA por primera vez. Si creas un objeto nuevo desde el DTO, le plantas el id y llamas a <code>save()</code>, Hibernate ejecutará un <code>SELECT</code> previo, pero sobrescribirá todas las columnas que no vinieran en el DTO con valores <code>null</code> o por defecto, destruyendo información previa como fechas de creación o contadores internos. Cargar primero la entidad existente protege los campos que no deben alterarse.</dd>
</dl>

### La eliminación segura: cómo borrar sin dejar cabos sueltos

Borrar un registro plantea dos cuestiones clave: **la comprobación previa de existencia** y **las consecuencias sobre otras tablas**.

<p class="stage">1 · Comprobar existencia antes de borrar</p>

En HTTP, un `DELETE` sobre un identificador que no existe debe responder `404 Not Found` (o `204 No Content` si se adopta idempotencia ciega, pero en nuestra API hemos establecido informar al cliente cuando pide borrar algo inexistente).

En el servicio lo implementamos así:

```java
@Transactional
public void eliminar(Long id) {
    if (!repositorio.existsById(id)) {
        throw new RecursoNoEncontradoException("tarea", id);
    }
    repositorio.deleteById(id);
}
```

`existsById(id)` ejecuta en PostgreSQL una consulta hiperligera:
```sql
SELECT count(*) > 0 FROM tareas WHERE id = ?
```
Si devuelve `true`, `deleteById(id)` ejecuta:
```sql
DELETE FROM tareas WHERE id = ?
```

<p class="stage">2 · Borrado físico frente a borrado lógico (Soft Delete)</p>

| Estrategia | Cómo funciona | Ventajas | Inconvenientes |
| :--- | :--- | :--- | :--- |
| **Borrado físico (*Hard Delete*)** | Sentencia SQL `DELETE FROM tareas WHERE id = ?`. | Libera espacio en disco, esquema limpio y sencillo. | **Irreversible.** Se pierde la trazabilidad histórica y de auditoría. |
| **Borrado lógico (*Soft Delete*)** | `UPDATE tareas SET activo = false, fecha_baja = NOW() WHERE id = ?`. | Recuperable, mantiene histórico para analítica o auditorías legales. | Todas las consultas deben filtrar `WHERE activo = true` para no mostrar datos borrados. |

En este taller utilizaremos borrado físico para comprender a fondo el comportamiento de las claves foráneas en PostgreSQL.

<p class="stage">3 · El choque con la integridad referencial</p>

Imagina que un proyecto con `id = 1` tiene cinco tareas asociadas. La columna `proyecto_id` de la tabla `tareas` apunta a la clave primaria de `proyectos`.

¿Qué ocurre si intentas ejecutar `DELETE FROM proyectos WHERE id = 1;`?

PostgreSQL detiene la operación en seco y lanza un error de violación de clave foránea:
```text
ERROR: update or delete on table "proyectos" violates foreign key constraint "fk_tareas_proyecto"
DETAIL: Key (id)=(1) is still referenced from table "tareas".
```

<div class="rule">
  <p class="rule-label">La base de datos protege tus datos de tu propio código</p>
  <p>La base de datos jamás permitirá que queden tareas huérfanas apuntando a un proyecto que ya no existe. Esa es la diferencia entre una base de datos relacional seria y un archivo de texto: la <strong>integridad referencial garantizada por el motor</strong>.</p>
  <p>Si quieres borrar un proyecto, la aplicación debe decidir explícitamente: o borra primero las tareas que contiene, o las reasigna a otro proyecto, o desactiva el proyecto mediante borrado lógico.</p>
</div>

### Paso a paso guiado · Conectar PUT, PATCH y DELETE

Abre `TareaController.java` y añade los tres endpoints correspondientes:

```java
@PutMapping("/{id}")
public TareaResponse reemplazar(
        @PathVariable Long id,
        @Valid @RequestBody TareaRequest peticion) {
    Tarea datos = TareaMapper.aModelo(peticion);
    Tarea actualizada = servicio.reemplazar(id, datos);
    return TareaMapper.aRespuesta(actualizada);
}

@PatchMapping("/{id}/completar")
public TareaResponse marcarCompletada(@PathVariable Long id) {
    Tarea actualizada = servicio.cambiarEstado(id, true);
    return TareaMapper.aRespuesta(actualizada);
}

@DeleteMapping("/{id}")
public ResponseEntity<Void> eliminar(@PathVariable Long id) {
    servicio.eliminar(id);
    return ResponseEntity.noContent().build();
}
```

<p class="term">ResponseEntity.noContent().build()</p>

Devuelve un código de estado `204 No Content` sin cuerpo en la respuesta. Es el estándar de oro en arquitecturas REST para operaciones `DELETE` que terminan con éxito.

### La comprobación · El ciclo completo de modificación y borrado

Arranca la aplicación y ejecuta las siguientes pruebas en orden:

<p class="stage">1 · Modificación completa con PUT</p>

Envía una petición para modificar la tarea 1:

```http
PUT http://localhost:8080/tareas/1
Content-Type: application/json

{
  "titulo": "Auditar índices en PostgreSQL (Actualizado)",
  "prioridad": "BAJA"
}
```

* Respuesta: `200 OK` con el JSON actualizado y `prioridad: "BAJA"`.
* Consola SQL de Hibernate:
```sql
Hibernate: 
    update 
        tareas 
    set
        completada=?,
        prioridad=?,
        titulo=? 
    where
        id=?
```

<p class="stage">2 · Modificación parcial con PATCH</p>

Marca la tarea como completada:

```http
PATCH http://localhost:8080/tareas/1/completar
```

* Respuesta: `200 OK` con `"completada": true`.
* Consola SQL: comprueba que Hibernate ejecuta el `UPDATE` modificando el valor booleano.

<p class="stage">3 · Eliminación exitosa con DELETE</p>

Borra la tarea 1:

```http
DELETE http://localhost:8080/tareas/1
```

* Respuesta: `204 No Content` (cuerpo vacío).
* Consola SQL:
```sql
Hibernate: 
    delete 
    from
        tareas 
    where
        id=?
```

<p class="stage">4 · Comprobación de recurso desaparecido</p>

1. Consulta ahora `GET http://localhost:8080/tareas/1`:
   * Respuesta: `404 Not Found`. La tarea ya no existe.
2. Intenta volver a borrar `DELETE http://localhost:8080/tareas/1`:
   * Respuesta: `404 Not Found`. La aplicación detecta que ya no está y rechaza la operación.
3. Abre tu cliente SQL (DBeaver o `psql`) y ejecuta `SELECT * FROM tareas WHERE id = 1;`: cero filas.

### Ahora tú · Modificar y eliminar proyectos

Implementa en `Proyecto` las operaciones de actualización y borrado:

1. Añade a `ProyectoService`:
   * `reemplazar(Long id, Proyecto nuevosDatos)`: carga el existente, actualiza `nombre`, `descripcion` y `activo`, validando que el nombre siga siendo único en el sistema.
   * `eliminar(Long id)`: comprueba existencia con `existsById(id)` (lanzando `404` si falta) y ejecuta `deleteById(id)`.
2. Añade los endpoints correspondientes a `ProyectoController`:
   * `PUT /proyectos/{id}` devolviendo `200 OK`.
   * `DELETE /proyectos/{id}` devolviendo `204 No Content`.
3. Comprueba el caso de error: intenta modificar o borrar un proyecto con `id = 9999` y comprueba que recibes un `404 Not Found` en ambos casos.

### Reto · Bloqueo optimista y borrado en cascada

Analiza estas dos situaciones críticas de producción:

<p class="stage stage--solo">1 · El problema de la actualización perdida (Lost Update)</p>

Dos usuarios, Ana y Carlos, cargan en su navegador la tarea 2 al mismo tiempo:
* Ana cambia el título a `"Revisión urgente"` y pulsa guardar (10:00:01).
* Carlos, que tenía la pantalla abierta sin el cambio de Ana, cambia la prioridad a `"BAJA"` y pulsa guardar (10:00:02).
* El guardado de Carlos sobrescribe el título de Ana y lo borra sin que nadie se entere.

Investiga cómo resuelve JPA este problema mediante **bloqueo optimista** (*Optimistic Locking*):
* ¿Qué hace la anotación `@Version private Long version;` en una `@Entity`?
* ¿Qué consulta SQL ejecuta Hibernate en el `UPDATE` para comprobar si alguien modificó la fila antes?
* ¿Qué excepción lanza Spring cuando detecta una colisión concurrente y qué código HTTP (`409 Conflict`) debería devolver la API?

<p class="stage stage--solo">2 · El peligro de ON DELETE CASCADE</p>

En PostgreSQL puedes definir una clave foránea con la cláusula `ON DELETE CASCADE`: si se borra un proyecto, el motor borra automáticamente todas sus tareas asociadas en cascada.
* Explica qué ventaja tiene esto frente a borrar las tareas una a una con un bucle en Java.
* Explica por qué muchos arquitectos de software **prohíben terminantemente `ON DELETE CASCADE`** en tablas con información de negocio crítica. ¿Qué ocurriría si un usuario borra un cliente por error en un CRM?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span><code>PUT</code> y <code>DELETE</code> funcionando en <code>Tarea</code> con respuestas 200, 204 y 404 ante id inexistente.</span></div>
  <div><strong>Si lo tienes</strong><span>Reemplazo y borrado implementado en <code>Proyecto</code>, con validación de existencia previa y trazabilidad SQL de los <code>UPDATE</code>.</span></div>
  <div><strong>Reto</strong><span>El mecanismo de <code>@Version</code> (bloqueo optimista) explicado con su SQL correspondiente y el debate técnico de <code>ON DELETE CASCADE</code> documentado.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 32</p>
  <ul class="checklist">
    <li>Comprendes cómo el <em>dirty checking</em> de Hibernate detecta cambios en entidades gestionadas y genera sentencias <code>UPDATE</code>.</li>
    <li>Distingues cuándo un reemplazo completo requiere cargar la entidad previa para no perder campos inmutables.</li>
    <li>La operación <code>DELETE</code> responde <code>204 No Content</code> si tiene éxito y <code>404 Not Found</code> si el identificador no existía.</li>
    <li>Has comprobado en PostgreSQL que las filas borradas desaparecen físicamente del disco.</li>
    <li>Entiendes qué es la integridad referencial y cómo las restricciones de clave foránea protegen la base de datos contra registros huérfanos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es peligroso instanciar un objeto nuevo con <code>new</code>, asignarle el id recibido por la URL y llamar a <code>save()</code> para actualizar?</li>
    <li>¿Qué consulta ejecuta Spring Data JPA cuando llamas a <code>repositorio.existsById(id)</code>?</li>
    <li>¿Qué significa que una operación HTTP DELETE deba responder <code>204 No Content</code>?</li>
    <li>¿Qué ocurre en PostgreSQL si intentas borrar una fila que está siendo apuntada por una clave foránea de otra tabla sin borrado en cascada?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque cualquier atributo que no estuviera presente en el DTO recibido se guardará como <code>null</code> o con su valor por defecto, destruyendo información previa de la base de datos.</p>
  <p>2 · Ejecuta un <code>SELECT count(*) > 0 FROM ... WHERE id = ?</code>, que comprueba la existencia de la fila sin cargar todas sus columnas en la memoria RAM.</p>
  <p>3 · Que la acción se ha completado con éxito en el servidor y no hay ningún contenido o cuerpo que devolver al cliente.</p>
  <p>4 · La base de datos aborta la transacción lanzando un error de violación de restricción de clave foránea (FK violation), impidiendo que queden registros huérfanos.</p>
</details>

## Sesión 33 · Consultas derivadas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué <code>findAll()</code> con filtrado en memoria es un desastre de rendimiento, cómo Spring Data deriva consultas SQL a partir del nombre del método y el vocabulario de operadores disponibles.</li>
    <li><strong>2. Haz:</strong> declara métodos de consulta derivados en <code>TareaRepository</code>, conéctalos con parámetros <code>@RequestParam</code> en el controlador y audita las cláusulas <code>WHERE</code> en los logs.</li>
    <li><strong>3. Comprueba:</strong> ejecutas búsquedas filtradas por estado, prioridad y texto desde HTTP, verificas el SQL generado y experimentas qué ocurre ante un error tipográfico en el repositorio.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En la UD2 filtrábamos listas en memoria con <code>.stream().filter(...)</code>. Si tu tabla tiene 100.000 tareas, ¿por qué hacer <code>findAll()</code> y filtrar en Java colapsaría el servidor?</li>
    <li>¿Qué convención léxica utiliza Spring Data JPA para deducir qué consulta SQL debe construir sin que escribas código?</li>
    <li>¿En qué momento valida Spring Data JPA si los métodos declarados en la interfaz del repositorio existen realmente en la entidad?</li>
  </ol>
</div>

### La falacia de «me lo traigo todo y lo filtro en Java»

En las primeras unidades de este curso, cuando un endpoint necesitaba tareas de prioridad alta, la tentación natural era escribir esto:

```java
// ANTIPATRÓN: cargar el mundo en memoria para quedarse con tres elementos
public List<Tarea> buscarUrgentes() {
    return repositorio.findAll().stream()
            .filter(t -> "ALTA".equals(t.getPrioridad()))
            .toList();
}
```

Con cincuenta tareas en una lista de pruebas no notas nada raro. Pero analicemos qué ocurre en un entorno real con 200.000 tareas registradas:

1. **Tráfico de red masivo:** la base de datos lee 200.000 filas de disco y las envía completas por el cable TCP hasta tu aplicación Spring Boot (decenas de megabytes innecesarios).
2. **Desperdicio de memoria RAM:** Hibernate construye 200.000 instancias completas de `Tarea` en el *heap* de la JVM, saturando el recolector de basura (*Garbage Collector*).
3. **Desprecio a la base de datos:** has ignorado los índices de PostgreSQL, su optimizador de costes y su memoria caché relacional, convirtiendo un motor de base de datos de millones de euros en un simple volquete de datos.

<div class="rule">
  <p class="rule-label">La regla de oro del filtrado</p>
  <p><strong>El filtrado de datos siempre se realiza en el motor de la base de datos, nunca en la memoria de la aplicación.</strong></p>
  <p>La base de datos tiene estructuras en árbol (índices B-Tree) diseñadas para descartar el 99,9 % de los registros en microsegundos. Por el cable de red solo deben viajar las filas que el cliente realmente solicitó.</p>
</div>

### Cómo funciona la derivación de consultas en Spring Data

Spring Data JPA incluye un analizador léxico (*query derivation mechanism*) capaz de interpretar el nombre de un método Java y traducirlo automáticamente a sentencias SQL con cláusulas `WHERE`, `ORDER BY` y límites.

Basta con declarar la cabecera del método en tu interfaz de repositorio:

```java
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByPrioridad(String prioridad);
}
```

Al ver ese método, Spring Data descompone el nombre:
* **`find` / `read` / `get` / `query`:** indica que se trata de una consulta de selección (`SELECT`).
* **`By`:** marca el inicio de los criterios de filtrado (`WHERE`).
* **`Prioridad`:** busca un atributo llamado `prioridad` en la entidad `Tarea`.
* **`(String prioridad)`:** asocia el primer parámetro del método al valor del filtro (`WHERE prioridad = ?`).

### El vocabulario de operadores

Spring Data ofrece una gramática muy completa combinando palabras clave en el nombre del método:

| Método en el repositorio | Sentencia SQL equivalente generada |
| :--- | :--- |
| `findByCompletada(boolean completada)` | `WHERE completada = ?` |
| `findByPrioridadAndCompletada(String p, boolean c)` | `WHERE prioridad = ? AND completada = ?` |
| `findByPrioridadOrCompletada(String p, boolean c)` | `WHERE prioridad = ? OR completada = ?` |
| `findByTituloContaining(String fragmento)` | `WHERE titulo LIKE '%' \|\| ? \|\| '%'` |
| `findByTituloContainingIgnoreCase(String frag)` | `WHERE LOWER(titulo) LIKE LOWER('%' \|\| ? \|\| '%')` |
| `findByCompletadaFalseOrderByPrioridadDesc()` | `WHERE completada = false ORDER BY prioridad DESC` |
| `long countByCompletadaFalse()` | `SELECT count(*) ... WHERE completada = false` |
| `boolean existsByTitulo(String titulo)` | `SELECT count(*) > 0 ... WHERE titulo = ?` |

<dl class="worked">
  <dt><code>Containing</code> frente a <code>StartingWith</code> y <code>EndingWith</code></dt>
  <dd><code>Containing</code> equivale a <code>LIKE '%texto%'</code> (busca en cualquier posición). <code>StartingWith</code> genera <code>LIKE 'texto%'</code> y permite a la base de datos aprovechar un índice B-Tree convencional de texto.</dd>
  <dt><code>IgnoreCase</code></dt>
  <dd>Convierte ambos lados a minúsculas con la función SQL <code>LOWER()</code>, garantizando que buscar "servidor" encuentre "Servidor" o "SERVIDOR".</dd>
</dl>

### El error en tiempo de arranque: seguridad de tipos

¿Qué ocurre si te equivocas al escribir el nombre del método en el repositorio? Por ejemplo, si escribes `findByTitol(String texto)` en lugar de `findByTitulo`.

A diferencia de JDBC (donde un error de tipeo en un String SQL solo se descubría cuando un usuario ejecutaba la pantalla semanas después), **Spring Data valida todos los nombres de métodos al arrancar la aplicación**.

Si un método no coincide con ningún atributo de la entidad, Spring Boot detiene el arranque de inmediato con este mensaje:

```text
Caused by: org.springframework.data.mapping.PropertyReferenceException: 
No property 'titol' found for type 'Tarea'; Did you mean 'titulo'?
```

Fíjate en la potencia de la herramienta: no solo rechaza el error antes de que nadie pueda usar la API, sino que inspecciona los campos reales y te sugiere la corrección.

### Paso 1 · Añadir consultas derivadas a TareaRepository

Abre `TareaRepository.java` y declara los métodos de consulta que nuestra API necesita:

```java
package com.ejemplo.gestor.repository;

import com.ejemplo.gestor.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {

    // Buscar por prioridad exacta (ej: "ALTA", "MEDIA", "BAJA")
    List<Tarea> findByPrioridad(String prioridad);

    // Buscar por estado de compleción
    List<Tarea> findByCompletada(boolean completada);

    // Buscar por fragmento en el título ignorando mayúsculas/minúsculas
    List<Tarea> findByTituloContainingIgnoreCase(String fragmento);

    // Contar tareas pendientes
    long countByCompletadaFalse();
}
```

### Paso 2 · Exponer las búsquedas en TareaService y TareaController

Abre `TareaService.java` y añade los casos de uso correspondientes, todos marcados con `readOnly = true`:

```java
@Transactional(readOnly = true)
public List<Tarea> buscarPorPrioridad(String prioridad) {
    return repositorio.findByPrioridad(prioridad);
}

@Transactional(readOnly = true)
public List<Tarea> buscarPorEstado(boolean completada) {
    return repositorio.findByCompletada(completada);
}

@Transactional(readOnly = true)
public List<Tarea> buscarPorTexto(String fragmento) {
    return repositorio.findByTituloContainingIgnoreCase(fragmento);
}

@Transactional(readOnly = true)
public long contarPendientes() {
    return repositorio.countByCompletadaFalse();
}
```

Ahora abre `TareaController.java`. En la UD3 aprendimos que los filtros sobre listas se reciben como parámetros de consulta (*Query Parameters*) opcionales sobre el mismo endpoint `GET /tareas`:

```java
@GetMapping
public List<TareaResponse> listar(
        @RequestParam(required = false) String prioridad,
        @RequestParam(required = false) Boolean completada,
        @RequestParam(required = false) String texto) {

    List<Tarea> resultado;

    if (prioridad != null) {
        resultado = servicio.buscarPorPrioridad(prioridad);
    } else if (completada != null) {
        resultado = servicio.buscarPorEstado(completada);
    } else if (texto != null) {
        resultado = servicio.buscarPorTexto(texto);
    } else {
        resultado = servicio.listar();
    }

    return TareaMapper.aRespuestas(resultado);
}
```

### Paso 3 · La comprobación: inspeccionar el SQL generado

Arranca la aplicación y prueba cada consulta desde tu cliente HTTP o navegador:

<p class="stage">1 · Filtro por prioridad</p>

Ejecuta `GET http://localhost:8080/tareas?prioridad=ALTA`.

Observa la consola de Spring Boot:
```sql
Hibernate: 
    select 
        t1_0.id,
        t1_0.completada,
        t1_0.prioridad,
        t1_0.titulo 
    from 
        tareas t1_0 
    where 
        t1_0.prioridad=?
```

Comprueba que PostgreSQL solo devuelve las tareas con prioridad alta.

<p class="stage">2 · Búsqueda por texto que contiene</p>

Ejecuta `GET http://localhost:8080/tareas?texto=postgre`.

Mira la consola de Spring Boot:
```sql
Hibernate: 
    select 
        t1_0.id,
        t1_0.completada,
        t1_0.prioridad,
        t1_0.titulo 
    from 
        tareas t1_0 
    where 
        lower(t1_0.titulo) like lower(?) escape ''
```

PostgreSQL aplica la función `lower()` en ambos lados para hacer la búsqueda insensible a mayúsculas y minúsculas.

<p class="stage">3 · Filtro por estado</p>

Ejecuta `GET http://localhost:8080/tareas?completada=false`.

Comprueba que solo retorna tareas pendientes y que en la consulta aparece `where t1_0.completada=?`.

### Los límites de las consultas derivadas

Las consultas derivadas son perfectas para búsquedas directas sobre uno, dos o tres campos. Pero tienen un límite claro de legibilidad.

Mira este nombre de método hipotético:
```java
List<Tarea> findByCompletadaFalseAndPrioridadAndTituloContainingIgnoreCaseOrderByFechaCreacionDesc(
        String prioridad, String texto);
```

Es larguísimo, difícil de leer de un vistazo y extremadamente frágil si renombras un campo.

<div class="rule">
  <p class="rule-label">Cuándo abandonar las consultas derivadas</p>
  <p>Cuando un método requiere más de dos condiciones combinadas, uniones complejas o funciones agregadas, <strong>deja de ser un buen caso para derivación por nombre</strong>.</p>
  <p>En esos escenarios se utiliza la anotación <code>@Query</code> con JPQL (lenguaje de consultas orientado a objetos) o criterios dinámicos con <em>Specifications</em>, que abordaremos en unidades posteriores.</p>
</div>

### Ahora tú · Consultas derivadas para proyectos

Aplica las consultas derivadas a la entidad `Proyecto`:

1. Añade a `ProyectoRepository` los siguientes métodos de consulta:
   * `List<Proyecto> findByActivoTrue();` (obtiene solo proyectos en activo).
   * `List<Proyecto> findByNombreContainingIgnoreCase(String fragmento);`
   * `boolean existsByNombre(String nombre);` (para verificar unicidad de nombre sin tener que cargar la entidad completa).
   * `long countByActivoTrue();`
2. Modifica la regla de unicidad en `ProyectoService`: sustituye cualquier búsqueda manual por `repositorio.existsByNombre(nombre)` antes de crear o actualizar.
3. Expon en `ProyectoController` los filtros:
   * `GET /proyectos?activo=true`
   * `GET /proyectos?texto=portal`
4. Comprueba en la consola de Spring Boot que las consultas SQL generadas aplican las cláusulas `WHERE activo = true` y `LOWER(nombre) LIKE LOWER(?)`.

### Reto · Índices en PostgreSQL y rendimiento de LIKE

Analiza estas dos cuestiones fundamentales de ingeniería de bases de datos:

<p class="stage stage--solo">1 · La creación de índices para consultas frecuentes</p>

Si tu tabla de tareas acumula 500.000 filas y ejecutas constantemente `findByPrioridad("ALTA")`, PostgreSQL tiene que realizar un escaneo secuencial de toda la tabla (*Sequential Scan*), leyendo cada una de las 500.000 filas del disco.
* Escribe la sentencia SQL nativa para crear un índice sobre la columna `prioridad` en PostgreSQL:
  ```sql
  CREATE INDEX idx_tareas_prioridad ON tareas(prioridad);
  ```
* Investiga cómo declarar ese mismo índice directamente en el código Java mediante la anotación `@Table` de tu entidad `Tarea`:
  ```java
  @Table(name = "tareas", indexes = {
      @Index(name = "idx_tareas_prioridad", columnList = "prioridad")
  })
  ```
* Explica qué ventaja tiene tener un índice para lecturas y qué coste oculto introduce para las operaciones de `INSERT` y `DELETE`.

<p class="stage stage--solo">2 · El drama de las búsquedas con LIKE '%texto%'</p>

Cuando ejecutamos `findByTituloContainingIgnoreCase("login")`, Hibernate genera `LIKE '%login%'` con un comodín `%` al principio y al final.
* Explica por qué un índice tradicional B-Tree de PostgreSQL **no se puede utilizar** cuando el patrón empieza con un comodín `%`.
* Investiga qué extensión oficial de PostgreSQL (`pg_trgm` / trigramas) y qué tipo de índice especializado (índice `GIN` o `GiST`) se utiliza en la industria para acelerar búsquedas de subcadenas en textos reales.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Consultas derivadas de <code>Tarea</code> por prioridad, estado y texto funcionando mediante <code>@RequestParam</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Consultas de <code>Proyecto</code> implementadas, regla de unicidad optimizada con <code>existsByNombre</code> y SQL verificado.</span></div>
  <div><strong>Reto</strong><span>Índice declarado con <code>@Table(indexes = ...)</code> y análisis técnico de por qué <code>LIKE '%...'</code> anula los índices B-Tree estándar.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 33</p>
  <ul class="checklist">
    <li>Comprendes por qué el filtrado de datos debe ejecutarse siempre en el motor SQL y nunca en memoria Java con <code>findAll()</code>.</li>
    <li>Sabes construir nombres de métodos derivados combinando operadores lógicos (<code>And</code>, <code>Or</code>, <code>Containing</code>, <code>IgnoreCase</code>, <code>OrderBy</code>).</li>
    <li>Has comprobado que Spring Data valida los nombres de métodos al arrancar y aborta si un campo no existe en la entidad.</li>
    <li>Has conectado parámetros de consulta <code>@RequestParam</code> en el controlador para ofrecer búsquedas dinámicas en tu API.</li>
    <li>Sabes auditar las sentencias SQL en la consola para confirmar que PostgreSQL aplica los filtros con cláusulas <code>WHERE</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué hacer <code>findAll()</code> y filtrar con streams en Java es inviable en tablas con alto volumen de registros?</li>
    <li>¿Qué hace la palabra clave <code>Containing</code> en un método derivado de Spring Data?</li>
    <li>¿Cuándo detecta Spring Data si has cometido una falta de ortografía en el nombre de un método de consulta?</li>
    <li>¿Por qué un método derivado con cinco condiciones encadenadas deja de ser una buena solución técnica?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque fuerza a transferir miles de filas por la red y crear miles de objetos en el heap de la JVM, saturando la memoria y el recolector de basura sin aprovechar los índices del motor relacional.</p>
  <p>2 · Traduce el criterio a una cláusula SQL <code>LIKE '%' || ? || '%'</code>, buscando cualquier registro que contenga el fragmento especificado en cualquier posición.</p>
  <p>3 · En tiempo de arranque de la aplicación, lanzando una <code>PropertyReferenceException</code> antes de que se abra ningún puerto ni se atienda ninguna petición.</p>
  <p>4 · Porque el nombre se vuelve ilegible, frágil ante cambios de modelo y difícil de mantener; en esos casos es preferible utilizar consultas <code>@Query</code> o <em>Specifications</em>.</p>
</details>

## Semana 12 · Relaciones del dominio

## Sesión 34 · Tests de repositorio con @DataJpaTest

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué los mocks no sirven para probar el acceso a datos, qué es una prueba de rebanada (<em>slice test</em>) con <code>@DataJpaTest</code> y cómo evitar la trampa de la caché de primer nivel con <code>flush()</code> y <code>clear()</code>.</li>
    <li><strong>2. Haz:</strong> escribe una batería de pruebas automatizadas para <code>TareaRepository</code> usando <code>TestEntityManager</code> contra PostgreSQL real.</li>
    <li><strong>3. Comprueba:</strong> ejecutas <code>./mvnw test</code>, verificas que las pruebas pasan en milisegundos y demuestras que cada test hace un rollback automático sin dejar basura en la base de datos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En la sesión 26 probamos <code>TareaService</code> simulando el repositorio. ¿Por qué usar un mock no demuestra nada sobre si tus consultas SQL funcionan?</li>
    <li>¿Qué diferencia hay entre arrancar toda la aplicación con <code>@SpringBootTest</code> y usar una prueba acotada con <code>@DataJpaTest</code>?</li>
    <li>Si en un test guardas una entidad y en la línea siguiente la buscas con el repositorio, ¿cómo evitas que Hibernate te devuelva el objeto de la memoria RAM sin consultar la base de datos?</li>
  </ol>
</div>

### Por qué los mocks no sirven en el repositorio

En la sesión 26 aprendiste a probar la capa de servicio sustituyendo sus colaboradores por dobles de prueba. Tenía todo el sentido del mundo: queríamos comprobar las reglas de negocio aisladas de cualquier infraestructura.

Pero en la capa de acceso a datos, la situación es exactamente la contraria. **La única responsabilidad de un repositorio es comunicarse con la base de datos.**

Si escribes un test de repositorio usando un mock:
```java
// UN TEST INÚTIL: estás probando tu propio mock, no la base de datos
when(repositorio.findByPrioridad("ALTA")).thenReturn(List.of(tarea1));
```
No estás demostrando nada. Los errores reales de un repositorio nunca son de lógica Java:
* Una errata en un nombre de método que genera un SQL con una columna incorrecta.
* Una discrepancia de tipos entre Java y PostgreSQL (por ejemplo, enviar un `LocalDate` donde la columna espera un `TIMESTAMP`).
* Una violación de longitud de cadena (`VARCHAR(20)`) ignorada.
* Una consulta que devuelve duplicados porque faltó un `DISTINCT` en el `JOIN`.

Para que un test de repositorio tenga valor profesional, **debe ejecutarse contra una base de datos real**.

### Pruebas de rebanada (Slice Testing) con @DataJpaTest

Arrancar la aplicación completa con `@SpringBootTest` para probar una consulta SQL es una pésima idea: levanta el servidor web Tomcat, los controladores, los filtros de seguridad y los servicios, tardando entre 5 y 10 segundos por clase de prueba.

Spring Boot ofrece una solución elegante: **las pruebas de rebanada** (*Slice Tests*).

<p class="term">@DataJpaTest</p>

La anotación `@DataJpaTest` desactiva la autoconfiguración global de Spring y carga **únicamente la infraestructura de persistencia**:
* Las entidades marcadas con `@Entity`.
* Las interfaces que extienden `JpaRepository`.
* El `EntityManager` y la configuración de DataSource de Hibernate.
* No carga controladores, ni servicios, ni servidores web.

El resultado es un test que arranca en una fracción de segundo y prueba exclusivamente el acceso a datos.

<div class="rule">
  <p class="rule-label">Probar contra PostgreSQL real, no contra H2</p>
  <p>Por defecto, <code>@DataJpaTest</code> intenta buscar una base de datos embebida en memoria como H2. <strong>Ese es otro error clásico del sector.</strong></p>
  <p>H2 no soporta las mismas funciones, ni los mismos dialectos, ni el mismo comportamiento de secuencias que PostgreSQL. Un test que pasa en verde sobre H2 puede estrellarse estrepitosamente en producción contra PostgreSQL.</p>
  <p>Para indicarle a Spring que use nuestra conexión real de PostgreSQL, añadimos la anotación:
  <code>@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)</code>.</p>
</div>

### La trampa mortal: la caché de primer nivel

Observa este test. Parece perfectamente legítimo, pero es una trampa:

```java
@Test
void buscarPorPrioridad_trampa() {
    // 1. Guardar
    Tarea t = new Tarea("Revisar índices", "ALTA");
    repositorio.save(t);

    // 2. Buscar
    List<Tarea> resultado = repositorio.findByPrioridad("ALTA");

    // 3. Afirmar
    assertThat(resultado).hasSize(1);
}
```

¿Por qué es una trampa? Porque al llamar a `save(t)`, Hibernate metió el objeto `t` en su **contexto de persistencia (la caché de primer nivel)**.

Cuando en la línea siguiente llamas a `findByPrioridad("ALTA")`, en muchas ocasiones Hibernate ni siquiera envía la consulta SQL al servidor PostgreSQL: resuelve la llamada contra su mapa en memoria RAM. Tu test saldrá en verde aunque la tabla no tenga la columna o la consulta SQL generada sea una aberración.

Para que el test sea honesto, debemos utilizar **`TestEntityManager`**:

<figure class="diagram">
  <figcaption>El ciclo honesto de un test de repositorio</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>persist(entidad)</li>
    <li>flush() [fuerza SQL]</li>
    <li>clear() [vacía memoria]</li>
    <li>repositorio.find() [obliga a SELECT]</li>
  </ol>
</figure>

* **`flush()`:** obliga a Hibernate a vaciar su cola de escrituras pendientes y ejecutar inmediatamente el `INSERT` en PostgreSQL.
* **`clear()`:** vacía por completo el contexto de persistencia en memoria. La caché de primer nivel queda a cero.
* Al llamar al repositorio después del `clear()`, Hibernate **está obligado a enviar una sentencia `SELECT` por el cable TCP a PostgreSQL** y reconstruir el objeto a partir de los datos del disco.

### Paso 1 · Escribir TareaRepositoryTest

Crea el archivo `src/test/java/com/ejemplo/gestor/repository/TareaRepositoryTest.java`:

```java
package com.ejemplo.gestor.repository;

import com.ejemplo.gestor.model.Tarea;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class TareaRepositoryTest {

    @Autowired
    private TareaRepository repositorio;

    @Autowired
    private TestEntityManager em;

    @Test
    @DisplayName("findByPrioridad devuelve solo las tareas que coinciden exactamente")
    void findByPrioridad_cuandoHayCoincidencias_devuelveSoloCoincidentes() {
        // Preparar (Arrange): persistir dos tareas en PostgreSQL
        Tarea urgente = new Tarea("Corregir fuga de memoria", "ALTA");
        Tarea normal = new Tarea("Actualizar README", "MEDIA");

        em.persist(urgente);
        em.persist(normal);
        em.flush();
        em.clear(); // Vaciar memoria para obligar a consultar a PostgreSQL

        // Actuar (Act): ejecutar la consulta derivada
        List<Tarea> resultado = repositorio.findByPrioridad("ALTA");

        // Comprobar (Assert)
        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getTitulo()).isEqualTo("Corregir fuga de memoria");
        assertThat(resultado.get(0).getPrioridad()).isEqualTo("ALTA");
    }

    @Test
    @DisplayName("findByPrioridad devuelve lista vacía si ninguna coincide")
    void findByPrioridad_cuandoNoHayCoincidencias_devuelveListaVacia() {
        Tarea normal = new Tarea("Actualizar README", "MEDIA");
        em.persist(normal);
        em.flush();
        em.clear();

        List<Tarea> resultado = repositorio.findByPrioridad("BAJA");

        assertThat(resultado).isEmpty();
    }

    @Test
    @DisplayName("findByTituloContainingIgnoreCase ignora mayúsculas y encuentra fragmentos")
    void findByTitulo_ignoraMayusculasYMinusculas() {
        Tarea t1 = new Tarea("Aprender PostgreSQL y Spring", "ALTA");
        Tarea t2 = new Tarea("Escribir documentación", "BAJA");

        em.persist(t1);
        em.persist(t2);
        em.flush();
        em.clear();

        List<Tarea> resultado = repositorio.findByTituloContainingIgnoreCase("POSTGRE");

        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getTitulo()).isEqualTo("Aprender PostgreSQL y Spring");
    }

    @Test
    @DisplayName("countByCompletadaFalse cuenta únicamente las pendientes")
    void countByCompletadaFalse_cuentaSoloPendientes() {
        Tarea pendiente1 = new Tarea("Tarea 1", "ALTA");
        Tarea pendiente2 = new Tarea("Tarea 2", "MEDIA");
        Tarea terminada = new Tarea(null, "Tarea 3", "BAJA", true);

        em.persist(pendiente1);
        em.persist(pendiente2);
        em.persist(terminada);
        em.flush();
        em.clear();

        long pendientes = repositorio.countByCompletadaFalse();

        assertThat(pendientes).isEqualTo(2);
    }
}
```

<dl class="worked">
  <dt>Por qué cada test hace rollback automático</dt>
  <dd>Por defecto, cada método anotado con <code>@Test</code> dentro de una clase con <code>@DataJpaTest</code> está envuelto en una transacción. Al terminar la ejecución de cada test, Spring ejecuta un <strong>ROLLBACK automático</strong>. Esto garantiza que el primer test no deje datos que contaminen al segundo, logrando un aislamiento total y repetible.</dd>
</dl>

### Paso 2 · Ejecutar y comprobar en la terminal

Abre la terminal y ejecuta exclusivamente los tests de persistencia:

```bash
./mvnw test -Dtest=TareaRepositoryTest
```

Observa la salida en la consola:

```text
[INFO] Running com.ejemplo.gestor.repository.TareaRepositoryTest
2026-09-02T11:20:01.120+02:00  INFO 54321 --- [main] o.s.b.t.a.j.DataJpaTestContextBootstrapper : Found @SpringBootConfiguration com.ejemplo.gestor.GestorApplication
2026-09-02T11:20:01.890+02:00  INFO 54321 --- [main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Added connection
2026-09-02T11:20:02.100+02:00  INFO 54321 --- [main] org.hibernate.dialect.Dialect             : HHH000400: Using dialect: org.hibernate.dialect.PostgreSQLDialect
Hibernate: insert into tareas (completada, prioridad, titulo) values (?, ?, ?)
Hibernate: select t1_0.id, t1_0.completada, t1_0.prioridad, t1_0.titulo from tareas t1_0 where t1_0.prioridad=?
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.452 s
[INFO] BUILD SUCCESS
```

Fíjate en las consultas SQL:
1. Verás el `insert` forzado por el `em.flush()`.
2. Verás el `select` forzado por el `em.clear()` y la llamada al repositorio.
3. El test pasa en menos de 2 segundos contra tu PostgreSQL real.

### Ahora tú · Tests para ProyectoRepository

Escribe la clase `ProyectoRepositoryTest` cubriendo las consultas derivadas que implementamos en la sesión 33:

1. Crea `src/test/java/com/ejemplo/gestor/repository/ProyectoRepositoryTest.java` con `@DataJpaTest` y `@AutoConfigureTestDatabase(replace = NONE)`.
2. Escribe un test para `findByActivoTrue()`:
   * Inserta un proyecto activo y otro inactivo (`activo = false`).
   * Ejecuta `flush()` y `clear()`.
   * Verifica que la lista devuelta tiene tamaño 1 y que su campo `activo` es `true`.
3. Escribe un test para `existsByNombre()`:
   * Inserta un proyecto con nombre `"Plataforma Educativa"`.
   * Comprueba que `existsByNombre("Plataforma Educativa")` devuelve `true`.
   * Comprueba que `existsByNombre("Nombre Inventado")` devuelve `false`.
4. Escribe un test que intente persistir una entidad con un campo no nulo vacío (o nombre duplicado si configuraste `@Column(unique = true)`):
   * Comprueba que al ejecutar `em.flush()` se lanza una excepción de integridad de datos (`DataIntegrityViolationException` o `ConstraintViolationException`).

### Reto · La trampa de las excepciones diferidas

Investiga este fenómeno clave del funcionamiento de los motores ORM:

<p class="stage stage--solo">1 · El test que pasa en verde sin comprobar nada</p>

Imagina que quieres comprobar que la base de datos rechaza una tarea sin título (`titulo = null`), violando la restricción `@Column(nullable = false)`:

```java
@Test
void tareaSinTitulo_debeFallar_malEscrito() {
    Tarea sinTitulo = new Tarea(null, "ALTA");
    em.persist(sinTitulo);
    // Omitimos em.flush();
}
```

* Ejecuta ese test sin llamar a `em.flush()`. **El test pasa en verde sin lanzar ninguna excepción.**
* ¿Por qué? Porque Hibernate retrasa (*defers*) las sentencias de inserción hasta el último momento posible antes de confirmar la transacción. Como el método termina sin forzar el envío, la transacción se cancela (rollback) y la sentencia `INSERT` jamás llega a viajar a PostgreSQL.
* Ahora añade `em.flush()` y envuélvelo en `assertThrows(ConstraintViolationException.class, () -> em.flush());`.
* Explica con tus palabras por qué `flush()` es la única instrucción que convierte un deseo en memoria en una sentencia SQL física verificable.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span><code>TareaRepositoryTest</code> escrito con <code>@DataJpaTest</code>, usando <code>flush()</code> y <code>clear()</code> con los 4 tests en verde.</span></div>
  <div><strong>Si lo tienes</strong><span><code>ProyectoRepositoryTest</code> completo cubriendo <code>findByActivoTrue</code> y <code>existsByNombre</code> contra PostgreSQL real.</span></div>
  <div><strong>Reto</strong><span>El test de violación de restricción implementado con <code>assertThrows</code> y la justificación técnica de las escrituras diferidas en Hibernate.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 34</p>
  <ul class="checklist">
    <li>Entiendes por qué la capa repository exige pruebas con base de datos real y no con mocks.</li>
    <li>Utilizas <code>@DataJpaTest</code> para ejecutar pruebas de persistencia en milisegundos sin arrancar Tomcat ni los controladores.</li>
    <li>Configuras <code>@AutoConfigureTestDatabase(replace = NONE)</code> para validar contra PostgreSQL y no contra H2.</li>
    <li>Usas <code>TestEntityManager.flush()</code> y <code>clear()</code> para evitar falsos positivos provocados por la caché de primer nivel.</li>
    <li>Compruebas que las consultas derivadas devuelven los resultados exactos y manejan listas vacías sin errores.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué componentes de Spring carga <code>@DataJpaTest</code> y cuáles ignora por completo?</li>
    <li>¿Por qué llamar a <code>save()</code> y consultar inmediatamente sin hacer <code>clear()</code> puede falsear un test de repositorio?</li>
    <li>¿Por qué no quedan filas guardadas en PostgreSQL después de ejecutar una clase de tests con <code>@DataJpaTest</code>?</li>
    <li>¿Qué instrucción fuerza a Hibernate a ejecutar las sentencias SQL pendientes antes de que termine la transacción?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Carga entidades (@Entity), repositorios (JpaRepository) y el DataSource de JPA; ignora controladores (@RestController), servicios (@Service), filtros de seguridad y el servidor web embebido.</p>
  <p>2 · Porque Hibernate resuelve la búsqueda contra la caché de primer nivel en la memoria RAM de la JVM, sin enviar la sentencia SELECT a PostgreSQL ni verificar si el SQL generado funciona realmente en el motor relacional.</p>
  <p>3 · Porque cada método de test está envuelto en una transacción gestionada que ejecuta un ROLLBACK automático al finalizar.</p>
  <p>4 · La instrucción <code>em.flush()</code> (o <code>testEntityManager.flush()</code>).</p>
</details>

## Sesión 35 · ManyToOne y OneToMany

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué guardar claves numéricas sueltas destruye el modelo de objetos, cómo mapear <code>@ManyToOne</code> y <code>@JoinColumn</code>, y la regla crítica de configurar siempre <code>FetchType.LAZY</code>.</li>
    <li><strong>2. Haz:</strong> refactoriza <code>Tarea</code> para vincularla a <code>Proyecto</code> como entidad real, adaptando DTOs y mappers para evitar fugas de información.</li>
    <li><strong>3. Comprueba:</strong> creas tareas vinculadas a proyectos por HTTP, consultas tareas por proyecto con <code>findByProyectoId</code> y auditas el comportamiento del Proxy de Hibernate.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si en la clase <code>Tarea</code> tenemos <code>private Long proyectoId;</code>, ¿por qué eso rompe los principios de la programación orientada a objetos?</li>
    <li>En una relación entre tareas (muchas) y proyectos (uno), ¿cuál es el lado propietario en JPA y qué anotación define la columna física?</li>
    <li>¿Por qué el comportamiento por defecto de <code>@ManyToOne</code> en JPA (<code>FetchType.EAGER</code>) es peligroso en bases de datos con miles de registros?</li>
  </ol>
</div>

### De un identificador numérico a un grafo de entidades

Hasta ahora, en nuestra entidad `Tarea` guardábamos una referencia débil:

```java
// MODELADO PRIMITIVO (procedural)
public class Tarea {
    private Long id;
    private String titulo;
    private Long proyectoId; // Un simple número
}
```

Guardar un `Long proyectoId` funciona a nivel de base de datos relacional, pero en Java introduce tres problemas de diseño muy serios:

1. **Pérdida total de navegación:** si teniendo una tarea necesitas mostrar el nombre del proyecto al que pertenece, estás obligado a inyectar `ProyectoRepository` y hacer una consulta manual adicional. No puedes hacer `tarea.getProyecto().getNombre()`.
2. **Validación manual:** la aplicación permite guardar `proyectoId = 9999`. Salvo que escribas código defensivo a mano en cada servicio, la incoherencia no se detectará hasta que PostgreSQL rechace el `INSERT` con una violación de clave foránea cruda.
3. **Desajuste de paradigma:** los objetos se relacionan mediante referencias directas en memoria, no mediante claves foráneas numéricas.

### El lado propietario: @ManyToOne y @JoinColumn

En una base de datos relacional, la clave foránea siempre se almacena en la tabla del lado «muchos» (`tareas` tiene la columna `proyecto_id` apuntando a `proyectos.id`).

En JPA, la entidad que mapea la clave foránea física se denomina **lado propietario** (*Owning Side*):

<figure class="diagram">
  <figcaption>Mapeo objeto-relacional de @ManyToOne</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Clase Tarea (@ManyToOne)</li>
    <li>@JoinColumn(name = "proyecto_id")</li>
    <li>Tabla tareas (FK proyecto_id)</li>
    <li>Tabla proyectos (PK id)</li>
  </ol>
</figure>

```java
@Entity
@Table(name = "tareas")
public class Tarea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String titulo;

    @Column(nullable = false, length = 20)
    private String prioridad;

    private boolean completada;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "proyecto_id", nullable = false)
    private Proyecto proyecto;

    // Constructores, getters y setters
}
```

<dl class="worked">
  <dt><code>@ManyToOne</code></dt>
  <dd>Declara que muchas instancias de <code>Tarea</code> pueden pertenecer a una misma instancia de <code>Proyecto</code>.</dd>
  <dt><code>@JoinColumn(name = "proyecto_id", nullable = false)</code></dt>
  <dd>Especifica el nombre exacto de la columna física en la tabla <code>tareas</code> que actúa como clave foránea (FK). Al indicar <code>nullable = false</code>, Hibernate añade la restricción <code>NOT NULL</code> al generar el esquema o validarlo.</dd>
  <dt><code>optional = false</code></dt>
  <dd>Regla a nivel de JPA que indica que una tarea no puede existir en el contexto de persistencia sin un proyecto asociado.</dd>
</dl>

### La regla más importante de JPA: FetchType.LAZY

Fíjate en el atributo `fetch = FetchType.LAZY`. **Esta es la decisión de rendimiento más trascendente que tomarás en persistencia.**

JPA ofrece dos estrategias de carga para relaciones:

| Estrategia | Cómo funciona | Riesgo en producción |
| :--- | :--- | :--- |
| **`FetchType.EAGER` (Ansioso)** | Al cargar una `Tarea`, Hibernate carga **inmediatamente** el `Proyecto` asociado mediante un `JOIN` o una segunda consulta SQL. | **Catastrófico.** Si listas 100 tareas, Hibernate puede disparar 100 consultas adicionales para cargar cada proyecto (**el problema N+1**). |
| **`FetchType.LAZY` (Perezoso)** | Al cargar una `Tarea`, Hibernate **no consulta** la tabla de proyectos. En su lugar, coloca un objeto simulado (**Proxy de Hibernate**). Solo viajará a PostgreSQL si alguien llama a `tarea.getProyecto().getNombre()`. | **Óptimo.** Solo se paga el coste de consultar los datos que el caso de uso realmente necesita. |

<div class="rule">
  <p class="rule-label">Por defecto JPA hace trampa: cámbialo siempre a LAZY</p>
  <p>En la especificación estándar de JPA, la anotación <code>@ManyToOne</code> viene por defecto con <code>FetchType.EAGER</code>. Es una de las peores decisiones históricas de diseño del estándar.</p>
  <p><strong>Regla innegociable en este curso:</strong> toda anotación <code>@ManyToOne</code> y <code>@OneToOne</code> que escribas debe llevar explícitamente <code>fetch = FetchType.LAZY</code>.</p>
</div>

### Cómo viaja la relación en la API: DTOs limpios

Ahora que `Tarea` contiene un objeto `Proyecto`, surge la duda: ¿cómo deben ser los DTOs de petición y respuesta?

<p class="stage">1 · TareaRequest (entrada)</p>

El cliente web no envía un objeto proyecto entero con su fecha de creación y descripción; solo envía su identificador:

```java
public record TareaRequest(
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 120, message = "Máximo 120 caracteres")
    String titulo,

    @NotBlank(message = "La prioridad es obligatoria")
    String prioridad,

    @NotNull(message = "El id del proyecto es obligatorio")
    Long proyectoId
) {}
```

<p class="stage">2 · TareaResponse (salida)</p>

En la respuesta proyectamos los datos útiles para la vista, aplanando la relación para no forzar a la interfaz a lidiar con objetos anidados innecesarios:

```java
public record TareaResponse(
    Long id,
    String titulo,
    String prioridad,
    boolean completada,
    Long proyectoId,
    String proyectoNombre
) {}
```

<p class="stage">3 · El servicio asocia las entidades</p>

En `TareaService`, el caso de uso de creación valida la existencia del proyecto antes de asociarlo:

```java
@Service
public class TareaService {

    private final TareaRepository tareaRepo;
    private final ProyectoRepository proyectoRepo;

    public TareaService(TareaRepository tareaRepo, ProyectoRepository proyectoRepo) {
        this.tareaRepo = tareaRepo;
        this.proyectoRepo = proyectoRepo;
    }

    @Transactional
    public Tarea crear(Tarea tarea, Long proyectoId) {
        // 1. Validar que el proyecto existe; si no, lanzar excepción de dominio (404)
        Proyecto proyecto = proyectoRepo.findById(proyectoId)
                .orElseThrow(() -> new RecursoNoEncontradoException("proyecto", proyectoId));

        // 2. Asociar el objeto en el lado propietario
        tarea.setProyecto(proyecto);
        tarea.setCompletada(false);

        // 3. Persistir
        return tareaRepo.save(tarea);
    }
}
```

<dl class="worked">
  <dt>Por qué validamos el proyecto antes de guardar</dt>
  <dd>Si no comprobáramos la existencia de <code>proyectoId</code> en el servicio, la llamada a <code>save()</code> delegaría la validación en la restricción física de PostgreSQL, lanzando una <code>DataIntegrityViolationException</code> (que terminaría en un error <code>500 Internal Server Error</code> o requeriría un manejador de excepciones complejo). Validarlo en el servicio permite emitir de inmediato un <code>404 Not Found</code> limpio con el mensaje exacto: <em>"No existe proyecto con id 88"</em>.</dd>
</dl>

### Paso a paso guiado · Conectar el controlador y la consulta por proyecto

Abre `TareaRepository.java` y añade la consulta derivada para obtener todas las tareas de un proyecto:

```java
// Spring Data navega automáticamente por la propiedad: proyecto.id
List<Tarea> findByProyectoId(Long proyectoId);
```

Ahora abre `ProyectoController.java`. Añade el subrecurso REST para consultar todas las tareas pertenecientes a un proyecto concreto:

```java
@GetMapping("/{id}/tareas")
public List<TareaResponse> listarTareasDelProyecto(@PathVariable Long id) {
    // 1. Asegurar que el proyecto existe
    proyectoService.obtener(id);

    // 2. Obtener las tareas del proyecto
    List<Tarea> tareas = tareaService.listarPorProyecto(id);

    // 3. Mapear a DTOs de respuesta
    return TareaMapper.aRespuestas(tareas);
}
```

### La comprobación · Navegación e integridad en acción

Arranca la aplicación y ejecuta las siguientes pruebas en tu cliente HTTP:

<p class="stage">1 · Crea un proyecto base</p>

```http
POST http://localhost:8080/proyectos
Content-Type: application/json

{
  "nombre": "Rediseño Portal Corporativo",
  "descripcion": "Migración a arquitectura por capas y PostgreSQL"
}
```
* Respuesta: `201 Created` con `"id": 1`.

<p class="stage">2 · Crea una tarea vinculada al proyecto 1</p>

```http
POST http://localhost:8080/tareas
Content-Type: application/json

{
  "titulo": "Configurar @ManyToOne en entidades",
  "prioridad": "ALTA",
  "proyectoId": 1
}
```
* Respuesta: `201 Created` con `"id": 1`, `"proyectoId": 1` y `"proyectoNombre": "Rediseño Portal Corporativo"`.
* Consola SQL de Hibernate:
```sql
Hibernate: 
    insert 
    into
        tareas
        (completada, prioridad, proyecto_id, titulo) 
    values
        (?, ?, ?, ?)
```
Observa cómo la columna `proyecto_id` se rellena con el valor `1`.

<p class="stage">3 · Intenta crear una tarea vinculada a un proyecto inexistente</p>

```http
POST http://localhost:8080/tareas
Content-Type: application/json

{
  "titulo": "Tarea fantasma",
  "prioridad": "BAJA",
  "proyectoId": 999
}
```
* Respuesta: `404 Not Found`.
* Cuerpo: `{"title": "Not Found", "status": 404, "detail": "No existe proyecto con id 999"}`.
* En la consola SQL **no se ejecuta ningún INSERT**. La integridad se preservó en la capa de negocio.

<p class="stage">4 · Consulta las tareas del proyecto</p>

Ejecuta `GET http://localhost:8080/proyectos/1/tareas`.
* Respuesta: `200 OK` con un array JSON que contiene la tarea creada.
* Consola SQL:
```sql
Hibernate: 
    select 
        t1_0.id,
        t1_0.completada,
        t1_0.prioridad,
        t1_0.proyecto_id,
        t1_0.titulo 
    from 
        tareas t1_0 
    where 
        t1_0.proyecto_id=?
```

### Ahora tú · Asignar un responsable a la tarea

Añade una segunda relación `@ManyToOne` para modelar qué usuario es el responsable de realizar una tarea:

1. Modifica `Tarea.java`:
   * Añade el atributo:
     ```java
     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "responsable_id") // nullable = true (puede nacer sin asignar)
     private Usuario responsable;
     ```
2. Modifica `TareaRequest` para admitir opcionalmente `Long responsableId`.
3. Modifica `TareaResponse` para incluir `responsableId` y `responsableNombre` (que serán `null` si la tarea no tiene responsable asignado).
4. En `TareaService`:
   * Si `request.responsableId()` no es nulo, busca el usuario mediante `UsuarioRepository` (lanzando `404` si no existe) y asígnalo con `tarea.setResponsable(usuario)`.
5. Añade a `TareaRepository`: `List<Tarea> findByResponsableId(Long responsableId);`.
6. Crea un usuario, asigna una tarea a ese usuario y comprueba que la columna `responsable_id` se persiste correctamente en PostgreSQL.

### Reto · La temida LazyInitializationException

Investiga el error más famoso del ecosistema Spring y Hibernate:

<p class="stage stage--solo">1 · La trampa del Proxy fuera de sesión</p>

Cuando configuras `fetch = FetchType.LAZY`, Hibernate no rellena `tarea.getProyecto()` con los datos reales; rellena el campo con un **Proxy** (un objeto intermediario generado dinámicamente con ByteBuddy que extiende `Proyecto`).
* Si intentas llamar a `tarea.getProyecto().getNombre()` cuando la transacción de base de datos ya está cerrada (por ejemplo, dentro del controlador o en una capa de serialización JSON que olvidó los DTOs), Hibernate intentará abrir una conexión para consultar los datos del proyecto.
* Como la sesión original ya se ha cerrado, Hibernate lanza la catastrófica:
  ```text
  org.hibernate.LazyInitializationException: 
  could not initialize proxy [com.ejemplo.gestor.model.Proyecto#1] - no Session
  ```
* Explica por qué el uso estricto de DTOs y mappers **dentro de la frontera transaccional del servicio** erradica este problema para siempre.
* Investiga qué es la propiedad `spring.jpa.open-in-view=true` (OSIV), por qué Spring Boot la trae activada por defecto para novatos y por qué en proyectos de alto rendimiento **se desactiva de forma inmediata**.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Relación <code>@ManyToOne</code> entre <code>Tarea</code> y <code>Proyecto</code> funcionando con <code>FetchType.LAZY</code> y FK verificada en PostgreSQL.</span></div>
  <div><strong>Si lo tienes</strong><span>Consulta de subrecurso <code>GET /proyectos/{id}/tareas</code> implementada, con DTOs planos y validación previa de existencia.</span></div>
  <div><strong>Reto</strong><span>Relación con <code>Usuario</code> completada y justificación técnica de la <code>LazyInitializationException</code> y los peligros de Open-In-View.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 35</p>
  <ul class="checklist">
    <li>Distingues el modelado procedimental con claves ajenas numéricas frente al modelado relacional con referencias a entidades.</li>
    <li>Comprendes qué significa «lado propietario» de una relación y por qué lleva la anotación <code>@JoinColumn</code>.</li>
    <li>Configuras siempre <code>FetchType.LAZY</code> en relaciones <code>@ManyToOne</code> para prevenir el problema de rendimiento N+1.</li>
    <li>Diseñas DTOs planos de petición y respuesta que desacoplan la estructura de la API de las relaciones internas de JPA.</li>
    <li>Validas la existencia de la entidad padre en el servicio antes de asociarla, evitando excepciones de base de datos no controladas.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿En qué tabla de la base de datos se ubica físicamente la columna de clave foránea en una relación <code>@ManyToOne</code>?</li>
    <li>¿Qué objeto coloca Hibernate en el atributo relacionado cuando una entidad se carga con <code>FetchType.LAZY</code>?</li>
    <li>¿Qué es el problema N+1 y qué valor de <code>FetchType</code> ayuda a combatirlo?</li>
    <li>¿Por qué se produce una <code>LazyInitializationException</code> al acceder a una relación fuera de una transacción?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · En la tabla del lado "muchos" (en nuestro caso, la columna <code>proyecto_id</code> dentro de la tabla <code>tareas</code>).</p>
  <p>2 · Un Proxy de Hibernate (una subclase generada por reflexión que solo contiene el identificador y carga los demás campos bajo demanda).</p>
  <p>3 · Es el problema de rendimiento que ocurre cuando consultar una lista de N elementos dispara N consultas SQL adicionales para cargar sus dependencias; se combate usando <code>FetchType.LAZY</code> o consultas con <code>JOIN FETCH</code>.</p>
  <p>4 · Porque se intenta acceder a los datos de un Proxy perezoso cuando la sesión de persistencia (conexión y transacción) que lo gestionaba ya ha sido cerrada.</p>
</details>

## Sesión 36 · Relaciones bidireccionales

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el peligro de desincronización en memoria con relaciones bidireccionales, los métodos de sincronización (<em>helper methods</em>) y cómo evitar el ciclo infinito de Jackson (<code>StackOverflowError</code>).</li>
    <li><strong>2. Haz:</strong> añade la colección de tareas a <code>Proyecto</code> mediante <code>@OneToMany(mappedBy = "proyecto")</code>, implementa <code>agregarTarea</code> y configura <code>orphanRemoval = true</code>.</li>
    <li><strong>3. Comprueba:</strong> agregas y desvinculas tareas directamente a través del proyecto padre, verificas el borrado físico de huérfanos en PostgreSQL y compruebas que los DTOs impiden cualquier recursión.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En una relación bidireccional entre <code>Proyecto</code> y <code>Tarea</code>, ¿qué significa el parámetro <code>mappedBy = "proyecto"</code> dentro de <code>@OneToMany</code>?</li>
    <li>Si ejecutas <code>tarea.setProyecto(p);</code> pero no haces <code>p.getTareas().add(tarea);</code>, ¿qué problema de coherencia ocurre si consultas <code>p.getTareas()</code> dentro de la misma transacción?</li>
    <li>¿Por qué la biblioteca Jackson se bloquea con un <code>StackOverflowError</code> si intentas serializar directamente entidades bidireccionales a JSON?</li>
  </ol>
</div>

### La ilusión de la bidireccionalidad

En un modelo relacional físico en PostgreSQL, **las relaciones bidireccionales no existen**. Solo existe una tabla con una columna de clave foránea (`tareas.proyecto_id`). Una fila de la tabla `tareas` sabe a qué proyecto apunta; la tabla `proyectos` no almacena ninguna lista de IDs ni sabe físicamente quién la apunta.

Sin embargo, en el paradigma orientado a objetos de Java, resulta muy intuitivo poder navegar en las dos direcciones:
* Saber a qué proyecto pertenece una tarea: `tarea.getProyecto().getNombre()`.
* Saber qué tareas tiene un proyecto: `proyecto.getTareas().size()`.

Para conseguir esta navegación inversa en Java sin crear tablas intermedias, añadimos en `Proyecto`:

```java
@OneToMany(mappedBy = "proyecto", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Tarea> tareas = new ArrayList<>();
```

<figure class="diagram">
  <figcaption>El lado inverso frente al lado propietario</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Proyecto (@OneToMany, mappedBy)</li>
    <li>Lado inverso (solo lectura de navegación)</li>
    <li>Tarea (@ManyToOne, @JoinColumn)</li>
    <li>Lado propietario (escribe la FK física)</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">El significado exacto de mappedBy</p>
  <p>El parámetro <code>mappedBy = "proyecto"</code> le dice a Hibernate: <em>«Yo soy el lado inverso. La clave foránea física no está en mi tabla; la gestiona el atributo llamado <code>proyecto</code> dentro de la clase <code>Tarea</code>»</em>.</p>
  <p>Cualquier modificación que hagas sobre la lista <code>tareas</code> de un proyecto será <strong>ignorada por la base de datos</strong> a menos que también se actualice la referencia <code>tarea.setProyecto(...)</code>.</p>
</div>

### La desincronización en memoria: la trampa de los dos punteros

Como en Java tenemos dos referencias independientes en memoria RAM, es facilísimo romper la coherencia de nuestro propio grafo de objetos:

```java
// CÓDIGO PELIGROSO: desincroniza la memoria
Tarea tarea = new Tarea("Nueva funcionalidad", "ALTA");
tarea.setProyecto(proyecto);
// ¡Olvidamos añadirla a la lista: proyecto.getTareas().add(tarea)!
```

Al terminar la transacción, Hibernate guardará la tarea en PostgreSQL porque el lado propietario (`tarea.setProyecto`) se actualizó. Pero si en esa misma transacción de negocio alguien consulta `proyecto.getTareas()`, **la nueva tarea no estará en la lista**. Tu aplicación dirá que el proyecto tiene 0 tareas cuando en la base de datos ya hay 1.

Para blindar nuestra entidad contra este fallo, **prohibimos manipular la lista directamente** e implementamos **métodos de sincronización (*Helper Methods*)**:

```java
@Entity
@Table(name = "proyectos")
public class Proyecto {

    // ... campos id, nombre, etc.

    @OneToMany(mappedBy = "proyecto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Tarea> tareas = new ArrayList<>();

    // Getter que devuelve una vista no modificable para proteger la encapsulación
    public List<Tarea> getTareas() {
        return Collections.unmodifiableList(tareas);
    }

    // Método helper de asociación bidireccional
    public void agregarTarea(Tarea tarea) {
        tareas.add(tarea);
        tarea.setProyecto(this);
    }

    // Método helper de desvinculación
    public void eliminarTarea(Tarea tarea) {
        tareas.remove(tarea);
        tarea.setProyecto(null);
    }
}
```

<dl class="worked">
  <dt><code>Collections.unmodifiableList(tareas)</code></dt>
  <dd>Evita que un programador despistado haga <code>proyecto.getTareas().add(tarea)</code> desde fuera sin actualizar la referencia inversa. Si alguien lo intenta, Java lanza de inmediato una <code>UnsupportedOperationException</code>.</dd>
  <dt><code>orphanRemoval = true</code></dt>
  <dd>Si sacas una tarea de la lista mediante <code>proyecto.eliminarTarea(t)</code>, Hibernate detecta que la tarea se ha quedado "huérfana" (ya no pertenece a su proyecto padre) y genera automáticamente un <code>DELETE FROM tareas WHERE id = ?</code> en PostgreSQL.</dd>
  <dt><code>cascade = CascadeType.ALL</code></dt>
  <dd>Propaga las operaciones del padre a los hijos: si persistes un proyecto nuevo que ya contiene tres tareas añadidas con <code>agregarTarea</code>, Hibernate guardará automáticamente el proyecto y las tres tareas en la misma transacción.</dd>
</dl>

### El monstruo de la recursión infinita: Jackson y StackOverflowError

Si devuelves entidades `@Entity` directamente en un `@RestController`, las relaciones bidireccionales provocarán una catástrofe garantizada:

```text
java.lang.StackOverflowError
    at com.fasterxml.jackson.databind.ser.BeanPropertyWriter.serializeAsField...
    at com.fasterxml.jackson.databind.ser.std.BeanSerializerBase.serializeFields...
```

¿Qué ha ocurrido?
1. Jackson empieza a serializar el `Proyecto` a JSON: escribe `id`, `nombre` y llega al campo `tareas`.
2. Para cada `Tarea` de la lista, empieza a escribir sus campos: `id`, `titulo` y llega a su campo `proyecto`.
3. Jackson serializa ese `Proyecto`: escribe sus campos y llega a `tareas`.
4. Jackson serializa cada `Tarea`... y entra en un bucle infinito que agota la pila de llamadas (*call stack*) de la JVM en un milisegundo.

<div class="rule">
  <p class="rule-label">Los DTOs eliminan la recursión de raíz</p>
  <p>Muchos tutoriales intentan parchear este problema llenando las entidades de anotaciones como <code>@JsonIgnore</code>, <code>@JsonManagedReference</code> o <code>@JsonBackReference</code>. Es una pésima solución que mezcla detalles de serialización HTTP dentro del modelo de persistencia.</p>
  <p>La solución arquitectónica correcta es la que venimos aplicando: <strong>las entidades jamás se serializan a JSON</strong>. El controlador devuelve DTOs planos diseñados para la vista, donde los ciclos no existen.</p>
</div>

### Paso 1 · Diseñar el DTO de detalle del proyecto

Diseñamos un DTO específico para consultar un proyecto junto al resumen de sus tareas:

```java
package com.ejemplo.gestor.dto;

import java.util.List;

public record ProyectoDetalleResponse(
    Long id,
    String nombre,
    String descripcion,
    boolean activo,
    int totalTareas,
    List<TareaResumenResponse> tareas
) {
    public record TareaResumenResponse(
        Long id,
        String titulo,
        String prioridad,
        boolean completada
    ) {}
}
```

Observa la clave del diseño: `TareaResumenResponse` **no incluye ninguna referencia a Proyecto**. El ciclo queda roto de forma natural y limpia.

### Paso 2 · Mapear y exponer en el Service y Controller

Actualiza `ProyectoMapper.java`:

```java
public static ProyectoDetalleResponse aDetalle(Proyecto proyecto) {
    List<ProyectoDetalleResponse.TareaResumenResponse> tareasResumen = proyecto.getTareas().stream()
            .map(t -> new ProyectoDetalleResponse.TareaResumenResponse(
                    t.getId(),
                    t.getTitulo(),
                    t.getPrioridad(),
                    t.isCompletada()))
            .toList();

    return new ProyectoDetalleResponse(
            proyecto.getId(),
            proyecto.getNombre(),
            proyecto.getDescripcion(),
            proyecto.isActivo(),
            tareasResumen.size(),
            tareasResumen
    );
}
```

En `ProyectoService.java`:

```java
@Transactional(readOnly = true)
public Proyecto obtenerConDetalle(Long id) {
    // Al estar dentro de @Transactional, la lista perezosa getTareas() se inicializa sin error
    Proyecto proyecto = obtener(id);
    // Forzamos la inicialización accediendo al tamaño mientras la sesión está abierta
    proyecto.getTareas().size();
    return proyecto;
}
```

En `ProyectoController.java`:

```java
@GetMapping("/{id}/detalle")
public ProyectoDetalleResponse obtenerDetalle(@PathVariable Long id) {
    Proyecto proyecto = servicio.obtenerConDetalle(id);
    return ProyectoMapper.aDetalle(proyecto);
}
```

### La comprobación · El ciclo sin recursión y el borrado de huérfanos

Arranca la aplicación y ejecuta las siguientes pruebas:

<p class="stage">1 · Consulta el detalle de un proyecto con tareas</p>

Ejecuta `GET http://localhost:8080/proyectos/1/detalle`.

Respuesta limpia `200 OK` sin recursión ni errores:

```json
{
  "id": 1,
  "nombre": "Rediseño Portal Corporativo",
  "descripcion": "Migración a arquitectura por capas y PostgreSQL",
  "activo": true,
  "totalTareas": 2,
  "tareas": [
    {
      "id": 1,
      "titulo": "Configurar @ManyToOne en entidades",
      "prioridad": "ALTA",
      "completada": false
    },
    {
      "id": 2,
      "titulo": "Escribir tests con @DataJpaTest",
      "prioridad": "MEDIA",
      "completada": true
    }
  ]
}
```

<p class="stage">2 · Comprueba el borrado automático de huérfanos</p>

Añade en `ProyectoService` un caso de uso para desvincular una tarea:

```java
@Transactional
public void desvincularTarea(Long proyectoId, Long tareaId) {
    Proyecto proyecto = obtener(proyectoId);
    Tarea tarea = tareaRepo.findById(tareaId)
            .orElseThrow(() -> new RecursoNoEncontradoException("tarea", tareaId));

    // Usamos el helper method: saca la tarea de la lista y pone su proyecto a null
    proyecto.eliminarTarea(tarea);
    // Al salir de la transacción con orphanRemoval = true, Hibernate genera el DELETE
}
```

Añade el endpoint en `ProyectoController`:
```java
@DeleteMapping("/{id}/tareas/{tareaId}")
public ResponseEntity<Void> desvincularTarea(
        @PathVariable Long id, 
        @PathVariable Long tareaId) {
    servicio.desvincularTarea(id, tareaId);
    return ResponseEntity.noContent().build();
}
```

Ejecuta `DELETE http://localhost:8080/proyectos/1/tareas/2`.
* Respuesta: `204 No Content`.
* Consola SQL de Hibernate:
```sql
Hibernate: 
    delete 
    from
        tareas 
    where
        id=?
```
* Abre tu cliente de base de datos (`psql` o DBeaver) y ejecuta `SELECT * FROM tareas WHERE id = 2;`: la fila ha desaparecido. El mecanismo de `orphanRemoval` ha limpiado la base de datos automáticamente.

### Ahora tú · Operaciones de lote sobre el proyecto

Implementa en `ProyectoService` y `ProyectoController` un caso de uso para crear un proyecto junto a un lote inicial de tareas en una sola petición HTTP:

1. Crea el DTO `ProyectoConTareasRequest`:
   ```java
   public record ProyectoConTareasRequest(
       @NotBlank String nombre,
       String descripcion,
       List<String> titulosTareasIniciales
   ) {}
   ```
2. En `ProyectoService.crearConTareas(...)`:
   * Instancia el nuevo `Proyecto`.
   * Itera sobre la lista de títulos recibidos creando cada `Tarea` y añadiéndola con `proyecto.agregarTarea(nuevaTarea)`.
   * Llama a `proyectoRepo.save(proyecto)`.
   * Gracias a `cascade = CascadeType.ALL`, comprueba que Hibernate genera el `INSERT` del proyecto y a continuación todos los `INSERT` de las tareas asociadas.
3. Expón el endpoint `POST /proyectos/con-tareas` devolviendo `201 Created` y verifica en PostgreSQL que todas las filas se han insertado en una única transacción atómica.

### Reto · equals() y hashCode() en entidades JPA

Investiga uno de los temas más debatidos de la ingeniería Java:

<p class="stage stage--solo">1 · La trampa del @Id en el hashCode()</p>

Muchos desarrolladores generan los métodos `equals()` y `hashCode()` basándose en el atributo `id`:

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Tarea tarea)) return false;
    return id != null && id.equals(tarea.id);
}

@Override
public int hashCode() {
    return getClass().hashCode();
}
```

* Imagina que creas una tarea nueva: `Tarea t = new Tarea("Login", "ALTA");`. Su `id` es `null`.
* Metes esa tarea en un `Set<Tarea> pendientes = new HashSet<>(); pendientes.add(t);`.
* Persistes la tarea en la base de datos: `em.persist(t); em.flush();`. Ahora PostgreSQL le ha asignado `id = 1L`.
* ¿Qué ocurre si ejecutas `pendientes.contains(t)` si el `hashCode()` dependía del `id`? El objeto sigue estando en el conjunto, pero **Java ya no lo encuentra** porque su código hash cambió de valor mientras estaba dentro de la tabla hash.
* Investiga la recomendación oficial de Hibernate: ¿por qué se recomienda mantener un `hashCode()` constante basado en la clase o en una clave de negocio natural inmutable (*Natural Business Key*)?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Relación bidireccional entre <code>Proyecto</code> y <code>Tarea</code> con <code>mappedBy</code>, helper methods y DTO de detalle funcionando.</span></div>
  <div><strong>Si lo tienes</strong><span>Desvinculación con <code>orphanRemoval = true</code> eliminando la fila en PostgreSQL mediante <code>DELETE</code>.</span></div>
  <div><strong>Reto</strong><span>Creación en cascada de proyecto con tareas iniciales en una transacción y análisis técnico de <code>equals/hashCode</code> con IDs mutables.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 36</p>
  <ul class="checklist">
    <li>Comprendes que en PostgreSQL las relaciones bidireccionales no existen y que <code>mappedBy</code> marca el lado inverso de lectura.</li>
    <li>Utilizas métodos helper (<code>agregarTarea</code>, <code>eliminarTarea</code>) para garantizar que la memoria RAM y la base de datos no diverjan.</li>
    <li>Proteges la colección interna devolviendo <code>Collections.unmodifiableList</code> en el getter de la entidad padre.</li>
    <li>Comprendes la diferencia entre <code>cascade = REMOVE</code> y <code>orphanRemoval = true</code>.</li>
    <li>Utilizas DTOs específicos para respuestas compuestas, erradicando el problema de recursión infinita de Jackson (<code>StackOverflowError</code>).</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué una relación en la base de datos solo necesita una columna física mientras que en Java necesitamos gestionar dos referencias?</li>
    <li>¿Qué ocurre si añades una tarea a la lista <code>proyecto.getTareas()</code> pero no ejecutas <code>tarea.setProyecto(proyecto)</code>?</li>
    <li>¿Qué hace la opción <code>orphanRemoval = true</code> cuando eliminas un elemento de una colección gestionada?</li>
    <li>¿Cómo solucionan los DTOs el error <code>StackOverflowError</code> al serializar relaciones bidireccionales?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque en el modelo relacional cualquier fila puede asociarse con otra buscando por su clave foránea en cualquier dirección con una cláusula JOIN, mientras que en Java la navegación entre punteros en memoria es estrictamente unidireccional.</p>
  <p>2 · Que la base de datos nunca se enterará del cambio, porque el lado propietario que mapea la clave foránea física (Tarea.proyecto) no fue actualizado.</p>
  <p>3 · Emite automáticamente una sentencia SQL DELETE para borrar físicamente de la tabla la entidad hija que ha dejado de pertenecer a la colección del padre.</p>
  <p>4 · Porque los DTOs de salida aplanan los datos y no incluyen referencias circulares hacia la entidad contenedora, rompiendo el ciclo de inspección de Jackson.</p>
</details>

## Semana 13 · JPA más allá del tutorial

## Sesión 37 · ManyToMany

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> cómo modelar relaciones muchos-a-muchos con <code>@ManyToMany</code> y <code>@JoinTable</code>, por qué debes usar <code>Set</code> en lugar de <code>List</code> y el criterio exacto para descomponer en una entidad intermedia.</li>
    <li><strong>2. Haz:</strong> implementa la entidad <code>Etiqueta</code>, asóciala a <code>Tarea</code> mediante una colección de valores únicos y expón la gestión de etiquetas en la API REST.</li>
    <li><strong>3. Comprueba:</strong> asignas y desasignas etiquetas desde HTTP, auditas en PostgreSQL la tabla puente <code>tareas_etiquetas</code> y compruebas que el borrado de tareas nunca destruye las etiquetas maestras.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En una base de datos relacional, ¿cómo se implementa físicamente una relación N:M entre tareas y etiquetas?</li>
    <li>¿Por qué en JPA se recomienda enfáticamente usar <code>Set&lt;Etiqueta&gt;</code> en lugar de <code>List&lt;Etiqueta&gt;</code> en relaciones muchos-a-muchos?</li>
    <li>Si la asociación entre una tarea y una etiqueta necesita registrar la fecha en que se asignó, ¿por qué deja de servir la anotación <code>@ManyToMany</code> directa?</li>
  </ol>
</div>

### La tabla puente en el modelo relacional

En las sesiones anteriores vimos cómo una relación uno-a-muchos se resuelve fácilmente añadiendo una columna de clave foránea en la tabla hija (`tareas.proyecto_id`).

Sin embargo, en el mundo real las relaciones suelen ser muchos-a-muchos:
* Una tarea puede tener múltiples etiquetas (`"urgente"`, `"seguridad"`, `"backend"`).
* Una misma etiqueta puede estar aplicada a cientos de tareas distintas.

En el álgebra relacional de PostgreSQL **es físicamente imposible almacenar una lista de claves foráneas dentro de una columna**. Para resolver una relación N:M, el motor necesita una tercera tabla: la **tabla puente** o **tabla de unión** (*Join Table*).

<figure class="diagram">
  <figcaption>Estructura física de una relación N:M en PostgreSQL</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Tabla tareas (PK id)</li>
    <li>Tabla tareas_etiquetas (FK tarea_id, FK etiqueta_id)</li>
    <li>Tabla etiquetas (PK id)</li>
  </ol>
</figure>

```sql
CREATE TABLE tareas_etiquetas (
    tarea_id BIGINT NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
    etiqueta_id BIGINT NOT NULL REFERENCES etiquetas(id) ON DELETE RESTRICT,
    PRIMARY KEY (tarea_id, etiqueta_id)
);
```

La clave primaria de la tabla puente es una clave compuesta formada por los dos identificadores, garantizando que una tarea no pueda tener la misma etiqueta duplicada dos veces.

### El mapeo en JPA: @ManyToMany y @JoinTable

En JPA modelamos esta relación utilizando la anotación `@ManyToMany`.

<p class="stage">1 · La entidad Etiqueta (lado inverso)</p>

Creamos la entidad maestra para las etiquetas:

```java
package com.ejemplo.gestor.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "etiquetas")
public class Etiqueta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String nombre;

    @Column(nullable = false, length = 7)
    private String colorHex; // Ej: "#FF5733"

    @ManyToMany(mappedBy = "etiquetas")
    private Set<Tarea> tareas = new HashSet<>();

    public Etiqueta() {}

    public Etiqueta(String nombre, String colorHex) {
        this.nombre = nombre;
        this.colorHex = colorHex;
    }

    // Getters y setters
}
```

<p class="stage">2 · La entidad Tarea (lado propietario)</p>

En `Tarea.java`, configuramos el lado propietario declarando cómo se llama la tabla puente y sus columnas:

```java
@ManyToMany(fetch = FetchType.LAZY)
@JoinTable(
    name = "tareas_etiquetas",
    joinColumns = @JoinColumn(name = "tarea_id"),
    inverseJoinColumns = @JoinColumn(name = "etiqueta_id")
)
private Set<Etiqueta> etiquetas = new HashSet<>();

public Set<Etiqueta> getEtiquetas() {
    return Collections.unmodifiableSet(etiquetas);
}

public void agregarEtiqueta(Etiqueta etiqueta) {
    this.etiquetas.add(etiqueta);
    etiqueta.getTareas().add(this);
}

public void quitarEtiqueta(Etiqueta etiqueta) {
    this.etiquetas.remove(etiqueta);
    etiqueta.getTareas().remove(this);
}
```

<dl class="worked">
  <dt><code>joinColumns</code></dt>
  <dd>Especifica la columna de la tabla puente que apunta a la entidad actual (<code>tarea_id</code> hacia <code>tareas.id</code>).</dd>
  <dt><code>inverseJoinColumns</code></dt>
  <dd>Especifica la columna de la tabla puente que apunta a la otra entidad (<code>etiqueta_id</code> hacia <code>etiquetas.id</code>).</dd>
</dl>

### Por qué usamos Set y NUNCA List en ManyToMany

Este es otro de los errores más costosos de rendimiento en aplicaciones Spring Boot con JPA:

```java
// ANTIPATRÓN GRAVE: usar List en @ManyToMany
private List<Etiqueta> etiquetas = new ArrayList<>();
```

Si usas `List`, la especificación de Hibernate no puede saber qué fila concreta ha cambiado porque una lista permite elementos repetidos y depende de índices posicionales.

¿Qué hace Hibernate cuando tienes 20 etiquetas en una tarea y eliminas una?
1. Ejecuta: `DELETE FROM tareas_etiquetas WHERE tarea_id = 5;` (¡borra todas las 20 filas de golpe!).
2. A continuación, ejecuta 19 sentencias `INSERT` una a una para reinsertar las que quedaban.

Al cambiar a `Set<Etiqueta>`, Hibernate sabe que los elementos son matemáticamente únicos y emite únicamente:
```sql
DELETE FROM tareas_etiquetas WHERE tarea_id = 5 AND etiqueta_id = 2;
```
Una sola sentencia atómica y eficiente.

<div class="rule">
  <p class="rule-label">La regla de oro de las colecciones N:M</p>
  <p><strong>En relaciones <code>@ManyToMany</code> se utiliza siempre <code>Set</code> y nunca <code>List</code>.</strong></p>
  <p>Además, inicializa siempre la colección directamente en la declaración del atributo (<code>= new HashSet&lt;&gt;()</code>) para evitar excepciones <code>NullPointerException</code> al acceder a entidades recién instanciadas.</p>
</div>

### El peligro mortal: CascadeType.REMOVE en ManyToMany

En la sesión anterior aprendimos que un `Proyecto` puede tener `cascade = CascadeType.ALL` sobre sus tareas porque si el proyecto se destruye, sus tareas pierden sentido.

En una relación `@ManyToMany`, **el borrado en cascada está terminantemente prohibido**:

```java
// PELIGRO: NUNCA hagas esto en @ManyToMany
@ManyToMany(cascade = CascadeType.ALL) // o CascadeType.REMOVE
private Set<Etiqueta> etiquetas;
```

¿Qué ocurriría si borras una tarea que tenía la etiqueta `"BUG"`? Hibernate interpretaría que debe propagar el borrado y ejecutaría:
`DELETE FROM etiquetas WHERE nombre = 'BUG';`

¡Acabarías borrando la etiqueta del catálogo maestro de la empresa, rompiendo todas las demás tareas del sistema que compartían esa misma etiqueta!

### El dilema arquitectónico: ¿Relación directa o Entidad Intermedia?

La anotación `@ManyToMany` directa solo sirve bajo una condición muy estricta: **cuando la relación no contiene ningún dato adicional aparte de los dos IDs**.

| Escenario | Solución JPA | Ejemplo en el mundo real |
| :--- | :--- | :--- |
| **Asociación pura sin atributos** | `@ManyToMany` directo con `@JoinTable`. | Tareas y Etiquetas, Usuarios y Roles de seguridad. |
| **Asociación con atributos propios** | **Entidad intermedia** con dos relaciones `@ManyToOne`. | Inscripción de Alumnos en Cursos (con `fecha_matricula`, `calificacion`), Asignación de Tareas a Empleados (con `horas_estimadas`, `rol_desempenado`). |

Si tu tabla puente necesita columnas como `creado_en`, `prioridad_etiqueta` o `asignado_por`, debes crear una entidad Java intermedia completa (por ejemplo, `TareaEtiqueta`).

### Paso 1 · Crear EtiquetaRepository y Servicio

Crea `EtiquetaRepository.java`:

```java
package com.ejemplo.gestor.repository;

import com.ejemplo.gestor.model.Etiqueta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EtiquetaRepository extends JpaRepository<Etiqueta, Long> {
    Optional<Etiqueta> findByNombreIgnoreCase(String nombre);
    boolean existsByNombreIgnoreCase(String nombre);
}
```

En `TareaService.java`, implementamos el caso de uso para etiquetar una tarea:

```java
@Transactional
public Tarea asignarEtiqueta(Long tareaId, Long etiquetaId) {
    Tarea tarea = obtener(tareaId);
    Etiqueta etiqueta = etiquetaRepo.findById(etiquetaId)
            .orElseThrow(() -> new RecursoNoEncontradoException("etiqueta", etiquetaId));

    tarea.agregarEtiqueta(etiqueta);
    return tarea; // El dirty checking guardará la fila en tareas_etiquetas
}

@Transactional
public Tarea desasignarEtiqueta(Long tareaId, Long etiquetaId) {
    Tarea tarea = obtener(tareaId);
    Etiqueta etiqueta = etiquetaRepo.findById(etiquetaId)
            .orElseThrow(() -> new RecursoNoEncontradoException("etiqueta", etiquetaId));

    tarea.quitarEtiqueta(etiqueta);
    return tarea;
}
```

### Paso 2 · Exponer en DTOs y Controladores

Actualizamos `TareaResponse` para incluir el listado de nombres de etiquetas:

```java
public record TareaResponse(
    Long id,
    String titulo,
    String prioridad,
    boolean completada,
    Long proyectoId,
    String proyectoNombre,
    Set<String> etiquetas
) {}
```

Añadimos en `TareaController.java` los endpoints de asociación:

```java
@PostMapping("/{id}/etiquetas/{etiquetaId}")
public TareaResponse agregarEtiqueta(
        @PathVariable Long id, 
        @PathVariable Long etiquetaId) {
    Tarea actualizada = servicio.asignarEtiqueta(id, etiquetaId);
    return TareaMapper.aRespuesta(actualizada);
}

@DeleteMapping("/{id}/etiquetas/{etiquetaId}")
public ResponseEntity<Void> quitarEtiqueta(
        @PathVariable Long id, 
        @PathVariable Long etiquetaId) {
    servicio.desasignarEtiqueta(id, etiquetaId);
    return ResponseEntity.noContent().build();
}
```

### La comprobación · El ciclo N:M en PostgreSQL

Arranca la aplicación y ejecuta las siguientes pruebas:

<p class="stage">1 · Crea dos etiquetas en el catálogo</p>

```http
POST http://localhost:8080/etiquetas
Content-Type: application/json

{
  "nombre": "backend",
  "colorHex": "#3498DB"
}
```

```http
POST http://localhost:8080/etiquetas
Content-Type: application/json

{
  "nombre": "urgente",
  "colorHex": "#E74C3C"
}
```

<p class="stage">2 · Asocia ambas etiquetas a la tarea 1</p>

Ejecuta:
* `POST http://localhost:8080/tareas/1/etiquetas/1`
* `POST http://localhost:8080/tareas/1/etiquetas/2`

Observa la consola de Spring Boot:
```sql
Hibernate: 
    insert 
    into
        tareas_etiquetas
        (tarea_id, etiqueta_id) 
    values
        (?, ?)
```

La respuesta HTTP devuelve:
```json
{
  "id": 1,
  "titulo": "Configurar @ManyToOne en entidades",
  "etiquetas": ["backend", "urgente"]
}
```

<p class="stage">3 · Verifica la tabla puente en PostgreSQL</p>

Ejecuta en tu cliente SQL:
```sql
SELECT * FROM tareas_etiquetas;
```
Verás dos filas: `(1, 1)` y `(1, 2)`.

<p class="stage">4 · Comprueba el borrado seguro</p>

Borra la tarea 1 con `DELETE http://localhost:8080/tareas/1`.
* En PostgreSQL, la tabla intermedia `tareas_etiquetas` se limpia automáticamente.
* Ejecuta `SELECT * FROM etiquetas;`: **las etiquetas "backend" y "urgente" siguen existiendo intactas**.

### Ahora tú · Filtrar tareas por etiqueta

Implementa la búsqueda de tareas asociadas a una etiqueta concreta:

1. Añade a `TareaRepository`:
   ```java
   // Spring Data realiza el JOIN automático entre tareas y etiquetas
   List<Tarea> findByEtiquetasNombreIgnoreCase(String nombreEtiqueta);
   ```
2. Añade en `TareaService` el método `buscarPorEtiqueta(String nombre)`.
3. Conéctalo al endpoint `GET /tareas?etiqueta=urgente`.
4. Comprueba en la consola SQL que Hibernate genera una sentencia `INNER JOIN tareas_etiquetas` y `INNER JOIN etiquetas` con la condición `WHERE LOWER(etiquetas.nombre) = LOWER(?)`.

### Reto · La entidad intermedia con clave compuesta

Investiga cómo resolver el caso en el que la relación N:M necesita atributos de negocio propios:

<p class="stage stage--solo">1 · Diseñar la entidad Asignacion con @EmbeddedId</p>

Imagina que una etiqueta no solo se asocia a una tarea, sino que debemos guardar `LocalDateTime fechaAsignacion` y `String motivo`:
* ¿Por qué una anotación `@ManyToMany` directa es totalmente incapaz de persistir esos dos campos en la tabla intermedia?
* Investiga cómo se diseña este modelo mediante una entidad intermedia:
  1. La clase `@Embeddable TareaEtiquetaId` que agrupa `Long tareaId` y `Long etiquetaId`.
  2. La entidad `@Entity TareaEtiqueta` con `@EmbeddedId TareaEtiquetaId id` y dos relaciones `@ManyToOne @MapsId`.
* Explica qué ventaja tiene este patrón de descomposición frente al `@ManyToMany` simple y por qué en proyectos empresariales grandes es el estándar dominante.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Entidad <code>Etiqueta</code> creada y vinculada con <code>@ManyToMany</code> y <code>@JoinTable</code> a <code>Tarea</code> usando <code>Set</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Asignación y desasignación funcionando por HTTP, DTOs con etiquetas y consulta filtrada por nombre de etiqueta.</span></div>
  <div><strong>Reto</strong><span>El diseño conceptual de la entidad intermedia descompuesta con <code>@EmbeddedId</code> documentado y justificado.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 37</p>
  <ul class="checklist">
    <li>Comprendes la necesidad física de una tabla puente (<em>Join Table</em>) para modelar relaciones N:M en PostgreSQL.</li>
    <li>Mapeas relaciones bidireccionales muchos-a-muchos con <code>@ManyToMany</code>, <code>@JoinTable</code> y <code>mappedBy</code>.</li>
    <li>Utilizas <code>Set</code> en lugar de <code>List</code> para evitar que Hibernate destruya y reescriba todas las filas de la tabla puente.</li>
    <li>Evitas el uso de <code>CascadeType.REMOVE</code> en relaciones N:M para proteger el ciclo de vida independiente de las entidades maestras.</li>
    <li>Conoces el criterio arquitectónico para decidir cuándo una relación N:M requiere descomponerse en una entidad intermedia.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué columnas mínimas forman la clave primaria compuesta de una tabla puente N:M?</li>
    <li>¿Qué problema de rendimiento provoca usar <code>List</code> en lugar de <code>Set</code> en una relación <code>@ManyToMany</code> al eliminar un elemento?</li>
    <li>¿Por qué nunca se debe configurar <code>CascadeType.REMOVE</code> en una colección <code>@ManyToMany</code> de etiquetas?</li>
    <li>¿En qué momento es obligatorio sustituir un <code>@ManyToMany</code> directo por dos relaciones <code>@ManyToOne</code> con una entidad intermedia?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Las dos columnas de clave foránea que apuntan a las claves primarias de cada una de las tablas relacionadas (ej: <code>tarea_id</code> y <code>etiqueta_id</code>).</p>
  <p>2 · Provoca que Hibernate elimine todas las filas de la tabla puente correspondientes a la entidad y las vuelva a insertar todas de nuevo una a una.</p>
  <p>3 · Porque al borrar una tarea hija se eliminarían también las etiquetas maestras asociadas, rompiendo las demás tareas que estuvieran usando esa misma etiqueta.</p>
  <p>4 · En el momento en que la relación necesita almacenar atributos propios de negocio (como fecha de asignación, usuario que asignó, rol o estado del vínculo).</p>
</details>

## Sesión 38 · Transacciones e integridad

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> cómo funcionan las propiedades ACID en una aplicación web real, cómo actúa el proxy dinámico de <code>@Transactional</code> y qué excepciones disparan un <code>ROLLBACK</code>.</li>
    <li><strong>2. Haz:</strong> implementa un caso de uso atómico multioperación (clonar un proyecto con todas sus tareas) que se confirma íntegro o se deshace por completo.</li>
    <li><strong>3. Comprueba:</strong> fuerzas un error simulado a mitad del proceso, verificas en PostgreSQL que no queda ni un solo registro residual y analizas la trampa de la autoinvocación.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué significa que una operación sobre una base de datos sea atómica?</li>
    <li>¿Qué tipos de excepciones de Java provocan un <code>ROLLBACK</code> automático por defecto al usar <code>@Transactional</code> en Spring Boot?</li>
    <li>Si un método no transaccional llama a otro método de su misma clase anotado con <code>@Transactional</code>, ¿se abre una transacción en la base de datos?</li>
  </ol>
</div>

### El peligro del estado corrompido

En una aplicación empresarial, los casos de uso rara vez consisten en guardar una sola fila. Observa este escenario habitual:

> **Caso de uso:** *Archivar un proyecto obsoleto y reasignar sus 50 tareas pendientes al proyecto de mantenimiento general.*

Imagina qué ocurre si este proceso se ejecuta sin una transacción atómica:
1. La aplicación actualiza el proyecto obsoleto: `activo = false`. (PostgreSQL lo guarda).
2. Empieza a reasignar las 50 tareas una a una.
3. Al llegar a la tarea 23, se corta la conexión de red con el servidor, salta una excepción de validación o se agota la memoria.

El resultado es devastador: **tu base de datos ha quedado corrompida**. El proyecto figura como cerrado, 22 tareas están en mantenimiento, pero las otras 28 se han quedado en un limbo inaccesible. Reparar esa incoherencia a mano exigirá horas de auditoría forense con scripts SQL.

### Las propiedades ACID explicadas para desarrolladores

Una transacción relacional es un escudo que garantiza cuatro propiedades matemáticas fundamentales:

<figure class="diagram">
  <figcaption>Las cuatro propiedades ACID</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Atomicidad (todo o nada)</li>
    <li>Consistencia (reglas e invariantes)</li>
    <li>Aislamiento (sin interferencias)</li>
    <li>Durabilidad (persistido en disco)</li>
  </ol>
</figure>

| Propiedad | Qué significa en la práctica |
| :--- | :--- |
| **A · Atomicidad (*Atomicity*)** | **Todo o nada.** O todas las modificaciones del caso de uso se consolidan en PostgreSQL (`COMMIT`), o si una sola falla, la base de datos revierte todas las escrituras (`ROLLBACK`), dejándola exactamente como estaba al empezar. |
| **C · Consistencia (*Consistency*)** | La transacción lleva a la base de datos de un estado válido a otro estado válido, respetando todas las claves primarias, foráneas, tipos y restricciones de integridad. |
| **I · Aislamiento (*Isolation*)** | Dos usuarios ejecutando operaciones concurrentes no ven los cambios a medio cocinar del otro hasta que la transacción se haya confirmado definitivamente. |
| **D · Durabilidad (*Durability*)** | Una vez recibido el `COMMIT`, los datos quedan registrados en el disco (en el archivo WAL de PostgreSQL). Si se corta la corriente eléctrica un milisegundo después, los datos no se perderán. |

### Cómo funciona @Transactional por dentro

Cuando anotas una clase o método con `@Transactional`, Spring **no modifica tu código Java**. En su lugar, utiliza el patrón **Proxy Dinámico** (AOP):

```text
Petición HTTP → Controlador → [ PROXY DE SPRING ] → Tu TareaService
                                      │
                         1. connection.setAutoCommit(false)
                         2. Ejecuta tu método de servicio
                         3. ¿Terminó bien? → connection.commit()
                         4. ¿Lanzó error?  → connection.rollback()
```

<div class="rule">
  <p class="rule-label">La trampa mortal de las excepciones comprobadas</p>
  <p>Por defecto en Spring, <strong><code>@Transactional</code> solo ejecuta ROLLBACK ante excepciones no comprobadas (subclases de <code>RuntimeException</code> y errores <code>Error</code>)</strong>.</p>
  <p>Si tu método lanza una excepción comprobada (como <code>IOException</code>, <code>SQLException</code> o cualquier clase que herede directamente de <code>Exception</code>), Spring asume que es una condición de negocio recuperable y <strong>¡ejecuta COMMIT!</strong></p>
  <p>Para protegerte ante cualquier fallo inesperado, acostumbra a especificar:
  <code>@Transactional(rollbackFor = Exception.class)</code>.</p>
</div>

### La trampa de la autoinvocación (Self-Invocation Problem)

Mira este código con atención. Contiene un error silencioso muy común:

```java
@Service
public class ProyectoService {

    public void procesoPublico() {
        // ... tareas previas ...
        this.operacionCritica(); // ¡PELIGRO!
    }

    @Transactional
    public void operacionCritica() {
        // Varias escrituras en base de datos
    }
}
```

¿Qué ocurre al ejecutar `procesoPublico()`?
* Como `procesoPublico()` no tiene `@Transactional`, el controlador llama directamente al servicio.
* Al invocar `this.operacionCritica()`, la llamada se resuelve mediante el puntero `this` interno de Java, **saltándose por completo el proxy de Spring**.
* El código de `operacionCritica()` se ejecutará **sin ninguna transacción**. Cada instrucción SQL se confirmará por separado en modo autocommit.

**Regla:** para que `@Transactional` funcione, la llamada debe entrar desde un bean externo inyectado por Spring.

### Paso 1 · Implementar el caso multioperación «Clonar Proyecto»

Vamos a crear un caso de uso completo en `ProyectoService`: clonar un proyecto existente duplicando todas sus tareas asociadas con una nueva identidad:

```java
@Transactional(rollbackFor = Exception.class)
public Proyecto clonarProyecto(Long idOriginal, String nuevoNombre) {
    // 1. Obtener el proyecto original con sus tareas
    Proyecto original = obtener(idOriginal);

    // 2. Validar regla de negocio: el nombre del nuevo proyecto debe ser único
    if (proyectoRepo.existsByNombreIgnoreCase(nuevoNombre)) {
        throw new ReglaDeNegocioException("Ya existe un proyecto con el nombre: " + nuevoNombre);
    }

    // 3. Crear la nueva entidad padre
    Proyecto clon = new Proyecto(nuevoNombre, "Clon de " + original.getNombre());
    Proyecto clonGuardado = proyectoRepo.save(clon);

    // 4. Duplicar cada una de las tareas del proyecto original
    List<Tarea> tareasOriginales = tareaRepo.findByProyectoId(idOriginal);

    for (Tarea tareaOriginal : tareasOriginales) {
        // Simulador de fallo: si una tarea contiene "FALLO_TEST", abortamos
        if (tareaOriginal.getTitulo().contains("FALLO_TEST")) {
            throw new ReglaDeNegocioException("Error simulado: abortando clonación de emergencia");
        }

        Tarea nuevaTarea = new Tarea(
                tareaOriginal.getTitulo() + " (Copia)",
                tareaOriginal.getPrioridad()
        );
        nuevaTarea.setProyecto(clonGuardado);
        nuevaTarea.setCompletada(false);
        tareaRepo.save(nuevaTarea);
    }

    return clonGuardado;
}
```

<dl class="worked">
  <dt>Por qué este método debe ser estrictamente atómico</dt>
  <dd>Si el proyecto original tiene 10 tareas y la séptima tarea provoca la excepción, la transacción aborta. PostgreSQL revierte el <code>INSERT</code> del nuevo proyecto y los seis <code>INSERT</code> de las tareas previas. No queda ninguna fila huérfana en la base de datos.</dd>
</dl>

### Paso 2 · Conectar el endpoint en ProyectoController

Añadimos el endpoint POST para disparar la clonación:

```java
@PostMapping("/{id}/clonar")
public ResponseEntity<ProyectoResponse> clonar(
        @PathVariable Long id,
        @RequestParam String nuevoNombre) {
    Proyecto clonado = servicio.clonarProyecto(id, nuevoNombre);
    return ResponseEntity.status(HttpStatus.CREATED).body(ProyectoMapper.aRespuesta(clonado));
}
```

### La comprobación · El experimento del ROLLBACK real

Arranca la aplicación y ejecuta las dos pruebas siguientes:

<p class="stage">1 · Prueba el caso de éxito</p>

1. Asegúrate de que el proyecto 1 tiene dos tareas normales (sin la palabra clave de error).
2. Ejecuta la petición:
   ```http
   POST http://localhost:8080/proyectos/1/clonar?nuevoNombre=Proyecto+Clonado+OK
   ```
3. Respuesta: `201 Created` con el nuevo proyecto.
4. Consulta en PostgreSQL:
   ```sql
   SELECT * FROM proyectos WHERE nombre = 'Proyecto Clonado OK';
   SELECT * FROM tareas WHERE proyecto_id = (SELECT id FROM proyectos WHERE nombre = 'Proyecto Clonado OK');
   ```
   Verás el proyecto nuevo y sus dos tareas duplicadas con la coletilla `(Copia)`.

<p class="stage">2 · Provoca el fallo atómico</p>

1. Añade a propósito una tarea al proyecto 1 con el título problemático:
   ```http
   POST http://localhost:8080/tareas
   Content-Type: application/json

   {
     "titulo": "Tarea con FALLO_TEST para provocar rollback",
     "prioridad": "ALTA",
     "proyectoId": 1
   }
   ```
2. Ahora intenta clonar el proyecto 1 pidiendo crear `"Proyecto Destinado al Fracaso"`:
   ```http
   POST http://localhost:8080/proyectos/1/clonar?nuevoNombre=Proyecto+Destinado+al+Fracaso
   ```
3. La aplicación lanza la excepción y responde con un código `400 Bad Request` (o el manejador de tu API):
   ```json
   {
     "error": "Regla de negocio violada",
     "detail": "Error simulado: abortando clonación de emergencia"
   }
   ```
4. **La prueba de fuego en PostgreSQL:** abre tu cliente SQL y comprueba:
   ```sql
   SELECT * FROM proyectos WHERE nombre = 'Proyecto Destinado al Fracaso';
   ```
   **Resultado:** `0 filas`.
   PostgreSQL deshizo el proyecto nuevo y todas las tareas que se habían insertado antes de saltar la excepción. La base de datos está perfectamente limpia y coherente.

### Ahora tú · Transferencia atómica de tareas entre proyectos

Implementa en `ProyectoService` un caso de uso para transferir todas las tareas de un proyecto a otro:

1. Método: `transferirTareas(Long origenId, Long destinoId)` anotado con `@Transactional(rollbackFor = Exception.class)`.
2. Reglas de negocio a comprobar:
   * El proyecto de origen debe existir.
   * El proyecto de destino debe existir.
   * El proyecto de destino **debe estar activo** (`destino.isActivo()`). Si está inactivo, lanza una `ReglaDeNegocioException("No se pueden transferir tareas a un proyecto inactivo")`.
3. Si la validación pasa, reasigna todas las tareas de `origen` a `destino`.
4. Expón el endpoint `POST /proyectos/{origenId}/transferir-a/{destinoId}`.
5. Haz una prueba transfiriendo tareas hacia un proyecto inactivo: comprueba que responde con error y que en PostgreSQL ninguna tarea cambió de proyecto.

### Reto · Niveles de aislamiento y lecturas fantasma

Investiga cómo controla PostgreSQL la concurrencia entre transacciones simultáneas:

<p class="stage stage--solo">1 · Los niveles de aislamiento de SQL</p>

En `@Transactional` puedes configurar el parámetro `isolation`:
```java
@Transactional(isolation = Isolation.READ_COMMITTED) // Por defecto en PostgreSQL
```
* Explica qué es una **lectura sucia (*Dirty Read*)**, una **lectura no repetible (*Non-Repeatable Read*)** y una **lectura fantasma (*Phantom Read*)**.
* Investiga por qué PostgreSQL **no permite lecturas sucias bajo ningún concepto**, incluso en su nivel más permisivo (`READ UNCOMMITTED`).
* ¿Qué ocurre si configuras `Isolation.SERIALIZABLE` en un endpoint con miles de peticiones por segundo? Explica por qué el nivel serializable introduce una sobrecarga enorme de bloqueos y obliga a tu aplicación a capturar excepciones de reintento (`could not serialize access due to concurrent update`).

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Caso de uso de clonación implementado con <code>@Transactional</code> y rollback verificado en PostgreSQL ante error.</span></div>
  <div><strong>Si lo tienes</strong><span>Transferencia atómica de tareas entre proyectos con validación de estado activo y pruebas de aborto sin efectos secundarios.</span></div>
  <div><strong>Reto</strong><span>Estudio técnico de los 4 niveles de aislamiento SQL, fenómenos anómalos y coste del nivel serializable en PostgreSQL.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 38</p>
  <ul class="checklist">
    <li>Comprendes las cuatro garantías ACID (Atomicidad, Consistencia, Aislamiento y Durabilidad).</li>
    <li>Entiendes cómo el proxy AOP de Spring gestiona el ciclo <code>setAutoCommit(false)</code>, <code>commit()</code> y <code>rollback()</code>.</li>
    <li>Configuras <code>rollbackFor = Exception.class</code> para evitar confirmaciones accidentales ante excepciones comprobadas.</li>
    <li>Conoces el problema de la autoinvocación interna (<em>Self-Invocation</em>) y por qué anula las anotaciones transaccionales.</li>
    <li>Has comprobado empíricamente en PostgreSQL que un rollback revierte todas las inserciones previas sin dejar basura.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué ocurre con las operaciones previas de una transacción si la última sentencia lanza una RuntimeException?</li>
    <li>¿Por qué Spring no ejecuta rollback por defecto ante una excepción comprobada como <code>IOException</code>?</li>
    <li>¿Por qué llamar a un método <code>@Transactional</code> desde otro método de la misma clase no abre una transacción?</li>
    <li>¿En qué archivo de disco escribe PostgreSQL los cambios confirmados para garantizar la durabilidad incluso si se apaga el servidor?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Se cancelan y revierten por completo mediante un comando SQL ROLLBACK, dejando la base de datos en el estado exacto en que estaba antes de empezar.</p>
  <p>2 · Por convención histórica de la arquitectura EJB/Spring: las excepciones comprobadas se consideraban situaciones de negocio esperadas que el programador debía gestionar, mientras que las RuntimeException se consideraban fallos técnicos imprevistos.</p>
  <p>3 · Porque la llamada se ejecuta mediante la referencia interna <code>this</code> sin pasar por el proxy interceptor de Spring AOP que gestiona la conexión.</p>
  <p>4 · En el registro de escritura anticipada (*Write-Ahead Logging* o archivo WAL).</p>
</details>

## Sesión 39 · Consultas, rendimiento y N+1

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la anatomía del antipatrón N+1, por qué pasa desapercibido en local y cómo resolverlo de raíz utilizando JPQL con <code>JOIN FETCH</code> y <code>@EntityGraph</code>.</li>
    <li><strong>2. Haz:</strong> audita el endpoint de listado de tareas, diagnostica la avalancha de consultas en la consola y refactoriza el repositorio con una consulta optimizada en una sola sentencia.</li>
    <li><strong>3. Comprueba:</strong> comparas el número exacto de consultas SQL antes y después (de N+1 a 1), mides el tiempo de respuesta y aplicas paginación con <code>Pageable</code>.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si un endpoint devuelve 50 tareas y al mapearlas a DTO accedes al nombre de su proyecto asociado, ¿cuántas consultas SQL se enviarán a PostgreSQL si no has optimizado la carga?</li>
    <li>¿Qué diferencia hay entre un <code>JOIN</code> ordinario en SQL y la cláusula <code>JOIN FETCH</code> en una consulta JPQL de Hibernate?</li>
    <li>¿Por qué devolver listas sin paginar (<code>List&lt;Tarea&gt;</code>) en una API pública es un riesgo crítico para la estabilidad del servidor?</li>
  </ol>
</div>

### La trampa silenciosa: el problema N+1 al microscopio

El problema N+1 es, sin discusión, el fallo de rendimiento más extendido en el desarrollo de backends con ORM. Lo más peligroso es que **el código parece totalmente inocente y la aplicación funciona en apariencia a la perfección**.

Observa este método de tu servicio:

```java
@Transactional(readOnly = true)
public List<TareaResponse> listarTodas() {
    // Consulta 1: Traer todas las tareas
    List<Tarea> tareas = tareaRepo.findAll(); 

    // Mapear cada tarea a su DTO de respuesta
    return tareas.stream()
            .map(t -> new TareaResponse(
                    t.getId(),
                    t.getTitulo(),
                    t.getPrioridad(),
                    t.isCompletada(),
                    t.getProyecto().getId(),
                    t.getProyecto().getNombre() // ¡AQUÍ OCURRE EL DESASTRE!
            ))
            .toList();
}
```

Analicemos qué ocurre en PostgreSQL cuando hay **100 tareas** en la base de datos:

<figure class="diagram">
  <figcaption>La avalancha del problema N+1</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1 SELECT tareas</li>
    <li>100 SELECT proyectos (1 por fila)</li>
    <li>101 viajes TCP</li>
    <li>Colapso de red y pool</li>
  </ol>
</figure>

1. `tareaRepo.findAll()` ejecuta **1 consulta**:
   ```sql
   SELECT * FROM tareas;
   ```
2. Al iterar el stream, llegamos a `t.getProyecto().getNombre()`. Como configuramos `FetchType.LAZY` (lo correcto para no cargar proyectos a ciegas), `t.getProyecto()` es un Proxy vacío.
3. Al pedirle `.getNombre()`, el Proxy se ve obligado a viajar a PostgreSQL para traer los datos:
   ```sql
   SELECT * FROM proyectos WHERE id = 1;
   ```
4. En la segunda tarea, vuelve a disparar:
   ```sql
   SELECT * FROM proyectos WHERE id = 2;
   ```
5. ...y así sucesivamente hasta completar las 100 tareas.

**Total:** 1 consulta inicial + 100 consultas secundarias = **101 consultas SQL** para responder a un único cliente HTTP.

### Por qué en desarrollo no te enteras

En tu ordenador de desarrollo tienes tres tareas y dos proyectos de prueba. Tres consultas tardan 0,5 milisegundos en `localhost`. El navegador carga al instante y crees que tu código vuela.

En producción, la aplicación y la base de datos están en servidores o contenedores separados por una red física. Aunque la red sea rápida, cada consulta introduce una pequeña latencia de ida y vuelta (*Round Trip Time*):
* 100 consultas × 3 ms de latencia = **300 milisegundos de espera pura de red**.
* 1.000 tareas en una tabla real = **¡3 segundos enteros bloqueando la conexión!**
* Si diez usuarios hacen la misma petición a la vez, se satura el pool de conexiones de HikariCP y la API entera deja de responder (error `503 Service Unavailable`).

### La solución de ingeniería: JPQL con JOIN FETCH

La solución consiste en ordenarle a Hibernate: *«Cuando traigas las tareas, haz un JOIN con proyectos y rellena el objeto proyecto en la misma sentencia SQL»*.

Para lograrlo, utilizamos la cláusula **`JOIN FETCH`** en una consulta JPQL personalizada con la anotación `@Query`:

```java
package com.ejemplo.gestor.repository;

import com.ejemplo.gestor.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {

    // Consulta optimizada con JOIN FETCH: elimina el N+1 de raíz
    @Query("SELECT t FROM Tarea t JOIN FETCH t.proyecto")
    List<Tarea> findAllConProyecto();
}
```

<dl class="worked">
  <dt>Qué diferencia hay entre <code>JOIN</code> y <code>JOIN FETCH</code></dt>
  <dd>En JPQL, un <code>JOIN</code> normal solo sirve para filtrar (por ejemplo, <code>WHERE p.activo = true</code>), pero deja el objeto relacionado como un Proxy perezoso. <code>JOIN FETCH</code> le dice explícitamente a Hibernate: <em>«Filtra Y ADEMÁS inicializa el objeto relacionado con las columnas devueltas»</em>.</dd>
</dl>

Observa la única sentencia SQL que PostgreSQL ejecuta ahora:

```sql
Hibernate: 
    select 
        t1_0.id,
        t1_0.completada,
        t1_0.prioridad,
        t1_0.titulo,
        p1_0.id,
        p1_0.activo,
        p1_0.descripcion,
        p1_0.nombre 
    from 
        tareas t1_0 
    join 
        proyectos p1_0 
            on p1_0.id=t1_0.proyecto_id
```

**De 101 consultas hemos pasado a 1 sola consulta.** El tiempo de ejecución cae de 300 ms a 3 ms.

### La alternativa declarativa: @EntityGraph

Si prefieres no escribir consultas JPQL a mano para métodos estándar, Spring Data JPA ofrece la anotación `@EntityGraph`:

```java
@EntityGraph(attributePaths = {"proyecto"})
@Override
List<Tarea> findAll();
```

`@EntityGraph` instruye a Hibernate a realizar automáticamente un `LEFT OUTER JOIN` trayendo el atributo especificado sin necesidad de alterar la signatura del método ni escribir la sentencia JPQL.

### Paginación profesional con Pageable y Page

Cargar listas completas con `List<T>` es el segundo gran pecado de rendimiento en un backend. Si una tabla acumula 50.000 tareas, `findAllConProyecto()` construirá 50.000 objetos en memoria, colapsando el *heap* de Java con un `OutOfMemoryError`.

La solución en producción es la **paginación en base de datos**:

<p class="stage">1 · El repositorio paginado</p>

En `TareaRepository`:
```java
// Spring Data genera automáticamente LIMIT y OFFSET en PostgreSQL
Page<Tarea> findByCompletada(boolean completada, Pageable pageable);
```

<p class="stage">2 · El controlador recibe parámetros de paginación</p>

```java
@GetMapping("/paginadas")
public Page<TareaResponse> listarPaginadas(
        @RequestParam(defaultValue = "0") int pagina,
        @RequestParam(defaultValue = "10") int tamano) {

    // Creamos la petición de página ordenada por id descendente
    Pageable pageable = PageRequest.of(pagina, tamano, Sort.by("id").descending());

    Page<Tarea> resultado = servicio.listarPaginadas(pageable);

    // Page.map transforma cada elemento sin perder los metadatos de paginación
    return resultado.map(TareaMapper::aRespuesta);
}
```

<p class="stage">3 · El SQL eficiente en PostgreSQL</p>

Al pedir `GET /tareas/paginadas?pagina=0&tamano=10`, Hibernate ejecuta en PostgreSQL:
```sql
SELECT ... FROM tareas LIMIT 10 OFFSET 0;
SELECT count(*) FROM tareas; -- Para calcular el total de páginas
```
Solo viajan 10 filas por la red. La memoria de la aplicación permanece ligera y estable.

### Paso a paso guiado · Diagnóstico y optimización en vivo

Aplica la optimización en tu proyecto siguiendo estos pasos:

1. Abre `application.properties` y asegúrate de tener activada la visibilidad SQL:
   ```properties
   spring.jpa.show-sql=true
   spring.jpa.properties.hibernate.format_sql=true
   ```
2. Asegúrate de tener al menos tres proyectos y diez tareas creadas en tu base de datos.
3. Haz una llamada a `GET /tareas`:
   * Cuenta en tu terminal cuántas sentencias `select ... from proyectos` aparecen. Verás una por cada tarea. **Has pillado al N+1 con las manos en la masa.**
4. Cambia `TareaService` para que invoque `tareaRepo.findAllConProyecto()`.
5. Vuelve a hacer `GET /tareas`:
   * Comprueba en la consola que ahora solo se emite **una única sentencia con `JOIN`**.

### Ahora tú · Optimizar la carga de proyectos con su lista de tareas

En la sesión 36 creamos `GET /proyectos/{id}/detalle` que cargaba el proyecto y luego inicializaba sus tareas.

1. Añade en `ProyectoRepository` una consulta con `JOIN FETCH`:
   ```java
   @Query("SELECT p FROM Proyecto p LEFT JOIN FETCH p.tareas WHERE p.id = :id")
   Optional<Proyecto> findByIdConTareas(@Param("id") Long id);
   ```
   *(Usamos `LEFT JOIN FETCH` para que devuelva el proyecto incluso si no tiene tareas creadas todavía).*
2. Actualiza `ProyectoService.obtenerConDetalle(id)` para utilizar este nuevo método.
3. Comprueba en la terminal que la consulta del detalle de un proyecto se resuelve ahora en una sola sentencia SQL en lugar de dos.

### Reto · El problema del producto cartesiano (MultipleBagFetchException)

Investiga una de las excepciones más desconcertantes de JPA:

<p class="stage stage--solo">1 · La trampa de hacer JOIN FETCH sobre dos listas</p>

Imagina que una `Tarea` tiene una lista de comentarios (`List<Comentario>`) y una lista de etiquetas (`List<Etiqueta>`). Escribes esta consulta optimizadora:

```java
// INTENTO FALLIDO
@Query("SELECT t FROM Tarea t JOIN FETCH t.comentarios JOIN FETCH t.etiquetas")
List<Tarea> findTodo();
```

* Al arrancar la aplicación, Hibernate aborta con este error:
  ```text
  org.hibernate.loader.MultipleBagFetchException: 
  cannot simultaneously fetch multiple bags: [com.ejemplo.gestor.model.Tarea.comentarios, com.ejemplo.gestor.model.Tarea.etiquetas]
  ```
* ¿Qué es una *bag* en la terminología de Hibernate? (Una colección de tipo `List` sin orden definido).
* Explica qué es el **producto cartesiano relacional**: si una tarea tiene 5 comentarios y 4 etiquetas, ¿cuántas filas devuelve un doble `JOIN` en PostgreSQL para esa sola tarea? (5 × 4 = 20 filas duplicadas).
* Explica las dos soluciones de la industria para este problema:
  1. Cambiar las colecciones a `Set` (que no admiten duplicados).
  2. Dividir la carga en dos consultas dirigidas dentro de la misma transacción (aprovechando la caché de primer nivel de Hibernate).

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>N+1 detectado en logs de consola y corregido mediante <code>JOIN FETCH</code> en <code>TareaRepository</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Paginación con <code>Pageable</code> y <code>Page&lt;T&gt;</code> implementada, con <code>LIMIT</code> y <code>OFFSET</code> verificados en PostgreSQL.</span></div>
  <div><strong>Reto</strong><span>Consulta con <code>LEFT JOIN FETCH</code> para proyectos implementada y justificación técnica de la <code>MultipleBagFetchException</code>.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 39</p>
  <ul class="checklist">
    <li>Sabes identificar el problema N+1 observando repeticiones de consultas en la consola de Spring Boot.</li>
    <li>Comprendes por qué <code>FetchType.LAZY</code> es indispensable pero requiere consultas optimizadas en casos de lectura masiva.</li>
    <li>Utilizas <code>JOIN FETCH</code> en JPQL para cargar entidades y sus dependencias en una sola sentencia SQL eficiente.</li>
    <li>Conoces la alternativa declarativa con <code>@EntityGraph</code>.</li>
    <li>Implementas paginación profesional con <code>Pageable</code> para proteger la memoria RAM del servidor contra tablas masivas.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué el problema N+1 pasa desapercibido en los entornos de desarrollo locales?</li>
    <li>¿Qué diferencia a nivel de Hibernate existe entre <code>JOIN</code> y <code>JOIN FETCH</code> en una consulta JPQL?</li>
    <li>¿Por qué se utiliza <code>LEFT JOIN FETCH</code> en lugar de <code>INNER JOIN FETCH</code> al cargar una colección de hijos opcional?</li>
    <li>¿Qué parámetros SQL genera Spring Data al recibir una petición con <code>Pageable</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque en local la base de datos tiene pocos datos y la latencia de red es cero (localhost), ocultando el impacto del volumen de peticiones.</p>
  <p>2 · <code>JOIN</code> ordinario solo permite aplicar condiciones de filtrado en la consulta; <code>JOIN FETCH</code> además inicializa y puebla el objeto relacionado directamente en la misma sentencia sin dejar un Proxy perezoso.</p>
  <p>3 · Porque si la entidad padre no tiene ningún hijo asociado, un <code>INNER JOIN</code> descartaría al padre de la lista de resultados, mientras que <code>LEFT JOIN</code> devuelve al padre con la colección vacía.</p>
  <p>4 · Genera las cláusulas <code>LIMIT</code> (tamaño de página) y <code>OFFSET</code> (desplazamiento inicial según el número de página).</p>
</details>

## Lo que debes recordar

### El método

La UD4 enseñó a estructurar el código en capas desacopladas. Esta unidad ha demostrado por qué esa inversión valió la pena: **cambiamos todo el sistema de almacenamiento de memoria a PostgreSQL y el servicio no modificó ni una sola regla de negocio**.

Para persistir con JPA sin caer en sus trampas de rendimiento, sigue siempre este orden de ingeniería:

<figure class="diagram">
  <figcaption>El orden de diseño en persistencia</figcaption>
  <ol class="flow">
    <li>Diseña primero la <strong>tabla física en PostgreSQL</strong> (tipos, índices, restricciones y claves foráneas).</li>
    <li>Mapea la <strong>entidad JPA</strong> (constructor vacío, <code>@Id Long</code> y columnas explícitas).</li>
    <li>Declara el <strong>repositorio</strong> extendiendo <code>JpaRepository</code> con nombres derivados precisos.</li>
    <li>Comprueba el acceso con <strong>tests de repositorio</strong> (<code>@DataJpaTest</code>, <code>flush()</code> y <code>clear()</code>).</li>
    <li>Modela las relaciones con <code>@ManyToOne(fetch = FetchType.LAZY)</code> y lados propietarios claros.</li>
    <li>Delimita la atomicidad en el servicio con <code>@Transactional(rollbackFor = Exception.class)</code>.</li>
    <li>Audita el SQL en consola para erradicar el <strong>problema N+1</strong> mediante <code>JOIN FETCH</code>.</li>
  </ol>
</figure>

### La idea más importante

> **Un ORM no te exime de saber SQL: te exige entenderlo mejor. Las abstracciones tienen fugas. Si no entiendes cómo traduce Hibernate tus grafos de objetos a sentencias en PostgreSQL, tu backend funcionará en tu portátil y colapsará en producción.**

De ahí nacen todas las buenas prácticas: por eso usamos `FetchType.LAZY`, por eso usamos `Set` y nunca `List` en relaciones N:M, por eso comprobamos la existencia antes de borrar, y por eso las entidades jamás se serializan a JSON sin un DTO intermedio.

<p class="term">El desajuste de impedancia está domado, no eliminado</p>

El motor relacional habla de conjuntos, tablas y filas. Java habla de grafos, tipos, encapsulación e identidad en memoria. JPA tiende un puente entre ambos mundos, pero el coste de cruzar ese puente es entender en todo momento qué sentencias viajan por la red.

### Las decisiones que tienes que saber justificar

| Decisión | Lo que tienes que poder decir |
| :--- | :--- |
| **`Long` y no `long` primitivo para el `@Id`** | El primitivo nace con valor `0`, lo que confunde a Hibernate haciéndole creer que ya existe en la base de datos. El objeto envoltorio nace con valor `null`, señalando sin ambigüedad que se trata de una entidad nueva y transitoria que requiere un `INSERT`. |
| **Constructor vacío obligatorio** | Hibernate necesita instanciar la clase vacía mediante reflexión de Java antes de rellenar sus campos privados con los valores leídos de las columnas de la base de datos. |
| **Usar siempre la instancia devuelta por `save()`** | `save()` sincroniza la entidad con el contexto de persistencia y devuelve la referencia gestionada (*managed*) con el identificador autoincremental asignado por PostgreSQL y las columnas con valores por defecto. |
| **DTOs independientes de las entidades** | Desacoplan el contrato público de la API de la estructura física de almacenamiento, evitan exponer secretos o columnas internas y erradican de raíz los ciclos infinitos de serialización (`StackOverflowError`). |
| **`FetchType.LAZY` en relaciones `@ManyToOne`** | Previene que Hibernate cargue inmediatamente todas las entidades asociadas, evitando el catastrófico problema N+1 de consultas en listados masivos. |
| **`Set` y nunca `List` en relaciones `@ManyToMany`** | Con `Set`, Hibernate garantiza unicidad e inserta o borra únicamente la fila modificada en la tabla puente. Con `List`, se ve obligado a borrar todas las filas de la tabla puente y reinsertarlas una por una. |
| **Prohibido `CascadeType.REMOVE` en ManyToMany** | Evita que al eliminar una entidad hija (una tarea) se destruyan por error las entidades maestras compartidas (las etiquetas de todo el sistema). |
| **`orphanRemoval = true` en OneToMany** | Garantiza que si un elemento se elimina de la colección gestionada de su entidad padre, Hibernate emita automáticamente un `DELETE` en PostgreSQL, evitando registros huérfanos. |
| **`flush()` y `clear()` en tests de repositorio** | `flush()` fuerza la ejecución inmediata del SQL pendiente y `clear()` vacía la caché de primer nivel de la memoria RAM, impidiendo que el test dé falsos positivos al consultar datos cacheados. |
| **`rollbackFor = Exception.class`** | Por defecto Spring solo revierte la transacción ante `RuntimeException`. Añadir `rollbackFor` garantiza que excepciones comprobadas no provoquen un `COMMIT` accidental sobre datos a medio procesar. |
| **`JOIN FETCH` en lugar de `JOIN` en JPQL** | Instruye a Hibernate a realizar el `JOIN` físico y poblar inmediatamente la entidad relacionada en una única consulta SQL, reduciendo 101 consultas a solo 1. |

### Al terminar deberías poder responder

1. ¿Qué es el desajuste de impedancia (*Impedance Mismatch*) y en qué cuatro aspectos se manifiesta?
2. ¿Por qué una base de datos relacional seria exige un pool de conexiones como HikariCP en lugar de abrir conexiones a mano?
3. ¿Qué peligro tiene utilizar `ddl-auto=create-drop` o `update` en un entorno de producción?
4. ¿Cuáles son los cuatro estados del ciclo de vida de una entidad en JPA?
5. ¿Qué ocurre si modificas un campo con un setter dentro de un método `@Transactional` y olvidas llamar a `save()`?
6. ¿Por qué una clave foránea en PostgreSQL genera un error al intentar borrar una fila padre que tiene hijos asociados?
7. ¿Qué diferencia conceptual hay entre borrado físico (*Hard Delete*) y borrado lógico (*Soft Delete*)?
8. ¿Cómo traduce Spring Data un método llamado `findByTituloContainingIgnoreCase(String texto)` a SQL?
9. ¿En qué momento valida Spring Data si los métodos declarados en tu interfaz de repositorio tienen nombres coherentes?
10. ¿Por qué un test de repositorio con mocks no demuestra que tus consultas SQL funcionan?
11. ¿Qué componentes de Spring carga `@DataJpaTest` y cuáles ignora para ser tan rápido?
12. ¿Por qué es obligatorio llamar a `clear()` en un test antes de ejecutar la consulta que quieres verificar?
13. ¿Qué significa «lado propietario» de una relación y en qué tabla reside la clave foránea física?
14. ¿Qué es un Proxy de Hibernate y qué excepción lanza si intentas acceder a sus datos con la sesión cerrada?
15. ¿Qué significa el parámetro `mappedBy` en una anotación `@OneToMany`?
16. ¿Por qué los métodos helper (como `agregarTarea`) son obligatorios en relaciones bidireccionales?
17. ¿Por qué una relación `@ManyToMany` requiere físicamente una tabla puente en PostgreSQL?
18. ¿Cuáles son las cuatro garantías ACID y qué significa que una operación sea atómica?
19. ¿Qué es el problema de la autoinvocación (*Self-Invocation*) en métodos anotados con `@Transactional`?
20. ¿Qué es el problema N+1, cómo se diagnostica en la consola de logs y cómo lo elimina la cláusula `JOIN FETCH`?

### El vocabulario de la unidad

| Concepto | Significa |
| :--- | :--- |
| **ORM** | Mapeo Objeto-Relacional: traduce clases y objetos Java a tablas y filas SQL. |
| **JPA** | Especificación estándar de Java que define las anotaciones y comportamiento de persistencia. |
| **Hibernate** | El motor relacional (implementación concreta) que ejecuta las directrices de JPA. |
| **HikariCP** | El pool de conexiones de alto rendimiento que administra sockets TCP con PostgreSQL. |
| **Contexto de persistencia** | Zona de memoria en RAM donde Hibernate monitoriza las entidades gestionadas durante una transacción. |
| **EntityManager** | La interfaz central de JPA responsable de persistir, buscar y sincronizar entidades con la base de datos. |
| **Estado Transitorio** | Objeto nuevo creado con `new`, sin identificador en base de datos y no monitorizado por JPA. |
| **Estado Gestionado** | Entidad asociada activamente al contexto de persistencia; sus cambios se sincronizan automáticamente. |
| **Dirty Checking** | Comparación automática de Hibernate al final de la transacción que emite sentencias `UPDATE` para campos alterados. |
| **Consultas derivadas** | Métodos de Spring Data cuyo nombre define las cláusulas `WHERE`, operadores y ordenación de la consulta SQL. |
| **Slice Testing** | Pruebas de integración acotadas (`@DataJpaTest`) que solo levantan la rebanada de persistencia. |
| **TestEntityManager** | Herramienta de pruebas para forzar escrituras SQL (`flush`) y vaciar la memoria intermedia (`clear`). |
| **Lado propietario** | La entidad que mapea la clave foránea física en su tabla mediante `@JoinColumn`. |
| **`mappedBy`** | Indica el lado inverso de una relación; delega la escritura física en el campo correspondiente del otro lado. |
| **`FetchType.LAZY`** | Carga bajo demanda: no consulta la relación de base de datos hasta que se accede explícitamente a ella. |
| **Proxy de Hibernate** | Subclase intermedia ligera generada en memoria que sustituye temporalmente a una entidad perezosa. |
| **`orphanRemoval`** | Borrado automático en base de datos de entidades hijas cuando se desconectan de la colección de su padre. |
| **Tabla puente (*Join Table*)** | Tabla relacional intermedia con dos claves foráneas que permite modelar relaciones N:M. |
| **Atomicidad (ACID)** | Garantía transaccional de que todas las operaciones se confirman juntas (`COMMIT`) o se cancelan juntas (`ROLLBACK`). |
| **Problema N+1** | Antipatrón de rendimiento donde consultar N elementos dispara N consultas SQL individuales adicionales. |
| **`JOIN FETCH`** | Cláusula JPQL que obliga a Hibernate a traer la entidad y sus dependencias en una única sentencia SQL unificada. |

### Comprobación final del producto

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación final · con el proyecto y PostgreSQL delante</p>
  <ul class="checklist">
    <li>La aplicación arranca conectada a una base de datos PostgreSQL real sin errores de dialecto ni de HikariCP.</li>
    <li>Todas las tablas, columnas y claves foráneas están creadas respetando restricciones de integridad (<code>NOT NULL</code>, <code>UNIQUE</code>, <code>REFERENCES</code>).</li>
    <li>El ciclo CRUD completo funciona desde HTTP, persistiendo datos reales que sobreviven al reinicio del servidor.</li>
    <li>Los métodos del servicio están protegidos por <code>@Transactional</code> y reverten de forma demostrable ante excepciones.</li>
    <li>Los métodos de consulta derivados y personalizados están verificados mediante tests de repositorio con <code>@DataJpaTest</code>.</li>
    <li>Las relaciones <code>@ManyToOne</code> y <code>@ManyToMany</code> usan <code>FetchType.LAZY</code> y <code>Set</code> respectivamente.</li>
    <li>No se produce ningún <code>StackOverflowError</code> por serialización recursiva ni fugas de Proxies no inicializados.</li>
    <li>Las consultas de listado están optimizadas con <code>JOIN FETCH</code> o <code>Pageable</code>, erradicando el problema N+1 de la consola.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Resultados de la unidad</p>
  <ul class="checklist">
    <li>Explicar qué resuelve un ORM y qué problemas introduce.</li>
    <li>Configurar PostgreSQL y mapear entidades con JPA.</li>
    <li>Implementar un CRUD persistente y consultas derivadas.</li>
    <li>Comprobar el acceso a datos con tests de repositorio.</li>
    <li>Modelar relaciones uno a muchos y muchos a muchos sin romper la integridad.</li>
    <li>Reconocer y corregir el problema N+1.</li>
  </ul>
</div>

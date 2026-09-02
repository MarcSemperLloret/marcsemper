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

Diseña en un archivo `ESQUEMA_INICIAL.md` la traducción completa para las entidades `Proyecto` y `Usuario`.

<p class="stage stage--solo">1 · La tabla <code>proyectos</code></p>

Tu clase `Proyecto` tiene los campos `id`, `nombre`, `descripcion`, `activo` y `fechaCreacion` (`LocalDate`).
* Escribe la tabla de correspondencia con los tipos de PostgreSQL correspondientes.
* Asegúrate de que el nombre del proyecto sea obligatorio y único en el sistema.
* Define el valor por defecto para `activo`.

<p class="stage stage--solo">2 · La tabla <code>usuarios</code></p>

Diseña la tabla para almacenar los miembros del equipo:
* Campos: `id`, `email`, `nombreCompleto`, `rol` (`ADMIN`, `DEV`, `VIEWER`), `fechaAlta`.
* ¿Qué restricción fundamental debe tener la columna `email`?
* ¿Qué tipo de dato de PostgreSQL se adapta a `fechaAlta` si necesitamos guardar también la hora y minuto exactos?

### Reto · Las tres trampas de la identidad y los tipos

Examina estas tres situaciones reales y explica por escrito por qué son decisiones técnicas erróneas:

1. **El identificador primitivo:** Un desarrollador decide que el atributo `id` de su entidad sea un `long` primitivo en lugar de `Long` (objeto). ¿Qué valor tiene ese campo en memoria antes de guardar el objeto por primera vez en la base de datos? ¿Por qué eso confunde por completo a un ORM al decidir si debe hacer un `INSERT` o un `UPDATE`?
2. **La lista en un solo campo:** Para no crear otra tabla, alguien propone guardar las etiquetas de una tarea como un `VARCHAR` separado por comas: `"backend,urgente,seguridad"`. Explica qué ocurre cuando un usuario pide: *«dame todas las tareas con etiqueta seguridad ordenadas por fecha»*. ¿Puede la base de datos usar un índice en esa consulta?
3. **El hashcode como clave:** Otro compañero propone: *«En lugar de que PostgreSQL genere un id, podemos usar el `hashCode()` del objeto Java como clave primaria»*. Describe exactamente cómo fallará esa idea el día que dos tareas distintas generen la misma colisión de hash o cuando se reinicie la máquina virtual.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La tabla de correspondencia de <code>Tarea</code> comprendida, con tipos SQL y restricciones justificadas.</span></div>
  <div><strong>Si lo tienes</strong><span><code>ESQUEMA_INICIAL.md</code> completo con <code>proyectos</code> y <code>usuarios</code>, incluyendo tipos temporales y restricciones de unicidad.</span></div>
  <div><strong>Reto</strong><span>Las tres trampas analizadas en profundidad: primitivos frente a wrappers, violación de la 1ª Forma Normal y debilidades del hash como identidad.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 28</p>
  <ul class="checklist">
    <li>Sabes definir qué es el desajuste de impedancia objeto-relacional y citar al menos tres divergencias entre objetos y tablas.</li>
    <li>Distingues con precisión entre JDBC (API de bajo nivel), Hibernate (motor ORM) y JPA (especificación estándar).</li>
    <li>Entiendes por qué usar un ORM exige conocer SQL mejor, no peor (la ley de las abstracciones con fugas).</li>
    <li>Has traducido tipos Java (`Long`, `String`, `boolean`, `LocalDate`) a sus equivalentes precisos en PostgreSQL (`BIGINT`, `VARCHAR`, `BOOLEAN`, `DATE`).</li>
    <li>Comprendes la necesidad de duplicar restricciones: en la capa web para informar al usuario y en la base de datos para blindar el dato.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué JPA no puede ejecutar consultas por sí mismo y necesita una librería como Hibernate?</li>
    <li>¿Cuál es la diferencia fundamental entre cómo se relacionan dos entidades en Java y cómo se relacionan dos filas en SQL?</li>
    <li>¿Por qué un archivo JSON en disco no sustituye a una base de datos relacional en una API concurrente?</li>
    <li>¿Qué ocurriría si intentamos guardar una tarea con un título de 200 caracteres si la columna se definió como `VARCHAR(120)`?</li>
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
  $$\text{Conexiones} = (\text{núcleos de CPU} \times 2) + \text{disco}$$
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
    <li>¿Qué diferencia hay entre configurar `ddl-auto=validate` y `ddl-auto=update`?</li>
    <li>¿Qué significa la directiva `${DB_PORT:5432}` en un archivo de propiedades de Spring?</li>
    <li>Si en el log ves `Connection refused: localhost:5432`, ¿dónde está el problema?</li>
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
    <li>¿Por qué es obligatorio que una clase `@Entity` tenga un constructor sin argumentos?</li>
    <li>¿Quién escribe el código real de los métodos `findAll()` o `findById()` cuando usamos `JpaRepository`?</li>
    <li>¿Por qué el servicio `TareaService` no necesitó cambiar su lógica de negocio al cambiar de lista en memoria a PostgreSQL?</li>
    <li>¿Cómo decide Spring Data JPA si una llamada a `save()` debe traducirse en un `INSERT` o en un `UPDATE`?</li>
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
   * Cuerpo JSON estructurado: `{"error": "Recurso no encontrado", "mensaje": "No existe tarea con id 999"}`.

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
    <li>¿En qué estado se encuentra una entidad inmediatamente después de ejecutar `new Tarea()`?</li>
    <li>¿Por qué una entidad en estado *managed* no necesita llamar a `save()` para que sus cambios se guarden al final de una transacción?</li>
    <li>¿Qué diferencia a nivel de rendimiento aporta marcar un método como `@Transactional(readOnly = true)`?</li>
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
    <li>¿Por qué es peligroso instanciar un objeto nuevo con `new`, asignarle el id recibido por la URL y llamar a `save()` para actualizar?</li>
    <li>¿Qué consulta ejecuta Spring Data JPA cuando llamas a `repositorio.existsById(id)`?</li>
    <li>¿Qué significa que una operación HTTP DELETE deba responder `204 No Content`?</li>
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
    <li>¿Por qué hacer `findAll()` y filtrar con streams en Java es inviable en tablas con alto volumen de registros?</li>
    <li>¿Qué hace la palabra clave `Containing` en un método derivado de Spring Data?</li>
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
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> un repositorio que compila puede seguir devolviendo lo que no es, y el error solo aparece en la interfaz semanas después.</li>
    <li><strong>Construye:</strong> una clase de tests de repositorio que cubre una consulta derivada y un caso sin resultados.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **comprobar el acceso a datos contra una base de datos real sin arrancar la aplicación entera**.

### 2. El problema

Un repositorio que compila puede seguir devolviendo lo que no es, y el error solo aparece en la interfaz semanas después.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una clase de tests de repositorio que cubre una consulta derivada y un caso sin resultados.</li>
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

## Sesión 35 · ManyToOne y OneToMany

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> guardar identificadores sueltos pierde navegación, integridad y semántica del dominio.</li>
    <li><strong>Construye:</strong> proyectos e incidencias relacionados y consultables.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **modelar la relación entre proyecto e incidencias definiendo el lado propietario**.

### 2. El problema

Guardar identificadores sueltos pierde navegación, integridad y semántica del dominio.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido proyectos e incidencias relacionados y consultables.</li>
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

## Sesión 36 · Relaciones bidireccionales

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una relación navegable en dos direcciones puede divergir en memoria o crear ciclos infinitos.</li>
    <li><strong>Construye:</strong> métodos de asociación y una representación externa sin recursión.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **mantener ambos lados de una relación coherentes y evitar serializaciones recursivas**.

### 2. El problema

Una relación navegable en dos direcciones puede divergir en memoria o crear ciclos infinitos.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido métodos de asociación y una representación externa sin recursión.</li>
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

## Semana 13 · JPA más allá del tutorial

## Sesión 37 · ManyToMany

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> las etiquetas parecen simples hasta que la asociación necesita datos propios o reglas.</li>
    <li><strong>Construye:</strong> incidencias etiquetadas con un modelo justificable.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **decidir cuándo una relación muchos-a-muchos directa es suficiente y cuándo necesita entidad intermedia**.

### 2. El problema

Las etiquetas parecen simples hasta que la asociación necesita datos propios o reglas.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido incidencias etiquetadas con un modelo justificable.</li>
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

## Sesión 38 · Transacciones e integridad

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una operación de negocio puede dejar datos incoherentes si cada escritura confirma por separado.</li>
    <li><strong>Construye:</strong> un caso multioperación que se confirma completo o se revierte completo.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **delimitar operaciones atómicas y comprobar qué ocurre cuando una parte falla**.

### 2. El problema

Una operación de negocio puede dejar datos incoherentes si cada escritura confirma por separado.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un caso multioperación que se confirma completo o se revierte completo.</li>
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

## Sesión 39 · Consultas, rendimiento y N+1

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una página correcta puede esconder decenas de accesos repetidos a la base de datos.</li>
    <li><strong>Construye:</strong> una comparación medible antes y después de corregir una carga ineficiente.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **observar las consultas ejecutadas y detectar un N+1 introductorio**.

### 2. El problema

Una página correcta puede esconder decenas de accesos repetidos a la base de datos.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una comparación medible antes y después de corregir una carga ineficiente.</li>
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
    <li>Explicar qué resuelve un ORM y qué problemas introduce.</li>
    <li>Configurar PostgreSQL y mapear entidades con JPA.</li>
    <li>Implementar un CRUD persistente y consultas derivadas.</li>
    <li>Comprobar el acceso a datos con tests de repositorio.</li>
    <li>Modelar relaciones uno a muchos y muchos a muchos sin romper la integridad.</li>
    <li>Reconocer y corregir el problema N+1.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

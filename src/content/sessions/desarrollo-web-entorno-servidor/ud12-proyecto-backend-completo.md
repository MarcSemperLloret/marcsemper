---
title: "Proyecto backend completo"
label: "UD12 · Defender"
section: "ud-12"
order: 12
lang: "es"
summary: "Un proyecto autónomo desde la especificación hasta la defensa técnica, con el cliente Angular ya integrado y la seguridad puesta."
duration: "18 horas · 3 semanas · 9 sesiones"
modality: "Proyecto evaluable · 10 % guía / 90 % autonomía"
deliverable: "Un backend completo verificable con Postman o Bruno, conectado a Angular, probado, documentado y defendido técnicamente."
date: "2026-09-02"
outcomes:
  - "Traducir una especificación en un modelo, un contrato y una arquitectura."
  - "Implementar un backend completo con persistencia, seguridad e integraciones."
  - "Conectar un cliente Angular sin hacer que la comprobación del backend dependa de él."
  - "Probar, documentar y refactorizar antes de entregar."
  - "Defender técnicamente las decisiones y reconocer las limitaciones del resultado."
requirements:
  - "Todo lo construido durante el curso."
priorKnowledge:
  - "El módulo completo, de la UD1 a la UD11."
  - "Angular, del módulo de desarrollo web en entorno cliente."
---

<p class="lead">Ya no existe tutorial. El profesorado entrega una especificación y el equipo decide modelo, contrato, arquitectura, estrategia de seguridad, integración y pruebas. Angular actúa como consumidor final, pero el backend debe seguir pudiendo comprobarse de forma completa con Postman o Bruno.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Sin andamiaje. Solo especificación, criterios de aceptación y fechas.</p>
</div>

## Semana 24 · Especificar antes de construir

## Sesión 70 · Especificación y modelado

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> a descomponer una especificación de negocio ambigua en <strong>Actores</strong>, <strong>Casos de Uso</strong>, <strong>Reglas de Negocio Invariantes</strong> y <strong>Criterios de Aceptación ejecutables (Gherkin)</strong>, diseñando el modelo conceptual del dominio antes de escribir una sola línea de código.</li>
    <li><strong>2. Haz:</strong> elabora la matriz de actores y permisos preliminar, traduce los requisitos funcionales en criterios formales de aceptación y dibuja el diagrama conceptual de entidades identificando agregados, identificadores y restricciones.</li>
    <li><strong>3. Comprueba:</strong> sometes tu modelo a tres pruebas de estrés resolviendo casos límite no contemplados explícitamente en el enunciado (ej: estados terminales, concurrencia de asignaciones y borrado de entidades con histórico), garantizando que no quedan decisiones de diseño en el aire.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué empezar a escribir controladores y entidades JPA sin haber validado las reglas de negocio suele obligar a reescribir la mitad del proyecto a mitad del desarrollo?</li>
    <li>¿Cuál es la diferencia entre un «Requisito Funcional» (lo que el sistema debe hacer) y una «Regla de Negocio Invariante» (una restricción que nunca puede violarse)?</li>
    <li>¿Cómo ayuda el formato de especificación <em>Given-When-Then</em> (Dado-Cuando-Entonces) a acordar el comportamiento de un endpoint entre el backend y el frontend?</li>
  </ol>
</div>

### Dejar de teclear: La disciplina de la especificación

En los proyectos anteriores contabas con un itinerario guiado paso a paso. En esta unidad final asumes el rol de **ingeniero de backend autónomo**.

El error más común del programador inexperto es abrir el IDE, crear entidades JPA a toda velocidad y empezar a programar endpoints basándose en suposiciones apresuradas.
* A los tres días descubre que un proyecto no podía tener más de un responsable activo.
* Descubre que una tarea cerrada no debía poder recibir adjuntos.
* Descubre que los importes monetarios debían registrarse con impuestos desglosados y no como un simple número flotante.

Modificar el modelo de datos con la aplicación a medio construir cuesta diez veces más tiempo que resolver esas ambigüedades sobre el papel.

<div class="rule">
  <p class="rule-label">La ley del modelado previo</p>
  <p><strong>El código no toma decisiones de negocio: las ejecuta.</strong></p>
  <p>Toda duda o ambigüedad que no resuelvas durante la fase de especificación se convertirá en un bug en producción o en una refactorización dolorosa en la base de datos.</p>
</div>

### Los cuatro pilares de una especificación técnica

Para blindar el diseño de tu backend, descompón el problema en cuatro matrices complementarias:

<figure class="diagram">
  <figcaption>Estructura de descomposición del dominio</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Actores y Roles: Quién opera el sistema</li>
    <li>2. Casos de Uso: Qué acciones aportan valor real</li>
    <li>3. Reglas Invariantes: Restricciones inmutables de negocio</li>
    <li>4. Criterios Gherkin: Pruebas ejecutables Given-When-Then</li>
  </ol>
</figure>

1. **Mapa de Actores:** Define las identidades que consumirán el backend:
   * **Operario de campo:** Reporta incidencias, sube ficheros binarios y consulta tareas asignadas.
   * **Jefe de proyecto:** Crea proyectos, asigna presupuestos, aprueba cambios de estado y consulta métricas.
   * **Auditor externo:** Solo lectura exhaustiva de históricos, trazas y registros de auditoría.
   * **Administrador:** Gestión de identidades, configuración global y reactivación de cuentas.
2. **Casos de Uso de Negocio:** No son simples operaciones CRUD ("Crear Proyecto"), sino intenciones de negocio con reglas ("IniciarProyectoConPresupuestoAprobado", "TransferirResponsabilidadDeTarea").
3. **Reglas de Negocio Invariantes:** Afirmaciones que la aplicación debe garantizar en el 100 % de los casos:
   * *R1:* Un proyecto no puede pasar a estado `CERRADO` si tiene tareas pendientes o incidencias críticas abiertas.
   * *R2:* El presupuesto consumido acumulado de las tareas no puede superar el presupuesto total asignado al proyecto.
   * *R3:* Ningún fichero adjunto puede sobrepasar los 5 MB ni contener extensiones no autorizadas.
4. **Criterios de Aceptación (Gherkin):**
   ```gherkin
   Escenario: Cierre de proyecto con tareas sin finalizar
     Dado un proyecto en estado "EN_CURSO" que contiene 2 tareas "PENDIENTES"
     Cuando el usuario con rol "JEFE_PROYECTO" solicita cerrarlo
     Entonces el sistema rechaza la petición con código HTTP 409 Conflict
     Y devuelve un Problem Details indicando "No se puede cerrar un proyecto con tareas pendientes"
     Y el estado del proyecto permanece "EN_CURSO"
   ```

### Paso a paso guiado · Del enunciado al modelo conceptual

<p class="stage">Paso 1 · Identificar entidades y objetos de valor (Value Objects)</p>

Diferenciamos dos tipos de objetos en nuestro modelo:
* **Entidades (con identidad propia en el tiempo):** `Proyecto`, `Tarea`, `Usuario`, `Incidencia`, `Adjunto`. Si dos proyectos tienen el mismo nombre pero diferente ID, son proyectos distintos.
* **Objetos de Valor (inmutables, definidos por sus atributos):** `Dinero` (importe + divisa), `Coordenadas` (latitud + longitud), `PeriodoFechas` (fechaInicio + fechaFin). Si dos objetos `Coordenadas` tienen la misma latitud y longitud, son idénticos.

<p class="stage">Paso 2 · Diseñar la máquina de estados de las entidades principales</p>

Una entidad crítica nunca debería cambiar de estado mediante simples setters arbitrarios. Debe seguir un ciclo de vida estrictamente regulado:

```text
[BORRADOR] ──(Aprobar presupuesto)──> [PLANIFICADO] ──(Asignar equipo)──> [EN_CURSO]
                                                                              │
               [CANCELADO] <──────(Cancelar con motivo justificado)────────────┤
                                                                              │
               [FINALIZADO] <─────(Verificar que no hay tareas pendientes)────┘
```

<p class="stage">Paso 3 · La matriz de casos de uso y contratos de API</p>

| Caso de Uso | Método HTTP | Ruta propuesta | Actor autorizado | Códigos HTTP previstos |
| :--- | :--- | :--- | :--- | :--- |
| **Registrar proyecto** | `POST` | `/api/v1/proyectos` | `JEFE_PROYECTO`, `ADMIN` | `201`, `400`, `401`, `403`, `409` |
| **Aprobar presupuesto** | `PATCH` | `/api/v1/proyectos/{id}/presupuesto` | `ADMIN` | `200`, `400`, `404`, `409` |
| **Cerrar proyecto** | `POST` | `/api/v1/proyectos/{id}/cerrar` | `JEFE_PROYECTO` | `200`, `409`, `404` |
| **Adjuntar informe** | `POST` | `/api/v1/tareas/{id}/adjuntos` | `OPERARIO`, `JEFE_PROYECTO` | `201`, `400`, `413`, `404` |

### La comprobación · Prueba de estrés del modelo conceptual

Somete tu modelo a tres preguntas trampa para verificar su solidez:

1. **Caso límite 1 (Concurrencia):** Dos jefes de proyecto intentan cerrar el mismo proyecto exactamente en el mismo segundo. ¿Cómo previene tu modelo que se ejecute la notificación de cierre dos veces? *(Requiere control de concurrencia optimista con `@Version` o bloqueos pesimistas).*
2. **Caso límite 2 (Integridad de datos):** Un usuario borra un proyecto que tiene 50 tareas y 10 incidencias históricas. ¿Se borran en cascada perdiendo la auditoría o se aplica un borrado lógico (*Soft Delete*)?
3. **Caso límite 3 (Degradación):** El servicio externo de firma digital o meteorología no responde durante el alta. ¿Se bloquea el caso de uso o se guarda en estado pendiente de sincronización?

### Ahora tú · Redactar la especificación formal del proyecto

Elabora el documento de especificación formal de tu proyecto backend:
1. Define los 4 actores y la matriz de control de acceso basada en roles (RBAC).
2. Detalla al menos 6 casos de uso principales con sus correspondientes escenarios *Given-When-Then*.
3. Enumera las 5 reglas de negocio invariantes que tu código garantizará bajo cualquier circunstancia.

> [!NOTE]
> Si en la evaluación se solicita la memoria formal de análisis y especificación del proyecto, el formato oficial de entrega de texto es siempre un **documento en PDF** (`especificacion-proyecto.pdf`), nunca un archivo markdown suelto.

### Reto · Formalización de contratos con OpenAPI antes de codificar (API-First)

En la metodología **API-First**, antes de escribir una clase en Java, se redacta el archivo de especificación OpenAPI en formato YAML (`openapi.yaml`):
1. Diseña el contrato del endpoint `POST /api/v1/proyectos` en YAML detallando el esquema del JSON de entrada, los campos obligatorios y los ejemplos de respuestas de error RFC 7807.
2. Utiliza el editor Swagger Editor o la extensión OpenAPI de tu IDE para validar sintácticamente el contrato.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Lista de actores, casos de uso básicos y diagrama de entidades inicial.</span></div>
  <div><strong>Si lo tienes</strong><span>Reglas invariantes formalizadas, máquinas de estado finitas y escenarios Gherkin.</span></div>
  <div><strong>Reto</strong><span>Enfoque API-First con contrato OpenAPI 3 preliminar redactado antes de programar.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 70</p>
  <ul class="checklist">
    <li>Se supera el impulso de programar sin un análisis previo de requisitos y riesgos.</li>
    <li>Se definen con precisión los actores y sus permisos en el sistema.</li>
    <li>Las reglas de negocio invariantes están claramente aisladas de la lógica de interfaz.</li>
    <li>Los criterios de aceptación en formato Gherkin eliminan ambigüedades contractuales.</li>
    <li>El modelo conceptual de datos soporta los casos límite y de contingencia identificados.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es arriesgado que un caso de uso se denomine simplemente «ModificarProyecto» en lugar de nombres con intención de negocio?</li>
    <li>¿Qué diferencia conceptual existe entre una Entidad y un Objeto de Valor (Value Object)?</li>
    <li>¿Qué estructura componen las tres cláusulas de un escenario Gherkin?</li>
    <li>¿Qué riesgo operativo previene definir una máquina de estados finita para las entidades críticas?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque «ModificarProyecto» es un saco genérico que suele saltarse validaciones específicas; nombres como «AprobarPresupuesto» o «ReasignarResponsable» encapsulan reglas precisas de transición.</p>
  <p>2 · Las entidades se distinguen por un identificador único que perdura en el tiempo aunque cambien sus datos; los objetos de valor carecen de identidad propia y se definen exclusivamente por sus atributos inmutables.</p>
  <p>3 · Dado (Given: contexto o estado inicial), Cuando (When: acción o evento disparador) y Entonces (Then: resultado o consecuencias esperadas).</p>
  <p>4 · Evita transiciones ilegales o incoherentes en la base de datos (por ejemplo, que un proyecto cancelado pase directamente a finalizado sin pasar por revisión previa).</p>
</details>

## Sesión 71 · Arquitectura y modelo de datos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el diseño del esquema relacional en PostgreSQL (tipos nativos óptimos, integridad referencial con <code>RESTRICT</code> frente a <code>CASCADE</code>, índices estratégicos), la estructuración por paquetes modular y la gestión de esquemas mediante scripts SQL versionados.</li>
    <li><strong>2. Haz:</strong> redacta el script <code>schema.sql</code> completo con restricciones de clave foránea e índices, diseña el script de semillas iniciales <code>data.sql</code> con datos realistas para pruebas y estructura los paquetes del proyecto Spring Boot.</li>
    <li><strong>3. Comprueba:</strong> ejecutas el script SQL en una base de datos PostgreSQL limpia, comprobando que las tablas se crean sin colisiones, que las restricciones de unicidad e integridad funcionan y que los datos iniciales cargan de forma instantánea.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué en entornos de producción está terminantemente prohibido utilizar `spring.jpa.hibernate.ddl-auto=update` o `create-drop`?</li>
    <li>¿Por qué nunca se debe utilizar el tipo de datos `DOUBLE` o `FLOAT` para almacenar cantidades monetarias o presupuestos en una base de datos?</li>
    <li>¿Qué ventaja ofrece estructurar los paquetes Java por componente de negocio (*Package by Feature*) frente a hacerlo por capa técnica (*Package by Layer*) en un proyecto mediano o grande?</li>
  </ol>
</div>

### El peligro del ddl-auto en proyectos reales

Durante las primeras semanas del curso resultaba cómodo dejar que Hibernate generara y alterara las tablas automáticamente con `ddl-auto=update`.

En un proyecto profesional, delegar el esquema en Hibernate es una **receta para el desastre**:
1. Hibernate no siempre crea los índices necesarios para claves foráneas o búsquedas complejas.
2. Al renombrar un atributo en una clase Java, Hibernate no renombra la columna: **crea una columna nueva y deja la antigua huérfana**, provocando inconsistencia de datos.
3. No permite controlar nombres de restricciones (*constraints*), claves foráneas ni tipos numéricos de precisión fija.

<div class="rule">
  <p class="rule-label">La ley del control del esquema</p>
  <p><strong>El esquema de base de datos es código fuente versionado.</strong></p>
  <p>El esquema debe definirse mediante scripts SQL explícitos (<code>schema.sql</code> o migraciones con Flyway/Liquibase). Hibernate debe configurarse en modo <code>ddl-auto=validate</code> para comprobar que las entidades coinciden con el esquema sin modificarlo nunca automáticamente.</p>
</div>

### Tipos de datos óptimos en PostgreSQL

| Concepto de negocio | Tipo SQL recomendado | Tipo Java equivalente | Justificación técnica |
| :--- | :--- | :--- | :--- |
| **Identificadores primarios** | `BIGINT GENERATED ALWAYS AS IDENTITY` | `Long` | Clave autonumérica estándar SQL de 64 bits; evita desbordamientos de enteros de 32 bits. |
| **Importes / Presupuesto** | `NUMERIC(12, 2)` | `BigDecimal` | Precisión decimal fija exacta. Los números de coma flotante (`DOUBLE`) sufren errores de redondeo binario intolerables en finanzas. |
| **Cadenas cortas / Nombres** | `VARCHAR(100)` | `String` | Límites explícitos que protegen el almacenamiento y evitan inyección de textos arbitrariamente gigantes. |
| **Descripciones / Texto largo** | `TEXT` | `String` | Almacenamiento eficiente sin límite prefijado para notas o descripciones extensas. |
| **Marcas temporales** | `TIMESTAMP WITH TIME ZONE` | `Instant` o `OffsetDateTime` | Almacena el instante universal en UTC evitando ambigüedades por cambios de horario de verano/invierno. |
| **Estados / Enums** | `VARCHAR(30)` | `Enum` de Java | Más flexible y legible en consultas SQL manuales que los ordinales numéricos (`0, 1, 2`). |

### Paso a paso guiado · Script de base de datos profesional y estructura modular

<p class="stage">Paso 1 · El script de esquema schema.sql</p>

Creamos el archivo `src/main/resources/schema.sql` con definición formal de tablas, claves e índices:

```sql
-- Limpieza ordenada respetando integridad referencial
DROP TABLE IF EXISTS adjuntos CASCADE;
DROP TABLE IF EXISTS incidencias CASCADE;
DROP TABLE IF EXISTS tareas CASCADE;
DROP TABLE IF EXISTS proyectos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;

-- Tabla de usuarios y credenciales
CREATE TABLE usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    rol VARCHAR(30) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de proyectos
CREATE TABLE proyectos (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(30) NOT NULL DEFAULT 'PLANIFICADO',
    presupuesto_total NUMERIC(12, 2) NOT NULL CHECK (presupuesto_total >= 0),
    latitud NUMERIC(8, 5) NOT NULL,
    longitud NUMERIC(8, 5) NOT NULL,
    responsable_id BIGINT NOT NULL,
    version BIGINT NOT NULL DEFAULT 0, -- Para bloqueo optimista
    fecha_inicio DATE NOT NULL,
    fecha_fin_estimada DATE NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_proyectos_responsable FOREIGN KEY (responsable_id) 
        REFERENCES usuarios (id) ON DELETE RESTRICT,
    CONSTRAINT chk_fechas_proyecto CHECK (fecha_fin_estimada >= fecha_inicio)
);

-- Tabla de tareas vinculadas
CREATE TABLE tareas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    prioridad VARCHAR(20) NOT NULL DEFAULT 'MEDIA',
    estado VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    coste_estimado NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (coste_estimado >= 0),
    proyecto_id BIGINT NOT NULL,
    asignado_a BIGINT,
    CONSTRAINT fk_tareas_proyecto FOREIGN KEY (proyecto_id) 
        REFERENCES proyectos (id) ON DELETE CASCADE,
    CONSTRAINT fk_tareas_asignado FOREIGN KEY (asignado_a) 
        REFERENCES usuarios (id) ON DELETE SET NULL
);

-- Índices estratégicos para acelerar consultas y joins frecuentes
CREATE INDEX idx_proyectos_responsable ON proyectos (responsable_id);
CREATE INDEX idx_proyectos_estado ON proyectos (estado);
CREATE INDEX idx_tareas_proyecto ON tareas (proyecto_id);
CREATE INDEX idx_tareas_estado ON tareas (estado);
```

<p class="stage">Paso 2 · El script de semillas data.sql</p>

Creamos `src/main/resources/data.sql` con datos realistas para verificar inmediatamente el sistema:

```sql
-- Usuarios iniciales (contraseñas hasheadas con BCrypt para 'password123')
INSERT INTO usuarios (username, password_hash, nombre_completo, email, rol) VALUES
('admin', '$2a$12$e8w6Q0Xp7w/jO4k8z5PzO.r4D1f6W3U2l8K4m7N9o1P3q5R7s9T1u', 'Administrador General', 'admin@empresa.com', 'ADMINISTRADOR'),
('jefe1', '$2a$12$e8w6Q0Xp7w/jO4k8z5PzO.r4D1f6W3U2l8K4m7N9o1P3q5R7s9T1u', 'Elena Torres', 'elena.torres@empresa.com', 'JEFE_PROYECTO'),
('operario1', '$2a$12$e8w6Q0Xp7w/jO4k8z5PzO.r4D1f6W3U2l8K4m7N9o1P3q5R7s9T1u', 'Carlos Ramos', 'carlos.ramos@empresa.com', 'DESARROLLADOR');

-- Proyecto inicial
INSERT INTO proyectos (codigo, nombre, descripcion, estado, presupuesto_total, latitud, longitud, responsable_id, fecha_inicio, fecha_fin_estimada) VALUES
('PRJ-2026-001', 'Parque Fotovoltaico Levante', 'Instalación de 500 paneles solares y subestación', 'EN_CURSO', 150000.00, 39.4699, -0.3763, 2, '2026-03-01', '2026-08-31');

-- Tareas asociadas
INSERT INTO tareas (titulo, prioridad, estado, coste_estimado, proyecto_id, asignado_a) VALUES
('Tendido de cableado de alta tensión', 'CRITICA', 'EN_CURSO', 12000.00, 1, 3),
('Cimentación de inversores solares', 'ALTA', 'FINALIZADA', 25000.00, 1, 3);
```

<p class="stage">Paso 3 · Configuración de application.properties para validación estricta</p>

```properties
# Conexión a PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/gestion_proyectos
spring.datasource.username=postgres
spring.datasource.password=postgres

# Inicialización por scripts SQL explícitos
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema.sql
spring.sql.init.data-locations=classpath:data.sql

# Hibernate solo valida: nunca modifica el esquema
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
```

### La comprobación · Validación de esquema y restricciones en PostgreSQL

1. **Ejecuta la inicialización de la base de datos:**
   Arranca el backend o ejecuta el script en tu cliente PostgreSQL preferido (DBeaver, psql).
2. **Comprueba las restricciones de integridad:**
   Intenta insertar una fila que viole una regla de negocio SQL:
   ```sql
   -- Intento de proyecto con fecha fin anterior a fecha inicio (debe fallar)
   INSERT INTO proyectos (codigo, nombre, presupuesto_total, latitud, longitud, responsable_id, fecha_inicio, fecha_fin_estimada)
   VALUES ('ERR-01', 'Test Error', 5000, 39.0, -0.3, 2, '2026-05-10', '2026-05-01');
   ```
   **Resultado esperado:** PostgreSQL aborta la inserción con error de restricción de chequeo:
   `ERROR: el nuevo registro para la relación «proyectos» viola la restricción «chk_fechas_proyecto»`.
3. **Comprueba el modo `ddl-auto=validate`:**
   Si la aplicación arranca sin lanzar `SchemaManagementException`, significa que las clases `@Entity` de Java coinciden al 100 % con el esquema SQL real.

### Ahora tú · Estructurar la arquitectura modular de paquetes

Organiza los paquetes de tu código fuente bajo la estrategia de **componentes de negocio** (*Package by Feature*):
```text
com.empresa.proyecto/
├── core/                  # Seguridad global, filtros MDC, gestión de excepciones RFC 7807
│   ├── exception/
│   ├── filter/
│   └── security/
├── proyecto/              # Dominio de proyectos (Controller, Service, Repository, Model, DTO)
├── tarea/                 # Dominio de tareas
├── incidencia/            # Dominio de incidencias y adjuntos
└── integration/           # Clientes HTTP salientes (Open-Meteo, Webhooks)
```
Explica en tu cuaderno de diseño qué ventajas aporta esta estructura cuando varios desarrolladores trabajan en paralelo sobre ramas distintas de Git.

### Reto · Versionado formal con Flyway

En lugar de recargar `schema.sql` en cada arranque, investiga la herramienta **Flyway**:
1. Añade la dependencia `org.flywaydb:flyway-core` y `flyway-database-postgresql`.
2. Estructura los scripts de migración en la carpeta `src/main/resources/db/migration/`:
   * `V1__crear_esquema_inicial.sql`
   * `V2__anadir_indices_y_semillas.sql`
3. Comprueba cómo Flyway crea la tabla `flyway_schema_history` garantizando que las migraciones solo se aplican una vez y de forma estrictamente incremental.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Script `schema.sql` con claves primarias, foráneas y tipos de datos óptimos.</span></div>
  <div><strong>Si lo tienes</strong><span>Restricciones de chequeo (`CHECK`), índices estratégicos y modo `ddl-auto=validate`.</span></div>
  <div><strong>Reto</strong><span>Migraciones incrementales versionadas gestionadas automáticamente con Flyway.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 71</p>
  <ul class="checklist">
    <li>Se erradica la dependencia de Hibernate para alterar el esquema en entornos reales.</li>
    <li>Los importes monetarios están blindados con tipos decimales exactos (`NUMERIC` / `BigDecimal`).</li>
    <li>Las restricciones de integridad referencial (`ON DELETE RESTRICT`) impiden borrados accidentales.</li>
    <li>Se crean índices específicos sobre claves foráneas y campos frecuentes de filtrado.</li>
    <li>La arquitectura de paquetes por componente favorece la mantenibilidad y el trabajo en equipo.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué el modo `spring.jpa.hibernate.ddl-auto=validate` es el más seguro para producción?</li>
    <li>¿Por qué debe evitarse `ON DELETE CASCADE` en entidades que contienen información contable o de auditoría?</li>
    <li>¿Qué beneficio aporta crear un índice sobre la columna de una clave foránea en una tabla hija?</li>
    <li>¿Por qué se utiliza el tipo `TIMESTAMP WITH TIME ZONE` en lugar de una simple fecha sin zona horaria?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque verifica que el modelo de clases Java coincide exactamente con las tablas existentes en la base de datos sin ejecutar ninguna instrucción DDL que pueda alterar o borrar datos.</p>
  <p>2 · Porque si un usuario elimina accidentalmente un registro padre, la base de datos destruirá silenciosamente todos los registros hijos relacionados sin previo aviso ni trazabilidad.</p>
  <p>3 · Acelera drásticamente las consultas con cláusulas JOIN y filtrados por el identificador del padre, evitando escaneos secuenciales completos (Full Table Scan) en tablas grandes.</p>
  <p>4 · Porque almacena el instante temporal exacto normalizado en UTC, permitiendo que clientes ubicados en distintos husos horarios interpreten la fecha y hora sin discrepancias.</p>
</details>

## Sesión 72 · Inicio de implementación

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la estrategia de entrega por <strong>Corte Vertical (Vertical Slice)</strong> frente al antipatrón de capas horizontales, la construcción del esqueleto ejecutable (<em>Walking Skeleton</em>) y la verificación temprana con tests de integración MockMvc.</li>
    <li><strong>2. Haz:</strong> implementa el primer corte vertical completo para el alta de proyectos: desde el DTO de entrada con validaciones Jakarta, pasando por el servicio con reglas de negocio y el repositorio JPA, hasta la respuesta HTTP <code>201 Created</code> con cabecera <code>Location</code>.</li>
    <li><strong>3. Comprueba:</strong> lanzas la batería de pruebas de integración con MockMvc y ejecutas la colección de Bruno verificando que la petición devuelve el código y la cabecera correcta, confirmando la fila persistida en PostgreSQL en menos de 50 ms.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué riesgo asume un equipo que pasa dos semanas programando todas las entidades JPA y repositorios antes de crear su primer controlador REST?</li>
    <li>¿Qué es un <em>Walking Skeleton</em> en el desarrollo de software ágil?</li>
    <li>¿Por qué la respuesta a una petición `POST` exitosa de creación de recurso debe incluir la cabecera HTTP `Location`?</li>
  </ol>
</div>

### El antipatrón de las capas horizontales

Un error clásico al iniciar un proyecto es trabajar por estratos horizontales:
* Semana 1: Creamos todas las entidades JPA de todas las tablas.
* Semana 2: Creamos todos los repositorios e interfaces.
* Semana 3: Creamos los servicios.
* Semana 4: Creamos los controladores y probamos si algo funciona.

Si en la cuarta semana descubres que la forma en que diseñaste las relaciones en JPA dificulta las consultas que necesita el cliente web, **tienes que reescribir las tres semanas anteriores**.

### La estrategia del Corte Vertical (Vertical Slice)

La ingeniería moderna construye el software por **cortes verticales**:

<figure class="diagram">
  <figcaption>Corte Vertical: valor desplegable desde el primer día</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. DTO Request validado</li>
    <li>2. Controlador REST con ruta y seguridad</li>
    <li>3. Servicio con lógica de negocio</li>
    <li>4. Repositorio JPA y tabla PostgreSQL</li>
    <li>5. DTO Response y cabecera Location</li>
  </ol>
</figure>

En lugar de construir el 100 % de las entidades sin probarlas, **construyes un único caso de uso de principio a fin**:
* Si completas el alta de proyectos en 3 horas, tienes una aplicación que compila, arranca, persiste datos en PostgreSQL, pasa sus tests y devuelve respuestas HTTP estándar.
* Tienes una base sólida y probada sobre la que construir los siguientes casos de uso con total confianza.

### Paso a paso guiado · El primer corte vertical: Alta de Proyectos

<p class="stage">Paso 1 · El DTO de entrada con validación estricta</p>

```java
package com.empresa.proyecto.proyecto.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CrearProyectoRequest(
    @NotBlank(message = "El código de proyecto es obligatorio")
    @Pattern(regexp = "^PRJ-\\d{4}-\\d{3}$", message = "El código debe seguir el formato PRJ-AAAA-NNN (ej: PRJ-2026-001)")
    String codigo,

    @NotBlank(message = "El nombre del proyecto no puede estar vacío")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    String nombre,

    @Size(max = 1000, message = "La descripción no puede exceder los 1000 caracteres")
    String descripcion,

    @NotNull(message = "El presupuesto es obligatorio")
    @DecimalMin(value = "100.00", message = "El presupuesto mínimo de un proyecto es de 100.00 €")
    BigDecimal presupuestoTotal,

    @NotNull(message = "La latitud es obligatoria")
    @DecimalMin("-90.0") @DecimalMax("90.0")
    BigDecimal latitud,

    @NotNull(message = "La longitud es obligatoria")
    @DecimalMin("-180.0") @DecimalMax("180.0")
    BigDecimal longitud,

    @NotNull(message = "La fecha de inicio es obligatoria")
    LocalDate fechaInicio,

    @NotNull(message = "La fecha estimada de fin es obligatoria")
    LocalDate fechaFinEstimada
) {}
```

<p class="stage">Paso 2 · La entidad JPA y el Repositorio</p>

```java
package com.empresa.proyecto.proyecto.model;

import com.empresa.proyecto.usuario.model.Usuario;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "proyectos")
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoProyecto estado = EstadoProyecto.PLANIFICADO;

    @Column(name = "presupuesto_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal presupuestoTotal;

    @Column(nullable = false, precision = 8, scale = 5)
    private BigDecimal latitud;

    @Column(nullable = false, precision = 8, scale = 5)
    private BigDecimal longitud;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsable_id", nullable = false)
    private Usuario responsable;

    @Version
    private Long version;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin_estimada", nullable = false)
    private LocalDate fechaFinEstimada;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private OffsetDateTime fechaCreacion = OffsetDateTime.now();

    // Constructores, getters y setters
    public Proyecto() {}

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public EstadoProyecto getEstado() { return estado; }
    public void setEstado(EstadoProyecto estado) { this.estado = estado; }
    public BigDecimal getPresupuestoTotal() { return presupuestoTotal; }
    public void setPresupuestoTotal(BigDecimal presupuestoTotal) { this.presupuestoTotal = presupuestoTotal; }
    public BigDecimal getLatitud() { return latitud; }
    public void setLatitud(BigDecimal latitud) { this.latitud = latitud; }
    public BigDecimal getLongitud() { return longitud; }
    public void setLongitud(BigDecimal longitud) { this.longitud = longitud; }
    public Usuario getResponsable() { return responsable; }
    public void setResponsable(Usuario responsable) { this.responsable = responsable; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFinEstimada() { return fechaFinEstimada; }
    public void setFechaFinEstimada(LocalDate fechaFinEstimada) { this.fechaFinEstimada = fechaFinEstimada; }
}
```

```java
package com.empresa.proyecto.proyecto.repository;

import com.empresa.proyecto.proyecto.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    boolean existsByCodigo(String codigo);
    Optional<Proyecto> findByCodigo(String codigo);
}
```

<p class="stage">Paso 3 · La capa de Servicio con lógica de negocio</p>

```java
package com.empresa.proyecto.proyecto.service;

import com.empresa.proyecto.proyecto.dto.CrearProyectoRequest;
import com.empresa.proyecto.proyecto.dto.ProyectoDetalleResponse;
import com.empresa.proyecto.proyecto.model.Proyecto;
import com.empresa.proyecto.proyecto.repository.ProyectoRepository;
import com.empresa.proyecto.usuario.model.Usuario;
import com.empresa.proyecto.usuario.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProyectoService {

    private static final Logger log = LoggerFactory.getLogger(ProyectoService.class);

    private final ProyectoRepository proyectoRepository;
    private final UsuarioRepository usuarioRepository;

    public ProyectoService(ProyectoRepository proyectoRepository, UsuarioRepository usuarioRepository) {
        this.proyectoRepository = proyectoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public ProyectoDetalleResponse crearProyecto(CrearProyectoRequest request, String usernameResponsable) {
        log.info("Creando nuevo proyecto con código '{}' para responsable '{}'", request.codigo(), usernameResponsable);

        // Regla de negocio 1: El código de proyecto debe ser único
        if (proyectoRepository.existsByCodigo(request.codigo())) {
            throw new IllegalArgumentException("Ya existe un proyecto con el código: " + request.codigo());
        }

        // Regla de negocio 2: La fecha fin no puede ser anterior a fecha inicio
        if (request.fechaFinEstimada().isBefore(request.fechaInicio())) {
            throw new IllegalArgumentException("La fecha estimada de fin no puede ser anterior a la fecha de inicio");
        }

        Usuario responsable = usuarioRepository.findByUsername(usernameResponsable)
            .orElseThrow(() -> new IllegalStateException("Usuario responsable no encontrado en el sistema"));

        Proyecto proyecto = new Proyecto();
        proyecto.setCodigo(request.codigo());
        proyecto.setNombre(request.nombre());
        proyecto.setDescripcion(request.descripcion());
        proyecto.setPresupuestoTotal(request.presupuestoTotal());
        proyecto.setLatitud(request.latitud());
        proyecto.setLongitud(request.longitud());
        proyecto.setResponsable(responsable);
        proyecto.setFechaInicio(request.fechaInicio());
        proyecto.setFechaFinEstimada(request.fechaFinEstimada());

        proyecto = proyectoRepository.save(proyecto);
        log.info("Proyecto persistido exitosamente con ID={}", proyecto.getId());

        return new ProyectoDetalleResponse(
            proyecto.getId(),
            proyecto.getCodigo(),
            proyecto.getNombre(),
            proyecto.getEstado().name(),
            proyecto.getPresupuestoTotal(),
            responsable.getNombreCompleto()
        );
    }
}
```

<p class="stage">Paso 4 · El Controlador REST con cabecera Location</p>

```java
package com.empresa.proyecto.proyecto.controller;

import com.empresa.proyecto.proyecto.dto.CrearProyectoRequest;
import com.empresa.proyecto.proyecto.dto.ProyectoDetalleResponse;
import com.empresa.proyecto.proyecto.service.ProyectoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/proyectos")
public class ProyectoController {

    private final ProyectoService proyectoService;

    public ProyectoController(ProyectoService proyectoService) {
        this.proyectoService = proyectoService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('JEFE_PROYECTO', 'ADMINISTRADOR')")
    public ResponseEntity<ProyectoDetalleResponse> crearProyecto(
            @Valid @RequestBody CrearProyectoRequest request,
            @AuthenticationPrincipal UserDetails usuario) {

        ProyectoDetalleResponse response = proyectoService.crearProyecto(request, usuario.getUsername());

        // Cabecera Location estándar: http://localhost:8080/api/v1/proyectos/{id}
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(response.id())
            .toUri();

        return ResponseEntity.created(location).body(response);
    }
}
```

### La comprobación · Prueba de Integración con MockMvc

Verificamos el corte vertical con una prueba que recorre todas las capas sin levantar el navegador:

```java
package com.empresa.proyecto.proyecto;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProyectoCorteVerticalIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "jefe1", roles = {"JEFE_PROYECTO"})
    void crearProyecto_conDatosValidos_devuelve201YCabeceraLocation() throws Exception {
        var payload = Map.of(
            "codigo", "PRJ-2026-099",
            "nombre", "Parque Eólico La Muela",
            "descripcion", "Instalación de 10 aerogeneradores",
            "presupuestoTotal", 450000.00,
            "latitud", 41.58,
            "longitud", -1.12,
            "fechaInicio", "2026-04-01",
            "fechaFinEstimada", "2026-12-31"
        );

        mockMvc.perform(post("/api/v1/proyectos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
            .andExpect(status().isCreated())
            .andExpect(header().exists("Location"))
            .andExpect(jsonPath("$.codigo").value("PRJ-2026-099"))
            .andExpect(jsonPath("$.estado").value("PLANIFICADO"));
    }
}
```

### Ahora tú · Implementar el segundo corte: Consulta de Proyecto por ID

Construye el corte vertical simétrico de lectura:
1. Implementa `GET /api/v1/proyectos/{id}`.
2. Si el proyecto existe, devuelve `200 OK` con el DTO `ProyectoDetalleResponse`.
3. Si no existe, lanza una excepción de recurso no encontrado capturada por el `GlobalExceptionHandler` devolviendo `404 Not Found` en formato Problem Details RFC 7807.
4. Añade el test correspondiente en MockMvc verificando tanto el caso de éxito (`200`) como el de recurso inexistente (`404`).

### Reto · Generación automática y atómica del código de proyecto

En lugar de que el usuario introduzca el código manualmente (`PRJ-2026-001`), automatiza su generación en el servicio:
1. Diseña un método en el repositorio que obtenga el número secuencial más alto del año en curso.
2. Formatea la cadena de forma atómica (`PRJ-` + año actual + `-` + número formateado a 3 dígitos con ceros a la izquierda).
3. Asegura mediante control de concurrencia que si dos usuarios dan de alta un proyecto simultáneamente, no se produzca un choque de clave duplicada.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Corte vertical de creación operativo con DTO, servicio, entidad y respuesta 201.</span></div>
  <div><strong>Si lo tienes</strong><span>Cabecera `Location`, validación de fechas, seguridad por rol y test con MockMvc.</span></div>
  <div><strong>Reto</strong><span>Generación secuencial atómica del código de proyecto tolerante a concurrencia.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 72</p>
  <ul class="checklist">
    <li>Se adopta la metodología de desarrollo por cortes verticales frente al diseño por capas aisladas.</li>
    <li>El Walking Skeleton de la aplicación está vivo, persistiendo datos reales en PostgreSQL.</li>
    <li>La petición `POST` emite correctamente el código `201 Created` y la cabecera `Location`.</li>
    <li>Las reglas de negocio de fechas y códigos duplicados están protegidas en la capa de servicio.</li>
    <li>Un test de integración automatizado con MockMvc valida todo el circuito de extremo a extremo.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué el enfoque de corte vertical reduce el riesgo técnico al inicio de un proyecto?</li>
    <li>¿Qué información debe contener la cabecera HTTP `Location` en una respuesta `201 Created`?</li>
    <li>¿Por qué la validación de que la fecha de fin sea posterior a la de inicio se implementa en el servicio y no solo con anotaciones estándar de campo en el DTO?</li>
    <li>¿Qué papel cumple la anotación `@WithMockUser` en los tests de integración con MockMvc?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque valida inmediatamente la integración de todas las piezas (red, serialización, seguridad, lógica de negocio y base de datos) desde el primer día, detectando problemas arquitectónicos antes de que se extiendan a otras entidades.</p>
  <p>2 · La URI absoluta del recurso recién creado (por ejemplo: http://servidor/api/v1/proyectos/42) para que el cliente pueda consultarlo o enlazarlo de inmediato sin construir la URL a ciegas.</p>
  <p>3 · Porque involucra la comparación cruzada entre dos campos distintos del DTO, requiriendo validaciones a nivel de clase o lógica de negocio en el servicio.</p>
  <p>4 · Inyecta un usuario simulado en el SecurityContext de Spring Security durante la ejecución del test, permitiendo verificar endpoints protegidos sin necesidad de generar un token JWT real.</p>
</details>


## Semana 25 · Desarrollo e integración

## Sesión 73 · Desarrollo I: núcleo funcional

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> intentar cubrir todo a la vez dispersa el esfuerzo y deja muchas piezas a medias.</li>
    <li><strong>Construye:</strong> el núcleo funcional integrado con sus primeras pruebas.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **completar los casos de uso de mayor valor manteniendo verde la versión ejecutable**.

### 2. El problema

Intentar cubrir todo a la vez dispersa el esfuerzo y deja muchas piezas a medias.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido el núcleo funcional integrado con sus primeras pruebas.</li>
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

## Sesión 74 · Desarrollo II: seguridad e integración

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> seguridad e integración añadidas al final suelen revelar supuestos tardíos y costosos.</li>
    <li><strong>Construye:</strong> flujos protegidos y una integración con degradación controlada.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **incorporar identidad, permisos y servicio externo sin romper los contratos existentes**.

### 2. El problema

Seguridad e integración añadidas al final suelen revelar supuestos tardíos y costosos.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido flujos protegidos y una integración con degradación controlada.</li>
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

## Sesión 75 · Integración con Angular

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una API que funciona en Postman todavía puede fallar al enfrentarse a un navegador, un origen distinto y el modelo de datos del cliente.</li>
    <li><strong>Construye:</strong> un flujo completo Angular → API Spring Boot → PostgreSQL, manteniendo la colección HTTP como prueba independiente.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **conectar el cliente Angular a la API, resolver el contrato real y diagnosticar CORS, autenticación y errores de integración**.

### 2. El problema

Una API que funciona en Postman todavía puede fallar al enfrentarse a un navegador, un origen distinto y el modelo de datos del cliente.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un flujo completo Angular → API Spring Boot → PostgreSQL, manteniendo la colección HTTP como prueba independiente.</li>
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

## Semana 26 · Demostrar que está terminado

## Sesión 76 · Testing y revisión

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una batería grande de tests triviales no demuestra que los flujos críticos estén protegidos.</li>
    <li><strong>Construye:</strong> un informe breve de riesgos, cobertura útil y defectos corregidos.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **ejecutar una revisión basada en riesgos y cubrir las regresiones más costosas**.

### 2. El problema

Una batería grande de tests triviales no demuestra que los flujos críticos estén protegidos.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un informe breve de riesgos, cobertura útil y defectos corregidos.</li>
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

## Sesión 77 · Documentación y refactorización

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> documentar una versión anterior o refactorizar sin pruebas deja una entrega difícil de reproducir.</li>
    <li><strong>Construye:</strong> README, OpenAPI y código coherentes con la misma versión.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **sincronizar contrato, puesta en marcha y decisiones técnicas mientras se reduce deuda visible**.

### 2. El problema

Documentar una versión anterior o refactorizar sin pruebas deja una entrega difícil de reproducir.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido README, OpenAPI y código coherentes con la misma versión.</li>
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

## Sesión 78 · Defensa técnica

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una presentación comercial no permite evaluar la comprensión técnica ni la honestidad sobre los límites.</li>
    <li><strong>Construye:</strong> una demostración reproducible y una defensa técnica del trabajo realizado.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **demostrar el producto y argumentar decisiones, límites y mejoras con evidencias**.

### 2. El problema

Una presentación comercial no permite evaluar la comprensión técnica ni la honestidad sobre los límites.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una demostración reproducible y una defensa técnica del trabajo realizado.</li>
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
    <li>Traducir una especificación en un modelo, un contrato y una arquitectura.</li>
    <li>Implementar un backend completo con persistencia, seguridad e integraciones.</li>
    <li>Conectar un cliente Angular sin hacer que la comprobación del backend dependa de él.</li>
    <li>Probar, documentar y refactorizar antes de entregar.</li>
    <li>Defender técnicamente las decisiones y reconocer las limitaciones del resultado.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

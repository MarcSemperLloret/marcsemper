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

<div class="rule">
  <p class="rule-label">Qué traes puesto al empezar</p>
  <p>No se parte de cero: se parte de once unidades. El <strong>modelo y las relaciones</strong> vienen de la UD5, el <strong>diseño de recursos, DTO, validación y errores</strong> de la UD3, la <strong>separación en capas</strong> de la UD4, los <strong>filtros, la paginación y OpenAPI</strong> de la UD7, <strong>CORS</strong> de la UD8, la <strong>autenticación con JWT y la matriz de permisos</strong> de la UD9, el <strong>cliente saliente resiliente y los adjuntos</strong> de la UD10 y la <strong>estrategia de pruebas y de logs</strong> de la UD11.</p>
  <p>Lo único que se añade aquí es la decisión: qué usar de todo eso, en qué orden y por qué. Esa justificación es lo que se defiende en la sesión 78.</p>
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

### Los tres vicios de una especificación mal escrita

Antes de redactar la tuya, aprende a reconocer lo que la invalida. Los tres aparecen siempre y los tres se arreglan con la misma medicina: **un número**.

<dl class="worked">
  <dt>1 · El requisito que no se puede comprobar</dt>
  <dd><em>«El sistema debe ser rápido.»</em> ¿Cuánto es rápido? Nadie puede decir si eso se ha cumplido, así que no es un requisito: es un deseo. La versión utilizable es <em>«el listado de proyectos responde en menos de 300 ms con 500 proyectos en la base de datos»</em>. Ahora se puede medir, y por tanto se puede aprobar o suspender.</dd>
  <dt>2 · El requisito que esconde una decisión</dt>
  <dd><em>«Un proyecto no puede cerrarse si tiene tareas pendientes.»</em> Parece cerrado y no lo está: ¿qué es «pendiente»? ¿Cuenta una tarea bloqueada? ¿Y una cancelada? Enumera los estados concretos, o descubrirás la ambigüedad el día de la demostración.</dd>
  <dt>3 · El requisito que solo describe el camino feliz</dt>
  <dd><em>«El usuario adjunta una fotografía a la incidencia.»</em> ¿Y si pesa 40 MB? ¿Y si es un <code>.exe</code>? ¿Y si el disco está lleno? Cada caso de uso necesita, como mínimo, un escenario de rechazo con su código HTTP. Si tu especificación solo tiene escenarios que terminan bien, no has especificado: has ilustrado.</dd>
</dl>

### Ahora tú · Redactar la especificación formal del proyecto

Elabora el documento de especificación formal de tu proyecto backend:

1. Define los 4 actores y la matriz de control de acceso basada en roles (RBAC), con el mismo formato de la sesión 53: una fila por endpoint y método, una columna por rol y el código HTTP esperado en cada casilla. Esta tabla es el contrato de seguridad y va a ser lo que se pruebe en la sesión 76.
2. Detalla al menos **6 casos de uso** con sus escenarios *Given-When-Then*. Cada uno necesita un escenario feliz **y al menos dos de rechazo**, con su código de estado.
3. Enumera **5 reglas de negocio invariantes** que tu código garantizará siempre. Una invariante es una afirmación que nunca puede ser falsa: «la suma de costes de las tareas no supera el presupuesto del proyecto» lo es; «el usuario debería revisar el presupuesto» no lo es.
4. Para cada invariante, escribe **dónde va a vivir**: ¿una restricción `CHECK` en PostgreSQL, una validación en el DTO, una comprobación en el servicio? Esta columna es la que convierte la especificación en un plan de trabajo, y es la que dicta el modelo de la sesión 71.
5. **Pasa la prueba de la ambigüedad:** dale la especificación a otro equipo y pídeles que anoten cada punto donde tengan que suponer algo. Cada suposición es un hueco. Los que no cierres ahora se convertirán en una discusión en la semana 26, cuando ya no haya tiempo.
6. Marca lo que **no** vas a hacer. Una especificación sin alcance excluido es una especificación que crecerá hasta que se acabe el plazo. «No habrá recuperación de contraseña por correo» es una decisión legítima y defendible, siempre que esté escrita.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Cada requisito se puede comprobar con una petición HTTP y un resultado esperado; cada caso de uso tiene escenarios de rechazo además del feliz; cada invariante tiene asignado el sitio donde se hará cumplir; otro equipo ha leído el documento y su lista de suposiciones está vacía o resuelta; y hay un apartado que dice qué queda fuera.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Si en la evaluación se solicita la memoria formal de análisis y especificación del proyecto, el formato oficial de entrega de texto es siempre un <strong>documento en PDF</strong> (<code>especificacion-proyecto.pdf</code>), nunca un archivo markdown suelto.</p>
</div>

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
    <li>¿Por qué en entornos de producción está terminantemente prohibido utilizar <code>spring.jpa.hibernate.ddl-auto=update</code> o <code>create-drop</code>?</li>
    <li>¿Por qué nunca se debe utilizar el tipo de datos <code>DOUBLE</code> o <code>FLOAT</code> para almacenar cantidades monetarias o presupuestos en una base de datos?</li>
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
('admin', '<pega aquí tu hash de Password123!>', 'Administrador General', 'admin@empresa.com', 'ADMINISTRADOR'),
('jefe1', '<pega aquí tu hash de Password123!>', 'Elena Torres', 'elena.torres@empresa.com', 'JEFE_PROYECTO'),
('operario1', '<pega aquí tu hash de Password123!>', 'Carlos Ramos', 'carlos.ramos@empresa.com', 'DESARROLLADOR');

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
com.ejemplo.gestor/
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

<div class="rule">
  <p class="rule-label">Por qué cambiamos de criterio justo ahora</p>
  <p>Durante once unidades has organizado por capas: <code>controller</code>, <code>service</code>, <code>repository</code>, <code>model</code>, <code>dto</code>. Era lo correcto mientras aprendías qué hace cada capa, porque el paquete enseñaba la arquitectura.</p>
  <p>Con el proyecto ya crecido, ese criterio empieza a estorbar: tocar «las tareas» obliga a abrir cinco paquetes distintos, y dos personas trabajando en dominios diferentes chocan en los mismos directorios. Organizar por funcionalidad junta lo que cambia junto. <strong>Las capas no desaparecen</strong>: siguen existiendo dentro de cada paquete de dominio. Lo que cambia es qué se pone en el primer nivel.</p>
  <p>No hay una opción correcta: hay una que encaja mejor con el tamaño del proyecto y con cuánta gente lo toca a la vez. Poder argumentar eso es lo que se evalúa.</p>
</div>

Además de mover paquetes, completa estas cuatro decisiones de modelo y anota la razón de cada una en el cuaderno de diseño:

1. **Tipos de los campos delicados.** El dinero nunca es `double`: `BigDecimal` en Java y `NUMERIC(12,2)` en PostgreSQL, porque un `double` no puede representar exactamente 0,10 y los céntimos se pierden al sumar. Las fechas sin hora son `LocalDate`, no `Date`.
2. **Qué es obligatorio en la base de datos y no solo en el DTO.** Una validación de Bean Validation protege de un cliente descuidado; un `NOT NULL` protege de un `INSERT` hecho a mano, de una migración y de un fallo tuyo. Las reglas que no pueden violarse nunca van en los dos sitios.
3. **Qué se borra en cascada y qué no.** Borrar un proyecto, ¿borra sus tareas? ¿Y sus incidencias con adjuntos en disco? Decídelo explícitamente: por omisión, PostgreSQL rechazará el borrado y te encontrarás un `500` que en realidad era una regla de negocio sin declarar.
4. **Qué índices necesitas.** Todo campo por el que filtres o busques (el `codigo` del proyecto, la clave ajena de tarea a proyecto, el `username`) merece un índice. Sin ellos, la paginación de la UD7 hace un recorrido completo de la tabla en cada página.

### Reto · Versionado formal con Flyway

En lugar de recargar `schema.sql` en cada arranque, investiga la herramienta **Flyway**:
1. Añade la dependencia `org.flywaydb:flyway-core` y `flyway-database-postgresql`.
2. Estructura los scripts de migración en la carpeta `src/main/resources/db/migration/`:
   * `V1__crear_esquema_inicial.sql`
   * `V2__anadir_indices_y_semillas.sql`
3. Comprueba cómo Flyway crea la tabla `flyway_schema_history` garantizando que las migraciones solo se aplican una vez y de forma estrictamente incremental.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Script <code>schema.sql</code> con claves primarias, foráneas y tipos de datos óptimos.</span></div>
  <div><strong>Si lo tienes</strong><span>Restricciones de chequeo (<code>CHECK</code>), índices estratégicos y modo <code>ddl-auto=validate</code>.</span></div>
  <div><strong>Reto</strong><span>Migraciones incrementales versionadas gestionadas automáticamente con Flyway.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 71</p>
  <ul class="checklist">
    <li>Se erradica la dependencia de Hibernate para alterar el esquema en entornos reales.</li>
    <li>Los importes monetarios están blindados con tipos decimales exactos (<code>NUMERIC</code> / <code>BigDecimal</code>).</li>
    <li>Las restricciones de integridad referencial (<code>ON DELETE RESTRICT</code>) impiden borrados accidentales.</li>
    <li>Se crean índices específicos sobre claves foráneas y campos frecuentes de filtrado.</li>
    <li>La arquitectura de paquetes por componente favorece la mantenibilidad y el trabajo en equipo.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué el modo <code>spring.jpa.hibernate.ddl-auto=validate</code> es el más seguro para producción?</li>
    <li>¿Por qué debe evitarse <code>ON DELETE CASCADE</code> en entidades que contienen información contable o de auditoría?</li>
    <li>¿Qué beneficio aporta crear un índice sobre la columna de una clave foránea en una tabla hija?</li>
    <li>¿Por qué se utiliza el tipo <code>TIMESTAMP WITH TIME ZONE</code> en lugar de una simple fecha sin zona horaria?</li>
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
    <li>¿Por qué la respuesta a una petición <code>POST</code> exitosa de creación de recurso debe incluir la cabecera HTTP <code>Location</code>?</li>
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
package com.ejemplo.gestor.proyecto.dto;

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
    Double latitud,

    @NotNull(message = "La longitud es obligatoria")
    @DecimalMin("-180.0") @DecimalMax("180.0")
    Double longitud,

    @NotNull(message = "La fecha de inicio es obligatoria")
    LocalDate fechaInicio,

    @NotNull(message = "La fecha estimada de fin es obligatoria")
    LocalDate fechaFinEstimada
) {}
```

<p class="stage">Paso 2 · La entidad JPA y el Repositorio</p>

```java
package com.ejemplo.gestor.proyecto.model;

import com.ejemplo.gestor.usuario.model.Usuario;
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

    // Coordenadas: Double, no BigDecimal. La precisión decimal exacta
    // solo hace falta donde un redondeo cuesta dinero, y ese es el caso
    // del presupuesto, no el de una latitud.
    @Column(nullable = false)
    private Double latitud;

    @Column(nullable = false)
    private Double longitud;

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
    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }
    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }
    public Usuario getResponsable() { return responsable; }
    public void setResponsable(Usuario responsable) { this.responsable = responsable; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFinEstimada() { return fechaFinEstimada; }
    public void setFechaFinEstimada(LocalDate fechaFinEstimada) { this.fechaFinEstimada = fechaFinEstimada; }
}
```

```java
package com.ejemplo.gestor.proyecto.repository;

import com.ejemplo.gestor.proyecto.model.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    boolean existsByCodigo(String codigo);
    Optional<Proyecto> findByCodigo(String codigo);
}
```

<p class="stage">Paso 3 · La capa de Servicio con lógica de negocio</p>

```java
package com.ejemplo.gestor.proyecto.service;

import com.ejemplo.gestor.proyecto.dto.CrearProyectoRequest;
import com.ejemplo.gestor.proyecto.dto.ProyectoDetalleResponse;
import com.ejemplo.gestor.proyecto.model.Proyecto;
import com.ejemplo.gestor.proyecto.repository.ProyectoRepository;
import com.ejemplo.gestor.usuario.model.Usuario;
import com.ejemplo.gestor.usuario.repository.UsuarioRepository;
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
package com.ejemplo.gestor.proyecto.controller;

import com.ejemplo.gestor.proyecto.dto.CrearProyectoRequest;
import com.ejemplo.gestor.proyecto.dto.ProyectoDetalleResponse;
import com.ejemplo.gestor.proyecto.service.ProyectoService;
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
package com.ejemplo.gestor.proyecto;

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
  <div><strong>Si lo tienes</strong><span>Cabecera <code>Location</code>, validación de fechas, seguridad por rol y test con MockMvc.</span></div>
  <div><strong>Reto</strong><span>Generación secuencial atómica del código de proyecto tolerante a concurrencia.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 72</p>
  <ul class="checklist">
    <li>Se adopta la metodología de desarrollo por cortes verticales frente al diseño por capas aisladas.</li>
    <li>El Walking Skeleton de la aplicación está vivo, persistiendo datos reales en PostgreSQL.</li>
    <li>La petición <code>POST</code> emite correctamente el código <code>201 Created</code> y la cabecera <code>Location</code>.</li>
    <li>Las reglas de negocio de fechas y códigos duplicados están protegidas en la capa de servicio.</li>
    <li>Un test de integración automatizado con MockMvc valida todo el circuito de extremo a extremo.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué el enfoque de corte vertical reduce el riesgo técnico al inicio de un proyecto?</li>
    <li>¿Qué información debe contener la cabecera HTTP <code>Location</code> en una respuesta <code>201 Created</code>?</li>
    <li>¿Por qué la validación de que la fecha de fin sea posterior a la de inicio se implementa en el servicio y no solo con anotaciones estándar de campo en el DTO?</li>
    <li>¿Qué papel cumple la anotación <code>@WithMockUser</code> en los tests de integración con MockMvc?</li>
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
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> a priorizar los casos de uso por valor de negocio frente a dispersar el esfuerzo, el modelado de relaciones entre agregados (<code>Proyecto</code> ↔ <code>Tarea</code>), la protección de reglas de integridad presupuestaria mediante transacciones ACID y la paginación eficiente de resultados con <code>Pageable</code>.</li>
    <li><strong>2. Haz:</strong> implementa los casos de uso de alta de tareas vinculadas con cálculo de techo presupuestario, cambio de estado regulado por máquina de estados y cierre atómico de proyectos condicionado a la resolución de tareas.</li>
    <li><strong>3. Comprueba:</strong> ejecutas pruebas en Bruno intentando sobrepasar el presupuesto del proyecto o cerrar un proyecto con tareas pendientes, verificando que el backend responde con los códigos semánticos <code>400 Bad Request</code> y <code>409 Conflict</code> protegiendo la base de datos de inconsistencias.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué intentar programar todas las entidades secundarias a la vez suele dejar el backend con muchos endpoints a medias y ninguno completamente probado?</li>
    <li>¿Qué ocurriría si dos usuarios crean tareas simultáneas en el mismo proyecto y la comprobación del presupuesto disponible no se ejecuta dentro de una transacción con aislamiento adecuado?</li>
    <li>¿Por qué los endpoints que devuelven colecciones de datos siempre deben implementar paginación mediante <code>Pageable</code> en lugar de devolver listas completas con <code>findAll()</code>?</li>
  </ol>
</div>

### La trampa de la dispersión frente al núcleo funcional

Cuando un desarrollador afronta un proyecto grande, la tentación habitual es crear quince entidades y diez controladores a la vez: la entidad de etiquetas, la de comentarios, la de historial, la de categorías...
* Al final de la jornada tiene miles de líneas de código escritas, pero **ningún caso de uso funciona de verdad**.
* No puede hacer una demo a su cliente ni pasar un test de integración real.

El desarrollo profesional se rige por la **priorización por valor**:
* Identifica los **dos agregados centrales** que dan sentido al negocio (en nuestro caso: `Proyecto` y `Tarea`).
* Implementa sus relaciones y reglas más complejas antes de añadir adornos secundarios.

<div class="rule">
  <p class="rule-label">La ley del núcleo de negocio</p>
  <p><strong>Un proyecto sin entidades secundarias es un producto viable; un proyecto con diez entidades a medias es chatarra.</strong></p>
  <p>Construye y prueba a fondo las reglas más críticas del dominio (presupuestos, transiciones de estado e integridad referencial) antes de dedicar tiempo a comentarios, avatares o filtros decorativos.</p>
</div>

### Reglas de negocio e integridad entre Agregados

En nuestro dominio empresarial, un `Proyecto` actúa como **raíz de agregado (*Aggregate Root*)** sobre sus `Tareas`:

<figure class="diagram">
  <figcaption>El ciclo de vida transaccional Proyecto-Tarea</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Proyecto creado con presupuesto total de 50.000 €</li>
    <li>2. Alta de Tarea A (coste 20.000 €) -> Aceptada (acumulado 20.000 €)</li>
    <li>3. Alta de Tarea B (coste 25.000 €) -> Aceptada (acumulado 45.000 €)</li>
    <li>4. Alta de Tarea C (coste 10.000 €) -> Rechazada (45.000 + 10.000 > 50.000)</li>
    <li>5. Cierre de Proyecto -> Solo permitido si Tareas A y B están FINALIZADAS</li>
  </ol>
</figure>

### Paso a paso guiado · Implementación del núcleo transaccional

<p class="stage">Paso 1 · El repositorio con consultas agregadas de coste</p>

Necesitamos saber de forma instantánea cuánto presupuesto se ha consumido sin traernos todas las tareas a memoria:

```java
package com.ejemplo.gestor.tarea.repository;

import com.ejemplo.gestor.tarea.model.EstadoTarea;
import com.ejemplo.gestor.tarea.model.Tarea;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface TareaRepository extends JpaRepository<Tarea, Long> {

    // Paginación eficiente de tareas por proyecto
    Page<Tarea> findByProyectoId(Long proyectoId, Pageable pageable);

    // Sumatorio de costes en base de datos (rendimiento óptimo en SQL)
    @Query("SELECT COALESCE(SUM(t.costeEstimado), 0.0) FROM Tarea t WHERE t.proyecto.id = :proyectoId")
    BigDecimal calcularCosteTotalEstimadoProyecto(@Param("proyectoId") Long proyectoId);

    // Conteo de tareas no finalizadas para validar el cierre
    long countByProyectoIdAndEstadoNot(Long proyectoId, EstadoTarea estado);
}
```

<p class="stage">Paso 2 · Lógica de negocio en TareaService</p>

```java
package com.ejemplo.gestor.tarea.service;

import com.ejemplo.gestor.proyecto.model.Proyecto;
import com.ejemplo.gestor.proyecto.repository.ProyectoRepository;
import com.ejemplo.gestor.tarea.dto.CrearTareaRequest;
import com.ejemplo.gestor.tarea.dto.TareaResponse;
import com.ejemplo.gestor.tarea.model.EstadoTarea;
import com.ejemplo.gestor.tarea.model.Tarea;
import com.ejemplo.gestor.tarea.repository.TareaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;
    private final ProyectoRepository proyectoRepository;

    public TareaService(TareaRepository tareaRepository, ProyectoRepository proyectoRepository) {
        this.tareaRepository = tareaRepository;
        this.proyectoRepository = proyectoRepository;
    }

    @Transactional
    public TareaResponse crearTarea(Long proyectoId, CrearTareaRequest request) {
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
            .orElseThrow(() -> new IllegalArgumentException("Proyecto no encontrado"));

        // Regla 1: No se pueden añadir tareas a proyectos cerrados o cancelados
        if (proyecto.getEstado().esTerminal()) {
            throw new IllegalStateException("No se pueden añadir tareas a un proyecto en estado " + proyecto.getEstado());
        }

        // Regla 2: El sumatorio de costes no puede superar el presupuesto total del proyecto
        BigDecimal costeActual = tareaRepository.calcularCosteTotalEstimadoProyecto(proyectoId);
        BigDecimal nuevoTotal = costeActual.add(request.costeEstimado());

        if (nuevoTotal.compareTo(proyecto.getPresupuestoTotal()) > 0) {
            throw new IllegalArgumentException(String.format(
                "Presupuesto excedido. Presupuesto proyecto: %.2f €, Coste actual: %.2f €, Nueva tarea: %.2f €",
                proyecto.getPresupuestoTotal(), costeActual, request.costeEstimado()
            ));
        }

        Tarea tarea = new Tarea();
        tarea.setTitulo(request.titulo());
        tarea.setPrioridad(request.prioridad());
        tarea.setCosteEstimado(request.costeEstimado());
        tarea.setProyecto(proyecto);
        tarea.setEstado(EstadoTarea.PENDIENTE);

        tarea = tareaRepository.save(tarea);
        return new TareaResponse(tarea.getId(), tarea.getTitulo(), tarea.getEstado().name(), tarea.getCosteEstimado());
    }
}
```

<p class="stage">Paso 3 · Caso de uso: Cierre atómico del Proyecto</p>

```java
    @Transactional
    public void cerrarProyecto(Long proyectoId) {
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
            .orElseThrow(() -> new IllegalArgumentException("Proyecto no encontrado"));

        // Verificamos si existen tareas pendientes de finalizar
        long tareasPendientes = tareaRepository.countByProyectoIdAndEstadoNot(proyectoId, EstadoTarea.FINALIZADA);

        if (tareasPendientes > 0) {
            // Lanzamos excepción específica de conflicto de negocio
            throw new ConflictoNegocioException(String.format(
                "No se puede cerrar el proyecto '%s': tiene %d tareas sin finalizar.",
                proyecto.getCodigo(), tareasPendientes
            ));
        }

        proyecto.setEstado(EstadoProyecto.FINALIZADO);
        proyectoRepository.save(proyecto);
    }
```

<p class="stage">Paso 4 · Controlador REST de Tareas con Paginación</p>

```java
package com.ejemplo.gestor.tarea.controller;

import com.ejemplo.gestor.tarea.dto.CrearTareaRequest;
import com.ejemplo.gestor.tarea.dto.TareaResponse;
import com.ejemplo.gestor.tarea.service.TareaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/proyectos/{proyectoId}/tareas")
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('JEFE_PROYECTO', 'ADMINISTRADOR')")
    public ResponseEntity<TareaResponse> crearTarea(
            @PathVariable Long proyectoId,
            @Valid @RequestBody CrearTareaRequest request) {

        TareaResponse response = tareaService.crearTarea(proyectoId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<TareaResponse>> listarTareas(
            @PathVariable Long proyectoId,
            @PageableDefault(size = 10, sort = "prioridad") Pageable pageable) {

        return ResponseEntity.ok(tareaService.listarTareasProyecto(proyectoId, pageable));
    }
}
```

### La comprobación · Batería de pruebas en Bruno

1. **Creación dentro de presupuesto:**
   * Lanza `POST /api/v1/proyectos/1/tareas` con coste de `5000.00 €`.
   * **Resultado:** Código **`201 Created`**.
2. **Prueba de estrés de regla de negocio (Exceso de presupuesto):**
   * Lanza otra tarea con coste `200000.00 €` sobre un proyecto que solo dispone de `150000.00 €`.
   * **Resultado:** Código **`400 Bad Request`** con detalle:
     `"Presupuesto excedido. Presupuesto proyecto: 150000.00 €, Coste actual: 37000.00 €, Nueva tarea: 200000.00 €"`.
   * Ninguna fila queda guardada en la tabla `tareas`.
3. **Prueba de conflicto en cierre:**
   * Lanza `POST /api/v1/proyectos/1/cerrar`.
   * **Resultado:** Código **`409 Conflict`** indicando que existen tareas pendientes. El estado del proyecto permanece inalterado en `EN_CURSO`.

### Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| La regla de negocio se salta cuando llamas desde otro método del servicio | Llamada interna: el proxy de `@Transactional` no interviene | Extrae el método a otro bean, o llama siempre desde fuera |
| El `rollback` no revierte nada | La excepción es comprobada (*checked*) | Spring solo revierte ante `RuntimeException` salvo que declares `rollbackFor` |
| Dos peticiones simultáneas se saltan el límite de presupuesto | Condición de carrera clásica | Es exactamente el reto de esta sesión: bloqueo pesimista sobre la fila del proyecto |
| El `409` sale como `500` | Falta el `@ExceptionHandler` de tu excepción de negocio | Tu `@RestControllerAdvice` de la UD3 debe conocer la excepción nueva |
| `LazyInitializationException` al construir la respuesta | Estás leyendo una relación fuera de la transacción | Mapea a DTO **dentro** del servicio, no en el controlador |

### Ahora tú · Máquina de estados para Tareas

Implementa el endpoint de transición de estados de tarea:
1. Diseña `PATCH /api/v1/tareas/{id}/estado`.
2. Define las transiciones permitidas:
   * `PENDIENTE` → `EN_CURSO`
   * `EN_CURSO` → `BLOQUEADA` (requiere indicar motivo de bloqueo) o `FINALIZADA`
   * `BLOQUEADA` → `EN_CURSO`
3. Si el cliente intenta saltarse un estado (por ejemplo, pasar directamente de `PENDIENTE` a `FINALIZADA`), el servicio debe rechazar la mutación con `409 Conflict`.
4. **Escribe la tabla de transiciones antes que el código.** Con 4 estados hay 16 combinaciones posibles; solo cuatro son legales. Escríbelas todas en una tabla y decide qué pasa con cada una: eso es lo que evita que la regla acabe siendo una escalera de `if` inconexos que nadie puede auditar.
5. **Modélalo dentro del enum**, no en el servicio. Un método `puedeTransitarA(EstadoTarea destino)` en el propio `EstadoTarea` mantiene la regla junto al dato al que pertenece, y hace imposible olvidarla en un segundo sitio.
6. Prueba las cuatro transiciones legales y **al menos tres ilegales**. Comprueba que las ilegales devuelven `409` con un `detail` que dice qué transición se intentó y cuáles eran posibles: un `409` sin explicación obliga al cliente a adivinar.
7. Comprueba el caso que casi nadie prueba: transitar a **el mismo estado** en el que ya está. Decide si es un `409`, un `204` inocuo o una operación idempotente que responde `200`. Cualquiera se defiende; no haberlo pensado, no.
8. Escribe el test de la regla antes de darla por terminada. Es una de las que la sesión 76 clasificará como riesgo crítico, porque afecta a la integridad de los datos.

### Reto · Control de concurrencia pesimista en presupuestos

Si dos usuarios añaden tareas simultáneamente al mismo proyecto en milisegundos idénticos, ambos podrían leer el mismo coste actual acumulado antes de que el otro guarde su fila (*Race Condition*), superando el presupuesto total.

Investiga cómo resolver esta condición de carrera:
1. Utiliza `@Lock(LockModeType.PESSIMISTIC_WRITE)` en la consulta de búsqueda de `Proyecto` para bloquear la fila en PostgreSQL durante la transacción.
2. Comprueba mediante un test concurrente multihilo que las dos creaciones se serializan y la segunda es rechazada correctamente por falta de saldo.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Relación Proyecto-Tarea operativa con consultas paginadas y respuesta 201.</span></div>
  <div><strong>Si lo tienes</strong><span>Cálculo atómico de techo presupuestario y rechazo 409 al cerrar con tareas pendientes.</span></div>
  <div><strong>Reto</strong><span>Bloqueo pesimista (<code>PESSIMISTIC_WRITE</code>) para blindar el presupuesto ante concurrencia extrema.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 73</p>
  <ul class="checklist">
    <li>Se prioriza el desarrollo del núcleo de negocio antes de incorporar entidades accesorias.</li>
    <li>Las operaciones de cálculo se delegan eficientemente en la base de datos SQL (<code>SUM</code>, <code>COUNT</code>).</li>
    <li>La regla de techo presupuestario está garantizada en la capa de servicios mediante transacciones.</li>
    <li>Las listas de datos utilizan paginación estándar (<code>Pageable</code>) para proteger la memoria RAM.</li>
    <li>El cierre de proyectos respeta la integridad de sus tareas emitiendo código <code>409 Conflict</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es más eficiente calcular el sumatorio de costes con <code>SUM</code> en SQL que iterar una lista Java en memoria?</li>
    <li>¿Qué código de estado HTTP estándar de la RFC 9110 debe devolverse cuando una acción choca con el estado actual del negocio?</li>
    <li>¿Por qué el método de servicio que verifica y descuenta el presupuesto debe estar anotado con <code>@Transactional</code>?</li>
    <li>¿Qué ventajas aporta la anotación <code>@PageableDefault</code> en los métodos de un controlador REST?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque la base de datos procesa millones de filas de forma indexada en milisegundos y devuelve solo un número decimal por la red, mientras que iterar en Java exige transferir miles de entidades y saturar la memoria RAM.</p>
  <p>2 · El código 409 Conflict (indica que la petición no puede procesarse debido a un conflicto con el estado actual del recurso).</p>
  <p>3 · Para garantizar la atomicidad y el aislamiento ACID: si la comprobación pasa y la tarea se guarda, la operación se confirma; si algo falla, no se modifica la base de datos.</p>
  <p>4 · Permite definir valores por defecto sensatos (tamaño de página, campo de ordenación y dirección ascendente/descendente) si el cliente no envía los parámetros en la URL.</p>
</details>

## Sesión 74 · Desarrollo II: seguridad e integración

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el cierre del perímetro de seguridad, la autorización granular por propiedad del recurso (<em>Domain-Level Security</em>) evaluando si el usuario es el responsable asignado, y la integración robusta del cliente saliente de meteorología y el servicio de ficheros con degradación elegante.</li>
    <li><strong>2. Haz:</strong> implementa un evaluador de seguridad personalizado en Spring Security (<code>@seguridadService.esResponsable(...)</code>), conecta el cliente <code>ClimaService</code> con timeouts estrictos y añade el soporte de adjuntos multipart sanitizados con UUID.</li>
    <li><strong>3. Comprueba:</strong> verificas con tokens JWT de distintos roles que un jefe de proyecto no puede modificar los proyectos de otro, que los operarios solo acceden a sus tareas y que la caída de la API de Open-Meteo no bloquea el alta de incidencias.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué una comprobación simple de roles como <code>@PreAuthorize("hasRole('JEFE_PROYECTO')")</code> no es suficiente para evitar que un usuario modifique datos ajenos?</li>
    <li>¿Cómo se define una expresión SpEL (Spring Expression Language) para delegar la autorización en un bean de Spring propio?</li>
    <li>¿Qué ocurre con la experiencia del usuario si el servicio externo de meteorología sufre una caída de red durante el registro de una incidencia en obra?</li>
  </ol>
</div>

### Más allá de los roles: Autorización basada en la propiedad del dato

Comprobar roles (`ADMINISTRADOR`, `JEFE_PROYECTO`, `DESARROLLADOR`) es solo la primera línea de defensa.
* Si el usuario Elena es `JEFE_PROYECTO` y el usuario Marcos también es `JEFE_PROYECTO`, **Elena no debe poder modificar el presupuesto ni reasignar tareas del proyecto que gestiona Marcos**.
* Esto se conoce como **Control de Acceso Basado en Atributos (ABAC) o Seguridad a Nivel de Dominio**.

<figure class="diagram">
  <figcaption>Las dos capas de autorización en Spring Security</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Petición HTTP con Bearer JWT</li>
    <li>2. Capa 1: ¿Tiene el Rol adecuado? (RBAC: hasRole)</li>
    <li>3. Capa 2: ¿Es el Propietario del Recurso? (ABAC: esResponsable)</li>
    <li>4. Ejecución del método de negocio</li>
  </ol>
</figure>

### Paso a paso guiado · Bean de seguridad y llamadas salientes resilientes

<p class="stage">Paso 1 · El evaluador de propiedad SeguridadService</p>

Creamos un bean gestionado por Spring que resuelve la propiedad del recurso consultando la base de datos:

```java
package com.ejemplo.gestor.core.security;

import com.ejemplo.gestor.proyecto.repository.ProyectoRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("seguridadService")
public class SeguridadService {

    private final ProyectoRepository proyectoRepository;

    public SeguridadService(ProyectoRepository proyectoRepository) {
        this.proyectoRepository = proyectoRepository;
    }

    public boolean esResponsableDeProyecto(Long proyectoId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // Los administradores tienen acceso maestro universal
        if (authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMINISTRADOR"))) {
            return true;
        }

        String username = authentication.getName();
        return proyectoRepository.findById(proyectoId)
            .map(p -> p.getResponsable().getUsername().equals(username))
            .orElse(false);
    }
}
```

<p class="stage">Paso 2 · Proteger el método en el controlador con SpEL</p>

Vinculamos la comprobación directamente en la anotación `@PreAuthorize`:

```java
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or (hasRole('JEFE_PROYECTO') and @seguridadService.esResponsableDeProyecto(#id, authentication))")
    public ResponseEntity<ProyectoDetalleResponse> actualizarProyecto(
            @PathVariable Long id,
            @Valid @RequestBody ActualizarProyectoRequest request) {

        return ResponseEntity.ok(proyectoService.actualizarProyecto(id, request));
    }
```

<p class="stage">Paso 3 · El servicio de Clima saliente con degradación elegante</p>

Conectamos la integración de la UD10 garantizando que el alta de incidencias nunca colapse ante averías de Open-Meteo:

```java
package com.ejemplo.gestor.integration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

@Service
public class ClimaService {

    private static final Logger log = LoggerFactory.getLogger(ClimaService.class);
    private final RestClient climaRestClient;

    // Inyectamos el bean openMeteoRestClient de la UD10: es el que trae la
    // factoría con connect-timeout y read-timeout ya configurados. Construir
    // aquí un cliente nuevo desde el Builder dejaría la llamada sin límite de
    // espera, y una API externa lenta bloquearía el hilo indefinidamente.
    public ClimaService(RestClient openMeteoRestClient) {
        this.climaRestClient = openMeteoRestClient;
    }

    @Cacheable(value = "climaProyectos", key = "#lat + '_' + #lon")
    public ClimaResultado consultarClimaSeguro(double lat, double lon) {
        try {
            log.info("Consultando Open-Meteo para coordenadas: lat={}, lon={}", lat, lon);

            var respuesta = climaRestClient.get()
                .uri("/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true", lat, lon)
                .retrieve()
                .body(OpenMeteoResponse.class);

            return ClimaResultado.disponible(
                respuesta.currentWeather().temperature(),
                respuesta.currentWeather().weathercode()
            );

        } catch (ResourceAccessException ex) {
            log.warn("Timeout o fallo de red con Open-Meteo: {}. Aplicando degradación elegante.", ex.getMessage());
            return ClimaResultado.noDisponible("Servicio meteorológico fuera de línea temporalmente");
        } catch (Exception ex) {
            log.error("Error inesperado al consultar clima: {}. Se continúa sin enriquecimiento.", ex.getMessage());
            return ClimaResultado.noDisponible("Datos climáticos no disponibles");
        }
    }
}
```

<p class="stage">Paso 4 · Enganchar los adjuntos al alta de incidencias</p>

Los adjuntos ya los sabes tratar: la sesión 64 dejó el almacenamiento con nombre saneado por UUID y validación de tipo MIME. Aquí solo hay que conectarlo al caso de uso y protegerlo como todo lo demás:

1. Recupera de la UD10 tu `AlmacenamientoService` y el endpoint `POST /api/v1/incidencias` de tipo `multipart/form-data`.
2. Protégelo con la misma regla de propiedad: solo el `DESARROLLADOR` asignado a la tarea, el `JEFE_PROYECTO` responsable o un `ADMINISTRADOR` pueden adjuntar un parte a una incidencia.
3. Comprueba que el fichero se guarda con su UUID **antes** de consultar el clima, para que un fallo de Open-Meteo no deje un adjunto huérfano en disco sin fila en la base de datos.

<dl class="worked">
  <dt>Por qué la expresión lleva <code>@</code> delante</dt>
  <dd>En SpEL, <code>@nombreDelBean</code> busca un bean en el contexto de Spring. Por eso <code>@Service("seguridadService")</code> lleva el nombre escrito a mano: para que la expresión sea legible y no dependa de cómo Spring derive el nombre de la clase. Si cambias el nombre del bean y no el de la expresión, el fallo llega en tiempo de ejecución, no al compilar.</dd>
  <dt><code>#id</code> y <code>authentication</code></dt>
  <dd><code>#id</code> es el <strong>parámetro del método anotado</strong>: solo existe si el método tiene un argumento llamado así. <code>authentication</code> es una variable que Spring Security pone siempre a tu disposición dentro de estas expresiones, con el usuario ya verificado.</dd>
  <dt>El coste que estás aceptando</dt>
  <dd><code>esResponsableDeProyecto</code> hace una consulta a la base de datos <strong>antes</strong> de ejecutar el método, y otra dentro. Son dos viajes para una operación. Es asumible en una edición puntual, pero si lo pusieras en un listado tendrías el N+1 de la UD5 disfrazado de seguridad. Regla práctica: la seguridad por propiedad va en operaciones sobre <strong>un</strong> recurso, no sobre colecciones.</dd>
  <dt>El atajo del administrador va primero, y no es casualidad</dt>
  <dd>La comprobación de <code>ROLE_ADMINISTRADOR</code> está antes de tocar el repositorio: un administrador no paga la consulta. Ordenar las condiciones de más barata a más cara es lo que evita que la seguridad se convierta en el cuello de botella.</dd>
</dl>

### La comprobación · Pruebas de matriz de permisos en Bruno

1. **Prueba de usurpación de proyecto (Caso no autorizado):**
   * Autentícate como `jefe2` (Elena).
   * Intenta modificar el proyecto `PRJ-2026-001` cuyo responsable es `jefe1` (Marcos):
     `PUT http://localhost:8080/api/v1/proyectos/1`.
   * **Resultado esperado:** Código **`403 Forbidden`**. Spring Security bloquea la petición antes de ejecutar el servicio.
2. **Prueba como responsable legítimo:**
   * Autentícate como `jefe1`.
   * Lanza el mismo `PUT`.
   * **Resultado esperado:** Código **`200 OK`**.
3. **Prueba de degradación de red:**
   * Apaga tu conexión WiFi o introduce coordenadas simuladas inalcanzables.
   * Da de alta una incidencia con fichero adjunto.
   * **Resultado esperado:** Código **`201 Created`**. El informe se guarda con su archivo en disco y el campo clima reporta *"Servicio meteorológico fuera de línea temporalmente"*.

### Ahora tú · Autorización granular en Tareas

Implementa la regla de propiedad para tareas:
1. Añade a `SeguridadService` el método `puedeModificarTarea(Long tareaId, Authentication auth)`.
2. Permite la edición si el usuario es `ADMINISTRADOR`, o si es el `JEFE_PROYECTO` del proyecto padre, o si es el `DESARROLLADOR` que tiene asignada esa tarea.
3. Protege el endpoint `PATCH /api/v1/tareas/{id}/estado` con esta comprobación.

4. **Prueba de la lectura ajena:** comprueba también qué pasa cuando `jefe2` **lee** el proyecto de `jefe1`. Decide si eso debe permitirse o no, anótalo, e impleméntalo. No hay respuesta única —en muchas organizaciones los proyectos son visibles para todos y solo la edición es privada—, pero tiene que ser una decisión tomada y no un descuido.

### Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| `EL1008E: Property or field 'seguridadService' cannot be found` | El nombre del bean no coincide | El de `@Service("seguridadService")` debe ser idéntico al de la expresión |
| Todos reciben `403`, incluso el responsable | La comparación falla | ¿`getResponsable()` llega `null` por carga perezosa? Compara `username`, no objetos `Usuario` |
| `LazyInitializationException` dentro de `SeguridadService` | Se accede al responsable fuera de la transacción | Anota el método con `@Transactional(readOnly = true)`, o usa una consulta con `JOIN FETCH` |
| El administrador recibe `403` | La condición del atajo no encaja | La autoridad guardada es `ROLE_ADMINISTRADOR` con prefijo; compárala tal cual |
| La regla no se aplica en absoluto | Falta `@EnableMethodSecurity` | Igual que en la sesión 57: sin esa anotación, `@PreAuthorize` es decoración |
| La incidencia se guarda sin adjunto cuando cae Open-Meteo | Orden de operaciones equivocado | Guarda el fichero y la fila antes de enriquecer con el clima, no al revés |

### Reto · Auditoría de accesos denegados en base de datos

Cada vez que un usuario recibe un código `403 Forbidden` puede tratarse de un error inocente o de un ataque malicioso de fuerza bruta / enumeración de IDs.
1. Implementa un listener para el evento de Spring Security `AuthorizationFailureEvent`.
2. Registra en una tabla `auditoria_seguridad` el usuario, la IP del cliente, la URL intentada y el motivo de denegación.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Seguridad JWT activa en endpoints y cliente de clima con captura de excepciones.</span></div>
  <div><strong>Si lo tienes</strong><span>Evaluador SpEL <code>esResponsableDeProyecto</code> protegiendo recursos frente a accesos ajenos.</span></div>
  <div><strong>Reto</strong><span>Auditoría reactiva de eventos <code>AuthorizationFailureEvent</code> persistida en base de datos.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 74</p>
  <ul class="checklist">
    <li>Se superan los roles genéricos implementando seguridad a nivel de dominio y propiedad.</li>
    <li>El evaluador <code>@seguridadService</code> encapsula las reglas de acceso en expresiones SpEL legibles.</li>
    <li>El cliente <code>RestClient</code> cuenta con timeouts y contingencia garantizada ante caídas de red.</li>
    <li>Los ficheros adjuntos se gestionan mediante almacenamiento seguro con UUIDs y tipo MIME validado.</li>
    <li>El sistema distingue con exactitud entre no autenticado (<code>401</code>) y no autorizado (<code>403</code>).</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué un rol <code>JEFE_PROYECTO</code> no debe tener barra libre para modificar cualquier proyecto del sistema?</li>
    <li>¿Qué objeto proporciona Spring Security a través del parámetro <code>authentication</code> en las expresiones SpEL?</li>
    <li>¿Qué ventaja ofrece el patrón de degradación elegante frente a relanzar una excepción cuando una API externa falla?</li>
    <li>¿Cuál es la diferencia entre el error HTTP 401 y el error HTTP 403?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque violaría el principio de aislamiento y confidencialidad; cada responsable solo debe gestionar los proyectos y presupuestos formalmente asignados a su cargo.</p>
  <p>2 · Proporciona la instancia actual de Authentication del SecurityContext, con el nombre del usuario (getName()), sus roles/autoridades (getAuthorities()) y sus credenciales.</p>
  <p>3 · Evita abortar un caso de uso principal válido del usuario (como guardar un informe o incidencia) por culpa de un servicio secundario complementario que no está disponible.</p>
  <p>4 · 401 Unauthorized significa que el cliente no se ha identificado (falta el token o es inválido); 403 Forbidden significa que el servidor sabe quién es el usuario pero sus permisos son insuficientes para esa acción.</p>
</details>

## Sesión 75 · Integración con Angular

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> los desafíos de la integración frontend-backend: el protocolo <strong>CORS (Cross-Origin Resource Sharing)</strong> y las peticiones de sondeo previo (<strong>Preflight OPTIONS</strong>), la alineación de contratos de datos TypeScript ↔ Java DTO, y el manejo centralizado de errores RFC 7807 mediante interceptores HTTP.</li>
    <li><strong>2. Haz:</strong> configura <code>CorsConfigurationSource</code> en Spring Security con orígenes específicos y cabeceras expuestas, conecta los servicios Angular a la API y sincroniza los modelos tipados con el cliente web.</li>
    <li><strong>3. Comprueba:</strong> abres la aplicación Angular en el navegador, inspeccionas en DevTools la petición previa <code>OPTIONS</code> confirmando el código <code>200 OK</code> y las cabeceras CORS, y verificas el flujo interactivo de creación y visualización de proyectos sin que el backend pierda su independencia.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué una petición que responde perfectamente en Postman o Bruno falla con un error rojo de CORS al ejecutarse desde Angular en el navegador?</li>
    <li>¿Qué es una petición HTTP de sondeo previo (*Preflight Request*) y qué método HTTP utiliza?</li>
    <li>¿Por qué la verificación del backend nunca debe depender de que el frontend Angular esté terminado o funcionando?</li>
  </ol>
</div>

### El salto de Bruno al Navegador: La barrera de CORS

Durante todo el curso has probado tus endpoints con herramientas de escritorio como Bruno o curl. En ese entorno no existe ninguna restricción de origen cruzado.

Sin embargo, cuando el usuario abre la aplicación en Chrome o Firefox:
* El código frontend de Angular se sirve desde el origen `http://localhost:4200`.
* La API de Spring Boot escucha en el origen `http://localhost:8080`.
* **Como los puertos difieren, el navegador activa la Política del Mismo Origen (*Same-Origin Policy*)**.

Antes de enviar una petición destructiva (`POST`, `PUT`, `DELETE`) con cabeceras personalizadas (`Authorization: Bearer`), el navegador envía automáticamente una **petición de sondeo previo (*Preflight Request*) con el método `OPTIONS`**:
* Le pregunta al servidor: *«¿Aceptas peticiones desde `http://localhost:4200` con la cabecera `Authorization`?»*.
* Si Spring Security no está configurado expresamente para autorizar peticiones `OPTIONS`, **la rechaza y el navegador bloquea la llamada**.

<div class="rule">
  <p class="rule-label">La regla de oro de la integración desacoplada</p>
  <p><strong>El backend no sabe ni le importa que el cliente sea Angular, React o una app móvil.</strong></p>
  <p>El backend solo responde a contratos HTTP estándar. Angular es solo un cliente más. La suite de pruebas de Bruno sigue siendo el certificador técnico oficial e independiente del backend.</p>
</div>

### Paso a paso guiado · Configuración de CORS y sincronización de contratos

<div class="rule">
  <p class="rule-label">Qué se evalúa hoy y qué no</p>
  <p>Esta sesión es de <strong>backend</strong>, aunque se vea TypeScript. Lo que se evalúa es que tu API se deje consumir desde un navegador con seguridad puesta: CORS acotado, cabeceras expuestas, errores legibles. El cliente Angular es el instrumento de medida, no el entregable.</p>
  <p>La regla de la UD8 sigue vigente y es la que te salva si Angular no está listo: <strong>el backend debe poder comprobarse entero sin él</strong>. Si algo no funciona, la primera pregunta es siempre si la misma petición funciona desde tu cliente HTTP. Si desde ahí va y desde el navegador no, el problema es CORS. Si no va desde ninguno de los dos, el problema no tiene nada que ver con Angular.</p>
</div>

<p class="stage">Paso 1 · Configurar CorsConfigurationSource en Spring Security</p>

Configuramos de forma granular los orígenes y cabeceras permitidas en `SecurityConfig`:

```java
package com.ejemplo.gestor.core.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Activamos CORS con nuestra configuración personalizada
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Deshabilitado para APIs REST stateless con JWT
            // ... resto de reglas de autorización
            ;
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Origen del cliente Angular de desarrollo
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Cabeceras permitidas en las peticiones entrantes
        configuration.setAllowedHeaders(List.of(
            "Authorization", "Content-Type", "X-Correlation-ID", "Accept"
        ));
        
        // Cabeceras expuestas legibles por el código JavaScript de Angular
        configuration.setExposedHeaders(List.of(
            "Location", "X-Correlation-ID", "Content-Disposition"
        ));
        
        // Permitir envío de credenciales/cookies si fuera necesario
        configuration.setAllowCredentials(true);
        
        // Tiempo de caché del resultado del preflight (1 hora)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

<p class="stage">Paso 2 · Sincronizar modelos en TypeScript (Angular)</p>

Creamos las interfaces en Angular espejando los DTOs de Java:

```typescript
// src/app/models/proyecto.model.ts
export interface ProyectoResponse {
  id: number;
  codigo: string;
  nombre: string;
  estado: 'PLANIFICADO' | 'EN_CURSO' | 'BLOQUEADO' | 'FINALIZADO' | 'CANCELADO';
  presupuestoTotal: number;
  responsableNombre: string;
}

export interface CrearProyectoRequest {
  codigo: string;
  nombre: string;
  descripcion?: string;
  presupuestoTotal: number;
  latitud: number;
  longitud: number;
  fechaInicio: string; // Formato ISO "YYYY-MM-DD"
  fechaFinEstimada: string;
}

// Estructura de error estándar RFC 7807 capturada en el frontend
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  correlationId?: string;
}
```

<p class="stage">Paso 3 · Interceptor HTTP en Angular para inyectar JWT y trazar errores</p>

```typescript
// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  // Si tenemos token JWT en localStorage, lo clonamos en la cabecera Authorization
  let peticionClonada = req;
  if (token) {
    peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(peticionClonada).pipe(
    catchError((error: HttpErrorResponse) => {
      // Capturamos el Problem Details RFC 7807 emitido por Spring Boot
      if (error.error && error.error.detail) {
        console.error(`[API Error ${error.status}] ${error.error.title}: ${error.error.detail}`);
        if (error.error.correlationId) {
          console.warn(`Código de soporte para reporte: ${error.error.correlationId}`);
        }
      }
      return throwError(() => error);
    })
  );
};
```

<dl class="worked">
  <dt>Por qué CORS se configura aquí y no en el <code>@CrossOrigin</code> de la UD8</dt>
  <dd>Con Spring Security en medio, la petición se rechaza en la cadena de filtros <strong>antes</strong> de llegar a tu controlador, y una anotación en el controlador ya no llega a tiempo. El <code>.cors(...)</code> del <code>SecurityFilterChain</code> lo resuelve en el sitio correcto: en la frontera.</dd>
  <dt>El <code>OPTIONS</code> tiene que ser público</dt>
  <dd>El navegador envía el <em>preflight</em> <strong>sin</strong> la cabecera <code>Authorization</code>. Si tu cadena exige autenticación para todo, ese <code>OPTIONS</code> recibe un <code>401</code>, el navegador cancela y en la consola verás un error de CORS que no es de CORS. Spring Security lo permite solo si <code>.cors(...)</code> está declarado antes de las reglas de autorización.</dd>
  <dt><code>setExposedHeaders</code>: la que se olvida siempre</dt>
  <dd>Por defecto, JavaScript solo puede leer un puñado de cabeceras de la respuesta. Tu <code>Location</code> del <code>201 Created</code> <strong>llega</strong>, pero el navegador se la esconde a Angular salvo que la declares aquí. El síntoma es desconcertante: la petición sale bien y aun así el cliente no encuentra la cabecera.</dd>
  <dt><code>allowCredentials(true)</code> y el comodín</dt>
  <dd>Con credenciales activadas, el estándar prohíbe <code>setAllowedOrigins(List.of("*"))</code>. Spring lanza una excepción al arrancar. Si necesitas varios orígenes, enuméralos, o usa <code>setAllowedOriginPatterns</code>. Y en producción, jamás el comodín.</dd>
</dl>

### La comprobación · Inspección de red en DevTools

1. **Arranca el backend (`:8080`) y el cliente Angular (`:4200`).**
2. **Abre las herramientas de desarrollo de Chrome (F12) en la pestaña Network (Red).**
3. **Inicia sesión y crea un proyecto desde el formulario web de Angular:**
   * Observa la secuencia de dos peticiones en la lista de red:
     1. `OPTIONS /api/v1/proyectos`: Responde **`200 OK`** con cabecera `Access-Control-Allow-Origin: http://localhost:4200`.
     2. `POST /api/v1/proyectos`: Responde **`201 Created`** con el cuerpo JSON del proyecto y la cabecera `Location`.
4. **Prueba de captura de error RFC 7807 en pantalla:**
   * Intenta introducir un código duplicado o un presupuesto de -500 €.
   * Comprueba que la pantalla de Angular muestra el mensaje amigable extraído directamente de `error.error.detail` y el identificador de correlación para soporte.

5. **Provoca el fallo de CORS a propósito, para saber reconocerlo:** cambia `setAllowedOrigins` a `http://localhost:9999`, reinicia el backend y repite la operación desde Angular. Lee el mensaje exacto de la consola del navegador y anótalo. Comprueba a la vez que **la misma petición sigue funcionando desde tu cliente HTTP**: esa asimetría es la firma inconfundible de un problema de CORS y te ahorrará horas el día que aparezca de verdad. Devuelve el origen a `:4200`.

### Si algo no sale como dice el guion

| Síntoma en la consola del navegador | Causa real | Qué mirar |
| :--- | :--- | :--- |
| `No 'Access-Control-Allow-Origin' header is present` | El origen no está en la lista | ¿`http://localhost:4200` exacto? El puerto y el esquema forman parte del origen |
| `Response to preflight request doesn't pass access control check: 401` | El `OPTIONS` está siendo autenticado | `.cors(...)` debe ir declarado en el `SecurityFilterChain`, antes de las reglas |
| `Request header field authorization is not allowed` | Falta en `setAllowedHeaders` | Añade `Authorization` a la lista |
| La petición va bien pero Angular no ve la cabecera `Location` | Falta en `setExposedHeaders` | Es lo que impide leerla desde JavaScript |
| `Cannot use wildcard in Access-Control-Allow-Origin when credentials flag is true` | Comodín + credenciales | Enumera los orígenes o usa `setAllowedOriginPatterns` |
| `401` en todas las llamadas de Angular pero no en el cliente HTTP | El interceptor no adjunta el token | Comprueba en DevTools → Network → Headers que sale `Authorization: Bearer …` |
| Funciona todo salvo la subida de ficheros | El interceptor fija `Content-Type: application/json` | En un `multipart`, el navegador debe poner él el `Content-Type` con su `boundary`: no lo sobrescribas |

### Ahora tú · Cerrar el circuito completo desde el navegador

El objetivo no es que Angular quede bonito, sino que **todas** las capacidades de tu backend se puedan ejercer desde un navegador con seguridad puesta.

1. Añade al detalle de proyecto un botón *«Consultar meteorología en obra»* que muestre la temperatura y la recomendación que devuelve tu API.
2. Si el backend responde con el aviso de degradación de la UD10 (*«Servicio no disponible»*), muestra una alerta amarilla **sin romper la vista del proyecto**. Es la demostración visible de que la degradación elegante servía para algo.
3. Comprueba desde el navegador las tres respuestas de error que más cuesta ver bien: un `400` de validación (envía un presupuesto negativo), un `403` de permisos (entra como operario e intenta editar un proyecto ajeno) y un `404`. Las tres deben mostrar el `detail` del RFC 7807 y ninguna debe dejar la pantalla en blanco.
4. Verifica que la cabecera `Location` del `201 Created` **se lee desde Angular** y la usas para navegar al recurso recién creado. Si no la ves, vuelve a `setExposedHeaders`.
5. Repite el recorrido con los tres roles y comprueba que la interfaz oculta lo que el usuario no puede hacer **y** que el backend lo rechaza igualmente si lo fuerzas desde el cliente HTTP. Esa doble comprobación es la lección de la sesión 58 aplicada a tu propio proyecto.
6. Anota en la memoria técnica los orígenes permitidos y **por qué** esos: es una decisión de seguridad y hay que defenderla en la sesión 78.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>En DevTools ves el par <code>OPTIONS 200</code> + <code>POST 201</code>; Angular lee la cabecera <code>Location</code>; los errores del backend llegan a la pantalla como texto legible y no como una pantalla en blanco; ninguna operación depende del cliente para poder comprobarse; y sabes reconocer un fallo de CORS por el hecho de que tu cliente HTTP sí funciona.</dd>
</dl>

### Reto · Descarga de ficheros binarios Blob en Angular

La descarga de un archivo binario mediante un enlace `<a>` tradicional no permite inyectar cabeceras `Authorization: Bearer <token>`:
1. Investiga cómo descargar el archivo mediante Angular `HttpClient` configurando `{ responseType: 'blob' }`.
2. Crea una URL de objeto en memoria con `window.URL.createObjectURL(blob)` y dispara la descarga programática asignando el nombre de fichero extraído de la cabecera `Content-Disposition`.

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Si en la evaluación se solicita una memoria técnica justificando la integración entre cliente y servidor, el formato oficial de entrega de texto es siempre un <strong>documento en PDF</strong> (<code>memoria-integracion-cliente.pdf</code>), nunca un archivo markdown suelto.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Configuración de CORS operativa permitiendo peticiones desde <code>http://localhost:4200</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Interceptor HTTP en Angular inyectando tokens Bearer y capturando errores RFC 7807.</span></div>
  <div><strong>Reto</strong><span>Descarga programática de binarios Blob con inyección de JWT y extracción de <code>Content-Disposition</code>.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 75</p>
  <ul class="checklist">
    <li>Se comprende el funcionamiento de las peticiones preflight OPTIONS en el estándar CORS.</li>
    <li>La configuración de CORS en Spring Security autoriza orígenes, métodos y cabeceras exactas.</li>
    <li>Los modelos TypeScript en Angular están sincronizados con los DTOs inmutables de Java.</li>
    <li>El interceptor HTTP gestiona de forma centralizada la autenticación y las trazas RFC 7807.</li>
    <li>El backend mantiene su autonomía y puede verificarse independientemente de Angular.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué las herramientas como Bruno o Postman no sufren nunca bloqueos por CORS?</li>
    <li>¿Qué cabecera HTTP de respuesta indica al navegador qué origen tiene permiso para leer los datos?</li>
    <li>¿Por qué es necesario declarar cabeceras expuestas (*Exposed Headers*) en la configuración de CORS?</li>
    <li>¿Qué información crucial de soporte técnico extrae el interceptor de Angular del cuerpo RFC 7807?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque las restricciones de CORS son implementadas exclusivamente por los navegadores web para proteger a los usuarios de peticiones no autorizadas entre sitios; los clientes de escritorio como Bruno no aplican la política Same-Origin.</p>
  <p>2 · La cabecera Access-Control-Allow-Origin (por ejemplo: Access-Control-Allow-Origin: http://localhost:4200).</p>
  <p>3 · Porque por defecto el navegador oculta a JavaScript casi todas las cabeceras de respuesta excepto las básicas; si necesitas leer Location, Content-Disposition o X-Correlation-ID en TypeScript debes exponerlas explícitamente.</p>
  <p>4 · El correlationId generado por el servidor, que permite al usuario comunicar ese código al soporte técnico para que localicen el fallo exacto en los archivos de log del servidor.</p>
</details>


## Semana 26 · Demostrar que está terminado

## Sesión 76 · Testing y revisión

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el enfoque de pruebas basado en riesgos (<em>Risk-Based Testing</em>), la auditoría de regresión automatizada antes de la entrega final y la verificación de que ningún error imprevisto exponga información interna de infraestructura o base de datos.</li>
    <li><strong>2. Haz:</strong> diseña la matriz de riesgos del proyecto, programa tests de integración con MockMvc que cubran los tres puntos más críticos del sistema (concurrencia de datos, denegación de accesos no autorizados y degradación externa) y ejecuta la suite completa de verificación con Maven y JaCoCo.</li>
    <li><strong>3. Comprueba:</strong> ejecutas <code>./mvnw clean verify</code> en la terminal verificando que el 100 % de los tests pasan en verde, que la cobertura de ramas supera el umbral del 75 % y que los informes de error RFC 7807 nunca filtran trazas de pila (<em>stack traces</em>) al cliente.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué tener 100 tests que prueban getters, setters y casos obvios no demuestra que el backend sea seguro ni fiable?</li>
    <li>¿Qué es una «prueba de regresión» y por qué es indispensable ejecutarla antes de dar por cerrado un proyecto?</li>
    <li>¿Qué grave problema de seguridad supone que un error 500 devuelva al cliente un fragmento de la traza de Hibernate o de la consulta SQL?</li>
  </ol>
</div>

### Pruebas basadas en riesgos: Dónde poner el foco

En la recta final del proyecto el tiempo es limitado. No puedes probarlo absolutamente todo con el mismo nivel de detalle.

El principio rector del **Testing Basado en Riesgos (*Risk-Based Testing*)** establece que debes concentrar el esfuerzo donde el impacto de un fallo sea más destructivo para el negocio:

| Nivel de riesgo | Área de la aplicación | Consecuencia de un fallo | Tipo de prueba obligatoria |
| :--- | :--- | :--- | :--- |
| **Crítico (P0)** | Seguridad y Autorización (RBAC / ABAC) | Fuga de datos de clientes o usurpación de proyectos ajenos. | Tests con MockMvc simulando peticiones con tokens de distintos roles y usuarios no autorizados (`403 Forbidden`). |
| **Crítico (P0)** | Integridad transaccional y presupuestos | Pérdida económica o corrupción del balance contable. | Tests de concurrencia y límites presupuestarios con verificación de rollback en base de datos. |
| **Alto (P1)** | Integraciones externas y ficheros | Colapso del servidor por caídas ajenas o saturación de disco. | Tests de fallo de red en `RestClient` con degradación y subida de ficheros maliciosos (`Path Traversal`). |
| **Medio (P2)** | Paginación y ordenación de listados | Lentitud de navegación o páginas vacías. | Tests de repositorios y controladores con `Pageable`. |

<div class="rule">
  <p class="rule-label">La ley del blindaje de errores</p>
  <p><strong>En producción los errores son discretos: nunca exponen las tripas del servidor.</strong></p>
  <p>Toda excepción no controlada debe ser capturada por el <code>GlobalExceptionHandler</code> devolviendo un JSON Problem Details limpio con código 500 y un <code>correlationId</code> para auditoría interna, suprimiendo cualquier clase, línea de código Java o sentencia SQL.</p>
</div>

### Paso a paso guiado · La suite de regresión final

<p class="stage">Paso 1 · Matriz de riesgos de la aplicación final</p>

| Riesgo técnico identificado | Prueba de mitigación implementada | Clase de test |
| :--- | :--- | :--- |
| Un operario intenta aprobar un presupuesto o reasignar un proyecto. | Petición con JWT de operario a `PATCH /proyectos/{id}/presupuesto` esperando 403. | `SeguridadAutorizacionIntegrationTest` |
| La API de Open-Meteo se cae durante una guardia nocturna. | Simulación de `ResourceAccessException` en `ClimaService` esperando 201 y aviso. | `ClimaDegradacionIntegrationTest` |
| Se intenta cerrar un proyecto que tiene tareas activas. | Llamada a `POST /proyectos/{id}/cerrar` esperando 409 Conflict. | `ProyectoCicloVidaIntegrationTest` |
| Se envía un archivo `.sh` ejecutable o de 20 MB. | Petición multipart esperando 400 Bad Request o 413 Payload Too Large. | `AdjuntoSeguridadIntegrationTest` |

<p class="stage">Paso 2 · Test de integración de los tres riesgos críticos</p>

```java
package com.ejemplo.gestor;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class RiesgosCriticosIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "operario1", roles = {"DESARROLLADOR"})
    @DisplayName("Riesgo 1: Un usuario sin rol directivo no puede aprobar presupuestos (403)")
    void operario_noPuedeAprobarPresupuesto() throws Exception {
        mockMvc.perform(patch("/api/v1/proyectos/1/presupuesto")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"nuevoPresupuesto\": 80000.00}"))
            .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "jefe1", roles = {"JEFE_PROYECTO"})
    @DisplayName("Riesgo 2: Un proyecto con tareas pendientes no puede cerrarse (409 Conflict)")
    void cerrarProyecto_conTareasPendientes_devuelveConflicto() throws Exception {
        mockMvc.perform(post("/api/v1/proyectos/1/cerrar"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.status").value(409))
            .andExpect(jsonPath("$.title").value("Conflicto de negocio"));
    }
}
```

<dl class="worked">
  <dt>Por qué aquí sí es <code>@SpringBootTest</code> y no <code>@WebMvcTest</code></dt>
  <dd>En la UD7 y la UD9 usabas cortes (<em>slices</em>) para probar una capa aislada y rápido. Estos tests son distintos: comprueban que las piezas <strong>encajan entre sí</strong> —seguridad, servicio, transacción y base de datos en la misma petición—, y eso solo se ve con el contexto entero levantado. Tardan segundos en vez de milisegundos, y por eso son pocos y elegidos.</dd>
  <dt>Contra qué base de datos corren</dt>
  <dd>Contra una de verdad. Crea <code>src/test/resources/application-test.properties</code> apuntando a una base <code>gestion_proyectos_test</code> separada, añade <code>@ActiveProfiles("test")</code> a la clase y usa <code>ddl-auto=create-drop</code> ahí: cada ejecución parte de un esquema limpio. Nunca ejecutes la suite contra la base de datos donde tienes tus datos de demostración.</dd>
  <dt>El orden importa, y eso es un problema</dt>
  <dd>El test del riesgo 2 asume que el proyecto <code>1</code> existe y tiene tareas pendientes. Si otro test lo cierra antes, este falla sin que nada esté roto. Anota <code>@Sql</code> o un <code>@BeforeEach</code> que cree sus propios datos: un test que depende de lo que hicieron los anteriores es un test que mentirá tarde o temprano.</dd>
</dl>

<p class="stage">Paso 3 · El tercer riesgo: que un error filtre las tripas del servidor</p>

Los dos tests anteriores comprueban lo que la aplicación **hace**. Este comprueba lo que no debe **decir**:

```java
    @Test
    @WithMockUser(username = "jefe1", roles = {"JEFE_PROYECTO"})
    @DisplayName("Riesgo 3: un error interno no revela clases, SQL ni trazas de pila")
    void errorInterno_noFiltraDetallesTecnicos() throws Exception {
        String cuerpo = mockMvc.perform(post("/api/v1/proyectos/999999/cerrar"))
            .andExpect(status().is4xxClientError())
            .andReturn().getResponse().getContentAsString();

        // Ninguna de estas cadenas puede aparecer jamás en una respuesta al cliente
        for (String prohibido : new String[] {
                "org.hibernate", "org.springframework", "com.ejemplo.gestor",
                "SQL", "select ", "Exception", ".java:" }) {
            assertThat(cuerpo)
                .as("La respuesta no debe contener '%s'", prohibido)
                .doesNotContain(prohibido);
        }
    }
```

Un `500` con una traza de Hibernate le regala a un atacante el nombre de tus tablas, tu versión de Spring y la estructura de tus paquetes. Este test convierte esa regla en algo que la suite vigila sola.

### La comprobación · Auditoría completa con Maven y JaCoCo

Ejecuta el ciclo de vida completo de Maven en tu terminal:

```bash
./mvnw clean verify
```

1. **Verificación de verde total:**
   Comprueba que la consola concluye con:
   `[INFO] BUILD SUCCESS`
   `[INFO] Tests run: <los tuyos>, Failures: 0, Errors: 0, Skipped: 0`
2. **Inspección del informe JaCoCo:**
   Abre `target/site/jacoco/index.html`.
   * Verifica que la cobertura de ramas (*Branch Coverage*) en los paquetes `service` y `security` supera el 75 %.
   * Constata que no quedan ramas condicionales críticas en color amarillo.

3. **Lectura crítica del informe, no solo del porcentaje:**
   * Ordena los paquetes por cobertura ascendente y quédate con los tres peores.
   * De cada uno, decide una de dos cosas: o escribes el test que falta, o anotas por qué esa clase no lo necesita (un DTO sin lógica, por ejemplo). Las dos respuestas son válidas; lo que no vale es no haber mirado.
   * Busca en `service` los `if` que JaCoCo pinta en **amarillo**: significa que la condición se ha ejecutado, pero solo por una de sus dos ramas. En una regla de negocio, la rama que nunca se ha probado suele ser justo la que rechaza.

### Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| Los tests pasan sueltos pero fallan todos juntos | Se pisan los datos entre sí | Cada test debe crear lo que necesita; añade `@Transactional` a la clase para que revierta al terminar |
| `Table 'proyectos' not found` en los tests | El perfil de test no se aplica | Falta `@ActiveProfiles("test")` o el archivo `application-test.properties` |
| `403` en todos los `POST` y `PATCH` de los tests | CSRF activo en el contexto completo | Añade `.with(csrf())` a la petición, o comprueba que tu configuración JWT lo desactiva |
| JaCoCo no genera informe | El plugin no está enganchado a la fase | El `prepare-agent` debe ejecutarse antes de `test`, y `report` en `verify` |
| Cobertura muy alta y aun así aparecen fallos a mano | Estás midiendo líneas, no ramas | Mira la columna *Branch*, no la de *Instructions* |

### Ahora tú · La prueba de caja negra, y lo que revele

Los tests automáticos comprueban lo que se te ocurrió comprobar. Esta pasada busca lo que no.

1. Ejecuta la colección completa de tu cliente HTTP de principio a fin: autenticación → alta de proyecto → tareas → incidencia con adjunto → descarga → cierre.
2. Hazlo **contra la base de datos vacía**, arrancando de cero. Es la única forma de detectar los pasos que solo funcionan porque tienes datos antiguos a mano.
3. Repite la secuencia entera con cada uno de los tres roles. Anota cada respuesta que te sorprenda, aunque sea un código correcto con un mensaje confuso.
4. Prueba a propósito las cinco barbaridades que un usuario real acabará haciendo: enviar el cuerpo vacío, mandar un `id` que no existe, mandar texto donde esperas un número, repetir dos veces la misma alta y usar el token de otro usuario.
5. Por cada fallo encontrado, haz dos cosas en este orden: **primero escribe el test que lo reproduce en rojo**, y después arréglalo. Si lo arreglas antes, nunca sabrás si el test lo habría cazado.
6. Cierra con el número que resume la sesión: cuántos fallos ha encontrado la pasada manual que la suite automática no había visto. Ese número es la medida real de la calidad de tus tests, y es lo que se defiende en la sesión 78.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd><code>./mvnw clean verify</code> termina en <code>BUILD SUCCESS</code>; la cobertura de <strong>ramas</strong> de <code>service</code> y <code>security</code> pasa del 75 %; ningún cuerpo de respuesta contiene el nombre de un paquete o de una tabla; y cada fallo que encontraste a mano tiene ahora un test que lo vigila.</dd>
</dl>

### Reto · Detección de fugas de memoria y rendimiento en carga

Simula una ráfaga de 100 peticiones concurrentes utilizando una herramienta de estrés como `Apache Bench` (`ab`) o `k6`:
```bash
ab -n 500 -c 20 -H "Authorization: Bearer <token>" http://localhost:8080/api/v1/proyectos
```
Comprueba que el tiempo medio de respuesta se mantiene por debajo de 50 ms y que el pool de conexiones de HikariCP en PostgreSQL no sufre agotamiento.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Suite de pruebas automatizadas pasando al 100 % con <code>./mvnw test</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Matriz de riesgos implementada y cobertura de ramas superior al 75 % en JaCoCo.</span></div>
  <div><strong>Reto</strong><span>Prueba de carga concurrente validando tiempos de respuesta y estabilidad del pool HikariCP.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 76</p>
  <ul class="checklist">
    <li>Se audita la suite de pruebas bajo el prisma del enfoque basado en riesgos.</li>
    <li>Los escenarios más destructivos (permisos, concurrencia, degradación) están cubiertos.</li>
    <li>La compilación y verificación de Maven finaliza en verde sin advertencias.</li>
    <li>Los informes de error 500 no filtran detalles técnicos de la infraestructura.</li>
    <li>El backend demuestra estabilidad y solidez ante peticiones anómalas.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué priorizar las pruebas según el riesgo económico o de seguridad optimiza el tiempo de entrega?</li>
    <li>¿Qué diferencia a un test de regresión de un test funcional nuevo?</li>
    <li>¿Cómo evita el GlobalExceptionHandler que un error de base de datos exponga información a un atacante?</li>
    <li>¿Qué comando de Maven ejecuta simultáneamente los tests unitarios, de integración y la generación de JaCoCo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque asegura que los recursos limitados se inviertan en blindar las áreas donde un fallo tendría consecuencias catastróficas (seguridad, dinero, datos), en lugar de perder tiempo en piezas triviales.</p>
  <p>2 · El test funcional verifica una funcionalidad recién creada; el test de regresión comprueba que los cambios nuevos no han roto nada de lo que ya funcionaba previamente en el sistema.</p>
  <p>3 · Capturando la excepción genérica Exception.class y devolviendo una respuesta estándar 500 con un mensaje neutro ("Error interno del servidor") y un correlationId, sin volcar la traza de la excepción al JSON.</p>
  <p>4 · ./mvnw clean verify (ejecuta el ciclo completo hasta la fase de verificación emitiendo los reportes).</p>
</details>

## Sesión 77 · Documentación y refactorización

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la sincronización tridimensional entre <strong>Código Fuente</strong>, <strong>Contratos OpenAPI</strong> y <strong>Guía de Despliegue (README técnico)</strong>, y las pautas de refactorización limpia para erradicar deuda técnica sin romper ningún test existente.</li>
    <li><strong>2. Haz:</strong> redacta el archivo <code>README.md</code> del repositorio con instrucciones de puesta en marcha en 3 pasos, sincroniza la documentación OpenAPI con descripciones de esquemas y refactoriza clases eliminando constantes mágicas y código muerto.</li>
    <li><strong>3. Comprueba:</strong> simulas la instalación limpia del proyecto en una máquina desde cero siguiendo al pie de la letra el <code>README.md</code>, verificando que la base de datos se levanta con Docker, la aplicación arranca y Swagger UI documenta con fidelidad todos los contratos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué un proyecto con código excelente pero un <code>README</code> desactualizado o incompleto suspende en una auditoría profesional?</li>
    <li>¿Qué significa el principio de «refactorización con red de seguridad»?</li>
    <li>¿Qué cinco apartados mínimos debe contener el archivo <code>README.md</code> de un backend profesional?</li>
  </ol>
</div>

### La sincronización tridimensional de la entrega

Un proyecto no es solo el archivo `.jar` que compila. En el mundo empresarial una entrega de software es un **paquete coherente en tres dimensiones**:

<figure class="diagram">
  <figcaption>La coherencia tridimensional de la entrega técnica</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Código Fuente Java (Limpio, sin warnings, refactorizado)</li>
    <li>2. Contratos OpenAPI 3 (Sincronizados con los DTOs y errores reales)</li>
    <li>3. Guía de Despliegue README (Reproducible en 3 pasos por cualquiera)</li>
  </ol>
</figure>

Si el código espera el campo `fechaInicio` pero el Swagger dice `fecha_inicio` y el `README` dice que la base de datos se llama `test_db` cuando el código busca `gestion_proyectos`, **el proyecto está roto**.

### Estructura del README.md técnico profesional

Un buen `README.md` no cuenta qué es Java ni explica qué es un microservicio. Es una **guía operacional concisa** para que otro ingeniero levante y verifique el proyecto en 3 minutos:

````markdown
# Gestor de Proyectos e Incidencias · Backend API

Servicio backend REST modular construido con Spring Boot 3.5, Spring Security (JWT), 
PostgreSQL y cliente HTTP saliente hacia Open-Meteo.

## 1. Requisitos previos
* Java 21 (Eclipse Temurin o GraalVM)
* Docker y Docker Compose
* Maven 3.9+ (o utilizar `./mvnw` incluido)

## 2. Puesta en marcha en 3 pasos

1. **Iniciar la base de datos PostgreSQL:**
   ```bash
   docker compose up -d
   ```
2. **Compilar y ejecutar la aplicación:**
   ```bash
   ./mvnw spring-boot:run
   ```
3. **Verificar que el servicio responde:**
   Abrir en el navegador: `http://localhost:8080/swagger-ui.html`

## 3. Credenciales de prueba (data.sql)
| Usuario | Contraseña | Rol | Ámbito |
| :--- | :--- | :--- | :--- |
| `admin` | `password123` | `ADMINISTRADOR` | Acceso global a todos los recursos y presupuestos |
| `jefe1` | `password123` | `JEFE_PROYECTO` | Responsable de los proyectos PRJ-2026-001 y 002 |
| `operario1` | `password123` | `DESARROLLADOR` | Operario asignado a tareas de campo |

## 4. Documentación interactiva (Swagger UI)
* URL: `http://localhost:8080/swagger-ui.html`
* Para probar endpoints protegidos: autenticarse en `/api/v1/auth/login`, copiar el token Bearer y pulsar en el botón **Authorize**.

## 5. Colección de pruebas de integración
En la carpeta `/bruno` se incluye la colección completa exportada para verificar los flujos de negocio sin depender del frontend.
````

### Paso a paso guiado · Refactorización limpia y eliminación de deuda

<p class="stage">Paso 1 · Poner la red de seguridad antes de tocar nada</p>

Refactorizar es cambiar la forma sin cambiar el comportamiento. Sin una manera de comprobar que el comportamiento no ha cambiado, no estás refactorizando: estás reescribiendo a ciegas.

1. Ejecuta `./mvnw clean verify` y comprueba que **todo está en verde antes de empezar**.
2. Haz `git commit` de ese estado. Es tu punto de retorno.
3. A partir de aquí, la regla es: un cambio pequeño → ejecutar los tests → commit. Si algo se pone en rojo, sabes exactamente qué lo rompió porque solo has tocado una cosa.

<p class="stage">Paso 2 · Erradicar números y cadenas mágicas</p>

Busca en tu código literales sueltos con `Ctrl+Shift+F`: números que no sean `0` o `1`, y cadenas entre comillas que no sean mensajes.

```java
// ANTES: ¿qué es 150000? ¿por qué 150000?
if (proyecto.getPresupuestoTotal().compareTo(new BigDecimal("150000.0")) > 0) {
    throw new ReglaDeNegocioException("Presupuesto excedido");
}

// DESPUÉS: el número tiene nombre, y vive en un solo sitio
public static final BigDecimal PRESUPUESTO_MAXIMO_SIN_APROBACION = new BigDecimal("150000.00");

if (proyecto.getPresupuestoTotal().compareTo(PRESUPUESTO_MAXIMO_SIN_APROBACION) > 0) {
    throw new ReglaDeNegocioException("Presupuesto excedido");
}
```

Si el valor puede cambiar sin recompilar —un límite de tamaño de fichero, una URL, un tiempo de expiración—, no es una constante: es una propiedad. Sácalo a `application.properties` e inyéctalo con `@Value`.

<p class="stage">Paso 3 · Adelgazar los controladores</p>

Recorre tus controladores y comprueba que **ningún método contiene**: un `if` de negocio, una cuenta, una llamada a un repositorio o un `try/catch`. Un método de controlador tiene tres líneas: recibe, delega, responde.

```java
// ANTES: el controlador está decidiendo
@PatchMapping("/{id}/estado")
public ResponseEntity<TareaResponse> cambiarEstado(@PathVariable Long id, @RequestBody EstadoRequest req) {
    Tarea tarea = tareaRepository.findById(id).orElseThrow();
    if (tarea.getEstado() == EstadoTarea.FINALIZADA) {
        return ResponseEntity.status(409).build();
    }
    tarea.setEstado(req.nuevoEstado());
    tareaRepository.save(tarea);
    return ResponseEntity.ok(TareaMapper.aRespuesta(tarea));
}

// DESPUÉS: el controlador solo traduce HTTP; la regla y el 409 viven en el servicio
@PatchMapping("/{id}/estado")
public ResponseEntity<TareaResponse> cambiarEstado(@PathVariable Long id,
                                                   @Valid @RequestBody EstadoRequest req) {
    return ResponseEntity.ok(tareaService.cambiarEstado(id, req.nuevoEstado()));
}
```

Si esto te suena, es porque es exactamente el ejercicio de la sesión 22, «El controller monstruoso». Cinco meses después, el código vuelve a engordar por el mismo sitio: esa recurrencia es la lección.

<p class="stage">Paso 4 · Limpieza de código muerto</p>

1. Elimina los `import` no utilizados (tu IDE los marca en gris; `Ctrl+Alt+O` en IntelliJ los quita todos).
2. Borra los métodos privados que nadie llama y los endpoints de prueba que fuiste dejando por el camino: `/clima-raw` de la sesión 61, cualquier `/test`, `/boom` o `/diagnostico`. Están sin proteger y sin documentar.
3. Borra los comentarios que ya mienten. Un comentario que contradice al código es peor que no tener comentario: el código es verdad por definición y el comentario engaña al que lo lee.
4. Ejecuta `./mvnw clean verify` una última vez. Si sigue verde, has refactorizado. Si no, has cambiado el comportamiento sin querer, y ahí tienes el porqué del paso 1.

### La comprobación · La prueba del desarrollador nuevo

Simula que eres un nuevo integrante del equipo que acaba de clonar el proyecto:
1. Abre una terminal limpia en una carpeta vacía.
2. Sigue exclusivamente los pasos indicados en tu `README.md`.
3. Comprueba que:
   * La base de datos levanta sin errores de puerto.
   * La aplicación arranca sin fallos de `ddl-auto=validate`.
   * Puedes autenticarte en Swagger UI con las credenciales documentadas.
   * La colección de Bruno pasa todas las peticiones con éxito.

### Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| Tras refactorizar, un test se pone en rojo | Has cambiado comportamiento, no solo forma | Vuelve al último commit verde y repite el cambio en trozos más pequeños |
| `docker compose up -d` falla con `port is already allocated` | Ya tienes un PostgreSQL escuchando en 5432 | Párale, o mapea otro puerto en el `docker-compose.yml` y ajusta la URL |
| La aplicación arranca en tu máquina pero no en la limpia | Hay configuración que solo existe en tu equipo | Variables de entorno, rutas absolutas de la carpeta de adjuntos o una base de datos creada a mano meses atrás |
| `Schema-validation: missing table` con `ddl-auto=validate` | El `schema.sql` no está sincronizado con las entidades | Es justo lo que este modo existe para detectar: corrige el script, no bajes a `update` |
| El `README` funciona para ti y para nadie más | Lo has probado con la aplicación ya arrancada | La prueba solo vale desde una terminal nueva y una base de datos recién creada |

### Ahora tú · Pulir y validar Swagger UI

Entra en `http://localhost:8080/swagger-ui.html` y haz la última pasada de contrato:

1. Revisa cada uno de los endpoints de la aplicación, uno por uno, sin saltarte ninguno.
2. Comprueba que todos los esquemas de respuesta tienen ejemplos legibles y que los códigos de error 400, 401, 403, 404 y 409 están formalmente documentados con `@ApiResponse`.
3. Configura el esquema de seguridad para que Swagger sepa pedir el token: añade a `OpenApiConfig` un `SecurityScheme` de tipo `HTTP` con esquema `bearer` y formato `JWT`, y comprueba que aparece el botón **Authorize**. Sin él, ningún endpoint protegido se puede probar desde la documentación, y un evaluador que solo tenga tu Swagger no verá funcionar la mitad de la aplicación.
4. Corrige cualquier incoherencia de nombres entre los DTO: si en un sitio es `fechaInicio` y en otro `fecha_inicio`, quien consuma tu API va a tropezar exactamente ahí.
5. Descarga `http://localhost:8080/v3/api-docs` y guárdalo como `openapi.json` junto al `README`. Es el contrato congelado de la versión que entregas.
6. **La prueba del contrato de tres minutos:** dale a un compañero la URL de tu Swagger, sin explicarle nada, y pídele que se autentique y cree un proyecto con una tarea. Cronométralo. Si tarda más de tres minutos o tiene que preguntarte algo, la documentación no está terminada.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>La suite sigue verde después de refactorizar; no queda ningún literal numérico de negocio suelto en el código; ningún controlador contiene un <code>if</code>; una persona ajena ha levantado tu proyecto siguiendo solo el <code>README</code>, y otra ha usado tu API entera desde Swagger sin preguntarte nada.</dd>
</dl>

### Reto · Contenedorización completa con Docker Compose

Diseña un archivo `docker-compose.yml` que levante tanto la base de datos PostgreSQL como la propia aplicación Spring Boot empaquetada:
1. Diseña un `Dockerfile` multietapa (*Multi-stage Build*) con Eclipse Temurin 21: una primera etapa con Maven que compile el `.jar`, y una segunda que solo copie ese `.jar` sobre una imagen con JRE.
2. Configura en `docker-compose.yml` la dependencia `depends_on` con comprobación de salud (`healthcheck`) usando `pg_isready`, para que Spring Boot no arranque hasta que PostgreSQL acepte conexiones.
3. Recuerda que dentro de la red de Docker el host de la base de datos **ya no es `localhost`**, sino el nombre del servicio (`db`). Externaliza la URL con una variable de entorno en lugar de dejarla escrita en `application.properties`.
4. Comprueba que con un único comando `docker compose up --build` el sistema completo queda operativo en un ordenador que no tenga ni Java ni PostgreSQL instalados.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>README técnico operativo con requisitos, credenciales y puesta en marcha.</span></div>
  <div><strong>Si lo tienes</strong><span>Swagger UI enriquecido sincronizado y código refactorizado libre de constantes mágicas.</span></div>
  <div><strong>Reto</strong><span>Dockerfile multi-stage y docker-compose.yml orquestando backend y base de datos con healthchecks.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 77</p>
  <ul class="checklist">
    <li>La entrega está sincronizada en sus tres dimensiones: código, contrato y guía técnica.</li>
    <li>El archivo <code>README.md</code> permite desplegar el proyecto en menos de 3 minutos.</li>
    <li>Las credenciales de prueba por cada rol están claramente documentadas.</li>
    <li>El código fuente ha sido refactorizado manteniendo los controladores delgados.</li>
    <li>La especificación OpenAPI 3 refleja fielmente el comportamiento real del sistema.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es fundamental que el README incluya una tabla de credenciales de prueba por cada rol?</li>
    <li>¿Qué caracteriza a un «controlador delgado» (*Skinny Controller*) en una arquitectura limpia?</li>
    <li>¿Por qué se debe realizar la refactorización únicamente cuando todos los tests están en verde?</li>
    <li>¿Qué ventaja aporta un Dockerfile multietapa (*Multi-stage Build*) frente a un Dockerfile convencional?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque permite a cualquier evaluador o nuevo compañero probar de inmediato la matriz de permisos y el comportamiento de la seguridad sin tener que inspeccionar los scripts SQL o adivinar contraseñas.</p>
  <p>2 · Un controlador que carece por completo de lógica de negocio o acceso a datos; su única función es deserializar la petición, validar anotaciones básicas, invocar al servicio correspondiente y retornar la respuesta HTTP tipada.</p>
  <p>3 · Porque los tests en verde actúan como red de seguridad inmutable: si durante la limpieza de código introduces un error sutil, los tests fallarán al instante avisándote de la regresión.</p>
  <p>4 · Separa la fase pesada de compilación (Maven + JDK completa) de la imagen final de ejecución (solo JRE ligera), reduciendo el tamaño de la imagen Docker de 800 MB a menos de 200 MB y mejorando la seguridad.</p>
</details>

## Sesión 78 · Defensa técnica

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> a defender técnicamente un proyecto backend ante un tribunal de ingeniería: la diferencia entre una demostración comercial y una argumentación arquitectónica con evidencias, la gestión de preguntas difíciles sobre concurrencia y seguridad, y la honestidad profesional al explicar límites y deuda técnica.</li>
    <li><strong>2. Haz:</strong> estructura el guion de defensa técnica de 15 minutos, prepara la batería de pruebas en vivo en Bruno demostrando camino feliz y casos límite de negocio, y redacta la memoria técnica final con las decisiones justificadas del sistema.</li>
    <li><strong>3. Comprueba:</strong> ejecutas la defensa técnica simulada demostrando el flujo integral en vivo (seguridad JWT, persistencia transaccional, degradación meteorológica y control presupuestario), respondiendo con solvencia y evidencias de código a las preguntas del tribunal.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué diferencia una presentación comercial de un producto de una defensa técnica de ingeniería de software?</li>
    <li>Si un miembro del tribunal te pregunta por un caso límite que no contemplaste en tu código, ¿cuál es la respuesta profesional adecuada?</li>
    <li>¿Por qué es imprescindible respaldar cada afirmación de la defensa con una evidencia empírica (un test, un log con correlationId o una consulta SQL)?</li>
  </ol>
</div>

### La prueba definitiva: La Defensa Técnica

Llegar a la Sesión 78 significa que has completado el viaje completo: desde las primeras peticiones HTTP en la UD1 hasta un sistema empresarial complejo, seguro, observable y conectado.

En el mundo profesional y académico, **el valor de un ingeniero se demuestra en la defensa de sus decisiones**:
* Un comercial habla de lo atractiva que es la interfaz.
* Un **ingeniero de backend** explica por qué utilizó un tipo `NUMERIC(12,2)` para evitar pérdidas de precisión en dinero, cómo configuró un timeout de 2 segundos en `RestClient` para evitar el agotamiento de hilos en Tomcat, y cómo una política CORS bien diseñada protege a sus usuarios.

<div class="rule">
  <p class="rule-label">El principio de la defensa técnica</p>
  <p><strong>No defiendas que tu código es perfecto: defiende que conoces sus decisiones, sus compromisos y sus límites.</strong></p>
  <p>Un tribunal respeta al desarrollador que reconoce con honestidad: <em>«Esta relación la resolvimos con paginación en memoria por simplicidad, pero en una versión con un millón de registros introduciríamos un índice compuesto en PostgreSQL y particionamiento»</em>.</p>
</div>

### Estructura de la Defensa Técnica (15 minutos)

Distribuye tu exposición con rigor profesional siguiendo este minutaje:

<figure class="diagram">
  <figcaption>Cronograma de la defensa técnica ante tribunal</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>0–3 min: Arquitectura, modelo relacional y decisiones de diseño</li>
    <li>3–8 min: Demostración en vivo en Bruno (Happy Path y Casos Límite)</li>
    <li>8–12 min: Seguridad RBAC/ABAC, Resiliencia y Observabilidad (Logs MDC)</li>
    <li>12–15 min: Deuda técnica, límites honestos y turno de preguntas</li>
  </ol>
</figure>

1. **Bloque 1: Arquitectura y Modelo (3 minutos):**
   * Muestra el diagrama de agregados (`Proyecto`, `Tarea`, `Incidencia`, `Usuario`).
   * Justifica la elección de tipos de datos (`BIGINT IDENTITY`, `NUMERIC(12,2)` para dinero) y la estrategia de esquemas versionados con `ddl-auto=validate`.
2. **Bloque 2: Demostración en vivo en Bruno (5 minutos):**
   * No uses diapositivas estáticas: **abre Bruno y ejecuta peticiones reales**.
   * Demuestra el camino feliz: autenticación JWT → creación de proyecto → respuesta `201 Created` con cabecera `Location`.
   * Demuestra la robustez ante errores de negocio: intenta sobrepasar el presupuesto total de un proyecto y muestra el error `400 Bad Request` o intenta cerrar con tareas pendientes mostrando el código `409 Conflict`.
3. **Bloque 3: Seguridad, Resiliencia y Observabilidad (4 minutos):**
   * Muestra la matriz de permisos: autentícate con un rol no autorizado y muestra el `403 Forbidden`.
   * Demuestra la degradación elegante: simula la desconexión de la red de Open-Meteo y enseña cómo la incidencia se guarda con aviso en lugar de romper con un 500.
   * Abre la terminal y enseña el archivo de logs: filtra por un `X-Correlation-ID` y demuestra la trazabilidad de la llamada.
4. **Bloque 4: Límites y Compromisos de Ingeniería (3 minutos):**
   * Explica los compromisos adquiridos (*Trade-offs*): qué optimizaste (velocidad de desarrollo, consistencia) y qué quedó como deuda técnica para una futura versión 2.0 (ej: migrar a Transactional Outbox para webhooks).

### Paso a paso guiado · Preparación del guion y simulación de preguntas

Las cuatro preguntas clásicas que formulará el tribunal y cómo argumentarlas:

| Pregunta del tribunal | Enfoque de respuesta profesional con evidencias |
| :--- | :--- |
| *«¿Por qué utilizaste tokens JWT en lugar de sesiones tradicionales con cookies en el servidor?»* | *"Porque nuestra arquitectura desacopla el backend de múltiples clientes potenciales (web Angular y clientes móviles de campo); el token JWT stateless permite escalar horizontalmente sin replicar memoria de sesiones en Tomcat."* |
| *«¿Qué ocurre si dos usuarios intentan crear tareas al mismo tiempo y el presupuesto no alcanza para ambas?»* | *"La comprobación y el guardado se ejecutan dentro de una transacción con aislamiento en PostgreSQL; además hemos evaluado el uso de bloqueos pesimistas (`PESSIMISTIC_WRITE`) sobre la fila del proyecto para serializar las operaciones concurrentes."* |
| *«¿Por qué no guardas los ficheros directamente en una tabla de base de datos como campos BLOB?»* | *"Porque saturaría el tamaño de las copias de seguridad de PostgreSQL y penalizaría la memoria RAM del motor relacional; almacenar los binarios en un volumen de almacenamiento externo con nombres UUID opacos y guardar solo los metadatos en la base de datos es el estándar de la industria."* |
| *«Si tu servicio meteorológico externo se congela, ¿se congela tu backend?»* | *"No, porque hemos configurado un Connect Timeout de 2 segundos y un Read Timeout de 3 segundos mediante `SimpleClientHttpRequestFactory` en `RestClient`, acompañado de un bloque de degradación elegante que devuelve datos por defecto."* |

| *«Me dices que tienes un 80 % de cobertura. ¿Qué parte del sistema es la que peor está probada?»* | *"La cobertura de líneas es engañosa. Nuestro punto más débil es la concurrencia sobre el presupuesto: los tests la comprueban en secuencia, no con hilos simultáneos. Lo detectamos en la sesión 76 y está anotado como riesgo abierto en la memoria."* |
| *«Enséñame dónde está escrita la regla de que un operario no puede cerrar un proyecto.»* | Aquí no se contesta con palabras: se abre el código. *"Está en dos sitios, y a propósito: el `@PreAuthorize` de este método y el test `operario_noPuedeCerrarProyecto` que lo vigila. Si alguien quita la anotación, la suite se pone en rojo."* |
| *«¿Qué harías distinto si empezaras hoy?»* | La peor respuesta es «nada». *"Habría sacado el esquema a Flyway desde el primer día en vez de a `schema.sql`: lo hicimos en la sesión 71 y ya arrastrábamos datos que hubo que migrar a mano."* |

<p class="stage">Paso 1 · Construir el guion sobre evidencias, no sobre afirmaciones</p>

Escribe tu guion en una tabla de tres columnas. La tercera es la que decide si apruebas:

| Minuto | Lo que digo | Lo que **enseño** mientras lo digo |
| :--- | :--- | :--- |
| 0–3 | El modelo y por qué estos tipos de datos | El diagrama y la clase `Proyecto` con su `@Column(precision = 12, scale = 2)` |
| 3–8 | El camino feliz y dos casos límite | La colección ejecutándose en vivo |
| 8–12 | Seguridad, resiliencia y trazas | Un `403` real, la red caída y el log filtrado por `correlationId` |
| 12–15 | Lo que no está terminado | La lista de deuda técnica de la memoria |

Cualquier fila cuya tercera columna quede vacía es una afirmación sin prueba. O le buscas evidencia, o la quitas del guion: en una defensa técnica, lo que no se enseña no cuenta.

<p class="stage">Paso 2 · Preparar el entorno de la demostración</p>

Una demostración se cae por logística, no por código. Prepara esto **antes** del día:

1. Una carpeta en tu cliente HTTP llamada `defensa`, con las peticiones **en el orden exacto** del guion y numeradas: `01-login-admin`, `02-crear-proyecto`, `03-crear-tarea`…
2. Variables de entorno configuradas para que el token se guarde solo tras el login. Nadie debe verte copiando y pegando un JWT de 300 caracteres en directo.
3. Un `data.sql` con datos de demostración creíbles: proyectos con nombres reales, no `aaa` ni `test1`.
4. Una segunda ventana de terminal con los logs ya corriendo, y el tamaño de letra subido para que se lea desde el fondo del aula.
5. Un plan B: si la red del centro falla, tu degradación elegante hará que la demostración siga funcionando. Practica **contando eso** como una virtud, porque lo es.

<p class="stage">Paso 3 · Ensayar con un compañero haciendo de tribunal</p>

1. Intercambia proyectos con otro equipo.
2. Cada uno prepara **cinco preguntas** sobre el proyecto ajeno, mirando el código, no la memoria.
3. Haced la defensa completa cronometrada, con preguntas al final.
4. Anota las preguntas que no supiste contestar: esa lista es tu única tarea pendiente hasta el día de la defensa.

### La comprobación · Ensayo general cronometrado

1. **Prepara el entorno:**
   * Arranca Docker con PostgreSQL limpio.
   * Levanta el backend con `./mvnw spring-boot:run`.
   * Abre Bruno con la colección ordenada de la defensa.
   * Abre la terminal con `tail -f logs/aplicacion.log`.
2. **Ejecuta el ensayo con cronómetro en mano:**
   * Comprueba que completas la exposición en exactamente 12 minutos, dejando 3 minutos limpios para preguntas.
   * Si alguna petición falla en vivo, **no entres en pánico**: copia el `correlationId` del JSON de error, búscalo en la terminal de logs y explica al tribunal con total calma qué regla de validación o seguridad ha actuado. **Eso demuestra madurez de ingeniería.**

### Si algo se tuerce en directo

| Lo que pasa | Lo que no hay que hacer | Lo que demuestra madurez |
| :--- | :--- | :--- |
| Una petición devuelve un error que no esperabas | Recargar cinco veces en silencio | Leer el `detail` en voz alta, buscar el `correlationId` en los logs y explicar qué ha pasado |
| No hay red en el aula | Abandonar la demostración | Enseñar que la degradación elegante mantiene la aplicación en pie: es una prueba mejor que la prevista |
| Te preguntan algo que no sabes | Improvisar una explicación falsa | *«No lo he medido, así que no te lo puedo afirmar. Lo que sí sé es…»* |
| Se te acaba el tiempo | Acelerar y saltarte los límites | Ir directo al bloque 4: reconocer la deuda técnica puntúa más que un caso feliz de más |
| El tribunal encuentra un fallo real | Justificarlo o minimizarlo | Reconocerlo, decir qué test lo habría cazado y dónde lo colocarías |

### Ahora tú · Redactar la Memoria Técnica de la Defensa

Elabora la memoria técnica consolidada del proyecto. Cada apartado debe apoyarse en algo que existe en el repositorio, no en una descripción general:

1. **Resumen ejecutivo:** qué resuelve el sistema y con qué tecnologías, en una página.
2. **Modelo de datos:** diagrama entidad-relación y justificación del esquema SQL, tipo por tipo en los campos delicados (dinero, fechas, estados).
3. **Contrato de la API:** matriz de seguridad RBAC/ABAC frente a la lista de endpoints, con el `openapi.json` de la sesión 77 como anexo.
4. **Resiliencia:** qué servicios externos consumes, con qué timeouts, qué pasa cuando fallan y cómo lo has comprobado.
5. **Estrategia de pruebas:** qué cubre la suite, qué **no** cubre, y el dato de la sesión 76 sobre cuántos fallos encontró la pasada manual que los tests no vieron.
6. **Deuda técnica:** inventario honesto de lo que dejarías distinto, ordenado por lo que más duele. Este apartado, bien hecho, vale más que cualquier otro: es el que demuestra que sabes juzgar tu propio trabajo.
7. **Trazabilidad del curso:** una tabla final que asocie cada capacidad del sistema con la unidad donde la aprendiste. Es tu propio índice de lo que sabes hacer, y es lo que te llevas del módulo.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Has completado la defensa entera dentro del tiempo, con la demostración en vivo funcionando de principio a fin; cada afirmación del guion tiene una evidencia que la acompaña; sabes contestar las cinco preguntas que te hizo el equipo con el que ensayaste; y la memoria incluye un apartado de límites que no rebaja lo que hiciste, sino que lo sitúa.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>La memoria técnica final y el guion de defensa del proyecto backend se entregarán exclusivamente en <strong>documento en formato PDF</strong> (<code>memoria-defensa-tecnica.pdf</code>), sin archivos markdown como tarea de alumnos.</p>
</div>

### Reto · Automatización de la demo con Newman o Bruno CLI

En lugar de pulsar las peticiones una a una en la interfaz gráfica durante la defensa, automatiza la ejecución de toda la suite de pruebas desde la línea de comandos:
1. Instala el CLI de Bruno (`@usebruno/cli`) o utiliza Newman.
2. Ejecuta la colección completa por consola:
   `bru run --env local`
3. Muestra al tribunal cómo se ejecutan 30 peticiones secuenciales con aserciones automatizadas de códigos HTTP, cabeceras y esquemas JSON en menos de 5 segundos.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Guion de defensa estructurado y demostración en vivo de los casos principales en Bruno.</span></div>
  <div><strong>Si lo tienes</strong><span>Demostración de casos límite de negocio, degradación de red y trazabilidad en logs con MDC.</span></div>
  <div><strong>Reto</strong><span>Ejecución desatendida de la suite completa de integración mediante CLI en terminal.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 78</p>
  <ul class="checklist">
    <li>Se supera la presentación comercial centrando la defensa en decisiones de ingeniería.</li>
    <li>La demostración en vivo acredita el funcionamiento de las reglas de negocio en base de datos.</li>
    <li>Se justifican con solvencia las decisiones de seguridad, persistencia y resiliencia.</li>
    <li>Se reconocen los límites del sistema con honestidad técnica y propuestas de evolución.</li>
    <li>El proyecto backend completo queda formalmente defendido y concluido con éxito.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué una demostración técnica en vivo es infinitamente más convincente que una presentación de diapositivas estáticas?</li>
    <li>¿Cómo debe reaccionar un desarrollador si una petición falla inesperadamente durante una demo ante un tribunal?</li>
    <li>¿Por qué reconocer las limitaciones o deuda técnica del proyecto mejora la valoración de un tribunal de ingeniería?</li>
    <li>¿Qué tres pilares de un backend empresarial deben quedar demostrados durante la defensa técnica?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque demuestra de forma irrefutable que el sistema está vivo, que el código compila, que la base de datos persiste datos reales y que la aplicación responde a las reglas de negocio acordadas.</p>
  <p>2 · Manteniendo la calma, leyendo el código de estado devuelto, acudiendo a los logs mediante el correlationId e interpretando con fundamento qué ha ocurrido; depurar un fallo en vivo con soltura transmite enorme competencia técnica.</p>
  <p>3 · Porque ningún software real es perfecto; demostrar que eres consciente de los cuellos de botella y que sabes cómo resolverlos en una siguiente versión refleja pensamiento crítico y madurez profesional.</p>
  <p>4 · La integridad de los datos (persistencia transaccional en PostgreSQL), la seguridad (autenticación y autorización RBAC/ABAC) y la resiliencia (observabilidad, timeouts y degradación elegante ante fallos externos).</p>
</details>

## Lo que debes recordar

### El método

En esta última unidad has demostrado que eres capaz de transformar una especificación empresarial ambigua en un backend completo, seguro, observable y defendible ante un tribunal de ingeniería.

A lo largo de las 12 unidades del curso has construido una metodología profesional completa. Cuando afrontes cualquier proyecto backend en tu carrera profesional, aplica siempre este decálogo maestro:

<figure class="diagram">
  <figcaption>El decálogo maestro del desarrollo web en entorno servidor</figcaption>
  <ol class="flow">
    <li><strong>Especifica antes de codificar</strong>: define actores, casos de uso con intención de negocio y reglas invariantes en formato Gherkin.</li>
    <li><strong>Controla el esquema SQL</strong>: prohíbe <code>ddl-auto=update</code>; utiliza scripts versionados y configura Hibernate en modo <code>validate</code>.</li>
    <li><strong>Protege los tipos de datos</strong>: utiliza <code>BIGINT IDENTITY</code> para claves primarias y <strong><code>NUMERIC(12,2)</code> / <code>BigDecimal</code> obligatorio para dinero</strong>.</li>
    <li><strong>Avanza por Cortes Verticales (<em>Vertical Slices</em>)</strong>: construye valor desplegable de extremo a extremo desde el primer día.</li>
    <li><strong>Aplica la Pirámide de Pruebas</strong>: prioriza tests unitarios rápidos y audita la cobertura de ramas (<em>Branch Coverage</em>) con JaCoCo.</li>
    <li><strong>Cierra el perímetro de seguridad</strong>: autentica con Bearer JWT y protege tanto los roles (RBAC) como la propiedad del recurso (ABAC con SpEL).</li>
    <li><strong>Asume las falacias de la red</strong>: toda llamada externa con <code>RestClient</code> debe tener <strong>Timeouts estrictos</strong> y <strong>Degradación Elegante</strong>.</li>
    <li><strong>Sanitiza todo fichero binario</strong>: almacena los ficheros con UUIDs en directorios externos al classpath y valida firmas y tipos MIME.</li>
    <li><strong>Garantiza la observabilidad en producción</strong>: prohíbe <code>System.out</code>, estructura tus logs con SLF4J/Logback y correlaciona peticiones con <strong>MDC</strong>.</li>
    <li><strong>Sincroniza y defiende con evidencias</strong>: mantén código, contratos OpenAPI y documentación alineados, y defiende tus decisiones con pruebas en vivo.</li>
  </ol>
</figure>

### La idea más importante

> **Un backend profesional no se define por las librerías que utiliza, sino por su capacidad para proteger la integridad de los datos, aislarse de los fallos del entorno, responder de forma predecible y poder ser defendido técnicamente ante cualquier tribunal o equipo de ingeniería.**

Cualquiera puede hacer una demo que funcione con tres datos ideales en su portátil. Un verdadero ingeniero de servidor diseña sistemas que resisten la concurrencia, protegen la confidencialidad, no colapsan cuando se cae un proveedor externo y se depuran con facilidad gracias a trazas correlacionadas.

### Las decisiones maestras que tienes que saber justificar

| Decisión de ingeniería | Lo que tienes que poder defender ante un tribunal |
| :--- | :--- |
| **Corte Vertical frente a Capas Horizontales** | El corte vertical entrega valor funcional verificable de inmediato y reduce el riesgo de descubrir incompatibilidades arquitectónicas tardías. |
| **`ddl-auto=validate` frente a `update`** | Evita la corrupción silenciosa del esquema relacional en producción, garantizando que los índices y restricciones están bajo control de scripts SQL versionados. |
| **`NUMERIC` / `BigDecimal` frente a `DOUBLE`** | Elimina los errores de redondeo binario en operaciones aritméticas financieras, garantizando la exactitud contable al céntimo. |
| **Seguridad ABAC con SpEL (`@seguridadService`)** | Impide que un usuario con rol legítimo (ej: jefe de proyecto) modifique recursos o presupuestos asignados a otros responsables de su mismo nivel. |
| **Timeouts obligatorios en llamadas HTTP salientes** | Protege al servidor contra el agotamiento de hilos (*Thread Starvation*) en Tomcat cuando una API externa deja de responder. |
| **Degradación Elegante (*Graceful Degradation*)** | Garantiza la continuidad del negocio; una incidencia en obra se registra aunque el servicio meteorológico externo esté fuera de línea. |
| **Almacenamiento de ficheros con UUID en disco** | Neutraliza los ataques de salto de directorio (*Path Traversal*) y ejecución remota de código (RCE). |
| **MDC con `Correlation ID` en logs** | Permite reconstruir en segundos la secuencia de operaciones de una petición específica entre miles de transacciones concurrentes. |
| **Configuración granular de CORS** | Permite la integración segura con clientes frontend como Angular resolviendo de forma explícita las peticiones preflight `OPTIONS`. |
| **Documentación viva OpenAPI 3 / Swagger** | Mantiene los contratos de la API sincronizados de forma automática con la implementación real del código fuente Java. |

### Al terminar el curso deberías poder responder

1. ¿Qué transformaciones ocurren en una petición HTTP desde que sale del navegador hasta que Hibernate ejecuta una sentencia SQL?
2. ¿Por qué la separación estricta entre Entidades JPA y DTOs inmutables (`record`) es un principio innegociable de arquitectura limpia?
3. ¿Cómo se diseñan las relaciones bidireccionales en JPA para evitar bucles infinitos de serialización y problemas de rendimiento N+1?
4. ¿Cuál es el papel exacto del filtro `SecurityFilterChain` en Spring Security al interceptar una petición con Bearer Token?
5. ¿Cómo se implementa el hashing unidireccional de contraseñas con BCrypt y qué función cumple el factor de coste (*work factor*)?
6. ¿Por qué una API REST moderna debe estandarizar sus respuestas de error siguiendo el estándar RFC 7807 Problem Details?
7. ¿Qué diferencia técnica existe entre una clave autonumérica `IDENTITY` de 64 bits y un identificador UUID en una base de datos relacional?
8. ¿Cómo protege una máquina de estados finita a las entidades críticas frente a mutaciones ilegales o desordenadas?
9. ¿Por qué es una mala práctica empresarial ejecutar llamadas HTTP externas dentro de un bloque `@Transactional`?
10. ¿Cómo garantiza el patrón de Eventos de Dominio con `@TransactionalEventListener(phase = AFTER_COMMIT)` la consistencia eventual?
11. ¿Qué es el protocolo `multipart/form-data` y por qué es obligatorio para la transmisión combinada de ficheros y metadatos?
12. ¿Por qué almacenar archivos con UUID fuera de la carpeta `static` del proyecto previene ataques de ejecución remota de código (RCE)?
13. ¿Qué mide la métrica de cobertura de ramas (*Branch Coverage*) y por qué es superior a la cobertura de líneas convencional?
14. ¿Qué cuatro problemas operativos introduce el uso de `System.out.println` en aplicaciones web desplegadas en la nube?
15. ¿Cómo se utiliza el `Mapped Diagnostic Context` (MDC) de SLF4J para inyectar trazabilidad contextual en los archivos de log?
16. ¿Qué es una petición de sondeo previo (*Preflight Request*) en el estándar CORS y qué cabeceras exige resolver al backend?
17. ¿Cómo se vincula el manejo de errores en un cliente Angular mediante un `HttpInterceptor` para capturar objetos Problem Details?
18. ¿Qué diferencia una prueba unitaria pura con Mockito de una prueba de integración con `@SpringBootTest`?
19. ¿Por qué el principio de degradación elegante es esencial para construir sistemas tolerantes a fallos en la web moderna?
20. ¿Qué actitudes y argumentos distinguen una defensa técnica de ingeniería de software de una presentación meramente comercial?

### El vocabulario consolidado del curso

| Concepto | Significa |
| :--- | :--- |
| **API REST** | Interfaz de programación que utiliza los métodos, códigos y cabeceras del protocolo HTTP para la manipulación de recursos desacoplados. |
| **DTO** | *Data Transfer Object*: objeto inmutable diseñado exclusivamente para transportar datos entre capas sin exponer el modelo relacional. |
| **JPA / Hibernate** | Estándar de persistencia en Java y su implementación de referencia para mapear objetos de dominio a tablas relacionales SQL. |
| **ACID** | Conjunto de propiedades que garantizan la fiabilidad de las transacciones en bases de datos: Atomicidad, Consistencia, Aislamiento y Durabilidad. |
| **Spring Security** | Framework declarativo de autenticación, autorización y protección contra ataques para aplicaciones basadas en Spring. |
| **JWT** | *JSON Web Token*: estándar compacto y autocontenido (RFC 7519) para transmitir identidades y permisos firmados criptográficamente. |
| **RBAC / ABAC** | Control de acceso basado en roles (*Role-Based*) y control de acceso basado en atributos o propiedad del dato (*Attribute-Based*). |
| **RestClient** | Cliente HTTP moderno, síncrono y fluido de Spring Boot para iniciar peticiones salientes hacia APIs de terceros. |
| **Graceful Degradation** | Capacidad de un sistema para seguir operativo con datos por defecto o funcionalidad reducida ante la caída de un servicio secundario. |
| **MDC** | *Mapped Diagnostic Context*: almacén por hilo de SLF4J que permite estampar identificadores de correlación en todas las líneas de log. |
| **CORS** | Mecanismo de seguridad de los navegadores que regula si una aplicación web de un origen puede solicitar recursos a otro servidor distinto. |
| **OpenAPI 3 / Swagger** | Especificación estándar e interfaz interactiva para describir contratos de APIs REST de forma viva y autogenerada. |
| **Vertical Slice** | Estrategia de entrega que implementa un caso de uso completo a través de todas las capas en lugar de construir estratos horizontales aislados. |
| **Walking Skeleton** | Implementación mínima ejecutable de extremo a extremo que conecta la interfaz, la lógica y la base de datos desde el inicio del proyecto. |
| **Problem Details (RFC 7807)** | Formato estándar de JSON para comunicar errores de HTTP con estructura predecible (status, title, detail, instance). |

### Comprobación final del producto de la unidad

<div class="checkpoint">
  <p class="checkpoint-label">Proyecto backend completo · criterios de producción</p>
  <ul class="checklist">
    <li>La especificación de negocio está formalizada en actores, reglas invariantes y escenarios Gherkin.</li>
    <li>El esquema relacional de PostgreSQL se gestiona mediante scripts SQL versionados con <code>ddl-auto=validate</code>.</li>
    <li>Los importes monetarios utilizan tipos de precisión decimal exacta (<code>NUMERIC</code> / <code>BigDecimal</code>).</li>
    <li>La arquitectura sigue una organización modular por componentes de negocio (*Package by Feature*).</li>
    <li>La relación entre agregados garantiza la integridad presupuestaria mediante transacciones ACID.</li>
    <li>El perímetro de seguridad combina autenticación JWT con autorización por rol (RBAC) y propiedad (ABAC).</li>
    <li>Las llamadas externas disponen de timeouts estrictos y degradación elegante garantizada.</li>
    <li>Los ficheros adjuntos se gestionan con almacenamiento seguro en disco mediante UUIDs opacos.</li>
    <li>La observabilidad está garantizada mediante SLF4J, rotación de archivos y Correlation ID en MDC.</li>
    <li>El backend es 100 % verificable de forma autónoma con Bruno e integrable con clientes Angular vía CORS.</li>
  </ul>
</div>

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


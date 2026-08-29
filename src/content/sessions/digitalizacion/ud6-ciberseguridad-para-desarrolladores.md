---
title: "Ciberseguridad para desarrolladores"
label: "UD6 · Proyecto"
section: "ud-06"
order: 6
lang: "es"
summary: "¿Publicarías esta aplicación? Aprende a detectar, explicar y corregir vulnerabilidades comunes con criterio propio y con la IA como apoyo de revisión."
duration: "4 horas · 4 sesiones"
modality: "Individual o parejas"
deliverable: "Auditoría de seguridad y corrección de una pequeña aplicación web."
outcomes:
  - "Reconocer los cinco errores de seguridad que más aparecen en una aplicación web."
  - "Explicar por qué algo es una vulnerabilidad, con evidencia y no de memoria."
  - "Auditar un proyecto con ayuda de la IA sin delegarle la decisión final."
  - "Corregir un fallo y verificar que la corrección no rompe la funcionalidad."
requirements:
  - "Visual Studio Code con GitHub Copilot activado."
  - "Git y una cuenta de GitHub."
  - "El proyecto que entrega el profesor al empezar la sesión 3."
priorKnowledge:
  - "Clonar un repositorio y leer un diff."
  - "Dirigir a un agente con contexto y criterios de aceptación (UD4)."
  - "Publicar una aplicación con firewall y HTTPS (UD3)."
date: "2026-08-29"
---

<p><strong>Herramientas:</strong> Visual Studio Code, GitHub Copilot y Git.</p>

## Sesión 1 · ¿Publicarías esta aplicación?

### El reto

Imaginad que acabáis de entrar a trabajar como desarrolladores.

Un compañero os entrega una aplicación y os dice:

> La funcionalidad está terminada. Solo falta subirla a producción.

La aplicación:

* arranca;
* permite iniciar sesión;
* consulta la base de datos;
* tiene una API;
* parece funcionar correctamente.

Entonces:

> ¿Está lista para producción?

No necesariamente. Un programa puede recorrer todo el camino habitual

<figure class="diagram">
  <figcaption>Lo que solemos comprobar</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Compilar</li>
    <li>Funcionar</li>
    <li>Pasar tests</li>
  </ol>
</figure>

y aun así ser:

<p class="term">Inseguro</p>

En esta unidad aprenderemos a detectar los errores de seguridad que un desarrollador debería reconocer antes de publicar una aplicación.

---

### La seguridad no se añade al final

Un enfoque incorrecto sería dejarla para el último paso:

<figure class="diagram">
  <figcaption>Antes · la seguridad como añadido</figcaption>
  <ol class="flow flow--before">
    <li>Diseñar</li>
    <li>Programar</li>
    <li>Publicar</li>
    <li>Añadir seguridad</li>
  </ol>
</figure>

La seguridad debería formar parte del desarrollo desde el principio:

<figure class="diagram">
  <figcaption>Después · la seguridad atraviesa todo el proceso</figcaption>
  <ol class="flow flow--after">
    <li>Diseño</li>
    <li>Desarrollo</li>
    <li>Testing</li>
    <li>Despliegue</li>
    <li>Mantenimiento</li>
  </ol>
</figure>

Esta idea suele denominarse:

<p class="term">Secure by Design</p>

La aplicación debe diseñarse preguntándose desde el primer día:

> ¿Qué podría salir mal?

---

### Pensar como desarrollador... y un poco como atacante

Cuando programamos solemos pensar:

> ¿Cómo conseguirá el usuario hacer lo que queremos?

<figure class="diagram">
  <figcaption>El camino previsto</figcaption>
  <ol class="flow">
    <li>Usuario introduce contraseña</li>
    <li>Login</li>
    <li>Accede a su perfil</li>
  </ol>
</figure>

Pero también debemos preguntarnos:

> ¿Qué ocurre si intenta hacer algo que NO queremos?

<figure class="diagram">
  <figcaption>El camino no previsto</figcaption>
  <ol class="flow">
    <li>Usuario cambia <code>/users/15</code> por <code>/users/16</code></li>
    <li>¿Puede ver otro usuario?</li>
  </ol>
</figure>

Esta segunda forma de pensar es fundamental para desarrollar software seguro.

---

### Tres preguntas antes de escribir código

Cuando desarrolléis una funcionalidad, preguntad:

#### ¿Qué quiero proteger?

Por ejemplo: contraseñas, datos personales, pedidos, cuentas, archivos o dinero.

Esto se denomina:

<p class="term">Activo</p>

#### ¿Quién puede intentar acceder?

Por ejemplo: un usuario normal, un administrador, un usuario no autenticado o un servicio externo.

#### ¿Qué podría intentar hacer?

Por ejemplo: ver información ajena, modificar datos, hacerse administrador, ejecutar código u obtener contraseñas.

No necesitamos realizar un análisis de amenazas complejo. Con estas tres preguntas ya podemos detectar muchos problemas.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Sabes explicar por qué «funciona» y «está lista para producción» no son lo mismo.</li>
    <li>Puedes nombrar tres activos de cualquier aplicación que uses a diario.</li>
    <li>Has formulado al menos una forma de abusar de una funcionalidad normal.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué significa <em>Secure by Design</em>?</li>
    <li>Pon un ejemplo de activo que no sea una contraseña.</li>
    <li>Un test verde, ¿demuestra que algo es seguro?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que la seguridad se decide durante el diseño y el desarrollo, no como un paso añadido antes de publicar.</p>
  <p>2 · Por ejemplo, un pedido, un historial médico, un fichero subido por el usuario o el saldo de una cuenta.</p>
  <p>3 · No. Un test comprueba que el programa hace lo que esperamos, no que impida lo que no esperamos.</p>
</details>

---

## Sesión 2 · Cinco errores que debes reconocer

Toda la teoría de esta unidad cabe en cinco familias de errores. No hay que memorizarlas: hay que ser capaz de reconocerlas cuando aparezcan en un proyecto real.

### 1 · Control de acceso

#### Autenticación y autorización no son lo mismo

Esta diferencia es extremadamente importante.

La **autenticación** responde:

> ¿Quién eres?

<figure class="diagram">
  <figcaption>Autenticación</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Email + contraseña</li>
    <li>Usuario Marc</li>
  </ol>
</figure>

La **autorización** responde:

> ¿Qué tienes permiso para hacer?

<figure class="diagram">
  <figcaption>Autorización</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Marc</li>
    <li>¿Puede ver /admin?</li>
    <li>No</li>
  </ol>
</figure>

Podemos estar perfectamente autenticados y no estar autorizados para realizar una determinada acción.

#### Un error muy frecuente

El usuario 15 consulta sus datos:

<p class="single-node single-node--mono">GET /api/users/15</p>

Ahora modifica la URL:

<p class="single-node single-node--mono">GET /api/users/16</p>

La aplicación responde con los datos del usuario 16. El login funciona perfectamente, pero existe un grave problema de:

<p class="term">control de acceso</p>

La aplicación debería comprobar siempre:

<figure class="diagram">
  <figcaption>La comprobación que falta</figcaption>
  <ol class="flow">
    <li>¿QUIÉN solicita el recurso?</li>
    <li>¿TIENE permiso?</li>
    <li>Entregar información</li>
  </ol>
</figure>

No basta con que exista una sesión válida.

#### Principio de mínimo privilegio

Un usuario o aplicación debería tener **solo los permisos que necesita para realizar su trabajo**.

| Acción de un usuario normal | ¿Debería poder? |
| --------------------------- | :-------------: |
| Leer sus pedidos            | Sí |
| Modificar su perfil         | Sí |
| Borrar otros usuarios       | No |
| Gestionar administradores   | No |

Una base de datos utilizada únicamente para leer informes quizá no necesita permisos para ejecutar `DROP TABLE`.

Menos permisos significa menos daño posible si algo sale mal.

---

### 2 · Entradas e inyección

#### Nunca confíes completamente en los datos que llegan

Supongamos:

```javascript
const username = req.query.username;
```

El usuario controla ese valor. Puede enviar `Marc`, pero también cualquier otra cosa.

Por tanto, cualquier entrada externa debe considerarse potencialmente no confiable. Puede llegar desde formularios, la URL, cookies, una API, un fichero, las cabeceras u otra aplicación.

#### Inyección

Observad:

```javascript
const query =
    "SELECT * FROM users WHERE username = '" +
    username +
    "'";
```

Parece funcionar. Pero estamos construyendo una consulta mezclando código SQL con entrada del usuario, lo que puede permitir una vulnerabilidad de:

<p class="term">SQL Injection</p>

#### La solución general

No debemos construir consultas concatenando directamente datos externos. Utilizamos consultas parametrizadas, *prepared statements* o un ORM correctamente utilizado.

<div class="compare-pair">
  <div>
    <p class="compare-label">Mal</p>
    <p class="compare-body">SQL y datos mezclados en la misma cadena.</p>
  </div>
  <div>
    <p class="compare-label">Bien</p>
    <p class="compare-body">El SQL define la estructura; los datos viajan aparte como valores.</p>
  </div>
</div>

#### Otro tipo de inyección: XSS

Imaginad que un usuario escribe un comentario y lo mostramos en nuestra web. Si en lugar de texto introduce contenido que el navegador interpreta como código, y lo insertamos sin las protecciones adecuadas, podemos provocar:

<p class="term">Cross-Site Scripting — XSS</p>

La idea importante vuelve a ser la misma: **los datos externos no son automáticamente seguros**.

Los frameworks modernos proporcionan muchas protecciones. No debemos desactivarlas sin entender las consecuencias.

---

### 3 · Contraseñas y secretos

#### Las contraseñas

Observad esta tabla:

| usuario | password  |
| ------- | --------- |
| ana     | patata123 |
| pepe    | qwerty    |

¿Está bien almacenar contraseñas así?

<p class="term">No</p>

Una contraseña no debería almacenarse en texto plano.

#### Hash de contraseñas

Normalmente almacenamos un resultado derivado mediante una función apropiada para contraseñas.

<figure class="diagram">
  <figcaption>Al registrarse</figcaption>
  <ol class="flow">
    <li>Contraseña</li>
    <li>Función de hash para passwords</li>
    <li>Guardamos el resultado, no la contraseña</li>
  </ol>
</figure>

<figure class="diagram">
  <figcaption>Al iniciar sesión</figcaption>
  <ol class="flow">
    <li>Password introducido</li>
    <li>Verificación</li>
    <li>¿Coincide?</li>
  </ol>
</figure>

Para passwords se utilizan algoritmos específicamente diseñados para ello: Argon2, bcrypt, scrypt o PBKDF2. No inventamos nuestro propio sistema criptográfico.

#### ¿Cifrar y hacer hash es lo mismo?

No.

<div class="compare-pair">
  <div>
    <p class="compare-label">Cifrado</p>
    <p class="compare-body">Queremos poder recuperar la información original utilizando una clave.</p>
  </div>
  <div>
    <p class="compare-label">Hash de contraseña</p>
    <p class="compare-body">No necesitamos recuperar la contraseña, solo comprobar después si la introducida es correcta.</p>
  </div>
</div>

#### Secretos

Nunca deberíamos encontrar esto en el repositorio:

```javascript
const API_KEY = "sk-123456789";
const DB_PASSWORD = "admin123";
```

Mucho menos si después hacemos `git push` a GitHub.

Una posibilidad habitual para guardarlos son:

<p class="term">variables de entorno</p>

Por ejemplo `DB_PASSWORD`, `API_KEY` o `JWT_SECRET`. La aplicación obtiene el valor del entorno y el secreto no queda almacenado en el código.

#### Y cuidado con `.env`

Un fichero `.env` puede contener secretos, por lo que normalmente debe aparecer en `.gitignore`.

El error clásico es este:

<figure class="diagram">
  <figcaption>Cómo un secreto acaba en el historial</figcaption>
  <ol class="flow flow--before">
    <li>Crear <code>.env</code></li>
    <li>Poner la contraseña</li>
    <li><code>git add .</code></li>
    <li><code>git push</code></li>
  </ol>
</figure>

El secreto puede quedar en el historial del repositorio aunque después lo borréis del código.

---

### 4 · Dependencias y configuración

#### El problema de las dependencias

Nuestro programa puede tener 500 líneas propias y depender de 50.000 o 500.000 líneas escritas por terceros:

```json
"dependencies": {
    "express": "...",
    "axios": "...",
    "jsonwebtoken": "..."
}
```

Cada dependencia añade código, mantenimiento, posibles vulnerabilidades y riesgo de cadena de suministro.

#### Cadena de suministro de software

Nuestra aplicación no está formada únicamente por nuestro código:

<figure class="diagram">
  <figcaption>Todo lo que acaba dentro de nuestra aplicación</figcaption>
  <ol class="flow">
    <li>Nuestro código</li>
    <li>Librerías</li>
    <li>Dependencias</li>
    <li>Paquetes</li>
    <li>Registros</li>
    <li>Herramientas de build</li>
  </ol>
</figure>

Si cualquiera de estas piezas está comprometida, nuestro software también puede estarlo. Por eso debemos evitar dependencias innecesarias, mantenerlas actualizadas, revisar alertas, utilizar fuentes conocidas y entender qué instalamos.

Herramientas como Dependabot pueden avisarnos de dependencias vulnerables, versiones antiguas y actualizaciones disponibles. La seguridad no depende solo de revisar código a mano: también podemos usar **automatización**.

#### Configuración insegura

Una aplicación puede tener código correcto y estar mal configurada. Por ejemplo:

* `DEBUG=true` en producción;
* `CORS: *` sin necesidad;
* un usuario `admin` con la contraseña por defecto;
* una base de datos accesible públicamente;
* puertos abiertos innecesariamente.

Recordad lo aprendido en Azure:

<figure class="diagram">
  <figcaption>La seguridad está presente en todas las capas</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Internet</li>
    <li>Firewall</li>
    <li>Servidor</li>
    <li>Aplicación</li>
  </ol>
</figure>

---

### 5 · Errores y logs

#### Los errores también pueden revelar información

Imaginad que nuestra aplicación responde esto a un usuario cualquiera:

```text
Error SQL: password authentication failed for user postgres
Database: 10.0.0.12
Path: /home/app/backend/database.js
```

Acabamos de regalar el motor de base de datos, una dirección interna y la estructura del proyecto. Un usuario debería recibir algo parecido a «Se ha producido un error», y los detalles quedar registrados internamente.

#### Logging

Ocultar los errores al usuario no significa no registrarlos. Necesitamos saber qué ocurrió, cuándo, dónde y qué usuario estaba implicado.

<div class="compare-pair">
  <div>
    <p class="compare-label">Usuario</p>
    <p class="compare-body">Un mensaje sencillo, sin detalles internos.</p>
  </div>
  <div>
    <p class="compare-label">Servidor</p>
    <p class="compare-body">Un log con la información técnica necesaria para investigar.</p>
  </div>
</div>

Pero tampoco debemos guardar alegremente contraseñas, tokens, números de tarjeta o secretos.

#### HTTPS

Ya lo utilizamos en Azure. `HTTP` no proporciona por sí mismo protección TLS; con `HTTPS` obtenemos confidencialidad, integridad y autenticación del servidor mediante certificado.

Pero HTTPS no convierte automáticamente una aplicación insegura en segura: una web con SQL Injection sigue siendo vulnerable aunque utilice HTTPS.

---

### Lo que quiero que detectéis

Para un desarrollador junior, esta es la lista que debe dispararse sola al leer código ajeno:

| Área | La pregunta que debéis haceros |
| ---- | ------------------------------ |
| Control de acceso | ¿Puede un usuario acceder a datos ajenos? |
| Autenticación | ¿Se gestionan correctamente las cuentas? |
| Entradas | ¿Se validan? |
| Inyección | ¿Mezclamos datos con código? |
| Secretos | ¿Hay tokens o passwords en el código? |
| Contraseñas | ¿Se almacenan correctamente? |
| Dependencias | ¿Son necesarias y están mantenidas? |
| Configuración | ¿Exponemos más de lo necesario? |
| Errores y logs | ¿Mostramos o guardamos información sensible? |

Si salís de esta unidad detectando estas cosas, ya habremos conseguido bastante.

<details class="aside aside--extra">
  <summary>Ampliación · OWASP y el Top 10</summary>
  <p>Existe una organización llamada <strong>OWASP</strong> (Open Worldwide Application Security Project) que publica recursos abiertos para mejorar la seguridad de las aplicaciones. El más conocido es el <strong>OWASP Top 10</strong>, una lista de categorías de riesgo especialmente importantes en aplicaciones web.</p>
  <p>La edición 2025 incluye:</p>
  <ol>
    <li>Broken Access Control.</li>
    <li>Security Misconfiguration.</li>
    <li>Software Supply Chain Failures.</li>
    <li>Cryptographic Failures.</li>
    <li>Injection.</li>
    <li>Insecure Design.</li>
    <li>Authentication Failures.</li>
    <li>Software or Data Integrity Failures.</li>
    <li>Security Logging and Alerting Failures.</li>
    <li>Mishandling of Exceptional Conditions.</li>
  </ol>
  <p>No hay que memorizar el orden. Lo importante es entender qué tipos de errores debemos aprender a reconocer.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Sabes nombrar las cinco familias de errores sin mirar la página.</li>
    <li>Puedes explicar con tus palabras qué es una inyección.</li>
    <li>Distingues autenticación de autorización con un ejemplo propio.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué no basta con estar autenticado para acceder a <code>/api/users/16</code>?</li>
    <li>¿Cifrar una contraseña y hacerle hash es lo mismo?</li>
    <li>Tu web usa HTTPS y concatena SQL. ¿Es segura?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque la autenticación solo dice quién eres. Falta comprobar si ese quién tiene permiso sobre ese recurso concreto.</p>
  <p>2 · No. El cifrado es reversible con una clave; el hash de contraseña no pretende recuperar el original, solo verificarlo.</p>
  <p>3 · No. HTTPS protege el transporte, no la aplicación. La inyección sigue estando ahí.</p>
</details>

---

## Sesión 3 · Primero tu criterio, después la IA

### La IA como ayudante de revisión

Podemos pedir a Copilot que revise el proyecto buscando vulnerabilidades, y nos ayudará muchísimo: detecta SQL Injection, secretos, malas validaciones, problemas de autenticación, dependencias y código inseguro.

Pero hay un problema.

<p class="term">Copilot también puede equivocarse</p>

Puede no detectar un fallo, generar un falso positivo, recomendar una solución innecesaria o introducir otra vulnerabilidad al intentar arreglarla.

Por tanto:

> **La IA es nuestro ayudante de revisión, no nuestro responsable de seguridad.**

### Cómo pedir una revisión de seguridad

Evitemos la pregunta abierta:

> ¿Es seguro mi código?

Porque la respuesta puede ser «Sí, parece razonablemente seguro», y eso no aporta nada.

<div class="prompt">
  <p class="prompt-label">Prompt estructurado</p>
  <p class="flow-role">Tarea</p>
  <p>Realiza una revisión de seguridad de este proyecto. No modifiques ningún archivo todavía.</p>
  <p class="flow-role">Alcance</p>
  <p>Revisa especialmente control de acceso, autenticación, validación de entradas, inyección, gestión de secretos, passwords, dependencias, configuración, y errores y logging.</p>
  <p class="flow-role">Formato de salida</p>
  <ol>
    <li>Archivo y línea.</li>
    <li>Descripción del problema.</li>
    <li>Posible consecuencia.</li>
    <li>Severidad.</li>
    <li>Propuesta de solución.</li>
  </ol>
  <p class="flow-role">Restricción</p>
  <p>Si no tienes evidencia suficiente para afirmar que algo es vulnerable, indícalo en lugar de suponerlo.</p>
</div>

Eso produce una revisión mucho más útil.

### Convertirlo en una Skill

Recordad la unidad anterior. Podemos guardar este procedimiento para no volver a escribirlo:

```text
.github/
└── skills/
    └── security-review/
        └── SKILL.md
```

```markdown
---
name: security-review
description: Review a web application for common security problems.
---

# Security review

Review:

1. Access control
2. Authentication
3. Input validation
4. Injection
5. Secrets
6. Password storage
7. Dependencies
8. Configuration
9. Error handling and logs

For every finding return:

- Finding
- Severity
- File
- Evidence
- Possible impact
- Recommended fix

Do not modify code.

Do not report a vulnerability without explaining the evidence.
```

Ahora tenemos un procedimiento reutilizable.

---

### La actividad · ¿Publicarías esta aplicación?

El profesor proporcionará un pequeño proyecto web. La aplicación funciona, pero contiene varios problemas de seguridad introducidos deliberadamente.

Vuestra misión será **decidir si está preparada para producción**.

La regla de la actividad es importante: no empezaremos preguntando «Copilot, encuentra todos los errores». Primero haremos nosotros una inspección, porque necesitamos desarrollar

<p class="term">criterio propio</p>

y después compararemos nuestro análisis con el de la IA.

### Fase 1 · Identificar qué debemos proteger

Antes de revisar código, completad los activos: ¿qué información o recursos importantes contiene la aplicación? Por ejemplo, usuarios, contraseñas, pedidos o datos personales.

<p class="write-line"></p>
<p class="write-line"></p>
<p class="write-line"></p>

Después, los tipos de usuario que existen —anónimo, usuario, administrador— e indicad qué debería poder hacer cada uno.

| Acción             | Anónimo | Usuario | Admin |
| ------------------ | ------: | ------: | ----: |
| Ver productos      |         |         |       |
| Ver su perfil      |         |         |       |
| Ver otros perfiles |         |         |       |
| Borrar usuarios    |         |         |       |
|                    |         |         |       |

Esta tabla será importante para encontrar problemas de autorización.

### Fase 2 · Revisión humana rápida

Buscad en el proyecto, en este orden, y anotad cualquier cosa que os parezca sospechosa:

* secretos;
* contraseñas;
* consultas SQL;
* endpoints protegidos;
* entradas del usuario;
* gestión de errores;
* configuración;
* dependencias.

No hace falta encontrarlo todo.

<details class="aside aside--help">
  <summary>Estoy atascado · no encuentro nada sospechoso</summary>
  <p>Probad en este orden, que es donde suelen aparecer los problemas:</p>
  <ol>
    <li>Buscad en todo el proyecto las cadenas <code>password</code>, <code>secret</code>, <code>token</code> y <code>key</code>.</li>
    <li>Abrid el fichero de configuración y el de conexión a la base de datos.</li>
    <li>Buscad <code>SELECT</code> y mirad si la consulta se construye concatenando o con plantillas.</li>
    <li>Listad las rutas de la API y preguntad, una a una, quién puede llamarlas.</li>
    <li>Coged una ruta con <code>:id</code> y probad a cambiar el id por el de otro usuario.</li>
    <li>Mirad si <code>.env</code> aparece en <code>.gitignore</code>… y si aparece en el historial de Git.</li>
  </ol>
</details>

### Fase 3 · Revisión con Copilot

Ahora utilizad vuestra skill `security-review` o el prompt anterior. Pedid al agente que revise el proyecto, pero **no le permitáis todavía modificar archivos**.

Generad una tabla con los hallazgos:

| Problema | Severidad | Archivo | Evidencia |
| -------- | --------- | ------- | --------- |
|          |           |         |           |

### Comparar humano contra IA

Clasificad los hallazgos en cuatro grupos:

| Grupo | Hallazgos |
| ----- | --------- |
| Detectado por vosotros y por la IA | |
| Solo detectado por vosotros | |
| Solo detectado por la IA | |
| Posible falso positivo de la IA | |

Esta comparación es parte de la actividad, y de la nota.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 3</p>
  <ul class="checklist">
    <li>Tienes la lista de activos y la tabla de permisos por tipo de usuario.</li>
    <li>Tienes tu propia lista de sospechas, escrita antes de preguntar a la IA.</li>
    <li>Tienes la tabla de hallazgos de Copilot, sin haber modificado ningún archivo.</li>
    <li>Tienes los cuatro grupos de la comparación rellenados.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué revisamos nosotros antes de preguntar a la IA?</li>
    <li>¿Qué es un falso positivo y por qué es peligroso aceptarlo?</li>
    <li>¿Qué debe darte la IA por cada hallazgo, además del nombre del problema?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para desarrollar criterio propio. Si empezamos por la IA, solo aprendemos a leer su respuesta, no a detectar problemas.</p>
  <p>2 · Un problema que la IA afirma y no existe. Es peligroso porque nos hace tocar código correcto, y cada cambio innecesario puede romper algo o introducir un fallo nuevo.</p>
  <p>3 · Archivo y línea, evidencia, consecuencia posible, severidad y propuesta de solución.</p>
</details>

---

## Sesión 4 · Corregir, verificar y entregar

### Fase 4 · Investigar cada problema

No aceptéis automáticamente que algo es vulnerable. Para cada hallazgo importante preguntad:

* ¿Dónde está exactamente el problema?
* ¿Qué entrada controla el usuario?
* ¿Qué permiso falta?
* ¿Qué información podría quedar expuesta?
* ¿Qué debería hacer el código?

La explicación debe poder entenderse sin volver a preguntar a Copilot.

### Fase 5 · Corregir

Elegid al menos:

<p class="term">cuatro problemas</p>

Pedid a Copilot que proponga una corrección, pero seguid este procedimiento:

<figure class="diagram">
  <figcaption>Cómo corregir</figcaption>
  <ol class="flow">
    <li>Problema</li>
    <li>Explicar</li>
    <li>Proponer solución</li>
    <li>Revisar</li>
    <li>Modificar</li>
    <li>Test</li>
    <li>Revisar diff</li>
  </ol>
</figure>

Y no este otro:

<figure class="diagram">
  <figcaption>Cómo no corregir</figcaption>
  <ol class="flow flow--before">
    <li>«Arregla todo»</li>
    <li>Accept all</li>
  </ol>
</figure>

Los tres ejemplos que vienen ahora van de más a menos apoyo: el primero lo resolvemos nosotros entero, el segundo lo hacéis con guion, y el tercero es vuestro.

<p class="stage">Paso 1 · Te enseño uno</p>

#### Ejemplo · secreto en código

Encontramos:

```javascript
const JWT_SECRET = "supersecreto123";
```

No basta con escribir «hay una vulnerabilidad». Debemos explicar las tres cosas:

* **Problema:** el secreto está almacenado en el código fuente.
* **Riesgo:** puede acabar en GitHub, en copias del proyecto, en logs o en los equipos de otros desarrolladores.
* **Solución:** moverlo a una variable de entorno y asegurarnos de que no aparece en Git.

<p class="stage stage--guided">Paso 2 · Lo hacemos juntos</p>

#### Ejemplo · autorización

Tenemos la ruta `GET /users/:id` y cualquier usuario autenticado puede cambiar `/users/15` por `/users/16`.

La pregunta no es qué línea tocar, sino qué comprobación falta:

<figure class="diagram">
  <figcaption>La comprobación que hay que añadir</figcaption>
  <ol class="flow">
    <li>Usuario autenticado</li>
    <li>Solicita recurso</li>
    <li>¿Es propietario, o tiene permiso?</li>
    <li>Respuesta</li>
  </ol>
</figure>

<p class="stage stage--solo">Paso 3 · Hazlo tú</p>

#### Ejemplo · SQL Injection

Si encontráis algo parecido a:

```javascript
db.query(
    "SELECT * FROM users WHERE name = '" +
    name +
    "'"
);
```

escribid vosotros las tres partes, antes de preguntar nada a Copilot:

<dl class="answer">
  <dt>Problema</dt>
  <dd></dd>
  <dt>Riesgo</dt>
  <dd></dd>
  <dt>Solución</dt>
  <dd></dd>
</dl>

Y escribid vosotros la petición que le haríais al agente. Después comprobad dos cosas en su respuesta: que separa código y datos, y que mantiene la funcionalidad.

<details class="aside aside--help">
  <summary>Estoy atascado · no sé cómo pedirlo</summary>
  <p>Una petición que funciona bien aquí:</p>
  <blockquote><p>Explica exactamente por qué esta construcción es peligrosa y reescríbela utilizando consultas parametrizadas.</p></blockquote>
  <p>Fijaos en lo que pide: primero la explicación, después el cambio. Si pedís solo el cambio, os quedáis sin la parte que se evalúa.</p>
</details>

### Fase 6 · Dependencias

Pedid a Copilot que identifique las dependencias principales del proyecto y explique brevemente qué función cumple cada una. Después preguntad si alguna parece innecesaria.

También podéis utilizar las herramientas del gestor de paquetes cuando proceda:

```bash
npm audit
```

Comparad las tres fuentes: herramienta automática, IA y revisión humana.

### Fase 7 · Errores

Provocad deliberadamente un error: un recurso inexistente, un dato incorrecto o una operación inválida. Observad qué recibe el usuario y qué aparece en los logs, y preguntad:

> ¿Estamos revelando información que el usuario no necesita?

### Fase 8 · Revisar el diff

Antes de considerar terminada la auditoría:

```bash
git diff
```

Revisad todos los cambios y preguntad:

* ¿La solución de seguridad ha roto alguna funcionalidad?
* ¿Se ha añadido alguna dependencia?
* ¿Copilot ha modificado código que no debía?
* ¿Los cambios son realmente necesarios?

<details class="aside aside--help">
  <summary>Estoy atascado · he corregido y ahora algo no funciona</summary>
  <ol>
    <li>Mirad primero el diff: el fallo casi siempre está en un cambio que no pedisteis.</li>
    <li>Si la corrección tocó varios ficheros a la vez, deshacedla y aplicadla de uno en uno.</li>
    <li>Si falla el login, comprobad que el hash se aplica también al comparar, no solo al registrar.</li>
    <li>Si falla una consulta parametrizada, revisad el orden de los parámetros y que no queden comillas de la versión anterior.</li>
    <li>Si la aplicación no arranca, comprobad que la variable de entorno que sustituye al secreto existe realmente en vuestro entorno.</li>
  </ol>
</details>

### ¿Está ya segura?

No podemos afirmar «esta aplicación es 100 % segura». La seguridad absoluta no existe.

Podemos afirmar algo más riguroso:

> Hemos revisado determinados riesgos y corregido los problemas encontrados dentro del alcance de nuestra auditoría.

Esa diferencia es importante, y se evalúa.

---

### Producto final

Entregaréis dos cosas: el **repositorio corregido**, con los cambios realizados, y un **informe de seguridad** de tres páginas como máximo. Nada de una memoria de veinte páginas.

#### Página 1 · Riesgos encontrados

| Hallazgo | Severidad | Evidencia | Categoría |
| -------- | --------- | --------- | --------- |
| Secret hardcoded | Alta | `config.js` | Gestión de secretos |

#### Página 2 · Correcciones

Para cada problema importante:

<figure class="diagram">
  <figcaption>Qué contar de cada corrección</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Antes</li>
    <li>Problema</li>
    <li>Solución</li>
    <li>Cómo lo hemos verificado</li>
  </ol>
</figure>

#### Página 3 · La IA como revisor

Debéis incluir un problema que la IA haya detectado correctamente, uno que vosotros detectarais antes que ella, una recomendación suya que hayáis rechazado o modificado, y una limitación que todavía tenga vuestra auditoría.

#### Y la pregunta final

> Si mañana tuvierais que publicar esta aplicación para usuarios reales, ¿la publicaríais?

Solo hay tres respuestas posibles —**sí**, **sí, pero...** y **no**— y las tres pueden ser correctas. Lo que se evalúa es la justificación técnica.

---

### Evaluación

| Criterio                                            | Puntos |
| --------------------------------------------------- | -----: |
| Identificación y comprensión de activos y permisos  |      1 |
| Detección de vulnerabilidades                       |      2 |
| **Comprensión de por qué son vulnerabilidades**     |  **2** |
| Calidad de las correcciones                         |      2 |
| Uso crítico de IA durante la auditoría              |    1,5 |
| Verificación de los cambios                         |      1 |
| Claridad del informe                                |    0,5 |

No obtiene mejor nota quien encuentra treinta supuestas vulnerabilidades generadas por Copilot, porque muchas pueden ser falsas. Lo que se evalúa es la cadena completa:

<figure class="diagram">
  <figcaption>Lo que sí puntúa</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Problema real</li>
    <li>Evidencia</li>
    <li>Riesgo</li>
    <li>Corrección</li>
    <li>Verificación</li>
  </ol>
</figure>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · entrega</p>
  <ul class="checklist">
    <li>Repositorio con al menos cuatro problemas corregidos y verificados.</li>
    <li>Informe de tres páginas con la tabla de hallazgos.</li>
    <li>Página 3 completa, incluyendo la recomendación de la IA que rechazasteis.</li>
    <li>Respuesta razonada a «¿la publicarías?».</li>
  </ul>
</div>

---

## Lo que debes recordar

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Activo | Lo que hay que proteger |
| Autenticación | Quién eres |
| Autorización | Qué puedes hacer |
| Mínimo privilegio | Solo los permisos necesarios |
| Inyección | Mezclar datos del usuario con código |
| Hash de password | Verificar sin poder recuperar |
| Secreto | Credencial que nunca va en el repositorio |
| Cadena de suministro | Todo el código de terceros que acaba dentro |
| Falso positivo | Un fallo que la IA cree ver y no existe |
| Evidencia | El archivo y la línea que demuestran el problema |

### La alarma mental

No necesitáis memorizar todas las vulnerabilidades existentes. Necesitáis que salte una alarma cuando veáis:

* una credencial en el código;
* SQL concatenado;
* un permiso no comprobado;
* una password en texto plano;
* una entrada no validada;
* una dependencia extraña;
* debug activado en producción;
* un puerto innecesario;
* un error con información interna;
* código de IA aceptado sin revisar.

La pregunta que debería aparecer automáticamente es:

> **¿Qué podría salir mal aquí?**

### El flujo profesional

<figure class="diagram">
  <figcaption>El ciclo completo que queremos aprender</figcaption>
  <ol class="flow">
    <li>Desarrollar</li>
    <li>Revisar</li>
    <li>Pensar en abusos</li>
    <li>Analizar con IA</li>
    <li>Comprobar hallazgos</li>
    <li>Corregir</li>
    <li>Testear</li>
    <li>Revisar diff</li>
    <li>Desplegar</li>
  </ol>
</figure>

La IA puede acelerar muchas partes del proceso. Pero **la responsabilidad sobre el código que llega a producción sigue siendo del desarrollador**.

<details class="aside aside--extra">
  <summary>Checklist que podéis reutilizar trabajando</summary>
  <p><strong>Acceso.</strong> ¿Quién puede ejecutar esto? ¿Compruebo permisos en el servidor?</p>
  <p><strong>Entrada.</strong> ¿Qué datos controla el usuario? ¿Los valido?</p>
  <p><strong>Base de datos.</strong> ¿Utilizo consultas parametrizadas?</p>
  <p><strong>Contraseñas.</strong> ¿Se almacenan mediante mecanismos apropiados?</p>
  <p><strong>Secretos.</strong> ¿Hay tokens o passwords en el repositorio?</p>
  <p><strong>Dependencias.</strong> ¿Necesito realmente todas? ¿Presentan vulnerabilidades conocidas?</p>
  <p><strong>Configuración.</strong> ¿Tengo debug activado? ¿Expongo puertos o servicios innecesarios?</p>
  <p><strong>Errores.</strong> ¿Estoy mostrando información interna?</p>
  <p><strong>Logs.</strong> ¿Puedo saber qué ha ocurrido? ¿Estoy registrando información sensible?</p>
  <p><strong>HTTPS.</strong> ¿Las comunicaciones deben utilizar TLS?</p>
  <p><strong>IA.</strong> ¿He revisado el código que ha generado?</p>
</details>

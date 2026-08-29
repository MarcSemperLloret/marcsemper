---
title: "Ciberseguridad para desarrolladores"
label: "UD6 · Proyecto"
section: "ud-06"
order: 6
lang: "es"
summary: "¿Publicarías esta aplicación? Aprende a detectar, explicar y corregir vulnerabilidades comunes con criterio propio y con la IA como apoyo de revisión."
duration: "4 horas"
modality: "Individual o parejas"
deliverable: "Auditoría de seguridad y corrección de una pequeña aplicación web."
date: "2026-08-29"
---

<p><strong>Herramientas:</strong> Visual Studio Code, GitHub Copilot y Git.</p>

## 1. El reto

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

No necesariamente.

Un programa puede:

```text
COMPILAR
   ↓
FUNCIONAR
   ↓
PASAR TESTS
```

y aun así ser:

```text
INSEGURO
```

En esta actividad aprenderemos a detectar algunos de los errores de seguridad que un desarrollador debería reconocer antes de publicar una aplicación.

---

## 2. La seguridad no se añade al final

Un enfoque incorrecto sería:

```text
Diseñar
  ↓
Programar
  ↓
Publicar
  ↓
Añadir seguridad
```

La seguridad debería formar parte del desarrollo:

```text
DISEÑO
  ↓
DESARROLLO
  ↓
TESTING
  ↓
DESPLIEGUE
  ↓
MANTENIMIENTO
       ↑
       │
   SEGURIDAD
 durante todo
 el proceso
```

Esta idea suele denominarse:

<p class="term">Secure by Design</p>

La aplicación debe diseñarse pensando desde el principio:

> ¿Qué podría salir mal?

---

## 3. Pensar como desarrollador... y un poco como atacante

Cuando programamos solemos pensar:

> ¿Cómo conseguirá el usuario hacer lo que queremos?

Por ejemplo:

```text
Usuario
  ↓
introduce contraseña
  ↓
login
  ↓
accede a su perfil
```

Pero también debemos preguntarnos:

> ¿Qué ocurre si intenta hacer algo que NO queremos?

Por ejemplo:

```text
Usuario
  ↓
cambia /users/15
por
/users/16
  ↓
¿puede ver otro usuario?
```

Esta segunda forma de pensar es fundamental para desarrollar software seguro.

---

## 4. Tres preguntas básicas

Cuando desarrolléis una funcionalidad preguntad:

### ¿Qué quiero proteger?

Por ejemplo:

* contraseñas;
* datos personales;
* pedidos;
* cuentas;
* archivos;
* dinero.

Esto se denomina:

<p class="term">Activo</p>

---

### ¿Quién puede intentar acceder?

Por ejemplo:

* usuario normal;
* administrador;
* usuario no autenticado;
* servicio externo.

---

### ¿Qué podría intentar hacer?

Por ejemplo:

* ver información ajena;
* modificar datos;
* hacerse administrador;
* ejecutar código;
* obtener contraseñas.

No necesitamos realizar un análisis de amenazas complejo.

Con estas tres preguntas ya podemos detectar muchos problemas.

---

## 5. Autenticación y autorización no son lo mismo

Esta diferencia es extremadamente importante.

### Autenticación

Responde:

> **¿Quién eres?**

Por ejemplo:

```text
email + contraseña
       ↓
usuario Marc
```

---

### Autorización

Responde:

> **¿Qué tienes permiso para hacer?**

Por ejemplo:

```text
Marc
 ↓
¿puede ver /admin?
 ↓
NO
```

Podemos estar perfectamente autenticados y:

> no estar autorizados para realizar una determinada acción.

---

## 6. Un error muy frecuente

Tenemos:

```text
GET /api/users/15
```

El usuario 15 consulta sus datos.

Ahora modifica la URL:

```text
GET /api/users/16
```

La aplicación responde con los datos del usuario 16.

El login funciona perfectamente.

Pero existe un grave problema de:

<p class="term">control de acceso.</p>

La aplicación debería comprobar:

```text
¿QUIÉN solicita el recurso?
        ↓
¿TIENE permiso?
        ↓
       SÍ
        ↓
entregar información
```

No basta con que exista una sesión válida.

---

## 7. Principio de mínimo privilegio

Un usuario o aplicación debería tener:

> **solo los permisos que necesita para realizar su trabajo.**

Por ejemplo:

Un usuario normal:

```text
leer sus pedidos       ✓
modificar su perfil    ✓
borrar otros usuarios  ✗
gestionar administradores ✗
```

Una base de datos utilizada únicamente para leer informes quizá no necesita permisos para:

```text
DROP TABLE
```

Menos permisos significa:

> menos daño posible si algo sale mal.

---

## 8. Nunca confíes completamente en los datos que llegan

Supongamos:

```javascript
const username = req.query.username;
```

El usuario controla ese valor.

Puede enviar:

```text
Marc
```

pero también cualquier otra cosa.

Por tanto:

> cualquier entrada externa debe considerarse potencialmente no confiable.

Puede llegar desde:

* formularios;
* URL;
* cookies;
* API;
* fichero;
* cabeceras;
* otra aplicación.

---

## 9. Inyección

Observad:

```javascript
const query =
    "SELECT * FROM users WHERE username = '" +
    username +
    "'";
```

Parece funcionar.

Pero estamos construyendo una consulta mezclando:

```text
CÓDIGO SQL
    +
ENTRADA DEL USUARIO
```

Esto puede permitir una vulnerabilidad de:

<p class="term">SQL Injection</p>

---

## 10. Solución general

No debemos construir consultas concatenando directamente datos externos.

Utilizamos:

* consultas parametrizadas;
* prepared statements;
* ORM correctamente utilizado.

Conceptualmente:

```text
SQL
↓
estructura de la consulta

DATOS
↓
valores separados
```

En lugar de:

```text
SQL + datos mezclados
```

---

## 11. Otro tipo de inyección: XSS

Imaginad que un usuario escribe un comentario.

```text
Muy buen producto
```

y lo mostramos en nuestra web.

Pero introduce contenido interpretado como código por el navegador.

Si lo insertamos sin las protecciones adecuadas podemos provocar:

<p class="term">Cross-Site Scripting — XSS</p>

La idea importante vuelve a ser:

> **los datos externos no son automáticamente seguros.**

Los frameworks modernos proporcionan muchas protecciones.

No debemos desactivarlas sin entender las consecuencias.

---

## 12. Las contraseñas

Observad:

```text
usuario        password
-------------------------
ana            patata123
pepe           qwerty
```

¿Está bien almacenar contraseñas así?

<p class="term">NO.</p>

Una contraseña no debería almacenarse en texto plano.

---

## 13. Hash de contraseñas

Normalmente almacenamos un resultado derivado mediante una función apropiada para contraseñas.

Conceptualmente:

```text
contraseña
    ↓
función de hash para passwords
    ↓
resultado
```

Guardamos:

```text
resultado
```

y no:

```text
contraseña original
```

Al iniciar sesión:

```text
password introducido
       ↓
verificación
       ↓
¿coincide?
```

Para passwords se utilizan algoritmos específicamente diseñados para ello, como:

* Argon2;
* bcrypt;
* scrypt;
* PBKDF2.

No inventamos nuestro propio sistema criptográfico.

---

## 14. ¿Cifrar y hacer hash es lo mismo?

No.

### Cifrado

Queremos poder recuperar la información original utilizando una clave.

```text
texto
 ↓
cifrado
 ↓
texto cifrado
 ↓
clave
 ↓
texto original
```

### Hash de contraseña

No necesitamos recuperar la contraseña original.

Necesitamos comprobar posteriormente:

> si la contraseña introducida es correcta.

---

## 15. Secretos

Nunca deberíamos encontrar esto en el repositorio:

```javascript
const API_KEY = "sk-123456789";
```

o:

```javascript
const DB_PASSWORD = "admin123";
```

Mucho menos si posteriormente hacemos:

```text
git push
```

a GitHub.

---

## 16. ¿Dónde guardamos secretos?

Una posibilidad habitual son:

<p class="term">variables de entorno.</p>

Por ejemplo:

```text
DB_PASSWORD
API_KEY
JWT_SECRET
```

La aplicación obtiene el valor del entorno.

El secreto no debe quedar almacenado directamente en el código.

---

## 17. Y cuidado con `.env`

Un fichero:

```text
.env
```

puede contener secretos.

Por eso normalmente debe aparecer en:

```text
.gitignore
```

Un error clásico:

```text
crear .env
   ↓
poner contraseña
   ↓
git add .
   ↓
git push
```

El secreto puede acabar en el historial del repositorio.

---

## 18. El problema de las dependencias

Nuestro programa puede tener:

```text
500 líneas de código propias
```

pero depender de:

```text
50.000 o 500.000 líneas
```

escritas por terceros.

Por ejemplo:

```json
"dependencies": {
    "express": "...",
    "axios": "...",
    "jsonwebtoken": "..."
}
```

Cada dependencia añade:

* código;
* mantenimiento;
* posibles vulnerabilidades;
* riesgo de cadena de suministro.

---

## 19. Cadena de suministro de software

Nuestra aplicación no está formada únicamente por nuestro código.

Tenemos:

```text
NUESTRO CÓDIGO
      ↓
LIBRERÍAS
      ↓
DEPENDENCIAS
      ↓
PAQUETES
      ↓
REGISTROS
      ↓
HERRAMIENTAS DE BUILD
```

Si cualquiera de estas piezas está comprometida:

> nuestro software también puede estarlo.

Por eso debemos:

* evitar dependencias innecesarias;
* mantenerlas actualizadas;
* revisar alertas;
* utilizar fuentes conocidas;
* entender qué instalamos.

---

## 20. GitHub también puede ayudarnos

Herramientas como Dependabot pueden avisar de:

* dependencias vulnerables;
* versiones antiguas;
* actualizaciones disponibles.

La seguridad no depende solamente de revisar manualmente código.

Podemos utilizar:

<p class="term">automatización.</p>

---

## 21. Configuración insegura

Una aplicación puede tener código correcto y estar mal configurada.

Ejemplos:

```text
DEBUG=true
```

en producción.

O:

```text
CORS: *
```

sin necesidad.

O:

```text
usuario admin con contraseña por defecto
```

O:

```text
base de datos accesible públicamente
```

O:

```text
puertos abiertos innecesariamente
```

Recordad lo aprendido en Azure:

```text
INTERNET
   ↓
FIREWALL
   ↓
SERVIDOR
   ↓
APLICACIÓN
```

La seguridad está presente en todas las capas.

---

## 22. Los errores también pueden revelar información

Imaginad que nuestra aplicación responde:

```text
Error SQL:
password authentication failed
for user postgres

Database:
10.0.0.12

Path:
/home/app/backend/database.js
```

Esto proporciona mucha información innecesaria.

Un usuario debería recibir algo parecido a:

```text
Se ha producido un error.
```

Mientras que los detalles pueden quedar registrados internamente.

---

## 23. Logging

Ocultar errores no significa no registrarlos.

Necesitamos saber:

* qué ocurrió;
* cuándo;
* dónde;
* qué usuario estaba implicado.

Por tanto:

```text
USUARIO
   ↓
mensaje sencillo
```

mientras:

```text
SERVIDOR
   ↓
LOG
   ↓
información técnica
```

Pero tampoco debemos guardar alegremente:

* contraseñas;
* tokens;
* números de tarjetas;
* secretos.

---

## 24. HTTPS

Ya lo utilizamos en Azure.

Recordad:

```text
HTTP
```

no proporciona por sí mismo protección TLS.

Con:

```text
HTTPS
```

obtenemos:

* confidencialidad;
* integridad;
* autenticación del servidor mediante certificado.

Pero:

> HTTPS no convierte automáticamente una aplicación insegura en segura.

Una web con SQL Injection sigue siendo vulnerable aunque utilice HTTPS.

---

## 25. OWASP

Existe una organización llamada:

<p class="term">OWASP</p>

Open Worldwide Application Security Project.

Publica recursos abiertos para mejorar la seguridad de aplicaciones.

Uno de los más conocidos es:

<p class="term">OWASP Top 10</p>

Una lista de categorías de riesgos especialmente importantes en aplicaciones web.

---

## 26. OWASP Top 10:2025

Actualmente incluye:

1. Broken Access Control.
2. Security Misconfiguration.
3. Software Supply Chain Failures.
4. Cryptographic Failures.
5. Injection.
6. Insecure Design.
7. Authentication Failures.
8. Software or Data Integrity Failures.
9. Security Logging and Alerting Failures.
10. Mishandling of Exceptional Conditions.

No necesitamos memorizar el orden.

Lo importante es entender:

> **qué tipos de errores debemos aprender a reconocer.**

---

## 27. Para un desarrollador junior, ¿qué quiero que detectéis?

Principalmente:

```text
CONTROL DE ACCESO
        │
        ├── ¿puede un usuario acceder a datos ajenos?
        │
AUTENTICACIÓN
        │
        ├── ¿se gestionan correctamente las cuentas?
        │
ENTRADAS
        │
        ├── ¿se validan?
        │
INYECCIÓN
        │
        ├── ¿mezclamos datos con código?
        │
SECRETOS
        │
        ├── ¿hay tokens/passwords en el código?
        │
CONTRASEÑAS
        │
        ├── ¿se almacenan correctamente?
        │
DEPENDENCIAS
        │
        ├── ¿son necesarias y están mantenidas?
        │
CONFIGURACIÓN
        │
        ├── ¿exponemos más de lo necesario?
        │
ERRORES Y LOGS
        │
        └── ¿mostramos/guardamos información sensible?
```

Si salís detectando estas cosas:

> ya habremos conseguido bastante.

---

## 28. Y ahora aparece la IA

Podemos pedir a Copilot:

> Revisa este proyecto buscando vulnerabilidades.

Puede ayudarnos muchísimo.

Puede detectar:

* SQL Injection;
* secretos;
* malas validaciones;
* problemas de autenticación;
* dependencias;
* código inseguro.

Pero hay un problema.

<p class="term">Copilot también puede equivocarse.</p>

Puede:

* no detectar un fallo;
* generar un falso positivo;
* recomendar una solución innecesaria;
* introducir otra vulnerabilidad al intentar arreglarla.

Por tanto:

> **la IA es nuestro ayudante de revisión, no nuestro responsable de seguridad.**

---

## 29. Una petición de seguridad demasiado mala

Evitemos:

> ¿Es seguro mi código?

Porque la respuesta puede ser:

> Sí, parece razonablemente seguro.

Eso aporta muy poco.

---

## 30. Una petición mejor

Podemos pedir:

> Realiza una revisión de seguridad de este proyecto.
>
> No modifiques ningún archivo todavía.
>
> Revisa especialmente:
>
> 1. control de acceso;
> 2. autenticación;
> 3. validación de entradas;
> 4. inyección;
> 5. gestión de secretos;
> 6. passwords;
> 7. dependencias;
> 8. configuración;
> 9. errores y logging.
>
> Para cada problema indica:
>
> * archivo y línea;
> * descripción;
> * posible consecuencia;
> * severidad;
> * propuesta de solución.
>
> Si no tienes evidencia suficiente, indícalo.

Eso produce una revisión mucho más útil.

---

## 31. Podemos convertir esto en una Skill

Recordad la unidad anterior.

Creamos:

```text
.github/
└── skills/
    └── security-review/
        └── SKILL.md
```

Nuestra skill puede definir cómo queremos realizar siempre una auditoría.

Por ejemplo:

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

## 32. ACTIVIDAD — ¿Publicarías esta aplicación?

El profesor proporcionará un pequeño proyecto web.

La aplicación funciona.

Pero contiene varios problemas de seguridad introducidos deliberadamente.

Vuestra misión será:

> **decidir si está preparada para producción.**

---

## 33. Regla de la actividad

No empezaremos preguntando:

> Copilot, encuentra todos los errores.

Primero realizaremos nosotros una inspección.

Porque necesitamos desarrollar:

<p class="term">criterio propio.</p>

Después compararemos nuestro análisis con el de la IA.

---

## 34. Fase 1 — Identificar qué debemos proteger

Antes de revisar código, completad:

### Activos

¿Qué información o recursos importantes contiene la aplicación?

Por ejemplo:

```text
usuarios
contraseñas
pedidos
datos personales
```

Vuestros activos:

1. ---

2. ---

3. ---

---

## 35. Identificar usuarios

¿Qué tipos de usuario existen?

Por ejemplo:

```text
ANÓNIMO
USUARIO
ADMINISTRADOR
```

Indicad qué debería poder hacer cada uno.

| Acción             | Anónimo | Usuario | Admin |
| ------------------ | ------: | ------: | ----: |
| Ver productos      |         |         |       |
| Ver su perfil      |         |         |       |
| Ver otros perfiles |         |         |       |
| Borrar usuarios    |         |         |       |
|                    |         |         |       |

Esto será importante para encontrar problemas de autorización.

---

## 36. Fase 2 — Revisión humana rápida

Buscad en el proyecto:

#### Secretos.

#### Contraseñas.

#### Consultas SQL.

#### Endpoints protegidos.

#### Entradas del usuario.

#### Gestión de errores.

#### Configuración.

#### Dependencias.

Anotad cualquier cosa que os parezca sospechosa.

No hace falta encontrarlo todo.

---

## 37. Fase 3 — Revisión con Copilot

Ahora utilizad vuestra:

```text
security-review skill
```

o el prompt proporcionado.

Pedid al agente que revise el proyecto.

No permitáis todavía que modifique archivos.

Generad una tabla:

| Problema | Severidad | Archivo | Evidencia |
| -------- | --------- | ------- | --------- |
|          |           |         |           |

---

## 38. Comparar humano vs IA

Clasificad los hallazgos:

### Detectado por vosotros y por IA

---

### Solo detectado por vosotros

---

### Solo detectado por IA

---

### Posible falso positivo de IA

---

Esta comparación es parte de la actividad.

---

## 39. Fase 4 — Investigar cada problema

No aceptéis automáticamente que algo es vulnerable.

Para cada hallazgo importante preguntad:

> ¿Dónde está exactamente el problema?

> ¿Qué entrada controla el usuario?

> ¿Qué permiso falta?

> ¿Qué información podría quedar expuesta?

> ¿Qué debería hacer el código?

La explicación debe poder entenderse sin preguntar nuevamente a Copilot.

---

## 40. Fase 5 — Corregir

Elegid al menos:

<p class="term">CUATRO problemas.</p>

Pedid a Copilot que proponga una corrección.

Pero utilizad este procedimiento:

```text
PROBLEMA
   ↓
EXPLICAR
   ↓
PROPONER SOLUCIÓN
   ↓
REVISAR
   ↓
MODIFICAR
   ↓
TEST
   ↓
REVISAR DIFF
```

No:

```text
ARREGLA TODO
   ↓
ACCEPT ALL
```

---

## 41. Ejemplo: secreto en código

Encontramos:

```javascript
const JWT_SECRET = "supersecreto123";
```

No basta con escribir:

> Hay una vulnerabilidad.

Debemos explicar:

#### Problema

El secreto se encuentra almacenado en el código fuente.

#### Riesgo

Puede terminar:

* en GitHub;
* en copias;
* en logs;
* en equipos de desarrolladores.

#### Solución

Moverlo a:

```text
variable de entorno
```

y asegurarnos de que no aparece en Git.

---

## 42. Ejemplo: autorización

Tenemos:

```text
GET /users/:id
```

y cualquier usuario autenticado puede cambiar:

```text
/users/15
```

por:

```text
/users/16
```

Pregunta:

> ¿Qué comprobación debería existir?

No buscamos simplemente cambiar código.

Buscamos entender:

```text
usuario autenticado
       ↓
solicita recurso
       ↓
¿es propietario?
o
¿tiene permiso?
       ↓
respuesta
```

---

## 43. Ejemplo: SQL Injection

Si encontráis algo parecido a:

```javascript
db.query(
    "SELECT * FROM users WHERE name = '" +
    name +
    "'"
);
```

pedid:

> Explica exactamente por qué esta construcción es peligrosa y reescríbela utilizando consultas parametrizadas.

Después comprobad que la solución:

* separa código y datos;
* mantiene la funcionalidad.

---

## 44. Fase 6 — Dependencias

Pedid a Copilot:

> Identifica las dependencias principales de este proyecto y explica brevemente qué función cumple cada una.

Después:

> ¿Existe alguna dependencia que parezca innecesaria?

También podéis utilizar las herramientas del gestor de paquetes.

Por ejemplo:

```bash
npm audit
```

cuando proceda.

Comparad:

```text
herramienta automática
        +
       IA
        +
revisión humana
```

---

## 45. Fase 7 — Errores

Provocad deliberadamente un error.

Por ejemplo:

* recurso inexistente;
* dato incorrecto;
* operación inválida.

Observad:

#### ¿Qué recibe el usuario?

#### ¿Qué aparece en los logs?

Pregunta:

> ¿Estamos revelando información que el usuario no necesita?

---

## 46. Fase 8 — Revisar el diff

Antes de considerar terminada la auditoría:

```bash
git diff
```

Revisad todos los cambios.

Preguntad:

#### ¿La solución de seguridad ha roto alguna funcionalidad?

#### ¿Se ha añadido alguna dependencia?

#### ¿Copilot ha modificado código que no debía?

#### ¿Los cambios son realmente necesarios?

---

## 47. ¿Está ya segura?

No podemos afirmar:

> esta aplicación es 100 % segura.

La seguridad absoluta no existe.

Podemos afirmar algo más riguroso:

> Hemos revisado determinados riesgos y corregido los problemas encontrados dentro del alcance de nuestra auditoría.

Esa diferencia es importante.

---

## 48. Producto final

Entregaréis:

### 1. Repositorio corregido

Con los cambios realizados.

---

### 2. Informe de seguridad

Máximo:

<p class="term">3 páginas.</p>

Nada de una memoria de veinte páginas.

---

### Página 1 — Riesgos encontrados

Tabla:

| Hallazgo | Severidad | Evidencia | Categoría |
| -------- | --------- | --------- | --------- |

Por ejemplo:

```text
Secret hardcoded | Alta | config.js | Gestión de secretos
```

---

### Página 2 — Correcciones

Para cada problema importante:

```text
ANTES
  ↓
PROBLEMA
  ↓
SOLUCIÓN
  ↓
CÓMO LO HEMOS VERIFICADO
```

---

### Página 3 — IA como revisor

Debéis incluir:

#### Un problema que la IA haya detectado correctamente.

#### Un problema que vosotros hayáis detectado antes que la IA.

#### Una recomendación de la IA que hayáis rechazado o modificado.

#### Una limitación que todavía tenga vuestra auditoría.

---

## 49. Pregunta final

Responded:

> Si mañana tuvierais que publicar esta aplicación para usuarios reales, ¿la publicaríais?

Opciones:

```text
SÍ

SÍ, PERO...

NO
```

Justificadlo técnicamente.

---

## 50. Evaluación

| Criterio                                           | Puntos |
| -------------------------------------------------- | -----: |
| Identificación y comprensión de activos y permisos |      1 |
| Detección de vulnerabilidades                      |      2 |
| **Comprensión de por qué son vulnerabilidades**    |  **2** |
| Calidad de las correcciones                        |      2 |
| Uso crítico de IA durante la auditoría             |    1,5 |
| Verificación de los cambios                        |      1 |
| Claridad del informe                               |    0,5 |

---

## 51. Lo que NO se evalúa

No obtiene mejor nota quien:

> encuentra 30 supuestas vulnerabilidades generadas por Copilot.

Porque muchas pueden ser falsas.

---

## 52. Lo que SÍ se evalúa

Queremos encontrar:

```text
PROBLEMA REAL
     ↓
EVIDENCIA
     ↓
RIESGO
     ↓
CORRECCIÓN
     ↓
VERIFICACIÓN
```

---

## 53. Checklist que podéis reutilizar trabajando

Antes de publicar una funcionalidad preguntad:

### Acceso

* ¿Quién puede ejecutar esto?
* ¿Compruebo permisos en servidor?

### Entrada

* ¿Qué datos controla el usuario?
* ¿Los valido?

### Base de datos

* ¿Utilizo consultas parametrizadas?

### Contraseñas

* ¿Se almacenan mediante mecanismos apropiados?

### Secretos

* ¿Hay tokens o passwords en el repositorio?

### Dependencias

* ¿Necesito realmente todas?
* ¿Presentan vulnerabilidades conocidas?

### Configuración

* ¿Tengo debug activado?
* ¿Expongo puertos o servicios innecesarios?

### Errores

* ¿Estoy mostrando información interna?

### Logs

* ¿Puedo saber qué ha ocurrido?
* ¿Estoy registrando información sensible?

### HTTPS

* ¿Las comunicaciones deben utilizar TLS?

### IA

* ¿He revisado el código que ha generado?

---

## 54. Lo importante que debes recordar

No necesitáis memorizar todas las vulnerabilidades existentes.

Necesitáis desarrollar una alarma mental cuando veáis:

```text
credencial en código

SQL concatenado

permiso no comprobado

password en texto plano

entrada no validada

dependencia extraña

debug en producción

puerto innecesario

error con información interna

código de IA aceptado sin revisar
```

La pregunta que debería aparecer automáticamente es:

> **¿Qué podría salir mal aquí?**

---

## 55. El flujo profesional que queremos aprender

```text
DESARROLLAR
    ↓
REVISAR
    ↓
PENSAR EN ABUSOS
    ↓
ANALIZAR CON IA
    ↓
COMPROBAR HALLAZGOS
    ↓
CORREGIR
    ↓
TESTEAR
    ↓
REVISAR DIFF
    ↓
DESPLEGAR
```

La IA puede acelerar muchas partes del proceso.

Pero:

> **la responsabilidad sobre el código que llega a producción sigue siendo del desarrollador.**

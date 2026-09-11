---
title: "Ciberseguridad para desarrolladores"
label: "UD6 · Proyecto"
section: "ud-06"
order: 6
lang: "es"
summary: "¿Publicarías esta aplicación? Aprende a detectar, explicar y corregir vulnerabilidades comunes con criterio propio y con la IA como apoyo de revisión."
duration: "5 horas · 5 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Auditoría y correcciones de seguridad. Una actividad acumulativa por unidad, con evidencias y aportación individual."
outcomes:
  - "Reconocer los cinco errores de seguridad que más aparecen en una aplicación web."
  - "Explicar por qué algo es una vulnerabilidad, con evidencia y no de memoria."
  - "Auditar un proyecto con ayuda de la IA sin delegarle la decisión final."
  - "Corregir un fallo y verificar que la corrección no rompe la funcionalidad."
requirements:
  - "Guía de arranque y materiales de esta unidad, enlazados en la página."
  - "Materiales del caso y herramientas indicadas en la unidad."
priorKnowledge:
  - "Las unidades anteriores de este módulo. No se requiere Servidor, Intermodular ni el otro módulo transversal."
date: "2026-09-09"
---

<p class="lead">Auditoría y correcciones de seguridad. Cada sesión introduce los conceptos que necesita y continúa una misma actividad de la unidad. Conserva sus resultados para revisarlos y utilizarlos después.</p>

## Cómo trabajar esta unidad

Son 5 sesiones de una hora: 10 minutos de explicación, 45 de trabajo guiado y 5 de cierre. Los ejemplos ampliados son material de consulta durante la práctica; no añaden otra clase teórica ni tareas obligatorias.

Abre la [guía de arranque y evaluación](/es/docencia/talleres-transversales/). Incluye archivos, herramientas y alternativas de acceso. Para los casos utiliza la [ficha común](/teaching/transversales/casos.pdf). No se necesita el CRUD de Servidor ni el workflow de Intermodular. Quien ya conozca una herramienta utiliza ese conocimiento para justificar y comprobar la actividad nueva, sin repetir un trabajo ya evaluado.

## Actividad y criterios de evaluación

**Auditoría y correcciones de seguridad.** La actividad se construye durante las sesiones de la unidad: cada avance incorpora el resultado, su comprobación y las decisiones que lo justifican. Cada integrante debe poder explicar su aportación.

Esta actividad se valora sobre 10 puntos y aporta **5/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Cada integrante registra y explica su aportación. La rúbrica se conoce desde el inicio:

| Criterio                                            | Puntos |
| --------------------------------------------------- | -----: |
| Identificación y comprensión de activos y permisos  |      1 |
| Detección de vulnerabilidades                       |      2 |
| **Comprensión de por qué son vulnerabilidades**     |  **2** |
| Calidad de las correcciones                         |      2 |
| Uso crítico de IA durante la auditoría              |    1,5 |
| Verificación de los cambios                         |      1 |
| Claridad del informe                                |    0,5 |

En cada criterio, una evidencia ausente no permite acreditar el logro; una evidencia incompleta requiere revisión; una evidencia correcta permite comprobar el resultado; el logro completo añade una justificación coherente y reconoce sus límites. Los puntos se asignan según el grado de logro del criterio, no por cantidad de archivos, commits o texto. Consulta la guía para revisar y volver a presentar los criterios pendientes.

## Sesión 1 · ¿Publicarías esta aplicación?

**Punto de partida.** Actividad «Auditoría y correcciones de seguridad», sesión 1 de 5. Abre los materiales enlazados y crea el registro de la unidad. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un **activo** es algo que debemos proteger, como pedidos o datos de usuarios. Una **amenaza** es una posible causa de daño; una **vulnerabilidad**, una debilidad que lo permite. El riesgo combina qué podría ocurrir y sus consecuencias. Antes de buscar líneas sospechosas necesitamos saber qué debería permitir la aplicación.

Autenticarse es demostrar quién eres; estar autorizado es tener permiso para una acción o un recurso. Un usuario identificado no debe consultar automáticamente los pedidos de todos. El laboratorio de esta unidad es independiente de Spring y contiene únicamente datos ficticios.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Descarga el [laboratorio de seguridad](/teaching/downloads/digitalizacion-seguridad.zip), extráelo y abre su guia-seguridad.pdf. Lee cómo arrancar `app.py`; funciona solo en la dirección local de tu equipo y no se publica en la nube.
2. Ejecuta `python app.py` y abre la dirección indicada. Lee los usuarios ficticios y los casos de prueba. La identidad simplificada del laboratorio sirve para estudiar permisos; no es un sistema de login de producción.
3. Crea una tabla con activos, persona que los utiliza y posible consecuencia de una exposición. Incluye pedidos, contactos y configuración de la aplicación.
4. Completa la matriz anónimo/cliente/administrador para consultar pedido, consultar configuración y buscar productos. Separa «puede acceder» de «puede acceder a este recurso».
5. Ejecuta un caso permitido siguiendo el guia-seguridad.pdf y registra petición y respuesta. Conserva la matriz como comportamiento esperado para las siguientes sesiones.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

El laboratorio arranca y la matriz indica qué debe ocurrir. No necesitas el backend de Servidor ni una cuenta real de usuario.


## Sesión 2 · Cinco errores que debes reconocer

**Punto de partida.** Actividad «Auditoría y correcciones de seguridad», sesión 2 de 5. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Los fallos se reconocen por una consecuencia comprobable, no por una palabra marcada por un asistente. Una entrada concatenada a SQL puede cambiar el sentido de la consulta; un identificador de pedido sin comprobación de propietario puede exponer datos ajenos. Un secreto incluido en código y una respuesta de error demasiado detallada crean otros riesgos distintos.

La revisión de contraseñas, dependencias y configuración completa el panorama: las contraseñas reales requieren mecanismos de almacenamiento adecuados y las dependencias deben conocerse y mantenerse. El laboratorio no pretende implementar un sistema de autenticación completo; utilizaremos fichas para distinguir estos conceptos.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### 1 · Control de acceso

##### Autenticación y autorización no son lo mismo

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

##### Un error muy frecuente

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

##### Principio de mínimo privilegio

Un usuario o aplicación debería tener **solo los permisos que necesita para realizar su trabajo**.

| Acción de un usuario normal | ¿Debería poder? |
| --------------------------- | :-------------: |
| Leer sus pedidos            | Sí |
| Modificar su perfil         | Sí |
| Borrar otros usuarios       | No |
| Gestionar administradores   | No |

Una base de datos utilizada únicamente para leer informes quizá no necesita permisos para ejecutar `DROP TABLE`.

Menos permisos significa menos daño posible si algo sale mal.

#### 2 · Entradas e inyección

##### Nunca confíes completamente en los datos que llegan

Supongamos:

```javascript
const username = req.query.username;
```

El usuario controla ese valor. Puede enviar `Marc`, pero también cualquier otra cosa.

Por tanto, cualquier entrada externa debe considerarse potencialmente no confiable. Puede llegar desde formularios, la URL, cookies, una API, un fichero, las cabeceras u otra aplicación.

##### Inyección

Observad:

```javascript
const query =
    "SELECT * FROM users WHERE username = '" +
    username +
    "'";
```

El resultado es aparentemente correcto, pero la consulta se construye concatenando código SQL con entrada del usuario, lo que puede permitir una vulnerabilidad de:

<p class="term">SQL Injection</p>

##### La solución general

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

##### Otro tipo de inyección: XSS

Imaginad que un usuario escribe un comentario y lo mostramos en nuestra web. Si en lugar de texto introduce contenido que el navegador interpreta como código, y lo insertamos sin las protecciones adecuadas, podemos provocar:

<p class="term">Cross-Site Scripting — XSS</p>

La idea importante vuelve a ser la misma: **los datos externos no son automáticamente seguros**.

Los frameworks modernos proporcionan muchas protecciones. No debemos desactivarlas sin entender las consecuencias.

#### 3 · Contraseñas y secretos

##### Las contraseñas

Observad esta tabla:

| usuario | password  |
| ------- | --------- |
| ana     | patata123 |
| pepe    | qwerty    |

¿Está bien almacenar contraseñas así?

<p class="term">No</p>

Una contraseña no debería almacenarse en texto plano.

##### Hash de contraseñas

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

##### Cifrado y funciones hash: dos operaciones distintas

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

##### Secretos

Nunca deberíamos encontrar esto en el repositorio:

```javascript
const API_KEY = "sk-123456789";
const DB_PASSWORD = "admin123";
```

Mucho menos si después hacemos `git push` a GitHub.

Una posibilidad habitual para guardarlos son:

<p class="term">variables de entorno</p>

Por ejemplo `DB_PASSWORD`, `API_KEY` o `JWT_SECRET`. La aplicación obtiene el valor del entorno y el secreto no queda almacenado en el código.

##### Y cuidado con `.env`

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

El secreto permanece en el historial del repositorio aunque se elimine posteriormente del código.

#### 4 · Dependencias y configuración

##### El problema de las dependencias

Nuestro programa puede tener 500 líneas propias y depender de 50.000 o 500.000 líneas escritas por terceros:

```json
"dependencies": {
    "express": "...",
    "axios": "...",
    "jsonwebtoken": "..."
}
```

Cada dependencia añade código, mantenimiento, posibles vulnerabilidades y riesgo de cadena de suministro.

##### Cadena de suministro de software

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

##### Configuración insegura

Una aplicación puede tener código correcto y estar mal configurada. Por ejemplo:

* `DEBUG=true` en producción;
* `CORS: *` sin necesidad;
* un usuario `admin` con la contraseña por defecto;
* una base de datos accesible públicamente;
* puertos abiertos innecesariamente.

Conviene recuperar lo estudiado sobre Azure:

<figure class="diagram">
  <figcaption>La seguridad está presente en todas las capas</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Internet</li>
    <li>Firewall</li>
    <li>Servidor</li>
    <li>Aplicación</li>
  </ol>
</figure>

#### 5 · Errores y logs

##### Los errores también pueden revelar información

Imaginad que nuestra aplicación responde esto a un usuario cualquiera:

```text
Error SQL: password authentication failed for user postgres
Database: 10.0.0.12
Path: /home/app/backend/database.js
```

Acabamos de regalar el motor de base de datos, una dirección interna y la estructura del proyecto. Un usuario debería recibir algo parecido a «Se ha producido un error», y los detalles quedar registrados internamente.

##### Logging

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

Tampoco procede almacenar sin criterio contraseñas, tokens, números de tarjeta ni secretos.

##### HTTPS

Ya lo utilizamos en Azure. `HTTP` no proporciona por sí mismo protección TLS; con `HTTPS` obtenemos confidencialidad, integridad y autenticación del servidor mediante certificado.

Pero HTTPS no convierte automáticamente una aplicación insegura en segura: una web con SQL Injection sigue siendo vulnerable aunque utilice HTTPS.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre `app.py` y localiza las funciones `get_order`, `search_products`, `public_config` y `error_response` mediante la búsqueda del editor. Anota qué hace cada una antes de juzgarla.
2. Sigue el caso resuelto de pedido ajeno del guia-seguridad.pdf. Compara el resultado con tu matriz: saber que el pedido existe no concede permiso para leerlo.
3. Ejecuta `python -m unittest -v`. Las pruebas de seguridad fallan en la versión inicial de forma deliberada. Lee una aserción y tradúcela a una regla del negocio.
4. Revisa la ficha de contraseñas, secretos, dependencias y logs. Clasifica cada ejemplo según dato expuesto, posible daño y medida de prevención; no copies un algoritmo de cifrado como solución universal.
5. Corrige el primer fallo de propietario siguiendo las pistas del guia-seguridad.pdf y ejecuta su prueba. Guarda la evidencia inicial y la posterior; no declares corregidas las otras familias porque una prueba pase.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Se ha explicado y verificado una corrección. La tabla distingue autorización, entrada SQL, configuración y respuesta de error, además de los conceptos de las fichas.


## Sesión 3 · Primero tu criterio, después la IA

**Punto de partida.** Actividad «Auditoría y correcciones de seguridad», sesión 3 de 5. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

La IA puede ayudar a buscar fallos, pero una sugerencia no es todavía un hallazgo verificado. Un **falso positivo** señala un problema que no se confirma. La revisión necesita archivo, comportamiento, evidencia y consecuencia; de otro modo solo acumula sospechas.

Compararemos una revisión propia con otra asistida para descubrir qué aporta cada una. Pedir «hazlo seguro» mezcla diagnóstico y cambios difíciles de controlar. Primero solicitaremos observaciones sin modificar archivos; después decidiremos qué corregir.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Retoma el laboratorio y anota tus sospechas antes de consultar al agente. Utiliza la matriz de permisos y las pruebas, no una lista de términos encontrados.
2. Pide una revisión acotada de las cuatro funciones con archivo, problema, evidencia, riesgo y propuesta. Indica que no modifique nada y que distinga una sospecha de un fallo reproducido.
3. Compara las dos listas en cuatro grupos: coinciden, solo humano, solo IA y no confirmado. Deja vacío un grupo si no hay casos; no inventes un falso positivo para rellenar la tabla.
4. Reproduce una observación del agente con la prueba correspondiente. Si no se confirma, escribe qué falta para decidir. Si se confirma, explica la regla que debería cumplir.
5. Empieza una corrección pendiente de SQL o configuración. Limita el cambio a la función relevante y vuelve a ejecutar las pruebas para comprobar su efecto.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Hay una comparación razonada y un hallazgo nuevo verificado o descartado. Se evalúa el criterio, no que el asistente produzca muchas vulnerabilidades.


## Sesión 4 · Corregir y verificar los resultados

**Punto de partida.** Actividad «Auditoría y correcciones de seguridad», sesión 4 de 5. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Corregir un fallo implica cambiar la causa y comprobar el comportamiento, incluido un caso válido que deba seguir funcionando. Una consulta parametrizada separa el dato del código SQL; un mensaje de error público puede ser genérico mientras el diagnóstico se conserva solo en el entorno apropiado.

El laboratorio tiene cuatro objetivos acotados repartidos desde la sesión 2. Sus pruebas ayudan a comprobarlos, pero no demuestran que cualquier aplicación sea segura. El análisis debe describir qué se verificó y qué queda fuera, en vez de prometer seguridad absoluta.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre la tabla de hallazgos y marca cuáles ya tienen corrección verificada. Prioriza los pendientes que afectan a permisos, búsqueda, configuración y errores.
2. Corrige una función cada vez con las pistas de `guia-seguridad.pdf`. Antes de ejecutar, explica qué entrada o permiso cambia y qué respuesta esperas.
3. Ejecuta su prueba y después la suite completa. Si una operación válida deja de funcionar, revisa el alcance del cambio antes de continuar con otro fallo.
4. Revisa el diff o compara con la copia inicial. Comprueba que no se han añadido secretos reales, dependencias innecesarias ni cambios ajenos a los retos.
5. Completa por cada fallo la cadena problema → evidencia → corrección → prueba → límite. Guarda el laboratorio corregido y deja claramente identificados los pendientes para la revisión cruzada.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Cada corrección reclamada tiene una prueba y una explicación propia. El informe se construye a partir de esa tabla, sin otro documento duplicado.


## Sesión 5 · Auditoría cruzada en el aula y consolidación

**Punto de partida.** Actividad «Auditoría y correcciones de seguridad», sesión 5 de 5. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una revisión cruzada comprueba si otra persona puede reproducir el resultado con las instrucciones entregadas. No consiste en atacar el trabajo de un compañero ni en premiar a quien encuentre más fallos. El objetivo es descubrir instrucciones incompletas, resultados no reproducibles o límites no declarados.

Una observación útil indica paso seguido, resultado esperado y resultado observado. «No funciona» no permite corregir; «la búsqueda normal falla después del cambio de SQL» identifica un comportamiento que debe conservarse.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Intercambia la carpeta del laboratorio con otra pareja, junto con la guía del laboratorio y la tabla de hallazgos. Trabaja en una copia distinta de tu versión, siempre en local.
2. Arranca siguiendo solo sus instrucciones y ejecuta las pruebas. Registra el resultado y una incidencia reproducible si aparece; no cambies todavía el código ajeno.
3. Elige un caso permitido y uno rechazado. Contrasta las respuestas con su matriz de permisos y pregunta por una decisión cuya evidencia no esté clara.
4. Devuelve observaciones concretas. En tu propio trabajo corrige una incidencia o explica con evidencia por qué no procede, y repite las pruebas afectadas.
5. Entrega versión final, matriz, hallazgos y resultados. Cada integrante explica una corrección y una limitación. La decisión «publicaría/no publicaría» se refiere a los criterios del laboratorio y no autoriza a publicar su versión vulnerable.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

La actividad de seguridad queda reproducible, con correcciones y pendientes identificados. No requiere reutilizar JWT ni tests del proyecto de Servidor.


## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

---
title: "APIs REST: recursos, DTO, validación y errores"
label: "UD3 · Diseñar"
section: "ud-03"
order: 3
lang: "es"
summary: "Las reglas de diseño que convierten un montón de endpoints en una API defendible: recursos, representaciones, DTO, entrada validada y errores coherentes."
duration: "18 horas · 3 semanas · 9 sesiones"
modality: "Taller de diseño · 60 % guía / 40 % autonomía"
deliverable: "La API del gestor rediseñada como recursos, con DTO de entrada y salida, validación y un formato de error único."
date: "2026-09-02"
outcomes:
  - "Distinguir una API HTTP cualquiera de una API orientada a recursos."
  - "Nombrar recursos y URLs sin meter verbos ni acciones en la ruta."
  - "Separar el modelo interno de lo que la API publica mediante DTO."
  - "Validar la entrada antes de que llegue a la lógica y explicar qué falla."
  - "Devolver errores con un formato único, predecible y útil para quien consume."
requirements:
  - "El CRUD en memoria de la UD2."
  - "Postman o Bruno con la colección de la UD2."
priorKnowledge:
  - "Métodos HTTP, códigos de estado y ResponseEntity."
  - "Serialización y deserialización JSON."
---

<p class="lead">Llevas dos unidades construyendo endpoints. Aquí aprendes a diseñarlos antes de que la aplicación crezca lo suficiente como para que rediseñarla salga caro.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio. Las reglas de diseño se explican y se aplican juntos sobre el gestor; el rediseño final se entrega a partir de criterios de aceptación, sin una solución de referencia.</p>
</div>

## Semana 5 · Pensar en recursos

## Sesión 13 · De una API HTTP a una API REST

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> qué es REST de verdad, qué no es, y en qué se diferencia de «devolver JSON por HTTP».</li>
    <li><strong>2. Haz:</strong> audita tu propia API de la UD2 contra una rúbrica y sitúala en el mapa.</li>
    <li><strong>3. Comprueba:</strong> sabes decir qué partes de tu API son REST, cuáles no, y qué costaría arreglarlo.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Escribe qué crees que significa que una API sea «REST». No mires nada.</li>
    <li>¿Qué significa que HTTP no tenga estado? Lo viste en la UD1.</li>
    <li>Enumera las rutas de tu API de la UD2. ¿Cuántas hay y cómo se llaman?</li>
  </ol>
</div>

### Tu API funciona. Eso no la hace REST

En la sesión 12 entregaste dieciséis endpoints con sus códigos correctos y una colección que los comprueba. Funciona, es verificable y otra persona puede usarla.

Y aun así, si mañana en una entrevista te preguntan «¿es una API REST?», la respuesta honesta hoy sería: *en parte, y no sabría decir en qué parte*.

Eso es lo que arreglamos esta semana. No porque la palabra sea importante, sino porque detrás de ella hay un conjunto de decisiones de diseño que hacen que una API se pueda usar sin manual, crecer sin romperse y entender sin preguntar.

<div class="rule">
  <p class="rule-label">El malentendido más extendido del sector</p>
  <p>«Mi API devuelve JSON, luego es REST.» <strong>No.</strong> El formato no tiene nada que ver: se puede hacer una API REST que devuelva XML y una API terrible que devuelva JSON.</p>
  <p>Lo que decide no es qué formato usas, sino <strong>cómo organizas lo que hay detrás de las URLs y qué significan tus métodos y tus códigos</strong>.</p>
</div>

### Qué es REST

<p class="term">REST</p>

*Representational State Transfer*. Un **estilo de arquitectura** descrito por Roy Fielding en el año 2000, en la tesis donde analizaba por qué la web había funcionado a escala planetaria cuando casi ningún sistema distribuido lo consigue.

Fíjate en «estilo». No es un protocolo, no es un estándar que se cumpla o se incumpla, y no es una librería que se instala. Es un conjunto de restricciones que, si las aceptas, te dan unas propiedades a cambio.

Las que importan aquí son cinco:

| Restricción | Qué significa | ¿Ya la cumples? |
| :--- | :--- | :--- |
| Cliente-servidor | Quien pide y quien responde son programas separados que solo se comunican por el contrato | Sí, desde la UD1 |
| Sin estado | Cada petición trae todo lo necesario; el servidor no recuerda la anterior | Sí, aunque sin saberlo |
| Cacheable | La respuesta puede declarar si se puede reutilizar | No, todavía |
| Interfaz uniforme | Todos los recursos se manipulan igual, con las mismas reglas | **Parcialmente** |
| Sistema por capas | Puede haber intermediarios sin que el cliente se entere | Sí, gratis |

Tres las cumples sin haber hecho nada: te las regaló HTTP. La cuarta es el trabajo de esta unidad.

#### La interfaz uniforme, que es la que cuesta

Es la restricción central y se apoya en tres ideas:

<figure class="diagram">
  <figcaption>Qué exige una interfaz uniforme</figcaption>
  <ol class="flow flow--before">
    <li><strong>Cada cosa tiene su dirección.</strong> Un recurso se identifica por una URL, y siempre la misma</li>
    <li><strong>Se manipula a través de representaciones.</strong> No mandas el objeto: mandas una descripción de cómo debe quedar</li>
    <li><strong>Los mensajes se explican solos.</strong> El método, el código y las cabeceras dicen qué ocurre sin necesitar documentación aparte</li>
  </ol>
</figure>

La segunda idea es la de la sesión 15 y la que más cuesta al principio. La primera y la tercera son las de esta semana.

### El mapa · cuatro niveles

Hay una forma muy práctica de situar cualquier API, y sirve tanto para juzgar la tuya como para entender la de otro. Son cuatro niveles, cada uno construido sobre el anterior.

<figure class="diagram">
  <figcaption>Los cuatro niveles de madurez de una API</figcaption>
  <ol class="flow flow--before">
    <li><strong>Nivel 0 · Una sola puerta.</strong> Una URL, un método, y dentro del cuerpo se dice qué se quiere hacer</li>
    <li><strong>Nivel 1 · Recursos.</strong> Cada cosa tiene su propia URL</li>
    <li><strong>Nivel 2 · Verbos y códigos.</strong> El método HTTP dice la acción y el código dice el resultado</li>
    <li><strong>Nivel 3 · Hipermedia.</strong> Las respuestas incluyen los enlaces a lo que se puede hacer después</li>
  </ol>
</figure>

Míralos con ejemplos, porque así se reconocen de un vistazo:

#### Nivel 0 · una sola puerta

```text
POST /api
{ "accion": "obtenerTarea", "id": 3 }

POST /api
{ "accion": "borrarTarea", "id": 3 }
```

HTTP se usa solo como sobre. Todo pasa por una URL y un método, y la intención va escondida en el cuerpo. Ni las URLs ni los códigos significan nada.

#### Nivel 1 · recursos con nombre

```text
POST /tareas/obtener
POST /tareas/borrar
POST /tareas/3/marcar-completada
```

Ya hay URLs distintas para cosas distintas: es un avance real. Pero la acción sigue estando en la ruta, y todo se hace con `POST`.

Reconoce esto, porque **es exactamente lo que escribe todo el mundo la primera vez**, y es lo que la UD1 te prohibió sin explicarte del todo por qué.

#### Nivel 2 · el método y el código hacen su trabajo

```text
GET    /tareas/3        → 200
DELETE /tareas/3        → 204
POST   /tareas          → 201
PATCH  /tareas/3        → 200
```

La ruta dice **sobre qué**, el método dice **qué**, y el código dice **cómo ha ido**. Aquí es donde vive la inmensa mayoría de las APIs profesionales, y donde debe estar la tuya al terminar la unidad.

#### Nivel 3 · la respuesta te dice qué puedes hacer ahora

```json
{
  "id": 3,
  "titulo": "Revisar el login",
  "estado": "abierta",
  "_links": {
    "self":    { "href": "/tareas/3" },
    "cerrar":  { "href": "/tareas/3/cierre", "method": "POST" },
    "proyecto":{ "href": "/proyectos/7" }
  }
}
```

El cliente no necesita saberse las rutas: las va descubriendo en las respuestas, igual que tú navegas por una web siguiendo enlaces sin conocer sus URLs.

<div class="rule">
  <p class="rule-label">Honestidad sobre el nivel 3</p>
  <p>Es el nivel que Fielding considera imprescindible para llamar «REST» a una API, y a la vez <strong>es el que casi nadie implementa</strong>. Añade complejidad y muy pocos clientes la aprovechan.</p>
  <p>En este módulo llegaremos al nivel 2 y lo haremos bien. Del 3 tienes que saber que existe, por qué existe y por qué se decide no usarlo: eso es exactamente lo que se espera de un profesional junior.</p>
</div>

### Dónde está tu API ahora mismo

Cógela y sitúala. Esta es la rúbrica:

| # | Criterio | Sí / No |
| :---: | :--- | :---: |
| 1 | Ninguna ruta contiene un verbo | |
| 2 | Cada recurso tiene una URL propia y estable | |
| 3 | Las colecciones se nombran en plural | |
| 4 | La acción la expresa siempre el método HTTP | |
| 5 | `GET` nunca modifica nada | |
| 6 | Cada final posible tiene su código de estado | |
| 7 | Los recursos relacionados se expresan con jerarquía en la ruta | |
| 8 | El mismo tipo de dato se representa igual en todos los endpoints | |
| 9 | La API no publica campos internos del modelo | |
| 10 | Las respuestas incluyen enlaces a operaciones relacionadas | |

<dl class="worked">
  <dt>Del 1 al 6</dt>
  <dd>Deberías tenerlos ya. La UD1 y la UD2 te los impusieron como reglas sueltas, sin decirte que juntas formaban el nivel 2.</dd>
  <dt>El 7 y el 8</dt>
  <dd>Es donde se decide la sesión 14. Probablemente tengas el 7 a medias, con la ruta anidada de tareas de un proyecto, y el 8 sin comprobar nunca.</dd>
  <dt>El 9</dt>
  <dd>Casi seguro que es un no, y es el tema de la sesión 15. Tu API publica exactamente los campos que tenga la clase, sin que nadie lo haya decidido.</dd>
  <dt>El 10</dt>
  <dd>Es un no, y va a seguir siéndolo. Es el nivel 3, y ya sabes por qué no vamos.</dd>
</dl>

### Práctica guiada · La misma aplicación, tres veces

Aquí tienes la misma funcionalidad —consultar una incidencia, cerrarla y listar las de un proyecto— escrita en tres niveles.

<p class="stage">Nivel 0</p>

```text
POST /servicio
{ "op": "getIncidencia", "id": 41 }

POST /servicio
{ "op": "cerrarIncidencia", "id": 41 }

POST /servicio
{ "op": "listarIncidencias", "proyecto": 7 }
```

<p class="stage">Nivel 1</p>

```text
POST /incidencia/get/41
POST /incidencia/cerrar/41
POST /incidencias/listar/7
```

<p class="stage">Nivel 2</p>

```text
GET   /incidencias/41
PATCH /incidencias/41          { "estado": "cerrada" }
GET   /proyectos/7/incidencias
```

Responde por escrito, comparando las tres columnas:

1. En el nivel 0, ¿puede un intermediario —una caché, un cortafuegos— saber si una petición modifica datos? ¿Y en el nivel 2?
2. En el nivel 1, ¿qué pasa si el navegador reintenta una petición que se quedó sin respuesta?
3. ¿Cuántas rutas nuevas hace falta inventar en cada nivel para añadir «reabrir una incidencia»?
4. Un desarrollador nuevo llega al equipo. ¿En cuál de los tres puede adivinar cómo se borra una incidencia sin preguntar?

La pregunta 4 es la que resume la unidad. **Una API bien diseñada es la que se puede adivinar.**

### Ahora tú · Audita tu propia API

1. Pasa la rúbrica de diez criterios a tu API de la UD2, endpoint por endpoint. Sé duro: un «a medias» es un no.
2. Sitúa tu API en el mapa de niveles y justifica la posición en tres frases.
3. Haz una lista de **todo lo que incumples**, ordenada por lo que costaría arreglarlo, de más barato a más caro.
4. Para los tres más baratos, escribe exactamente qué cambiarías.

Guarda esta auditoría: en la sesión 21 volverás a pasarla y la diferencia entre las dos es parte de la entrega de la unidad.

### Reto · Diagnostica una API ajena

Estas son rutas reales de una API interna de una empresa ficticia:

```text
POST /api/getUsuarios
POST /api/getUsuarioById
POST /api/user/create
GET  /api/borrarUsuario?id=12
POST /api/usuarios/12/update
GET  /api/usuario/12/pedidos/listado
POST /api/actualizarEstadoPedido
GET  /api/pedidos?borrarCancelados=true
```

1. Sitúa esta API en el mapa y justifícalo.
2. Señala **la ruta más peligrosa de todas** y explica qué puede llegar a ocurrir con ella un día cualquiera. Hay dos candidatas y una es claramente peor.
3. Reescribe las ocho como nivel 2. Alguna se convertirá en la misma ruta que otra: dilo y explica por qué eso es bueno.
4. Cuenta cuántas rutas quedan al final y explica en una frase a qué se debe la diferencia.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Los cuatro niveles reconocidos y la rúbrica pasada a tu API con su lista de incumplimientos.</span></div>
  <div><strong>Si lo tienes</strong><span>Las cuatro preguntas de la comparación respondidas y los tres arreglos más baratos escritos.</span></div>
  <div><strong>Reto</strong><span>La API ajena diagnosticada, reescrita a nivel 2 y con la ruta peligrosa identificada y argumentada.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 13</p>
  <ul class="checklist">
    <li>Sabes decir qué es REST sin mencionar la palabra JSON.</li>
    <li>Reconoces los cuatro niveles viendo un puñado de rutas.</li>
    <li>Has situado tu API en el mapa y sabes justificar la posición.</li>
    <li>Tienes por escrito la lista de lo que incumple tu API y el coste de arreglarlo.</li>
    <li>Puedes explicar por qué el nivel 3 existe y por qué no vamos a implementarlo.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué devolver JSON no convierte una API en REST?</li>
    <li>¿Qué tres restricciones de REST cumples solo por usar HTTP correctamente?</li>
    <li>¿Qué distingue el nivel 1 del nivel 2?</li>
    <li>¿Por qué casi nadie implementa el nivel 3?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque REST no dice nada del formato: habla de cómo se identifican los recursos, cómo se manipulan y qué significan los mensajes. Se puede devolver JSON con un diseño de nivel 0.</p>
  <p>2 · Cliente-servidor, sin estado y sistema por capas. Las tres vienen dadas por el propio protocolo.</p>
  <p>3 · En el nivel 1 cada cosa ya tiene su URL, pero la acción sigue metida en la ruta y todo se hace con el mismo método. En el nivel 2 la acción la expresa el método HTTP y el resultado lo expresa el código de estado.</p>
  <p>4 · Porque añade complejidad al servidor y muy pocos clientes aprovechan los enlaces: la mayoría se escriben conociendo las rutas de antemano. Es una decisión de coste y beneficio, no un olvido.</p>
</details>

## Sesión 14 · Recursos y REST

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> qué es un recurso, cómo se nombran las URLs y qué hacer con las acciones que no son un CRUD.</li>
    <li><strong>2. Haz:</strong> repara doce rutas mal diseñadas y escribe el contrato de recursos del gestor.</li>
    <li><strong>3. Comprueba:</strong> alguien que no conoce tu API puede adivinar una ruta que no le has enseñado.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué separa el nivel 1 del nivel 2 en el mapa de ayer?</li>
    <li>De la UD1: ¿qué dato va en la ruta y cuál en la <em>query string</em>?</li>
    <li>Escribe la ruta que usarías para «las tareas del proyecto 7».</li>
  </ol>
</div>

### Un recurso es un sustantivo

<p class="term">Recurso</p>

Cualquier cosa de la que tu API pueda hablar y a la que se pueda dar una dirección: un proyecto, una tarea, un usuario, un comentario. También una colección de ellas.

Esa es toda la definición, y la consecuencia práctica es enorme: **si tu URL contiene un verbo, no estás nombrando una cosa, estás dando una orden**. Y las órdenes no se pueden identificar, ni cachear, ni relacionar entre sí.

<div class="compare-pair">
  <div>
    <p class="compare-label">Pensar en acciones</p>
    <p class="compare-body">Cada funcionalidad nueva inventa una ruta nueva. La API crece como una lista de órdenes que hay que memorizar, y solo la conoce quien la escribió.</p>
  </div>
  <div>
    <p class="compare-label">Pensar en recursos</p>
    <p class="compare-body">Las cosas del dominio son pocas y estables. Sobre cada una se aplican siempre los mismos cinco métodos, así que quien conoce una sabe usar las demás.</p>
  </div>
</div>

Esa es la ganancia real. No es elegancia: es que **una API de nivel 2 con veinte recursos se aprende una vez**, mientras que una de nivel 1 con veinte recursos son cien rutas distintas que hay que consultar.

### Las siete reglas de nombrado

| # | Regla | Mal | Bien |
| :---: | :--- | :--- | :--- |
| 1 | Sustantivos, nunca verbos | `/crearTarea` | `POST /tareas` |
| 2 | Colecciones en plural | `/tarea/3` | `/tareas/3` |
| 3 | Minúsculas y guiones | `/ordenesDeTrabajo` | `/ordenes-de-trabajo` |
| 4 | Sin extensión de archivo | `/tareas.json` | `/tareas` |
| 5 | Jerarquía para la pertenencia | `/tareas?proyecto=7` | `/proyectos/7/tareas` |
| 6 | Query string para filtrar | `/tareas/completadas` | `/tareas?completada=true` |
| 7 | Sin barra final | `/tareas/` | `/tareas` |

Las dos que de verdad se piensan son la 5 y la 6, porque son la misma decisión de la UD1 vista desde arriba.

#### Jerarquía o filtro

<div class="rule">
  <p class="rule-label">La pregunta que lo resuelve</p>
  <p><strong>¿El recurso existe por sí solo, o solo tiene sentido dentro de otro?</strong></p>
  <p>Una tarea existe por sí sola: tiene su id y se puede consultar directamente en <code>/tareas/41</code>. Que además pertenezca a un proyecto es una <em>relación</em>, y <code>/proyectos/7/tareas</code> es una forma cómoda de recorrerla.</p>
  <p>Un comentario de una incidencia, en cambio, no significa nada fuera de ella. Ahí la jerarquía no es una comodidad: es la única dirección que tiene sentido.</p>
</div>

Y un límite práctico:

```text
/proyectos/7/tareas/41/comentarios/5/respuestas/2
```

Nadie escribe eso, nadie lo lee y nadie lo mantiene. **Dos niveles de profundidad es el máximo razonable.** Si un recurso tiene id propio, se accede directo:

```text
/comentarios/5/respuestas
```

### Lo que no es un CRUD

Aquí está la parte difícil y la que separa una API pensada de una API copiada. ¿Qué haces con «archivar un proyecto», «cerrar una incidencia», «enviar un aviso» o «iniciar sesión»?

Ninguna es crear, leer, actualizar ni borrar. Y sin embargo hay que exponerlas. Hay tres estrategias, en este orden de preferencia:

<p class="stage">Estrategia 1 · Es un cambio de estado</p>

La mayoría de las «acciones» son en realidad un campo que cambia de valor.

```text
PATCH /incidencias/41
{ "estado": "cerrada" }
```

«Cerrar» no es una operación: es poner el estado a `cerrada`. Si el dominio ya tiene ese campo, no hace falta inventar nada.

<p class="stage">Estrategia 2 · Es un recurso que no habías visto</p>

A veces la acción esconde una cosa que merece existir por sí misma.

```text
POST /incidencias/41/comentarios
POST /proyectos/7/miembros
```

«Comentar» no es un verbo que colgar de la incidencia: es **crear un comentario**. En cuanto lo ves así, aparece una colección que además se puede listar, paginar y borrar.

<p class="stage">Estrategia 3 · Es una acción, y se admite</p>

Cuando lo anterior no encaja, se expone la acción como un recurso propio y se documenta:

```text
POST /incidencias/41/cierre
POST /pedidos/12/reembolso
POST /sesiones
```

Fíjate en que siguen siendo sustantivos: el *cierre*, el *reembolso*, la *sesión*. Y en que se hacen con `POST`, porque no son idempotentes.

<div class="rule">
  <p class="rule-label">Cuándo está bien salirse de la norma</p>
  <p>La estrategia 3 no es una derrota. Hay operaciones —un pago, un envío de correo, un proceso largo— que <strong>no son el cambio de un campo</strong> y forzarlas a serlo produce una API peor y más confusa.</p>
  <p>Lo que no vale es usarla por defecto porque es la más fácil. La regla: <strong>intenta la 1, luego la 2, y solo entonces la 3 — y cuando uses la 3, escribe por qué.</strong></p>
</div>

<details class="aside aside--extra">
  <summary>El caso del <em>login</em>, que todo el mundo pregunta</summary>
  <p>Iniciar sesión no es CRUD por ninguna parte, y aun así encaja en la estrategia 2 si lo miras bien: lo que se crea es <strong>una sesión</strong>.</p>
  <p><code>POST /sesiones</code> crea una, <code>DELETE /sesiones/actual</code> la cierra. Verás también <code>POST /auth/login</code>, que es la estrategia 3, y es perfectamente común.</p>
  <p>Lo trabajaremos de verdad en la UD9. Hoy solo interesa que veas que hasta el caso más raro tiene un sustantivo detrás si lo buscas.</p>
</details>

### Práctica guiada · Repara doce rutas

Reescribe cada una al nivel 2. Indica **método y ruta**, y en las que lo necesiten, qué va en el cuerpo.

| # | Ruta original | Qué hace |
| :---: | :--- | :--- |
| 1 | `POST /crearProyecto` | Crea un proyecto |
| 2 | `GET /obtenerProyecto?id=7` | Devuelve el proyecto 7 |
| 3 | `GET /borrarProyecto/7` | Borra el proyecto 7 |
| 4 | `POST /proyecto/7/editar` | Cambia el nombre del proyecto 7 |
| 5 | `GET /listadoDeTareas` | Todas las tareas |
| 6 | `GET /tareasDelProyecto/7` | Las tareas del proyecto 7 |
| 7 | `GET /tareas/pendientes` | Las tareas no completadas |
| 8 | `POST /tarea/41/marcarCompletada` | Marca la tarea 41 como completada |
| 9 | `POST /tarea/41/asignarUsuario/3` | Asigna la tarea 41 al usuario 3 |
| 10 | `POST /añadirComentario` | Añade un comentario a una incidencia |
| 11 | `GET /proyectos.json` | Todos los proyectos |
| 12 | `POST /archivarProyectosCerrados` | Archiva todos los proyectos cerrados |

Tres avisos, para que no las despaches en cinco minutos:

* La **3** tiene un problema mucho más grave que el nombre. Ya sabes cuál desde la UD1.
* La **9** admite al menos dos soluciones buenas y distintas. Escribe las dos y elige una argumentando.
* La **12** no encaja limpiamente en ninguna estrategia. Es a propósito: resuélvela como puedas y explica qué te chirría.

### El contrato de recursos del gestor

Con las reglas ya aplicadas, escribe el contrato completo de la aplicación. Este es el formato, con las dos primeras filas resueltas como ejemplo:

| Recurso | Colección | Elemento | Relaciones |
| :--- | :--- | :--- | :--- |
| Proyecto | `/proyectos` | `/proyectos/{id}` | `/proyectos/{id}/tareas` |
| Tarea | `/tareas` | `/tareas/{id}` | — |
| Usuario | | | |
| Comentario | | | |
| Etiqueta | | | |

Para cada recurso, decide además:

1. Qué métodos acepta la colección y qué métodos acepta el elemento. **No todos tienen que aceptar los cinco**: un recurso que no se borra nunca no expone `DELETE`, y decirlo es diseñar.
2. Qué filtros admite la colección, en query string.
3. Si alguna relación merece ruta anidada o basta con un filtro.

<details class="aside aside--help">
  <summary>Estoy atascado · las etiquetas</summary>
  <p>Una etiqueta es un recurso propio: existe aunque ninguna tarea la use, se lista y se borra. Hasta ahí, fácil.</p>
  <p>Lo difícil es la relación: una tarea tiene varias etiquetas y una etiqueta está en varias tareas. Piensa qué URL representa «las etiquetas de la tarea 41», y qué método usarías para añadirle una que ya existe. Ojo: añadir una etiqueta existente a una tarea <strong>no crea una etiqueta nueva</strong>.</p>
</details>

### Ahora tú · Aplica el contrato a tu código

1. Renombra en tu proyecto todas las rutas que incumplan alguna de las siete reglas.
2. Actualiza la colección de Postman para que siga en verde con las rutas nuevas. Si sacaste el servidor a `{{baseUrl}}`, esto es rápido; si no, ya sabes por qué se hacía.
3. Añade el recurso `Comentario` a la API, anidado donde corresponda, con al menos listar y crear.
4. Anota en `DECISIONES.md` qué rutas cambiaron y por qué.

### Reto · La prueba de que se puede adivinar

Este es el examen real de una API bien nombrada.

1. Dale a un compañero **solo tres rutas** de tu API, ninguna de comentarios.
2. Pídele que escriba, sin verte y sin preguntarte: cómo listaría los comentarios de una incidencia, cómo crearía uno, cómo borraría uno, y cómo listaría solo los de un autor.
3. Compara sus cuatro respuestas con tus rutas reales.
4. Cada acierto es una regla que tu API cumple. **Cada fallo es una decisión tuya que no era adivinable**: anótala y decide si el nombre malo es el suyo o el tuyo.

Hazlo también al revés, con la API de él.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las doce rutas reparadas y el contrato de recursos con proyectos, tareas y comentarios.</span></div>
  <div><strong>Si lo tienes</strong><span>El contrato completo con usuarios y etiquetas, y las rutas de tu código renombradas con la colección en verde.</span></div>
  <div><strong>Reto</strong><span>La prueba de adivinanza hecha en las dos direcciones, con los fallos analizados.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 14</p>
  <ul class="checklist">
    <li>Ninguna ruta de tu API contiene un verbo.</li>
    <li>Las colecciones están en plural y las relaciones de pertenencia usan jerarquía.</li>
    <li>Sabes decidir entre ruta anidada y filtro, y justificarlo.</li>
    <li>Conoces las tres estrategias para lo que no es CRUD y el orden en que se intentan.</li>
    <li>Tienes el contrato de recursos escrito, con los métodos que acepta cada uno.</li>
    <li>Alguien ha adivinado al menos una ruta tuya que no le habías enseñado.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué una URL no debe contener un verbo?</li>
    <li>¿Cuándo se usa ruta anidada y cuándo un filtro en la query string?</li>
    <li>Enumera las tres estrategias para exponer algo que no es CRUD.</li>
    <li>¿Cuál es la ganancia práctica de tener veinte recursos en lugar de cien rutas?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque la URL identifica una cosa y la acción ya la expresa el método HTTP. Con el verbo en la ruta, cada funcionalidad nueva inventa una dirección nueva y la API deja de ser adivinable.</p>
  <p>2 · Anidada cuando el recurso pertenece a otro o solo tiene sentido dentro de él; filtro cuando se trata de acotar una colección que existe por sí sola.</p>
  <p>3 · Tratarlo como un cambio de estado con <code>PATCH</code>; descubrir que hay un recurso nuevo que crear; y, si nada de eso encaja, exponer la acción como un sustantivo propio con <code>POST</code> y documentar por qué.</p>
  <p>4 · Que se aprende una vez. Sobre cada recurso se aplican siempre los mismos métodos, así que quien sabe usar uno sabe usar los demás sin consultar nada.</p>
</details>

## Sesión 15 · RestController y representaciones

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué lo que viaja por la red no es tu objeto, sino una representación que tú decides.</li>
    <li><strong>2. Haz:</strong> separa por primera vez el modelo de lo que la API publica.</li>
    <li><strong>3. Comprueba:</strong> cambias el modelo por dentro y el contrato no se entera.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿De dónde saca Jackson las claves del JSON que devuelve tu API?</li>
    <li>Añades un campo privado con su <em>getter</em> a la clase <code>Tarea</code>. ¿Quién decide si aparece en la respuesta?</li>
    <li>Del criterio 9 de la rúbrica de la sesión 13: ¿tu API publica campos internos? ¿Cuáles?</li>
  </ol>
</div>

### El experimento incómodo

Abre tu clase `Tarea` y añade esto, tal cual:

```java
private String notaInterna = "revisar con el jefe de proyecto";

public String getNotaInterna() {
    return notaInterna;
}
```

Reinicia y pide `GET /tareas`.

```json
[{"id":1,"titulo":"Revisar el login","prioridad":"alta",
  "completada":false,"notaInterna":"revisar con el jefe de proyecto"}]
```

Ahí está, publicado en internet. **Tú no has tocado el controlador.** No has decidido publicarlo, no lo has añadido a ninguna respuesta y nadie te ha avisado.

Esa es la situación real de tu API desde la UD1: **publica exactamente lo que tenga la clase**, y la clase la tocas por motivos que no tienen nada que ver con lo que quieres publicar.

### Un recurso no es un objeto

<p class="term">Representación</p>

Lo que viaja por la red cuando alguien pide un recurso. **No es el recurso**: es una descripción suya, en un formato concreto, con los datos que se ha decidido incluir.

Es la segunda idea de la interfaz uniforme que viste en la sesión 13, y ahora se puede decir con precisión:

<figure class="diagram">
  <figcaption>Tres cosas distintas que se confunden</figcaption>
  <ol class="flow flow--before">
    <li><strong>El recurso:</strong> «la tarea 41», una idea del dominio</li>
    <li><strong>El modelo:</strong> la clase <code>Tarea</code> en tu memoria, con lo que tu código necesita</li>
    <li><strong>La representación:</strong> el JSON que envías, con lo que el cliente necesita</li>
  </ol>
</figure>

Ahora mismo tienes las dos últimas pegadas: tu representación **es** tu modelo. Y cada vez que tocas uno, cambias el otro sin querer.

### Los tres daños concretos

No es una cuestión de pureza. Son tres problemas que vas a sufrir:

<dl class="worked">
  <dt>1 · Publicas lo que no querías</dt>
  <dd>Lo acabas de ver con <code>notaInterna</code>. Cuando en la UD9 la clase <code>Usuario</code> tenga la contraseña, el mismo mecanismo la publicará sin preguntar. No es hipotético: es una de las filtraciones de datos más habituales que existen.</dd>
  <dt>2 · No puedes tocar tu código sin romper el de otros</dt>
  <dd>Renombrar <code>titulo</code> a <code>nombre</code> es una mejora interna de dos segundos. Con el modelo publicado, es un cambio del contrato que rompe a todos los clientes. Acabas no renombrando nada por miedo, y el código se pudre.</dd>
  <dt>3 · No puedes dar respuestas distintas</dt>
  <dd>El listado quiere pocos campos y rápido; el detalle quiere todo. Con una sola clase publicada, o mandas de más en el listado o mandas de menos en el detalle.</dd>
</dl>

<div class="rule">
  <p class="rule-label">La regla, de una vez</p>
  <p><strong>Tu modelo interno es asunto tuyo. Tu contrato es un compromiso con otros.</strong> Son dos cosas con motivos de cambio distintos, y por eso tienen que ser dos clases distintas.</p>
  <p>Cuando en la UD5 el modelo pase a ser una entidad de base de datos, con relaciones y carga perezosa, publicarlo directamente pasará de ser incómodo a ser inviable. Lo separamos ahora, mientras es barato.</p>
</div>

### La primera representación

<p class="term">DTO</p>

*Data Transfer Object*. Una clase cuyo único trabajo es **transportar datos entre dos sitios**. No tiene lógica, no tiene reglas: define qué campos viajan y con qué nombres.

Crea el paquete `com.ejemplo.gestor.dto` y dentro:

```java
package com.ejemplo.gestor.dto;

public record TareaResponse(
        int id,
        String titulo,
        String prioridad,
        boolean completada) {
}
```

Cuatro líneas. Y esta vez **sí es un `record`**, al revés que el modelo. La diferencia importa y conviene entenderla:

<div class="compare-pair">
  <div>
    <p class="compare-label">El modelo · clase</p>
    <p class="compare-body">Cambia con el tiempo, se modifica campo a campo, y en la UD5 tendrá que ser una clase con constructor vacío para que JPA la construya.</p>
  </div>
  <div>
    <p class="compare-label">La respuesta · record</p>
    <p class="compare-body">Se crea, se envía y se olvida. Nadie la modifica después. Un <code>record</code> es exactamente eso: datos inmutables y sin ceremonia.</p>
  </div>
</div>

Jackson serializa un `record` igual de bien, leyendo sus componentes.

### La conversión

Alguien tiene que pasar de `Tarea` a `TareaResponse`. Hoy, un método estático en el propio DTO:

```java
public record TareaResponse(
        int id,
        String titulo,
        String prioridad,
        boolean completada) {

    public static TareaResponse desde(Tarea tarea) {
        return new TareaResponse(
                tarea.getId(),
                tarea.getTitulo(),
                tarea.getPrioridad(),
                tarea.isCompletada());
    }
}
```

Y el controlador cambia lo justo:

```java
@GetMapping("/{id}")
public ResponseEntity<TareaResponse> detalle(@PathVariable(name = "id") int id) {
    for (Tarea tarea : tareas) {
        if (tarea.getId() == id) {
            return ResponseEntity.ok(TareaResponse.desde(tarea));
        }
    }
    return ResponseEntity.notFound().build();
}
```

Para la colección, se convierte cada elemento:

```java
@GetMapping
public List<TareaResponse> lista() {
    List<TareaResponse> respuesta = new ArrayList<>();
    for (Tarea tarea : tareas) {
        respuesta.add(TareaResponse.desde(tarea));
    }
    return respuesta;
}
```

<details class="aside aside--extra">
  <summary>La versión corta, con <em>streams</em></summary>
  <p>Lo mismo se escribe en una línea:</p>
  <p><code>return tareas.stream().map(TareaResponse::desde).toList();</code></p>
  <p>Si ya manejas <em>streams</em>, úsalo. Si no, el bucle es igual de correcto y se entiende mejor: no cambies a una sintaxis que no sabrías explicar en una defensa.</p>
</details>

### La comprobación que lo demuestra todo

Esta es la prueba de que ha servido para algo, y hay que hacerla:

<p class="stage">Paso 1 · Comprueba que la nota interna ya no sale</p>

`GET /tareas`. El campo `notaInterna` ha desaparecido, sin haberlo borrado de la clase. Sigue ahí, para tu código, y ya no se publica.

<p class="stage">Paso 2 · Rompe el modelo a propósito</p>

En la clase `Tarea`, renombra el atributo `titulo` a `nombre`, y su *getter* a `getNombre()`. El proyecto dejará de compilar en un sitio: **el método de conversión**. Arréglalo ahí, cambiando `tarea.getTitulo()` por `tarea.getNombre()`.

<p class="stage">Paso 3 · Mira el JSON</p>

```json
{"id":1,"titulo":"Revisar el login","prioridad":"alta","completada":false}
```

**La clave sigue llamándose `titulo`.** Has renombrado un campo del modelo y el contrato no se ha enterado. Ejecuta la colección de Postman: sigue en verde, sin tocar una sola petición.

<div class="rule">
  <p class="rule-label">Lo que acaba de pasar</p>
  <p>El compilador te ha llevado <strong>al único sitio</strong> donde había que tocar, y los clientes no se han enterado de nada. Eso es lo que compras con la separación: <strong>libertad para cambiar por dentro</strong>.</p>
  <p>Antes de esta sesión, ese mismo renombrado habría roto silenciosamente a todo el que consumiera tu API, y no te habrías enterado hasta que alguien se quejara.</p>
</div>

Deja el modelo con `titulo`, como estaba, antes de seguir.

### Lo que esto cuesta

Sería deshonesto vendértelo como gratis:

| Ganas | Pagas |
| :--- | :--- |
| Decides exactamente qué publicas | Una clase más por cada recurso |
| Puedes refactorizar el modelo sin miedo | Código de conversión que mantener |
| Puedes dar vistas distintas del mismo recurso | Un sitio más que tocar al añadir un campo |

En una aplicación de tres clases, el coste se nota y la ganancia no. En una de treinta, es al revés, y para entonces separarlo ya es carísimo.

<div class="rule">
  <p class="rule-label">Y todavía falta la mitad</p>
  <p>Hoy solo has separado <strong>la salida</strong>. La entrada sigue recibiendo el modelo directamente con <code>@RequestBody Tarea</code>, con todo lo que eso implica: el cliente todavía puede mandarte el <code>id</code>, o campos que no debería poder tocar.</p>
  <p>Esa es la sesión 16. Y el código de conversión, que hoy has escrito a mano y que crecerá, se ordena en la 17.</p>
</div>

### Ahora tú · La representación de proyectos

1. Crea `ProyectoResponse` con los campos que **decidas** publicar, y justifica en un comentario cuál dejas fuera y por qué.
2. Cambia el controlador de proyectos para devolverlo, en el elemento y en la colección.
3. Añade a `Proyecto` un campo interno que no deba publicarse —por ejemplo `presupuestoInterno`— y comprueba que no aparece.
4. Repite el paso 2 de la comprobación: renombra un campo del modelo y verifica que la colección de Postman sigue en verde.

### Reto · Dos vistas del mismo recurso

El listado de tareas de un proyecto grande devuelve doscientas tareas con todos sus campos. Es lento y el cliente solo necesita pintar una lista con el título y el estado.

1. Crea una segunda representación, `TareaResumen`, con solo lo imprescindible.
2. Úsala en la colección `GET /tareas` y deja `TareaResponse` para el detalle `GET /tareas/{id}`.
3. Comprueba en Postman la diferencia de tamaño entre las dos respuestas.
4. Responde por escrito, y esta es la parte importante:
   * ¿Qué campos son «imprescindibles» y quién debería decidirlo, tú o quien consume la API?
   * Si el cliente necesita un campo más en el listado, ¿qué tiene que pasar? ¿Es eso un problema?
   * ¿Qué alternativa se te ocurre a tener dos clases, y qué inconveniente tendría?

La tercera pregunta no tiene una respuesta cerrada. Existen APIs que dejan al cliente elegir los campos con un parámetro, y otras que exponen dos rutas. Las dos decisiones son defendibles; lo que se evalúa es que veas que hay una decisión.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span><code>TareaResponse</code> creado y usado, con la nota interna ya fuera del JSON.</span></div>
  <div><strong>Si lo tienes</strong><span>Proyectos con su representación propia y el renombrado del modelo demostrado con la colección en verde.</span></div>
  <div><strong>Reto</strong><span>Las dos vistas funcionando y las tres preguntas respondidas.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 15</p>
  <ul class="checklist">
    <li>Ningún endpoint devuelve ya el modelo directamente.</li>
    <li>Existe un paquete <code>dto</code> con al menos dos representaciones de salida.</li>
    <li>Has demostrado que renombrar un campo del modelo no cambia el JSON.</li>
    <li>Sabes explicar la diferencia entre recurso, modelo y representación.</li>
    <li>Puedes decir qué cuesta esta separación y por qué se hace igualmente.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre un recurso, un modelo y una representación?</li>
    <li>Enumera los tres daños de publicar el modelo directamente.</li>
    <li>¿Por qué el modelo es una clase y la respuesta un <code>record</code>?</li>
    <li>¿Qué parte del contrato sigue sin separar al terminar hoy?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El recurso es la idea del dominio; el modelo es la clase que tu código necesita en memoria; la representación es el JSON concreto que envías, con los campos que hayas decidido publicar.</p>
  <p>2 · Publicas datos que no querías, no puedes cambiar el modelo sin romper a tus clientes, y no puedes dar respuestas distintas del mismo recurso.</p>
  <p>3 · El modelo cambia campo a campo y tendrá que ser construible por JPA; la respuesta se crea, se envía y nadie la modifica, así que la inmutabilidad de un <code>record</code> encaja y ahorra código.</p>
  <p>4 · La entrada. El cuerpo de las peticiones sigue llegando directamente al modelo, y eso permite al cliente mandar campos que no debería poder tocar.</p>
</details>

## Semana 6 · Lo que la API publica

## Sesión 16 · DTO de entrada y salida

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué lo que un cliente puede enviarte y lo que tú le devuelves no son la misma lista de campos.</li>
    <li><strong>2. Haz:</strong> cierra la mitad que faltaba: los DTO de entrada, uno para crear y otro para modificar.</li>
    <li><strong>3. Comprueba:</strong> el cliente ya no puede colarte un <code>id</code> ni tocar campos que no le corresponden.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué parte del contrato separaste ayer y cuál quedó sin separar?</li>
    <li>De la UD2: ¿qué pasa hoy si el cliente envía <code>{"id": 999, "titulo": "Algo"}</code> a tu creación?</li>
    <li>¿Por qué tu <code>PATCH</code> no puede modificar el campo <code>completada</code>?</li>
  </ol>
</div>

### La puerta que sigue abierta

Ayer cerraste la salida. La entrada sigue exactamente como estaba:

```java
@PostMapping
public ResponseEntity<TareaResponse> crear(@RequestBody Tarea tarea) {
```

Ese `@RequestBody Tarea` significa, literalmente: **«cliente, rellena tú mi objeto interno»**. Cualquier campo que exista en la clase `Tarea`, el cliente puede intentar enviarlo.

Hoy da lo mismo, porque `Tarea` tiene cuatro campos inocentes. Cuando tenga `creadoPor`, `fechaDeCreacion` o `esDePago`, dejará de darlo.

<div class="rule">
  <p class="rule-label">El fallo que esto produce tiene nombre</p>
  <p>Se llama <em>mass assignment</em>: el cliente envía un campo que tú no esperabas que enviara, y como el objeto lo tiene, se asigna solo.</p>
  <p>El caso clásico: un formulario de registro que manda <code>{"nombre":"Ana","email":"...","rol":"ADMIN"}</code>. Nadie ha puesto <code>rol</code> en el formulario, pero la clase <code>Usuario</code> lo tiene, y Jackson lo asigna encantado. Aparece en listas de vulnerabilidades reales todos los años.</p>
</div>

### Entrada y salida no son simétricas

Es la idea de la sesión, y se ve mejor con una tabla que con una explicación:

| Campo | ¿Puede enviarlo el cliente? | ¿Se lo devuelves? |
| :--- | :---: | :---: |
| `titulo` | Sí | Sí |
| `prioridad` | Sí | Sí |
| `id` | **No**, lo asigna el servidor | Sí |
| `fechaDeCreacion` | **No**, la pone el servidor | Sí |
| `notaInterna` | No | **No** |
| `contraseña` (en un usuario) | **Sí**, al registrarse | **Nunca** |

Mira las dos últimas filas: hay campos que **entran y no salen**, y campos que **salen y no entran**. Con una sola clase para las dos cosas, ninguna de las dos columnas se puede respetar.

<figure class="diagram">
  <figcaption>Tres clases, tres responsabilidades</figcaption>
  <ol class="flow flow--row flow--chain">
    <li><code>TareaRequest</code> · lo que acepto</li>
    <li><code>Tarea</code> · lo que manejo</li>
    <li><code>TareaResponse</code> · lo que publico</li>
  </ol>
</figure>

### El DTO de entrada es una lista blanca

```java
package com.ejemplo.gestor.dto;

public class TareaRequest {

    private String titulo;
    private String prioridad;
    private Integer proyectoId;

    public TareaRequest() {
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

    public Integer getProyectoId() {
        return proyectoId;
    }

    public void setProyectoId(Integer proyectoId) {
        this.proyectoId = proyectoId;
    }
}
```

Fíjate en lo que **no** está: no hay `id` y no hay `completada`. Y ahí está el truco elegante:

<div class="rule">
  <p class="rule-label">Lo que no existe no se puede asignar</p>
  <p>Si el cliente envía <code>{"id": 999, "titulo": "Algo"}</code>, Jackson busca un <em>setter</em> para <code>id</code> en <code>TareaRequest</code>, no lo encuentra, y —como aprendiste en la UD2— <strong>lo ignora en silencio</strong>.</p>
  <p>Ese silencio que en la UD2 era un peligro, aquí es exactamente la protección que necesitas. <strong>El DTO de entrada define qué campos existen para el cliente</strong>, y todo lo demás deja de ser un problema, sin escribir una sola comprobación.</p>
</div>

Y otro detalle que no es casual: es una **clase**, no un `record`. Jackson necesita construirla vacía y rellenarla con los *setters*, y en la sesión 18 le colgaremos anotaciones de validación campo a campo.

#### El controlador

```java
@PostMapping
public ResponseEntity<TareaResponse> crear(@RequestBody TareaRequest peticion) {
    Tarea tarea = new Tarea();
    tarea.setId(siguienteId);
    siguienteId = siguienteId + 1;
    tarea.setTitulo(peticion.getTitulo());
    tarea.setPrioridad(peticion.getPrioridad());
    tarea.setCompletada(false);
    tareas.add(tarea);

    URI ubicacion = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(tarea.getId())
            .toUri();

    return ResponseEntity.created(ubicacion).body(TareaResponse.desde(tarea));
}
```

Lee la línea `tarea.setCompletada(false)`. Es una decisión de negocio que antes estaba en manos del cliente: **una tarea recién creada nace sin completar**. Antes, si el cliente mandaba `"completada": true`, nacía terminada. Nadie lo había decidido; simplemente el campo estaba ahí.

<p class="stage">Compruébalo</p>

```json
POST /tareas
{ "id": 999, "titulo": "Colarme un id", "completada": true }
```

Responde `201`, con `id` asignado por el servidor y `completada` en `false`. Los dos campos que sobraban se han ignorado, sin una sola línea de comprobación.

### El DTO que arregla el `PATCH`

En la UD2 anotaste dos limitaciones del `PATCH`: no podía tocar `completada`, porque un `boolean` primitivo no distingue «no enviado» de `false`. Ahora tiene arreglo:

```java
public class TareaPatchRequest {

    private String titulo;
    private String prioridad;
    private Boolean completada;

    // constructor vacío, getters y setters
}
```

`Boolean`, con mayúscula. **El envoltorio sí puede valer `null`**, así que ahora sí se distingue:

| Cuerpo enviado | `completada` vale | Significa |
| :--- | :---: | :--- |
| `{"titulo":"X"}` | `null` | No me lo han enviado: no lo toques |
| `{"completada":true}` | `true` | Pónmelo a verdadero |
| `{"completada":false}` | `false` | Pónmelo a falso |

```java
@PatchMapping("/{id}")
public ResponseEntity<TareaResponse> modificar(
        @PathVariable(name = "id") int id,
        @RequestBody TareaPatchRequest cambios) {

    for (Tarea tarea : tareas) {
        if (tarea.getId() == id) {
            if (cambios.getTitulo() != null) {
                tarea.setTitulo(cambios.getTitulo());
            }
            if (cambios.getPrioridad() != null) {
                tarea.setPrioridad(cambios.getPrioridad());
            }
            if (cambios.getCompletada() != null) {
                tarea.setCompletada(cambios.getCompletada());
            }
            return ResponseEntity.ok(TareaResponse.desde(tarea));
        }
    }
    return ResponseEntity.notFound().build();
}
```

<div class="rule">
  <p class="rule-label">Una limitación se ha resuelto, la otra no</p>
  <p>Ya puedes marcar y desmarcar una tarea. Lo que sigue sin poderse es <strong>vaciar un campo a propósito</strong>: <code>{"prioridad": null}</code> llega como <code>null</code> igual que si no lo hubieras enviado.</p>
  <p>Se resuelve, y la solución habitual es declarar los campos como <code>Optional&lt;String&gt;</code>: entonces «no enviado» llega como <code>null</code> y «enviado como nulo» llega como <code>Optional.empty()</code>. No lo vamos a implementar, pero <strong>sabe que existe y por qué hace falta</strong>: es una pregunta de entrevista frecuente.</p>
</div>

### Tres clases por recurso, ¿no es demasiado?

Es la objeción sensata, y la respuesta honesta es «depende».

<div class="compare-pair">
  <div>
    <p class="compare-label">Cuándo sobra</p>
    <p class="compare-body">Un recurso pequeño, interno, con los mismos campos de entrada y de salida y sin nada que ocultar. Ahí tres clases son ceremonia.</p>
  </div>
  <div>
    <p class="compare-label">Cuándo salva</p>
    <p class="compare-body">En cuanto haya un campo que el cliente no deba tocar, uno que no deba ver, o el modelo pase a ser una entidad de base de datos. Es decir: casi siempre, y siempre en la UD5.</p>
  </div>
</div>

En este módulo se hacen las tres **siempre**, por el mismo motivo por el que en la UD1 se escribía el HTML a mano antes de usar Emmet: primero se aprende a hacerlo, y después se decide cuándo saltárselo.

### Ahora tú · La entrada de proyectos

1. Crea `ProyectoRequest` con solo lo que un cliente puede enviar al crear un proyecto.
2. Crea `ProyectoPatchRequest` con tipos envoltorio.
3. Cambia el controlador para usarlos en `POST`, `PUT` y `PATCH`.
4. Comprueba con Postman que un `POST` con un `id` y con un campo interno responde `201` e ignora los dos.
5. Anota en `DECISIONES.md` qué campos dejaste fuera de la entrada y por qué.

### Reto · La API de usuarios

Diseña, sin escribir código todavía, las tres clases de un recurso `Usuario` con estos campos internos:

```text
id, nombre, email, contraseñaCifrada, rol, fechaDeAlta, ultimoAcceso, activo
```

Requisitos del negocio:

* Al registrarse, el usuario envía nombre, email y contraseña en claro.
* El rol lo asigna siempre un administrador, nunca el propio usuario.
* Nadie, jamás, puede leer la contraseña por la API.
* El perfil público muestra nombre y fecha de alta.
* El propio usuario, al consultarse a sí mismo, ve además su email y su último acceso.

Entrega una tabla con **una fila por campo** y una columna por clase, marcando dónde aparece cada uno:

| Campo | `UsuarioRequest` | `Usuario` | `UsuarioResponse` | `UsuarioPublico` |
| :--- | :---: | :---: | :---: | :---: |

Y responde a dos preguntas:

1. Hay un campo que aparece en la entrada y **no existe** en el modelo con ese nombre. ¿Cuál, y qué pasa con él entre una clase y otra?
2. ¿Qué habría ocurrido con el campo `rol` si hubieras usado el modelo como cuerpo de la petición?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span><code>TareaRequest</code> y <code>TareaPatchRequest</code> en uso, con el <code>id</code> del cliente ya ignorado.</span></div>
  <div><strong>Si lo tienes</strong><span>Proyectos con sus dos DTO de entrada y el <code>PATCH</code> capaz de marcar y desmarcar.</span></div>
  <div><strong>Reto</strong><span>Las cuatro clases de <code>Usuario</code> repartidas campo a campo, con las dos preguntas respondidas.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 16</p>
  <ul class="checklist">
    <li>Ningún <code>@RequestBody</code> recibe ya una clase del modelo.</li>
    <li>Un cliente que envía un <code>id</code> o un campo interno recibe <code>201</code> y esos campos se ignoran.</li>
    <li>Tu <code>PATCH</code> distingue «no enviado» de <code>false</code> gracias a los tipos envoltorio.</li>
    <li>Sabes explicar qué es <em>mass assignment</em> y por qué el DTO de entrada lo previene.</li>
    <li>Puedes nombrar un campo que entra y no sale, y otro que sale y no entra.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué un DTO de entrada funciona como lista blanca sin escribir comprobaciones?</li>
    <li>¿Por qué <code>Boolean</code> y no <code>boolean</code> en un DTO de modificación?</li>
    <li>Pon un ejemplo de campo que entra y no sale, y uno que sale y no entra.</li>
    <li>¿Qué limitación del <code>PATCH</code> sigue sin resolverse y cómo se resolvería?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque Jackson solo asigna las claves para las que encuentra un <em>setter</em>. Si el campo no existe en la clase de entrada, se ignora en silencio, así que la propia clase decide qué puede enviar el cliente.</p>
  <p>2 · Porque el primitivo no puede valer <code>null</code> y siempre llega como <code>false</code>, de modo que no se distingue «no me lo han enviado» de «pónmelo a falso». El envoltorio sí admite <code>null</code>.</p>
  <p>3 · Entra y no sale: la contraseña. Sale y no entra: el <code>id</code>, o la fecha de creación.</p>
  <p>4 · Vaciar un campo a propósito. Se resolvería declarándolo como <code>Optional</code>, que distingue el campo ausente del campo enviado con valor nulo.</p>
</details>

## Sesión 17 · Del JSON al modelo y del modelo al JSON

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué la conversión repartida por el controlador acaba publicando el mismo recurso de dos formas distintas.</li>
    <li><strong>2. Haz:</strong> reúne toda la conversión en un único sitio y deja el controlador legible.</li>
    <li><strong>3. Comprueba:</strong> una prueba de ida y vuelta demuestra que ningún campo se pierde por el camino.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántos sitios distintos de tu código convierten hoy entre DTO y modelo? Cuéntalos de verdad.</li>
    <li>¿Qué clase conoce a cuál: sabe <code>Tarea</code> que existe <code>TareaResponse</code>?</li>
    <li>Añades un campo nuevo al recurso. ¿Cuántos archivos tienes que tocar?</li>
  </ol>
</div>

### Cuenta los sitios

Abre tu controlador de tareas y busca todas las líneas que pasan datos de una clase a otra. Vas a encontrar tres zonas:

<figure class="diagram">
  <figcaption>Dónde está hoy la conversión</figcaption>
  <ol class="flow flow--before">
    <li>En <code>TareaResponse.desde()</code>, un método estático dentro del DTO</li>
    <li>En el <code>POST</code>, construyendo un <code>Tarea</code> a mano campo a campo</li>
    <li>En el <code>PATCH</code>, con una cadena de <code>if</code> que asigna uno a uno</li>
  </ol>
</figure>

Tres estilos distintos para el mismo trabajo, en dos archivos. Y ninguno lo eligió nadie: han ido apareciendo.

### El fallo que provoca, demostrado

No es un problema estético. Vamos a producirlo a propósito para que lo veas.

<p class="stage">Paso 1 · Añade un campo al recurso</p>

Añade `proyectoId` a `Tarea` y a `TareaResponse`, con sus accesos.

<p class="stage">Paso 2 · Actualiza la conversión… en un sitio</p>

Actualiza `TareaResponse.desde()` para que lo incluya. Y ahora **haz como si se te olvidara** el listado: deja el `GET /tareas` construyendo la respuesta a mano, como quizá lo tengas:

```java
@GetMapping
public List<TareaResponse> lista() {
    List<TareaResponse> respuesta = new ArrayList<>();
    for (Tarea tarea : tareas) {
        respuesta.add(new TareaResponse(
                tarea.getId(),
                tarea.getTitulo(),
                tarea.getPrioridad(),
                tarea.isCompletada()));
    }
    return respuesta;
}
```

<p class="stage">Paso 3 · Compara las dos respuestas</p>

```json
GET /tareas      → [{"id":1,"titulo":"Revisar","prioridad":"alta","completada":false}]
GET /tareas/1    → {"id":1,"titulo":"Revisar","prioridad":"alta","completada":false,"proyectoId":7}
```

**El mismo recurso, dos representaciones distintas.** El cliente que pinta la lista no ve el proyecto; el que abre el detalle sí. Y nada falla, nada avisa: los dos endpoints responden `200`.

<div class="rule">
  <p class="rule-label">Por qué este fallo es de los peores</p>
  <p>No lo detecta el compilador, no lo detecta el linter y no lo detecta tu colección, porque las dos respuestas son válidas. Lo detecta un cliente, semanas después, preguntando «¿por qué a veces viene el proyecto y a veces no?».</p>
  <p>Y la causa no es un descuido: es que <strong>había dos sitios donde hacer el mismo cambio</strong> y solo uno era obligatorio.</p>
</div>

### La regla · un solo sitio

<p class="term">Mapper</p>

Una clase cuyo único trabajo es convertir entre representaciones y modelo. Ni valida, ni guarda, ni decide: traduce. Y es **el único sitio del proyecto donde se traduce**.

Crea el paquete `com.ejemplo.gestor.mapper`:

```java
package com.ejemplo.gestor.mapper;

import com.ejemplo.gestor.dto.TareaPatchRequest;
import com.ejemplo.gestor.dto.TareaRequest;
import com.ejemplo.gestor.dto.TareaResponse;
import com.ejemplo.gestor.model.Tarea;

import java.util.ArrayList;
import java.util.List;

public class TareaMapper {

    private TareaMapper() {
    }

    /** De lo que envía el cliente a un modelo nuevo. El id lo pone quien llame. */
    public static Tarea aModelo(TareaRequest peticion) {
        Tarea tarea = new Tarea();
        tarea.setTitulo(peticion.getTitulo());
        tarea.setPrioridad(peticion.getPrioridad());
        tarea.setProyectoId(peticion.getProyectoId());
        tarea.setCompletada(false);
        return tarea;
    }

    /** Del modelo a lo que publica la API. */
    public static TareaResponse aRespuesta(Tarea tarea) {
        return new TareaResponse(
                tarea.getId(),
                tarea.getTitulo(),
                tarea.getPrioridad(),
                tarea.isCompletada(),
                tarea.getProyectoId());
    }

    public static List<TareaResponse> aRespuestas(List<Tarea> tareas) {
        List<TareaResponse> respuesta = new ArrayList<>();
        for (Tarea tarea : tareas) {
            respuesta.add(aRespuesta(tarea));
        }
        return respuesta;
    }

    /** Aplica sobre una tarea existente solo los campos que traiga el cambio. */
    public static void aplicar(TareaPatchRequest cambios, Tarea tarea) {
        if (cambios.getTitulo() != null) {
            tarea.setTitulo(cambios.getTitulo());
        }
        if (cambios.getPrioridad() != null) {
            tarea.setPrioridad(cambios.getPrioridad());
        }
        if (cambios.getCompletada() != null) {
            tarea.setCompletada(cambios.getCompletada());
        }
    }
}
```

<dl class="worked">
  <dt>Por qué una clase aparte y no un método en el DTO</dt>
  <dd>Porque entonces el DTO tendría que conocer el modelo. Los DTO describen el contrato con el exterior y deben poder cambiar sin arrastrar nada. El mapper es el único que conoce a los dos, y esa es precisamente su función.</dd>
  <dt>Por qué el constructor privado</dt>
  <dd>Es una clase de utilidad: todos sus métodos son estáticos y no tiene sentido crear una instancia. El constructor privado lo deja claro y evita que alguien escriba <code>new TareaMapper()</code>.</dd>
  <dt>Por qué <code>aplicar</code> no devuelve nada</dt>
  <dd>Porque no crea una tarea: <strong>modifica una que ya existe</strong>. El nombre y la firma dicen lo mismo que hace, y así nadie espera un objeto nuevo.</dd>
  <dt>Por qué estático, de momento</dt>
  <dd>Porque todavía no hemos visto inyección de dependencias. En la UD4 esta clase pasará a ser un componente que Spring construye e inyecta, y entonces entenderás qué se gana. Hoy, estático y funcionando.</dd>
</dl>

### La dirección de las dependencias

Esto importa más de lo que parece, y es una pregunta habitual en una defensa:

<figure class="diagram">
  <figcaption>Quién conoce a quién</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>DTO · no conoce a nadie</li>
    <li>Mapper · conoce a los dos</li>
    <li>Modelo · no conoce a nadie</li>
  </ol>
</figure>

El modelo no sabe que existe una API. Los DTO no saben que existe un modelo. Solo el mapper sabe de ambos, y por eso **es el único archivo que hay que tocar cuando cambia la traducción**.

Si mañana publicas la misma aplicación por otro canal, el modelo se reutiliza entero. Si mañana cambias de base de datos, los DTO no se enteran.

### El controlador, después

```java
@GetMapping
public List<TareaResponse> lista() {
    return TareaMapper.aRespuestas(tareas);
}

@GetMapping("/{id}")
public ResponseEntity<TareaResponse> detalle(@PathVariable(name = "id") int id) {
    Tarea tarea = buscar(id);
    if (tarea == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(TareaMapper.aRespuesta(tarea));
}

@PostMapping
public ResponseEntity<TareaResponse> crear(@RequestBody TareaRequest peticion) {
    Tarea tarea = TareaMapper.aModelo(peticion);
    tarea.setId(siguienteId);
    siguienteId = siguienteId + 1;
    tareas.add(tarea);

    URI ubicacion = ServletUriComponentsBuilder
            .fromCurrentRequest().path("/{id}")
            .buildAndExpand(tarea.getId()).toUri();

    return ResponseEntity.created(ubicacion).body(TareaMapper.aRespuesta(tarea));
}
```

Compáralo con el de ayer. **Ahora el controlador se lee como el contrato de la API**: qué ruta, qué recibe, qué código devuelve. La traducción ha desaparecido de la vista, y con ella la posibilidad de hacerla dos veces distintas.

Ese método `buscar(id)` privado que aparece ahí es tuyo: sácalo también, porque lo estabas repitiendo en cuatro sitios.

<details class="aside aside--extra">
  <summary>¿No hay librerías que hagan esto solas?</summary>
  <p>Sí. <strong>MapStruct</strong> genera el mapper a partir de una interfaz, en tiempo de compilación; <strong>ModelMapper</strong> lo hace en ejecución por reflexión. En una aplicación grande ahorran mucho código repetitivo.</p>
  <p>Aquí no las usamos por dos razones. La primera es que un mapper generado esconde justo la decisión que estás aprendiendo a tomar: qué campo va a dónde y qué se queda fuera. La segunda es que cuando algo falla —y falla—, hay que saber leer el código que se generó.</p>
  <p>Sabe que existen. Úsalas cuando escribir mappers a mano te resulte aburrido, que es la señal de que ya entiendes lo que hacen.</p>
</details>

### La prueba de ida y vuelta

Un mapper roto no lanza excepciones: **pierde datos en silencio**. Si te olvidas de una línea, ese campo llega vacío y nadie protesta.

La forma de detectarlo es recorrer el circuito completo y comparar los extremos. Con las herramientas que tienes:

<p class="stage">Paso 1 · Envía todo lo que la API acepta</p>

```json
POST /tareas
{ "titulo": "Revisar el login", "prioridad": "alta", "proyectoId": 7 }
```

<p class="stage">Paso 2 · Recupera lo creado</p>

Usa la cabecera `Location`, o `{{tareaId}}` si ya lo tienes encadenado en la colección.

<p class="stage">Paso 3 · Comprueba campo a campo</p>

Añade a esa petición de la colección una comprobación por cada campo enviado:

```javascript
pm.test("El título sobrevive al viaje", function () {
    pm.expect(pm.response.json().titulo).to.eql("Revisar el login");
});

pm.test("El proyecto sobrevive al viaje", function () {
    pm.expect(pm.response.json().proyectoId).to.eql(7);
});
```

<div class="rule">
  <p class="rule-label">Qué acabas de construir</p>
  <p>Una prueba que recorre <strong>JSON → DTO de entrada → modelo → DTO de salida → JSON</strong> y comprueba que lo que entró es lo que sale. Si mañana alguien añade un campo al mapper y olvida una de las direcciones, esta prueba falla.</p>
  <p>Es la primera prueba de tu proyecto que comprueba una <em>transformación</em> y no un código de estado. En la UD4 esto mismo se escribirá en Java y se ejecutará sin Postman, pero la idea no cambiará.</p>
</div>

### Ahora tú · El mapper de proyectos

1. Crea `ProyectoMapper` con los cuatro métodos equivalentes.
2. Vacía el controlador de proyectos de toda conversión.
3. Extrae también su `buscar(id)` privado si lo estabas repitiendo.
4. Añade a la colección la prueba de ida y vuelta para proyectos, con una comprobación por campo.
5. Comprueba que la colección entera sigue en verde.

### Reto · Encuentra el campo perdido

Haz este ejercicio en pareja, y hazlo en las dos direcciones.

1. En el proyecto de tu compañero, **borra una sola línea** de su mapper: una asignación de campo, la que quieras. Compila y arranca.
2. Que ejecute su colección tal como está.
3. Si sale verde, **su colección tiene un agujero**: apunta cuál es el campo y qué prueba le faltaba.
4. Que la amplíe hasta detectarlo, y que después restaure la línea y compruebe que vuelve a verde.

Y responde por escrito:

* ¿Cuántos campos de tu API están hoy comprobados de verdad, y cuántos solo aparecen en respuestas que nadie verifica?
* ¿Qué te costaría más: mantener la prueba de ida y vuelta al añadir cada campo, o descubrir el fallo en producción?
* ¿Habría alguna forma de que el fallo se detectara sin escribir una comprobación por campo?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span><code>TareaMapper</code> creado y el controlador sin una sola línea de conversión.</span></div>
  <div><strong>Si lo tienes</strong><span>Proyectos con su mapper y la prueba de ida y vuelta comprobando campo a campo.</span></div>
  <div><strong>Reto</strong><span>El campo perdido del compañero detectado y la colección ampliada hasta cazarlo.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 17</p>
  <ul class="checklist">
    <li>Existe un paquete <code>mapper</code> y es el único sitio del proyecto donde se traduce.</li>
    <li>Ningún controlador construye un DTO ni un modelo campo a campo.</li>
    <li>El listado y el detalle devuelven exactamente los mismos campos del mismo recurso.</li>
    <li>La colección comprueba el viaje completo de al menos un recurso, campo a campo.</li>
    <li>Sabes explicar por qué el DTO no conoce el modelo y el mapper conoce a los dos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué fallo concreto produce tener la conversión en dos sitios?</li>
    <li>¿Por qué el mapper no es un método dentro del DTO?</li>
    <li>¿Por qué <code>aplicar</code> no devuelve un objeto nuevo?</li>
    <li>¿Qué comprueba una prueba de ida y vuelta que no comprueba un código de estado?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que un cambio se aplique solo en uno de los dos, y el mismo recurso acabe publicándose de dos formas distintas según el endpoint. Las dos respuestas son válidas, así que nada lo detecta.</p>
  <p>2 · Porque obligaría al DTO a conocer el modelo. El DTO describe el contrato exterior y debe poder cambiar por su cuenta; el mapper es el único que conoce ambos lados.</p>
  <p>3 · Porque modifica una tarea que ya existe en lugar de crear una nueva. La firma dice lo que hace y evita que alguien espere un objeto distinto de vuelta.</p>
  <p>4 · Que los datos sobreviven a la transformación. Un <code>200</code> solo dice que la petición se atendió; no dice que los campos hayan llegado ni que valgan lo que valían.</p>
</details>

## Sesión 18 · Validación de entrada

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué la validación del navegador no cuenta y dónde tiene que estar la de verdad.</li>
    <li><strong>2. Haz:</strong> añade Bean Validation a los DTO de entrada y comprueba que rechaza antes de ejecutar nada.</li>
    <li><strong>3. Comprueba:</strong> una tarea sin título ya no se crea, y la respuesta dice qué campo falla.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Desde la UD2: ¿qué crea hoy tu API si le envías <code>{}</code> a la creación de una tarea?</li>
    <li>¿En qué clase habría que poner las reglas de «qué es una tarea válida», en el modelo o en el DTO de entrada?</li>
    <li>¿Qué diferencia hay entre un cuerpo inválido y uno incompleto?</li>
  </ol>
</div>

### El formulario del cliente no es una defensa

Un cliente bien hecho comprueba los datos antes de enviarlos: marca en rojo el campo vacío y no deja pulsar el botón. Es buena práctica y mejora la experiencia.

Y **no protege absolutamente de nada**, porque esa comprobación vive en la máquina de quien la quiera saltar. Con lo que ya sabes hacer desde la UD1, cualquiera puede abrir Postman y enviar el cuerpo que le dé la gana directamente a tu servidor, sin pasar por ninguna interfaz.

<figure class="diagram">
  <figcaption>Por dónde puede llegar una petición a tu API</figcaption>
  <ol class="flow flow--before">
    <li>Desde el formulario de la aplicación, con sus comprobaciones</li>
    <li>Desde Postman, sin ninguna</li>
    <li>Desde un script de otra persona, sin ninguna</li>
    <li class="is-error">Desde alguien que quiere ver qué pasa si envía basura</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">La regla que no se negocia</p>
  <p><strong>La validación del cliente es comodidad. La validación del servidor es la única que existe.</strong></p>
  <p>Que estén las dos no es duplicar trabajo: una evita un viaje innecesario y mejora la experiencia; la otra protege los datos. Si solo puedes tener una, es la del servidor.</p>
</div>

### Instala la dependencia, porque no viene puesta

Esto sorprende a mucha gente: la validación **no está incluida** en `spring-boot-starter-web`. Hay que pedirla.

En el `pom.xml`, dentro de `<dependencies>`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

Sin versión: la pone el padre, como aprendiste en la UD1. Recarga las dependencias de Maven en tu IDE antes de seguir.

<div class="rule">
  <p class="rule-label">Si las anotaciones no hacen nada, es esto</p>
  <p>El síntoma es exacto y desconcertante: el proyecto compila, las anotaciones no dan error, la aplicación arranca <strong>y la validación se ignora por completo</strong>. Un cuerpo vacío se sigue aceptando.</p>
  <p>Cuando eso pase, lo primero que se mira es si la dependencia está en el <code>pom.xml</code> y si Maven la ha descargado.</p>
</div>

### Las reglas van en el DTO de entrada

Y no en el modelo. El motivo enlaza con las dos sesiones anteriores:

<div class="compare-pair">
  <div>
    <p class="compare-label">En el modelo · no</p>
    <p class="compare-body">El modelo lo construye también tu propio código, con datos que ya son válidos. Validar ahí mezcla las reglas del contrato exterior con las de tu dominio.</p>
  </div>
  <div>
    <p class="compare-label">En el DTO de entrada · sí</p>
    <p class="compare-body">Es exactamente la frontera: lo que llega de fuera y no es de fiar. Las reglas quedan junto a la clase que declara qué acepta la API.</p>
  </div>
</div>

```java
package com.ejemplo.gestor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class TareaRequest {

    @NotBlank
    @Size(min = 3, max = 120)
    private String titulo;

    @NotNull
    @Pattern(regexp = "baja|media|alta")
    private String prioridad;

    @NotNull
    @Positive
    private Integer proyectoId;

    // constructor vacío, getters y setters
}
```

Fíjate en el paquete: `jakarta.validation`, no `javax`. Si el autocompletado te ofrece `javax`, es de una versión anterior y no funcionará con Spring Boot 3.

#### Las restricciones que cubren casi todo

| Anotación | Comprueba |
| :--- | :--- |
| `@NotNull` | Que el campo llegue, aunque venga vacío |
| `@NotBlank` | Que llegue y no sea vacío ni solo espacios. Solo para texto |
| `@NotEmpty` | Que llegue y no esté vacío. Para texto y colecciones |
| `@Size(min, max)` | Longitud de un texto o tamaño de una colección |
| `@Min` / `@Max` | Valor mínimo y máximo de un número |
| `@Positive` | Que un número sea mayor que cero |
| `@Email` | Que el texto tenga forma de correo |
| `@Pattern(regexp)` | Que el texto encaje con una expresión regular |
| `@Past` / `@Future` | Que una fecha sea anterior o posterior a hoy |

#### Las tres que se confunden siempre

| Valor recibido | `@NotNull` | `@NotEmpty` | `@NotBlank` |
| :--- | :---: | :---: | :---: |
| Campo ausente, o `null` | Falla | Falla | Falla |
| `""` | Pasa | Falla | Falla |
| `"   "` | Pasa | Pasa | **Falla** |
| `"hola"` | Pasa | Pasa | Pasa |

Para un texto obligatorio quieres casi siempre `@NotBlank`: es la única que impide que alguien registre una tarea titulada con tres espacios.

<div class="rule">
  <p class="rule-label">Otra razón para los tipos envoltorio</p>
  <p>Poner <code>@NotNull</code> sobre un <code>int</code> no sirve de nada: un primitivo nunca es nulo, así que un campo ausente llega como <code>0</code> y la validación pasa.</p>
  <p>Ya usabas <code>Integer</code> y <code>Boolean</code> en los DTO por lo del <code>PATCH</code>. Esta es la segunda razón, y es igual de importante.</p>
</div>

### Activarla · `@Valid`

Las anotaciones por sí solas no hacen nada. Hay que pedir que se comprueben, en el controlador:

```java
@PostMapping
public ResponseEntity<TareaResponse> crear(@Valid @RequestBody TareaRequest peticion) {
    ...
}
```

Una palabra. `jakarta.validation.Valid`.

<p class="stage">Compruébalo</p>

```json
POST /tareas
{ "titulo": "", "prioridad": "urgentísima" }
```

```json
{
  "timestamp": "2026-09-02T10:14:22.831+00:00",
  "status": 400,
  "error": "Bad Request",
  "path": "/tareas"
}
```

`400`, y la tarea no se ha creado. Mira además la consola: ahí sí está el detalle completo, con el campo y la restricción que ha fallado.

### Valida antes de ejecutar, como todo lo demás

Es el mismo mecanismo que ya has visto dos veces: en la UD1 con un `@RequestParam` que faltaba, y en la UD2 con un cuerpo que no se podía leer.

<figure class="diagram">
  <figcaption>Dónde encaja la validación en el recorrido</figcaption>
  <ol class="flow flow--before">
    <li>Se busca el método que atiende la ruta</li>
    <li>Jackson convierte el cuerpo en el DTO de entrada</li>
    <li><strong>Se comprueban las restricciones del DTO</strong></li>
    <li class="is-error">Si alguna falla, <code>400</code> y aquí se acaba</li>
    <li>Si todas pasan, se ejecuta tu método</li>
  </ol>
</figure>

La consecuencia práctica es la buena noticia del día: **dentro de tu método ya no hace falta comprobar nada de esto**. Si el código se está ejecutando, el título no está vacío y la prioridad es una de las tres. No escribas `if (titulo == null)` en el controlador: eso ya está resuelto antes, y en un solo sitio.

### El problema que queda para la sesión 20

Vuelve a mirar ese `400`. Ponte en el lugar de quien consume tu API:

```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "path": "/tareas" }
```

¿Qué campo estaba mal? ¿El título? ¿La prioridad? ¿Los dos? ¿Qué valores acepta `prioridad`?

**No hay forma de saberlo.** La información existe —está entera en tu consola— y no se la estás dando a quien la necesita. Un cliente que recibe esto solo puede probar a ciegas.

Eso es la sesión 20. Hoy la validación ya protege tus datos; el mensaje todavía no ayuda a nadie.

<details class="aside aside--extra">
  <summary>Validar parámetros que no van en el cuerpo</summary>
  <p>Las restricciones también valen sobre un <code>@RequestParam</code> o un <code>@PathVariable</code>, pero hace falta un paso más: anotar la <strong>clase</strong> del controlador con <code>@Validated</code>, de <code>org.springframework.validation.annotation</code>.</p>
  <p>Sin esa anotación de clase, un <code>@Positive</code> sobre un parámetro se ignora sin avisar. Es otro caso de «no da error y no hace nada», así que conviene reconocerlo.</p>
</details>

### Práctica guiada · La tabla de rechazos

Con `@Valid` puesto, envía estos cuerpos a `POST /tareas` y **predice antes** el código y el motivo:

| # | Cuerpo | Predice |
| :---: | :--- | :---: |
| 1 | `{"titulo":"Revisar el login","prioridad":"alta","proyectoId":7}` | |
| 2 | `{}` | |
| 3 | `{"titulo":"","prioridad":"alta","proyectoId":7}` | |
| 4 | `{"titulo":"   ","prioridad":"alta","proyectoId":7}` | |
| 5 | `{"titulo":"ab","prioridad":"alta","proyectoId":7}` | |
| 6 | `{"titulo":"Revisar","prioridad":"URGENTE","proyectoId":7}` | |
| 7 | `{"titulo":"Revisar","prioridad":"alta","proyectoId":-3}` | |
| 8 | `{"titulo":"Revisar","prioridad":"alta"}` | |
| 9 | `{"titulo":"Revisar","prioridad":"alta","proyectoId":"siete"}` | |

Las dos interesantes son la **4** y la **9**:

* La 4 solo la caza `@NotBlank`. Con `@NotEmpty` habrías creado una tarea titulada con tres espacios.
* La 9 devuelve `400` **igual que las demás, pero por otro motivo completamente distinto**: falla antes, al convertir el JSON, porque `"siete"` no es un número. Ni siquiera llega a validarse. Compruébalo en la consola: la excepción no es la misma.

### Ahora tú · Las reglas de proyectos

1. Añade restricciones a `ProyectoRequest`: el nombre obligatorio y entre 3 y 80 caracteres, la descripción opcional pero como máximo 500.
2. Pon `@Valid` en el `POST` y en el `PUT`.
3. Decide qué hacer con `ProyectoPatchRequest` y **justifícalo**: si un campo es opcional en un `PATCH`, ¿puede llevar `@NotBlank`? ¿Qué pasaría si lo lleva?
4. Añade a la colección tres peticiones de rechazo con su comprobación de `400`.

La pregunta 3 es la que se piensa. Un `PATCH` recibe campos ausentes por definición, así que `@NotNull` ahí sería un error. Pero `@Size` sí tiene sentido: *si* llega, que tenga la longitud correcta.

### Reto · Escribe el contrato de validación

Antes de tocar más código, escribe la tabla de reglas de **todos** los recursos de tu API. Este es el formato:

| Recurso | Campo | Obligatorio en crear | Reglas | ¿Modificable? |
| :--- | :--- | :---: | :--- | :---: |

Después responde:

1. Hay reglas que **no se pueden expresar** con las anotaciones de hoy. Por ejemplo: «el `proyectoId` debe corresponder a un proyecto que exista», o «la fecha de fin no puede ser anterior a la de inicio». Localiza al menos dos en tu API y explica por qué se les resisten.
2. Para cada una de esas dos, ¿dónde tendría que comprobarse entonces? Piensa en quién sabe la respuesta: ¿la clase del DTO, o algo que tenga acceso a la lista de proyectos?
3. Tu API acepta hoy una tarea de un proyecto inexistente. ¿Es eso un `400` o un `404`? Argumenta las dos posturas y quédate con una.

La pregunta 1 abre la sesión siguiente, y la 2 apunta a la UD4. La 3 no tiene respuesta única y se defiende.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La dependencia instalada, <code>TareaRequest</code> validado y la tabla de nueve rechazos comprobada.</span></div>
  <div><strong>Si lo tienes</strong><span>Proyectos validados, con la decisión sobre el <code>PATCH</code> justificada y tres rechazos en la colección.</span></div>
  <div><strong>Reto</strong><span>El contrato de validación completo y las dos reglas que las anotaciones no alcanzan, identificadas y situadas.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 18</p>
  <ul class="checklist">
    <li><code>spring-boot-starter-validation</code> está en el <code>pom.xml</code>.</li>
    <li>Las restricciones están en los DTO de entrada, no en el modelo.</li>
    <li>Un cuerpo vacío responde <code>400</code> y no crea nada.</li>
    <li>Sabes distinguir <code>@NotNull</code>, <code>@NotEmpty</code> y <code>@NotBlank</code> con un ejemplo de cada.</li>
    <li>Tu controlador no comprueba a mano nada que ya compruebe una anotación.</li>
    <li>Sabes decir por qué el <code>400</code> actual todavía no le sirve a quien consume la API.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué la validación del navegador no protege nada?</li>
    <li>Pones las anotaciones y no pasa nada. ¿Qué compruebas primero?</li>
    <li>¿Qué valor pasa <code>@NotEmpty</code> y falla <code>@NotBlank</code>?</li>
    <li>¿Por qué <code>@NotNull</code> sobre un <code>int</code> no sirve?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque se ejecuta en la máquina de quien la quiera saltar. Cualquiera puede enviar el cuerpo directamente al servidor sin pasar por la interfaz.</p>
  <p>2 · Que <code>spring-boot-starter-validation</code> esté en el <code>pom.xml</code> y descargado. Sin esa dependencia todo compila y las anotaciones se ignoran en silencio. Después, que el parámetro lleve <code>@Valid</code>.</p>
  <p>3 · Un texto de solo espacios, como <code>"   "</code>: no está vacío, pero no contiene nada útil.</p>
  <p>4 · Porque un primitivo no puede ser nulo: un campo ausente llega como <code>0</code> y la comprobación pasa. Hay que declararlo como <code>Integer</code>.</p>
</details>

## Semana 7 · Entrada fiable y errores honestos

## Sesión 19 · Reglas propias y mensajes de validación útiles

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> un «400 Bad Request» sin detalle obliga a quien consume la API a adivinar qué campo ha fallado.</li>
    <li><strong>Construye:</strong> un conjunto de validaciones con mensajes accionables y su caso de prueba.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **escribir restricciones que expresen reglas del dominio y mensajes que digan qué corregir**.

### 2. El problema

Un «400 Bad Request» sin detalle obliga a quien consume la API a adivinar qué campo ha fallado.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un conjunto de validaciones con mensajes accionables y su caso de prueba.</li>
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

## Sesión 20 · Errores coherentes de API

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> tratar cada fallo dentro de cada endpoint produce respuestas duplicadas, variables y difíciles de consumir.</li>
    <li><strong>Construye:</strong> un formato común para recurso inexistente, conflicto y validación fallida.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **centralizar errores mediante excepciones propias y @RestControllerAdvice**.

### 2. El problema

Tratar cada fallo dentro de cada endpoint produce respuestas duplicadas, variables y difíciles de consumir.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un formato común para recurso inexistente, conflicto y validación fallida.</li>
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

## Sesión 21 · Rediseño completo de la API del gestor

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> endpoints correctos de forma aislada pueden formar una API incoherente en conjunto.</li>
    <li><strong>Construye:</strong> una API de proyectos e incidencias validada mediante una colección de peticiones.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **cerrar y comprobar el contrato completo antes de considerar terminada la implementación**.

### 2. El problema

Endpoints correctos de forma aislada pueden formar una API incoherente en conjunto.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una API de proyectos e incidencias validada mediante una colección de peticiones.</li>
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
    <li>Distinguir una API HTTP cualquiera de una API orientada a recursos.</li>
    <li>Nombrar recursos y URLs sin meter verbos ni acciones en la ruta.</li>
    <li>Separar el modelo interno de lo que la API publica mediante DTO.</li>
    <li>Validar la entrada antes de que llegue a la lógica y explicar qué falla.</li>
    <li>Devolver errores con un formato único, predecible y útil para quien consume.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

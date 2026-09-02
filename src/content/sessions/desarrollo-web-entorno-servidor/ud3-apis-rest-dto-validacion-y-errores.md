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
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> usar la misma clase para recibir, procesar y responder filtra detalles internos y permite campos que el cliente no debería controlar.</li>
    <li><strong>Construye:</strong> DTO diferentes para crear y consultar un usuario o proyecto.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **separar los datos que acepta el backend de los que decide devolver**.

### 2. El problema

Usar la misma clase para recibir, procesar y responder filtra detalles internos y permite campos que el cliente no debería controlar.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido DTO diferentes para crear y consultar un usuario o proyecto.</li>
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

## Sesión 17 · Del JSON al modelo y del modelo al JSON

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> si cada método convierte a su manera, el mismo recurso acaba publicándose de dos formas distintas.</li>
    <li><strong>Construye:</strong> una conversión centralizada entre DTO y modelo, con una prueba que la recorre.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **situar la conversión entre DTO y modelo en un punto único y justificarlo**.

### 2. El problema

Si cada método convierte a su manera, el mismo recurso acaba publicándose de dos formas distintas.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una conversión centralizada entre DTO y modelo, con una prueba que la recorre.</li>
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

## Sesión 18 · Validación de entrada

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> el JSON puede llegar incompleto, mal formado o manipulado aunque el formulario del cliente valide en el navegador.</li>
    <li><strong>Construye:</strong> peticiones inválidas rechazadas con información concreta sobre cada campo.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **aplicar @Valid y restricciones de Bean Validation a los DTO de entrada**.

### 2. El problema

El JSON puede llegar incompleto, mal formado o manipulado aunque el formulario del cliente valide en el navegador.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido peticiones inválidas rechazadas con información concreta sobre cada campo.</li>
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

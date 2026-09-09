---
title: "APIs REST: recursos, DTO, validación y errores"
label: "UD3 · Diseñar"
section: "ud-03"
order: 3
lang: "es"
summary: "Las reglas de diseño que convierten un montón de endpoints en una API defendible: recursos, representaciones, DTO, entrada validada y errores coherentes."
duration: "18 horas · 3 semanas · 6 sesiones de 3 h"
modality: "Taller de proyecto · 25 min de explicación, 140 min de trabajo y 15 min de cierre"
deliverable: "API con DTO, validaciones y errores coherentes, acompañada de sus comprobaciones."
date: "2026-09-09"
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

<p class="lead">El mismo CRUD aprende a publicar un contrato estable: recursos, DTO, validación y errores. Al terminar, Intermodular dispone de una versión que puede compilar, desplegar y consumir.</p>

## Semana 5 · Recursos y contrato REST del dominio

## Sesión 9 · Recursos y contrato REST del dominio

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [el presupuesto de calidad](/es/docencia/proyecto-intermodular/ud2-que-lo-compruebe-la-maquina/sesion-5/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

El CRUD ya se puede comprobar. Hoy revisarás cómo nombra sus recursos y utiliza HTTP. REST es un estilo de diseño; empezaremos por una consecuencia práctica: que las rutas describan recursos y que el método HTTP exprese la operación.

#### Tu API funciona. Eso no la hace REST

En la sesión 8 entregaste dieciséis endpoints con sus códigos correctos y una colección que los comprueba. Funciona, es verificable y otra persona puede usarla.

Y aun así, si mañana en una entrevista te preguntan «¿es una API REST?», la respuesta honesta hoy sería: *en parte, y no sabría decir en qué parte*.

Eso es lo que arreglamos esta semana. No porque la palabra sea importante, sino porque detrás de ella hay un conjunto de decisiones de diseño que hacen que una API se pueda usar sin manual, crecer sin romperse y entender sin preguntar.

<div class="rule">
  <p class="rule-label">El malentendido más extendido del sector</p>
  <p>«Mi API devuelve JSON, luego es REST.» <strong>No.</strong> El formato no tiene nada que ver: se puede hacer una API REST que devuelva XML y una API terrible que devuelva JSON.</p>
  <p>Lo que decide no es qué formato usas, sino <strong>cómo organizas lo que hay detrás de las URLs y qué significan tus métodos y tus códigos</strong>.</p>
</div>

#### Qué es REST

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

##### La interfaz uniforme, que es la que cuesta

Es la restricción central y se apoya en tres ideas:

<figure class="diagram">
  <figcaption>Qué exige una interfaz uniforme</figcaption>
  <ol class="flow flow--before">
    <li><strong>Cada cosa tiene su dirección.</strong> Un recurso se identifica por una URL, y siempre la misma</li>
    <li><strong>Se manipula a través de representaciones.</strong> No mandas el objeto: mandas una descripción de cómo debe quedar</li>
    <li><strong>Los mensajes se explican solos.</strong> El método, el código y las cabeceras dicen qué ocurre sin necesitar documentación aparte</li>
  </ol>
</figure>

La segunda idea es la de la sesión 10 y la que más cuesta al principio. La primera y la tercera son las de esta semana.

#### Un recurso es un sustantivo

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

#### Las siete reglas de nombrado

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

##### Jerarquía o filtro

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

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Ejecuta la colección de la sesión 8 antes de cambiar ninguna URL. Abre los controladores y la tabla del contrato.
2. Haz un inventario de método, ruta, parámetros y significado de cada operación. Incluye las operaciones de negocio que no equivalen a crear o borrar un registro.
3. Elige una ruta mejorable y escribe su propuesta antes de editar. Anota qué peticiones y qué consumidor tendrían que actualizarse.

#### Paso 2 · Comparar los niveles del modelo de madurez de Richardson

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

##### Nivel 0 · una sola puerta

```text
POST /api
{ "accion": "obtenerTarea", "id": 3 }

POST /api
{ "accion": "borrarTarea", "id": 3 }
```

HTTP se usa solo como sobre. Todo pasa por una URL y un método, y la intención va escondida en el cuerpo. Ni las URLs ni los códigos significan nada.

##### Nivel 1 · recursos con nombre

```text
POST /tareas/obtener
POST /tareas/borrar
POST /tareas/3/marcar-completada
```

Ya hay URLs distintas para cosas distintas: es un avance real. Pero la acción sigue estando en la ruta, y todo se hace con `POST`.

Reconoce esto, porque **es exactamente lo que escribe todo el mundo la primera vez**, y es lo que la UD1 te prohibió sin explicarte del todo por qué.

##### Nivel 2 · el método y el código hacen su trabajo

```text
GET    /tareas/3        → 200
DELETE /tareas/3        → 204
POST   /tareas          → 201
PATCH  /tareas/3        → 200
```

La ruta dice **sobre qué**, el método dice **qué**, y el código dice **cómo ha ido**. Aquí es donde vive la inmensa mayoría de las APIs profesionales, y donde debe estar la tuya al terminar la unidad.

##### Nivel 3 · la respuesta te dice qué puedes hacer ahora

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

#### Paso 3 · Dónde está tu API ahora mismo

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
  <dd>Es donde se decide la sesión 9. Probablemente tengas el 7 a medias, con la ruta anidada de tareas de un proyecto, y el 8 sin comprobar nunca.</dd>
  <dt>El 9</dt>
  <dd>Casi seguro que es un no, y es el tema de la sesión 10. Tu API publica exactamente los campos que tenga la clase, sin que nadie lo haya decidido.</dd>
  <dt>El 10</dt>
  <dd>Es un no, y va a seguir siéndolo. Es el nivel 3, y ya sabes por qué no vamos.</dd>
</dl>

#### Paso 4 · Comparar tres diseños de rutas para las mismas operaciones

Aquí tienes la misma funcionalidad —consultar una incidencia, cerrarla y listar las de un proyecto— escrita en tres niveles.

```text
POST /servicio
{ "op": "getIncidencia", "id": 41 }

POST /servicio
{ "op": "cerrarIncidencia", "id": 41 }

POST /servicio
{ "op": "listarIncidencias", "proyecto": 7 }
```

```text
POST /incidencia/get/41
POST /incidencia/cerrar/41
POST /incidencias/listar/7
```

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

#### Paso 5 · Audita tu propia API

1. Pasa la rúbrica de diez criterios a tu API de la UD2, endpoint por endpoint. Sé duro: un «a medias» es un no.
2. Sitúa tu API en el mapa de niveles y justifica la posición en tres frases.
3. Haz una lista de **todo lo que incumples**, ordenada por lo que costaría arreglarlo, de más barato a más caro.
4. Para los tres más baratos, escribe exactamente qué cambiarías.

Guarda esta auditoría: en la sesión 14 volverás a pasarla y la diferencia entre las dos es parte de la entrega de la unidad.

<p class="stage">Recursos y REST</p>

#### Paso 6 · Lo que no es un CRUD

Aquí está la parte difícil y la que separa una API pensada de una API copiada. ¿Qué haces con «archivar un proyecto», «cerrar una incidencia», «enviar un aviso» o «iniciar sesión»?

Ninguna es crear, leer, actualizar ni borrar. Y sin embargo hay que exponerlas. Hay tres estrategias, en este orden de preferencia:

La mayoría de las «acciones» son en realidad un campo que cambia de valor.

```text
PATCH /incidencias/41
{ "estado": "cerrada" }
```

«Cerrar» no es una operación: es poner el estado a `cerrada`. Si el dominio ya tiene ese campo, no hace falta inventar nada.

A veces la acción esconde una cosa que merece existir por sí misma.

```text
POST /incidencias/41/comentarios
POST /proyectos/7/miembros
```

«Comentar» no es un verbo que colgar de la incidencia: es **crear un comentario**. En cuanto lo ves así, aparece una colección que además se puede listar, paginar y borrar.

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

#### Paso 7 · Proponer métodos y rutas coherentes para doce operaciones

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

#### Paso 8 · El contrato de recursos del gestor

Usa la tabla como formato de documentación, no como obligación de añadir cinco entidades nuevas hoy. Sustituye sus filas por las entidades de tu propuesta y rellena colección, detalle y relaciones reales. Para cada ruta escribe un ejemplo con un id concreto y otro con un filtro. Señala qué rutas ya funcionan y cuáles están previstas: una ruta documentada como futura todavía no debe aparecer como superada en la colección.

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

#### Paso 9 · Aplica el contrato a tu código

Haz el cambio ruta por ruta: modifica la anotación del controlador, reinicia, actualiza la petición guardada y comprueba su resultado. Para una colección anidada como comentarios de una tarea, crea el modelo con id, texto e id de su recurso padre; el GET filtra por el id de la ruta y el POST asigna esa referencia desde la ruta. Rechaza el padre inexistente antes de guardar. Si tu dominio ya tiene una relación equivalente, aplica el procedimiento a esa colección en lugar de crear Comentario por copiar el ejemplo.

1. Renombra en tu proyecto todas las rutas que incumplan alguna de las siete reglas.
2. Actualiza la colección de Postman para que siga en verde con las rutas nuevas. Si sacaste el servidor a `{{baseUrl}}`, esto es rápido; si no, ya sabes por qué se hacía.
3. Añade el recurso `Comentario` a la API, anidado donde corresponda, con al menos listar y crear.
4. Anota en las decisiones técnicas qué rutas cambiaron y por qué.

#### Paso 10 · Comprobar y registrar el resultado de vuestro proyecto

1. Compara el inventario anterior con el nuevo y justifica cada cambio por su significado, sin basarte solo en preferencias de nombres.
2. Actualiza y ejecuta la colección con las nuevas rutas. Si Intermodular ya utiliza alguna, registra y coordina el cambio de contrato con ese cliente.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Diagnostica una API ajena

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

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque REST no dice nada del formato: habla de cómo se identifican los recursos, cómo se manipulan y qué significan los mensajes. Se puede devolver JSON con un diseño de nivel 0.</p>
  <p>2 · Cliente-servidor, sin estado y sistema por capas. Las tres vienen dadas por el propio protocolo.</p>
  <p>3 · En el nivel 1 cada cosa ya tiene su URL, pero la acción sigue metida en la ruta y todo se hace con el mismo método. En el nivel 2 la acción la expresa el método HTTP y el resultado lo expresa el código de estado.</p>
  <p>4 · Porque añade complejidad al servidor y muy pocos clientes aprovechan los enlaces: la mayoría se escriben conociendo las rutas de antemano. Es una decisión de coste y beneficio, no un olvido.</p>
</details>

##### Reto · La prueba de que se puede adivinar

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

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque la URL identifica una cosa y la acción ya la expresa el método HTTP. Con el verbo en la ruta, cada funcionalidad nueva inventa una dirección nueva y la API deja de ser adivinable.</p>
  <p>2 · Anidada cuando el recurso pertenece a otro o solo tiene sentido dentro de él; filtro cuando se trata de acotar una colección que existe por sí sola.</p>
  <p>3 · Tratarlo como un cambio de estado con <code>PATCH</code>; descubrir que hay un recurso nuevo que crear; y, si nada de eso encaja, exponer la acción como un sustantivo propio con <code>POST</code> y documentar por qué.</p>
  <p>4 · Que se aprende una vez. Sobre cada recurso se aplican siempre los mismos métodos, así que quien sabe usar uno sabe usar los demás sin consultar nada.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Cada ruta tiene un recurso o una operación de negocio justificable; la colección sigue funcionando.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Sesión 10 · Representaciones y DTO

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [el presupuesto de calidad](/es/docencia/proyecto-intermodular/ud2-que-lo-compruebe-la-maquina/sesion-5/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Las rutas ya están revisadas, pero devolver directamente tu modelo permite que un cambio interno altere la respuesta. Un DTO, objeto para transferir datos, define qué campos cruzan la API. Hoy separarás la representación de salida del objeto que utilizas dentro del servidor.

#### Un recurso no es un objeto

<p class="term">Representación</p>

Lo que viaja por la red cuando alguien pide un recurso. **No es el recurso**: es una descripción suya, en un formato concreto, con los datos que se ha decidido incluir.

Es la segunda idea de la interfaz uniforme que viste en la sesión 9, y ahora se puede decir con precisión:

<figure class="diagram">
  <figcaption>Tres cosas distintas que se confunden</figcaption>
  <ol class="flow flow--before">
    <li><strong>El recurso:</strong> «la tarea 41», una idea del dominio</li>
    <li><strong>El modelo:</strong> la clase <code>Tarea</code> en tu memoria, con lo que tu código necesita</li>
    <li><strong>La representación:</strong> el JSON que envías, con lo que el cliente necesita</li>
  </ol>
</figure>

Ahora mismo tienes las dos últimas pegadas: tu representación **es** tu modelo. Y cada vez que tocas uno, cambias el otro sin querer.

#### Los tres daños concretos

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

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre el modelo, el controlador y una respuesta GET guardada. Anota exactamente sus campos actuales.
2. Localiza qué método devuelve directamente el modelo. Crea el paquete `dto` bajo tu paquete base para los tipos de respuesta del ejercicio.
3. Elige un dato interno de prueba que no deba aparecer en la respuesta. No utilices contraseñas ni datos reales para demostrar el problema.

#### Paso 2 · Observar qué campos internos se exponen al devolver el modelo

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

#### Paso 3 · Crear el DTO de respuesta con los campos públicos

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

#### Paso 4 · Convertir el modelo al DTO de respuesta

1. Abre `dto/TareaResponse.java` y añade el método estático `desde` dentro del record. Importa `com.ejemplo.gestor.model.Tarea`; conserva la lista de componentes del record.
2. En `TareaController`, importa `TareaResponse` y sustituye detalle y listado por sus versiones con DTO. Si la lista necesita `ArrayList`, conserva su import de `java.util`.
3. Crea un registro después del reinicio y compara listado y detalle: ambos deben contener los mismos campos públicos y ninguno debe exponer la nota interna.

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

#### Paso 5 · Comprobar que un cambio interno no altera el JSON público

Esta es la prueba de que ha servido para algo, y hay que hacerla:

`GET /tareas`. El campo `notaInterna` ha desaparecido, sin haberlo borrado de la clase. Sigue ahí, para tu código, y ya no se publica.

En la clase `Tarea`, renombra el atributo `titulo` a `nombre`, y su *getter* a `getNombre()`. El proyecto dejará de compilar en un sitio: **el método de conversión**. Arréglalo ahí, cambiando `tarea.getTitulo()` por `tarea.getNombre()`.

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

#### Paso 6 · Identificar las conversiones que requiere mantener DTO separados

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
  <p>Esa es la sesión 11. Y el código de conversión, que hoy has escrito a mano y que crecerá, se ordena en la 17.</p>
</div>

#### Paso 7 · La representación de proyectos

En `dto/ProyectoResponse.java`, declara primero los componentes que utiliza el cliente. Añade un método `desde(Proyecto proyecto)` que copie esos campos; después cambia el detalle y convierte uno a uno los elementos del listado. Busca todos los `return proyecto` del controlador para no dejar una salida directa del modelo. Comprueba el campo interno con un registro creado después de reiniciar y restaura cualquier renombrado experimental antes de continuar.

1. Crea `ProyectoResponse` con los campos que **decidas** publicar, y justifica en un comentario cuál dejas fuera y por qué.
2. Cambia el controlador de proyectos para devolverlo, en el elemento y en la colección.
3. Añade a `Proyecto` un campo interno que no deba publicarse —por ejemplo `presupuestoInterno`— y comprueba que no aparece.
4. Repite el paso 2 de la comprobación: renombra un campo del modelo y verifica que la colección de Postman sigue en verde.

#### Paso 8 · Comprobar y registrar el resultado de vuestro proyecto

1. Añade el dato interno al modelo y verifica que el JSON público sigue conteniendo solo los campos del DTO.
2. Comprueba listado y detalle, tanto para la entidad del ejemplo adaptada como para otra de tu dominio. Actualiza la colección si has decidido cambiar el contrato.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Dos vistas del mismo recurso

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

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El recurso es la idea del dominio; el modelo es la clase que tu código necesita en memoria; la representación es el JSON concreto que envías, con los campos que hayas decidido publicar.</p>
  <p>2 · Publicas datos que no querías, no puedes cambiar el modelo sin romper a tus clientes, y no puedes dar respuestas distintas del mismo recurso.</p>
  <p>3 · El modelo cambia campo a campo y tendrá que ser construible por JPA; la respuesta se crea, se envía y nadie la modifica, así que la inmutabilidad de un <code>record</code> encaja y ahorra código.</p>
  <p>4 · La entrada. El cuerpo de las peticiones sigue llegando directamente al modelo, y eso permite al cliente mandar campos que no debería poder tocar.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Una modificación interna no añade campos accidentalmente a la respuesta JSON.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Semana 6 · Entradas, salidas y mapeo

## Sesión 11 · Entradas, salidas y mapeo

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [cerrar el primer proyecto](/es/docencia/proyecto-intermodular/ud3-cerrar-y-publicar-la-version/sesion-6/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Ya has separado la salida con DTO. Hoy separarás también los datos que el cliente puede enviar y reunirás las conversiones repetidas. Un mapper es una clase que transforma un tipo de objeto en otro; no decide reglas de negocio ni atiende peticiones.

#### La puerta que sigue abierta

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

#### Entrada y salida no son simétricas

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

#### Tres clases por recurso, ¿no es demasiado?

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

#### Cuenta los sitios

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

#### La dirección de las dependencias

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

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre los DTO de salida, el modelo y los métodos POST, PUT y PATCH. Localiza qué campos recibe todavía el modelo directamente.
2. Escribe qué campos puede enviar el cliente al crear y cuáles solo asigna el servidor. Define también qué significa omitir un campo en PATCH.
3. Busca conversiones repetidas entre modelo y DTO. Esas asignaciones son el punto de partida del mapper; mantén la colección disponible para comprobar la refactorización.

#### Paso 2 · El DTO de entrada es una lista blanca

Crea `TareaRequest.java` en `dto` antes de modificar el POST. Sustituye el tipo del argumento por `TareaRequest` y construye una `Tarea` copiando solo los campos admitidos; la identidad la sigue asignando el servidor. El import del modelo permanece porque aún se almacena una Tarea. Si en la sesión 5 activaste el rechazo de campos desconocidos, el intento de enviar `id` dará 400; si lo desactivaste, se ignorará. En ambos casos el cliente no debe imponer el id.

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

Y otro detalle que no es casual: es una **clase**, no un `record`. Jackson necesita construirla vacía y rellenarla con los *setters*, y en la sesión 12 le colgaremos anotaciones de validación campo a campo.

##### El controlador

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

```json
POST /tareas
{ "id": 999, "titulo": "Colarme un id", "completada": true }
```

Responde `201`, con `id` asignado por el servidor y `completada` en `false`. Los dos campos que sobraban se han ignorado, sin una sola línea de comprobación.

#### Paso 3 · El DTO que arregla el `PATCH`

Crea `dto/TareaPatchRequest.java` con los campos del bloque, un constructor público sin argumentos y getters/setters para **cada campo**. Para `Boolean completada`, utiliza `getCompletada()` y `setCompletada(Boolean completada)`: no lo conviertas a `boolean`. Sustituye el argumento del PATCH existente por ese DTO y aplica solo valores no nulos. Prueba separadamente un campo omitido y `"completada": false` para verificar que producen decisiones distintas.

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

#### Paso 4 · La entrada de proyectos

1. Crea `ProyectoRequest` con solo lo que un cliente puede enviar al crear un proyecto.
2. Crea `ProyectoPatchRequest` con tipos envoltorio.
3. Cambia el controlador para usarlos en `POST`, `PUT` y `PATCH`.
4. Comprueba con Postman que un `POST` con un `id` y con un campo interno responde `201` e ignora los dos.
5. Anota en las decisiones técnicas qué campos dejaste fuera de la entrada y por qué.

<p class="stage">Del JSON al modelo y del modelo al JSON</p>

#### Paso 5 · Reproducir una conversión inconsistente entre endpoints

No es un problema estético. Vamos a producirlo a propósito para que lo veas.

Añade `proyectoId` a `Tarea` y a `TareaResponse`, con sus accesos.

Actualiza `TareaResponse.desde()` para que lo incluya. Y ahora **haz como si se te olvidara** el listado: deja el `GET /tareas` construyendo la respuesta a mano con `null` en el nuevo componente. Omitir el quinto argumento impediría compilar; el fallo que vamos a observar es pasar un valor incorrecto:

```java
@GetMapping
public List<TareaResponse> lista() {
    List<TareaResponse> respuesta = new ArrayList<>();
    for (Tarea tarea : tareas) {
        respuesta.add(new TareaResponse(
                tarea.getId(),
                tarea.getTitulo(),
                tarea.getPrioridad(),
                tarea.isCompletada(),
                null)); // Fallo intencionado: debería copiar tarea.getProyectoId()
    }
    return respuesta;
}
```

```json
GET /tareas      → [{"id":1,"titulo":"Revisar","prioridad":"alta","completada":false,"proyectoId":null}]
GET /tareas/1    → {"id":1,"titulo":"Revisar","prioridad":"alta","completada":false,"proyectoId":7}
```

**El mismo recurso, dos representaciones distintas.** El cliente que pinta la lista no ve el proyecto; el que abre el detalle sí. Y nada falla, nada avisa: los dos endpoints responden `200`.

<div class="rule">
  <p class="rule-label">Por qué este fallo es de los peores</p>
  <p>No lo detecta el compilador, no lo detecta el linter y no lo detecta tu colección, porque las dos respuestas son válidas. Lo detecta un cliente, semanas después, preguntando «¿por qué a veces viene el proyecto y a veces no?».</p>
  <p>Y la causa no es un descuido: es que <strong>había dos sitios donde hacer el mismo cambio</strong> y solo uno era obligatorio.</p>
</div>

#### Paso 6 · Reunir la conversión de objetos en un mapper

Crea `mapper/TareaMapper.java` con el bloque completo y revisa los imports de los tres DTO y del modelo. Antes de usarlo, comprueba que `proyectoId` existe tanto en Tarea como en TareaResponse y que el constructor del record recibe sus cinco componentes en el mismo orden. Después sustituye las conversiones del controlador por llamadas al mapper y elimina `TareaResponse.desde` cuando ya no tenga usos: la conversión tendrá una sola implementación.

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

#### Paso 7 · El controlador, después

Sustituye los métodos de listado, detalle y alta existentes por los que se muestran; no crees otra clase Controller. El método `buscar(id)` es un auxiliar privado dentro del controlador: recorre su lista, devuelve la tarea si coincide el id y devuelve `null` al terminar si no encuentra ninguna. Reutilízalo en detalle, PUT y PATCH y conserva sus comprobaciones de ausencia. Ejecuta la colección después de cambiar cada método.

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

#### Paso 8 · La prueba de ida y vuelta

Un mapper roto no lanza excepciones: **pierde datos en silencio**. Si te olvidas de una línea, ese campo llega vacío y nadie protesta.

La forma de detectarlo es recorrer el circuito completo y comparar los extremos. Con las herramientas que tienes:

```json
POST /tareas
{ "titulo": "Revisar el login", "prioridad": "alta", "proyectoId": 7 }
```

Usa la cabecera `Location`, o `{{tareaId}}` si ya lo tienes encadenado en la colección.

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

#### Paso 9 · El mapper de proyectos

1. Crea `ProyectoMapper` con los cuatro métodos equivalentes.
2. Vacía el controlador de proyectos de toda conversión.
3. Extrae también su `buscar(id)` privado si lo estabas repitiendo.
4. Añade a la colección la prueba de ida y vuelta para proyectos, con una comprobación por campo.
5. Comprueba que la colección entera sigue en verde.

#### Paso 10 · Comprobar y registrar el resultado de vuestro proyecto

1. Intenta enviar un campo que solo pueda asignar el servidor y comprueba que no modifica ese dato interno.
2. Prueba creación, lectura y modificación parcial: las conversiones deben conservar los datos esperados y el PATCH no debe borrar los campos omitidos.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · La API de usuarios

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

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque Jackson solo asigna las claves para las que encuentra un <em>setter</em>. Si el campo no existe en la clase de entrada, se ignora en silencio, así que la propia clase decide qué puede enviar el cliente.</p>
  <p>2 · Porque el primitivo no puede valer <code>null</code> y siempre llega como <code>false</code>, de modo que no se distingue «no me lo han enviado» de «pónmelo a falso». El envoltorio sí admite <code>null</code>.</p>
  <p>3 · Entra y no sale: la contraseña. Sale y no entra: el <code>id</code>, o la fecha de creación.</p>
  <p>4 · Vaciar un campo a propósito. Se resolvería declarándolo como <code>Optional</code>, que distingue el campo ausente del campo enviado con valor nulo.</p>
</details>

##### Reto · Encuentra el campo perdido

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

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que un cambio se aplique solo en uno de los dos, y el mismo recurso acabe publicándose de dos formas distintas según el endpoint. Las dos respuestas son válidas, así que nada lo detecta.</p>
  <p>2 · Porque obligaría al DTO a conocer el modelo. El DTO describe el contrato exterior y debe poder cambiar por su cuenta; el mapper es el único que conoce ambos lados.</p>
  <p>3 · Porque modifica una tarea que ya existe en lugar de crear una nueva. La firma dice lo que hace y evita que alguien espere un objeto distinto de vuelta.</p>
  <p>4 · Que los datos sobreviven a la transformación. Un <code>200</code> solo dice que la petición se atendió; no dice que los campos hayan llegado ni que valgan lo que valían.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Identificadores y valores calculados conservan el control del servidor; los mapeos de ambas entidades son coherentes.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Sesión 12 · Validar las entradas del CRUD

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [cerrar el primer proyecto](/es/docencia/proyecto-intermodular/ud3-cerrar-y-publicar-la-version/sesion-6/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Un JSON puede tener sintaxis correcta y aun así contener datos que tu aplicación no acepta. Bean Validation permite declarar restricciones, como un texto obligatorio, sobre los DTO. @Valid pide a Spring que compruebe esas restricciones al recibir la entrada.

#### El formulario del cliente no es una defensa

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

#### Valida antes de ejecutar, como todo lo demás

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

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre `pom.xml`, el DTO de entrada y los métodos del controlador que lo reciben. Repite una creación válida de la sesión 11.
2. Anota las restricciones de cada campo: obligatorio, longitud, rango o formato. Distingue esas condiciones de reglas que necesitan consultar otros registros.
3. Prepara un JSON correcto y copias que incumplan una sola restricción cada vez. Así podrás atribuir cada rechazo a una causa concreta.

#### Paso 2 · Instala la dependencia, porque no viene puesta

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

#### Paso 3 · Las reglas van en el DTO de entrada

Con Maven sincronizado, abre el **DTO de entrada existente** y añade las anotaciones e imports del bloque a sus campos. No sustituyas toda la clase por una versión sin constructor o métodos de acceso. `@NotNull` rechaza la ausencia, mientras que `@Positive` comprueba el valor cuando existe; juntas expresan que `proyectoId` es obligatorio y positivo. Guarda antes de cambiar el controlador.

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

##### Las restricciones que cubren casi todo

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

##### Las tres que se confunden siempre

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

#### Paso 4 · Activarla · `@Valid`

En el POST y PUT de `TareaController`, añade el import `jakarta.validation.Valid` y coloca `@Valid` delante del argumento `@RequestBody`. Conserva el cuerpo del método que ya asigna id, convierte y guarda; los puntos suspensivos de un esquema no son código Java. Reinicia y envía una entrada inválida. Después consulta el listado para verificar que el rechazo ocurrió antes del guardado.

```java
@PostMapping
public ResponseEntity<TareaResponse> crear(@Valid @RequestBody TareaRequest peticion) {
    // Conserva aquí el cuerpo de tu método actual; solo añadimos @Valid.
}
```

Una palabra. `jakarta.validation.Valid`.

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

#### Paso 5 · El problema que queda para la sesión 13

Vuelve a mirar ese `400`. Ponte en el lugar de quien consume tu API:

```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "path": "/tareas" }
```

¿Qué campo estaba mal? ¿El título? ¿La prioridad? ¿Los dos? ¿Qué valores acepta `prioridad`?

**No hay forma de saberlo.** La información existe —está entera en tu consola— y no se la estás dando a quien la necesita. Un cliente que recibe esto solo puede probar a ciegas.

Eso es la sesión 13. Hoy la validación ya protege tus datos; el mensaje todavía no ayuda a nadie.

<details class="aside aside--extra">
  <summary>Validar parámetros que no van en el cuerpo</summary>
  <p>Las restricciones también valen sobre un <code>@RequestParam</code> o un <code>@PathVariable</code>, pero hace falta un paso más: anotar la <strong>clase</strong> del controlador con <code>@Validated</code>, de <code>org.springframework.validation.annotation</code>.</p>
  <p>Sin esa anotación de clase, un <code>@Positive</code> sobre un parámetro se ignora sin avisar. Es otro caso de «no da error y no hace nada», así que conviene reconocerlo.</p>
</details>

#### Paso 6 · La tabla de rechazos

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

#### Paso 7 · Las reglas de proyectos

1. Añade restricciones a `ProyectoRequest`: el nombre obligatorio y entre 3 y 80 caracteres, la descripción opcional pero como máximo 500.
2. Pon `@Valid` en el `POST` y en el `PUT`.
3. Decide qué hacer con `ProyectoPatchRequest` y **justifícalo**: si un campo es opcional en un `PATCH`, ¿puede llevar `@NotBlank`? ¿Qué pasaría si lo lleva?
4. Añade a la colección tres peticiones de rechazo con su comprobación de `400`.

La pregunta 3 es la que se piensa. Un `PATCH` recibe campos ausentes por definición, así que `@NotNull` ahí sería un error. Pero `@Size` sí tiene sentido: *si* llega, que tenga la longitud correcta.

#### Paso 8 · Comprobar y registrar el resultado de vuestro proyecto

1. Ejecuta la tabla de rechazos y verifica que cada entrada inválida produce 400 sin crear ni modificar el registro.
2. Repite una entrada válida después de los rechazos. Debe seguir funcionando; comprueba que la validación se activa en todos los métodos que reciben el DTO.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Escribe el contrato de validación

Antes de tocar más código, escribe la tabla de reglas de **todos** los recursos de tu API. Este es el formato:

| Recurso | Campo | Obligatorio en crear | Reglas | ¿Modificable? |
| :--- | :--- | :---: | :--- | :---: |

Después responde:

1. Hay reglas que **no se pueden expresar** con las anotaciones de hoy. Por ejemplo: «el `proyectoId` debe corresponder a un proyecto que exista», o «la fecha de fin no puede ser anterior a la de inicio». Localiza al menos dos en tu API y explica por qué se les resisten.
2. Para cada una de esas dos, ¿dónde tendría que comprobarse entonces? Piensa en quién sabe la respuesta: ¿la clase del DTO, o algo que tenga acceso a la lista de proyectos?
3. Tu API acepta hoy una tarea de un proyecto inexistente. ¿Es eso un `400` o un `404`? Argumenta las dos posturas y quédate con una.

La pregunta 1 abre el trabajo siguiente, y la 2 apunta a la UD4. La 3 no tiene respuesta única y se defiende.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La dependencia instalada, <code>TareaRequest</code> validado y la tabla de nueve rechazos comprobada.</span></div>
  <div><strong>Si lo tienes</strong><span>Proyectos validados, con la decisión sobre el <code>PATCH</code> justificada y tres rechazos en la colección.</span></div>
  <div><strong>Reto</strong><span>El contrato de validación completo y las dos reglas que las anotaciones no alcanzan, identificadas y situadas.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque se ejecuta en la máquina de quien la quiera saltar. Cualquiera puede enviar el cuerpo directamente al servidor sin pasar por la interfaz.</p>
  <p>2 · Que <code>spring-boot-starter-validation</code> esté en el <code>pom.xml</code> y descargado. Sin esa dependencia todo compila y las anotaciones se ignoran en silencio. Después, que el parámetro lleve <code>@Valid</code>.</p>
  <p>3 · Un texto de solo espacios, como <code>"   "</code>: no está vacío, pero no contiene nada útil.</p>
  <p>4 · Porque un primitivo no puede ser nulo: un campo ausente llega como <code>0</code> y la comprobación pasa. Hay que declararlo como <code>Integer</code>.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Las entradas inválidas no crean ni modifican recursos y el cliente recibe una respuesta que puede interpretar.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Semana 7 · Reglas propias y errores coherentes

## Sesión 13 · Reglas propias y errores coherentes

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [el ci del repositorio de servidor](/es/docencia/proyecto-intermodular/ud4-poner-el-backend-en-produccion/sesion-7/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

La validación básica ya rechaza entradas, pero sus mensajes y los demás errores necesitan un formato común. Una excepción representa un fallo que el código comunica; un manejador global la transforma en una respuesta. También crearás validadores para reglas que las anotaciones existentes no expresan.

#### Ponte en el otro lado

Estás escribiendo un cliente contra una API ajena. Envías tu formulario y recibes esto:

```json
{ "timestamp": "...", "status": 400, "error": "Bad Request", "path": "/tareas" }
```

¿Qué haces ahora? Solo te quedan tres opciones, y las tres son malas: probar campo por campo hasta acertar, buscar una documentación que quizá no exista, o escribirle a quien hizo la API.

**Esa API eres tú desde ayer.** Hoy lo arreglamos.

#### Un mensaje útil dice qué se espera

Los mensajes por defecto están en inglés y describen la restricción, no el problema. Compara:

<div class="compare-pair">
  <div>
    <p class="compare-label">Describe la restricción</p>
    <p class="compare-body">«must not be blank», «size must be between 3 and 120». Traduce la anotación. Quien lo lee tiene que deducir qué hacer.</p>
  </div>
  <div>
    <p class="compare-label">Dice qué corregir</p>
    <p class="compare-body">«El título es obligatorio», «El título debe tener entre 3 y 120 caracteres». Se puede enseñar tal cual al usuario final.</p>
  </div>
</div>

Cada anotación acepta un `message`:

```java
public class TareaRequest {

    @NotBlank(message = "El título es obligatorio")
    @Size(min = 3, max = 120,
          message = "El título debe tener entre 3 y 120 caracteres")
    private String titulo;

    @NotNull(message = "La prioridad es obligatoria")
    @Pattern(regexp = "baja|media|alta",
             message = "La prioridad debe ser baja, media o alta")
    private String prioridad;

    @NotNull(message = "Toda tarea debe pertenecer a un proyecto")
    @Positive(message = "El identificador de proyecto debe ser un número positivo")
    private Integer proyectoId;
}
```

<div class="rule">
  <p class="rule-label">Las cuatro reglas de un buen mensaje</p>
  <ol>
    <li><strong>Di qué se espera, no qué está mal.</strong> «Debe tener entre 3 y 120 caracteres» es accionable; «longitud inválida» no.</li>
    <li><strong>Incluye los valores admitidos</strong> cuando sean pocos: «baja, media o alta» ahorra una consulta a la documentación.</li>
    <li><strong>Habla del dominio, no del código.</strong> «Toda tarea debe pertenecer a un proyecto», no «proyectoId no puede ser null».</li>
    <li><strong>No cuentes cómo está hecho por dentro.</strong> Nada de nombres de tablas, de clases ni de columnas.</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Sacar los mensajes a un archivo</summary>
  <p>Los mensajes también pueden vivir fuera del código, en <code>src/main/resources/ValidationMessages.properties</code>, y referenciarse entre llaves:</p>
  <p><code>@NotBlank(message = "{tarea.titulo.obligatorio}")</code></p>
  <p>Sirve para traducir la API a varios idiomas y para revisar todos los textos de una vez sin abrir veinte clases. No lo necesitamos aquí, pero es lo que verás en cualquier aplicación que se publique en más de un idioma.</p>
</details>

#### Cinco errores, cinco formatos

Provoca los cinco, uno detrás de otro, y copia el cuerpo de cada respuesta. Es el punto de partida de la sesión.

| Provoca | Código | Qué cuerpo recibes |
| :--- | :---: | :--- |
| `GET /tareas/999` | `404` | **Vacío del todo** |
| `POST /tareas` con `{}` | `400` | El objeto de Spring con `errors` |
| `POST /tareas` con `{,}` | `400` | Otro objeto distinto, con `message` de Jackson |
| `POST /tareas` sin `Content-Type` | `415` | Otro más |
| Una excepción dentro de tu método | `500` | Otro más, quizá con la traza |

Cinco fallos, **cinco formas distintas**, y una de ellas ni siquiera tiene cuerpo.

Ponte otra vez en el lado del cliente. Para tratar los errores de tu API tiene que escribir un caso especial por cada uno, y el `404` no le da nada con lo que trabajar: solo sabe que algo no estaba, pero no qué.

<div class="rule">
  <p class="rule-label">Lo que se promete en un contrato</p>
  <p>Una API no promete solo qué devuelve cuando todo va bien. <strong>Promete también cómo son sus fallos.</strong></p>
  <p>Si los errores tienen una forma única y predecible, quien consume la API escribe el tratamiento <strong>una vez</strong> y le sirve para todos los endpoints, incluidos los que aún no existen.</p>
</div>

#### Diseña el formato antes de escribir código

Un error útil responde a cuatro preguntas: qué ha pasado, cuándo, dónde y qué hay que corregir.

```java
package com.ejemplo.gestor.error;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
        LocalDateTime momento,
        int estado,
        String error,
        String mensaje,
        String ruta,
        List<ErrorDeCampo> errores) {

    public record ErrorDeCampo(String campo, String motivo) {
    }
}
```

| Campo | Para qué sirve |
| :--- | :--- |
| `momento` | Correlacionar con los registros del servidor cuando alguien reporta un fallo |
| `estado` | El mismo número del código HTTP, repetido para quien solo lee el cuerpo |
| `error` | El nombre legible: `Not Found`, `Bad Request` |
| `mensaje` | Qué ha ocurrido, en una frase |
| `ruta` | Qué se estaba pidiendo |
| `errores` | La lista de campos que fallan. Vacía cuando el error no es de validación |

<details class="aside aside--extra">
  <summary>Esto ya está estandarizado: <em>Problem Details</em></summary>
  <p>Existe un estándar para el cuerpo de los errores HTTP, el RFC 9457, con campos fijos —<code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>, <code>instance</code>— y su propio tipo de contenido, <code>application/problem+json</code>.</p>
  <p>Spring lo trae de serie en la clase <code>ProblemDetail</code>, y en una API pública es lo que conviene usar: quien la consuma reconocerá el formato sin leer tu documentación.</p>
  <p>Aquí construimos el nuestro porque diseñarlo enseña qué preguntas tiene que responder un error. Cuando lo tengas claro, cambiar a <code>ProblemDetail</code> es media hora.</p>
</details>

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre los DTO validados, sus mensajes y los controladores. Reproduce un 400 de validación y un 404; guarda ambas respuestas para compararlas.
2. Elige una regla propia de un campo y otra que compare dos campos. Escribe un caso válido y uno inválido para cada una.
3. Localiza dónde se generan errores de recurso ausente y de conflicto. Crearás excepciones del dominio y un manejador en un paquete de errores bajo tu paquete base.

#### Paso 2 · Consultar los mensajes de validación que devuelve la API

La información existe: Spring sabe perfectamente qué campo ha fallado y por qué, y lo tienes en la consola. Simplemente no se envía, porque por defecto no se publican detalles de error.

En `application.properties`:

```properties
server.error.include-message=always
server.error.include-binding-errors=always
```

Reinicia y repite el `POST` con el cuerpo vacío:

```json
{
  "timestamp": "2026-09-02T10:14:22.831+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for object='tareaRequest'. Error count: 3",
  "errors": [
    { "field": "titulo", "defaultMessage": "must not be blank" },
    { "field": "prioridad", "defaultMessage": "must not be null" },
    { "field": "proyectoId", "defaultMessage": "must not be null" }
  ],
  "path": "/tareas"
}
```

Ya se puede trabajar con eso: hay campos y hay motivos.

<div class="rule">
  <p class="rule-label">Dos avisos sobre estas dos líneas</p>
  <p><strong>Uno.</strong> Es una solución provisional. El formato lo decide Spring, no tú, y arrastra ruido como <code>defaultMessage</code> o <code>object=</code>. En la sesión 13 diseñarás tu propio formato y estas propiedades sobrarán.</p>
  <p><strong>Dos.</strong> <code>include-message=always</code> también publica el mensaje de <strong>cualquier</strong> excepción, incluidas las inesperadas. En una aplicación real eso puede filtrar detalles internos a quien no debería verlos. Aquí se acepta porque estamos aprendiendo y porque dura una sesión.</p>
</div>

#### Paso 3 · Crear una anotación de validación y su validador

Crea dos archivos distintos dentro de `validacion`: `PrioridadValida.java` para la anotación y `PrioridadValidaValidator.java` para la clase que implementa `isValid`. Copia cada bloque en su archivo, con su declaración de paquete e imports. Cuando ambos compilen, sustituye `@Pattern` por `@PrioridadValida` en los DTO; conserva `@NotNull` solo donde el campo sea obligatorio. Prueba una prioridad válida, otra no admitida y un campo omitido.

`@Pattern(regexp = "baja|media|alta")` funciona, y tiene tres problemas:

1. Está repetida en `TareaRequest` y en `TareaPatchRequest`.
2. Si mañana se añade la prioridad `crítica`, hay que acordarse de los dos sitios.
3. No dice nada: hay que leer la expresión regular para entender la regla.

Vamos a convertir esa regla del dominio en una anotación propia.

```java
package com.ejemplo.gestor.validacion;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PrioridadValidaValidator.class)
public @interface PrioridadValida {

    String message() default "La prioridad debe ser baja, media o alta";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
```

<dl class="worked">
  <dt><code>@Target(FIELD)</code></dt>
  <dd>Dónde se puede poner esta anotación. Aquí, sobre atributos.</dd>
  <dt><code>@Retention(RUNTIME)</code></dt>
  <dd>Que siga existiendo mientras el programa se ejecuta. Sin esto, la anotación desaparece al compilar y nadie la ve.</dd>
  <dt><code>@Constraint(validatedBy = ...)</code></dt>
  <dd>Qué clase contiene la comprobación de verdad. La anotación solo es la etiqueta.</dd>
  <dt><code>groups</code> y <code>payload</code></dt>
  <dd>Los exige la especificación de Bean Validation y casi nunca se usan. Se copian tal cual.</dd>
</dl>

```java
package com.ejemplo.gestor.validacion;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class PrioridadValidaValidator
        implements ConstraintValidator<PrioridadValida, String> {

    private static final List<String> VALIDAS = List.of("baja", "media", "alta");

    @Override
    public boolean isValid(String valor, ConstraintValidatorContext contexto) {
        // Un valor ausente es asunto de @NotNull, no nuestro.
        if (valor == null) {
            return true;
        }
        return VALIDAS.contains(valor);
    }
}
```

Ese `if (valor == null) return true` no es un descuido: **cada anotación comprueba una sola cosa**. Si además rechazara los nulos, no podrías tener un campo opcional con esta regla, y es justo lo que necesitas en el `PATCH`.

```java
@NotNull(message = "La prioridad es obligatoria")
@PrioridadValida
private String prioridad;
```

En `TareaPatchRequest`, donde el campo es opcional, va sola:

```java
@PrioridadValida
private String prioridad;
```

La regla vive ahora **en un solo sitio**, se lee sin descifrar nada, y añadir `crítica` es tocar una línea.

<div class="rule">
  <p class="rule-label">Y aun así, la mejor validación es la que no hace falta</p>
  <p>Si <code>prioridad</code> fuera un <code>enum</code> en lugar de un <code>String</code>, un valor inválido sería imposible de representar: Jackson rechazaría <code>"urgentísima"</code> él solo, y no habría regla que escribir ni que mantener.</p>
  <p><strong>Antes de validar un dato, pregúntate si puedes elegir un tipo en el que el dato incorrecto no quepa.</strong> Es una idea que vale para toda la carrera, y volveremos a ella en la UD5 al modelar la base de datos.</p>
</div>

#### Paso 4 · Reglas que miran dos campos a la vez

Reutiliza tu ProyectoRequest: añade fechaInicio y fechaFin sin borrar sus otros campos y genera sus getters y setters. Importa LocalDate de `java.time` y NotNull de `jakarta.validation.constraints`. Después crea estos dos archivos en `validacion`:

```java
// validacion/FechasCoherentes.java
package com.ejemplo.gestor.validacion;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = FechasCoherentesValidator.class)
public @interface FechasCoherentes {
    String message() default "La fecha de fin no puede ser anterior a la de inicio";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

```java
// validacion/FechasCoherentesValidator.java
package com.ejemplo.gestor.validacion;
import com.ejemplo.gestor.dto.ProyectoRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class FechasCoherentesValidator
        implements ConstraintValidator<FechasCoherentes, ProyectoRequest> {
    @Override
    public boolean isValid(ProyectoRequest entrada, ConstraintValidatorContext contexto) {
        if (entrada == null || entrada.getFechaInicio() == null || entrada.getFechaFin() == null) {
            return true; // La obligatoriedad se comprueba con @NotNull.
        }
        if (!entrada.getFechaFin().isBefore(entrada.getFechaInicio())) return true;
        contexto.disableDefaultConstraintViolation();
        contexto.buildConstraintViolationWithTemplate(contexto.getDefaultConstraintMessageTemplate())
            .addPropertyNode("fechaFin").addConstraintViolation();
        return false;
    }
}
```

La violación se asocia a fechaFin para que el manejador de errores de campo pueda mostrarla. Importa FechasCoherentes en el DTO y coloca `@FechasCoherentes` sobre la clase. En el POST de proyecto conserva `@Valid`. Prueba fechaFin posterior (aceptada), igual (aceptada), anterior (400) y omitida (aceptada si es opcional), manteniendo válidos los demás campos. Si conviertes el DTO a record más adelante, cambia los accesos a `fechaInicio()` y `fechaFin()` y conserva las restricciones que tu dominio requiera.

En la sesión 12 encontraste reglas que no encajaban en un solo campo. La más habitual: «la fecha de fin no puede ser anterior a la de inicio».

Ese tipo de restricción se pone **sobre la clase**, no sobre un atributo, porque necesita ver el objeto entero:

```java
@FechasCoherentes
public class ProyectoRequest {

    @NotNull
    private LocalDate fechaInicio;

    private LocalDate fechaFin;
}
```

Se escribe igual que la de antes, cambiando dos cosas: `@Target(TYPE)` en la anotación, y `ConstraintValidator<FechasCoherentes, ProyectoRequest>` en el validador, cuyo `isValid` recibe el objeto completo y puede comparar los dos campos.

<div class="rule">
  <p class="rule-label">Dónde se acaba lo que puede hacer Bean Validation</p>
  <p>Todo lo de hoy comprueba <strong>el objeto que ha llegado, y nada más</strong>. Puede mirar un campo, o varios campos entre sí.</p>
  <p>Lo que no puede es responder «¿existe el proyecto 7?», porque para eso hay que consultar los datos, y un validador no tiene acceso a ellos. Esa comprobación es una <strong>regla de negocio</strong>, no una regla de formato, y su sitio es otro: se resuelve con una excepción propia en la sesión 13 y encontrará su hogar definitivo en la UD4.</p>
</div>

#### Paso 5 · Reescribe todos tus mensajes

1. Activa las dos propiedades y comprueba que ves los mensajes.
2. Recorre todos tus DTO de entrada y pon un `message` en **cada** restricción, aplicando las cuatro reglas.
3. Envía `{}` a la creación de tareas y de proyectos, y lee el resultado como si fueras el cliente.
4. Para cada mensaje, pregúntate: **¿podría enseñárselo tal cual a un usuario final?** Si la respuesta es no, reescríbelo.

#### Paso 6 · Tu propia anotación

1. Implementa `@PrioridadValida` y úsala en los dos DTO de tareas.
2. Crea una segunda anotación propia para una regla real de **tu** dominio. Algunas ideas: un código de proyecto con un formato concreto, un nombre sin caracteres especiales, una fecha que no sea festivo.
3. Añade a la colección una petición que la incumpla y comprueba que responde `400` con **tu** mensaje.
4. Escribe en las decisiones técnicas por qué esa regla merece una anotación propia en lugar de un `@Pattern`.

<p class="stage">Errores coherentes de API</p>

#### Paso 7 · Excepciones que hablan de tu dominio

Ahora mismo tu controlador devuelve `ResponseEntity.notFound().build()` desde dentro de un bucle. Mezcla dos cosas: **buscar** y **decidir qué responder**.

Sepáralas. Primero, una excepción propia:

```java
package com.ejemplo.gestor.error;

public class RecursoNoEncontradoException extends RuntimeException {

    public RecursoNoEncontradoException(String recurso, Object id) {
        super("No existe " + recurso + " con id " + id);
    }
}
```

Extiende `RuntimeException` para no tener que declararla en cada firma ni envolverla en `try`. Y el mensaje se construye en un solo sitio, así que todos los «no encontrado» de la API se redactan igual.

Con ella, el controlador se limita a decir la verdad y seguir:

```java
@GetMapping("/{id}")
public TareaResponse detalle(@PathVariable(name = "id") int id) {
    Tarea tarea = buscar(id);
    if (tarea == null) {
        throw new RecursoNoEncontradoException("tarea", id);
    }
    return TareaMapper.aRespuesta(tarea);
}
```

Fíjate en dos cambios: ya no devuelve `ResponseEntity`, porque **solo tiene un final posible**; y el caso de error es una línea que se lee como una frase.

#### Paso 8 · Centralizar la traducción de excepciones a respuestas HTTP

Copia estos records antes del manejador; cada declaración pública va en el archivo que indica su nombre:

```java
// error/CampoError.java
package com.ejemplo.gestor.error;
public record CampoError(String campo, String motivo) {}
```

```java
// error/ErrorResponse.java
package com.ejemplo.gestor.error;
import java.time.LocalDateTime;
import java.util.List;
public record ErrorResponse(LocalDateTime momento, int estado, String error,
        String mensaje, String ruta, List<CampoError> errores) {}
```

Comprueba que todos los métodos del manejador utilizan `List<CampoError>`. En el paso 10 se retira ErrorResponse, pero se conserva CampoError para los detalles de validación.

Antes del manejador, crea en el paquete `error` los tipos que utiliza: `CampoError(String campo, String motivo)` y `ErrorResponse(LocalDateTime momento, int estado, String error, String mensaje, String ruta, List<CampoError> errores)`, cada uno como record en su propio archivo. Importa `java.time.LocalDateTime` y `java.util.List` donde se necesitan. Después crea `ManejadorDeErrores.java` con el bloque completo. En el paso 10 evolucionará a ProblemDetail: esa evolución sustituye firmas y retorno, no añade un segundo manejador para la misma excepción.

<p class="term">@RestControllerAdvice</p>

Una clase que atiende las excepciones de **todos** los controladores. Cuando un método tuyo lanza algo y no lo captura nadie, Spring busca aquí quién sabe convertirlo en respuesta.

```java
package com.ejemplo.gestor.error;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class ManejadorDeErrores {

    private static final Logger log =
            LoggerFactory.getLogger(ManejadorDeErrores.class);

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> noEncontrado(
            RecursoNoEncontradoException ex, HttpServletRequest peticion) {

        return construir(HttpStatus.NOT_FOUND, ex.getMessage(),
                peticion, List.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> validacion(
            MethodArgumentNotValidException ex, HttpServletRequest peticion) {

        List<CampoError> campos = new ArrayList<>();
        for (var error : ex.getBindingResult().getFieldErrors()) {
            campos.add(new CampoError(
                    error.getField(), error.getDefaultMessage()));
        }
        return construir(HttpStatus.BAD_REQUEST,
                "Hay campos que no son válidos", peticion, campos);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> cuerpoIlegible(
            HttpMessageNotReadableException ex, HttpServletRequest peticion) {

        return construir(HttpStatus.BAD_REQUEST,
                "El cuerpo de la petición no es un JSON válido",
                peticion, List.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> inesperado(
            Exception ex, HttpServletRequest peticion) {

        log.error("Error no controlado en {}", peticion.getRequestURI(), ex);
        return construir(HttpStatus.INTERNAL_SERVER_ERROR,
                "Ha ocurrido un error inesperado", peticion, List.of());
    }

    private ResponseEntity<ErrorResponse> construir(
            HttpStatus estado, String mensaje,
            HttpServletRequest peticion,
            List<CampoError> campos) {

        ErrorResponse cuerpo = new ErrorResponse(
                LocalDateTime.now(), estado.value(),
                estado.getReasonPhrase(), mensaje,
                peticion.getRequestURI(), campos);

        return ResponseEntity.status(estado).body(cuerpo);
    }
}
```

<dl class="worked">
  <dt>Cómo elige Spring el manejador</dt>
  <dd>Por el tipo de la excepción, y siempre <strong>el más específico</strong>. Una <code>RecursoNoEncontradoException</code> encaja con el primero y también con el último, que atrapa cualquier <code>Exception</code>; gana el primero.</dd>
  <dt>Por qué el último existe</dt>
  <dd>Para que <strong>ningún</strong> fallo se escape con un formato ajeno. Sin él, un <code>NullPointerException</code> devolvería la página de error de Spring, que es otra forma distinta.</dd>
  <dt>Por qué el último no dice qué ha pasado</dt>
  <dd>Porque no se sabe si es seguro contarlo. El mensaje de una excepción inesperada puede incluir rutas de archivos, consultas o datos de otro usuario. <strong>Al cliente, un mensaje genérico; a la consola, todo.</strong></dd>
  <dt>Por qué se registra con <code>log.error</code></dt>
  <dd>Porque el cliente ya no recibe el detalle, así que si no queda escrito en el servidor, se pierde. Un <code>500</code> silencioso es un fallo que nadie podrá diagnosticar.</dd>
</dl>

<div class="rule">
  <p class="rule-label">La regla del 500</p>
  <p><strong>Nunca devuelvas una traza de excepción a un cliente.</strong> Le dice qué framework usas, qué versiones, cómo se llaman tus clases y a veces qué datos manejabas. Es información de regalo para quien busque un agujero, y ruido inútil para todos los demás.</p>
  <p>Ahora ya puedes quitar las dos propiedades <code>server.error.*</code> de ayer: eran el andamio, y esto es el edificio.</p>
</div>

#### Paso 9 · Antes y después

Repite los cinco errores del principio. Ahora los cinco responden igual:

```json
{
  "momento": "2026-09-02T10:14:22.831",
  "estado": 404,
  "error": "Not Found",
  "mensaje": "No existe tarea con id 999",
  "ruta": "/tareas/999",
  "errores": []
}
```

```json
{
  "momento": "2026-09-02T10:15:03.122",
  "estado": 400,
  "error": "Bad Request",
  "mensaje": "Hay campos que no son válidos",
  "ruta": "/tareas",
  "errores": [
    { "campo": "titulo", "motivo": "El título es obligatorio" },
    { "campo": "prioridad", "motivo": "La prioridad debe ser baja, media o alta" }
  ]
}
```

Ese es el formato que acabas de diseñar. Dentro de un momento lo pasaremos al estándar, y lo único que cambiará serán los nombres de los campos:

```json
{
  "type": "about:blank",
  "title": "Bad Request",
  "status": 400,
  "detail": "Hay campos que no son válidos",
  "instance": "/tareas",
  "momento": "2026-09-02T10:15:03.122",
  "invalidParams": [
    { "campo": "titulo", "motivo": "El título es obligatorio" },
    { "campo": "prioridad", "motivo": "La prioridad debe ser baja, media o alta" }
  ]
}
```

Mismo formato, campos siempre en el mismo sitio, mensajes en tu idioma y escritos por ti. Un cliente escribe el tratamiento una vez.

#### Paso 10 · El último paso · pasar tu formato al estándar

Convierte el manejador en este orden: importa `ProblemDetail` y `java.net.URI`; sustituye el método auxiliar `construir`; cambia los retornos de sus métodos públicos a `ProblemDetail`; comprueba que todos llaman al nuevo auxiliar. Mantén las anotaciones `@ExceptionHandler`. Ejecuta primero un 404 y luego un 400 con varios campos: los errores por campo deben seguir apareciendo en `invalidParams`, no perderse al cambiar el formato.

El cambio es pequeño, porque el diseño ya está hecho. Solo cambian los nombres de los campos:

| Tu `ErrorResponse` | El estándar RFC 7807 | Qué cambia |
| :--- | :--- | :--- |
| `estado` | `status` | Solo el nombre |
| `error` | `title` | Solo el nombre |
| `mensaje` | `detail` | Solo el nombre |
| `ruta` | `instance` | Solo el nombre |
| `momento` | propiedad extra | No es campo del estándar: se añade aparte |
| `errores` | propiedad extra | Tampoco lo es; la llamaremos `invalidParams` |

Spring trae la clase `ProblemDetail` de serie. No hay que añadir ninguna dependencia: elimina tu `ErrorResponse` y sustituye el método `construir` por este.

```java
import org.springframework.http.ProblemDetail;

    private ProblemDetail construir(
            HttpStatus estado, String mensaje,
            HttpServletRequest peticion,
            List<CampoError> campos) {

        ProblemDetail problema = ProblemDetail.forStatusAndDetail(estado, mensaje);
        problema.setTitle(estado.getReasonPhrase());
        problema.setInstance(URI.create(peticion.getRequestURI()));

        // Lo que el estándar no cubre se añade como propiedad extra, y
        // aparece en el JSON al mismo nivel que las demás.
        problema.setProperty("momento", LocalDateTime.now());
        if (!campos.isEmpty()) {
            problema.setProperty("invalidParams", campos);
        }
        return problema;
    }
```

Cambia también el tipo de retorno de los cuatro manejadores, de `ResponseEntity<ErrorResponse>` a `ProblemDetail`. Ya no hace falta envolver nada en un `ResponseEntity`: Spring lee el `status` del propio `ProblemDetail` y lo usa como código de la respuesta.

Repite el `404` y el `400` y compara con lo que devolvías antes:

```json
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "No existe tarea con id 999",
  "instance": "/tareas/999",
  "momento": "2026-09-02T10:14:22.831"
}
```

Fíjate en dos cosas que no estaban:

1. **El campo `type`.** Es una URI que identifica *la clase de problema*, no esta ocurrencia concreta. `about:blank` significa «no tengo nada más que decir que el código HTTP». Si algún día documentas tus errores de negocio, aquí va el enlace a esa documentación.
2. **La cabecera `Content-Type` ya no es `application/json`, sino `application/problem+json`.** Compruébalo en la pestaña de cabeceras. Es lo que permite a un cliente distinguir un error estructurado de una respuesta normal sin mirar el código de estado.

<div class="rule">
  <p class="rule-label">Por qué hemos hecho el rodeo</p>
  <p>Podríamos haber empezado por <code>ProblemDetail</code> y ahorrarnos la clase propia. Pero entonces habrías copiado un formato sin saber por qué tiene esos campos y no otros.</p>
  <p>Haberlo diseñado tú primero es lo que hace que ahora reconozcas <code>detail</code> como «qué ha ocurrido» y <code>instance</code> como «qué se estaba pidiendo», en lugar de memorizar cinco nombres en inglés. <strong>El estándar se entiende mejor después de haber tenido el problema que resuelve.</strong></p>
  <p>A partir de aquí, todo el curso usa este formato: los tests de la UD7 comprobarán <code>$.title</code> y <code>$.status</code>, la seguridad de la UD9 devolverá <code>401</code> y <code>403</code> con esta forma, y el cliente Angular de la UD12 leerá <code>detail</code> para mostrarlo en pantalla.</p>
</div>

#### Paso 11 · El error que faltaba · el conflicto

Después de crear ConflictoException, añade este método al ManejadorDeErrores ya convertido a ProblemDetail:

```java
@ExceptionHandler(ConflictoException.class)
public ProblemDetail conflicto(ConflictoException ex) {
    return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
}
```

Provoca la regla de conflicto y comprueba 409. Sin este método específico, el manejador genérico de Exception devolvería 500.

Hay una familia de errores que tu API todavía no sabe expresar: cuando la petición es correcta pero **choca con el estado actual de los datos**.

Ejemplos: crear un proyecto con un nombre que ya existe, o borrar un proyecto que aún tiene tareas.

No es un `400`, porque el cuerpo es válido. No es un `404`, porque el recurso existe.

<p class="term">409 Conflict</p>

La petición se entiende y es válida, pero no se puede aplicar en el estado actual del recurso.

```java
public class ConflictoException extends RuntimeException {

    public ConflictoException(String mensaje) {
        super(mensaje);
    }
}
```

Añade su manejador con `HttpStatus.CONFLICT` y úsalo, por ejemplo, para impedir dos proyectos con el mismo nombre.

#### Paso 12 · Unifica toda tu API

1. Crea el paquete `error` con las tres clases y el manejador.
2. Sustituye **todos** los `ResponseEntity.notFound()` por la excepción.
3. Simplifica las firmas: los métodos que ya solo tienen un final devuelven el DTO directamente.
4. Añade `ConflictoException` y una regla que la use.
5. Quita las propiedades `server.error.*`.
6. Provoca los cinco errores del principio y comprueba que los cinco tienen la misma forma.
7. Haz la migración a `ProblemDetail` del apartado anterior y vuelve a provocarlos: los cinco deben seguir teniendo la misma forma, ahora con los nombres del estándar y la cabecera `Content-Type: application/problem+json`. Guarda las cinco peticiones en tu colección: son las que la UD7 convertirá en tests automáticos.

#### Paso 13 · Comprobar y registrar el resultado de vuestro proyecto

1. Comprueba regla propia, comparación entre campos, recurso ausente y conflicto. Deben devolver estados adecuados y la misma estructura de error, con mensajes que permitan corregir la petición.
2. Provoca una entrada mal formada y verifica que también se presenta de forma coherente. No expongas detalles internos ni la traza de Java en el contrato público.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · La regla que no se deja validar

1. Coge la regla «una tarea solo puede pertenecer a un proyecto que exista» e **intenta** implementarla como anotación propia. Llega hasta donde puedas.
2. Vas a chocar con un muro concreto. Descríbelo: ¿qué necesita el validador que no tiene?
3. Investiga si Spring permitiría dárselo, y en caso afirmativo explica **por qué seguiría siendo mala idea** meter ahí esa comprobación. Piensa en qué pasa cuando esa misma regla se necesita en una operación que no venga de una petición HTTP.
4. Propón dónde debería vivir la comprobación y qué código de estado debería producir. Argumenta entre `400` y `404`.

Este reto no tiene una solución cerrada y es el que más se parece a una discusión de equipo real.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Mensajes visibles y reescritos en todos los DTO de entrada, aplicando las cuatro reglas.</span></div>
  <div><strong>Si lo tienes</strong><span><code>@PrioridadValida</code> implementada y en uso, más una segunda anotación de tu dominio con su prueba.</span></div>
  <div><strong>Reto</strong><span>El muro del validador descrito, y la comprobación de existencia situada y argumentada.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que se puede actuar sobre él sin consultar nada más, e incluso enseñárselo tal cual al usuario final. Decir «longitud inválida» obliga a buscar cuál es la longitud correcta.</p>
  <p>2 · Porque cada restricción comprueba una sola cosa: la obligatoriedad es trabajo de <code>@NotNull</code>. Si además rechazara los nulos, no podría usarse en un campo opcional como los del <code>PATCH</code>.</p>
  <p>3 · Sobre la clase, con <code>@Target(TYPE)</code>, porque necesita ver el objeto completo para comparar sus campos.</p>
  <p>4 · Porque el valor incorrecto deja de ser representable: no hace falta escribir ni mantener una regla para algo que el tipo ya impide.</p>
</details>

##### Reto · La prueba de que no se escapa nada

1. Añade a la colección **una comprobación de formato** para cada error: que existan las claves `estado`, `mensaje` y `ruta`.
2. Escribe un endpoint temporal que lance una excepción a propósito:

```java
@GetMapping("/boom")
public String boom() {
    throw new IllegalStateException("Contraseña de la base de datos: 1234");
}
```

3. Llámalo y comprueba dos cosas: que el cliente recibe `500` con **tu** formato, y que **ese texto no aparece por ninguna parte de la respuesta**.
4. Comprueba que sí aparece en la consola del servidor.
5. Borra el endpoint y explica en las decisiones técnicas qué habría pasado si el manejador genérico devolviera `ex.getMessage()`.

El paso 3 es el que hay que ver con los propios ojos. Es la diferencia entre entender la regla del 500 y creérsela.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>El manejador con los cuatro casos y todos los <code>404</code> pasando por la excepción propia.</span></div>
  <div><strong>Si lo tienes</strong><span>Los cinco errores unificados, el conflicto implementado y las propiedades provisionales retiradas.</span></div>
  <div><strong>Reto</strong><span>La comprobación de formato en la colección y la demostración de que el mensaje interno no sale.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que escribe el tratamiento de errores una sola vez y le sirve para todos los endpoints, incluidos los que todavía no existen.</p>
  <p>2 · Porque el mensaje de una excepción inesperada puede contener rutas, consultas o datos internos. Al cliente se le da un mensaje genérico y el detalle se queda en el servidor.</p>
  <p>3 · Cuando la petición es válida y comprensible pero choca con el estado actual de los datos: un nombre repetido, un borrado que dejaría datos huérfanos.</p>
  <p>4 · En el registro del servidor, escrito por el manejador con <code>log.error</code>. Si no se registra ahí, se pierde y el fallo será indiagnosticable.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Las respuestas 400, 404 y 409 tienen una estructura coherente y mensajes útiles, sin trazas internas.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Sesión 14 · Publicar el contrato que consumirá el portfolio

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [el ci del repositorio de servidor](/es/docencia/proyecto-intermodular/ud4-poner-el-backend-en-produccion/sesion-7/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

La API ya tiene rutas, DTO, validaciones y errores definidos. Hoy consolidarás el contrato que utilizará el cliente de Intermodular. Publicar aquí significa dejar una versión identificable y comprobable; el procedimiento de despliegue se trabaja en el otro módulo.

#### Correcto no es lo mismo que coherente

Cada endpoint que has escrito estas tres semanas está bien por separado. Y aun así, una API puede fallar en el conjunto de una forma que ninguna prueba individual detecta:

<figure class="diagram">
  <figcaption>Incoherencias que solo se ven mirando el conjunto</figcaption>
  <ol class="flow flow--before">
    <li>Un recurso se llama en plural y otro en singular</li>
    <li>Un endpoint devuelve <code>201</code> con <code>Location</code> y otro se olvida de la cabecera</li>
    <li>Una fecha viaja como texto ISO en un sitio y como número en otro</li>
    <li>Un recurso valida el nombre y otro, con el mismo campo, no lo valida</li>
    <li class="is-error">Un error llega con tu formato y otro con el de Spring, porque quedó un <code>ResponseEntity</code> suelto</li>
  </ol>
</figure>

Todas son «pequeñas». Todas obligan a quien consume la API a **tratar cada endpoint como un caso especial**, que es exactamente lo que la unidad quería evitar.

#### Coherencia entre endpoints

Dos operaciones pueden pasar sus pruebas individuales y, aun así, formar una API incoherente. Por ejemplo, un alta puede devolver errores con un campo llamado mensaje y una modificación devolver una página HTML. El cliente tendría que programar una estrategia distinta para cada ruta. Hoy comprobamos que los patrones de respuesta, validación y nombres se mantienen a través de todo el contrato.

Una auditoría útil parte de la tabla de endpoints. Para cada uno se comparan entrada válida, entrada inválida, ausencia del recurso y conflicto cuando corresponda. No todos los endpoints necesitan todos los casos: se justifica cuáles aplican. El resultado se guarda en la colección HTTP, no solo en una captura de pantalla.

Intermodular consumirá esta misma API. Por eso se entregan una URL base configurable, ejemplos de petición y respuesta y una versión del repositorio que compila. A partir de este punto, renombrar un campo publicado es también una decisión que afecta al cliente; el cambio se comunica y se comprueba en ambas piezas.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Ejecuta la colección y abre el README, los DTO y el manejador de errores. Identifica el commit desde el que parte la revisión.
2. Contrasta cada ruta consumida por el portfolio con su petición y respuesta reales. Anota los cambios que todavía no se han comunicado al cliente.
3. Prepara los casos de alta válida, validación, ausencia y conflicto con datos de tu dominio.

#### Paso 2 · La segunda auditoría

Vuelve a la rúbrica de la sesión 9, la misma tabla, sin cambiar ni un criterio:

| # | Criterio | Sesión 9 | Hoy |
| :---: | :--- | :---: | :---: |
| 1 | Ninguna ruta contiene un verbo | | |
| 2 | Cada recurso tiene una URL propia y estable | | |
| 3 | Las colecciones se nombran en plural | | |
| 4 | La acción la expresa siempre el método HTTP | | |
| 5 | `GET` nunca modifica nada | | |
| 6 | Cada final posible tiene su código de estado | | |
| 7 | Los recursos relacionados se expresan con jerarquía | | |
| 8 | El mismo tipo de dato se representa igual en todos los endpoints | | |
| 9 | La API no publica campos internos del modelo | | |
| 10 | Las respuestas incluyen enlaces a operaciones relacionadas | | |

Rellena las dos columnas y **quédate con la diferencia**: es la medida de lo que has aprendido en tres semanas, y forma parte de la entrega.

El criterio 10 debe seguir siendo «no», y tienes que poder decir por qué sin que suene a excusa.

#### Paso 3 · Especificación · el estado final de la API

Tu API tiene que cumplir esto por completo.

##### Estructura del proyecto

```text
com.ejemplo.gestor
├── controller     · recibe y responde, nada más
├── dto            · lo que se acepta y lo que se publica
├── mapper         · el único sitio que traduce
├── model          · lo que maneja tu código
├── validacion     · anotaciones propias
└── error          · excepciones, formato y manejador
```

##### Recursos y rutas

| Método y ruta | Caso | Respuesta |
| :--- | :--- | :--- |
| `GET /proyectos` | Con filtros opcionales | `200` con array |
| `GET /proyectos/{id}` | Existe / no existe | `200` / `404` |
| `POST /proyectos` | Válido / inválido | `201` con `Location` / `400` |
| `PUT /proyectos/{id}` | Válido / no existe | `200` / `404` |
| `PATCH /proyectos/{id}` | Válido / no existe | `200` / `404` |
| `DELETE /proyectos/{id}` | — | `204` |
| `GET /proyectos/{id}/tareas` | Proyecto existe / no existe | `200` / `404` |
| `GET /tareas` | Con filtros opcionales | `200` con array |
| `GET /tareas/{id}` | Existe / no existe | `200` / `404` |
| `POST /tareas` | Válido / inválido | `201` con `Location` / `400` |
| `PUT /tareas/{id}` | Válido / no existe | `200` / `404` |
| `PATCH /tareas/{id}` | Válido / no existe | `200` / `404` |
| `DELETE /tareas/{id}` | — | `204` |

##### Reglas que se comprueban

1. Ninguna ruta lleva verbos y todas las colecciones están en plural.
2. Ningún `@RequestBody` recibe una clase del modelo.
3. Ningún endpoint devuelve una clase del modelo.
4. Toda la traducción vive en el paquete `mapper`.
5. Toda entrada de creación y sustitución lleva `@Valid`.
6. Todos los mensajes de validación están en español y dicen qué corregir.
7. Existe al menos una anotación de validación propia.
8. **Todos** los errores, sin excepción, tienen el mismo formato.
9. Ningún controlador construye una respuesta de error.
10. Un `500` no revela nada del interior.
11. Existe al menos un caso que responda `409`.

<details class="aside aside--help">
  <summary>Estoy atascado · me quedan errores con formato distinto</summary>
  <p>Busca en tu código <code>ResponseEntity.notFound</code>, <code>ResponseEntity.badRequest</code> y <code>ResponseEntity.status</code>. Cada aparición dentro de un controlador es un error que no pasa por tu manejador.</p>
  <p>Y prueba los caminos raros: una ruta que no existe, un método no permitido, un <code>Content-Type</code> incorrecto. Alguno de esos ni siquiera llega a un controlador tuyo, así que piensa qué excepción lanza Spring y si tu manejador la cubre.</p>
</details>

#### Paso 4 · La colección de aceptación

Reutiliza la colección de la sesión 8. Crea una carpeta para errores y guarda un caso por comportamiento: cuerpo ilegible, campo inválido, regla propia, id inexistente y conflicto. En cada petición comprueba estado y los campos `status`, `detail` e `instance` de ProblemDetail; para validación comprueba también el campo rechazado. Prepara primero los registros necesarios para provocar conflictos y usa sus ids reales. Ejecuta también los casos correctos para comprobar que el manejador no los altera.

#### Paso 5 · Preparar la evidencia de esta versión

1. **El proyecto**, con la estructura de paquetes de la especificación.
2. **La colección exportada**, en `pruebas/`.
3. **la auditoría**: la rúbrica con sus dos columnas y un párrafo comentando la diferencia.
4. **las decisiones técnicas**, ampliado con estas cinco:
   * Qué campos dejaste fuera de cada DTO de entrada y de salida, y por qué.
   * Qué anotación de validación propia escribiste y por qué no bastaba `@Pattern`.
   * Qué formato de error elegiste y qué campo añadirías si tuvieras que depurar un fallo reportado por un cliente.
   * Qué caso de tu API responde `409` y por qué no es un `400` ni un `404`.
   * Por qué tu API se queda en el nivel 2 y no implementa hipermedia.

#### Paso 6 · Autoevaluación · el examen de coherencia

Esta lista no mira endpoints sueltos: mira el conjunto. Pásatela con la API delante.

| Comprobación | Cómo se verifica |
| :--- | :--- |
| Nombres uniformes | Lista todas tus rutas seguidas y léelas de un tirón. ¿Alguna desentona? |
| Representaciones uniformes | ¿Un mismo campo se llama igual en todos los recursos donde aparece? |
| Tipos uniformes | ¿Las fechas viajan siempre igual? ¿Los booleanos? |
| Códigos uniformes | ¿Dos operaciones equivalentes en recursos distintos devuelven lo mismo? |
| Errores uniformes | ¿Los seis errores tienen la misma forma? |
| Validación uniforme | ¿Un campo con el mismo significado tiene las mismas reglas en los dos recursos? |

La fila de la validación es la que más suspende. Es muy fácil validar a fondo el recurso con el que empezaste y dejar el segundo a medias.

#### Paso 7 · Lo que sigue haciendo mal, y es mucho

Esto ya no son defectos del contrato: **el contrato está bien**. Lo que está mal es lo que hay detrás.

Abre tu `TareaController` y cuenta lo que hace:

<figure class="diagram">
  <figcaption>Todo lo que hace hoy un solo controlador</figcaption>
  <ol class="flow flow--before">
    <li>Recibe la petición y devuelve la respuesta</li>
    <li>Guarda la lista de tareas como atributo</li>
    <li>Lleva la cuenta del siguiente identificador</li>
    <li>Busca, filtra y recorre</li>
    <li>Decide reglas de negocio, como que una tarea nace sin completar</li>
    <li class="is-error">Y todo eso se pierde entero al reiniciar</li>
  </ol>
</figure>

| Lo que está mal | Se arregla en |
| :--- | :--- |
| El controlador guarda los datos y lleva la lógica | UD4, con capas |
| No hay forma de reutilizar una regla en dos endpoints | UD4, con un service |
| Nada comprueba la lógica sin arrancar el servidor | UD4, con los primeros tests |
| La regla «el proyecto debe existir» sigue sin sitio | UD4 |
| Al reiniciar se pierde todo | UD5, con PostgreSQL |

Esa cuarta fila viene de la sesión 13: la encontraste, viste por qué una anotación no podía resolverla, y desde entonces está esperando. En la UD4 tendrá por fin dónde vivir.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las trece filas cumplidas, la estructura de paquetes y todos los errores unificados.</span></div>
  <div><strong>Si lo tienes</strong><span>La colección de aceptación con sus seis errores comprobados y la auditoría con sus dos columnas.</span></div>
  <div><strong>Reto</strong><span>El examen de coherencia superado en las seis filas, incluida la validación uniforme entre recursos.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Las incoherencias del conjunto: nombres, tipos, códigos o validaciones que difieren entre recursos. Cada endpoint es correcto por separado y la API obliga a tratarlos como casos especiales.</p>
  <p>2 · Uno: el manejador. Si sale más de uno, queda trabajo.</p>
  <p>3 · Guardar los datos, generar identificadores, buscar y filtrar, y decidir reglas de negocio. Un controlador debería recibir la petición, delegar y responder.</p>
  <p>4 · Porque la hipermedia añade complejidad al servidor que muy pocos clientes aprovechan, y es una decisión de coste y beneficio tomada a conciencia.</p>
</details>

#### Paso 8 · Comprobar y registrar el resultado de vuestro proyecto

1. Otra persona debe poder ejecutar la colección y obtener las respuestas documentadas sin preguntarte qué campos o ids escribir.
2. Deja enlazados la versión del contrato y los cambios que afecten al cliente. El backend continúa en memoria hasta la UD5; documenta esa limitación.

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

El repositorio compila y el contrato queda disponible para el CI y el despliegue de Intermodular; los cambios siguientes se comunican al cliente.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Lo que debes recordar

### El método

La secuencia crece otra vez. Estos son los pasos de la UD1 y la UD2 con los tres que añade el diseño:

<figure class="diagram">
  <figcaption>Cómo se diseña un endpoint, versión completa</figcaption>
  <ol class="flow">
    <li><strong>¿De qué cosa hablo?</strong> Un sustantivo, en plural si es colección. Nunca un verbo</li>
    <li>¿Qué le hago? Eso elige el método HTTP, y con él si es idempotente</li>
    <li>¿Qué datos necesito? Ruta si identifican, query si filtran, cuerpo si son contenido</li>
    <li><strong>¿Qué acepto y qué publico?</strong> Dos listas distintas, dos clases distintas</li>
    <li><strong>¿Qué tiene que cumplir lo que llega?</strong> Y qué digo cuando no lo cumple</li>
    <li>¿Cómo puede terminar esto? Cada final, su código de estado</li>
    <li>¿Cómo demuestro que sigue funcionando mañana?</li>
  </ol>
</figure>

El paso uno decide más que ningún otro: si eliges bien el sustantivo, los cinco métodos HTTP te dan la mitad de la API sin pensar. Si eliges un verbo, cada funcionalidad nueva te obligará a inventar una ruta.

### La idea más importante

> **Tu API es una promesa, y las promesas se hacen a alguien que no está delante. Todo lo que obligue a preguntarte algo es un defecto de diseño, aunque funcione perfectamente.**

De ahí sale la unidad entera. Por eso las rutas se nombran para que se puedan adivinar, por eso el modelo no se publica, por eso un `400` dice qué campo corregir, y por eso todos los errores tienen la misma forma: **para que nadie tenga que escribirte**.

<p class="term">Lo que cambia por dentro y lo que se promete fuera son dos cosas</p>

Modelo, DTO y mapper existen por esa frase. El modelo cambia cuando cambia tu código; el contrato cambia cuando decides romper una promesa. Si son la misma clase, cualquier refactorización es una promesa rota sin querer.

### Las decisiones que tienes que saber justificar

| Decisión | Lo que tienes que poder decir |
| :--- | :--- |
| La ruta lleva sustantivos | La acción ya la expresa el método; con verbos, la API deja de ser adivinable |
| Ruta anidada o filtro | Anidada si el recurso pertenece a otro; filtro si acota una colección propia |
| Una acción que no es CRUD | Primero cambio de estado, luego recurso nuevo, y solo entonces acción explícita |
| Tres clases por recurso | Lo que acepto, lo que manejo y lo que publico tienen motivos de cambio distintos |
| El DTO de entrada como lista blanca | Lo que no existe en la clase no se puede asignar: previene el *mass assignment* |
| Tipos envoltorio en los DTO | Un primitivo no distingue «ausente» de su valor por defecto |
| Un solo mapper | Con dos sitios que traducen, el mismo recurso acaba publicándose de dos formas |
| Validar en el DTO, no en el modelo | El DTO es la frontera con lo que no es de fiar; el modelo lo construye tu código |
| Mensajes que dicen qué se espera | Un mensaje accionable se puede enseñar al usuario final sin traducirlo |
| Un único formato de error | Quien consume escribe el tratamiento una vez y le sirve para toda la API |
| El `500` no cuenta nada | El mensaje de una excepción puede filtrar rutas, consultas o datos ajenos |
| Nivel 2 y no hipermedia | Coste alto y beneficio bajo con los clientes reales; es una decisión, no un olvido |

### Al terminar deberías poder responder

1. ¿Por qué devolver JSON no convierte una API en REST?
2. ¿Qué tres restricciones de REST cumples solo por usar HTTP bien?
3. ¿Qué distingue el nivel 1 del nivel 2, y el 2 del 3?
4. ¿Por qué una URL no debe contener un verbo?
5. ¿Cuándo se usa ruta anidada y cuándo un filtro?
6. Enumera las tres estrategias para exponer algo que no es CRUD, en orden.
7. ¿Qué diferencia hay entre un recurso, un modelo y una representación?
8. Nombra un campo que entra y no sale, y otro que sale y no entra.
9. ¿Qué es el *mass assignment* y por qué un DTO de entrada lo previene?
10. ¿Por qué un DTO de modificación usa `Boolean` y no `boolean`?
11. ¿Qué fallo concreto produce tener la conversión repartida en dos sitios?
12. ¿Por qué el mapper conoce el modelo y el DTO no?
13. ¿Qué comprueba una prueba de ida y vuelta que no comprueba un código de estado?
14. ¿Por qué la validación del navegador no protege nada?
15. Las anotaciones de validación no hacen nada. ¿Qué compruebas primero?
16. Diferencia entre `@NotNull`, `@NotEmpty` y `@NotBlank`, con un valor que las separe.
17. ¿Por qué un validador propio debe dejar pasar el nulo?
18. ¿Por qué un `enum` es mejor que validar un texto?
19. ¿Qué reglas no puede comprobar Bean Validation, y por qué?
20. ¿Por qué el manejador genérico no devuelve el mensaje de la excepción?
21. ¿Cuándo se responde `409` en lugar de `400` o `404`?
22. ¿Qué tipo de fallo no detecta ninguna prueba de un endpoint aislado?

Si además puedes coger un dominio nuevo y escribir su contrato de recursos, sus DTO, sus reglas y su formato de error antes de programar nada, tienes lo que esta unidad quería darte.

### El vocabulario de la unidad

| Concepto | Significa |
| :--- | :--- |
| REST | Estilo de arquitectura, no un protocolo ni una librería ni un formato |
| Interfaz uniforme | Que todos los recursos se identifiquen y manipulen con las mismas reglas |
| Niveles de madurez | El mapa de 0 a 3 que sitúa cualquier API |
| Hipermedia | El nivel 3: respuestas que incluyen los enlaces a lo que se puede hacer después |
| Recurso | Una cosa del dominio a la que se le puede dar una dirección |
| Colección | El conjunto de recursos de un tipo, en plural: `/tareas` |
| Ruta anidada | La que expresa pertenencia: `/proyectos/7/tareas` |
| Representación | El JSON concreto que viaja, con los campos que has decidido publicar |
| DTO | Clase cuyo único trabajo es transportar datos entre dos sitios |
| DTO de entrada | Lo que la API acepta. Funciona además como lista blanca |
| DTO de salida | Lo que la API publica |
| *Mass assignment* | Que el cliente asigne un campo que no debería poder tocar |
| Mapper | El único sitio del proyecto que traduce entre DTO y modelo |
| Prueba de ida y vuelta | Comprobar que un dato sobrevive al circuito completo de conversiones |
| Bean Validation | El estándar de restricciones declarativas: `@NotBlank`, `@Size`, `@Pattern` |
| `@Valid` | Lo que activa la comprobación de esas restricciones |
| Restricción propia | Anotación que expresa una regla del dominio, con su validador |
| Regla de negocio | La que necesita consultar datos para decidir. No es validación de formato |
| `@RestControllerAdvice` | La clase que atiende las excepciones de todos los controladores |
| `@ExceptionHandler` | El método que convierte un tipo de excepción en una respuesta |
| `409 Conflict` | Petición válida que choca con el estado actual de los datos |
| *Problem Details* | El estándar RFC 9457 para el cuerpo de un error, con su `ProblemDetail` en Spring |

### Comprobación final del producto

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación final · con el proyecto delante</p>
  <ul class="checklist">
    <li>Ninguna ruta lleva verbos y todas las colecciones están en plural.</li>
    <li>Ningún <code>@RequestBody</code> recibe una clase del modelo y ningún endpoint la devuelve.</li>
    <li>Toda la traducción vive en el paquete <code>mapper</code>.</li>
    <li>Un cuerpo vacío responde <code>400</code> nombrando los campos que faltan, en español.</li>
    <li>Existe al menos una anotación de validación propia.</li>
    <li>Los seis tipos de error tienen exactamente la misma forma.</li>
    <li>Un <code>500</code> no revela nada del interior y deja la traza en la consola.</li>
    <li>La auditoría de la sesión 9 y la de la sesión 14 están las dos escritas.</li>
  </ul>
</div>

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

### La siguiente unidad

Tres unidades, tres preguntas. Ya están las tres respondidas:

<figure class="diagram">
  <figcaption>Lo que se ha preguntado hasta aquí</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>UD1 · que responda</li>
    <li>UD2 · que responda correctamente</li>
    <li>UD3 · que esté bien diseñada</li>
  </ol>
</figure>

Y hay una cuarta que no se ha tocado todavía:

> **¿Y esto quién lo mantiene?**

Porque el contrato de tu API está bien, y detrás de él hay un controlador que guarda los datos, genera identificadores, busca, filtra y decide reglas de negocio. Todo junto, en una clase, sin una sola prueba que compruebe la lógica sin arrancar un servidor.

| Lo que sigue mal | Se arregla en |
| :--- | :--- |
| El controlador hace de todo | UD4, con capas |
| Una regla no se puede reutilizar en dos endpoints | UD4, con un service |
| Nada comprueba la lógica sin levantar la aplicación | UD4, con los primeros tests |
| «El proyecto debe existir» sigue sin tener sitio | UD4 |
| Al reiniciar se pierde todo | UD5, con PostgreSQL |

Fíjate en la cuarta fila. Esa regla la encontraste tú en la sesión 13, viste por qué una anotación de validación no podía resolverla y la dejaste apuntada. Lleva dos sesiones esperando un sitio donde vivir, y en la unidad siguiente lo encontrará.

Y aquí se cobra el trabajo de estas tres semanas: la UD4 **no va a cambiar ni una ruta, ni un DTO, ni un código de estado**. Va a reorganizar lo que hay detrás sin tocar el contrato. Tu colección de pruebas, que ya cubre la API entera, será exactamente lo que demuestre que no has roto nada por el camino.

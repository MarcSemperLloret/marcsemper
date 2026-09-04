---
title: "Desarrollo del MVP"
label: "UD9 · Construir"
section: "ud-09"
order: 9
lang: "es"
summary: "Construir el producto integrando backend, persistencia, API, frontend y autenticación sin repetir los contenidos de los otros módulos."
duration: "12 horas · 4 semanas · 4 sesiones"
modality: "Guía longitudinal · desarrollo por hitos"
deliverable: "Primera versión funcional del MVP."
date: "2026-08-31"
outcomes:
  - "Preparar una base ejecutable y avanzar por cortes verticales."
  - "Integrar backend, base de datos y frontend."
  - "Incorporar autenticación y cerrar el alcance del MVP."
  - "Usar enlaces de recuperación a otros módulos cuando haga falta."
requirements:
  - "Repositorio y roadmap de la UD8."
  - "Avance suficiente en los módulos técnicos relacionados."
priorKnowledge:
  - "Git, Angular, Spring Boot, PostgreSQL y APIs según el momento del curso."
---

<p class="lead">Aquí cambia el funcionamiento: Proyecto Intermodular no vuelve a enseñar JPA, Angular o REST; los exige, enlaza su material de referencia y acompaña la integración.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje bajo. La guía marca hitos y criterios, no una secuencia de código común para todos los proyectos.</p>
</div>

<div class="rule">
  <p class="rule-label">Cómo se usan estas cuatro semanas</p>
  <p>Las tres horas semanales no bastan para construir un producto, y no es lo que se pretende. Aquí se revisa el hito de la semana, se diagnostica lo que está atascado y se decide qué se recorta. El código se escribe en las horas de los demás módulos y fuera de clase. Un equipo que llega a la sesión sin haber tocado el proyecto desde la anterior no tiene nada que revisar y pierde la semana.</p>
</div>

<div class="rule">
  <p class="rule-label">Los cuatro hitos</p>
  <p>Semana 15, una petición viaja entera. Semana 16, las reglas funcionan y hay algo desplegado. Semana 17, el frontend real conectado. Semana 18, autenticación, permisos y MVP cerrado. Los hitos no se negocian; lo que se negocia es cuántas funcionalidades caben dentro de cada uno.</p>
</div>

## Sesión 15 · La primera petición de punta a punta

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué significa exactamente «de punta a punta», en qué orden se construye el primer corte y cómo se depura una petición que no llega.</li>
    <li><strong>2. Haz:</strong> Consigue que una única operación real recorra pantalla, API, base de datos y vuelta, por fea que quede.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el checkpoint de la sesión 15.</li>
  </ol>
</div>

### El hito de hoy no es una pantalla

Es tentador empezar por lo que se ve, porque es lo que da sensación de avance. Y es la razón por la que tantos proyectos llegan a marzo con un frontend precioso que no habla con nada.

<div class="compare-pair">
  <div>
    <p class="compare-label">Lo que parece avanzar</p>
    <p class="compare-body">Cuatro pantallas maquetadas con datos escritos a mano. Se puede enseñar y no demuestra nada: eso ya lo teníais en la semana 8.</p>
  </div>
  <div>
    <p class="compare-label">Lo que avanza de verdad</p>
    <p class="compare-body">Una sola pantalla fea desde la que se crea un préstamo que queda guardado en la base de datos y vuelve pintado. Feo, y el proyecto ya existe.</p>
  </div>
</div>

<p class="term">Corte vertical mínimo</p>

Una operación, la más sencilla del MVP, funcionando a través de todas las capas del sistema. Su valor no es la funcionalidad: es que demuestra que el montaje entero funciona.

### Qué cuenta como «de punta a punta»

Seis puntos, y hacen falta los seis. Cinco de seis no es «casi»: es que todavía no sabéis si funciona.

<ol class="fill-in">
  <li>Hay una pantalla real, servida por el frontend, no una petición lanzada desde una herramienta.</li>
  <li>La petición sale del navegador y llega al servidor.</li>
  <li>El servidor la entiende: los datos llegan como el contrato de la semana 12 decía.</li>
  <li>Algo queda guardado en la base de datos, y se puede comprobar consultándola directamente.</li>
  <li>La respuesta vuelve con la forma que el contrato prometía.</li>
  <li>La pantalla muestra el resultado sin recargarse a mano.</li>
</ol>

### En qué orden

<p class="stage">Paso 1 · Te enseño uno</p>

El primer corte de PrestaTaller es la tarea T1 de la semana 14: crear un préstamo, camino feliz.

<dl class="worked">
  <dt>Primero, que arranque</dt>
  <dd>Backend, base de datos y frontend levantándose con las instrucciones del README. Nada más. Si alguien del equipo no consigue arrancarlo, esto es lo único que importa hoy.</dd>
  <dt>Segundo, el camino más corto posible</dt>
  <dd>Una operación del contrato, la más simple. Sin validaciones, sin errores, sin permisos, sin estilos. El objetivo es que el dato llegue y vuelva.</dd>
  <dt>Tercero, comprobarlo por el otro lado</dt>
  <dd>Consultar la base de datos directamente y ver la fila. Mientras no se haya visto la fila, no se sabe si se ha guardado: la respuesta correcta del servidor no lo demuestra.</dd>
  <dt>Cuarto, y solo entonces</dt>
  <dd>Enseñarlo al equipo y cerrar la issue. A partir de aquí las tres tareas siguientes son variaciones sobre un camino que ya existe, y van muy deprisa.</dd>
  <dt>Lo que NO se hace hoy</dt>
  <dd>Ni autenticación, ni control de errores, ni maquetación, ni las otras siete historias. Todo eso es más fácil sobre un camino que funciona, y casi imposible sobre uno que no se ha probado.</dd>
</dl>

### Dónde se atasca todo el mundo

La primera integración falla siempre, y casi siempre por las mismas cosas. Esta tabla no sustituye a lo que se estudia en los módulos técnicos: sirve para saber **dónde mirar** antes de perder una tarde.

| Síntoma | Causa probable | Dónde se estudia |
| ------- | -------------- | ---------------- |
| El navegador bloquea la petición y habla de origen cruzado | El servidor no permite el origen desde el que llama el frontend | Entorno Servidor · Despliegue |
| La petición no llega a ninguna parte | Puerto equivocado, servidor caído, o dirección escrita a mano en el frontend | Entorno Cliente |
| El servidor responde que no encuentra la ruta | La ruta del contrato y la implementada no coinciden | Vuestro contrato de la semana 12 |
| Llega la petición pero los datos vienen vacíos | El nombre de los campos no coincide con el contrato, o falta el tipo de contenido | Entorno Servidor |
| Las fechas llegan con un día u hora de diferencia | Zonas horarias y formato de fecha entre cliente, servidor y base de datos | Bases de Datos · Entorno Servidor |
| Responde correctamente pero no hay nada guardado | La transacción no se confirma, o se está guardando en una base distinta de la que miráis | Bases de Datos |
| Funciona en un portátil y no en otro | Configuración local no documentada en el README | Este módulo · semana 14 |

<div class="rule">
  <p class="rule-label">La última fila es la más cara</p>
  <p>«En mi máquina funciona» no es una anécdota: es el aviso de que el proyecto depende de algo que solo existe en un portátil. Cada vez que ocurra, la solución no es que la otra persona copie la configuración por mensajería, sino arreglar el README hasta que arranque siguiéndolo. Eso es el requisito RNF-08 de la semana 5, y en la semana 25 vale nota.</p>
</div>

### Cómo se depura una petición que no llega

De fuera hacia dentro, y sin saltarse pasos. El error habitual es empezar cambiando código del servidor sin saber si la petición sale siquiera:

<figure class="diagram">
  <figcaption>El orden de la comprobación</figcaption>
  <ol class="flow">
    <li><span class="flow-role">1 · Navegador</span>¿Sale la petición? Herramientas de desarrollo, pestaña de red</li>
    <li><span class="flow-role">2 · Petición</span>¿A qué dirección va, con qué método y qué lleva dentro?</li>
    <li><span class="flow-role">3 · Respuesta</span>¿Qué código devuelve y qué cuerpo trae?</li>
    <li><span class="flow-role">4 · Servidor</span>¿Aparece algo en la consola del servidor al lanzarla?</li>
    <li><span class="flow-role">5 · Datos</span>¿Se ve la fila consultando la base de datos directamente?</li>
  </ol>
</figure>

Cada paso descarta la mitad del sistema. Si en el paso 1 no sale nada, el problema está entero en el navegador y no hay nada que tocar en el servidor.

### El bucle de trabajo, a partir de hoy

<figure class="diagram">
  <figcaption>Una tarea, de principio a fin</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Coger issue</li>
    <li>Rama</li>
    <li>Construir</li>
    <li>Probar el error</li>
    <li>Pull request</li>
    <li>Revisar</li>
    <li>Integrar</li>
  </ol>
</figure>

Con dos reglas de la semana 14 que hoy empiezan a aplicarse de verdad: una tarjeta en curso por persona, y la rama principal siempre arranca.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 15</p>
  <ul class="checklist">
    <li>Todas las personas del equipo consiguen arrancar el proyecto siguiendo el README.</li>
    <li>Una operación real recorre las seis etapas, y se ha visto la fila en la base de datos.</li>
    <li>La rama principal contiene ese corte y sigue arrancando.</li>
    <li>Lo que hubo que arreglar del README está arreglado, no contado por mensajería.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué no se empieza por las pantallas?</li>
    <li>¿Basta con que el servidor responda correctamente para dar por guardado un dato?</li>
    <li>¿Por dónde se empieza a depurar una petición que no funciona?</li>
    <li>Funciona en un portátil y no en otro. ¿Qué hay que arreglar?</li>
    <li>¿Qué NO se hace en el primer corte vertical?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque unas pantallas con datos escritos a mano ya las teníais en la semana 8 y no demuestran que el montaje funcione.</p>
  <p>2 · No. Hay que ver la fila consultando la base de datos.</p>
  <p>3 · Por el navegador: comprobar si la petición llega a salir.</p>
  <p>4 · El README, hasta que el proyecto arranque siguiéndolo.</p>
  <p>5 · Autenticación, control de errores, maquetación y las demás historias.</p>
</details>

---

## Sesión 16 · Reglas, errores y primer despliegue

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Dónde vive cada regla de negocio, qué pasa cuando dos personas actúan a la vez, y por qué el despliegue se hace hoy y no en la semana 23.</li>
    <li><strong>2. Haz:</strong> Implementa las reglas del modelo con sus errores del contrato, y pon una versión mínima en una URL pública.</li>
    <li><strong>3. Comprueba:</strong> Prueba en el dispositivo real y completa el checkpoint de la sesión 16.</li>
  </ol>
</div>

### Las reglas ya están escritas

No hay que decidir nada nuevo: en la semana 10 quedó la lista de reglas que el diagrama no podía expresar, y en la semana 12 el mapa de errores que corresponde a cada una. Esta semana consiste en implementarlas y en comprobar que hacen lo que decían.

| Regla de la semana 10 | Error del contrato | Criterio que la prueba |
| --------------------- | ------------------ | ---------------------- |
| Una herramienta no puede tener dos préstamos activos | Conflicto con el estado actual | CA-2 |
| Una persona no puede tener dos préstamos activos de la misma herramienta | Conflicto con el estado actual | CA-3 |
| No se puede cerrar un préstamo ya cerrado | Conflicto con el estado actual | RF-08 |
| La fecha de devolución no es anterior a la de salida | Datos no válidos | Comprobación de integridad |
| Solo el responsable cierra un préstamo ajeno | Sin permiso | RF-12, semana 18 |
| No se presta una herramienta retirada | Conflicto con el estado actual | RF-06 |

<div class="rule">
  <p class="rule-label">Dónde vive una regla</p>
  <p>En el servidor, en la capa que contiene la lógica del producto, no en el controlador que recibe la petición ni en la pantalla. El controlador traduce entre HTTP y el producto; la pantalla avisa antes para ahorrar un viaje. Si una regla está escrita solo en el controlador, dejará de aplicarse en cuanto la misma operación se llame desde otro sitio, y eso pasará en la semana 19.</p>
</div>

### La regla que se rompe cuando hay dos personas

Hay un fallo que no aparece nunca probando solo y aparece siempre en una demo, y conviene conocerlo aunque este proyecto tenga poco tráfico.

<figure class="diagram">
  <figcaption>Dos personas, la misma herramienta, el mismo instante</figcaption>
  <ol class="flow">
    <li>A pide prestar T-014. El servidor comprueba: está libre</li>
    <li>B pide prestar T-014. El servidor comprueba: sigue libre</li>
    <li>El servidor guarda el préstamo de A</li>
    <li class="is-error">El servidor guarda el préstamo de B. Dos préstamos activos de la misma herramienta</li>
  </ol>
</figure>

<dl class="worked">
  <dt>Por qué la comprobación no bastó</dt>
  <dd>Porque entre comprobar y guardar pasó tiempo, y en ese hueco cambió la realidad. La comprobación era correcta cuando se hizo.</dd>
  <dt>Cómo se cierra el hueco</dt>
  <dd>Haciendo que la propia base de datos impida el segundo registro. En la semana 10 esto quedó anotado como «unicidad condicional»: como máximo un préstamo activo por herramienta. Es la restricción la que garantiza, no la comprobación.</dd>
  <dt>Y entonces, ¿sobra la comprobación previa?</dt>
  <dd>No. La comprobación sirve para dar el mensaje correcto —«la tiene otra persona»—; la restricción sirve para que nunca ocurra. Una explica, la otra garantiza.</dd>
  <dt>Cómo se prueba</dt>
  <dd>Es difícil provocarlo a mano, y por eso casi nadie lo detecta. Basta con comprobar que la restricción existe en la base de datos y que la aplicación trata el fallo que produce sin romperse.</dd>
</dl>

### Los errores, con la forma acordada

En la semana 12 se decidió que todos los errores tendrían la misma forma. Aquí es donde esa decisión se cobra o se pierde:

<div class="compare-pair">
  <div>
    <p class="compare-label">Cada operación a su aire</p>
    <p class="compare-body">Una devuelve un texto, otra un objeto con un campo <em>mensaje</em>, otra sólo el código. El frontend acaba con un tratamiento distinto por endpoint y con pantallas que se quedan mudas cuando aparece un error nuevo.</p>
  </div>
  <div>
    <p class="compare-label">Forma común</p>
    <p class="compare-body">Todos los errores salen por el mismo sitio y con la misma estructura. El frontend escribe el tratamiento una vez, y un error nuevo aparece bien presentado sin tocar nada.</p>
  </div>
</div>

Esto se estudia como manejo centralizado de errores en Entorno Servidor. Lo que este módulo exige es que **el resultado coincida con el contrato que escribisteis**, y que ningún error interno llegue al navegador con detalles del sistema dentro.

### Datos de prueba, cargables

Los datos inventados de la semana 10 dejan de ser un documento y pasan a ser algo que se ejecuta. Tienen que cumplir tres cosas:

<ol class="fill-in">
  <li>Se cargan con un solo paso, documentado en el README.</li>
  <li>Se pueden volver a cargar sobre una base vacía sin errores.</li>
  <li>Incluyen los casos incómodos: la herramienta retirada, el préstamo antiguo sin devolver, la persona sin nada prestado.</li>
</ol>

A partir de aquí, cualquiera del equipo puede reproducir el estado del proyecto en dos minutos, y eso es lo que permite que la revisión de una pull request sea real y no un vistazo.

### Desplegar hoy, no en la semana 23

<div class="rule">
  <p class="rule-label">El hito que más proyectos salva</p>
  <p>El registro de riesgos de la semana 13 decía: desplegar una versión mínima en la semana 16, aunque solo devuelva una pantalla. Hoy toca. No importa que esté fea, que tenga una sola operación ni que los datos sean de prueba: importa que exista una URL pública que funcione y que el equipo sepa cómo volver a publicar.</p>
</div>

El motivo es que desplegar rompe cosas que en local funcionaban, y es mucho mejor descubrirlas ahora con un proyecto de doscientas líneas que en la semana 23 con uno terminado:

| Lo que suele romperse al desplegar | Por qué |
| ---------------------------------- | ------- |
| La conexión a la base de datos | En local estaba escrita en el código o en un fichero que no se sube |
| El origen permitido para las peticiones | El frontend ya no está en la misma máquina que el servidor |
| Las direcciones que el frontend llama | Estaban apuntando a una dirección local escrita a mano |
| El acceso seguro | En local se trabajaba sin cifrar y el navegador ahora exige más |
| La versión del lenguaje o de la base de datos | La del servidor no es la del portátil |
| Los datos | La base desplegada está vacía y nadie había pensado cómo llenarla |

Todo eso se estudia en Despliegue de Aplicaciones Web. Lo que este módulo pide es que **se haya hecho una vez, pronto, y que quede escrito cómo se hizo**.

### Probar en el dispositivo real

También lo pedía el registro de riesgos. Con la versión desplegada, abridla en la tablet del taller —o en el dispositivo que sea el contexto de vuestro proyecto— y comprobad lo que el navegador de un portátil no puede deciros: si se llega con el pulgar, si se lee con reflejo, si se acierta con guantes.

<dl class="answer">
  <dt>¿Qué falló en el dispositivo real que no fallaba en el portátil?</dt>
  <dd></dd>
  <dt>¿Qué cambia eso en el diseño, y en qué issue queda anotado?</dt>
  <dd></dd>
</dl>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 16</p>
  <ul class="checklist">
    <li>Las reglas del MVP están en el servidor, en la capa de lógica, y devuelven el error del contrato.</li>
    <li>La restricción que garantiza el préstamo único existe en la base de datos, no solo en el código.</li>
    <li>Los datos de prueba se cargan en un paso documentado.</li>
    <li>Hay una URL pública funcionando, y el equipo sabe repetir el despliegue.</li>
    <li>Se ha abierto en el dispositivo real y las diferencias están anotadas.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué una regla escrita solo en el controlador acabará dejando de aplicarse?</li>
    <li>Dos personas piden la misma herramienta a la vez. ¿Por qué falla la comprobación?</li>
    <li>Si la restricción garantiza, ¿para qué sirve la comprobación previa?</li>
    <li>Nombra dos cosas que suelen romperse al desplegar por primera vez.</li>
    <li>¿Por qué se despliega en la semana 16 y no en la 23?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque en cuanto la misma operación se llame desde otro sitio, la regla no se ejecutará.</p>
  <p>2 · Porque entre comprobar y guardar cambió la realidad; la comprobación era correcta cuando se hizo.</p>
  <p>3 · Para dar el mensaje correcto. Una explica; la otra garantiza.</p>
  <p>4 · Por ejemplo, la conexión a la base de datos y el origen permitido para las peticiones.</p>
  <p>5 · Porque romperse con doscientas líneas cuesta una tarde y con el proyecto terminado cuesta el proyecto.</p>
</details>

---

## Sesión 17 · Conectar el frontend de verdad

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se reutiliza del prototipo, los tres estados que faltan siempre, y por qué el cliente avisa pero no decide.</li>
    <li><strong>2. Haz:</strong> Conecta las pantallas del MVP con la API real, con sus estados de carga, vacío y error.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el checkpoint de la sesión 17.</li>
  </ol>
</div>

### Qué se reutiliza del prototipo

El prototipo de la semana 8 no se tira, y esa es una de las razones por las que se hizo en HTML:

<div class="compare-pair">
  <div>
    <p class="compare-label">Se aprovecha</p>
    <p class="compare-body">La estructura de cada pantalla, los estilos, los tamaños táctiles, la semántica ya corregida y las decisiones de accesibilidad que costaron trabajo.</p>
  </div>
  <div>
    <p class="compare-label">Se sustituye</p>
    <p class="compare-body">Los datos escritos a mano, que pasan a venir de la API, y los enlaces entre páginas, que pasan a ser navegación de la aplicación.</p>
  </div>
</div>

Conviene decirlo porque cada curso hay algún equipo que empieza el frontend desde cero y repite el trabajo de accesibilidad, normalmente peor.

### Los tres estados que faltan siempre

Los wireframes de la semana 7 ya tenían estado vacío y estado de error. Al conectar con datos reales aparece un tercero que en el prototipo no existía, porque allí los datos estaban ya puestos:

<figure class="diagram">
  <figcaption>Lo que puede estar pasando en una pantalla</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Cargando</span>La petición ha salido y aún no ha vuelto</li>
    <li><span class="flow-role">Con datos</span>Ha vuelto con contenido</li>
    <li><span class="flow-role">Vacío</span>Ha vuelto correctamente, y no hay nada que mostrar</li>
    <li><span class="flow-role">Error</span>No ha vuelto, o ha vuelto mal</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">La regla de la pantalla en blanco</p>
  <p>Ninguna pantalla puede quedarse vacía sin decir por qué. Una lista sin datos tiene que decir «no tienes nada prestado»; una que está esperando tiene que enseñar que espera; una que ha fallado tiene que decirlo y ofrecer reintentar. Una pantalla en blanco es la peor respuesta posible, porque la persona no sabe si el sistema está roto, si va lento o si es que no hay nada.</p>
</div>

El estado de carga importa especialmente aquí: la red del centro es lenta y el contexto es alguien de pie con prisa. Sin señal de que algo está pasando, esa persona vuelve a pulsar, y ahí es donde la idempotencia de la semana 12 deja de ser teoría.

### Qué hace el frontend con cada error

El mapa de errores de la semana 12 se convierte ahora en mensajes concretos. Cada error del contrato tiene que producir algo distinto:

| Error del contrato | Qué hace la pantalla |
| ------------------ | -------------------- |
| No encontrado | Dice que ese código no existe y deja seguir buscando |
| Conflicto · ya prestada a otra persona | Dice quién la tiene y sugiere elegir otra |
| Conflicto · ya la tienes tú | Lo dice, y lleva a la lista donde ya aparece |
| Conflicto · retirada de servicio | Lo dice y no ofrece reintentar |
| No autenticado | Vuelve a la pantalla de identificación |
| Sin permiso | Lo dice; no manda a identificarse otra vez |
| Fallo de red o del servidor | Dice que no se ha podido conectar y ofrece reintentar |

La última fila no estaba en el contrato, porque no es un error de la API: es que la API no ha contestado. Hay que tratarla igualmente, y es la que más se olvida.

### El cliente avisa, el servidor decide

<div class="compare-pair">
  <div>
    <p class="compare-label">Correcto</p>
    <p class="compare-body">La pantalla no ofrece prestar una herramienta que ya aparece como prestada, y además el servidor lo rechaza si la petición llega igualmente.</p>
  </div>
  <div>
    <p class="compare-label">Peligroso</p>
    <p class="compare-body">La pantalla oculta el botón y el servidor no comprueba nada. Basta con lanzar la petición a mano desde el navegador para saltarse la regla, y en la semana 21 alguien lo va a intentar.</p>
  </div>
</div>

Es la misma regla de la semana 13 dicha desde el otro lado. La comprobación en el cliente es una comodidad, nunca una garantía, y duplicarla no es redundancia: es lo correcto.

### El ritmo de esta semana

Una historia entera cada vez, no una capa de todas. Terminar «devolver una herramienta» de punta a punta, con sus estados y sus errores, y solo entonces empezar la siguiente. Cinco historias a medias en la semana 18 no son un MVP; tres terminadas, sí.

<div class="rule">
  <p class="rule-label">Si vais tarde, esta es la decisión</p>
  <p>Recortar historias, nunca calidad. Es preferible llegar a la semana 18 con el MVP reducido y funcionando, con sus errores tratados y desplegado, que con todas las historias a medias. Y el recorte se anota: pasa al anillo «versión 2» con su motivo y su fecha, exactamente como en la semana 6. Un recorte registrado es una decisión; uno silencioso es un fallo.</p>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 17</p>
  <ul class="checklist">
    <li>Las pantallas del MVP muestran datos reales que vienen de la API.</li>
    <li>Cada pantalla trata los cuatro estados y ninguna se queda en blanco.</li>
    <li>Cada error del contrato produce un mensaje distinto y accionable.</li>
    <li>Se ha tratado también el fallo de red, que no está en el contrato.</li>
    <li>Ninguna regla vive solo en el cliente.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué se aprovecha del prototipo y qué se sustituye?</li>
    <li>¿Qué estado aparece al conectar con datos reales que no existía en el prototipo?</li>
    <li>¿Qué error hay que tratar aunque no esté en el contrato?</li>
    <li>Ocultar el botón, ¿protege la regla?</li>
    <li>Vais tarde. ¿Se recorta calidad o alcance?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Se aprovechan estructura, estilos y accesibilidad; se sustituyen los datos escritos a mano y los enlaces entre páginas.</p>
  <p>2 · El estado de carga.</p>
  <p>3 · El fallo de red o de servidor: la API no ha llegado a contestar.</p>
  <p>4 · No. Cualquiera puede lanzar la petición a mano; la regla tiene que estar en el servidor.</p>
  <p>5 · Alcance, y anotando el recorte con su motivo.</p>
</details>

---

## Sesión 18 · Autenticación, permisos y cierre del MVP

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué este proyecto tiene dos niveles de acceso distintos, cómo se comprueba de verdad una autorización y qué significa cerrar el MVP.</li>
    <li><strong>2. Haz:</strong> Implementa los dos mecanismos, ejecuta la matriz de autorización, mide el requisito de esfuerzo con personas y pasa todos los criterios de aceptación.</li>
    <li><strong>3. Comprueba:</strong> Entrega el MVP funcional y revisa la evaluación.</li>
  </ol>
</div>

### Dos niveles, y decirlo en voz alta

En la semana 4, las fichas de rol dejaron una tensión sin resolver: el alumnado no puede escribir una contraseña de pie y con guantes, y el responsable maneja los datos de todo el mundo. Hoy se resuelve, y la resolución es asimétrica:

<div class="compare-pair">
  <div>
    <p class="compare-label">Alumnado · identificación</p>
    <p class="compare-body">Un código personal en una tablet que está físicamente dentro del taller. No demuestra quién es esa persona: demuestra que alguien con ese código estaba delante del armario.</p>
  </div>
  <div>
    <p class="compare-label">Responsable · autenticación</p>
    <p class="compare-body">Usuario y contraseña de verdad, guardada como decía RNF-04, porque puede ver y modificar los datos de todos.</p>
  </div>
</div>

<div class="rule">
  <p class="rule-label">Decir qué protege y qué no</p>
  <p>La identificación de la tablet es deliberadamente débil, y esa es una decisión defendible siempre que se diga: el riesgo asumido es que alguien registre un préstamo con el código de otra persona, y se acepta porque la alternativa —autenticación completa en cada uso— haría que nadie lo usara, que es exactamente cómo fracasó el intento anterior. Lo que no sería defendible es que esa debilidad fuera un descuido. Escribidla en el registro de decisiones: es una pregunta muy probable en junio.</p>
</div>

### La autorización se comprueba en el servidor

Y se comprueba de verdad, no mirando la interfaz. La prueba consiste en lanzar las peticiones a mano, saltándose la pantalla, y ver qué contesta el servidor.

<p class="stage">Paso 1 · Te enseño uno</p>

La matriz de autorización de PrestaTaller. Cada casilla es una petición real que hay que lanzar:

| Operación | Sin identificar | Alumnado, sobre lo suyo | Alumnado, sobre lo ajeno | Responsable |
| --------- | --------------- | ----------------------- | ------------------------ | ----------- |
| Listar herramientas disponibles | Rechaza | Permite | — | Permite |
| Crear un préstamo | Rechaza | Permite | Rechaza | Permite |
| Listar préstamos activos | Rechaza | Permite, solo los suyos | Rechaza | Permite, todos |
| Cerrar un préstamo | Rechaza | Permite | **Rechaza** | Permite |
| Crear una herramienta | Rechaza | Rechaza | — | Permite |
| Cambiar el estado de una herramienta | Rechaza | Rechaza | — | Permite |

<dl class="worked">
  <dt>La casilla marcada</dt>
  <dd>Es la que falla en la mitad de los proyectos. La pantalla del alumnado solo enseña sus propios préstamos, así que nadie prueba a cerrar uno ajeno. Pero la operación existe y acepta un identificador: si el servidor no comprueba de quién es, cualquiera puede cerrar el préstamo de cualquiera cambiando un número.</dd>
  <dt>Cómo se prueba</dt>
  <dd>Identificándose como alumnado, cogiendo el identificador de un préstamo de otra persona y lanzando la petición de cierre directamente contra la API. Si funciona, RF-12 no está implementado por mucho que la pantalla lo esconda.</dd>
  <dt>Y la columna «sin identificar»</dt>
  <dd>Rechaza en todo, incluido listar herramientas. Puede parecer excesivo, pero el catálogo dice qué material hay en el taller y quién lo tiene, y eso es exactamente lo que decidió la arquitectura de la semana 13.</dd>
</dl>

Esta matriz no se tira al terminar: es la lista de tests de autorización que se automatizan en la semana 21, y RNF-05 ya lo exigía desde la semana 5.

### Medir el requisito que decide si se usa

También toca hoy, porque lo decía el registro de riesgos. RNF-01 exigía que registrar un préstamo o una devolución no pasara de tres interacciones desde la pantalla inicial. En la semana 7 se comprobó sobre el papel; ahora se comprueba con el producto y con gente.

<p class="stage stage--guided">Lo hacemos juntos</p>

Cinco personas, una tarea cada una, sin ayuda y con cronómetro, igual que en la semana 8:

<dl class="answer">
  <dt>¿Cuántas interacciones hicieron falta de verdad, contando errores?</dt>
  <dd></dd>
  <dt>¿Cuánto tardó cada persona?</dt>
  <dd></dd>
  <dt>¿Se cumple el umbral escrito, o hay que cambiar el diseño?</dt>
  <dd></dd>
  <dt>Si no se cumple: ¿qué se cambia, y en qué issue queda?</dt>
  <dd></dd>
</dl>

<div class="rule">
  <p class="rule-label">Lo que no vale es bajar el listón</p>
  <p>Si el umbral no se cumple, se cambia el producto o se cambia el requisito por escrito, con motivo y con fecha. Lo que no se puede hacer es dejar de medirlo y seguir afirmando que se cumple: eso es exactamente lo que un tribunal detecta preguntando «¿y lo habéis medido?».</p>
</div>

### Cerrar el MVP

<p class="term">Cerrar el MVP</p>

Recorrer todos los criterios de aceptación de la semana 6 y comprobar, uno a uno y con el producto delante, si se cumplen. No es una impresión: es una lista con casillas.

| Criterio | ¿Se cumple? | Comprobado por | Evidencia |
| -------- | ----------- | -------------- | --------- |
| *CA-1 · Al prestar, aparece en mi lista y deja de estar disponible* | *Sí* | *La otra persona del equipo* | *Captura, o test* |
| CA-2 · Rechaza prestar algo ya prestado | | | |
| CA-3 · Avisa si ya la tengo | | | |
| CA-4 · Sin identificarse, no queda registro | | | |
| … el resto de vuestros criterios | | | |

Dos reglas al rellenarla: **lo comprueba alguien que no lo programó**, y no vale «funciona en local» si el criterio se refiere al producto desplegado.

Lo que no se cumpla tiene dos destinos posibles, y hay que elegir hoy:

<figure class="diagram">
  <figcaption>Qué se hace con lo que no ha entrado</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Se arregla</span>Si es esencial para el problema de la semana 4, entra en el backlog de la semana 19 como prioritario</li>
    <li><span class="flow-role">Se mueve</span>Si no lo es, pasa al anillo «versión 2» con su motivo y su fecha, y sale del MVP</li>
  </ol>
</figure>

Lo que no vale es dejarlo en un limbo de «casi está», porque en la semana 25 seguirá casi.

### Producto de la unidad

<p class="stage stage--solo">Ahora tú</p>

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Primera versión funcional del MVP.</p>
  <ul class="checklist">
    <li>Producto desplegado en una URL pública, con los datos de prueba cargables en un paso.</li>
    <li>Todas las historias del MVP funcionando de punta a punta, o el recorte anotado con motivo y fecha.</li>
    <li>Las reglas del modelo implementadas en el servidor, con la restricción de integridad en la base de datos.</li>
    <li>Todos los errores del contrato tratados, con mensaje distinto y accionable, más el fallo de red.</li>
    <li>Los cuatro estados en cada pantalla, sin ninguna pantalla en blanco.</li>
    <li>Los dos mecanismos de acceso, con la decisión sobre la identificación débil escrita y justificada.</li>
    <li>Matriz de autorización ejecutada lanzando peticiones a mano, con el resultado de cada casilla.</li>
    <li>Medición del requisito de esfuerzo con cinco personas, y qué se cambió.</li>
    <li>Tabla de criterios de aceptación, comprobada por quien no programó cada uno.</li>
    <li>README que permite a alguien de fuera arrancar el proyecto y cargar los datos.</li>
    <li>Tablero al día: lo terminado en «Terminado» y lo recortado fuera del MVP.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que funcione de verdad | Está desplegado y se puede usar desde fuera, no solo en un portátil |
| Que los bordes estén | Errores, estados de carga y vacío, y fallo de red |
| Que la seguridad no sea cosmética | La matriz se ejecutó a mano y el servidor rechaza lo que debe |
| Que se haya medido | El requisito de esfuerzo tiene un número, obtenido con personas |
| Que el alcance sea honesto | Lo que no entró está anotado como decisión, no escondido |
| Que sea trazable | Cada criterio de aceptación tiene un estado y una evidencia |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué demuestra realmente la identificación por código en la tablet?</li>
    <li>¿Por qué es defendible una autenticación débil, y cuándo deja de serlo?</li>
    <li>¿Cuál es la casilla de la matriz que falla en la mitad de los proyectos, y por qué no se detecta?</li>
    <li>El umbral de esfuerzo no se cumple. ¿Qué se puede hacer y qué no?</li>
    <li>¿Quién comprueba un criterio de aceptación?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que alguien con ese código estaba delante del armario; no quién es esa persona.</p>
  <p>2 · Es defendible si la decisión y el riesgo asumido están escritos y justificados; deja de serlo si es un descuido.</p>
  <p>3 · Cerrar un préstamo ajeno siendo alumnado. No se detecta porque la pantalla no lo ofrece, pero la operación acepta un identificador.</p>
  <p>4 · Cambiar el producto, o cambiar el requisito por escrito con motivo. No vale dejar de medirlo y seguir afirmando que se cumple.</p>
  <p>5 · Alguien del equipo que no lo programó.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 19</p>
  <ul class="checklist">
    <li>El MVP está desplegado y alguien ajeno al equipo lo ha usado sin instrucciones.</li>
    <li>La tabla de criterios está completa, con evidencia por cada uno.</li>
    <li>Lo recortado está en el anillo «versión 2», con motivo y fecha.</li>
    <li>Habéis enseñado el producto a la persona con la que hablasteis en la semana 2: lo que diga es el material de la semana 19.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Cuatro semanas de construcción</figcaption>
  <ol class="flow">
    <li>Primero que arranque en todos los portátiles, arreglando el README, no la configuración de cada uno</li>
    <li>Una operación entera antes que ninguna pantalla bonita</li>
    <li>Comprobar el dato en la base, no fiarse de la respuesta correcta</li>
    <li>Depurar de fuera hacia dentro, descartando la mitad del sistema en cada paso</li>
    <li>Las reglas al servidor, y la garantía a la base de datos</li>
    <li>Desplegar pronto, aunque sea feo, para que lo que se rompa se rompa barato</li>
    <li>Cada pantalla con sus cuatro estados y ningún blanco</li>
    <li>La autorización probada lanzando peticiones a mano, no mirando la interfaz</li>
    <li>Medir lo que se prometió medir, con personas</li>
    <li>Cerrar el MVP criterio a criterio, y anotar lo que se recorta</li>
  </ol>
</figure>

Y las cuatro frases de la unidad:

> **Cinco de seis etapas no es «casi»: es que aún no sabéis si funciona.**
>
> **La comprobación explica; la restricción garantiza.**
>
> **Ocultar el botón no protege nada.**
>
> **Si vais tarde, se recorta alcance, nunca calidad, y el recorte se escribe.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Corte vertical mínimo | Una operación funcionando a través de todas las capas, por fea que sea |
| De punta a punta | Pantalla, petición, servidor, dato guardado, respuesta y pintado |
| Depurar de fuera hacia dentro | Descartar la mitad del sistema en cada comprobación |
| Condición de carrera | Dos acciones simultáneas que rompen una regla comprobada por separado |
| Restricción de integridad | Lo que impide en la base de datos que un dato incorrecto exista |
| Forma común de error | Que todos los errores salgan igual, para tratarlos una sola vez |
| Estado de carga | La señal de que la petición ha salido y aún no ha vuelto |
| Matriz de autorización | La tabla de rol por operación, probada lanzando peticiones a mano |
| Identificación débil | Un acceso deliberadamente ligero, defendible solo si está justificado |
| Cerrar el MVP | Recorrer los criterios de aceptación uno a uno con el producto delante |
| Recorte anotado | Lo que se saca del alcance con motivo y fecha, en vez de en silencio |

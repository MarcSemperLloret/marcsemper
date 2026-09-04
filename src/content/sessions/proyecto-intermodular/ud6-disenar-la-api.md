---
title: "Diseñar la API"
label: "UD6 · Contratar"
section: "ud-06"
order: 6
lang: "es"
summary: "Describir lo que necesitará el frontend mediante recursos, operaciones, parámetros, representaciones y errores."
duration: "6 horas · 2 semanas · 2 sesiones"
modality: "Taller de contrato · diseño previo"
deliverable: "Primera especificación de la API, versión 0.1."
date: "2026-08-31"
outcomes:
  - "Derivar operaciones desde las necesidades del frontend."
  - "Diseñar una primera colección de recursos y endpoints."
  - "Especificar entrada, salida y errores antes de implementar."
requirements:
  - "MVP, prototipo y modelo de datos inicial."
priorKnowledge:
  - "Fundamentos de HTTP del módulo de Desarrollo Web en Entorno Servidor."
---

<p class="lead">Esta es una API v0.1 deliberadamente temprana. El diseño REST formal se estudia en Desarrollo Web en Entorno Servidor; aquí se decide qué necesita este producto y se deja el contrato por escrito antes de implementarlo.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio. Importa hacer explícito el contrato y detectar dudas, no anticipar todavía una API REST perfecta.</p>
</div>

<div class="rule">
  <p class="rule-label">Las dos semanas, de un vistazo</p>
  <p>Semana 11, del prototipo a los recursos y las operaciones. Semana 12, el contrato completo: método, parámetros, qué se envía, qué se devuelve y qué errores existen. Al final de la semana 12 hay un documento con el que dos personas del equipo pueden trabajar en paralelo sin hablar entre ellas.</p>
</div>

## Sesión 11 · Del prototipo a los recursos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Para qué sirve un contrato entre las dos mitades del proyecto, cómo se leen las necesidades desde las pantallas y por qué un endpoint no lleva verbos.</li>
    <li><strong>2. Haz:</strong> Recorre el prototipo anotando qué pide cada pantalla, extrae los recursos y escribe el primer listado de operaciones.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el checkpoint de la sesión 11.</li>
  </ol>
</div>

### Por qué esto se escribe antes

El proyecto tiene dos mitades que se construyen a la vez: lo que pasa en el navegador y lo que pasa en el servidor. En un equipo de dos personas es habitual que cada una lleve una.

<p class="term">Contrato</p>

El acuerdo, escrito antes de implementar, sobre qué peticiones existen, qué se envía en cada una, qué se devuelve y qué ocurre cuando algo va mal.

Sin contrato pasan dos cosas, y las dos cuestan semanas:

<div class="compare-pair">
  <div>
    <p class="compare-label">Sin contrato</p>
    <p class="compare-body">Quien hace el frontend espera un campo llamado <em>nombre</em> y el backend lo devuelve como <em>descripcion</em>. Se descubre el día que se conectan, y hay que retocar las dos mitades.</p>
  </div>
  <div>
    <p class="compare-label">Con contrato</p>
    <p class="compare-body">Las dos mitades se construyen contra el mismo documento. Quien hace el frontend puede trabajar con datos falsos que respetan el contrato, sin esperar a que el servidor exista.</p>
  </div>
</div>

Ese segundo punto es el que más rinde en la semana 15: **el frontend no tiene que esperar al backend**, porque puede simular las respuestas mientras el contrato se respete.

### El método: las pantallas piden

No se diseña una API pensando en la base de datos. Se diseña recorriendo el prototipo y anotando, pantalla por pantalla, dos cosas: qué necesita **mostrar** y qué **acciones** dispara.

<p class="stage">Paso 1 · Te enseño uno</p>

| Pantalla | Necesita mostrar | Acciones que dispara |
| -------- | ---------------- | -------------------- |
| P1 · Identificación | Nada | Identificar a alguien por su código |
| P2 · Mi situación | Mis préstamos activos: herramienta, código y desde cuándo | Devolver uno de ellos |
| P3 · Elegir herramienta | Las herramientas disponibles, buscables por código | Registrar un préstamo |
| P4 · Panel del responsable | Todos los préstamos activos: herramienta, persona, grupo y desde cuándo | Cerrar un préstamo ajeno |
| P5 · Alta de herramienta | Nada, o el catálogo para comprobar duplicados | Crear una herramienta |

<dl class="worked">
  <dt>Qué aparece al hacer esta tabla</dt>
  <dd>Que P2 y P4 muestran lo mismo con distinto alcance: préstamos activos, unos filtrados por persona y otros no. Eso no son dos cosas: es una con un filtro.</dd>
  <dt>Y qué aparece que no estaba</dt>
  <dd>Que P4 muestra el grupo de la persona. El grupo está en el modelo, pero nadie había dicho que el listado de préstamos tuviera que traerlo. Sin esta tabla, en la semana 16 el frontend habría tenido que pedir cada persona por separado para pintar una lista.</dd>
  <dt>La regla que se deduce</dt>
  <dd>Cada pantalla debería resolverse con <strong>una sola petición</strong>. Si para pintar una lista hacen falta veinte llamadas, el contrato está mal diseñado, no el frontend.</dd>
</dl>

### De las necesidades a los recursos

<p class="term">Recurso</p>

Una cosa del producto sobre la que se pide o se hace algo, nombrada en plural: herramientas, préstamos, personas. Suele coincidir con las entidades del modelo, pero no siempre, y no tiene por qué.

Dos avisos que ahorran mucha discusión:

<div class="compare-pair">
  <div>
    <p class="compare-label">Una consulta no es un recurso nuevo</p>
    <p class="compare-body">«Préstamos activos» no es un recurso distinto de «préstamos»: es el mismo con un filtro. Se resuelve con un parámetro, no con otra ruta.</p>
  </div>
  <div>
    <p class="compare-label">Un recurso puede no ser una tabla</p>
    <p class="compare-body">«Mi situación» podría ser un recurso propio aunque no exista tal cosa en la base de datos, si lo que devuelve es lo que una pantalla necesita de una vez.</p>
  </div>
</div>

### El error clásico: verbos en la ruta

Es el fallo más frecuente en un primer diseño, y se corrige en dos minutos si se detecta ahora:

<div class="compare-pair">
  <div>
    <p class="compare-label">Con verbos</p>
    <p class="compare-body"><code>/crearPrestamo</code>, <code>/devolverHerramienta</code>, <code>/listarPrestamosActivos</code>, <code>/borrarHerramienta</code>. Cada acción nueva inventa una ruta nueva, y en un mes hay treinta.</p>
  </div>
  <div>
    <p class="compare-label">Con recursos</p>
    <p class="compare-body">Una sola ruta <code>/prestamos</code> sobre la que se piden cosas distintas según el método. La ruta dice <em>sobre qué</em>, el método dice <em>qué</em>.</p>
  </div>
</div>

<div class="rule">
  <p class="rule-label">Cuándo un verbo sí está justificado</p>
  <p>Cuando la acción no es crear, leer, cambiar ni borrar nada, sino un proceso: cerrar un trimestre, enviar un aviso, recalcular algo. Son pocas y se reconocen porque no se pueden expresar como un cambio de estado de un recurso. Si en vuestro listado hay más de una o dos, casi seguro que son operaciones normales mal nombradas.</p>
</div>

### El primer listado de operaciones

<p class="stage">Paso 1 · Te enseño uno</p>

Ocho operaciones para las ocho historias del MVP. Todavía sin detalles: solo qué existe y para qué.

| # | Recurso y operación | Para qué pantalla | Cubre |
| --- | ------------------- | ----------------- | ----- |
| 1 | Identificar a una persona por su código | P1 | RF-04 |
| 2 | Listar herramientas disponibles | P3 | RF-03 |
| 3 | Crear una herramienta | P5 | RF-01, RF-02 |
| 4 | Listar préstamos activos, todos o los de una persona | P2, P4 | RF-09, RF-10 |
| 5 | Crear un préstamo | P3 | RF-05, RF-06 |
| 6 | Cerrar un préstamo | P2, P4 | RF-07, RF-08, RF-11 |
| 7 | Cambiar el estado de una herramienta | P5 | H3 |
| 8 | Consultar una herramienta por su código | P3, buscador | RF-03 |

<dl class="worked">
  <dt>Fijaos en la operación 4</dt>
  <dd>Una sola operación para dos pantallas. El alcance lo decide quién pregunta, no la ruta: si es alumnado, devuelve los suyos; si es el responsable, todos. Eso es RF-12 convertido en diseño.</dd>
  <dt>Fijaos en que no hay «borrar»</dt>
  <dd>Porque en la semana 10 se decidió que no se borra nada. La operación 7 —cambiar el estado a retirada— es la que ocupa su lugar, y esa coherencia entre el modelo y la API es lo que hace que un proyecto se sostenga.</dd>
  <dt>Ocho operaciones</dt>
  <dd>Un MVP de ocho historias suele quedarse entre seis y diez. Si os salen veinticinco, casi seguro que estáis inventando una ruta por cada botón.</dd>
</dl>

### Tarea de la sesión

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Recorred vuestro prototipo y haced la tabla de pantalla, qué muestra y qué acciones dispara.</li>
  <li>Comprobad que cada pantalla se puede resolver con una sola petición; anotad las que no.</li>
  <li>Extraed los recursos, en plural, comprobando que ninguna consulta se ha convertido en un recurso nuevo.</li>
  <li>Escribid el listado de operaciones, con la pantalla y el requisito que cubre cada una.</li>
  <li>Buscad verbos en vuestras rutas y quitadlos, salvo los que sean procesos de verdad.</li>
  <li>Anotad los datos que una pantalla necesita y el modelo de la semana 9 no tiene: son deuda que hay que resolver hoy, no en marzo.</li>
</ol>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 11</p>
  <ul class="checklist">
    <li>Cada operación nace de una pantalla y cubre un requisito identificado.</li>
    <li>Ninguna pantalla necesita más de una petición para pintarse.</li>
    <li>Las rutas nombran recursos en plural y no contienen verbos.</li>
    <li>El listado de operaciones es coherente con las decisiones del modelo de datos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué ventaja da el contrato a quien hace el frontend?</li>
    <li>¿Se diseña la API mirando la base de datos o el prototipo?</li>
    <li>«Préstamos activos», ¿es un recurso nuevo?</li>
    <li>¿Cuándo está justificado un verbo en una ruta?</li>
    <li>Si pintar una lista exige veinte llamadas, ¿de quién es el problema?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que puede trabajar con respuestas simuladas sin esperar a que el servidor exista.</p>
  <p>2 · Mirando el prototipo: qué necesita mostrar cada pantalla y qué acciones dispara.</p>
  <p>3 · No. Es el mismo recurso con un filtro, y se resuelve con un parámetro.</p>
  <p>4 · Cuando la acción es un proceso que no se puede expresar como cambio de estado de un recurso.</p>
  <p>5 · Del contrato, no del frontend.</p>
</details>

---

## Sesión 12 · El contrato: entrada, salida y errores

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué dice el método sobre la intención, dónde va cada parámetro, por qué no se devuelve la entidad entera y por qué los errores son parte del contrato.</li>
    <li><strong>2. Haz:</strong> Completa la especificación de cada operación y construye el mapa de errores a partir de vuestros criterios de aceptación.</li>
    <li><strong>3. Comprueba:</strong> Pasa la revisión cruzada, entrega la API v0.1 y revisa la evaluación.</li>
  </ol>
</div>

### El método dice la intención

La ruta dice sobre qué se actúa; el método dice qué se pretende. Lo importante para este proyecto no es memorizar la tabla, sino una propiedad concreta:

<p class="term">Idempotencia</p>

Que repetir la misma petición deje el sistema como si se hubiera hecho una sola vez. Consultar y borrar lo son; crear, normalmente no.

<div class="rule">
  <p class="rule-label">Por qué esto importa justo en PrestaTaller</p>
  <p>La tablet está en un taller, con la red del centro y alguien con prisa. La petición tarda, no se ve respuesta y la persona vuelve a pulsar. Si crear un préstamo no está protegido, aparecen dos préstamos idénticos. La regla H14 y el criterio CA-3 ya cubren el caso «ya la tengo», y por eso esa regla, que parecía menor en la semana 5, resuelve aquí un problema de red.</p>
</div>

### Dónde va cada parámetro

Tres sitios, y una regla sencilla para cada uno:

| Va en | Cuando | Ejemplo en PrestaTaller |
| ----- | ------ | ----------------------- |
| **La ruta** | Identifica a cuál de todos | El código de la herramienta que se consulta |
| **La consulta** | Filtra, ordena o pagina un listado | Solo los préstamos activos; solo los de una persona |
| **El cuerpo** | Son los datos de lo que se crea o se cambia | El código de herramienta y el de persona al crear un préstamo |

El error habitual es meter filtros en la ruta, que produce rutas que crecen sin control, o mandar identificadores en el cuerpo cuando ya están en la ruta, que produce dos fuentes de verdad y la pregunta de cuál gana.

### Qué se devuelve: la representación

<p class="term">Representación</p>

Lo que la API devuelve de un recurso, que no tiene por qué ser todo lo que hay guardado. Se decide por lo que las pantallas necesitan y por lo que quien pregunta tiene derecho a ver.

<div class="compare-pair">
  <div>
    <p class="compare-label">Devolver la entidad entera</p>
    <p class="compare-body">El listado de préstamos activos devuelve cada persona con todos sus campos. Cómodo hoy; mañana cualquiera con la tablet puede leer el rol y el grupo de todo el mundo.</p>
  </div>
  <div>
    <p class="compare-label">Devolver una representación</p>
    <p class="compare-body">El listado devuelve, de cada préstamo, el código y el nombre de la herramienta, el nombre y el grupo de la persona, y la fecha de salida. Nada más, porque nada más se pinta.</p>
  </div>
</div>

<p class="stage">Paso 1 · Te enseño uno</p>

Una operación completa, especificada. Este es el nivel de detalle que se pide:

<dl class="record">
  <dt>Operación</dt>
  <dd>Crear un préstamo</dd>
  <dt>Método y ruta</dt>
  <dd>Alta sobre el recurso <code>/prestamos</code></dd>
  <dt>Quién puede</dt>
  <dd>Cualquier persona identificada, solo para sí misma</dd>
  <dt>Entrada</dt>
  <dd>Código de la herramienta. La persona sale de quién está identificado, no del cuerpo: si viniera en el cuerpo, cualquiera podría crear préstamos a nombre de otro</dd>
  <dt>Salida en caso correcto</dt>
  <dd>El préstamo creado: identificador, código y nombre de la herramienta, y fecha y hora de salida</dd>
  <dt>Errores posibles</dt>
  <dd>Herramienta inexistente; herramienta ya prestada; herramienta retirada; ya la tiene quien pregunta; nadie identificado</dd>
  <dt>Cubre</dt>
  <dd>RF-05, RF-06; criterios CA-1, CA-2, CA-3, CA-4</dd>
</dl>

<dl class="worked">
  <dt>La línea que hay que mirar dos veces</dt>
  <dd>«La persona sale de quién está identificado, no del cuerpo.» Es una decisión de seguridad escrita en el contrato, y es la clase de cosa que si no se decide aquí, se implementa mal en la semana 16 y se descubre en la 21, si se descubre.</dd>
  <dt>Y la última</dt>
  <dd>Cada operación dice qué requisitos y qué criterios cubre. Esa columna es la que permite, en la semana 21, escribir un test por criterio y saber que no falta ninguno.</dd>
</dl>

### Los errores son parte del contrato

Es la mitad que casi nadie escribe, y la que decide si el producto se puede usar. Un frontend que recibe un error genérico no puede decirle a la persona qué hacer.

<p class="stage">Paso 1 · Te enseño uno</p>

El mapa de errores sale directamente de los criterios de aceptación de la semana 6:

| Situación | Categoría | Qué ve la persona | Viene de |
| --------- | --------- | ----------------- | -------- |
| El código de herramienta no existe | No encontrado | «No hay ninguna herramienta con ese código» | P3, buscador |
| La herramienta ya está prestada a otro | Conflicto con el estado actual | «La tiene ahora mismo otra persona» | CA-2, RF-06 |
| Ya la tiene quien la pide | Conflicto con el estado actual | «Ya la tienes tú desde el martes» | CA-3, H14 |
| La herramienta está retirada | Conflicto con el estado actual | «Está retirada de servicio» | RF-06 |
| Nadie identificado | No autenticado | Vuelve a la pantalla de identificación | CA-4 |
| Alumnado intentando cerrar un préstamo ajeno | Sin permiso | «Solo el responsable puede hacer esto» | RF-12 |
| El código de herramienta ya existe al darla de alta | Conflicto | «Ese código ya está en uso» | RF-02 |

<dl class="worked">
  <dt>Por qué tres errores distintos y no uno</dt>
  <dd>Porque la persona hace cosas distintas en cada caso: buscar otra herramienta, esperar, o mirar en su propia lista. Un «no se ha podido completar la operación» deja a todo el mundo parado delante del armario.</dd>
  <dt>Por qué se distinguen «no autenticado» y «sin permiso»</dt>
  <dd>Porque significan cosas opuestas. La primera dice «identifícate»; la segunda, «ya sé quién eres, y no puedes». Confundirlas hace que la tablet mande a alguien a identificarse una y otra vez sin que sirva de nada.</dd>
  <dt>Qué se decide aquí y se paga en la semana 16</dt>
  <dd>Que todos los errores tengan la misma forma. Si cada operación inventa su formato, el frontend acaba con un tratamiento distinto por endpoint, y eso es exactamente lo que se estudia como manejo centralizado de errores en Entorno Servidor.</dd>
</dl>

### El documento

Para una v0.1 basta con una tabla por operación con las siete casillas del ejemplo. No hace falta todavía una especificación formal: hace falta que esté escrito, completo y en el repositorio.

<div class="rule">
  <p class="rule-label">Lo que este contrato no es</p>
  <p>No es definitivo. Se llama v0.1 porque va a cambiar: al implementarlo en la semana 16 aparecerán cosas que no se habían visto, y al conectar el frontend en la 17, más. Lo que se evalúa no es acertar, sino que el contrato exista, sea completo por los bordes y que sus cambios queden registrados en lugar de ocurrir en silencio.</p>
</div>

### Revisión cruzada

<p class="stage stage--guided">Lo hacemos juntos</p>

La prueba de un contrato es que alguien lo pueda usar sin preguntar. Intercambiad la especificación con otro equipo y que cada uno responda, **solo con el documento delante**:

<ol class="fill-in">
  <li>¿Qué petición harías para pintar la pantalla principal? ¿Con qué parámetros?</li>
  <li>Escribe un ejemplo de lo que devolvería, inventando los valores.</li>
  <li>¿Qué pasa si esa misma petición se repite dos veces seguidas?</li>
  <li>Señala una operación en la que no sepas quién tiene permiso para hacerla.</li>
  <li>Señala un error que creas que puede ocurrir y no esté en el documento.</li>
</ol>

Las dos últimas preguntas son las que rinden. **Casi siempre falta un permiso sin decidir y un error de conflicto**, y encontrarlos hoy cuesta una conversación.

### Producto de la unidad

<p class="stage stage--solo">Ahora tú</p>

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Primera especificación de la API, versión 0.1.</p>
  <ul class="checklist">
    <li>Tabla de pantallas con lo que muestran y las acciones que disparan.</li>
    <li>Lista de recursos y listado de operaciones, cada una con su pantalla y su requisito.</li>
    <li>Cada operación especificada: método, ruta, quién puede, entrada, salida y errores posibles.</li>
    <li>Cada operación trazada a los requisitos y criterios de aceptación que cubre.</li>
    <li>Mapa de errores completo, con la categoría y el mensaje que ve la persona.</li>
    <li>Decisión escrita sobre la forma común de todos los errores.</li>
    <li>Decisión escrita sobre qué datos NO se devuelven, y por qué.</li>
    <li>Resultado de la revisión cruzada, con los huecos que encontró el otro equipo y qué hicisteis con cada uno.</li>
    <li>Los datos que faltaban en el modelo de la semana 9, ya incorporados.</li>
    <li>Todo en el repositorio, marcado como v0.1 y con fecha.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que nazca del producto | Cada operación se rastrea hasta una pantalla y un requisito |
| Que sea utilizable | Otro equipo ha sabido construir una petición solo con el documento |
| Que tenga los bordes | Los errores están, son distinguibles y dicen qué ve la persona |
| Que decida los permisos | Cada operación dice quién puede hacerla, y no se fía de la interfaz |
| Que sea coherente | No contradice el modelo de datos ni la navegación del prototipo |
| Que sea honesto | Está marcado como v0.1 y los cambios se registran, no se hacen en silencio |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué es la idempotencia y por qué importa en la tablet del taller?</li>
    <li>¿Dónde va un filtro: en la ruta, en la consulta o en el cuerpo?</li>
    <li>¿Por qué el identificador de la persona no viaja en el cuerpo al crear un préstamo?</li>
    <li>¿Qué diferencia hay entre «no autenticado» y «sin permiso»?</li>
    <li>¿Por qué no basta con un único error genérico?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que repetir la petición deje el sistema igual que si se hubiera hecho una vez; importa porque con red lenta la gente vuelve a pulsar.</p>
  <p>2 · En la consulta.</p>
  <p>3 · Porque entonces cualquiera podría crear préstamos a nombre de otra persona; sale de quién está identificado.</p>
  <p>4 · La primera dice «identifícate»; la segunda, «ya sé quién eres y no puedes».</p>
  <p>5 · Porque la persona hace cosas distintas según el error, y uno genérico la deja parada sin saber qué hacer.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 13</p>
  <ul class="checklist">
    <li>La API v0.1 está publicada en el repositorio y otro equipo la ha sabido leer.</li>
    <li>Cada operación dice quién tiene permiso, y eso coincide con la tabla de la semana 4.</li>
    <li>El modelo de datos ya contiene lo que la API necesita devolver.</li>
    <li>Traéis anotadas las dependencias externas que sospecháis que necesitará el proyecto: son el material de la semana 13.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Del prototipo al contrato</figcaption>
  <ol class="flow">
    <li>Se recorre cada pantalla anotando qué muestra y qué acciones dispara</li>
    <li>Se comprueba que cada pantalla se resuelve con una sola petición</li>
    <li>Se extraen los recursos, en plural, sin convertir consultas en rutas</li>
    <li>Se listan las operaciones, cada una atada a una pantalla y a un requisito</li>
    <li>Se elige el método por la intención, mirando qué pasa si se repite</li>
    <li>Se coloca cada parámetro en la ruta, la consulta o el cuerpo</li>
    <li>Se decide qué se devuelve, que no es todo lo que hay guardado</li>
    <li>Se escribe el mapa de errores a partir de los criterios de aceptación</li>
    <li>Se le da el documento a otro equipo para que intente usarlo sin preguntar</li>
  </ol>
</figure>

Y las tres frases de la unidad:

> **La ruta dice sobre qué; el método dice qué.**
>
> **Si una pantalla necesita veinte llamadas, el problema es del contrato.**
>
> **Los errores no son lo que falta al contrato: son la mitad del contrato.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Contrato | El acuerdo escrito sobre qué peticiones existen y qué devuelven, antes de implementar |
| Recurso | Una cosa del producto sobre la que se actúa, nombrada en plural |
| Operación | Una acción concreta sobre un recurso, con su método y su ruta |
| Representación | Lo que la API devuelve de un recurso, que no es todo lo guardado |
| Idempotencia | Que repetir la misma petición deje el sistema como si se hubiera hecho una vez |
| Parámetro de ruta | El que identifica a cuál de todos los recursos se refiere la petición |
| Parámetro de consulta | El que filtra, ordena o pagina un listado |
| Cuerpo | Los datos de lo que se crea o se cambia |
| Mapa de errores | La lista de lo que puede salir mal, con su categoría y su mensaje |
| No autenticado | No se sabe quién pregunta |
| Sin permiso | Se sabe quién pregunta y no puede hacer eso |
| v0.1 | Una versión declarada provisional, cuyos cambios se registran |

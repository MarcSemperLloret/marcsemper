---
title: "Qué hace bueno a un proyecto"
label: "UD1 · Evaluar"
section: "ud-01"
order: 1
lang: "es"
summary: "Distinguir un ejercicio académico de un proyecto que demuestra criterio, autonomía y potencial profesional."
duration: "3 horas · 1 semana · 1 sesión"
modality: "Taller guiado · proyecto longitudinal"
deliverable: "Criterios personales para valorar proyectos."
date: "2026-08-31"
outcomes:
  - "Reconocer las señales de un proyecto con valor de portfolio."
  - "Analizar proyectos desde la perspectiva de una empresa."
  - "Construir criterios propios para evaluar ideas."
requirements:
  - "Acceso a GitHub y a varios portfolios o repositorios públicos."
priorKnowledge:
  []
---

<p class="lead">Objetivo: entender qué diferencia un ejercicio académico de un proyecto que merece estar en un portfolio.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje alto. Se proporcionan ejemplos y criterios; el alumnado termina formulando su propio marco de evaluación.</p>
</div>

<div class="rule">
  <p class="rule-label">Cómo funciona este módulo</p>
  <p>Un bloque de tres horas por semana, veintiséis semanas. Cada bloque produce una decisión o una evidencia que la semana siguiente da por hecha. No hay unidades de repaso: si un bloque se pierde, se recupera fuera de clase, porque el siguiente ya construye encima.</p>
</div>

## Sesión 1 · De ejercicio académico a proyecto defendible

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se entrega al final del módulo, qué diferencia a un proyecto de portfolio de uno académico y qué mira realmente quien abre vuestro repositorio.</li>
    <li><strong>2. Haz:</strong> Clasifica proyectos reales, ejecuta la auditoría de noventa segundos sobre uno vuestro y construye la primera versión de vuestra rúbrica de evaluación.</li>
    <li><strong>3. Comprueba:</strong> Calibra la rúbrica con dos casos conocidos, responde a las preguntas de recall y entrega el producto de la unidad.</li>
  </ol>
</div>

### Este módulo no enseña tecnología nueva

Es lo primero que conviene entender, porque cambia la manera de trabajar durante todo el curso.

En los demás módulos alguien decide qué vais a aprender, en qué orden y con qué ejercicio se practica. Aquí no. Aquí se os pide otra cosa:

> **Coger todo lo que ya sabéis y usarlo para resolver un problema que nadie os ha puesto.**

No habrá una unidad de HTML, ni una de Spring Boot, ni una de bases de datos. Eso ya lo habéis estudiado, o lo estáis estudiando en paralelo. Lo que aquí se evalúa es distinto: si sabéis **elegir**, **acotar**, **decidir** y **defender**.

Al terminar tendréis cinco cosas, y las cinco son públicas o presentables:

<figure class="diagram">
  <figcaption>Lo que se entrega al final</figcaption>
  <ol class="flow">
    <li>Un producto web funcionando en una URL pública</li>
    <li>Un repositorio que otra persona puede entender y ejecutar</li>
    <li>Una documentación que explica qué hace y por qué está hecho así</li>
    <li>Un caso de portfolio que se puede enseñar en una entrevista</li>
    <li>Una defensa técnica delante de un tribunal</li>
  </ol>
</figure>

Fijaos en que ninguna dice «una aplicación grande». El tamaño no aparece por ninguna parte. En este módulo aparecerá muchas veces la palabra **defendible**, y casi nunca la palabra **grande**.

### Las veintiséis semanas, de un vistazo

<figure class="diagram">
  <figcaption>De la idea a la defensa</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Semanas 1 – 3 · Decidir</span>Evaluar proyectos y elegir un problema que merezca la pena</li>
    <li><span class="flow-role">Semanas 4 – 8 · Definir</span>Convertirlo en un producto acotado y prototiparlo</li>
    <li><span class="flow-role">Semanas 9 – 13 · Diseñar</span>Datos, API y arquitectura, antes de escribir código</li>
    <li><span class="flow-role">Semana 14 · Organizar</span>Repositorio, backlog y flujo de trabajo</li>
    <li><span class="flow-role">Semanas 15 – 20 · Construir</span>MVP funcional y evolución del producto</li>
    <li><span class="flow-role">Semanas 21 – 24 · Publicar</span>Calidad, release candidate y despliegue</li>
    <li><span class="flow-role">Semanas 25 – 26 · Presentar</span>Caso de portfolio y defensa técnica</li>
  </ol>
</figure>

Cada semana consume lo que produjo la anterior. Si en la semana 6 el alcance queda mal definido, en la 9 se diseñarán datos para un producto que no existe y en la 15 se construirá algo que no se puede terminar. Esa es la razón de que las primeras semanas no programen nada:

> **La mayoría de los proyectos que fracasan no fracasan programando.**

Y una consecuencia práctica del horario: **tres horas semanales no bastan para construir el producto**. Se construye sobre todo en las horas de los demás módulos y fuera de clase. Lo que se hace aquí es decidir, revisar y dejar constancia. Por eso este módulo se llama intermodular:

| Pieza del proyecto | Viene sobre todo de |
| ------------------ | ------------------- |
| Interfaz, maquetación, accesibilidad y responsive | Diseño de Interfaces Web · Lenguaje de Marcas |
| Interactividad en el navegador y consumo de la API | Desarrollo Web en Entorno Cliente |
| API, lógica de negocio, persistencia y seguridad | Desarrollo Web en Entorno Servidor |
| Modelo de datos y consultas | Bases de Datos |
| Despliegue, entornos, dominios y monitorización | Despliegue de Aplicaciones Web |
| Uso de IA, automatización y herramientas de trabajo | Digitalización |
| Accesibilidad, eficiencia y decisiones responsables | Sostenibilidad |
| Problema, alcance, requisitos, riesgos y defensa | Este módulo |

### La regla que lo cambia todo: evidencia

En los demás módulos, la prueba de que habéis trabajado suele ser el ejercicio entregado. Aquí la prueba es otra:

<p class="term">Evidencia</p>

Algo que existe fuera de vuestra cabeza y que otra persona puede consultar sin pediros explicaciones: un documento, un enlace, una issue, un commit, un diagrama, una captura o una demostración funcionando.

Durante el curso se oirá muchas veces la frase «lo tenemos pensado». No cuenta. Si está solo pensado, no existe.

<div class="compare-pair">
  <div>
    <p class="compare-label">No es evidencia</p>
    <p class="compare-body">«Hemos decidido que los usuarios podrán reservar sin registrarse.»</p>
  </div>
  <div>
    <p class="compare-label">Sí es evidencia</p>
    <p class="compare-body">La decisión escrita en el documento de alcance, con fecha, con la alternativa descartada y con el criterio de aceptación que permite comprobarla.</p>
  </div>
</div>

### Los dos encargos

Un proyecto académico y uno de portfolio pueden tener el mismo número de pantallas, las mismas tablas y las mismas tecnologías. Lo que cambia es la pregunta a la que responden.

| | Académico | De portfolio |
| --- | --------- | ------------ |
| **Origen** | El enunciado lo pone otra persona | El problema lo elegís y lo justificáis vosotros |
| **Alcance** | Fijo: lo que pedía el enunciado | Decidido: hay cosas dentro y cosas fuera, y se explica por qué |
| **Decisiones** | Invisibles, o no las hubo | Escritas, con la alternativa descartada |
| **Estado final** | Se entrega en un ZIP y se apaga | Está desplegado y alguien podría usarlo |
| **Relato** | «He usado Angular y Spring Boot» | «Esto le costaba tiempo a esta gente; hice esto y ahora ocurre esto otro» |

La quinta fila es la que casi nadie trabaja, y es la única que se recuerda después de una entrevista.

<p class="stage">Paso 1 · Te enseño uno</p>

Dos personas hacen «una aplicación de gestión de tareas». Mismo tema, mismo stack.

<dl class="worked">
  <dt>Versión académica</dt>
  <dd>CRUD de tareas con título, descripción, fecha y estado. Login. Cuatro pantallas. Funciona en local.</dd>
  <dt>¿Qué problema resuelve?</dt>
  <dd>Ninguno en concreto. Resuelve el enunciado. Existen muchísimas aplicaciones de tareas mejores y gratuitas.</dd>
  <dt>Versión de portfolio</dt>
  <dd>Gestión de las tareas de mantenimiento de un club deportivo pequeño, donde hoy se reparten en un grupo de mensajería y se pierden.</dd>
  <dt>¿Qué cambia técnicamente?</dt>
  <dd>Poca cosa: sigue siendo un CRUD con estados. Cambia que ahora hay personas con roles distintos, que hay un motivo para avisar de algo y que el histórico importa porque alguien tiene que rendir cuentas.</dd>
  <dt>¿Qué cambia en la conversación?</dt>
  <dd>Todo. La primera versión solo permite hablar de tecnología. La segunda permite hablar de decisiones: por qué no hay aplicación móvil, por qué el histórico no se borra, por qué se descartó una mensajería interna.</dd>
  <dt>La conclusión</dt>
  <dd>El salto de académico a portfolio casi nunca es un salto de dificultad técnica. Es un salto de <strong>contexto</strong>.</dd>
</dl>

### Primera tarea · Clasificar

<p class="stage stage--guided">Paso 2 · Lo hacemos juntos</p>

Marcad cada descripción como **A** (académico) o **P** (con potencial de portfolio), y anotad qué les falta a las de tipo A para cambiar de columna.

| Descripción del proyecto | A / P | Qué le falta |
| ------------------------ | ----- | ------------ |
| *Ejemplo · Un CRUD de películas con login* | *A* | *Alguien concreto y un motivo para existir* |
| Una tienda online de productos genéricos | | |
| Una herramienta para que el AMPA organice el préstamo de libros de texto usados | | |
| Un clon de una red social conocida | | |
| Un panel para que una peluquería de barrio gestione citas sin llamadas | | |
| Una API REST de usuarios y roles | | |
| Un registro de incidencias del taller del centro, con quién la reportó y en qué estado está | | |

Coged después **una** de las marcadas como A y reescribidla. No cambiéis la tecnología: cambiad el contexto.

<dl class="answer">
  <dt>¿Quién tiene hoy este problema? Un rol concreto, no «los usuarios»</dt>
  <dd></dd>
  <dt>¿Qué hacen ahora, sin vuestra aplicación?</dt>
  <dd></dd>
  <dt>Nueva descripción, en una frase</dt>
  <dd></dd>
</dl>

### El error más común: confundir tamaño con valor

Cada curso aparece el mismo razonamiento: «para que se note el esfuerzo, hacemos también un chat, notificaciones, panel de estadísticas, modo oscuro y pasarela de pago».

<figure class="diagram">
  <figcaption>Cómo se hunde un proyecto por exceso de alcance</figcaption>
  <ol class="flow flow--before">
    <li>Añadimos funcionalidades para impresionar</li>
    <li>Ninguna llega a estar terminada</li>
    <li>No queda tiempo para pruebas ni despliegue</li>
    <li class="is-error">La demo falla y no hay nada que defender</li>
  </ol>
</figure>

> **Un proyecto pequeño y terminado se defiende. Uno grande y a medias, no.**

### Nadie va a leer vuestro código

O al menos, no al principio. Cuando alguien con experiencia recibe el repositorio de una persona candidata junior, no se sienta a leer las clases. Hace algo mucho más rápido, y casi siempre en este orden:

<figure class="diagram">
  <figcaption>Los primeros noventa segundos</figcaption>
  <ol class="flow">
    <li>Abre el README y busca qué hace y para quién</li>
    <li>Busca un enlace a algo funcionando</li>
    <li>Mira el listado de commits y sus mensajes</li>
    <li>Abre uno o dos ficheros al azar</li>
    <li>Comprueba si hay tests</li>
    <li>Decide si merece la pena seguir mirando</li>
  </ol>
</figure>

Lo que se intenta averiguar en ese minuto y medio no es si sabéis programar. Es si se puede trabajar con vosotros:

| Señal | Qué se está leyendo realmente |
| ----- | ----------------------------- |
| README útil | Si sabéis explicar vuestro trabajo a alguien que no estaba |
| Enlace a algo funcionando | Si sois capaces de terminar y publicar, no solo de empezar |
| Historial de commits | Cómo trabajáis cuando nadie os mira |
| Coherencia del código | Si hay criterio o hay copia y pega |
| Tests, aunque sean pocos | Si os importa que siga funcionando mañana |
| Issues o tablero | Si sabéis organizar trabajo, no solo ejecutarlo |

<div class="compare-pair">
  <div>
    <p class="compare-label">Lo que dice un historial</p>
    <p class="compare-body">«cambios», «cambios2», «ya va», «final», «final bueno», todos el mismo día, tres días antes de la entrega.</p>
  </div>
  <div>
    <p class="compare-label">Lo que dice el otro</p>
    <p class="compare-body">«Añade validación de fechas en la reserva», «Corrige solapamiento cuando dos reservas comparten hora», repartidos a lo largo de semanas.</p>
  </div>
</div>

Nadie os va a pedir mensajes perfectos. Se os va a pedir que **el historial cuente una historia legible**.

<div class="rule">
  <p class="rule-label">Dónde deja de ser opcional</p>
  <p>Un repositorio público es una publicación. Si contiene datos personales reales de compañeros, clientes o del centro, ya no es solo una mala práctica: entra en el ámbito del RGPD. En este módulo, todos los datos de prueba serán inventados y las credenciales nunca se suben al repositorio.</p>
</div>

### Segunda tarea · Auditoría de noventa segundos

<p class="stage">Paso 1 · Te enseño uno</p>

Aplico la auditoría a un repositorio que me acaban de pasar, diciendo en voz alta lo que veo:

<dl class="worked">
  <dt>README</dt>
  <dd>Es la plantilla por defecto del framework, sin tocar. Primera pérdida: no sé qué hace el proyecto y ya llevo quince segundos.</dd>
  <dt>Enlace a algo funcionando</dt>
  <dd>No hay. Tendría que clonarlo, instalar dependencias y levantar una base de datos para ver una pantalla. No lo voy a hacer.</dd>
  <dt>Commits</dt>
  <dd>Dieciocho commits, diecisiete el mismo martes. El mensaje más repetido es «avances».</dd>
  <dt>Ficheros al azar</dt>
  <dd>Encuentro una contraseña de base de datos en el fichero de configuración. Esto ya no es un detalle de estilo.</dd>
  <dt>Veredicto</dt>
  <dd>El proyecto puede estar bien programado por dentro. Da igual: no he llegado a saberlo, y esa es exactamente la conclusión que hay que entender.</dd>
</dl>

<p class="stage stage--solo">Paso 3 · Ahora tú</p>

Repetid la auditoría sobre **un proyecto vuestro del curso pasado**. Sin defenderlo mentalmente: leedlo como si fuera de otra persona.

| Señal | ¿Está? | Nota de una línea |
| ----- | ------ | ----------------- |
| README que explica qué hace y para quién | | |
| Enlace a algo funcionando | | |
| Instrucciones para ejecutarlo | | |
| Historial de commits legible | | |
| Tests | | |
| Alguna credencial o dato personal expuesto | | |

<dl class="answer">
  <dt>¿Cuál de las carencias es la más barata de arreglar?</dt>
  <dd></dd>
  <dt>¿Cuál sería imposible de arreglar ahora, porque debería haberse hecho durante el desarrollo?</dt>
  <dd></dd>
</dl>

La última pregunta es la que importa. Un README se escribe en una tarde. Un historial de commits decente **no se puede fabricar al final**, y por eso se cuida desde la semana 14 y no desde la 25.

### De la impresión al criterio

Hasta ahora habéis dicho cosas como «este proyecto es flojo» o «este me gusta». Eso es una impresión, y las impresiones tienen dos problemas: no se pueden discutir y cambian según el día.

<p class="term">Criterio</p>

Una pregunta con respuesta comprobable, formulada antes de mirar el proyecto, que dos personas distintas puedan aplicar y obtener aproximadamente lo mismo.

<div class="compare-pair">
  <div>
    <p class="compare-label">Impresión</p>
    <p class="compare-body">«El alcance parece razonable.»</p>
  </div>
  <div>
    <p class="compare-label">Criterio</p>
    <p class="compare-body">«¿Existe una lista escrita de lo que queda fuera, y cada exclusión tiene un motivo?»</p>
  </div>
</div>

La diferencia práctica es que el criterio se puede aplicar a vuestro propio proyecto **cuando estéis enamorados de él**, que es justo cuando el juicio falla. La semana que viene lo vais a necesitar para elegir entre tres ideas propias.

Seis dimensiones cubren lo que hemos visto hoy:

| Dimensión | La pregunta | Se comprueba mirando |
| --------- | ----------- | -------------------- |
| **Problema** | ¿Le pasa esto a alguien de verdad, hoy? | Quién lo sufre y qué hace ahora sin vosotros |
| **Viabilidad** | ¿Cabe en el tiempo y el equipo que hay? | El MVP descrito en una frase, y lo que queda fuera |
| **Diferenciación** | ¿Aporta algo frente a lo que ya existe? | Dos alternativas reales y en qué se distingue |
| **Densidad técnica** | ¿Obliga a usar lo aprendido en el ciclo? | Datos relacionados, roles, reglas de negocio, estados |
| **Datos** | ¿Se puede alimentar con datos legítimos? | De dónde salen y si hay datos personales |
| **Relato** | ¿Se puede contar en treinta segundos? | La frase de presentación, dicha en voz alta |

<div class="rule">
  <p class="rule-label">Por qué «densidad técnica» y no «dificultad»</p>
  <p>No se trata de que el proyecto sea difícil, sino de que os obligue a demostrar lo que sabéis. Una idea preciosa que se resuelve con una tabla y dos formularios no os deja enseñar nada; una idea con relaciones, roles y reglas de negocio, sí, aunque sea pequeña.</p>
</div>

Si las seis puntúan igual, una idea con un relato brillante y sin viabilidad empata con una viable y sin gracia. Hay que decidir los pesos **antes** de puntuar nada. Una propuesta de partida, que podéis modificar si sabéis defender el cambio:

| Dimensión | Peso | Por qué |
| --------- | ---- | ------- |
| Problema | 25 % | Sin esto no hay proyecto, solo ejercicio |
| Viabilidad | 25 % | Es la causa más frecuente de fracaso |
| Densidad técnica | 20 % | Es lo que se evalúa en el ciclo |
| Datos | 10 % | Un bloqueo aquí aparece tarde y duele |
| Diferenciación | 10 % | Importa, pero admite matices |
| Relato | 10 % | Se puede mejorar durante el curso |

Y poner «de 1 a 5» sin más no sirve: cada persona entiende el 3 de una forma. Hay que escribir qué significa cada valor, y con tres niveles basta:

<dl class="worked">
  <dt>Dimensión</dt>
  <dd>Viabilidad</dd>
  <dt>Nivel 1</dt>
  <dd>No sabemos decir qué es lo mínimo que tendría que funcionar, o depende de algo que no controlamos.</dd>
  <dt>Nivel 2</dt>
  <dd>Sabemos describir un MVP, pero no hemos decidido qué queda fuera.</dd>
  <dt>Nivel 3</dt>
  <dd>El MVP cabe en una frase, hay una lista escrita de exclusiones y cada una tiene motivo.</dd>
</dl>

### Tercera tarea · Calibrar con dos casos

<p class="stage">Paso 1 · Te enseño uno</p>

Dos proyectos ficticios, pero reconocibles: los patrones se repiten todos los cursos.

<div class="compare-pair">
  <div>
    <p class="compare-label">Caso A · «Plataforma de gestión empresarial»</p>
    <p class="compare-body">ERP para pymes con facturación, inventario, CRM, recursos humanos, analítica y app móvil. Al abrirlo: facturación crea facturas pero no las numera de forma correlativa, inventario y CRM son listados vacíos, recursos humanos es una pantalla con el título puesto, y la app móvil no existe.</p>
  </div>
  <div>
    <p class="compare-label">Caso B · «Pedidos de un obrador»</p>
    <p class="compare-body">Un obrador de barrio recoge encargos por teléfono y los apunta en una libreta; se pierden y se duplican. Cinco pantallas, desplegado, ocho tests sobre la lógica de fechas de recogida, README con el problema en tres líneas y una captura, quince issues cerradas y tres abiertas etiquetadas «futuro».</p>
  </div>
</div>

<dl class="worked">
  <dt>Caso B · Problema 3, Viabilidad 3</dt>
  <dd>Hay una libreta y alguien lo sufre cada semana. Cinco pantallas, entregado y desplegado: la prueba de la viabilidad es que existe.</dd>
  <dt>Caso B · Diferenciación 2, Densidad 2</dt>
  <dd>Existen agendas y hojas de cálculo que harían parte del trabajo. Hay estados, fechas y reglas reales, pero no roles distintos.</dd>
  <dt>Caso B · Datos 3, Relato 3</dt>
  <dd>Datos inventados, sin información sensible. «Un obrador apuntaba los encargos en una libreta y los perdía; ahora no.» Treinta segundos, contado.</dd>
  <dt>Caso B · Total ponderado</dt>
  <dd>2,7 sobre 3. No es un proyecto espectacular; es un proyecto sólido, y esa distinción es la que hay que aprender a hacer.</dd>
  <dt>Por qué los tests están sobre las fechas y no sobre el login</dt>
  <dd>Porque si el login falla, alguien no entra y se soluciona. Si el calendario de recogidas se equivoca, una tarta no está el domingo. Se prueba primero lo que más daño hace.</dd>
</dl>

<p class="stage stage--guided">Paso 2 · Lo hacemos juntos</p>

Puntuad ahora el caso A con la misma rúbrica. Fijaos en lo que ocurre: es el proyecto más ambicioso de los dos y saca la nota más baja. Discutid si os parece justo, y por qué.

<p class="write-line"></p>
<p class="write-line"></p>

<details class="aside aside--help">
  <summary>Si os atascáis con el caso A</summary>
  <p>Preguntaos qué pasa cuando alguien dice «enséñame cómo se factura de verdad». Esa es exactamente la pregunta que hará el tribunal, y ahí es donde se decide la puntuación de viabilidad. La ambición del caso A no está en el producto: está en el título.</p>
</details>

### Producto de la unidad · Rúbrica v1.0

<p class="stage stage--solo">Paso 3 · Ahora tú</p>

La última media hora es para empezarla; se termina fuera de clase antes de la semana 2, porque la vais a necesitar para elegir vuestra idea.

<p class="term">Rúbrica de evaluación de proyectos v1.0</p>

Un documento de una página, en el repositorio del equipo, que se usará de verdad en la semana 3 para elegir entre tres ideas y otra vez en la semana 26 para valorar el resultado final. No es un ejercicio: es un instrumento.

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Criterios personales para valorar proyectos.</p>
  <ul class="checklist">
    <li>Está en el repositorio del equipo, en Markdown, no en un chat ni en un documento suelto.</li>
    <li>Tiene las dimensiones, los pesos sumando 100 y los tres descriptores de cada una, escritos con vuestras palabras.</li>
    <li>Incluye el umbral de descarte: por debajo de qué nota una idea se rechaza sin discusión.</li>
    <li>Incluye la puntuación de dos proyectos públicos reales, como calibración.</li>
    <li>Documenta al menos un caso en que la rúbrica contradijo vuestra primera impresión.</li>
    <li>Está versionado: pone «v1.0» y la fecha, porque habrá una v1.1.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">La trampa que hay que evitar</p>
  <p>Si cada vez que la rúbrica os lleva la contraria decidís que la rúbrica está mal, no tenéis un instrumento: tenéis una justificación. Un instrumento tiene que poder sorprenderos al menos alguna vez.</p>
</div>

### Cómo se evalúa esta unidad

| Se valora | Qué se mira |
| --------- | ----------- |
| Que la rúbrica sea aplicable | Otra persona la usa y llega a un resultado parecido |
| Que esté justificada | Los pesos tienen un motivo escrito, no son un reparto cómodo |
| Que esté calibrada | Se ha aplicado a proyectos reales, no solo a los casos de clase |
| Que haya honestidad | Se documenta un caso en que contradijo la intuición |
| Que sea una evidencia | Está en el repositorio, con fecha y versión |

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Sabes qué cinco cosas se entregan al final del módulo y por qué las primeras semanas no programan nada.</li>
    <li>Puedes enunciar al menos tres diferencias entre proyecto académico y de portfolio.</li>
    <li>Has auditado un proyecto propio y sabes qué carencia no se puede arreglar al final.</li>
    <li>La rúbrica tiene dimensiones, pesos que suman 100 y umbral de descarte.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>Un equipo dice que ya tiene decidido el alcance, pero no lo ha escrito. ¿Cuenta?</li>
    <li>¿El salto de académico a portfolio es sobre todo técnico?</li>
    <li>¿Qué se deduce de veinte commits hechos el mismo día?</li>
    <li>¿Por qué hay que fijar los pesos antes de puntuar y no después?</li>
    <li>¿Por qué unos pocos tests bien elegidos valen más que muchos sobre lo trivial?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · No. Sin evidencia consultable, la decisión no se puede revisar ni evaluar.</p>
  <p>2 · No. Es un salto de contexto: quién lo usa, para qué y qué se decidió.</p>
  <p>3 · Que el trabajo se hizo entero al final y probablemente no repartido.</p>
  <p>4 · Porque si se fijan después, se ajustan para que gane la idea que ya nos gustaba.</p>
  <p>5 · Porque el valor de un test es el daño que evita, no su número.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 2</p>
  <ul class="checklist">
    <li>La rúbrica v1.0 está publicada y todo el equipo sabe dónde encontrarla.</li>
    <li>Tenéis claro qué nota descarta una idea directamente.</li>
    <li>Habéis entendido que la semana 2 no empieza buscando tecnologías, sino problemas.</li>
    <li>Traéis abierto el cuaderno de campo que se explica en la semana 2: se empieza a observar ya.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

Cuando alguien os enseñe un proyecto —o cuando os lo enseñéis a vosotros mismos— no empecéis por la tecnología. Empezad por aquí:

<figure class="diagram">
  <figcaption>Las seis preguntas</figcaption>
  <ol class="flow">
    <li>¿A quién le pasa esto de verdad?</li>
    <li>¿Qué hace esa persona hoy, sin este proyecto?</li>
    <li>¿Qué queda dentro y qué queda fuera, y por qué?</li>
    <li>¿Está terminado y publicado, o solo empezado?</li>
    <li>¿Qué decisiones se tomaron, y qué se descartó?</li>
    <li>¿Se puede contar en treinta segundos?</li>
  </ol>
</figure>

Y el criterio que resume la unidad entera:

> **Un proyecto no vale por lo que promete, sino por lo que se puede enseñar funcionando y explicar sin excusas.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Proyecto académico | El que responde a un enunciado puesto por otra persona |
| Proyecto de portfolio | El que responde a un problema elegido y justificado por vosotros |
| Evidencia | Algo consultable por otra persona sin que vosotros lo expliquéis |
| Alcance | Lo que entra en el proyecto, y sobre todo lo que se deja fuera |
| MVP | La versión mínima que ya resuelve el problema de alguien |
| Criterio | Una pregunta comprobable, formulada antes de mirar el proyecto |
| Rúbrica | El conjunto de criterios con sus pesos y sus descriptores |
| Descriptor | La frase que define qué significa cada nivel de puntuación |
| Umbral de descarte | La nota por debajo de la cual una idea se rechaza sin discutir |
| Calibrar | Aplicar la rúbrica a casos conocidos para comprobar que da resultados razonables |
| Densidad técnica | Cuánto obliga un proyecto a usar lo aprendido en el ciclo |

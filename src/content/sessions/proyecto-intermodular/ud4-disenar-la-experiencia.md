---
title: "Diseñar la experiencia"
label: "UD4 · Prototipar"
section: "ud-04"
order: 4
lang: "es"
summary: "Pasar de requisitos a flujos, navegación, wireframes, mockups y un prototipo accesible y responsive antes de implementar."
duration: "6 horas · 2 semanas · 2 sesiones"
modality: "Taller de diseño · prototipo público"
deliverable: "Prototipo navegable y público."
date: "2026-08-31"
outcomes:
  - "Traducir requisitos en pantallas y recorridos."
  - "Prototipar antes de invertir en implementación."
  - "Revisar accesibilidad y adaptación responsive desde el diseño."
  - "Publicar una primera evidencia visible del producto."
requirements:
  - "Especificación inicial y MVP de la UD3."
  - "Herramienta de wireframes o diseño."
priorKnowledge:
  - "HTML, CSS y fundamentos de accesibilidad del módulo correspondiente."
---

<p class="lead">Todavía no hace falta Angular. Primero se comprueba si el producto se entiende, se puede recorrer y responde al problema definido.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio. Se dan el método y las comprobaciones; las pantallas, los recorridos y el prototipo los produce el equipo a partir de su propia especificación.</p>
</div>

<div class="rule">
  <p class="rule-label">Las dos semanas, de un vistazo</p>
  <p>Semana 7, de los requisitos a los flujos, la navegación y los wireframes. Semana 8, del wireframe a un prototipo HTML accesible, responsive y publicado en una URL. Al final de la semana 8 existe la primera evidencia visible del proyecto: algo que se puede enseñar a la persona con la que hablasteis en la semana 2.</p>
</div>

## Sesión 7 · De los requisitos a las pantallas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué una pantalla no se deduce de un requisito, cómo se dibuja un recorrido con sus ramas de error y qué es la arquitectura de navegación.</li>
    <li><strong>2. Haz:</strong> Construye el inventario de pantallas del MVP, dibuja los tres recorridos principales y levanta los wireframes en baja fidelidad.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el checkpoint de la sesión 7.</li>
  </ol>
</div>

### Una pantalla no es un requisito

El error más rápido de cometer es traducir uno a uno: trece requisitos, trece pantallas. Sale una aplicación con menús enormes en la que nadie encuentra nada.

Entre el requisito y la pantalla hay un paso intermedio que casi nadie da:

<figure class="diagram">
  <figcaption>Del requisito a la pantalla</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Requisito</li>
    <li>Tarea de una persona</li>
    <li>Recorrido</li>
    <li>Pantalla</li>
  </ol>
</figure>

<p class="term">Tarea</p>

Algo que alguien quiere terminar de una sentada: llevarse una herramienta, devolverla, saber qué falta. Una tarea puede necesitar varios requisitos y varias pantallas, y varias tareas pueden compartir una misma pantalla.

<div class="compare-pair">
  <div>
    <p class="compare-label">Diseñar por requisitos</p>
    <p class="compare-body">Una pantalla para RF-05, otra para RF-07, otra para RF-09. Tres entradas de menú que la persona del taller tiene que aprenderse.</p>
  </div>
  <div>
    <p class="compare-label">Diseñar por tareas</p>
    <p class="compare-body">Una sola pantalla en la que aparece lo que tengo prestado, con un botón para devolverlo y otro para coger algo. RF-05, RF-07 y RF-09 quedan cubiertos sin que nadie los vea.</p>
  </div>
</div>

### El inventario de pantallas

Antes de dibujar nada, listad las pantallas y contadlas. Contar es el ejercicio: un MVP con más de siete u ocho pantallas casi siempre significa que el corte de la semana 6 se ha deshecho por el camino.

<p class="stage">Paso 1 · Te enseño uno</p>

<dl class="worked">
  <dt>P1 · Identificación</dt>
  <dd>La tablet del armario, siempre encendida y en la misma pantalla. Cubre H4 y RF-04.</dd>
  <dt>P2 · Mi situación</dt>
  <dd>Lo que tengo prestado ahora, con un botón de devolver en cada línea y un botón grande de «coger herramienta». Cubre H6, H7, RF-07 y RF-09.</dd>
  <dt>P3 · Elegir herramienta</dt>
  <dd>Lista de lo que está disponible, buscable por código. Cubre H5 y RF-05, y aquí aparecen los avisos de H14 y RF-06.</dd>
  <dt>P4 · Panel del responsable</dt>
  <dd>Qué está fuera, de quién y desde cuándo, ordenable por antigüedad. Cubre H8, H9 y RF-10.</dd>
  <dt>P5 · Alta de herramienta</dt>
  <dd>Formulario corto: código, nombre, estado. Cubre H1, RF-01 y RF-02.</dd>
  <dt>Total</dt>
  <dd>Cinco pantallas para ocho historias. Ninguna historia se ha quedado sin sitio, y ninguna pantalla existe «por si acaso».</dd>
  <dt>La comprobación que importa</dt>
  <dd>Recorrer la lista de historias del MVP y marcar en qué pantalla vive cada una. Si alguna no aparece en ninguna, falta una pantalla. Si alguna pantalla no cubre ninguna historia, sobra.</dd>
</dl>

### Recorridos, con sus ramas de error

Un recorrido es la secuencia de pasos de una tarea, del principio al final. Se dibuja para descubrir los pasos que sobran, no para documentar los que ya conocéis.

<figure class="diagram">
  <figcaption>Recorrido · llevarse una herramienta</figcaption>
  <ol class="flow">
    <li><span class="flow-role">P1</span>Paso el dedo por el código personal</li>
    <li><span class="flow-role">P2</span>Veo lo que tengo prestado y pulso «coger herramienta»</li>
    <li><span class="flow-role">P3</span>Busco el código y lo selecciono</li>
    <li><span class="flow-role">P2</span>Vuelvo a mi situación, con la herramienta ya en la lista</li>
  </ol>
</figure>

Ese es el camino feliz. Y estos son los que hacen falta y nadie dibuja:

<figure class="diagram">
  <figcaption>Las ramas que se olvidan</figcaption>
  <ol class="flow">
    <li class="is-error">La herramienta ya está prestada a otra persona · CA-2</li>
    <li class="is-error">Ya la tengo yo · CA-3</li>
    <li class="is-error">Está marcada como no disponible · RF-06</li>
    <li class="is-error">Nadie se ha identificado y la tablet lleva un rato sola · CA-4</li>
  </ol>
</figure>

<dl class="worked">
  <dt>Qué hace cada rama en el diseño</dt>
  <dd>Las tres primeras necesitan un mensaje distinto en P3: no sirve un «error» genérico, porque la persona no sabría qué hacer después. La cuarta necesita algo que no estaba en ninguna historia.</dd>
  <dt>La rama cuatro es la interesante</dt>
  <dd>Una tablet fija en un armario nunca se queda «cerrada»: alguien se va sin pulsar nada y la siguiente persona registraría el préstamo a nombre del anterior. Hace falta que la sesión caduque sola en segundos.</dd>
  <dt>Qué acaba de pasar</dt>
  <dd>Dibujar el recorrido ha producido un requisito nuevo que la especificación no tenía. Se añade como RF-14 y se anota en el registro de decisiones. Esto es normal y es exactamente para lo que sirve prototipar antes de programar.</dd>
</dl>

### Probar el recorrido contra el requisito no funcional

RNF-01 decía que registrar un préstamo o una devolución no exigiría más de tres interacciones desde la pantalla inicial. Ahora se puede comprobar sobre el papel, que es cuando cuesta cero:

| Recorrido | Interacciones | ¿Cumple? |
| --------- | ------------- | -------- |
| Devolver una herramienta | Identificarse, pulsar devolver | Sí, dos |
| Llevarse una herramienta | Identificarse, «coger», buscar, seleccionar | **No, cuatro** |

<div class="rule">
  <p class="rule-label">Qué se hace con un incumplimiento</p>
  <p>No se relaja el requisito: se cambia el diseño, o se cambia el requisito por escrito y con motivo. Aquí el equipo decidió que P3 se abra directamente en el buscador con el teclado numérico activo, de modo que teclear el código y confirmar sean un solo paso. Tres interacciones. La decisión queda registrada, porque en la semana 21 alguien la va a comprobar.</p>
</div>

### Arquitectura de navegación

<p class="term">Arquitectura de navegación</p>

Qué pantallas existen, desde cuál se llega a cuál y por dónde se entra. Es lo que decide si la aplicación se entiende sin explicación, y en este proyecto además decide cómo se protege.

En PrestaTaller no hay una navegación, hay dos, y esa es la observación importante:

<figure class="diagram">
  <figcaption>Dos puertas distintas</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Puerta 1 · Tablet del armario</span>P1 identificación → P2 mi situación → P3 elegir. Sin menú, sin salir, sin nada más alcanzable</li>
    <li><span class="flow-role">Puerta 2 · Responsable</span>Inicio de sesión con contraseña → P4 panel → P5 alta. Desde un ordenador, sentado</li>
  </ol>
</figure>

<dl class="worked">
  <dt>Por qué esto no es una decisión de interfaz</dt>
  <dd>Porque define la superficie de ataque. Si desde la tablet se pudiera llegar a P4, cualquiera vería quién tiene qué; si se pudiera llegar a P5, cualquiera daría de alta herramienta. La navegación acaba de traducirse en la regla RF-12.</dd>
  <dt>Consecuencia para las semanas 11 y 15</dt>
  <dd>Que la API tendrá dos niveles de autorización, y que ocultar el botón en la interfaz no bastará: el servidor tendrá que rechazar la petición aunque alguien la lance a mano.</dd>
</dl>

### Wireframes, feos a propósito

<p class="term">Wireframe</p>

El esquema de una pantalla sin color, sin tipografía elegida y sin imágenes: cajas grises, líneas y texto real. Sirve para discutir qué hay y dónde, no cómo se ve.

<div class="compare-pair">
  <div>
    <p class="compare-label">Si lo enseñáis bonito</p>
    <p class="compare-body">Os hablarán del color del botón y del tipo de letra, y nadie dirá que falta la pantalla de errores.</p>
  </div>
  <div>
    <p class="compare-label">Si lo enseñáis en gris</p>
    <p class="compare-body">Os hablarán de qué falta, qué sobra y qué no se entiende, que es lo único que se puede arreglar barato ahora.</p>
  </div>
</div>

Un wireframe está terminado cuando tiene estas cinco cosas, y ninguna es decorativa:

<ol class="fill-in">
  <li>El texto real de la pantalla, no «Lorem ipsum» ni «Título aquí».</li>
  <li>Los datos reales de ejemplo: «T-014 · Calibre pie de rey», no «Producto 1».</li>
  <li>El estado vacío: qué se ve cuando no hay nada prestado todavía.</li>
  <li>El estado de error: qué ocupa el sitio del mensaje cuando algo falla.</li>
  <li>Qué pasa al pulsar cada elemento sobre el que se pueda pulsar.</li>
</ol>

El tercero y el cuarto son los que distinguen un wireframe útil de un dibujo. **La mayoría de los diseños fallan en el estado vacío y en el error, porque solo se dibujó el caso en que todo va bien**, exactamente igual que pasaba con los criterios de aceptación en la semana 6.

### Tarea de la sesión

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Inventario de pantallas, con la historia y el requisito que cubre cada una. Si pasáis de ocho, volved al corte de la semana 6.</li>
  <li>Los tres recorridos principales, cada uno con sus ramas de error tomadas de vuestros criterios de aceptación.</li>
  <li>La comprobación de cada recorrido contra vuestros requisitos no funcionales de esfuerzo, con la decisión que tomasteis si alguno no cumplía.</li>
  <li>La arquitectura de navegación, señalando qué es alcanzable desde dónde y qué no debe serlo.</li>
  <li>Los wireframes de todas las pantallas del MVP, con las cinco cosas de la lista.</li>
  <li>Los requisitos nuevos que hayan aparecido al dibujar, añadidos a la especificación con su número.</li>
</ol>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 7</p>
  <ul class="checklist">
    <li>Cada historia del MVP vive en alguna pantalla, y ninguna pantalla existe sin historia.</li>
    <li>Los recorridos tienen ramas de error, no solo camino feliz.</li>
    <li>Los recorridos se han medido contra los requisitos no funcionales.</li>
    <li>Los wireframes incluyen estado vacío y estado de error.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué hay entre un requisito y una pantalla?</li>
    <li>¿Qué pasa si traducís un requisito por pantalla?</li>
    <li>¿Por qué el wireframe se enseña en gris y con datos reales?</li>
    <li>¿Por qué la arquitectura de navegación es también una decisión de seguridad?</li>
    <li>Dibujar un recorrido ha hecho aparecer un requisito nuevo. ¿Es un fallo de la semana 5?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · La tarea que alguien quiere terminar, y el recorrido que la completa.</p>
  <p>2 · Sale una aplicación con un menú enorme en la que nadie encuentra nada.</p>
  <p>3 · Para que la conversación trate de qué falta y qué no se entiende, y no del color del botón.</p>
  <p>4 · Porque define qué es alcanzable desde dónde, y eso se traduce en reglas de autorización en el servidor.</p>
  <p>5 · No. Prototipar sirve precisamente para eso: descubrirlo cuando cuesta cero en vez de en la semana 17.</p>
</details>

---

## Sesión 8 · Del wireframe al prototipo público

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué el prototipo se hace en HTML, qué corregir siempre en lo que genera un asistente, y las seis comprobaciones de accesibilidad que atrapan casi todo.</li>
    <li><strong>2. Haz:</strong> Convierte los wireframes en un prototipo navegable, revísalo, hazlo responsive en el dispositivo real y publícalo.</li>
    <li><strong>3. Comprueba:</strong> Pruébalo con personas, entrega el producto de la unidad y revisa la evaluación.</li>
  </ol>
</div>

### Por qué en HTML y no en una herramienta de diseño

Una herramienta de diseño produce imágenes bonitas que después hay que volver a hacer. Un prototipo en HTML y CSS, sin ninguna lógica de servidor, tiene cuatro ventajas que importan justo en este módulo:

<ol class="fill-in">
  <li>Se puede probar en la tablet real, que es donde vive el requisito RNF-06.</li>
  <li>Se puede auditar de accesibilidad con herramientas de verdad, no a ojo.</li>
  <li>Se puede publicar en una URL hoy mismo, y eso es una evidencia.</li>
  <li>El maquetado no se tira: es la base de las plantillas de la semana 15.</li>
</ol>

<div class="rule">
  <p class="rule-label">Lo que el prototipo NO tiene</p>
  <p>Ni base de datos, ni servidor, ni autenticación real. Los datos van escritos a mano en el propio HTML, y los botones llevan de una página a otra con enlaces. Si alguien del equipo empieza a escribir lógica aquí, el prototipo ha dejado de ser un prototipo y habéis empezado el proyecto sin haberlo diseñado.</p>
</div>

### Generar la primera versión con un asistente

Aquí la IA sí acelera de verdad, porque el trabajo es mecánico y hay un wireframe que sirve de especificación. Igual que en la semana 3, lo que cambia todo es el contexto que se le da:

<div class="prompt">
  <p class="prompt-label">Prompt de maquetación</p>
  <ol>
    <li>Genera una página HTML y CSS, sin JavaScript ni frameworks, para esta pantalla: <em>[descripción del wireframe, elemento por elemento, con el texto real]</em>.</li>
    <li>Contexto de uso: tablet fija de diez pulgadas, en un taller, manejada de pie y con guantes.</li>
    <li>Requisitos: HTML semántico; todos los campos con etiqueta asociada; navegable solo con teclado; foco visible; contraste conforme a WCAG 2.2 AA; objetivos táctiles amplios.</li>
    <li>Incluye el estado vacío y el estado de error que te describo, no solo el caso correcto.</li>
    <li>Usa estos datos de ejemplo, y no inventes otros: <em>[los datos reales del wireframe]</em>.</li>
    <li>No uses <em>div</em> donde exista un elemento con significado propio.</li>
  </ol>
</div>

<p class="stage">Paso 1 · Te enseño uno</p>

Lo que devolvió, y lo que hubo que arreglar. Esta lista se repite con mucha regularidad, así que conviene revisarla siempre:

<dl class="worked">
  <dt>Lo que estuvo bien</dt>
  <dd>La estructura general, los tamaños táctiles y el CSS de partida. Ahorró cuarenta minutos de trabajo mecánico.</dd>
  <dt>Semántica</dt>
  <dd>Había convertido la lista de préstamos en una sucesión de <code>&lt;div&gt;</code>. Es una lista: se cambia por <code>&lt;ul&gt;</code> y <code>&lt;li&gt;</code>, y un lector de pantalla pasa a anunciar cuántos elementos hay.</dd>
  <dt>Etiquetas</dt>
  <dd>El buscador de código llevaba solo un texto de marcador de posición, que desaparece al escribir y no lo lee ninguna tecnología de apoyo. Se le añade una etiqueta asociada de verdad.</dd>
  <dt>Botones que no eran botones</dt>
  <dd>«Devolver» era un enlace con aspecto de botón. Si ejecuta una acción, es un botón; si lleva a otra página, es un enlace. Se nota al usar el teclado, porque responden a teclas distintas.</dd>
  <dt>Contenido inventado</dt>
  <dd>Había añadido dos herramientas que no existen en nuestro catálogo y un pie de página con datos de contacto ficticios. Se borra: los datos inventados en un prototipo acaban colándose en las capturas de la memoria.</dd>
  <dt>Contraste</dt>
  <dd>El gris del texto secundario no llegaba al mínimo. Se oscurece y se vuelve a comprobar con una herramienta, no a ojo.</dd>
  <dt>La conclusión</dt>
  <dd>Generó el 70 % del trabajo mecánico y el 0 % de las decisiones. Todo lo corregido son cosas que estaban escritas en nuestros requisitos y que el asistente no podía saber si no se las dábamos.</dd>
</dl>

### Seis comprobaciones de accesibilidad

No sustituyen a lo que se estudia en Diseño de Interfaces y en Sostenibilidad, pero atrapan la mayor parte de lo que se rompe en un proyecto de este tamaño:

| # | Comprobación | Cómo se hace |
| --- | ------------ | ------------ |
| 1 | Todo se puede usar con el teclado | Guardad el ratón y recorred la pantalla entera con tabulador |
| 2 | Se ve dónde está el foco | Mirad si algo cambia visiblemente al tabular; si no, hay un `outline` desactivado |
| 3 | Cada campo tiene etiqueta asociada | Pulsad sobre el texto de la etiqueta: el campo debe recibir el foco |
| 4 | El contraste es suficiente | Herramienta de contraste sobre texto normal y sobre texto grande |
| 5 | Los encabezados forman un esquema | Un solo encabezado de nivel 1, y ninguno que se salte un nivel |
| 6 | Las imágenes con información tienen alternativa | Y las decorativas, alternativa vacía, para que no se anuncien |

<div class="rule">
  <p class="rule-label">Dónde deja de ser una preferencia</p>
  <p>La accesibilidad de un producto digital no es un extra de calidad: para muchos servicios es una obligación legal, y en cualquier caso decide si una parte de las personas puede usarlo o no. En este módulo se comprueba en el prototipo, cuando arreglarlo cuesta minutos, y no en la semana 21, cuando obliga a rehacer plantillas.</p>
</div>

### Responsive, y en el dispositivo real

Redimensionar la ventana del navegador no es probar en móvil. Sirve para ver que nada se rompe, pero no dice nada de lo que importa aquí.

<div class="compare-pair">
  <div>
    <p class="compare-label">Lo que ve el navegador estrecho</p>
    <p class="compare-body">Que los botones caben y el texto no se desborda.</p>
  </div>
  <div>
    <p class="compare-label">Lo que solo ve la tablet en el taller</p>
    <p class="compare-body">Que el botón de devolver está donde no llega el pulgar, que el reflejo de la luz se come el gris claro, y que con guantes se pulsa el elemento de al lado.</p>
  </div>
</div>

Por eso RNF-06 exige la prueba en el dispositivo real. Si no tenéis acceso al dispositivo del contexto, decidlo por escrito y decid qué habéis hecho en su lugar: eso es una limitación honesta, y en la defensa vale mucho más que una afirmación que no podéis sostener.

### Publicar

El prototipo se publica en una URL. No es un trámite: es el primer hito público del proyecto y la primera comprobación de que el equipo sabe terminar algo.

<figure class="diagram">
  <figcaption>Publicar el prototipo</figcaption>
  <ol class="flow">
    <li>Los ficheros del prototipo, en una carpeta del repositorio</li>
    <li>Páginas activadas en el repositorio, sirviendo esa carpeta</li>
    <li>La URL, comprobada desde un móvil que no sea el vuestro</li>
    <li>El enlace, en el README, arriba del todo</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">Antes de publicar, comprobad esto</p>
  <p>Que no hay ningún dato personal real en el HTML, ni nombres de compañeros, ni el teléfono de nadie. El prototipo es público desde el momento en que se publica, y el histórico del repositorio conserva lo que se subió aunque después se borre.</p>
</div>

### Probarlo con personas

<p class="stage stage--guided">Lo hacemos juntos</p>

Cinco personas bastan para encontrar casi todo lo que está mal. No hace falta que sean del taller: sirve gente de otro equipo, siempre que no conozca vuestro proyecto.

El método es incómodo y funciona:

<ol class="fill-in">
  <li>Dais una tarea, no una explicación: «llévate la herramienta T-014». Nada más.</li>
  <li>No ayudáis. Ni una palabra, por mucho que duela verlo.</li>
  <li>Cronometráis y contáis las interacciones.</li>
  <li>Anotáis dónde se paran, qué pulsan que no era, y qué preguntan en voz alta.</li>
  <li>Al final preguntáis: «¿qué creías que iba a pasar al pulsar ahí?»</li>
</ol>

<dl class="answer">
  <dt>¿Cuántas personas completaron la tarea sin ayuda?</dt>
  <dd></dd>
  <dt>¿En qué punto se paró más de una? Eso es un problema de diseño, no de la persona</dt>
  <dd></dd>
  <dt>¿Se cumplió el límite de interacciones con gente real, no sobre el papel?</dt>
  <dd></dd>
  <dt>¿Qué vais a cambiar, y qué habéis decidido no cambiar y por qué?</dt>
  <dd></dd>
</dl>

### Producto de la unidad

<p class="stage stage--solo">Ahora tú</p>

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Prototipo navegable y público.</p>
  <ul class="checklist">
    <li>Inventario de pantallas, con la historia y el requisito que cubre cada una.</li>
    <li>Los tres recorridos principales, con sus ramas de error, y la comprobación contra los requisitos no funcionales de esfuerzo.</li>
    <li>La arquitectura de navegación, indicando qué no debe ser alcanzable desde dónde.</li>
    <li>Wireframes de todas las pantallas del MVP, con estado vacío y estado de error.</li>
    <li>Prototipo en HTML y CSS, navegable entre pantallas, con los datos reales de ejemplo.</li>
    <li>Las seis comprobaciones de accesibilidad, hechas y anotadas, con lo que hubo que corregir.</li>
    <li>La prueba en el dispositivo del contexto, o la limitación declarada por escrito.</li>
    <li>URL pública funcionando, enlazada desde el README.</li>
    <li>Resultado de la prueba con cinco personas, con lo que cambiasteis y lo que no.</li>
    <li>Los requisitos nuevos aparecidos al diseñar, incorporados a la especificación con su número.</li>
    <li>El apartado de uso de IA actualizado, con el prompt de maquetación y lo que hubo que corregir.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que el diseño venga de la especificación | Cada pantalla se puede rastrear hasta una historia y un requisito |
| Que estén los bordes | Estados vacíos, errores y sesión caducada, no solo el camino feliz |
| Que se haya medido | Los recorridos se contrastan con un umbral, no con una impresión |
| Que sea accesible | Las seis comprobaciones están hechas y documentadas |
| Que esté publicado | Hay una URL que funciona desde un dispositivo ajeno |
| Que se haya probado con gente | Hay observaciones de personas reales y decisiones tomadas a partir de ellas |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué el prototipo se hace en HTML y no en una herramienta de diseño?</li>
    <li>¿Qué NO debe tener el prototipo?</li>
    <li>Nombra tres cosas que casi siempre hay que corregir de lo que genera un asistente.</li>
    <li>¿Por qué redimensionar la ventana no es probar en móvil?</li>
    <li>Durante la prueba, alguien se atasca. ¿Se le ayuda?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque se prueba en el dispositivo real, se audita de accesibilidad, se publica hoy y el maquetado se reutiliza en la semana 15.</p>
  <p>2 · Base de datos, servidor y autenticación real: los datos van escritos a mano y los botones son enlaces.</p>
  <p>3 · Semántica (listas y botones reales), etiquetas asociadas a los campos, y contenido inventado que hay que borrar. También el contraste.</p>
  <p>4 · Porque no detecta el alcance del pulgar, los reflejos, ni el uso con guantes: eso solo aparece en el dispositivo del contexto.</p>
  <p>5 · No. Si hay que ayudar, el diseño tiene un problema, y ayudar impide verlo.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 9</p>
  <ul class="checklist">
    <li>El prototipo está publicado y el enlace funciona desde un dispositivo que no es el vuestro.</li>
    <li>La especificación incorpora los requisitos que aparecieron al diseñar.</li>
    <li>Habéis enseñado el prototipo a alguna de las personas con las que hablasteis en la semana 2.</li>
    <li>Traéis anotadas las preguntas sobre los datos que el prototipo ha dejado sin respuesta: son el material de la semana 9.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>De la especificación al prototipo publicado</figcaption>
  <ol class="flow">
    <li>De los requisitos a las tareas que alguien quiere terminar</li>
    <li>De las tareas al inventario de pantallas, contando</li>
    <li>De cada tarea a su recorrido, con las ramas que fallan</li>
    <li>Del recorrido a la comprobación contra el umbral escrito</li>
    <li>De las pantallas a la navegación, y de la navegación a la autorización</li>
    <li>De la navegación a wireframes en gris, con estado vacío y error</li>
    <li>De los wireframes a HTML accesible, con la IA haciendo lo mecánico</li>
    <li>Del HTML al dispositivo real, y de ahí a una URL pública</li>
    <li>De la URL a cinco personas que lo intentan sin ayuda</li>
  </ol>
</figure>

Y las tres frases de la unidad:

> **Un requisito por pantalla produce un menú que nadie sabe usar.**
>
> **Si el wireframe es bonito, os hablarán del color; si es gris, os dirán qué falta.**
>
> **La IA hace el trabajo mecánico y ninguna de las decisiones.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Tarea | Algo que alguien quiere terminar de una sentada, no un requisito |
| Recorrido | La secuencia de pasos que completa una tarea, con sus ramas de error |
| Inventario de pantallas | La lista de pantallas del MVP, cada una con la historia que cubre |
| Arquitectura de navegación | Qué pantallas hay, desde cuál se llega a cuál y por dónde se entra |
| Wireframe | El esquema de una pantalla sin color ni tipografía, con texto y datos reales |
| Estado vacío | Lo que se ve cuando todavía no hay datos que mostrar |
| Estado de error | Lo que ocupa la pantalla cuando la acción no se puede completar |
| Prototipo | HTML y CSS navegables, sin servidor ni lógica, para probar el diseño |
| Foco visible | La señal de qué elemento recibiría la pulsación al usar el teclado |
| Objetivo táctil | El área que hay que poder acertar con el dedo, guantes incluidos |
| Prueba con personas | Dar una tarea, no ayudar, y anotar dónde se atasca la gente |

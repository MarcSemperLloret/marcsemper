---
title: "Calidad y release candidate"
label: "UD11 · Asegurar"
section: "ud-11"
order: 11
lang: "es"
summary: "Decidir qué significa que la aplicación esté terminada y cerrar riesgos de funcionamiento, seguridad, rendimiento y experiencia."
duration: "6 horas · 2 semanas · 2 sesiones"
modality: "Auditoría de calidad · checklist de release"
deliverable: "Release candidate revisada y lista para desplegar."
date: "2026-08-31"
outcomes:
  - "Definir condiciones de finalización verificables."
  - "Revisar tests, validación, errores y seguridad."
  - "Comprobar rendimiento, accesibilidad y responsive."
  - "Realizar una revisión de código y cerrar el checklist de release."
requirements:
  - "Segunda versión funcional de la UD10."
priorKnowledge:
  - "Testing, seguridad, accesibilidad y revisión aprendidos en los módulos correspondientes."
---

<p class="lead">Proyecto Intermodular consolida la calidad aprendida en otros módulos. No añade listas de conceptos: exige evidencias sobre la versión que se va a publicar.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje bajo. El checklist es común; las pruebas, métricas y correcciones dependen de los riesgos de cada proyecto.</p>
</div>

<div class="rule">
  <p class="rule-label">Las dos semanas, de un vistazo</p>
  <p>Semana 21, qué significa terminado y qué hay que probar. Semana 22, seguridad, rendimiento, accesibilidad, revisión entre equipos y cierre de la candidata. No se añade nada: todo lo que se hace aquí es comprobar, corregir lo que la comprobación destape y dejar constancia.</p>
</div>

## Sesión 21 · Terminado, probado y validado

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué significa que algo esté terminado, qué tests necesita este proyecto sí o sí, y dónde vive la validación.</li>
    <li><strong>2. Haz:</strong> Escribe los tests de reglas, autorización y criterios, y comprueba que ningún error interno llega al navegador.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el checkpoint de la sesión 21.</li>
  </ol>
</div>

### Terminado no es «no encuentro más fallos»

Buscar fallos hasta que uno se cansa no es un criterio: depende del cansancio. Un producto está terminado cuando se cumplen unas condiciones escritas y se puede **demostrar** que se cumplen.

<p class="term">Condición de finalización</p>

Una afirmación comprobable sobre la versión que se va a publicar, con la evidencia que la respalda. No «funciona bien», sino «los diecisiete criterios de aceptación pasan, y aquí está la ejecución que lo prueba».

Y no hay que inventarlas: **están escritas desde la semana 5**. Los requisitos funcionales, los criterios de aceptación y los requisitos no funcionales con su umbral son exactamente eso. Esta unidad consiste en ir a buscarlos y comprobarlos uno a uno.

<div class="compare-pair">
  <div>
    <p class="compare-label">No es una condición</p>
    <p class="compare-body">«La aplicación va rápida.» «Está bastante probada.» «No nos ha fallado.»</p>
  </div>
  <div>
    <p class="compare-label">Sí lo es</p>
    <p class="compare-body">«El panel del responsable responde por debajo del umbral de RNF-02 con 300 préstamos, medido en el entorno desplegado el 12 de marzo.»</p>
  </div>
</div>

### Qué hay que probar primero

En la semana 1 quedó dicho: **el valor de un test es el daño que evita, no su número**. Aquí eso se convierte en un orden concreto, porque el tiempo es limitado y no se va a probar todo.

<figure class="diagram">
  <figcaption>Qué se prueba, por orden de daño</figcaption>
  <ol class="flow">
    <li><span class="flow-role">1 · Reglas</span>Lo que corrompe datos si falla: las seis reglas de la semana 10</li>
    <li><span class="flow-role">2 · Permisos</span>Lo que expone datos si falla: la matriz de la semana 18</li>
    <li><span class="flow-role">3 · Criterios</span>Lo que rompe una tarea si falla: los criterios del MVP</li>
    <li><span class="flow-role">4 · Lo demás</span>Solo si sobra tiempo, y casi nunca sobra</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">Los tres bloques ya estaban escritos</p>
  <p>No hay que decidir qué probar: la lista de reglas es de la semana 10, la matriz de autorización es de la semana 18 y los criterios son de la semana 6. Si en su momento se escribieron bien, esta semana es mecánica. Si no, es ahora cuando se paga, y ese es el motivo real de que aquellas sesiones insistieran tanto.</p>
</div>

<p class="stage">Paso 1 · Te enseño uno</p>

Cómo quedó el reparto en PrestaTaller:

<dl class="worked">
  <dt>Seis tests de reglas</dt>
  <dd>Uno por regla de la semana 10. El más importante es el de la restricción de préstamo único: no comprueba la lógica, comprueba que la base de datos lo impide aunque la lógica falle.</dd>
  <dt>Dieciocho comprobaciones de autorización</dt>
  <dd>Una por casilla de la matriz. Se automatizan porque son muchas, aburridas y exactamente el tipo de cosa que deja de comprobarse a mano en cuanto hay prisa. RNF-05 lo exigía desde la semana 5.</dd>
  <dt>Los criterios del MVP</dt>
  <dd>Los caminos felices y los de error. Los de error son los que rinden: casi todos los fallos que quedan a estas alturas están en las ramas que no se recorren a diario.</dd>
  <dt>Lo que no se automatizó</dt>
  <dd>Lo visual, lo táctil y lo de la tablet. No se puede, y se sustituye por un guion de comprobación manual escrito, que se ejecuta antes de cada publicación.</dd>
  <dt>Cuántos tests salieron</dt>
  <dd>Unos treinta. No es una cifra que haya que perseguir: es la consecuencia de haber cubierto tres listas concretas. Un proyecto con doscientos tests sobre lo trivial y ninguno sobre sus reglas está peor probado que este.</dd>
</dl>

### Cuando un test encuentra algo

Es lo que se busca, y conviene decir qué hacer entonces, porque el reflejo es equivocado:

<div class="compare-pair">
  <div>
    <p class="compare-label">Reflejo</p>
    <p class="compare-body">Arreglar el código deprisa y seguir escribiendo tests, para llegar.</p>
  </div>
  <div>
    <p class="compare-label">Lo correcto</p>
    <p class="compare-body">Anotar el fallo como issue, arreglarlo, y comprobar que el test que lo detectó ahora pasa. El fallo encontrado es una evidencia de que el proceso funciona, y se enseña en la defensa.</p>
  </div>
</div>

Un equipo que en junio dice «los tests encontraron tres fallos, aquí están las issues y aquí las correcciones» está demostrando mucho más que uno cuyos tests pasaron todos a la primera.

### Validación: dónde y qué

La validación de la entrada es la primera línea de defensa del contrato, y sigue la misma regla que ya conocéis de la semana 13:

| Dónde | Qué hace | Se puede saltar |
| ----- | -------- | --------------- |
| **En la pantalla** | Avisa antes de enviar, para ahorrar un viaje | Sí, trivialmente |
| **En el servidor** | Rechaza lo que no cumple el contrato | No |
| **En la base de datos** | Impide que un dato incorrecto exista | No |

<div class="rule">
  <p class="rule-label">Qué se valida en el servidor, como mínimo</p>
  <p>Que estén los campos obligatorios del contrato. Que los tipos y formatos sean los declarados, fechas incluidas. Que los valores acotados sean uno de los permitidos. Que los textos tengan un límite de longitud. Y que un identificador que llega desde fuera se refiera a algo que existe <em>y</em> que quien pregunta puede ver, que es donde se cuela la mitad de los fallos de permisos.</p>
</div>

### Los errores, la comprobación final

Tres cosas que hay que verificar sobre la versión que se va a publicar:

<ol class="fill-in">
  <li>Todos los errores salen con la forma común decidida en la semana 12.</li>
  <li>Ningún error interno llega al navegador con detalles del sistema dentro: ni rutas de ficheros, ni consultas, ni trazas. Eso va al registro del servidor, no a la respuesta.</li>
  <li>Ninguna pantalla se queda en blanco ante un error, incluido el fallo de red que no está en el contrato.</li>
</ol>

<div class="rule">
  <p class="rule-label">Por qué la segunda importa de verdad</p>
  <p>Un mensaje de error interno le cuenta a cualquiera qué tecnología usáis, qué versión, cómo se llaman vuestras tablas y a veces parte de una consulta. Es información gratuita para quien quiera atacar el sistema, y se arregla en una tarde. En la semana 22 otro equipo va a intentar provocarlo.</p>
</div>

### Lo que no se puede automatizar

Se escribe como guion de comprobación manual, con pasos concretos y resultado esperado, y se ejecuta antes de cada publicación:

<dl class="record">
  <dt>Comprobación</dt>
  <dd>Registro de préstamo en la tablet del taller</dd>
  <dt>Pasos</dt>
  <dd>Identificarse con un código, elegir T-014 de la lista, confirmar</dd>
  <dt>Resultado esperado</dt>
  <dd>Aparece en «lo que tengo», desaparece de la lista de disponibles, y no hace falta más de tres interacciones</dd>
  <dt>Con qué dispositivo</dt>
  <dd>La tablet real, no un navegador redimensionado</dd>
</dl>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 21</p>
  <ul class="checklist">
    <li>Hay un test por cada regla de la semana 10, incluida la restricción de integridad.</li>
    <li>La matriz de autorización está automatizada, casilla por casilla.</li>
    <li>Los criterios de aceptación tienen test, incluidos los caminos de error.</li>
    <li>La validación del servidor cubre las cinco cosas de la lista.</li>
    <li>Ningún error interno llega al navegador, y el guion manual está escrito.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué «no encuentro más fallos» no es un criterio de terminado?</li>
    <li>¿De qué tres semanas salen las tres listas de lo que hay que probar?</li>
    <li>¿Qué se hace cuando un test encuentra un fallo?</li>
    <li>¿Por qué es peligroso que un error interno llegue al navegador?</li>
    <li>¿Qué se hace con lo que no se puede automatizar?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque depende del cansancio de quien busca; hace falta una condición escrita y demostrable.</p>
  <p>2 · Las reglas de la semana 10, la matriz de autorización de la 18 y los criterios de la 6.</p>
  <p>3 · Se anota como issue, se arregla, se comprueba que el test pasa, y se enseña en la defensa.</p>
  <p>4 · Porque revela tecnología, versiones, nombres de tablas y consultas a cualquiera.</p>
  <p>5 · Un guion de comprobación manual con pasos y resultado esperado, ejecutado antes de cada publicación.</p>
</details>

---

## Sesión 22 · La candidata

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se revisa de seguridad y de rendimiento en un proyecto de este tamaño, y qué es exactamente una release candidate.</li>
    <li><strong>2. Haz:</strong> Pasa la revisión de seguridad, mide antes de optimizar, repasa accesibilidad sobre el producto real e intercambia revisión con otro equipo.</li>
    <li><strong>3. Comprueba:</strong> Cierra el checklist de release y entrega la candidata.</li>
  </ol>
</div>

### Seguridad: las siete comprobaciones

No sustituyen a lo que se estudia en Entorno Servidor. Son las que, en un proyecto de este tamaño, atrapan casi todo lo que suele quedar suelto:

| # | Comprobación | Cómo se comprueba |
| --- | ------------ | ----------------- |
| 1 | No hay credenciales en el repositorio, ni en el histórico | Buscar en todo el histórico, no solo en la última versión |
| 2 | Todas las operaciones comprueban permisos en el servidor | La matriz de la semana 18, ya automatizada |
| 3 | Nadie puede leer ni modificar datos de otra persona cambiando un identificador | Probarlo a mano con dos cuentas distintas |
| 4 | Las contraseñas se guardan como decía RNF-04, nunca en claro | Mirar la base de datos directamente |
| 5 | El tráfico va cifrado en el entorno desplegado | Abrir la URL pública y comprobarlo |
| 6 | Las dependencias no tienen vulnerabilidades conocidas graves | La herramienta de análisis del gestor de paquetes |
| 7 | Ningún mensaje de error revela detalles internos | Provocar errores a propósito |

<div class="rule">
  <p class="rule-label">La comprobación 1, otra vez</p>
  <p>Se repite porque es la que más veces aparece. Si encontráis una credencial en el histórico, no basta con borrarla del código: hay que cambiarla. Y hay que decirlo en la memoria, porque en un repositorio público es un incidente real, no un descuido menor.</p>
</div>

### El ataque de cinco minutos

<p class="stage stage--guided">Lo hacemos juntos</p>

Intercambiad las URL con otro equipo. Cada uno dispone de cinco minutos para intentar romper el producto del otro. No hace falta saber atacar: hace falta ser desconfiado.

<ol class="fill-in">
  <li>Entrar a una pantalla del responsable sin ser responsable, escribiendo la dirección a mano.</li>
  <li>Cambiar un identificador en una petición para ver datos de otra persona.</li>
  <li>Enviar un formulario con campos vacíos, con texto larguísimo y con texto donde se espera un número.</li>
  <li>Repetir la misma acción dos veces muy seguidas.</li>
  <li>Provocar un error a propósito y leer lo que devuelve.</li>
</ol>

<dl class="answer">
  <dt>¿Qué habéis conseguido hacer que no debería poder hacerse?</dt>
  <dd></dd>
  <dt>¿Qué información ha revelado algún mensaje de error?</dt>
  <dd></dd>
  <dt>¿Qué issue habéis abierto en el proyecto del otro equipo?</dt>
  <dd></dd>
</dl>

Este ejercicio suele encontrar entre uno y tres problemas por proyecto, y casi siempre son de la línea 2. **Es mejor que lo encuentre un compañero hoy que un tribunal en junio.**

### Rendimiento: medir antes de tocar

<div class="rule">
  <p class="rule-label">La regla</p>
  <p>No se optimiza nada que no se haya medido. Optimizar por intuición gasta tiempo en lo que no importa y añade complejidad que hay que defender. Y si no hay un umbral escrito con el que comparar, ni siquiera se sabe si hay un problema: por eso RNF-01 y RNF-02 se escribieron en la semana 5 con un número.</p>
</div>

Qué merece la pena mirar en un proyecto así:

| Qué | Por qué |
| --- | ------- |
| Las operaciones que enseñan listas | Es donde aparece el problema de hacer una consulta por cada fila en vez de una para todas |
| El peso de lo que descarga la primera visita | Con la red del centro y una tablet antigua, es la diferencia entre usarlo y no usarlo |
| El comportamiento con datos de verdad | Con diez filas todo va bien; el problema aparece a las trescientas |
| El tiempo con la conexión limitada | El navegador permite simularla; el aula tiene mejor red que el sitio real |

Y una advertencia sobre la tercera fila: para medir con trescientos préstamos hay que **generarlos**. Los datos de prueba de la semana 10 servían para llenar pantallas; aquí hace falta un juego grande, y generarlo es parte del trabajo de esta semana.

### Accesibilidad y responsive, sobre el producto real

Las seis comprobaciones de la semana 8 se repiten ahora sobre la aplicación, no sobre el prototipo. Es obligatorio repetirlas porque **casi siempre se ha perdido algo por el camino**: los componentes dinámicos, los mensajes de error que aparecen y desaparecen, y los estados de carga son justo lo que el prototipo no tenía.

<ol class="fill-in">
  <li>Todo se puede usar con teclado, incluidas las pantallas nuevas y los diálogos.</li>
  <li>El foco se ve, y va a donde debe cuando aparece un mensaje de error.</li>
  <li>Cada campo tiene etiqueta asociada, también los añadidos después de la semana 8.</li>
  <li>El contraste sigue cumpliendo, incluidos los mensajes de error y los estados desactivados.</li>
  <li>Los encabezados siguen formando un esquema coherente.</li>
  <li>Las imágenes con información tienen alternativa.</li>
</ol>

Y una séptima que solo aplica ahora: **que un cambio de estado se anuncie**. Si al devolver una herramienta la lista cambia sin decir nada, quien usa un lector de pantalla no se entera de que la acción funcionó.

### Revisión de código entre equipos

Media hora, con otro equipo, sobre dos ficheros que ellos elijan. No se busca reescribir nada: se busca saber si se entiende.

| Se mira | Pregunta que se hace |
| ------- | -------------------- |
| Nombres | ¿Se entiende qué hace cada cosa sin preguntar? |
| Duplicación | ¿Hay la misma regla escrita en dos sitios que puedan desincronizarse? |
| Funciones largas | ¿Hay algo que haga tres cosas y no se pueda probar por separado? |
| Comentarios | ¿Hay alguno que ya no sea verdad? Es peor que no tenerlo |
| Código muerto | ¿Hay algo que no se ejecuta nunca y sigue ahí? |
| Reglas | ¿Alguna regla de negocio vive en un sitio donde se pueda saltar? |

<div class="rule">
  <p class="rule-label">Qué se hace con lo que salga</p>
  <p>Se anota. Se arregla solo lo de las dos últimas filas y lo que sea barato; el resto va al registro de deuda declarada de la semana 20. Estamos a cuatro semanas del final y el objetivo ya no es que el código sea bonito: es que sea correcto, defendible y esté dicho lo que no lo es.</p>
</div>

### Congelar: qué es una candidata

<p class="term">Release candidate</p>

La versión que se publicaría tal cual si nada más falla. A partir de ella solo se corrigen fallos encontrados en las comprobaciones; no se añade, no se refactoriza y no se cambia de opinión.

<figure class="diagram">
  <figcaption>El ciclo de la candidata</figcaption>
  <ol class="flow">
    <li>Se marca la versión y se ejecuta el checklist entero</li>
    <li>Si algo falla, se corrige solo eso</li>
    <li>Se vuelve a ejecutar el checklist entero, no solo lo corregido</li>
    <li>Cuando pasa completo, es la candidata que se despliega en la semana 23</li>
  </ol>
</figure>

El paso 3 es el que la gente se salta, y es donde aparecen las regresiones: una corrección que rompe algo que ya funcionaba.

### El checklist de release

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Release candidate revisada y lista para desplegar.</p>
  <ul class="checklist">
    <li>Todos los criterios de aceptación del MVP pasan, con evidencia de la ejecución.</li>
    <li>Un test por regla de negocio, incluida la restricción en la base de datos.</li>
    <li>La matriz de autorización automatizada, con todas sus casillas.</li>
    <li>Validación en el servidor de campos obligatorios, tipos, valores acotados, longitudes y referencias.</li>
    <li>Todos los errores con la forma común, sin detalles internos y sin pantallas en blanco.</li>
    <li>Las siete comprobaciones de seguridad, hechas y anotadas.</li>
    <li>Resultado del ataque de cinco minutos del otro equipo, con las issues abiertas y su estado.</li>
    <li>Requisitos no funcionales medidos con un número, contra su umbral, en el entorno desplegado y con datos de volumen realista.</li>
    <li>Las siete comprobaciones de accesibilidad sobre el producto real, no sobre el prototipo.</li>
    <li>Guion de comprobación manual de lo que no se puede automatizar, ejecutado.</li>
    <li>Revisión de código con otro equipo, con lo corregido y lo declarado como deuda.</li>
    <li>El checklist completo ejecutado de una sola vez sobre la versión final, no a trozos.</li>
    <li>La versión marcada y anotada en el registro de versiones.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que se pruebe lo que importa | Los tests cubren reglas y permisos, no lo trivial |
| Que haya números | Los requisitos no funcionales se comprueban midiendo, no opinando |
| Que la seguridad se haya atacado | Otro equipo lo ha intentado y hay constancia del resultado |
| Que la accesibilidad se mantenga | Se ha comprobado sobre el producto, no sobre el prototipo |
| Que los hallazgos estén gestionados | Cada uno tiene issue, y está corregido o declarado |
| Que la candidata esté congelada | No hay cambios posteriores salvo correcciones del checklist |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué hay que hacer si aparece una credencial en el histórico del repositorio?</li>
    <li>¿Cuál es la regla antes de optimizar?</li>
    <li>¿Por qué hay que repetir las comprobaciones de accesibilidad sobre el producto real?</li>
    <li>¿Qué es una release candidate y qué se puede tocar en ella?</li>
    <li>Tras corregir un fallo del checklist, ¿qué se vuelve a comprobar?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Cambiar la credencial, no solo borrarla, y decirlo en la memoria.</p>
  <p>2 · No se optimiza nada que no se haya medido, y contra un umbral escrito.</p>
  <p>3 · Porque los componentes dinámicos, los mensajes de error y los estados de carga no existían en el prototipo.</p>
  <p>4 · La versión que se publicaría tal cual; solo se tocan los fallos que encuentren las comprobaciones.</p>
  <p>5 · El checklist entero, no solo lo corregido, para detectar regresiones.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 23</p>
  <ul class="checklist">
    <li>El checklist ha pasado completo sobre una única versión marcada.</li>
    <li>Las issues abiertas por el otro equipo están cerradas o declaradas con motivo.</li>
    <li>Los requisitos no funcionales tienen un número medido, no una afirmación.</li>
    <li>Nadie del equipo va a añadir nada nuevo: lo que viene es despliegue y presentación.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>De la segunda versión a la candidata</figcaption>
  <ol class="flow">
    <li>Terminado se define con condiciones escritas y demostrables, no con cansancio</li>
    <li>Se prueba por orden de daño: reglas, permisos, criterios, lo demás</li>
    <li>Lo que no se puede automatizar se escribe como guion manual</li>
    <li>Se valida en el servidor, aunque la pantalla ya avise</li>
    <li>Se comprueban las siete cosas de seguridad, y otro equipo intenta romperlo</li>
    <li>Se mide antes de optimizar, contra el umbral escrito y con datos de volumen real</li>
    <li>Se repite la accesibilidad sobre el producto, no sobre el prototipo</li>
    <li>Se congela una versión y se ejecuta el checklist entero cada vez</li>
  </ol>
</figure>

Y las cuatro frases de la unidad:

> **Terminado no es «no encuentro más fallos»: es que las condiciones escritas se cumplen y se puede demostrar.**
>
> **El valor de un test es el daño que evita, no su número.**
>
> **No se optimiza lo que no se ha medido.**
>
> **Mejor que lo encuentre un compañero hoy que un tribunal en junio.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Condición de finalización | Una afirmación comprobable sobre la versión a publicar, con su evidencia |
| Orden por daño | Probar primero lo que corrompe datos, luego lo que los expone |
| Guion de comprobación manual | Los pasos y el resultado esperado de lo que no se puede automatizar |
| Validación de servidor | La que no se puede saltar, aunque la pantalla ya avise |
| Fuga de información | Un mensaje de error que revela tecnología, rutas o consultas |
| Regresión | Algo que funcionaba y deja de funcionar tras corregir otra cosa |
| Release candidate | La versión que se publicaría tal cual si nada más falla |
| Congelar | Dejar de añadir y de refactorizar, y corregir solo lo que el checklist destape |

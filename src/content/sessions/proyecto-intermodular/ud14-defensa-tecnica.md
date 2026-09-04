---
title: "Defensa técnica"
label: "UD14 · Defender"
section: "ud-14"
order: 14
lang: "es"
summary: "Presentar el problema y la solución, realizar una demo efectiva y responder preguntas técnicas sobre decisiones, errores y limitaciones."
duration: "3 horas · 1 semana · 1 sesión"
modality: "Preparación de defensa · simulación profesional"
deliverable: "Presentación y defensa técnica final."
date: "2026-08-31"
outcomes:
  - "Construir una presentación centrada en problema, evidencia y resultado."
  - "Realizar una demo breve y resistente a fallos."
  - "Defender arquitectura y decisiones técnicas."
  - "Explicar dificultades y límites con criterio profesional."
  - "Responder a una entrevista técnica simulada."
requirements:
  - "Proyecto público y caso de portfolio de la UD13."
priorKnowledge:
  - "Dominio técnico completo del proyecto propio."
---

<p class="lead">La defensa no premia una presentación comercial: comprueba si el alumnado entiende lo que ha construido, puede demostrarlo y reconoce sus límites.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Autonomía plena. El profesorado plantea preguntas y escenarios; cada equipo decide cómo demostrar su trabajo.</p>
</div>

## Sesión 26 · Preparar y ensayar la defensa

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se evalúa realmente en una defensa, cómo se reparte el tiempo, qué hace resistente a una demostración y cómo se responde a lo que no se sabe.</li>
    <li><strong>2. Haz:</strong> Monta la presentación, prepara la demostración y su plan B, y trabaja el banco de preguntas.</li>
    <li><strong>3. Comprueba:</strong> Ensaya cronometrado con otro equipo haciendo de tribunal, y corrige lo que aparezca.</li>
  </ol>
</div>

### Qué se evalúa de verdad

No es la presentación. Un tribunal, con veinte minutos, está intentando averiguar tres cosas:

<figure class="diagram">
  <figcaption>Las tres preguntas del tribunal</figcaption>
  <ol class="flow">
    <li>¿Entienden lo que han construido, o lo han montado sin saber por qué?</li>
    <li>¿Funciona de verdad, o solo funciona la parte que enseñan?</li>
    <li>¿Saben dónde están sus límites, o creen que no los tienen?</li>
  </ol>
</figure>

La tercera es la que más distingue. Un equipo que dice «esto no lo hicimos, y por este motivo» transmite mucha más solvencia que uno que afirma que todo está resuelto y se derrumba a la segunda pregunta.

<div class="rule">
  <p class="rule-label">Lo que juega a vuestro favor</p>
  <p>Lleváis veinticinco semanas escribiendo decisiones. Casi cualquier pregunta que os hagan tiene su respuesta en un documento vuestro: el registro de la semana 3, las exclusiones de la 6, el modelo de la 10, la arquitectura de la 13, la deuda declarada de la 20. Preparar la defensa consiste en gran parte en releer lo que ya escribisteis.</p>
</div>

### El reparto del tiempo

Sobre una defensa de unos veinte minutos, más preguntas. Ajustad las proporciones si vuestro tiempo es otro:

| Minutos | Qué | Por qué |
| ------- | --- | ------- |
| 3 | El problema, y a quién le pasaba | Sin esto, lo demás no se sostiene |
| 2 | Qué construisteis y qué queda fuera | Sitúa el alcance antes de enseñar nada |
| 6 | Demostración | Es lo que demuestra que existe |
| 5 | Arquitectura y tres decisiones | Es donde se ve el criterio técnico |
| 3 | Límites, deuda y qué haríais distinto | Es donde se ve la madurez |
| 1 | Cierre: qué aprendisteis | Corto, concreto, sin discurso |

<div class="rule">
  <p class="rule-label">El error más común, y es de los primeros treinta segundos</p>
  <p>Empezar por la tecnología: «hemos usado Angular, Spring Boot y PostgreSQL». Eso no dice nada, porque lo ha usado todo el mundo. Se empieza por el problema y por la persona a la que le pasaba, exactamente como en la propuesta de valor de la semana 4. La tecnología aparece cuando toca explicar cómo se resolvió.</p>
</div>

### La demostración, resistente

Es la parte que más se rompe y la que más se recuerda. Seis reglas:

<ol class="fill-in">
  <li>Camino ensayado. Se enseña un recorrido concreto que se ha repetido varias veces, no una exploración improvisada.</li>
  <li>Datos preparados de antemano, y verosímiles. Nada de crear una herramienta llamada «aaa» delante del tribunal.</li>
  <li>Nada de registrar cuentas en vivo si se puede evitar: se entra con usuarios ya creados.</li>
  <li>El producto abierto y despierto antes de empezar, para que no se vea el arranque del servicio.</li>
  <li>Plan B a mano: la ejecución local comprobada y el vídeo de la semana 25.</li>
  <li>Un error enseñado a propósito. Intentar prestar algo ya prestado y ver el mensaje correcto vale más que cinco pantallas que van bien.</li>
</ol>

<div class="compare-pair">
  <div>
    <p class="compare-label">Demostración que no convence</p>
    <p class="compare-body">Un paseo por todas las pantallas, sin completar ninguna tarea, con datos de relleno y evitando cuidadosamente todo lo que podría fallar.</p>
  </div>
  <div>
    <p class="compare-label">Demostración que convence</p>
    <p class="compare-body">Una tarea real de principio a fin, con datos que parecen reales, incluyendo el caso en que sale mal y mostrando que el sistema lo maneja.</p>
  </div>
</div>

La sexta regla es contraintuitiva y funciona: enseñar un error controlado demuestra que el producto tiene bordes, y adelanta la pregunta que el tribunal iba a hacer de todas formas.

### La arquitectura en dos minutos

El diagrama de la semana 13 en pantalla, y el recorrido de una petición contado en voz alta: de dónde sale, por dónde pasa, qué decide cada pieza y dónde se guarda. Dos minutos.

Y una frase que conviene tener preparada, porque casi siempre se pregunta: **qué queda dentro del servidor y por qué**. Ahí es donde se enseña que la autorización no depende de la interfaz.

### Las tres decisiones

Las mismas de la semana 25, ahora dichas en voz alta. Para cada una hay que poder responder a cuatro preguntas seguidas sin dudar:

<dl class="record">
  <dt>¿Qué elegisteis?</dt>
  <dd>La decisión, en una frase</dd>
  <dt>¿Qué descartasteis?</dt>
  <dd>La alternativa razonable, no una fácil de derribar</dd>
  <dt>¿Por qué en vuestro caso?</dt>
  <dd>El motivo concreto, ligado a vuestro contexto</dd>
  <dt>¿Qué habéis perdido con eso?</dt>
  <dd>La consecuencia asumida</dd>
</dl>

Si a la cuarta pregunta la respuesta es «nada», la decisión no está entendida: todas las elecciones cuestan algo.

### Errores y límites: cómo se cuentan

Es el apartado que más nota da y el que peor se prepara, porque el instinto es esconderlo.

<div class="compare-pair">
  <div>
    <p class="compare-label">Suena mal</p>
    <p class="compare-body">«No nos dio tiempo a hacer los avisos.» «El buscador no llegó a funcionar bien.» «Tuvimos problemas con el equipo.»</p>
  </div>
  <div>
    <p class="compare-label">Suena bien</p>
    <p class="compare-body">«Los avisos automáticos se descartaron en noviembre: exigían datos de contacto que decidimos no almacenar, y el momento crítico era el cierre de trimestre, no el día a día.»</p>
  </div>
</div>

La diferencia no es el tono: es que la segunda es una **decisión con fecha y motivo**, y esa frase se puede decir porque quedó escrita en la semana 6. Lo mismo con la deuda declarada de la semana 20 y con los recortes registrados de la 18.

<div class="rule">
  <p class="rule-label">Un fallo bien contado suma</p>
  <p>Si durante el curso algo salió mal —una decisión de modelo que hubo que rehacer, un despliegue que no funcionaba, un requisito que se descubrió tarde—, contadlo con su causa y con qué cambiasteis después. Un equipo que sabe diagnosticar su propio error demuestra exactamente lo que se evalúa. Lo que no se puede es contarlo como mala suerte.</p>
</div>

### El banco de preguntas

Estas salen de todo el curso, y son las que más se repiten. Repartíoslas: **el tribunal puede preguntar a cualquiera del equipo por cualquier parte**.

| De dónde sale | Pregunta |
| ------------- | -------- |
| Semana 2 | ¿Cómo llegasteis a esta idea? ¿Con quién hablasteis? |
| Semana 3 | ¿Qué otras dos ideas considerasteis y por qué las descartasteis? |
| Semana 4 | ¿Quién usa esto y en qué situación? ¿Qué hacía antes? |
| Semana 6 | ¿Qué dejasteis fuera y por qué? |
| Semana 6 | ¿Cómo sabéis que una funcionalidad está terminada? |
| Semana 10 | ¿Por qué el modelo es así? ¿Qué pasa si borro una herramienta con histórico? |
| Semana 10 | ¿Qué impide que la misma herramienta se preste dos veces a la vez? |
| Semana 12 | ¿Qué devuelve la API si pido algo a lo que no tengo acceso? |
| Semana 13 | ¿Dónde se comprueban los permisos? ¿Y si desactivo JavaScript? |
| Semana 16 | ¿Qué pasa si dos personas hacen la misma acción a la vez? |
| Semana 18 | ¿Qué protege vuestra identificación y qué no? |
| Semana 21 | ¿Qué habéis probado y por qué eso y no otra cosa? |
| Semana 22 | ¿Qué pasa si alguien cambia un identificador en la petición? |
| Semana 23 | ¿Dónde están las contraseñas de producción? |
| Semana 24 | ¿Cómo sabríais que el servicio se ha caído? |
| Semana 20 | ¿Qué parte del código rehacéis si tuvierais dos semanas más? |
| Todo el curso | ¿Qué habéis usado de IA y en qué lo comprobasteis? |
| Todo el curso | ¿Qué hizo cada persona del equipo? |

<div class="rule">
  <p class="rule-label">La penúltima merece preparación</p>
  <p>El uso de IA es legítimo y está declarado desde la semana 3. La respuesta buena dice para qué se usó, qué hubo que corregir y cómo se comprobó lo que devolvía. La respuesta mala es «no usamos», porque casi nunca es verdad, y la peor es no saber explicar un trozo del propio proyecto.</p>
</div>

### Responder a lo que no se sabe

Va a pasar, y está previsto que pase: parte del trabajo del tribunal es encontrar el borde.

<div class="compare-pair">
  <div>
    <p class="compare-label">Lo que hunde</p>
    <p class="compare-body">Inventar. Se nota enseguida, porque la siguiente pregunta profundiza, y a partir de ahí todo lo demás que habéis dicho queda en duda.</p>
  </div>
  <div>
    <p class="compare-label">Lo que salva</p>
    <p class="compare-body">«No lo sé con seguridad. Lo que sí sé es que…», y decir la parte que sí controláis, o cómo lo averiguaríais. Es una respuesta profesional, no una derrota.</p>
  </div>
</div>

Y si la pregunta señala un fallo real: se reconoce, se dice si estaba detectado y dónde está anotado. Un fallo que aparece en vuestro propio registro de limitaciones deja de ser un fallo encontrado por el tribunal y pasa a ser una limitación conocida.

### El ensayo

<p class="stage stage--guided">Lo hacemos juntos</p>

La última hora es el ensayo, y no es opcional: casi todos los problemas de una defensa aparecen la primera vez que se dice en voz alta.

<ol class="fill-in">
  <li>Cronometrado de verdad. La mayoría de los equipos se pasa de tiempo en el problema y llega a la demostración con prisa.</li>
  <li>Otro equipo hace de tribunal, con el banco de preguntas delante, y escoge a quién pregunta.</li>
  <li>La demostración se hace entera, con el producto real, no contándola.</li>
  <li>Se prueba una vez el plan B: sin red, con el vídeo o con la ejecución local.</li>
  <li>Se anota qué pregunta dejó a alguien en blanco. Esa es la que hay que preparar esta semana.</li>
</ol>

<dl class="answer">
  <dt>¿Cuánto duró de verdad, y dónde se fue el tiempo?</dt>
  <dd></dd>
  <dt>¿Qué pregunta dejó al equipo sin respuesta?</dt>
  <dd></dd>
  <dt>¿Qué parte del proyecto no sabía explicar alguien del equipo?</dt>
  <dd></dd>
  <dt>¿Funcionó el plan B?</dt>
  <dd></dd>
</dl>

### Producto de la unidad

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Presentación y defensa técnica final.</p>
  <ul class="checklist">
    <li>Presentación con el reparto de tiempo, empezando por el problema y no por la tecnología.</li>
    <li>Guion de demostración escrito: qué recorrido, con qué datos y en qué orden.</li>
    <li>Datos de demostración preparados y verosímiles, cargados antes de empezar.</li>
    <li>Un error mostrado a propósito dentro del recorrido.</li>
    <li>Plan B probado: ejecución local y vídeo, sin depender de la red.</li>
    <li>Las tres decisiones, con sus cuatro respuestas, repartidas entre el equipo.</li>
    <li>Apartado de límites, deuda declarada y qué haríais distinto.</li>
    <li>Banco de preguntas trabajado, con las respuestas repartidas y las dudosas identificadas.</li>
    <li>Ensayo cronometrado con otro equipo, y la lista de lo que hay que corregir.</li>
    <li>Todo el equipo capaz de explicar cualquier parte del proyecto.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que se entienda el problema | Se explica antes que la tecnología y con alguien concreto detrás |
| Que funcione delante | La demostración completa una tarea real, errores incluidos |
| Que haya criterio | Las decisiones nombran alternativa, motivo y consecuencia |
| Que haya honestidad | Los límites se dicen, con fecha y motivo, no como excusa |
| Que el dominio sea de todos | Cualquiera del equipo responde de cualquier parte |
| Que no dependa de la suerte | El plan B está probado, no imaginado |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Cuáles son las tres cosas que un tribunal intenta averiguar?</li>
    <li>¿Por qué no se empieza por la tecnología?</li>
    <li>¿Por qué se enseña un error a propósito en la demostración?</li>
    <li>Si a «¿qué habéis perdido con esa decisión?» respondéis «nada», ¿qué está pasando?</li>
    <li>Os preguntan algo que no sabéis. ¿Qué se hace?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Si entendéis lo que construisteis, si funciona de verdad y si sabéis dónde están vuestros límites.</p>
  <p>2 · Porque la tecnología la ha usado todo el mundo y no dice qué problema resuelve el proyecto.</p>
  <p>3 · Porque demuestra que el producto tiene bordes tratados, y adelanta una pregunta que iba a llegar igual.</p>
  <p>4 · Que la decisión no está entendida: toda elección cuesta algo.</p>
  <p>5 · Decirlo, y añadir la parte que sí se controla o cómo se averiguaría. Nunca inventar.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Cierre del módulo</p>
  <ul class="checklist">
    <li>El producto está desplegado, público y funcionando.</li>
    <li>El repositorio se entiende y se puede ejecutar siguiendo el README.</li>
    <li>Las decisiones de veintiséis semanas están escritas y localizables.</li>
    <li>El caso de portfolio se puede enseñar a alguien fuera del centro.</li>
    <li>La defensa está ensayada y todo el equipo puede responder por cualquier parte.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Preparar una defensa</figcaption>
  <ol class="flow">
    <li>Se empieza por el problema y por la persona que lo sufría</li>
    <li>Se sitúa el alcance antes de enseñar nada: qué entra y qué no</li>
    <li>Se demuestra una tarea completa, con datos verosímiles y un error incluido</li>
    <li>Se cuenta el recorrido de una petición sobre el diagrama</li>
    <li>Se defienden tres decisiones con alternativa, motivo y consecuencia</li>
    <li>Se dicen los límites con su fecha y su motivo, no como excusa</li>
    <li>Se reparte el banco de preguntas: cualquiera responde de cualquier parte</li>
    <li>Se ensaya cronometrado, con alguien haciendo de tribunal y probando el plan B</li>
  </ol>
</figure>

Y las cuatro frases con las que cierra el módulo:

> **Empezar por la tecnología es empezar por lo que no os distingue.**
>
> **Una decisión que no costó nada es una decisión que no se ha entendido.**
>
> **Un límite escrito en noviembre es criterio; el mismo límite explicado en junio sin haberlo escrito es una excusa.**
>
> **Un proyecto no vale por lo que promete, sino por lo que se puede enseñar funcionando y explicar sin excusas.**

La última es la misma frase con la que empezó la semana 1. Ese era el objetivo del módulo entero.

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Defensa técnica | La comprobación de si entendéis lo construido, funciona y conocéis sus límites |
| Demostración resistente | La que se ha ensayado, tiene datos preparados y no depende de la suerte |
| Error mostrado a propósito | Enseñar un camino que falla para demostrar que está tratado |
| Consecuencia asumida | Lo que se pierde con una decisión, y hay que saber decir |
| Límite conocido | Lo que no se hizo, con fecha y motivo, frente a lo que no dio tiempo |
| Banco de preguntas | Las preguntas previsibles, repartidas y preparadas por todo el equipo |
| Plan B | La forma de enseñar el producto cuando falla lo que no controláis |

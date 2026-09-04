---
title: "Preparar el desarrollo"
label: "UD8 · Planificar"
section: "ud-08"
order: 8
lang: "es"
summary: "Convertir el producto definido en tareas, backlog, prioridades y un flujo de trabajo verificable con GitHub."
duration: "3 horas · 1 semana · 1 sesión"
modality: "Taller de gestión · repositorio real"
deliverable: "Repositorio, tablero y roadmap inicial preparados."
date: "2026-08-31"
outcomes:
  - "Dividir el alcance en tareas pequeñas y comprobables."
  - "Preparar backlog, prioridades y roadmap."
  - "Trabajar con issues, ramas, pull requests y Definition of Done."
requirements:
  - "Alcance, prototipo, datos, API y arquitectura revisados."
  - "Cuenta de GitHub."
priorKnowledge:
  - "Fundamentos de Git y GitHub."
---

<p class="lead">La gestión de proyecto se introduce de forma aplicada: cada concepto modifica el repositorio y el tablero que se utilizarán durante la construcción.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio. Se propone un flujo mínimo común y cada equipo adapta el detalle sin perder trazabilidad.</p>
</div>

<div class="rule">
  <p class="rule-label">La semana bisagra</p>
  <p>Es la última semana de preparación y la primera del segundo tramo del curso. Todo lo que se decida hoy se va a usar todos los días hasta junio: cómo se trocea el trabajo, dónde se anota, cómo entra el código y cuándo algo está terminado. Un equipo que sale de esta sesión sin tablero llega a la semana 20 sin saber qué le falta.</p>
</div>

## Sesión 14 · Del alcance al tablero

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué el trabajo se trocea en vertical, cómo se ordena un backlog por riesgo y no por gusto, y qué es una definición de terminado.</li>
    <li><strong>2. Haz:</strong> Trocea el MVP en tareas, monta el repositorio y el tablero, acuerda el flujo de ramas y escribe el roadmap hasta la semana 26.</li>
    <li><strong>3. Comprueba:</strong> Entrega el repositorio preparado y revisa la evaluación.</li>
  </ol>
</div>

### El trabajo se trocea en vertical

En la semana 6 se decidió que el MVP era un corte vertical. Ahora la misma idea se aplica al reparto del trabajo diario, y es la decisión que más afecta a lo que pasará entre la semana 15 y la 18.

<div class="compare-pair">
  <div>
    <p class="compare-label">Repartir por capas</p>
    <p class="compare-body">«Tú haces todo el backend y yo todo el frontend.» Cada persona avanza sin poder probar nada, la integración se deja para el final y quien termina antes espera. Si alguien se descuelga, se para la mitad del proyecto.</p>
  </div>
  <div>
    <p class="compare-label">Repartir por historias</p>
    <p class="compare-body">«Tú haces registrar un préstamo entera, yo devolver entera.» Cada persona toca las dos mitades, cada tarea acaba en algo demostrable y nadie es la única que entiende un lado.</p>
  </div>
</div>

Este es el plan que el registro de riesgos de la semana 13 apuntaba para el riesgo más peligroso del proyecto, que no era técnico. Repartir por capas es cómodo el primer día y caro todos los demás.

<p class="term">Tarea</p>

Un trozo de trabajo que una persona puede terminar en un par de días y que, al acabar, deja algo que se puede enseñar funcionando.

Si una tarea no se puede demostrar —«montar la estructura», «investigar cómo va la autenticación»— no es una tarea: es una parte de otra, y hay que decir de cuál.

### Cómo se trocea una historia

<p class="stage">Paso 1 · Te enseño uno</p>

La historia H5, registrar que me llevo una herramienta, troceada:

<dl class="worked">
  <dt>T1 · Crear un préstamo, camino feliz, de punta a punta</dt>
  <dd>Pantalla mínima, petición real, regla básica, dato guardado, respuesta pintada. Fea pero entera. Se puede enseñar.</dd>
  <dt>T2 · Rechazar el préstamo de una herramienta ya prestada</dt>
  <dd>Regla en el servidor, error del contrato, mensaje en la pantalla. Cubre CA-2.</dd>
  <dt>T3 · Avisar si ya la tiene quien la pide</dt>
  <dd>Cubre CA-3 y H14.</dd>
  <dt>T4 · Impedir el préstamo de una herramienta retirada</dt>
  <dd>Cubre RF-06 en su tercer caso.</dd>
  <dt>Qué tienen en común las cuatro</dt>
  <dd>Cada una acaba en algo que se puede probar delante de alguien, y cada una está atada a un criterio de aceptación de la semana 6. Ninguna es «hacer el modelo» o «hacer el controlador».</dd>
  <dt>Por qué T1 va sola y primero</dt>
  <dd>Porque es la que elimina la incertidumbre: hasta que una petición no ha viajado entera, nadie sabe si el montaje funciona. Las otras tres son variaciones sobre un camino que ya existe.</dd>
</dl>

### El backlog, ordenado por riesgo

<p class="term">Backlog</p>

La lista completa de tareas pendientes, ordenada, donde lo primero es lo siguiente que se va a hacer.

Ordenar es el trabajo. Y el criterio no es la importancia, que es lo que todo el mundo cree:

<div class="rule">
  <p class="rule-label">La regla de ordenación</p>
  <p>Primero lo que más incertidumbre elimina, no lo más importante ni lo más fácil. Una tarea aburrida que demuestra que el montaje entero funciona vale más, en la semana 15, que la funcionalidad estrella a medias. Cuando dos tareas eliminan la misma incertidumbre, entonces sí decide la importancia.</p>
</div>

Tres etiquetas bastan para el estado, y no hay que inventar más:

| Etiqueta | Qué significa |
| -------- | ------------- |
| **MVP** | Sin esto no se puede entregar. Sale del anillo interior de la semana 6 |
| **Mejora** | Anillo «versión 2»: entra si sobra tiempo, y solo si el MVP está cerrado |
| **Fuera** | Está en la lista de exclusiones. Se anota para no volver a discutirlo |

Poner «alta» a todo es la forma más rápida de no priorizar nada.

### El repositorio, el primer día

Lo que tiene que existir antes de escribir la primera línea de código del proyecto:

<ol class="fill-in">
  <li>Un README que ya dice qué es el proyecto, para quién y cómo se ejecuta, aunque todavía no se ejecute nada. Se irá completando, pero nace hoy.</li>
  <li>Un fichero de exclusiones de Git correcto para el stack, antes del primer commit. Lo que entra en el histórico no se va limpiamente.</li>
  <li>Un fichero de ejemplo de configuración con los nombres de las variables y valores falsos, y las reales fuera del repositorio.</li>
  <li>La documentación de las semanas 1 a 13 dentro del repositorio, no en un chat ni en carpetas personales.</li>
  <li>El enlace al prototipo publicado, arriba del README.</li>
</ol>

<div class="rule">
  <p class="rule-label">Los secretos no se borran, se rotan</p>
  <p>Si una contraseña o una clave llega a subirse, borrarla en un commit posterior no la elimina: sigue en el histórico y sigue siendo pública. Lo que hay que hacer es cambiar la credencial. Por eso el fichero de exclusiones se prepara antes del primer commit y no después del primer susto.</p>
</div>

### Issues y tablero

Cada tarea es una issue, y cada issue se escribe con lo que hará falta para cerrarla, no con un título suelto:

<dl class="record">
  <dt>Título</dt>
  <dd>Rechazar el préstamo de una herramienta ya prestada</dd>
  <dt>Qué historia y qué criterio cubre</dt>
  <dd>H5 · CA-2 · RF-06</dd>
  <dt>Qué hay que ver funcionando para cerrarla</dt>
  <dd>Que al intentar prestar T-014 estando ya prestada, la pantalla dice quién la tiene y no se crea ningún registro</dd>
  <dt>Etiqueta</dt>
  <dd>MVP</dd>
  <dt>Quién</dt>
  <dd>Asignada a una persona, no al equipo</dd>
</dl>

La tercera casilla es la que evita la discusión de «yo pensaba que ya estaba». Y el tablero necesita exactamente cuatro columnas:

<figure class="diagram">
  <figcaption>El tablero mínimo</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Pendiente</li>
    <li>En curso</li>
    <li>En revisión</li>
    <li>Terminado</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">Una regla que duele y funciona</p>
  <p>Como máximo una tarjeta por persona en «En curso». Si alguien quiere empezar otra cosa, primero termina la que tiene o la devuelve a pendiente explicando por qué. Un tablero con nueve tarjetas en curso y ninguna terminada es exactamente el aspecto que tiene un proyecto que no va a llegar.</p>
</div>

### Ramas y revisión

El flujo mínimo, y para un equipo de dos o tres personas no hace falta más:

<figure class="diagram">
  <figcaption>El ciclo de una tarea</figcaption>
  <ol class="flow">
    <li>Se coge una issue del tablero y se mueve a «En curso»</li>
    <li>Se abre una rama cuyo nombre dice qué issue es</li>
    <li>Se trabaja con commits pequeños que explican el porqué, no el qué</li>
    <li>Se abre una pull request que enlaza la issue</li>
    <li>La otra persona la revisa y comenta</li>
    <li>Se integra en la rama principal y se cierra la issue</li>
  </ol>
</figure>

<div class="compare-pair">
  <div>
    <p class="compare-label">Commit que no dice nada</p>
    <p class="compare-body">«cambios», «arreglos», «ya va». En la semana 25 nadie sabrá qué pasó ahí, y en la defensa no se puede enseñar.</p>
  </div>
  <div>
    <p class="compare-label">Commit que cuenta algo</p>
    <p class="compare-body">«Impide prestar una herramienta ya prestada (CA-2)». Se lee en junio y se entiende sin abrir el código.</p>
  </div>
</div>

La regla que sostiene todo esto es una sola: **la rama principal siempre funciona**. Si alguien la rompe, arreglarla es lo primero que hace cualquiera del equipo, por delante de su propia tarea.

<div class="rule">
  <p class="rule-label">Por qué se revisa el código de la otra persona</p>
  <p>No es un trámite ni una desconfianza. Es lo que evita que en junio haya partes del proyecto que solo una persona entiende, y en la defensa se pregunta a cualquiera del equipo por cualquier parte. Una revisión de cinco minutos que solo pregunte «¿por qué así?» ya cumple su función.</p>
</div>

### La definición de terminado

<p class="term">Definición de terminado</p>

La lista, acordada de antemano y única para todo el proyecto, de lo que tiene que cumplirse para mover una tarjeta a «Terminado».

Se escribe hoy porque en marzo, con prisa, nadie la escribe. Una propuesta que podéis ajustar:

<ol class="fill-in">
  <li>El criterio de aceptación de la issue se cumple, comprobado a mano por alguien que no la programó.</li>
  <li>Funciona el camino de error, no solo el feliz.</li>
  <li>No rompe nada de lo que ya funcionaba.</li>
  <li>La rama principal sigue arrancando con las instrucciones del README.</li>
  <li>La pull request está revisada por otra persona del equipo.</li>
  <li>Si cambió el contrato de la API o el modelo, la documentación está actualizada en el mismo cambio.</li>
</ol>

La sexta es la que salva la memoria de junio. **La documentación que se actualiza en el mismo cambio existe; la que se deja para el final, no.**

### El roadmap hasta el final

Las doce semanas que quedan, con el hito de cada una. No es una promesa: es el mapa contra el que se comprueba si se va tarde.

| Semanas | Qué tiene que existir al final |
| ------- | ------------------------------ |
| 15 | Una petición viaja de punta a punta: pantalla, API, base de datos y vuelta |
| 16 | Persistencia y reglas del MVP, y una versión mínima desplegada aunque sea fea |
| 17 | El frontend real conectado, con estados de carga y de error |
| 18 | Autenticación, permisos comprobados en el servidor y MVP cerrado |
| 19 – 20 | Producto evolucionado con lo aprendido al probarlo con gente |
| 21 – 22 | Tests, revisión, accesibilidad y seguridad: candidata a versión final |
| 23 – 24 | Desplegada, con dominio, datos de prueba y comprobaciones de funcionamiento |
| 25 | Caso de portfolio y README definitivo |
| 26 | Defensa preparada y ensayada |

<div class="rule">
  <p class="rule-label">Los dos hitos que no se negocian</p>
  <p>La petición de punta a punta en la semana 15 y el despliegue mínimo en la semana 16. Los dos salen del registro de riesgos, y los dos existen para descubrir pronto lo que hunde proyectos tarde. Es preferible llegar a la semana 18 con menos funcionalidades y esas dos cosas hechas, que al revés.</p>
</div>

### Tarea de la sesión

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Trocead cada historia del MVP en tareas demostrables, atadas a sus criterios de aceptación.</li>
  <li>Ordenad el backlog por incertidumbre eliminada, y justificad las tres primeras.</li>
  <li>Montad el repositorio con las cinco cosas de la lista, y comprobad las exclusiones antes del primer commit.</li>
  <li>Cread las issues del MVP con las cinco casillas, y el tablero con las cuatro columnas.</li>
  <li>Acordad por escrito el flujo de ramas, quién revisa y qué se hace si la rama principal se rompe.</li>
  <li>Escribid la definición de terminado y ponedla donde se vea, no en un documento que nadie abre.</li>
  <li>Repartid las primeras tareas por historias verticales, nunca por capas.</li>
</ol>

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Repositorio, tablero y roadmap inicial preparados.</p>
  <ul class="checklist">
    <li>Repositorio con README, exclusiones de Git, configuración de ejemplo y toda la documentación de las semanas 1 a 13.</li>
    <li>Backlog completo del MVP, ordenado, con las tres etiquetas y sin todo marcado como prioritario.</li>
    <li>Issues escritas con historia, criterio, prueba de cierre, etiqueta y persona asignada.</li>
    <li>Tablero con cuatro columnas y el límite de una tarjeta en curso por persona.</li>
    <li>Flujo de ramas y revisión acordado por escrito.</li>
    <li>Definición de terminado, común a todo el proyecto.</li>
    <li>Roadmap por semanas hasta la 26, con el hito de cada una.</li>
    <li>Reparto inicial por historias verticales, con quién hace qué esta semana.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que las tareas sean demostrables | Ninguna es «montar la estructura» o «investigar algo» |
| Que haya trazabilidad | Cada issue apunta a una historia y a un criterio de aceptación |
| Que el orden esté razonado | Las primeras tareas eliminan incertidumbre, no son las más cómodas |
| Que el reparto sea vertical | Nadie es la única persona que entiende una mitad del proyecto |
| Que el flujo esté acordado | Ramas, revisión y rama principal estable, escrito antes de empezar |
| Que la definición de terminado exista | Está escrita, es única y se aplicará desde la semana 15 |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué no se reparte «tú el backend y yo el frontend»?</li>
    <li>¿Cuándo un trozo de trabajo no es una tarea?</li>
    <li>¿Por qué se ordena el backlog por incertidumbre y no por importancia?</li>
    <li>Se ha subido una contraseña al repositorio y se borra en el commit siguiente. ¿Resuelto?</li>
    <li>¿Cuál es el límite de tarjetas en curso por persona, y por qué?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque nadie puede probar nada hasta el final, la integración se acumula y si alguien se descuelga se para media aplicación.</p>
  <p>2 · Cuando no acaba en algo que se pueda enseñar funcionando.</p>
  <p>3 · Porque lo que hunde un proyecto es descubrir tarde que algo no funciona, no hacer tarde lo importante.</p>
  <p>4 · No. Sigue en el histórico y sigue siendo pública: hay que cambiar la credencial.</p>
  <p>5 · Una. Porque un tablero lleno de tareas empezadas y ninguna terminada es un proyecto que no llega.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 15</p>
  <ul class="checklist">
    <li>El tablero tiene tarjetas y cada persona sabe cuál es la suya.</li>
    <li>Todo el mundo puede clonar el repositorio y arrancar lo que haya siguiendo el README.</li>
    <li>La primera tarea de cada persona es un corte vertical, no una capa.</li>
    <li>Sabéis que el hito de la semana 15 no es una pantalla bonita: es una petición que viaja entera.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Del alcance al trabajo diario</figcaption>
  <ol class="flow">
    <li>Cada historia se trocea en tareas demostrables, atadas a un criterio</li>
    <li>El backlog se ordena por la incertidumbre que elimina cada tarea</li>
    <li>El repositorio nace con README, exclusiones y documentación dentro</li>
    <li>Cada tarea es una issue que dice qué hay que ver para cerrarla</li>
    <li>Una tarjeta en curso por persona, y la rama principal siempre funciona</li>
    <li>Cada cambio pasa por una revisión de otra persona del equipo</li>
    <li>Una sola definición de terminado, escrita antes de empezar</li>
    <li>Un roadmap por semanas contra el que comprobar si se va tarde</li>
  </ol>
</figure>

Y las tres frases de la unidad:

> **Se reparte por historias, no por capas.**
>
> **Primero lo que más incertidumbre elimina, no lo más importante.**
>
> **La documentación que se actualiza en el mismo cambio existe; la que se deja para el final, no.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Tarea | Trabajo de un par de días que acaba en algo que se puede enseñar |
| Corte vertical | Un trozo que atraviesa todas las capas, frente a repartir por capas |
| Backlog | La lista ordenada de pendientes, donde lo primero es lo siguiente |
| Incertidumbre | Lo que aún no sabéis si funciona, y por eso se ataca antes |
| Issue | La tarea escrita, con su criterio y con qué hay que ver para cerrarla |
| Rama principal estable | Que lo integrado siempre arranca y funciona |
| Pull request | El cambio propuesto que otra persona revisa antes de integrarlo |
| Definición de terminado | La lista común que decide cuándo una tarjeta pasa a terminada |
| Roadmap | El hito de cada semana, para saber si se va tarde |
| Límite en curso | El máximo de tareas empezadas a la vez por persona |

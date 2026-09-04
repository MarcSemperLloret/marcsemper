---
title: "Evolucionar el producto"
label: "UD10 · Evolucionar"
section: "ud-10"
order: 10
lang: "es"
summary: "Recoger feedback, priorizar limitaciones y producir una segunda versión mediante correcciones, cambios y refactorización."
duration: "6 horas · 2 semanas · 2 sesiones"
modality: "Iteración de producto · feedback y retrospectiva"
deliverable: "Segunda versión mejorada del producto."
date: "2026-08-31"
outcomes:
  - "Convertir feedback en decisiones accionables."
  - "Distinguir bugs, cambios de requisitos, deuda y nuevas funciones."
  - "Priorizar una evolución viable del producto."
  - "Documentar qué cambió y por qué."
requirements:
  - "MVP funcional de la UD9."
  - "Personas disponibles para probarlo."
priorKnowledge:
  - "Flujo con issues, ramas y pull requests."
---

<p class="lead">Una vez que el MVP funciona, el proyecto deja de obedecer únicamente al plan inicial y empieza a responder a evidencias de uso.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje bajo. El equipo decide qué feedback acepta, qué rechaza y qué aplaza, y debe justificarlo.</p>
</div>

<div class="rule">
  <p class="rule-label">Las dos semanas, de un vistazo</p>
  <p>Semana 19, escuchar: recoger evidencias de uso y clasificarlas. Semana 20, decidir y ejecutar la segunda versión. Son las últimas semanas en las que se puede añadir algo: a partir de la 21 el proyecto solo se estabiliza, y lo que no esté hecho no entrará.</p>
</div>

## Sesión 19 · Escuchar el producto

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué fuentes de evidencia existen y cuánto vale cada una, qué limitaciones no cuenta nadie, y por qué clasificar el feedback cambia la decisión.</li>
    <li><strong>2. Haz:</strong> Recoge evidencias de uso real y reparte cada una en uno de los cuatro cubos, con su motivo.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el checkpoint de la sesión 19.</li>
  </ol>
</div>

### El plan deja de mandar

Hasta ahora el proyecto obedecía a la especificación de la semana 6. A partir de hoy hay algo que la especificación no tenía: un producto que existe y que alguien puede usar. Y lo que ocurre al usarlo pesa más que lo que se escribió en octubre.

<div class="rule">
  <p class="rule-label">Lo que no significa</p>
  <p>No significa que ahora se haga lo que pida cualquiera. Significa que una evidencia de uso puede cambiar una decisión anterior, y que ese cambio se registra. Cambiar de opinión con motivo escrito es criterio; cambiarla cada semana según quién hable, no.</p>
</div>

### Tres fuentes, y no valen lo mismo

| Fuente | Qué da | Cuánto fiarse |
| ------ | ------ | ------------- |
| **Lo que la gente dice** | Opiniones, quejas, ideas | Poco. La gente es amable y racionaliza |
| **Lo que la gente hace** | Dónde se para, qué pulsa mal, qué abandona | Mucho. Es lo único que no se puede fingir |
| **Lo que dice el propio sistema** | Errores repetidos, operaciones que nadie usa, datos que quedan raros | Mucho, y nadie lo mira |

La tercera fuente es la más desaprovechada y ya la tenéis: el producto lleva desde la semana 16 guardando datos. Mirad qué hay dentro.

<p class="stage">Paso 1 · Te enseño uno</p>

Lo que encontró el equipo de PrestaTaller al mirar sus propios datos después de dos semanas de uso:

<dl class="worked">
  <dt>Préstamos que nadie cierra</dt>
  <dd>Catorce préstamos abiertos de más de una semana. Al preguntar: la gente devuelve la herramienta al armario pero no registra la devolución cuando la tablet está ocupada por otra persona.</dd>
  <dt>Un error que se repite</dt>
  <dd>El error de «ya la tienes tú» aparece muchas veces al día. No es un fallo: es que la gente no recuerda si llegó a registrar el préstamo, exactamente lo que se predijo en la semana 5. Pero indica que la pantalla no está mostrando bien lo que ya tienen.</dd>
  <dt>Una operación que nadie usa</dt>
  <dd>El buscador por código apenas se utiliza; la gente recorre la lista. Al mirarlo: los códigos están grabados en la herramienta con una letra minúscula y con las manos sucias no se leen.</dd>
  <dt>Qué tienen en común los tres</dt>
  <dd>Ninguno lo dijo nadie. Los tres salen de mirar los datos y después preguntar por lo que se ha visto, que es el orden correcto.</dd>
</dl>

### Cómo se recoge sin contaminar

La misma regla de la semana 2, y sigue siendo la que más cuesta respetar: se dan **tareas**, no se hacen preguntas hipotéticas.

<div class="compare-pair">
  <div>
    <p class="compare-label">Contamina</p>
    <p class="compare-body">«¿Te parece cómodo el buscador?» La respuesta será que sí, porque decir que no obliga a justificarse delante de quien lo ha hecho.</p>
  </div>
  <div>
    <p class="compare-label">No contamina</p>
    <p class="compare-body">«Llévate la T-014 y devuélvela.» Y mirar en silencio. Lo que haga esa persona vale más que cualquier respuesta.</p>
  </div>
</div>

Y una regla extra que ahora importa más que en la semana 8: **hablad con quien lo usa de verdad**, no solo con compañeros de clase. Una persona del contexto detecta en cinco minutos cosas que un aula entera no ve.

### Las limitaciones que no cuenta nadie

Hay problemas que no aparecen en ningún feedback porque quien los sufre no sabe que son problemas, o porque afectan a quien no está en la sala:

<ol class="fill-in">
  <li>Lo que no funciona con teclado, para quien no usa ratón.</li>
  <li>Lo que tarda demasiado con una conexión lenta, que en un aula con buena red nunca se nota.</li>
  <li>Lo que se rompe cuando hay muchos datos, si solo se ha probado con diez filas.</li>
  <li>Lo que ocurre en el segundo trimestre, cuando el histórico ya es grande.</li>
  <li>Lo que pasa si dos personas hacen lo mismo a la vez.</li>
</ol>

Estas se buscan a propósito, porque no van a llegar solas. Las tres primeras se comprueban hoy; las dos últimas quedan para la semana 21.

### Los cuatro cubos

Todo lo recogido va a uno de estos cuatro sitios, y **la clasificación no es burocracia: cada cubo tiene una regla de decisión distinta**.

| Cubo | Qué es | Cómo se decide |
| ---- | ------ | -------------- |
| **Fallo** | El producto hace algo distinto de lo que dice su criterio de aceptación | Se arregla. No se prioriza: se arregla |
| **Cambio de requisito** | El producto hace lo que se decidió, y lo que se decidió estaba mal | Se decide de nuevo, y se registra el cambio |
| **Nueva funcionalidad** | Algo que nunca estuvo en el alcance | Regla de la semana 6: si entra, algo sale |
| **Deuda técnica** | Funciona bien por fuera y cuesta mucho cambiarlo por dentro | Se hace visible y se paga o se declara |

<p class="stage stage--guided">Lo hacemos juntos</p>

Clasificad estos seis hallazgos reales de PrestaTaller. Alguno admite discusión, y la discusión es el ejercicio:

| Hallazgo | Cubo | Por qué |
| -------- | ---- | ------- |
| *La lista de préstamos no se ordena por antigüedad y el responsable la quiere así* | *Cambio de requisito* | *Se decidió sin pensarlo; H9 pedía «desde cuándo» y esto lo completa* |
| Al devolver, la herramienta sigue apareciendo un segundo en «lo que tengo» | | |
| La gente pide poder devolver varias cosas de una vez | | |
| Los códigos no se leen con las manos sucias | | |
| Toda la lógica de préstamos está en un solo fichero de 600 líneas | | |
| El panel del responsable tarda cuatro segundos con 300 préstamos | | |

<details class="aside aside--help">
  <summary>Dos que suelen discutirse</summary>
  <p>Los códigos ilegibles no son un fallo del software: el producto hace lo que decía. Pero tampoco son una funcionalidad nueva. Son un <em>cambio de requisito</em>, porque el supuesto de la semana 4 —que la gente identificaría la herramienta por su código— era falso en el contexto real.</p>
  <p>Los cuatro segundos del panel sí son un fallo, aunque no lo parezca: RNF-02 fijó un umbral en la semana 5 y no se está cumpliendo. Un requisito no funcional incumplido es un fallo, no una mejora deseable.</p>
</details>

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Dad tres tareas a tres personas que no sean del equipo, sin ayudar, y anotad qué hacen.</li>
  <li>Mirad los datos que ha guardado vuestro producto y buscad lo que nadie ha contado.</li>
  <li>Comprobad las tres limitaciones que no cuenta nadie: teclado, conexión lenta y volumen de datos.</li>
  <li>Clasificad todo lo recogido en los cuatro cubos, con el motivo de cada clasificación.</li>
  <li>Convertid cada elemento en una issue, etiquetada con su cubo.</li>
</ol>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 19</p>
  <ul class="checklist">
    <li>Hay evidencias de observación, no solo opiniones.</li>
    <li>Se han mirado los datos del propio producto y ha salido algo que nadie había dicho.</li>
    <li>Se han buscado a propósito las limitaciones que nadie reporta.</li>
    <li>Todo está clasificado en los cuatro cubos, con motivo, y convertido en issues.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>De las tres fuentes, ¿cuál es la menos fiable y por qué?</li>
    <li>¿Cuál es la fuente que nadie mira y ya tenéis?</li>
    <li>¿Cómo se pide feedback sin contaminarlo?</li>
    <li>Un requisito no funcional que no se cumple, ¿es un fallo o una mejora?</li>
    <li>¿Qué regla se aplica a una funcionalidad nueva?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Lo que la gente dice: es amable y racionaliza lo que hace.</p>
  <p>2 · Los datos que el propio sistema lleva guardando desde la semana 16.</p>
  <p>3 · Dando una tarea y mirando en silencio, en vez de preguntar si algo le parece cómodo.</p>
  <p>4 · Un fallo: había un umbral escrito y no se cumple.</p>
  <p>5 · La de la semana 6: si entra, algo del mismo tamaño sale.</p>
</details>

---

## Sesión 20 · La segunda versión

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se ordena lo recogido, cuándo se refactoriza y cuándo no, y cómo se hace visible la deuda técnica en lugar de esconderla.</li>
    <li><strong>2. Haz:</strong> Decide qué entra en la segunda versión, ejecútalo y escribe el registro de versiones.</li>
    <li><strong>3. Comprueba:</strong> Entrega la segunda versión y revisa la evaluación.</li>
  </ol>
</div>

### El orden de la semana 20

No hace falta un método nuevo: los cubos ya casi deciden solos. El orden es este, y saltárselo es lo que hace que un proyecto llegue a la semana 25 con funcionalidades nuevas y fallos viejos:

<figure class="diagram">
  <figcaption>En qué orden se ataca</figcaption>
  <ol class="flow">
    <li><span class="flow-role">1</span>Fallos que rompen una regla o pierden datos</li>
    <li><span class="flow-role">2</span>Fallos que impiden completar una tarea</li>
    <li><span class="flow-role">3</span>Cambios de requisito que afectan a si el producto se usa</li>
    <li><span class="flow-role">4</span>Deuda técnica en lo que vais a tocar estas dos semanas</li>
    <li><span class="flow-role">5</span>Fallos cosméticos y funcionalidades nuevas, si queda tiempo</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">La regla del alcance sigue viva</p>
  <p>Todo lo del punto 5 pasa por la prueba de entrada de la semana 6, y nada entra gratis: si entra, algo sale. Es fácil olvidarlo ahora, porque el producto funciona y da la sensación de que hay margen. No lo hay: quedan seis semanas y dos de ellas no son para construir.</p>
</div>

### Refactorizar: cuándo sí y cuándo no

<p class="term">Refactorizar</p>

Cambiar cómo está escrito el código sin cambiar lo que hace, para que sea más fácil de entender o de modificar.

Es una palabra que en esta fase se usa a menudo para justificar reescribir algo que aburre. Dos reglas la mantienen útil:

<div class="compare-pair">
  <div>
    <p class="compare-label">Se refactoriza</p>
    <p class="compare-body">Lo que vais a tocar en estas dos semanas y cuesta tocar. La refactorización se paga sola porque el cambio siguiente va más rápido.</p>
  </div>
  <div>
    <p class="compare-label">No se refactoriza</p>
    <p class="compare-body">Lo que funciona y no vais a tocar, por feo que sea. En la semana 20, tocar código que nadie iba a tocar solo puede introducir fallos nuevos.</p>
  </div>
</div>

<div class="rule">
  <p class="rule-label">Nunca en el mismo cambio</p>
  <p>Refactorizar y cambiar comportamiento no van en el mismo commit. Si algo se rompe, no habrá manera de saber si fue el cambio de forma o el de fondo, y la revisión de la otra persona se vuelve imposible: un diff de trescientas líneas donde tres cambian el comportamiento no lo revisa nadie de verdad.</p>
</div>

### La deuda técnica, visible

<p class="term">Deuda técnica</p>

Una decisión que hizo el trabajo más rápido hoy y lo hará más lento mañana. No es un error: a veces se asume a propósito, y eso es legítimo si se sabe y se anota.

El problema no es tenerla, es que sea invisible. Se registra así:

<dl class="record">
  <dt>Qué</dt>
  <dd>Toda la lógica de préstamos está en un único fichero de 600 líneas</dd>
  <dt>Por qué se asumió</dt>
  <dd>En la semana 15 se priorizó que la operación viajara entera antes que la estructura</dd>
  <dt>Qué cuesta</dt>
  <dd>Cada cambio obliga a leerlo todo y dos personas no pueden tocarlo a la vez sin conflictos</dd>
  <dt>Decisión</dt>
  <dd>Se paga ahora, porque las tres correcciones de esta semana caen justo ahí</dd>
  <dt>Alternativa</dt>
  <dd>Si no cayeran ahí, se declararía como limitación conocida y se dejaría, diciéndolo en la memoria</dd>
</dl>

La última línea es importante: **declarar una deuda y no pagarla es una decisión defendible; no verla, no**. En la defensa, «lo sabíamos, lo medimos y decidimos no arreglarlo por esto» es una respuesta buena. «No nos habíamos dado cuenta» no lo es.

### Lo que no se hace en la semana 20

<div class="rule">
  <p class="rule-label">El punto de no retorno</p>
  <p>Esta es la última semana en la que entra algo nuevo. A partir de la 21 el proyecto se estabiliza: se prueba, se revisa, se corrige y se despliega, pero no se añade. Empezar una funcionalidad el día 20 y dejarla a medias es la forma más habitual de estropear un proyecto que iba bien, porque el código a medias sigue ahí y hay que explicarlo.</p>
</div>

Si alguien del equipo tiene una idea buena esta semana, va al anillo «versión 2» con su motivo. Ahí no molesta, y en la defensa demuestra que el equipo sabía dónde estaban sus límites.

### El registro de versiones

<p class="term">Registro de versiones</p>

Un documento del repositorio que dice, por versión, qué se añadió, qué se corrigió y qué se cambió de opinión. Se escribe mientras se hace, no al final.

<p class="stage">Paso 1 · Te enseño uno</p>

<dl class="worked">
  <dt>Añadido</dt>
  <dd>Ordenación del panel del responsable por antigüedad del préstamo.</dd>
  <dt>Corregido</dt>
  <dd>La herramienta devuelta seguía apareciendo un instante en la lista propia. El panel tardaba cuatro segundos con 300 préstamos y ahora responde por debajo del umbral de RNF-02.</dd>
  <dt>Cambiado</dt>
  <dd>La herramienta se elige de una lista visual con el nombre, no tecleando el código: el supuesto de la semana 4 de que el código se podría leer resultó falso en el taller. Registro de decisión con fecha.</dd>
  <dt>Deuda pagada</dt>
  <dd>La lógica de préstamos se ha separado en dos piezas, porque las tres correcciones anteriores caían ahí.</dd>
  <dt>Deuda declarada</dt>
  <dd>El listado del panel no está paginado. Con el volumen del taller no hace falta; con diez veces más datos haría falta. Queda dicho.</dd>
  <dt>Fuera de esta versión</dt>
  <dd>Devolver varias herramientas de una vez. Es una funcionalidad nueva y no había nada del mismo tamaño que sacar.</dd>
</dl>

Fijaos en las dos últimas entradas. **La lista de lo que no se hizo, con su motivo, vale tanto como la de lo que sí**, y es exactamente lo que un tribunal usa para distinguir un equipo que decidió de uno que no llegó.

### Producto de la unidad

<p class="stage stage--solo">Ahora tú</p>

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Segunda versión mejorada del producto.</p>
  <ul class="checklist">
    <li>Evidencias de uso recogidas por observación, más lo encontrado en los datos del propio producto.</li>
    <li>Todo lo recogido clasificado en los cuatro cubos, con motivo, y convertido en issues.</li>
    <li>Segunda versión desplegada, con los fallos de reglas y de tareas corregidos.</li>
    <li>Los cambios de requisito aplicados, cada uno con su registro de decisión y su fecha.</li>
    <li>Registro de deuda técnica: lo pagado, y lo declarado con su motivo.</li>
    <li>Registro de versiones con añadido, corregido, cambiado y lo que se quedó fuera.</li>
    <li>Especificación actualizada donde una evidencia contradijo una decisión anterior.</li>
    <li>Tablero al día, y el anillo «versión 2» con lo que no entró.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que haya evidencia, no opinión | Se observó a personas y se miraron los datos del sistema |
| Que la clasificación sea correcta | Un requisito no funcional incumplido está como fallo, no como mejora |
| Que el orden sea defendible | Se arreglaron primero las reglas y las tareas bloqueadas |
| Que la deuda sea visible | Está registrada, y lo no pagado está declarado |
| Que el alcance se haya respetado | Nada nuevo entró sin que saliera algo |
| Que quede escrito | El registro de versiones dice también lo que no se hizo y por qué |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué se refactoriza y qué no, en la semana 20?</li>
    <li>¿Por qué no se mezclan refactorización y cambio de comportamiento?</li>
    <li>¿Es aceptable no pagar una deuda técnica?</li>
    <li>¿Qué pasa con una idea buena que surge esta semana?</li>
    <li>¿Por qué el registro de versiones incluye lo que no se hizo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Se refactoriza lo que se va a tocar y cuesta tocar; no se toca lo que funciona y nadie va a modificar.</p>
  <p>2 · Porque si algo se rompe no se sabe cuál de los dos cambios fue, y la revisión se vuelve imposible.</p>
  <p>3 · Sí, si está registrada y declarada con su motivo. Lo que no es aceptable es no haberla visto.</p>
  <p>4 · Va al anillo «versión 2» con su motivo: no se empieza nada nuevo a partir de aquí.</p>
  <p>5 · Porque distingue a un equipo que decidió de uno que no llegó.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 21</p>
  <ul class="checklist">
    <li>La segunda versión está desplegada y funcionando.</li>
    <li>No queda ninguna funcionalidad empezada a medias.</li>
    <li>El registro de versiones y el de deuda están en el repositorio.</li>
    <li>Entendéis que a partir de ahora el proyecto solo se estabiliza: nada nuevo entra.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>De la evidencia a la segunda versión</figcaption>
  <ol class="flow">
    <li>Se observa a la gente usándolo, en vez de preguntarle si le gusta</li>
    <li>Se miran los datos que el producto lleva guardando</li>
    <li>Se buscan a propósito las limitaciones que nadie reporta</li>
    <li>Todo se reparte en fallo, cambio de requisito, funcionalidad nueva o deuda</li>
    <li>Se ataca por orden: reglas, tareas bloqueadas, uso, deuda que estorba, el resto</li>
    <li>Se refactoriza solo lo que se va a tocar, y nunca junto al cambio de fondo</li>
    <li>La deuda que no se paga se declara</li>
    <li>Se escribe qué cambió, por qué, y qué se quedó fuera</li>
  </ol>
</figure>

Y las tres frases de la unidad:

> **La gente dice lo que cree; hace lo que necesita. Fiaos de lo segundo.**
>
> **Un requisito no funcional incumplido es un fallo, no una mejora deseable.**
>
> **Declarar una deuda y no pagarla es defendible; no haberla visto, no.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Evidencia de uso | Lo que se observa cuando alguien usa el producto, no lo que dice de él |
| Fallo | El producto hace algo distinto de lo que dice su criterio de aceptación |
| Cambio de requisito | El producto hace lo decidido, y lo decidido estaba mal |
| Deuda técnica | Lo que aceleró ayer y frena mañana, asumido a propósito o no |
| Deuda declarada | La que se decide no pagar, dicha por escrito con su motivo |
| Refactorizar | Cambiar cómo está escrito sin cambiar lo que hace |
| Punto de no retorno | El momento a partir del cual el proyecto solo se estabiliza |
| Registro de versiones | Qué se añadió, corrigió, cambió y dejó fuera en cada versión |

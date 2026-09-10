---
title: "Defender el método"
label: "UD6 · Defender"
section: "ud-06"
order: 6
lang: "es"
summary: "Cerrar la evaluación defendiendo cómo se ha trabajado, con tres evidencias que no se pueden improvisar: el tablero, la pull request más discutida y una ejecución del pipeline que falló."
duration: "3 horas · 1 sesión"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Demostración del proceso de trabajo y del backend persistente del primer trimestre."
date: "2026-09-09"
outcomes:
  - "Reconstruir el rastro de trabajo propio y leerlo como lo leerá quien evalúa."
  - "Explicar una decisión de proceso sin refugiarse en la tecnología."
  - "Defender una revisión hecha y una recibida."
  - "Leer un fallo del pipeline y explicar qué lo provocó y cómo se resolvió."
  - "Reconocer las limitaciones del propio trabajo antes de que las señale otro."
requirements:
  - "El producto de Servidor publicado y su ficha de portfolio accesible."
  - "Los tres artefactos preparados: tablero, pull request y ejecución fallida."
priorKnowledge:
  - "Todo el trimestre."
---

<p class="lead">Hoy se presenta la misma versión que en Servidor 27–28. La demostración del producto se comparte; aquí se justifican su organización, revisión, pruebas en CI y puesta en producción.</p>

<div class="rule">
  <p class="rule-label">Por qué se defiende el proceso y no el producto</p>
  <p>Un producto se puede copiar, se puede encargar y se puede improvisar en un fin de semana. Un rastro de catorce semanas, no. Y cuando digo rastro no me refiero a las fechas de los commits, que se reescriben: me refiero a las issues, a las revisiones que dejasteis en el repositorio de otra persona y a las ejecuciones de Actions, que no las toca nadie. La defensa de hoy va sobre tres cosas que solo existen si de verdad trabajasteis así.</p>
</div>

## Sesión 14 · La defensa del proceso

**Antes de empezar.** El CRUD persistente del primer trimestre ya ha pasado sus comprobaciones de integración. Hoy explicarás cómo lo has organizado, revisado y publicado; en Servidor continuarás con su demostración técnica.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Si tuvierais que demostrar con una sola pantalla que habéis trabajado todas las semanas, ¿cuál enseñaríais?</li>
    <li>¿Cuál ha sido el cambio del trimestre que más discusión os costó, con vosotros mismos o con vuestra pareja?</li>
    <li>¿Cuándo fue la última vez que el pipeline os impidió fusionar algo? ¿Tenía razón?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Los tres artefactos, y qué demuestra cada uno

No son tres al azar. Cada uno responde a una pregunta que no se puede contestar de palabra.

<figure class="diagram">
  <figcaption>Qué se enseña y qué prueba</figcaption>
  <ol class="flow">
    <li><span class="flow-role">El tablero</span>Prueba el ritmo y la trazabilidad: si el trabajo estaba troceado, si las tarjetas se movieron cuando tocaba y si cada una acabó cerrada por su pull request.</li>
    <li><span class="flow-role">La pull request más discutida</span>Prueba que hubo revisión de verdad: alguien miró, dijo algo concreto y eso cambió el código.</li>
    <li><span class="flow-role">Un Action que falló</span>Prueba que el pipeline muerde y que sabéis leerlo: qué falló, por qué, y qué hicisteis.</li>
  </ol>
</figure>

Fijaos en el tercero, que es el que sorprende: **os pido enseñar un fallo**. No es una trampa. Probar en local antes de subir es una buena práctica. No se exige una frecuencia de fallos: sirve el fallo controlado en una rama de diagnóstico de las sesiones anteriores, acompañado de su corrección y la prueba de que bloqueaba la fusión.

#### Qué se pregunta, y qué no

<div class="compare-pair">
  <div>
    <p class="compare-label">No se pregunta</p>
    <p class="compare-body">Si el diseño gusta, cómo está escrito el CSS, si la API está bien construida por dentro ni cuántas funcionalidades tiene. Todo eso se evalúa en los módulos que lo enseñan.</p>
  </div>
  <div>
    <p class="compare-label">Sí se pregunta</p>
    <p class="compare-body">Por qué esa issue estaba dividida así, quién revisó ese cambio y qué miró, qué impide que algo roto llegue a producción, qué pasa si la API cambia y qué no funciona todavía.</p>
  </div>
</div>

Las preguntas salen del trimestre, y las tenéis todas desde hoy:

| De la sesión | Pregunta |
| ------------ | -------- |
| 1 | ¿Qué pasa exactamente entre que hacéis push y la URL cambia? |
| 2 | ¿Por qué está protegida la rama principal si el repositorio es vuestro? |
| 2 | Enseñadme una issue vuestra. ¿Cómo sabíais que estaba terminada? |
| 3 | ¿Por qué el check de despliegue no bastaba? |
| 4 | Un enlace externo falla en el CI pero abre bien. ¿Qué hicisteis? |
| 5 | ¿Qué mide vuestro presupuesto de calidad y por qué ese número? |
| 6 | ¿Qué dice vuestro README que no diría el de un ejercicio de clase? |
| 7 | ¿En qué se diferencia el CI de la API del del portfolio? |
| 8 | Vuestra URL da error y el despliegue está en verde. ¿Por dónde empezáis? |
| 9 | ¿Protege CORS vuestra API? |
| 10 | Enseñadme un error de validación en pantalla. ¿De dónde sale ese texto? |
| 11 | ¿Dónde vive vuestra base de datos y qué hacéis si alguien ve su contraseña? |
| 12 | Si mañana cambiáis un campo de la API, ¿qué se rompe y quién avisa? |
| 13 | ¿Qué mejora habéis priorizado para el mismo producto y de qué depende? |

#### Cómo se puntúa

| Se mira | Qué lo demuestra |
| ------- | ---------------- |
| Ritmo | Actividad repartida en semanas, no concentrada |
| Trazabilidad | Issues cerradas por su pull request, ramas con su número |
| Puertas | Ninguna fusión con checks en rojo, ningún commit directo a la rama principal |
| Revisión | Revisiones vuestras en el repositorio de vuestra pareja, con contenido |
| Cierre | Releases publicadas y README que se entiende |
| Defensa | Que sepáis explicar lo anterior sin leerlo |

<div class="rule">
  <p class="rule-label">La trampa de hoy</p>
  <p>Que os preparéis la demostración del producto y no la del proceso. Vais a enseñar vuestro portfolio y vuestro CRUD funcionando, y estará muy bien, pero esa parte la vemos también en Servidor y allí es donde puntúa. Aquí puntúa lo que hay detrás. Así que abrid vuestro propio repositorio antes de entrar y miradlo como lo miraría alguien de fuera; la mayoría de los sustos de esta sesión se los lleva quien no lo ha hecho.</p>
</div>

---

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Reconstruir vuestro propio rastro

<p class="stage stage--solo">Individual, con vuestros dos repositorios abiertos</p>

Antes de defender nada, mirad lo que hay como si fuera de otra persona. Es la misma auditoría que le hicisteis a vuestra pareja en la sesión 6, ahora sobre vosotros.

| Dónde mirar | Qué anotar |
| ----------- | ---------- |
| Insights → Commits, o el listado de pull requests | En cuántas semanas distintas hay actividad |
| Pull requests cerradas | Cuántas dicen qué issue cierran, y cuántas no |
| Historial de <code>main</code> | Si hay algún commit que no venga de una fusión |
| Pestaña Actions | Cuántas ejecuciones fallaron, y cuál fue la última |
| Releases | Qué versiones hay y si sus notas se entienden |

<dl class="answer">
  <dt>Semanas con actividad, de catorce</dt>
  <dd></dd>
  <dt>Pull requests sin issue asociada</dt>
  <dd></dd>
  <dt>Lo más débil de vuestro rastro, dicho por vosotros antes que por mí</dt>
  <dd></dd>
</dl>

<div class="rule">
  <p class="rule-label">Decirlo antes vale más que esconderlo</p>
  <p>Si hay una semana en blanco, la hay, y yo la voy a ver. Decir «esa semana no trabajé y se nota, lo recuperé en la siguiente» cuesta muchísimo menos que un silencio o una excusa. Saber mirar vuestro propio trabajo y decir qué falla también se puntúa aquí.</p>
</div>

#### Bloque B · Elegir los tres artefactos

<p class="stage stage--solo">Individual, y escribiendo una frase para cada uno</p>

**1 · El tablero.** Dejadlo abierto en la pestaña que mejor cuente vuestra historia. Frase que hay que poder decir: *«así troceé el trabajo, y esta tarjeta se movió aquí porque…»*.

**2 · La pull request más discutida.** No la más grande: la que tuvo la conversación más útil. Puede ser una vuestra que os hicieron cambiar, o una de vuestra pareja donde vosotros visteis algo. Frase: *«aquí me dijeron esto, tenían razón en esto otro, y cambié esto»*.

**3 · La ejecución que falló.** Buscadla en Actions, abridla por el paso rojo y leedla otra vez. Frase: *«falló por esto, se veía en esta línea, y lo arreglé así»*.

<details class="aside aside--help">
  <summary>Si de verdad no tenéis ningún fallo del CI</summary>
  <p>Entonces vuestra defensa incluye explicar por qué, y hay respuestas buenas y malas. Buena: «lo comprobaba en local antes de subir, y aquí está el comando que ejecutaba». Mala: silencio. Y hay una tercera que es la peor de todas y que se ve enseguida: que las comprobaciones no fueran obligatorias y por eso nunca bloquearon nada.</p>
</details>

<dl class="answer">
  <dt>Tablero · la frase</dt>
  <dd></dd>
  <dt>Pull request · la frase</dt>
  <dd></dd>
  <dt>Fallo del pipeline · la frase</dt>
  <dd></dd>
</dl>

#### Bloque C · Ensayo cruzado

<p class="stage stage--guided">Por parejas, con las preguntas de la tabla delante</p>

Vuestra pareja hace de tribunal durante ocho minutos: elige cuatro preguntas de la tabla de arriba, al azar, y las hace. Después al revés.

Reglas del ensayo, que son las de la defensa:

<ul class="checklist">
  <li>Se responde señalando la pantalla, no de memoria. «Está en el tablero» no vale: se abre.</li>
  <li>«No lo sé» es una respuesta aceptable dicha una vez. Dicha cuatro veces, es la defensa entera.</li>
  <li>No se responde con tecnología a una pregunta de proceso. Si os preguntan por qué esa issue estaba así, contestar «porque usé Spring» no responde nada.</li>
</ul>

Quien hace de tribunal anota **la pregunta que peor fue** y se la dice al otro. Esa es la que hay que preparar en los minutos que quedan.

#### Bloque D · La defensa

La defensa se coordina con Servidor 27–28 sobre el mismo commit. Explica aquí el proceso sobre la versión que ya has comprobado; las sesiones 27–28 de Servidor completarán la explicación técnica de ese mismo producto.

1. Abre el balance del primer trimestre con URL, SHA, PR, CI y pruebas. Comprueba que la release final incluye persistencia, relaciones y reglas de Servidor 25–26; una release intermedia no sustituye esta comprobación.
2. Demuestra un recorrido del CRUD, una entrada rechazada y persistencia tras reinicio. Servidor evalúa implementación, integridad y pruebas de esos casos.
3. Sigue una issue del mismo recorrido hasta su rama, revisión, ejecución y despliegue. Intermodular evalúa la trazabilidad, la revisión y la entrega reproducible.
4. Explica un fallo controlado del CI y su diagnóstico. No se puntúa haber roto producción ni acumular errores.
5. Cada integrante identifica su contribución según la autoría/equipo acordado en Servidor. Quienes no estén defendiendo realizan una comprobación cruzada y registran observaciones.
6. Contrasta el resultado con las limitaciones identificadas. Las comprobaciones y la versión son comunes; los criterios y las calificaciones de cada módulo se mantienen diferenciados.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint">
  <p class="checkpoint-label">Producto de la evaluación</p>
  <ul class="checklist">
    <li>Portfolio publicado, con contenido real y su pipeline de cuatro comprobaciones.</li>
    <li>API persistente desplegada, con CI y operaciones CRUD comprobadas mediante la colección de peticiones.</li>
    <li>Releases publicadas en los dos repositorios, con READMEs que se entienden.</li>
    <li>Un rastro de catorce semanas: issues, ramas, pull requests, revisiones y fallos resueltos.</li>
    <li>La evolución del mismo producto, priorizada y con sus dependencias.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Retrospectiva · tres minutos por escrito</p>
  <ol>
    <li>¿Qué parte del método os pareció burocracia en septiembre y os ha servido después?</li>
    <li>¿Qué habríais hecho distinto si volvierais a empezar la primera semana?</li>
    <li>¿Qué es lo que peor lleváis del circuito y por qué?</li>
    <li>¿Qué le diríais a alguien que va a empezar este módulo el año que viene?</li>
  </ol>
</div>

<div class="rule">
  <p class="rule-label">Qué pasa en enero</p>
  <p>Seguís con el mismo producto y con la mejora que priorizasteis en la sesión 13. La persistencia ya estará publicada, así que en enero se trabaja el cliente, los permisos y las integraciones, siempre después de haberlos dado en Servidor. Y no montaréis nada nuevo: el circuito de este trimestre es el que vais a seguir usando.</p>
</div>

## Lo que debes recordar

### El método

| Idea | Por qué |
| ---- | ------- |
| **El proceso se defiende con evidencias, no con adjetivos** | «He trabajado mucho» no se puede comprobar; un tablero con fechas, sí |
| **Un fallo controlado comprueba el bloqueo** | Probar en local es correcto; se demuestra la eficacia del check sin exigir fallos frecuentes |
| **Las limitaciones se dicen antes** | Un límite reconocido es criterio; el mismo límite descubierto por otro es un fallo |
| **Se responde señalando la pantalla** | Todo lo que se afirma hoy está escrito en algún sitio del repositorio |
| **No se contesta con tecnología a una pregunta de proceso** | Son dos evaluaciones distintas, y confundirlas se nota enseguida |

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Rastro | El conjunto de evidencias fechadas que deja el trabajo: issues, commits, pull requests, revisiones y ejecuciones |
| Trazabilidad | Poder ir de un cambio a la tarea que lo pedía, y al revés |
| Ritmo | Cómo se reparte el trabajo en el tiempo. Se ve de un vistazo y no se puede fingir después |
| Retrospectiva | Mirar hacia atrás para decidir qué cambiar en el siguiente ciclo, no para justificar el anterior |

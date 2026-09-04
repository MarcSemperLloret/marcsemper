---
title: "Convertirlo en portfolio"
label: "UD13 · Presentar"
section: "ud-13"
order: 13
lang: "es"
summary: "Transformar la aplicación terminada en un caso profesional que explique problema, solución, arquitectura, decisiones y evidencias."
duration: "3 horas · 1 semana · 1 sesión"
modality: "Taller profesional · comunicación del proyecto"
deliverable: "Proyecto preparado para enseñar en portfolio, GitHub, LinkedIn y CV."
date: "2026-08-31"
outcomes:
  - "Preparar un repositorio y README profesionales."
  - "Seleccionar capturas, demo y diagramas que aporten evidencia."
  - "Explicar decisiones técnicas sin convertir el portfolio en documentación interna."
  - "Integrar el proyecto en los perfiles profesionales."
requirements:
  - "Aplicación pública y repositorio consolidado."
priorKnowledge:
  - "Documentación técnica y comunicación escrita."
---

<p class="lead">La aplicación existe, pero todavía hay que hacerla comprensible para una persona que dedica pocos minutos a decidir si quiere saber más.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje bajo. Se facilitan plantillas y ejemplos; la narrativa debe ser propia y honesta.</p>
</div>

## Sesión 25 · El caso de portfolio

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Quién lee esto y cuánto tiempo dedica, qué es un caso de portfolio frente a documentación interna, y qué no debe aparecer.</li>
    <li><strong>2. Haz:</strong> Limpia el repositorio, escribe el README definitivo, prepara capturas y demostración, y redacta las decisiones técnicas.</li>
    <li><strong>3. Comprueba:</strong> Entrega el caso de portfolio y revisa la evaluación.</li>
  </ol>
</div>

### Vuelve la persona de la semana 1

En la primera sesión del curso se describió qué hace alguien con experiencia cuando recibe el repositorio de una persona candidata: noventa segundos, seis señales, y una decisión sobre si merece la pena seguir mirando.

Hoy sois vosotros los que estáis al otro lado. Y ahora tenéis algo que aquella persona ficticia no tenía: un producto funcionando, un repositorio con siete meses de historia y decisiones escritas semana a semana.

<div class="rule">
  <p class="rule-label">Los tres lectores, y no quieren lo mismo</p>
  <p>Quien criba currículos dedica noventa segundos y quiere saber qué es y si funciona. Quien va a entrevistaros dedica diez minutos y quiere saber qué decidisteis y por qué. El tribunal de junio dedica una hora y quiere saber si lo entendéis. El caso de portfolio sirve a los dos primeros; el tercero es la semana 26.</p>
</div>

### Caso de portfolio no es documentación interna

Es la confusión que estropea la mayoría de los README de proyectos de ciclo.

<div class="compare-pair">
  <div>
    <p class="compare-label">Documentación interna</p>
    <p class="compare-body">Todo lo que hace falta para trabajar en el proyecto: requisitos, modelo entero, contrato completo, registro de decisiones. Es valiosa, y ya la tenéis desde la semana 6.</p>
  </div>
  <div>
    <p class="compare-label">Caso de portfolio</p>
    <p class="compare-body">Lo que alguien de fuera necesita para entender qué problema resolvisteis, cómo, y por qué está bien hecho. Es corto, y enlaza a lo demás.</p>
  </div>
</div>

Esto no significa tirar la documentación: significa **ponerla detrás de un enlace**. Un README de cuatro mil palabras con todos los requisitos dentro no lo lee nadie, y hace parecer que no sabéis distinguir lo importante.

### El README, apartado por apartado

<p class="stage">Paso 1 · Te enseño uno</p>

La estructura de PrestaTaller. Cada apartado con lo que debe contener y el error que suele cometerse:

<dl class="worked">
  <dt>1 · Una frase y un enlace</dt>
  <dd>Qué es, para quién, y la URL pública. Arriba del todo, antes de nada más. Error habitual: empezar con una lista de tecnologías, que no dice qué hace el proyecto.</dd>
  <dt>2 · El problema, en tres líneas</dt>
  <dd>Sale del enunciado de la semana 4, resumido: qué pasaba antes, a quién le pasaba y qué costaba. Es lo que separa un proyecto de portfolio de un ejercicio.</dd>
  <dt>3 · Qué hace</dt>
  <dd>Cuatro o cinco frases sobre lo que el producto permite hacer, en términos de la persona que lo usa, no de pantallas ni de endpoints.</dd>
  <dt>4 · Capturas o demostración</dt>
  <dd>Justo aquí, no al final. Quien está leyendo quiere ver algo antes de decidir si sigue.</dd>
  <dt>5 · Cómo está hecho</dt>
  <dd>El diagrama de la semana 13 y un párrafo. Nada más: si alguien quiere el detalle, hay un enlace.</dd>
  <dt>6 · Tres decisiones técnicas</dt>
  <dd>Las que mejor os representan, con su alternativa descartada. Este es el apartado que hace que alguien quiera entrevistaros.</dd>
  <dt>7 · Cómo ejecutarlo</dt>
  <dd>Los pasos que ya cumplían RNF-08 desde la semana 5, comprobados por alguien que no lo haya levantado nunca.</dd>
  <dt>8 · Límites conocidos</dt>
  <dd>Lo que no hace y por qué, y la deuda declarada de la semana 20. Cuesta escribirlo y es lo que más credibilidad da.</dd>
  <dt>9 · Enlaces a la documentación</dt>
  <dd>Especificación, modelo, contrato, registro de decisiones. Detrás de enlaces, no dentro.</dd>
</dl>

### Capturas que informan

Una captura ocupa el mismo sitio tanto si aporta algo como si no. Tres reglas:

<div class="compare-pair">
  <div>
    <p class="compare-label">Capturas que no aportan</p>
    <p class="compare-body">La pantalla de inicio de sesión. Un formulario vacío. Una tabla con «Producto 1, Producto 2». El panel de administración de un framework.</p>
  </div>
  <div>
    <p class="compare-label">Capturas que aportan</p>
    <p class="compare-body">La pantalla donde ocurre lo que resuelve el problema, con datos realistas dentro y en el dispositivo del contexto.</p>
  </div>
</div>

Y una tercera regla, que ya conocéis desde la semana 8: **datos inventados pero verosímiles**. «T-014 · Calibre pie de rey» comunica; «Producto 1» dice que nunca se ha usado de verdad.

<div class="rule">
  <p class="rule-label">Antes de publicar una captura</p>
  <p>Miradla entera, no solo la parte que queréis enseñar. En las capturas se cuelan nombres reales de compañeros, direcciones de correo, pestañas del navegador con otras cosas abiertas y, alguna vez, credenciales. Una captura publicada es tan pública como el código.</p>
</div>

### La demostración

Un vídeo corto —o una imagen animada— del recorrido principal vale más que diez capturas, porque demuestra que funciona de verdad. Cuatro condiciones: que dure menos de un minuto, que enseñe una tarea completa de principio a fin, que no tenga tiempos muertos y que se vea qué se está pulsando.

Y se graba ahora, no en junio: **es también el plan B del día de la defensa** que preparasteis la semana pasada.

### Explicar decisiones sin escribir un tratado

Tres decisiones, cuatro líneas cada una. No más, porque lo que se busca no es exhaustividad: es enseñar que hubo criterio.

<div class="prompt">
  <p class="prompt-label">Formato de una decisión</p>
  <ol>
    <li>El contexto: qué situación obligaba a decidir</li>
    <li>La alternativa que se descartó</li>
    <li>Lo que se eligió, y por qué en este caso</li>
    <li>La consecuencia asumida: qué se pierde con esa elección</li>
  </ol>
</div>

<dl class="worked">
  <dt>Ejemplo · el estado de la herramienta</dt>
  <dd>«Una herramienta podría llevar un campo que indicara si está prestada, lo que simplificaría las consultas. Descartamos guardarlo: es un dato deducible del préstamo abierto, y duplicarlo permite que la base de datos quede en un estado imposible si una de las dos escrituras falla. La consecuencia es que la consulta del catálogo es algo más costosa, y por eso se comprueba contra un umbral de tiempo.»</dd>
  <dt>Por qué funciona</dt>
  <dd>Porque nombra la alternativa razonable, no un hombre de paja; porque el motivo es concreto; y porque reconoce el coste. Quien lee eso sabe que puede preguntaros por ello en una entrevista y que sabréis responder.</dd>
  <dt>El cuarto punto es el que casi nadie escribe</dt>
  <dd>Y es el que más confianza da. Una decisión presentada como si no tuviera desventajas parece propaganda, y quien entrevista lo detecta enseguida.</dd>
</dl>

### Qué no poner

<ol class="fill-in">
  <li>Credenciales, aunque sean de un entorno de prueba, y aunque las vayáis a borrar después.</li>
  <li>Datos personales reales: en el código, en los datos de ejemplo y en las capturas.</li>
  <li>El histórico interno del equipo: quién no trabajó, qué discusiones hubo, qué salió mal entre vosotros.</li>
  <li>Excusas. «No dio tiempo» no se escribe; lo que se escribe es la decisión de dejarlo fuera, con su motivo.</li>
  <li>Superlativos. «Aplicación robusta y escalable» no significa nada y obliga a defender algo que no habéis medido.</li>
  <li>Tecnologías que apenas se usaron, puestas para engordar la lista. Preguntarán justamente por esas.</li>
</ol>

### Limpiar el repositorio

Media hora, y se nota en los noventa segundos de alguien:

<ol class="fill-in">
  <li>Ramas fusionadas o muertas, borradas.</li>
  <li>Ficheros que no deberían estar: dependencias, construcciones, ficheros del sistema, notas personales.</li>
  <li>Código comentado que lleva meses ahí. Está en el histórico; no hace falta guardarlo a la vista.</li>
  <li>Nombres de ficheros y carpetas coherentes, sin restos de pruebas.</li>
  <li>Una descripción del repositorio y su enlace a la URL pública, en la propia página del proyecto.</li>
  <li>Las issues cerradas cerradas, y las abiertas etiquetadas como futuro, no abandonadas.</li>
</ol>

La última demuestra algo que casi nadie enseña: que el equipo sabe qué queda por hacer.

### En los perfiles

El mismo proyecto se cuenta con distinta longitud según dónde:

| Dónde | Qué se pone |
| ----- | ----------- |
| **Repositorio** | El README completo, con la URL pública en la descripción |
| **Portfolio o web personal** | El caso: problema, qué hiciste, qué decidiste, resultado y enlaces |
| **Perfil profesional** | Un párrafo con el problema y el resultado, y el enlace |
| **Currículo** | Dos líneas: qué construisteis, con qué, y la URL |

<div class="rule">
  <p class="rule-label">Decid qué hicisteis vosotros</p>
  <p>Es un proyecto de equipo, y presentarlo como propio en singular es una mentira que se descubre en la primera entrevista. Decid que fue en equipo y qué parte llevasteis. Eso no resta: haber trabajado con otras personas y saber decir qué hizo cada una es exactamente lo que se busca en un perfil junior.</p>
</div>

### Producto de la unidad

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Proyecto preparado para enseñar en portfolio, GitHub, LinkedIn y CV.</p>
  <ul class="checklist">
    <li>README con los nueve apartados, con la URL pública arriba del todo.</li>
    <li>Capturas del recorrido que resuelve el problema, con datos verosímiles y revisadas antes de publicar.</li>
    <li>Demostración de menos de un minuto de una tarea completa.</li>
    <li>Tres decisiones técnicas con contexto, alternativa, elección y consecuencia.</li>
    <li>Apartado de límites conocidos, con la deuda declarada de la semana 20.</li>
    <li>Instrucciones de ejecución comprobadas por alguien que no lo haya levantado nunca.</li>
    <li>Repositorio limpio: ramas, ficheros, código muerto e issues.</li>
    <li>Documentación interna enlazada, no incrustada.</li>
    <li>Las versiones corta y larga del texto, para perfil profesional y para currículo.</li>
    <li>Declaración del trabajo en equipo y de qué parte llevó cada persona.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que se entienda en un minuto | Qué es, para quién y si funciona, sin bajar del primer pantallazo |
| Que muestre criterio | Las tres decisiones nombran la alternativa y la consecuencia |
| Que sea honesto | Hay límites conocidos, y no hay superlativos ni excusas |
| Que sea seguro | Ni credenciales, ni datos personales, ni en el código ni en las capturas |
| Que sea reproducible | Alguien de fuera lo ha levantado siguiendo el README |
| Que sea justo | Se dice que es de equipo y qué hizo cada persona |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre documentación interna y caso de portfolio?</li>
    <li>¿Qué se pone antes que nada en el README?</li>
    <li>¿Cuál es el cuarto punto del formato de una decisión, y por qué importa?</li>
    <li>¿Por qué no se ponen tecnologías que apenas se usaron?</li>
    <li>¿Cómo se presenta un proyecto de equipo en un perfil personal?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · La interna es todo lo necesario para trabajar en él; el caso es lo que alguien de fuera necesita para entenderlo, y enlaza a lo demás.</p>
  <p>2 · Una frase que dice qué es y para quién, y el enlace a la URL pública.</p>
  <p>3 · La consecuencia asumida. Sin ella, la decisión parece propaganda.</p>
  <p>4 · Porque en una entrevista preguntarán justamente por esas.</p>
  <p>5 · Diciendo que fue en equipo y qué parte llevó cada persona.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 26</p>
  <ul class="checklist">
    <li>Alguien ajeno al proyecto ha leído el README y sabe explicar qué hace y para quién.</li>
    <li>La demostración está grabada y sirve también como plan B.</li>
    <li>Las tres decisiones están escritas y todo el equipo sabe defenderlas.</li>
    <li>Traéis el proyecto listo para enseñarlo: la semana 26 es la defensa.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>De la aplicación al caso</figcaption>
  <ol class="flow">
    <li>Se escribe para quien dedica noventa segundos, no para quien va a mantenerlo</li>
    <li>Primero qué es, para quién y el enlace; después todo lo demás</li>
    <li>El problema antes que la tecnología, siempre</li>
    <li>Se enseña algo funcionando antes de pedir que sigan leyendo</li>
    <li>Tres decisiones con su alternativa y su consecuencia</li>
    <li>Los límites conocidos, escritos, porque dan credibilidad</li>
    <li>La documentación detrás de enlaces, no dentro</li>
    <li>Nada personal ni secreto, ni en el código ni en las capturas</li>
  </ol>
</figure>

Y las tres frases de la unidad:

> **Un README que empieza por la lista de tecnologías no dice qué hace el proyecto.**
>
> **Una decisión sin consecuencia asumida parece propaganda.**
>
> **Los límites conocidos son lo que más credibilidad da.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Caso de portfolio | Lo que alguien de fuera necesita para entender el proyecto, corto y enlazado |
| Documentación interna | Todo lo necesario para trabajar en él; va detrás de un enlace |
| Captura que informa | La del recorrido que resuelve el problema, con datos verosímiles |
| Consecuencia asumida | Lo que se pierde con una decisión, dicho por quien la tomó |
| Límite conocido | Lo que el producto no hace, con su motivo, escrito por vosotros |
| Deuda declarada | La que se decidió no pagar, dicha en lugar de escondida |
| Repositorio limpio | Sin ramas muertas, ficheros sobrantes ni código comentado a la vista |

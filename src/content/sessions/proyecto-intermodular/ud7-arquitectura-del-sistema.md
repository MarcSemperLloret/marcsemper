---
title: "Arquitectura del sistema"
label: "UD7 · Arquitectar"
section: "ud-07"
order: 7
lang: "es"
summary: "Relacionar frontend, backend, base de datos y servicios externos, elegir tecnologías y justificar sus límites."
duration: "3 horas · 1 semana · 1 sesión"
modality: "Taller de arquitectura · decisiones justificadas"
deliverable: "Diagrama de arquitectura y registro inicial de riesgos técnicos."
date: "2026-08-31"
outcomes:
  - "Identificar los componentes y responsabilidades del sistema."
  - "Representar una arquitectura cliente-servidor comprensible."
  - "Elegir tecnologías según necesidades y riesgos."
requirements:
  - "Prototipo, modelo de datos y API v0.1."
priorKnowledge:
  - "Visión general de Angular, Spring Boot y PostgreSQL."
---

<p class="lead">La arquitectura de referencia será Angular → Spring Boot → PostgreSQL, adaptada a las particularidades reales de cada proyecto.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio. La referencia es común, pero cada dependencia y servicio adicional debe justificarse.</p>
</div>

<div class="rule">
  <p class="rule-label">La semana 13, y por qué es una sola</p>
  <p>Es la última semana antes de empezar a construir, y es corta a propósito: con el prototipo, el modelo y el contrato ya escritos, la arquitectura de un proyecto de este tamaño se decide en una sesión. Si os lleva más, la señal no es que la arquitectura sea compleja: es que alguna de las tres piezas anteriores no está cerrada.</p>
</div>

## Sesión 13 · Componentes, tecnologías y riesgos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué piezas tiene el sistema, qué responsabilidad tiene cada una y qué no debe hacer nunca, cómo se elige una tecnología y cómo se registra un riesgo técnico.</li>
    <li><strong>2. Haz:</strong> Dibuja la arquitectura de vuestro proyecto, justifica cada elección y cada dependencia externa, y monta el registro de riesgos.</li>
    <li><strong>3. Comprueba:</strong> Entrega el diagrama y el registro, y revisa la evaluación.</li>
  </ol>
</div>

### Qué es la arquitectura aquí

No es un diagrama bonito para la memoria. Es responder a cuatro preguntas cuya respuesta condiciona las trece semanas siguientes:

<figure class="diagram">
  <figcaption>Las cuatro preguntas</figcaption>
  <ol class="flow">
    <li>¿Qué piezas hay, y cuál es la responsabilidad de cada una?</li>
    <li>¿Quién habla con quién, y en qué dirección?</li>
    <li>¿De qué depende el sistema que no controlamos nosotros?</li>
    <li>¿Qué pasa cuando una pieza falla?</li>
  </ol>
</figure>

La cuarta es la que casi nadie se hace, y es la que separa un diagrama de una arquitectura.

### Los componentes

<p class="stage">Paso 1 · Te enseño uno</p>

Los de PrestaTaller, con lo que hace cada uno y —más importante— lo que **no** hace:

<dl class="worked">
  <dt>Los dispositivos</dt>
  <dd>La tablet fija del armario y el navegador del responsable. No son una pieza que construyamos, pero sí una restricción: la tablet es antigua, comparte la red del centro y se usa con guantes. Todo eso ya está en RNF-06.</dd>
  <dt>El frontend</dt>
  <dd>Pinta las pantallas del prototipo y llama a la API. <strong>No</strong> decide si un préstamo es válido, <strong>no</strong> guarda nada permanente y <strong>no</strong> sabe la contraseña de la base de datos.</dd>
  <dt>El backend</dt>
  <dd>Expone las ocho operaciones del contrato, aplica las seis reglas de la semana 10 y decide quién puede hacer qué. Es el único que habla con la base de datos.</dd>
  <dt>La base de datos</dt>
  <dd>Guarda las tres entidades y hace cumplir las restricciones de integridad. <strong>No</strong> es accesible desde internet ni desde el navegador.</dd>
  <dt>Lo que NO hay</dt>
  <dd>No hay servicio de correo, ni pasarela de pago, ni almacenamiento de ficheros, ni servicio de mensajería. Cada una de esas ausencias sale de una exclusión escrita en la semana 6, y decirlo en el diagrama vale tanto como dibujar lo que sí hay.</dd>
</dl>

<div class="rule">
  <p class="rule-label">La regla que hay que grabarse</p>
  <p>Toda regla de negocio y toda comprobación de permisos vive en el servidor. En el navegador se comprueba también, pero solo para avisar antes y ahorrar un viaje: nunca como garantía. Cualquiera puede abrir las herramientas del navegador y lanzar la petición a mano, y en la semana 21 alguien de otro equipo va a intentarlo con vuestro proyecto.</p>
</div>

### El diagrama

<figure class="diagram">
  <figcaption>Arquitectura de PrestaTaller</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 250" role="img" aria-labelledby="arq-title arq-desc" preserveAspectRatio="xMidYMid meet">
    <title id="arq-title">Arquitectura cliente-servidor de PrestaTaller</title>
    <desc id="arq-desc">La tablet del taller y el navegador del responsable acceden por HTTPS al frontend. El frontend llama a la API mediante JSON. La API es la única que consulta la base de datos. La API y la base de datos están dentro del servidor; los dispositivos y el frontend, fuera.</desc>
    <g class="diagram-node diagram-node--container">
      <rect x="416" y="52" width="288" height="140" rx="3" />
      <text x="560" y="176">SERVIDOR</text>
    </g>
    <g class="diagram-edges">
      <path d="M 172 72 L 200 72 L 200 104 L 232 104" marker-end="url(#arq-arrow)" />
      <path d="M 172 178 L 200 178 L 200 130 L 232 130" marker-end="url(#arq-arrow)" />
      <path d="M 390 117 L 428 117" marker-end="url(#arq-arrow)" />
      <path d="M 568 117 L 594 117" marker-end="url(#arq-arrow)" />
    </g>
    <defs>
      <marker id="arq-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <text class="diagram-label" x="409" y="104">JSON</text>
    <text class="diagram-label" x="581" y="104">SQL</text>
    <text class="diagram-label diagram-label--accent" x="200" y="222">HTTPS · red del centro</text>
    <g class="diagram-node">
      <rect x="22" y="44" width="150" height="58" rx="3" />
      <text x="97" y="66">Tablet</text>
      <text class="diagram-subtext" x="97" y="86">armario del taller</text>
    </g>
    <g class="diagram-node">
      <rect x="22" y="150" width="150" height="58" rx="3" />
      <text x="97" y="172">Navegador</text>
      <text class="diagram-subtext" x="97" y="192">responsable</text>
    </g>
    <g class="diagram-node">
      <rect x="232" y="88" width="158" height="58" rx="3" />
      <text x="311" y="110">Frontend</text>
      <text class="diagram-subtext" x="311" y="130">Angular</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="428" y="88" width="140" height="58" rx="3" />
      <text x="498" y="110">API</text>
      <text class="diagram-subtext" x="498" y="130">Spring Boot</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="594" y="88" width="98" height="58" rx="3" />
      <text x="643" y="110">Datos</text>
      <text class="diagram-subtext" x="643" y="130">PostgreSQL</text>
    </g>
  </svg>
</figure>

Cinco cajas y cuatro flechas. Un diagrama de arquitectura de un proyecto de este tamaño **debe caber de un vistazo**: si necesita leyenda, no está resumiendo nada.

<dl class="worked">
  <dt>Qué dice la caja de puntos</dt>
  <dd>Que la base de datos no es alcanzable desde fuera. Esa línea discontinua es la diferencia entre un proyecto que se puede defender y uno que en la semana 23 acaba con la base de datos abierta a internet.</dd>
  <dt>Qué dice que solo haya una flecha hacia los datos</dt>
  <dd>Que el frontend nunca los toca. Si algún día apareciera una segunda flecha desde el frontend a la base de datos, el diagrama estaría avisando de un problema grave.</dd>
  <dt>Qué NO dice el diagrama</dt>
  <dd>Dónde está desplegada cada cosa. Eso es la semana 23, y mezclarlo aquí produce diagramas ilegibles. Un diagrama, una pregunta.</dd>
</dl>

### Elegir tecnología

La arquitectura de referencia del ciclo es Angular, Spring Boot y PostgreSQL, y salvo motivo justificado es lo que hay que usar: es lo que se está estudiando, es lo que os pueden ayudar a resolver y es lo que sabréis defender.

La pregunta interesante no es esa, sino qué pasa cuando alguien quiere añadir algo. Cuatro preguntas, y hay que poder responder que sí a las cuatro:

<figure class="diagram">
  <figcaption>Antes de añadir cualquier tecnología o librería</figcaption>
  <ol class="flow">
    <li>¿Alguien del equipo sabe usarla hoy, no «la mirará»?</li>
    <li>¿Resuelve un problema que tenemos, y no uno que imaginamos?</li>
    <li>¿Se puede desplegar con lo que tenemos, sin pagar?</li>
    <li>¿Sabremos explicar en junio por qué está ahí?</li>
  </ol>
</figure>

<div class="compare-pair">
  <div>
    <p class="compare-label">Justificación que no vale</p>
    <p class="compare-body">«Lo usan en las empresas», «es lo moderno», «lo vi en un tutorial», «queríamos aprenderlo».</p>
  </div>
  <div>
    <p class="compare-label">Justificación que vale</p>
    <p class="compare-body">«El buscador de P3 tiene que filtrar mientras se teclea sobre 400 herramientas; lo resolvemos en el cliente porque el catálogo cabe entero en memoria y así funciona aunque la red del taller vaya lenta.»</p>
  </div>
</div>

La segunda no habla de la tecnología: habla del problema, del contexto y del límite. Ese es el aspecto que tiene una decisión defendible.

### Cada dependencia externa es un riesgo

<p class="term">Dependencia externa</p>

Cualquier cosa de la que el sistema depende y que no controláis vosotros: un servicio de terceros, una cuenta gratuita con límites, una API pública, la red del centro, un dispositivo prestado.

Para cada una hay que decidir tres cosas antes de comprometerse:

| Pregunta | Por qué |
| -------- | ------- |
| ¿Qué pasa si no responde? | Si el producto entero se cae, la dependencia es crítica y quizá no deba existir |
| ¿Qué pasa si desaparece o empieza a cobrar? | Un servicio gratuito puede dejar de serlo en mitad del curso |
| ¿Podemos enseñar la demo sin ella? | Si la respuesta es no, la defensa de junio depende de algo ajeno |

<dl class="worked">
  <dt>La dependencia externa de PrestaTaller</dt>
  <dd>La red del centro, y la tablet, que es prestada. No hay servicios de terceros porque la lista de exclusiones los descartó uno a uno en la semana 6.</dd>
  <dt>Qué pasa si la red del centro falla el día de la defensa</dt>
  <dd>Que no se puede enseñar el producto desplegado. Plan: tener el proyecto funcionando también en local, con los datos de prueba de la semana 10, y llevarlo preparado.</dd>
  <dt>Por qué esto se decide en la semana 13 y no en junio</dt>
  <dd>Porque «funciona también en local con un comando» es una propiedad que hay que mantener desde el principio; recuperarla al final, cuando el proyecto ya está lleno de configuración del entorno desplegado, cuesta días.</dd>
</dl>

### El registro de riesgos técnicos

<p class="term">Riesgo técnico</p>

Algo que todavía no ha pasado, que podría impedir terminar el proyecto, y sobre lo que se puede vigilar y actuar antes de que sea tarde.

Un riesgo mal escrito es un miedo. Uno bien escrito tiene **señal temprana** y **plan**, y esas dos columnas son las que lo convierten en algo útil:

<p class="stage">Paso 1 · Te enseño uno</p>

| Riesgo | Impacto | Señal temprana | Plan |
| ------ | ------- | -------------- | ---- |
| Nadie del equipo ha conectado nunca el frontend con una API real | Alto: bloquea la semana 17 | Que en la semana 15 no exista ni una petición funcionando de punta a punta | Hacer una única llamada real en la semana 15, antes que ninguna pantalla bonita |
| El despliegue se deja para el final y no funciona | Alto: no hay producto público | Que llegue la semana 20 sin haber desplegado nunca nada | Desplegar una versión mínima en la semana 16, aunque solo devuelva una pantalla |
| La identificación rápida no cumple RNF-01 en la tablet real | Alto: nadie lo usa | Que en la prueba de la semana 18 haga falta más de tres interacciones | Probar con la tablet en la semana 16, no en la 21 |
| Una persona del equipo lleva todo el backend y se descuelga | Medio: se para la mitad del proyecto | Dos semanas sin commits de esa persona | Repartir por historias verticales, no por capas, desde la semana 14 |
| La red del centro falla el día de la defensa | Medio: no hay demo | No hay señal previa | Mantener el proyecto ejecutable en local y llevarlo preparado |

<dl class="worked">
  <dt>Fijaos en los dos primeros</dt>
  <dd>Los dos salen del pre-mortem de la semana 3. No son riesgos nuevos: son los mismos, ahora con fecha de vigilancia y con un plan concreto.</dd>
  <dt>Fijaos en el cuarto</dt>
  <dd>Es el único que no es técnico, y es el que más proyectos hunde. Su plan —repartir por historias verticales y no por capas— es una decisión de organización que se ejecuta la semana que viene.</dd>
  <dt>Fijaos en la columna de señal temprana</dt>
  <dd>Es lo que hace que el registro sirva para algo. Un riesgo sin señal es una lista de preocupaciones que nadie vuelve a mirar; con señal, alguien puede decir en la semana 20 «esto era la señal, actuamos».</dd>
</dl>

### Tarea de la sesión

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Listad los componentes de vuestro sistema, y para cada uno lo que hace y lo que <em>no</em> hace.</li>
  <li>Dibujad la arquitectura: debe caber de un vistazo y señalar qué no es alcanzable desde fuera.</li>
  <li>Escribid lo que NO hay, con la exclusión de la semana 6 de la que sale.</li>
  <li>Justificad cada elección que se aparte de la referencia del ciclo, con las cuatro preguntas.</li>
  <li>Listad las dependencias externas y responded a las tres preguntas de cada una.</li>
  <li>Montad el registro de riesgos: al menos cinco, con impacto, señal temprana y plan.</li>
  <li>Comprobad que los riesgos del pre-mortem de la semana 3 están todos, y con plan.</li>
</ol>

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Diagrama de arquitectura y registro inicial de riesgos técnicos.</p>
  <ul class="checklist">
    <li>Diagrama que cabe de un vistazo, con las piezas, las direcciones y el límite del servidor.</li>
    <li>Responsabilidades de cada componente, incluyendo lo que no debe hacer.</li>
    <li>Lista de lo que el sistema no incluye, trazada a las exclusiones.</li>
    <li>Justificación escrita de cada tecnología añadida a la referencia del ciclo.</li>
    <li>Dependencias externas, cada una con qué pasa si falla, si desaparece y si se puede enseñar la demo sin ella.</li>
    <li>Registro de riesgos con al menos cinco entradas, cada una con impacto, señal temprana y plan.</li>
    <li>La decisión de mantener el proyecto ejecutable en local, escrita como compromiso.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que sea legible | El diagrama se entiende sin explicación y sin leyenda |
| Que separe responsabilidades | Ninguna regla de negocio vive solo en el cliente |
| Que sea honesto | Se dice lo que no hay, y por qué |
| Que las elecciones estén justificadas | Cada tecnología añadida responde a las cuatro preguntas |
| Que los riesgos sean accionables | Cada uno tiene señal temprana y plan, no solo una preocupación |
| Que enlace con lo anterior | El pre-mortem de la semana 3 aparece convertido en riesgos vigilados |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Cuál de las cuatro preguntas de la arquitectura es la que casi nadie se hace?</li>
    <li>¿Dónde vive una regla de negocio, y por qué no basta el navegador?</li>
    <li>¿Qué justificación de una tecnología no vale?</li>
    <li>¿Qué dos columnas convierten un miedo en un riesgo?</li>
    <li>¿Por qué el diagrama de arquitectura no dice dónde está desplegada cada cosa?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Qué pasa cuando una pieza falla.</p>
  <p>2 · En el servidor. En el navegador solo se avisa antes: cualquiera puede lanzar la petición a mano.</p>
  <p>3 · «Es lo moderno», «lo usan las empresas», «queríamos aprenderlo». No hablan del problema.</p>
  <p>4 · La señal temprana y el plan.</p>
  <p>5 · Porque un diagrama responde a una sola pregunta; el despliegue es la semana 23 y mezclarlo lo hace ilegible.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 14</p>
  <ul class="checklist">
    <li>El diagrama está publicado y todo el equipo sabría dibujarlo de memoria.</li>
    <li>El registro de riesgos está en el repositorio y tiene una señal temprana por riesgo.</li>
    <li>Sabéis quién va a llevar cada parte, y por qué no se reparte por capas.</li>
    <li>Terminan las semanas de diseño: a partir de la 14 se organiza, y en la 15 se empieza a construir.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Decidir la arquitectura</figcaption>
  <ol class="flow">
    <li>Se listan las piezas, con lo que hace y lo que no hace cada una</li>
    <li>Se dibuja quién habla con quién, y qué queda dentro del servidor</li>
    <li>Se escribe lo que no hay, trazado a las exclusiones</li>
    <li>Se parte de la referencia del ciclo y se justifica cualquier añadido</li>
    <li>Se identifican las dependencias que no controláis</li>
    <li>Se convierte cada miedo en un riesgo con señal temprana y plan</li>
  </ol>
</figure>

Y las tres frases de la unidad:

> **Un diagrama que necesita leyenda no está resumiendo nada.**
>
> **Toda regla vive en el servidor; el navegador solo avisa antes.**
>
> **Un riesgo sin señal temprana es una preocupación que nadie volverá a mirar.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Componente | Una pieza del sistema con una responsabilidad propia |
| Responsabilidad | Lo que una pieza hace, y sobre todo lo que no debe hacer nunca |
| Cliente-servidor | El reparto en el que el cliente pide y el servidor decide y guarda |
| Superficie expuesta | Lo que es alcanzable desde fuera, y por tanto atacable |
| Dependencia externa | Algo de lo que el sistema depende y que el equipo no controla |
| Riesgo técnico | Algo que aún no ha pasado, podría impedir terminar, y se puede vigilar |
| Señal temprana | El hecho observable que avisa de que un riesgo se está materializando |
| Plan | Lo que se hará cuando aparezca la señal, decidido antes de que aparezca |
| Ejecutable en local | Que el proyecto arranca en un portátil sin depender de nada externo |

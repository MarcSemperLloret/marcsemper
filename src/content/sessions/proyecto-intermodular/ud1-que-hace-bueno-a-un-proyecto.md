---
title: "Elegir el problema"
label: "UD1 · Elegir"
section: "ud-01"
order: 1
lang: "es"
summary: "Salir de la primera sesión con tres candidatos de problema propios, fichados y contrastados, listos para decidir en la sesión 2."
duration: "3 horas · 30 min de explicación + 2 h 20 de taller"
modality: "Taller · el 80 % de la sesión es trabajo del alumnado"
deliverable: "candidatos.md en el repositorio, con tres problemas fichados."
date: "2026-09-07"
outcomes:
  - "Explicar qué evalúa este módulo y qué evalúa Desarrollo Web en Entorno Servidor sobre el mismo producto."
  - "Distinguir un problema defendible de un enunciado de clase."
  - "Generar candidatos propios a partir de contextos a los que se tiene acceso real."
  - "Descartar candidatos con criterios comprobables antes de enamorarse de ninguno."
requirements:
  - "Repositorio del equipo creado en GitHub."
  - "Móvil o cuaderno para tomar notas fuera del aula durante la semana."
draft: true
priorKnowledge:
  []
---

<p class="lead">Objetivo: terminar la sesión con tres problemas propios sobre la mesa, no con una idea a la que ya os habéis enamorado.</p>

<div class="rule">
  <p class="rule-label">Cómo se reparte esta sesión</p>
  <p>Media hora de explicación y dos horas y veinte de trabajo. Lo que se explica al principio es lo único que se explica: el resto de la sesión estáis produciendo algo que la semana que viene se usa. Si os perdéis el bloque inicial, el taller no se sostiene.</p>
</div>

## Sesión 1 · Elegir el problema

<div class="today-box">
  <p class="today-label">Hoy · El reloj</p>
  <ol class="today-steps">
    <li><strong>0:00 – 0:30 · Se explica:</strong> cómo funciona el módulo, qué hace defendible a un problema y cuál es el suelo técnico obligatorio.</li>
    <li><strong>0:30 – 1:05 · Barrido:</strong> doce candidatos salidos de contextos que conocéis, cada uno con una persona con nombre detrás.</li>
    <li><strong>1:05 – 1:35 · Criba:</strong> cuatro preguntas que matan candidatos. De doce quedan cinco.</li>
    <li><strong>1:35 – 2:15 · Ficha:</strong> tres candidatos escritos en serio, con el suelo técnico comprobado.</li>
    <li><strong>2:15 – 2:40 · Contraste:</strong> otra pareja intenta tumbar vuestros tres. Vosotros los suyos.</li>
    <li><strong>2:40 – 2:50 · Evidencia:</strong> commit de <code>candidatos.md</code> en el repositorio.</li>
    <li><strong>2:50 – 3:00 · Cierre.</strong></li>
  </ol>
</div>

---

### Se explica · 30 minutos

#### Este módulo no enseña tecnología, y ahora menos que nunca

No habrá una unidad de Spring Boot, ni de bases de datos, ni de maquetación. Eso lo estáis dando en los otros módulos. Aquí se os pide coger todo eso y usarlo para resolver **un problema que nadie os ha puesto**.

Hay una consecuencia práctica que cambia cómo se trabaja: el backend de vuestro proyecto se construye en las horas de **Desarrollo Web en Entorno Servidor**, con sus criterios y su nota. Es el mismo producto y el mismo repositorio; lo que cambia es qué mira cada módulo.

| Lo evalúa **Servidor** | Lo evalúa **este módulo** |
| ---------------------- | ------------------------- |
| Modelo de datos y relaciones | La elección y el acotado del problema |
| Arquitectura por capas | La interfaz y el recorrido de usuario |
| Validación y manejo de errores | La integración del cliente con vuestra API |
| Consultas y persistencia | El despliegue y que el producto esté vivo |
| Calidad del código del backend | La defensa y el dominio de lo que habéis hecho |

Se puede sacar un 9 en Servidor y un 5 aquí. Y al revés. Si eso no pudiera pasar, os estaríamos evaluando dos veces lo mismo.

<div class="rule">
  <p class="rule-label">Aquí no se corrige el backend</p>
  <p>Que vuestra API esté bien construida por dentro es asunto de Servidor. En este módulo solo importa que responda a lo que vosotros especificasteis, que el producto se pueda usar y que sepáis defenderlo.</p>
</div>

#### Dos vueltas, dos defensas

El curso no es un recorrido de veintiséis semanas hasta una entrega final. Es **el mismo recorrido, dos veces**.

<figure class="diagram">
  <figcaption>Las dos vueltas</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Sesiones 1 – 13 · Primera vuelta</span>Elegir, diseñar, construir, publicar y defender. Producto pequeño, interfaz mínima, desplegado.</li>
    <li><span class="flow-role">Sesión 13 – 14 · Defensa de diciembre</span>Se defiende el producto en su URL pública. Ahí sale la nota del trimestre.</li>
    <li><span class="flow-role">Sesiones 14 – 26 · Segunda vuelta</span>El mismo recorrido con el listón más alto: roles, integración externa, interfaz completa.</li>
    <li><span class="flow-role">Sesión 26 · Defensa de marzo</span>Segunda defensa. Ahí sale la nota final.</li>
  </ol>
</figure>

En la primera vuelta el objetivo no es que el producto sea bueno: es que **el ciclo entero se complete**. Un producto diminuto y feo, pero desplegado en diciembre, es un éxito. Desplegar en diciembre es exactamente lo que hace que marzo no sea un drama.

La nota sale de las dos defensas. No hay catorce entregas documentales. Las rúbricas de las dos defensas están publicadas en Aules desde hoy: leedlas antes de elegir problema, porque describen con qué se os va a medir.

#### Qué hace defendible a un problema

Dos personas hacen «una aplicación de gestión de tareas». Mismo tema, mismo stack.

<dl class="worked">
  <dt>Versión A</dt>
  <dd>CRUD de tareas con título, descripción, fecha y estado. Login. Cuatro pantallas.</dd>
  <dt>Versión B</dt>
  <dd>Las tareas de mantenimiento de un club deportivo pequeño, que hoy se reparten en un grupo de mensajería y se pierden.</dd>
  <dt>¿Qué cambia técnicamente?</dt>
  <dd>Casi nada. Sigue siendo un CRUD con estados.</dd>
  <dt>¿Qué cambia en la defensa?</dt>
  <dd>Todo. Con la A solo se puede hablar de tecnología. Con la B se puede hablar de decisiones: por qué no hay app móvil, por qué el histórico no se borra, por qué se descartó montar una mensajería propia.</dd>
  <dt>La conclusión</dt>
  <dd>El salto no es de dificultad técnica. Es de <strong>contexto</strong>.</dd>
</dl>

Un problema es defendible si pasa estas tres pruebas, y las tres se comprueban en treinta segundos:

| Prueba | Cómo se comprueba |
| ------ | ----------------- |
| **Hay alguien concreto** | Podéis decir un nombre o un rol preciso, no «los usuarios» |
| **Sabéis qué hace hoy sin vosotros** | Una libreta, un grupo de mensajería, un Excel, tres llamadas de teléfono |
| **Se cuenta en una frase** | «A X le pasa Y; hoy lo resuelve con Z, y se le rompe cuando W» |

Y el error que se repite todos los cursos:

> **Un proyecto pequeño y terminado se defiende. Uno grande y a medias, no.**

Cada año alguien decide que «para que se note el esfuerzo» hará también un chat, notificaciones, estadísticas y pasarela de pago. En diciembre no hay nada terminado, la demo falla y no hay nada que defender. El tamaño no aparece en ninguna de las dos rúbricas.

#### El suelo técnico: el tema es libre, la forma no

Si el problema que elegís se resuelve con una tabla y dos formularios, Servidor no puede evaluar nada sobre vuestro producto y vosotros no podéis enseñar lo que sabéis. Por eso el dominio lo elegís vosotros, pero la forma tiene un mínimo.

| Para diciembre | Para marzo |
| -------------- | ---------- |
| Al menos 4 entidades | Todo lo de diciembre, más… |
| Al menos 2 relaciones entre ellas | 2 roles con permisos distintos de verdad |
| Un estado que cambie siguiendo reglas | 1 integración con un servicio externo |
| Una consulta que cruce o agregue datos, no un listado | Interfaz completa para todos los roles |

Comprobadlo **hoy**, mientras elegís. Es barato descartar ahora una idea que no da de sí, y carísimo descubrirlo en noviembre.

<div class="rule">
  <p class="rule-label">Los datos, antes de que sea tarde</p>
  <p>El repositorio es público, y un repositorio público es una publicación. Todos los datos de prueba serán inventados y ninguna credencial se sube. Si vuestra idea solo tiene sentido con datos personales reales de compañeros, pacientes o clientes, es mala idea para este módulo: no por una cuestión abstracta, sino porque no la vais a poder desplegar ni enseñar.</p>
</div>

---

### Se trabaja · 2 horas y 20 minutos

#### Bloque A · Barrido — 35 minutos

<p class="stage stage--solo">En pareja, sin ordenador durante los primeros 15 minutos</p>

No se buscan ideas: se buscan **sitios donde ya hay un problema**. Recorred estos seis contextos y escribid todo lo que se os ocurra, sin filtrar y sin juzgar. El objetivo son **doce candidatos**, y doce candidatos malos es un resultado correcto en este bloque.

| Contexto | Pregunta que lo abre |
| -------- | -------------------- |
| Vuestro centro | ¿Qué se sigue haciendo aquí en papel o en un grupo de mensajería? |
| Vuestra familia | ¿Qué le lleva tiempo a alguien de casa cada semana? |
| Un trabajo, vuestro o de alguien cercano | ¿Qué apunta esa persona en una libreta al final del turno? |
| Un club, banda, asociación o equipo | ¿Cómo se organizan hoy los turnos, las inscripciones o el material? |
| Un comercio pequeño de vuestro barrio | ¿Qué pierden cuando el encargado no está? |
| Vosotros mismos | ¿Qué habéis apuntado en el móvil tres veces este mes? |

Regla que hace que este bloque funcione: **cada candidato lleva detrás una persona a la que podríais escribir esta misma semana**. Si no podéis nombrarla, el candidato no cuenta y no se escribe.

<dl class="answer">
  <dt>Candidato 1 · Qué pasa y a quién</dt>
  <dd></dd>
  <dt>Candidato 2 · Qué pasa y a quién</dt>
  <dd></dd>
  <dt>Candidato 3 · Qué pasa y a quién</dt>
  <dd></dd>
</dl>

<p class="write-line"></p>
<p class="write-line"></p>
<p class="write-line"></p>
<p class="write-line"></p>

<details class="aside aside--help">
  <summary>Si a los diez minutos tenéis tres candidatos y os habéis quedado secos</summary>
  <p>Es lo normal: estáis buscando ideas buenas en vez de situaciones molestas. Cambiad la pregunta. En vez de «qué aplicación podríamos hacer», preguntaos «a quién he oído quejarse este mes, y de qué». Las quejas son mejores candidatos que las ideas, porque ya vienen con una persona incorporada.</p>
</details>

#### Bloque B · Criba — 30 minutos

<p class="stage stage--guided">Se hace en voz alta, candidato por candidato</p>

Pasad los doce por estas cuatro preguntas, en este orden. La primera que dé «no» mata el candidato: no se sigue preguntando, se tacha y se pasa al siguiente. Esto es incómodo a propósito.

<figure class="diagram">
  <figcaption>Las cuatro preguntas que matan</figcaption>
  <ol class="flow flow--chain">
    <li>¿Podéis hablar esta semana con alguien que lo sufra?</li>
    <li>¿Podéis ver o describir con precisión qué hace hoy esa persona?</li>
    <li>¿Se puede alimentar con datos inventados?</li>
    <li>¿Llega al suelo técnico de diciembre: 4 entidades, 2 relaciones, un estado, una consulta que cruce?</li>
  </ol>
</figure>

De doce deberían sobrevivir cinco o menos. Si sobreviven diez, estáis siendo blandos con la pregunta 4: contad las entidades de verdad, escribiéndolas.

<div class="rule">
  <p class="rule-label">El descarte que más duele</p>
  <p>Casi siempre cae aquí la idea que más ilusión hacía, y casi siempre cae por la pregunta 1. Una idea buenísima sobre un sector al que no tenéis acceso es una idea que no vais a poder validar ni defender. Tacharla hoy os ahorra seis semanas.</p>
</div>

#### Bloque C · Ficha — 40 minutos

<p class="stage stage--solo">Con ordenador, un apartado por candidato</p>

Coged **tres** de los supervivientes y escribid esta ficha para cada uno. Sin adornos: son entre diez y quince líneas por candidato.

<dl class="worked">
  <dt>Ejemplo · Encargos de un obrador</dt>
  <dd><strong>La frase:</strong> un obrador de barrio recoge encargos por teléfono y los apunta en una libreta; se pierden y se duplican los fines de semana largos.</dd>
  <dt>¿Quién lo sufre?</dt>
  <dd>La persona del mostrador, que coge el teléfono mientras despacha. Y el obrador, que amasa según lo que entienda de la libreta.</dd>
  <dt>¿Qué hace hoy?</dt>
  <dd>Libreta de doble página: fecha a la izquierda, encargo a la derecha. Los cambios se tachan. Nadie sabe cuántos encargos hay para el domingo hasta que se cuentan a mano.</dd>
  <dt>¿Cuándo se rompe?</dt>
  <dd>Cuando alguien llama para cambiar un encargo y atiende una persona distinta de la que lo apuntó.</dd>
  <dt>Entidades que ya se ven</dt>
  <dd>Cliente, Encargo, Producto, LíneaDeEncargo, y probablemente FranjaDeRecogida. Cinco.</dd>
  <dt>Relaciones</dt>
  <dd>Un cliente tiene muchos encargos; un encargo tiene muchas líneas; cada línea apunta a un producto.</dd>
  <dt>El estado que cambia</dt>
  <dd>Encargo: recibido, confirmado, en producción, listo, entregado, anulado. Con reglas: no se anula uno que ya está en producción sin dejar rastro.</dd>
  <dt>La consulta que no es un listado</dt>
  <dd>Cuánta cantidad de cada producto hay que tener lista en cada franja del domingo, sumando todas las líneas de todos los encargos confirmados.</dd>
  <dt>Qué queda fuera del MVP y por qué</dt>
  <dd>Cobros y facturación: el obrador ya cobra en mostrador, y meterlo obligaría a tocar dinero real.</dd>
</dl>

<p class="stage stage--solo">Ahora vosotros, tres veces</p>

<dl class="answer">
  <dt>La frase, en una línea</dt>
  <dd></dd>
  <dt>¿Quién lo sufre? Rol concreto</dt>
  <dd></dd>
  <dt>¿Qué hace hoy, sin vuestra aplicación?</dt>
  <dd></dd>
  <dt>¿En qué momento exacto se rompe lo que hace hoy?</dt>
  <dd></dd>
  <dt>Entidades que ya se ven, contadas</dt>
  <dd></dd>
  <dt>Relaciones entre ellas</dt>
  <dd></dd>
  <dt>El estado que cambia, y una regla que lo gobierne</dt>
  <dd></dd>
  <dt>Una consulta que cruce o agregue</dt>
  <dd></dd>
  <dt>Qué dejaríais fuera del MVP y por qué</dt>
  <dd></dd>
</dl>

<div class="rule">
  <p class="rule-label">La línea que separa este bloque de una lluvia de ideas</p>
  <p>«¿En qué momento exacto se rompe?» es la pregunta cara. Si no sabéis responderla, no conocéis el problema todavía: conocéis su titular. Escribid «no lo sé» y anotad a quién vais a preguntárselo antes del viernes.</p>
</div>

#### Bloque D · Contraste — 25 minutos

<p class="stage stage--guided">Dos parejas, 12 minutos por sentido</p>

Intercambiad las tres fichas con otra pareja. Vuestro trabajo **no** es decir si os gusta la idea: es intentar tumbarla. Tenéis cuatro ataques permitidos, y hay que usarlos todos.

| Ataque | Cómo se formula |
| ------ | --------------- |
| **La hoja de cálculo** | «Esto lo resuelve un Excel compartido en veinte minutos. ¿Qué añade vuestra aplicación?» |
| **El competidor** | «Existe una herramienta gratuita que ya hace esto. ¿Por qué no la usan?» |
| **El acceso** | «¿Con quién de esa gente habéis hablado, y cuándo vais a hablar otra vez?» |
| **El suelo técnico** | «Contadme las entidades en voz alta. ¿Cuatro de verdad, o dos y dos que os habéis inventado ahora?» |

Anotad las respuestas, incluidas las malas. Una ficha que no sobrevive al ataque de la hoja de cálculo no se borra: se marca, porque puede volver con otro alcance.

<dl class="answer">
  <dt>Candidato más atacado, y por qué</dt>
  <dd></dd>
  <dt>Ataque para el que no teníais respuesta</dt>
  <dd></dd>
  <dt>Qué cambiaríais de la ficha después de esto</dt>
  <dd></dd>
</dl>

#### Bloque E · Evidencia — 10 minutos

<p class="stage stage--solo">Al repositorio, antes de salir</p>

<p class="term">Evidencia</p>

Algo que existe fuera de vuestra cabeza y que otra persona puede consultar sin pediros explicaciones. «Lo tenemos pensado» no cuenta: si está solo pensado, no existe.

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la sesión</p>
  <p><code>candidatos.md</code>, commiteado en el repositorio del equipo antes de salir del aula.</p>
  <ul class="checklist">
    <li>Los tres candidatos con la ficha completa, incluidas las casillas donde pone «no lo sé».</li>
    <li>La lista de los descartados, con la pregunta que los mató. Una línea cada uno.</li>
    <li>Lo que dijo la otra pareja en el contraste, sin suavizar.</li>
    <li>El nombre de la persona con la que vais a hablar esta semana, y de qué candidato.</li>
  </ul>
</div>

---

### Cierre · 10 minutos

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué evalúa Servidor sobre vuestro producto y qué evalúa este módulo?</li>
    <li>¿Por qué la primera vuelta pide desplegar algo diminuto en diciembre en vez de esperar a tenerlo bien?</li>
    <li>Un candidato tiene una idea excelente, pero no conocéis a nadie del sector. ¿Sobrevive a la criba?</li>
    <li>¿Por qué hay un suelo técnico si el tema es libre?</li>
    <li>Vuestro candidato favorito tiene tres entidades. ¿Qué hacéis?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Servidor evalúa el backend por dentro. Este módulo, la elección del problema, la interfaz, la integración, el despliegue y la defensa.</p>
  <p>2 · Porque el despliegue es lo que más se atasca, y atascarse en diciembre con un producto pequeño es barato. En marzo, con uno grande, no.</p>
  <p>3 · No. Muere en la pregunta 1: sin acceso no podéis validarlo ni defenderlo.</p>
  <p>4 · Porque si el producto no da de sí, Servidor no puede evaluar nada sobre él y vosotros no podéis enseñar lo que sabéis.</p>
  <p>5 · O se amplía el alcance hasta que llegue a cuatro con sentido, o se cambia de candidato. Lo que no se hace es inventar dos entidades para cubrir el expediente.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 2</p>
  <ul class="checklist">
    <li>El fichero <code>candidatos.md</code> está en el repositorio y los dos miembros del equipo pueden abrirlo.</li>
    <li>Habéis hablado con al menos una persona que sufre uno de los tres problemas, y traéis anotado qué os dijo.</li>
    <li>Traéis una foto, una captura o una descripción de cómo lo resuelven hoy: la libreta, el Excel, el grupo de mensajería.</li>
    <li>Habéis leído las dos rúbricas de defensa publicadas en Aules.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">Qué pasa en la sesión 2</p>
  <p>Se decide. Uno de los tres candidatos se convierte en el proyecto del curso y los otros dos se archivan. La decisión se toma con lo que hayáis traído de hablar con gente, no con lo que os parezca en el aula: por eso la tarea de esta semana no es opcional.</p>
</div>

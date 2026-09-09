---
title: "Elegir el problema grande"
label: "UD5 · Elegir"
section: "ud-05"
order: 5
lang: "es"
summary: "Salir con tres problemas propios fichados y contrastados, y uno elegido, para que el proyecto de la segunda evaluación empiece en enero con el problema decidido en vez de con la clase en blanco."
duration: "3 horas · 1 sesión"
modality: "Taller · el 80 % de la sesión es trabajo del alumnado"
deliverable: "candidatos.md con tres problemas fichados, el elegido señalado y el nombre de la persona con la que se va a hablar."
date: "2026-09-09"
outcomes:
  - "Distinguir un problema defendible de un enunciado de clase."
  - "Generar candidatos a partir de contextos a los que se tiene acceso real."
  - "Descartar candidatos con criterios comprobables antes de enamorarse de ninguno."
  - "Comprobar que un problema da de sí para el listón técnico de la segunda evaluación."
  - "Sostener un candidato frente a los cuatro ataques que lo tumban."
requirements:
  - "Los dos proyectos de la primera evaluación publicados."
priorKnowledge:
  - "Lo que cuesta llevar dos piezas a producción, aprendido a base de hacerlo."
---

<p class="lead">Hasta ahora el problema os lo he dado yo: un portfolio y un CRUD. Ninguno de los dos resolvía nada de nadie, y estaba bien así, porque lo que se aprendía era el método. En la segunda evaluación el problema lo elegís vosotros, y esa elección se hace hoy.</p>

<div class="rule">
  <p class="rule-label">Por qué esto se hace antes de las vacaciones y no en enero</p>
  <p>Porque la parte que no se puede acelerar es hablar con alguien que sufra el problema, y eso se hace fuera del aula. Si salís hoy con un candidato y un nombre, en enero empezáis a construir. Si salís sin nada, la primera semana de enero se va en elegir, la segunda en dudar, y el proyecto nace con un mes menos.</p>
</div>

## Sesión 13 · Elegir el problema del proyecto grande

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>De los dos proyectos de este trimestre, ¿cuál le enseñaríais a alguien que no es profesor vuestro, y por qué?</li>
    <li>¿Qué le faltaba a los dos para que le importaran a alguien?</li>
    <li>Decid un problema que hayáis visto sufrir a una persona concreta este mes.</li>
  </ol>
</div>

---

### Se explica

#### Qué cambia en la segunda evaluación

Tres cosas, y solo una es técnica.

| Primera evaluación | Segunda evaluación |
| ------------------ | ------------------ |
| El problema lo pongo yo | El problema lo elegís vosotros, y lo defendéis |
| El circuito se explica paso a paso | El circuito se da por sabido: se usa y se evalúa |
| Un solo tipo de usuario y nada externo | Roles con permisos distintos de verdad, y una integración con un servicio que no controláis |

Lo que **no** cambia es qué se evalúa aquí: el método. Vuestro producto puede ser modesto; lo que no puede ser es un producto sobre el que no sepáis decir por qué existe.

#### Un ejercicio y un proyecto se distinguen en una frase

Dos personas hacen «una aplicación de gestión de tareas». Mismo tema, mismo stack.

<dl class="worked">
  <dt>Versión A</dt>
  <dd>CRUD de tareas con título, descripción, fecha y estado. Login. Cuatro pantallas.</dd>
  <dt>Versión B</dt>
  <dd>Las tareas de mantenimiento de un club deportivo pequeño, que hoy se reparten en un grupo de mensajería y se pierden.</dd>
  <dt>¿Qué cambia técnicamente?</dt>
  <dd>Casi nada. Sigue siendo un CRUD con estados.</dd>
  <dt>¿Qué cambia al defenderlo?</dt>
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

#### El suelo técnico, medido contra lo que ya sabéis hacer

El tema es libre; la forma no. Si el problema que elegís se resuelve con una tabla y dos formularios, ni Servidor puede evaluar nada ni vosotros podéis enseñar lo que sabéis.

| Mínimo para marzo | Por qué está ahí |
| ----------------- | ---------------- |
| Al menos 4 entidades con 2 relaciones entre ellas | Es lo que hace que el modelo de datos tenga algo que decidir |
| Un estado que cambie siguiendo reglas | Sin eso no hay lógica de negocio, solo almacenamiento |
| Una consulta que cruce o agregue datos, no un listado | Es donde se nota si el modelo estaba bien pensado |
| Dos roles con permisos distintos de verdad | Autorización que se comprueba en el servidor |
| Una integración con un servicio externo | Lo que os obliga a tratar con algo que no controláis |

Comprobadlo **hoy**, mientras elegís, contando las entidades en voz alta. Es barato descartar ahora una idea que no da de sí, y carísimo descubrirlo en febrero.

<div class="rule">
  <p class="rule-label">El error que se repite todos los cursos</p>
  <p>Alguien decide que «para que se note el esfuerzo» hará también un chat, notificaciones, estadísticas y pasarela de pago. En marzo no hay nada terminado, la demostración falla y no hay nada que defender. <strong>Un proyecto pequeño y terminado se defiende; uno grande y a medias, no.</strong> El tamaño no aparece en ninguna rúbrica.</p>
</div>

<div class="rule">
  <p class="rule-label">Los datos, antes de que sea tarde</p>
  <p>El repositorio es público, y un repositorio público es una publicación. Todos los datos de prueba serán inventados y ninguna credencial se sube. Si vuestra idea solo tiene sentido con datos personales reales de compañeros, pacientes o clientes, es mala idea para este módulo: no por una cuestión abstracta, sino porque no la vais a poder desplegar ni enseñar.</p>
</div>

---

### Se trabaja

#### Bloque A · Barrido

<p class="stage stage--solo">En pareja, y los primeros minutos sin ordenador</p>

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

<ol class="fill-in" aria-label="Espacio para escribir los candidatos">
  <li><span class="visually-hidden">Candidato 1</span></li>
  <li><span class="visually-hidden">Candidato 2</span></li>
  <li><span class="visually-hidden">Candidato 3</span></li>
  <li><span class="visually-hidden">Candidato 4</span></li>
  <li><span class="visually-hidden">Candidato 5</span></li>
  <li><span class="visually-hidden">Candidato 6</span></li>
</ol>

<details class="aside aside--help">
  <summary>Si os habéis quedado secos con tres candidatos</summary>
  <p>Es lo normal: estáis buscando ideas buenas en vez de situaciones molestas. Cambiad la pregunta. En vez de «qué aplicación podríamos hacer», preguntaos «a quién he oído quejarse este mes, y de qué». Las quejas son mejores candidatos que las ideas, porque ya vienen con una persona incorporada.</p>
</details>

#### Bloque B · Criba

<p class="stage stage--guided">En voz alta, candidato por candidato</p>

Pasad los doce por estas cuatro preguntas, en este orden. La primera que dé «no» mata el candidato: no se sigue preguntando, se tacha y se pasa al siguiente. Esto es incómodo a propósito.

<figure class="diagram">
  <figcaption>Las cuatro preguntas que matan</figcaption>
  <ol class="flow">
    <li>¿Podéis hablar estas vacaciones con alguien que lo sufra?</li>
    <li>¿Podéis ver o describir con precisión qué hace hoy esa persona?</li>
    <li>¿Se puede alimentar con datos inventados?</li>
    <li>¿Llega al suelo técnico: cuatro entidades, dos relaciones, un estado con reglas, una consulta que cruce y dos roles?</li>
  </ol>
</figure>

De doce deberían sobrevivir cinco o menos. Si sobreviven diez, estáis siendo blandos con la cuarta: contad las entidades de verdad, escribiéndolas.

<div class="rule">
  <p class="rule-label">El descarte que más duele</p>
  <p>Casi siempre cae aquí la idea que más ilusión hacía, y casi siempre cae por la primera pregunta. Una idea buenísima sobre un sector al que no tenéis acceso es una idea que no vais a poder validar ni defender. Tacharla hoy os ahorra seis semanas.</p>
</div>

#### Bloque C · Ficha

<p class="stage stage--solo">Con ordenador, un apartado por candidato</p>

Coged **tres** de los supervivientes y escribid esta ficha para cada uno. Sin adornos: diez o quince líneas por candidato.

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
  <dd>Cliente, Encargo, Producto, LíneaDeEncargo y FranjaDeRecogida. Cinco.</dd>
  <dt>El estado que cambia</dt>
  <dd>Encargo: recibido, confirmado, en producción, listo, entregado, anulado. Con reglas: no se anula uno que ya está en producción sin dejar rastro.</dd>
  <dt>La consulta que no es un listado</dt>
  <dd>Cuánta cantidad de cada producto hay que tener lista en cada franja del domingo, sumando todas las líneas de todos los encargos confirmados.</dd>
  <dt>Los dos roles</dt>
  <dd>Mostrador, que crea y modifica encargos. Obrador, que solo ve la producción del día y marca lo que está listo.</dd>
  <dt>Qué queda fuera y por qué</dt>
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
  <dt>Entidades y relaciones, contadas</dt>
  <dd></dd>
  <dt>El estado que cambia, y una regla que lo gobierne</dt>
  <dd></dd>
  <dt>Una consulta que cruce o agregue</dt>
  <dd></dd>
  <dt>Los dos roles, y qué puede hacer cada uno que el otro no</dt>
  <dd></dd>
  <dt>Qué dejaríais fuera y por qué</dt>
  <dd></dd>
</dl>

<div class="rule">
  <p class="rule-label">La pregunta cara</p>
  <p>«¿En qué momento exacto se rompe?» Si no sabéis responderla, no conocéis el problema todavía: conocéis su titular. Escribid «no lo sé» y anotad a quién vais a preguntárselo.</p>
</div>

#### Bloque D · Contraste

<p class="stage stage--guided">Dos parejas, intercambiando las fichas</p>

Vuestro trabajo **no** es decir si os gusta la idea: es intentar tumbarla. Cuatro ataques, y hay que usarlos todos.

| Ataque | Cómo se formula |
| ------ | --------------- |
| **La hoja de cálculo** | «Esto lo resuelve un Excel compartido en veinte minutos. ¿Qué añade vuestra aplicación?» |
| **El competidor** | «Existe una herramienta gratuita que ya hace esto. ¿Por qué no la usan?» |
| **El acceso** | «¿Con quién de esa gente habéis hablado, y cuándo vais a hablar otra vez?» |
| **El suelo técnico** | «Contadme las entidades en voz alta. ¿Cuatro de verdad, o dos y dos que os habéis inventado ahora?» |

Anotad las respuestas, incluidas las malas. Una ficha que no sobrevive al ataque de la hoja de cálculo no se borra: se marca, porque puede volver con otro alcance.

<dl class="answer">
  <dt>Ataque para el que no teníais respuesta</dt>
  <dd></dd>
  <dt>Qué cambiaríais de la ficha después de esto</dt>
  <dd></dd>
</dl>

#### Bloque E · Elegir y dejar constancia

<p class="stage stage--solo">Antes de salir del aula</p>

Crear el repositorio del proyecto grande no toca hoy; lo que toca es que la decisión exista fuera de vuestra cabeza. Añadid `candidatos.md` al repositorio de vuestro portfolio, en una carpeta `docs`, y entra por el circuito como cualquier otro cambio.

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la sesión</p>
  <ul class="checklist">
    <li>Los tres candidatos con su ficha completa, incluidas las casillas donde pone «no lo sé».</li>
    <li>La lista de descartados, con la pregunta que mató a cada uno. Una línea por candidato.</li>
    <li>Lo que dijo la otra pareja en el contraste, sin suavizar.</li>
    <li><strong>El elegido, señalado</strong>, y en una línea por qué ese y no los otros dos.</li>
    <li>El nombre de la persona con la que vais a hablar antes de enero.</li>
  </ul>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres fichas completas y una elegida, en el repositorio.</span></div>
  <div><strong>Si lo tenéis</strong><span>El suelo técnico del elegido comprobado escribiendo las entidades y las dos consultas, no de memoria.</span></div>
  <div><strong>Reto</strong><span>Escribid el mensaje que le vais a mandar a esa persona: tres frases, sin pedirle que os «dé ideas», preguntándole qué hace hoy y cuándo se le rompe.</span></div>
</div>

---

### Cierre

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Qué distingue un problema defendible de un enunciado de clase?</li>
    <li>Un candidato tiene una idea excelente pero no conocéis a nadie del sector. ¿Sobrevive a la criba?</li>
    <li>¿Por qué hay un suelo técnico si el tema es libre?</li>
    <li>Vuestro candidato favorito tiene tres entidades. ¿Qué hacéis?</li>
    <li>¿Por qué un proyecto pequeño y terminado vale más que uno grande a medias?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que hay alguien concreto detrás, que sabéis qué hace hoy sin vosotros y que se cuenta en una frase.</p>
  <p>2 · No. Muere en la primera pregunta: sin acceso no podéis validarlo ni defenderlo.</p>
  <p>3 · Porque si el producto no da de sí, Servidor no puede evaluar nada sobre él y vosotros no podéis enseñar lo que sabéis.</p>
  <p>4 · O se amplía el alcance hasta que llegue a cuatro con sentido, o se cambia de candidato. Lo que no se hace es inventar dos entidades para cubrir el expediente.</p>
  <p>5 · Porque lo terminado se puede enseñar, medir y defender, y lo que está a medias solo se puede explicar.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 14</p>
  <ul class="checklist">
    <li><code>candidatos.md</code> en el repositorio, con el elegido señalado.</li>
    <li>Traed preparados los tres artefactos de la defensa: vuestro tablero, la pull request que más se discutió y una ejecución de Actions que falló. En la sesión 14 se defiende con ellos.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">Y durante las vacaciones</p>
  <p>Una sola cosa: hablar con la persona que anotasteis. No para pedirle ideas ni para enseñarle nada, sino para que os cuente qué hace hoy y en qué momento se le rompe. Traed apuntado lo que os diga, aunque sea que vuestro problema no le parece un problema. Eso también es información, y es mejor tenerla en enero que en marzo.</p>
</div>

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>De doce candidatos a uno defendible</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Barrido</span>Se buscan contextos con problemas, no ideas. Doce candidatos malos es un buen resultado.</li>
    <li><span class="flow-role">Criba</span>Cuatro preguntas, y la primera que dé «no» mata el candidato sin discusión.</li>
    <li><span class="flow-role">Ficha</span>Tres candidatos escritos en serio, con el suelo técnico contado y no supuesto.</li>
    <li><span class="flow-role">Contraste</span>Otra pareja intenta tumbarlos con cuatro ataques obligatorios.</li>
    <li><span class="flow-role">Elección</span>Uno señalado, con el motivo escrito, y una persona con la que hablar.</li>
  </ol>
</figure>

| Idea | Por qué |
| ---- | ------- |
| **El salto es de contexto, no de dificultad** | El mismo CRUD es un ejercicio o un proyecto según si hay alguien concreto detrás |
| **Sin acceso no hay proyecto** | Una idea que no podéis validar con nadie no se puede defender por muy buena que sea |
| **El suelo técnico se cuenta, no se supone** | Escribir las entidades tarda cinco minutos y evita descubrir en febrero que la idea no daba de sí |
| **Pequeño y terminado gana** | El tamaño no está en ninguna rúbrica; lo terminado sí |

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Candidato | Un problema anotado con una persona concreta detrás, antes de decidir nada |
| Criba | El descarte con criterios comprobables, hecho antes de encariñarse con ninguno |
| Suelo técnico | El mínimo de forma que el producto tiene que tener para poder evaluarse, sea cual sea el tema |
| Contraste | Someter un candidato a los ataques que lo tumbarían, hechos por alguien que no lo escribió |
| Alcance | Lo que entra y lo que queda fuera, decidido y escrito antes de construir |

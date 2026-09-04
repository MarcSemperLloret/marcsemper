---
title: "Diseñar los datos"
label: "UD5 · Modelar"
section: "ud-05"
order: 5
lang: "es"
summary: "Convertir el producto en un modelo conceptual de entidades, atributos, relaciones, cardinalidades e integridad."
duration: "6 horas · 2 semanas · 2 sesiones"
modality: "Taller de modelado · conexión con Bases de Datos"
deliverable: "Modelo de datos inicial."
date: "2026-08-31"
outcomes:
  - "Derivar datos a partir de necesidades del producto."
  - "Construir un modelo entidad-relación coherente."
  - "Revisar el modelo con casos reales y restricciones."
requirements:
  - "Especificación y prototipo actualizados."
priorKnowledge:
  - "Fundamentos de modelado aprendidos en Bases de Datos."
---

<p class="lead">El modelo se trabaja primero a nivel conceptual. Proyecto Intermodular conecta con Bases de Datos, pero no vuelve a enseñar el módulo.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio. Se revisan decisiones del dominio y se enlaza con el material de Bases de Datos cuando haga falta.</p>
</div>

<div class="rule">
  <p class="rule-label">Las dos semanas, de un vistazo</p>
  <p>Semana 9, de las historias a las entidades, los atributos y las relaciones. Semana 10, cardinalidades, integridad, borrado y la revisión del modelo contra los criterios de aceptación. Aquí no se explica qué es una clave ajena ni cómo se normaliza: eso es Bases de Datos. Aquí se decide <em>qué</em> modelar y se comprueba que el modelo aguanta el producto que definisteis.</p>
</div>

## Sesión 9 · De las historias a las entidades

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Que el modelo se lee de la especificación en vez de inventarse, qué es una entidad de verdad y por qué un estado no se guarda dos veces.</li>
    <li><strong>2. Haz:</strong> Extrae las entidades candidatas de vuestras historias, decide sus atributos con criterio de minimización y traza las relaciones.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el checkpoint de la sesión 9.</li>
  </ol>
</div>

### El modelo no se inventa: se lee

Es tentador empezar por la pizarra y dibujar lo que suena razonable. Pero ya tenéis escrito casi todo lo que hace falta, en tres sitios:

| De dónde sale | Qué aporta |
| ------------- | ---------- |
| Las historias | Los sustantivos que el producto maneja: herramienta, préstamo, persona |
| Los criterios de aceptación | Los estados y los momentos: activo, devuelto, «desde cuándo» |
| El prototipo | Lo que hay que poder mostrar en cada pantalla, que es lo que hay que poder consultar |

<div class="rule">
  <p class="rule-label">La prueba que decide si un dato existe</p>
  <p>Un dato entra en el modelo si alguna pantalla lo muestra, alguna regla lo comprueba o algún requisito lo exige. Si no está en ninguno de los tres, no se guarda. Cada campo de más es trabajo en la semana 15, una columna que mantener y, si es personal, una obligación legal.</p>
</div>

### Qué es una entidad y qué no

<p class="term">Entidad</p>

Algo del dominio que existe por sí mismo, del que hay muchos ejemplares distinguibles y del que interesa guardar constancia a lo largo del tiempo.

El error habitual es confundir entidades con conceptos. Tres preguntas resuelven casi todos los casos dudosos:

<figure class="diagram">
  <figcaption>¿Esto es una entidad?</figcaption>
  <ol class="flow">
    <li>¿Hay muchos, y hace falta distinguir unos de otros?</li>
    <li>¿Tiene atributos propios, más allá de un nombre?</li>
    <li>¿Interesa saber que existió, aunque después cambie o desaparezca?</li>
  </ol>
</figure>

<div class="compare-pair">
  <div>
    <p class="compare-label">No es entidad</p>
    <p class="compare-body">«Estado de la herramienta.» Hay tres valores fijos, no tienen atributos propios y no interesa su historia. Es un atributo con valores acotados.</p>
  </div>
  <div>
    <p class="compare-label">Sí es entidad</p>
    <p class="compare-body">«Préstamo.» Hay miles, cada uno es distinto, tiene fechas y personas asociadas, y su historia es justamente el problema que resolvemos.</p>
  </div>
</div>

<p class="stage">Paso 1 · Te enseño uno</p>

Subrayo los sustantivos de las ocho historias del MVP de PrestaTaller y los paso por las tres preguntas:

<dl class="worked">
  <dt>Herramienta · sí</dt>
  <dd>Hay muchas, cada unidad se distingue por su código, y su historia importa: quién la tuvo antes.</dd>
  <dt>Persona · sí</dt>
  <dd>El alumnado y el responsable. Dos roles, una sola entidad con un campo que los distingue, porque comparten los mismos atributos.</dd>
  <dt>Préstamo · sí</dt>
  <dd>Es el corazón del modelo. Relaciona una herramienta con una persona en un momento, y es lo único que responde a «quién tiene qué».</dd>
  <dt>Grupo · dudoso</dt>
  <dd>Aparece en H13, que quedó fuera del MVP. Pero el responsable necesita saber a qué grupo pertenece alguien para ir a buscarlo. Decisión: por ahora un atributo de texto en Persona, no una entidad. Si en la semana 19 hace falta gestionarlos, se convierte en entidad, y esa conversión es barata.</dd>
  <dt>Estado · no</dt>
  <dd>Tres valores fijos. Atributo.</dd>
  <dt>Catálogo · no</dt>
  <dd>Es la lista de todas las herramientas: una consulta, no una entidad.</dd>
  <dt>El resultado</dt>
  <dd>Tres entidades. Para un MVP de ocho historias, entre tres y cinco es lo normal. Si os salen diez, casi seguro que hay conceptos colados entre las entidades.</dd>
</dl>

### La decisión que decide el proyecto

Ahora la pregunta con la que tropiezan casi todos los equipos, y que merece los diez minutos que va a costar.

> **¿Guardamos en Herramienta un estado que diga «prestada»?**

Parece cómodo: así la pantalla P3 filtra por un campo y va rapidísimo. Y es la fuente de errores más común en este tipo de proyectos.

<div class="compare-pair">
  <div>
    <p class="compare-label">Estado guardado</p>
    <p class="compare-body">Herramienta tiene un campo <em>prestada</em>. Al registrar un préstamo hay que crear el préstamo <em>y</em> cambiar el campo. Si una de las dos cosas falla, la base de datos queda mintiendo.</p>
  </div>
  <div>
    <p class="compare-label">Estado derivado</p>
    <p class="compare-body">Una herramienta está prestada si existe un préstamo suyo sin fecha de devolución. No hay nada que sincronizar, porque solo hay una fuente de verdad.</p>
  </div>
</div>

<dl class="worked">
  <dt>Qué pasa con el estado guardado, en la práctica</dt>
  <dd>Alguien registra una devolución, la fecha se graba y el campo no se actualiza porque el fallo ocurrió en medio. A partir de ahí la herramienta consta prestada para siempre y nadie puede volver a cogerla.</dd>
  <dt>Por qué no se detecta</dt>
  <dd>Porque el sistema no da error: da un dato incorrecto. En la demo de junio aparece una herramienta que nadie tiene y no sabréis por qué.</dd>
  <dt>La regla general</dt>
  <dd>Si un dato se puede calcular a partir de otro, no se guarda. Se guarda el hecho —el préstamo, con sus fechas— y lo demás se deduce.</dd>
  <dt>Y la excepción</dt>
  <dd>El campo <em>estado</em> de Herramienta sí existe, pero para otra cosa: disponible o retirada de servicio. Eso no se puede deducir de ningún préstamo, es una decisión de una persona, y por eso sí es un dato propio.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Dónde se paga esta decisión</p>
  <p>En la semana 11 al diseñar la API, porque cambia qué devuelve el endpoint del catálogo. En la 15 al implementarlo. Y en la 21, porque un estado derivado se prueba con un test y un estado duplicado hay que probarlo con cuatro. Es la decisión más barata de tomar hoy y la más cara de cambiar en marzo.</p>
</div>

### Atributos: los que hacen falta y ni uno más

Para cada entidad, la lista de atributos con su tipo, si es obligatorio y de dónde sale. La columna «de dónde sale» es la que evita inventar campos:

<p class="stage">Paso 1 · Te enseño uno</p>

| Entidad · Atributo | Tipo | Obligatorio | De dónde sale |
| ------------------ | ---- | ----------- | ------------- |
| Herramienta · codigo | Texto corto, único | Sí | RF-01, RF-02, y el buscador de P3 |
| Herramienta · nombre | Texto | Sí | P3 y P4, para que se entienda qué es |
| Herramienta · estado | disponible / retirada | Sí | H3, RF-06 |
| Persona · codigo | Texto corto, único | Sí | RF-04, identificación en P1 |
| Persona · nombre | Texto | Sí | P4, el responsable necesita saber a quién buscar |
| Persona · grupo | Texto corto | No | P4, para localizar a alguien |
| Persona · rol | alumnado / responsable | Sí | Tabla de permisos, RF-12 |
| Préstamo · fechaHoraSalida | Fecha y hora | Sí | RF-05, y el «desde cuándo» de H9 |
| Préstamo · fechaHoraDevolucion | Fecha y hora | No | RF-07; vacío significa préstamo activo |
| Préstamo · devueltoPor | Referencia a Persona | No | H10, RF-11: quién cerró el préstamo si no fue quien lo abrió |

<dl class="worked">
  <dt>Fijaos en fechaHoraDevolucion</dt>
  <dd>Es opcional a propósito, y su ausencia es la que define un préstamo activo. Ahí está el estado derivado del que hablábamos, convertido en un solo campo.</dd>
  <dt>Fijaos en devueltoPor</dt>
  <dd>Sale de una historia que está en el anillo «versión 2», no en el MVP. Pero el campo se añade ya, porque añadir una columna vacía hoy es gratis y rellenar el histórico en marzo es imposible.</dd>
  <dt>Fijaos en lo que NO está</dt>
  <dd>No hay correo, ni teléfono, ni DNI, ni foto. RNF-07 lo decidió en la semana 5 y aquí se cumple. Si alguien propone añadir el correo «por si acaso», la respuesta ya está escrita.</dd>
  <dt>Fijaos en Persona · rol</dt>
  <dd>Un solo campo convierte dos roles en una entidad. Si más adelante una persona pudiera tener varios roles, esto tendría que cambiar; hoy no puede, y modelarlo por si acaso sería trabajo perdido.</dd>
</dl>

### Relaciones

Una relación existe cuando una entidad necesita saber de otra. Se nombran con un verbo, en la dirección en que se leen:

<figure class="diagram">
  <figcaption>Las relaciones de PrestaTaller</figcaption>
  <ol class="flow">
    <li>Una <strong>Persona</strong> realiza <strong>Préstamos</strong></li>
    <li>Un <strong>Préstamo</strong> es de una <strong>Herramienta</strong></li>
    <li>Una <strong>Persona</strong> puede registrar la devolución de un <strong>Préstamo</strong> ajeno</li>
  </ol>
</figure>

La tercera es una segunda relación entre las mismas dos entidades, y es fácil pasarla por alto. Existe porque quien devuelve puede no ser quien se lo llevó, y eso lo descubrimos escribiendo H10. **Cuando dos entidades se relacionan de dos maneras distintas, son dos relaciones, no una.**

### Tarea de la sesión

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Subrayad los sustantivos de vuestras historias del MVP y pasadlos por las tres preguntas.</li>
  <li>Decidid cuáles son entidades y cuáles atributos, dejando escrita la justificación de los dudosos.</li>
  <li>Buscad en vuestro modelo algún estado que estéis a punto de guardar dos veces, y decidid.</li>
  <li>Tabla de atributos por entidad, con tipo, obligatoriedad y origen. Si un atributo no tiene origen, se borra.</li>
  <li>Comprobad la tabla contra vuestro requisito de datos personales: ¿hay algún campo que lo incumpla?</li>
  <li>Listad las relaciones con su verbo, mirando si entre dos entidades hay más de una.</li>
</ol>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 9</p>
  <ul class="checklist">
    <li>Cada entidad ha pasado las tres preguntas, y los conceptos se han quedado como atributos.</li>
    <li>Cada atributo tiene un origen en una pantalla, una regla o un requisito.</li>
    <li>Ningún estado se guarda si se puede deducir de otro dato.</li>
    <li>No hay ningún dato personal que vuestro requisito no permita.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿De qué tres sitios se lee el modelo?</li>
    <li>Enuncia la prueba que decide si un dato entra en el modelo.</li>
    <li>¿Por qué no se guarda en Herramienta un campo «prestada»?</li>
    <li>¿Por qué el campo «devueltoPor» se añade ya, aunque su historia no esté en el MVP?</li>
    <li>Dos entidades relacionadas de dos maneras distintas, ¿son una relación o dos?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · De las historias, de los criterios de aceptación y del prototipo.</p>
  <p>2 · Entra si alguna pantalla lo muestra, alguna regla lo comprueba o algún requisito lo exige.</p>
  <p>3 · Porque duplicaría el estado: si el préstamo se crea y el campo no se actualiza, la base de datos queda mintiendo sin dar error.</p>
  <p>4 · Porque añadir una columna vacía hoy es gratis y reconstruir el histórico más adelante es imposible.</p>
  <p>5 · Dos.</p>
</details>

---

## Sesión 10 · Cardinalidades, integridad y revisión

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué dicen las cardinalidades, qué reglas no puede expresar un diagrama, y por qué el borrado es una decisión de negocio antes que técnica.</li>
    <li><strong>2. Haz:</strong> Cierra el modelo entidad-relación, escribe las restricciones de integridad y pásalo por vuestros criterios de aceptación.</li>
    <li><strong>3. Comprueba:</strong> Entrega el modelo v1.0 con sus datos de prueba y revisa la evaluación.</li>
  </ol>
</div>

### Cardinalidades

La cardinalidad responde a dos preguntas por cada extremo de la relación: cuántos como mínimo, y cuántos como máximo.

<p class="stage">Paso 1 · Te enseño uno</p>

<dl class="worked">
  <dt>Persona realiza Préstamos</dt>
  <dd>Una persona puede tener cero préstamos —lo normal a principio de curso— y muchos a la vez. Un préstamo pertenece siempre a exactamente una persona. Uno a muchos, y obligatorio por el lado del préstamo.</dd>
  <dt>Préstamo es de una Herramienta</dt>
  <dd>Un préstamo es siempre de exactamente una herramienta. Una herramienta puede haber sido prestada muchas veces a lo largo del tiempo, o ninguna. Uno a muchos otra vez.</dd>
  <dt>La pregunta que decide el modelo</dt>
  <dd>¿Puede un préstamo llevar varias herramientas a la vez? Apareció en el pre-mortem de la semana 3 como el fracaso número dos, y hay que responderla hoy.</dd>
  <dt>La respuesta, y su motivo</dt>
  <dd>No. Cada préstamo, una herramienta. Se devuelven por separado, se pierden por separado y el responsable pregunta por una en concreto. Llevarse tres cosas crea tres préstamos, y eso encaja con el flujo real; agruparlas obligaría a una entidad intermedia y a decidir qué significa devolver «medio préstamo».</dd>
  <dt>Qué habría pasado con la otra respuesta</dt>
  <dd>Una relación de muchos a muchos, una entidad intermedia, y toda la lógica de devolución complicada. Por una comodidad de interfaz que se resuelve en el prototipo repitiendo el gesto.</dd>
</dl>

### El modelo, dibujado

<figure class="diagram">
  <figcaption>Modelo conceptual de PrestaTaller</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 250" role="img" aria-labelledby="mer-title mer-desc" preserveAspectRatio="xMidYMid meet">
    <title id="mer-title">Modelo entidad-relación de PrestaTaller</title>
    <desc id="mer-desc">Tres entidades. Persona, con código, nombre, grupo y rol. Préstamo, con fecha y hora de salida y de devolución. Herramienta, con código, nombre y estado. Una persona realiza muchos préstamos y cada préstamo es de una sola herramienta, que a su vez puede haber sido prestada muchas veces.</desc>
    <g class="diagram-edges">
      <path d="M 218 100 L 268 100" />
      <path d="M 502 100 L 452 100" />
      <path class="is-dashed" d="M 120 144 L 120 190 L 360 190 L 360 146" />
    </g>
    <text class="diagram-label" x="243" y="86">1 : N</text>
    <text class="diagram-label" x="477" y="86">N : 1</text>
    <text class="diagram-label diagram-label--accent" x="360" y="212">devuelto por (opcional, si no lo cierra quien lo abrió)</text>
    <g class="diagram-node">
      <rect x="30" y="58" width="188" height="86" rx="3" />
      <text x="124" y="86">Persona</text>
      <text class="diagram-subtext" x="124" y="110">codigo · nombre</text>
      <text class="diagram-subtext" x="124" y="128">grupo · rol</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="268" y="58" width="184" height="88" rx="3" />
      <text x="360" y="84">Préstamo</text>
      <text class="diagram-subtext" x="360" y="108">fechaHoraSalida</text>
      <text class="diagram-subtext" x="360" y="126">fechaHoraDevolucion</text>
    </g>
    <g class="diagram-node">
      <rect x="502" y="58" width="188" height="86" rx="3" />
      <text x="596" y="86">Herramienta</text>
      <text class="diagram-subtext" x="596" y="110">codigo · nombre</text>
      <text class="diagram-subtext" x="596" y="128">estado</text>
    </g>
  </svg>
</figure>

Tres cajas y tres líneas. Un modelo conceptual de un MVP tiene este tamaño; si el vuestro no cabe en una pantalla, probablemente estáis modelando la versión 3.0.

### Lo que el diagrama no puede decir

Y aquí llega la parte que se olvida siempre. Mirad el dibujo y buscad esta regla:

> **Una herramienta no puede tener dos préstamos activos a la vez.**

No está. Y no es que se haya olvidado dibujarla: **la notación no permite expresarla**, porque no habla de un máximo de relaciones, sino de un máximo de relaciones *que cumplen una condición*. La cardinalidad dice «una herramienta puede tener muchos préstamos», y es verdad: a lo largo del curso tendrá decenas. Lo que no puede tener es dos abiertos.

<div class="rule">
  <p class="rule-label">Las reglas que viven fuera del diagrama</p>
  <p>Todo modelo tiene reglas que el dibujo no expresa. Hay que escribirlas al lado, en una lista aparte, porque son las que en la semana 15 se convierten en código y en la 21 en tests. Un modelo entregado sin esa lista está incompleto aunque el diagrama sea perfecto.</p>
</div>

Las de PrestaTaller, todas venidas de requisitos que ya existían:

| Regla | Viene de |
| ----- | -------- |
| Una herramienta no puede tener dos préstamos activos a la vez | RF-06 |
| Una persona no puede tener dos préstamos activos de la misma herramienta | CA-3, y es consecuencia de la anterior |
| No se puede cerrar un préstamo ya cerrado | RF-08 |
| La fecha de devolución nunca es anterior a la de salida | Sentido común, y nadie lo comprueba hasta que falla |
| Solo el responsable puede cerrar un préstamo ajeno | RF-12 |
| No se presta una herramienta retirada de servicio | RF-06 |

### Integridad

Con el modelo cerrado, cada dato necesita saber qué se le exige. Esto es lo que en Bases de Datos se traduce en claves, restricciones e índices:

| Tipo | En PrestaTaller |
| ---- | --------------- |
| **Identificador** | Cada entidad tiene su clave; el código de herramienta y el de persona son únicos además de identificar |
| **Obligatoriedad** | Todo lo marcado como obligatorio en la tabla de atributos; la fecha de devolución no lo es |
| **Referencias** | Un préstamo apunta siempre a una persona y a una herramienta que existen |
| **Valores acotados** | El estado de herramienta y el rol de persona solo admiten los valores decididos |
| **Comprobaciones** | Fecha de devolución mayor o igual que la de salida |
| **Unicidad condicional** | Como máximo un préstamo activo por herramienta: es la regla anterior, y es la única que necesita algo más que una restricción simple |

<div class="rule">
  <p class="rule-label">Dónde se comprueba cada regla</p>
  <p>Una regla puede vivir en la base de datos, en el servidor o en el navegador, y la respuesta correcta casi siempre es «en el servidor, y además en la base de datos si se puede». En el navegador se comprueba solo para avisar antes: nunca es una garantía, porque cualquiera puede saltárselo. Esto se estudia en Entorno Servidor; aquí lo que se decide es <em>qué</em> reglas hay.</p>
</div>

### El borrado es una decisión de negocio

RF-13 decía que el histórico de préstamos se conserva y no se puede eliminar. Eso tiene una consecuencia inmediata que casi nadie prevé:

<figure class="diagram">
  <figcaption>Qué pasa al borrar una herramienta que tiene histórico</figcaption>
  <ol class="flow">
    <li>El responsable retira del servicio un calibre roto</li>
    <li>Ese calibre aparece en cuarenta préstamos del curso pasado</li>
    <li class="is-error">Si se borra la fila, esos cuarenta préstamos quedan apuntando a nada</li>
    <li>Por eso no se borra: se marca como retirada</li>
  </ol>
</figure>

<p class="term">Borrado lógico</p>

Marcar un registro como inactivo en lugar de eliminarlo, de forma que deja de usarse pero el histórico que lo referencia sigue teniendo sentido.

<dl class="worked">
  <dt>Qué se borra de verdad en PrestaTaller</dt>
  <dd>Nada. Ni herramientas, ni personas, ni préstamos.</dd>
  <dt>Qué consecuencia tiene en las consultas</dt>
  <dd>Que el catálogo de P3 no es «todas las herramientas», sino «las que no están retiradas». Cada consulta del producto tiene que tenerlo en cuenta, y olvidarlo en una sola pantalla produce un fallo difícil de encontrar.</dd>
  <dt>Y en los datos personales</dt>
  <dd>Aquí aparece la tensión. Conservar el histórico es útil, pero los datos personales no se guardan indefinidamente «porque sí». Decisión del equipo: al terminar el curso, el nombre y el grupo se sustituyen por una referencia anónima y el histórico de préstamos se conserva sin identificar a nadie. Queda escrito, con su motivo.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Dónde deja de ser una elección técnica</p>
  <p>El RGPD exige que los datos personales no se conserven más tiempo del necesario para el fin declarado. Un proyecto que guarda nombres para siempre porque «así queda el histórico» no está siendo cuidadoso: está incumpliendo. Decidid ahora qué pasa con los datos cuando dejan de hacer falta, y escribidlo: es una pregunta muy probable en la defensa.</p>
</div>

### Revisar el modelo contra los criterios de aceptación

Un modelo se revisa haciéndole preguntas que el producto tendrá que responder. Y ya las tenéis escritas: son los criterios de aceptación de la semana 6.

<p class="stage stage--guided">Lo hacemos juntos</p>

Para cada criterio, una sola pregunta: **¿el modelo permite comprobarlo?**

| Criterio | ¿El modelo lo soporta? | Qué haría falta |
| -------- | ---------------------- | --------------- |
| *CA-1 · Al prestar, aparece en mi lista y deja de estar disponible* | *Sí* | *Préstamo sin devolución, y catálogo filtrado* |
| CA-2 · Rechaza prestar algo ya prestado a otra persona | | |
| CA-3 · Avisa si ya la tengo yo | | |
| CA-4 · Sin identificarse, no queda registro de nadie | | |
| H8 · Ver qué está fuera ahora mismo | | |
| H9 · Ver desde cuándo está fuera cada cosa | | |
| H10 · El responsable cierra un préstamo ajeno | | |

<details class="aside aside--help">
  <summary>Qué buscar en esta tabla</summary>
  <p>Casi siempre falla una fila, y casi siempre es la misma clase de fallo: una pantalla que necesita un dato que nadie decidió guardar. En PrestaTaller, si el equipo no hubiera puesto la hora en <em>fechaHoraSalida</em> y solo la fecha, H9 se quedaría sin poder distinguir lo que salió esta mañana de lo que salió hace una semana en el mismo día.</p>
</details>

<p class="stage stage--solo">Ahora tú</p>

Pasad **todos** vuestros criterios de aceptación por el modelo. Cada fallo que encontréis aquí es un fallo que no encontraréis en la semana 17 con el proyecto ya construido encima.

### Datos de prueba

Un modelo sin datos es una hipótesis. Antes de cerrar la unidad, inventad un juego pequeño que se pueda cargar en cualquier momento:

<ol class="fill-in">
  <li>Suficiente para llenar cada pantalla del prototipo: si P4 muestra una lista, que haya varias filas.</li>
  <li>Con al menos un caso incómodo por cada regla: una herramienta retirada, un préstamo muy antiguo sin devolver, una persona sin nada prestado.</li>
  <li>Con todos los datos inventados. Ni nombres reales de compañeros, ni códigos reales del centro.</li>
  <li>Guardado en el repositorio como un fichero que se pueda volver a cargar, no como capturas.</li>
</ol>

El segundo punto es el que rinde: **un juego de datos donde todo va bien no sirve para probar nada**, y es exactamente el que se genera solo si no se piensa.

### Producto de la unidad

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Modelo de datos inicial.</p>
  <ul class="checklist">
    <li>Lista de entidades, con la justificación de las candidatas descartadas y de las dudosas.</li>
    <li>Tabla de atributos por entidad, con tipo, obligatoriedad y origen de cada uno.</li>
    <li>Modelo entidad-relación dibujado, con cardinalidades en ambos extremos.</li>
    <li>Lista de reglas que el diagrama no puede expresar, cada una trazada a su requisito.</li>
    <li>Restricciones de integridad: identificadores, obligatoriedad, referencias, valores acotados y comprobaciones.</li>
    <li>Decisión escrita sobre el borrado, y sobre qué ocurre con los datos personales cuando dejan de hacer falta.</li>
    <li>La revisión del modelo contra todos los criterios de aceptación, con los fallos encontrados y corregidos.</li>
    <li>Juego de datos de prueba inventados, con casos incómodos, cargable desde un fichero del repositorio.</li>
    <li>Los registros de decisión de las dos elecciones grandes: estado derivado y préstamo de una sola herramienta.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que el modelo venga del producto | Cada atributo se rastrea hasta una pantalla, una regla o un requisito |
| Que no haya datos duplicados | Ningún estado guardado que pueda deducirse de otro |
| Que las reglas estén escritas | Las que el diagrama no expresa aparecen en una lista aparte |
| Que se haya pensado el borrado | Hay una decisión razonada, no un descuido |
| Que se haya revisado con casos | Los criterios de aceptación se han pasado por el modelo, uno a uno |
| Que respete la minimización | No hay datos personales que los requisitos no justifiquen |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué la regla «una herramienta no puede tener dos préstamos activos» no aparece en el diagrama?</li>
    <li>¿Dónde se comprueba una regla: en el navegador, en el servidor o en la base de datos?</li>
    <li>¿Qué es un borrado lógico y por qué hace falta aquí?</li>
    <li>¿Con qué se revisa un modelo de datos?</li>
    <li>¿Qué le falta a un juego de datos de prueba en el que todo va bien?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque la notación expresa un máximo de relaciones, no un máximo de relaciones que cumplen una condición.</p>
  <p>2 · En el servidor siempre, y además en la base de datos si se puede. En el navegador solo para avisar antes.</p>
  <p>3 · Marcar un registro como inactivo en vez de eliminarlo; hace falta porque el histórico de préstamos lo referencia y no puede quedar apuntando a nada.</p>
  <p>4 · Con los criterios de aceptación: para cada uno, si el modelo permite comprobarlo.</p>
  <p>5 · Los casos incómodos: precisamente los que van a romper el producto.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 11</p>
  <ul class="checklist">
    <li>El modelo está dibujado, publicado y cabe en una pantalla.</li>
    <li>La lista de reglas que el diagrama no expresa está escrita y trazada a requisitos.</li>
    <li>Los datos de prueba están en el repositorio y contienen casos incómodos.</li>
    <li>Todo el equipo sabe explicar por qué no se guarda un campo «prestada»: es la pregunta más probable en la defensa sobre este bloque.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Del producto al modelo</figcaption>
  <ol class="flow">
    <li>Se leen los sustantivos de las historias, los criterios y el prototipo</li>
    <li>Se separan entidades de conceptos con las tres preguntas</li>
    <li>Se descarta todo estado que pueda deducirse de otro dato</li>
    <li>Se eligen atributos, y cada uno tiene que decir de dónde sale</li>
    <li>Se trazan relaciones, comprobando si entre dos entidades hay más de una</li>
    <li>Se ponen cardinalidades en los dos extremos</li>
    <li>Se escriben aparte las reglas que el diagrama no puede expresar</li>
    <li>Se decide qué se borra, qué se marca y qué pasa con los datos personales</li>
    <li>Se pasan todos los criterios de aceptación por el modelo</li>
    <li>Se inventan datos de prueba con los casos incómodos incluidos</li>
  </ol>
</figure>

Y las tres frases de la unidad:

> **Si un dato se puede calcular, no se guarda.**
>
> **Todo modelo tiene reglas que el dibujo no dice; si no están escritas, no existen.**
>
> **Un modelo se revisa preguntándole lo que el producto tendrá que responder.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Entidad | Algo del dominio con muchos ejemplares distinguibles, atributos propios e historia |
| Atributo | Un dato de una entidad, que tiene que poder rastrearse hasta una pantalla o una regla |
| Estado derivado | El que se deduce de otro dato en lugar de guardarse, para no poder desincronizarse |
| Relación | La conexión entre dos entidades, nombrada con un verbo |
| Cardinalidad | Cuántos ejemplares participan como mínimo y como máximo en cada extremo |
| Regla fuera del diagrama | La restricción que la notación no puede expresar y hay que escribir aparte |
| Integridad | El conjunto de condiciones que los datos deben cumplir siempre |
| Unicidad condicional | Que no haya más de un registro que cumpla a la vez cierta condición |
| Borrado lógico | Marcar como inactivo en lugar de eliminar, para no romper el histórico |
| Minimización | Guardar solo los datos personales necesarios para el fin declarado |
| Juego de datos de prueba | Datos inventados que llenan las pantallas e incluyen los casos incómodos |

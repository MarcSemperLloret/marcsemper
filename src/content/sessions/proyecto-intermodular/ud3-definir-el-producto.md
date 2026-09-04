---
title: "Definir el producto"
label: "UD3 · Definir"
section: "ud-03"
order: 3
lang: "es"
summary: "Transformar la idea seleccionada en un producto acotado mediante usuarios, valor, requisitos, MVP y criterios de aceptación."
duration: "9 horas · 3 semanas · 3 sesiones"
modality: "Taller de producto · decisiones documentadas"
deliverable: "Especificación inicial del proyecto."
date: "2026-08-31"
outcomes:
  - "Explicar el problema y para quién se resuelve."
  - "Distinguir funcionalidad, requisito y criterio de aceptación."
  - "Definir un MVP viable y dejar fuera lo que no pertenece a él."
requirements:
  - "La idea seleccionada y justificada en la UD2."
priorKnowledge:
  - "Criterios de viabilidad, interés y diferenciación."
---

<p class="lead">La idea deja de ser una frase y se convierte en una especificación que otra persona puede revisar, discutir y construir.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio. Cada bloque aporta plantillas y un ejemplo resuelto; el contenido lo produce el equipo y se revisa entre equipos antes de cerrarlo.</p>
</div>

<div class="rule">
  <p class="rule-label">El caso que acompaña a esta unidad</p>
  <p>Los ejemplos resueltos siguen la candidata ganadora de la semana 3: el préstamo de herramienta del taller de un centro de FP. A partir de aquí la llamamos <strong>PrestaTaller</strong>. No es vuestro proyecto: es el que se resuelve en la pizarra para que veáis el método antes de aplicarlo al vuestro.</p>
</div>

<div class="rule">
  <p class="rule-label">Las tres semanas, de un vistazo</p>
  <p>Semana 4, el problema, las personas y el valor. Semana 5, de las necesidades a los requisitos. Semana 6, acotar el alcance y cerrar la especificación. Al final de la semana 6 existe un documento que otro equipo puede leer y construir, y eso es lo que las semanas 7 a 13 van a diseñar.</p>
</div>

## Sesión 4 · El problema, las personas y el valor

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> La diferencia entre síntoma y problema, entre rol y persona, y cómo se escribe una propuesta de valor que no se pueda copiar en otro proyecto.</li>
    <li><strong>2. Haz:</strong> Redacta el enunciado definitivo, las fichas de rol con su tabla de permisos y la frase de valor, y pruébala con otro equipo.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el checkpoint de la sesión 4.</li>
  </ol>
</div>

### Del enunciado de la semana 3 a la especificación

En la UD2 escribisteis un enunciado de problema para poder comparar candidatas. Ahora ese enunciado se convierte en el primer apartado de un documento que se va a usar durante veintitrés semanas, y por eso hay que apretarlo más.

<p class="term">Especificación</p>

El documento que dice qué es el producto, para quién, qué tiene que hacer y cómo se comprobará que lo hace. Lo escribe el equipo, lo entiende alguien de fuera y se actualiza cuando cambia algo.

No es un documento burocrático: es lo que evita que en marzo dos personas del equipo estén construyendo cosas distintas creyendo que son la misma.

### Síntoma y problema

El primer error al redactar es quedarse en lo que se ve.

<div class="compare-pair">
  <div>
    <p class="compare-label">Síntoma</p>
    <p class="compare-body">«Se pierden herramientas.»</p>
  </div>
  <div>
    <p class="compare-label">Problema</p>
    <p class="compare-body">«No existe registro de quién tiene qué, porque anotar la devolución cuesta más esfuerzo que no anotarla.»</p>
  </div>
</div>

La diferencia importa porque cada uno lleva a un producto distinto. Del síntoma sale un inventario. Del problema sale algo que hace que anotar sea trivial. Y solo el segundo tiene alguna posibilidad de que lo usen.

Para bajar del síntoma al problema basta con encadenar porqués hasta llegar a algo que podáis cambiar:

<figure class="diagram">
  <figcaption>La cadena de porqués</figcaption>
  <ol class="flow">
    <li>Se pierden herramientas</li>
    <li>¿Por qué? Porque no se sabe quién las tiene</li>
    <li>¿Por qué? Porque la devolución no se anota</li>
    <li>¿Por qué? Porque hay que ir a la hoja con las manos sucias y buscar la línea</li>
    <li><span class="flow-role">Aquí paramos</span>Esto sí lo podemos cambiar</li>
  </ol>
</figure>

Hay que parar en el primer punto sobre el que podáis actuar. Seguir bajando lleva a «porque el ser humano tiende al mínimo esfuerzo», que es cierto y no sirve de nada.

<p class="stage">Paso 1 · Te enseño uno</p>

<dl class="worked">
  <dt>Contexto</dt>
  <dd>En el taller de mecanizado del centro, el alumnado toma prestada herramienta durante las prácticas. El préstamo se anota en una hoja de papel pegada a la puerta del armario: nombre y herramienta.</dd>
  <dt>Qué falla</dt>
  <dd>La devolución no se anota casi nunca, porque exige localizar la línea propia en una hoja con decenas de entradas, a menudo con las manos sucias y con prisa por salir de clase.</dd>
  <dt>Consecuencia</dt>
  <dd>Al cerrar el trimestre no se sabe qué falta ni quién lo tiene. Recuperarlo obliga a preguntar grupo por grupo durante días, y parte del material no aparece.</dd>
  <dt>A quién afecta</dt>
  <dd>Sobre todo a quien es responsable del taller, que asume la búsqueda y responde del material. También al alumnado, que a veces no encuentra la herramienta que necesita.</dd>
  <dt>Qué se ha intentado ya</dt>
  <dd>Una hoja de cálculo compartida. Se abandonó porque exigía sacar el móvil o ir al ordenador, y en el flujo real del taller eso no ocurre.</dd>
  <dt>Cómo sabríamos que ha mejorado</dt>
  <dd>Si en el cierre de trimestre se puede consultar en una pantalla qué material está fuera y desde cuándo, sin preguntar a nadie.</dd>
  <dt>Qué NO es este problema</dt>
  <dd>No es gestionar existencias, ni comprar material, ni controlar el estado de conservación. Es saber quién tiene qué, ahora.</dd>
</dl>

La última casilla ahorra discusiones durante todo el curso: cada vez que alguien proponga una funcionalidad, se compara con ella.

<p class="stage stage--solo">Ahora tú</p>

<dl class="answer">
  <dt>Contexto</dt>
  <dd></dd>
  <dt>Qué falla, y por qué falla</dt>
  <dd></dd>
  <dt>Consecuencia concreta</dt>
  <dd></dd>
  <dt>A quién afecta, por roles</dt>
  <dd></dd>
  <dt>Qué se ha intentado ya y por qué se abandonó</dt>
  <dd></dd>
  <dt>Cómo sabríamos que ha mejorado</dt>
  <dd></dd>
  <dt>Qué NO es este problema</dt>
  <dd></dd>
</dl>

### Rol, usuario y parte interesada

Tres cosas distintas que suelen confundirse:

| Término | Qué es | Ejemplo en PrestaTaller |
| ------- | ------ | ----------------------- |
| **Rol** | Un tipo de uso con permisos propios | Responsable de taller, alumnado |
| **Usuario** | La persona concreta que ocupa un rol | Quien abre el taller los martes |
| **Parte interesada** | Alguien a quien le afecta, aunque no use el sistema | Jefatura de estudios, que pide el inventario a final de curso |

Las partes interesadas no aparecen en la aplicación, pero sí en los requisitos. Si jefatura necesita un listado a final de curso, eso es una funcionalidad, aunque quien la use no entre nunca en el sistema.

<div class="rule">
  <p class="rule-label">La regla de los roles</p>
  <p>Cada rol nuevo multiplica el trabajo: pantallas distintas, permisos distintos, pruebas distintas y una fuente más de errores de seguridad. Dos roles es lo razonable para un proyecto de este tamaño; tres es el máximo defendible; cuatro casi siempre significa que no se ha acotado.</p>
</div>

Un rol se justifica cuando **hace cosas distintas**, no cuando es gente distinta. Si el alumnado de primero y el de segundo hacen exactamente lo mismo, no son dos roles: son un rol con un campo «curso».

<p class="stage">Paso 1 · Te enseño uno</p>

<dl class="record">
  <dt>Rol</dt>
  <dd>Responsable de taller</dd>
  <dt>Qué necesita conseguir</dt>
  <dd>Saber en cualquier momento qué material está fuera y desde cuándo, y cerrar el trimestre sin perseguir a nadie</dd>
  <dt>Dónde y cómo lo usa</dt>
  <dd>En el ordenador del taller, sentado, una o dos veces al día y de forma intensiva al cerrar el trimestre</dd>
  <dt>Qué sabe de tecnología</dt>
  <dd>Uso habitual de ordenador; ninguna paciencia para procesos de más de tres pasos</dd>
  <dt>Qué le haría abandonarlo</dt>
  <dd>Que dar de alta el catálogo de herramienta le costara una tarde</dd>
</dl>

<dl class="record">
  <dt>Rol</dt>
  <dd>Alumnado</dd>
  <dt>Qué necesita conseguir</dt>
  <dd>Llevarse una herramienta y devolverla dejando constancia, sin que le cueste tiempo</dd>
  <dt>Dónde y cómo lo usa</dt>
  <dd>De pie, delante del armario, con prisa, a veces con las manos sucias, en un móvil o en una tablet fija</dd>
  <dt>Qué sabe de tecnología</dt>
  <dd>Alto, pero es irrelevante: el problema no es que no sepa, es que no quiere pararse</dd>
  <dt>Qué le haría abandonarlo</dt>
  <dd>Tener que iniciar sesión con usuario y contraseña cada vez</dd>
</dl>

<dl class="worked">
  <dt>Qué acaba de decidir esta ficha</dt>
  <dd>Mucho más de lo que parece. El contexto de uso del alumnado —de pie, con prisa, manos sucias— convierte la autenticación en el mayor riesgo del producto, no en un trámite.</dd>
  <dt>Consecuencia para el diseño</dt>
  <dd>El flujo de devolución tiene que funcionar sin escribir. Eso empujará el diseño hacia una identificación rápida, y esa decisión se tomará en la semana 7 sabiendo por qué.</dd>
  <dt>Consecuencia para la seguridad</dt>
  <dd>Y a la vez el responsable sí necesita autenticación real, porque puede ver y modificar los datos de todos. Dos roles, dos niveles de exigencia: eso es una decisión de arquitectura que nace aquí.</dd>
</dl>

La tabla de permisos es todavía un borrador —se cierra en la semana 11 al diseñar la API—, pero conviene tenerla ya, porque obliga a pensar en lo que **no** puede hacer cada rol:

| Acción | Responsable | Alumnado |
| ------ | ----------- | -------- |
| Ver qué está prestado ahora | Sí | Solo lo suyo |
| Registrar un préstamo | Sí | Sí |
| Registrar una devolución | Sí | Sí |
| Dar de alta herramienta nueva | Sí | No |
| Ver el histórico completo | Sí | No |
| Forzar la devolución de un préstamo ajeno | Sí | No |

La fila más interesante es la primera. «Solo lo suyo» no es un detalle de interfaz: es una regla de autorización que en la semana 15 habrá que implementar y en la 21 habrá que probar. Escribirla ahora evita descubrirla tarde.

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Listad los roles. Si salen más de tres, justificad cada uno o fusionadlos.</li>
  <li>Escribid la ficha completa de cada rol, con contexto de uso real.</li>
  <li>Listad las partes interesadas que no usan el sistema pero condicionan requisitos.</li>
  <li>Construid la tabla de permisos, incluyendo al menos una fila con un «solo lo suyo».</li>
</ol>

### La propuesta de valor

<div class="compare-pair">
  <div>
    <p class="compare-label">Propuesta inútil</p>
    <p class="compare-body">«Una plataforma moderna e intuitiva que digitaliza y optimiza la gestión, mejorando la eficiencia.»</p>
  </div>
  <div>
    <p class="compare-label">Por qué es inútil</p>
    <p class="compare-body">Sirve igual para un taller, una peluquería o una protectora. Si vale para todo, no describe nada.</p>
  </div>
</div>

Esa es la prueba, y es implacable: **si vuestra propuesta de valor se puede copiar y pegar en el proyecto de otro equipo sin cambiar nada, está mal escrita**.

Antes de redactar la frase, escribid las dos columnas. La propuesta sale de la diferencia entre ellas, no de la imaginación:

| | Antes (hoy) | Después (con el producto) |
| --- | --- | --- |
| Registrar un préstamo | Escribir nombre y herramienta en una hoja de papel | Dos toques en la tablet del armario |
| Registrar la devolución | Buscar la línea propia y tacharla; casi nadie lo hace | Un toque sobre lo que se tiene prestado |
| Saber qué falta | Preguntar grupo por grupo durante días | Una pantalla, en cualquier momento |
| Cerrar el trimestre | Dos tardes de búsqueda, y material que no aparece | Una lista de lo que sigue fuera y desde cuándo |

Ninguna fila dice «más moderno» ni «más eficiente». Todas dicen qué hace una persona concreta, antes y después.

<div class="prompt">
  <p class="prompt-label">Plantilla de la frase</p>
  <ol>
    <li>Para <em>[rol concreto]</em></li>
    <li>que hoy <em>[qué hace y qué le cuesta]</em>,</li>
    <li><em>[nombre]</em> es <em>[qué tipo de producto]</em></li>
    <li>que <em>[qué le permite hacer que antes no podía]</em>.</li>
    <li>A diferencia de <em>[la alternativa real]</em>,</li>
    <li><em>[en qué se distingue, en términos de esfuerzo o de resultado]</em>.</li>
  </ol>
</div>

<dl class="worked">
  <dt>Aplicada a PrestaTaller</dt>
  <dd>«Para el responsable de un taller de FP, que hoy anota los préstamos en una hoja de papel y pierde dos tardes por trimestre persiguiendo material, PrestaTaller es un registro de préstamo y devolución pensado para usarse de pie y con prisa, que permite saber en cualquier momento qué está fuera y desde cuándo. A diferencia de un gestor de inventario, no exige dar de alta proveedores ni costes: solo herramienta, persona y fecha.»</dd>
  <dt>Por qué funciona</dt>
  <dd>Porque cada hueco está relleno con algo comprobable, y porque la última parte reconoce que existe una alternativa y dice exactamente en qué se aparta de ella.</dd>
  <dt>La prueba de los treinta segundos</dt>
  <dd>Se lee en voz alta y se cronometra. Si no cabe, sobra algo. Si al leerla alguien pregunta «¿y eso para qué?», falta el antes.</dd>
</dl>

<p class="stage stage--guided">Lo hacemos juntos</p>

Escribid la frase con la plantilla y después **decídsela en voz alta a otro equipo**, sin enseñarles nada más. Ellos rellenan esto:

<dl class="answer">
  <dt>¿Quién es la persona que tiene el problema, y qué le pasa hoy?</dt>
  <dd></dd>
  <dt>¿Qué podrá hacer que ahora no puede?</dt>
  <dd></dd>
  <dt>¿Qué otra cosa existe, y en qué se diferencia esta?</dt>
  <dd></dd>
</dl>

Si el otro equipo no puede contestar después de oírla una vez, la frase no está terminada. No la defendáis: reescribidla.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 4</p>
  <ul class="checklist">
    <li>El enunciado está escrito con las siete casillas, incluida «qué NO es este problema».</li>
    <li>Cada rol está justificado porque hace cosas distintas, y su ficha describe dónde y cómo se usa.</li>
    <li>La tabla de permisos existe y contiene al menos una restricción real.</li>
    <li>La propuesta de valor no se puede copiar en otro proyecto y otro equipo la ha entendido a la primera.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Dónde hay que parar la cadena de porqués?</li>
    <li>¿Cuándo dos grupos de personas son un solo rol?</li>
    <li>Poner que alguien «solo ve lo suyo», ¿es diseño de interfaz o de seguridad?</li>
    <li>¿De dónde sale la propuesta de valor?</li>
    <li>¿Para qué sirve la casilla «qué NO es este problema»?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · En el primer punto sobre el que podéis actuar.</p>
  <p>2 · Cuando hacen exactamente lo mismo; entonces la diferencia es un campo, no un rol.</p>
  <p>3 · De seguridad. La interfaz puede ocultarlo, pero la restricción tiene que estar en el servidor.</p>
  <p>4 · De la diferencia entre lo que alguien hace hoy y lo que hará con el producto.</p>
  <p>5 · Para poder rechazar funcionalidades comparándolas con ella, sin discutir cada vez.</p>
</details>

---

## Sesión 5 · De las necesidades a los requisitos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> El formato de historia de usuario, la diferencia entre historia y requisito, y por qué un requisito no funcional solo cuenta si se puede medir.</li>
    <li><strong>2. Haz:</strong> Escribe el catálogo de historias, conviértelo en requisitos numerados con sus reglas de negocio, y redacta los requisitos no funcionales con umbral.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el checkpoint de la sesión 5.</li>
  </ol>
</div>

### Por qué no basta con una lista de pantallas

Un catálogo escrito como «pantalla de login, pantalla de listado, pantalla de alta» describe la solución antes que la necesidad, y hace imposible decidir qué se queda fuera: todas las pantallas parecen igual de necesarias.

El formato de historia de usuario evita eso porque obliga a decir para qué sirve cada cosa:

<p class="term">Como [rol], quiero [acción] para [beneficio]</p>

La tercera parte es la que casi todo el mundo rellena mal, y es la única que sirve para descartar. Si el beneficio es «para poder usar la aplicación», la historia no aporta nada.

<div class="compare-pair">
  <div>
    <p class="compare-label">Error 1 · Tarea técnica disfrazada</p>
    <p class="compare-body">«Como desarrollador, quiero configurar la base de datos para poder guardar datos.» El usuario no es un rol del producto: eso es una tarea del backlog técnico.</p>
  </div>
  <div>
    <p class="compare-label">Error 2 · Beneficio circular</p>
    <p class="compare-body">«Como alumno, quiero iniciar sesión para poder acceder al sistema.» El beneficio repite la acción. Habría que preguntarse por qué hace falta iniciar sesión aquí.</p>
  </div>
</div>

El tercer error es de tamaño: **la historia épica**. «Como responsable, quiero gestionar el taller» no es una historia, es el proyecto entero. Si no cabe en unos días de trabajo, hay que partirla.

<p class="stage">Paso 1 · Te enseño uno</p>

Diecisiete historias de PrestaTaller. Fijaos en la columna del beneficio: es la que va a decidir el corte de la semana 6.

| # | Historia | Rol |
| --- | -------- | --- |
| H1 | Como responsable, quiero dar de alta una herramienta con su código para poder prestarla | Responsable |
| H2 | Como responsable, quiero ver el catálogo de herramienta para saber qué existe | Responsable |
| H3 | Como responsable, quiero marcar una herramienta como no disponible para que nadie intente llevársela | Responsable |
| H4 | Como alumno, quiero identificarme rápido en la tablet para no perder tiempo delante del armario | Alumnado |
| H5 | Como alumno, quiero registrar que me llevo una herramienta para que quede constancia sin escribir nada | Alumnado |
| H6 | Como alumno, quiero ver qué tengo prestado para saber qué me falta por devolver | Alumnado |
| H7 | Como alumno, quiero registrar la devolución en un toque para que no me cueste más que no hacerlo | Alumnado |
| H8 | Como responsable, quiero ver qué está fuera ahora mismo para saber de qué material no dispongo | Responsable |
| H9 | Como responsable, quiero ver desde cuándo está fuera cada cosa para detectar lo que lleva demasiado tiempo | Responsable |
| H10 | Como responsable, quiero registrar una devolución en nombre de otra persona para poder cerrar préstamos olvidados | Responsable |
| H11 | Como responsable, quiero consultar el histórico de una herramienta para saber quién la tuvo antes | Responsable |
| H12 | Como responsable, quiero exportar lo que sigue fuera al cerrar el trimestre para reclamarlo sin preguntar grupo por grupo | Responsable |
| H13 | Como responsable, quiero dar de alta al alumnado de un grupo para que puedan usar el sistema | Responsable |
| H14 | Como alumno, quiero que me avise si intento llevarme algo que ya tengo prestado para no duplicar el registro | Alumnado |
| H15 | Como responsable, quiero anotar que una herramienta ha vuelto en mal estado para dejar constancia | Responsable |
| H16 | Como responsable, quiero ver quién tiene más material fuera para saber a quién dirigirme primero | Responsable |
| H17 | Como responsable, quiero acceder desde casa para preparar el cierre sin estar en el taller | Responsable |

<dl class="worked">
  <dt>Qué se ve al leer la lista entera</dt>
  <dd>Que hay un núcleo —H4 a H9— que ya resuelve el problema enunciado en la sesión 4, y un anillo alrededor que lo mejora pero no lo resuelve.</dd>
  <dt>Una historia que parece esencial y no lo es</dt>
  <dd>H13, dar de alta al alumnado. Es imprescindible para que el sistema funcione, sí, pero en la primera versión puede hacerse cargando una lista, sin pantalla. La necesidad es real; la <em>funcionalidad</em> no.</dd>
  <dt>Una historia barata y decisiva</dt>
  <dd>H14, avisar de un préstamo duplicado. Cuesta poco y evita el error más frecuente del flujo real: alguien que no recuerda si llegó a apuntarlo.</dd>
</dl>

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Escribid entre doce y dieciocho historias. Menos de doce suele significar que no habéis pensado en los casos incómodos; más de dieciocho, que estáis diseñando la versión 3.0.</li>
  <li>Comprobad una por una que el beneficio no repite la acción.</li>
  <li>Marcad las épicas y partidlas.</li>
  <li>Comprobad que cada rol de la sesión 4 aparece al menos en dos historias. Si un rol no aparece, o sobra el rol o faltan historias.</li>
</ol>

### Historia y requisito no son lo mismo

Una historia dice qué quiere alguien y por qué. Un requisito dice qué tiene que hacer el sistema, de forma que se pueda comprobar si lo hace o no.

<div class="compare-pair">
  <div>
    <p class="compare-label">Historia</p>
    <p class="compare-body">«Como alumno, quiero registrar la devolución en un toque para que no me cueste más que no hacerlo.»</p>
  </div>
  <div>
    <p class="compare-label">Requisito</p>
    <p class="compare-body">«RF-07 · El sistema registrará la devolución de un préstamo activo guardando la fecha y hora, y dejará la herramienta disponible.»</p>
  </div>
</div>

<div class="rule">
  <p class="rule-label">Cuatro reglas de redacción</p>
  <p>Uno. Sujeto siempre el sistema, en futuro: «el sistema registrará…». Dos. Un requisito, un comportamiento: en cuanto aparece una «y» que une dos cosas distintas, son dos requisitos. Tres. Nada de adjetivos de opinión: «rápido», «sencillo» o «amigable» no se pueden comprobar. Cuatro. Numerados y estables: RF-07 seguirá siendo RF-07 en junio, aunque se borren los anteriores.</p>
</div>

La numeración estable parece un detalle burocrático y es lo que permite que en la semana 21 un test diga «cubre RF-07» y que en la defensa podáis ir a la línea exacta.

De una historia pueden salir varios requisitos. Y hay requisitos que no salen de ninguna historia: salen de las reglas del negocio, que son los que nadie pide porque a nadie se le ocurre pedirlos, y los que hunden las demos.

<figure class="diagram">
  <figcaption>Qué debe impedir el sistema</figcaption>
  <ol class="flow">
    <li>Que se preste algo que ya está prestado</li>
    <li>Que se devuelva algo que no estaba prestado</li>
    <li>Que se preste una herramienta marcada como no disponible</li>
    <li>Que alguien cierre un préstamo que no es suyo, si no es el responsable</li>
    <li>Que se borre una herramienta que tiene préstamos en el histórico</li>
  </ol>
</figure>

La última es la que más se olvida y la que más problemas da en la base de datos, porque obliga a decidir ahora si un borrado es real o lógico. Esa decisión se ejecuta en la semana 9, pero nace aquí.

<p class="stage">Paso 1 · Te enseño uno</p>

| Id | Requisito | De |
| --- | --------- | --- |
| RF-01 | El sistema permitirá al responsable dar de alta una herramienta con código único, nombre y estado | H1 |
| RF-02 | El sistema rechazará el alta de una herramienta cuyo código ya exista | Regla |
| RF-03 | El sistema mostrará el catálogo de herramienta con su disponibilidad actual | H2 |
| RF-04 | El sistema permitirá identificarse al alumnado mediante su código personal | H4 |
| RF-05 | El sistema registrará un préstamo asociando herramienta, persona y fecha y hora | H5 |
| RF-06 | El sistema impedirá prestar una herramienta que ya esté prestada o marcada como no disponible | Regla |
| RF-07 | El sistema registrará la devolución de un préstamo activo guardando la fecha y hora, y dejará la herramienta disponible | H7 |
| RF-08 | El sistema impedirá registrar la devolución de un préstamo que no esté activo | Regla |
| RF-09 | El sistema mostrará a cada persona los préstamos que tiene activos | H6 |
| RF-10 | El sistema mostrará al responsable todos los préstamos activos, con la fecha en que se realizaron | H8, H9 |
| RF-11 | El sistema permitirá al responsable registrar la devolución de un préstamo de cualquier persona | H10 |
| RF-12 | El sistema impedirá a quien no sea responsable consultar o cerrar préstamos ajenos | Regla, permisos |
| RF-13 | El sistema conservará el histórico de préstamos cerrados y no permitirá eliminarlos | Regla |

<dl class="worked">
  <dt>Fijaos en RF-02, RF-06, RF-08, RF-12 y RF-13</dt>
  <dd>Cinco de trece requisitos no vienen de ninguna historia: vienen de las reglas. Es una proporción normal, y explica por qué un producto siempre resulta más grande de lo que sugiere la lista de funcionalidades.</dd>
  <dt>Fijaos en RF-12</dt>
  <dd>Nace directamente de la fila «solo lo suyo» de la tabla de permisos de la sesión 4. Ese es el aspecto que tiene la trazabilidad cuando funciona: una decisión de la semana 4 aparece como requisito en la 5, como endpoint protegido en la 11 y como test en la 21.</dd>
  <dt>Fijaos en lo que NO está</dt>
  <dd>No hay ningún requisito sobre exportar, sobre estado de conservación ni sobre acceso remoto. Existen como historias (H12, H15, H17) y todavía no como requisitos, porque aún no se ha decidido si entran. Eso se decide la semana que viene.</dd>
</dl>

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Convertid vuestras historias en requisitos, aplicando las cuatro reglas de redacción.</li>
  <li>Añadid las reglas de negocio: al menos cuatro cosas que el sistema debe <em>impedir</em>.</li>
  <li>Anotad de dónde viene cada requisito, como en la columna «De».</li>
  <li>Revisad que ninguno contenga una «y» que esconda dos comportamientos.</li>
</ol>

### Lo que el sistema tiene que ser

<p class="term">Requisito no funcional</p>

Una condición sobre cómo se comporta el sistema —velocidad, accesibilidad, seguridad, disponibilidad— en lugar de sobre qué hace. Se escribe con un umbral concreto y con la forma de comprobarlo, o no cuenta.

Son los requisitos que más se descuidan y los que deciden si el producto se usa. En PrestaTaller, la conversación de la semana 2 dejó claro que el intento anterior no fracasó por falta de funcionalidades: fracasó por fricción. Eso es un requisito no funcional.

Revisad las siete categorías, aunque en muchas no tengáis nada que decir. Lo importante es no saltárselas sin mirar:

| Categoría | La pregunta | Dónde se estudia |
| --------- | ----------- | ---------------- |
| **Rendimiento** | ¿Cuánto puede tardar cada operación? | Entorno Servidor · Sostenibilidad |
| **Accesibilidad** | ¿Puede usarlo alguien que no ve o no usa ratón? | Diseño de Interfaces · Sostenibilidad |
| **Seguridad** | ¿Qué protegemos y de quién? | Entorno Servidor |
| **Usabilidad** | ¿Cuánto esfuerzo cuesta la acción más frecuente? | Diseño de Interfaces |
| **Disponibilidad** | ¿Qué pasa si el servicio no responde? | Despliegue |
| **Mantenibilidad** | ¿Puede otra persona entenderlo y cambiarlo? | Este módulo · semana 21 |
| **Legal y datos** | ¿Qué datos personales hay y qué obligaciones traen? | Este módulo · Digitalización |

<div class="compare-pair">
  <div>
    <p class="compare-label">No es un requisito</p>
    <p class="compare-body">«La aplicación tiene que ser accesible.»</p>
  </div>
  <div>
    <p class="compare-label">Sí lo es</p>
    <p class="compare-body">«RNF-03 · Todos los formularios y flujos del MVP serán operables solo con teclado y superarán el nivel AA de las WCAG 2.2 en la auditoría automática y en la revisión manual de foco y contraste.»</p>
  </div>
</div>

La diferencia práctica es que el segundo se puede comprobar en la semana 21 y el primero no, así que el primero nunca se comprueba y nunca se cumple.

<p class="stage">Paso 1 · Te enseño uno</p>

| Id | Requisito | Cómo se comprueba |
| --- | --------- | ----------------- |
| RNF-01 | Registrar un préstamo o una devolución no exigirá más de tres interacciones desde la pantalla inicial | Recorrido cronometrado con cinco personas |
| RNF-02 | Ninguna operación de registro tardará más de un segundo en confirmar en la red del centro | Medición en el entorno desplegado |
| RNF-03 | Los flujos del MVP serán operables solo con teclado y cumplirán WCAG 2.2 nivel AA | Auditoría automática más revisión manual de foco y contraste |
| RNF-04 | Las contraseñas del personal responsable se almacenarán con función de hash con sal | Revisión de código y de base de datos |
| RNF-05 | Ningún endpoint devolverá datos de préstamos ajenos a quien no sea responsable | Test automático de autorización por rol |
| RNF-06 | La interfaz será utilizable en la tablet del taller, con objetivos táctiles cómodos para manos con guantes | Prueba en el dispositivo real |
| RNF-07 | El sistema no almacenará más datos personales que nombre, grupo y código de identificación | Revisión del modelo de datos |
| RNF-08 | Cualquier persona del equipo podrá levantar el proyecto en local siguiendo solo el README | Prueba con alguien que no lo haya levantado antes |

<dl class="worked">
  <dt>RNF-01 es el requisito más importante del proyecto</dt>
  <dd>Y no es funcional. Sale directamente del fracaso del intento anterior. Si se incumple, el producto puede tener todas las funcionalidades y no lo usará nadie.</dd>
  <dt>RNF-06 solo pudo escribirse por haber ido al taller</dt>
  <dd>Nadie escribe «guantes» desde el aula de informática. Este es el pago del trabajo de campo de la semana 2.</dd>
  <dt>RNF-07 es una decisión, no una descripción</dt>
  <dd>Recoger menos datos es una elección deliberada: menos datos personales significa menos obligaciones y menos riesgo. Se escribe como requisito para que nadie amplíe el modelo sin darse cuenta.</dd>
  <dt>RNF-08 parece menor y decide la nota</dt>
  <dd>Es lo que en la semana 25 separa un repositorio presentable de uno que solo funciona en un portátil.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Dónde deja de ser una elección técnica</p>
  <p>Si vuestro proyecto trata datos personales —y casi todos lo hacen—, la minimización no es una buena práctica opcional: es un principio del RGPD. Recoged solo lo que necesitáis para el fin declarado, decid para qué lo usáis y no lo conservéis indefinidamente. En este módulo, además, todos los datos con los que trabajaréis serán inventados.</p>
</div>

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Al menos un requisito no funcional por categoría, o la justificación escrita de por qué esa categoría no aplica.</li>
  <li>Cada uno con umbral concreto y forma de comprobarlo.</li>
  <li>Señalad cuál es el más crítico: el que, si se incumple, deja el producto sin usar.</li>
  <li>Comprobad que ninguno contiene «rápido», «sencillo», «seguro» o «intuitivo» a secas.</li>
</ol>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 5</p>
  <ul class="checklist">
    <li>Todas las historias tienen rol, acción y beneficio, y el beneficio dice algo.</li>
    <li>Los requisitos están numerados de forma estable, trazados a su origen y se responden con sí o no.</li>
    <li>Hay al menos cuatro reglas de negocio que expresan una prohibición.</li>
    <li>Las siete categorías de requisitos no funcionales están revisadas, con umbral o con justificación.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué parte de la historia sirve para decidir si se queda fuera?</li>
    <li>¿De dónde salen los requisitos que no vienen de ninguna historia?</li>
    <li>¿Por qué la numeración tiene que ser estable?</li>
    <li>¿Qué le falta a «la aplicación tiene que ser accesible» para ser un requisito?</li>
    <li>¿Qué principio del RGPD hay detrás de recoger menos datos?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El beneficio: si no aporta nada, la historia se puede descartar.</p>
  <p>2 · De las reglas de negocio: lo que el sistema debe impedir aunque nadie lo haya pedido.</p>
  <p>3 · Para poder referenciarlos desde los tests, la documentación y la defensa sin que cambien de significado.</p>
  <p>4 · Un umbral concreto y una forma de comprobarlo.</p>
  <p>5 · La minimización de datos: recoger solo lo necesario para el fin declarado.</p>
</details>

---

## Sesión 6 · Acotar y cerrar el alcance

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es de verdad un MVP y por qué se corta en vertical, por qué la lista de exclusiones es un apartado y no una conversación, y cómo se escribe un criterio de aceptación.</li>
    <li><strong>2. Haz:</strong> Corta el catálogo en tres anillos, escribe las exclusiones y los criterios de aceptación, y pasa la revisión cruzada con otro equipo.</li>
    <li><strong>3. Comprueba:</strong> Entrega la especificación v1.0 y revisa la evaluación.</li>
  </ol>
</div>

### Mínimo y viable

Las dos palabras tiran en direcciones opuestas, y ahí está la dificultad.

<p class="term">MVP</p>

La versión más pequeña que resuelve de principio a fin el problema de alguien. Mínima porque no hace nada que no sea imprescindible; viable porque, aun así, alguien la usaría de verdad.

Un MVP no es «la primera mitad del proyecto». Ni «el proyecto sin los adornos». Es un producto completo y pequeño.

<div class="compare-pair">
  <div>
    <p class="compare-label">Corte horizontal · mal</p>
    <p class="compare-body">«En la primera versión hacemos toda la base de datos y toda la API; el frontend en la segunda.» Al terminar no hay nada que enseñar ni nada que nadie pueda usar.</p>
  </div>
  <div>
    <p class="compare-label">Corte vertical · bien</p>
    <p class="compare-body">«En la primera versión, prestar y devolver funciona de punta a punta: pantalla, API, base de datos y despliegue.» Al terminar hay algo que alguien puede probar.</p>
  </div>
</div>

<figure class="diagram">
  <figcaption>Qué atraviesa un corte vertical</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Pantalla</li>
    <li>Petición</li>
    <li>Lógica</li>
    <li>Datos</li>
    <li>Respuesta</li>
    <li>Desplegado</li>
  </ol>
</figure>

Esta es una de las decisiones con más peso del módulo, porque determina si en la semana 18 tendréis algo que enseñar o solo capas a medio hacer.

Para cada historia, una sola pregunta:

> **Si esto no está, ¿el problema de la sesión 4 sigue sin resolverse?**

Si la respuesta es sí, entra. Si es no, va a un anillo exterior. La pregunta es deliberadamente dura: no pregunta si la historia es útil, sino si sin ella el producto deja de resolver el problema.

<p class="stage">Paso 1 · Te enseño uno</p>

| Anillo | Historias | Por qué |
| ------ | --------- | ------- |
| **MVP** | H1, H4, H5, H6, H7, H8, H9, H14 | Identificarse, prestar, devolver, ver lo propio, ver lo que está fuera y desde cuándo. Sin cualquiera de estas, el responsable sigue sin saber quién tiene qué |
| **Versión 2** | H2, H3, H10, H12, H16 | Mejoran mucho el trabajo del responsable, sobre todo en el cierre de trimestre, pero el problema ya está resuelto sin ellas |
| **Fuera** | H11, H13, H15, H17 | Histórico por herramienta, alta de grupos, estado de conservación y acceso remoto: son otro problema o se resuelven de otra forma |

<dl class="worked">
  <dt>Por qué H14 está en el MVP siendo una historia menor</dt>
  <dd>Porque evita el error más frecuente del flujo real. Es barata y protege el dato: sin ella, el registro se llena de préstamos duplicados y la pantalla de H8 deja de ser fiable. Y una pantalla en la que no se confía no se mira.</dd>
  <dt>Por qué H12, exportar, no está en el MVP</dt>
  <dd>Porque el problema es saber qué está fuera, y eso ya lo da H8 en pantalla. Exportar hace el cierre más cómodo; no lo hace posible.</dd>
  <dt>Por qué H13, dar de alta al alumnado, se queda fuera</dt>
  <dd>Porque la necesidad se cubre cargando una lista inicial. Construir una pantalla de gestión de personas costaría casi tanto como el resto del MVP y no resuelve nada del problema enunciado.</dd>
  <dt>El MVP en una frase</dt>
  <dd>«Una pantalla en el armario del taller donde el alumnado registra en dos toques que se lleva o devuelve una herramienta, y una pantalla donde el responsable ve qué está fuera y desde cuándo.»</dd>
  <dt>La prueba de la frase</dt>
  <dd>Cabe en una respiración y no contiene ninguna «y además». Cuando un MVP necesita tres frases, todavía no es mínimo.</dd>
</dl>

<p class="stage stage--guided">Lo hacemos juntos</p>

Pasad vuestras historias una a una por la prueba de entrada. En voz alta, y con alguien anotando. La discusión es el ejercicio.

<dl class="answer">
  <dt>MVP · historias que entran</dt>
  <dd></dd>
  <dt>Versión 2 · útiles, pero el problema ya está resuelto sin ellas</dt>
  <dd></dd>
  <dt>Fuera · otro problema, u otra forma de resolverlo</dt>
  <dd></dd>
  <dt>El MVP en una frase</dt>
  <dd></dd>
</dl>

<div class="rule">
  <p class="rule-label">Señal de alarma</p>
  <p>Si vuestro MVP se queda con más de diez historias, volved a pasarlas por la prueba de entrada: casi siempre hay tres o cuatro que están ahí porque apetece hacerlas, no porque el problema las necesite. Es más fácil añadir en la semana 19 que recortar en marzo.</p>
</div>

### El apartado que os va a salvar

Todo proyecto sufre presión para crecer. Viene de fuera —«¿y no podríais hacer también…?»— y sobre todo de dentro, que es peor, porque desde dentro suena a ambición.

<p class="term">Lista de exclusiones</p>

El apartado de la especificación que enumera lo que el producto no va a hacer, con el motivo de cada exclusión. Se escribe una vez, se enseña cuando hace falta y evita volver a discutir lo mismo.

Su valor real no es organizativo, es defensivo: en la semana 26, la pregunta «¿por qué no habéis hecho X?» tiene dos respuestas posibles. «No nos dio tiempo» y «lo dejamos fuera en octubre por este motivo». La segunda es una decisión; la primera es un fallo.

| Tipo | Qué significa | Ejemplo en PrestaTaller |
| ---- | ------------- | ----------------------- |
| **Fuera de alcance** | No pertenece a este problema, por buena que sea la idea | Compras y presupuesto del taller |
| **Más adelante** | Pertenece, pero no cabe ahora; tiene sitio en la versión 2 | Exportar el listado de cierre |
| **Descartado** | Se estudió y se decidió que no, con motivo | Aplicación móvil nativa |

Distinguirlos importa porque significan cosas distintas en la defensa. «Fuera de alcance» demuestra que sabéis dónde termina vuestro problema. «Más adelante», que sabéis priorizar. «Descartado», que evaluasteis una alternativa y decidisteis.

<p class="stage">Paso 1 · Te enseño uno</p>

| Qué queda fuera | Tipo | Motivo |
| --------------- | ---- | ------ |
| Gestión de compras, proveedores y costes | Fuera de alcance | El problema es saber quién tiene qué, no gestionar existencias |
| Control del estado de conservación del material | Fuera de alcance | Es un proceso distinto, con otro responsable y otro momento |
| Aplicación móvil nativa | Descartado | Una web responsive cubre el uso en la tablet del armario; una app nativa añadiría publicación en tiendas y no aporta nada al problema |
| Avisos automáticos al alumnado | Descartado | Requiere datos de contacto que hemos decidido no almacenar en RNF-07, y el momento de dolor es el cierre, no el día a día |
| Exportar el listado de cierre | Más adelante | Cómodo, pero H8 ya resuelve el problema en pantalla |
| Histórico consultable por herramienta | Más adelante | Los datos se guardan desde el principio (RF-13); solo falta la pantalla |
| Integración con los sistemas del centro | Descartado | No tenemos acceso ni permiso, y sería una dependencia externa fuera de nuestro control |
| Lector de código de barras | Más adelante | Encajaría muy bien con RNF-01, pero exige hardware del que no disponemos para probar |

<dl class="worked">
  <dt>Fijaos en la fila de los avisos automáticos</dt>
  <dd>El motivo enlaza con un requisito no funcional escrito la semana pasada. Cuando las exclusiones se apoyan en decisiones previas, el documento entero se sostiene solo.</dd>
  <dt>Fijaos en la fila del histórico</dt>
  <dd>Dice algo importante: los datos sí se guardan, solo falta la pantalla. Esa distinción entre «no lo guardamos» y «no lo mostramos todavía» es una decisión de diseño de datos que la semana 9 agradecerá.</dd>
  <dt>Fijaos en la del lector de código</dt>
  <dd>Es una exclusión honesta: la idea es buena, el motivo no es que sea mala sino que no podríamos probarla. Reconocerlo vale más que inventar un motivo elegante.</dd>
</dl>

Escribid ahora el procedimiento para añadir cosas, mientras nadie está presionando. Es mucho más difícil acordarlo en marzo:

<figure class="diagram">
  <figcaption>Qué pasa cuando alguien propone algo nuevo</figcaption>
  <ol class="flow">
    <li>Se escribe como historia, con su beneficio</li>
    <li>Se pasa por la prueba de entrada</li>
    <li>Si entra, algo del mismo tamaño tiene que salir</li>
    <li>El cambio se anota en el registro de decisiones, con fecha</li>
  </ol>
</figure>

La tercera regla es la que de verdad protege el proyecto. **Nada entra gratis.** Sin ella, la lista de exclusiones se convierte en un adorno en tres semanas.

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Al menos ocho exclusiones, con tipo y motivo, y al menos una de cada tipo.</li>
  <li>Al menos una tiene que ser algo que os apetecía hacer. Si todas son cosas que no os interesaban, no habéis renunciado a nada.</li>
  <li>El procedimiento de cambio, escrito y aceptado por todo el equipo.</li>
</ol>

### Terminado significa qué

«Ya está la pantalla de préstamo» es una frase que en un equipo puede significar cinco cosas distintas. El criterio de aceptación acaba con eso:

<p class="term">Criterio de aceptación</p>

La condición comprobable que permite decir que una historia está terminada. Se escribe antes de programarla, no después, y quien lo comprueba no necesita saber cómo está hecha por dentro.

<div class="prompt">
  <p class="prompt-label">Dado – Cuando – Entonces</p>
  <ol>
    <li><strong>Dado</strong> el estado de partida</li>
    <li><strong>Cuando</strong> ocurre la acción</li>
    <li><strong>Entonces</strong> el resultado observable</li>
  </ol>
</div>

Tres reglas al escribirlo. El «dado» describe datos, no pantallas. El «cuando» es una sola acción. El «entonces» tiene que poder observarse desde fuera: si para comprobarlo hay que mirar el código, está mal escrito.

Una historia con un solo criterio está sin terminar, porque solo cubre el caso en que todo va bien. El trabajo de verdad está en los otros:

<figure class="diagram">
  <figcaption>Qué hay que cubrir en cada historia</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Camino feliz</span>Todo va bien y ocurre lo esperado</li>
    <li><span class="flow-role">Camino de error</span>Los datos no valen o la acción no está permitida</li>
    <li><span class="flow-role">Caso límite</span>Vacío, repetido, simultáneo, muy grande, muy antiguo</li>
    <li><span class="flow-role">Autorización</span>Lo intenta alguien que no debería poder</li>
  </ol>
</figure>

<p class="stage">Paso 1 · Te enseño uno</p>

Historia **H5** · Como alumno, quiero registrar que me llevo una herramienta para que quede constancia sin escribir nada.

<dl class="worked">
  <dt>CA-1 · Camino feliz</dt>
  <dd><strong>Dado</strong> que la herramienta T-014 está disponible y estoy identificado como alumno, <strong>cuando</strong> registro su préstamo, <strong>entonces</strong> aparece en mi lista de préstamos activos y deja de estar disponible en el catálogo.</dd>
  <dt>CA-2 · Camino de error</dt>
  <dd><strong>Dado</strong> que la herramienta T-014 ya está prestada a otra persona, <strong>cuando</strong> intento registrar su préstamo, <strong>entonces</strong> el sistema lo rechaza, me dice que ya está prestada y no crea ningún registro.</dd>
  <dt>CA-3 · Caso límite</dt>
  <dd><strong>Dado</strong> que ya tengo prestada la herramienta T-014, <strong>cuando</strong> intento registrar su préstamo otra vez, <strong>entonces</strong> el sistema me avisa de que ya la tengo y no crea un segundo registro.</dd>
  <dt>CA-4 · Autorización</dt>
  <dd><strong>Dado</strong> que no estoy identificado, <strong>cuando</strong> intento registrar un préstamo, <strong>entonces</strong> el sistema no lo permite y no queda ningún registro asociado a nadie.</dd>
  <dt>Qué acaban de revelar estos cuatro</dt>
  <dd>Que hacía falta el requisito RF-06, que ya estaba, pero también algo que no estaba: qué mensaje concreto ve la persona. CA-2 y CA-3 son errores distintos y merecen respuestas distintas, y eso condiciona el diseño de la semana 7 y el contrato de la API de la semana 11.</dd>
  <dt>Y una pregunta que ha aparecido sola</dt>
  <dd>¿Puede alguien tener prestadas dos unidades de la misma herramienta? En PrestaTaller cada unidad tiene código propio, así que no. Pero esa pregunta no se le había ocurrido a nadie hasta escribir CA-3, y afecta directamente al modelo de datos de la semana 9.</dd>
</dl>

Ese último punto es la razón de este apartado. **Los criterios de aceptación no comprueban la especificación: la terminan de escribir.**

<p class="stage stage--solo">Ahora tú</p>

<ol class="fill-in">
  <li>Cada historia del MVP con al menos un criterio de camino feliz y uno de error.</li>
  <li>Las historias que tocan permisos, con su criterio de autorización.</li>
  <li>Una lista aparte con las preguntas que han aparecido y no tienen respuesta todavía.</li>
  <li>Cada criterio trazado a su requisito: CA-1 de H5 cubre RF-05, y así con todos.</li>
</ol>

### La cadena tiene que aguantar entera

Durante tres semanas habéis producido siete piezas. Ahora hay que comprobar que encajan:

<figure class="diagram">
  <figcaption>La cadena de trazabilidad</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Problema</li>
    <li>Roles</li>
    <li>Valor</li>
    <li>Historias</li>
    <li>Requisitos</li>
    <li>MVP</li>
    <li>Criterios</li>
  </ol>
</figure>

Una especificación es coherente cuando se puede recorrer en los dos sentidos: desde el problema hasta cualquier criterio, y desde cualquier criterio de vuelta al problema. Si un eslabón no lleva a ninguna parte, sobra o falta algo.

Haced las comprobaciones en orden y anotad cada fallo. Es normal encontrar entre cinco y diez: **si no encontráis ninguno, es que no habéis revisado, habéis releído**.

| # | Comprobación | Qué indica un fallo |
| --- | ------------ | ------------------- |
| 1 | Cada rol de la sesión 4 aparece en alguna historia | Sobra un rol, o falta cubrir una necesidad |
| 2 | Cada historia del MVP tiene al menos un requisito | La historia no está definida, solo enunciada |
| 3 | Cada requisito viene de una historia o de una regla | Requisito huérfano: alguien lo añadió sin justificarlo |
| 4 | Cada historia del MVP tiene criterios de aceptación | No sabréis cuándo está terminada |
| 5 | Cada fila de la tabla de permisos tiene su requisito | Un agujero de autorización que aparecerá en la semana 15 |
| 6 | Nada del MVP contradice una exclusión | El alcance ha crecido sin que nadie lo note |
| 7 | El MVP resuelve el problema de la sesión 4, completo | Falta algo esencial, o el problema estaba mal enunciado |

La séptima es la única que importa de verdad. Las otras seis son mecánicas; esta exige leer el enunciado del problema en voz alta y preguntarse honestamente si el MVP lo resuelve.

<p class="stage stage--guided">Lo hacemos juntos</p>

Intercambiad la especificación completa con otro equipo. Cada equipo lee la del otro **sin que se la expliquen** y responde por escrito:

<ol class="fill-in">
  <li>¿Qué problema resuelve y de quién? Decidlo con vuestras palabras.</li>
  <li>¿Qué es exactamente el MVP? ¿Lo podríais construir con lo que hay escrito?</li>
  <li>¿Qué requisito no habéis entendido?</li>
  <li>¿Qué habéis echado en falta que dabais por supuesto?</li>
  <li>¿Qué parte creéis que no les va a dar tiempo?</li>
  <li>¿Qué exclusión os ha parecido mal justificada?</li>
</ol>

<div class="rule">
  <p class="rule-label">Cómo se recibe una revisión</p>
  <p>Sin defenderse. Si el otro equipo no ha entendido algo, el problema está en el documento, no en su lectura: quien defiende su especificación en voz alta está confirmando que la información no estaba escrita. Anotad todo, decidid después qué cambiáis y qué no, y dejad constancia de ambas cosas.</p>
</div>

### El producto de la unidad

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Especificación inicial del proyecto.</p>
  <ul class="checklist">
    <li>Enunciado del problema con las siete casillas, incluida «qué NO es este problema».</li>
    <li>Roles con su ficha y contexto de uso, partes interesadas y tabla de permisos.</li>
    <li>Propuesta de valor, con la tabla de antes y después.</li>
    <li>Catálogo de historias de usuario, entre doce y dieciocho.</li>
    <li>Requisitos funcionales numerados y trazados, incluidas las reglas de negocio.</li>
    <li>Requisitos no funcionales con umbral y método de comprobación, cubriendo las siete categorías.</li>
    <li>MVP definido en una frase, con los tres anillos y el motivo de cada corte.</li>
    <li>Lista de exclusiones con tipo y motivo, y procedimiento de cambio.</li>
    <li>Criterios de aceptación de todas las historias del MVP, con caminos de error.</li>
    <li>Resultado de las siete comprobaciones y de la revisión cruzada, con lo que se cambió y lo que no.</li>
    <li>Todo en el repositorio, en Markdown, marcado como v1.0 y con fecha.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que sea trazable | Se puede ir del problema a cualquier criterio y volver |
| Que sea comprobable | Los requisitos se responden con sí o no; los no funcionales tienen umbral |
| Que esté acotada | El MVP cabe en una frase y hay renuncias que dolían |
| Que esté completa por los bordes | Hay caminos de error, casos límite y criterios de autorización |
| Que sea legible por otros | Otro equipo la ha entendido sin que se la expliquen |
| Que sea honesta | Se documenta lo que la revisión encontró, incluido lo que decidisteis no cambiar |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué problema tiene hacer primero toda la API y después el frontend?</li>
    <li>Enuncia la prueba de entrada del MVP.</li>
    <li>¿Por qué nada puede entrar gratis en el alcance?</li>
    <li>¿Qué le pasa a una historia que solo tiene camino feliz?</li>
    <li>¿Qué efecto secundario tiene escribir los criterios antes de programar?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que al terminar no hay nada demostrable ni utilizable; es un corte horizontal.</p>
  <p>2 · Si esto no está, ¿el problema sigue sin resolverse?</p>
  <p>3 · Porque si se añade sin quitar, la lista de exclusiones deja de tener efecto y el alcance crece sin control.</p>
  <p>4 · Que está sin terminar: no dice qué pasa cuando algo falla o no está permitido.</p>
  <p>5 · Que aparecen los huecos de la especificación cuando todavía es barato taparlos.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 7</p>
  <ul class="checklist">
    <li>Todo el equipo sabe decir el MVP en una frase, sin leerlo.</li>
    <li>Las preguntas abiertas de los criterios de aceptación tienen responsable y fecha.</li>
    <li>Sabéis qué historias vais a prototipar en las semanas 7 y 8: las del MVP, y solo esas.</li>
    <li>La especificación está publicada y versionada, y sabéis cómo se cambia.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>De la idea a la especificación</figcaption>
  <ol class="flow">
    <li>Del síntoma al problema, encadenando porqués hasta algo que podáis cambiar</li>
    <li>De las personas a los roles, y de los roles a los permisos</li>
    <li>De la diferencia entre el antes y el después a la propuesta de valor</li>
    <li>De las necesidades a las historias, con su beneficio</li>
    <li>De las historias y las reglas a los requisitos numerados</li>
    <li>De lo que el sistema hace a lo que el sistema tiene que ser</li>
    <li>Del catálogo completo al MVP, cortando en vertical</li>
    <li>De lo que entra a lo que queda fuera, con motivo</li>
    <li>De cada historia a sus criterios, incluidos los que fallan</li>
    <li>De todas las piezas a una cadena que aguanta en los dos sentidos</li>
  </ol>
</figure>

Y las tres frases de la unidad:

> **Si vuestra propuesta de valor sirve para el proyecto de otro equipo, está mal escrita.**
>
> **Un MVP no es media aplicación: es una aplicación pequeña y completa.**
>
> **Los criterios de aceptación no comprueban la especificación: la terminan de escribir.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Especificación | El documento que dice qué es el producto, para quién, qué hace y cómo se comprueba |
| Síntoma | Lo que se ve; el problema es la causa sobre la que podéis actuar |
| Rol | Un tipo de uso con permisos propios, no un tipo de persona |
| Parte interesada | Alguien a quien afecta el sistema aunque no lo use |
| Propuesta de valor | La frase que dice para quién, frente a qué alternativa y con qué diferencia |
| Historia de usuario | Como [rol], quiero [acción] para [beneficio] |
| Épica | Una historia demasiado grande para terminarse y demostrarse |
| Requisito funcional | Qué tiene que hacer el sistema, comprobable con un sí o un no |
| Regla de negocio | Un requisito que expresa lo que el sistema debe impedir |
| Requisito no funcional | Cómo tiene que comportarse el sistema, con umbral y método de comprobación |
| MVP | La versión más pequeña que resuelve el problema de alguien de principio a fin |
| Corte vertical | Un trozo de producto que atraviesa todas las capas, de la pantalla al despliegue |
| Lista de exclusiones | Lo que el producto no hará, con el motivo y el tipo de cada exclusión |
| Criterio de aceptación | Dado, cuando, entonces: la condición que permite decir que algo está terminado |
| Trazabilidad | Poder recorrer la cadena del problema al criterio y del criterio al problema |

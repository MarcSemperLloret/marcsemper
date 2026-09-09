---
title: "¿Qué significa que una empresa sea sostenible?"
label: "UD1 · Actividad"
section: "ud-01"
order: 1
lang: "es"
summary: "Entender la sostenibilidad más allá de «reciclar» o «ser verde». Analizamos los impactos ambientales, sociales y de gobernanza de una empresa y, sobre todo, aprendemos a distinguir una mejora real de una afirmación sin evidencias."
duration: "4 horas · 4 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Diagnóstico ASG de PixelStore. Una actividad acumulativa por unidad, con evidencias y aportación individual."
outcomes:
  - "Explicar qué significa sostenibilidad en una empresa, y qué no."
  - "Distinguir las dimensiones ambiental, social y de gobernanza."
  - "Reconocer los impactos de sostenibilidad que genera la tecnología."
  - "Identificar a quién afectan las decisiones de una empresa."
  - "Priorizar los problemas importantes y defender esa prioridad."
  - "Proponer indicadores que permitan comprobar una mejora."
  - "Detectar afirmaciones de sostenibilidad sin evidencia detrás."
  - "Relacionar un reto global con un riesgo o una oportunidad para la empresa."
  - "Decir qué puede hacer al respecto un desarrollador, en su trabajo y fuera de él."
requirements:
  - "Guía de arranque y materiales de esta unidad, enlazados en la página."
  - "Carpeta o documento de actividad compartido con el docente."
priorKnowledge:
  - "No se requieren conocimientos previos de estos contenidos. La guía explica cómo abrir y guardar el trabajo; no se necesita ningún otro módulo."
date: "2026-09-09"
---

<p class="lead">Diagnóstico ASG de PixelStore. Cada sesión introduce los conceptos que necesita y continúa una misma actividad de la unidad. Conserva sus resultados para revisarlos y utilizarlos después.</p>

## Cómo trabajar esta unidad

Son 4 sesiones de una hora: 10 minutos de explicación, 45 de trabajo guiado y 5 de cierre. Si el periodo del centro es de 55 minutos, se ajusta el trabajo a 40 minutos. Los ejemplos ampliados son material de consulta durante la práctica; no añaden otra clase teórica ni tareas obligatorias.

Abre la [guía de arranque y evaluación](/es/docencia/talleres-transversales/). Incluye archivos, herramientas y alternativas de acceso. Para los casos utiliza la [ficha común](/teaching/transversales/casos.pdf). No se necesita el CRUD de Servidor ni el workflow de Intermodular. Quien ya conozca una herramienta utiliza ese conocimiento para justificar y comprobar la actividad nueva, sin repetir una entrega ya evaluada.

## Actividad y criterios de evaluación

**Diagnóstico ASG de PixelStore.** Guarda el trabajo en `sostenibilidad/ud1/`, y redacta la actividad en Word, LibreOffice o un documento en línea; exporta la entrega a PDF. Cada sesión añade su avance, comprobación y pendiente; no se entrega un informe diferente por sesión. Cuando haya código, enlaza el repositorio y la versión o adjunta la carpeta identificada según el canal del aula. Nunca incluyas credenciales.

Esta actividad se valora sobre 10 puntos y aporta **4/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Cada integrante registra y explica su aportación. La rúbrica se conoce desde el inicio:

| Criterio                                             | Puntos |
| ---------------------------------------------------- | -----: |
| Comprensión de las dimensiones ASG                   |      2 |
| Identificación de impactos y stakeholders            |    1,5 |
| **Priorización y materialidad**                      |  **2** |
| Elección de indicadores adecuados                    |      2 |
| **Análisis crítico y detección de afirmaciones débiles** | **2** |
| Claridad del producto final                          |    0,5 |

En cada criterio, una evidencia ausente no permite acreditar el logro; una evidencia incompleta requiere revisión; una evidencia correcta permite comprobar el resultado; el logro completo añade una justificación coherente y reconoce sus límites. Los puntos se asignan según el grado de logro del criterio, no por cantidad de archivos, commits o texto. Consulta la guía para revisar y volver a presentar los criterios pendientes.

## Sesión 1 · ¿Qué significa realmente ser sostenible?

**Punto de partida.** Actividad «Diagnóstico ASG de PixelStore», sesión 1 de 4. Abre los materiales enlazados y crea el registro de la unidad. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

La sostenibilidad estudia cómo mantener una actividad atendiendo a sus consecuencias ambientales, sociales y de gobernanza, conocidas como **ASG**. Ambiental incluye recursos y emisiones; social, efectos sobre personas; gobernanza, reglas, responsabilidades y forma de tomar decisiones. Una misma actuación puede afectar a varias dimensiones.

En PixelStore, reducir papel puede disminuir un consumo, pero no describe el impacto de fabricar equipos, alojar su tienda o atender a sus trabajadores. Los **ODS** ayudan a situar objetivos de desarrollo; colocar su icono no demuestra una contribución. La primera tarea será relacionar hechos con impactos, sin adelantar una conclusión sobre toda la empresa.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### Sostenibilidad no significa solamente medio ambiente

Cuando pensamos en sostenibilidad solemos imaginar contaminación, cambio climático, reciclaje, energía o residuos. Todo eso es importante.

Pero una empresa también afecta a sus trabajadores, a sus clientes, a sus proveedores, a las comunidades donde opera, a los usuarios y a las administraciones.

Y además importa cómo toma decisiones, cómo protege los datos, cómo gestiona sus riesgos y si es transparente.

Por eso analizamos tres grandes dimensiones:

<p class="term">ASG</p>

También las encontraréis con las siglas inglesas **ESG**.

##### A · Ambiental

La dimensión **ambiental** analiza cómo afecta una organización al medio ambiente: consumo de electricidad, emisiones, consumo de agua, residuos, uso de materiales, transporte, fabricación de dispositivos y residuos electrónicos.

Podríamos pensar que una empresa de software tiene poco impacto porque «solo fabrica cosas digitales». Pero una aplicación necesita esto por debajo:

<figure class="diagram">
  <figcaption>Lo que hay debajo de una aplicación</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Ordenadores</li>
    <li>Redes</li>
    <li>Servidores</li>
    <li>Centros de datos</li>
    <li>Electricidad</li>
    <li>Refrigeración</li>
  </ol>
</figure>

Por tanto:

> **Lo digital también necesita infraestructura física.**

##### S · Social

La dimensión **social** analiza cómo afecta una organización a las personas: condiciones laborales, igualdad, privacidad, inclusión, seguridad, accesibilidad, brecha digital e impacto sobre clientes y comunidades.

En desarrollo web hay un ejemplo especialmente importante: la **accesibilidad**. Una página puede funcionar perfectamente para nosotros y ser muy difícil o imposible de utilizar para una persona ciega, con baja visión, que no puede usar un ratón, con dificultades auditivas o con determinadas dificultades cognitivas.

Por tanto:

> **Una aplicación técnicamente correcta puede no ser socialmente adecuada.**

##### G · Gobernanza

La **gobernanza** tiene que ver con cómo se comporta y se dirige una organización: transparencia, privacidad, seguridad, cumplimiento de normas, responsabilidad, gestión de riesgos, comportamiento ético y selección de proveedores.

Imaginad una empresa que usa electricidad renovable, pero que al mismo tiempo vende los datos personales de sus usuarios sin informarles.

<div class="compare-pair">
  <div>
    <p class="compare-label">Lo que enseña</p>
    <p class="compare-body">Toda su electricidad procede de fuentes renovables.</p>
  </div>
  <div>
    <p class="compare-label">Lo que no enseña</p>
    <p class="compare-body">Vende los datos personales de sus usuarios sin informarles.</p>
  </div>
</div>

¿Diríais que es una empresa sostenible? Probablemente no. La sostenibilidad hay que mirarla desde varias perspectivas a la vez.

#### ¿Y qué son los ODS?

En 2015 Naciones Unidas aprobó la **Agenda 2030**, que establece:

<p class="term">17 Objetivos de Desarrollo Sostenible</p>

Abordan problemas como la pobreza, la salud, la educación, la igualdad, la energía, el trabajo, las ciudades, el consumo, el clima y las instituciones.

No hace falta memorizar los diecisiete. Lo importante es entender que **los ODS son un marco para identificar grandes objetivos de sostenibilidad**.

##### Algunos ODS relacionados con la tecnología

| ODS | Puede relacionarse con |
| --- | ---------------------- |
| 7 · Energía asequible y no contaminante | Eficiencia de centros de datos, consumo energético, energía renovable |
| 9 · Industria, innovación e infraestructura | Infraestructura digital, innovación, conectividad |
| 10 · Reducción de las desigualdades | Accesibilidad, brecha digital, inclusión |
| 12 · Producción y consumo responsables | Hardware, reparación, reutilización, residuos electrónicos |
| 13 · Acción por el clima | Emisiones, energía, eficiencia |

##### Cuidado con los ODS

Esto es lo que no debemos hacer:

<figure class="diagram">
  <figcaption>Cómo no se usa un ODS</figcaption>
  <ol class="flow flow--before">
    <li>Tenemos una empresa</li>
    <li>Elegimos tres ODS</li>
    <li>Ponemos sus iconos en la web</li>
    <li>Decimos que somos sostenibles</li>
  </ol>
</figure>

Relacionar una actividad con un ODS **no demuestra que estemos mejorando nada**. Necesitamos evidencia.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre la [ficha de PixelStore](/teaching/transversales/casos.pdf) y crea una carpeta `sostenibilidad/ud1` con un documento de actividad. No necesitas Git ni el proyecto de Servidor para empezar; la guía de arranque explica cómo guardar y entregar archivos.
2. Lee las áreas de la empresa y elige seis hechos: equipos, visitas, datos, personas, infraestructura y proveedores. Escribe una posible consecuencia de cada uno.
3. Clasifica las consecuencias como ambientales, sociales o de gobernanza. Ejemplo: no saber quién puede acceder a datos de clientes es un problema de responsabilidades y protección de personas.
4. Selecciona un hecho que afecte a dos dimensiones y explica ambas relaciones. No fuerces que todos los hechos pertenezcan a las tres.
5. Relaciona un impacto con un ODS pertinente y escribe qué evidencia necesitarías para afirmar que se mejora. Compara con otra pareja si has escrito una intención o un resultado.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

El mapa inicial contiene hechos, consecuencias y clasificación razonada. Explica por qué reducir papel no basta para calificar toda la empresa como sostenible.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD1 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 1»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 2 · Del reto global a tu trabajo

**Punto de partida.** Actividad «Diagnóstico ASG de PixelStore», sesión 2 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un reto global llega a una empresa a través de consecuencias concretas: disponibilidad de recursos, condiciones de trabajo, acceso a servicios o exigencias de clientes. Un **riesgo** es un efecto adverso posible; una **oportunidad** es una mejora que puede crear valor. Ninguno debe presentarse como un hecho ya ocurrido si no hay datos.

Por ejemplo, una interfaz difícil de usar puede impedir que parte de la clientela compre. Mejorarla puede ampliar el acceso y reducir incidencias. La relación debe explicar quién resulta afectado y cómo lo comprobaríamos, no limitarse a afirmar que «la tecnología ayuda».

Clientes, inversores y reguladores pueden pedir información con finalidades diferentes: elegir un proveedor, valorar riesgos o comprobar requisitos. La inversión socialmente responsable incorpora criterios ASG junto a los financieros. Una solicitud comercial de datos y una obligación normativa no son lo mismo; en ambos casos habrá que conocer el alcance y responder con información verificable. En UD6 distinguirás los marcos de reporte de los sistemas de gestión ambiental.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### De reto a riesgo y a oportunidad

Aquí hay un giro que cambia la conversación. Hasta ahora hemos mirado **de dentro hacia fuera**: cómo afecta la empresa a las personas y al entorno. Pero también existe la dirección contraria.

<div class="compare-pair">
  <div>
    <p class="compare-label">De dentro hacia fuera</p>
    <p class="compare-body">¿Cómo afecta la empresa a las personas y al medio ambiente?</p>
  </div>
  <div>
    <p class="compare-label">De fuera hacia dentro</p>
    <p class="compare-body">¿Cómo puede este asunto convertirse en un riesgo o en una oportunidad para la empresa?</p>
  </div>
</div>

Y no son la misma pregunta. Un ejemplo con algo que ya conocéis:

<dl class="worked">
  <dt>El asunto</dt>
  <dd>La web de una tienda no se puede usar con teclado.</dd>
  <dt>De dentro hacia fuera</dt>
  <dd>Hay personas que no pueden comprar. Ese es el impacto, y existe aunque a nadie le salga caro.</dd>
  <dt>De fuera hacia dentro · riesgo</dt>
  <dd>Clientes que se van sin comprar, incumplimiento de requisitos legales, reclamaciones, daño reputacional si alguien lo cuenta.</dd>
  <dt>De fuera hacia dentro · oportunidad</dt>
  <dd>Un mercado que ahora mismo no se está atendiendo, y un argumento comercial cuando el cliente sea una administración que lo exija en el pliego.</dd>
</dl>

Fijaos en que el impacto y el riesgo **no siempre van juntos**. Puede haber un impacto grande que a la empresa no le cueste nada, y un riesgo enorme por algo cuyo impacto real es pequeño. Un análisis honesto mira las dos direcciones y dice cuál está mirando.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Retoma el mapa ASG y escoge tres impactos de PixelStore. Crea columnas para reto, efecto en la empresa, persona afectada y evidencia necesaria.
2. Desarrolla una cadena completa. Ejemplo: dificultad de acceso → compras que no se completan → personas que usan teclado → prueba del recorrido de compra.
3. Para cada cadena escribe un riesgo y una oportunidad, diferenciando hechos del caso de hipótesis que habrá que verificar.
4. Identifica qué puede hacer desarrollo y qué requiere otra función: compras, dirección, proveedor o atención al cliente. Asigna un responsable posible sin inventar que ya existe esa política.
5. Intercambia una cadena con otra pareja. Pídele que señale el salto de razonamiento más débil y reescríbelo con una comprobación concreta.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Hay tres relaciones entre reto y actividad empresarial. Cada una indica quién puede actuar y qué información permitiría juzgar el resultado.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD1 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 2»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 3 · Impactos, datos y greenwashing

**Punto de partida.** Actividad «Diagnóstico ASG de PixelStore», sesión 3 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un **grupo de interés** es una persona o colectivo afectado por la empresa o capaz de influir en ella. La **materialidad** ayuda a priorizar los asuntos importantes según sus impactos y contexto; no significa elegir lo que resulta más fácil de mejorar.

Un **indicador** expresa qué observaremos y en qué unidad. «Consumimos menos» necesita una magnitud, una referencia y condiciones comparables. Una afirmación puede inducir a una imagen ambiental exagerada aunque contenga un dato cierto: reducir papel no demuestra que todos los impactos se hayan reducido. Revisaremos la relación entre afirmación y evidencia antes de hablar de greenwashing.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### No todo tiene la misma importancia

Imaginad una gran empresa tecnológica. Detectamos dos problemas ambientales:

<div class="compare-pair">
  <div>
    <p class="compare-label">Problema A</p>
    <p class="compare-body">Se utiliza demasiado papel en las oficinas.</p>
  </div>
  <div>
    <p class="compare-label">Problema B</p>
    <p class="compare-body">Sus centros de datos consumen enormes cantidades de energía.</p>
  </div>
</div>

Los dos son problemas ambientales, pero no tienen el mismo impacto. Y una empresa tiene recursos limitados, así que hay que decidir qué se resuelve primero.

Para eso existe el concepto de:

<p class="term">Materialidad</p>

No hace falta una definición complicada. Podemos entenderlo como **identificar qué aspectos son lo bastante importantes como para merecer atención y recursos**.

Y para decidirlo hacen falta las dos preguntas de la sesión anterior, no una:

<div class="compare-pair">
  <div>
    <p class="compare-label">Materialidad de impacto</p>
    <p class="compare-body">¿Cuánto afecta este asunto a las personas o al medio ambiente?</p>
  </div>
  <div>
    <p class="compare-label">Materialidad financiera</p>
    <p class="compare-body">¿Cuánto puede afectar este asunto a la empresa, como riesgo o como oportunidad?</p>
  </div>
</div>

A mirar las dos se le llama **doble materialidad**, y es la lógica que siguen los estándares europeos. Un asunto es material si pesa en cualquiera de las dos direcciones: no hace falta que pese en las dos.

Para una empresa que ofrece un servicio web a millones de personas podría quedar así:

| Aspecto                      | Posible importancia |
| ---------------------------- | ------------------- |
| Privacidad de usuarios       | Muy alta |
| Seguridad                    | Muy alta |
| Accesibilidad                | Alta |
| Consumo energético del cloud | Alta |
| Vida útil del hardware       | Media |
| Uso de papel                 | Baja |

Esto no significa que el papel sea irrelevante. Significa que **hay problemas con más impacto, y merecen más atención**.

#### Decir que mejoras no es suficiente

Una empresa afirma:

> Nuestra nueva aplicación es mucho más eficiente.

La primera pregunta debería ser: ¿cuánto? Si la respuesta es «muchísimo», seguimos sin saber nada. Necesitamos:

<p class="term">Indicadores</p>

Vamos a convertir tres afirmaciones en datos. La primera la hacemos juntos.



<dl class="worked">
  <dt>Afirmación</dt>
  <dd>«Nuestra web es más ligera.»</dd>
  <dt>¿Qué se puede observar?</dt>
  <dd>Lo que el navegador descarga en cada visita. Es medible, y cualquiera puede repetir la medición.</dd>
  <dt>Indicador</dt>
  <dd>MB transferidos por visita.</dd>
  <dt>Antes y después</dt>
  <dd>8,2 MB → 2,1 MB. Ahora la mejora se puede comprobar, y también discutir.</dd>
</dl>

Fijaos en el paso intermedio. La afirmación no se convierte en indicador de golpe: primero hay que decidir **qué se puede observar**. Ahí es donde se cae la mayoría de las promesas de sostenibilidad.



Ahora esta:

> Nuestros equipos duran más.

Hay al menos tres cosas observables: la vida media de cada ordenador, el porcentaje de equipos reparados y el porcentaje de equipos reutilizados. Elegid una y decid qué mide exactamente y qué se le escapa.

<dl class="answer">
  <dt>Indicador elegido</dt>
  <dd></dd>
  <dt>Qué mide</dt>
  <dd></dd>
  <dt>Qué se le escapa</dt>
  <dd></dd>
</dl>

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Añade al mapa clientes, plantilla, proveedores y otros colectivos pertinentes. Para cada uno escribe una necesidad o impacto concreto del caso, no solo su nombre.
2. Elige cinco asuntos y valora impacto y relevancia en una escala sencilla de 1 a 3. Explica el motivo de cada valoración; las cifras ordenan el juicio, no lo convierten en una medición objetiva.
3. Selecciona los tres asuntos prioritarios y contrasta si has considerado personas afectadas, alcance y gravedad, además del interés de la empresa.
4. Convierte una afirmación vaga en un indicador. Ejemplo: «equipos más duraderos» → años de uso por portátil, medidos desde alta hasta retirada, con motivo de la retirada.
5. Revisa dos afirmaciones de la ficha como fundamentada, información insuficiente o conclusión débil. Anota exactamente qué evidencia respalda o falta en cada una.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La prioridad tiene razones y el indicador tiene unidad y forma de obtenerse. Distingue ausencia de datos de una afirmación demostrada falsa.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD1 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 3»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 4 · ¿Es PixelStore una empresa sostenible?

**Punto de partida.** Actividad «Diagnóstico ASG de PixelStore», sesión 4 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un diagnóstico reúne los hechos disponibles, sus límites y las mejoras que merece la pena investigar. No necesitamos declarar a PixelStore «buena» o «mala»: necesitamos mostrar qué sabemos de sus impactos y qué no podemos sostener todavía.

Una propuesta defendible sigue la cadena impacto → prioridad → acción → indicador. Si decidimos revisar la renovación de equipos, debemos explicar qué problema esperamos reducir, quién decidiría y cómo observaríamos el resultado. Las unidades siguientes permitirán comprobar partes de este diagnóstico inicial.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Revisa las ocho afirmaciones de la ficha utilizando la clasificación iniciada en la sesión anterior. Reparte el análisis, pero contrasta conjuntamente los motivos y las evidencias.
2. Consolida el mapa ASG y los cinco asuntos importantes. Mantén las justificaciones; no vuelvas a redactar toda la teoría del módulo.
3. Propón una mejora para tres asuntos prioritarios. Añade indicador, dato que falta y responsable que debería participar.
4. Resume el diagnóstico en una página, diapositiva o panel, enlazando las tablas de trabajo. Señala una afirmación débil y cómo tendría que reformularse para ser defendible.
5. Explica una decisión a otra pareja y recoge una pregunta. Cada integrante responde sobre su contribución. Corrige la entrega y guarda esta versión inicial para compararla con el plan final de UD6.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Se entrega una sola actividad de diagnóstico ASG con su registro de trabajo. Las propuestas son hipótesis de mejora, no resultados ya medidos.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD1 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 4»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. La actividad de la unidad queda lista para valorar con su rúbrica; las correcciones se documentan en el mismo registro.

## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

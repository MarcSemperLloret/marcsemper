---
title: "Datos, analítica y toma de decisiones con IA"
label: "UD5 · Proyecto"
section: "ud-05"
order: 5
lang: "es"
summary: "Los datos tienen algo que contarnos. De un CSV que nadie ha mirado a un informe ejecutivo, usando IA para analizar sin delegar en ella las conclusiones."
duration: "4 horas · 4 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Análisis de datos e informe de decisiones. Una actividad acumulativa por unidad, con evidencias y aportación individual."
date: "2026-09-09"
outcomes:
  - "Explorar un dataset real y detectar sus problemas de calidad antes de tocarlo."
  - "Convertir una pregunta de negocio en un análisis."
  - "Distinguir hecho, interpretación, recomendación y supuesto."
  - "Auditar una conclusión generada por IA."
  - "Decir qué NO pueden responder los datos que tenéis."
requirements:
  - "Guía de arranque y materiales de esta unidad, enlazados en la página."
  - "Materiales del caso y herramientas indicadas en la unidad."
priorKnowledge:
  - "Las unidades anteriores de este módulo. No se requiere Servidor, Intermodular ni el otro módulo transversal."
---

<p class="lead">Análisis de datos e informe de decisiones. Cada sesión introduce los conceptos que necesita y continúa una misma actividad de la unidad. Conserva sus resultados para revisarlos y utilizarlos después.</p>

## Cómo trabajar esta unidad

Son 4 sesiones de una hora: 10 minutos de explicación, 45 de trabajo guiado y 5 de cierre. Los ejemplos ampliados son material de consulta durante la práctica; no añaden otra clase teórica ni tareas obligatorias.

Abre la [guía de arranque y evaluación](/es/docencia/talleres-transversales/). Incluye archivos, herramientas y alternativas de acceso. Para los casos utiliza la [ficha común](/teaching/transversales/casos.pdf). No se necesita el CRUD de Servidor ni el workflow de Intermodular. Quien ya conozca una herramienta utiliza ese conocimiento para justificar y comprobar la actividad nueva, sin repetir un trabajo ya evaluado.

## Actividad y criterios de evaluación

**Análisis de datos e informe de decisiones.** La actividad se construye durante las sesiones de la unidad: cada avance incorpora el resultado, su comprobación y las decisiones que lo justifican. Cada integrante debe poder explicar su aportación.

Esta actividad se valora sobre 10 puntos y aporta **4/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Cada integrante registra y explica su aportación. La rúbrica se conoce desde el inicio:

<table>
  <thead>
    <tr>
      <th>Criterio</th>
      <th class="align-right">Puntos</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Comprensión y revisión inicial del dataset</td>
      <td class="align-right">1,5</td>
    </tr>
    <tr>
      <td>Tratamiento razonado de problemas de calidad</td>
      <td class="align-right">1,5</td>
    </tr>
    <tr>
      <td>Calidad de las preguntas planteadas</td>
      <td class="align-right">1,5</td>
    </tr>
    <tr>
      <td>Análisis y visualizaciones adecuados</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td><strong>Calidad de las decisiones obtenidas a partir de los datos</strong></td>
      <td class="align-right"><strong>2</strong></td>
    </tr>
    <tr>
      <td>Reconocimiento de limitaciones y errores de interpretación</td>
      <td class="align-right">1</td>
    </tr>
    <tr>
      <td>Claridad del informe ejecutivo</td>
      <td class="align-right">0,5</td>
    </tr>
  </tbody>
</table>

En cada criterio, una evidencia ausente no permite acreditar el logro; una evidencia incompleta requiere revisión; una evidencia correcta permite comprobar el resultado; el logro completo añade una justificación coherente y reconoce sus límites. Los puntos se asignan según el grado de logro del criterio, no por cantidad de archivos, commits o texto. Consulta la guía para revisar y volver a presentar los criterios pendientes.

## Sesión 1 · Conoce los datos

**Punto de partida.** Actividad «Análisis de datos e informe de decisiones», sesión 1 de 4. Abre los materiales enlazados y crea el registro de la unidad. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un **dataset** es un conjunto de datos organizado. Una fila no siempre equivale a un cliente o una factura: en Online Retail representa una línea de producto dentro de una factura. Entender esa unidad evita contar las líneas como si fueran pedidos distintos.

Un **notebook** combina texto explicativo, código y resultados en celdas. pandas permite leer y resumir tablas en Python. Empezaremos con un cuaderno preparado: ejecutaremos una celda, observaremos su salida y explicaremos su significado antes de pedir más análisis. Los datos históricos sirven para practicar; no describen las ventas actuales de la empresa.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### ¿Qué contiene?

Las principales variables son:

| Variable | Significado |
| --- | --- |
| `InvoiceNo` | Número de factura |
| `StockCode` | Código del producto |
| `Description` | Nombre del producto |
| `Quantity` | Cantidad |
| `InvoiceDate` | Fecha y hora |
| `UnitPrice` | Precio por unidad |
| `CustomerID` | Identificador del cliente |
| `Country` | País |

Por ejemplo:

<dl class="record">
  <dt>InvoiceNo</dt>
  <dd>536365</dd>
  <dt>Description</dt>
  <dd>WHITE HANGING HEART</dd>
  <dt>Quantity</dt>
  <dd>6</dd>
  <dt>UnitPrice</dt>
  <dd>2.55</dd>
  <dt>Country</dt>
  <dd>United Kingdom</dd>
</dl>

#### Una columna que NO existe

Queremos analizar cuánto dinero genera cada operación.

Pero no tenemos una columna `Revenue`.

Podemos calcularla:

<p class="single-node single-node--mono">Revenue = Quantity × UnitPrice</p>

Este tipo de columna calculada aparece constantemente en análisis de datos.

La IA puede ayudarnos a crearla.

Pero primero tendremos que comprobar si podemos utilizar directamente todos los registros.

#### Un dato extraño no siempre es un error

Imaginemos:

<p class="single-node single-node--mono">Quantity = -10</p>

Podríamos pensar:

> Eso es imposible. Lo eliminamos.

Pero quizá representa una devolución, una cancelación o un ajuste.

Los datos necesitan **contexto**.

En nuestro dataset, determinados números de factura permiten identificar cancelaciones.

Por tanto:

> **limpiar datos no significa borrar todo lo que parece extraño.**

Significa comprender qué representa.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Descarga el [cuaderno de datos](/teaching/downloads/digitalizacion-datos.zip), extráelo y sigue su guia-datos.pdf. Abre `analisis.ipynb` con el entorno indicado y selecciona el intérprete de Python preparado.
2. Ejecuta las celdas iniciales en orden. La descarga conserva `Online Retail.xlsx` y la carga muestra filas, columnas y primeras observaciones. Compara los nombres con el diccionario incluido.
3. Localiza dos filas con el mismo número de factura. Explica por qué no son necesariamente duplicadas: pueden corresponder a productos distintos.
4. Ejecuta el bloque de calidad y registra ausencias, cantidades no positivas y cancelaciones. Todavía no borres registros. Elige una anomalía y explica qué hecho del negocio podría representar.
5. Guarda el notebook y añade una nota con fuente, periodo y unidad de observación. Si una celda falla, revisa la ruta y el mensaje de error antes de cambiar el formato del dato.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

El cuaderno carga el Excel real y contiene una descripción interpretada de los datos. No se exige crear un CSV ni dominar previamente pandas.


## Sesión 2 · Haz preguntas al negocio

**Punto de partida.** Actividad «Análisis de datos e informe de decisiones», sesión 2 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una métrica depende de sus reglas. Cantidad por precio calcula el importe de una línea, pero hay que decidir si el análisis incluye devoluciones o solo ventas positivas. Dos resultados pueden ser diferentes sin que falle Python: quizá responden a preguntas distintas.

La limpieza debe conservar una explicación y el dato original. Excluir una fila porque no tiene identificador de cliente puede tener sentido para estudiar clientes, pero no necesariamente para calcular ventas. Elegiremos el subconjunto en función de cada pregunta y anotaremos sus límites.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### Crear variables útiles

Ahora podemos crear la columna `Revenue`, y extraer de la fecha el año, el mes, el día de la semana y la hora.

La IA puede generar el código.

No necesitamos memorizarlo.

Lo importante es comprender qué nos permitirá estudiar cada variable.

#### El principio de Pareto

En muchas empresas encontramos situaciones aproximadamente parecidas a:

> una pequeña proporción de clientes genera una gran parte del negocio.

No debemos asumir que siempre es exactamente un 20 % que produce el 80 %.

Eso es una regla aproximada, no una ley.

Los datos deben decirnos qué ocurre realmente.

---


Sin guion. Formulad vuestra propia pregunta de negocio, decidid qué métrica la responde y comprobad qué podría estar engañándoos.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre el cuaderno guardado y ejecuta de nuevo las celdas de carga y calidad. Conserva `df` como dato original; utiliza el subconjunto propuesto para ventas positivas y lee las condiciones que lo definen.
2. Ejecuta el ejemplo de importe por producto. Contrasta una línea a mano multiplicando cantidad por precio; identifica en qué moneda están los precios según el diccionario.
3. Elige dos preguntas entre evolución temporal, productos, países o clientes. Antes de calcular, escribe la métrica, el periodo y las filas que incluirás.
4. Utiliza las celdas de ejemplo o pide al asistente una adaptación explicada. Comprueba que agrupa por la columna correcta; para pedidos usa facturas distintas, no el número de filas.
5. Revisa si el primer o último mes está incompleto antes de comparar periodos. Guarda la tabla, un gráfico legible y una frase que diga exactamente qué muestra, sin convertir ventas en beneficio.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Las dos preguntas tienen reglas y resultados reproducibles. Puedes explicar una exclusión y qué cambiaría si utilizases otra métrica.


## Sesión 3 · De análisis a decisión

**Punto de partida.** Actividad «Análisis de datos e informe de decisiones», sesión 3 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un **hallazgo** describe lo que muestran los datos. Una **decisión** propone una acción y necesita añadir criterio de negocio. Que dos variables cambien juntas no demuestra que una cause la otra. Tampoco podemos deducir beneficio si no tenemos costes.

Un gráfico debe identificar medida, periodo y unidades. Recortar el eje o comparar un mes completo con nueve días puede crear una impresión equivocada. Hoy revisaremos las conclusiones, incluida una propuesta de la IA, buscando la evidencia y los límites que la sostienen.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### Los gráficos también pueden engañar

No todos los gráficos sirven para todo.

Algunas reglas básicas:

| Qué queremos mostrar | Gráfico habitual |
| --- | --- |
| Evolución temporal | Líneas |
| Comparar categorías | Barras |
| Relación entre dos variables numéricas | Dispersión |

La IA puede recomendar un gráfico.

Pero debemos comprobar que sea adecuado.

#### Correlación no significa causalidad

Supongamos que descubrimos:

> Los clientes que compran más productos también gastan más dinero.

Eso parece razonable.

Pero imaginemos otro resultado:

> Los martes tienen mayor facturación.

No podemos concluir automáticamente que ser martes provoque que la gente compre más.

Podrían existir otras explicaciones.

Por tanto:

<p class="term">Relación ≠ Causa</p>

La IA puede encontrar patrones.

No significa que conozca su causa.

#### El límite de nuestros datos

Nuestro dataset es real.

Pero eso no significa que podamos responder cualquier pregunta.

Por ejemplo, no conocemos necesariamente el coste del producto, el margen, los gastos de envío, las campañas publicitarias, la satisfacción, la competencia ni el stock disponible.

Por tanto:

> **más ingresos no significa necesariamente más beneficio.**

Esta distinción es importante.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Selecciona un resultado de la sesión anterior. Escribe una frase descriptiva con cifra, unidad y periodo; enlázala a la celda que lo calcula.
2. Revisa su gráfico: título, ejes, unidades, escala y periodos comparados. Cambia una presentación que pueda inducir a error y conserva por qué la modificaste.
3. Pide al asistente una recomendación basada en esa tabla, indicando que no invente costes ni causas. Si trabajas con una respuesta preparada en el aula, identifica exactamente qué afirmación vas a revisar.
4. Clasifica sus afirmaciones como respaldadas, pendientes de información o incorrectas. Comprueba al menos una cifra recalculándola en el cuaderno.
5. Redacta una decisión con evidencia, riesgo e indicador para comprobar su resultado. Añade un dato que pedirías antes de aplicarla; no supongas que la recomendación ya ha sido ejecutada.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Hay una conclusión revisada y una decisión acotada. Debes poder mostrar la celda que respalda la cifra y una cosa que el dataset no permite saber.


## Sesión 4 · El informe para dirección

**Punto de partida.** Actividad «Análisis de datos e informe de decisiones», sesión 4 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un informe para dirección traduce el análisis a una decisión que pueda discutirse. La persona que lo lee no necesita toda la sintaxis, pero sí conocer qué datos se usaron, qué se encontró y qué incertidumbre queda. El notebook conserva el camino que permite comprobarlo.

Una frase como «este producto vende más unidades en este periodo» es defendible con una tabla. «Es el producto más rentable» exige costes que este dataset no proporciona. La precisión de la conclusión importa más que que resulte llamativa.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Selecciona tres hallazgos comprobados y dos decisiones. Para cada hallazgo prepara una frase, una cifra y su tabla o gráfico; elimina conclusiones que no puedas vincular con el análisis.
2. Organiza cuatro diapositivas o secciones: datos y reglas, hallazgos, decisiones y límites. En las decisiones indica riesgo y métrica de seguimiento.
3. Reinicia el kernel y ejecuta el notebook desde el principio. Comprueba que los resultados no dependen de ejecutar celdas fuera de orden. Si falla, corrige la celda y repite desde la carga.
4. Pide a otra persona que localice en el notebook la evidencia de una diapositiva. Añade referencias o títulos de celdas si no puede encontrarla.
5. Entrega informe y notebook enlazados en la actividad de UD5. Incluye fuente de datos y decisiones de limpieza. Cada integrante explica una limitación o una revisión de la conclusión de la IA.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Se evalúan comprensión de datos, análisis, decisiones y límites. No se añade un examen de Python ni otra memoria sobre las mismas cifras.


## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

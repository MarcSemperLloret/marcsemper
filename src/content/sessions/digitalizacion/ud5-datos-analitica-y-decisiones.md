---
title: "Datos, analítica y toma de decisiones con IA"
label: "UD5 · Proyecto"
section: "ud-05"
order: 5
lang: "es"
summary: "Los datos tienen algo que contarnos. De un CSV que nadie ha mirado a un informe ejecutivo, usando IA para analizar sin delegar en ella las conclusiones."
duration: "4 horas · 4 sesiones"
modality: "Individual o parejas"
deliverable: "Un pequeño informe ejecutivo basado en un dataset real."
date: "2026-08-28"
outcomes:
  - "Explorar un dataset real y detectar sus problemas de calidad antes de tocarlo."
  - "Convertir una pregunta de negocio en un análisis."
  - "Distinguir hecho, interpretación, recomendación y supuesto."
  - "Auditar una conclusión generada por IA."
  - "Decir qué NO pueden responder los datos que tenéis."
requirements:
  - "Python con pandas y un entorno de notebooks."
  - "El fichero online_retail.csv."
  - "Visual Studio Code con Copilot activado."
priorKnowledge:
  - "Ejecutar Python y abrir un notebook."
  - "Dirigir a un agente con contexto y criterios (UD4)."
---

## Sesión 1 · Conoce los datos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo explorar un dataset real en bruto, identificar tipos de variables y detectar anomalías de calidad.</li>
    <li><strong>2. Haz:</strong> Carga <code>online_retail.csv</code> con pandas, calcula estadísticas descriptivas e inspecciona valores nulos y negativos.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el Checkpoint de la sesión 1.</li>
  </ol>
</div>

### El reto

Imaginad que empezáis a trabajar como desarrolladores en una empresa.

Vuestro responsable os entrega un archivo:

<p class="single-node single-node--mono">ventas.csv</p>

y os dice:

> Tenemos todos estos datos pero prácticamente no los utilizamos.
>
> Analízalos y dime si encuentras algo que nos pueda ayudar a tomar mejores decisiones.

El problema es que nunca habéis visto ese archivo.

Tiene miles de registros.

No sabéis qué columnas contiene, si hay errores, qué preguntas merece la pena hacer, qué gráficos utilizar ni cómo analizarlo.

Hace unos años probablemente necesitaríamos dominar previamente bastantes herramientas de análisis de datos.

Actualmente podemos utilizar un asistente de IA para ayudarnos.

Pero existe una condición importante:

> **La IA nos ayuda a analizar los datos. No decide por nosotros qué conclusiones son ciertas.**

Ese será el objetivo de esta actividad.

---

### ¿Qué vamos a aprender?

No pretendemos convertirnos en científicos de datos.

Queremos aprender un procedimiento que podamos reutilizar cuando en el futuro recibamos un CSV, un Excel, un export de una base de datos, un fichero de logs o un dataset empresarial.

Al terminar deberíamos saber hacer esto:

<figure class="diagram">
  <figcaption>El procedimiento completo</figcaption>
  <ol class="flow">
    <li>Datos</li>
    <li>Entender</li>
    <li>Comprobar</li>
    <li>Preguntar</li>
    <li>Analizar con IA</li>
    <li>Visualizar</li>
    <li>Interpretar</li>
    <li>Decidir</li>
  </ol>
</figure>

---

### Nuestro dataset

Trabajaremos con un dataset real denominado:

<p class="term">Online Retail</p>

Contiene transacciones reales de un comercio electrónico británico.

La empresa vende principalmente artículos de regalo y tiene clientes tanto particulares como mayoristas.

Disponemos de más de medio millón de registros.

Cada fila representa la venta de un determinado producto dentro de una factura.

Podéis descargarlo del repositorio de la Universidad de California:
[Online Retail — UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/352/online-retail).

---

### ¿Qué contiene?

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

---

### Una columna que NO existe

Queremos analizar cuánto dinero genera cada operación.

Pero no tenemos una columna `Revenue`.

Podemos calcularla:

<p class="single-node single-node--mono">Revenue = Quantity × UnitPrice</p>

Este tipo de columna calculada aparece constantemente en análisis de datos.

La IA puede ayudarnos a crearla.

Pero primero tendremos que comprobar si podemos utilizar directamente todos los registros.

---

### Primer principio: nunca analices un dataset que todavía no entiendes

Un error muy frecuente sería:

> Cargar el CSV → pedir a la IA gráficos → sacar conclusiones.

Antes debemos explorar.

Queremos saber:

* ¿cuántas filas tenemos?
* ¿qué columnas existen?
* ¿qué tipo de datos contiene cada columna?
* ¿hay valores vacíos?
* ¿hay cantidades negativas?
* ¿hay precios extraños?
* ¿qué periodo temporal cubre?
* ¿qué países aparecen?

---

### IA como asistente de análisis

Podemos utilizar Copilot para generar el código que necesitemos.

Por ejemplo:

> Tengo un fichero `ventas.csv`.
>
> Quiero hacer un análisis exploratorio inicial con Python y pandas.
>
> Genera código para mostrar dimensiones, columnas, tipos, primeras filas, valores ausentes, estadísticas básicas y número de valores únicos.
>
> Explica brevemente qué hace cada bloque.

No necesitamos recordar de memoria todos los comandos.

Pero:

> **sí debemos entender qué estamos preguntando y qué significa la respuesta.**

---

### Primera actividad — Conocer los datos

Cargad el dataset utilizando Python.

Podéis pedir a Copilot que genere el código.

La primera salida debe responder:

<dl class="answer">
  <dt>Número de filas</dt>
  <dd></dd>
  <dt>Número de columnas</dt>
  <dd></dd>
  <dt>Fecha mínima</dt>
  <dd></dd>
  <dt>Fecha máxima</dt>
  <dd></dd>
  <dt>Número de países</dt>
  <dd></dd>
  <dt>Número de productos diferentes</dt>
  <dd></dd>
  <dt>Número de clientes diferentes</dt>
  <dd></dd>
</dl>

---

### Ahora buscamos problemas

Pedid a la IA:

> Antes de analizar ventas, quiero comprobar posibles problemas de calidad.
>
> Examina valores nulos, duplicados, cantidades ≤ 0, precios ≤ 0, valores extremos y facturas canceladas.
>
> No elimines nada todavía.
>
> Muéstrame cuántos casos hay de cada tipo y ayúdame a interpretarlos.

Este punto es fundamental:

<p class="term">Primero detectamos, después decidimos</p>

---

### Un dato extraño no siempre es un error

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

---

### La IA también puede equivocarse

Supongamos que preguntamos:

> ¿Cuánto facturó la empresa?

Copilot genera:

```python
df["Revenue"] = df["Quantity"] * df["UnitPrice"]
df["Revenue"].sum()
```

El código funciona.

Pero debemos preguntar: ¿estamos incluyendo devoluciones? ¿Y cancelaciones? ¿Hay precios igual a cero? ¿Qué significa realmente esta suma?

Un programa que ejecuta correctamente puede producir:

<p class="term">Una respuesta incorrecta</p>

---

### Regla fundamental

Nunca preguntaremos únicamente:

> ¿Qué resultado obtengo?

También preguntaremos:

> **¿Qué supuestos has utilizado para obtenerlo?**

---

<details class="aside aside--help">
  <summary>Estoy atascado · no consigo cargar el fichero</summary>
  <ol>
    <li>¿La ruta es correcta? Empezad por el nombre exacto, mayúsculas incluidas.</li>
    <li>Si da un error de codificación, el fichero no está en UTF-8: probad otra codificación al leerlo.</li>
    <li>Si todas las columnas salen en una, el separador no es el que se está suponiendo.</li>
    <li>Si los códigos de producto salen como números, indicad el tipo al leer en lugar de arreglarlo después.</li>
    <li>Si las fechas salen como texto, convertidlas explícitamente: casi todo lo de la sesión 2 depende de eso.</li>
  </ol>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Dataset cargado y descrito: filas, columnas, tipos, rango de fechas.</li>
    <li>Lista escrita de problemas de calidad detectados.</li>
    <li>Una decisión tomada sobre cada problema, con su motivo.</li>
    <li>Al menos un dato extraño que decidisteis NO borrar, y por qué.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué no se empieza por limpiar el dataset?</li>
    <li>Encontráis cantidades negativas. ¿Error o información?</li>
    <li>¿Qué columna importante no existe en el fichero y hay que construir?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque hasta que no entendéis qué significa cada columna no sabéis si un valor raro es un error o un hecho del negocio.</p>
  <p>2 · Puede ser información: una devolución. Borrarlas sin mirar cambia las ventas totales.</p>
  <p>3 · El importe de cada línea, que hay que calcular a partir de cantidad y precio unitario.</p>
</details>

---

## Sesión 2 · Haz preguntas al negocio

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo depurar y transformar datos con criterio de negocio (tratamiento de cancelaciones, devoluciones y meses incompletos).</li>
    <li><strong>2. Haz:</strong> Genera un dataset limpio con pandas y formula preguntas analíticas comerciales clave con el apoyo de Copilot.</li>
    <li><strong>3. Comprueba:</strong> Valida que los cálculos de ingresos totales y concentración de clientes (Pareto) son rigurosos.</li>
  </ol>
</div>

### Segunda actividad — Crear un dataset analizable

Pedid a Copilot que os ayude a crear una versión destinada al análisis de ventas.

Pero debéis decidir vosotros:

##### ¿Qué hacemos con las cancelaciones?

<p class="write-line"></p>

##### ¿Qué hacemos con cantidades negativas?

<p class="write-line"></p>

##### ¿Qué hacemos con precios cero o negativos?

<p class="write-line"></p>

##### ¿Qué hacemos con valores ausentes?

<p class="write-line"></p>

Pedid al asistente que explique las consecuencias de cada decisión.

Después documentad vuestra decisión: «hemos excluido X porque…».

No vale: «lo hemos borrado porque Copilot lo dijo».

---

### Crear variables útiles

Ahora podemos crear la columna `Revenue`, y extraer de la fecha el año, el mes, el día de la semana y la hora.

La IA puede generar el código.

No necesitamos memorizarlo.

Lo importante es comprender qué nos permitirá estudiar cada variable.

---

### Ya podemos empezar a hacer preguntas

Un dataset por sí mismo no responde nada.

Necesitamos hacer **preguntas**. Por ejemplo:

* ¿cuándo vendemos más?
* ¿qué productos generan más ingresos?
* ¿qué países son nuestros principales mercados?
* ¿tenemos muchos clientes pequeños o pocos clientes muy importantes?
* ¿hay meses especialmente buenos o malos?

Estas preguntas son las que convierten una cosa en la otra:

<figure class="diagram">
  <figcaption>Lo que aporta una pregunta</figcaption>
  <ol class="flow flow--row">
    <li>Datos</li>
    <li>Información</li>
  </ol>
</figure>

---

### De información a decisión

Pero todavía falta algo.

Saber que «el producto A es el más vendido» no es una decisión.

Una decisión podría ser: aumentar el stock del producto A antes del periodo de máxima demanda.

Por tanto:

<figure class="diagram">
  <figcaption>De un número a una decisión</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Dato</span>12.000 unidades</li>
    <li><span class="flow-role">Información</span>Es uno de nuestros productos más vendidos</li>
    <li><span class="flow-role">Interpretación</span>Existe una demanda elevada</li>
    <li><span class="flow-role">Decisión</span>Revisar su disponibilidad de stock</li>
  </ol>
</figure>

---

### Tercera actividad — Analizar el negocio

Vais a trabajar como pequeños analistas y responderéis al menos **cinco preguntas**. La primera la resolvemos juntos, con el razonamiento a la vista; en las siguientes iréis quedándoos solos.

<p class="stage">Paso 1 · Te enseño uno</p>

#### Pregunta 1 — ¿Cómo evolucionan las ventas?

Analizamos los ingresos por mes. Pedimos a la IA el cálculo, pero no la conclusión:

> Calcula los ingresos mensuales y genera un gráfico adecuado.
>
> No interpretes todavía el resultado.

Y ahora leemos el gráfico nosotros, con cuatro preguntas fijas:

<dl class="worked">
  <dt>¿Hay tendencia?</dt>
  <dd>Sí, creciente a lo largo del año: los últimos meses facturan bastante más que los primeros.</dd>
  <dt>¿Existe estacionalidad?</dt>
  <dd>Sí, y tiene explicación: es un comercio de artículos de regalo, y noviembre concentra las compras previas a Navidad.</dd>
  <dt>¿Hay algún mes especialmente alto o bajo?</dt>
  <dd>Noviembre destaca hacia arriba. Y el último mes parece desplomarse.</dd>
  <dt>¿El último mes contiene todos los días del mes?</dt>
  <dd>No. El dataset termina el 9 de diciembre. Ese desplome no ha ocurrido: solo estamos comparando nueve días con meses enteros.</dd>
</dl>

Fijaos en lo que acaba de pasar. El cálculo era correcto, el gráfico era correcto, y la lectura inmediata era falsa. Nadie mintió: faltaba una pregunta.

Esa cuarta pregunta es la que separa a alguien que mira un gráfico de alguien que lo analiza.

---

### ¿Por qué importa que un mes esté incompleto?

Imaginemos:

<table>
  <thead>
    <tr>
      <th>Mes</th>
      <th class="align-right">Ingresos</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Octubre</td>
      <td class="align-right">100.000 €</td>
    </tr>
    <tr>
      <td>Noviembre</td>
      <td class="align-right">110.000 €</td>
    </tr>
    <tr>
      <td>Diciembre</td>
      <td class="align-right">40.000 €</td>
    </tr>
  </tbody>
</table>

Podríamos concluir:

> Las ventas de diciembre se desplomaron.

Pero ¿y si el dataset solamente contiene del 1 al 9 de diciembre?

Entonces comparar ese mes con meses completos sería engañoso.

Esto demuestra una regla fundamental:

> **Un gráfico puede ser correcto y nuestra interpretación incorrecta.**

---

<p class="stage stage--guided">Paso 2 · Lo hacemos juntos</p>

Ahora vosotros, pero con las preguntas orientadoras delante. Aplicad a cada análisis las mismas cuatro comprobaciones que acabáis de ver: qué dice el dato, qué explicación tiene, qué destaca, y qué podría estar engañándonos.

### Pregunta 2 — ¿Qué productos son más importantes?

Aquí hay dos preguntas posibles, y no son la misma: qué productos venden más unidades, y qué productos generan más ingresos.

<div class="compare-pair">
  <div>
    <p class="compare-label">Producto A</p>
    <p class="compare-body">10.000 unidades × 1 € = 10.000 €</p>
  </div>
  <div>
    <p class="compare-label">Producto B</p>
    <p class="compare-body">1.000 unidades × 50 € = 50.000 €</p>
  </div>
</div>

¿Cuál es el «más importante»?

Depende de lo que queramos medir.

Calculad el top 10 por unidades y el top 10 por ingresos, y comparad ambas listas.

---

### Una lección importante: la métrica cambia la respuesta

Muchas decisiones dependen de qué medimos.

«Más vendido» puede significar más unidades, más facturas, más ingresos o más clientes.

La IA puede calcular cualquiera.

El desarrollador debe decidir:

> **qué métrica responde realmente a nuestra pregunta.**

---

### Pregunta 3 — ¿Dónde vendemos?

Analizad los ingresos por país.

Existe un detalle: la empresa está ubicada en Reino Unido.

Si Reino Unido representa una proporción enorme de las ventas, puede ocultar lo que ocurre en los demás países.

Por tanto, haced dos análisis: con todos los países, y excluyendo Reino Unido.

Responded:

##### ¿Cuáles parecen los principales mercados internacionales?

<p class="write-line"></p>

---

### Pregunta 4 — ¿Cuándo compran nuestros clientes?

Analizad el día de la semana y la hora del día.

Generad un gráfico e intentad responder:

##### ¿En qué momentos existe mayor actividad?

<p class="write-line"></p>

Después proponed una posible utilidad empresarial: atención al cliente, promociones, infraestructura o campañas.

<p class="write-line"></p>

---

### Pregunta 5 — ¿Todos los clientes son igual de importantes?

Calculad cuánto ingreso está asociado a cada cliente y ordenadlos.

Responded:

##### ¿Cuánto generan los 10 principales clientes?

<p class="write-line"></p>

##### ¿Qué porcentaje representan?

<p class="write-line"></p>

##### ¿La empresa parece depender mucho de pocos clientes?

<p class="write-line"></p>

Aquí podéis pedir a la IA una tabla, un gráfico y el porcentaje acumulado.

---

### El principio de Pareto

En muchas empresas encontramos situaciones aproximadamente parecidas a:

> una pequeña proporción de clientes genera una gran parte del negocio.

No debemos asumir que siempre es exactamente un 20 % que produce el 80 %.

Eso es una regla aproximada, no una ley.

Los datos deben decirnos qué ocurre realmente.

---

<p class="stage stage--solo">Paso 3 · Hazlo tú</p>

Sin guion. Formulad vuestra propia pregunta de negocio, decidid qué métrica la responde y comprobad qué podría estar engañándoos.

### Pregunta libre

Ahora llega la parte más importante.

Formulad **vuestra propia pregunta** sobre los datos.

No puede ser una de las anteriores. Ejemplos:

* ¿qué productos tienen más cancelaciones?
* ¿qué países tienen mayor ticket medio?
* ¿qué productos suelen comprarse juntos?
* ¿hay clientes que compran de forma recurrente?
* ¿qué meses presentan más devoluciones?
* ¿existe algún producto cuya demanda esté creciendo?

No todas estas preguntas tienen la misma dificultad.

Podéis pedir ayuda a la IA:

> Tengo estas variables disponibles.
>
> Propón cinco preguntas de negocio que puedan responderse con estos datos y explica qué decisión podría apoyar cada una.

Después elegid una:

<p class="write-line"></p>

---

<details class="aside aside--help">
  <summary>Estoy atascado · el código que me da la IA falla</summary>
  <ol>
    <li>Leed el error entero, no la última línea. Suele decir qué columna o qué tipo no encaja.</li>
    <li>Comprobad que las columnas que usa existen con ese nombre exacto en vuestro dataframe.</li>
    <li>Comprobad que trabaja sobre el dataset ya limpio, y no sobre el original.</li>
    <li>Pegadle el error tal cual y pedidle que explique la causa antes de proponer otro código.</li>
    <li>Si el código funciona pero el resultado es raro, el problema no es el código: revisad qué filas está contando.</li>
  </ol>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Dataset analizable, con las variables derivadas que necesitáis.</li>
    <li>Evolución temporal de las ventas, con el mes incompleto identificado.</li>
    <li>Productos por unidades y por ingresos, comparados.</li>
    <li>Análisis por país y por cliente.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué importa que el último mes esté incompleto?</li>
    <li>El producto que más unidades vende, ¿es el más importante?</li>
    <li>¿Qué dice el principio de Pareto sobre vuestros clientes?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque en un gráfico aparece como una caída brutal de ventas que no ha ocurrido. Es un artefacto de los datos, no del negocio.</p>
  <p>2 · Depende de la métrica. Diez mil unidades a 1 € valen menos que mil a 50 €. La métrica elegida cambia la respuesta.</p>
  <p>3 · Que una parte pequeña de los clientes suele concentrar una parte grande de los ingresos. Hay que comprobarlo, no suponerlo.</p>
</details>

---

## Sesión 3 · De análisis a decisión

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo emplear la IA como asistente de análisis distinguiendo hechos de interpretaciones, supuestos y recomendaciones.</li>
    <li><strong>2. Haz:</strong> Diseña prompts analíticos estructurados, contrasta las conclusiones de la IA y verifica las evidencias subyacentes.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall sobre correlación vs causalidad y límites de los datos.</li>
  </ol>
</div>

### IA como analista: una forma mejor de preguntar

Evitemos:

> Analiza este CSV y dime cosas interesantes.

Es demasiado abierto.

Preferimos algo así:

<div class="prompt">
  <p class="prompt-label">Prompt estructurado</p>
  <p class="flow-role">Contexto</p>
  <p>Eres un analista ayudándome a estudiar las ventas de una tienda online.</p>
  <p class="flow-role">Pregunta</p>
  <p>Quiero saber si existen meses con una demanda claramente superior.</p>
  <p class="flow-role">Datos</p>
  <p>Disponemos de <code>InvoiceDate</code>, <code>Quantity</code> y <code>UnitPrice</code>.</p>
  <p class="flow-role">Tarea</p>
  <ol>
    <li>Indica qué métrica utilizarías.</li>
    <li>Explica los posibles problemas del análisis.</li>
    <li>Genera código Python.</li>
    <li>Genera una visualización adecuada.</li>
    <li>No extraigas conclusiones que los datos no permitan justificar.</li>
  </ol>
</div>

Esto obliga al asistente a trabajar de forma más estructurada.

---

### Los gráficos también pueden engañar

No todos los gráficos sirven para todo.

Algunas reglas básicas:

| Qué queremos mostrar | Gráfico habitual |
| --- | --- |
| Evolución temporal | Líneas |
| Comparar categorías | Barras |
| Relación entre dos variables numéricas | Dispersión |

La IA puede recomendar un gráfico.

Pero debemos comprobar que sea adecuado.

---

### Cuarta actividad — Detectar una mala visualización

Pedid deliberadamente:

> Representa las ventas mensuales utilizando un gráfico circular.

Observad el resultado.

Después preguntad:

> ¿Es esta la mejor visualización para estudiar evolución temporal? Justifica la respuesta y propón otra.

La IA no debe utilizarse únicamente para obtener respuestas.

También podemos utilizarla para **criticar respuestas**.

---

### Correlación no significa causalidad

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

---

### Otro peligro: convertir una asociación en una historia

Los modelos de lenguaje son especialmente buenos construyendo explicaciones convincentes.

Por ejemplo:

> Las ventas aumentan en noviembre probablemente debido a que los consumidores comienzan sus compras navideñas.

Puede ser razonable.

Pero, ¿lo demuestra nuestro dataset?

No necesariamente.

Podemos formularlo como hipótesis —«una posible explicación sería…»— pero no como hecho demostrado.

---

### Quinta actividad — Auditoría de una conclusión de IA

Elegid uno de vuestros resultados.

Preguntad a Copilot:

> Interpreta este resultado y propón una decisión empresarial.

Después actuad como revisores.

Separad su respuesta en cuatro partes:

<figure class="diagram">
  <figcaption>Desmontad la respuesta del agente</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Hecho</span>Directamente respaldado por los datos<span class="write-line"></span></li>
    <li><span class="flow-role">Interpretación</span>Una explicación razonable pero no demostrada<span class="write-line"></span></li>
    <li><span class="flow-role">Recomendación</span>Una acción propuesta<span class="write-line"></span></li>
    <li><span class="flow-role">Supuesto</span>Algo que damos por cierto sin evidencia suficiente<span class="write-line"></span></li>
  </ol>
</figure>

---

### De los datos a una decisión

Una buena recomendación debería tener esta estructura: evidencia, interpretación, decisión, riesgo y métrica de seguimiento.

<figure class="diagram">
  <figcaption>Ejemplo de recomendación completa</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Evidencia</span>Las ventas del producto X aumentan antes de noviembre</li>
    <li><span class="flow-role">Interpretación</span>Podría existir una demanda estacional</li>
    <li><span class="flow-role">Decisión</span>Aumentar moderadamente el stock antes de ese periodo</li>
    <li><span class="flow-role">Riesgo</span>Solo disponemos de un año completo</li>
    <li><span class="flow-role">Métrica</span>Comparar roturas de stock y unidades no vendidas</li>
  </ol>
</figure>

Esto es mucho mejor que:

> Vende más producto X.

---

### El límite de nuestros datos

Nuestro dataset es real.

Pero eso no significa que podamos responder cualquier pregunta.

Por ejemplo, no conocemos necesariamente el coste del producto, el margen, los gastos de envío, las campañas publicitarias, la satisfacción, la competencia ni el stock disponible.

Por tanto:

> **más ingresos no significa necesariamente más beneficio.**

Esta distinción es importante.

---

### Sexta actividad — ¿Qué NO podemos saber?

Escribid al menos tres preguntas empresariales que os gustaría responder pero que **no puedan responderse correctamente con este dataset**.

Por ejemplo: ¿qué producto genera mayor beneficio? Si solo conocemos el precio de venta y no el coste, no podemos saberlo.

<ol class="fill-in" aria-label="Espacio para escribir las preguntas que el dataset no permite responder">
  <li><span class="visually-hidden">Pregunta 1</span></li>
  <li><span class="visually-hidden">Pregunta 2</span></li>
  <li><span class="visually-hidden">Pregunta 3</span></li>
</ol>

Esta actividad también se evalúa.

Saber decir «estos datos no permiten responderlo» es una competencia importante.

---

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 3</p>
  <ul class="checklist">
    <li>Una visualización engañosa detectada y explicada.</li>
    <li>Una conclusión de la IA auditada: qué afirma, con qué evidencia y qué le falta.</li>
    <li>Separados hecho, interpretación, recomendación y supuesto.</li>
    <li>Lista de lo que estos datos NO pueden responder.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué correlación no es causalidad? Poned un ejemplo del dataset.</li>
    <li>La IA afirma algo con seguridad. ¿Qué le pedís?</li>
    <li>¿Qué NO podéis saber con este dataset?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque dos cosas pueden subir a la vez por una tercera causa, o por casualidad. Ventas y mes de diciembre suben juntos sin que uno cause al otro.</p>
  <p>2 · La evidencia: qué filas, qué cálculo, qué margen. Y qué explicación alternativa ha descartado.</p>
  <p>3 · Por qué compra la gente, qué pasó con quien no compró, si el precio era competitivo, qué hizo la competencia: nada de eso está en el fichero.</p>
</details>

---

## Sesión 4 · El informe para dirección

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo sintetizar hallazgos analíticos en un informe ejecutivo claro y accionable para perfiles no técnicos.</li>
    <li><strong>2. Haz:</strong> Elabora la presentación de 4 diapositivas estructurando datos, descubrimientos, propuestas y limitaciones.</li>
    <li><strong>3. Entrega:</strong> Entrega el informe ejecutivo final junto con el código reproducible del análisis.</li>
  </ol>
</div>

### Producto final — Informe para dirección

Imaginad que vuestro responsable no sabe Python.

No quiere ver 300 líneas de código.

Quiere saber:

> ¿Qué has descubierto y qué harías?

Preparad un informe de aproximadamente **cuatro diapositivas**.

#### Diapositiva 1 — ¿Qué datos tenemos?

Muy breve: origen, periodo, número aproximado de registros, variables principales y decisiones de limpieza importantes.

#### Diapositiva 2 — Tres hallazgos

Seleccionad los **tres resultados más relevantes**.

Cada resultado debe tener una frase, una cifra y un gráfico.

No llenéis la diapositiva de tablas.

#### Diapositiva 3 — Decisiones

Proponed **dos decisiones**. Para cada una:

<figure class="diagram">
  <figcaption>Estructura de cada decisión</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Evidencia</li>
    <li>Decisión</li>
    <li>Riesgo</li>
    <li>Métrica</li>
  </ol>
</figure>

#### Diapositiva 4 — Lo que todavía no sabemos

Incluid las limitaciones, la información adicional que pediríais y una conclusión de la IA que hayáis tenido que corregir o matizar.

---

### También entregamos el análisis

Entregad vuestro <code>analisis.ipynb</code> o equivalente.

Debe poder seguirse el proceso:

<figure class="diagram">
  <figcaption>Lo que debe verse en el cuaderno</figcaption>
  <ol class="flow flow--row">
    <li>Carga</li>
    <li>Comprobaciones</li>
    <li>Limpieza</li>
    <li>Análisis</li>
    <li>Gráficos</li>
  </ol>
</figure>

No se evaluará si habéis escrito personalmente cada línea de Python.

Podéis utilizar IA.

---

### Entonces, ¿qué se evalúa?

No evaluaremos principalmente vuestra capacidad para recordar sintaxis de pandas.

Evaluaremos vuestra capacidad para utilizar datos e IA de forma razonada.

---

### Evaluación

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

#### Una norma importante

Una conclusión no obtiene mejor nota porque sea sorprendente.

Obtiene mejor nota si está **bien respaldada por los datos**.

---

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · entrega</p>
  <ul class="checklist">
    <li>Informe con tres hallazgos y dos decisiones.</li>
    <li>Cada hallazgo apoyado en una evidencia del análisis.</li>
    <li>Limitaciones declaradas explícitamente.</li>
    <li>Notebook o análisis entregado junto al informe.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre un hallazgo y una recomendación?</li>
    <li>¿Por qué se entrega también el análisis y no solo las conclusiones?</li>
    <li>Si la dirección os pregunta «¿estás seguro?», ¿qué enseñáis?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El hallazgo es lo que dicen los datos; la recomendación es lo que proponéis hacer con ello, y ya incluye un juicio vuestro.</p>
  <p>2 · Porque una conclusión sin el camino que lleva a ella no se puede comprobar ni corregir.</p>
  <p>3 · La evidencia: el cálculo, las filas implicadas y las limitaciones que ya habíais declarado.</p>
</details>

---

## Lo que debes recordar

### La IA no sustituye el análisis

La IA nos puede ayudar a:

<ul class="checklist">
  <li>escribir código;</li>
  <li>limpiar datos;</li>
  <li>hacer cálculos;</li>
  <li>generar gráficos;</li>
  <li>proponer preguntas;</li>
  <li>detectar posibles problemas;</li>
  <li>explicar resultados.</li>
</ul>

Pero nosotros debemos decidir:

* ¿la pregunta tiene sentido?
* ¿la métrica es correcta?
* ¿los datos son adecuados?
* ¿el gráfico representa lo que creemos?
* ¿la conclusión se desprende realmente de los datos?
* ¿la decisión está justificada?

---

### El método que queremos aprender

Cuando en el futuro alguien os entregue cualquier dataset:

<figure class="diagram">
  <figcaption>El método, paso a paso</figcaption>
  <ol class="flow">
    <li>Dataset</li>
    <li>¿Qué contiene?</li>
    <li>¿Tiene problemas?</li>
    <li>¿Qué quiero saber?</li>
    <li>Pedir ayuda a la IA</li>
    <li>Ejecutar el análisis</li>
    <li>Comprobar el resultado</li>
    <li>Visualizar</li>
    <li>Interpretar</li>
    <li>¿Qué puedo concluir?</li>
    <li>¿Qué no puedo saber?</li>
    <li>Decidir</li>
  </ol>
</figure>

---

### Lo importante que debes recordar

Dentro de unos años probablemente no recordaréis cómo se escribe exactamente:

```python
df.groupby(...)
```

Y no pasa nada.

Podréis pedir ayuda a una IA.

Lo importante es que sepáis formular preguntas como:

* ¿qué datos necesito?
* ¿qué significa realmente esta variable?
* ¿hay errores o casos especiales?
* ¿qué métrica debería utilizar?
* ¿esta conclusión está respaldada?
* ¿qué decisión puedo tomar?
* ¿qué información me falta?

Una herramienta puede generar el código.

**La responsabilidad de entender qué significa el resultado sigue siendo del desarrollador.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Dataset | El conjunto de datos tal como llega, antes de tocarlo |
| Calidad | Qué está mal, qué falta y qué es raro pero correcto |
| Variable derivada | La columna que no viene y hay que calcular |
| Métrica | Lo que decidimos medir; cambiarla cambia la respuesta |
| Mes incompleto | El tramo parcial que finge ser una caída |
| Pareto | Que una parte pequeña suele concentrar una parte grande |
| Correlación | Que dos cosas se mueven juntas |
| Causalidad | Que una provoca la otra; hace falta mucho más para afirmarlo |
| Hecho | Lo que dicen los datos |
| Interpretación | Lo que creemos que significa |
| Supuesto | Lo que damos por cierto sin haberlo comprobado |
| Limitación | Lo que estos datos no pueden responder |

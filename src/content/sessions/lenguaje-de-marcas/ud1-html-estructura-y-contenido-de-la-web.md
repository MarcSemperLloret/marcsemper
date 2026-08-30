---
title: "HTML: estructura y contenido de la Web"
label: "UD1 · Guía y taller práctico"
section: "ud-01"
order: 1
lang: "es"
summary: "HTML no es un catálogo de etiquetas que memorizar, sino un conjunto de decisiones sobre qué significa cada trozo de información. Durante 18 sesiones construyes un sitio multipágina real sin una sola línea de CSS, reparando código roto, refactorizando maquetación heredada y auditando webs en producción."
duration: "18 sesiones · 6 semanas"
modality: "Individual, con retos y revisión en pareja"
deliverable: "Sitio web multipágina de cuatro páginas enlazadas, escrito solo con HTML semántico, validado en el W3C y revisado por otro alumno."
outcomes:
  - "Montar un proyecto web en VS Code y detectar errores antes de abrir el navegador."
  - "Escribir documentos HTML5 válidos con los metadatos que de verdad cambian algo: charset, viewport, lang y title."
  - "Ordenar el contenido con una jerarquía de encabezados que funcione como índice del documento."
  - "Enlazar archivos con rutas relativas que sigan funcionando al mover el proyecto de sitio."
  - "Elegir el texto alternativo correcto para una imagen, incluido decidir cuándo debe ir vacío."
  - "Sustituir maquetación a base de div por elementos semánticos y justificar cada sustitución."
  - "Construir tablas accesibles y reconocer cuándo unos datos no son una tabla."
  - "Escribir formularios que se puedan usar con el teclado y con un lector de pantalla."
  - "Auditar un documento ajeno, localizar sus fallos y proponer la corrección concreta."
requirements:
  - "Visual Studio Code con la extensión HTMLHint instalada."
  - "Un navegador moderno con DevTools: Chrome, Firefox o Edge."
  - "El validador oficial del W3C, en validator.w3.org."
  - "Una carpeta de trabajo local para el proyecto, con copia de seguridad."
priorKnowledge:
  - "Manejo básico del sistema de archivos: crear carpetas, guardar y mover ficheros."
date: "2026-08-30"
---

## ¿Cómo está diseñada esta unidad?

Aprender HTML no consiste en memorizar cien etiquetas. Consiste en **decidir qué significa cada trozo de información** y marcarlo en consecuencia. La lista de etiquetas está publicada y se consulta; el criterio no.

Por eso esta unidad no avanza explicando etiquetas una detrás de otra. Avanza planteando decisiones: ¿esto es una lista o un párrafo?, ¿esta imagen aporta información o decora?, ¿esto es una tabla o lo parece?

Cada sesión dura **una hora** y tiene siempre la misma forma:

<figure class="diagram">
  <figcaption>El ritmo de cada sesión</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Aprende · 15 min</li>
    <li>Haz · 30 min</li>
    <li>Comprueba · 15 min</li>
  </ol>
</figure>

Tres sesiones por semana, seis semanas, dieciocho horas. Al final tendrás un sitio web de cuatro páginas construido por ti.

### El cliente de la unidad

Todo lo que construyas será para la misma empresa ficticia, para que las decisiones tengan un contexto y no sean ejercicios sueltos:

<p class="single-node">PixelStore</p>

Tienda de componentes, periféricos y herramientas para desarrolladores. Cuarenta y cinco trabajadores. Vende hardware por internet y necesita una web que se pueda leer, indexar y usar con un lector de pantalla.

<div class="rule">
  <p class="rule-label">La condición que define toda la unidad · cero CSS</p>
  <p>Durante estas seis semanas está prohibido escribir estilos: ni ficheros <code>.css</code>, ni etiquetas <code>&lt;style&gt;</code>, ni atributos <code>style="..."</code>.</p>
  <p>No es un capricho. Si puedes maquillar el resultado, la tentación es resolver los problemas de estructura con apariencia. Sin CSS, la única forma de que un documento se entienda es que <strong>esté bien estructurado</strong>. La página te va a parecer fea, y esa es exactamente la idea: lo que estás evaluando no es cómo se ve, sino qué significa.</p>
</div>

---

## Plan de trabajo semanal

| Semana | Bloque temático | Práctica central y entregable semanal | Horas |
| :---: | :--- | :--- | :---: |
| **Semana 1** | El editor y el documento HTML | Entorno, reparación de HTML roto e `index.html` inicial | 3 h |
| **Semana 2** | Texto, listas, rutas y navegación | Laberinto de rutas relativas y sitio multipágina enlazado | 3 h |
| **Semana 3** | Imágenes y semántica estructural | Criterio de `alt`, refactorización de *div soup* y auditoría | 3 h |
| **Semana 4** | Tablas para datos tabulares | Tabla comparativa accesible y matriz de idoneidad | 3 h |
| **Semana 5** | Formularios accesibles | Formulario comercial con validación nativa y auditoría | 3 h |
| **Semana 6** | Depuración, auditoría y coevaluación | HTML forense, validación W3C y revisión por pares | 3 h |
| **Total** | | **Sitio multipágina validado y revisado** | **18 h** |

---

## Semana 1 · El editor y el documento HTML

---

## Sesión 1 · El editor, el proyecto y el primer documento

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué se trabaja con carpetas de proyecto y no con archivos sueltos, y por qué el navegador no es un buen corrector de HTML.</li>
    <li><strong>2. Haz:</strong> Monta el entorno con HTMLHint y reconstruye un documento a partir de su resultado visible.</li>
    <li><strong>3. Comprueba:</strong> El documento se ve correctamente y el panel de problemas está a cero.</li>
  </ol>
</div>

### ¿Qué vamos a aprender?

Antes de escribir una sola etiqueta hay que resolver algo que casi nadie explica: **por qué un navegador no sirve para saber si tu HTML está bien**.

Prueba mental. Este documento está roto de cuatro formas distintas:

```html
<html>
<head>
<title>PixelStore
</head>
<body>
<h1>Bienvenido
<p>Componentes para desarrolladores
</body>
```

Falta el `doctype`, falta el idioma, falta la codificación, y hay tres etiquetas sin cerrar. Ábrelo en cualquier navegador y verás un título grande y un párrafo debajo. **Se ve perfectamente.**

Eso ocurre porque un navegador está diseñado para no fallar nunca delante de un usuario. Ante un documento roto no muestra un error: adivina lo que querías decir y lo repara en silencio.

> **Que una página se vea bien no demuestra que su HTML esté bien. Solo demuestra que el navegador ha sabido disimularlo.**

Y lo que el navegador disimula, otros programas no lo perdonan: un buscador que indexa el contenido, un lector de pantalla que lo lee en voz alta, o el propio CSS cuando en la siguiente unidad intentes seleccionar un elemento que en realidad quedó anidado donde no debía.

Por eso necesitamos una herramienta que sí nos avise:

<p class="term">Linter</p>

Un programa que analiza el código mientras lo escribes y señala errores, etiquetas sin cerrar y malas prácticas, sin ejecutarlo. En esta unidad usaremos **HTMLHint** dentro de VS Code.

#### Y por qué una carpeta de proyecto

Un sitio web no es un archivo: es un conjunto de archivos que se referencian entre sí. Si abres archivos sueltos, el editor no sabe dónde está la raíz del sitio, no puede resolver las rutas que escribes ni autocompletarlas, y el linter solo analiza lo que tengas abierto en ese momento.

| Si abres... | El editor puede... |
| ----------- | ------------------ |
| Un archivo suelto | Colorear la sintaxis de ese archivo |
| La carpeta del proyecto | Resolver rutas, autocompletar enlaces, buscar en todo el sitio y analizarlo entero |

### Monta el entorno

1. Crea en tu equipo una carpeta llamada `pixelstore`.
2. Abre VS Code y usa `Archivo → Abrir carpeta` para abrir **la carpeta**, no un archivo.
3. Abre el panel de extensiones con `Ctrl + Shift + X`, busca **HTMLHint** e instálala.
4. Localiza dos atajos que vas a usar durante seis semanas: `Ctrl + Shift + P` abre la paleta de comandos y `Ctrl + Shift + M` abre el panel de problemas.

### Tarea 1 · Reconstruye este documento

Esto es lo que debe verse en el navegador. No te doy el código: te doy el resultado.

```text
Marc Semper
Desarrollo de Aplicaciones Web
Primer curso

Bienvenido a mi primera página web. Estoy aprendiendo a estructurar
documentos utilizando HTML5 estándar.
```

Crea `index.html` y escribe el HTML mínimo que represente esa información: un encabezado principal, un encabezado secundario, un párrafo, y énfasis donde tenga sentido.

La palabra importante es **mínimo**. Si has escrito una etiqueta que no aporta significado, sobra.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Tienes la carpeta del proyecto abierta en VS Code, no archivos sueltos.</li>
    <li>HTMLHint está instalado y ves su salida en el panel de problemas.</li>
    <li>Entiendes por qué el navegador no sirve para validar HTML.</li>
    <li>Tu <code>index.html</code> se ve como el resultado pedido y no genera avisos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué se abre la carpeta entera en el editor y no el archivo?</li>
    <li>Una página se ve perfectamente en Chrome. ¿Demuestra eso que su HTML es correcto?</li>
    <li>¿Qué hace un linter que no hace el navegador?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para que el editor conozca la raíz del proyecto: así resuelve y autocompleta las rutas relativas, busca en todos los archivos y aplica el linter a todo el sitio.</p>
  <p>2 · No. El navegador repara en silencio el HTML roto para no fallar delante del usuario, así que una página rota puede verse igual que una correcta.</p>
  <p>3 · Avisar de errores sin ejecutar el documento: etiquetas sin cerrar, anidaciones imposibles, atributos inválidos y malas prácticas.</p>
</details>

---

## Sesión 2 · Anatomía de un elemento y HTML roto

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es exactamente un elemento, en qué se diferencia de una etiqueta y de un atributo, y qué regla gobierna la anidación.</li>
    <li><strong>2. Haz:</strong> Diagnostica y repara un documento defectuoso justificando cada corrección.</li>
    <li><strong>3. Comprueba:</strong> El panel de problemas queda en cero errores.</li>
  </ol>
</div>

### Elemento, etiqueta y atributo no son lo mismo

Se usan como sinónimos y no lo son. Mira esta línea:

```html
<p class="destacado">Texto con <strong>énfasis</strong>.</p>
```

| Pieza | Qué es |
| ----- | ------ |
| `<p ...>` | La **etiqueta de apertura** |
| `class="destacado"` | Un **atributo**, con su nombre y su valor entre comillas |
| `Texto con <strong>énfasis</strong>.` | El **contenido**, que aquí incluye otro elemento dentro |
| `</p>` | La **etiqueta de cierre** |
| Todo junto | El **elemento** |

<p class="term">Elemento</p>

La unidad completa: apertura, contenido y cierre. La etiqueta es solo la marca que lo delimita. Cuando decimos «un párrafo» hablamos del elemento; cuando decimos «se te ha olvidado el `</p>`» hablamos de la etiqueta.

#### Elementos vacíos

Algunos elementos no tienen contenido, porque no lo necesitan: no envuelven nada, aportan algo por sí mismos. Se escriben con una sola etiqueta y **no se cierran**.

```html
<meta charset="UTF-8">
<img src="teclado.webp" alt="Teclado mecánico compacto">
<br>
<hr>
```

Escribir `</img>` no es un estilo distinto: es un error.

#### La regla de la anidación

Los elementos se abren y se cierran como paréntesis: **el último que se abre es el primero que se cierra**.

```html
<p>Un <strong>teclado <em>mecánico</em></strong> compacto.</p>
```

Ese documento es correcto: `em` se cierra dentro de `strong`, y `strong` dentro de `p`. Este otro no:

```html
<p>Un <strong>teclado <em>mecánico</strong></em> compacto.</p>
```

Aquí `strong` se cierra antes que `em`, que se abrió después. El navegador lo mostrará parecido, porque volverá a adivinar, pero la estructura que construye internamente ya no es la que escribiste.

### Tarea 2 · Repara el HTML roto

Copia este fragmento en un archivo `roto.html` dentro de tu proyecto:

```html
<html>
<head>
<title>Mi web
</head>
<body>
<h1>Mi web
<p>Hola
</body>
```

<p class="stage">Paso 1 · Te enseño uno</p>

El primer fallo lo diagnostico yo, para que veas el formato de respuesta que espero:

<dl class="worked">
  <dt>¿Qué está mal?</dt>
  <dd>La etiqueta <code>&lt;title&gt;</code> se abre pero nunca se cierra antes de <code>&lt;/head&gt;</code>.</dd>
  <dt>¿Qué hace el navegador con eso?</dt>
  <dd>Cierra el título por su cuenta al encontrar <code>&lt;/head&gt;</code>. La pestaña se ve bien, así que el fallo pasa inadvertido.</dd>
  <dt>¿A quién perjudica?</dt>
  <dd>A cualquier programa que lea el documento tal cual está escrito en lugar de repararlo: buscadores, lectores de pantalla, validadores.</dd>
  <dt>Corrección</dt>
  <dd><code>&lt;title&gt;Mi web&lt;/title&gt;</code></dd>
</dl>

Fíjate en el orden de las preguntas. No basta con decir «falta una etiqueta»: interesa qué consecuencia tiene, porque es lo que te permitirá priorizar cuando encuentres veinte fallos a la vez.

<p class="stage stage--solo">Paso 2 · Hazlo tú</p>

1. Abre el panel de problemas con `Ctrl + Shift + M` y anota qué detecta HTMLHint y qué no.
2. Repara el documento: añade `<!doctype html>`, el atributo `lang="es"`, la codificación, el *viewport*, y cierra todas las etiquetas pendientes.
3. Al final del archivo escribe un comentario HTML explicando los **tres fallos más graves** del original y por qué lo eran.

<details class="aside aside--help">
  <summary>Estoy atascado · no sé cuáles son los «más graves»</summary>
  <p>Ordena por a quién afecta y cuánto:</p>
  <ol>
    <li>¿Impide que el documento se interprete como HTML estándar? Eso afecta a todo lo demás.</li>
    <li>¿Hace que el texto se lea mal, en el sentido literal de que se vean caracteres incorrectos?</li>
    <li>¿Deja al documento sin información que ningún programa puede adivinar, como el idioma?</li>
    <li>¿Es una etiqueta sin cerrar que el navegador repara sin consecuencias visibles?</li>
  </ol>
  <p>Los tres primeros grupos pesan más que el cuarto, aunque el cuarto sea el que más veces aparece.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Distingues elemento, etiqueta y atributo, y sabes cuál es cuál en una línea de código.</li>
    <li>Sabes qué elementos no se cierran y por qué.</li>
    <li>Sabes explicar la regla de anidación con un ejemplo correcto y uno incorrecto.</li>
    <li>Tu <code>roto.html</code> queda a cero errores y con el comentario justificativo.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre un elemento y una etiqueta?</li>
    <li>Escribe de memoria dos elementos que no se cierren.</li>
    <li>¿Por qué <code>&lt;strong&gt;a&lt;em&gt;b&lt;/strong&gt;&lt;/em&gt;</code> está mal si se ve bien?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El elemento es la unidad completa: apertura, contenido y cierre. La etiqueta es solo la marca que lo delimita.</p>
  <p>2 · Por ejemplo <code>&lt;meta&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;br&gt;</code> o <code>&lt;hr&gt;</code>: elementos vacíos, sin contenido que envolver.</p>
  <p>3 · Porque rompe el orden de anidación: <code>em</code> se abrió el último y debería cerrarse el primero. El navegador reconstruye una estructura distinta de la escrita, y esa estructura es la que verán el CSS, el buscador y el lector de pantalla.</p>
</details>

---

## Sesión 3 · La estructura completa y el primer documento del proyecto

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué hace cada pieza del esqueleto de un documento y qué se rompe exactamente cuando falta.</li>
    <li><strong>2. Haz:</strong> Escribe la portada de PixelStore con la estructura completa y resuelve el primer reto.</li>
    <li><strong>3. Comprueba:</strong> Los acentos se ven bien y la página es legible en la vista de móvil de DevTools.</li>
  </ol>
</div>

### El esqueleto de cualquier página

```html
<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PixelStore | Componentes y tecnología para desarrolladores</title>
</head>
<body>
    <h1>PixelStore</h1>
    <p>Especialistas en hardware, periféricos y herramientas de desarrollo.</p>
</body>
</html>
```

Cinco líneas que se copian siempre y casi nunca se explican. Vamos a explicarlas, porque cada una responde a una pregunta distinta y cada omisión tiene un síntoma distinto:

| Pieza | Qué declara | Qué pasa si falta |
| ----- | ----------- | ----------------- |
| `<!doctype html>` | Que el documento es HTML estándar | El navegador entra en *modo compatibilidad* y aplica reglas antiguas de hace veinte años |
| `lang="es"` | El idioma del contenido | Un lector de pantalla lo pronuncia con fonética inglesa y se vuelve incomprensible |
| `charset="UTF-8"` | Cómo se traducen los bytes a caracteres | «Programación» se muestra como «ProgramaciÃ³n» |
| `viewport` | Que se adapte al ancho real del dispositivo | En un móvil se muestra la página de escritorio encogida, ilegible |
| `<title>` | El nombre del documento | Es lo que se ve en la pestaña, en los favoritos y como titular en un buscador |

#### Head y body no compiten

<figure class="diagram">
  <figcaption>Las dos mitades del documento</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>head · información sobre la página</li>
    <li>body · contenido de la página</li>
  </ol>
</figure>

En el `<head>` va lo que el navegador necesita saber **antes** de dibujar nada: idioma, codificación, título, comportamiento en móviles. Nada de lo que hay ahí se ve en la ventana. En el `<body>` va todo lo que sí se ve.

Un error típico de las primeras semanas es meter contenido en el `head` porque «también es información». La prueba es sencilla: si es algo que un lector debería leer, va en el `body`.

### Proyecto · La portada de PixelStore

Crea `index.html` en la raíz de tu carpeta `pixelstore` y constrúyela con:

* El esqueleto completo y los cuatro metadatos correctos.
* Un **único** `<h1>` con el nombre del proyecto.
* Al menos tres `<h2>` que dividan la portada en áreas temáticas.
* Párrafos descriptivos reales, con `<strong>` y `<em>` solo donde aporten significado.

Este archivo no es un ejercicio desechable: es la primera página del sitio que entregarás dentro de seis semanas.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación · dos pruebas de un minuto</p>
  <p>Escribe en algún párrafo la palabra «Programación». Si se ve correctamente, tu <code>charset</code> está bien. Después abre DevTools con <code>F12</code>, activa la vista de dispositivo móvil y comprueba que el texto se lee sin hacer zoom: si hay que ampliar, falta el <em>viewport</em>.</p>
</div>

### Reto 1 · Los módulos de DAW (10 min)

Representa esta estructura con **el mínimo HTML razonable y semánticamente correcto**:

```text
DAW
 ├ Lenguajes de Marcas
 ├ Programación
 └ Bases de Datos
```

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 1</summary>
  <p>Es una relación de pertenencia sin orden, o sea una lista dentro de otra lista:</p>
  <pre><code>&lt;ul&gt;
  &lt;li&gt;DAW
    &lt;ul&gt;
      &lt;li&gt;Lenguajes de Marcas&lt;/li&gt;
      &lt;li&gt;Programación&lt;/li&gt;
      &lt;li&gt;Bases de Datos&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/li&gt;
&lt;/ul&gt;</code></pre>
  <p>La lista anidada va <strong>dentro</strong> del <code>&lt;li&gt;</code> de DAW, no detrás de él. Si la sacas fuera, estás diciendo que los tres módulos son hermanos de DAW en lugar de partes suyas.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 3</p>
  <ul class="checklist">
    <li>Sabes escribir el esqueleto de memoria.</li>
    <li>Sabes decir qué se rompe al quitar cada uno de los cuatro metadatos.</li>
    <li>Distingues qué va en <code>head</code> y qué va en <code>body</code>.</li>
    <li>Tu portada tiene un solo <code>h1</code> y al menos tres <code>h2</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué síntoma concreto delata que falta el <code>charset</code>?</li>
    <li>¿A quién perjudica que falte <code>lang="es"</code>?</li>
    <li>¿Cuántos <code>h1</code> debería tener una página y por qué?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Los caracteres no ingleses se muestran mal: acentos, eñes y signos de apertura aparecen como símbolos extraños.</p>
  <p>2 · Sobre todo a quien usa un lector de pantalla, que elige la voz y la fonética según el idioma declarado y leerá el español con pronunciación inglesa. También a los buscadores, que lo usan para clasificar la página.</p>
  <p>3 · Uno. Es el título del documento entero; si hay dos, ya no hay forma de saber cuál es el tema de la página.</p>
</details>

---

## Semana 2 · Texto, listas, rutas y navegación

---

## Sesión 4 · Jerarquía de encabezados y listas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Que los encabezados son el índice del documento y no una escala de tamaños, y qué distingue a cada tipo de lista.</li>
    <li><strong>2. Haz:</strong> Convierte información en bruto en una estructura marcada y resuelve el segundo reto.</li>
    <li><strong>3. Comprueba:</strong> Ningún encabezado se salta un nivel.</li>
  </ol>
</div>

### Los encabezados son un índice, no unos tamaños

Este es el malentendido más caro de toda la unidad. Como `h1` se ve grande y `h4` se ve pequeño, es tentador elegir el número por el tamaño que queda bonito.

No es para lo que sirven. Los encabezados construyen el **índice** del documento: la misma estructura que un lector de pantalla usa para saltar de sección en sección, y que un buscador usa para entender de qué habla la página.

<figure class="diagram">
  <figcaption>Lo que declara una jerarquía de encabezados</figcaption>
  <ol class="flow">
    <li>h1 · el tema del documento entero, una sola vez</li>
    <li>h2 · cada sección principal</li>
    <li>h3 · cada apartado dentro de una sección</li>
    <li>h4 · subdivisiones, si de verdad hacen falta</li>
  </ol>
</figure>

La regla práctica es una: **no se salta ningún nivel hacia abajo**. Después de un `h1` viene un `h2`, no un `h3`. Saltar equivale a escribir un índice con el capítulo 1, el apartado 1.1.1 y nada en medio: quien lo lea de forma secuencial se pierde.

<div class="rule">
  <p class="rule-label">Cómo elegir el nivel sin equivocarse</p>
  <p>No preguntes «¿qué tamaño quiero?». Pregunta <strong>«¿de qué es esto una parte?»</strong>. Si es una parte de la sección anterior, baja un nivel. Si es una sección nueva del mismo rango, usa el mismo nivel. Si el tamaño resultante no te gusta, es un problema de CSS, y el CSS lo veremos en la siguiente unidad.</p>
</div>

#### Párrafos y saltos de línea

Otro clásico: separar párrafos con `<br>`.

```html
<!-- Mal -->
Componentes para desarrolladores.<br><br>Envíos en 24 horas.

<!-- Bien -->
<p>Componentes para desarrolladores.</p>
<p>Envíos en 24 horas.</p>
```

Las dos versiones se ven casi igual. La diferencia es que la primera dice «aquí hay un texto suelto con dos saltos de línea» y la segunda dice «aquí hay dos párrafos». `<br>` existe para saltos que forman parte del contenido, como los versos de un poema o las líneas de una dirección postal, no para separar bloques.

#### Tres listas para tres relaciones

| Lista | Se usa cuando | Ejemplo en PixelStore |
| ----- | ------------- | --------------------- |
| `<ul>` | El orden no cambia el significado | Los componentes que vende la tienda |
| `<ol>` | El orden **es** el significado | Los pasos para tramitar una devolución |
| `<dl>` | Cada elemento es un término y su definición | El glosario técnico de la ficha de producto |

La prueba para distinguir `ul` de `ol` es directa: si reordenas los elementos y la información sigue siendo correcta, es `ul`. Si al reordenarlos el contenido pasa a ser falso, es `ol`.

La lista de descripción funciona por pares:

```html
<dl>
  <dt>SSD</dt>
  <dd>Unidad de almacenamiento sin partes móviles.</dd>
  <dt>RAM</dt>
  <dd>Memoria de trabajo, volátil, que se vacía al apagar.</dd>
</dl>
```

### Tarea 3 · De texto plano a estructura

Recibes esta información sin ningún marcado:

```text
Componentes de un ordenador
Procesador
Memoria RAM
Almacenamiento SSD

Pasos para instalar un sistema operativo
Descargar la imagen oficial
Crear el medio de instalación USB
Arrancar el equipo desde el USB
Completar el asistente de instalación
Reiniciar y actualizar controladores
```

Tu trabajo:

1. Decide qué elemento representa el título de cada bloque, y con qué nivel.
2. Marca cada bloque con el tipo de lista que le corresponde, y **escribe en un comentario por qué** uno es `ul` y el otro es `ol`. Aplica la prueba de reordenar.
3. Añade debajo una `<dl>` que defina tres conceptos: CPU, RAM y SSD.

### Reto 2 · ¿Qué está mal aquí? (10 min)

```html
<p>
    <h2>Nuestros productos</h2>
</p>
```

¿Qué principio de HTML se está incumpliendo y qué hará el navegador con esto?

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 2</summary>
  <p>Un <code>&lt;p&gt;</code> solo puede contener contenido en línea: texto, <code>strong</code>, <code>em</code>, <code>a</code>, <code>img</code>… Un encabezado es un elemento de bloque y no cabe dentro de un párrafo.</p>
  <p>El navegador no muestra un error: cierra el párrafo por su cuenta justo antes del <code>&lt;h2&gt;</code> y deja suelto el <code>&lt;/p&gt;</code> del final. El resultado es que acabas con un párrafo vacío, un encabezado que no está donde creías y una etiqueta de cierre huérfana. Es el mismo patrón de la sesión 1: se ve bien, y la estructura real no es la que escribiste.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 4</p>
  <ul class="checklist">
    <li>Eliges el nivel de encabezado por pertenencia, no por tamaño.</li>
    <li>Tu portada no salta ningún nivel.</li>
    <li>Sabes aplicar la prueba de reordenar para decidir entre <code>ul</code> y <code>ol</code>.</li>
    <li>No estás usando <code>&lt;br&gt;</code> para separar párrafos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué está mal pasar de <code>h2</code> a <code>h4</code>?</li>
    <li>Da la prueba de una frase que distingue <code>ul</code> de <code>ol</code>.</li>
    <li>¿Para qué sirve entonces <code>&lt;br&gt;</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque los encabezados forman el índice del documento y saltar un nivel deja un hueco: quien navegue por encabezados no sabrá de qué es parte ese <code>h4</code>.</p>
  <p>2 · Si al reordenar los elementos la información sigue siendo cierta, es <code>ul</code>; si deja de serlo, es <code>ol</code>.</p>
  <p>3 · Para saltos de línea que forman parte del propio contenido: versos, líneas de una dirección postal. Nunca para separar bloques de texto.</p>
</details>

---

## Sesión 5 · El laberinto de las rutas relativas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Desde dónde se resuelve una ruta, qué significan <code>./</code> y <code>../</code>, y por qué una ruta de disco rompe el sitio al publicarlo.</li>
    <li><strong>2. Haz:</strong> Resuelve cinco rutas entre archivos situados en niveles distintos.</li>
    <li><strong>3. Comprueba:</strong> Mueve la carpeta del proyecto a otra ubicación y confirma que nada se rompe.</li>
  </ol>
</div>

### Una ruta se resuelve desde el archivo que la escribe

Esta es la idea que desatasca todo lo demás. Cuando escribes `href="productos.html"`, el navegador no busca ese archivo desde la raíz del proyecto ni desde donde tú estés mirando: lo busca **desde la carpeta del archivo que contiene el enlace**.

Por eso la misma ruta, escrita en dos archivos distintos, apunta a sitios distintos. No hay rutas correctas en abstracto: hay rutas correctas *desde un origen*.

| Escribes | Significa |
| -------- | --------- |
| `pagina.html` | Un archivo en **mi misma** carpeta |
| `./pagina.html` | Exactamente lo mismo, escrito de forma explícita |
| `carpeta/pagina.html` | Bajar a una carpeta que está dentro de la mía |
| `../pagina.html` | **Subir** un nivel y buscar allí |
| `../../pagina.html` | Subir dos niveles |
| `#seccion` | Saltar a un elemento con `id="seccion"` en esta misma página |

<p class="term">Ruta relativa</p>

La que describe el camino desde el archivo actual hasta el destino. Como no menciona dónde está instalado el sitio, sigue siendo válida si mueves el proyecto de carpeta, de ordenador o de servidor.

<div class="rule">
  <p class="rule-label">Por qué <code>C:\Users\...</code> no es un enlace</p>
  <p>Una ruta como <code>C:\Users\marc\web\index.html</code> o <code>file:///D:/proyecto/img/logo.webp</code> describe la posición del archivo <strong>en tu ordenador</strong>. Funciona mientras la web se abra desde tu ordenador, y deja de funcionar en el momento en que la abre cualquier otra persona, que es justo para lo que se hace una web.</p>
  <p>Si tu código contiene una letra de unidad o el prefijo <code>file:///</code>, el enlace está mal construido aunque en tu pantalla funcione.</p>
</div>

### Tarea 4 · El laberinto de rutas

Trabajamos sobre esta estructura:

```text
web/
├── index.html
├── img/
│   └── logo.webp
└── paginas/
    ├── productos.html
    └── contacto.html
```

<p class="stage">Paso 1 · Te enseño uno</p>

**Desde `productos.html`, enlazar `logo.webp`.**

<dl class="worked">
  <dt>¿Dónde estoy?</dt>
  <dd>En <code>web/paginas/</code>, porque ahí vive el archivo que escribe el enlace.</dd>
  <dt>¿Dónde está el destino?</dt>
  <dd>En <code>web/img/</code>.</dd>
  <dt>¿Cuál es el camino?</dt>
  <dd>Subir de <code>paginas/</code> a <code>web/</code>, y desde ahí bajar a <code>img/</code>.</dd>
  <dt>Ruta</dt>
  <dd><code>../img/logo.webp</code></dd>
</dl>

El truco es no intentar verlo de golpe. Se resuelve en tres pasos: dónde estoy, dónde voy, cuántos niveles subo antes de empezar a bajar.

<p class="stage stage--solo">Paso 2 · Hazlo tú</p>

Escribe la ruta exacta para cada caso:

1. Desde `productos.html`, volver a `index.html`.
2. Desde `index.html`, mostrar la imagen `logo.webp`.
3. Desde `contacto.html`, enlazar `productos.html`.
4. Desde `index.html`, enlazar `contacto.html`.
5. Desde `index.html`, saltar a una sección con `id="envios"` en esa misma página.

<details class="aside aside--extra">
  <summary>Ver soluciones</summary>
  <p>1 · <code>../index.html</code> — subo de <code>paginas/</code> a la raíz.</p>
  <p>2 · <code>img/logo.webp</code> — ya estoy en la raíz, solo bajo.</p>
  <p>3 · <code>productos.html</code> — los dos están en <code>paginas/</code>, misma carpeta.</p>
  <p>4 · <code>paginas/contacto.html</code> — bajo un nivel desde la raíz.</p>
  <p>5 · <code>#envios</code> — sin nombre de archivo: el destino está en el documento actual.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación de portabilidad · un minuto</p>
  <p>Mueve la carpeta entera del proyecto al escritorio, o a un pendrive, y navega por todos los enlaces. Si algo deja de funcionar, esa ruta no era relativa. Es la única prueba que importa, porque es lo que le pasará al proyecto cuando lo subas a un servidor.</p>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Desde dónde se resuelve una ruta relativa?</li>
    <li>¿Qué significa <code>../</code>?</li>
    <li>¿Por qué una ruta con <code>C:\</code> funciona en tu equipo y no en el del profesor?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Desde la carpeta del archivo que contiene el enlace, no desde la raíz del proyecto.</p>
  <p>2 · Subir un nivel de carpeta antes de seguir buscando.</p>
  <p>3 · Porque describe una posición dentro de tu disco duro. En cualquier otro equipo esa ruta no existe, y en un servidor tampoco.</p>
</details>

---

## Sesión 6 · El sitio multipágina y su navegación

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué convierte un grupo de enlaces en una navegación, y cómo se indica cuál es la página actual.</li>
    <li><strong>2. Haz:</strong> Crea y conecta las cuatro páginas del proyecto con la misma navegación.</li>
    <li><strong>3. Comprueba:</strong> Recorre el ciclo completo de páginas sin un solo enlace roto.</li>
  </ol>
</div>

### Un menú es una lista de enlaces, marcada como tal

Una navegación es exactamente dos cosas: una lista de enlaces, y la declaración de que esa lista es la navegación del sitio.

```html
<nav aria-label="Navegación principal">
    <ul>
        <li><a href="index.html">Inicio</a></li>
        <li><a href="productos.html">Productos</a></li>
        <li><a href="acerca.html">Acerca de</a></li>
        <li><a href="contacto.html" aria-current="page">Contacto</a></li>
    </ul>
</nav>
```

Tres decisiones que merecen explicación:

* **`<nav>`** declara que ese bloque es navegación. Un lector de pantalla ofrece saltar directamente a él, o saltárselo entero para ir al contenido, que es lo que hace la mayoría de la gente que navega así.
* **La lista** dice que son cuatro enlaces hermanos, y permite anunciar «lista de 4 elementos» antes de leerlos. Cuatro enlaces sueltos separados por espacios no dicen cuántos son ni dónde acaban.
* **`aria-current="page"`** marca cuál de ellos es la página que se está viendo. Sin CSS es la única forma de comunicarlo.

<div class="rule">
  <p class="rule-label">Una navegación se repite idéntica</p>
  <p>El mismo bloque, con los mismos enlaces y en el mismo orden, en las cuatro páginas. Lo único que cambia de una página a otra es <strong>dónde está el <code>aria-current</code></strong>. Si el menú cambia de orden entre páginas, quien navegue por el sitio tendrá que releerlo cada vez.</p>
</div>

### Tarea 5 · El sitio multipágina

Amplía tu proyecto hasta tener cuatro páginas en la raíz:

```text
pixelstore/
├── index.html      · portada
├── productos.html  · catálogo
├── acerca.html     · quiénes somos
└── contacto.html   · contacto
```

Requisitos:

1. Las cuatro páginas tienen el esqueleto completo y su propio `<title>` **distinto y descriptivo**.
2. Las cuatro incluyen el mismo bloque de navegación.
3. Cada página marca su propio enlace con `aria-current="page"`.
4. Cada página tiene un único `h1` que coincide con el tema de esa página.

<details class="aside aside--help">
  <summary>Estoy atascado · el título de cada página</summary>
  <p>El <code>&lt;title&gt;</code> se lee fuera de contexto: en una pestaña estrecha, en un favorito, en un resultado de búsqueda. «Contacto» no dice de qué web es. Escribe primero lo específico y después el sitio, porque las pestañas se recortan por el final:</p>
  <p><code>Contacto | PixelStore</code>, <code>Catálogo de componentes | PixelStore</code>.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 6 y de la semana 2</p>
  <ul class="checklist">
    <li>Las cuatro páginas existen y validan.</li>
    <li>Recorres Inicio → Productos → Acerca de → Contacto → Inicio sin ningún error 404.</li>
    <li>Todas las rutas son relativas y el sitio sobrevive a moverse de carpeta.</li>
    <li>Cada página tiene un título propio y descriptivo.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué los enlaces de un menú van dentro de una lista?</li>
    <li>¿Qué aporta <code>&lt;nav&gt;</code> que no aporta un <code>&lt;div&gt;</code> con enlaces?</li>
    <li>¿Cómo se indica sin CSS cuál es la página actual?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque son elementos hermanos de un conjunto: la lista dice cuántos son y dónde empieza y acaba el menú.</p>
  <p>2 · Declara que ese bloque es una zona de navegación, y eso permite saltar a él o saltárselo. Un <code>div</code> no significa nada.</p>
  <p>3 · Con <code>aria-current="page"</code> en el enlace correspondiente.</p>
</details>

---

## Semana 3 · Imágenes y semántica estructural

---

## Sesión 7 · Imágenes y texto alternativo

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Que el <code>alt</code> correcto depende de la función de la imagen, no de lo que se ve en ella.</li>
    <li><strong>2. Haz:</strong> Decide el texto alternativo de cinco imágenes con funciones distintas.</li>
    <li><strong>3. Comprueba:</strong> Desactiva las imágenes y comprueba si la página sigue entendiéndose.</li>
  </ol>
</div>

### El alt no describe la imagen: la sustituye

La pregunta habitual, «¿qué pongo en el `alt`?», casi siempre se responde describiendo lo que se ve. Es la respuesta equivocada.

El texto alternativo es lo que ocupa el lugar de la imagen cuando la imagen no está: porque no ha cargado, porque la conexión es mala, o porque quien lee la página no la ve. Así que la pregunta correcta es:

> **Si borro esta imagen, ¿qué tendría que decir aquí para que no se pierda nada?**

De ahí salen tres casos, y solo tres:

| La imagen... | Entonces el `alt` es... | Ejemplo |
| ------------ | ----------------------- | ------- |
| **Informa**: aporta contenido que no está escrito en ningún otro sitio | La información que aporta | `alt="El modelo A consume 45 W, el B 65 W y el C 90 W"` |
| **Actúa**: es el único contenido de un enlace o un botón | La acción o el destino, no el dibujo | `alt="Buscar en la tienda"` |
| **Decora**: no aporta nada que no esté ya en el texto | Vacío, y se escribe igualmente | `alt=""` |

<div class="rule">
  <p class="rule-label">El <code>alt</code> vacío no es lo mismo que no poner <code>alt</code></p>
  <p><code>alt=""</code> significa «esta imagen es decorativa, ignórala». Un lector de pantalla la salta en silencio, que es justo lo que queremos.</p>
  <p>Si directamente no escribes el atributo, el lector no sabe qué hacer y suele leer el nombre del archivo. Quien usa la página escucha «guion bajo img guion 47 punto webp». Por eso <strong>toda</strong> imagen lleva <code>alt</code>: la duda es solo si va vacío o lleno.</p>
</div>

#### Cuando la imagen necesita un pie

Si la imagen va acompañada de un pie visible, los dos elementos se marcan juntos:

```html
<figure>
    <img src="grafico-consumo.webp" alt="El modelo A consume 45 W, el B 65 W y el C 90 W">
    <figcaption>Consumo comparado de los tres portátiles del catálogo</figcaption>
</figure>
```

`figcaption` es el pie que todo el mundo ve; `alt` es el contenido de la imagen para quien no la ve. No deben decir lo mismo, porque no hacen lo mismo: si los repites, quien use un lector de pantalla lo escuchará dos veces.

#### Dos atributos que cuestan poco

```html
<img src="teclado.webp" alt="Teclado mecánico compacto con retroiluminación"
     width="800" height="600" loading="lazy">
```

`width` y `height` reservan el hueco antes de que la imagen llegue, y evitan que el texto salte cuando termina de cargar. `loading="lazy"` retrasa la descarga de las imágenes que aún no se ven al bajar por la página.

### Tarea 6 · ¿Qué `alt` pondrías?

<p class="stage">Paso 1 · Te enseño uno</p>

**El logotipo de PixelStore en la cabecera, enlazado a `index.html`.**

<dl class="worked">
  <dt>¿Qué función tiene?</dt>
  <dd>Actúa: es el contenido de un enlace, y además es el único contenido de ese enlace.</dd>
  <dt>Si la borro, ¿qué se pierde?</dt>
  <dd>Un enlace sin ningún texto. Quien no vea la imagen se encuentra un enlace que no dice adónde va.</dd>
  <dt>Entonces, ¿qué escribo?</dt>
  <dd>El destino, no el dibujo. No «logotipo azul de PixelStore», sino adónde lleva.</dd>
  <dt>Solución</dt>
  <dd><code>alt="PixelStore · Inicio"</code></dd>
</dl>

<p class="stage stage--solo">Paso 2 · Hazlo tú</p>

Para cada caso, decide si el `alt` debe ser descriptivo, funcional o vacío, y escríbelo:

1. **Un gráfico de barras** que compara el consumo energético de tres portátiles.
2. **Una línea divisoria decorativa** entre dos secciones.
3. **Un icono de lupa** dentro de un enlace, sin ningún texto alrededor.
4. **La foto de un producto** en su ficha: un teclado mecánico con iluminación RGB.
5. **La foto del equipo de PixelStore** en la página «Acerca de», con un pie que ya dice quiénes son.

<details class="aside aside--extra">
  <summary>Ver soluciones recomendadas</summary>
  <p>1 · Informa. <code>alt="El modelo A consume 45 W, el B 65 W y el C 90 W"</code>. Un gráfico se sustituye por sus datos, no por la palabra «gráfico».</p>
  <p>2 · Decora. <code>alt=""</code>.</p>
  <p>3 · Actúa. <code>alt="Buscar en la tienda"</code>: es la única etiqueta accesible que tiene ese enlace.</p>
  <p>4 · Informa. <code>alt="Teclado mecánico compacto con interruptores rojos y retroiluminación RGB"</code>. En una ficha de producto la foto sí aporta contenido.</p>
  <p>5 · Depende del pie. Si el <code>figcaption</code> ya identifica a las personas, el <code>alt</code> describe lo que se ve sin repetirlo: <code>alt="Nueve personas en la oficina de PixelStore"</code>. Si el pie no dice nada, el <code>alt</code> tiene que cargar con la información.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación · la prueba de las imágenes apagadas</p>
  <p>Desactiva la carga de imágenes en el navegador y recarga tu proyecto. Si alguna zona pasa a ser incomprensible, o aparece un hueco sin ninguna explicación, ese <code>alt</code> está mal resuelto.</p>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>alt=""</code> y no escribir <code>alt</code>?</li>
    <li>Una lupa dentro de un enlace de búsqueda: ¿qué <code>alt</code> lleva?</li>
    <li>¿Por qué <code>alt</code> y <code>figcaption</code> no deben decir lo mismo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>alt=""</code> declara que la imagen es decorativa y hace que se ignore. Sin el atributo, el lector de pantalla no sabe qué es y acaba leyendo el nombre del archivo.</p>
  <p>2 · La acción, no el dibujo: <code>alt="Buscar en la tienda"</code>.</p>
  <p>3 · Porque el pie lo lee todo el mundo y el <code>alt</code> solo sustituye a la imagen. Si coinciden, quien use un lector de pantalla oye la misma frase dos veces.</p>
</details>

---

## Sesión 8 · Semántica estructural y el infierno de los div

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué zonas declara cada elemento estructural, cuándo un <code>div</code> sigue siendo correcto y qué separa <code>section</code> de <code>article</code>.</li>
    <li><strong>2. Haz:</strong> Refactoriza un documento hecho solo de <code>div</code> hasta convertirlo en HTML semántico.</li>
    <li><strong>3. Comprueba:</strong> Resuelve los dos retos discutiéndolos con tu compañero.</li>
  </ol>
</div>

### Las zonas de una página

Un `<div>` no significa nada: es una caja. Los elementos estructurales sí significan algo, y por eso un lector de pantalla puede ofrecer una lista de zonas de la página y saltar directamente a la que interese.

<figure class="diagram">
  <figcaption>Las zonas que declara un documento bien estructurado</figcaption>
  <ol class="flow">
    <li>header · la cabecera de la página o de una sección</li>
    <li>nav · un bloque de navegación</li>
    <li>main · el contenido principal, una sola vez por página</li>
    <li>section · una parte temática del contenido, con su encabezado</li>
    <li>article · un contenido que se entiende por sí solo, fuera de esta página</li>
    <li>aside · contenido relacionado pero secundario</li>
    <li>footer · el pie de la página o de una sección</li>
  </ol>
</figure>

<p class="term">Landmark</p>

Cada una de esas zonas. Son los puntos de referencia que permiten recorrer una página sin verla, igual que tú recorres una web mirando dónde está el menú y dónde el contenido.

#### `section` o `article`

La regla que resuelve el 90 % de los casos:

> **Si el contenido tuviera sentido publicado por separado, es un `article`. Si solo tiene sentido como una parte de esta página, es una `section`.**

Una ficha de producto se entiende sola: aparece en un buscador, se comparte por mensaje, tiene su propio título y su propia descripción. Es un `article`. El catálogo que agrupa veinte fichas solo tiene sentido dentro de la web de la tienda: es una `section`.

#### Entonces, ¿cuándo se usa `div`?

Cuando de verdad no hay nada que declarar. Un `div` es correcto si solo existe para agrupar cosas de cara al CSS y no representa ninguna zona con significado propio. El error no es usar `div`: es usarlo **en lugar de** un elemento que sí significaba algo.

### Tarea 7 · El infierno de los div

Este código es real, del tipo que te vas a encontrar heredado:

```html
<div id="wrapper">
    <div class="top-bar">
        <div class="logo">PixelStore</div>
        <div class="menu">
            <a href="index.html">Inicio</a>
            <a href="productos.html">Productos</a>
        </div>
    </div>

    <div class="content-box">
        <div class="bloque-central">
            <div class="titulo-seccion">Novedades</div>
            <div class="tarjeta">
                <div class="nombre-producto">Portátil Nova 14</div>
                <div class="desc">Equipo profesional ligero.</div>
            </div>
        </div>
        <div class="lateral">
            <div class="aviso">Horario: L-V de 9 a 18h.</div>
        </div>
    </div>

    <div class="pie">
        <div class="copy">© 2026 PixelStore</div>
    </div>
</div>
```

<p class="stage">Paso 1 · Te enseño uno</p>

Empiezo por la barra superior:

<dl class="worked">
  <dt>¿Qué es <code>div.top-bar</code>?</dt>
  <dd>La cabecera de la página. Existe un elemento para eso: <code>&lt;header&gt;</code>.</dd>
  <dt>¿Y <code>div.logo</code>?</dt>
  <dd>Es el nombre del sitio, el título de mayor rango de la portada. Es un <code>&lt;h1&gt;</code>, no una caja con texto dentro.</dd>
  <dt>¿Y <code>div.menu</code>?</dt>
  <dd>Es la navegación, y sus enlaces son un conjunto: <code>&lt;nav&gt;</code> con una <code>&lt;ul&gt;</code>.</dd>
</dl>

```html
<header>
    <h1>PixelStore</h1>
    <nav aria-label="Navegación principal">
        <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="productos.html">Productos</a></li>
        </ul>
    </nav>
</header>
```

Cuatro `div` han desaparecido y el documento dice cuatro cosas que antes no decía.

<p class="stage stage--solo">Paso 2 · Hazlo tú</p>

Reescribe el resto del fragmento. Al terminar, tu versión debería cumplir esto:

1. No queda ningún `div` cuyo nombre de clase describa algo que HTML ya sabe decir.
2. Hay un único `<main>`.
3. «Novedades» es un encabezado, y «Portátil Nova 14» es un encabezado de nivel inferior.
4. La tarjeta de producto está marcada como `article`, y sabes justificar por qué no es una `section`.
5. El aviso lateral es un `aside` y el pie es un `footer`.

### Reto 3 · Botón contra falso botón (10 min)

```html
<!-- Opción A -->
<div onclick="abrirModal()">Ver especificaciones</div>

<!-- Opción B -->
<button type="button">Ver especificaciones</button>
```

Las dos funcionan al hacer clic. ¿Cuál eliges y por qué?

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 3</summary>
  <p>La B, y no por estilo. Un <code>&lt;button&gt;</code> trae de fábrica cuatro cosas que la opción A no tiene y que habría que reconstruir a mano: se puede alcanzar con la tecla <code>Tab</code>, se activa con <code>Enter</code> y con la barra espaciadora, se anuncia como «botón» a un lector de pantalla, y recibe el foco visible.</p>
  <p>La opción A solo funciona para quien use un ratón y vea la pantalla. Es el mismo patrón de toda la unidad: se ve igual, y no hace lo mismo.</p>
</details>

### Reto 4 · ¿`section` o `article`? (10 min)

Discútelo con tu compañero: en la tienda, ¿la ficha individual de un producto es `section` o `article`? ¿Y el catálogo entero que agrupa los veinte productos?

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 4</summary>
  <p>La ficha es un <code>article</code>: se entiende por sí sola fuera de la página, y de hecho es lo que se comparte o lo que devuelve un buscador.</p>
  <p>El catálogo es una <code>section</code>: agrupa artículos y solo tiene sentido dentro de la web de la tienda. Es decir, una <code>section</code> que contiene veinte <code>article</code>, y no al revés.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 8</p>
  <ul class="checklist">
    <li>Sabes nombrar las siete zonas estructurales y qué declara cada una.</li>
    <li>Aplicas la regla de «¿tendría sentido publicado aparte?» para decidir entre <code>section</code> y <code>article</code>.</li>
    <li>Sabes decir cuándo un <code>div</code> sigue siendo la opción correcta.</li>
    <li>Tu refactorización no ha perdido ningún contenido del original.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Cuántos <code>&lt;main&gt;</code> puede haber en una página?</li>
    <li>Da la regla de una frase que separa <code>section</code> de <code>article</code>.</li>
    <li>Nombra dos cosas que un <code>&lt;button&gt;</code> hace y un <code>&lt;div onclick&gt;</code> no.</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Uno. Es el contenido principal del documento, y no puede haber dos contenidos principales.</p>
  <p>2 · Si tendría sentido publicado por separado es <code>article</code>; si solo lo tiene dentro de esta página, <code>section</code>.</p>
  <p>3 · Se alcanza con <code>Tab</code>, se activa con teclado, se anuncia como botón y recibe el foco. Bastan dos de las cuatro.</p>
</details>

---

## Sesión 9 · Auditoría semántica de una web real

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se lee la estructura real de una página con DevTools, más allá de lo que se ve.</li>
    <li><strong>2. Haz:</strong> Audita la estructura de una web en producción y extrae su mapa semántico.</li>
    <li><strong>3. Comprueba:</strong> Aplica a tus cuatro páginas lo que hayas encontrado que merezca la pena.</li>
  </ol>
</div>

### Ver la estructura, no el diseño

Hasta ahora has escrito HTML. Hoy vas a leerlo, que es lo que harás la mayor parte de tu vida profesional: casi siempre trabajarás sobre código que escribió otro.

Abre DevTools con `F12`. Tres pestañas te interesan:

| Pestaña | Para qué |
| ------- | -------- |
| **Elements** / *Inspector* | Ver el HTML real que ha construido el navegador, ya reparado |
| **Accessibility** / *Accesibilidad* | Ver el árbol de accesibilidad: las zonas y los nombres que percibe un lector de pantalla |
| **Console** | Ver los errores que el navegador sí ha decidido contar |

<div class="rule">
  <p class="rule-label">Lo que ves en Elements no es lo que escribió el autor</p>
  <p>El panel muestra el documento <strong>después</strong> de que el navegador lo haya reparado y de que el JavaScript lo haya modificado. Si quieres ver lo que se escribió de verdad, usa <code>Ctrl + U</code> para ver el código fuente original. Comparar los dos es, muchas veces, la propia auditoría.</p>
</div>

### Tarea 8 · Audita una web real

Elige una web de noticias o una tienda conocida y respóndela con DevTools delante:

1. ¿Tiene un único `<main>`? ¿Y cuántos `<nav>`?
2. ¿Cómo está marcado el menú principal: lista de enlaces o enlaces sueltos?
3. Recorre la jerarquía de encabezados. ¿Hay un solo `h1`? ¿Se salta algún nivel?
4. Elige tres imágenes distintas: ¿tienen `alt`? ¿Es descriptivo, funcional o vacío? ¿Está bien elegido?
5. Busca un elemento que parezca un botón. ¿Es un `<button>` o un `div` disfrazado? Compruébalo intentando llegar hasta él solo con `Tab`.

Anota los hallazgos en esta tabla:

| Aspecto | Qué has encontrado | ¿Correcto? | Qué harías tú |
| ------- | ------------------ | ---------- | ------------- |
| `main` y `nav` | | | |
| Menú principal | | | |
| Jerarquía de encabezados | | | |
| Textos alternativos | | | |
| Botones | | | |

<details class="aside aside--help">
  <summary>Estoy atascado · no encuentro los landmarks</summary>
  <p>En lugar de bucear por el árbol, usa el buscador del panel Elements (<code>Ctrl + F</code> dentro de DevTools) y busca directamente <code>main</code>, <code>nav</code>, <code>header</code> o <code>footer</code>. Te dirá cuántas coincidencias hay, que es justo el dato que necesitas para las dos primeras preguntas.</p>
</details>

### Y ahora, lo tuyo

Vuelve a tus cuatro páginas y pásales la misma auditoría que acabas de hacerle a una web profesional. Corrige lo que encuentres antes de cerrar la sesión.

No es casualidad que la auditoría vaya antes que el proyecto final: es más fácil ver un fallo en el código de otro, y ese ojo entrenado es el que después aplicas al tuyo.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 9 y de la semana 3</p>
  <ul class="checklist">
    <li>Sabes abrir el árbol de accesibilidad y leer las zonas de una página.</li>
    <li>Has auditado una web real y anotado hallazgos concretos, no impresiones.</li>
    <li>Tus cuatro páginas usan elementos estructurales, no <code>div</code> genéricos.</li>
    <li>Todas tus imágenes tienen <code>alt</code>, lleno o vacío según su función.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué el panel Elements puede no coincidir con el código fuente?</li>
    <li>¿Cómo compruebas en diez segundos si un botón es un botón de verdad?</li>
    <li>¿Qué te dice el árbol de accesibilidad que no te dice el HTML?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque muestra el documento ya reparado por el navegador y modificado por el JavaScript. El fuente original se ve con <code>Ctrl + U</code>.</p>
  <p>2 · Intentando llegar hasta él con la tecla <code>Tab</code>. Si no recibe el foco, no es un botón.</p>
  <p>3 · Cómo se anuncia cada elemento: su papel y su nombre accesible, que es lo que de verdad escucha quien no ve la pantalla.</p>
</details>

---

## Semana 4 · Tablas para datos tabulares

---

## Sesión 10 · Tablas semánticas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué hace cada parte de una tabla y qué problema resuelve exactamente el atributo <code>scope</code>.</li>
    <li><strong>2. Haz:</strong> Convierte una comparativa en texto plano en una tabla accesible.</li>
    <li><strong>3. Comprueba:</strong> El validador no encuentra celdas huérfanas ni errores de anidación.</li>
  </ol>
</div>

### El problema que resuelve una tabla bien marcada

Cuando tú miras una tabla, lees una celda y **subes con la vista** hasta el encabezado de su columna para saber qué significa ese número. Es tan automático que no lo notas.

Quien no ve la tabla no puede hacer eso. Va celda por celda, y sin más información escucha: «19». Nada más. Necesita que el documento diga a qué encabezado pertenece cada celda, y eso es exactamente lo que se marca.

| Elemento | Qué declara |
| -------- | ----------- |
| `<table>` | Que esto son datos con relación de filas y columnas |
| `<caption>` | El título de la tabla, dentro de la propia tabla |
| `<thead>` | La fila o filas de encabezados |
| `<tbody>` | Los datos |
| `<tr>` | Una fila |
| `<th>` | Una celda que **encabeza** otras |
| `<td>` | Una celda de datos |
| `scope="col"` | Este `th` encabeza su columna |
| `scope="row"` | Este `th` encabeza su fila |

<p class="term">scope</p>

El atributo que dice en qué dirección manda un encabezado. Con `scope`, esa celda deja de escucharse como «19» y pasa a escucharse como «Básico, precio mensual, 19 euros».

#### Una tabla completa

```html
<table>
    <caption>Planes de servidor de PixelStore</caption>
    <thead>
        <tr>
            <th scope="col">Modelo</th>
            <th scope="col">RAM</th>
            <th scope="col">Precio mensual</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Básico</th>
            <td>8 GB</td>
            <td>19 €</td>
        </tr>
        <tr>
            <th scope="row">Avanzado</th>
            <td>16 GB</td>
            <td>39 €</td>
        </tr>
    </tbody>
</table>
```

Fíjate en la primera columna del `tbody`: «Básico» y «Avanzado» son `th`, no `td`. No son datos, son los nombres que identifican cada fila. Es el error más frecuente al empezar, y el que deja las tablas mudas.

<div class="rule">
  <p class="rule-label"><code>caption</code> no es lo mismo que un encabezado encima</p>
  <p>Poner un <code>&lt;h3&gt;Planes de servidor&lt;/h3&gt;</code> justo antes de la tabla no es equivalente. El <code>&lt;caption&gt;</code> va <strong>dentro</strong> de <code>&lt;table&gt;</code> y queda asociado a ella, así que se anuncia al entrar en la tabla y aparece si la tabla se extrae de su contexto. Un encabezado suelto encima es solo un texto que casualmente está cerca.</p>
</div>

### Tarea 9 · Construye la tabla

Recibes estos datos sin formato:

```text
Comparativa de modelos de servidor
Modelo       RAM     Almacenamiento   Transferencia   Precio mensual
Básico       8 GB    256 GB NVMe      2 TB            19 €
Avanzado     16 GB   512 GB NVMe      5 TB            39 €
Empresarial  32 GB   1 TB NVMe        10 TB           79 €
```

Escribe el HTML que la represente, con:

* `<caption>` con el título de la tabla.
* `<thead>` y `<tbody>` delimitando encabezados y datos.
* `<th scope="col">` en cada encabezado de columna.
* `<th scope="row">` en el nombre de cada modelo.
* `<td>` en el resto.

Al terminar, haz esta comprobación: **lee en voz alta la celda «5 TB» tal y como la escucharía alguien que no ve la tabla**. Si tu marcado es correcto, deberías poder decir «Avanzado, transferencia, 5 TB». Si no puedes, falta un `scope`.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 10</p>
  <ul class="checklist">
    <li>Distingues <code>th</code> de <code>td</code> y sabes por qué la primera columna suele ser <code>th</code>.</li>
    <li>Sabes explicar qué aporta <code>scope</code> con un ejemplo hablado.</li>
    <li>Tu tabla tiene <code>caption</code>, <code>thead</code> y <code>tbody</code>.</li>
    <li>Todas las filas tienen el mismo número de celdas.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>th</code> y <code>td</code>?</li>
    <li>¿Para qué sirve <code>scope</code>?</li>
    <li>¿Por qué <code>caption</code> no se sustituye por un encabezado encima de la tabla?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>th</code> es una celda que encabeza a otras y les da significado; <code>td</code> es una celda de datos.</p>
  <p>2 · Para declarar si un encabezado manda sobre su columna o sobre su fila, de modo que cada celda pueda anunciarse junto a los encabezados que la describen.</p>
  <p>3 · Porque <code>caption</code> está dentro de la tabla y queda asociado a ella; un encabezado suelto solo está cerca.</p>
</details>

---

## Sesión 11 · Celdas combinadas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo <code>colspan</code> y <code>rowspan</code> ocupan la cuadrícula, y cómo se comprueba que no la han roto.</li>
    <li><strong>2. Haz:</strong> Construye el horario semanal de tu grupo con una fila combinada.</li>
    <li><strong>3. Comprueba:</strong> Todas las filas suman el mismo número de columnas.</li>
  </ol>
</div>

### Una tabla es una cuadrícula, aunque no lo parezca

`colspan` y `rowspan` no «juntan» celdas: hacen que **una celda ocupe el sitio de varias**. La cuadrícula sigue existiendo debajo, con el mismo número de columnas en todas las filas.

```html
<tr>
    <td colspan="5">Recreo</td>
</tr>
```

Esa fila parece tener una celda, pero ocupa cinco columnas. Si la tabla tiene cinco columnas, es correcta. Si tiene seis, acabas de dejar un hueco, y el navegador dibujará algo raro sin decirte nada.

<div class="rule">
  <p class="rule-label">La comprobación que evita el 90 % de los fallos</p>
  <p>Recorre la tabla fila a fila y suma, en cada una, el <code>colspan</code> de sus celdas (una celda normal cuenta 1). <strong>Todas las filas tienen que dar el mismo total.</strong> Si una da distinto, ahí está el error, y lo tienes localizado sin abrir el navegador.</p>
  <p>Con <code>rowspan</code> hay que acordarse de que una celda que baja invade la fila siguiente: esa fila tendrá una celda escrita menos, porque una de sus posiciones ya está ocupada desde arriba.</p>
</div>

#### Cuándo empieza a ser mala idea

Una celda combinada aislada es normal y se entiende bien. Una tabla con combinaciones en varias direcciones a la vez se vuelve difícil de recorrer para quien la escucha, porque deja de estar claro qué encabezado gobierna cada celda.

Si tu tabla necesita ese nivel de combinación, casi siempre la respuesta correcta es **partirla en dos tablas más simples**, cada una con su `caption`.

### Tarea 10 · El horario de clase

Construye una tabla con el horario semanal de tu grupo: de lunes a viernes, seis periodos lectivos y un recreo intermedio.

Requisitos:

1. `<caption>` que identifique de qué grupo es el horario.
2. Los días de la semana como `<th scope="col">`.
3. La hora de cada franja como `<th scope="row">`.
4. El recreo en una única fila combinada que abarque los cinco días, con `colspan="5"`.
5. Aplica la comprobación de sumas antes de darlo por bueno.

<details class="aside aside--help">
  <summary>Estoy atascado · no me cuadran las columnas</summary>
  <p>Cuenta primero cuántas columnas tiene la tabla en total, contando la de las horas. Si son cinco días más la columna de horas, son <strong>seis</strong> columnas, y entonces la fila del recreo necesita <code>colspan="6"</code>, o bien un <code>th</code> con la hora más un <code>td colspan="5"</code>. Ese despiste de una columna es prácticamente el único fallo que da esta tarea.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué hace exactamente <code>colspan="3"</code>?</li>
    <li>¿Cómo compruebas que una tabla con celdas combinadas está bien, sin abrir el navegador?</li>
    <li>¿Qué haces si una tabla necesita combinaciones en las dos direcciones a la vez?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que esa celda ocupe la posición de tres columnas de la cuadrícula.</p>
  <p>2 · Sumando por filas: cada celda cuenta su <code>colspan</code>, y todas las filas deben dar el mismo total.</p>
  <p>3 · Partirla en dos tablas más simples, cada una con su propio <code>caption</code>.</p>
</details>

---

## Sesión 12 · ¿Tabla o no tabla?

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué distingue unos datos tabulares de algo que solo se parece a una tabla.</li>
    <li><strong>2. Haz:</strong> Clasifica cinco casos y añade una tabla real a tu página de productos.</li>
    <li><strong>3. Comprueba:</strong> La tabla de tu proyecto aporta información que no cabría igual de bien en una lista.</li>
  </ol>
</div>

### La pregunta que decide

Durante años se maquetaron webs enteras con tablas, porque era la única forma de colocar cosas en columnas. Eso terminó hace mucho, pero la costumbre dejó un rastro: en cuanto algo se ve en rejilla, la mano va sola a `<table>`.

La prueba es esta:

> **¿Cada dato está en el cruce de dos cosas? Es decir, ¿necesito saber su fila **y** su columna para entender qué significa?**

«19 €» no significa nada por sí solo: hace falta saber que es del plan Básico y que es el precio mensual. Dos coordenadas, dos encabezados. Eso es una tabla.

En cambio, la descripción de una camiseta no está en el cruce de nada: pertenece a esa camiseta y punto. Que las camisetas se vean colocadas en una rejilla de tres columnas es una decisión visual, no una relación entre datos, y las decisiones visuales se resuelven con CSS.

| Si es... | Se marca como |
| -------- | ------------- |
| Datos en el cruce de fila y columna | `<table>` |
| Un conjunto de elementos sin orden | `<ul>` |
| Una secuencia donde el orden importa | `<ol>` |
| Contenidos que se entienden por sí solos | `<section>` con varios `<article>` |
| Enlaces de navegación | `<nav>` con `<ul>` |
| Colocación visual en columnas | Nada de HTML: es CSS |

### Tarea 11 · Clasifica cinco casos

Para cada uno, indica con qué se marca y **justifícalo con la pregunta de las dos coordenadas**:

1. Un catálogo de 12 camisetas, cada una con foto, título, descripción y botón de comprar.
2. La clasificación de la liga: posición, equipo, puntos, partidos jugados y goles.
3. El menú de navegación superior de la web, con cinco enlaces.
4. Una comparativa de tres tarifas de móvil: gigas, minutos, permanencia y precio.
5. Colocar una foto a la izquierda y un texto a la derecha.

<details class="aside aside--extra">
  <summary>Ver soluciones de criterio</summary>
  <p>1 · <code>&lt;section&gt;</code> con doce <code>&lt;article&gt;</code>. Cada camiseta se entiende sola; no hay cruce de coordenadas.</p>
  <p>2 · <code>&lt;table&gt;</code>. «34» necesita saber que es del Betis y que es la columna de puntos.</p>
  <p>3 · <code>&lt;nav&gt;</code> con <code>&lt;ul&gt;</code>. Es un conjunto de enlaces, no una rejilla de datos.</p>
  <p>4 · <code>&lt;table&gt;</code> con <code>caption</code> y <code>scope</code>. Mismo caso que la clasificación: cada valor cruza tarifa y característica.</p>
  <p>5 · Nada de HTML. Es maquetación, y se hace con CSS en la siguiente unidad. Si lo resuelves con una tabla, estás diciendo que la foto y el texto son datos relacionados en una rejilla, que es falso.</p>
</details>

### Proyecto · La comparativa de PixelStore

Añade a `productos.html` una tabla comparativa real: al menos tres productos y cuatro características. Tiene que tener `caption`, `scope` en los dos sentidos, y aportar algo que una lista no diría igual de bien.

Si al escribirla te das cuenta de que en realidad no hay cruce de coordenadas, cámbiala por lo que corresponda y explica el cambio en un comentario. Detectar eso también es haber aprendido la sesión.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 12 y de la semana 4</p>
  <ul class="checklist">
    <li>Aplicas la pregunta de las dos coordenadas antes de escribir <code>&lt;table&gt;</code>.</li>
    <li>Sabes por qué la maquetación en columnas no es asunto de HTML.</li>
    <li>Tu <code>productos.html</code> tiene una tabla comparativa accesible.</li>
    <li>El catálogo está marcado con <code>article</code>, no con filas de tabla.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Enuncia la prueba que decide si algo es una tabla.</li>
    <li>¿Por qué un catálogo de productos no es una tabla?</li>
    <li>¿Con qué se resuelve colocar dos bloques en columnas?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Si cada dato necesita su fila y su columna para significar algo, es una tabla.</p>
  <p>2 · Porque cada producto se entiende por sí solo: no hay cruce de coordenadas, solo elementos parecidos colocados juntos.</p>
  <p>3 · Con CSS. HTML declara qué es cada cosa, no dónde se dibuja.</p>
</details>

---

## Semana 5 · Formularios accesibles

---

## Sesión 13 · La arquitectura de un formulario

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué une un <code>label</code> con su campo, para qué sirve <code>name</code> y por qué ninguno de los dos es opcional.</li>
    <li><strong>2. Haz:</strong> Construye el formulario base de la página de contacto.</li>
    <li><strong>3. Comprueba:</strong> Al hacer clic en el texto de cada etiqueta, el cursor entra en su campo.</li>
  </ol>
</div>

### Tres piezas y una relación

Un formulario es un `<form>` con controles dentro y un botón que lo envía. Lo que casi siempre se hace mal es la relación entre cada campo y su etiqueta.

```html
<form action="/enviar" method="post">
    <p>
        <label for="correo">Correo electrónico</label>
        <input type="email" id="correo" name="correo">
    </p>
    <p>
        <button type="submit">Enviar consulta</button>
    </p>
</form>
```

Hay dos atributos parecidos que hacen cosas distintas, y confundirlos es el error más caro de la sesión:

| Atributo | Para quién es | Qué hace |
| -------- | ------------- | -------- |
| `id` | Para el documento | Identifica el campo dentro de la página, y es a lo que apunta el `for` |
| `name` | Para el servidor | Es el nombre con el que viaja el dato al enviarse |
| `for` | Para el `label` | Dice a qué campo pertenece esta etiqueta |

<p class="term">Etiqueta asociada</p>

Un `<label for="x">` unido a un `<input id="x">`. No es un texto que está al lado del campo: es un texto que **pertenece** al campo.

#### Qué se gana asociándola

1. Un lector de pantalla anuncia el campo con su nombre. Sin `label`, anuncia «campo de texto» y nada más.
2. El área de clic crece: pulsar sobre el texto lleva el cursor al campo, lo cual importa mucho en pantallas pequeñas y en casillas de verificación.
3. El navegador puede autocompletar mejor.

<div class="rule">
  <p class="rule-label">El <code>placeholder</code> no es una etiqueta</p>
  <p>El texto gris dentro de un campo <strong>desaparece en cuanto empiezas a escribir</strong>. Quien se distrae a mitad de un formulario largo se queda con un campo lleno y sin ninguna indicación de qué contenía. Y quien usa un lector de pantalla puede no oírlo nunca.</p>
  <p>Un <code>placeholder</code> sirve para dar un ejemplo de formato junto a una etiqueta —<code>placeholder="600 000 000"</code>—, no para sustituirla.</p>
</div>

### Tarea 12 · Fase A · El formulario base

En `contacto.html`, escribe un formulario con:

* Nombre completo, con su `label` asociado.
* Correo electrónico.
* Asunto.
* Mensaje, con `<textarea rows="5">`.
* Botón de envío con `<button type="submit">`.

Cada campo debe tener `id` y `name`, y cada `label` su `for` correspondiente.

**La comprobación de un minuto:** haz clic sobre el *texto* de cada etiqueta, no sobre el campo. Si el cursor salta al campo correcto, la asociación está bien. Si no pasa nada, ese `for` no coincide con ningún `id`.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>id</code> y <code>name</code> en un campo?</li>
    <li>Da dos razones para asociar la etiqueta con <code>for</code>.</li>
    <li>¿Por qué un <code>placeholder</code> no sustituye a un <code>label</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>id</code> identifica el campo dentro del documento y es a lo que apunta el <code>for</code>; <code>name</code> es el nombre con el que el dato se envía al servidor.</p>
  <p>2 · El lector de pantalla anuncia el campo por su nombre, y pulsar el texto lleva el foco al campo. Vale también la mejora del autocompletado.</p>
  <p>3 · Porque desaparece al escribir y deja el campo sin identificar.</p>
</details>

---

## Sesión 14 · Tipos, validación nativa y agrupación

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué te da gratis elegir bien el <code>type</code>, qué validación trae el navegador de fábrica y para qué sirve agrupar campos.</li>
    <li><strong>2. Haz:</strong> Completa el formulario con los ocho requisitos de la fase B.</li>
    <li><strong>3. Comprueba:</strong> Intenta enviarlo vacío y con datos inválidos y observa qué impide el navegador.</li>
  </ol>
</div>

### Elegir el `type` correcto no es cosmético

Todos estos campos aceptan texto. La diferencia está en lo que el navegador hace con ellos sin que tú programes nada.

| `type` | Qué aporta de fábrica |
| ------ | --------------------- |
| `text` | Nada especial |
| `email` | Comprueba el formato y ofrece un teclado con arroba en el móvil |
| `tel` | Teclado numérico de teléfono en el móvil |
| `number` | Solo acepta números, admite `min` y `max`, y muestra flechas |
| `date` | Un selector de fecha del sistema, ya traducido |
| `url` | Comprueba que sea una dirección web |
| `password` | Oculta lo escrito |

Ese teclado adaptado en el móvil no es un detalle menor: es la diferencia entre rellenar un formulario cómodamente y abandonarlo.

#### La validación que trae el navegador

<p class="term">Validación nativa</p>

Las comprobaciones que hace el propio navegador antes de enviar, declaradas con atributos y sin una línea de JavaScript.

| Atributo | Exige |
| -------- | ----- |
| `required` | Que el campo no se quede vacío |
| `minlength` / `maxlength` | Un número mínimo y máximo de caracteres |
| `min` / `max` | Un valor mínimo y máximo, en números y fechas |
| `pattern` | Que el texto encaje con un patrón concreto |

<div class="rule">
  <p class="rule-label">Validar en el navegador no es validar</p>
  <p>Todo esto se puede desactivar: basta con enviar la petición sin pasar por el formulario. La validación nativa está para <strong>ayudar a quien rellena</strong>, avisándole antes de enviar y sin recargar la página.</p>
  <p>La comprobación que de verdad protege los datos se hace <strong>en el servidor</strong>, y la veréis en otro módulo. Las dos son necesarias y no se sustituyen entre sí.</p>
</div>

#### Agrupar lo que va junto

`<fieldset>` agrupa campos relacionados y `<legend>` le pone nombre al grupo. En un formulario de tres campos sobra; en uno de quince es lo que lo hace navegable, porque cada campo se anuncia precedido del nombre de su grupo.

Los botones de opción **necesitan** el grupo: comparten el mismo `name`, que es lo que los hace excluyentes entre sí, y el `legend` es lo que dice de qué se está eligiendo.

```html
<fieldset>
    <legend>Tipo de cliente</legend>
    <p>
        <input type="radio" id="particular" name="tipo_cliente" value="particular">
        <label for="particular">Particular</label>
    </p>
    <p>
        <input type="radio" id="empresa" name="tipo_cliente" value="empresa">
        <label for="empresa">Empresa</label>
    </p>
</fieldset>
```

### Tarea 12 · Fase B · El formulario comercial

Amplía el formulario de contacto hasta cumplir estos ocho requisitos:

1. El correo electrónico usa `type="email"` y es obligatorio.
2. El asunto exige entre 5 y 50 caracteres.
3. Un campo numérico de unidades, entre 1 y 100.
4. Un campo de fecha preferida de contacto, que no admita fechas anteriores a hoy.
5. Un `<select>` con al menos tres motivos de contacto.
6. Dos botones de opción con el mismo `name="tipo_cliente"`: particular y empresa.
7. Una casilla obligatoria para aceptar la política de privacidad.
8. Dos `<fieldset>` con su `<legend>`: uno para los datos personales y otro para los de la consulta.

<details class="aside aside--help">
  <summary>Estoy atascado · los radio no funcionan como espero</summary>
  <p>Si puedes marcar los dos a la vez, es que tienen <code>name</code> distinto. Lo que agrupa unos botones de opción y hace que se excluyan no es el <code>fieldset</code>: es <strong>compartir exactamente el mismo <code>name</code></strong>. Lo que sí tiene que ser distinto en cada uno es el <code>id</code>, porque cada <code>label</code> apunta al suyo.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación · tres intentos de envío</p>
  <p>Envía el formulario vacío, después con un correo sin arroba, y después con un asunto de tres caracteres. En los tres casos el navegador debe impedir el envío y decirte cuál es el problema, sin recargar la página y sin que tú hayas escrito nada de JavaScript.</p>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Nombra dos cosas que te da <code>type="email"</code> y no te da <code>type="text"</code>.</li>
    <li>¿Qué hace que dos botones de opción sean excluyentes?</li>
    <li>¿Por qué la validación nativa no sustituye a la del servidor?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Comprueba el formato del correo y ofrece un teclado adaptado en el móvil.</p>
  <p>2 · Compartir el mismo atributo <code>name</code>.</p>
  <p>3 · Porque se ejecuta en el navegador y se puede saltar enviando la petición directamente. Sirve para ayudar a quien rellena, no para proteger los datos.</p>
</details>

---

## Sesión 15 · Auditoría de formularios rotos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Los fallos que se repiten en casi todos los formularios mal hechos y a quién dejan fuera.</li>
    <li><strong>2. Haz:</strong> Audita un formulario inaccesible, enumera sus fallos y reescríbelo.</li>
    <li><strong>3. Comprueba:</strong> Recorre tu propio formulario usando solo la tecla <code>Tab</code>.</li>
  </ol>
</div>

### La prueba del teclado

Antes de mirar código, una prueba que dura treinta segundos y que puedes hacerle a cualquier web: **suelta el ratón**. Recorre el formulario con `Tab`, cambia de opción con las flechas, envía con `Enter`.

Si en algún punto no sabes dónde está el foco, o hay algo que no puedes alcanzar, ese formulario está roto para todo el que no use un ratón: quien navega con teclado, quien usa un lector de pantalla y quien maneja el ordenador con un conmutador.

Los seis fallos que vas a encontrar una y otra vez:

| Fallo | Consecuencia |
| ----- | ------------ |
| Campos sin `label` asociado | Se anuncian como «campo de texto», sin nombre |
| `placeholder` usado como etiqueta | La indicación desaparece al escribir |
| `type="text"` para correos, números o fechas | Sin validación ni teclado adaptado |
| Campos sin `name` | El dato no llega al servidor aunque se rellene |
| `<div onclick>` como botón de enviar | No se alcanza con `Tab` ni se activa con `Enter` |
| `<br>` para separar los campos | El formulario no tiene estructura, solo saltos de línea |

### Tarea 13 · El formulario defectuoso

```html
<form action="/enviar">
    Nombre: <input type="text" placeholder="Escribe tu nombre">
    <br>
    Correo: <input type="text" placeholder="Escribe tu correo">
    <br>
    Edad: <input type="text">
    <br>
    <div class="boton-enviar" onclick="enviar()">Enviar formulario</div>
</form>
```

<p class="stage">Paso 1 · Te enseño uno</p>

<dl class="worked">
  <dt>Fallo</dt>
  <dd>El texto «Nombre:» está suelto delante del campo, no es un <code>&lt;label&gt;</code>.</dd>
  <dt>¿Por qué importa, si se lee igual?</dt>
  <dd>Se lee igual para quien ve la pantalla. Para un lector de pantalla no hay ninguna relación entre ese texto y ese campo: anunciará «campo de texto» y el usuario tendrá que adivinar cuál es.</dd>
  <dt>Corrección</dt>
  <dd><code>&lt;label for="nombre"&gt;Nombre&lt;/label&gt;</code> y <code>&lt;input type="text" id="nombre" name="nombre"&gt;</code>.</dd>
</dl>

<p class="stage stage--solo">Paso 2 · Hazlo tú</p>

1. Enumera los **seis** fallos del formulario, en el mismo formato: qué está mal, a quién perjudica y cuál es la corrección.
2. Reescríbelo entero corrigiéndolos todos.
3. Pásale la prueba del teclado a tu versión.

<details class="aside aside--extra">
  <summary>Ver los seis fallos</summary>
  <p>1 · Ningún campo tiene <code>&lt;label&gt;</code> asociado: los textos están sueltos delante.</p>
  <p>2 · Ningún campo tiene <code>name</code>, así que ningún dato llegaría al servidor.</p>
  <p>3 · El correo usa <code>type="text"</code> en lugar de <code>type="email"</code>.</p>
  <p>4 · La edad usa <code>type="text"</code> en lugar de <code>type="number"</code> con <code>min</code> y <code>max</code>.</p>
  <p>5 · El botón de enviar es un <code>&lt;div onclick&gt;</code>: no se alcanza con <code>Tab</code> ni se activa con teclado. Debe ser <code>&lt;button type="submit"&gt;</code>.</p>
  <p>6 · Los campos se separan con <code>&lt;br&gt;</code>, que no aporta ninguna estructura. Cada campo con su etiqueta debería ir en su propio bloque.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 15 y de la semana 5</p>
  <ul class="checklist">
    <li>Tu formulario se recorre entero con <code>Tab</code>, en un orden que tiene sentido.</li>
    <li>Todos los campos tienen <code>label</code> asociado, <code>id</code> y <code>name</code>.</li>
    <li>Cada campo usa el <code>type</code> que le corresponde.</li>
    <li>El botón de envío es un <code>&lt;button&gt;</code>.</li>
    <li>Ningún <code>placeholder</code> hace de etiqueta.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿En qué consiste la prueba del teclado y qué detecta?</li>
    <li>Un campo rellenado no llega al servidor. ¿Qué atributo falta?</li>
    <li>¿Por qué un texto suelto delante de un campo no es una etiqueta?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Recorrer el formulario sin ratón, solo con <code>Tab</code>, flechas y <code>Enter</code>. Detecta elementos inalcanzables, foco invisible y falsos botones.</p>
  <p>2 · El atributo <code>name</code>.</p>
  <p>3 · Porque no hay ninguna relación declarada entre los dos: para quien no ve la pantalla, la proximidad no existe.</p>
</details>

---

## Semana 6 · Depuración, auditoría y coevaluación

---

## Sesión 16 · Auditoría forense de HTML

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Los tres niveles de comprobación de un documento y qué ve cada uno, incluido lo que ninguno ve.</li>
    <li><strong>2. Haz:</strong> Localiza y repara los fallos deliberados de un documento, justificando cada corrección.</li>
    <li><strong>3. Comprueba:</strong> El validador del W3C devuelve cero errores.</li>
  </ol>
</div>

### Tres niveles, y ninguno es suficiente solo

<figure class="diagram">
  <figcaption>Cada comprobación ve cosas que la anterior no</figcaption>
  <ol class="flow">
    <li>El navegador · solo delata lo que no consigue disimular</li>
    <li>El linter · avisa mientras escribes, dentro del editor</li>
    <li>El validador del W3C · dictamina si el documento cumple la especificación</li>
    <li>Tu criterio · lo único que juzga si el marcado <em>significa</em> lo correcto</li>
  </ol>
</figure>

El cuarto nivel es el que importa y el que nadie automatiza. Fíjate en lo que un validador **no** puede decirte:

| Un validador detecta | Un validador no detecta |
| -------------------- | ----------------------- |
| Etiquetas sin cerrar o mal anidadas | Que hayas usado `div` donde tocaba `nav` |
| Atributos que no existen | Que un `alt` diga «imagen1» en lugar de describir algo |
| `id` duplicados | Que hayas saltado de `h1` a `h4` |
| Anidaciones prohibidas | Que un catálogo esté marcado como tabla |

<div class="rule">
  <p class="rule-label">Válido no significa correcto</p>
  <p>Un documento entero hecho de <code>&lt;div&gt;</code>, sin un solo encabezado y con todas las imágenes con <code>alt="foto"</code>, pasa el validador del W3C con cero errores. Es válido y es malo.</p>
  <p>La validez es el suelo, no el techo: garantiza que la sintaxis está bien escrita, no que la información esté bien descrita.</p>
</div>

### Tarea 14 · HTML forense

Este documento contiene **veinte fallos deliberados**. Cópialo en un archivo `forense.html` dentro de tu proyecto:

```html
<html>
<head>
<title>PixelStore
</head>
<body>
<div class="cabecera">
<img src="C:\Users\pixel\logo.png">
<div class="menu">
<a href="C:\Users\pixel\web\index.html">Inicio</a>
<a href="productos.html">Productos</a>
<a href="https://proveedor.example.com" target="_blank">Proveedor</a>
</div>
</div>

<h1>PixelStore</h1>
<h4>Novedades del catálogo</h4>

<p id="destacado">Portátil Nova 14 <b><i>en oferta</b></i></p>
<p id="destacado">Teclado para Programación avanzada</p>

<img src="grafico-consumo.webp">

<table>
<tr><td>Modelo</td><td>RAM</td><td>Precio</td></tr>
<tr><td>Básico</td><td>8 GB</td><td>19 €</td></tr>
</table>

<form>
Correo: <input type="text">
<div onclick="enviar()">Enviar</div>
</form>

<p>© 2026 PixelStore
</body>
</html>
```

Tu trabajo:

1. Ábrelo en el navegador. Anota qué se ve mal **antes** de mirar el código, y fíjate en si algún texto aparece con caracteres extraños.
2. Pásale HTMLHint y anota qué encuentra.
3. Pásalo por `validator.w3.org` y anota qué encuentra que HTMLHint no encontró.
4. Encuentra al menos **quince** de los veinte fallos y repáralos.
5. Entrega una tabla justificativa con este formato:

| Fallo detectado | Línea | Quién lo detectó | A quién perjudica | Corrección aplicada |
| --------------- | ----- | ---------------- | ----------------- | ------------------- |
| | | | | |

La columna «quién lo detectó» es la importante: al terminar tendrás la prueba, escrita por ti, de que las herramientas encuentran menos de la mitad.

<details class="aside aside--help">
  <summary>Estoy atascado · llevo ocho y no encuentro más</summary>
  <p>Recorre el documento con una lista de comprobación en la mano, en este orden, en lugar de buscar «a ver qué veo»:</p>
  <ol>
    <li>El esqueleto: ¿están las cinco piezas de la sesión 3?</li>
    <li>Los enlaces: ¿alguna ruta describe tu disco duro? ¿Algún <code>target="_blank"</code> sin protección?</li>
    <li>Las imágenes: ¿todas tienen <code>alt</code>?</li>
    <li>Los encabezados: ¿empiezan en <code>h1</code> y bajan de uno en uno?</li>
    <li>Los identificadores: ¿hay algún <code>id</code> repetido?</li>
    <li>La anidación: ¿se cierran en orden inverso al que se abrieron?</li>
    <li>La tabla: ¿tiene <code>caption</code>, <code>thead</code>, <code>th</code> y <code>scope</code>?</li>
    <li>El formulario: ¿etiquetas, <code>name</code>, tipos y botón de verdad?</li>
    <li>La estructura: ¿hay <code>header</code>, <code>nav</code>, <code>main</code> y <code>footer</code>, o solo <code>div</code>?</li>
  </ol>
</details>

<details class="aside aside--extra">
  <summary>Ver los veinte fallos</summary>
  <p><strong>Esqueleto</strong></p>
  <p>1 · Falta <code>&lt;!doctype html&gt;</code>. · 2 · Falta <code>lang="es"</code> en <code>&lt;html&gt;</code>. · 3 · Falta <code>&lt;meta charset="UTF-8"&gt;</code>: por eso «Programación» se ve mal en el navegador. · 4 · Falta <code>&lt;meta name="viewport"&gt;</code>. · 5 · <code>&lt;title&gt;</code> sin cerrar.</p>
  <p><strong>Enlaces e imágenes</strong></p>
  <p>6 · <code>src</code> de la primera imagen con ruta de disco local. · 7 · <code>href</code> del enlace de inicio con ruta de disco local. · 8 · <code>target="_blank"</code> sin <code>rel="noopener noreferrer"</code>. · 9 · La primera imagen no tiene <code>alt</code>. · 10 · La segunda imagen tampoco tiene <code>alt</code>, y además es un gráfico: su <code>alt</code> debe llevar los datos.</p>
  <p><strong>Texto y estructura</strong></p>
  <p>11 · Salto de jerarquía: de <code>h1</code> a <code>h4</code>. · 12 · <code>id="destacado"</code> duplicado en dos párrafos. · 13 · Anidación cruzada: <code>&lt;b&gt;&lt;i&gt;…&lt;/b&gt;&lt;/i&gt;</code>. · 14 · Último <code>&lt;p&gt;</code> sin cerrar. · 15 · La cabecera y el menú son <code>div</code>: deberían ser <code>&lt;header&gt;</code> y <code>&lt;nav&gt;</code> con una lista. · 16 · No hay <code>&lt;main&gt;</code> ni <code>&lt;footer&gt;</code>.</p>
  <p><strong>Tabla y formulario</strong></p>
  <p>17 · La tabla no tiene <code>&lt;caption&gt;</code>, ni <code>&lt;thead&gt;</code>/<code>&lt;tbody&gt;</code>, ni <code>&lt;th scope&gt;</code>: sus encabezados son <code>td</code>. · 18 · El campo de correo no tiene <code>&lt;label&gt;</code> asociado. · 19 · El campo no tiene <code>name</code> y usa <code>type="text"</code> en vez de <code>type="email"</code>. · 20 · El botón de envío es un <code>&lt;div onclick&gt;</code>.</p>
  <p>El validador del W3C detecta la sintaxis: el <code>doctype</code> que falta, la codificación no declarada, el <code>&lt;title&gt;</code> abierto, las imágenes sin <code>alt</code>, el <code>id</code> duplicado y la anidación cruzada. No dice nada de la jerarquía de encabezados, ni de la tabla muda, ni del falso botón, ni de la sopa de <code>div</code>. Poco más de la mitad de la lista la tienes que ver tú.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Nombra dos fallos graves que un validador no detecta.</li>
    <li>¿Por qué «válido» no es lo mismo que «correcto»?</li>
    <li>¿Qué riesgo tiene <code>target="_blank"</code> sin <code>rel</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Por ejemplo, usar <code>div</code> donde tocaba un elemento semántico, o un <code>alt</code> que no describe nada. Vale cualquiera de la tabla de la sesión.</p>
  <p>2 · Porque la validez comprueba la sintaxis, no el significado. Un documento sin un solo encabezado y todo hecho de <code>div</code> puede validar perfectamente.</p>
  <p>3 · La página que se abre recibe una referencia a la tuya y puede manipularla. Los navegadores actuales ya cortan esa referencia por su cuenta, pero escribirlo sigue siendo lo correcto: no dependes de la versión del navegador y dejas la intención por escrito.</p>
</details>

---

## Sesión 17 · Integración y cierre del proyecto

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se comprueba antes de dar por terminado un sitio, y en qué orden.</li>
    <li><strong>2. Haz:</strong> Cierra las cuatro páginas del proyecto y pásales la lista completa.</li>
    <li><strong>3. Comprueba:</strong> Las cuatro páginas validan al 100 % en el W3C.</li>
  </ol>
</div>

### El estado final del proyecto

```text
pixelstore/
├── index.html          · portada, con presentación y áreas temáticas
├── productos.html      · catálogo semántico y tabla comparativa
├── acerca.html         · información del proyecto, estructurada
├── contacto.html       · formulario completo con validación nativa
└── img/                · imágenes con alt correcto
```

### Tarea 15 · La lista de comprobación final

Recórrela entera. Cada línea que no puedas marcar es trabajo pendiente de esta sesión.

<div class="checkpoint">
  <p class="checkpoint-label">Estructura y validez</p>
  <ul class="checklist">
    <li>Las cuatro páginas tienen el esqueleto completo con sus cuatro metadatos.</li>
    <li>Las cuatro validan en el W3C con cero errores.</li>
    <li>Cada página tiene un <code>&lt;title&gt;</code> propio y descriptivo.</li>
    <li>Cada página tiene un único <code>h1</code> y ninguna salta niveles.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Semántica y navegación</p>
  <ul class="checklist">
    <li>Hay <code>header</code>, <code>nav</code>, <code>main</code> y <code>footer</code> en las cuatro páginas.</li>
    <li>Ningún <code>div</code> sustituye a un elemento que sí significaba algo.</li>
    <li>El menú es idéntico en las cuatro y cada una marca la suya con <code>aria-current</code>.</li>
    <li>Todas las rutas son relativas y el sitio sobrevive a cambiarlo de carpeta.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Contenido</p>
  <ul class="checklist">
    <li>Todas las imágenes tienen <code>alt</code>, lleno o vacío según su función.</li>
    <li>La tabla comparativa tiene <code>caption</code> y <code>scope</code> en los dos sentidos.</li>
    <li>El formulario tiene etiquetas asociadas, tipos correctos y validación nativa.</li>
    <li>El formulario se recorre entero con <code>Tab</code>.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">Condición de entrega · cero CSS</p>
  <p>Ni ficheros <code>.css</code>, ni <code>&lt;style&gt;</code>, ni atributos <code>style</code>. Un solo estilo invalida la entrega, porque lo que se evalúa es la estructura y el estilo sirve precisamente para taparla.</p>
</div>

---

## Sesión 18 · Revisión por pares y defensa

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se revisa el código de otra persona de forma útil y no ofensiva.</li>
    <li><strong>2. Haz:</strong> Audita el proyecto de un compañero y rellena la matriz de coevaluación.</li>
    <li><strong>3. Entrega:</strong> Entrega el proyecto, la matriz recibida y defiende tus decisiones.</li>
  </ol>
</div>

### Revisar código ajeno

Una revisión útil no dice «está mal». Dice tres cosas: **qué**, **por qué** y **qué harías tú**. Las tres, siempre.

| En vez de escribir | Escribe |
| ------------------ | ------- |
| «La tabla está mal» | «Faltan los `scope` en los `th`: sin ellos cada celda se anuncia sin su encabezado. Añadiría `scope="col"` en la cabecera y `scope="row"` en la primera columna» |
| «Los alt no valen» | «El `alt` del gráfico dice “gráfico”: quien no lo vea pierde los datos. Pondría los tres valores que compara» |

Y una regla que vale para toda tu vida profesional: **se revisa el código, no a la persona**. «Este enlace apunta a tu disco» y «no sabes hacer enlaces» describen el mismo hecho y solo uno de los dos sirve para algo.

### Tarea 16 · Matriz de coevaluación

Intercambia el proyecto con otro alumno y audita el suyo:

| Aspecto auditado | Archivo | Problema detectado | Propuesta de corrección |
| :--- | :--- | :--- | :--- |
| Validez W3C | | | |
| Jerarquía de encabezados | | | |
| Estructura semántica | | | |
| Navegación y rutas | | | |
| Imágenes y `alt` | | | |
| Tablas | | | |
| Formulario | | | |

Después, el autor recibe la matriz, decide **qué acepta y qué no**, y anota su decisión. Rechazar una observación justificándola bien también es parte del ejercicio: la revisión propone, no manda.

### Producto final

Se entrega:

* **A · El sitio.** Cuatro páginas enlazadas, sin CSS, validadas en el W3C.
* **B · La tabla forense** de la sesión 16, con las correcciones justificadas.
* **C · La matriz de coevaluación** que has hecho del proyecto de tu compañero.
* **D · Tus decisiones**, en media página: las tres decisiones de estructura de las que estás más seguro, y por qué.

### Presentación

Dispones de unos **3 minutos** delante del grupo y respondes a cuatro preguntas:

* ¿Qué parte de tu estructura te costó más decidir y cómo la resolviste?
* Enséñanos un sitio donde estuviste tentado de usar un `div` y no lo hiciste.
* ¿Qué fallo encontraste en el proyecto de tu compañero que también tenías tú?
* Si mañana llega el CSS, ¿qué parte de tu HTML tendrías que tocar? *(La respuesta correcta es «ninguna».)*

### Evaluación

| Criterio | Puntos |
| ------------------------------------------------- | -----: |
| Estructura y validez del documento | 2 |
| Jerarquía de encabezados y semántica estructural | 2 |
| Navegación y rutas relativas | 1,5 |
| Formulario accesible y validado | 1,5 |
| Imágenes y textos alternativos | 1 |
| Tablas accesibles | 1 |
| Auditoría forense y justificación de correcciones | 1 |

Durante la defensa se preguntará por **una decisión concreta** de tu proyecto. No se evalúa que hayas usado muchas etiquetas distintas, sino que sepas decir por qué elegiste cada una. Un sitio sencillo y bien justificado vale más que uno lleno de elementos puestos por si acaso.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · entrega</p>
  <ul class="checklist">
    <li>Las cuatro páginas validan y no contienen un solo estilo.</li>
    <li>La tabla forense está entregada y justificada.</li>
    <li>Has revisado el proyecto de un compañero con el formato qué / por qué / qué harías.</li>
    <li>Has decidido qué observaciones de tu revisor aceptas y cuáles no, y por qué.</li>
    <li>Puedes justificar cualquier decisión de estructura de tu sitio.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

Ante cualquier trozo de información que tengas que marcar, esta es la secuencia. No cambia en toda tu carrera:

<figure class="diagram">
  <figcaption>Cómo se decide una etiqueta</figcaption>
  <ol class="flow">
    <li>¿Qué <em>es</em> esto? Un título, una lista, un dato tabular, una acción</li>
    <li>¿Existe un elemento que ya significa eso?</li>
    <li>Si existe, úsalo. Si no existe, entonces sí: un <code>div</code></li>
    <li>Compruébalo sin verlo: con el teclado, con las imágenes apagadas, con el validador</li>
  </ol>
</figure>

El paso tres es el que separa a quien ha entendido la unidad de quien ha memorizado etiquetas. `div` no es el error: usarlo **en lugar de** algo que sí significaba, sí.

### La idea más importante

Si dentro de un año has olvidado los atributos, que quede esta:

> **Que una página se vea bien no demuestra nada. El navegador repara el HTML roto en silencio, y lo que repara no es lo que escribiste.**

De ahí sale todo lo demás: por eso se valida, por eso se prueba con el teclado, por eso se apagan las imágenes, y por eso el `alt` correcto no depende de lo que se ve sino de para qué está la imagen.

<p class="term">HTML describe qué es cada cosa, no cómo se ve</p>

Esa frase es la que hace posible la siguiente unidad. Si tu estructura dice lo que las cosas son, el CSS podrá cambiar por completo su apariencia sin tocar una línea de tu HTML.

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Elemento | La unidad completa: etiqueta de apertura, contenido y cierre |
| Etiqueta | La marca que delimita un elemento |
| Atributo | Un dato añadido a una etiqueta, con nombre y valor |
| Elemento vacío | El que no envuelve contenido y no se cierra: `img`, `meta`, `br` |
| Anidación | Contener unos elementos dentro de otros, cerrando en orden inverso |
| Linter | Programa que avisa de errores mientras escribes, sin ejecutar el código |
| Validador | Servicio que dictamina si un documento cumple la especificación |
| `doctype` | La declaración de que el documento es HTML estándar |
| `charset` | Cómo se traducen los bytes del archivo a caracteres |
| `viewport` | La instrucción de adaptarse al ancho real del dispositivo |
| Jerarquía de encabezados | El índice del documento, de `h1` a `h6`, sin saltos |
| Ruta relativa | Camino al destino desde el archivo que escribe el enlace |
| Landmark | Zona con significado propio: `header`, `nav`, `main`, `aside`, `footer` |
| `section` | Parte temática que solo tiene sentido dentro de esta página |
| `article` | Contenido que se entendería publicado por separado |
| Texto alternativo | Lo que ocupa el lugar de una imagen cuando la imagen no está |
| `scope` | Declara si un encabezado de tabla manda sobre su fila o su columna |
| Etiqueta asociada | `label` unido a su campo mediante `for` e `id` |
| Validación nativa | Comprobaciones que hace el navegador sin JavaScript |
| Accesibilidad | Que el contenido siga siendo usable sin ver la pantalla y sin ratón |

### La siguiente unidad

Durante seis semanas has respondido a una sola pregunta:

> **¿Qué representa cada elemento y cómo se estructura la información?**

En la siguiente unidad llega CSS, y con él la apariencia: colores, tipografía, Flexbox, Grid y diseño adaptable.

<figure class="diagram">
  <figcaption>Las dos mitades del oficio</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>HTML · qué es cada cosa</li>
    <li>CSS · cómo se ve</li>
  </ol>
</figure>

Y aquí se cobra el trabajo de estas seis semanas: sobre una estructura semántica, dar estilo es cuestión de escribir selectores. Sobre una sopa de `div`, es cuestión de adivinar cuál era cuál.

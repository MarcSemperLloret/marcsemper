---
title: "HTML: estructura y contenido de la Web"
label: "UD1 · Guía y taller práctico"
section: "ud-01"
order: 1
lang: "es"
summary: "HTML no describe cómo se ve una página, sino qué representa cada parte de su contenido. Durante 18 sesiones recorremos el lenguaje completo —texto, listas, enlaces, imágenes, semántica, tablas y formularios— construyendo un sitio multipágina real sin una sola línea de CSS."
duration: "18 sesiones · 6 semanas"
modality: "Individual, con retos y revisión en pareja"
deliverable: "Sitio web multipágina de cuatro páginas enlazadas, escrito solo con HTML semántico, validado en el W3C y revisado por otro alumno."
outcomes:
  - "Montar un proyecto web en VS Code y detectar errores antes de abrir el navegador."
  - "Escribir documentos HTML5 válidos con los metadatos que de verdad cambian algo: charset, viewport, lang y title."
  - "Ordenar el contenido con una jerarquía de encabezados que funcione como índice del documento."
  - "Marcar texto por su significado y no por su apariencia, y escribir caracteres especiales con entidades."
  - "Representar información con el tipo de lista que le corresponde, incluidas las anidadas."
  - "Enlazar archivos con rutas relativas que sigan funcionando al mover el proyecto de sitio."
  - "Elegir el texto alternativo correcto para una imagen, incluido decidir cuándo debe ir vacío."
  - "Sustituir maquetación a base de div por elementos semánticos y justificar cada sustitución."
  - "Construir tablas accesibles y reconocer cuándo unos datos no son una tabla."
  - "Escribir formularios completos que se puedan usar con el teclado y con un lector de pantalla."
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

## ¿Qué vas a aprender?

Cuando usamos una web vemos textos, imágenes, menús, formularios, botones o tablas. Pero el navegador necesita saber algo más importante que cómo se ven:

> **¿Qué representa cada elemento?**

Un título no es un texto grande. Un menú no es un puñado de palabras seguidas. Una imagen no es un archivo colocado en pantalla.

HTML es el lenguaje con el que **describimos la estructura y el significado del contenido**. En esta unidad aprenderás a escribir documentos modernos, organizados, semánticos y accesibles.

Todavía no vamos a preocuparnos de que sean bonitos. Eso llega con CSS, en la unidad siguiente. Primero hay que construir bien la estructura.

Y aprender HTML no consiste en memorizar cien etiquetas: la lista está publicada y se consulta. Consiste en **decidir qué significa cada trozo de información**. Por eso la unidad no avanza recitando etiquetas, sino planteando decisiones: ¿esto es una lista o un párrafo?, ¿esta imagen informa o decora?, ¿esto es una tabla o solo lo parece?

### Cómo es cada sesión

Cada sesión dura **una hora** y tiene siempre la misma forma:

<figure class="diagram">
  <figcaption>El ritmo de cada sesión</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Aprende · 15 min</li>
    <li>Haz · 30 min</li>
    <li>Comprueba · 15 min</li>
  </ol>
</figure>

Tres sesiones por semana, seis semanas, dieciocho horas. Cada bloque de teoría termina con un **«Ahora tú»**, y cada dos o tres sesiones hay una tarea mayor que hace avanzar el mismo proyecto.

---

## El proyecto de la unidad

Durante las próximas semanas construirás progresivamente un pequeño sitio web. **El tema lo eliges tú**: una empresa ficticia, una tienda, una asociación, un evento, un videojuego, un proyecto tecnológico, tu portfolio, o cualquier otra propuesta que acuerdes con el profesor.

Al terminar tendrás algo parecido a esto:

```text
mi-web/
│
├── index.html
├── productos.html
├── acerca.html
├── contacto.html
│
└── img/
    ├── portada.webp
    ├── producto-1.webp
    └── producto-2.webp
```

No vas a recibir el proyecto terminado para completar huecos. Lo construirás a medida que aprendas HTML.

<p class="single-node">PixelStore</p>

Los ejemplos de estos apuntes usan siempre la misma empresa ficticia —una tienda de componentes y periféricos para desarrolladores— para que se entiendan en contexto. Tú aplica cada idea a **tu** tema.

### Dos condiciones para toda la unidad

<div class="rule">
  <p class="rule-label">Condición 1 · cero CSS</p>
  <p>Durante estas seis semanas está prohibido escribir estilos: ni ficheros <code>.css</code>, ni etiquetas <code>&lt;style&gt;</code>, ni atributos <code>style="..."</code>.</p>
  <p>No es un capricho. Si puedes maquillar el resultado, la tentación es resolver los problemas de estructura con apariencia. Sin CSS, la única forma de que un documento se entienda es que <strong>esté bien estructurado</strong>. Tu web va a parecerte fea, y esa es exactamente la idea: lo que se evalúa no es cómo se ve, sino qué significa.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 2 · la IA se usa para entender, no para entregar</p>
  <p>Puedes usar IA para preguntar qué significa un error, comparar dos alternativas, revisar accesibilidad, explicarte una etiqueta, generar textos ficticios de relleno o ayudarte a localizar un problema.</p>
  <p>No para pedir «hazme la web de la práctica». La razón es sencilla: si una IA escribe <code>&lt;article&gt;</code> y tú no sabes decir por qué no es un <code>&lt;section&gt;</code>, no has aprendido HTML, y en la defensa se nota en treinta segundos.</p>
  <p>Durante las actividades se te pedirán modificaciones pequeñas sobre tu propio código —añade un producto, convierte esto en tabla, corrige esta jerarquía, explica por qué esta imagen lleva <code>alt=""</code>—. No hace falta que lo memorices todo. Sí que sepas <strong>qué estás haciendo y dónde buscar lo que no recuerdas</strong>.</p>
</div>

---

## Plan de trabajo semanal

| Semana | Bloque temático | Práctica central y entregable semanal | Horas |
| :---: | :--- | :--- | :---: |
| **Semana 1** | El editor y el documento HTML | Entorno, reparación de HTML roto y primera página propia | 3 h |
| **Semana 2** | Texto, listas, enlaces y navegación | Interpretación de información, sitio multipágina y laberinto de rutas | 3 h |
| **Semana 3** | Imágenes y semántica estructural | Criterio de `alt`, refactorización de *div soup* y auditoría con DevTools | 3 h |
| **Semana 4** | Tablas para datos tabulares | Tabla comparativa accesible, tabla compleja y matriz de idoneidad | 3 h |
| **Semana 5** | Formularios accesibles | Formulario comercial progresivo y auditoría de uno defectuoso | 3 h |
| **Semana 6** | Depuración, validación y coevaluación | HTML forense, cierre del proyecto y revisión por pares | 3 h |
| **Total** | | **Sitio multipágina validado y revisado** | **18 h** |

El reparto real del tiempo es aproximadamente este, y conviene que lo sepas desde el principio:

| En qué se va la unidad | Horas |
| ---------------------- | ----: |
| Explicación y demostraciones | 5–6 h |
| Ejercicios guiados | 7–8 h |
| Proyecto incremental | 3–4 h |
| Depuración, validación y revisión por pares | 1–2 h |

No son dieciocho horas explicando etiquetas.

---

## Semana 1 · El editor y el documento HTML

---

## Sesión 1 · Conociendo Visual Studio Code

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué hace un editor de código, por qué se trabaja con carpetas de proyecto y qué es un linter.</li>
    <li><strong>2. Haz:</strong> Monta el entorno y reconstruye un documento a partir de su resultado visible.</li>
    <li><strong>3. Comprueba:</strong> El documento se ve como se pedía y el panel de problemas está limpio.</li>
  </ol>
</div>

### Un editor no es un Bloc de notas con colores

Durante el módulo usaremos **Visual Studio Code**. Nos ayuda a organizar proyectos, detectar errores, navegar entre archivos, completar y formatear código, buscar información y ejecutar herramientas.

Si nunca lo has usado, no pasa nada: aprender a manejar herramientas nuevas también es parte del trabajo.

VS Code ya trae de serie todo lo que necesitamos para HTML: resaltado de sintaxis, sugerencias, cierre automático de etiquetas, documentación al pasar el ratón, formateo, Emmet y previsualización. **No hace falta instalar diez extensiones para empezar.**

#### Por qué una carpeta de proyecto y no archivos sueltos

Un sitio web no es un archivo: es un conjunto de archivos que se referencian entre sí. Si abres archivos sueltos, el editor no sabe dónde está la raíz del sitio.

| Si abres... | El editor puede... |
| ----------- | ------------------ |
| Un archivo suelto | Colorear la sintaxis de ese archivo |
| La carpeta del proyecto | Resolver rutas, autocompletar enlaces, buscar en todo el sitio y analizarlo entero |

### La única extensión obligatoria · HTMLHint

<p class="term">Linter</p>

Un programa que analiza el código **mientras lo escribes** y avisa de errores y malas prácticas, sin llegar a ejecutarlo.

Instala **HTMLHint** desde el panel de extensiones. Analizará tu HTML y avisará de cosas como estas:

```html
<h1>Mi web
```

```html
<img src="">
```

Los avisos aparecen en el panel de problemas:

```text
View → Problems
```

<div class="rule">
  <p class="rule-label">Qué significa «arreglar un aviso»</p>
  <p>El objetivo no es que la herramienta deje de quejarse pulsando cosas al azar hasta que el panel se ponga verde. El objetivo es <strong>entender por qué existe el problema y corregirlo</strong>. Un aviso que no entiendes es un aviso que volverá.</p>
</div>

#### Prettier · opcional, y todavía no

También existe **Prettier**, que aplica automáticamente un formato consistente. Puedes instalarlo, pero durante las primeras sesiones no vamos a depender de él: primero tienes que aprender a escribir código legible tú. Automatizar lo que no sabes hacer a mano solo esconde el problema.

### El entorno, paso a paso

1. Crea una carpeta para tu proyecto. Por ejemplo `mi-web`.
2. En VS Code, `Archivo → Abrir carpeta`, y selecciona **la carpeta**, no un archivo.
3. En el explorador lateral, crea `index.html`. Ese nombre no es casual: es el que los servidores sirven por defecto como página principal.
4. Instala HTMLHint desde `Ctrl + Shift + X`.

Localiza también estas zonas, porque las vas a usar seis semanas: Explorer, Search, Extensions, el editor, la barra de estado y el panel Problems.

#### La paleta de comandos

```text
Ctrl + Shift + P
```

Permite ejecutar prácticamente cualquier acción de VS Code escribiendo su nombre. En lugar de memorizar en qué menú está cada opción, la buscas. Pruébalo con `Format Document`.

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
    <li>HTMLHint está instalado y ves su salida en el panel Problems.</li>
    <li>Sabes abrir la paleta de comandos.</li>
    <li>Tu <code>index.html</code> se ve como el resultado pedido.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué se abre la carpeta entera en el editor y no el archivo?</li>
    <li>¿Qué hace un linter?</li>
    <li>¿Por qué se llama <code>index.html</code> la página principal?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para que el editor conozca la raíz del proyecto: así resuelve y autocompleta las rutas relativas, busca en todos los archivos y aplica el linter a todo el sitio.</p>
  <p>2 · Analiza el código mientras lo escribes y avisa de errores y malas prácticas sin ejecutarlo.</p>
  <p>3 · Porque es el nombre que los servidores web sirven por defecto cuando se pide una carpeta sin especificar archivo.</p>
</details>

---

## Sesión 2 · Nuestra primera página y la anatomía del HTML

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es un elemento, en qué se diferencia de una etiqueta y de un atributo, y por qué el navegador no sirve para validar HTML.</li>
    <li><strong>2. Haz:</strong> Escribe tu primera página completa a mano y repara un documento roto.</li>
    <li><strong>3. Comprueba:</strong> El panel de problemas queda en cero errores.</li>
  </ol>
</div>

### Escríbela entera, a mano

Todavía no vamos a usar atajos. Escribe esto letra a letra:

```html
<!doctype html>

<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Mi primera web</title>
</head>

<body>
    <h1>Mi primera página web</h1>

    <p>
        Esta página está construida utilizando HTML.
    </p>
</body>

</html>
```

Guarda con `Ctrl + S` y ábrelo en el navegador, o usa la previsualización de VS Code. Durante el desarrollo tendrás normalmente estas dos cosas a la vista:

<figure class="diagram">
  <figcaption>El ciclo de trabajo</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Escribes en VS Code</li>
    <li>Guardas</li>
    <li>Miras el resultado en el navegador</li>
  </ol>
</figure>

### Elemento, etiqueta y atributo no son lo mismo

Se usan como sinónimos y no lo son.

```html
<p>Hola</p>
```

```text
<p>       etiqueta de apertura
Hola      contenido
</p>      etiqueta de cierre
```

<p class="term">Elemento</p>

La unidad completa: apertura, contenido y cierre. La etiqueta es solo la marca que lo delimita. Cuando decimos «un párrafo» hablamos del elemento; cuando decimos «falta el `</p>`» hablamos de la etiqueta.

#### Los elementos contienen otros elementos

```html
<p>
    Estoy estudiando <strong>DAW</strong>.
</p>
```

Aquí `strong` está **dentro** de `p`. Eso crea una estructura jerárquica, un árbol, y ese árbol es lo que después leerán el CSS, el buscador y el lector de pantalla.

#### Los elementos tienen atributos

```html
<html lang="es">
```

```text
elemento    html
atributo    lang
valor       es
```

Los atributos aportan información adicional sobre el elemento. Vas a ver muchos durante la unidad.

#### Elementos vacíos

Algunos elementos no envuelven nada: aportan algo por sí mismos. Se escriben con una sola etiqueta y **no se cierran**.

```html
<meta charset="UTF-8">
<img src="teclado.webp" alt="Teclado mecánico compacto">
<br>
<hr>
```

Escribir `</img>` no es otro estilo: es un error.

#### La regla de la anidación

Los elementos se cierran como los paréntesis: **el último que se abre es el primero que se cierra**.

```html
<!-- Correcto -->
<p>Un <strong>teclado <em>mecánico</em></strong> compacto.</p>

<!-- Incorrecto -->
<p>Un <strong>teclado <em>mecánico</strong></em> compacto.</p>
```

En el segundo, `strong` se cierra antes que `em`, que se abrió después. El navegador lo mostrará parecido, porque adivinará, pero el árbol que construya ya no es el que escribiste.

### El navegador no es un corrector

Este documento está roto de cuatro formas: falta el `doctype`, falta el idioma, falta la codificación y hay tres etiquetas sin cerrar.

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

Ábrelo. **Se ve perfectamente.** Un navegador está diseñado para no fallar nunca delante de un usuario: ante un documento roto no muestra un error, adivina lo que querías decir y lo repara en silencio.

> **Que una página se vea bien no demuestra que su HTML esté bien. Solo demuestra que el navegador ha sabido disimularlo.**

Recuerda esta frase, porque es el hilo de toda la unidad y volveremos a ella en la sesión 16.

### Tarea 2 · Repara el HTML roto

Copia ese mismo fragmento en un archivo `roto.html`.

<p class="stage">Paso 1 · Te enseño uno</p>

<dl class="worked">
  <dt>¿Qué está mal?</dt>
  <dd>La etiqueta <code>&lt;title&gt;</code> se abre y nunca se cierra antes de <code>&lt;/head&gt;</code>.</dd>
  <dt>¿Qué hace el navegador con eso?</dt>
  <dd>Cierra el título por su cuenta al encontrar <code>&lt;/head&gt;</code>. La pestaña se ve bien, así que el fallo pasa inadvertido.</dd>
  <dt>¿A quién perjudica?</dt>
  <dd>A cualquier programa que lea el documento tal como está escrito en lugar de repararlo: buscadores, lectores de pantalla, validadores.</dd>
  <dt>Corrección</dt>
  <dd><code>&lt;title&gt;PixelStore&lt;/title&gt;</code></dd>
</dl>

No basta con decir «falta una etiqueta»: interesa qué consecuencia tiene, porque es lo que te permitirá priorizar cuando encuentres veinte fallos a la vez.

<p class="stage stage--solo">Paso 2 · Ahora tú</p>

1. Abre el panel de problemas con `Ctrl + Shift + M` y anota qué detecta HTMLHint **y qué no**.
2. Repara el documento entero: `doctype`, `lang`, codificación, viewport y todas las etiquetas pendientes.
3. Al final del archivo, escribe un comentario HTML explicando los **tres fallos más graves** del original y por qué lo eran.

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
  <p>1 · El elemento es la unidad completa: apertura, contenido y cierre. La etiqueta es la marca que lo delimita.</p>
  <p>2 · Por ejemplo <code>&lt;meta&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;br&gt;</code> o <code>&lt;hr&gt;</code>.</p>
  <p>3 · Porque rompe el orden de anidación: <code>em</code> se abrió el último y debería cerrarse el primero. El navegador reconstruye un árbol distinto del escrito, y ese árbol es el que verán el CSS, el buscador y el lector de pantalla.</p>
</details>

---

## Sesión 3 · La estructura de un documento HTML

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué declara cada pieza del esqueleto y qué se rompe exactamente cuando falta.</li>
    <li><strong>2. Haz:</strong> Rompe deliberadamente tu página, observa qué pasa, y empieza la portada de tu proyecto.</li>
    <li><strong>3. Comprueba:</strong> Los acentos se ven bien y la página es legible en la vista de móvil.</li>
  </ol>
</div>

### Pieza por pieza

#### `<!doctype html>`

```html
<!doctype html>
```

Le dice al navegador que el documento es HTML moderno. Sin él, el navegador entra en *modo compatibilidad* y aplica reglas de hace veinte años.

#### `<html lang="es">`

Es el elemento raíz: todo lo demás va dentro. El atributo `lang` declara el idioma principal, y lo usan los lectores de pantalla para elegir la voz y la pronunciación, los navegadores para ofrecer traducción, y los buscadores para clasificar la página.

Sin `lang="es"`, un lector de pantalla lee el español con fonética inglesa y se vuelve incomprensible.

#### `<head>`

Contiene información **sobre** el documento. Nada de lo que hay aquí se ve en la ventana.

```html
<meta charset="UTF-8">
```

Define la codificación: cómo se traducen los bytes del archivo a caracteres. Gracias a UTF-8 podemos escribir correctamente:

```text
á é í ó ú
ñ
€
¿ ?
```

Si falta, «Programación» se muestra como «ProgramaciÃ³n».

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Indica al navegador que use el ancho real del dispositivo. Sin él, un móvil muestra la página de escritorio encogida e ilegible. Lo entenderemos del todo al estudiar CSS responsive; por ahora forma parte de la estructura fija.

```html
<title>PixelStore | Componentes para desarrolladores</title>
```

No aparece dentro de la página: aparece en la pestaña, en los favoritos y como titular en un buscador. Compara:

```html
<title>Inicio</title>
<title>PixelStore | Componentes para desarrolladores</title>
```

¿Cuál te dice de qué web es, si lo ves en una lista de veinte pestañas?

#### `<body>`

Contiene el contenido que verá el usuario.

<div class="rule">
  <p class="rule-label">La prueba para no confundir <code>head</code> y <code>body</code></p>
  <p>Si es algo que una persona debería <strong>leer</strong>, va en el <code>body</code>. Si es algo que el navegador necesita <strong>saber</strong> antes de dibujar nada, va en el <code>head</code>.</p>
</div>

| Pieza | Qué declara | Qué pasa si falta |
| ----- | ----------- | ----------------- |
| `<!doctype html>` | Que el documento es HTML estándar | Modo compatibilidad, con reglas antiguas |
| `lang="es"` | El idioma del contenido | El lector de pantalla lo pronuncia en inglés |
| `charset="UTF-8"` | Cómo se traducen los bytes a caracteres | «Programación» se ve como «ProgramaciÃ³n» |
| `viewport` | Que se adapte al ancho del dispositivo | En móvil se ve la página de escritorio encogida |
| `<title>` | El nombre del documento | Pestaña, favorito y buscador sin identificar |

### Práctica guiada · Destruye la página

Vamos a aprender provocando errores. Sobre una copia de tu página, haz estas seis cosas, **de una en una**, y anota qué ocurre:

1. Elimina `</h1>`.
2. Elimina `</body>`.
3. Escribe una etiqueta que no existe, como `<titulo>`.
4. Duplica un elemento.
5. Cambia `UTF-8` por `ISO-8859-1`.
6. Elimina `lang`.

Para cada una, tres columnas:

| Qué he roto | Qué hace el navegador | Qué dice HTMLHint |
| ----------- | --------------------- | ----------------- |
| | | |

Al terminar, deja el documento correcto otra vez. Lo que quiero que veas es cuántas de las seis **el navegador no delata en absoluto**. Esa es la razón por la que existen los linters y los validadores.

### Emmet · atajos, cuando ya sabes escribirlo

Ahora que has escrito el esqueleto a mano, puedes abreviarlo. VS Code incluye **Emmet**:

```text
!
```

y `Tab` genera la estructura completa de un documento. O:

```text
ul>li*3
```

que se expande a:

```html
<ul>
    <li></li>
    <li></li>
    <li></li>
</ul>
```

<div class="rule">
  <p class="rule-label">La regla de Emmet</p>
  <p><strong>No uses una abreviatura cuyo resultado no seas capaz de escribir y explicar a mano.</strong> Emmet es una herramienta de productividad: te ahorra tecleo, no conocimiento.</p>
</div>

### Ahora tú · La portada de tu proyecto

Crea `index.html` en la raíz de tu carpeta y constrúyela con:

* El esqueleto completo y los cuatro metadatos correctos.
* Un `<title>` descriptivo, con el tema de tu proyecto.
* Un **único** `<h1>` con el nombre del proyecto.
* Al menos tres `<h2>` que dividan la portada en áreas temáticas.
* Párrafos descriptivos reales, con una descripción del proyecto.

Este archivo no es un ejercicio desechable: es la primera página del sitio que entregarás dentro de seis semanas.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación · dos pruebas de un minuto</p>
  <p>Escribe en algún párrafo la palabra «Programación». Si se ve correctamente, tu <code>charset</code> está bien. Después abre DevTools con <code>F12</code>, activa la vista de dispositivo móvil y comprueba que el texto se lee sin hacer zoom: si hay que ampliar, falta el <em>viewport</em>.</p>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué síntoma concreto delata que falta el <code>charset</code>?</li>
    <li>¿A quién perjudica que falte <code>lang="es"</code>?</li>
    <li>De las seis cosas que rompiste, ¿cuántas delató el navegador?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Los caracteres no ingleses se muestran mal: acentos, eñes y signos de apertura aparecen como símbolos extraños.</p>
  <p>2 · Sobre todo a quien usa un lector de pantalla, que elige voz y fonética según el idioma declarado. También a los buscadores.</p>
  <p>3 · Prácticamente ninguna, salvo el cambio de codificación. Ese es justo el punto de la práctica.</p>
</details>

---

## Semana 2 · Texto, listas, enlaces y navegación

---

## Sesión 4 · Texto y jerarquía de contenido

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Que los encabezados son el índice del documento, qué elementos marcan significado en el texto y cómo se escriben los caracteres especiales.</li>
    <li><strong>2. Haz:</strong> Resuelve el reto de anidación y aplica la jerarquía correcta a tu portada.</li>
    <li><strong>3. Comprueba:</strong> Ningún encabezado se salta un nivel.</li>
  </ol>
</div>

### HTML no sirve para decir «quiero esto grande»

Sirve para decir:

> «Esto es el título principal del documento.»

Es la diferencia entre describir la apariencia y describir el significado, y explica casi todos los errores de esta unidad.

### Encabezados

Hay seis niveles, de `h1` a `h6`:

```html
<h1>PixelStore</h1>

<h2>Productos</h2>

<h3>Ordenadores portátiles</h3>
```

Los niveles indican **jerarquía**, no tamaño. Construyen el índice del documento:

```text
h1 PixelStore

    h2 Productos

        h3 Portátiles

        h3 Monitores

    h2 Servicios

        h3 Reparaciones

    h2 Contacto
```

Ese índice es exactamente lo que usa un lector de pantalla para saltar de sección en sección, y lo que usa un buscador para entender de qué habla la página.

<div class="rule">
  <p class="rule-label">Cómo elegir el nivel sin equivocarse</p>
  <p>No preguntes «¿qué tamaño quiero?». Pregunta <strong>«¿de qué es esto una parte?»</strong>. Si es parte de la sección anterior, baja un nivel. Si es una sección nueva del mismo rango, usa el mismo nivel.</p>
  <p>Y no saltes niveles hacia abajo: después de un <code>h1</code> viene un <code>h2</code>, no un <code>h3</code>. Saltar es como escribir un índice con el capítulo 1, el apartado 1.1.1 y nada en medio.</p>
  <p>Si el tamaño resultante no te gusta, es un problema de CSS. Con CSS podrás dar a cualquier encabezado el tamaño que necesites.</p>
</div>

### Párrafos

```html
<p>
    PixelStore es una tienda especializada en tecnología.
</p>
```

No uses varios `<br>` para crear párrafos:

```html
<!-- Incorrecto -->
Texto uno
<br>
<br>
Texto dos

<!-- Correcto -->
<p>Texto uno.</p>
<p>Texto dos.</p>
```

Las dos versiones se ven casi igual. La primera dice «un texto suelto con saltos de línea»; la segunda dice «dos párrafos». `<br>` existe para saltos que forman parte del contenido: los versos de un poema, las líneas de una dirección postal. HTML describe la estructura; CSS controlará el espacio.

### Énfasis y significado

```html
<strong>Importante</strong>
<em>énfasis</em>
```

`strong` indica importancia; `em` indica énfasis. No pienses:

```text
strong = negrita
em = cursiva
```

Eso describe su apariencia habitual, no su significado. Con CSS podrías hacer que `strong` se viera de cualquier otra forma, y seguiría significando lo mismo.

#### Otros elementos de texto útiles

```html
<mark>texto destacado</mark>
```

```html
<small>información secundaria</small>
```

```html
<del>49,99 €</del> <ins>39,99 €</ins>
```

```html
<abbr title="HyperText Markup Language">HTML</abbr>
```

```html
<code>index.html</code>
```

| Elemento | Significa |
| -------- | --------- |
| `mark` | Resaltado por relevancia en el contexto actual, como un subrayador |
| `small` | Letra pequeña en el sentido legal: avisos, notas al pie |
| `del` / `ins` | Contenido eliminado y contenido añadido. El par es perfecto para un precio rebajado |
| `abbr` | Una abreviatura, con su significado en `title` |
| `code` | Un fragmento de código o un nombre de archivo |

### Entidades HTML

¿Cómo escribimos un `<` si `<` es lo que abre una etiqueta? Con **entidades**:

| Escribes | Se ve |
| -------- | ----- |
| `&lt;` | `<` |
| `&gt;` | `>` |
| `&amp;` | `&` |
| `&quot;` | `"` |
| `&nbsp;` | Un espacio que no se parte al final de línea |
| `&copy;` | © |

Esto es imprescindible cuando quieres **mostrar código HTML dentro de una página**, que es justo lo que hacen estos apuntes. Si escribieras `<p>` tal cual, el navegador lo interpretaría como un párrafo en lugar de mostrarlo.

### Reto 1 · ¿Qué está mal aquí? (10 min)

```html
<p>
    <h2>Nuestros productos</h2>
</p>
```

¿Qué principio de HTML se está incumpliendo y qué hará el navegador con esto?

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 1</summary>
  <p>Un <code>&lt;p&gt;</code> solo puede contener contenido en línea: texto, <code>strong</code>, <code>em</code>, <code>a</code>, <code>img</code>… Un encabezado es un elemento de bloque y no cabe dentro de un párrafo.</p>
  <p>El navegador no muestra un error: cierra el párrafo por su cuenta justo antes del <code>&lt;h2&gt;</code> y deja suelto el <code>&lt;/p&gt;</code> final. Acabas con un párrafo vacío, un encabezado que no está donde creías y una etiqueta huérfana. Otra vez el mismo patrón: se ve bien, y la estructura real no es la que escribiste.</p>
</details>

### Ahora tú · Revisa la jerarquía de tu portada

1. Dibuja en papel el índice de tu `index.html`: qué es `h1`, qué es `h2`, qué es `h3`.
2. Comprueba que no hay ningún salto de nivel y que solo hay un `h1`.
3. Sustituye cualquier `<br><br>` que hayas usado para separar por párrafos reales.
4. Añade al menos un `abbr`, un `code` o un par `del`/`ins` donde tenga sentido de verdad. Si no lo tiene en tu tema, no lo fuerces: dilo en un comentario.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué está mal pasar de <code>h2</code> a <code>h4</code>?</li>
    <li>¿Cuál es la diferencia de significado entre <code>strong</code> y <code>em</code>?</li>
    <li>¿Cómo escribirías «&lt;p&gt;» para que se vea tal cual en la página?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque los encabezados forman el índice del documento y saltar deja un hueco: quien navegue por encabezados no sabrá de qué es parte ese <code>h4</code>.</p>
  <p>2 · <code>strong</code> marca importancia; <code>em</code> marca énfasis, el matiz que cambiaría el tono al leer la frase en voz alta. Ninguno de los dos significa «negrita» o «cursiva».</p>
  <p>3 · <code>&amp;lt;p&amp;gt;</code>.</p>
</details>

---

## Sesión 5 · Listas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Los tres tipos de lista, qué relación expresa cada uno y cómo se anidan correctamente.</li>
    <li><strong>2. Haz:</strong> Interpreta información en bruto y decide con qué se marca cada parte.</li>
    <li><strong>3. Comprueba:</strong> Resuelve el reto de la lista anidada.</li>
  </ol>
</div>

### Tres listas para tres relaciones

#### Lista no ordenada

```html
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>
```

#### Lista ordenada

```html
<ol>
    <li>Crear el proyecto</li>
    <li>Escribir HTML</li>
    <li>Validar</li>
</ol>
```

Aquí el orden **tiene significado**: no puedes validar antes de escribir.

<div class="rule">
  <p class="rule-label">La prueba que distingue <code>ul</code> de <code>ol</code></p>
  <p>Reordena mentalmente los elementos. <strong>Si la información sigue siendo cierta, es <code>ul</code>. Si deja de serlo, es <code>ol</code>.</strong></p>
  <p>No decide el hecho de que se vean números: los números son apariencia, y con CSS se pueden poner y quitar.</p>
</div>

#### Listas anidadas

```html
<ul>
    <li>
        Hardware

        <ul>
            <li>Portátiles</li>
            <li>Monitores</li>
        </ul>
    </li>

    <li>
        Software
    </li>
</ul>
```

Fíjate bien en la jerarquía: el segundo `<ul>` está **dentro** del primer `<li>`, no detrás de él. Es el error más común de la sesión. Si lo sacas fuera, estás diciendo que «Portátiles» es hermano de «Hardware» en lugar de una parte suya.

#### Listas de descripción

Para pares de término y definición:

```html
<dl>
    <dt>HTML</dt>
    <dd>Lenguaje utilizado para estructurar contenido web.</dd>

    <dt>CSS</dt>
    <dd>Lenguaje utilizado para definir su presentación.</dd>
</dl>
```

`dt` es el término y `dd` su descripción. Un mismo `dt` puede tener varios `dd`, y varios `dt` pueden compartir un `dd`.

| Lista | Se usa cuando | Ejemplo |
| ----- | ------------- | ------- |
| `<ul>` | El orden no cambia el significado | Los componentes que vende la tienda |
| `<ol>` | El orden **es** el significado | Los pasos para tramitar una devolución |
| `<dl>` | Cada elemento es un término y su definición | El glosario de la ficha técnica |

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

Esto no es «escribir etiquetas»: es **interpretar la información**. Tu trabajo:

1. Decide qué es título de bloque y con qué nivel de encabezado, teniendo en cuenta dónde va a vivir dentro de tu página.
2. Decide qué bloque es `ul` y cuál es `ol`, y **escribe en un comentario por qué**, aplicando la prueba de reordenar.
3. Añade debajo una `<dl>` que defina tres conceptos: CPU, RAM y SSD.

<details class="aside aside--help">
  <summary>Estoy atascado · no sé si los componentes van ordenados</summary>
  <p>Aplica literalmente la prueba. Si escribes «Memoria RAM, Almacenamiento SSD, Procesador», ¿sigue siendo verdad que esos son los componentes de un ordenador? Sí. ¿Y si escribes «Reiniciar, Descargar la imagen, Arrancar desde el USB»? Ya no describe una instalación posible.</p>
</details>

### Reto 2 · Los módulos de DAW (10 min)

Representa esta estructura con **el mínimo HTML razonable y semánticamente correcto**:

```text
DAW
 ├ Lenguajes de Marcas
 ├ Programación
 └ Bases de Datos
```

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 2</summary>
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
  <p>La lista anidada va <strong>dentro</strong> del <code>&lt;li&gt;</code> de DAW. Si la sacas fuera, estás diciendo que los tres módulos son hermanos de DAW en lugar de partes suyas.</p>
</details>

### Ahora tú · Crea `productos.html`

Crea la segunda página de tu proyecto. Debe contener:

* Un encabezado principal y al menos dos niveles de encabezado.
* Varios párrafos.
* Una lista no ordenada.
* Una lista ordenada, donde el orden importe de verdad.
* Una lista anidada.
* Al menos dos elementos de significado textual de la sesión anterior.

Todavía no la enlazaremos con la portada: eso es la sesión que viene.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 5</p>
  <ul class="checklist">
    <li>Sabes aplicar la prueba de reordenar para decidir entre <code>ul</code> y <code>ol</code>.</li>
    <li>Sabes dónde va exactamente una lista anidada.</li>
    <li>Conoces <code>dl</code>, <code>dt</code> y <code>dd</code>.</li>
    <li>Tienes <code>productos.html</code> con las tres clases de lista.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Da la prueba de una frase que distingue <code>ul</code> de <code>ol</code>.</li>
    <li>¿Dónde va el <code>&lt;ul&gt;</code> de una lista anidada?</li>
    <li>¿Para qué sirve <code>&lt;dl&gt;</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Si al reordenar los elementos la información sigue siendo cierta, es <code>ul</code>; si deja de serlo, es <code>ol</code>.</p>
  <p>2 · Dentro del <code>&lt;li&gt;</code> del que depende, no detrás de él.</p>
  <p>3 · Para pares de término y descripción: glosarios, fichas técnicas, listas de definiciones.</p>
</details>

---

## Sesión 6 · Enlaces, rutas y navegación

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se construye un enlace, desde dónde se resuelve una ruta y qué convierte unos enlaces en una navegación.</li>
    <li><strong>2. Haz:</strong> Monta las cuatro páginas enlazadas y después resuelve el laberinto de rutas.</li>
    <li><strong>3. Comprueba:</strong> Mueve la carpeta del proyecto y confirma que nada se rompe.</li>
  </ol>
</div>

### El elemento que hace que exista la Web

```html
<a href="https://developer.mozilla.org/">MDN Web Docs</a>
```

`href` indica el destino y el contenido del elemento es el texto visible del enlace. Ese texto importa: «pincha aquí» no dice nada fuera de contexto, y mucha gente navega saltando de enlace en enlace sin leer lo que hay alrededor.

#### Enlaces a otras páginas del sitio

```text
mi-web/
│
├── index.html
├── productos.html
└── contacto.html
```

Desde `index.html`:

```html
<a href="productos.html">Productos</a>
```

#### Enlaces dentro de la misma página

```html
<a href="#contacto">Ir a contacto</a>
```

y en algún punto del documento:

```html
<section id="contacto">
    <h2>Contacto</h2>
</section>
```

<p class="term">id</p>

Identifica un elemento **de forma única** dentro del documento. Dos elementos con el mismo `id` son un error, y uno que los validadores sí detectan.

#### Enlaces especiales

```html
<a href="mailto:contacto@example.com">Enviar correo</a>
```

```html
<a href="tel:+34960000000">960 000 000</a>
```

`tel:` es especialmente útil en móvil, donde convierte el número en algo que se puede pulsar para llamar.

#### Abrir en otra pestaña

```html
<a href="https://example.com"
   target="_blank"
   rel="noopener noreferrer">
    Abrir recurso
</a>
```

`target="_blank"` abre en pestaña nueva y `rel="noopener noreferrer"` corta la referencia que la página abierta obtendría hacia la tuya. Los navegadores actuales ya lo hacen por su cuenta, pero escribirlo sigue siendo lo correcto: no dependes de la versión del navegador y dejas la intención por escrito.

Dicho lo cual: abrir pestañas automáticamente no debería ser tu opción por defecto. Quien navega debería mantener el control de su navegación, y el botón de volver atrás deja de funcionar en una pestaña nueva.

### Rutas relativas

Esta es la idea que desatasca todo lo demás. Cuando escribes `href="productos.html"`, el navegador no busca desde la raíz del proyecto: busca **desde la carpeta del archivo que contiene el enlace**.

Por eso la misma ruta, escrita en dos archivos distintos, apunta a sitios distintos. No hay rutas correctas en abstracto: hay rutas correctas *desde un origen*.

| Escribes | Significa |
| -------- | --------- |
| `pagina.html` | Un archivo en **mi misma** carpeta |
| `./pagina.html` | Lo mismo, escrito de forma explícita |
| `carpeta/pagina.html` | Bajar a una carpeta que está dentro de la mía |
| `../pagina.html` | **Subir** un nivel y buscar allí |
| `../../pagina.html` | Subir dos niveles |
| `#seccion` | Saltar a un elemento con ese `id` en esta misma página |

<div class="rule">
  <p class="rule-label">Por qué <code>C:\Users\...</code> no es un enlace</p>
  <p>Esto puede funcionar en tu ordenador:</p>
  <p><code>&lt;img src="C:\Users\Laura\Desktop\foto.jpg"&gt;</code></p>
  <p>Y deja de funcionar en cuanto mueves el proyecto, lo entregas o lo publicas, que es justo para lo que se hace una web. Lo mismo con <code>file:///</code>. Nuestros proyectos deben ser <strong>transportables</strong>.</p>
</div>

### La navegación

Un menú es, conceptualmente, **una lista de enlaces**:

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

* **`<nav>`** declara que ese bloque es navegación. Un lector de pantalla ofrece saltar a él, o saltárselo entero para ir al contenido, que es lo que hace casi todo el mundo que navega así.
* **La lista** dice que son cuatro enlaces hermanos, y permite anunciar «lista de 4 elementos». Cuatro enlaces sueltos separados por espacios no dicen ni cuántos son ni dónde acaban.
* **`aria-current="page"`** marca cuál es la página que se está viendo. Sin CSS es la única forma de comunicarlo.

No elegimos las etiquetas pensando en cómo queremos que se vea. Elegimos las que representan mejor la información.

### Tarea 4 · El sitio multipágina

Amplía tu proyecto hasta tener cuatro páginas en la raíz:

```text
mi-web/
├── index.html
├── productos.html
├── acerca.html
└── contacto.html
```

Requisitos:

1. Las cuatro tienen el esqueleto completo y su propio `<title>` **distinto y descriptivo**.
2. Las cuatro incluyen el mismo bloque de navegación, con los mismos enlaces en el mismo orden.
3. Cada página marca su propio enlace con `aria-current="page"`.
4. Cada página tiene un único `h1` que coincide con su tema.

Recorre después el ciclo completo: Inicio → Productos → Acerca de → Contacto → Inicio. Si algún enlace falla, no lo arregles todavía: anótalo, porque es exactamente el problema que ataca la tarea siguiente.

<details class="aside aside--help">
  <summary>Estoy atascado · el título de cada página</summary>
  <p>El <code>&lt;title&gt;</code> se lee fuera de contexto: en una pestaña estrecha, en un favorito, en un resultado de búsqueda. «Contacto» no dice de qué web es. Escribe primero lo específico y después el sitio, porque las pestañas se recortan por el final: <code>Contacto | PixelStore</code>.</p>
</details>

### Tarea 5 · El laberinto de rutas

Ahora el caso difícil, con carpetas de por medio:

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

No intentes verlo de golpe. Se resuelve en tres pasos: dónde estoy, dónde voy, cuántos niveles subo antes de empezar a bajar.

<p class="stage stage--solo">Paso 2 · Ahora tú</p>

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
  <p>Mueve la carpeta entera del proyecto al escritorio, o a un pendrive, y navega por todos los enlaces. Si algo deja de funcionar, esa ruta no era relativa. Es la única prueba que importa, porque es lo que le pasará al proyecto cuando lo entregues.</p>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 6 y de la semana 2</p>
  <ul class="checklist">
    <li>Las cuatro páginas existen y se enlazan entre sí sin ningún error 404.</li>
    <li>El menú es idéntico en las cuatro y cada una marca la suya con <code>aria-current</code>.</li>
    <li>Todas las rutas son relativas y el sitio sobrevive a moverse de carpeta.</li>
    <li>Sabes resolver una ruta con el método de los tres pasos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Desde dónde se resuelve una ruta relativa?</li>
    <li>¿Qué aporta <code>&lt;nav&gt;</code> que no aporta un <code>&lt;div&gt;</code> con enlaces?</li>
    <li>¿Por qué una ruta con <code>C:\</code> funciona en tu equipo y no en el del profesor?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Desde la carpeta del archivo que contiene el enlace, no desde la raíz del proyecto.</p>
  <p>2 · Declara que ese bloque es una zona de navegación, y eso permite saltar a él o saltárselo. Un <code>div</code> no significa nada.</p>
  <p>3 · Porque describe una posición dentro de tu disco duro. En cualquier otro equipo esa ruta no existe.</p>
</details>

---

## Semana 3 · Imágenes y semántica estructural

---

## Sesión 7 · Imágenes correctamente utilizadas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Que el <code>alt</code> correcto depende de la función de la imagen y no de lo que se ve en ella, y qué atributos mejoran el rendimiento.</li>
    <li><strong>2. Haz:</strong> Decide el texto alternativo de cinco imágenes con funciones distintas y añade imágenes a tu proyecto.</li>
    <li><strong>3. Comprueba:</strong> Desactiva las imágenes y comprueba si la página sigue entendiéndose.</li>
  </ol>
</div>

### La etiqueta

```html
<img src="img/portatil.webp"
     alt="Portátil gris abierto sobre una mesa de trabajo">
```

`src` indica el archivo y `alt` el texto alternativo. `img` es un elemento vacío: no se cierra.

### El `alt` no describe la imagen: la sustituye

La pregunta habitual, «¿qué pongo en el `alt`?», casi siempre se responde describiendo lo que se ve. Es la respuesta equivocada.

El texto alternativo es lo que ocupa el lugar de la imagen cuando la imagen no está: porque no ha cargado, porque la conexión es mala, o porque quien lee la página no la ve. Así que la pregunta correcta es:

> **Si borro esta imagen, ¿qué tendría que decir aquí para que no se pierda nada?**

De ahí salen tres casos, y solo tres:

| La imagen... | El `alt` es... | Ejemplo |
| ------------ | -------------- | ------- |
| **Informa**: aporta contenido que no está escrito en ningún otro sitio | La información que aporta | `alt="El modelo A consume 45 W, el B 65 W y el C 90 W"` |
| **Actúa**: es el único contenido de un enlace o un botón | La acción o el destino, no el dibujo | `alt="Buscar en la tienda"` |
| **Decora**: no aporta nada que no esté ya en el texto | Vacío, y se escribe igualmente | `alt=""` |

#### Imagen informativa

```html
<img src="img/placa-solar.webp"
     alt="Paneles solares instalados sobre la cubierta del edificio">
```

#### Imagen decorativa

```html
<img src="img/separador.webp" alt="">
```

Un texto alternativo vacío puede ser exactamente la decisión correcta.

<div class="rule">
  <p class="rule-label"><code>alt=""</code> no es lo mismo que no poner <code>alt</code></p>
  <p><code>alt=""</code> significa «esta imagen es decorativa, ignórala». Un lector de pantalla la salta en silencio, que es justo lo que queremos.</p>
  <p>Si directamente no escribes el atributo, el lector no sabe qué hacer y suele leer el nombre del archivo. Quien usa la página escucha «guion bajo img guion 47 punto webp». Por eso <strong>toda</strong> imagen lleva <code>alt</code>: la duda es solo si va vacío o lleno.</p>
</div>

#### Lo que no debemos hacer

```html
alt="foto"
```

No aporta nada. Y esto tampoco:

```html
alt="ordenador portátil barato comprar ordenador portátil
ofertas portátiles ordenador gaming tienda Alicante"
```

El `alt` no es un sitio donde meter palabras clave. Quien depende de él tiene que escuchar eso entero.

### `figure` y `figcaption`

Cuando la imagen lleva un pie visible, los dos se marcan juntos:

```html
<figure>
    <img src="img/prototipo.webp"
         alt="Primer prototipo del robot, con la carcasa abierta">

    <figcaption>
        Primer prototipo desarrollado en 2026.
    </figcaption>
</figure>
```

`figcaption` es el pie que ve todo el mundo; `alt` sustituye a la imagen para quien no la ve. **No deben decir lo mismo**, porque no hacen lo mismo: si los repites, quien use un lector de pantalla escucha la misma frase dos veces.

### Dos atributos de rendimiento

```html
<img src="img/producto.webp"
     alt="Teclado mecánico compacto"
     width="800"
     height="600"
     loading="lazy">
```

`width` y `height` reservan el hueco antes de que la imagen llegue, y evitan que el texto salte cuando termina de cargar. `loading="lazy"` retrasa la descarga de las imágenes que todavía no se ven. Más adelante veremos cómo CSS adapta visualmente estas imágenes.

<details class="aside aside--extra">
  <summary>Extra · una imagen no tiene por qué ser un único archivo</summary>
  <p>HTML permite ofrecer varias versiones del mismo contenido y dejar que el navegador elija:</p>
  <pre><code>&lt;picture&gt;
    &lt;source srcset="img/portada.webp" type="image/webp"&gt;
    &lt;img src="img/portada.jpg" alt="Estudiantes en un laboratorio"&gt;
&lt;/picture&gt;</code></pre>
  <p>El navegador usa el primer <code>source</code> que entiende y, si no entiende ninguno, cae en el <code>img</code>. No hace falta dominarlo ahora. Lo importante es saber que existe y que una imagen web no es necesariamente un solo archivo para cualquier situación.</p>
</details>

<details class="aside aside--extra">
  <summary>Extra · audio, vídeo y contenido incrustado</summary>
  <p>HTML también incorpora multimedia:</p>
  <pre><code>&lt;video controls&gt;
    &lt;source src="media/demo.mp4" type="video/mp4"&gt;
    Tu navegador no puede reproducir este vídeo.
&lt;/video&gt;

&lt;audio controls&gt;
    &lt;source src="media/audio.mp3" type="audio/mpeg"&gt;
&lt;/audio&gt;</code></pre>
  <p>El texto suelto dentro del elemento es lo que se muestra si el navegador no puede reproducirlo.</p>
  <p>Y con <code>&lt;iframe&gt;</code> se puede incrustar un documento externo dentro del tuyo:</p>
  <pre><code>&lt;iframe src="https://example.com"
        title="Contenido externo de ejemplo"
        loading="lazy"&gt;&lt;/iframe&gt;</code></pre>
  <p>Un <code>iframe</code> no debería ser la opción automática para cualquier contenido: estás metiendo una página ajena dentro de la tuya, con implicaciones de seguridad, privacidad, rendimiento y accesibilidad. El <code>title</code> no es opcional, porque es lo único que identifica ese marco.</p>
  <p>Un vídeo de 200 MB en tu web también es una decisión: tamaño, ancho de banda, formato y compatibilidad. Volveremos a este problema al estudiar optimización.</p>
</details>

### Tarea 6 · ¿Qué `alt` pondrías?

<p class="stage">Paso 1 · Te enseño uno</p>

**El logotipo de la empresa en la cabecera, enlazado a `index.html`.**

<dl class="worked">
  <dt>¿Qué función tiene?</dt>
  <dd>Actúa: es el único contenido de un enlace.</dd>
  <dt>Si la borro, ¿qué se pierde?</dt>
  <dd>Un enlace sin ningún texto. Quien no vea la imagen se encuentra un enlace que no dice adónde va.</dd>
  <dt>Entonces, ¿qué escribo?</dt>
  <dd>El destino, no el dibujo. No «logotipo azul de PixelStore», sino adónde lleva.</dd>
  <dt>Solución</dt>
  <dd><code>alt="PixelStore · Inicio"</code></dd>
</dl>

<p class="stage stage--solo">Paso 2 · Ahora tú</p>

Para cada caso, decide si el `alt` debe ser descriptivo, funcional o vacío, escríbelo, y di **por qué**:

1. **Un gráfico de barras** que compara el consumo energético de tres portátiles.
2. **Una fotografía decorativa** que separa dos secciones.
3. **Un icono de lupa** dentro de un enlace, sin ningún texto alrededor.
4. **La foto de un producto** en su ficha: un teclado mecánico con iluminación RGB.
5. **La foto del equipo** en la página «Acerca de», con un pie que ya dice quiénes son.

<details class="aside aside--extra">
  <summary>Ver soluciones recomendadas</summary>
  <p>1 · Informa. <code>alt="El modelo A consume 45 W, el B 65 W y el C 90 W"</code>. Un gráfico se sustituye por sus datos, no por la palabra «gráfico».</p>
  <p>2 · Decora. <code>alt=""</code>.</p>
  <p>3 · Actúa. <code>alt="Buscar en la tienda"</code>: es la única etiqueta accesible que tiene ese enlace.</p>
  <p>4 · Informa. <code>alt="Teclado mecánico compacto con interruptores rojos y retroiluminación RGB"</code>. En una ficha de producto la foto sí aporta contenido.</p>
  <p>5 · Depende del pie. Si el <code>figcaption</code> ya identifica a las personas, el <code>alt</code> describe lo que se ve sin repetirlo: <code>alt="Nueve personas en la oficina"</code>. Si el pie no dice nada, el <code>alt</code> carga con la información.</p>
</details>

### Ahora tú · Imágenes en tu proyecto

Crea la carpeta `img/` y añade al menos tres imágenes a tu sitio: una informativa, una decorativa y una dentro de un `figure` con su pie. Enlázalas con rutas relativas.

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
  <p>1 · <code>alt=""</code> declara que la imagen es decorativa y hace que se ignore. Sin el atributo, el lector de pantalla acaba leyendo el nombre del archivo.</p>
  <p>2 · La acción, no el dibujo: <code>alt="Buscar en la tienda"</code>.</p>
  <p>3 · Porque el pie lo lee todo el mundo y el <code>alt</code> solo sustituye a la imagen. Si coinciden, se oye la misma frase dos veces.</p>
</details>

---

## Sesión 8 · HTML semántico

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué declara cada elemento estructural, cuándo un <code>div</code> sigue siendo correcto y qué separa <code>section</code> de <code>article</code>.</li>
    <li><strong>2. Haz:</strong> Refactoriza un documento hecho solo de <code>div</code> hasta convertirlo en HTML semántico.</li>
    <li><strong>3. Comprueba:</strong> Resuelve los dos retos discutiéndolos con tu compañero.</li>
  </ol>
</div>

### Podríamos construir una web con cientos de `div`

Y funcionaría. Pero un `<div>` no significa nada: es una caja. HTML tiene elementos que explican **qué representa cada parte**, y eso permite que un lector de pantalla ofrezca una lista de zonas y salte directamente a la que interese.

#### `<header>`

```html
<header>
    <h1>PixelStore</h1>
</header>
```

Contenido introductorio, de la página o de una sección.

#### `<nav>`

Un bloque importante de navegación. No hace falta envolver en `nav` cualquier grupo de tres enlaces: se reserva para la navegación principal del sitio o de una sección.

#### `<main>`

```html
<main>
    ...
</main>
```

El contenido principal del documento. **Uno por página**, y no puede estar dentro de `header`, `nav`, `article`, `aside` ni `footer`.

#### `<section>`

Una sección temática:

```html
<section>
    <h2>Productos destacados</h2>
    ...
</section>
```

Buena señal de que tienes una sección de verdad: **tiene sentido darle un encabezado**. Si no sabrías qué título ponerle, probablemente no es una `section`.

#### `<article>`

Contenido que tiene sentido por sí mismo:

```html
<article>
    <h3>Portátil Nova 14</h3>
    <p>Nuevo portátil profesional de 14 pulgadas.</p>
</article>
```

Ejemplos habituales: una noticia, una publicación, un comentario, una ficha de producto, una entrada de blog.

#### `<aside>`

Contenido relacionado pero secundario respecto al principal.

#### `<footer>`

Pie de la página o de una sección. Puede contener autoría, información legal, enlaces relacionados, contacto o copyright.

<figure class="diagram">
  <figcaption>Las zonas que declara un documento bien estructurado</figcaption>
  <ol class="flow">
    <li>header · la cabecera de la página o de una sección</li>
    <li>nav · un bloque de navegación</li>
    <li>main · el contenido principal, una sola vez por página</li>
    <li>section · una parte temática, con su encabezado</li>
    <li>article · contenido que se entiende fuera de esta página</li>
    <li>aside · contenido relacionado pero secundario</li>
    <li>footer · el pie de la página o de una sección</li>
  </ol>
</figure>

<p class="term">Landmark</p>

Cada una de esas zonas. Son los puntos de referencia que permiten recorrer una página sin verla, igual que tú la recorres mirando dónde está el menú y dónde el contenido.

### `section` o `article`

La regla que resuelve casi todos los casos:

> **Si el contenido tuviera sentido publicado por separado, es un `article`. Si solo lo tiene como parte de esta página, es una `section`.**

Una ficha de producto se entiende sola: aparece en un buscador, se comparte por mensaje, tiene su propio título. Es un `article`. El catálogo que agrupa veinte fichas solo tiene sentido dentro de la tienda: es una `section`.

### Y entonces, ¿`div` está mal?

No. `<div>` es un contenedor genérico perfectamente válido. La pregunta es:

> **¿Existe un elemento con un significado más adecuado?**

Si existe, úsalo. Si no existe —solo estás agrupando cosas de cara al CSS, sin que ese grupo represente ninguna zona con significado— `div` es exactamente lo correcto. **El error no es usar `div`: es usarlo en lugar de algo que sí significaba.**

### Un ejemplo completo

```html
<body>

    <header>
        <h1>PixelStore</h1>

        <nav aria-label="Navegación principal">
            <ul>
                <li><a href="index.html">Inicio</a></li>
                <li><a href="productos.html">Productos</a></li>
                <li><a href="contacto.html">Contacto</a></li>
            </ul>
        </nav>
    </header>

    <main>

        <section>
            <h2>Productos destacados</h2>

            <article>
                <h3>Portátil Nova 14</h3>
                <p>Equipo ligero orientado al trabajo y al estudio.</p>
            </article>

            <article>
                <h3>Monitor Vision 27</h3>
                <p>Monitor de 27 pulgadas orientado a productividad.</p>
            </article>
        </section>

    </main>

    <footer>
        <p>© 2026 PixelStore</p>
    </footer>

</body>
```

Aunque todavía no tenga CSS, la estructura del documento ya tiene sentido. Léela en voz alta: se entiende qué es cada cosa sin ver la pantalla.

### Tarea 7 · El infierno de los div

Este código es del tipo que te vas a encontrar heredado:

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
  <dd>Es el nombre del sitio, el título de mayor rango de la portada: un <code>&lt;h1&gt;</code>, no una caja con texto.</dd>
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

<p class="stage stage--solo">Paso 2 · Ahora tú</p>

Reescribe el resto. Al terminar, tu versión debe cumplir:

1. No queda ningún `div` cuyo nombre de clase describa algo que HTML ya sabe decir.
2. Hay un único `<main>`.
3. «Novedades» es un encabezado, y «Portátil Nova 14» un encabezado de nivel inferior.
4. La tarjeta está marcada como `article`, y sabes justificar por qué no es una `section`.
5. El aviso lateral es un `aside` y el pie un `footer`.
6. No has perdido ni una palabra del contenido original.

### Reto 3 · Botón contra falso botón (10 min)

```html
<!-- Opción A -->
<div onclick="guardar()">Guardar</div>

<!-- Opción B -->
<button type="button">Guardar</button>
```

Las dos funcionan al hacer clic. ¿Cuál eliges y por qué?

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 3</summary>
  <p>La B, y no por estilo. Un <code>&lt;button&gt;</code> trae de fábrica cuatro cosas que la A no tiene y habría que reconstruir a mano: se alcanza con <code>Tab</code>, se activa con <code>Enter</code> y con la barra espaciadora, se anuncia como «botón» a un lector de pantalla, y recibe el foco visible.</p>
  <p>La opción A solo funciona para quien use ratón y vea la pantalla. Mismo patrón de toda la unidad: se ve igual, y no hace lo mismo.</p>
</details>

### Reto 4 · ¿`section` o `article`? (10 min)

Discútelo con tu compañero. En una tienda online:

* ¿La ficha individual de un producto es `section` o `article`?
* ¿Y el catálogo que agrupa los veinte productos?
* ¿Y un comentario de un cliente dentro de la ficha?

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 4</summary>
  <p>La ficha es un <code>article</code>: se entiende sola fuera de la página, y de hecho es lo que se comparte o lo que devuelve un buscador.</p>
  <p>El catálogo es una <code>section</code>: agrupa artículos y solo tiene sentido dentro de la tienda. Es decir, una <code>section</code> que contiene veinte <code>article</code>, y no al revés.</p>
  <p>El comentario es un <code>article</code> dentro del <code>article</code> de la ficha. Sí, se pueden anidar: un comentario es contenido independiente y atribuible a alguien.</p>
  <p>Fíjate en que aquí no hay una única respuesta mecánica. HTML semántico admite discusión, y saber defender tu decisión vale más que acertar la etiqueta «oficial».</p>
</details>

### Ahora tú · Refactoriza tu propio sitio

Aplica lo mismo a tus cuatro páginas: `header`, `nav`, `main`, `footer` en todas, y `section` / `article` donde corresponda.

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
  <p>1 · Uno. Es el contenido principal del documento, y no puede haber dos.</p>
  <p>2 · Si tendría sentido publicado por separado es <code>article</code>; si solo lo tiene dentro de esta página, <code>section</code>.</p>
  <p>3 · Se alcanza con <code>Tab</code>, se activa con teclado, se anuncia como botón y recibe el foco. Bastan dos.</p>
</details>

---

## Sesión 9 · Auditoría semántica de una web real

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se lee la estructura real de una página con DevTools, y qué elementos nativos usarías en lugar de programarlos.</li>
    <li><strong>2. Haz:</strong> Audita una web en producción y extrae su mapa semántico.</li>
    <li><strong>3. Comprueba:</strong> Aplica a tus páginas lo que hayas encontrado que merezca la pena.</li>
  </ol>
</div>

### Ver la estructura, no el diseño

Hasta ahora has escrito HTML. Hoy vas a leerlo, que es lo que harás la mayor parte de tu vida profesional: casi siempre trabajarás sobre código que escribió otro.

Abre DevTools con `F12`. Tres pestañas interesan:

| Pestaña | Para qué |
| ------- | -------- |
| **Elements** / *Inspector* | Ver el HTML real que ha construido el navegador, ya reparado |
| **Accessibility** / *Accesibilidad* | Ver el árbol de accesibilidad: zonas y nombres que percibe un lector de pantalla |
| **Console** | Ver los errores que el navegador sí ha decidido contar |

<div class="rule">
  <p class="rule-label">Lo que ves en Elements no es lo que escribió el autor</p>
  <p>El panel muestra el documento <strong>después</strong> de que el navegador lo haya reparado y de que el JavaScript lo haya modificado. Para ver lo que se escribió de verdad, usa <code>Ctrl + U</code>. Comparar los dos es, muchas veces, la auditoría entera.</p>
</div>

<details class="aside aside--extra">
  <summary>Extra · elementos que ya existen y solemos reprogramar</summary>
  <p>Al auditar webs verás componentes hechos con JavaScript que HTML ya resuelve solo:</p>
  <p><strong>Un desplegable</strong>, sin una línea de código:</p>
  <pre><code>&lt;details&gt;
    &lt;summary&gt;¿Cuánto tarda el envío?&lt;/summary&gt;
    &lt;p&gt;Los pedidos se envían en 24–48 horas.&lt;/p&gt;
&lt;/details&gt;</code></pre>
  <p><strong>Una fecha</strong> legible por personas y por máquinas:</p>
  <pre><code>&lt;time datetime="2026-09-15"&gt;15 de septiembre de 2026&lt;/time&gt;</code></pre>
  <p><strong>Progreso</strong> y <strong>medida</strong>, que no significan lo mismo: <code>&lt;progress value="70" max="100"&gt;</code> representa una tarea que avanza; <code>&lt;meter min="0" max="100" value="85"&gt;</code> representa un valor dentro de un rango conocido, como un nivel de batería.</p>
  <p>Y <strong>datos de contacto</strong>: <code>&lt;address&gt;</code>.</p>
  <p>La regla general: antes de construir algo complejo, pregúntate <strong>si HTML ya sabe hacerlo</strong>. Usar la plataforma suele dar soluciones más simples, más accesibles, más compatibles y más fáciles de mantener.</p>
</details>

### Tarea 8 · Audita una web real

Elige una web de noticias o una tienda conocida y respóndela con DevTools delante:

1. ¿Tiene un único `<main>`? ¿Cuántos `<nav>`?
2. ¿Cómo está marcado el menú principal: lista de enlaces o enlaces sueltos?
3. Recorre la jerarquía de encabezados. ¿Hay un solo `h1`? ¿Se salta algún nivel?
4. Elige tres imágenes distintas: ¿tienen `alt`? ¿Es descriptivo, funcional o vacío? ¿Está bien elegido?
5. Busca algo que parezca un botón. ¿Es un `<button>` o un `div` disfrazado? Compruébalo intentando llegar con `Tab`.

| Aspecto | Qué has encontrado | ¿Correcto? | Qué harías tú |
| ------- | ------------------ | ---------- | ------------- |
| `main` y `nav` | | | |
| Menú principal | | | |
| Jerarquía de encabezados | | | |
| Textos alternativos | | | |
| Botones | | | |

<details class="aside aside--help">
  <summary>Estoy atascado · no encuentro los landmarks</summary>
  <p>En vez de bucear por el árbol, usa el buscador del panel Elements (<code>Ctrl + F</code> dentro de DevTools) y busca directamente <code>main</code>, <code>nav</code>, <code>header</code> o <code>footer</code>. Te dirá cuántas coincidencias hay, que es justo el dato de las dos primeras preguntas.</p>
</details>

### Ahora tú · La misma auditoría, sobre lo tuyo

Pásale a tus cuatro páginas exactamente la misma auditoría que acabas de hacerle a una web profesional, y corrige lo que encuentres.

No es casualidad que la auditoría vaya antes que el proyecto final: es más fácil ver un fallo en el código de otro, y ese ojo entrenado es el que después aplicas al tuyo.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 9 y de la semana 3</p>
  <ul class="checklist">
    <li>Sabes abrir el árbol de accesibilidad y leer las zonas de una página.</li>
    <li>Has auditado una web real con hallazgos concretos, no impresiones.</li>
    <li>Tus cuatro páginas usan elementos estructurales, no <code>div</code> genéricos.</li>
    <li>Todas tus imágenes tienen <code>alt</code>, lleno o vacío según su función.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué el panel Elements puede no coincidir con el código fuente?</li>
    <li>¿Cómo compruebas en diez segundos si un botón es un botón de verdad?</li>
    <li>Nombra un elemento HTML que evite escribir JavaScript.</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque muestra el documento ya reparado por el navegador y modificado por el JavaScript. El fuente original se ve con <code>Ctrl + U</code>.</p>
  <p>2 · Intentando llegar hasta él con <code>Tab</code>. Si no recibe el foco, no es un botón.</p>
  <p>3 · <code>&lt;details&gt;</code> con <code>&lt;summary&gt;</code> da un desplegable sin código. Vale también <code>&lt;progress&gt;</code>, <code>&lt;meter&gt;</code> o la validación nativa de formularios que veremos la semana que viene.</p>
</details>

---

## Semana 4 · Tablas para datos tabulares

---

## Sesión 10 · Tablas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué hace cada parte de una tabla y qué problema resuelve exactamente el atributo <code>scope</code>.</li>
    <li><strong>2. Haz:</strong> Convierte una comparativa en texto plano en una tabla accesible.</li>
    <li><strong>3. Comprueba:</strong> El validador no encuentra celdas huérfanas ni errores de anidación.</li>
  </ol>
</div>

### Las tablas sirven para datos tabulares

No sirven para diseñar una página. Durante años se maquetaron webs enteras con tablas porque era la única forma de colocar cosas en columnas; eso terminó hace mucho, pero la costumbre dejó rastro.

### Una tabla básica

```html
<table>
    <tr>
        <th>Producto</th>
        <th>Precio</th>
    </tr>
    <tr>
        <td>Portátil Nova</td>
        <td>899 €</td>
    </tr>
</table>
```

Funciona, pero le falta casi todo. Vamos a ver por qué.

### El problema que resuelve una tabla bien marcada

Cuando tú miras una tabla, lees una celda y **subes con la vista** hasta el encabezado de su columna para saber qué significa ese número. Es tan automático que no lo notas.

Quien no ve la tabla no puede hacer eso. Va celda por celda y, sin más información, escucha: «899». Nada más. Necesita que el documento diga a qué encabezado pertenece cada celda.

### Una estructura completa

```html
<table>

    <caption>Comparativa de productos</caption>

    <thead>
        <tr>
            <th scope="col">Producto</th>
            <th scope="col">Pantalla</th>
            <th scope="col">Precio</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <th scope="row">Nova 14</th>
            <td>14 pulgadas</td>
            <td>899 €</td>
        </tr>
        <tr>
            <th scope="row">Nova 16</th>
            <td>16 pulgadas</td>
            <td>1.099 €</td>
        </tr>
    </tbody>

</table>
```

| Elemento | Qué declara |
| -------- | ----------- |
| `<table>` | Que esto son datos con relación de filas y columnas |
| `<caption>` | El título de la tabla, dentro de la propia tabla |
| `<thead>` | La fila o filas de encabezado |
| `<tbody>` | El cuerpo de datos |
| `<tfoot>` | Un pie de tabla, para totales o resúmenes |
| `<tr>` | Una fila |
| `<th>` | Una celda que **encabeza** otras |
| `<td>` | Una celda de datos |

### `scope`

<p class="term">scope</p>

El atributo que dice en qué dirección manda un encabezado.

```html
<th scope="col">   <!-- encabeza su columna -->
<th scope="row">   <!-- encabeza su fila -->
```

Con `scope`, esa celda deja de escucharse como «899» y pasa a escucharse como «Nova 14, precio, 899 euros».

Fíjate en la primera columna del `tbody` del ejemplo: «Nova 14» y «Nova 16» son `th`, no `td`. No son datos, son los nombres que identifican cada fila. Es el error más frecuente al empezar, y el que deja las tablas mudas.

<div class="rule">
  <p class="rule-label"><code>caption</code> no es un encabezado puesto encima</p>
  <p>Poner un <code>&lt;h3&gt;Comparativa&lt;/h3&gt;</code> justo antes de la tabla no es equivalente. El <code>&lt;caption&gt;</code> va <strong>dentro</strong> de <code>&lt;table&gt;</code> y queda asociado a ella: se anuncia al entrar en la tabla y viaja con ella si se extrae de su contexto. Un encabezado suelto encima es solo un texto que casualmente está cerca.</p>
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

Escribe el HTML con `caption`, `thead`, `tbody`, `th scope="col"` en la cabecera, `th scope="row"` en el nombre de cada modelo y `td` en el resto.

**La comprobación:** lee en voz alta la celda «5 TB» tal y como la escucharía alguien que no ve la tabla. Si tu marcado es correcto, deberías poder decir «Avanzado, transferencia, 5 TB». Si no puedes, falta un `scope`.

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
  <p>2 · Para declarar si un encabezado manda sobre su columna o sobre su fila, y así cada celda pueda anunciarse junto a los encabezados que la describen.</p>
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
    <th scope="row">11:00</th>
    <td colspan="5">Recreo</td>
</tr>
```

Esa fila parece tener dos celdas, pero ocupa seis columnas. Si la tabla tiene seis, es correcta. Si tiene siete, acabas de dejar un hueco, y el navegador dibujará algo raro sin decirte nada.

<div class="rule">
  <p class="rule-label">La comprobación que evita el 90 % de los fallos</p>
  <p>Recorre la tabla fila a fila y suma, en cada una, el <code>colspan</code> de sus celdas (una celda normal cuenta 1). <strong>Todas las filas tienen que dar el mismo total.</strong> Si una da distinto, ahí está el error, y lo has localizado sin abrir el navegador.</p>
  <p>Con <code>rowspan</code>, recuerda que una celda que baja invade la fila siguiente: esa fila tendrá una celda escrita menos, porque una de sus posiciones ya está ocupada desde arriba.</p>
</div>

#### Cuándo empieza a ser mala idea

Una celda combinada aislada se entiende bien. Una tabla con combinaciones en varias direcciones a la vez se vuelve difícil de recorrer para quien la escucha, porque deja de estar claro qué encabezado gobierna cada celda.

Si tu tabla necesita ese nivel de combinación, casi siempre lo correcto es **partirla en dos tablas más simples**, cada una con su `caption`. Profesionalmente, `rowspan` y `colspan` tienen bastante menos recorrido del que parece: conviene conocerlos y no abusar.

### Tarea 10 · El horario de clase

Construye una tabla con el horario semanal de tu grupo: de lunes a viernes, seis periodos lectivos y un recreo intermedio.

1. `<caption>` que identifique de qué grupo es el horario.
2. Los días como `<th scope="col">`.
3. La hora de cada franja como `<th scope="row">`.
4. El recreo en una fila combinada que abarque los cinco días.
5. Aplica la comprobación de sumas antes de darlo por bueno.

<details class="aside aside--help">
  <summary>Estoy atascado · no me cuadran las columnas</summary>
  <p>Cuenta primero cuántas columnas tiene la tabla <strong>en total, incluida la de las horas</strong>. Si son cinco días más la columna de horas, son seis columnas. Entonces la fila del recreo puede ser un <code>th</code> con la hora más un <code>td colspan="5"</code>, o bien una sola celda con <code>colspan="6"</code>. Ese despiste de una columna es prácticamente el único fallo que da esta tarea.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué hace exactamente <code>colspan="3"</code>?</li>
    <li>¿Cómo compruebas una tabla con celdas combinadas sin abrir el navegador?</li>
    <li>¿Qué haces si una tabla necesita combinaciones en las dos direcciones?</li>
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
    <li><strong>2. Haz:</strong> Clasifica cinco casos y añade una tabla real a tu proyecto.</li>
    <li><strong>3. Comprueba:</strong> Tu tabla aporta algo que una lista no diría igual de bien.</li>
  </ol>
</div>

### La pregunta que decide

> **¿Cada dato está en el cruce de dos cosas? ¿Necesito saber su fila **y** su columna para entender qué significa?**

«899 €» no significa nada por sí solo: hace falta saber que es del Nova 14 y que es el precio. Dos coordenadas, dos encabezados. Eso es una tabla.

La descripción de una camiseta, en cambio, no está en el cruce de nada: pertenece a esa camiseta y punto. Que las camisetas se vean colocadas en una rejilla de tres columnas es una decisión visual, no una relación entre datos, y las decisiones visuales se resuelven con CSS.

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
  <p>4 · <code>&lt;table&gt;</code> con <code>caption</code> y <code>scope</code>. Cada valor cruza tarifa y característica.</p>
  <p>5 · Nada de HTML. Es maquetación, y se hace con CSS. Si lo resuelves con una tabla, estás afirmando que la foto y el texto son datos relacionados en una rejilla, que es falso.</p>
</details>

### Ahora tú · La comparativa de tu proyecto

Añade a `productos.html` una tabla comparativa real: al menos tres elementos y cuatro características, con `caption` y `scope` en los dos sentidos.

No construyas una tabla solo para cumplir el requisito. Busca un conjunto de datos donde **una tabla sea realmente la estructura adecuada**. Y si al escribirla descubres que no hay cruce de coordenadas, cámbiala por lo que corresponda y explica el cambio en un comentario: detectar eso también es haber aprendido la sesión.

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

## Sesión 13 · Formularios · recoger información

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué une un <code>label</code> con su campo, en qué se diferencian <code>id</code> y <code>name</code>, y por qué el botón importa.</li>
    <li><strong>2. Haz:</strong> Construye el formulario base de tu página de contacto.</li>
    <li><strong>3. Comprueba:</strong> Al hacer clic en el texto de cada etiqueta, el cursor entra en su campo.</li>
  </ol>
</div>

### El formulario mínimo

```html
<form>
    <label for="nombre">Nombre</label>

    <input id="nombre" name="nombre" type="text">

    <button type="submit">Enviar</button>
</form>
```

Tres piezas: el contenedor `form`, los controles, y el botón que lo envía. Lo que casi siempre se hace mal es la relación entre cada campo y su etiqueta.

### `label`

```html
<label for="nombre">Nombre</label>
<input id="nombre" name="nombre" type="text">
```

Pruébalo: haz clic sobre la palabra **Nombre**. El navegador coloca el foco en el campo.

<p class="term">Etiqueta asociada</p>

Un `<label for="x">` unido a un `<input id="x">`. No es un texto que está al lado del campo: es un texto que **pertenece** al campo.

Qué se gana asociándola:

1. Un lector de pantalla anuncia el campo con su nombre. Sin `label`, anuncia «campo de texto» y nada más.
2. El área de clic crece: pulsar sobre el texto lleva el cursor al campo. Importa mucho en pantallas pequeñas y en casillas de verificación.
3. El navegador puede autocompletar mejor.

### `id` y `name` no son lo mismo

```html
<input id="nombre" name="nombre">
```

Se escriben casi siempre iguales, y por eso se confunden.

| Atributo | Para quién es | Qué hace |
| -------- | ------------- | -------- |
| `id` | Para el documento | Identifica el campo dentro de la página; es a lo que apunta el `for` |
| `name` | Para el servidor | Es el nombre con el que el dato viaja al enviarse |

Un campo sin `name` se rellena perfectamente y **su dato no llega a ninguna parte**. Cuando estudies servidores verás por qué.

### `button`

```html
<button type="submit">Enviar</button>
```

No conviertas un texto o una imagen en un falso botón. Si algo es una acción, empieza por el elemento diseñado para representar una acción. Ya lo viste en el Reto 3: un `<div>` no se alcanza con `Tab`, no se activa con `Enter` y no se anuncia como botón.

<div class="rule">
  <p class="rule-label">El <code>placeholder</code> no es una etiqueta</p>
  <p>El texto gris dentro de un campo <strong>desaparece en cuanto empiezas a escribir</strong>. Quien se distrae a mitad de un formulario largo se queda con un campo lleno y sin ninguna indicación de qué contenía. Y quien usa un lector de pantalla puede no oírlo nunca.</p>
  <p>Sirve para dar un ejemplo de formato <em>junto a</em> una etiqueta —<code>placeholder="nombre@example.com"</code>—, nunca para sustituirla.</p>
</div>

### Tarea 12 · Fase A · El formulario base

En `contacto.html`, escribe un formulario con:

* Nombre completo.
* Correo electrónico.
* Asunto.
* Mensaje, con `<textarea rows="6">`.
* Botón de envío.

Cada campo con su `id` y su `name`, y cada `label` con su `for`.

**La comprobación de un minuto:** haz clic sobre el *texto* de cada etiqueta, no sobre el campo. Si el cursor salta al campo correcto, la asociación está bien. Si no pasa nada, ese `for` no coincide con ningún `id`.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>id</code> y <code>name</code>?</li>
    <li>Da dos razones para asociar la etiqueta con <code>for</code>.</li>
    <li>¿Por qué un <code>placeholder</code> no sustituye a un <code>label</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>id</code> identifica el campo dentro del documento y es a lo que apunta el <code>for</code>; <code>name</code> es el nombre con el que el dato se envía al servidor.</p>
  <p>2 · El lector de pantalla anuncia el campo por su nombre, y pulsar el texto lleva el foco al campo. Vale también el autocompletado.</p>
  <p>3 · Porque desaparece al escribir y deja el campo sin identificar.</p>
</details>

---

## Sesión 14 · Tipos de campo y validación nativa

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué te da gratis elegir bien el <code>type</code> y qué validación trae el navegador de fábrica.</li>
    <li><strong>2. Haz:</strong> Añade tipos correctos, validación y un desplegable a tu formulario.</li>
    <li><strong>3. Comprueba:</strong> Intenta enviarlo vacío y con datos inválidos.</li>
  </ol>
</div>

### El tipo no es cosmético

Todos estos campos aceptan texto. La diferencia está en lo que el navegador hace con ellos sin que tú programes nada.

```html
<input type="email"    id="email"     name="email">
<input type="password" id="password"  name="password">
<input type="number"   id="unidades"  name="unidades" min="1" max="10">
<input type="date"     id="fecha"     name="fecha">
<input type="url"      id="web"       name="web">
<input type="tel"      id="telefono"  name="telefono">
```

| `type` | Qué aporta de fábrica |
| ------ | --------------------- |
| `text` | Nada especial |
| `email` | Comprueba el formato y ofrece un teclado con arroba en el móvil |
| `password` | Oculta lo escrito |
| `number` | Solo acepta números, admite `min` y `max` |
| `date` | Un selector de fecha del sistema, ya traducido |
| `url` | Comprueba que sea una dirección web |
| `tel` | Teclado numérico de teléfono en el móvil |

Ese teclado adaptado no es un detalle menor: es la diferencia entre rellenar un formulario cómodamente en el móvil y abandonarlo.

<div class="rule">
  <p class="rule-label">La pregunta antes de escribir JavaScript</p>
  <p>Antes de programar una validación, pregúntate: <strong>¿HTML ya sabe hacerlo?</strong> Muchas veces sí, y la versión nativa funciona mejor, es más accesible y no hay que mantenerla.</p>
</div>

### Validación nativa

<p class="term">Validación nativa</p>

Las comprobaciones que hace el propio navegador antes de enviar, declaradas con atributos y sin una línea de JavaScript.

```html
<input type="email" required>

<input type="text" minlength="3" maxlength="50">

<input type="number" min="1" max="100">
```

| Atributo | Exige |
| -------- | ----- |
| `required` | Que el campo no se quede vacío |
| `minlength` / `maxlength` | Un número mínimo y máximo de caracteres |
| `min` / `max` | Un valor mínimo y máximo, en números y fechas |
| `pattern` | Que el texto encaje con un patrón concreto |

<div class="rule">
  <p class="rule-label">Validar en el navegador no es validar</p>
  <p>Todo esto se puede desactivar: basta con enviar la petición sin pasar por el formulario. La validación nativa está para <strong>ayudar a quien rellena</strong>, avisándole antes de enviar y sin recargar la página.</p>
  <p>La comprobación que de verdad protege los datos se hace <strong>en el servidor</strong>, y la verás en otro módulo. Las dos son necesarias y no se sustituyen.</p>
</div>

### `textarea` y `select`

```html
<label for="mensaje">Mensaje</label>

<textarea id="mensaje" name="mensaje" rows="6"></textarea>
```

`textarea` no es un `input`: tiene apertura y cierre, y su contenido inicial va entre las dos etiquetas. Cuidado con dejar espacios ahí dentro, porque se convierten en texto escrito.

```html
<label for="motivo">Motivo de contacto</label>

<select id="motivo" name="motivo">
    <option value="">Selecciona una opción</option>
    <option value="informacion">Información</option>
    <option value="soporte">Soporte</option>
    <option value="presupuesto">Presupuesto</option>
</select>
```

La primera `option` con `value=""` sirve para que el desplegable no aparezca ya respondido; combinada con `required`, obliga a elegir de verdad.

### Tarea 12 · Fase B · Tipos y validación

Amplía tu formulario:

1. El correo usa `type="email"` y es **obligatorio**.
2. El asunto exige entre 5 y 50 caracteres.
3. Añade una fecha con `type="date"`.
4. Añade un campo numérico con `min` y `max` que tenga sentido en tu tema.
5. Añade un `<select>` con al menos tres opciones y una opción vacía inicial.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación · tres intentos de envío</p>
  <p>Envía el formulario vacío, después con un correo sin arroba, y después con un asunto de tres caracteres. En los tres casos el navegador debe impedir el envío y decirte cuál es el problema, sin recargar la página y sin que tú hayas escrito JavaScript.</p>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Nombra dos cosas que da <code>type="email"</code> y no da <code>type="text"</code>.</li>
    <li>¿Para qué sirve una <code>&lt;option value=""&gt;</code> al principio de un <code>select</code>?</li>
    <li>¿Por qué la validación nativa no sustituye a la del servidor?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Comprueba el formato del correo y ofrece un teclado adaptado en el móvil.</p>
  <p>2 · Para que el desplegable no venga ya respondido y, con <code>required</code>, obligar a elegir conscientemente.</p>
  <p>3 · Porque se ejecuta en el navegador y se puede saltar enviando la petición directamente. Ayuda a quien rellena; no protege los datos.</p>
</details>

---

## Sesión 15 · Grupos de controles y auditoría de formularios

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se agrupan opciones excluyentes y múltiples, y cuáles son los fallos que se repiten en todos los formularios mal hechos.</li>
    <li><strong>2. Haz:</strong> Termina tu formulario y audita uno defectuoso.</li>
    <li><strong>3. Comprueba:</strong> Recorre tu formulario usando solo la tecla <code>Tab</code>.</li>
  </ol>
</div>

### Botones de opción · cuando solo se puede elegir una

```html
<fieldset>

    <legend>Modalidad de envío</legend>

    <label>
        <input type="radio" name="envio" value="estandar">
        Estándar
    </label>

    <label>
        <input type="radio" name="envio" value="urgente">
        Urgente
    </label>

</fieldset>
```

Lo que hace que dos botones de opción se excluyan **no es el `fieldset`**: es compartir exactamente el mismo `name`. Si puedes marcar los dos a la vez, tienen `name` distinto.

Fíjate también en otra forma de asociar la etiqueta: aquí el `input` está **dentro** del `label`, y entonces no hace falta `for`. Las dos formas son válidas.

### Casillas · cuando se pueden elegir varias

```html
<fieldset>
    <legend>¿Qué tecnologías conoces?</legend>

    <label><input type="checkbox" name="tec" value="html"> HTML</label>
    <label><input type="checkbox" name="tec" value="css"> CSS</label>
    <label><input type="checkbox" name="tec" value="js"> JavaScript</label>
</fieldset>
```

Y una casilla suelta, obligatoria:

```html
<label>
    <input type="checkbox" name="condiciones" required>
    Acepto las condiciones
</label>
```

### `fieldset` y `legend`

Agrupan controles que forman una misma pregunta y le ponen nombre al grupo. En un formulario de tres campos sobran; en uno de quince son lo que lo hace navegable, porque cada campo se anuncia precedido del nombre de su grupo.

Y en los botones de opción no son opcionales en la práctica: el `legend` es lo único que dice **de qué** se está eligiendo. No todo tiene que ser un `div`.

### Autocompletado

```html
<input type="text"  name="nombre" autocomplete="name">
<input type="email" name="email"  autocomplete="email">
```

Los navegadores usan esta información para rellenar por ti. Cuesta un atributo y ahorra bastante escritura a quien usa tu web.

### Tarea 12 · Fase C · El formulario completo

Termina tu formulario con:

6. Dos botones de opción que compartan `name`, dentro de un `fieldset` con su `legend`.
7. Un grupo de casillas para selección múltiple.
8. Una casilla obligatoria de aceptación de condiciones.
9. Dos `fieldset` que separen los datos personales de los de la consulta.

<details class="aside aside--help">
  <summary>Estoy atascado · los radio no funcionan como espero</summary>
  <p>Si puedes marcar los dos a la vez, es que tienen <code>name</code> distinto. Lo que agrupa unos botones de opción no es el <code>fieldset</code>: es <strong>compartir exactamente el mismo <code>name</code></strong>. Lo que sí debe ser distinto en cada uno es el <code>value</code>, que es el dato que se envía, y el <code>id</code> si los asocias con <code>for</code>.</p>
</details>

### Los seis fallos de siempre

Antes de mirar código, una prueba que dura treinta segundos y sirve para cualquier web: **suelta el ratón**. Recorre el formulario con `Tab`, cambia de opción con las flechas, envía con `Enter`. Si no sabes dónde está el foco, o hay algo que no puedes alcanzar, ese formulario está roto para todo el que no use un ratón.

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
  <dd>Se lee igual para quien ve la pantalla. Para un lector de pantalla no existe ninguna relación entre ese texto y ese campo: anunciará «campo de texto» y habrá que adivinar cuál es.</dd>
  <dt>Corrección</dt>
  <dd><code>&lt;label for="nombre"&gt;Nombre&lt;/label&gt;</code> y <code>&lt;input type="text" id="nombre" name="nombre"&gt;</code>.</dd>
</dl>

<p class="stage stage--solo">Paso 2 · Ahora tú</p>

1. Enumera los **seis** fallos, en el mismo formato: qué está mal, a quién perjudica y cuál es la corrección.
2. Reescribe el formulario entero corrigiéndolos todos.
3. Pásale la prueba del teclado a tu versión.

<details class="aside aside--extra">
  <summary>Ver los seis fallos</summary>
  <p>1 · Ningún campo tiene <code>&lt;label&gt;</code> asociado: los textos están sueltos delante.</p>
  <p>2 · Ningún campo tiene <code>name</code>, así que ningún dato llegaría al servidor.</p>
  <p>3 · El correo usa <code>type="text"</code> en lugar de <code>type="email"</code>.</p>
  <p>4 · La edad usa <code>type="text"</code> en lugar de <code>type="number"</code> con <code>min</code> y <code>max</code>.</p>
  <p>5 · El botón es un <code>&lt;div onclick&gt;</code>: no se alcanza con <code>Tab</code> ni se activa con teclado. Debe ser <code>&lt;button type="submit"&gt;</code>.</p>
  <p>6 · Los campos se separan con <code>&lt;br&gt;</code>, que no aporta estructura. Cada campo con su etiqueta debería ir en su propio bloque.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 15 y de la semana 5</p>
  <ul class="checklist">
    <li>Tu formulario se recorre entero con <code>Tab</code>, en un orden que tiene sentido.</li>
    <li>Todos los campos tienen <code>label</code> asociado, <code>id</code> y <code>name</code>.</li>
    <li>Cada campo usa el <code>type</code> que le corresponde.</li>
    <li>Los botones de opción comparten <code>name</code> y están dentro de un <code>fieldset</code> con <code>legend</code>.</li>
    <li>El botón de envío es un <code>&lt;button&gt;</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué hace que dos botones de opción sean excluyentes?</li>
    <li>Un campo rellenado no llega al servidor. ¿Qué atributo falta?</li>
    <li>¿En qué consiste la prueba del teclado y qué detecta?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Compartir el mismo atributo <code>name</code>.</p>
  <p>2 · El atributo <code>name</code>.</p>
  <p>3 · Recorrer el formulario sin ratón, solo con <code>Tab</code>, flechas y <code>Enter</code>. Detecta elementos inalcanzables, foco invisible y falsos botones.</p>
</details>

---

## Semana 6 · Depuración, validación y coevaluación

---

## Sesión 16 · Accesibilidad desde HTML

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Que casi toda la accesibilidad de una web sale de usar bien HTML, y por qué ARIA no es el punto de partida.</li>
    <li><strong>2. Haz:</strong> Recorre tu sitio entero sin ratón y anota dónde se rompe.</li>
    <li><strong>3. Comprueba:</strong> Puedes alcanzar todas las partes interactivas y sabes siempre dónde está el foco.</li>
  </ol>
</div>

### Una web no se hace solo para nosotros

Una web no debería funcionar únicamente para:

> una persona que ve perfectamente, usa ratón, tiene una pantalla grande y navega exactamente como nosotros.

La buena noticia es que **HTML bien utilizado proporciona buena parte de la accesibilidad automáticamente**. No es una capa que se añade al final: es lo que llevas haciendo quince sesiones.

#### 1 · Usa el elemento correcto

```html
<button>Comprar</button>
```

es mejor punto de partida que:

```html
<div>Comprar</div>
```

si representa una acción.

#### 2 · Mantén una jerarquía lógica

```text
h1
    h2
        h3
    h2
```

Sin saltos. Es el índice por el que se navega.

#### 3 · Describe las imágenes

`alt` informativo, funcional o vacío, según su función. Nunca ausente.

#### 4 · Etiqueta los formularios

`label` asociado, no solo `placeholder`.

#### 5 · Usa HTML semántico

`nav`, `main`, `header`, `footer`, `section`, `article` informan de la estructura del documento y permiten recorrerlo por zonas.

#### 6 · No uses ARIA por defecto

Encontrarás código como este:

```html
<div role="button" tabindex="0">Guardar</div>
```

<p class="term">ARIA</p>

Un conjunto de atributos para describir el papel, el estado y las propiedades de un elemento cuando HTML no llega. Puede ser necesaria en componentes complejos.

Pero no debería usarse para recrear a mano algo que HTML ya proporciona. Ese `div` con `role="button"` necesita además que le programes la activación con `Enter` y con espacio, el foco, y el estado. Un `<button>` trae todo eso.

El orden es siempre:

<figure class="diagram">
  <figcaption>El orden correcto</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>HTML nativo</li>
    <li>Si de verdad no llega, ARIA</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">La primera regla de ARIA</p>
  <p>Está escrita en la propia especificación y viene a decir esto: <strong>si existe un elemento HTML con la semántica que necesitas, úsalo en lugar de reconstruirlo con ARIA</strong>. Una ARIA mal puesta deja la página peor que no poner ninguna.</p>
</div>

### Ahora tú · La prueba del teclado, sobre tu sitio

Suelta el ratón. Recorre tus cuatro páginas usando solo:

```text
Tab          avanzar
Shift + Tab  retroceder
Enter        activar
Espacio      marcar casillas y pulsar botones
```

Y responde:

| Pregunta | Página donde falla |
| -------- | ------------------ |
| ¿Puedes alcanzar todas las partes interactivas? | |
| ¿Sabes en todo momento dónde está el foco? | |
| ¿El orden de recorrido tiene sentido? | |
| ¿Puedes enviar el formulario sin tocar el ratón? | |
| ¿Puedes saltar el menú para ir al contenido? | |

Corrige lo que encuentres. Casi todo se arregla cambiando un elemento por el que tocaba.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Nombra tres cosas de accesibilidad que salen gratis de usar bien HTML.</li>
    <li>¿Por qué <code>&lt;div role="button"&gt;</code> es peor que <code>&lt;button&gt;</code>?</li>
    <li>¿Cuándo tiene sentido usar ARIA?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Por ejemplo: navegación por encabezados, salto entre zonas con los landmarks, botones alcanzables con teclado, campos anunciados por su etiqueta, imágenes sustituidas por su <code>alt</code>. Bastan tres.</p>
  <p>2 · Porque hay que reconstruir a mano el foco, la activación con teclado y el estado, y cualquiera de esas piezas se puede olvidar. El <code>button</code> las trae todas.</p>
  <p>3 · Cuando construyes un componente para el que HTML no tiene un elemento equivalente. Nunca para sustituir uno que sí existe.</p>
</details>

---

## Sesión 17 · Validar y depurar HTML

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Los niveles de comprobación de un documento, qué ve cada uno y qué no ve ninguno.</li>
    <li><strong>2. Haz:</strong> Localiza y repara los veinte fallos deliberados de un documento.</li>
    <li><strong>3. Comprueba:</strong> El validador del W3C devuelve cero errores.</li>
  </ol>
</div>

### Volvemos a la frase de la sesión 2

> Que una página se vea bien no demuestra que su HTML esté bien.

Los navegadores se recuperan de casi cualquier error para no fallar delante del usuario. Eso es cómodo y, a la vez, es lo que oculta el código incorrecto. Necesitamos herramientas que no perdonen.

<figure class="diagram">
  <figcaption>Cada comprobación ve cosas que la anterior no</figcaption>
  <ol class="flow">
    <li>El navegador · solo delata lo que no consigue disimular</li>
    <li>HTMLHint · avisa mientras escribes, dentro del editor</li>
    <li>El validador del W3C · dictamina si el documento cumple la especificación</li>
    <li>Tu criterio · lo único que juzga si el marcado <em>significa</em> lo correcto</li>
  </ol>
</figure>

### HTMLHint

Mira el panel `Problems`. No ignores automáticamente los mensajes: para cada uno, tres preguntas.

1. ¿Qué elemento provoca el problema?
2. ¿Qué regla estoy incumpliendo?
3. ¿Cómo debería solucionarse?

### Formatear el documento

VS Code puede formatear HTML con `Shift + Alt + F`, o desde la paleta con `Format Document`. Compara:

```html
<main><section><h2>Productos</h2><p>Texto</p></section></main>
```

con:

```html
<main>
    <section>
        <h2>Productos</h2>

        <p>
            Texto
        </p>
    </section>
</main>
```

Las dos son idénticas para el navegador. La segunda es la única legible para una persona, y **el código también se escribe para personas**: para tu compañero de revisión, para el profesor y para ti dentro de tres semanas.

### El validador del W3C

El flujo de trabajo correcto es este:

<figure class="diagram">
  <figcaption>Cómo se depura un documento</figcaption>
  <ol class="flow">
    <li>Escribir</li>
    <li>Previsualizar</li>
    <li>Revisar el panel Problems</li>
    <li>Validar en el W3C</li>
    <li>Entender los errores</li>
    <li>Corregir</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">El flujo que no queremos</p>
  <p>Validar, copiar el error en una IA, pegar cualquier respuesta, repetir hasta que se ponga verde. Se termina antes y no se aprende nada, porque el paso que importa —<strong>entender</strong>— es justo el que se ha saltado.</p>
  <p>La herramienta debe ayudarte a comprender el documento, no a esquivarlo.</p>
</div>

### Válido no significa correcto

| Un validador detecta | Un validador no detecta |
| -------------------- | ----------------------- |
| Etiquetas sin cerrar o mal anidadas | Que hayas usado `div` donde tocaba `nav` |
| Atributos que no existen | Que un `alt` diga «foto» en lugar de describir algo |
| `id` duplicados | Que hayas saltado de `h1` a `h4` |
| Anidaciones prohibidas | Que un catálogo esté marcado como tabla |

Un documento entero hecho de `<div>`, sin un solo encabezado y con todas las imágenes con `alt="foto"`, pasa el validador con cero errores. Es válido y es malo. **La validez es el suelo, no el techo.**

### Tarea 14 · HTML forense

Este documento contiene **veinte fallos deliberados**. Cópialo en `forense.html`:

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

1. Ábrelo en el navegador y anota qué se ve mal **antes** de mirar el código. Fíjate en si algún texto aparece con caracteres extraños.
2. Pásale HTMLHint y anota qué encuentra.
3. Pásalo por `validator.w3.org` y anota qué encuentra que HTMLHint no encontró.
4. Localiza al menos **quince** de los veinte fallos y repáralos.
5. Entrega una tabla justificativa:

| Fallo detectado | Línea | Quién lo detectó | A quién perjudica | Corrección aplicada |
| --------------- | ----- | ---------------- | ----------------- | ------------------- |
| | | | | |

La columna «quién lo detectó» es la importante: al terminar tendrás la prueba, escrita por ti, de que las herramientas encuentran menos de la mitad.

<details class="aside aside--help">
  <summary>Estoy atascado · llevo ocho y no encuentro más</summary>
  <p>Recorre el documento con una lista en la mano, en este orden, en lugar de buscar «a ver qué veo»:</p>
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
  <p>1 · Falta <code>&lt;!doctype html&gt;</code>. · 2 · Falta <code>lang="es"</code>. · 3 · Falta <code>&lt;meta charset="UTF-8"&gt;</code>: por eso «Programación» se ve mal. · 4 · Falta <code>&lt;meta name="viewport"&gt;</code>. · 5 · <code>&lt;title&gt;</code> sin cerrar.</p>
  <p><strong>Enlaces e imágenes</strong></p>
  <p>6 · <code>src</code> de la primera imagen con ruta de disco local. · 7 · <code>href</code> del enlace de inicio con ruta de disco local. · 8 · <code>target="_blank"</code> sin <code>rel="noopener noreferrer"</code>. · 9 · La primera imagen no tiene <code>alt</code>. · 10 · La segunda tampoco, y además es un gráfico: su <code>alt</code> debe llevar los datos.</p>
  <p><strong>Texto y estructura</strong></p>
  <p>11 · Salto de jerarquía: de <code>h1</code> a <code>h4</code>. · 12 · <code>id="destacado"</code> duplicado. · 13 · Anidación cruzada: <code>&lt;b&gt;&lt;i&gt;…&lt;/b&gt;&lt;/i&gt;</code>. · 14 · Último <code>&lt;p&gt;</code> sin cerrar. · 15 · Cabecera y menú son <code>div</code>: deberían ser <code>&lt;header&gt;</code> y <code>&lt;nav&gt;</code> con una lista. · 16 · No hay <code>&lt;main&gt;</code> ni <code>&lt;footer&gt;</code>.</p>
  <p><strong>Tabla y formulario</strong></p>
  <p>17 · La tabla no tiene <code>&lt;caption&gt;</code>, ni <code>&lt;thead&gt;</code>/<code>&lt;tbody&gt;</code>, ni <code>&lt;th scope&gt;</code>. · 18 · El campo de correo no tiene <code>&lt;label&gt;</code>. · 19 · No tiene <code>name</code> y usa <code>type="text"</code> en vez de <code>type="email"</code>. · 20 · El botón de envío es un <code>&lt;div onclick&gt;</code>.</p>
  <p>El validador del W3C detecta la sintaxis: el <code>doctype</code> que falta, la codificación no declarada, el <code>&lt;title&gt;</code> abierto, las imágenes sin <code>alt</code>, el <code>id</code> duplicado y la anidación cruzada. No dice nada de la jerarquía de encabezados, ni de la tabla muda, ni del falso botón, ni de la sopa de <code>div</code>. Poco más de la mitad la tienes que ver tú.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Nombra dos fallos graves que un validador no detecta.</li>
    <li>¿Por qué «válido» no es lo mismo que «correcto»?</li>
    <li>¿Qué pasos tiene el flujo de depuración, y cuál es el que no se puede saltar?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Por ejemplo, usar <code>div</code> donde tocaba un elemento semántico, o un <code>alt</code> que no describe nada.</p>
  <p>2 · Porque la validez comprueba la sintaxis, no el significado.</p>
  <p>3 · Escribir, previsualizar, revisar Problems, validar, entender y corregir. El que no se puede saltar es <strong>entender</strong>.</p>
</details>

---

## Sesión 18 · Auditoría final, revisión por pares y entrega

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se revisa el código de otra persona de forma útil.</li>
    <li><strong>2. Haz:</strong> Cierra tu proyecto con la lista de comprobación y audita el de un compañero.</li>
    <li><strong>3. Entrega:</strong> Entrega el proyecto, la matriz de coevaluación y defiende tus decisiones.</li>
  </ol>
</div>

### Tarea 15 · La lista de comprobación final

Tu proyecto debe tener una organización parecida a esta:

```text
mi-web/
│
├── index.html
├── productos.html
├── acerca.html
├── contacto.html
│
└── img/
    └── ...
```

Recorre la lista entera. Cada línea que no puedas marcar es trabajo pendiente de hoy.

<div class="checkpoint">
  <p class="checkpoint-label">Documento</p>
  <ul class="checklist">
    <li>Usa <code>&lt;!doctype html&gt;</code>.</li>
    <li>Define correctamente <code>lang</code>.</li>
    <li>Incluye <code>charset</code> y viewport.</li>
    <li>Cada página tiene un <code>title</code> propio y descriptivo.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Contenido</p>
  <ul class="checklist">
    <li>Existe una jerarquía coherente de encabezados, sin saltos y con un solo <code>h1</code> por página.</li>
    <li>Los párrafos son párrafos, y no hay <code>&lt;br&gt;</code> usados para maquetar.</li>
    <li>Las listas se representan con listas reales, y las anidadas están bien anidadas.</li>
    <li>Hay elementos de significado textual usados con criterio.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Navegación e imágenes</p>
  <ul class="checklist">
    <li>Todos los enlaces funcionan y las rutas son relativas.</li>
    <li>El menú es idéntico en las cuatro páginas y marca la actual.</li>
    <li>Todas las imágenes tienen <code>alt</code> adecuado, lleno o vacío según su función.</li>
    <li>Se usa <code>figure</code> con <code>figcaption</code> donde tiene sentido.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Semántica, tablas y formularios</p>
  <ul class="checklist">
    <li>Se usan <code>header</code>, <code>nav</code>, <code>main</code> y <code>footer</code>, con un solo <code>main</code>.</li>
    <li><code>section</code> y <code>article</code> están justificados, y no hay <code>div</code> innecesarios.</li>
    <li>La tabla solo se usa para datos tabulares, con <code>caption</code> y <code>scope</code>.</li>
    <li>Todos los campos tienen etiqueta, tipo apropiado y <code>name</code>.</li>
    <li>Hay validación nativa, y <code>fieldset</code> con <code>legend</code> donde hay grupos.</li>
    <li>Los botones son elementos <code>button</code>.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Calidad</p>
  <ul class="checklist">
    <li>HTMLHint no muestra errores relevantes.</li>
    <li>Las cuatro páginas superan el validador del W3C.</li>
    <li>El código está correctamente indentado.</li>
    <li>La estructura de carpetas se entiende sin explicación.</li>
  </ul>
</div>

<div class="rule">
  <p class="rule-label">Condición de entrega · cero CSS</p>
  <p>Ni ficheros <code>.css</code>, ni <code>&lt;style&gt;</code>, ni atributos <code>style</code>. Tu web tendrá un aspecto muy básico, y es intencionado: queremos comprobar si <strong>la información sigue estando bien estructurada cuando quitamos toda la presentación</strong>.</p>
  <p>En la siguiente unidad partiremos de este mismo proyecto para ver cómo CSS transforma su apariencia sin cambiar lo que significa cada elemento.</p>
</div>

### Revisar código ajeno

Una revisión útil no dice «está mal». Dice tres cosas: **qué**, **por qué** y **qué harías tú**.

| En vez de escribir | Escribe |
| ------------------ | ------- |
| «La tabla está mal» | «Faltan los `scope` en los `th`: sin ellos cada celda se anuncia sin su encabezado. Añadiría `scope="col"` arriba y `scope="row"` en la primera columna» |
| «Los alt no valen» | «El `alt` del gráfico dice “gráfico”: quien no lo vea pierde los datos. Pondría los tres valores que compara» |

Y una regla que vale para toda tu vida profesional: **se revisa el código, no a la persona**. «Este enlace apunta a tu disco» y «no sabes hacer enlaces» describen el mismo hecho, y solo uno sirve para algo.

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

Después, el autor recibe la matriz, decide **qué acepta y qué no**, y anota su decisión. Rechazar una observación justificándola bien también forma parte del ejercicio: la revisión propone, no manda.

### Producto final

Se entrega:

* **A · El sitio.** Cuatro páginas enlazadas, sin CSS, validadas en el W3C.
* **B · La tabla forense** de la sesión 17, con las correcciones justificadas.
* **C · La matriz de coevaluación** del proyecto de tu compañero.
* **D · Tus decisiones**, en media página: las tres decisiones de estructura de las que estás más seguro, y por qué.

Tu proyecto debe incluir, cuando tenga sentido en tu tema: estructura completa y metadatos, navegación entre páginas, jerarquía de encabezados, párrafos y elementos de énfasis, los tres tipos de lista, enlaces internos y externos, imágenes con `figure`, estructura semántica, una tabla de datos, un formulario completo con varios tipos de campo y validación, y algún elemento moderno como `details` o `time`.

### Presentación

Dispones de unos **3 minutos** y respondes a cuatro preguntas:

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

El paso tres separa a quien ha entendido la unidad de quien ha memorizado etiquetas. `div` no es el error: usarlo **en lugar de** algo que sí significaba, sí.

### La idea más importante

Si dentro de un año has olvidado los atributos, que quede esta:

> **Que una página se vea bien no demuestra nada. El navegador repara el HTML roto en silencio, y lo que repara no es lo que escribiste.**

De ahí sale todo lo demás: por eso se valida, por eso se prueba con el teclado, por eso se apagan las imágenes, y por eso el `alt` correcto no depende de lo que se ve sino de para qué está la imagen.

<p class="term">HTML describe qué es cada cosa, no cómo se ve</p>

Esa frase es la que hace posible la siguiente unidad. Si tu estructura dice lo que las cosas son, el CSS podrá cambiar por completo su apariencia sin tocar una línea de tu HTML.

### Un buen desarrollador no es quien memoriza todas las etiquetas

En desarrollo web tendrás siempre a mano documentación, autocompletado, buscadores, validadores, herramientas de análisis e IA. El objetivo no es memorizar MDN.

El objetivo es construir un modelo mental que te permita decidir:

* ¿Qué elemento representa mejor esta información?
* ¿Mi documento tiene una estructura lógica?
* ¿Puede entenderlo una herramienta además de una persona?
* ¿He usado HTML para estructurar, o estoy intentando usarlo para presentar?
* ¿Cómo compruebo que mi código es correcto?

No hace falta que lo recuerdes todo. Sí que sepas qué estás haciendo y dónde buscar lo que no recuerdas.

### Al terminar deberías poder responder

1. ¿Qué función tiene HTML dentro de una aplicación web?
2. ¿Qué diferencia existe entre elemento, etiqueta y atributo?
3. ¿Qué contienen respectivamente `head` y `body`?
4. ¿Para qué sirven `charset`, `viewport`, `lang` y `title`?
5. ¿Cómo se organiza correctamente una jerarquía de encabezados?
6. ¿Qué diferencia existe entre una ruta relativa y una absoluta?
7. ¿Qué información debería contener un `alt`, y cuándo debe estar vacío?
8. ¿Cuándo utilizarías `section`, `article` o `div`?
9. ¿Por qué no debemos utilizar tablas para maquetar?
10. ¿Qué relación existe entre `label` e `input`, y qué papel tiene `name`?
11. ¿Por qué existen diferentes tipos de `input`?
12. ¿Qué función tienen `fieldset` y `legend`?
13. ¿Qué ventajas aporta usar elementos HTML nativos frente a recrearlos?
14. ¿Por qué una página puede verse correctamente y contener HTML incorrecto?
15. ¿Para qué sirven HTMLHint y el validador del W3C, y qué no detecta ninguno de los dos?
16. ¿Qué es Emmet y qué problema resuelve?

Si además puedes construir y modificar un sitio multipágina sin depender de una plantilla, tienes la base para continuar.

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Elemento | La unidad completa: etiqueta de apertura, contenido y cierre |
| Etiqueta | La marca que delimita un elemento |
| Atributo | Un dato añadido a una etiqueta, con nombre y valor |
| Elemento vacío | El que no envuelve contenido y no se cierra: `img`, `meta`, `br` |
| Anidación | Contener unos elementos dentro de otros, cerrando en orden inverso |
| Entidad | Código como `&lt;` para escribir un carácter reservado |
| Linter | Programa que avisa de errores mientras escribes, sin ejecutar el código |
| Validador | Servicio que dictamina si un documento cumple la especificación |
| Emmet | Sistema de abreviaturas que expande estructuras HTML al escribirlas |
| `doctype` | La declaración de que el documento es HTML estándar |
| `charset` | Cómo se traducen los bytes del archivo a caracteres |
| `viewport` | La instrucción de adaptarse al ancho real del dispositivo |
| Jerarquía de encabezados | El índice del documento, de `h1` a `h6`, sin saltos |
| `id` | Identificador único de un elemento dentro del documento |
| Ruta relativa | Camino al destino desde el archivo que escribe el enlace |
| Landmark | Zona con significado propio: `header`, `nav`, `main`, `aside`, `footer` |
| `section` | Parte temática que solo tiene sentido dentro de esta página |
| `article` | Contenido que se entendería publicado por separado |
| Texto alternativo | Lo que ocupa el lugar de una imagen cuando la imagen no está |
| `scope` | Declara si un encabezado de tabla manda sobre su fila o su columna |
| Etiqueta asociada | `label` unido a su campo mediante `for` e `id` |
| `name` | El nombre con el que un dato de formulario viaja al servidor |
| Validación nativa | Comprobaciones que hace el navegador sin JavaScript |
| ARIA | Atributos que describen papel y estado cuando HTML no llega |
| Accesibilidad | Que el contenido siga siendo usable sin ver la pantalla y sin ratón |

### La siguiente unidad

Durante seis semanas hemos respondido principalmente a una pregunta:

> **¿Qué es cada cosa?**

En la siguiente empezamos a responder la otra:

> **¿Cómo queremos que se vea?**

<figure class="diagram">
  <figcaption>Las dos mitades del oficio</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>HTML · estructura y significado</li>
    <li>CSS · presentación y diseño</li>
  </ol>
</figure>

Partiremos exactamente del sitio que has construido aquí, y trabajaremos selectores, cascada, especificidad, box model, tipografía, unidades, colores, Flexbox, Grid, diseño adaptable, media queries, variables, estados y transiciones.

Y aquí se cobra el trabajo de estas seis semanas: sobre una estructura semántica, dar estilo es cuestión de escribir selectores. Sobre una sopa de `div`, es cuestión de adivinar cuál era cuál.

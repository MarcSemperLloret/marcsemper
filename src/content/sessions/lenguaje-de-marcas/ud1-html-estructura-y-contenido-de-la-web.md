---
title: "HTML: estructura y contenido de la Web"
label: "UD1 · Guía y taller práctico"
section: "ud-01"
order: 1
lang: "es"
summary: "HTML no describe cómo se ve una página, sino qué representa cada parte de su contenido. Durante seis sesiones de tres horas recorremos el lenguaje completo —texto, listas, enlaces, imágenes, semántica, tablas y formularios— construyendo un sitio multipágina real sin una sola línea de CSS."
duration: "6 sesiones de 3 horas · 18 horas"
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

Al usar una web percibimos textos, imágenes, menús, formularios, botones o tablas. El navegador, sin embargo, necesita una información más determinante que su apariencia:

> **¿Qué representa cada elemento?**

Un título no es un texto grande. Un menú no es un puñado de palabras seguidas. Una imagen no es un archivo colocado en pantalla.

HTML es el lenguaje con el que **describimos la estructura y el significado del contenido**. En esta unidad aprenderás a escribir documentos modernos, organizados, semánticos y accesibles.

Todavía no vamos a preocuparnos de que sean bonitos. Eso llega con CSS, en la unidad siguiente. Primero hay que construir bien la estructura.

Aprender HTML no consiste en memorizar cien etiquetas, dado que la lista está publicada y se consulta. Consiste en **decidir qué significa cada trozo de información**. Por eso la unidad no avanza recitando etiquetas, sino planteando decisiones: ¿esto es una lista o un párrafo?, ¿esta imagen informa o decora?, ¿esto es una tabla o solo lo parece?

### Cómo es cada sesión

Cada sesión dura **tres horas** y combina una explicación breve con trabajo práctico y comprobaciones. HTML se aprende escribiéndolo, corrigiéndolo y discutiéndolo, no escuchando la lista de etiquetas.

<figure class="diagram">
  <figcaption>El ritmo de cada sesión de tres horas</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Recuerda el punto de partida</li>
    <li>Se explica</li>
    <li>Se trabaja</li>
    <li>Cierre</li>
  </ol>
</figure>

Los tiempos de los pasos son orientativos. Avanza cuando puedas comprobar y explicar el resultado. La ayuda se retira poco a poco: primero copias, después completas, después reparas y al final decides sin pistas. Cada paso deja algo comprobable antes de pasar al siguiente.

Al final de cada sesión hay una **ampliación** con dos retos para quien termine antes. No son más de lo mismo: trabajan sobre material ajeno y piden justificar decisiones por escrito, de modo que no se resuelven tecleando deprisa.

Una sesión por semana, seis semanas, dieciocho horas. Aproximadamente dos tercios de la práctica ocurren sobre tu propio proyecto y un tercio sobre código ajeno, para demostrar que la decisión se puede transferir a un contexto nuevo.

Cuando aparece un concepto nuevo, la progresión habitual es esta:

<figure class="diagram">
  <figcaption>De observar a resolver sin ayuda</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Ejemplo resuelto</li>
    <li>Ejemplo incompleto</li>
    <li>Problema parecido</li>
    <li>Problema nuevo</li>
  </ol>
</figure>

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
  <ol>
    <li><strong>Antes de preguntar:</strong> escribe qué crees que ocurre y qué has comprobado.</li>
    <li><strong>Pregunta:</strong> pide una explicación o pistas, no que rehaga la actividad. Ejemplo: «Creo que esta jerarquía falla porque salto de <code>h1</code> a <code>h3</code>. Explícame qué debería revisar sin darme el documento completo».</li>
    <li><strong>Después:</strong> cierra la respuesta y realiza una modificación diferente sin volver a preguntar.</li>
  </ol>
  <p>Si una IA escribe <code>&lt;article&gt;</code> y tú no sabes justificar por qué no es un <code>&lt;section&gt;</code>, todavía no has aprendido HTML. La prueba será siempre hacer un cambio pequeño y explicarlo.</p>
</div>

---

## Plan de trabajo por sesiones

| Sesión | Contenido de las tres horas | Práctica central y entregable | Horas |
| :---: | :--- | :--- | :---: |
| **Sesión 1** | El editor y el documento HTML | Entorno, reparación de HTML roto y primera página propia | 3 h |
| **Sesión 2** | Texto, listas, enlaces y navegación | Interpretación de información, sitio multipágina y laberinto de rutas | 3 h |
| **Sesión 3** | Imágenes y semántica estructural | Criterio de `alt`, refactorización de *div soup* y auditoría con DevTools | 3 h |
| **Sesión 4** | Tablas e integración | Tablas accesibles, celdas combinadas y marcado completo de una página desconocida | 3 h |
| **Sesión 5** | Formularios accesibles | Formulario comercial progresivo y auditoría de uno defectuoso | 3 h |
| **Sesión 6** | Depuración, validación y coevaluación | HTML forense, cierre del proyecto y revisión por pares | 3 h |
| **Total** | | **Sitio multipágina validado y revisado** | **18 h** |

Durante las dieciocho horas alternarás explicaciones, ejercicios guiados, trabajo en tu sitio y revisión de código. Si completas una sesión antes, puedes continuar con el siguiente bloque una vez comprobado el resultado.

---

## Sesión 1 · El editor y el documento HTML

<p class="lead">Empezarás identificando qué es un documento HTML y construirás tu primera página. El recorrido orientativo reserva 5 minutos al punto de partida, 25 a la explicación, 140 al trabajo y 10 a comprobar lo aprendido.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué hace un editor de código, qué es un linter, en qué se diferencian elemento, etiqueta y atributo, y por qué el navegador no sirve para comprobar si tu HTML está bien.</li>
    <li><strong>2. Haz:</strong> Monta el entorno, reconstruye un documento, escribe el esqueleto a mano, repara uno roto, prueba cambios y construye la portada de tu proyecto.</li>
    <li><strong>3. Comprueba:</strong> El panel de problemas queda en cero, los acentos se ven bien y la portada se lee en un móvil sin ampliar.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Escribe qué crees que hacen HTML, CSS y el navegador. No importa si todavía dudas.</li>
    <li>¿Qué diferencia imaginas entre abrir un archivo suelto y abrir una carpeta de proyecto?</li>
    <li>Observa <code>&lt;h1&gt;Hola&lt;/h1&gt;</code>: señala qué partes crees que son instrucciones y cuál es el contenido.</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Hoy no se memoriza ninguna lista de etiquetas. Se trata de entender cuatro cosas que vas a usar durante seis semanas: qué te da un editor de código, qué es un elemento, por qué el navegador no te sirve como corrector y qué declara cada pieza del esqueleto de un documento.

#### Un editor no es un Bloc de notas con colores

Durante el módulo usaremos **Visual Studio Code**. Nos ayuda a organizar proyectos, detectar errores, navegar entre archivos, completar y formatear código, buscar información y ejecutar herramientas.

Su desconocimiento previo no supone ningún obstáculo: aprender a manejar herramientas nuevas forma parte del trabajo.

VS Code ya trae de serie todo lo que necesitamos para HTML: resaltado de sintaxis, sugerencias, cierre automático de etiquetas, documentación al pasar el ratón, formateo y Emmet. El resultado lo comprobaremos en el navegador. **No hace falta instalar diez extensiones para empezar.**

Un sitio web está formado por un conjunto de archivos que se referencian entre sí, y no por un archivo aislado. Si abres archivos sueltos, el editor no sabe dónde está la raíz del sitio.

| Si abres... | El editor puede... |
| ----------- | ------------------ |
| Un archivo suelto | Colorear la sintaxis de ese archivo |
| La carpeta del proyecto | Resolver rutas, autocompletar enlaces, buscar en todo el sitio y analizarlo entero |

#### Un programa que revisa mientras escribes

<p class="term">Linter</p>

Un programa que analiza el código **mientras lo escribes** y avisa de errores y malas prácticas, sin llegar a ejecutarlo.

La única extensión obligatoria del módulo es **HTMLHint**. Avisará de cosas como estas, y sus avisos aparecen en el panel de problemas, en `View → Problems`:

```html
<h1>Mi web
```

```html
<img src="">
```

<div class="rule">
  <p class="rule-label">Qué significa «arreglar un aviso»</p>
  <p>El objetivo no es que la herramienta deje de quejarse pulsando cosas al azar hasta que el panel se ponga verde. El objetivo es <strong>entender por qué existe el problema y corregirlo</strong>. Un aviso que no entiendes es un aviso que volverá.</p>
</div>

También existe **Prettier**, que aplica automáticamente un formato consistente. Puedes instalarlo, pero durante las primeras sesiones no vamos a depender de él: primero tienes que aprender a escribir código legible tú. Automatizar lo que no sabes hacer a mano solo esconde el problema.

#### Elemento, etiqueta y atributo no son lo mismo

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

Los elementos **contienen otros elementos**, y eso crea una estructura jerárquica, un árbol, que es lo que después leerán el CSS, el buscador y el lector de pantalla.

```html
<p>
    Estoy estudiando <strong>DAW</strong>.
</p>
```

Los elementos **tienen atributos**, que aportan información adicional sobre ellos:

```text
<html lang="es">

elemento    html
atributo    lang
valor       es
```

Algunos elementos están **vacíos**: no envuelven nada, aportan algo por sí mismos, se escriben con una sola etiqueta y no se cierran. Escribir `</img>` no es otro estilo, es un error.

```html
<meta charset="UTF-8">
<img src="teclado.webp" alt="Teclado mecánico compacto">
<br>
<hr>
```

```html
<!-- Correcto -->
<p>Un <strong>teclado <em>mecánico</em></strong> compacto.</p>

<!-- Incorrecto -->
<p>Un <strong>teclado <em>mecánico</strong></em> compacto.</p>
```

<div class="rule">
  <p class="rule-label">La regla de la anidación</p>
  <p>Los elementos se cierran como los paréntesis: <strong>el último que se abre es el primero que se cierra</strong>. En el segundo ejemplo, <code>strong</code> se cierra antes que <code>em</code>, que se abrió después. El navegador lo mostrará parecido, porque adivinará, pero el árbol que construya ya no es el que escribiste.</p>
</div>

#### El navegador no es un corrector

Este documento tiene cierres importantes pendientes y le faltan las declaraciones que vamos a aprender. Observa especialmente `<title>`: si no lo cierras, el navegador puede interpretar como texto del título lo que pretendías mostrar en la página.

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

Ábrelo: **el contenido no aparece en la página**, porque falta `</title>`. Añade ese cierre justo después de «PixelStore», guarda y recarga. Ahora aparece contenido, aunque todavía quedan problemas. El navegador aplica reglas para procesar HTML incompleto; algunos errores producen cambios visibles y otros pasan inadvertidos.

> **Que una página se vea bien no demuestra que su HTML esté bien. Hay que revisar también su estructura.**

Recuerda esta frase, porque es el hilo de toda la unidad y volveremos a ella en la sesión 6.

#### Las cinco piezas del esqueleto

Usaremos estas cinco piezas en el esqueleto de nuestras páginas. Las escribirás a mano en el paso 3 y comprobarás algunos cambios en el paso 5. La ausencia de una declaración no siempre produce un síntoma visible: depende también del navegador y de cómo se abra el archivo.

| Pieza | Qué declara | Qué pasa si falta |
| ----- | ----------- | ----------------- |
| `<!doctype html>` | Que el documento es HTML estándar | Modo compatibilidad, con reglas antiguas |
| `lang="es"` | El idioma del contenido | Las herramientas de lectura pueden no elegir la pronunciación adecuada |
| `charset="UTF-8"` | Cómo se traducen los bytes a caracteres | Si se interpreta con una codificación incorrecta, pueden aparecer caracteres extraños |
| `viewport` | Cómo utiliza el navegador móvil el ancho del dispositivo | En móvil puede utilizar un área de escritorio y reducir la página |
| `<title>` | El nombre del documento | Falta un nombre descriptivo para identificar la página |

<div class="rule">
  <p class="rule-label">La prueba para no confundir <code>head</code> y <code>body</code></p>
  <p>Si es algo que una persona debería <strong>leer</strong>, va en el <code>body</code>. Si es algo que el navegador necesita <strong>saber</strong> antes de dibujar nada, va en el <code>head</code>.</p>
</div>

### Se trabaja

<p class="stage stage--guided">140 minutos · práctica sobre tu propio proyecto</p>

Los siete pasos retiran la ayuda poco a poco: primero copias, después completas, después reparas y al final decides tú. Comprueba cada paso antes de pasar al siguiente, porque casi todos dejan algo escrito que se reutiliza más adelante.

#### Paso 1 · Montar el entorno · 15 min

1. Crea una carpeta para tu proyecto. Por ejemplo `mi-web`.
2. En VS Code, `Archivo → Abrir carpeta`, y selecciona **la carpeta**, no un archivo.
3. En el explorador lateral, crea `index.html`. Ese nombre no es casual: es el que los servidores sirven por defecto como página principal.
4. Instala HTMLHint desde `Ctrl + Shift + X`.
5. Localiza estas zonas, porque las vas a usar seis semanas: Explorer, Search, Extensions, el editor, la barra de estado y el panel Problems.
6. Abre la paleta de comandos con `Ctrl + Shift + P` y pruébala escribiendo `Format Document`. Permite ejecutar prácticamente cualquier acción de VS Code por su nombre, en lugar de recordar en qué menú está.

**Antes de continuar:** la carpeta está abierta como proyecto, `index.html` existe y HTMLHint aparece entre las extensiones instaladas.

#### Paso 2 · Del ejemplo resuelto al documento propio · 25 min

Todavía no tienes que inventar una solución desde cero. Avanza de una versión resuelta a otra con menos ayuda.

##### 2.1 · Observa uno resuelto

```html
<h1>Aula web</h1>
<h2>Primer curso</h2>
<p>Hoy abrimos nuestro <strong>primer proyecto</strong>.</p>
```

El primer encabezado nombra la página, el segundo introduce un nivel inferior, el párrafo agrupa una idea y `strong` señala importancia. Copia el fragmento, cambia cada texto y comprueba qué permanece igual.

##### 2.2 · Completa cuatro huecos

```html
<__>Mi portfolio</__>
<h2>Sobre mí</h2>
<__>Estoy aprendiendo <strong>HTML</strong>.</__>
```

##### 2.3 · Repara uno parecido

```html
<h1>Proyecto de clase<h1>
<h2>Objetivo</h3>
<p>Construir una web completa.</p>
```

Explica cada reparación antes de hacerla.

##### 2.4 · Ahora sí, reconstruye

Esto es lo que debe verse en el navegador. Ahora no recibes el código, solo el resultado:

```text
Marc Semper
Desarrollo de Aplicaciones Web
Primer curso

Bienvenido a mi primera página web. Estoy aprendiendo a estructurar
documentos utilizando HTML5 estándar.
```

Escribe el HTML mínimo que represente esa información: un encabezado principal, un encabezado secundario, un párrafo, y énfasis donde tenga sentido.

La palabra importante es **mínimo**. Si has escrito una etiqueta que no aporta significado, sobra.

#### Paso 3 · El esqueleto completo, escrito a mano · 20 min

Todavía no vamos a usar atajos. Escribe esto letra a letra, en `index.html`:

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

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>Lo que dibuja el navegador</strong></figcaption>
  <div class="lesson-demo__stage">
    <div class="lesson-browser" aria-label="Vista de la primera página en un navegador">
      <div class="lesson-browser__page">
        <p class="demo-title">Mi primera página web</p>
        <p>Esta página está construida utilizando HTML.</p>
      </div>
    </div>
  </div>
  <p class="lesson-demo__note">El <code>title</code> aparecería en la pestaña; dentro de la página vemos lo que contiene <code>body</code>.</p>
</figure>

Guarda con `Ctrl + S`. Localiza `index.html` en el explorador de archivos y ábrelo con tu navegador. Después de cada cambio, guarda de nuevo y recarga la pestaña. Durante el desarrollo tendrás normalmente estas dos cosas a la vista:

<figure class="diagram">
  <figcaption>El ciclo de trabajo</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Escribes en VS Code</li>
    <li>Guardas</li>
    <li>Miras el resultado en el navegador</li>
  </ol>
</figure>

<details class="aside aside--extra">
<summary>Consultar · qué declara cada pieza, una por una</summary>

**`<!doctype html>`** indica al navegador que el documento es HTML moderno. Sin él, el navegador entra en *modo compatibilidad* y aplica reglas de hace veinte años.

**`<html lang="es">`** es el elemento raíz: todo lo demás va dentro. El atributo `lang` declara el idioma principal, y lo usan los lectores de pantalla para elegir la voz y la pronunciación, los navegadores para ofrecer traducción, y los buscadores para clasificar la página. Si no lo declaras, la herramienta puede recurrir a otra información o a su configuración y elegir una pronunciación inadecuada; no cambia necesariamente al inglés.

**`<head>`** contiene información *sobre* el documento. Nada de lo que hay aquí se ve en la ventana.

`<meta charset="UTF-8">` define la codificación: cómo se traducen los bytes del archivo a caracteres. Gracias a UTF-8 se escriben correctamente `á é í ó ú`, `ñ`, `€` y `¿ ?`. Si el archivo se interpreta con una codificación distinta de la que se utilizó al guardarlo, pueden aparecer caracteres extraños. Omitir esta declaración no produce siempre ese fallo: el navegador puede obtener la codificación por otra vía.

`<meta name="viewport" content="width=device-width, initial-scale=1.0">` indica al navegador que use el ancho real del dispositivo. Sin él, un navegador móvil puede utilizar un área de escritorio y reducirla para mostrarla en la pantalla. Se entiende del todo al estudiar CSS responsive; por ahora forma parte de la estructura fija.

`<title>` no aparece dentro de la página: aparece en la pestaña, en los favoritos y como titular en un buscador. Compara `<title>Inicio</title>` con `<title>PixelStore | Componentes para desarrolladores</title>` e imagina cuál identifica la web en una lista de veinte pestañas abiertas.

**`<body>`** contiene el contenido que verá el usuario.

</details>

**Antes de continuar:** el documento se abre en el navegador, el título aparece en la pestaña y el panel de problemas está en cero.

#### Paso 4 · Reparar un documento roto · 25 min

Copia en un archivo `roto.html` el fragmento defectuoso de la explicación.

##### 4.1 · Ejemplo resuelto

<dl class="worked">
  <dt>¿Qué está mal?</dt>
  <dd>La etiqueta <code>&lt;title&gt;</code> se abre y nunca se cierra antes de <code>&lt;/head&gt;</code>.</dd>
  <dt>¿Qué hace el navegador con eso?</dt>
  <dd>Sigue leyendo el resto del archivo como texto del título. <code>&lt;/head&gt;</code> no sustituye a <code>&lt;/title&gt;</code>: en este ejemplo el cuerpo queda sin el contenido esperado.</dd>
  <dt>¿A quién perjudica?</dt>
  <dd>A quien visita la página: el contenido no está en el cuerpo del documento y no puede utilizarse como estaba previsto. También se altera la estructura que reciben las herramientas de accesibilidad.</dd>
  <dt>Corrección</dt>
  <dd><code>&lt;title&gt;PixelStore&lt;/title&gt;</code></dd>
</dl>

No basta con decir «falta una etiqueta»: interesa qué consecuencia tiene, porque es lo que te permitirá priorizar cuando encuentres veinte fallos a la vez.

##### 4.2 · Ahora tú

1. Abre el panel de problemas con `Ctrl + Shift + M` y anota qué detecta HTMLHint **y qué no**.
2. Cierra primero `title` y comprueba el cambio. Después añade `doctype`, `lang`, codificación y viewport, y escribe explícitamente los cierres del esqueleto y del contenido.
3. Al final del archivo, escribe un comentario HTML explicando **tres correcciones** del original: qué cambiaste, para qué sirve y si observaste un efecto en el navegador.

<details class="aside aside--help">
  <summary>Estoy atascado · cómo explicar una corrección</summary>
  <p>Por ejemplo: «He añadido el cierre de title. Antes el cuerpo no mostraba el contenido; después aparecen los encabezados y el párrafo». Para lang puedes indicar que declara el idioma aunque no cambie la apariencia. Distingue lo que has observado de lo que sabes que aporta cada declaración.</p>
</details>

#### Paso 5 · Cambia la página y observa el resultado · 25 min

Sobre una **copia** de la página del paso 3, realiza estos seis cambios **de uno en uno**. Guarda, recarga y observa antes de deshacer cada cambio. No todos son errores: queremos distinguir un cambio válido, un problema de estructura y una declaración ausente.

1. Elimina `</h1>`.
2. Elimina `</body>`.
3. Escribe una etiqueta que no existe, como `<titulo>`.
4. Duplica un párrafo completo: `<p>Texto de prueba.</p>`.
5. Cambia `UTF-8` por `ISO-8859-1`.
6. Elimina `lang`.

Registra cada uno en esta tabla:

| Cambio realizado | Qué observas en el navegador | Qué dice HTMLHint |
| ----------- | --------------------- | ----------------- |
| | | |

Al terminar, restaura el documento inicial. Duplicar un párrafo es válido, aunque quizá repita contenido innecesario. En este documento, omitir `</body>` también está permitido por HTML; seguiremos escribiéndolo para reconocer mejor el esqueleto. En cambio, el encabezado necesita su cierre y `<titulo>` no es una etiqueta estándar. La codificación y el idioma requieren comprobar su función, aunque no siempre cambien lo que ves. HTMLHint solo detecta lo que contemplan sus reglas: cero avisos no demuestra que todo sea correcto.

#### Paso 6 · Emmet, ahora que ya sabes escribirlo · 10 min

Has escrito el esqueleto a mano, así que ya puedes abreviarlo. VS Code incluye **Emmet**: escribe `!` y pulsa `Tab` para generar la estructura completa de un documento. O escribe `p*3`, que genera tres párrafos:

```html
<p></p>
<p></p>
<p></p>
```

Prueba ambas abreviaturas en un archivo de pruebas y compara el resultado con lo que escribiste a mano en el paso 3.

<div class="rule">
  <p class="rule-label">La regla de Emmet</p>
  <p><strong>No uses una abreviatura cuyo resultado no seas capaz de escribir y explicar a mano.</strong> Emmet es una herramienta de productividad: te ahorra tecleo, no conocimiento.</p>
</div>

#### Paso 7 · La portada de tu proyecto · 20 min

Construye `index.html` en la raíz de tu carpeta, ahora como portada real del sitio que entregarás dentro de seis semanas y no como un ejercicio desechable:

* El esqueleto completo y los cuatro metadatos correctos.
* Un `<title>` descriptivo, con el tema de tu proyecto.
* Un **único** `<h1>` con el nombre del proyecto.
* Al menos tres `<h2>` que dividan la portada en áreas temáticas.
* Párrafos descriptivos reales, con una descripción del proyecto.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación de la portada · dos pruebas de un minuto</p>
  <p>Comprueba en el código que declaras UTF-8 y el viewport del ejemplo. Escribe «Programación, año, 10 €», guarda y verifica que se lee correctamente. Después abre DevTools con <code>F12</code>, activa su vista de dispositivo móvil y recarga. Si el texto aparece demasiado pequeño, revisa primero el viewport; esa observación es una pista, no una prueba definitiva de su ausencia.</p>
</div>

#### Ampliación si has completado el trabajo

Primero termina y comprueba los siete pasos. Estos dos retos no sustituyen la entrega ni añaden etiquetas nuevas: se resuelven con lo que ya sabes, y lo que exigen es decidir y justificar. No tienen una única solución correcta, así que no se acaban tecleando deprisa.

##### Reto 1 · Marcar un texto que no has escrito

Un cliente entrega este texto sin ninguna marca, tal como lo escribiría en un correo. Conviértelo en un documento HTML completo usando **solo** encabezados, párrafos, `strong` y `em`.

```text
TALLER BICICLETA URBANA

Reparamos bicicletas de ciudad desde 2011 en el barrio de Russafa. Somos
tres mecánicos y atendemos sin cita previa.

Qué hacemos

Ponemos a punto frenos, cambios y transmisión. Montamos ruedas a medida.
Reparamos pinchazos en el momento, normalmente en menos de veinte minutos.
También revisamos bicicletas eléctricas, aunque no reparamos motores ni
baterías: para eso derivamos al servicio técnico de cada marca.

Horario

De lunes a viernes, de 9:30 a 14:00 y de 16:30 a 20:00. Los sábados solo
por la mañana. Cerramos en agosto.

Antes de venir

Si la bicicleta no frena, no la traigas rodando. Es el motivo más
frecuente de accidente entre nuestros clientes.
```

El texto plano no dice qué es cada cosa, y ahí está el trabajo. Escribe debajo del documento, en un comentario HTML, la respuesta a estas cuatro decisiones:

1. **Cuántos niveles de encabezado necesita** y por qué no más ni menos. El nombre del taller y los tres rótulos intermedios, ¿están al mismo nivel?
2. **Dónde termina un párrafo y empieza otro.** El bloque de «Qué hacemos» describe cuatro servicios seguidos: ¿es un párrafo o son varios? Justifica el criterio que aplicas, no el resultado.
3. **Qué merece `strong` y qué no merece ninguna marca.** El aviso sobre los frenos y el cierre de agosto compiten por esa marca; «en menos de veinte minutos» probablemente no. Si todo se marca como importante, nada lo es.
4. **Qué información del texto no puedes representar todavía** con lo que sabes. Nómbrala y di qué elemento crees que le corresponderá.

Compara después tu documento con el de otra persona. Donde las dos marcas coincidan, el texto era claro; donde difieran, hay una decisión que cada parte debe poder defender.

##### Reto 2 · El esqueleto de tres webs reales

Abre tres sitios web que uses de verdad. En cada uno, muestra el código fuente con `Ctrl + U` y localiza las cinco piezas de la tabla de la explicación.

| Sitio | `doctype` | `lang` | `charset` | `viewport` | `title` |
| ----- | :-------: | :----: | :-------: | :--------: | :-----: |
| | | | | | |
| | | | | | |
| | | | | | |

Para el `title`, además de anotar si existe, copia su contenido y valora si identifica la página en una lista de veinte pestañas.

Responde al terminar:

1. ¿Alguno declara un `lang` que no corresponde a su idioma real? Es un fallo frecuente y no produce ningún síntoma visible.
2. ¿Alguno carece de alguna de las cinco piezas? Anota cuál y qué consecuencia tendría, según la tabla.
3. Las tres páginas se ven correctamente en tu navegador. Relaciona ese hecho con la frase de la explicación.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Entorno montado, esqueleto escrito a mano, documento roto reparado y portada con cero errores en el panel de problemas.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de los seis cambios completa, distinguiendo cambios válidos y problemas de estructura o metadatos.</span></div>
  <div><strong>Reto</strong><span>Los dos retos de ampliación resueltos: el texto del taller marcado con sus cuatro decisiones justificadas, y la tabla de las tres webs reales.</span></div>
</div>

### Cierre

<p class="stage">10 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Tienes la carpeta del proyecto abierta en VS Code, no archivos sueltos.</li>
    <li>HTMLHint está instalado y ves su salida en el panel Problems.</li>
    <li>Sabes abrir la paleta de comandos.</li>
    <li>Tu <code>index.html</code> tiene el esqueleto completo con los cuatro metadatos.</li>
    <li>La tabla de los seis cambios está completa y distingue observaciones y explicaciones.</li>
    <li>La portada tiene un solo <code>h1</code>, tres <code>h2</code> y párrafos reales.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué se abre la carpeta entera en el editor y no el archivo?</li>
    <li>¿Qué diferencia hay entre un elemento y una etiqueta?</li>
    <li>Escribe de memoria dos elementos que no se cierren.</li>
    <li>¿Por qué <code>&lt;strong&gt;a&lt;em&gt;b&lt;/strong&gt;&lt;/em&gt;</code> está mal si se ve bien?</li>
    <li>¿Qué puede ocurrir si el archivo se interpreta con una codificación incorrecta?</li>
    <li>¿Por qué duplicar un párrafo no equivale a escribir HTML incorrecto?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para que el editor conozca la raíz del proyecto: así resuelve y autocompleta las rutas relativas, busca en todos los archivos y aplica el linter a todo el sitio.</p>
  <p>2 · El elemento es la unidad completa: apertura, contenido y cierre. La etiqueta es la marca que lo delimita.</p>
  <p>3 · Por ejemplo <code>&lt;meta&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;br&gt;</code> o <code>&lt;hr&gt;</code>.</p>
  <p>4 · Porque rompe el orden de anidación: <code>em</code> se abrió el último y debería cerrarse el primero. El navegador reconstruye un árbol distinto del escrito, y ese árbol es el que verán el CSS, el buscador y el lector de pantalla.</p>
  <p>5 · Pueden aparecer caracteres extraños. Que los acentos se vean bien no demuestra por sí solo que hayas incluido la declaración de codificación.</p>
  <p>6 · Dos párrafos completos pueden ser HTML válido, aunque su contenido esté repetido. La corrección de la sintaxis y la calidad del contenido son comprobaciones diferentes.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Comprobación individual 1 · últimos 5 minutos del cierre</p>
  <p>Individual, sin IA y sin apuntes. Sirve para identificar qué necesitas repasar.</p>
  <ol>
    <li>Escribe de memoria el esqueleto mínimo de un documento HTML.</li>
    <li>Explica la diferencia entre elemento, etiqueta y atributo con un ejemplo.</li>
    <li>Repara: <code>&lt;p lang="es"&gt;Hola &lt;strong&gt;mundo&lt;/p&gt;&lt;/strong&gt;</code>.</li>
  </ol>
</div>


---

## Sesión 2 · Texto, listas, enlaces y navegación

<p class="lead">Partes de la portada de la sesión anterior y la conviertes en un sitio de cuatro páginas enlazadas. El recorrido orientativo reserva 5 minutos al punto de partida, 25 a la explicación, 140 al trabajo y 10 a comprobar lo aprendido.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Que los encabezados son el índice del documento, qué relación expresa cada tipo de lista, y desde dónde se resuelve una ruta relativa.</li>
    <li><strong>2. Haz:</strong> Interpreta información sin marcar, crea la segunda página, monta el sitio de cuatro páginas con su navegación y resuelve el laberinto de rutas.</li>
    <li><strong>3. Comprueba:</strong> Ningún encabezado se salta un nivel, y el proyecto entero sigue funcionando al abrir una copia en otra ubicación.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué contenido pertenece a <code>head</code> y cuál a <code>body</code>?</li>
    <li>¿Para qué sirven <code>lang</code> y <code>meta charset</code>?</li>
    <li>Predice qué problema puede causar una página sin <code>meta name="viewport"</code> en un móvil.</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Hoy aparecen tres familias de elementos —texto, listas y enlaces— y en las tres la decisión es la misma: qué relación hay entre estas piezas de información. Los catálogos de sintaxis quedan como material de consulta dentro de cada paso; aquí van las decisiones.

#### HTML no sirve para decir «quiero esto grande»

Sirve para decir:

> «Esto es el título principal del documento.»

Es la diferencia entre describir la apariencia y describir el significado, y explica casi todos los errores de esta unidad.

#### Los encabezados son el índice del documento

Hay seis niveles, de `h1` a `h6`, y los niveles indican **jerarquía**, no tamaño:

```html
<h1>PixelStore</h1>

<h2>Productos</h2>

<h3>Ordenadores portátiles</h3>
```

Juntos construyen un índice:

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

#### Párrafos, no saltos de línea

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

#### Énfasis y significado

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

#### Tres listas para tres relaciones

Una lista no es «texto con viñetas». Cada tipo declara una relación distinta entre sus elementos.

```html
<ul>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>
```

```html
<ol>
    <li>Crear el proyecto</li>
    <li>Escribir HTML</li>
    <li>Validar</li>
</ol>
```

En la segunda, el orden **tiene significado**: no puedes validar antes de escribir.

```html
<dl>
    <dt>HTML</dt>
    <dd>Lenguaje utilizado para estructurar contenido web.</dd>

    <dt>CSS</dt>
    <dd>Lenguaje utilizado para definir su presentación.</dd>
</dl>
```

`dt` es el término y `dd` su descripción. Un mismo `dt` puede tener varios `dd`, y varios `dt` pueden compartir un `dd`.

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>Tres estructuras, tres representaciones</strong></figcaption>
  <div class="lesson-demo__stage lesson-lists">
    <div class="lesson-list-card">
      <strong>&lt;ul&gt; · sin orden</strong>
      <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
      </ul>
    </div>
    <div class="lesson-list-card">
      <strong>&lt;ol&gt; · secuencia</strong>
      <ol>
        <li>Crear el proyecto</li>
        <li>Escribir HTML</li>
        <li>Validar</li>
      </ol>
    </div>
    <div class="lesson-list-card">
      <strong>&lt;dl&gt; · términos</strong>
      <dl>
        <dt>HTML</dt>
        <dd>Estructura el contenido.</dd>
        <dt>CSS</dt>
        <dd>Define su presentación.</dd>
      </dl>
    </div>
  </div>
  <p class="lesson-demo__note">La viñeta o el número ayudan a leer, pero la diferencia importante es la relación que declara cada elemento.</p>
</figure>

| Lista | Se usa cuando | Ejemplo |
| ----- | ------------- | ------- |
| `<ul>` | El orden no cambia el significado | Los componentes que vende la tienda |
| `<ol>` | El orden **es** el significado | Los pasos para tramitar una devolución |
| `<dl>` | Cada elemento es un término y su definición | El glosario de la ficha técnica |

<div class="rule">
  <p class="rule-label">La prueba que distingue <code>ul</code> de <code>ol</code></p>
  <p>Reordena mentalmente los elementos. <strong>Si la información sigue siendo cierta, es <code>ul</code>. Si deja de serlo, es <code>ol</code>.</strong></p>
  <p>No decide el hecho de que se vean números: los números son apariencia, y con CSS se pueden poner y quitar.</p>
</div>

Cuando una lista va dentro de otra, el segundo `<ul>` va **dentro del `<li>`** del que depende, no detrás de él. Es el error más común de la sesión: sacarlo fuera declara que «Portátiles» es hermano de «Hardware» en lugar de una parte suya.

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

#### El enlace y la ruta relativa

```html
<a href="https://developer.mozilla.org/">MDN Web Docs</a>
```

`href` indica el destino y el contenido del elemento es el texto visible. Ese texto importa: «pincha aquí» no dice nada fuera de contexto, y mucha gente navega saltando de enlace en enlace sin leer lo que hay alrededor.

Para otra página del mismo sitio basta su nombre de archivo:

```html
<a href="productos.html">Productos</a>
```

Lo que desatasca todo lo demás es de dónde parte una ruta. Cuando escribes `href="productos.html"`, el navegador no busca desde la raíz del proyecto: busca **desde la carpeta del archivo que contiene el enlace**.

<div class="rule">
  <p class="rule-label">No hay rutas correctas en abstracto</p>
  <p>La misma ruta, escrita en dos archivos distintos, apunta a sitios distintos. Hay rutas correctas <strong>desde un origen</strong>, y por eso el procedimiento tiene siempre tres pasos: dónde estoy, dónde voy, y cuántos niveles subo antes de empezar a bajar.</p>
</div>

<div class="rule">
  <p class="rule-label">Por qué <code>C:\Users\...</code> no es un enlace</p>
  <p>Esto puede funcionar en tu ordenador:</p>
  <p><code>&lt;img src="C:\Users\Laura\Desktop\foto.jpg"&gt;</code></p>
  <p>Y deja de funcionar en cuanto mueves el proyecto, lo entregas o lo publicas, que es justo para lo que se hace una web. Lo mismo con <code>file:///</code>. Nuestros proyectos deben ser <strong>transportables</strong>.</p>
</div>

#### La navegación es una lista de enlaces

```html
<nav aria-label="Navegación principal">
    <ul>
        <li><a href="index.html">Inicio</a></li>
        <li><a href="productos.html">Productos</a></li>
        <li><a href="acerca.html">Acerca de</a></li>
        <li><a href="contacto.html" aria-current="page">Contacto (página actual)</a></li>
    </ul>
</nav>
```

* **`<nav>`** declara que ese bloque es navegación. Un lector de pantalla ofrece saltar a él, o saltárselo entero para ir al contenido, que es lo que hace casi todo el mundo que navega así.
* **La lista** dice que son cuatro enlaces hermanos, y permite anunciar «lista de 4 elementos». Cuatro enlaces sueltos separados por espacios no dicen ni cuántos son ni dónde acaban.
* **`aria-label="Navegación principal"`** da un nombre a este bloque para las tecnologías de asistencia.
* **`aria-current="page"`** identifica el enlace de la página actual para esas tecnologías. Por sí solo no cambia su aspecto: el texto «(página actual)» ofrece también una indicación visible.

El ejemplo corresponde a `contacto.html`. En cada una de las demás páginas, cambia de enlace tanto el atributo como la indicación visible; solo uno debe marcarse como actual.

No elegimos las etiquetas pensando en cómo queremos que se vea. Elegimos las que representan mejor la información.

### Se trabaja

<p class="stage stage--guided">140 minutos · práctica sobre tu propio proyecto</p>

Hoy el proyecto pasa de una página suelta a un sitio de cuatro páginas enlazadas. Los pasos 1 a 4 trabajan el contenido; los pasos 5 a 7, la navegación y las rutas.

#### Paso 1 · Revisa la jerarquía de tu portada · 10 min

Antes de añadir páginas nuevas, arregla la que ya tienes. Los ejemplos siguientes presentan las marcas que podrás utilizar en este paso; no necesitas emplearlas todas.

##### Consulta antes de empezar · texto y entidades

| Elemento | Significa |
| -------- | --------- |
| `mark` | Resaltado por relevancia en el contexto actual, como un subrayador |
| `small` | Letra pequeña en el sentido legal: avisos, notas al pie |
| `del` / `ins` | Contenido eliminado y contenido añadido. El par es perfecto para un precio rebajado |
| `abbr` | Una abreviatura, con su significado en `title` |
| `code` | Un fragmento de código o un nombre de archivo |

```html
<mark>texto destacado</mark>
<small>información secundaria</small>
<del>49,99 €</del> <ins>39,99 €</ins>
<abbr title="HyperText Markup Language">HTML</abbr>
<code>index.html</code>
```

Para escribir un `<` sin que abra una etiqueta se usan **entidades**:

| Escribes | Se ve |
| -------- | ----- |
| `&lt;` | `<` |
| `&gt;` | `>` |
| `&amp;` | `&` |
| `&quot;` | `"` |
| `&nbsp;` | Un espacio que no se parte al final de línea |
| `&copy;` | © |

Es imprescindible cuando quieres mostrar código HTML dentro de una página, que es lo que hacen estos apuntes.

1. Dibuja en papel el índice de tu `index.html`: qué es `h1`, qué es `h2`, qué es `h3`.
2. Comprueba que no hay ningún salto de nivel y que solo hay un `h1`.
3. Sustituye cualquier `<br><br>` que hayas usado para separar por párrafos reales.
4. Añade al menos un `abbr`, un `code` o un par `del`/`ins` donde tenga sentido de verdad. Si no lo tiene en tu tema, no lo fuerces: dilo en un comentario.

Antes de eso, resuelve este caso y explica qué principio incumple:

```html
<p>
    <h2>Nuestros productos</h2>
</p>
```

<details class="aside aside--extra">
  <summary>Ver respuesta</summary>
  <p>Un <code>&lt;p&gt;</code> solo puede contener contenido en línea: texto, <code>strong</code>, <code>em</code>, <code>a</code>, <code>img</code>… Un encabezado es un elemento de bloque y no cabe dentro de un párrafo.</p>
  <p>El navegador no muestra un error: cierra el párrafo por su cuenta justo antes del <code>&lt;h2&gt;</code> y, al procesar el <code>&lt;/p&gt;</code> final, genera otro párrafo vacío. El encabezado queda fuera del párrafo, no dentro como sugiere el código. Otra vez el mismo patrón: se ve bien, y la estructura real no es la que escribiste.</p>
</details>

#### Paso 2 · De texto plano a estructura · 25 min

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
  <p>Aplica la prueba de forma literal. Con «Memoria RAM, Almacenamiento SSD, Procesador», la afirmación de que esos son los componentes de un ordenador se mantiene con independencia del orden. Con «Reiniciar, Descargar la imagen, Arrancar desde el USB», en cambio, ya no describe una instalación posible.</p>
</details>

#### Paso 3 · Los módulos de DAW · 10 min

Representa esta estructura con **el mínimo HTML razonable y semánticamente correcto**:

```text
DAW
 ├ Lenguajes de Marcas
 ├ Programación
 └ Bases de Datos
```

<details class="aside aside--extra">
  <summary>Ver respuesta</summary>
  <p>Una solución que permite practicar la anidación es representar DAW y sus módulos mediante una lista dentro de otra:</p>
  <pre><code>&lt;ul&gt;
  &lt;li&gt;DAW
    &lt;ul&gt;
      &lt;li&gt;Lenguajes de Marcas&lt;/li&gt;
      &lt;li&gt;Programación&lt;/li&gt;
      &lt;li&gt;Bases de Datos&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/li&gt;
&lt;/ul&gt;</code></pre>
  <p>En esta solución, la lista anidada va <strong>dentro</strong> del <code>&lt;li&gt;</code> de DAW. También puedes representar DAW como un encabezado seguido de una lista de módulos; justifica la elección según el contexto de la página.</p>
</details>

#### Paso 4 · Crea `productos.html` · 25 min

Crea la segunda página de tu proyecto. Debe contener:

* Un encabezado principal y al menos dos niveles de encabezado.
* Varios párrafos.
* Una lista no ordenada.
* Una lista ordenada, donde el orden importe de verdad.
* Una lista de descripciones (`dl`), con sus términos (`dt`) y descripciones (`dd`).
* Una lista anidada dentro de un `li`.
* Al menos dos elementos de significado textual de la sesión anterior.

Todavía no la enlazaremos con la portada: eso es el paso 5.

**Antes de continuar:** `ul`, `ol` y `dl` están presentes y cada una declara la relación que le corresponde, no la que da el aspecto deseado.

#### Paso 5 · El sitio multipágina · 35 min

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
3. Cada página marca su propio enlace con `aria-current="page"` y el texto visible «(página actual)», como en el ejemplo. Quita ambas marcas de los otros enlaces.
4. Cada página tiene un único `h1` que coincide con su tema.

Recorre después el ciclo completo: Inicio → Productos → Acerca de → Contacto → Inicio. Si algún enlace falla, no lo arregles todavía: anótalo, porque es exactamente el problema que ataca el paso siguiente.

<details class="aside aside--help">
  <summary>Estoy atascado · el título de cada página</summary>
  <p>El <code>&lt;title&gt;</code> se lee fuera de contexto: en una pestaña estrecha, en un favorito, en un resultado de búsqueda. «Contacto» no dice de qué web es. Escribe primero lo específico y después el sitio, porque las pestañas se recortan por el final: <code>Contacto | PixelStore</code>.</p>
</details>

<details class="aside aside--extra">
<summary>Consultar · enlaces internos, especiales y a otra pestaña</summary>

Para saltar dentro de la misma página se enlaza un `id`:

```html
<a href="#contacto">Ir a contacto</a>

<section id="contacto">
    <h2>Contacto</h2>
</section>
```

<p class="term">id</p>

Identifica un elemento **de forma única** dentro del documento. Dos elementos con el mismo `id` son un error, y uno que los validadores sí detectan.

```html
<a href="mailto:contacto@example.com">Enviar correo</a>
<a href="tel:+34960000000">960 000 000</a>
```

`tel:` es especialmente útil en móvil, donde convierte el número en algo que se puede pulsar para llamar.

```html
<a href="https://example.com"
   target="_blank"
   rel="noopener noreferrer">
    Abrir recurso
</a>
```

`target="_blank"` abre en pestaña nueva y `rel="noopener noreferrer"` corta la referencia que la página abierta obtendría hacia la tuya. Los navegadores actuales ya lo hacen por su cuenta, pero escribirlo sigue siendo lo correcto: no dependes de la versión del navegador y dejas la intención por escrito.

Abrir pestañas automáticamente no debería ser la opción por defecto. Quien navega debería mantener el control de su navegación, y el botón de volver atrás deja de funcionar en una pestaña nueva.

</details>

#### Paso 6 · El laberinto de rutas · 25 min

Este ejercicio se hace en una **carpeta independiente llamada `practica-rutas`**, junto a `mi-web`, no dentro de ella. No muevas las cuatro páginas del proyecto. Así puedes practicar con otra estructura sin romper la navegación que acabas de terminar.

Crea estas carpetas y archivos desde el explorador de VS Code:

```text
practica-rutas/
├── index.html
├── recursos/
│   └── ayuda.html
└── paginas/
    ├── productos.html
    └── contacto.html
```

En cada HTML, reutiliza el esqueleto que ya conoces y escribe un `title` y un `h1` que identifiquen el archivo, por ejemplo «Ayuda» en `ayuda.html`. Guarda los cuatro antes de probar los enlaces. Todos los destinos de este ejercicio son páginas HTML; las imágenes llegarán en la sesión siguiente.

##### 6.1 · Ejemplo resuelto

**Desde `paginas/productos.html`, enlazar `recursos/ayuda.html`.**

<dl class="worked">
  <dt>¿Dónde estoy?</dt>
  <dd>En <code>practica-rutas/paginas/</code>, porque ahí vive el archivo que escribe el enlace.</dd>
  <dt>¿Dónde está el destino?</dt>
  <dd>En <code>practica-rutas/recursos/</code>.</dd>
  <dt>¿Cuál es el camino?</dt>
  <dd>Subir de <code>paginas/</code> a <code>practica-rutas/</code>, y desde ahí bajar a <code>recursos/</code>.</dd>
  <dt>Ruta</dt>
  <dd><code>../recursos/ayuda.html</code></dd>
</dl>

En `paginas/productos.html`, escribe `<a href="../recursos/ayuda.html">Ayuda</a>` dentro del `body`, guarda y abre la página en el navegador. Pulsa el enlace y comprueba que aparece el encabezado «Ayuda».

El procedimiento tiene tres pasos: dónde estoy, dónde voy y cuántos niveles subo antes de empezar a bajar.

##### 6.2 · Ahora tú

1. Desde `productos.html`, volver a `index.html`.
2. Desde `index.html`, enlazar `recursos/ayuda.html`.
3. Desde `contacto.html`, enlazar `productos.html`.
4. Desde `index.html`, enlazar `contacto.html`.
5. Desde `index.html`, saltar a un encabezado con `id="envios"` en esa misma página. Crea primero el destino: `<h2 id="envios">Envíos</h2>`.

Escribe cada enlace en el archivo de origen, dentro del `body`, con un texto que describa el destino. Guarda y prueba uno a uno; comprueba el nombre del archivo en la barra de direcciones. Si el salto a «Envíos» apenas mueve la pantalla, comprueba que la dirección termina en `#envios`: el destino puede estar ya a la vista.

<details class="aside aside--extra">
  <summary>Consultar · qué significa cada forma de ruta</summary>

| Escribes | Significa |
| -------- | --------- |
| `pagina.html` | Un archivo en **mi misma** carpeta |
| `./pagina.html` | Lo mismo, escrito de forma explícita |
| `carpeta/pagina.html` | Bajar a una carpeta que está dentro de la mía |
| `../pagina.html` | **Subir** un nivel y buscar allí |
| `../../pagina.html` | Subir dos niveles |
| `#seccion` | Saltar a un elemento con ese `id` en esta misma página |

</details>

<details class="aside aside--extra">
  <summary>Ver soluciones</summary>
  <p>1 · <code>../index.html</code> — subo de <code>paginas/</code> a la raíz.</p>
  <p>2 · <code>recursos/ayuda.html</code> — ya estoy en la raíz, solo bajo.</p>
  <p>3 · <code>productos.html</code> — los dos están en <code>paginas/</code>, misma carpeta.</p>
  <p>4 · <code>paginas/contacto.html</code> — bajo un nivel desde la raíz.</p>
  <p>5 · <code>#envios</code> — sin nombre de archivo: el destino está en el documento actual.</p>
</details>

#### Paso 7 · La prueba de portabilidad · 10 min

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación de portabilidad · un minuto</p>
  <p>Vuelve a tu proyecto de cuatro páginas, <code>mi-web</code>. Copia su carpeta completa a otra ubicación, abre el <code>index.html</code> de esa copia y navega por todos los enlaces. Si algo falla, revisa el origen del enlace, la ruta y si has copiado todos los archivos. El objetivo es comprobar que el sitio no depende de su ubicación inicial.</p>
</div>

En la copia, recorre las cuatro páginas en los dos sentidos y anota qué enlaces has comprobado y cualquier fallo encontrado. Verifica en la barra de direcciones que sigues dentro de la copia y no has vuelto a los archivos originales. Un proyecto que solo funciona en la carpeta donde se escribió no está terminado.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los siete pasos. Estos dos retos no añaden etiquetas nuevas: exigen resolver rutas sobre estructuras que no has diseñado tú y juzgar decisiones ajenas.

##### Reto 1 · Un árbol de carpetas que no es el tuyo

```text
tienda/
├── index.html
├── assets/
│   ├── marca/
│   │   └── historia.html
│   └── docs/
│       └── garantia.html
├── catalogo/
│   ├── index.html
│   ├── portatiles.html
│   └── fichas/
│       └── portatil-14.html
└── legal/
    └── privacidad.html
```

Escribe la ruta relativa para cada caso, aplicando los tres pasos del procedimiento. No compruebes en el navegador hasta haberlas escrito todas:

1. Desde `catalogo/portatiles.html`, enlazar `fichas/portatil-14.html`.
2. Desde `catalogo/fichas/portatil-14.html`, enlazar `assets/marca/historia.html`.
3. Desde `catalogo/fichas/portatil-14.html`, volver a la portada del sitio.
4. Desde `legal/privacidad.html`, enlazar `assets/docs/garantia.html`.
5. Desde `index.html`, enlazar `catalogo/index.html`, incluyendo el nombre del archivo para poder probarlo al abrir el sitio localmente.
6. Desde `catalogo/index.html`, enlazar `privacidad.html`.
7. Desde `catalogo/fichas/portatil-14.html`, enlazar `portatiles.html`.

Al terminar, crea una carpeta independiente `tienda` con esa estructura. En cada archivo escribe el esqueleto HTML y un encabezado que identifique la página. Añade los enlaces en sus archivos de origen y comprueba cuántas rutas acertaste a la primera. Las que falles, resuélvelas otra vez escribiendo los tres pasos por separado.

##### Reto 2 · La navegación de una web real

Abre tres sitios que uses y examina su menú principal con `Ctrl + U` o con el inspector. Responde por cada uno:

1. ¿El bloque de navegación es un `nav`, o son enlaces sueltos dentro de un `div`?
2. ¿Los enlaces están dentro de una lista, de modo que se pueda anunciar cuántos son?
3. ¿Se indica de alguna forma, además del color, cuál es la página actual?
4. ¿Hay algún enlace cuyo texto no signifique nada fuera de contexto, del tipo «aquí», «leer más» o «ver»? Cópialo y propón una redacción que sí funcione leída en voz alta y aislada.

Los tres menús funcionan con el ratón. La pregunta de esta unidad es siempre la misma: qué le queda a quien no usa el ratón ni ve el color.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Cuatro páginas enlazadas, títulos distintos, navegación coherente y listas ul, ol y dl en <code>productos.html</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>La prueba de portabilidad superada en una copia de la carpeta, con los fallos anotados y corregidos.</span></div>
  <div><strong>Reto</strong><span>Las siete rutas del árbol ajeno resueltas sin probar en el navegador, y la auditoría de las tres navegaciones reales.</span></div>
</div>

### Cierre

<p class="stage">10 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>La portada no salta ningún nivel de encabezado y tiene un solo <code>h1</code>.</li>
    <li>La elección entre <code>ul</code> y <code>ol</code> está justificada por escrito en un comentario.</li>
    <li>Las listas anidadas van dentro del <code>li</code> del que dependen.</li>
    <li>El sitio tiene cuatro páginas con títulos distintos y descriptivos.</li>
    <li>La navegación es un <code>nav</code> con una lista, y cada página identifica la actual con <code>aria-current</code> y un texto visible.</li>
    <li>El proyecto sigue funcionando al abrirlo desde una copia en otra ubicación.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué está mal pasar de <code>h2</code> a <code>h4</code>?</li>
    <li>¿Cuál es la diferencia de significado entre <code>strong</code> y <code>em</code>?</li>
    <li>¿Cómo se escribe «&lt;p&gt;» para que aparezca literalmente en la página?</li>
    <li>Da la prueba de una frase que distingue <code>ul</code> de <code>ol</code>.</li>
    <li>¿Dónde va el <code>&lt;ul&gt;</code> de una lista anidada?</li>
    <li>¿Desde dónde se resuelve una ruta relativa?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque los encabezados forman el índice del documento y saltar deja un hueco: quien navegue por encabezados no sabrá de qué es parte ese <code>h4</code>.</p>
  <p>2 · <code>strong</code> marca importancia; <code>em</code> marca énfasis, el matiz que cambiaría el tono al leer la frase en voz alta. Ninguno de los dos significa «negrita» o «cursiva».</p>
  <p>3 · <code>&amp;lt;p&amp;gt;</code>.</p>
  <p>4 · Si al reordenar los elementos la información sigue siendo cierta, es <code>ul</code>; si deja de serlo, es <code>ol</code>.</p>
  <p>5 · Dentro del <code>&lt;li&gt;</code> del que depende, no detrás de él.</p>
  <p>6 · Desde la carpeta del archivo que contiene el enlace, no desde la raíz del proyecto.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Comprobación individual 2 · últimos 5 minutos del cierre</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Escribe una jerarquía con un <code>h1</code>, dos apartados y un subapartado.</li>
    <li>Decide si tres instrucciones ordenadas necesitan <code>ol</code>, <code>ul</code> o tres párrafos y justifica.</li>
    <li>Desde <code>paginas/acerca.html</code>, enlaza <code>index.html</code> y explica cómo resolviste la ruta.</li>
  </ol>
</div>


---

## Sesión 3 · Imágenes y semántica estructural

<p class="lead">Tres horas. Media hora para entender qué función cumple una imagen y qué declara cada elemento estructural, y dos horas y media decidiendo textos alternativos, refactorizando marcado ajeno y auditando una web en producción.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Que el <code>alt</code> correcto depende de la función de la imagen y no de lo que se ve en ella, qué declara cada elemento estructural y cuándo un <code>div</code> sigue siendo correcto.</li>
    <li><strong>2. Haz:</strong> Decide el texto alternativo de cinco imágenes, refactoriza un documento hecho solo de <code>div</code>, aplica la estructura a tus cuatro páginas y audita una web real.</li>
    <li><strong>3. Comprueba:</strong> Desactiva las imágenes y comprueba si la página sigue entendiéndose.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Desde qué archivo se resuelve una ruta relativa?</li>
    <li>¿Qué convierte un grupo de enlaces en una navegación?</li>
    <li>Desde <code>paginas/productos.html</code>, escribe la ruta hacia <code>index.html</code>.</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Hoy hay dos decisiones que se repiten todo el día: qué función cumple cada imagen, y qué representa cada bloque de la página. Ninguna se resuelve mirando cómo queda.

#### El `alt` no describe la imagen: la sustituye

```html
<img src="img/portatil.webp"
     alt="Portátil gris abierto sobre una mesa de trabajo">
```

`src` indica el archivo y `alt` el texto alternativo. `img` es un elemento vacío: no se cierra.

La pregunta habitual, «¿qué pongo en el `alt`?», casi siempre se responde describiendo lo que se ve. Es la respuesta equivocada.

El texto alternativo es lo que ocupa el lugar de la imagen cuando la imagen no está: porque no ha cargado, porque la conexión es mala, o porque quien lee la página no la ve. Así que la pregunta correcta es:

> **Si borro esta imagen, ¿qué tendría que decir aquí para que no se pierda nada?**

De ahí salen tres casos, y solo tres:

| La imagen... | El `alt` es... | Ejemplo |
| ------------ | -------------- | ------- |
| **Informa**: aporta contenido que no está escrito en ningún otro sitio | La información que aporta | `alt="El modelo A consume 45 W, el B 65 W y el C 90 W"` |
| **Actúa**: es el único contenido de un enlace o un botón | La acción o el destino, no el dibujo | `alt="Buscar en la tienda"` |
| **Decora**: no aporta nada que no esté ya en el texto | Vacío, y se escribe igualmente | `alt=""` |

<div class="rule">
  <p class="rule-label"><code>alt=""</code> no es lo mismo que no poner <code>alt</code></p>
  <p><code>alt=""</code> significa «esta imagen es decorativa, ignórala». Un lector de pantalla la salta en silencio, que es justo lo que queremos.</p>
  <p>Si directamente no escribes el atributo, el lector no sabe qué hacer y suele leer el nombre del archivo. Quien usa la página escucha «guion bajo img guion 47 punto webp». Por eso <strong>toda</strong> imagen lleva <code>alt</code>: la duda es solo si va vacío o lleno.</p>
</div>

Los dos casos extremos, escritos:

```html
<img src="img/placa-solar.webp"
     alt="Paneles solares instalados sobre la cubierta del edificio">
```

```html
<img src="img/separador.webp" alt="">
```

Un texto alternativo vacío puede ser exactamente la decisión correcta.

Dos textos alternativos que no sirven:

```html
alt="foto"
```

```html
alt="ordenador portátil barato comprar ordenador portátil
ofertas portátiles ordenador gaming tienda Alicante"
```

El primero no aporta información alguna. El segundo convierte el `alt` en un almacén de palabras clave, y quien depende de él tiene que escuchar eso entero.

#### `figure` y `figcaption`

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

#### Un `div` no dice nada; estos elementos sí

Podríamos construir una web con cientos de `div`. Funcionaría, pero un `<div>` no aporta significado alguno: es únicamente un contenedor. HTML tiene elementos que explican **qué representa cada parte**, y eso permite que un lector de pantalla ofrezca una lista de zonas y salte directamente a la que interese.

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

Dos matices que se olvidan. `<main>` va **una sola vez por página**, y no puede estar dentro de `header`, `nav`, `article`, `aside` ni `footer`. Una `<section>` de verdad, además, admite un encabezado: si no sabrías qué título ponerle, probablemente no es una `section`.

#### `section` o `article`

La regla que resuelve casi todos los casos:

> **Si el contenido tuviera sentido publicado por separado, es un `article`. Si solo lo tiene como parte de esta página, es una `section`.**

Una ficha de producto se entiende sola: aparece en un buscador, se comparte por mensaje, tiene su propio título. Es un `article`. El catálogo que agrupa veinte fichas solo tiene sentido dentro de la tienda: es una `section`.

#### El uso legítimo de `div`

`<div>` es un contenedor genérico perfectamente válido. La pregunta es:

> **¿Existe un elemento con un significado más adecuado?**

Si existe, úsalo. Si no existe —solo estás agrupando cosas de cara al CSS, sin que ese grupo represente ninguna zona con significado— `div` es exactamente lo correcto. **El error no es usar `div`: es usarlo en lugar de algo que sí significaba.**

Así queda un documento completo:

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

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>El documento entendido como regiones</strong></figcaption>
  <div class="lesson-demo__stage">
    <div class="lesson-semantic-map" aria-label="Mapa de las regiones semánticas del ejemplo">
      <div class="lesson-semantic-map__region" data-element="&lt;header&gt;">
        <strong>PixelStore</strong>
        <div class="lesson-semantic-map__nav" aria-label="Contenido de nav">
          <span>Inicio</span><span>Productos</span><span>Contacto</span>
        </div>
      </div>
      <div class="lesson-semantic-map__region" data-element="&lt;main&gt;">
        <div class="lesson-semantic-map__region" data-element="&lt;section&gt;">
          <strong>Productos destacados</strong>
          <div class="lesson-semantic-map__articles">
            <div>Portátil Nova 14</div>
            <div>Monitor Vision 27</div>
          </div>
        </div>
      </div>
      <div class="lesson-semantic-map__region" data-element="&lt;footer&gt;">© 2026 PixelStore</div>
    </div>
  </div>
  <p class="lesson-demo__note">Visualmente podrían ser cajas idénticas; las etiquetas indican qué papel cumple cada región para el navegador y las tecnologías de asistencia.</p>
</figure>

Aunque todavía no tenga CSS, la estructura del documento ya tiene sentido. Léela en voz alta: se entiende qué es cada cosa sin ver la pantalla.

#### Leer la estructura de una página ajena

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

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto y sobre código ajeno</p>

Los tres primeros pasos deciden textos alternativos y estructura sobre material dado; los cuatro últimos llevan esas decisiones a tu sitio y después a una web en producción.

#### Paso 1 · ¿Qué `alt` pondrías? · 20 min

##### 1.1 · Ejemplo resuelto

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

##### 1.2 · Ahora tú

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

#### Paso 2 · Imágenes en tu proyecto · 20 min

Crea la carpeta `img/` y añade al menos tres imágenes a tu sitio: una informativa, una decorativa y una dentro de un `figure` con su pie. Enlázalas con rutas relativas.

Añade a todas `width`, `height` y, a las que no se vean al abrir la página, `loading="lazy"`:

```html
<img src="img/producto.webp"
     alt="Teclado mecánico compacto"
     width="800"
     height="600"
     loading="lazy">
```

`width` y `height` reservan el hueco antes de que la imagen llegue, y evitan que el texto salte cuando termina de cargar. `loading="lazy"` retrasa la descarga de las imágenes que todavía no se ven. Más adelante veremos cómo CSS adapta visualmente estas imágenes.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación · la prueba de las imágenes apagadas</p>
  <p>Desactiva la carga de imágenes en el navegador y recarga tu proyecto. Si alguna zona pasa a ser incomprensible, o aparece un hueco sin ninguna explicación, ese <code>alt</code> está mal resuelto.</p>
</div>

<details class="aside aside--extra">
  <summary>Consultar · una imagen no tiene por qué ser un único archivo</summary>
  <p>HTML permite ofrecer varias versiones del mismo contenido y dejar que el navegador elija:</p>
  <pre><code>&lt;picture&gt;
    &lt;source srcset="img/portada.webp" type="image/webp"&gt;
    &lt;img src="img/portada.jpg" alt="Estudiantes en un laboratorio"&gt;
&lt;/picture&gt;</code></pre>
  <p>El navegador usa el primer <code>source</code> que entiende y, si no entiende ninguno, cae en el <code>img</code>. No hace falta dominarlo ahora. Lo importante es saber que existe y que una imagen web no es necesariamente un solo archivo para cualquier situación.</p>
</details>

<details class="aside aside--extra">
  <summary>Consultar · audio, vídeo y contenido incrustado</summary>
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

#### Paso 3 · El infierno de los div · 30 min

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

##### 3.1 · Ejemplo resuelto · la barra superior

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

##### 3.2 · Completa una versión guiada

Antes de abordar el documento entero, sustituye en una copia únicamente `content-box`, `bloque-central` y `titulo-seccion`. Elige entre `main`, `section` y un encabezado, y escribe al lado de cada cambio qué significado has añadido.

##### 3.3 · Ahora tú

Reescribe el resto. Al terminar, tu versión debe cumplir:

1. No queda ningún `div` cuyo nombre de clase describa algo que HTML ya sabe decir.
2. Hay un único `<main>`.
3. «Novedades» es un encabezado, y «Portátil Nova 14» un encabezado de nivel inferior.
4. La tarjeta está marcada como `article`, y sabes justificar por qué no es una `section`.
5. El aviso lateral es un `aside` y el pie un `footer`.
6. No has perdido ni una palabra del contenido original.

#### Paso 4 · Dos decisiones que se discuten · 15 min

Las dos se resuelven en pareja, en voz alta, antes de mirar la respuesta.

##### 4.1 · Botón contra falso botón

```html
<!-- Opción A -->
<div onclick="guardar()">Guardar</div>

<!-- Opción B -->
<button type="button">Guardar</button>
```

Las dos funcionan al hacer clic. ¿Cuál eliges y por qué?

<details class="aside aside--extra">
  <summary>Ver respuesta</summary>
  <p>La B, y no por estilo. Un <code>&lt;button&gt;</code> trae de fábrica cuatro cosas que la A no tiene y habría que reconstruir a mano: se alcanza con <code>Tab</code>, se activa con <code>Enter</code> y con la barra espaciadora, se anuncia como «botón» a un lector de pantalla, y recibe el foco visible.</p>
  <p>La opción A solo funciona para quien use ratón y vea la pantalla. Mismo patrón de toda la unidad: se ve igual, y no hace lo mismo.</p>
</details>

##### 4.2 · ¿`section` o `article`?

En una tienda online:

* ¿La ficha individual de un producto es `section` o `article`?
* ¿Y el catálogo que agrupa los veinte productos?
* ¿Y un comentario de un cliente dentro de la ficha?

<details class="aside aside--extra">
  <summary>Ver respuesta</summary>
  <p>La ficha es un <code>article</code>: se entiende sola fuera de la página, y de hecho es lo que se comparte o lo que devuelve un buscador.</p>
  <p>El catálogo es una <code>section</code>: agrupa artículos y solo tiene sentido dentro de la tienda. Es decir, una <code>section</code> que contiene veinte <code>article</code>, y no al revés.</p>
  <p>El comentario es un <code>article</code> dentro del <code>article</code> de la ficha. Sí, se pueden anidar: un comentario es contenido independiente y atribuible a alguien.</p>
  <p>Fíjate en que aquí no hay una única respuesta mecánica. HTML semántico admite discusión, y saber defender tu decisión vale más que acertar la etiqueta «oficial».</p>
</details>

#### Paso 5 · Refactoriza tu propio sitio · 25 min

Aplica lo mismo a tus cuatro páginas: `header`, `nav`, `main`, `footer` en todas, y `section` / `article` donde corresponda.

Escribe en un comentario, en cada página, una decisión que hayas tenido que pensar: un `div` que decidiste conservar, o un bloque en el que dudaste entre `section` y `article`.

**Antes de continuar:** ninguna de las cuatro páginas tiene más de un `main`, y ninguna usa un `div` donde exista un elemento con significado.

#### Paso 6 · Audita una web real · 25 min

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

<details class="aside aside--extra">
  <summary>Consultar · elementos que ya existen y solemos reprogramar</summary>
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

#### Paso 7 · La misma auditoría sobre lo tuyo, y revisión cruzada · 15 min

Pásale a tus cuatro páginas exactamente la misma auditoría que acabas de hacerle a una web profesional, y corrige lo que encuentres.

No es casualidad que la auditoría vaya antes: es más fácil ver un fallo en el código de otro, y ese ojo entrenado es el que después aplicas al tuyo.

Intercambia después únicamente tu `index.html` con un compañero. No lo corrijas por él: encuentra **un problema semántico concreto** y descríbelo con este formato:

1. **Qué veo:** señala el elemento y el contenido afectado.
2. **Por qué importa:** explica qué significado o navegación pierde.
3. **Qué probaría:** propone una alternativa sin reescribir el documento.

El autor decide si acepta la observación. También puede rechazarla, pero debe justificar su decisión con el significado del contenido.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los siete pasos. Los dos retos trabajan sobre material que no da ninguna pista, que es la situación real cuando heredas un proyecto.

##### Reto 1 · Refactorizar sin nombres de clase que ayuden

En el paso 3 los nombres de clase casi daban la respuesta: `top-bar`, `menu`, `pie`. Aquí no hay nada de eso.

```html
<div id="a1">
    <div class="b1">
        <div class="c1">Revista Mecánica</div>
        <div class="c2">
            <a href="index.html">Portada</a>
            <a href="numeros.html">Números</a>
            <a href="suscripcion.html">Suscripción</a>
        </div>
    </div>
    <div class="b2">
        <div class="c3">
            <div class="d1">Motores de combustión: el final de una era</div>
            <div class="d2">Por Elena Ruiz · 12 de marzo de 2026</div>
            <div class="d3">El calendario europeo de prohibición obliga a replantear
            toda la cadena de suministro.</div>
        </div>
        <div class="c3">
            <div class="d1">Diez años de baterías de estado sólido</div>
            <div class="d2">Por Marc Oliver · 3 de marzo de 2026</div>
            <div class="d3">Lo que se prometió, lo que llegó y lo que sigue sin
            resolverse.</div>
        </div>
    </div>
    <div class="b3">
        <div class="c4">Suscríbete y recibe cada número en papel.</div>
    </div>
    <div class="b4">Revista Mecánica · Depósito legal V-1234-2011</div>
</div>
```

Reescríbelo entero. Como no hay nombres que te orienten, la decisión sale del **contenido**: qué dice cada bloque y qué papel cumple en la página. Justifica por escrito estas cuatro:

1. Los dos bloques `c3` repetidos, ¿son `section` o `article`? Aplica la regla.
2. La línea de autoría y fecha, ¿qué elemento merece? Hay uno pensado para fechas.
3. El bloque `b3`, ¿es contenido principal o secundario?
4. ¿Queda algún `div` en tu versión? Si queda, di por qué es el elemento correcto ahí.

##### Reto 2 · Cinco textos alternativos en producción

Vuelve a la web que auditaste y localiza cinco imágenes con funciones distintas: al menos un logotipo enlazado, un icono dentro de un botón o enlace, una foto de contenido y algo decorativo.

| Imagen | Función que cumple | `alt` que tiene | ¿Correcto? | El que escribirías tú |
| ------ | ------------------ | --------------- | ---------- | --------------------- |
| | | | | |

Cuenta cuántos de los cinco están bien resueltos. Si alguna imagen no tiene atributo `alt`, anótalo aparte: no es lo mismo que tenerlo vacío, y esa distinción es la que hoy tienes que poder explicar.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Los cinco textos alternativos decididos y justificados, el documento de <code>div</code> refactorizado y tus cuatro páginas con estructura semántica.</span></div>
  <div><strong>Si lo tienes</strong><span>La auditoría de una web real completa, con hallazgos concretos en lugar de impresiones, y la revisión cruzada contestada.</span></div>
  <div><strong>Reto</strong><span>La revista refactorizada sin pistas en los nombres de clase, con las cuatro justificaciones, y la tabla de los cinco <code>alt</code> en producción.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Todas tus imágenes tienen <code>alt</code>, lleno o vacío según su función.</li>
    <li>La página sigue entendiéndose con las imágenes desactivadas.</li>
    <li>Tus cuatro páginas usan elementos estructurales, no <code>div</code> genéricos.</li>
    <li>Hay un único <code>main</code> por página.</li>
    <li>Sabes abrir el árbol de accesibilidad y leer las zonas de una página.</li>
    <li>Has auditado una web real con hallazgos concretos, no impresiones.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>alt=""</code> y no escribir <code>alt</code>?</li>
    <li>¿Por qué <code>alt</code> y <code>figcaption</code> no deben decir lo mismo?</li>
    <li>¿Cuántos <code>&lt;main&gt;</code> puede haber en una página?</li>
    <li>Da la regla de una frase que separa <code>section</code> de <code>article</code>.</li>
    <li>¿Cómo compruebas en diez segundos si un botón es un botón de verdad?</li>
    <li>¿Por qué el panel Elements puede no coincidir con el código fuente?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>alt=""</code> declara que la imagen es decorativa y hace que se ignore. Sin el atributo, el lector de pantalla acaba leyendo el nombre del archivo.</p>
  <p>2 · Porque el pie lo lee todo el mundo y el <code>alt</code> solo sustituye a la imagen. Si coinciden, se oye la misma frase dos veces.</p>
  <p>3 · Uno. Es el contenido principal del documento, y no puede haber dos.</p>
  <p>4 · Si tendría sentido publicado por separado es <code>article</code>; si solo lo tiene dentro de esta página, <code>section</code>.</p>
  <p>5 · Intentando llegar hasta él con <code>Tab</code>. Si no recibe el foco, no es un botón.</p>
  <p>6 · Porque muestra el documento ya reparado por el navegador y modificado por el JavaScript. El fuente original se ve con <code>Ctrl + U</code>.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 3 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Reestructura <code>&lt;div class="menu"&gt;...&lt;/div&gt; &lt;div class="noticia"&gt;...&lt;/div&gt;</code> con elementos semánticos.</li>
    <li>Justifica dos de tus decisiones: no basta con nombrar las etiquetas.</li>
    <li>Escribe el <code>alt</code> de una imagen decorativa y el de un gráfico que aporta un dato.</li>
  </ol>
</div>


---

## Sesión 4 · Tablas e integración

<p class="lead">Tres horas. Media hora para entender qué relación declara una tabla y cómo se comprueba su cuadrícula, y dos horas y media construyendo tablas accesibles y convirtiendo una especificación desconocida en una página completa.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué hace cada parte de una tabla, qué problema resuelve <code>scope</code>, cómo ocupan la cuadrícula las celdas combinadas y qué pregunta precede siempre a la elección de una etiqueta.</li>
    <li><strong>2. Haz:</strong> Convierte una comparativa en tabla accesible, construye el horario de tu grupo y marca una página entera de la que solo recibes la especificación.</li>
    <li><strong>3. Comprueba:</strong> Todas las filas suman el mismo número de columnas, y cada celda se puede leer junto a sus encabezados.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Enumera cuatro regiones semánticas que esperarías encontrar en una página completa.</li>
    <li>¿Qué hace que una auditoría semántica sea distinta de juzgar el diseño?</li>
    <li>Decide si una ficha de producto independiente sería <code>section</code>, <code>article</code> o <code>div</code>, y justifica.</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Una tabla es el primer elemento de la unidad cuyo marcado se puede verificar con una suma, y también el último en el que conviene caer por defecto: buena parte de la sesión consiste en decidir cuándo **no** hace falta.

#### Las tablas sirven para datos tabulares

No sirven para diseñar una página. Durante años se maquetaron webs enteras con tablas porque era la única forma de colocar cosas en columnas; eso terminó hace mucho, pero la costumbre dejó rastro.

Esta tabla funciona, y sin embargo le falta casi todo:

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

#### El problema que resuelve una tabla bien marcada

Cuando tú miras una tabla, lees una celda y **subes con la vista** hasta el encabezado de su columna para saber qué significa ese número. Es tan automático que no lo notas.

Quien no percibe la tabla visualmente no puede hacer eso. Recorre las celdas una a una y, sin información adicional, escucha «899» y nada más. Necesita que el documento diga a qué encabezado pertenece cada celda.

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

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>Una tabla que conserva la relación entre filas y columnas</strong></figcaption>
  <div class="lesson-demo__stage">
    <table class="lesson-demo-table">
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
  </div>
  <p class="lesson-demo__note">El color facilita distinguir los encabezados, pero la asociación accesible la crean <code>th</code> y <code>scope</code>, no el aspecto.</p>
</figure>

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

#### `scope`

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

#### Una tabla es una cuadrícula, aunque no lo parezca

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

Una celda combinada aislada se entiende bien. Una tabla con combinaciones en varias direcciones a la vez se vuelve difícil de recorrer para quien la escucha, porque deja de estar claro qué encabezado gobierna cada celda. Si tu tabla necesita ese nivel de combinación, casi siempre lo correcto es **partirla en dos tablas más simples**, cada una con su `caption`. Profesionalmente, `rowspan` y `colspan` tienen bastante menos recorrido del que parece: conviene conocerlos y no abusar.

#### La decisión viene antes que la etiqueta

Hoy la tabla vuelve a ser solo una opción entre muchas. Antes de escribir cada bloque, formula estas preguntas:

1. ¿Este contenido se entiende por sí solo o forma parte de otro?
2. ¿Es navegación, una acción o información?
3. ¿Existe orden, jerarquía o cruce de fila y columna?
4. ¿La decisión expresa significado o solo intenta colocar algo visualmente?

<div class="rule">
  <p class="rule-label">Demostración · la estructura no se maquilla</p>
  <p>Se comparan tres diseños distintos del mismo documento integrado. La navegación, las regiones y la tabla no cambian en ninguno: solo cambia cómo se presentan. Es la misma idea que abrió la unidad, ahora sobre un documento completo.</p>
</div>

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre datos dados y sobre una especificación nueva</p>

Los dos primeros pasos construyen tablas; el tercero y el cuarto retiran las etiquetas y dejan solo el contenido, que es la situación real de un encargo.

#### Paso 1 · Construye la tabla · 20 min

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

#### Paso 2 · El horario de clase · 30 min

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

**Antes de continuar:** las sumas por filas dan todas el mismo total, comprobado sobre el código y no sobre el navegador.

#### Paso 3 · Completa el marcado · 15 min

##### 3.1 · Un fragmento resuelto

La especificación dice: «Una introducción explica el evento y después aparecen tres ventajas sin orden». La decisión es un apartado con encabezado, párrafo y lista no ordenada. No se elige por cómo quedará colocado, sino por la relación entre los datos.

##### 3.2 · Ahora tú

Recibes este contenido: «Cómo participar» contiene tres pasos que deben seguirse en orden. Completa los cuatro huecos sin añadir contenedores innecesarios:

```html
<_____>
  <h2>Cómo participar</h2>
  <_____>
    <li>Inscríbete</li>
    <li>Confirma tu correo</li>
    <li>Presenta tu entrada</li>
  </_____>
</_____>
```

Compara tu solución con la de un compañero y justificad el elemento exterior y el tipo de lista antes de verla resuelta.

<details class="aside aside--extra">
  <summary>Ver una solución razonada</summary>
  <p><code>&lt;section&gt;</code> agrupa un apartado temático con encabezado propio y <code>&lt;ol&gt;</code> expresa que los pasos tienen un orden. Las etiquetas de cierre corresponden a esos dos elementos.</p>
</details>

#### Paso 4 · Marca una página que nunca has visto · 60 min

Es el trabajo central de la sesión, y el primero en el que nadie te dice qué etiqueta usar.

Una asociación local necesita una página para anunciar una jornada de puertas abiertas. Solo recibes esta especificación:

* nombre de la jornada y una frase introductoria;
* enlaces a inicio, programa, ponentes y contacto;
* tres actividades, cada una con título, imagen, descripción y enlace para ampliar información;
* una lista ordenada con los pasos de inscripción;
* una pequeña comparativa de tres talleres con hora, duración y plazas;
* una acción para enviar la inscripción y un enlace para descargar las normas;
* información complementaria sobre accesibilidad del recinto;
* autoría y contacto de la asociación.

##### 4.1 · Primero el árbol, en papel

Dibuja el árbol del documento y anota al lado de cada región **qué relación expresa**. No escribas ni una etiqueta hasta tener el árbol entero.

##### 4.2 · Después el documento

Escribe el HTML completo. La página debe incluir navegación, una jerarquía de encabezados sin saltos, listas del tipo que corresponda, imágenes con alternativa adecuada a su función, una tabla pequeña, acciones y regiones semánticas.

##### 4.3 · El requisito que llega tarde

Cuando lo tengas terminado, aparece un requisito nuevo: **una de las tres actividades se cancela y hay que sustituirla por dos talleres cortos**. Aplícalo sin rehacer el documento y anota qué tuviste que tocar. Una estructura bien decidida absorbe un cambio así en pocos minutos; una decidida por el aspecto obliga a rehacer bloques enteros.

#### Paso 5 · Transfiérelo a tu proyecto · 25 min

Revisa ahora `productos.html`. Añade una comparativa real **solo si** sus valores necesitan fila y columna para entenderse. Si no existe ese cruce, usa la estructura adecuada y deja un comentario justificando por qué no has creado una tabla.

Aplica después a tu sitio la lección del paso 4: busca un bloque cuya estructura hayas elegido por cómo quedaba y reescríbelo por lo que significa.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. Los dos retos atacan los dos errores caros de esta sesión: convertir en tabla algo que no lo es, y dar por buena una cuadrícula que no cuadra.

##### Reto 1 · Solo uno de estos dos bloques es una tabla

```text
BLOQUE A · Tarifas de envío
                Península   Baleares   Canarias
Estándar        3,90 €      5,50 €     9,90 €
Urgente         7,90 €      12,00 €    18,50 €
Recogida        0,00 €      0,00 €     0,00 €

BLOQUE B · El equipo
Elena Ruiz. Dirección técnica. Trabaja en la empresa desde 2014 y coordina
el taller de reparaciones.
Marc Oliver. Atención al cliente. Gestiona las incidencias y el seguimiento
de los pedidos.
Nadia Franco. Logística. Responsable de almacén y de la relación con los
transportistas.
```

Marca los dos. Solo uno necesita `<table>`.

1. Identifica cuál y explica qué tienen sus datos que los del otro no tienen. La respuesta se formula con la palabra «coordenadas».
2. Marca el otro bloque con la estructura que sí le corresponde. Hay al menos dos opciones defendibles: elige una y argumenta por qué no la otra.
3. El bloque B **se puede** meter en una tabla de dos columnas, y se vería ordenado. Explica qué afirmación falsa estaría haciendo ese marcado sobre los datos.

##### Reto 2 · La cuadrícula que no cuadra

Esta tabla tiene tres errores de cuadrícula. Encuéntralos **sin abrir el navegador**, aplicando la suma por filas.

```html
<table>
  <caption>Ocupación de las aulas</caption>
  <thead>
    <tr>
      <th scope="col">Hora</th>
      <th scope="col">Aula 1</th>
      <th scope="col">Aula 2</th>
      <th scope="col">Aula 3</th>
      <th scope="col">Aula 4</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">09:00</th>
      <td>DAW1</td>
      <td colspan="2">Reunión de departamento</td>
      <td>ASIR2</td>
      <td>Libre</td>
    </tr>
    <tr>
      <th scope="row">10:00</th>
      <td rowspan="2">Examen DAW2</td>
      <td>DAW1</td>
      <td>Libre</td>
    </tr>
    <tr>
      <th scope="row">11:00</th>
      <td>ASIR1</td>
      <td>Libre</td>
      <td>DAW2</td>
      <td>Libre</td>
    </tr>
    <tr>
      <th scope="row">12:00</th>
      <td colspan="4">Claustro</td>
    </tr>
  </tbody>
</table>
```

Para cada error, escribe: en qué fila está, cuánto suma esa fila, cuánto debería sumar y cómo lo corriges. Después ábrelo en el navegador y comprueba si lo que dibuja coincide con lo que habías predicho.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las dos tablas construidas con <code>caption</code>, <code>scope</code> y las sumas cuadradas, y la página de la jornada completa y válida.</span></div>
  <div><strong>Si lo tienes</strong><span>El requisito tardío del paso 4.3 aplicado sin rehacer el documento, con la nota de qué hubo que tocar.</span></div>
  <div><strong>Reto</strong><span>Los dos bloques del reto 1 marcados y justificados, y los tres errores de cuadrícula localizados sin abrir el navegador.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Cada celda de datos se puede leer junto a los encabezados que la describen.</li>
    <li>Todas las filas de tus tablas suman el mismo número de columnas.</li>
    <li>Has convertido una especificación nueva en un árbol antes de escribir etiquetas.</li>
    <li>Puedes justificar navegación, jerarquía, listas, imágenes, tabla, acciones y regiones.</li>
    <li>Has aplicado un requisito nuevo sin rehacer el documento.</li>
    <li>Tu proyecto contiene una tabla únicamente si los datos realmente tienen dos coordenadas.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>th</code> y <code>td</code>?</li>
    <li>¿Por qué <code>caption</code> no se sustituye por un encabezado encima de la tabla?</li>
    <li>¿Qué hace exactamente <code>colspan="3"</code>?</li>
    <li>¿Cómo compruebas una tabla con celdas combinadas sin abrir el navegador?</li>
    <li>¿Qué pregunta haces antes de elegir una etiqueta?</li>
    <li>¿Qué diferencia una acción de un enlace?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>th</code> es una celda que encabeza a otras y les da significado; <code>td</code> es una celda de datos.</p>
  <p>2 · Porque <code>caption</code> está dentro de la tabla y queda asociado a ella; un encabezado suelto solo está cerca.</p>
  <p>3 · Que esa celda ocupe la posición de tres columnas de la cuadrícula.</p>
  <p>4 · Sumando por filas: cada celda cuenta su <code>colspan</code>, y todas las filas deben dar el mismo total.</p>
  <p>5 · Qué relación o significado expresa ese contenido; la etiqueta viene después.</p>
  <p>6 · La acción provoca un cambio y se marca como botón; el enlace lleva a otro destino.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 4 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Dibuja el árbol semántico de una noticia con navegación, imagen, datos relacionados y una acción.</li>
    <li>Escribe solo el bloque de datos usando una tabla accesible si corresponde.</li>
    <li>Justifica dos decisiones y cambia una cuando se modifica el requisito.</li>
  </ol>
</div>


---

## Sesión 5 · Formularios accesibles

<p class="lead">Tres horas. Media hora para entender qué une una etiqueta con su campo y qué valida el navegador por sí solo, y dos horas y media construyendo un formulario completo, auditando uno defectuoso y recorriéndolo todo sin ratón.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué une un <code>label</code> con su campo, en qué se diferencian <code>id</code> y <code>name</code>, qué te da gratis elegir bien el <code>type</code> y cómo se agrupan las opciones.</li>
    <li><strong>2. Haz:</strong> Construye el formulario de contacto en tres fases, audita uno defectuoso y revisa el de un compañero.</li>
    <li><strong>3. Comprueba:</strong> Recorre el formulario entero usando solo el teclado.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué pregunta permite decidir si unos datos necesitan una tabla?</li>
    <li>¿Qué elemento usarías para una acción y cuál para ir a otra página?</li>
    <li>Marca semánticamente: título, navegación, noticia independiente y lista de características.</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Un formulario es la parte de una web donde los errores de marcado dejan de ser teóricos: un campo mal etiquetado no es feo, es un campo que alguien no puede rellenar. Casi todo lo de hoy se comprueba soltando el ratón.

#### El formulario mínimo

```html
<form>
    <label for="nombre">Nombre</label>

    <input id="nombre" name="nombre" type="text">

    <button type="submit">Enviar</button>
</form>
```

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>Etiqueta, campo y acción</strong></figcaption>
  <div class="lesson-demo__stage">
    <div class="lesson-demo-form" role="img" aria-label="Representación visual de un formulario con una etiqueta Nombre, un campo de texto y un botón Enviar">
      <span class="lesson-demo-form__label">Nombre</span>
      <span class="lesson-demo-form__input" aria-hidden="true"></span>
      <span class="lesson-demo-form__button">Enviar</span>
    </div>
  </div>
  <p class="lesson-demo__note">Esta vista es ilustrativa. Al ejecutar el código real, pulsar «Nombre» lleva el foco al campo porque el <code>for</code> del <code>label</code> coincide con su <code>id</code>.</p>
</figure>

Tres piezas: el contenedor `form`, los controles, y el botón que lo envía. Lo que casi siempre se hace mal es la relación entre cada campo y su etiqueta.

#### La etiqueta pertenece al campo

<p class="term">Etiqueta asociada</p>

Un `<label for="x">` unido a un `<input id="x">`. El texto no queda simplemente situado junto al campo, sino que **pertenece** a él.

Qué se gana asociándola:

1. Un lector de pantalla anuncia el campo con su nombre. Sin `label`, anuncia «campo de texto» y nada más.
2. El área de clic crece: pulsar sobre el texto lleva el cursor al campo. Importa mucho en pantallas pequeñas y en casillas de verificación.
3. El navegador puede autocompletar mejor.

<div class="rule">
  <p class="rule-label">El <code>placeholder</code> no es una etiqueta</p>
  <p>El texto gris dentro de un campo <strong>desaparece en cuanto empiezas a escribir</strong>. Quien interrumpe la cumplimentación de un formulario largo encuentra un campo relleno sin indicación de qué contenía. Quien emplea un lector de pantalla puede no oírlo nunca.</p>
  <p>Sirve para dar un ejemplo de formato <em>junto a</em> una etiqueta —<code>placeholder="nombre@example.com"</code>—, nunca para sustituirla.</p>
</div>

#### `id` y `name` no son lo mismo

```html
<input id="nombre" name="nombre">
```

Se escriben casi siempre iguales, y por eso se confunden.

| Atributo | Para quién es | Qué hace |
| -------- | ------------- | -------- |
| `id` | Para el documento | Identifica el campo dentro de la página; es a lo que apunta el `for` |
| `name` | Para el servidor | Es el nombre con el que el dato viaja al enviarse |

Un campo sin `name` se rellena perfectamente y **su dato no llega a ninguna parte**. Cuando estudies servidores verás por qué.

El botón que envía es un `<button type="submit">`. No conviertas un texto o una imagen en un falso botón: un `<div>` no se alcanza con `Tab`, no se activa con `Enter` y no se anuncia como botón.

#### El tipo no es cosmético

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

Ese teclado adaptado determina la diferencia entre completar un formulario con comodidad en el móvil y abandonarlo, de modo que no constituye un detalle menor.

#### Validación nativa

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
  <p class="rule-label">La pregunta antes de escribir JavaScript</p>
  <p>Antes de programar una validación, pregúntate: <strong>¿HTML ya sabe hacerlo?</strong> Muchas veces sí, y la versión nativa funciona mejor, es más accesible y no hay que mantenerla.</p>
</div>

<div class="rule">
  <p class="rule-label">Validar en el navegador no es validar</p>
  <p>Todo esto se puede desactivar: basta con enviar la petición sin pasar por el formulario. La validación nativa está para <strong>ayudar a quien rellena</strong>, avisándole antes de enviar y sin recargar la página.</p>
  <p>La comprobación que de verdad protege los datos se hace <strong>en el servidor</strong>, y la verás en otro módulo. Las dos son necesarias y no se sustituyen.</p>
</div>

#### Agrupar opciones

La exclusión mutua entre botones de opción la produce **compartir exactamente el mismo `name`**, no el `fieldset`. Si puedes marcar los dos a la vez, tienen `name` distinto.

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

Fíjate también en otra forma de asociar la etiqueta: aquí el `input` está **dentro** del `label`, y entonces no hace falta `for`. Las dos formas son válidas.

Cuando se pueden elegir varias, la casilla comparte `name` y se distingue por su `value`:

```html
<fieldset>
    <legend>¿Qué tecnologías conoces?</legend>

    <label><input type="checkbox" name="tec" value="html"> HTML</label>
    <label><input type="checkbox" name="tec" value="css"> CSS</label>
    <label><input type="checkbox" name="tec" value="js"> JavaScript</label>
</fieldset>
```

`fieldset` y `legend` agrupan controles que forman una misma pregunta y le ponen nombre al grupo. En un formulario de tres campos sobran; en uno de quince son lo que lo hace navegable, porque cada campo se anuncia precedido del nombre de su grupo. En los botones de opción no resultan prescindibles en la práctica: el `legend` es lo único que indica **sobre qué** se está eligiendo.

#### Los seis fallos de siempre

Antes de mirar código, una prueba que dura treinta segundos y sirve para cualquier web: **suelta el ratón**. Recorre el formulario con `Tab`, cambia de opción con las flechas, envía con `Enter`. Si no sabes dónde está el foco, o hay algo que no puedes alcanzar, ese formulario está roto para todo el que no use un ratón.

| Fallo | Consecuencia |
| ----- | ------------ |
| Campos sin `label` asociado | Se anuncian como «campo de texto», sin nombre |
| `placeholder` usado como etiqueta | La indicación desaparece al escribir |
| `type="text"` para correos, números o fechas | Sin validación ni teclado adaptado |
| Campos sin `name` | El dato no llega al servidor aunque se rellene |
| `<div onclick>` como botón de enviar | No se alcanza con `Tab` ni se activa con `Enter` |
| `<br>` para separar los campos | El formulario no tiene estructura, solo saltos de línea |

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto y sobre código ajeno</p>

El formulario de contacto se construye en tres fases y cada una se comprueba antes de seguir. Los tres últimos pasos lo someten a la prueba del teclado, a un caso defectuoso y a la mirada de otra persona.

#### Paso 1 · Fase A · El formulario base · 25 min

En `contacto.html`, escribe un formulario con:

* Nombre completo.
* Correo electrónico.
* Asunto.
* Mensaje, con `<textarea rows="6">`.
* Botón de envío.

Cada campo con su `id` y su `name`, y cada `label` con su `for`.

**Comprobación inmediata:** haz clic sobre el *texto* de cada etiqueta, no sobre el campo. Si el cursor se desplaza al campo correspondiente, la asociación es correcta. Si no se produce ningún efecto, ese `for` no coincide con ningún `id`.

<details class="aside aside--extra">
<summary>Consultar · <code>textarea</code> y <code>select</code></summary>

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

</details>

#### Paso 2 · Fase B · Tipos y validación · 30 min

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

#### Paso 3 · Fase C · Grupos de controles · 30 min

Termina tu formulario con:

6. Dos botones de opción que compartan `name`, dentro de un `fieldset` con su `legend`.
7. Un grupo de casillas para selección múltiple.
8. Una casilla obligatoria de aceptación de condiciones.
9. Dos `fieldset` que separen los datos personales de los de la consulta.

```html
<label>
    <input type="checkbox" name="condiciones" required>
    Acepto las condiciones
</label>
```

Añade además el autocompletado a los campos que lo admiten. Cuesta un atributo y ahorra bastante escritura a quien usa tu web:

```html
<input type="text"  name="nombre" autocomplete="name">
<input type="email" name="email"  autocomplete="email">
```

<details class="aside aside--help">
  <summary>Estoy atascado · los radio no funcionan como espero</summary>
  <p>Si puedes marcar los dos a la vez, es que tienen <code>name</code> distinto. Lo que agrupa unos botones de opción es <strong>compartir exactamente el mismo <code>name</code></strong>, y no el <code>fieldset</code>. Lo que sí debe ser distinto en cada uno es el <code>value</code>, que es el dato que se envía, y el <code>id</code> si los asocias con <code>for</code>.</p>
</details>

#### Paso 4 · La prueba del teclado sobre tu formulario · 15 min

Suelta el ratón y recorre tu formulario entero. Anota las respuestas:

1. ¿Puedes alcanzar **todos** los controles con `Tab`, incluido el botón de envío?
2. ¿Sabes en todo momento dónde está el foco, sin adivinarlo?
3. ¿El orden en que los recorres es el mismo en que se leen?
4. ¿Puedes cambiar de opción en los radios con las flechas?
5. ¿Puedes enviar con `Enter` sin tocar el ratón?

Cualquier «no» es un defecto que corregir ahora, no una preferencia. Escribe en un comentario qué encontraste y qué cambiaste.

#### Paso 5 · El formulario defectuoso · 30 min

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

##### 5.1 · Ejemplo resuelto

<dl class="worked">
  <dt>Fallo</dt>
  <dd>El texto «Nombre:» está suelto delante del campo, no es un <code>&lt;label&gt;</code>.</dd>
  <dt>¿Por qué importa, si se lee igual?</dt>
  <dd>Se lee igual para quien ve la pantalla. Para un lector de pantalla no existe ninguna relación entre ese texto y ese campo: anunciará «campo de texto» y habrá que adivinar cuál es.</dd>
  <dt>Corrección</dt>
  <dd><code>&lt;label for="nombre"&gt;Nombre&lt;/label&gt;</code> y <code>&lt;input type="text" id="nombre" name="nombre"&gt;</code>.</dd>
</dl>

##### 5.2 · Ahora tú

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

#### Paso 6 · Revisión cruzada de formularios · 20 min

Intercambia tu `contacto.html` con un compañero y audita el suyo **sin tocarlo**, solo con el navegador y el teclado:

| Comprobación | Resultado | Qué falta |
| ------------ | --------- | --------- |
| Pulsar el texto de cada etiqueta lleva el foco a su campo | | |
| Todos los campos tienen `name` | | |
| Cada campo usa el `type` que le corresponde | | |
| El formulario se recorre entero con `Tab` | | |
| Los radios se agrupan con el mismo `name` y tienen `legend` | | |
| El envío es un `button` y funciona con `Enter` | | |

Devuelve la tabla a su autor. El autor decide qué acepta, y justifica lo que rechace.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los seis pasos. Los dos retos trabajan con formularios que no has diseñado tú, que es donde `fieldset` y `legend` dejan de ser adorno.

##### Reto 1 · Un formulario de quince campos

Una escuela de música necesita el formulario de inscripción al curso. Solo recibes la lista de datos, sin ningún orden pensado:

```text
Nombre del alumno
Apellidos del alumno
Fecha de nacimiento
Correo de contacto
Teléfono de contacto
Nombre del padre, madre o tutor (solo si el alumno es menor)
Instrumento principal
Nivel declarado: iniciación, medio o avanzado
Años de estudio previos
¿Dispone de instrumento propio?
Días preferidos: lunes, martes, miércoles, jueves, viernes
Franja horaria preferida: mañana o tarde
¿Autoriza el uso de imágenes en redes de la escuela?
Observaciones
Aceptación de las condiciones de matrícula
```

1. **Agrúpalos en `fieldset`.** Decide cuántos grupos hacen falta y qué `legend` lleva cada uno. No hay un número correcto, pero sí hay agrupaciones que no se sostienen: tienes que poder decir qué pregunta responde cada grupo.
2. **Elige el `type` de cada campo.** Tres de ellos admiten más de una solución razonable: identifícalos y justifica la que eliges.
3. **Decide cuáles son `required`.** Un formulario que lo exige todo obliga a inventar datos; uno que no exige nada llega vacío. Justifica por escrito los que dejas opcionales.
4. **Resuelve el campo condicional.** El nombre del tutor solo se pide si el alumno es menor. Con lo que sabes de HTML no puedes ocultarlo ni mostrarlo, así que decide cómo lo planteas de forma que se entienda igual, y anota qué harías cuando sepas JavaScript.

Escríbelo entero y pásale la prueba del teclado. Con quince campos notarás por primera vez para qué sirve de verdad un `legend`.

##### Reto 2 · Un formulario en producción, sin ratón

Busca un formulario real de registro o de compra y recórrelo **solo con el teclado**, sin enviarlo.

1. ¿Puedes alcanzar todos los controles con `Tab`?
2. ¿Se ve siempre dónde está el foco?
3. ¿Los campos tienen etiqueta asociada, o solo `placeholder`? Compruébalo pulsando sobre el texto de la etiqueta.
4. ¿Qué ocurre si lo envías vacío? ¿El mensaje de error dice qué campo falla, o solo que «hay errores»?
5. ¿Hay algún campo cuyo `type` esté mal elegido? Búscalo abriendo un teclado de móvil, o mirando el código con el inspector.

Escribe los tres defectos más graves que encuentres y, para cada uno, la corrección concreta en una línea de HTML. Es un sitio profesional, con equipo detrás: encontrar tres fallos es lo normal, y ese es el dato interesante de este reto.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Formulario completo, etiquetado, con los tipos correctos y recorrible entero con teclado.</span></div>
  <div><strong>Si lo tienes</strong><span>Los seis fallos del formulario defectuoso enumerados y corregidos, y la revisión cruzada contestada.</span></div>
  <div><strong>Reto</strong><span>El formulario de quince campos agrupado y justificado, y los tres defectos de un formulario en producción con su corrección.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Tu formulario se recorre entero con <code>Tab</code>, en un orden que tiene sentido.</li>
    <li>Todos los campos tienen <code>label</code> asociado, <code>id</code> y <code>name</code>.</li>
    <li>Cada campo usa el <code>type</code> que le corresponde.</li>
    <li>Los botones de opción comparten <code>name</code> y están dentro de un <code>fieldset</code> con <code>legend</code>.</li>
    <li>El botón de envío es un <code>&lt;button&gt;</code>.</li>
    <li>El formulario defectuoso está corregido y la revisión cruzada, devuelta.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>id</code> y <code>name</code>?</li>
    <li>¿Por qué un <code>placeholder</code> no sustituye a un <code>label</code>?</li>
    <li>Nombra dos cosas que da <code>type="email"</code> y no da <code>type="text"</code>.</li>
    <li>¿Por qué la validación nativa no sustituye a la del servidor?</li>
    <li>¿Qué hace que dos botones de opción sean excluyentes?</li>
    <li>¿En qué consiste la prueba del teclado y qué detecta?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>id</code> identifica el campo dentro del documento y es a lo que apunta el <code>for</code>; <code>name</code> es el nombre con el que el dato se envía al servidor.</p>
  <p>2 · Porque desaparece al escribir y deja el campo sin identificar.</p>
  <p>3 · Comprueba el formato del correo y ofrece un teclado adaptado en el móvil.</p>
  <p>4 · Porque se ejecuta en el navegador y se puede saltar enviando la petición directamente. Ayuda a quien rellena; no protege los datos.</p>
  <p>5 · Compartir el mismo atributo <code>name</code>.</p>
  <p>6 · Recorrer el formulario sin ratón, solo con <code>Tab</code>, flechas y <code>Enter</code>. Detecta elementos inalcanzables, foco invisible y falsos botones.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 5 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Escribe un campo de correo con <code>label</code>, <code>id</code>, <code>name</code> y validación nativa.</li>
    <li>Explica qué hace que tres radios sean mutuamente excluyentes.</li>
    <li>Detecta dos fallos: <code>&lt;label&gt;Edad&lt;/label&gt;&lt;input type="text" required&gt;</code>.</li>
  </ol>
</div>


---

## Sesión 6 · Depuración, validación y coevaluación

<p class="lead">Tres horas. Media hora para entender qué ve cada herramienta de comprobación y qué no ve ninguna, y dos horas y media diagnosticando un documento roto, cerrando tu proyecto y auditando el de otra persona.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Que casi toda la accesibilidad sale de usar bien HTML, por qué ARIA no es el punto de partida, y por qué un documento válido puede seguir estando mal.</li>
    <li><strong>2. Haz:</strong> Recorre tu sitio sin ratón, repara los veinte fallos de un documento forense, pasa la lista de comprobación final y audita el proyecto de un compañero.</li>
    <li><strong>3. Entrega:</strong> El sitio validado, la tabla forense, la matriz de coevaluación y tus decisiones.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué comparten los botones de opción que pertenecen al mismo grupo?</li>
    <li>¿Qué aportan <code>fieldset</code> y <code>legend</code>?</li>
    <li>Detecta dos fallos en un formulario con campos sin <code>label</code> y varios radios con nombres distintos.</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

La unidad cierra donde empezó: una página que se ve bien no demuestra nada. Hoy se añaden las herramientas que sí dictaminan, y se delimita con precisión lo que ninguna de ellas puede ver.

#### Una web no se hace solo para nosotros

Una web no debería funcionar únicamente para una persona que ve perfectamente, usa ratón, tiene una pantalla grande y navega exactamente como nosotros.

La buena noticia es que **HTML bien utilizado proporciona buena parte de la accesibilidad automáticamente**. No constituye una capa que se incorpore al final, sino el resultado del trabajo de toda la unidad:

1. **Usa el elemento correcto.** `<button>Comprar</button>` es mejor punto de partida que `<div>Comprar</div>` si representa una acción.
2. **Mantén una jerarquía lógica** de encabezados, sin saltos. Es el índice por el que se navega:

```text
h1
    h2
        h3
    h2
```

3. **Describe las imágenes** con un `alt` informativo, funcional o vacío según su función. Nunca ausente.
4. **Etiqueta los formularios** con `label` asociado, no solo con `placeholder`.
5. **Usa HTML semántico:** `nav`, `main`, `header`, `footer`, `section` y `article` permiten recorrer el documento por zonas.

#### ARIA no es el punto de partida

Encontrarás código como este:

```html
<div role="button" tabindex="0">Guardar</div>
```

<p class="term">ARIA</p>

Un conjunto de atributos para describir el papel, el estado y las propiedades de un elemento cuando HTML no llega. Puede ser necesaria en componentes complejos.

No debe emplearse, sin embargo, para reconstruir manualmente algo que HTML ya proporciona. Ese `div` con `role="button"` necesita además que le programes la activación con `Enter` y con espacio, el foco, y el estado. Un `<button>` trae todo eso.

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

#### Volvemos a la frase de la sesión 1

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

Ante cada aviso de HTMLHint, tres preguntas: qué elemento lo provoca, qué regla se incumple y cómo debería solucionarse. El flujo completo de depuración es este:

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

#### Válido no significa correcto

| Un validador detecta | Un validador no detecta |
| -------------------- | ----------------------- |
| Etiquetas sin cerrar o mal anidadas | Que hayas usado `div` donde tocaba `nav` |
| Atributos que no existen | Que un `alt` diga «foto» en lugar de describir algo |
| `id` duplicados | Que hayas saltado de `h1` a `h4` |
| Anidaciones prohibidas | Que un catálogo esté marcado como tabla |

Un documento entero hecho de `<div>`, sin un solo encabezado y con todas las imágenes con `alt="foto"`, pasa el validador con cero errores. Es válido y es malo. **La validez es el suelo, no el techo.**

#### Revisar código ajeno

Una revisión útil no dice «está mal». Dice tres cosas: **qué**, **por qué** y **qué harías tú**.

| En vez de escribir | Escribe |
| ------------------ | ------- |
| «La tabla está mal» | «Faltan los `scope` en los `th`: sin ellos cada celda se anuncia sin su encabezado. Añadiría `scope="col"` arriba y `scope="row"` en la primera columna» |
| «Los alt no valen» | «El `alt` del gráfico dice “gráfico”: quien no lo vea pierde los datos. Pondría los tres valores que compara» |

Una regla mantiene su validez durante toda la vida profesional: **se revisa el código, no a la persona**. «Este enlace apunta a tu disco» y «no sabes hacer enlaces» describen el mismo hecho, y solo uno sirve para algo.

### Se trabaja

<p class="stage stage--guided">150 minutos · diagnóstico, cierre del proyecto y revisión por pares</p>

Los dos primeros pasos diagnostican: primero tu sitio sin ratón, después un documento roto a propósito. Los tres últimos cierran la unidad.

#### Paso 1 · La prueba del teclado sobre tu sitio · 20 min

Suelta el ratón. Recorre tus cuatro páginas usando solo:

```text
Tab          avanzar
Shift + Tab  retroceder
Enter        activar
Espacio      marcar casillas y pulsar botones
```

Responde a continuación:

| Pregunta | Página donde falla |
| -------- | ------------------ |
| ¿Puedes alcanzar todas las partes interactivas? | |
| ¿Sabes en todo momento dónde está el foco? | |
| ¿El orden de recorrido tiene sentido? | |
| ¿Puedes enviar el formulario sin tocar el ratón? | |
| ¿Puedes saltar el menú para ir al contenido? | |

Corrige lo que encuentres. Casi todo se arregla cambiando un elemento por el que tocaba.

#### Paso 2 · HTML forense · 45 min

Es el trabajo central de la sesión. Este documento contiene **veinte fallos deliberados**. Cópialo en `forense.html`:

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

Tu trabajo, en este orden:

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
    <li>El esqueleto: ¿están las cinco piezas de la sesión 1?</li>
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

#### Paso 3 · La lista de comprobación final · 30 min

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

Antes de recorrer la lista, formatea las cuatro páginas con `Shift + Alt + F`, o desde la paleta con `Format Document`. Las dos versiones siguientes son idénticas para el navegador, y solo una es legible para una persona:

```html
<main><section><h2>Productos</h2><p>Texto</p></section></main>
```

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

**El código también se escribe para personas:** para tu compañero de revisión, para el profesor y para ti dentro de tres semanas.

Recorre después la lista entera. Cada línea que no puedas marcar es trabajo pendiente de hoy.

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

#### Paso 4 · Matriz de coevaluación · 30 min

Intercambia el proyecto con otro alumno y audita el suyo con el formato qué / por qué / qué harías:

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

#### Paso 5 · Cerrar la entrega · 25 min

Se entrega:

* **A · El sitio.** Cuatro páginas enlazadas, sin CSS, validadas en el W3C.
* **B · La tabla forense** del paso 2, con las correcciones justificadas.
* **C · La matriz de coevaluación** del proyecto de tu compañero.
* **D · Tus decisiones**, en media página: las tres decisiones de estructura de las que estás más seguro, y por qué.

Tu proyecto debe incluir, cuando tenga sentido en tu tema: estructura completa y metadatos, navegación entre páginas, jerarquía de encabezados, párrafos y elementos de énfasis, los tres tipos de lista, enlaces internos y externos, imágenes con `figure`, estructura semántica, una tabla de datos, un formulario completo con varios tipos de campo y validación, y algún elemento moderno como `details` o `time`.

Dedica los últimos minutos a preparar la defensa. Dispones de unos **3 minutos** y respondes a cuatro preguntas:

* ¿Qué parte de tu estructura te costó más decidir y cómo la resolviste?
* Enseña un sitio donde estuviste tentado de usar un `div` y no lo hiciste.
* ¿Qué fallo encontraste en el proyecto de tu compañero que también tenías tú?
* Si mañana llega el CSS, ¿qué parte de tu HTML tendrías que tocar? *(La respuesta correcta es «ninguna».)*

| Criterio de evaluación | Puntos |
| ------------------------------------------------- | -----: |
| Estructura y validez del documento | 2 |
| Jerarquía de encabezados y semántica estructural | 2 |
| Navegación y rutas relativas | 1,5 |
| Formulario accesible y validado | 1,5 |
| Imágenes y textos alternativos | 1 |
| Tablas accesibles | 1 |
| Auditoría forense y justificación de correcciones | 1 |

Durante la defensa se preguntará por **una decisión concreta** de tu proyecto. No se evalúa que hayas usado muchas etiquetas distintas, sino que sepas decir por qué elegiste cada una. Un sitio sencillo y bien justificado vale más que uno lleno de elementos puestos por si acaso.

#### Ampliación si has completado el trabajo

Primero termina la entrega. Los dos retos invierten el ejercicio de la sesión: en lugar de encontrar fallos ajenos, se trata de fabricarlos y de medir cuántos deja pasar una herramienta.

##### Reto 1 · Fabrica tu propio documento forense

Parte de una copia limpia de una de tus páginas e introduce **ocho fallos deliberados**, repartidos así:

* dos que el validador del W3C detecte sin ninguna duda;
* dos que detecte HTMLHint mientras se escribe;
* dos que no detecte ninguna herramienta y solo se vean leyendo el significado;
* dos que solo se manifiesten al recorrer la página con el teclado.

Guarda aparte la solución, con la categoría de cada fallo. Entrégale el documento a un compañero y quédate con el suyo. Al devolvérselo, comparad dos cifras: cuántos encontró y **en qué categoría** se le escaparon. Casi siempre son las dos últimas, y esa es la conclusión de la unidad entera.

##### Reto 2 · Cuántos errores tiene una web que usas todos los días

Pasa por `validator.w3.org` la portada de tres sitios conocidos, usando la opción de validar por dirección.

| Sitio | Errores | Avisos | El error más repetido |
| ----- | ------: | -----: | --------------------- |
| | | | |
| | | | |
| | | | |

Después responde:

1. ¿Alguno da cero errores? ¿Cuántos pasan de cincuenta?
2. Elige el error más repetido de uno de ellos y explica qué consecuencia real tiene, o si no tiene ninguna.
3. Busca en esos mismos sitios **un fallo que el validador no señale** y que tú sí sepas ver: un salto de encabezado, un falso botón, un `alt` inútil.
4. Las tres páginas funcionan y las usan millones de personas. Formula en dos líneas qué conclusión sacas sobre la relación entre validez, calidad y funcionamiento.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Quince de los veinte fallos documentados con herramienta, impacto y corrección, y la lista de comprobación final recorrida entera.</span></div>
  <div><strong>Si lo tienes</strong><span>Los veinte localizados y clasificados en sintaxis, semántica y accesibilidad, y la matriz de coevaluación devuelta y contestada.</span></div>
  <div><strong>Reto</strong><span>El documento forense propio con sus ocho fallos por categoría, y la tabla de validación de tres webs reales con su conclusión.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la entrega</p>
  <ul class="checklist">
    <li>Las cuatro páginas validan y no contienen un solo estilo.</li>
    <li>El sitio entero se recorre con teclado y siempre se ve dónde está el foco.</li>
    <li>La tabla forense está entregada y justificada.</li>
    <li>Has revisado el proyecto de un compañero con el formato qué / por qué / qué harías.</li>
    <li>Has decidido qué observaciones de tu revisor aceptas y cuáles no, y por qué.</li>
    <li>Puedes justificar cualquier decisión de estructura de tu sitio.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>Nombra tres cosas de accesibilidad que salen gratis de usar bien HTML.</li>
    <li>¿Por qué <code>&lt;div role="button"&gt;</code> es peor que <code>&lt;button&gt;</code>?</li>
    <li>¿Cuándo tiene sentido usar ARIA?</li>
    <li>Nombra dos fallos graves que un validador no detecta.</li>
    <li>¿Por qué «válido» no es lo mismo que «correcto»?</li>
    <li>¿Qué pasos tiene el flujo de depuración, y cuál es el que no se puede saltar?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Por ejemplo: navegación por encabezados, salto entre zonas con los landmarks, botones alcanzables con teclado, campos anunciados por su etiqueta, imágenes sustituidas por su <code>alt</code>. Bastan tres.</p>
  <p>2 · Porque hay que reconstruir a mano el foco, la activación con teclado y el estado, y cualquiera de esas piezas se puede olvidar. El <code>button</code> las trae todas.</p>
  <p>3 · Cuando construyes un componente para el que HTML no tiene un elemento equivalente. Nunca para sustituir uno que sí existe.</p>
  <p>4 · Por ejemplo, usar <code>div</code> donde tocaba un elemento semántico, o un <code>alt</code> que no describe nada.</p>
  <p>5 · Porque la validez comprueba la sintaxis, no el significado.</p>
  <p>6 · Escribir, previsualizar, revisar Problems, validar, entender y corregir. El que no se puede saltar es <strong>entender</strong>.</p>
</details>

<div class="rule">
  <p class="rule-label">Demostración final · el HTML ya está preparado para CSS</p>
  <p>Observa tu estructura final con tres estilos muy diferentes. Predice qué partes de HTML no deberían tocarse en la UD2 y señala cualquier elemento que todavía dependa de su apariencia.</p>
</div>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 6 · 10 minutos</p>
  <p>Individual, sin IA y sin apuntes. Recibes una página breve que nunca has visto.</p>
  <ol>
    <li>Localiza un error de sintaxis, uno de semántica y uno de accesibilidad.</li>
    <li>Corrige solo lo imprescindible y explica el orden de diagnóstico.</li>
    <li>Realiza un cambio nuevo solicitado sin consultar tu proyecto.</li>
  </ol>
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

El trabajo de estas seis semanas demuestra aquí su utilidad: sobre una estructura semántica, dar estilo se reduce a escribir selectores. Sobre una sopa de `div`, es cuestión de adivinar cuál era cuál.


---
title: "HTML: estructura y contenido de la Web"
label: "UD1 · Guía y taller práctico"
section: "ud-01"
order: 1
lang: "es"
summary: "Taller práctico de 18 sesiones orientado a la construcción acumulativa de un sitio web multipágina. Aprende HTML estructurando documentos reales, refactorizando código defectuoso, resolviendo problemas de rutas y semántica, diseñando formularios accesibles y realizando auditorías forenses y revisiones por pares."
duration: "18 sesiones · 6 semanas"
modality: "Individual y parejas"
deliverable: "Sitio web multipágina (mínimo 4 páginas interconectadas) construido con HTML semántico válido, auditado con HTMLHint/W3C y revisado por pares."
outcomes:
  - "Configurar un entorno de desarrollo profesional en VS Code con extensiones de calidad (HTMLHint)."
  - "Estructurar documentos HTML5 válidos con metadatos indispensables (charset, viewport, title, lang)."
  - "Organizar contenidos con jerarquías lógicas de encabezados, listas y rutas relativas transportables."
  - "Aplicar etiquetas semánticas estructurales (header, nav, main, section, article, footer) y evitar el div soup."
  - "Diseñar tablas semánticas para datos tabulares con caption, thead, tbody y atributos scope."
  - "Construir formularios interactivos y accesibles con vinculación label-input y validación nativa."
  - "Auditar, depurar y corregir documentos HTML rotos mediante inspección forense y validadores W3C."
  - "Revisar código ajeno mediante matrices de coevaluación y defender las decisiones de diseño estructural."
requirements:
  - "Visual Studio Code con la extensión HTMLHint instalada."
  - "Navegador web moderno con DevTools (Chrome, Firefox, Edge)."
  - "Validador HTML oficial del W3C (validator.w3.org)."
  - "Carpeta de trabajo local para el proyecto web."
priorKnowledge:
  - "Manejo básico del sistema de archivos (crear carpetas, guardar y mover ficheros)."
date: "2026-08-30"
---

## ¿Cómo está diseñada esta unidad?

El aprendizaje de HTML no consiste en memorizar un catálogo de cien etiquetas, sino en **aprender a tomar decisiones sobre el significado y la estructura de la información**.

Por eso, esta unidad de 18 sesiones (6 semanas a razón de 3 horas semanales) sigue una metodología estrictamente práctica:

```text
30–45 min               60 min                    60–90 min
[ Demostración / Claves ] ──► [ Práctica guiada / Retos ] ──► [ Tarea acumulativa del proyecto ]
```

A lo largo de las 6 semanas construirás progresivamente tu propio sitio web multipágina (mínimo 4 páginas interconectadas), mientras resuelves ejercicios de depuración forense, refactorización de código real y auditorías cruzadas.

---

## Plan de trabajo semanal

| Semana | Bloque temático | Práctica central y entregable semanal | Horas |
| :---: | :--- | :--- | :---: |
| **Semana 1** | VS Code + Primeros documentos HTML | Entorno, depuración de HTML roto e `index.html` inicial | 3 h |
| **Semana 2** | Texto, listas, rutas y navegación | Laberinto de rutas relativas y sitio multipágina enlazado | 3 h |
| **Semana 3** | Imágenes y HTML semántico | Criterio `alt`, refactorización de *div soup* y auditoría web | 3 h |
| **Semana 4** | Tablas para datos tabulares | Tabla comparativa accesible con `scope` y matriz de idoneidad | 3 h |
| **Semana 5** | Formularios accesibles y progresivos | Formulario comercial con validación nativa y auditoría | 3 h |
| **Semana 6** | Depuración, auditoría y coevaluación | HTML forense (20 fallos), auditoría W3C y revisión por pares | 3 h |
| **Total** | | **Sitio web multipágina validado y revisado** | **18 h** |

---

## Semana 1 · VS Code y primeros documentos

---

## Sesión 1 · Conociendo Visual Studio Code y el explorador de proyectos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> El entorno de trabajo profesional: apertura de carpetas de proyecto, explorador, Command Palette (`Ctrl + Shift + P`) y panel de problemas (`Ctrl + Shift + M`).</li>
    <li><strong>2. Haz (60 min):</strong> Instala la extensión **HTMLHint** y realiza la **Tarea 1 · Reconstruye este documento** partiendo de texto sin formato.</li>
    <li><strong>3. Comprueba (30 min):</strong> Verifica que el documento se visualiza en el navegador y no genera advertencias en HTMLHint.</li>
  </ol>
</div>

### Entorno de trabajo

En desarrollo profesional no trabajamos con archivos sueltos dispersos en el escritorio: trabajamos con **carpetas de proyecto**.

1. Crea en tu equipo una carpeta llamada `mi-primera-web`.
2. Abre VS Code y ve a `File → Open Folder` (Archivo → Abrir carpeta).
3. Abre el panel de extensiones (`Ctrl + Shift + X`), busca **HTMLHint** e instálala.

### Tarea 1 · Reconstruye este documento

A continuación se muestra el resultado que debe verse en el navegador:

```text
Marc Semper
Desarrollo de Aplicaciones Web
Primer curso

Bienvenido a mi primera página web. Estoy aprendiendo a estructurar documentos utilizando HTML5 estándar.
```

**Tu misión:** Crea `index.html` y escribe el código HTML mínimo necesario para representar esta información con un encabezado principal, un subtítulo o encabezado secundario, un párrafo y texto en negrita o énfasis donde tenga sentido.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué debemos abrir la carpeta entera en VS Code y no archivos sueltos?</li>
    <li>¿Qué atajo de teclado abre la Command Palette?</li>
    <li>¿Para qué sirve la extensión HTMLHint?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para que el editor entienda la raíz del proyecto, resuelva rutas relativas y gestione extensiones sobre todos los archivos del sitio.</p>
  <p>2 · <code>Ctrl + Shift + P</code> (o <code>Cmd + Shift + P</code> en macOS).</p>
  <p>3 · Para analizar el código HTML en tiempo real y avisar de etiquetas sin cerrar, atributos no válidos y malas prácticas.</p>
</details>

---

## Sesión 2 · Anatomía de HTML y práctica del HTML roto

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Anatomía de un elemento HTML: etiqueta de apertura, contenido, etiqueta de cierre, anidación y atributos.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 2 · HTML roto**: diagnostica un archivo defectuoso, repara sus fallos con ayuda de HTMLHint y justifica cada corrección.</li>
    <li><strong>3. Comprueba (30 min):</strong> Comprueba que el panel *Problems* queda en 0 errores.</li>
  </ol>
</div>

### Anatomía de un elemento

```html
<p class="destacado">Texto con <strong>énfasis</strong>.</p>
```

* `<p class="destacado">`: etiqueta de apertura con atributo `class` y valor `"destacado"`.
* `Texto con <strong>énfasis</strong>.`: contenido que contiene otro elemento anidado.
* `</p>`: etiqueta de cierre obligatoria.

### Tarea 2 · HTML roto

Copia el siguiente fragmento en un archivo de prueba `roto.html`:

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

**Tu trabajo:**
1. Abre el panel *Problems* (`Ctrl + Shift + M`) y observa qué detecta HTMLHint.
2. Añade `<!doctype html>`, el atributo `lang="es"`, el `charset UTF-8`, el viewport y cierra todas las etiquetas que faltan.
3. Escribe en un breve comentario al final del archivo qué tres problemas graves tenía el código original.

---

## Sesión 3 · Estructura completa y primera página del proyecto

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Los metadatos indispensables del `<head>` (`charset`, viewport, `<title>`) y su impacto en accesibilidad y móviles.</li>
    <li><strong>2. Haz (60 min):</strong> Inicia el proyecto de la unidad creando la carpeta `mi-web/` con su `index.html` estructurado y resuelve el **Reto 1**.</li>
    <li><strong>3. Comprueba (30 min):</strong> Inspecciona la página con DevTools (`F12`) y verifica que los acentos y caracteres especiales se muestran sin fallos de codificación.</li>
  </ol>
</div>

### Estructura base de cualquier página web moderna

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

### Proyecto de la unidad · Inicio de `index.html`

Crea la carpeta de tu proyecto definitivo (por ejemplo `pixelstore` o la temática que hayas acordado con el profesor) y construye la portada `index.html` con:
* Estructura HTML5 completa y metadatos válidos.
* Un único `<h1>` con el nombre del proyecto.
* Al menos tres `<h2>` que dividan el contenido en áreas temáticas.
* Párrafos descriptivos y uso semántico de `<strong>` y `<em>`.

### Reto 1 · Módulos de DAW (15 min)

Construye la siguiente estructura utilizando el **menor HTML razonable y semánticamente correcto**:

```text
DAW
 ├ Lenguajes de Marcas
 ├ Programación
 └ Bases de Datos
```

*(Pista: utiliza una lista no ordenada `<ul>` anidada dentro de un elemento `<li>`).*

---

## Semana 2 · Texto, listas, rutas y navegación

---

## Sesión 4 · Jerarquía textual y estructuración de listas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Jerarquía de encabezados (`h1`–`h6`), párrafos vs `<br>`, listas no ordenadas (`ul`), ordenadas (`ol`), anidadas y listas de descripción (`dl`).</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 3 · Lista de contenidos** interpretando información en bruto y resuelve el **Reto 2**.</li>
    <li><strong>3. Comprueba (30 min):</strong> Comprueba que ningún encabezado se salta niveles jerárquicos (por ejemplo, de `h1` a `h3`).</li>
  </ol>
</div>

### Tarea 3 · Lista de contenidos

Recibes la siguiente información en texto plano sin ningún tipo de marcado:

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

**Tu trabajo:**
1. Decide qué elemento representa el título de cada bloque.
2. Elige justificadamente qué bloque debe ser una lista no ordenada (`<ul>`) y cuál debe ser estrictamente una lista ordenada (`<ol>`).
3. Añade una lista de descripción (`<dl>`) que defina tres conceptos clave (ejemplo: CPU, RAM, SSD) con sus términos (`<dt>`) y descripciones (`<dd>`).

### Reto 2 · ¿Qué está mal aquí? (10 min)

Analiza el siguiente código y explica qué principio de la especificación HTML se está violando:

```html
<p>
    <h2>Nuestros productos</h2>
</p>
```

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 2</summary>
  <p>Un elemento <code>&lt;p&gt;</code> solo puede contener contenido *phrasing* (en línea, como texto, <code>strong</code> o <code>em</code>). Un encabezado <code>&lt;h2&gt;</code> es un elemento de bloque y no puede anidarse dentro de un párrafo. El navegador forzará el cierre prematuro del párrafo, rompiendo la estructura del DOM.</p>
</details>

---

## Sesión 5 · El laberinto de las rutas relativas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Rutas relativas (`./`, `../`, carpetas hijas) vs rutas absolutas, enlaces internos (`#id`) y por qué nunca se deben usar rutas de disco local (`C:\...`).</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 5 · Rutas relativas** conectando archivos en diferentes niveles de carpetas.</li>
    <li><strong>3. Comprueba (30 min):</strong> Mueve la carpeta del proyecto a otra ubicación en tu ordenador y confirma que todos los enlaces siguen funcionando.</li>
  </ol>
</div>

### Tarea 5 · El laberinto de rutas

Imagina la siguiente estructura de carpetas:

```text
web/
├── index.html
├── img/
│   └── logo.webp
└── paginas/
    ├── productos.html
    └── contacto.html
```

Escribe la ruta exacta para cada uno de los siguientes casos:
1. Desde `productos.html`, crear un enlace para volver a `index.html`.
2. Desde `index.html`, enlazar la imagen `logo.webp`.
3. Desde `contacto.html`, crear un enlace hacia `productos.html`.
4. Desde `contacto.html`, enlazar la imagen `logo.webp`.
5. Desde `index.html`, saltar a una sección con `id="envios"` situada al final de la misma página.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación de portabilidad</p>
  <p>Si tu código contiene <code>C:\Users\...</code> o <code>file:///</code>, el enlace está mal construido. Las rutas dentro del proyecto deben ser siempre <strong>relativas</strong>.</p>
</div>

---

## Sesión 6 · Construcción del sitio multipágina

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Estructuración de barras de navegación accesibles con `<nav aria-label="...">` y listas de enlaces `<ul>`.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 4 · Sitio multipágina**: crea y conecta las 4 páginas del proyecto con un menú idéntico en todas ellas.</li>
    <li><strong>3. Comprueba (30 min):</strong> Navega en bucle pasando por Inicio → Productos → Acerca de → Contacto → Inicio sin que se produzca ningún error 404.</li>
  </ol>
</div>

### Tarea 4 · Sitio multipágina

Expande tu proyecto para que cuente con cuatro archivos en la raíz:

```text
mi-web/
├── index.html
├── productos.html
├── acerca.html
└── contacto.html
```

En la cabecera de cada una de las cuatro páginas, incluye el mismo bloque de navegación:

```html
<nav aria-label="Navegación principal">
    <ul>
        <li><a href="index.html">Inicio</a></li>
        <li><a href="productos.html">Productos</a></li>
        <li><a href="acerca.html">Acerca de</a></li>
        <li><a href="contacto.html">Contacto</a></li>
    </ul>
</nav>
```

---

## Semana 3 · Imágenes y HTML semántico

---

## Sesión 7 · Imágenes con criterio y accesibilidad

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> La etiqueta `<img>`, textos alternativos `alt` (informativos vs decorativos), `figure`/`figcaption`, dimensiones explícitas y `loading="lazy"`.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 6 · ¿Qué alt pondrías?** analizando 5 casos reales y añade imágenes optimizadas a tu proyecto.</li>
    <li><strong>3. Comprueba (30 min):</strong> Desactiva las imágenes en el navegador y comprueba si la información de la web sigue siendo comprensible.</li>
  </ol>
</div>

### Tarea 6 · ¿Qué `alt` pondrías?

Para cada una de las siguientes 5 situaciones, decide si debe llevar un texto alternativo descriptivo, `alt=""` vacío o si directamente la imagen no debería existir:

1. **El logotipo de la empresa en la cabecera:** Enlazado a `index.html`.
2. **Un gráfico de barras:** Muestra la comparativa de consumo energético de tres portátiles.
3. **Una línea divisoria decorativa:** Una imagen de puntos o sombras entre dos secciones.
4. **Un botón de lupa para buscar:** Es una imagen dentro de un enlace sin ningún texto alrededor.
5. **La foto de un producto en su ficha:** Un teclado mecánico con iluminación RGB.

<details class="aside aside--extra">
  <summary>Ver soluciones recomendadas</summary>
  <p>1 · <code>alt="PixelStore - Inicio"</code> (describe el destino del enlace).</p>
  <p>2 · <code>alt="Gráfico comparativo: el modelo A consume 45W, el modelo B 65W y el modelo C 90W"</code> (transmite los datos clave).</p>
  <p>3 · <code>alt=""</code> (imagen puramente decorativa; el lector de pantalla debe ignorarla).</p>
  <p>4 · <code>alt="Buscar en la tienda"</code> (es la única etiqueta accesible del botón).</p>
  <p>5 · <code>alt="Teclado mecánico compacto con interruptores rojos y retroiluminación RGB"</code>.</p>
</details>

---

## Sesión 8 · Refactorización: saliendo del infierno de los div

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Elementos estructurales semánticos: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` y el uso adecuado de `<div>`.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 7 · El infierno de los div (Div Soup)** transformando un documento caótico en HTML semántico limpio.</li>
    <li><strong>3. Comprueba (30 min):</strong> Resuelve los **Retos 3 y 4** debatiendo con tu compañero.</li>
  </ol>
</div>

### Tarea 7 · El infierno de los div (*Div Soup*)

Observa este código real generado por un mal maquetador:

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

**Tu trabajo:** Reescribe el fragmento completo eliminando todos los `<div>` innecesarios y sustituyéndolos por `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<h1>`, `<h2>`, `<h3>` y `<p>`.

### Reto 3 · Botón vs falso botón (10 min)

¿Cuál de las dos opciones elegirías para una acción que abre un diálogo modal y por qué?

```html
<!-- Opción A -->
<div onclick="abrirModal()">Ver especificaciones</div>

<!-- Opción B -->
<button type="button">Ver especificaciones</button>
```

### Reto 4 · ¿`section` o `article`? (10 min)

Debate con tu compañero: en una tienda online, ¿la ficha individual de un producto es un `<section>` o un `<article>`? ¿Y el catálogo que contiene a los 20 productos juntos?

---

## Sesión 9 · Auditoría semántica de una web real

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Uso de las herramientas de inspección del navegador (DevTools) para analizar el árbol de accesibilidad y la jerarquía de landmarks.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 8 · Audita una web real** inspeccionando un sitio web en producción y extrayendo su mapa semántico.</li>
    <li><strong>3. Comprueba (30 min):</strong> Aplica las mejoras semánticas aprendidas sobre las 4 páginas de tu propio proyecto.</li>
  </ol>
</div>

### Tarea 8 · Audita una web real con DevTools

1. Abre en tu navegador una web de noticias o tienda online conocida.
2. Abre DevTools (`F12`) y selecciona la pestaña **Elements / Inspector**.
3. Responde en tu cuaderno de prácticas:
   - ¿Tiene un único `<main>` visible?
   - ¿Qué etiquetas utiliza para el menú de navegación?
   - ¿Cómo está construida la jerarquía de encabezados? ¿Hay saltos de nivel?
   - Selecciona 3 imágenes: ¿tienen atributo `alt`? ¿Es descriptivo o está vacío?

---

## Semana 4 · Tablas para datos tabulares

---

## Sesión 10 · Construcción semántica de tablas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Estructura completa de datos tabulares: `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` y el atributo `scope="col|row"`.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 9 · Construye la tabla** convirtiendo datos sin formato en una tabla HTML5 accesible.</li>
    <li><strong>3. Comprueba (30 min):</strong> Verifica con el validador HTML que la tabla no tiene celdas huérfanas ni errores de anidación.</li>
  </ol>
</div>

### Tarea 9 · Construye la tabla

Recibes la siguiente tabla de precios y características:

```text
Comparativa de modelos de servidor
Modelo       RAM       Almacenamiento   Transferencia   Precio mensual
Básico       8 GB      256 GB NVMe      2 TB            19 €
Avanzado     16 GB     512 GB NVMe      5 TB            39 €
Empresarial  32 GB     1 TB NVMe        10 TB           79 €
```

**Tu trabajo:** Escribe el código HTML que represente esta información utilizando:
* `<caption>` para el título de la tabla.
* `<thead>` y `<tbody>` para delimitar encabezados y registros.
* `<th scope="col">` para los encabezados de columna.
* `<th scope="row">` para los nombres de cada modelo en su fila.
* `<td>` para los valores de datos.

---

## Sesión 11 · Tablas complejas y celdas combinadas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Atributos `colspan` y `rowspan`: cómo combinar celdas sin romper la accesibilidad ni la cuadrícula del DOM.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 10 · Tabla compleja**: diseña un horario de clases semanal o una matriz de turnos.</li>
    <li><strong>3. Comprueba (30 min):</strong> Cuenta las celdas de cada fila para verificar que la suma de celdas y `colspan` coincida en todas las filas.</li>
  </ol>
</div>

### Tarea 10 · El horario de clase

Construye una tabla que represente el horario semanal de tu grupo formativo (Lunes a Viernes, con 6 periodos lectivos y un recreo intermedio). El recreo debe ocupar una única fila combinada que abarque todas las columnas utilizando `colspan="5"`.

---

## Sesión 12 · Criterio: ¿Tabla o no tabla?

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Identificación de datos tabulares reales vs datos de catálogo, listas de opciones o maquetación por columnas.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 11 · ¿Tabla o no tabla?** e integra una tabla comparativa real dentro de la página `productos.html` de tu proyecto.</li>
    <li><strong>3. Comprueba (30 min):</strong> Confirma que la tabla de tu proyecto aporta valor y dispone de `caption` descriptivo.</li>
  </ol>
</div>

### Tarea 11 · ¿Tabla o no tabla?

Analiza los siguientes 5 casos e indica razonadamente si debe estructurarse con `<table>` o con otra etiqueta semántica (`<ul>`, `<ol>`, `<article>`, `<nav>`):

1. **Un catálogo de 12 camisetas:** Cada una con foto, título, descripción y botón de comprar.
2. **La clasificación de la liga de fútbol:** Posición, equipo, puntos, partidos jugados y goles.
3. **El menú de navegación superior de una web:** 5 enlaces a secciones.
4. **Una comparativa técnica:** Tres tarifas de móvil con gigas, minutos, permanencia y precio.
5. **Colocar una foto a la izquierda y un texto a la derecha:** Maquetación visual de dos columnas.

<details class="aside aside--extra">
  <summary>Ver soluciones de criterio</summary>
  <p>1 · <code>&lt;section&gt;</code> con múltiples <code>&lt;article&gt;</code> (no es una tabla).</p>
  <p>2 · <code>&lt;table&gt;</code> (relación bidimensional estricta de datos).</p>
  <p>3 · <code>&lt;nav&gt;</code> con <code>&lt;ul&gt;</code>.</p>
  <p>4 · <code>&lt;table&gt;</code> con <code>caption</code> y <code>scope</code>.</p>
  <p>5 · <code>&lt;figure&gt;</code> y <code>&lt;p&gt;</code> (el diseño de dos columnas se resuelve con CSS, nunca con tablas).</p>
</details>

---

## Semana 5 · Formularios progresivos y accesibles

---

## Sesión 13 · Arquitectura de un formulario y controles básicos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> El elemento `<form>`, la relación obligatoria entre `<label for="id">` e `<input id="id" name="nombre">`, y el botón `<button type="submit">`.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 12 (Fase inicial)** creando el formulario de `contacto.html` con campos vinculados.</li>
    <li><strong>3. Comprueba (30 min):</strong> Haz clic sobre el texto de cada etiqueta y comprueba que el cursor se coloca automáticamente en el campo correspondiente.</li>
  </ol>
</div>

### Tarea 12 (Fase A) · Formulario base de contacto

En tu página `contacto.html`, escribe un formulario con:
* Campo de nombre completo con `label` explícito.
* Campo de correo electrónico.
* Campo de asunto.
* Área de mensaje con `<textarea rows="5">`.
* Botón de envío `<button type="submit">`.

---

## Sesión 14 · Tipos especializados, validación nativa y agrupación

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Tipos especializados (`email`, `number`, `date`, `tel`), atributos de validación (`required`, `minlength`, `max`, `pattern`), radio buttons, checkboxes y `<fieldset>` con `<legend>`.</li>
    <li><strong>2. Haz (60 min):</strong> Completa la **Tarea 12 (Fase avanzada)** añadiendo los 8 requisitos de validación y controles de selección.</li>
    <li><strong>3. Comprueba (30 min):</strong> Intenta enviar el formulario vacío o con valores erróneos y comprueba la validación nativa del navegador.</li>
  </ol>
</div>

### Tarea 12 (Fase B) · Formulario comercial completo

Añade los siguientes requisitos al formulario de tu proyecto:
1. El correo electrónico debe ser obligatorio (`required`).
2. El asunto debe exigir entre 5 y 50 caracteres (`minlength="5"` y `maxlength="50"`).
3. Añade un campo numérico para el presupuesto o cantidad (`min="1"` y `max="100"`).
4. Agrupa en un `<fieldset>` con `<legend>` los datos personales y en otro los datos de la consulta.
5. Añade un desplegable `<select>` con al menos 3 motivos de contacto.
6. Añade dos botones de opción (`radio`) que compartan el mismo `name="tipo_cliente"` (Particular / Empresa).
7. Añade una casilla de verificación (`checkbox`) obligatoria para aceptar la política de privacidad.

---

## Sesión 15 · Auditoría y remediación de formularios rotos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Errores críticos en formularios: ausencia de `label`, abuso de `placeholder`, falsos botones con `div`, inputs sin `name` y pérdida de accesibilidad.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 13 · Formulario defectuoso**: audita y refactoriza un formulario inaccesible.</li>
    <li><strong>3. Comprueba (30 min):</strong> Pasa la extensión HTMLHint y navega por el formulario únicamente con la tecla `Tab`.</li>
  </ol>
</div>

### Tarea 13 · Formulario defectuoso

Analiza el siguiente formulario y enumera sus 6 errores de diseño y accesibilidad:

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

**Tu trabajo:** Reescribe el formulario corrigiendo todos los fallos (vinculación con `label`, tipos semánticos `type="email"` y `type="number"`, atributos `name`, botón `<button type="submit">` y eliminación de `<br>`).

---

## Semana 6 · Depuración, auditoría y coevaluación

---

## Sesión 16 · Auditoría forense de código HTML

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Metodología de depuración forense: inspección visual, panel de problemas en el editor, consola de DevTools y validador oficial del W3C.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 14 · HTML forense**: localiza y repara al menos 15 de los 20 errores deliberados del archivo de examen.</li>
    <li><strong>3. Comprueba (30 min):</strong> Pasa el validador del W3C (`validator.w3.org`) hasta conseguir la insignia de validación limpia (0 errores).</li>
  </ol>
</div>

### Tarea 14 · HTML forense

Recibirás un documento web que contiene **20 fallos deliberados** de distinta gravedad:
* Dos elementos con el mismo `id`.
* Imágenes sin atributo `alt`.
* Enlaces con rutas locales a disco (`C:\...`).
* Salto de jerarquía de encabezados (`h1` ➔ `h4`).
* Campos de formulario sin etiqueta `label`.
* Tabla sin `<caption>` ni `<th scope>`.
* Un elemento interactivo maquetado con `<div onclick>`.
* Etiquetas mal anidadas (ej. `<b><i>texto</b></i>`).
* Enlaces externos con `target="_blank"` sin `rel="noopener noreferrer"`.
* Ausencia de `<!doctype html>` y `lang`.

**Tu trabajo:** Encuentra al menos 15 fallos, corrígelos en el archivo y redacta una tabla justificativa con el problema detectado, la línea y la solución aplicada.

---

## Sesión 17 · Integración y finalización del proyecto multipágina

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Criterios de entrega y checklist de calidad para un sitio web multipágina exclusivamente en HTML5.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 15 · Proyecto final multipágina**: completa y pule las 4 páginas de tu sitio web asegurando 0 estilos CSS.</li>
    <li><strong>3. Comprueba (30 min):</strong> Pasa el validador del W3C sobre las 4 páginas del proyecto y verifica que todas validan al 100%.</li>
  </ol>
</div>

### Tarea 15 · Proyecto final multipágina

Verifica que tu sitio web cumple con todos los requisitos estructurales:

```text
mi-web/
├── index.html          # Portada con presentación, áreas temáticas y navegación
├── productos.html      # Catálogo semántico con artículos y tabla comparativa
├── acerca.html         # Información del proyecto, detalles y contenido estructurado
├── contacto.html       # Formulario completo con validación nativa y fieldsets
└── img/                # Imágenes en formatos modernos con alt descriptivo
```

<div class="checkpoint">
  <p class="checkpoint-label">Condición obligatoria · Cero CSS</p>
  <p>Está terminantemente prohibido incluir estilos CSS (ni <code>&lt;style&gt;</code>, ni <code>style="..."</code>, ni ficheros <code>.css</code>). La evaluación mide exclusivamente la calidad y corrección de la estructura HTML.</p>
</div>

---

## Sesión 18 · Revisión por pares y defensa del proyecto

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende (30 min):</strong> Metodología profesional de revisión de código (*Code Review*): cómo auditar el trabajo de un compañero de forma constructiva.</li>
    <li><strong>2. Haz (60 min):</strong> Realiza la **Tarea 16 · Revisión por pares**: intercambia tu proyecto con otro alumno y completa la matriz de evaluación.</li>
    <li><strong>3. Entrega (30 min):</strong> Entrega el proyecto definitivo junto con la matriz de coevaluación y realiza la defensa ante el profesor.</li>
  </ol>
</div>

### Tarea 16 · Revisión por pares (Matriz de coevaluación)

Recibe el repositorio de un compañero y audita su código rellenando una tabla como la siguiente:

| Aspecto auditado | Archivo | Problema detectado | Propuesta de corrección |
| :--- | :--- | :--- | :--- |
| **Navegación y rutas** | `productos.html` | Enlace roto al volver a inicio | Cambiar ruta absoluta por `index.html` |
| **Jerarquía textual** | `index.html` | Salto de `h1` a `h3` | Sustituir `h3` por `h2` |
| **Accesibilidad imágenes** | `acerca.html` | `alt="foto"` no descriptivo | Describir el contenido real de la foto |
| **Tablas** | `productos.html` | Faltan atributos `scope` en `th` | Añadir `scope="col"` y `scope="row"` |
| **Formularios** | `contacto.html` | El `label` no tiene atributo `for` | Añadir `for="email"` coincidente con `id` |
| **Validación W3C** | Todas | 1 aviso por etiqueta sin cerrar | Cerrar etiqueta y revalidar |

Tras la revisión, el autor del proyecto analiza los hallazgos y decide qué mejoras incorpora antes de la entrega final.

---

## Preguntas de autoevaluación final

Al terminar esta unidad deberías ser capaz de responder con soltura:

1. ¿Qué función tiene HTML dentro del desarrollo web moderno?
2. ¿Qué diferencia existe entre un elemento, una etiqueta y un atributo?
3. ¿Qué información contienen respectivamente `<head>` y `<body>`?
4. ¿Para qué sirven `charset`, `viewport`, `lang` y `<title>`?
5. ¿Cómo se organiza correctamente una jerarquía de encabezados (`h1` a `h6`)?
6. ¿Qué diferencia existe entre una ruta relativa y una absoluta?
7. ¿Qué información debe contener un atributo `alt` y cuándo debe estar vacío?
8. ¿Cuándo utilizarías `<section>`, `<article>` o `<div>`?
9. ¿Por qué no debemos utilizar tablas para maquetar el diseño de una web?
10. ¿Por qué es fundamental la relación entre `<label for>` e `<input id>`?
11. ¿Por qué existen diferentes tipos de `input` en HTML5?
12. ¿Qué función cumplen `<fieldset>` y `<legend>` en un formulario?
13. ¿Qué ventajas aporta utilizar elementos HTML nativos frente a recrearlos con `<div>`?
14. ¿Por qué una página puede verse bien visualmente y contener un HTML incorrecto?
15. ¿Para qué sirven HTMLHint y el validador oficial del W3C?
16. ¿Cómo se realiza una revisión por pares constructiva sobre el código de otro desarrollador?

---

## Siguiente unidad

Hasta ahora hemos respondido a la pregunta fundamental:

> **¿Qué representa cada elemento y cómo se estructura la información?**

En la siguiente unidad aprenderemos **CSS moderno** para transformar la apariencia visual de este mismo proyecto sin alterar su significado semántico:

```text
HTML (Estructura y significado) ──► CSS (Presentación, diseño, Grid, Flexbox y Responsive)
```

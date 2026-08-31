---
title: "CSS: diseño, maquetación y responsive"
label: "UD2 · Guía y taller práctico"
section: "ud-02"
order: 2
lang: "es"
summary: "El mismo sitio de la UD1, ahora con presentación. CSS no es un catálogo de propiedades que memorizar: es decidir de qué tipo es cada problema —tamaño, espacio o distribución— y saber diagnosticar qué regla está actuando cuando el resultado no es el esperado."
duration: "18 sesiones · 6 semanas"
modality: "Individual, con retos y revisión en pareja"
deliverable: "El sitio HTML de la UD1 convertido en una web completa: sistema visual con variables, layout con Flexbox y Grid, responsive sin plantillas y estados de foco visibles."
outcomes:
  - "Enlazar una hoja de estilos y saber diagnosticar por qué una página no la está cargando."
  - "Elegir el selector que corresponde al problema en lugar del que casualmente funciona."
  - "Diagnosticar con DevTools qué regla gana un conflicto, y resolverlo sin recurrir a !important."
  - "Razonar el tamaño de un elemento con el box model y box-sizing."
  - "Construir un sistema visual mínimo con variables, una escala tipográfica y un espaciado consistente."
  - "Distribuir elementos con Flexbox cuando el problema es de una dimensión."
  - "Maquetar con Grid cuando el problema tiene filas y columnas a la vez."
  - "Conseguir que un diseño se adapte de forma fluida antes de escribir la primera media query."
  - "Colocar los breakpoints donde el contenido deja de funcionar, no donde está de moda un teléfono."
  - "Mantener visibles los estados de foco y respetar las preferencias de movimiento del usuario."
  - "Refactorizar una hoja de estilos frágil hacia un modelo de layout que aguante cambios de contenido."
requirements:
  - "El sitio HTML terminado en la UD1, validado en el W3C."
  - "Visual Studio Code."
  - "Un navegador moderno con DevTools, incluidos sus inspectores de Flexbox y Grid."
  - "El validador CSS del W3C, en jigsaw.w3.org/css-validator."
priorKnowledge:
  - "Escribir HTML semántico válido: encabezados, listas, enlaces, imágenes, tablas y formularios (UD1)."
  - "Qué declaran header, nav, main, section, article y footer, y cuándo un div sigue siendo correcto (UD1)."
  - "Manejar rutas relativas entre archivos y carpetas del proyecto (UD1)."
  - "Abrir DevTools e inspeccionar el árbol de elementos (UD1)."
date: "2026-08-30"
---

## ¿Qué vas a aprender?

En la unidad anterior construimos una web solo con HTML. Nuestra preocupación era responder bien a preguntas como estas:

> ¿Esto es un título? ¿Esto es una navegación? ¿Esto es una imagen informativa? ¿Esto es un formulario?

El resultado es un sitio con estructura y significado, y prácticamente sin diseño. Ahora le toca a CSS.

Y aquí se cobra el trabajo de las seis semanas anteriores. Terminamos la UD1 con esta promesa:

> Si tu estructura dice lo que las cosas son, el CSS podrá cambiar por completo su apariencia sin tocar una línea de tu HTML.

Vamos a comprobarlo. Sobre una estructura semántica, dar estilo es escribir selectores. Sobre una sopa de `div`, es adivinar cuál era cuál.

CSS te permitirá controlar colores, tipografía, tamaños, espacios, bordes, la distribución de los elementos, la adaptación a distintas pantallas, los estados interactivos y las transiciones. Pero, igual que en HTML, **no se trata de memorizar propiedades**. Se trata de aprender a construir y razonar *layouts*.

### La idea que gobierna la unidad

Vas a pasarte seis semanas viendo cosas que no se ven como esperabas. La diferencia entre alguien que aprende CSS y alguien que pelea con CSS está en lo que hace en ese momento.

<div class="rule">
  <p class="rule-label">Cuando algo no se ve como esperabas, no añadas CSS</p>
  <p>La reacción natural es escribir otra propiedad a ver si esta sí. Y si tampoco, otra. Y al final, <code>!important</code>. Así se acumula una hoja de estilos que nadie entiende, ni siquiera quien la escribió.</p>
  <p>Lo que haremos en su lugar es <strong>diagnosticar</strong>: inspeccionar el elemento, ver qué regla está actuando de verdad, entender por qué gana, y entonces corregir. CSS también se depura.</p>
</div>

<figure class="diagram">
  <figcaption>Las dos formas de trabajar</figcaption>
  <ol class="flow flow--row flow--chain flow--before">
    <li>No funciona</li>
    <li>Añado otra propiedad</li>
    <li>Tampoco</li>
    <li>!important</li>
  </ol>
</figure>

<figure class="diagram">
  <figcaption>La que aprenderemos</figcaption>
  <ol class="flow flow--row flow--chain flow--after">
    <li>Resultado inesperado</li>
    <li>Inspeccionar</li>
    <li>Identificar la regla</li>
    <li>Entender por qué gana</li>
    <li>Corregir</li>
  </ol>
</figure>

---

## El proyecto continúa

No empezamos una web nueva. Partimos del sitio de la UD1 y le añadimos una carpeta:

```text
mi-web/
│
├── index.html
├── productos.html
├── acerca.html
├── contacto.html
│
├── css/
│   └── styles.css      ← nuevo
│
└── img/
    └── ...
```

<figure class="diagram">
  <figcaption>El reparto de responsabilidades</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>HTML · estructura y significado</li>
    <li>CSS · presentación y distribución</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">Condición 1 · el HTML no se retuerce para conseguir un efecto visual</p>
  <p>Vas a tener la tentación de meter un <code>div</code> de más, o de cambiar un <code>section</code> por otra cosa, porque así el CSS sale antes. A veces añadir un contenedor es legítimo y lo veremos. Pero si el cambio <strong>empeora lo que el documento significa</strong>, el problema es del CSS y hay que resolverlo en el CSS.</p>
  <p>Al terminar deberías poder responder a la pregunta de la defensa de la UD1 —«si mañana llega el CSS, ¿qué HTML tendrías que tocar?»— y que la respuesta siga siendo «ninguno».</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 2 · sin frameworks CSS</p>
  <p>No puedes usar Bootstrap, Tailwind, Bulma, plantillas completas ni constructores visuales.</p>
  <p>La razón es concreta. Si escribes <code>class="container d-flex justify-content-between"</code> antes de entender Flexbox, estás aprendiendo los nombres de las clases de una herramienta, no CSS. Más adelante usarás frameworks, y entonces podrás valorar qué te ahorran, qué deciden por ti y qué cuestan. Esa valoración necesita que primero sepas hacerlo a mano.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 3 · la IA, para entender, no para entregar</p>
  <ol>
    <li><strong>Antes de preguntar:</strong> escribe qué crees que ocurre y qué has comprobado en DevTools.</li>
    <li><strong>Pregunta:</strong> pide una explicación o pistas, no el CSS completo. Ejemplo: «Mi Grid tiene tres columnas pero desborda a 360 px. Creo que he usado anchos fijos. Explícame qué debería revisar sin darme la solución».</li>
    <li><strong>Después:</strong> cierra la respuesta y realiza una modificación distinta sin volver a preguntar.</li>
  </ol>
  <p>La prueba es siempre la misma: <strong>si no puedes cambiar una decisión pequeña sobre tu propia solución</strong> —el número de columnas, el eje de un Flexbox o una regla en conflicto— todavía no controlas el código que has entregado.</p>
</div>

---

## Herramientas

VS Code ya trae lo necesario para CSS: resaltado, autocompletado, información sobre cada propiedad al pasar el ratón, selector de color, Emmet y formateo. No hacen falta extensiones.

La herramienta nueva de esta unidad es otra:

<p class="term">DevTools</p>

El inspector del navegador. En CSS deja de ser algo que se abre de vez en cuando y pasa a estar abierto siempre. Con él puedes activar y desactivar propiedades, cambiar valores en vivo, ver qué regla se está aplicando y cuál ha sido tachada, dibujar el box model, visualizar un Flexbox o un Grid con sus líneas, y simular tamaños de pantalla.

Durante seis semanas, cada vez que algo no se vea como esperas, la primera acción es `F12`.

### No todo pesa lo mismo

<div class="learning-priorities">
  <div class="learning-priorities__essential">
    <strong>Esencial · debes dominarlo</strong>
    <span>Cascada, selectores, box model, unidades, Flexbox, Grid, responsive y DevTools.</span>
  </div>
  <div class="learning-priorities__important">
    <strong>Importante · debes saber aplicarlo</strong>
    <span>Variables, <code>clamp()</code>, <code>object-fit</code>, estados y transiciones.</span>
  </div>
  <div class="learning-priorities__extra">
    <strong>Ampliación · cuando lo anterior funciona</strong>
    <span><code>:where()</code>, container queries y CSS anidado.</span>
  </div>
</div>

Si vas justo, prioriza los ocho contenidos esenciales. Las ampliaciones nunca compensan una cascada que no entiendes, un layout que desborda o un foco que no se ve.

---

## Plan de trabajo semanal

| Semana | Bloque temático | Práctica central | Horas |
| :---: | :--- | :--- | :---: |
| **Semana 1** | Cómo se aplica CSS y quién gana | Primer estilo, selectores y diagnóstico de conflictos | 3 h |
| **Semana 2** | La caja y el sistema visual | Box model, unidades, tipografía y variables | 3 h |
| **Semana 3** | Flujo normal y Flexbox | Navegación y componentes en una dimensión | 3 h |
| **Semana 4** | Grid y responsive | Catálogo adaptable y decisión de breakpoints | 3 h |
| **Semana 5** | Imágenes, estados y movimiento | Catálogo irregular, foco visible y transiciones | 3 h |
| **Semana 6** | Integración, depuración y entrega | Interfaz desconocida, CSS forense y revisión por pares | 3 h |
| **Total** | | **El sitio de la UD1 convertido en una web completa** | **18 h** |

Cada sesión dura una hora y mantiene la estructura habitual de la UD1, adaptando el tiempo a la dificultad de cada concepto:

<figure class="diagram">
  <figcaption>El ritmo de cada sesión</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Recupera · 5 min</li>
    <li>Aprende y observa · 10–20 min</li>
    <li>Practica · 30–40 min</li>
    <li>Cierra · 5 min</li>
  </ol>
</figure>

Los conceptos nuevos avanzan de **ejemplo resuelto → ejemplo incompleto → problema parecido → problema nuevo**. Aproximadamente dos tercios de la práctica se aplican al proyecto y un tercio a interfaces que no has visto antes. La pregunta previa nunca es «¿qué propiedad copio?», sino «¿qué tipo de problema tengo y qué herramienta encaja?».

---

## Semana 1 · Cómo se aplica CSS y quién gana

---

## Sesión 1 · Nuestro primer CSS

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se enlaza una hoja de estilos, de qué partes se compone una regla y por qué existen tres formas de aplicar CSS aunque solo usemos una.</li>
    <li><strong>2. Haz:</strong> Crea tu hoja de estilos, enlázala en las cuatro páginas y da el primer estilo al sitio.</li>
    <li><strong>3. Comprueba:</strong> Las cuatro páginas cargan el CSS, y sabes comprobarlo sin adivinar.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué información pertenece a HTML y cuál esperas que pertenezca a CSS?</li>
    <li>¿Qué ventaja tiene conservar el mismo HTML cuando cambia el diseño?</li>
    <li>Señala qué cambiarías para presentar un título en azul sin alterar su significado.</li>
  </ol>
</div>

### El navegador ya estaba aplicando CSS

Cuando escribiste esto en la UD1:

```html
<h1>PixelStore</h1>
```

el título se veía grande y en negrita. Eso no es «lo natural»: es una hoja de estilos que trae el navegador de fábrica, la **hoja de usuario-agente**. Nunca has trabajado sin CSS. Lo que vamos a hacer es tomar el control.

### Las tres formas, y por qué usamos una

| Forma | Cómo se escribe | Cuándo |
| ----- | --------------- | ------ |
| Hoja externa | Un archivo `.css` enlazado con `link` | **Siempre**, en esta unidad y en la práctica profesional |
| Hoja interna | Un bloque `style` en el `head` | Casos muy puntuales, como un correo electrónico |
| En línea | Un atributo `style` en el elemento | Prácticamente nunca a mano |

La hoja externa gana por tres razones concretas: una sola definición sirve para las cuatro páginas, el navegador se la guarda en caché y no vuelve a descargarla, y el estilo queda separado del contenido, que es la idea entera de estas dos unidades.

Crea el archivo:

```text
css/styles.css
```

y enlázalo desde el `head` de **cada** página:

```html
<link rel="stylesheet" href="css/styles.css">
```

Fíjate en que es una ruta relativa, como las de la UD1. Si una página estuviera dentro de una carpeta, sería `../css/styles.css`.

### Cómo funciona una regla

```css
h1 {
    color: navy;
}
```

```text
h1       selector      a qué elementos afecta
color    propiedad     qué característica cambio
navy     valor         qué valor le doy
```

Y se lee así: «selecciona todos los `h1` y cambia su propiedad `color`». Al conjunto de propiedad y valor se le llama **declaración**, y van separadas por punto y coma:

```css
body {
    font-family: system-ui, sans-serif;
    line-height: 1.6;
    color: #222;
}
```

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>La estructura recibe una presentación propia</strong></figcaption>
  <div class="lesson-demo__stage">
    <div class="lesson-browser" aria-label="Vista de una página después de aplicar las primeras reglas CSS">
      <div class="lesson-browser__page lesson-first-css">
        <p class="demo-title">PixelStore</p>
        <p>Componentes pensados para trabajar y crear.</p>
      </div>
    </div>
  </div>
  <p class="lesson-demo__note">El contenido HTML no cambia: CSS modifica tipografía, color y ritmo de lectura.</p>
</figure>

<p class="term">Regla</p>

Un selector más el bloque de declaraciones que se le aplican. Una hoja de estilos es una lista de reglas.

#### Los comentarios

```css
/* Sistema tipográfico base */
body {
    font-family: system-ui, sans-serif;
}
```

CSS solo tiene esta forma de comentar. `//` no funciona, aunque el editor a veces lo coloree como si lo hiciera.

### Tarea 1 · Tu primer estilo

Sobre tu proyecto de la UD1:

1. Crea la carpeta `css/` y dentro `styles.css`.
2. Enlázalo en las **cuatro** páginas.
3. Cambia la tipografía general del sitio desde `body`.
4. Da un color distinto a los encabezados.
5. Cambia el aspecto de los enlaces.
6. Comprueba que el estilo se aplica en las cuatro.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Una hoja externa cargada en las cuatro páginas y tres reglas que puedas explicar.</span></div>
  <div><strong>Si lo tienes</strong><span>Cambia el nombre o la ubicación de la hoja y diagnostica el fallo con Network.</span></div>
  <div><strong>Reto</strong><span>Recibe una quinta página y enlaza el CSS desde una carpeta distinta.</span></div>
</div>

<div class="rule">
  <p class="rule-label">Si una página no cambia, no escribas más CSS</p>
  <p>Es el error que más tiempo consume la primera semana, y la reacción instintiva es escribir más reglas por si acaso. No sirve de nada: si la hoja no carga, ninguna regla va a funcionar.</p>
  <p>Comprueba en este orden: ¿la ruta del <code>link</code> es correcta desde <em>esa</em> página?, ¿el archivo se llama exactamente así, con sus mayúsculas?, ¿lo has guardado? Y la comprobación definitiva: abre DevTools, pestaña <strong>Network</strong>, recarga, y busca <code>styles.css</code>. Si aparece en rojo con un 404, ya sabes que el problema es la ruta y no el CSS.</p>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Existe <code>css/styles.css</code> y está enlazado en las cuatro páginas.</li>
    <li>Sabes nombrar las tres partes de una regla.</li>
    <li>Sabes comprobar en Network si la hoja se ha cargado.</li>
    <li>No has tocado el HTML salvo para añadir el <code>link</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué usamos una hoja externa y no un atributo <code>style</code>?</li>
    <li>Nombra las tres partes de una regla CSS.</li>
    <li>Una página no aplica los estilos. ¿Cuál es la primera comprobación?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Una definición sirve para todas las páginas, el navegador la cachea, y el estilo queda separado del contenido.</p>
  <p>2 · Selector, propiedad y valor. La propiedad con su valor forman una declaración.</p>
  <p>3 · Que la hoja se esté cargando: la ruta del <code>link</code>, el nombre exacto del archivo, y comprobarlo en la pestaña Network de DevTools.</p>
</details>

---

## Sesión 2 · Selectores

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Las familias de selectores y qué problema resuelve cada una.</li>
    <li><strong>2. Haz:</strong> Elige el selector adecuado para cinco requisitos distintos.</li>
    <li><strong>3. Comprueba:</strong> Ninguna de tus reglas afecta a elementos que no debía tocar.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué tres partes tiene una regla CSS?</li>
    <li>¿Por qué usamos una hoja externa en lugar del atributo <code>style</code>?</li>
    <li>Esta regla no actúa: <code>h1 { colour: red; }</code>. Localiza la causa.</li>
  </ol>
</div>

### Decirle a CSS a qué te refieres

#### Por elemento

```css
p {
    line-height: 1.6;
}
```

Afecta a **todos** los párrafos del sitio. Útil para las bases; peligroso si lo usas para algo específico.

#### Por clase

```html
<p class="destacado">Oferta especial.</p>
```

```css
.destacado {
    font-weight: 700;
}
```

Una clase puede repetirse en tantos elementos como quieras, y un elemento puede tener varias:

```html
<article class="card producto destacado">
```

Es el selector que más vas a usar, porque describe **un papel** y se puede reutilizar.

#### Por `id`

```html
<section id="productos">
```

```css
#productos {
    padding-block: 3rem;
}
```

Existe, y funciona, pero un `id` es único en la página: no puedes reutilizar el estilo. Además pesa mucho en los conflictos, como veremos mañana. Regla práctica: **los `id` son para enlazar y para los `label`, las clases son para dar estilo.**

#### Descendiente y directo

```css
nav a {          /* cualquier enlace dentro de nav, a la profundidad que sea */
    text-decoration: none;
}

nav > ul {       /* solo las listas que son hijas directas de nav */
    display: flex;
}
```

#### Por atributo

```css
input[type="email"] {
    border-color: #999;
}

a[href^="http"] {     /* enlaces cuyo href empieza por http: los externos */
    ...
}
```

Aquí se nota lo que hiciste en la UD1: si escribiste `type="email"` en lugar de `type="text"`, ahora tienes un selector. **El HTML bien marcado te devuelve selectores.**

#### Pseudo-clases

Seleccionan por estado o por posición, no por lo que el elemento es:

```css
a:hover        { }   /* el cursor está encima */
a:focus-visible{ }   /* tiene el foco de teclado */
li:first-child { }   /* es el primer hijo de su padre */
li:last-child  { }   /* es el último */
input:required { }   /* el campo es obligatorio */
input:invalid  { }   /* su valor no cumple la validación */
```

<p class="term">Pseudo-clase</p>

Un selector que depende del estado o de la posición del elemento, no de su marcado. Se escribe con dos puntos y no existe en el HTML: la calcula el navegador.

#### Agrupar

```css
h1, h2, h3 {
    line-height: 1.15;
}
```

La coma es «o». Un fallo típico es olvidarla: `h1 h2` significa «un `h2` dentro de un `h1`», que casi nunca existe, y entonces la regla no hace nada.

### Tarea 2 · El selector correcto

Para cada requisito, escribe el selector que le corresponde. No vale cualquiera que funcione: **vale el que expresa lo que pide el enunciado**.

<p class="stage">Paso 1 · Te enseño uno</p>

**Requisito: los enlaces del pie no deben subrayarse, pero los del contenido sí.**

<dl class="worked">
  <dt>¿Qué me piden seleccionar?</dt>
  <dd>Enlaces, pero solo los de una zona concreta del documento.</dd>
  <dt>¿Cómo está marcada esa zona?</dt>
  <dd>En la UD1 el pie es un <code>footer</code>. Ya tengo por dónde acotar.</dd>
  <dt>¿Descendiente o hijo directo?</dt>
  <dd>Descendiente: los enlaces pueden estar dentro de párrafos o de listas, no necesariamente colgando del <code>footer</code>.</dd>
  <dt>Selector</dt>
  <dd><code>footer a { text-decoration: none; }</code></dd>
</dl>

Fíjate en que no he inventado una clase. Si el HTML ya distingue esa zona, el selector sale solo.

<p class="stage stage--solo">Paso 2 · Ahora tú</p>

1. Todos los enlaces de la navegación principal deben cambiar de aspecto.
2. El primer producto del catálogo debe destacarse.
3. Los campos obligatorios del formulario deben distinguirse.
4. Los enlaces externos deben poder marcarse de forma distinta a los internos.
5. Solo los párrafos que están dentro de una ficha de producto, no todos los del sitio.

<details class="aside aside--help">
  <summary>Estoy atascado · ¿clase o selector estructural?</summary>
  <p>Pregúntate si la condición <strong>ya está escrita en el HTML</strong>. Si es «los obligatorios», el HTML ya lo dice con <code>required</code>: usa <code>:required</code>. Si es «el primero», el HTML ya lo dice por su posición: usa <code>:first-child</code>. Si es «los de oferta», eso no está en ninguna parte del marcado y sí necesita una clase.</p>
  <p>Inventar una clase para algo que el documento ya declara es duplicar la información en dos sitios, y tarde o temprano dejan de coincidir.</p>
</details>

<details class="aside aside--extra">
  <summary>Ver soluciones</summary>
  <p>1 · <code>nav a</code>, o si tienes varias navegaciones, acota por su etiqueta: <code>nav[aria-label="Navegación principal"] a</code>.</p>
  <p>2 · <code>.catalogo article:first-child</code>, con la clase que uses para el contenedor.</p>
  <p>3 · <code>input:required</code>, que además cubre los campos que añadas después sin tocar el CSS.</p>
  <p>4 · <code>a[href^="http"]</code>, porque los internos de tu proyecto son rutas relativas y no empiezan por <code>http</code>.</p>
  <p>5 · <code>article p</code>, o mejor <code>.producto p</code> si el catálogo comparte marcado con otras zonas.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>nav a</code> y <code>nav &gt; a</code>?</li>
    <li>¿Por qué preferimos clases a <code>id</code> para dar estilo?</li>
    <li>¿Qué significa la coma en <code>h1, h2</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El primero selecciona cualquier enlace dentro del <code>nav</code>, a la profundidad que sea; el segundo, solo los que cuelgan directamente de él.</p>
  <p>2 · Porque una clase se reutiliza y un <code>id</code> es único, y además el <code>id</code> pesa demasiado en los conflictos de la cascada.</p>
  <p>3 · «O»: la regla se aplica a los <code>h1</code> y a los <code>h2</code>. Sin coma significaría «un <code>h2</code> dentro de un <code>h1</code>».</p>
</details>

---

## Sesión 3 · Cascada, herencia y especificidad

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué decide cuál de dos reglas en conflicto se aplica, qué se hereda y qué no, y por qué <code>!important</code> es una rendición.</li>
    <li><strong>2. Haz:</strong> Diagnostica una hoja con reglas contradictorias y resuélvela sin <code>!important</code>.</li>
    <li><strong>3. Comprueba:</strong> Sabes leer en DevTools qué regla ha ganado y por qué.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuándo conviene un selector de elemento y cuándo una clase?</li>
    <li>¿Qué selecciona <code>nav a</code> que no selecciona <code>nav &gt; a</code>?</li>
    <li>Escribe el selector de todos los campos obligatorios sin inventar una clase.</li>
  </ol>
</div>

### La palabra «cascading» no es decorativa

CSS significa *Cascading Style Sheets*. Hojas de estilo **en cascada**. Esa palabra describe el mecanismo central del lenguaje: varias reglas pueden querer cambiar la misma propiedad del mismo elemento, y hace falta un criterio para decidir.

```css
p          { color: blue; }
.destacado { color: red; }
```

```html
<p class="destacado">Hola</p>
```

¿De qué color se ve? Rojo. Y ahora la pregunta que importa: **¿por qué?**

### Lo que decide, en orden

<figure class="diagram">
  <figcaption>Cómo se resuelve un conflicto, de arriba abajo</figcaption>
  <ol class="flow">
    <li>Importancia · una declaración con <code>!important</code> gana a una normal</li>
    <li>Especificidad · gana el selector más específico</li>
    <li>Orden · a igual especificidad, gana la última escrita</li>
  </ol>
</figure>

<p class="term">Especificidad</p>

Una medida de cuán concreto es un selector. No es una nota que haya que calcular a mano: es un orden de importancia que basta con conocer.

| De menos a más específico | Ejemplo |
| ------------------------- | ------- |
| Elemento y pseudo-elemento | `p`, `a` |
| Clase, atributo y pseudo-clase | `.destacado`, `[type="email"]`, `:hover` |
| `id` | `#productos` |

Y una regla práctica que te ahorra la aritmética: **una clase gana a cualquier cantidad de elementos, y un `id` gana a cualquier cantidad de clases**. Por eso `#productos p` gana a `body main section article p`, aunque el segundo parezca más trabajado.

De ahí sale el consejo de ayer: si das estilo con `id`, cualquier ajuste posterior con clases no podrá corregirlo, y acabarás escalando la pelea.

#### El orden, cuando hay empate

```css
.boton { background: blue; }
.boton { background: green; }
```

Gana el verde: misma especificidad, y la última escrita manda. Esto explica por qué el orden de tu hoja importa, y por qué conviene escribir de lo general a lo particular.

### Herencia

Algunas propiedades pasan de un elemento a sus descendientes:

```css
body {
    font-family: system-ui, sans-serif;
    color: #222;
    line-height: 1.6;
}
```

Con eso, todo el documento hereda la tipografía. No hace falta repetirla en cada elemento.

| Se heredan | No se heredan |
| ---------- | ------------- |
| `color`, `font-family`, `font-size`, `line-height`, `text-align` | `margin`, `padding`, `border`, `background`, `width`, `display` |

La lógica es razonable: lo que se hereda tiene que ver con **el texto**, y lo que no, con **la caja**. Que un `padding` se heredara sería un desastre.

### `!important`

```css
color: red !important;
```

Existe, gana casi siempre, y **no es el botón de arreglar CSS**.

<div class="rule">
  <p class="rule-label">Por qué evitarlo</p>
  <p>Un <code>!important</code> no resuelve el conflicto: lo esconde. La regla que perdía sigue ahí, y el problema real —que tu selector no era el adecuado, o que el orden estaba mal— sigue sin diagnosticarse.</p>
  <p>Además escala. Cuando dentro de un mes necesites sobrescribir esa propiedad, la única forma será otro <code>!important</code> más específico. Ese es el punto en el que una hoja de estilos deja de poder mantenerse.</p>
  <p>Si te encuentras escribiéndolo, la pregunta correcta no es «¿cómo hago que esto gane?» sino <strong>«¿qué está ganando ahora y por qué?»</strong>.</p>
</div>

### DevTools · leer quién gana

Selecciona un elemento e id a la pestaña **Styles**. Verás las reglas que le afectan, **ordenadas de la que gana a la que pierde**, y las declaraciones derrotadas aparecen **tachadas**. A la derecha de cada bloque está el archivo y la línea donde se escribió.

Eso responde a las tres preguntas de golpe: qué se está aplicando, qué se ha descartado y dónde está escrito. La pestaña **Computed** da el siguiente paso: el valor final de cada propiedad, ya resuelto el conflicto.

### Tarea 3 · ¿Quién está ganando?

Este HTML y este CSS conviven:

```html
<main id="contenido">
  <section class="bloque">
    <p class="aviso destacado">Envío gratuito a partir de 50 €.</p>
  </section>
</main>
```

```css
p                      { color: #333; }
.aviso                 { color: green; }
.destacado             { color: orange; }
#contenido p           { color: navy; }
section .aviso         { color: purple; }
main section p.aviso   { color: teal; }
```

<p class="stage">Paso 1 · Te enseño uno</p>

<dl class="worked">
  <dt>¿Cuántos <code>id</code> hay en juego?</dt>
  <dd>Solo uno: <code>#contenido p</code>. Como el <code>id</code> gana a cualquier cantidad de clases, ese es el candidato inmediato.</dd>
  <dt>¿Le puede ganar alguna otra?</dt>
  <dd>No. <code>main section p.aviso</code> tiene una clase y tres elementos, y sigue por debajo de un <code>id</code>.</dd>
  <dt>¿Importa el orden?</dt>
  <dd>Aquí no, porque no hay empate en especificidad. El orden solo decide entre iguales.</dd>
  <dt>Resultado</dt>
  <dd><code>navy</code>. Y si borras la regla del <code>id</code>, ganaría <code>main section p.aviso</code>, que es <code>teal</code>.</dd>
</dl>

<p class="stage stage--solo">Paso 2 · Ahora tú</p>

1. Comprueba en el navegador que el color es el que dice el razonamiento.
2. Borra la regla del `id` y predice el nuevo color **antes** de recargar. Después comprueba.
3. Ahora consigue que el párrafo se vea naranja **sin usar `!important` y sin tocar el HTML**. Hay más de una solución válida: explica la que elijas.
4. Abre DevTools y localiza cuántas declaraciones de `color` aparecen tachadas.

<details class="aside aside--help">
  <summary>Estoy atascado · ¿cómo gano sin !important?</summary>
  <p>Tienes tres caminos legítimos, y conviene que sepas cuál es cuál:</p>
  <ol>
    <li><strong>Subir la especificidad</strong> del selector que quieres que gane, hasta pasar al que gana ahora.</li>
    <li><strong>Bajar la del que gana</strong>, que casi siempre es lo correcto: quitar el <code>id</code> del selector y usar una clase.</li>
    <li><strong>Mover la regla</strong> más abajo en el archivo, si hay empate de especificidad.</li>
  </ol>
  <p>El segundo es el que deja la hoja mejor que antes. Los otros dos la dejan igual de enredada, solo que a tu favor.</p>
</details>

### Reto 1 · La regla que no hace nada (10 min)

```css
.card .titulo {
    color: crimson;
}
```

```html
<article class="card">
    <h3 class="titulo">Portátil Nova 14</h3>
</article>
```

El título no se ve rojo, y DevTools no muestra la regla ni siquiera tachada. ¿Qué está pasando?

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 1</summary>
  <p>Que no aparezca <strong>ni tachada</strong> es la pista entera. Una regla tachada es una regla que sí seleccionó el elemento y perdió el conflicto. Si no aparece en absoluto, es que <strong>no ha seleccionado nada</strong>.</p>
  <p>Las causas posibles son de fontanería, no de cascada: la hoja no se está cargando, hay una errata en el nombre de la clase, falta el punto y coma o la llave de la regla anterior —lo que invalida esta—, o el elemento no está donde crees.</p>
  <p>La lección es el método: <strong>tachado significa problema de cascada; ausente significa problema de selector o de sintaxis</strong>. Son dos diagnósticos distintos y se buscan en sitios distintos.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 3 y de la semana 1</p>
  <ul class="checklist">
    <li>Sabes ordenar elemento, clase e <code>id</code> por especificidad.</li>
    <li>Sabes que el orden solo decide cuando hay empate.</li>
    <li>Distingues una propiedad que se hereda de una que no.</li>
    <li>Sabes leer en Styles qué regla gana y cuáles están tachadas.</li>
    <li>No hay ningún <code>!important</code> en tu hoja.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué gana: tres clases o un <code>id</code>?</li>
    <li>¿Cuándo decide el orden en que están escritas las reglas?</li>
    <li>En DevTools, ¿qué significa que una declaración aparezca tachada, y qué que no aparezca?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El <code>id</code>. Gana a cualquier cantidad de clases.</p>
  <p>2 · Solo cuando dos reglas tienen la misma especificidad; entonces se aplica la última escrita.</p>
  <p>3 · Tachada quiere decir que seleccionó el elemento pero perdió el conflicto: es un problema de cascada. Que no aparezca quiere decir que no seleccionó nada: es un problema de selector, de sintaxis o de carga.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 1 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Escribe un selector de clase, uno descendiente y uno por atributo.</li>
    <li>Ordena por especificidad: <code>p</code>, <code>.aviso p</code> y <code>#principal p</code>.</li>
    <li>Una regla aparece tachada en DevTools: explica qué significa y qué revisarías.</li>
  </ol>
</div>

---

## Semana 2 · La caja y el sistema visual

---

## Sesión 4 · El box model

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> De qué capas se compone una caja, qué cambia <code>box-sizing</code> y por qué una anchura fija suele ser una mala idea.</li>
    <li><strong>2. Haz:</strong> Construye las tarjetas de tu catálogo y localiza cada capa en DevTools.</li>
    <li><strong>3. Comprueba:</strong> Ninguna tarjeta desborda su contenedor al estrechar la ventana.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si dos reglas cambian el mismo color, ¿qué criterios deciden cuál gana?</li>
    <li>¿Qué propiedades suelen heredarse?</li>
    <li>Explica por qué añadir <code>!important</code> no diagnostica el conflicto.</li>
  </ol>
</div>

### Todo es una caja

```text
┌────────────── margin ───────────────┐
│                                     │
│   ┌────────── border ───────────┐   │
│   │                             │   │
│   │   ┌────── padding ──────┐   │   │
│   │   │                     │   │   │
│   │   │      contenido      │   │   │
│   │   │                     │   │   │
│   │   └─────────────────────┘   │   │
│   │                             │   │
│   └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

| Capa | Qué es | Se ve |
| ---- | ------ | ----- |
| Contenido | El texto o la imagen | Sí |
| `padding` | Espacio **dentro** de la caja, entre el contenido y el borde | Toma el fondo de la caja |
| `border` | El borde | Sí |
| `margin` | Espacio **fuera** de la caja, que la separa de las demás | Siempre transparente |

La confusión clásica es padding contra margin. La distinción práctica: **el padding aleja el contenido de su propio borde, el margin aleja la caja de sus vecinas**. Si pones un fondo de color, el padding se pinta y el margin no.

```css
.card {
    padding: 1.5rem;      /* aire por dentro */
    margin-bottom: 2rem;  /* separación de la siguiente */
    border: 1px solid #ddd;
    border-radius: 0.75rem;
}
```

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>Las cuatro capas del box model</strong></figcaption>
  <div class="lesson-demo__stage">
    <div class="lesson-box-model">
      <span>margin · separación exterior</span>
      <div class="lesson-box-model__border">
        <span>border</span>
        <div class="lesson-box-model__padding">
          <span>padding · aire interior</span>
          <div class="lesson-box-model__content">contenido</div>
        </div>
      </div>
    </div>
  </div>
  <p class="lesson-demo__note">El fondo llega hasta el borde: pinta el contenido y el <code>padding</code>, pero nunca el <code>margin</code>.</p>
</figure>

Los valores admiten varias formas:

```css
padding: 1rem;                /* las cuatro caras */
padding: 1rem 2rem;           /* vertical | horizontal */
padding: 1rem 2rem 3rem 4rem; /* arriba, derecha, abajo, izquierda */
```

### `box-sizing`, o por qué 300 no son 300

Por defecto, `width` mide **solo el contenido**. El padding y el borde se suman por fuera:

```css
.card {
    width: 300px;
    padding: 20px;
    border: 2px solid;
}
```

Esa tarjeta ocupa `300 + 20 + 20 + 2 + 2 = 344px`. Es la causa del desbordamiento más común de toda la unidad: pones dos cajas del 50 % con padding y ya no caben en una fila.

La solución cabe en tres líneas, y se pone al principio de toda hoja de estilos:

```css
*,
*::before,
*::after {
    box-sizing: border-box;
}
```

<p class="term">border-box</p>

Hace que `width` incluya el padding y el borde. Ahora 300px son 300px, pase lo que pase por dentro, y el tamaño declarado es el tamaño real.

### Anchura: fija, fluida y con techo

```css
.card { width: 300px; }        /* frágil: no cabe en un móvil de 320 */
.card { width: 100%; }         /* fluida, pero en un monitor grande se estira */
.card {
    width: 100%;
    max-width: 30rem;          /* fluida hasta un límite */
}
```

La tercera es casi siempre la correcta: **ocupa lo que haya, pero no más de lo razonable**. Es la primera aparición de una idea que domina la unidad — describir límites en lugar de medidas exactas.

#### Centrar un bloque

```css
.container {
    width: min(90%, 70rem);
    margin-inline: auto;
}
```

`margin-inline: auto` es la forma moderna de `margin-left: auto; margin-right: auto`. Y `min(90%, 70rem)` se lee: «el 90 % del espacio, salvo que eso pase de 70rem, en cuyo caso 70rem». Un contenedor así funciona en un móvil y en un monitor de 34 pulgadas sin una sola media query.

<details class="aside aside--extra">
  <summary>Extra · el colapso de márgenes</summary>
  <p>Dos márgenes verticales adyacentes no se suman: se <strong>funden</strong> en el mayor de los dos. Si un párrafo tiene 20px abajo y el siguiente 30px arriba, la separación es 30, no 50.</p>
  <p>Solo pasa en vertical, y no pasa dentro de un contenedor Flexbox o Grid. Por eso, en cuanto empecemos a usar <code>gap</code>, este problema desaparece: es una de las razones por las que <code>gap</code> es preferible a los márgenes para separar elementos de una lista.</p>
</details>

### Tarea 4 · Construye tus tarjetas

En `productos.html` tienes `article` con el marcado de cada producto. Dales forma:

1. Pon el `box-sizing: border-box` global al principio de tu hoja.
2. Da a cada tarjeta `padding`, `border`, `border-radius` y separación entre ellas.
3. Limita su anchura con `width` y `max-width` en lugar de un valor fijo.
4. Crea la clase `.container` y aplícala para centrar el contenido de las páginas.
5. Inspecciona una tarjeta en DevTools y **localiza en el diagrama de Layout cada una de las cuatro capas**. Comprueba que los números coinciden con lo que escribiste.

<details class="aside aside--help">
  <summary>Estoy atascado · mis tarjetas desbordan</summary>
  <p>Casi siempre es una de estas tres, en este orden de probabilidad:</p>
  <ol>
    <li>Falta el <code>box-sizing: border-box</code>, y el padding se está sumando por fuera del <code>width</code>.</li>
    <li>Hay un <code>width</code> fijo en píxeles mayor que el espacio disponible.</li>
    <li>Hay una imagen dentro sin <code>max-width: 100%</code>, y la imagen empuja la caja desde dentro.</li>
  </ol>
  <p>En DevTools, la pestaña <strong>Layout</strong> te dibuja el box model con sus medidas reales: compara ese número con el que tú escribiste y verás por dónde se va la diferencia.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Cuál es la diferencia práctica entre <code>padding</code> y <code>margin</code>?</li>
    <li>¿Qué cambia exactamente <code>box-sizing: border-box</code>?</li>
    <li>¿Por qué <code>max-width</code> suele ser mejor que <code>width</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El padding es espacio dentro de la caja y se pinta con su fondo; el margin es espacio fuera y siempre es transparente.</p>
  <p>2 · Que <code>width</code> incluya el padding y el borde, en vez de medir solo el contenido.</p>
  <p>3 · Porque describe un límite en lugar de una medida: la caja se adapta al espacio disponible y solo deja de crecer cuando llega al techo.</p>
</details>

---

## Sesión 5 · Unidades, colores y tipografía

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Respecto a qué se calcula cada unidad, cómo se escriben los colores y qué hace legible un texto.</li>
    <li><strong>2. Haz:</strong> Define el sistema visual mínimo de tu proyecto.</li>
    <li><strong>3. Comprueba:</strong> El sitio es coherente entre sus cuatro páginas.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Nombra las cuatro capas del box model de dentro hacia fuera.</li>
    <li>¿Qué cambia <code>box-sizing: border-box</code>?</li>
    <li>Una caja de <code>300px</code> tiene <code>padding: 20px</code> y dos bordes de <code>2px</code>: calcula su anchura con el modelo inicial.</li>
  </ol>
</div>

### No todo se mide en píxeles

| Unidad | Se calcula respecto a | Para qué la usamos |
| ------ | --------------------- | ------------------ |
| `px` | Nada, es absoluta | Bordes y detalles que no deben escalar |
| `rem` | El tamaño de fuente **raíz** del documento | Tamaños de texto y espaciados |
| `em` | El tamaño de fuente **del propio elemento** | Espacios que deben crecer con su texto |
| `%` | Una medida del contenedor, según la propiedad | Anchuras fluidas |
| `vw` / `vh` | El ancho y el alto del viewport | Con cuidado, y casi siempre dentro de `clamp()` |

<p class="term">rem</p>

*Root em*: una medida relativa al tamaño de fuente del elemento raíz, que por defecto son 16px. Así, `1.5rem` son 24px… **hasta que alguien cambia el tamaño de letra de su navegador**, y entonces todo tu diseño escala con él. Ese es el motivo real para usarlo.

Ahí está la diferencia importante con `px`: un `font-size: 16px` ignora la preferencia de quien necesita la letra más grande. Un `1rem` la respeta.

Y el contraste entre `rem` y `em`:

```css
.card       { font-size: 1.25rem; padding: 1em; }  /* padding = 1.25 × 20px */
.card small { font-size: 0.8rem;  padding: 1em; }  /* padding = 0.8 × ese texto */
```

`em` se acumula al anidar, lo cual sorprende cuando no lo esperas. Regla práctica: **`rem` por defecto, `em` cuando quieras que algo escale con su propio texto**.

<div class="rule">
  <p class="rule-label">Las unidades de viewport tienen una trampa</p>
  <p><code>100vh</code> parece «la altura de la pantalla», y en un móvil no lo es: las barras del navegador aparecen y desaparecen al hacer scroll, así que el valor cambia bajo tus pies y el contenido salta.</p>
  <p>Existen <code>svh</code>, <code>lvh</code> y <code>dvh</code> para las variantes pequeña, grande y dinámica. Pero la regla que te va a servir hoy es más simple: <strong>no uses una unidad porque sea moderna, úsala cuando sepas respecto a qué se calcula</strong>.</p>
</div>

### Colores

```css
color: #1f2937;             /* hexadecimal */
color: rgb(31 41 55);       /* rojo, verde, azul */
color: hsl(215 28% 17%);    /* tono, saturación, luminosidad */
```

Los tres describen el mismo color. `hsl` tiene una ventaja práctica cuando construyes una paleta: para conseguir una variante más clara del mismo color solo tienes que subir el último número, sin recalcular nada.

VS Code te muestra un cuadradito junto a cada color y te abre un selector al pulsarlo, con el que además puedes cambiar de notación.

<div class="rule">
  <p class="rule-label">El contraste no es una cuestión de gusto</p>
  <p>Un texto gris claro sobre fondo blanco puede parecerte elegante y ser ilegible para bastante gente. El criterio está medido: el texto normal necesita una relación de contraste de al menos <strong>4.5:1</strong> con su fondo, y el texto grande, 3:1.</p>
  <p>DevTools te lo dice: al abrir el selector de color de una declaración, muestra la relación de contraste calculada y avisa si no llega. No hay que estimarlo a ojo.</p>
</div>

### Tipografía

```css
body {
    font-family: system-ui, sans-serif;
    font-size: 1rem;
    line-height: 1.6;
}

h1 {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.1;
}
```

Tres decisiones que casi nadie explica:

* **La lista de `font-family` es una cadena de respaldo.** El navegador usa la primera que tenga disponible. `system-ui` toma la tipografía del sistema operativo, así que carga instantánea y se ve nativa en cada dispositivo.
* **El `line-height` sin unidad** —`1.6`, no `1.6rem`— es lo correcto: al no tener unidad, cada elemento lo multiplica por *su* tamaño de fuente, así que un titular grande no acaba con el interlineado de un párrafo.
* **Los titulares llevan menos interlineado que el texto.** Un `line-height: 1.6` en un `h1` de 2.5rem deja un hueco enorme entre sus dos líneas. Alrededor de 1.1 es lo habitual.

#### Una escala, no una lista de tamaños

No elijas cada tamaño por separado. Elige un paso y multiplica:

| Nivel | Tamaño |
| ----- | ------ |
| Texto | 1rem |
| h3 | 1.25rem |
| h2 | 1.75rem |
| h1 | 2.5rem |

Y una advertencia: no hace falta una tipografía distinta para cada zona. Una interfaz coherente usa **una o dos familias** y una escala corta. La variedad tipográfica no es riqueza: casi siempre es falta de decisión.

### Tarea 5 · Tu sistema visual mínimo

Define para tu proyecto, y aplícalo a las cuatro páginas:

1. Familia tipográfica y tamaño base.
2. Una escala de encabezados de tres o cuatro pasos.
3. `line-height` para texto y para titulares.
4. Color de texto, color de fondo y un color principal.
5. Dos o tres medidas de espaciado que vayas a repetir.

Comprueba el contraste de tu color de texto sobre tu fondo con DevTools. Si no llega a 4.5:1, oscurece hasta que llegue.

No buscamos todavía un diseño espectacular. Buscamos **consistencia**: que las cuatro páginas parezcan del mismo sitio.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Respecto a qué se calcula un <code>rem</code>, y por qué importa?</li>
    <li>¿Por qué el <code>line-height</code> se escribe sin unidad?</li>
    <li>¿Cuál es el contraste mínimo para texto normal?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Respecto al tamaño de fuente del elemento raíz. Importa porque respeta la preferencia de tamaño de letra de quien usa la web, cosa que un valor en píxeles ignora.</p>
  <p>2 · Para que cada elemento lo multiplique por su propio tamaño de fuente en lugar de heredar una altura fija.</p>
  <p>3 · 4.5:1 con su fondo. Para texto grande basta 3:1.</p>
</details>

---

## Sesión 6 · Variables y funciones modernas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se declara una decisión de diseño una sola vez, y qué resuelven <code>calc()</code>, <code>min()</code>, <code>max()</code> y <code>clamp()</code>.</li>
    <li><strong>2. Haz:</strong> Convierte los valores repetidos de tu hoja en variables.</li>
    <li><strong>3. Comprueba:</strong> Puedes cambiar el color principal del sitio tocando una sola línea.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Respecto a qué se calculan <code>rem</code>, <code>em</code> y <code>%</code>?</li>
    <li>¿Qué dos decisiones hacen que un párrafo sea legible además del tamaño?</li>
    <li>Detecta el riesgo de repetir el mismo color hexadecimal en veinte reglas.</li>
  </ol>
</div>

### El problema: repetir una decisión

```css
h1     { color: #2563eb; }
button { background: #2563eb; }
a      { color: #2563eb; }
```

Ese color no aparece tres veces: **aparece una decisión, escrita tres veces**. El día que cambie, hay que acordarse de los tres sitios, y del cuarto que se te olvidó.

```css
:root {
    --color-primary: #2563eb;
}

h1     { color: var(--color-primary); }
button { background: var(--color-primary); }
a      { color: var(--color-primary); }
```

<p class="term">Custom property</p>

Una variable de CSS. Se declara con dos guiones, se lee con `var()`, y **se hereda** como cualquier otra propiedad: por eso se declaran en `:root`, que es el elemento raíz, y así están disponibles en todo el documento.

Que se hereden tiene una consecuencia útil: puedes redefinir una variable dentro de un componente y todo lo que haya debajo usará el valor nuevo, sin tocar nada más.

```css
.card--oferta {
    --color-primary: #c2410c;   /* dentro de esta tarjeta, otro primario */
}
```

#### Un sistema pequeño

```css
:root {
    --color-text: #1f2937;
    --color-background: #ffffff;
    --color-primary: #2563eb;

    --space-xs: 0.5rem;
    --space-sm: 1rem;
    --space-md: 1.5rem;
    --space-lg: 3rem;

    --radius: 0.75rem;
}
```

Fíjate en los nombres. `--space-sm` dice **para qué sirve**; `--rem16` diría solo cuánto mide. Un buen nombre de variable describe el papel, no el valor, porque el valor puede cambiar y el papel no.

Y `var()` admite un valor de respaldo, útil cuando la variable puede no estar definida:

```css
padding: var(--space-md, 1.5rem);
```

### Cuatro funciones que quitan media querys

#### `calc()`

Opera entre unidades distintas, que es lo que ninguna otra cosa puede hacer:

```css
width: calc(100% - 2rem);
```

Necesita espacios alrededor del `-` y del `+`. Sin ellos no funciona, y es un despiste que cuesta encontrar.

#### `min()` y `max()`

```css
width: min(90%, 70rem);      /* el más pequeño de los dos */
padding: max(1rem, 3vw);     /* el más grande de los dos */
```

Se leen al revés de lo que parece. `min()` **pone un techo**: nunca pasará de 70rem. `max()` **pone un suelo**: nunca bajará de 1rem.

#### `clamp()`

```css
h1 {
    font-size: clamp(2rem, 5vw, 4rem);
}
```

```text
mínimo      2rem   · nunca más pequeño
preferido   5vw    · lo que se adapta
máximo      4rem   · nunca más grande
```

Ese titular crece con la ventana entre dos límites, sin una sola media query. Es la herramienta con la que se resuelve buena parte del responsive antes de llegar a los *breakpoints*, y volveremos a ella en la semana 4.

### Tarea 6 · Elimina los números mágicos

<p class="term">Número mágico</p>

Un valor escrito a pelo en el código sin que nada explique de dónde sale. `margin-left: 37px` es el ejemplo perfecto: funciona, nadie sabe por qué, y nadie se atreve a tocarlo.

Sobre tu hoja de estilos:

1. Busca los valores que se repiten: colores, espaciados, radios, tamaños.
2. Decide **cuáles representan una decisión reutilizable** y conviértelos en variables con nombres que digan su papel.
3. Sustituye todas sus apariciones por `var()`.
4. Prueba a cambiar `--color-primary` por otro color y recarga. Si el sitio entero cambia de color con una sola línea, lo has hecho bien.
5. Añade un `clamp()` al tamaño de tu `h1` y comprueba cómo se comporta al estrechar la ventana.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Variables con nombres semánticos y un cambio global comprobado.</span></div>
  <div><strong>Si lo tienes</strong><span>Crea una segunda variante visual modificando solo las variables.</span></div>
  <div><strong>Reto</strong><span>Recibe CSS ajeno y distingue qué valores merecen variable y cuáles deben seguir locales.</span></div>
</div>

<div class="rule">
  <p class="rule-label">No conviertas todo en una variable</p>
  <p>Un valor que aparece una sola vez y no es una decisión de diseño no gana nada por ser variable: gana una indirección más que leer. Si <code>border-width: 1px</code> solo está en un sitio, déjalo donde está.</p>
  <p>La pregunta es: <strong>«si esto cambia, ¿tendría que cambiar en otros sitios a la vez?»</strong>. Si la respuesta es sí, es una variable. Si es no, es un valor.</p>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 6 y de la semana 2</p>
  <ul class="checklist">
    <li>Tu hoja empieza con el <code>box-sizing: border-box</code> global.</li>
    <li>Tienes un bloque <code>:root</code> con colores y espaciados nombrados por su papel.</li>
    <li>Puedes cambiar el color principal del sitio tocando una línea.</li>
    <li>Tus anchuras usan <code>max-width</code> o <code>min()</code>, no medidas fijas.</li>
    <li>Las cuatro páginas comparten tipografía, escala y paleta.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué las variables se declaran en <code>:root</code>?</li>
    <li>¿Qué hace <code>min(90%, 70rem)</code>, en una frase?</li>
    <li>¿Qué tres valores lleva <code>clamp()</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque las custom properties se heredan, y <code>:root</code> es el elemento raíz: declarándolas ahí quedan disponibles en todo el documento.</p>
  <p>2 · Ocupa el 90 % del espacio, pero sin pasar nunca de 70rem. Pone un techo.</p>
  <p>3 · Un mínimo, un valor preferido que se adapta, y un máximo.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 2 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Dibuja y nombra las cuatro capas del box model.</li>
    <li>Explica cuándo elegirías <code>rem</code>, <code>%</code> y un píxel.</li>
    <li>Convierte tres colores repetidos en una custom property y predice el efecto de cambiarla.</li>
  </ol>
</div>

---

## Semana 3 · Flujo normal y Flexbox

---

## Sesión 7 · Flujo normal, `display` y posicionamiento

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo coloca el navegador los elementos cuando no le dices nada, y qué pasa cuando sacas uno de ese flujo.</li>
    <li><strong>2. Haz:</strong> Experimenta con los modos de <code>display</code> y de <code>position</code> sobre unas cajas.</li>
    <li><strong>3. Comprueba:</strong> Sabes explicar qué ocurre con el hueco que ocupaba cada elemento.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué problema resuelve una custom property?</li>
    <li>¿En qué se diferencia un valor fijo de uno limitado con <code>clamp()</code>?</li>
    <li>Predice qué cambia si sustituyes <code>var(--color-principal)</code> en la declaración de <code>:root</code>.</li>
  </ol>
</div>

### Antes de Flexbox y Grid está el flujo normal

<p class="term">Flujo normal</p>

La forma en que el navegador coloca los elementos por defecto: unos detrás de otros, siguiendo el orden del documento. Todo lo que veremos después son maneras de **modificarlo**, no de sustituirlo.

Merece la pena entenderlo porque el flujo normal ya resuelve bien muchas cosas. Un artículo con sus párrafos y sus encabezados, uno debajo de otro y ocupando el ancho disponible, no necesita nada.

| Comportamiento | Qué hace | Elementos típicos |
| -------------- | -------- | ----------------- |
| Bloque | Ocupa todo el ancho disponible y empieza en una línea nueva | `div`, `section`, `article`, `p`, `h1` |
| En línea | Ocupa solo lo que mide su contenido y se coloca dentro del texto | `a`, `strong`, `em`, `span`, `img` |

### `display`

```css
display: block;          /* fuerza el comportamiento de bloque */
display: inline;         /* fuerza el de línea */
display: inline-block;   /* fluye como texto, pero acepta ancho, alto y márgenes verticales */
display: none;           /* lo saca del documento por completo */
display: flex;           /* la semana que viene */
display: grid;
```

`inline-block` resuelve la limitación clásica: a un elemento en línea no puedes darle `width` ni márgenes verticales útiles. Con `inline-block` sí, y sigue colocándose en la misma línea que su texto.

<div class="rule">
  <p class="rule-label"><code>display: none</code> no es «invisible»</p>
  <p>Elimina el elemento del documento: no ocupa espacio y <strong>tampoco existe para un lector de pantalla ni para el recorrido con <code>Tab</code></strong>. Eso es correcto cuando quieres ocultar algo de verdad, y es un error cuando solo querías que no se viera.</p>
  <p>Si necesitas que algo siga estando disponible para quien no ve la pantalla, existen otras técnicas. Y si solo querías que ocupara su hueco sin verse, eso es <code>visibility: hidden</code> o una opacidad, no <code>display: none</code>.</p>
</div>

### `position`

```css
position: static;    /* el valor por defecto: sigue el flujo */
position: relative;  /* sigue ocupando su hueco, pero se desplaza respecto a él */
position: absolute;  /* sale del flujo y se coloca respecto a su ancestro posicionado */
position: fixed;     /* sale del flujo y se coloca respecto al viewport */
position: sticky;    /* sigue el flujo hasta llegar a un límite, y entonces se queda */
```

La distinción que importa es **si el elemento deja o no su hueco**:

| Valor | ¿Deja hueco? | Consecuencia |
| ----- | ------------ | ------------ |
| `relative` | Sí | Se mueve, pero los demás siguen contando con él |
| `absolute` | No | Los demás ocupan su sitio como si no existiera |
| `fixed` | No | Igual, y además no se mueve al hacer scroll |
| `sticky` | Sí | Se comporta normal hasta que toca su límite |

`relative` casi nunca se usa para mover nada: se usa para crear el punto de referencia al que un `absolute` hijo se agarrará. De hecho es justo lo que hace el botón de copiar de esta misma página.

```css
.card          { position: relative; }
.card .etiqueta{ position: absolute; top: 0; right: 0; }
```

<div class="rule">
  <p class="rule-label">No se maqueta con <code>position: absolute</code></p>
  <p>Colocar cada bloque de la página con coordenadas parece que funciona, y es la maqueta más frágil que existe: los elementos ya no saben nada unos de otros, así que en cuanto un texto crece se solapan, y en una pantalla más estrecha todo queda fuera de sitio.</p>
  <p><code>absolute</code> es para lo que de verdad es posicionamiento: una etiqueta de «oferta» sobre una esquina, un icono dentro de un campo. La distribución de la página se hace con Flexbox y con Grid.</p>
</div>

### `overflow`

```css
overflow: visible;  /* por defecto: el contenido se sale y se ve */
overflow: auto;     /* aparece barra de scroll si hace falta */
overflow: hidden;   /* se recorta lo que no cabe */
```

`overflow: hidden` es tentador cuando algo desborda, y muchas veces es tapar el problema en lugar de resolverlo: el contenido sigue sin caber, ahora además no se puede leer. Antes de usarlo, pregunta por qué no cabe.

Donde sí es la respuesta correcta es en contenido que legítimamente es más ancho que la pantalla, como una tabla de datos: ahí `overflow-x: auto` en un contenedor le da su propia barra de scroll sin romper la página.

### Tarea 7 · Rompe el flujo

Crea un archivo de pruebas `laboratorio.html` con cuatro cajas de colores, una debajo de otra, y experimenta. Para **cada** apartado anota qué le pasa a la caja y, sobre todo, **qué le pasa al hueco que ocupaba**.

1. Cambia la segunda a `display: inline`. ¿Por qué deja de hacer caso al `width`?
2. Cambia la segunda a `display: inline-block`. ¿Qué recupera?
3. Ponle `position: relative` y desplázala con `top: 20px`. ¿Se han movido las demás?
4. Ponle `position: absolute` con `top: 0; right: 0`. ¿Respecto a qué se ha colocado? Ahora dale `position: relative` a su contenedor y observa la diferencia.
5. Ponle `position: sticky; top: 0` a la primera y haz scroll.
6. Ponle `display: none` a la tercera y compáralo con `visibility: hidden`.

| Apartado | Qué le pasa al elemento | Qué le pasa a su hueco |
| -------- | ----------------------- | ---------------------- |
| | | |

<details class="aside aside--help">
  <summary>Estoy atascado · mi <code>absolute</code> se va a la esquina de la pantalla</summary>
  <p>Un elemento <code>absolute</code> se coloca respecto a su <strong>ancestro posicionado más cercano</strong>, y si no encuentra ninguno, respecto al documento entero. Por eso acaba en la esquina de la página en lugar de en la de su tarjeta.</p>
  <p>La solución es la del ejemplo: darle <code>position: relative</code> al contenedor que quieres que sirva de referencia. Es prácticamente el único uso de <code>relative</code> que verás en código profesional.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>relative</code> y <code>absolute</code> respecto al hueco?</li>
    <li>¿Respecto a qué se posiciona un <code>absolute</code>?</li>
    <li>¿Por qué <code>display: none</code> no es lo mismo que «no se ve»?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>relative</code> sigue ocupando su hueco aunque se desplace; <code>absolute</code> sale del flujo y los demás elementos ocupan su sitio.</p>
  <p>2 · Respecto a su ancestro posicionado más cercano, y si no hay ninguno, respecto al documento.</p>
  <p>3 · Porque lo elimina del documento: deja de existir también para los lectores de pantalla y para el recorrido con <code>Tab</code>.</p>
</details>

---

## Sesión 8 · Flexbox

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Los dos ejes de Flexbox y las cinco propiedades con las que se resuelve casi todo.</li>
    <li><strong>2. Haz:</strong> Convierte la navegación de tu sitio en un Flexbox.</li>
    <li><strong>3. Comprueba:</strong> El menú se comporta razonablemente al estrechar la ventana.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué diferencia hay entre un elemento <code>block</code> y uno <code>inline</code>?</li>
    <li>¿Qué ocurre con el hueco de un elemento en <code>position: absolute</code>?</li>
    <li>Explica por qué <code>display: none</code> no es solo «hacerlo invisible».</li>
  </ol>
</div>

### Una dimensión

Flexbox distribuye elementos **en una línea**: o en fila, o en columna. Ese es el criterio para elegirlo, y lo veremos enfrentado a Grid en la semana 4.

En la UD1 dejaste el menú así:

```html
<nav aria-label="Navegación principal">
    <ul>
        <li><a href="index.html">Inicio</a></li>
        <li><a href="productos.html">Productos</a></li>
    </ul>
</nav>
```

Con dos declaraciones deja de ser una lista vertical:

```css
nav ul {
    display: flex;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
}
```

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>La misma lista semántica, ahora distribuida en una fila</strong></figcaption>
  <div class="lesson-demo__stage">
    <nav class="lesson-flex-nav" aria-label="Demostración de navegación con Flexbox">
      <strong>PixelStore</strong>
      <ul>
        <li><a href="#">Inicio</a></li>
        <li><a href="#">Productos</a></li>
        <li><a href="#">Contacto</a></li>
      </ul>
    </nav>
  </div>
  <p class="lesson-demo__note"><code>display: flex</code> cambia la distribución; <code>gap</code> crea únicamente el espacio entre enlaces.</p>
</figure>

Fíjate en algo: **el HTML no se ha tocado**. Sigue siendo una lista de enlaces, que es lo que es. Solo ha cambiado cómo se dibuja.

### Los dos ejes

<figure class="diagram">
  <figcaption>Los ejes con <code>flex-direction: row</code></figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Eje principal · horizontal</li>
    <li>Eje transversal · vertical</li>
  </ol>
</figure>

Todo Flexbox tiene un **eje principal**, que es por donde se colocan los elementos, y un **eje transversal**, el perpendicular. Cuál es cuál lo decide `flex-direction`:

```css
flex-direction: row;     /* por defecto: principal horizontal */
flex-direction: column;  /* principal vertical */
```

<div class="rule">
  <p class="rule-label">La confusión que te va a pasar</p>
  <p><code>justify-content</code> siempre actúa sobre el <strong>eje principal</strong> y <code>align-items</code> sobre el <strong>transversal</strong>. No sobre «horizontal» y «vertical».</p>
  <p>Por eso, en cuanto pones <code>flex-direction: column</code>, las dos se intercambian: <code>justify-content</code> pasa a mover en vertical y <code>align-items</code> en horizontal. Cuando algo no se alinee como esperas, la primera pregunta es <strong>cuál es ahora el eje principal</strong>.</p>
</div>

### Las cinco propiedades del contenedor

```css
.barra {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
}
```

| Propiedad | Qué hace |
| --------- | -------- |
| `justify-content` | Reparte el espacio sobrante **en el eje principal** |
| `align-items` | Alinea los elementos **en el eje transversal** |
| `gap` | Separación entre elementos, sin márgenes ni el último elemento sobrando |
| `flex-wrap` | Permite que los elementos salten de línea cuando no caben |

Valores útiles de `justify-content`: `flex-start`, `center`, `flex-end`, `space-between` —los extremos pegados a los bordes y el hueco repartido en medio— y `space-around`.

De `align-items`: `stretch` (por defecto, todos igual de altos), `center`, `flex-start`, `flex-end`, `baseline`.

<p class="term">gap</p>

La separación entre elementos de un contenedor Flexbox o Grid. Sustituye a los márgenes y evita su problema clásico: no deja un margen sobrante en el último elemento, y no sufre el colapso de márgenes.

### En los elementos hijos

```css
.logo    { flex: 0 0 auto; }   /* no crece, no se encoge, mide lo que mida */
.buscador{ flex: 1; }          /* se queda con todo el espacio sobrante */
```

`flex` resume tres propiedades: cuánto puede crecer, cuánto puede encogerse y cuál es su tamaño de partida. `flex: 1` es el atajo que más vas a usar, y significa «reparte el espacio que sobre entre los elementos que lo tengan».

`margin-left: auto` en un hijo también tiene un efecto muy útil: empuja ese elemento y todos los siguientes hasta el final del eje. Es la forma limpia de separar un grupo del resto en una barra.

### Tarea 8 · La navegación de tu sitio

Transforma la cabecera de tus cuatro páginas:

1. La navegación en fila, con separación mediante `gap` y sin viñetas.
2. El nombre del sitio a un lado y el menú al otro, en la misma línea.
3. Los dos bloques alineados verticalmente entre sí.
4. `flex-wrap` para que el menú no desborde cuando falte espacio.
5. Comprueba a 360 px de ancho en DevTools que nada se sale de la pantalla.

<div class="rule">
  <p class="rule-label">Lo que no vale</p>
  <p>Nada de <code>margin-left: 73px</code> para colocar cada elemento en su sitio. Si un número así aparece en tu CSS, significa que has medido la pantalla en la que estás mirando: en otra estará mal.</p>
  <p>La forma de colocar en Flexbox es decir <strong>cómo se reparte el espacio</strong>, no dónde va cada cosa.</p>
</div>

<details class="aside aside--help">
  <summary>Estoy atascado · <code>align-items: center</code> no centra nada</summary>
  <p>Comprueba dos cosas, en este orden:</p>
  <ol>
    <li><strong>Que lo has puesto en el contenedor</strong>, no en los hijos. <code>justify-content</code> y <code>align-items</code> van siempre en el elemento que tiene <code>display: flex</code>.</li>
    <li><strong>Cuál es el eje principal.</strong> Si has puesto <code>flex-direction: column</code>, para centrar en vertical necesitas <code>justify-content</code>, no <code>align-items</code>.</li>
  </ol>
  <p>Y usa el inspector de Flexbox: junto al elemento aparece un icono <code>flex</code> en DevTools que dibuja los ejes y el espacio libre.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Sobre qué eje actúa <code>justify-content</code>?</li>
    <li>¿Qué le pasa a <code>align-items</code> si cambias a <code>flex-direction: column</code>?</li>
    <li>¿Por qué <code>gap</code> es mejor que poner márgenes a los hijos?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Sobre el eje principal, sea cual sea su dirección.</p>
  <p>2 · Pasa a alinear en horizontal, porque el eje transversal ahora es el horizontal.</p>
  <p>3 · Porque separa solo entre elementos, sin dejar un margen sobrante al final, y no sufre el colapso de márgenes.</p>
</details>

---

## Sesión 9 · Flexbox sobre problemas reales

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se razona un layout de Flexbox en lugar de buscar la receta en internet.</li>
    <li><strong>2. Haz:</strong> Construye tres componentes distintos y justifica cada decisión.</li>
    <li><strong>3. Comprueba:</strong> Sabes decir para cada uno cuál es el eje principal.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cómo se determinan el eje principal y el eje cruzado?</li>
    <li>¿Qué diferencia hay entre <code>justify-content</code> y <code>align-items</code>?</li>
    <li>Una navegación desborda: ¿qué revisarías antes de reducir la fuente?</li>
  </ol>
</div>

### El método, en tres preguntas

Cuando te enfrentes a un componente, no busques la propiedad: contesta esto.

<figure class="diagram">
  <figcaption>Cómo se razona un Flexbox</figcaption>
  <ol class="flow">
    <li>¿Qué elementos tengo que colocar en una misma línea?</li>
    <li>¿En qué dirección van: fila o columna? Ese es el eje principal</li>
    <li>¿Qué hago con el espacio que sobra en ese eje, y cómo alineo en el otro?</li>
  </ol>
</figure>

Con eso, `justify-content` y `align-items` dejan de ser prueba y error.

### Caso 1 · Una botonera

```html
<div class="acciones">
    <button type="submit">Guardar</button>
    <button type="button">Cancelar</button>
</div>
```

<dl class="worked">
  <dt>¿Qué coloco?</dt>
  <dd>Dos botones, uno al lado del otro.</dd>
  <dt>¿Eje principal?</dt>
  <dd>Fila. Es el valor por defecto, así que no hace falta escribir <code>flex-direction</code>.</dd>
  <dt>¿Y el espacio sobrante?</dt>
  <dd>Depende de lo que quiera: pegados a la izquierda es <code>flex-start</code>; a la derecha, como en un formulario, es <code>flex-end</code>.</dd>
</dl>

```css
.acciones {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-sm);
}
```

### Caso 2 · Una tarjeta horizontal

```text
┌───────────────────────────────────┐
│ imagen │ título                   │
│        │ descripción              │
│        │ precio            botón  │
└───────────────────────────────────┘
```

Aquí hay **dos Flexbox anidados**, y verlo es media solución:

1. Uno exterior en fila: imagen a un lado, información al otro.
2. Uno interior en columna dentro de la información: título, descripción y la línea del precio.
3. Y un tercero en fila para esa última línea, con el precio a la izquierda y el botón a la derecha.

```css
.producto        { display: flex; gap: var(--space-md); }
.producto__datos { display: flex; flex-direction: column; gap: var(--space-xs); }
.producto__pie   { display: flex; justify-content: space-between; align-items: center; }
```

Anidar contenedores es normal y no es un síntoma de nada malo. Cada uno resuelve una dimensión.

### Caso 3 · Centrar

El problema con más recetas copiadas de internet de toda la historia de CSS. Con Flexbox son dos líneas, pero conviene entenderlas:

```css
.caja {
    display: flex;
    justify-content: center;   /* centra en el eje principal */
    align-items: center;       /* centra en el transversal */
}
```

Centrar es simplemente **centrar en los dos ejes a la vez**. Si solo necesitas uno, solo escribes uno.

### Reto 2 · Los tres centrados (10 min)

Tienes tres cajas, cada una con un cuadrado dentro. Consigue, sin `position` y sin márgenes fijos:

1. El cuadrado centrado en horizontal, arriba del todo.
2. El cuadrado centrado en vertical, pegado a la derecha.
3. El cuadrado centrado en los dos ejes.

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 2</summary>
  <p>Con <code>display: flex</code> y dirección por defecto (fila):</p>
  <p>1 · <code>justify-content: center;</code> y nada más: el eje principal es el horizontal, y sin <code>align-items</code> el hijo se queda arriba si tiene altura propia.</p>
  <p>2 · <code>justify-content: flex-end; align-items: center;</code></p>
  <p>3 · <code>justify-content: center; align-items: center;</code></p>
  <p>Y la comprobación de que lo has entendido: con <code>flex-direction: column</code>, los tres se resuelven intercambiando las dos propiedades.</p>
</details>

### Microrevisión · diez minutos, sin nota

Intercambia con un compañero únicamente una sección que ya hayas maquetado. Encuentra **una decisión de layout que no puedas justificar** y descríbela así:

1. **Qué intenta resolver:** tamaño, espacio, distribución o estado.
2. **Qué regla actúa:** compruébala en DevTools.
3. **Qué duda queda:** por qué Flexbox, Grid o el flujo normal podrían encajar mejor.

El autor decide si cambia el código o conserva la decisión y la justifica. No se valora que ambos tengáis el mismo gusto visual.

### Tarea 9 · Flexbox Challenge

Construye estos tres componentes usando **solo Flexbox**, y aplícalos a tu proyecto donde encajen:

**A · La barra de cabecera**, con el nombre del sitio a la izquierda, la navegación a la derecha y todo alineado verticalmente.

**B · La tarjeta horizontal** del caso 2, que debe seguir funcionando cuando la descripción sea el doble de larga.

**C · Una línea de metadatos** —fecha, autor, categoría— separada por `gap`, que salte de línea con elegancia cuando no quepa.

Para cada uno responde por escrito:

| Componente | Eje principal | Por qué ese `justify-content` | Por qué ese `align-items` | ¿Necesitó `flex-wrap`? |
| ---------- | ------------- | ----------------------------- | ------------------------- | ---------------------- |
| A | | | | |
| B | | | | |
| C | | | | |

Esa tabla es la tarea. El CSS lo puede escribir cualquiera copiando; la tabla solo la puede rellenar quien ha entendido los ejes.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Resuelve A, B y C, completa la tabla y evita desbordamientos.</span></div>
  <div><strong>Si lo tienes</strong><span>Duplica la longitud del contenido y adapta la solución sin cambiar el HTML.</span></div>
  <div><strong>Reto</strong><span>Recibe un cuarto componente y decide primero si necesita Flexbox, Grid o ninguno.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 9 y de la semana 3</p>
  <ul class="checklist">
    <li>Sabes identificar el eje principal de cualquier Flexbox.</li>
    <li>Sabes que <code>justify-content</code> y <code>align-items</code> se intercambian al cambiar la dirección.</li>
    <li>Usas <code>gap</code> en lugar de márgenes para separar.</li>
    <li>Tu navegación funciona a 360 px sin desbordar.</li>
    <li>No hay ningún valor en píxeles colocando elementos a mano.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Enuncia las tres preguntas con las que se razona un Flexbox.</li>
    <li>¿Está mal anidar un Flexbox dentro de otro?</li>
    <li>¿Qué hace <code>margin-left: auto</code> en un hijo de un Flexbox?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Qué elementos van en la misma línea, en qué dirección —ese es el eje principal— y qué hago con el espacio sobrante y con la alineación en el otro eje.</p>
  <p>2 · No. Es lo normal: cada contenedor resuelve una dimensión, y una tarjeta suele necesitar dos o tres.</p>
  <p>3 · Absorbe todo el espacio sobrante por ese lado, empujando ese elemento y los siguientes al final del eje.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 3 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Elige cuáles resolverías con Flexbox: navegación, botonera, tabla de datos y tarjeta horizontal.</li>
    <li>Escribe únicamente el CSS imprescindible para una botonera que pueda saltar de línea.</li>
    <li>Predice qué cambia al pasar de <code>row</code> a <code>column</code>.</li>
  </ol>
</div>

---

## Semana 4 · Grid y responsive

---

## Sesión 10 · CSS Grid

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué problema resuelve Grid que Flexbox no, y qué significa la unidad <code>fr</code>.</li>
    <li><strong>2. Haz:</strong> Convierte tu catálogo en una cuadrícula.</li>
    <li><strong>3. Comprueba:</strong> Observa qué pasa al estrechar la ventana. Todavía no lo arregles.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuál es la diferencia entre <code>margin</code> y <code>gap</code>?</li>
    <li>¿Qué hace <code>flex-wrap</code>?</li>
    <li>Decide si una botonera, una tarjeta horizontal y un catálogo necesitan Flexbox, Grid o ninguno.</li>
  </ol>
</div>

### Dos dimensiones a la vez

Flexbox coloca en una línea. Pero mira este problema:

```text
Producto  Producto  Producto
Producto  Producto  Producto
Producto  Producto  Producto
```

Aquí no hay una dirección: hay filas **y** columnas, y quieres que las columnas estén alineadas entre filas. Con Flexbox se puede aproximar, y las columnas nunca acaban de cuadrar porque cada fila reparte su espacio por su cuenta. Grid está diseñado exactamente para esto.

```css
.catalogo {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
}
```

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>Tres columnas alineadas y filas creadas automáticamente</strong></figcaption>
  <div class="lesson-demo__stage">
    <div class="lesson-grid-catalogue">
      <article><h4>Nova 14</h4><p>Portátil ligero</p></article>
      <article><h4>Vision 27</h4><p>Monitor IPS</p></article>
      <article><h4>Type Pro</h4><p>Teclado mecánico</p></article>
      <article><h4>Dock One</h4><p>Base USB-C</p></article>
      <article><h4>Wave</h4><p>Ratón inalámbrico</p></article>
      <article><h4>Focus</h4><p>Webcam 2K</p></article>
    </div>
  </div>
  <p class="lesson-demo__note">Grid alinea cada tarjeta con las columnas de las demás filas; por eso es una herramienta bidimensional.</p>
</figure>

Tres declaraciones y tienes una cuadrícula de tres columnas con sus filas alineadas. Fíjate en que **no has dicho cuántas filas hay**: Grid las crea según los elementos que haya.

### La unidad `fr`

<p class="term">fr</p>

Una fracción del espacio **libre** del contenedor. `1fr 1fr 1fr` reparte lo disponible en tres partes iguales; `2fr 1fr` da el doble a la primera columna.

Es distinta del porcentaje, y la diferencia importa: `33.33%` no descuenta el `gap`, así que tres columnas al 33.33 % con separación desbordan. `1fr` sí lo descuenta, porque reparte lo que queda **después** de los huecos. Por eso con Grid no tienes que hacer cuentas.

```css
grid-template-columns: repeat(3, 1fr);   /* lo mismo, sin repetirte */
grid-template-columns: 250px 1fr;        /* una fija y otra elástica */
grid-template-columns: 1fr 2fr;          /* una parte y dos partes */
```

`repeat()` es solo una abreviatura, pero se vuelve importante en la sesión siguiente.

### El vocabulario

<figure class="diagram">
  <figcaption>Las piezas de una cuadrícula</figcaption>
  <ol class="flow">
    <li>Líneas · las divisiones, numeradas desde 1</li>
    <li>Pistas · las columnas y filas que quedan entre líneas</li>
    <li>Celdas · el cruce de una columna con una fila</li>
    <li>Áreas · un grupo rectangular de celdas, que puedes nombrar</li>
  </ol>
</figure>

Conviene fijarse en que **se numeran las líneas, no las columnas**. Una cuadrícula de tres columnas tiene cuatro líneas verticales: la 1 al principio y la 4 al final. Es la fuente de casi todos los desajustes de la sesión siguiente.

### El inspector de Grid

En DevTools, junto a un elemento con `display: grid`, aparece una etiqueta `grid`. Púlsala y el navegador dibuja encima de la página las líneas con su numeración, las pistas y los huecos.

<div class="rule">
  <p class="rule-label">Úsalo siempre</p>
  <p>No intentes imaginar mentalmente una cuadrícula compleja si el navegador puede dibujártela. Cuando un elemento no cae donde esperabas, el inspector te enseña en un segundo qué línea es la 3 de verdad.</p>
</div>

### Tarea 10 · Tu catálogo en cuadrícula

En `productos.html`, convierte el contenedor de las fichas en un Grid.

1. Aplica `display: grid` y `gap` al contenedor de los `article`.
2. Prueba `repeat(2, 1fr)`, después `repeat(3, 1fr)` y después `repeat(4, 1fr)`. Quédate con la que mejor te encaje en tu pantalla.
3. Abre el inspector de Grid y localiza las líneas, las pistas y los huecos.
4. Ahora **estrecha la ventana hasta 400 px** y observa qué pasa con las tarjetas.

<div class="rule">
  <p class="rule-label">Todavía no lo arregles</p>
  <p>Vas a ver columnas ridículamente estrechas, con una palabra por línea. Es lo esperado, y es el problema que resuelve la sesión de mañana.</p>
  <p>Anota qué has visto y a qué anchura ha empezado a verse mal. Ese número es tu primer <em>breakpoint</em> candidato, y lo has obtenido de la única forma legítima: mirando cuándo el contenido deja de funcionar.</p>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Cuándo eliges Grid en lugar de Flexbox?</li>
    <li>¿Por qué <code>1fr</code> no es lo mismo que <code>33.33%</code>?</li>
    <li>Una cuadrícula de cuatro columnas, ¿cuántas líneas verticales tiene?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Cuando el problema tiene filas y columnas a la vez y quieres que se alineen entre sí.</p>
  <p>2 · Porque <code>fr</code> reparte el espacio que queda <strong>después</strong> de descontar los <code>gap</code>, y el porcentaje no los descuenta.</p>
  <p>3 · Cinco: una a cada lado de cada columna, contando los dos extremos.</p>
</details>

---

## Sesión 11 · Grid adaptable y áreas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo hacer que el número de columnas lo decida el espacio, y cómo colocar elementos por líneas o por áreas.</li>
    <li><strong>2. Haz:</strong> Construye un catálogo que se adapta solo y un layout de página completa.</li>
    <li><strong>3. Comprueba:</strong> El catálogo funciona de 320 px a 1600 px sin una media query.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué problema bidimensional resuelve Grid mejor que Flexbox?</li>
    <li>¿Qué significa <code>1fr</code>?</li>
    <li>Predice qué ocurre con <code>grid-template-columns: repeat(3, 1fr)</code> a 320 px.</li>
  </ol>
</div>

### La línea que resuelve el problema de ayer

```css
.catalogo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: 1.5rem;
}
```

Léela de dentro afuera:

```text
minmax(16rem, 1fr)    cada columna mide como poco 16rem,
                      y crece para repartirse lo que sobre

auto-fit              caben las que quepan; el número
                      lo decide el espacio disponible
```

Es decir: **deja de decir cuántas columnas quieres y describe cuánto necesita cada una**. En un móvil cabrá una, en una tablet dos, en un monitor cuatro, y no has escrito una sola media query. Esta línea es probablemente la más rentable de toda la unidad.

#### `auto-fit` contra `auto-fill`

Se parecen y hacen cosas distintas cuando **sobra sitio**:

| | Con pocos elementos y mucho espacio |
| --- | --- |
| `auto-fit` | Las columnas vacías se colapsan, y las que hay se estiran para ocuparlo todo |
| `auto-fill` | Se mantienen las columnas vacías, y los elementos conservan su tamaño |

La forma de verlo es la experimentación: pon tres tarjetas en una pantalla ancha y cambia una palabra por la otra. Con `auto-fit` las tres se estiran; con `auto-fill` se quedan a la izquierda con su tamaño.

### Colocar elementos concretos

A veces un elemento debe ocupar más de una celda:

```css
.destacado {
    grid-column: 1 / 3;    /* de la línea 1 a la 3: dos columnas */
}

.destacado {
    grid-column: span 2;   /* dos columnas, empiece donde empiece */
}
```

`span` suele ser más robusto: no depende de dónde acabe cayendo el elemento, cosa que cambia al variar el número de columnas.

### Áreas con nombre

Para el esqueleto de una página completa hay una forma que se lee sola:

```css
.layout {
    display: grid;
    grid-template-columns: 15rem 1fr;
    grid-template-areas:
        "cabecera cabecera"
        "lateral  principal"
        "pie      pie";
    gap: 1rem;
}

header { grid-area: cabecera; }
aside  { grid-area: lateral; }
main   { grid-area: principal; }
footer { grid-area: pie; }
```

El dibujo entre comillas **es** el layout. Se ve de un vistazo que la cabecera ocupa las dos columnas y que el lateral está a la izquierda del contenido. Y para cambiarlo en móvil basta con redibujarlo:

```css
@media (width < 48rem) {
    .layout {
        grid-template-columns: 1fr;
        grid-template-areas:
            "cabecera"
            "principal"
            "lateral"
            "pie";
    }
}
```

Fíjate en un detalle importante: en el móvil hemos puesto el contenido **antes** que el lateral, y el HTML no ha cambiado. Grid permite reordenar visualmente.

<div class="rule">
  <p class="rule-label">Reordenar visualmente tiene un límite</p>
  <p>El orden del teclado sigue al <strong>HTML</strong>, no al CSS. Si mueves visualmente un bloque muy lejos de su sitio en el documento, quien navegue con <code>Tab</code> saltará de un lado a otro de la pantalla sin lógica aparente.</p>
  <p>Reordenar el lateral y el contenido, que están contiguos, es inofensivo. Reordenar a lo grande no lo es. Si el orden visual y el del documento tienen que diferir mucho, lo que está mal es el orden del HTML.</p>
</div>

### Flexbox o Grid

No compiten. Una regla inicial que funciona:

<figure class="diagram">
  <figcaption>Cómo elegir</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Una dimensión · Flexbox</li>
    <li>Filas y columnas a la vez · Grid</li>
  </ol>
</figure>

Y una segunda pregunta que afina más: **¿quién debería decidir el tamaño, el contenedor o el contenido?** Grid define la cuadrícula desde fuera y el contenido se acomoda; Flexbox parte de los elementos y reparte lo que sobra. Un menú cuyos enlaces miden cada uno lo suyo es Flexbox. Un catálogo cuyas tarjetas deben coincidir es Grid.

Lo más habitual en código real es que convivan:

```text
GRID     para distribuir las tarjetas
  ↓
FLEXBOX  dentro de cada tarjeta
```

### Reto 3 · ¿Flexbox, Grid, los dos o ninguno? (15 min)

Para cada interfaz, decide y justifica en una frase:

1. La navegación principal.
2. Una galería de imágenes en cuadrícula.
3. Una botonera de dos botones.
4. Un formulario de etiquetas y campos, uno debajo de otro.
5. El catálogo de productos.
6. Un panel con seis indicadores, uno de ellos del doble de ancho.
7. La barra de precio y botón dentro de una tarjeta.
8. El pie con tres columnas de enlaces.

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 3</summary>
  <p>1 · <strong>Flexbox.</strong> Una línea de enlaces que miden lo que miden.</p>
  <p>2 · <strong>Grid.</strong> Filas y columnas que deben alinearse.</p>
  <p>3 · <strong>Flexbox.</strong> Una dimensión y dos elementos.</p>
  <p>4 · <strong>Ninguno.</strong> El flujo normal ya apila bloques; basta con márgenes o un <code>gap</code> si lo envuelves. No todo necesita un sistema de layout.</p>
  <p>5 · <strong>Grid</strong> para la cuadrícula, y <strong>Flexbox</strong> dentro de cada tarjeta. Los dos.</p>
  <p>6 · <strong>Grid.</strong> Además el indicador ancho se resuelve con <code>span 2</code>, que en Flexbox sería incómodo.</p>
  <p>7 · <strong>Flexbox</strong> con <code>space-between</code>. Una dimensión.</p>
  <p>8 · <strong>Grid</strong> si las tres columnas deben tener el mismo ancho; <strong>Flexbox</strong> si cada una puede medir lo suyo. Aquí las dos respuestas son defendibles, y lo que se evalúa es la justificación.</p>
</details>

### Tarea 11 · Grid Challenge

**A · El catálogo que se adapta solo.** Aplica `auto-fit` con `minmax()` a tu página de productos. Comprueba de 320 px a 1600 px que en ningún momento hay columnas ilegibles ni tarjetas gigantes. Prueba también con `auto-fill` y explica en un comentario cuál has elegido y por qué.

**B · El esqueleto de página.** Construye este layout con `grid-template-areas`:

```text
┌───────────────────────────┐
│          HEADER           │
├─────────┬─────────────────┤
│ ASIDE   │      MAIN       │
│         │                 │
├─────────┴─────────────────┤
│          FOOTER           │
└───────────────────────────┘
```

y su versión en una columna para pantallas estrechas. Decide tú a qué anchura cambia, y justifícalo por el contenido.

<details class="aside aside--help">
  <summary>Estoy atascado · un elemento no cae donde quiero</summary>
  <p>Abre el inspector de Grid y mira <strong>la numeración real de las líneas</strong>. El error casi siempre es contar columnas en lugar de líneas: para ocupar las dos primeras columnas hace falta <code>1 / 3</code>, no <code>1 / 2</code>.</p>
  <p>Y si usas áreas, comprueba que todas las filas del dibujo tienen <strong>el mismo número de nombres</strong>. Si una fila tiene dos y otra tres, la plantilla entera es inválida y se ignora en silencio.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué hace <code>repeat(auto-fit, minmax(16rem, 1fr))</code>, en una frase?</li>
    <li>¿En qué se diferencian <code>auto-fit</code> y <code>auto-fill</code>?</li>
    <li>¿Qué riesgo tiene reordenar visualmente con Grid?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Crea tantas columnas como quepan, de al menos 16rem cada una, repartiéndose el espacio sobrante.</p>
  <p>2 · Cuando sobra espacio, <code>auto-fit</code> colapsa las columnas vacías y estira las que hay; <code>auto-fill</code> las mantiene y deja los elementos con su tamaño.</p>
  <p>3 · Que el orden del teclado sigue al HTML, así que un reordenado grande hace que el foco salte por la pantalla sin lógica.</p>
</details>

---

## Sesión 12 · Responsive: fluido primero

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué la mayoría de las adaptaciones no necesitan media query, y dónde se ponen las que sí.</li>
    <li><strong>2. Haz:</strong> Rompe tu propia página a cinco anchuras y arregla lo que encuentres.</li>
    <li><strong>3. Comprueba:</strong> No hay scroll horizontal en ninguna de las cinco.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué hacen juntos <code>auto-fit</code>, <code>minmax()</code> y <code>1fr</code>?</li>
    <li>¿Cuándo elegirías Flexbox y cuándo Grid?</li>
    <li>Este Grid no se adapta: <code>repeat(4, 250px)</code>. Propón una estrategia, no una cifra nueva.</li>
  </ol>
</div>

### Una web no se diseña para 1920 × 1080

Quien entre a tu sitio puede hacerlo desde un móvil, una tablet, un portátil, un monitor grande, media pantalla en una ventana dividida, o un dispositivo que todavía no existe. No puedes enumerarlos.

Por eso el orden correcto es este, y casi nadie lo respeta:

<figure class="diagram">
  <figcaption>El orden del responsive</figcaption>
  <ol class="flow">
    <li>Primero, que el diseño se adapte solo</li>
    <li>Después, media queries solo donde el contenido ya no funcione</li>
  </ol>
</figure>

### Lo que ya se adapta sin media queries

Llevas cuatro semanas construyendo herramientas que hacen esto:

| Herramienta | Qué adapta sola |
| ----------- | --------------- |
| `max-width` y `min()` | La anchura de los contenedores |
| `flex-wrap` | El salto de línea cuando no caben |
| `auto-fit` con `minmax()` | El número de columnas del catálogo |
| `clamp()` | El tamaño de los titulares |
| `gap` | La separación, sin cuentas |

Si las usas bien, buena parte de tu sitio ya es responsive y no lo sabías. Las media queries son para lo que queda.

### Mobile first

<p class="term">Mobile first</p>

Escribir primero los estilos de la disposición más sencilla —una columna— y añadir después las variantes para pantallas anchas con `min-width`, en lugar de al revés.

```css
/* Base: una columna. Vale para cualquier pantalla. */
.catalogo {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

@media (width >= 48rem) {
    .catalogo { grid-template-columns: repeat(2, 1fr); }
}

@media (width >= 70rem) {
    .catalogo { grid-template-columns: repeat(3, 1fr); }
}
```

<figure class="lesson-demo">
  <figcaption><span>Vista previa</span><strong>Un mismo catálogo en tres espacios disponibles</strong></figcaption>
  <div class="lesson-demo__stage lesson-responsive-frames">
    <div class="lesson-responsive-frame">
      <span>Base · 1 columna</span>
      <div><i>A</i><i>B</i><i>C</i></div>
    </div>
    <div class="lesson-responsive-frame lesson-responsive-frame--tablet">
      <span>≥ 48rem · 2 columnas</span>
      <div><i>A</i><i>B</i><i>C</i><i>D</i></div>
    </div>
    <div class="lesson-responsive-frame lesson-responsive-frame--wide">
      <span>≥ 70rem · 3 columnas</span>
      <div><i>A</i><i>B</i><i>C</i><i>D</i><i>E</i><i>F</i></div>
    </div>
  </div>
  <p class="lesson-demo__note">Mobile first parte de una columna y añade capacidad solo cuando el contenido dispone de espacio suficiente.</p>
</figure>

La razón no es ideológica: **el caso de una columna es el más simple**, y partir de lo simple para añadir complejidad da menos código que partir de lo complejo para irlo deshaciendo.

La sintaxis `(width >= 48rem)` es la moderna y se lee sola. Encontrarás también la clásica, `(min-width: 48rem)`, que significa lo mismo.

<div class="rule">
  <p class="rule-label">Los breakpoints no son teléfonos</p>
  <p>No busques las medidas del iPhone 15 ni del Galaxy de turno. Esa lista cambia cada año y nunca está completa.</p>
  <p>Un <em>breakpoint</em> va donde <strong>tu contenido deja de funcionar</strong>: donde el menú ya no cabe, donde una columna se queda demasiado estrecha para leerse, donde la tarjeta se rompe. Esa anchura la encuentras estirando la ventana hasta que se ve mal, y es distinta en cada proyecto porque cada proyecto tiene otro contenido.</p>
  <p>Por eso en la sesión 10 te pedí que anotaras a qué anchura empezaba a verse mal el catálogo. Ese número vale más que cualquier lista de dispositivos.</p>
</div>

### Tarea 12 · Rompe tu página

Con DevTools en modo dispositivo, recorre tu sitio a estas anchuras:

```text
320 px    móvil pequeño
375 px    móvil habitual
768 px    tablet
1024 px   portátil
1440 px   escritorio
```

Y busca, en las cuatro páginas:

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Prueba las cinco anchuras, elimina el scroll horizontal y documenta cada causa.</span></div>
  <div><strong>Si lo tienes</strong><span>Duplica la longitud de títulos y navegación y vuelve a probar.</span></div>
  <div><strong>Reto</strong><span>Corrige una página ajena sin conocer sus breakpoints ni añadir uno por defecto.</span></div>
</div>

| Problema | ¿Dónde aparece? | A qué anchura | Cómo lo has resuelto |
| -------- | --------------- | ------------- | -------------------- |
| Contenido que se sale | | | |
| Scroll horizontal | | | |
| Navegación que no cabe | | | |
| Imágenes demasiado grandes | | | |
| Columnas demasiado estrechas | | | |
| Texto difícil de leer | | | |

Después corrígelos, **intentando primero sin media query**. Si lo resuelves con `flex-wrap`, con `minmax()` o con `clamp()`, mejor que con un *breakpoint*: no hay que mantenerlo.

<details class="aside aside--help">
  <summary>Estoy atascado · tengo scroll horizontal y no sé de dónde sale</summary>
  <p>Es de los fallos más frustrantes, porque el culpable puede estar en cualquier sitio. Sospechosos por orden de frecuencia:</p>
  <ol>
    <li>Una imagen sin <code>max-width: 100%</code>.</li>
    <li>Un <code>width</code> fijo en píxeles mayor que la pantalla.</li>
    <li>Un elemento con <code>100%</code> más un <code>padding</code>, sin <code>box-sizing: border-box</code>.</li>
    <li>Una tabla, o un bloque de código, que no cabe y no tiene su propio <code>overflow-x: auto</code>.</li>
    <li>Un <code>margin</code> negativo.</li>
  </ol>
  <p>Para localizarlo rápido, en la consola de DevTools puedes recorrer los elementos y ver cuál es más ancho que el documento. O, a lo bruto: ve dando <code>outline: 1px solid red</code> a secciones enteras hasta ver cuál se sale.</p>
</details>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 12 y de la semana 4</p>
  <ul class="checklist">
    <li>Tu catálogo se adapta sin media queries.</li>
    <li>No hay scroll horizontal a 320 px en ninguna página.</li>
    <li>Cada media query que has escrito responde a un problema concreto que puedes nombrar.</li>
    <li>Ninguno de tus breakpoints procede de un modelo de teléfono.</li>
    <li>Sabes justificar, para cada bloque, si es Flexbox o Grid.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué significa mobile first y por qué se hace así?</li>
    <li>¿Dónde debe ir un breakpoint?</li>
    <li>Nombra tres herramientas que adaptan sin necesitar media query.</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Escribir primero la disposición más simple y añadir después las de pantallas anchas. Porque partir de lo simple y añadir sale más corto que partir de lo complejo y deshacer.</p>
  <p>2 · Donde el contenido deja de funcionar, no donde está un modelo de dispositivo.</p>
  <p>3 · <code>max-width</code>, <code>flex-wrap</code>, <code>auto-fit</code> con <code>minmax()</code>, <code>clamp()</code>, <code>gap</code>. Bastan tres.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 4 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Decide entre Flexbox, Grid o flujo normal para tres interfaces que no has visto.</li>
    <li>Escribe un Grid adaptable sin media query.</li>
    <li>Una página desborda a 360 px: enumera tres comprobaciones antes de añadir un breakpoint.</li>
  </ol>
</div>

---

## Semana 5 · Imágenes, estados y movimiento

---

## Sesión 13 · Imágenes y medios adaptables

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué una imagen rompe un layout y cómo se encajan imágenes de tamaños distintos sin deformarlas.</li>
    <li><strong>2. Haz:</strong> Consigue un catálogo visualmente coherente con imágenes irregulares.</li>
    <li><strong>3. Comprueba:</strong> Ninguna imagen está estirada ni aplastada.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué significa trabajar <em>mobile first</em>?</li>
    <li>¿Qué diferencia hay entre un layout fluido y una media query?</li>
    <li>Ordena el diagnóstico de un desbordamiento horizontal antes de escribir CSS nuevo.</li>
  </ol>
</div>

### La regla que va en toda hoja de estilos

Una imagen tiene un tamaño propio, y si es más ancha que su contenedor, se sale. Es la causa número uno de scroll horizontal.

```css
img {
    max-width: 100%;
    height: auto;
}
```

`max-width: 100%` impide que sobrepase a su contenedor. `height: auto` es imprescindible junto a la anterior: sin ella, si el HTML declaraba `width` y `height` —como pedíamos en la UD1—, al reducirse el ancho la altura se quedaría fija y la imagen se deformaría.

### `object-fit`

El problema real de un catálogo: las fotos de producto vienen con tamaños y proporciones distintas, y las tarjetas quedan desiguales.

La tentación es forzarlas:

```css
/* Mal: deforma */
.card img { width: 100%; height: 15rem; }
```

Eso estira o aplasta la imagen. La solución es decirle **cómo debe encajar** en el hueco que le das:

```css
.card img {
    width: 100%;
    height: 15rem;
    object-fit: cover;
}
```

<p class="term">object-fit</p>

Cómo se acomoda el contenido de una imagen dentro de la caja que se le ha dado. `cover` la escala hasta llenarla y recorta lo que sobra, conservando la proporción. `contain` la encaja entera y deja huecos.

| Valor | Resultado |
| ----- | --------- |
| `fill` | Por defecto: la estira hasta llenar. Deforma |
| `cover` | Llena el hueco y recorta. La opción de un catálogo |
| `contain` | Cabe entera, con huecos a los lados |

Y si el recorte de `cover` corta lo importante, `object-position` decide qué zona se conserva:

```css
.card img { object-fit: cover; object-position: top; }
```

### `aspect-ratio`

Mejor que fijar una altura en `rem` es declarar una proporción:

```css
.card img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
}
```

Ahora la altura se calcula sola a partir del ancho, así que la tarjeta funciona igual en una columna estrecha que en una ancha. Es la versión responsive de la idea anterior.

### Tarea 13 · El catálogo irregular

Reúne al menos seis imágenes **deliberadamente dispares**: alguna vertical, alguna horizontal, alguna muy grande, alguna pequeña. Puedes usar fotos reales de tu tema.

Consigue que el catálogo se vea coherente **sin editar los archivos**:

1. Todas las tarjetas con la misma altura de imagen.
2. Ninguna imagen deformada.
3. Nada se sale a 320 px.
4. Comprueba las verticales: si `cover` les corta la cabeza a las fotos, ajústalo con `object-position`.
5. Explica en un comentario por qué has elegido `cover` o `contain`.

<details class="aside aside--help">
  <summary>Estoy atascado · las imágenes se ven aplastadas</summary>
  <p>Si has dado <code>width</code> y <code>height</code> a la vez sin <code>object-fit</code>, el navegador estira la imagen hasta esa caja. Añade <code>object-fit: cover</code>.</p>
  <p>Y si el problema aparece solo al estrechar la ventana, lo más probable es que te falte <code>height: auto</code> junto al <code>max-width: 100%</code>.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué par de declaraciones evita que una imagen desborde y se deforme?</li>
    <li>¿Qué diferencia hay entre <code>cover</code> y <code>contain</code>?</li>
    <li>¿Qué ventaja tiene <code>aspect-ratio</code> frente a una altura fija?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>max-width: 100%</code> y <code>height: auto</code>.</p>
  <p>2 · <code>cover</code> llena el hueco recortando lo que sobra; <code>contain</code> mete la imagen entera y deja huecos.</p>
  <p>3 · Que la altura se calcula a partir del ancho, así que la proporción se mantiene en cualquier tamaño de columna.</p>
</details>

---

## Sesión 14 · Estados, pseudo-clases y foco visible

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Que una interfaz tiene más de un estado, y por qué el del foco no es opcional.</li>
    <li><strong>2. Haz:</strong> Recorre tu sitio solo con el teclado y arregla lo que no se vea.</li>
    <li><strong>3. Comprueba:</strong> Sabes en todo momento dónde está el foco.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué se usan juntos <code>max-width: 100%</code> y <code>height: auto</code>?</li>
    <li>¿Qué diferencia hay entre <code>cover</code> y <code>contain</code>?</li>
    <li>Predice cómo ayuda <code>aspect-ratio</code> en un catálogo con imágenes irregulares.</li>
  </ol>
</div>

### Los estados de un enlace

```css
a              { color: var(--color-primary); }
a:visited      { color: #6d28d9; }
a:hover        { text-decoration: underline; }
a:focus-visible{ outline: 3px solid currentColor; outline-offset: 3px; }
a:active       { color: #b91c1c; }
```

Y en formularios, los que preparaste en la UD1 ya te dan selectores:

```css
input:focus     { }
input:required  { }
input:invalid   { }
input:disabled  { }
input:checked   { }
```

`:invalid` merece una advertencia: se aplica desde que carga la página, así que un campo obligatorio y vacío aparece en rojo antes de que nadie haya escrito nada. Combínalo con `:user-invalid`, que solo actúa después de que la persona haya interactuado, o marca el error de otra forma.

### El foco no se quita

<div class="rule">
  <p class="rule-label">Nunca <code>outline: none</code> a secas</p>
  <p>El contorno del foco es feo y es la única pista que tiene quien navega con teclado para saber dónde está. Quitarlo deja la web inutilizable para esas personas: pulsan <code>Tab</code> y no pasa nada visible.</p>
  <p>Si no te gusta el contorno por defecto, <strong>sustitúyelo por otro igual de claro</strong>: un contorno propio, un cambio de fondo, un borde. Lo que no vale es dejarlo sin ninguna indicación.</p>
</div>

`:focus-visible` es la herramienta que resuelve la tensión real:

<p class="term">:focus-visible</p>

Se aplica cuando el navegador entiende que la indicación de foco **hace falta**: al llegar con el teclado, sí; al hacer clic con el ratón en un botón, normalmente no.

Así se puede tener un foco de teclado bien visible sin que aparezca un recuadro cada vez que alguien pulsa con el ratón, que era la razón por la que la gente lo quitaba.

```css
:focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 3px;
}
```

`outline` tiene una ventaja sobre `border` para esto: **no ocupa espacio en el layout**, así que nada se mueve al recibir el foco. Y `outline-offset` lo separa del elemento para que se lea mejor.

### Selectores modernos

```css
:is(h1, h2, h3) { line-height: 1.15; }
```

`:is()` agrupa como la coma, pero funciona dentro de un selector largo, donde la coma obligaría a repetirlo todo:

```css
/* Sin :is() */
main h1, main h2, main h3 { }

/* Con :is() */
main :is(h1, h2, h3) { }
```

`:where()` hace lo mismo **con especificidad cero**, lo cual es muy útil para estilos base que quieras poder sobrescribir sin pelearte:

```css
:where(h1, h2, h3) { margin-block: 0; }   /* cualquier clase lo sobrescribe */
```

Y `:has()` selecciona un elemento **por lo que contiene**, algo que CSS no pudo hacer durante veinte años:

```css
.campo:has(input:invalid) {
    border-color: #b91c1c;
}
```

Ahí estás dando estilo al contenedor a partir del estado de su hijo. No hace falta que lo domines: basta con que sepas que los selectores también han evolucionado y que muchos problemas que antes pedían JavaScript ya no lo piden.

### Tarea 14 · Los estados invisibles

Suelta el ratón. Recorre tus cuatro páginas con `Tab`, `Shift + Tab` y `Enter`.

| Elemento | ¿Se ve el foco? | ¿Se distingue del estado normal? | Corrección |
| -------- | --------------- | -------------------------------- | ---------- |
| Enlaces de navegación | | | |
| Enlaces del contenido | | | |
| Botones | | | |
| Campos del formulario | | | |
| Casillas y radios | | | |

Después:

1. Define un `:focus-visible` propio y coherente para todo el sitio.
2. Comprueba que los enlaces del texto se distinguen del resto **sin depender solo del color**: alguien daltónico necesita el subrayado.
3. Da estilo a `:hover` en enlaces y tarjetas.
4. Añade un estado visible a los campos obligatorios usando `:required`.

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué no se escribe <code>outline: none</code> sin más?</li>
    <li>¿Qué hace <code>:focus-visible</code> que no hace <code>:focus</code>?</li>
    <li>¿Para qué sirve <code>:where()</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque deja sin ninguna indicación a quien navega con teclado. Si se quita, hay que poner otra igual de clara.</p>
  <p>2 · Solo aplica el estilo cuando la indicación hace falta, típicamente al llegar con el teclado y no al pulsar con el ratón.</p>
  <p>3 · Para agrupar selectores con especificidad cero, de modo que los estilos base se puedan sobrescribir sin pelear con la cascada.</p>
</details>

---

## Sesión 15 · Transiciones y transformaciones

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se anima un cambio de estado, qué propiedades conviene animar y cómo respetar a quien prefiere no ver movimiento.</li>
    <li><strong>2. Haz:</strong> Añade transiciones con una finalidad y quita las que no la tengan.</li>
    <li><strong>3. Comprueba:</strong> Cada movimiento de tu página comunica algo.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué estados de un enlace debe distinguir una interfaz?</li>
    <li>¿Por qué no se debe eliminar <code>outline</code> sin ofrecer una alternativa?</li>
    <li>Usa <code>Tab</code>: predice qué debería cambiar visualmente antes de probarlo.</li>
  </ol>
</div>

### Transiciones

Una transición suaviza el paso de un estado a otro. Se declara en el estado **normal**, no en el `:hover`, para que funcione en los dos sentidos:

```css
.card {
    transition: transform 150ms ease, box-shadow 150ms ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgb(0 0 0 / 0.12);
}
```

```text
transform    qué propiedad se anima
150ms        cuánto dura
ease         cómo acelera
```

<div class="rule">
  <p class="rule-label">No animes <code>all</code></p>
  <p><code>transition: all 300ms</code> parece cómodo y anima también cosas que no querías, incluidas propiedades que obligan al navegador a recalcular el layout entero. El resultado es una interfaz que va a tirones sin que se sepa por qué.</p>
  <p>Nombra las propiedades. Y si puedes elegir, anima <code>transform</code> y <code>opacity</code>: son las dos que el navegador resuelve sin rehacer el layout, y por eso van suaves.</p>
</div>

### Transformaciones

```css
transform: translateY(-2px);
transform: scale(1.03);
transform: rotate(2deg);
transform: translateY(-2px) scale(1.02);   /* se combinan en una sola declaración */
```

Una transformación **no afecta al espacio que ocupa el elemento**: se dibuja movido, pero su hueco sigue donde estaba y nada se descoloca alrededor. Por eso mover una tarjeta con `transform` es seguro y hacerlo con `margin-top` no.

### El movimiento tiene que decir algo

Una interfaz no mejora por tener zooms, rebotes, sombras y degradados. Cada efecto debería responder a una pregunta: **¿qué le está comunicando esto a quien lo ve?**

| Movimiento | Comunica | ¿Vale la pena? |
| ---------- | -------- | -------------- |
| Un botón que se aclara al pasar por encima | «Esto se puede pulsar» | Sí |
| Una tarjeta que se eleva ligeramente | «Esto es interactivo» | Sí |
| Un campo que se marca al recibir el foco | «Estás escribiendo aquí» | Sí |
| Un titular que entra rebotando al cargar | Nada | No |

### Respetar la preferencia del usuario

Hay quien configura su sistema para reducir las animaciones, y no por gusto: el movimiento puede provocar mareo o desorientación. El sistema operativo lo comunica, y CSS puede leerlo:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        transition-duration: 0.01ms !important;
        animation-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

Es uno de los poquísimos sitios donde `!important` está justificado: es una preferencia de la persona, y debe ganar a cualquier estilo del sitio.

<p class="term">prefers-reduced-motion</p>

Una media query que no pregunta por el tamaño de la pantalla sino por **una preferencia declarada por quien usa el dispositivo**. Existen más de esta familia, como `prefers-color-scheme`.

### Tarea 15 · Menos es más

1. Añade una transición a tus botones y otra a tus tarjetas o enlaces.
2. Asegúrate de que los estados de `:hover` y `:focus-visible` son claros y distintos entre sí.
3. Añade el bloque de `prefers-reduced-motion`.
4. Y después, la parte importante: **recorre tu sitio y elimina cualquier efecto que no comunique nada**. Por cada uno que dejes, escribe en un comentario qué informa.

Es la única tarea de la unidad en la que se puntúa quitar cosas.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Estados claros, dos transiciones justificadas y movimiento reducido.</span></div>
  <div><strong>Si lo tienes</strong><span>Prueba teclado y ratón y elimina cualquier estado que dependa solo del color.</span></div>
  <div><strong>Reto</strong><span>Audita los movimientos de una interfaz ajena y conserva únicamente los que comunican.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 15 y de la semana 5</p>
  <ul class="checklist">
    <li>Todas tus imágenes tienen <code>max-width: 100%</code> y no se deforman.</li>
    <li>El foco es visible en todos los elementos interactivos.</li>
    <li>Los enlaces del texto se distinguen sin depender solo del color.</li>
    <li>Tus transiciones nombran propiedades concretas, no <code>all</code>.</li>
    <li>Respetas <code>prefers-reduced-motion</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿En qué estado se declara la <code>transition</code>, y por qué?</li>
    <li>¿Por qué mover algo con <code>transform</code> es más seguro que con <code>margin</code>?</li>
    <li>¿Qué pregunta <code>prefers-reduced-motion</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · En el estado normal, para que la animación ocurra tanto al entrar como al salir del estado.</p>
  <p>2 · Porque <code>transform</code> no cambia el espacio que ocupa el elemento, así que nada se descoloca a su alrededor.</p>
  <p>3 · Si la persona ha pedido en su sistema que se reduzcan las animaciones.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 5 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Explica cómo evitar que una imagen se deforme dentro de una tarjeta.</li>
    <li>Escribe un foco visible que no dependa solo del color.</li>
    <li>Añade una transición breve y explica cómo respetarías <code>prefers-reduced-motion</code>.</li>
  </ol>
</div>

---

## Semana 6 · Integración, depuración y entrega

---

## Sesión 16 · Reto acumulativo · una interfaz desconocida

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Decide:</strong> Traduce una interfaz nueva a flujo, tamaño, espacio, layout, adaptación y estados.</li>
    <li><strong>2. Haz:</strong> Constrúyela desde cero usando solo decisiones que puedas justificar.</li>
    <li><strong>3. Comprueba:</strong> Responde a un cambio imprevisto sin rehacer el componente.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué diferencia hay entre una transición y una transformación?</li>
    <li>¿Qué preferencia comunica <code>prefers-reduced-motion</code>?</li>
    <li>Una tarjeta aumenta de tamaño al pasar el ratón: explica qué debe ocurrir al usar teclado.</li>
  </ol>
</div>

### Antes de tocar CSS · clasifica los problemas

Recibes una captura y el HTML semántico de una página de actividades. La interfaz contiene una cabecera con navegación, un bloque destacado, un catálogo de tarjetas, una botonera de filtros y un aviso final. No recibes ninguna pista sobre las propiedades.

Antes de escribir, completa esta tabla:

| Zona | Flujo normal | Tamaño | Espacio | Flexbox/Grid | Responsive | Estado |
| ---- | :----------: | :----: | :-----: | :----------: | :--------: | :----: |
| Navegación | | | | | | |
| Destacado | | | | | | |
| Catálogo | | | | | | |
| Botonera | | | | | | |

No todas las casillas necesitan una propiedad. Dejar una zona en flujo normal también es una decisión.

### Paso 1 · Una decisión resuelta

Las tarjetas se repiten en filas y columnas y su número debe depender del espacio. Eso apunta a Grid con una plantilla adaptable. Dentro de cada tarjeta, imagen, texto y acción forman una relación en una dimensión: puede bastar flujo normal o Flexbox. Se resuelve cada nivel por separado.

### Paso 2 · Completa una base incompleta

Se entrega el HTML y una hoja con variables, tipografía y el box model ya preparados. Faltan deliberadamente la distribución del catálogo, el comportamiento de la navegación y los estados de los controles. Completa primero esas tres decisiones y comprueba cada una en DevTools antes de continuar.

### Tarea 16 · Construye y defiende la interfaz

La solución debe cumplir estos requisitos sin framework:

1. El contenido conserva una anchura legible y espacios coherentes.
2. La navegación funciona en una línea cuando cabe y no desborda cuando deja de caber.
3. El catálogo decide automáticamente cuántas columnas entran.
4. Las imágenes conservan proporción y encajan sin deformarse.
5. Los filtros y enlaces tienen estados de interacción y foco visibles.
6. No existe scroll horizontal entre 320 px y 1600 px.
7. Cada media query responde a una rotura que puedes señalar.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Interfaz completa, usable a 360 px y escritorio, sin desbordamientos y con foco visible.</span></div>
  <div><strong>Si lo tienes</strong><span>Haz que una tarjeta destacada ocupe más espacio cuando exista, sin crear otra clase de Grid completa.</span></div>
  <div><strong>Reto</strong><span>Reproduce una segunda composición sin que se te diga si necesita Grid, Flexbox o ambos.</span></div>
</div>

Al terminar, el profesor cambia un requisito: orden de la navegación, anchura mínima de tarjeta o dirección de un componente. Predice el resultado, haz el cambio mínimo y explícalo.

<details class="aside aside--extra">
  <summary>Si has terminado · ampliación: container queries y CSS anidado</summary>
  <p>Una media query pregunta por el viewport; una container query pregunta por el espacio del componente. Úsala solo si el componente necesita cambiar de disposición según el lugar donde aparece:</p>
  <pre><code>.zona-producto {
  container-type: inline-size;
}

@container (width &gt;= 35rem) {
  .producto { grid-template-columns: 1fr 2fr; }
}</code></pre>
  <p>Como segunda ampliación, reescribe un único componente con CSS anidado. El <code>&amp;</code> representa al selector exterior. Limita el anidamiento a uno o dos niveles y comprueba que no has creado selectores innecesariamente específicos.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué seis tipos de decisión has separado antes de escribir CSS?</li>
    <li>¿Qué parte resolviste con flujo normal y por qué?</li>
    <li>¿Cómo demostraste que tu solución se transfiere a un requisito nuevo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Flujo normal, tamaño, espacio, distribución, comportamiento responsive y estado.</p>
  <p>2 · Depende de tu interfaz, pero debes nombrar la zona y explicar por qué no necesitaba un sistema de layout.</p>
  <p>3 · Prediciendo y realizando un cambio que no estaba en la captura inicial sin rehacer la solución.</p>
</details>

---

## Sesión 17 · Depurar CSS

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> El método para diagnosticar una página que se ve mal, en lugar de rehacerla.</li>
    <li><strong>2. Haz:</strong> Localiza y corrige los fallos de una hoja de estilos rota, explicando cada causa.</li>
    <li><strong>3. Comprueba:</strong> Puedes nombrar la causa de cada fallo, no solo la corrección.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué elegirías para una navegación, un catálogo y una página completa: flujo, Flexbox o Grid?</li>
    <li>¿Qué hace que un componente sea realmente responsive?</li>
    <li>Predice por qué una regla puede aparecer tachada en DevTools.</li>
  </ol>
</div>

### Diagnosticar, no rehacer

Recibirás una página que se ve mal. La tentación es borrarlo todo y empezar de cero, y es exactamente lo que no vas a poder hacer en un trabajo: el CSS que te toque arreglar será de otro, tendrá años y funcionará en sitios que no puedes romper.

El método es el de la primera sesión:

<figure class="diagram">
  <figcaption>Cómo se diagnostica</figcaption>
  <ol class="flow">
    <li>¿Qué esperaba ver y qué veo?</li>
    <li>Inspeccionar el elemento concreto que falla</li>
    <li>¿Qué reglas le llegan? ¿Cuáles están tachadas?</li>
    <li>¿Es un problema de selector, de cascada, de caja o de layout?</li>
    <li>Corregir la causa, no el síntoma</li>
  </ol>
</figure>

El paso 4 es el que ahorra tiempo. Los cuatro tipos de problema se buscan en sitios distintos:

| Tipo | Síntoma | Dónde mirar |
| ---- | ------- | ----------- |
| Selector | La regla no aparece en Styles | El nombre de la clase, la sintaxis, que el archivo cargue |
| Cascada | La regla aparece tachada | Especificidad y orden |
| Caja | El tamaño no es el que escribiste | Layout: box model, `box-sizing`, padding |
| Layout | Los elementos no se colocan bien | Los inspectores de Flexbox y de Grid |

### Las cuatro pestañas

| Pestaña | Para qué |
| ------- | -------- |
| **Elements** | El árbol real, ya construido por el navegador |
| **Styles** | Las reglas que llegan al elemento, en orden, con las derrotadas tachadas |
| **Computed** | El valor final de cada propiedad, ya resuelto todo |
| **Layout** | El box model dibujado, y los inspectores de Grid y Flexbox |

Y un truco que resuelve la mitad de los casos: en Styles, las casillas junto a cada declaración la **desactivan en vivo**. Desactivar propiedades una a una hasta que el problema desaparece te dice cuál era la culpable en veinte segundos, sin tocar el archivo.

### Reto 4 · Quita el `!important` (10 min)

```css
#main .listado div.card.producto {
    margin-left: 37px !important;
}
```

Esta regla funciona. Di tres cosas que están mal en ella, y cómo quedaría bien.

<details class="aside aside--extra">
  <summary>Ver respuesta del Reto 4</summary>
  <p><strong>1 · El <code>!important</code>.</strong> Esconde un conflicto en vez de resolverlo, y obliga a que cualquier ajuste futuro sea otro <code>!important</code>.</p>
  <p><strong>2 · La especificidad.</strong> Un <code>id</code>, dos clases, dos elementos y una clase más: ese selector no se puede sobrescribir con nada razonable. Con <code>.producto</code> bastaría.</p>
  <p><strong>3 · El número mágico.</strong> <code>37px</code> no sale de ninguna decisión: sale de mirar una pantalla. Y colocar con <code>margin-left</code> es síntoma de que falta un sistema de layout: si es separación entre elementos de una lista, es <code>gap</code>.</p>
  <p>Quedaría en algo así como <code>.producto { }</code> sin margen, y un <code>gap</code> en el contenedor.</p>
</details>

### Tarea 17 · CSS forense

Recibirás una página cuya hoja de estilos contiene fallos deliberados de todos los tipos:

* La hoja no carga en una de las páginas.
* Un selector escrito con una errata, que no selecciona nada.
* Una regla con especificidad innecesaria que impide ajustar nada.
* Un `!important` puesto para tapar el problema anterior.
* Un elemento que desborda horizontalmente.
* Un `width` fijo en píxeles que rompe en móvil.
* Un Grid con columnas fijas que genera pistas demasiado estrechas.
* Un Flexbox sin `flex-wrap` cuyo contenido no cabe.
* Una imagen deformada.
* `position: absolute` usado para maquetar una zona entera.
* El foco invisible por un `outline: none`.
* Un color repetido catorce veces.
* Dos media queries que se contradicen.

Tu trabajo:

1. Localiza los problemas.
2. **Clasifica cada uno** en selector, cascada, caja o layout. Esa columna es la que se evalúa.
3. Corrígelos atacando la causa.
4. Explica las tres correcciones más importantes.

| Fallo | Tipo | Cómo lo detectaste | Causa real | Corrección |
| ----- | ---- | ------------------ | ---------- | ---------- |
| | | | | |

<details class="aside aside--help">
  <summary>Estoy atascado · no sé por dónde empezar</summary>
  <p>Por lo que afecta a más cosas. Si la hoja no carga en una página, todo lo demás que veas ahí es ruido: arréglalo primero y vuelve a mirar.</p>
  <p>Después, los desbordamientos, porque suelen tener una única causa que produce muchos síntomas. Y al final, los detalles de cascada, que son locales.</p>
  <p>Regla general de la sesión: <strong>si la regla no aparece en Styles es de selector; si aparece tachada es de cascada</strong>. Esa distinción te ahorra la mitad del trabajo.</p>
</details>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué distingue un problema de selector de uno de cascada?</li>
    <li>¿Para qué sirven las casillas junto a cada declaración en Styles?</li>
    <li>¿Por qué no se arregla una página rota rehaciéndola de cero?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Si la regla no aparece en Styles, no ha seleccionado nada: es de selector o de sintaxis. Si aparece tachada, sí seleccionó y perdió: es de cascada.</p>
  <p>2 · Para desactivar propiedades en vivo y localizar cuál causa el problema sin tocar el archivo.</p>
  <p>3 · Porque en un trabajo real el CSS es de otro, tiene años y funciona en sitios que no puedes romper. Y porque rehacer no enseña dónde estaba el fallo.</p>
</details>

---

## Sesión 18 · Auditoría final, revisión por pares y entrega

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se revisa en el CSS de otra persona, que no es si te gustan sus colores.</li>
    <li><strong>2. Haz:</strong> Pasa la auditoría a tu sitio y revisa el de un compañero.</li>
    <li><strong>3. Entrega:</strong> El sitio, la tabla forense, la matriz de revisión y la defensa.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si una regla no aparece en DevTools, ¿qué causas revisarías? ¿Y si aparece tachada?</li>
    <li>Explica la diferencia entre corregir la causa y añadir una excepción.</li>
    <li>Diagnostica antes de tocar: un catálogo desborda solo a 360 px.</li>
  </ol>
</div>

### Dónde estábamos y dónde estamos

<figure class="diagram">
  <figcaption>Doce semanas</figcaption>
  <ol class="flow">
    <li>UD1 · estructura, semántica, contenido, formularios, accesibilidad</li>
    <li>UD2 · presentación, Flexbox, Grid, responsive, componentes</li>
    <li>= un sitio web estático completo</li>
  </ol>
</figure>

### Tarea 18 · La auditoría

<div class="checkpoint">
  <p class="checkpoint-label">Organización</p>
  <ul class="checklist">
    <li>Existe una hoja externa y ninguna página tiene estilos en línea.</li>
    <li>Los nombres de clase describen el papel del elemento, no su aspecto.</li>
    <li>El archivo está ordenado y no hay reglas duplicadas.</li>
    <li>Los valores repetidos son variables con nombres que dicen su papel.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cascada</p>
  <ul class="checklist">
    <li>No hay <code>!important</code>, salvo en <code>prefers-reduced-motion</code>.</li>
    <li>Los selectores no son más específicos de lo necesario.</li>
    <li>No das estilo con <code>id</code>.</li>
    <li>Sabes explicar, de cualquier elemento, qué regla está ganando.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Caja y tipografía</p>
  <ul class="checklist">
    <li><code>box-sizing: border-box</code> está declarado globalmente.</li>
    <li><code>padding</code> y <code>margin</code> se usan con una finalidad clara, y la separación entre elementos es <code>gap</code>.</li>
    <li>No hay anchuras rígidas que rompan en pantallas pequeñas.</li>
    <li>Hay jerarquía visual, el texto es legible y el <code>line-height</code> es razonable.</li>
    <li>Los tamaños no dependen exclusivamente de píxeles.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Layout y responsive</p>
  <ul class="checklist">
    <li>Flexbox donde el problema es de una dimensión, Grid donde hay filas y columnas.</li>
    <li>No se maqueta con <code>position: absolute</code> ni con tablas.</li>
    <li>El sitio funciona a 320, 375, 768, 1024 y 1440 px.</li>
    <li>No hay scroll horizontal en ninguna anchura.</li>
    <li>Cada breakpoint responde a un problema del contenido que puedes nombrar.</li>
    <li>Las imágenes se adaptan y ninguna está deformada.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Accesibilidad y calidad</p>
  <ul class="checklist">
    <li>El foco es visible en todo lo interactivo.</li>
    <li>Los enlaces se distinguen sin depender solo del color.</li>
    <li>El contraste de texto llega a 4.5:1.</li>
    <li>El sitio se puede recorrer entero con el teclado.</li>
    <li>Se respeta <code>prefers-reduced-motion</code>.</li>
    <li>El CSS pasa el validador sin errores relevantes.</li>
    <li>El HTML sigue validando: no lo has roto para conseguir un efecto.</li>
  </ul>
</div>

### Revisión por pares

Un compañero revisará tu proyecto. **No evaluará si le gustan tus colores**: eso no es revisable. Revisará lo técnico.

| Aspecto | Problema encontrado | Propuesta |
| ------- | ------------------- | --------- |
| Responsive | El menú desborda a 360 px | Permitir `flex-wrap` o cambiar la disposición |
| Grid | Columnas fijas de 300 px | Usar `minmax()` con `auto-fit` |
| Imágenes | Se deforman en las tarjetas | Revisar dimensiones y añadir `object-fit` |
| Foco | No es visible en los botones | Definir un `:focus-visible` |
| CSS | Un color repetido catorce veces | Convertirlo en custom property |
| Cascada | Un `!important` en la cabecera | Bajar la especificidad del selector que gana |

Después recibirás la revisión y decidirás qué cambias. **No todas las sugerencias tienen por qué ser correctas**: aprender a evaluar una revisión también forma parte del ejercicio, y rechazar una observación justificándola bien puntúa igual que aceptarla.

Y la regla de la UD1 sigue valiendo: se revisa el código, no a la persona.

### Producto final

El mismo sitio de la UD1, convertido en una web completa. Debe incluir:

* Diseño coherente entre las cuatro páginas: tipografía, paleta y sistema de espaciado.
* Variables CSS para las decisiones que se repiten.
* Layout con Flexbox donde corresponda y con Grid donde corresponda.
* Navegación adaptable.
* Catálogo responsive.
* Formulario con estilo propio.
* Imágenes adaptables.
* Estados `:hover` y `:focus-visible`.
* Al menos una transición con una finalidad.
* Media queries solo donde hagan falta.

Se entrega junto a la tabla forense de la sesión 17, la matriz de revisión que hayas hecho, y media página con las tres decisiones de layout de las que estés más seguro.

<details class="aside aside--extra">
  <summary>Si acabas antes · copia un diseño</summary>
  <p>Recibirás la captura de una interfaz pequeña, sin su código, y tendrás que reproducirla con HTML y CSS.</p>
  <p>El objetivo <strong>no</strong> es la coincidencia píxel a píxel. Es identificar la estructura: qué está agrupado con qué, qué alineado con qué, qué espacios se repiten, qué es Grid y qué es Flexbox, y cuál es la jerarquía visual. Copiar un diseño es sobre todo un ejercicio de lectura.</p>
</details>

### Presentación

Tres minutos y cuatro preguntas:

* Enséñanos una parte de tu sitio que se adapte **sin** media query, y explica por qué no la necesita.
* ¿Dónde has puesto un breakpoint y qué te dijo el contenido que lo pusieras ahí?
* Enséñanos un sitio donde dudaste entre Flexbox y Grid, y por qué elegiste lo que elegiste.
* ¿Has tenido que tocar el HTML de la UD1? Si sí, ¿dónde y por qué?

Y una prueba en vivo: se te pedirá **un cambio pequeño sobre tu propio CSS**. Convertir un Grid de tres columnas en dos, cambiar el eje de un Flexbox, hacer que el menú funcione a 360 px, o quitar un `!important` sin romper nada. Si no puedes hacerlo, no controlas el código que has entregado.

### Evaluación

| Criterio | Puntos |
| ------------------------------------------------------ | -----: |
| Responsive: adaptación fluida y breakpoints justificados | 2 |
| Layout con Grid | 1,5 |
| Layout con Flexbox | 1,5 |
| Sistema visual: variables, tipografía y espaciado | 1,5 |
| Calidad de la cascada: selectores y ausencia de `!important` | 1,5 |
| Accesibilidad visual: foco, contraste y movimiento | 1 |
| Imágenes adaptables | 1 |

No puntúa que el sitio sea vistoso. Puntúa que **aguante**: que siga funcionando cuando cambia el contenido, cuando cambia la pantalla y cuando lo usa alguien que no ve la tuya.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · entrega</p>
  <ul class="checklist">
    <li>Las cuatro páginas pasan la auditoría completa.</li>
    <li>El HTML sigue validando y no lo has retorcido por motivos visuales.</li>
    <li>No has usado ningún framework CSS.</li>
    <li>La tabla forense está entregada con la columna de tipo de problema.</li>
    <li>Has revisado el proyecto de un compañero y decidido qué aceptas de la suya.</li>
    <li>Puedes hacer un cambio pequeño sobre tu propio CSS delante de alguien.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 6 · 10 minutos</p>
  <p>Individual, sin IA y sin apuntes. Trabajas sobre una interfaz desconocida.</p>
  <ol>
    <li>Identifica un problema de selector, uno de cascada y uno de layout.</li>
    <li>Corrige la causa con el CSS mínimo y justifica cada decisión.</li>
    <li>Realiza un cambio responsive nuevo sin copiar tu proyecto.</li>
  </ol>
</div>

---

## Lo que debes recordar

### El método

Ante cualquier problema de CSS, esta secuencia. No cambia con los años ni con las modas:

<figure class="diagram">
  <figcaption>Cómo se ataca un problema de CSS</figcaption>
  <ol class="flow">
    <li>¿Qué tipo de problema es: tamaño, espacio, distribución o estado?</li>
    <li>Si es de distribución: ¿una dimensión o dos? Flexbox o Grid</li>
    <li>¿Puede resolverse solo, con límites, en lugar de con un breakpoint?</li>
    <li>Si no se ve como esperabas: inspeccionar antes de escribir</li>
  </ol>
</figure>

### La idea más importante

Si dentro de un año has olvidado las propiedades, que quede esta:

> **Cuando algo no se ve como esperabas, la respuesta no es añadir CSS. Es averiguar qué regla está actuando.**

De ahí sale todo lo demás: por eso no usamos `!important`, por eso los selectores no se hacen más específicos «por si acaso», por eso DevTools está siempre abierto, y por eso distinguimos una regla tachada de una regla ausente.

Y su pareja, la que gobierna el layout:

<p class="term">Describe límites, no medidas</p>

`max-width` en vez de `width`. `minmax()` en vez de un número de columnas. `clamp()` en vez de un tamaño fijo. Un diseño que declara límites se adapta solo; uno que declara medidas hay que arreglarlo en cada pantalla.

### No memorices CSS

No necesitas recordar todas las propiedades. Tienes autocompletado, DevTools, documentación, buscadores e IA. Lo que necesitas es saber plantearte esto:

* ¿Qué quiero seleccionar exactamente?
* ¿Qué regla está actuando ahora, y por qué gana?
* ¿Es un problema de tamaño, de espacio, de distribución o de estado?
* ¿Una dimensión o dos?
* ¿Necesito de verdad una media query, o puede adaptarse solo?
* ¿Estoy usando un valor fijo sin una razón?
* ¿Qué pasará cuando el contenido cambie?
* ¿Y en una pantalla más pequeña?
* ¿Y para quien navega con teclado?

### Al terminar deberías poder responder

1. ¿Cómo se relacionan HTML y CSS?
2. ¿Qué partes tiene una regla CSS?
3. ¿Qué diferencia hay entre seleccionar por elemento, por clase y por `id`?
4. ¿Qué significa que CSS sea «en cascada»?
5. ¿Qué es la especificidad y en qué orden pesan los selectores?
6. ¿Qué propiedades suelen heredarse y cuáles no?
7. ¿Por qué `!important` no es una solución?
8. ¿Qué capas tiene el box model?
9. ¿Qué cambia `box-sizing: border-box`?
10. ¿Cuándo usarías `px`, `%` o `rem`?
11. ¿Qué problema resuelven las custom properties?
12. ¿Qué hacen `min()`, `max()` y `clamp()`?
13. ¿Qué es el flujo normal?
14. ¿Qué diferencia hay entre `block`, `inline` e `inline-block`?
15. ¿Qué diferencia hay entre `relative` y `absolute` respecto al hueco?
16. ¿Cuándo usarías Flexbox?
17. ¿Sobre qué eje actúan `justify-content` y `align-items`?
18. ¿Cuándo usarías Grid?
19. ¿Qué representa `fr` y por qué no es un porcentaje?
20. ¿Para qué sirven `repeat()` y `minmax()`?
21. ¿Qué diferencia hay entre `auto-fit` y `auto-fill`?
22. ¿Qué significa diseño responsive, y qué mobile first?
23. ¿Dónde debe colocarse un breakpoint, y por qué no en las medidas de un teléfono?
24. ¿Qué problema resuelven `object-fit` y `aspect-ratio`?
25. ¿Por qué `:focus-visible` es importante y qué no debe hacerse con `outline`?
26. ¿Qué diferencia hay entre una media query y una container query?
27. ¿Cómo averiguas con DevTools qué regla está ganando, y cómo distingues eso de un selector que no encuentra nada?

Si puedes responderlas y construir un sitio responsive sin depender de Bootstrap ni de una plantilla, tienes una base sólida de CSS.

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Regla | Un selector más su bloque de declaraciones |
| Declaración | Una propiedad con su valor |
| Cascada | El mecanismo que decide qué declaración se aplica cuando varias compiten |
| Especificidad | Cuán concreto es un selector: elemento < clase < `id` |
| Herencia | Que ciertas propiedades pasen de un elemento a sus descendientes |
| Pseudo-clase | Selector por estado o posición, como `:hover` o `:first-child` |
| Custom property | Variable de CSS, declarada con `--` y leída con `var()` |
| Box model | Las capas de una caja: contenido, padding, borde y margen |
| `border-box` | Que `width` incluya el padding y el borde |
| Número mágico | Un valor escrito a pelo sin que nada explique de dónde sale |
| Flujo normal | La colocación por defecto, siguiendo el orden del documento |
| Eje principal | La dirección en que Flexbox coloca sus elementos |
| Eje transversal | El perpendicular al principal |
| `gap` | Separación entre elementos de un Flexbox o un Grid |
| `fr` | Una fracción del espacio libre, ya descontados los `gap` |
| Pista | Cada columna o fila de una cuadrícula |
| Área | Un grupo rectangular de celdas, que puede tener nombre |
| Breakpoint | La anchura a la que el diseño cambia de disposición |
| Mobile first | Escribir primero la disposición simple y añadir después las anchas |
| Media query | Consulta sobre el viewport o sobre una preferencia del usuario |
| Container query | Consulta sobre el espacio disponible del contenedor de un componente |
| `object-fit` | Cómo encaja una imagen en la caja que se le da |
| `:focus-visible` | El estado de foco cuando la indicación hace falta |

### La siguiente unidad

Tu sitio ya puede mostrar información, adaptarse al dispositivo, recoger datos en un formulario y responder con estados visuales.

Lo que todavía no sabe es **reaccionar con lógica**.

<figure class="diagram">
  <figcaption>Las tres capas</figcaption>
  <ol class="flow">
    <li>HTML · qué existe</li>
    <li>CSS · cómo se presenta</li>
    <li>JavaScript · qué ocurre</li>
  </ol>
</figure>

En la siguiente unidad empezamos a programar el comportamiento de la interfaz. Y ahí se cobrará otra vez el trabajo de estas semanas: sobre un documento semántico y un CSS que separa estructura de presentación, añadir comportamiento es añadir una capa. Sobre lo otro, es empezar de nuevo.

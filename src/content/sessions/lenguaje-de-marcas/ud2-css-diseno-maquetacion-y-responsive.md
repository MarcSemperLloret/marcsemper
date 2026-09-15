---
title: "CSS: diseño, maquetación y responsive"
label: "UD2 · Guía y taller práctico"
section: "ud-02"
order: 2
lang: "es"
summary: "El mismo sitio de la UD1, ahora con presentación. CSS exige decidir de qué tipo es cada problema —tamaño, espacio o distribución— y saber diagnosticar qué regla está actuando cuando el resultado no es el esperado."
duration: "6 sesiones de 3 horas · 18 horas"
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

El trabajo de las seis semanas anteriores demuestra aquí su utilidad. La UD1 terminó con esta promesa:

> Si tu estructura dice lo que las cosas son, el CSS podrá cambiar por completo su apariencia sin tocar una línea de tu HTML.

Vamos a comprobarlo. Sobre una estructura semántica, dar estilo es escribir selectores. Sobre una sopa de `div`, es adivinar cuál era cuál.

CSS te permitirá controlar colores, tipografía, tamaños, espacios, bordes, la distribución de los elementos, la adaptación a distintas pantallas, los estados interactivos y las transiciones. Pero, igual que en HTML, **no se trata de memorizar propiedades**. Se trata de aprender a construir y razonar *layouts*.

### La idea que gobierna la unidad

Vas a pasarte seis semanas viendo cosas que no se ven como esperabas. La diferencia entre alguien que aprende CSS y alguien que pelea con CSS está en lo que hace en ese momento.

<div class="rule">
  <p class="rule-label">Cuando algo no se ve como esperabas, no añadas CSS</p>
  <p>La reacción natural consiste en escribir otra propiedad por si esta sí funciona, después otra, y finalmente <code>!important</code>. Así se acumula una hoja de estilos que nadie entiende, ni siquiera quien la escribió.</p>
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
  <p>Vas a tener la tentación de meter un <code>div</code> de más, o de cambiar un <code>section</code> por otra cosa, porque así el CSS sale antes. Añadir un contenedor es a veces legítimo y se tratará más adelante; ahora bien, si el cambio <strong>empeora lo que el documento significa</strong>, el problema es del CSS y hay que resolverlo en el CSS.</p>
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

## Plan de trabajo por sesiones

| Sesión | Contenido de las tres horas | Práctica central | Horas |
| :---: | :--- | :--- | :---: |
| **Sesión 1** | Cómo se aplica CSS y quién gana | Primer estilo, selectores y diagnóstico de conflictos | 3 h |
| **Sesión 2** | La caja y el sistema visual | Box model, unidades, tipografía y variables | 3 h |
| **Sesión 3** | Flujo normal y Flexbox | Navegación y componentes en una dimensión | 3 h |
| **Sesión 4** | Grid y responsive | Catálogo adaptable y decisión de breakpoints | 3 h |
| **Sesión 5** | Imágenes, estados y movimiento | Catálogo irregular, foco visible y transiciones | 3 h |
| **Sesión 6** | Integración, depuración y entrega | Interfaz desconocida, CSS forense y revisión por pares | 3 h |
| **Total** | | **El sitio de la UD1 convertido en una web completa** | **18 h** |

Cada sesión dura tres horas y mantiene el reparto de la UD1: la teoría se concentra al principio y el resto de la tarde se trabaja. CSS se aprende escribiéndolo y, sobre todo, diagnosticando por qué no hace lo que esperabas.

<figure class="diagram">
  <figcaption>El ritmo de cada sesión de tres horas</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Se explica · 25 min</li>
    <li>Se trabaja · 150 min</li>
    <li>Cierre · 5 min</li>
  </ol>
</figure>

El bloque de trabajo se divide en pasos cronometrados, y cada sesión termina con una **ampliación** de dos retos para quien acabe antes: trabajan sobre código ajeno y piden justificar decisiones por escrito, de modo que no se resuelven tecleando deprisa.

Los conceptos nuevos avanzan de **ejemplo resuelto → ejemplo incompleto → problema parecido → problema nuevo**. Aproximadamente dos tercios de la práctica se aplican al proyecto y un tercio a interfaces que no has visto antes. La pregunta previa nunca es «¿qué propiedad copio?», sino «¿qué tipo de problema tengo y qué herramienta encaja?».

---

## Sesión 1 · Cómo se aplica CSS y quién gana

<p class="lead">Tres horas. Media hora para entender cómo se enlaza una hoja, cómo se elige un selector y qué decide un conflicto entre dos reglas, y dos horas y media dando estilo a tu sitio y diagnosticando quién gana.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se enlaza una hoja de estilos, de qué partes se compone una regla, qué familias de selectores existen y qué decide cuál de dos reglas en conflicto se aplica.</li>
    <li><strong>2. Haz:</strong> Crea tu hoja, dale el primer estilo al sitio, elige el selector correcto para cinco requisitos y resuelve un conflicto sin <code>!important</code>.</li>
    <li><strong>3. Comprueba:</strong> Sabes leer en DevTools qué regla ha ganado y por qué, y no queda un solo <code>!important</code> en tu hoja.</li>
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

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Hoy entra el lenguaje entero en su forma mínima: una hoja, una regla, un selector y un criterio para decidir quién gana cuando dos reglas se contradicen. El catálogo de selectores queda como material de consulta dentro del paso que lo usa.

#### El navegador ya estaba aplicando CSS

Cuando escribiste esto en la UD1:

```html
<h1>PixelStore</h1>
```

el título se veía grande y en negrita. Eso no es «lo natural»: es una hoja de estilos que trae el navegador de fábrica, la **hoja de usuario-agente**. Nunca has trabajado sin CSS. Lo que vamos a hacer es tomar el control.

#### Las tres formas, y por qué usamos una

| Forma | Cómo se escribe | Cuándo |
| ----- | --------------- | ------ |
| Hoja externa | Un archivo `.css` enlazado con `link` | **Siempre**, en esta unidad y en la práctica profesional |
| Hoja interna | Un bloque `style` en el `head` | Casos muy puntuales, como un correo electrónico |
| En línea | Un atributo `style` en el elemento | Prácticamente nunca a mano |

La hoja externa gana por tres razones concretas: una sola definición sirve para las cuatro páginas, el navegador se la guarda en caché y no vuelve a descargarla, y el estilo queda separado del contenido, que es la idea entera de estas dos unidades.

```html
<link rel="stylesheet" href="css/styles.css">
```

Fíjate en que es una ruta relativa, como las de la UD1. Si una página estuviera dentro de una carpeta, sería `../css/styles.css`.

#### Cómo funciona una regla

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

La regla se lee así: «selecciona todos los `h1` y cambia su propiedad `color`». Al conjunto de propiedad y valor se le llama **declaración**, y van separadas por punto y coma:

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

Los comentarios se escriben solo de una forma. `//` no funciona, aunque el editor a veces lo coloree como si lo hiciera:

```css
/* Sistema tipográfico base */
body {
    font-family: system-ui, sans-serif;
}
```

#### Los selectores, en tres familias

Un selector responde a «¿a qué te refieres?», y hay tres maneras de responder.

**Por lo que el elemento es.** `p`, `a`, `h1`. Afecta a todos los del sitio: útil para las bases, peligroso para algo específico.

**Por el papel que le das.** Una clase, que se repite en tantos elementos como quieras y describe una función:

```html
<article class="card producto destacado">
```

```css
.destacado { font-weight: 700; }
```

Es el selector que más vas a usar. El `id` también funciona, pero es único en la página y pesa demasiado en los conflictos. Regla práctica: **los `id` son para enlazar y para los `label`; las clases son para dar estilo.**

**Por lo que el documento ya declara.** Su posición, su estado o sus atributos:

```css
nav a          { }   /* cualquier enlace dentro de nav */
input:required { }   /* el campo es obligatorio */
li:first-child { }   /* es el primer hijo de su padre */
a[href^="http"]{ }   /* enlaces externos */
```

<p class="term">Pseudo-clase</p>

Un selector que depende del estado o de la posición del elemento, no de su marcado. Se escribe con dos puntos y no existe en el HTML: la calcula el navegador.

Aquí se comprueba el efecto de lo que hiciste en la UD1: si escribiste `type="email"` en lugar de `type="text"`, ahora tienes un selector. **El HTML bien marcado te devuelve selectores**, y esa es la razón de que inventar una clase para algo que el documento ya dice sea duplicar la información en dos sitios.

#### La palabra «cascading» no es decorativa

CSS significa *Cascading Style Sheets*. Hojas de estilo **en cascada**. Esa palabra describe el mecanismo central del lenguaje: varias reglas pueden querer cambiar la misma propiedad del mismo elemento, y hace falta un criterio para decidir.

```css
p          { color: blue; }
.destacado { color: red; }
```

```html
<p class="destacado">Hola</p>
```

Se ve rojo. La pregunta relevante es **por qué**.

<figure class="diagram">
  <figcaption>Cómo se resuelve un conflicto, de arriba abajo</figcaption>
  <ol class="flow">
    <li>Importancia · una declaración con <code>!important</code> gana a una normal</li>
    <li>Especificidad · gana el selector más específico</li>
    <li>Orden · a igual especificidad, gana la última escrita</li>
  </ol>
</figure>

<p class="term">Especificidad</p>

Una medida de cuán concreto es un selector. Funciona como un orden de prioridad que basta con conocer, sin necesidad de calcularlo manualmente.

| De menos a más específico | Ejemplo |
| ------------------------- | ------- |
| Elemento y pseudo-elemento | `p`, `a` |
| Clase, atributo y pseudo-clase | `.destacado`, `[type="email"]`, `:hover` |
| `id` | `#productos` |

Una regla práctica evita la aritmética: **una clase gana a cualquier cantidad de elementos, y un `id` gana a cualquier cantidad de clases**. Por eso `#productos p` gana a `body main section article p`, aunque el segundo parezca más trabajado. De ahí sale el consejo anterior: si das estilo con `id`, cualquier ajuste posterior con clases no podrá corregirlo.

Cuando hay empate de especificidad decide el orden, y gana la última escrita:

```css
.boton { background: blue; }
.boton { background: green; }
```

Gana el verde. Por eso el orden de tu hoja importa, y por eso conviene escribir de lo general a lo particular.

#### Herencia

Algunas propiedades pasan de un elemento a sus descendientes, de modo que basta declararlas una vez en `body`:

| Se heredan | No se heredan |
| ---------- | ------------- |
| `color`, `font-family`, `font-size`, `line-height`, `text-align` | `margin`, `padding`, `border`, `background`, `width`, `display` |

La lógica es razonable: lo que se hereda tiene que ver con **el texto**, y lo que no, con **la caja**. Que un `padding` se heredara sería un desastre.

#### `!important` y cómo se lee un conflicto

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

Esa pregunta se responde en DevTools. Selecciona un elemento y ve a la pestaña **Styles**: verás las reglas que le afectan **ordenadas de la que gana a la que pierde**, con las declaraciones derrotadas **tachadas** y, a la derecha, el archivo y la línea donde se escribió cada una. La pestaña **Computed** da el valor final de cada propiedad, ya resuelto el conflicto.

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto</p>

Los dos primeros pasos ponen en marcha la hoja y eligen selectores; los cuatro últimos entran en los conflictos, que es donde se pierde el tiempo cuando no se sabe diagnosticar.

#### Paso 1 · Tu primer estilo · 25 min

Sobre tu proyecto de la UD1:

1. Crea la carpeta `css/` y dentro `styles.css`.
2. Enlázalo en las **cuatro** páginas.
3. Cambia la tipografía general del sitio desde `body`.
4. Da un color distinto a los encabezados.
5. Cambia el aspecto de los enlaces.
6. Comprueba que el estilo se aplica en las cuatro.

<div class="rule">
  <p class="rule-label">Si una página no cambia, no escribas más CSS</p>
  <p>Es el error que más tiempo consume la primera semana, y la reacción instintiva es escribir más reglas por si acaso. No sirve de nada: si la hoja no carga, ninguna regla va a funcionar.</p>
  <p>Comprueba en este orden: ¿la ruta del <code>link</code> es correcta desde <em>esa</em> página?, ¿el archivo se llama exactamente así, con sus mayúsculas?, ¿lo has guardado? Y la comprobación definitiva: abre DevTools, pestaña <strong>Network</strong>, recarga, y busca <code>styles.css</code>. Si aparece en rojo con un 404, ya sabes que el problema es la ruta y no el CSS.</p>
</div>

**Antes de continuar:** las cuatro páginas cargan la hoja, comprobado en Network y no por su apariencia, y el HTML no se ha tocado salvo para añadir el `link`.

#### Paso 2 · El selector correcto · 35 min

Para cada requisito, escribe el selector que le corresponde. No vale cualquiera que funcione: **vale el que expresa lo que pide el enunciado**.

##### 2.1 · Ejemplo resuelto

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

No ha hecho falta inventar ninguna clase. Si el HTML ya distingue esa zona, el selector sale solo.

##### 2.2 · Ahora tú

1. Todos los enlaces de la navegación principal deben cambiar de aspecto.
2. El primer producto del catálogo debe destacarse.
3. Los campos obligatorios del formulario deben distinguirse.
4. Los enlaces externos deben poder marcarse de forma distinta a los internos.
5. Solo los párrafos que están dentro de una ficha de producto, no todos los del sitio.

<details class="aside aside--extra">
<summary>Consultar · las familias de selectores al completo</summary>

**Por elemento.** Afecta a todos los del sitio.

```css
p { line-height: 1.6; }
```

**Por clase.** Una clase puede repetirse en muchos elementos, y un elemento puede tener varias.

```css
.destacado { font-weight: 700; }
```

**Por `id`.** Funciona, pero es único y pesa demasiado en los conflictos.

```css
#productos { padding-block: 3rem; }
```

**Descendiente y directo.**

```css
nav a {          /* cualquier enlace dentro de nav, a la profundidad que sea */
    text-decoration: none;
}

nav > ul {       /* solo las listas que son hijas directas de nav */
    display: flex;
}
```

**Por atributo.**

```css
input[type="email"] {
    border-color: #999;
}

a[href^="http"] {     /* enlaces cuyo href empieza por http: los externos */
    ...
}
```

**Pseudo-clases.** Seleccionan por estado o por posición.

```css
a:hover        { }   /* el cursor está encima */
a:focus-visible{ }   /* tiene el foco de teclado */
li:first-child { }   /* es el primer hijo de su padre */
li:last-child  { }   /* es el último */
input:required { }   /* el campo es obligatorio */
input:invalid  { }   /* su valor no cumple la validación */
```

**Agrupar.** La coma es «o».

```css
h1, h2, h3 {
    line-height: 1.15;
}
```

Un fallo típico es olvidarla: `h1 h2` significa «un `h2` dentro de un `h1`», que casi nunca existe, y entonces la regla no hace nada.

</details>

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

#### Paso 3 · ¿Quién está ganando? · 35 min

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

##### 3.1 · Ejemplo resuelto

<dl class="worked">
  <dt>¿Cuántos <code>id</code> hay en juego?</dt>
  <dd>Solo uno: <code>#contenido p</code>. Como el <code>id</code> gana a cualquier cantidad de clases, ese es el candidato inmediato.</dd>
  <dt>¿Le puede ganar alguna otra?</dt>
  <dd>No. <code>main section p.aviso</code> tiene una clase y tres elementos, y sigue por debajo de un <code>id</code>.</dd>
  <dt>¿Importa el orden?</dt>
  <dd>Aquí no, porque no hay empate en especificidad. El orden solo decide entre iguales.</dd>
  <dt>Resultado</dt>
  <dd><code>navy</code>. Al eliminar la regla del <code>id</code>, prevalecería <code>main section p.aviso</code>, que es <code>teal</code>.</dd>
</dl>

##### 3.2 · Ahora tú

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

#### Paso 4 · La regla que no hace nada · 15 min

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
  <summary>Ver respuesta</summary>
  <p>Que no aparezca <strong>ni tachada</strong> es la pista entera. Una regla tachada es una regla que sí seleccionó el elemento y perdió el conflicto. Si no aparece en absoluto, es que <strong>no ha seleccionado nada</strong>.</p>
  <p>Las causas posibles son de fontanería, no de cascada: la hoja no se está cargando, hay una errata en el nombre de la clase, falta el punto y coma o la llave de la regla anterior —lo que invalida esta—, o el elemento no está donde crees.</p>
  <p>La lección es el método: <strong>tachado significa problema de cascada; ausente significa problema de selector o de sintaxis</strong>. Son dos diagnósticos distintos y se buscan en sitios distintos.</p>
</details>

#### Paso 5 · Cinco selectores reales en tu sitio · 25 min

Lleva al proyecto lo del paso 2. Escribe cinco reglas que usen, cada una, una familia distinta de selector, y **anota en un comentario por qué ese y no otro**:

1. Una que acote por una zona semántica de la UD1 (`nav`, `main`, `footer`…).
2. Una que use una clase que describa un papel, no una apariencia.
3. Una que se apoye en un atributo que ya está en tu HTML.
4. Una que use una pseudo-clase de estado o de posición.
5. Una que agrupe varios selectores con la coma.

Si alguna te obliga a añadir una clase al HTML, pregúntate antes si el documento ya lo decía de otra forma. Si te obliga a inventar un `id`, es que no era el camino.

#### Paso 6 · Auditoría de tu propia hoja · 15 min

Recorre `styles.css` de arriba abajo y responde:

| Comprobación | Cuántos | Qué haces |
| ------------ | ------: | --------- |
| `!important` en la hoja | | |
| Selectores que empiezan por `#` | | |
| Reglas que no seleccionan nada (comprobado en DevTools) | | |
| Clases cuyo nombre describe la apariencia y no el papel | | |

Corrige los cuatro grupos. Los nombres del tipo `.azul` o `.texto-grande` se renombran por lo que significan: el día que el azul pase a verde, la clase `.azul` miente.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los seis pasos. Los dos retos trabajan con hojas que no has escrito tú, que es como llegan los proyectos reales.

##### Reto 1 · La hoja heredada

Recibes esta hoja de un proyecto anterior. Funciona, y es un desastre.

```css
#main .content p.text { color: #444 !important; }
#main .content p { color: #888; }
.text { color: #222; }
p { color: #000; }

#nav ul li a { text-decoration: none !important; }
#nav ul li a:hover { text-decoration: underline; }

.boton-azul { background: #1a5fb4; color: white; }
.boton-azul-grande { background: #1a5fb4; color: white; padding: 1rem 2rem; }
#formulario input { border: 1px solid #ccc !important; }
```

Reescríbela entera con una condición: **ningún `!important` y ningún `id` como selector de estilo**, manteniendo exactamente el mismo resultado visual.

1. Antes de tocar nada, escribe qué color acaba teniendo un `<p class="text">` dentro de `#main .content`, y por qué. Compruébalo después.
2. El `!important` de la navegación tiene un efecto que quizá no era el buscado: averigua qué le ocurre al subrayado del `:hover` y explícalo.
3. Las dos clases de botón repiten dos declaraciones. Resuélvelo sin duplicar, y di qué has hecho con el nombre de las clases.
4. Anota cuántas líneas tiene tu versión frente a la original.

##### Reto 2 · Seis conflictos, predichos antes de mirar

Para cada pareja, predice **por escrito** qué regla gana y por qué, antes de probar nada. Después móntalo y comprueba.

| # | Regla A | Regla B | Gana | Motivo |
| - | ------- | ------- | ---- | ------ |
| 1 | `.card p` | `article p` | | |
| 2 | `p.aviso` | `.aviso` | | |
| 3 | `#main p` | `.a .b .c .d p` | | |
| 4 | `a:hover` | `nav a` | | |
| 5 | `ul li` escrito arriba | `ul li` escrito abajo | | |
| 6 | `p { color: red !important }` | `#main p { color: blue }` | | |

La fila 4 no se decide igual que las demás: piénsala dos veces antes de escribir el motivo.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Hoja externa cargada en las cuatro páginas, los cinco selectores del paso 2 resueltos y el conflicto del paso 3 diagnosticado.</span></div>
  <div><strong>Si lo tienes</strong><span>Las cinco reglas reales en tu sitio justificadas y la auditoría de tu hoja con sus cuatro grupos corregidos.</span></div>
  <div><strong>Reto</strong><span>La hoja heredada reescrita sin <code>!important</code> ni <code>id</code>, y las seis predicciones escritas antes de comprobarlas.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Existe <code>css/styles.css</code> y está enlazado en las cuatro páginas.</li>
    <li>Sabes nombrar las tres partes de una regla y comprobar en Network si la hoja se ha cargado.</li>
    <li>Sabes ordenar elemento, clase e <code>id</code> por especificidad.</li>
    <li>Distingues una propiedad que se hereda de una que no.</li>
    <li>Sabes leer en Styles qué regla gana y cuáles están tachadas.</li>
    <li>No hay ningún <code>!important</code> ni ningún <code>id</code> de estilo en tu hoja.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué usamos una hoja externa y no un atributo <code>style</code>?</li>
    <li>Nombra las tres partes de una regla CSS.</li>
    <li>¿Qué diferencia hay entre <code>nav a</code> y <code>nav &gt; a</code>?</li>
    <li>¿Qué gana: tres clases o un <code>id</code>?</li>
    <li>¿Cuándo decide el orden en que están escritas las reglas?</li>
    <li>En DevTools, ¿qué significa que una declaración aparezca tachada, y qué que no aparezca?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Una definición sirve para todas las páginas, el navegador la cachea, y el estilo queda separado del contenido.</p>
  <p>2 · Selector, propiedad y valor. La propiedad con su valor forman una declaración.</p>
  <p>3 · El primero selecciona cualquier enlace dentro del <code>nav</code>, a la profundidad que sea; el segundo, solo los que cuelgan directamente de él.</p>
  <p>4 · El <code>id</code>. Gana a cualquier cantidad de clases.</p>
  <p>5 · Solo cuando dos reglas tienen la misma especificidad; entonces se aplica la última escrita.</p>
  <p>6 · Tachada quiere decir que seleccionó el elemento pero perdió el conflicto: es un problema de cascada. Que no aparezca quiere decir que no seleccionó nada: es un problema de selector, de sintaxis o de carga.</p>
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

## Sesión 2 · La caja y el sistema visual

<p class="lead">Tres horas. Media hora para entender de qué capas se compone una caja y respecto a qué se calcula cada unidad, y dos horas y media construyendo el sistema visual de tu sitio y eliminando de él los valores repetidos.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> De qué capas se compone una caja, qué cambia <code>box-sizing</code>, respecto a qué se calcula cada unidad y cómo se declara una decisión de diseño una sola vez.</li>
    <li><strong>2. Haz:</strong> Construye las tarjetas del catálogo, define el sistema visual del sitio y conviértelo en variables.</li>
    <li><strong>3. Comprueba:</strong> Ninguna tarjeta desborda al estrechar la ventana, y puedes cambiar el color principal del sitio tocando una sola línea.</li>
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

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Todo lo de hoy sirve para lo mismo: dejar de escribir números sueltos y empezar a declarar decisiones. Primero la caja, después las unidades y al final las variables que ponen nombre a esas decisiones.

#### Todo es una caja

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

#### `box-sizing`, o por qué 300 no son 300

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

#### Anchura: fija, fluida y con techo

```css
.card { width: 300px; }        /* frágil: no cabe en un móvil de 320 */
.card { width: 100%; }         /* fluida, pero en un monitor grande se estira */
.card {
    width: 100%;
    max-width: 30rem;          /* fluida hasta un límite */
}
```

La tercera es casi siempre la correcta: **ocupa lo que haya, pero no más de lo razonable**. Es la primera aparición de una idea que domina la unidad: describir límites en lugar de medidas exactas.

```css
.container {
    width: min(90%, 70rem);
    margin-inline: auto;
}
```

`margin-inline: auto` es la forma moderna de `margin-left: auto; margin-right: auto`. Y `min(90%, 70rem)` se lee: «el 90 % del espacio, salvo que eso pase de 70rem, en cuyo caso 70rem». Un contenedor así funciona en un móvil y en un monitor de 34 pulgadas sin una sola media query.

#### No todo se mide en píxeles

| Unidad | Se calcula respecto a | Para qué la usamos |
| ------ | --------------------- | ------------------ |
| `px` | Nada, es absoluta | Bordes y detalles que no deben escalar |
| `rem` | El tamaño de fuente **raíz** del documento | Tamaños de texto y espaciados |
| `em` | El tamaño de fuente **del propio elemento** | Espacios que deben crecer con su texto |
| `%` | Una medida del contenedor, según la propiedad | Anchuras fluidas |
| `vw` / `vh` | El ancho y el alto del viewport | Con cuidado, y casi siempre dentro de `clamp()` |

<p class="term">rem</p>

*Root em*: una medida relativa al tamaño de fuente del elemento raíz, que por defecto son 16px. Así, `1.5rem` son 24px… **hasta que alguien cambia el tamaño de letra de su navegador**, y entonces todo tu diseño escala con él. Ese es el motivo real para usarlo.

Ahí está la diferencia importante con `px`: un `font-size: 16px` ignora la preferencia de quien necesita la letra más grande. Un `1rem` la respeta. Frente a `em`, la regla práctica es **`rem` por defecto, `em` cuando quieras que algo escale con su propio texto**, porque `em` se acumula al anidar:

```css
.card       { font-size: 1.25rem; padding: 1em; }  /* padding = 1.25 × 20px */
.card small { font-size: 0.8rem;  padding: 1em; }  /* padding = 0.8 × ese texto */
```

<div class="rule">
  <p class="rule-label">Las unidades de viewport tienen una trampa</p>
  <p><code>100vh</code> parece «la altura de la pantalla», y en un móvil no lo es: las barras del navegador aparecen y desaparecen al hacer scroll, así que el valor cambia bajo tus pies y el contenido salta.</p>
  <p>Existen <code>svh</code>, <code>lvh</code> y <code>dvh</code> para las variantes pequeña, grande y dinámica. La regla aplicable hoy es más simple: <strong>no uses una unidad porque sea moderna, úsala cuando sepas respecto a qué se calcula</strong>.</p>
</div>

#### Color y tipografía

```css
color: #1f2937;             /* hexadecimal */
color: rgb(31 41 55);       /* rojo, verde, azul */
color: hsl(215 28% 17%);    /* tono, saturación, luminosidad */
```

Los tres describen el mismo color. `hsl` tiene una ventaja práctica cuando construyes una paleta: para conseguir una variante más clara del mismo color solo tienes que subir el último número, sin recalcular nada.

<div class="rule">
  <p class="rule-label">El contraste no es una cuestión de gusto</p>
  <p>Un texto gris claro sobre fondo blanco puede parecerte elegante y ser ilegible para bastante gente. El criterio está medido: el texto normal necesita una relación de contraste de al menos <strong>4.5:1</strong> con su fondo, y el texto grande, 3:1.</p>
  <p>DevTools lo calcula: al abrir el selector de color de una declaración muestra la relación de contraste y advierte si no alcanza el mínimo. No es necesario estimarlo visualmente.</p>
</div>

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

En tipografía hay tres decisiones que casi nadie explica:

* **La lista de `font-family` es una cadena de respaldo.** El navegador usa la primera que tenga disponible. `system-ui` toma la tipografía del sistema operativo, así que carga instantánea y se ve nativa en cada dispositivo.
* **El `line-height` sin unidad** —`1.6`, no `1.6rem`— es lo correcto: al no tener unidad, cada elemento lo multiplica por *su* tamaño de fuente, así que un titular grande no acaba con el interlineado de un párrafo.
* **Los titulares llevan menos interlineado que el texto.** Un `line-height: 1.6` en un `h1` de 2.5rem deja un hueco enorme entre sus dos líneas. Alrededor de 1.1 es lo habitual.

Los tamaños, además, no se eligen uno a uno: se elige un paso y se multiplica. Una interfaz coherente usa **una o dos familias** y una escala corta. La variedad tipográfica no es riqueza: casi siempre es falta de decisión.

| Nivel | Tamaño |
| ----- | ------ |
| Texto | 1rem |
| h3 | 1.25rem |
| h2 | 1.75rem |
| h1 | 2.5rem |

#### Una decisión escrita una sola vez

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

#### Cuatro funciones que quitan media queries

`calc()` opera entre unidades distintas, que es lo que ninguna otra cosa puede hacer. Necesita espacios alrededor del `-` y del `+`; sin ellos no funciona, y es un despiste que cuesta encontrar.

```css
width: calc(100% - 2rem);
```

`min()` y `max()` se leen al revés de lo que parece: `min()` **pone un techo** y `max()` **pone un suelo**.

```css
width: min(90%, 70rem);      /* nunca pasará de 70rem */
padding: max(1rem, 3vw);     /* nunca bajará de 1rem */
```

`clamp()` reúne las dos con un valor preferido en medio:

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

Ese titular crece con la ventana entre dos límites, sin una sola media query. Es la herramienta con la que se resuelve buena parte del responsive antes de llegar a los *breakpoints*, y volveremos a ella en la sesión 4.

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto</p>

Los tres primeros pasos construyen el sistema visual; los tres últimos lo ponen a prueba cambiándolo entero desde un solo sitio.

#### Paso 1 · Construye tus tarjetas · 30 min

En `productos.html` tienes `article` con el marcado de cada producto. Dales forma:

1. Pon el `box-sizing: border-box` global al principio de tu hoja.
2. Da a cada tarjeta `padding`, `border`, `border-radius` y separación entre ellas.
3. Limita su anchura con `width` y `max-width` en lugar de un valor fijo.
4. Crea la clase `.container` y aplícala para centrar el contenido de las páginas.
5. Inspecciona una tarjeta en DevTools y **localiza en el diagrama de Layout cada una de las cuatro capas**. Comprueba que los números coinciden con lo que escribiste.

<details class="aside aside--extra">
<summary>Consultar · formas de escribir el espaciado y colapso de márgenes</summary>

Los valores de `padding` y `margin` admiten varias formas:

```css
padding: 1rem;                /* las cuatro caras */
padding: 1rem 2rem;           /* vertical | horizontal */
padding: 1rem 2rem 3rem 4rem; /* arriba, derecha, abajo, izquierda */
```

Dos márgenes verticales adyacentes no se suman: se **funden** en el mayor de los dos. Si un párrafo tiene 20px abajo y el siguiente 30px arriba, la separación es 30, no 50.

Solo pasa en vertical, y no pasa dentro de un contenedor Flexbox o Grid. Por eso, en cuanto empecemos a usar `gap`, este problema desaparece: es una de las razones por las que `gap` es preferible a los márgenes para separar elementos de una lista.

</details>

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

**Antes de continuar:** estrecha la ventana hasta 320px. Ninguna tarjeta debe desbordar su contenedor.

#### Paso 2 · Tu sistema visual mínimo · 35 min

Define para tu proyecto, y aplícalo a las cuatro páginas:

1. Familia tipográfica y tamaño base.
2. Una escala de encabezados de tres o cuatro pasos.
3. `line-height` para texto y para titulares.
4. Color de texto, color de fondo y un color principal.
5. Dos o tres medidas de espaciado que vayas a repetir.

Comprueba el contraste de tu color de texto sobre tu fondo con DevTools. Si no llega a 4.5:1, oscurece hasta que llegue.

No buscamos todavía un diseño espectacular. Buscamos **consistencia**: que las cuatro páginas parezcan del mismo sitio.

#### Paso 3 · Elimina los números mágicos · 35 min

<p class="term">Número mágico</p>

Un valor escrito a pelo en el código sin que nada explique de dónde sale. `margin-left: 37px` es el ejemplo perfecto: funciona, nadie sabe por qué, y nadie se atreve a tocarlo.

Sobre tu hoja de estilos:

1. Busca los valores que se repiten: colores, espaciados, radios, tamaños.
2. Decide **cuáles representan una decisión reutilizable** y conviértelos en variables con nombres que digan su papel.
3. Sustituye todas sus apariciones por `var()`.
4. Prueba a cambiar `--color-primary` por otro color y recarga. Si el sitio entero cambia de color con una sola línea, lo has hecho bien.

<details class="aside aside--extra">
<summary>Consultar · un sistema pequeño, y el valor de respaldo</summary>

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

</details>

<div class="rule">
  <p class="rule-label">No conviertas todo en una variable</p>
  <p>Un valor que aparece una sola vez y no es una decisión de diseño no gana nada por ser variable: gana una indirección más que leer. Si <code>border-width: 1px</code> solo está en un sitio, déjalo donde está.</p>
  <p>La pregunta es: <strong>«si esto cambia, ¿tendría que cambiar en otros sitios a la vez?»</strong>. Si la respuesta es sí, es una variable. Si es no, es un valor.</p>
</div>

#### Paso 4 · Titulares fluidos con `clamp()` · 15 min

Sustituye el `font-size` fijo de tus encabezados por un `clamp()` y comprueba el comportamiento estrechando la ventana desde 1600px hasta 320px.

1. Aplica `clamp()` al `h1` y al `h2`.
2. Anota a qué anchura deja de crecer y a cuál deja de encoger, comprobándolo en la pestaña Computed.
3. Comprueba que el `h1` no se come la pantalla en un móvil ni queda diminuto en un monitor grande.
4. Anota la anchura a la que tu catálogo **empieza a verse mal**. Guarda ese número: lo necesitarás en la sesión 4.

#### Paso 5 · Una segunda variante visual · 20 min

Sin tocar una sola regla que no sea una declaración de variable, crea una segunda versión del sitio con otra identidad: otro color principal, otro fondo, otra escala de espaciados.

Guárdala como un bloque `:root` alternativo comentado al principio de la hoja. Si has tenido que modificar alguna regla fuera de `:root`, ese valor era una decisión que se te escapó del sistema: conviértelo en variable y vuelve a intentarlo.

#### Paso 6 · Contraste y coherencia · 15 min

| Comprobación | Resultado | Corrección |
| ------------ | --------- | ---------- |
| Contraste del texto sobre el fondo (mínimo 4.5:1) | | |
| Contraste del color principal sobre el fondo | | |
| Las cuatro páginas usan la misma familia y la misma escala | | |
| No queda ningún color escrito a pelo fuera de `:root` | | |
| No queda ninguna anchura fija en píxeles | | |

#### Ampliación si has completado el trabajo

Primero termina y comprueba los seis pasos. Los dos retos piden diagnosticar y decidir sobre código que no has escrito tú.

##### Reto 1 · Cuatro cajas que desbordan por cuatro motivos distintos

```html
<div class="fila">
  <div class="caja a">Uno</div>
  <div class="caja b">Dos</div>
  <div class="caja c"><img src="foto.jpg" alt="Una foto"></div>
  <div class="caja d">Cuatro palabras bastante largas aquí</div>
</div>
```

```css
.fila { width: 400px; border: 2px solid red; }
.caja { padding: 20px; border: 1px solid #ccc; }

.a { width: 50%; }
.b { width: 200px; margin-left: 30px; }
.c { width: 100%; }
.c img { width: 500px; }
.d { width: 100%; padding: 60px; }
```

Las cuatro se salen del contenedor rojo, y **cada una por una razón distinta**. Para cada caja:

1. Calcula a mano cuánto ocupa realmente, sumando contenido, padding y borde.
2. Di cuál de los cuatro motivos es el suyo: el modelo de caja por defecto, un margen que se suma a una anchura, un contenido interno más ancho que su caja, o un padding desproporcionado.
3. Corrígela **sin cambiar el `width` declarado** de la caja, salvo en el caso en que esa sea la única solución posible. Justifica cuál es ese caso.
4. Aplica el `box-sizing: border-box` global y vuelve a calcular las cuatro. ¿Cuántas quedan arregladas solo con eso? Esa cifra explica por qué esas tres líneas abren toda hoja de estilos.

##### Reto 2 · Qué merece ser variable

Esta hoja pertenece a un proyecto ajeno. Decide qué valores se convierten en custom properties y cuáles se quedan donde están.

```css
.header { background: #0f172a; padding: 24px 32px; border-bottom: 1px solid #1e293b; }
.header h1 { color: #f8fafc; font-size: 28px; letter-spacing: -0.02em; }
.nav a { color: #94a3b8; margin-right: 24px; }
.nav a:hover { color: #f8fafc; }
.card { background: #f8fafc; padding: 24px; border-radius: 12px; }
.card h3 { color: #0f172a; font-size: 20px; }
.card .precio { color: #0f172a; font-size: 28px; font-weight: 700; }
.boton { background: #2563eb; color: #f8fafc; padding: 12px 24px; border-radius: 12px; }
.pie { background: #0f172a; color: #94a3b8; padding: 32px; }
```

1. Haz el recuento: cuántas veces aparece cada color y cada medida.
2. Separa lo que es **una decisión repetida** de lo que solo es **una coincidencia**. Dos valores iguales por casualidad no son la misma decisión, y unirlos bajo una variable crea un acoplamiento falso: el día que uno cambie, arrastrará al otro.
3. Escribe el `:root` y reescribe la hoja. Los nombres deben describir el papel.
4. Justifica dos valores que hayas dejado **sin** convertir en variable, y uno que hayas dudado.
5. Cambia el tema entero a una versión clara modificando solo el `:root`. Anota qué te ha obligado a volver atrás.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tarjetas que no desbordan a 320px, sistema visual aplicado a las cuatro páginas y variables con nombres semánticos.</span></div>
  <div><strong>Si lo tienes</strong><span>La segunda variante visual funcionando cambiando solo el <code>:root</code>, y la tabla de contraste y coherencia contestada.</span></div>
  <div><strong>Reto</strong><span>Las cuatro cajas diagnosticadas con su cálculo a mano, y la hoja ajena convertida en sistema con las decisiones justificadas.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Tu hoja empieza con el <code>box-sizing: border-box</code> global.</li>
    <li>Tienes un bloque <code>:root</code> con colores y espaciados nombrados por su papel.</li>
    <li>Puedes cambiar el color principal del sitio tocando una línea.</li>
    <li>Tus anchuras usan <code>max-width</code> o <code>min()</code>, no medidas fijas.</li>
    <li>Las cuatro páginas comparten tipografía, escala y paleta.</li>
    <li>El contraste del texto sobre el fondo llega al menos a 4.5:1.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Cuál es la diferencia práctica entre <code>padding</code> y <code>margin</code>?</li>
    <li>¿Qué cambia exactamente <code>box-sizing: border-box</code>?</li>
    <li>¿Respecto a qué se calcula un <code>rem</code>, y por qué importa?</li>
    <li>¿Por qué el <code>line-height</code> se escribe sin unidad?</li>
    <li>¿Por qué las variables se declaran en <code>:root</code>?</li>
    <li>¿Qué hace <code>min(90%, 70rem)</code>, en una frase?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El padding es espacio dentro de la caja y se pinta con su fondo; el margin es espacio fuera y siempre es transparente.</p>
  <p>2 · Que <code>width</code> incluya el padding y el borde, en vez de medir solo el contenido.</p>
  <p>3 · Respecto al tamaño de fuente del elemento raíz. Importa porque respeta la preferencia de tamaño de letra de quien usa la web, cosa que un valor en píxeles ignora.</p>
  <p>4 · Para que cada elemento lo multiplique por su propio tamaño de fuente en lugar de heredar una altura fija.</p>
  <p>5 · Porque las custom properties se heredan, y <code>:root</code> es el elemento raíz: declarándolas ahí quedan disponibles en todo el documento.</p>
  <p>6 · Ocupa el 90 % del espacio, pero sin pasar nunca de 70rem. Pone un techo.</p>
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

## Sesión 3 · Flujo normal y Flexbox

<p class="lead">Tres horas. Media hora para entender cómo coloca el navegador cuando no le dices nada y cómo se razona un Flexbox, y dos horas y media rompiendo el flujo a propósito y construyendo los componentes de tu sitio.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo coloca el navegador los elementos por defecto, qué pasa cuando sacas uno de ese flujo, y los dos ejes con los que se razona cualquier Flexbox.</li>
    <li><strong>2. Haz:</strong> Experimenta con <code>display</code> y <code>position</code>, convierte tu navegación en un Flexbox y construye tres componentes justificando cada decisión.</li>
    <li><strong>3. Comprueba:</strong> Sabes decir para cada componente cuál es su eje principal, y nada desborda a 360 px.</li>
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

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Antes de colocar nada conviene saber cómo se coloca solo. Después, dos formas de intervenir: sacar un elemento del flujo, que se usa poco y para cosas concretas, y repartir el espacio de una línea, que es Flexbox y se usa constantemente.

#### Antes de Flexbox y Grid está el flujo normal

<p class="term">Flujo normal</p>

La forma en que el navegador coloca los elementos por defecto: unos detrás de otros, siguiendo el orden del documento. Todo lo que veremos después son maneras de **modificarlo**, no de sustituirlo.

Merece la pena entenderlo porque el flujo normal ya resuelve bien muchas cosas. Un artículo con sus párrafos y sus encabezados, uno debajo de otro y ocupando el ancho disponible, no necesita nada.

| Comportamiento | Qué hace | Elementos típicos |
| -------------- | -------- | ----------------- |
| Bloque | Ocupa todo el ancho disponible y empieza en una línea nueva | `div`, `section`, `article`, `p`, `h1` |
| En línea | Ocupa solo lo que mide su contenido y se coloca dentro del texto | `a`, `strong`, `em`, `span`, `img` |

```css
display: block;          /* fuerza el comportamiento de bloque */
display: inline;         /* fuerza el de línea */
display: inline-block;   /* fluye como texto, pero acepta ancho, alto y márgenes verticales */
display: none;           /* lo saca del documento por completo */
display: flex;           /* lo de hoy */
display: grid;           /* la sesión que viene */
```

`inline-block` resuelve la limitación clásica: a un elemento en línea no puedes darle `width` ni márgenes verticales útiles. Con `inline-block` sí, y sigue colocándose en la misma línea que su texto.

<div class="rule">
  <p class="rule-label"><code>display: none</code> no es «invisible»</p>
  <p>Elimina el elemento del documento: no ocupa espacio y <strong>tampoco existe para un lector de pantalla ni para el recorrido con <code>Tab</code></strong>. Eso es correcto cuando quieres ocultar algo de verdad, y es un error cuando solo querías que no se viera.</p>
  <p>Si necesitas que algo siga estando disponible para quien no ve la pantalla, existen otras técnicas. Si la intención era únicamente que ocupara su hueco sin verse, eso es <code>visibility: hidden</code> o una opacidad, no <code>display: none</code>.</p>
</div>

#### Sacar un elemento del flujo

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

`relative` casi nunca se usa para mover nada: se usa para crear el punto de referencia al que un `absolute` hijo se agarrará.

```css
.card          { position: relative; }
.card .etiqueta{ position: absolute; top: 0; right: 0; }
```

<div class="rule">
  <p class="rule-label">No se maqueta con <code>position: absolute</code></p>
  <p>Colocar cada bloque de la página con coordenadas parece que funciona, y es la maqueta más frágil que existe: los elementos ya no saben nada unos de otros, así que en cuanto un texto crece se solapan, y en una pantalla más estrecha todo queda fuera de sitio.</p>
  <p><code>absolute</code> es para lo que de verdad es posicionamiento: una etiqueta de «oferta» sobre una esquina, un icono dentro de un campo. La distribución de la página se hace con Flexbox y con Grid.</p>
</div>

Cuando algo no cabe, `overflow` decide qué se ve:

```css
overflow: visible;  /* por defecto: el contenido se sale y se ve */
overflow: auto;     /* aparece barra de scroll si hace falta */
overflow: hidden;   /* se recorta lo que no cabe */
```

`overflow: hidden` es tentador cuando algo desborda, y muchas veces es tapar el problema en lugar de resolverlo: el contenido sigue sin caber, ahora además no se puede leer. Donde sí es la respuesta correcta es en contenido que legítimamente es más ancho que la pantalla, como una tabla de datos: ahí `overflow-x: auto` en un contenedor le da su propia barra de scroll sin romper la página.

#### Flexbox distribuye en una dimensión

Flexbox distribuye elementos **en una línea**: o en fila, o en columna. Ese es el criterio para elegirlo, y lo veremos enfrentado a Grid en la sesión 4.

En la UD1 dejaste el menú así:

```html
<nav aria-label="Navegación principal">
    <ul>
        <li><a href="index.html">Inicio</a></li>
        <li><a href="productos.html">Productos</a></li>
    </ul>
</nav>
```

Con dos declaraciones deja de ser una lista vertical, **sin tocar el HTML**:

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

#### Los dos ejes

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

<p class="term">gap</p>

La separación entre elementos de un contenedor Flexbox o Grid. Sustituye a los márgenes y evita su problema clásico: no deja un margen sobrante en el último elemento, y no sufre el colapso de márgenes.

En los hijos, `flex` resume cuánto puede crecer un elemento, cuánto encogerse y cuál es su tamaño de partida:

```css
.logo    { flex: 0 0 auto; }   /* no crece, no se encoge, mide lo que mida */
.buscador{ flex: 1; }          /* se queda con todo el espacio sobrante */
```

`margin-left: auto` en un hijo también tiene un efecto muy útil: empuja ese elemento y todos los siguientes hasta el final del eje. Es la forma limpia de separar un grupo del resto en una barra.

#### El método, en tres preguntas

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

### Se trabaja

<p class="stage stage--guided">150 minutos · laboratorio y componentes de tu proyecto</p>

El paso 1 se hace en un archivo de pruebas, no sobre el proyecto: conviene romper cosas en un sitio donde romperlas no cueste nada. A partir del paso 2 se trabaja sobre el sitio.

#### Paso 1 · Rompe el flujo · 30 min

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

#### Paso 2 · La navegación de tu sitio · 30 min

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

#### Paso 3 · Tres casos razonados · 20 min

Reproduce los tres, aplicando el método de las tres preguntas antes de escribir ninguna propiedad.

##### 3.1 · Una botonera

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

##### 3.2 · Una tarjeta horizontal

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
3. Un tercero en fila para esa última línea, con el precio a la izquierda y el botón a la derecha.

```css
.producto        { display: flex; gap: var(--space-md); }
.producto__datos { display: flex; flex-direction: column; gap: var(--space-xs); }
.producto__pie   { display: flex; justify-content: space-between; align-items: center; }
```

Anidar contenedores es normal y no es un síntoma de nada malo. Cada uno resuelve una dimensión.

##### 3.3 · Centrar

El problema con más recetas copiadas de internet de toda la historia de CSS. Con Flexbox son dos líneas, pero conviene entenderlas:

```css
.caja {
    display: flex;
    justify-content: center;   /* centra en el eje principal */
    align-items: center;       /* centra en el transversal */
}
```

Centrar es simplemente **centrar en los dos ejes a la vez**. Si solo necesitas uno, solo escribes uno.

#### Paso 4 · Los tres centrados · 10 min

Tienes tres cajas, cada una con un cuadrado dentro. Consigue, sin `position` y sin márgenes fijos:

1. El cuadrado centrado en horizontal, arriba del todo.
2. El cuadrado centrado en vertical, pegado a la derecha.
3. El cuadrado centrado en los dos ejes.

<details class="aside aside--extra">
  <summary>Ver respuesta</summary>
  <p>Con <code>display: flex</code> y dirección por defecto (fila):</p>
  <p>1 · <code>justify-content: center;</code> y nada más: el eje principal es el horizontal, y sin <code>align-items</code> el hijo se queda arriba si tiene altura propia.</p>
  <p>2 · <code>justify-content: flex-end; align-items: center;</code></p>
  <p>3 · <code>justify-content: center; align-items: center;</code></p>
  <p>Y la comprobación de que lo has entendido: con <code>flex-direction: column</code>, los tres se resuelven intercambiando las dos propiedades.</p>
</details>

#### Paso 5 · Flexbox Challenge · 45 min

Es el trabajo central de la sesión. Construye estos tres componentes usando **solo Flexbox**, y aplícalos a tu proyecto donde encajen:

**A · La barra de cabecera**, con el nombre del sitio a la izquierda, la navegación a la derecha y todo alineado verticalmente.

**B · La tarjeta horizontal** del paso 3.2, que debe seguir funcionando cuando la descripción sea el doble de larga.

**C · Una línea de metadatos** —fecha, autor, categoría— separada por `gap`, que salte de línea con elegancia cuando no quepa.

Para cada uno responde por escrito:

| Componente | Eje principal | Por qué ese `justify-content` | Por qué ese `align-items` | ¿Necesitó `flex-wrap`? |
| ---------- | ------------- | ----------------------------- | ------------------------- | ---------------------- |
| A | | | | |
| B | | | | |
| C | | | | |

Esa tabla es la tarea. El CSS lo puede escribir cualquiera copiando; la tabla solo la puede rellenar quien ha entendido los ejes.

#### Paso 6 · Revisión cruzada de una decisión · 15 min

Intercambia con un compañero únicamente una sección que ya hayas maquetado. Encuentra **una decisión de layout que no puedas justificar** y descríbela así:

1. **Qué intenta resolver:** tamaño, espacio, distribución o estado.
2. **Qué regla actúa:** compruébala en DevTools.
3. **Qué duda queda:** por qué Flexbox, Grid o el flujo normal podrían encajar mejor.

El autor decide si cambia el código o conserva la decisión y la justifica. No se valora la coincidencia de criterio estético entre ambas partes.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los seis pasos. El primer reto se resuelve **sin escribir CSS**, y es el más difícil de los dos.

##### Reto 1 · Antes de la herramienta, la pregunta

Para cada uno de estos seis casos, decide si lo resolverías con el **flujo normal**, con **Flexbox**, o si necesitarás algo que todavía no hemos visto. Escribe la respuesta y el motivo antes de probar nada.

1. Un artículo de blog: título, párrafos, una imagen y más párrafos.
2. Una barra de cabecera con logotipo, buscador que ocupa el resto y dos iconos a la derecha.
3. Una galería de doce fotos en cuadrícula regular, alineadas en filas y columnas.
4. Una lista de etiquetas de longitud variable que fluyen y saltan de línea.
5. Una ficha con la foto a la izquierda y cinco datos a la derecha, uno bajo otro.
6. El esqueleto de una página: cabecera arriba, barra lateral, contenido y pie.

Dos de los seis no son trabajo de Flexbox, y uno no necesita ninguna herramienta. Identifícalos y explica por qué. Después comprueba tus respuestas construyendo los que puedas con lo que ya sabes, y deja anotados los que tengas que aplazar hasta la sesión 4.

##### Reto 2 · La barra que no cabe

Una cabecera tiene cuatro elementos: el nombre del sitio, un menú de cinco enlaces, un buscador y un menú de usuario. A 1400 px caben todos en una línea; a 360 px, no caben ni de lejos.

Construye una cabecera que degrade con dignidad **sin una sola media query** y sin ocultar nada con `display: none`. Solo puedes usar `flex-wrap`, `gap`, `flex` en los hijos, `min-width` y `max-width`.

1. Decide qué elemento se queda con el espacio sobrante cuando sobra, y cuál cede primero cuando falta. Justifícalo.
2. Consigue que el buscador nunca baje de una anchura utilizable, en lugar de encogerse hasta ser inservible.
3. Anota las tres anchuras en las que la barra cambia de disposición. No las has escrito tú: las decide el contenido. Eso es exactamente lo que discutiremos en la sesión 4 al hablar de *breakpoints*.
4. Comprueba que en ninguna anchura entre 320 y 1600 px aparece una barra de scroll horizontal.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>El laboratorio con su tabla de huecos, la navegación en Flexbox sin desbordar a 360 px y los tres componentes del reto construidos.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de ejes del paso 5 completa y la revisión cruzada contestada.</span></div>
  <div><strong>Reto</strong><span>Los seis casos clasificados antes de escribir CSS, y la cabecera que degrada sin media queries con sus tres anchuras anotadas.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Sabes identificar el eje principal de cualquier Flexbox.</li>
    <li>Sabes que <code>justify-content</code> y <code>align-items</code> se intercambian al cambiar la dirección.</li>
    <li>Usas <code>gap</code> en lugar de márgenes para separar.</li>
    <li>Tu navegación funciona a 360 px sin desbordar.</li>
    <li>No hay ningún valor en píxeles colocando elementos a mano.</li>
    <li>La tabla de ejes de los tres componentes está rellenada y justificada.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>relative</code> y <code>absolute</code> respecto al hueco?</li>
    <li>¿Por qué <code>display: none</code> no es lo mismo que «no se ve»?</li>
    <li>¿Sobre qué eje actúa <code>justify-content</code>?</li>
    <li>¿Qué le pasa a <code>align-items</code> si cambias a <code>flex-direction: column</code>?</li>
    <li>Enuncia las tres preguntas con las que se razona un Flexbox.</li>
    <li>¿Qué hace <code>margin-left: auto</code> en un hijo de un Flexbox?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>relative</code> sigue ocupando su hueco aunque se desplace; <code>absolute</code> sale del flujo y los demás elementos ocupan su sitio.</p>
  <p>2 · Porque lo elimina del documento: deja de existir también para los lectores de pantalla y para el recorrido con <code>Tab</code>.</p>
  <p>3 · Sobre el eje principal, sea cual sea su dirección.</p>
  <p>4 · Pasa a alinear en horizontal, porque el eje transversal ahora es el horizontal.</p>
  <p>5 · Qué elementos van en la misma línea, en qué dirección —ese es el eje principal— y qué hago con el espacio sobrante y con la alineación en el otro eje.</p>
  <p>6 · Absorbe todo el espacio sobrante por ese lado, empujando ese elemento y los siguientes al final del eje.</p>
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

## Sesión 4 · Grid y responsive

<p class="lead">Tres horas. Media hora para entender qué resuelve Grid que Flexbox no y por qué la mayoría de las adaptaciones no necesitan media query, y dos horas y media construyendo un catálogo que se adapta solo y rompiendo tu sitio a cinco anchuras.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué problema bidimensional resuelve Grid, qué significa <code>fr</code>, cómo hacer que el número de columnas lo decida el espacio y dónde va de verdad un <em>breakpoint</em>.</li>
    <li><strong>2. Haz:</strong> Convierte el catálogo en cuadrícula, monta el esqueleto de página con áreas y recorre tu sitio a cinco anchuras corrigiendo lo que se rompa.</li>
    <li><strong>3. Comprueba:</strong> No hay scroll horizontal entre 320 px y 1600 px, y cada media query que hayas escrito responde a un problema que sabes nombrar.</li>
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

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

La sesión tiene una sola idea de fondo: **deja de decir cuántas columnas quieres y describe cuánto necesita cada una**. Grid es la herramienta que lo permite, y el responsive es lo que sale de aplicarla bien.

#### Dos dimensiones a la vez

Flexbox coloca en una línea. Considera ahora este problema:

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

<p class="term">fr</p>

Una fracción del espacio **libre** del contenedor. `1fr 1fr 1fr` reparte lo disponible en tres partes iguales; `2fr 1fr` da el doble a la primera columna.

Es distinta del porcentaje, y la diferencia importa: `33.33%` no descuenta el `gap`, así que tres columnas al 33.33 % con separación desbordan. `1fr` sí lo descuenta, porque reparte lo que queda **después** de los huecos. Por eso con Grid no tienes que hacer cuentas.

```css
grid-template-columns: repeat(3, 1fr);   /* lo mismo, sin repetirte */
grid-template-columns: 250px 1fr;        /* una fija y otra elástica */
grid-template-columns: 1fr 2fr;          /* una parte y dos partes */
```

#### El vocabulario, y por qué se cuentan líneas

<figure class="diagram">
  <figcaption>Las piezas de una cuadrícula</figcaption>
  <ol class="flow">
    <li>Líneas · las divisiones, numeradas desde 1</li>
    <li>Pistas · las columnas y filas que quedan entre líneas</li>
    <li>Celdas · el cruce de una columna con una fila</li>
    <li>Áreas · un grupo rectangular de celdas, que puedes nombrar</li>
  </ol>
</figure>

Conviene fijarse en que **se numeran las líneas, no las columnas**. Una cuadrícula de tres columnas tiene cuatro líneas verticales: la 1 al principio y la 4 al final. Es la fuente de casi todos los desajustes de la sesión.

<div class="rule">
  <p class="rule-label">Usa siempre el inspector de Grid</p>
  <p>En DevTools, junto a un elemento con <code>display: grid</code>, aparece una etiqueta <code>grid</code>. Púlsala y el navegador dibuja encima de la página las líneas con su numeración, las pistas y los huecos.</p>
  <p>No intentes imaginar mentalmente una cuadrícula compleja si el navegador puede dibujártela. Cuando un elemento no cae donde esperabas, el inspector te enseña en un segundo qué línea es la 3 de verdad.</p>
</div>

#### La línea más rentable de la unidad

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

Es decir: **deja de decir cuántas columnas quieres y describe cuánto necesita cada una**. En un móvil cabrá una, en una tablet dos, en un monitor cuatro, y no has escrito una sola media query.

#### Áreas con nombre

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

El dibujo entre comillas **es** el layout. Se ve de un vistazo que la cabecera ocupa las dos columnas y que el lateral está a la izquierda del contenido. Para modificarlo en una pantalla estrecha basta con redibujarlo:

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

Fíjate en un detalle importante: en la pantalla estrecha el contenido va **antes** que el lateral, y el HTML no ha cambiado. Grid permite reordenar visualmente.

<div class="rule">
  <p class="rule-label">Reordenar visualmente tiene un límite</p>
  <p>El orden del teclado sigue al <strong>HTML</strong>, no al CSS. Si mueves visualmente un bloque muy lejos de su sitio en el documento, quien navegue con <code>Tab</code> saltará de un lado a otro de la pantalla sin lógica aparente.</p>
  <p>Reordenar el lateral y el contenido, que están contiguos, es inofensivo. Reordenar a lo grande no lo es. Si el orden visual y el del documento tienen que diferir mucho, lo que está mal es el orden del HTML.</p>
</div>

#### Flexbox o Grid

No compiten. Una regla inicial que funciona:

<figure class="diagram">
  <figcaption>Cómo elegir</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Una dimensión · Flexbox</li>
    <li>Filas y columnas a la vez · Grid</li>
  </ol>
</figure>

Una segunda pregunta afina la decisión: **¿quién debería decidir el tamaño, el contenedor o el contenido?** Grid define la cuadrícula desde fuera y el contenido se acomoda; Flexbox parte de los elementos y reparte lo que sobra. Un menú cuyos enlaces miden cada uno lo suyo es Flexbox. Un catálogo cuyas tarjetas deben coincidir es Grid.

Lo más habitual en código real es que convivan:

```text
GRID     para distribuir las tarjetas
  ↓
FLEXBOX  dentro de cada tarjeta
```

#### Primero fluido, después media queries

Quien entre a tu sitio puede hacerlo desde un móvil, una tablet, un portátil, un monitor grande, media pantalla en una ventana dividida, o un dispositivo que todavía no existe. No puedes enumerarlos.

<figure class="diagram">
  <figcaption>El orden del responsive</figcaption>
  <ol class="flow">
    <li>Primero, que el diseño se adapte solo</li>
    <li>Después, media queries solo donde el contenido ya no funcione</li>
  </ol>
</figure>

Llevas cuatro semanas construyendo herramientas que adaptan solas:

| Herramienta | Qué adapta sola |
| ----------- | --------------- |
| `max-width` y `min()` | La anchura de los contenedores |
| `flex-wrap` | El salto de línea cuando no caben |
| `auto-fit` con `minmax()` | El número de columnas del catálogo |
| `clamp()` | El tamaño de los titulares |
| `gap` | La separación, sin cuentas |

Si las usas bien, buena parte de tu sitio ya es responsive y no lo sabías. Las media queries son para lo que queda.

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

La razón no es ideológica: **el caso de una columna es el más simple**, y partir de lo simple para añadir complejidad da menos código que partir de lo complejo para irlo deshaciendo. La sintaxis `(width >= 48rem)` es la moderna y se lee sola; encontrarás también la clásica, `(min-width: 48rem)`, que significa lo mismo.

<div class="rule">
  <p class="rule-label">Los breakpoints no son teléfonos</p>
  <p>No busques las medidas del iPhone 15 ni del Galaxy de turno. Esa lista cambia cada año y nunca está completa.</p>
  <p>Un <em>breakpoint</em> va donde <strong>tu contenido deja de funcionar</strong>: donde el menú ya no cabe, donde una columna se queda demasiado estrecha para leerse, donde la tarjeta se rompe. Esa anchura se encuentra estirando la ventana hasta que se ve mal, y es distinta en cada proyecto porque cada proyecto tiene otro contenido.</p>
  <p>Ese es el motivo de que el paso 1 pida anotar a qué anchura empieza a verse mal el catálogo. Ese número vale más que cualquier lista de dispositivos.</p>
</div>

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto</p>

El paso 1 provoca el problema a propósito y no lo arregla; el paso 2 lo resuelve con una sola línea. Los cuatro restantes llevan esa idea al sitio entero.

#### Paso 1 · Tu catálogo en cuadrícula · 20 min

En `productos.html`, convierte el contenedor de las fichas en un Grid.

1. Aplica `display: grid` y `gap` al contenedor de los `article`.
2. Prueba `repeat(2, 1fr)`, después `repeat(3, 1fr)` y después `repeat(4, 1fr)`. Quédate con la que mejor te encaje en tu pantalla.
3. Abre el inspector de Grid y localiza las líneas, las pistas y los huecos.
4. Ahora **estrecha la ventana hasta 400 px** y observa qué pasa con las tarjetas.

<div class="rule">
  <p class="rule-label">Todavía no lo arregles</p>
  <p>Vas a ver columnas ridículamente estrechas, con una palabra por línea. Es lo esperado, y es el problema que resuelve el paso siguiente.</p>
  <p>Anota qué has visto y a qué anchura ha empezado a verse mal. Ese número es tu primer <em>breakpoint</em> candidato, y lo has obtenido de la única forma legítima: mirando cuándo el contenido deja de funcionar.</p>
</div>

#### Paso 2 · El catálogo que se adapta solo · 25 min

Aplica `auto-fit` con `minmax()` a tu página de productos. Comprueba de 320 px a 1600 px que en ningún momento hay columnas ilegibles ni tarjetas gigantes.

1. Elige el mínimo de `minmax()` a partir del número que anotaste en el paso 1, no de una cifra redonda.
2. Prueba también con `auto-fill` y explica en un comentario cuál has elegido y por qué.
3. Comprueba con el inspector cuántas columnas hay a 320, 768, 1024 y 1600 px.

<details class="aside aside--extra">
<summary>Consultar · <code>auto-fit</code> frente a <code>auto-fill</code></summary>

Se parecen y hacen cosas distintas cuando **sobra sitio**:

| | Con pocos elementos y mucho espacio |
| --- | --- |
| `auto-fit` | Las columnas vacías se colapsan, y las que hay se estiran para ocuparlo todo |
| `auto-fill` | Se mantienen las columnas vacías, y los elementos conservan su tamaño |

La forma de verlo es la experimentación: pon tres tarjetas en una pantalla ancha y cambia una palabra por la otra. Con `auto-fit` las tres se estiran; con `auto-fill` se quedan a la izquierda con su tamaño.

</details>

#### Paso 3 · El esqueleto de página con áreas · 30 min

Construye este layout con `grid-template-areas`:

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

y su versión en una columna para pantallas estrechas, con el contenido antes que el lateral. Decide tú a qué anchura cambia, y justifícalo por el contenido.

<details class="aside aside--extra">
<summary>Consultar · colocar un elemento en celdas concretas</summary>

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

</details>

<details class="aside aside--help">
  <summary>Estoy atascado · un elemento no cae donde quiero</summary>
  <p>Abre el inspector de Grid y mira <strong>la numeración real de las líneas</strong>. El error casi siempre es contar columnas en lugar de líneas: para ocupar las dos primeras columnas hace falta <code>1 / 3</code>, no <code>1 / 2</code>.</p>
  <p>Y si usas áreas, comprueba que todas las filas del dibujo tienen <strong>el mismo número de nombres</strong>. Si una fila tiene dos y otra tres, la plantilla entera es inválida y se ignora en silencio.</p>
</details>

#### Paso 4 · ¿Flexbox, Grid, los dos o ninguno? · 15 min

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
  <summary>Ver respuesta</summary>
  <p>1 · <strong>Flexbox.</strong> Una línea de enlaces que miden lo que miden.</p>
  <p>2 · <strong>Grid.</strong> Filas y columnas que deben alinearse.</p>
  <p>3 · <strong>Flexbox.</strong> Una dimensión y dos elementos.</p>
  <p>4 · <strong>Ninguno.</strong> El flujo normal ya apila bloques; basta con márgenes o un <code>gap</code> si lo envuelves. No todo necesita un sistema de layout.</p>
  <p>5 · <strong>Grid</strong> para la cuadrícula, y <strong>Flexbox</strong> dentro de cada tarjeta. Los dos.</p>
  <p>6 · <strong>Grid.</strong> Además el indicador ancho se resuelve con <code>span 2</code>, que en Flexbox sería incómodo.</p>
  <p>7 · <strong>Flexbox</strong> con <code>space-between</code>. Una dimensión.</p>
  <p>8 · <strong>Grid</strong> si las tres columnas deben tener el mismo ancho; <strong>Flexbox</strong> si cada una puede medir lo suyo. Aquí las dos respuestas son defendibles, y lo que se evalúa es la justificación.</p>
</details>

#### Paso 5 · Rompe tu página · 45 min

Es el trabajo central de la sesión. Con DevTools en modo dispositivo, recorre tu sitio a estas anchuras:

```text
320 px    móvil pequeño
375 px    móvil habitual
768 px    tablet
1024 px   portátil
1440 px   escritorio
```

Busca a continuación, en las cuatro páginas:

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
  <p>Para localizarlo rápido, en la consola de DevTools puedes recorrer los elementos y ver cuál es más ancho que el documento. O, de forma más rudimentaria: ve dando <code>outline: 1px solid red</code> a secciones enteras hasta ver cuál se sale.</p>
</details>

#### Paso 6 · Defiende cada breakpoint · 15 min

Recorre todas las media queries de tu hoja y rellena una fila por cada una:

| Anchura | Qué deja de funcionar exactamente a esa anchura | ¿Se podía resolver sin media query? |
| ------- | ----------------------------------------------- | ----------------------------------- |
| | | |

Elimina las que no puedas defender. Una media query que está ahí «por si acaso», o copiada de una lista de dispositivos, es código que habrá que mantener sin saber qué protege.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los seis pasos. El segundo reto es el que más enseña de los dos, y consiste en borrar código.

##### Reto 1 · Un panel de indicadores

Construye un panel de seis indicadores con estas condiciones, **sin una sola media query**:

```text
┌─────────────────┬────────┐
│   FACTURACIÓN   │ PEDIDOS│
│   (doble ancho) │        │
├────────┬────────┼────────┤
│ STOCK  │ DEVOL. │ VISITAS│
├────────┴────────┴────────┤
│        INCIDENCIAS        │
│      (todo el ancho)      │
└──────────────────────────┘
```

1. Usa `auto-fit` con `minmax()` para las columnas, y `span` para los dos indicadores anchos.
2. Comprueba qué ocurre a 320 px, donde solo cabe una columna. Un `span 2` en una cuadrícula de una sola columna puede romper el layout: averigua qué pasa exactamente y resuélvelo.
3. Consigue que los seis indicadores tengan la misma altura aunque su contenido sea de longitudes distintas. Di si eso lo resuelve Grid o Flexbox, y por qué.
4. Anota en cuántas disposiciones distintas se reorganiza el panel entre 320 y 1600 px. No las has escrito: las decide el contenido.

##### Reto 2 · Quitar breakpoints

Esta hoja resuelve un catálogo y una cabecera con seis media queries. Todas funcionan, y la mayoría sobran.

```css
.catalogo { display: grid; grid-template-columns: 1fr; gap: 16px; }
.tarjeta h3 { font-size: 18px; }
.cabecera { display: flex; justify-content: space-between; }
.contenedor { width: 100%; padding: 0 16px; }

@media (min-width: 480px) { .catalogo { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px) { .catalogo { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px){ .catalogo { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 768px) { .tarjeta h3 { font-size: 22px; } }
@media (min-width: 1280px){ .tarjeta h3 { font-size: 26px; } }
@media (min-width: 1280px){ .contenedor { width: 1240px; margin: 0 auto; padding: 0; } }
```

1. Sustituye las tres primeras por **una sola declaración** sin media query.
2. Sustituye las dos del titular por **una sola declaración** sin media query.
3. Sustituye la del contenedor por una que no fije una anchura en píxeles.
4. ¿Cuántas media queries quedan al terminar? Si queda alguna, defiéndela: di qué problema de contenido resuelve que no se pueda resolver de otro modo.
5. Compara el número de líneas de las dos versiones y el número de valores que habría que revisar si mañana cambia el diseño.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Catálogo adaptable sin media queries, esqueleto de página con áreas y las cinco anchuras recorridas sin scroll horizontal.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de problemas del paso 5 completa y cada breakpoint defendido en el paso 6.</span></div>
  <div><strong>Reto</strong><span>El panel de indicadores funcionando sin media queries, y la hoja del reto 2 reducida con las eliminaciones justificadas.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Tu catálogo se adapta sin media queries.</li>
    <li>No hay scroll horizontal a 320 px en ninguna página.</li>
    <li>Cada media query que has escrito responde a un problema concreto que puedes nombrar.</li>
    <li>Ninguno de tus breakpoints procede de un modelo de teléfono.</li>
    <li>Sabes justificar, para cada bloque, si es Flexbox o Grid.</li>
    <li>El esqueleto de página usa áreas con nombre y se reordena en pantalla estrecha.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué <code>1fr</code> no es lo mismo que <code>33.33%</code>?</li>
    <li>Una cuadrícula de cuatro columnas, ¿cuántas líneas verticales tiene?</li>
    <li>¿Qué hace <code>repeat(auto-fit, minmax(16rem, 1fr))</code>, en una frase?</li>
    <li>¿Qué riesgo tiene reordenar visualmente con Grid?</li>
    <li>¿Qué significa mobile first y por qué se hace así?</li>
    <li>¿Dónde debe ir un breakpoint?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque <code>fr</code> reparte el espacio que queda <strong>después</strong> de descontar los <code>gap</code>, y el porcentaje no los descuenta.</p>
  <p>2 · Cinco: una a cada lado de cada columna, contando los dos extremos.</p>
  <p>3 · Crea tantas columnas como quepan, de al menos 16rem cada una, repartiéndose el espacio sobrante.</p>
  <p>4 · Que el orden del teclado sigue al HTML, así que un reordenado grande hace que el foco salte por la pantalla sin lógica.</p>
  <p>5 · Escribir primero la disposición más simple y añadir después las de pantallas anchas. Porque partir de lo simple y añadir sale más corto que partir de lo complejo y deshacer.</p>
  <p>6 · Donde el contenido deja de funcionar, no donde está un modelo de dispositivo.</p>
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

## Sesión 5 · Imágenes, estados y movimiento

<p class="lead">Tres horas. Media hora para entender cómo encaja una imagen en un hueco que no es el suyo y por qué el estado de foco no es opcional, y dos horas y media dejando el catálogo coherente y el sitio recorrible sin ratón.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué una imagen rompe un layout, cómo se encajan imágenes de tamaños distintos sin deformarlas, qué estados tiene una interfaz y cuándo un movimiento comunica algo.</li>
    <li><strong>2. Haz:</strong> Consigue un catálogo coherente con imágenes irregulares, recorre tu sitio con el teclado y añade solo las transiciones que informen.</li>
    <li><strong>3. Comprueba:</strong> Ninguna imagen está deformada, sabes en todo momento dónde está el foco, y cada movimiento de tu página comunica algo.</li>
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

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Tres asuntos que parecen menores y no lo son: una imagen que no encaja rompe el layout entero, un foco invisible deja la web inservible para quien no usa ratón, y un movimiento sin motivo estorba. Los tres se resuelven con decisiones, no con recetas.

#### La regla que va en toda hoja de estilos

Una imagen tiene un tamaño propio, y si es más ancha que su contenedor, se sale. Es la causa número uno de scroll horizontal.

```css
img {
    max-width: 100%;
    height: auto;
}
```

`max-width: 100%` impide que sobrepase a su contenedor. `height: auto` es imprescindible junto a la anterior: sin ella, si el HTML declaraba `width` y `height` —como pedíamos en la UD1—, al reducirse el ancho la altura se quedaría fija y la imagen se deformaría.

#### Encajar una imagen en un hueco que no es el suyo

El problema real de un catálogo: las fotos de producto vienen con tamaños y proporciones distintas, y las tarjetas quedan desiguales. La tentación es forzarlas, y eso las estira:

```css
/* Mal: deforma */
.card img { width: 100%; height: 15rem; }
```

La solución es decirle **cómo debe encajar** en el hueco que le das:

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

Si el recorte de `cover` elimina la parte relevante, `object-position` determina qué zona se conserva:

```css
.card img { object-fit: cover; object-position: top; }
```

Mejor todavía que fijar una altura en `rem` es declarar una proporción, porque entonces la altura se calcula sola a partir del ancho y la tarjeta funciona igual en una columna estrecha que en una ancha:

```css
.card img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
}
```

#### Una interfaz tiene más de un estado

```css
a              { color: var(--color-primary); }
a:visited      { color: #6d28d9; }
a:hover        { text-decoration: underline; }
a:focus-visible{ outline: 3px solid currentColor; outline-offset: 3px; }
a:active       { color: #b91c1c; }
```

En formularios, los campos preparados en la UD1 proporcionan ya sus propios selectores:

```css
input:focus     { }
input:required  { }
input:invalid   { }
input:disabled  { }
input:checked   { }
```

`:invalid` merece una advertencia: se aplica desde que carga la página, así que un campo obligatorio y vacío aparece en rojo antes de que nadie haya escrito nada. Combínalo con `:user-invalid`, que solo actúa después de que la persona haya interactuado, o marca el error de otra forma.

<div class="rule">
  <p class="rule-label">Nunca <code>outline: none</code> a secas</p>
  <p>El contorno del foco resulta visualmente poco atractivo y constituye la única indicación de posición para quien navega con teclado. Su supresión deja la web inutilizable para esas personas: al pulsar <code>Tab</code> no se produce ningún cambio perceptible.</p>
  <p>Si no te gusta el contorno por defecto, <strong>sustitúyelo por otro igual de claro</strong>: un contorno propio, un cambio de fondo, un borde. Lo que no vale es dejarlo sin ninguna indicación.</p>
</div>

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

#### Transiciones y transformaciones

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
  <p>Nombra las propiedades. Si puedes elegir, anima <code>transform</code> y <code>opacity</code>: son las dos que el navegador resuelve sin rehacer el layout, y por eso van suaves.</p>
</div>

```css
transform: translateY(-2px);
transform: scale(1.03);
transform: rotate(2deg);
transform: translateY(-2px) scale(1.02);   /* se combinan en una sola declaración */
```

Una transformación **no afecta al espacio que ocupa el elemento**: se dibuja movido, pero su hueco sigue donde estaba y nada se descoloca alrededor. Por eso mover una tarjeta con `transform` es seguro y hacerlo con `margin-top` no.

#### El movimiento tiene que decir algo

Una interfaz no mejora por tener zooms, rebotes, sombras y degradados. Cada efecto debería responder a una pregunta: **¿qué le está comunicando esto a quien lo ve?**

| Movimiento | Comunica | ¿Vale la pena? |
| ---------- | -------- | -------------- |
| Un botón que se aclara al pasar por encima | «Esto se puede pulsar» | Sí |
| Una tarjeta que se eleva ligeramente | «Esto es interactivo» | Sí |
| Un campo que se marca al recibir el foco | «Estás escribiendo aquí» | Sí |
| Un titular que entra rebotando al cargar | Nada | No |

Hay además quien configura su sistema para reducir las animaciones, y no por gusto: el movimiento puede provocar mareo o desorientación. El sistema operativo lo comunica, y CSS puede leerlo.

<p class="term">prefers-reduced-motion</p>

Una media query que no pregunta por el tamaño de la pantalla sino por **una preferencia declarada por quien usa el dispositivo**. Existen más de esta familia, como `prefers-color-scheme`.

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

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto</p>

Los dos primeros pasos arreglan lo que está roto: las imágenes y el foco. Los cuatro últimos añaden movimiento, y después quitan el que sobra.

#### Paso 1 · El catálogo irregular · 35 min

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

**Antes de continuar:** las seis tarjetas tienen la misma altura de imagen y ninguna foto está estirada ni aplastada.

#### Paso 2 · Los estados invisibles · 35 min

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

<details class="aside aside--extra">
<summary>Consultar · selectores modernos que simplifican estos estilos</summary>

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

</details>

#### Paso 3 · Transiciones con una finalidad · 25 min

1. Añade una transición a tus botones y otra a tus tarjetas o enlaces.
2. Nombra las propiedades: nada de `all`.
3. Asegúrate de que los estados de `:hover` y `:focus-visible` son claros y **distintos entre sí**.
4. Por cada transición que escribas, anota en un comentario qué comunica. Si no sabes qué escribir, esa transición sobra.

#### Paso 4 · Respetar la preferencia de movimiento · 10 min

Añade el bloque de `prefers-reduced-motion` al final de tu hoja y compruébalo de verdad, activando la reducción de movimiento en la configuración de tu sistema o desde DevTools, en el panel de *Rendering*.

Anota qué cambia en tu sitio al activarla. Si no cambia nada, o el bloque no está bien escrito, o tus transiciones no estaban donde creías.

#### Paso 5 · Menos es más · 25 min

Ahora la parte determinante: **recorre tu sitio y elimina cualquier efecto que no comunique nada**.

| Efecto | Dónde está | Qué comunica | ¿Se queda? |
| ------ | ---------- | ------------ | ---------- |
| | | | |

Es la única tarea de la unidad en la que se puntúa quitar cosas. Cuenta cuántos efectos tenías y cuántos quedan.

#### Paso 6 · Revisión cruzada sin ratón · 20 min

Intercambia el sitio con un compañero y recorre el suyo **usando solo el teclado**, sin tocar el ratón en ningún momento.

1. Anota el primer punto en el que pierdes de vista el foco.
2. Anota cualquier elemento al que no consigas llegar.
3. Comprueba si algún estado se distingue únicamente por el color, entrando en DevTools y forzando una simulación de daltonismo desde el panel de *Rendering*.
4. Devuelve las tres respuestas con el formato qué / por qué importa / qué probaría.

El autor decide qué acepta. Si rechaza algo, tiene que justificarlo con lo que hace la interfaz, no con lo que le parece más bonito.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los seis pasos. Los dos retos se resuelven decidiendo, y uno de ellos consiste casi entero en borrar.

##### Reto 1 · Las imágenes imposibles

Un cliente entrega estas cinco imágenes para un catálogo de tarjetas iguales:

```text
A · panorámica de 3000 × 600 px    (una estantería entera de la tienda)
B · vertical de 800 × 2400 px      (una torre de ordenador de cuerpo entero)
C · cuadrada de 500 × 500 px       (un ratón sobre fondo blanco)
D · diminuta de 120 × 90 px        (un logotipo de fabricante)
E · foto de 4000 × 3000 px         (un teclado, con la marca en la esquina inferior)
```

Consigue un catálogo coherente. Para **cada una**, decide y justifica:

1. `cover` o `contain`, y por qué.
2. Qué `object-position` necesita, si necesita alguno. La E tiene la información en una esquina: piensa qué pasa al recortarla en un formato apaisado.
3. La D es más pequeña que el hueco. Explica qué ocurre al ampliarla y qué harías en un encargo real, que no siempre es una decisión de CSS.
4. La B, recortada a 16 / 9, deja de mostrar el producto. Propón una solución que no sea deformarla ni recortarla.
5. Escribe una sola regla de CSS que resuelva bien cuatro de las cinco, y di cuál se queda fuera y por qué.

##### Reto 2 · Auditoría de movimiento en una interfaz ajena

Elige una web con bastante animación: una tienda grande, una web de producto, una landing.

| Movimiento que has visto | Qué comunica | Decorativo o informativo | ¿Lo conservarías? |
| ------------------------ | ------------ | ------------------------ | ----------------- |
| | | | |

Localiza al menos seis. Después:

1. Cuenta cuántos son informativos y cuántos decorativos.
2. Activa la reducción de movimiento en DevTools y recarga. ¿Respeta la web la preferencia, o se mueve igual? Es la comprobación interesante del reto.
3. Recorre la página con `Tab`. ¿Se ve el foco? ¿Alguna animación lo persigue o lo oculta?
4. Escribe en tres líneas qué le quitarías a esa interfaz y qué ganaría con ello.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Catálogo con imágenes irregulares sin deformar, foco visible en todos los elementos y dos transiciones justificadas.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de estados completa, el bloque de movimiento reducido comprobado y ningún estado que dependa solo del color.</span></div>
  <div><strong>Reto</strong><span>Las cinco imágenes imposibles resueltas con su justificación, y la auditoría de movimiento de una interfaz ajena.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Todas tus imágenes tienen <code>max-width: 100%</code> y no se deforman.</li>
    <li>El foco es visible en todos los elementos interactivos.</li>
    <li>Los enlaces del texto se distinguen sin depender solo del color.</li>
    <li>Tus transiciones nombran propiedades concretas, no <code>all</code>.</li>
    <li>Respetas <code>prefers-reduced-motion</code>, comprobado activándolo.</li>
    <li>Cada efecto que queda tiene escrito al lado qué comunica.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué par de declaraciones evita que una imagen desborde y se deforme?</li>
    <li>¿Qué diferencia hay entre <code>cover</code> y <code>contain</code>?</li>
    <li>¿Por qué no procede escribir <code>outline: none</code> sin una alternativa que lo sustituya?</li>
    <li>¿Qué hace <code>:focus-visible</code> que no hace <code>:focus</code>?</li>
    <li>¿En qué estado se declara la <code>transition</code>, y por qué?</li>
    <li>¿Por qué mover algo con <code>transform</code> es más seguro que con <code>margin</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>max-width: 100%</code> y <code>height: auto</code>.</p>
  <p>2 · <code>cover</code> llena el hueco recortando lo que sobra; <code>contain</code> mete la imagen entera y deja huecos.</p>
  <p>3 · Porque deja sin ninguna indicación a quien navega con teclado. Si se quita, hay que poner otra igual de clara.</p>
  <p>4 · Solo aplica el estilo cuando la indicación hace falta, típicamente al llegar con el teclado y no al pulsar con el ratón.</p>
  <p>5 · En el estado normal, para que la animación ocurra tanto al entrar como al salir del estado.</p>
  <p>6 · Porque <code>transform</code> no cambia el espacio que ocupa el elemento, así que nada se descoloca a su alrededor.</p>
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

## Sesión 6 · Integración, depuración y entrega

<p class="lead">Tres horas. Media hora para aprender a clasificar un problema de CSS antes de tocarlo, y dos horas y media construyendo una interfaz desconocida, reparando una hoja rota y cerrando la entrega de la unidad.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se traduce una interfaz nueva a seis tipos de decisión, y cómo se diagnostica una página que se ve mal en lugar de rehacerla.</li>
    <li><strong>2. Haz:</strong> Construye una interfaz desde cero, repara una hoja de estilos rota clasificando cada fallo, y pasa la auditoría final a tu sitio.</li>
    <li><strong>3. Entrega:</strong> El sitio, la tabla forense, la matriz de revisión y la defensa.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué diferencia hay entre una transición y una transformación?</li>
    <li>Si una regla no aparece en DevTools, ¿qué causas revisarías? ¿Y si aparece tachada?</li>
    <li>Explica la diferencia entre corregir la causa y añadir una excepción.</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Las dos mitades de la sesión son la misma habilidad vista de los dos lados: clasificar un problema antes de escribir código, y clasificar un fallo antes de corregirlo. Quien no clasifica, prueba cosas.

#### Dónde estábamos y dónde estamos

<figure class="diagram">
  <figcaption>Doce semanas</figcaption>
  <ol class="flow">
    <li>UD1 · estructura, semántica, contenido, formularios, accesibilidad</li>
    <li>UD2 · presentación, Flexbox, Grid, responsive, componentes</li>
    <li>= un sitio web estático completo</li>
  </ol>
</figure>

#### Antes de tocar CSS, clasifica

Ante una interfaz que no has visto, la pregunta no es qué propiedad usar: es de qué tipo es cada problema. Son seis, y no todas las zonas necesitan las seis.

| Zona | Flujo normal | Tamaño | Espacio | Flexbox/Grid | Responsive | Estado |
| ---- | :----------: | :----: | :-----: | :----------: | :--------: | :----: |
| Navegación | | | | | | |
| Destacado | | | | | | |
| Catálogo | | | | | | |
| Botonera | | | | | | |

Dejar una zona en flujo normal también es una decisión, y muchas veces es la correcta.

Un ejemplo de cómo se razona una casilla: las tarjetas de un catálogo se repiten en filas y columnas y su número debe depender del espacio, lo cual apunta a Grid con una plantilla adaptable. Dentro de cada tarjeta, imagen, texto y acción forman una relación en una dimensión, así que puede bastar el flujo normal o un Flexbox. Se resuelve cada nivel por separado.

#### Diagnosticar, no rehacer

Recibirás una página que se ve mal. La tentación es borrarlo todo y empezar de cero, y es exactamente lo que no vas a poder hacer en un trabajo: el CSS que te toque arreglar será de otro, tendrá años y funcionará en sitios que no puedes romper.

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

#### Las cuatro pestañas

| Pestaña | Para qué |
| ------- | -------- |
| **Elements** | El árbol real, ya construido por el navegador |
| **Styles** | Las reglas que llegan al elemento, en orden, con las derrotadas tachadas |
| **Computed** | El valor final de cada propiedad, ya resuelto todo |
| **Layout** | El box model dibujado, y los inspectores de Grid y Flexbox |

Un procedimiento resuelve la mitad de los casos: en Styles, las casillas contiguas a cada declaración la **desactivan en vivo**. Desactivar propiedades una a una hasta que el problema desaparece te dice cuál era la culpable en veinte segundos, sin tocar el archivo.

<div class="rule">
  <p class="rule-label">La distinción que ahorra la mitad del trabajo</p>
  <p><strong>Si la regla no aparece en Styles, es de selector</strong>: una errata en la clase, un error de sintaxis en la regla anterior, o la hoja que no carga. <strong>Si aparece tachada, es de cascada</strong>: sí seleccionó el elemento y perdió el conflicto.</p>
  <p>Son dos diagnósticos distintos y se buscan en sitios distintos. Confundirlos es la causa más habitual de perder una tarde.</p>
</div>

#### Revisar el CSS de otra persona

Un compañero revisará tu proyecto. **No evaluará si le gustan tus colores**: eso no es revisable. Revisará lo técnico, y lo hará con el formato de la UD1: qué, por qué y qué harías tú.

| Aspecto | Problema encontrado | Propuesta |
| ------- | ------------------- | --------- |
| Responsive | El menú desborda a 360 px | Permitir `flex-wrap` o cambiar la disposición |
| Grid | Columnas fijas de 300 px | Usar `minmax()` con `auto-fit` |
| Imágenes | Se deforman en las tarjetas | Revisar dimensiones y añadir `object-fit` |
| Foco | No es visible en los botones | Definir un `:focus-visible` |
| CSS | Un color repetido catorce veces | Convertirlo en custom property |
| Cascada | Un `!important` en la cabecera | Bajar la especificidad del selector que gana |

**No todas las sugerencias tienen por qué ser correctas.** Aprender a evaluar una revisión también forma parte del ejercicio, y rechazar una observación justificándola bien puntúa igual que aceptarla. La regla de la UD1 sigue vigente: se revisa el código, no a la persona.

### Se trabaja

<p class="stage stage--guided">150 minutos · interfaz nueva, hoja rota y cierre del proyecto</p>

Los dos primeros pasos construyen; el tercero y el cuarto reparan. Los dos últimos cierran la unidad.

#### Paso 1 · Clasifica antes de escribir · 15 min

Recibes una captura y el HTML semántico de una página de actividades. La interfaz contiene una cabecera con navegación, un bloque destacado, un catálogo de tarjetas, una botonera de filtros y un aviso final. No recibes ninguna pista sobre las propiedades.

Rellena la tabla de seis decisiones de la explicación, zona por zona, **antes de escribir una sola línea de CSS**. Cuando la tengas, contrasta dos casillas con un compañero: si no coincidís, las dos posturas tienen que poder defenderse.

#### Paso 2 · Construye y defiende la interfaz · 45 min

Se entrega el HTML y una hoja con variables, tipografía y el box model ya preparados. Faltan deliberadamente la distribución del catálogo, el comportamiento de la navegación y los estados de los controles. Completa primero esas tres decisiones y comprueba cada una en DevTools antes de continuar.

La solución debe cumplir estos requisitos sin framework:

1. El contenido conserva una anchura legible y espacios coherentes.
2. La navegación funciona en una línea cuando cabe y no desborda cuando deja de caber.
3. El catálogo decide automáticamente cuántas columnas entran.
4. Las imágenes conservan proporción y encajan sin deformarse.
5. Los filtros y enlaces tienen estados de interacción y foco visibles.
6. No existe scroll horizontal entre 320 px y 1600 px.
7. Cada media query responde a una rotura que puedes señalar.

Al terminar, cambia un requisito: el orden de la navegación, la anchura mínima de tarjeta o la dirección de un componente. Predice el resultado, haz el cambio mínimo y explícalo. Una interfaz bien decidida absorbe ese cambio en pocos minutos.

#### Paso 3 · Quita el `!important` · 10 min

```css
#main .listado div.card.producto {
    margin-left: 37px !important;
}
```

Esta regla funciona. Di tres cosas que están mal en ella, y cómo quedaría bien.

<details class="aside aside--extra">
  <summary>Ver respuesta</summary>
  <p><strong>1 · El <code>!important</code>.</strong> Esconde un conflicto en vez de resolverlo, y obliga a que cualquier ajuste futuro sea otro <code>!important</code>.</p>
  <p><strong>2 · La especificidad.</strong> Un <code>id</code>, dos clases, dos elementos y una clase más: ese selector no se puede sobrescribir con nada razonable. Con <code>.producto</code> bastaría.</p>
  <p><strong>3 · El número mágico.</strong> <code>37px</code> no sale de ninguna decisión: sale de mirar una pantalla. Colocar mediante <code>margin-left</code> es además síntoma de que falta un sistema de layout: si es separación entre elementos de una lista, es <code>gap</code>.</p>
  <p>Quedaría en algo así como <code>.producto { }</code> sin margen, y un <code>gap</code> en el contenedor.</p>
</details>

#### Paso 4 · CSS forense · 40 min

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
  <p>Después, los desbordamientos, porque suelen tener una única causa que produce muchos síntomas. En último lugar, los detalles de cascada, que son locales.</p>
  <p>Regla general de la sesión: <strong>si la regla no aparece en Styles es de selector; si aparece tachada es de cascada</strong>. Esa distinción te ahorra la mitad del trabajo.</p>
</details>

#### Paso 5 · La auditoría final · 20 min

Recorre las cinco listas sobre tu propio sitio. Cada línea que no puedas marcar es trabajo pendiente de hoy.

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

#### Paso 6 · Revisión por pares y cierre de la entrega · 20 min

Intercambia el proyecto y rellena la matriz de revisión con el formato qué / por qué / qué harías. Después recibe la tuya y decide qué aceptas, justificando lo que rechaces.

Se entrega:

* **A · El sitio.** El mismo de la UD1, convertido en una web completa: diseño coherente entre las cuatro páginas, variables CSS para las decisiones repetidas, Flexbox y Grid donde corresponda, navegación adaptable, catálogo responsive, formulario con estilo propio, imágenes adaptables, estados `:hover` y `:focus-visible`, al menos una transición con una finalidad, y media queries solo donde hagan falta.
* **B · La tabla forense** del paso 4, con la columna de tipo de problema.
* **C · La matriz de revisión** del proyecto de tu compañero.
* **D · Tus decisiones**, en media página: las tres decisiones de layout de las que estés más seguro, y por qué.

Dedica los últimos minutos a preparar la defensa. Tres minutos y cuatro preguntas:

* Enseña una parte de tu sitio que se adapte **sin** media query, y explica por qué no la necesita.
* ¿Dónde has puesto un breakpoint y qué te dijo el contenido que lo pusieras ahí?
* Enseña un sitio donde dudaste entre Flexbox y Grid, y por qué elegiste lo que elegiste.
* ¿Has tenido que tocar el HTML de la UD1? Si sí, ¿dónde y por qué?

La defensa incluye una prueba en vivo: se te pedirá **un cambio pequeño sobre tu propio CSS**. Convertir un Grid de tres columnas en dos, cambiar el eje de un Flexbox, hacer que el menú funcione a 360 px, o quitar un `!important` sin romper nada. Si no puedes hacerlo, no controlas el código que has entregado.

| Criterio de evaluación | Puntos |
| ------------------------------------------------------ | -----: |
| Responsive: adaptación fluida y breakpoints justificados | 2 |
| Layout con Grid | 1,5 |
| Layout con Flexbox | 1,5 |
| Sistema visual: variables, tipografía y espaciado | 1,5 |
| Calidad de la cascada: selectores y ausencia de `!important` | 1,5 |
| Accesibilidad visual: foco, contraste y movimiento | 1 |
| Imágenes adaptables | 1 |

No puntúa que el sitio sea vistoso. Puntúa que **aguante**: que siga funcionando cuando cambia el contenido, cuando cambia la pantalla y cuando lo usa alguien que no ve la tuya.

#### Ampliación si has completado el trabajo

Primero termina la entrega. Los dos retos apuntan a lo que viene después de esta unidad: componentes que deciden por su propio espacio, y leer un diseño ajeno.

##### Reto 1 · El componente que no pregunta por la pantalla

Una media query pregunta por el viewport. Una **container query** pregunta por el espacio del contenedor del componente, que no es lo mismo: la misma tarjeta puede aparecer en una columna estrecha de la portada y en el ancho completo de la ficha.

```css
.zona-producto {
  container-type: inline-size;
}

@container (width >= 35rem) {
  .producto { grid-template-columns: 1fr 2fr; }
}
```

1. Coge tu tarjeta de producto y colócala en dos sitios de anchuras muy distintas de tu sitio.
2. Resuélvela primero con una media query y anota qué falla: en una pantalla ancha, la tarjeta de la columna estrecha recibe la disposición ancha aunque no le quepa.
3. Reescríbela con una container query y comprueba que ahora cada copia decide por su cuenta.
4. Explica en tres líneas por qué una media query no podía resolver esto, por muchos breakpoints que le pusieras.
5. Como segunda parte, reescribe **un único componente** con CSS anidado, donde `&` representa al selector exterior. Limita el anidamiento a uno o dos niveles y comprueba con DevTools que no has creado selectores más específicos de lo necesario. Anota qué especificidad tenían antes y después.

##### Reto 2 · Copiar un diseño es leerlo

Recibirás la captura de una interfaz pequeña, sin su código, y tendrás que reproducirla con HTML y CSS.

El objetivo **no** es la coincidencia píxel a píxel. Antes de escribir nada, contesta por escrito sobre la captura:

1. ¿Qué está agrupado con qué? Dibuja las cajas que ves, aunque no tengan borde.
2. ¿Qué está alineado con qué? Las alineaciones invisibles son las que delatan la cuadrícula.
3. ¿Qué espacios se repiten? Si encuentras tres medidas repetidas, ese es su sistema de espaciado.
4. ¿Qué zonas son Grid y cuáles Flexbox? Justifica cada una con la regla de una o dos dimensiones.
5. ¿Cuál es la jerarquía visual y con qué está construida: tamaño, peso, color o espacio?

Después constrúyela. Al terminar, compara tu respuesta 3 con las variables que has acabado escribiendo: si coinciden, has leído bien el diseño.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Interfaz completa, usable a 360 px y en escritorio, sin desbordamientos y con foco visible, y la tabla forense con su columna de tipo.</span></div>
  <div><strong>Si lo tienes</strong><span>La auditoría final superada en las cinco listas y la matriz de revisión intercambiada y contestada.</span></div>
  <div><strong>Reto</strong><span>La tarjeta resuelta con container query y el componente anidado, o el diseño ajeno reproducido con sus cinco preguntas de lectura contestadas.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la entrega</p>
  <ul class="checklist">
    <li>Las cuatro páginas pasan la auditoría completa.</li>
    <li>El HTML sigue validando y no lo has retorcido por motivos visuales.</li>
    <li>No has usado ningún framework CSS.</li>
    <li>La tabla forense está entregada con la columna de tipo de problema.</li>
    <li>Has revisado el proyecto de un compañero y decidido qué aceptas de la suya.</li>
    <li>Puedes hacer un cambio pequeño sobre tu propio CSS delante de alguien.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué seis tipos de decisión separas antes de escribir CSS?</li>
    <li>¿Qué distingue un problema de selector de uno de cascada?</li>
    <li>¿Para qué sirven las casillas junto a cada declaración en Styles?</li>
    <li>¿Por qué no se arregla una página rota rehaciéndola de cero?</li>
    <li>¿Qué se revisa en el CSS de otra persona, y qué no?</li>
    <li>¿Qué diferencia hay entre una media query y una container query?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Flujo normal, tamaño, espacio, distribución, comportamiento responsive y estado.</p>
  <p>2 · Si la regla no aparece en Styles, no ha seleccionado nada: es de selector o de sintaxis. Si aparece tachada, sí seleccionó y perdió: es de cascada.</p>
  <p>3 · Para desactivar propiedades en vivo y localizar cuál causa el problema sin tocar el archivo.</p>
  <p>4 · Porque en un trabajo real el CSS es de otro, tiene años y funciona en sitios que no puedes romper. El segundo motivo es que rehacer el código no identifica dónde estaba el defecto.</p>
  <p>5 · Se revisa lo técnico: cascada, responsive, accesibilidad, organización. No se revisa si gustan los colores.</p>
  <p>6 · La media query pregunta por el viewport; la container query, por el espacio disponible del contenedor del componente.</p>
</details>

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

Su propiedad complementaria, la que gobierna el layout:

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

En la siguiente unidad empieza la programación, y lo hará, de forma deliberada, casi sin modificar la página: primero el lenguaje —datos, decisiones, funciones y estructuras— porque un filtro que no filtra casi nunca es un problema del botón, sino de una lógica que todavía no se sabe leer. La interfaz que reacciona llega justo después, en la UD4.

El trabajo de estas semanas demostrará entonces de nuevo su utilidad: sobre un documento semántico y un CSS que separa estructura de presentación, añadir comportamiento es añadir una capa. Sobre lo otro, es empezar de nuevo.

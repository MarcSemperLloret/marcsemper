---
title: "El DOM: la web que responde"
label: "UD4 · Guía y taller práctico"
section: "ud-04"
order: 4
lang: "es"
summary: "Conectamos las tres capas. El catálogo que en la UD3 vivía en la consola pasa a pintarse en la página, a filtrarse desde un formulario y a llegar desde un servidor. Con una regla que no se negocia: los datos mandan, y la página es solo su reflejo."
duration: "18 sesiones · 6 semanas"
modality: "Individual, con retos y revisión en pareja"
deliverable: "El sitio de las unidades anteriores convertido en una interfaz viva: catálogo pintado desde datos, búsqueda y filtros en tiempo real, formulario validado y accesible, preferencias guardadas y datos cargados desde una API con sus estados de carga, error y vacío."
outcomes:
  - "Explicar qué es el DOM y en qué se diferencia del fichero HTML que escribiste."
  - "Seleccionar elementos con precisión y sin depender de la posición que ocupan."
  - "Modificar contenido, clases y atributos sin reescribir la estructura de la página."
  - "Responder a lo que hace la persona usuaria con eventos, y usar delegación cuando el contenido es dinámico."
  - "Generar la interfaz a partir de un array de datos, en lugar de escribirla a mano."
  - "Mantener una única fuente de verdad y volver a pintar cuando el estado cambia."
  - "Validar un formulario desde JavaScript sin romper la accesibilidad ni la validación nativa."
  - "Guardar preferencias en el navegador y recuperarlas al volver."
  - "Consumir una API con fetch y async/await, tratando la carga, el error y la lista vacía."
  - "Depurar una interfaz distinguiendo un fallo del evento de un fallo de la lógica."
requirements:
  - "El sitio de la UD1 y la UD2 y el módulo de catálogo de la UD3."
  - "Visual Studio Code y un servidor local, como Live Server."
  - "Un navegador moderno con DevTools: consola, Elements, Sources y Network."
  - "Un lector de pantalla o, como mínimo, la navegación completa con teclado."
priorKnowledge:
  - "HTML semántico, formularios y atributos de accesibilidad (UD1)."
  - "Selectores, clases y estados visuales en CSS (UD2)."
  - "Funciones, arrays de objetos, métodos declarativos, módulos y JSON (UD3)."
  - "Depurar con consola y puntos de interrupción (UD3)."
date: "2026-09-04"
---

## ¿Qué vas a aprender?

En la UD3 escribiste un catálogo que funciona, filtra, ordena y busca. Y solo lo has visto en la consola.

Esta unidad conecta ese código con la página. Al terminarla, escribir en un campo filtrará el catálogo mientras escribes, pulsar un botón cambiará el orden, enviar un formulario mostrará errores útiles, y los productos llegarán desde un servidor en vez de estar escritos a mano.

<figure class="diagram">
  <figcaption>Lo que se junta en esta unidad</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>HTML de la UD1</li>
    <li>CSS de la UD2</li>
    <li>Lógica de la UD3</li>
    <li>DOM y eventos</li>
  </ol>
</figure>

### La idea que gobierna la unidad

Hay dos maneras de programar una interfaz. La primera es la que sale sola: cada vez que ocurre algo, buscar el trozo de página afectado y retocarlo a mano. Funciona con dos elementos y se vuelve ingobernable con diez, porque el estado real acaba repartido entre el HTML, tres variables y la memoria de quien lo escribió.

La segunda es la que aprenderemos:

<div class="rule">
  <p class="rule-label">Los datos mandan; la página es su reflejo</p>
  <p>Hay <strong>un</strong> sitio donde vive la verdad: un objeto de estado en JavaScript. Cuando algo cambia, se modifica el estado y se vuelve a pintar a partir de él.</p>
  <p>Nunca se pregunta a la página qué está pasando. Si necesitas saber qué filtro está activo, la respuesta está en tu estado, no en qué botón tiene una clase puesta.</p>
</div>

<figure class="diagram">
  <figcaption>El ciclo que repetirás toda la unidad</figcaption>
  <ol class="flow flow--row flow--chain flow--after">
    <li>Ocurre un evento</li>
    <li>Cambia el estado</li>
    <li>Se vuelve a pintar</li>
  </ol>
</figure>

Esta forma de trabajar es la misma que usan React, Vue y Angular. No vamos a usar ninguno: vamos a hacerlo a mano para que, cuando llegue el framework, reconozcas qué te está resolviendo.

---

## El proyecto continúa

El mismo sitio, con la carpeta `js/` creciendo:

```text
mi-web/
│
├── index.html
├── productos.html          ← la página que más cambia
├── contacto.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── datos.js            ← de la UD3
│   ├── catalogo.js         ← de la UD3, casi sin tocar
│   ├── formato.js
│   ├── estado.js           ← nuevo
│   ├── render.js           ← nuevo
│   ├── eventos.js          ← nuevo
│   └── main.js
│
└── img/
```

Fíjate en algo importante: `catalogo.js` apenas se toca. Las funciones que escribiste en la UD3 siguen sirviendo tal cual, porque devuelven datos y no imprimen nada. Ese es el premio de haberlas escrito así.

<div class="unit-deliverable">
  <p>Una página de productos que se genera desde datos, con búsqueda en vivo, dos filtros y una ordenación; un formulario de contacto validado y accesible; las preferencias del usuario recordadas entre visitas; y el catálogo cargado desde una API con sus tres estados: cargando, error y sin resultados.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 1 · sin frameworks ni librerías</p>
  <p>Ni React, ni Vue, ni jQuery. Todo con el DOM del navegador. Cuando en el módulo de servidor conectes con Angular sabrás exactamente qué parte del trabajo te está haciendo.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 2 · la página sigue funcionando sin JavaScript</p>
  <p>El HTML tiene que seguir siendo válido y navegable: los enlaces enlazan, el formulario tiene su acción, y el contenido esencial no depende de que el código se ejecute. JavaScript <strong>mejora</strong> la página; no la sustituye.</p>
  <p>Es una decisión de accesibilidad y de robustez: una red lenta, un error de script o un bloqueador dejarían tu web en blanco.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 3 · la IA, para entender, no para entregar</p>
  <ol>
    <li><strong>Antes de preguntar:</strong> di si el evento llega o no. Un <code>console.log</code> dentro del manejador separa «no salta» de «salta pero falla».</li>
    <li><strong>Pregunta:</strong> pide una explicación o una pista. Ejemplo: «Mis botones creados después de cargar no responden al clic. Los que estaban en el HTML sí. Explícame por qué sin darme el código».</li>
    <li><strong>Después:</strong> cierra la respuesta y haz una variante distinta.</li>
  </ol>
</div>

---

## Herramientas

Dos pestañas de DevTools que hasta ahora usabas poco pasan al primer plano:

<p class="term">Elements</p>

Muestra el DOM **en vivo**, no tu fichero. Ahí verás aparecer y desaparecer los elementos que crea tu código, y podrás comprobar si una clase se puso de verdad.

<p class="term">Network</p>

Cada petición que hace la página: la URL, el estado, el tiempo y lo que devolvió. En la semana 5 es imprescindible para saber si el problema es tuyo o del servidor.

### No todo pesa lo mismo

<div class="learning-priorities">
  <div class="learning-priorities__essential">
    <strong>Esencial · debes dominarlo</strong>
    <span>Seleccionar, modificar, eventos, delegación, render desde datos, estado y <code>fetch</code>.</span>
  </div>
  <div class="learning-priorities__important">
    <strong>Importante · debes saber aplicarlo</strong>
    <span>Validación accesible, <code>localStorage</code>, estados de carga y error, foco y teclado.</span>
  </div>
  <div class="learning-priorities__extra">
    <strong>Ampliación · cuando lo anterior funciona</strong>
    <span>Plantillas con <code>template</code>, <code>IntersectionObserver</code>, <code>AbortController</code> y animaciones.</span>
  </div>
</div>

---

## Plan de trabajo semanal

| Semana | Bloque temático | Práctica central | Horas |
| :---: | :--- | :--- | :---: |
| **Semana 1** | La página como objetos | Seleccionar y modificar el documento | 3 h |
| **Semana 2** | Eventos y elementos dinámicos | Responder al usuario y crear contenido | 3 h |
| **Semana 3** | Pintar desde datos | Render del catálogo y formularios | 3 h |
| **Semana 4** | Estado y persistencia | Filtros en vivo y preferencias guardadas | 3 h |
| **Semana 5** | Datos remotos | Asincronía, `fetch` y sus tres estados | 3 h |
| **Semana 6** | Interfaz robusta y entrega | Accesibilidad, depuración y revisión por pares | 3 h |
| **Total** | | **Una interfaz completa gobernada por datos** | **18 h** |

<figure class="diagram">
  <figcaption>El ritmo de cada sesión</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Recupera · 5 min</li>
    <li>Aprende y observa · 10–20 min</li>
    <li>Practica · 30–40 min</li>
    <li>Cierra · 5 min</li>
  </ol>
</figure>

---

## Semana 1 · La página como objetos

---

## Sesión 1 · El DOM

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es el DOM, por qué no es tu fichero HTML, y cómo se recorre.</li>
    <li><strong>2. Haz:</strong> Explora el DOM de tu propia web desde la consola.</li>
    <li><strong>3. Comprueba:</strong> Distingues lo que escribiste de lo que el navegador construyó.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Cuando el navegador lee tu HTML, ¿qué crees que hace con él?</li>
    <li>Si cambias algo en la pestaña Elements, ¿cambia tu fichero?</li>
    <li>¿Por qué crees que el código tiene que esperar a que el documento exista?</li>
  </ol>
</div>

### El documento, convertido en objetos

Cuando el navegador lee tu HTML construye en memoria un árbol de objetos: cada etiqueta pasa a ser un objeto con propiedades y métodos. Ese árbol es el **DOM**, y es lo que tu código manipula.

<p class="term">DOM · Document Object Model</p>

La representación en memoria del documento. Tu fichero `.html` es el punto de partida; el DOM es lo que existe mientras la página está abierta, y puede acabar siendo muy distinto del fichero.

<figure class="diagram">
  <figcaption>Del fichero a la pantalla</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Fichero HTML</li>
    <li>El navegador lo analiza</li>
    <li>Árbol DOM en memoria</li>
    <li>Se pinta en pantalla</li>
  </ol>
</figure>

Compruébalo: en la pestaña Elements borra un párrafo; desaparece de la pantalla, pero tu fichero sigue intacto. Recarga y vuelve. Lo que ves en Elements no es tu código, es el DOM.

Y al revés: si tu código crea diez artículos, aparecerán en Elements y no estarán en el fichero. Por eso, cuando en la semana 3 pintes el catálogo, «ver código fuente» no te servirá de nada: hay que mirar Elements.

### El árbol y sus nodos

```javascript
document                       // el documento entero
document.documentElement       // el elemento raíz
document.body                  // el cuerpo
document.title                 // el título de la pestaña

const main = document.querySelector("main");
main.children                  // sus elementos hijos
main.parentElement             // su contenedor
main.firstElementChild
main.nextElementSibling
```

Un detalle que confunde a todo el mundo: el DOM también guarda como nodos los espacios y saltos de línea entre etiquetas. Por eso usamos siempre las propiedades que hablan de **elementos** (`children`, `firstElementChild`) y no las que hablan de nodos en general (`childNodes`, `firstChild`).

### Cuándo puede ejecutarse tu código

Si el código se ejecuta antes de que exista el documento, no encontrará nada:

```javascript
const titulo = document.querySelector("h1");
console.log(titulo);      // null si el script se ejecutó demasiado pronto
```

Esto ya lo resolviste en la UD3: con `defer`, o con `type="module"`, el navegador espera a tener el documento completo. Recuérdalo, porque el `null` de arriba es el error número uno de esta unidad.

### Tarea 1 · Explora tu propia web

Desde la consola de tu página de productos:

1. Cuenta cuántos enlaces hay: `document.querySelectorAll("a").length`.
2. Obtén el texto del `h1`.
3. Recorre las secciones y muestra su primer encabezado.
4. Cambia el título de la pestaña y observa el efecto.
5. Borra un elemento desde Elements y explica por qué el fichero no cambia.
6. Dibuja en papel el árbol de las tres primeras ramas de tu página.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Recorres el árbol desde la consola y explicas qué es el DOM.</span></div>
  <div><strong>Si lo tienes</strong><span>Escribe una función que imprima el árbol con sangría por niveles.</span></div>
  <div><strong>Reto</strong><span>Explica por qué <code>childNodes</code> devuelve más cosas de las que esperabas.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Explicas la diferencia entre tu fichero y el DOM.</li>
    <li>Te mueves por el árbol con las propiedades de elemento.</li>
    <li>Sabes por qué el código debe esperar al documento.</li>
    <li>Reconoces un <code>null</code> por selección prematura.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué es el DOM?</li>
    <li>¿Por qué «ver código fuente» no muestra lo que crea tu código?</li>
    <li>¿Qué devuelve una selección hecha antes de tiempo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El árbol de objetos que el navegador construye a partir del HTML y que existe mientras la página está abierta.</p>
  <p>2 · Porque el código fuente es el fichero recibido, y lo que creas después solo existe en el DOM: se ve en Elements.</p>
  <p>3 · <code>null</code>, porque el elemento aún no existía.</p>
</details>

---

## Sesión 2 · Seleccionar elementos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se localiza un elemento y qué devuelve cada forma de buscarlo.</li>
    <li><strong>2. Haz:</strong> Prepara tu HTML con puntos de anclaje pensados para el código.</li>
    <li><strong>3. Comprueba:</strong> Ninguna de tus selecciones depende de la posición ni de una clase de estilo.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si el diseñador cambia la clase <code>.tarjeta</code> por <code>.card</code>, ¿se rompe tu código?</li>
    <li>¿Qué selectores CSS recuerdas de la UD2?</li>
    <li>¿Qué diferencia hay entre «el primero que cumpla» y «todos los que cumplan»?</li>
  </ol>
</div>

### Los dos métodos que vas a usar

```javascript
const titulo = document.querySelector("h1");            // el primero, o null
const tarjetas = document.querySelectorAll(".producto"); // todos, siempre una lista
```

Aceptan **cualquier selector CSS**, exactamente los que aprendiste en la UD2:

```javascript
document.querySelector("#buscador");
document.querySelector(".catalogo .producto");
document.querySelector("[data-categoria='teclados']");
document.querySelectorAll("article:not(.agotado)");
```

Existen métodos más antiguos —`getElementById`, `getElementsByClassName`— que verás en tutoriales. Funcionan, pero con dos sirve, y los dos aceptan la misma sintaxis que ya sabes.

### Lo que devuelve `querySelectorAll` no es un array

```javascript
const tarjetas = document.querySelectorAll(".producto");

tarjetas.length          // sí
tarjetas.forEach(...)    // sí
tarjetas.map(...)        // TypeError: no es una función

[...tarjetas].map(...)   // convertido en array, ya sí
```

Es una `NodeList`. Tiene `length` y `forEach`, pero no los métodos de la UD3. Los tres puntos la convierten en un array de verdad.

Y una lista vacía **no es null**: si el selector no encuentra nada, `querySelectorAll` devuelve una lista de longitud cero, mientras que `querySelector` devuelve `null`. Confundir esos dos casos es el segundo error más común de la unidad.

### Anclajes pensados para el código

<div class="rule">
  <p class="rule-label">No selecciones por clases de estilo ni por posición</p>
  <p>Si tu código busca <code>.tarjeta-azul</code> o el tercer elemento de una lista, cualquier retoque de diseño lo romperá, y quien lo rompa no sabrá que lo ha roto.</p>
  <p>Usa un atributo <code>data-</code> pensado para eso: <code>data-js="buscador"</code>. Así el HTML declara explícitamente «aquí hay un punto de conexión con el código», y las clases quedan libres para el CSS.</p>
</div>

```html
<input type="search" id="buscador" data-js="buscador" aria-label="Buscar productos">
<ul class="catalogo" data-js="catalogo"></ul>
<p data-js="resultado" role="status"></p>
```

```javascript
const buscador = document.querySelector("[data-js='buscador']");
const catalogo = document.querySelector("[data-js='catalogo']");
```

### Guardar las referencias una sola vez

```javascript
// Mal: busca en el árbol cada vez que el usuario escribe
function alEscribir() {
  document.querySelector("[data-js='catalogo']").textContent = "";
}

// Bien: se busca una vez, al arrancar
const elementos = {
  buscador: document.querySelector("[data-js='buscador']"),
  catalogo: document.querySelector("[data-js='catalogo']"),
  resultado: document.querySelector("[data-js='resultado']")
};
```

Además de ser más rápido, agrupa en un sitio todo lo que tu código espera encontrar en la página. Si algo sale `null`, se ve al arrancar y no en mitad de un evento.

### Tarea 2 · Preparar el terreno

Sobre tu página de productos:

1. Añade atributos `data-js` a los seis elementos con los que vas a trabajar.
2. Crea `js/dom.js` que los seleccione y los exporte en un objeto.
3. Escribe una comprobación que avise por consola si alguno es `null`.
4. Selecciona todas las tarjetas y cuéntalas.
5. Convierte la `NodeList` en array y obtén sus textos con `map`.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Seis anclajes, seleccionados una vez y comprobados.</span></div>
  <div><strong>Si lo tienes</strong><span>Haz que la comprobación diga qué anclaje falta, por su nombre.</span></div>
  <div><strong>Reto</strong><span>Escribe una función que seleccione y lance un error claro si no encuentra el elemento.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Usas los dos métodos de selección y sabes qué devuelve cada uno.</li>
    <li>Seleccionas por <code>data-</code>, no por clases de estilo.</li>
    <li>Conviertes una <code>NodeList</code> en array cuando la necesitas.</li>
    <li>Guardas las referencias una sola vez.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué devuelve <code>querySelector</code> si no encuentra nada? ¿Y <code>querySelectorAll</code>?</li>
    <li>¿Por qué no seleccionamos por clases de CSS?</li>
    <li>¿Cómo se usa <code>map</code> sobre el resultado de <code>querySelectorAll</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>null</code> el primero; una lista vacía el segundo.</p>
  <p>2 · Porque las clases son del diseño y cambian: el código quedaría atado a decisiones visuales.</p>
  <p>3 · Convirtiéndola antes en array con los tres puntos.</p>
</details>

---

## Sesión 3 · Modificar el documento

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se cambia el texto, las clases, los atributos y el estilo de un elemento.</li>
    <li><strong>2. Haz:</strong> Cambia el estado visual de tu catálogo desde el código.</li>
    <li><strong>3. Comprueba:</strong> Cambias clases, no estilos en línea.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si un producto se agota, ¿qué debería cambiar en la página?</li>
    <li>¿Dónde está escrito cómo se ve un producto agotado: en el CSS o en el JavaScript?</li>
    <li>¿Qué riesgo ves en insertar texto escrito por un usuario dentro del HTML?</li>
  </ol>
</div>

### Contenido

```javascript
const titulo = document.querySelector("h1");

titulo.textContent = "Catálogo de productos";     // texto plano: lo habitual
titulo.innerHTML = "Catálogo <strong>2026</strong>";  // interpreta etiquetas
```

<div class="rule">
  <p class="rule-label">Por defecto, <code>textContent</code></p>
  <p>Insertar con <code>innerHTML</code> un texto que venga de fuera —lo que alguien escribió en un campo, lo que devolvió una API— permite colar etiquetas y código en tu página. Es la vía de entrada de los ataques de inyección.</p>
  <p><code>textContent</code> escribe texto y solo texto: lo que llegue se ve tal cual, sin ejecutarse. Usa <code>innerHTML</code> únicamente con marcado que hayas escrito tú, y nunca con datos del usuario.</p>
</div>

### Clases: el puente con el CSS

```javascript
const tarjeta = document.querySelector("[data-js='producto-1']");

tarjeta.classList.add("agotado");
tarjeta.classList.remove("agotado");
tarjeta.classList.toggle("destacado");
tarjeta.classList.contains("agotado");    // true / false
```

<div class="rule">
  <p class="rule-label">JavaScript pone clases; el CSS decide cómo se ven</p>
  <p>Es la separación de capas de siempre, ahora en la tercera. Tu código dice <em>qué está pasando</em> —«esto está agotado», «esto está cargando»— y la hoja de estilos dice cómo se representa.</p>
  <p>Si en lugar de eso escribes <code>elemento.style.backgroundColor = "grey"</code>, has metido una decisión de diseño dentro del comportamiento: nadie la encontrará buscando en el CSS, y no responderá al modo oscuro ni al tema de la UD2.</p>
</div>

### Atributos y datos

```javascript
const enlace = document.querySelector("a");

enlace.getAttribute("href");
enlace.setAttribute("href", "productos.html");
enlace.removeAttribute("target");
enlace.hasAttribute("download");

// Los atributos data- tienen su propio acceso
const tarjeta = document.querySelector("[data-id='7']");
tarjeta.dataset.id;            // "7"  ← siempre texto
Number(tarjeta.dataset.id);    // 7
tarjeta.dataset.categoria = "teclados";
```

`dataset` será la forma de saber, en la semana 2, a qué producto corresponde el botón que se acaba de pulsar. Y fíjate otra vez en lo mismo: llega como **texto**.

### Estilos, y el caso en que sí valen

```javascript
elemento.style.setProperty("--altura-imagen", "220px");
```

Cambiar una variable CSS de las que definiste en la UD2 sí es legítimo: el valor es un dato —una posición, una altura calculada, un porcentaje de progreso— y la regla que lo usa sigue viviendo en la hoja de estilos.

### Tarea 3 · Estado visual desde el código

En tu página de productos, con el catálogo todavía escrito a mano en HTML:

1. Marca con la clase `agotado` los productos sin stock, leyendo el dato de `dataset`.
2. Escribe en un párrafo cuántos productos hay disponibles.
3. Añade un botón que alterne una clase de vista compacta en la lista.
4. Cambia el `title` de la pestaña para incluir el número de resultados.
5. Prueba a hacer lo mismo con `style` y explica por escrito por qué es peor.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Clases aplicadas según datos, y un recuento escrito en la página.</span></div>
  <div><strong>Si lo tienes</strong><span>Que la clase de vista compacta se aplique a todas las tarjetas de una vez.</span></div>
  <div><strong>Reto</strong><span>Escribe un texto con etiquetas usando <code>textContent</code> y observa qué se ve. Explica por qué eso es exactamente lo que quieres.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 1</p>
  <ul class="checklist">
    <li>Explicas qué es el DOM y por qué no es tu fichero.</li>
    <li>Seleccionas por anclajes pensados para el código.</li>
    <li>Cambias texto con <code>textContent</code> y aspecto con clases.</li>
    <li>Sabes por qué <code>innerHTML</code> con datos ajenos es un riesgo.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque permite insertar etiquetas y código que llegan desde fuera; <code>textContent</code> los muestra como texto.</p>
  <p>2 · Añadiendo o quitando clases, para que el aspecto siga viviendo en el CSS.</p>
  <p>3 · Como texto: <code>dataset</code> siempre devuelve cadenas y hay que convertir.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 1 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Explica en dos líneas la diferencia entre tu fichero HTML y el DOM.</li>
    <li>Escribe la selección de un elemento por atributo <code>data-</code>, y di qué devuelve si no lo encuentra.</li>
    <li>¿Por qué cambiamos una clase en lugar de un estilo en línea?</li>
  </ol>
</div>
---

## Semana 2 · Eventos y elementos dinámicos

---

## Sesión 4 · Escuchar lo que hace el usuario

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es un evento, cómo se escucha y qué eventos existen.</li>
    <li><strong>2. Haz:</strong> Haz que tu página reaccione al clic, al teclado y al envío de un formulario.</li>
    <li><strong>3. Comprueba:</strong> Sabes distinguir «no salta el evento» de «salta y falla mi función».</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Enumera cinco cosas que puede hacer una persona en tu página.</li>
    <li>¿Cuáles de ellas se pueden hacer sin ratón?</li>
    <li>¿Qué pasa hoy cuando envías tu formulario de contacto?</li>
  </ol>
</div>

### Escuchar

```javascript
const boton = document.querySelector("[data-js='ordenar']");

boton.addEventListener("click", () => {
  console.log("Han pulsado");
});
```

Tres piezas: el **elemento** que escucha, el **tipo** de evento y la **función** que se ejecutará. Esa función es un callback, el concepto de la sesión 8 de la UD3: tú no la llamas, la llama el navegador cuando ocurre algo.

### Los eventos que usarás

| Evento | Ocurre cuando |
| ------ | ------------- |
| `click` | Se pulsa, con ratón **o con teclado** sobre un control enfocable |
| `input` | Cambia el contenido de un campo, con cada tecla |
| `change` | El campo pierde el foco tras cambiar, o cambia una selección |
| `submit` | Se envía un formulario |
| `keydown` | Se pulsa una tecla |
| `focus` / `blur` | Un elemento gana o pierde el foco |
| `DOMContentLoaded` | El documento está listo |

<div class="rule">
  <p class="rule-label">Escucha en el elemento correcto</p>
  <p>Para un formulario, el evento es <code>submit</code> <strong>en el formulario</strong>, no <code>click</code> en el botón. Solo así funcionan también la tecla Intro dentro de un campo y cualquier otra forma de enviar.</p>
  <p>Y para un control que se pulsa, usa un elemento que sea pulsable de verdad. Un <code>div</code> con un manejador de clic no recibe el foco, no responde a la tecla Intro y no se anuncia como control: es inaccesible por construcción.</p>
</div>

### `submit` y `preventDefault`

```javascript
const formulario = document.querySelector("[data-js='contacto']");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();      // impide que se recargue la página
  console.log("Enviando…");
});
```

Sin `preventDefault`, el navegador hace lo suyo: envía y recarga. Verás tu mensaje en consola durante un instante y desaparecerá. Es el desconcierto clásico de esta sesión.

### Quitar un manejador

```javascript
function alPulsar() { /* ... */ }

boton.addEventListener("click", alPulsar);
boton.removeEventListener("click", alPulsar);
```

Para poder quitarlo hace falta la **misma referencia** de función, así que una flecha escrita en el sitio no se puede retirar. También puedes usar la opción `{ once: true }` para que se ejecute una sola vez.

### El diagnóstico de esta unidad

<figure class="diagram">
  <figcaption>Cuando algo no responde</figcaption>
  <ol class="flow">
    <li>Un console.log como primera línea del manejador</li>
    <li>¿Aparece? El evento llega: el fallo es de tu lógica</li>
    <li>¿No aparece? ¿Existe el elemento, o era null?</li>
    <li>¿El nombre del evento está bien escrito?</li>
    <li>¿El elemento se creó después de registrar la escucha?</li>
  </ol>
</figure>

Ese último caso es el que resuelve la sesión siguiente.

### Tarea 4 · Tu página reacciona

1. Un botón que alterna la vista compacta del catálogo.
2. Un campo de búsqueda que escribe en consola lo tecleado con `input`.
3. El formulario de contacto que evita la recarga y muestra los valores.
4. Un botón que solo funcione una vez, con `{ once: true }`.
5. Comprueba que todo lo anterior se puede hacer **sin ratón**.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres eventos funcionando, incluido <code>submit</code> sin recarga.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade un atajo de teclado que ponga el foco en el buscador.</span></div>
  <div><strong>Reto</strong><span>Pon un manejador de clic en un <code>div</code>, intenta usarlo con el teclado y explica qué falla.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 4</p>
  <ul class="checklist">
    <li>Registras escuchas con las tres piezas claras.</li>
    <li>Usas <code>submit</code> en el formulario y <code>preventDefault</code>.</li>
    <li>Distingues <code>input</code> de <code>change</code>.</li>
    <li>Compruebas si el evento llega antes de tocar la lógica.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué escuchamos <code>submit</code> y no el clic del botón?</li>
    <li>¿Qué hace <code>preventDefault</code>?</li>
    <li>¿Qué compruebas primero si un botón no responde?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque un formulario también se envía con Intro, y el clic no cubre ese caso.</p>
  <p>2 · Cancela el comportamiento por defecto del navegador para ese evento.</p>
  <p>3 · Que el evento llegue: un mensaje en la primera línea del manejador separa el problema en dos.</p>
</details>

---

## Sesión 5 · El objeto evento y la delegación

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué información trae el evento, cómo se propaga y qué es delegar.</li>
    <li><strong>2. Haz:</strong> Un solo manejador que atienda a todas las tarjetas del catálogo.</li>
    <li><strong>3. Comprueba:</strong> Funciona también con las tarjetas que aún no existen.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si tienes cincuenta botones iguales, ¿registrarías cincuenta escuchas?</li>
    <li>¿Cómo sabrías cuál de ellos se ha pulsado?</li>
    <li>¿Qué pasa con los botones que se crean después?</li>
  </ol>
</div>

### El objeto que recibe el manejador

```javascript
catalogo.addEventListener("click", (evento) => {
  evento.target;            // el elemento exacto donde se pulsó
  evento.currentTarget;     // el elemento que escucha
  evento.type;              // "click"
  evento.key;               // en eventos de teclado
  evento.preventDefault();
  evento.stopPropagation();
});
```

La pareja `target` / `currentTarget` es la clave de esta sesión: puedes escuchar en el contenedor y averiguar dentro cuál de sus hijos recibió la acción.

### La propagación

Un clic no ocurre solo en un elemento: recorre el árbol.

<figure class="diagram">
  <figcaption>El camino de un evento</figcaption>
  <ol class="flow">
    <li>Captura · del documento hacia abajo</li>
    <li>Objetivo · el elemento pulsado</li>
    <li>Burbujeo · hacia arriba, hasta el documento</li>
  </ol>
</figure>

El burbujeo es lo que hace posible la delegación. Y también explica un fallo típico: pulsar en un botón dentro de una tarjeta que también escucha el clic dispara los dos manejadores.

<div class="rule">
  <p class="rule-label"><code>stopPropagation</code> es el último recurso</p>
  <p>Detener la propagación arregla el síntoma y deja una trampa: cualquier manejador que alguien registre más arriba —cerrar un menú, un contador de uso— dejará de enterarse, y quien lo escriba no entenderá por qué.</p>
  <p>Antes de detenerla, comprueba si el manejador de arriba puede filtrar por <code>target</code>. Casi siempre puede.</p>
</div>

### Delegar

```javascript
catalogo.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion='añadir']");
  if (!boton) return;                     // el clic no era en un botón nuestro

  const id = Number(boton.dataset.id);
  añadirAlCarrito(id);
});
```

Tres ventajas, y son grandes: una sola escucha en lugar de cincuenta; funciona con las tarjetas que tu código creará después; y no hay que registrar nada de nuevo tras volver a pintar.

<p class="term">closest</p>

Sube por los antepasados desde el elemento pulsado hasta encontrar uno que case con el selector. Resuelve el problema de que el clic caiga en un icono o en el texto de dentro del botón, y no en el botón mismo.

### Teclado, siempre

```javascript
buscador.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") limpiarBusqueda();
});
```

Si delegas clics en elementos que son botones de verdad, el teclado ya funciona: pulsar Intro sobre un botón genera un `click`. Es otra razón para usar el elemento correcto en lugar de un `div` decorado.

### Tarea 5 · Un manejador para todos

1. Añade a cada tarjeta de tu catálogo un botón con `data-accion` y `data-id`.
2. Registra **una sola** escucha en el contenedor.
3. Usa `closest` para localizar el botón y `dataset` para el identificador.
4. Añade una segunda acción y distíngula por su `data-accion`.
5. Comprueba con el teclado que ambas funcionan.
6. Registra una escucha en el contenedor y otra en la tarjeta, y observa el orden.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Una escucha delegada que distingue dos acciones y el producto afectado.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade Escape para limpiar la búsqueda y Intro para aplicar el filtro.</span></div>
  <div><strong>Reto</strong><span>Explica un caso real en el que <code>stopPropagation</code> rompería otra funcionalidad.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 5</p>
  <ul class="checklist">
    <li>Distingues <code>target</code> de <code>currentTarget</code>.</li>
    <li>Explicas el burbujeo con un ejemplo de tu página.</li>
    <li>Delegas con <code>closest</code> y sales pronto si no procede.</li>
    <li>Todo lo que funciona con ratón funciona con teclado.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué ventaja tiene delegar?</li>
    <li>¿Para qué sirve <code>closest</code>?</li>
    <li>¿Por qué evitamos <code>stopPropagation</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Una sola escucha, y funciona con los elementos creados después.</p>
  <p>2 · Para subir desde el elemento pulsado hasta el contenedor que te interesa, aunque el clic cayera en un icono interior.</p>
  <p>3 · Porque impide que otros manejadores más arriba se enteren del evento, y eso rompe cosas a distancia.</p>
</details>

---

## Sesión 6 · Crear y eliminar elementos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se crea un elemento, cómo se inserta y cómo se quita.</li>
    <li><strong>2. Haz:</strong> Genera una tarjeta de producto desde un objeto de datos.</li>
    <li><strong>3. Comprueba:</strong> El HTML generado es tan semántico como el que escribes a mano.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Escribe el HTML de una tarjeta de producto tuya, de memoria.</li>
    <li>¿Qué partes cambian de un producto a otro y cuáles no?</li>
    <li>Si generas HTML desde código, ¿quién garantiza que sigue siendo semántico?</li>
  </ol>
</div>

### Crear, rellenar, insertar

```javascript
const item = document.createElement("li");
item.className = "producto";
item.dataset.id = producto.id;

const titulo = document.createElement("h3");
titulo.textContent = producto.nombre;

item.append(titulo);
catalogo.append(item);          // al final
catalogo.prepend(item);         // al principio
```

| Método | Qué hace |
| ------ | -------- |
| `append` | Añade al final del contenido |
| `prepend` | Añade al principio |
| `before` / `after` | Inserta como hermano |
| `remove` | Se elimina a sí mismo |
| `replaceChildren` | Sustituye todo el contenido de golpe |

### Vaciar un contenedor

```javascript
catalogo.replaceChildren();        // lo deja vacío
catalogo.innerHTML = "";           // funciona, pero pasa por el analizador
```

`replaceChildren` es más claro y más seguro, y admite también los nuevos hijos: `catalogo.replaceChildren(...tarjetas)`.

### Insertar de una vez

Añadir cincuenta elementos uno a uno hace que el navegador recalcule la página cincuenta veces. Se construyen aparte y se insertan juntos:

```javascript
const fragmento = document.createDocumentFragment();

for (const producto of productos) {
  fragmento.append(crearTarjeta(producto));
}

catalogo.replaceChildren(fragmento);
```

### El HTML generado también se audita

<div class="rule">
  <p class="rule-label">Lo que genera tu código pasa las mismas normas de la UD1</p>
  <p>Es fácil que la lista de productos acabe siendo una pila de contenedores genéricos con clases. Si al escribirlo a mano usabas una lista de artículos con su encabezado, su imagen con texto alternativo y su precio, el código tiene que generar exactamente eso.</p>
  <p>La comprobación: abre Elements, copia el marcado generado, pégalo en el validador del W3C. Y recuerda que la jerarquía de encabezados sigue contando.</p>
</div>

### Una función por tarjeta

```javascript
export function crearTarjeta(producto) {
  const item = document.createElement("li");
  item.className = "producto";
  item.dataset.id = producto.id;

  const titulo = document.createElement("h3");
  titulo.textContent = producto.nombre;

  const imagen = document.createElement("img");
  imagen.src = producto.imagen;
  imagen.alt = producto.textoAlternativo;
  imagen.loading = "lazy";

  const precio = document.createElement("p");
  precio.className = "precio";
  precio.textContent = formatearPrecio(producto.precio);

  item.append(imagen, titulo, precio);
  return item;
}
```

Devuelve el elemento y no lo inserta: quien la llama decide dónde va. Es la misma regla de la UD3 —calcular y devolver— aplicada al DOM.

### Tarea 6 · La tarjeta generada

1. Escribe `crearTarjeta(producto)` en `js/render.js`.
2. Genera con ella las tarjetas de tres productos y añádelas con un fragmento.
3. Compara el marcado generado con el que tenías escrito a mano.
4. Valida el resultado copiándolo desde Elements.
5. Añade un botón de acción con sus atributos `data-`.
6. Escribe `vaciarCatalogo()` y comprueba que las escuchas delegadas siguen funcionando.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tarjetas generadas, semánticas y validadas.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade el estado «agotado» como clase y como texto para lectores de pantalla.</span></div>
  <div><strong>Reto</strong><span>Haz la misma tarjeta con la etiqueta <code>template</code> del HTML y compara los dos enfoques.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 2</p>
  <ul class="checklist">
    <li>Tu página responde al ratón y al teclado.</li>
    <li>Usas una sola escucha delegada por contenedor.</li>
    <li>Generas elementos con marcado semántico y válido.</li>
    <li>Insertas en bloque, no de uno en uno.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque cada inserción individual obliga al navegador a recalcular la página.</p>
  <p>2 · <code>replaceChildren()</code> sin argumentos.</p>
  <p>3 · Copiando el marcado desde Elements y pasándolo por el validador del W3C.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 2 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Escribe la escucha que impide que un formulario recargue la página.</li>
    <li>Explica por qué una escucha delegada funciona con elementos que aún no existen.</li>
    <li>¿Qué diferencia hay entre <code>target</code> y <code>currentTarget</code>?</li>
  </ol>
</div>
---

## Semana 3 · Pintar desde datos

---

## Sesión 7 · Render · del array a la página

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> El patrón de render: una función que recibe datos y deja la página como esos datos digan.</li>
    <li><strong>2. Haz:</strong> Pinta todo tu catálogo de la UD3 en la página.</li>
    <li><strong>3. Comprueba:</strong> Borras el HTML escrito a mano y la página sigue igual.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántos productos tienes escritos a mano en el HTML? ¿Y si fueran cuatrocientos?</li>
    <li>Si cambia el precio de uno, ¿cuántos sitios hay que tocar hoy?</li>
    <li>¿Qué debería verse si la lista queda vacía tras filtrar?</li>
  </ol>
</div>

### La función de render

```javascript
import { crearTarjeta } from "./render.js";

export function pintarCatalogo(productos, contenedor) {
  if (productos.length === 0) {
    contenedor.replaceChildren(mensajeVacio());
    return;
  }

  const fragmento = document.createDocumentFragment();
  for (const producto of productos) {
    fragmento.append(crearTarjeta(producto));
  }
  contenedor.replaceChildren(fragmento);
}
```

Tiene tres propiedades que conviene nombrar, porque son las que la hacen fiable:

1. **Recibe lo que pinta.** No consulta variables globales ni pregunta a la página.
2. **Deja el contenedor completo.** No añade sobre lo que hubiera: lo sustituye.
3. **Se puede llamar mil veces.** El resultado depende solo de los datos que reciba.

<p class="term">Idempotente</p>

Que ejecutarla dos veces con los mismos datos deje el mismo resultado. Sin esa propiedad, cada nuevo filtrado duplicaría el catálogo, que es el fallo con el que casi todo el mundo se estrena en esta sesión.

### El estado vacío no es un detalle

Una lista vacía sin mensaje parece una web rota. Y no basta con «No hay resultados»:

```javascript
function mensajeVacio() {
  const parrafo = document.createElement("p");
  parrafo.className = "vacio";
  parrafo.textContent = "No hay productos que coincidan. Prueba a quitar algún filtro.";
  return parrafo;
}
```

Un buen estado vacío dice qué ha pasado y qué se puede hacer.

### Borrar el HTML escrito a mano

Ahora el catálogo vive en los datos. En el HTML solo queda el contenedor:

```html
<ul class="catalogo" data-js="catalogo"></ul>
```

Con una salvedad, que es la condición 2 de la unidad: si tu web debe seguir mostrando contenido sin JavaScript, el HTML conserva los productos y el código los sustituye al arrancar. Decide cuál de las dos opciones eliges, y escríbelo en tus notas.

### Tarea 7 · El catálogo pintado

1. Escribe `pintarCatalogo(productos, contenedor)` en `js/render.js`.
2. Píntalo al arrancar desde `main.js`, importando los datos de la UD3.
3. Añade el estado vacío con un mensaje útil.
4. Llama a la función dos veces seguidas y comprueba que no se duplica.
5. Pinta un subconjunto usando una de tus funciones de filtrado de la UD3.
6. Muestra en un párrafo cuántos resultados se están viendo.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Catálogo completo pintado desde datos, con estado vacío.</span></div>
  <div><strong>Si lo tienes</strong><span>Pinta también un resumen: total, disponibles y precio medio.</span></div>
  <div><strong>Reto</strong><span>Mide con la consola cuánto tarda en pintar cuatrocientos productos.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 7</p>
  <ul class="checklist">
    <li>Tu render recibe los datos que pinta.</li>
    <li>Sustituye el contenido en lugar de añadirlo.</li>
    <li>Trata el caso de lista vacía con un mensaje útil.</li>
    <li>Reutilizas sin cambios las funciones de la UD3.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué significa que un render sea idempotente?</li>
    <li>¿Por qué la función recibe los datos en vez de leerlos de una variable global?</li>
    <li>¿Qué debe decir un buen estado vacío?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que llamarla varias veces con los mismos datos deja siempre el mismo resultado.</p>
  <p>2 · Para poder pintar cualquier subconjunto y para poder probarla por separado.</p>
  <p>3 · Qué ha ocurrido y qué puede hacer la persona a continuación.</p>
</details>

---

## Sesión 8 · Formularios desde JavaScript

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se leen los valores de un formulario y qué tipo tienen.</li>
    <li><strong>2. Haz:</strong> Lee tu formulario de contacto y conviértelo en un objeto de datos.</li>
    <li><strong>3. Comprueba:</strong> Cada valor llega con el tipo correcto antes de usarse.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué campos tiene tu formulario de la UD1?</li>
    <li>Un campo numérico, ¿devuelve número?</li>
    <li>¿Cómo sabrías si una casilla está marcada?</li>
  </ol>
</div>

### Leer un campo

```javascript
const buscador = document.querySelector("[data-js='buscador']");

buscador.value            // siempre texto
buscador.value.trim()
Number(precioMaximo.value)   // convertir en el borde, como en la UD3

casilla.checked           // true / false
seleccion.value           // el valor de la opción elegida
```

<div class="rule">
  <p class="rule-label">Todo campo devuelve texto</p>
  <p>Incluso los numéricos y los de fecha. Es exactamente el <code>"10" + 5</code> de la sesión 3 de la UD3, que ahora deja de ser un ejercicio y pasa a ser tu bug.</p>
  <p>Convierte al leer, y comprueba: un campo numérico vacío da cadena vacía, y <code>Number("")</code> es <code>0</code>, no <code>NaN</code>. Ese cero silencioso ha estropeado muchos filtros.</p>
</div>

### Leer el formulario entero

```javascript
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const datos = Object.fromEntries(new FormData(evento.currentTarget));
  console.log(datos);
  // { nombre: "Ana", email: "ana@…", mensaje: "Hola" }
});
```

`FormData` recoge los campos que tengan atributo `name` —de ahí la insistencia de la UD1 en ponerlo— y `Object.fromEntries` los convierte en un objeto normal, listo para validarlo con las funciones que escribiste en la UD3.

Las casillas no marcadas no aparecen, y los grupos de casillas con el mismo nombre requieren `getAll`.

### Reaccionar mientras se escribe

```javascript
buscador.addEventListener("input", (evento) => {
  const termino = evento.target.value.trim();
  pintarCatalogo(buscar(catalogo, termino), contenedor);
});
```

Ya tienes la búsqueda en vivo: `buscar` es la función de la sesión 15 de la UD3, sin un solo cambio.

### Otras cosas útiles

```javascript
formulario.reset();          // vuelve a los valores iniciales
buscador.focus();            // pone el foco
buscador.select();           // selecciona el contenido
campo.disabled = true;       // deshabilita mientras se envía
```

### Tarea 8 · Leer y usar

1. Búsqueda en vivo con `input` sobre tu catálogo pintado.
2. Un filtro de precio máximo con conversión y comprobación del campo vacío.
3. Lee el formulario de contacto entero con `FormData` al enviarlo.
4. Muestra en consola el objeto resultante y comprueba el tipo de cada valor.
5. Añade un botón de limpiar que vacíe los filtros y devuelva el foco al buscador.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Búsqueda en vivo y lectura completa del formulario.</span></div>
  <div><strong>Si lo tienes</strong><span>Combina búsqueda y precio máximo en una sola consulta.</span></div>
  <div><strong>Reto</strong><span>Detecta el caso del campo numérico vacío y trátalo como «sin límite».</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 8</p>
  <ul class="checklist">
    <li>Conviertes cada valor al leerlo.</li>
    <li>Usas <code>FormData</code> y sabes que depende del atributo <code>name</code>.</li>
    <li>Tratas el campo vacío antes de que se convierta en un cero.</li>
    <li>Reutilizas las funciones de la UD3 sin modificarlas.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿De qué tipo es el valor de un campo numérico?</li>
    <li>¿Qué campos recoge <code>FormData</code>?</li>
    <li>¿Cuánto vale <code>Number("")</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Texto, siempre.</p>
  <p>2 · Los que tienen atributo <code>name</code>; las casillas sin marcar no aparecen.</p>
  <p>3 · Cero, que es justo lo que hay que detectar antes de usarlo como límite.</p>
</details>

---

## Sesión 9 · Validación accesible

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se combina la validación nativa del navegador con la tuya, sin perder accesibilidad.</li>
    <li><strong>2. Haz:</strong> Valida tu formulario de contacto y muestra errores que se puedan oír.</li>
    <li><strong>3. Comprueba:</strong> Un lector de pantalla anuncia el error y el foco va al campo que falla.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué validación tiene ya tu formulario de la UD1, sin JavaScript?</li>
    <li>Un error escrito en rojo junto al campo, ¿lo percibe quien no ve la pantalla?</li>
    <li>¿Por qué el servidor también tendrá que validar, en la UD6?</li>
  </ol>
</div>

### Lo que el navegador ya hace

En la UD1 escribiste campos obligatorios, tipos de dato y patrones. Eso sigue funcionando y es la primera línea de defensa. JavaScript no viene a sustituirla:

```javascript
campo.validity.valueMissing;    // obligatorio y vacío
campo.validity.typeMismatch;    // no parece un correo
campo.validity.patternMismatch;
campo.checkValidity();          // true / false
formulario.noValidate = true;   // asumo yo la presentación de los errores
```

<div class="rule">
  <p class="rule-label">Tres validaciones, y ninguna sobra</p>
  <ol>
    <li><strong>Nativa:</strong> inmediata y gratis, funciona sin JavaScript.</li>
    <li><strong>Con JavaScript:</strong> mensajes mejores, reglas que el HTML no expresa, avisos mientras se escribe.</li>
    <li><strong>En el servidor (UD6):</strong> la única obligatoria, porque las dos anteriores se pueden saltar.</li>
  </ol>
  <p>Un cliente que valida bien mejora la experiencia. Un servidor que no valida es un agujero.</p>
</div>

### Un error que se ve y se oye

```html
<label for="email">Correo electrónico</label>
<input type="email" id="email" name="email" required
       aria-describedby="error-email">
<p id="error-email" class="error" role="alert"></p>
```

```javascript
function mostrarError(campo, mensaje) {
  const destino = document.querySelector(`#error-${campo.id}`);
  destino.textContent = mensaje;
  campo.setAttribute("aria-invalid", "true");
}

function limpiarError(campo) {
  document.querySelector(`#error-${campo.id}`).textContent = "";
  campo.removeAttribute("aria-invalid");
}
```

Tres piezas que hacen el error perceptible para todo el mundo: `aria-describedby` ata el mensaje al campo, `aria-invalid` marca el campo como erróneo, y `role="alert"` hace que el lector de pantalla lo anuncie al aparecer.

El color rojo, por sí solo, no informa a quien no distingue colores. Igual que en la UD2: el color acompaña, no comunica.

### Cuándo avisar

Avisar con cada tecla mientras alguien escribe su correo es molesto y aparece en rojo antes de que haya terminado. El criterio habitual:

<figure class="diagram">
  <figcaption>Cuándo se valida cada campo</figcaption>
  <ol class="flow">
    <li>Al salir del campo: primera comprobación</li>
    <li>Al enviar: todos los campos</li>
    <li>Mientras se escribe: solo para quitar un error ya mostrado</li>
  </ol>
</figure>

### Al enviar

```javascript
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const errores = validarContacto(Object.fromEntries(new FormData(formulario)));

  if (errores.length > 0) {
    errores.forEach(({ campo, mensaje }) => mostrarError(campos[campo], mensaje));
    campos[errores[0].campo].focus();     // el foco, al primero que falla
    return;
  }

  enviar();
});
```

Llevar el foco al primer campo con error es lo que permite corregir sin buscar. Y `validarContacto` es, otra vez, la función de validación de la UD3: recibe un objeto y devuelve la lista de errores.

### Tarea 9 · Formulario validado

1. Añade a cada campo su párrafo de error con `role="alert"` y `aria-describedby`.
2. Valida al salir de cada campo y al enviar.
3. Muestra todos los errores a la vez y lleva el foco al primero.
4. Quita el error en cuanto el campo se corrige.
5. Prueba el formulario **solo con el teclado**, de principio a fin.
6. Comprueba que sin JavaScript el formulario sigue validando lo básico.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Errores accesibles, foco al primero y sin recarga.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade un resumen de errores al principio del formulario, con enlaces a cada campo.</span></div>
  <div><strong>Reto</strong><span>Escribe un mensaje distinto para «vacío» y para «formato incorrecto» en el mismo campo.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 3</p>
  <ul class="checklist">
    <li>Tu catálogo se genera desde datos y trata el caso vacío.</li>
    <li>Lees el formulario y conviertes cada valor.</li>
    <li>Los errores se ven, se oyen y llevan el foco donde toca.</li>
    <li>La validación nativa sigue funcionando sin JavaScript.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Nativa, en el cliente con JavaScript, y en el servidor; la del servidor es la obligatoria.</p>
  <p>2 · <code>aria-describedby</code>, <code>aria-invalid</code> y <code>role="alert"</code>.</p>
  <p>3 · Al primer campo que falla, para poder corregir sin buscarlo.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 3 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>¿Qué significa que un render sea idempotente, y qué se ve si no lo es?</li>
    <li>Escribe cómo leerías un campo numérico de formulario para poder sumarlo.</li>
    <li>Nombra los tres atributos que hacen que un error de formulario se perciba sin ver la pantalla.</li>
  </ol>
</div>
---

## Semana 4 · Estado y persistencia

---

## Sesión 10 · El estado, una sola fuente de verdad

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es el estado de una interfaz y por qué debe estar en un solo sitio.</li>
    <li><strong>2. Haz:</strong> Reescribe tu página con el ciclo evento → estado → render.</li>
    <li><strong>3. Comprueba:</strong> Ninguna decisión se toma leyendo la página.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Ahora mismo, ¿dónde está guardado qué filtro está activo?</li>
    <li>Si hubiera dos sitios donde consultarlo, ¿qué podría pasar?</li>
    <li>¿Qué información necesitarías para volver a pintar la página exactamente igual?</li>
  </ol>
</div>

### El problema que resuelve

Sin estado, la información se reparte: el término de búsqueda está en el campo, la categoría en la clase de un botón, el orden en una variable y los resultados en el DOM. Cuatro sitios que hay que mantener de acuerdo a mano, y que tarde o temprano dejan de estarlo.

<p class="term">Estado</p>

Un objeto que contiene todo lo que hace falta para saber cómo debe verse la interfaz en este momento. Si lo tienes, puedes pintar la página entera desde cero.

```javascript
// js/estado.js
export const estado = {
  productos: [],
  busqueda: "",
  categoria: "todas",
  orden: "precio-asc",
  soloDisponibles: false,
  cargando: false,
  error: null
};
```

### El ciclo

```javascript
// js/main.js
function actualizar() {
  const visibles = aplicarFiltros(estado);
  pintarCatalogo(visibles, elementos.catalogo);
  pintarResumen(visibles.length, estado.productos.length, elementos.resumen);
  sincronizarControles(estado, elementos);
}

elementos.buscador.addEventListener("input", (evento) => {
  estado.busqueda = evento.target.value;
  actualizar();
});

elementos.orden.addEventListener("change", (evento) => {
  estado.orden = evento.target.value;
  actualizar();
});
```

Cada manejador hace exactamente dos cosas: **cambiar el estado** y **pedir que se actualice**. Ninguno toca el DOM directamente.

<figure class="diagram">
  <figcaption>Una dirección única</figcaption>
  <ol class="flow flow--row flow--chain flow--after">
    <li>Evento</li>
    <li>Cambia el estado</li>
    <li>actualizar()</li>
    <li>La página refleja el estado</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">No preguntes a la página; pregunta al estado</p>
  <p>La tentación es comprobar si un botón tiene una clase para saber si el filtro está activo. Eso convierte al DOM en un almacén de datos, y a partir de ahí hay dos verdades que pueden discrepar.</p>
  <p>El DOM es <strong>salida</strong>, no memoria. Se escribe en él; no se lee de él.</p>
</div>

### Aplicar los filtros en un sitio

```javascript
// js/catalogo.js — funciones de la UD3, combinadas
export function aplicarFiltros(estado) {
  let resultado = estado.productos;

  if (estado.busqueda.trim() !== "") resultado = buscar(resultado, estado.busqueda);
  if (estado.categoria !== "todas") resultado = porCategoria(resultado, estado.categoria);
  if (estado.soloDisponibles) resultado = disponibles(resultado);

  return ordenar(resultado, estado.orden);
}
```

Una función pura: recibe el estado y devuelve la lista que toca. Se puede probar sin abrir el navegador, que es exactamente lo que la hace fácil de arreglar cuando algo falla.

### Tarea 10 · Reescribir con estado

1. Crea `js/estado.js` con el objeto y sus valores iniciales.
2. Escribe `aplicarFiltros(estado)` combinando tus funciones de la UD3.
3. Escribe `actualizar()` como único punto que pinta.
4. Convierte todos tus manejadores al patrón «cambia estado, actualiza».
5. Elimina cualquier lectura del DOM que sirviera para decidir algo.
6. Comprueba que cambiando el estado a mano desde la consola y llamando a `actualizar()` la página responde.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Estado único, una función de render y manejadores de dos líneas.</span></div>
  <div><strong>Si lo tienes</strong><span>Que <code>sincronizarControles</code> deje los campos coherentes con el estado.</span></div>
  <div><strong>Reto</strong><span>Escribe el estado inicial en la URL y recupéralo al cargar.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 10</p>
  <ul class="checklist">
    <li>Existe un único objeto de estado.</li>
    <li>Los manejadores cambian estado y llaman a actualizar.</li>
    <li>Ninguna decisión se toma leyendo el DOM.</li>
    <li>Puedes reproducir cualquier vista fijando el estado a mano.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué es el estado de una interfaz?</li>
    <li>¿Por qué el DOM no debe ser el almacén de datos?</li>
    <li>¿Qué dos cosas hace un manejador de eventos?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Todo lo necesario para saber cómo debe verse la página ahora mismo.</p>
  <p>2 · Porque tendrías dos fuentes de verdad que pueden contradecirse.</p>
  <p>3 · Cambiar el estado y pedir que se vuelva a pintar.</p>
</details>

---

## Sesión 11 · Filtros, orden y búsqueda en vivo

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se combinan varios filtros y cómo se evita trabajar de más.</li>
    <li><strong>2. Haz:</strong> Monta el panel de filtros completo de tu catálogo.</li>
    <li><strong>3. Comprueba:</strong> Los filtros se combinan bien y el resultado se anuncia.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si hay búsqueda y categoría a la vez, ¿deben cumplirse las dos o basta una?</li>
    <li>Al escribir «teclado» se disparan siete eventos. ¿Importa?</li>
    <li>¿Cómo se entera de que hay tres resultados quien no ve la pantalla?</li>
  </ol>
</div>

### Combinar filtros

Los filtros se aplican **en cadena**: cada uno reduce lo que dejó el anterior, y el resultado son los productos que cumplen todo a la vez. Ese encadenamiento ya lo escribiste ayer en `aplicarFiltros`, y es la razón de que añadir un filtro nuevo sea añadir tres líneas.

Dos decisiones de producto que hay que tomar a conciencia:

| Situación | Decisión razonable |
| --------- | ------------------ |
| Búsqueda vacía | No filtra nada |
| Categoría «todas» | No filtra nada |
| Precio máximo vacío | Sin límite, no cero |
| Ningún resultado | Mensaje con salida: «quita algún filtro» |

### No trabajar de más

Filtrar cuatrocientos productos con cada tecla es trabajo repetido. Se limita con una función que espera a que la persona deje de escribir:

```javascript
function retrasar(funcion, milisegundos = 250) {
  let temporizador;
  return (...argumentos) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcion(...argumentos), milisegundos);
  };
}

elementos.buscador.addEventListener("input", retrasar((evento) => {
  estado.busqueda = evento.target.value;
  actualizar();
}, 250));
```

<p class="term">Debounce</p>

Agrupar una ráfaga de eventos en una sola ejecución, la última. Con un buscador local se nota poco; en la semana 5, cuando cada pulsación sea una petición al servidor, será obligatorio.

Fíjate en que `retrasar` es una función que devuelve otra función: exactamente lo que practicaste en la sesión 8 de la UD3.

### Anunciar el resultado

```html
<p data-js="resumen" role="status" aria-live="polite"></p>
```

```javascript
export function pintarResumen(visibles, total, destino) {
  destino.textContent = visibles === total
    ? `${total} productos`
    : `${visibles} de ${total} productos`;
}
```

<div class="rule">
  <p class="rule-label">Un cambio que no se anuncia, para algunas personas no ocurre</p>
  <p>Cuando el catálogo se filtra, quien ve la pantalla percibe el cambio al instante. Quien usa un lector de pantalla no se entera de nada, porque el foco sigue en el campo de búsqueda.</p>
  <p>Una región con <code>aria-live="polite"</code> hace que el lector anuncie el nuevo texto sin interrumpir. Es una línea de HTML y cambia por completo la experiencia.</p>
</div>

### Tarea 11 · El panel completo

1. Añade al menos tres controles: búsqueda, categoría y orden.
2. Genera las opciones de categoría **desde los datos**, no a mano.
3. Añade una casilla de «solo disponibles».
4. Aplica el retraso a la búsqueda y comprueba la diferencia en consola.
5. Anuncia el número de resultados en una región activa.
6. Añade un botón de limpiar que restaure el estado inicial.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres filtros combinables, resumen anunciado y botón de limpiar.</span></div>
  <div><strong>Si lo tienes</strong><span>Rango de precio con dos campos y validación de que el mínimo no supera al máximo.</span></div>
  <div><strong>Reto</strong><span>Muestra las «pastillas» de filtros activos, cada una con su botón de quitar.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 11</p>
  <ul class="checklist">
    <li>Los filtros se combinan y ninguno pisa a otro.</li>
    <li>Las opciones se generan desde los datos.</li>
    <li>La búsqueda no recalcula con cada tecla.</li>
    <li>El número de resultados se anuncia a los lectores de pantalla.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué hace un <em>debounce</em>?</li>
    <li>¿Qué debe hacer un precio máximo vacío?</li>
    <li>¿Para qué sirve <code>aria-live</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Esperar a que pare la ráfaga de eventos y ejecutar una sola vez.</p>
  <p>2 · No filtrar: significa «sin límite», no cero.</p>
  <p>3 · Para que un lector de pantalla anuncie los cambios de esa zona sin que haya que moverse hasta ella.</p>
</details>

---

## Sesión 12 · Recordar entre visitas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se guardan datos en el navegador y qué límites tiene.</li>
    <li><strong>2. Haz:</strong> Recuerda las preferencias de tu usuario entre visitas.</li>
    <li><strong>3. Comprueba:</strong> Un dato guardado corrupto no rompe la página.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué debería recordar tu web entre visitas? ¿Y qué no?</li>
    <li>¿Dónde crees que se guarda eso?</li>
    <li>¿Qué pasaría si alguien edita a mano lo guardado?</li>
  </ol>
</div>

### Guardar y recuperar

```javascript
localStorage.setItem("preferencias", JSON.stringify(preferencias));
const texto = localStorage.getItem("preferencias");   // texto, o null
localStorage.removeItem("preferencias");
```

Solo guarda **texto**, así que todo pasa por `JSON.stringify` y `JSON.parse`: las dos funciones de la sesión 12 de la UD3.

| Almacén | Dura | Para qué |
| ------- | ---- | -------- |
| `localStorage` | Hasta que se borre | Preferencias, borradores |
| `sessionStorage` | Hasta cerrar la pestaña | Datos de un proceso en curso |
| Cookies | Según se configuren | Sesión de servidor (UD6) |

### Leer con desconfianza

<div class="rule">
  <p class="rule-label">Lo guardado es entrada externa</p>
  <p>Cualquiera puede abrir DevTools y editarlo. Puede estar corrupto, puede ser de una versión anterior de tu web, puede no estar. Si tu código hace <code>JSON.parse</code> a pelo, un valor manipulado deja la página en blanco.</p>
  <p>Léelo dentro de un <code>try/catch</code>, valida su forma, y si algo no cuadra, usa los valores por defecto y sigue. Es el mismo principio de la UD3: validar en el borde.</p>
</div>

```javascript
const PREFERENCIAS_POR_DEFECTO = { categoria: "todas", orden: "precio-asc" };

export function leerPreferencias() {
  try {
    const guardado = localStorage.getItem("preferencias");
    if (!guardado) return { ...PREFERENCIAS_POR_DEFECTO };

    const datos = JSON.parse(guardado);
    return {
      categoria: typeof datos.categoria === "string" ? datos.categoria : "todas",
      orden: typeof datos.orden === "string" ? datos.orden : "precio-asc"
    };
  } catch {
    return { ...PREFERENCIAS_POR_DEFECTO };
  }
}
```

### Qué se guarda y qué no

<div class="rule">
  <p class="rule-label">Nunca datos personales ni credenciales</p>
  <p>Lo que guardes ahí es legible por cualquiera que se siente delante del equipo y por cualquier código que se ejecute en tu página. Preferencias de interfaz, sí. Contraseñas, tokens, datos de tarjetas o información personal, no.</p>
  <p>Y si guardas algo que identifique a una persona, entras en el terreno del consentimiento y la protección de datos, que es harina de otro costal.</p>
</div>

También hay límites de tamaño —unos pocos megabytes— y el acceso puede fallar directamente en navegación privada o con el almacenamiento bloqueado. Otra razón para el `try/catch`.

### Tarea 12 · Preferencias que duran

1. Guarda categoría, orden y vista compacta al cambiarlas.
2. Recupéralas al arrancar y aplícalas al estado antes del primer render.
3. Valida lo leído y usa valores por defecto si no cuadra.
4. Estropea a mano el valor guardado desde DevTools y comprueba que la web aguanta.
5. Añade un botón de «restablecer preferencias».
6. Escribe en tus notas qué has decidido no guardar, y por qué.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres preferencias que sobreviven a recargar, con lectura defensiva.</span></div>
  <div><strong>Si lo tienes</strong><span>Guarda también el término de búsqueda y decide si eso es buena idea.</span></div>
  <div><strong>Reto</strong><span>Versiona lo guardado con una clave de versión y migra el formato antiguo.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 4</p>
  <ul class="checklist">
    <li>Un único estado gobierna toda la interfaz.</li>
    <li>Los filtros se combinan y se anuncian.</li>
    <li>Las preferencias sobreviven a la recarga.</li>
    <li>Un dato guardado inválido no rompe nada.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Solo texto: hay que serializar con JSON.</p>
  <p>2 · Porque es editable por cualquiera y puede venir de una versión anterior de la web.</p>
  <p>3 · Preferencias de interfaz; nunca credenciales ni datos personales.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 4 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Enumera los campos que tendría el estado de tu página.</li>
    <li>Un manejador de eventos, ¿qué dos cosas hace exactamente?</li>
    <li>¿Qué debe hacer un precio máximo vacío, y por qué no puede valer cero?</li>
  </ol>
</div>
---

## Semana 5 · Datos remotos

---

## Sesión 13 · Por qué existe la asincronía

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué JavaScript no espera, y qué es el bucle de eventos.</li>
    <li><strong>2. Haz:</strong> Predice el orden de ejecución de varios fragmentos.</li>
    <li><strong>3. Comprueba:</strong> Explicas por qué un valor «llega vacío» cuando llega tarde.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si pedir datos a un servidor tarda dos segundos, ¿qué debería hacer la página mientras tanto?</li>
    <li>¿Puede la página quedarse congelada? ¿Por qué sería grave?</li>
    <li>¿En qué orden crees que se ejecutan tres líneas si la de en medio tarda?</li>
  </ol>
</div>

### Un solo hilo

JavaScript ejecuta una cosa cada vez. Si una operación bloquea, se bloquea todo: no responden los clics, no se desplaza la página, no se reproduce una animación.

Por eso las operaciones lentas —una petición de red, un temporizador, leer un fichero— **no se esperan**. Se encargan, y el resultado llega después.

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");

// 1, 3, 2
```

Aunque el retraso sea cero. La función encargada se pone en cola y se ejecuta cuando el trabajo actual termina.

<figure class="diagram">
  <figcaption>Cómo se reparte el trabajo</figcaption>
  <ol class="flow">
    <li>Se ejecuta el código actual hasta el final</li>
    <li>Las tareas lentas se encargan fuera</li>
    <li>Cuando terminan, su función entra en la cola</li>
    <li>El bucle de eventos la ejecuta cuando hay hueco</li>
  </ol>
</figure>

### El fallo que produce

```javascript
let productos = [];

setTimeout(() => {
  productos = [{ nombre: "Teclado" }];
}, 1000);

console.log(productos.length);    // 0, no 1
```

No es que el array esté mal: es que se mira antes de tiempo. Cuando en la sesión 15 pidas datos al servidor y te salga una lista vacía, esta será la primera sospecha.

<div class="rule">
  <p class="rule-label">Un valor que llega tarde no se puede leer pronto</p>
  <p>La consecuencia práctica es una regla de diseño: <strong>todo lo que dependa del dato tiene que ocurrir dentro de lo que se ejecuta cuando el dato llega</strong>, no en la línea de después.</p>
  <p>La sintaxis para escribir eso sin acabar con seis niveles de anidamiento es la de mañana.</p>
</div>

### Temporizadores

```javascript
const id = setTimeout(() => console.log("Una vez"), 1000);
clearTimeout(id);

const otro = setInterval(() => console.log("Cada segundo"), 1000);
clearInterval(otro);
```

Guarda siempre el identificador: un intervalo que nadie detiene sigue corriendo mientras la página esté abierta.

### Tarea 13 · Predecir el orden

1. Escribe cinco fragmentos que mezclen código normal y temporizadores; predice el orden y compruébalo.
2. Reproduce el fallo del array vacío y explícalo por escrito.
3. Simula una carga de dos segundos que muestre un mensaje de «cargando» y luego los datos.
4. Monta un contador con `setInterval` y detenlo con un botón.
5. Provoca un intervalo no detenido y observa el efecto en consola.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Predices el orden de ejecución y explicas el fallo del valor leído pronto.</span></div>
  <div><strong>Si lo tienes</strong><span>Simula una carga que a veces falla y muestra un mensaje distinto.</span></div>
  <div><strong>Reto</strong><span>Explica qué pasa si pones un bucle de diez millones de vueltas en un manejador de clic.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 13</p>
  <ul class="checklist">
    <li>Explicas por qué JavaScript no espera a lo lento.</li>
    <li>Predices el orden con temporizadores de por medio.</li>
    <li>Reconoces el fallo del valor leído antes de tiempo.</li>
    <li>Detienes los temporizadores que creas.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque tiene un solo hilo: esperar bloquearía toda la interfaz.</p>
  <p>2 · Al final, después del código actual, aunque el retraso sea cero.</p>
  <p>3 · Que el dato aún no había llegado cuando se leyó.</p>
</details>

---

## Sesión 14 · Promesas y async/await

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es una promesa y cómo se escribe código asíncrono que se lee en orden.</li>
    <li><strong>2. Haz:</strong> Convierte tus simulaciones de ayer en funciones con <code>async</code> y <code>await</code>.</li>
    <li><strong>3. Comprueba:</strong> Tus errores asíncronos se capturan, no se pierden.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Ayer, para hacer algo tras la carga, ¿dónde tenías que escribirlo?</li>
    <li>¿Y para hacer tres cosas seguidas, cada una tras la anterior?</li>
    <li>¿Qué pasa si una de ellas falla?</li>
  </ol>
</div>

### Una promesa es un valor futuro

<p class="term">Promesa</p>

Un objeto que representa un resultado que todavía no está: puede quedar <em>cumplida</em> con un valor, o <em>rechazada</em> con un error. No es el dato: es el compromiso de que habrá uno.

```javascript
const promesa = new Promise((resolver, rechazar) => {
  setTimeout(() => resolver("Datos listos"), 1000);
});

promesa
  .then((valor) => console.log(valor))
  .catch((error) => console.error(error))
  .finally(() => console.log("Terminado"));
```

Casi nunca tendrás que crear promesas: te las darán hechas `fetch` y casi todas las APIs modernas. Lo que sí harás cada día es consumirlas.

### `async` y `await`

```javascript
async function cargarProductos() {
  try {
    const respuesta = await pedirAlServidor();
    const productos = await respuesta.json();
    return productos;
  } catch (error) {
    console.error(`No se pudieron cargar: ${error.message}`);
    return [];
  }
}
```

`await` **pausa esa función** hasta que la promesa se resuelva, sin bloquear el resto de la página. El código se lee de arriba abajo, como el síncrono, y los errores se capturan con el `try/catch` de la UD3.

Dos reglas que evitan la mayoría de tropiezos:

| Regla | Consecuencia |
| ----- | ------------ |
| `await` solo dentro de `async` | Fuera, es un error de sintaxis (salvo en el nivel superior de un módulo) |
| Una función `async` devuelve una promesa | Quien la llame necesita `await`, o `.then` |

```javascript
const productos = cargarProductos();          // una promesa, no la lista
const productos = await cargarProductos();    // ahora sí, la lista
```

Ese primer caso —imprimir una promesa creyendo que son los datos— es el error número uno de esta semana. La consola muestra `Promise { <pending> }`, y ahí está la pista.

### En serie o a la vez

```javascript
// En serie: dos segundos si cada una tarda uno
const productos = await cargarProductos();
const categorias = await cargarCategorias();

// A la vez: un segundo, porque no dependen entre sí
const [productos, categorias] = await Promise.all([
  cargarProductos(),
  cargarCategorias()
]);
```

Espera en serie solo cuando la segunda petición necesita el resultado de la primera.

### Tarea 14 · Reescribir con await

1. Convierte tus simulaciones de la sesión 13 en funciones `async`.
2. Escribe `esperar(ms)` que devuelva una promesa, y úsala.
3. Encadena tres operaciones y muestra su duración total.
4. Repite con `Promise.all` y compara los tiempos.
5. Provoca un rechazo y captúralo con `try/catch`.
6. Imprime a propósito la promesa sin `await` y explica lo que ves.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres funciones <code>async</code> con sus errores capturados.</span></div>
  <div><strong>Si lo tienes</strong><span>Compara medida la diferencia entre serie y paralelo.</span></div>
  <div><strong>Reto</strong><span>Escribe una función que reintente dos veces antes de rendirse.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 14</p>
  <ul class="checklist">
    <li>Explicas qué es una promesa y sus dos finales.</li>
    <li>Usas <code>async</code> y <code>await</code> con <code>try/catch</code>.</li>
    <li>Sabes que una función <code>async</code> devuelve una promesa.</li>
    <li>Distingues cuándo esperar en serie y cuándo a la vez.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Cumplida con un valor, o rechazada con un error.</p>
  <p>2 · Una promesa pendiente: falta el <code>await</code>.</p>
  <p>3 · Cuando la segunda operación necesita el resultado de la primera.</p>
</details>

---

## Sesión 15 · fetch y los tres estados

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se piden datos a un servidor y qué puede salir mal.</li>
    <li><strong>2. Haz:</strong> Carga tu catálogo desde una API con sus estados de carga, error y vacío.</li>
    <li><strong>3. Comprueba:</strong> Con la red simulada lenta o caída, tu página se comporta bien.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué ve tu usuario mientras los datos tardan tres segundos?</li>
    <li>¿Y si el servidor responde con un error?</li>
    <li>¿En qué se parece esto a lo que hacías con un cliente HTTP en clase?</li>
  </ol>
</div>

### Pedir datos

```javascript
export async function obtenerProductos() {
  const respuesta = await fetch("/api/productos");

  if (!respuesta.ok) {
    throw new Error(`El servidor respondió ${respuesta.status}`);
  }

  return respuesta.json();
}
```

<div class="rule">
  <p class="rule-label">Un 404 no rechaza la promesa</p>
  <p><code>fetch</code> solo falla si no hubo respuesta: sin red, DNS caído, petición cancelada. Un 404 o un 500 <strong>son</strong> una respuesta, así que la promesa se cumple y tu código sigue como si nada, con un cuerpo que no es lo que esperabas.</p>
  <p>Por eso la comprobación de <code>respuesta.ok</code> no es opcional: es la línea que convierte un error del servidor en un error de tu programa.</p>
</div>

Las dos fases importan: `fetch` resuelve cuando llegan las cabeceras, y `.json()` es una segunda promesa que se resuelve al terminar de leer el cuerpo. De ahí los dos `await`.

### Los tres estados de cualquier carga

<figure class="diagram">
  <figcaption>Lo que tiene que contemplar toda petición</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Cargando</li>
    <li>Error</li>
    <li>Vacío</li>
    <li>Datos</li>
  </ol>
</figure>

```javascript
async function cargar() {
  estado.cargando = true;
  estado.error = null;
  actualizar();

  try {
    estado.productos = await obtenerProductos();
  } catch (error) {
    estado.error = "No se pudo cargar el catálogo. Inténtalo de nuevo.";
  } finally {
    estado.cargando = false;
    actualizar();
  }
}
```

El estado que montaste en la sesión 10 ya tenía sitio para `cargando` y `error`: la función de render decide qué pintar en cada caso, y ninguna otra parte del código se entera de nada.

<div class="rule">
  <p class="rule-label">El mensaje de error es para la persona; el detalle, para la consola</p>
  <p>«No se pudo cargar el catálogo. Inténtalo de nuevo» es útil. «TypeError: Failed to fetch» no lo es, y además cuenta cosas de tu sistema que no hacen falta ahí.</p>
  <p>Registra el error técnico con <code>console.error</code> y muestra el mensaje humano, con una salida: reintentar, volver, avisar.</p>
</div>

### Probarlo de verdad

En DevTools, pestaña Network, puedes simular una red lenta o desconectada. Es la única forma de ver tus estados: con la red local todo va tan rápido que el indicador de carga no se llega a ver.

Comprueba las cuatro situaciones: carga normal, red lenta, sin red y respuesta con error del servidor.

### CORS, el error que verás

Si pides datos a otro dominio y no ha dado permiso, el navegador bloquea la respuesta y la consola habla de CORS. No es un fallo de tu código: es una política de seguridad del navegador, y se resuelve **en el servidor**. Lo harás tú mismo en la UD6.

### Tarea 15 · Catálogo desde la red

1. Coloca tu catálogo como fichero `.json` y cárgalo con `fetch`.
2. Comprueba `respuesta.ok` y lanza un error con el código de estado.
3. Añade al estado `cargando` y `error`, y píntalos.
4. Muestra un indicador de carga y un mensaje de error con botón de reintentar.
5. Prueba las cuatro situaciones con Network.
6. Consume además una API pública real y observa su respuesta.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Carga desde fichero JSON con los tres estados pintados.</span></div>
  <div><strong>Si lo tienes</strong><span>Botón de reintentar que vuelve a lanzar la carga.</span></div>
  <div><strong>Reto</strong><span>Cancela una petición en curso con <code>AbortController</code> cuando llega otra.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 5</p>
  <ul class="checklist">
    <li>Explicas por qué JavaScript no espera y qué es una promesa.</li>
    <li>Usas <code>async/await</code> con errores capturados.</li>
    <li>Compruebas <code>respuesta.ok</code> en toda petición.</li>
    <li>Tu página contempla cargando, error, vacío y datos.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el 404 es una respuesta válida: la promesa se cumple y hay que mirar <code>ok</code> o <code>status</code>.</p>
  <p>2 · Cargando, error, vacío y datos.</p>
  <p>3 · Es una política del navegador sobre peticiones a otro origen, y se resuelve en el servidor.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 5 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Predice el orden de tres líneas con un <code>setTimeout</code> de cero milisegundos en medio.</li>
    <li>¿Por qué un 404 no rechaza la promesa de <code>fetch</code>? Escribe la comprobación que falta.</li>
    <li>Nombra los cuatro estados de una carga.</li>
  </ol>
</div>
---

## Semana 6 · Interfaz robusta y entrega

---

## Sesión 16 · Accesibilidad y rendimiento con JavaScript

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué rompe JavaScript cuando se usa sin cuidado, y cómo se evita.</li>
    <li><strong>2. Haz:</strong> Audita tu interfaz con el teclado y arregla lo que falle.</li>
    <li><strong>3. Comprueba:</strong> Todo lo que se puede hacer con ratón se puede hacer sin él.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Recorre tu página entera con el tabulador. ¿Sabes siempre dónde estás?</li>
    <li>Cuando el catálogo se vuelve a pintar, ¿dónde queda el foco?</li>
    <li>¿Qué pasa si alguien tiene activada la reducción de movimiento?</li>
  </ol>
</div>

### Lo que JavaScript rompe con facilidad

| Problema | Cómo se ve | Cómo se arregla |
| -------- | ---------- | --------------- |
| Controles falsos | Un contenedor genérico que hace de botón | Usar el elemento correcto |
| Foco perdido | Tras pintar, el foco vuelve al principio | Devolverlo a un punto con sentido |
| Cambios mudos | El contenido cambia y nadie lo anuncia | Una región activa |
| Foco invisible | El contorno se quitó en el CSS | `:focus-visible` de la UD2 |
| Trampa de foco | Un panel del que no se sale con el tabulador | Gestionar el foco al abrir y cerrar |
| Movimiento forzado | Animaciones para quien pidió que no las hubiera | Respetar la preferencia del sistema |

### El foco después de pintar

```javascript
function actualizar() {
  const activo = document.activeElement?.dataset.js;
  pintarCatalogo(aplicarFiltros(estado), elementos.catalogo);
  if (activo) elementos[activo]?.focus();
}
```

Al sustituir el contenido de un contenedor, el elemento que tenía el foco deja de existir y el foco vuelve al documento. Para quien navega con teclado eso significa empezar de cero cada vez que escribe una letra.

<div class="rule">
  <p class="rule-label">El foco es la posición de quien no ve la pantalla</p>
  <p>Cuando cambias contenido, pregúntate dónde debería quedar el foco: en el control que se usó, en el primer resultado nuevo, o en el mensaje de error que acaba de aparecer.</p>
  <p>Un panel que se abre lleva el foco dentro; al cerrarse, lo devuelve al control que lo abrió. Es la regla que hace usable un diálogo sin ratón.</p>
</div>

### Respetar las preferencias

```javascript
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!sinMovimiento) elemento.classList.add("con-animacion");
```

La misma consulta que usaste en el CSS de la UD2, ahora desde el código. Las decisiones de la persona usuaria se respetan en las tres capas.

### Rendimiento: las tres cosas que importan

1. **No trabajar de más.** Un `debounce` en lo que se dispara en ráfaga.
2. **No tocar el DOM en bucle.** Construir aparte, insertar una vez.
3. **No mezclar leer y escribir.** Leer una medida obliga al navegador a recalcular; hacerlo dentro de un bucle que además escribe multiplica ese coste.

```javascript
// Costoso: lee y escribe alternativamente
for (const tarjeta of tarjetas) {
  tarjeta.style.setProperty("--alto", `${tarjeta.offsetHeight}px`);
}

// Mejor: primero se lee todo, después se escribe todo
const alturas = tarjetas.map((t) => t.offsetHeight);
tarjetas.forEach((t, i) => t.style.setProperty("--alto", `${alturas[i]}px`));
```

Con doscientas tarjetas la diferencia se nota, y con dos mil es la diferencia entre una web fluida y una que se arrastra.

### Tarea 16 · Auditoría de accesibilidad

1. Recorre toda la interfaz con el tabulador y anota cada punto donde te pierdes.
2. Comprueba que ningún control es un contenedor genérico disfrazado.
3. Arregla el foco tras cada render.
4. Verifica que el resumen de resultados se anuncia.
5. Comprueba el contraste y la visibilidad del foco.
6. Mide con la pestaña Performance cuánto tarda un render de cien tarjetas.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Interfaz completa manejable con teclado y foco conservado.</span></div>
  <div><strong>Si lo tienes</strong><span>Prueba con un lector de pantalla y anota qué se oye al filtrar.</span></div>
  <div><strong>Reto</strong><span>Implementa un panel de filtros que atrape y devuelva el foco correctamente.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 16</p>
  <ul class="checklist">
    <li>Todo se puede usar sin ratón.</li>
    <li>El foco no se pierde al volver a pintar.</li>
    <li>Los cambios importantes se anuncian.</li>
    <li>Respetas la preferencia de movimiento reducido.</li>
  </ul>
</div>

---

## Sesión 17 · Reto acumulativo y depuración

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Nada nuevo. Hoy se comprueba si sabes montar y arreglar una interfaz.</li>
    <li><strong>2. Haz:</strong> Monta una interfaz de un dominio desconocido y repara otra que está rota.</li>
    <li><strong>3. Comprueba:</strong> Localizas cada fallo antes de tocar el código.</li>
  </ol>
</div>

### Primera parte · una interfaz nueva

Recibirás un fichero JSON de un dominio que no has visto —cartelera de cine, ofertas de empleo, rutas de senderismo— y una lista de requisitos. En veinticinco minutos:

<figure class="diagram">
  <figcaption>Lo que hay que montar</figcaption>
  <ol class="flow">
    <li>Cargar los datos con fetch y sus tres estados</li>
    <li>Pintar la lista desde los datos</li>
    <li>Un buscador y dos filtros combinables</li>
    <li>Estado único y render idempotente</li>
    <li>Resultado anunciado y manejable con teclado</li>
  </ol>
</figure>

Sin copiar y pegar tu proyecto: puedes mirar tus apuntes, pero el código se escribe hoy.

### Segunda parte · el diagnóstico

Los quince minutos restantes, sobre una interfaz que ya viene con cinco fallos, uno de cada familia. No hace falta arreglarlos todos hoy: lo que se evalúa es el diagnóstico, y los que no dé tiempo se terminan como trabajo personal.

| Familia | Síntoma típico |
| ------- | -------------- |
| Selección | Todo es `null`: el código se ejecuta antes de tiempo |
| Evento | Los elementos creados después no responden |
| Tipo | Un filtro numérico no filtra: el valor era texto |
| Asincronía | La lista sale vacía: se leyó antes de que llegara |
| Render | Cada filtrado duplica el contenido |

Para cada uno: escribe el síntoma, la hipótesis, cómo la compruebas y la corrección.

<div class="rule">
  <p class="rule-label">La pregunta que ordena el diagnóstico</p>
  <p>En una interfaz, empieza siempre por separar el problema en dos: <strong>¿llega el evento?</strong> Un mensaje en la primera línea del manejador lo responde.</p>
  <p>Si no llega, el problema está en la selección, en el registro de la escucha o en el momento en que se ejecutó tu código. Si llega, el problema está en tu lógica, y ahí ya sabes trabajar desde la UD3.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La interfaz nueva funcionando y tres fallos diagnosticados.</span></div>
  <div><strong>Si lo tienes</strong><span>Los cinco, con la hipótesis escrita antes de la corrección.</span></div>
  <div><strong>Reto</strong><span>Añade a la interfaz rota una comprobación que hubiera hecho evidente cada fallo.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 17</p>
  <ul class="checklist">
    <li>Has montado una interfaz completa desde datos ajenos.</li>
    <li>Separas fallos de evento de fallos de lógica.</li>
    <li>Usas Elements, Sources y Network según lo que buscas.</li>
    <li>Escribes la hipótesis antes de tocar nada.</li>
  </ul>
</div>

---

## Sesión 18 · Auditoría final, revisión por pares y entrega

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se revisa en una interfaz antes de darla por terminada.</li>
    <li><strong>2. Haz:</strong> Audita tu proyecto, revisa el de un compañero y corrige.</li>
    <li><strong>3. Comprueba:</strong> Puedes defender cada decisión.</li>
  </ol>
</div>

### La lista de auditoría

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · arquitectura</p>
  <ul class="checklist">
    <li>Hay un único objeto de estado, y nada se decide leyendo el DOM.</li>
    <li>Los manejadores cambian el estado y llaman a actualizar.</li>
    <li>El render es idempotente: llamarlo dos veces no duplica nada.</li>
    <li>Las funciones de la UD3 siguen sin conocer el DOM.</li>
    <li>Hay una escucha delegada por contenedor, no una por elemento.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · comportamiento</p>
  <ul class="checklist">
    <li>Los cuatro estados están contemplados: cargando, error, vacío y datos.</li>
    <li>Toda petición comprueba <code>respuesta.ok</code>.</li>
    <li>Los valores de formulario se convierten al leerlos.</li>
    <li>Un valor guardado inválido no rompe la página.</li>
    <li>No hay errores en consola al cargar ni al usar la interfaz.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · accesibilidad y calidad</p>
  <ul class="checklist">
    <li>Todo se maneja con teclado y el foco siempre se ve.</li>
    <li>Los cambios de contenido se anuncian.</li>
    <li>El marcado generado es semántico y válido en el W3C.</li>
    <li>Los errores de formulario están asociados a su campo.</li>
    <li>No hay <code>innerHTML</code> con datos de fuera.</li>
    <li>No queda código de depuración ni comentado.</li>
  </ul>
</div>

### Revisión por pares

Intercambia proyectos y, sin preguntar nada:

1. Usa la interfaz **solo con el teclado** y anota dónde te atascas.
2. Simula red lenta y sin red, y describe qué ve el usuario.
3. Busca algo que no exista y comprueba el estado vacío.
4. Localiza en el código dónde vive el estado y explícalo.
5. Señala una decisión bien tomada y una mejorable, con su razón.

### Defensa

<div class="rule">
  <p class="rule-label">Las preguntas de la defensa</p>
  <ol>
    <li>Enséñame el estado de tu aplicación y explícame qué guarda cada campo.</li>
    <li>Escribe una letra en el buscador y cuéntame todo lo que ocurre, en orden.</li>
    <li>¿Qué pasa si el servidor tarda cinco segundos? ¿Y si devuelve un 500?</li>
    <li>¿Qué parte de tu código tendrías que cambiar si mañana los datos llegaran de otra API?</li>
    <li>Enséñame un fallo que te costó encontrar y cómo lo encontraste.</li>
  </ol>
</div>

La cuarta vuelve a ser la de siempre: si has separado datos, lógica, estado y render, la respuesta debería ser «solo la función que llama a `fetch`».

### Evaluación

| Criterio | Puntos |
| ---------------------------------------------------------- | -----: |
| Render desde datos: idempotente y con su estado vacío | 2 |
| Estado único: ninguna decisión se toma leyendo el DOM | 2 |
| Eventos y delegación | 1,5 |
| Formulario validado con errores accesibles y foco correcto | 1,5 |
| Carga de datos con sus cuatro estados | 1,5 |
| Accesibilidad: teclado, foco y cambios anunciados | 1,5 |

No puntúa que la interfaz sea vistosa. Puntúa que **aguante**: contenido que cambia, red que falla, búsquedas sin resultados y alguien que no usa el ratón.

### Entrega

<div class="unit-deliverable">
  <p>El sitio completo con su carpeta <code>js/</code> organizada en módulos; el catálogo cargado desde una API con sus cuatro estados; búsqueda, filtros y orden gobernados por un único estado; el formulario validado y accesible; las preferencias persistidas; las tres listas de auditoría marcadas; la revisión del compañero por escrito; y un <code>NOTAS.md</code> con las decisiones que tomaste y lo que dejaste fuera.</p>
</div>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 6 · 10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Describe, en orden, todo lo que ocurre desde que se escribe una letra en el buscador hasta que cambia la lista.</li>
    <li>Un botón creado por tu código no responde. Escribe las tres comprobaciones, en orden.</li>
    <li>Señala dos decisiones de accesibilidad de tu interfaz y di a quién ayuda cada una.</li>
  </ol>
</div>
---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Cómo se construye una interfaz</figcaption>
  <ol class="flow">
    <li>¿Qué información necesito para pintar esto? Ese es el estado</li>
    <li>¿Qué acciones lo cambian? Esos son los eventos</li>
    <li>¿Cómo se ve el estado? Esa es la función de render</li>
    <li>¿Qué pasa mientras carga, si falla, y si no hay nada?</li>
  </ol>
</figure>

Y para depurar:

<figure class="diagram">
  <figcaption>Cuando algo no responde</figcaption>
  <ol class="flow">
    <li>¿Llega el evento?</li>
    <li>Si no: ¿existe el elemento? ¿se creó después?</li>
    <li>Si sí: ¿los datos son los que crees, y del tipo que crees?</li>
    <li>¿El estado es correcto y el fallo está solo al pintar?</li>
  </ol>
</figure>

### La idea más importante

> **Los datos mandan; la página es su reflejo. Cuando algo cambia, cambia el estado y se vuelve a pintar.**

De ahí sale todo lo demás: por eso no se lee el DOM para tomar decisiones, por eso el render es idempotente, por eso se delegan los eventos, y por eso la lógica de la UD3 sigue sin saber que existe una página.

### No memorices el DOM

* ¿Qué información necesita esta vista para existir?
* ¿Dónde vive la verdad de este dato?
* ¿Esto lo estoy leyendo del DOM en vez de del estado?
* ¿Este elemento existía cuando registré la escucha?
* ¿De qué tipo llega este valor de verdad?
* ¿Qué se ve mientras esto carga? ¿Y si falla? ¿Y si está vacío?
* ¿Esto se puede hacer sin ratón?
* ¿Dónde queda el foco después de este cambio?
* ¿Se entera de esto quien no ve la pantalla?

### Al terminar deberías poder responder

1. ¿Qué es el DOM y en qué se diferencia de tu fichero HTML?
2. ¿Por qué el código debe esperar a que el documento exista?
3. ¿Qué devuelve `querySelector` cuando no encuentra nada? ¿Y `querySelectorAll`?
4. ¿Por qué seleccionamos con atributos `data-` y no con clases de CSS?
5. ¿Por qué `textContent` es la opción por defecto frente a `innerHTML`?
6. ¿Por qué JavaScript pone clases en vez de estilos?
7. ¿Qué tres piezas tiene una escucha de eventos?
8. ¿Por qué se escucha `submit` en el formulario y no el clic del botón?
9. ¿Qué hace `preventDefault`?
10. ¿Qué diferencia hay entre `target` y `currentTarget`?
11. ¿Qué es el burbujeo y para qué sirve?
12. ¿Qué ventajas tiene delegar eventos?
13. ¿Para qué sirve `closest`?
14. ¿Por qué se insertan los elementos con un fragmento?
15. ¿Qué significa que un render sea idempotente?
16. ¿Qué debe mostrar una lista vacía?
17. ¿De qué tipo es el valor de un campo de formulario?
18. ¿Qué recoge `FormData` y de qué depende?
19. ¿Qué tres validaciones existen y cuál es obligatoria?
20. ¿Qué hacen `aria-describedby`, `aria-invalid` y `role="alert"`?
21. ¿Qué es el estado de una interfaz y por qué debe ser único?
22. ¿Qué hacen exactamente tus manejadores de eventos?
23. ¿Qué es un *debounce* y cuándo hace falta?
24. ¿Para qué sirve `aria-live`?
25. ¿Qué guarda `localStorage` y qué no debe guardarse ahí?
26. ¿Por qué se lee lo guardado dentro de un `try/catch`?
27. ¿Por qué JavaScript no espera a las operaciones lentas?
28. ¿Qué es una promesa y qué dos finales tiene?
29. ¿Qué hace `await` y dónde puede escribirse?
30. ¿Por qué un 404 no rechaza la promesa de `fetch`?
31. ¿Cuáles son los cuatro estados de una carga?
32. ¿Qué es un error de CORS y dónde se resuelve?
33. ¿Dónde debe quedar el foco tras volver a pintar?

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| DOM | El documento convertido en árbol de objetos en memoria |
| Nodo / elemento | Cualquier pieza del árbol / las que son etiquetas |
| `NodeList` | Lo que devuelve una selección múltiple; no es un array |
| `dataset` | Acceso a los atributos `data-`, siempre como texto |
| Evento | Algo que ocurre y a lo que se puede reaccionar |
| Manejador | La función que se ejecuta cuando ocurre |
| Burbujeo | El ascenso del evento por el árbol hasta el documento |
| Delegación | Escuchar en el contenedor y filtrar por el origen |
| Fragmento | Un contenedor temporal para insertar de una vez |
| Render | Generar la página a partir de los datos |
| Idempotente | Que ejecutarlo dos veces deje el mismo resultado |
| Estado | Todo lo necesario para saber cómo debe verse la interfaz |
| Fuente de verdad | El único sitio donde vive un dato |
| Debounce | Agrupar una ráfaga de eventos en una sola ejecución |
| Región activa | Zona cuyos cambios anuncia el lector de pantalla |
| `localStorage` | Almacén de texto del navegador, persistente |
| Asíncrono | Que su resultado llega después, sin bloquear |
| Bucle de eventos | El mecanismo que ejecuta lo que quedó en cola |
| Promesa | Un valor futuro, que se cumple o se rechaza |
| `fetch` | La forma de pedir datos a un servidor |
| CORS | La política del navegador sobre peticiones a otro origen |

### La siguiente unidad

Tu web ya se comporta como una aplicación: pinta desde datos, reacciona, valida, recuerda y pide información a un servidor.

A un servidor **que no es tuyo**.

<figure class="diagram">
  <figcaption>Lo que falta</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Cliente · lo que ya sabes</li>
    <li>HTTP · lo que viaja</li>
    <li>Servidor · lo que viene</li>
  </ol>
</figure>

En el tercer trimestre el mismo lenguaje se sale del navegador. Con Node.js escribirás programas que leen ficheros, atienden peticiones y responden; y en la UD6 construirás la API que hoy estás consumiendo. La `/api/productos` que has llamado con `fetch` la vas a escribir tú.

---
title: "El DOM: la web que responde"
label: "UD4 · Guía y taller práctico"
section: "ud-04"
order: 4
lang: "es"
summary: "Conectamos las tres capas. El catálogo que en la UD3 vivía en la consola pasa a pintarse en la página, a filtrarse desde un formulario y a llegar desde un servidor. Con una regla que no se negocia: los datos mandan, y la página es solo su reflejo."
duration: "6 sesiones de 3 horas · 18 horas"
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

En la UD3 escribiste un catálogo que funciona, filtra, ordena y busca, pero su resultado solo se ha observado en la consola.

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

Conviene observar un detalle relevante: `catalogo.js` apenas se modifica. Las funciones que escribiste en la UD3 siguen siendo válidas sin cambio alguno, porque devuelven datos en lugar de imprimirlos. Esa es la consecuencia de haberlas diseñado así.

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

Cada petición que hace la página: la URL, el estado, el tiempo y lo que devolvió. En la sesión 5 es imprescindible para saber si el problema es tuyo o del servidor.

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

## Plan de trabajo por sesiones

| Sesión | Contenido de las tres horas | Práctica central | Horas |
| :---: | :--- | :--- | :---: |
| **Sesión 1** | La página como objetos | Seleccionar y modificar el documento | 3 h |
| **Sesión 2** | Eventos y elementos dinámicos | Responder al usuario y crear contenido | 3 h |
| **Sesión 3** | Pintar desde datos | Render del catálogo y formularios | 3 h |
| **Sesión 4** | Estado y persistencia | Filtros en vivo y preferencias guardadas | 3 h |
| **Sesión 5** | Datos remotos | Asincronía, `fetch` y sus tres estados | 3 h |
| **Sesión 6** | Interfaz robusta y entrega | Accesibilidad, depuración y revisión por pares | 3 h |
| **Total** | | **Una interfaz completa gobernada por datos** | **18 h** |

Cada sesión dura tres horas, repartidas en tres bloques de una hora, y cada bloque mantiene el ritmo de las unidades anteriores:

<figure class="diagram">
  <figcaption>El ritmo de cada bloque de una hora</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Recupera · 5 min</li>
    <li>Aprende y observa · 10–20 min</li>
    <li>Practica · 30–40 min</li>
    <li>Cierra · 5 min</li>
  </ol>
</figure>

---

## Sesión 1 · La página como objetos

<p class="lead">Tres horas. Media hora para entender qué es el DOM y cómo se localiza y se modifica un elemento, y dos horas y media preparando tu página para que el código pueda trabajar con ella sin romperse al primer cambio de diseño.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es el DOM y por qué no es tu fichero HTML, cómo se localiza un elemento, y cómo se cambia su contenido y su aspecto sin meter diseño en el código.</li>
    <li><strong>2. Haz:</strong> Explora el DOM de tu web, prepárala con anclajes pensados para el código y cambia el estado visual del catálogo desde JavaScript.</li>
    <li><strong>3. Comprueba:</strong> Ninguna selección depende de la posición ni de una clase de estilo, y cambias clases en lugar de estilos en línea.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Cuando el navegador lee tu HTML, ¿qué crees que hace con él?</li>
    <li>Si el diseñador cambia la clase <code>.tarjeta</code> por <code>.card</code>, ¿se rompe tu código?</li>
    <li>¿Qué riesgo ves en insertar texto escrito por un usuario dentro del HTML?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Hoy empieza la tercera capa, y la idea que la gobierna es la misma de las dos anteriores: cada cosa en su sitio. El código dice qué está pasando; el CSS, cómo se ve. Todo lo que hagamos hoy sirve para no mezclarlas.

#### El documento, convertido en objetos

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

En sentido inverso: si tu código crea diez artículos, aparecerán en Elements y no constarán en el archivo. Por eso, cuando en la sesión 3 pintes el catálogo, «ver código fuente» no te servirá de nada: hay que mirar Elements.

```javascript
document                       // el documento entero
document.body                  // el cuerpo
document.title                 // el título de la pestaña

const main = document.querySelector("main");
main.children                  // sus elementos hijos
main.parentElement             // su contenedor
main.firstElementChild
main.nextElementSibling
```

Un detalle que confunde a todo el mundo: el DOM también guarda como nodos los espacios y saltos de línea entre etiquetas. Por eso usamos siempre las propiedades que hablan de **elementos** (`children`, `firstElementChild`) y no las que hablan de nodos en general (`childNodes`, `firstChild`).

Si el código se ejecuta antes de que exista el documento, además, no encontrará nada:

```javascript
const titulo = document.querySelector("h1");
console.log(titulo);      // null si el script se ejecutó demasiado pronto
```

Esto ya lo resolviste en la UD3: con `defer`, o con `type="module"`, el navegador espera a tener el documento completo. Recuérdalo, porque ese `null` es el error número uno de la unidad.

#### Los dos métodos que vas a usar

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

Existen métodos más antiguos —`getElementById`, `getElementsByClassName`— que verás en tutoriales; con estos dos sirve.

```javascript
const tarjetas = document.querySelectorAll(".producto");

tarjetas.length          // sí
tarjetas.forEach(...)    // sí
tarjetas.map(...)        // TypeError: no es una función

[...tarjetas].map(...)   // convertido en array, ya sí
```

Es una `NodeList`. Tiene `length` y `forEach`, pero no los métodos de la UD3. Los tres puntos la convierten en un array de verdad.

Una lista vacía, además, **no es `null`**: si el selector no encuentra nada, `querySelectorAll` devuelve una lista de longitud cero, mientras que `querySelector` devuelve `null`. Confundir esos dos casos es el segundo error más común de la unidad.

#### Anclajes pensados para el código

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

Esas referencias se buscan **una sola vez**, al arrancar:

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

#### Cambiar el contenido

```javascript
const titulo = document.querySelector("h1");

titulo.textContent = "Catálogo de productos";        // texto plano: lo habitual
titulo.innerHTML = "Catálogo <strong>2026</strong>"; // interpreta etiquetas
```

<div class="rule">
  <p class="rule-label">Por defecto, <code>textContent</code></p>
  <p>Insertar con <code>innerHTML</code> un texto que venga de fuera —lo que alguien escribió en un campo, lo que devolvió una API— permite colar etiquetas y código en tu página. Es la vía de entrada de los ataques de inyección.</p>
  <p><code>textContent</code> escribe texto y solo texto: el contenido se muestra literalmente, sin interpretarse ni ejecutarse. Usa <code>innerHTML</code> únicamente con marcado que hayas escrito tú, y nunca con datos del usuario.</p>
</div>

#### Cambiar el aspecto sin escribir diseño

```javascript
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

Hay un caso en el que tocar `style` sí es legítimo: cuando el valor es un **dato** y la regla sigue viviendo en la hoja de estilos.

```javascript
elemento.style.setProperty("--altura-imagen", "220px");
```

Cambiar así una variable CSS de las que definiste en la UD2 no mete diseño en el código: mete un número, y el diseño lo sigue decidiendo el CSS.

Los atributos se leen y se escriben con sus propios métodos:

```javascript
enlace.getAttribute("href");
enlace.setAttribute("href", "productos.html");
enlace.removeAttribute("target");
enlace.hasAttribute("download");
```

Los `data-` tienen además un acceso propio, que será la forma de saber en la sesión 2 a qué producto corresponde el botón que se acaba de pulsar:

```javascript
tarjeta.dataset.id;            // "7"  ← siempre texto
Number(tarjeta.dataset.id);    // 7
tarjeta.dataset.categoria = "teclados";
```

Conviene observar de nuevo el mismo detalle de la UD3: el valor llega como texto.

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto</p>

Hoy la página deja de ser algo que solo se mira y pasa a ser algo con lo que el código habla. Los dos primeros pasos preparan esa conversación; los tres últimos la ponen a prueba.

#### Paso 1 · Explora tu propia web · 30 min

Desde la consola de tu página de productos:

1. Cuenta cuántos enlaces hay: `document.querySelectorAll("a").length`.
2. Obtén el texto del `h1`.
3. Recorre las secciones y muestra su primer encabezado.
4. Cambia el título de la pestaña y observa el efecto.
5. Borra un elemento desde Elements y explica por escrito por qué el fichero no cambia.
6. Dibuja en papel el árbol de las tres primeras ramas de tu página.
7. Compara `main.children` con `main.childNodes` y anota cuántos elementos devuelve cada uno y por qué no coinciden.

**Antes de continuar:** puedes explicar en una frase la diferencia entre lo que escribiste y lo que el navegador construyó.

#### Paso 2 · Preparar el terreno · 35 min

Sobre tu página de productos:

1. Añade atributos `data-js` a los seis elementos con los que vas a trabajar.
2. Crea `js/dom.js` que los seleccione y los exporte en un objeto.
3. Escribe una comprobación que avise por consola si alguno es `null`, **diciendo qué anclaje falta por su nombre**.
4. Selecciona todas las tarjetas y cuéntalas.
5. Convierte la `NodeList` en array y obtén sus textos con `map`.
6. Quita a propósito un `data-js` del HTML y comprueba que tu aviso lo detecta al arrancar.

El apartado 6 es el que importa: un anclaje que falta debe delatarse al cargar la página, no veinte minutos después dentro de un evento.

#### Paso 3 · Estado visual desde el código · 40 min

Es el trabajo central de la sesión. Con el catálogo todavía escrito a mano en HTML:

1. Marca con la clase `agotado` los productos sin stock, leyendo el dato de `dataset`. Recuerda convertir.
2. Escribe en un párrafo cuántos productos hay disponibles.
3. Añade un botón que alterne una clase de vista compacta en la lista, aplicándola a todas las tarjetas de una vez.
4. Cambia el `title` de la pestaña para incluir el número de resultados.
5. Define en el CSS cómo se ve `.agotado` y cómo se ve la vista compacta. **Todo el aspecto vive ahí**, y tu JavaScript no contiene un solo color.

#### Paso 4 · Clases frente a estilos en línea · 20 min

Repite el apartado 1 del paso anterior con `element.style` en lugar de `classList`, y compara las dos versiones:

| Pregunta | Con `classList` | Con `style` |
| -------- | --------------- | ----------- |
| ¿Dónde está escrito el color del estado agotado? | | |
| ¿Cuántos ficheros hay que tocar para cambiarlo? | | |
| ¿Responde al modo oscuro de la UD2? | | |
| ¿Qué gana la regla en la cascada, y por qué? | | |
| ¿Puede el CSS sobrescribirlo sin `!important`? | | |

La última fila conecta con la sesión 1 de la UD2: un estilo en línea gana a casi todo, y eso lo convierte en un problema de cascada además de en un problema de organización.

Quédate con la versión de `classList` y borra la otra.

#### Paso 5 · Un selector que no falla en silencio · 25 min

`document.querySelector` devuelve `null` cuando no encuentra nada, y ese `null` viaja tranquilamente hasta que algo intenta usarlo. Escribe tu propia función de selección que no lo permita:

```javascript
export function seleccionar(ancla, contexto = document) {
  // devuelve el elemento, o lanza un error que diga qué ancla faltaba
}
```

1. Escríbela y úsala en `dom.js` para los seis anclajes.
2. El mensaje del error debe incluir el nombre del ancla y ser suficiente para arreglarlo sin abrir el código.
3. Escribe también `seleccionarTodos(ancla)`, que devuelva **un array** en vez de una `NodeList`. Decide si esta debe lanzar error con cero resultados, y justifica tu decisión: no es la misma que la anterior.
4. Prueba las dos quitando anclajes del HTML.
5. Anota en un comentario en qué caso preferirías seguir usando `querySelector` a secas.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. Los dos retos enseñan, cada uno por su lado, por qué las reglas de hoy no eran manías.

##### Reto 1 · El rediseño que rompe el código

Este JavaScript funciona hoy:

```javascript
const tarjetas = document.querySelectorAll(".card-azul");
const boton = document.querySelector("main div div:nth-child(3) button");
const titulo = document.querySelector("section.destacada h2");

tarjetas[0].classList.add("primero");
boton.textContent = "Comprar";
```

Mañana el equipo de diseño hace cuatro cambios, todos razonables y ninguno pensado para fastidiarte:

```text
1. Renombra .card-azul como .card--primaria, porque el azul cambió a verde.
2. Envuelve el contenido en un <div class="wrapper"> más para centrarlo.
3. La sección destacada pasa de ser <section> a <article>.
4. El catálogo se reordena, y la tarjeta que iba primera ahora va tercera.
```

1. Para cada uno de los cuatro cambios, di qué línea del JavaScript se rompe y **qué error exacto** aparecería en consola. Dos de ellos no dan error: producen un `null` o una lista vacía y el fallo se manifiesta más tarde. Identifícalos.
2. Reescribe las cuatro selecciones con anclajes `data-js` y comprueba que los cuatro cambios de diseño dejan de afectarte.
3. La línea de `tarjetas[0]` sigue siendo frágil aunque uses `data-js`. Explica por qué y propón qué debería decidir cuál es «la primera».
4. Escribe en tres líneas qué le dirías al equipo de diseño para que en el futuro sepa qué puede tocar sin avisarte. La respuesta no es «que no toque nada».

##### Reto 2 · Por qué `innerHTML` con datos ajenos es un problema

Monta una página mínima con un campo de texto y un contenedor donde se muestre lo escrito usando `innerHTML`.

1. Escribe en el campo `<strong>hola</strong>` y observa qué aparece.
2. Escribe ahora `<img src="x" onerror="alert('código ejecutado')">`. Anota qué pasa. No hace falta que entiendas el detalle: basta con que veas que **se ha ejecutado código que tú no escribiste**.
3. Cambia `innerHTML` por `textContent` y repite las dos pruebas. Describe la diferencia.
4. Ahora el caso realista: tu catálogo pinta el nombre del producto con `innerHTML` porque quieres que algunos lleven `<em>`. Un producto viene de un formulario y su nombre contiene una comilla y un signo de menor que. Propón dos soluciones distintas, y di cuál elegirías y por qué.
5. Este ataque tiene nombre en la disciplina. Búscalo, escríbelo, y explica en dos líneas por qué el problema no está en el usuario que escribe, sino en el código que confía.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Seis anclajes seleccionados una vez y comprobados, y clases aplicadas según los datos con todo el aspecto en el CSS.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de comparación entre <code>classList</code> y <code>style</code> contestada, y las dos funciones de selección con errores claros.</span></div>
  <div><strong>Reto</strong><span>Los cuatro cambios de diseño diagnosticados y reparados, y la demostración de inyección con su solución razonada.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Explicas qué es el DOM y por qué no es tu fichero.</li>
    <li>Seleccionas por anclajes pensados para el código, no por clases de estilo.</li>
    <li>Guardas las referencias una sola vez y avisas si falta alguna.</li>
    <li>Cambias texto con <code>textContent</code> y aspecto con clases.</li>
    <li>Tu JavaScript no contiene ningún color ni medida de diseño.</li>
    <li>Sabes por qué <code>innerHTML</code> con datos ajenos es un riesgo.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué es el DOM?</li>
    <li>¿Por qué «ver código fuente» no muestra lo que crea tu código?</li>
    <li>¿Qué devuelve <code>querySelector</code> si no encuentra nada? ¿Y <code>querySelectorAll</code>?</li>
    <li>¿Por qué no seleccionamos por clases de CSS?</li>
    <li>¿Por qué cambiamos una clase en lugar de un estilo en línea?</li>
    <li>¿De qué tipo es siempre lo que devuelve <code>dataset</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El árbol de objetos que el navegador construye a partir del HTML y que existe mientras la página está abierta.</p>
  <p>2 · Porque el código fuente es el fichero recibido, y lo que creas después solo existe en el DOM: se ve en Elements.</p>
  <p>3 · <code>null</code> el primero; una lista vacía el segundo.</p>
  <p>4 · Porque las clases son del diseño y cambian: el código quedaría atado a decisiones visuales.</p>
  <p>5 · Para que el aspecto siga viviendo en el CSS, responda al tema y se pueda sobrescribir sin pelear con la cascada.</p>
  <p>6 · Texto. Hay que convertirlo si se va a operar con él.</p>
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

## Sesión 2 · Eventos y elementos dinámicos

<p class="lead">Tres horas. Media hora para entender cómo se escucha lo que hace una persona, cómo viaja un evento por el árbol y cómo se crea un elemento, y dos horas y media haciendo que tu página reaccione y genere su propio marcado.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es un evento y dónde se escucha, qué información trae, qué es delegar, y cómo se crea e inserta un elemento sin perder la semántica.</li>
    <li><strong>2. Haz:</strong> Haz que tu página reaccione al clic, al teclado y al envío del formulario; atiende todas las tarjetas con un solo manejador; genera la tarjeta desde un objeto.</li>
    <li><strong>3. Comprueba:</strong> Todo lo que funciona con ratón funciona con teclado, y el HTML generado pasa el validador.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Enumera cinco cosas que puede hacer una persona en tu página. ¿Cuáles se pueden hacer sin ratón?</li>
    <li>Si tienes cincuenta botones iguales, ¿registrarías cincuenta escuchas?</li>
    <li>Si generas HTML desde código, ¿quién garantiza que sigue siendo semántico?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Tres piezas que hoy encajan entre sí: escuchar, averiguar quién provocó la acción, y crear los elementos sobre los que se actuará. La tercera obliga a la primera a hacerse de una forma concreta, y de ahí sale la delegación.

#### Escuchar

```javascript
const boton = document.querySelector("[data-js='ordenar']");

boton.addEventListener("click", () => {
  console.log("Han pulsado");
});
```

Tres piezas: el **elemento** que escucha, el **tipo** de evento y la **función** que se ejecutará. Esa función es un callback, el concepto de la sesión 3 de la UD3: tú no la llamas, la llama el navegador cuando ocurre algo.

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

```javascript
const formulario = document.querySelector("[data-js='contacto']");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();      // impide que se recargue la página
  console.log("Enviando…");
});
```

Sin `preventDefault`, el navegador hace lo suyo: envía y recarga. Verás tu mensaje en consola durante un instante y desaparecerá. Es el desconcierto clásico de esta sesión.

#### Qué trae el evento, y por dónde pasa

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

La pareja `target` / `currentTarget` es la clave de la sesión: puedes escuchar en el contenedor y averiguar dentro cuál de sus hijos recibió la acción. Eso es posible porque un clic no ocurre solo en un elemento, sino que recorre el árbol:

<figure class="diagram">
  <figcaption>El camino de un evento</figcaption>
  <ol class="flow">
    <li>Captura · del documento hacia abajo</li>
    <li>Objetivo · el elemento pulsado</li>
    <li>Burbujeo · hacia arriba, hasta el documento</li>
  </ol>
</figure>

El burbujeo explica también un fallo característico: pulsar en un botón dentro de una tarjeta que también escucha el clic dispara los dos manejadores.

<div class="rule">
  <p class="rule-label"><code>stopPropagation</code> es el último recurso</p>
  <p>Detener la propagación arregla el síntoma y deja una trampa: cualquier manejador que alguien registre más arriba —cerrar un menú, un contador de uso— dejará de enterarse, y quien lo escriba no entenderá por qué.</p>
  <p>Antes de detenerla, comprueba si el manejador de arriba puede filtrar por <code>target</code>. Casi siempre puede.</p>
</div>

#### Delegar

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

El teclado se atiende con su propio evento cuando hace falta una tecla concreta:

```javascript
buscador.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") limpiarBusqueda();
});
```

Si delegas clics en elementos que son botones de verdad, en cambio, el teclado ya funciona: pulsar Intro sobre un botón genera un `click`. Es otra razón para usar el elemento correcto en lugar de un `div` decorado.

#### Crear, rellenar, insertar

```javascript
const item = document.createElement("li");
item.className = "producto";
item.dataset.id = producto.id;

const titulo = document.createElement("h3");
titulo.textContent = producto.nombre;

item.append(titulo);
catalogo.append(item);          // al final
```

| Método | Qué hace |
| ------ | -------- |
| `append` | Añade al final del contenido |
| `prepend` | Añade al principio |
| `before` / `after` | Inserta como hermano |
| `remove` | Se elimina a sí mismo |
| `replaceChildren` | Sustituye la totalidad del contenido en una sola operación |

Añadir cincuenta elementos uno a uno hace que el navegador recalcule la página cincuenta veces. Se construyen aparte y se insertan juntos:

```javascript
const fragmento = document.createDocumentFragment();

for (const producto of productos) {
  fragmento.append(crearTarjeta(producto));
}

catalogo.replaceChildren(fragmento);
```

Para vaciar un contenedor:

```javascript
catalogo.replaceChildren();        // lo deja vacío
catalogo.innerHTML = "";           // funciona, pero pasa por el analizador
```

`replaceChildren()` es más claro y más seguro, y admite también los nuevos hijos de una vez.

<div class="rule">
  <p class="rule-label">Lo que genera tu código pasa las mismas normas de la UD1</p>
  <p>Es fácil que la lista de productos acabe siendo una pila de contenedores genéricos con clases. Si al escribirlo a mano usabas una lista de artículos con su encabezado, su imagen con texto alternativo y su precio, el código tiene que generar exactamente eso.</p>
  <p>La comprobación: abre Elements, copia el marcado generado, pégalo en el validador del W3C. La jerarquía de encabezados sigue siendo exigible sobre ese marcado generado.</p>
</div>

La función que lo construye **devuelve el elemento sin insertarlo**: quien la llama decide dónde va. Es la misma regla de la UD3 —calcular y devolver— aplicada al DOM.

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

#### El diagnóstico de esta unidad

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

Ese último caso es el que resuelve la delegación, y por eso los tres bloques de hoy son en realidad uno.

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto</p>

Los tres primeros pasos construyen la interacción; los dos últimos comprueban lo que casi nadie comprueba: que el marcado generado siga siendo válido y que todo se pueda usar sin ratón.

#### Paso 1 · Tu página reacciona · 30 min

1. Un botón que alterna la vista compacta del catálogo.
2. Un campo de búsqueda que escribe en consola lo tecleado con `input`.
3. El formulario de contacto que evita la recarga y muestra los valores.
4. Un botón que solo funcione una vez, con `{ once: true }`.
5. Prueba la diferencia entre `input` y `change` en el mismo campo, y anótala.

<details class="aside aside--extra">
<summary>Consultar · quitar un manejador</summary>

```javascript
function alPulsar() { /* ... */ }

boton.addEventListener("click", alPulsar);
boton.removeEventListener("click", alPulsar);
```

Para poder quitarlo hace falta la **misma referencia** de función, así que una flecha escrita en el sitio no se puede retirar. También está la opción `{ once: true }` para que se ejecute una sola vez.

</details>

**Antes de continuar:** el formulario no recarga la página, y sabes decir en qué línea lo has impedido.

#### Paso 2 · Un manejador para todos · 40 min

1. Añade a cada tarjeta de tu catálogo un botón con `data-accion` y `data-id`.
2. Registra **una sola** escucha en el contenedor.
3. Usa `closest` para localizar el botón y `dataset` para el identificador.
4. Añade una segunda acción y distínguela por su `data-accion`.
5. Comprueba con el teclado que ambas funcionan.
6. Registra una escucha en el contenedor y otra en la tarjeta, y observa el orden en que se disparan. Anótalo: es el burbujeo, visto en tu propia página.

#### Paso 3 · La tarjeta generada · 45 min

Es el trabajo central de la sesión.

1. Escribe `crearTarjeta(producto)` en `js/render.js`, que devuelva el elemento sin insertarlo.
2. Genera con ella las tarjetas de tres productos y añádelas con un fragmento.
3. Añade un botón de acción con sus atributos `data-`.
4. Escribe `vaciarCatalogo()` con `replaceChildren()` y comprueba que **las escuchas delegadas siguen funcionando** después de vaciar y volver a pintar.
5. Añade el estado «agotado» como clase para el CSS **y** como texto para quien no ve la pantalla. No basta con el color.

<details class="aside aside--extra">
<summary>Consultar · la otra forma, con <code>template</code></summary>

HTML tiene un elemento pensado para esto: `<template>` guarda marcado que no se pinta hasta que lo clonas.

```html
<template data-js="plantilla-producto">
  <li class="producto">
    <h3></h3>
    <p class="precio"></p>
  </li>
</template>
```

```javascript
const plantilla = document.querySelector("[data-js='plantilla-producto']");
const copia = plantilla.content.cloneNode(true);
copia.querySelector("h3").textContent = producto.nombre;
```

La estructura vive en el HTML y el código solo rellena. Tiene la ventaja de que el marcado se ve y se valida donde siempre, y el inconveniente de repartir la tarjeta entre dos ficheros. Las dos formas son correctas.

</details>

#### Paso 4 · Valida lo que ha escrito tu código · 15 min

1. Compara el marcado generado en el paso 3 con el que tenías escrito a mano en la UD1. ¿Es igual de semántico?
2. Abre Elements, copia el bloque del catálogo entero y pásalo por `validator.w3.org`.
3. Comprueba la jerarquía de encabezados del documento **con las tarjetas ya pintadas**. Si tu `h3` cuelga de un `h1` sin `h2` en medio, el salto lo ha creado tu JavaScript.
4. Revisa que cada imagen generada tiene su `alt`, y que ese `alt` sale de un campo de datos y no de una cadena fija.

| Comprobación | Resultado | Corrección |
| ------------ | --------- | ---------- |
| Validador del W3C sobre el marcado generado | | |
| Jerarquía de encabezados sin saltos | | |
| Todas las imágenes con `alt` que aporta algo | | |
| Los botones son `button`, no `div` | | |

#### Paso 5 · Todo esto, sin ratón · 20 min

Suelta el ratón y recorre la página con `Tab`, `Shift + Tab`, `Intro` y `Espacio`.

1. ¿Puedes llegar a los botones generados por tu código?
2. ¿Se ve el foco sobre ellos, con el `:focus-visible` de la UD2?
3. ¿Funcionan las dos acciones delegadas?
4. Añade un atajo: `Escape` limpia la búsqueda, e `Intro` en el buscador aplica el filtro.
5. Después de vaciar y repintar el catálogo, ¿dónde se ha quedado el foco? Anótalo. Es un problema real que resolverás en la sesión 6.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. Los dos retos miden el coste de dos atajos que parecen inofensivos.

##### Reto 1 · Cuánto cuesta un botón falso

```html
<div class="boton" onclick="comprar()">Comprar</div>
```

1. Móntalo y comprueba con el teclado qué **no** hace: enumera las cuatro cosas que un `<button>` trae de fábrica y este no.
2. Recontrúyelas una a una: hazlo enfocable, que responda a `Intro` y a `Espacio`, que se anuncie como botón, y que tenga foco visible. Cuenta las líneas de HTML, CSS y JavaScript que te ha costado.
3. Compara ese recuento con escribir `<button type="button">`.
4. Queda todavía una diferencia que no has podido reconstruir del todo: averigua qué ocurre con ese falso botón dentro de un formulario, y con el modo de alto contraste del sistema.
5. Escribe en tres líneas por qué este ejercicio no va de accesibilidad, sino de no reprogramar lo que la plataforma ya hace. Es la misma conclusión que sacaste en la UD1 con `details` y `progress`.

##### Reto 2 · El menú que deja de cerrarse

Monta esta situación, que es completamente habitual:

```text
· Un menú desplegable que se abre con un botón.
· Una escucha en `document` que lo cierra al pulsar en cualquier otro sitio.
· Un catálogo de tarjetas; cada tarjeta abre el detalle al pulsarla.
· Dentro de cada tarjeta, un botón «Añadir» que NO debe abrir el detalle.
```

1. Resuelve el botón «Añadir» con `stopPropagation` y comprueba que funciona.
2. Ahora abre el menú y pulsa ese botón. El menú no se cierra. Explica exactamente por qué, siguiendo el camino del evento.
3. Resuélvelo de nuevo **sin** `stopPropagation`: el manejador de la tarjeta debe filtrar por `target` y salir pronto si el clic venía de un botón de acción.
4. Comprueba que ahora el menú sí se cierra y que el detalle sigue sin abrirse.
5. Enuncia la regla en una frase: quién debe decidir si un evento le incumbe, el que lo emite o el que lo escucha.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres eventos funcionando con <code>submit</code> sin recarga, una escucha delegada que distingue dos acciones, y tarjetas generadas semánticas.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de validación del marcado generado contestada y el recorrido completo con teclado, atajos incluidos.</span></div>
  <div><strong>Reto</strong><span>El coste del botón falso medido en líneas, y el conflicto del menú resuelto sin <code>stopPropagation</code>.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Usas <code>submit</code> en el formulario y <code>preventDefault</code>.</li>
    <li>Distingues <code>input</code> de <code>change</code>.</li>
    <li>Usas una sola escucha delegada por contenedor, con <code>closest</code>.</li>
    <li>Tu página responde al ratón y al teclado por igual.</li>
    <li>Generas elementos con marcado semántico, validado desde Elements.</li>
    <li>Insertas en bloque con un fragmento, no de uno en uno.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué escuchamos <code>submit</code> y no el clic del botón?</li>
    <li>¿Qué hace <code>preventDefault</code>?</li>
    <li>¿Qué diferencia hay entre <code>target</code> y <code>currentTarget</code>?</li>
    <li>¿Qué ventaja tiene delegar, y para qué sirve <code>closest</code>?</li>
    <li>¿Por qué evitamos <code>stopPropagation</code>?</li>
    <li>¿Por qué se insertan los elementos con un fragmento?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque un formulario también se envía con Intro, y el clic no cubre ese caso.</p>
  <p>2 · Cancela el comportamiento por defecto del navegador para ese evento.</p>
  <p>3 · <code>target</code> es el elemento exacto donde ocurrió; <code>currentTarget</code>, el que tiene registrada la escucha.</p>
  <p>4 · Una sola escucha que funciona también con los elementos creados después; <code>closest</code> sube desde el punto pulsado hasta el contenedor que interesa.</p>
  <p>5 · Porque impide que otros manejadores más arriba se enteren del evento, y eso rompe cosas a distancia.</p>
  <p>6 · Porque cada inserción individual obliga al navegador a recalcular la página.</p>
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

## Sesión 3 · Pintar desde datos

<p class="lead">Tres horas. Media hora para entender el patrón de render y cómo se leen y se validan los datos de un formulario, y dos horas y media haciendo que tu catálogo salga de los datos y que tus errores se puedan oír.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> El patrón de render —una función que recibe datos y deja la página como esos datos digan—, cómo se leen los valores de un formulario y qué hace que un error sea perceptible sin ver la pantalla.</li>
    <li><strong>2. Haz:</strong> Pinta todo tu catálogo de la UD3, lee el formulario entero y valídalo con mensajes accesibles.</li>
    <li><strong>3. Comprueba:</strong> Borras el HTML escrito a mano y la página sigue igual; el foco va al primer campo que falla.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántos productos tienes escritos a mano en el HTML? ¿Y si fueran cuatrocientos?</li>
    <li>Un campo numérico, ¿devuelve número?</li>
    <li>Un error escrito en rojo junto al campo, ¿lo percibe quien no ve la pantalla?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Hoy la página deja de ser algo que se escribe y pasa a ser algo que se **calcula** a partir de unos datos. Esa idea gobierna la sesión, y también la siguiente.

#### La función de render

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

Una lista vacía sin mensaje se percibe como un error de la aplicación, y tampoco basta con «No hay resultados». Un buen estado vacío dice qué ha pasado **y qué se puede hacer**:

```javascript
function mensajeVacio() {
  const parrafo = document.createElement("p");
  parrafo.className = "vacio";
  parrafo.textContent = "No hay productos que coincidan. Prueba a quitar algún filtro.";
  return parrafo;
}
```

A partir de aquí el catálogo vive en los datos, y en el HTML solo queda el contenedor:

```html
<ul class="catalogo" data-js="catalogo"></ul>
```

Con una salvedad, que es la condición 2 de la unidad: si tu web debe seguir mostrando contenido sin JavaScript, el HTML conserva los productos y el código los sustituye al arrancar. Decide cuál de las dos opciones eliges, y escríbelo en tus notas.

#### Leer un formulario

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
  <p>Incluso los numéricos y los de fecha. Es exactamente el <code>"10" + 5</code> de la sesión 1 de la UD3, que ahora deja de ser un ejercicio y pasa a ser tu bug.</p>
  <p>Convierte al leer, y comprueba: un campo numérico vacío da cadena vacía, y <code>Number("")</code> es <code>0</code>, no <code>NaN</code>. Ese cero silencioso ha estropeado muchos filtros.</p>
</div>

Para leerlo entero de una vez:

```javascript
formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const datos = Object.fromEntries(new FormData(evento.currentTarget));
  console.log(datos);
  // { nombre: "Ana", email: "ana@…", mensaje: "Hola" }
});
```

`FormData` recoge los campos que tengan atributo `name` —de ahí la insistencia de la UD1 en ponerlo— y `Object.fromEntries` los convierte en un objeto normal, listo para validarlo con las funciones que escribiste en la UD3. Las casillas no marcadas no aparecen, y los grupos de casillas con el mismo nombre requieren `getAll`.

Con el evento `input` ya tienes la búsqueda en vivo, usando `buscar` de la UD3 sin un solo cambio:

```javascript
buscador.addEventListener("input", (evento) => {
  const termino = evento.target.value.trim();
  pintarCatalogo(buscar(catalogo, termino), contenedor);
});
```

#### Tres validaciones, y ninguna sobra

En la UD1 escribiste campos obligatorios, tipos de dato y patrones. Eso sigue funcionando y es la primera línea de defensa. JavaScript no viene a sustituirla:

```javascript
campo.validity.valueMissing;    // obligatorio y vacío
campo.validity.typeMismatch;    // no parece un correo
campo.checkValidity();          // true / false
formulario.noValidate = true;   // asumo yo la presentación de los errores
```

<div class="rule">
  <p class="rule-label">Las tres capas de validación</p>
  <ol>
    <li><strong>Nativa:</strong> inmediata y gratis, funciona sin JavaScript.</li>
    <li><strong>Con JavaScript:</strong> mensajes mejores, reglas que el HTML no expresa, avisos mientras se escribe.</li>
    <li><strong>En el servidor (UD6):</strong> la única obligatoria, porque las dos anteriores se pueden saltar.</li>
  </ol>
  <p>Un cliente que valida bien mejora la experiencia. Un servidor que no valida es un agujero.</p>
</div>

#### Un error que se ve y se oye

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
```

Tres piezas que hacen el error perceptible para todo el mundo: `aria-describedby` ata el mensaje al campo, `aria-invalid` marca el campo como erróneo, y `role="alert"` hace que el lector de pantalla lo anuncie al aparecer. El color rojo, por sí solo, no informa a quien no distingue colores. Igual que en la UD2: el color acompaña, no comunica.

Avisar con cada tecla mientras alguien escribe su correo es molesto y aparece en rojo antes de que haya terminado. El criterio habitual:

<figure class="diagram">
  <figcaption>Cuándo se valida cada campo</figcaption>
  <ol class="flow">
    <li>Al salir del campo: primera comprobación</li>
    <li>Al enviar: todos los campos</li>
    <li>Mientras se escribe: solo para quitar un error ya mostrado</li>
  </ol>
</figure>

Al enviar, por último, el foco va **al primer campo que falla**, que es lo que permite corregir sin buscar:

```javascript
if (errores.length > 0) {
  errores.forEach(({ campo, mensaje }) => mostrarError(campos[campo], mensaje));
  campos[errores[0].campo].focus();
  return;
}
```

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto</p>

Hoy se cierra el circuito que abriste en la UD3: aquellos datos y aquellas funciones se convierten en la página que se ve. Los dos últimos pasos comprueban lo que se rompe cuando se quitan las muletas.

#### Paso 1 · El catálogo pintado · 35 min

1. Escribe `pintarCatalogo(productos, contenedor)` en `js/render.js`.
2. Píntalo al arrancar desde `main.js`, importando los datos de la UD3.
3. Añade el estado vacío con un mensaje que diga qué hacer.
4. Llama a la función **dos veces seguidas** y comprueba que no se duplica. Si se duplica, no era idempotente.
5. Pinta un subconjunto usando una de tus funciones de filtrado de la UD3, sin modificarla.
6. Muestra en un párrafo cuántos resultados se están viendo.

**Antes de continuar:** borra el catálogo escrito a mano del HTML. Si la página sigue igual, el render funciona.

#### Paso 2 · Leer y usar · 35 min

1. Búsqueda en vivo con `input` sobre tu catálogo pintado.
2. Un filtro de precio máximo con conversión en el momento de leer.
3. Lee el formulario de contacto entero con `FormData` al enviarlo.
4. Muestra en consola el objeto resultante y comprueba **el tipo de cada valor** con `typeof`.
5. Combina búsqueda y precio máximo en una sola consulta.
6. Añade un botón de limpiar que vacíe los filtros y devuelva el foco al buscador.

<details class="aside aside--extra">
<summary>Consultar · otras cosas útiles de un formulario</summary>

```javascript
formulario.reset();          // vuelve a los valores iniciales
buscador.focus();            // pone el foco
buscador.select();           // selecciona el contenido
campo.disabled = true;       // deshabilita mientras se envía
```

</details>

#### Paso 3 · Formulario validado · 45 min

Es el trabajo central de la sesión.

1. Añade a cada campo su párrafo de error con `role="alert"` y `aria-describedby`.
2. Valida al salir de cada campo y al enviar.
3. Muestra todos los errores a la vez y lleva el foco al primero.
4. Quita el error en cuanto el campo se corrige.
5. Reutiliza tu función de validación de la UD3: recibe un objeto y devuelve la lista de errores. Si has tenido que reescribirla, mira por qué.
6. Comprueba que el mensaje de error **no depende solo del color**: quítale el color en DevTools y comprueba que se sigue entendiendo.

#### Paso 4 · Quita las muletas · 20 min

Dos pruebas que casi nadie hace, y que descubren cosas distintas.

**Sin JavaScript.** Desactívalo en DevTools y recarga.

| Pregunta | Qué ocurre | ¿Es aceptable? |
| -------- | ---------- | -------------- |
| ¿Se ve algún producto? | | |
| ¿El formulario sigue validando lo básico? | | |
| ¿El formulario se puede enviar? | | |

La respuesta depende de la decisión que anotaste sobre el catálogo. Lo que no es aceptable es que no la hayas tomado.

**Solo con el teclado.** Recorre el formulario entero de principio a fin, provoca los errores y corrígelos sin tocar el ratón. Anota dónde se queda el foco después de mostrar los errores y después de corregir el último.

#### Paso 5 · El campo vacío que vale cero · 15 min

Tu filtro de precio máximo tiene un fallo que no da error. Compruébalo:

1. Deja el campo de precio máximo vacío y observa qué productos se muestran.
2. Escribe qué está pasando: `""` convertido a número no es `NaN`, es `0`.
3. Corrígelo tratando el campo vacío como «sin límite» en lugar de como cero.
4. Prueba estos cinco valores en el campo y anota qué hace tu filtro con cada uno: vacío, `0`, `-5`, `abc` y un número mayor que todos tus precios.
5. Dos de los cinco necesitan una decisión que no es evidente. Identifícalos y documenta qué has decidido.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. El primer reto mide; el segundo mejora una interfaz que ya funciona.

##### Reto 1 · Cuatrocientos productos

Genera un catálogo de cuatrocientos productos con un bucle y mide de verdad, en lugar de suponer.

1. Usa `console.time` y `console.timeEnd` alrededor del render. Anota el tiempo.
2. Reescribe `pintarCatalogo` para que inserte las tarjetas **una a una** con `append` sobre el contenedor, sin fragmento. Vuelve a medir.
3. Compara los dos tiempos con 20, 400 y 4.000 productos. Anota los seis números en una tabla. La diferencia no es proporcional, y ese es el hallazgo.
4. Abre la pestaña Performance y graba un render de los lentos. Busca las barras de *Layout* y cuenta cuántas hay en cada versión.
5. Explica en tres líneas por qué el fragmento cambia el número de recálculos, con el vocabulario de la UD2: qué obliga al navegador a rehacer el layout.
6. Con 4.000 productos, ni siquiera el fragmento es suficiente. Escribe qué harías: no hace falta que lo implementes, pero sí que nombres la técnica.

##### Reto 2 · El resumen de errores

Un formulario largo con cinco errores obliga a recorrerlo entero buscando cuáles fallaron. Las interfaces bien hechas ponen un resumen arriba.

1. Al enviar con errores, genera un bloque al principio del formulario con la lista de los que han fallado.
2. Cada elemento de la lista es un **enlace** al campo correspondiente, usando su `id`. Comprueba que al pulsarlo el foco llega al campo, y no solo la vista.
3. El resumen debe anunciarse: decide entre `role="alert"` y llevarle el foco directamente. Prueba las dos y quédate con una, justificando la elección.
4. Escribe mensajes distintos para «este campo está vacío» y «el formato no es correcto» en el mismo campo. La diferencia importa: no se corrigen igual.
5. Cuando todos los errores queden resueltos, el resumen tiene que desaparecer. Decide qué pasa entonces con el foco de quien estaba dentro de él.
6. Prueba el resultado entero con el teclado y, si tienes acceso a un lector de pantalla, con él. Anota qué se oye al enviar un formulario con tres errores.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Catálogo pintado desde datos con estado vacío, búsqueda en vivo y errores accesibles con el foco al primero.</span></div>
  <div><strong>Si lo tienes</strong><span>Las dos tablas de los pasos 4 y 5 contestadas, y el filtro de precio tratando bien el campo vacío.</span></div>
  <div><strong>Reto</strong><span>Los seis tiempos medidos con su explicación, o el resumen de errores enlazado y anunciado.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Tu render recibe los datos que pinta y los sustituye en lugar de añadirlos.</li>
    <li>El caso de lista vacía tiene un mensaje que dice qué hacer.</li>
    <li>Reutilizas sin cambios las funciones de la UD3.</li>
    <li>Conviertes cada valor del formulario al leerlo, y tratas el campo vacío.</li>
    <li>Los errores se ven, se oyen y llevan el foco donde toca.</li>
    <li>La validación nativa sigue funcionando sin JavaScript.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué significa que un render sea idempotente, y qué se ve si no lo es?</li>
    <li>¿Qué debe decir un buen estado vacío?</li>
    <li>¿De qué tipo es el valor de un campo numérico, y cuánto vale <code>Number("")</code>?</li>
    <li>¿Qué campos recoge <code>FormData</code>?</li>
    <li>Nombra los tres atributos que hacen perceptible un error sin ver la pantalla.</li>
    <li>¿Cuáles son las tres capas de validación, y cuál es obligatoria?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que llamarla varias veces con los mismos datos deja siempre el mismo resultado. Si no lo es, el catálogo se duplica en cada filtrado.</p>
  <p>2 · Qué ha ocurrido y qué puede hacer la persona a continuación.</p>
  <p>3 · Texto siempre; y <code>Number("")</code> vale cero, que es justo lo que hay que detectar antes de usarlo como límite.</p>
  <p>4 · Los que tienen atributo <code>name</code>; las casillas sin marcar no aparecen.</p>
  <p>5 · <code>aria-describedby</code>, <code>aria-invalid</code> y <code>role="alert"</code>.</p>
  <p>6 · Nativa, en el cliente con JavaScript y en el servidor; la del servidor es la obligatoria.</p>
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

## Sesión 4 · Estado y persistencia

<p class="lead">Tres horas. Media hora para entender por qué la interfaz debe tener una sola fuente de verdad, y dos horas y media reescribiendo tu página alrededor de ella y haciendo que recuerde las preferencias entre visitas.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es el estado de una interfaz, el ciclo evento → estado → render, cómo se combinan varios filtros y cómo se guarda algo en el navegador sin fiarse de lo guardado.</li>
    <li><strong>2. Haz:</strong> Reescribe tu página con un estado único, monta el panel de filtros completo y recuerda las preferencias.</li>
    <li><strong>3. Comprueba:</strong> Ninguna decisión se toma leyendo la página, y un dato guardado corrupto no rompe nada.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Ahora mismo, ¿dónde está guardado qué filtro está activo?</li>
    <li>Si hubiera dos sitios donde consultarlo, ¿qué podría pasar?</li>
    <li>¿Qué debería recordar tu web entre visitas? ¿Y qué no?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

La sesión tiene una sola idea, y es la que separa una página que funciona de una que se puede mantener: **la información vive en un sitio, y la página es su reflejo**. Todo lo demás de hoy se deduce de ahí.

#### El problema que resuelve

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

#### El ciclo

```javascript
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

Los filtros se aplican **en cadena**, en un solo sitio: cada uno reduce lo que dejó el anterior, y el resultado son los productos que cumplen todo a la vez.

```javascript
export function aplicarFiltros(estado) {
  let resultado = estado.productos;

  if (estado.busqueda.trim() !== "") resultado = buscar(resultado, estado.busqueda);
  if (estado.categoria !== "todas") resultado = porCategoria(resultado, estado.categoria);
  if (estado.soloDisponibles) resultado = disponibles(resultado);

  return ordenar(resultado, estado.orden);
}
```

Es una función pura: recibe el estado y devuelve la lista que toca. Se puede probar sin abrir el navegador, que es exactamente lo que la hace fácil de arreglar cuando algo falla. Añadir un filtro nuevo pasa a ser añadir tres líneas.

Hay además dos decisiones de producto que conviene tomar a conciencia:

| Situación | Decisión razonable |
| --------- | ------------------ |
| Búsqueda vacía | No filtra nada |
| Categoría «todas» | No filtra nada |
| Precio máximo vacío | Sin límite, no cero |
| Ningún resultado | Mensaje con salida: «quita algún filtro» |

#### No trabajar de más

Filtrar cuatrocientos productos con cada tecla es trabajo repetido. Se limita con una función que espera a que la persona deje de escribir:

```javascript
function retrasar(funcion, milisegundos = 250) {
  let temporizador;
  return (...argumentos) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => funcion(...argumentos), milisegundos);
  };
}
```

<p class="term">Debounce</p>

Agrupar una ráfaga de eventos en una sola ejecución, la última. Con un buscador local su efecto es reducido; en la sesión 5, cuando cada pulsación implique una petición al servidor, resultará obligatorio.

Fíjate en que `retrasar` es una función que devuelve otra función: exactamente lo que practicaste en la sesión 3 de la UD3.

#### Anunciar el resultado

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

#### Recordar entre visitas

```javascript
localStorage.setItem("preferencias", JSON.stringify(preferencias));
const texto = localStorage.getItem("preferencias");   // texto, o null
localStorage.removeItem("preferencias");
```

Solo guarda **texto**, así que todo pasa por `JSON.stringify` y `JSON.parse`: las dos funciones de la sesión 4 de la UD3.

| Almacén | Dura | Para qué |
| ------- | ---- | -------- |
| `localStorage` | Hasta que se borre | Preferencias, borradores |
| `sessionStorage` | Hasta cerrar la pestaña | Datos de un proceso en curso |
| Cookies | Según se configuren | Sesión de servidor (UD6) |

<div class="rule">
  <p class="rule-label">Lo guardado es entrada externa</p>
  <p>Cualquiera puede abrir DevTools y editarlo. Puede estar corrupto, puede ser de una versión anterior de tu web, puede no estar. Si tu código hace <code>JSON.parse</code> a pelo, un valor manipulado deja la página en blanco.</p>
  <p>Léelo dentro de un <code>try/catch</code>, valida su forma, y si algo no cuadra, usa los valores por defecto y sigue. Es el mismo principio de la UD3: validar en el borde.</p>
</div>

<div class="rule">
  <p class="rule-label">Nunca datos personales ni credenciales</p>
  <p>Lo que guardes ahí es legible por cualquiera que se siente delante del equipo y por cualquier código que se ejecute en tu página. Preferencias de interfaz, sí. Contraseñas, tokens, datos de tarjetas o información personal, no.</p>
  <p>Y si guardas algo que identifique a una persona, entras en el terreno del consentimiento y la protección de datos, que es harina de otro costal.</p>
</div>

Así queda una lectura que no se puede romper desde fuera:

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

Hay además límites de tamaño —unos pocos megabytes— y el acceso puede fallar directamente en navegación privada o con el almacenamiento bloqueado. Otra razón para el `try/catch`.

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto</p>

El primer paso reescribe lo que ya tenías; parece un retroceso y es el cambio más rentable de la unidad. Los cuatro siguientes construyen encima.

#### Paso 1 · Reescribir con estado · 40 min

1. Crea `js/estado.js` con el objeto y sus valores iniciales.
2. Escribe `aplicarFiltros(estado)` combinando tus funciones de la UD3.
3. Escribe `actualizar()` como único punto que pinta.
4. Convierte todos tus manejadores al patrón «cambia estado, actualiza». Ninguno debe pasar de tres líneas.
5. Elimina cualquier lectura del DOM que sirviera para decidir algo. Busca `classList.contains` y `.value` fuera de los manejadores: ahí suelen estar.
6. Escribe `sincronizarControles(estado, elementos)` para que los campos reflejen el estado, y no al revés.

**Antes de continuar:** ninguna función que no sea `actualizar` o una de render toca el DOM.

#### Paso 2 · El panel completo · 40 min

1. Añade al menos tres controles: búsqueda, categoría y orden.
2. Genera las opciones de categoría **desde los datos**, no a mano. Si mañana aparece una categoría nueva, el desplegable debe incluirla sin tocar el HTML.
3. Añade una casilla de «solo disponibles».
4. Aplica el retraso a la búsqueda y comprueba la diferencia contando ejecuciones en consola.
5. Anuncia el número de resultados en una región con `aria-live`.
6. Añade un botón de limpiar que restaure el estado inicial y devuelva el foco al buscador.

#### Paso 3 · Preferencias que duran · 35 min

1. Guarda categoría, orden y vista compacta al cambiarlas.
2. Recupéralas al arrancar y aplícalas al estado **antes** del primer render.
3. Valida lo leído y usa valores por defecto si no cuadra.
4. Añade un botón de «restablecer preferencias».
5. Escribe en tus notas qué has decidido **no** guardar, y por qué. El término de búsqueda es el caso interesante: piensa qué se encuentra alguien al volver mañana.

#### Paso 4 · Rompe lo que has guardado · 15 min

Abre DevTools, ve al almacenamiento local y estropea el valor a mano. Prueba estos cinco casos y anota qué hace tu web con cada uno:

| Lo que hay guardado | Qué debería pasar | Qué pasa | Corrección |
| ------------------- | ----------------- | -------- | ---------- |
| Nada, primera visita | | | |
| Un JSON válido pero con campos de más | | | |
| Un JSON válido con `orden` puesto a un número | | | |
| Texto que no es JSON | | | |
| Un JSON con una categoría que ya no existe | | | |

Los dos últimos son los que suelen dejar la página en blanco. El tercero es más sutil: el JSON es válido, el campo existe, y su valor no sirve.

#### Paso 5 · La página desde la consola · 20 min

Si el estado es de verdad la única fuente de verdad, debería poder gobernarse sin tocar la interfaz.

1. Desde la consola, cambia `estado.categoria` a mano y llama a `actualizar()`. La página debe responder.
2. Repítelo con los cinco campos del estado.
3. Comprueba que **los controles también se actualizan**: el desplegable debe mostrar la categoría que has puesto. Si no lo hace, te falta `sincronizarControles`.
4. Pon el estado en una combinación concreta, anótala, recarga la página y vuelve a ponerla. ¿Se ve exactamente lo mismo? Si no, hay información viviendo fuera del estado: encuéntrala.
5. Escribe en un comentario qué campo del estado te ha costado más reproducir, y por qué.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. Los dos retos empujan el estado fuera de la memoria: a la URL y al futuro.

##### Reto 1 · El estado en la dirección

Ahora mismo, si alguien filtra por «teclados», ordena por precio y quiere enseñárselo a otra persona, no puede: la dirección de la página es la misma que al entrar.

1. Escribe los filtros activos en la URL con `URLSearchParams` y `history.replaceState`, de modo que la barra de direcciones refleje el estado.
2. Al cargar la página, lee la URL y úsala para inicializar el estado.
3. Decide qué gana cuando hay conflicto: lo que dice la URL o lo que había guardado en las preferencias. No hay una respuesta única; justifica la tuya.
4. Comprueba que copiar la dirección y abrirla en otra pestaña reproduce exactamente la misma vista.
5. Ahora el botón de retroceso: usa `pushState` en lugar de `replaceState` para un filtro concreto y escucha `popstate`. ¿Qué gana y qué pierde la interfaz? Anótalo: hay un motivo real para no guardar en el historial cada pulsación del buscador.
6. Con esto acabas de reproducir lo que hace cualquier tienda en línea. Escribe en tres líneas qué ventaja tiene para quien usa la web, más allá de compartir el enlace.

##### Reto 2 · Lo guardado de la versión anterior

Tu web ya funciona. Dentro de dos meses la cambias, y quienes vuelvan traerán en su navegador las preferencias del formato viejo.

1. Simula el escenario: guarda a mano unas preferencias con el formato actual, cambia después la estructura del objeto —renombra `orden` como `ordenacion` y añade un campo nuevo—, y recarga.
2. Anota qué ocurre. Con suerte tu lectura defensiva lo salva; lo que seguro se pierde es la preferencia de la persona.
3. Añade un campo `version` a lo guardado y escribe una función `migrar(datos)` que convierta el formato antiguo al nuevo en lugar de descartarlo.
4. Comprueba las tres situaciones: sin nada guardado, con el formato viejo y con el nuevo.
5. Decide qué hacer con una versión **más nueva** que la que entiende tu código, que ocurre cuando alguien abre una pestaña antigua. Es el caso que casi nadie contempla.
6. Escribe en tres líneas por qué esto no es una manía: relaciona la respuesta con lo que ocurrirá en la UD6 cuando los datos vivan en un servidor y el formato cambie.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Estado único con manejadores de tres líneas, tres filtros combinables con su resumen anunciado, y preferencias que sobreviven a recargar.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de datos corruptos contestada y la página gobernada entera desde la consola.</span></div>
  <div><strong>Reto</strong><span>El estado reflejado en la URL y compartible, o la migración de preferencias entre versiones.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Existe un único objeto de estado y ninguna decisión se toma leyendo el DOM.</li>
    <li>Los manejadores cambian estado y llaman a actualizar.</li>
    <li>Los filtros se combinan en un solo sitio y ninguno pisa a otro.</li>
    <li>Las opciones de categoría se generan desde los datos.</li>
    <li>El número de resultados se anuncia a los lectores de pantalla.</li>
    <li>Un dato guardado inválido no rompe nada.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué es el estado de una interfaz?</li>
    <li>¿Por qué el DOM no debe ser el almacén de datos?</li>
    <li>¿Qué dos cosas hace un manejador de eventos?</li>
    <li>¿Qué hace un <em>debounce</em>?</li>
    <li>¿Para qué sirve <code>aria-live</code>?</li>
    <li>¿Por qué hay que desconfiar de lo guardado en el navegador?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Todo lo necesario para saber cómo debe verse la página ahora mismo.</p>
  <p>2 · Porque tendrías dos fuentes de verdad que pueden contradecirse.</p>
  <p>3 · Cambiar el estado y pedir que se vuelva a pintar.</p>
  <p>4 · Esperar a que pare la ráfaga de eventos y ejecutar una sola vez.</p>
  <p>5 · Para que un lector de pantalla anuncie los cambios de esa zona sin que haya que moverse hasta ella.</p>
  <p>6 · Porque es editable por cualquiera y puede venir de una versión anterior de la web.</p>
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

## Sesión 5 · Datos remotos

<p class="lead">Tres horas. Media hora para entender por qué JavaScript no espera y cómo se escribe código que sí lo parece, y dos horas y media cargando tu catálogo desde la red con todos los estados que eso implica.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué JavaScript no espera a lo lento, qué es una promesa, cómo se escribe código asíncrono que se lee en orden, y qué puede salir mal al pedir datos a un servidor.</li>
    <li><strong>2. Haz:</strong> Predice órdenes de ejecución, reescribe tus simulaciones con <code>await</code> y carga el catálogo desde la red con sus estados.</li>
    <li><strong>3. Comprueba:</strong> Con la red simulada lenta o caída, tu página se comporta bien.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si pedir datos a un servidor tarda dos segundos, ¿qué debería hacer la página mientras tanto?</li>
    <li>¿En qué orden crees que se ejecutan tres líneas si la de en medio tarda?</li>
    <li>¿Qué ve tu usuario mientras los datos tardan, y qué si el servidor responde con un error?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Toda la sesión sale de un hecho: JavaScript tiene un solo hilo y no puede permitirse esperar. De ahí vienen las promesas, `await`, y los cuatro estados que toda carga de datos tiene que contemplar.

#### Un solo hilo

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

De ahí sale el fallo característico de la semana:

```javascript
let productos = [];

setTimeout(() => {
  productos = [{ nombre: "Teclado" }];
}, 1000);

console.log(productos.length);    // 0, no 1
```

<div class="rule">
  <p class="rule-label">Un valor que llega tarde no se puede leer pronto</p>
  <p>El array no está mal: se mira antes de tiempo. La consecuencia práctica es una regla de diseño: <strong>todo lo que dependa del dato tiene que ocurrir dentro de lo que se ejecuta cuando el dato llega</strong>, no en la línea de después.</p>
  <p>Cuando pidas datos al servidor y te salga una lista vacía, esta será la primera sospecha.</p>
</div>

#### Una promesa es un valor futuro

<p class="term">Promesa</p>

Un objeto que representa un resultado que todavía no está: puede quedar <em>cumplida</em> con un valor o <em>rechazada</em> con un error. No contiene el dato, sino el compromiso de proporcionarlo.

Se consumen con `then`, `catch` y `finally`, o con la sintaxis que veremos enseguida:

```javascript
const promesa = new Promise((resolver, rechazar) => {
  setTimeout(() => resolver("Datos listos"), 1000);
});

promesa
  .then((valor) => console.log(valor))
  .catch((error) => console.error(error))
  .finally(() => console.log("Terminado"));
```

Casi nunca tendrás que crear promesas: te las darán hechas `fetch` y casi todas las APIs modernas. Lo que sí harás cada día es consumirlas, y la forma de hacerlo es esta:

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

| Regla | Consecuencia |
| ----- | ------------ |
| `await` solo dentro de `async` | Fuera, es un error de sintaxis (salvo en el nivel superior de un módulo) |
| Una función `async` devuelve una promesa | Quien la llame necesita `await`, o `.then` |

```javascript
const productos = cargarProductos();          // una promesa, no la lista
const productos = await cargarProductos();    // ahora sí, la lista
```

Ese primer caso —imprimir una promesa creyendo que son los datos— es el error número uno de esta semana. La consola muestra `Promise { <pending> }`, y ahí está la pista.

Cuando dos peticiones no dependen entre sí, se lanzan a la vez:

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

#### Pedir datos

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

#### Los cuatro estados de cualquier carga

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

El estado que montaste en la sesión 4 ya tenía sitio para `cargando` y `error`: la función de render decide qué pintar en cada caso, y ninguna otra parte del código se entera de nada.

<div class="rule">
  <p class="rule-label">El mensaje de error es para la persona; el detalle, para la consola</p>
  <p>«No se pudo cargar el catálogo. Inténtalo de nuevo» es útil. «TypeError: Failed to fetch» no lo es, y además cuenta cosas de tu sistema que no hacen falta ahí.</p>
  <p>Registra el error técnico con <code>console.error</code> y muestra el mensaje humano, con una salida: reintentar, volver, avisar.</p>
</div>

Por último, si pides datos a otro dominio y no ha dado permiso, el navegador bloquea la respuesta y la consola informa de un error de **CORS**. No se trata de un defecto del código propio, sino de una política de seguridad del navegador que se resuelve **en el servidor**. Lo harás tú mismo en la UD6.

### Se trabaja

<p class="stage stage--guided">150 minutos · práctica sobre tu propio proyecto</p>

El primer paso se hace en un archivo de pruebas y consiste casi entero en predecir. Del segundo en adelante, el catálogo empieza a venir de fuera.

#### Paso 1 · Predecir el orden · 25 min

1. Escribe cinco fragmentos que mezclen código normal y temporizadores; **predice el orden por escrito** y solo después compruébalo.
2. Reproduce el fallo del array vacío y explícalo en un comentario.
3. Monta un contador con `setInterval` y detenlo con un botón.
4. Provoca un intervalo no detenido y observa el efecto en consola.
5. Pon un bucle de diez millones de vueltas dentro de un manejador de clic y describe qué le pasa a la página mientras corre. Es la demostración del hilo único.

<details class="aside aside--extra">
<summary>Consultar · temporizadores</summary>

```javascript
const id = setTimeout(() => console.log("Una vez"), 1000);
clearTimeout(id);

const otro = setInterval(() => console.log("Cada segundo"), 1000);
clearInterval(otro);
```

Guarda siempre el identificador: un intervalo que nadie detiene sigue corriendo mientras la página esté abierta.

</details>

#### Paso 2 · Reescribir con await · 35 min

1. Convierte las simulaciones del paso 1 en funciones `async`.
2. Escribe `esperar(ms)` que devuelva una promesa, y úsala.
3. Encadena tres operaciones y mide su duración total.
4. Repite con `Promise.all` y compara los dos tiempos. Anótalos.
5. Provoca un rechazo y captúralo con `try/catch`.
6. Imprime a propósito la promesa **sin** `await` y escribe qué ves y por qué.

**Antes de continuar:** puedes decir, sin mirar, qué devuelve una función `async` y qué hace falta para obtener su valor.

#### Paso 3 · Catálogo desde la red · 45 min

Es el trabajo central de la sesión.

1. Coloca tu catálogo como fichero `.json` y cárgalo con `fetch`.
2. Comprueba `respuesta.ok` y lanza un error con el código de estado.
3. Usa `cargando` y `error` del estado que montaste en la sesión 4, y píntalos desde la función de render. Ningún manejador debe tocar el DOM.
4. Muestra un indicador de carga y un mensaje de error con botón de reintentar.
5. Comprueba que el estado **vacío** —un JSON que es una lista sin elementos— se distingue del estado de error. No son lo mismo y no se dicen igual.
6. Consume además una API pública real y observa su respuesta en la pestaña Network.

#### Paso 4 · Las cuatro situaciones · 25 min

Con la red local todo va tan rápido que el indicador de carga no se llega a ver. En DevTools, pestaña Network, simula cada situación y rellena la tabla:

| Situación | Qué se ve | ¿Hay salida para la persona? | Corrección |
| --------- | --------- | ---------------------------- | ---------- |
| Carga normal | | | |
| Red lenta (*Slow 3G*) | | | |
| Sin red (*Offline*) | | | |
| El servidor responde 404 | | | |
| El servidor responde 500 | | | |
| La respuesta es una lista vacía | | | |

Las dos últimas filas son las que se olvidan. Un 500 con tu comprobación de `ok` debe producir el mismo mensaje que un 404, y una lista vacía no constituye un error, sino un resultado legítimo que se comunica de otra forma.

#### Paso 5 · El mensaje de error útil · 20 min

Revisa todos los mensajes de error que muestra tu página y pásalos por estas tres preguntas:

1. ¿Dice qué ha pasado, en palabras que entienda quien no programó esto?
2. ¿Ofrece una salida: reintentar, volver, buscar otra cosa?
3. ¿Filtra el detalle técnico a la consola en lugar de enseñarlo?

Reescribe los que no pasen las tres. Después comprueba una cosa más: que el mensaje de error se **anuncia** en la región `aria-live` que montaste en la sesión 4, o tiene la suya. Un error que solo se ve no llega a todo el mundo.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. Los dos retos atacan lo que ocurre cuando la red no se porta: ni es instantánea ni es fiable ni respeta el orden.

##### Reto 1 · Reintentar sin castigar al servidor

Un fallo de red suele ser pasajero. Reintentar es razonable; reintentar mal, no.

1. Escribe `pedirConReintentos(url, intentos = 3)` que vuelva a intentarlo si la petición falla.
2. Espera entre intentos, y que la espera **crezca**: 1 s, 2 s, 4 s. Averigua cómo se llama esa técnica y escríbelo.
3. Decide qué errores merecen reintento y cuáles no. Un 500 quizá sí; un 404 no, porque volver a pedir lo mismo dará lo mismo. Documenta tu criterio.
4. Muestra en la interfaz que se está reintentando, y en qué intento va.
5. Después del último fallo, el mensaje debe ofrecer un reintento manual.
6. Explica en tres líneas qué pasaría si mil clientes reintentaran a la vez, cada 100 ms, contra un servidor que ya estaba en apuros. Esa es la razón de que la espera crezca.

##### Reto 2 · La respuesta que llega tarde

Este fallo es real, frecuente y no da ningún error. Monta una búsqueda que pida los resultados al servidor con cada cambio del campo.

1. Simula que el servidor tarda un tiempo **aleatorio** entre 100 y 1500 ms.
2. Escribe deprisa «teclado». Se lanzan varias peticiones. Observa el resultado final.
3. Tarde o temprano verás lo siguiente: los resultados de «tec» llegan **después** de los de «teclado» y sobrescriben la lista. La interfaz muestra una respuesta que no corresponde a lo que hay escrito en el campo. Reprodúcelo y descríbelo por escrito.
4. Primera defensa: aplica el `debounce` de la sesión 4. Comprueba que reduce el problema y **no lo elimina**. Explica por qué.
5. Segunda defensa: cancela la petición anterior con `AbortController` cuando llega una nueva. Compruébalo en la pestaña Network, donde las canceladas aparecen marcadas.
6. Tercera defensa, por si acaso: guarda cuál fue la última consulta lanzada y descarta cualquier respuesta que no corresponda a ella. Implementa esta también y explica por qué conviene tenerla aunque uses `AbortController`.

Este fallo tiene nombre en la disciplina. Búscalo y escríbelo: lo vas a volver a encontrar en cuanto trabajes con datos remotos.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Órdenes de ejecución predichos, funciones <code>async</code> con errores capturados, y el catálogo cargado desde JSON con sus cuatro estados.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de las seis situaciones de red contestada y los mensajes de error reescritos y anunciados.</span></div>
  <div><strong>Reto</strong><span>Los reintentos con espera creciente y criterio por código de estado, o la búsqueda protegida contra las respuestas fuera de orden.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Explicas por qué JavaScript no espera y qué es una promesa.</li>
    <li>Usas <code>async/await</code> con los errores capturados.</li>
    <li>Compruebas <code>respuesta.ok</code> en toda petición.</li>
    <li>Tu página contempla cargando, error, vacío y datos, y los distingue.</li>
    <li>Has probado con red lenta, sin red y con respuesta de error.</li>
    <li>Los mensajes de error ofrecen una salida y se anuncian.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué JavaScript no espera a lo lento?</li>
    <li>¿Qué imprime <code>console.log</code> de una función <code>async</code> llamada sin <code>await</code>?</li>
    <li>¿Cuándo se espera en serie y cuándo con <code>Promise.all</code>?</li>
    <li>¿Por qué un 404 no rechaza la promesa de <code>fetch</code>?</li>
    <li>Nombra los cuatro estados de una carga.</li>
    <li>¿Qué es un error de CORS y dónde se resuelve?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque tiene un solo hilo: esperar bloquearía toda la interfaz.</p>
  <p>2 · Una promesa pendiente: falta el <code>await</code>.</p>
  <p>3 · En serie cuando la segunda operación necesita el resultado de la primera; a la vez cuando no dependen entre sí.</p>
  <p>4 · Porque el 404 es una respuesta válida: la promesa se cumple y hay que mirar <code>ok</code> o <code>status</code>.</p>
  <p>5 · Cargando, error, vacío y datos.</p>
  <p>6 · Una política del navegador sobre peticiones a otro origen, y se resuelve en el servidor.</p>
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

## Sesión 6 · Interfaz robusta y entrega

<p class="lead">Tres horas repartidas en tres bloques de una hora: <strong>Accesibilidad y rendimiento con JavaScript</strong>, <strong>Reto acumulativo y depuración</strong> y <strong>Auditoría final, revisión por pares y entrega</strong>. Cada bloque termina con su propia comprobación.</p>

### Bloque 1 · Accesibilidad y rendimiento con JavaScript

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

#### Lo que JavaScript rompe con facilidad

| Problema | Cómo se ve | Cómo se arregla |
| -------- | ---------- | --------------- |
| Controles falsos | Un contenedor genérico que hace de botón | Usar el elemento correcto |
| Foco perdido | Tras pintar, el foco vuelve al principio | Devolverlo a un punto con sentido |
| Cambios mudos | El contenido cambia y nadie lo anuncia | Una región activa |
| Foco invisible | El contorno se quitó en el CSS | `:focus-visible` de la UD2 |
| Trampa de foco | Un panel del que no se sale con el tabulador | Gestionar el foco al abrir y cerrar |
| Movimiento forzado | Animaciones para quien pidió que no las hubiera | Respetar la preferencia del sistema |

#### El foco después de pintar

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

#### Respetar las preferencias

```javascript
const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!sinMovimiento) elemento.classList.add("con-animacion");
```

La misma consulta que usaste en el CSS de la UD2, ahora desde el código. Las decisiones de la persona usuaria se respetan en las tres capas.

#### Rendimiento: las tres cosas que importan

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

Con doscientas tarjetas la diferencia es perceptible; con dos mil, separa una interfaz fluida de una inutilizable.

#### Tarea 16 · Auditoría de accesibilidad

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
  <p class="checkpoint-label">Checkpoint · fin del bloque 1</p>
  <ul class="checklist">
    <li>Todo se puede usar sin ratón.</li>
    <li>El foco no se pierde al volver a pintar.</li>
    <li>Los cambios importantes se anuncian.</li>
    <li>Respetas la preferencia de movimiento reducido.</li>
  </ul>
</div>


### Bloque 2 · Reto acumulativo y depuración

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Nada nuevo. Hoy se comprueba si sabes montar y arreglar una interfaz.</li>
    <li><strong>2. Haz:</strong> Monta una interfaz de un dominio desconocido y repara otra que está rota.</li>
    <li><strong>3. Comprueba:</strong> Localizas cada fallo antes de tocar el código.</li>
  </ol>
</div>

#### Primera parte · una interfaz nueva

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

#### Segunda parte · el diagnóstico

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
  <p class="checkpoint-label">Checkpoint · fin del bloque 2</p>
  <ul class="checklist">
    <li>Has montado una interfaz completa desde datos ajenos.</li>
    <li>Separas fallos de evento de fallos de lógica.</li>
    <li>Usas Elements, Sources y Network según lo que buscas.</li>
    <li>Escribes la hipótesis antes de tocar nada.</li>
  </ul>
</div>


### Bloque 3 · Auditoría final, revisión por pares y entrega

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se revisa en una interfaz antes de darla por terminada.</li>
    <li><strong>2. Haz:</strong> Audita tu proyecto, revisa el de un compañero y corrige.</li>
    <li><strong>3. Comprueba:</strong> Puedes defender cada decisión.</li>
  </ol>
</div>

#### La lista de auditoría

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

#### Revisión por pares

Intercambia proyectos y, sin preguntar nada:

1. Usa la interfaz **solo con el teclado** y anota dónde te atascas.
2. Simula red lenta y sin red, y describe qué ve el usuario.
3. Busca algo que no exista y comprueba el estado vacío.
4. Localiza en el código dónde vive el estado y explícalo.
5. Señala una decisión bien tomada y una mejorable, con su razón.

#### Defensa

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

#### Evaluación

| Criterio | Puntos |
| ---------------------------------------------------------- | -----: |
| Render desde datos: idempotente y con su estado vacío | 2 |
| Estado único: ninguna decisión se toma leyendo el DOM | 2 |
| Eventos y delegación | 1,5 |
| Formulario validado con errores accesibles y foco correcto | 1,5 |
| Carga de datos con sus cuatro estados | 1,5 |
| Accesibilidad: teclado, foco y cambios anunciados | 1,5 |

No puntúa que la interfaz sea vistosa. Puntúa que **aguante**: contenido que cambia, red que falla, búsquedas sin resultados y alguien que no usa el ratón.

#### Entrega

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

Para depurar:

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

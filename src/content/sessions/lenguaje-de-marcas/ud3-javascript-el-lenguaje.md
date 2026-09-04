---
title: "JavaScript: el lenguaje"
label: "UD3 · Guía y taller práctico"
section: "ud-03"
order: 3
lang: "es"
summary: "La tercera capa de la web empieza por el lenguaje. Antes de tocar la página aprendemos a razonar con datos, decisiones, funciones y estructuras, porque un botón que no funciona casi nunca es un problema del botón: es un problema de lógica que todavía no sabes leer."
duration: "18 sesiones · 6 semanas"
modality: "Individual, con retos y revisión en pareja"
deliverable: "Un módulo de catálogo escrito en JavaScript puro: datos en memoria, funciones de búsqueda, filtrado y ordenación, validación de entradas y errores controlados, comprobado desde la consola."
outcomes:
  - "Explicar dónde se ejecuta JavaScript y qué relación tiene con el documento que ya sabes escribir."
  - "Declarar datos con el tipo y el ámbito adecuados, y justificar cuándo usar const y cuándo let."
  - "Predecir el resultado de una conversión de tipos en lugar de descubrirlo por sorpresa."
  - "Escribir condicionales y bucles que expresen la regla del problema, no la primera forma que compila."
  - "Diseñar funciones pequeñas, con un cometido claro, que devuelven valores en vez de imprimirlos."
  - "Consultar arrays con métodos declarativos: map, filter, find, sort y reduce."
  - "Modelar información real con objetos y convertirla a JSON y desde JSON."
  - "Separar el código en módulos ES con import y export."
  - "Detectar y tratar errores con try/catch, y validar la entrada antes de confiar en ella."
  - "Depurar con la consola y con puntos de interrupción, en lugar de a base de cambios al azar."
requirements:
  - "El sitio de la UD1 y la UD2, con su HTML validado y su hoja de estilos."
  - "Visual Studio Code."
  - "Un navegador moderno con DevTools y su consola."
  - "Un servidor local sencillo, porque los módulos ES no funcionan abriendo el fichero directamente."
priorKnowledge:
  - "Escribir HTML semántico válido y enlazar recursos con rutas relativas (UD1)."
  - "Enlazar una hoja de estilos y diagnosticar por qué un recurso no carga (UD2)."
  - "Abrir DevTools y moverse entre sus pestañas (UD1 y UD2)."
date: "2026-09-04"
---

## ¿Qué vas a aprender?

Tu sitio ya dice lo que las cosas son, y ya se presenta bien en cualquier pantalla. Lo que todavía no hace es **decidir**.

En las dos primeras unidades escribiste documentos. Un documento describe algo: esto es un título, esto es una tabla, esto es un formulario. Un documento no puede comprobar si un correo es válido, filtrar un catálogo por precio, recordar lo que elegiste ni pedir datos a otro servidor.

Para eso hace falta un lenguaje de programación, y en la web ese lenguaje es **JavaScript**.

<figure class="diagram">
  <figcaption>Las tres capas, y qué responde cada una</figcaption>
  <ol class="flow">
    <li>HTML · qué existe</li>
    <li>CSS · cómo se presenta</li>
    <li>JavaScript · qué ocurre</li>
  </ol>
</figure>

### Por qué esta unidad casi no toca la página

Cuando alguien empieza con JavaScript, la tentación es ir directamente a lo vistoso: que este botón abra ese menú. Y funciona, hasta el día en que deja de funcionar. Entonces aparece la escena de siempre: se mira el botón, se cambia el nombre de la clase, se prueba otro evento, se copia otro fragmento, y sigue sin funcionar.

El problema casi nunca está en el botón.

<div class="rule">
  <p class="rule-label">Un fallo de interfaz suele ser un fallo de lógica disfrazado</p>
  <p>Si un filtro no filtra, casi siempre es porque la comparación estaba mal, porque el valor era texto y no número, o porque la función devolvía <code>undefined</code>. Nada de eso se ve mirando el HTML.</p>
  <p>Por eso esta unidad se dedica al lenguaje: datos, decisiones, funciones y estructuras. Cuando en la UD4 conectemos todo con la página, sabrás distinguir «el evento no salta» de «el evento salta, pero mi función está mal».</p>
</div>

### La idea que gobierna la unidad

<p class="term">Predecir antes de ejecutar</p>

Durante seis semanas, antes de ejecutar vas a escribir qué esperas que salga. Cuando aciertes, has entendido. Cuando falles, acabas de encontrar el punto exacto en el que tu modelo mental no coincide con el lenguaje, que es lo único que de verdad se aprende.

<figure class="diagram">
  <figcaption>Las dos formas de trabajar</figcaption>
  <ol class="flow flow--row flow--chain flow--before">
    <li>Escribo código</li>
    <li>Ejecuto a ver qué pasa</li>
    <li>No es eso</li>
    <li>Cambio algo al azar</li>
  </ol>
</figure>

<figure class="diagram">
  <figcaption>La que aprenderemos</figcaption>
  <ol class="flow flow--row flow--chain flow--after">
    <li>Escribo código</li>
    <li>Predigo el resultado</li>
    <li>Ejecuto</li>
    <li>Comparo</li>
    <li>Explico la diferencia</li>
  </ol>
</figure>

---

## El proyecto continúa

Seguimos con el mismo sitio. Le añadimos una carpeta:

```text
mi-web/
│
├── index.html
├── productos.html
├── acerca.html
├── contacto.html
│
├── css/
│   └── styles.css
│
├── js/                 ← nuevo
│   ├── datos.js
│   ├── catalogo.js
│   └── main.js
│
└── img/
    └── ...
```

El entregable de la unidad **no es una página interactiva**: eso llega en la UD4. Es un módulo de catálogo que funciona por sí solo y que se comprueba desde la consola.

<div class="unit-deliverable">
  <p>Un fichero <code>datos.js</code> con el catálogo de tu tema, un fichero <code>catalogo.js</code> con las funciones que lo consultan —buscar, filtrar, ordenar, resumir— y un <code>main.js</code> que las usa y escribe el resultado en la consola. Sin tocar el documento.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 1 · nada de librerías</p>
  <p>Ni jQuery, ni Lodash, ni utilidades descargadas. Todo lo que necesitas está en el lenguaje. Usar una librería ahora te ahorraría escribir diez líneas y te costaría entender qué hacen esas diez líneas.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 2 · la IA, para entender, no para entregar</p>
  <ol>
    <li><strong>Antes de preguntar:</strong> escribe qué esperabas que ocurriera y qué ocurre en realidad, con el valor concreto que ves en consola.</li>
    <li><strong>Pregunta:</strong> pide una explicación o una pista, no la función terminada. Ejemplo: «Mi filtro por precio devuelve el array entero. He comprobado que el valor llega como texto. Explícame qué debería revisar sin darme el código».</li>
    <li><strong>Después:</strong> cierra la respuesta y resuelve una variante distinta sin volver a preguntar.</li>
  </ol>
  <p>La prueba es la de siempre: si no puedes cambiar una decisión pequeña de tu propia solución —invertir el orden, añadir un criterio, tratar el caso vacío— todavía no controlas lo que has entregado.</p>
</div>

---

## Herramientas

La herramienta central de esta unidad es una que ya conoces, usada de otra manera:

<p class="term">La consola de DevTools</p>

En la UD2 la abrías para inspeccionar estilos. Ahora es donde vive tu programa: escribes expresiones y te responde, imprimes valores, lees errores y detienes la ejecución para mirar dentro.

Además usaremos dos cosas de VS Code que ya estaban ahí: el **subrayado de errores**, porque JavaScript avisa de mucho antes de ejecutar nada, y el **depurador**, para poner puntos de interrupción sin salir del editor.

### No todo pesa lo mismo

<div class="learning-priorities">
  <div class="learning-priorities__essential">
    <strong>Esencial · debes dominarlo</strong>
    <span>Tipos y conversión, condicionales, bucles, funciones, arrays, objetos y depuración.</span>
  </div>
  <div class="learning-priorities__important">
    <strong>Importante · debes saber aplicarlo</strong>
    <span>Métodos declarativos de array, desestructuración, JSON, módulos y <code>try/catch</code>.</span>
  </div>
  <div class="learning-priorities__extra">
    <strong>Ampliación · cuando lo anterior funciona</strong>
    <span><code>Map</code> y <code>Set</code>, encadenamiento opcional, <code>Intl</code> y funciones de orden superior propias.</span>
  </div>
</div>

Si vas justo de tiempo, prioriza lo esencial. Un `reduce` elegante no compensa no saber por qué `"3" + 1` vale `"31"`.

---

## Plan de trabajo semanal

| Semana | Bloque temático | Práctica central | Horas |
| :---: | :--- | :--- | :---: |
| **Semana 1** | Datos, tipos y expresiones | Consola, variables, conversión y comparaciones | 3 h |
| **Semana 2** | Decisiones y repeticiones | Condicionales, bucles y programas con reglas | 3 h |
| **Semana 3** | Funciones y depuración | Descomponer un problema y depurar con criterio | 3 h |
| **Semana 4** | Arrays y objetos | El catálogo en memoria y sus consultas | 3 h |
| **Semana 5** | Organizar y proteger el código | Módulos, errores y validación | 3 h |
| **Semana 6** | Integración y entrega | Reto acumulativo, refactorización y revisión por pares | 3 h |
| **Total** | | **Un módulo de catálogo en JavaScript puro** | **18 h** |

Cada sesión dura una hora y mantiene el ritmo de las unidades anteriores:

<figure class="diagram">
  <figcaption>El ritmo de cada sesión</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Recupera · 5 min</li>
    <li>Aprende y predice · 10–20 min</li>
    <li>Practica · 30–40 min</li>
    <li>Cierra · 5 min</li>
  </ol>
</figure>

El reparto real del tiempo es este:

| En qué se va la unidad | Horas |
| ---------------------- | ----: |
| Explicación y predicción de resultados | 4–5 h |
| Ejercicios guiados | 7–8 h |
| Proyecto incremental | 3–4 h |
| Depuración y revisión por pares | 2 h |

---

## Semana 1 · Datos, tipos y expresiones

---

## Sesión 1 · Dónde se ejecuta JavaScript

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es JavaScript, dónde se ejecuta y cómo se enlaza con una página.</li>
    <li><strong>2. Haz:</strong> Usa la consola como calculadora, crea <code>js/main.js</code> y enlázalo en tu sitio.</li>
    <li><strong>3. Comprueba:</strong> Tu código se ejecuta, sabes demostrarlo y sabes leer un error.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué cosas de una web crees que no puede hacer el HTML por sí solo?</li>
    <li>En la UD2, ¿cómo comprobabas que la hoja de estilos se había cargado?</li>
    <li>¿Qué esperas que ocurra si enlazas un fichero que no existe?</li>
  </ol>
</div>

### Un lenguaje que vive dentro del navegador

Todo navegador moderno lleva dentro un motor de JavaScript: un programa que lee tu código y lo ejecuta. No hay que instalar nada ni compilar nada. Abres la consola, escribes una expresión y te responde.

Prueba esto, línea a línea:

```javascript
2 + 3
"Pixel" + "Store"
10 / 4
new Date().getFullYear()
```

Ya estás programando. La consola evalúa lo que escribes y muestra el resultado.

### Escribirlo en un fichero

Escribir en la consola sirve para probar; lo que se conserva va en un fichero. Crea `js/main.js`:

```javascript
console.log("El código se está ejecutando");
```

Y enlázalo desde el `head` de tu página, con `defer`:

```html
<script src="js/main.js" defer></script>
```

Recarga la página, abre la consola y busca el mensaje. Si aparece, el enlace funciona.

<p class="term">defer</p>

Le dice al navegador: descarga el fichero mientras lees el documento, y ejecútalo cuando el documento esté completo. Sin `defer`, el código se ejecuta antes de que exista la página, y en la UD4 eso significaría buscar elementos que todavía no están.

### Los tres sitios donde puede ir el código

| Forma | Cómo se escribe | Cuándo |
| ----- | --------------- | ------ |
| Fichero externo | Un `.js` enlazado con `script src` | **Siempre** |
| Bloque en la página | Código dentro de un `script` en el documento | Pruebas rápidas |
| En un atributo | `onclick="..."` en la etiqueta | Nunca en este módulo |

Las razones son las mismas que en CSS: reutilización, caché y mantener separadas las tres capas. Un `onclick` mete comportamiento dentro de la estructura, que es justo lo que llevamos dos unidades evitando.

### Leer un error en vez de asustarse

Escribe esto a propósito en `main.js`:

```javascript
console.log(precioTotal);
```

La consola responde algo parecido a:

```text
Uncaught ReferenceError: precioTotal is not defined
    at main.js:1:13
```

Tiene tres partes y las tres importan: el **tipo** de error (`ReferenceError`), el **mensaje** (`is not defined`) y la **posición** (`main.js`, línea 1, columna 13). Con eso ya sabes qué mirar antes de tocar nada.

<div class="rule">
  <p class="rule-label">El primer error es el que hay que arreglar</p>
  <p>Cuando algo falla, la consola suele llenarse. Casi siempre los errores siguientes son consecuencia del primero. Sube arriba del todo, arregla ese, recarga y vuelve a mirar.</p>
</div>

### Tarea 1 · Tu primer script

1. Crea `js/main.js` y enlázalo en `index.html` con `defer`.
2. Escribe tres `console.log` con tu nombre, el nombre de tu proyecto y el año actual calculado.
3. Provoca un error a propósito y anota su tipo, su mensaje y su línea.
4. Corrígelo.
5. Enlaza el mismo fichero en el resto de páginas.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>El código se ejecuta en las cuatro páginas y sabes demostrarlo.</span></div>
  <div><strong>Si lo tienes</strong><span>Cambia la ruta del <code>src</code> y diagnostica el 404 desde la pestaña Network.</span></div>
  <div><strong>Reto</strong><span>Quita <code>defer</code>, mueve el enlace y explica en qué se nota el cambio de orden.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Existe <code>js/main.js</code> y se ejecuta al cargar la página.</li>
    <li>Sabes por qué usamos un fichero externo y no un atributo en la etiqueta.</li>
    <li>Sabes leer el tipo, el mensaje y la línea de un error.</li>
    <li>Puedes explicar qué hace <code>defer</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Dónde se ejecuta el JavaScript que escribes en esta unidad?</li>
    <li>¿Qué tres datos te da un error de la consola?</li>
    <li>¿Por qué evitamos <code>onclick</code> en el HTML?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · En el motor de JavaScript del navegador, sin instalar ni compilar nada.</p>
  <p>2 · El tipo de error, el mensaje, y el fichero con su línea y su columna.</p>
  <p>3 · Porque mezcla comportamiento con estructura, y pierde la reutilización y la caché del fichero externo.</p>
</details>

---

## Sesión 2 · Variables, tipos y valores

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se guarda un dato, qué tipos existen y qué diferencia hay entre <code>const</code> y <code>let</code>.</li>
    <li><strong>2. Haz:</strong> Modela con variables la ficha de un producto de tu catálogo.</li>
    <li><strong>3. Comprueba:</strong> Sabes decir el tipo de cada valor antes de preguntárselo a la consola.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué datos tiene un producto de tu proyecto? Escribe cinco.</li>
    <li>¿Cuáles son texto, cuáles número y cuáles solo pueden ser sí o no?</li>
    <li>¿Cuáles de ellos cambiarán mientras la página está abierta?</li>
  </ol>
</div>

### Guardar un valor con un nombre

```javascript
const nombre = "Teclado mecánico";
const precio = 89.9;
let stock = 12;
```

Una variable es un nombre para un valor. Se declara una vez y se usa muchas.

| Palabra | Se puede reasignar | Cuándo se usa |
| ------- | :---: | ------------- |
| `const` | No | **Por defecto**, siempre que el valor no cambie |
| `let` | Sí | Cuando el valor tiene que cambiar |
| `var` | Sí | Nunca en código nuevo |

<div class="rule">
  <p class="rule-label">Empieza siempre por <code>const</code></p>
  <p>Declara con <code>const</code> y cámbialo a <code>let</code> solo cuando el propio lenguaje te obligue con un error. Así, al leer el código, un <code>let</code> significa algo: «esto cambia, presta atención».</p>
  <p><code>var</code> no lo usamos porque no respeta los bloques y permite redeclarar la misma variable sin avisar. Aparecerá en código antiguo y en respuestas de IA; sustitúyelo.</p>
</div>

### Los tipos que vas a usar

```javascript
const texto = "Teclado";        // string
const numero = 89.9;            // number
const disponible = true;        // boolean
const sinValor = null;          // null: vacío a propósito
let noAsignada;                 // undefined: todavía no tiene valor
```

Hay dos más, `bigint` y `symbol`, que no usarás en este módulo.

La diferencia entre `null` y `undefined` se pregunta mucho y es sencilla: `undefined` es «nadie le ha dado valor»; `null` es «alguien decidió que estuviera vacío».

Para preguntar el tipo:

```javascript
typeof "Teclado"   // "string"
typeof 89.9        // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof null        // "object"  ← un error histórico del lenguaje
```

### Textos: comillas y plantillas

```javascript
const producto = "Teclado";
const unidades = 3;

const linea = "Has elegido " + unidades + " × " + producto;
const mejor = `Has elegido ${unidades} × ${producto}`;
```

Las **plantillas** —escritas con acento grave— permiten insertar valores con `${}` y ocupar varias líneas. A partir de aquí, para construir texto usamos siempre plantillas: concatenar con `+` es donde nacen la mitad de los espacios perdidos.

### Números: uno solo, y con un aviso

JavaScript tiene un único tipo numérico, en coma flotante. Eso trae una sorpresa clásica:

```javascript
0.1 + 0.2        // 0.30000000000000004
```

No es un fallo de JavaScript: es cómo se representan los decimales en binario. Con dinero se trabaja en céntimos, con enteros, o se redondea al presentar:

```javascript
const total = 0.1 + 0.2;
total.toFixed(2);            // "0.30"  ← ojo: devuelve texto
Number(total.toFixed(2));    // 0.3
```

### Nombrar bien no es cosmética

```javascript
const p = 89.9;              // ¿precio? ¿peso? ¿página?
const precioConIva = 89.9;   // se lee solo
```

En este módulo: `camelCase`, en castellano o en inglés pero **sin mezclar**, nombres que digan qué contienen, y `MAYUSCULAS_CON_GUION` solo para constantes de configuración.

### Tarea 2 · La ficha de un producto

En `js/main.js`, con datos de **tu** tema:

1. Declara seis variables que describan un producto: nombre, precio, categoría, unidades, disponible y descripción.
2. Elige `const` o `let` justificando cada elección en un comentario.
3. Escribe con una plantilla una línea de resumen legible.
4. Calcula el precio con IVA y muéstralo con dos decimales.
5. Comprueba con `typeof` que cada variable tiene el tipo que esperabas.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Seis variables bien nombradas, del tipo correcto, y un resumen con plantilla.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade un descuento en porcentaje y calcula el precio final redondeado.</span></div>
  <div><strong>Reto</strong><span>Reasigna una <code>const</code> a propósito, lee el error y explica qué protege exactamente.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Distingues <code>const</code> de <code>let</code> y usas <code>const</code> por defecto.</li>
    <li>Nombras los cinco tipos que vas a usar.</li>
    <li>Construyes texto con plantillas, no con el operador de suma.</li>
    <li>Sabes por qué <code>0.1 + 0.2</code> no da exactamente <code>0.3</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>null</code> y <code>undefined</code>?</li>
    <li>¿Qué devuelve <code>toFixed(2)</code>, un número o un texto?</li>
    <li>¿Por qué no usamos <code>var</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>undefined</code> es que no se le ha dado valor; <code>null</code> es un vacío puesto a propósito.</p>
  <p>2 · Un texto. Si vas a seguir calculando, conviértelo con <code>Number()</code>.</p>
  <p>3 · Porque ignora los bloques y permite redeclarar sin avisar, así que oculta errores.</p>
</details>

---

## Sesión 3 · Operadores, conversión y comparación

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo opera JavaScript entre tipos distintos y por qué comparamos siempre con el triple igual.</li>
    <li><strong>2. Haz:</strong> Predice el resultado de una batería de expresiones y comprueba tus predicciones.</li>
    <li><strong>3. Comprueba:</strong> Aciertas la mayoría y sabes explicar las que fallas.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué crees que vale <code>"3" + 1</code>? ¿Y <code>"3" - 1</code>?</li>
    <li>Un campo de formulario, ¿te devolverá un número o un texto?</li>
    <li>¿Qué significa para ti que dos valores sean «iguales»?</li>
  </ol>
</div>

### Los operadores

```javascript
7 + 2      // 9
7 - 2      // 5
7 * 2      // 14
7 / 2      // 3.5
7 % 2      // 1   resto de la división
7 ** 2     // 49  potencia
```

El resto, `%`, parece anecdótico y no lo es: es como se detecta un número par (`n % 2 === 0`) o se recorre algo en ciclo.

Y los de asignación abreviada:

```javascript
let stock = 10;
stock += 5;    // 15
stock -= 2;    // 13
stock++;       // 14
```

### La conversión automática, el gran tropiezo

JavaScript, cuando mezclas tipos, convierte por su cuenta:

```javascript
"3" + 1      // "31"   con texto, el + concatena
"3" - 1      // 2      el - no sabe concatenar: convierte a número
"3" * "2"    // 6
true + 1     // 2      true vale 1
```

La regla práctica: **la suma con un texto a un lado concatena; el resto de operadores aritméticos convierten a número**.

Esto no es una curiosidad de examen. Es exactamente el fallo que te espera en la UD4, cuando leas el valor de un campo:

```javascript
const introducido = "10";      // lo que da un campo de formulario
introducido + 5                // "105"   ← el error clásico
Number(introducido) + 5        // 15      ← lo correcto
```

<div class="rule">
  <p class="rule-label">Convierte tú, en el borde de tu programa</p>
  <p>Todo lo que entra desde fuera —un formulario, una URL, un fichero, una API— llega como texto. Conviértelo <strong>en el momento de leerlo</strong> y opera después con números de verdad. Si conviertes tarde, arrastras el texto por medio programa.</p>
  <p>Y comprueba el resultado: <code>Number("hola")</code> da <code>NaN</code>, que es un número que significa «esto no era un número».</p>
</div>

```javascript
Number("10")       // 10
Number("10,5")     // NaN   ← la coma no es el separador decimal
parseInt("10px")   // 10    se queda con lo que puede leer
parseFloat("10.5") // 10.5
Number.isNaN(Number("hola"))   // true
```

### Comparar: dos iguales frente a tres

```javascript
5 == "5"     // true   compara después de convertir
5 === "5"    // false  compara valor y tipo
null == undefined    // true
null === undefined   // false
```

<div class="rule">
  <p class="rule-label">En este módulo se compara con el triple igual</p>
  <p>Siempre. El doble igual convierte antes de comparar, y esas conversiones tienen casos que nadie recuerda de memoria. Escribir un carácter más no cuesta nada y elimina una familia entera de errores.</p>
</div>

### Valores «verdaderos» y «falsos»

En un `if`, JavaScript pregunta si el valor es *truthy* o *falsy*. Los falsos son exactamente estos seis:

```javascript
false, 0, "", null, undefined, NaN
```

Todo lo demás es verdadero, incluidos `"0"`, `"false"`, `[]` y `{}`. Esto explica un fallo muy común:

```javascript
const unidades = 0;

if (unidades) {
  // no entra: 0 es falsy, aunque sea un valor perfectamente válido
}

if (unidades !== undefined) {
  // esto sí comprueba lo que querías comprobar
}
```

Y los operadores lógicos:

```javascript
true && false     // false   y
true || false     // true    o
!true             // false   no

const nombre = entrada || "Sin nombre";      // si entrada es falsy
const stock = recibido ?? 0;                 // solo si es null o undefined
```

El segundo suele ser el que quieres: el `||` también sustituiría un `0` legítimo.

### Tarea 3 · Predice y comprueba

Crea `js/predicciones.js`. Para cada expresión, **escribe primero tu predicción en un comentario** y después ejecútala:

```javascript
"5" + 3
"5" - 3
5 + true
"10" > 9
"10" > "9"
0 === -0
NaN === NaN
[] == false
null + 1
undefined + 1
Number("")
Boolean("false")
```

Después, sobre tu proyecto:

1. Simula tres datos «de formulario» como textos.
2. Conviértelos correctamente.
3. Calcula un total y comprueba que no es `NaN`.
4. Escribe una comprobación que detecte una entrada no numérica.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Doce predicciones escritas, comprobadas, y las falladas explicadas.</span></div>
  <div><strong>Si lo tienes</strong><span>Escribe cinco expresiones tramposas para un compañero y corregidlas juntos.</span></div>
  <div><strong>Reto</strong><span>Explica por qué <code>"10" &gt; "9"</code> es falso y <code>"10" &gt; 9</code> verdadero.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 3</p>
  <ul class="checklist">
    <li>Predices el resultado de una mezcla de tipos y aciertas.</li>
    <li>Conviertes la entrada al leerla y compruebas <code>NaN</code>.</li>
    <li>Comparas siempre con el triple igual.</li>
    <li>Recitas los seis valores <em>falsy</em>.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 1</p>
  <ul class="checklist">
    <li>Tu código se ejecuta desde un fichero externo en todo el sitio.</li>
    <li>Modelas un producto con variables bien nombradas y del tipo correcto.</li>
    <li>Sabes por qué un campo de formulario nunca te dará un número.</li>
    <li>Tienes un fichero de predicciones que puedes releer cuando algo raro pase.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas de la sesión 3</summary>
  <p>De arriba abajo: <code>"53"</code>, <code>2</code>, <code>6</code>, <code>true</code> (convierte a número), <code>false</code> (compara texto con texto, y el «1» va antes que el «9»), <code>true</code>, <code>false</code> (nada es igual a <code>NaN</code>), <code>true</code>, <code>1</code>, <code>NaN</code>, <code>0</code>, <code>true</code> (es un texto no vacío).</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 1 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Di qué imprime <code>"5" + 3</code> y qué imprime <code>"5" - 3</code>, y por qué son distintos.</li>
    <li>Declara tres variables eligiendo <code>const</code> o <code>let</code>, y justifica cada elección en cinco palabras.</li>
    <li>Enumera los seis valores <em>falsy</em>.</li>
  </ol>
</div>
---

## Semana 2 · Decisiones y repeticiones

---

## Sesión 4 · Condicionales

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se escribe una decisión: <code>if</code>, <code>else if</code>, <code>switch</code> y el operador ternario.</li>
    <li><strong>2. Haz:</strong> Traduce a código las reglas de negocio de tu proyecto.</li>
    <li><strong>3. Comprueba:</strong> Tus condiciones cubren todos los casos, incluidos los límites.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Escribe en castellano tres reglas de tu proyecto («si el pedido supera 50 €, el envío es gratis»).</li>
    <li>¿Qué pasa exactamente cuando el pedido vale 50?</li>
    <li>¿Qué valores hacen que un <code>if</code> no entre aunque el dato exista?</li>
  </ol>
</div>

### La decisión más simple

```javascript
const total = 62;

if (total >= 50) {
  console.log("Envío gratuito");
} else {
  console.log(`Envío: 4,95 € (te faltan ${(50 - total).toFixed(2)} €)`);
}
```

Y con varios casos:

```javascript
if (stock === 0) {
  estado = "Agotado";
} else if (stock < 5) {
  estado = "Últimas unidades";
} else {
  estado = "Disponible";
}
```

<div class="rule">
  <p class="rule-label">El orden de las ramas es parte de la lógica</p>
  <p>Un <code>else if</code> solo se evalúa si todo lo anterior fue falso. Si pones primero <code>stock &lt; 5</code>, el caso <code>stock === 0</code> no se alcanza nunca, porque el cero también es menor que cinco.</p>
  <p>Ordena siempre de lo más específico a lo más general, y compruébalo con el caso límite: 0, 5, 50, el valor exacto de la frontera.</p>
</div>

### Los límites, uno por uno

Casi todos los errores de condicionales están en la frontera. Para la regla «envío gratis a partir de 50 €», prueba con 49,99, con 50 y con 50,01. Si la regla dice «a partir de», es `>=`. Si dice «más de», es `>`.

| Se dice | Se escribe |
| ------- | ---------- |
| A partir de 50 | `total >= 50` |
| Más de 50 | `total > 50` |
| Hasta 50 | `total <= 50` |
| Entre 10 y 20, incluidos | `n >= 10 && n <= 20` |

Y un aviso: `10 <= n <= 20` **no** hace lo que parece. Se evalúa por partes y acaba comparando un booleano con un número.

### El ternario, para elegir un valor

```javascript
const etiqueta = stock > 0 ? "Disponible" : "Agotado";
```

Sirve cuando el `if` solo elige entre dos valores. Si dentro hay varias instrucciones, o si necesitas anidar ternarios, usa un `if`: se lee mucho mejor.

### `switch`, cuando comparas una cosa contra una lista

```javascript
switch (categoria) {
  case "teclado":
  case "raton":
    garantia = 24;
    break;
  case "monitor":
    garantia = 36;
    break;
  default:
    garantia = 12;
}
```

Compara con el triple igual, así que `"3"` no coincide con `3`. Y si olvidas un `break`, la ejecución sigue cayendo al caso siguiente: es la fuente de errores clásica de esta estructura.

### Tarea 4 · Las reglas de tu proyecto

En `js/main.js`:

1. Escribe en comentarios cuatro reglas de negocio de tu tema, en castellano.
2. Tradúcelas a condicionales.
3. Añade el cálculo de un estado con tres posibles valores.
4. Escribe una tabla de casos límite y comprueba cada uno.
5. Convierte uno de los `if` de dos ramas en un ternario.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Cuatro reglas traducidas, con sus límites comprobados.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade una regla que combine dos condiciones con «y» y otra con «o».</span></div>
  <div><strong>Reto</strong><span>Te dan un <code>if</code> con las ramas en mal orden: encuentra el caso que nunca se alcanza.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 4</p>
  <ul class="checklist">
    <li>Traduces una regla escrita en castellano a una condición correcta.</li>
    <li>Compruebas siempre el valor de la frontera.</li>
    <li>Ordenas las ramas de lo específico a lo general.</li>
    <li>Sabes cuándo un ternario mejora la lectura y cuándo la empeora.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>«Envío gratis a partir de 50 €»: ¿qué operador?</li>
    <li>¿Por qué <code>10 &lt;= n &lt;= 20</code> no funciona?</li>
    <li>¿Qué ocurre si olvidas un <code>break</code> en un <code>switch</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Mayor o igual: el 50 exacto entra.</p>
  <p>2 · Porque se evalúa por partes: la primera comparación da un booleano, y después se compara ese booleano con 20.</p>
  <p>3 · La ejecución continúa en el caso siguiente y se aplican también sus instrucciones.</p>
</details>

---

## Sesión 5 · Bucles

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué bucles existen y cuál corresponde a cada tipo de repetición.</li>
    <li><strong>2. Haz:</strong> Recorre una lista de productos y calcula totales y recuentos.</li>
    <li><strong>3. Comprueba:</strong> Ningún bucle se queda colgado y todos tratan bien la lista vacía.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué cosas repetirías en tu proyecto: mostrar productos, sumar precios, buscar uno?</li>
    <li>¿Cuántas veces se repite cada una: un número fijo, o «hasta que…»?</li>
    <li>¿Qué debería mostrar tu web si la lista está vacía?</li>
  </ol>
</div>

### Las tres formas, y cuándo se usa cada una

```javascript
// Un número conocido de vueltas, con índice
for (let i = 0; i < 5; i++) {
  console.log(`Vuelta ${i}`);
}

// Recorrer los valores de una colección: el que más usarás
for (const producto of productos) {
  console.log(producto);
}

// Repetir mientras se cumpla algo, sin saber cuántas veces
let restante = 100;
while (restante > 0) {
  restante -= 30;
}
```

| Bucle | Úsalo cuando |
| ----- | ------------ |
| `for` clásico | Necesitas el índice, o vas de N en N |
| `for...of` | Solo necesitas cada valor: **el caso normal** |
| `while` | No sabes de antemano cuántas vueltas serán |
| `for...in` | Casi nunca: recorre claves, y trae sorpresas en arrays |

### El acumulador

El patrón que más vas a repetir:

```javascript
const precios = [89.9, 24.5, 199, 12.75];

let total = 0;
for (const precio of precios) {
  total += precio;
}
console.log(total.toFixed(2));   // "326.15"
```

Y el recuento con condición:

```javascript
let baratos = 0;
for (const precio of precios) {
  if (precio < 50) baratos++;
}
```

<div class="rule">
  <p class="rule-label">Un bucle infinito no es un error de sintaxis</p>
  <p>El fichero está bien escrito, el navegador se queda bloqueado y no hay ningún mensaje rojo. Ocurre cuando la condición del <code>while</code> nunca llega a ser falsa, casi siempre porque se olvidó actualizar la variable de control.</p>
  <p>Antes de ejecutar un <code>while</code>, responde a esto: ¿qué línea, dentro del bucle, acerca la condición a hacerse falsa? Si no la encuentras, todavía no ejecutes.</p>
</div>

### Salir antes: `break` y `continue`

```javascript
for (const producto of productos) {
  if (producto.stock === 0) continue;   // salta este y sigue
  if (producto.precio > 500) break;     // deja de recorrer
  console.log(producto.nombre);
}
```

Úsalos con moderación: un bucle con cuatro `break` repartidos es más difícil de seguir que un bucle con una condición bien escrita.

### El caso vacío

```javascript
const productos = [];

for (const producto of productos) {
  console.log(producto);      // no entra ninguna vez, y está bien
}
```

Un bucle sobre una lista vacía no falla: simplemente no se ejecuta. Lo que falla es el programa que da por hecho que había algo:

```javascript
const media = total / productos.length;   // 0 / 0 → NaN
```

### Tarea 5 · Recorrer el catálogo

Con una lista de al menos seis precios de tu tema:

1. Calcula el total y la media, tratando el caso de lista vacía.
2. Cuenta cuántos elementos superan un umbral.
3. Encuentra el más caro sin usar métodos de array todavía.
4. Escribe un bucle que se detenga en el primero que cumpla una condición.
5. Provoca un bucle infinito a propósito, obsérvalo, y explica qué faltaba.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Total, media y recuento correctos, y la lista vacía sin <code>NaN</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Calcula el más caro y el más barato en un solo recorrido.</span></div>
  <div><strong>Reto</strong><span>Recorre dos listas a la vez y detecta qué elementos están en ambas.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 5</p>
  <ul class="checklist">
    <li>Eliges el bucle adecuado y justificas por qué.</li>
    <li>Usas el patrón acumulador con soltura.</li>
    <li>Sabes qué hace que un <code>while</code> termine.</li>
    <li>Tu código no se rompe con una lista vacía.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Cuándo eliges <code>for...of</code> y cuándo un <code>for</code> con índice?</li>
    <li>¿Qué diferencia hay entre <code>break</code> y <code>continue</code>?</li>
    <li>¿Cuánto vale la media de una lista vacía, y qué deberías hacer?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>for...of</code> cuando solo necesitas el valor; el clásico cuando necesitas la posición o un salto distinto de uno.</p>
  <p>2 · <code>break</code> abandona el bucle; <code>continue</code> salta a la vuelta siguiente.</p>
  <p>3 · <code>NaN</code>, porque divides entre cero. Hay que comprobar la longitud antes y devolver 0 o un aviso.</p>
</details>

---

## Sesión 6 · Taller · programas con reglas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se descompone un enunciado en datos, reglas y salida antes de escribir código.</li>
    <li><strong>2. Haz:</strong> Resuelve cuatro problemas completos combinando lo de la semana.</li>
    <li><strong>3. Comprueba:</strong> Cada programa se prueba con casos normales, límite y absurdos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Ante un enunciado nuevo, ¿qué es lo primero que escribes?</li>
    <li>¿Qué tres tipos de caso hay que probar siempre?</li>
    <li>¿Qué diferencia hay entre «no da error» y «está bien»?</li>
  </ol>
</div>

### Antes de escribir código

<figure class="diagram">
  <figcaption>Cómo se ataca un enunciado</figcaption>
  <ol class="flow">
    <li>¿Qué datos entran, y de qué tipo son?</li>
    <li>¿Qué reglas se aplican, y en qué orden?</li>
    <li>¿Qué sale, y en qué formato?</li>
    <li>¿Qué casos raros existen: vacío, cero, negativo, texto?</li>
  </ol>
</figure>

Escribir esas cuatro respuestas cuesta dos minutos y ahorra media hora. Es exactamente el mismo hábito de la UD1, cuando antes de marcar una página decidías qué era cada cosa.

### Un ejemplo resuelto

> **Enunciado.** Dado un carrito con nombres, precios y unidades, calcula el subtotal, aplica un 10 % de descuento si supera 100 €, suma 4,95 € de envío salvo que el subtotal con descuento llegue a 50 €, y muestra el desglose.

Datos: tres listas paralelas de texto y número. Reglas: tres, y **el orden importa** —el descuento se aplica antes de decidir el envío—. Salida: cuatro líneas con dos decimales. Casos raros: carrito vacío, unidades cero, precio negativo.

```javascript
const nombres = ["Teclado", "Ratón", "Alfombrilla"];
const precios = [89.9, 24.5, 12.75];
const unidades = [1, 2, 1];

let subtotal = 0;
for (let i = 0; i < precios.length; i++) {
  subtotal += precios[i] * unidades[i];
}

const descuento = subtotal > 100 ? subtotal * 0.1 : 0;
const conDescuento = subtotal - descuento;
const envio = conDescuento >= 50 ? 0 : 4.95;
const total = conDescuento + envio;

console.log(`Subtotal:  ${subtotal.toFixed(2)} €`);
console.log(`Descuento: ${descuento.toFixed(2)} €`);
console.log(`Envío:     ${envio.toFixed(2)} €`);
console.log(`Total:     ${total.toFixed(2)} €`);
```

Fíjate en que el código se lee casi como el enunciado. Eso no es casualidad: es consecuencia de haberlo descompuesto antes.

### Tarea 6 · Cuatro problemas

Resuelve estos cuatro. Para cada uno, escribe primero las cuatro respuestas de la descomposición:

1. **Escalonado.** Un descuento por unidades: hasta 3, nada; de 4 a 9, un 5 %; de 10 en adelante, un 12 %. Comprueba 3, 4, 9 y 10.
2. **Validador.** Dada una entrada de texto, decide si es un precio válido: número, positivo, con dos decimales como mucho.
3. **Resumen.** Dado un catálogo con precios y stock, calcula el valor total del almacén, cuántos productos están agotados y cuál es el más caro disponible.
4. **Etiquetado.** Genera para cada producto una etiqueta de texto que combine su estado de stock y su franja de precio.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Los dos primeros resueltos y probados con sus límites.</span></div>
  <div><strong>Si lo tienes</strong><span>Los cuatro, con el caso de catálogo vacío tratado.</span></div>
  <div><strong>Reto</strong><span>Intercambia el enunciado 4 con un compañero y resuelve el suyo sin preguntar nada.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 2</p>
  <ul class="checklist">
    <li>Traduces reglas de negocio a condicionales, con sus límites comprobados.</li>
    <li>Recorres colecciones con el bucle adecuado.</li>
    <li>Descompones un enunciado antes de escribir la primera línea.</li>
    <li>Pruebas con casos normales, límite y absurdos.</li>
  </ul>
</div>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 2 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Traduce a una condición: «el envío es gratis a partir de 50 €». Di qué ocurre con 50 exactos.</li>
    <li>Escribe el bucle que suma una lista de precios, y di qué devuelve con la lista vacía.</li>
    <li>Un <code>while</code> no termina nunca: nombra la causa más probable y cómo la comprobarías.</li>
  </ol>
</div>
---

## Semana 3 · Funciones y depuración

---

## Sesión 7 · Funciones

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es una función, qué son parámetros y retorno, y qué es el ámbito.</li>
    <li><strong>2. Haz:</strong> Convierte el código de la semana pasada en funciones reutilizables.</li>
    <li><strong>3. Comprueba:</strong> Cada función devuelve un valor y no imprime nada.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En tu código de la semana pasada, ¿qué trozo has escrito más de una vez?</li>
    <li>Si mañana cambia el porcentaje de IVA, ¿cuántos sitios tendrías que tocar?</li>
    <li>¿Qué es «devolver» un valor?</li>
  </ol>
</div>

### Declarar y llamar

```javascript
function calcularIva(base, tipo) {
  return base * (1 + tipo);
}

const conIva = calcularIva(89.9, 0.21);
```

Tres piezas: el **nombre**, que dice qué hace; los **parámetros**, que son lo que necesita; y el **retorno**, que es lo que produce.

<div class="rule">
  <p class="rule-label">Una función devuelve; no imprime</p>
  <p>Una función que hace <code>console.log</code> en lugar de <code>return</code> solo sirve para lo que estás haciendo hoy. La que devuelve un valor sirve para imprimirlo, para sumarlo, para pintarlo en la UD4 y para enviarlo al servidor en la UD6.</p>
  <p>Regla del módulo: las funciones calculan y devuelven; imprimir es cosa de quien las llama.</p>
</div>

### Valores por defecto y número de argumentos

```javascript
function calcularIva(base, tipo = 0.21) {
  return base * (1 + tipo);
}

calcularIva(100);        // 121
calcularIva(100, 0.10);  // 110
```

JavaScript no protesta si llamas con menos argumentos de los declarados: el que falta vale `undefined`, y el cálculo acaba en `NaN`. Los valores por defecto evitan la mitad de esos casos.

### Ámbito: dónde vive cada variable

```javascript
const iva = 0.21;                 // global del módulo

function total(base) {
  const impuestos = base * iva;   // ve el de fuera
  return base + impuestos;
}

console.log(impuestos);           // ReferenceError: no existe aquí
```

Lo declarado dentro de una función solo existe dentro. Lo de fuera se ve desde dentro. Y eso es bueno: si todo fuera global, dos funciones que usan `i` se pisarían.

<p class="term">Ámbito de bloque</p>

`let` y `const` viven dentro de las llaves donde se declaran, incluidas las de un `if` o un `for`. Es otra razón para no usar `var`, que se escapa del bloque.

### Funciones pequeñas, con un cometido

```javascript
// Difícil de probar y de reutilizar
function procesar(carrito) { /* 60 líneas */ }

// Tres funciones que se leen y se prueban por separado
function calcularSubtotal(carrito) { }
function aplicarDescuento(subtotal) { }
function calcularEnvio(importe) { }
```

Una señal fiable: si al describir qué hace una función necesitas la palabra «y» dos veces, probablemente son dos funciones.

### Tarea 7 · Refactoriza en funciones

Sobre tu solución de la sesión 6:

1. Extrae `calcularSubtotal`, `aplicarDescuento` y `calcularEnvio`.
2. Que ninguna imprima: todas devuelven.
3. Escribe una función `formatearPrecio(valor)` que devuelva el texto con dos decimales y el símbolo del euro.
4. Añade valores por defecto a los parámetros que los admitan.
5. Comprueba cada función por separado con tres entradas distintas.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Cuatro funciones que devuelven, probadas una a una.</span></div>
  <div><strong>Si lo tienes</strong><span>Escribe una función que reciba otra función como parámetro y aplíquela a una lista.</span></div>
  <div><strong>Reto</strong><span>Reduce tu programa principal a cinco líneas que solo llamen a funciones.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 7</p>
  <ul class="checklist">
    <li>Tus funciones devuelven valores y no imprimen.</li>
    <li>Sabes qué ocurre si llamas con menos argumentos.</li>
    <li>Explicas por qué una variable de dentro no se ve desde fuera.</li>
    <li>Cada función hace una sola cosa.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué devuelve una función que no tiene <code>return</code>?</li>
    <li>¿Por qué preferimos devolver a imprimir?</li>
    <li>¿Qué es un parámetro por defecto?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>undefined</code>.</p>
  <p>2 · Porque el valor devuelto se puede reutilizar: imprimir es solo una de las cosas que se pueden hacer con él.</p>
  <p>3 · Un valor que toma el parámetro cuando quien llama no lo proporciona.</p>
</details>

---

## Sesión 8 · Funciones flecha y funciones como valor

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> La sintaxis de flecha, y la idea de que una función es un valor más.</li>
    <li><strong>2. Haz:</strong> Escribe funciones que reciben funciones, la base de lo que viene en la semana 4.</li>
    <li><strong>3. Comprueba:</strong> Lees sin dudar una función flecha escrita por otra persona.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Puede una variable guardar una función?</li>
    <li>Si pudieras pasarle a un filtro «la regla» como parámetro, ¿qué te ahorraría?</li>
    <li>¿Qué significa que algo se ejecute «más tarde»?</li>
  </ol>
</div>

### La misma función, tres formas

```javascript
// Declaración
function doble(n) {
  return n * 2;
}

// Expresión guardada en una variable
const doble2 = function (n) {
  return n * 2;
};

// Función flecha
const doble3 = (n) => n * 2;
```

La flecha con una sola expresión **devuelve esa expresión** sin escribir `return`. Con llaves, vuelve a hacer falta:

```javascript
const etiquetar = (producto) => {
  const estado = producto.stock > 0 ? "Disponible" : "Agotado";
  return `${producto.nombre} · ${estado}`;
};
```

### Una función es un valor

Esta es la idea que abre la semana 4:

```javascript
const operaciones = {
  suma: (a, b) => a + b,
  resta: (a, b) => a - b
};

operaciones.suma(2, 3);    // 5
```

Y puede pasarse como argumento:

```javascript
function aplicarATodos(lista, transformar) {
  const resultado = [];
  for (const elemento of lista) {
    resultado.push(transformar(elemento));
  }
  return resultado;
}

aplicarATodos([1, 2, 3], (n) => n * 10);   // [10, 20, 30]
```

Acabas de escribir a mano lo que la semana que viene hará `map`. Merece la pena haberlo escrito una vez: después, `map` deja de ser magia.

<p class="term">Callback</p>

Una función que se le pasa a otra para que la llame ella. En la UD4 será «lo que hay que hacer cuando el usuario pulse»; en la UD6, «lo que hay que hacer cuando llegue la respuesta».

### Cuándo usar cada forma

| Forma | Úsala para |
| ----- | ---------- |
| Declaración `function` | Funciones con nombre del programa, sobre todo si son largas |
| Flecha | Funciones cortas que se pasan como argumento |

No mezcles por gusto: dentro de un mismo fichero, mantén un criterio.

### Tarea 8 · Funciones que reciben funciones

1. Reescribe tres de tus funciones de la sesión 7 como flechas y comprueba que siguen dando lo mismo.
2. Escribe `aplicarATodos` y úsala para subir un 10 % todos los precios.
3. Escribe `filtrarPor(lista, condicion)` y úsala con dos condiciones distintas.
4. Escribe `contarSi(lista, condicion)`.
5. Guarda tres reglas de negocio en un objeto de funciones y llámalas por su nombre.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span><code>aplicarATodos</code> y <code>filtrarPor</code> funcionando con dos reglas distintas.</span></div>
  <div><strong>Si lo tienes</strong><span>Escribe <code>reducir(lista, combinar, inicial)</code>.</span></div>
  <div><strong>Reto</strong><span>Encadena tus tres funciones para responder a una pregunta compuesta sobre el catálogo.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 8</p>
  <ul class="checklist">
    <li>Lees y escribes funciones flecha con y sin llaves.</li>
    <li>Entiendes que una función puede guardarse y pasarse.</li>
    <li>Has escrito tu propia versión de <code>map</code> y de <code>filter</code>.</li>
    <li>Sabes qué es un callback.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué devuelve <code>(n) =&gt; n * 2</code>?</li>
    <li>¿Y <code>(n) =&gt; { n * 2 }</code>?</li>
    <li>¿Qué es un callback?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El doble de <code>n</code>: con una sola expresión, el retorno es implícito.</p>
  <p>2 · <code>undefined</code>: al poner llaves hace falta un <code>return</code> explícito. Es un fallo muy habitual.</p>
  <p>3 · Una función que se pasa a otra para que la llame cuando corresponda.</p>
</details>

---

## Sesión 9 · Depurar con criterio

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Los cuatro tipos de error, y cómo se para un programa para mirar dentro.</li>
    <li><strong>2. Haz:</strong> Depura tres programas rotos que no puedes reescribir.</li>
    <li><strong>3. Comprueba:</strong> Encuentras la causa antes de tocar el código.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué haces ahora mismo cuando algo no funciona?</li>
    <li>¿Cuántas veces has cambiado código sin saber por qué funcionaba?</li>
    <li>¿Qué información te daría más que un mensaje de error?</li>
  </ol>
</div>

### Los cuatro tipos de error

| Tipo | Qué es | Ejemplo |
| ---- | ------ | ------- |
| Sintaxis | El código no se puede leer | Falta una llave o un paréntesis |
| Referencia | Usas un nombre que no existe | Una variable mal escrita |
| Tipo | Llamas a algo que no es lo que crees | `productos.filtrar is not a function` |
| Lógico | **No hay error**, pero el resultado está mal | El total sale mal, y nadie protesta |

Los tres primeros los encuentra el navegador. El cuarto solo lo encuentras tú, y es el que de verdad importa.

### La consola, más allá de `console.log`

```javascript
console.log(producto);            // lo normal
console.table(productos);         // una lista de objetos, en tabla
console.warn("Stock bajo");       // aviso
console.error("Precio inválido"); // error
console.log({ subtotal, envio, total });   // nombre y valor de cada uno
```

El último truco vale su peso en oro: envolviendo las variables en llaves, la consola imprime **el nombre junto al valor**, y se acabaron los seis números sueltos que no sabes de quién son.

### Puntos de interrupción

`console.log` te dice el valor en un punto. Un punto de interrupción te deja **parar el programa** y mirarlo todo a la vez.

<figure class="diagram">
  <figcaption>Depurar en el navegador</figcaption>
  <ol class="flow">
    <li>Pestaña Sources y abre tu fichero</li>
    <li>Clic en el número de línea: punto de interrupción</li>
    <li>Recarga: la ejecución se detiene ahí</li>
    <li>Mira Scope: todas las variables y sus valores</li>
    <li>Avanza paso a paso y observa qué cambia</li>
  </ol>
</figure>

También puedes escribir `debugger;` en el código: con DevTools abierto, el programa se detiene en esa línea.

<div class="rule">
  <p class="rule-label">Depurar es reducir el trozo sospechoso, no cambiar cosas</p>
  <p>El método es siempre el mismo: <strong>qué esperabas, qué ocurre, dónde deja de coincidir</strong>. Pon una comprobación a la mitad del recorrido. Si ahí ya está mal, el problema está antes; si está bien, está después. Cada comprobación divide el terreno en dos.</p>
  <p>Cambiar líneas a ver si suena la flauta puede arreglar el síntoma de hoy y dejar la causa dentro.</p>
</div>

### Tarea 9 · Tres programas rotos

Recibirás tres ficheros con un fallo cada uno: uno de referencia, uno de tipo y uno lógico. Para cada uno:

1. Escribe qué debería hacer el programa.
2. Ejecútalo y anota qué hace en realidad.
3. Localiza con un punto de interrupción la primera línea donde el valor deja de ser el esperado.
4. Explica la causa **antes** de corregir.
5. Corrige con el cambio más pequeño posible.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Los tres localizados, con la causa escrita antes del arreglo.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade a cada programa una comprobación que hubiera detectado el fallo.</span></div>
  <div><strong>Reto</strong><span>Rompe tu propio código de forma sutil, dáselo a un compañero y cronometra.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 3</p>
  <ul class="checklist">
    <li>Tu programa está hecho de funciones pequeñas que devuelven valores.</li>
    <li>Sabes pasar una función como argumento.</li>
    <li>Usas puntos de interrupción, no solo <code>console.log</code>.</li>
    <li>Explicas la causa de un fallo antes de corregirlo.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Sintaxis, referencia, tipo y lógico. El lógico es el peligroso porque no avisa.</p>
  <p>2 · Envolviendo las variables en llaves dentro del <code>console.log</code>, para ver el nombre junto al valor.</p>
  <p>3 · Preguntarse qué se esperaba, qué ocurre, y dónde deja de coincidir; después, dividir el recorrido en dos.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 3 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Escribe una función que reciba una base y un tipo de IVA y devuelva el total. Sin imprimir nada.</li>
    <li>¿Qué devuelve <code>(n) =&gt; n * 2</code>? ¿Y <code>(n) =&gt; { n * 2 }</code>?</li>
    <li>Un total sale mal y la consola no muestra ningún error. Describe los dos primeros pasos que darías.</li>
  </ol>
</div>
---

## Semana 4 · Arrays y objetos

---

## Sesión 10 · Arrays

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se guarda una lista, cómo se accede a sus elementos y cómo se modifica.</li>
    <li><strong>2. Haz:</strong> Construye la lista de productos de tu catálogo y opera sobre ella.</li>
    <li><strong>3. Comprueba:</strong> Distingues los métodos que modifican el array de los que devuelven uno nuevo.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En la sesión 6 usaste tres listas paralelas. ¿Qué problema tiene eso?</li>
    <li>¿Cómo pedirías «el tercer producto»?</li>
    <li>¿Qué pasa si pides el elemento número cien de una lista de tres?</li>
  </ol>
</div>

### Una lista ordenada de valores

```javascript
const categorias = ["teclados", "ratones", "monitores"];

categorias[0]           // "teclados"   ← se empieza a contar en cero
categorias.length       // 3
categorias[2]           // "monitores"
categorias[99]          // undefined    ← no da error
categorias.at(-1)       // "monitores"  ← el último, sin calcular índices
```

Que pedir un índice inexistente devuelva `undefined` en lugar de fallar es cómodo y peligroso a partes iguales: el programa sigue, y el `undefined` viaja hasta reventar tres funciones más allá.

### Añadir, quitar y buscar

```javascript
const lista = ["teclados", "ratones"];

lista.push("monitores");      // añade al final       → 3
lista.pop();                  // quita el último      → "monitores"
lista.unshift("cables");      // añade al principio
lista.shift();                // quita el primero

lista.includes("ratones");    // true
lista.indexOf("ratones");     // 1, o -1 si no está
```

### Los que modifican y los que no

<div class="rule">
  <p class="rule-label">Distingue mutar de devolver</p>
  <p>Algunos métodos <strong>cambian el array original</strong> —<code>push</code>, <code>pop</code>, <code>splice</code>, <code>sort</code>, <code>reverse</code>— y otros <strong>devuelven uno nuevo</strong> sin tocarlo: <code>slice</code>, <code>concat</code>, <code>map</code>, <code>filter</code>.</p>
  <p>El error clásico: ordenar «una copia» que en realidad era el mismo array, y descubrir después que el catálogo original quedó desordenado para todo el programa. Ante la duda, copia primero.</p>
</div>

```javascript
const original = [3, 1, 2];

const ordenado = [...original].sort();   // copia y ordena la copia
original;                                // [3, 1, 2], intacto
```

Los tres puntos, el operador de propagación, copian los elementos en un array nuevo.

### Recorrer con `forEach`

```javascript
categorias.forEach((categoria, indice) => {
  console.log(`${indice + 1}. ${categoria}`);
});
```

`forEach` recorre y no devuelve nada: sirve para «haz algo con cada uno». Cuando lo que quieres es **obtener** otra lista, el método es `map`, que viene en la sesión siguiente.

### Tarea 10 · El catálogo como lista

Crea `js/datos.js`:

1. Declara un array con al menos ocho nombres de producto de tu tema.
2. Otro con sus precios, en el mismo orden.
3. Escribe funciones para añadir, quitar y buscar un producto.
4. Ordena una copia por precio sin alterar el original, y demuéstralo.
5. Escribe una función que devuelva los tres primeros.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las operaciones básicas funcionando, y el original intacto tras ordenar.</span></div>
  <div><strong>Si lo tienes</strong><span>Escribe una función que devuelva un array sin duplicados.</span></div>
  <div><strong>Reto</strong><span>Explica por qué mantener dos arrays paralelos es mala idea, con un ejemplo de cómo se desincronizan.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 10</p>
  <ul class="checklist">
    <li>Accedes a los elementos por índice y conoces <code>length</code>.</li>
    <li>Distingues los métodos que mutan de los que devuelven.</li>
    <li>Copias un array antes de ordenarlo.</li>
    <li>Sabes que un índice inexistente da <code>undefined</code>, no un error.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué índice tiene el primer elemento?</li>
    <li>Nombra dos métodos que muten y dos que no.</li>
    <li>¿Qué hace <code>[...lista]</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El cero.</p>
  <p>2 · Mutan <code>push</code> y <code>sort</code>; no mutan <code>slice</code> y <code>map</code>.</p>
  <p>3 · Crea un array nuevo con los mismos elementos: una copia superficial.</p>
</details>

---

## Sesión 11 · Métodos declarativos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> <code>map</code>, <code>filter</code>, <code>find</code>, <code>some</code>, <code>every</code>, <code>sort</code> y <code>reduce</code>.</li>
    <li><strong>2. Haz:</strong> Sustituye tus bucles por métodos y compara la legibilidad.</li>
    <li><strong>3. Comprueba:</strong> Eliges el método por lo que devuelve, no por costumbre.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En la sesión 8 escribiste <code>aplicarATodos</code> y <code>filtrarPor</code>. ¿Qué devolvía cada una?</li>
    <li>¿Qué diferencia hay entre «quiero los caros» y «quiero el primero caro»?</li>
    <li>¿Y entre «quiero saber si hay alguno caro» y «quiero los caros»?</li>
  </ol>
</div>

### Cada método devuelve una cosa distinta

| Método | Devuelve | Pregunta que responde |
| ------ | -------- | --------------------- |
| `map` | Un array del mismo tamaño | «Transforma cada uno» |
| `filter` | Un array más corto | «Quédate con los que cumplan» |
| `find` | Un elemento, o `undefined` | «Dame el primero que cumpla» |
| `findIndex` | Una posición, o `-1` | «¿En qué posición está?» |
| `some` | `true` o `false` | «¿Hay alguno que cumpla?» |
| `every` | `true` o `false` | «¿Cumplen todos?» |
| `sort` | El array ordenado | «Ponlos en este orden» |
| `reduce` | Un solo valor | «Combínalos todos en uno» |

<div class="rule">
  <p class="rule-label">Elige por lo que necesitas recibir</p>
  <p>La mitad de los errores con estos métodos son de elección, no de escritura: usar <code>filter</code> y quedarse con <code>[0]</code> cuando lo que se quería era <code>find</code>, o usar <code>find</code> esperando una lista.</p>
  <p>Pregúntate qué quieres tener después: ¿otra lista, un elemento, un sí o un no, o un número?</p>
</div>

### En código

```javascript
const productos = [
  { nombre: "Teclado", precio: 89.9, stock: 4 },
  { nombre: "Ratón", precio: 24.5, stock: 0 },
  { nombre: "Monitor", precio: 199, stock: 7 }
];

const nombres = productos.map((p) => p.nombre);
const disponibles = productos.filter((p) => p.stock > 0);
const caro = productos.find((p) => p.precio > 100);
const hayAgotados = productos.some((p) => p.stock === 0);
const todosBaratos = productos.every((p) => p.precio < 500);
```

### `sort` y su trampa

```javascript
[10, 9, 100].sort();                  // [10, 100, 9]  ← compara como texto
[10, 9, 100].sort((a, b) => a - b);   // [9, 10, 100]
```

Sin función de comparación, `sort` convierte a texto. Con números hay que pasarla siempre: `a - b` ascendente, `b - a` descendente. Y para textos con acentos y mayúsculas:

```javascript
productos.sort((a, b) => a.nombre.localeCompare(b.nombre));
```

Recuerda además que `sort` **muta**: ordena sobre una copia si el orden original importa.

### `reduce`, el que da más miedo

```javascript
const total = productos.reduce((suma, p) => suma + p.precio * p.stock, 0);
```

Se lee así: empieza con `0`, y por cada producto, quédate con lo que llevabas más lo que aporta este. Es el acumulador de la sesión 5, escrito en una línea. Si te cuesta leerlo, escríbelo primero con `for...of` y tradúcelo después.

### Encadenar

```javascript
const resumen = productos
  .filter((p) => p.stock > 0)
  .sort((a, b) => a.precio - b.precio)
  .map((p) => `${p.nombre}: ${p.precio.toFixed(2)} €`);
```

Cada método devuelve un array, así que el siguiente puede trabajar sobre él. Se lee de arriba abajo como una frase: filtra, ordena, formatea. Con `sort` en medio, ojo: aquí es seguro porque `filter` ya devolvió un array nuevo.

### Tarea 11 · Consultas del catálogo

En `js/catalogo.js`, sobre tu lista de productos:

1. `nombresDisponibles(productos)` con `filter` y `map`.
2. `buscarPorNombre(productos, texto)` con `find`, sin distinguir mayúsculas.
3. `hayAgotados(productos)` con `some`.
4. `valorAlmacen(productos)` con `reduce`.
5. `ordenarPorPrecio(productos, ascendente)` que no mute el original.
6. Reescribe dos de tus bucles de la semana 2 con estos métodos y comenta cuál se lee mejor.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las cinco funciones, cada una con el método adecuado.</span></div>
  <div><strong>Si lo tienes</strong><span>Una consulta encadenada que responda a una pregunta compuesta.</span></div>
  <div><strong>Reto</strong><span>Agrupa los productos por categoría usando <code>reduce</code>.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 11</p>
  <ul class="checklist">
    <li>Eliges el método por lo que devuelve.</li>
    <li>Pasas función de comparación a <code>sort</code> con números.</li>
    <li>Encadenas dos o tres métodos y lo lees como una frase.</li>
    <li>Sabes traducir un <code>reduce</code> a un bucle y al revés.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué devuelve <code>find</code> si no encuentra nada?</li>
    <li>¿Por qué <code>[10, 9, 100].sort()</code> da un orden raro?</li>
    <li>¿Qué diferencia hay entre <code>some</code> y <code>filter</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · <code>undefined</code>, y hay que comprobarlo antes de usar el resultado.</p>
  <p>2 · Porque sin comparador ordena como texto, y <code>"100"</code> va antes que <code>"9"</code>.</p>
  <p>3 · <code>some</code> devuelve un booleano; <code>filter</code>, un array con los que cumplen.</p>
</details>

---

## Sesión 12 · Objetos y JSON

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se modela una entidad con un objeto, y qué es JSON.</li>
    <li><strong>2. Haz:</strong> Sustituye tus arrays paralelos por un array de objetos.</li>
    <li><strong>3. Comprueba:</strong> Tu catálogo es una sola estructura, y sabes convertirla a texto y de vuelta.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si borras el tercer nombre pero no el tercer precio, ¿qué ocurre?</li>
    <li>¿Cómo guardarías juntos los datos de un mismo producto?</li>
    <li>¿En qué formato crees que viajan los datos por internet?</li>
  </ol>
</div>

### Un objeto agrupa datos con nombre

```javascript
const producto = {
  id: 1,
  nombre: "Teclado mecánico",
  precio: 89.9,
  categoria: "teclados",
  stock: 4,
  activo: true
};

producto.nombre           // "Teclado mecánico"
producto["precio"]        // 89.9, útil cuando la clave es una variable
producto.color            // undefined
```

Y un catálogo es un array de objetos:

```javascript
const catalogo = [
  { id: 1, nombre: "Teclado", precio: 89.9, stock: 4 },
  { id: 2, nombre: "Ratón", precio: 24.5, stock: 0 }
];
```

Esta es la estructura que vas a usar durante el resto del módulo: en la UD4 la pintarás en la página, en la UD5 la guardarás en un fichero y en la UD6 la servirá tu API.

### Modificar, añadir y borrar propiedades

```javascript
producto.stock = 3;              // modificar
producto.descuento = 0.1;        // añadir
delete producto.descuento;       // borrar

Object.keys(producto);           // ["id", "nombre", "precio", ...]
Object.values(producto);
Object.entries(producto);        // pares [clave, valor]
```

<div class="rule">
  <p class="rule-label">Una <code>const</code> con un objeto sí se puede modificar por dentro</p>
  <p><code>const</code> protege <strong>la asignación</strong>, no el contenido. Puedes cambiar las propiedades de un objeto declarado con <code>const</code>; lo que no puedes es apuntarlo a otro objeto distinto.</p>
  <p>De ahí sale otro clásico: dos variables que apuntan al mismo objeto. Modificar una cambia «las dos», porque siempre fue una. Para copiar de verdad: <code>{ ...producto }</code>.</p>
</div>

### Anidar y acceder con seguridad

```javascript
const pedido = {
  id: 1001,
  cliente: { nombre: "Ana", email: "ana@ejemplo.com" },
  lineas: [{ producto: "Teclado", unidades: 1 }]
};

pedido.cliente.nombre            // "Ana"
pedido.lineas[0].unidades        // 1
pedido.envio.direccion           // TypeError: no se puede leer de undefined
pedido.envio?.direccion          // undefined, sin romper nada
```

El interrogante es el **encadenamiento opcional**: si lo de la izquierda no existe, devuelve `undefined` en lugar de lanzar un error. Es el remedio a un fallo que verás mucho al consumir datos ajenos.

### Desestructurar

```javascript
const { nombre, precio } = producto;
const [primero, segundo] = catalogo;

function describir({ nombre, precio }) {
  return `${nombre} · ${precio.toFixed(2)} €`;
}
```

Sacar las propiedades que necesitas y darles nombre. Ahorra repetir `producto.` diez veces y hace explícito qué usa cada función.

### JSON, el formato de intercambio

<p class="term">JSON</p>

Un formato de texto para representar datos, nacido de la sintaxis de los objetos de JavaScript pero independiente de él: lo entienden Java, Python, PHP y cualquier otro lenguaje. Es como viajan los datos entre un navegador y un servidor.

```javascript
const texto = JSON.stringify(producto);          // objeto → texto
const texto2 = JSON.stringify(producto, null, 2); // con sangría, legible
const recuperado = JSON.parse(texto);            // texto → objeto
```

Sus reglas son más estrictas que las de JavaScript:

```json
{
  "nombre": "Teclado mecánico",
  "precio": 89.9,
  "stock": 4,
  "activo": true,
  "etiquetas": ["mecánico", "retroiluminado"]
}
```

Las claves van **siempre entre comillas dobles**, no se admiten comillas simples, ni comas finales, ni comentarios, ni funciones, ni `undefined`. Y `JSON.parse` de un texto mal formado lanza un error: en la sesión 14 lo trataremos como se debe.

### Tarea 12 · El catálogo de verdad

Reescribe `js/datos.js`:

1. Convierte tus arrays paralelos en un array de al menos ocho objetos, con `id`, `nombre`, `precio`, `categoria`, `stock` y `descripcion`.
2. Adapta las funciones de la sesión 11 a la nueva estructura.
3. Escribe `describir(producto)` usando desestructuración en el parámetro.
4. Convierte el catálogo a JSON con sangría y obsérvalo.
5. Vuelve a convertirlo a objeto y comprueba que todo sigue igual.
6. Rompe el JSON a propósito y observa el error de `JSON.parse`.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Catálogo de objetos, funciones adaptadas y conversión de ida y vuelta.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade una propiedad anidada y accede a ella con encadenamiento opcional.</span></div>
  <div><strong>Reto</strong><span>Escribe una función que devuelva una copia del catálogo con todos los precios subidos un 5 %, sin tocar el original.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 4</p>
  <ul class="checklist">
    <li>Tu catálogo es un array de objetos, no listas paralelas.</li>
    <li>Consultas ese catálogo con métodos declarativos.</li>
    <li>Sabes copiar un objeto y por qué hace falta.</li>
    <li>Conviertes a JSON y desde JSON, y sabes qué reglas tiene.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Sí: <code>const</code> impide reasignar la variable, no modificar el objeto al que apunta.</p>
  <p>2 · Las claves entre comillas dobles, sin comas finales, sin comentarios y sin funciones.</p>
  <p>3 · Lanza un <code>SyntaxError</code>, que hay que capturar.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 4 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Di qué método usarías para: los productos caros, el primero caro, saber si hay alguno caro, y el valor total del almacén.</li>
    <li>Ordena una lista de números de menor a mayor sin alterar la original.</li>
    <li>Escribe el JSON de un producto con tres campos, respetando sus reglas.</li>
  </ol>
</div>
---

## Semana 5 · Organizar y proteger el código

---

## Sesión 13 · Módulos ES

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se reparte el código en ficheros con <code>import</code> y <code>export</code>.</li>
    <li><strong>2. Haz:</strong> Separa datos, lógica y programa principal en tres módulos.</li>
    <li><strong>3. Comprueba:</strong> Todo funciona servido por un servidor local, y sabes por qué hace falta.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántas líneas tiene ya tu fichero principal?</li>
    <li>Si otro proyecto quisiera tus funciones de catálogo, ¿qué le pasarías?</li>
    <li>¿Qué partes de tu código son «datos», cuáles «reglas» y cuáles «uso»?</li>
  </ol>
</div>

### Exportar e importar

```javascript
// js/datos.js
export const catalogo = [ /* ... */ ];
export const IVA = 0.21;
```

```javascript
// js/catalogo.js
import { catalogo, IVA } from "./datos.js";

export function disponibles(productos = catalogo) {
  return productos.filter((p) => p.stock > 0);
}

export function valorAlmacen(productos = catalogo) {
  return productos.reduce((suma, p) => suma + p.precio * p.stock, 0);
}
```

```javascript
// js/main.js
import { disponibles, valorAlmacen } from "./catalogo.js";

console.table(disponibles());
console.log(valorAlmacen().toFixed(2));
```

Y en el documento, un único enlace, con el tipo declarado:

```html
<script type="module" src="js/main.js"></script>
```

Con `type="module"` no hace falta `defer`: los módulos ya se ejecutan al final. Y solo se enlaza el principal: los demás llegan por sus `import`.

### Dos detalles que hacen perder una tarde

<div class="rule">
  <p class="rule-label">La extensión se escribe, y hace falta un servidor</p>
  <p>En el navegador, la ruta del <code>import</code> lleva su <code>.js</code>: <code>"./catalogo.js"</code>, no <code>"./catalogo"</code>. Y empieza por <code>./</code> o por <code>/</code>.</p>
  <p>Además, los módulos <strong>no funcionan abriendo el fichero con doble clic</strong>. Verás un error de CORS con el esquema <code>file://</code>. Hay que servir la carpeta: la extensión Live Server de VS Code, o el servidor que montarás tú mismo en la UD5.</p>
</div>

### Exportación por defecto

```javascript
export default function formatearPrecio(valor) {
  return `${valor.toFixed(2)} €`;
}
```

```javascript
import formatearPrecio from "./formato.js";
```

Un módulo puede tener una exportación por defecto y muchas con nombre. En este módulo preferimos las nombradas: el nombre viaja con la función y no se puede renombrar sin querer.

### Qué va en cada fichero

<figure class="diagram">
  <figcaption>El reparto de responsabilidades</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>datos.js · qué hay</li>
    <li>catalogo.js · qué se puede preguntar</li>
    <li>main.js · qué hacemos hoy con ello</li>
  </ol>
</figure>

Es el mismo criterio de siempre: cada fichero responde a una pregunta. Y anticipa la separación en capas que verás en la UD6 y en el módulo de servidor.

### Tarea 13 · Tres módulos

1. Separa tu código en `datos.js`, `catalogo.js` y `main.js`.
2. Exporta solo lo que se use fuera; el resto, privado del módulo.
3. Añade `formato.js` con las funciones de presentación de texto.
4. Enlaza únicamente `main.js` con `type="module"`.
5. Sirve la carpeta con un servidor local y comprueba que funciona.
6. Provoca a propósito un import con la extensión olvidada y lee el error.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres módulos, un solo enlace, y todo funcionando bajo un servidor local.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade un cuarto módulo de validación y úsalo desde <code>catalogo.js</code>.</span></div>
  <div><strong>Reto</strong><span>Dibuja el grafo de dependencias de tu proyecto y comprueba que no hay ciclos.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 13</p>
  <ul class="checklist">
    <li>Tu código está repartido en módulos con una responsabilidad cada uno.</li>
    <li>Solo enlazas el módulo principal, con <code>type="module"</code>.</li>
    <li>Escribes la extensión en las rutas de importación.</li>
    <li>Sabes por qué los módulos necesitan un servidor.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué error verás si abres el fichero con doble clic?</li>
    <li>¿Cuántos módulos enlazas en el documento?</li>
    <li>¿Qué diferencia hay entre exportación nombrada y por defecto?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Un error de CORS por el esquema <code>file://</code>: los módulos exigen que la página se sirva por HTTP.</p>
  <p>2 · Uno: el principal. Los demás entran por sus importaciones.</p>
  <p>3 · La nombrada se importa entre llaves y con su nombre exacto; la de defecto se importa con el nombre que quieras.</p>
</details>

---

## Sesión 14 · Errores y programación defensiva

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se lanza, se captura y se trata un error.</li>
    <li><strong>2. Haz:</strong> Protege tus funciones de las entradas que no esperas.</li>
    <li><strong>3. Comprueba:</strong> Tu programa falla de forma clara en vez de dar un resultado falso.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué le pasa a <code>valorAlmacen</code> si un producto no tiene precio?</li>
    <li>¿Qué es peor: que el programa se pare, o que devuelva un número equivocado?</li>
    <li>¿De dónde vienen los datos en los que menos confías?</li>
  </ol>
</div>

### Lanzar un error

```javascript
function aplicarDescuento(precio, porcentaje) {
  if (typeof precio !== "number" || Number.isNaN(precio)) {
    throw new TypeError("El precio debe ser un número");
  }
  if (porcentaje < 0 || porcentaje > 100) {
    throw new RangeError("El porcentaje debe estar entre 0 y 100");
  }
  return precio * (1 - porcentaje / 100);
}
```

`throw` detiene la función ahí mismo. Es mejor que devolver `null` en silencio: quien llama se entera del problema en el momento en que ocurre y no tres funciones más tarde.

### Capturar

```javascript
try {
  const catalogo = JSON.parse(textoRecibido);
  console.log(catalogo.length);
} catch (error) {
  console.error(`No se pudo leer el catálogo: ${error.message}`);
} finally {
  console.log("Intento terminado");
}
```

`try` ejecuta, `catch` recibe el error si lo hay, `finally` se ejecuta pase lo que pase.

<div class="rule">
  <p class="rule-label">Un <code>catch</code> vacío es peor que ningún <code>catch</code></p>
  <p>Capturar un error y no hacer nada con él —ni registrarlo, ni avisar, ni reintentar— convierte un fallo ruidoso en uno invisible. El programa continúa con datos que no tiene, y el problema aparecerá más adelante, en un sitio que no tiene nada que ver.</p>
  <p>Captura solo lo que sabes tratar. Lo que no sepas tratar, déjalo subir.</p>
</div>

### Validar en el borde

```javascript
export function crearProducto(datos) {
  const errores = [];

  if (!datos.nombre?.trim()) errores.push("El nombre es obligatorio");
  const precio = Number(datos.precio);
  if (Number.isNaN(precio) || precio < 0) errores.push("Precio inválido");
  const stock = Number.parseInt(datos.stock, 10);
  if (!Number.isInteger(stock) || stock < 0) errores.push("Stock inválido");

  if (errores.length > 0) {
    return { ok: false, errores };
  }
  return { ok: true, producto: { nombre: datos.nombre.trim(), precio, stock } };
}
```

Fíjate en dos decisiones. Primero, se recogen **todos** los errores y no solo el primero: en la UD4 querrás enseñárselos todos al usuario a la vez. Y segundo, la función devuelve un resultado que describe qué pasó, en lugar de lanzar: para una validación esperable, un error no es excepcional.

<p class="term">Validar en el borde</p>

Comprobar los datos en el punto donde entran al programa —el formulario, el fichero, la respuesta del servidor— y no dentro de cada función que los usa. Después de ese punto, el resto del código puede confiar.

### Tarea 14 · Blinda tu catálogo

1. Añade validación a `crearProducto` con al menos cinco reglas.
2. Haz que devuelva la lista completa de errores.
3. Protege `valorAlmacen` frente a productos sin precio o sin stock.
4. Envuelve una lectura de JSON en `try/catch` y da un mensaje útil.
5. Escribe cinco entradas inválidas y comprueba que ninguna pasa.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Validación con lista de errores y un <code>try/catch</code> con mensaje claro.</span></div>
  <div><strong>Si lo tienes</strong><span>Distingue con <code>throw</code> los fallos de programación de los de datos.</span></div>
  <div><strong>Reto</strong><span>Escribe una función que valide un objeto contra un esquema de reglas declarado como dato.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 14</p>
  <ul class="checklist">
    <li>Lanzas errores con un mensaje que dice qué se esperaba.</li>
    <li>Capturas solo lo que sabes tratar.</li>
    <li>Validas donde entran los datos, no en cada función.</li>
    <li>Devuelves todos los errores de validación, no solo el primero.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué hace <code>finally</code>?</li>
    <li>¿Por qué es peligroso un <code>catch</code> vacío?</li>
    <li>¿Qué significa validar en el borde?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Se ejecuta haya error o no, para lo que hay que hacer en cualquier caso.</p>
  <p>2 · Porque oculta el fallo y el programa continúa con datos que no tiene.</p>
  <p>3 · Comprobar los datos en el punto donde entran, para que el resto del código pueda confiar en ellos.</p>
</details>

---

## Sesión 15 · Fechas, textos y formato

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Los métodos de texto que más vas a usar, y cómo se manejan fechas y formatos locales.</li>
    <li><strong>2. Haz:</strong> Añade búsqueda por texto y presentación de precios y fechas a tu catálogo.</li>
    <li><strong>3. Comprueba:</strong> Tu buscador encuentra «teclado» escribiendo «TECLA».</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si el usuario escribe « Teclado » con espacios y mayúsculas, ¿lo encontrará tu búsqueda?</li>
    <li>¿Cómo se escribe un precio en España? ¿Y una fecha?</li>
    <li>¿Qué diferencia hay entre el dato y su presentación?</li>
  </ol>
</div>

### Los métodos de texto que usarás

```javascript
const texto = "  Teclado Mecánico RGB  ";

texto.trim()                    // "Teclado Mecánico RGB"
texto.toLowerCase()             // "  teclado mecánico rgb  "
texto.includes("Mecánico")      // true
texto.trim().startsWith("Tec")  // true
texto.replaceAll(" ", "-")
texto.trim().split(" ")         // ["Teclado", "Mecánico", "RGB"]
"1,2,3".split(",")              // ["1", "2", "3"]
texto.trim().slice(0, 7)        // "Teclado"
```

Ninguno modifica el original: los textos son inmutables, y todos devuelven uno nuevo.

### Una búsqueda que no falla por tonterías

```javascript
export function buscar(productos, consulta) {
  const termino = consulta.trim().toLowerCase();
  if (termino === "") return productos;

  return productos.filter((p) =>
    p.nombre.toLowerCase().includes(termino) ||
    p.descripcion.toLowerCase().includes(termino)
  );
}
```

Tres decisiones que evitan tres quejas: se recortan los espacios, se compara todo en minúsculas, y una consulta vacía devuelve todo en lugar de nada.

### Fechas

```javascript
const ahora = new Date();
ahora.getFullYear();
ahora.getMonth();          // ¡de 0 a 11! enero es 0
ahora.getDate();           // el día del mes

const alta = new Date("2026-09-04");
const dias = (ahora - alta) / (1000 * 60 * 60 * 24);
```

Que los meses empiecen en cero es la trampa histórica de las fechas en JavaScript. Y restar dos fechas da milisegundos, no días: hay que dividir.

### Formato local

```javascript
const precio = 1234.5;

precio.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
// "1.234,50 €"

new Date().toLocaleDateString("es-ES", {
  day: "numeric", month: "long", year: "numeric"
});
// "4 de septiembre de 2026"
```

<div class="rule">
  <p class="rule-label">Guarda el dato, formatea al presentar</p>
  <p>En tu catálogo, el precio es <code>89.9</code>, un número. <code>"89,90 €"</code> es su presentación, y se genera en el momento de mostrarlo.</p>
  <p>Si guardas el texto formateado, no podrás sumar, ordenar ni comparar sin deshacerlo, y el día que cambies de moneda o de idioma habrá que tocar los datos. Es la misma separación entre contenido y presentación que aprendiste en la UD1 y la UD2, aplicada a los valores.</p>
</div>

### Tarea 15 · Búsqueda y presentación

En `js/formato.js` y `js/catalogo.js`:

1. `buscar(productos, consulta)` insensible a mayúsculas y espacios.
2. `formatearPrecio(valor)` con formato español.
3. `formatearFecha(fecha)` en formato largo.
4. Añade a cada producto una fecha de alta y ordénalos por ella.
5. Comprueba la búsqueda con seis consultas, incluidas la vacía y una con acentos.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Búsqueda robusta y precios con formato español.</span></div>
  <div><strong>Si lo tienes</strong><span>Haz que la búsqueda ignore también los acentos.</span></div>
  <div><strong>Reto</strong><span>Devuelve los resultados ordenados por relevancia: primero los que coinciden al principio del nombre.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 5</p>
  <ul class="checklist">
    <li>Tu proyecto está en módulos y se sirve por HTTP.</li>
    <li>Validas los datos donde entran y tratas los errores.</li>
    <li>Buscas por texto sin que la fallen mayúsculas ni espacios.</li>
    <li>Guardas datos y formateas solo al presentar.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Recortar espacios, pasar todo a minúsculas y decidir qué hace la consulta vacía.</p>
  <p>2 · De 0 a 11: enero es el mes 0.</p>
  <p>3 · Porque el texto formateado ya no se puede sumar ni ordenar, y ata los datos a un idioma y una moneda.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 5 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Exporta una función desde un módulo e impórtala desde otro, con la ruta escrita como debe ser.</li>
    <li>Escribe la lectura de un JSON que puede venir roto, sin que el programa se caiga.</li>
    <li>¿Qué significa validar en el borde? Pon un ejemplo de tu proyecto.</li>
  </ol>
</div>
---

## Semana 6 · Integración y entrega

---

## Sesión 16 · Reto acumulativo · un dominio desconocido

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Nada nuevo. Hoy se comprueba si lo anterior es tuyo.</li>
    <li><strong>2. Haz:</strong> Modela y consulta un dominio que no has visto antes.</li>
    <li><strong>3. Comprueba:</strong> Lo resuelves sin copiar de tu propio proyecto.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Ante datos nuevos, ¿qué decides primero: la estructura o las funciones?</li>
    <li>¿Qué preguntas se le hacen siempre a una colección?</li>
    <li>¿Qué comprobaciones no pueden faltar?</li>
  </ol>
</div>

### El encargo

Recibirás un enunciado con un dominio distinto del tuyo —una biblioteca, un gimnasio, una liga deportiva, una clínica— descrito en prosa, con datos de ejemplo desordenados y unas cuantas preguntas que hay que poder responder.

<figure class="diagram">
  <figcaption>El camino, que ya es el mismo de siempre</figcaption>
  <ol class="flow">
    <li>Identificar las entidades y sus propiedades</li>
    <li>Modelarlas como array de objetos</li>
    <li>Escribir una función por pregunta</li>
    <li>Validar la entrada en el borde</li>
    <li>Comprobar con casos normales, límite y vacíos</li>
  </ol>
</figure>

### Las condiciones

<div class="rule">
  <p class="rule-label">Sin copiar y pegar de tu proyecto</p>
  <p>Puedes consultar tus apuntes y la documentación. Lo que no vale es duplicar tu <code>catalogo.js</code> y renombrar variables: la sesión sirve justamente para comprobar si sabrías escribirlo otra vez.</p>
</div>

Las funciones deben cubrir, como mínimo: listar, buscar por texto, filtrar por un criterio numérico, ordenar por dos campos distintos, calcular un agregado y detectar un caso especial.

### Entrega de la sesión

Un módulo con los datos, otro con las consultas, y un principal que responda por consola a las preguntas del enunciado. Con la lista vacía tratada.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Modelo correcto y cuatro de las seis consultas.</span></div>
  <div><strong>Si lo tienes</strong><span>Las seis, con validación y casos límite comprobados.</span></div>
  <div><strong>Reto</strong><span>Añade una consulta compuesta que no estuviera en el enunciado y justifica por qué es útil.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 16</p>
  <ul class="checklist">
    <li>Has modelado un dominio nuevo sin ayuda.</li>
    <li>Cada pregunta tiene su función, y cada función devuelve.</li>
    <li>Has elegido el método de array por lo que devuelve.</li>
    <li>Has probado el caso vacío.</li>
  </ul>
</div>

---

## Sesión 17 · Refactorizar y leer código ajeno

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué señales indican que un código se puede mejorar sin cambiar lo que hace.</li>
    <li><strong>2. Haz:</strong> Refactoriza un fichero que funciona pero está mal escrito.</li>
    <li><strong>3. Comprueba:</strong> El comportamiento no ha cambiado, y la lectura sí.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué es lo primero que miras al abrir código de otra persona?</li>
    <li>¿Qué hace que un fragmento sea difícil de leer?</li>
    <li>¿Cómo sabes que una mejora no ha roto nada?</li>
  </ol>
</div>

### Las señales

| Señal | Qué suele significar | Qué se hace |
| ----- | -------------------- | ----------- |
| Una función de 60 líneas | Hace varias cosas | Extraer funciones |
| Nombres de una letra | Nadie sabe qué contienen | Renombrar |
| El mismo bloque tres veces | Falta una función | Extraer y parametrizar |
| Números sueltos (`* 1.21`) | Falta una constante | Nombrarlo |
| Anidamiento de cuatro niveles | Faltan salidas tempranas | Invertir condiciones |
| Comentarios que explican *qué* hace | El código no se explica solo | Reescribir el código |

<p class="term">Refactorizar</p>

Cambiar cómo está escrito un programa sin cambiar lo que hace. Si el comportamiento cambia, no es una refactorización: es una modificación, y hay que probarla como tal.

### Salidas tempranas

```javascript
// Antes: cuatro niveles de anidamiento
function precioFinal(producto) {
  if (producto) {
    if (producto.precio > 0) {
      if (producto.descuento) {
        return producto.precio * (1 - producto.descuento);
      } else {
        return producto.precio;
      }
    }
  }
}

// Después: los casos raros se despachan al principio
function precioFinal(producto) {
  if (!producto) return 0;
  if (producto.precio <= 0) return 0;
  if (!producto.descuento) return producto.precio;
  return producto.precio * (1 - producto.descuento);
}
```

La segunda versión se lee de arriba abajo, y cada línea responde a un caso.

### Comprobar que no has roto nada

Antes de tocar, escribe en un fichero las respuestas actuales del programa para media docena de entradas. Refactoriza. Vuelve a ejecutar. Si algo cambió, la refactorización introdujo un error.

Eso es, en versión manual, lo que en el módulo de servidor harán los tests automáticos.

### Tarea 17 · El fichero heredado

Recibirás un módulo de unas cien líneas que funciona pero está mal escrito:

1. Ejecútalo y anota su comportamiento con seis entradas.
2. Localiza cinco señales de la tabla.
3. Refactoriza en pasos pequeños, comprobando después de cada uno.
4. Escribe un comentario por cada cambio explicando qué señal atacaba.
5. Demuestra que el comportamiento es idéntico.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Cinco mejoras aplicadas y comportamiento idéntico demostrado.</span></div>
  <div><strong>Si lo tienes</strong><span>Reduce el anidamiento máximo a dos niveles en todo el fichero.</span></div>
  <div><strong>Reto</strong><span>Encuentra el fallo lógico que el fichero esconde, y sepáralo de la refactorización.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 17</p>
  <ul class="checklist">
    <li>Reconoces las señales de un código difícil de mantener.</li>
    <li>Refactorizas en pasos pequeños y comprobables.</li>
    <li>Usas salidas tempranas en lugar de anidar.</li>
    <li>Distingues refactorizar de modificar.</li>
  </ul>
</div>

---

## Sesión 18 · Auditoría final, revisión por pares y entrega

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se revisa en un módulo de JavaScript antes de darlo por terminado.</li>
    <li><strong>2. Haz:</strong> Audita tu proyecto, revisa el de un compañero y corrige.</li>
    <li><strong>3. Comprueba:</strong> Puedes defender cada decisión de tu código.</li>
  </ol>
</div>

### La lista de auditoría

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · el código</p>
  <ul class="checklist">
    <li>No queda ningún <code>var</code>, y los <code>let</code> son los que de verdad cambian.</li>
    <li>Todas las comparaciones usan el triple igual.</li>
    <li>Toda entrada externa se convierte y se valida al leerla.</li>
    <li>Las funciones devuelven valores; imprimir es cosa del principal.</li>
    <li>Ninguna función pasa de veinticinco líneas.</li>
    <li>No hay números sueltos sin nombre.</li>
    <li>Los nombres están en un solo idioma y dicen qué contienen.</li>
    <li>No queda código comentado ni <code>console.log</code> de depuración.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · el comportamiento</p>
  <ul class="checklist">
    <li>El catálogo vacío no produce <code>NaN</code> ni errores.</li>
    <li>Una búsqueda sin resultados devuelve una lista vacía, no <code>undefined</code>.</li>
    <li>Los datos inválidos se rechazan con un mensaje que dice qué falla.</li>
    <li>Ordenar no altera el catálogo original.</li>
    <li>La consola no muestra ningún error al cargar.</li>
  </ul>
</div>

### Revisión por pares

Intercambia proyectos. Sin preguntar nada a su autor:

1. Ejecuta el programa y describe qué hace.
2. Elige dos funciones y explícalas en voz alta.
3. Búscale tres entradas que lo rompan.
4. Señala una cosa bien hecha y una mejorable, con su razón.

Devuelve el trabajo con esas cuatro respuestas por escrito.

### Defensa

Prepara respuestas de un minuto para estas cuatro preguntas:

<div class="rule">
  <p class="rule-label">Las preguntas de la defensa</p>
  <ol>
    <li>Enséñame una función y explícame qué recibe, qué devuelve y qué pasa si le llega basura.</li>
    <li>¿Por qué elegiste ese método de array y no otro?</li>
    <li>Si mañana el catálogo llega desde un servidor en vez de estar escrito en tu fichero, ¿qué tendrías que cambiar?</li>
    <li>Enséñame un fallo que te costó encontrar y cuéntame cómo lo encontraste.</li>
  </ol>
</div>

La tercera es la importante, y es la misma pregunta que cerraba la UD1 y la UD2: si has separado datos, lógica y uso, la respuesta debería ser «solo el módulo de datos».

### Evaluación

| Criterio | Puntos |
| ---------------------------------------------------------- | -----: |
| Tipos y conversión tratados en los bordes del programa | 1,5 |
| Condicionales y bucles que expresan la regla, con sus límites | 1,5 |
| Funciones pequeñas que devuelven en lugar de imprimir | 2 |
| Consultas del catálogo con el método adecuado a lo que se necesita | 2 |
| Modelado con objetos y JSON válido | 1 |
| Módulos con una responsabilidad cada uno | 1 |
| Validación de la entrada y tratamiento de errores | 1 |

No puntúa que el código sea corto ni ingenioso. Puntúa que **se pueda leer**, que trate los casos raros —la lista vacía, el texto donde esperabas un número— y que puedas cambiar una decisión pequeña delante de alguien.

### Entrega

<div class="unit-deliverable">
  <p>La carpeta <code>js/</code> con <code>datos.js</code>, <code>catalogo.js</code>, <code>formato.js</code> y <code>main.js</code>; el enlace único con <code>type="module"</code>; la lista de auditoría marcada; la revisión del compañero por escrito; y un fichero <code>NOTAS.md</code> con las tres decisiones que más te costaron y por qué las tomaste así.</p>
</div>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 6 · 10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Dado un array de objetos, escribe la consulta que responde a una pregunta con dos criterios y un orden.</li>
    <li>Señala tres señales de que un código necesita refactorizarse.</li>
    <li>Ante un resultado que no es el esperado, ¿qué compruebas y en qué orden?</li>
  </ol>
</div>
---

## Lo que debes recordar

### El método

Ante cualquier problema de programación, esta secuencia:

<figure class="diagram">
  <figcaption>Cómo se ataca un problema con código</figcaption>
  <ol class="flow">
    <li>¿Qué datos entran y de qué tipo son de verdad?</li>
    <li>¿Qué reglas se aplican y en qué orden?</li>
    <li>¿Qué debe devolver, y qué debe devolver en los casos raros?</li>
    <li>Si no sale lo esperado: ¿dónde deja de coincidir con lo que yo creía?</li>
  </ol>
</figure>

### La idea más importante

Si dentro de un año has olvidado la sintaxis, que quede esta:

> **Antes de ejecutar, predice. Cuando no coincida, no cambies código: busca dónde se separó lo que ocurre de lo que creías que ocurría.**

De ahí sale todo lo demás: por eso convertimos los datos en el borde, por eso comparamos con el triple igual, por eso las funciones devuelven en lugar de imprimir, y por eso se usan puntos de interrupción en lugar de probar suerte.

### No memorices JavaScript

No necesitas recordar todos los métodos. Tienes autocompletado, documentación e IA. Lo que necesitas es saber plantearte esto:

* ¿De qué tipo es este valor **de verdad**, no el que yo esperaba?
* ¿Qué quiero recibir: una lista, un elemento, un booleano o un número?
* ¿Esta función devuelve algo, o solo hace algo?
* ¿Qué pasa si la lista está vacía?
* ¿Qué pasa si el dato llega como texto?
* ¿Estoy modificando el original sin querer?
* ¿Quién valida esto, y en qué punto?
* ¿Sabría explicar esta línea dentro de un mes?

### Al terminar deberías poder responder

1. ¿Dónde se ejecuta el JavaScript de una página?
2. ¿Qué hace `defer` y por qué lo usamos?
3. ¿Cuándo usas `const` y cuándo `let`?
4. ¿Qué diferencia hay entre `null` y `undefined`?
5. ¿Por qué `"3" + 1` da `"31"` y `"3" - 1` da `2`?
6. ¿Qué es `NaN` y cómo se detecta?
7. ¿Por qué comparamos con el triple igual?
8. ¿Cuáles son los seis valores *falsy*?
9. ¿Qué diferencia hay entre `||` y `??`?
10. ¿Cómo se comprueba el caso límite de una condición?
11. ¿Cuándo eliges `for...of` y cuándo un `for` con índice?
12. ¿Qué provoca un bucle infinito?
13. ¿Por qué una función debe devolver en vez de imprimir?
14. ¿Qué es el ámbito de bloque?
15. ¿Qué es un callback?
16. ¿Qué devuelve `map`, `filter`, `find`, `some` y `reduce`?
17. ¿Por qué `sort` necesita una función de comparación con números?
18. ¿Qué métodos de array mutan el original?
19. ¿Cómo se copia un objeto sin compartir la referencia?
20. ¿Qué es el encadenamiento opcional y qué evita?
21. ¿Qué reglas tiene JSON que no tiene JavaScript?
22. ¿Qué hacen `JSON.stringify` y `JSON.parse`?
23. ¿Por qué los módulos ES necesitan un servidor?
24. ¿Qué diferencia hay entre exportación nombrada y por defecto?
25. ¿Qué hace `try/catch/finally`?
26. ¿Por qué es peligroso un `catch` vacío?
27. ¿Qué significa validar en el borde?
28. ¿Por qué se guarda el dato y se formatea al presentar?
29. ¿Qué es refactorizar, y cómo compruebas que no has roto nada?
30. ¿Cómo se usa un punto de interrupción?

Si puedes responderlas y escribir desde cero un módulo que consulte una colección de datos, tienes la base que necesita la UD4.

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Motor de JavaScript | El programa del navegador que ejecuta tu código |
| Variable | Un nombre para un valor |
| Tipo | La clase de dato que contiene un valor |
| Conversión | Pasar un valor de un tipo a otro, automática o explícita |
| `NaN` | Un número que representa un cálculo imposible |
| *Truthy* / *falsy* | Si un valor cuenta como verdadero o falso en una condición |
| Función | Un bloque con nombre que recibe datos y devuelve un resultado |
| Parámetro / argumento | Lo que la función declara / lo que se le pasa al llamarla |
| Retorno | El valor que la función entrega a quien la llamó |
| Ámbito | La zona del programa donde existe una variable |
| Callback | Una función que se pasa a otra para que la llame |
| Array | Una lista ordenada de valores |
| Mutar | Modificar la estructura original en lugar de devolver otra |
| Método declarativo | El que expresa qué quieres, no cómo recorrerlo |
| Objeto | Un conjunto de propiedades con nombre |
| Referencia | Que dos variables apunten al mismo objeto |
| Desestructuración | Extraer propiedades o elementos a variables con nombre |
| JSON | Formato de texto para intercambiar datos entre sistemas |
| Módulo | Un fichero que exporta lo que otros pueden importar |
| Excepción | Un error lanzado que interrumpe la ejecución |
| Validar en el borde | Comprobar los datos en el punto donde entran |
| Refactorizar | Mejorar cómo está escrito sin cambiar lo que hace |
| Punto de interrupción | Una marca que detiene el programa para inspeccionarlo |

### La siguiente unidad

Ya sabes razonar con datos, escribir reglas, descomponer en funciones y encontrar tus propios errores. Lo que tu código todavía no toca es **la página**.

<figure class="diagram">
  <figcaption>Lo que viene</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Datos en memoria</li>
    <li>El DOM · la página como objetos</li>
    <li>Eventos · lo que hace el usuario</li>
    <li>Render · pintar el estado</li>
  </ol>
</figure>

En la UD4 conectaremos las dos cosas: tu catálogo pintado en el documento, tus filtros manejados desde un formulario y tus datos llegando desde un servidor. Y ahí se cobrará el trabajo de estas seis semanas: cuando el filtro no filtre, no mirarás el botón. Mirarás la función.

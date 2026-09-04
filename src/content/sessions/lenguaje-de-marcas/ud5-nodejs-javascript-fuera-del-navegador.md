---
title: "Node.js: JavaScript fuera del navegador"
label: "UD5 · Guía y taller práctico"
section: "ud-05"
order: 5
lang: "es"
summary: "El mismo lenguaje, sin navegador. Node ejecuta JavaScript en tu máquina, con acceso a ficheros y a la red, y con él construirás primero un servidor HTTP a mano —para entender qué hace de verdad— y solo después lo reescribirás con Express, sabiendo qué te ahorra."
duration: "18 sesiones · 6 semanas"
modality: "Individual, con retos y revisión en pareja"
deliverable: "Un proyecto Node completo: una herramienta de línea de comandos que gestiona el catálogo en un fichero JSON, un servidor HTTP escrito a mano que lo sirve, y ese mismo servidor reescrito con Express con sus rutas, sus estáticos, su registro de peticiones y su manejo central de errores."
outcomes:
  - "Explicar qué es Node.js y en qué se diferencia el entorno del navegador del de un servidor."
  - "Ejecutar programas desde la terminal y leer argumentos y variables de entorno."
  - "Organizar un proyecto con package.json, scripts y dependencias declaradas."
  - "Instalar dependencias entendiendo el versionado semántico y el fichero de bloqueo."
  - "Leer y escribir ficheros con la API de promesas, componiendo rutas de forma portable."
  - "Usar un fichero JSON como almacén sin corromperlo."
  - "Levantar un servidor HTTP con el módulo nativo y responder con el código de estado correcto."
  - "Servir ficheros estáticos resolviendo su tipo de contenido y protegiendo las rutas."
  - "Explicar qué problemas resuelve Express y reescribir el servidor nativo con él."
  - "Escribir middleware propio, registrar las peticiones y centralizar el tratamiento de errores."
requirements:
  - "Node.js 22 o superior y npm."
  - "Visual Studio Code y una terminal."
  - "Un cliente HTTP: la extensión REST Client, Thunder Client o curl."
  - "El catálogo en JSON de las unidades anteriores."
priorKnowledge:
  - "Funciones, arrays de objetos, módulos ES, JSON y try/catch (UD3)."
  - "Peticiones, respuestas, códigos de estado y fetch desde el cliente (UD4)."
  - "Manejo básico de la terminal: moverse por carpetas y ejecutar comandos."
date: "2026-09-04"
---

## ¿Qué vas a aprender?

Durante dos trimestres, el servidor ha sido «eso que está al otro lado». En la UD4 le pediste datos con `fetch` y te respondió, y ni siquiera era tuyo.

En esta unidad cruzas al otro lado.

<figure class="diagram">
  <figcaption>Dónde has estado y dónde vas</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>UD1–UD2 · el documento</li>
    <li>UD3–UD4 · el cliente</li>
    <li>UD5–UD6 · el servidor</li>
  </ol>
</figure>

Y lo haces sin cambiar de lenguaje. Node.js es JavaScript ejecutándose fuera del navegador: el mismo `const`, las mismas funciones, los mismos arrays de objetos, los mismos `async/await`. Lo que cambia es lo que hay alrededor.

### Qué cambia al salir del navegador

| En el navegador | En Node |
| --------------- | ------- |
| `window`, `document`, el DOM | No existen |
| No puedes tocar ficheros | Lees y escribes el disco |
| Consumes peticiones | Las atiendes |
| Lo ejecuta quien visita la web | Lo ejecutas tú, y sigue corriendo |
| El código es público | El código no se ve desde fuera |

Esa última fila es la que más consecuencias tiene, y explica la regla que va a gobernar la unidad siguiente: la validación de verdad, las claves y las decisiones que no se pueden saltar viven aquí, porque aquí nadie las puede abrir con DevTools.

### La idea que gobierna la unidad

Podríamos empezar directamente por Express, que es lo que se usa en producción. No lo vamos a hacer.

<div class="rule">
  <p class="rule-label">Primero a mano, después con el framework</p>
  <p>Vas a escribir un servidor con el módulo nativo de Node: recibir la petición, mirar el método y la ruta, decidir la respuesta, poner las cabeceras y el código de estado. Es incómodo, y esa incomodidad es el contenido de la sesión 13.</p>
  <p>Cuando después llegue Express, cada una de sus piezas responderá a un dolor que ya has sentido. Es la diferencia entre saber usar un framework y saber qué está haciendo por ti; la primera se aprende en una tarde, la segunda es la que te permite arreglarlo cuando falla.</p>
</div>

---

## El proyecto de la unidad

Cambia el proyecto. Hasta ahora trabajabas en `mi-web/`; ahora creas al lado un proyecto Node que acabará sirviendo esa web:

```text
mi-api/
│
├── package.json
├── package-lock.json
├── .gitignore
├── .env.example
│
├── datos/
│   └── productos.json      ← el catálogo, ahora en disco
│
├── src/
│   ├── cli.js              ← la herramienta de línea de comandos
│   ├── almacen.js          ← leer y escribir el fichero
│   ├── servidor.js         ← primero a mano, luego con Express
│   └── rutas.js
│
└── publico/                ← el sitio de la UD1–UD4, servido desde aquí
    ├── index.html
    ├── css/
    └── js/
```

<div class="unit-deliverable">
  <p>Una herramienta de terminal que lista, añade, actualiza y borra productos del fichero JSON; un servidor HTTP escrito con el módulo nativo que sirve la web y responde a <code>/api/productos</code>; y ese mismo servidor reescrito con Express, con estáticos, registro de peticiones y errores centralizados.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 1 · nada de dependencias hasta la sesión 14</p>
  <p>Ni Express, ni utilidades de fecha, ni librerías de colores en la terminal: hasta la sesión 14, todo lo que entregues se resuelve con lo que Node trae de fábrica.</p>
  <p>La única excepción es el ejercicio de la sesión 5, donde instalarás y desinstalarás un paquete para ver qué le hace al proyecto. La primera dependencia que se quede será Express, y para entonces sabrás exactamente por qué.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 2 · nada de secretos en el repositorio</p>
  <p>Un puerto, una ruta de fichero o una clave de API se leen del entorno, no se escriben en el código. Y el fichero con los valores reales no se sube nunca. Esto no es una manía: es la causa más común de credenciales filtradas en repositorios públicos.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 3 · la IA, para entender, no para entregar</p>
  <ol>
    <li><strong>Antes de preguntar:</strong> lee el error completo de la terminal. Node dice el módulo, la línea y el código de error.</li>
    <li><strong>Pregunta:</strong> pide una explicación, no el fichero terminado. Ejemplo: «Mi servidor responde 404 a todo. He comprobado que la petición llega, porque la registro. Explícame qué debería revisar sin darme el código».</li>
    <li><strong>Después:</strong> cierra la respuesta y añade tú una ruta más.</li>
  </ol>
</div>

---

## Herramientas

<p class="term">La terminal</p>

Deja de ser un sitio al que se va de vez en cuando. Aquí se arranca el servidor, se instalan dependencias, se ejecutan los programas y se leen los errores.

<p class="term">Un cliente HTTP</p>

Para probar tu servidor sin depender del navegador. Con REST Client de VS Code las peticiones se guardan en un fichero `.http` dentro del propio proyecto, así que se versionan con el código y sirven de documentación.

### No todo pesa lo mismo

<div class="learning-priorities">
  <div class="learning-priorities__essential">
    <strong>Esencial · debes dominarlo</strong>
    <span>Ejecutar programas, módulos, npm, ficheros con promesas, HTTP nativo, códigos de estado y Express básico.</span>
  </div>
  <div class="learning-priorities__important">
    <strong>Importante · debes saber aplicarlo</strong>
    <span>Argumentos, variables de entorno, estáticos, middleware propio y errores centralizados.</span>
  </div>
  <div class="learning-priorities__extra">
    <strong>Ampliación · cuando lo anterior funciona</strong>
    <span>Streams, <code>node:test</code>, escritura atómica y depuración con el inspector.</span>
  </div>
</div>

---

## Plan de trabajo semanal

| Semana | Bloque temático | Práctica central | Horas |
| :---: | :--- | :--- | :---: |
| **Semana 1** | El entorno | Ejecutar, argumentos, entorno y módulos | 3 h |
| **Semana 2** | npm y el proyecto | `package.json`, dependencias y una herramienta de terminal | 3 h |
| **Semana 3** | Ficheros y datos | Leer y escribir el catálogo sin corromperlo | 3 h |
| **Semana 4** | El servidor a mano | HTTP nativo, rutas, estados y estáticos | 3 h |
| **Semana 5** | Del servidor al framework | Los límites del nativo y el primer Express | 3 h |
| **Semana 6** | Integración y entrega | Refactorización, depuración y revisión por pares | 3 h |
| **Total** | | **Un servidor propio, escrito dos veces** | **18 h** |

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

## Semana 1 · El entorno

---

## Sesión 1 · Qué es Node y qué cambia

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es Node.js, qué desaparece y qué aparece respecto al navegador.</li>
    <li><strong>2. Haz:</strong> Instala, comprueba la versión y ejecuta tus primeros programas.</li>
    <li><strong>3. Comprueba:</strong> Sabes qué código de la UD3 funciona aquí y cuál no.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué partes de tu código de la UD4 crees que no funcionarán fuera del navegador?</li>
    <li>¿Y cuáles funcionarán sin tocar nada?</li>
    <li>¿Quién ejecuta el código de un servidor, y durante cuánto tiempo?</li>
  </ol>
</div>

### Un motor sin navegador

Node.js es el motor de JavaScript de Chrome, sacado del navegador y empaquetado como un programa que puedes ejecutar en tu máquina. Alrededor le añadieron lo que un navegador no le deja hacer: acceso al sistema de ficheros, a la red y a los procesos del sistema.

```bash
node --version
node -e "console.log('Hola desde Node')"
node src/hola.js
```

También hay un modo interactivo, como la consola del navegador: escribiendo `node` sin más se abre y se escriben expresiones.

### Lo que ya no existe

```javascript
document.querySelector("h1");   // ReferenceError: document is not defined
window.localStorage;            // ReferenceError
alert("Hola");                  // ReferenceError
```

No es que estén rotos: es que no tienen sentido. No hay documento ni ventana. Todo el módulo `catalogo.js` de la UD3, en cambio, funciona aquí sin cambiar una coma, porque solo trabaja con datos. Ese es, otra vez, el premio de haber separado la lógica de la página.

### Lo que aparece

```javascript
process.argv;              // los argumentos de la llamada
process.env;               // las variables de entorno
process.exit(1);           // terminar con un código
process.cwd();             // desde dónde se ejecutó
console.log(import.meta.url);   // el fichero actual
```

Y los módulos del sistema, que se importan con el prefijo `node:`:

```javascript
import { readFile } from "node:fs/promises";
import path from "node:path";
import http from "node:http";
```

<p class="term">El prefijo <code>node:</code></p>

Deja claro que el módulo es del propio Node y no una dependencia descargada. Sin él también funciona, pero con él nadie puede confundir tu importación con un paquete externo instalado por alguien.

### Un programa que empieza y termina

<div class="rule">
  <p class="rule-label">Un programa de Node no es una página</p>
  <p>Una página vive mientras esté abierta y reacciona a lo que hace una persona. Un programa de Node se ejecuta, hace su trabajo y termina; salvo que sea un servidor, y entonces se queda escuchando hasta que alguien lo pare.</p>
  <p>De ahí una diferencia práctica: un fallo en el navegador estropea la experiencia de quien visita la web; un fallo no capturado en un servidor puede tumbarlo para todo el mundo a la vez.</p>
</div>

### Tarea 1 · Primeros programas

1. Comprueba tu versión de Node; debe ser 22 o superior.
2. Crea `src/hola.js` que salude e imprima la versión desde `process.version`.
3. Copia tu `catalogo.js` de la UD3 y ejecuta sus funciones desde Node.
4. Intenta usar `document` y anota el error exacto.
5. Imprime `process.cwd()` ejecutando desde dos carpetas distintas y explica la diferencia.
6. Prueba el modo interactivo con tres expresiones.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Node instalado, dos programas ejecutados y las funciones de la UD3 funcionando.</span></div>
  <div><strong>Si lo tienes</strong><span>Escribe un programa que muestre un resumen del catálogo por consola.</span></div>
  <div><strong>Reto</strong><span>Haz una lista de qué partes de tu proyecto de la UD4 funcionarían aquí y cuáles no, con la razón.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Ejecutas programas desde la terminal.</li>
    <li>Explicas qué desaparece y qué aparece respecto al navegador.</li>
    <li>Reutilizas sin cambios la lógica de la UD3.</li>
    <li>Importas módulos del sistema con el prefijo <code>node:</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué no existe <code>document</code> en Node?</li>
    <li>¿Qué guarda <code>process.argv</code>?</li>
    <li>¿Qué indica el prefijo <code>node:</code> en una importación?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque no hay documento: Node ejecuta JavaScript sin navegador.</p>
  <p>2 · Los argumentos con los que se llamó al programa, empezando por el ejecutable y el fichero.</p>
  <p>3 · Que el módulo es del propio Node y no una dependencia instalada.</p>
</details>

---

## Sesión 2 · Argumentos, entorno y salida

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo recibe datos un programa de terminal y cómo comunica su resultado.</li>
    <li><strong>2. Haz:</strong> Un programa que hace cosas distintas según cómo lo llames.</li>
    <li><strong>3. Comprueba:</strong> Devuelve el código de salida correcto y no imprime secretos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cómo le pasarías un dato a un programa que no tiene interfaz?</li>
    <li>¿Dónde guardarías una contraseña de base de datos?</li>
    <li>¿Cómo sabe otro programa si el tuyo ha terminado bien?</li>
  </ol>
</div>

### Argumentos

```bash
node src/cli.js listar
node src/cli.js buscar teclado
node src/cli.js añadir "Ratón vertical" 39.9
```

```javascript
const [, , comando, ...argumentos] = process.argv;

console.log(comando);      // "buscar"
console.log(argumentos);   // ["teclado"]
```

Las dos primeras posiciones son siempre el ejecutable y el fichero, por eso se descartan. Y, como todo lo que entra desde fuera, **los argumentos son texto**: un precio hay que convertirlo y comprobarlo, igual que hacías con los campos de formulario.

### Variables de entorno

```javascript
const puerto = Number(process.env.PUERTO ?? 3000);
const entorno = process.env.NODE_ENV ?? "development";
```

Y se les da valor al arrancar. La forma de hacerlo **depende de la terminal**, y es una de las cosas que más tiempo hacen perder en clase:

```bash
PUERTO=4000 node src/servidor.js          # Git Bash, macOS, Linux
```

```text
$env:PUERTO="4000"; node src/servidor.js   PowerShell
set PUERTO=4000 && node src/servidor.js    cmd de Windows
```

<div class="rule">
  <p class="rule-label">Lo que cambia entre máquinas va en el entorno</p>
  <p>El puerto, la ruta de los datos, la dirección de la base de datos y cualquier clave. Van fuera del código porque cambian entre tu portátil, el aula y el servidor real, y porque una clave escrita en el código acaba, tarde o temprano, en un repositorio.</p>
  <p>Nota además el <code>?? 3000</code>: un valor por defecto razonable para que el programa arranque sin configurar nada. El que no debe tener valor por defecto es un secreto: si falta, el programa debe negarse a arrancar.</p>
</div>

Por eso, en cuanto haya más de una variable, se pasan por fichero. Desde Node 20 se puede cargar un `.env` sin instalar nada, y la orden es idéntica en las tres terminales:

```bash
node --env-file=.env src/servidor.js
```

Y en el repositorio se sube `.env.example`, con las claves y sin los valores. El `.env` real va al `.gitignore`.

### Entrada y salida

```javascript
console.log("Resultado");      // salida estándar
console.error("Ha fallado");   // salida de error

process.exit(0);   // todo bien
process.exit(1);   // ha fallado
```

<p class="term">Código de salida</p>

El número con el que termina un programa. Cero significa éxito; cualquier otro, fallo. Es como se enteran las herramientas que encadenan programas —un script, un sistema de integración continua— de si deben seguir o pararse.

Separar `console.log` de `console.error` importa por lo mismo: permite que quien use tu programa redirija los resultados a un fichero y siga viendo los errores.

### Tarea 2 · Un programa configurable

1. Escribe `src/cli.js` que acepte los comandos `listar`, `buscar` y `ayuda`.
2. Si no se pasa comando, muestra la ayuda y termina con código 1.
3. Lee de una variable de entorno la ruta del fichero de datos, con un valor por defecto.
4. Convierte y valida los argumentos numéricos.
5. Comprueba el código de salida tras cada ejecución.
6. Crea `.env.example` y añade `.env` al `.gitignore`.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres comandos, ayuda, y códigos de salida correctos.</span></div>
  <div><strong>Si lo tienes</strong><span>Acepta opciones con guiones, como <code>--formato=json</code>.</span></div>
  <div><strong>Reto</strong><span>Haz que el programa se niegue a arrancar si falta una variable obligatoria, con un mensaje claro.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Lees argumentos y los conviertes al leerlos.</li>
    <li>La configuración vive en el entorno, no en el código.</li>
    <li>Distingues salida estándar de salida de error.</li>
    <li>Terminas con el código de salida adecuado.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué se descartan las dos primeras posiciones de <code>process.argv</code>?</li>
    <li>¿Qué significa un código de salida distinto de cero?</li>
    <li>¿Qué se sube al repositorio: <code>.env</code> o <code>.env.example</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque son el ejecutable de Node y la ruta del fichero ejecutado.</p>
  <p>2 · Que el programa ha terminado con un fallo.</p>
  <p>3 · Solo el de ejemplo, con las claves y sin los valores reales.</p>
</details>

---

## Sesión 3 · Módulos y estructura del proyecto

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se organizan los módulos en Node y qué diferencia hay con los dos sistemas que verás.</li>
    <li><strong>2. Haz:</strong> Estructura tu proyecto en carpetas con una responsabilidad cada una.</li>
    <li><strong>3. Comprueba:</strong> Cada fichero se puede explicar en una frase.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En la UD3 separaste datos, lógica y uso. ¿Sigue valiendo aquí?</li>
    <li>¿Qué parte de un servidor cambiaría si mañana los datos vinieran de una base de datos?</li>
    <li>¿Has visto <code>require</code> en algún tutorial? ¿Qué crees que es?</li>
  </ol>
</div>

### Dos sistemas de módulos

| Sistema | Cómo se escribe | Cuándo aparece |
| ------- | --------------- | -------------- |
| ESM | `import` / `export` | **El nuestro**, y el estándar del lenguaje |
| CommonJS | `require` / `module.exports` | Node antiguo y mucha documentación |

Para usar ESM basta una línea en `package.json`:

```json
{ "type": "module" }
```

Verás muchísimo `require` por ahí. Funciona, pero es el sistema heredado: si una respuesta de IA o un tutorial te lo dan, tradúcelo en lugar de mezclar los dos.

Una diferencia práctica: en ESM no existen `__dirname` ni `__filename`. Su equivalente:

```javascript
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
```

Otra: en Node **la extensión es obligatoria** en las rutas relativas, igual que en el navegador.

### Estructura por responsabilidad

<figure class="diagram">
  <figcaption>Qué pregunta responde cada capa</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>almacen.js · dónde están los datos</li>
    <li>catalogo.js · qué reglas tienen</li>
    <li>servidor.js · cómo se piden desde fuera</li>
    <li>cli.js · cómo se piden desde la terminal</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">La lógica no sabe de dónde vienen los datos</p>
  <p>Tus funciones de catálogo reciben un array y devuelven otro. No leen ficheros, no conocen HTTP y no imprimen nada. Por eso las puedes usar hoy desde la terminal y mañana desde el servidor sin tocarlas.</p>
  <p>Esa separación es la que hace que el cambio de la UD6 —pasar del fichero a otra forma de guardar— afecte a un solo módulo. Es también, exactamente, la arquitectura por capas del módulo de servidor.</p>
</div>

### Tarea 3 · Estructurar el proyecto

1. Crea la carpeta `mi-api/` con `package.json` y `"type": "module"`.
2. Crea `src/` con `almacen.js`, `catalogo.js` y `cli.js`.
3. Mueve ahí tus funciones de la UD3 sin modificarlas.
4. Escribe en un comentario, en cada fichero, la frase que lo describe.
5. Calcula la ruta de `datos/productos.json` a partir de la posición del fichero.
6. Comprueba que `cli.js` funciona desde cualquier carpeta.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Proyecto estructurado, con ESM y rutas que no dependen de dónde se ejecute.</span></div>
  <div><strong>Si lo tienes</strong><span>Traduce a ESM un fragmento escrito con <code>require</code>.</span></div>
  <div><strong>Reto</strong><span>Dibuja el grafo de dependencias y comprueba que la lógica no depende de nada de infraestructura.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 1</p>
  <ul class="checklist">
    <li>Ejecutas programas de Node y les pasas datos.</li>
    <li>La configuración está fuera del código.</li>
    <li>Tu proyecto tiene una estructura con responsabilidades claras.</li>
    <li>Usas ESM y sabes reconocer CommonJS.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Añadiendo <code>"type": "module"</code> al <code>package.json</code>.</p>
  <p>2 · Con <code>import.meta.url</code>, convertido a ruta con las utilidades de <code>node:url</code> y <code>node:path</code>.</p>
  <p>3 · Para que la misma lógica sirva desde la terminal, desde el servidor y desde las pruebas.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 1 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Nombra dos cosas que existen en el navegador y no en Node, y dos que existen en Node y no en el navegador.</li>
    <li>¿Qué significa que un programa termine con código de salida 1?</li>
    <li>¿Dónde vive el puerto de tu servidor, y por qué no está escrito en el código?</li>
  </ol>
</div>
---

## Semana 2 · npm y el proyecto

---

## Sesión 4 · package.json y los scripts

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué declara el <code>package.json</code> y para qué sirven sus scripts.</li>
    <li><strong>2. Haz:</strong> Da a tu proyecto los comandos con los que se va a usar.</li>
    <li><strong>3. Comprueba:</strong> Cualquiera puede arrancarlo leyendo solo el <code>package.json</code>.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si te doy un proyecto que no conoces, ¿por dónde empiezas para saber cómo se arranca?</li>
    <li>¿Qué comandos vas a repetir cien veces esta unidad?</li>
    <li>¿Qué pasaría si cada persona del equipo arrancara el proyecto de una forma distinta?</li>
  </ol>
</div>

### La ficha del proyecto

```bash
npm init -y
```

```json
{
  "name": "mi-api",
  "version": "1.0.0",
  "type": "module",
  "main": "src/servidor.js",
  "scripts": {
    "start": "node src/servidor.js",
    "dev": "node --watch src/servidor.js",
    "cli": "node src/cli.js"
  },
  "engines": { "node": ">=22" },
  "dependencies": {},
  "devDependencies": {}
}
```

| Campo | Qué declara |
| ----- | ----------- |
| `name`, `version` | Identidad del proyecto |
| `type` | Sistema de módulos: `module` para ESM |
| `scripts` | Los comandos del proyecto |
| `dependencies` | Lo que hace falta para ejecutar |
| `devDependencies` | Lo que hace falta solo para desarrollar |
| `engines` | Qué versión de Node necesita |

### Los scripts

```bash
npm start
npm run dev
npm run cli -- listar
```

<div class="rule">
  <p class="rule-label">Los scripts son la interfaz del proyecto</p>
  <p>El <code>package.json</code> es lo primero que abre quien llega a un proyecto que no conoce. Si arrancar requiere recordar una orden larga con banderas, alguien la escribirá mal.</p>
  <p>Un proyecto bien montado se arranca con <code>npm start</code>, se desarrolla con <code>npm run dev</code> y se prueba con <code>npm test</code>, y esos nombres son los mismos en todas partes. Es la misma idea que verás en el módulo de servidor con Maven.</p>
</div>

El `--watch` de Node reinicia el programa solo cuando cambia un fichero. Antes hacía falta una dependencia para eso; ahora viene incluido.

Y los dos guiones sueltos de `npm run cli -- listar` separan los argumentos del script de los de npm.

### Tarea 4 · La interfaz del proyecto

1. Crea el `package.json` con `npm init` y añade `"type": "module"`.
2. Define los scripts `start`, `dev` y `cli`.
3. Declara `engines` con la versión de Node.
4. Comprueba que `npm run dev` recarga al guardar.
5. Escribe un `README.md` con las tres órdenes y qué hace cada una.
6. Pásale el proyecto a un compañero y comprueba que lo arranca sin preguntarte.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres scripts funcionando y un README que basta para arrancar.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade un script que ejecute el CLI con datos de prueba.</span></div>
  <div><strong>Reto</strong><span>Encadena dos scripts para que uno prepare los datos antes de arrancar.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 4</p>
  <ul class="checklist">
    <li>Tu proyecto tiene <code>package.json</code> con ESM declarado.</li>
    <li>Los comandos habituales están como scripts.</li>
    <li>El README dice cómo arrancar.</li>
    <li>Sabes qué hace <code>--watch</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre <code>dependencies</code> y <code>devDependencies</code>?</li>
    <li>¿Para qué sirven los dos guiones en <code>npm run cli -- listar</code>?</li>
    <li>¿Qué declara <code>"type": "module"</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Las primeras hacen falta para ejecutar en producción; las segundas, solo para desarrollar y probar.</p>
  <p>2 · Para separar los argumentos destinados al script de los de npm.</p>
  <p>3 · Que los ficheros del proyecto usan módulos ES, con <code>import</code> y <code>export</code>.</p>
</details>

---

## Sesión 5 · Dependencias y versiones

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se instala una dependencia, qué es el versionado semántico y qué hace el fichero de bloqueo.</li>
    <li><strong>2. Haz:</strong> Analiza dependencias reales antes de decidir si las instalarías.</li>
    <li><strong>3. Comprueba:</strong> Sabes decir qué versiones acepta cada especificación.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué riesgo tiene meter en tu proyecto código escrito por desconocidos?</li>
    <li>Si funciona en tu portátil y no en el del profesor, ¿qué puede haber cambiado?</li>
    <li>¿Por qué crees que no se sube <code>node_modules</code> al repositorio?</li>
  </ol>
</div>

### Instalar

```bash
npm install express            # dependencia de ejecución
npm install --save-dev nodemon # solo para desarrollar
npm install                    # todo lo declarado, en un proyecto clonado
npm uninstall express
npm outdated                   # qué se ha quedado atrás
npm audit                      # vulnerabilidades conocidas
```

Instalar crea o actualiza tres cosas: la entrada en `package.json`, el árbol real en `node_modules` y el `package-lock.json`.

### Versionado semántico

```text
    4 . 21 . 2
    │    │   └── parche · corrección compatible
    │    └────── menor  · funcionalidad nueva, compatible
    └─────────── mayor  · cambio que rompe
```

| Se escribe | Acepta |
| ---------- | ------ |
| `4.21.2` | Exactamente esa |
| `~4.21.2` | Parches: 4.21.x |
| `^4.21.2` | Menores y parches: 4.x.x |
| `*` | Cualquiera. No lo hagas |

El acento circunflejo es el valor por defecto de npm, y es la razón de que dos instalaciones del mismo `package.json` en días distintos puedan traer código distinto.

### El fichero de bloqueo

<div class="rule">
  <p class="rule-label">El <code>package-lock.json</code> se sube al repositorio</p>
  <p>Guarda la versión exacta de cada paquete y de cada dependencia de cada paquete. Es lo que hace que tu proyecto instale hoy lo mismo que instaló ayer, y en el portátil del profesor lo mismo que en el tuyo.</p>
  <p>Sin él, «en mi máquina funciona» deja de ser una broma. Y <code>node_modules</code>, en cambio, no se sube nunca: son miles de ficheros reconstruibles con un solo comando.</p>
</div>

### Antes de instalar, pregúntate

<figure class="diagram">
  <figcaption>Cuatro preguntas antes de añadir una dependencia</figcaption>
  <ol class="flow">
    <li>¿Lo resuelve Node de fábrica?</li>
    <li>¿Cuántas dependencias arrastra consigo?</li>
    <li>¿Se mantiene: última publicación, incidencias abiertas?</li>
    <li>¿Sabría hacerlo sin ella si mañana desaparece?</li>
  </ol>
</figure>

Cada dependencia es código que se ejecuta con tus permisos, que puede tener vulnerabilidades y que alguien tiene que seguir manteniendo. En este proyecto vas a instalar exactamente una.

### Tarea 5 · Analizar sin instalar

1. Crea el `.gitignore` con `node_modules` y `.env`.
2. Busca la ficha de tres paquetes conocidos y anota versión, dependencias y última publicación.
3. Di qué versiones acepta cada una de estas especificaciones: `^2.4.1`, `~2.4.1`, `2.4.1`.
4. Instala Express, mira qué cambió en los tres sitios, y desinstálalo.
5. Ejecuta `npm audit` y lee el informe.
6. Borra `node_modules`, ejecuta `npm install` y comprueba que todo vuelve.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Análisis de tres paquetes y dominio de las especificaciones de versión.</span></div>
  <div><strong>Si lo tienes</strong><span>Explica qué pasaría si un paquete publicara una versión mayor con cambios incompatibles.</span></div>
  <div><strong>Reto</strong><span>Busca un caso real de paquete comprometido y resume qué ocurrió.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 5</p>
  <ul class="checklist">
    <li>Interpretas una versión semántica y sus rangos.</li>
    <li>Sabes qué se sube al repositorio y qué no.</li>
    <li>Evalúas una dependencia antes de instalarla.</li>
    <li>Reconstruyes <code>node_modules</code> desde cero.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué acepta <code>^1.2.3</code>?</li>
    <li>¿Para qué sirve el fichero de bloqueo?</li>
    <li>¿Por qué no se sube <code>node_modules</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Cualquier 1.x.x igual o posterior: menores y parches, no la versión mayor.</p>
  <p>2 · Para que todas las instalaciones traigan exactamente las mismas versiones.</p>
  <p>3 · Porque es reconstruible, pesa muchísimo y depende del sistema donde se instale.</p>
</details>

---

## Sesión 6 · Una herramienta de terminal

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se diseña un programa de terminal que otra persona pueda usar.</li>
    <li><strong>2. Haz:</strong> Termina tu CLI del catálogo con sus comandos y su ayuda.</li>
    <li><strong>3. Comprueba:</strong> Un compañero lo usa sin que le expliques nada.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué hace un buen programa de terminal cuando lo llamas mal?</li>
    <li>¿Cómo sabes qué comandos acepta un programa que no conoces?</li>
    <li>¿Qué debería imprimir: todo, o lo justo?</li>
  </ol>
</div>

### El despachador

```javascript
const comandos = {
  listar: listarProductos,
  buscar: buscarProductos,
  añadir: añadirProducto,
  borrar: borrarProducto,
  ayuda: mostrarAyuda
};

const [, , nombre, ...argumentos] = process.argv;
const comando = comandos[nombre];

if (!comando) {
  console.error(`Comando desconocido: ${nombre ?? "(ninguno)"}`);
  mostrarAyuda();
  process.exit(1);
}

try {
  await comando(argumentos);
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
```

Es el objeto de funciones de la sesión 8 de la UD3, ahora con un cometido real. Añadir un comando es añadir una línea.

### Lo que hace usable una herramienta

| Regla | Por qué |
| ----- | ------- |
| Ayuda con ejemplos reales | Nadie lee la documentación antes de probar |
| Mensajes de error que dicen qué hacer | «Falta el precio: `añadir <nombre> <precio>`» |
| Código de salida correcto | Para poder encadenarla con otras |
| Silencio cuando todo va bien | Un programa que grita no se puede automatizar |
| Confirmar lo destructivo | Borrar sin preguntar se paga caro |

<div class="rule">
  <p class="rule-label">El error dice qué esperaba y qué recibió</p>
  <p>«Datos inválidos» no sirve para nada. «El precio debe ser un número mayor que cero; se recibió "abc"» dice el problema, el valor y la regla, y quien lo lee sabe qué escribir a continuación.</p>
  <p>Es lo mismo que exigías a tus mensajes de validación en la UD4, ahora sin interfaz donde esconderlo.</p>
</div>

### Salida legible

```javascript
console.table(productos.map(({ id, nombre, precio, stock }) => ({
  id, nombre, precio, stock
})));
```

`console.table` también existe en Node, y para una lista de objetos es la diferencia entre una salida que se lee y un volcado que no.

### Tarea 6 · El CLI completo

1. Implementa `listar`, `buscar`, `ver`, `añadir`, `borrar` y `ayuda`.
2. Valida los argumentos de cada uno con las funciones de la UD3.
3. Escribe mensajes de error que digan qué se esperaba.
4. Devuelve el código de salida correcto en cada caso.
5. Pide confirmación antes de borrar.
6. Dale el programa a un compañero, sin explicarle nada, y anota dónde se atasca.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Seis comandos con ayuda, validación y códigos de salida.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade una opción <code>--json</code> que imprima el resultado sin formato.</span></div>
  <div><strong>Reto</strong><span>Haz que el programa funcione también leyendo datos por la entrada estándar.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 2</p>
  <ul class="checklist">
    <li>El proyecto se arranca leyendo solo el <code>package.json</code>.</li>
    <li>Entiendes el versionado y el fichero de bloqueo.</li>
    <li>Tu herramienta valida, informa y termina con el código correcto.</li>
    <li>Sigues sin instalar dependencias.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Explicar cómo se usa y terminar con un código de error.</p>
  <p>2 · Qué se esperaba, qué se recibió y cuál es la forma correcta.</p>
  <p>3 · Porque un programa silencioso cuando todo va bien se puede encadenar con otros.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 2 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>¿Qué versiones acepta <code>^3.2.1</code>? Escribe dos que sí y una que no.</li>
    <li>Di cuáles de estos tres se suben al repositorio: <code>node_modules</code>, <code>package-lock.json</code> y <code>.env</code>.</li>
    <li>Escribe dos preguntas que te harías antes de instalar una dependencia.</li>
  </ol>
</div>
---

## Semana 3 · Ficheros y datos

---

## Sesión 7 · Leer y escribir ficheros

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se leen y escriben ficheros con promesas, y cómo se componen rutas.</li>
    <li><strong>2. Haz:</strong> Saca el catálogo del código y ponlo en un fichero JSON.</li>
    <li><strong>3. Comprueba:</strong> Tu programa funciona igual desde cualquier carpeta y en cualquier sistema.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué pasa hoy con tus datos cuando el programa termina?</li>
    <li>¿Qué separador de carpetas usa Windows? ¿Y Linux?</li>
    <li>¿Qué debe hacer tu programa si el fichero de datos no existe?</li>
  </ol>
</div>

### La API de promesas

```javascript
import { readFile, writeFile, mkdir, access } from "node:fs/promises";

const texto = await readFile(ruta, "utf8");
await writeFile(ruta, JSON.stringify(datos, null, 2), "utf8");
await mkdir(carpeta, { recursive: true });
```

Node ofrece tres formas de trabajar con ficheros: con callbacks, síncrona y con promesas. Usamos la de promesas, porque encaja con el `async/await` de la UD4 y porque la síncrona **bloquea el proceso entero**: en un servidor, leer un fichero de forma síncrona deja a todas las peticiones esperando.

Y el `"utf8"` no es opcional: sin él recibes datos en bruto en lugar de texto, y los acentos aparecen rotos.

### Rutas portables

```javascript
import path from "node:path";
import { fileURLToPath } from "node:url";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const RUTA_DATOS = path.join(aqui, "..", "datos", "productos.json");

path.extname("productos.json");   // ".json"
path.basename("/datos/productos.json");   // "productos.json"
```

<div class="rule">
  <p class="rule-label">Nunca concatenes rutas con barras</p>
  <p>Escribir <code>carpeta + "/" + fichero</code> funciona en tu máquina y falla en otra. <code>path.join</code> pone el separador que corresponde al sistema y limpia los tramos sobrantes.</p>
  <p>Y componla siempre desde la posición del fichero, no desde donde se ejecutó el programa: si dependes de <code>process.cwd()</code>, tu servidor arrancará bien desde la carpeta del proyecto y fallará desde cualquier otra.</p>
</div>

### Los errores que vas a ver

| Código | Significa |
| ------ | --------- |
| `ENOENT` | No existe el fichero o la carpeta |
| `EACCES` | Sin permisos |
| `EISDIR` | Es una carpeta, no un fichero |
| `ENOTEMPTY` | La carpeta no está vacía |

```javascript
try {
  const texto = await readFile(RUTA_DATOS, "utf8");
  return JSON.parse(texto);
} catch (error) {
  if (error.code === "ENOENT") return [];    // primera ejecución: no hay datos
  throw error;                                // cualquier otra cosa, que suba
}
```

Ese patrón —tratar el error que sabes tratar y dejar subir el resto— es el de la UD3, ahora con nombres concretos.

### Tarea 7 · El catálogo en disco

1. Crea `datos/productos.json` con tu catálogo.
2. Escribe en `almacen.js` las funciones `leerProductos` y `guardarProductos`.
3. Compón la ruta con `path.join` desde la posición del módulo.
4. Trata `ENOENT` devolviendo una lista vacía.
5. Adapta el CLI para que lea y escriba de verdad.
6. Ejecuta el programa desde otra carpeta y comprueba que sigue funcionando.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Lectura y escritura funcionando, con rutas portables y <code>ENOENT</code> tratado.</span></div>
  <div><strong>Si lo tienes</strong><span>Crea la carpeta de datos automáticamente si no existe.</span></div>
  <div><strong>Reto</strong><span>Mide cuánto tarda leer un fichero de diez mil productos y compáralo con la versión síncrona.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 7</p>
  <ul class="checklist">
    <li>Lees y escribes con la API de promesas.</li>
    <li>Compones rutas con <code>path</code>, no con barras.</li>
    <li>Distingues los códigos de error más comunes.</li>
    <li>Tu programa funciona desde cualquier carpeta.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué no usamos la versión síncrona en un servidor?</li>
    <li>¿Qué significa <code>ENOENT</code>?</li>
    <li>¿Por qué <code>path.join</code> y no concatenar?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque bloquea el único hilo y deja esperando a todas las peticiones.</p>
  <p>2 · Que el fichero o la carpeta no existe.</p>
  <p>3 · Porque el separador cambia según el sistema y la concatenación no es portable.</p>
</details>

---

## Sesión 8 · Un fichero JSON como almacén

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se implementa un CRUD sobre un fichero sin corromperlo.</li>
    <li><strong>2. Haz:</strong> Termina el almacén con sus cuatro operaciones.</li>
    <li><strong>3. Comprueba:</strong> Un fallo a mitad de escritura no destruye tus datos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si el programa se interrumpe mientras escribe el fichero, ¿qué queda?</li>
    <li>¿Cómo asignas un identificador nuevo a un producto?</li>
    <li>¿Qué diferencia hay entre modificar el objeto y guardar el fichero?</li>
  </ol>
</div>

### Las cuatro operaciones

```javascript
export async function listar() {
  return leerProductos();
}

export async function obtener(id) {
  const productos = await leerProductos();
  return productos.find((p) => p.id === id) ?? null;
}

export async function crear(datos) {
  const productos = await leerProductos();
  const id = productos.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const nuevo = { id, ...datos, creadoEn: new Date().toISOString() };
  await guardarProductos([...productos, nuevo]);
  return nuevo;
}

export async function borrar(id) {
  const productos = await leerProductos();
  const restantes = productos.filter((p) => p.id !== id);
  if (restantes.length === productos.length) return false;
  await guardarProductos(restantes);
  return true;
}
```

Fíjate en dos cosas. El identificador **no** es la longitud del array, porque tras borrar el tercero de tres volvería a repetirse el 3. Y `borrar` devuelve si borró algo, para que quien llame pueda responder 404 en la UD6.

### Escribir sin romper

<div class="rule">
  <p class="rule-label">Escribe en un temporal y renombra</p>
  <p>Si el proceso muere a mitad de un <code>writeFile</code>, el fichero queda cortado: un JSON inválido, es decir, todos tus datos perdidos. Y la reescritura completa es exactamente lo que hace este almacén en cada operación.</p>
  <p>La solución estándar: escribir en un fichero temporal y renombrarlo encima del bueno. Renombrar dentro del mismo disco es una operación indivisible, así que el fichero de datos siempre está completo, con el contenido viejo o con el nuevo.</p>
</div>

```javascript
import { writeFile, rename } from "node:fs/promises";

export async function guardarProductos(productos) {
  const temporal = `${RUTA_DATOS}.tmp`;
  await writeFile(temporal, JSON.stringify(productos, null, 2), "utf8");
  await rename(temporal, RUTA_DATOS);
}
```

### Los límites de este almacén

<div class="rule">
  <p class="rule-label">Esto no es una base de datos, y hay que saber por qué</p>
  <p>Cada operación lee el fichero entero y lo reescribe entero. Con doscientos productos va sobrado; con doscientos mil, no. Y si dos peticiones escriben a la vez, la segunda pisa lo que hizo la primera, porque ambas leyeron la misma versión.</p>
  <p>Para lo que hacemos aquí es suficiente, y evita instalar y configurar un motor de base de datos. Pero conviene que sepas nombrar sus dos límites —tamaño y concurrencia— porque son exactamente los problemas que resuelve la base de datos del módulo de servidor.</p>
</div>

### Tarea 8 · El almacén completo

1. Implementa `listar`, `obtener`, `crear`, `actualizar` y `borrar`.
2. Genera los identificadores sin repetirlos nunca.
3. Escribe de forma segura, con temporal y renombrado.
4. Guarda fechas de creación y modificación en formato ISO.
5. Conecta el CLI con el almacén, de punta a punta.
6. Provoca una interrupción a mitad de escritura y comprueba que los datos sobreviven.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las cinco operaciones y escritura segura.</span></div>
  <div><strong>Si lo tienes</strong><span>Guarda una copia del fichero antes de cada escritura.</span></div>
  <div><strong>Reto</strong><span>Demuestra con dos procesos simultáneos que una escritura pisa a la otra, y explica por qué.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 8</p>
  <ul class="checklist">
    <li>Las cinco operaciones funcionan de punta a punta.</li>
    <li>Los identificadores nunca se repiten.</li>
    <li>Escribes con temporal y renombrado.</li>
    <li>Sabes nombrar los dos límites de este almacén.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué el identificador no puede ser la longitud del array?</li>
    <li>¿Qué protege escribir en un temporal y renombrar?</li>
    <li>¿Qué dos límites tiene un fichero JSON como almacén?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque tras un borrado se repetiría un identificador ya usado.</p>
  <p>2 · Que una interrupción deje el fichero de datos cortado e ilegible.</p>
  <p>3 · El tamaño, porque se reescribe entero, y la concurrencia, porque dos escrituras se pisan.</p>
</details>

---

## Sesión 9 · Errores, validación y trazas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se distingue un fallo esperable de uno inesperado, y qué se registra de cada uno.</li>
    <li><strong>2. Haz:</strong> Da a tu proyecto un tratamiento de errores coherente.</li>
    <li><strong>3. Comprueba:</strong> Ningún fallo deja el programa a medias en silencio.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Es lo mismo «este producto no existe» que «el disco está lleno»?</li>
    <li>¿Cuál de los dos es culpa de tu programa?</li>
    <li>¿Qué debería quedar registrado de cada uno?</li>
  </ol>
</div>

### Dos familias de fallo

| Familia | Ejemplo | Qué se hace |
| ------- | ------- | ----------- |
| Esperable | El producto no existe; el precio es inválido | Se trata: mensaje claro y salida controlada |
| Inesperado | Sin permisos, sin disco, un error de programación | Se registra con su traza y se sale con error |

<div class="rule">
  <p class="rule-label">Un error esperable no es una excepción</p>
  <p>Que alguien pida un producto que no existe no es un fallo del sistema: es un resultado posible. Devuélvelo como dato —<code>null</code>, o un resultado que lo describa— y deja las excepciones para lo que de verdad no debería pasar.</p>
  <p>Esa distinción es la que en la UD6 se convierte en la diferencia entre responder 404 y responder 500.</p>
</div>

### Errores propios

```javascript
export class ErrorDeValidacion extends Error {
  constructor(errores) {
    super("Los datos no son válidos");
    this.name = "ErrorDeValidacion";
    this.errores = errores;
  }
}
```

Un tipo propio permite distinguir en el `catch` qué clase de fallo llegó, sin comparar mensajes de texto:

```javascript
catch (error) {
  if (error instanceof ErrorDeValidacion) {
    error.errores.forEach((mensaje) => console.error(` - ${mensaje}`));
    process.exit(1);
  }
  throw error;
}
```

### Lo que nunca debe pasar desapercibido

```javascript
process.on("uncaughtException", (error) => {
  console.error("Error no capturado:", error);
  process.exit(1);
});

process.on("unhandledRejection", (motivo) => {
  console.error("Promesa rechazada sin tratar:", motivo);
  process.exit(1);
});
```

Una promesa rechazada que nadie captura es el fallo silencioso más común de Node: el programa sigue corriendo como si nada, con una operación que no ocurrió. Estos dos manejadores son la red de seguridad; no son el sitio donde tratar los errores.

### Registrar con criterio

```javascript
console.error(`[${new Date().toISOString()}] crear producto falló: ${error.message}`);
```

| Nivel | Para qué |
| ----- | -------- |
| `error` | Algo ha fallado y alguien debe mirarlo |
| `warn` | Algo raro que no ha impedido continuar |
| `info` | Hitos: arranque, apagado, configuración cargada |
| `debug` | Detalle, solo mientras se investiga |

Y una regla que no se rompe: **en los registros no se escriben contraseñas, tokens ni datos personales**. Un fichero de log acaba copiado, enviado y guardado en sitios que nadie previó.

### Tarea 9 · Errores coherentes

1. Define `ErrorDeValidacion` y `ErrorNoEncontrado`.
2. Haz que el almacén lance el segundo y devuelva datos en los casos normales.
3. Trata en el CLI cada familia con su mensaje y su código de salida.
4. Añade la red de seguridad de los dos manejadores de proceso.
5. Registra cada operación con marca de tiempo.
6. Provoca cuatro fallos distintos y comprueba el comportamiento de cada uno.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Dos tipos de error propios, tratados con su código de salida.</span></div>
  <div><strong>Si lo tienes</strong><span>Escribe los registros en un fichero además de en la terminal.</span></div>
  <div><strong>Reto</strong><span>Provoca una promesa rechazada sin tratar y comprueba qué pasa con y sin el manejador.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 3</p>
  <ul class="checklist">
    <li>Tus datos viven en disco y se leen y escriben sin corromperse.</li>
    <li>Distingues fallos esperables de inesperados.</li>
    <li>Cada error tiene su mensaje y su código de salida.</li>
    <li>Nada personal acaba en los registros.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · No: uno es un resultado posible del negocio y el otro un fallo del sistema.</p>
  <p>2 · Con <code>instanceof</code> sobre tipos de error propios, no comparando mensajes.</p>
  <p>3 · Que el programa siga corriendo como si la operación hubiera funcionado.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 3 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Escribe la lectura de un fichero que puede no existir, devolviendo una lista vacía en ese caso.</li>
    <li>¿Por qué se escribe en un fichero temporal y después se renombra?</li>
    <li>Compón la ruta de <code>datos/productos.json</code> sin depender de la carpeta desde la que se ejecute el programa.</li>
  </ol>
</div>
---

## Semana 4 · El servidor a mano

---

## Sesión 10 · Un servidor HTTP con las manos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué hace exactamente un servidor web y cómo se escribe uno con el módulo nativo.</li>
    <li><strong>2. Haz:</strong> Levanta tu primer servidor y respóndele al navegador.</li>
    <li><strong>3. Comprueba:</strong> Sabes leer una petición y componer una respuesta completa.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Cuando en la UD4 hacías <code>fetch</code>, ¿qué le llegaba al otro lado?</li>
    <li>¿Qué partes tiene una petición HTTP? ¿Y una respuesta?</li>
    <li>¿Por qué crees que un servidor «se queda escuchando»?</li>
  </ol>
</div>

### Diez líneas

```javascript
import http from "node:http";

const servidor = http.createServer((peticion, respuesta) => {
  respuesta.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  respuesta.end("Hola desde mi servidor");
});

servidor.listen(3000, () => {
  console.log("Escuchando en http://localhost:3000");
});
```

Eso es un servidor web. Arráncalo, abre el navegador y ahí está: por primera vez, el otro lado es tuyo.

<figure class="diagram">
  <figcaption>Lo que ocurre en cada visita</figcaption>
  <ol class="flow">
    <li>El navegador abre una conexión al puerto 3000</li>
    <li>Envía la petición: método, ruta, cabeceras y quizá cuerpo</li>
    <li>Node ejecuta tu función</li>
    <li>Tu función escribe el estado, las cabeceras y el cuerpo</li>
    <li>Se cierra la respuesta y el navegador la pinta</li>
  </ol>
</figure>

### La petición

```javascript
peticion.method;      // "GET", "POST"…
peticion.url;         // "/api/productos?categoria=teclados"
peticion.headers;     // un objeto con las cabeceras

const url = new URL(peticion.url, `http://${peticion.headers.host}`);
url.pathname;                       // "/api/productos"
url.searchParams.get("categoria");  // "teclados"
```

`peticion.url` trae la ruta y la cadena de consulta juntas y sin analizar. `URL` las separa, y `searchParams` da los parámetros ya decodificados: es la misma clase que existe en el navegador.

### La respuesta

```javascript
respuesta.statusCode = 404;
respuesta.setHeader("Content-Type", "application/json; charset=utf-8");
respuesta.end(JSON.stringify({ error: "No encontrado" }));
```

<div class="rule">
  <p class="rule-label">Toda respuesta se cierra, y solo una vez</p>
  <p>Si tu función termina sin llamar a <code>end</code>, el navegador se queda esperando hasta que agota el tiempo. Y si lo llamas dos veces —típico de un <code>if</code> sin <code>return</code>— Node lanza un error de cabeceras ya enviadas.</p>
  <p>Escribe siempre <code>return</code> después de responder. Es la costumbre que te ahorrará las dos caras del mismo problema.</p>
</div>

### El puerto

```javascript
const PUERTO = Number(process.env.PUERTO ?? 3000);
```

Si al arrancar ves `EADDRINUSE`, el puerto está ocupado: casi siempre por otro servidor tuyo que se quedó corriendo. O lo paras, o arrancas en otro puerto.

### Tarea 10 · Tu primer servidor

1. Escribe `src/servidor.js` que responda texto en cualquier ruta.
2. Registra por consola método, ruta y momento de cada petición.
3. Responde de forma distinta a `/` y a `/hola`.
4. Lee un parámetro de la cadena de consulta y devuélvelo.
5. Comprueba todo con el navegador y con tu cliente HTTP.
6. Provoca a propósito una respuesta sin cerrar y observa qué hace el navegador.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Servidor levantado, dos rutas y registro de peticiones.</span></div>
  <div><strong>Si lo tienes</strong><span>Devuelve JSON con la información completa de la petición.</span></div>
  <div><strong>Reto</strong><span>Arranca dos servidores en el mismo puerto y explica el error.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 10</p>
  <ul class="checklist">
    <li>Tienes un servidor que arranca y responde.</li>
    <li>Lees método, ruta y parámetros.</li>
    <li>Escribes estado, cabeceras y cuerpo.</li>
    <li>Cierras siempre la respuesta, y solo una vez.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué tres partes escribes en una respuesta?</li>
    <li>¿Qué significa <code>EADDRINUSE</code>?</li>
    <li>¿Qué pasa si no cierras la respuesta?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El código de estado, las cabeceras y el cuerpo.</p>
  <p>2 · Que el puerto ya está ocupado por otro proceso.</p>
  <p>3 · El cliente espera hasta agotar el tiempo y no recibe nada.</p>
</details>

---

## Sesión 11 · Rutas, métodos y códigos de estado

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se decide qué hacer según el método y la ruta, y qué estado responder.</li>
    <li><strong>2. Haz:</strong> Sirve tu catálogo en <code>/api/productos</code>, leyendo y creando.</li>
    <li><strong>3. Comprueba:</strong> Cada situación devuelve el código de estado correcto.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué significan 200, 201, 400, 404 y 500?</li>
    <li>¿Qué método usarías para crear algo? ¿Y para consultarlo?</li>
    <li>Si el cliente envía datos inválidos, ¿de quién es el fallo?</li>
  </ol>
</div>

### Enrutar a mano

```javascript
const servidor = http.createServer(async (peticion, respuesta) => {
  const url = new URL(peticion.url, `http://${peticion.headers.host}`);
  const ruta = url.pathname;

  if (peticion.method === "GET" && ruta === "/api/productos") {
    return responderJson(respuesta, 200, await listar());
  }

  if (peticion.method === "GET" && ruta.startsWith("/api/productos/")) {
    const id = Number(ruta.split("/").pop());
    const producto = await obtener(id);
    if (!producto) return responderJson(respuesta, 404, { error: "No encontrado" });
    return responderJson(respuesta, 200, producto);
  }

  responderJson(respuesta, 404, { error: "Ruta no encontrada" });
});
```

Se ve venir el problema: con quince rutas esto es una escalera de condicionales, y cada ruta con parámetro exige partir el texto a mano. Guárdalo en la memoria para la sesión 13.

### Leer el cuerpo de una petición

```javascript
async function leerCuerpo(peticion) {
  const trozos = [];
  for await (const trozo of peticion) trozos.push(trozo);
  const texto = Buffer.concat(trozos).toString("utf8");
  return texto === "" ? null : JSON.parse(texto);
}
```

<div class="rule">
  <p class="rule-label">El cuerpo llega a trozos</p>
  <p>No es una propiedad que se lea: es un flujo que va llegando. Por eso hay que acumular los trozos y solo entonces convertirlos a texto y analizarlos.</p>
  <p>Y ese <code>JSON.parse</code> es un dato de fuera: un cuerpo mal formado lanza una excepción que, sin capturar, tumba la petición con un 500 cuando en realidad el fallo es del cliente y merece un 400.</p>
</div>

### Los códigos que vas a usar

| Código | Cuándo |
| :---: | ------ |
| 200 | Todo bien, aquí está |
| 201 | Creado; con la cabecera `Location` |
| 204 | Todo bien, no hay nada que devolver |
| 400 | La petición está mal formada o los datos no son válidos |
| 401 / 403 | No autenticado / autenticado pero sin permiso |
| 404 | El recurso no existe |
| 405 | El método no está permitido en esta ruta |
| 409 | Conflicto: ya existe algo así |
| 500 | Se ha roto algo en el servidor |

<div class="rule">
  <p class="rule-label">La familia del código dice de quién es el problema</p>
  <p>Los 4xx significan «lo has pedido mal»; los 5xx, «se me ha roto a mí». Devolver 200 con un cuerpo que dice «error» rompe esa convención, y cualquier cliente automático —incluido tu propio <code>fetch</code> de la UD4, que mira <code>respuesta.ok</code>— se lo creerá.</p>
  <p>Un 500 en tus registros es una tarea pendiente para ti. Un 400 es información para quien llama.</p>
</div>

### Un formato de error constante

```javascript
{ "error": "Producto no encontrado", "detalles": [] }
```

Que todas las respuestas de error tengan la misma forma permite al cliente escribir un solo tratamiento. Es un contrato, y romperlo a mitad de una API es una fuente inagotable de fallos en el cliente.

### Tarea 11 · La API a mano

1. Implementa `GET /api/productos` con filtro por categoría en la consulta.
2. Implementa `GET /api/productos/:id` con su 404.
3. Implementa `POST /api/productos` con validación, 201 y cabecera `Location`.
4. Devuelve 400 con la lista de errores cuando la validación falle.
5. Responde 405 si el método no está soportado en una ruta que sí existe.
6. Escribe un fichero `peticiones.http` que pruebe los seis casos.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres rutas con los códigos correctos y el fichero de pruebas.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade paginación con parámetros de consulta.</span></div>
  <div><strong>Reto</strong><span>Envía un cuerpo JSON inválido y consigue que responda 400 y no 500.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 11</p>
  <ul class="checklist">
    <li>Decides la acción por método y ruta.</li>
    <li>Lees el cuerpo acumulando el flujo.</li>
    <li>Devuelves el código de estado que corresponde a cada caso.</li>
    <li>Todos tus errores tienen la misma forma.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia hay entre un 400 y un 500?</li>
    <li>¿Qué se devuelve al crear un recurso?</li>
    <li>¿Por qué el cuerpo se lee por trozos?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El 400 dice que la petición estaba mal; el 500, que ha fallado el servidor.</p>
  <p>2 · Un 201 con la cabecera <code>Location</code> apuntando al recurso creado.</p>
  <p>3 · Porque llega como un flujo, no como un valor ya disponible.</p>
</details>

---

## Sesión 12 · Servir ficheros estáticos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se sirve un fichero del disco y por qué eso es peligroso si no se hace bien.</li>
    <li><strong>2. Haz:</strong> Sirve desde tu servidor la web de las unidades anteriores.</li>
    <li><strong>3. Comprueba:</strong> No se puede pedir un fichero fuera de la carpeta pública.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Hasta ahora, ¿quién servía tu web durante el desarrollo?</li>
    <li>¿Cómo sabe el navegador que un fichero es CSS y no texto?</li>
    <li>¿Qué pasaría si alguien pidiera <code>/../../.env</code>?</li>
  </ol>
</div>

### Servir un fichero

```javascript
import { readFile } from "node:fs/promises";
import path from "node:path";

const PUBLICO = path.join(aqui, "..", "publico");

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

async function servirEstatico(ruta, respuesta) {
  const relativa = ruta === "/" ? "/index.html" : ruta;
  const destino = path.join(PUBLICO, relativa);

  if (!destino.startsWith(PUBLICO)) {
    return responderJson(respuesta, 403, { error: "Prohibido" });
  }

  try {
    const contenido = await readFile(destino);
    respuesta.writeHead(200, { "Content-Type": TIPOS[path.extname(destino)] ?? "application/octet-stream" });
    respuesta.end(contenido);
  } catch (error) {
    if (error.code === "ENOENT") return responderJson(respuesta, 404, { error: "No encontrado" });
    throw error;
  }
}
```

### La comprobación que no puede faltar

<div class="rule">
  <p class="rule-label">Un servidor de ficheros sin comprobar la ruta es un agujero</p>
  <p>Si compones la ruta con lo que pide el cliente y no compruebas nada, una petición con tramos <code>..</code> sale de tu carpeta pública y llega a cualquier fichero que el proceso pueda leer: tu <code>.env</code>, tu código, ficheros del sistema.</p>
  <p>Se llama <em>path traversal</em> y es una de las vulnerabilidades más antiguas que existen. La defensa es la de arriba: resolver la ruta completa y comprobar que sigue estando dentro de la carpeta permitida. <strong>Después</strong> de resolver, nunca antes.</p>
</div>

### El tipo de contenido

Si sirves un CSS sin su cabecera, el navegador recibe texto y no aplica los estilos, sin decir nada claro. Con un módulo de JavaScript es peor: se niega a ejecutarlo por el tipo incorrecto. Es un fallo que parece de tu código y es de tus cabeceras.

### Servidor de estáticos y API a la vez

```javascript
if (ruta.startsWith("/api/")) return atenderApi(peticion, respuesta, url);
return servirEstatico(ruta, respuesta);
```

Con esto, tu proyecto entero se sirve desde un solo sitio: la web en `/` y los datos en `/api/`. Y como todo llega del mismo origen, **desaparece el problema de CORS** que viste en la UD4.

### Tarea 12 · Tu web, servida por ti

1. Copia el sitio de la UD4 a `publico/`.
2. Sírvelo desde tu servidor, con `index.html` por defecto.
3. Resuelve el tipo de contenido por extensión.
4. Protege contra rutas que salgan de la carpeta pública.
5. Devuelve 404 con una página propia cuando el fichero no exista.
6. Comprueba que el `fetch` de la UD4 funciona ahora contra tu propia API.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La web servida, con tipos correctos y rutas protegidas.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade cabeceras de caché a las imágenes y comprueba el efecto en Network.</span></div>
  <div><strong>Reto</strong><span>Demuestra el ataque de <em>path traversal</em> contra una versión sin comprobación.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 4</p>
  <ul class="checklist">
    <li>Tienes un servidor propio que sirve web y API.</li>
    <li>Cada situación devuelve su código de estado.</li>
    <li>Los ficheros se sirven con su tipo correcto.</li>
    <li>No se puede salir de la carpeta pública.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Comprobar que la ruta resuelta sigue dentro de la carpeta pública.</p>
  <p>2 · Por su extensión, para escribir la cabecera de tipo de contenido.</p>
  <p>3 · Porque cliente y API pasan a compartir origen.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 4 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Nombra las tres cosas que se escriben en una respuesta HTTP, con un ejemplo de cada una.</li>
    <li>Di qué código de estado devolverías al crear, al no encontrar, ante datos inválidos y ante un fallo interno.</li>
    <li>¿Qué comprobación evita que alguien pida un fichero fuera de la carpeta pública?</li>
  </ol>
</div>
---

## Semana 5 · Del servidor a mano al framework

---

## Sesión 13 · Los límites de hacerlo a mano

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué problemas concretos tiene tu servidor, y qué tendrías que escribir para resolverlos.</li>
    <li><strong>2. Haz:</strong> Documenta esos problemas sobre tu propio código.</li>
    <li><strong>3. Comprueba:</strong> Puedes justificar por qué mañana instalamos algo.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántas líneas ocupa hoy tu enrutado?</li>
    <li>¿Qué tendrías que tocar para añadir una ruta con dos parámetros?</li>
    <li>¿Cuántas veces has repetido la lectura del cuerpo?</li>
  </ol>
</div>

### La cuenta de lo que falta

| Lo que necesitas | Lo que tienes | Lo que costaría |
| ---------------- | ------------- | --------------- |
| Rutas con parámetros | Partir el texto a mano | Un comparador de patrones |
| Método y ruta a la vez | Condicionales anidados | Una tabla de rutas |
| Cuerpo JSON ya analizado | Leerlo en cada ruta | Un paso previo común |
| Errores en un solo sitio | Un `try/catch` por ruta | Un tratamiento central |
| Registro de peticiones | Repetido en cada rama | Un paso previo común |
| Estáticos | Lo has escrito tú | Bastante código |

Ninguna es imposible. Todas juntas son un framework, y ya existe uno pequeño y muy extendido que hace exactamente eso.

<div class="rule">
  <p class="rule-label">Esta sesión es el punto de la unidad</p>
  <p>Si hubiéramos empezado por Express, cada una de sus piezas sería magia con nombre. Después de dos semanas escribiendo esto a mano, <code>app.get("/api/productos/:id", ...)</code> no es magia: es la escalera de condicionales que tienes delante, resuelta.</p>
  <p>Y el día que Express se quede corto —una cabecera rara, un flujo que no encaja— sabrás bajar un nivel, porque ese nivel lo has escrito tú.</p>
</div>

### El patrón que ya has escrito sin saberlo

Mira tu servidor: seguro que hay cosas que haces **antes** de decidir la ruta —registrar la petición, analizar la URL— y cosas que haces **después** —cerrar, capturar errores—. Esa idea de «una cadena de pasos por los que atraviesa toda petición» tiene nombre, y es la pieza central de mañana:

<figure class="diagram">
  <figcaption>Una petición atravesando la cadena</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Registro</li>
    <li>Analizar el cuerpo</li>
    <li>Ruta</li>
    <li>Errores</li>
    <li>Respuesta</li>
  </ol>
</figure>

### Tarea 13 · El informe

Sobre tu propio código:

1. Cuenta las líneas del enrutado y el nivel máximo de anidamiento.
2. Marca todo lo que se repite en más de una ruta.
3. Escribe qué habría que cambiar para añadir `GET /api/categorias/:nombre/productos`.
4. Escribe un comparador de rutas con parámetros y comprueba lo que cuesta.
5. Redacta media página: qué problemas tiene tu servidor y qué esperas de un framework.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>El informe escrito, con ejemplos de tu código.</span></div>
  <div><strong>Si lo tienes</strong><span>El comparador de rutas con parámetros, funcionando.</span></div>
  <div><strong>Reto</strong><span>Implementa tu propia cadena de pasos por los que atraviesa la petición.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 13</p>
  <ul class="checklist">
    <li>Nombras seis problemas concretos de tu servidor.</li>
    <li>Sabes lo que costaría resolverlos a mano.</li>
    <li>Entiendes la idea de una cadena de pasos.</li>
    <li>Puedes justificar la dependencia que instalarás mañana.</li>
  </ul>
</div>

---

## Sesión 14 · El primer Express

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es Express y cómo resuelve cada problema de ayer.</li>
    <li><strong>2. Haz:</strong> Reescribe tu servidor con Express, ruta a ruta.</li>
    <li><strong>3. Comprueba:</strong> Se comporta igual que el de ayer, con menos código.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>De los seis problemas de ayer, ¿cuáles crees que resolverá?</li>
    <li>¿Qué esperas que siga siendo trabajo tuyo?</li>
    <li>¿Cómo comprobarás que la reescritura no ha roto nada?</li>
  </ol>
</div>

### Instalar y arrancar

```bash
npm install express
```

```javascript
import express from "express";

const app = express();

app.use(express.json());                     // analiza el cuerpo JSON
app.use(express.static("publico"));          // sirve los estáticos

app.get("/api/productos", async (peticion, respuesta) => {
  respuesta.json(await listar());
});

app.get("/api/productos/:id", async (peticion, respuesta) => {
  const producto = await obtener(Number(peticion.params.id));
  if (!producto) return respuesta.status(404).json({ error: "No encontrado" });
  respuesta.json(producto);
});

app.listen(PUERTO, () => console.log(`Escuchando en el puerto ${PUERTO}`));
```

Compáralo con lo de la semana pasada. Las dos primeras líneas sustituyen tu lector de cuerpo y tu servidor de estáticos enteros; `:id` sustituye el partido de texto a mano; y `respuesta.json` pone la cabecera, serializa y cierra.

### El mapa de equivalencias

| A mano | Con Express |
| ------ | ----------- |
| Condicionales por método y ruta | `app.get`, `app.post`, `app.put`, `app.delete` |
| Partir la ruta para el identificador | `peticion.params.id` |
| Analizar la cadena de consulta | `peticion.query` |
| Acumular y analizar el cuerpo | `express.json()` |
| Escribir estado, cabeceras y cerrar | `respuesta.status(...).json(...)` |
| Tu servidor de ficheros | `express.static(...)` |

<div class="rule">
  <p class="rule-label">Express no valida por ti</p>
  <p>Que <code>peticion.body</code> exista no significa que traiga lo que esperas: puede llegar vacío, con campos de más, con tipos que no son. Tus funciones de validación de la UD3 siguen siendo igual de necesarias, y ahora más, porque quien llama a la API puede ser cualquiera.</p>
  <p>Un framework quita trabajo repetitivo. No quita responsabilidad.</p>
</div>

### El orden importa

```javascript
app.use(express.json());            // antes de las rutas que leen el cuerpo
app.get("/api/productos", ...);
app.use((peticion, respuesta) => respuesta.status(404).json({ error: "No encontrado" }));
```

Express recorre lo declarado **en orden** hasta que algo responde. De ahí dos consecuencias que causan casi todos los desconciertos del primer día: el analizador de cuerpo va antes que las rutas que lo usan, y el 404 va al final, después de todas.

### Tarea 14 · La reescritura

1. Instala Express y anota qué cambió en `package.json` y en el bloqueo.
2. Reescribe las rutas de lectura y comprueba con tu fichero `.http`.
3. Reescribe la creación con validación y 201.
4. Sustituye tu servidor de estáticos por el de Express.
5. Añade el 404 final.
6. Comprueba que las respuestas son idénticas a las de la semana pasada.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Todas las rutas reescritas y respondiendo igual.</span></div>
  <div><strong>Si lo tienes</strong><span>Mueve las rutas a <code>src/rutas.js</code> con un router propio.</span></div>
  <div><strong>Reto</strong><span>Compara líneas de código antes y después, y explica qué se ha ido.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 14</p>
  <ul class="checklist">
    <li>Tu servidor funciona con Express y responde igual.</li>
    <li>Sabes qué pieza de Express sustituye a cada cosa que escribiste.</li>
    <li>Entiendes que el orden de declaración importa.</li>
    <li>Sigues validando la entrada.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué hace <code>express.json()</code> y dónde debe declararse?</li>
    <li>¿Dónde vive el identificador de <code>/api/productos/:id</code>?</li>
    <li>¿Por qué el 404 va al final?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Analiza el cuerpo JSON de la petición, y va antes de las rutas que lo usan.</p>
  <p>2 · En <code>peticion.params.id</code>, y llega como texto.</p>
  <p>3 · Porque Express recorre en orden: si va antes, responde 404 a todo.</p>
</details>

---

## Sesión 15 · Middleware, registro y errores

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué es un middleware, cómo se escribe uno propio y cómo se centralizan los errores.</li>
    <li><strong>2. Haz:</strong> Añade registro de peticiones y un único punto de tratamiento de errores.</li>
    <li><strong>3. Comprueba:</strong> Ninguna ruta tiene ya su propio <code>try/catch</code>.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántos <code>try/catch</code> hay repartidos por tus rutas?</li>
    <li>Si quisieras registrar el tiempo de cada petición, ¿dónde lo pondrías?</li>
    <li>¿Qué debe ver el cliente cuando algo se rompe por dentro?</li>
  </ol>
</div>

### Qué es un middleware

<p class="term">Middleware</p>

Una función que recibe la petición, la respuesta y una tercera función, <code>next</code>. Puede mirar o modificar la petición, puede responder y cortar la cadena, o puede llamar a <code>next</code> para que siga el paso siguiente.

```javascript
function registrar(peticion, respuesta, next) {
  const inicio = Date.now();

  respuesta.on("finish", () => {
    const ms = Date.now() - inicio;
    console.log(`${peticion.method} ${peticion.originalUrl} → ${respuesta.statusCode} (${ms} ms)`);
  });

  next();
}

app.use(registrar);
```

Lo que hace útil este ejemplo es dónde se registra: al **terminar** la respuesta, así que ya se conoce el estado y el tiempo. Y con una sola declaración cubre todas las rutas, presentes y futuras.

<div class="rule">
  <p class="rule-label">Un middleware que no responde ni llama a <code>next</code> cuelga la petición</p>
  <p>La petición se queda dentro de la cadena, sin avanzar y sin respuesta, hasta que el cliente se cansa. No hay error, no hay traza, no hay nada en los registros. Es el fallo más desconcertante de Express, y siempre es el mismo olvido.</p>
</div>

### Errores en un solo sitio

```javascript
app.get("/api/productos/:id", async (peticion, respuesta, next) => {
  try {
    const producto = await obtener(Number(peticion.params.id));
    if (!producto) throw new ErrorNoEncontrado("Producto no encontrado");
    respuesta.json(producto);
  } catch (error) {
    next(error);        // se lo pasa al manejador de errores
  }
});

// El último de todos, y con cuatro parámetros
app.use((error, peticion, respuesta, next) => {
  if (error instanceof ErrorDeValidacion) {
    return respuesta.status(400).json({ error: error.message, detalles: error.errores });
  }
  if (error instanceof ErrorNoEncontrado) {
    return respuesta.status(404).json({ error: error.message });
  }

  console.error(error);      // la traza, para ti
  respuesta.status(500).json({ error: "Error interno del servidor" });
});
```

Los **cuatro** parámetros son lo que distingue a un manejador de errores de un middleware normal: si quitas el `next` final, Express lo tratará como uno cualquiera y no lo llamará nunca.

<div class="rule">
  <p class="rule-label">La traza es para ti; el mensaje, para quien llama</p>
  <p>Devolver al cliente el error completo revela rutas de ficheros, versiones y estructura interna, que es justo lo que busca quien intenta atacar un sistema. Y tampoco le sirve de nada a quien solo quería consultar un producto.</p>
  <p>Registra el detalle en el servidor y responde un mensaje genérico con el estado correcto. Esa es la razón de que el manejador tenga la última palabra sobre qué sale.</p>
</div>

### Tarea 15 · La cadena completa

1. Escribe el middleware de registro con método, ruta, estado y tiempo.
2. Escribe uno que rechace cuerpos demasiado grandes.
3. Convierte todas tus rutas para que deleguen los errores con `next`.
4. Escribe el manejador de errores central con sus tres casos.
5. Comprueba que un fallo interno responde 500 sin filtrar la traza.
6. Provoca un middleware sin `next` y observa qué ocurre.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Registro funcionando y errores centralizados en un único manejador.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade un identificador único a cada petición y sácalo en los registros y en la respuesta de error.</span></div>
  <div><strong>Reto</strong><span>Escribe un envoltorio que capture los errores de las rutas asíncronas sin repetir <code>try/catch</code>.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 5</p>
  <ul class="checklist">
    <li>Tu servidor está reescrito con Express y se comporta igual.</li>
    <li>Sabes qué pieza sustituye a cada cosa que escribiste a mano.</li>
    <li>El registro y los errores están en un solo sitio.</li>
    <li>El cliente nunca ve una traza.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que la petición se queda colgada sin respuesta ni error.</p>
  <p>2 · Cuatro parámetros, empezando por el error.</p>
  <p>3 · Porque revela información interna del sistema y no ayuda a quien llama.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 5 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Nombra tres problemas del servidor escrito a mano y qué pieza de Express resuelve cada uno.</li>
    <li>¿Qué ocurre si un middleware no responde ni llama a <code>next</code>?</li>
    <li>¿En qué se distingue un manejador de errores de un middleware normal?</li>
  </ol>
</div>
---

## Semana 6 · Integración y entrega

---

## Sesión 16 · Reto acumulativo · otro servicio

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Nada nuevo. Hoy se comprueba si sabes montar un servicio desde cero.</li>
    <li><strong>2. Haz:</strong> Construye un servidor completo para un dominio que no has visto.</li>
    <li><strong>3. Comprueba:</strong> Lo entregas con su fichero de pruebas y su README.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿En qué orden montarías un servicio nuevo?</li>
    <li>¿Qué escribirías primero: las rutas o el almacén?</li>
    <li>¿Cómo demuestras que funciona sin abrir el navegador?</li>
  </ol>
</div>

### El encargo

Un dominio distinto del tuyo —reservas de aulas, préstamos de una biblioteca, incidencias de un taller— con sus reglas propias, al menos una de las cuales no se resuelve con un CRUD sin más: no se puede reservar un aula ocupada, no se presta un ejemplar ya prestado.

En la sesión no cabe entero, y no se pretende: la hora se dedica a modelar los datos y a dejar funcionando las dos primeras rutas, que es donde se ve si el método es tuyo. El resto se termina como trabajo personal y se entrega con la unidad.

<figure class="diagram">
  <figcaption>El orden de montaje</figcaption>
  <ol class="flow">
    <li>Modelar los datos y sembrar el fichero JSON</li>
    <li>El almacén con sus operaciones</li>
    <li>Las reglas de negocio, sin saber de HTTP</li>
    <li>Las rutas, con sus códigos de estado</li>
    <li>Registro, errores centralizados y estáticos</li>
    <li>El fichero de peticiones que lo demuestra</li>
  </ol>
</figure>

### Los requisitos mínimos

<div class="checkpoint">
  <p class="checkpoint-label">Lo que hay que entregar</p>
  <ul class="checklist">
    <li>Cinco rutas, con al menos un <code>POST</code> y un <code>DELETE</code>.</li>
    <li>Validación de entrada con respuesta 400 y lista de errores.</li>
    <li>La regla de negocio del enunciado, con su código de estado propio.</li>
    <li>Escritura segura en el fichero de datos.</li>
    <li>Registro de peticiones y manejador de errores central.</li>
    <li>Un <code>peticiones.http</code> que recorra todos los casos, incluidos los que fallan.</li>
    <li>Un README con cómo arrancarlo y qué rutas ofrece.</li>
  </ul>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las cinco rutas funcionando con sus estados correctos.</span></div>
  <div><strong>Si lo tienes</strong><span>La regla de negocio y todos los casos de error cubiertos.</span></div>
  <div><strong>Reto</strong><span>Añade una consulta con filtros combinables por parámetros de la URL.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 16</p>
  <ul class="checklist">
    <li>Has montado un servicio completo sin partir del tuyo.</li>
    <li>Las capas siguen separadas.</li>
    <li>Cada situación devuelve su código de estado.</li>
    <li>El fichero de pruebas demuestra lo que dices.</li>
  </ul>
</div>

---

## Sesión 17 · Depurar en el servidor

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se diagnostica un fallo cuando no hay interfaz que mirar.</li>
    <li><strong>2. Haz:</strong> Repara un servidor con cinco fallos.</li>
    <li><strong>3. Comprueba:</strong> Sabes decir en qué lado está el problema antes de tocar nada.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si el navegador muestra un error, ¿cómo sabes si el fallo es del cliente o del servidor?</li>
    <li>¿Qué mira primero: la consola del navegador o la terminal?</li>
    <li>¿Qué información te da el código de estado sobre dónde buscar?</li>
  </ol>
</div>

### Dos consolas, y hay que mirar la correcta

<figure class="diagram">
  <figcaption>Localizar el lado del fallo</figcaption>
  <ol class="flow">
    <li>¿Sale la petición? Pestaña Network del navegador</li>
    <li>¿Llega al servidor? Tu registro de peticiones</li>
    <li>¿Qué estado devuelve? 4xx es del cliente, 5xx es tuyo</li>
    <li>¿Qué dice la terminal? Ahí está la traza</li>
  </ol>
</figure>

Ese registro de la sesión 15 deja de ser un adorno: es lo que separa «no llega la petición» de «llega y falla», que es la misma pregunta de la UD4 trasladada al servidor.

### El inspector

```bash
node --inspect src/servidor.js
```

Con el servidor arrancado así, puedes conectar DevTools o el depurador de VS Code y poner puntos de interrupción en tu código de servidor: mismo depurador, mismo procedimiento que en la UD3.

### Los fallos típicos de un servidor Node

| Síntoma | Causa habitual |
| ------- | -------------- |
| El servidor no arranca, `EADDRINUSE` | Otro proceso tuyo sigue vivo en ese puerto |
| Todo devuelve 404 | El orden de las declaraciones, o la ruta mal escrita |
| `peticion.body` es `undefined` | Falta `express.json()`, o va después de la ruta |
| La petición se queda colgada | Un middleware sin `next` ni respuesta |
| «Cabeceras ya enviadas» | Se respondió dos veces: falta un `return` |
| Los cambios no se aplican | El servidor no se ha reiniciado |
| El módulo del cliente no se ejecuta | Tipo de contenido incorrecto en el estático |

<div class="rule">
  <p class="rule-label">Reproduce sin navegador</p>
  <p>Antes de investigar, repite la petición con tu cliente HTTP. Si desde ahí funciona, el problema está en el cliente y no en el servidor; si falla igual, has eliminado media docena de variables de un golpe.</p>
</div>

### Tarea 17 · El servidor roto

Recibirás un proyecto con cinco fallos, uno de cada familia de la tabla. Para cada uno:

1. Escribe el síntoma exacto y qué esperabas.
2. Di si el fallo es del cliente o del servidor, y cómo lo has sabido.
3. Formula la hipótesis antes de tocar nada.
4. Compruébala con el registro, el cliente HTTP o un punto de interrupción.
5. Corrige con el cambio más pequeño posible.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres fallos localizados con su hipótesis escrita.</span></div>
  <div><strong>Si lo tienes</strong><span>Los cinco, y una comprobación que hubiera evitado cada uno.</span></div>
  <div><strong>Reto</strong><span>Rompe tu propio proyecto de forma sutil y cronometra a un compañero.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 17</p>
  <ul class="checklist">
    <li>Separas fallos de cliente de fallos de servidor.</li>
    <li>Usas Network, el registro y la terminal en el orden correcto.</li>
    <li>Sabes arrancar Node con el inspector.</li>
    <li>Reproduces sin navegador antes de investigar.</li>
  </ul>
</div>

---

## Sesión 18 · Auditoría final, revisión por pares y entrega

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se revisa en un proyecto de servidor antes de entregarlo.</li>
    <li><strong>2. Haz:</strong> Audita el tuyo, revisa el de un compañero y corrige.</li>
    <li><strong>3. Comprueba:</strong> Otra persona lo arranca y lo entiende sin ayuda.</li>
  </ol>
</div>

### La lista de auditoría

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · el proyecto</p>
  <ul class="checklist">
    <li>Se arranca con <code>npm start</code> tras un <code>npm install</code>.</li>
    <li><code>node_modules</code> y <code>.env</code> no están en el repositorio; el bloqueo sí.</li>
    <li>Existe <code>.env.example</code> con las claves y sin los valores.</li>
    <li>El README dice cómo arrancarlo y qué rutas ofrece.</li>
    <li>Solo hay una dependencia, y sabes justificarla.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · el servidor</p>
  <ul class="checklist">
    <li>Cada ruta devuelve el código de estado correcto, incluidos los errores.</li>
    <li>Toda entrada se valida antes de tocar los datos.</li>
    <li>Los errores se tratan en un solo sitio y no filtran trazas.</li>
    <li>Cada petición queda registrada con su estado y su tiempo.</li>
    <li>No se puede pedir un fichero fuera de la carpeta pública.</li>
    <li>La escritura del fichero de datos es segura.</li>
    <li>Ninguna operación de disco es síncrona.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · el código</p>
  <ul class="checklist">
    <li>La lógica de negocio no sabe nada de HTTP ni de ficheros.</li>
    <li>Ningún valor de configuración está escrito en el código.</li>
    <li>No queda código comentado ni mensajes de depuración.</li>
    <li>Los nombres están en un solo idioma.</li>
  </ul>
</div>

### Revisión por pares

Intercambia proyectos y, sin preguntar nada:

1. Clónalo, instala y arráncalo. Anota cada tropiezo.
2. Ejecuta su fichero de peticiones y comprueba que hace lo que dice.
3. Envía datos inválidos y mira qué responde.
4. Pide un fichero fuera de la carpeta pública y comprueba si se defiende.
5. Señala una decisión bien tomada y una mejorable, con su razón.

### Defensa

<div class="rule">
  <p class="rule-label">Las preguntas de la defensa</p>
  <ol>
    <li>Enséñame el recorrido completo de una petición <code>POST</code>, desde que llega hasta que se responde.</li>
    <li>¿Por qué escribimos primero el servidor a mano? ¿Qué te resolvió Express exactamente?</li>
    <li>¿Qué pasa si el fichero de datos no existe? ¿Y si el proceso muere escribiéndolo?</li>
    <li>¿Dónde validas, y qué pasaría si solo validaras en el cliente?</li>
    <li>Si mañana los datos vinieran de una base de datos, ¿qué ficheros tocarías?</li>
  </ol>
</div>

### Evaluación

| Criterio | Puntos |
| ---------------------------------------------------------- | -----: |
| El proyecto arranca desde una instalación limpia siguiendo el README | 1 |
| Herramienta de terminal: comandos, ayuda, validación y códigos de salida | 1,5 |
| Acceso a ficheros correcto, con rutas portables y escritura segura | 1,5 |
| Servidor nativo: rutas, métodos y códigos de estado | 2 |
| Estáticos servidos con su tipo de contenido y la ruta protegida | 1 |
| Reescritura con Express equivalente a la versión anterior | 2 |
| Registro de peticiones y errores centralizados | 1 |

No puntúa la cantidad de rutas. Puntúa que sepas decir **qué hace por ti cada pieza de Express**, porque antes lo escribiste tú.

### Entrega

<div class="unit-deliverable">
  <p>El repositorio de <code>mi-api</code> con su README y su <code>.env.example</code>; el CLI del catálogo; el servidor nativo conservado en una rama o carpeta aparte, como prueba de lo que sabes hacer sin framework; el servidor Express con estáticos, registro y errores centralizados; el fichero <code>peticiones.http</code>; las tres listas de auditoría marcadas; la revisión del compañero por escrito; y el informe de la sesión 13.</p>
</div>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 6 · 10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Describe, en orden, el recorrido de una petición POST por tu servidor.</li>
    <li>Un servidor responde 404 a todo. Escribe dos hipótesis y cómo comprobarías cada una.</li>
    <li>¿Por qué escribimos el servidor a mano antes de usar Express? Responde en tres líneas.</li>
  </ol>
</div>
---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Cómo se monta un servicio</figcaption>
  <ol class="flow">
    <li>¿Qué datos hay, y dónde viven?</li>
    <li>¿Qué reglas tienen, sin pensar todavía en HTTP?</li>
    <li>¿Qué se puede pedir desde fuera, con qué método y qué ruta?</li>
    <li>¿Qué responde cada caso, incluidos los que fallan?</li>
    <li>¿Qué queda registrado, y qué no debe salir nunca?</li>
  </ol>
</figure>

### La idea más importante

> **Escríbelo a mano una vez. Después usa el framework sabiendo qué te está resolviendo.**

Vale para Express hoy y para Spring Boot el año que viene. Un framework es un conjunto de respuestas a problemas concretos; si no conoces los problemas, sus respuestas son magia, y la magia no se puede depurar.

Y su pareja, la que gobierna todo lo que viene:

<p class="term">El servidor no se fía de nadie</p>

Todo lo que llega de fuera —el cuerpo de una petición, un parámetro, una ruta de fichero— es sospechoso hasta que se valida. La validación del cliente es comodidad; la del servidor es la única que nadie puede saltarse.

### No memorices Node

* ¿Esto lo resuelve Node de fábrica, o necesito de verdad una dependencia?
* ¿Este valor cambia entre máquinas? Entonces va al entorno.
* ¿Esta operación bloquea el proceso?
* ¿Qué pasa si el fichero no existe, o no tengo permisos?
* ¿De quién es el fallo: 4xx o 5xx?
* ¿Estoy devolviendo información interna en el mensaje de error?
* ¿Quién valida esto, y qué pasa si el cliente miente?
* ¿En qué orden se declaran mis middlewares?
* ¿Esta ruta puede salirse de la carpeta que le corresponde?

### Al terminar deberías poder responder

1. ¿Qué es Node.js y qué desaparece respecto al navegador?
2. ¿Qué hay en `process.argv` y por qué se descartan dos posiciones?
3. ¿Por qué la configuración va en variables de entorno?
4. ¿Qué significa un código de salida distinto de cero?
5. ¿Qué diferencia hay entre ESM y CommonJS?
6. ¿Qué declara `package.json` y para qué sirven sus scripts?
7. ¿Qué acepta `^1.2.3`?
8. ¿Para qué sirve `package-lock.json` y por qué se sube?
9. ¿Por qué no se sube `node_modules`?
10. ¿Qué te preguntas antes de instalar una dependencia?
11. ¿Por qué usamos la API de ficheros con promesas y no la síncrona?
12. ¿Qué significa `ENOENT` y cómo se trata?
13. ¿Por qué se componen las rutas con `path.join`?
14. ¿Por qué se escribe en un temporal y se renombra?
15. ¿Qué dos límites tiene un fichero JSON como almacén?
16. ¿Qué diferencia hay entre un error esperable y uno inesperado?
17. ¿Qué hace un servidor HTTP, paso a paso, con cada petición?
18. ¿Qué tres cosas se escriben en una respuesta?
19. ¿Por qué el cuerpo de la petición se lee por trozos?
20. ¿Qué significan 200, 201, 400, 404, 405 y 500?
21. ¿Qué dice la familia del código sobre de quién es el problema?
22. ¿Qué es el *path traversal* y cómo se evita?
23. ¿Por qué hay que enviar el tipo de contenido correcto?
24. ¿Qué seis problemas del servidor a mano resuelve Express?
25. ¿Qué hace `express.json()` y dónde se declara?
26. ¿Qué es un middleware y qué pasa si no llama a `next`?
27. ¿Cómo se distingue un manejador de errores de un middleware normal?
28. ¿Por qué el cliente nunca debe ver una traza?
29. ¿Cómo averiguas si un fallo es del cliente o del servidor?
30. ¿Por qué desaparece el problema de CORS al servir todo desde el mismo origen?

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Node.js | Un entorno para ejecutar JavaScript fuera del navegador |
| Proceso | El programa en ejecución, con sus argumentos y su entorno |
| Variable de entorno | Configuración que vive fuera del código |
| Código de salida | El número con el que termina un programa: 0 es éxito |
| ESM / CommonJS | Los dos sistemas de módulos: el estándar y el heredado |
| `package.json` | La ficha del proyecto: scripts y dependencias |
| Versionado semántico | Mayor, menor y parche, y qué compatibilidad implica cada uno |
| Fichero de bloqueo | El registro de las versiones exactas instaladas |
| Operación síncrona | La que bloquea el proceso hasta terminar |
| `ENOENT` | Código de error: no existe el fichero o la carpeta |
| Escritura atómica | Escribir en un temporal y renombrar, para no dejar datos a medias |
| Puerto | El número por el que un servidor escucha |
| Petición / respuesta | Lo que envía el cliente / lo que devuelve el servidor |
| Código de estado | El número que resume qué ha pasado con la petición |
| Estático | Fichero servido tal cual desde el disco |
| Tipo de contenido | La cabecera que dice qué es lo que se envía |
| *Path traversal* | Salirse de la carpeta permitida con tramos de ruta |
| Framework | Un conjunto de soluciones a problemas repetidos |
| Middleware | Un paso de la cadena por la que pasa cada petición |
| Manejador de errores | El middleware de cuatro parámetros que decide qué se responde |
| Traza | El detalle técnico de un error: para el registro, no para el cliente |

### La siguiente unidad

Ya tienes un servidor que sirve tu web y responde a algunas rutas. Lo que todavía no tienes es **una API diseñada**.

<figure class="diagram">
  <figcaption>Lo que falta</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Rutas sueltas</li>
    <li>Recursos y contrato</li>
    <li>Capas y persistencia</li>
    <li>Cliente y servidor, de punta a punta</li>
  </ol>
</figure>

En la UD6 tus rutas dejarán de ser una colección de casos y pasarán a ser el diseño de un recurso: el CRUD completo, la separación en capas, un contrato de errores estable, la web servida y consumiendo su propia API, y la configuración y las comprobaciones que hacen falta para poder publicarlo. Cierra el módulo, y deja el camino hecho para el módulo de servidor.

---
title: "Servidor web y API con Node"
label: "UD6 · Guía y taller práctico"
section: "ud-06"
order: 6
lang: "es"
summary: "La unidad que cierra el módulo. Las rutas sueltas de la UD5 se convierten en una API diseñada: recursos, contrato, CRUD completo, capas separadas y un cliente que consume su propia API de punta a punta, con la configuración y las pruebas necesarias para publicarla."
duration: "18 sesiones · 6 semanas"
modality: "Individual, con retos y defensa técnica final"
deliverable: "Una aplicación web completa: API REST con CRUD, validación y contrato de errores estable; capas separadas; la web de las unidades anteriores servida desde el mismo origen y consumiendo su propia API; configuración por entorno, seguridad mínima, pruebas automáticas, documentación y despliegue."
outcomes:
  - "Diseñar una API REST a partir de sus recursos, no de las pantallas que la usan."
  - "Elegir método, ruta y código de estado para cada operación, y sostener ese contrato."
  - "Implementar el CRUD completo con validación de entrada en todas las operaciones."
  - "Separar rutas, servicio y repositorio, de forma que cambiar el almacén no toque las rutas."
  - "Definir un contrato de errores estable y usarlo desde el cliente."
  - "Generar HTML en el servidor escapando el contenido que viene de fuera."
  - "Conectar el cliente de la UD4 con la API propia, incluidos los formularios."
  - "Configurar la aplicación por entorno y aplicar la seguridad mínima exigible."
  - "Escribir pruebas automáticas de la API con el ejecutor incluido en Node."
  - "Documentar y desplegar el servicio, y defender técnicamente las decisiones tomadas."
requirements:
  - "El proyecto mi-api de la UD5, con Express, estáticos, registro y errores centralizados."
  - "El sitio de la UD1 a la UD4."
  - "Node.js 22 o superior, npm, un cliente HTTP y una cuenta en una plataforma de despliegue gratuita."
priorKnowledge:
  - "HTTP: métodos, rutas, cabeceras y códigos de estado (UD4 y UD5)."
  - "Express: rutas, middleware, estáticos y manejo central de errores (UD5)."
  - "Estado, render y fetch con sus estados de carga, error y vacío (UD4)."
  - "Validación, JSON y módulos (UD3)."
date: "2026-09-04"
---

## ¿Qué vas a aprender?

En la UD5 conseguiste algo importante: un servidor tuyo, que responde. Pero responde a un puñado de rutas que fueron apareciendo según hacían falta.

Esta unidad convierte eso en un **diseño**.

<figure class="diagram">
  <figcaption>De dónde vienes y a dónde llegas</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Rutas que funcionan</li>
    <li>Una API diseñada</li>
    <li>Una aplicación completa</li>
    <li>Publicada y defendida</li>
  </ol>
</figure>

Y cierra el módulo entero. Al terminar habrás recorrido el camino completo: un documento con significado, un diseño que se adapta, una lógica que decide, una interfaz que reacciona, un servidor que responde y una aplicación que se publica.

### La idea que gobierna la unidad

<p class="term">Una API es un contrato</p>

Cuando alguien construye un cliente contra tu API, se apoya en que `GET /api/productos/7` seguirá devolviendo lo mismo mañana, con la misma forma, y que un error seguirá teniendo la misma estructura. Cambiar eso sin avisar rompe programas ajenos.

<div class="rule">
  <p class="rule-label">Diseña por recursos, no por pantallas</p>
  <p>La tentación es crear una ruta por cada cosa que necesita la interfaz: <code>/api/datosDeLaPaginaDeInicio</code>. Funciona hoy y ata la API a un diseño concreto: cambia la pantalla y hay que cambiar el servidor.</p>
  <p>Una API se diseña sobre lo que existe en el problema —productos, categorías, pedidos— y sobre las operaciones que se hacen con ello. Las pantallas combinan esas piezas; no las definen.</p>
</div>

---

## El proyecto de la unidad

El mismo `mi-api` de la UD5, que crece hasta ser una aplicación:

```text
mi-api/
│
├── package.json
├── .env.example
├── README.md
│
├── datos/
│   └── productos.json
│
├── src/
│   ├── servidor.js         ← arranque y configuración
│   ├── app.js              ← la aplicación Express
│   ├── rutas/
│   │   ├── productos.js
│   │   └── paginas.js
│   ├── servicio/
│   │   └── productos.js    ← las reglas
│   ├── repositorio/
│   │   └── productos.js    ← el acceso a los datos
│   ├── middleware/
│   │   ├── registro.js
│   │   └── errores.js
│   └── vistas/
│       └── catalogo.js     ← HTML generado en el servidor
│
├── pruebas/
│   └── productos.test.js
│
└── publico/                ← el cliente de la UD4
```

<div class="unit-deliverable">
  <p>Una aplicación desplegada y accesible por URL: la web navegable, su API REST con el CRUD completo y su contrato de errores, las capas separadas, la configuración por entorno, las pruebas automáticas en verde y el README que explica cómo funciona.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 1 · el andamiaje se retira</p>
  <p>En la UD1 recibías cada paso explicado. Aquí recibes una especificación y decides tú la implementación. Habrá menos código en estos apuntes y más criterios, porque lo que se evalúa ya no es si sabes escribir una ruta, sino si sabes decidir cuál hace falta.</p>
</div>

<div class="rule">
  <p class="rule-label">Condición 2 · nada llega al cliente sin validar, nada sale sin decidir</p>
  <p>Todo lo que entra se valida en el servidor. Y todo lo que sale es una decisión: qué campos se devuelven, qué se oculta y qué se registra. Un objeto entero volcado en una respuesta acaba enseñando cosas que no debía.</p>
</div>

---

## Plan de trabajo semanal

| Semana | Bloque temático | Práctica central | Horas |
| :---: | :--- | :--- | :---: |
| **Semana 1** | Diseñar la API | Recursos, contrato y estructura por capas | 3 h |
| **Semana 2** | El CRUD completo | Lectura, creación, modificación y borrado | 3 h |
| **Semana 3** | Capas y consistencia | Servicio, repositorio y contrato de errores | 3 h |
| **Semana 4** | La web y su API | HTML del servidor y cliente conectado | 3 h |
| **Semana 5** | Listo para publicar | Configuración, seguridad y pruebas | 3 h |
| **Semana 6** | Cierre del módulo | Proyecto final, despliegue y defensa | 3 h |
| **Total** | | **Una aplicación web completa y publicada** | **18 h** |

<figure class="diagram">
  <figcaption>El ritmo de cada sesión</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Recupera · 5 min</li>
    <li>Decide y diseña · 10–20 min</li>
    <li>Implementa · 30–40 min</li>
    <li>Cierra · 5 min</li>
  </ol>
</figure>

### No todo pesa lo mismo

<div class="learning-priorities">
  <div class="learning-priorities__essential">
    <strong>Esencial · debes dominarlo</strong>
    <span>Diseño por recursos, CRUD completo, códigos de estado, validación, capas y contrato de errores.</span>
  </div>
  <div class="learning-priorities__important">
    <strong>Importante · debes saber aplicarlo</strong>
    <span>Escapado del HTML generado, configuración por entorno, CORS, seguridad mínima y pruebas.</span>
  </div>
  <div class="learning-priorities__extra">
    <strong>Ampliación · cuando lo anterior funciona</strong>
    <span>Paginación, versionado de la API, limitación de peticiones y documentación generada.</span>
  </div>
</div>

---

## Semana 1 · Diseñar la API

---

## Sesión 1 · Qué es una API REST

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué significa REST, y qué distingue una API bien diseñada de un conjunto de rutas.</li>
    <li><strong>2. Haz:</strong> Analiza dos APIs reales y detecta sus decisiones de diseño.</li>
    <li><strong>3. Comprueba:</strong> Distingues una ruta orientada al recurso de una orientada a la pantalla.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Escribe las rutas que tiene hoy tu servidor. ¿Se parecen entre sí?</li>
    <li>Si mañana alguien más las usara, ¿podría adivinar la siguiente?</li>
    <li>¿Qué información necesitaría para usarlas sin preguntarte?</li>
  </ol>
</div>

### Recursos, no acciones

<p class="term">Recurso</p>

Una cosa del problema que se puede identificar con una URL: un producto, una categoría, un pedido. La ruta nombra el recurso; el método dice qué se hace con él.

| Con acciones en la ruta | Orientado a recursos |
| ----------------------- | -------------------- |
| `GET /obtenerProductos` | `GET /api/productos` |
| `GET /verProducto?id=7` | `GET /api/productos/7` |
| `POST /crearProducto` | `POST /api/productos` |
| `POST /borrarProducto` | `DELETE /api/productos/7` |

La columna derecha tiene una propiedad que la izquierda no: es **predecible**. Quien conozca dos rutas sabe escribir la tercera.

### Los principios que vamos a aplicar

<figure class="diagram">
  <figcaption>Lo que hace REST a una API</figcaption>
  <ol class="flow">
    <li>Las cosas se identifican con URLs</li>
    <li>El método dice la operación</li>
    <li>El código de estado dice el resultado</li>
    <li>Cada petición se entiende sola, sin estado guardado entre ellas</li>
    <li>La representación es JSON, con una forma constante</li>
  </ol>
</figure>

<p class="term">Sin estado</p>

El servidor no recuerda nada entre una petición y la siguiente. Todo lo necesario viaja en la petición. Es lo que permite que dos copias del servidor atiendan al mismo cliente sin coordinarse, y es la razón de que la autenticación se resuelva con algo que se envía en cada llamada.

### Nombrar bien

| Regla | Ejemplo |
| ----- | ------- |
| Sustantivos en plural | `/api/productos`, no `/api/producto` |
| Minúsculas y guiones | `/api/categorias-destacadas` |
| Jerarquía para lo que pertenece | `/api/categorias/teclados/productos` |
| Filtros en la consulta | `/api/productos?categoria=teclados&max=100` |
| Sin verbos | El verbo ya es el método |

<div class="rule">
  <p class="rule-label">Filtrar no es una ruta nueva</p>
  <p>Los productos baratos no son un recurso distinto de los productos: son los mismos, filtrados. Van en la cadena de consulta, no en la ruta.</p>
  <p>La prueba: si al añadir un filtro nuevo tienes que crear una ruta nueva, acabarás con quince rutas que devuelven lo mismo con distinta condición.</p>
</div>

### Tarea 1 · Analizar y diseñar

1. Explora dos APIs públicas y anota diez rutas de cada una.
2. Clasifícalas: ¿orientadas a recursos o a acciones?
3. Localiza cómo filtran, cómo paginan y cómo devuelven los errores.
4. Diseña sobre papel la tabla de rutas de **tu** proyecto: método, ruta, qué hace, qué devuelve y con qué código.
5. Enséñasela a un compañero y comprueba si puede adivinar una ruta que no le has enseñado.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La tabla de rutas de tu proyecto, con al menos siete entradas.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade un segundo recurso con relación con el primero.</span></div>
  <div><strong>Reto</strong><span>Encuentra en una API real una decisión de diseño discutible y argumenta cómo la harías tú.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Distingues una ruta orientada al recurso de una orientada a la acción.</li>
    <li>Sabes dónde van los filtros.</li>
    <li>Explicas qué significa que una API no guarde estado.</li>
    <li>Tienes la tabla de rutas de tu proyecto.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué las rutas no llevan verbos?</li>
    <li>¿Dónde van los filtros?</li>
    <li>¿Qué significa que el servidor no guarde estado?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el verbo ya lo aporta el método HTTP.</p>
  <p>2 · En la cadena de consulta: no son recursos distintos.</p>
  <p>3 · Que no recuerda nada entre peticiones: cada una trae todo lo que necesita.</p>
</details>

---

## Sesión 2 · El contrato: rutas, códigos y formas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué compone el contrato de una API y por qué no se rompe a la ligera.</li>
    <li><strong>2. Haz:</strong> Escribe el contrato completo de tu API antes de implementarlo.</li>
    <li><strong>3. Comprueba:</strong> Otra persona podría escribir el cliente solo con tu contrato.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si cambias el nombre de un campo de la respuesta, ¿qué se rompe?</li>
    <li>¿Cómo sabría un cliente distinguir «no existe» de «se rompió»?</li>
    <li>¿Qué debe devolver una creación correcta?</li>
  </ol>
</div>

### Lo que forma el contrato

| Pieza | Qué fija |
| ----- | -------- |
| Ruta y método | Cómo se pide cada operación |
| Cuerpo de la petición | Qué campos se envían y de qué tipo |
| Código de estado | Qué ha pasado |
| Cuerpo de la respuesta | Qué campos vuelven y con qué nombre |
| Formato de error | La misma forma, siempre |

### La tabla de tu API

| Método | Ruta | Éxito | Errores |
| ------ | ---- | :---: | ------- |
| GET | `/api/productos` | 200 | 500 |
| GET | `/api/productos/:id` | 200 | 400, 404 |
| POST | `/api/productos` | 201 | 400 |
| PUT | `/api/productos/:id` | 200 | 400, 404 |
| PATCH | `/api/productos/:id` | 200 | 400, 404 |
| DELETE | `/api/productos/:id` | 204 | 400, 404 |

El 400 de las rutas con identificador no es un capricho: `/api/productos/abc` es una petición mal formada, y responder 404 a eso confunde «no existe» con «no me has pedido bien».

### El formato de error

```json
{
  "error": "Los datos no son válidos",
  "codigo": "VALIDACION",
  "detalles": [
    { "campo": "precio", "mensaje": "Debe ser un número mayor que cero" },
    { "campo": "nombre", "mensaje": "Es obligatorio" }
  ]
}
```

<div class="rule">
  <p class="rule-label">Un solo formato de error, en toda la API</p>
  <p>Si un error llega a veces como texto plano, a veces como <code>{ error }</code> y a veces como <code>{ mensaje }</code>, el cliente necesita un tratamiento distinto para cada ruta, y ninguno para las que todavía no existen.</p>
  <p>Con una forma única, el cliente escribe una función de tratamiento de errores y vale para toda la API, hoy y cuando crezca. El campo <code>codigo</code> permite además reaccionar por programa sin depender del texto, que puede traducirse o reescribirse.</p>
</div>

### Métodos: qué se puede repetir

| Método | Repetirlo dos veces |
| ------ | ------------------- |
| GET | No cambia nada |
| PUT | Deja el mismo resultado |
| DELETE | El segundo no borra nada nuevo |
| POST | **Crea otro** |

Esa propiedad —que repetir la operación no cambie el resultado— es la que permite que un cliente reintente sin miedo cuando la red falla. Con POST no se puede, y por eso los formularios que se envían dos veces crean dos pedidos.

### Tarea 2 · El contrato escrito

1. Escribe la tabla completa de tu API, con éxitos y errores por ruta.
2. Define el objeto que representa un producto: campos, tipos y cuáles son obligatorios.
3. Define el formato único de error, con sus códigos.
4. Escribe `peticiones.http` con un ejemplo de cada caso, incluidos los que fallan.
5. Dale el contrato a un compañero y que escriba, sobre papel, cómo llamaría a tres rutas.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Contrato completo y fichero de peticiones con todos los casos.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade paginación al contrato y decide qué devuelve la respuesta.</span></div>
  <div><strong>Reto</strong><span>Documenta qué cambiarías si mañana hiciera falta la versión 2 sin romper la 1.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Tu contrato cubre método, ruta, cuerpo, estado y respuesta.</li>
    <li>Todos los errores tienen la misma forma.</li>
    <li>Distingues 400 de 404 en la misma ruta.</li>
    <li>Sabes qué operaciones se pueden repetir sin consecuencias.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué código devuelve una creación correcta?</li>
    <li>¿Qué responde <code>/api/productos/abc</code>?</li>
    <li>¿Por qué un formato único de error facilita el cliente?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Un 201, con la cabecera <code>Location</code>.</p>
  <p>2 · Un 400: la petición está mal formada, no es que el recurso no exista.</p>
  <p>3 · Porque permite escribir un solo tratamiento válido para toda la API.</p>
</details>

---

## Sesión 3 · Router y estructura

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se reparte una aplicación Express en ficheros y qué hace un router.</li>
    <li><strong>2. Haz:</strong> Reorganiza tu proyecto con la estructura de la unidad.</li>
    <li><strong>3. Comprueba:</strong> Cada fichero se explica en una frase y el arranque queda separado de la aplicación.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántas líneas tiene hoy tu <code>servidor.js</code>?</li>
    <li>¿Qué partes cambiarían si añadieras un segundo recurso?</li>
    <li>¿Cómo probarías tu aplicación sin levantar un servidor?</li>
  </ol>
</div>

### Un router por recurso

```javascript
// src/rutas/productos.js
import { Router } from "express";

const router = Router();

router.get("/", listarProductos);
router.get("/:id", obtenerProducto);
router.post("/", crearProducto);
router.put("/:id", reemplazarProducto);
router.delete("/:id", borrarProducto);

export default router;
```

```javascript
// src/app.js
import express from "express";
import productos from "./rutas/productos.js";

export function crearApp() {
  const app = express();

  app.use(express.json({ limit: "100kb" }));
  app.use(registro);
  app.use(express.static("publico"));

  app.use("/api/productos", productos);

  app.use(noEncontrado);
  app.use(manejadorDeErrores);
  return app;
}
```

Las rutas del router son **relativas** al punto donde se monta, así que la ruta base aparece una sola vez. Cambiar `/api/productos` por `/api/v1/productos` es cambiar una línea.

### Separar la aplicación del arranque

```javascript
// src/servidor.js
import { crearApp } from "./app.js";

const PUERTO = Number(process.env.PUERTO ?? 3000);
crearApp().listen(PUERTO, () => console.log(`Escuchando en el puerto ${PUERTO}`));
```

<div class="rule">
  <p class="rule-label">Quien crea la aplicación no debe arrancarla</p>
  <p>Si <code>app.js</code> llama a <code>listen</code>, importarlo desde una prueba levanta un servidor de verdad, ocupa un puerto y obliga a apagarlo después.</p>
  <p>Con la aplicación por un lado y el arranque por otro, las pruebas de la sesión 15 importan la aplicación y le hacen peticiones sin abrir ningún puerto. Es una decisión de dos líneas que decide si tu proyecto se puede probar.</p>
</div>

### El orden, otra vez

<figure class="diagram">
  <figcaption>El orden de la cadena</figcaption>
  <ol class="flow">
    <li>Analizador del cuerpo y registro</li>
    <li>Estáticos</li>
    <li>Routers de la API</li>
    <li>404 para lo que no encajó</li>
    <li>Manejador de errores, siempre el último</li>
  </ol>
</figure>

### Tarea 3 · Reorganizar

1. Crea `src/app.js` con `crearApp()` y deja `servidor.js` solo con el arranque.
2. Mueve las rutas de productos a su router.
3. Mueve el registro y los errores a `src/middleware/`.
4. Comprueba que todo sigue funcionando con tu fichero de peticiones.
5. Añade un segundo router vacío para un recurso nuevo y monta su ruta base.
6. Escribe en cada fichero la frase que lo describe.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Aplicación separada del arranque y rutas en su router.</span></div>
  <div><strong>Si lo tienes</strong><span>Monta la API bajo <code>/api/v1</code> cambiando una sola línea.</span></div>
  <div><strong>Reto</strong><span>Escribe un pequeño programa que importe la aplicación y le haga una petición sin levantar el puerto.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 1</p>
  <ul class="checklist">
    <li>Tu API está diseñada por recursos y escrita como contrato.</li>
    <li>Todos los errores comparten forma.</li>
    <li>Cada recurso tiene su router.</li>
    <li>La aplicación se puede crear sin arrancarla.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para poder importarla en las pruebas sin ocupar un puerto.</p>
  <p>2 · Relativas al punto donde se monta el router.</p>
  <p>3 · El manejador de errores, después incluso del 404.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 1 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Reescribe orientadas a recursos: <code>/obtenerProductos</code> y <code>/borrarProducto?id=7</code>.</li>
    <li>Di qué código de estado devuelve cada operación del CRUD cuando va bien.</li>
    <li>¿Por qué la aplicación se crea en un fichero y se arranca en otro?</li>
  </ol>
</div>
---

## Semana 2 · El CRUD completo

---

## Sesión 4 · Leer: listar, filtrar y obtener

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se implementan las lecturas, con filtros, orden y paginación.</li>
    <li><strong>2. Haz:</strong> Las dos rutas de lectura de tu recurso, completas.</li>
    <li><strong>3. Comprueba:</strong> Un parámetro inválido no rompe nada ni devuelve algo raro.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué debe devolver <code>/api/productos?max=abc</code>?</li>
    <li>¿Y <code>/api/productos?categoria=inexistente</code>?</li>
    <li>¿Qué diferencia hay entre esas dos situaciones?</li>
  </ol>
</div>

### Listar con filtros

```javascript
export async function listarProductos(peticion, respuesta, next) {
  try {
    const { categoria, max, orden, q } = peticion.query;
    const productos = await servicio.listar({ categoria, max, orden, busqueda: q });
    respuesta.json(productos);
  } catch (error) {
    next(error);
  }
}
```

La ruta **no filtra**: recoge los parámetros y se los pasa al servicio. Las funciones que hacen el trabajo son las de la UD3, que no saben nada de HTTP, y por eso las mismas sirven aquí y en el CLI.

### Los parámetros llegan como texto

```javascript
const maximo = max === undefined ? null : Number(max);
if (maximo !== null && (Number.isNaN(maximo) || maximo < 0)) {
  throw new ErrorDeValidacion([{ campo: "max", mensaje: "Debe ser un número no negativo" }]);
}
```

<div class="rule">
  <p class="rule-label">Un filtro inválido es un 400; un filtro sin resultados es un 200 vacío</p>
  <p>Pedir <code>max=abc</code> es una petición mal formada: 400 con su detalle. Pedir una categoría que existe pero no tiene productos es una petición perfectamente válida cuya respuesta es una lista vacía, con 200.</p>
  <p>Devolver 404 por una lista vacía es un error de diseño frecuente: la colección existe, y el cliente sabe leer un array de cero elementos.</p>
</div>

### Obtener uno

```javascript
export async function obtenerProducto(peticion, respuesta, next) {
  try {
    const id = Number(peticion.params.id);
    if (!Number.isInteger(id) || id < 1) {
      throw new ErrorDeValidacion([{ campo: "id", mensaje: "Debe ser un entero positivo" }]);
    }

    const producto = await servicio.obtener(id);
    if (!producto) throw new ErrorNoEncontrado("Producto no encontrado");

    respuesta.json(producto);
  } catch (error) {
    next(error);
  }
}
```

### Decidir qué se devuelve

```javascript
function aRespuesta({ id, nombre, precio, categoria, stock }) {
  return { id, nombre, precio, categoria, disponible: stock > 0 };
}
```

Devolver el objeto tal cual está guardado es cómodo y expone lo que no toca: notas internas, márgenes, el propio stock. Una función que decide la forma pública del recurso deja explícito qué sale, y evita que añadir un campo interno lo publique sin querer.

### Tarea 4 · Las lecturas completas

1. Implementa la lista con filtro por categoría, texto y precio máximo.
2. Añade orden por dos campos, ascendente y descendente.
3. Implementa la obtención por identificador con sus dos errores.
4. Valida todos los parámetros y responde 400 con detalles.
5. Escribe la función que decide la forma pública del recurso.
6. Prueba los ocho casos con tu fichero de peticiones.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las dos rutas con filtros validados y los códigos correctos.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade paginación con <code>limite</code> y <code>pagina</code>, y devuelve el total.</span></div>
  <div><strong>Reto</strong><span>Permite elegir los campos devueltos con un parámetro, validando los nombres.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 4</p>
  <ul class="checklist">
    <li>La ruta recoge y valida; el servicio decide.</li>
    <li>Un filtro inválido responde 400 con detalle.</li>
    <li>Una búsqueda sin resultados responde 200 y una lista vacía.</li>
    <li>Decides explícitamente qué campos salen.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Un 400: el parámetro está mal formado.</p>
  <p>2 · Un 200 con una lista vacía: la petición era válida.</p>
  <p>3 · Para no publicar campos internos al añadirlos al modelo.</p>
</details>

---

## Sesión 5 · Crear y validar

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se recibe un recurso nuevo, se valida y se responde.</li>
    <li><strong>2. Haz:</strong> La ruta de creación con validación completa.</li>
    <li><strong>3. Comprueba:</strong> Ninguna entrada inválida llega a tocar los datos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué pasaría si alguien envía un campo <code>id</code> en la creación?</li>
    <li>¿Y un campo que no existe en tu modelo?</li>
    <li>¿Puede el cliente saltarse tu validación de la UD4?</li>
  </ol>
</div>

### La ruta

```javascript
export async function crearProducto(peticion, respuesta, next) {
  try {
    const datos = validarProductoNuevo(peticion.body);   // lanza si no vale
    const creado = await servicio.crear(datos);

    respuesta
      .status(201)
      .location(`/api/productos/${creado.id}`)
      .json(aRespuesta(creado));
  } catch (error) {
    next(error);
  }
}
```

### La validación, en tres pasos

```javascript
const CAMPOS_PERMITIDOS = ["nombre", "precio", "categoria", "stock", "descripcion"];

export function validarProductoNuevo(cuerpo) {
  if (cuerpo === null || typeof cuerpo !== "object" || Array.isArray(cuerpo)) {
    throw new ErrorDeValidacion([{ campo: "cuerpo", mensaje: "Se esperaba un objeto JSON" }]);
  }

  const errores = [];
  const limpio = {};

  // 1 · solo lo permitido entra
  for (const campo of CAMPOS_PERMITIDOS) {
    if (cuerpo[campo] !== undefined) limpio[campo] = cuerpo[campo];
  }

  // 2 · obligatorios y tipos
  if (typeof limpio.nombre !== "string" || limpio.nombre.trim() === "") {
    errores.push({ campo: "nombre", mensaje: "Es obligatorio" });
  }
  const precio = Number(limpio.precio);
  if (Number.isNaN(precio) || precio <= 0) {
    errores.push({ campo: "precio", mensaje: "Debe ser un número mayor que cero" });
  }

  // 3 · todos los errores a la vez
  if (errores.length > 0) throw new ErrorDeValidacion(errores);

  return { ...limpio, nombre: limpio.nombre.trim(), precio };
}
```

<div class="rule">
  <p class="rule-label">Lista blanca, no lista negra</p>
  <p>Copiar el cuerpo entero al objeto guardado —lo que hace un <code>{ ...peticion.body }</code> sin filtrar— permite a quien llama meter campos que tú no habías previsto: un <code>id</code> que pisa el tuyo, un <code>rol</code> que no debería poder tocar, o basura que se queda en tus datos para siempre.</p>
  <p>Enumera los campos que aceptas y descarta el resto. Es una línea más y cierra una familia entera de agujeros.</p>
</div>

### El identificador lo pone el servidor

Quien crea no elige el identificador: lo asigna el servidor y lo devuelve. Por eso la respuesta incluye el recurso creado y la cabecera `Location` con su URL, y por eso `id` no está entre los campos permitidos.

### Recordar de dónde viene esto

<figure class="diagram">
  <figcaption>Las tres validaciones, otra vez</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Nativa · comodidad</li>
    <li>Cliente · buena experiencia</li>
    <li>Servidor · la única obligatoria</li>
  </ol>
</figure>

Cualquiera puede llamar a tu API con un cliente HTTP y saltarse las dos primeras. Compruébalo hoy mismo: envía desde tu fichero `.http` un producto con precio negativo y mira qué pasa.

### Tarea 5 · La creación

1. Implementa `POST /api/productos` con validación en tres pasos.
2. Devuelve 201, `Location` y el recurso creado.
3. Devuelve 400 con **todos** los errores, no solo el primero.
4. Descarta los campos no permitidos y demuéstralo enviando uno de más.
5. Intenta crear un producto saltándote el formulario y comprueba que la API se defiende.
6. Comprueba qué ocurre si el cuerpo no es JSON válido.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Creación con validación completa, 201 y <code>Location</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Responde 409 si ya existe un producto con el mismo nombre.</span></div>
  <div><strong>Reto</strong><span>Escribe la validación como una tabla de reglas declarada como dato, y aplícala en bucle.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 5</p>
  <ul class="checklist">
    <li>Solo entran los campos permitidos.</li>
    <li>Se devuelven todos los errores de una vez.</li>
    <li>El identificador lo asigna el servidor.</li>
    <li>Has comprobado tú mismo que la validación del cliente se salta.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Se descarta: solo se aceptan los campos de la lista.</p>
  <p>2 · Un 201 con <code>Location</code> y el recurso creado.</p>
  <p>3 · Sí, con cualquier cliente HTTP: por eso la del servidor es la que cuenta.</p>
</details>

---

## Sesión 6 · Modificar y borrar

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> La diferencia entre reemplazar y modificar, y cómo se borra bien.</li>
    <li><strong>2. Haz:</strong> Completa el CRUD de tu recurso.</li>
    <li><strong>3. Comprueba:</strong> Repetir una operación no produce efectos distintos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si envías solo el precio, ¿qué debería pasar con los demás campos?</li>
    <li>¿Qué responde un borrado de algo que ya no existe?</li>
    <li>¿Qué pasa si dos personas modifican el mismo producto a la vez?</li>
  </ol>
</div>

### PUT y PATCH

| Método | Significa | Cuerpo |
| ------ | --------- | ------ |
| PUT | Reemplaza el recurso entero | Todos los campos |
| PATCH | Modifica los campos enviados | Solo los que cambian |

```javascript
// PUT: lo que no llega, se pierde
const reemplazo = validarProductoNuevo(peticion.body);
const actualizado = await servicio.reemplazar(id, reemplazo);

// PATCH: se combina con lo que había
const cambios = validarCambios(peticion.body);      // ninguno obligatorio
const actualizado = await servicio.modificar(id, cambios);
```

El error clásico es implementar PUT combinando los campos: entonces tienes dos rutas que hacen lo mismo y un contrato que miente. Si solo vas a ofrecer una, ofrece PATCH y dilo en el contrato.

### Borrar

```javascript
const borrado = await servicio.borrar(id);
if (!borrado) throw new ErrorNoEncontrado("Producto no encontrado");
respuesta.status(204).end();
```

Un 204 no lleva cuerpo: la operación ha ido bien y no hay nada que devolver. Y sobre el segundo borrado hay dos posturas defendibles —404 porque ya no está, o 204 porque el resultado deseado se cumple— pero elige una **y escríbela en el contrato**.

### Modificaciones que se pisan

<div class="rule">
  <p class="rule-label">Leer, modificar y guardar no es una operación indivisible</p>
  <p>Dos peticiones que llegan casi a la vez leen la misma versión del fichero, cada una aplica su cambio y la segunda escribe encima: el cambio de la primera desaparece sin que nadie se entere.</p>
  <p>Con un fichero y poco tráfico es improbable, pero conviene saber nombrarlo. Se resuelve con una versión en el recurso, que el cliente devuelve al modificar: si no coincide, el servidor responde 409 en lugar de pisar. Es el mismo problema que en el módulo de servidor se resuelve con transacciones.</p>
</div>

### Tarea 6 · El CRUD cerrado

1. Implementa PATCH con validación de los campos enviados.
2. Decide si ofreces PUT; si lo haces, que reemplace de verdad.
3. Implementa DELETE con 204 y su comportamiento documentado.
4. Comprueba que repetir PATCH y DELETE no produce efectos distintos.
5. Actualiza `peticiones.http` con todos los casos nuevos.
6. Añade una fecha de modificación que el servidor mantiene.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>CRUD completo con los códigos del contrato.</span></div>
  <div><strong>Si lo tienes</strong><span>Impide modificar campos que el cliente no debería tocar.</span></div>
  <div><strong>Reto</strong><span>Implementa la versión del recurso y devuelve 409 cuando no coincida.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 2</p>
  <ul class="checklist">
    <li>Las cinco operaciones funcionan según tu contrato.</li>
    <li>Toda entrada se valida antes de tocar los datos.</li>
    <li>Cada operación devuelve el código y el cuerpo acordados.</li>
    <li>Tu fichero de peticiones cubre también los casos que fallan.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Con PUT se pierden; con PATCH se conservan.</p>
  <p>2 · Un 204 sin cuerpo, si se borró.</p>
  <p>3 · Que la segunda escritura pise a la primera sin que nadie lo note.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 2 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li><code>/api/productos?max=abc</code> y <code>/api/productos?categoria=inexistente</code>: qué código devuelve cada uno y por qué.</li>
    <li>Explica qué es una lista blanca de campos y qué evita.</li>
    <li>Diferencia entre PUT y PATCH, con un ejemplo de tu proyecto.</li>
  </ol>
</div>
---

## Semana 3 · Capas y consistencia

---

## Sesión 7 · Separar en capas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué hace cada capa y qué no debe saber ninguna de ellas.</li>
    <li><strong>2. Haz:</strong> Separa ruta, servicio y repositorio en tu proyecto.</li>
    <li><strong>3. Comprueba:</strong> Puedes cambiar el almacén sin tocar una sola ruta.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántos ficheros tocarías hoy si cambiaras el fichero JSON por una base de datos?</li>
    <li>¿Hay alguna función que sepa a la vez de HTTP y de ficheros?</li>
    <li>¿Dónde vive la regla «no se puede borrar un producto con stock»?</li>
  </ol>
</div>

### Las tres capas

<figure class="diagram">
  <figcaption>Qué sabe cada capa</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Ruta · HTTP</li>
    <li>Servicio · las reglas</li>
    <li>Repositorio · el almacén</li>
  </ol>
</figure>

| Capa | Sabe de | No sabe de |
| ---- | ------- | ---------- |
| Ruta | Peticiones, respuestas y códigos | Ficheros ni reglas de negocio |
| Servicio | Reglas y validaciones | HTTP ni de dónde salen los datos |
| Repositorio | Cómo se guardan y se leen | Reglas ni HTTP |

```javascript
// repositorio/productos.js
export async function porId(id) {
  const productos = await leerProductos();
  return productos.find((p) => p.id === id) ?? null;
}

// servicio/productos.js
export async function borrar(id) {
  const producto = await repositorio.porId(id);
  if (!producto) return false;
  if (producto.stock > 0) throw new ErrorDeConflicto("No se puede borrar con stock");
  return repositorio.eliminar(id);
}

// rutas/productos.js
export async function borrarProducto(peticion, respuesta, next) {
  try {
    const borrado = await servicio.borrar(Number(peticion.params.id));
    if (!borrado) throw new ErrorNoEncontrado("Producto no encontrado");
    respuesta.status(204).end();
  } catch (error) {
    next(error);
  }
}
```

<div class="rule">
  <p class="rule-label">La prueba de que las capas están bien separadas</p>
  <p>Busca en tu servicio la palabra <code>respuesta</code>, y en tu repositorio la palabra <code>peticion</code>. Si aparecen, la separación es decorativa.</p>
  <p>Y la prueba de fuego: si cambiar el fichero JSON por una base de datos obliga a tocar algo fuera del repositorio, todavía no están separadas. Ese es exactamente el ejercicio de la sesión siguiente.</p>
</div>

### Por qué molestarse

Con un solo recurso y un fichero, esta separación parece burocracia. Sus tres razones aparecen enseguida: se puede probar el servicio sin levantar un servidor; se puede cambiar el almacén sin tocar la API; y cuando el proyecto tiene ocho recursos, todos se organizan igual y cualquiera sabe dónde mirar.

Es, además, la arquitectura que verás en el módulo de servidor con otros nombres: controlador, servicio y repositorio.

### Tarea 7 · La separación

1. Crea `src/servicio/` y `src/repositorio/` y reparte tu código.
2. Deja las rutas sin ninguna referencia a ficheros.
3. Deja el servicio sin ninguna referencia a peticiones ni respuestas.
4. Mueve al servicio las reglas de negocio que estaban en las rutas.
5. Busca las dos palabras de la prueba y arregla lo que aparezca.
6. Escribe un programa que use el servicio directamente, sin HTTP.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tres capas separadas y la prueba de las dos palabras superada.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade una regla de negocio nueva y comprueba que solo tocas el servicio.</span></div>
  <div><strong>Reto</strong><span>Haz que el servicio reciba el repositorio como parámetro, para poder sustituirlo.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 7</p>
  <ul class="checklist">
    <li>Cada capa sabe solo lo suyo.</li>
    <li>Las reglas de negocio están en el servicio.</li>
    <li>El servicio se puede usar sin servidor.</li>
    <li>Sabes nombrar las tres razones de separar.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Ruta, servicio y repositorio.</p>
  <p>2 · En el servicio, que es donde viven las reglas.</p>
  <p>3 · Probar sin servidor, cambiar el almacén sin tocar la API y organizar igual todos los recursos.</p>
</details>

---

## Sesión 8 · Persistencia y consistencia

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se sostiene la coherencia de los datos y qué pasa cuando se pierde.</li>
    <li><strong>2. Haz:</strong> Sustituye el repositorio por otro sin tocar nada más.</li>
    <li><strong>3. Comprueba:</strong> La API se comporta igual con los dos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué pasa si el fichero de datos tiene un producto sin precio?</li>
    <li>¿Y si tiene dos con el mismo identificador?</li>
    <li>¿Quién garantiza que eso no ocurra?</li>
  </ol>
</div>

### El repositorio como frontera

```javascript
// La interfaz que el servicio conoce
export async function todos() {}
export async function porId(id) {}
export async function guardar(producto) {}
export async function eliminar(id) {}
```

Mientras el conjunto de funciones y lo que devuelven no cambie, el servicio no distingue si detrás hay un fichero, una base de datos o una API ajena. Eso es lo que hace posible el ejercicio de hoy.

### Datos que llegan rotos

```javascript
function normalizar(crudo) {
  return {
    id: Number(crudo.id),
    nombre: String(crudo.nombre ?? "").trim(),
    precio: Number(crudo.precio ?? 0),
    stock: Number.isInteger(crudo.stock) ? crudo.stock : 0,
    categoria: crudo.categoria ?? "sin-categoria"
  };
}
```

<div class="rule">
  <p class="rule-label">El fichero de datos también es entrada externa</p>
  <p>Alguien puede editarlo a mano, puede venir de una versión anterior con otros campos, puede haberse quedado a medias. Si el repositorio devuelve lo que encuentre sin mirar, un dato roto se propaga hasta la respuesta.</p>
  <p>Normalizar al leer da al resto del programa la garantía de que un producto tiene la forma de un producto. Es la misma idea de validar en el borde, aplicada al borde de abajo.</p>
</div>

### Sembrar y reiniciar

Un proyecto que se prueba necesita poder volver a un estado conocido:

```json
{ "scripts": { "sembrar": "node src/herramientas/sembrar.js" } }
```

Un script que rellena el fichero con datos de ejemplo. Sin él, cada prueba deja los datos en un estado distinto y los fallos dejan de ser reproducibles.

### Tarea 8 · Cambiar el almacén

1. Escribe la lista de funciones que el servicio espera del repositorio.
2. Normaliza los datos al leerlos del fichero.
3. Escribe un segundo repositorio que guarde en memoria.
4. Cambia entre uno y otro con una variable de entorno.
5. Comprueba que la API se comporta igual con los dos y que **no has tocado ni rutas ni servicio**.
6. Escribe el script de siembra.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Dos repositorios intercambiables y la API idéntica con ambos.</span></div>
  <div><strong>Si lo tienes</strong><span>Detecta identificadores duplicados al leer y avisa por el registro.</span></div>
  <div><strong>Reto</strong><span>Escribe un tercer repositorio contra una API externa y sostén la misma interfaz.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 8</p>
  <ul class="checklist">
    <li>El repositorio tiene una interfaz clara.</li>
    <li>Los datos se normalizan al leerse.</li>
    <li>Has cambiado de almacén sin tocar las capas superiores.</li>
    <li>Puedes volver a un estado conocido con un comando.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque puede editarse a mano o venir de otra versión: es entrada externa.</p>
  <p>2 · Mientras se mantenga la interfaz que el servicio espera.</p>
  <p>3 · Para poder reproducir los fallos partiendo siempre del mismo estado.</p>
</details>

---

## Sesión 9 · El contrato de errores en la práctica

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se traduce cada error interno a una respuesta HTTP, en un solo sitio.</li>
    <li><strong>2. Haz:</strong> Cierra el manejador central y comprueba todos los casos.</li>
    <li><strong>3. Comprueba:</strong> Ninguna ruta decide ya un código de estado por su cuenta.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántos sitios de tu código deciden hoy un código de estado?</li>
    <li>Si añades un tipo de error nuevo, ¿cuántos ficheros tocas?</li>
    <li>¿Qué debe ver el cliente cuando el fallo es tuyo?</li>
  </ol>
</div>

### La traducción, en un solo sitio

```javascript
const ESTADOS = {
  ErrorDeValidacion: 400,
  ErrorNoAutenticado: 401,
  ErrorSinPermiso: 403,
  ErrorNoEncontrado: 404,
  ErrorDeConflicto: 409
};

export function manejadorDeErrores(error, peticion, respuesta, next) {
  const estado = ESTADOS[error.name] ?? 500;

  if (estado >= 500) {
    console.error(`[${peticion.id}] ${peticion.method} ${peticion.originalUrl}`, error);
  }

  respuesta.status(estado).json({
    error: estado >= 500 ? "Error interno del servidor" : error.message,
    codigo: error.codigo ?? error.name ?? "ERROR",
    detalles: error.detalles ?? [],
    peticion: peticion.id
  });
}
```

Añadir un tipo de error nuevo es añadir una línea a la tabla. Y ninguna ruta necesita ya saber qué número le corresponde a su fallo.

### El identificador de petición

```javascript
export function identificar(peticion, respuesta, next) {
  peticion.id = crypto.randomUUID();
  respuesta.setHeader("X-Request-Id", peticion.id);
  next();
}
```

<div class="rule">
  <p class="rule-label">Un identificador convierte «me da error» en un caso investigable</p>
  <p>El cliente ve un mensaje genérico y un identificador. Ese mismo identificador está en tus registros junto a la traza completa. Quien reporta el problema te da el número, y tú encuentras exactamente su petición entre miles.</p>
  <p>Es lo que permite no filtrar detalles internos sin quedarte ciego para diagnosticar.</p>
</div>

### El cliente, del otro lado

```javascript
async function pedir(url, opciones) {
  const respuesta = await fetch(url, opciones);
  if (respuesta.ok) return respuesta.status === 204 ? null : respuesta.json();

  const cuerpo = await respuesta.json().catch(() => ({}));
  throw new ErrorDeApi(respuesta.status, cuerpo.error ?? "Error inesperado", cuerpo.detalles ?? []);
}
```

Aquí se cobra el contrato: **una sola función** en el cliente sirve para toda la API, hoy y cuando añadas rutas. Si cada error tuviera una forma distinta, esta función no podría existir.

### Tarea 9 · Errores de punta a punta

1. Define los cinco tipos de error de tu aplicación.
2. Escribe la tabla de traducción y el manejador central.
3. Añade el identificador de petición y sácalo en registro y respuesta.
4. Elimina todos los códigos de estado repartidos por las rutas.
5. Escribe la función `pedir` en el cliente y úsala en toda la interfaz.
6. Provoca los cinco errores desde el cliente y comprueba qué se ve y qué se registra.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Manejador central, identificador y cliente con función única.</span></div>
  <div><strong>Si lo tienes</strong><span>Muestra en el formulario los detalles de validación, campo por campo.</span></div>
  <div><strong>Reto</strong><span>Añade un tipo de error nuevo y comprueba que solo tocas la tabla.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 3</p>
  <ul class="checklist">
    <li>Las tres capas están separadas de verdad.</li>
    <li>Puedes cambiar de almacén sin tocar rutas ni servicio.</li>
    <li>Los errores se traducen a HTTP en un solo sitio.</li>
    <li>El cliente trata todos los errores con una sola función.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · En el manejador central de errores, con una tabla de traducción.</p>
  <p>2 · Para poder relacionar lo que ve el cliente con la traza de tus registros.</p>
  <p>3 · Un mensaje genérico: el detalle se queda en el servidor.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 3 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Di a qué capa pertenece cada cosa: escribir un 404, «no se puede borrar con stock», y leer el fichero de datos.</li>
    <li>¿Cómo compruebas que tus capas están separadas de verdad?</li>
    <li>¿Por qué el cliente nunca debe ver la traza de un error?</li>
  </ol>
</div>
---

## Semana 4 · La web y su API

---

## Sesión 10 · HTML generado en el servidor

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cuándo conviene generar el HTML en el servidor y cómo se hace sin abrir un agujero.</li>
    <li><strong>2. Haz:</strong> Sirve una página de catálogo generada en el servidor.</li>
    <li><strong>3. Comprueba:</strong> Un producto con etiquetas en el nombre no rompe ni ejecuta nada.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En la UD4 el catálogo se pintaba en el navegador. ¿Qué ve alguien con JavaScript desactivado?</li>
    <li>¿Y un buscador que indexa tu web?</li>
    <li>¿Qué pasaría si el nombre de un producto contuviera una etiqueta?</li>
  </ol>
</div>

### Las dos formas de pintar

| Dónde se genera | Ventajas | Inconvenientes |
| --------------- | -------- | -------------- |
| En el servidor | Llega listo, funciona sin JavaScript, se indexa | Cada cambio recarga la página |
| En el cliente | Interacción inmediata, menos trabajo del servidor | Depende de que el código se ejecute |

No hay que elegir una para siempre: lo habitual es que la primera carga llegue hecha del servidor y la interacción se resuelva en el cliente. Es exactamente lo que vas a montar: la página de catálogo llega renderizada, y los filtros siguen funcionando en el navegador como en la UD4.

### Generar HTML con plantillas del lenguaje

```javascript
export function paginaCatalogo(productos) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>${escapar("Catálogo")}</title>
  <link rel="stylesheet" href="/css/styles.css">
  <script type="module" src="/js/main.js"></script>
</head>
<body>
  <main>
    <h1>Catálogo</h1>
    <ul class="catalogo" data-js="catalogo">
      ${productos.map(tarjeta).join("")}
    </ul>
  </main>
</body>
</html>`;
}

function tarjeta(producto) {
  return `<li class="producto" data-id="${producto.id}">
    <h3>${escapar(producto.nombre)}</h3>
    <p class="precio">${escapar(formatearPrecio(producto.precio))}</p>
  </li>`;
}
```

No hace falta instalar un motor de plantillas: las plantillas del lenguaje, las de la UD3, sirven perfectamente para esto. Un motor aporta herencia de plantillas y sintaxis propia; a cambio, una dependencia más y un lenguaje más que aprender.

### Escapar no es opcional

```javascript
const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapar(valor) {
  return String(valor).replace(/[&<>"']/g, (caracter) => ESCAPES[caracter]);
}
```

<div class="rule">
  <p class="rule-label">Todo dato que entra en el HTML se escapa</p>
  <p>Si un producto se llama <code>Teclado &lt;script&gt;…&lt;/script&gt;</code> y lo insertas tal cual, ese código se ejecuta en el navegador de quien visite tu página, con sus permisos y sus datos de sesión. Se llama <em>cross-site scripting</em>, y es la vulnerabilidad más extendida de la web.</p>
  <p>Es el mismo problema del <code>innerHTML</code> de la UD4, ahora del lado del servidor y peor: allí afectaba a quien lo escribía, aquí a todo el que visite la página.</p>
  <p>Y ojo con el sitio donde insertas: escapar sirve para el contenido y para los atributos entrecomillados. Meter datos de fuera dentro de un bloque de código de la página o en una URL requiere reglas distintas; lo sensato es no hacerlo.</p>
</div>

### Tarea 10 · La página del servidor

1. Escribe `src/vistas/catalogo.js` que genere la página completa.
2. Escribe y usa la función de escapado en todos los datos.
3. Sirve la página en `GET /` desde su router.
4. Comprueba con «ver código fuente» que el HTML llega hecho.
5. Añade un producto con etiquetas en el nombre y comprueba que se ve como texto.
6. Valida el HTML generado en el W3C.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Catálogo generado en el servidor, escapado y válido.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade la página de detalle de un producto, con su 404 propio.</span></div>
  <div><strong>Reto</strong><span>Demuestra el ataque contra una versión sin escapado y explica qué ocurre.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 10</p>
  <ul class="checklist">
    <li>Generas HTML en el servidor con plantillas del lenguaje.</li>
    <li>Escapas todo dato antes de insertarlo.</li>
    <li>El HTML generado es válido y semántico.</li>
    <li>Explicas qué es el <em>cross-site scripting</em>.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que llega hecha y funciona sin JavaScript, y que los buscadores la leen.</p>
  <p>2 · Sustituir los caracteres con significado en HTML por sus entidades.</p>
  <p>3 · Que se ejecute código ajeno en el navegador de cualquier visitante.</p>
</details>

---

## Sesión 11 · El cliente consume su propia API

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se conecta el cliente de la UD4 con la API propia, y qué cambia respecto a una ajena.</li>
    <li><strong>2. Haz:</strong> Sustituye los datos de ejemplo por llamadas reales a tu API.</li>
    <li><strong>3. Comprueba:</strong> La aplicación funciona de punta a punta y trata los cuatro estados.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué ahora no tendrás problemas de CORS?</li>
    <li>¿Qué cuatro estados tenía que contemplar una carga?</li>
    <li>Si el servidor devuelve 400 con detalles, ¿qué debe hacer tu interfaz?</li>
  </ol>
</div>

### El mismo origen

Como el cliente se sirve desde el mismo servidor que la API, las peticiones son relativas y no cruzan de origen:

```javascript
const productos = await pedir("/api/productos");
```

Sin dominio, sin puerto y sin CORS. Es una de las razones prácticas de servir ambas cosas juntas mientras el proyecto es pequeño.

### Filtrar: ¿en el cliente o en el servidor?

| Dónde | Cuándo conviene |
| ----- | --------------- |
| En el cliente | Pocos datos, ya descargados: respuesta instantánea |
| En el servidor | Muchos datos, o filtros que dependen de reglas o permisos |

<div class="rule">
  <p class="rule-label">Una decisión de diseño, no una preferencia</p>
  <p>Con doscientos productos, descargarlos una vez y filtrar en el navegador es mejor experiencia: no hay espera. Con doscientos mil, o cuando el filtro depende de quién pregunta, la única opción es el servidor.</p>
  <p>Lo que no vale es hacerlo en los dos sitios con reglas distintas: entonces el mismo filtro da resultados diferentes según por dónde pase, y ese fallo es dificilísimo de encontrar.</p>
</div>

Toma la decisión, escríbela en tus notas y sé coherente.

### Los cuatro estados, ahora de verdad

El estado que montaste en la UD4 ya tenía sitio para `cargando` y `error`. Ahora esos campos dejan de ser una simulación:

```javascript
async function cargar() {
  estado.cargando = true;
  estado.error = null;
  actualizar();

  try {
    estado.productos = await pedir("/api/productos");
  } catch (error) {
    estado.error = error.mensaje;
  } finally {
    estado.cargando = false;
    actualizar();
  }
}
```

### Tarea 11 · Conectar

1. Sustituye los datos escritos a mano por una llamada a tu API.
2. Usa la función `pedir` de la sesión 9 para todas las llamadas.
3. Decide dónde filtras y déjalo escrito.
4. Comprueba los cuatro estados apagando el servidor y simulando red lenta.
5. Añade el botón de reintentar.
6. Comprueba que la primera carga llega renderizada del servidor y el cliente la toma desde ahí.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Interfaz completa alimentada por tu API, con los cuatro estados.</span></div>
  <div><strong>Si lo tienes</strong><span>Filtra en el servidor y comprueba en Network qué se envía.</span></div>
  <div><strong>Reto</strong><span>Haz que la primera carga no repita la petición de lo que ya llegó renderizado.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 11</p>
  <ul class="checklist">
    <li>El cliente consume tu API con rutas relativas.</li>
    <li>Una sola función trata todas las respuestas y errores.</li>
    <li>Los cuatro estados se ven de verdad.</li>
    <li>Has decidido y documentado dónde se filtra.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque cliente y API comparten origen.</p>
  <p>2 · Cargando, error, vacío y datos.</p>
  <p>3 · Mostrar los detalles del error junto a los campos que los provocaron.</p>
</details>

---

## Sesión 12 · Formularios de extremo a extremo

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> El recorrido completo de un envío, desde el campo hasta el fichero y de vuelta.</li>
    <li><strong>2. Haz:</strong> Un formulario que crea un producto de verdad.</li>
    <li><strong>3. Comprueba:</strong> Los errores del servidor aparecen junto al campo que los causó.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Enumera todo lo que ocurre entre pulsar «Enviar» y ver el resultado.</li>
    <li>¿Qué pasa si se pulsa dos veces seguidas?</li>
    <li>¿Dónde deben aparecer los errores que devuelve el servidor?</li>
  </ol>
</div>

### El recorrido completo

<figure class="diagram">
  <figcaption>De un campo al fichero y de vuelta</figcaption>
  <ol class="flow">
    <li>Se envía el formulario; se cancela el comportamiento por defecto</li>
    <li>Se leen y convierten los valores</li>
    <li>Validación del cliente: si falla, no se envía nada</li>
    <li>Petición POST con el cuerpo JSON</li>
    <li>El servidor valida otra vez y responde 201 o 400</li>
    <li>Con 201: se actualiza el estado y se vuelve a pintar</li>
    <li>Con 400: se muestran los detalles junto a cada campo</li>
  </ol>
</figure>

```javascript
formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  limpiarErrores();
  boton.disabled = true;

  try {
    const creado = await pedir("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(formulario)))
    });

    estado.productos.push(creado);
    formulario.reset();
    anunciar(`${creado.nombre} añadido`);
    actualizar();
  } catch (error) {
    if (error.detalles?.length) mostrarErroresDeCampo(error.detalles);
    else anunciar(error.mensaje, "error");
  } finally {
    boton.disabled = false;
  }
});
```

### Los detalles del servidor, en su campo

```javascript
function mostrarErroresDeCampo(detalles) {
  for (const { campo, mensaje } of detalles) {
    const control = formulario.elements[campo];
    if (control) mostrarError(control, mensaje);
  }
  formulario.elements[detalles[0].campo]?.focus();
}
```

<div class="rule">
  <p class="rule-label">El campo de la respuesta es lo que hace esto posible</p>
  <p>Por eso el contrato de errores incluye <code>campo</code> en cada detalle: sin él, el cliente solo puede enseñar un mensaje suelto y quien lo lee tiene que adivinar cuál de los seis campos está mal.</p>
  <p>Aquí se ve para qué servía diseñar el contrato antes de escribir la primera ruta.</p>
</div>

### Dos detalles que se olvidan siempre

Deshabilitar el botón mientras se envía evita el doble envío, que con POST crea dos productos. Y anunciar el resultado en la región activa de la UD4 hace que el éxito no sea solo un cambio visual que algunas personas no perciben.

### Tarea 12 · El formulario real

1. Añade el formulario de alta a tu página, con su marcado accesible.
2. Envía con `fetch` y trata las dos respuestas posibles.
3. Muestra los errores del servidor en su campo y lleva el foco al primero.
4. Deshabilita el botón durante el envío.
5. Anuncia el resultado en la región activa.
6. Añade el borrado desde la lista, con confirmación.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Alta funcionando de punta a punta con errores en su campo.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade la edición reutilizando el mismo formulario.</span></div>
  <div><strong>Reto</strong><span>Actualiza la lista de forma optimista y deshaz el cambio si el servidor rechaza.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 4</p>
  <ul class="checklist">
    <li>La primera carga llega generada del servidor.</li>
    <li>El cliente consume su propia API.</li>
    <li>Los formularios crean y borran datos reales.</li>
    <li>Los errores del servidor llegan al campo correcto.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que se envíe dos veces y se creen dos productos.</p>
  <p>2 · Junto al campo que los provoca, gracias al campo <code>campo</code> del contrato.</p>
  <p>3 · Deshabilitar el botón mientras dura el envío.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 4 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Escribe qué hace la función de escapado y qué ocurre si falta.</li>
    <li>¿Cuándo filtrarías en el cliente y cuándo en el servidor?</li>
    <li>¿Por qué el contrato de errores incluye el nombre del campo que falla?</li>
  </ol>
</div>
---

## Semana 5 · Listo para publicar

---

## Sesión 13 · Configuración, secretos y CORS

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se configura una aplicación para varios entornos y cómo se abre a otros orígenes.</li>
    <li><strong>2. Haz:</strong> Centraliza la configuración y decide tu política de CORS.</li>
    <li><strong>3. Comprueba:</strong> La aplicación se niega a arrancar si falta algo imprescindible.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué cambiaría entre tu portátil y un servidor real?</li>
    <li>¿Qué debe pasar si falta una variable obligatoria: arrancar a medias o no arrancar?</li>
    <li>¿Quién debería poder llamar a tu API desde otro dominio?</li>
  </ol>
</div>

### Toda la configuración, en un módulo

```javascript
// src/configuracion.js
function obligatoria(nombre) {
  const valor = process.env[nombre];
  if (!valor) {
    console.error(`Falta la variable de entorno ${nombre}`);
    process.exit(1);
  }
  return valor;
}

export const configuracion = {
  puerto: Number(process.env.PUERTO ?? 3000),
  entorno: process.env.NODE_ENV ?? "development",
  rutaDatos: process.env.RUTA_DATOS ?? "./datos/productos.json",
  origenesPermitidos: (process.env.ORIGENES ?? "").split(",").filter(Boolean),
  claveApi: obligatoria("CLAVE_API")
};
```

<div class="rule">
  <p class="rule-label">Fallar al arrancar es mejor que fallar a las tres horas</p>
  <p>Si falta una variable imprescindible, el peor comportamiento posible es arrancar como si nada y romperse cuando alguien use la funcionalidad que la necesitaba: entonces el fallo aparece lejos de su causa.</p>
  <p>Comprobarlo todo al arrancar convierte un fallo intermitente en un mensaje claro, antes de que nadie llegue a usar la aplicación.</p>
</div>

### CORS, desde el otro lado

En la UD4 sufriste CORS como cliente. Ahora decides tú:

```javascript
app.use((peticion, respuesta, next) => {
  const origen = peticion.headers.origin;
  if (origen && configuracion.origenesPermitidos.includes(origen)) {
    respuesta.setHeader("Access-Control-Allow-Origin", origen);
    respuesta.setHeader("Vary", "Origin");
    respuesta.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    respuesta.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (peticion.method === "OPTIONS") return respuesta.sendStatus(204);
  next();
});
```

<div class="rule">
  <p class="rule-label">El comodín no es la solución: es rendirse</p>
  <p>Poner <code>*</code> permite que cualquier página de internet llame a tu API desde el navegador de sus visitantes. Para una API pública de solo lectura puede ser aceptable; para una que modifica datos, no.</p>
  <p>Y recuerda qué es CORS y qué no: una protección del <strong>navegador</strong>. No impide que alguien llame a tu API con un cliente HTTP. La autorización de verdad es otra cosa, y es lo de mañana.</p>
</div>

Tu cliente, servido desde el mismo origen, no necesita nada de esto. Lo configuras para quien venga de fuera.

### Tarea 13 · Configurar

1. Crea el módulo de configuración con valores por defecto y comprobaciones.
2. Haz que la aplicación se niegue a arrancar si falta una variable obligatoria.
3. Sustituye todos los valores escritos en el código.
4. Configura CORS con una lista de orígenes permitidos.
5. Comprueba desde una página de otro origen que se aplica.
6. Actualiza `.env.example` y documenta cada variable en el README.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Configuración centralizada, comprobada al arrancar y documentada.</span></div>
  <div><strong>Si lo tienes</strong><span>Comportamiento distinto por entorno: registro detallado solo en desarrollo.</span></div>
  <div><strong>Reto</strong><span>Demuestra con un cliente HTTP que CORS no protege la API de una llamada directa.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 13</p>
  <ul class="checklist">
    <li>Ningún valor de configuración vive en el código.</li>
    <li>La aplicación no arranca si falta algo imprescindible.</li>
    <li>CORS está configurado con una lista, no con un comodín.</li>
    <li>Sabes qué protege CORS y qué no.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que el fallo aparezca lejos de su causa, mucho después de arrancar.</p>
  <p>2 · Solo el navegador: un cliente HTTP no se ve afectado.</p>
  <p>3 · Los orígenes concretos que deben poder llamar desde un navegador.</p>
</details>

---

## Sesión 14 · Seguridad mínima

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Las protecciones que no pueden faltar en un servicio expuesto a internet.</li>
    <li><strong>2. Haz:</strong> Aplícalas a tu API y comprueba que funcionan.</li>
    <li><strong>3. Comprueba:</strong> Intentas romper tu propio servicio y no lo consigues.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué podría hacer alguien con acceso a tu API tal como está hoy?</li>
    <li>¿Qué pasa si envía un cuerpo de cien megabytes?</li>
    <li>¿Y si llama mil veces por segundo?</li>
  </ol>
</div>

### La lista mínima

| Riesgo | Protección |
| ------ | ---------- |
| Datos inválidos o inesperados | Validación con lista blanca en el servidor |
| Inyección de HTML | Escapar todo dato al generar la página |
| Salirse de la carpeta pública | Comprobar la ruta resuelta |
| Cuerpos enormes | Límite de tamaño en el analizador |
| Abuso de llamadas | Limitación por dirección y ventana de tiempo |
| Cabeceras que delatan | Quitar la que anuncia el framework |
| Escritura sin permiso | Autorización en las rutas que modifican |
| Secretos filtrados | Todo en el entorno, nada en el repositorio |

### Aplicarlas

```javascript
app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

const llamadas = new Map();

export function limitar(peticion, respuesta, next) {
  const clave = peticion.ip;
  const ahora = Date.now();
  const registro = llamadas.get(clave) ?? { desde: ahora, total: 0 };

  if (ahora - registro.desde > 60_000) {
    registro.desde = ahora;
    registro.total = 0;
  }

  registro.total += 1;
  llamadas.set(clave, registro);

  if (registro.total > 100) {
    return respuesta.status(429).json({ error: "Demasiadas peticiones", codigo: "LIMITE" });
  }
  next();
}
```

Es un limitador de andar por casa —vive en memoria y se pierde al reiniciar— pero enseña la idea, y el 429 es el código que corresponde.

### Autorización para lo que modifica

```javascript
export function requiereClave(peticion, respuesta, next) {
  const enviada = peticion.headers["x-api-key"];
  if (enviada !== configuracion.claveApi) {
    throw new ErrorNoAutenticado("Clave de API no válida");
  }
  next();
}

router.post("/", requiereClave, crearProducto);
router.delete("/:id", requiereClave, borrarProducto);
```

<div class="rule">
  <p class="rule-label">Leer es público; escribir, no</p>
  <p>Una clave en una cabecera es la forma más simple de proteger las operaciones que modifican, y es suficiente para un proyecto de aula. No es un sistema de usuarios: no distingue quién llama, no caduca y quien la tenga puede todo.</p>
  <p>Lo que sí enseña es dónde se pone la comprobación —en el servidor, antes del manejador— y la diferencia entre 401 y 403: la primera es «no sé quién eres», la segunda «sé quién eres y no puedes».</p>
</div>

Y una regla que no se negocia: si algún día guardas contraseñas, se guardan cifradas con una función pensada para eso, nunca en claro ni con un resumen sin sal. En este módulo directamente no guardamos ninguna.

### Tarea 14 · Blindar

1. Aplica el límite de tamaño y quita la cabecera del framework.
2. Escribe el limitador de peticiones y devuelve 429.
3. Protege con clave las rutas que modifican.
4. Repasa que toda entrada sigue validándose con lista blanca.
5. Intenta atacar tu propio servicio de cinco formas distintas y anota el resultado.
6. Ejecuta `npm audit` y resuelve lo que aparezca.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las seis protecciones aplicadas y comprobadas.</span></div>
  <div><strong>Si lo tienes</strong><span>Devuelve las cabeceras que dicen cuántas llamadas quedan.</span></div>
  <div><strong>Reto</strong><span>Escribe un informe con los riesgos que tu servicio sigue teniendo y cómo se resolverían.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 14</p>
  <ul class="checklist">
    <li>Las operaciones que modifican exigen autorización.</li>
    <li>Hay límites de tamaño y de frecuencia.</li>
    <li>Ningún secreto está en el repositorio.</li>
    <li>Has intentado romper tu propio servicio.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Un 429.</p>
  <p>2 · 401 es no autenticado; 403, autenticado pero sin permiso.</p>
  <p>3 · En el servidor, antes del manejador de la ruta.</p>
</details>

---

## Sesión 15 · Probar la API

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se prueba de una API y cómo se escribe una prueba automática con lo que trae Node.</li>
    <li><strong>2. Haz:</strong> Escribe la batería de pruebas de tu recurso.</li>
    <li><strong>3. Comprueba:</strong> <code>npm test</code> pasa, y falla si rompes algo a propósito.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántas veces has probado a mano el mismo caso esta unidad?</li>
    <li>¿Cómo sabes hoy que un cambio no ha roto otra cosa?</li>
    <li>¿Qué casos son los que más se olvidan al probar a mano?</li>
  </ol>
</div>

### El ejecutor incluido

```javascript
// pruebas/productos.test.js
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";

import { crearApp } from "../src/app.js";

describe("API de productos", () => {
  let servidor;
  let url;

  before(() => {
    servidor = crearApp().listen(0);                // puerto libre
    url = `http://localhost:${servidor.address().port}`;
  });

  after(() => servidor.close());                    // si no, el proceso no termina

  test("lista los productos", async () => {
    const respuesta = await fetch(`${url}/api/productos`);
    assert.equal(respuesta.status, 200);
    assert.ok(Array.isArray(await respuesta.json()));
  });

  test("devuelve 404 si no existe", async () => {
    const respuesta = await fetch(`${url}/api/productos/99999`);
    assert.equal(respuesta.status, 404);
  });

  test("rechaza un producto sin nombre", async () => {
    const respuesta = await fetch(`${url}/api/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.CLAVE_API },
      body: JSON.stringify({ precio: 10 })
    });
    assert.equal(respuesta.status, 400);
    const cuerpo = await respuesta.json();
    assert.ok(cuerpo.detalles.some((d) => d.campo === "nombre"));
  });
});
```

```json
{ "scripts": { "test": "node --env-file=.env.pruebas --test pruebas/" } }
```

Sin instalar nada: el ejecutor y las aserciones vienen con Node. Y fíjate en tres detalles que deciden si esto funciona:

* El `listen(0)` pide un puerto libre cualquiera, así que las pruebas no chocan con tu servidor de desarrollo. Ahí se cobra haber separado la aplicación del arranque en la sesión 3.
* El `after` cierra el servidor. Sin él, el proceso se queda vivo cuando las pruebas ya han terminado y `npm test` no vuelve nunca.
* El fichero de entorno propio da a las pruebas su clave y su ruta de datos. Recuerda que la configuración de la sesión 13 corta el arranque si falta una variable obligatoria: sin ese fichero, importar la aplicación desde una prueba mata el proceso antes del primer `assert`.

### Qué probar

<figure class="diagram">
  <figcaption>Lo que no puede faltar</figcaption>
  <ol class="flow">
    <li>El camino feliz de cada operación</li>
    <li>Cada código de error del contrato</li>
    <li>Los límites: vacío, cero, el valor de la frontera</li>
    <li>La regla de negocio que tiene el proyecto</li>
    <li>El fallo que ya te costó una tarde</li>
  </ol>
</figure>

<div class="rule">
  <p class="rule-label">Una prueba que no falla nunca no prueba nada</p>
  <p>Después de escribirla, rompe a propósito lo que comprueba y mira si se pone en rojo. Si sigue en verde, la prueba está mal escrita y te está dando una seguridad falsa, que es peor que no tener prueba.</p>
  <p>Y usa datos propios de las pruebas, no los tuyos de desarrollo: una batería que depende de que exista el producto 7 falla el día que alguien lo borra.</p>
</div>

### Tarea 15 · La batería

1. Añade el script de pruebas al `package.json`.
2. Escribe al menos ocho pruebas: caminos felices, errores y límites.
3. Usa un fichero de datos propio de las pruebas.
4. Comprueba el contrato: código de estado, forma del cuerpo y campos.
5. Rompe cada regla a propósito y comprueba que la prueba correspondiente falla.
6. Deja `npm test` en verde.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Ocho pruebas en verde que cubren éxitos y errores.</span></div>
  <div><strong>Si lo tienes</strong><span>Prueba el servicio directamente, sin HTTP, con un repositorio en memoria.</span></div>
  <div><strong>Reto</strong><span>Añade una comprobación de que ninguna respuesta filtra campos internos.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Cierre de la semana 5</p>
  <ul class="checklist">
    <li>La configuración vive fuera del código y se comprueba al arrancar.</li>
    <li>Las operaciones que modifican están protegidas.</li>
    <li>Hay límites de tamaño y de frecuencia.</li>
    <li><code>npm test</code> pasa y detecta las roturas.</li>
  </ul>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que pida un puerto libre cualquiera, sin chocar con el de desarrollo.</p>
  <p>2 · Romper a propósito lo que comprueba y ver si se pone en rojo.</p>
  <p>3 · Los caminos felices, cada error del contrato, los límites y la regla de negocio.</p>
</details>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 5 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>¿Qué debe hacer la aplicación si falta una variable de entorno obligatoria, y por qué?</li>
    <li>¿Qué protege CORS y qué no protege?</li>
    <li>Escribe una prueba que compruebe que una entrada inválida devuelve 400.</li>
  </ol>
</div>
---

## Semana 6 · Cierre del módulo

---

## Sesión 16 · El proyecto completo

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Nada nuevo. Hoy se integra todo.</li>
    <li><strong>2. Haz:</strong> Cierra tu aplicación: lo que falte, lo que esté a medias y lo que no encaje.</li>
    <li><strong>3. Comprueba:</strong> Funciona de punta a punta desde una instalación limpia.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si clonas tu proyecto en una carpeta nueva, ¿arranca?</li>
    <li>¿Qué parte te da más vergüenza enseñar? Esa es la de hoy.</li>
    <li>¿Qué queda a medias, con un comentario que dice «arreglar esto»?</li>
  </ol>
</div>

### La prueba de la instalación limpia

<figure class="diagram">
  <figcaption>Lo que hará quien reciba tu proyecto</figcaption>
  <ol class="flow">
    <li>Clonar en una carpeta vacía</li>
    <li>Copiar el ejemplo de entorno y rellenarlo</li>
    <li>Instalar dependencias</li>
    <li>Sembrar los datos</li>
    <li>Arrancar</li>
    <li>Abrir el navegador y usarlo</li>
  </ol>
</figure>

Hazlo tú, de verdad, en otra carpeta. Cada tropiezo es un fallo que tu corrector encontrará también.

### El recorrido funcional

<div class="checkpoint">
  <p class="checkpoint-label">Lo que tiene que funcionar seguido</p>
  <ul class="checklist">
    <li>La página inicial llega generada por el servidor.</li>
    <li>El catálogo se filtra, se busca y se ordena.</li>
    <li>El alta crea un producto que persiste tras reiniciar.</li>
    <li>Un dato inválido se rechaza y el error aparece en su campo.</li>
    <li>Un borrado desaparece de la lista y del fichero.</li>
    <li>Sin servidor, el cliente muestra su estado de error.</li>
    <li>Todo se puede hacer con el teclado.</li>
    <li><code>npm test</code> está en verde.</li>
  </ul>
</div>

### Lo que hay que cerrar

Reserva la última media hora para lo que siempre queda: rutas del contrato sin implementar, códigos de estado que no coinciden con lo documentado, mensajes de depuración olvidados, el README desactualizado y el `.env.example` sin las variables nuevas.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>El recorrido completo funcionando desde una instalación limpia.</span></div>
  <div><strong>Si lo tienes</strong><span>Implementa la funcionalidad que dejaste pendiente por falta de tiempo.</span></div>
  <div><strong>Reto</strong><span>Añade un segundo recurso completo, con su router, su servicio y sus pruebas.</span></div>
</div>

---

## Sesión 17 · Documentar y desplegar

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué documentación necesita un servicio y qué cambia al publicarlo.</li>
    <li><strong>2. Haz:</strong> Escribe el README y despliega tu aplicación.</li>
    <li><strong>3. Comprueba:</strong> Alguien puede usarla desde su casa, con una URL.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué cambia entre tu máquina y un servidor de internet?</li>
    <li>¿De dónde saldrán ahí las variables de entorno?</li>
    <li>¿Qué pasa con tu fichero de datos cuando el servicio se reinicia?</li>
  </ol>
</div>

### El README que sirve

<div class="checkpoint">
  <p class="checkpoint-label">Lo que no puede faltar</p>
  <ul class="checklist">
    <li>Qué es esto y qué problema resuelve, en tres líneas.</li>
    <li>Cómo instalarlo y arrancarlo, con las órdenes exactas.</li>
    <li>Las variables de entorno, con su significado y si son obligatorias.</li>
    <li>La tabla de rutas: método, ruta, qué hace y qué devuelve.</li>
    <li>El formato de error y sus códigos.</li>
    <li>Cómo ejecutar las pruebas.</li>
    <li>Qué decisiones tomaste y qué dejaste fuera a propósito.</li>
  </ul>
</div>

Ese último punto es el que distingue un README de un proyecto de clase de uno profesional: decir qué no hace y por qué evita que quien lo lea lo tome por un fallo.

### Publicar

```json
{
  "scripts": { "start": "node src/servidor.js" },
  "engines": { "node": ">=22" }
}
```

Casi todas las plataformas gratuitas hacen lo mismo: clonan tu repositorio, ejecutan la instalación y arrancan con `npm start`. Lo que tienes que preparar es esto:

| Detalle | Qué hay que hacer |
| ------- | ----------------- |
| El puerto | Tomarlo de la variable de entorno que dé la plataforma |
| Las variables | Configurarlas en su panel, no en el repositorio |
| El entorno | Poner `NODE_ENV` en producción |
| Los datos | Saber que el disco puede borrarse en cada despliegue |
| El registro | Escribir a la salida estándar, que es lo que la plataforma recoge |

<div class="rule">
  <p class="rule-label">Un fichero en el disco de un servicio desplegado no es permanente</p>
  <p>Muchas plataformas reconstruyen el contenedor en cada despliegue, y en algunas también al reiniciar por inactividad. Tus productos creados desaparecen, y no es un fallo de tu código.</p>
  <p>Es exactamente el motivo por el que existen las bases de datos gestionadas, y el problema con el que empieza el módulo de servidor. De momento, sabe explicarlo y siembra los datos al arrancar.</p>
</div>

### Tarea 17 · Publicado

El README se trae escrito de casa: la hora de clase es para desplegar, que es donde aparecen los problemas que no se pueden prever.

1. Repasa el README completo con sus siete apartados.
2. Prepara el proyecto: puerto por entorno, `start`, `engines`.
3. Despliega en una plataforma gratuita.
4. Configura las variables en su panel.
5. Comprueba la aplicación desde otro dispositivo.
6. Anota qué se comporta distinto respecto a tu máquina.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Aplicación desplegada y accesible, con su README.</span></div>
  <div><strong>Si lo tienes</strong><span>Añade una ruta de estado que informe de si el servicio está sano.</span></div>
  <div><strong>Reto</strong><span>Configura el despliegue automático en cada cambio de la rama principal.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 17</p>
  <ul class="checklist">
    <li>Tu aplicación tiene una URL pública.</li>
    <li>Las variables están en la plataforma, no en el repositorio.</li>
    <li>El README basta para instalarla y usar la API.</li>
    <li>Sabes qué pasa con los datos en cada despliegue.</li>
  </ul>
</div>

---

## Sesión 18 · Defensa técnica y entrega final

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué se evalúa en una defensa técnica.</li>
    <li><strong>2. Haz:</strong> Audita, revisa el proyecto de un compañero y defiende el tuyo.</li>
    <li><strong>3. Comprueba:</strong> Puedes explicar cualquier línea de tu proyecto.</li>
  </ol>
</div>

### La auditoría final del módulo

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · la API</p>
  <ul class="checklist">
    <li>Las rutas se organizan por recursos y son predecibles.</li>
    <li>Cada operación devuelve el código del contrato, también en los errores.</li>
    <li>Todos los errores tienen la misma forma.</li>
    <li>Toda entrada se valida con lista blanca en el servidor.</li>
    <li>Las respuestas no exponen campos internos.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · la arquitectura</p>
  <ul class="checklist">
    <li>Ruta, servicio y repositorio están separados de verdad.</li>
    <li>La aplicación se crea sin arrancarse.</li>
    <li>Cambiar el almacén no toca rutas ni servicio.</li>
    <li>La configuración vive fuera del código y se comprueba al arrancar.</li>
    <li>Los errores se traducen a HTTP en un único sitio.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría · el conjunto del módulo</p>
  <ul class="checklist">
    <li>El HTML es semántico y válido, también el generado en el servidor.</li>
    <li>El diseño se adapta y respeta las preferencias del usuario.</li>
    <li>Todo se maneja con teclado y los cambios se anuncian.</li>
    <li>Todo dato ajeno se escapa antes de entrar en la página.</li>
    <li>Las pruebas pasan y detectan las roturas.</li>
    <li>El repositorio no contiene secretos ni dependencias instaladas.</li>
  </ul>
</div>

### Revisión por pares

Intercambia proyectos y, sin preguntar nada, dedica veinte minutos a:

1. Clonar, configurar, sembrar y arrancar. Anota cada tropiezo.
2. Usar la aplicación entera solo con el teclado.
3. Atacar la API: datos inválidos, campos de más, rutas fuera de lo público, escritura sin clave.
4. Ejecutar sus pruebas y romper algo para ver si lo detectan.
5. Encontrar dónde vive una regla de negocio y explicarla en voz alta.

### La defensa

Tres minutos por persona, mientras el resto sigue con la revisión. Salen cuatro preguntas de esta lista, elegidas al azar, y cubren el módulo entero y no solo esta unidad:

<div class="rule">
  <p class="rule-label">Las preguntas de la defensa final</p>
  <ol>
    <li>Enséñame el recorrido de una petición desde que alguien pulsa un botón hasta que el dato se guarda.</li>
    <li>¿Por qué esta ruta y no otra? ¿Por qué este código de estado?</li>
    <li>¿Dónde validas y por qué no basta con hacerlo en el cliente?</li>
    <li>Enséñame una decisión de accesibilidad y explícame a quién ayuda.</li>
    <li>¿Qué pasa si tu API recibe un campo que no esperabas?</li>
    <li>Si mañana hubiera que cambiar el fichero por una base de datos, ¿qué tocarías?</li>
    <li>Enséñame el fallo que más te costó encontrar y cuéntame cómo lo encontraste.</li>
    <li>¿Qué harías distinto si empezaras hoy el proyecto?</li>
  </ol>
</div>

Las dos últimas valen tanto como las demás: saber qué te costó y qué harías distinto es la prueba de que has entendido lo que hiciste.

### Evaluación

| Criterio | Puntos |
| ---------------------------------------------------------- | -----: |
| Diseño por recursos y contrato sostenido en toda la API | 1,5 |
| CRUD completo con los códigos de estado del contrato | 1,5 |
| Validación en el servidor, con lista blanca de campos | 1,5 |
| Separación real en rutas, servicio y repositorio | 1,5 |
| Contrato de errores único, usado de punta a punta | 1 |
| Cliente conectado y formularios de extremo a extremo | 1 |
| Configuración por entorno, seguridad mínima y escapado | 1 |
| Pruebas automáticas en verde y aplicación desplegada | 1 |

No puntúa el tamaño del proyecto. Puntúa que **el contrato se sostenga**: que cada ruta responda lo que promete, que ninguna entrada se crea sin validar y que puedas defender por qué está hecho así.

### Entrega final del módulo

<div class="unit-deliverable">
  <p>El repositorio con la aplicación completa: cliente y API servidos juntos, capas separadas, contrato documentado, configuración por entorno, seguridad mínima y pruebas en verde. La URL del despliegue. El README con sus siete apartados. Las tres listas de auditoría marcadas. La revisión del compañero por escrito. Y un documento de una página con las tres decisiones técnicas de las que estés más satisfecho y las tres que cambiarías.</p>
</div>


<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 6 · 10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Enumera los cinco puntos que revisarías en una API antes de darla por terminada.</li>
    <li>Explica una decisión de diseño de tu API y una alternativa que descartaste.</li>
    <li>Si mañana el fichero JSON fuera una base de datos, ¿qué tocarías y qué no?</li>
  </ol>
</div>
---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>Cómo se construye un servicio</figcaption>
  <ol class="flow">
    <li>¿Qué recursos existen en el problema?</li>
    <li>¿Qué operaciones se hacen con cada uno, y qué responden?</li>
    <li>¿Qué se valida, y dónde?</li>
    <li>¿Qué capa se ocupa de cada cosa?</li>
    <li>¿Qué pasa cuando falla, y qué ve quien llamó?</li>
    <li>¿Cómo demuestro que funciona sin probarlo a mano?</li>
  </ol>
</figure>

### La idea más importante

> **Diseña el contrato antes que la implementación, y sostenlo. Todo lo que llega de fuera es sospechoso; todo lo que sale es una decisión.**

De ahí sale todo lo demás: por eso las rutas hablan de recursos, por eso los errores tienen una forma única, por eso la validación vive en el servidor con lista blanca, por eso las respuestas se construyen en lugar de volcarse, y por eso las capas están separadas.

### Las tres capas del módulo, juntas

<figure class="diagram">
  <figcaption>Lo que has construido en tres trimestres</figcaption>
  <ol class="flow">
    <li>HTML · qué existe y qué significa</li>
    <li>CSS · cómo se presenta y se adapta</li>
    <li>JavaScript · qué ocurre en el navegador</li>
    <li>Node · qué ocurre en el servidor</li>
    <li>API · el contrato que une las dos mitades</li>
  </ol>
</figure>

Y una idea que ha aparecido en las seis unidades con distinta ropa: **separa lo que cambia por razones distintas**. Estructura de presentación, lógica de interfaz, reglas de almacén, contrato de implementación. Cada vez que lo hiciste, la unidad siguiente te costó menos.

### Al terminar deberías poder responder

1. ¿Qué distingue una API orientada a recursos de una orientada a acciones?
2. ¿Dónde van los filtros y por qué no en la ruta?
3. ¿Qué significa que una API no guarde estado?
4. ¿Qué piezas forman el contrato de una API?
5. ¿Qué código devuelve cada operación del CRUD, en éxito y en error?
6. ¿Cuándo un 400 y cuándo un 404?
7. ¿Por qué una búsqueda sin resultados no es un 404?
8. ¿Qué diferencia hay entre PUT y PATCH?
9. ¿Qué operaciones se pueden repetir sin efectos distintos?
10. ¿Qué es una lista blanca de campos y qué evita?
11. ¿Por qué el identificador lo asigna el servidor?
12. ¿Qué sabe y qué no sabe cada capa?
13. ¿Cómo compruebas que las capas están bien separadas?
14. ¿Por qué la aplicación se crea sin arrancarse?
15. ¿Por qué se normalizan los datos al leerlos del almacén?
16. ¿Cómo se traduce un error interno a un código HTTP?
17. ¿Para qué sirve el identificador de petición?
18. ¿Por qué el cliente puede tratar todos los errores con una función?
19. ¿Qué ventajas tiene generar el HTML en el servidor?
20. ¿Qué es el *cross-site scripting* y cómo se evita?
21. ¿Cuándo filtrar en el cliente y cuándo en el servidor?
22. ¿Por qué se deshabilita el botón durante un envío?
23. ¿Por qué la aplicación debe negarse a arrancar si falta una variable?
24. ¿Qué protege CORS y qué no protege?
25. ¿Qué diferencia hay entre 401 y 403?
26. ¿Qué protecciones mínimas necesita un servicio expuesto?
27. ¿Qué se prueba de una API, y cómo compruebas que la prueba sirve?
28. ¿Qué pasa con un fichero de datos en un servicio desplegado?
29. ¿Qué apartados no pueden faltar en un README?
30. Si hubiera que cambiar el almacén, ¿qué ficheros tocarías?

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Recurso | Una cosa del problema identificable con una URL |
| REST | Un estilo de API basado en recursos, métodos y estados |
| Contrato | Lo que la API promete: rutas, cuerpos, códigos y formas |
| Sin estado | Que el servidor no recuerda nada entre peticiones |
| CRUD | Crear, leer, actualizar y borrar |
| Repetible sin efectos | Que repetir la operación no cambie el resultado |
| Router | Un grupo de rutas montado bajo una ruta base |
| Capa | Una parte del sistema con una responsabilidad y sus límites |
| Servicio | La capa donde viven las reglas de negocio |
| Repositorio | La capa que sabe cómo se guardan y leen los datos |
| Lista blanca | Aceptar solo lo enumerado y descartar el resto |
| Normalizar | Dar forma conocida a un dato al leerlo |
| Escapar | Sustituir caracteres con significado en HTML por entidades |
| *Cross-site scripting* | Ejecutar código ajeno en el navegador de un visitante |
| CORS | La política del navegador sobre peticiones a otro origen |
| Limitación de peticiones | Rechazar llamadas por encima de una frecuencia |
| Identificador de petición | Un código que relaciona una respuesta con su traza |
| Siembra | Poblar el almacén con datos conocidos |
| Despliegue | Publicar la aplicación en un servidor accesible |

### Y ahora

Has terminado el módulo. Empezaste escribiendo un encabezado y terminas con una aplicación publicada en internet, con su cliente, su API, sus pruebas y su documentación.

Lo que viene después ya no es lenguaje de marcas: es un backend con base de datos, seguridad, transacciones y despliegue serio, y un cliente construido con framework. Pero las preguntas van a ser las mismas que llevas seis unidades haciéndote.

<figure class="diagram">
  <figcaption>Lo que te llevas</figcaption>
  <ol class="flow">
    <li>¿Qué significa esto, más allá de cómo se ve?</li>
    <li>¿De qué tipo es este dato, de verdad?</li>
    <li>¿Dónde vive la verdad de esta información?</li>
    <li>¿Quién valida esto, y qué pasa si mienten?</li>
    <li>¿Qué se ve cuando falla?</li>
    <li>¿Puede usarlo alguien que no ve la pantalla?</li>
    <li>¿Sabría explicar por qué lo hice así?</li>
  </ol>
</figure>

Esas preguntas no caducan con la tecnología. El framework de dentro de cinco años será otro; las preguntas, no.

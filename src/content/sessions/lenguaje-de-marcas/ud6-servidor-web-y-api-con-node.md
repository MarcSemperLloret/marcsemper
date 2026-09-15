---
title: "Servidor web y API con Node"
label: "UD6 · Guía y taller práctico"
section: "ud-06"
order: 6
lang: "es"
summary: "La unidad que cierra el módulo. Las rutas sueltas de la UD5 se convierten en una API diseñada: recursos, contrato, CRUD completo, capas separadas y un cliente que consume su propia API de punta a punta, con la configuración y las pruebas necesarias para publicarla."
duration: "6 sesiones de 3 horas · 18 horas"
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

En la UD5 conseguiste algo importante: un servidor propio que responde, aunque únicamente a un conjunto reducido de rutas incorporadas conforme fueron necesitándose.

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

Esta unidad cierra además el módulo completo. Al terminar habrás recorrido el recorrido íntegro: un documento con significado, un diseño que se adapta, una lógica que decide, una interfaz que reacciona, un servidor que responde y una aplicación que se publica.

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
  <p>Todo lo que entra se valida en el servidor, y todo lo que sale constituye una decisión explícita: qué campos se devuelven, qué se oculta y qué se registra. Un objeto entero volcado en una respuesta acaba enseñando cosas que no debía.</p>
</div>

---

## Plan de trabajo por sesiones

| Sesión | Contenido de las tres horas | Práctica central | Horas |
| :---: | :--- | :--- | :---: |
| **Sesión 1** | Diseñar la API | Recursos, contrato y estructura por capas | 3 h |
| **Sesión 2** | El CRUD completo | Lectura, creación, modificación y borrado | 3 h |
| **Sesión 3** | Capas y consistencia | Servicio, repositorio y contrato de errores | 3 h |
| **Sesión 4** | La web y su API | HTML del servidor y cliente conectado | 3 h |
| **Sesión 5** | Listo para publicar | Configuración, seguridad y pruebas | 3 h |
| **Sesión 6** | Cierre del módulo | Proyecto final, despliegue y defensa | 3 h |
| **Total** | | **Una aplicación web completa y publicada** | **18 h** |

Cada sesión dura tres horas y mantiene el reparto de las unidades anteriores: la teoría se concentra al principio y el resto de la tarde se construye. En esta unidad, además, el trabajo empieza por escribir lo que la API promete y solo después por cumplirlo.

<figure class="diagram">
  <figcaption>El ritmo de cada sesión de tres horas</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Se explica · 25 min</li>
    <li>Se trabaja · 150 min</li>
    <li>Cierre · 5 min</li>
  </ol>
</figure>

El bloque de trabajo se divide en pasos cronometrados, y cada sesión termina con una **ampliación** de dos retos para quien acabe antes.

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

## Sesión 1 · Diseñar la API

<p class="lead">Tres horas. Media hora para entender qué distingue una API diseñada de un conjunto de rutas, y dos horas y media escribiendo el contrato de la tuya y reorganizando el proyecto para poder cumplirlo.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué significa orientar una API a recursos, qué piezas forman su contrato y cómo se reparte una aplicación Express en ficheros.</li>
    <li><strong>2. Haz:</strong> Analiza dos APIs reales, escribe el contrato completo de la tuya y reorganiza el proyecto con routers.</li>
    <li><strong>3. Comprueba:</strong> Otra persona podría escribir el cliente solo con tu contrato, y tu aplicación se puede crear sin arrancarla.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Escribe las rutas que tiene hoy tu servidor. Si mañana alguien más las usara, ¿podría adivinar la siguiente?</li>
    <li>¿Cómo sabría un cliente distinguir «no existe» de «se rompió»?</li>
    <li>¿Cómo probarías tu aplicación sin levantar un servidor?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Tu servidor ya funciona. Hoy se convierte en algo que otra persona puede usar sin preguntarte: un contrato escrito, cumplido de forma constante, sobre una estructura que admite crecer.

#### Recursos, no acciones

<p class="term">Recurso</p>

Una cosa del problema que se puede identificar con una URL: un producto, una categoría, un pedido. La ruta nombra el recurso; el método dice qué se hace con él.

| Con acciones en la ruta | Orientado a recursos |
| ----------------------- | -------------------- |
| `GET /obtenerProductos` | `GET /api/productos` |
| `GET /verProducto?id=7` | `GET /api/productos/7` |
| `POST /crearProducto` | `POST /api/productos` |
| `POST /borrarProducto` | `DELETE /api/productos/7` |

La columna derecha tiene una propiedad que la izquierda no: es **predecible**. Quien conozca dos rutas sabe escribir la tercera.

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

| Regla de nombrado | Ejemplo |
| ----------------- | ------- |
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

#### El contrato

| Pieza | Qué fija |
| ----- | -------- |
| Ruta y método | Cómo se pide cada operación |
| Cuerpo de la petición | Qué campos se envían y de qué tipo |
| Código de estado | Qué ha pasado |
| Cuerpo de la respuesta | Qué campos vuelven y con qué nombre |
| Formato de error | La misma forma, siempre |

| Método | Ruta | Éxito | Errores |
| ------ | ---- | :---: | ------- |
| GET | `/api/productos` | 200 | 500 |
| GET | `/api/productos/:id` | 200 | 400, 404 |
| POST | `/api/productos` | 201 | 400 |
| PUT | `/api/productos/:id` | 200 | 400, 404 |
| PATCH | `/api/productos/:id` | 200 | 400, 404 |
| DELETE | `/api/productos/:id` | 204 | 400, 404 |

El 400 de las rutas con identificador no es un capricho: `/api/productos/abc` es una petición mal formada, y responder 404 a eso confunde «no existe» con «no me has pedido bien».

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

| Método | Repetirlo dos veces |
| ------ | ------------------- |
| GET | No cambia nada |
| PUT | Deja el mismo resultado |
| DELETE | El segundo no borra nada nuevo |
| POST | **Crea otro** |

Esa propiedad —que repetir la operación no cambie el resultado— es la que permite que un cliente reintente sin miedo cuando la red falla. Con POST no se puede, y por eso los formularios que se envían dos veces crean dos pedidos.

#### Un router por recurso

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

```javascript
// src/servidor.js
import { crearApp } from "./app.js";

const PUERTO = Number(process.env.PUERTO ?? 3000);
crearApp().listen(PUERTO, () => console.log(`Escuchando en el puerto ${PUERTO}`));
```

<div class="rule">
  <p class="rule-label">Quien crea la aplicación no debe arrancarla</p>
  <p>Si <code>app.js</code> llama a <code>listen</code>, importarlo desde una prueba levanta un servidor de verdad, ocupa un puerto y obliga a apagarlo después.</p>
  <p>Con la aplicación por un lado y el arranque por otro, las pruebas de la sesión 5 importan la aplicación y le hacen peticiones sin abrir ningún puerto. Es una decisión de dos líneas que decide si tu proyecto se puede probar.</p>
</div>

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

### Se trabaja

<p class="stage stage--guided">150 minutos · el contrato y la estructura</p>

Hoy se escribe antes de programar, que es el orden que esta unidad exige. Los dos últimos pasos comprueban las dos promesas de la sesión: que el contrato baste y que la aplicación se pueda probar.

#### Paso 1 · Analizar y diseñar · 35 min

1. Explora dos APIs públicas y anota diez rutas de cada una.
2. Clasifícalas: ¿orientadas a recursos o a acciones?
3. Localiza cómo filtran, cómo paginan y cómo devuelven los errores.
4. Diseña sobre papel la tabla de rutas de **tu** proyecto: método, ruta, qué hace, qué devuelve y con qué código.
5. Añade un segundo recurso que tenga relación con el primero, y decide cómo se expresa esa relación en las rutas.

#### Paso 2 · El contrato escrito · 40 min

1. Escribe la tabla completa de tu API, con éxitos y errores por ruta.
2. Define el objeto que representa un producto: campos, tipos y cuáles son obligatorios.
3. Define el formato único de error, con sus códigos.
4. Añade paginación al contrato y decide qué devuelve exactamente la respuesta paginada.
5. Escribe `peticiones.http` con un ejemplo de cada caso, **incluidos los que fallan**.

**Antes de continuar:** para cada ruta con identificador, el contrato distingue el 400 del 404 y dice cuándo se devuelve cada uno.

#### Paso 3 · Reorganizar · 40 min

1. Crea `src/app.js` con `crearApp()` y deja `servidor.js` solo con el arranque.
2. Mueve las rutas de productos a su router.
3. Mueve el registro y los errores a `src/middleware/`.
4. Comprueba que todo sigue funcionando con tu fichero de peticiones.
5. Añade el router del segundo recurso, aunque esté vacío, y monta su ruta base.
6. Monta la API bajo `/api/v1` cambiando **una sola línea**. Si has tenido que tocar más de una, las rutas del router no eran relativas.

#### Paso 4 · Que otro escriba el cliente · 20 min

Dale a un compañero **solo el contrato**, sin acceso a tu código ni a tu servidor.

| Encargo | ¿Lo resolvió? | Qué le faltó del contrato |
| ------- | ------------- | ------------------------- |
| Escribir la llamada que lista los productos de una categoría | | |
| Escribir la llamada que crea un producto | | |
| Decir qué recibe si el precio es inválido | | |
| Decir qué recibe si pide un identificador que no existe | | |
| Adivinar una ruta que no le has enseñado | | |

Cada hueco de la tercera columna es un agujero de tu contrato, no un despiste de la persona. Corrígelo y vuelve a probarlo.

#### Paso 5 · La aplicación sin puerto · 15 min

1. Escribe un pequeño programa que importe `crearApp()` y le haga una petición **sin llamar a `listen`**.
2. Comprueba que ningún puerto queda ocupado: arráncalo dos veces seguidas y mira que no da `EADDRINUSE`.
3. Ahora haz lo contrario: mete el `listen` dentro de `app.js` y repite el apartado 1. Anota qué ocurre.
4. Devuelve el `listen` a su sitio.
5. Escribe en un comentario por qué esta separación importa más de lo que parece. En la sesión 5 la vas a necesitar para cada prueba que escribas.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. Los dos retos tratan el contrato como lo que es: algo que otros usan y que no se puede cambiar a la ligera.

##### Reto 1 · La versión 2 sin romper la 1

Tu API ya la usa alguien. Ahora hay que cambiar algo que rompe el contrato: el campo `precio` pasa a ser un objeto con `importe` y `moneda`.

1. Enumera **todo** lo que se rompería en un cliente que ya funciona.
2. Decide una estrategia de versionado. Hay al menos tres: en la ruta, en una cabecera, o por parámetro. Busca qué hace cada una, elige y justifica.
3. Implementa la que elijas de modo que `/api/v1/productos` siga devolviendo lo de antes y `/api/v2/productos` devuelva la forma nueva. Reutiliza la lógica: lo que cambia es la representación, no los datos.
4. ¿Durante cuánto tiempo mantendrías la v1, y cómo avisarías de que va a desaparecer? Busca qué cabecera existe para eso.
5. Hay cambios que **no** rompen el contrato y se pueden hacer sin versionar. Escribe tres ejemplos y explica por qué son seguros.
6. Explica en tres líneas por qué esto no es una preocupación exagerada para un proyecto de clase. La respuesta tiene que ver con quién consume tu API a partir de la sesión 4: tu propio cliente.

##### Reto 2 · Una decisión discutible en una API real

Elige una API pública con documentación abierta y búscale una decisión de diseño que no seguirías.

1. Documéntala: qué hace, con qué rutas, y qué te parece discutible.
2. Busca si hay una razón histórica o técnica detrás. Muchas decisiones raras lo son por compatibilidad con algo anterior, y eso cambia el juicio.
3. Escribe cómo la harías tú, con la tabla de rutas equivalente.
4. Enumera qué perdería tu versión respecto a la original. Siempre se pierde algo: si no encuentras nada, no has entendido la decisión original.
5. Busca en la misma API una decisión que al principio te pareciera rara y que, al mirarla despacio, resulte acertada. Explícala.
6. Compara esa API con tu contrato: ¿qué le copiarías?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La tabla de rutas de tu proyecto con siete entradas, el contrato completo con su formato de error, y la aplicación separada del arranque.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla del paso 4 contestada y sus agujeros corregidos, y la API montada bajo <code>/api/v1</code> cambiando una línea.</span></div>
  <div><strong>Reto</strong><span>El versionado implementado con las dos versiones conviviendo, o el análisis razonado de una API real.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Tu API está diseñada por recursos y escrita como contrato.</li>
    <li>Los filtros van en la cadena de consulta, no en rutas nuevas.</li>
    <li>Todos los errores comparten forma, con su código propio.</li>
    <li>Distingues 400 de 404 en la misma ruta.</li>
    <li>Cada recurso tiene su router, con rutas relativas.</li>
    <li>La aplicación se puede crear sin arrancarla.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué las rutas no llevan verbos, y dónde van los filtros?</li>
    <li>¿Qué significa que el servidor no guarde estado?</li>
    <li>¿Qué código devuelve una creación correcta, y qué cabecera la acompaña?</li>
    <li>¿Qué responde <code>/api/productos/abc</code>, y por qué no un 404?</li>
    <li>¿Qué operaciones se pueden repetir sin consecuencias, y cuál no?</li>
    <li>¿Por qué la aplicación se crea en un fichero y se arranca en otro?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el verbo ya lo aporta el método HTTP; los filtros van en la cadena de consulta, porque no son recursos distintos.</p>
  <p>2 · Que no recuerda nada entre peticiones: cada una trae todo lo que necesita.</p>
  <p>3 · Un 201, con la cabecera <code>Location</code>.</p>
  <p>4 · Un 400: la petición está mal formada, no es que el recurso no exista.</p>
  <p>5 · GET, PUT y DELETE se pueden repetir; POST crea otro recurso cada vez.</p>
  <p>6 · Para poder importarla en las pruebas sin ocupar un puerto.</p>
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

## Sesión 2 · El CRUD completo

<p class="lead">Tres horas. Media hora para decidir qué valida cada ruta y qué código devuelve, y dos horas y media implementando las cinco operaciones de tu recurso según el contrato de ayer.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se implementan las lecturas con filtros validados, cómo se recibe y se valida un recurso nuevo, y qué distingue reemplazar de modificar.</li>
    <li><strong>2. Haz:</strong> Las cinco operaciones de tu recurso, con sus errores y sus códigos.</li>
    <li><strong>3. Comprueba:</strong> Ninguna entrada inválida llega a tocar los datos, y repetir una operación no produce efectos distintos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué debe devolver <code>/api/productos?max=abc</code>? ¿Y <code>?categoria=inexistente</code>?</li>
    <li>¿Qué pasaría si alguien envía un campo <code>id</code> en la creación?</li>
    <li>¿Puede el cliente saltarse tu validación de la UD4?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Hoy se implementa el contrato de ayer. Todo lo que aparece se reduce a dos preguntas que se repiten en cada ruta: **qué entra y quién lo comprueba**, y **qué código dice lo que ha pasado**.

#### Leer: la ruta recoge, el servicio decide

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

Los parámetros de la consulta llegan como texto, igual que en la UD4:

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

En la obtención por identificador conviven los dos errores del contrato, dentro del mismo `try` que delega en `next`:

```javascript
const id = Number(peticion.params.id);
if (!Number.isInteger(id) || id < 1) {
  throw new ErrorDeValidacion([{ campo: "id", mensaje: "Debe ser un entero positivo" }]);
}

const producto = await servicio.obtener(id);
if (!producto) throw new ErrorNoEncontrado("Producto no encontrado");
```

Una función decide, por último, **qué sale**, en lugar de devolver el objeto tal como está guardado:

```javascript
function aRespuesta({ id, nombre, precio, categoria, stock }) {
  return { id, nombre, precio, categoria, disponible: stock > 0 };
}
```

Devolver el objeto en su forma almacenada resulta inmediato y expone información que no corresponde publicar: notas internas, márgenes o el propio stock. Una función que decide la forma pública del recurso deja explícito qué sale, y evita que añadir un campo interno lo publique sin querer.

#### Crear: la validación, en tres pasos

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

La respuesta incluye el recurso creado y la cabecera `Location` con su URL, porque **quien crea no elige el identificador**: lo asigna el servidor. Por eso `id` no está entre los campos permitidos.

```javascript
const datos = validarProductoNuevo(peticion.body);   // lanza si no vale
const creado = await servicio.crear(datos);

respuesta
  .status(201)
  .location(`/api/productos/${creado.id}`)
  .json(aRespuesta(creado));
```

<figure class="diagram">
  <figcaption>Las tres validaciones, otra vez</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Nativa · comodidad</li>
    <li>Cliente · buena experiencia</li>
    <li>Servidor · la única obligatoria</li>
  </ol>
</figure>

Cualquiera puede llamar a tu API con un cliente HTTP y saltarse las dos primeras. Lo comprobarás hoy mismo.

#### Modificar y borrar

| Método | Significa | Cuerpo |
| ------ | --------- | ------ |
| PUT | Reemplaza el recurso entero | Todos los campos |
| PATCH | Modifica los campos enviados | Solo los que cambian |

```javascript
// PUT: lo que no llega, se pierde
const reemplazo = validarProductoNuevo(peticion.body);

// PATCH: se combina con lo que había
const cambios = validarCambios(peticion.body);      // ninguno obligatorio
```

El error clásico es implementar PUT combinando los campos: entonces tienes dos rutas que hacen lo mismo y un contrato que miente. Si solo vas a ofrecer una, ofrece PATCH y dilo en el contrato.

```javascript
const borrado = await servicio.borrar(id);
if (!borrado) throw new ErrorNoEncontrado("Producto no encontrado");
respuesta.status(204).end();
```

Un 204 no lleva cuerpo: la operación ha ido bien y no hay nada que devolver. Sobre el segundo borrado existen dos posturas defendibles —404 porque ya no está, o 204 porque el resultado deseado se cumple— pero elige una **y escríbela en el contrato**.

<div class="rule">
  <p class="rule-label">Leer, modificar y guardar no es una operación indivisible</p>
  <p>Dos peticiones que llegan casi a la vez leen la misma versión del fichero, cada una aplica su cambio y la segunda escribe encima: el cambio de la primera desaparece sin que nadie se entere. Es la carrera que demostraste en la UD5, ahora con dos clientes en lugar de dos procesos.</p>
  <p>Se resuelve con una versión en el recurso, que el cliente devuelve al modificar: si no coincide, el servidor responde 409 en lugar de pisar. Es el mismo problema que en el módulo de servidor se resuelve con transacciones.</p>
</div>

### Se trabaja

<p class="stage stage--guided">150 minutos · las cinco operaciones</p>

Los tres primeros pasos implementan el contrato. Los dos últimos lo atacan: uno se salta tu propio cliente, y el otro comprueba la propiedad que permite reintentar sin miedo.

#### Paso 1 · Las lecturas completas · 35 min

1. Implementa la lista con filtro por categoría, texto y precio máximo.
2. Añade orden por dos campos, ascendente y descendente.
3. Implementa la obtención por identificador con sus dos errores.
4. Valida todos los parámetros y responde 400 con detalles.
5. Escribe la función que decide la forma pública del recurso, y comprueba que un campo interno nuevo **no** aparece en la respuesta.
6. Añade paginación con `limite` y `pagina`, devolviendo también el total.

**Antes de continuar:** `?categoria=inexistente` devuelve 200 con lista vacía y `?max=abc` devuelve 400. Si los dos dan lo mismo, la distinción no está hecha.

#### Paso 2 · La creación · 40 min

1. Implementa `POST /api/productos` con validación en tres pasos.
2. Devuelve 201, `Location` y el recurso creado.
3. Devuelve 400 con **todos** los errores, no solo el primero.
4. Descarta los campos no permitidos y demuéstralo enviando un `id` y un campo inventado.
5. Comprueba qué ocurre si el cuerpo no es JSON válido, y que da 400 y no 500.
6. Responde 409 si ya existe un producto con el mismo nombre.

#### Paso 3 · El CRUD cerrado · 40 min

1. Implementa PATCH con validación de los campos enviados, ninguno obligatorio.
2. Decide si ofreces PUT; si lo haces, que reemplace de verdad.
3. Implementa DELETE con 204 y su comportamiento documentado para el segundo borrado.
4. Añade una fecha de modificación que mantiene el servidor, no el cliente.
5. Impide modificar campos que el cliente no debería tocar, como el identificador o la fecha de creación.
6. Actualiza `peticiones.http` con todos los casos nuevos.

#### Paso 4 · Sáltate tu propio cliente · 20 min

Tu formulario de la UD4 valida. Comprueba qué pasa cuando alguien no lo usa: desde el fichero `.http`, envía estas peticiones directamente a la API.

| Petición enviada a mano | Qué debería responder | Qué responde | Corrección |
| ----------------------- | --------------------- | ------------ | ---------- |
| Producto con precio negativo | | | |
| Producto sin nombre | | | |
| Producto con `"id": 1` incluido | | | |
| Producto con un campo inventado | | | |
| Producto con `"precio": "veinte"` | | | |
| Cuerpo que no es un objeto, sino un array | | | |
| Cuerpo vacío | | | |

Las dos últimas son las que se olvidan. Ninguna de las siete debe devolver 500, y ninguna debe llegar a escribir en el fichero de datos.

Escribe al terminar, en una línea, qué habría pasado si tu única validación fuera la del formulario.

#### Paso 5 · Repetir sin consecuencias · 15 min

1. Ejecuta dos veces seguidas el mismo PATCH. Compara el recurso después de la primera y de la segunda.
2. Ejecuta dos veces el mismo DELETE. Anota qué responde cada una.
3. Ejecuta dos veces el mismo POST. Cuenta los productos.
4. Rellena la tabla con lo observado y compárala con la del contrato de la sesión 1.

| Operación | Primera vez | Segunda vez | ¿Coincide con el contrato? |
| --------- | ----------- | ----------- | -------------------------- |
| GET | | | |
| PUT o PATCH | | | |
| DELETE | | | |
| POST | | | |

5. Explica en dos líneas por qué esa propiedad importa cuando la red falla y el cliente reintenta.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. El primer reto convierte la validación en dato; el segundo resuelve la carrera que arrastras desde la UD5.

##### Reto 1 · Las reglas de validación, como tabla

Tu `validarProductoNuevo` tiene las reglas escritas a mano. Con dos recursos más, serán tres funciones casi idénticas.

```javascript
const ESQUEMA_PRODUCTO = {
  nombre:      { tipo: "texto",  obligatorio: true,  minimo: 2, maximo: 120 },
  precio:      { tipo: "numero", obligatorio: true,  minimo: 0.01 },
  categoria:   { tipo: "texto",  obligatorio: true,  valores: ["teclados", "ratones"] },
  stock:       { tipo: "entero", obligatorio: false, minimo: 0, porDefecto: 0 },
  descripcion: { tipo: "texto",  obligatorio: false, maximo: 500 }
};
```

1. Escribe `validar(cuerpo, esquema)` que recorra el esquema, aplique cada regla y devuelva los datos limpios o lance con **todos** los errores.
2. Que la lista blanca salga del propio esquema: lo que no esté declarado, se descarta.
3. Aplica los valores por defecto de los campos opcionales ausentes.
4. Escribe un segundo esquema para PATCH, donde nada sea obligatorio, derivándolo del primero en lugar de repetirlo.
5. Añade un tipo nuevo —`fecha`— **sin tocar** la función `validar`. Si has tenido que tocarla, el diseño no era genérico.
6. Escribe el esquema del segundo recurso de tu API y comprueba que la misma función sirve. Anota en tres líneas qué has ganado y qué has perdido respecto a los `if` escritos a mano: hay una pérdida real y conviene nombrarla.

##### Reto 2 · Dos clientes que se pisan

Reproduce la carrera de la UD5, ahora con dos peticiones HTTP en lugar de dos procesos.

1. Pide el mismo producto desde dos clientes. Los dos tienen ahora la misma versión.
2. Desde el primero, envía un PATCH que cambie el precio. Desde el segundo, sin volver a leer, envía otro que cambie el stock.
3. Consulta el producto. Uno de los dos cambios ha desaparecido. Explica exactamente por qué, siguiendo el orden de lectura y escritura.
4. Añade al recurso un campo de versión que el servidor incrementa en cada modificación y devuelve en cada lectura.
5. Haz que PATCH exija esa versión y responda **409** si no coincide con la actual. Decide si va en el cuerpo o en una cabecera, y busca cuál es la cabecera estándar para esto.
6. Repite el apartado 2 con la protección puesta. El segundo cliente debe recibir un 409, y su mensaje debe decirle qué hacer: volver a leer y reintentar.
7. Explica en tres líneas por qué esta estrategia se llama optimista, y cuál sería la alternativa pesimista. La segunda es la que verás en el módulo de servidor.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las cinco operaciones funcionando según el contrato, con validación completa y los códigos correctos.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de las siete peticiones hostiles contestada sin ningún 500, y la de repetición comprobada contra el contrato.</span></div>
  <div><strong>Reto</strong><span>La validación por esquema sirviendo a dos recursos, o la versión del recurso con su 409.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>La ruta recoge y valida; el servicio decide.</li>
    <li>Un filtro inválido responde 400 y una búsqueda sin resultados, 200 con lista vacía.</li>
    <li>Solo entran los campos permitidos, y el identificador lo asigna el servidor.</li>
    <li>Se devuelven todos los errores de validación de una vez.</li>
    <li>Decides explícitamente qué campos salen en la respuesta.</li>
    <li>Ninguna de las peticiones hostiles devuelve 500 ni escribe en los datos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué devuelve <code>?max=abc</code> y qué devuelve <code>?categoria=inexistente</code>?</li>
    <li>¿Por qué se decide explícitamente qué campos salen?</li>
    <li>¿Qué es una lista blanca de campos y qué evita?</li>
    <li>¿Qué devuelve una creación correcta?</li>
    <li>Diferencia entre PUT y PATCH.</li>
    <li>¿Qué ocurre si dos clientes modifican el mismo recurso a la vez?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Un 400 el primero, porque el parámetro está mal formado; un 200 con lista vacía el segundo, porque la petición era válida.</p>
  <p>2 · Para no publicar campos internos al añadirlos al modelo.</p>
  <p>3 · Enumerar los campos que se aceptan y descartar el resto; evita que quien llama introduzca campos no previstos.</p>
  <p>4 · Un 201 con <code>Location</code> y el recurso creado.</p>
  <p>5 · Con PUT los campos que no llegan se pierden; con PATCH se conservan.</p>
  <p>6 · Que la segunda escritura pise a la primera sin que nadie lo note, salvo que haya una versión que lo detecte.</p>
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

## Sesión 3 · Capas y consistencia

<p class="lead">Tres horas. Media hora para entender qué sabe cada capa y qué no debe saber ninguna, y dos horas y media separando tu proyecto hasta poder cambiarle el almacén sin tocar una sola ruta.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué hace cada capa, cómo se sostiene la coherencia de los datos y cómo se traduce cada error interno a una respuesta HTTP en un solo sitio.</li>
    <li><strong>2. Haz:</strong> Separa ruta, servicio y repositorio; sustituye el almacén por otro; cierra el manejador central de errores.</li>
    <li><strong>3. Comprueba:</strong> Puedes cambiar el almacén sin tocar nada más, y ninguna ruta decide ya un código de estado por su cuenta.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántos ficheros tocarías hoy si cambiaras el fichero JSON por una base de datos?</li>
    <li>¿Qué pasa si el fichero de datos tiene un producto sin precio, o dos con el mismo identificador?</li>
    <li>¿Cuántos sitios de tu código deciden hoy un código de estado?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

La sesión tiene una sola prueba, y hoy se pasa o no se pasa: **cambiar el sitio donde viven los datos sin tocar nada por encima**. Todo lo demás son las condiciones para que eso sea posible.

#### Las tres capas

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
  <p>Y la prueba de fuego: si cambiar el fichero JSON por otro almacén obliga a tocar algo fuera del repositorio, todavía no están separadas. Ese es exactamente el ejercicio de hoy.</p>
</div>

Con un solo recurso y un fichero, esta separación parece burocracia. Sus tres razones aparecen enseguida: se puede probar el servicio sin levantar un servidor; se puede cambiar el almacén sin tocar la API; y cuando el proyecto tiene ocho recursos, todos se organizan igual y cualquiera sabe dónde mirar. Es, además, la arquitectura que verás en el módulo de servidor con otros nombres: controlador, servicio y repositorio.

#### El repositorio como frontera

```javascript
// La interfaz que el servicio conoce
export async function todos() {}
export async function porId(id) {}
export async function guardar(producto) {}
export async function eliminar(id) {}
```

Mientras el conjunto de funciones y lo que devuelven no cambie, el servicio no distingue si detrás hay un fichero, una base de datos o una API ajena.

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

Un proyecto que se prueba necesita además poder volver a un estado conocido, con un script que rellene el fichero con datos de ejemplo:

```json
{ "scripts": { "sembrar": "node src/herramientas/sembrar.js" } }
```

Sin él, cada prueba deja los datos en un estado distinto y los fallos dejan de ser reproducibles.

#### La traducción de errores, en un solo sitio

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

Añadir un tipo de error nuevo se reduce a añadir una línea a la tabla, sin que ninguna ruta necesite conocer qué código corresponde a su fallo.

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

Al otro lado se cobra el contrato de la sesión 1: **una sola función** en el cliente sirve para toda la API, hoy y cuando añadas rutas.

```javascript
async function pedir(url, opciones) {
  const respuesta = await fetch(url, opciones);
  if (respuesta.ok) return respuesta.status === 204 ? null : respuesta.json();

  const cuerpo = await respuesta.json().catch(() => ({}));
  throw new ErrorDeApi(respuesta.status, cuerpo.error ?? "Error inesperado", cuerpo.detalles ?? []);
}
```

Si cada error tuviera una forma distinta, esta función no podría existir.

### Se trabaja

<p class="stage stage--guided">150 minutos · separar, sustituir y diagnosticar</p>

Los tres primeros pasos construyen la separación. Los dos últimos la ponen a prueba: uno cambia el almacén de verdad, el otro recorre los cinco errores desde el navegador hasta el registro.

#### Paso 1 · La separación · 40 min

1. Crea `src/servicio/` y `src/repositorio/` y reparte el código que hoy está mezclado.
2. Deja las rutas sin ninguna referencia a ficheros.
3. Deja el servicio sin ninguna referencia a peticiones ni respuestas.
4. Mueve al servicio las reglas de negocio que estaban en las rutas, como «no se puede borrar un producto con stock».
5. Busca las dos palabras de la prueba —`respuesta` en el servicio, `peticion` en el repositorio— y corrige lo que aparezca.
6. Escribe un programa que use el servicio directamente, sin HTTP, y cree y borre un producto.

**Antes de continuar:** ese programa del apartado 6 funciona sin que Express esté arrancado. Si necesita el servidor, el servicio todavía depende de la capa de arriba.

#### Paso 2 · Cambiar el almacén · 40 min

1. Escribe en un comentario la lista exacta de funciones que el servicio espera del repositorio, con lo que recibe y lo que devuelve cada una.
2. Normaliza los datos al leerlos del fichero, con una función `normalizar`.
3. Escribe un segundo repositorio que guarde en memoria, con esa misma lista de funciones.
4. Elige entre uno y otro con una variable de entorno, en un solo punto del programa.
5. Escribe el script de siembra y añádelo a los `scripts` de `package.json`.
6. Prueba tu fichero `.http` completo contra los dos repositorios.

#### Paso 3 · Errores de punta a punta · 40 min

1. Define los cinco tipos de error de tu aplicación, cada uno con su nombre y su código.
2. Escribe la tabla de traducción y el manejador central.
3. Añade el identificador de petición y sácalo en el registro y en la respuesta.
4. Elimina todos los códigos de estado repartidos por las rutas. Al terminar, `status(` no debería aparecer en ninguna ruta salvo para las respuestas correctas.
5. Escribe la función `pedir` en el cliente y úsala en toda la interfaz, sustituyendo cada `fetch` suelto.
6. Muestra en el formulario los detalles de validación campo por campo, aprovechando el array `detalles`.

#### Paso 4 · La prueba del cambio de almacén · 15 min

Hasta aquí has escrito la separación. Ahora se comprueba si es real.

1. Anota el estado de tu repositorio con `git status` antes de empezar.
2. Cambia al repositorio en memoria y ejecuta el fichero `.http` completo.
3. Rellena la tabla con lo que ha hecho falta tocar.

| Qué ha habido que tocar para cambiar de almacén | Ficheros | ¿Debería haber hecho falta? |
| ----------------------------------------------- | -------- | --------------------------- |
| Rutas | | |
| Servicio | | |
| Repositorio | | |
| Configuración o arranque | | |

4. Cualquier fila fuera del repositorio y del punto único de configuración señala una fuga: algo de arriba sabe cómo se guardan los datos. Localízala y escribe en una línea qué la causaba.
5. Si las dos ejecuciones no dan el mismo resultado, anota en qué petición difieren. Hay una diferencia legítima entre un almacén que persiste y otro que no, y conviene saber nombrarla.

#### Paso 5 · Los cinco errores, desde el navegador · 15 min

Provoca cada error desde la interfaz, no desde el fichero `.http`, y recorre el camino entero.

| Error provocado | Código | Qué ve la persona | Qué aparece en el registro |
| --------------- | :----: | ----------------- | -------------------------- |
| Precio inválido en el formulario | | | |
| Producto que no existe | | | |
| Borrado de un producto con stock | | | |
| Fichero de datos corrupto a propósito | | | |
| Excepción inesperada lanzada a mano en el servicio | | | |

Las dos últimas son las que importan: comprueba que la persona ve un mensaje genérico con su identificador, que la traza completa queda solo en el registro, y que el identificador de la pantalla coincide con el del registro.

Escribe al terminar, en una línea, qué habrías tenido que hacer para diagnosticar el quinto caso sin ese identificador.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. El primer reto lleva la frontera del repositorio hasta donde se rompe; el segundo convierte tus registros en una herramienta de diagnóstico.

##### Reto 1 · El tercer almacén

Dos repositorios que leen de un array y de un fichero se parecen demasiado para probar nada. Escribe un tercero contra algo que se comporte de otra manera: una API pública de solo lectura, o una base de datos ligera como SQLite.

1. Impleméntalo con la misma lista de funciones, sin cambiar su forma.
2. Anota cada punto en el que la interfaz se queda corta. Aparecerán varios: un almacén remoto puede tardar, puede paginar, puede fallar por red, y puede no permitir borrar.
3. Decide qué hacer con lo que el almacén nuevo no sabe hacer. Fallar de forma explícita es una respuesta válida; fingir que ha funcionado, no.
4. Traduce los fallos propios de ese almacén a los tipos de error de tu aplicación. El servicio no debería recibir nunca un error de red en crudo.
5. Rediseña la interfaz si hace falta, y vuelve a probar los tres repositorios con ella. Cambiar la interfaz por culpa del tercero indica que estaba escrita a la medida del fichero.
6. Explica en tres líneas qué has aprendido sobre tu primera interfaz. Una abstracción solo se valida con la segunda implementación, y se confirma con la tercera.

##### Reto 2 · Seguir el rastro de un fallo

Tus registros hoy sirven para mirarlos por encima. Conviértelos en algo sobre lo que se pueda buscar.

1. Pasa el registro a formato estructurado: una línea por petición, en JSON, con identificador, método, ruta, código de estado y duración en milisegundos.
2. Haz que el identificador llegue hasta el repositorio, de modo que una operación de escritura pueda registrarse asociada a la petición que la causó. Piensa cómo pasarlo sin que el servicio hable de HTTP.
3. Escribe el registro en un fichero además de en la consola, y decide qué ocurre cuando ese fichero crece.
4. Provoca veinte peticiones, tres de ellas con error, y escribe el comando que extrae de tu fichero de registro solo las que fallaron.
5. Ahora el ejercicio de verdad: pide a un compañero que introduzca un fallo en tu código sin decirte cuál. Reprodúcelo desde la interfaz, apunta el identificador y diagnostica la causa **mirando solo el registro**, sin leer el código.
6. Escribe qué dato te faltó en el registro para llegar antes. Añádelo, y repite el apartado 5 con un fallo distinto.
7. Decide qué **no** debe aparecer nunca en un registro. Hay al menos tres categorías de dato que no pueden acabar ahí; nómbralas y comprueba que las tuyas están limpias.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las tres capas separadas, dos repositorios intercambiables y el manejador central de errores con su identificador de petición.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla del cambio de almacén sin ninguna fuga, y los cinco errores recorridos de la pantalla al registro.</span></div>
  <div><strong>Reto</strong><span>El tercer almacén con la interfaz revisada, o el registro estructurado sirviendo para diagnosticar un fallo ajeno.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Cada capa sabe solo lo suyo, y las reglas de negocio viven en el servicio.</li>
    <li>El servicio se puede usar sin levantar el servidor.</li>
    <li>Los datos se normalizan al leerse del almacén.</li>
    <li>Has cambiado de almacén sin tocar rutas ni servicio.</li>
    <li>Los errores se traducen a HTTP en un solo sitio.</li>
    <li>El cliente trata todos los errores con una sola función.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿A qué capa pertenece escribir un 404, la regla del stock y leer el fichero de datos?</li>
    <li>¿Cómo compruebas que tus capas están separadas de verdad?</li>
    <li>¿Por qué se normalizan los datos al leerlos del almacén?</li>
    <li>¿Qué permite sustituir un repositorio por otro?</li>
    <li>¿Por qué el cliente nunca debe ver la traza de un error?</li>
    <li>¿Para qué sirve el identificador de petición?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El 404 a la ruta, la regla del stock al servicio, la lectura del fichero al repositorio.</p>
  <p>2 · Buscando <code>respuesta</code> en el servicio y <code>peticion</code> en el repositorio, y comprobando que cambiar el almacén no obliga a tocar nada más.</p>
  <p>3 · Porque el fichero también es entrada externa y puede llegar incompleto o con otra forma.</p>
  <p>4 · Que los dos ofrezcan la misma lista de funciones con el mismo comportamiento.</p>
  <p>5 · Porque revela detalles internos del servidor sin aportar nada a quien la lee.</p>
  <p>6 · Para relacionar lo que ve la persona con la traza completa del registro.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Microprueba semanal 3 · 5–10 minutos</p>
  <p>Individual, sin IA y sin apuntes.</p>
  <ol>
    <li>Di a qué capa pertenece cada cosa: escribir un 404, «no se puede borrar un producto con stock», y leer el fichero de datos.</li>
    <li>¿Cómo compruebas que tus capas están separadas de verdad?</li>
    <li>¿Por qué el cliente nunca debe ver la traza de un error?</li>
  </ol>
</div>

---

## Sesión 4 · La web y su API

<p class="lead">Tres horas. Media hora para ver de dónde puede salir el HTML y qué recorrido hace un envío, y dos horas y media conectando tu interfaz de la UD4 con la API que escribiste ayer.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cuándo conviene generar el HTML en el servidor, cómo consume el cliente su propia API y qué ocurre entre pulsar «Enviar» y ver el resultado.</li>
    <li><strong>2. Haz:</strong> Sirve el catálogo generado en el servidor, alimenta la interfaz con tu API y monta el alta y el borrado reales.</li>
    <li><strong>3. Comprueba:</strong> Un nombre con etiquetas no ejecuta nada, y cada error del servidor aparece junto al campo que lo causó.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>En la UD4 el catálogo se pintaba en el navegador. ¿Qué ve alguien con JavaScript desactivado, y qué ve un buscador que indexa tu web?</li>
    <li>¿Qué pasaría si el nombre de un producto contuviera una etiqueta?</li>
    <li>Enumera todo lo que ocurre entre pulsar «Enviar» y ver el resultado.</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Hoy se juntan las dos mitades del módulo: la interfaz de la UD4 y la API de esta unidad. Todo lo que aparece responde a tres decisiones: **dónde se genera el HTML**, **dónde se filtran los datos** y **qué pasa cuando el servidor dice que no**.

#### Las dos formas de pintar

| Dónde se genera | Ventajas | Inconvenientes |
| --------------- | -------- | -------------- |
| En el servidor | Llega listo, funciona sin JavaScript, se indexa | Cada cambio recarga la página |
| En el cliente | Interacción inmediata, menos trabajo del servidor | Depende de que el código se ejecute |

La elección no es permanente: lo habitual es que la primera carga llegue hecha del servidor y la interacción se resuelva en el cliente. Es lo que vas a montar hoy.

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

Las plantillas del lenguaje, las de la UD3, bastan para esto sin instalar un motor de plantillas. Un motor aporta herencia de plantillas y sintaxis propia; a cambio, una dependencia más y un lenguaje más que aprender.

```javascript
const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapar(valor) {
  return String(valor).replace(/[&<>"']/g, (caracter) => ESCAPES[caracter]);
}
```

<div class="rule">
  <p class="rule-label">Todo dato que entra en el HTML se escapa</p>
  <p>Si un producto se llama <code>Teclado &lt;script&gt;…&lt;/script&gt;</code> y se inserta sin escapar, ese código se ejecuta en el navegador de quien visite tu página, con sus permisos y sus datos de sesión. Esa vulnerabilidad se denomina <em>cross-site scripting</em> y es la más extendida de la web.</p>
  <p>Es el mismo problema del <code>innerHTML</code> de la UD4, ahora del lado del servidor y con más alcance: allí afectaba a quien lo escribía, aquí a todo el que visite la página.</p>
  <p>Importa además el sitio donde insertas: escapar sirve para el contenido y para los atributos entrecomillados. Meter datos de fuera dentro de un bloque de código de la página o en una URL requiere reglas distintas, y lo sensato es no hacerlo.</p>
</div>

#### El cliente consume su propia API

```javascript
const productos = await pedir("/api/productos");
```

Como el cliente se sirve desde el mismo servidor que la API, la petición es relativa y no cruza de origen: sin dominio, sin puerto y sin CORS. Es una de las razones prácticas de servir ambas cosas juntas mientras el proyecto es pequeño.

| Dónde filtrar | Cuándo conviene |
| ------------- | --------------- |
| En el cliente | Pocos datos, ya descargados: respuesta instantánea |
| En el servidor | Muchos datos, o filtros que dependen de reglas o permisos |

<div class="rule">
  <p class="rule-label">El lugar del filtrado es una decisión de diseño</p>
  <p>Con doscientos productos, descargarlos una vez y filtrar en el navegador ofrece mejor experiencia, porque no hay espera. Con doscientos mil, o cuando el filtro depende de quién pregunta, la única opción es el servidor.</p>
  <p>Lo que no vale es hacerlo en los dos sitios con reglas distintas: entonces el mismo filtro da resultados diferentes según por dónde pase, y ese fallo resulta muy difícil de encontrar. Toma la decisión, escríbela en tus notas y manténla.</p>
</div>

El estado que montaste en la UD4 ya tenía sitio para `cargando` y `error`. Hoy esos campos dejan de ser una simulación:

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

#### Un envío, de punta a punta

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

Dos detalles se olvidan casi siempre. Deshabilitar el botón mientras se envía evita el doble envío, que con POST crea dos productos. Anunciar el resultado en la región activa de la UD4 consigue que el éxito no sea solo un cambio visual que algunas personas no perciben.

### Se trabaja

<p class="stage stage--guided">150 minutos · la aplicación completa</p>

Los tres primeros pasos montan la aplicación entera. Los dos últimos la atacan: uno intenta ejecutar código en tu página, el otro rompe la red a propósito.

#### Paso 1 · La página del servidor · 40 min

1. Escribe `src/vistas/catalogo.js` que genere la página completa.
2. Escribe la función de escapado y úsala en **todos** los datos que entren en el HTML.
3. Sirve la página en `GET /` desde su router, usando el servicio de ayer para obtener los productos.
4. Comprueba con «ver código fuente» que el HTML llega hecho, no vacío.
5. Añade la página de detalle de un producto, con su propio 404 en HTML y no en JSON.
6. Valida el HTML generado en el W3C, con datos reales dentro.

**Antes de continuar:** desactiva JavaScript en el navegador y recarga. El catálogo debe seguir viéndose.

#### Paso 2 · Conectar el cliente · 40 min

1. Sustituye los datos escritos a mano de la UD4 por una llamada a tu API.
2. Usa la función `pedir` de la sesión 3 para todas las llamadas, sin ningún `fetch` suelto.
3. Decide dónde filtras, impleméntalo en un solo sitio y déjalo escrito en tus notas con la razón.
4. Añade el botón de reintentar cuando la carga falla.
5. Comprueba en la pestaña de red qué se envía y qué vuelve en cada filtro.
6. Añade el borrado desde la lista, con confirmación previa.

#### Paso 3 · El formulario real · 40 min

1. Añade el formulario de alta a tu página, con su marcado accesible: etiquetas asociadas, tipos correctos y mensajes vinculados.
2. Envía con `fetch` y trata las dos respuestas posibles.
3. Muestra los errores del servidor en su campo y lleva el foco al primero.
4. Deshabilita el botón durante el envío y devuélvelo a su estado después, también cuando falla.
5. Anuncia el resultado en la región activa.
6. Añade la edición reutilizando el mismo formulario, con PATCH en lugar de POST.

#### Paso 4 · El ataque que no debe ocurrir · 15 min

Crea productos cuyos nombres sean cada una de estas cadenas y observa qué ocurre en la página generada por el servidor y en la lista pintada por el cliente.

| Nombre del producto | Qué se ve | ¿Se ejecuta algo? |
| ------------------- | --------- | ----------------- |
| `Teclado <b>rebajado</b>` | | |
| `Teclado <img src=x onerror="alert(1)">` | | |
| `Teclado " onmouseover="alert(1)` | | |
| `Teclado & ratón` | | |

1. Rellena la tabla con lo observado.
2. La tercera fila es la que distingue escapar el contenido de escapar un atributo. Comprueba dónde acaba esa cadena en tu HTML.
3. Quita el escapado en una copia de la vista, repite las cuatro filas y anota la diferencia.
4. Devuelve el escapado a su sitio.
5. Escribe en dos líneas por qué validar el nombre al crearlo no sustituye a escaparlo al mostrarlo.

#### Paso 5 · Cuando la red falla · 15 min

1. Apaga el servidor con la página abierta y pulsa recargar la lista. Anota qué ve la persona.
2. Simula red lenta desde las herramientas del navegador y comprueba que el estado de carga se ve de verdad.
3. Envía el formulario pulsando el botón dos veces seguidas, deprisa. Cuenta los productos creados.
4. Envía un producto inválido y comprueba que los mensajes aparecen en sus campos y que el foco va al primero.
5. Rellena la tabla con los cuatro estados.

| Estado | Cómo lo has provocado | Qué se ve | Qué se anuncia |
| ------ | --------------------- | --------- | -------------- |
| Cargando | | | |
| Error | | | |
| Vacío | | | |
| Con datos | | | |

El estado vacío es el que suele quedar sin diseñar, y aparece el primer día que alguien filtra por algo que no existe.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. El primer reto elimina el trabajo duplicado entre servidor y cliente; el segundo cambia el orden entre lo que se ve y lo que se confirma.

##### Reto 1 · La primera carga, sin pedir dos veces

Tu página llega renderizada del servidor y, acto seguido, el cliente pide los mismos productos por la API. Se pintan dos veces los mismos datos.

1. Mide el coste: cuenta las peticiones y los bytes de la primera carga en la pestaña de red.
2. Haz que el servidor incluya los datos que ya ha usado dentro de la propia página, y que el cliente arranque su estado desde ahí en lugar de pedirlos.
3. Elige cómo viajan esos datos. Hay al menos dos formas, y una de ellas vuelve a abrir el problema del escapado con reglas distintas a las del contenido. Busca cuál y qué precaución exige.
4. Comprueba que la interfaz sigue funcionando: filtrar, crear y borrar deben seguir igual.
5. Provoca la incoherencia: modifica un producto desde otra pestaña y recarga. Decide qué gana, lo embebido o lo pedido, y qué ocurre si el estado inicial está caducado.
6. Desactiva JavaScript y comprueba que la página sigue completa.
7. Explica en tres líneas qué has ganado y qué has complicado. Los mismos datos descritos en dos sitios tienen un coste que conviene nombrar.

##### Reto 2 · Pintar antes de saber

Al borrar un producto, tu interfaz espera la respuesta del servidor antes de quitarlo de la lista. Con red lenta, esa espera resulta perceptible.

1. Invierte el orden: quita el producto de la lista en cuanto se pulsa, y envía la petición después.
2. Si el servidor responde con error, devuelve el producto a su sitio **en la misma posición** y explica el fallo.
3. Provoca el caso con el servidor apagado y comprueba que la lista queda como estaba.
4. Aplica lo mismo al alta. Aquí aparece un problema que el borrado no tiene: el identificador todavía no existe. Decide cómo representas un elemento que aún no está confirmado.
5. Decide qué operaciones **no** deberían pintarse de forma optimista, y por qué. Un cobro no se muestra como hecho antes de estarlo.
6. Anuncia la reversión en la región activa. Un cambio que se deshace sin aviso resulta más confuso que la espera que querías evitar.
7. Escribe en tres líneas qué compromiso has aceptado: la interfaz enseña durante unos instantes algo que todavía puede resultar falso.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Catálogo generado en el servidor y escapado, interfaz alimentada por tu API con los cuatro estados, y alta y borrado funcionando de punta a punta.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla del ataque rellenada sin ninguna ejecución, y la edición reutilizando el formulario del alta.</span></div>
  <div><strong>Reto</strong><span>La primera carga sin petición duplicada, o el borrado optimista con su reversión.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Generas HTML en el servidor con plantillas del lenguaje, y es válido.</li>
    <li>Escapas todo dato antes de insertarlo en la página.</li>
    <li>El cliente consume tu API con rutas relativas y una sola función.</li>
    <li>Los cuatro estados se ven de verdad, incluido el vacío.</li>
    <li>Los formularios crean, editan y borran datos reales.</li>
    <li>Los errores del servidor llegan al campo correcto y el foco va al primero.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué gana una página generada en el servidor frente a una pintada en el navegador?</li>
    <li>¿Qué hace la función de escapado y qué ocurre si falta?</li>
    <li>¿Por qué el cliente no tiene problemas de CORS con su propia API?</li>
    <li>¿Cuándo filtrarías en el cliente y cuándo en el servidor?</li>
    <li>¿Por qué el contrato de errores incluye el nombre del campo que falla?</li>
    <li>¿Qué evita deshabilitar el botón durante el envío?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que llega hecha y funciona sin JavaScript, y que los buscadores la leen.</p>
  <p>2 · Sustituye los caracteres con significado en HTML por sus entidades; sin ella, un dato puede ejecutarse como código en el navegador de cualquier visitante.</p>
  <p>3 · Porque el cliente y la API comparten origen.</p>
  <p>4 · En el cliente con pocos datos ya descargados; en el servidor con muchos, o cuando el filtro depende de permisos.</p>
  <p>5 · Para poder mostrar cada mensaje junto al campo que lo provoca.</p>
  <p>6 · El doble envío, que con POST crea dos productos.</p>
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

## Sesión 5 · Listo para publicar

<p class="lead">Tres horas. Media hora para ver qué separa un proyecto de clase de un servicio expuesto a internet, y dos horas y media configurando, protegiendo y probando el tuyo.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo se configura una aplicación para varios entornos, qué protecciones no pueden faltar y cómo se escribe una prueba automática con lo que trae Node.</li>
    <li><strong>2. Haz:</strong> Centraliza la configuración, aplica las protecciones y escribe la batería de pruebas de tu recurso.</li>
    <li><strong>3. Comprueba:</strong> La aplicación no arranca si falta algo imprescindible, resiste tus propios ataques y <code>npm test</code> se pone en rojo cuando rompes una regla.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué cambiaría entre tu portátil y un servidor real, y qué debe pasar si falta una variable obligatoria?</li>
    <li>¿Qué podría hacer alguien con acceso a tu API tal como está hoy, si envía un cuerpo de cien megabytes o llama mil veces por segundo?</li>
    <li>¿Cómo sabes hoy que un cambio no ha roto otra cosa?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · conceptos y demostración</p>

Tu aplicación funciona en tu portátil. Lo que falta para que funcione en otro sitio, delante de gente que no eres tú, se reduce a tres cosas: **saber de dónde salen sus valores**, **soportar a quien la use mal** y **poder cambiarla sin romperla en silencio**.

#### Toda la configuración, en un módulo

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

En la UD4 sufriste CORS como cliente. Hoy lo decides tú:

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
  <p class="rule-label">El comodín como renuncia a la configuración</p>
  <p>Poner <code>*</code> permite que cualquier página de internet llame a tu API desde el navegador de sus visitantes. Para una API pública de solo lectura puede resultar aceptable; para una que modifica datos, no.</p>
  <p>Conviene recordar qué es CORS y qué no: una protección del <strong>navegador</strong>. No impide que alguien llame a tu API con un cliente HTTP. La autorización de verdad es otra cosa, y viene a continuación.</p>
</div>

Tu cliente, servido desde el mismo origen, no necesita nada de esto. Lo configuras para quien venga de fuera.

#### La lista mínima de protecciones

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

Es un limitador elemental, porque vive en memoria y se pierde al reiniciar, pero muestra la idea y el 429 es el código que corresponde.

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
  <p>Una clave en una cabecera es la forma más simple de proteger las operaciones que modifican, y resulta suficiente para un proyecto de aula. Queda lejos de un sistema de usuarios: no distingue quién llama, no caduca y quien la tenga puede todo.</p>
  <p>Lo que sí enseña es dónde se pone la comprobación —en el servidor, antes del manejador— y la diferencia entre 401 y 403: la primera significa «no sé quién eres», la segunda «sé quién eres y no puedes».</p>
</div>

Una regla no admite excepción: si algún día almacenas contraseñas, se guardan cifradas con una función pensada para eso, nunca en claro ni con un resumen sin sal. En este módulo no se guarda ninguna.

#### Probar sin abrir el navegador

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

Sin instalar nada: el ejecutor y las aserciones se incluyen con Node. Tres detalles determinan su funcionamiento:

* El `listen(0)` pide un puerto libre cualquiera, así que las pruebas no chocan con tu servidor de desarrollo. Ahí se cobra haber separado la aplicación del arranque en la sesión 1.
* El `after` cierra el servidor. Sin él, el proceso se queda vivo cuando las pruebas ya han terminado y `npm test` no vuelve nunca.
* El fichero de entorno propio da a las pruebas su clave y su ruta de datos. La configuración de esta misma sesión corta el arranque si falta una variable obligatoria: sin ese fichero, importar la aplicación desde una prueba mata el proceso antes del primer `assert`.

<figure class="diagram">
  <figcaption>Lo que no puede faltar en la batería</figcaption>
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
  <p>Después de escribirla, rompe a propósito lo que comprueba y mira si se pone en rojo. Si sigue en verde, la prueba está mal escrita y da una seguridad falsa, peor que no tener prueba.</p>
  <p>Usa además datos propios de las pruebas, no los tuyos de desarrollo: una batería que depende de que exista el producto 7 falla el día que alguien lo borra.</p>
</div>

### Se trabaja

<p class="stage stage--guided">150 minutos · configurar, blindar y probar</p>

Los tres primeros pasos preparan el servicio. Los dos últimos comprueban que las protecciones y las pruebas hacen lo que prometen.

#### Paso 1 · Configurar · 35 min

1. Crea el módulo de configuración con sus valores por defecto y sus comprobaciones.
2. Haz que la aplicación se niegue a arrancar si falta una variable obligatoria, con un mensaje que diga cuál.
3. Sustituye todos los valores escritos en el código: puertos, rutas de datos, claves y orígenes.
4. Configura CORS con una lista de orígenes permitidos, tomada de la configuración.
5. Comprueba desde una página servida en otro origen que la política se aplica.
6. Actualiza `.env.example` y documenta en el README qué hace cada variable y cuál es obligatoria.

**Antes de continuar:** borra una variable obligatoria del entorno y arranca. Debe morir de inmediato con un mensaje claro, no arrancar y fallar después.

#### Paso 2 · Blindar · 40 min

1. Aplica el límite de tamaño del cuerpo y quita la cabecera que anuncia el framework.
2. Escribe el limitador de peticiones y devuelve 429 cuando se supera.
3. Protege con clave las rutas que modifican, y deja públicas las de lectura.
4. Comprueba que una llamada sin clave devuelve 401 con el formato de error del contrato, y no una respuesta suelta.
5. Repasa que toda entrada sigue validándose con lista blanca, incluida la de las rutas nuevas.
6. Ejecuta `npm audit` y resuelve o justifica lo que aparezca.

#### Paso 3 · La batería de pruebas · 45 min

1. Añade el script de pruebas al `package.json` y crea el fichero de entorno propio.
2. Usa un fichero de datos exclusivo de las pruebas, sembrado antes de cada ejecución.
3. Escribe al menos ocho pruebas: los caminos felices de las cinco operaciones, cada código de error del contrato y dos límites.
4. Comprueba en cada una las tres cosas: el código de estado, la forma del cuerpo y los campos concretos.
5. Añade una prueba de la regla de negocio de tu proyecto.
6. Añade una prueba que compruebe que ninguna respuesta incluye campos internos.
7. Deja `npm test` en verde.

#### Paso 4 · Ataca tu propio servicio · 20 min

Con el servidor arrancado, intenta romperlo desde un cliente HTTP. Rellena la tabla con lo que responde y lo que queda registrado.

| Ataque | Cómo lo envías | Qué responde | ¿Correcto? |
| ------ | -------------- | ------------ | ---------- |
| Cuerpo de varios megabytes | | | |
| Creación sin la clave de API | | | |
| Creación con una clave incorrecta | | | |
| Doscientas peticiones seguidas | | | |
| Petición de un fichero fuera de la carpeta pública | | | |
| JSON mal formado | | | |

1. Ninguna fila debe devolver 500, y ninguna debe dejar el servidor caído.
2. Comprueba con `curl -I` o desde la pestaña de red que la cabecera del framework ya no aparece.
3. Demuestra que CORS no protege nada frente a un cliente HTTP: repite desde el fichero `.http` una petición que un navegador de otro origen tendría bloqueada.
4. Escribe en dos líneas qué protege entonces esa petición, y cuál de las protecciones de la lista es la que realmente la detiene.

#### Paso 5 · Pruebas que se ponen en rojo · 10 min

Una batería en verde sobre un código roto es una batería inútil. Compruébalo.

1. Rompe a propósito, de una en una, estas cuatro cosas y anota qué prueba falla.

| Lo que rompes | ¿Falla alguna prueba? | ¿Cuál? |
| ------------- | --------------------- | ------ |
| Cambia el 201 de la creación por un 200 | | |
| Quita la validación del nombre obligatorio | | |
| Haz que la lista devuelva también un campo interno | | |
| Quita la comprobación de la clave en el borrado | | |

2. Cada fila sin prueba que falle señala un hueco. Escribe la prueba que falta.
3. Devuelve el código a su estado correcto y comprueba que todo vuelve al verde.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. El primer reto obliga a mirar el servicio como lo miraría quien quiere romperlo; el segundo convierte la batería en una red de seguridad de verdad.

##### Reto 1 · Lo que tu servicio sigue sin proteger

Las protecciones de hoy son el mínimo. Escribe el informe de lo que falta, dirigido a alguien que fuera a publicar tu API mañana.

1. Enumera al menos seis riesgos que tu servicio conserva. La clave única compartida, el limitador que se pierde al reiniciar y el fichero de datos sin copia son tres; busca los otros.
2. Para cada uno, escribe qué podría ocurrir en la práctica y con qué consecuencia. Un riesgo sin consecuencia descrita no se puede priorizar.
3. Ordénalos por dos criterios: probabilidad y daño. Anota qué atacarías primero y por qué.
4. Propón la mitigación de cada uno, con su coste aproximado en trabajo. Algunas se resuelven en una tarde; otras exigen un sistema de usuarios entero.
5. Busca el listado de los diez riesgos más frecuentes en aplicaciones web que publica OWASP, y comprueba cuáles de los tuyos aparecen. Añade los que se te hubieran escapado.
6. Decide cuáles **no** vas a mitigar, y déjalo escrito con su razón. Aceptar un riesgo de forma consciente es una decisión legítima; ignorarlo, no.
7. Cierra con un párrafo: si esta API se publicara hoy con datos reales, qué es lo primero que romperías tú.

##### Reto 2 · La batería como red de seguridad

Unas pruebas valen lo que valen los cambios que te atreves a hacer con ellas puestas.

1. Ejecuta las pruebas con la cobertura que trae Node (`--experimental-test-coverage`) y anota qué partes de tu código no toca ninguna.
2. Elige la que más te preocupe y escribe su prueba. No persigas el cien por cien: persigue las líneas donde vive una decisión.
3. Ahora el cambio: reescribe por dentro una parte de tu servicio —cómo filtra, o cómo normaliza— sin cambiar su comportamiento. Las pruebas deben seguir en verde sin tocarlas.
4. Si has tenido que modificar alguna prueba para que pase, estaba atada a la implementación y no al comportamiento. Reescríbela para que compruebe lo que se promete, no cómo se cumple.
5. Añade una prueba del servicio sin HTTP, usando el repositorio en memoria de la sesión 3. Compara cuánto tarda frente a la equivalente que pasa por el servidor.
6. Decide qué se prueba mejor en cada nivel y escríbelo en tres líneas: hay comprobaciones que solo tienen sentido pasando por HTTP y otras que no lo necesitan.
7. Mide el tiempo total de la batería. Una batería lenta deja de ejecutarse, y una que no se ejecuta no protege nada.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Configuración centralizada y comprobada al arrancar, las protecciones de la lista aplicadas, y ocho pruebas en verde que cubren éxitos y errores.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de ataques contestada sin ningún 500, y las cuatro roturas del paso 5 detectadas por alguna prueba.</span></div>
  <div><strong>Reto</strong><span>El informe de riesgos residuales con su priorización, o la batería sosteniendo una reescritura interna sin tocarse.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · comprobación y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>Ningún valor de configuración vive en el código.</li>
    <li>La aplicación no arranca si falta algo imprescindible.</li>
    <li>CORS está configurado con una lista, no con un comodín.</li>
    <li>Las operaciones que modifican exigen autorización.</li>
    <li>Hay límites de tamaño y de frecuencia, y ningún secreto en el repositorio.</li>
    <li><code>npm test</code> pasa y se pone en rojo cuando rompes una regla.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué debe hacer la aplicación si falta una variable de entorno obligatoria, y por qué?</li>
    <li>¿Qué protege CORS y qué no protege?</li>
    <li>¿Qué código devuelve un servicio a quien llama demasiadas veces?</li>
    <li>Diferencia entre 401 y 403.</li>
    <li>¿Qué hace <code>listen(0)</code> en una prueba, y por qué hace falta el <code>after</code>?</li>
    <li>¿Cómo compruebas que una prueba sirve de algo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · No arrancar, con un mensaje que diga cuál falta: si arranca, el fallo aparecerá lejos de su causa.</p>
  <p>2 · Protege al navegador de que una página ajena llame a tu API con las credenciales de quien la visita; no protege frente a un cliente HTTP.</p>
  <p>3 · Un 429.</p>
  <p>4 · 401 es no autenticado; 403, autenticado pero sin permiso.</p>
  <p>5 · Pide un puerto libre cualquiera; sin el <code>after</code>, el servidor queda abierto y el proceso no termina.</p>
  <p>6 · Rompiendo a propósito lo que comprueba y viendo si se pone en rojo.</p>
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

## Sesión 6 · Cierre del módulo

<p class="lead">Tres horas. Media hora para saber qué se evalúa y qué cambia al publicar, y dos horas y media cerrando el proyecto, desplegándolo, auditándolo y defendiéndolo.</p>

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Qué comprueba quien recibe un proyecto, qué documentación necesita un servicio y qué deja de funcionar igual cuando deja tu máquina.</li>
    <li><strong>2. Haz:</strong> Cierra la aplicación, publícala, audítala, revisa la de un compañero y defiende la tuya.</li>
    <li><strong>3. Comprueba:</strong> Funciona de punta a punta desde una instalación limpia, tiene una URL pública y puedes explicar cualquier decisión que contenga.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si clonas tu proyecto en una carpeta nueva, ¿arranca?</li>
    <li>¿Qué queda a medias, con un comentario que dice «arreglar esto»?</li>
    <li>¿Qué pasará con tu fichero de datos cuando el servicio se reinicie en un servidor ajeno?</li>
  </ol>
</div>

### Se explica

<p class="stage stage--brief">25 minutos · criterios y preparación</p>

Hoy no hay concepto nuevo. Lo que hay es el cambio de punto de vista que cierra el módulo: el proyecto deja de mirarse desde dentro, por quien lo escribió, y pasa a mirarse desde fuera, por quien lo recibe sin poder preguntar nada.

#### La prueba de la instalación limpia

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

Cada tropiezo en ese recorrido es un fallo que tu corrector encontrará también. La única forma de saberlo es recorrerlo de verdad, en otra carpeta y sin arreglar nada por el camino con lo que ya tienes instalado.

#### El README que sirve

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

Ese último punto distingue el README de un proyecto de clase del de uno profesional: decir qué no hace y por qué evita que quien lo lea lo tome por un fallo.

#### Publicar

```json
{
  "scripts": { "start": "node src/servidor.js" },
  "engines": { "node": ">=22" }
}
```

Casi todas las plataformas gratuitas hacen lo mismo: clonan tu repositorio, ejecutan la instalación y arrancan con `npm start`. Lo que hay que preparar es esto:

| Detalle | Qué hay que hacer |
| ------- | ----------------- |
| El puerto | Tomarlo de la variable de entorno que dé la plataforma |
| Las variables | Configurarlas en su panel, no en el repositorio |
| El entorno | Poner `NODE_ENV` en producción |
| Los datos | Saber que el disco puede borrarse en cada despliegue |
| El registro | Escribir a la salida estándar, que es lo que la plataforma recoge |

<div class="rule">
  <p class="rule-label">Un fichero en el disco de un servicio desplegado no es permanente</p>
  <p>Muchas plataformas reconstruyen el contenedor en cada despliegue, y algunas también al reiniciar por inactividad. Tus productos creados desaparecen, sin que haya ningún fallo en tu código.</p>
  <p>Ese es el motivo por el que existen las bases de datos gestionadas, y el problema con el que empieza el módulo de servidor. De momento, sepas explicarlo y siembra los datos al arrancar.</p>
</div>

#### Qué se evalúa

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

No puntúa el tamaño del proyecto. Puntúa que **el contrato se sostenga**: que cada ruta responda lo que promete, que ninguna entrada se acepte sin validar y que puedas defender por qué está hecho así.

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

Salen cuatro de esa lista, elegidas al azar, y cubren el módulo entero y no solo esta unidad. Las dos últimas valen tanto como las demás: saber qué te costó y qué harías distinto demuestra que has entendido lo que hiciste.

### Se trabaja

<p class="stage stage--guided">150 minutos · cerrar, publicar y defender</p>

El README se trae escrito de casa: el tiempo de clase es para desplegar, auditar y defender, que es donde aparecen los problemas que no se pueden prever.

#### Paso 1 · Cerrar el proyecto · 40 min

1. Clona tu repositorio en una carpeta vacía y recorre la instalación limpia entera, anotando cada tropiezo sin arreglarlo sobre la marcha.
2. Corrige después todos los tropiezos anotados, empezando por los que impiden arrancar.
3. Recorre la aplicación de punta a punta y marca la lista siguiente.

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

4. Cierra lo que siempre queda: rutas del contrato sin implementar, códigos de estado que no coinciden con lo documentado, mensajes de depuración olvidados, el README desactualizado y el `.env.example` sin las variables nuevas.
5. Comprueba que el repositorio no contiene secretos ni dependencias instaladas.

#### Paso 2 · Publicar · 35 min

1. Prepara el proyecto: puerto tomado del entorno, script `start` y `engines`.
2. Despliega en una plataforma gratuita.
3. Configura las variables en su panel, incluida la clave de API.
4. Comprueba la aplicación desde otro dispositivo, con otra red si puedes.
5. Añade una ruta de estado que informe de si el servicio responde, y consúltala desde fuera.
6. Anota qué se comporta distinto respecto a tu máquina. Habrá al menos tres diferencias, y una de ellas tendrá que ver con los datos.

**Antes de continuar:** crea un producto en el despliegue, fuerza un reinicio y comprueba si sigue ahí. Sepas explicar el resultado, sea cual sea.

#### Paso 3 · La auditoría · 30 min

Marca las tres listas sobre tu proyecto ya desplegado, no sobre el de tu máquina. Cada punto sin marcar se apunta con lo que falta para marcarlo.

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

#### Paso 4 · Revisión por pares · 25 min

Intercambia proyectos y trabaja sobre el ajeno sin preguntar nada a quien lo escribió. Todo lo que necesites debe estar en su README.

1. Clona, configura, siembra y arranca. Anota cada tropiezo con su hora.
2. Usa la aplicación entera solo con el teclado.
3. Ataca la API: datos inválidos, campos de más, rutas fuera de lo público, escritura sin clave.
4. Ejecuta sus pruebas, rompe algo a propósito y comprueba si lo detectan.
5. Encuentra dónde vive una regla de negocio y explícala en voz alta.
6. Devuelve por escrito tres cosas que funcionan bien, tres que fallan y una pregunta que el README no responde.

#### Paso 5 · La defensa y la entrega · 20 min

1. Prepara tres minutos: el recorrido de una petición, una decisión que defiendas y una que cambiarías.
2. Responde las cuatro preguntas que salgan de la lista, con el código delante.
3. Incorpora al proyecto lo que haya salido de la revisión del compañero y quepa en el tiempo.
4. Escribe el documento de una página con las tres decisiones técnicas de las que estés más satisfecho y las tres que cambiarías.
5. Comprueba la entrega completa contra la lista del cierre y envíala.

#### Ampliación si has completado el trabajo

Primero termina y comprueba los cinco pasos. Los dos retos son las dos continuaciones naturales del proyecto: crecer en recursos y resolver el problema de los datos que desaparecen.

##### Reto 1 · El segundo recurso, de contrato a pruebas

Una API con un solo recurso esconde casi todas las decisiones difíciles. Añade el segundo, relacionado con el primero: categorías, pedidos o valoraciones.

1. Escribe su contrato antes de escribir una línea: rutas, cuerpos, códigos y errores.
2. Decide cómo se expresa la relación en las rutas, y qué ocurre al pedir un recurso a través del otro.
3. Impleméntalo con sus tres capas, reutilizando el manejador de errores y la validación.
4. Decide qué pasa al borrar algo de lo que dependen otros elementos. Hay al menos tres políticas posibles: impedirlo, borrar en cascada o dejar la referencia huérfana. Elige, justifica y escríbelo en el contrato.
5. Provoca la situación del apartado anterior y comprueba que tu decisión se cumple.
6. Añade sus pruebas, incluida una de la relación.
7. Anota cuánto código nuevo has escrito y cuánto has reutilizado. Esa proporción mide lo que valían las decisiones de las sesiones 1 y 3.

##### Reto 2 · Datos que sobreviven al despliegue

Tu fichero desaparece en cada reconstrucción del servicio. Resuélvelo sin romper la frontera del repositorio.

1. Busca qué ofrece tu plataforma: disco persistente, base de datos gestionada o almacenamiento externo. Anota el coste y el límite de cada opción en su capa gratuita.
2. Elige una y escribe un repositorio nuevo contra ella, con la misma lista de funciones. Ninguna ruta ni ningún servicio debe cambiar.
3. Adapta el script de siembra para que funcione también contra el almacén nuevo.
4. Despliega y comprueba que un producto creado sobrevive a un reinicio y a un despliegue.
5. Decide cómo eliges el repositorio en cada entorno: memoria en las pruebas, fichero en tu máquina, el nuevo en producción. Un solo punto de decisión.
6. Ejecuta la batería de pruebas contra el almacén de producción en un entorno aparte, y anota qué pruebas dejan de valer cuando los datos no se reinician entre ejecuciones.
7. Escribe en tres líneas qué problema nuevo has adquirido. Un almacén externo puede tardar, puede caer y puede quedarse a medias, y esos tres casos ahora son tuyos.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>El recorrido completo funcionando desde una instalación limpia, la aplicación desplegada con su README y las tres auditorías marcadas.</span></div>
  <div><strong>Si lo tienes</strong><span>La revisión del compañero devuelta por escrito y sus hallazgos incorporados, y la defensa preparada.</span></div>
  <div><strong>Reto</strong><span>El segundo recurso completo con sus pruebas, o los datos sobreviviendo al despliegue.</span></div>
</div>

### Cierre

<p class="stage">5 minutos · entrega y recuerdo</p>

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión</p>
  <ul class="checklist">
    <li>El proyecto arranca desde una instalación limpia sin ayuda.</li>
    <li>Tiene una URL pública y las variables viven en la plataforma.</li>
    <li>El README basta para instalarlo y usar la API.</li>
    <li>Las tres listas de auditoría están marcadas.</li>
    <li>Has revisado un proyecto ajeno y recibido la revisión del tuyo.</li>
    <li>Puedes explicar cualquier decisión del proyecto con el código delante.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué hace quien recibe tu proyecto, paso a paso, antes de verlo funcionar?</li>
    <li>¿Qué apartados no pueden faltar en un README?</li>
    <li>¿Qué pasa con un fichero de datos en un servicio desplegado, y por qué?</li>
    <li>¿De dónde salen las variables de entorno en producción?</li>
    <li>Si hubiera que cambiar el almacén, ¿qué ficheros tocarías?</li>
    <li>¿Qué se puntúa en este proyecto, si no es su tamaño?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Clonar, configurar el entorno, instalar, sembrar, arrancar y usarlo en el navegador.</p>
  <p>2 · Qué es, cómo se instala, las variables, la tabla de rutas, el formato de error, cómo probar y qué decisiones se tomaron.</p>
  <p>3 · Que puede desaparecer en cada despliegue o reinicio, porque el contenedor se reconstruye.</p>
  <p>4 · Del panel de la plataforma, nunca del repositorio.</p>
  <p>5 · Solo el repositorio y el punto donde se elige cuál se usa.</p>
  <p>6 · Que el contrato se sostenga de punta a punta y que puedas defender cada decisión.</p>
</details>

<div class="unit-deliverable">
  <p>El repositorio con la aplicación completa: cliente y API servidos juntos, capas separadas, contrato documentado, configuración por entorno, seguridad mínima y pruebas en verde. La URL del despliegue. El README con sus siete apartados. Las tres listas de auditoría marcadas. La revisión del compañero por escrito. Finalmente, un documento de una página con las tres decisiones técnicas de las que estés más satisfecho y las tres que cambiarías.</p>
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

Una idea ha aparecido en las seis unidades bajo formulaciones distintas: **separa lo que cambia por razones distintas**. Estructura de presentación, lógica de interfaz, reglas de almacén, contrato de implementación. Cada vez que lo hiciste, la unidad siguiente te costó menos.

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

Lo que viene después ya no es lenguaje de marcas: es un backend con base de datos, seguridad, transacciones y despliegue serio, y un cliente construido con framework. Las preguntas, sin embargo, serán las mismas que vienes formulándote durante seis unidades.

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

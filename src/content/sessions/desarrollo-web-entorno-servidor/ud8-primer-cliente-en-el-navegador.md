---
title: "El cliente del proyecto: navegador y CORS"
label: "UD8 · Conectar"
section: "ud-08"
order: 8
lang: "es"
summary: "Retomar el cliente publicado en Intermodular, comprender CORS y verificar su integración antes de añadir seguridad."
duration: "6 horas · 1 semana · 2 sesiones de 3 h"
modality: "Taller de proyecto · 25 min de explicación, 140 min de trabajo y 15 min de cierre"
deliverable: "Repositorio de GitHub actualizado con el código, la documentación y las comprobaciones de las sesiones de esta unidad."
date: "2026-09-09"
outcomes:
  - "Consumir la API desde el navegador con fetch, sin ningún framework."
  - "Explicar qué es CORS, por qué lo aplica el navegador y por qué Postman no lo sufre."
  - "Configurar CORS en el backend de forma explícita y acotada."
  - "Diagnosticar un fallo de integración sabiendo si el problema es del cliente, del servidor o del navegador."
requirements:
  - "La API de la UD7 en marcha."
  - "Un editor de texto y un navegador con DevTools. No hace falta instalar ningún framework."
priorKnowledge:
  - "APIs REST, JSON y códigos de estado."
  - "HTML básico y nociones mínimas de JavaScript."
---

<p class="lead">El cliente del portfolio ya se ha conectado y publicado en Intermodular durante el primer trimestre. Estas dos sesiones revisan esa integración, diagnostican CORS y fijan una comprobación del navegador antes de incorporar autenticación.</p>

## Semana 17 · Revisar el cliente real y diagnosticar CORS

## Sesión 33 · Revisar el cliente real y diagnosticar CORS

### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Ya existe un cliente publicado desde Intermodular. Ahora se analiza la frontera navegador–API y por qué una petición funciona en un cliente HTTP pero falla en el navegador.

#### El navegador como entorno hostil y seguro

Durante todo el primer trimestre has probado tu API utilizando herramientas como Bruno o Postman. Esas herramientas son programas de escritorio independientes:
* Se ejecutan como procesos nativos en tu sistema operativo.
* No están atados a ninguna pestaña de navegación.
* No guardan cookies compartidas de usuarios ni sesiones de otros sitios web.
* Hacen exactamente lo que tú les ordenas, sin restricciones de origen.

El **navegador web**, en cambio, es un entorno completamente distinto:
* Ejecuta código JavaScript descargado de servidores de terceros en una caja de arena (*Sandbox*).
* Administra sesiones activas, cookies de autenticación, contraseñas y datos privados del usuario.
* Debe proteger al usuario para que un script malicioso descargado de una web desconocida no pueda usar sus credenciales para consultar datos privados en otro servidor en segundo plano.

<div class="rule">
  <p class="rule-label">La primera regla de integración</p>
  <p><strong>Una API que funciona en Postman no ha demostrado todavía que pueda usarse en la web.</strong></p>
  <p>Hasta que tu servidor no responda a una petición emitida por un motor de JavaScript real dentro de un navegador, la integración de la API no está verificada.</p>
</div>

#### La API Fetch nativa: asincronía y procesamiento en dos fases

En JavaScript moderno no se necesitan librerías externas (como Axios o jQuery) para hablar con una API REST. Los navegadores incluyen de forma nativa la función `fetch()`.

Consumir un endpoint en el navegador ocurre siempre en **dos fases asíncronas**:

<figure class="diagram">
  <figcaption>Las dos fases de una petición con fetch()</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. fetch(url) → Espera cabeceras de red</li>
    <li>2. response.ok / response.status</li>
    <li>3. response.json() → Espera descarga y parseo de bytes</li>
    <li>4. Renderizado en el DOM</li>
  </ol>
</figure>

```javascript
async function cargarProyectos() {
  try {
    // Fase 1: Enviamos la petición y esperamos las cabeceras HTTP del servidor
    const response = await fetch('http://localhost:8080/api/v1/proyectos');

    // Verificamos si el servidor respondió con un código 2xx
    if (!response.ok) {
      throw new Error(`Error del servidor: HTTP ${response.status}`);
    }

    // Fase 2: Descargamos el cuerpo completo de la respuesta y lo parseamos como JSON
    const data = await response.json();

    // Accedemos al array (si la API es paginada vendrá en data.content)
    const proyectos = data.content || data;
    renderizarProyectos(proyectos);

  } catch (error) {
    console.error('Fallo en la comunicación con la API:', error);
  }
}
```

<div class="rule">
  <p class="rule-label">fetch() no falla ante un 404</p>
  <p><code>fetch()</code> solo rechaza la promesa (entra en el bloque <code>catch</code>) si ocurre un fallo catastrófico de red (cable desconectado, DNS fallido o servidor completamente apagado). Si el servidor responde con un código de error como <code>404 Not Found</code> o <code>500 Internal Server Error</code>, la promesa se resuelve con éxito. Por eso es obligatorio comprobar siempre <code>if (!response.ok)</code>.</p>
</div>

#### La Política del Mismo Origen (Same-Origin Policy - SOP)

Para entender CORS, primero hay que entender qué es un **Origen**. Un origen está formado estrictamente por la combinación de tres elementos:

<figure class="diagram">
  <figcaption>La anatomía de un origen web</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Esquema / Protocolo (http://)</li>
    <li>Host / Dominio (localhost)</li>
    <li>Puerto (:8080)</li>
  </ol>
</figure>

Dos URLs pertenecen al **mismo origen** si y solo si sus tres componentes coinciden exactamente:

| URL A | URL B | ¿Mismo origen? | Razón |
| :--- | :--- | :--- | :--- |
| `http://localhost:8080/api/v1` | `http://localhost:8080/swagger-ui` | **SÍ** | Mismo esquema, mismo host y mismo puerto (`8080`). |
| `http://localhost:5500` | `http://localhost:8080` | **NO (Cross-Origin)** | **Diferente puerto** (`5500` vs `8080`). |
| `http://midominio.com` | `https://midominio.com` | **NO (Cross-Origin)** | **Diferente protocolo** (`http` vs `https`). |
| `http://app.empresa.com` | `http://api.empresa.com` | **NO (Cross-Origin)** | **Diferente subdominio** (`app` vs `api`). |

Por defecto, la **Política del Mismo Origen** prohíbe terminantemente que un script descargado de un origen (`http://localhost:5500`) lea los datos devueltos por otro origen (`http://localhost:8080`).

#### ¿Por qué Postman no sufre CORS?

Postman, Bruno y los comandos de consola `curl` son herramientas de prueba para desarrolladores:
* No tienen usuarios navegando por Internet.
* No guardan sesiones bancarias ni cookies privadas de terceros en segundo plano.
* No implementan la Política del Mismo Origen: envían la petición directamente al socket TCP del servidor y leen la respuesta sin restricciones.

El navegador, en cambio, defiende al usuario: si entras en `web-sospechosa.com`, el navegador impide que el JavaScript de esa página haga un `fetch('https://tu-banco.com/saldo')` aprovechando tus cookies activas.

#### Cómo funciona CORS: Peticiones con verificación previa (Preflight OPTIONS)

Para relajar esta restricción de forma segura cuando el frontend y el backend están en servidores separados, el navegador y el servidor dialogan mediante cabeceras HTTP:

1. Cuando el frontend envía una petición compleja (por ejemplo, un `POST` con `Content-Type: application/json` o un `PUT`/`DELETE`), el navegador no lanza el `POST` directamente.
2. Primero envía automáticamente una **petición de sondeo o verificación previa** (*Preflight Request*) con el método HTTP **`OPTIONS`**.
3. El navegador le pregunta al servidor: *«Oye, backend, tengo un script en `http://localhost:5500` que quiere enviarte un POST con JSON. ¿Me autorizas?»*.
4. El servidor responde con las cabeceras de autorización:
   * `Access-Control-Allow-Origin: http://localhost:5500`
   * `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
   * `Access-Control-Allow-Headers: Content-Type, Authorization`
5. Si el servidor aprueba el origen, el navegador ejecuta la petición real. Si el servidor no responde con la cabecera adecuada, el navegador **aborta la conexión y tiñe la consola de rojo**.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

Reproducid un fallo de origen sobre el cliente existente y seguid la petición y el preflight en la pestaña de red.

Ajustad los orígenes permitidos por entorno y comprobad carga, error y ausencia de datos.

Los ejemplos de código usan proyectos y tareas para mostrar el procedimiento. Aplica cada paso a las entidades y reglas del CRUD que elegiste: conserva tu repositorio, cambia los nombres de clases, rutas y campos de forma coherente y adapta las comprobaciones. No crees una segunda aplicación para copiar el ejemplo.

#### Paso 1 · Preparar el punto de partida

1. Abre el repositorio y comprueba qué versión tienes. Arranca la aplicación y ejecuta la colección o las pruebas de la sesión anterior antes de cambiar código; si ya falla, registra y resuelve ese fallo primero.
2. Localiza las clases, la configuración y las peticiones afectadas por la tarea de hoy. Anota el resultado esperado antes de editar.
3. Prepara un caso válido y otro que deba rechazarse o no encontrarse. Los usarás para comparar el comportamiento antes y después.

<p class="stage">Un navegador llama a tu API</p>

#### Paso 2 · El primer cliente web (index.html)

Vamos a construir un cliente web puro de 25 líneas sin frameworks ni herramientas de compilación complejas.

Crea una carpeta llamada `cliente` en tu espacio de trabajo y añade el archivo `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Gestor de Proyectos · Cliente Web</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
    ul { list-style: none; padding: 0; }
    li { background: #f4f4f5; margin-bottom: 0.5rem; padding: 0.75rem; border-radius: 6px; display: flex; justify-content: space-between; }
    .badge { background: #22c55e; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; }
    .badge--inactivo { background: #94a3b8; }
  </style>
</head>
<body>
  <h1>Proyectos en curso</h1>
  <button id="btn-cargar">Actualizar lista</button>
  <ul id="lista-proyectos"></ul>

  <script>
    const lista = document.getElementById('lista-proyectos');
    const btn = document.getElementById('btn-cargar');

    async function obtenerProyectos() {
      lista.innerHTML = '<li>Cargando proyectos...</li>';
      try {
        const res = await fetch('http://localhost:8080/api/v1/proyectos');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const proyectos = data.content || data;

        lista.innerHTML = '';
        proyectos.forEach(p => {
          const item = document.createElement('li');
          item.innerHTML = `
            <strong>${p.nombre}</strong>
            <span class="badge ${p.activo ? '' : 'badge--inactivo'}">${p.activo ? 'Activo' : 'Pausado'}</span>
          `;
          lista.appendChild(item);
        });
      } catch (err) {
        lista.innerHTML = `<li style="color: red;">Error al conectar con la API: ${err.message}</li>`;
      }
    }

    btn.addEventListener('click', obtenerProyectos);
    obtenerProyectos(); // Carga automática al abrir
  </script>
</body>
</html>
```

Para que el navegador se comporte como un cliente web real, **no abras el archivo haciendo doble clic** (`file:///C:/...`), ya que ese protocolo desactiva funcionalidades web estándar.

Arranca un servidor estático ligero en la carpeta `cliente`. Puedes usar cualquiera de estas opciones estándar:
* **Con VS Code:** Extensión *Live Server* (clic derecho en `index.html` → *Open with Live Server* en `http://localhost:5500`).
* **Con Python:** Ejecuta en la terminal de la carpeta `cliente`: `python -m http.server 5500`.
* **Con Node.js:** `npx serve . -l 5500`.

<dl class="worked">
  <dt>Por qué <code>data.content || data</code></dt>
  <dd>Porque desde la sesión 30 tu endpoint devuelve una página, no una lista: el array viene dentro de <code>content</code>, junto a los metadatos de paginación. Esa línea acepta las dos formas para que el cliente funcione hayas paginado ya o no. Es un apaño consciente de una página de prueba; en un cliente de verdad, el contrato se fija y no se adivina.</dd>
  <dt><code>if (!res.ok) throw</code>: la línea que casi todo el mundo olvida</dt>
  <dd><code>fetch()</code> solo rechaza la promesa ante un fallo de red. Un <code>404</code> o un <code>500</code> son respuestas perfectamente válidas para <code>fetch</code>, así que sin esa comprobación tu código seguiría adelante e intentaría recorrer un objeto de error como si fuera una lista de proyectos. El síntoma es una página en blanco sin ningún error en la consola.</dd>
  <dt><code>await</code> dos veces</dt>
  <dd>El primer <code>await</code> espera a que lleguen las cabeceras y el estado. El segundo, el de <code>res.json()</code>, espera a que llegue y se interprete el cuerpo. Son dos esperas porque son dos momentos distintos: el navegador ya sabe el código de estado antes de haber descargado la respuesta entera.</dd>
</dl>

#### Paso 3 · Inspección forense en DevTools

Con tu backend Spring Boot arrancado en el puerto 8080, abre `http://localhost:5500` en tu navegador y pulsa `F12`:

1. **Abre la pestaña Red (Network):**
   * Selecciona el filtro **Fetch/XHR** para ocultar imágenes o estilos y ver solo las peticiones de datos.
   * Haz clic en el botón *«Actualizar lista»*.
2. **Inspecciona la fila de la petición `proyectos`:**
   * **Status:** Debe marcar `200 OK`.
   * **Type:** Debe indicar `fetch`.
   * **Initiator:** Muestra el archivo y línea exacta de JavaScript que ejecutó la llamada (`index.html:24`).
3. **Analiza las cabeceras:**
   * Haz clic en la petición y entra en la pestaña **Headers**.
   * Revisa en *Response Headers* que el backend devolvió `Content-Type: application/json`.
4. **Analiza la pestaña Preview / Response:**
   * Comprueba que visualizas el árbol de objetos JSON exactamente como lo programaste en Spring Boot.

5. **Compara con tu cliente HTTP:** lanza la misma petición desde Bruno o Postman y pon las dos respuestas una al lado de otra. Son idénticas. Tu backend no se ha enterado de que quien llama es un navegador, y eso es exactamente lo que debe pasar: HTTP es HTTP venga de donde venga.

#### Paso 4 · Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| `blocked by CORS policy` en la consola | Es el fallo que esta sesión quiere provocar | No lo arregles todavía: es el tema entero de la sesión 33 |
| La barra del navegador dice `file:///C:/...` | Has abierto el HTML con doble clic | Tienes que servirlo: sin origen, ni CORS ni `fetch` se comportan como en la vida real |
| `Failed to fetch` y la terminal de Spring en silencio | El backend no está escuchando | ¿Arrancado? ¿En el 8080? Prueba la URL directamente en otra pestaña |
| La lista sale vacía sin ningún error | La respuesta no tiene la forma esperada | Pon `console.log(data)` justo después del `res.json()` y mira qué llega de verdad |
| `Cannot read properties of undefined` | Estás leyendo un campo que el DTO no publica | Compara los nombres con los del `ProyectoResponse` de la UD7, no con los de la entidad |
| Cambias el HTML y el navegador no se entera | Caché del navegador | `Ctrl+Shift+R`, o marca *Disable cache* en DevTools con las herramientas abiertas |

#### Paso 5 · Visualizar las tareas al seleccionar un proyecto

Amplía el cliente para consultar el subrecurso de tareas desarrollado en la UD7:

1. Modifica la generación de cada elemento de la lista para que incluya un botón *«Ver tareas»*.
2. Al pulsarlo, lanza una segunda llamada a `/api/v1/proyectos/{id}/tareas` y renderiza las tareas en una sublista bajo el proyecto.
3. Inspecciona en DevTools cómo se suceden ambas peticiones en cascada, y fíjate en el *Initiator* de la segunda: apunta a la línea de tu código que la disparó.
4. **Trata los tres estados de una petición**, que es lo que separa una página que funciona de una que parece rota: mientras carga, muestra un texto de espera; si responde bien pero la lista viene vacía, di «este proyecto no tiene tareas» en vez de dejar el hueco en blanco; si falla, muestra el código de estado.
5. Pide un proyecto que no exista (`/api/v1/proyectos/9999/tareas`) y comprueba que tu página muestra el `404` en lugar de quedarse pensando. Ese `404` es la regla que implementaste en la sesión 29: ahora la estás viendo desde el otro lado.
6. Anota en tu cuaderno cuántas peticiones lanza tu página al mostrar cinco proyectos con sus tareas. Si has puesto un botón por proyecto son seis, y bajo demanda. Si las cargaras todas de golpe serían seis siempre. Ese es el mismo N+1 de la UD5, ahora sobre la red.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>La página lista proyectos y sus tareas contra tu API real; los tres estados —cargando, vacío y error— se ven distintos en pantalla; y has comprobado que la respuesta es idéntica a la que te daba tu cliente HTTP.</dd>
</dl>

<p class="stage">CORS: por qué el navegador bloquea lo que Postman no</p>

#### Paso 6 · El gran desconcierto: «¡En Postman funciona!»

Cualquier desarrollador backend novel pasa por este momento de desesperación:
1. Crea un endpoint en Spring Boot.
2. Abre Postman o Bruno, envía la petición y recibe un maravilloso `200 OK`.
3. Abre su página web en el navegador, ejecuta un `fetch()`, y en la consola de JavaScript aparece un mensaje en rojo aterrador:

```text
Access to fetch at 'http://localhost:8080/api/v1/proyectos' from origin 'http://localhost:5500'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

El programador mira la consola de Spring Boot: **no hay ningún error, ninguna traza de excepción**. Vuelve a Postman: sigue funcionando. ¿Qué está pasando?

<div class="rule">
  <p class="rule-label">La realidad sobre CORS</p>
  <p><strong>CORS no es un error de Spring Boot ni un fallo de programación en JavaScript.</strong></p>
  <p>CORS (<em>Cross-Origin Resource Sharing</em>) es un mecanismo de seguridad implementado por el <strong>navegador web</strong> para proteger a los usuarios frente a peticiones no autorizadas entre sitios distintos.</p>
</div>

#### Paso 7 · Configurar CORS de forma acotada en Spring Boot

El peor error que puede cometer un desarrollador novato ante un fallo de CORS es buscar en Google y copiar la primera solución que encuentra: poner `@CrossOrigin(origins = "*")` en todos sus controladores. Eso equivale a quitar la cerradura de la puerta blindada.

La forma profesional de configurar CORS en Spring Boot es de forma **centralizada, explícita y restringida a los orígenes autorizados**.

En tu proyecto Spring Boot, crea una clase de configuración que implemente `WebMvcConfigurer`:

```java
package com.ejemplo.gestor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins:http://localhost:5500,http://127.0.0.1:5500}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .exposedHeaders("Location") // Permite al cliente leer la cabecera Location en los 201 Created
            .allowCredentials(true)
            .maxAge(3600); // El navegador cachea la respuesta preflight durante 1 hora (3600s)
    }
}
```

<dl class="worked">
  <dt>Qué es exactamente un «origen»</dt>
  <dd>La terna <strong>esquema + host + puerto</strong>. <code>http://localhost:5500</code> y <code>http://127.0.0.1:5500</code> son orígenes <strong>distintos</strong> aunque apunten a la misma máquina, y <code>http://localhost:5500</code> y <code>https://localhost:5500</code> también. Por eso la lista de arriba trae los dos: es el motivo número uno de que «a mí me funciona y a ti no».</dd>
  <dt>Por qué <code>addMapping("/api/**")</code> y no <code>"/**"</code></dt>
  <dd>Porque solo tu API necesita ser consumida desde otro origen. Abrir la aplicación entera incluiría rutas que no tienen por qué estar expuestas. La regla es la misma que en cualquier permiso: el ámbito más estrecho que haga el trabajo.</dd>
  <dt><code>exposedHeaders("Location")</code>, la línea que parece sobrar</dt>
  <dd>El navegador solo deja leer a JavaScript un puñado de cabeceras «seguras». Tu <code>Location</code> del <code>201 Created</code> llega en la respuesta —lo verás en DevTools— pero el cliente no la encuentra si no la declaras aquí. Es un fallo desconcertante porque la petición ha ido bien.</dd>
  <dt><code>maxAge(3600)</code></dt>
  <dd>Sin esto, el navegador lanza un <code>OPTIONS</code> extra <strong>antes de cada</strong> petición: duplicas el número de viajes. Con la caché de <em>preflight</em>, el navegador pregunta una vez por hora. Ojo al depurar: si cambias la configuración y parece que no surte efecto, es esta caché.</dd>
</dl>

Configuramos los orígenes permitidos en el archivo de propiedades para poder adaptarlos según el entorno (desarrollo, pruebas o producción):

```properties
# Orígenes web autorizados para interactuar con la API
app.cors.allowed-origins=http://localhost:5500,http://127.0.0.1:5500
```

<div class="rule">
  <p class="rule-label">Por qué esto no se escribe a fuego en el código</p>
  <p>El origen del cliente cambia con el entorno: <code>:5500</code> en tu portátil, <code>:4200</code> cuando llegue Angular en la UD12, y un dominio real el día del despliegue. Si la lista está dentro de una clase Java, cada entorno exige recompilar. En <code>application.properties</code> —y mejor aún, como variable de entorno— es configuración, que es lo que es.</p>
</div>

#### Paso 8 · Verificar el Preflight en DevTools

1. Reinicia tu aplicación Spring Boot.
2. Vuelve a tu navegador en `http://localhost:5500` y pulsa *Actualizar lista*.
3. Comprueba que el mensaje rojo de CORS ha desaparecido por completo y los proyectos se renderizan.
4. Abre la pestaña **Network** en DevTools y examina la petición:
   * En *Response Headers* verás la cabecera emitida por Spring Boot:
     `Access-Control-Allow-Origin: http://localhost:5500`
5. Abre la consola de JavaScript: 0 advertencias, 0 errores.

Un `GET` sencillo no dispara *preflight*: el navegador lo considera una «petición simple» y va directo. Para verlo hay que provocarlo.

1. En DevTools → Network, marca la casilla **Preserve log** y filtra por `Fetch/XHR`.
2. Desde tu página, lanza un `POST` con `Content-Type: application/json` (el botón de crear proyecto).
3. Ahora sí aparecen **dos** líneas para una sola operación:

   | # | Método | Ruta | Estado | Qué es |
   | :--- | :--- | :--- | :--- | :--- |
   | 1 | `OPTIONS` | `/api/v1/proyectos` | `200` | El navegador preguntando «¿me dejas?» |
   | 2 | `POST` | `/api/v1/proyectos` | `201` | La petición de verdad, ya autorizada |

4. Pincha la primera y busca en *Request Headers* la cabecera `Access-Control-Request-Method: POST`, y en *Response Headers* la respuesta de Spring: `Access-Control-Allow-Methods`.
5. **Lo importante:** ese `OPTIONS` lo envía el navegador solo. Tú no lo has programado y tu controlador no lo atiende. Y tu backend nunca ejecutó la lógica del `POST` hasta que el navegador dio el visto bueno.

<div class="rule">
  <p class="rule-label">Qué convierte una petición en «no simple»</p>
  <p>Basta con cualquiera de estas tres cosas: un método distinto de <code>GET</code>, <code>POST</code> o <code>HEAD</code>; un <code>Content-Type</code> que no sea de formulario o texto plano —<code>application/json</code> lo es—; o una cabecera propia como <code>Authorization</code>.</p>
  <p>Es decir: en cuanto tu API empiece a recibir JSON o tokens, <strong>toda</strong> escritura llevará su <em>preflight</em> por delante. Conviene verlo hoy, con una página de veinte líneas, y no en la UD9 con seguridad de por medio.</p>
</div>

#### Paso 9 · Si algo no sale como dice el guion

| Mensaje en la consola del navegador | Qué significa de verdad | Qué mirar |
| :--- | :--- | :--- |
| `No 'Access-Control-Allow-Origin' header is present` | Spring respondió, pero sin autorizar tu origen | Compara letra a letra el origen de tu página con el de `application.properties`, puerto incluido |
| `must not be the wildcard '*' when credentials mode is 'include'` | Comodín más credenciales | Enumera los orígenes, o quita `allowCredentials(true)` si no lo necesitas |
| El `OPTIONS` responde `403` | La ruta del *preflight* no está permitida | Con Spring Security aún sin instalar esto no debería pasar; si pasa, revisa el `addMapping` |
| Cambias la configuración y no surte efecto | La caché del *preflight* | `maxAge` es de una hora: recarga con `Ctrl+Shift+R` o desmarca la caché en DevTools |
| Funciona en tu cliente HTTP y falla en el navegador | Es CORS, por definición | Postman y Bruno no aplican la política de mismo origen: esa asimetría es el diagnóstico |
| `Failed to fetch` sin más detalle | El servidor no llegó a responder | Comprueba que la aplicación está arrancada y que el puerto es el correcto: esto no es CORS |

#### Paso 10 · Convertirte en el equipo de frontend

1. Añade `http://localhost:3000` a la lista de orígenes en `application.properties`.
2. Reinicia y comprueba que los tres orígenes (`5500`, `127.0.0.1:5500` y `3000`) son aceptados.
3. Añade temporalmente `http://localhost:9999` y observa cómo el navegador vuelve a bloquearlo. Copia el mensaje exacto en tu cuaderno: es el que te vas a encontrar en la UD12 con Angular.
4. **Lee la cabecera `Location`:** haz que tu página, tras crear un proyecto, muestre la URL del recurso recién creado leyendo esa cabecera de la respuesta. Comprueba que llega vacía, quita `exposedHeaders("Location")` de la configuración para confirmar que era eso, y vuelve a ponerlo. Es un fallo que se busca durante horas si no lo has visto antes.
5. **Diagnóstico a tres bandas:** por cada uno de estos tres fallos, di si el problema es del cliente, del servidor o del navegador, y cómo lo has sabido:
   * La página muestra la lista vacía y la consola no dice nada.
   * La consola dice `blocked by CORS policy` pero la pestaña Network muestra que el servidor respondió `200`.
   * El servidor responde `404` y la página se queda en blanco.
6. Escribe en tres líneas, con tus palabras, por qué CORS **no** protege tu API. Si la respuesta no menciona que cualquiera puede llamarla desde fuera de un navegador, vuelve a leer el primer apartado de la sesión: es la idea que hay que llevarse a la UD9.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Has visto el par <code>OPTIONS</code> + <code>POST</code> en DevTools con tus propios ojos; sabes provocar y reconocer un bloqueo de CORS; tu página lee la cabecera <code>Location</code>; y puedes explicar por qué la misma petición pasa desde tu cliente HTTP y no desde el navegador.</dd>
</dl>

#### Paso 11 · Comprobar y registrar el resultado de vuestro proyecto

1. Ejecuta el recorrido trabajado con datos de tu dominio. Conserva método, ruta, entrada y resultado esperado en la colección HTTP o en un test.
2. Ejecuta el caso de rechazo preparado al inicio. Comprueba tanto la respuesta como que el estado de los datos no se haya alterado indebidamente.
3. Compara el resultado con la tarea de esta sesión: **diagnosticad el navegador y cors sobre el cliente existente**. Explica qué clase o configuración produce el comportamiento observado.
4. Registra la versión y los defectos pendientes en el mismo repositorio. Usa el workflow aprendido en Intermodular y conserva el enlace al resultado del CI cuando esté disponible.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Indicador de latencia y simulación de redes lentas

En producción los usuarios no navegan en redes locales a 0 milisegundos de latencia.

Aprende a diagnosticar la experiencia de usuario ante redes degradadas:
1. En la pestaña **Network** de DevTools, localiza el selector de *Throttling* (por defecto en *No throttling*).
2. Cámbialo a **Slow 3G** (3G lenta) y pulsa *Actualizar lista*.
3. Observa en la columna *Waterfall* (cascada) cómo el tiempo de espera (TTFB - Time to First Byte) se dispara a varios segundos.
4. ¿Por qué una interfaz que no muestra un indicador de carga (*Loading spinner* o texto «Cargando...») hace que el usuario crea que la aplicación se ha colgado y pulse diez veces seguidas el botón?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Página <code>index.html</code> consumiendo <code>GET /api/v1/proyectos</code> con <code>fetch</code> nativo servida en servidor local.</span></div>
  <div><strong>Si lo tienes</strong><span>Consulta interactiva del subrecurso de tareas al pulsar sobre un proyecto con renderizado en el DOM.</span></div>
  <div><strong>Reto</strong><span>Auditoría de red con simulación Slow 3G en DevTools y gestión de estados de carga visuales implementada.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque la promesa de fetch() solo se rechaza ante fallos de red a nivel de transporte (imposibilidad de conectar con el host); un código 404 o 500 es una respuesta HTTP válida recibida del servidor.</p>
  <p>2 · El protocolo file:/// carece de origen HTTP válido (origin: null), lo que desactiva mecanismos estándar de seguridad, cookies y políticas de recursos en el navegador.</p>
  <p>3 · El desglose cronológico de la conexión: tiempo de resolución DNS, negociación TCP/TLS, tiempo de espera hasta el primer byte del servidor (TTFB) y tiempo de descarga del contenido.</p>
  <p>4 · Porque una respuesta paginada de Spring Data encapsula el array de elementos dentro de la propiedad content, acompañada de metadatos como page, size y totalElements.</p>
</details>

##### Reto · La incompatibilidad entre credenciales y comodines

Existe una regla de seguridad estricta en la especificación de CORS del W3C:
* Si una aplicación backend configura `allowCredentials(true)` (para admitir cookies o cabeceras de autorización `Authorization`), el navegador **rechaza terminantemente el uso del comodín `allowedOrigins("*")`**.

Investiga y responde con criterio técnico:
1. ¿Qué vulnerabilidad crítica sufrirían los usuarios si un navegador permitiera `Access-Control-Allow-Origin: *` combinado con el envío de cookies de sesión autenticadas (`withCredentials: true`)?
2. ¿Por qué Spring Boot lanza una excepción al arrancar si detectas que has configurado simultáneamente `allowedOrigins("*")` y `allowCredentials(true)`?

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Si en la evaluación se solicita una justificación de la configuración de CORS y políticas de orígenes, el formato de entrega de texto es siempre un <strong>documento en PDF</strong> (<code>informe-cors.pdf</code>), nunca un archivo markdown suelto.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Error de CORS reproducido en el navegador y comprendido como una restricción de cliente (SOP).</span></div>
  <div><strong>Si lo tienes</strong><span>Configuración centralizada con <code>WebMvcConfigurer</code> y orígenes externalizados en properties.</span></div>
  <div><strong>Reto</strong><span>Análisis de la incompatibilidad de seguridad entre comodines y credenciales (allowCredentials) justificado.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque la Política del Mismo Origen exige coincidencia estricta en los tres componentes del origen: esquema, host y puerto; al diferir el puerto, el navegador aísla los contextos de ejecución.</p>
  <p>2 · Utiliza el método OPTIONS, enviando las cabeceras Origin, Access-Control-Request-Method y Access-Control-Request-Headers.</p>
  <p>3 · Porque por defecto el navegador solo expone a JavaScript una lista blanca mínima de cabeceras seguras (safelisted headers); para leer cabeceras como Location en una respuesta cross-origin, el servidor debe exponerlas explícitamente.</p>
  <p>4 · Previene ataques CSRF y fugas de información, impidiendo que scripts maliciosos de pestañas externas lean datos confidenciales de servicios donde el usuario tiene una sesión activa.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

Podéis distinguir un fallo de red, de CORS y una respuesta de error de la API.

Cada integrante explica una decisión del código o reproduce una comprobación. Anotad los defectos pendientes y dejad identificado el commit con el que termináis.


#### Entrega de la sesión 33 · Repositorio de GitHub

**Entrega el enlace al mismo repositorio de GitHub del proyecto, actualizado con el trabajo de esta sesión, y el enlace al commit que permite identificar esa versión.** El repositorio acumula el trabajo de todo el módulo.

Antes de entregar:

1. Sube el código realizado y actualiza el README si ha cambiado la forma de arrancar, configurar o utilizar la aplicación. Incluye en el repositorio las pruebas, colecciones HTTP, scripts y demás archivos que hayas trabajado hoy, cuando correspondan.
2. Crea o actualiza `docs/sesiones/sesion-33.md` con cuatro apartados: **qué has realizado**, **qué archivos has cambiado**, **cómo lo has comprobado y qué resultado has obtenido**, y **qué queda pendiente**. Las tablas, respuestas y observaciones solicitadas en esta página se guardan ahí o se enlazan desde ese archivo a otros archivos del repositorio.
3. Guarda los cambios en un commit y súbelos a GitHub siguiendo el workflow establecido en Intermodular. Si trabajáis mediante pull request, conserva también su enlace. Un commit que solo está en tu ordenador no constituye la entrega.
4. Abre GitHub y comprueba que se ven el código, el documento de esta sesión y el commit entregado. Verifica que el profesor puede acceder al repositorio. Si algo no funciona todavía, descríbelo en pendientes y entrega igualmente la versión que has realizado.

| Dato de la entrega | Qué debes facilitar |
| --- | --- |
| Repositorio | Enlace a la página del proyecto en GitHub |
| Versión de esta sesión | Enlace al commit que contiene el trabajo entregado |
| Registro del trabajo | `docs/sesiones/sesion-33.md`, dentro de ese repositorio |

La comprobación o explicación en clase acompaña a esta entrega. El código y las evidencias de Servidor se evalúan en la versión indicada; el flujo de trabajo se evalúa en Intermodular.

## Sesión 34 · Integración del navegador antes de la seguridad

### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

El contrato HTTP y el comportamiento del navegador deben estar claros antes de incorporar credenciales. El cliente mínimo sirve como prueba de integración.

#### El método de diagnóstico en tres capas

Cuando un sistema compuesto por un cliente web y un servidor backend falla, el impulso del programador novato es cambiar líneas de código al azar: toca el controlador, luego el JavaScript, luego el HTML, y acaba creando cinco bugs nuevos sin resolver el original.

Un ingeniero de software profesional aplica el **árbol de diagnóstico de tres capas**:

<figure class="diagram">
  <figcaption>El árbol de diagnóstico forense de tres capas</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Capa 1: Cliente (Consola JS)</li>
    <li>Capa 2: Red (DevTools Network)</li>
    <li>Capa 3: Servidor (Logs Spring Boot)</li>
  </ol>
</figure>

1. **Capa 1 · El Cliente (Consola de JavaScript):**
   * ¿Hay errores de sintaxis en el script? ¿Falló una referencia a un elemento del DOM (`null is not an object`)?
   * *Diagnóstico:* Abrir la pestaña **Console**. Si hay texto rojo en JavaScript, el problema está en el cliente antes de emitir la petición.
2. **Capa 2 · La Red y el Navegador (DevTools Network):**
   * ¿Llegó a salir la petición HTTP? ¿Qué método, ruta y cuerpo exacto envió?
   * ¿Qué código HTTP respondió el servidor (`201`, `400`, `404`, `409`, `500`)?
   * *Diagnóstico:* Abrir la pestaña **Network**. Si la petición aparece en rojo o con error de CORS, el fallo está en la comunicación.
3. **Capa 3 · El Servidor (Consola de Spring Boot):**
   * Si la petición llegó pero devolvió `500`, ¿qué excepción se imprimió en la terminal del backend (`NullPointerException`, `DataIntegrityViolationException`)?
   * Si devolvió `400`, ¿qué regla de Bean Validation se activó?

#### La respuesta llega antes de que termine la interfaz

Una llamada con fetch es asíncrona. La interfaz puede estar esperando, mostrar datos, mostrar una lista vacía o informar de un error. Esos estados pertenecen a la aplicación cliente y deben corresponderse con el resultado de la API. Una lista vacía con estado 200 no significa lo mismo que una petición que nunca llegó al servidor.

fetch no rechaza su promesa solo porque la API devuelva 400 o 500. Primero hay que comprobar el estado o response.ok y después interpretar el cuerpo que corresponda. Si la API devuelve el detalle de validación, el cliente puede asociarlo al campo del formulario; sustituirlo siempre por un mensaje genérico elimina información útil.

Hoy se utiliza el portfolio que ya está publicado. Tras una escritura se vuelve a consultar el listado o se actualiza su estado de manera coherente. Para comprobarlo se provoca un error de validación, una URL incorrecta y un servidor apagado, y se observa qué aparece en la pestaña de red y en pantalla. Esa base permitirá distinguir los nuevos rechazos de autenticación cuando se incorpore la seguridad.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre vuestro proyecto</p>

Revisad las operaciones de lectura y escritura del portfolio sobre la versión avanzada de la API.

Comprobad mensajes de validación, actualización de la vista y configuración de la URL base sin añadir un framework nuevo.

Los ejemplos de código usan proyectos y tareas para mostrar el procedimiento. Aplica cada paso a las entidades y reglas del CRUD que elegiste: conserva tu repositorio, cambia los nombres de clases, rutas y campos de forma coherente y adapta las comprobaciones. No crees una segunda aplicación para copiar el ejemplo.

#### Paso 1 · Preparar el punto de partida

1. Abre el repositorio y comprueba qué versión tienes. Arranca la aplicación y ejecuta la colección o las pruebas de la sesión anterior antes de cambiar código; si ya falla, registra y resuelve ese fallo primero.
2. Localiza las clases, la configuración y las peticiones afectadas por la tarea de hoy. Anota el resultado esperado antes de editar.
3. Prepara un caso válido y otro que deba rechazarse o no encontrarse. Los usarás para comparar el comportamiento antes y después.

<p class="stage">Integración mínima verificada</p>

#### Paso 2 · Formulario de alta con validación visual

Vamos a completar nuestro cliente `index.html` integrando un formulario de creación de proyectos conectado a la API.

Añadimos un formulario con campos para el nombre y la descripción, y contenedores dedicados para mostrar mensajes de error:

```html
<section style="margin-top: 2rem; border-top: 1px solid #e4e4e7; padding-top: 1.5rem;">
  <h2>Crear nuevo proyecto</h2>
  <form id="form-proyecto">
    <div>
      <label for="nombre">Nombre del proyecto (*):</label><br>
      <input type="text" id="nombre" style="width: 100%; padding: 0.5rem; margin-top: 0.25rem;">
      <small id="error-nombre" style="color: #ef4444; display: none;"></small>
    </div>
    <div style="margin-top: 1rem;">
      <label for="descripcion">Descripción:</label><br>
      <textarea id="descripcion" rows="3" style="width: 100%; padding: 0.5rem; margin-top: 0.25rem;"></textarea>
      <small id="error-descripcion" style="color: #ef4444; display: none;"></small>
    </div>
    <div style="margin-top: 1rem;">
      <button type="submit" id="btn-guardar" style="background: #2563eb; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 4px; cursor: pointer;">
        Guardar proyecto
      </button>
    </div>
    <p id="mensaje-global" style="margin-top: 1rem; display: none;"></p>
  </form>
</section>
```

En el script de `index.html`, escuchamos el envío del formulario, evitamos la recarga tradicional de la página con `e.preventDefault()` y enviamos el JSON:

```javascript
const form = document.getElementById('form-proyecto');
const inputNombre = document.getElementById('nombre');
const inputDesc = document.getElementById('descripcion');
const errorNombre = document.getElementById('error-nombre');
const mensajeGlobal = document.getElementById('mensaje-global');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que el navegador recargue la página

  // Limpiamos mensajes de error previos
  errorNombre.style.display = 'none';
  mensajeGlobal.style.display = 'none';

  const nuevoProyecto = {
    nombre: inputNombre.value.trim(),
    descripcion: inputDesc.value.trim()
  };

  try {
    const res = await fetch('http://localhost:8080/api/v1/proyectos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoProyecto)
    });

    if (res.status === 201) {
      // Caso 1: Alta exitosa
      mensajeGlobal.textContent = '¡Proyecto creado con éxito!';
      mensajeGlobal.style.color = '#16a34a';
      mensajeGlobal.style.display = 'block';
      form.reset();
      obtenerProyectos(); // Actualizamos la lista automáticamente

    } else if (res.status === 400) {
      // Caso 2: Error de validación RFC 7807
      const errorData = await res.json();
      if (errorData.invalidParams && errorData.invalidParams.nombre) {
        errorNombre.textContent = errorData.invalidParams.nombre;
        errorNombre.style.display = 'block';
      } else {
        mensajeGlobal.textContent = errorData.detail || 'Datos de entrada inválidos';
        mensajeGlobal.style.color = '#ef4444';
        mensajeGlobal.style.display = 'block';
      }

    } else if (res.status === 409) {
      // Caso 3: Conflicto de unicidad
      const errorData = await res.json();
      mensajeGlobal.textContent = errorData.detail || 'Ya existe un proyecto con ese nombre';
      mensajeGlobal.style.color = '#f59e0b';
      mensajeGlobal.style.display = 'block';

    } else {
      throw new Error(`Error inesperado del servidor: HTTP ${res.status}`);
    }

  } catch (err) {
    mensajeGlobal.textContent = 'No se pudo contactar con el servidor. Revisa tu conexión.';
    mensajeGlobal.style.color = '#dc2626';
    mensajeGlobal.style.display = 'block';
  }
});
```

#### Paso 3 · El simulacro de los tres fallos provocados

Para dominar el diagnóstico de integración, vamos a **provocar intencionadamente tres errores típicos** y comprobar cómo reaccionan las tres capas:

| Prueba | Qué hacemos en el navegador | Qué debe mostrar DevTools (Red) | Qué debe mostrar la UI |
| :--- | :--- | :--- | :--- |
| **1 · El alta limpia** | Escribimos `"App Clientes"` y pulsamos guardar. | Petición `POST` con código `201 Created` y cabecera `Location`. | Mensaje verde de éxito y la lista se actualiza al instante con el nuevo proyecto. |
| **2 · La validación fallida** | Dejamos el nombre vacío y pulsamos guardar. | Petición `POST` con código `400 Bad Request` y JSON RFC 7807. | El texto rojo *"El nombre no puede estar en blanco"* aparece bajo el input. |
| **3 · El conflicto de duplicado** | Volvemos a escribir `"App Clientes"` idéntico. | Petición `POST` con código `409 Conflict`. | Mensaje ámbar *"Ya existe un proyecto con ese nombre"*. |
| **4 · El servidor apagado** | Detenemos Spring Boot y pulsamos guardar. | Petición `(failed)` en rojo con tipo `net::ERR_CONNECTION_REFUSED`. | Mensaje rojo *"No se pudo contactar con el servidor"*. |

#### Paso 4 · Si algo no sale como dice el guion

| Síntoma | Dónde está el problema | Qué mirar |
| :--- | :--- | :--- |
| `415 Unsupported Media Type` | Cliente | Falta la cabecera `Content-Type: application/json` en las opciones del `fetch` |
| `400` con `JSON parse error` | Cliente | Estás enviando el objeto tal cual en lugar de convertirlo a texto JSON |
| `400` con la lista de campos inválidos | Servidor, y funcionando bien | Es tu Bean Validation de la UD3 haciendo su trabajo: muestra el `detail` en pantalla |
| El `POST` responde `201` pero la lista no cambia | Cliente | Has creado el recurso pero no has vuelto a pintar la lista |
| `204` y el elemento sigue en pantalla | Cliente | El `204` no trae cuerpo: no intentes hacer `res.json()` con él, reventaría |
| El `OPTIONS` aparece y el `POST` no | Navegador | El *preflight* fue rechazado: revisa la configuración de la sesión 33 |

#### Paso 5 · Cerrar el ciclo completo desde el navegador

1. En cada proyecto de la lista, añade un botón *«Eliminar»* que pida confirmación antes de lanzar un `DELETE`.
2. Si la API responde `204 No Content`, quita el elemento de la pantalla. **No intentes leer el cuerpo**: un `204` no tiene, y hacerlo lanza un error de análisis que parece un fallo del servidor y no lo es.
3. Encadena el ciclo entero sin recargar la página: crear un proyecto, verlo aparecer en la lista, añadirle una tarea y borrarlo. Cuatro verbos HTTP, una sola pantalla.
4. Provoca a propósito estos tres errores y comprueba que **cada uno se ve distinto** en pantalla:
   * Nombre vacío al crear → `400`, con el mensaje de validación del servidor.
   * Borrar un proyecto que ya no existe → `404`.
   * Backend apagado → fallo de red, que no trae código de estado ninguno.
5. Escribe al lado de cada uno quién tiene la culpa: el usuario, tu cliente, tu servidor o la red. Esa clasificación es la competencia real de esta sesión, y es lo que evita las tardes perdidas discutiendo de quién es el fallo.
6. Guarda la carpeta `cliente` dentro del repositorio del proyecto, junto a un `README` de tres líneas que diga cómo servirla y contra qué puerto habla. En la UD9 vas a volver a esta página para añadirle el token.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Una sola pantalla ejecuta <code>GET</code>, <code>POST</code>, <code>DELETE</code> y el subrecurso de tareas sin recargarse; los tres tipos de error se distinguen a simple vista; y sabes decir, ante cualquiera de ellos, en qué capa está el problema y con qué evidencia lo has determinado.</dd>
</dl>

#### Paso 6 · Comprobar y registrar el resultado de vuestro proyecto

1. Ejecuta el recorrido trabajado con datos de tu dominio. Conserva método, ruta, entrada y resultado esperado en la colección HTTP o en un test.
2. Ejecuta el caso de rechazo preparado al inicio. Comprueba tanto la respuesta como que el estado de los datos no se haya alterado indebidamente.
3. Compara el resultado con la tarea de esta sesión: **comprobad el crud desde el navegador**. Explica qué clase o configuración produce el comportamiento observado.
4. Registra la versión y los defectos pendientes en el mismo repositorio. Usa el workflow aprendido en Intermodular y conserva el enlace al resultado del CI cuando esté disponible.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Diagnóstico forense de integración cliente-servidor

En equipos de trabajo reales, cuando una integración falla se pierde mucho tiempo discutiendo de quién es la culpa.

Analiza estas tres situaciones y determina con precisión técnica en qué capa se encuentra el problema:
1. **Situación A:** El usuario pulsa el botón, en la pestaña Red de DevTools aparece una petición `POST` con código `400 Bad Request`, y el cuerpo JSON contiene `{"detail": "JSON parse error: Unexpected character"}`. ¿Dónde está el error y qué archivo debe corregirse?
2. **Situación B:** El usuario pulsa el botón, en la pestaña Red la petición aparece con estado `(canceled)` y en la consola de JavaScript salta `TypeError: Failed to fetch`. La terminal de Spring Boot está en silencio absoluto. ¿Qué ha ocurrido?
3. **Situación C:** El usuario pulsa el botón, en la pestaña Red el `POST` devuelve `201 Created` y el cuerpo contiene el nuevo recurso con `id: 5`, pero la pantalla del navegador no muestra ningún cambio y el nuevo proyecto no aparece en la lista. ¿En qué línea del cliente está el fallo?

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Si en la evaluación se solicita una memoria o informe de integración técnica cliente-servidor, el formato oficial de entrega de texto es siempre un <strong>documento en PDF</strong> (<code>diagnostico-integracion.pdf</code>), nunca un archivo markdown suelto.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Formulario de alta conectado por <code>POST</code> con <code>JSON.stringify</code> y actualización de lista ante 201.</span></div>
  <div><strong>Si lo tienes</strong><span>Manejo granular de errores RFC 7807 (400 y 409) con mensajes visuales en la interfaz y borrado con DELETE.</span></div>
  <div><strong>Reto</strong><span>Tabla de diagnóstico forense de las 3 situaciones resuelta y argumentada a nivel de protocolos.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El navegador ejecuta el comportamiento HTML predeterminado: envía una petición POST síncrona tradicional y recarga la página por completo, interrumpiendo cualquier llamada asíncrona de JavaScript.</p>
  <p>2 · Porque por motivos de seguridad la API no debe exponer la traza de pila (stack trace) interna en el JSON de respuesta; la causa raíz exacta (línea de Java y excepción) solo está registrada en los logs del servidor.</p>
  <p>3 · Código HTTP 204 No Content.</p>
  <p>4 · JSON.stringify(objeto).</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

El CRUD completo funciona desde el navegador publicado y queda una comprobación repetible previa a autenticación.

Cada integrante explica una decisión del código o reproduce una comprobación. Anotad los defectos pendientes y dejad identificado el commit con el que termináis.


#### Entrega de la sesión 34 · Repositorio de GitHub

**Entrega el enlace al mismo repositorio de GitHub del proyecto, actualizado con el trabajo de esta sesión, y el enlace al commit que permite identificar esa versión.** El repositorio acumula el trabajo de todo el módulo.

Antes de entregar:

1. Sube el código realizado y actualiza el README si ha cambiado la forma de arrancar, configurar o utilizar la aplicación. Incluye en el repositorio las pruebas, colecciones HTTP, scripts y demás archivos que hayas trabajado hoy, cuando correspondan.
2. Crea o actualiza `docs/sesiones/sesion-34.md` con cuatro apartados: **qué has realizado**, **qué archivos has cambiado**, **cómo lo has comprobado y qué resultado has obtenido**, y **qué queda pendiente**. Las tablas, respuestas y observaciones solicitadas en esta página se guardan ahí o se enlazan desde ese archivo a otros archivos del repositorio.
3. Guarda los cambios en un commit y súbelos a GitHub siguiendo el workflow establecido en Intermodular. Si trabajáis mediante pull request, conserva también su enlace. Un commit que solo está en tu ordenador no constituye la entrega.
4. Abre GitHub y comprueba que se ven el código, el documento de esta sesión y el commit entregado. Verifica que el profesor puede acceder al repositorio. Si algo no funciona todavía, descríbelo en pendientes y entrega igualmente la versión que has realizado.

| Dato de la entrega | Qué debes facilitar |
| --- | --- |
| Repositorio | Enlace a la página del proyecto en GitHub |
| Versión de esta sesión | Enlace al commit que contiene el trabajo entregado |
| Registro del trabajo | `docs/sesiones/sesion-34.md`, dentro de ese repositorio |

La comprobación o explicación en clase acompaña a esta entrega. El código y las evidencias de Servidor se evalúan en la versión indicada; el flujo de trabajo se evalúa en Intermodular.

## Lo que debes recordar

### El método

En esta unidad has dado un paso fundamental en tu formación como desarrollador backend: conectar por primera vez tu servidor con un cliente real en el navegador web sin intermediarios ni frameworks opacos.

Para integrar cualquier cliente con tu API REST de forma robusta, aplica siempre este protocolo de conexión:

<figure class="diagram">
  <figcaption>El protocolo de integración cliente-servidor</figcaption>
  <ol class="flow">
    <li>Sirve el cliente web siempre desde un <strong>servidor HTTP local</strong>, jamás mediante el protocolo local <code>file:///</code>.</li>
    <li>Consume los endpoints con la API nativa <strong><code>fetch()</code> en dos fases asíncronas</strong> verificando siempre <code>response.ok</code>.</li>
    <li>Comprende que el navegador aplica la <strong>Política del Mismo Origen (SOP)</strong> para proteger la seguridad del usuario.</li>
    <li>Configura CORS en Spring Boot de forma <strong>centralizada con <code>WebMvcConfigurer</code></strong> acotando los orígenes autorizados.</li>
    <li>Permite el intercambio de métodos y cabeceras necesarios, exponiendo la cabecera <strong><code>Location</code></strong> para respuestas de creación.</li>
    <li>Evita el recargo de página en formularios interceptando el evento con <strong><code>event.preventDefault()</code></strong>.</li>
    <li>Serializa los cuerpos de petición con <strong><code>JSON.stringify()</code></strong> declarando siempre <code>Content-Type: application/json</code>.</li>
    <li>Aprovecha el estándar <strong>RFC 7807 (Problem Details)</strong> para pintar errores de validación campo a campo en la interfaz.</li>
    <li>Aplica el <strong>diagnóstico de tres capas</strong> (Consola JS, Red DevTools y Logs de Spring Boot) antes de modificar código ante un fallo.</li>
  </ol>
</figure>

### La idea más importante

> **Postman es un tester en un entorno estéril; el navegador es un entorno hostil gobernado por la Política del Mismo Origen. La verdadera prueba de fuego de una API REST no es que responda a tus peticiones manuales, sino que permita a una página web interactuar con ella sin brechas de seguridad ni fricciones de integración.**

Entender la diferencia entre cómo procesa el tráfico un proceso de escritorio y cómo lo filtra un navegador web separa a los programadores aficionados de los ingenieros de software. Cuando domines CORS y la inspección de red, los fallos de integración dejarán de ser misterios y se convertirán en diagnósticos exactos en menos de un minuto.

### Las decisiones que tienes que saber justificar

| Decisión de ingeniería | Lo que tienes que poder defender ante un tribunal |
| :--- | :--- |
| **Cliente nativo sin frameworks en UD8** | Aislar la integración web y CORS de la complejidad añadida de Angular, React o sistemas de empaquetado (Vite, Webpack), garantizando que el estudiante comprenda el protocolo HTTP puro. |
| **Servidor web local frente a `file:///`** | El protocolo `file:///` carece de origen HTTP válido (`origin: null`), desactiva cookies y provoca comportamientos anómalos en las políticas de seguridad del navegador. |
| **`fetch()` con comprobación de `response.ok`** | La función `fetch()` solo rechaza la promesa ante fallos de red físicos; si el servidor responde `400` o `500`, la promesa se resuelve y debe ser interceptada mediante `!response.ok`. |
| **Mismo origen definido por Tríada** | Dos recursos solo comparten origen si coinciden exactamente Esquema, Host y Puerto; un frontend en el puerto 5500 y un backend en el 8080 son estrictamente orígenes cruzados (*Cross-Origin*). |
| **Por qué Postman no sufre CORS** | CORS es una política de seguridad ejecutada por el navegador para proteger al usuario frente a scripts maliciosos; Postman no ejecuta scripts web no confiables ni comparte sesiones de navegación. |
| **Petición Preflight (`OPTIONS`)** | El navegador valida previamente si el servidor autoriza el método y las cabeceras complejas (como `application/json`) antes de arriesgarse a ejecutar la petición real que podría alterar datos. |
| **Orígenes acotados frente a comodín `*`** | En entornos reales con autenticación y credenciales (`allowCredentials = true`), el estándar prohíbe el comodín `*` para evitar que cualquier sitio web malicioso secuestre sesiones de usuario. |
| **`event.preventDefault()` en formularios** | Cancela el envío síncrono predeterminado de formularios HTML, permitiendo que JavaScript capture los datos, los serialice a JSON y gestione la respuesta de forma asíncrona. |
| **Traducción de RFC 7807 a la UI** | Exponer errores de validación con formato estándar permite al cliente recorrer el objeto `invalidParams` y resaltar con precisión milimétrica el campo erróneo en el formulario. |
| **Inspección en tres capas** | Frente a un fallo, examinar en orden Consola JS (cliente), Pestaña Network (transporte) y Terminal Spring Boot (servidor) localiza la causa raíz sin conjeturas ni cambios de código a ciegas. |

### Al terminar la unidad deberías poder responder

1. ¿Qué tres componentes definen un origen web según la Política del Mismo Origen (*Same-Origin Policy*)?
2. ¿Por qué una petición emitida desde `http://localhost:5500` hacia `http://localhost:8080` requiere habilitar CORS?
3. ¿Por qué una petición que falla por CORS en el navegador se ejecuta con éxito en Postman o Bruno?
4. ¿En qué fase de la petición actúa la llamada previa (*Preflight Request*) y qué método HTTP utiliza?
5. ¿Qué cabecera HTTP debe enviar Spring Boot para que el navegador autorice la lectura de la respuesta?
6. ¿Por qué está prohibido utilizar el comodín `Access-Control-Allow-Origin: *` si la API utiliza `allowCredentials(true)`?
7. ¿Para qué sirve la cabecera `Access-Control-Expose-Headers` al devolver una respuesta `201 Created`?
8. ¿Cómo se configura CORS de forma centralizada y profesional en Spring Boot utilizando `WebMvcConfigurer`?
9. ¿Por qué el código `fetch(url)` se ejecuta en dos fases con dos llamadas a `await` consecutivas?
10. ¿Qué ocurre si un endpoint devuelve un error `500 Internal Server Error` y el script de JavaScript no comprueba `res.ok`?
11. ¿Por qué nunca se debe abrir una página cliente haciendo doble clic en el archivo HTML (`file:///`) durante el desarrollo?
12. ¿Qué información técnica muestra el panel *Network* de DevTools al seleccionar una petición HTTP?
13. ¿Qué significa el indicador TTFB (*Time to First Byte*) en la cascada de tiempos de red del navegador?
14. ¿Por qué es obligatorio llamar a `event.preventDefault()` al capturar el evento `submit` de un formulario?
15. ¿Qué función de JavaScript se encarga de convertir un objeto en memoria a formato texto JSON para enviarlo en el `body` de una petición?
16. ¿Qué cabecera `Content-Type` debe incluir el cliente para que el backend Spring Boot entienda que el cuerpo es un JSON y no texto plano?
17. ¿Cómo estructura el estándar RFC 7807 los errores de validación para que el cliente pueda pintarlos bajo cada campo?
18. ¿Qué código HTTP semántico debe devolver la API tras un borrado exitoso con el método `DELETE`?
19. ¿Cuál es el orden estricto de las tres capas que deben inspeccionarse al diagnosticar un fallo entre cliente y servidor?
20. ¿Qué diferencia hay entre un error `net::ERR_CONNECTION_REFUSED` y un error de CORS en la consola del navegador?

### El vocabulario de la unidad

| Concepto | Significa |
| :--- | :--- |
| **Same-Origin Policy (SOP)** | Mecanismo de seguridad crítico de los navegadores que restringe cómo un documento o script de un origen puede interactuar con recursos de otro origen. |
| **Origen** | La combinación unívoca de Esquema (protocolo), Host (dominio) y Puerto (`http://localhost:8080`). |
| **CORS** | *Cross-Origin Resource Sharing*: estándar que permite a los servidores declarar mediante cabeceras HTTP qué orígenes externos tienen permiso para leer sus datos. |
| **Preflight Request** | Petición previa automática con método `OPTIONS` enviada por el navegador para comprobar los permisos de CORS antes de ejecutar la petición real. |
| **OPTIONS** | Método HTTP que consulta las opciones de comunicación y métodos permitidos por un servidor para un recurso determinado. |
| **Access-Control-Allow-Origin** | Cabecera HTTP emitida por el backend que especifica qué orígenes tienen autorización para acceder al recurso en el navegador. |
| **Access-Control-Expose-Headers** | Cabecera del servidor que autoriza al código JavaScript del navegador a leer cabeceras de respuesta que no están en la lista blanca por defecto. |
| **Sandbox del navegador** | Entorno de aislamiento estricto donde el navegador ejecuta scripts web para impedir el acceso indebido al sistema operativo o a datos de otros sitios. |
| **Fetch API** | Interfaz nativa de JavaScript basada en promesas para realizar peticiones HTTP asíncronas en navegadores modernos. |
| **response.ok** | Propiedad booleana del objeto `Response` de fetch que devuelve `true` si el código de estado HTTP se encuentra en el rango 200-299. |
| **JSON.stringify()** | Método de JavaScript que transforma un objeto o array en una cadena de texto en formato JSON válida para su transmisión por red. |
| **event.preventDefault()** | Método que detiene el comportamiento por defecto de un evento del navegador, como la recarga síncrona de página en formularios. |
| **DevTools Network** | Panel de herramientas del navegador para inspeccionar en tiempo real el tráfico HTTP, cabeceras, cargas útiles y tiempos de latencia. |
| **TTFB (Time to First Byte)** | Tiempo transcurrido desde que el cliente emite la petición HTTP hasta que recibe el primer byte de respuesta del servidor. |
| **Diagnóstico en 3 capas** | Protocolo de resolución de incidencias que examina secuencialmente la Consola JS (cliente), la Red DevTools (transporte) y los Logs de Spring (servidor). |

### Comprobación final del producto de la unidad

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría de integración web · criterios de producción</p>
  <ul class="checklist">
    <li>La página web (<code>index.html</code>) se sirve desde un servidor HTTP local y consume la API real sin depender de ningún framework.</li>
    <li>La configuración de CORS en Spring Boot está centralizada en una clase <code>WebConfig</code> que implementa <code>WebMvcConfigurer</code>.</li>
    <li>Los orígenes autorizados están explícitamente declarados y externalizados en <code>application.properties</code> sin comodines universales (<code>*</code>).</li>
    <li>La cabecera <code>Location</code> está expuesta mediante <code>exposedHeaders("Location")</code> para permitir su lectura en el cliente.</li>
    <li>Las peticiones Preflight (<code>OPTIONS</code>) son respondidas con éxito (código 200 o 204) por el backend.</li>
    <li>El cliente maneja el ciclo completo de lectura (<code>GET</code>), creación (<code>POST</code>) y borrado (<code>DELETE</code>) mediante <code>fetch()</code> asíncrono.</li>
    <li>Los formularios capturan el evento con <code>event.preventDefault()</code> y transmiten el cuerpo serializado con <code>JSON.stringify()</code>.</li>
    <li>Los errores de validación de Bean Validation (RFC 7807) se procesan en el cliente y se muestran junto a los campos correspondientes.</li>
    <li>La consola de JavaScript del navegador no arroja advertencias ni errores en rojo de CORS ni de promesas no capturadas.</li>
    <li>El estudiante es capaz de diagnosticar en menos de un minuto si un fallo reside en el script cliente, en la red o en el servidor Spring Boot.</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Resultados de la unidad</p>
  <ul class="checklist">
    <li>Consumir la API desde el navegador con fetch, sin ningún framework.</li>
    <li>Explicar qué es CORS, por qué lo aplica el navegador y por qué Postman no lo sufre.</li>
    <li>Configurar CORS en el backend de forma explícita y acotada.</li>
    <li>Diagnosticar un fallo de integración sabiendo si el problema es del cliente, del servidor o del navegador.</li>
  </ul>
</div>

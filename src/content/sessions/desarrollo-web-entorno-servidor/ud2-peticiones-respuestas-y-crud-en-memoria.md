---
title: "Peticiones, respuestas y CRUD en memoria"
label: "UD2 · Comunicar"
section: "ud-02"
order: 2
lang: "es"
summary: "Cómo transforma Spring una petición HTTP en datos Java y cómo construye la respuesta, hasta completar un CRUD en memoria con los códigos de estado correctos."
duration: "12 horas · 2 semanas · 6 sesiones"
modality: "Taller guiado · 70 % guía / 30 % autonomía"
deliverable: "Un CRUD completo en memoria con códigos de estado correctos y una colección ejecutable de Postman o Bruno."
date: "2026-09-02"
outcomes:
  - "Seguir una petición desde el cliente HTTP hasta el método del controller."
  - "Recibir JSON y transformarlo en objetos Java de forma controlada."
  - "Implementar las operaciones de escritura con el método HTTP que les corresponde."
  - "Controlar cuerpo, cabeceras y código de estado mediante ResponseEntity."
  - "Convertir pruebas manuales sueltas en una colección con variables y entornos."
requirements:
  - "El proyecto de la UD1 funcionando."
  - "Postman o Bruno instalado, ya utilizado en la UD1."
  - "Un navegador con DevTools para comparar clientes."
priorKnowledge:
  - "Peticiones y respuestas HTTP."
  - "Controllers, rutas, objetos, listas y JSON."
  - "Postman o Bruno a nivel básico: método, URL, cuerpo JSON y lectura de la respuesta."
---

<p class="lead">La aplicación sigue sin interfaz visual. Eso es intencionado: primero aprenderemos a observar su contrato HTTP directamente, sin que Angular o una página oculten qué se envía y qué se recibe.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje alto. Cada mecanismo se observa primero con una petición pequeña; la colección final debe poder ejecutar y documentar el flujo completo sin pasos improvisados.</p>
</div>

## Semana 3 · De HTTP a Java y de vuelta

## Sesión 7 · De HTTP a un método Java

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el recorrido completo desde que llega la petición hasta que se ejecuta tu método, pieza por pieza.</li>
    <li><strong>2. Haz:</strong> enciende el registro de Spring y sigue una petición real por dentro.</li>
    <li><strong>3. Comprueba:</strong> provocas a voluntad un 404, un 405, un 415 y un 406, y sabes qué fase falló en cada uno.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Escribe de memoria un controlador con una ruta <code>GET /tareas/{id}</code>.</li>
    <li>¿Qué hace <code>@ComponentScan</code> y qué pasa si tu controlador queda fuera?</li>
    <li>En la UD1 dijimos que «Spring busca qué método corresponde a esa ruta». ¿Cómo crees que lo busca?</li>
  </ol>
</div>

### La caja que dejamos cerrada

En la sesión 2 dibujamos el reparto de trabajo así:

<figure class="diagram">
  <figcaption>Lo que dijimos en la UD1</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Tomcat lee los bytes</li>
    <li><strong>Spring hace algo</strong></li>
    <li>Se ejecuta tu método</li>
  </ol>
</figure>

Ese «Spring hace algo» era una caja cerrada, y hasta ahora estaba bien que lo fuera: no se puede entender todo el primer día. Pero ya has escrito dos docenas de endpoints, ya has visto fallar cuatro cosas distintas, y **la mitad de los errores que te quedan por encontrar viven exactamente ahí dentro**.

Hoy la abrimos.

### El recorrido completo

Cuando llega una petición, no hay un `if` gigante buscando tu ruta. Hay una cadena de piezas, cada una con un trabajo, y **cada una puede rechazar la petición por un motivo distinto**.

<figure class="diagram">
  <figcaption>De los bytes a tu método, y de vuelta</figcaption>
  <ol class="flow flow--before">
    <li><strong>Tomcat</strong> acepta la conexión y convierte los bytes en un objeto petición</li>
    <li><strong>DispatcherServlet</strong> recibe absolutamente todas las peticiones y dirige el tráfico</li>
    <li><strong>Handler mapping</strong> busca qué método tuyo corresponde a esa ruta y ese método HTTP</li>
    <li><strong>Resolutores de argumentos</strong> construyen uno a uno los parámetros de tu método</li>
    <li><strong>Tu método</strong> se ejecuta y devuelve un valor</li>
    <li><strong>Conversor de mensaje</strong> convierte ese valor en el cuerpo de la respuesta</li>
    <li><strong>Tomcat</strong> escribe la respuesta en la red</li>
  </ol>
</figure>

<p class="term">DispatcherServlet</p>

La puerta única. Todas las peticiones de tu aplicación pasan por él, sea cual sea la ruta. Se llama *front controller*: en lugar de que cada ruta tenga su propio punto de entrada, hay uno solo que reparte. Por eso puedes añadir un endpoint nuevo sin registrarlo en ningún sitio.

Tú nunca escribes esta clase, nunca la instancias y nunca la llamas. La monta `@SpringBootApplication` al arrancar, y es la razón de que la línea de la consola dijera `with context path '/'`: le está diciendo desde qué prefijo escucha.

### Enciende la luz

Todo esto se puede **ver**, y verlo una vez vale más que leerlo tres.

<p class="stage">Paso 1 · Sube el nivel de registro</p>

En `src/main/resources/application.properties`:

```properties
logging.level.org.springframework.web=DEBUG
```

<p class="stage">Paso 2 · Reinicia y haz una petición conocida</p>

Desde Postman, un `GET http://localhost:8080/tareas/1`. Ahora mira la consola: donde antes no salía nada, aparecen varias líneas.

```text
DispatcherServlet        : GET "/tareas/1", parameters={}
RequestMappingHandlerMapping : Mapped to TareaController#detalle(int)
RequestResponseBodyMethodProcessor : Using 'application/json'
DispatcherServlet        : Completed 200 OK
```

<p class="stage">Paso 3 · Léelas de una en una</p>

<dl class="worked">
  <dt>Línea 1 · llegó esto</dt>
  <dd>El <em>DispatcherServlet</em> confirma qué método y qué ruta ha recibido, con sus parámetros. Si aquí no aparece nada, <strong>tu petición no llegó a la aplicación</strong>: te has equivocado de puerto, o el servidor no está arrancado.</dd>
  <dt>Línea 2 · va a este método</dt>
  <dd>La decisión más importante de todo el recorrido. Te dice, con nombre y apellidos, qué método tuyo va a ejecutarse. Cuando una petición «hace algo raro», esta línea te dice si está entrando por donde crees.</dd>
  <dt>Línea 3 · lo devuelvo así</dt>
  <dd>Con qué formato se va a escribir la respuesta.</dd>
  <dt>Línea 4 · terminó así</dt>
  <dd>El código de estado final.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Esta es la herramienta de diagnóstico de todo el curso</p>
  <p>De aquí en adelante, cuando una petición no haga lo que esperas, la primera pregunta ya no es «¿qué pasa?» sino <strong>«¿hasta dónde llegó?»</strong>. Si no aparece la línea 1, no llegó. Si aparece la 1 y no la 2, ninguna ruta encajó. Si aparece la 2 pero el resultado es raro, el problema está en tu método.</p>
  <p>Déjalo encendido mientras desarrollas y apágalo cuando te moleste. Es una línea en un archivo.</p>
</div>

### Qué puede ser un parámetro de tu método

El paso 4 del recorrido es el que más magia parece. Spring mira **uno a uno** los parámetros que has declarado y, según cómo estén anotados, sabe de dónde sacar el valor.

| Lo que declaras | De dónde sale | Visto en |
| :--- | :--- | :---: |
| `@PathVariable` | Un trozo de la ruta | UD1 · s3 |
| `@RequestParam` | La *query string* | UD1 · s3 |
| `@RequestBody` | El cuerpo de la petición | UD1 · s5 |
| `@RequestHeader` | Una cabecera | **Hoy** |
| `HttpServletRequest` | La petición cruda entera | Hoy |

No hay un orden obligatorio ni un número máximo. Puedes combinarlos todos en un mismo método.

#### `@RequestHeader` · leer una cabecera

En la sesión 1 viste que cada petición viaja con una lista de cabeceras. Aquí es donde se recogen:

```java
@GetMapping("/diagnostico")
public String diagnostico(
        @RequestHeader(name = "User-Agent") String cliente,
        @RequestHeader(name = "Accept") String acepta) {

    return "Me llama: " + cliente + "\nQuiere recibir: " + acepta;
}
```

Pruébalo **desde dos clientes distintos**: desde Postman y desde el navegador. La ruta es la misma, tu código es el mismo, y la respuesta es distinta, porque quien pregunta no es el mismo.

Es un buen momento para entender algo: **el servidor sabe bastante más de quien le llama de lo que parece**, y todo eso lo ha enviado el cliente voluntariamente en cada petición.

<details class="aside aside--extra">
  <summary>Cabeceras que no siempre vienen</summary>
  <p>Si pides una cabecera que no llega, obtienes un <code>400</code>, igual que con un <code>@RequestParam</code> obligatorio. Y se arregla igual:</p>
  <p><code>@RequestHeader(name = "X-Origen", required = false) String origen</code></p>
  <p>Las cabeceras que empiezan por <code>X-</code> son, por convención, las que se inventa cada aplicación para sus propias necesidades.</p>
</details>

### Las cuatro formas de no encajar

Aquí está la idea más útil de la sesión. Ya has visto cuatro errores distintos y los has tratado como cuatro casualidades. No lo son: **cada uno lo produce una fase distinta del recorrido**, y por eso cada uno se arregla en un sitio distinto.

<figure class="diagram">
  <figcaption>Dónde muere una petición que no encaja</figcaption>
  <ol class="flow flow--before">
    <li>¿Hay alguna ruta que coincida? Si no, <strong>404</strong></li>
    <li>¿Esa ruta acepta este método HTTP? Si no, <strong>405</strong></li>
    <li>¿Sabe leer el formato que envío? Si no, <strong>415</strong></li>
    <li>¿Puede devolver el formato que pido? Si no, <strong>406</strong></li>
  </ol>
</figure>

| Código | Nombre | Qué falló | Qué revisas |
| :---: | :--- | :--- | :--- |
| `404` | Not Found | Ninguna ruta coincide | La URL, y el paquete del controlador |
| `405` | Method Not Allowed | La ruta existe con otro método | El verbo de la petición |
| `415` | Unsupported Media Type | No sabe leer tu `Content-Type` | La cabecera de envío |
| `406` | Not Acceptable | No puede darte lo que pides en `Accept` | La cabecera de aceptación |

<div class="rule">
  <p class="rule-label">Los cuatro son 4xx, y eso ya te lo dice todo</p>
  <p>Empiezan por 4, así que ninguno es un fallo del servidor: en los cuatro casos <strong>tu método ni siquiera se ha ejecutado</strong>. La petición murió por el camino. Buscar el error dentro de tu método es tiempo perdido.</p>
</div>

#### `consumes` y `produces`

Puedes declarar en el propio mapeo qué formatos acepta y qué formatos devuelve un método:

```java
@PostMapping(consumes = "application/json", produces = "application/json")
public Tarea crear(@RequestBody Tarea tarea) {
    tareas.add(tarea);
    return tarea;
}
```

`consumes` es lo que provoca el `415` cuando el `Content-Type` no coincide. `produces` es lo que provoca el `406` cuando lo que pide el cliente en `Accept` no está entre lo que sabes dar.

Casi nunca hará falta escribirlos: Spring ya deduce lo razonable. Se escriben cuando un mismo recurso puede devolverse en varios formatos, o cuando quieres que el rechazo sea explícito y no una consecuencia.

### Práctica guiada · Provoca los cuatro

Con el registro encendido y la consola a la vista. Para cada caso, **predice el código antes de enviar** y después mira **hasta qué línea del registro llegó**.

| # | Qué envías | Predice |
| :---: | :--- | :---: |
| 1 | `GET /tareaas` · ruta inexistente | |
| 2 | `DELETE /tareas` · sobre la colección, no sobre un elemento | |
| 3 | `POST /tareas` con cuerpo y el desplegable de Postman en `Text` | |
| 4 | `GET /tareas` con la cabecera `Accept: application/xml` | |

Para el caso 4 tendrás que añadir la cabecera a mano en la pestaña `Headers` de Postman. Es la primera vez que escribes una cabecera tú.

Al terminar, rellena esta tabla, que es el objetivo real de la sesión:

| Caso | Código | ¿Apareció la línea `Mapped to`? | ¿Se ejecutó tu método? |
| :---: | :---: | :---: | :---: |
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

La columna del medio es la interesante. En dos de los cuatro casos **sí** se encontró tu método y aun así la petición fue rechazada después. Sabe decir en cuáles y por qué.

### Ahora tú · Traza una petición entera

Sobre tu proyecto:

1. Escribe un endpoint `GET /proyectos/{id}/incidencias` que reciba además un `@RequestParam` opcional `estado` y la cabecera `User-Agent`, y devuelva un texto con los tres valores.
2. Llámalo desde Postman con todo puesto.
3. Copia de la consola las cuatro líneas del registro y **anota junto a cada una** qué pieza del recorrido la ha escrito.
4. Vuelve a llamarlo quitando el parámetro `estado`. ¿Cambia alguna línea del registro? ¿Cuál?

### Reto · El endpoint que nunca se ejecuta

Un compañero tiene esto y jura que `/tareas/nueva` le devuelve 404:

```java
@RestController
@RequestMapping("/tareas")
public class TareaController {

    @GetMapping("/{id}")
    public String detalle(@PathVariable(name = "id") int id) {
        return "Tarea " + id;
    }

    @GetMapping("/nueva")
    public String nueva() {
        return "Formulario de tarea";
    }
}
```

1. Antes de tocar nada: ¿le devuelve realmente un `404`? Predice qué pasa y por qué.
2. Reprodúcelo en tu proyecto y mira la línea `Mapped to` del registro. ¿A qué método está entrando?
3. El código de estado que sale **no es el que tu compañero dice**. ¿Cuál es y qué significa?
4. Explica en dos frases por qué ocurre, usando la palabra «específica».
5. Propón dos soluciones distintas y di cuál preferirías en una API de verdad.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>El registro encendido, las cuatro líneas identificadas y los cuatro errores provocados.</span></div>
  <div><strong>Si lo tienes</strong><span>El endpoint con ruta, parámetro y cabecera funcionando, con su traza anotada.</span></div>
  <div><strong>Reto</strong><span>El diagnóstico completo del endpoint que no se ejecuta, con las dos soluciones comparadas.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 7</p>
  <ul class="checklist">
    <li>Tienes el registro de Spring encendido y sabes leer sus cuatro líneas.</li>
    <li>Sabes decir, ante un fallo, si la petición llegó, si encontró método y si se ejecutó.</li>
    <li>Lees una cabecera con <code>@RequestHeader</code> y sabes hacerla opcional.</li>
    <li>Distingues 404, 405, 415 y 406 y sabes qué fase produce cada uno.</li>
    <li>Puedes explicar qué es el <em>DispatcherServlet</em> y por qué no lo escribes tú.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Enumera las fases del recorrido de una petición, de Tomcat a tu método.</li>
    <li>No aparece la línea <code>Mapped to</code>. ¿Qué ha pasado?</li>
    <li>¿Qué diferencia hay entre un 415 y un 406?</li>
    <li>¿Por qué en los cuatro errores de hoy tu método no llega a ejecutarse?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Tomcat, DispatcherServlet, búsqueda del método, resolución de los argumentos, tu método, conversión del valor devuelto y escritura de la respuesta.</p>
  <p>2 · Ninguna ruta ha coincidido con esa petición: la URL no es la que crees, o el controlador no lo ve el escaneo de componentes. El resultado será un 404.</p>
  <p>3 · El 415 es sobre lo que <em>envías</em>: el servidor no sabe leer ese <code>Content-Type</code>. El 406 es sobre lo que <em>pides</em>: el servidor no sabe producir el formato de tu <code>Accept</code>.</p>
  <p>4 · Porque los cuatro se deciden en fases anteriores a la ejecución. Cuando tu método arranca, ya se ha comprobado que la ruta existe, que el método HTTP encaja y que los formatos son compatibles.</p>
</details>

## Sesión 8 · Cuerpo JSON y deserialización

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> qué hace Jackson exactamente con el cuerpo que llega, y los tres estados en que puede llegar.</li>
    <li><strong>2. Haz:</strong> monta un endpoint espejo y bombardéalo con nueve cuerpos distintos, válidos y rotos.</li>
    <li><strong>3. Comprueba:</strong> sabes predecir, ante cualquier JSON, si dará 400, si dará 200, y con qué valores.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué necesita Jackson un constructor sin argumentos?</li>
    <li>¿Qué código devuelve una petición con cuerpo JSON pero sin <code>Content-Type</code>?</li>
    <li>Envías <code>{"tituloo": "Algo"}</code> a un endpoint que espera <code>titulo</code>. ¿Qué crees que pasa?</li>
  </ol>
</div>

### La pregunta que quedó sin responder

En la UD1 enviaste un JSON con una errata y la API respondió `200` con el campo a `null`. Lo anotamos como una curiosidad inquietante y seguimos.

Hoy toca entenderlo, porque **es el origen de una clase entera de fallos**: los que no fallan. Un error que devuelve `500` te despierta a las tres de la mañana; un error que devuelve `200` guardando datos incompletos no te despierta nunca, y aparece tres meses después cuando alguien pregunta por qué faltan doscientos títulos.

### Quién convierte el cuerpo

<p class="term">Conversor de mensaje</p>

La pieza del recorrido de ayer que traduce entre el cuerpo HTTP —bytes y texto— y los objetos Java. Funciona en las dos direcciones: al entrar, con `@RequestBody`; al salir, con lo que devuelve tu método.

Para JSON, ese conversor usa **Jackson**, que ya conoces. Lo que no conoces todavía es cómo decide.

<figure class="diagram">
  <figcaption>Qué hace Jackson con cada clave del JSON</figcaption>
  <ol class="flow flow--before">
    <li>Crea el objeto vacío con el constructor sin argumentos</li>
    <li>Coge la primera clave del JSON, por ejemplo <code>titulo</code></li>
    <li>Busca un <em>setter</em> que le corresponda: <code>setTitulo</code></li>
    <li>Si lo encuentra, convierte el valor al tipo que pida ese <em>setter</em> y lo llama</li>
    <li>Si no lo encuentra, <strong>pasa a la siguiente clave sin decir nada</strong></li>
    <li>Repite hasta terminar el JSON</li>
  </ol>
</figure>

Los pasos 4 y 5 son los que hay que grabar. **Jackson recorre el JSON, no tu clase.** Lo que no esté en el JSON no se toca, y se queda con el valor por defecto de Java: `null` para objetos, `0` para números, `false` para booleanos.

### Los tres estados de un cuerpo

Un cuerpo que llega puede estar en tres situaciones muy distintas, y Spring las trata de forma radicalmente diferente:

| Estado | Ejemplo | Qué hace Spring | Código |
| :--- | :--- | :--- | :---: |
| **Válido** | `{"titulo":"Revisar"}` | Construye el objeto | `200` |
| **Inválido** | `{"titulo":"Revisar",}` | No puede leerlo, rechaza | `400` |
| **Incompleto** | `{}` | Lo construye igual, con valores por defecto | `200` |

<div class="rule">
  <p class="rule-label">La distinción que hay que interiorizar hoy</p>
  <p><strong>Inválido</strong> es un problema de <em>sintaxis</em>: no es JSON, o no encaja con los tipos. Lo detecta Jackson y produce un 400 automático.</p>
  <p><strong>Incompleto</strong> es un problema de <em>significado</em>: es JSON perfecto y le faltan datos que tu aplicación necesita. Jackson no tiene ninguna opinión al respecto, porque nadie le ha dicho qué es una tarea válida.</p>
  <p>El primero te lo resuelve el framework. El segundo <strong>es responsabilidad tuya</strong>, y hasta la UD3 no tendrás la herramienta para resolverlo bien.</p>
</div>

### El endpoint espejo

Para estudiar esto necesitamos ver qué objeto ha construido Jackson. Añade a tu controlador:

```java
@PostMapping("/espejo")
public Tarea espejo(@RequestBody Tarea tarea) {
    System.out.println("He recibido: " + tarea.getTitulo()
            + " / " + tarea.getPrioridad()
            + " / completada=" + tarea.isCompletada());
    return tarea;
}
```

Devuelve lo que ha construido y además lo imprime, para que veas el objeto Java y el JSON de vuelta a la vez. No guarda nada: es un banco de pruebas.

### Bombardea el espejo

Envía estos nueve cuerpos, uno a uno, a `POST /tareas/espejo`. **Predice antes de enviar** el código de estado y los valores del objeto.

| # | Cuerpo enviado | Predice el código |
| :---: | :--- | :---: |
| 1 | `{"titulo":"Revisar","prioridad":"alta","completada":true}` | |
| 2 | `{"titulo":"Revisar"}` | |
| 3 | `{}` | |
| 4 | `{"titulo":"Revisar",}` | |
| 5 | `{"tituloo":"Revisar"}` | |
| 6 | `{"titulo":"Revisar","color":"azul"}` | |
| 7 | `{"titulo":"Revisar","completada":"quizás"}` | |
| 8 | `{"titulo":"Revisar","completada":"true"}` | |
| 9 | *cuerpo vacío, sin nada* | |

Los resultados que sorprenden son estos cuatro, y conviene mirarlos despacio:

<dl class="worked">
  <dt>3 · el objeto vacío</dt>
  <dd><code>200</code>. Se crea una tarea con título <code>null</code>, prioridad <code>null</code> y <code>completada=false</code>. Tu API acaba de aceptar una tarea que no es nada.</dd>
  <dt>5 y 6 · claves que no existen</dt>
  <dd><code>200</code> las dos, y en silencio. Spring Boot configura Jackson para <strong>ignorar las claves desconocidas</strong>. Da igual que sea una errata tuya o un campo que el cliente se ha inventado: se descarta sin avisar.</dd>
  <dt>7 · un tipo que no convierte</dt>
  <dd><code>400</code>. <code>"quizás"</code> no es un booleano y Jackson no se lo inventa. Aquí sí protesta, porque es un problema de sintaxis.</dd>
  <dt>8 · un tipo que sí convierte</dt>
  <dd><code>200</code>, y <code>completada</code> vale <code>true</code>. El texto <code>"true"</code> entre comillas <strong>no</strong> es un booleano JSON, y aun así Jackson lo acepta y lo convierte. Es tolerante por defecto, y esa tolerancia es una decisión que se puede cambiar.</dd>
</dl>

### Lee el error de verdad

Cuando salga un `400`, el cuerpo de la respuesta es escueto y casi inútil. El mensaje bueno está, como siempre, en la consola:

```text
HttpMessageNotReadableException: JSON parse error:
Unexpected character ('}' (code 125)): was expecting double-quote to start field name
 at [Source: (line 1, column 26)]
```

Te dice **la excepción, el motivo y la posición exacta**. Acostúmbrate a leerla: en la UD3 vamos a convertir estos mensajes en respuestas útiles para el cliente, y no se puede transformar lo que no se sabe leer.

### La tolerancia es una decisión, y se puede cambiar

Que las claves desconocidas se ignoren no es una ley de la naturaleza: es un ajuste que Spring Boot elige por ti. Puedes darle la vuelta:

```properties
spring.jackson.deserialization.fail-on-unknown-properties=true
```

Reinicia y vuelve a enviar el cuerpo número 6, el del `color`. Ahora responde `400`.

<div class="compare-pair">
  <div>
    <p class="compare-label">Tolerante · lo que trae Spring</p>
    <p class="compare-body">Un cliente antiguo que envía un campo ya retirado sigue funcionando. A cambio, una errata pasa desapercibida y se guarda un dato incompleto.</p>
  </div>
  <div>
    <p class="compare-label">Estricto · <code>fail-on-unknown-properties</code></p>
    <p class="compare-body">Una errata se detecta al instante. A cambio, cualquier campo de más rompe la petición, y quien te consume tiene que ir exactamente a la par que tú.</p>
  </div>
</div>

<div class="rule">
  <p class="rule-label">Cuál elegir</p>
  <p>En una API pública, con clientes que no controlas, se deja <strong>tolerante</strong>: es preferible ignorar un campo de más a romperle la aplicación a alguien por un cambio tuyo.</p>
  <p>En una API interna, o durante el desarrollo, ser <strong>estricto</strong> ahorra horas de depuración.</p>
  <p>Para este curso, déjalo estricto mientras desarrollas la UD2 y la UD3 y decide tú al llegar al proyecto. Lo que no vale es no haberlo decidido.</p>
</div>

### Cuerpos que no son planos

Hasta ahora todos los JSON eran una lista de valores simples. Pueden ser bastante más:

#### Una lista dentro del objeto

Añade a `Tarea` un campo `List<String> etiquetas` con su *getter* y su *setter*, y envía:

```json
{
  "titulo": "Revisar el login",
  "etiquetas": ["urgente", "movil", "regresion"]
}
```

Jackson construye la lista sola. No hay que hacer nada.

#### Un objeto dentro del objeto

Crea una clase `Responsable` con `nombre` y `email`, añádela como campo de `Tarea`, y envía:

```json
{
  "titulo": "Revisar el login",
  "responsable": { "nombre": "Marc", "email": "marc@ejemplo.com" }
}
```

Jackson entra dentro y repite el mismo proceso con la clase interior. **Es recursivo**, y por eso funciona con estructuras de cualquier profundidad.

#### Una fecha

```java
private LocalDate vencimiento;
```

```json
{ "titulo": "Revisar el login", "vencimiento": "2026-09-15" }
```

Funciona con el formato ISO, que es año-mes-día con guiones. Prueba a enviar `"15/09/2026"` y observa el `400`: no es que la fecha sea imposible, es que no está en el formato que se espera.

<div class="rule">
  <p class="rule-label">Una fecha siempre se escribe igual</p>
  <p>En una API, las fechas se transmiten en formato ISO 8601 —<code>2026-09-15</code>— y no en el formato de ningún país. «15/09/2026» y «09/15/2026» son el mismo texto con dos significados distintos, y el servidor no tiene forma de saber cuál te refieres.</p>
  <p>Dar formato a la fecha para que se lea bonita es trabajo del cliente, no tuyo.</p>
</div>

### Ahora tú · El espejo de proyectos

Sobre tu proyecto:

1. Amplía la clase `Proyecto` con una lista de `String` y una fecha.
2. Crea un endpoint espejo para `Proyecto`.
3. Construye tu propia tabla de **seis** cuerpos: dos válidos, dos inválidos y dos incompletos. Envíalos y anota código y valores resultantes.
4. Activa `fail-on-unknown-properties` y repite los seis. Anota cuáles cambian de resultado y cuáles no.
5. Escribe en dos frases qué configuración dejarías puesta en tu proyecto y por qué.

### Reto · El campo que desaparece

Sin ejecutarlo todavía, predice qué devuelve este endpoint espejo al recibir el cuerpo de abajo. Escribe el JSON de respuesta **entero**, clave por clave:

```java
public class Incidencia {

    private int id;
    private String titulo;
    private String estado;
    private boolean urgente;

    public Incidencia() {
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getEstado() { return estado; }
    // sin setter de estado

    public void setUrgente(boolean urgente) { this.urgente = urgente; }
    // sin getter de urgente
}
```

```json
{
  "id": 7,
  "titulo": "Caída del servidor",
  "estado": "abierta",
  "urgente": true,
  "prioridad": 3
}
```

Preguntas:

1. ¿Qué código de estado devuelve?
2. ¿Qué valor tiene `estado` dentro del objeto Java? ¿Y en el JSON de respuesta?
3. ¿Qué valor tiene `urgente` dentro del objeto Java? ¿Y en el JSON de respuesta?
4. ¿Qué ha pasado con `prioridad`?
5. Hay un campo que **entra y no sale**, y otro que **no entra y podría salir**. Identifícalos y explica la regla que lo provoca.

Cuando lo tengas escrito, cópialo al proyecto y compruébalo.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>El endpoint espejo funcionando y los nueve cuerpos enviados con su resultado anotado.</span></div>
  <div><strong>Si lo tienes</strong><span>El espejo de proyectos con lista y fecha, y la comparación con y sin tolerancia.</span></div>
  <div><strong>Reto</strong><span>El JSON de respuesta de <code>Incidencia</code> predicho entero y la regla de los dos campos explicada.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 8</p>
  <ul class="checklist">
    <li>Sabes explicar el recorrido de Jackson clave por clave.</li>
    <li>Distingues un cuerpo inválido de uno incompleto y sabes quién resuelve cada uno.</li>
    <li>Sabes leer una <code>HttpMessageNotReadableException</code> en la consola.</li>
    <li>Has probado la aplicación con y sin tolerancia a claves desconocidas y has elegido una.</li>
    <li>Recibes listas, objetos anidados y fechas en el cuerpo.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Recorre Jackson las claves del JSON o los campos de tu clase? ¿Qué consecuencia tiene?</li>
    <li>¿Por qué <code>{}</code> devuelve 200 y <code>{,}</code> devuelve 400?</li>
    <li>¿En qué formato se envía una fecha y por qué no en el del país?</li>
    <li>Un campo tiene <em>setter</em> pero no <em>getter</em>. ¿Entra? ¿Sale?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Las claves del JSON. La consecuencia es que lo que no venga en el cuerpo no se toca y conserva el valor por defecto de Java, sin que nadie avise.</p>
  <p>2 · Porque el primero es JSON perfectamente válido que simplemente no trae datos, y el segundo no es JSON: falla al leerlo, antes de intentar construir nada.</p>
  <p>3 · En ISO 8601, <code>2026-09-15</code>. Porque los formatos nacionales son ambiguos entre sí y el servidor no puede adivinar cuál usa quien llama. Formatearla es trabajo del cliente.</p>
  <p>4 · Entra, porque para deserializar Jackson usa los <em>setters</em>. No sale, porque para serializar usa los <em>getters</em> y no hay ninguno.</p>
</details>

## Sesión 9 · Crear, modificar y eliminar recursos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> qué significa que un método sea seguro o idempotente, y por qué eso decide cuál usas.</li>
    <li><strong>2. Haz:</strong> separa <code>PUT</code> de <code>PATCH</code> de verdad e implementa los dos sobre el gestor.</li>
    <li><strong>3. Comprueba:</strong> repetir una operación dos veces da el resultado que debe dar, y sabes decir por qué.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué métodos HTTP envían cuerpo y cuáles no?</li>
    <li>En la UD1 dijimos que <code>PUT</code> sustituye. ¿Qué pasa con los campos que no envías?</li>
    <li>¿Por qué el identificador de un recurso lo asigna el servidor?</li>
  </ol>
</div>

### Lo que ya haces y todavía no sabes justificar

En la UD1 escribiste `POST`, `PUT` y `DELETE`. Funcionan. Pero si alguien te pregunta por qué modificar es `PUT` y no `POST`, la respuesta honesta hoy sería «porque lo pone en los apuntes».

Hoy pasamos de la mecánica al criterio. Y el criterio se apoya en dos propiedades que no son opinables: están definidas en la especificación de HTTP y **el resto de Internet cuenta con ellas**.

### Seguro e idempotente

<p class="term">Seguro</p>

Una operación es *segura* cuando **no modifica nada**. Solo consulta. `GET` es seguro.

<p class="term">Idempotente</p>

Una operación es *idempotente* cuando **hacerla una vez y hacerla diez veces dejan el servidor igual**. Ojo: no se trata de que devuelva lo mismo, sino de que el efecto acumulado sea el mismo.

| Método | ¿Seguro? | ¿Idempotente? | Efecto de repetirlo cinco veces |
| :--- | :---: | :---: | :--- |
| `GET` | Sí | Sí | Nada, cinco veces |
| `POST` | No | **No** | Cinco recursos nuevos |
| `PUT` | No | Sí | El recurso queda igual que tras la primera |
| `PATCH` | No | Depende | Normalmente igual, pero no está garantizado |
| `DELETE` | No | Sí | Se borra una vez; las otras cuatro no hay nada que borrar |

#### Por qué esto no es teoría

Imagina esta situación, que ocurre todos los días:

<figure class="diagram">
  <figcaption>El cliente que no sabe si su petición llegó</figcaption>
  <ol class="flow flow--before">
    <li>El cliente envía la petición</li>
    <li>El servidor la recibe y la procesa correctamente</li>
    <li>La respuesta se pierde por el camino: se corta la red, expira el tiempo de espera</li>
    <li class="is-error">El cliente no ha recibido nada. No sabe si se hizo o no</li>
    <li>El cliente reintenta</li>
  </ol>
</figure>

Ahí está todo el asunto. Si la operación era un `PUT`, reintentar **es seguro**: el recurso acaba en el mismo estado. Si era un `POST`, reintentar crea un segundo recurso, y acabas de duplicar una incidencia, un pedido o un cobro.

<div class="rule">
  <p class="rule-label">Por eso las reglas no son un capricho</p>
  <p>Los navegadores, los <em>proxies</em>, las pasarelas y las librerías cliente <strong>reintentan automáticamente</strong> las operaciones idempotentes cuando fallan, y no reintentan las que no lo son. Cuentan con que respetes la semántica.</p>
  <p>Si escribes un <code>GET</code> que crea cosas, o un <code>POST</code> donde debía ir un <code>PUT</code>, no estás rompiendo una convención de estilo: estás rompiendo suposiciones que otros programas ya están haciendo sobre tu API.</p>
</div>

### `PUT` no es «modificar»

Aquí está el error conceptual más extendido del tema. `PUT` no significa «actualiza esto». Significa:

> **Toma esta representación completa y deja el recurso exactamente así.**

Lo que no envías, no se conserva: **se pierde**, porque estás diciendo cómo debe quedar el recurso entero.

<p class="stage">Compruébalo tú mismo</p>

Con una tarea ya creada que tenga título, prioridad y estado:

```json
PUT /tareas/1
{
  "titulo": "Revisar el login otra vez"
}
```

Mira la tarea después con un `GET /tareas/1`. La prioridad ha desaparecido. Y ha desaparecido **correctamente**: has dicho que la tarea, entera, es solo eso.

Casi nadie quiere eso. Lo que casi todo el mundo quiere es cambiar un campo y dejar el resto en paz. Para eso existe el otro método.

### `PATCH` · cambiar solo lo que envías

<div class="compare-pair">
  <div>
    <p class="compare-label">PUT · sustituye</p>
    <p class="compare-body">«El recurso, completo, es esto.» Lo que falta en el cuerpo se pierde. Idempotente.</p>
  </div>
  <div>
    <p class="compare-label">PATCH · modifica</p>
    <p class="compare-body">«De este recurso, cambia estas cosas.» Lo que falta en el cuerpo se queda como estaba.</p>
  </div>
</div>

La implementación es el ejemplo resuelto de hoy:

```java
@PatchMapping("/{id}")
public Tarea modificar(
        @PathVariable(name = "id") int id,
        @RequestBody Tarea cambios) {

    for (Tarea tarea : tareas) {
        if (tarea.getId() == id) {
            if (cambios.getTitulo() != null) {
                tarea.setTitulo(cambios.getTitulo());
            }
            if (cambios.getPrioridad() != null) {
                tarea.setPrioridad(cambios.getPrioridad());
            }
            return tarea;
        }
    }
    return null;
}
```

<dl class="worked">
  <dt>Por qué cada campo lleva su <code>if</code></dt>
  <dd>Porque de la sesión anterior sabes que lo que no viene en el JSON llega como <code>null</code>. Ese <code>null</code> es la señal de «no me han mandado esto», y el <code>if</code> lo traduce a «no lo toques».</dd>
  <dt>Por qué no se toca el id</dt>
  <dd>Igual que en <code>PUT</code>: el recurso que se modifica lo dice la ruta. Si el cuerpo trae un id, se ignora.</dd>
  <dt>Por qué esto se vuelve pesado enseguida</dt>
  <dd>Con cuatro campos son cuatro <code>if</code>. Con quince son quince, y hay que acordarse de añadir uno cada vez que crece el modelo. Es un olor a que falta una herramienta, y la herramienta llega en la UD3.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Dos limitaciones de esta versión · anótalas</p>
  <p><strong>Uno.</strong> Con este código <strong>no se puede vaciar un campo a propósito</strong>. Si envías <code>{"prioridad": null}</code> pidiendo borrar la prioridad, tu <code>if</code> lo interpreta como «no me lo han mandado» y no hace nada. No hay forma de distinguir «ausente» de «enviado como nulo», y es la misma distinción que ya apareció con <code>defaultValue</code> en la UD1.</p>
  <p><strong>Dos.</strong> El campo <code>completada</code> es un <code>boolean</code> primitivo, que no puede valer <code>null</code>: siempre llega como <code>false</code>, y no hay manera de saber si te lo han enviado. Por eso no aparece en el código de arriba.</p>
  <p>Las dos se resuelven con una clase distinta para la entrada, con tipos que admitan nulo. Eso es un DTO, y es la UD3.</p>
</div>

### `DELETE` y la trampa de la segunda vez

```java
@DeleteMapping("/{id}")
public void eliminar(@PathVariable(name = "id") int id) {
    tareas.removeIf(tarea -> tarea.getId() == id);
}
```

Ejecútalo dos veces seguidas sobre la misma tarea. La primera borra; la segunda no encuentra nada y no hace nada. **Y eso está bien.**

Es la idempotencia en acción: el resultado que pedías —que esa tarea no exista— se cumple igual la primera vez que la quinta. Un `DELETE` repetido no debe explotar ni quejarse; el estado final es el que el cliente pidió.

<details class="aside aside--extra">
  <summary>Entonces, ¿la segunda vez debería devolver 404?</summary>
  <p>Es una discusión clásica y no hay una respuesta única. Los dos criterios son defendibles:</p>
  <p><strong>204 siempre:</strong> el cliente pidió que no existiera, y no existe. Objetivo cumplido, no hay nada que reportar.</p>
  <p><strong>404 la segunda vez:</strong> es información honesta, «eso que me pides borrar ya no está».</p>
  <p>Lo importante es que sea una decisión escrita y no un accidente. La tomarás en la sesión siguiente, cuando aprendas a fijar el código de estado.</p>
</details>

### Práctica guiada · La tabla de repeticiones

Esta es la comprobación que demuestra que has entendido la sesión. Sobre tu API, ejecuta cada operación **dos veces seguidas** y anota el estado del servidor después de cada una.

| Operación | Estado tras la 1.ª | Estado tras la 2.ª | ¿Idempotente? |
| :--- | :--- | :--- | :---: |
| `POST /tareas` con la misma tarea | | | |
| `PUT /tareas/1` con el mismo cuerpo | | | |
| `PATCH /tareas/1` con `{"prioridad":"baja"}` | | | |
| `DELETE /tareas/1` | | | |
| `GET /tareas/1` | | | |

Para «estado del servidor», usa un `GET /tareas` después de cada paso y anota cuántas tareas hay y cómo están.

Una de las filas debería incomodarte: **la del `POST`**. Después de dos ejecuciones tienes dos tareas idénticas con ids distintos, y tu API no tiene forma de saber que la segunda era un reintento. No lo arreglamos hoy, pero que conste que lo has visto.

### Ahora tú · Las escrituras de proyectos

Sobre el `ProyectoController`:

1. Implementa `PUT /proyectos/{id}` con semántica de sustitución completa.
2. Implementa `PATCH /proyectos/{id}` que solo cambie los campos enviados.
3. Implementa `DELETE /proyectos/{id}`.
4. Demuestra con dos peticiones consecutivas que `PUT` deja el recurso igual y que `POST` no.
5. Escribe un comentario en el código explicando qué campo de tu modelo **no puedes modificar** con `PATCH` y por qué.

### Reto · Elige el método y defiéndelo

Para cada situación, di qué método HTTP usarías, qué ruta, y **qué pasaría si el cliente la repitiera por un reintento**. No hay una única respuesta correcta en todas; hay respuestas defendibles y respuestas que no lo son.

1. Marcar una incidencia como resuelta.
2. Añadir un comentario a una incidencia.
3. Cambiar el correo de un usuario.
4. Archivar todas las incidencias cerradas de un proyecto.
5. Asignar una incidencia a una persona.
6. Sustituir por completo la lista de etiquetas de una incidencia.

Para las seis, escribe la respuesta en este formato:

| Situación | Método | Ruta | Si se repite… | ¿Es correcto que se repita? |
| :---: | :---: | :--- | :--- | :---: |

La número 4 es la difícil, y merece un párrafo aparte explicando tu decisión: no encaja limpiamente en ninguna de las categorías de hoy, y saber decir por qué vale más que acertar.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>PUT, PATCH y DELETE implementados en tareas, con la diferencia entre los dos primeros demostrada.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla de repeticiones completa y las tres operaciones sobre proyectos.</span></div>
  <div><strong>Reto</strong><span>Las seis situaciones resueltas con su método, su ruta y su análisis de reintento.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 9</p>
  <ul class="checklist">
    <li>Sabes definir «seguro» e «idempotente» y clasificar los cinco métodos.</li>
    <li>Has demostrado que un <code>PUT</code> incompleto pierde campos y que un <code>PATCH</code> no.</li>
    <li>Tu API implementa las cuatro operaciones de escritura con la semántica correcta.</li>
    <li>Puedes explicar por qué un <code>DELETE</code> repetido no debe fallar.</li>
    <li>Sabes qué dos cosas no puede hacer tu <code>PATCH</code> todavía y en qué unidad se resuelven.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué significa que una operación sea idempotente, y por qué le importa a un cliente?</li>
    <li>Envías un <code>PUT</code> sin el campo <code>prioridad</code>. ¿Qué le pasa a la prioridad?</li>
    <li>¿Por qué un <code>POST</code> repetido es un problema y un <code>PUT</code> repetido no?</li>
    <li>¿Por qué tu <code>PATCH</code> no puede vaciar un campo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que repetirla deja el servidor en el mismo estado que hacerla una sola vez. Le importa porque, cuando una respuesta se pierde, el cliente no sabe si la petición llegó, y solo puede reintentar sin riesgo si la operación es idempotente.</p>
  <p>2 · Se pierde. <code>PUT</code> declara cómo queda el recurso completo, así que lo que no aparece en el cuerpo deja de estar.</p>
  <p>3 · Porque el <code>POST</code> crea un recurso nuevo cada vez y acabas con duplicados, mientras que el <code>PUT</code> deja el mismo recurso en el mismo estado, se ejecute una vez o diez.</p>
  <p>4 · Porque un campo ausente y un campo enviado como <code>null</code> llegan los dos como <code>null</code>, y el código no puede distinguirlos. Hace falta una clase de entrada con tipos que sepan expresar esa diferencia.</p>
</details>

## Semana 4 · Un contrato que se puede repetir

## Sesión 10 · Construir respuestas HTTP

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> devolver un objeto no siempre expresa si se ha creado, encontrado, rechazado o eliminado un recurso.</li>
    <li><strong>Construye:</strong> respuestas distintas y verificables para varios resultados de una operación.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **controlar cuerpo, cabeceras y código de estado mediante ResponseEntity**.

### 2. El problema

Devolver un objeto no siempre expresa si se ha creado, encontrado, rechazado o eliminado un recurso.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido respuestas distintas y verificables para varios resultados de una operación.</li>
    <li>Puedes explicar qué parte resuelve el problema de partida.</li>
    <li>Has probado al menos un caso correcto y un caso límite o de error.</li>
    <li>El cambio queda integrado en la aplicación común del curso.</li>
  </ul>
</div>

### 8. Antes de irte

1. ¿Qué problema resolvía la decisión principal de hoy?
2. ¿Qué parte podrías modificar mañana sin volver a consultar el ejemplo?
3. ¿Qué prueba distingue una solución que parece funcionar de una que realmente funciona?

<div class="rule">
  <p class="rule-label">Estado del material</p>
  <p>La secuencia, el objetivo y la evidencia ya están definidos. La explicación, el código guiado, la actividad y el reto se completarán al desarrollar esta sesión.</p>
</div>

## Sesión 11 · Colecciones, variables y entornos

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> las peticiones sueltas que se escribieron a mano en la UD1 no dejan evidencia repetible ni permiten detectar una regresión.</li>
    <li><strong>Construye:</strong> una colección con entornos, casos correctos y casos de error.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **organizar peticiones, variables y comprobaciones en una colección reproducible**.

### 2. El problema

Las peticiones sueltas que se escribieron a mano en la UD1 no dejan evidencia repetible ni permiten detectar una regresión.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una colección con entornos, casos correctos y casos de error.</li>
    <li>Puedes explicar qué parte resuelve el problema de partida.</li>
    <li>Has probado al menos un caso correcto y un caso límite o de error.</li>
    <li>El cambio queda integrado en la aplicación común del curso.</li>
  </ul>
</div>

### 8. Antes de irte

1. ¿Qué problema resolvía la decisión principal de hoy?
2. ¿Qué parte podrías modificar mañana sin volver a consultar el ejemplo?
3. ¿Qué prueba distingue una solución que parece funcionar de una que realmente funciona?

<div class="rule">
  <p class="rule-label">Estado del material</p>
  <p>La secuencia, el objetivo y la evidencia ya están definidos. La explicación, el código guiado, la actividad y el reto se completarán al desarrollar esta sesión.</p>
</div>

## Sesión 12 · Backend en memoria verificable

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> las piezas aisladas solo son útiles si forman un flujo completo que otra persona puede ejecutar.</li>
    <li><strong>Construye:</strong> un backend CRUD en memoria acompañado de su colección de pruebas.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **integrar rutas, cuerpos JSON, operaciones de escritura y respuestas HTTP en un backend pequeño**.

### 2. El problema

Las piezas aisladas solo son útiles si forman un flujo completo que otra persona puede ejecutar.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un backend CRUD en memoria acompañado de su colección de pruebas.</li>
    <li>Puedes explicar qué parte resuelve el problema de partida.</li>
    <li>Has probado al menos un caso correcto y un caso límite o de error.</li>
    <li>El cambio queda integrado en la aplicación común del curso.</li>
  </ul>
</div>

### 8. Antes de irte

1. ¿Qué problema resolvía la decisión principal de hoy?
2. ¿Qué parte podrías modificar mañana sin volver a consultar el ejemplo?
3. ¿Qué prueba distingue una solución que parece funcionar de una que realmente funciona?

<div class="rule">
  <p class="rule-label">Estado del material</p>
  <p>La secuencia, el objetivo y la evidencia ya están definidos. La explicación, el código guiado, la actividad y el reto se completarán al desarrollar esta sesión.</p>
</div>

## Lo que debes recordar

Esta página cerrará la unidad con el mapa conceptual, las decisiones que deben poder justificarse, preguntas de recuperación y una comprobación final del producto.

<div class="checkpoint">
  <p class="checkpoint-label">Resultados de la unidad</p>
  <ul class="checklist">
    <li>Seguir una petición desde el cliente HTTP hasta el método del controller.</li>
    <li>Recibir JSON y transformarlo en objetos Java de forma controlada.</li>
    <li>Implementar las operaciones de escritura con el método HTTP que les corresponde.</li>
    <li>Controlar cuerpo, cabeceras y código de estado mediante ResponseEntity.</li>
    <li>Convertir pruebas manuales sueltas en una colección con variables y entornos.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

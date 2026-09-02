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

<p class="lead">La aplicación sigue sin interfaz visual. Eso es intencionado: primero aprenderemos a observar su contrato HTTP directamente, sin que ninguna interfaz oculte qué se envía y qué se recibe.</p>

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
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> a decidir tú el código de estado, las cabeceras y el cuerpo en lugar de aceptar el 200 automático.</li>
    <li><strong>2. Haz:</strong> repara con <code>ResponseEntity</code> los cuatro defectos que arrastras desde la UD1.</li>
    <li><strong>3. Comprueba:</strong> cada operación responde el código que le corresponde, y sabes justificar cada uno.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué responde hoy tu API a un <code>GET /tareas/999</code>, y qué debería responder?</li>
    <li>¿Qué significa cada familia de códigos: 2xx, 4xx, 5xx?</li>
    <li>¿Qué código debería devolver una creación correcta?</li>
  </ol>
</div>

### Llevas tres unidades mintiendo

Es fuerte dicho así, pero es literalmente lo que hace tu API ahora mismo:

| Lo que ocurre de verdad | Lo que tu API responde | Lo que le está diciendo al cliente |
| :--- | :---: | :--- |
| La tarea 999 no existe | `200` con cuerpo vacío | «Aquí tienes lo que pediste» |
| Se ha creado una tarea nueva | `200` | «Todo bien», sin decir que hay algo nuevo |
| Se ha borrado una tarea | `200` con cuerpo vacío | «Aquí tienes lo que pediste» |
| Han pedido modificar algo inexistente | `200` con cuerpo vacío | «Hecho» |

Ninguna es un fallo técnico: la aplicación no se rompe. Son **fallos de comunicación**, y son peores, porque el cliente construye su lógica encima. Una aplicación que recibe `200` da por hecho que la operación salió bien y sigue adelante.

El código de estado no es decoración. **Es la parte de la respuesta que se lee primero y sobre la que se decide.**

### `ResponseEntity` · la respuesta entera, en tus manos

Hasta ahora devolvías el objeto y Spring construía la respuesta a su criterio: `200`, cabeceras deducidas, cuerpo serializado.

Cuando devuelves un `ResponseEntity`, decides tú las tres cosas.

```java
@GetMapping("/{id}")
public ResponseEntity<Tarea> detalle(@PathVariable(name = "id") int id) {
    for (Tarea tarea : tareas) {
        if (tarea.getId() == id) {
            return ResponseEntity.ok(tarea);
        }
    }
    return ResponseEntity.notFound().build();
}
```

<dl class="worked">
  <dt>El tipo devuelto</dt>
  <dd><code>ResponseEntity&lt;Tarea&gt;</code> significa «una respuesta HTTP completa cuyo cuerpo, si lo hay, es una tarea». El objeto ya no es la respuesta: es una parte de ella.</dd>
  <dt><code>ResponseEntity.ok(tarea)</code></dt>
  <dd>Código 200 y la tarea como cuerpo. Es exactamente lo que hacía Spring solo, escrito a mano.</dd>
  <dt><code>ResponseEntity.notFound().build()</code></dt>
  <dd>Código 404 y sin cuerpo. <code>build()</code> cierra la construcción cuando no hay nada que poner dentro.</dd>
  <dt>Por qué <code>build()</code> y no <code>body(null)</code></dt>
  <dd>Porque expresa la intención: no es que el cuerpo esté vacío por accidente, es que esta respuesta no lleva cuerpo.</dd>
</dl>

#### Los constructores que vas a usar

| Escribes | Responde |
| :--- | :--- |
| `ResponseEntity.ok(objeto)` | `200` con cuerpo |
| `ResponseEntity.status(HttpStatus.CREATED).body(objeto)` | `201` con cuerpo |
| `ResponseEntity.created(uri).body(objeto)` | `201` con cuerpo **y cabecera `Location`** |
| `ResponseEntity.noContent().build()` | `204` sin cuerpo |
| `ResponseEntity.notFound().build()` | `404` sin cuerpo |
| `ResponseEntity.badRequest().body(algo)` | `400` con cuerpo |

Todos siguen el mismo patrón: **primero el estado, después las cabeceras si hacen falta, y al final `body(...)` o `build()`**.

### Reparación 1 · Un recurso que no existe

Ya está hecha: es el ejemplo de arriba. Aplícala también a `PUT` y a `PATCH`, que tienen el mismo problema.

```java
@PutMapping("/{id}")
public ResponseEntity<Tarea> reemplazar(
        @PathVariable(name = "id") int id,
        @RequestBody Tarea datos) {

    for (int i = 0; i < tareas.size(); i++) {
        if (tareas.get(i).getId() == id) {
            datos.setId(id);
            tareas.set(i, datos);
            return ResponseEntity.ok(datos);
        }
    }
    return ResponseEntity.notFound().build();
}
```

Comprueba en Postman que `PUT /tareas/999` ahora responde `404` y no `200`.

### Reparación 2 · Crear devuelve 201, y dice dónde

Una creación correcta responde `201 Created`. Y hay una segunda parte que casi todo el mundo se salta:

<p class="term">Cabecera Location</p>

En una respuesta `201`, dice **en qué URL vive el recurso que se acaba de crear**. Sin ella, el cliente tiene el objeto pero no sabe a dónde volver para consultarlo o modificarlo.

```java
@PostMapping
public ResponseEntity<Tarea> crear(@RequestBody Tarea tarea) {
    tarea.setId(siguienteId);
    siguienteId = siguienteId + 1;
    tareas.add(tarea);

    URI ubicacion = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(tarea.getId())
            .toUri();

    return ResponseEntity.created(ubicacion).body(tarea);
}
```

Necesitarás dos importaciones: `java.net.URI` y `org.springframework.web.servlet.support.ServletUriComponentsBuilder`.

Ese constructor toma la URL de la petición actual —`http://localhost:8080/tareas`— y le añade el id, quedando `http://localhost:8080/tareas/4`. Se construye así, y no concatenando texto a mano, porque el servidor no siempre está en `localhost:8080`: en producción tendrá otro dominio, y esto se adapta solo.

<p class="stage">Compruébalo en Postman</p>

Crea una tarea y mira la pestaña **Headers de la respuesta**. Ahí está `Location`. Copia esa URL, pégala en una petición nueva con `GET` y envíala: te devuelve la tarea que acabas de crear.

Eso es una API que se explica sola. El cliente no ha tenido que construir ninguna URL: se la has dado tú.

### Reparación 3 · Borrar devuelve 204

```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> eliminar(@PathVariable(name = "id") int id) {
    tareas.removeIf(tarea -> tarea.getId() == id);
    return ResponseEntity.noContent().build();
}
```

<p class="term">204 No Content</p>

«Ha ido bien y no tengo nada que devolverte.» No es un error ni una respuesta vacía por descuido: es la forma correcta de responder a una operación que no produce contenido.

Fíjate en `ResponseEntity<Void>`: el tipo declara que esta respuesta **nunca** lleva cuerpo. Es documentación que además comprueba el compilador.

<details class="aside aside--extra">
  <summary>Y la decisión que dejamos pendiente ayer</summary>
  <p>En la sesión 9 quedó abierto si un <code>DELETE</code> sobre algo que ya no existe debe dar <code>204</code> o <code>404</code>. Ahora ya puedes implementar las dos.</p>
  <p><code>removeIf</code> devuelve un <code>boolean</code>: <code>true</code> si borró algo. Con eso puedes elegir. <strong>Elige una, impleméntala y escribe en un comentario por qué.</strong> Lo que no vale es que salga una u otra sin haberlo decidido.</p>
</details>

### La alternativa ligera · `@ResponseStatus`

Cuando un método **siempre** responde el mismo código, no hace falta envolver nada:

```java
@PostMapping("/rapida")
@ResponseStatus(HttpStatus.CREATED)
public Tarea crearRapida(@RequestBody Tarea tarea) {
    tareas.add(tarea);
    return tarea;
}
```

<div class="compare-pair">
  <div>
    <p class="compare-label">@ResponseStatus</p>
    <p class="compare-body">Un solo código posible, siempre el mismo. Más corto y más legible. No permite cabeceras ni respuestas alternativas.</p>
  </div>
  <div>
    <p class="compare-label">ResponseEntity</p>
    <p class="compare-body">El método puede responder cosas distintas según lo que ocurra, y puede añadir cabeceras. Es lo que necesitas en cuanto hay un caso de «no encontrado».</p>
  </div>
</div>

Regla práctica: **si el método puede terminar de más de una manera, `ResponseEntity`**. Si no, `@ResponseStatus` y menos ruido.

### La tabla del contrato

Esta tabla es el objetivo de la sesión. Tu API debe cumplirla entera:

| Operación | Caso | Código | ¿Cuerpo? |
| :--- | :--- | :---: | :---: |
| `GET /tareas` | Siempre | `200` | El array, aunque esté vacío |
| `GET /tareas/{id}` | Existe | `200` | La tarea |
| `GET /tareas/{id}` | No existe | `404` | No |
| `POST /tareas` | Correcto | `201` | La tarea creada, con `Location` |
| `PUT /tareas/{id}` | Existe | `200` | La tarea sustituida |
| `PUT /tareas/{id}` | No existe | `404` | No |
| `PATCH /tareas/{id}` | Existe | `200` | La tarea modificada |
| `PATCH /tareas/{id}` | No existe | `404` | No |
| `DELETE /tareas/{id}` | Existe | `204` | No |
| `DELETE /tareas/{id}` | No existía | `204` o `404`, tu decisión | No |

Fíjate en la primera fila: **una colección vacía no es un 404**. La ruta `/tareas` existe y la respuesta correcta es un array vacío con `200`. El 404 es para un recurso concreto que no está, no para una búsqueda sin resultados.

### Ahora tú · El contrato de proyectos

1. Aplica la tabla completa al `ProyectoController`.
2. Añade la cabecera `Location` a su creación.
3. Comprueba las diez filas en Postman y anota el código real de cada una.
4. Provoca un caso que no esté en la tabla —por ejemplo, un `PUT` con un id en el cuerpo distinto al de la ruta— y decide qué debería responder. Impleméntalo y justifícalo en un comentario.

### Reto · Ocho situaciones y su código

Para cada una, escribe el código de estado que devolverías **y una frase justificándolo**. Algunas admiten más de una respuesta defendible; lo que se evalúa es el argumento.

1. Se piden todas las tareas y no hay ninguna.
2. Se piden las tareas de un proyecto que no existe.
3. Se crea una tarea correctamente.
4. Se crea una tarea sin título, y tu API todavía no valida.
5. Se pide `/tareas/abc`, con un id que no es un número.
6. Se borra una tarea que ya se había borrado hace un minuto.
7. Se hace un `PUT` sobre `/tareas/5` con `{"id": 9, "titulo": "Algo"}`.
8. Salta una excepción inesperada dentro de tu método.

Las dos difíciles son la 2 y la 7. En la 2, piensa qué es lo que no existe. En la 7, piensa quién manda, si la ruta o el cuerpo, y qué es peor: adivinar o rechazar.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las tres reparaciones aplicadas a tareas: 404, 201 con Location y 204.</span></div>
  <div><strong>Si lo tienes</strong><span>La tabla del contrato cumplida entera en tareas y en proyectos, comprobada en Postman.</span></div>
  <div><strong>Reto</strong><span>Las ocho situaciones con su código y su justificación, incluidas la 2 y la 7.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 10</p>
  <ul class="checklist">
    <li>Ningún endpoint responde ya <code>200</code> con el cuerpo vacío cuando algo no existe.</li>
    <li>La creación responde <code>201</code> e incluye la cabecera <code>Location</code>, comprobada pegándola en una petición nueva.</li>
    <li>El borrado responde <code>204</code> y su método devuelve <code>ResponseEntity&lt;Void&gt;</code>.</li>
    <li>Has decidido y justificado qué hace tu <code>DELETE</code> sobre algo inexistente.</li>
    <li>Sabes cuándo basta <code>@ResponseStatus</code> y cuándo hace falta <code>ResponseEntity</code>.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué una lista vacía no es un 404?</li>
    <li>¿Qué información aporta la cabecera <code>Location</code> y en qué respuesta viaja?</li>
    <li>¿Qué diferencia hay entre <code>204</code> y <code>200</code> con el cuerpo vacío?</li>
    <li>¿Cuándo usarías <code>@ResponseStatus</code> en lugar de <code>ResponseEntity</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque la ruta de la colección existe y la consulta se ha resuelto correctamente: el resultado es que no hay elementos. El 404 dice que no existe el recurso que se pedía, no que una búsqueda no haya encontrado nada.</p>
  <p>2 · La URL donde vive el recurso recién creado. Viaja en la respuesta <code>201</code> de una creación, y evita que el cliente tenga que construir esa URL por su cuenta.</p>
  <p>3 · El <code>204</code> declara que no hay contenido y que eso es lo correcto. Un <code>200</code> con el cuerpo vacío dice «aquí tienes lo que pediste» y no entrega nada, que es justo lo que confunde a quien llama.</p>
  <p>4 · Cuando el método solo puede terminar de una manera y siempre devuelve el mismo código. En cuanto haya un caso alternativo, como «no encontrado», hace falta <code>ResponseEntity</code>.</p>
</details>

## Sesión 11 · Colecciones, variables y entornos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué una petición suelta no demuestra nada y una colección ordenada sí.</li>
    <li><strong>2. Haz:</strong> monta la colección del gestor con variables, encadenado de peticiones y comprobaciones automáticas.</li>
    <li><strong>3. Comprueba:</strong> rompes el código a propósito y la colección lo detecta sola.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántas peticiones distintas has escrito a mano desde la UD1? ¿Dónde están ahora?</li>
    <li>Cambias el puerto de la aplicación al 8081. ¿Cuántas peticiones tendrías que reescribir?</li>
    <li>Modificas el método de creación. ¿Cómo compruebas hoy que no has roto nada más?</li>
  </ol>
</div>

### El problema que ya tienes y todavía no te ha estallado

Llevas tres semanas escribiendo peticiones a mano. Cada sesión reescribes las mismas URLs, vuelves a pegar los mismos cuerpos JSON y vuelves a mirar los mismos códigos.

Eso tiene tres consecuencias, y ninguna es cómoda:

<figure class="diagram">
  <figcaption>Lo que cuesta trabajar con peticiones sueltas</figcaption>
  <ol class="flow flow--before">
    <li>Repites trabajo cada día, y con las prisas escribes mal el cuerpo y depuras un fallo que no existe</li>
    <li>Cuando cambias algo, compruebas solo lo que has tocado</li>
    <li class="is-error">Lo que se rompe es lo que <em>no</em> has tocado, y nadie lo mira</li>
  </ol>
</figure>

<p class="term">Regresión</p>

Algo que funcionaba y ha dejado de funcionar por culpa de un cambio en otro sitio. Es el tipo de fallo más caro que existe, porque nadie lo está buscando: se descubre tarde, y normalmente lo descubre otra persona.

Hoy le ponemos remedio con la herramienta que ya tienes instalada.

### Tres conceptos y ya podemos empezar

<p class="term">Colección</p>

Un conjunto de peticiones guardadas, con nombre, organizadas en carpetas y **en un orden**. No es un cajón: es un guion que se puede ejecutar de principio a fin.

<p class="term">Variable</p>

Un valor con nombre que se escribe una vez y se usa en muchas peticiones. Se escribe entre llaves dobles: `{{baseUrl}}`.

<p class="term">Entorno</p>

Un juego de valores para esas variables. El entorno «local» dice que `baseUrl` es `http://localhost:8080`; mañana, el entorno «producción» dirá otra cosa. **La misma colección, ejecutada contra sitios distintos, sin tocar ni una petición.**

### Paso 1 · Crea la colección

En Postman, `New → Collection`. Llámala **Gestor de incidencias**.

Dentro, crea dos carpetas: `Tareas` y `Proyectos`.

Ahora ve guardando en ellas las peticiones que ya usas. Cada vez que tengas una petición que funciona, `Save` y elige la carpeta.

<div class="rule">
  <p class="rule-label">Los nombres importan más de lo que parece</p>
  <p>No llames a una petición «POST 1». Llámala <strong>«Crear tarea válida»</strong>, «Crear tarea sin título», «Obtener tarea inexistente».</p>
  <p>El nombre tiene que decir <em>qué caso comprueba</em>, porque dentro de un mes la colección la va a ejecutar alguien —tú incluido— que no recuerde qué hacía la número 7. Una colección bien nombrada es la primera documentación de tu API.</p>
</div>

### Paso 2 · Saca la dirección a una variable

Ahora mismo todas tus peticiones empiezan por `http://localhost:8080`. Si mañana cambias el puerto, las reescribes todas.

1. `Environments → Create Environment`, llámalo **Local**.
2. Añade una variable: nombre `baseUrl`, valor `http://localhost:8080`.
3. Guarda y **selecciónalo** en el desplegable de arriba a la derecha. Es el paso que se olvida: un entorno creado pero no seleccionado no hace nada.
4. En cada petición, sustituye el principio de la URL:

```text
{{baseUrl}}/tareas/1
```

Pasa el ratón por encima de `{{baseUrl}}`: Postman te enseña el valor que va a usar. Si aparece en rojo o dice `unresolved`, es que no has seleccionado el entorno.

Cambia ahora el valor de la variable a `http://localhost:8081`, cambia el puerto de la aplicación en `application.properties`, y comprueba que **toda la colección sigue funcionando sin haber tocado ni una petición**. Después devuélvelo todo al 8080.

### Paso 3 · Encadena peticiones

Aquí está el salto de calidad. Ahora mismo, para consultar la tarea que acabas de crear, miras el id a ojo y lo escribes en la petición siguiente. Eso hace que la colección **no se pueda ejecutar sola**.

La solución es guardar el id de la respuesta en una variable. En Postman, en la petición de creación, pestaña **Scripts** (o *Tests*, según la versión):

```javascript
pm.collectionVariables.set("tareaId", pm.response.json().id);
```

Una línea. Se lee así: «del JSON de la respuesta, coge el campo `id` y guárdalo en la variable `tareaId`».

A partir de ahí, en las peticiones siguientes:

```text
{{baseUrl}}/tareas/{{tareaId}}
```

<div class="rule">
  <p class="rule-label">Por qué esto lo cambia todo</p>
  <p>Con las peticiones encadenadas, tu colección deja de ser una lista de cosas sueltas y pasa a ser <strong>un escenario completo</strong>: crear, consultar lo creado, modificarlo, borrarlo y comprobar que ya no está.</p>
  <p>Ese escenario se ejecuta entero con un botón y sin intervención humana. Y eso es exactamente lo que hace un test automático, que es a donde vamos en la UD4.</p>
</div>

### Paso 4 · Comprobaciones automáticas

Guardar peticiones está bien; que ellas mismas digan si el resultado es correcto está mucho mejor. En la misma pestaña de scripts:

```javascript
pm.test("Responde 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Devuelve un id asignado", function () {
    pm.expect(pm.response.json().id).to.be.above(0);
});
```

No hace falta que sepas JavaScript: el patrón es siempre el mismo, un nombre y una comprobación. Copia, cambia el número y cambia el campo.

Al enviar la petición, abajo aparece la pestaña **Test Results** con una línea verde por cada comprobación superada y roja por cada una fallida.

<div class="rule">
  <p class="rule-label">Qué comprobar y qué no</p>
  <p>Comprueba <strong>el contrato</strong>: el código de estado, que exista un campo, que un valor sea el que enviaste. Eso es lo que has prometido y no debería cambiar.</p>
  <p>No compruebes cosas que van a cambiar solas: que el id sea exactamente 3, que la lista tenga exactamente cinco elementos, la fecha de creación. Una prueba que falla sin que nadie haya roto nada acaba ignorándose, y una prueba ignorada es peor que no tenerla.</p>
</div>

### Paso 5 · Ejecuta la colección entera

Botón derecho sobre la colección, `Run collection`. Se abre el ejecutor: elige el orden, pulsa `Run` y en unos segundos tienes el informe completo.

Verde entero significa que **todo el contrato de tu API sigue en pie**. En diez segundos, y sin haber escrito una URL a mano.

<details class="aside aside--extra">
  <summary>Si usas Bruno en lugar de Postman</summary>
  <p>Todo lo de hoy existe igual, con dos ventajas: no pide cuenta y guarda cada petición como un archivo <code>.bru</code> de texto <strong>dentro de tu propio proyecto</strong>, así que va al repositorio con el resto del código.</p>
  <p>El encadenado se escribe así:</p>
  <p><code>vars:post-response { tareaId: res.body.id }</code></p>
  <p>Y las comprobaciones así:</p>
  <p><code>assert { res.status: eq 201 }</code></p>
</details>

### Paso 6 · Guárdala en el repositorio

Una colección que solo existe en tu portátil no es evidencia de nada.

En Postman: botón derecho sobre la colección, `Export`, y guarda el `.json` en una carpeta `pruebas/` dentro del proyecto. En Bruno ya está dentro.

A partir de ahora, **la colección se entrega con el código**. Forma parte del trabajo igual que el `pom.xml`.

### Práctica guiada · El escenario completo

Monta en la colección este escenario, en este orden, cada petición con sus comprobaciones:

| # | Petición | Comprueba |
| :---: | :--- | :--- |
| 1 | Listar tareas | `200` y que la respuesta sea un array |
| 2 | Crear tarea válida | `201`, que haya `Location`, y guarda el id en `{{tareaId}}` |
| 3 | Obtener la tarea creada | `200` y que el título sea el que enviaste |
| 4 | Modificar con `PATCH` | `200` y que el campo cambiado sea el nuevo |
| 5 | Obtener tarea inexistente | `404` |
| 6 | Crear con cuerpo inválido | `400` |
| 7 | Crear con `Content-Type` incorrecto | `415` |
| 8 | Borrar la tarea creada | `204` |
| 9 | Obtener la tarea borrada | `404` |

Ejecútalo entero. Tiene que salir verde de arriba abajo.

Fíjate en que los pasos 3, 4, 8 y 9 usan `{{tareaId}}`: **ninguno tiene un número escrito a mano**. Por eso el escenario se puede ejecutar mil veces seguidas.

### Ahora tú · Rompe el código a propósito

Esta es la comprobación de que la colección sirve para algo.

1. Con la colección en verde, ve al código y **rompe una cosa**: cambia el `201` de la creación por un `200`.
2. **No toques la colección.** Reinicia y ejecútala.
3. Anota qué peticiones fallan y qué dice el informe.
4. Repara el código y vuelve a ejecutarla.

Repítelo con otras dos averías a tu elección: por ejemplo, que el borrado no borre nada, o que la consulta por id devuelva siempre la primera tarea.

Escribe después una frase por avería: **¿cuánto habrías tardado en darte cuenta sin la colección?**

### Reto · La colección de proyectos, sin guion

Construye tú solo el escenario equivalente para proyectos, con estas condiciones añadidas:

1. Al menos **doce** peticiones, cubriendo los casos correctos y los de error.
2. Ninguna URL con un identificador escrito a mano.
3. Todas con al menos una comprobación automática.
4. Ninguna comprobación frágil, de las que fallan sola sin que nadie rompa nada.
5. El escenario termina dejando el servidor **como estaba al empezar**: lo que creas, lo borras.

La condición 5 es la difícil y es la más importante: una colección que ensucia los datos solo se puede ejecutar una vez. Explica en un comentario cómo la has resuelto.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Colección creada, entorno con <code>baseUrl</code> y las peticiones de tareas guardadas y nombradas.</span></div>
  <div><strong>Si lo tienes</strong><span>El escenario de nueve pasos encadenado con <code>{{tareaId}}</code>, en verde, y las tres averías detectadas.</span></div>
  <div><strong>Reto</strong><span>La colección de proyectos con doce peticiones que puede ejecutarse dos veces seguidas con el mismo resultado.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 11</p>
  <ul class="checklist">
    <li>La colección existe, está organizada en carpetas y sus peticiones tienen nombres que dicen qué comprueban.</li>
    <li>Ninguna URL lleva escrito el servidor: todas usan <code>{{baseUrl}}</code>.</li>
    <li>El id creado se guarda en una variable y lo usan las peticiones siguientes.</li>
    <li>Cada petición tiene al menos una comprobación automática y la colección se ejecuta entera en verde.</li>
    <li>Has roto el código a propósito y la colección lo ha detectado.</li>
    <li>La colección está exportada dentro del repositorio.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué es una regresión y por qué es el fallo más caro?</li>
    <li>¿Para qué sirve un entorno y qué diferencia hay con una variable?</li>
    <li>¿Por qué no se debe comprobar que el id devuelto sea exactamente 3?</li>
    <li>¿Por qué un escenario debe dejar el servidor como estaba?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Algo que funcionaba y ha dejado de funcionar por un cambio hecho en otro sitio. Es caro porque nadie lo está buscando: se descubre tarde y suele descubrirlo otra persona.</p>
  <p>2 · La variable es el hueco con nombre que dejas en las peticiones; el entorno es el juego de valores que rellena esos huecos. Cambiando de entorno, la misma colección apunta a otro servidor.</p>
  <p>3 · Porque ese valor cambia solo según lo que se haya creado antes, y la prueba fallaría sin que nadie hubiera roto nada. Una prueba que da falsas alarmas se acaba ignorando.</p>
  <p>4 · Para poder ejecutarlo tantas veces como haga falta con el mismo resultado. Si deja datos, la segunda ejecución parte de una situación distinta y sus comprobaciones dejan de ser fiables.</p>
</details>

## Sesión 12 · Backend en memoria verificable

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> qué separa un montón de endpoints que funcionan de un backend que otra persona puede ejecutar.</li>
    <li><strong>2. Haz:</strong> completa la aplicación según la especificación y déjala verificable de principio a fin.</li>
    <li><strong>3. Comprueba:</strong> otra persona ejecuta tu colección sin preguntarte nada y le sale verde.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Enumera de memoria los códigos de las seis operaciones de un CRUD, con sus casos de error.</li>
    <li>¿Qué tiene que cumplir un escenario de pruebas para poder ejecutarse dos veces seguidas?</li>
    <li>¿Qué diferencia hay entre <code>PUT</code> y <code>PATCH</code>?</li>
  </ol>
</div>

<div class="rule">
  <p class="rule-label">Cómo es esta sesión</p>
  <p>Sesión de integración: recibes <strong>una especificación y unos criterios de aceptación</strong>, no un ejemplo resuelto. Todo lo necesario se ha explicado entre la UD1 y la sesión 11; lo que se evalúa hoy es que sepas combinarlo y demostrar que funciona.</p>
</div>

### La diferencia que importa

Tu API funciona. Eso ya no es noticia: funciona desde la UD1.

Lo que se pide hoy es otra cosa, y es la que separa un ejercicio de un entregable:

> **Que otra persona pueda comprobar que funciona sin que tú estés delante.**

Piensa en qué haría un compañero que abriese tu repositorio ahora mismo. ¿Sabría arrancarlo? ¿Sabría qué endpoints hay? ¿Sabría qué debe responder cada uno? ¿Podría comprobarlo sin escribir una sola petición a mano?

Si la respuesta a las cuatro no es sí, el trabajo no está terminado aunque el código sea correcto.

### Especificación · Gestor de incidencias, versión en memoria

La aplicación gestiona **proyectos** y **tareas**, y cada tarea pertenece a un proyecto.

#### Modelo

| Clase | Campos mínimos |
| :--- | :--- |
| `Proyecto` | `id`, `nombre`, `descripcion`, `activo` |
| `Tarea` | `id`, `titulo`, `prioridad`, `completada`, `proyectoId` |

Los identificadores los asigna el servidor y no se repiten aunque se borren elementos.

#### Endpoints exigidos

| Método y ruta | Caso | Respuesta |
| :--- | :--- | :--- |
| `GET /proyectos` | Siempre | `200` con el array |
| `GET /proyectos?activo=true` | Filtro opcional | `200` con los que coincidan |
| `GET /proyectos/{id}` | Existe / no existe | `200` / `404` |
| `POST /proyectos` | Correcto | `201`, cuerpo y `Location` |
| `PUT /proyectos/{id}` | Existe / no existe | `200` / `404` |
| `PATCH /proyectos/{id}` | Existe / no existe | `200` / `404` |
| `DELETE /proyectos/{id}` | — | `204` |
| `GET /tareas` | Siempre | `200` con el array |
| `GET /tareas?completada=true` | Filtro opcional | `200` con las que coincidan |
| `GET /tareas/{id}` | Existe / no existe | `200` / `404` |
| `POST /tareas` | Correcto | `201`, cuerpo y `Location` |
| `PUT /tareas/{id}` | Existe / no existe | `200` / `404` |
| `PATCH /tareas/{id}` | Existe / no existe | `200` / `404` |
| `DELETE /tareas/{id}` | — | `204` |
| **`GET /proyectos/{id}/tareas`** | Proyecto existe | `200` con sus tareas |
| **`GET /proyectos/{id}/tareas`** | Proyecto no existe | `404` |

Las dos últimas filas son las únicas que no has hecho nunca. Piensa antes de escribir: ¿en qué controlador vive esa ruta? ¿Qué distingue «este proyecto no tiene tareas» de «este proyecto no existe», y qué debe responder cada caso?

#### Reglas que se comprueban

1. Ninguna ruta contiene un verbo. La acción la expresa el método HTTP.
2. Ninguna operación de escritura acepta el `id` del cuerpo: manda la ruta.
3. `PUT` sustituye por completo; `PATCH` solo toca lo que recibe.
4. Una colección sin resultados devuelve `200` con `[]`, nunca `404`.
5. El filtro es opcional; sin él salen todos los elementos.

<details class="aside aside--help">
  <summary>Estoy atascado · la ruta anidada</summary>
  <p>Fíjate en qué identifica y qué filtra. El <code>{id}</code> del proyecto <strong>identifica</strong>, así que va en la ruta; eso ya lo decidiste en la UD1.</p>
  <p>Para saber qué tareas son suyas necesitas recorrer la lista de tareas comparando su <code>proyectoId</code>. Y antes de eso, comprobar que el proyecto existe: si no existe, la respuesta no es una lista vacía.</p>
</details>

### La prueba de aceptación

Amplía la colección de la sesión 11 hasta cubrir la especificación entera. Debe cumplir esto:

<div class="checkpoint">
  <p class="checkpoint-label">Criterios de aceptación de la colección</p>
  <ul class="checklist">
    <li>Cubre las dieciséis filas de la tabla, casos de error incluidos.</li>
    <li>Ninguna URL contiene un identificador ni un servidor escritos a mano.</li>
    <li>Toda petición tiene al menos una comprobación automática.</li>
    <li>Se ejecuta entera en verde con un solo botón.</li>
    <li>Se puede ejecutar <strong>dos veces seguidas</strong> con el mismo resultado.</li>
    <li>Está exportada dentro del repositorio.</li>
  </ul>
</div>

El quinto criterio es el que separa una colección de una lista de peticiones. Si la segunda ejecución falla, es que el escenario deja datos, o que da por hecho un estado inicial que ya no se cumple.

### Entrega

En tu repositorio del módulo:

1. **El proyecto completo**, arrancable con `mvnw spring-boot:run`.
2. **La colección exportada**, en una carpeta `pruebas/`.
3. Un **`README.md`** que quepa en una pantalla y responda a tres cosas: cómo se arranca, qué endpoints hay y cómo se ejecuta la colección.
4. Un **`DECISIONES.md`** con estas cuatro, cada una en dos o tres frases:
   * Qué responde tu `DELETE` sobre algo inexistente, y por qué elegiste eso.
   * Qué hace tu API si el `id` del cuerpo no coincide con el de la ruta.
   * Qué devuelve `GET /proyectos/{id}/tareas` cuando el proyecto existe y no tiene tareas, y por qué no es un `404`.
   * Si dejaste Jackson tolerante o estricto con las claves desconocidas, y qué pierdes con tu elección.

<div class="rule">
  <p class="rule-label">El README no es burocracia</p>
  <p>Es la parte del entregable que se lee primero y la que decide si alguien puede usar tu trabajo. Un backend excelente con un README que no explica cómo arrancarlo es, para quien llega nuevo, un backend que no funciona.</p>
</div>

### Autoevaluación antes de entregar

Pásate esta lista tú mismo. Es la misma con la que se corrige.

| Comprobación | Cómo lo verificas |
| :--- | :--- |
| Arranca desde cero | Clona tu propio repositorio en otra carpeta y arráncalo |
| Los endpoints están completos | La colección cubre las dieciséis filas |
| Los códigos son correctos | La colección está en verde |
| Es repetible | La ejecutas dos veces seguidas |
| Se entiende sin ti | Se lo das a un compañero y no te pregunta nada |
| Las decisiones están escritas | `DECISIONES.md` responde a las cuatro |

La quinta es la de verdad. **Dáselo a alguien y no le expliques nada.** Cada pregunta que te haga es una línea que le falta a tu README.

### Lo que esta versión todavía hace mal

Compruébalo y anótalo, porque es el índice de la UD3:

| Prueba esto | Lo que pasa | Lo correcto | Dónde se arregla |
| :--- | :--- | :--- | :--- |
| `POST /tareas` con `{}` | Crea una tarea sin nada | `400` diciendo qué falta | UD3 |
| `POST` con prioridad `"urgentísima"` | La acepta | `400`: no es un valor válido | UD3 |
| `POST /tareas` con un `proyectoId` inexistente | La acepta | `400` o `404`, pero no un `201` | UD3 |
| Cualquier `400` | Cuerpo genérico e inútil | Un mensaje que diga qué corregir | UD3 |
| Añadir un campo interno al modelo | Se publica solo | Se publica lo que tú decidas | UD3, con DTO |
| Reiniciar | Se pierde todo | Sigue ahí | UD5 |

Fíjate en la tercera fila: tu API acepta tareas que pertenecen a proyectos que no existen. Nada en el código lo impide, porque nadie ha escrito todavía qué es una tarea válida.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Las dieciséis filas implementadas con sus códigos correctos y la colección cubriéndolas.</span></div>
  <div><strong>Si lo tienes</strong><span>La colección ejecutable dos veces seguidas, con README y DECISIONES escritos.</span></div>
  <div><strong>Reto</strong><span>Un compañero clona tu repositorio, lo arranca y ejecuta la colección sin preguntarte nada.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 12</p>
  <ul class="checklist">
    <li>Las dieciséis filas de la especificación responden lo que dice la tabla.</li>
    <li>La ruta anidada distingue «el proyecto no existe» de «el proyecto no tiene tareas».</li>
    <li>La colección cubre la especificación entera y se ejecuta dos veces en verde.</li>
    <li>El repositorio incluye el proyecto, la colección, el README y las decisiones.</li>
    <li>Puedes enumerar los seis defectos que quedan y en qué unidad se resuelve cada uno.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué distingue un ejercicio que funciona de un entregable?</li>
    <li>¿Por qué una colección que no se puede ejecutar dos veces no sirve?</li>
    <li>Un proyecto existe y no tiene tareas. ¿Qué devuelve la ruta anidada?</li>
    <li>¿Por qué tu API acepta hoy una tarea de un proyecto inexistente?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que otra persona pueda arrancarlo y comprobar que funciona sin que tú estés delante: código, pruebas ejecutables y documentación mínima.</p>
  <p>2 · Porque deja el servidor en un estado distinto del que suponía, así que a partir de la segunda vez sus comprobaciones dejan de significar nada.</p>
  <p>3 · Un <code>200</code> con un array vacío. El recurso existe; lo que no hay son elementos, y eso no es un error.</p>
  <p>4 · Porque no hay validación: nadie ha escrito todavía qué condiciones debe cumplir una tarea para ser válida, así que Jackson construye el objeto y el controlador lo guarda.</p>
</details>

## Lo que debes recordar

### El método

Ante cualquier operación que tengas que exponer, esta secuencia. Es la de la UD1 con dos pasos nuevos, los dos últimos:

<figure class="diagram">
  <figcaption>Cómo se decide una operación completa</figcaption>
  <ol class="flow">
    <li>¿Sobre qué recurso actúo, y es uno o una colección?</li>
    <li>¿Qué le hago? Eso elige el método HTTP, y con él si es idempotente</li>
    <li>¿Qué datos necesito? Ruta si identifican, query si filtran, cuerpo si son contenido</li>
    <li><strong>¿Cómo puede terminar esto?</strong> Cada final tiene su código de estado</li>
    <li><strong>¿Cómo demuestro que sigue funcionando mañana?</strong> Una petición guardada con su comprobación</li>
  </ol>
</figure>

El paso cuatro es la unidad entera resumida en una línea: **una operación no tiene un resultado, tiene varios finales posibles**, y cada uno se comunica con un código distinto. Pensar solo en el caso que sale bien es lo que produce APIs que responden `200` a todo.

### La idea más importante

> **El código de estado no es un detalle de la respuesta: es la parte sobre la que el cliente decide. Un `200` es una afirmación, y afirmar que todo ha ido bien cuando no has encontrado nada es mentir con buena sintaxis.**

De ahí sale el resto de la unidad. Por eso un recurso ausente es `404` y una lista vacía no lo es, por eso crear devuelve `201` y dice dónde, por eso borrar devuelve `204`, y por eso hoy sabes que un cuerpo incompleto que devuelve `200` es un problema aunque no lance ninguna excepción.

<p class="term">Un contrato es lo que prometes, no lo que te sale</p>

Tu API promete unas rutas, unos formatos y unos códigos. Mientras eso se cumpla, quien te consume puede confiar. La colección de la sesión 11 existe justamente para demostrar cada día que la promesa sigue en pie.

### Las decisiones que tienes que saber justificar

| Decisión | Lo que tienes que poder decir |
| :--- | :--- |
| Una colección vacía es `200` con `[]` | La ruta existe y la consulta se resolvió; no hay elementos, que no es lo mismo que no haber recurso |
| Crear devuelve `201` con `Location` | El cliente necesita saber que hay algo nuevo y dónde encontrarlo, sin construir la URL él |
| Borrar devuelve `204` | Ha ido bien y no hay nada que entregar; un `200` vacío promete contenido que no llega |
| Modificar es `PUT` o `PATCH`, no `POST` | `POST` no es idempotente, y un reintento tras un fallo de red duplicaría el recurso |
| `PUT` pierde lo que no envías | Declara el recurso completo; si quieres tocar un campo, la operación es `PATCH` |
| El id manda desde la ruta | Si la ruta y el cuerpo discrepan hay que elegir uno, y adivinar es peor que decidir |
| Jackson tolerante o estricto | Tolerante protege a clientes antiguos; estricto detecta erratas. Las dos son defendibles, no decidirlo no |
| La colección se entrega con el código | Una prueba que solo existe en tu portátil no demuestra nada a nadie |

### Al terminar deberías poder responder

1. Enumera las fases por las que pasa una petición desde Tomcat hasta tu método.
2. ¿Qué es el `DispatcherServlet` y por qué no lo escribes tú?
3. No aparece la línea `Mapped to` en el registro. ¿Qué ha ocurrido?
4. ¿Qué fase produce un `404`, cuál un `405`, cuál un `415` y cuál un `406`?
5. ¿Por qué en esos cuatro casos tu método no llega a ejecutarse?
6. ¿De dónde puede salir cada parámetro de un método de controlador?
7. ¿Recorre Jackson las claves del JSON o los campos de tu clase, y qué consecuencia tiene?
8. Diferencia entre un cuerpo inválido y uno incompleto. ¿Quién resuelve cada uno?
9. ¿Por qué `{}` devuelve `200` y `{,}` devuelve `400`?
10. ¿Qué ganas y qué pierdes al activar `fail-on-unknown-properties`?
11. ¿En qué formato viaja una fecha en una API y por qué no en el del país?
12. ¿Qué significa que una operación sea segura? ¿Y idempotente?
13. ¿Por qué le importa la idempotencia a un cliente que ha sufrido un tiempo de espera agotado?
14. ¿Qué le pasa a un campo que no envías en un `PUT`? ¿Y en un `PATCH`?
15. ¿Por qué tu `PATCH` actual no puede vaciar un campo?
16. ¿Cuándo basta `@ResponseStatus` y cuándo hace falta `ResponseEntity`?
17. ¿Qué información lleva la cabecera `Location` y en qué respuesta viaja?
18. ¿Por qué una lista vacía no es un `404`?
19. ¿Qué es una regresión y por qué es cara?
20. ¿Por qué una comprobación que exige que el id sea exactamente 3 es una mala comprobación?

Si además puedes recibir una especificación de endpoints y traducirla a controladores con sus códigos correctos y su colección, estás listo para la UD3.

### El vocabulario de la unidad

| Concepto | Significa |
| :--- | :--- |
| *DispatcherServlet* | La puerta única por la que entran todas las peticiones |
| *Handler mapping* | La fase que decide qué método tuyo atiende una petición |
| Resolutor de argumentos | La pieza que construye cada parámetro de tu método |
| Conversor de mensaje | Quien traduce entre el cuerpo HTTP y los objetos Java |
| `@RequestHeader` | Lee una cabecera de la petición |
| `consumes` | Qué formatos sabe leer un endpoint. Su incumplimiento da `415` |
| `produces` | Qué formatos sabe devolver. Su incumplimiento da `406` |
| Deserializar | Convertir el texto del cuerpo en un objeto Java |
| Cuerpo inválido | No es JSON o no encaja con los tipos. Lo rechaza el framework con `400` |
| Cuerpo incompleto | Es JSON válido y le faltan datos. Nadie lo rechaza todavía |
| Tolerancia a claves desconocidas | Ignorar en silencio lo que no reconoce, activado por defecto |
| Seguro | No modifica nada. Solo `GET` |
| Idempotente | Repetirlo deja el servidor igual que hacerlo una vez |
| `PUT` | Sustituye el recurso completo por lo que envías |
| `PATCH` | Modifica solo los campos enviados |
| `ResponseEntity` | La respuesta entera: estado, cabeceras y cuerpo, decididos por ti |
| `@ResponseStatus` | Fija el código cuando el método solo puede terminar de una manera |
| `201 Created` | Se ha creado un recurso; va acompañado de `Location` |
| `204 No Content` | Ha ido bien y no hay nada que devolver |
| `Location` | La URL donde vive el recurso recién creado |
| Colección | Peticiones guardadas, nombradas y ordenadas como un escenario ejecutable |
| Variable | Un hueco con nombre dentro de una petición: `{{baseUrl}}` |
| Entorno | El juego de valores que rellena esas variables |
| Encadenar | Guardar un dato de una respuesta para usarlo en la petición siguiente |
| Regresión | Algo que funcionaba y se ha roto por un cambio hecho en otro sitio |
| Contrato | Las rutas, formatos y códigos que tu API promete cumplir |

### Comprobación final del producto

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación final · con el proyecto delante</p>
  <ul class="checklist">
    <li>Ningún endpoint responde <code>200</code> cuando el recurso no existe.</li>
    <li>Crear responde <code>201</code> con <code>Location</code>, y esa URL funciona al pegarla en un <code>GET</code>.</li>
    <li>Borrar responde <code>204</code> y su método devuelve <code>ResponseEntity&lt;Void&gt;</code>.</li>
    <li><code>PUT</code> y <code>PATCH</code> se comportan de forma distinta y sabes demostrarlo con dos peticiones.</li>
    <li>La colección cubre la especificación entera y se ejecuta dos veces seguidas en verde.</li>
    <li>El repositorio incluye la colección exportada, el README y las decisiones escritas.</li>
    <li>Sabes provocar a voluntad un 400, un 404, un 405, un 406 y un 415.</li>
  </ul>
</div>

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

### La siguiente unidad

En la UD1 preguntábamos cómo conseguir que la aplicación respondiera. En esta, cómo conseguir que respondiera **bien**. Queda la tercera pregunta, y es la que separa una API que funciona de una que se puede usar:

> **¿Está bien diseñada?**

<figure class="diagram">
  <figcaption>Las tres preguntas de un backend</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>UD1 · que responda</li>
    <li>UD2 · que responda correctamente</li>
    <li>UD3 · que esté bien diseñada</li>
  </ol>
</figure>

Y tienes los seis motivos delante, todos comprobados por ti en la sesión 12:

| Lo que tu API sigue haciendo mal | Se arregla en |
| :--- | :--- |
| Acepta una tarea sin título, sin prioridad y sin nada | UD3, con validación |
| Acepta una tarea de un proyecto que no existe | UD3 |
| Sus errores no explican qué hay que corregir | UD3, con errores coherentes |
| Publica el modelo interno entero, tal cual está escrito | UD3, con DTO |
| Sus rutas las has ido nombrando por intuición | UD3, con diseño orientado a recursos |
| Al reiniciar se pierde todo | UD5, con PostgreSQL |

Y aquí se cobra el trabajo de estas dos semanas: cuando en la UD3 aparezcan los DTO, las anotaciones de validación y el manejador de errores, **no serán temas nuevos**. Serán las respuestas a seis problemas que ya has visto fallar, con una colección lista para demostrar que se han arreglado.

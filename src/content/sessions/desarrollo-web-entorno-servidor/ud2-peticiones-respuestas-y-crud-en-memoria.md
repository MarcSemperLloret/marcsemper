---
title: "Peticiones, respuestas y CRUD en memoria"
label: "UD2 · Comunicar"
section: "ud-02"
order: 2
lang: "es"
summary: "Cómo transforma Spring una petición HTTP en datos Java y cómo construye la respuesta, hasta completar un CRUD en memoria con los códigos de estado correctos."
duration: "12 horas · 2 semanas · 4 sesiones de 3 h"
modality: "Taller de proyecto · 25 min de explicación, 140 min de trabajo y 15 min de cierre"
deliverable: "Operaciones de lectura y escritura con respuestas HTTP justificadas y comprobadas."
date: "2026-09-09"
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

<p class="lead">El CRUD elegido sigue en memoria. En estas cuatro sesiones completas y verificas sus entradas, escrituras y respuestas HTTP antes de consolidar el diseño REST.</p>

## Semana 3 · De la petición al objeto Java

## Sesión 5 · De la petición al objeto Java

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [el primer workflow](/es/docencia/proyecto-intermodular/ud2-que-lo-compruebe-la-maquina/sesion-3/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

El CRUD funciona, pero una petición puede fallar antes de entrar en tu método. Hoy seguirás cómo Spring selecciona la ruta y transforma las entradas. Deserializar significa convertir el JSON recibido en un objeto Java; el registro de ejecución permitirá identificar dónde se detiene ese proceso.

#### Cómo llega la petición al controlador

En las primeras sesiones asociaste rutas con métodos mediante anotaciones y enviaste objetos JSON. Ahora vas a distinguir tres tareas que realiza Spring antes de invocar tu código: elegir el método, obtener sus parámetros y convertir el cuerpo. Esta distinción permite buscar cada fallo en el lugar adecuado.

#### El recorrido completo

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

#### Qué puede ser un parámetro de tu método

El paso 4 del recorrido es el que más magia parece. Spring mira **uno a uno** los parámetros que has declarado y, según cómo estén anotados, sabe de dónde sacar el valor.

| Lo que declaras | De dónde sale | Visto en |
| :--- | :--- | :---: |
| `@PathVariable` | Un trozo de la ruta | UD1 · sesión 2 |
| `@RequestParam` | La *query string* | UD1 · sesión 2 |
| `@RequestBody` | El cuerpo de la petición | UD1 · sesión 3 |
| `@RequestHeader` | Una cabecera | **Hoy** |
| `HttpServletRequest` | La petición cruda entera | Hoy |

No hay un orden obligatorio ni un número máximo. Puedes combinarlos todos en un mismo método.

##### `@RequestHeader` · leer una cabecera

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
  <p>Si pides una cabecera que no llega, obtienes un <code>400</code>, igual que con un <code>@RequestParam</code> obligatorio. La corrección es la misma:</p>
  <p><code>@RequestHeader(name = "X-Origen", required = false) String origen</code></p>
  <p>Las cabeceras que empiezan por <code>X-</code> son, por convención, las que se inventa cada aplicación para sus propias necesidades.</p>
</details>

#### La pregunta que quedó sin responder

En la UD1 enviaste un JSON con una errata y la API respondió `200` con el campo a `null`. Lo anotamos como una curiosidad inquietante y seguimos.

Hoy toca entenderlo, porque **es el origen de una clase entera de fallos**: los que no fallan. Un error que devuelve `500` te despierta a las tres de la mañana; un error que devuelve `200` guardando datos incompletos no te despierta nunca, y aparece tres meses después cuando alguien pregunta por qué faltan doscientos títulos.

#### Quién convierte el cuerpo

<p class="term">Conversor de mensaje</p>

La pieza del recorrido HTTP que traduce entre el cuerpo HTTP —bytes y texto— y los objetos Java. Funciona en las dos direcciones: al entrar, con `@RequestBody`; al salir, con lo que devuelve tu método.

Para JSON, ese conversor utiliza **Jackson**, la biblioteca de conversión introducida en la sesión 3. En el modelo con constructor vacío y setters que estamos usando, el proceso es el siguiente; otros modelos, como los records, se construyen de otra forma.

<figure class="diagram">
  <figcaption>Qué hace Jackson con cada clave del JSON</figcaption>
  <ol class="flow flow--before">
    <li>Crea el objeto vacío con el constructor sin argumentos</li>
    <li>Coge la primera clave del JSON, por ejemplo <code>titulo</code></li>
    <li>Busca un <em>setter</em> que le corresponda: <code>setTitulo</code></li>
    <li>Si lo encuentra, convierte el valor al tipo que pida ese <em>setter</em> y lo llama</li>
    <li>Si no hay setter, puede utilizar otros accesos configurados, como un campo inferido. Si la propiedad es desconocida, la ignora en modo tolerante o rechaza el cuerpo en modo estricto</li>
    <li>Repite hasta terminar el JSON</li>
  </ol>
</figure>

Jackson procesa las propiedades presentes en el JSON. Las omitidas conservan el valor inicial del objeto: el asignado por su constructor o inicializadores, o el valor por defecto de Java si no hay ninguno (`null`, `0` o `false`, según el tipo). Una propiedad desconocida y una propiedad omitida son casos diferentes.

#### Los tres estados de un cuerpo

Un cuerpo que llega puede estar en tres situaciones muy distintas, y Spring las trata de forma radicalmente diferente:

| Estado | Ejemplo | Qué hace Spring | Código |
| :--- | :--- | :--- | :---: |
| **Válido** | `{"titulo":"Revisar"}` | Construye el objeto | `200` |
| **Inválido** | `{"titulo":"Revisar",}` | No puede leerlo, rechaza | `400` |
| **Incompleto** | `{}` | Lo construye igual, con valores por defecto | `200` |

<div class="rule">
  <p class="rule-label">La distinción que hay que interiorizar hoy</p>
  <p>Un cuerpo puede fallar por sintaxis JSON incorrecta o por incompatibilidad con el tipo Java. Ambos pueden producir 400, pero sus causas y correcciones son distintas.</p>
  <p><strong>Incompleto</strong> es un problema de <em>significado</em>: es JSON perfecto y le faltan datos que tu aplicación necesita. Jackson no tiene ninguna opinión al respecto, porque nadie le ha dicho qué es una tarea válida.</p>
  <p>El primero te lo resuelve el framework. El segundo <strong>es responsabilidad tuya</strong>, y hasta la UD3 no tendrás la herramienta para resolverlo bien.</p>
</div>

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre el controlador del CRUD, el modelo y `src/main/resources/application.properties`. Reproduce un GET y un POST válidos de la sesión 4.
2. Localiza la consola donde aparecen los mensajes del servidor. Allí leerás los registros, o logs, después de activar el nivel DEBUG en el siguiente paso.
3. Prepara cuatro variaciones de una petición válida: ruta inexistente, método no admitido, parámetro de tipo incorrecto y cuerpo JSON mal formado. Conserva la petición original para compararlas.

#### Paso 2 · Activar los logs de Spring y localizar el método que atiende la petición

Añade la propiedad de DEBUG al archivo existente, sin borrar sus otras líneas, y reinicia. Crea una tarea mediante el POST y utiliza su id en el GET: el número `1` del ejemplo solo es válido si ese registro existe. Deja visible la terminal del servidor, envía una petición y localiza únicamente las líneas correspondientes a su ruta; los logs de arranque pertenecen a otro momento.

En `src/main/resources/application.properties`:

```properties
logging.level.org.springframework.web=DEBUG
```

Desde Postman, un `GET http://localhost:8080/tareas/1`. Ahora mira la consola: donde antes no salía nada, aparecen varias líneas.

```text
DispatcherServlet        : GET "/tareas/1", parameters={}
RequestMappingHandlerMapping : Mapped to TareaController#detalle(int)
RequestResponseBodyMethodProcessor : Using 'application/json'
DispatcherServlet        : Completed 200 OK
```

<dl class="worked">
  <dt>Línea 1 · llegó esto</dt>
  <dd>DispatcherServlet registra método y ruta. Si no ves la línea, comprueba primero el nivel de log, la consola seleccionada y que miras la ejecución actual; después revisa dirección, puerto y arranque. La ausencia de un mensaje por sí sola no demuestra que no haya llegado una petición.</dd>
  <dt>Línea 2 · va a este método</dt>
  <dd>La decisión más importante de todo el recorrido. Te dice, con nombre y apellidos, qué método tuyo va a ejecutarse. Cuando una petición «hace algo raro», esta línea te dice si está entrando por donde crees.</dd>
  <dt>Línea 3 · lo devuelvo así</dt>
  <dd>Con qué formato se va a escribir la respuesta.</dd>
  <dt>Línea 4 · terminó así</dt>
  <dd>El código de estado final.</dd>
</dl>

<div class="rule">
  <p class="rule-label">Esta es la herramienta de diagnóstico de todo el curso</p>
  <p>Relaciona las líneas con las fases del recorrido. Encontrar un método no implica que se haya ejecutado: todavía deben resolverse sus argumentos. También puede fallar la escritura de la respuesta después de ejecutarlo. Comprueba la excepción y, cuando haga falta, añade temporalmente un mensaje al principio del método para observar si entra.</p>
  <p>Déjalo encendido mientras desarrollas y apágalo cuando te moleste. Es una línea en un archivo.</p>
</div>

#### Paso 3 · Distinguir errores de ruta, método, parámetros y cuerpo

La anotación `@PostMapping(consumes=..., produces=...)` sustituye a la anotación del POST existente. Conserva dentro del método la asignación de id y el guardado de la sesión 4: el bloque ilustra el acuerdo de formatos, no reinicia el CRUD. `consumes` restringe el cuerpo que aceptas y `produces` el formato que puedes devolver; cambia una sola cabecera de la petición en cada prueba.

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
  <p>Estos códigos describen el resultado HTTP, pero no bastan para deducir si se ejecutó el controlador. Con <code>consumes</code> o <code>produces</code> explícitos, Spring puede rechazar durante la selección del método. Si intenta convertir una respuesta ya devuelta, un 406 puede producirse después de ejecutarlo. Usa los logs y un mensaje temporal de entrada para comprobar la fase real.</p>
</div>

##### `consumes` y `produces`

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

#### Paso 4 · Enviar una petición por cada tipo de error y comparar la respuesta

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

No presupongas cuántas filas mostrarán `Mapped to`: depende de dónde declaraste las restricciones y de los conversores instalados. En el caso del GET con `Accept: application/xml`, compara lo observado con y sin `produces="application/json"` en ese GET. Añade un mensaje temporal al inicio del método para distinguir selección, ejecución y conversión de salida; retíralo después.

#### Paso 5 · Seguir una petición completa en los logs

Dentro de `ProyectoController`, añade un método de diagnóstico con `@GetMapping("/{id}/incidencias")` si la clase ya tiene el prefijo `/proyectos`. Sus argumentos son `@PathVariable(name="id") int id`, `@RequestParam(name="estado", required=false) String estado` y `@RequestHeader(name="User-Agent") String cliente`. Importa las anotaciones, devuelve una frase con los tres valores y reinicia. Si esa ruta ya existe, utiliza temporalmente `/{id}/diagnostico` para no sustituir una operación del proyecto. Compara un envío con `estado` y otro sin él.

1. Escribe un endpoint `GET /proyectos/{id}/incidencias` que reciba además un `@RequestParam` opcional `estado` y la cabecera `User-Agent`, y devuelva un texto con los tres valores.
2. Llámalo desde Postman con todo puesto.
3. Copia de la consola las cuatro líneas del registro y **anota junto a cada una** qué pieza del recorrido la ha escrito.
4. Vuelve a llamarlo quitando el parámetro `estado`. ¿Cambia alguna línea del registro? ¿Cuál?

<p class="stage">Cuerpo JSON y deserialización</p>

#### Paso 6 · Crear un endpoint de diagnóstico que devuelva el objeto recibido

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

#### Paso 7 · Enviar variantes de JSON al endpoint de diagnóstico

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
  <dd><code>200</code> las dos, y en silencio. Spring Boot configura Jackson para <strong>ignorar las claves desconocidas</strong>. Resulta indiferente que se trate de una errata propia o de un campo que el cliente se ha inventado: se descarta sin avisar.</dd>
  <dt>7 · un tipo que no convierte</dt>
  <dd>400: el JSON es sintácticamente válido, pero el texto «quizás» no puede convertirse al booleano esperado. Distingue un error de conversión de un JSON mal formado.</dd>
  <dt>8 · un tipo que sí convierte</dt>
  <dd><code>200</code>, y <code>completada</code> vale <code>true</code>. El texto <code>"true"</code> entre comillas <strong>no</strong> es un booleano JSON, y aun así Jackson lo acepta y lo convierte. Es tolerante por defecto, y esa tolerancia es una decisión que se puede cambiar.</dd>
</dl>

#### Paso 8 · Localizar la causa de deserialización en el mensaje de error

Cuando salga un `400`, el cuerpo de la respuesta es escueto y casi inútil. El mensaje bueno está, como siempre, en la consola:

```text
HttpMessageNotReadableException: JSON parse error:
Unexpected character ('}' (code 125)): was expecting double-quote to start field name
 at [Source: (line 1, column 26)]
```

Te dice **la excepción, el motivo y la posición exacta**. Acostúmbrate a leerla: en la UD3 vamos a convertir estos mensajes en respuestas útiles para el cliente, y no se puede transformar lo que no se sabe leer.

#### Paso 9 · Configurar el rechazo de campos JSON desconocidos

Que las claves desconocidas se ignoren responde a una configuración que Spring Boot aplica por defecto, no a un comportamiento inherente al protocolo. Puedes darle la vuelta:

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
  <p>La tolerancia o el rechazo forman parte del contrato de la API. Ignorar campos puede facilitar compatibilidad; rechazarlos permite detectar errores de nombre. No existe una elección obligatoria por el hecho de que la API sea pública.</p>
  <p>En una API interna, o durante el desarrollo, ser <strong>estricto</strong> ahorra horas de depuración.</p>
  <p>Para este curso, déjalo estricto mientras desarrollas la UD2 y la UD3 y decide tú al llegar al proyecto. Lo que no vale es no haberlo decidido.</p>
</div>

#### Paso 10 · Recibir objetos anidados y listas en el JSON

Cada ampliación pertenece a `Tarea.java`: añade **un campo cada vez**, sus métodos de acceso y el import de su tipo. Para `List<String>` importa `java.util.List`; para `LocalDate`, `java.time.LocalDate`. Crea `Responsable.java` en `model` con `nombre` y `email`, constructor vacío y getters/setters antes de declarar `Responsable responsable` en Tarea. Después de cada ampliación, reinicia y envía su JSON al endpoint espejo. Esos objetos aún no son relaciones de base de datos.

##### Una lista dentro del objeto

Añade a `Tarea` un campo `List<String> etiquetas` con su *getter* y su *setter*, y envía:

```json
{
  "titulo": "Revisar el login",
  "etiquetas": ["urgente", "movil", "regresion"]
}
```

Jackson construye la lista sola. No hay que hacer nada.

##### Un objeto dentro del objeto

Crea una clase `Responsable` con `nombre` y `email`, añádela como campo de `Tarea`, y envía:

```json
{
  "titulo": "Revisar el login",
  "responsable": { "nombre": "Marc", "email": "marc@ejemplo.com" }
}
```

Jackson entra dentro y repite el mismo proceso con la clase interior. **Es recursivo**, y por eso funciona con estructuras de cualquier profundidad.

##### Una fecha

```java
private LocalDate vencimiento;
```

```json
{ "titulo": "Revisar el login", "vencimiento": "2026-09-15" }
```

Funciona con el formato ISO, que es año-mes-día con guiones. Prueba a enviar `"15/09/2026"` y observa el `400`: no es que la fecha sea imposible, es que no está en el formato que se espera.

<div class="rule">
  <p class="rule-label">Una fecha siempre se escribe igual</p>
  <p>En este contrato, las fechas se transmiten en formato ISO 8601, como <code>2026-09-15</code>. Un texto como <code>03/04/2026</code> puede interpretarse como 3 de abril o 4 de marzo según la convención. Acordar año-mes-día evita esa ambigüedad; otros formatos requieren una configuración explícita.</p>
  <p>Dar formato a la fecha para que se lea bonita es trabajo del cliente, no tuyo.</p>
</div>

#### Paso 11 · Repetir el diagnóstico con otra entidad de tu dominio

Sobre tu proyecto:

1. Amplía la clase `Proyecto` con una lista de `String` y una fecha.
2. Crea un endpoint espejo para `Proyecto`.
3. Construye tu propia tabla de **seis** cuerpos: dos válidos, dos inválidos y dos incompletos. Envíalos y anota código y valores resultantes.
4. Para comparar ambas configuraciones, prueba primero con `spring.jackson.deserialization.fail-on-unknown-properties=false`, reinicia y ejecuta los seis casos. Cambia después a `true`, reinicia y repítelos. Conserva al terminar el modo estricto acordado para esta unidad.
5. Escribe en dos frases qué configuración dejarías puesta en tu proyecto y por qué.

#### Paso 12 · Comprobar y registrar el resultado del proyecto

1. Envía cada variación por separado y relaciona estado, mensaje de la consola y fase de procesamiento. Comprueba si llegó a ejecutarse el método del controlador.
2. Compara un JSON válido completo, uno con una clave equivocada y otro mal formado. Documenta cuándo hay rechazo y cuándo se construye un objeto con valores por defecto.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Predecir qué ruta selecciona Spring

En un controlador de diagnóstico separado, con prefijo `/diagnostico-rutas`, declara un GET `/{id}` que reciba un `int` y devuelva su valor, y otro GET `/nueva` que devuelva «Ruta literal». Utiliza un prefijo separado para no duplicar rutas de tu proyecto.

1. Predice la respuesta de `/diagnostico-rutas/nueva`, `/diagnostico-rutas/7` y `/diagnostico-rutas/abc`.
2. Ejecuta y compara los logs: la ruta literal `/nueva` tiene prioridad frente a `/{id}`; debe responder 200 con «Ruta literal». El número entra en detalle y `abc` no se convierte a int, por lo que responde 400.
3. Quita temporalmente solo la anotación del método `/nueva` y repite esa petición: ahora coincide con `/{id}` y falla la conversión a int.
4. Recupera la anotación, repite y retira el controlador de diagnóstico al terminar. Explica qué diferencia hay entre seleccionar una ruta y construir los argumentos.

<details class="aside aside--extra">
  <summary>Comprobar la explicación</summary>
  <p>El método literal sí se ejecuta: no hay una avería en su definición. Al retirar su mapeo, la misma URL pasa a coincidir con la variable. No importa qué método se escribió antes en el archivo, sino la especificidad de la ruta.</p>
</details>

##### Reto · El campo que desaparece

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
5. Comprueba si Jackson admite `estado` a pesar de que no haya setter. Con la configuración habitual puede inferir el campo privado a partir de su getter: no deduzcas el contrato mirando solo los setters. Localiza `urgente` con el depurador, porque no tiene getter para observarlo en el JSON.

Para este reto, prueba primero con campos desconocidos permitidos y después en modo estricto. El campo `prioridad`, que no existe, debe provocar rechazo en modo estricto. Restaura esa configuración al finalizar. Anota las diferencias observadas en lugar de asumir que quitar un setter bloquea la entrada.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>El endpoint espejo funcionando y los nueve cuerpos enviados con su resultado anotado.</span></div>
  <div><strong>Si lo tienes</strong><span>El espejo de proyectos con lista y fecha, y la comparación con y sin tolerancia.</span></div>
  <div><strong>Reto</strong><span>El comportamiento de las propiedades de Incidencia comprobado con ambas configuraciones y sus diferencias explicadas.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Las claves del JSON. La consecuencia es que lo que no venga en el cuerpo no se toca y conserva el valor por defecto de Java, sin que nadie avise.</p>
  <p>2 · Porque el primero es JSON perfectamente válido que simplemente no trae datos, y el segundo no es JSON: falla al leerlo, antes de intentar construir nada.</p>
  <p>3 · En ISO 8601, <code>2026-09-15</code>. Porque los formatos nacionales son ambiguos entre sí y el servidor no puede adivinar cuál usa quien llama. Formatearla es trabajo del cliente.</p>
  <p>4 · Entra, porque para deserializar Jackson usa los <em>setters</em>. No sale, porque para serializar usa los <em>getters</em> y no hay ninguno.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Puedes relacionar método, ruta, parámetros, cabeceras y cuerpo con su origen; distinguir JSON mal formado, conversión incompatible y datos incompletos; y reproducir el contraste entre configuración tolerante y estricta. Las entidades admiten la lista y la fecha previstas. Conserva las peticiones que demuestran los resultados y publica los cambios mediante una PR.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Sesión 6 · Escrituras y respuestas HTTP

**Punto de partida.** Tu CRUD conserva datos en memoria y ya permite crear, consultar, sustituir y borrar. Hoy añadirás PATCH y ajustarás los códigos de respuesta. Continúa sobre las dos entidades de tu proyecto; `Tarea` y `Proyecto` son los ejemplos para trasladar el procedimiento a tu dominio.

### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

#### Efecto de una petición y significado de su respuesta

Una operación **segura** tiene semántica de consulta: el cliente no solicita cambiar el recurso. GET es seguro, aunque el servidor pueda registrar la petición en un log. Una operación **idempotente** deja el mismo efecto solicitado al repetir una petición idéntica. Las respuestas pueden ser distintas: borrar un elemento y volver a borrarlo deja el recurso ausente en ambos casos.

| Método | Efecto en nuestro CRUD | Al repetir la misma petición |
| --- | --- | --- |
| GET | Consulta | No modifica el recurso. |
| POST | Crea un registro con id asignado | Crea otro registro; esta implementación no es idempotente. |
| PUT | Sustituye los campos editables | Deja la misma representación; es idempotente. |
| PATCH | Modifica los campos indicados | Depende de la operación: asignar una prioridad se puede repetir; incrementar un contador cambia de nuevo el resultado. |
| DELETE | Elimina el registro | Lo deja ausente; es idempotente. |

Si se pierde una respuesta, el cliente puede necesitar reintentar. La idempotencia permite razonar sobre ese reintento, pero no significa que todos los clientes repitan automáticamente las peticiones.

**PUT** representa una sustitución completa de los datos editables acordados. En nuestro código, los campos omitidos quedan con los valores por defecto del objeto recibido. Más adelante rechazaremos una representación incompleta mediante validación. **PATCH** expresa una modificación parcial: esta primera implementación solo cambiará título y prioridad cuando reciba un valor no nulo.

#### Estado, cabeceras y cuerpo con ResponseEntity

Hasta ahora varios métodos devuelven un objeto o `null`, y Spring responde 200 incluso cuando no encuentran el recurso. **`ResponseEntity`** permite decidir el código, las cabeceras y el cuerpo. Un **contrato HTTP** describe qué debe observar el cliente en cada caso.

| Construcción | Resultado |
| --- | --- |
| `ResponseEntity.ok(objeto)` | 200 con cuerpo. |
| `ResponseEntity.notFound().build()` | 404 sin cuerpo. |
| `ResponseEntity.created(uri).body(objeto)` | 201 con cuerpo y cabecera `Location`. |
| `ResponseEntity.noContent().build()` | 204 sin cuerpo. |

`Location` indica la dirección del recurso recién creado. El cliente puede utilizarla en un GET sin construir esa URL por su cuenta. `body(...)` incorpora el cuerpo; `build()` termina una respuesta que no lo necesita. El tipo `ResponseEntity<Tarea>` indica el tipo del cuerpo y `ResponseEntity<Void>` expresa que no se devuelve uno.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación y comprobación del contrato</p>

Los pasos reparten el trabajo en 10, 20, 25, 20, 15, 30 y 20 minutos. Son orientativos. Antes de editar, prepara una issue y una rama desde `main` actualizada, siguiendo el flujo de Intermodular. Conserva los cambios en esa rama hasta su revisión.

#### Paso 1 · Preparar los datos y observar el contrato actual · 10 min

1. Arranca el backend y crea dos registros distintos. Anota sus ids reales: no supongas que son 1 y 2.
2. Consulta uno de ellos y otro id que hayas comprobado que no existe. Anota estado y cuerpo.
3. Conserva una petición PUT con todos los campos editables. Incluye los campos añadidos en la sesión 5 si forman parte de tu modelo.

#### Paso 2 · Diferenciar sustitución y modificación parcial · 20 min

Sobre un registro de prueba, envía un PUT solo con `titulo`. Consulta después el registro: otros campos han vuelto a sus valores por defecto. Restáuralo con el PUT completo antes de probar PATCH.

Añade este método dentro de `TareaController` e importa `org.springframework.web.bind.annotation.PatchMapping`. Las demás anotaciones ya se utilizan en el controlador:

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

Guarda, reinicia, recrea los datos y envía `{"titulo":"Título corregido"}` con PATCH a un id existente. El GET posterior debe conservar la prioridad anterior. Comprueba también `{"prioridad":"baja"}`.

<div class="rule">
  <p class="rule-label">Límites del PATCH inicial</p>
  <p>Este método modifica solo los campos de texto mostrados. Un campo omitido y uno enviado como <code>null</code> se interpretan igual: no se cambian. Tampoco permite modificar <code>completada</code>, porque el tipo primitivo <code>boolean</code> no distingue omisión de <code>false</code>. En la sesión 11 un DTO con <code>Boolean</code> resolverá esa segunda limitación; distinguir un nulo explícito requerirá además registrar la presencia del campo.</p>
</div>

#### Paso 3 · Devolver 200 o 404 según la existencia · 25 min

Importa `org.springframework.http.ResponseEntity`. Sustituye el método de detalle por este, manteniendo una única ruta GET de detalle:

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

Comprueba un id existente y uno ausente. Después adapta **todas las salidas** del PUT y del PATCH: cambia su retorno a `ResponseEntity<Tarea>`, envuelve el resultado encontrado con `ResponseEntity.ok(...)` y sustituye el `return null` final por `ResponseEntity.notFound().build()`.

En PUT conserva `datos.setId(id)` antes de sustituir el registro. En PATCH conserva las condiciones que dejan intactos los campos no enviados. No cambies el GET de listado: una lista vacía sigue respondiendo 200 con `[]`.

**Comprueba:** GET de detalle, PUT y PATCH responden 404 para un id ausente y no crean registros por accidente.

#### Paso 4 · Crear con 201 y Location · 20 min

Sustituye el POST existente por esta versión. Conserva una sola lista y un solo contador en la clase. Añade los imports `java.net.URI` y `org.springframework.web.servlet.support.ServletUriComponentsBuilder`:

```java
@PostMapping(consumes = "application/json", produces = "application/json")
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

El constructor toma la URL de la petición y añade el id. Conservamos `consumes` y `produces` de la sesión 5. Tras guardar y reiniciar, crea un registro: debe responder 201 y devolver un id asignado. Abre **Headers de la respuesta**, copia `Location` y úsala en un GET. Debes recuperar el mismo registro.

#### Paso 5 · Borrar con una respuesta sin cuerpo · 15 min

Sustituye el DELETE anterior e importa `DeleteMapping` si falta:

```java
@DeleteMapping("/{id}")
public ResponseEntity<Void> eliminar(@PathVariable(name = "id") int id) {
    tareas.removeIf(tarea -> tarea.getId() == id);
    return ResponseEntity.noContent().build();
}
```

El contrato del ejemplo devuelve **204 también si el recurso ya estaba ausente**. Ejecuta DELETE dos veces y un GET después de cada borrado: los DELETE dan 204 sin cuerpo y los GET dan 404. Otra API puede elegir 404 en el segundo DELETE sin dejar de ser idempotente; para nuestras pruebas mantendremos el contrato del ejemplo.

<details class="aside aside--extra">
  <summary>Comparar con una respuesta fija mediante anotación</summary>
  <p><code>@ResponseStatus(HttpStatus.NO_CONTENT)</code>, con los imports de <code>ResponseStatus</code> y <code>HttpStatus</code>, puede fijar 204 en un método DELETE que devuelva <code>void</code>. <code>ResponseEntity</code> resulta útil cuando el método decide entre resultados o incluye cabeceras. Conserva una única implementación de cada ruta; no añadas otra ruta para probar esta alternativa.</p>
</details>

#### Paso 6 · Aplicar el contrato a la segunda entidad · 30 min

Trabaja sobre la segunda entidad de tu dominio, sin empezar otro proyecto. Adapta sus operaciones una a una y prueba cada cambio antes de continuar:

| Operación | Resultado que debes observar |
| --- | --- |
| Listado, con o sin filtro | 200 y un array, también cuando está vacío. |
| Detalle existente / ausente | 200 con objeto / 404 sin cuerpo. |
| Creación | 201 con objeto, id asignado y Location utilizable. |
| PUT existente / ausente | 200 con representación sustituida / 404. |
| PATCH existente / ausente | 200 con los campos admitidos modificados / 404. |
| DELETE, incluido el repetido | 204 sin cuerpo. |

Si su CRUD estaba incompleto, termina primero el método pendiente con el patrón de la sesión 4. Aplica PATCH a campos de referencia que puedan omitirse; declara qué campos siguen sin admitirse en esta versión.

#### Paso 7 · Comprobar repeticiones y revisar la propuesta · 20 min

1. Crea un registro de prueba y conserva su id. Repite el mismo PUT completo dos veces y consulta después de cada envío: el resultado debe ser equivalente.
2. Repite un PATCH con la misma asignación de texto. Comprueba que no modifica los otros campos.
3. Envía dos POST con el mismo contenido. Consulta ambos ids: son dos registros diferentes en esta implementación.
4. Borra los registros creados. Repite un DELETE y comprueba estado, cuerpo y ausencia con GET.
5. Publica la rama y abre su PR. Tu pareja ejecuta las peticiones sobre esa rama; integra tras atender la revisión. Los estados correctos no sustituyen la comprobación del contenido.

#### Ampliación si has completado el trabajo

**Diagnóstico de una regresión.** En una rama local de prueba, cambia el borrado para que no elimine nada pero siga devolviendo 204. Escribe qué petición detecta el fallo y qué comprobaría una prueba que solo mirase el estado. Restituye el método y verifica la recuperación. No integres la avería.

**Diseño de una operación propia.** Elige una acción real de tu proyecto, como reasignar una reserva o archivar un elemento. Define método, ruta, cuerpo y efecto de repetirla. Implementa una asignación simple con los recursos actuales y compruébala; no añadas autenticación ni nuevas entidades para este ejercicio.

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

Al terminar, las dos entidades responden según la tabla del contrato. Puedes mostrar un alta con 201 y Location, una ausencia con 404 y un borrado con 204 sin cuerpo. PUT y PATCH tienen efectos distintos comprobados mediante un GET posterior. La limitación de PATCH está identificada y el cambio está revisado en el repositorio.

<dl class="answer">
  <dt>¿Qué diferencia hay entre repetir el efecto de una operación y repetir su código de respuesta?</dt>
  <dd></dd>
  <dt>¿Qué comprobarías para demostrar que un 204 corresponde a un borrado real?</dt>
  <dd></dd>
  <dt>¿Qué permite hacer Location al cliente y qué campos no admite todavía tu PATCH?</dt>
  <dd></dd>
</dl>

## Semana 4 · Colección ejecutable y entornos

## Sesión 7 · Colección ejecutable y entornos

**Punto de partida.** Continúas con el contrato HTTP de la sesión 6: 201 y Location al crear, 404 para un detalle ausente y 204 al borrar. Hoy convertirás las peticiones en una colección que prepare sus datos, compruebe resultados y pueda repetirse. No necesitas crear otra API.

### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

#### De una petición manual a una prueba repetible

Una **colección** organiza peticiones guardadas. Una **aserción** compara un resultado observado con uno esperado y falla si no coincide. Un conjunto de peticiones solo constituye una prueba útil cuando sus aserciones comprueban lo que promete el contrato: estado, datos y efectos posteriores.

Una **regresión** es un comportamiento que funcionaba y deja de hacerlo después de un cambio. Por ejemplo, un DELETE podría seguir respondiendo 204 aunque ya no borrase nada. Un GET posterior al borrado permite detectar ese fallo.

#### Variables, entorno y datos de prueba

Una variable guarda un valor con nombre. `{{baseUrl}}` sustituye la dirección del backend y `{{tareaId}}` el identificador que acaba de devolver un POST. Así la prueba utiliza sus propios datos en lugar de depender del registro 1.

Un **entorno** agrupa valores de configuración: hoy `baseUrl` será `http://localhost:8080`. Cambiar de puerto solo requerirá modificar ese valor. La colección seguirá teniendo las mismas rutas y comprobaciones.

<figure class="diagram">
  <figcaption>Escenario que prepara y comprueba sus propios datos</figcaption>
  <ol class="flow">
    <li>Crear registros y guardar sus ids</li>
    <li>Consultar y comprobar los datos</li>
    <li>Modificar y volver a consultar</li>
    <li>Borrar y comprobar la ausencia</li>
    <li>Repetir sin depender de la ejecución anterior</li>
  </ol>
</figure>

### Se trabaja

<p class="stage stage--guided">140 minutos · colección, aserciones y diagnóstico</p>

Dedica aproximadamente 15 minutos a preparar la herramienta, 15 al entorno, 25 al encadenamiento, 30 a las aserciones, 20 a ejecutar y depurar, 20 a probar una regresión y 15 a comprobar la reproducción desde otra copia. Continúa usando una rama y una PR para los cambios del proyecto.

#### Paso 1 · Preparar la colección · 15 min

**Si utilizas Postman:** el cliente ligero sin cuenta de la sesión 3 permite enviar peticiones, pero para organizar colecciones y entornos necesitas iniciar sesión y entrar en un *workspace*, o espacio de trabajo. Sigue la [guía de cuenta de Postman](https://learning.postman.com/docs/getting-started/installation/account/sign-up-for-postman/). Crea un espacio personal y utiliza **New → Collection** para crear una colección con el nombre de tu proyecto. Guarda allí las peticiones anteriores mediante **Save**. Si empezaste sin cuenta, puedes trasladar el historial al espacio de trabajo al iniciar sesión.

**Si utilizas Bruno:** selecciona **Create Collection**, escribe el nombre del proyecto y elige una carpeta dentro de su repositorio. Crea las peticiones con **New Request**, elige método y URL y guárdalas. Los archivos de la colección permanecen en esa carpeta. Sigue los bloques de Bruno de esta sesión: sus scripts no utilizan la API `pm` de Postman.

Elige una herramienta y completa todo el escenario con ella. Crea una carpeta por entidad y utiliza nombres como «Crear tarea de prueba» o «Consultar tarea borrada». Arranca el backend y comprueba manualmente una creación y su consulta antes de automatizarlas.

#### Paso 2 · Definir y seleccionar el entorno · 15 min

1. En Postman, abre **Environments**, crea uno llamado `Local` y añade `baseUrl` con valor `http://localhost:8080`. Guarda y selecciónalo en el selector de entorno.
2. En Bruno, utiliza el selector **Environment → Configure**, crea `Local`, añade la misma variable, guarda y selecciona ese entorno.
3. Sustituye el inicio de cada URL por `{{baseUrl}}`. El listado queda como `{{baseUrl}}/tareas`, adaptado al nombre de tu recurso.
4. Envía el listado. Si la variable no se resuelve, comprueba su nombre, el entorno seleccionado y que has guardado el valor.
5. Para comprobar que se aplica, añade temporalmente `server.port=8081` en `application.properties`, reinicia y cambia solo `baseUrl` a `http://localhost:8081`. Repite el GET y restaura después el puerto y el entorno a 8080.

#### Paso 3 · Guardar el identificador devuelto · 25 min

Crea una petición POST llamada «Crear tarea A», con cuerpo JSON de prueba:

```json
{
  "titulo": "Prueba A de la colección",
  "prioridad": "alta",
  "completada": false
}
```

Adapta campos y valores a tu dominio. Guarda antes de enviar. El cuerpo de la petición contiene datos; el script que lee la respuesta se coloca en otra sección.

En **Postman → Scripts → Post-response**, escribe:

```javascript
pm.collectionVariables.unset("tareaId");
if (pm.response.code === 201) {
    pm.collectionVariables.set("tareaId", pm.response.json().id);
}
```

En **Bruno → Script → Post Response**, utiliza en su lugar:

```javascript
bru.setVar("tareaId", "");
if (res.getStatus() === 201) {
    bru.setVar("tareaId", res.getBody().id);
}
```

Se borra el valor anterior para no reutilizar un id antiguo si el alta falla. Envía el POST y localiza `tareaId` en las variables de colección de Postman o en las variables de ejecución de Bruno. Crea una petición GET con `{{baseUrl}}/tareas/{{tareaId}}`: debe devolver el registro A.

Duplica el alta para crear «Tarea B», con un título distinto. Cambia su script para guardar **`tareaBId`**, sin sobrescribir `tareaId`. Tener dos registros permite detectar un controlador que devuelve siempre el primero en lugar del solicitado.

#### Paso 4 · Añadir comprobaciones automáticas · 30 min

En el POST de A, añade estas pruebas debajo del script de captura en **Postman → Post-response**:

```javascript
pm.test("Creación con 201", function () {
    pm.response.to.have.status(201);
});
pm.test("Id asignado y contenido esperado", function () {
    const cuerpo = pm.response.json();
    pm.expect(cuerpo.id).to.be.above(0);
    pm.expect(cuerpo.titulo).to.equal("Prueba A de la colección");
});
pm.test("Incluye Location", function () {
    pm.expect(pm.response.headers.get("Location")).to.be.a("string").and.not.empty;
});
```

En **Bruno → Tests**, las pruebas equivalentes son:

```javascript
test("Creación con 201", function () {
    expect(res.getStatus()).to.equal(201);
});
test("Id asignado y contenido esperado", function () {
    expect(res.getBody().id).to.be.above(0);
    expect(res.getBody().titulo).to.equal("Prueba A de la colección");
});
test("Incluye Location", function () {
    expect(res.getHeaders().location).to.be.a("string").and.not.empty;
});
```

Una prueba tiene un nombre y una condición. `.equal(...)` compara valores; `.above(0)` exige un número positivo. Un fallo en una condición aparece en los resultados de pruebas de la respuesta. Para B, cambia el título esperado en su prueba y conserva su variable independiente.

**Comprueba también la identidad al consultar B.** En su GET, además de exigir 200, compara id y título. En Postman:

```javascript
pm.test("Devuelve exactamente B", function () {
    const cuerpo = pm.response.json();
    pm.expect(cuerpo.id).to.equal(Number(pm.collectionVariables.get("tareaBId")));
    pm.expect(cuerpo.titulo).to.equal("Prueba B de la colección");
});
```

En Bruno:

```javascript
test("Devuelve exactamente B", function () {
    expect(res.getBody().id).to.equal(Number(bru.getVar("tareaBId")));
    expect(res.getBody().titulo).to.equal("Prueba B de la colección");
});
```

Construye las demás aserciones adaptando estos ejemplos. Un listado debe ser un array; en Postman se comprueba con `pm.expect(pm.response.json()).to.be.an("array")` y en Bruno con `expect(res.getBody()).to.be.an("array")`, dentro de una prueba con nombre.

En DELETE exige 204 y cuerpo vacío. Utiliza `pm.expect(pm.response.text()).to.equal("")` en Postman o `expect(res.getBody()).to.equal("")` en Bruno. No intentes interpretar ese cuerpo como JSON. Para el GET posterior al borrado, exige 404.

#### Paso 5 · Ejecutar el escenario completo · 20 min

Ordena estas peticiones en la carpeta de la entidad. Cada una debe contener sus propias aserciones; adapta los nombres de variables si tu recurso tiene otro nombre.

| Orden | Petición | Comprobación |
| --- | --- | --- |
| 1 | Listado | 200 y array; puede contener datos anteriores. |
| 2 | Crear A | 201, datos y Location; guardar `tareaId`. |
| 3 | Crear B | 201 y título distinto; guardar `tareaBId`. |
| 4 | Consultar B | 200, id y título de B, no de A. |
| 5 | PATCH de A con `{"prioridad":"baja"}` | 200 y prioridad modificada. |
| 6 | Consultar A | 200, prioridad baja y título original conservado. |
| 7 | POST con JSON mal formado, como `{"titulo":}` | 400; todavía no confundas JSON mal formado con `{}`, que se acepta hasta incorporar validación. |
| 8 | POST con texto y `Content-Type: text/plain` | 415. Revisa que no haya otra cabecera Content-Type activa. |
| 9 | Borrar A | 204 y cuerpo vacío. |
| 10 | Consultar A borrada | 404 usando el id capturado. |
| 11 | Borrar B | 204 y cuerpo vacío. |
| 12 | Consultar B borrada | 404. |

En Postman utiliza **Run collection** y selecciona la carpeta y el orden; en Bruno, **Run** sobre la colección o carpeta y comprueba el orden antes de ejecutar. Guarda los scripts y las peticiones antes de iniciar el recorrido.

Ejecuta dos veces sin reiniciar el servidor. Los ids cambiarán, pero las comprobaciones deben seguir pasando. Reinicia y repite: la colección debe preparar sus datos desde la memoria vacía. Si un POST falla, localiza primero esa causa; no interpretes los errores posteriores de variables como averías independientes.

<div class="rule">
  <p class="rule-label">Alcance de un resultado correcto</p>
  <p>Un resultado verde solo cubre las aserciones ejecutadas. Si no comparas el título o no consultas después del borrado, esas propiedades quedan sin comprobar aunque todo aparezca en verde.</p>
</div>

#### Paso 6 · Demostrar que detecta regresiones · 20 min

En una rama local de diagnóstico, introduce **una avería cada vez**. No modifiques las aserciones para adaptarlas al fallo:

1. Cambia la creación para responder 200 en lugar de 201. Reinicia y ejecuta: debe fallar la aserción del alta.
2. Restituye el POST y comprueba la recuperación. Después quita temporalmente el borrado de la lista, conservando el 204. El GET posterior debe detectar que el recurso sigue existiendo.
3. Restituye DELETE y prueba que el detalle devuelva siempre la primera tarea. La consulta de B debe fallar al comparar identidad y contenido.
4. Restaura el código y ejecuta de nuevo. No integres las averías. Si una ejecución fallida dejó registros, bórralos mediante sus ids o reinicia este servidor en memoria antes de repetir la prueba.

Anota para cada avería qué aserción la detectó. Si alguna pasó inadvertida, añade una comprobación que observe el comportamiento que faltaba.

#### Paso 7 · Conservar y reproducir el trabajo · 15 min

En Postman, exporta la colección y el entorno local mediante sus opciones **Export** y conserva ambos en el repositorio. Incluye solo datos de prueba y la dirección local; los ids se capturan durante cada ejecución. En Bruno, guarda la colección y el entorno en su carpeta versionada. No basta con que existan únicamente en la herramienta de tu ordenador.

Comprueba desde otra copia del repositorio que se puede importar o abrir la colección, seleccionar `Local`, arrancar el backend y ejecutar el escenario. Explica esos pasos brevemente en el README. Publica la rama y solicita la revisión de las pruebas antes de integrar.

#### Ampliación si has completado el trabajo

Aplica el escenario a la segunda entidad utilizando variables distintas. Añade un PUT completo y comprueba que el GET posterior refleja todos sus campos editables. Diseña además un caso propio que la colección actual no detecte: escribe primero la aserción, provoca el fallo y verifica su corrección. Mantén todo en el mismo proyecto.

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

Al terminar, la colección prepara dos registros, usa sus ids reales, comprueba contenido y estados y elimina sus datos de prueba. Funciona dos veces seguidas y después de reiniciar. Puedes señalar una ejecución fallida por una regresión y su recuperación, y otra persona dispone de la colección y del entorno necesarios para reproducirla.

<dl class="answer">
  <dt>¿Por qué un GET de B detecta un error que consultar únicamente A podría ocultar?</dt>
  <dd></dd>
  <dt>¿Por qué no basta con comprobar el 204 de un DELETE?</dt>
  <dd></dd>
  <dt>¿Qué diferencia hay entre baseUrl y el identificador capturado después del POST?</dt>
  <dd></dd>
</dl>

## Sesión 8 · Contrato en memoria listo para evolucionar

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [enlaces rotos y formato](/es/docencia/proyecto-intermodular/ud2-que-lo-compruebe-la-maquina/sesion-4/). En Servidor continúas la implementación del mismo producto.

### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Llegas con dos entidades, sus operaciones CRUD y una colección que comprueba un escenario completo. Hoy conectarás las entidades: consultarás los elementos que pertenecen a otro recurso y comprobarás que una persona puede utilizar esa versión desde tu repositorio.

#### Una relación en memoria

En el ejemplo, cada tarea guarda un `proyectoId`. Ese número identifica su proyecto: dos tareas con `proyectoId` igual a 7 pertenecen al mismo proyecto. Todavía no hay una base de datos que compruebe esa relación; el código tendrá que buscar y comparar los identificadores.

`GET /proyectos/7/tareas` requiere dos decisiones, en este orden:

1. Buscar el proyecto 7. Si no existe, responder `404`.
2. Si existe, seleccionar sus tareas. Devolver `200` con ellas, o con `[]` si no tiene ninguna.

Una lista vacía describe un proyecto existente sin tareas. Un `404` indica que no se ha encontrado el proyecto solicitado. Esta diferencia debe quedar en las pruebas.

#### Compartir las listas entre controladores

Hasta ahora cada controlador conserva su propia lista. La nueva consulta necesita leer proyectos y tareas a la vez. Crear otra lista en el controlador de proyectos no serviría: estaría vacía aunque el controlador de tareas ya hubiera guardado registros.

Vamos a reunir las dos listas en una clase `MemoriaProyecto`. La anotación `@Component` permite que Spring cree y gestione una instancia compartida de esa clase. Cada controlador la solicita mediante su constructor. Spring entrega la misma instancia a ambos: esta forma de recibir un objeto necesario se llama **inyección de dependencias**. En la UD4 estudiarás cómo organizar responsabilidades; hoy utilizamos este mecanismo únicamente para compartir los datos existentes.

La memoria sigue siendo temporal y se vacía al reiniciar. Tampoco garantiza escrituras simultáneas seguras. Esta versión permite aprender el contrato HTTP; la persistencia llegará en la UD5.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

Adapta `Proyecto`, `Tarea` y sus nombres de campos a la relación real de tu producto. Continúa en una rama de trabajo y conserva las operaciones ya comprobadas.

#### Paso 1 · Comprobar la versión anterior — 10 minutos

1. Arranca el backend y ejecuta la colección de la sesión 7.
2. Si falla, localiza la primera petición incorrecta y corrígela antes de cambiar el almacenamiento.
3. Identifica qué controlador guarda cada lista y qué entidad contiene la referencia a la otra. En el ejemplo será `Tarea.proyectoId`.

#### Paso 2 · Compartir los datos existentes — 25 minutos

1. Bajo tu paquete base, junto a `model` y `controller`, crea el paquete `memoria`.
2. Crea `MemoriaProyecto.java` con este contenido. Sustituye `com.ejemplo.gestor` por el paquete de tu aplicación.

```java
package com.ejemplo.gestor.memoria;

import com.ejemplo.gestor.model.Proyecto;
import com.ejemplo.gestor.model.Tarea;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class MemoriaProyecto {
    private final List<Proyecto> proyectos = new ArrayList<>();
    private final List<Tarea> tareas = new ArrayList<>();

    public List<Proyecto> getProyectos() { return proyectos; }
    public List<Tarea> getTareas() { return tareas; }
}
```

3. En `TareaController`, sustituye la declaración de su lista por este campo y constructor. Importa `MemoriaProyecto`. Conserva `siguienteId` y todos los métodos HTTP existentes.

```java
private final List<Tarea> tareas;

public TareaController(MemoriaProyecto memoria) {
    this.tareas = memoria.getTareas();
}
```

4. En `ProyectoController`, sustituye su lista por estos campos y constructor. Importa también `Tarea`, `List` y `MemoriaProyecto` si faltan.

```java
private final List<Proyecto> proyectos;
private final List<Tarea> tareas;

public ProyectoController(MemoriaProyecto memoria) {
    this.proyectos = memoria.getProyectos();
    this.tareas = memoria.getTareas();
}
```

5. Si ya había un constructor, incorpora estas asignaciones a ese constructor; no dejes dos formas distintas de construir el controlador. No conserves los antiguos `new ArrayList<>()` en esos campos ni escribas `new MemoriaProyecto()` en los controladores.
6. Reinicia y ejecuta la colección. Las rutas y respuestas anteriores deben seguir funcionando. Si aparece un error al crear el componente, comprueba que `memoria` está debajo del paquete de la clase con `@SpringBootApplication`.

#### Paso 3 · Consultar una relación — 30 minutos

1. Si `Tarea` no tiene la referencia, añade `private int proyectoId;` y los métodos `getProyectoId()` y `setProyectoId(int proyectoId)`. Si ya existe, reutilízala.
2. Permite enviarla en el POST. Si tu código guarda directamente el objeto recibido, Jackson ya la habrá asignado; si copia campos a otro objeto, añade esa copia. Conserva el identificador de la tarea asignado por el servidor.
3. En `ProyectoController`, que ya tiene `@RequestMapping("/proyectos")`, añade este método. Importa `ArrayList` y `ResponseEntity` si faltan.

```java
@GetMapping("/{id}/tareas")
public ResponseEntity<List<Tarea>> tareasDelProyecto(
        @PathVariable(name = "id") int id) {
    boolean existe = false;
    for (Proyecto proyecto : proyectos) {
        if (proyecto.getId() == id) {
            existe = true;
            break;
        }
    }
    if (!existe) {
        return ResponseEntity.notFound().build();
    }

    List<Tarea> resultado = new ArrayList<>();
    for (Tarea tarea : tareas) {
        if (tarea.getProyectoId() == id) {
            resultado.add(tarea);
        }
    }
    return ResponseEntity.ok(resultado);
}
```

4. Crea dos proyectos y una tarea vinculada al primero. Consulta las tareas de ambos: el primero debe devolver esa tarea y el segundo `[]`.
5. Borra el segundo proyecto y repite su consulta anidada: ahora debe responder `404`. Si devuelve `[]`, falta comprobar que el proyecto existe. Si ambos proyectos devuelven la misma tarea, revisa el filtro por `proyectoId`.

#### Paso 4 · Automatizar la relación y completar la cobertura — 30 minutos

1. Añade a la colección las altas de los dos proyectos. Captura sus ids en variables distintas, `proyectoId` y `proyectoVacioId`, siguiendo los scripts de la sesión 7.
2. En el JSON del alta de tarea usa `"proyectoId": {{proyectoId}}`. Las llaves se sustituyen antes del envío; sin comillas exteriores el valor será un número JSON.
3. Comprueba en la consulta del primer proyecto el estado `200`, la longitud del array y que la tarea tenga tanto el id esperado como el `proyectoId` correcto. No basta con comprobar que hay algún elemento.
4. Comprueba `200` y array vacío para el segundo proyecto. Bórralo y comprueba `404` en su consulta anidada.
5. Limpia primero la tarea creada y después su proyecto. Ejecuta la colección dos veces seguidas y una vez después de reiniciar. Cada ejecución prepara sus propios datos.
6. Completa las comprobaciones de ambas entidades con esta tabla. Una fila puede requerir varias peticiones. Reutiliza las ya guardadas; añade únicamente los casos que faltan.

| Operación | Resultado que debes comprobar |
| :--- | :--- |
| Listado y filtro opcional | `200`; todos sin filtro, solo coincidencias con filtro y `[]` si no hay resultados |
| Detalle | `200` con el id solicitado; `404` si no existe |
| POST | `201`, id asignado por el servidor y `Location` utilizable |
| PUT | `200` y sustitución de los campos editables; `404` si no existe |
| PATCH de los campos admitidos | `200`, cambio solicitado y conservación del resto; `404` si no existe |
| DELETE | `204` sin cuerpo; el recurso deja de aparecer al consultar |
| Consulta de la relación | Padre con elementos, padre vacío y padre inexistente diferenciados |

Mantén el PATCH limitado a los campos que implementaste en la sesión 6. El booleano opcional y la separación entre datos de entrada y salida se trabajan en la UD3.

#### Paso 5 · Reproducir el resultado desde otra copia — 25 minutos

1. Actualiza las instrucciones del repositorio: requisitos, comando de arranque, selección del entorno y ejecución de la colección. Incluye que los datos se pierden al reiniciar.
2. Explica brevemente las decisiones que afectan al cliente: `DELETE` devuelve `204` incluso si no existe; el servidor asigna el id al crear y la ruta determina el id al actualizar; Jackson queda en modo estricto; una relación vacía devuelve `[]`.
3. Guarda la colección y los cambios en tu rama, súbelos y abre o actualiza la PR. En otra carpeta clona el repositorio y selecciona esa rama, ya que puede no estar integrada todavía.
4. Arranca esa copia siguiendo sus instrucciones. Detén antes la primera aplicación para liberar el puerto 8080. Ejecuta la colección desde los archivos versionados.
5. Corrige cualquier paso que dependiese de una configuración no incluida en el repositorio. En la revisión de la PR, reproduce al menos una petición y contrasta la respuesta con el contrato.

#### Paso 6 · Identificar lo que falta — 20 minutos

Haz estas pruebas por separado de la colección de aceptación, que debe seguir reflejando el contrato actual. Anota el resultado real y la mejora necesaria. Limpia los registros de prueba al acabar.

| Prueba | Limitación actual | Siguiente trabajo |
| :--- | :--- | :--- |
| Crear con `{}` | Puede guardar datos incompletos | Validación en la UD3 |
| Crear con una prioridad no prevista | No comprueba valores de negocio | Validación en la UD3 |
| Crear con un id de padre inexistente | No comprueba aún la referencia al guardar | Comprobación de la relación en la UD3 |
| Observar un `400` | El error aún no sigue un formato propio | Errores comunes en la UD3 |
| Añadir un campo interno con getter | Puede aparecer en el JSON público | DTO en la UD3 |
| Reiniciar | Se pierden los registros | Persistencia en la UD5 |

#### Ampliación si has completado el trabajo

Añade una tarea al segundo proyecto y comprueba que las consultas de ambos siguen separadas. Modifica después la referencia de una tarea mediante un PUT completo: debe desaparecer de una consulta y aparecer en la otra. Incorpora estas comprobaciones a la colección y conserva la limpieza de los datos.

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:** ambas entidades mantienen su CRUD, los controladores comparten la misma memoria y la consulta de la relación distingue los tres casos previstos. La colección se puede repetir desde otra copia del repositorio. Puedes explicar dónde se comprueba la existencia del padre, cómo se filtran sus elementos y qué limitaciones siguen pendientes.


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

> **El código de estado no constituye un detalle de la respuesta, sino la parte sobre la que el cliente decide. Un `200` es una afirmación, y afirmar que todo ha ido bien cuando no has encontrado nada es mentir con buena sintaxis.**

De ahí sale el resto de la unidad. Por eso un recurso ausente es `404` y una lista vacía no lo es, por eso crear devuelve `201` y dice dónde, por eso borrar devuelve `204`, y por eso hoy sabes que un cuerpo incompleto que devuelve `200` es un problema aunque no lance ninguna excepción.

<p class="term">Un contrato es lo que prometes, no lo que te sale</p>

Tu API promete unas rutas, unos formatos y unos códigos. Mientras eso se cumpla, quien te consume puede confiar. La colección de la sesión 7 existe justamente para demostrar cada día que la promesa sigue en pie.

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
3. No aparece la línea `Mapped to` en el registro. ¿Qué comprobarías antes de concluir que no se ha seleccionado el método?
4. ¿Qué fase produce un `404`, cuál un `405`, cuál un `415` y cuál un `406`?
5. ¿Cómo distinguirías un 406 producido al seleccionar la ruta de uno producido al convertir la respuesta?
6. ¿De dónde puede salir cada parámetro de un método de controlador?
7. ¿Recorre Jackson las claves del JSON o los campos de tu clase, y qué consecuencia tiene?
8. Diferencia entre un cuerpo inválido y uno incompleto. ¿Quién resuelve cada uno?
9. ¿Por qué el endpoint espejo acepta `{}` con 200 y rechaza `{,}` con 400? ¿Qué código devuelve ahora el POST de creación cuando acepta un cuerpo?
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
20. ¿Por qué una colección repetible captura el id devuelto, aunque una prueba aislada con contador recién iniciado pueda esperar un número concreto?

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

Tienes los seis motivos delante, todos comprobados por ti en la sesión 8:

| Lo que tu API sigue haciendo mal | Se arregla en |
| :--- | :--- |
| Acepta una tarea sin título, sin prioridad y sin nada | UD3, con validación |
| Acepta una tarea de un proyecto que no existe | UD3 |
| Sus errores no explican qué hay que corregir | UD3, con errores coherentes |
| Publica el modelo interno íntegro, sin decidir qué campos salen | UD3, con DTO |
| Sus rutas las has ido nombrando por intuición | UD3, con diseño orientado a recursos |
| Al reiniciar se pierde todo | UD5, con PostgreSQL |

El trabajo de estas dos semanas demuestra aquí su utilidad: cuando en la UD3 aparezcan los DTO, las anotaciones de validación y el manejador de errores, **no serán temas nuevos**. Serán las respuestas a seis problemas que ya has visto fallar, con una colección lista para demostrar que se han arreglado.

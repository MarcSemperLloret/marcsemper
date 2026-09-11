---
title: "Integraciones externas"
label: "UD10 · Ampliar"
section: "ud-10"
order: 10
lang: "es"
summary: "Conectar el backend con servicios que no controlamos y diseñar el comportamiento cuando la red, el proveedor o los datos no responden como se esperaba."
duration: "12 horas · 2 semanas · 4 sesiones de 3 h"
modality: "Taller de proyecto · 25 min de explicación, 140 min de trabajo y 15 min de cierre"
deliverable: "Integraciones externas y gestión de archivos verificadas, incluidos sus casos de fallo."
date: "2026-09-09"
outcomes:
  - "Consumir una API externa mediante un cliente HTTP."
  - "Aislar contratos externos con DTO propios."
  - "Tratar timeouts, errores y servicios no disponibles."
  - "Subir y descargar ficheros e integrar correo o webhooks."
requirements:
  - "La aplicación segura de la UD9."
  - "Acceso a una API pública adecuada para docencia."
priorKnowledge:
  - "DTO, servicios, errores centralizados y REST."
  - "Autenticación y configuración externa."
---

<p class="lead">El backend se conecta con servicios externos e incorpora ficheros y comunicación. Cada integración debe responder a un caso de uso del producto y contemplar fallos.</p>

## Semana 21 · Consumir un servicio externo

## Sesión 41 · Consumir un servicio externo

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [publicar el acceso con jwt sin perder permisos](/es/docencia/proyecto-intermodular/ud10-comprobar-las-integraciones/sesion-21/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Hasta ahora tu backend respondía a otros programas. Hoy también actuará como cliente de un servicio externo. RestClient envía peticiones HTTP desde Java; un DTO externo representa la respuesta del proveedor y un adaptador la convierte al formato propio de tu producto.

#### El backend deja de ser una isla solitaria

Hasta este punto del curso, tu aplicación backend siempre ha sido el **servidor**: esperaba pasivamente en el puerto `8080` a que un navegador o Bruno le enviaran peticiones HTTP para consultar la base de datos local de PostgreSQL.

En el desarrollo empresarial moderno ningún backend vive aislado:
* Para enviar facturas electrónicas, consulta la API de Hacienda o de un proveedor tributario.
* Para cobrar una suscripción, invoca la API de Stripe o PayPal.
* Para planificar obras o tareas en exteriores en nuestro gestor de proyectos, necesita consultar un **servicio meteorológico externo** o verificar commits en la API de **GitHub**.

<figure class="diagram">
  <figcaption>El backend actuando como cliente HTTP saliente</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Cliente Web / Móvil</li>
    <li>Backend Spring Boot (8080)</li>
    <li>Petición HTTP saliente</li>
    <li>API Externa (Open-Meteo / GitHub)</li>
  </ol>
</figure>

#### Clientes HTTP en Spring Boot: de RestTemplate a RestClient

En el ecosistema Java y Spring han existido tres generaciones de clientes HTTP:

| Cliente HTTP | Estado actual | Estilo de programación | Uso recomendado |
| :--- | :--- | :--- | :--- |
| **`RestTemplate`** | En mantenimiento (desde Spring 5). | Imperativo y rígido (`getForObject`, `exchange`). | Aplicaciones legadas previas a Spring Boot 3. |
| **`WebClient`** | Activo y potente. | Reactivo no bloqueante (Project Reactor / WebFlux). | Aplicaciones asíncronas con flujos reactivos de alta concurrencia. |
| **`RestClient`** | **El estándar moderno (Spring Boot 3.2+).** | **Fluido, declarativo y síncrono.** | **La opción recomendada para el 95 % de APIs REST empresariales en Spring MVC.** |

`RestClient` combina la sencillez síncrona de `RestTemplate` con la elegancia y expresividad de la interfaz fluida de `WebClient`, sin necesidad de arrastrar la complejidad reactiva de WebFlux.

#### El peligro mortal: Acoplar tu dominio a una API externa

En el trabajo anterior devolvimos un `String` con el JSON crudo de Open-Meteo. Aunque sirvió para ver que la red funcionaba, **hacer eso en una aplicación real es un antipatrón arquitectónico gravísimo**:

```json
{
  "latitude": 39.4699,
  "longitude": -0.3763,
  "generationtime_ms": 0.04100799560546875,
  "utc_offset_seconds": 0,
  "timezone": "GMT",
  "timezone_abbreviation": "GMT",
  "elevation": 15.0,
  "current_weather": {
    "temperature": 22.4,
    "windspeed": 14.8,
    "winddirection": 180,
    "weathercode": 0,
    "is_day": 1,
    "time": "2026-09-02T12:00"
  }
}
```

Si este JSON se devuelve al cliente web o se almacena sin transformar en la base de datos:
1. **Tu frontend se acopla a las decisiones de un tercero:** Si Open-Meteo cambia `windspeed` por `wind_speed_kmh`, tu pantalla de React/Angular deja de mostrar el viento.
2. **Contaminas tu arquitectura con ruido:** A tu gestor de proyectos no le importa `generationtime_ms` ni `utc_offset_seconds`.
3. **Pérdida de semántica de negocio:** El código `weathercode: 0` es un número incomprensible; tu usuario necesita ver *"Cielo despejado"*.

<div class="rule">
  <p class="rule-label">El principio de la Capa Anticorrupción (ACL)</p>
  <p><strong>Ningún contrato externo debe cruzar la frontera de tu servicio de integración.</strong></p>
  <p>Los datos ajenos deben recibirse en <strong>DTOs Externos</strong> (propios del proveedor) y traducirse inmediatamente a <strong>Modelos Propios</strong> antes de entregarse a la capa de negocio.</p>
</div>

#### La arquitectura de aislamiento

<figure class="diagram">
  <figcaption>Aislamiento con Capa Anticorrupción (ACL)</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>API Externa (Open-Meteo JSON)</li>
    <li>DTO Externo (OpenMeteoResponse)</li>
    <li>Adaptador / Mapeador</li>
    <li>DTO Interno del Dominio (ClimaProyectoResponse)</li>
    <li>Controlador / Frontend</li>
  </ol>
</figure>

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre una operación del servicio donde tenga sentido consultar información externa. El ejemplo meteorológico sirve de referencia; justifica su uso o el servicio equivalente en tu dominio.
2. Localiza la configuración de la URL del proveedor y crea el paquete de integración separado de los controladores públicos.
3. Consulta primero la respuesta externa de ejemplo y anota sus campos y unidades. Decide cuáles necesita realmente tu aplicación.

#### Paso 2 · La API externa de pruebas: Open-Meteo

Para aprender integración utilizaremos la API pública de **Open-Meteo** ([open-meteo.com](https://open-meteo.com)):
* Es completamente gratuita y abierta para uso formativo y de desarrollo.
* **No requiere clave de API (*API key*)**: elimina barreras de registro y credenciales en las primeras prácticas.
* Devuelve datos reales de previsión meteorológica a partir de coordenadas geográficas:
  `https://api.open-meteo.com/v1/forecast?latitude=39.47&longitude=-0.38&current_weather=true`

#### Paso 3 · Configuración y primer cliente con RestClient

Primero ejecuta la URL externa en el cliente HTTP y guarda una respuesta de ejemplo: es tu referencia para los nombres y tipos. Crea después `config/RestClientConfig.java`, `integration/ClimaExternoClient.java` y `controller/ProyectoClimaController.java`, cada bloque en su archivo. Arranca al completar sus dependencias y llama a la ruta de diagnóstico. Esa ruta muestra el transporte; todavía debes conectar la existencia y las coordenadas del proyecto en los pasos siguientes.

```text
GET https://api.open-meteo.com/v1/forecast?latitude=39.47&longitude=-0.38&current_weather=true
```

Recibirás algo parecido a esto:

```json
{
  "latitude": 39.5,
  "longitude": -0.375,
  "generationtime_ms": 0.0349,
  "utc_offset_seconds": 0,
  "timezone": "GMT",
  "elevation": 16.0,
  "current_weather": {
    "temperature": 18.4,
    "windspeed": 11.2,
    "winddirection": 91,
    "weathercode": 3,
    "is_day": 1,
    "time": "2026-03-12T09:00"
  }
}
```

Anota tres cosas, porque las tres condicionan todo lo que viene después:

1. **El proveedor decide los nombres.** `windspeed` va en una palabra, `current_weather` en `snake_case`, `weathercode` es un número y no un texto. Tú no eliges nada de eso y puede cambiar sin avisarte.
2. **Viene mucho más de lo que necesitas.** De ese objeto entero, a tu gestor de proyectos le interesan dos campos.
3. **Tarda.** Fíjate en el tiempo que marca tu cliente HTTP: unas décimas de segundo. Comparado con los milisegundos de una consulta a tu PostgreSQL local, es una eternidad, y ese tiempo se lo vas a añadir a cada petición que lo use.

Configuramos un `@Bean` de `RestClient` en una clase de configuración:

```java
package com.ejemplo.gestor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Value("${app.integraciones.open-meteo.base-url:https://api.open-meteo.com}")
    private String openMeteoBaseUrl;

    @Bean
    public RestClient openMeteoRestClient() {
        return RestClient.builder()
            .baseUrl(openMeteoBaseUrl)
            .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
            .defaultHeader(HttpHeaders.USER_AGENT, "GestorProyectosBackend/1.0 (formacion-dam)")
            .build();
    }
}
```

Creamos un servicio que efectúa la llamada saliente mediante la API fluida de `RestClient`:

```java
package com.ejemplo.gestor.integration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ClimaExternoClient {

    private static final Logger log = LoggerFactory.getLogger(ClimaExternoClient.class);
    private final RestClient openMeteoRestClient;

    public ClimaExternoClient(RestClient openMeteoRestClient) {
        this.openMeteoRestClient = openMeteoRestClient;
    }

    public String obtenerClimaCrudo(double latitud, double longitud) {
        log.info("Iniciando petición HTTP saliente a Open-Meteo para lat={}, lon={}", latitud, longitud);
        long inicioMs = System.currentTimeMillis();

        String respuestaJson = openMeteoRestClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/v1/forecast")
                .queryParam("latitude", latitud)
                .queryParam("longitude", longitud)
                .queryParam("current_weather", true)
                .build())
            .retrieve()
            .body(String.class);

        long duracionMs = System.currentTimeMillis() - inicioMs;
        log.info("Respuesta recibida de Open-Meteo en {} ms. Longitud: {} caracteres", duracionMs, respuestaJson.length());

        return respuestaJson;
    }
}
```

```java
package com.ejemplo.gestor.controller;

import com.ejemplo.gestor.integration.ClimaExternoClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/proyectos")
public class ProyectoClimaController {

    private final ClimaExternoClient climaExternoClient;

    public ProyectoClimaController(ClimaExternoClient climaExternoClient) {
        this.climaExternoClient = climaExternoClient;
    }

    @GetMapping(value = "/{id}/clima-raw", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> consultarClimaRaw(
            @PathVariable Long id,
            @RequestParam(defaultValue = "39.4699") double lat,
            @RequestParam(defaultValue = "-0.3763") double lon) {

        String jsonCrudo = climaExternoClient.obtenerClimaCrudo(lat, lon);
        return ResponseEntity.ok(jsonCrudo);
    }
}
```

<dl class="worked">
  <dt>Por qué el <code>RestClient</code> es un <code>@Bean</code> y no un <code>new</code></dt>
  <dd>Por lo mismo por lo que en la UD4 dejaste de hacer <code>new TareaRepositorio()</code>: el destino, las cabeceras y —en la sesión 42— los timeouts son configuración, y la configuración se declara una vez en un sitio y se inyecta. Además te permitirá sustituirlo por un doble en los tests sin tocar el servicio.</dd>
  <dt>Por qué de momento devolvemos <code>String</code></dt>
  <dd>Es deliberado y dura una sola sesión. En esta sesión interesa observar el JSON externo en su forma original, con todos sus campos y su nomenclatura propia. En la sesión 41 ese <code>String</code> se convierte en un DTO propio, y entenderás la diferencia mucho mejor habiendo visto antes el volcado crudo.</dd>
  <dt><code>.retrieve().body(...)</code></dt>
  <dd><code>retrieve()</code> ejecuta la petición y <code>body()</code> deserializa la respuesta al tipo que le pidas. Con <code>String</code> no deserializa nada: te entrega el texto. Ojo, <code>retrieve()</code> lanza excepción ante un <code>4xx</code> o <code>5xx</code> remoto, y eso hoy todavía no lo estamos tratando: es justo el tema de la sesión 42.</dd>
  <dt>La cabecera <code>User-Agent</code></dt>
  <dd>No es decorativa. Muchos proveedores rechazan o limitan peticiones anónimas, y algunos (GitHub, sin ir más lejos) devuelven <code>403</code> si no la envías. Identificar tu cliente es una cortesía que además evita bloqueos.</dd>
</dl>

#### Paso 4 · Comprobar parámetros y respuesta de la integración HTTP

1. **Arranca la aplicación Spring Boot.**
2. **Abre Bruno y lanza:**
   `GET http://localhost:8080/api/v1/proyectos/1/clima-raw?lat=39.4699&lon=-0.3763`
3. **Observa la respuesta:**
   Recibes un JSON real emitido por los servidores de Open-Meteo con temperatura, velocidad de viento y código del tiempo.
4. **Inspecciona la consola de Spring Boot:**
   ```text
   INFO : Iniciando petición HTTP saliente a Open-Meteo para lat=39.4699, lon=-0.3763
   INFO : Respuesta recibida de Open-Meteo en 214 ms. Longitud: 382 caracteres
   ```
   Comprueba cómo tu backend tardó más de 200 ms: ese tiempo no fue CPU local, fue el tiempo que tardó el paquete IP en viajar por Internet, cruzar routers, ser procesado por el proveedor remoto y volver.

5. **Mide el coste de la integración:** lanza `GET /api/v1/proyectos/1` (el endpoint normal, sin clima) y compara el tiempo que marca tu cliente HTTP con el de `/clima-raw`. La diferencia es lo que cuesta salir a Internet, y es el número que justifica toda la sesión 42.

#### Paso 5 · Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| `UnknownHostException: api.open-meteo.com` | No hay salida a Internet | Proxy del centro o firewall. Comprueba primero que la URL del paso 1 funciona en el navegador |
| `404 Not Found` desde Open-Meteo | La ruta está duplicada o incompleta | Si el `baseUrl` ya trae `https://api.open-meteo.com`, el `path` debe ser `/v1/forecast`, ni `/forecast` ni la URL entera |
| `Parameter 'openMeteoRestClient' not found` | Hay más de un bean `RestClient` | Inyecta por nombre exacto, o marca uno con `@Qualifier` |
| La respuesta llega vacía o `null` | Faltan parámetros obligatorios | Open-Meteo exige `latitude` y `longitude`; sin `current_weather=true` no devuelve el bloque que buscas |
| Tarda muchísimo y acaba colgado | No hay timeout configurado | Es correcto: todavía no lo has puesto. Ese es exactamente el problema de la sesión 42 |

#### Paso 6 · Parametrizar la ubicación de la sede del proyecto

En lugar de pasar las coordenadas por parámetros de query en cada llamada:

1. Añade a tu entidad `Proyecto` dos campos persistentes: `latitud` (Double) y `longitud` (Double). Recuerda que con `ddl-auto=update` Hibernate añade las columnas solo, pero las filas que ya existían quedan a `null`: actualízalas con un `UPDATE` a mano o dales valor por defecto.
2. Modifica el endpoint para que consulte el proyecto en base de datos (`ProyectoRepository.findById(id)`) y utilice automáticamente sus coordenadas geográficas reales.
3. Decide qué debe pasar si un proyecto **no tiene coordenadas**. No hay respuesta única, pero sí una mala: reventar con un `NullPointerException`. Elige entre devolver `400` explicando que ese proyecto no tiene sede geográfica, o no llamar a Open-Meteo y devolver el proyecto sin clima. Escribe en tu cuaderno cuál eliges y por qué.
4. Prueba con dos proyectos distintos: uno en Valencia (39.47, -0.38) y otro en Madrid (40.41, -3.70), verificando que cada uno devuelve el tiempo de su propia ubicación, y un tercero sin coordenadas para comprobar la decisión del punto 3.
5. Añade las tres peticiones a una carpeta `10-integraciones` de tu colección.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Dos proyectos con coordenadas distintas devuelven temperaturas distintas; el proyecto sin coordenadas responde lo que tú decidiste y no un <code>500</code>; y en los logs aparece una línea de inicio y una de fin con los milisegundos reales de cada llamada saliente.</dd>
</dl>

<p class="stage">Cliente HTTP y DTO externos</p>

#### Paso 7 · De DTOs externos al modelo de dominio

Crea cada record externo en su propio archivo bajo `integration/dto`; la anotación JsonProperty relaciona una clave del proveedor con un componente Java de nombre distinto. Crea luego el DTO público en `dto`, el adaptador y el servicio que lo utiliza. En el controlador existente sustituye la llamada que devuelve JSON crudo por la llamada al nuevo servicio y cambia el tipo de respuesta. Comprueba que nombres, unidades y valores del DTO proceden del ejemplo externo guardado, no de constantes del guion.

```java
package com.ejemplo.gestor.integration.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenMeteoResponse(
    double latitude,
    double longitude,
    @JsonProperty("current_weather") CurrentWeatherExternal current
) {}
```

El objeto anidado `CurrentWeatherExternal` se declara así:

```java
package com.ejemplo.gestor.integration.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record CurrentWeatherExternal(
    double temperature,
    double windspeed,
    @JsonProperty("weathercode") int weatherCode,
    @JsonProperty("is_day") int isDay,
    String time
) {}
```

<dl class="worked">
  <dt><code>@JsonIgnoreProperties(ignoreUnknown = true)</code>, la anotación que evita que te rompan la aplicación desde fuera</dt>
  <dd>Sin ella, Jackson lanza <code>UnrecognizedPropertyException</code> en cuanto el JSON trae un campo que el <code>record</code> no declara, y la incorporación de ese campo depende del proveedor, sin notificación previa. Con ella, tu integración sobrevive a que Open-Meteo publique diez campos nuevos mañana.</dd>
  <dt><code>@JsonProperty</code>: dónde muere el <code>snake_case</code> ajeno</dt>
  <dd><code>current_weather</code> no es un nombre válido en tu código Java. <code>@JsonProperty("current_weather")</code> hace la traducción <strong>una sola vez, en la frontera</strong>. A partir de ahí, dentro de tu aplicación, el campo se llama <code>current</code> y nadie tiene que recordar cómo lo llamaba el proveedor.</dd>
  <dt>Por qué estos DTO viven en <code>integration.dto</code> y no en <code>dto</code></dt>
  <dd>Porque el paquete es documentación. Cualquiera que abra <code>integration.dto</code> sabe que lo de dentro no lo decides tú y que puede cambiar sin previo aviso. Si mezclas esas clases con las tuyas, en seis meses nadie sabrá cuáles se pueden refactorizar con libertad y cuáles están atadas a un contrato ajeno.</dd>
</dl>

Este es el contrato que le pertenece a **nuestra aplicación**: nombres limpios, unidades explícitas y descripción humana:

```java
package com.ejemplo.gestor.dto;

public record ClimaProyectoResponse(
    Double temperaturaCelsius,
    Double velocidadVientoKmH,
    String descripcionClima,
    Boolean esFavorableParaTrabajoExterior
) {}
```

El adaptador interpreta los códigos numéricos del proveedor y genera nuestra regla de negocio:

```java
package com.ejemplo.gestor.integration;

import com.ejemplo.gestor.dto.ClimaProyectoResponse;
import com.ejemplo.gestor.integration.dto.OpenMeteoResponse;
import org.springframework.stereotype.Component;

@Component
public class ClimaAdapter {

    public ClimaProyectoResponse adaptar(OpenMeteoResponse external) {
        if (external == null || external.current() == null) {
            return null;
        }

        var current = external.current();
        String descripcion = descifrarCodigoMeteorologico(current.weatherCode());

        // Regla de negocio propia: si el viento supera 40 km/h o hay tormenta/lluvia intensa, no es favorable
        boolean esFavorable = current.windspeed() < 40.0 && current.weatherCode() < 50;

        return new ClimaProyectoResponse(
            current.temperature(),
            current.windspeed(),
            descripcion,
            esFavorable
        );
    }

    private String descifrarCodigoMeteorologico(int code) {
        return switch (code) {
            case 0 -> "Cielo despejado";
            case 1, 2, 3 -> "Parcialmente nublado";
            case 45, 48 -> "Niebla";
            case 51, 53, 55 -> "Llovizna";
            case 61, 63, 65 -> "Lluvia";
            case 71, 73, 75 -> "Nieve";
            case 95, 96, 99 -> "Tormenta eléctrica";
            default -> "Condiciones variables (código " + code + ")";
        };
    }
}
```

Modificamos el cliente para que deserialice directamente al DTO externo y devuelva el modelo interno mediante el adaptador:

```java
package com.ejemplo.gestor.integration;

import com.ejemplo.gestor.dto.ClimaProyectoResponse;
import com.ejemplo.gestor.integration.dto.OpenMeteoResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ClimaService {

    private final RestClient openMeteoRestClient;
    private final ClimaAdapter climaAdapter;

    public ClimaService(RestClient openMeteoRestClient, ClimaAdapter climaAdapter) {
        this.openMeteoRestClient = openMeteoRestClient;
        this.climaAdapter = climaAdapter;
    }

    public ClimaProyectoResponse consultarClima(double latitud, double longitud) {
        OpenMeteoResponse respuestaExterna = openMeteoRestClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/v1/forecast")
                .queryParam("latitude", latitud)
                .queryParam("longitude", longitud)
                .queryParam("current_weather", true)
                .build())
            .retrieve()
            .body(OpenMeteoResponse.class); // Deserialización automática con Jackson

        return climaAdapter.adaptar(respuestaExterna);
    }
}
```

#### Paso 8 · El contrato limpio en Bruno

Actualiza tu controlador para devolver `ClimaProyectoResponse` y lanza la petición en Bruno:

`GET http://localhost:8080/api/v1/proyectos/1/clima`

**Respuesta recibida:**
```json
{
  "temperaturaCelsius": 23.1,
  "velocidadVientoKmH": 11.4,
  "descripcionClima": "Cielo despejado",
  "esFavorableParaTrabajoExterior": true
}
```

Comprueba la diferencia:
* Ningún campo en inglés extraño del proveedor.
* Cero metadatos inútiles de husos horarios o tiempos de CPU de Open-Meteo.
* Añadido valor de negocio real (`esFavorableParaTrabajoExterior`).
* **Inmunidad garantizada:** Si Open-Meteo decide añadir 10 campos nuevos mañana, Jackson los ignorará en silencio y tu aplicación seguirá funcionando sin tocar ni una línea.

La inmunidad de la que habla el punto anterior no es una promesa: se comprueba en dos minutos.

1. Abre `CurrentWeatherExternal` y **borra** el componente `isDay`.
2. Vuelve a lanzar la petición. Sigue funcionando: Jackson descarta el campo que ya no declaras.
3. Ahora, en `OpenMeteoResponse`, quita la anotación `@JsonIgnoreProperties(ignoreUnknown = true)`.
4. Lanza otra vez. **Ahora falla**, con `UnrecognizedPropertyException: Unrecognized field "generationtime_ms"`.
5. Devuelve la anotación a su sitio.

Acabas de ver, en tu propia aplicación, cómo un campo que a ti no te importa —y que ni siquiera pediste— puede tumbar tu backend. Esa línea es lo único que separa una integración robusta de una que se cae el día que el proveedor despliega.

#### Paso 9 · Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| Todos los campos llegan a `0.0` o `null` | Los nombres no coinciden | El JSON dice `windspeed`, en una palabra. Compara letra a letra con el volcado del paso 1 de la sesión 41 |
| `UnrecognizedPropertyException` | Falta la anotación | `@JsonIgnoreProperties(ignoreUnknown = true)` en **cada** record externo, también en los anidados |
| `current` llega `null` y peta el adaptador | Falta el `@JsonProperty` del anidado | `current_weather` no se mapea solo a `current` |
| `Cannot construct instance ... no Creators` | Estás usando una clase, no un `record` | Con `record`, Jackson usa el constructor canónico. Con una clase necesitarías constructor vacío y setters |
| El adaptador devuelve `null` y el controlador lanza `NullPointerException` | El `null` del adaptador no lo trata nadie | Es una decisión pendiente: la resuelve la sesión 42 con la degradación elegante |

#### Paso 10 · Integrar el clima en la respuesta completa del proyecto

Antes de ampliar ProyectoResponse, decide dónde se incluye el clima: aquí se consulta en el detalle, no durante cada conversión genérica del mapper. Añade el componente y actualiza sus constructores en código y tests. Carga primero el proyecto y sus coordenadas; si faltan, devuelve una respuesta prevista por tu contrato, no una llamada con valores inventados. Consulta después el proveedor y construye el DTO final. Comprueba que listar cien proyectos no provoca cien llamadas meteorológicas por reutilizar ese mapper.

1. Añade un campo opcional `ClimaProyectoResponse clima`.
2. En `ProyectoService.obtenerPorId(id)`, llama a `climaService.consultarClima(proyecto.getLatitud(), proyecto.getLongitud())` e incrusta el clima en la respuesta.
3. Verifica que al consultar los detalles de un proyecto, la respuesta contiene tanto los datos de la base de datos local (nombre, cliente, tareas) como el clima en tiempo real de su ubicación.
4. Amplía la regla de negocio del adaptador: añade a `ClimaProyectoResponse` un campo `String recomendacion` que devuelva `"Aplazar trabajo en exterior"` cuando no sea favorable y `"Condiciones adecuadas"` cuando sí lo sea. Fíjate en dónde estás poniendo esa regla: en **tu** adaptador, no en el DTO externo. Open-Meteo no sabe nada de obras.
5. Repasa la sesión 30: `GET /api/v1/proyectos` devuelve una **lista paginada**. Si incrustas el clima también ahí, una página de 20 proyectos dispara 20 llamadas a Internet y tarda cuatro segundos. Decide qué haces —incrustarlo solo en el detalle, o solo cuando se pida con `?incluirClima=true`— y anótalo con su justificación. Es el mismo razonamiento del N+1 de la UD5, pero contra una red en lugar de contra una base de datos.
6. Actualiza la documentación OpenAPI de la UD7: el nuevo campo `clima` necesita su `@Schema` con ejemplo, y el endpoint debe declarar que ese campo puede venir vacío.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>El JSON que devuelve tu API no contiene ni un solo nombre de campo de Open-Meteo; ningún <code>OpenMeteoResponse</code> sale del paquete <code>integration</code>; has decidido y justificado qué pasa con el listado paginado; y borrar un campo del DTO externo no rompe nada.</dd>
</dl>

#### Paso 11 · Comprobar y registrar el resultado del proyecto

1. Ejecuta la consulta a través de tu backend y comprueba que el DTO público usa nombres y unidades propios, sin reenviar toda la respuesta del proveedor.
2. Cambia un parámetro permitido y verifica que llega correctamente al proveedor. Los errores y reglas del contrato público siguen siendo responsabilidad de tu API.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Consumir la API pública de GitHub para inspeccionar repositorios

Muchos proyectos de software tienen un repositorio de código asociado.
1. Investiga la API pública de GitHub para consultar un repositorio público:
   `GET https://api.github.com/repos/{propietario}/{repositorio}`
2. Configura un segundo cliente `githubRestClient` en `RestClientConfig` añadiendo la cabecera obligatoria `User-Agent`.
3. Implementa un método que consulte un repositorio (por ejemplo, `spring-projects/spring-boot`) y devuelva el número de estrellas (`stargazers_count`) y si está archivado (`archived`).

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Bean <code>RestClient</code> configurado y llamada funcional a Open-Meteo recuperando el JSON de respuesta.</span></div>
  <div><strong>Si lo tienes</strong><span>Coordenadas vinculadas a la entidad <code>Proyecto</code> y tiempo de latencia registrado en logs.</span></div>
  <div><strong>Reto</strong><span>Segundo cliente HTTP integrado consultando la API de repositorios de GitHub con cabeceras requeridas.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para ofrecer una interfaz fluida, moderna y síncrona que sustituya al viejo RestTemplate sin obligar al desarrollador a incorporar la complejidad y dependencias reactivas de WebFlux/WebClient.</p>
  <p>2 · El método restClient.get().</p>
  <p>3 · Porque muchos servidores y firewalls externos (como GitHub o Cloudflare) rechazan peticiones sin User-Agent para prevenir abusos de bots anónimos.</p>
  <p>4 · La latencia de propagación física de la red en Internet, la resolución DNS y la negociación criptográfica TLS (handshake HTTPS).</p>
</details>

##### Reto · Pruebas unitarias del Adaptador sin llamadas de red

Una de las enormes ventajas de la Capa Anticorrupción es que el mapeador puede probarse al 100 % sin levantar la red ni llamar a Internet:
1. Crea una clase de test `ClimaAdapterTest`.
2. Instancia objetos `OpenMeteoResponse` simulados con diferentes códigos (ej: código 0, código 63, código 95).
3. Verifica mediante aserciones de JUnit que:
   * El código 0 traduce a `"Cielo despejado"` y `esFavorableParaTrabajoExterior` es `true`.
   * Un viento de 55 km/h o un código 95 (tormenta) marca `esFavorableParaTrabajoExterior` en `false`.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>DTOs externos anotados con <code>@JsonIgnoreProperties</code> y deserialización automática con Jackson.</span></div>
  <div><strong>Si lo tienes</strong><span>Adaptador <code>ClimaAdapter</code> desacoplando el modelo ajeno y traduciendo a <code>ClimaProyectoResponse</code>.</span></div>
  <div><strong>Reto</strong><span>Suite de pruebas unitarias sobre el adaptador validando reglas de negocio climáticas sin red.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque cualquier cambio o deprecación en la API del proveedor externo rompería de forma involuntaria el contrato de tu propio frontend.</p>
  <p>2 · Mapea el nombre del campo en el JSON entrante con el nombre del atributo o parámetro en la clase Java cuando no coinciden exactamente.</p>
  <p>3 · Lanzaría una excepción de tipo UnrecognizedPropertyException y la petición fallaría con error 500.</p>
  <p>4 · En el adaptador o en un servicio de dominio de nuestra aplicación, nunca en los DTOs externos ni en el proveedor remoto.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

El dominio no depende directamente del formato externo y las credenciales no aparecen en el repositorio.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Sesión 42 · Timeouts y fallos parciales

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [publicar el acceso con jwt sin perder permisos](/es/docencia/proyecto-intermodular/ud10-comprobar-las-integraciones/sesion-21/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

La integración responde cuando el proveedor funciona. Hoy definirás qué pasa cuando tarda demasiado o falla. Un timeout limita la espera; una caché reutiliza temporalmente un resultado y necesita una política de caducidad. La respuesta debe indicar cuándo faltan datos o se usan datos anteriores.

#### La falacia de la red fiable y el colapso de hilos

En los años 90, los ingenieros de Sun Microsystems formularon las famosas **8 Falacias de la Computación Distribuida**. Las dos primeras dicen:
1. *«La red es fiable.»* (Falso: los cables se cortan, los servidores remotos se saturan y los firewalls descartan paquetes).
2. *«La latencia es cero.»* (Falso: cruzar Internet siempre cuesta tiempo).

Si no configuras límites en tus peticiones HTTP salientes, estás cometiendo una negligencia crítica:
* Por defecto, muchas librerías HTTP esperan de forma indefinida o con timeouts gigantescos (de minutos).
* **El ataque de denegación de servicio involuntario (*Thread Starvation*):** Tomcat dispone de un pool de hilos de trabajo (por defecto 200 hilos). Cada petición HTTP entrante consume un hilo mientras espera la respuesta.
* Si Open-Meteo sufre una caída y tarda 30 segundos en responder, y entran 200 peticiones a `/proyectos`, **los 200 hilos de Tomcat se quedan bloqueados esperando a Open-Meteo**.
* En ese instante, tu servidor deja de atender cualquier otra petición: nadie puede hacer login, nadie puede consultar tareas locales y tu aplicación entera **se cae como un castillo de naipes**.

<div class="rule">
  <p class="rule-label">La ley de la resiliencia en integraciones</p>
  <p><strong>El fallo de un servicio de terceros nunca debe arrastrar a la caída de tu propio sistema.</strong></p>
  <p>Toda llamada HTTP saliente debe tener tiempos límite estrictos (timeouts de pocos segundos) y una estrategia de degradación elegante ante indisponibilidad.</p>
</div>

#### Configuración obligatoria: Connect Timeout y Read Timeout

Debemos configurar dos límites independientes en la factoría de conexiones HTTP:

<figure class="diagram">
  <figcaption>Connect Timeout vs Read Timeout</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Petición saliente</li>
    <li>Connect Timeout (máx 2s para TCP/TLS)</li>
    <li>Conexión establecida</li>
    <li>Read Timeout (máx 3s para recibir bytes)</li>
    <li>Respuesta completa</li>
  </ol>
</figure>

* **Connect Timeout:** Tiempo máximo permitido para establecer el socket TCP y completar la negociación TLS/HTTPS con el servidor remoto (ej: 2 segundos). Si la IP no responde o el firewall descarta los paquetes SYN, se aborta.
* **Read Timeout:** Tiempo máximo de inactividad entre paquetes de datos una vez establecida la conexión (ej: 3 segundos). Si el servidor remoto aceptó la conexión pero se queda calculando indefinidamente, se corta.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre el cliente externo, su configuración y el servicio que lo llama. Ejecuta primero el caso correcto y observa su duración.
2. Define cuánto puede esperar tu operación y qué parte puede seguir funcionando sin el dato externo. Anota qué respuesta esperará el cliente.
3. Prepara en desarrollo una URL inaccesible o una simulación controlada del proveedor; evita depender de una caída real para probar.

#### Paso 2 · Configuración de timeouts y degradación elegante

En `ClimaProyectoResponse` cambia `double` por `Double` para temperatura y viento, y `boolean` por `Boolean` para la valoración. Estos tipos admiten `null`: significa que no hay medición, mientras que cero grados sí sería una medición. En el cliente comprueba primero si temperatura es null y muestra el aviso. Si añadiste `recomendacion` en la sesión 41, conserva ese componente y pasa también un texto de indisponibilidad al construir el resultado degradado.

Sustituye únicamente la construcción del bean RestClient por la versión con requestFactory y conserva su nombre, para que los servicios reciban el mismo cliente configurado. En ClimaService actualiza el método y **sus llamadas** en ProyectoService o el controlador; declarar `consultarClimaSeguro` no cambia los sitios que todavía llamen al método antiguo. Prueba primero el caso correcto y después el fallo controlado. Un resultado sin información meteorológica debe distinguirse explícitamente de una temperatura real de cero grados.

```java
package com.ejemplo.gestor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Configuration
public class RestClientConfig {

    @Value("${app.integraciones.open-meteo.base-url:https://api.open-meteo.com}")
    private String openMeteoBaseUrl;

    @Value("${app.integraciones.open-meteo.connect-timeout-ms:2000}")
    private int connectTimeoutMs;

    @Value("${app.integraciones.open-meteo.read-timeout-ms:3000}")
    private int readTimeoutMs;

    @Bean
    public RestClient openMeteoRestClient() {
        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofMillis(connectTimeoutMs));
        factory.setReadTimeout(Duration.ofMillis(readTimeoutMs));

        return RestClient.builder()
            .baseUrl(openMeteoBaseUrl)
            .requestFactory(factory)
            .build();
    }
}
```

Protegemos la llamada con un bloque `try-catch` específico que captura fallos de red (`ResourceAccessException`) y errores HTTP del servidor remoto (`HttpStatusCodeException`):

```java
package com.ejemplo.gestor.integration;

import com.ejemplo.gestor.dto.ClimaProyectoResponse;
import com.ejemplo.gestor.integration.dto.OpenMeteoResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

@Service
public class ClimaService {

    private static final Logger log = LoggerFactory.getLogger(ClimaService.class);
    private final RestClient openMeteoRestClient;
    private final ClimaAdapter climaAdapter;

    public ClimaService(RestClient openMeteoRestClient, ClimaAdapter climaAdapter) {
        this.openMeteoRestClient = openMeteoRestClient;
        this.climaAdapter = climaAdapter;
    }

    public ClimaProyectoResponse consultarClimaSeguro(double latitud, double longitud) {
        try {
            OpenMeteoResponse external = openMeteoRestClient.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/v1/forecast")
                    .queryParam("latitude", latitud)
                    .queryParam("longitude", longitud)
                    .queryParam("current_weather", true)
                    .build())
                .retrieve()
                .body(OpenMeteoResponse.class);

            ClimaProyectoResponse resultado = climaAdapter.adaptar(external);
            return resultado != null ? resultado : generarClimaDegradado("El proveedor no ha enviado una medición");

        } catch (ResourceAccessException ex) {
            // Se agotó el Connect Timeout, Read Timeout o falló la resolución DNS
            log.warn("Fallo de comunicación o timeout consultando Open-Meteo: {}. Aplicando degradación.", ex.getMessage());
            return generarClimaDegradado("Servicio meteorológico no disponible temporalmente (timeout de red)");

        } catch (HttpStatusCodeException ex) {
            // El servidor remoto respondió con código 4xx o 5xx
            log.error("Open-Meteo devolvió código de error HTTP {}: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            return generarClimaDegradado("Información climática no disponible (error del proveedor)");

        } catch (Exception ex) {
            // Cualquier otro fallo imprevisto
            log.error("Error inesperado en integración meteorológica", ex);
            return generarClimaDegradado("Clima no disponible");
        }
    }

    private ClimaProyectoResponse generarClimaDegradado(String aviso) {
        // Devolvemos un valor seguro por defecto sin lanzar 500 al cliente
        return new ClimaProyectoResponse(
            null,
            null,
            aviso,
            null // No hay medición: no se puede afirmar si es favorable
        );
    }
}
```

#### Paso 3 · Simulación de fallo en Bruno

Vamos a verificar empíricamente que la degradación funciona:

1. **Simular IP inalcanzable (Timeout de conexión):**
   * En `application.properties`, cambia temporalmente la URL base a una IP no enrutable con timeout de 2 segundos:
     ```properties
     app.integraciones.open-meteo.base-url=http://10.255.255.1
     app.integraciones.open-meteo.connect-timeout-ms=2000
     ```
2. **Lanza la petición en Bruno:**
   `GET http://localhost:8080/api/v1/proyectos/1`
3. **Observa el comportamiento:**
   * La petición tarda exactamente 2 segundos (el valor del `connect-timeout`).
   * **El servidor NO responde con 500 Internal Server Error.**
   * Responde con código **`200 OK`**, entregando el nombre del proyecto, el cliente, las tareas y el campo:
     `"descripcionClima": "Servicio meteorológico no disponible temporalmente (timeout de red)"`.
4. **Inspecciona la consola:**
   Aparece un `WARN` limpio registrado en los logs sin saturar la consola con trazas descontroladas.

#### Paso 4 · Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| La petición sigue tardando 30 segundos | Los timeouts no se aplican | Deben ir en la `requestFactory` del `RestClient`, no en `application.properties` a secas |
| Un `404` del proveedor llega al cliente como `500` | Solo capturas `ResourceAccessException` | Un error HTTP remoto es `HttpStatusCodeException`, que es otra rama distinta |
| El `catch` no salta nunca al cortar la red | Estabas mirando una respuesta cacheada | Reinicia la aplicación: la caché en memoria se vacía con ella |
| `@Cacheable` no hace nada | Falta `@EnableCaching` | Va en la clase principal o en una `@Configuration` |
| `@Cacheable` no hace nada aunque esté habilitado | Llamada interna | Si el método se invoca desde otro método de la misma clase, el proxy no interviene |
| El clima se queda congelado durante horas | La caché no expira | Una caché sin `ttl` no caduca nunca: para datos que cambian, configura el tiempo de vida |

Con los timeouts configurados, comprueba el fallo del proveedor de forma controlada:

1. Comenta temporalmente la `requestFactory` del bean.
2. Apunta el `base-url` a un host que no responde, por ejemplo `http://10.255.255.1`.
3. Lanza la petición y **cronométrala**. Se quedará colgada decenas de segundos.
4. Mientras tanto, lanza otras cinco peticiones a `GET /api/v1/proyectos`. Observa que también se ralentizan: cada llamada colgada retiene un hilo de Tomcat, y los hilos son un recurso finito. Con suficientes peticiones simultáneas, un proveedor lento tumba tu aplicación entera sin haber fallado él.
5. Restaura la factoría con sus timeouts y repite: ahora falla en 2 segundos, de forma controlada y sin arrastrar a nadie.

Ese es el argumento completo de la sesión: **un timeout no sirve para responder rápido, sirve para que el fallo de otro no se convierta en el tuyo.**

#### Paso 5 · Cachear respuestas climáticas para ahorrar peticiones

Una caché guarda temporalmente el resultado de una consulta para reutilizarlo. Aquí la clave son las coordenadas y el valor es el clima obtenido. Necesitamos tanto las anotaciones de Spring como un proveedor que aplique la caducidad.

1. Añade estas dependencias dentro de `dependencies` en `pom.xml` y sincroniza Maven. Spring Boot gestiona sus versiones.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<dependency>
    <groupId>com.github.ben-manes.caffeine</groupId>
    <artifactId>caffeine</artifactId>
</dependency>
```

2. Crea `config/CacheConfig.java` para activar el soporte. Decláralo una sola vez.

```java
package com.ejemplo.gestor.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {}
```

3. Añade a `application.properties` una caché llamada `clima`, con un máximo de 500 entradas y caducidad de diez minutos desde cada escritura.

```properties
spring.cache.type=caffeine
spring.cache.cache-names=clima
spring.cache.caffeine.spec=maximumSize=500,expireAfterWrite=10m
```

4. En `ClimaService.java`, importa `org.springframework.cache.annotation.Cacheable` y coloca esta anotación justo encima de **tu método existente** `consultarClimaSeguro`. Conserva todo su cuerpo.

```java
@Cacheable(value = "clima", key = "#p0 + '_' + #p1",
    unless = "#result == null || #result.temperaturaCelsius() == null")
```

`#p0` y `#p1` son los dos argumentos. `unless` evita guardar una respuesta sin medición. El controlador u otro servicio debe llamar a este bean; llamar al método desde otro método de la misma instancia no atraviesa el mecanismo de caché de Spring.

5. Añade un log justo antes de `openMeteoRestClient.get()` y realiza dos peticiones con las mismas coordenadas. Ambas responden, pero el log de consulta externa debe aparecer una vez. Mide tus tiempos; no tienen por qué coincidir con los de otro ordenador.
6. Repite con otras coordenadas y comprueba que se consulta al proveedor de nuevo. Dos ubicaciones pueden tener la misma temperatura: la prueba de la clave es el número de consultas y sus parámetros, no que las temperaturas sean distintas.
7. Para probar caducidad sin esperar diez minutos, cambia temporalmente `10m` por `5s`, reinicia y repite la misma petición antes y después de cinco segundos. Restaura `10m`. Con el proveedor simulado como caído, comprueba que la respuesta degradada no impide reintentar la consulta siguiente.

Registra el timeout de conexión, el de lectura y el tiempo de caché elegidos, junto a estas comprobaciones. La caché no elimina la necesidad de manejar fallos del proveedor.

#### Paso 6 · Comprobar y registrar el resultado del proyecto

1. Provoca el fallo y verifica que la operación termina dentro del límite configurado y devuelve el resultado alternativo documentado.
2. Repite consultas para comprobar cuándo se utiliza la caché, cuándo caduca y cómo se distingue un dato no disponible de un dato válido.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · El patrón Circuit Breaker con Resilience4j

Cuando un servicio externo está completamente caído, reintentar la conexión 200 veces por segundo sigue consumiendo 2 segundos de timeout en cada petición.

Investiga la librería **Resilience4j**:
1. ¿Qué es un **Disyuntor (*Circuit Breaker*)** y cuáles son sus tres estados (`CLOSED`, `OPEN`, `HALF_OPEN`)?
2. ¿Por qué en estado `OPEN` el disyuntor corta la llamada de inmediato (en 0 ms) ejecutando el método de fallback sin tocar la red?
3. Diseña en un documento técnico las ventajas de incorporar Resilience4j en integraciones críticas.

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Incluye esta explicación en el registro de la sesión dentro del repositorio de GitHub, junto al código y las comprobaciones. La entrega es el enlace al repositorio y al commit de la sesión.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Factoría de conexiones configurada con Connect Timeout (2s) y Read Timeout (3s).</span></div>
  <div><strong>Si lo tienes</strong><span>Degradación elegante ante <code>ResourceAccessException</code> y caché en memoria con <code>@Cacheable</code> evitando llamadas repetidas.</span></div>
  <div><strong>Reto</strong><span>Diseño conceptual del patrón Circuit Breaker con Resilience4j y sus tres estados.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Es la saturación del pool de hilos de trabajo de Tomcat al quedar todos bloqueados esperando respuestas externas lentas, impidiendo atender cualquier otra petición entrante al servidor.</p>
  <p>2 · Lanza org.springframework.web.client.ResourceAccessException (que envuelve un SocketTimeoutException o ConnectException).</p>
  <p>3 · Es la capacidad de un sistema de seguir funcionando y ofreciendo su servicio principal con funcionalidad reducida o datos por defecto cuando un componente secundario falla.</p>
  <p>4 · Reduce drásticamente la latencia para el usuario (de ~200 ms a ~1 ms), ahorra ancho de banda y peticiones contra la API externa, y permite responder con datos recientes si el proveedor sufre una caída temporal.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

El servicio no queda esperando indefinidamente y las pruebas reproducen los fallos externos.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Semana 22 · Ficheros y comunicación externa

## Sesión 43 · Ficheros y comunicación externa

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [comprobar una dependencia externa y su degradación](/es/docencia/proyecto-intermodular/ud10-comprobar-las-integraciones/sesion-22/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--guided">25 minutos · explicación y demostración</p>

Tu aplicación ya consulta un proveedor y controla sus fallos. Hoy recibirá archivos y emitirá avisos externos. Multipart permite enviar un archivo junto con otros datos; un webhook es una petición hacia una URL receptora. Separarás el éxito del guardado del resultado del aviso.

#### El transporte binario: multipart/form-data

Hasta ahora todas nuestras peticiones enviaban texto estructurado en formato JSON. Sin embargo, un fichero (un PDF con especificaciones, una captura de un bug en PNG o un informe de obra) es una secuencia de bytes binarios.

Para transmitir simultáneamente datos JSON y flujos binarios, el protocolo HTTP utiliza el estándar **`multipart/form-data`** (RFC 7578):
* El cuerpo de la petición se divide en bloques independientes delimitados por una cadena frontera (*boundary*).
* Cada bloque tiene sus propias cabeceras `Content-Disposition` y `Content-Type`, seguidas de los bytes correspondientes.

#### Los tres vectores de ataque en la subida de ficheros

Aceptar ficheros del exterior es una de las puertas de entrada más peligrosas en una aplicación web. Un atacante intentará explotar tres vectores clásicos:

| Vector de ataque | Cómo opera el atacante | Consecuencia | Contramedida obligatoria |
| :--- | :--- | :--- | :--- |
| **1 · Salto de directorio (*Path Traversal*)** | Envía un fichero con nombre manipulado: `../../../../etc/shadow` o `../../app.jar`. | Sobrescribe ficheros críticos del sistema operativo o binarios de la aplicación. | **Nunca usar el nombre original en el disco.** Generar un nombre aleatorio con `UUID.randomUUID()` y guardar el nombre original solo como metadato en la base de datos. |
| **2 · Ejecución remota de código (RCE)** | Sube un archivo con código ejecutable (`malware.jsp`, `script.sh`) a una carpeta estática pública. | El servidor web ejecuta el script directamente con permisos del sistema, dando control total al atacante. | **Almacenar los ficheros fuera del classpath y del directorio web.** Servirlos exclusivamente a través de un endpoint de descarga controlado por Java. |
| **3 · Denegación de servicio por espacio (*Zip Bomb*)** | Sube ficheros gigantescos de cientos de gigabytes o miles de ficheros simultáneos. | Agota el espacio en disco de la máquina o satura la memoria RAM del servidor. | **Configurar límites estrictos en Spring Boot** (`max-file-size: 5MB`) y validar extensiones/MIME permitidos en el servicio. |

<div class="rule">
  <p class="rule-label">La ley del almacenamiento seguro</p>
  <p><strong>El disco almacena UUIDs opacos; la base de datos almacena los nombres reales.</strong></p>
  <p>Los ficheros subidos deben residir en un directorio externo configurable (ej: <code>/var/uploads/</code>), inaccesible mediante URL directa, y servirse siempre a través de un controlador que verifique la autenticación del usuario.</p>
</div>

#### El problema de la doble escritura y la frontera transaccional

Imagina este caso de uso en nuestro gestor de proyectos:
* Cuando un usuario crea una tarea de prioridad **CRÍTICA**, el sistema debe:
  1. **Guardar la tarea en PostgreSQL** (operación ACID local).
  2. **Notificar a un sistema externo** (enviar un correo SMTP o emitir un webhook HTTP hacia un canal de Discord/Slack de soporte).

Si implementas esto de forma síncrona dentro del método del servicio:

```java
// ANTIPATRÓN: Acoplamiento síncrono de efectos secundarios
@Transactional
public TareaResponse crearTarea(TareaRequest request) {
    Tarea tarea = tareaRepository.save(new Tarea(...)); // Paso 1: Base de datos

    webhookClient.notificarAlerta(tarea); // Paso 2: Red externa síncrona (¡PELIGRO!)

    return mapearResponse(tarea);
}
```

Este código contiene **dos defectos arquitectónicos gravísimos**:
1. **Latencia acumulada:** El cliente web se queda esperando en blanco mientras el servidor contacta con Slack o el servidor de correo. Si la red remota tarda 5 segundos, la API tarda 5 segundos.
2. **Inconsistencia transaccional:**
   * Si la llamada a Slack falla con una excepción, Spring hace rollback en PostgreSQL: **la tarea no se guarda porque Slack estaba caído**.
   * Si la base de datos hace commit pero la notificación falla después, ¿cómo sabes qué se notificó y qué no?

<div class="rule">
  <p class="rule-label">El principio de desacoplamiento de efectos secundarios</p>
  <p><strong>Las notificaciones externas son efectos secundarios; nunca deben bloquear la transacción principal de negocio.</strong></p>
  <p>La persistencia en base de datos debe confirmarse primero. Una vez garantizado el <em>commit</em>, los efectos secundarios se disparan de forma asíncrona mediante <strong>Eventos de Dominio</strong>.</p>
</div>

#### Arquitectura de Eventos de Dominio en Spring

Para resolver este problema con elegancia, Spring proporciona un bus de eventos en memoria:

<figure class="diagram">
  <figcaption>Eventos desacoplados con @TransactionalEventListener</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Controlador recibe petición</li>
    <li>2. Servicio guarda Tarea en DB</li>
    <li>3. Publica TareaCreadaEvent</li>
    <li>4. Commit de la Transacción local (DB asegurada)</li>
    <li>5. Listener en hilo @Async envía Webhook en background</li>
  </ol>
</figure>

* **`ApplicationEventPublisher`:** Publica un objeto de evento inmutable (`record`).
* **`@TransactionalEventListener(phase = AFTER_COMMIT)`:** Garantiza que el evento solo se procesará **después de que la transacción de base de datos se haya confirmado con éxito**. Si la base de datos falla, la notificación externa jamás se envía.
* **`@Async`:** Ejecuta el listener en un pool de hilos independiente en segundo plano, liberando al hilo de Tomcat inmediatamente.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre la entidad que recibirá adjuntos, su servicio y las reglas de permisos. Prepara archivos ficticios pequeños, uno de tipo permitido y otro rechazado.
2. Localiza la configuración del directorio de almacenamiento y la URL receptora de pruebas. Usa un receptor de desarrollo para los avisos.
3. Anota qué información del adjunto guardarás en la base de datos y cómo comprobarás quién puede descargarlo.

#### Paso 2 · Subida y descarga segura de adjuntos

Después de crear Adjunto, crea `repository/AdjuntoRepository.java`. Es el repositorio que utilizarán los controladores y el servicio integrado de la siguiente sesión:

```java
package com.ejemplo.gestor.repository;

import com.ejemplo.gestor.model.Adjunto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdjuntoRepository extends JpaRepository<Adjunto, Long> {
    List<Adjunto> findByTareaId(Long tareaId);
}
```

Si el manejador global captura Exception, añade también un método específico para ResponseStatusException: de lo contrario convertiría sus 404 o 409 en 500. Importa `org.springframework.web.server.ResponseStatusException` y conserva los demás métodos del manejador.

```java
@ExceptionHandler(ResponseStatusException.class)
public ProblemDetail estadoConocido(ResponseStatusException ex) {
    return ProblemDetail.forStatusAndDetail(ex.getStatusCode(), ex.getReason());
}
```

Para el archivo vacío o de tipo rechazado, utiliza una excepción propia de validación o el IllegalArgumentException del ejemplo y tradúcela expresamente a 400; no cambies todos los errores inesperados a 400.

Configura primero los límites multipart y el directorio local. Crea la entidad Adjunto conservando su relación obligatoria con Tarea, su repositorio y AlmacenamientoService. Después incorpora las operaciones al servicio del dominio y conecta el controlador; los datos de la petición deben validarse antes de escribir el archivo. Reutiliza las comprobaciones de propiedad de la UD9 en subida y descarga. El nombre de almacenamiento lo genera el servidor; el nombre original se utiliza solo como metadato visible.

```properties
# Límite máximo por fichero individual (5 MB)
spring.servlet.multipart.max-file-size=5MB
# Límite máximo por petición completa (10 MB)
spring.servlet.multipart.max-request-size=10MB

# Directorio de almacenamiento externo en disco
app.almacenamiento.directorio-subidas=./almacenamiento/adjuntos
```

La base de datos almacena la trazabilidad y la relación con la tarea:

```java
package com.ejemplo.gestor.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "adjuntos")
public class Adjunto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombreOriginal;

    @Column(nullable = false, unique = true)
    private String nombreAlmacenado; // UUID generado (ej: "a4f8b1c2-9e3d.pdf")

    @Column(nullable = false)
    private String contentType; // "application/pdf", "image/png"

    @Column(nullable = false)
    private long tamanoBytes;

    @Column(nullable = false)
    private LocalDateTime fechaSubida = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarea_id", nullable = false)
    private Tarea tarea;

    // Constructores, getters y setters
    public Adjunto() {}

    public Adjunto(String nombreOriginal, String nombreAlmacenado, String contentType, long tamanoBytes, Tarea tarea) {
        this.nombreOriginal = nombreOriginal;
        this.nombreAlmacenado = nombreAlmacenado;
        this.contentType = contentType;
        this.tamanoBytes = tamanoBytes;
        this.tarea = tarea;
    }

    public Long getId() { return id; }
    public String getNombreOriginal() { return nombreOriginal; }
    public String getNombreAlmacenado() { return nombreAlmacenado; }
    public String getContentType() { return contentType; }
    public long getTamanoBytes() { return tamanoBytes; }
}
```

Este servicio valida el fichero, genera el UUID y escribe los bytes en el disco con control estricto:

```java
package com.ejemplo.gestor.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class AlmacenamientoService {

    @Value("${app.almacenamiento.directorio-subidas:./almacenamiento/adjuntos}")
    private String directorioSubidas;

    private Path rutaAlmacenamiento;

    private static final List<String> TIPOS_PERMITIDOS = List.of(
        "application/pdf", "image/png", "image/jpeg", "text/plain"
    );

    @PostConstruct
    public void inicializar() {
        try {
            this.rutaAlmacenamiento = Paths.get(directorioSubidas).toAbsolutePath().normalize();
            Files.createDirectories(this.rutaAlmacenamiento);
        } catch (IOException ex) {
            throw new RuntimeException("No se pudo inicializar la carpeta de subidas en: " + directorioSubidas, ex);
        }
    }

    public String guardarFichero(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo no puede estar vacío");
        }

        // Validación estricta de tipo MIME
        String contentType = archivo.getContentType();
        if (contentType == null || !TIPOS_PERMITIDOS.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Tipo de archivo no permitido: " + contentType + ". Permitidos: " + TIPOS_PERMITIDOS);
        }

        // Extracción segura de la extensión
        String nombreOriginal = archivo.getOriginalFilename();
        String extension = "";
        if (nombreOriginal != null && nombreOriginal.contains(".")) {
            extension = nombreOriginal.substring(nombreOriginal.lastIndexOf(".")).toLowerCase();
        }

        // Generamos un nombre UUID para evitar colisiones y ataques de Path Traversal
        String nombreSeguro = UUID.randomUUID() + extension;
        Path destino = this.rutaAlmacenamiento.resolve(nombreSeguro).normalize();

        // Verificación de seguridad anti Path Traversal
        if (!destino.startsWith(this.rutaAlmacenamiento)) {
            throw new SecurityException("Intento de almacenamiento fuera de la ruta permitida");
        }

        try {
            Files.copy(archivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
            return nombreSeguro;
        } catch (IOException ex) {
            throw new RuntimeException("Error al escribir el archivo en disco", ex);
        }
    }

    public Resource cargarComoRecurso(String nombreAlmacenado) {
        try {
            Path archivo = this.rutaAlmacenamiento.resolve(nombreAlmacenado).normalize();
            Resource recurso = new UrlResource(archivo.toUri());

            if (recurso.exists() && recurso.isReadable()) {
                return recurso;
            } else {
                throw new RuntimeException("El archivo no existe o no se puede leer: " + nombreAlmacenado);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Ruta de archivo malformada", ex);
        }
    }
}
```

```java
package com.ejemplo.gestor.controller;

import com.ejemplo.gestor.model.Adjunto;
import com.ejemplo.gestor.repository.AdjuntoRepository;
import com.ejemplo.gestor.repository.TareaRepository;
import com.ejemplo.gestor.service.AlmacenamientoService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1")
public class AdjuntoController {

    private final AlmacenamientoService almacenamientoService;
    private final AdjuntoRepository adjuntoRepository;
    private final TareaRepository tareaRepository;

    public AdjuntoController(AlmacenamientoService almacenamientoService,
                             AdjuntoRepository adjuntoRepository,
                             TareaRepository tareaRepository) {
        this.almacenamientoService = almacenamientoService;
        this.adjuntoRepository = adjuntoRepository;
        this.tareaRepository = tareaRepository;
    }

    @PostMapping(value = "/tareas/{id}/adjuntos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('DESARROLLADOR', 'JEFE_PROYECTO', 'ADMINISTRADOR')")
    public ResponseEntity<Void> subirAdjunto(
            @PathVariable Long id,
            @RequestParam("archivo") MultipartFile archivo) {

        var tarea = tareaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Tarea no encontrada"));

        String nombreAlmacenado = almacenamientoService.guardarFichero(archivo);

        Adjunto adjunto = new Adjunto(
            archivo.getOriginalFilename(),
            nombreAlmacenado,
            archivo.getContentType(),
            archivo.getSize(),
            tarea
        );
        adjuntoRepository.save(adjunto);

        return ResponseEntity.status(201).build();
    }

    @GetMapping("/adjuntos/{id}/descargar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Resource> descargarAdjunto(@PathVariable Long id) {
        Adjunto adjunto = adjuntoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Adjunto no encontrado"));

        Resource recurso = almacenamientoService.cargarComoRecurso(adjunto.getNombreAlmacenado());

        // Cabecera Content-Disposition: attachment fuerza al navegador a descargarlo con su nombre original
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(adjunto.getContentType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + adjunto.getNombreOriginal() + "\"")
            .body(recurso);
    }
}
```

#### Paso 3 · Pruebas de subida y descarga en Bruno

1. **Subida de fichero mediante Bruno:**
   * Crea una petición `POST http://localhost:8080/api/v1/tareas/1/adjuntos`.
   * En la pestaña **Auth** de la petición, introduce un Bearer Token válido con rol `DESARROLLADOR`.
   * En la pestaña **Body**, selecciona **Multipart Form**.
   * Añade el campo con nombre `archivo`, selecciona el tipo **File** y escoge un archivo PDF o PNG real de tu ordenador.
   * Envía la petición y comprueba que responde **`201 Created`**.
2. **Inspección forense del disco:**
   * Abre tu explorador de archivos y entra en la carpeta `almacenamiento/adjuntos`.
   * Comprueba que se ha creado un archivo como `8e2a1b9c-4f12-411a-a45b-76b9e28f30c1.pdf`.
   * El nombre original no está en el disco: **el sistema es completamente inmune a Path Traversal**.
3. **Descarga autorizada:**
   * Lanza `GET http://localhost:8080/api/v1/adjuntos/1/descargar` con cabecera `Authorization: Bearer <token>`.
   * Comprueba que la respuesta devuelve los bytes binarios y la cabecera:
     `Content-Disposition: attachment; filename="especificaciones-proyecto.pdf"`.
4. **Prueba de seguridad (Fichero malicioso o no permitido):**
   * Intenta subir un script `prueba.sh` o un ejecutable `.exe`.
   * **Resultado esperado:** Error `400 Bad Request` con mensaje *"Tipo de archivo no permitido"*. El archivo es rechazado y nada se escribe en el disco.

#### Paso 4 · Listar los adjuntos de una tarea

Crea `dto/AdjuntoResponse.java`. En AdjuntoRepository declara una consulta por id de tarea, carga primero la tarea y comprueba el permiso para verla. Transforma cada adjunto a ese DTO y construye la URL de descarga con el id **del adjunto**, no con el id de la tarea. Añade el GET al controlador existente y compruébalo con una tarea sin adjuntos y otra con dos. Usa cada URL recibida y verifica que descarga el archivo correspondiente.

<p class="stage">Correo, servicio externo o webhook</p>

#### Paso 5 · Webhooks asíncronos con Eventos de Dominio

**Preparar el receptor de prueba.** Crea `tools/webhook-prueba.py` con este contenido y ejecútalo en otra terminal con `python tools/webhook-prueba.py`. Deja el proceso abierto; el listener Java llamará a `http://localhost:9090/post`. Usa exclusivamente datos ficticios.

```python
from http.server import BaseHTTPRequestHandler, HTTPServer

class Receptor(BaseHTTPRequestHandler):
    def do_POST(self):
        contenido = self.rfile.read(int(self.headers.get("Content-Length", "0")))
        print(contenido.decode("utf-8"), flush=True)
        self.send_response(204)
        self.end_headers()

HTTPServer(("127.0.0.1", 9090), Receptor).serve_forever()
```

Primero crea una tarea de prioridad alta y observa el POST en esa terminal. Después detén solo el receptor con Ctrl+C y repite: la tarea debe conservarse y el fallo del aviso aparecer en los logs. Vuelve a iniciarlo al terminar. El listener mostrado registra el fallo, pero no implementa una cola de reintentos.

Crea en orden AsyncConfig, el record del evento y el listener. Después añade ApplicationEventPublisher al constructor existente de TareaService, conservando sus otros colaboradores. Dentro del método transaccional de alta, guarda primero, toma el id devuelto y publica el evento con los datos necesarios; no copies un método abreviado que omita el guardado. Usa una prioridad aceptada por tu validador para activar el ejemplo de aviso. Configura la URL de un receptor local de pruebas antes de activar el envío.

```java
package com.ejemplo.gestor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync // Habilita la anotación @Async
public class AsyncConfig {

    @Bean(name = "notificacionesExecutor")
    public Executor notificacionesExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("notif-thread-");
        executor.initialize();
        return executor;
    }
}
```

Creamos un registro inmutable que transporta los datos mínimos necesarios:

```java
package com.ejemplo.gestor.event;

public record TareaCriticaCreadaEvent(
    Long tareaId,
    String titulo,
    String prioridad,
    String proyectoNombre,
    String creadoPor
) {}
```

En TareaService añade ApplicationEventPublisher como campo y parámetro del constructor existente; importa `org.springframework.context.ApplicationEventPublisher` y el evento anterior. Conserva los repositorios y las reglas actuales. En el método transaccional de alta, **después de guardar** y antes del return, inserta este bloque. Aquí `tarea` es la entidad devuelta por save y `usuarioAutenticado` es el username recibido del principal del controlador; pásalo como argumento si tu método todavía no lo recibía.

```java
if ("alta".equals(tarea.getPrioridad())) {
    eventPublisher.publishEvent(new TareaCriticaCreadaEvent(
        tarea.getId(), tarea.getTitulo(), tarea.getPrioridad(),
        tarea.getProyecto().getNombre(), usuarioAutenticado));
}
```

La prioridad sigue siendo String con valores baja, media y alta. No crees un enum CRITICA solo para copiar el aviso. El nombre del evento identifica el caso que hemos decidido notificar.

El listener se ejecuta en segundo plano solo tras el commit de la base de datos:

```java
package com.ejemplo.gestor.listener;

import com.ejemplo.gestor.event.TareaCriticaCreadaEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Component
public class NotificacionWebhookListener {

    private static final Logger log = LoggerFactory.getLogger(NotificacionWebhookListener.class);
    private final RestClient webhookRestClient;

    public NotificacionWebhookListener(RestClient.Builder restClientBuilder,
            @org.springframework.beans.factory.annotation.Value("${app.webhook.base-url:http://localhost:9090}") String baseUrl) {
        // En un entorno real se apunta a una URL configurable de Slack/Discord o Webhook de terceros
        this.webhookRestClient = restClientBuilder
            .baseUrl(baseUrl)
            .build();
    }

    @Async("notificacionesExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void alCrearTareaCritica(TareaCriticaCreadaEvent evento) {
        log.info("[{}] Procesando notificación asíncrona para tarea crítica #{}: {}",
            Thread.currentThread().getName(), evento.tareaId(), evento.titulo());

        try {
            // Emitimos la petición POST hacia el webhook externo
            webhookRestClient.post()
                .uri("/post")
                .body(Map.of(
                    "alerta", "TAREA CRÍTICA REGISTRADA",
                    "id", evento.tareaId(),
                    "titulo", evento.titulo(),
                    "proyecto", evento.proyectoNombre(),
                    "responsable", evento.creadoPor()
                ))
                .retrieve()
                .toBodilessEntity();

            log.info("[{}] Notificación de webhook enviada con éxito para tarea #{}",
                Thread.currentThread().getName(), evento.tareaId());

        } catch (Exception ex) {
            // El fallo externo se registra en auditoría sin afectar al usuario
            log.error("[{}] Error al enviar webhook para tarea #{}: {}. Revisar el envío fallido. Este ejemplo no programa reintentos.",
                Thread.currentThread().getName(), evento.tareaId(), ex.getMessage());
        }
    }
}
```

#### Paso 6 · Inspección de hilos y tiempos en Bruno

1. **Lanza la creación de una tarea crítica:**
   `POST http://localhost:8080/api/v1/proyectos/1/tareas`
   ```json
   {
     "titulo": "Servidor principal caído en producción",
     "prioridad": "CRITICA"
   }
   ```
2. **Comprueba el tiempo de respuesta en Bruno:**
   El cliente recibe código **`201 Created` en 18 ms**. La experiencia de usuario es instantánea.
3. **Inspecciona la consola de Spring Boot:**
   ```text
   23:45:10.102 INFO  [http-nio-8080-exec-1] c.e.p.service.TareaService : Tarea #42 guardada en PostgreSQL
   23:45:10.120 INFO  [notif-thread-1] c.e.p.l.NotificacionWebhookListener : [notif-thread-1] Procesando notificación asíncrona para tarea crítica #42: Servidor principal caído
   23:45:10.450 INFO  [notif-thread-1] c.e.p.l.NotificacionWebhookListener : [notif-thread-1] Notificación de webhook enviada con éxito para tarea #42
   ```
   Observa los nombres de los hilos:
   * El hilo de Tomcat `http-nio-8080-exec-1` guardó en la base de datos y respondió al cliente en 18 ms.
   * El hilo `notif-thread-1` procesó el webhook en segundo plano durante 330 ms sin que el usuario sufriera ninguna espera.

#### Paso 7 · Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| El listener se ejecuta pero la tarea no está en la base de datos | Se está escuchando antes del `commit` | `@TransactionalEventListener(phase = AFTER_COMMIT)`, no `@EventListener` a secas |
| El listener no se ejecuta nunca | Falta habilitar la asincronía | `@EnableAsync` en una clase de configuración; sin ella, `@Async` es decoración |
| El listener corre en el hilo de la petición y la ralentiza | Falta `@Async`, o la llamada es interna | Si el evento se publica desde el mismo bean que lo escucha, el proxy no interviene |
| El webhook falla y se pierde la tarea | El listener está dentro de la transacción | Con `AFTER_COMMIT` esto no puede pasar: la tarea ya está guardada pase lo que pase |
| El webhook falla y nadie se entera | La excepción muere en el hilo asíncrono | Un `@Async` sin `try/catch` traga el error en silencio: registra siempre el fallo |

#### Paso 8 · Notificación simulada por correo electrónico

Añade un segundo listener que simule el envío de un correo de alerta:

1. Crea `NotificacionEmailListener`.
2. Escucha el mismo evento `TareaCriticaCreadaEvent` con `@Async` y `@TransactionalEventListener(phase = AFTER_COMMIT)`.
3. Simula la redacción del mensaje y registra en logs el destinatario y el asunto.
4. Comprueba que un único evento dispara tanto el webhook como el correo sin que ninguno espere al otro.
5. **Demuestra que el desacoplamiento funciona de verdad**, que es toda la razón de ser de la sesión: haz que el listener del webhook lance una excepción a propósito, crea una tarea crítica y comprueba tres cosas a la vez:
   * la tarea **está** en la base de datos,
   * el cliente recibió su `201 Created` sin enterarse de nada,
   * y el listener del correo se ejecutó igualmente.
   Si alguna de las tres falla, tu notificación no está desacoplada: está escondida dentro de la transacción.
6. **Mide el tiempo de respuesta** del alta con y sin los listeners activos. Deben ser prácticamente iguales. Si el alta tarda más al añadir notificaciones, el `@Async` no está actuando y estás haciendo esperar al usuario a que se envíe un correo.
7. Anota el agujero que queda abierto, porque te lo van a preguntar en la defensa: si el servidor se apaga entre el `commit` y la ejecución del listener, **la notificación se pierde y nadie lo sabe**. Es exactamente el problema que resuelve el patrón Outbox del reto.

<dl class="worked">
  <dt>Cómo saber que lo has terminado</dt>
  <dd>Un evento dispara dos listeners independientes; un fallo en uno no afecta al otro ni al alta; el tiempo de respuesta del endpoint no cambia al añadirlos; y sabes explicar en qué caso concreto una notificación se perdería.</dd>
</dl>

#### Paso 9 · Comprobar y registrar el resultado del proyecto

1. Sube, lista y descarga un archivo autorizado; compara su contenido y prueba tamaño, tipo e identidad no permitidos.
2. Simula un fallo del receptor externo y verifica la política prevista: el dato confirmado no debe desaparecer porque un aviso posterior haya fallado. Registra ese fallo de forma comprobable.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Validación de firmas mágicas binarias (Magic Bytes)

Un atacante avanzado puede renombrar un ejecutable `virus.exe` a `informe.pdf`.
* Si tu servidor solo comprueba la extensión o la cabecera `Content-Type` enviada por el cliente, el fichero será aceptado porque el navegador reporta lo que la extensión sugiere.

Investiga cómo inspeccionar los **Magic Bytes** del flujo binario:
1. ¿Cuáles son los primeros 4 bytes característicos de un archivo PDF legítimo (`%PDF` / `0x25 0x50 0x44 0x46`) y de una imagen PNG (`0x89 0x50 0x4E 0x47`)?
2. Integra la librería `Apache Tika` o implementa una comprobación directa de los primeros bytes de `archivo.getInputStream()` para verificar el tipo real antes de escribir en disco.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Configuración de límites multipart y servicio de almacenamiento local con UUIDs operativos.</span></div>
  <div><strong>Si lo tienes</strong><span>Subida y descarga autorizada con Spring Security, metadatos en PostgreSQL y <code>Content-Disposition</code>.</span></div>
  <div><strong>Reto</strong><span>Validación profunda de tipos de archivo mediante inspección de firmas mágicas (*Magic Bytes*).</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el cliente puede enviar nombres maliciosos con secuencias de salto de directorio (../../) para sobrescribir archivos del sistema o inyectar código ejecutable.</p>
  <p>2 · La cabecera Content-Disposition: attachment; filename="nombre.ext".</p>
  <p>3 · spring.servlet.multipart.max-file-size y spring.servlet.multipart.max-request-size.</p>
  <p>4 · Porque la extensión puede ser alterada trivialmente por el usuario (ej: renombrar un script .sh a .pdf) eludiendo la comprobación si no se valida el MIME o los magic bytes.</p>
</details>

##### Reto · El patrón Outbox para garantizar entrega (Transactional Outbox)

Si el servidor se apaga repentinamente justo después de hacer commit en la base de datos pero antes de que el hilo asíncrono ejecute el webhook, la notificación se pierde para siempre.

Investiga el patrón **Transactional Outbox**:
1. ¿Por qué las arquitecturas de microservicios guardan la notificación en una tabla local `mensajes_pendientes` dentro de la **misma transacción** que la tarea?
2. ¿Cómo lee un proceso programado (`@Scheduled`) esa tabla periódicamente para enviar los webhooks y marcar su estado como `ENVIADO`?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Configuración de <code>@EnableAsync</code>, evento de dominio y listener desacoplado.</span></div>
  <div><strong>Si lo tienes</strong><span>Listener con <code>@TransactionalEventListener(phase = AFTER_COMMIT)</code> y llamada a webhook con <code>RestClient</code>.</span></div>
  <div><strong>Reto</strong><span>Diseño conceptual del patrón Transactional Outbox para tolerancia a fallos y reintentos.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque mantiene la conexión de base de datos y los bloqueos de filas abiertos durante todo el tiempo que tarda la red externa, reduciendo drásticamente la concurrencia y arriesgando rollbacks indebidos.</p>
  <p>2 · Garantiza que el evento solo se ejecutará si la transacción de base de datos se confirmó con éxito; si hubo un error previo o un rollback, el listener no se dispara.</p>
  <p>3 · Nada; el usuario ya recibió su respuesta 201 Created hace tiempo porque el listener se ejecuta en un hilo separado desacoplado del ciclo de vida de la petición HTTP.</p>
  <p>4 · Para controlar el tamaño de la cola, limitar el número máximo de hilos concurrentes y evitar que un aluvión de notificaciones consuma toda la memoria de la máquina.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

Un archivo no permitido se rechaza y una persona sin permisos no descarga un adjunto ajeno.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Sesión 44 · Integración completa comprobada

**Proyecto compartido.** En el taller de Intermodular que abre esta semana has trabajado [comprobar una dependencia externa y su degradación](/es/docencia/proyecto-intermodular/ud10-comprobar-las-integraciones/sesion-22/). En Servidor continúas la implementación del mismo producto.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

El backend ya sabe gestionar tareas, guardar adjuntos, consultar el clima y publicar un aviso tras crear una tarea importante. En esta sesión se conectan esas piezas sobre el producto propio. El alta de tarea conserva su endpoint y reglas; la operación integrada añade a esa tarea un adjunto y devuelve también el clima de su proyecto.

**Seguir un dato de extremo a extremo.** El cliente envía el id de tarea y un archivo. Seguridad comprueba la identidad y el rol antes del controlador. El servicio carga la tarea, consulta el clima, guarda el archivo y registra sus metadatos. La respuesta incluye ids reales y una URL que debe permitir descargar el mismo contenido. En la demostración seguiremos ese recorrido en Red, en los logs, en la tabla adjuntos y en la carpeta de almacenamiento.

**Un fallo no siempre tiene el mismo efecto.** Si falta permiso o la tarea no existe, rechazamos la operación. Si el proveedor meteorológico falla, podemos seguir guardando el adjunto y devolver un aviso sin inventar una medición. Esta decisión pertenece al caso de uso: el clima es información complementaria.

**Qué cubre la transacción.** PostgreSQL puede deshacer sus filas, pero no borra automáticamente un fichero escrito en disco ni retira una notificación ya enviada. Por eso la sesión 43 envía eventos después del commit y hoy añadiremos limpieza de archivos en caso de rollback. Explicaremos dónde se registra esa limpieza y comprobaremos que se ejecuta; también reconoceremos su límite ante una caída completa del proceso.

**Qué se comprueba.** Un 201 aislado no basta: el enlace debe descargar el archivo, la fila debe apuntar a la tarea y una respuesta rechazada no debe dejar efectos inesperados. Separar esas observaciones permite localizar el fallo sin cambiar varias capas a la vez.

### Se trabaja

<p class="stage stage--guided">140 minutos · implementación guiada sobre el proyecto propio</p>

#### Paso 1 · Retomar el proyecto y preparar la comprobación

1. Abre la colección del producto y prepara un usuario, un recurso y los archivos ficticios del recorrido. Identifica todos los servicios que deben estar arrancados.
2. Dibuja la secuencia cliente, backend, base de datos, almacenamiento y proveedor. Marca dónde puede fallar y qué resultado debería conservarse.
3. Guarda el estado inicial de los datos de prueba para distinguir un alta nueva de restos de ejecuciones anteriores.

#### Paso 2 · Ensamblado del flujo completo

Vamos a integrar **una tarea que ya existe** con un adjunto y el clima de su proyecto. En este ejemplo, «incidencia» es la tarea del gestor: no necesitas crear una entidad Incidencia ni otro repositorio. El alta de la tarea sigue usando el CRUD y sus reglas actuales. Este recorrido reutiliza las piezas de las sesiones 41–43 y permite comprobar cada una por separado.

1. Crea una tarea de prueba mediante su endpoint habitual, dentro de un proyecto con coordenadas válidas. Guarda su id. Comprueba el GET de esa tarea, el servicio de clima y el POST de adjuntos de la sesión 43 antes de combinarlos.
2. Crea `dto/RegistroIntegradoResponse.java`. El id principal es el de la tarea; `adjuntoId` identifica la fila que acabamos de guardar. No construyas una URL de descarga con un id todavía null.

```java
package com.ejemplo.gestor.dto;

public record RegistroIntegradoResponse(
    Long tareaId,
    String titulo,
    Long adjuntoId,
    String urlDescarga,
    ClimaProyectoResponse clima
) {}
```

3. En `AlmacenamientoService.java` añade el método siguiente junto a `guardarFichero` y `cargarComoRecurso`. Reutiliza sus imports de Path, Files e IOException. Se usará únicamente con el nombre generado por nuestro servicio si falla la transacción.

```java
public void eliminarFichero(String nombreAlmacenado) {
    Path ruta = rutaAlmacenamiento.resolve(nombreAlmacenado).normalize();
    if (!ruta.getParent().equals(rutaAlmacenamiento)) {
        throw new SecurityException("El archivo debe estar en la carpeta de adjuntos");
    }
    try {
        Files.deleteIfExists(ruta);
    } catch (IOException ex) {
        throw new IllegalStateException("No se pudo retirar el archivo " + nombreAlmacenado, ex);
    }
}
```

Una transacción de PostgreSQL no deshace una escritura en disco. Por eso registraremos una acción que retira el fichero si PostgreSQL termina con rollback. Este mecanismo cubre el fallo normal de la transacción; no convierte disco y base de datos en un único almacenamiento atómico ante un apagado del equipo.

4. Crea `service/RegistroIntegradoService.java`. El método carga la tarea, obtiene las coordenadas de su proyecto, consulta el clima con degradación, guarda el archivo y persiste el Adjunto **asociado a esa tarea**. `saveAndFlush` fuerza la escritura de la fila antes de construir la respuesta.

```java
package com.ejemplo.gestor.service;

import com.ejemplo.gestor.dto.RegistroIntegradoResponse;
import com.ejemplo.gestor.integration.ClimaService;
import com.ejemplo.gestor.model.Adjunto;
import com.ejemplo.gestor.repository.AdjuntoRepository;
import com.ejemplo.gestor.repository.TareaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RegistroIntegradoService {
    private static final Logger log = LoggerFactory.getLogger(RegistroIntegradoService.class);
    private final TareaRepository tareas;
    private final AdjuntoRepository adjuntos;
    private final AlmacenamientoService almacenamiento;
    private final ClimaService climaService;

    public RegistroIntegradoService(TareaRepository tareas, AdjuntoRepository adjuntos,
            AlmacenamientoService almacenamiento, ClimaService climaService) {
        this.tareas = tareas;
        this.adjuntos = adjuntos;
        this.almacenamiento = almacenamiento;
        this.climaService = climaService;
    }

    @Transactional
    public RegistroIntegradoResponse registrar(Long tareaId, MultipartFile archivo) {
        var tarea = tareas.findById(tareaId).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarea no encontrada"));
        var proyecto = tarea.getProyecto();
        if (!proyecto.isActivo()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El proyecto está inactivo");
        }
        var clima = climaService.consultarClimaSeguro(proyecto.getLatitud(), proyecto.getLongitud());
        String nombre = almacenamiento.guardarFichero(archivo);

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCompletion(int status) {
                if (status == STATUS_ROLLED_BACK) {
                    try {
                        almacenamiento.eliminarFichero(nombre);
                    } catch (RuntimeException ex) {
                        log.error("Revisar archivo pendiente de limpieza: {}", nombre, ex);
                    }
                }
            }
        });

        var adjunto = adjuntos.saveAndFlush(new Adjunto(
            archivo.getOriginalFilename(), nombre, archivo.getContentType(), archivo.getSize(), tarea));
        return new RegistroIntegradoResponse(tarea.getId(), tarea.getTitulo(), adjunto.getId(),
            "/api/v1/adjuntos/" + adjunto.getId() + "/descargar", clima);
    }
}
```

La consulta externa tiene los timeouts de la sesión 42. Aquí se realiza antes de escribir el archivo; identifica en los logs el tiempo que añade al caso de uso. Las reglas de creación de tareas siguen en su servicio original, por lo que no se pierde ninguna validación del CRUD al integrar el adjunto.

5. Crea `controller/RegistroIntegradoController.java`. En el ejemplo pueden registrar adjuntos integrados los jefes de proyecto y administradores; adapta esa regla a la matriz de tu producto e incluye propiedad si corresponde. Mantén el control de descarga de la sesión 43.

```java
package com.ejemplo.gestor.controller;

import com.ejemplo.gestor.dto.RegistroIntegradoResponse;
import com.ejemplo.gestor.service.RegistroIntegradoService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.net.URI;

@RestController
@RequestMapping("/api/v1/tareas")
public class RegistroIntegradoController {
    private final RegistroIntegradoService servicio;

    public RegistroIntegradoController(RegistroIntegradoService servicio) {
        this.servicio = servicio;
    }

    @PostMapping(value = "/{id}/registro-integrado", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('JEFE_PROYECTO', 'ADMINISTRADOR')")
    public ResponseEntity<RegistroIntegradoResponse> registrar(
            @PathVariable Long id, @RequestParam("archivo") MultipartFile archivo) {
        var respuesta = servicio.registrar(id, archivo);
        return ResponseEntity.created(URI.create(respuesta.urlDescarga())).body(respuesta);
    }
}
```

6. En Bruno crea `POST /api/v1/tareas/{{tareaId}}/registro-integrado`, usa el token de una cuenta permitida y selecciona Multipart. Añade `archivo` de tipo File. Deja que Bruno construya Content-Type y su boundary. Espera 201, un `adjuntoId` real y la URL en Location.
7. Descarga desde esa URL usando la misma identidad y compara el archivo recibido. En PostgreSQL comprueba `adjuntos.tarea_id`: debe ser el id preparado al principio, nunca null.
8. Si el alta original de la tarea tenía prioridad alta, comprueba el aviso de la sesión 43. Asociar un archivo no vuelve a publicar «tarea creada»: evita emitir notificaciones duplicadas por dos operaciones distintas.

#### Paso 3 · Batería de escenarios en Bruno

Prepara una tarea y un archivo pequeño de prueba. Cada llamada correcta crea un adjunto diferente; conserva sus ids para limpiar después.

1. Con token de jefe de proyecto o administrador, envía `POST /api/v1/tareas/{{tareaId}}/registro-integrado`, Multipart y campo `archivo`. Espera 201, descarga desde Location y comprueba la relación de base de datos.
2. Simula la caída del proveedor con la URL local de prueba de la sesión 42. Reinicia para vaciar la caché. Repite: espera 201 con aviso y temperatura null. Restaura la URL y comprueba la recuperación.
3. Repite sin token (401) y con un rol no permitido (403). Comprueba que ninguno crea fila ni archivo.
4. Repite con tarea inexistente (404) y proyecto inactivo (409). No deben aparecer adjuntos nuevos.
5. Repite con un archivo vacío o un tipo rechazado. El manejador debe traducir la validación conocida a 400; comprueba el directorio y las filas, además del estado HTTP.

Utiliza una copia de prueba y datos ficticios; no necesitas desconectar toda la red para simular un proveedor caído.

#### Paso 4 · Si algo no sale como dice el guion

| Síntoma | Causa casi segura | Qué mirar |
| :--- | :--- | :--- |
| El adjunto se guarda en disco pero no hay fila en la base de datos | El guardado del fichero está fuera de la transacción | El sistema de archivos no participa en el `rollback`: guarda primero la fila y el fichero después, o borra el fichero en el `catch` |
| La incidencia falla entera cuando cae Open-Meteo | El `try/catch` no envuelve la llamada saliente | La degradación de la sesión 42 debe aplicarse aquí también: el clima es un extra, no un requisito |
| `413 Payload Too Large` con un fichero de 3 MB | El límite por defecto de Spring es 1 MB | `spring.servlet.multipart.max-file-size` y `max-request-size` en `application.properties` |
| El `multipart` responde `415` | El cliente fija mal el `Content-Type` | En una petición multiparte, deja que el cliente ponga él el `boundary`: no lo escribas a mano |
| La descarga baja un fichero con nombre UUID ilegible | Falta la cabecera `Content-Disposition` | Devuelve el nombre original en `filename=`, guardando el UUID solo en disco |
| Todo funciona pero la petición tarda 3 segundos | Estás esperando a Open-Meteo antes de responder | Es correcto y es el coste que decidiste asumir: mídelo y anótalo, o pásalo a asíncrono |

#### Paso 5 · Cerrar la integración de extremo a extremo

1. Añade al cliente un formulario de adjunto sobre una tarea existente. Envía FormData con `archivo` y token; no fijes manualmente la cabecera Content-Type.
2. Muestra el enlace de descarga y el clima. Si la temperatura es null, presenta el aviso de indisponibilidad y no lo interpretes como cero grados ni como condiciones favorables.
3. Provoca en el entorno de pruebas un fallo de persistencia después de guardar el archivo. Comprueba el rollback de la fila y la retirada del archivo por afterCompletion. Restaura la condición normal y repite el alta correcta.
4. Documenta el endpoint y sus permisos en OpenAPI, usando el patrón multipart de la sesión 43. Ejecútalo también desde Swagger.
5. Guarda en el registro de la sesión el recorrido crear tarea → registrar adjunto → descargar, con sus ids y resultados. Anota la latencia con proveedor disponible y caído, distinguiendo timeout y tiempo total de la petición. No prometas que ambos tiempos son exactamente iguales.

#### Paso 6 · Comprobar y registrar el resultado del proyecto

1. Ejecuta el recorrido correcto y comprueba datos persistidos, permisos, adjuntos y respuesta pública.
2. Repite con una validación fallida, otro usuario y el proveedor caído. Comprueba tanto lo que se devuelve como los efectos que sí o no deben haberse producido.

#### Ampliación si has completado el trabajo

Primero termina y verifica los pasos anteriores. Estos retos profundizan en el mismo contenido; no sustituyen la entrega ni obligan a iniciar otro proyecto.

##### Reto · Auditoría de integraciones externas

Diseña una tabla de auditoría en PostgreSQL:
```sql
CREATE TABLE auditoria_integraciones (
    id BIGSERIAL PRIMARY KEY,
    servicio_destino VARCHAR(50) NOT NULL,
    operacion VARCHAR(50) NOT NULL,
    latencia_ms BIGINT NOT NULL,
    codigo_http_resultado INT,
    estado VARCHAR(20) NOT NULL, -- 'EXITO', 'TIMEOUT', 'ERROR_REMOTO'
    fecha_registro TIMESTAMP NOT NULL
);
```
Implementa un aspecto `@Aspect` o un interceptor en `RestClient` (`ClientHttpRequestInterceptor`) que registre automáticamente cada petición saliente a Open-Meteo o al Webhook en esta tabla.

<div class="rule">
  <p class="rule-label">Formato de entrega</p>
  <p>Incluye esta explicación en el registro de la sesión dentro del repositorio de GitHub, junto al código y las comprobaciones. La entrega es el enlace al repositorio y al commit de la sesión.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Flujo integral de subida multipart con persistencia en PostgreSQL y respuesta tipada.</span></div>
  <div><strong>Si lo tienes</strong><span>Integración de Open-Meteo con degradación elegante, seguridad JWT y eventos asíncronos.</span></div>
  <div><strong>Reto</strong><span>Tabla e interceptor de auditoría de peticiones salientes registrando latencias y fallos.</span></div>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque los datos climáticos forman parte de la información que enriquece la incidencia a guardar; el webhook, en cambio, es un efecto secundario de notificación que solo debe emitirse si el registro tuvo éxito.</p>
  <p>2 · El archivo quedaría huérfano en disco a menos que se implemente un mecanismo de compensación o limpieza en el bloque catch de la transacción.</p>
  <p>3 · Protegiendo el endpoint GET de descarga con @PreAuthorize("isAuthenticated()") o verificando roles específicos en la SecurityFilterChain.</p>
  <p>4 · Reduce el número de peticiones de red entre navegador y servidor (round-trips), disminuye la latencia total y simplifica la lógica del cliente frontend.</p>
</details>

### Cierre

<p class="stage">15 minutos · resultado comprobable y explicación individual</p>

**Al terminar la sesión:**

El caso de uso funciona desde el cliente y sus limitaciones y respuestas ante fallos están documentadas.

Cada integrante explica una decisión del código apoyándose en una de las comprobaciones realizadas.


## Lo que debes recordar

### El método

En esta unidad has aprendido a conectar tu backend con el mundo exterior sin comprometer su estabilidad, rendimiento ni seguridad.

Para diseñar e implementar cualquier integración externa profesional, aplica siempre este protocolo de 10 pasos:

<figure class="diagram">
  <figcaption>El protocolo de ingeniería para integraciones externas</figcaption>
  <ol class="flow">
    <li>Utiliza siempre clientes modernos y fluidos: <strong><code>RestClient</code></strong> es el estándar síncrono oficial desde Spring Boot 3.2.</li>
    <li><strong>Nunca reutilices contratos ajenos</strong>: aplica el patrón <strong>Capa Anticorrupción (ACL)</strong> aislando los DTOs del proveedor de tu modelo de dominio.</li>
    <li>Protege la deserialización con <code>@JsonIgnoreProperties(ignoreUnknown = true)</code> para que cambios ajenos no rompan tu aplicación.</li>
    <li><strong>Asume las falacias de la red</strong>: toda llamada saliente debe tener <strong>Timeouts estrictos</strong> (Connect Timeout 2 s o menos, Read Timeout 3 s o menos).</li>
    <li>Aplica el principio de <strong>Degradación Elegante (<em>Graceful Degradation</em>)</strong>: el fallo de una API externa opcional debe producir la respuesta degradada prevista por el contrato; un fallo de programación sigue requiriendo diagnóstico.</li>
    <li>Optimiza el consumo con <strong><code>@Cacheable</code></strong> para ahorrar peticiones, evitar costes y reducir latencias de cientos de milisegundos a 1 ms.</li>
    <li><strong>Sanitiza todo archivo entrante</strong>: almacena los binarios con <strong>UUIDs aleatorios</strong> fuera del classpath y guarda el nombre original solo en base de datos.</li>
    <li>Protege el servidor contra denegación de servicio acotando los tamaños máximos de subida (<code>max-file-size</code> y <code>max-request-size</code>).</li>
    <li><strong>Desacopla efectos secundarios</strong>: emite correos y webhooks de forma asíncrona con <strong><code>@Async</code></strong> y <strong><code>@TransactionalEventListener(phase = AFTER_COMMIT)</code></strong>.</li>
    <li>Protege la descarga de ficheros con la cabecera estándar <code>Content-Disposition: attachment</code> y reglas de autorización de Spring Security.</li>
  </ol>
</figure>

### La idea más importante

> **Todo lo que ocurre fuera de tu servidor fallará tarde o temprano. Integrar con éxito una API o servicio externo no consiste en saber hacer una petición HTTP saliente, sino en diseñar tu aplicación para que siga funcionando cuando el proveedor externo se caiga, cambie su contrato o se quede congelado.**

Un desarrollador principiante asume que la red es mágica y que los proveedores nunca fallan. Un ingeniero de software asume que la red se caerá en el peor momento posible y diseña barreras de contención (timeouts, adaptadores, cachés y degradación elegante) para que sus usuarios nunca sufran las consecuencias.

### Las decisiones que tienes que saber justificar

| Decisión de ingeniería | Lo que tienes que poder defender ante un tribunal |
| :--- | :--- |
| **`RestClient` frente a `RestTemplate` y `WebClient`** | `RestTemplate` está en modo mantenimiento; `WebClient` exige arrastrar la reactividad de WebFlux; `RestClient` ofrece una interfaz fluida moderna y síncrona perfectamente integrada con Spring MVC. |
| **Capa Anticorrupción (ACL) frente a devolver el JSON ajeno** | Reenviar el JSON externo acopla el frontend y la base de datos a decisiones de terceros; el adaptador aísla el modelo y permite transformar códigos crudos en valor de negocio. |
| **`@JsonIgnoreProperties(ignoreUnknown = true)`** | Garantiza robustez y compatibilidad hacia adelante; si el proveedor añade 20 campos nuevos mañana, Jackson los ignora en silencio sin lanzar `UnrecognizedPropertyException`. |
| **Timeouts obligatorios de conexión y lectura** | Previene el colapso por agotamiento de hilos (*Thread Starvation*) en Tomcat; si un proveedor externo se congela, el hilo se libera en 2 segundos en lugar de quedarse bloqueado minutos. |
| **Degradación Elegante (*Graceful Degradation*)** | Si un servicio complementario (como el clima) falla, se devuelven los datos locales principales con un aviso por defecto en lugar de tumbar la experiencia del usuario con un error 500. |
| **Caché en memoria con `@Cacheable`** | Disminuye la latencia de 200 ms a 1 ms, ahorra ancho de banda, respeta los límites de tasa (*rate limits*) del proveedor y permite responder ante caídas temporales del servicio remoto. |
| **Almacenar ficheros con UUID en disco** | Neutraliza el ataque de salto de directorio (*Path Traversal*); el disco físico solo contiene identificadores seguros y la base de datos preserva el nombre original del usuario. |
| **Almacenar ficheros fuera del directorio estático web** | Impide la ejecución remota de código (RCE); un archivo malicioso `.jsp` o `.sh` no puede ser ejecutado directamente por el servidor web mediante una URL pública. |
| **`@TransactionalEventListener(phase = AFTER_COMMIT)`** | Garantiza que las notificaciones externas solo se emitan si la transacción local de base de datos se confirmó con éxito, evitando notificar acciones que sufrieron rollback. |
| **Ejecución asíncrona desacoplada con `@Async`** | Libera inmediatamente al hilo de Tomcat que atiende al usuario (respuesta en milisegundos), trasladando la espera de la red externa a un pool de hilos de fondo. |

### Al terminar la unidad deberías poder responder

1. ¿Qué transformaciones técnicas ocurren cuando el backend pasa de ser un servidor HTTP pasivo a un cliente HTTP saliente?
2. ¿Por qué `RestClient` es la opción recomendada en Spring Boot 3.2+ para aplicaciones síncronas tradicionales?
3. ¿Por qué la latencia de una petición saliente a Internet es órdenes de magnitud mayor que una consulta a PostgreSQL local?
4. ¿En qué consiste el antipatrón de fuga de contratos externos (*External Contract Bleeding*)?
5. ¿Qué tres componentes estructuran el patrón Capa Anticorrupción (ACL) en una integración REST?
6. ¿Qué función cumple la anotación `@JsonIgnoreProperties(ignoreUnknown = true)` en un DTO externo?
7. ¿Cómo transforma un adaptador los códigos numéricos del proveedor en reglas y lógica de dominio propias?
8. ¿Cuáles son las dos falacias de la computación distribuida más peligrosas en el desarrollo backend?
9. ¿Qué es el agotamiento de hilos (*Thread Starvation*) y cómo una llamada externa lenta puede tumbar un servidor Tomcat?
10. ¿Cuál es la diferencia exacta entre *Connect Timeout* y *Read Timeout* en una factoría de conexiones HTTP?
11. ¿Qué es la degradación elegante (*Graceful Degradation*) y cómo se implementa con bloques de captura en servicios de integración?
12. ¿Por qué almacenar en caché una respuesta externa con `@Cacheable` beneficia tanto al rendimiento como a la resiliencia?
13. ¿Por qué el transporte de ficheros binarios sobre HTTP exige el estándar `multipart/form-data`?
14. ¿Cómo opera el ataque de salto de directorio (*Path Traversal*) y por qué renombrar ficheros con UUID en disco lo neutraliza?
15. ¿Por qué nunca se deben guardar ficheros subidos por usuarios dentro de la carpeta `static` del proyecto?
16. ¿Qué cabecera HTTP estándar fuerza la descarga de un fichero con su nombre original en el navegador?
17. ¿Por qué es un error crítico ejecutar llamadas HTTP salientes dentro de un método anotado con `@Transactional`?
18. ¿Qué problema resuelve el uso de Eventos de Dominio junto a `@TransactionalEventListener(phase = AFTER_COMMIT)`?
19. ¿Cómo protege la anotación `@Async` el tiempo de respuesta del controlador frente a notificaciones externas lentas?
20. ¿Qué estrategia permite auditar las llamadas salientes a servicios de terceros para detectar degradaciones de rendimiento?

### El vocabulario de la unidad

| Concepto | Significa |
| :--- | :--- |
| **RestClient** | Cliente HTTP síncrono, moderno y fluido introducido en Spring Boot 3.2 para realizar peticiones salientes con API declarativa. |
| **Outbound HTTP** | Petición HTTP iniciada por el propio servidor backend hacia un servicio o API remota en Internet. |
| **Anticorruption Layer** | Patrón arquitectónico (Capa Anticorrupción) que traduce y aísla los contratos externos ajenos del modelo de dominio interno. |
| **External DTO** | Objeto de transferencia que reproduce fielmente el formato de datos emitido por un proveedor externo. |
| **Connect Timeout** | Tiempo máximo que el cliente HTTP esperará para establecer la conexión TCP y la negociación TLS con el servidor remoto. |
| **Read Timeout** | Tiempo máximo de inactividad permitido entre paquetes de datos una vez que la conexión HTTP ya está abierta. |
| **Thread Starvation** | Agotamiento del pool de hilos de trabajo del servidor al quedar todos bloqueados esperando respuestas externas colgadas. |
| **Graceful Degradation** | Estrategia de diseño donde una aplicación sigue operativa con datos por defecto o funcionalidad reducida ante la caída de un servicio secundario. |
| **Circuit Breaker** | Patrón de estabilidad que interrumpe de inmediato las llamadas hacia un servicio externo averiado para proteger los recursos propios. |
| **Multipart/form-data** | Esquema de codificación HTTP (RFC 7578) para transmitir simultáneamente campos de texto y ficheros binarios divididos por límites. |
| **Path Traversal** | Vulnerabilidad de seguridad donde un atacante utiliza secuencias de salto (`../`) en el nombre de un archivo para escribir en directorios prohibidos. |
| **Content-Disposition** | Cabecera HTTP que indica si un recurso debe presentarse en el navegador (`inline`) o descargarse como fichero adjunto (`attachment`). |
| **MIME Type** | Identificador estándar en dos partes (ej: `application/pdf`) que describe la naturaleza y formato de un archivo transmitido por la red. |
| **Webhook** | Mecanismo de comunicación donde un servidor notifica a otro enviando una petición HTTP POST asíncrona ante un evento relevante. |
| **Domain Event** | Objeto inmutable que representa un hecho consumado de relevancia en el negocio dentro de la aplicación. |
| **@TransactionalEventListener** | Listener de Spring que sincroniza la ejecución de un manejador de eventos con una fase específica de la transacción (ej: tras el commit). |
| **@Async** | Anotación de Spring que desvía la ejecución de un método a un hilo secundario independiente gestionado por un ejecutor de tareas. |

### Comprobación final del producto de la unidad

<div class="checkpoint">
  <p class="checkpoint-label">Integración externa y resiliencia · criterios de producción</p>
  <ul class="checklist">
    <li>Las peticiones salientes utilizan el cliente moderno <code>RestClient</code> con URL base y cabeceras centralizadas.</li>
    <li>Los contratos de proveedores externos están completamente aislados mediante el patrón Capa Anticorrupción (ACL).</li>
    <li>Los DTOs externos utilizan <code>@JsonIgnoreProperties(ignoreUnknown = true)</code> para tolerar adiciones futuras de campos.</li>
    <li>Toda llamada HTTP externa dispone de límites estrictos de <code>Connect Timeout</code> (2 s o menos) y <code>Read Timeout</code> (3 s o menos).</li>
    <li>La aplicación aplica degradación elegante ante caídas de red o errores 4xx/5xx sin colapsar con código 500.</li>
    <li>Las consultas a servicios externos con datos estables se optimizan mediante caché con <code>@Cacheable</code>.</li>
    <li>Los ficheros subidos se almacenan con UUIDs en un directorio externo al proyecto para prevenir ataques de *Path Traversal*.</li>
    <li>Los límites de tamaño para subidas (<code>max-file-size</code>) y validación de tipos MIME están estrictamente configurados.</li>
    <li>La descarga de ficheros está protegida por autorización y emite la cabecera estándar <code>Content-Disposition: attachment</code>.</li>
    <li>Los efectos secundarios (correos y webhooks) se ejecutan de forma asíncrona tras el commit (<code>@TransactionalEventListener</code>).</li>
  </ul>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Resultados de la unidad</p>
  <ul class="checklist">
    <li>Consumir una API externa mediante un cliente HTTP.</li>
    <li>Aislar contratos externos con DTO propios.</li>
    <li>Tratar timeouts, errores y servicios no disponibles.</li>
    <li>Subir y descargar ficheros e integrar correo o webhooks.</li>
  </ul>
</div>

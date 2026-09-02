---
title: "Integraciones externas"
label: "UD10 · Ampliar"
section: "ud-10"
order: 10
lang: "es"
summary: "Conectar el backend con servicios que no controlamos y diseñar el comportamiento cuando la red, el proveedor o los datos no responden como se esperaba."
duration: "12 horas · 2 semanas · 6 sesiones"
modality: "Laboratorio de integración · 20 % guía / 80 % autonomía"
deliverable: "Una integración externa resiliente y una funcionalidad de ficheros, correo o webhook."
date: "2026-09-02"
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

<p class="lead">El backend deja de vivir solo. Al conectarlo con otra API aparecen latencia, formatos ajenos, límites y fallos que no controlamos.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje muy bajo. El profesorado proporciona al comenzar la unidad el contrato del servicio externo y los criterios de aceptación; el diseño del adaptador y de la degradación queda en manos del alumnado.</p>
</div>

## Semana 21 · Consumir sin acoplarse

## Sesión 61 · Consumir una API externa

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la transición de servidor pasivo a cliente HTTP saliente, la evolución de clientes en Spring (<code>RestTemplate</code> frente al moderno y síncrono <code>RestClient</code> introducido en Spring Boot 3.2) y cómo inspeccionar URL, cabeceras, latencia y respuesta remota.</li>
    <li><strong>2. Haz:</strong> configura un bean <code>RestClient</code> en tu aplicación y construye un servicio cliente que realiza una llamada real a la API abierta de Open-Meteo para obtener datos meteorológicos asociados a la ubicación de un proyecto.</li>
    <li><strong>3. Comprueba:</strong> lanzas una petición a tu propio endpoint en Bruno y observas en los logs de Spring Boot la traza de la conexión HTTP saliente (handshake TLS, tiempo de latencia de red y deserialización del JSON externo).</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Hasta ahora tu backend solo recibía peticiones. ¿Qué componentes del sistema operativo y de red entran en juego cuando es tu propio servidor quien inicia una petición hacia el exterior?</li>
    <li>¿Qué clase cliente moderna introdujo Spring Boot 3.2 para sustituir al tradicional <code>RestTemplate</code> con una API fluida y síncrona?</li>
    <li>¿Por qué una consulta a una API externa tarda habitualmente entre 50 y 500 ms mientras que una consulta a PostgreSQL local tarda menos de 2 ms?</li>
  </ol>
</div>

### El backend deja de ser una isla solitaria

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

### Clientes HTTP en Spring Boot: de RestTemplate a RestClient

En el ecosistema Java y Spring han existido tres generaciones de clientes HTTP:

| Cliente HTTP | Estado actual | Estilo de programación | Uso recomendado |
| :--- | :--- | :--- | :--- |
| **`RestTemplate`** | En mantenimiento (desde Spring 5). | Imperativo y rígido (`getForObject`, `exchange`). | Aplicaciones legadas previas a Spring Boot 3. |
| **`WebClient`** | Activo y potente. | Reactivo no bloqueante (Project Reactor / WebFlux). | Aplicaciones asíncronas con flujos reactivos de alta concurrencia. |
| **`RestClient`** | **El estándar moderno (Spring Boot 3.2+).** | **Fluido, declarativo y síncrono.** | **La opción recomendada para el 95 % de APIs REST empresariales en Spring MVC.** |

`RestClient` combina la sencillez síncrona de `RestTemplate` con la elegancia y expresividad de la interfaz fluida de `WebClient`, sin necesidad de arrastrar la complejidad reactiva de WebFlux.

### La API externa de pruebas: Open-Meteo

Para aprender integración utilizaremos la API pública de **Open-Meteo** ([open-meteo.com](https://open-meteo.com)):
* Es completamente gratuita y abierta para uso formativo y de desarrollo.
* **No requiere clave de API (*API key*)**: elimina barreras de registro y credenciales en las primeras prácticas.
* Devuelve datos reales de previsión meteorológica a partir de coordenadas geográficas:
  `https://api.open-meteo.com/v1/forecast?latitude=39.47&longitude=-0.38&current_weather=true`

### Paso a paso guiado · Configuración y primer cliente con RestClient

<p class="stage">Paso 1 · Crear la configuración del cliente RestClient</p>

Configuramos un `@Bean` de `RestClient` en una clase de configuración:

```java
package com.empresa.proyecto.config;

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

<p class="stage">Paso 2 · Implementar el servicio cliente de integración</p>

Creamos un servicio que efectúa la llamada saliente mediante la API fluida de `RestClient`:

```java
package com.empresa.proyecto.integration;

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

<p class="stage">Paso 3 · Exponer un endpoint en el controlador para probar la llamada</p>

```java
package com.empresa.proyecto.controller;

import com.empresa.proyecto.integration.ClimaExternoClient;
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

### La comprobación · Inspección forense de la petición saliente en Bruno

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

### Ahora tú · Parametrizar la ubicación de la sede del proyecto

En lugar de pasar las coordenadas por parámetros de query en cada llamada:
1. Añade a tu entidad `Proyecto` dos campos persistentes: `latitud` (Double) y `longitud` (Double).
2. Modifica el endpoint para que consulte el proyecto en base de datos (`ProyectoRepository.findById(id)`) y utilice automáticamente sus coordenadas geográficas reales.
3. Prueba en Bruno con dos proyectos distintos: uno situado en Valencia (39.47, -0.38) y otro en Madrid (40.41, -3.70), verificando que cada uno devuelve el tiempo atmosférico de su propia ubicación.

### Reto · Consumir la API pública de GitHub para inspeccionar repositorios

Muchos proyectos de software tienen un repositorio de código asociado.
1. Investiga la API pública de GitHub para consultar un repositorio público:
   `GET https://api.github.com/repos/{propietario}/{repositorio}`
2. Configura un segundo cliente `githubRestClient` en `RestClientConfig` añadiendo la cabecera obligatoria `User-Agent`.
3. Implementa un método que consulte un repositorio (por ejemplo, `spring-projects/spring-boot`) y devuelva el número de estrellas (`stargazers_count`) y si está archivado (`archived`).

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Bean `RestClient` configurado y llamada funcional a Open-Meteo recuperando el JSON de respuesta.</span></div>
  <div><strong>Si lo tienes</strong><span>Coordenadas vinculadas a la entidad `Proyecto` y tiempo de latencia registrado en logs.</span></div>
  <div><strong>Reto</strong><span>Segundo cliente HTTP integrado consultando la API de repositorios de GitHub con cabeceras requeridas.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 61</p>
  <ul class="checklist">
    <li>Se comprende el rol dual del backend como servidor entrante y cliente HTTP saliente.</li>
    <li>Se utiliza la API moderna `RestClient` de Spring Boot 3.2 en lugar de clientes obsoletos.</li>
    <li>La URL base y las cabeceras por defecto (`Accept`, `User-Agent`) quedan centralizadas.</li>
    <li>Se observa y mide el impacto de la latencia de red en las peticiones hacia servicios remotos.</li>
    <li>El backend actúa con éxito como orquestador consumiendo datos en tiempo real de Internet.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué Spring introdujo `RestClient` en Spring Boot 3.2 si ya existía `RestTemplate` y `WebClient`?</li>
    <li>¿Qué método de `RestClient` se utiliza para iniciar una petición de tipo GET?</li>
    <li>¿Por qué es una buena práctica definir siempre una cabecera `User-Agent` identificativa al invocar APIs de terceros?</li>
    <li>¿Qué componente de red provoca que una llamada a una API remota sea dos órdenes de magnitud más lenta que una consulta a PostgreSQL?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para ofrecer una interfaz fluida, moderna y síncrona que sustituya al viejo RestTemplate sin obligar al desarrollador a incorporar la complejidad y dependencias reactivas de WebFlux/WebClient.</p>
  <p>2 · El método restClient.get().</p>
  <p>3 · Porque muchos servidores y firewalls externos (como GitHub o Cloudflare) rechazan peticiones sin User-Agent para prevenir abusos de bots anónimos.</p>
  <p>4 · La latencia de propagación física de la red en Internet, la resolución DNS y la negociación criptográfica TLS (handshake HTTPS).</p>
</details>

## Sesión 62 · Cliente HTTP y DTO externos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el grave peligro de la fuga de contratos externos (<em>External Contract Bleeding</em>), el patrón arquitectónico <strong>Capa Anticorrupción (Anticorruption Layer - ACL)</strong> y cómo deserializar JSON ajeno con DTOs de proveedor aislados.</li>
    <li><strong>2. Haz:</strong> modela los DTOs externos con Jackson (<code>@JsonProperty</code>, <code>@JsonIgnoreProperties</code>), construye un mapeador adaptador y transforma la respuesta externa a un modelo de dominio limpio adaptado a las necesidades de tu sistema.</li>
    <li><strong>3. Comprueba:</strong> verificas que tu API expone datos meteorológicos con nomenclatura de tu negocio (en español, tipos numéricos correctos, sin campos innecesarios), demostrando que si el proveedor cambia su JSON, tu frontend y tu base de datos no sufren ningún impacto.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué ocurre con tu aplicación frontend si reenvías directamente el JSON crudo del proveedor externo y este decide renombrar o eliminar un campo el próximo mes?</li>
    <li>¿Qué anotación de Jackson se coloca sobre una clase Java para evitar que falle la deserialización si la API externa devuelve campos adicionales que no hemos mapeado?</li>
    <li>¿En qué consiste el patrón de arquitectura conocido como «Capa Anticorrupción» (*Anticorruption Layer*)?</li>
  </ol>
</div>

### El peligro mortal: Acoplar tu dominio a una API externa

En la sesión anterior devolvimos un `String` con el JSON crudo de Open-Meteo. Aunque sirvió para ver que la red funcionaba, **hacer eso en una aplicación real es un antipatrón arquitectónico gravísimo**:

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

Si devuelves este JSON a tu cliente web o lo guardas tal cual en tu base de datos:
1. **Tu frontend se acopla a las decisiones de un tercero:** Si Open-Meteo cambia `windspeed` por `wind_speed_kmh`, tu pantalla de React/Angular deja de mostrar el viento.
2. **Contaminas tu arquitectura con ruido:** A tu gestor de proyectos no le importa `generationtime_ms` ni `utc_offset_seconds`.
3. **Pérdida de semántica de negocio:** El código `weathercode: 0` es un número incomprensible; tu usuario necesita ver *"Cielo despejado"*.

<div class="rule">
  <p class="rule-label">El principio de la Capa Anticorrupción (ACL)</p>
  <p><strong>Ningún contrato externo debe cruzar la frontera de tu servicio de integración.</strong></p>
  <p>Los datos ajenos deben recibirse en <strong>DTOs Externos</strong> (propios del proveedor) y traducirse inmediatamente a <strong>Modelos Propios</strong> antes de entregarse a la capa de negocio.</p>
</div>

### La arquitectura de aislamiento

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

### Paso a paso guiado · De DTOs externos al modelo de dominio

<p class="stage">Paso 1 · Diseñar los DTOs externos con Jackson</p>

Creamos registros que representan exactamente la estructura que envía Open-Meteo. Usamos `@JsonIgnoreProperties(ignoreUnknown = true)` para que Jackson ignore de forma segura cualquier campo que no nos interese:

```java
package com.empresa.proyecto.integration.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record OpenMeteoResponse(
    double latitude,
    double longitude,
    @JsonProperty("current_weather") CurrentWeatherExternal current
) {}
```

Y el objeto anidado `CurrentWeatherExternal`:

```java
package com.empresa.proyecto.integration.dto;

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

<p class="stage">Paso 2 · Diseñar el DTO interno del Dominio</p>

Este es el contrato que le pertenece a **nuestra aplicación**: nombres limpios, unidades explícitas y descripción humana:

```java
package com.empresa.proyecto.dto;

public record ClimaProyectoResponse(
    double temperaturaCelsius,
    double velocidadVientoKmH,
    String descripcionClima,
    boolean esFavorableParaTrabajoExterior
) {}
```

<p class="stage">Paso 3 · Crear el adaptador de traducción (Mapper)</p>

El adaptador interpreta los códigos numéricos del proveedor y genera nuestra regla de negocio:

```java
package com.empresa.proyecto.integration;

import com.empresa.proyecto.dto.ClimaProyectoResponse;
import com.empresa.proyecto.integration.dto.OpenMeteoResponse;
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

<p class="stage">Paso 4 · Conectar el cliente tipado en el servicio</p>

Modificamos el cliente para que deserialice directamente al DTO externo y devuelva el modelo interno mediante el adaptador:

```java
package com.empresa.proyecto.integration;

import com.empresa.proyecto.dto.ClimaProyectoResponse;
import com.empresa.proyecto.integration.dto.OpenMeteoResponse;
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

### La comprobación · El contrato limpio en Bruno

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

### Ahora tú · Integrar el clima en la respuesta completa del proyecto

Modifica `ProyectoResponse` (el DTO que devuelve `GET /api/v1/proyectos/{id}`):
1. Añade un campo opcional `ClimaProyectoResponse clima`.
2. En `ProyectoService.obtenerPorId(id)`, llama a `climaService.consultarClima(proyecto.getLatitud(), proyecto.getLongitud())` e incrusta el clima en la respuesta.
3. Verifica con Bruno que al consultar los detalles de un proyecto, la respuesta contiene tanto los datos de la base de datos local (nombre, cliente, tareas) como el clima en tiempo real de su ubicación.

### Reto · Pruebas unitarias del Adaptador sin llamadas de red

Una de las enormes ventajas de la Capa Anticorrupción es que el mapeador puede probarse al 100 % sin levantar la red ni llamar a Internet:
1. Crea una clase de test `ClimaAdapterTest`.
2. Instancia objetos `OpenMeteoResponse` simulados con diferentes códigos (ej: código 0, código 63, código 95).
3. Verifica mediante aserciones de JUnit que:
   * El código 0 traduce a `"Cielo despejado"` y `esFavorableParaTrabajoExterior` es `true`.
   * Un viento de 55 km/h o un código 95 (tormenta) marca `esFavorableParaTrabajoExterior` en `false`.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>DTOs externos anotados con `@JsonIgnoreProperties` y deserialización automática con Jackson.</span></div>
  <div><strong>Si lo tienes</strong><span>Adaptador `ClimaAdapter` desacoplando el modelo ajeno y traduciendo a `ClimaProyectoResponse`.</span></div>
  <div><strong>Reto</strong><span>Suite de pruebas unitarias sobre el adaptador validando reglas de negocio climáticas sin red.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 62</p>
  <ul class="checklist">
    <li>Se erradica el antipatrón de propagar JSONs ajenos por el controlador y el dominio.</li>
    <li>Se comprende y aplica el patrón Capa Anticorrupción (Anticorruption Layer - ACL).</li>
    <li>La anotación `@JsonIgnoreProperties(ignoreUnknown = true)` protege ante campos nuevos imprevistos.</li>
    <li>Los DTOs propios reflejan la semántica, unidades y reglas de negocio de la aplicación.</li>
    <li>El adaptador aísla el resto del backend ante cualquier evolución del contrato del proveedor.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es una mala práctica arquitectónica usar las mismas clases para deserializar una API ajena que para exponer datos a tu frontend?</li>
    <li>¿Qué hace la anotación `@JsonProperty("current_weather")` en un atributo Java?</li>
    <li>¿Qué ocurriría al deserializar un JSON con Jackson si el proveedor añade un campo nuevo y la clase no tiene `@JsonIgnoreProperties(ignoreUnknown = true)`?</li>
    <li>¿Dónde reside la regla de negocio que decide si el clima es favorable para trabajar en el exterior?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque cualquier cambio o deprecación en la API del proveedor externo rompería de forma involuntaria el contrato de tu propio frontend.</p>
  <p>2 · Mapea el nombre del campo en el JSON entrante con el nombre del atributo o parámetro en la clase Java cuando no coinciden exactamente.</p>
  <p>3 · Lanzaría una excepción de tipo UnrecognizedPropertyException y la petición fallaría con error 500.</p>
  <p>4 · En el adaptador o en un servicio de dominio de nuestra aplicación, nunca en los DTOs externos ni en el proveedor remoto.</p>
</details>

## Sesión 63 · Errores, timeouts y servicios no disponibles

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> las falacias de la computación distribuida, el peligro mortal del agotamiento de hilos (<em>Thread Starvation</em>) por llamadas colgadas, la configuración obligatoria de <strong>Timeouts de conexión y lectura</strong>, y el patrón de <strong>Degradación Elegante (Graceful Degradation)</strong>.</li>
    <li><strong>2. Haz:</strong> configura límites temporales estrictos en <code>RestClient</code> mediante <code>ClientHttpRequestFactory</code>, captura errores remotos (4xx y 5xx) y construye un mecanismo de contingencia para que la caída del servicio externo nunca tumbe el backend.</li>
    <li><strong>3. Comprueba:</strong> simulas caídas de red e IPs inalcanzables, comprobando que tu servidor corta la espera en 2 segundos y responde al cliente con los datos locales del proyecto y una advertencia amigable sin lanzar un error 500.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué le ocurre a un servidor web Tomcat si 200 usuarios hacen una petición a un endpoint cuya llamada externa se queda congelada durante 60 segundos sin responder?</li>
    <li>¿Cuál es la diferencia entre un <em>Connect Timeout</em> y un <em>Read Timeout</em>?</li>
    <li>¿Por qué es inaceptable que la caída de un servicio secundario (como el clima) impida a un usuario consultar o editar los datos principales de su proyecto?</li>
  </ol>
</div>

### La falacia de la red fiable y el colapso de hilos

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

### Configuración obligatoria: Connect Timeout y Read Timeout

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

### Paso a paso guiado · Configuración de timeouts y degradación elegante

<p class="stage">Paso 1 · Configurar la factoría de peticiones con timeouts en RestClientConfig</p>

Configuramos `SimpleClientHttpRequestFactory` con límites estrictos parametrizados en `application.properties`:

```java
package com.empresa.proyecto.config;

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

<p class="stage">Paso 2 · Manejo de excepciones y Degradación Elegante en ClimaService</p>

Protegemos la llamada con un bloque `try-catch` específico que captura fallos de red (`ResourceAccessException`) y errores HTTP del servidor remoto (`HttpStatusCodeException`):

```java
package com.empresa.proyecto.integration;

import com.empresa.proyecto.dto.ClimaProyectoResponse;
import com.empresa.proyecto.integration.dto.OpenMeteoResponse;
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

            return climaAdapter.adaptar(external);

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
            0.0,
            0.0,
            aviso,
            true // No bloqueamos el trabajo por falta de clima
        );
    }
}
```

### La comprobación · Simulación de fallo en Bruno

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

### Ahora tú · Cachear respuestas climáticas para ahorrar peticiones

El tiempo meteorológico no cambia cada medio segundo: consultar la API en cada petición a `/proyectos/{id}` desperdicia ancho de banda y aumenta la latencia innecesariamente.

1. Activa la caché en tu proyecto con `@EnableCaching` en tu clase principal o en `CacheConfig`.
2. Decora el método `consultarClimaSeguro` con `@Cacheable("clima")`:
   ```java
   @Cacheable(value = "clima", key = "#latitud + '_' + #longitud")
   public ClimaProyectoResponse consultarClimaSeguro(double latitud, double longitud) { ... }
   ```
3. Lanza dos peticiones consecutivas en Bruno al mismo proyecto:
   * Primera petición: tarda ~200 ms (llama a Internet).
   * Segunda petición: responde en 1 ms (se recupera instantáneamente de la memoria caché de Spring).

### Reto · El patrón Circuit Breaker con Resilience4j

Cuando un servicio externo está completamente caído, reintentar la conexión 200 veces por segundo sigue consumiendo 2 segundos de timeout en cada petición.

Investiga la librería **Resilience4j**:
1. ¿Qué es un **Disyuntor (*Circuit Breaker*)** y cuáles son sus tres estados (`CLOSED`, `OPEN`, `HALF_OPEN`)?
2. ¿Por qué en estado `OPEN` el disyuntor corta la llamada de inmediato (en 0 ms) ejecutando el método de fallback sin tocar la red?
3. Diseña en un documento técnico las ventajas de incorporar Resilience4j en integraciones críticas.

> [!NOTE]
> Si en la evaluación se solicita un informe técnico sobre resiliencia, políticas de timeout y contingencia ante caída de proveedores externos, el formato oficial de entrega de texto es siempre un **documento en PDF** (`analisis-resiliencia.pdf`), nunca un archivo markdown suelto.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Factoría de conexiones configurada con Connect Timeout (2s) y Read Timeout (3s).</span></div>
  <div><strong>Si lo tienes</strong><span>Tratamiento de `ResourceAccessException` y degradación elegante devolviendo datos locales con aviso.</span></div>
  <div><strong>Reto</strong><span>Caché en memoria con `@Cacheable` y diseño conceptual del patrón Circuit Breaker con Resilience4j.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 63</p>
  <ul class="checklist">
    <li>Se comprenden las falacias de la computación distribuida y el riesgo de agotamiento de hilos.</li>
    <li>Los timeouts de conexión y lectura están configurados y parametrizados por entorno.</li>
    <li>La aplicación no colapsa con error 500 cuando un proveedor externo sufre una avería.</li>
    <li>Se aplica degradación elegante (*Graceful Degradation*) manteniendo la operatividad local.</li>
    <li>Se comprueba que la respuesta se recupera en tiempo acotado ante caídas de conectividad.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué es el agotamiento de hilos (*Thread Starvation*) y cómo lo provoca una llamada externa colgada?</li>
    <li>¿Qué excepción lanza Spring cuando se agota el tiempo límite de conexión configurado en `RestClient`?</li>
    <li>¿En qué consiste el principio de degradación elegante (*Graceful Degradation*)?</li>
    <li>¿Por qué almacenar en caché una respuesta meteorológica durante 15 minutos mejora tanto el rendimiento como la resiliencia?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Es la saturación del pool de hilos de trabajo de Tomcat al quedar todos bloqueados esperando respuestas externas lentas, impidiendo atender cualquier otra petición entrante al servidor.</p>
  <p>2 · Lanza org.springframework.web.client.ResourceAccessException (que envuelve un SocketTimeoutException o ConnectException).</p>
  <p>3 · Es la capacidad de un sistema de seguir funcionando y ofreciendo su servicio principal con funcionalidad reducida o datos por defecto cuando un componente secundario falla.</p>
  <p>4 · Reduce drásticamente la latencia para el usuario (de ~200 ms a ~1 ms), ahorra ancho de banda y peticiones contra la API externa, y permite responder con datos recientes si el proveedor sufre una caída temporal.</p>
</details>


## Semana 22 · Ficheros y eventos

## Sesión 64 · Subida y descarga de ficheros

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> aceptar un archivo sin límites abre problemas de seguridad, espacio y trazabilidad.</li>
    <li><strong>Construye:</strong> adjuntos de una incidencia con descarga autorizada.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **validar, almacenar y servir un fichero controlando nombre, tipo, tamaño y autorización**.

### 2. El problema

Aceptar un archivo sin límites abre problemas de seguridad, espacio y trazabilidad.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido adjuntos de una incidencia con descarga autorizada.</li>
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

## Sesión 65 · Correo, servicio externo o webhook

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> notificar otro sistema introduce un segundo resultado que puede fallar después de guardar el dato principal.</li>
    <li><strong>Construye:</strong> un correo o webhook encapsulado con registro de éxito y fallo.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **integrar una salida asíncrona o una notificación sin mezclarla con el controller**.

### 2. El problema

Notificar otro sistema introduce un segundo resultado que puede fallar después de guardar el dato principal.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un correo o webhook encapsulado con registro de éxito y fallo.</li>
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

## Sesión 66 · Miniintegración

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una demo aislada no demuestra que la integración respete las reglas de la aplicación.</li>
    <li><strong>Construye:</strong> una funcionalidad integrada con camino feliz y degradación comprobados.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **combinar persistencia, seguridad y un servicio externo en un caso de uso completo**.

### 2. El problema

Una demo aislada no demuestra que la integración respete las reglas de la aplicación.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una funcionalidad integrada con camino feliz y degradación comprobados.</li>
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
    <li>Consumir una API externa mediante un cliente HTTP.</li>
    <li>Aislar contratos externos con DTO propios.</li>
    <li>Tratar timeouts, errores y servicios no disponibles.</li>
    <li>Subir y descargar ficheros e integrar correo o webhooks.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

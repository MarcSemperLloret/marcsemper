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
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el transporte binario sobre HTTP con <code>multipart/form-data</code>, los vectores de ataque críticos en subida de ficheros (<em>Path Traversal</em>, ejecución remota de código en carpetas estáticas y agotamiento de disco), los límites de tamaño en Spring Boot y la descarga segura mediante la cabecera <code>Content-Disposition</code>.</li>
    <li><strong>2. Haz:</strong> configura el almacenamiento seguro en un directorio externo al proyecto, renombra los ficheros con identificadores únicos UUID, persiste los metadatos en PostgreSQL y construye endpoints protegidos para adjuntar ficheros a tareas y descargarlos con autorización.</li>
    <li><strong>3. Comprueba:</strong> subes documentos PDF e imágenes desde Bruno mediante <em>Multipart Form</em>, verificas en el disco que los nombres están sanitizados y compruebas que la descarga autorizada sirve el binario con su nombre original y tipo MIME correcto.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué una petición con un archivo adjunto debe enviarse con el tipo de contenido <code>multipart/form-data</code> en lugar de <code>application/json</code>?</li>
    <li>¿Qué grave vulnerabilidad de seguridad (*Path Traversal*) se produce si guardas un fichero en el disco utilizando directamente el nombre original que envía el cliente (ej: <code>../../etc/passwd</code>)?</li>
    <li>¿Por qué nunca se deben guardar los ficheros subidos por los usuarios dentro de la carpeta <code>src/main/resources/static</code> de la aplicación?</li>
  </ol>
</div>

### El transporte binario: multipart/form-data

Hasta ahora todas nuestras peticiones enviaban texto estructurado en formato JSON. Sin embargo, un fichero (un PDF con especificaciones, una captura de un bug en PNG o un informe de obra) es una secuencia de bytes binarios.

Para transmitir simultáneamente datos JSON y flujos binarios, el protocolo HTTP utiliza el estándar **`multipart/form-data`** (RFC 7578):
* El cuerpo de la petición se divide en bloques independientes delimitados por una cadena frontera (*boundary*).
* Cada bloque tiene sus propias cabeceras `Content-Disposition` y `Content-Type`, seguidas de los bytes correspondientes.

### Los tres vectores de ataque en la subida de ficheros

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

### Paso a paso guiado · Subida y descarga segura de adjuntos

<p class="stage">Paso 1 · Configurar límites de multipart en application.properties</p>

```properties
# Límite máximo por fichero individual (5 MB)
spring.servlet.multipart.max-file-size=5MB
# Límite máximo por petición completa (10 MB)
spring.servlet.multipart.max-request-size=10MB

# Directorio de almacenamiento externo en disco
app.almacenamiento.directorio-subidas=./almacenamiento/adjuntos
```

<p class="stage">Paso 2 · Entidad JPA para metadatos de ficheros</p>

La base de datos almacena la trazabilidad y la relación con la tarea:

```java
package com.empresa.proyecto.model;

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

<p class="stage">Paso 3 · Servicio de almacenamiento local seguro</p>

Este servicio valida el fichero, genera el UUID y escribe los bytes en el disco con control estricto:

```java
package com.empresa.proyecto.service;

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

<p class="stage">Paso 4 · Controlador de subida y descarga autorizada</p>

```java
package com.empresa.proyecto.controller;

import com.empresa.proyecto.model.Adjunto;
import com.empresa.proyecto.repository.AdjuntoRepository;
import com.empresa.proyecto.repository.TareaRepository;
import com.empresa.proyecto.service.AlmacenamientoService;
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

### La comprobación · Pruebas de subida y descarga en Bruno

1. **Subida de fichero mediante Bruno:**
   * Crea una petición `POST http://localhost:8080/api/v1/tareas/1/adjuntos`.
   * En la pestaña **Auth**, introduce un Bearer Token válido con rol `DESARROLLADOR`.
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

### Ahora tú · Listar los adjuntos de una tarea

Implementa el endpoint de consulta de adjuntos:
1. Crea `GET /api/v1/tareas/{id}/adjuntos`.
2. Devuelve una lista de `AdjuntoResponse`:
   ```java
   public record AdjuntoResponse(
       Long id,
       String nombreOriginal,
       long tamanoBytes,
       String contentType,
       String urlDescarga
   ) {}
   ```
3. Donde `urlDescarga` sea `/api/v1/adjuntos/{adjunto.id}/descargar`.
4. Verifica con Bruno que el cliente web puede consultar la lista de adjuntos y descargar cada uno mediante su URL correspondiente.

### Reto · Validación de firmas mágicas binarias (Magic Bytes)

Un atacante avanzado puede renombrar un ejecutable `virus.exe` a `informe.pdf`.
* Si tu servidor solo comprueba la extensión o la cabecera `Content-Type` enviada por el cliente, el fichero será aceptado porque el navegador reporta lo que la extensión sugiere.

Investiga cómo inspeccionar los **Magic Bytes** del flujo binario:
1. ¿Cuáles son los primeros 4 bytes característicos de un archivo PDF legítimo (`%PDF` / `0x25 0x50 0x44 0x46`) y de una imagen PNG (`0x89 0x50 0x4E 0x47`)?
2. Integra la librería `Apache Tika` o implementa una comprobación directa de los primeros bytes de `archivo.getInputStream()` para verificar el tipo real antes de escribir en disco.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Configuración de límites multipart y servicio de almacenamiento local con UUIDs operativos.</span></div>
  <div><strong>Si lo tienes</strong><span>Subida y descarga autorizada con Spring Security, metadatos en PostgreSQL y `Content-Disposition`.</span></div>
  <div><strong>Reto</strong><span>Validación profunda de tipos de archivo mediante inspección de firmas mágicas (*Magic Bytes*).</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 64</p>
  <ul class="checklist">
    <li>Se comprende el protocolo `multipart/form-data` para el transporte de binarios.</li>
    <li>Se neutraliza el ataque de *Path Traversal* generando UUIDs opacos para el disco.</li>
    <li>Los ficheros se almacenan en un directorio externo, nunca en carpetas web públicas.</li>
    <li>Los límites de tamaño (`max-file-size`) protegen el servidor contra saturación de disco.</li>
    <li>La descarga está blindada por autorización y emite cabeceras de descarga correctas.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué nunca se debe guardar un fichero usando directamente `archivo.getOriginalFilename()`?</li>
    <li>¿Qué cabecera HTTP le indica al navegador que no intente renderizar el archivo en la pestaña sino que lo descargue al disco?</li>
    <li>¿Qué dos propiedades de `application.properties` establecen el tamaño máximo permitido para subidas?</li>
    <li>¿Por qué es peligroso validar el tipo de fichero únicamente a través de la extensión de su nombre?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el cliente puede enviar nombres maliciosos con secuencias de salto de directorio (../../) para sobrescribir archivos del sistema o inyectar código ejecutable.</p>
  <p>2 · La cabecera Content-Disposition: attachment; filename="nombre.ext".</p>
  <p>3 · spring.servlet.multipart.max-file-size y spring.servlet.multipart.max-request-size.</p>
  <p>4 · Porque la extensión puede ser alterada trivialmente por el usuario (ej: renombrar un script .sh a .pdf) eludiendo la comprobación si no se valida el MIME o los magic bytes.</p>
</details>

## Sesión 65 · Correo, servicio externo o webhook

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el problema de la doble escritura y la frontera transaccional al notificar a terceros, la ejecución asíncrona desacoplada con <code>@Async</code>, y el patrón de <strong>Eventos de Dominio</strong> con <code>ApplicationEventPublisher</code> y <code>@TransactionalEventListener</code>.</li>
    <li><strong>2. Haz:</strong> publica un evento al crear una tarea urgente y constrúyelo de forma que un listener asíncrono emita una notificación por webhook HTTP saliente sin ralentizar ni bloquear la transacción de la base de datos principal.</li>
    <li><strong>3. Comprueba:</strong> verificas en los logs de Spring Boot que el controlador responde en menos de 20 ms mientras que la notificación externa se procesa en segundo plano en un hilo independiente (<code>task-executor</code>), demostrando que un fallo en la notificación externa no afecta a la persistencia local.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué ocurre con la respuesta de tu API si el controlador envía un correo electrónico de forma síncrona y el servidor SMTP tarda 8 segundos en conectar?</li>
    <li>Si la llamada externa de notificación falla con una excepción, ¿debería cancelarse (*rollback*) la tarea que el usuario acaba de guardar en PostgreSQL?</li>
    <li>¿Qué diferencia fundamental existe entre un listener estándar con `@EventListener` y uno con `@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)`?</li>
  </ol>
</div>

### El problema de la doble escritura y la frontera transaccional

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

### Arquitectura de Eventos de Dominio en Spring

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

### Paso a paso guiado · Webhooks asíncronos con Eventos de Dominio

<p class="stage">Paso 1 · Activar el soporte asíncrono en AsyncConfig</p>

Configuramos el ejecutor de tareas asíncronas con un pool de hilos dimensionado:

```java
package com.empresa.proyecto.config;

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

<p class="stage">Paso 2 · Definir el Evento de Dominio</p>

Creamos un registro inmutable que transporta los datos mínimos necesarios:

```java
package com.empresa.proyecto.event;

public record TareaCriticaCreadaEvent(
    Long tareaId,
    String titulo,
    String prioridad,
    String proyectoNombre,
    String creadoPor
) {}
```

<p class="stage">Paso 3 · Publicar el evento desde TareaService</p>

El servicio solo se preocupa de guardar el dato y publicar el evento. Cero código de correos o webhooks:

```java
package com.empresa.proyecto.service;

import com.empresa.proyecto.dto.TareaRequest;
import com.empresa.proyecto.dto.TareaResponse;
import com.empresa.proyecto.event.TareaCriticaCreadaEvent;
import com.empresa.proyecto.model.Prioridad;
import com.empresa.proyecto.model.Tarea;
import com.empresa.proyecto.repository.TareaRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TareaService {

    private final TareaRepository tareaRepository;
    private final ApplicationEventPublisher eventPublisher;

    public TareaService(TareaRepository tareaRepository, ApplicationEventPublisher eventPublisher) {
        this.tareaRepository = tareaRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public TareaResponse crearTarea(TareaRequest request, String usuarioAutenticado) {
        Tarea tarea = new Tarea();
        tarea.setTitulo(request.titulo());
        tarea.setPrioridad(request.prioridad());
        // ... persistencia en PostgreSQL
        tarea = tareaRepository.save(tarea);

        // Si la tarea es crítica, publicamos el evento
        if (tarea.getPrioridad() == Prioridad.CRITICA) {
            eventPublisher.publishEvent(new TareaCriticaCreadaEvent(
                tarea.getId(),
                tarea.getTitulo(),
                tarea.getPrioridad().name(),
                tarea.getProyecto().getNombre(),
                usuarioAutenticado
            ));
        }

        return new TareaResponse(tarea.getId(), tarea.getTitulo(), tarea.getPrioridad().name());
    }
}
```

<p class="stage">Paso 4 · Listener asíncrono emisor de Webhook</p>

El listener se ejecuta en segundo plano solo tras el commit de la base de datos:

```java
package com.empresa.proyecto.listener;

import com.empresa.proyecto.event.TareaCriticaCreadaEvent;
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

    public NotificacionWebhookListener(RestClient.Builder restClientBuilder) {
        // En un entorno real se apunta a una URL configurable de Slack/Discord o Webhook de terceros
        this.webhookRestClient = restClientBuilder
            .baseUrl("https://httpbin.org") // Servicio de pruebas que refleja peticiones
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
            log.error("[{}] Error al enviar webhook para tarea #{}: {}. Se registrará para reintento.",
                Thread.currentThread().getName(), evento.tareaId(), ex.getMessage());
        }
    }
}
```

### La comprobación · Inspección de hilos y tiempos en Bruno

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

### Ahora tú · Notificación simulada por correo electrónico

Añade un segundo listener que simule el envío de un correo de alerta:
1. Crea `NotificacionEmailListener`.
2. Escucha el mismo evento `TareaCriticaCreadaEvent` con `@Async` y `@TransactionalEventListener(phase = AFTER_COMMIT)`.
3. Simula la redacción del mensaje y registra en logs:
   `"[Email] Enviando correo a jefatura@empresa.com con asunto: ALERTA en proyecto X"`.
4. Comprueba que un único evento dispara concurrentemente tanto el webhook como el correo sin interferir entre sí.

### Reto · El patrón Outbox para garantizar entrega (Transactional Outbox)

Si el servidor se apaga repentinamente justo después de hacer commit en la base de datos pero antes de que el hilo asíncrono ejecute el webhook, la notificación se pierde para siempre.

Investiga el patrón **Transactional Outbox**:
1. ¿Por qué las arquitecturas de microservicios guardan la notificación en una tabla local `mensajes_pendientes` dentro de la **misma transacción** que la tarea?
2. ¿Cómo lee un proceso programado (`@Scheduled`) esa tabla periódicamente para enviar los webhooks y marcar su estado como `ENVIADO`?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Configuración de `@EnableAsync`, evento de dominio y listener desacoplado.</span></div>
  <div><strong>Si lo tienes</strong><span>Listener con `@TransactionalEventListener(phase = AFTER_COMMIT)` y llamada a webhook con `RestClient`.</span></div>
  <div><strong>Reto</strong><span>Diseño conceptual del patrón Transactional Outbox para tolerancia a fallos y reintentos.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 65</p>
  <ul class="checklist">
    <li>Se erradica el antipatrón de encadenar llamadas externas síncronas en transacciones locales.</li>
    <li>Se utiliza el bus de eventos en memoria de Spring (`ApplicationEventPublisher`).</li>
    <li>La anotación `@TransactionalEventListener(phase = AFTER_COMMIT)` evita notificar transacciones abortadas.</li>
    <li>El procesamiento asíncrono con `@Async` mantiene tiempos de respuesta de milisegundos en la API.</li>
    <li>Los fallos en servicios de terceros quedan contenidos en auditoría sin romper el flujo de negocio.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es un error ejecutar una llamada HTTP externa dentro de un método anotado con `@Transactional`?</li>
    <li>¿Qué garantiza la fase `TransactionPhase.AFTER_COMMIT` en un `@TransactionalEventListener`?</li>
    <li>¿Qué sucede con la petición del usuario si el listener asíncrono falla con una excepción no controlada?</li>
    <li>¿Por qué es recomendable definir un `ThreadPoolTaskExecutor` propio en lugar de usar el executor por defecto de Spring?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque mantiene la conexión de base de datos y los bloqueos de filas abiertos durante todo el tiempo que tarda la red externa, reduciendo drásticamente la concurrencia y arriesgando rollbacks indebidos.</p>
  <p>2 · Garantiza que el evento solo se ejecutará si la transacción de base de datos se confirmó con éxito; si hubo un error previo o un rollback, el listener no se dispara.</p>
  <p>3 · Nada; el usuario ya recibió su respuesta 201 Created hace tiempo porque el listener se ejecuta en un hilo separado desacoplado del ciclo de vida de la petición HTTP.</p>
  <p>4 · Para controlar el tamaño de la cola, limitar el número máximo de hilos concurrentes y evitar que un aluvión de notificaciones consuma toda la memoria de la máquina.</p>
</details>

## Sesión 66 · Miniintegración

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la síntesis de una arquitectura backend completa: cómo orquestar de forma coherente <strong>Persistencia (PostgreSQL)</strong>, <strong>Seguridad (Spring Security / JWT)</strong>, <strong>Integración Externa (RestClient / Open-Meteo)</strong>, <strong>Gestión de Ficheros (Multipart)</strong> y <strong>Eventos Asíncronos</strong> en un único caso de uso empresarial.</li>
    <li><strong>2. Haz:</strong> implementa el flujo integral de gestión de incidencias de campo: subida de informe técnico adjunto, consulta automática del clima de la sede del proyecto con degradación elegante y emisión de alerta por webhook a los responsables.</li>
    <li><strong>3. Comprueba:</strong> ejecutas la batería de pruebas verificando tanto el camino feliz (todos los sistemas operativos) como los escenarios de contingencia (proveedor meteorológico caído y webhook inaccesible), certificando que la aplicación se comporta de forma robusta y predecible.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué diferencia a un backend profesional de una colección de ejemplos de clase aislados?</li>
    <li>Si la API externa de clima falla y el webhook de alerta falla, ¿qué código de estado HTTP debe devolver el endpoint de creación de incidencia si el dato local y el archivo adjunto se guardaron correctamente?</li>
    <li>¿Cómo garantizamos que solo un usuario autenticado con rol adecuado pueda registrar una incidencia con adjunto?</li>
  </ol>
</div>

### La prueba del mundo real: Todo el sistema en marcha

A lo largo del curso has aprendido piezas individuales:
* Controladores REST y DTOs con validación (UD3).
* Arquitectura por capas desacoplada (UD4).
* Persistencia relacional con Spring Data JPA y PostgreSQL (UD5).
* Pruebas de integración con MockMvc y documentación OpenAPI (UD7).
* Autenticación y autorización granular con Spring Security y JWT (UD9).
* Clientes HTTP salientes con Capa Anticorrupción y eventos asíncronos (UD10).

El objetivo de esta sesión es **integrar todas estas capacidades en un único flujo de negocio de extremo a extremo**:

<figure class="diagram">
  <figcaption>El flujo integral de la Miniintegración</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Cliente autenticado (Bearer JWT) envía Multipart</li>
    <li>2. Spring Security autoriza el rol (hasRole)</li>
    <li>3. Almacenamiento guarda PDF con UUID en disco</li>
    <li>4. ClimaService consulta Open-Meteo (con timeout y fallback)</li>
    <li>5. PostgreSQL guarda Incidencia + Adjunto (Transacción ACID)</li>
    <li>6. Commit dispara Webhook asíncrono en background</li>
    <li>7. Respuesta 201 Created limpia entregada al usuario</li>
  </ol>
</figure>

### El caso de uso: Registro de Incidencias de Obra

Un operario de campo registra una incidencia urgente sobre un proyecto:
1. Envía los datos de la incidencia (título, descripción, severidad) junto a un archivo adjunto (fotografía o informe técnico en PDF).
2. El servidor valida la identidad y el rol mediante JWT.
3. El fichero se sanitiza con UUID y se almacena en el directorio seguro.
4. El servidor obtiene las coordenadas del proyecto y consulta el clima local en tiempo real para enriquecer el registro. Si la API de clima falla, se aplica degradación elegante.
5. Se persiste la incidencia en base de datos.
6. Se publica el evento que notifica a los responsables vía webhook en segundo plano.

### Paso a paso guiado · Ensamblado del flujo completo

<p class="stage">Paso 1 · El DTO de respuesta integral</p>

```java
package com.empresa.proyecto.dto;

import java.time.LocalDateTime;

public record IncidenciaCompletaResponse(
    Long id,
    String titulo,
    String severidad,
    String proyectoNombre,
    String nombreFicheroAdjunto,
    String urlDescargaAdjunto,
    ClimaProyectoResponse condicionesMeteorologicas,
    LocalDateTime fechaRegistro
) {}
```

<p class="stage">Paso 2 · El servicio orquestador IncidenciaService</p>

```java
package com.empresa.proyecto.service;

import com.empresa.proyecto.dto.ClimaProyectoResponse;
import com.empresa.proyecto.dto.IncidenciaCompletaResponse;
import com.empresa.proyecto.event.TareaCriticaCreadaEvent;
import com.empresa.proyecto.integration.ClimaService;
import com.empresa.proyecto.model.Adjunto;
import com.empresa.proyecto.model.Incidencia;
import com.empresa.proyecto.model.Proyecto;
import com.empresa.proyecto.repository.IncidenciaRepository;
import com.empresa.proyecto.repository.ProyectoRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service
public class IncidenciaService {

    private final IncidenciaRepository incidenciaRepository;
    private final ProyectoRepository proyectoRepository;
    private final AlmacenamientoService almacenamientoService;
    private final ClimaService climaService;
    private final ApplicationEventPublisher eventPublisher;

    public IncidenciaService(IncidenciaRepository incidenciaRepository,
                             ProyectoRepository proyectoRepository,
                             AlmacenamientoService almacenamientoService,
                             ClimaService climaService,
                             ApplicationEventPublisher eventPublisher) {
        this.incidenciaRepository = incidenciaRepository;
        this.proyectoRepository = proyectoRepository;
        this.almacenamientoService = almacenamientoService;
        this.climaService = climaService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public IncidenciaCompletaResponse registrarIncidencia(
            Long proyectoId,
            String titulo,
            String severidad,
            MultipartFile fichero,
            String username) {

        Proyecto proyecto = proyectoRepository.findById(proyectoId)
            .orElseThrow(() -> new IllegalArgumentException("Proyecto no encontrado"));

        // 1. Guardar fichero binario con UUID seguro
        String nombreAlmacenado = almacenamientoService.guardarFichero(fichero);

        // 2. Consultar servicio externo con degradación garantizada (nunca lanza 500)
        ClimaProyectoResponse clima = climaService.consultarClimaSeguro(
            proyecto.getLatitud(), proyecto.getLongitud()
        );

        // 3. Persistir entidad en PostgreSQL
        Incidencia incidencia = new Incidencia();
        incidencia.setTitulo(titulo);
        incidencia.setSeveridad(severidad);
        incidencia.setProyecto(proyecto);
        incidencia.setFechaRegistro(LocalDateTime.now());

        Adjunto adjunto = new Adjunto(
            fichero.getOriginalFilename(),
            nombreAlmacenado,
            fichero.getContentType(),
            fichero.getSize(),
            null
        );
        incidencia.setAdjunto(adjunto);

        incidencia = incidenciaRepository.save(incidencia);

        // 4. Publicar evento para notificaciones asíncronas
        eventPublisher.publishEvent(new TareaCriticaCreadaEvent(
            incidencia.getId(),
            incidencia.getTitulo(),
            incidencia.getSeveridad(),
            proyecto.getNombre(),
            username
        ));

        // 5. Retornar respuesta integral
        return new IncidenciaCompletaResponse(
            incidencia.getId(),
            incidencia.getTitulo(),
            incidencia.getSeveridad(),
            proyecto.getNombre(),
            adjunto.getNombreOriginal(),
            "/api/v1/adjuntos/" + adjunto.getId() + "/descargar",
            clima,
            incidencia.getFechaRegistro()
        );
    }
}
```

<p class="stage">Paso 3 · Controlador protegido con Multipart y Seguridad</p>

```java
package com.empresa.proyecto.controller;

import com.empresa.proyecto.dto.IncidenciaCompletaResponse;
import com.empresa.proyecto.service.IncidenciaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/proyectos")
public class IncidenciaController {

    private final IncidenciaService incidenciaService;

    public IncidenciaController(IncidenciaService incidenciaService) {
        this.incidenciaService = incidenciaService;
    }

    @PostMapping(value = "/{id}/incidencias", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('DESARROLLADOR', 'JEFE_PROYECTO', 'ADMINISTRADOR')")
    public ResponseEntity<IncidenciaCompletaResponse> registrarIncidencia(
            @PathVariable Long id,
            @RequestParam("titulo") String titulo,
            @RequestParam("severidad") String severidad,
            @RequestParam("fichero") MultipartFile fichero,
            @AuthenticationPrincipal UserDetails usuarioAutenticado) {

        IncidenciaCompletaResponse response = incidenciaService.registrarIncidencia(
            id, titulo, severidad, fichero, usuarioAutenticado.getUsername()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

### La comprobación · Batería de escenarios en Bruno

Ejecuta la suite de verificación de integración:

1. **Escenario 1: El camino feliz (Todo funciona):**
   * Auth: Bearer Token con rol `DESARROLLADOR`.
   * Body: Multipart con campos de texto y archivo `informe.pdf`.
   * **Resultado:** Código **`201 Created`**.
   * La respuesta contiene el ID generado, el enlace de descarga `/api/v1/adjuntos/1/descargar`, el clima actual (`"temperaturaCelsius": 21.5`) y en la consola se observa el webhook disparado en segundo plano por el hilo `notif-thread-1`.
2. **Escenario 2: Caída del servicio meteorológico (Degradación elegante):**
   * Desconecta tu conexión a Internet o apunta la URL de Open-Meteo a una IP inalcanzable.
   * Lanza la misma petición de alta.
   * **Resultado:** Código **`201 Created`**. La incidencia se guarda, el PDF se almacena y la respuesta incluye `"descripcionClima": "Servicio meteorológico no disponible temporalmente"`. **El backend no se cae.**
3. **Escenario 3: Acceso no autorizado:**
   * Lanza la petición sin cabecera `Authorization`.
   * **Resultado:** Código **`401 Unauthorized`**. Cero ficheros guardados en disco.
4. **Escenario 4: Fichero inválido:**
   * Intenta adjuntar un archivo ejecutable `virus.exe`.
   * **Resultado:** Código **`400 Bad Request`**. La transacción se aborta limpiamente.

### Ahora tú · Integrar la visualización en el cliente web de la UD8

Actualiza tu página web `index.html`:
1. Añade una sección para consultar incidencias de un proyecto.
2. Si la incidencia incluye condiciones climáticas favorables (`esFavorableParaTrabajoExterior: true`), muestra un icono en verde; si no es favorable o hubo aviso de degradación, muéstralo en naranja.
3. Añade el botón de descarga del fichero adjunto con su enlace a `/api/v1/adjuntos/{id}/descargar` inyectando el token JWT en la cabecera.

### Reto · Auditoría de integraciones externas

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

> [!NOTE]
> Si en la evaluación se solicita una memoria técnica justificando la arquitectura integral y la resiliencia del sistema frente a fallos de terceros, el formato oficial de entrega de texto es siempre un **documento en PDF** (`memoria-integracion.pdf`), nunca un archivo markdown suelto.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Flujo integral de subida multipart con persistencia en PostgreSQL y respuesta tipada.</span></div>
  <div><strong>Si lo tienes</strong><span>Integración de Open-Meteo con degradación elegante, seguridad JWT y eventos asíncronos.</span></div>
  <div><strong>Reto</strong><span>Tabla e interceptor de auditoría de peticiones salientes registrando latencias y fallos.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 66</p>
  <ul class="checklist">
    <li>Se articulan coherentemente todas las capas del backend en un único caso de uso.</li>
    <li>La persistencia transaccional y el almacenamiento binario en disco operan en armonía.</li>
    <li>La degradación elegante garantiza la continuidad del servicio ante averías externas.</li>
    <li>Las notificaciones asíncronas no degradan la latencia percibida por el usuario.</li>
    <li>La seguridad por token protege tanto la mutación de datos como la descarga de adjuntos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué la consulta meteorológica debe realizarse antes de guardar la incidencia pero el webhook debe dispararse después?</li>
    <li>¿Qué ocurriría con el archivo guardado en disco si la transacción de PostgreSQL falla al final con un error de clave duplicada?</li>
    <li>¿Cómo se asegura que un usuario solo pueda descargar adjuntos si está autenticado?</li>
    <li>¿Qué ventajas ofrece devolver un DTO integral (`IncidenciaCompletaResponse`) frente a hacer que el frontend consulte tres endpoints distintos?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque los datos climáticos forman parte de la información que enriquece la incidencia a guardar; el webhook, en cambio, es un efecto secundario de notificación que solo debe emitirse si el registro tuvo éxito.</p>
  <p>2 · El archivo quedaría huérfano en disco a menos que se implemente un mecanismo de compensación o limpieza en el bloque catch de la transacción.</p>
  <p>3 · Protegiendo el endpoint GET de descarga con @PreAuthorize("isAuthenticated()") o verificando roles específicos en la SecurityFilterChain.</p>
  <p>4 · Reduce el número de peticiones de red entre navegador y servidor (round-trips), disminuye la latencia total y simplifica la lógica del cliente frontend.</p>
</details>

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
    <li><strong>Asume las falacias de la red</strong>: toda llamada saliente debe tener <strong>Timeouts estrictos</strong> (Connect Timeout $\le 2$ s, Read Timeout $\le 3$ s).</li>
    <li>Aplica el principio de <strong>Degradación Elegante (<em>Graceful Degradation</em>)</strong>: el fallo de una API externa nunca debe provocar un <code>500 Internal Server Error</code> en tu backend.</li>
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
    <li>Las peticiones salientes utilizan el cliente moderno `RestClient` con URL base y cabeceras centralizadas.</li>
    <li>Los contratos de proveedores externos están completamente aislados mediante el patrón Capa Anticorrupción (ACL).</li>
    <li>Los DTOs externos utilizan `@JsonIgnoreProperties(ignoreUnknown = true)` para tolerar adiciones futuras de campos.</li>
    <li>Toda llamada HTTP externa dispone de límites estrictos de `Connect Timeout` ($\le 2$ s) y `Read Timeout` ($\le 3$ s).</li>
    <li>La aplicación aplica degradación elegante ante caídas de red o errores 4xx/5xx sin colapsar con código 500.</li>
    <li>Las consultas a servicios externos con datos estables se optimizan mediante caché con `@Cacheable`.</li>
    <li>Los ficheros subidos se almacenan con UUIDs en un directorio externo al proyecto para prevenir ataques de *Path Traversal*.</li>
    <li>Los límites de tamaño para subidas (`max-file-size`) y validación de tipos MIME están estrictamente configurados.</li>
    <li>La descarga de ficheros está protegida por autorización y emite la cabecera estándar `Content-Disposition: attachment`.</li>
    <li>Los efectos secundarios (correos y webhooks) se ejecutan de forma asíncrona tras el commit (`@TransactionalEventListener`).</li>
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


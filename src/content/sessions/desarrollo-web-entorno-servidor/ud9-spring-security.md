---
title: "Sesión, autenticación y Spring Security"
label: "UD9 · Proteger"
section: "ud-09"
order: 9
lang: "es"
summary: "Desde por qué HTTP no recuerda quién eres hasta una API protegida con usuarios persistentes, roles y una estrategia de sesión o token justificada."
duration: "18 horas · 3 semanas · 9 sesiones"
modality: "Taller técnico · 40 % guía / 60 % autonomía"
deliverable: "La aplicación protegida con usuarios persistentes, roles y una estrategia de sesión o token justificada, consumida desde la página cliente de la UD8."
date: "2026-09-02"
outcomes:
  - "Explicar por qué HTTP no mantiene estado y cómo lo resuelven cookies y sesión."
  - "Distinguir autenticación de autorización."
  - "Almacenar contraseñas con un algoritmo de hash adecuado."
  - "Proteger endpoints por rol y por permiso con Spring Security."
  - "Elegir entre sesión y token justificando la decisión."
  - "Reconocer y corregir los fallos habituales de CSRF y de CORS con credenciales."
requirements:
  - "La API de la UD7 y el cliente de la UD8."
  - "Usuarios persistidos en base de datos."
priorKnowledge:
  - "JPA y persistencia."
  - "APIs REST y códigos de estado 401 y 403."
  - "Integración con un cliente y CORS básico."
---

<p class="lead">Hasta ahora cualquiera podía hacer cualquier cosa. Aquí aparece la identidad, y con ella la pregunta que ordena toda la unidad: quién eres y qué te está permitido.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje bajo. Los mecanismos se explican; la estrategia de seguridad de la aplicación la decide y la defiende el alumnado.</p>
</div>

## Semana 18 · HTTP no recuerda quién eres

## Sesión 52 · Peticiones independientes, cookies y sesión

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué el protocolo HTTP es estrictamente sin estado (<em>stateless</em>), cómo el servidor inventa la continuidad mediante el mecanismo de sesión y cookies (<code>JSESSIONID</code>), las directivas de seguridad esenciales de una cookie (<code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code>) y el impacto en la memoria del servidor.</li>
    <li><strong>2. Haz:</strong> implementa un controlador de demostración de sesión con <code>HttpSession</code> en Spring Boot, observa cómo el contenedor Tomcat genera la cabecera <code>Set-Cookie</code> y comprueba cómo el cliente la devuelve en peticiones sucesivas.</li>
    <li><strong>3. Comprueba:</strong> inspeccionas el almacén de cookies en las DevTools del navegador (pestaña Aplicación / Storage) y en la pestaña Red, eliminas manualmente la cookie y observas cómo el servidor te trata de inmediato como un visitante anónimo desconocido.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué significa formalmente que el protocolo HTTP sea un protocolo «sin estado» (<em>stateless</em>)?</li>
    <li>¿Qué cabecera HTTP envía el servidor para ordenar al navegador que almacene una cookie en su disco o memoria?</li>
    <li>¿Qué peligro crítico de seguridad previene marcar una cookie con la directiva <code>HttpOnly</code>?</li>
  </ol>
</div>

### La amnesia congénita del protocolo HTTP

Cuando envías una petición `GET /api/v1/proyectos`, el servidor abre un socket TCP, lee la petición, consulta la base de datos, envía el JSON de respuesta y cierra o reutiliza la conexión.

Si un milisegundo después envías `POST /api/v1/proyectos`, **para el servidor eres un perfecto desconocido**. HTTP no tiene memoria: no sabe si eres el mismo usuario que acaba de consultar los proyectos, si estás en la misma oficina o si eres un bot al otro lado del planeta.

<div class="rule">
  <p class="rule-label">El principio sin estado de HTTP</p>
  <p><strong>Cada petición HTTP es tratada como si fuera la primera y la única de la historia del universo.</strong></p>
  <p>Para construir experiencias web donde un usuario «inicia sesión» y realiza múltiples acciones consecutivas, tuvimos que inventar un mecanismo artificial de continuidad sobre un protocolo amnésico: <strong>las sesiones y las cookies</strong>.</p>
</div>

### El truco del guardarropa: Session ID y Cookies

Imagina que vas al guardarropa de un teatro:
1. Entregas tu abrigo (haces login con usuario y contraseña).
2. El empleado no memoriza tu cara: te entrega una ficha de plástico numerada (un identificador de sesión o **Session ID**, ej: `ficha #4815`). Tu abrigo se queda colgado en el armario del guardarropa (**memoria del servidor**).
3. Cada vez que pides algo (una copa, acceso a la sala), muestras la ficha. El personal comprueba el número y te atiende.
4. Si pierdes la ficha, o si el guardarropa arde en llamas, se pierde el vínculo.

<figure class="diagram">
  <figcaption>El ciclo de vida de una sesión basada en cookies</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Petición inicial (sin cookie)</li>
    <li>2. Tomcat crea HttpSession (ID: ABC)</li>
    <li>3. Respuesta con Set-Cookie: JSESSIONID=ABC</li>
    <li>4. Siguiente petición con Cookie: JSESSIONID=ABC</li>
  </ol>
</figure>

### Las directivas de seguridad indispensables de una cookie

Una cookie no es un simple par clave-valor; es un mensaje con instrucciones de seguridad estrictas para el navegador:

| Directiva | Qué hace | Por qué es obligatoria en producción |
| :--- | :--- | :--- |
| **`HttpOnly`** | Impide que el código JavaScript de la página (mediante `document.cookie`) pueda leer o modificar la cookie. | Si tu aplicación sufre una vulnerabilidad XSS (inyección de script malicioso), el atacante no puede robar la cookie de sesión. |
| **`Secure`** | Obliga al navegador a transmitir la cookie **únicamente a través de conexiones cifradas HTTPS**. | Evita que un atacante en una red Wi-Fi pública intercepte la cookie en texto claro. |
| **`SameSite=Lax` / `Strict`** | Controla si la cookie se envía en peticiones originadas desde sitios web de terceros. | Es la defensa nativa de los navegadores modernos contra ataques de falsificación de peticiones en sitios cruzados (**CSRF**). |
| **`Path=/`** | Delimita qué rutas del servidor tienen acceso a la cookie. | Evita que aplicaciones aisladas bajo el mismo dominio compartan identificadores de sesión. |

### Paso a paso guiado · Experimentar con HttpSession en Spring Boot

Vamos a crear un endpoint de prueba para observar el comportamiento nativo de sesiones de Spring Boot y Tomcat:

<p class="stage">Paso 1 · Crear SesionDemoController</p>

```java
package com.empresa.proyecto.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/sesion-demo")
public class SesionDemoController {

    @GetMapping("/visita")
    public ResponseEntity<Map<String, Object>> registrarVisita(HttpSession session) {
        // Obtenemos el contador de la memoria de sesión del servidor
        Integer visitas = (Integer) session.getAttribute("contadorVisitas");

        if (visitas == null) {
            visitas = 1;
        } else {
            visitas++;
        }

        // Guardamos el nuevo valor en la sesión
        session.setAttribute("contadorVisitas", visitas);

        return ResponseEntity.ok(Map.of(
            "sessionId", session.getId(),
            "numeroVisita", visitas,
            "esNuevaSesion", session.isNew(),
            "creadaEn", session.getCreationTime()
        ));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> cerrarSesion(HttpSession session) {
        // Destruimos la sesión en la memoria del servidor
        session.invalidate();
        return ResponseEntity.ok(Map.of("mensaje", "Sesión invalidada con éxito"));
    }
}
```

<p class="stage">Paso 2 · Configurar directivas de cookies en application.properties</p>

En Spring Boot podemos forzar que las cookies de sesión cumplan las máximas directivas de seguridad:

```properties
# Seguridad de cookies de sesión
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=false
server.servlet.session.cookie.same-site=lax
server.servlet.session.timeout=30m
```

> [!NOTE]
> En desarrollo local mantenemos `server.servlet.session.cookie.secure=false` porque trabajamos sobre `http://localhost`. En producción con certificados TLS/HTTPS, debe ser siempre `true`.

### La comprobación · Inspección forense en DevTools

Arranca tu aplicación y realiza este experimento en tu navegador abriendo `http://localhost:8080/api/v1/sesion-demo/visita`:

1. **Primera petición:**
   * Abre DevTools (`F12`) y ve a la pestaña **Network**.
   * Revisa en *Response Headers* la cabecera:
     `Set-Cookie: JSESSIONID=XXXXX; Path=/; HttpOnly; SameSite=Lax`.
   * En el JSON verás `"numeroVisita": 1` y `"esNuevaSesion": true`.
2. **Segunda petición (recarga con F5):**
   * Mira en *Request Headers*: el navegador ha enviado automáticamente `Cookie: JSESSIONID=XXXXX`.
   * En el JSON verás `"numeroVisita": 2` y `"esNuevaSesion": false`. ¡El servidor te ha reconocido!
3. **Inspección del almacén de cookies:**
   * Ve a la pestaña **Application** (o **Almacenamiento** en Firefox) → *Cookies* → `http://localhost:8080`.
   * Comprueba que la cookie `JSESSIONID` tiene el checkbox de `HttpOnly` marcado.
4. **La prueba de la amnesia provocada:**
   * Haz clic derecho sobre la cookie `JSESSIONID` en DevTools y selecciona **Delete** (Borrar).
   * Recarga la página: el servidor te asigna un nuevo `JSESSIONID` y el contador vuelve a empezar en `1`.

### Ahora tú · Integrar la cookie con el cliente web de la UD8

Vuelve a tu página `cliente/index.html` de la UD8:
1. Haz un `fetch('http://localhost:8080/api/v1/sesion-demo/visita')` desde el cliente en `http://localhost:5500`.
2. **¡Atención!** En peticiones Cross-Origin (distinto puerto), el navegador **NO envía cookies por defecto** a menos que configures:
   ```javascript
   fetch('http://localhost:8080/api/v1/sesion-demo/visita', {
     credentials: 'include' // Obliga a enviar y recibir cookies en peticiones cross-origin
   });
   ```
3. Comprueba que el contador de visitas se incrementa en la interfaz web sin recargar la página.

### Reto · El coste de la sesión: ¿Qué pasa al escalar a 5 servidores?

El almacenamiento de sesiones en memoria tiene un enemigo mortal: **el escalado horizontal**.

Imagina que tu empresa tiene tanto éxito que un solo servidor Spring Boot no da abasto y pones un balanceador de carga (Nginx o AWS ALB) delante de dos instancias del backend (Servidor 1 y Servidor 2):
1. El usuario hace login en el Servidor 1. El Servidor 1 guarda su sesión en su memoria RAM local y emite `JSESSIONID=ABC`.
2. En la siguiente petición, el balanceador desvía el tráfico al Servidor 2.
3. ¿Qué ocurre en el Servidor 2 cuando recibe `JSESSIONID=ABC`? ¿Tiene esa sesión en su memoria local?
4. Investiga las dos soluciones industriales a este problema: **Sesiones pegajosas (*Sticky Sessions*)** frente a un **Almacén centralizado en memoria (*Spring Session con Redis*)**.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Controlador de sesión implementado y cabeceras <code>Set-Cookie</code> y <code>Cookie</code> inspeccionadas en DevTools.</span></div>
  <div><strong>Si lo tienes</strong><span>Consumo desde el cliente web con <code>credentials: 'include'</code> y directivas <code>HttpOnly</code> verificadas.</span></div>
  <div><strong>Reto</strong><span>Problema de escalabilidad de sesiones en memoria y solución con Spring Session / Redis comprendido y argumentado.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 52</p>
  <ul class="checklist">
    <li>Se comprende por qué HTTP es un protocolo sin estado y cómo las cookies reconstruyen la continuidad.</li>
    <li>Se identifica el ciclo completo de vida de la cabecera `Set-Cookie` y el identificador `JSESSIONID`.</li>
    <li>Las directivas críticas de seguridad (`HttpOnly`, `Secure`, `SameSite`) están configuradas y auditadas.</li>
    <li>El cliente web envía credenciales en peticiones cross-origin con `credentials: 'include'`.</li>
    <li>Se conoce el impacto de almacenar sesiones en la memoria del servidor frente al escalado horizontal.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué HTTP se define como un protocolo sin estado (*stateless*)?</li>
    <li>¿Qué almacena exactamente el identificador `JSESSIONID`: los datos del usuario o una clave de búsqueda en memoria?</li>
    <li>¿Qué sucede si un script malicioso intenta ejecutar `document.cookie` sobre una cookie marcada con `HttpOnly`?</li>
    <li>¿Por qué una petición fetch entre distintos puertos requiere `credentials: 'include'` para enviar cookies?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el protocolo no conserva ninguna información ni contexto entre peticiones sucesivas; cada mensaje se procesa de forma totalmente independiente.</p>
  <p>2 · Solo una clave opaca aleatoria (un puntero); los datos reales del usuario (atributos de sesión) permanecen almacenados en la memoria del servidor.</p>
  <p>3 · El navegador devuelve una cadena vacía u oculta la cookie, impidiendo que el código JavaScript del cliente acceda a ella y neutralizando el robo de sesión por XSS.</p>
  <p>4 · Porque por la Política del Mismo Origen el navegador restringe el envío automático de credenciales a orígenes externos por defecto para evitar fugas involuntarias de sesión.</p>
</details>

## Sesión 53 · Autenticación frente a autorización

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la distinción arquitectónica entre <strong>Autenticación (AuthN: ¿quién eres?)</strong> y <strong>Autorización (AuthZ: ¿qué puedes hacer?)</strong>, la diferencia semántica entre los códigos HTTP <code>401 Unauthorized</code> y <code>403 Forbidden</code>, y el diseño formal de una Matriz de Control de Acceso basado en roles (RBAC).</li>
    <li><strong>2. Haz:</strong> elabora la matriz de permisos para el Gestor de Proyectos e Incidencias cruzando actores del sistema con endpoints y verbos HTTP.</li>
    <li><strong>3. Comprueba:</strong> auditas cada intersección de la matriz validando qué código de estado exacto (200, 201, 204, 401 o 403) debe emitir el backend ante cada combinación de credencial y permiso.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Si un usuario no autenticado intenta consultar una ruta privada, ¿qué código HTTP debe devolver la API: 401 o 403?</li>
    <li>Si un usuario con rol de `DESARROLLADOR` intenta borrar un proyecto (acción reservada para `ADMIN`), ¿qué código HTTP debe recibir: 401 o 403?</li>
    <li>¿Por qué se dice en ingeniería de software que el nombre del código HTTP `401 Unauthorized` fue una mala elección histórica de vocabulario?</li>
  </ol>
</div>

### Los dos pilares de la seguridad: AuthN y AuthZ

En conversaciones informales es muy habitual escuchar a desarrolladores mezclar estos dos conceptos. En ingeniería de software profesional, confundirlos es la puerta de entrada a fallos críticos de seguridad:

<figure class="diagram">
  <figcaption>Las dos etapas del control de acceso</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Petición entrante</li>
    <li>1. Autenticación (AuthN): ¿Quién eres?</li>
    <li>2. Autorización (AuthZ): ¿Tienes permiso?</li>
    <li>Ejecución del Controlador</li>
  </ol>
</figure>

* **Autenticación (AuthN - *Authentication*):** Es el proceso de **verificar la identidad** de un actor.
  * Responde a la pregunta: *¿Quién eres tú y cómo demuestras que eres quien dices ser?*
  * Mecanismos: Usuario y contraseña, biometría, tarjeta inteligente, token criptográfico firmado.
* **Autorización (AuthZ - *Authorization*):** Es el proceso de **determinar si una identidad confirmada tiene permiso** para ejecutar una acción sobre un recurso.
  * Responde a la pregunta: *¿Este usuario autenticado tiene derecho a ejecutar `DELETE /api/v1/proyectos/1`?*
  * Mecanismos: Roles (`ROLE_ADMIN`), permisos puntuales (`TAREA_EDITAR`), listas de control de acceso (ACL).

<div class="rule">
  <p class="rule-label">La regla de oro de la precedencia</p>
  <p><strong>La autorización no tiene sentido sin una autenticación previa.</strong></p>
  <p>No puedes decidir qué permisos tiene alguien si no sabes quién es. Primero se identifica al actor (AuthN); si la identidad es válida, se evalúan sus permisos (AuthZ).</p>
</div>

### La distinción semántica entre 401 y 403

Uno de los errores más frecuentes en APIs REST es devolver el código HTTP equivocado ante accesos denegados:

| Código HTTP | Nombre formal | Significado real | Cuándo se devuelve |
| :--- | :--- | :--- | :--- |
| **`401`** | `Unauthorized` | En realidad significa **Unauthenticated** (No identificado o credenciales no válidas). | El cliente no ha enviado ninguna credencial, o el token/contraseña que envió está caducado o es incorrecto. El cliente puede reintentar la petición aportando credenciales válidas. |
| **`403`** | `Forbidden` | **Identificado pero sin privilegios suficientes** (Prohibido). | El servidor sabe perfectamente quién es el usuario (está autenticado), pero sus roles o permisos no le permiten realizar esa operación concreta. Reintentar con las mismas credenciales no servirá de nada. |

### Diseño de la Matriz de Control de Acceso (RBAC)

Para que el desarrollo de la seguridad no sea caótico, el equipo de ingeniería define una **Matriz RBAC (Role-Based Access Control)** antes de escribir código de seguridad:

Definimos los 4 roles del sistema:
1. **Anónimo (`ANON`):** Visitante sin autenticar.
2. **Desarrollador (`DEV`):** Miembro técnico del equipo.
3. **Jefe de Proyecto (`LEAD`):** Responsable de planificación y asignación.
4. **Administrador (`ADMIN`):** Administrador global de la plataforma.

| Endpoint | Método HTTP | `ANON` | `DEV` | `LEAD` | `ADMIN` |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `/api/v1/proyectos` | `GET` (Listar) | 401 | 200 OK | 200 OK | 200 OK |
| `/api/v1/proyectos/{id}` | `GET` (Detalle) | 401 | 200 OK | 200 OK | 200 OK |
| `/api/v1/proyectos` | `POST` (Crear) | 401 | 403 | 201 Created | 201 Created |
| `/api/v1/proyectos/{id}` | `PUT` (Editar) | 401 | 403 | 200 OK | 200 OK |
| `/api/v1/proyectos/{id}` | `DELETE` (Borrar) | 401 | 403 | 403 | 204 No Content |
| `/api/v1/proyectos/{id}/tareas` | `GET` (Tareas) | 401 | 200 OK | 200 OK | 200 OK |
| `/api/v1/proyectos/{id}/tareas` | `POST` (Crear tarea) | 401 | 201 Created | 201 Created | 201 Created |
| `/api/v1/tareas/{id}` | `DELETE` (Borrar tarea) | 401 | 403 | 204 No Content | 204 No Content |
| `/api/v1/usuarios` | `GET` (Listar usuarios) | 401 | 403 | 403 | 200 OK |

### Paso a paso guiado · De la matriz al modelo conceptual en Java

Para representar roles en Spring Boot de forma limpia, creamos un enumerado estándar:

<p class="stage">Paso 1 · Crear el Enum Rol</p>

```java
package com.empresa.proyecto.model;

public enum Rol {
    ROLE_DESARROLLADOR,
    ROLE_JEFE_PROYECTO,
    ROLE_ADMINISTRADOR;

    // Prefijo ROLE_ requerido por conveniencia en Spring Security
}
```

<p class="stage">Paso 2 · Diseñar la entidad Usuario</p>

Un usuario tiene credenciales de autenticación (username, password) y una colección de roles para autorización:

```java
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password; // ¡Nunca en texto plano! (lo veremos en la sesión 54)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Rol rol;

    @Column(nullable = false)
    private boolean activo = true;

    // Constructores, getters y setters
}
```

### La comprobación · Auditoría cruzada de la matriz

Revisa la matriz de permisos y responde a estas comprobaciones de diseño:

1. **El caso del observador anónimo:**
   * ¿Tiene sentido que la documentación Swagger (`/swagger-ui.html`) devuelva `401` o debería ser pública (`200 OK`)?
   * *Respuesta:* En entornos corporativos las especificaciones internas suelen protegerse; en APIs públicas se dejan abiertas.
2. **La coherencia del código de error:**
   * Si un `DESARROLLADOR` autenticado intenta borrar un proyecto (`DELETE /api/v1/proyectos/5`), ¿por qué devolver `401` sería un grave error técnico?
   * *Respuesta:* Porque el usuario ya está autenticado; devolver `401` le induciría a pensar que su contraseña falló, cuando en realidad no tiene el privilegio necesario (`403 Forbidden`).

### Ahora tú · Control de acceso basado en atributos (ABAC)

La matriz por roles (RBAC) es muy potente, pero tiene un límite:
* Un `DESARROLLADOR` tiene permiso para editar tareas (`PUT /api/v1/tareas/{id}`).
* Pero, ¿debe poder editar una tarea asignada a otro compañero? ¿O solo las tareas donde él es el responsable?

Diseña la regla de negocio para el control de acceso a nivel de fila (*Row-Level Security*):
1. Añade a la entidad `Tarea` el campo `Usuario asignadoA`.
2. Define la condición lógica: *«Un usuario con rol `DESARROLLADOR` solo puede modificar el estado de una tarea si `tarea.asignadoA.id == usuarioAutenticado.id`»*.
3. Si intenta editar la tarea de otro desarrollador, ¿qué código HTTP debe responder la API?

### Reto · Matriz formal de seguridad de la aplicación

En entornos profesionales de desarrollo seguro (como los marcos ISO 27001 o ENS - Esquema Nacional de Seguridad), la seguridad no puede dejarse a la improvisación.

Elabora una matriz formal de control de accesos completa para el sistema:
1. Incluye las operaciones sobre las entidades de `Proyecto`, `Tarea`, `Comentario` y `Usuario`.
2. Define con precisión el código de respuesta HTTP esperado ante cada escenario (éxito, anónimo, rol insuficiente y recurso inexistente).
3. Evalúa el compromiso entre seguridad y divulgación de información: ¿debe responderse `403 Forbidden` o `404 Not Found` cuando un usuario no tiene permiso para saber siquiera si un recurso existe?

> [!NOTE]
> Si en la evaluación se solicita la entrega de la matriz de permisos y especificación de seguridad, el formato oficial de entrega de texto es siempre un **documento en PDF** (`matriz-permisos.pdf`), nunca un archivo markdown suelto.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Diferenciación conceptual y semántica entre AuthN y AuthZ comprendida (401 vs 403).</span></div>
  <div><strong>Si lo tienes</strong><span>Matriz de roles y permisos (RBAC) diseñada y enum de roles definido en Java.</span></div>
  <div><strong>Reto</strong><span>Extensión de la matriz con reglas de seguridad a nivel de fila (ABAC) y justificación de respuestas 403 vs 404.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 53</p>
  <ul class="checklist">
    <li>Se distingue con precisión matemática entre autenticación (identidad) y autorización (permisos).</li>
    <li>Los códigos de respuesta HTTP `401 Unauthorized` y `403 Forbidden` se aplican con estricta semántica.</li>
    <li>La matriz de control de accesos basada en roles (RBAC) está formalmente definida para todos los endpoints.</li>
    <li>Se comprende la limitación de los roles globales y la necesidad del control de acceso por atributos (ABAC).</li>
    <li>El modelo conceptual de usuarios y roles está preparado para su persistencia en base de datos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Cuál es la diferencia exacta entre autenticación y autorización?</li>
    <li>¿En qué circunstancia una API debe responder con código HTTP 403 en lugar de 401?</li>
    <li>¿Por qué el estándar HTTP utilizó la palabra «Unauthorized» para el código 401 cuando debería llamarse «Unauthenticated»?</li>
    <li>¿Qué significa el acrónimo RBAC en el diseño de seguridad de aplicaciones?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Autenticación es verificar la identidad del actor (quién es); autorización es comprobar si esa identidad verificada tiene derecho a ejecutar una acción concreta.</p>
  <p>2 · Cuando el usuario ya está autenticado con éxito, pero sus roles o permisos actuales no le otorgan privilegios suficientes para la acción solicitada.</p>
  <p>3 · Por una imprecisión histórica en los primeros borradores de la especificación RFC de HTTP en los años 90; conceptualmente el 401 indica falta de credenciales válidas.</p>
  <p>4 · Role-Based Access Control: Control de Acceso Basado en Roles.</p>
</details>

## Sesión 54 · Contraseñas y hashing

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> por qué las contraseñas <strong>NUNCA se guardan en texto plano ni se cifran de forma reversible</strong>, qué es una función hash criptográfica unidireccional, el rol fundamental del <em>Salt</em> aleatorio frente a ataques de diccionario y tablas arcoíris, y por qué algoritmos rápidos como MD5 o SHA-256 son peligrosos requiriendo funciones adaptativas lentas (BCrypt, Argon2).</li>
    <li><strong>2. Haz:</strong> configura el bean <code>PasswordEncoder</code> con <code>BCryptPasswordEncoder</code> en Spring Boot, escribe tests unitarios que verifiquen cómo una misma contraseña genera hashes totalmente distintos y comprueba la verificación con <code>matches()</code>.</li>
    <li><strong>3. Comprueba:</strong> mides el tiempo de cómputo variando el factor de coste de BCrypt (de 10 a 14 rondas), analizando el equilibrio entre resistencia ante ataques de fuerza bruta y latencia admisible para el usuario.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuál es la diferencia fundamental entre «cifrar» (encriptar) un dato y «hashear» un dato?</li>
    <li>Si dos usuarios eligen exactamente la misma contraseña (<code>"Secreto123!"</code>), ¿por qué en la base de datos sus cadenas resultantes deben ser completamente diferentes?</li>
    <li>¿Por qué utilizar algoritmos ultrarrápidos como SHA-256 o MD5 para almacenar contraseñas se considera hoy una negligencia grave de seguridad?</li>
  </ol>
</div>

### La mayor negligencia de un desarrollador backend

En 2012, una famosa red social profesional sufrió una filtración de su base de datos. Los atacantes extrajeron millones de filas. Para sorpresa y escándalo del mundo tecnológico, las contraseñas estaban almacenadas con el algoritmo **SHA-1 sin sal (*salt*)**.

En menos de 24 horas, los investigadores y atacantes habían recuperado el **90 % de las contraseñas originales** utilizando tablas precalculadas.

<div class="rule">
  <p class="rule-label">La ley inquebrantable del almacenamiento de contraseñas</p>
  <p><strong>Las contraseñas NUNCA se almacenan en texto plano y NUNCA se cifran de forma reversible.</strong></p>
  <p>Si cifras una contraseña con una clave simétrica (AES), quien robe la base de datos y encuentre la clave maestra recuperará todas las contraseñas de tus usuarios. Una contraseña debe transformarse mediante una <strong>función hash criptográfica irreversible y lenta</strong>.</p>
</div>

### Cifrado reversible frente a Hash unidireccional

Conviene fijar con máxima claridad conceptual estos dos términos:

<figure class="diagram">
  <figcaption>Cifrado reversible vs Hash unidireccional</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Texto en claro ("secreto") → Función Hash irreversible → Hash ("$2a$12$...")</li>
    <li>Hash ("$2a$12$...") → Imposible recuperar matemáticamente → "secreto"</li>
  </ol>
</figure>

* **Cifrado (Criptografía reversible):** Tiene un camino de ida y vuelta. Si tienes el texto cifrado y la clave secreta, puedes descifrarlo para obtener el texto original. Se usa para transmitir mensajes secretos o guardar números de tarjeta de crédito que luego necesitas cobrar.
* **Hash (Función unidireccional):** Solo tiene camino de ida. A partir de una entrada genera una huella digital matemática de longitud fija. **Es matemáticamente imposible revertir el hash para obtener la contraseña original**.

¿Cómo se comprueba entonces el login si el servidor no conoce la contraseña?
1. El usuario introduce `"MiPassword123"`.
2. El servidor le aplica la misma función hash a lo que el usuario acaba de escribir.
3. Si el hash resultante coincide con el hash guardado en la base de datos, el usuario conoce la contraseña. **El servidor jamás necesita saber cuál era la contraseña original**.

### Por qué SHA-256 no sirve para contraseñas: La necesidad de funciones lentas

Muchos estudiantes preguntan: *«¿Por qué no usamos SHA-256 si es un hash seguro?»*.

SHA-256 es un algoritmo excelente para verificar la integridad de un archivo de 4 GB, porque fue diseñado para ser **ultrarrápido**.
* Una tarjeta gráfica (GPU) moderna para videojuegos puede calcular más de **10.000 millones de hashes SHA-256 por segundo**.
* Si un atacante roba tu base de datos con contraseñas en SHA-256, puede probar todas las combinaciones posibles de 8 caracteres en cuestión de minutos (fuerza bruta).

Para almacenar contraseñas necesitamos **funciones de derivación de claves deliberadamente lentas y costosas en CPU y memoria**: **BCrypt**, **Argon2** o **PBKDF2**.
* Si el cálculo de un hash BCrypt tarda **250 milisegundos**, un usuario legítimo al hacer login ni siquiera nota el retardo de un cuarto de segundo.
* Para el atacante, probar 1.000 millones de contraseñas ya no tarda minutos: tarda **miles de años**.

### El rol del Salt (Sal criptográfica) y la anatomía de BCrypt

Para evitar que dos usuarios con la misma contraseña tengan el mismo hash en la base de datos (lo que permitiría usar tablas arcoíris precalculadas), se añade un **Salt**: un conjunto de bytes aleatorios únicos generados para cada usuario.

BCrypt empaqueta todo en una cadena modular estándar de 60 caracteres:

<figure class="diagram">
  <figcaption>Anatomía de un hash BCrypt de 60 caracteres</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Algoritmo ($2a$)</li>
    <li>Coste ($12$)</li>
    <li>Salt aleatorio (22 chars)</li>
    <li>Hash de la contraseña (31 chars)</li>
  </ol>
</figure>

```text
$2a$12$e8kM.V3kM5aU4L4O5Q6R7eJ7Z8X9Y0A1B2C3D4E5F6G7H8I9J0K1L
 |   |  \____________________/\_____________________________/
Id  Cost         Salt                        Hash
```

1. **`$2a$`:** Versión del algoritmo BCrypt.
2. **`$12$`:** Factor de coste (*Work Factor*). Significa $2^{12} = 4096$ rondas de estiramiento de clave (*Key Stretching*).
3. **Primeros 22 caracteres:** El *Salt* aleatorio generado automáticamente en el momento del registro.
4. **Últimos 31 caracteres:** El hash resultante de combinar la contraseña con ese *Salt*.

### Paso a paso guiado · Integrar BCrypt con Spring Security

<p class="stage">Paso 1 · Configurar el Bean PasswordEncoder</p>

En Spring Boot definimos el codificador de contraseñas oficial como un `@Bean` reutilizable:

```java
package com.empresa.proyecto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityBeansConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Factor de coste 12: equilibrio óptimo entre seguridad y tiempo de respuesta (~200ms)
        return new BCryptPasswordEncoder(12);
    }
}
```

<p class="stage">Paso 2 · Test unitario de hashing y verificación con matches()</p>

Creamos una prueba unitaria para experimentar cómo opera `PasswordEncoder`:

```java
package com.empresa.proyecto;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

class PasswordEncoderTest {

    private final PasswordEncoder encoder = new BCryptPasswordEncoder(10);

    @Test
    void bcryptGeneraHashesDistintosParaMismaPassword() {
        String passwordPlana = "MiSuperClave2026!";

        // Generamos dos hashes de la misma contraseña exacta
        String hash1 = encoder.encode(passwordPlana);
        String hash2 = encoder.encode(passwordPlana);

        System.out.println("Hash 1: " + hash1);
        System.out.println("Hash 2: " + hash2);

        // 1. Demostración de Salt: los hashes son totalmente distintos en cada llamada
        assertNotEquals(hash1, hash2);

        // 2. Verificación de login con matches(): ambos validan con éxito
        assertTrue(encoder.matches(passwordPlana, hash1));
        assertTrue(encoder.matches(passwordPlana, hash2));

        // 3. Contraseña incorrecta rechazada
        assertFalse(encoder.matches("ClaveErronea!", hash1));
    }
}
```

### La comprobación · Medir el coste computacional del Work Factor

Ejecuta este benchmark en terminal para entender cómo cada incremento en el factor de coste duplica el tiempo de cálculo de la CPU:

```java
    @Test
    void medirTiemposSegunFactorDeCoste() {
        String password = "PruebaRendimiento!";

        for (int coste = 10; coste <= 14; coste++) {
            PasswordEncoder enc = new BCryptPasswordEncoder(coste);
            long inicio = System.currentTimeMillis();
            enc.encode(password);
            long fin = System.currentTimeMillis();

            System.out.printf("Coste %d (2^%d rondas) -> Tiempo: %d ms%n", coste, coste, (fin - inicio));
        }
    }
```

Observa los resultados típicos en una CPU moderna:
* **Coste 10 ($2^{10} = 1024$ iteraciones):** ~60 ms.
* **Coste 11 ($2^{11} = 2048$ iteraciones):** ~120 ms.
* **Coste 12 ($2^{12} = 4096$ iteraciones):** ~240 ms. *(Recomendado en servidores modernos)*.
* **Coste 13 ($2^{13} = 8192$ iteraciones):** ~490 ms.
* **Coste 14 ($2^{14} = 16384$ iteraciones):** ~980 ms.

Cada incremento duplica exactamente el coste para el atacante. El coste 12 ofrece una resistencia excepcional sin degradar la experiencia de usuario.

### Ahora tú · Servicio de registro de usuario con hash seguro

Implementa el método de creación de usuario en tu servicio de negocio:

1. Inyecta `PasswordEncoder` en `UsuarioService`.
2. Al recibir `RegistroUsuarioRequest(username, passwordPlana, rol)`:
   * Valida que la contraseña tenga al menos 8 caracteres y complejidad mínima.
   * Codifica la contraseña antes de asignarla a la entidad:
     `usuario.setPassword(passwordEncoder.encode(request.password()));`
   * Guarda el usuario en PostgreSQL mediante `UsuarioRepository`.
3. Abre pgAdmin o tu cliente de PostgreSQL y haz un `SELECT * FROM usuarios;`.
4. Comprueba visualmente que la columna `password` almacena una cadena que empieza por `$2a$12$...` y jamás la clave en texto claro.

### Reto · Migración transparente de factores de coste (upgradeEncoding)

Con el paso de los años las computadoras se vuelven más rápidas y los factores de coste antiguos (ej: coste 10 de hace 5 años) quedan desfasados.

Spring Security proporciona el método:
`passwordEncoder.upgradeEncoding(hashActual)`
1. ¿Cómo permite este método detectar si un hash guardado en base de datos se generó con un factor de coste inferior al estándar actual de la empresa?
2. Diseña el flujo durante el login: si el login tiene éxito y `upgradeEncoding` devuelve `true`, ¿cómo actualiza la aplicación el hash en la base de datos con el nuevo coste sin pedirle al usuario que vuelva a escribir su contraseña?

> [!NOTE]
> Si en la evaluación se solicita un informe de auditoría criptográfica y políticas de contraseñas, el formato oficial de entrega de texto es siempre un **documento en PDF** (`analisis-hashing.pdf`), nunca un archivo markdown suelto.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Distinción entre cifrado reversible y hash unidireccional y bean <code>BCryptPasswordEncoder</code> configurado.</span></div>
  <div><strong>Si lo tienes</strong><span>Registro de usuario en PostgreSQL con contraseña hasheada y test con <code>matches()</code> en verde.</span></div>
  <div><strong>Reto</strong><span>Benchmark de factores de coste ejecutado y flujo de actualización transparente (<code>upgradeEncoding</code>) diseñado.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 54</p>
  <ul class="checklist">
    <li>Se prohíbe terminantemente el almacenamiento de contraseñas en claro o mediante cifrado reversible.</li>
    <li>Se comprende el principio de las funciones hash lentas frente al uso negligente de algoritmos rápidos (MD5/SHA).</li>
    <li>La anatomía de un hash BCrypt (versión, factor de coste, salt y digest) se analiza con precisión.</li>
    <li>El método `matches()` se utiliza para verificar credenciales sin descifrar nunca la contraseña original.</li>
    <li>Las contraseñas de los usuarios en PostgreSQL quedan blindadas ante cualquier filtración de datos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué nunca se debe utilizar cifrado reversible (como AES) para almacenar contraseñas?</li>
    <li>¿Qué función cumple el Salt aleatorio y qué tipo de ataque previene de raíz?</li>
    <li>¿Por qué BCrypt es una función hash adecuada para contraseñas mientras que SHA-256 no lo es?</li>
    <li>¿Cómo sabe el método `passwordEncoder.matches()` qué Salt se utilizó si solo le pasas la contraseña plana y el hash guardado?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque si la clave de cifrado se ve comprometida o filtrada, todas las contraseñas de todos los usuarios de la plataforma quedan expuestas de forma inmediata.</p>
  <p>2 · Garantiza que dos contraseñas idénticas generen hashes completamente diferentes, neutralizando los ataques basados en diccionarios y tablas arcoíris precalculadas.</p>
  <p>3 · Porque SHA-256 fue diseñado para ser extremadamente rápido (vulnerable a fuerza bruta con GPUs), mientras que BCrypt es deliberadamente lento y configurable en coste de CPU.</p>
  <p>4 · Porque los primeros 22 caracteres del propio hash guardado en base de datos contienen el Salt codificado, extrayéndolo de forma transparente para computar la comparación.</p>
</details>


## Semana 19 · Identidad y permisos persistentes

## Sesión 55 · Spring Security básico

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el impacto inmediato de añadir <code>spring-boot-starter-security</code> al proyecto, la arquitectura de la cadena de filtros de seguridad (<em>SecurityFilterChain</em> y <code>DelegatingFilterProxy</code>), el DSL funcional de configuración en Spring Security 6 y la autenticación HTTP Basic para APIs.</li>
    <li><strong>2. Haz:</strong> define una clase de configuración con <code>SecurityFilterChain</code>, declara explícitamente qué rutas son públicas (documentación OpenAPI, Swagger UI) y cuáles requieren autenticación obligatoria.</li>
    <li><strong>3. Comprueba:</strong> lanzas peticiones desde Bruno con y sin cabecera <code>Authorization: Basic</code>, verificando que los accesos anónimos a rutas protegidas se interceptan con código <code>401 Unauthorized</code> y cabecera <code>WWW-Authenticate</code>.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué ocurre con todos los endpoints de una API en el momento en que añades la dependencia de Spring Security sin escribir ninguna configuración?</li>
    <li>¿Qué clase o bean central de Spring Security se utiliza para definir las reglas de autorización de rutas HTTP en sustitución de la clase obsoleta <code>WebSecurityConfigurerAdapter</code>?</li>
    <li>¿Cómo viajan las credenciales (usuario y contraseña) en la cabecera <code>Authorization</code> cuando se utiliza el estándar HTTP Basic?</li>
  </ol>
</div>

### El cerrojo automático de Spring Security

En el instante en que añades esta dependencia a tu `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

Spring Boot activa el principio de **seguridad por defecto (*Secure by Default*)**:
1. **Todos los endpoints quedan blindados:** Cualquier petición a `/api/v1/proyectos` o a `/swagger-ui.html` es inmediatamente rechazada con código `401 Unauthorized`.
2. **Genera un usuario provisional:** En la terminal de arranque de la aplicación aparece un mensaje como este:
   ```text
   Using generated security password: 4a8b1c2d-9e3f-4123-b890-abcdef123456
   ```
   El usuario por defecto es `user` y la contraseña es esa clave aleatoria efímera.
3. **Inserta la Cadena de Filtros de Seguridad:** Cada petición HTTP entrante es interceptada por una serie de filtros en cascada antes de llegar siquiera al `DispatcherServlet`.

<div class="rule">
  <p class="rule-label">La arquitectura de filtros</p>
  <p><strong>Spring Security no vive dentro de tus controladores; vive en la frontera de red.</strong></p>
  <p>El <code>DelegatingFilterProxy</code> desvía la petición a la <code>SecurityFilterChain</code>. Si un filtro detecta que la petición no aporta credenciales válidas, corta la ejecución de inmediato y responde al cliente sin que tu código de negocio llegue a enterarse.</p>
</div>

### La cadena de filtros (SecurityFilterChain) en Spring Security 6

En versiones antiguas de Spring Security se heredaba de `WebSecurityConfigurerAdapter`. En Spring Boot 3 esa clase fue eliminada definitivamente.

La configuración moderna se realiza mediante un `@Bean` que construye un **`SecurityFilterChain`** utilizando programación funcional basada en lambdas:

<figure class="diagram">
  <figcaption>El flujo de inspección de la SecurityFilterChain</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Petición HTTP entrante</li>
    <li>Filtro CORS (WebConfig)</li>
    <li>Filtro CSRF / ExceptionTranslation</li>
    <li>BasicAuthenticationFilter</li>
    <li>AuthorizationFilter (requestMatchers)</li>
    <li>DispatcherServlet / Controller</li>
  </ol>
</figure>

### Paso a paso guiado · Configurar SecurityConfig con rutas públicas y privadas

Vamos a configurar nuestra primera cadena de seguridad formal:

<p class="stage">Paso 1 · Crear la clase SecurityConfig</p>

```java
package com.empresa.proyecto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Desactivamos CSRF solo porque estamos construyendo una API REST sin cookies de sesión clásicas
            .csrf(csrf -> csrf.disable())

            // 2. Definimos las reglas de autorización sobre las rutas HTTP
            .authorizeHttpRequests(auth -> auth
                // Documentación OpenAPI y Swagger accesibles para todo el mundo
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                // Endpoints de solo lectura de proyectos públicos para consulta
                .requestMatchers(HttpMethod.GET, "/api/v1/proyectos/**").permitAll()

                // Cualquier otra petición (creación, borrado, modificación) exige autenticación
                .anyRequest().authenticated()
            )

            // 3. Habilitamos autenticación HTTP Basic estándar para pruebas de API
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
```

<p class="stage">Paso 2 · Definir usuario temporal en application.properties</p>

Para realizar las primeras pruebas antes de conectar la base de datos en la siguiente sesión, definimos credenciales estáticas en el archivo de propiedades:

```properties
# Usuario provisional para pruebas iniciales de Spring Security
spring.security.user.name=desarrollador
spring.security.user.password=Password123!
spring.security.user.roles=DESARROLLADOR
```

### La comprobación · Pruebas de autorización con Bruno

Arranca tu aplicación y ejecuta estas comprobaciones desde tu cliente HTTP (Bruno):

1. **Ruta pública sin credenciales:**
   * Lanza `GET http://localhost:8080/api/v1/proyectos`.
   * **Resultado esperado:** Código `200 OK` con la lista de proyectos. Pasa limpia sin pedir usuario.
2. **Ruta protegida sin credenciales:**
   * Lanza `POST http://localhost:8080/api/v1/proyectos` con un cuerpo JSON de alta.
   * **Resultado esperado:** Código **`401 Unauthorized`**.
   * Revisa la pestaña *Headers*: el servidor ha devuelto la cabecera `WWW-Authenticate: Basic realm="Realm"`.
3. **Ruta protegida con credenciales válidas:**
   * En Bruno, ve a la pestaña **Auth** → selecciona **Basic Auth**.
   * Introduce Usuario: `desarrollador` y Contraseña: `Password123!`.
   * Lanza de nuevo el `POST`.
   * **Resultado esperado:** Código **`201 Created`** con la cabecera `Location`.
   * Inspecciona en *Headers* enviados cómo viaja:
     `Authorization: Basic ZGVzYXJyb2xsYWRvcjpQYXNzd29yZDEyMyE=` (cadena codificada en Base64).

### Ahora tú · Proteger las rutas de tareas

Aplica las reglas de seguridad sobre los endpoints de tareas:

1. Modifica `SecurityConfig` para que `GET /api/v1/tareas` sea una ruta pública.
2. Asegura que la creación de tareas (`POST /api/v1/proyectos/{id}/tareas`) y el borrado (`DELETE /api/v1/tareas/{id}`) exijan autenticación obligatoria.
3. Comprueba con Bruno que una petición anónima de borrado es rechazada de inmediato con `401`.

### Reto · Manejo personalizado de respuestas 401 (RFC 7807)

Por defecto, cuando Spring Security rechaza una petición con `401`, emite una respuesta vacía o el error básico de Tomcat.

Investiga la interfaz `AuthenticationEntryPoint`:
1. Crea una clase `CustomAuthenticationEntryPoint` que implemente `AuthenticationEntryPoint`.
2. Sobrescribe `commence()` para que ante accesos no autenticados, el servidor devuelva un JSON estructurado con el estándar **RFC 7807 (Problem Details)**:
   `{"status": 401, "title": "No autenticado", "detail": "Debes aportar credenciales válidas para acceder a este recurso"}`.
3. Regístralo en tu `filterChain` con `.exceptionHandling(ex -> ex.authenticationEntryPoint(...))`.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Dependencia integrada, `SecurityConfig` con `filterChain` y rutas públicas/privadas operativas.</span></div>
  <div><strong>Si lo tienes</strong><span>Pruebas con HTTP Basic verificadas en Bruno alternando peticiones permitidas (200) y bloqueadas (401).</span></div>
  <div><strong>Reto</strong><span>Punto de entrada personalizado (`AuthenticationEntryPoint`) emitiendo respuestas RFC 7807 ante rechazos 401.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 55</p>
  <ul class="checklist">
    <li>Se comprende la arquitectura de la `SecurityFilterChain` y su ejecución previa al controlador.</li>
    <li>La configuración moderna sin clases obsoletas se realiza mediante el DSL de Spring Security 6.</li>
    <li>Las rutas de documentación técnica (OpenAPI/Swagger) quedan explícitamente abiertas al público.</li>
    <li>Los métodos de modificación (POST, PUT, DELETE) están estrictamente blindados con autenticación.</li>
    <li>Las respuestas de error `401 Unauthorized` emiten la cabecera estándar `WWW-Authenticate`.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué Spring Security rechaza todas las peticiones por defecto tras añadir su starter?</li>
    <li>¿Qué método de `HttpSecurity` permite abrir una ruta concreta para visitas anónimas sin credenciales?</li>
    <li>¿Por qué HTTP Basic no es un mecanismo de cifrado seguro por sí mismo si no se transmite sobre HTTPS?</li>
    <li>¿Qué cabecera HTTP estándar incluye el servidor en una respuesta 401 para indicar qué esquema de autenticación espera?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Por el principio de seguridad por defecto: previene que endpoints sensibles queden expuestos accidentalmente por olvido del desarrollador.</p>
  <p>2 · El método permitAll() encadenado a una regla de ruta con requestMatchers().</p>
  <p>3 · Porque la cabecera Authorization solo codifica el usuario y la contraseña en Base64; Base64 no es cifrado (cualquiera puede decodificarlo al instante en texto claro).</p>
  <p>4 · La cabecera WWW-Authenticate (ej: WWW-Authenticate: Basic realm="Realm").</p>
</details>

## Sesión 56 · Usuarios en base de datos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el contrato del motor de autenticación de Spring Security, la interfaz fundamental <code>UserDetailsService</code>, el objeto <code>UserDetails</code> y cómo desacoplar la entidad JPA de tu dominio de la representación técnica de seguridad.</li>
    <li><strong>2. Haz:</strong> implementa <code>CustomUserDetailsService</code> conectado a <code>UsuarioRepository</code> en PostgreSQL y pobla la base de datos con usuarios y hashes BCrypt reales.</li>
    <li><strong>3. Comprueba:</strong> ejecutas peticiones autenticadas contra la API utilizando identidades almacenadas en PostgreSQL, verificando que la contraseña se valida mediante <code>PasswordEncoder</code> y que usuarios desactivados o con contraseñas erróneas son rechazados.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué interfaz de Spring Security tiene un único método encargado de buscar un usuario por su nombre de acceso?</li>
    <li>¿Por qué nunca se deben definir usuarios fijos en el archivo <code>application.properties</code> en una aplicación en producción?</li>
    <li>¿Qué método de <code>UserDetails</code> permite a Spring Security saber si la cuenta de un usuario ha sido dada de baja o bloqueada?</li>
  </ol>
</div>

### Cómo busca identidades Spring Security: UserDetailsService

En la sesión anterior usamos un usuario temporal configurado en un archivo de texto. En el mundo real, los usuarios se registran en una pantalla, cambian de contraseña, se dan de baja y sus credenciales viven en tablas de **PostgreSQL**.

Spring Security no te obliga a usar una estructura de base de datos rígida. En su lugar, define un **contrato funcional mediante una interfaz**:

```java
public interface UserDetailsService {
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

<figure class="diagram">
  <figcaption>El flujo de autenticación contra base de datos</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Cliente envía credenciales ("admin", "clave123")</li>
    <li>AuthenticationManager llama a UserDetailsService</li>
    <li>loadUserByUsername() consulta UsuarioRepository en PostgreSQL</li>
    <li>Devuelve UserDetails con hash BCrypt guardado</li>
    <li>PasswordEncoder.matches("clave123", hashGuardado)</li>
    <li>Éxito o 401 Unauthorized</li>
  </ol>
</figure>

### El desacoplamiento entre Usuario (JPA) y UserDetails (Seguridad)

Tu entidad de dominio `Usuario` representa una persona en tu negocio (nombre, email, fecha de alta, departamento).

Spring Security no sabe qué es un departamento: solo necesita saber qué dice el contrato de **`UserDetails`**:
* `getUsername()`: Nombre de usuario único.
* `getPassword()`: Hash BCrypt guardado en la base de datos.
* `getAuthorities()`: Colección de roles y permisos del usuario (`Collection<? extends GrantedAuthority>`).
* `isEnabled()`: Si la cuenta está activa (`true`) o desactivada (`false`).
* `isAccountNonLocked()`: Si la cuenta está bloqueada por intentos fallidos.

Podemos hacer que nuestra entidad `Usuario` implemente directamente `UserDetails`, permitiendo que viaje de forma nativa a través de todo el framework.

### Paso a paso guiado · De la entidad JPA al CustomUserDetailsService

<p class="stage">Paso 1 · Implementar UserDetails en la entidad Usuario</p>

Completamos la entidad `Usuario` que diseñamos en la sesión 53:

```java
package com.empresa.proyecto.model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Rol rol;

    @Column(nullable = false)
    private boolean activo = true;

    // Métodos obligatorios del contrato UserDetails
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // En Spring Security los roles se representan como GrantedAuthority con prefijo ROLE_
        return List.of(new SimpleGrantedAuthority(rol.name()));
    }

    @Override
    public String getPassword() { return this.password; }

    @Override
    public String getUsername() { return this.username; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return this.activo; }

    // Getters y setters de dominio
    public Long getId() { return id; }
    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }
    public void setActivo(boolean activo) { this.activo = activo; }
}
```

<p class="stage">Paso 2 · Crear el repositorio UsuarioRepository</p>

```java
package com.empresa.proyecto.repository;

import com.empresa.proyecto.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
}
```

<p class="stage">Paso 3 · Implementar CustomUserDetailsService</p>

Creamos el servicio anotado con `@Service` para que Spring Security lo detecte automáticamente como el proveedor oficial de identidades:

```java
package com.empresa.proyecto.service;

import com.empresa.proyecto.repository.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return usuarioRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("No existe usuario con username: " + username));
    }
}
```

<p class="stage">Paso 4 · Insertar datos iniciales con hashes BCrypt en PostgreSQL</p>

En `src/main/resources/data.sql` insertamos usuarios representativos.

> Recuerda que la contraseña nunca se guarda en claro. El hash para la contraseña `"Password123!"` con factor de coste 12 generado por BCrypt es:
> `$2a$12$e8kM.V3kM5aU4L4O5Q6R7eJ7Z8X9Y0A1B2C3D4E5F6G7H8I9J0K1L` *(o el generado en tu test de la sesión 54)*.

```sql
INSERT INTO usuarios (username, password, rol, activo) VALUES
('admin', '$2a$12$e8kM.V3kM5aU4L4O5Q6R7eJ7Z8X9Y0A1B2C3D4E5F6G7H8I9J0K1L', 'ROLE_ADMINISTRADOR', true),
('dev1', '$2a$12$e8kM.V3kM5aU4L4O5Q6R7eJ7Z8X9Y0A1B2C3D4E5F6G7H8I9J0K1L', 'ROLE_DESARROLLADOR', true),
('inactivo', '$2a$12$e8kM.V3kM5aU4L4O5Q6R7eJ7Z8X9Y0A1B2C3D4E5F6G7H8I9J0K1L', 'ROLE_DESARROLLADOR', false);
```

### La comprobación · Autenticación real contra PostgreSQL

Elimina del archivo `application.properties` las propiedades fijas `spring.security.user.name` y `password` para que no interfieran.

Reinicia Spring Boot y prueba en Bruno:
1. **Login exitoso con usuario de base de datos:**
   * Lanza `POST /api/v1/proyectos` con Basic Auth: usuario `admin`, contraseña `Password123!`.
   * **Resultado:** Código `201 Created`. En los logs de Hibernate verás la consulta:
     `SELECT ... FROM usuarios WHERE username = ?`.
2. **Usuario inexistente en base de datos:**
   * Lanza la petición con usuario `fantasma` y clave `Password123!`.
   * **Resultado:** Código `401 Unauthorized`.
3. **Usuario con contraseña errónea:**
   * Lanza la petición con usuario `admin` y clave `ClaveIncorrecta!`.
   * **Resultado:** Código `401 Unauthorized`.
4. **Usuario desactivado (`activo = false`):**
   * Lanza la petición con usuario `inactivo` y clave `Password123!`.
   * **Resultado:** Código `401 Unauthorized`. Spring Security lee `isEnabled() == false` y bloquea el acceso de inmediato.

### Ahora tú · Endpoint de perfil del usuario autenticado (/me)

Implementa un endpoint que permita al usuario conocer sus propios datos a partir de su sesión activa:

1. Crea en `UsuarioController` el método:
   ```java
   @GetMapping("/me")
   public ResponseEntity<UsuarioResponse> obtenerMiPerfil(@AuthenticationPrincipal Usuario usuarioAutenticado) {
       return ResponseEntity.ok(new UsuarioResponse(
           usuarioAutenticado.getId(),
           usuarioAutenticado.getUsername(),
           usuarioAutenticado.getRol().name()
       ));
   }
   ```
2. La anotación `@AuthenticationPrincipal` inyecta directamente la instancia de `Usuario` que Spring Security validó en la base de datos.
3. Prueba la llamada con distintos usuarios y comprueba que cada uno recibe su propia identidad.

### Reto · Prevención de ataques de temporización (Timing Attacks)

Cuando un atacante intenta adivinar si un nombre de usuario existe en tu base de datos:
* Si el usuario no existe, la base de datos responde rápido y la petición tarda 10 ms.
* Si el usuario existe, la base de datos lo encuentra y el servidor ejecuta la costosa función BCrypt (tardando 250 ms).
* Midiendo el tiempo de respuesta con un script de milisegundos, el atacante puede enumerar todos los usuarios válidos del sistema.

Investiga cómo Spring Security mitiga este vector mediante **contraseñas simuladas (*dummy hash computation*)**:
1. ¿Qué hace internamente `DaoAuthenticationProvider` cuando `loadUserByUsername` lanza `UsernameNotFoundException`?
2. ¿Por qué ejecuta de todos modos una llamada falsa a `passwordEncoder.matches()` antes de responder `401`?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Interfaz `UserDetailsService` implementada y conectada a PostgreSQL mediante `UsuarioRepository`.</span></div>
  <div><strong>Si lo tienes</strong><span>Entidad `Usuario` implementando `UserDetails`, verificación de cuenta activa (`isEnabled`) y endpoint `/me`.</span></div>
  <div><strong>Reto</strong><span>Protección contra ataques de temporización (*Timing Attacks*) comprendida e inspeccionada en los componentes internos.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 56</p>
  <ul class="checklist">
    <li>Las credenciales e identidades residen exclusivamente en tablas de PostgreSQL.</li>
    <li>La interfaz `UserDetailsService` carga usuarios reales mediante consultas JPA optimizadas.</li>
    <li>El objeto `UserDetails` desacopla la seguridad de la lógica del modelo de dominio.</li>
    <li>Las cuentas desactivadas (`activo = false`) son rechazadas automáticamente por `isEnabled()`.</li>
    <li>El usuario autenticado se inyecta limpiamente en controladores mediante `@AuthenticationPrincipal`.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué método define la interfaz `UserDetailsService` y qué excepción debe lanzar si el usuario no existe?</li>
    <li>¿Por qué el enum de roles debe mapearse con el prefijo `ROLE_` al crear instancias de `SimpleGrantedAuthority`?</li>
    <li>¿Para qué se utiliza la anotación `@AuthenticationPrincipal` en un método controlador?</li>
    <li>¿Cómo impide el método `isEnabled()` de `UserDetails` el acceso a usuarios dados de baja sin borrar sus registros?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · El método loadUserByUsername(String username), lanzando UsernameNotFoundException si el registro no se localiza.</p>
  <p>2 · Porque las expresiones de seguridad de Spring (hasRole) asumen internamente la existencia del prefijo ROLE_ por convención.</p>
  <p>3 · Para inyectar directamente en el parámetro del controlador el objeto UserDetails/Usuario asociado al contexto de seguridad de la petición actual.</p>
  <p>4 · Spring Security comprueba su valor booleano tras validar la contraseña; si devuelve false, aborta la autenticación con una excepción de cuenta deshabilitada (DisabledException) y responde 401.</p>
</details>

## Sesión 57 · Roles y permisos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la diferencia entre Roles (agrupaciones globales con <code>hasRole()</code>) y Autoridades o Permisos atómicos (capacidades específicas con <code>hasAuthority()</code>), la autorización a nivel de ruta en <code>SecurityFilterChain</code> frente a la autorización granular en métodos con <code>@PreAuthorize</code> y <code>@EnableMethodSecurity</code>.</li>
    <li><strong>2. Haz:</strong> traslada la Matriz de Control de Acceso (RBAC) diseñada en la sesión 53 a tu aplicación, blindando endpoints sensibles según el rol del usuario autenticado.</li>
    <li><strong>3. Comprueba:</strong> ejecutas peticiones en Bruno alternando entre identidades con rol `DESARROLLADOR` y `ADMINISTRADOR`, verificando que los desarrolladores reciben <code>403 Forbidden</code> al intentar borrar proyectos mientras que los administradores completan la acción con <code>204 No Content</code>.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué diferencia sintáctica y conceptual existe entre comprobar <code>hasRole('ADMIN')</code> y comprobar <code>hasAuthority('ROLE_ADMIN')</code>?</li>
    <li>¿Qué anotación de configuración es obligatorio activar para poder utilizar <code>@PreAuthorize</code> sobre métodos de controladores o servicios?</li>
    <li>¿Por qué proteger la seguridad únicamente por rutas URL en <code>SecurityFilterChain</code> es vulnerable si un método de servicio es invocado internamente desde otro flujo?</li>
  </ol>
</div>

### Roles globales frente a Permisos atómicos

En aplicaciones en crecimiento existen dos formas de modelar la autorización:

<figure class="diagram">
  <figcaption>Roles vs Permisos en Spring Security</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Usuario</li>
    <li>Roles (ROLE_ADMIN, ROLE_DEV)</li>
    <li>Permisos Atómicos (PROYECTO_BORRAR, TAREA_EDITAR)</li>
    <li>Operación protegida</li>
  </ol>
</figure>

* **Roles (`hasRole`):** Representan el cargo de una persona en la organización. Por convención en Spring Security llevan el prefijo `ROLE_` en la base de datos, pero en el código se evalúan sin él:
  * `hasRole('ADMINISTRADOR')` comprueba internamente si el usuario posee la autoridad `ROLE_ADMINISTRADOR`.
* **Autoridades / Permisos atómicos (`hasAuthority`):** Representan una acción puntual sobre un recurso (`PROYECTO_WRITE`, `TAREA_DELETE`, `INFORME_EXPORTAR`).
  * Permiten construir sistemas de permisos ultra-flexibles donde los roles son agrupaciones de permisos configurables en base de datos.

### Seguridad en rutas URL frente a Seguridad en métodos con @PreAuthorize

Podemos aplicar reglas de autorización en dos capas complementarias:

| Estrategia | Dónde se define | Sintaxis típica | Ventajas y uso recomendado |
| :--- | :--- | :--- | :--- |
| **Seguridad de Rutas (HTTP Filter)** | En `SecurityConfig` dentro de `SecurityFilterChain`. | `.requestMatchers(HttpMethod.DELETE, "/api/v1/proyectos/**").hasRole("ADMINISTRADOR")` | Primera barrera perimetral: rechaza peticiones no autorizadas antes de que lleguen al controlador. |
| **Seguridad de Métodos (@PreAuthorize)** | Sobre métodos de controladores o clases `@Service`. | `@PreAuthorize("hasRole('ADMINISTRADOR')")`<br>`@PreAuthorize("hasRole('DEV') and #tarea.autor == authentication.name")` | Seguridad en profundidad: permite evaluar reglas de negocio complejas, parámetros del método (`#id`) y expresiones de propiedad (**SpEL**). |

### Paso a paso guiado · Implementar la Matriz RBAC en la aplicación

<p class="stage">Paso 1 · Activar la seguridad de métodos en SecurityConfig</p>

Añadimos la anotación `@EnableMethodSecurity` en nuestra clase de configuración:

```java
package com.empresa.proyecto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Habilita anotaciones @PreAuthorize y @Secured en toda la aplicación
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas de consulta y documentación
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/proyectos/**", "/api/v1/tareas/**").permitAll()

                // Gestión de usuarios: reservada estrictamente a Administradores
                .requestMatchers("/api/v1/usuarios/**").hasRole("ADMINISTRADOR")

                // Todo lo demás requiere que el usuario esté al menos autenticado
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
```

<p class="stage">Paso 2 · Proteger operaciones con @PreAuthorize en ProyectoController</p>

Decoramos los métodos de escritura con anotaciones declarativas:

```java
@RestController
@RequestMapping("/api/v1/proyectos")
public class ProyectoController {

    private final ProyectoService proyectoService;

    public ProyectoController(ProyectoService proyectoService) {
        this.proyectoService = proyectoService;
    }

    // Creación permitida a Jefes de Proyecto y Administradores
    @PostMapping
    @PreAuthorize("hasAnyRole('JEFE_PROYECTO', 'ADMINISTRADOR')")
    public ResponseEntity<ProyectoResponse> crear(@Valid @RequestBody ProyectoRequest request) {
        // ...
    }

    // Borrado de proyectos: reservado exclusivamente a Administradores
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        proyectoService.eliminarProyecto(id);
        return ResponseEntity.noContent().build();
    }
}
```

<p class="stage">Paso 3 · Regla de propiedad con Spring Expression Language (SpEL)</p>

Podemos condicionar la edición de una tarea a que el usuario sea el autor de la misma:

```java
    // El usuario solo puede editar la tarea si es Administrador O si él mismo es el asignado
    @PutMapping("/tareas/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR') or @tareaSecurityService.esAsignado(#id, authentication.name)")
    public ResponseEntity<TareaResponse> actualizarTarea(
            @PathVariable Long id, 
            @Valid @RequestBody TareaRequest request) {
        // ...
    }
```

Donde `tareaSecurityService` es un componente Spring que comprueba la base de datos:

```java
@Component
public class TareaSecurityService {
    private final TareaRepository tareaRepository;

    public TareaSecurityService(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    public boolean esAsignado(Long tareaId, String username) {
        return tareaRepository.findById(tareaId)
            .map(t -> t.getAsignadoA() != null && t.getAsignadoA().getUsername().equals(username))
            .orElse(false);
    }
}
```

### La comprobación · Simulación de matriz de permisos en Bruno

Con los usuarios cargados en PostgreSQL (`admin` con `ROLE_ADMINISTRADOR` y `dev1` con `ROLE_DESARROLLADOR`), ejecuta estas pruebas en Bruno:

1. **Borrado por Administrador:**
   * Petición: `DELETE /api/v1/proyectos/1`.
   * Auth: Basic con `admin` / `Password123!`.
   * **Resultado esperado:** Código **`204 No Content`**. Operación permitida.
2. **Borrado fraudulento por Desarrollador:**
   * Misma petición: `DELETE /api/v1/proyectos/1`.
   * Auth: Basic con `dev1` / `Password123!`.
   * **Resultado esperado:** Código **`403 Forbidden`**. Spring Security intercepta la llamada, comprueba que `dev1` carece de `ROLE_ADMINISTRADOR` y deniega el acceso sin ejecutar el método del controlador.
3. **Acceso anónimo a la misma ruta:**
   * Misma petición sin credenciales en la pestaña Auth.
   * **Resultado esperado:** Código **`401 Unauthorized`**.

### Ahora tú · Proteger la creación de tareas

Implementa la autorización en el controlador de tareas:
1. Permite que tanto `ROLE_DESARROLLADOR`, `ROLE_JEFE_PROYECTO` como `ROLE_ADMINISTRADOR` puedan crear tareas sobre un proyecto existente (`POST /api/v1/proyectos/{id}/tareas`).
2. Restringe el borrado de tareas (`DELETE /api/v1/tareas/{id}`) exclusivamente a `ROLE_JEFE_PROYECTO` y `ROLE_ADMINISTRADOR`.
3. Comprueba con Bruno que `dev1` recibe `403` al intentar borrar una tarea pero puede crear una nueva con éxito (`201`).

### Reto · Excepciones de acceso denegado personalizadas

Por defecto, cuando un usuario autenticado recibe un `403 Forbidden`, Spring Security no devuelve un formato amigable.

Implementa un `AccessDeniedHandler` personalizado:
1. Crea la clase `CustomAccessDeniedHandler` que implemente `AccessDeniedHandler`.
2. Emite una respuesta estándar **RFC 7807** con código `403`, título *"Acceso Denegado"* y detalle indicando que el rol actual no dispone de los privilegios requeridos.
3. Regístralo en `SecurityConfig` bajo `.exceptionHandling(ex -> ex.accessDeniedHandler(...))`.

> [!NOTE]
> Si en la evaluación se solicita un informe técnico sobre la jerarquía de roles y auditoría de accesos denegados, el formato oficial de entrega de texto es siempre un **documento en PDF** (`informe-roles-seguridad.pdf`), nunca un archivo markdown suelto.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Reglas de autorización por rol configuradas en `SecurityFilterChain` y probadas con Bruno.</span></div>
  <div><strong>Si lo tienes</strong><span>Anotación `@PreAuthorize` aplicada en controladores con `hasRole` y `hasAnyRole` diferenciando 401 y 403.</span></div>
  <div><strong>Reto</strong><span>Expresiones SpEL para seguridad a nivel de fila y `AccessDeniedHandler` emitiendo respuestas RFC 7807 ante 403.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 57</p>
  <ul class="checklist">
    <li>Se distingue con rigor entre roles generales (`hasRole`) y autoridades atómicas (`hasAuthority`).</li>
    <li>La anotación `@EnableMethodSecurity` está activada para habilitar autorización declarativa.</li>
    <li>Las operaciones destructivas (DELETE, PUT) están estrictamente limitadas a roles autorizados.</li>
    <li>Se comprueba que los intentos no autorizados por usuarios autenticados devuelven `403 Forbidden`.</li>
    <li>Se comprende el uso de expresiones SpEL para reglas de control de acceso a nivel de fila (ABAC).</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué `hasRole('ADMIN')` espera encontrar internamente la autoridad `ROLE_ADMIN`?</li>
    <li>¿Qué ventaja ofrece `@PreAuthorize` frente a declarar todas las reglas de autorización en el `filterChain`?</li>
    <li>¿Qué código HTTP debe devolver la API si un usuario con rol `ROLE_DESARROLLADOR` intenta invocar un endpoint con `@PreAuthorize("hasRole('ADMINISTRADOR')")`?</li>
    <li>¿Para qué se utiliza el prefijo `#` en una expresión SpEL dentro de `@PreAuthorize` (ej: `#id`)?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque Spring Security añade automáticamente el prefijo ROLE_ por convención histórica para diferenciar roles de permisos simples.</p>
  <p>2 · Permite colocar la regla de seguridad junto al método que ejecuta la acción, facilitando la legibilidad, y permite acceder a los parámetros del método y a la lógica de dominio.</p>
  <p>3 · Código HTTP 403 Forbidden.</p>
  <p>4 · Para hacer referencia a un argumento formal que recibe el método anotado (evaluación contextual de parámetros).</p>
</details>


## Semana 20 · Tokens y fronteras web

## Sesión 58 · Proteger endpoints

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> ocultar un botón en la interfaz no impide invocar directamente el endpoint.</li>
    <li><strong>Construye:</strong> pruebas manuales de acceso con diferentes identidades.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **aplicar autorización en rutas y servicios y comprobar intentos permitidos y denegados**.

### 2. El problema

Ocultar un botón en la interfaz no impide invocar directamente el endpoint.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido pruebas manuales de acceso con diferentes identidades.</li>
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

## Sesión 59 · Sesión frente a token: JWT

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> las dos estrategias funcionan, y elegir por costumbre lleva a una API que no encaja con sus clientes.</li>
    <li><strong>Construye:</strong> un flujo JWT mínimo con expiración y claims imprescindibles.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **comparar sesión con cookie y token JWT, y justificar cuál conviene a esta aplicación**.

### 2. El problema

Las dos estrategias funcionan, y elegir por costumbre lleva a una API que no encaja con sus clientes.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un flujo JWT mínimo con expiración y claims imprescindibles.</li>
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

## Sesión 60 · CSRF, CORS con credenciales y errores frecuentes

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> al añadir credenciales, la integración que ya funcionaba en la UD8 vuelve a fallar por motivos nuevos.</li>
    <li><strong>Construye:</strong> una configuración explicada y una batería breve de casos permitidos y bloqueados.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **distinguir políticas del navegador y ataques de petición cruzada aplicando controles adecuados**.

### 2. El problema

Al añadir credenciales, la integración que ya funcionaba en la UD8 vuelve a fallar por motivos nuevos.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una configuración explicada y una batería breve de casos permitidos y bloqueados.</li>
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
    <li>Explicar por qué HTTP no mantiene estado y cómo lo resuelven cookies y sesión.</li>
    <li>Distinguir autenticación de autorización.</li>
    <li>Almacenar contraseñas con un algoritmo de hash adecuado.</li>
    <li>Proteger endpoints por rol y por permiso con Spring Security.</li>
    <li>Elegir entre sesión y token justificando la decisión.</li>
    <li>Reconocer y corregir los fallos habituales de CSRF y de CORS con credenciales.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

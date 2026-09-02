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
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la falacia de la seguridad por ocultación en el cliente (<em>Client-side Security vs Server-side Enforcement</em>), por qué ocultar o deshabilitar un botón en el navegador no protege un endpoint, y cómo escribir pruebas de integración web de seguridad con <code>MockMvc</code> y <code>@WithMockUser</code>.</li>
    <li><strong>2. Haz:</strong> escribe una batería de pruebas de integración con <code>@WebMvcTest</code> que comprueba sistemáticamente el acceso de tres identidades distintas (Anónimo, <code>DESARROLLADOR</code> y <code>ADMINISTRADOR</code>) sobre las operaciones de creación y borrado.</li>
    <li><strong>3. Comprueba:</strong> ejecutas <code>./mvnw test</code> verificando que las peticiones anónimas reciben <code>401</code>, los roles insuficientes reciben <code>403</code> y los administradores completan la operación con éxito en milisegundos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Por qué ocultar un botón de «Eliminar» en la interfaz web de React o Angular no ofrece ninguna protección real contra un usuario malintencionado?</li>
    <li>¿Qué anotación de Spring Security Test permite simular que un usuario con un rol específico está autenticado durante una prueba con MockMvc sin necesidad de consultar la base de datos?</li>
    <li>Si un endpoint devuelve `403 Forbidden` ante una petición no autorizada, ¿significa que el código del método del controlador llegó a ejecutarse?</li>
  </ol>
</div>

### La falacia de la seguridad por ocultación

Uno de los errores más peligrosos de los desarrolladores que vienen del mundo frontend es pensar que la seguridad consiste en esto:

```html
<!-- CUIDADO: Esto es experiencia de usuario, NO es seguridad -->
<button *ngIf="usuario.rol === 'ADMIN'" (click)="eliminarProyecto(id)">
  Eliminar proyecto
</button>
```

Ocultar ese botón es una buena práctica de diseño de interfaces: a un usuario normal no le muestras botones que no puede usar.

Pero **confundir eso con seguridad es un error catastrófico**:
* Cualquier usuario puede abrir la consola de DevTools (`F12`), inspeccionar el DOM y eliminar el atributo `disabled` o hacer visible el botón en 3 segundos.
* Cualquier usuario puede abrir Bruno, Postman o una consola con `curl` y lanzar directamente un `DELETE http://localhost:8080/api/v1/proyectos/1`.

<div class="rule">
  <p class="rule-label">La ley del servidor como frontera única</p>
  <p><strong>El cliente web es un entorno bajo el control absoluto del usuario (y del atacante).</strong></p>
  <p>La única frontera real de seguridad de un sistema es el <strong>backend</strong>. Todo endpoint debe comprobar permisos en el servidor en cada petición, asumiendo siempre que el cliente puede ser malicioso.</p>
</div>

### Pruebas de seguridad con MockMvc y @WithMockUser

Para garantizar que nuestros endpoints están blindados y que ningún refactor futuro rompa las reglas de seguridad, escribimos pruebas automáticas con **`@WithMockUser`**:

```java
@Test
@WithMockUser(username = "dev1", roles = {"DESARROLLADOR"})
void eliminarProyecto_conRolDesarrollador_devuelve403Forbidden() throws Exception {
    mockMvc.perform(delete("/api/v1/proyectos/1"))
        .andExpect(status().isForbidden());
}
```

La anotación `@WithMockUser`:
* Inyecta un `Authentication` en el `SecurityContextHolder` antes de que el filtro de seguridad ejecute la petición.
* Permite probar autorizaciones (`hasRole`, `@PreAuthorize`) de forma instantánea sin necesidad de crear usuarios en PostgreSQL ni generar hashes BCrypt.

### Paso a paso guiado · Batería de tests de seguridad para ProyectoController

Vamos a crear la suite de pruebas que valida los límites de acceso:

<p class="stage">Paso 1 · Configurar la clase de test con contexto de seguridad</p>

```java
package com.empresa.proyecto;

import com.empresa.proyecto.controller.ProyectoController;
import com.empresa.proyecto.service.ProyectoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProyectoController.class)
class ProyectoSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProyectoService proyectoService;
```

<p class="stage">Paso 2 · Test de rechazo a petición anónima (401)</p>

Verificamos que si no hay identidad en el contexto, el peralte de seguridad intercepta la llamada:

```java
    @Test
    void eliminarProyecto_sinAutenticar_devuelve401Unauthorized() throws Exception {
        mockMvc.perform(delete("/api/v1/proyectos/1"))
            .andExpect(status().isUnauthorized());

        // Verificamos que la lógica de negocio jamás fue invocada
        verify(proyectoService, never()).eliminarProyecto(anyLong());
    }
```

<p class="stage">Paso 3 · Test de acceso denegado por rol insuficiente (403)</p>

Verificamos que un usuario identificado con rol `DESARROLLADOR` recibe `403`:

```java
    @Test
    @WithMockUser(username = "juan.dev", roles = {"DESARROLLADOR"})
    void eliminarProyecto_conRolDesarrollador_devuelve403Forbidden() throws Exception {
        mockMvc.perform(delete("/api/v1/proyectos/1"))
            .andExpect(status().isForbidden());

        verify(proyectoService, never()).eliminarProyecto(anyLong());
    }
```

<p class="stage">Paso 4 · Test de acceso autorizado para Administrador (204)</p>

Verificamos que el rol `ADMINISTRADOR` ejecuta la acción con éxito:

```java
    @Test
    @WithMockUser(username = "admin.jefe", roles = {"ADMINISTRADOR"})
    void eliminarProyecto_conRolAdministrador_devuelve204NoContent() throws Exception {
        doNothing().when(proyectoService).eliminarProyecto(1L);

        mockMvc.perform(delete("/api/v1/proyectos/1"))
            .andExpect(status().isNoContent());

        verify(proyectoService, times(1)).eliminarProyecto(1L);
    }
}
```

### La comprobación · Ejecutar la suite de seguridad en terminal

Ejecuta las pruebas desde la consola de Maven:

```bash
./mvnw test -Dtest=ProyectoSecurityTest
```

Comprueba en la salida:
* Los 3 tests pasan al 100 % en verde en menos de 1 segundo.
* Queda matemáticamente demostrado que da igual qué botones oculte el frontend: **un usuario no administrador jamás podrá borrar un proyecto en el servidor**.

### Ahora tú · Batería de tests de seguridad para Tareas

Aplica el mismo patrón para proteger la creación y modificación de tareas:

1. Crea `TareaSecurityTest`.
2. Escribe un test que verifique que un usuario anónimo recibe `401` al intentar crear una tarea (`POST /api/v1/proyectos/1/tareas`).
3. Escribe un test con `@WithMockUser(roles = "DESARROLLADOR")` que confirme que un desarrollador sí puede crear tareas (código `201`).
4. Escribe un test que verifique que el borrado de tareas está prohibido (`403`) para un usuario con rol de invitado o externo.

### Reto · Pruebas de seguridad basadas en atributos con SpEL

En la sesión anterior definimos que un desarrollador solo puede editar las tareas que tiene asignadas a su nombre.

¿Cómo se prueba esa regla con MockMvc?
1. Escribe un test simulando a `@WithMockUser(username = "carlos")`.
2. Simula una tarea cuyo responsable es `"maria"`.
3. Verifica que al intentar hacer `PUT /api/v1/tareas/10` el sistema responde con `403 Forbidden`.
4. Repite la prueba con una tarea asignada a `"carlos"` y confirma que responde con `200 OK`.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tests de seguridad con `@WebMvcTest` y `@WithMockUser` verificando casos 401, 403 y 204.</span></div>
  <div><strong>Si lo tienes</strong><span>Suite completa de proyectos y tareas cubriendo la matriz RBAC completa con aserciones estrictas.</span></div>
  <div><strong>Reto</strong><span>Tests de autorización a nivel de fila (SpEL) con simulación de propiedad de recursos verificados.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 58</p>
  <ul class="checklist">
    <li>Se erradica la creencia errónea de que la seguridad de la interfaz sustituye a la del backend.</li>
    <li>Las reglas de control de acceso están blindadas mediante pruebas automatizadas con `MockMvc`.</li>
    <li>Se utiliza `@WithMockUser` para simular identidades y roles sin coste de base de datos.</li>
    <li>Se verifica que el servicio de negocio nunca llega a ejecutarse ante accesos no autorizados.</li>
    <li>La suite completa de tests de seguridad pasa en verde con `./mvnw test`.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué ocultar o deshabilitar un botón en el cliente web no constituye una medida de seguridad?</li>
    <li>¿Qué diferencia hay entre lo que comprueba un test de `@WebMvcTest` normal y uno con `@WithMockUser`?</li>
    <li>¿Por qué en los tests de casos 401 y 403 es importante verificar con `verify(service, never())`?</li>
    <li>¿Cómo se especifica en `@WithMockUser` que un usuario tiene varios roles a la vez?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el cliente corre en el dispositivo del usuario, quien puede inspeccionar el DOM, modificar el script o lanzar peticiones HTTP directas por consola evadiendo cualquier restricción visual.</p>
  <p>2 · El test normal evalúa rutas y serialización; @WithMockUser inyecta un contexto de seguridad previo para comprobar si los filtros y @PreAuthorize permiten o bloquean la petición.</p>
  <p>3 · Para demostrar fehacientemente que la seguridad interceptó la llamada en la frontera de red y que ninguna lógica de negocio llegó a ejecutarse en el servidor.</p>
  <p>4 · Mediante el atributo roles = {"ROL_A", "ROL_B"} dentro de la anotación.</p>
</details>

## Sesión 59 · Sesión frente a token: JWT

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> la comparación arquitectónica entre <strong>Sesión con Cookie (con estado)</strong> y <strong>JSON Web Token (JWT, sin estado)</strong>, la anatomía de un token firmado (Header, Payload, Signature), los tipos de <em>Claims</em> y el compromiso de la revocación.</li>
    <li><strong>2. Haz:</strong> implementa un servicio generador y validador de tokens JWT con una clave secreta segura, y construye un <code>JwtAuthenticationFilter</code> que extrae la cabecera <code>Authorization: Bearer</code> en cada petición.</li>
    <li><strong>3. Comprueba:</strong> obtienes un token JWT mediante login, lo decodificas e inspeccionas en <code>jwt.io</code> y consumes un endpoint protegido verificando que el servidor valida tu identidad sin almacenar ninguna sesión en memoria.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Qué tres partes separadas por puntos componen la estructura de un JSON Web Token (JWT)?</li>
    <li>¿Por qué un JWT se define como un mecanismo de autenticación «sin estado» (<em>stateless</em>)?</li>
    <li>¿Qué problema fundamental surge si necesitas revocar el acceso a un usuario inmediatamente (por ejemplo, tras un despido) cuando la API utiliza JWT puros sin base de datos centralizada?</li>
  </ol>
</div>

### El gran debate arquitectónico: ¿Sesión o Token?

Una de las decisiones técnicas más discutidas en arquitectura web es elegir la estrategia de autenticación:

<figure class="diagram">
  <figcaption>Sesión con Cookie vs Token JWT</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Sesión: El cliente guarda un ID opaco; el servidor guarda los datos en RAM/Redis.</li>
    <li>JWT: El cliente guarda los datos firmados; el servidor no guarda nada en RAM.</li>
  </ol>
</figure>

| Característica | Sesión basada en Cookies (`JSESSIONID`) | Token firmado (JWT) |
| :--- | :--- | :--- |
| **Estado en el servidor** | **Con estado (*Stateful*):** El servidor debe recordar la sesión en su memoria RAM o en un almacén Redis compartido. | **Sin estado (*Stateless*):** El servidor no guarda nada en memoria; valida la firma matemática del token en cada petición. |
| **Escalabilidad horizontal** | Requiere balanceo con sesiones pegajosas (*Sticky Sessions*) o clúster de Redis centralizado. | **Excelente de forma nativa:** Cualquier instancia de Spring Boot con la misma clave secreta puede validar el token sin consultar bases de datos. |
| **Clientes heterogéneos** | Ideal para aplicaciones web tradicionales en el navegador. | Ideal para aplicaciones móviles (iOS/Android), microservicios y APIs consumidas por terceros. |
| **Revocación inmediata** | **Trivial:** Basta con ejecutar `session.invalidate()` o borrar la clave en Redis. | **Compleja:** Una vez emitido, el token es válido hasta que expire su fecha `exp`, a menos que mantengas una lista negra en base de datos (reintroduciendo estado). |

### Anatomía de un JSON Web Token (JWT)

Un JWT es una cadena de texto compacta dividida en tres partes separadas por puntos:

```text
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbCI6IlJPTEVfQURNSU4iLCJleHAiOjE3NzA5ODc2MDB9.D3f8A9...
\___________________/ \___________________________________________________________________/ \_______/
       Header                                       Payload                                 Signature
```

1. **Header (Cabecera):** Especifica el tipo de token (`JWT`) y el algoritmo de firma criptográfica (ej: `HS256` para HMAC con clave secreta compartida, o `RS256` para clave pública/privada).
2. **Payload (Cuerpo / Reclamaciones - *Claims*):** Contiene las afirmaciones sobre el usuario en formato JSON:
   * Reclamaciones estándar: `sub` (*subject*, nombre de usuario), `iat` (*issued at*, fecha de emisión), `exp` (*expiration*, fecha de caducidad).
   * Reclamaciones personalizadas: `roles`, `email`, `tenantId`.
   * **¡Atención!** El payload no está cifrado; solo está codificado en Base64Url. **Cualquiera puede leerlo**. Nunca guardes contraseñas ni datos confidenciales dentro de un JWT.
3. **Signature (Firma criptográfica):** Se calcula combinando el Header y el Payload codificados con una clave secreta conocida solo por el servidor:
   $$\text{Firma} = \text{HMAC-SHA256}(\text{Header} + "." + \text{Payload}, \text{SECRET\_KEY})$$
   Si un atacante modifica un solo carácter del payload (por ejemplo, cambia su rol de `ROLE_DEV` a `ROLE_ADMIN`), la firma deja de coincidir y el backend **rechaza el token de inmediato**.

### Paso a paso guiado · Generación y validación de JWT en Spring Boot

Para trabajar con JWT en Java utilizamos la librería estándar de la industria `jjwt`:

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.5</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.5</version>
    <scope>runtime</scope>
</dependency>
```

<p class="stage">Paso 1 · Crear el servicio JwtService</p>

Este servicio encapsula la firma y lectura de tokens mediante una clave secreta segura:

```java
package com.empresa.proyecto.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    // Clave secreta de al menos 256 bits (32 caracteres) externalizada
    @Value("${app.security.jwt.secret:clave-secreta-super-larga-y-segura-de-al-menos-256-bits-2026!}")
    private String jwtSecret;

    @Value("${app.security.jwt.expiration-minutes:60}")
    private long expirationMinutes;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generarToken(UserDetails userDetails, Map<String, Object> claimsExtra) {
        long ahora = System.currentTimeMillis();
        long expiracion = ahora + (expirationMinutes * 60 * 1000);

        return Jwts.builder()
            .claims(claimsExtra)
            .subject(userDetails.getUsername())
            .issuedAt(new Date(ahora))
            .expiration(new Date(expiracion))
            .signWith(getSigningKey())
            .compact();
    }

    public String extraerUsername(String token) {
        return extraerClaims(token).getSubject();
    }

    public boolean esTokenValido(String token, UserDetails userDetails) {
        final String username = extraerUsername(token);
        return (username.equals(userDetails.getUsername()) && !estaExpirado(token));
    }

    private boolean estaExpirado(String token) {
        return extraerClaims(token).getExpiration().before(new Date());
    }

    private Claims extraerClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }
}
```

<p class="stage">Paso 2 · Crear el filtro JwtAuthenticationFilter</p>

Creamos un filtro que intercepta cada petición, extrae la cabecera `Authorization: Bearer <token>` y puebla el contexto de Spring Security:

```java
package com.empresa.proyecto.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1. Si no hay cabecera Bearer, dejamos pasar la petición a los siguientes filtros
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7); // Extraemos la cadena tras "Bearer "
        final String username = jwtService.extraerUsername(jwt);

        // 2. Si el token tiene usuario y no está autenticado previamente en el contexto
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            if (jwtService.esTokenValido(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 3. Establecemos la identidad verificada en el contexto de la petición
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

<p class="stage">Paso 3 · Integrar el filtro y establecer SessionCreationPolicy.STATELESS</p>

En `SecurityConfig`, registramos el filtro antes del filtro de usuario/contraseña y declaramos la API como estrictamente sin estado:

```java
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
```

### La comprobación · Inspección de token en jwt.io y Bruno

1. **Crear endpoint de login:** Un endpoint `POST /api/v1/auth/login` que recibe `username` y `password`, valida contra `AuthenticationManager` y responde:
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIs...",
     "tipo": "Bearer",
     "expiraEnMinutos": 60
   }
   ```
2. **Inspeccionar en jwt.io:**
   * Copia el token devuelto y pégalo en la herramienta web [jwt.io](https://jwt.io).
   * Comprueba cómo el panel derecho decodifica en tiempo real el Header y el Payload mostrando tu `sub: "admin"`.
3. **Consumir endpoint protegido con Bearer Token:**
   * En Bruno, ve a `GET /api/v1/proyectos`.
   * En la pestaña **Auth**, selecciona **Bearer Token** y pega el JWT.
   * Envía la petición y comprueba que responde `200 OK`.
4. **Prueba de manipulación de firma:**
   * Modifica una sola letra en el centro del token en Bruno y vuelve a enviar.
   * **Resultado:** Código `401 Unauthorized`. Spring Security detecta que la firma no coincide y rechaza la petición.

### Ahora tú · Guardar y usar el token en el cliente de la UD8

Conecta el cliente web `cliente/index.html`:
1. Añade un formulario de login con usuario y contraseña.
2. Al pulsar entrar, lanza `POST /api/v1/auth/login`.
3. Al recibir el token, guárdalo en memoria o en `sessionStorage.setItem('jwt', data.token)`.
4. En las peticiones posteriores de listar o crear proyectos, inyecta la cabecera:
   ```javascript
   headers: {
     'Content-Type': 'application/json',
     'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')
   }
   ```
5. Comprueba que el navegador puede crear y listar recursos sin usar cookies de sesión.

### Reto · El dilema de la revocación de tokens

Un empleado con acceso de Administrador es despedido a las 11:00. Su token JWT expira a las 12:00.
* Durante 60 minutos, ese token sigue siendo criptográficamente válido ante cualquier servidor del mundo.

Investiga las tres estrategias de la industria para mitigar este problema:
1. **Tokens de vida corta (*Short-lived Access Tokens* de 10 minutos) + Tokens de refresco (*Refresh Tokens* de 7 días)** almacenados en base de datos.
2. **Listas negras de revocación en Redis (*Token Blacklisting*)**.
3. Compara el coste de cada enfoque frente a la sencillez de una sesión clásica con cookies.

> [!NOTE]
> Si en la evaluación se solicita un informe comparativo entre arquitectura de sesión y arquitectura de tokens, el formato oficial de entrega de texto es siempre un **documento en PDF** (`informe-jwt-sesion.pdf`), nunca un archivo markdown suelto.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Servicio `JwtService` implementado, token generado con clave segura y decodificado en `jwt.io`.</span></div>
  <div><strong>Si lo tienes</strong><span>Filtro `JwtAuthenticationFilter` integrado en `SecurityFilterChain` con política `STATELESS` y probado en Bruno.</span></div>
  <div><strong>Reto</strong><span>Estrategia de Access Token + Refresh Token analizada y justificada para mitigar el problema de revocación.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 59</p>
  <ul class="checklist">
    <li>Se comprende la diferencia entre autenticación con estado (sesión) y sin estado (JWT).</li>
    <li>La anatomía de un JWT (Header, Payload y Firma) se identifica y decodifica con soltura.</li>
    <li>La firma criptográfica garantiza que los claims no pueden ser alterados por el cliente.</li>
    <li>La API opera en modo estrictamente sin estado (`SessionCreationPolicy.STATELESS`).</li>
    <li>Las peticiones autenticadas viajan mediante el estándar `Authorization: Bearer <token>`.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué es peligroso almacenar datos sensibles como contraseñas en el Payload de un JWT?</li>
    <li>¿Cómo sabe el servidor si los datos de un JWT fueron alterados durante el tránsito?</li>
    <li>¿Qué significa que una API opere con `SessionCreationPolicy.STATELESS`?</li>
    <li>¿Qué formato exacto debe tener la cabecera HTTP estándar para transmitir un token JWT?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el Payload no está cifrado, solo está codificado en Base64Url; cualquier intermediario o usuario puede decodificarlo y leer su contenido de inmediato.</p>
  <p>2 · Porque recalcula la firma criptográfica con su clave secreta y los datos recibidos; si los datos cambiaron, la firma calculada no coincidirá con la del token y será rechazado.</p>
  <p>3 · Que Spring Security nunca creará ni utilizará un objeto HttpSession en la memoria del servidor para almacenar el contexto de seguridad entre peticiones.</p>
  <p>4 · Authorization: Bearer &lt;cadena-del-token&gt;.</p>
</details>

## Sesión 60 · CSRF, CORS con credenciales y errores frecuentes

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> el mecanismo del ataque de falsificación de peticiones en sitios cruzados (<strong>CSRF - Cross-Site Request Forgery</strong>), por qué las APIs con tokens Bearer son inmunes mientras que las basadas en cookies son vulnerables, y la interacción crítica entre CORS y credenciales de usuario.</li>
    <li><strong>2. Haz:</strong> elabora una configuración de seguridad unificada que integra CORS acotado y reglas de CSRF adecuadas según la estrategia de autenticación elegida.</li>
    <li><strong>3. Comprueba:</strong> construyes una matriz de diagnóstico de los 4 errores clásicos de Spring Security (401 por falta de cabecera, 403 por token CSRF ausente, bloqueo de CORS por credenciales y token JWT expirado), demostrando cómo resolver cada uno en menos de dos minutos.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿En qué consiste exactamente un ataque CSRF y por qué depende de que el navegador envíe cookies automáticamente?</li>
    <li>¿Por qué una API REST que solo se autentica mediante cabeceras `Authorization: Bearer <token>` puede desactivar la protección CSRF de forma completamente segura?</li>
    <li>¿Qué sucede si intentas hacer una petición cross-origin con cookies (`credentials: 'include'`) y el backend tiene configurado `allowedOrigins("*")`?</li>
  </ol>
</div>

### Anatomía de un ataque CSRF (Cross-Site Request Forgery)

Imagina este escenario:
1. Has iniciado sesión en tu banco (`https://tu-banco.com`). El servidor te asignó una cookie de sesión que tu navegador almacena.
2. Sin cerrar sesión, abres otra pestaña y visitas un foro o una web sospechosa (`https://web-maliciosa.com`).
3. La web maliciosa contiene este código oculto:
   ```html
   <img src="https://tu-banco.com/api/transferir?destino=cuenta-atacante&cantidad=1000" style="display:none;" />
   ```
4. El navegador intenta cargar la imagen haciendo una petición `GET` a `tu-banco.com`.
5. **¡El peligro!** Como la petición va dirigida a `tu-banco.com`, el navegador adjunta **automáticamente la cookie de sesión del banco**.
6. El servidor del banco recibe la petición con una cookie válida y ejecuta la transferencia pensando que la ordenaste tú.

<figure class="diagram">
  <figcaption>El ataque CSRF</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>1. Usuario con sesión activa en tu-banco.com</li>
    <li>2. Abre web-maliciosa.com en otra pestaña</li>
    <li>3. Script oculto lanza petición a tu-banco.com</li>
    <li>4. Navegador adjunta cookies automáticamente</li>
    <li>5. Servidor ejecuta la orden sin consentimiento</li>
  </ol>
</figure>

### ¿Por qué JWT con cabecera Authorization es inmune a CSRF?

El ataque CSRF funciona **exclusivamente porque los navegadores envían las cookies de forma automática e implícita** en peticiones hacia el dominio destino.

Cuando usamos tokens JWT transmitidos en la cabecera personalizada:
`Authorization: Bearer <token>`
* El navegador **jamás adjunta esa cabecera por su cuenta**.
* Para enviar esa cabecera, un script JavaScript tiene que leer el token de memoria y colocarlo explícitamente en el objeto `fetch()`.
* Como una web de terceros no puede leer la memoria ni el almacenamiento de tu origen (gracias a la Política del Mismo Origen), **es matemáticamente imposible ejecutar un ataque CSRF contra una API que use Bearer tokens**.

<div class="rule">
  <p class="rule-label">La regla de desactivación de CSRF</p>
  <p><strong>Solo puedes hacer <code>csrf.disable()</code> si tu API no utiliza cookies de sesión implícitas para autorizar mutaciones de datos.</strong></p>
  <p>Si tu API utiliza sesiones basadas en cookies y navegadores web, debes activar el token sincronizado anti-CSRF (<code>CookieCsrfTokenRepository</code>) de forma obligatoria.</p>
</div>

### Tabla de diagnóstico de los 4 errores clásicos de Spring Security

Durante la integración entre cliente web y backend protegido se presentan siempre los mismos cuatro tropiezos:

| Error observable | Dónde aparece | Causa técnica real | Solución exacta |
| :--- | :--- | :--- | :--- |
| **1 · 401 Unauthorized silencioso** | Pestaña Network de DevTools. | El cliente no envió la cabecera `Authorization` o la envió con un formato incorrecto (ej: falta la palabra `Bearer `). | Revisar el script de `fetch`: asegurar que añade `headers: { 'Authorization': 'Bearer ' + token }`. |
| **2 · 403 Forbidden inesperado en POST/PUT** | Consola y Network en aplicaciones con sesión. | La protección CSRF de Spring Security está activa y la petición de modificación no aportó el token `X-XSRF-TOKEN`. | Si usas JWT: asegurar `csrf.disable()`. Si usas cookies: leer el token de la cookie `XSRF-TOKEN` y reenviarlo en la cabecera `X-XSRF-TOKEN`. |
| **3 · Error de CORS al enviar credenciales** | Consola de JavaScript en rojo. | El cliente usó `credentials: 'include'`, pero el backend configuró `allowedOrigins("*")`. | En Spring Boot `WebConfig`, sustituir el comodín `*` por los orígenes exactos (`allowedOrigins("http://localhost:5500")`). |
| **4 · Token Expired (401 tras un tiempo)** | Consola de JavaScript. | La fecha `exp` del JWT quedó en el pasado y `JwtService` rechazó la firma. | Redirigir al usuario a la pantalla de login o solicitar un nuevo token mediante el endpoint de refresco (*Refresh Token*). |

### Paso a paso guiado · Configuración final unificada de seguridad y CORS

En Spring Security la configuración de CORS debe integrarse dentro de la propia `SecurityFilterChain` para que los filtros de seguridad no bloqueen las peticiones previas `OPTIONS`:

<p class="stage">Paso 1 · Integrar CORS formal en SecurityConfig</p>

```java
package com.empresa.proyecto.config;

import com.empresa.proyecto.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http, 
            JwtAuthenticationFilter jwtAuthFilter) throws Exception {

        http
            // 1. Vinculamos la configuración de CORS al ciclo de vida de Spring Security
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 2. Desactivamos CSRF porque nos autenticamos exclusivamente por Bearer tokens sin cookies
            .csrf(csrf -> csrf.disable())

            // 3. API estrictamente sin estado
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 4. Reglas de autorización de rutas
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/proyectos/**", "/api/v1/tareas/**").permitAll()
                .requestMatchers("/api/v1/usuarios/**").hasRole("ADMINISTRADOR")
                .anyRequest().authenticated()
            )

            // 5. Inyectamos nuestro filtro de JWT antes del filtro de usuario/contraseña
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // Orígenes explícitos (nunca comodín '*' cuando hay credenciales)
        config.setAllowedOrigins(List.of("http://localhost:5500", "http://127.0.0.1:5500"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setExposedHeaders(List.of("Location"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

### La comprobación · El flujo de integración completo de cliente a servidor

Realiza la prueba final de integración entre tu cliente web de la UD8 y la API blindada de la UD9:

1. **Abre `cliente/index.html` en `http://localhost:5500`:**
   * La lista de proyectos públicos se carga de inmediato sin pedir credenciales (`200 OK`).
2. **Intenta crear un proyecto sin hacer login:**
   * El formulario emite un `POST` sin cabecera `Authorization`.
   * En DevTools Network compruebas el código **`401 Unauthorized`**.
   * La interfaz muestra el mensaje en rojo: *"Debes iniciar sesión para realizar esta acción"*.
3. **Inicia sesión en la interfaz:**
   * Introduces usuario `admin` y clave `Password123!`.
   * El backend responde con el token JWT. El cliente lo almacena en `sessionStorage`.
4. **Vuelve a crear el proyecto:**
   * El cliente incluye `Authorization: Bearer <token>`.
   * El preflight `OPTIONS` responde `200` y el `POST` devuelve **`201 Created`**.
   * El nuevo proyecto aparece en pantalla al instante sin recargar la página.
5. **Verifica la consola:** Cero errores de CORS, cero errores de CSRF, cero fugas de seguridad.

### Ahora tú · Manejo del cierre de sesión (Logout) en el cliente

Implementa el cierre de sesión en tu página web:
1. Añade un botón *«Cerrar sesión»* en la cabecera de `index.html`.
2. Al pulsar el botón:
   * Elimina el token de la memoria del navegador: `sessionStorage.removeItem('jwt')`.
   * Actualiza el estado visual de la pantalla (oculta el panel de creación y muestra el botón de login).
3. Intenta crear un proyecto tras el logout y verifica que el servidor vuelve a responder `401`.

### Reto · Simulación de ataque CSRF y su contramedida

Para entender la gravedad de CSRF, realiza una prueba de concepto en un entorno controlado:
1. Diseña una página HTML maliciosa local (`atacante.html`) servida en el puerto 9000 con un formulario oculto que envíe un `POST` automático hacia un endpoint protegido por cookies.
2. Observa cómo el navegador adjunta las cookies y el backend vulnerable ejecuta la orden.
3. Activa en Spring Security el `CookieCsrfTokenRepository.withHttpOnlyFalse()` y observa cómo el servidor neutraliza el ataque respondiendo **`403 Forbidden (Invalid CSRF Token)`**.

> [!NOTE]
> Si en la evaluación se solicita un informe de auditoría de seguridad perimetral, CORS y prevención de ataques CSRF, el formato oficial de entrega de texto es siempre un **documento en PDF** (`auditoria-seguridad.pdf`), nunca un archivo markdown suelto.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Mecanismo de ataque CSRF comprendido y configuración unificada de CORS y seguridad aplicada.</span></div>
  <div><strong>Si lo tienes</strong><span>Flujo completo de autenticación por JWT integrado en el cliente web de la UD8 con gestión de errores.</span></div>
  <div><strong>Reto</strong><span>Simulación de ataque CSRF ejecutada en laboratorio y contramedida con tokens sincronizados verificada.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 60</p>
  <ul class="checklist">
    <li>Se distingue con precisión por qué las APIs con tokens Bearer son inmunes a ataques CSRF.</li>
    <li>La configuración de CORS está perfectamente integrada dentro de la `SecurityFilterChain`.</li>
    <li>Se aplican las reglas estrictas de incompatibilidad entre comodines (`*`) y credenciales.</li>
    <li>Los 4 errores clásicos de Spring Security se diagnostican y corrigen en menos de dos minutos.</li>
    <li>El cliente web completa el ciclo de login, consulta pública, creación autorizada y logout.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué un ataque CSRF no puede tener éxito contra una API que exige la cabecera `Authorization: Bearer`?</li>
    <li>¿Qué configuración de Spring Boot permite que las peticiones previas `OPTIONS` de CORS no sean bloqueadas por los filtros de autenticación?</li>
    <li>¿Por qué el cierre de sesión en una arquitectura JWT puramente stateless se realiza habitualmente destruyendo el token en el cliente?</li>
    <li>¿Cuál es la causa exacta cuando un frontend recibe un código 403 al enviar un formulario POST en una aplicación con sesiones y cookies activas?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el navegador no añade cabeceras personalizadas de forma automática en peticiones cruzadas; para enviarla se requiere JavaScript explícito del propio origen legítimo.</p>
  <p>2 · Configurar un CorsConfigurationSource vinculado formalmente a http.cors() dentro de la SecurityFilterChain.</p>
  <p>3 · Porque el servidor no mantiene ningún registro del token en memoria; al borrar el token del cliente, este pierde la capacidad de firmar y autorizar peticiones futuras.</p>
  <p>4 · Falta del token sincronizado anti-CSRF (la cabecera X-XSRF-TOKEN o parámetro _csrf no fue incluido en la petición).</p>
</details>

## Lo que debes recordar

### El método

En esta unidad has aprendido a transformar una API abierta en un sistema seguro, gobernado por la identidad y los privilegios.

Para proteger cualquier aplicación web profesional, aplica siempre este decálogo de seguridad:

<figure class="diagram">
  <figcaption>El decálogo de la arquitectura de seguridad</figcaption>
  <ol class="flow">
    <li>Asume la <strong>amnesia congénita de HTTP</strong>: cada petición llega aislada y debe demostrar su identidad en cada llamada.</li>
    <li><strong>NUNCA almacenes contraseñas en claro ni cifradas</strong>: utiliza siempre funciones hash criptográficas lentas con <em>Salt</em> (<strong>BCrypt</strong> con factor de coste 12).</li>
    <li>Separa conceptual y técnicamente la <strong>Autenticación (AuthN: ¿quién eres?)</strong> de la <strong>Autorización (AuthZ: ¿qué puedes hacer?)</strong>.</li>
    <li>Respeta la semántica de códigos HTTP: responde <strong><code>401</code></strong> ante credenciales ausentes o inválidas y <strong><code>403</code></strong> ante permisos insuficientes.</li>
    <li>Diseña formalmente una <strong>Matriz de Control de Acceso (RBAC)</strong> antes de escribir una sola línea de código de seguridad.</li>
    <li>Aplica el principio de <strong>seguridad por defecto</strong> mediante una <code>SecurityFilterChain</code> funcional en Spring Security 6.</li>
    <li>Carga usuarios reales desde PostgreSQL desacoplando tu entidad JPA mediante el contrato <strong><code>UserDetailsService</code></strong> y <strong><code>UserDetails</code></strong>.</li>
    <li>Combina la seguridad perimetral de rutas con la seguridad en profundidad mediante anotaciones declarativas <strong><code>@PreAuthorize</code></strong> y expresiones SpEL.</li>
    <li>Elige con criterio técnico entre <strong>Sesión con Cookie</strong> (aplicaciones web tradicionales) o <strong>Token firmado JWT</strong> (APIs móviles y distribuidas sin estado).</li>
    <li><strong>La seguridad nunca se fía del cliente</strong>: ocultar un botón en la interfaz es ergonomía; verificar el permiso en el backend es ingeniería.</li>
  </ol>
</figure>

### La idea más importante

> **La seguridad nunca se implementa en el cliente; el navegador es un entorno que el usuario y el atacante controlan al 100 %. La única frontera real de una aplicación es el backend: toda regla de negocio, permiso y validación debe verificarse en el servidor en cada petición sin asumir jamás que el cliente es de confianza.**

Ocultar botones o deshabilitar enlaces en una página web es una cortesía visual para que el usuario no se confunda. La verdadera seguridad consiste en que cuando un usuario intente saltarse esa interfaz y lanzar la petición a mano, el servidor detenga la operación en la frontera de red y responda con un muro infranqueable.

### Las decisiones que tienes que saber justificar

| Decisión de ingeniería | Lo que tienes que poder defender ante un tribunal |
| :--- | :--- |
| **BCrypt con factor 12 frente a SHA-256** | SHA-256 es ultrarrápido y vulnerable a ataques de fuerza bruta masivos con GPUs; BCrypt es deliberadamente lento, incluye *Salt* aleatorio contra tablas arcoíris y su coste computacional es adaptable en el tiempo. |
| **Diferenciación semántica entre 401 y 403** | 401 indica falta de autenticación válida (el cliente puede reintentar aportando credenciales); 403 indica que la identidad está verificada pero carece de privilegios suficientes (prohibido). |
| **`SecurityFilterChain` funcional frente a herencia clásica** | `WebSecurityConfigurerAdapter` fue eliminado en Spring Boot 3; la configuración moderna mediante `@Bean SecurityFilterChain` con lambdas ofrece mayor modularidad y desacoplamiento. |
| **`UserDetailsService` sobre entidad JPA** | Desacopla la lógica interna del modelo de datos de la aplicación del contrato técnico de seguridad requerido por el motor de autenticación de Spring. |
| **`@PreAuthorize` con `@EnableMethodSecurity`** | Permite aplicar autorización granular junto al método de negocio, accediendo a los parámetros del método (`#id`) y evaluando reglas de propiedad a nivel de fila (SpEL). |
| **API sin estado (`STATELESS`) con JWT** | Permite escalabilidad horizontal inmediata sin balanceo con sesiones pegajosas ni dependencias de clústeres de memoria compartida (Redis). |
| **No guardar datos confidenciales en el Payload del JWT** | El Payload de un JWT solo está codificado en Base64Url y no cifrado; cualquier intermediario puede leer su contenido, por lo que solo debe contener identidades y roles. |
| **Desactivación de CSRF solo en APIs con Bearer tokens** | Los tokens Bearer viajan en cabeceras añadidas manualmente por JavaScript y los navegadores nunca las envían de forma automática, haciendo el ataque CSRF técnicamente inviable. |
| **Orígenes explícitos en CORS al usar credenciales** | El estándar W3C prohíbe el uso de `allowedOrigins("*")` junto a credenciales para evitar que cualquier sitio web malicioso secuestre sesiones autenticadas de usuarios. |
| **Pruebas automáticas con `@WithMockUser`** | Garantiza que las restricciones de seguridad están blindadas por tests automatizados que se ejecutan en milisegundos en pipelines de integración continua sin depender de bases de datos. |

### Al terminar la unidad deberías poder responder

1. ¿Por qué el protocolo HTTP es formalmente un protocolo sin estado (*stateless*)?
2. ¿Cómo reconstruye el servidor la ilusión de continuidad mediante la cabecera `Set-Cookie` y el identificador `JSESSIONID`?
3. ¿Qué peligros de seguridad neutralizan las directivas `HttpOnly`, `Secure` y `SameSite` en una cookie?
4. ¿Cuál es la diferencia exacta entre autenticación (AuthN) y autorización (AuthZ)?
5. ¿En qué escenario exacto una API REST debe responder con código 401 y en cuál con 403?
6. ¿Qué es una Matriz de Control de Acceso (RBAC) y qué roles estructuran el gestor de proyectos?
7. ¿Por qué las contraseñas nunca deben guardarse mediante cifrado simétrico reversible (como AES)?
8. ¿Por qué un algoritmo de hash rápido como SHA-256 o MD5 se considera hoy una negligencia para contraseñas?
9. ¿Qué función cumple el *Salt* aleatorio en un hash de contraseñas y qué ataque previene?
10. ¿Qué representa el formato modular `$2a$12$...` en una cadena generada por BCrypt?
11. ¿Qué ocurre con todos los endpoints de una API inmediatamente después de añadir la dependencia de Spring Security?
12. ¿Cómo intercepta la `SecurityFilterChain` las peticiones HTTP antes de que alcancen a los controladores?
13. ¿Qué contrato funcional exige la interfaz `UserDetailsService` y qué objeto devuelve?
14. ¿Cómo permite la anotación `@AuthenticationPrincipal` inyectar al usuario activo en un controlador?
15. ¿Qué diferencia práctica existe entre comprobar `hasRole('ADMIN')` y `hasAuthority('ROLE_ADMIN')`?
16. ¿Qué ventaja ofrece la anotación `@PreAuthorize` frente a definir reglas de seguridad solo por rutas URL?
17. ¿Qué tres partes componen la estructura de un JSON Web Token (JWT) y qué garantiza su firma?
18. ¿Cuál es el compromiso (*trade-off*) más grave de usar JWTs puros sin estado respecto a la revocación de accesos?
19. ¿Por qué un ataque de falsificación de peticiones en sitios cruzados (CSRF) solo afecta a sistemas basados en cookies?
20. ¿Por qué el navegador bloquea una petición cross-origin si el backend tiene configurado `allowedOrigins("*")` y el cliente envía credenciales?

### El vocabulario de la unidad

| Concepto | Significa |
| :--- | :--- |
| **Stateless** | Característica de un protocolo o arquitectura donde el servidor no almacena ningún estado de sesión de los clientes entre peticiones consecutivas. |
| **HttpSession** | Mecanismo de los contenedores de servlets de Java para mantener atributos y contexto de un usuario en la memoria del servidor. |
| **HttpOnly** | Directiva de una cookie que prohíbe su acceso mediante código JavaScript (`document.cookie`), protegiéndola contra ataques XSS. |
| **SameSite** | Atributo de cookie que restringe su envío en peticiones originadas desde sitios web cruzados para neutralizar ataques CSRF. |
| **Autenticación (AuthN)** | Proceso de verificar la identidad declarada por un usuario o sistema mediante credenciales comprobables. |
| **Autorización (AuthZ)** | Proceso de determinar si una identidad autenticada dispone de los privilegios necesarios para ejecutar una acción sobre un recurso. |
| **401 Unauthorized** | Código de estado HTTP que indica que la petición carece de credenciales de autenticación válidas para el recurso solicitado. |
| **403 Forbidden** | Código de estado HTTP que indica que el servidor ha verificado la identidad del cliente pero este carece de permisos suficientes. |
| **RBAC** | *Role-Based Access Control*: modelo de seguridad donde los permisos se asignan a roles y los roles a usuarios. |
| **BCrypt** | Función hash criptográfica adaptativa unidireccional basada en el cifrado Blowfish, deliberadamente lenta para resistir fuerza bruta. |
| **Salt** | Secuencia aleatoria de bytes generada para cada usuario que se combina con su contraseña antes de computar el hash para evitar tablas precalculadas. |
| **SecurityFilterChain** | Cadena ordenada de filtros de Spring Security que intercepta e inspecciona cada petición HTTP entrante antes del controlador. |
| **UserDetailsService** | Interfaz central de Spring Security con el método `loadUserByUsername()` para recuperar credenciales y roles desde cualquier almacén de datos. |
| **@PreAuthorize** | Anotación de Spring Security que evalúa expresiones de seguridad (SpEL) antes de permitir la ejecución de un método en servicios o controladores. |
| **JWT** | *JSON Web Token*: estándar abierto (RFC 7519) que define un formato compacto y autónomo para transmitir información de forma segura mediante firmas criptográficas. |
| **Bearer Token** | Esquema de autenticación HTTP donde el portador del token demuestra su autorización simplemente presentándolo en la cabecera `Authorization`. |
| **CSRF** | *Cross-Site Request Forgery*: ataque que induce al navegador de una víctima autenticada a ejecutar acciones no deseadas en una aplicación web mediante cookies implícitas. |

### Comprobación final del producto de la unidad

<div class="checkpoint">
  <p class="checkpoint-label">Auditoría de seguridad backend · criterios de producción</p>
  <ul class="checklist">
    <li>Las contraseñas de los usuarios se almacenan exclusivamente con algoritmo BCrypt (factor de coste $\ge 12$) y jamás en texto plano.</li>
    <li>La identidad y los roles de los usuarios residen en tablas persistentes de PostgreSQL y se cargan mediante `UserDetailsService`.</li>
    <li>Las cuentas de usuario desactivadas (`activo = false`) son rechazadas automáticamente por `isEnabled()`.</li>
    <li>La arquitectura de autorización distingue de forma estricta entre códigos `401 Unauthorized` y `403 Forbidden`.</li>
    <li>Las rutas públicas de consulta y documentación (Swagger UI) están delimitadas sin exigir credenciales innecesarias.</li>
    <li>Las operaciones destructivas (creación, edición y borrado) están protegidas por roles con `@PreAuthorize` o matchers de `SecurityFilterChain`.</li>
    <li>La aplicación implementa una estrategia justificada de autenticación (sesión segura con cookies o tokens JWT sin estado).</li>
    <li>Si se utiliza JWT, el token viaja en la cabecera `Authorization: Bearer` y la política de sesión es `STATELESS`.</li>
    <li>La configuración de CORS está integrada formalmente en Spring Security y restringe los orígenes a clientes autorizados sin comodines universales (`*`).</li>
    <li>La seguridad está respaldada por una suite de pruebas automatizadas con `MockMvc` y `@WithMockUser` que pasa al 100 % en verde.</li>
  </ul>
</div>

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

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
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> añadir la dependencia cambia el flujo de cada petición y debe entenderse antes de personalizarse.</li>
    <li><strong>Construye:</strong> rutas públicas y protegidas comprobadas de forma explícita.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **leer la cadena de filtros y configurar una protección mínima sin depender de valores mágicos**.

### 2. El problema

Añadir la dependencia cambia el flujo de cada petición y debe entenderse antes de personalizarse.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido rutas públicas y protegidas comprobadas de forma explícita.</li>
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

## Sesión 56 · Usuarios en base de datos

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> los usuarios definidos en memoria no representan el ciclo de vida real de una aplicación.</li>
    <li><strong>Construye:</strong> autenticación contra usuarios persistidos y contraseñas hasheadas.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **cargar identidades y credenciales desde PostgreSQL**.

### 2. El problema

Los usuarios definidos en memoria no representan el ciclo de vida real de una aplicación.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido autenticación contra usuarios persistidos y contraseñas hasheadas.</li>
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

## Sesión 57 · Roles y permisos

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> un único rol ADMIN no expresa propiedad, pertenencia a proyecto ni acciones específicas.</li>
    <li><strong>Construye:</strong> reglas de acceso justificadas para usuario, responsable y administrador.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **convertir reglas del negocio en autorizaciones comprensibles y mantenibles**.

### 2. El problema

Un único rol ADMIN no expresa propiedad, pertenencia a proyecto ni acciones específicas.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido reglas de acceso justificadas para usuario, responsable y administrador.</li>
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

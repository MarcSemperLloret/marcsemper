---
title: "Peticiones, respuestas y clientes HTTP"
label: "UD2 · Comunicar"
section: "ud-02"
order: 2
lang: "es"
summary: "Comprender cómo transforma Spring una petición HTTP en datos Java, cómo construye la respuesta y cómo comprobar cada contrato sin una interfaz gráfica."
duration: "12 horas · 2 semanas · 6 sesiones"
modality: "Taller guiado · 80 % guía / 20 % autonomía"
deliverable: "Un backend en memoria acompañado de una colección ejecutable de Postman o Bruno."
date: "2026-08-31"
outcomes:
  - "Seguir una petición desde el cliente HTTP hasta el método del controller."
  - "Recibir JSON y transformarlo en objetos Java de forma controlada."
  - "Construir respuestas con cuerpo, cabeceras y códigos de estado adecuados."
  - "Separar DTO de entrada y salida del modelo interno."
  - "Guardar y repetir pruebas manuales con Postman o Bruno."
requirements:
  - "El proyecto de la UD1 funcionando."
  - "Postman o Bruno instalado."
  - "Un navegador con DevTools para comparar clientes."
priorKnowledge:
  - "Peticiones y respuestas HTTP."
  - "Controllers, rutas, objetos, listas y JSON."
---

<p class="lead">La aplicación sigue sin interfaz visual. Eso es intencionado: primero aprenderemos a observar su contrato HTTP directamente, sin que Angular o una página oculten qué se envía y qué se recibe.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje alto. Cada mecanismo se observa primero con una petición pequeña; la colección final debe poder ejecutar y documentar el flujo completo sin pasos improvisados.</p>
</div>

## Semana 3 · De HTTP a Java y de vuelta

## Sesión 7 · De HTTP a un método Java

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> las anotaciones parecen magia si no se relaciona cada valor Java con una parte concreta de la petición.</li>
    <li><strong>Construye:</strong> una petición trazada desde Postman o Bruno hasta el método que la atiende.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **seguir cómo Spring selecciona un controller y enlaza ruta, parámetros y cabeceras con sus argumentos**.

### 2. El problema

Las anotaciones parecen magia si no se relaciona cada valor Java con una parte concreta de la petición.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una petición trazada desde Postman o Bruno hasta el método que la atiende.</li>
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

## Sesión 8 · Cuerpo JSON y deserialización

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> crear recursos exige transformar datos externos en objetos Java sin asumir que su forma es correcta.</li>
    <li><strong>Construye:</strong> un endpoint que recibe JSON y permite observar el objeto resultante.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **recibir un cuerpo JSON mediante @RequestBody y detectar diferencias entre JSON válido, inválido e incompleto**.

### 2. El problema

Crear recursos exige transformar datos externos en objetos Java sin asumir que su forma es correcta.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un endpoint que recibe JSON y permite observar el objeto resultante.</li>
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

## Sesión 9 · Construir respuestas HTTP

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

## Semana 4 · Un contrato que se puede repetir

## Sesión 10 · DTO de entrada y salida

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> usar la misma clase para recibir, procesar y responder filtra detalles internos y permite campos que el cliente no debería controlar.</li>
    <li><strong>Construye:</strong> DTO diferentes para crear y consultar un usuario o proyecto.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **separar los datos que acepta el backend de los que decide devolver**.

### 2. El problema

Usar la misma clase para recibir, procesar y responder filtra detalles internos y permite campos que el cliente no debería controlar.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido DTO diferentes para crear y consultar un usuario o proyecto.</li>
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

## Sesión 11 · Probar con Postman o Bruno

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> hacer peticiones sueltas a mano no deja una evidencia repetible ni permite detectar fácilmente una regresión.</li>
    <li><strong>Construye:</strong> una colección con entornos, casos correctos y casos de error.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **organizar peticiones, variables y comprobaciones en una colección reproducible**.

### 2. El problema

Hacer peticiones sueltas a mano no deja una evidencia repetible ni permite detectar fácilmente una regresión.

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

Al terminar serás capaz de **integrar rutas, cuerpos JSON, DTO y respuestas HTTP en un backend pequeño**.

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
    <li>Construir respuestas con cuerpo, cabeceras y códigos de estado adecuados.</li>
    <li>Separar DTO de entrada y salida del modelo interno.</li>
    <li>Guardar y repetir pruebas manuales con Postman o Bruno.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.


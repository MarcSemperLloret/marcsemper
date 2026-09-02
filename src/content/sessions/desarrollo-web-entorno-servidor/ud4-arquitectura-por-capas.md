---
title: "Arquitectura por capas con Spring"
label: "UD4 · Arquitectar"
section: "ud-04"
order: 4
lang: "es"
summary: "Reorganizar un controller que ya hace demasiado en capas con responsabilidades claras, y comprobar por primera vez la lógica con tests automáticos."
duration: "12 horas · 2 semanas · 6 sesiones"
modality: "Refactorización guiada · 50 % guía / 50 % autonomía"
deliverable: "La aplicación reorganizada en controller, service y repository, con los primeros tests del service en verde."
date: "2026-09-02"
outcomes:
  - "Reconocer los síntomas de un controller que acumula responsabilidades."
  - "Separar controller, service y repository y justificar qué va en cada capa."
  - "Usar inyección de dependencias en lugar de construir colaboradores a mano."
  - "Situar las reglas de negocio en el service y protegerlas con tests."
  - "Escribir tests unitarios de un service con JUnit."
requirements:
  - "La API rediseñada de la UD3."
priorKnowledge:
  - "DTO, validación y errores centralizados."
  - "Interfaces y clases en Java."
---

<p class="lead">El código funciona y ya no se puede tocar sin miedo. Esta unidad no añade funcionalidad: la reorganiza, y por primera vez deja tests que avisan cuando algo se rompe.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio. La primera separación se hace en común; la refactorización final la dirige el alumnado con una lista de criterios.</p>
</div>

## Semana 8 · Cuando funcionar ya no es suficiente

## Sesión 22 · El controller monstruoso

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> un controller puede funcionar y a la vez convertir cada cambio en una regresión probable.</li>
    <li><strong>Construye:</strong> un mapa razonado de problemas sobre código existente.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **localizar lógica duplicada, responsabilidades mezcladas y puntos difíciles de probar**.

### 2. El problema

Un controller puede funcionar y a la vez convertir cada cambio en una regresión probable.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un mapa razonado de problemas sobre código existente.</li>
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

## Sesión 23 · Arquitectura por capas

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> sin límites claros la presentación conoce detalles de negocio y almacenamiento.</li>
    <li><strong>Construye:</strong> un flujo de dependencias con responsabilidades explícitas.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **asignar cada responsabilidad a controller, service y repository**.

### 2. El problema

Sin límites claros la presentación conoce detalles de negocio y almacenamiento.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un flujo de dependencias con responsabilidades explícitas.</li>
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

## Sesión 24 · Inyección de dependencias

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> crear colaboradores dentro de una clase acopla implementación, configuración y pruebas.</li>
    <li><strong>Construye:</strong> componentes conectados por constructor y gestionados por Spring.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **usar IoC, inyección por constructor y estereotipos de Spring sin ocultar las dependencias**.

### 2. El problema

Crear colaboradores dentro de una clase acopla implementación, configuración y pruebas.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido componentes conectados por constructor y gestionados por Spring.</li>
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

## Semana 9 · Reglas protegidas por pruebas

## Sesión 25 · Reglas de negocio en el service

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> repartir reglas entre controllers y repositories hace imposible saber dónde se decide el comportamiento.</li>
    <li><strong>Construye:</strong> casos de uso y reglas de negocio concentrados en servicios comprobables.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **distinguir coordinación de casos de uso, reglas de negocio y acceso a datos**.

### 2. El problema

Repartir reglas entre controllers y repositories hace imposible saber dónde se decide el comportamiento.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido casos de uso y reglas de negocio concentrados en servicios comprobables.</li>
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

## Sesión 26 · Primeros tests del service con JUnit

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> comprobar a mano en Postman cada regla después de cada cambio no es sostenible ni demuestra nada al día siguiente.</li>
    <li><strong>Construye:</strong> una clase de tests que cubre el camino correcto y al menos un caso de error de una regla del service.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **escribir tests unitarios que comprueban una regla de negocio sin arrancar el servidor**.

### 2. El problema

Comprobar a mano en Postman cada regla después de cada cambio no es sostenible ni demuestra nada al día siguiente.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una clase de tests que cubre el camino correcto y al menos un caso de error de una regla del service.</li>
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

## Sesión 27 · Refactorización completa

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una arquitectura solo se aprende cuando se aplica sobre suficiente código real.</li>
    <li><strong>Construye:</strong> la aplicación organizada en controller, service, repository, model y dto.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **transformar la aplicación conservando su comportamiento observable**.

### 2. El problema

Una arquitectura solo se aprende cuando se aplica sobre suficiente código real.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido la aplicación organizada en controller, service, repository, model y dto.</li>
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
    <li>Reconocer los síntomas de un controller que acumula responsabilidades.</li>
    <li>Separar controller, service y repository y justificar qué va en cada capa.</li>
    <li>Usar inyección de dependencias en lugar de construir colaboradores a mano.</li>
    <li>Situar las reglas de negocio en el service y protegerlas con tests.</li>
    <li>Escribir tests unitarios de un service con JUnit.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

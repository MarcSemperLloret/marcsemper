---
title: "Calidad, observabilidad y documentación"
label: "UD11 · Verificar"
section: "ud-11"
order: 11
lang: "es"
summary: "Consolidar en una estrategia lo que se ha ido probando desde la UD4, y dejar la aplicación observable, documentada y revisada por otros."
duration: "6 horas · 1 semana · 3 sesiones"
modality: "Taller de calidad · 30 % guía / 70 % autonomía"
deliverable: "Una estrategia de pruebas documentada, logs útiles y documentación técnica revisada por pares."
date: "2026-09-02"
outcomes:
  - "Explicar qué cubre y qué no cubre la suite de pruebas existente."
  - "Completar los casos límite que faltan y medir la cobertura con criterio."
  - "Dejar trazas útiles y depurar un fallo con ellas."
  - "Publicar documentación técnica y someterla a una revisión por pares."
requirements:
  - "La aplicación completa con sus tests de la UD4, la UD5 y la UD7."
priorKnowledge:
  - "JUnit, tests de repositorio y MockMvc."
  - "OpenAPI y diseño de API."
---

<p class="lead">Esta no es la unidad en la que aparecen los tests: es la unidad en la que se ordenan. Llevas probando desde la UD4, y ahora toca decidir qué falta, qué sobra y qué se documenta.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje bajo. Se audita la propia aplicación con una rúbrica y se corrige lo que la auditoría revele.</p>
</div>

## Semana 23 · Demostrar que funciona y contarlo

## Sesión 67 · Estrategia de pruebas y cobertura

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> tener tests no es tener una estrategia: se puede tener mucha cobertura de lo fácil y ninguna de lo que rompe.</li>
    <li><strong>Construye:</strong> un inventario de la suite existente y los casos límite que faltaban, ya implementados.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **inventariar lo que ya está probado, detectar los huecos y priorizar qué casos límite añadir**.

### 2. El problema

Tener tests no es tener una estrategia: se puede tener mucha cobertura de lo fácil y ninguna de lo que rompe.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un inventario de la suite existente y los casos límite que faltaban, ya implementados.</li>
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

## Sesión 68 · Logging y depuración

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> sin observabilidad un error de producción se convierte en una conjetura.</li>
    <li><strong>Construye:</strong> un incidente reproducido y explicado con logs y puntos de depuración.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **registrar contexto útil y seguir un fallo sin exponer secretos ni llenar el log de ruido**.

### 2. El problema

Sin observabilidad un error de producción se convierte en una conjetura.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un incidente reproducido y explicado con logs y puntos de depuración.</li>
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

## Sesión 69 · OpenAPI, documentación y code review

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> que todos los endpoints respondan no demuestra calidad ni facilita que otro equipo continúe.</li>
    <li><strong>Construye:</strong> una revisión priorizada y documentación sincronizada con el comportamiento real.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **auditar una aplicación funcional buscando problemas de arquitectura, seguridad y mantenibilidad**.

### 2. El problema

Que todos los endpoints respondan no demuestra calidad ni facilita que otro equipo continúe.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una revisión priorizada y documentación sincronizada con el comportamiento real.</li>
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
    <li>Explicar qué cubre y qué no cubre la suite de pruebas existente.</li>
    <li>Completar los casos límite que faltan y medir la cobertura con criterio.</li>
    <li>Dejar trazas útiles y depurar un fallo con ellas.</li>
    <li>Publicar documentación técnica y someterla a una revisión por pares.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

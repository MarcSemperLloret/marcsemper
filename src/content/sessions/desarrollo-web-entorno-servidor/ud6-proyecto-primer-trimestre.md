---
title: "Proyecto del primer trimestre"
label: "UD6 · Integrar"
section: "ud-06"
order: 6
lang: "es"
summary: "Integrar el primer trimestre en una aplicación con interfaz, capas, validación, sesiones, PostgreSQL y JPA a partir de requisitos."
duration: "6 horas · 1 semana · 3 sesiones"
modality: "Proyecto · requisitos y acompañamiento puntual"
deliverable: "Una aplicación Spring MVC completa, revisada y defendida."
date: "2026-08-31"
outcomes:
  - "Convertir requisitos en un plan de trabajo verificable."
  - "Integrar las piezas del trimestre sin un tutorial lineal."
  - "Revisar código propio y ajeno con criterios técnicos."
  - "Defender decisiones de arquitectura y modelo de datos."
requirements:
  - "Repositorio con el trabajo acumulado de las UD1–UD5."
  - "PostgreSQL operativo."
  - "Lista de criterios de aceptación del proyecto."
priorKnowledge:
  - "Spring MVC y Thymeleaf."
  - "Arquitectura por capas, validación y sesiones."
  - "JPA, relaciones y PostgreSQL."
---

<p class="lead">Desaparece buena parte del tutorial. La evidencia ya no es reproducir un ejemplo, sino construir una aplicación coherente desde requisitos y explicar por qué está diseñada así.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje bajo. El profesorado define el problema, los hitos y los criterios; cada equipo decide el diseño y la implementación.</p>
</div>

## Semana 13 · Integración y defensa

## Sesión 37 · Especificación y planificación

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> empezar a programar sin delimitar el producto crea trabajo invisible y decisiones contradictorias.</li>
    <li><strong>Construye:</strong> un backlog pequeño, ordenado y comprobable.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **descomponer requisitos en casos de uso, datos, rutas y criterios de aceptación**.

### 2. El problema

Empezar a programar sin delimitar el producto crea trabajo invisible y decisiones contradictorias.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un backlog pequeño, ordenado y comprobable.</li>
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

## Sesión 38 · Desarrollo del proyecto

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> integrar muchas piezas a la vez multiplica los fallos y dificulta localizar su causa.</li>
    <li><strong>Construye:</strong> una versión funcional que cubre los criterios imprescindibles.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **implementar el incremento prioritario y mantener la aplicación ejecutable**.

### 2. El problema

Integrar muchas piezas a la vez multiplica los fallos y dificulta localizar su causa.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una versión funcional que cubre los criterios imprescindibles.</li>
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

## Sesión 39 · Code review, corrección y defensa

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> entregar una aplicación que funciona no demuestra que se comprenda ni que sea mantenible.</li>
    <li><strong>Construye:</strong> una revisión trazable, una versión corregida y una defensa técnica breve.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **revisar, corregir y defender decisiones usando evidencias del código y de la aplicación**.

### 2. El problema

Entregar una aplicación que funciona no demuestra que se comprenda ni que sea mantenible.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una revisión trazable, una versión corregida y una defensa técnica breve.</li>
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
    <li>Convertir requisitos en un plan de trabajo verificable.</li>
    <li>Integrar las piezas del trimestre sin un tutorial lineal.</li>
    <li>Revisar código propio y ajeno con criterios técnicos.</li>
    <li>Defender decisiones de arquitectura y modelo de datos.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.


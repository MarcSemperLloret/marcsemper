---
title: "El primer cliente: Angular contra la API"
label: "UD8 · Conectar"
section: "ud-08"
order: 8
lang: "es"
summary: "Conectar por primera vez un cliente Angular con la API, todavía sin autenticación, para que CORS y el navegador se aprendan aislados y no mezclados con la seguridad."
duration: "6 horas · 1 semana · 3 sesiones"
modality: "Laboratorio de integración · 50 % guía / 50 % autonomía"
deliverable: "Una pantalla Angular que lista y crea recursos contra la API real, con CORS resuelto y documentado."
date: "2026-09-02"
outcomes:
  - "Consumir la API desde un cliente Angular con HttpClient."
  - "Explicar qué es CORS, por qué lo aplica el navegador y por qué Postman no lo sufre."
  - "Configurar CORS en el backend de forma explícita y acotada."
  - "Diagnosticar un fallo de integración sabiendo si el problema es del cliente, del servidor o del navegador."
requirements:
  - "La API de la UD7 en marcha."
  - "Un proyecto Angular mínimo: el del módulo de cliente, o uno de una sola pantalla creado en la primera sesión."
priorKnowledge:
  - "APIs REST, JSON y códigos de estado."
  - "TypeScript básico y componentes Angular."
---

<p class="lead">Es la primera vez que un navegador, y no Postman, llama a tu API. Se hace ahora y sin autenticación a propósito: cuando en la unidad siguiente aparezcan tokens y permisos, CORS ya no será una variable desconocida.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio. El cliente se reduce a una pantalla y se monta en la primera sesión: lo que se practica es la integración y el diagnóstico, no Angular.</p>
</div>

## Semana 17 · Del cliente HTTP al navegador

## Sesión 49 · Un cliente de verdad llama a tu API

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una API comprobada solo con Postman no ha demostrado todavía que un navegador pueda usarla.</li>
    <li><strong>Construye:</strong> una pantalla que lista recursos reales obtenidos de la API.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **consumir un endpoint desde Angular con HttpClient y observar la petición en el panel de red**.

### 2. El problema

Una API comprobada solo con Postman no ha demostrado todavía que un navegador pueda usarla.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una pantalla que lista recursos reales obtenidos de la API.</li>
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

## Sesión 50 · CORS: por qué el navegador bloquea lo que Postman no

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> la misma petición funciona en Postman y falla en el navegador, y el mensaje de error no menciona el backend.</li>
    <li><strong>Construye:</strong> una configuración de CORS explícita que permite el origen del cliente y solo ese.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **explicar la política de mismo origen, leer un error de CORS y configurarlo en el backend de forma acotada**.

### 2. El problema

La misma petición funciona en Postman y falla en el navegador, y el mensaje de error no menciona el backend.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una configuración de CORS explícita que permite el origen del cliente y solo ese.</li>
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

## Sesión 51 · Integración mínima verificada

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> cuando algo no funciona entre dos aplicaciones, el error puede estar en cualquiera de las dos o en medio.</li>
    <li><strong>Construye:</strong> un flujo de listar y crear funcionando, con una tabla de diagnóstico de tres fallos provocados.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **completar un flujo de lectura y escritura entre cliente y API y diagnosticar dónde falla cuando falla**.

### 2. El problema

Cuando algo no funciona entre dos aplicaciones, el error puede estar en cualquiera de las dos o en medio.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido un flujo de listar y crear funcionando, con una tabla de diagnóstico de tres fallos provocados.</li>
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
    <li>Consumir la API desde un cliente Angular con HttpClient.</li>
    <li>Explicar qué es CORS, por qué lo aplica el navegador y por qué Postman no lo sufre.</li>
    <li>Configurar CORS en el backend de forma explícita y acotada.</li>
    <li>Diagnosticar un fallo de integración sabiendo si el problema es del cliente, del servidor o del navegador.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

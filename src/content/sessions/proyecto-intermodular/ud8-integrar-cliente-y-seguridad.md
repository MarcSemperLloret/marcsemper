---
title: "Revisar el contrato e integrar el cliente"
label: "UD8 · Proyecto compartido"
section: "ud-08"
order: 8
lang: "es"
summary: "Revisar y publicar un contrato compatible; Integrar el cliente ya construido en Servidor, con resultados comprobados."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Revisar y publicar un contrato compatible; Integrar el cliente ya construido en Servidor, con resultados comprobados."
date: "2026-09-09"
outcomes: ["Revisar y publicar un contrato compatible con resultados comprobados.", "Integrar el cliente ya construido en Servidor con resultados comprobados."]
requirements: ["Repositorio del backend y, desde la sesión 18, cliente desarrollado en Servidor.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Circuito de revisión y despliegue del primer trimestre."]
---

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 17 · Revisar y publicar un contrato compatible

**Antes de empezar.** Ya has trabajado la evolución y el versionado de rutas en Servidor. Hoy comprobarás la compatibilidad del contrato antes de integrar un cliente.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 31–32 aporta pruebas HTTP, OpenAPI y versionado. Aquí comprobamos que la documentación publicada corresponde al código y que el consumidor conoce el cambio. La especificación tiene una implementación responsable en Servidor y una versión verificable en Intermodular.

Un cambio es **incompatible** si una petición que funcionaba deja de tener el comportamiento acordado: renombrar un campo o envolver una lista en una página puede afectar al cliente. Que el backend compile no comprueba por sí solo ese efecto.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Capturar el contrato real

Arranca el backend actual y abre Swagger. Ejecuta una lectura y una escritura con datos ficticios. Comprueba estado y cuerpo frente a la colección. Enlaza la especificación desde la descripción del contrato de la API; corrige cualquier descripción que prometa una ruta todavía inexistente.

#### Bloque B · Comparar con la versión anterior

Conserva una exportación de la colección del primer trimestre. Señala un cambio compatible y uno incompatible de vuestra evolución. Escribe qué petición lo detecta. No renombres un campo en producción para demostrar que se rompe: utiliza una rama o entorno de prueba.

#### Bloque C · Coordinar la transición

Aplica la estrategia implementada en Servidor 32: nueva ruta o compatibilidad temporal. Actualiza el consumidor después de que la API acepte su contrato. Mantén un caso que pruebe la ruta antigua durante el periodo acordado. Cambiar todas las URLs a la vez eliminaría esa evidencia.

#### Bloque D · Revisar una PR con el contrato delante

La persona revisora ejecuta la colección sobre la versión propuesta, comprueba un 400 y un 404 y localiza la prueba HTTP que protege cada caso. Si falta una aserción de implementación, la corrección corresponde al test compartido de Servidor; Intermodular verifica que ese test se ejecuta y bloquea la fusión cuando falla.

#### Bloque E · Identificar la versión publicable

Añade a las notas de versión cambios del contrato, consumidores comprobados, compatibilidad y pendientes. Registra SHA y ejecución CI. No declares compatible una versión que solo habéis probado con el consumidor nuevo.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** El contrato versionado está revisado con peticiones antiguas y nuevas. Las incompatibilidades y la transición están descritas y comprobadas antes de integrar el cliente.

## Sesión 18 · Integrar el cliente ya construido en Servidor

**Antes de empezar.** El cliente web de Servidor ya realiza peticiones al backend y maneja sus respuestas. Hoy integrarás y publicarás ambas piezas con sus versiones identificadas.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 33–34 explica fetch, CORS y las operaciones desde el navegador. Esa implementación se reutiliza aquí. Intermodular se ocupa de que el cliente se despliegue, apunte al entorno correcto y se pruebe contra una versión identificada del backend.

El portfolio puede enlazar a la aplicación; no necesita contener otra copia del CRUD. El cliente y el backend pueden tener repositorios distintos, pero forman el mismo producto. Si el cliente vive junto al backend, conservad esa estructura y configurad las rutas de los workflows sin mover archivos para este taller.

Una operación de red puede estar cargando, terminar correctamente o fallar; una lista vacía es un resultado correcto. La revisión debe comprobar estados observables, además del aspecto de la pantalla.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Localizar el cliente existente

Abre el cliente utilizado en Servidor 33–34 y ejecuta el comando de arranque de su README. Identifica el archivo que define la base URL y la función que realiza las peticiones. Si solo existe la página de diagnóstico, utiliza esa página como punto de partida y registra la limitación, sin crear una segunda implementación.

#### Bloque B · Preparar los entornos

Escribe las URL local y pública en la configuración prevista por vuestro cliente. Comprueba el origen completo del navegador, incluido esquema y puerto. Reutiliza la configuración CORS del backend de Servidor: actualiza sus orígenes, no añadas otra clase que se contradiga con la anterior.

#### Bloque C · Ejecutar un recorrido completo

Prepara un registro con nombre reconocible. Desde el cliente crea, consulta, modifica y borra ese registro; utiliza el id devuelto. Comprueba también entrada inválida y lista vacía. En Red observa el estado HTTP, el cuerpo y, al crear, Location. Si un paso falla, repítelo con la colección para separar contrato, configuración y presentación.

#### Bloque D · Llevar las dos piezas a revisión

Abre la PR con las URL de prueba y los SHA de cliente y backend. La persona revisora repite el recorrido y una navegación con teclado. Modificar también forma parte del CRUD mínimo; no queda como ampliación opcional. La evaluación de la implementación del servidor usa los criterios de Servidor.

#### Bloque E · Publicar y enlazar

Después de las comprobaciones, despliega por el circuito habitual y repite un recorrido breve contra la URL pública. Actualiza la ficha del portfolio para enlazar la aplicación y documenta qué dos versiones se probaron juntas. Conserva las evidencias en las comprobaciones de la sesión.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** Cliente y API funcionan juntos en el entorno publicado, con configuración y versiones identificadas. Has comprobado carga, resultado correcto y error, y puedes explicar las diferencias respecto a local.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

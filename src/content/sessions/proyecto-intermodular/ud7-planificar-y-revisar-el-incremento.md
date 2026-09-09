---
title: "Planificar y revisar el incremento"
label: "UD7 · Proyecto compartido"
section: "ud-07"
order: 7
lang: "es"
summary: "Planificar el incremento y sus dependencias y revisar y publicar un contrato compatible, sobre la misma versión del producto de Servidor."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Repositorio de GitHub, commit de cada sesión y enlaces a PR, CI y documentos comunes con Servidor."
date: "2026-09-09"
outcomes: ["Planificar el incremento y sus dependencias sobre una versión identificada del producto.", "Revisar y publicar un contrato compatible sobre una versión identificada del producto."]
requirements: ["Repositorio del backend de Servidor y cliente existente.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Circuito de revisión y despliegue del primer trimestre."]
---

**Cómo preparar los documentos.** Redacta las fichas, registros y memorias en Word, LibreOffice o un documento en línea. Conserva el original editable y usa «Exportar» o «Descargar como PDF» para guardarlo con el nombre y en la carpeta indicados. Cuando se pida ampliar un documento, modifica ese mismo original y sustituye su PDF por la versión actualizada. Comprueba que los enlaces del PDF se puedan abrir. La entrega sigue siendo el enlace al repositorio de GitHub y al commit de la sesión, con el código y los PDF correspondientes. El `README.md` es la portada técnica del repositorio y se edita como texto; las fichas y memorias se entregan en PDF.

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 15 · Planificar el incremento y sus dependencias

**Punto de partida compartido.** Semana lectiva 15: sitúa este taller después de las sesiones 29–30 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-15). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Comienza el segundo trimestre sobre la versión defendida en diciembre. Servidor 29–30 amplía consultas, DTO y paginación; Intermodular convierte esa evolución en trabajo coordinado y comprobable. Un **incremento** es una mejora utilizable del producto existente, no una nueva aplicación.

La ficha de evolución de Intermodular 13 contiene decisiones, pero todavía necesita un orden de ejecución. Si una interfaz espera una lista y ahora recibe una página con `content`, el cambio afecta a ambos lados. La issue debe describir quién consume el dato, qué cambia y cómo comprobaremos la transición.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Recuperar la versión de partida

Abre la release del primer trimestre, copia su SHA al registro de hoy y ejecuta uno de sus casos de aceptación. Comprueba qué diferencias ya han entrado en las sesiones 29–30 de Servidor. Conserva la release como referencia; trabaja en una rama nueva desde main actualizada.

#### Bloque B · Concretar el incremento

Abre `docs/evolucion.pdf`, elige la mejora priorizada y añade una tabla de comportamiento anterior, comportamiento previsto y consumidor afectado. Para una búsqueda paginada, escribe un ejemplo con más resultados que el tamaño de página y el orden esperado. Usa campos de vuestro modelo.

#### Bloque C · Dividir el trabajo sin duplicarlo

Crea o enlaza las issues de implementación que ya usáis en Servidor. Añade tareas de coordinación únicamente cuando aporten algo distinto: actualizar un consumidor, configurar una comprobación o preparar una release. En cada tarjeta indica dependencia, responsable y criterio de aceptación. No crees otra issue con el mismo cambio solo para que aparezca en dos asignaturas.

#### Bloque D · Revisar el orden

Una persona revisora recorre las dependencias y señala qué puede probarse hoy. Sitúa el cliente completo después de Servidor 33–34 y los permisos después de 35–40. Si una pieza no está lista, prepara datos y casos sobre la versión disponible sin desactivar validaciones para avanzar.

#### Bloque E · Cerrar la planificación verificable

Ejecuta la comprobación local correspondiente y abre la PR de documentación. En `docs/intermodular/sesion-15.pdf` enlaza incremento, issues y commit de partida. El resultado debe permitir elegir la siguiente tarea sin reconstruir la decisión hablando con el equipo.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 15.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-15.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-29.pdf` y `sesion-30.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio, commit y PR. Explica una dependencia técnica y otra de coordinación, usando ejemplos del tablero. La siguiente sesión revisará el contrato y el cambio de rutas trabajado en Servidor.

## Sesión 16 · Revisar y publicar un contrato compatible

**Punto de partida compartido.** Semana lectiva 16: sitúa este taller después de las sesiones 31–32 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-16). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 31–32 aporta pruebas HTTP, OpenAPI y versionado. Aquí comprobamos que la documentación publicada corresponde al código y que el consumidor conoce el cambio. La especificación tiene una implementación responsable en Servidor y una versión verificable en Intermodular.

Un cambio es **incompatible** si una petición que funcionaba deja de tener el comportamiento acordado: renombrar un campo o envolver una lista en una página puede afectar al cliente. Que el backend compile no comprueba por sí solo ese efecto.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Capturar el contrato real

Arranca el backend actual y abre Swagger. Ejecuta una lectura y una escritura con datos ficticios. Comprueba estado y cuerpo frente a la colección. Enlaza la especificación desde `docs/contrato.pdf`; corrige cualquier descripción que prometa una ruta todavía inexistente.

#### Bloque B · Comparar con la versión anterior

Conserva una exportación de la colección del primer trimestre. Señala un cambio compatible y uno incompatible de vuestra evolución. Escribe qué petición lo detecta. No renombres un campo en producción para demostrar que se rompe: utiliza una rama o entorno de prueba.

#### Bloque C · Coordinar la transición

Aplica la estrategia implementada en Servidor 32: nueva ruta o compatibilidad temporal. Actualiza el consumidor después de que la API acepte su contrato. Mantén un caso que pruebe la ruta antigua durante el periodo acordado. Cambiar todas las URLs a la vez eliminaría esa evidencia.

#### Bloque D · Revisar una PR con el contrato delante

La persona revisora ejecuta la colección sobre la versión propuesta, comprueba un 400 y un 404 y localiza la prueba HTTP que protege cada caso. Si falta una aserción de implementación, la corrección corresponde al test compartido de Servidor; Intermodular verifica que ese test se ejecuta y bloquea la fusión cuando falla.

#### Bloque E · Identificar la versión publicable

Añade a las notas de versión cambios del contrato, consumidores comprobados, compatibilidad y pendientes. Registra SHA y ejecución CI. No declares compatible una versión que solo habéis probado con el consumidor nuevo.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 16.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-16.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-31.pdf` y `sesion-32.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio, commit y enlaces a PR, contrato y ejecución. La semana próxima el cliente de Servidor utilizará este contrato; no se construirá otra API para él.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

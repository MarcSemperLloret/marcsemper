---
title: "Planificar y revisar el incremento"
label: "UD7 · Proyecto compartido"
section: "ud-07"
order: 7
lang: "es"
summary: "Planificar el incremento y sus dependencias; Revisar búsquedas y paginación, con resultados comprobados."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Planificar el incremento y sus dependencias; Revisar búsquedas y paginación, con resultados comprobados."
date: "2026-09-09"
outcomes: ["Planificar el incremento y sus dependencias con resultados comprobados.", "Revisar búsquedas y paginación con resultados comprobados."]
requirements: ["Repositorio del backend y, desde la sesión 18, cliente desarrollado en Servidor.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Flujo de revisión y despliegue del primer trimestre."]
---

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 15 · Planificar el incremento y sus dependencias

**Antes de empezar.** Retomas la versión del primer trimestre y la propuesta de evolución. Hoy organizarás el siguiente incremento; las nuevas consultas se implementarán después en Servidor.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Comienza el segundo trimestre sobre la versión defendida en diciembre. En las próximas sesiones, Servidor ampliará consultas, DTO y paginación; Intermodular convierte esa evolución en trabajo coordinado y comprobable. Un **incremento** es una mejora utilizable del producto existente, no una nueva aplicación.

La ficha de evolución de Intermodular 13 contiene decisiones, pero todavía necesita un orden de ejecución. Si una interfaz espera una lista y ahora recibe una página con `content`, el cambio afecta a ambos lados. La issue debe describir quién consume el dato, qué cambia y cómo comprobaremos la transición.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Recuperar la versión de partida

Abre la release del primer trimestre, copia su SHA al registro de hoy y ejecuta uno de sus casos de aceptación. Identifica qué comportamiento quieres mejorar y comprueba cómo responde la versión de partida. Conserva la release como referencia; trabaja en una rama nueva desde main actualizada.

#### Bloque B · Concretar el incremento

Abre la propuesta de evolución, elige la mejora priorizada y añade una tabla de comportamiento anterior, comportamiento previsto y consumidor afectado. Para una búsqueda paginada, escribe un ejemplo con más resultados que el tamaño de página y el orden esperado. Emplea campos del modelo propio.

#### Bloque C · Dividir el trabajo sin duplicarlo

Crea o enlaza las issues de implementación ya empleadas en Servidor. Añade tareas de coordinación únicamente cuando aporten algo distinto: actualizar un consumidor, configurar una comprobación o preparar una release. En cada tarjeta indica dependencia, responsable y criterio de aceptación. No crees otra issue con el mismo cambio solo para que aparezca en dos asignaturas.

#### Bloque D · Revisar el orden

Una persona revisora recorre las dependencias y señala qué puede probarse hoy. Sitúa el cliente completo después de Servidor 33–34 y los permisos después de 35–40. Si una pieza no está lista, prepara datos y casos sobre la versión disponible sin desactivar validaciones para avanzar.

#### Bloque E · Cerrar la planificación verificable

Ejecuta la comprobación local correspondiente y abre la PR de documentación. En las comprobaciones de la sesión enlaza incremento, issues y commit de partida. El resultado debe permitir elegir la siguiente tarea sin reconstruir la decisión hablando con el equipo.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** El incremento está dividido en tareas con responsables, dependencias y criterios de aceptación. Puedes elegir la siguiente tarea y justificar su orden.

## Sesión 16 · Revisar búsquedas y paginación

**Antes de empezar.** Ya has implementado búsquedas y paginación en Servidor. Hoy comprobarás sus límites y revisarás cómo se utilizan desde fuera del backend.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

En Servidor ya has trabajado búsquedas y paginación. Intermodular comprueba cómo se revisa ese cambio y si otra persona puede utilizarlo sin conocer su implementación. Una página de resultados necesita un orden estable y una interpretación clara de sus límites.

El resultado de una revisión debe relacionar necesidad, comportamiento observado y decisión. Comprobar solo que la respuesta es 200 no demuestra que el filtro seleccione bien ni que al cambiar de página no desaparezcan o se repitan elementos.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado</p>

#### Bloque A · Recuperar el cambio

Localiza las rutas de consulta trabajadas en Servidor y la versión que las contiene. Ejecuta una consulta sin filtro y otra con un filtro conocido. Compara la respuesta con la necesidad descrita en la issue y señala los parámetros disponibles.

#### Bloque B · Preparar datos reconocibles

Crea suficientes datos ficticios para obtener al menos tres páginas. Incluye valores repetidos en el campo principal de ordenación y un criterio que no tenga coincidencias. Anota qué elementos esperas en cada consulta antes de ejecutarla.

#### Bloque C · Comprobar los límites

Ejecuta primera página, última página, página sin resultados y tamaño no válido. Compara resultados, orden y respuesta de error. Repite la misma consulta y verifica que su orden sea estable. Si un caso falla, describe entrada, resultado real y resultado esperado en una issue.

#### Bloque D · Revisar la comprensión del contrato

Intercambia la colección con tu pareja. Pídele que localice un dato mediante filtro y explique cómo obtiene la página siguiente. Revisa qué información de la respuesta necesita un futuro cliente para mostrar resultados y navegación.

#### Bloque E · Cerrar la revisión

Corrige las instrucciones o ejemplos ambiguos, revisa los cambios por PR y comprueba el resultado de CI. Conserva las rutas actuales: la transición a rutas versionadas se trabajará después en Servidor y se revisará en el siguiente taller.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** las búsquedas y la paginación tienen casos de prueba reproducibles, los límites están comprobados y los defectos encontrados están descritos con precisión. Debes poder explicar qué necesita saber quien consuma esas consultas.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

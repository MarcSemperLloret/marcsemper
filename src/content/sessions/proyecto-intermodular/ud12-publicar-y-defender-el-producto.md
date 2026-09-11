---
title: "Recuperar, publicar y defender el producto"
label: "UD12 · Proyecto compartido"
section: "ud-12"
order: 12
lang: "es"
summary: "Ensayar la recuperación y publicar el incremento; Defender el producto y el proceso sobre la misma versión, con resultados comprobados."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Ensayar la recuperación y publicar el incremento; Defender el producto y el proceso sobre la misma versión, con resultados comprobados."
date: "2026-09-09"
outcomes: ["Ensayar la recuperación y publicar el incremento con resultados comprobados.", "Defender el producto y el proceso sobre la misma versión con resultados comprobados."]
requirements: ["Repositorio del backend y, desde la sesión 18, cliente desarrollado en Servidor.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Flujo de revisión y despliegue del primer trimestre."]
---

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 25 · Ensayar la recuperación y publicar el incremento

**Antes de empezar.** La candidata tiene su calidad revisada y el producto sigue evolucionando. Hoy ensayarás su recuperación y comprobarás la publicación antes de preparar la defensa.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

La candidata del producto ya tiene pruebas y documentación revisadas. Publicarla exige comprobar también qué ocurrirá si algo falla: recuperar el código no garantiza recuperar los datos. Un procedimiento de recuperación debe indicar qué versión y qué copia de datos utiliza.

El ensayo se realiza primero en un entorno de pruebas. Comprobarás restauración, publicación y recorridos esenciales antes de actualizar la versión pública. La presentación del producto debe reflejar el estado realmente comprobado.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado</p>

#### Bloque A · Identificar la candidata · 20 min

Revisa versión, configuración, pruebas y problemas pendientes. Ejecuta un recorrido de lectura y otro de escritura. Si un defecto impide continuar, identifícalo antes de publicar y trabaja el ensayo en el entorno de pruebas.

#### Bloque B · Comprobar la recuperación · 40 min

Utiliza el procedimiento de copia de seguridad disponible para PostgreSQL. Haz una copia de la base de ensayo, añade un dato ficticio y restaura la copia en otra base de ensayo. Conecta la aplicación a esa base y comprueba un dato que existía antes de la copia. Explica por qué el dato posterior no aparece. No ensayes sobre los datos públicos.

#### Bloque C · Publicar y comprobar · 35 min

Revisa configuración y compatibilidad del esquema. Publica mediante el workflow existente y compara el commit del artefacto con el de la candidata. Ejecuta los recorridos de lectura, escritura y permisos en la URL publicada; un pipeline verde no sustituye estas comprobaciones.

#### Bloque D · Contrastar el plan de recuperación · 25 min

En el entorno de ensayo vuelve a la versión anterior compatible y repite el recorrido básico. Distingue qué resuelve volver al código anterior y cuándo necesitas restaurar datos. Anota los pasos comprobados y cualquier limitación; conserva intacta la versión pública mientras ensayas.

#### Bloque E · Actualizar la presentación · 20 min

Actualiza el caso de portfolio con el problema resuelto, una decisión técnica, el proceso de revisión y un resultado verificable. Contrasta sus afirmaciones con la versión publicada y prepara el recorrido que utilizarás para explicar el producto y tu aportación.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** has ensayado la restauración de datos y la vuelta a una versión compatible, conoces el estado real de la publicación y tienes preparada una explicación del producto basada en resultados comprobados.

## Sesión 26 · Defender el producto y el proceso sobre la misma versión

**Antes de empezar.** Dispones de la versión integrada y publicada del producto y de los resultados del ensayo de recuperación. Hoy explicarás el proceso y tu aportación sobre esa versión; la parte técnica se completa en las sesiones finales de Servidor.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

El cierre parte de la versión integrada hasta Servidor 49–50, que se utilizará también en las sesiones técnicas finales 51–52. La demostración del producto se hace una vez y se acompaña de dos lecturas: cómo funciona la implementación y cómo se ha construido, revisado, comprobado y publicado.

Las calificaciones conservan los criterios de cada módulo. Una PR demuestra trazabilidad; el código y su prueba muestran si la regla es correcta. El mismo enlace puede aportar evidencias a ambos sin convertirse en dos informes idénticos. La nota no se calcula sumando commits ni exigiendo que el CI falle muchas veces.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Fijar la versión de evaluación

Abre el balance final del proyecto y contrasta SHA, release y URL con la versión comprobada hasta la sesión 50 de Servidor. Si hubo una corrección, enlaza su nueva ejecución y repite los casos afectados. Cada integrante identifica su aportación dentro de la autoría/equipo acordado durante el curso.

#### Bloque B · Preparar un guion con evidencias

Elige un recorrido que muestre una regla del producto y un rechazo previsto. Localiza su implementación y test para Servidor. A continuación enlaza issue, PR revisada, CI y despliegue para Intermodular. Añade una decisión de recuperación y una limitación real. Todo debe poder abrirse desde el documento común.

#### Bloque C · Ensayar por parejas

Una persona sigue el recorrido y otra solicita la justificación de dos decisiones. A continuación se invierten los papeles. Registra dónde falta un dato, un permiso de acceso al repositorio o una instrucción del README. Corrige los documentos mediante pull request y vuelve a ejecutar cualquier comprobación afectada.

#### Bloque D · Realizar la defensa coordinada

Quien no está defendiendo realiza la verificación cruzada y registra observaciones concretas. Si la versión pública no está disponible, muestra el registro del fallo y la ejecución local reproducible, diferenciando lo demostrado de lo pendiente.

#### Bloque E · Cerrar y conservar

Actualiza el documento con el resultado de aceptación y pendientes. Revisa qué recursos de demostración seguirán activos y sus límites, sin borrar datos o releases necesarios para evaluar. Conserva el repositorio y la documentación; una copia única permite reproducir el producto después del curso.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** La demostración relaciona necesidad, versión del producto, revisión, CI y publicación. Puedes explicar tu aportación, los resultados comprobados y las limitaciones, utilizando el mismo producto que en Servidor.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

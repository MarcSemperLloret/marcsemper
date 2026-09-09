---
title: "Publicar y defender el producto"
label: "UD12 · Proyecto compartido"
section: "ud-12"
order: 12
lang: "es"
summary: "Publicar el incremento y preparar el caso de portfolio y defender el producto y el proceso sobre la misma versión, sobre la misma versión del producto de Servidor."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Repositorio de GitHub, commit de cada sesión y enlaces a PR, CI y documentos comunes con Servidor."
date: "2026-09-09"
outcomes: ["Publicar el incremento y preparar el caso de portfolio sobre una versión identificada del producto.", "Defender el producto y el proceso sobre la misma versión sobre una versión identificada del producto."]
requirements: ["Repositorio del backend de Servidor y cliente existente.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Circuito de revisión y despliegue del primer trimestre."]
---

**Cómo preparar los documentos.** Redacta las fichas, registros y memorias en Word, LibreOffice o un documento en línea. Conserva el original editable y usa «Exportar» o «Descargar como PDF» para guardarlo con el nombre y en la carpeta indicados. Cuando se pida ampliar un documento, modifica ese mismo original y sustituye su PDF por la versión actualizada. Comprueba que los enlaces del PDF se puedan abrir. La entrega sigue siendo el enlace al repositorio de GitHub y al commit de la sesión, con el código y los PDF correspondientes. El `README.md` es la portada técnica del repositorio y se edita como texto; las fichas y memorias se entregan en PDF.

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 25 · Publicar el incremento y preparar el caso de portfolio

**Punto de partida compartido.** Semana lectiva 25: sitúa este taller después de las sesiones 49–50 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-25). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 49–50 completa las reglas del incremento y su integración con el cliente. Intermodular publica la combinación revisada y explica el producto con evidencias. El caso de portfolio resume el trabajo real; no introduce otra aplicación ni repite toda la memoria técnica.

Una entrega identifica qué versiones se probaron juntas. Si cliente y backend tienen repositorios distintos, sus etiquetas pueden diferir: lo importante es registrar la pareja de SHA y la configuración utilizada, no que ambos números coincidan.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Comprobar el incremento

Abre los criterios de Intermodular 15 y ejecuta el recorrido integrado de Servidor 50. Comprueba regla de negocio, permisos, error visible y recuperación del cliente. Reutiliza la colección y los tests existentes; elige datos ficticios que permitan repetir el caso.

#### Bloque B · Revisar y publicar

Confirma revisión de PR, CI del commit y procedimiento de actualización de la sesión 24. Publica por el workflow habitual y registra el artefacto o ejecución que identifica el SHA desplegado. Si falla la comprobación posterior, aplica el procedimiento previsto y registra el resultado; no declares la release aceptada solo porque el despliegue esté verde.

#### Bloque C · Comprobar después del despliegue

Desde la URL pública inicia sesión, realiza una operación permitida y comprueba una denegada. Verifica persistencia, integración externa y adjuntos si forman parte del alcance. Relaciona el resultado con las versiones desplegadas y evita publicar credenciales en capturas.

#### Bloque D · Escribir el caso de portfolio

Actualiza la ficha existente con problema, usuarios, aportación propia, una decisión razonada, resultado y limitación. Enlaza repositorio, aplicación y documento técnico común. Utiliza una captura de datos ficticios y describe hechos comprobados; no inventes usuarios reales, métricas ni mejoras de rendimiento.

#### Bloque E · Preparar la defensa común

En `docs/entrega-final.pdf` reúne SHA, URL, PR representativa, ejecución CI, pruebas de aceptación y límites. Enlaza las evidencias de Servidor en lugar de copiarlas. El guion diferencia explicación de implementación y explicación del proceso, sobre el mismo recorrido del producto.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 25.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-25.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-49.pdf` y `sesion-50.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio y commit. La versión queda publicada con su estado real; Servidor 51–52 completará aceptación y defensa antes del cierre conjunto de Intermodular 26.

## Sesión 26 · Defender el producto y el proceso sobre la misma versión

**Punto de partida compartido.** Semana lectiva 26: sitúa este taller después de las sesiones 51–52 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-26). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

El cierre utiliza la misma versión que Servidor 51–52. La demostración del producto se hace una vez y se acompaña de dos lecturas: cómo funciona la implementación y cómo se ha construido, revisado, comprobado y publicado.

Las calificaciones conservan los criterios de cada módulo. Una PR demuestra trazabilidad; el código y su prueba muestran si la regla es correcta. El mismo enlace puede aportar evidencias a ambos sin convertirse en dos informes idénticos. La nota no se calcula sumando commits ni exigiendo que el CI falle muchas veces.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Fijar la versión de evaluación

Abre `docs/entrega-final.pdf` y contrasta SHA, release y URL con la versión aceptada en Servidor. Si hubo una corrección, enlaza su nueva ejecución y repite los casos afectados. Cada integrante identifica su aportación dentro de la autoría/equipo acordado durante el curso.

#### Bloque B · Preparar un guion con evidencias

Elige un recorrido que muestre una regla del producto y un rechazo previsto. Localiza su implementación y test para Servidor. A continuación enlaza issue, PR revisada, CI y despliegue para Intermodular. Añade una decisión de recuperación y una limitación real. Todo debe poder abrirse desde el documento común.

#### Bloque C · Ensayar por parejas

Una persona sigue el recorrido y otra pide justificar dos decisiones. Cambiad los papeles. Registrad dónde falta un dato, un permiso de acceso al repositorio o una instrucción del README. Corrigid los documentos mediante PR y ejecutad de nuevo cualquier comprobación afectada.

#### Bloque D · Realizar la defensa coordinada

El docente distribuye los turnos entre las sesiones finales de ambos módulos para que quepan en su tiempo; no se repite la demostración completa en dos asignaturas. Quien no está defendiendo realiza la verificación cruzada y registra observaciones concretas. Si la versión pública no está disponible, muestra el registro del fallo y la ejecución local reproducible, diferenciando lo demostrado de lo pendiente.

#### Bloque E · Cerrar y conservar

Actualiza el documento con el resultado de aceptación y pendientes. Revisa qué recursos de demostración seguirán activos y sus límites, sin borrar datos o releases necesarios para evaluar. Conserva el repositorio y la documentación; una copia única permite reproducir el producto después del curso.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 26.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-26.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-51.pdf` y `sesion-52.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega el repositorio de backend compartido, su commit final y los enlaces al cliente, release y evidencias. Los criterios de Servidor valoran la implementación; los de Intermodular, la coordinación y entrega verificable. La defensa y el producto son comunes.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

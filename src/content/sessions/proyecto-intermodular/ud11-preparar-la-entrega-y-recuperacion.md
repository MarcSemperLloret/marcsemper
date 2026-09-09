---
title: "Preparar la entrega y recuperación"
label: "UD11 · Proyecto compartido"
section: "ud-11"
order: 11
lang: "es"
summary: "Cerrar una candidata con evidencias de calidad y preparar la actualización y su recuperación, sobre la misma versión del producto de Servidor."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Repositorio de GitHub, commit de cada sesión y enlaces a PR, CI y documentos comunes con Servidor."
date: "2026-09-09"
outcomes: ["Cerrar una candidata con evidencias de calidad sobre una versión identificada del producto.", "Preparar la actualización y su recuperación sobre una versión identificada del producto."]
requirements: ["Repositorio del backend de Servidor y cliente existente.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Circuito de revisión y despliegue del primer trimestre."]
---

**Cómo preparar los documentos.** Redacta las fichas, registros y memorias en Word, LibreOffice o un documento en línea. Conserva el original editable y usa «Exportar» o «Descargar como PDF» para guardarlo con el nombre y en la carpeta indicados. Cuando se pida ampliar un documento, modifica ese mismo original y sustituye su PDF por la versión actualizada. Comprueba que los enlaces del PDF se puedan abrir. La entrega sigue siendo el enlace al repositorio de GitHub y al commit de la sesión, con el código y los PDF correspondientes. El `README.md` es la portada técnica del repositorio y se edita como texto; las fichas y memorias se entregan en PDF.

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 23 · Cerrar una candidata con evidencias de calidad

**Punto de partida compartido.** Semana lectiva 23: sitúa este taller después de las sesiones 45–46 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-23). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 45–46 revisa pruebas, documentación y observabilidad. Intermodular utiliza esos resultados para decidir si una versión candidata puede avanzar. Una **release candidate** es una versión identificada que se somete a aceptación; no significa que ya haya superado todos los criterios.

Cobertura indica qué código se ejecutó, no si las aserciones son suficientes. Un check verde tampoco demuestra que el README permita arrancar el proyecto. La aceptación combina pruebas automáticas y un recorrido reproducible por otra persona.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Identificar la candidata

Elige un commit con CI correcto y registra su SHA. Revisa el incremento acordado en Intermodular 15 y marca qué criterios están implementados, comprobados o pendientes. Una limitación se describe con su efecto observable; no se oculta bajo «falta pulir».

#### Bloque B · Revisar pruebas y documentación

Abre el informe de pruebas de Servidor 45 y la documentación de 46. Selecciona una regla de negocio, un rechazo por permisos y un fallo de integración. Localiza la prueba de cada uno y confirma que aparece en la ejecución de esa candidata. Enlaza los informes existentes sin duplicarlos.

#### Bloque C · Ejecutar desde un clon limpio

La persona revisora clona en otra carpeta, sigue el README y prepara la base de pruebas aislada. Debe poder ejecutar verify y arrancar con valores locales. Una instrucción verbal que necesite para continuar se convierte en corrección del README.

#### Bloque D · Clasificar y corregir defectos

Abre issues con entrada, pasos, resultado esperado, resultado real y versión. Prioriza los que impiden los criterios de aceptación. Cada corrección entra por PR con su comprobación; vuelve a ejecutar el caso y la suite pertinente. No añadas nuevas funcionalidades para evitar cerrar un defecto.

#### Bloque E · Publicar el estado de la candidata

Actualiza sus notas con criterios superados y pendientes. Si el código cambia, registra el nuevo SHA y su ejecución; una evidencia del commit anterior no valida automáticamente el nuevo. Guarda el resultado en `docs/intermodular/sesion-23.pdf`.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 23.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-23.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-45.pdf` y `sesion-46.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio y commit. Explica por qué una candidata puede avanzar o qué defecto concreto lo impide. Servidor conserva la evaluación de las pruebas; aquí se evalúa cómo sustentan la decisión de entrega.

## Sesión 24 · Preparar la actualización y su recuperación

**Punto de partida compartido.** Semana lectiva 24: sitúa este taller después de las sesiones 47–48 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-24). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 47–48 revisa el alcance final y la evolución del modelo. Intermodular prepara cómo desplegar esos cambios sobre el producto que ya tiene datos. No volvemos a crear la infraestructura del primer trimestre.

Un cambio de esquema y un cambio de código deben ser compatibles en el orden en que se aplican. Volver a un JAR anterior no deshace una modificación de datos. Antes de desplegar debemos conocer el punto de partida, el cambio previsto y cómo recuperar un entorno de prueba.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Comparar versiones

Compara la versión desplegada con los cambios de Servidor 47–48. Anota qué afecta al esquema, las variables, las rutas y los datos existentes. Reutiliza el modelo y las decisiones de Servidor; aquí documentas su aplicación al entorno.

#### Bloque B · Preparar el procedimiento

En `docs/despliegue.pdf` escribe comprobación previa, copia de seguridad, cambio de esquema, publicación del artefacto y prueba posterior. Identifica quién ejecuta cada acción y dónde se registra. No uses create-drop ni scripts de creación completa sobre una base que contiene datos a conservar.

#### Bloque C · Ensayar con datos ficticios

Prepara una base aislada con la versión anterior y algunos registros. Obtén una copia con la herramienta documentada del proveedor o PostgreSQL, restaúrala en otra base de ensayo y comprueba su lectura. Registra comandos sin contraseñas y cuenta filas relevantes antes y después.

#### Bloque D · Probar actualización y recuperación

Aplica en el ensayo el cambio revisado de esquema y arranca la candidata. Ejecuta los casos acordados. Si falla, utiliza el procedimiento de recuperación sobre ese entorno aislado y comprueba que los datos vuelven a ser legibles. Describe cuándo basta revertir código y cuándo hay que recuperar datos.

#### Bloque E · Revisar el procedimiento

Otra persona sigue el documento sin instrucciones verbales y marca el punto de decisión para continuar o detenerse. Enlaza evidencias y pendientes. Esta sesión prepara la actualización; el cierre final se coordina con las funcionalidades de Servidor 49–52.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 24.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-24.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-47.pdf` y `sesion-48.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio y commit con el procedimiento ensayado. Explica qué protege los datos y qué evidencia tienes de que la recuperación funciona.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

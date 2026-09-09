---
title: "Priorizar la evolución del producto"
label: "UD5 · Evolucionar"
section: "ud-05"
order: 5
lang: "es"
summary: "Priorizar una mejora del mismo producto a partir de necesidades observadas, sin cambiar de tema ni de repositorio."
duration: "3 horas · 1 sesión"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Repositorio de GitHub, commit de cada sesión y enlaces a PR, CI y documentos comunes con Servidor."
date: "2026-09-09"
outcomes: ["Identificar mejoras observables del producto existente.", "Priorizar un incremento y sus dependencias con Servidor.", "Reutilizar las evidencias del primer trimestre para planificar el segundo."]
requirements: ["Versión del backend persistente y publicado.", "Tablero e incidencias del mismo producto."]
priorKnowledge:
  - "Lo que cuesta llevar dos piezas a producción, aprendido a base de hacerlo."
---

**Cómo preparar los documentos.** Redacta las fichas, registros y memorias en Word, LibreOffice o un documento en línea. Conserva el original editable y usa «Exportar» o «Descargar como PDF» para guardarlo con el nombre y en la carpeta indicados. Cuando se pida ampliar un documento, modifica ese mismo original y sustituye su PDF por la versión actualizada. Comprueba que los enlaces del PDF se puedan abrir. La entrega sigue siendo el enlace al repositorio de GitHub y al commit de la sesión, con el código y los PDF correspondientes. El `README.md` es la portada técnica del repositorio y se edita como texto; las fichas y memorias se entregan en PDF.

La versión del primer trimestre continúa durante el segundo. Esta unidad prioriza su evolución a partir de necesidades observadas. Consulta la [secuencia conjunta](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 13 · Priorizar la evolución del mismo producto

**Punto de partida compartido.** Semana lectiva 13: sitúa este taller después de las sesiones 25–26 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-13). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

El producto de septiembre continúa en el segundo trimestre. Ya tiene CRUD, relaciones y persistencia; ahora debe evolucionar según necesidades concretas. La sesión no consiste en buscar otro tema ni en volver a justificar desde cero el elegido.

Una **mejora** describe un problema observado y el resultado que permitiría resolverlo. «Añadir JWT» es una solución técnica; «cada persona solo modifica sus reservas» expresa la necesidad que después guiará identidad y permisos.

Reutilizaremos las incidencias, decisiones y comentarios reunidos durante el trimestre. Compararemos valor, esfuerzo y dependencias para elegir un incremento viable. La autenticación se implementará cuando llegue la UD9 de Servidor; hoy se puede describir quién necesita hacer qué sin saber aún configurar Spring Security.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Observar el producto actual

Abre la versión persistente publicada y pide a otra persona que realice un recorrido del contrato. Anota dónde duda, qué dato necesita y qué acción no puede completar. Distingue un fallo reproducible de una petición de mejora. Guarda los hallazgos en el tablero actual, indicando la versión observada.

#### Bloque B · Proponer tres mejoras del mismo dominio

En `docs/evolucion.pdf` escribe tres candidatas con necesidad, persona afectada, comportamiento actual y criterio de aceptación. Ejemplo: en préstamos, impedir que un socio cierre el préstamo de otro. Conserva las entidades del producto y señala qué relación o regla cambia; no añadas tablas únicamente para aumentar el número.

#### Bloque C · Ordenar por dependencias

Para cada candidata anota qué requiere de Servidor: filtros/paginación (29–30), cliente (33–34), identidad/permisos (35–40), integración externa (41–44). Marca una mejora principal y deja las demás en backlog. Divide la principal en cambios revisables: contrato, implementación, prueba y despliegue. El trabajo de implementación enlaza con las issues de Servidor.

#### Bloque D · Contrastar y decidir

La persona revisora intenta reproducir la necesidad y comprobar el criterio sin conocer la solución. Si el criterio dice «mejorar», concreta un resultado observable. Actualiza la ficha con la decisión y lo que queda fuera. No cambies de repositorio ni de autoría/equipo respecto a Servidor.

#### Bloque E · Preparar el cierre común

Enlaza `docs/evolucion.pdf` desde el registro de la sesión y desde la release candidata del primer trimestre. Comprueba que los defectos que impiden la entrega siguen siendo prioritarios frente a las mejoras futuras. Prepara los enlaces a producto, PR, CI y versión para la defensa conjunta de la próxima semana.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 13.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-13.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-25.pdf` y `sesion-26.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega el mismo repositorio y el commit de esta sesión. Debes poder explicar qué necesidad mejora vuestro producto, qué conserva y qué sesión de Servidor desbloquea su implementación.

## Lo que debes recordar

El dominio y el repositorio se mantienen. Una mejora tiene necesidad, criterio de aceptación y dependencia técnica; se prioriza después de cerrar los defectos que impiden la entrega actual.

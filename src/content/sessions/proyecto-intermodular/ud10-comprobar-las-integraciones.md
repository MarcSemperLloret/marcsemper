---
title: "Comprobar las integraciones"
label: "UD10 · Proyecto compartido"
section: "ud-10"
order: 10
lang: "es"
summary: "Comprobar una dependencia externa y su degradación y verificar archivos y efectos externos, sobre la misma versión del producto de Servidor."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Repositorio de GitHub, commit de cada sesión y enlaces a PR, CI y documentos comunes con Servidor."
date: "2026-09-09"
outcomes: ["Comprobar una dependencia externa y su degradación sobre una versión identificada del producto.", "Verificar archivos y efectos externos sobre una versión identificada del producto."]
requirements: ["Repositorio del backend de Servidor y cliente existente.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Circuito de revisión y despliegue del primer trimestre."]
---

**Cómo preparar los documentos.** Redacta las fichas, registros y memorias en Word, LibreOffice o un documento en línea. Conserva el original editable y usa «Exportar» o «Descargar como PDF» para guardarlo con el nombre y en la carpeta indicados. Cuando se pida ampliar un documento, modifica ese mismo original y sustituye su PDF por la versión actualizada. Comprueba que los enlaces del PDF se puedan abrir. La entrega sigue siendo el enlace al repositorio de GitHub y al commit de la sesión, con el código y los PDF correspondientes. El `README.md` es la portada técnica del repositorio y se edita como texto; las fichas y memorias se entregan en PDF.

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 21 · Comprobar una dependencia externa y su degradación

**Punto de partida compartido.** Semana lectiva 21: sitúa este taller después de las sesiones 41–42 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-21). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 41–42 aporta un cliente HTTP externo, adaptación de datos, timeouts y caché. Aquí planificamos y comprobamos qué ocurre cuando esa dependencia falla durante el uso del producto. No implementaremos otro adaptador.

Una respuesta degradada es una respuesta prevista con información parcial. Debe permitir distinguir «no hay dato» de un valor real. Por ejemplo, no conocer la temperatura no equivale a cero grados. El criterio de aceptación debe describir ese resultado, además del caso en que el proveedor responde.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Describir la dependencia

En `docs/integraciones.pdf` registra proveedor, dato utilizado, función del producto y si ese dato es imprescindible o complementario. Enlaza el adaptador de Servidor. Anota configuración y límites utilizados, sin copiar respuestas externas completas ni datos personales.

#### Bloque B · Preparar los escenarios

Reutiliza el proveedor simulado y los casos de Servidor 42: respuesta correcta, timeout y respuesta no utilizable. Comprueba que el procedimiento no necesita desconectar toda la red. Antes de cada escenario controla la caché para no confundir un resultado guardado con una consulta nueva.

#### Bloque C · Ejecutar y observar

Para cada caso registra tiempo total, estado de la API, aviso mostrado y conservación del resto de funciones. Distingue timeout configurado de latencia total. Si el dato es opcional, comprueba la degradación prevista; si es obligatorio, comprueba el error acordado por el contrato.

#### Bloque D · Llevarlo al pipeline

Localiza los tests de adaptador y resiliencia existentes y confirma que CI los ejecuta sin depender del proveedor real. No conviertas cada PR en una consulta a un servicio de terceros. La comprobación pública breve se registra aparte y con datos ficticios.

#### Bloque E · Revisar y documentar

La persona revisora reproduce un fallo controlado y comprueba el resultado de usuario. Enlaza configuración, test y PR en el registro de la sesión. Si cambia el criterio, actualiza el contrato y su prueba en la misma propuesta.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 21.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-21.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-41.pdf` y `sesion-42.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio y commit. Explica cómo sabes que ha funcionado la degradación y cómo has evitado que la caché oculte el fallo que querías comprobar.

## Sesión 22 · Verificar archivos y efectos externos

**Punto de partida compartido.** Semana lectiva 22: sitúa este taller después de las sesiones 43–44 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-22). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 43–44 integra archivos y notificaciones. Hoy revisamos sus efectos completos: respuesta HTTP, fila de base de datos, archivo almacenado y aviso enviado. Cada pieza tiene un ciclo de vida distinto; un rollback de PostgreSQL no borra automáticamente un archivo ni retira un webhook.

La evidencia debe comprobar qué queda después de la operación. No basta una captura del 201, ni un mensaje «enviado» escrito antes de confirmar el envío. Usaremos el receptor local y la limpieza implementados en Servidor, con sus límites documentados.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Preparar datos y almacenamiento

Crea un recurso padre válido con el procedimiento de la colección y guarda su id. Prepara un archivo pequeño ficticio y revisa la carpeta configurada en el entorno de prueba. El directorio de subidas no se incluye en Git; el README indica cómo se crea y cómo se conserva en el entorno desplegado.

#### Bloque B · Seguir el archivo

Sube el archivo mediante el endpoint actual, conserva el id devuelto y descarga desde Location con una identidad permitida. Compara el contenido y comprueba la relación en la base de datos. Repite sin permiso y con archivo rechazado; no deben aparecer efectos inesperados.

#### Bloque C · Observar commit y notificación

Arranca el receptor de webhook local de Servidor 43. Ejecuta el caso que publica el evento y comprueba su recepción después del guardado. Detén solo el receptor y repite: observa el fallo y verifica la política real de reintento. No describas como implementada una cola que el código todavía no tiene.

#### Bloque D · Verificar un fallo intermedio

Reutiliza el test de rollback y limpieza de Servidor 44 en un entorno aislado. Consulta filas y archivos después del fallo y conserva el resultado. Documenta el límite ante caída del proceso si la limpieza depende de una acción en memoria. Restaura el escenario normal antes de publicar.

#### Bloque E · Revisar la operación desplegada

Comprueba si el almacenamiento del proveedor persiste entre reinicios y despliegues según la configuración elegida. Registra el directorio o servicio utilizado y un ensayo con archivo ficticio. Si el almacenamiento es efímero, no declares persistencia de adjuntos: corrige el entorno o registra esa limitación pendiente de aceptación.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 22.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-22.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-43.pdf` y `sesion-44.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio, commit y PR con evidencias enlazadas. Explica qué demuestra cada comprobación y qué parte de la operación no comparte la transacción de base de datos.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

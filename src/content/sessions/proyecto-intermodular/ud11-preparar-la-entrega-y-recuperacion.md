---
title: "Verificar efectos y revisar la candidata"
label: "UD11 · Proyecto compartido"
section: "ud-11"
order: 11
lang: "es"
summary: "Verificar archivos y efectos externos; Cerrar una candidata con evidencias de calidad, con resultados comprobados."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Verificar archivos y efectos externos; Cerrar una candidata con evidencias de calidad, con resultados comprobados."
date: "2026-09-09"
outcomes: ["Verificar archivos y efectos externos con resultados comprobados.", "Cerrar una candidata con evidencias de calidad con resultados comprobados."]
requirements: ["Repositorio del backend y, desde la sesión 18, cliente desarrollado en Servidor.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Flujo de revisión y despliegue del primer trimestre."]
---

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 23 · Verificar archivos y efectos externos

**Antes de empezar.** El backend ya gestiona archivos y efectos externos. Hoy seguirás sus resultados en la API, la base de datos, el almacenamiento y el receptor de notificaciones.

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

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** Has seguido una operación de archivo o notificación hasta sus efectos reales y comprobado un caso de fallo. Distingues qué cambios comparten una transacción y qué limpieza requiere cada recurso.

## Sesión 24 · Cerrar una candidata con evidencias de calidad

**Antes de empezar.** Las pruebas y la documentación técnica ya están trabajadas en Servidor. Hoy revisarás las evidencias para decidir si una candidata puede publicarse.

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

Actualiza sus notas con criterios superados y pendientes. Si el código cambia, registra el nuevo SHA y su ejecución; una evidencia del commit anterior no valida automáticamente el nuevo. Guarda el resultado en las comprobaciones de la sesión.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** La candidata tiene evidencias de calidad revisadas y defectos clasificados. Puedes justificar si está preparada para publicarse o qué problema concreto lo impide.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

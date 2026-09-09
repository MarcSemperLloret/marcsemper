---
title: "Verificar y publicar los permisos"
label: "UD9 · Proyecto compartido"
section: "ud-09"
order: 9
lang: "es"
summary: "Comprobar roles y propiedad en el proceso de revisión y publicar el acceso con jwt sin perder permisos, sobre la misma versión del producto de Servidor."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Repositorio de GitHub, commit de cada sesión y enlaces a PR, CI y documentos comunes con Servidor."
date: "2026-09-09"
outcomes: ["Comprobar roles y propiedad en el proceso de revisión sobre una versión identificada del producto.", "Publicar el acceso con JWT sin perder permisos sobre una versión identificada del producto."]
requirements: ["Repositorio del backend de Servidor y cliente existente.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Circuito de revisión y despliegue del primer trimestre."]
---

**Cómo preparar los documentos.** Redacta las fichas, registros y memorias en Word, LibreOffice o un documento en línea. Conserva el original editable y usa «Exportar» o «Descargar como PDF» para guardarlo con el nombre y en la carpeta indicados. Cuando se pida ampliar un documento, modifica ese mismo original y sustituye su PDF por la versión actualizada. Comprueba que los enlaces del PDF se puedan abrir. La entrega sigue siendo el enlace al repositorio de GitHub y al commit de la sesión, con el código y los PDF correspondientes. El `README.md` es la portada técnica del repositorio y se edita como texto; las fichas y memorias se entregan en PDF.

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 19 · Comprobar roles y propiedad en el proceso de revisión

**Punto de partida compartido.** Semana lectiva 19: sitúa este taller después de las sesiones 37–38 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-19). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 37–38 implementa usuarios persistentes, roles y autorización. Hoy utilizamos sus pruebas y casos de uso como criterios de revisión de la versión. Intermodular comprueba que un cambio de permisos tiene justificación, revisión y pruebas que se ejecutan; Servidor evalúa si la regla está bien implementada.

Una prueba con `@WithMockUser` prepara una identidad en Spring Security, pero no crea una fila en PostgreSQL. Un recorrido real necesita datos de prueba coherentes. Confundir ambas cosas produce rechazos que parecen fallos de permisos y son fallos de preparación.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Preparar un escenario reproducible

Crea, mediante el procedimiento de pruebas de Servidor, dos usuarios del mismo rol y un recurso que pertenezca a uno. Añade una cuenta con el rol administrativo previsto. Guarda ids y nombres ficticios en la configuración local de la colección; no presupongas id 1.

#### Bloque B · Recorrer la matriz

Prueba lectura, modificación y borrado como propietario y como otra persona. Ejecuta los casos de rol insuficiente y ausencia de identidad. Después de cada rechazo consulta los datos: un 403 debe impedir también el cambio. Contrasta cada resultado con la matriz, sin decidir permisos nuevos para acomodar el resultado observado.

#### Bloque C · Comprobar las pruebas automatizadas

Localiza los tests de seguridad de Servidor 38 y su ejecución en CI. Abre una rama de diagnóstico y provoca una regresión controlada en una regla. El test correspondiente debe fallar. Restaura la regla y comprueba verde; no fusiones la versión insegura ni cambies la aserción para ocultarla.

#### Bloque D · Revisar el cambio

En la PR enlaza la fila de la matriz, el test y la evidencia del rechazo. La persona revisora prueba al menos el caso de otro usuario del mismo rol. Describe qué datos persistentes necesita reproducirlo, para que la revisión no dependa de tu sesión del navegador.

#### Bloque E · Registrar el resultado

En el registro de Intermodular 19 enlaza los casos y el commit de Servidor que contiene la regla. Si aparece un defecto, usa una sola issue y una sola corrección para ambos módulos. Mantén separadas la causa técnica y la mejora necesaria del proceso de detección.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 19.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-19.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-37.pdf` y `sesion-38.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio, commit y PR. La siguiente sesión cambiará el transporte de identidad a JWT conservando los permisos ya comprobados.

## Sesión 20 · Publicar el acceso con JWT sin perder permisos

**Punto de partida compartido.** Semana lectiva 20: sitúa este taller después de las sesiones 39–40 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-20). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 39–40 completa login, JWT, CORS y cierre del cliente. Intermodular verifica la transición y su configuración. La clave de firma pertenece al entorno; el token es una credencial temporal y no debe aparecer en evidencias públicas.

Cambiar Basic o sesión por Bearer no cambia quién puede hacer qué. La matriz y las pruebas de la semana anterior se conservan. Una versión que permite iniciar sesión pero pierde las restricciones de propiedad no está lista para publicar.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Comprobar el punto de partida

Ejecuta el login de Servidor 39 en local y una ruta protegida. Comprueba contraseña incorrecta, token alterado y rol insuficiente. Utiliza sus implementaciones existentes, sin copiar otra SecurityConfig de Internet.

#### Bloque B · Configurar CI y producción

Añade JWT_SECRET al entorno que ejecuta las pruebas de contexto, con una clave ficticia exclusiva de CI. En producción configura una clave distinta mediante el proveedor. Conserva las variables de base de datos y documenta solo los nombres. Si hay «Could not resolve placeholder», comprueba el proceso que arranca Java antes de modificar código.

#### Bloque C · Integrar el cliente existente

Reutiliza el formulario y transporte de token construidos en Servidor. Actualiza el origen permitido de producción en su configuración CORS unificada. En Red verifica que las peticiones protegidas llevan Authorization y que el preflight puede resolverse. No mantengas a la vez dos configuraciones CORS contradictorias.

#### Bloque D · Repetir el contrato de permisos

Ejecuta acceso permitido, token ausente/caducado, rol insuficiente y acceso a recurso ajeno. Prueba cierre de sesión en el cliente. Explica que retirar un token del navegador no revoca una copia todavía válida; registra la política implementada, sin prometer una revocación inexistente.

#### Bloque E · Publicar la transición

En las notas de versión indica cómo se autentica el cliente y qué configuración exige el entorno. Despliega la combinación probada y repite login más una operación permitida y otra rechazada. Registra SHA, ejecución y resultado sin copiar tokens, hashes ni contraseñas.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 20.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-20.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-39.pdf` y `sesion-40.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio y commit con las pruebas anteriores. La seguridad se evalúa técnicamente en Servidor y la transición comprobada en Intermodular, sobre la misma versión.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

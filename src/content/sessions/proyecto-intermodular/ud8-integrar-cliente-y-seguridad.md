---
title: "Integrar cliente y seguridad"
label: "UD8 · Proyecto compartido"
section: "ud-08"
order: 8
lang: "es"
summary: "Integrar el cliente ya construido en Servidor y planificar permisos y preparar el entorno de seguridad, sobre la misma versión del producto de Servidor."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Repositorio de GitHub, commit de cada sesión y enlaces a PR, CI y documentos comunes con Servidor."
date: "2026-09-09"
outcomes: ["Integrar el cliente ya construido en Servidor sobre una versión identificada del producto.", "Planificar permisos y preparar el entorno de seguridad sobre una versión identificada del producto."]
requirements: ["Repositorio del backend de Servidor y cliente existente.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Circuito de revisión y despliegue del primer trimestre."]
---

**Cómo preparar los documentos.** Redacta las fichas, registros y memorias en Word, LibreOffice o un documento en línea. Conserva el original editable y usa «Exportar» o «Descargar como PDF» para guardarlo con el nombre y en la carpeta indicados. Cuando se pida ampliar un documento, modifica ese mismo original y sustituye su PDF por la versión actualizada. Comprueba que los enlaces del PDF se puedan abrir. La entrega sigue siendo el enlace al repositorio de GitHub y al commit de la sesión, con el código y los PDF correspondientes. El `README.md` es la portada técnica del repositorio y se edita como texto; las fichas y memorias se entregan en PDF.

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 17 · Integrar el cliente ya construido en Servidor

**Punto de partida compartido.** Semana lectiva 17: sitúa este taller después de las sesiones 33–34 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-17). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


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

Después de las comprobaciones, despliega por el circuito habitual y repite un recorrido breve contra la URL pública. Actualiza la ficha del portfolio para enlazar la aplicación y documenta qué dos versiones se probaron juntas. Conserva las evidencias en `docs/intermodular/sesion-17.pdf`.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 17.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-17.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-33.pdf` y `sesion-34.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio y commit con PR y resultado de integración. Explica qué cambia al pasar de local a producción. La autenticación empieza ahora en Servidor; no se exige todavía JWT.

## Sesión 18 · Planificar permisos y preparar el entorno de seguridad

**Punto de partida compartido.** Semana lectiva 18: sitúa este taller después de las sesiones 35–36 de Servidor. Reutiliza su mismo producto, repositorio y autoría/equipo. Comprueba el hito concreto en la [secuencia y evaluación conjunta](/es/docencia/coordinacion-servidor-intermodular/#semana-18). Si el horario real altera ese orden, el docente desplaza la comprobación dependiente; mientras tanto prepara casos, revisión o configuración sobre la versión disponible.


### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 35–36 introduce identidad, sesión, contraseñas y la primera configuración de seguridad. Todavía no se exige el login JWT de la sesión 39. Hoy traducimos esa primera protección al flujo de trabajo y a las comprobaciones del producto.

La **matriz de permisos** relaciona perfiles, acciones y propiedad del recurso. Describe decisiones del producto antes de elegir cómo transportar credenciales. «Usuario autenticado» no significa «puede modificar cualquier registro».

Al cambiar seguridad, algunas comprobaciones públicas dejan de funcionar. La respuesta correcta es preparar identidades ficticias y expectativas nuevas, conservando una prueba de acceso anónimo rechazado. Abrir todas las rutas para que el pipeline quede verde eliminaría el requisito.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Reutilizar la matriz

Abre la matriz creada en Servidor 35. Revisa las acciones reales del incremento elegido y marca quién puede ejecutarlas. Si importa la propiedad, escribe un caso con dos usuarios del mismo rol. Enlaza la matriz desde el tablero; no redactes otra con permisos distintos.

#### Bloque B · Preparar cuentas de prueba

Usa las identidades ficticias del mecanismo disponible en Servidor 36. Documenta perfiles y finalidad sin incluir contraseñas reales. La carga persistente de usuarios llegará en 37; no simules que una fila de persona del primer trimestre ya es una cuenta autenticable.

#### Bloque C · Revisar las comprobaciones afectadas

En la colección separa ruta pública, ruta protegida sin credenciales y ruta protegida con credenciales de prueba. Anota los estados observados. Si el test espera 200 sin identidad y la matriz exige protección, actualiza su escenario y conserva otro que compruebe el rechazo anónimo.

#### Bloque D · Preparar la configuración del despliegue

En `docs/configuracion.pdf` registra nombres de variables, entorno y finalidad. Los valores reales se configuran en el proveedor o en Secrets. Prepara una issue para retirar credenciales provisionales cuando entren los usuarios persistentes. No publiques cuentas administrativas de demostración con contraseñas compartidas.

#### Bloque E · Revisar la transición

Abre una PR con la matriz enlazada y los tres casos ejecutados. La persona revisora identifica qué está ya implementado y qué queda pendiente de Servidor 37–40. Registra ese límite sin presentar la seguridad inicial como sistema terminado.

### Cierre

<p class="stage">15 minutos · comprobación y entrega</p>

**Entrega de Intermodular 18.** Enlaza el repositorio y el commit de la sesión. Actualiza el documento editable y expórtalo como `docs/intermodular/sesion-18.pdf` antes del commit, con lo que has cambiado, PR/revisión, ejecución CI o comprobación manual, resultado y pendientes. En el backend, enlaza los registros `docs/sesiones/sesion-35.pdf` y `sesion-36.pdf` de Servidor cuando aporten la evidencia; no copies su explicación o pruebas. Si hoy solo cambia el portfolio, su registro enlaza el backend compartido. Comprueba que el docente pueda abrir los enlaces. Una funcionalidad pendiente se declara como tal y no se sustituye por una captura de otro proyecto.

Entrega repositorio y commit. Explica la diferencia entre comprobar identidad, comprobar rol y comprobar propiedad. La próxima sesión validará usuarios persistentes y permisos por método.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

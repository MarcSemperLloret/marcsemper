---
title: "Preparar y comprobar los permisos"
label: "UD9 · Proyecto compartido"
section: "ud-09"
order: 9
lang: "es"
summary: "Planificar permisos y preparar el entorno de seguridad; Comprobar roles y propiedad en el proceso de revisión, con resultados comprobados."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Planificar permisos y preparar el entorno de seguridad; Comprobar roles y propiedad en el proceso de revisión, con resultados comprobados."
date: "2026-09-09"
outcomes: ["Planificar permisos y preparar el entorno de seguridad con resultados comprobados.", "Comprobar roles y propiedad en el proceso de revisión con resultados comprobados."]
requirements: ["Repositorio del backend y, desde la sesión 18, cliente desarrollado en Servidor.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Flujo de revisión y despliegue del primer trimestre."]
---

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 19 · Planificar permisos y preparar el entorno de seguridad

**Antes de empezar.** Ya has introducido autenticación y almacenamiento de contraseñas en Servidor. Hoy prepararás la matriz de permisos y la configuración necesaria para comprobar el acceso.

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

En la descripción de la configuración registra nombres de variables, entorno y finalidad. Los valores reales se configuran en el proveedor o en Secrets. Prepara una issue para retirar credenciales provisionales cuando entren los usuarios persistentes. No publiques cuentas administrativas de demostración con contraseñas compartidas.

#### Bloque E · Revisar la transición

Abre una PR con la matriz enlazada y los tres casos ejecutados. La persona revisora identifica qué está ya implementado y qué queda pendiente de Servidor 37–40. Registra ese límite sin presentar la seguridad inicial como sistema terminado.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** Tienes una matriz de identidades, roles y recursos, casos de acceso permitido y denegado y la configuración del entorno identificada. Distingues autenticación, rol y propiedad.

## Sesión 20 · Comprobar roles y propiedad en el proceso de revisión

**Antes de empezar.** En Servidor ya has trabajado usuarios persistentes, roles y control de propiedad. Hoy revisarás esos permisos con identidades distintas.

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

Relaciona los casos y el commit de Servidor que contiene la regla. Si aparece un defecto, usa una sola issue y una sola corrección para ambos módulos. Mantén separadas la causa técnica y la mejora necesaria del proceso de detección.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** Has comprobado el acceso de personas con distintos roles y la protección de recursos ajenos. La revisión relaciona cada permiso con su caso de prueba y sus resultados.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

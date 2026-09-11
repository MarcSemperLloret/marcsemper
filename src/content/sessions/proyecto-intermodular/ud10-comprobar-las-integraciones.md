---
title: "Publicar JWT y comprobar integraciones"
label: "UD10 · Proyecto compartido"
section: "ud-10"
order: 10
lang: "es"
summary: "Publicar el acceso con JWT sin perder permisos; Comprobar una dependencia externa y su degradación, con resultados comprobados."
duration: "6 horas · 2 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Publicar el acceso con JWT sin perder permisos; Comprobar una dependencia externa y su degradación, con resultados comprobados."
date: "2026-09-09"
outcomes: ["Publicar el acceso con JWT sin perder permisos con resultados comprobados.", "Comprobar una dependencia externa y su degradación con resultados comprobados."]
requirements: ["Repositorio del backend y, desde la sesión 18, cliente desarrollado en Servidor.", "Colección de peticiones, acceso a CI y al entorno de pruebas."]
priorKnowledge: ["Hitos de Servidor indicados al comienzo de cada sesión.", "Flujo de revisión y despliegue del primer trimestre."]
---

El producto, su autoría/equipo y su repositorio de backend continúan desde el primer trimestre. Consulta la [secuencia conjunta y los criterios de evaluación](/es/docencia/coordinacion-servidor-intermodular/).

## Sesión 21 · Publicar el acceso con JWT sin perder permisos

**Antes de empezar.** El backend ya permite acceso mediante JWT. Hoy comprobarás que esa transición mantiene los permisos y funciona en el entorno publicado.

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

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** El acceso con JWT funciona en la versión publicada y conserva los permisos anteriores. Has comprobado identidad válida, token no válido y acceso a recursos ajenos.

## Sesión 22 · Comprobar una dependencia externa y su degradación

**Antes de empezar.** Ya has implementado y probado una integración externa en Servidor. Hoy comprobarás la experiencia completa cuando el proveedor responde, tarda demasiado o falla.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Servidor 41–42 aporta un cliente HTTP externo, adaptación de datos, timeouts y caché. Aquí planificamos y comprobamos qué ocurre cuando esa dependencia falla durante el uso del producto. No implementaremos otro adaptador.

Una respuesta degradada es una respuesta prevista con información parcial. Debe permitir distinguir «no hay dato» de un valor real. Por ejemplo, no conocer la temperatura no equivale a cero grados. El criterio de aceptación debe describir ese resultado, además del caso en que el proveedor responde.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Describir la dependencia

En el análisis de las integraciones registra proveedor, dato utilizado, función del producto y si ese dato es imprescindible o complementario. Enlaza el adaptador de Servidor. Anota configuración y límites utilizados, sin copiar respuestas externas completas ni datos personales.

#### Bloque B · Preparar los escenarios

Reutiliza el proveedor simulado y los casos de Servidor 42: respuesta correcta, timeout y respuesta no utilizable. Comprueba que el procedimiento no necesita desconectar toda la red. Antes de cada escenario controla la caché para no confundir un resultado guardado con una consulta nueva.

#### Bloque C · Ejecutar y observar

Para cada caso registra tiempo total, estado de la API, aviso mostrado y conservación del resto de funciones. Distingue timeout configurado de latencia total. Si el dato es opcional, comprueba la degradación prevista; si es obligatorio, comprueba el error acordado por el contrato.

#### Bloque D · Llevarlo al pipeline

Localiza los tests de adaptador y resiliencia existentes y confirma que CI los ejecuta sin depender del proveedor real. No conviertas cada PR en una consulta a un servicio de terceros. La comprobación pública breve se registra aparte y con datos ficticios.

#### Bloque E · Revisar y documentar

La persona revisora reproduce un fallo controlado y comprueba el resultado de usuario. Enlaza configuración, test y PR en el registro de la sesión. Si cambia el criterio, actualiza el contrato y su prueba en la misma propuesta.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** Has comprobado respuesta normal, timeout y fallo del proveedor, controlando la caché. Sabes explicar qué ve la persona usuaria y qué funciones siguen disponibles.

## Lo que debes recordar

Una evidencia pertenece a una versión concreta. Reutiliza la implementación y sus pruebas de Servidor, y documenta aquí cómo se revisan, ejecutan y publican. Los documentos comunes se enlazan; no se vuelven a escribir.

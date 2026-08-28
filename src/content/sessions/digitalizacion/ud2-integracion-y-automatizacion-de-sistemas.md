---
title: "Integración y automatización de sistemas"
label: "UD2 · Sesión 1"
section: "ud-02"
order: 2
lang: "es"
summary: "Cuando las aplicaciones tienen que hablar entre ellas. API, polling, webhook, eventos, colas y automatización: qué problema resuelve cada mecanismo y cuándo tiene sentido usarlo."
duration: "2 horas"
modality: "Parejas"
deliverable: "Diseño de un flujo de integración y automatización para una empresa."
date: "2026-08-28"
---

## 1. ¿Qué vamos a aprender?

Una aplicación real rara vez funciona completamente sola.

Una tienda online puede necesitar comunicarse con:

* una plataforma de pago;
* una empresa de transporte;
* un servicio de correo;
* una base de datos;
* un sistema de facturación;
* una aplicación móvil;
* un servicio de inteligencia artificial.

Por tanto, una parte importante del desarrollo moderno consiste en conseguir que **sistemas diferentes intercambien información y reaccionen automáticamente a determinados acontecimientos**.

En esta actividad aprenderemos a distinguir:

* integración;
* API;
* polling;
* webhook;
* evento;
* automatización;
* cola de mensajes;
* herramientas low-code/no-code.

No aprenderemos a programar cada una de estas tecnologías.

El objetivo es entender:

> **qué problema resuelve cada mecanismo y cuándo tiene sentido utilizarlo.**

---

## 2. Una aplicación no vive sola

Imagina una tienda online.

Cuando un cliente compra un producto pueden ocurrir muchas cosas:

<figure class="diagram">
  <figcaption>Lo que desencadena un solo pedido</figcaption>
  <ol class="flow">
    <li>Cliente realiza pedido</li>
    <li>Se registra el pedido</li>
    <li>Se realiza el pago</li>
    <li>Se actualiza el stock</li>
    <li>Se prepara el envío</li>
    <li>Se genera una factura</li>
    <li>Se envía un correo</li>
  </ol>
</figure>

Sería posible que una persona hiciera manualmente todas estas tareas.

Pero cuanto más crece una empresa:

* más pedidos recibe;
* más aplicaciones utiliza;
* más información debe mover;
* más errores puede cometer;
* más tiempo pierde realizando tareas repetitivas.

Por eso aparecen dos conceptos fundamentales:

### Integración

Conseguir que **dos o más sistemas puedan intercambiar información**.

### Automatización

Conseguir que **una tarea pueda realizarse sin intervención manual cada vez que ocurre**.

Son conceptos relacionados, pero no son exactamente lo mismo.

---

## 3. ¿Qué significa integrar aplicaciones?

Supongamos que tenemos:

<p class="single-node">Tienda online</p>

y una empresa de transporte:

<p class="single-node">Empresa de transporte</p>

Cuando alguien compra un producto, necesitamos enviar:

* nombre;
* dirección;
* teléfono;
* información del paquete.

Una opción sería que un trabajador copiara manualmente los datos.

<figure class="diagram">
  <figcaption>Antes · el trasvase manual</figcaption>
  <ol class="flow flow--before">
    <li>Tienda</li>
    <li>Una persona copia los datos</li>
    <li>Web del transportista</li>
  </ol>
</figure>

Funciona.

Pero tiene varios problemas:

* consume tiempo;
* pueden producirse errores;
* hay datos duplicados;
* no escala bien.

Una integración permitiría algo como:

<figure class="diagram">
  <figcaption>Después · los datos pasan solos</figcaption>
  <ol class="flow flow--row">
    <li>Tienda</li>
    <li><strong>API</strong></li>
    <li>Transportista</li>
  </ol>
</figure>

Los datos pasan automáticamente de una aplicación a otra.

---

## 4. API: una puerta para comunicarse con una aplicación

Ya conocéis las APIs desde el punto de vista de programación.

Aquí nos interesa entender **para qué sirven dentro de una empresa**.

Una API permite que otra aplicación pueda solicitar o enviar información de forma controlada.

Por ejemplo:

<figure class="diagram">
  <figcaption>Consultar un servicio externo</figcaption>
  <ol class="flow flow--row">
    <li>Nuestra aplicación</li>
    <li><strong>API</strong></li>
    <li>Servicio meteorológico</li>
  </ol>
</figure>

Nuestra aplicación podría preguntar:

> ¿Qué temperatura hace ahora en Alicante?

y recibir:

```json
{
  "temperature": 31,
  "condition": "sunny"
}
```

La API actúa como una especie de **puerta de entrada definida por el sistema**.

No necesitamos saber cómo funciona internamente el servicio meteorológico.

Solo necesitamos conocer:

* qué podemos solicitar;
* qué datos debemos enviar;
* qué respuesta obtendremos.

---

## 5. Pero aparece un problema

Imaginemos ahora una empresa de reparaciones.

Queremos avisar al cliente cuando su ordenador esté reparado.

Tenemos dos posibilidades.

### Opción A

Nuestra aplicación pregunta continuamente:

> ¿Ya está reparado?

<figure class="diagram">
  <figcaption>Opción A · preguntar una y otra vez</figcaption>
  <ol class="flow">
    <li>¿Está reparado? <span class="tag tag--no">No</span></li>
    <li>10 segundos después, ¿está reparado? <span class="tag tag--no">No</span></li>
    <li>10 segundos después, ¿está reparado? <span class="tag tag--yes">Sí</span></li>
  </ol>
</figure>

Esto se denomina:

<p class="term">Polling</p>

La aplicación pregunta periódicamente si ha ocurrido algo.

---

## 6. Polling

El funcionamiento puede representarse así:

<figure class="diagram">
  <figcaption>Polling · la aplicación A lleva la iniciativa</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 232" role="img" aria-labelledby="poll-title poll-desc" preserveAspectRatio="xMidYMid meet">
    <title id="poll-title">Ciclo de polling entre dos aplicaciones</title>
    <desc id="poll-desc">La aplicación A pregunta a la aplicación B si hay novedades, la aplicación B responde, y el ciclo vuelve a empezar pasado un intervalo de tiempo.</desc>
    <defs>
      <marker id="poll-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 240 82 L 474 82" marker-end="url(#poll-arrow)" />
      <path d="M 480 116 L 246 116" marker-end="url(#poll-arrow)" />
      <path class="is-dashed" d="M 570 130 L 570 178 L 150 178 L 150 130" marker-end="url(#poll-arrow)" />
    </g>
    <text class="diagram-label" x="357" y="68">¿Hay novedades?</text>
    <text class="diagram-label" x="363" y="136">Respuesta</text>
    <text class="diagram-label diagram-label--accent" x="360" y="200">y vuelve a preguntar pasado el intervalo</text>
    <g class="diagram-node">
      <rect x="60" y="74" width="180" height="56" rx="3" />
      <text x="150" y="102">Aplicación A</text>
    </g>
    <g class="diagram-node">
      <rect x="480" y="74" width="180" height="56" rx="3" />
      <text x="570" y="102">Aplicación B</text>
    </g>
  </svg>
</figure>

Es sencillo de implementar.

Pero puede ser poco eficiente.

Imaginemos que preguntamos cada minuto y el estado cambia una vez al día.

Estamos realizando miles de preguntas innecesarias.

---

## 7. Otra posibilidad: webhook

En lugar de preguntar continuamente:

> ¿Ha ocurrido algo?

podemos decir:

> **Avísame cuando ocurra.**

Ese es el concepto fundamental de un **webhook**.

<figure class="diagram">
  <figcaption>Webhook · la iniciativa cambia de lado</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 208" role="img" aria-labelledby="hook-title hook-desc" preserveAspectRatio="xMidYMid meet">
    <title id="hook-title">Aviso mediante webhook</title>
    <desc id="hook-desc">La aplicación A espera sin preguntar nada. Cuando ocurre un evento en la aplicación B, esta avisa a la aplicación A mediante un webhook.</desc>
    <defs>
      <marker id="hook-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 460 112 L 272 112" marker-end="url(#hook-arrow)" />
    </g>
    <text class="diagram-label diagram-label--accent" x="560" y="66">ocurre el evento</text>
    <text class="diagram-label" x="366" y="98">webhook: te aviso</text>
    <text class="diagram-label" x="160" y="176">no pregunta nada</text>
    <g class="diagram-node">
      <rect x="60" y="84" width="206" height="56" rx="3" />
      <text x="163" y="112">Aplicación A</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="460" y="84" width="200" height="56" rx="3" />
      <text x="560" y="112">Aplicación B</text>
    </g>
  </svg>
</figure>

Por ejemplo:

<figure class="diagram">
  <figcaption>Un aviso de pago</figcaption>
  <ol class="flow flow--row">
    <li>Pago completado</li>
    <li><strong>Webhook</strong></li>
    <li>Nuestra tienda</li>
  </ol>
</figure>

El servicio de pago avisa automáticamente a nuestra aplicación.

---

## 8. Polling vs webhook

Una forma sencilla de recordarlo:

### Polling

> Yo te pregunto periódicamente si ha ocurrido algo.

### Webhook

> Tú me avisas cuando ocurra.

Comparación:

| | Polling | Webhook |
| --- | --- | --- |
| Quién inicia la comunicación | El interesado | El sistema donde ocurre el evento |
| Consultas repetidas | Sí | No normalmente |
| Tiempo de reacción | Depende del intervalo | Normalmente inmediato |
| Sencillez | Alta | Requiere preparar un receptor |
| Ejemplo | Consultar estado cada minuto | Avisar cuando cambia el estado |

Ninguno es siempre mejor.

Depende del problema.

---

## 9. Los eventos

Muchas aplicaciones modernas funcionan alrededor de acontecimientos.

Por ejemplo:

* usuario registrado;
* pedido creado;
* pago realizado;
* paquete enviado;
* reparación terminada;
* contraseña modificada.

Podemos llamar a estos acontecimientos:

<p class="term">Eventos</p>

Un evento significa simplemente:

> **ha ocurrido algo relevante dentro del sistema.**

Por ejemplo:

<p class="single-node">Evento: reparación terminada</p>

A partir de ese evento podrían ejecutarse varias acciones:

<figure class="diagram">
  <figcaption>Un evento, varias reacciones</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 300" role="img" aria-labelledby="fan-title fan-desc" preserveAspectRatio="xMidYMid meet">
    <title id="fan-title">Un evento desencadena tres acciones</title>
    <desc id="fan-desc">Al terminar una reparación se emite un evento, y a partir de él se ejecutan tres acciones: enviar un correo, generar la factura y actualizar el estado.</desc>
    <defs>
      <marker id="fan-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 62 L 360 104" marker-end="url(#fan-arrow)" />
      <path d="M 360 158 L 360 196" />
      <path d="M 130 196 L 590 196" />
      <path d="M 130 196 L 130 224" marker-end="url(#fan-arrow)" />
      <path d="M 360 196 L 360 224" marker-end="url(#fan-arrow)" />
      <path d="M 590 196 L 590 224" marker-end="url(#fan-arrow)" />
    </g>
    <g class="diagram-node">
      <rect x="250" y="14" width="220" height="48" rx="3" />
      <text x="360" y="38">Reparación terminada</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="285" y="110" width="150" height="48" rx="3" />
      <text x="360" y="134">Evento</text>
    </g>
    <g class="diagram-node">
      <rect x="40" y="230" width="180" height="48" rx="3" />
      <text x="130" y="254">Enviar correo</text>
    </g>
    <g class="diagram-node">
      <rect x="270" y="230" width="180" height="48" rx="3" />
      <text x="360" y="254">Generar factura</text>
    </g>
    <g class="diagram-node">
      <rect x="500" y="230" width="180" height="48" rx="3" />
      <text x="590" y="254">Actualizar estado</text>
    </g>
  </svg>
</figure>

Una única acción puede desencadenar muchas otras.

---

## 10. Automatización

Supongamos que cada vez que termina una reparación debemos:

1. cambiar el estado a TERMINADA;
2. avisar al cliente;
3. generar una factura;
4. registrar la fecha;
5. solicitar una valoración dos días después.

Hacerlo manualmente es posible.

Pero son tareas:

* repetitivas;
* predecibles;
* basadas en reglas.

Por tanto son buenas candidatas para automatizarse.

<figure class="diagram">
  <figcaption>El flujo automatizado</figcaption>
  <ol class="flow">
    <li>Reparación terminada</li>
    <li>Cambiar estado</li>
    <li>Generar factura</li>
    <li>Enviar notificación</li>
    <li>Esperar 2 días</li>
    <li>Solicitar valoración</li>
  </ol>
</figure>

---

## 11. ¿Todo debería automatizarse?

No.

Antes de automatizar una tarea debemos preguntarnos:

#### ¿Se repite con frecuencia?

#### ¿Sigue reglas claras?

#### ¿Consume tiempo?

#### ¿Es fácil cometer errores?

#### ¿Qué ocurre si la automatización falla?

Por ejemplo:

### Buena candidata

> Enviar automáticamente un email cuando un pedido sale del almacén.

### Mala candidata

> Decidir automáticamente si despedir a un trabajador.

La segunda implica:

* consecuencias importantes;
* contexto;
* posibles errores;
* aspectos legales y éticos.

Por tanto:

> **automatizar algo porque técnicamente podemos hacerlo no significa que debamos hacerlo.**

---

## 12. ¿Qué pasa cuando intervienen muchos sistemas?

Veamos un pedido online.

<figure class="diagram">
  <figcaption>El ecosistema de un pedido</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 584" role="img" aria-labelledby="eco-title eco-desc" preserveAspectRatio="xMidYMid meet">
    <title id="eco-title">Sistemas implicados en un pedido online</title>
    <desc id="eco-desc">Un pedido entra por la tienda online, que se comunica con el pago, el stock y la facturación. Del pago sale la confirmación, el transporte, el seguimiento y el aviso al cliente. De la facturación sale la factura.</desc>
    <defs>
      <marker id="eco-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 56 L 360 86" marker-end="url(#eco-arrow)" />
      <path d="M 360 136 L 360 172" />
      <path d="M 125 172 L 595 172" />
      <path d="M 125 172 L 125 194" marker-end="url(#eco-arrow)" />
      <path d="M 360 172 L 360 194" marker-end="url(#eco-arrow)" />
      <path d="M 595 172 L 595 194" marker-end="url(#eco-arrow)" />
      <path d="M 125 244 L 125 274" marker-end="url(#eco-arrow)" />
      <path d="M 125 324 L 125 354" marker-end="url(#eco-arrow)" />
      <path d="M 125 404 L 125 434" marker-end="url(#eco-arrow)" />
      <path d="M 125 484 L 125 514" marker-end="url(#eco-arrow)" />
      <path d="M 595 244 L 595 274" marker-end="url(#eco-arrow)" />
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="12" width="160" height="44" rx="3" />
      <text x="360" y="34">Pedido</text>
    </g>
    <g class="diagram-node">
      <rect x="270" y="92" width="180" height="44" rx="3" />
      <text x="360" y="114">Tienda online</text>
    </g>
    <g class="diagram-node">
      <rect x="40" y="200" width="170" height="44" rx="3" />
      <text x="125" y="222">Pago</text>
    </g>
    <g class="diagram-node">
      <rect x="275" y="200" width="170" height="44" rx="3" />
      <text x="360" y="222">Stock</text>
    </g>
    <g class="diagram-node">
      <rect x="510" y="200" width="170" height="44" rx="3" />
      <text x="595" y="222">Facturación</text>
    </g>
    <g class="diagram-node">
      <rect x="40" y="280" width="170" height="44" rx="3" />
      <text x="125" y="302">Confirmación</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="510" y="280" width="170" height="44" rx="3" />
      <text x="595" y="302">Factura</text>
    </g>
    <g class="diagram-node">
      <rect x="40" y="360" width="170" height="44" rx="3" />
      <text x="125" y="382">Transporte</text>
    </g>
    <g class="diagram-node">
      <rect x="40" y="440" width="170" height="44" rx="3" />
      <text x="125" y="462">Seguimiento</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="40" y="520" width="170" height="44" rx="3" />
      <text x="125" y="542">Cliente</text>
    </g>
  </svg>
</figure>

En este punto ya no tenemos una única aplicación.

Tenemos un **ecosistema de aplicaciones**.

Y pueden ocurrir problemas:

* una API no responde;
* un servicio tarda demasiado;
* se pierde una conexión;
* el mismo mensaje llega dos veces;
* un sistema está temporalmente apagado.

Por tanto, integrar sistemas no consiste únicamente en:

> «hacer una petición HTTP».

También tenemos que pensar:

> **¿Qué ocurre cuando algo falla?**

---

## 13. Un problema real: el sistema de facturación está caído

Supongamos:

<figure class="diagram">
  <figcaption>El flujo se rompe por la mitad</figcaption>
  <ol class="flow">
    <li>Pedido realizado</li>
    <li>Pago correcto</li>
    <li>Generar factura</li>
    <li class="is-error">Error</li>
  </ol>
</figure>

¿Qué hacemos?

¿Perdemos la factura?

¿Cancelamos el pedido?

¿Lo intentamos otra vez?

¿Guardamos la tarea para procesarla después?

Una posibilidad es utilizar una:

<p class="term">Cola de mensajes</p>

---

## 14. Cola de mensajes

Imagina una cola en un supermercado.

Una persona no desaparece porque la caja esté ocupada.

Espera su turno.

Una cola de mensajes utiliza una idea parecida:

<figure class="diagram">
  <figcaption>Los mensajes esperan su turno</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 330" role="img" aria-labelledby="queue-title queue-desc" preserveAspectRatio="xMidYMid meet">
    <title id="queue-title">Cola de mensajes entre dos sistemas</title>
    <desc id="queue-desc">La aplicación deja sus mensajes en una cola. Los mensajes esperan ahí hasta que el sistema receptor puede procesarlos, de modo que no se pierden si el receptor no está disponible.</desc>
    <defs>
      <marker id="queue-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 58 L 360 90" marker-end="url(#queue-arrow)" />
      <path d="M 360 230 L 360 262" marker-end="url(#queue-arrow)" />
    </g>
    <g class="diagram-node">
      <rect x="270" y="14" width="180" height="44" rx="3" />
      <text x="360" y="36">Aplicación</text>
    </g>
    <g class="diagram-node diagram-node--container">
      <rect x="240" y="96" width="240" height="134" rx="3" />
      <text x="360" y="116">COLA</text>
    </g>
    <g class="diagram-node diagram-node--data diagram-node--small">
      <rect x="262" y="132" width="196" height="26" rx="2" />
      <text x="360" y="145">mensaje 1</text>
    </g>
    <g class="diagram-node diagram-node--data diagram-node--small">
      <rect x="262" y="164" width="196" height="26" rx="2" />
      <text x="360" y="177">mensaje 2</text>
    </g>
    <g class="diagram-node diagram-node--data diagram-node--small">
      <rect x="262" y="196" width="196" height="26" rx="2" />
      <text x="360" y="209">mensaje 3</text>
    </g>
    <g class="diagram-node">
      <rect x="260" y="268" width="200" height="44" rx="3" />
      <text x="360" y="290">Sistema receptor</text>
    </g>
  </svg>
</figure>

Si el receptor está ocupado o temporalmente no disponible, los mensajes pueden esperar.

Tecnologías como:

* RabbitMQ;
* Apache Kafka;
* Amazon SQS;

se utilizan para resolver problemas relacionados con este tipo de comunicación.

**No necesitamos aprenderlas en esta unidad.**

Lo importante es entender el problema que solucionan.

---

## 15. Una arquitectura cada vez más común

Podemos pasar de:

<figure class="diagram">
  <figcaption>Una conexión directa</figcaption>
  <ol class="flow flow--row">
    <li>Aplicación A</li>
    <li>Aplicación B</li>
  </ol>
</figure>

a sistemas como:

<figure class="diagram">
  <figcaption>Varios sistemas reaccionan al mismo evento</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 366" role="img" aria-labelledby="evt-title evt-desc" preserveAspectRatio="xMidYMid meet">
    <title id="evt-title">Arquitectura dirigida por eventos</title>
    <desc id="evt-desc">La creación de un pedido emite un evento al que reaccionan de forma independiente el pago, el stock y las notificaciones. El stock, a su vez, desencadena la factura.</desc>
    <defs>
      <marker id="evt-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 56 L 360 86" marker-end="url(#evt-arrow)" />
      <path d="M 360 136 L 360 172" />
      <path d="M 125 172 L 595 172" />
      <path d="M 125 172 L 125 194" marker-end="url(#evt-arrow)" />
      <path d="M 360 172 L 360 194" marker-end="url(#evt-arrow)" />
      <path d="M 595 172 L 595 194" marker-end="url(#evt-arrow)" />
      <path d="M 360 244 L 360 284" marker-end="url(#evt-arrow)" />
    </g>
    <g class="diagram-node">
      <rect x="270" y="12" width="180" height="44" rx="3" />
      <text x="360" y="34">Pedido creado</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="290" y="92" width="140" height="44" rx="3" />
      <text x="360" y="114">Evento</text>
    </g>
    <g class="diagram-node">
      <rect x="40" y="200" width="170" height="44" rx="3" />
      <text x="125" y="222">Pago</text>
    </g>
    <g class="diagram-node">
      <rect x="275" y="200" width="170" height="44" rx="3" />
      <text x="360" y="222">Stock</text>
    </g>
    <g class="diagram-node">
      <rect x="510" y="200" width="170" height="44" rx="3" />
      <text x="595" y="222">Notificación</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="275" y="290" width="170" height="44" rx="3" />
      <text x="360" y="312">Factura</text>
    </g>
  </svg>
</figure>

A este tipo de diseños se les suele llamar **arquitecturas dirigidas por eventos**.

No hace falta memorizar el término.

Lo importante es entender la idea:

> Una acción importante ocurre y diferentes sistemas reaccionan a ella.

---

## 16. Low-Code y No-Code

No todas las integraciones tienen que programarse desde cero.

Existen herramientas como:

* n8n;
* Zapier;
* Make;
* Power Automate.

Permiten construir flujos visualmente.

Por ejemplo:

<figure class="diagram">
  <figcaption>Un flujo construido sin escribir código</figcaption>
  <ol class="flow">
    <li>Nuevo formulario</li>
    <li>Crear registro</li>
    <li>Enviar correo</li>
    <li>Avisar por Teams</li>
  </ol>
</figure>

La idea es similar a programar:

<figure class="diagram">
  <figcaption>La misma lógica de siempre</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Si ocurre A</li>
    <li>entonces ejecuta B</li>
    <li>después ejecuta C</li>
  </ol>
</figure>

Estas herramientas son especialmente útiles para:

* automatizaciones sencillas;
* conectar servicios;
* prototipos;
* tareas internas.

Pero tampoco sustituyen siempre al desarrollo tradicional.

Cuando necesitamos:

* lógica compleja;
* rendimiento;
* control;
* gran escalabilidad;

puede ser mejor desarrollar la solución mediante código.

---

## 17. Actividad

### Volvemos a Reparaciones Rápidas S.L.

La empresa que analizamos en la actividad anterior ya dispone ahora de:

* página web;
* aplicación para los trabajadores;
* base de datos;
* sistema de facturación;
* servicio de correo;
* almacenamiento de fotografías.

Pero todavía realiza muchas tareas manualmente.

---

## 18. Situación actual

Cuando llega una reparación:

1. el cliente registra la solicitud desde la web;
2. un trabajador revisa manualmente las solicitudes;
3. asigna un técnico;
4. el técnico realiza la reparación;
5. cuando termina, cambia el estado;
6. un administrativo consulta cada cierto tiempo las reparaciones terminadas;
7. prepara la factura;
8. busca el correo del cliente;
9. envía manualmente el aviso;
10. dos días después intenta recordar enviar una encuesta.

---

## 19. Primera tarea — ¿Qué automatizarías?

Identificad al menos **cinco tareas** que podrían automatizarse.

Completad:

| Tarea actual | ¿Automatizar? | Motivo |
| --- | --- | --- |
| Asignar técnico | | |
| Cambiar estado | | |
| Generar factura | | |
| Avisar al cliente | | |
| Solicitar valoración | | |

Podéis añadir otras.

---

## 20. Segunda tarea — Identificar eventos

Pensad qué acontecimientos importantes ocurren durante una reparación.

Ejemplo:

<p class="single-node">Reparación terminada</p>

Puede ser un evento.

Identificad al menos **cuatro eventos**.

| Evento | ¿Qué debería ocurrir después? |
| --- | --- |
| Reparación creada | |
| | |
| | |
| | |

---

## 21. Tercera tarea — ¿Polling o webhook?

Analizad las siguientes situaciones.

### Situación A

Queremos saber cuándo un pago online ha sido confirmado.

¿Utilizaríais polling o webhook? ¿Por qué?

<p class="write-line"></p>

### Situación B

Una aplicación consulta cada 30 minutos el precio actual de una moneda.

¿Polling o webhook? ¿Por qué?

<p class="write-line"></p>

### Situación C

Queremos saber inmediatamente cuándo un cliente cancela una reserva en una plataforma externa.

¿Polling o webhook? ¿Por qué?

<p class="write-line"></p>

### Situación D

Cada noche necesitamos consultar cuántos pedidos se han realizado durante el día.

¿Polling, webhook o ninguna de las dos opciones? ¿Por qué?

<p class="write-line"></p>

---

## 22. Cuarta tarea — Diseñar una automatización

Diseñad el flujo que debería producirse cuando:

> **un técnico marca una reparación como TERMINADA.**

Vuestro flujo debe incluir al menos:

* un evento;
* tres acciones automáticas;
* dos sistemas diferentes.

Ejemplo de formato:

<figure class="diagram">
  <figcaption>Plantilla · completad vuestro flujo</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Evento</span>Reparación terminada</li>
    <li><span class="flow-role">Acción</span><span class="write-line"></span></li>
    <li><span class="flow-role">Acción</span><span class="write-line"></span></li>
    <li><span class="flow-role">Acción</span><span class="write-line"></span></li>
  </ol>
</figure>

Podéis dibujarlo en diagrams.net, Canva, PowerPoint o papel.

---

## 23. Quinta tarea — Algo falla

Ahora aparece un problema.

El sistema de facturación deja de funcionar durante 30 minutos.

Vuestro flujo era:

<figure class="diagram">
  <figcaption>El flujo afectado</figcaption>
  <ol class="flow">
    <li>Reparación terminada</li>
    <li>Generar factura</li>
    <li>Enviar aviso</li>
  </ol>
</figure>

Responded:

#### A. ¿Qué debería ocurrir con la reparación?

<p class="write-line"></p>

#### B. ¿Deberíamos perder la solicitud de factura?

<p class="write-line"></p>

#### C. ¿Podría tener sentido utilizar una cola?

<p class="write-line"></p>

#### D. ¿Cuándo debería volver a intentarse?

<p class="write-line"></p>

No buscamos una implementación técnica.

Buscamos una **solución razonable**.

---

## 24. Sexta tarea — ¿Programar o utilizar Low-Code?

La empresa necesita estas cuatro automatizaciones.

Decidid si utilizaríais:

* desarrollo tradicional;
* una herramienta low-code/no-code;
* cualquiera de las dos.

### Caso 1

Cada vez que alguien rellena un formulario:

> guardar información y enviar un correo.

<dl class="answer">
  <dt>Elección</dt>
  <dd></dd>
  <dt>Motivo</dt>
  <dd></dd>
</dl>

### Caso 2

Sistema bancario que procesa 10.000 transacciones por segundo.

<dl class="answer">
  <dt>Elección</dt>
  <dd></dd>
  <dt>Motivo</dt>
  <dd></dd>
</dl>

### Caso 3

Cuando llega una incidencia interna:

> crear una tarea y avisar a un canal de Teams.

<dl class="answer">
  <dt>Elección</dt>
  <dd></dd>
  <dt>Motivo</dt>
  <dd></dd>
</dl>

### Caso 4

Motor principal de una tienda online con miles de usuarios simultáneos.

<dl class="answer">
  <dt>Elección</dt>
  <dd></dd>
  <dt>Motivo</dt>
  <dd></dd>
</dl>

---

## 25. Producto final

Cada pareja entregará **una única página o diapositiva** titulada:

<p class="term">Automatización de Reparaciones Rápidas</p>

Debe contener:

### 1. Evento inicial

Por ejemplo:

> Reparación terminada.

### 2. Flujo automatizado

Representado visualmente.

### 3. Sistemas implicados

Por ejemplo:

* aplicación;
* base de datos;
* facturación;
* correo.

### 4. Tipo de comunicación

Indicad dónde tendría sentido utilizar:

* API;
* webhook;
* evento;
* cola.

No es necesario utilizar todas.

### 5. Gestión de un fallo

Explicad qué ocurriría si uno de los sistemas no estuviera disponible.

### 6. Una tarea que NO automatizaríais

Y justificad por qué.

---

## 26. Presentación

Cada pareja dispondrá de aproximadamente **2 minutos**.

Debe responder únicamente:

#### ¿Qué evento habéis elegido?

#### ¿Qué habéis automatizado?

#### ¿Qué ocurre si una parte del sistema falla?

---

## 27. Evaluación

La actividad se calificará sobre **10 puntos**.

<table>
  <thead>
    <tr>
      <th>Criterio</th>
      <th class="align-right">Puntos</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Identificación adecuada de tareas automatizables</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Comprensión de eventos, APIs, polling y webhooks</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Coherencia del flujo diseñado</td>
      <td class="align-right">3</td>
    </tr>
    <tr>
      <td>Tratamiento razonable de posibles fallos</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Claridad de la propuesta</td>
      <td class="align-right">1</td>
    </tr>
  </tbody>
</table>

---

## 28. Lo importante que debes recordar

No necesitas recordar el nombre de todas las plataformas de automatización.

Las herramientas cambiarán.

Lo importante es comprender estas ideas:

<figure class="diagram">
  <figcaption>El camino completo</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Sistemas aislados</li>
    <li>Integración</li>
    <li>Intercambio de datos</li>
    <li>Eventos</li>
    <li>Automatización</li>
  </ol>
</figure>

Y especialmente:

### API

> Una aplicación puede comunicarse con otra.

### Polling

> Pregunto periódicamente si ha ocurrido algo.

### Webhook

> Avísame cuando ocurra.

### Evento

> Ha ocurrido algo relevante.

### Automatización

> Cuando ocurre A, ejecutamos automáticamente B.

### Cola

> Si un sistema no puede procesar algo ahora, podemos conservarlo para procesarlo después.

Cuando trabajéis como desarrolladores, probablemente cambiarán las herramientas.

Pero estos problemas seguirán existiendo.

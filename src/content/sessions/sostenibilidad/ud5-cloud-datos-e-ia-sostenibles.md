---
title: "Cloud, datos e inteligencia artificial sostenibles"
label: "UD5 · Proyecto"
section: "ud-05"
order: 5
lang: "es"
summary: "Una aplicación puede estar perfectamente programada y consumir muchos más recursos de los necesarios. Aprendemos a decidir sobre cloud, almacenamiento, datos e IA teniendo en cuenta a la vez rendimiento, coste y sostenibilidad."
duration: "4 horas · 4 sesiones"
modality: "Parejas"
deliverable: "Propuesta de arquitectura sostenible para varios casos tecnológicos reales."
outcomes:
  - "Explicar por qué usar cloud no elimina el impacto físico de una aplicación."
  - "Detectar infraestructura sobredimensionada y recursos olvidados."
  - "Aplicar la idea de right-sizing sin caer en dimensionar por debajo."
  - "Decidir qué datos merece la pena guardar y durante cuánto tiempo."
  - "Escribir una política de retención sencilla y defendible, contando con lo que exige la normativa."
  - "Elegir entre una regla, un algoritmo, un modelo pequeño y uno generativo."
  - "Justificar una decisión técnica por utilidad, coste y recursos a la vez."
requirements:
  - "Calculadora u hoja de cálculo."
  - "Herramienta de presentaciones o un documento."
  - "Acceso a un asistente de IA."
priorKnowledge:
  - "Qué hay detrás del cloud y qué consume un centro de datos (UD2)."
  - "Qué es PixelStore y qué infraestructura tiene (UD1)."
  - "El principio de no procesar lo que no se necesita (UD3)."
  - "Las tres dimensiones ASG (UD1)."
date: "2026-08-29"
---

## Sesión 1 · Cloud no significa recursos infinitos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> El impacto ambiental de la computación en la nube: sobredimensionamiento de servidores, recursos ociosos y selección de regiones bajas en carbono.</li>
    <li><strong>2. Haz:</strong> Analiza la infraestructura cloud de PixelStore y dimensiona máquinas virtuales y escalado automático con criterios de eficiencia.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall de la sesión 1.</li>
  </ol>
</div>

### ¿Qué vamos a aprender?

En Digitalización aprendimos a desplegar aplicaciones en cloud. Conviene recordar una cosa:

> **Cloud no significa que los servidores hayan desaparecido.**

Simplemente están en centros de datos administrados por otra empresa. Debajo siguen estando la CPU, la RAM, el almacenamiento, las redes, los servidores, la refrigeración, la electricidad y el hardware.

Eso trae una ventaja enorme y un riesgo que viene con ella: **podemos crear recursos con dos clics**, y precisamente por eso podemos acabar creando más de los que necesitamos.

Imaginad una aplicación que usan cincuenta personas desplegada sobre diez servidores. La primera pregunta no es si funciona. Es si hacían falta.

### Right-sizing

<p class="term">Right-sizing</p>

Usar recursos adecuados a la carga real de la aplicación. Ni demasiado pocos, ni muchos más de los necesarios.

Un ejemplo típico: una aplicación que usa de media un 15 % de CPU y un 25 % de RAM, sobre una máquina virtual de 16 CPU y 64 GB. Eso significa mayor coste, más recursos reservados e infraestructura infrautilizada.

Pero cuidado con la conclusión fácil:

<div class="compare-pair">
  <div>
    <p class="compare-label">Falso</p>
    <p class="compare-body">Menos recursos siempre es mejor.</p>
  </div>
  <div>
    <p class="compare-label">Cierto</p>
    <p class="compare-body">Los recursos se ajustan a la necesidad real, incluidos los picos.</p>
  </div>
</div>

Una máquina demasiado pequeña provoca lentitud, errores, caídas, mala experiencia y falta de capacidad justo cuando más gente llega. Dimensionar por debajo no es sostenibilidad: es un fallo de servicio con otro nombre.

### Escalado

No hace falta mantener siempre toda la capacidad que necesitaremos en un pico:

<figure class="diagram">
  <figcaption>La capacidad sigue a la carga</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Carga baja · pocos recursos</li>
    <li>Carga alta · más recursos</li>
    <li>Carga baja otra vez · se devuelven</li>
  </ol>
</figure>

A eso lo llamamos **escalado**, y cuando ocurre solo:

<p class="term">Autoscaling</p>

La idea es tener capacidad cuando hace falta y dejar de pagarla —y de ocuparla— cuando deja de hacer falta.

### Primera tarea · ¿Está sobredimensionado?

| Caso | Situación | ¿Es razonable? ¿Por qué? |
| ---- | --------- | ------------------------ |
| A | Web de una academia: entre 5 y 20 usuarios simultáneos, sobre 8 servidores de 32 GB cada uno | |
| B | Tienda online: 1.000 usuarios habituales, 50.000 en Black Friday. ¿Mantendríais infraestructura para 50.000 todo el año? | |
| C | Servidor de pruebas que se usa de 08:00 a 15:00 y está encendido 24 × 7 | |
| D | Máquina virtual sin tráfico desde hace seis meses. ¿Qué haríais antes de eliminarla? | |

El caso D tiene truco, y es el que más discusión suele dar: «no recibe tráfico» no es lo mismo que «no sirve para nada».

### Recursos olvidados

En cloud es facilísimo acabar acumulando máquinas antiguas, discos sin conectar, snapshots, IP reservadas, entornos de pruebas, backups y servicios duplicados. Y olvidarse de todos ellos, porque nada avisa: siguen funcionando, siguen cobrándose y nadie los mira.

Por eso las empresas hacen inventarios y revisiones periódicas. Y por eso hay una pregunta que conviene hacerse **antes** de crear cualquier recurso:

> **¿Cómo sabremos, dentro de seis meses, si todavía hace falta?**

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Entiendes que cloud sigue dependiendo de infraestructura física.</li>
    <li>Sabes explicar right-sizing sin reducirlo a «gastar menos».</li>
    <li>Sabes qué problema resuelve el autoscaling.</li>
    <li>Sabes nombrar cuatro tipos de recurso que se quedan olvidados.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué significa right-sizing?</li>
    <li>¿Qué riesgo tiene dimensionar por debajo?</li>
    <li>Una VM sin tráfico desde hace medio año. ¿La borráis?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Ajustar los recursos a la carga real: ni de más ni de menos.</p>
  <p>2 · Lentitud, errores y caídas, justo cuando llega más gente. Una web caída no es sostenible, es una web caída.</p>
  <p>3 · Todavía no. Antes hay que averiguar qué hace: puede ser un servicio que solo se usa una vez al año, una dependencia de otro sistema o el único sitio donde vive un dato.</p>
</details>

---

## Sesión 2 · ¿Hay que guardarlo todo para siempre?

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> El ciclo de vida del dato y políticas de retención: almacenamiento en caliente vs frío, acumulación de datos oscuros (<em>dark data</em>) y costes ambientales/seguridad.</li>
    <li><strong>2. Haz:</strong> Diseña una política de retención y archivado para logs, backups y registros históricos de la empresa.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall sobre ciclo de vida y gestión de datos.</li>
  </ol>
</div>

### Los datos también ocupan infraestructura

Una aplicación guarda 100 GB. No parece mucho. Pero rara vez es solo eso:

<figure class="diagram">
  <figcaption>Lo que de verdad ocupa un dato</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Datos originales</li>
    <li>Backup</li>
    <li>Réplica</li>
    <li>Histórico</li>
  </ol>
</figure>

Guardar datos tiene ventajas reales: análisis, auditorías, recuperación, inteligencia artificial, atención al cliente, cumplimiento legal. No queremos borrar cosas solo porque ocupen.

Pero guardarlo todo para siempre tampoco es una política. Logs conservados quince años cuando nadie consulta nada anterior a noventa días no son prudencia: son una decisión que nadie tomó.

### El ciclo de vida del dato

<figure class="diagram">
  <figcaption>Un dato también tiene etapas</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Crear</li>
    <li>Utilizar</li>
    <li>Almacenar</li>
    <li>Consultar</li>
    <li>Archivar</li>
    <li>Eliminar</li>
  </ol>
</figure>

Y no todos se usan igual:

<div class="compare-pair">
  <div>
    <p class="compare-label">Hot data</p>
    <p class="compare-body">Se consulta a menudo. Necesita acceso rápido, y ese acceso cuesta.</p>
  </div>
  <div>
    <p class="compare-label">Cold data</p>
    <p class="compare-body">Casi nunca se toca. Puede vivir en almacenamiento más lento y más barato.</p>
  </div>
</div>

### Una política de retención

<p class="term">Política de retención</p>

Responde a una pregunta por cada tipo de dato: ¿cuánto tiempo lo conservamos, y qué pasa después?

| Tipo de dato | Retención de ejemplo |
| ------------ | -------------------- |
| Logs operativos | 90 días |
| Backups diarios | 30 días |
| Backups mensuales | 12 meses |

Las cifras dependen del contexto. Lo que no depende del contexto es que **exista la decisión y esté escrita**.

Y no se decide solo por sostenibilidad: hay datos que deben conservarse por legislación, contratos, seguridad, auditorías o necesidades del negocio. La política equilibra las cuatro cosas.

### Segunda tarea · ¿Guardarías esto?

Para cada caso: **mantener**, **archivar**, **eliminar** o **investigar primero**. Y el motivo.

<dl class="answer">
  <dt>A · Logs técnicos de hace 7 años, sin obligación conocida, que nadie consulta</dt>
  <dd></dd>
  <dt>B · Facturas de clientes</dt>
  <dd></dd>
  <dt>C · Fotos temporales usadas para generar miniaturas, ya generadas</dt>
  <dd></dd>
  <dt>D · Un backup antiguo, sin saber si existe otro válido</dt>
  <dd></dd>
  <dt>E · Datos personales de usuarios que se fueron hace años</dt>
  <dd></dd>
</dl>

En el caso E hay algo más que sostenibilidad. ¿Qué es, y en qué dirección empuja?

<p class="write-line"></p>

<details class="aside aside--help">
  <summary>Estoy atascado · no sé si puedo borrar algo</summary>
  <p>Si dudáis, la respuesta casi siempre es «investigar primero». Pero investigar tampoco es no hacer nada: es responder a estas preguntas.</p>
  <ol>
    <li>¿Existe una obligación legal o contractual de conservarlo? Si la hay, se acabó la conversación.</li>
    <li>¿Alguien lo ha consultado en el último año? Si nadie lo sabe, eso ya es un hallazgo.</li>
    <li>¿Es la única copia? Borrar el único backup válido no es optimizar.</li>
    <li>¿Se puede reconstruir a partir de otra cosa? Las miniaturas sí; el original no.</li>
    <li>¿Son datos personales? Entonces conservarlos de más también es un riesgo, no solo un coste.</li>
    <li>Si sigue sin estar claro: archivar en almacenamiento frío y poner una fecha de revisión. Eso es una decisión; dejarlo donde está, no.</li>
  </ol>
</details>

### Tercera tarea · El almacenamiento de PixelStore

Revisando su infraestructura, PixelStore encuentra esto. Decidid qué hacer con cada cosa y por qué. Ahora sí tenéis las herramientas: ciclo de vida del dato, hot y cold, y política de retención.

| Recurso          | Mantener / archivar / eliminar / investigar | Motivo |
| ---------------- | ------------------------------------------- | ------ |
| Máquinas virtuales que nadie usa | | |
| Logs de hace cinco años | | |
| Un backup que se sabe necesario | | |
| Un backup duplicado | | |
| Almacenamiento de proyectos antiguos | | |
| Datos de clientes que se dieron de baja | | |

Y una tentación que conviene nombrar: **no se eliminan datos solo para ahorrar recursos**. La última fila no es como las demás.

<div class="rule">
  <p class="rule-label">Aquí ya no decide solo el criterio técnico</p>
  <p>En cuanto aparecen datos personales, la decisión deja de ser vuestra del todo. El <strong>RGPD</strong> establece dos principios que afectan directamente a lo que estáis haciendo:</p>
  <p><strong>Limitación del plazo de conservación.</strong> Los datos personales no se guardan indefinidamente por si acaso: se conservan el tiempo necesario para la finalidad por la que se recogieron. «Quizá algún día sirvan para entrenar algo» no es una finalidad.</p>
  <p><strong>Minimización.</strong> Se recogen los datos adecuados y limitados a lo necesario. Guardar treinta campos cuando la aplicación usa cinco no es solo desperdicio de almacenamiento: es un problema de cumplimiento y, si hay una brecha, de daño.</p>
  <p>Fijaos en lo que ocurre aquí: por una vez, la sostenibilidad y la normativa empujan en la misma dirección. Menos datos guardados es menos infraestructura y también menos riesgo.</p>
</div>

### Datos duplicados

<p class="single-node single-node--mono">clientes-final.csv · clientes-final2.csv · clientes-definitivo.csv · clientes-definitivo-bueno.csv</p>

Parece un chiste, y en organizaciones grandes es el día a día. Multiplica el almacenamiento, la confusión, el riesgo y el mantenimiento. Organizar los datos también es usar mejor los recursos.

### «Guardémoslo por si sirve para una IA»

Es la justificación de moda, y suele ser mala. Antes de aceptarla, seis preguntas:

* ¿Tenemos permiso para usarlos con esa finalidad?
* ¿Tienen calidad suficiente?
* ¿Son relevantes para algo concreto?
* ¿Existe una finalidad definida, o solo una intuición?
* ¿Cuánto cuesta conservarlos hasta entonces?
* ¿Qué riesgo generamos mientras tanto?

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Entiendes que almacenar consume recursos, y que un dato ocupa más de una vez.</li>
    <li>Conoces el ciclo de vida del dato y distingues hot de cold.</li>
    <li>Sabes escribir una política de retención con sus plazos.</li>
    <li>Sabes qué comprobar antes de borrar algo.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué es una política de retención?</li>
    <li>¿Por qué «quizá sirva para una IA» no basta para guardar algo indefinidamente?</li>
    <li>¿Qué diferencia hay entre archivar y eliminar?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · La regla que define cuánto tiempo se conserva cada tipo de dato y qué ocurre después.</p>
  <p>2 · Porque hay que mirar utilidad real, permiso, calidad, coste y riesgo. Guardar datos personales sin finalidad no es previsión, es exposición.</p>
  <p>3 · Archivar lo mueve a un almacenamiento más lento y barato, y se puede recuperar. Eliminar es irreversible.</p>
</details>

---

## Sesión 3 · ¿Hace falta de verdad la IA?

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> El coste computacional, hídrico y energético de la IA (entrenamiento vs inferencia) y la regla de adecuación tecnológica (reglas simples vs modelos fundacionales).</li>
    <li><strong>2. Haz:</strong> Evalúa los casos de uso de IA en PixelStore y determina cuándo un modelo ligero o un algoritmo determinista es más sostenible y eficaz.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall de la sesión 3.</li>
  </ol>
</div>

### Una herramienta, no una respuesta

Sabemos usar IA para programar, analizar datos, clasificar, generar texto, resumir, buscar y automatizar. La pregunta de esta sesión es otra:

> **¿Hay que usar IA siempre que se pueda?**

No. Queremos comprobar si alguien es mayor de edad y tenemos su edad. Esto lo resuelve:

```javascript
if (edad >= 18) { ... }
```

No hace falta un modelo.

### Elegir la herramienta proporcional al problema

<figure class="diagram">
  <figcaption>La escalera: se baja un peldaño solo cuando el anterior no llega</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 440" role="img" aria-labelledby="esc-title esc-desc" preserveAspectRatio="xMidYMid meet">
    <title id="esc-title">Escalera de decisión tecnológica</title>
    <desc id="esc-desc">Ante un problema se comprueba si basta una regla; si no, si existe un algoritmo tradicional; si no, si hace falta aprender de los datos con un modelo; y solo al final, si hace falta un modelo generativo. Cada respuesta afirmativa sale de la escalera.</desc>
    <defs>
      <marker id="esc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 170 46 L 170 86" marker-end="url(#esc-arrow)" />
      <path d="M 170 122 L 170 162" marker-end="url(#esc-arrow)" />
      <path d="M 170 198 L 170 238" marker-end="url(#esc-arrow)" />
      <path d="M 170 274 L 170 314" marker-end="url(#esc-arrow)" />
      <path d="M 300 104 L 440 104" marker-end="url(#esc-arrow)" />
      <path d="M 300 180 L 440 180" marker-end="url(#esc-arrow)" />
      <path d="M 300 256 L 440 256" marker-end="url(#esc-arrow)" />
      <path d="M 300 332 L 440 332" marker-end="url(#esc-arrow)" />
    </g>
    <text class="diagram-label" x="370" y="96">Sí</text>
    <text class="diagram-label" x="370" y="172">Sí</text>
    <text class="diagram-label" x="370" y="248">Sí</text>
    <text class="diagram-label" x="370" y="324">Sí</text>
    <text class="diagram-label" x="186" y="146">No</text>
    <text class="diagram-label" x="186" y="222">No</text>
    <text class="diagram-label" x="186" y="298">No</text>
    <g class="diagram-node">
      <rect x="40" y="10" width="260" height="36" rx="3" />
      <text x="170" y="33">Problema</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="40" y="86" width="260" height="36" rx="3" />
      <text x="170" y="109">¿Basta una regla?</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="40" y="162" width="260" height="36" rx="3" />
      <text x="170" y="185">¿Hay un algoritmo clásico?</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="40" y="238" width="260" height="36" rx="3" />
      <text x="170" y="261">¿Hay que aprender de datos?</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="40" y="314" width="260" height="36" rx="3" />
      <text x="170" y="337">¿Hay que generar contenido?</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="440" y="86" width="250" height="36" rx="3" />
      <text x="565" y="109">Una condición, una regex</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="440" y="162" width="250" height="36" rx="3" />
      <text x="565" y="185">Algoritmo tradicional</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="440" y="238" width="250" height="36" rx="3" />
      <text x="565" y="261">Modelo de clasificación</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="440" y="314" width="250" height="36" rx="3" />
      <text x="565" y="337">Modelo generativo</text>
    </g>
    <text class="diagram-label diagram-label--accent" x="360" y="400">y en cada peldaño, solo si el beneficio lo justifica</text>
  </svg>
</figure>

| Problema | Peldaño razonable |
| -------- | ----------------- |
| ¿Este código postal tiene cinco cifras? | Una expresión regular |
| ¿Este correo es spam, según muchas señales? | Un modelo de clasificación |
| Resumir veinte páginas de texto | Un modelo generativo |
| Sumar 247 y 538 | Una suma |

### El tamaño del modelo también cuenta

Si dos modelos resuelven la tarea y uno es mucho más pequeño, conviene preguntarse si de verdad hace falta el grande. Pero no hay regla universal: uno mayor puede funcionar mejor, cometer menos errores o habilitar funciones que el pequeño no da. La pregunta sigue siendo qué necesita **esta** aplicación.

### Tokens

Los modelos de lenguaje procesan el texto en unidades llamadas:

<p class="term">Tokens</p>

Más texto enviado significa más procesamiento. Enviar información innecesaria genera trabajo innecesario, exactamente igual que transferir una imagen de 4000 px para mostrarla a 300.

Si tenemos un documento de 500 páginas y queremos el número de factura de la página 3, mandar las 500 páginas es la versión moderna del mismo error. Primero se busca lo relevante, después se pregunta.

Y lo mismo con lo que pedimos de vuelta: generar veinte alternativas cuando necesitamos una, o una imagen 4K para mostrarla a 300 × 200 px. Vuelve el principio de la unidad anterior:

> **No procesar lo que no necesitamos.**

### Cuarta tarea · ¿Usarías IA?

De cada caso: regla, algoritmo, modelo pequeño o modelo generativo. Y por qué.

<dl class="answer">
  <dt>A · Comprobar que una contraseña tiene al menos 12 caracteres</dt>
  <dd></dd>
  <dt>B · Resumir 200 comentarios de clientes</dt>
  <dd></dd>
  <dt>C · Calcular el IVA</dt>
  <dd></dd>
  <dt>D · Clasificar miles de solicitudes de soporte por su contenido</dt>
  <dd></dd>
  <dt>E · Generar una descripción comercial distinta para 5.000 productos</dt>
  <dd></dd>
  <dt>F · Decidir si un usuario puede entrar en <code>/admin</code></dt>
  <dd></dd>
</dl>

El caso F no es una cuestión de eficiencia, es de seguridad: una decisión de autorización tiene que ser determinista y auditable. Si os ha costado verlo, volved a UD6 de Digitalización.

<details class="aside aside--help">
  <summary>Estoy atascado · todas mis respuestas acaban en IA</summary>
  <ol>
    <li>Preguntaos qué entrada tiene el problema. Si es un número o un formato fijo, casi nunca hace falta un modelo.</li>
    <li>Preguntaos si podríais escribir las reglas completas. No unas cuantas: todas, y de forma que sigan valiendo dentro de un año. Si podéis, escribidlas.</li>
    <li>Si la lista de reglas no acaba nunca, o cambia cada mes, o nadie sabe enunciarlas aunque reconozca los casos al verlos, ahí es donde tiene sentido aprender la función a partir de datos.</li>
    <li>Preguntaos si os importa poder explicar la decisión. Cuanto más lo necesitéis, más arriba en la escalera.</li>
    <li>Y una comprobación final: si la solución falla, ¿qué pasa? Cuanto peor sea la consecuencia, menos margen hay para algo probabilístico.</li>
  </ol>
</details>

### La IA no afecta solo al medio ambiente

Elegir usar IA toca las tres dimensiones a la vez:

| Dimensión | Lo que hay que mirar |
| --------- | -------------------- |
| Ambiental | Procesamiento, infraestructura, hardware, energía |
| Social | Sesgos, accesibilidad, impacto sobre los usuarios afectados |
| Gobernanza | Privacidad, responsabilidad, proveedores, transparencia |

No usar IA no es ser menos moderno. Puede ser, sencillamente, haber elegido bien.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 3</p>
  <ul class="checklist">
    <li>Sabes recorrer la escalera de decisión y explicar cada peldaño.</li>
    <li>Tienes los seis casos resueltos y justificados.</li>
    <li>Entiendes qué es un token y por qué el contexto que envías cuesta.</li>
    <li>Sabes decir qué dimensiones ASG toca una decisión sobre IA.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Cuál es el primer peldaño de la escalera?</li>
    <li>¿Por qué enviar un documento entero a un modelo puede ser un error?</li>
    <li>El modelo más potente, ¿es siempre la mejor opción?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Preguntarse si basta con una regla. La mayoría de los problemas se caen ahí.</p>
  <p>2 · Porque todo lo que se envía se procesa. Buscar antes la parte relevante hace el mismo trabajo con una fracción del coste.</p>
  <p>3 · No. La mejor opción es la que cumple la tarea suficientemente bien con una complejidad y unos recursos razonables.</p>
</details>

---

## Sesión 4 · Arquitectos tecnológicos

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Cómo integrar sostenibilidad en el diseño de arquitecturas cloud, pipelines de datos y modelos de IA.</li>
    <li><strong>2. Haz:</strong> Rediseña la infraestructura de PixelStore respondiendo a los 7 casos planteados y dimensionando de forma eficiente.</li>
    <li><strong>3. Entrega:</strong> Entrega el diagrama de arquitectura sostenible y la justificación técnica de costes y emisiones.</li>
  </ol>
</div>

### El reto · PixelStore

Volvemos a la tienda. Ya conocéis su web, sus barreras y su hardware; hoy toca lo que hay debajo. La dirección quiere modernizar la infraestructura y usar más inteligencia artificial, y vuestra misión es **proponer soluciones proporcionadas**.

No puntúa más quien use más cloud, más servidores, más datos o más IA. Puntúa más quien elige la solución adecuada al problema y sabe decir por qué descartó las otras.

### Los siete casos

| # | Caso | Situación |
| - | ---- | --------- |
| 1 | Web corporativa | La web institucional, distinta de la tienda: 3.000 visitas al mes sobre 4 máquinas permanentemente activas, al 5 % de CPU y 12 % de RAM |
| 2 | Black Friday | La tienda: 2.000 usuarios simultáneos habituales, 40.000 en campaña. Dirección quiere infraestructura para 40.000 todo el año |
| 3 | Logs | 500 GB al mes, conservados indefinidamente. Se consultan los últimos 30 días |
| 4 | Backups | Backup completo diario, todos conservados desde hace 6 años |
| 5 | Atención al cliente | 20.000 mensajes al mes a clasificar en cuatro categorías. Dirección quiere «el modelo generativo más potente» |
| 6 | Contraseñas | Dirección propone un LLM para decidir si una contraseña cumple los requisitos |
| 7 | Documentación | Miles de páginas. Quieren preguntar «¿cómo se configura el sistema X?» |

### Quinta tarea · Resolver los siete casos

El primero lo hacemos juntos, con el razonamiento a la vista.

<p class="stage">Paso 1 · Te enseño uno</p>

<dl class="worked">
  <dt>¿Qué dice el dato?</dt>
  <dd>3.000 visitas al mes son unas 100 al día. Cuatro máquinas al 5 % de CPU están, entre las cuatro, haciendo el trabajo de menos de una.</dd>
  <dt>¿Qué investigaría antes de tocar nada?</dt>
  <dd>Por qué hay cuatro. Puede ser alta disponibilidad, un entorno de preproducción metido en el mismo grupo, o que alguien las creó y nadie las revisó. Las tres tienen respuestas distintas.</dd>
  <dt>¿Reduzco directamente?</dt>
  <dd>No. Si dos de las cuatro están para que la web no se caiga cuando una falla, quitarlas ahorra recursos y compra una caída.</dd>
  <dt>Propuesta</dt>
  <dd>Una web corporativa de 3.000 visitas es contenido casi estático: sitio estático servido desde almacenamiento con CDN, o un plan gestionado pequeño. Cero máquinas que administrar directamente — que no es lo mismo que cero máquinas: siguen existiendo, pero las opera el proveedor y se comparten con otros.</dd>
  <dt>¿Qué he ganado y qué he perdido?</dt>
  <dd>Gano coste, mantenimiento y recursos. Pierdo control sobre el servidor, que en una web corporativa no me hacía falta.</dd>
</dl>

Fijaos en el orden. La segunda fila es la que separa una propuesta profesional de un recorte: **antes de reducir, averiguar por qué está así**. Y la última obliga a nombrar lo que se pierde, porque toda decisión pierde algo.

<p class="stage stage--guided">Paso 2 · Lo hacemos juntos</p>

El caso 2, con las mismas cinco preguntas. Pista: la respuesta no es ni mantener 40.000 todo el año ni dimensionar para 2.000 y cruzar los dedos.

<dl class="answer">
  <dt>¿Qué dice el dato?</dt>
  <dd></dd>
  <dt>¿Qué investigaría antes?</dt>
  <dd></dd>
  <dt>Propuesta</dt>
  <dd></dd>
  <dt>¿Qué gano y qué pierdo?</dt>
  <dd></dd>
</dl>

<p class="stage stage--solo">Paso 3 · Hazlo tú</p>

Los cinco restantes.

| Caso | Problema | Propuesta | ¿Por qué? |
| ---- | -------- | --------- | --------- |
| Logs | | | |
| Backups | | | |
| Soporte | | | |
| Contraseñas | | | |
| Documentación | | | |

### Sexta tarea · Las cuatro dimensiones

Elegid tres casos y decid cómo afecta vuestra solución a cada cosa:

| Dimensión | Efecto |
| --------- | ------ |
| Coste | |
| Rendimiento | |
| Sostenibilidad | |
| Complejidad | |

Una solución sostenible no se juzga solo por lo ambiental. También tiene que funcionar, ser viable y poder mantenerse. Una arquitectura preciosa que nadie sabe operar no es sostenible: es un problema aplazado.

### Séptima tarea · La solución mínima suficiente

Coged uno de los casos y proponed tres soluciones: **A**, la más sencilla que podría funcionar; **B**, algo más elaborada; **C**, la más avanzada que se os ocurra.

| | A · Sencilla | B · Intermedia | C · Compleja |
| ----------- | - | - | - |
| Coste       | | | |
| Complejidad | | | |
| Recursos    | | | |
| Beneficio   | | | |

Y entonces la pregunta que importa: **¿cuál usaríais de verdad?**

No hay una opción preferida de antemano. Elegid la solución mínima que satisfaga los requisitos, y escribid el motivo por el que descartáis las otras dos. Ese motivo vale más que la elección.

### Octava tarea · Que la IA cuestione vuestra solución

<div class="prompt">
  <p class="prompt-label">Prompt estructurado</p>
  <p class="flow-role">Tarea</p>
  <p>Analiza críticamente esta solución. No propongas una alternativa más compleja salvo que exista una razón clara.</p>
  <p class="flow-role">Busca</p>
  <ol>
    <li>Infraestructura sobredimensionada.</li>
    <li>Recursos innecesarios.</li>
    <li>Datos almacenados sin justificación.</li>
    <li>Uso innecesario de IA.</li>
    <li>Riesgos de haber dimensionado por debajo.</li>
  </ol>
</div>

Clasificad sus recomendaciones como aceptar, rechazar o investigar. Y después, un experimento:

> Propón la solución tecnológicamente más sofisticada posible para este problema.

Comparadla con la vuestra y respondedos: **¿es realmente mejor?** Guardad esa comparación: es material directo para la entrega.

---

### Producto final

Cada pareja entrega **una única página o diapositiva** con cinco bloques.

#### A · Tres decisiones

| Problema | Decisión |
| -------- | -------- |
|          |          |
|          |          |
|          |          |

#### B · Justificación

De cada decisión: la necesidad, la solución, los recursos que usa y las alternativas descartadas.

#### C · Una decisión sobre datos

Una política de retención sencilla, con sus plazos.

#### D · Una decisión sobre IA

El problema, la solución elegida y por qué usaríais o **no** usaríais IA.

#### E · Una recomendación de IA rechazada

Qué recomendó el asistente y por qué no la aceptasteis.

### Presentación

Unos **3 minutos** por pareja, para responder a cuatro preguntas:

* ¿Dónde encontrasteis el mayor sobredimensionamiento?
* ¿Qué dato dejaríais de almacenar indefinidamente?
* ¿En qué caso NO usaríais IA?
* ¿Cuál es vuestra principal decisión, y por qué?

### Evaluación

| Criterio                                        | Puntos |
| ----------------------------------------------- | -----: |
| Comprensión del uso de recursos cloud           |    1,5 |
| Aplicación de right-sizing y escalado           |    1,5 |
| Gestión razonada del ciclo de vida de los datos |      2 |
| **Elección proporcional de soluciones de IA**   |  **2** |
| Análisis de coste, rendimiento y sostenibilidad |    1,5 |
| Uso crítico de IA                               |      1 |
| Claridad de la entrega                          |    0,5 |

Durante la exposición se preguntará **individualmente** a cualquiera de los dos miembros por una decisión del trabajo.

No puntúa más quien propone Kubernetes, microservicios, IA y veinte servidores. Tampoco quien propone siempre usar menos. Buscamos **la solución adecuada al problema**, y la capacidad de defender por qué lo es.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · entrega</p>
  <ul class="checklist">
    <li>Las decisiones y su justificación están en vuestro repositorio de evidencias.</li>
    <li>Habéis justificado los recursos cloud que proponéis.</li>
    <li>No habéis reducido infraestructura sin mirar los picos.</li>
    <li>Tenéis una política de retención escrita, con plazos.</li>
    <li>Habéis comprobado las obligaciones antes de proponer borrar nada.</li>
    <li>Habéis cuestionado si la IA hacía falta en cada caso.</li>
    <li>Habéis comparado al menos una alternativa más sencilla.</li>
    <li>Habéis rechazado razonadamente al menos una propuesta del asistente.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué significa right-sizing?</li>
    <li>¿Por qué no mantener todos los recursos cloud permanentemente activos?</li>
    <li>¿Qué es una política de retención?</li>
    <li>¿Por qué «quizá sirva para IA» no basta para guardar datos indefinidamente?</li>
    <li>¿El modelo más potente es siempre la mejor opción?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Ajustar los recursos a la necesidad real del sistema, por arriba y por abajo.</p>
  <p>2 · Porque hay capacidad que solo hace falta a ratos, y el resto del tiempo cuesta dinero y ocupa infraestructura sin dar nada.</p>
  <p>3 · La regla que define cuánto se conserva cada tipo de dato y qué pasa después.</p>
  <p>4 · Porque hay que valorar utilidad real, privacidad, normativa, coste, calidad y riesgo. Sin finalidad concreta es acumulación, no previsión.</p>
  <p>5 · No. La mejor es la que cumple la tarea con una complejidad y unos recursos proporcionados.</p>
</details>

---

## Lo que debes recordar

### Las tres preguntas

Antes de diseñar un sistema:

| Ámbito | La pregunta |
| ------ | ----------- |
| Cloud | ¿Cuántos recursos necesito de verdad, contando los picos? |
| Datos | ¿Qué necesito guardar, y durante cuánto tiempo? |
| IA | ¿Hace falta inteligencia artificial para esto? |

### El orden correcto

<figure class="diagram">
  <figcaption>Cómo se decide</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Necesidad</li>
    <li>La solución más sencilla que funcione</li>
    <li>Medir</li>
    <li>Escalar si hace falta</li>
  </ol>
</figure>

Y no al revés:

<figure class="diagram">
  <figcaption>Cómo no se decide</figcaption>
  <ol class="flow flow--row flow--chain flow--before">
    <li>La tecnología más potente</li>
    <li>Buscar dónde meterla</li>
  </ol>
</figure>

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Right-sizing | Ajustar los recursos a la necesidad real, ni de más ni de menos |
| Infrautilización | Tener recursos que apenas se usan |
| Escalado | Subir o bajar capacidad según la carga |
| Autoscaling | Que ese ajuste ocurra solo |
| Recurso ocioso | Algo creado que ya no aporta nada y nadie ha revisado |
| Ciclo de vida del dato | De crear a eliminar, pasando por archivar |
| Retención | Cuánto tiempo se conserva algo, y por qué |
| Hot data | Lo que se consulta a menudo y necesita acceso rápido |
| Cold data | Lo que casi nunca se toca y puede vivir más barato |
| Backup | La copia que existe para poder recuperar |
| Token | La unidad en la que un modelo de lenguaje procesa el texto |
| Modelo generativo | El que produce contenido nuevo: texto, imágenes, código |
| Solución proporcional | Aquella cuya complejidad encaja con el problema |
| Sobredimensionamiento | Usar más capacidad de la que hace falta |
| Mínimo suficiente | La solución más sencilla que cumple los requisitos |

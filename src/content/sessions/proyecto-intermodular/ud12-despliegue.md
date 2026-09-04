---
title: "Despliegue"
label: "UD12 · Publicar"
section: "ud-12"
order: 12
lang: "es"
summary: "Llevar frontend, backend y base de datos a producción con configuración segura, dominio, HTTPS, logs y comprobaciones finales."
duration: "6 horas · 2 semanas · 2 sesiones"
modality: "Laboratorio de producción · publicación real"
deliverable: "Aplicación accesible públicamente."
date: "2026-08-31"
outcomes:
  - "Distinguir configuración de desarrollo y producción."
  - "Construir y desplegar frontend, backend y base de datos."
  - "Configurar dominio, HTTPS y variables de entorno."
  - "Comprobar la aplicación pública y utilizar sus logs."
requirements:
  - "Release candidate aprobada."
  - "Acceso a los servicios de despliegue seleccionados."
priorKnowledge:
  - "Cloud y despliegue del módulo de Digitalización."
  - "Build y configuración de Angular y Spring Boot."
---

<p class="lead">El producto deja de ser una captura o una ejecución local. Debe tener una URL pública, una configuración reproducible y evidencias de que funciona en producción.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje bajo. Se comparten criterios y enlaces de referencia; cada arquitectura puede necesitar una estrategia de despliegue distinta.</p>
</div>

<div class="rule">
  <p class="rule-label">Las dos semanas, de un vistazo</p>
  <p>Semana 23, llevar la candidata a producción: configuración, construcción, base de datos y publicación. Semana 24, dominio, cifrado, registro de actividad, comprobación final y plan para el día de la defensa. La mecánica concreta se estudia en Despliegue de Aplicaciones Web y en Digitalización; aquí se decide y se deja constancia.</p>
</div>

## Sesión 23 · De local a producción

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> En qué se diferencia producción de vuestro portátil, por qué la configuración no puede estar en el código y qué es una construcción reproducible.</li>
    <li><strong>2. Haz:</strong> Prepara la configuración, la base de datos de producción y publica la candidata completa.</li>
    <li><strong>3. Comprueba:</strong> Responde a las preguntas de recall y completa el checkpoint de la sesión 23.</li>
  </ol>
</div>

### Esto ya lo hicisteis una vez

En la semana 16 se desplegó una versión mínima, y para eso servía: para que lo que se rompiera se rompiera barato. Lo de hoy es distinto en una cosa importante:

<div class="compare-pair">
  <div>
    <p class="compare-label">Semana 16</p>
    <p class="compare-body">Un experimento. Daba igual que fuera feo, que los datos fueran de prueba y que se rompiera. Servía para descubrir qué falla al salir del portátil.</p>
  </div>
  <div>
    <p class="compare-label">Semana 23</p>
    <p class="compare-body">La versión que se va a defender. Tiene que estar disponible, tiene que ser reproducible y tiene que poder repararse si algo falla el día menos oportuno.</p>
  </div>
</div>

El equipo que hizo bien la semana 16 hoy tiene una sesión tranquila. El que la saltó descubre hoy, a tres semanas del final, todo lo que la tabla de aquella sesión anunciaba.

### Producción no es vuestro portátil

<p class="term">Entorno</p>

El conjunto de máquina, configuración y datos sobre el que se ejecuta la aplicación. El mismo código se comporta distinto en entornos distintos, y esa es la causa de casi todos los sustos de estas semanas.

| | Desarrollo | Producción |
| --- | --- | --- |
| **Datos** | Inventados, se pueden borrar | Reales para quien los usa; borrarlos es un incidente |
| **Configuración** | En vuestro portátil, a veces sin escribir | En variables del entorno, sin tocar el código |
| **Errores** | Se ven en la consola | Solo existen si quedan registrados |
| **Acceso** | Vosotros | Cualquiera con la URL, incluido quien busca fallos |
| **Reiniciar** | Gratis | Deja el servicio caído mientras tanto |
| **Versión** | La que tenéis abierta | Una concreta, marcada, que hay que saber cuál es |

La última fila es la que más se descuida: **hay que saber en todo momento qué versión está publicada**. Sin eso, cuando alguien informe de un fallo no sabréis si está corregido o no.

### La configuración no va en el código

Es la regla que más veces se rompe y la que más problemas causa en las dos direcciones.

<div class="compare-pair">
  <div>
    <p class="compare-label">Mal</p>
    <p class="compare-body">La dirección de la base de datos y su contraseña escritas en un fichero del proyecto. Funciona hasta que hay dos entornos, y además la credencial está en el repositorio para siempre.</p>
  </div>
  <div>
    <p class="compare-label">Bien</p>
    <p class="compare-body">La aplicación lee esos valores del entorno. En el repositorio solo hay un fichero de ejemplo con los nombres de las variables y valores falsos, el de la semana 14.</p>
  </div>
</div>

<div class="rule">
  <p class="rule-label">Qué va en variables de entorno</p>
  <p>Todo lo que cambia entre entornos o lo que es secreto: la conexión a la base de datos, las credenciales, la dirección pública del frontend, la del backend, y los orígenes permitidos. Lo que no cambia y no es secreto puede quedarse en el código; distinguirlo evita convertir el despliegue en un laberinto de treinta variables.</p>
</div>

### La construcción

<p class="term">Construcción</p>

El proceso que convierte el código fuente en lo que realmente se ejecuta o se sirve. No es una copia del proyecto: es un resultado distinto, optimizado, que hay que saber generar otra vez igual.

Dos exigencias, y las dos se comprueban:

<ol class="fill-in">
  <li>Se genera con un comando documentado en el README, y le sale igual a cualquiera del equipo.</li>
  <li>Se genera desde la rama principal, no desde el portátil de alguien con cambios sin subir.</li>
</ol>

La segunda parece obvia y es el origen del clásico «lo que está publicado no es lo que está en el repositorio», que en la defensa deja a un equipo sin saber explicar qué está enseñando.

### La base de datos de producción

Es la parte que más equipos improvisan, y la que peor se improvisa. Tres decisiones:

<dl class="worked">
  <dt>Cómo llega el esquema</dt>
  <dd>Las tablas de producción no se crean a mano ni se dejan a que la aplicación las genere sola. Tiene que existir algo, versionado en el repositorio, que cree el esquema desde cero. Si no, nadie podrá reconstruirlo, y vosotros tampoco dentro de un mes.</dd>
  <dt>Qué datos entran</dt>
  <dd>Hay que distinguir dos cosas que se confunden siempre: los <strong>datos iniciales</strong> que el producto necesita para funcionar —el catálogo de herramienta, la cuenta del responsable— y los <strong>datos de prueba</strong> de la semana 10. Los primeros son de producción; los segundos, no.</dd>
  <dt>Qué pasa si se pierde</dt>
  <dd>Hay que saber responder, aunque la respuesta sea «se puede volver a cargar el esquema y los datos iniciales en cinco minutos». Lo que no vale es no habérselo preguntado.</dd>
  <dt>Y una advertencia sobre los datos</dt>
  <dd>Si en la demostración va a haber personas usándolo de verdad, sus datos son datos personales reales. En este módulo lo razonable es que el entorno público funcione con datos inventados y que el uso real, si lo hay, se acuerde y se explique.</dd>
</dl>

### El orden de publicación

<figure class="diagram">
  <figcaption>En qué orden se publica</figcaption>
  <ol class="flow">
    <li><span class="flow-role">1</span>La base de datos, con su esquema y sus datos iniciales</li>
    <li><span class="flow-role">2</span>El backend, apuntando a ella por configuración</li>
    <li><span class="flow-role">3</span>Comprobar el backend solo, sin frontend, con una petición directa</li>
    <li><span class="flow-role">4</span>El frontend, apuntando al backend por configuración</li>
    <li><span class="flow-role">5</span>Permitir en el backend el origen desde el que el frontend llama</li>
    <li><span class="flow-role">6</span>Comprobar el recorrido completo desde el navegador</li>
  </ol>
</figure>

El paso 3 es el que ahorra la tarde. Si se publica todo de golpe y algo no funciona, hay tres sitios donde puede estar el problema; comprobando el backend solo, se descarta la mitad del sistema antes de empezar, exactamente como en la semana 15.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 23</p>
  <ul class="checklist">
    <li>Ninguna credencial ni dirección vive en el código; todo lo variable está en el entorno.</li>
    <li>La construcción se genera con un comando documentado, desde la rama principal.</li>
    <li>El esquema de la base de datos está versionado y se puede crear desde cero.</li>
    <li>Los datos iniciales están separados de los datos de prueba.</li>
    <li>El recorrido completo funciona desde el navegador, en la URL pública.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>¿Qué diferencia importante hay entre el despliegue de la semana 16 y el de hoy?</li>
    <li>¿Qué va en variables de entorno y qué puede quedarse en el código?</li>
    <li>¿Desde dónde se genera la construcción que se publica?</li>
    <li>¿Qué diferencia hay entre datos iniciales y datos de prueba?</li>
    <li>¿Por qué se comprueba el backend antes de publicar el frontend?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Aquello era un experimento; esto es la versión que se defiende, y tiene que estar disponible y ser reproducible.</p>
  <p>2 · Lo que cambia entre entornos o es secreto va al entorno; lo fijo y no secreto puede quedarse.</p>
  <p>3 · Desde la rama principal, nunca desde un portátil con cambios sin subir.</p>
  <p>4 · Los iniciales los necesita el producto para funcionar; los de prueba son inventados para probar.</p>
  <p>5 · Para descartar la mitad del sistema antes de buscar el fallo en tres sitios a la vez.</p>
</details>

---

## Sesión 24 · Dominio, observación y comprobación final

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> Por qué el cifrado no es opcional, qué se registra y qué no debe registrarse nunca, y cómo se sabe que el servicio sigue en pie.</li>
    <li><strong>2. Haz:</strong> Configura dominio y cifrado, revisa el registro de actividad, ejecuta la comprobación final en producción y prepara el plan para el día de la defensa.</li>
    <li><strong>3. Comprueba:</strong> Entrega la aplicación pública y revisa la evaluación.</li>
  </ol>
</div>

### Dominio y cifrado

Un dominio propio no es imprescindible para aprobar, pero cambia cómo se percibe el proyecto y cuesta muy poco. Lo que sí es imprescindible es el cifrado:

<div class="rule">
  <p class="rule-label">Por qué el cifrado no se negocia</p>
  <p>Sin él, cualquiera en la misma red puede leer lo que se envía, credenciales incluidas. Además, los navegadores restringen funciones a las páginas no cifradas y os aparecerán avisos en la demostración. Y si vuestro producto trata datos personales, cifrar el tráfico no es una buena práctica opcional: es una medida de seguridad exigible.</p>
</div>

Con el dominio y el cifrado configurados hay que revisar dos cosas que suelen quedar a medias: que la dirección sin cifrar redirija a la cifrada, y que no queden partes de la página cargándose sin cifrar, que anulan la protección y el navegador avisa de ello.

### Registro de actividad

<p class="term">Registro</p>

Lo que la aplicación deja escrito sobre lo que va haciendo. En producción es lo único que existe cuando algo falla: no hay una consola abierta donde mirar.

<div class="compare-pair">
  <div>
    <p class="compare-label">Qué se registra</p>
    <p class="compare-body">Que el servicio ha arrancado y con qué versión. Los errores, con lo suficiente para localizarlos. Las operaciones sensibles: quién cerró un préstamo ajeno y cuándo.</p>
  </div>
  <div>
    <p class="compare-label">Qué NO se registra nunca</p>
    <p class="compare-body">Contraseñas, ni siquiera al fallar un intento. Credenciales o identificadores de sesión. Datos personales que no hagan falta. El contenido completo de las peticiones «por si acaso».</p>
  </div>
</div>

<div class="rule">
  <p class="rule-label">El registro también es un fichero con datos dentro</p>
  <p>Todo lo que se escribe ahí se guarda, a veces mucho tiempo, y a veces lo puede leer más gente de la que creéis. Un registro lleno de datos personales es un problema de protección de datos aunque la base esté perfectamente cuidada. Registrad identificadores, no personas.</p>
</div>

### Cómo se sabe que sigue funcionando

Es la pregunta que casi ningún proyecto de ciclo se hace, y contestarla vale mucho en la defensa. Lo mínimo:

<ol class="fill-in">
  <li>Una dirección que responda si el servicio está vivo y diga qué versión está publicada.</li>
  <li>Una comprobación de que el backend llega a la base de datos, no solo de que el proceso está arrancado.</li>
  <li>La costumbre de abrir la URL pública una vez por semana hasta junio. Los servicios gratuitos se detienen, caducan y cambian de condiciones.</li>
</ol>

La tercera parece trivial y es la que evita el desastre clásico: llegar a la defensa y descubrir que el servicio lleva tres semanas parado.

### La comprobación final, en producción

El guion manual de la semana 21 se ejecuta ahora **sobre el entorno público**, no en local, y con el dispositivo real donde lo haya. Casi siempre aparece algo, porque producción no es el portátil:

| Lo que suele aparecer solo aquí | Por qué |
| ------------------------------- | ------- |
| Peticiones bloqueadas por el origen | El frontend cambió de dirección y nadie actualizó lo permitido |
| Fechas con desfase | El servidor está en otra zona horaria que vuestro portátil |
| La primera petición tarda muchísimo | El servicio gratuito estaba dormido y tarda en despertar |
| Rutas que dan error al recargar | El servidor de la aplicación no está devolviendo la página en rutas internas |
| Imágenes o recursos que no cargan | Estaban referenciados con una dirección local |

<dl class="answer">
  <dt>¿Qué apareció solo al ejecutar el guion en producción?</dt>
  <dd></dd>
  <dt>¿Está corregido, o declarado como limitación conocida?</dt>
  <dd></dd>
</dl>

### Corregir algo ya publicado

<div class="rule">
  <p class="rule-label">Producción no se toca a mano</p>
  <p>Si hay que corregir algo, se corrige en el repositorio, se vuelve a construir y se vuelve a publicar. Entrar al servidor a cambiar un fichero deja el proyecto en un estado que no está en ninguna parte, y a la primera republicación el arreglo desaparece sin que nadie sepa por qué.</p>
</div>

Y tras cada corrección, la regla de la semana 22: se vuelve a pasar el checklist entero, no solo lo corregido.

### El plan para el día de la defensa

El registro de riesgos de la semana 13 lo dejó anotado: la red del centro puede fallar. Toca convertirlo en algo preparado:

<ol class="fill-in">
  <li>El proyecto arranca en local con un comando y los datos iniciales cargados, comprobado en más de un portátil.</li>
  <li>Un vídeo corto del recorrido principal, grabado con el producto funcionando, por si no hay red en absoluto.</li>
  <li>Las direcciones y credenciales de demostración anotadas donde no dependan de tener internet para consultarlas.</li>
  <li>Comprobado que el servicio no se duerme, o sabido cuánto tarda en despertar para abrirlo antes de empezar.</li>
</ol>

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <p>Aplicación accesible públicamente.</p>
  <ul class="checklist">
    <li>URL pública funcionando, con tráfico cifrado y sin partes sin cifrar.</li>
    <li>Configuración fuera del código, con el fichero de ejemplo actualizado en el repositorio.</li>
    <li>Construcción reproducible, documentada, generada desde la rama principal.</li>
    <li>Esquema de base de datos versionado y creable desde cero, con los datos iniciales separados de los de prueba.</li>
    <li>Registro de actividad útil, sin contraseñas ni datos personales innecesarios.</li>
    <li>Forma de comprobar que el servicio está vivo y qué versión está publicada.</li>
    <li>Guion de comprobación final ejecutado en producción, con lo que apareció y qué se hizo.</li>
    <li>Documento de despliegue: qué servicios se usan, qué variables hacen falta y cómo se vuelve a publicar.</li>
    <li>Plan para el día de la defensa, con ejecución local comprobada y vídeo de respaldo.</li>
  </ul>
</div>

| Se valora | Qué se mira |
| --------- | ----------- |
| Que sea accesible | La URL funciona desde fuera del centro y desde un móvil ajeno |
| Que sea reproducible | Otra persona podría volver a desplegarlo con el documento |
| Que la configuración esté fuera | No hay secretos en el repositorio, ni en el histórico |
| Que se pueda diagnosticar | Hay registro, y no contiene lo que no debe |
| Que se haya comprobado allí | El guion se ejecutó en producción, no en local |
| Que haya plan B | La defensa no depende de que la red funcione |

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 3 minutos, sin mirar</p>
  <ol>
    <li>Nombra dos cosas que nunca deben aparecer en el registro.</li>
    <li>¿Por qué hay que abrir la URL pública una vez por semana?</li>
    <li>¿Por qué el guion final se ejecuta en producción y no en local?</li>
    <li>Hay que corregir algo publicado. ¿Se entra al servidor a cambiarlo?</li>
    <li>¿Qué dos cosas componen el plan B del día de la defensa?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Contraseñas e identificadores de sesión; tampoco datos personales innecesarios.</p>
  <p>2 · Porque los servicios gratuitos se detienen, caducan o cambian de condiciones, y el fallo se descubriría en junio.</p>
  <p>3 · Porque producción no es el portátil: orígenes, zonas horarias, rutas y recursos se comportan distinto.</p>
  <p>4 · No. Se corrige en el repositorio, se reconstruye y se vuelve a publicar.</p>
  <p>5 · Ejecución local comprobada con datos cargados, y un vídeo del recorrido principal.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la semana 25</p>
  <ul class="checklist">
    <li>Alguien de fuera del centro ha abierto la URL y ha completado una tarea.</li>
    <li>El documento de despliegue permite a otra persona repetir la publicación.</li>
    <li>El plan B está preparado y comprobado, no solo pensado.</li>
    <li>Traéis capturas del producto funcionando: son el material de la semana 25.</li>
  </ul>
</div>

---

## Lo que debes recordar

### El método

<figure class="diagram">
  <figcaption>De la candidata a la aplicación pública</figcaption>
  <ol class="flow">
    <li>Se separa lo que cambia entre entornos y se saca del código</li>
    <li>Se construye desde la rama principal, con un comando documentado</li>
    <li>Se crea el esquema desde cero, versionado, con sus datos iniciales</li>
    <li>Se publica por orden, comprobando el backend antes que el frontend</li>
    <li>Se cifra el tráfico y se revisa que no quede nada sin cifrar</li>
    <li>Se registra lo necesario y nunca lo que no debe guardarse</li>
    <li>Se comprueba el guion completo en producción, no en local</li>
    <li>Se prepara un plan B que no dependa de la red</li>
  </ol>
</figure>

Y las tres frases de la unidad:

> **La configuración no va en el código; los secretos, menos.**
>
> **En producción, un error solo existe si queda registrado.**
>
> **Producción no se toca a mano: se corrige, se construye y se vuelve a publicar.**

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Entorno | Máquina, configuración y datos sobre los que se ejecuta la aplicación |
| Variable de entorno | El valor que cambia entre entornos o es secreto, fuera del código |
| Construcción | El resultado ejecutable o servible que se genera desde el código fuente |
| Reproducible | Que cualquiera del equipo obtiene lo mismo con el comando documentado |
| Esquema versionado | La definición de las tablas guardada en el repositorio y creable desde cero |
| Datos iniciales | Los que el producto necesita para funcionar, distintos de los de prueba |
| Registro | Lo que la aplicación deja escrito, único rastro cuando algo falla en producción |
| Comprobación de vida | Una dirección que dice si el servicio responde y qué versión está publicada |
| Plan B | La forma de enseñar el producto si el día de la defensa no hay red |

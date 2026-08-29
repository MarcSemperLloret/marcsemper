---
title: "Desarrollo web y software sostenible"
label: "UD3 · Proyecto"
section: "ud-03"
order: 3
lang: "es"
summary: "Una web no necesita consumir más recursos de los necesarios para dar un buen servicio. Aprendemos a medir una página, detectar el desperdicio, optimizarla y demostrar con datos si de verdad la hemos mejorado."
duration: "7 horas · 7 sesiones"
modality: "Parejas"
deliverable: "Una página web optimizada y la comparación técnica antes/después que lo demuestra."
outcomes:
  - "Explicar por qué una página web consume recursos físicos."
  - "Medir el peso y las peticiones de una web, y saber leer esa medición."
  - "Identificar qué recursos transfieren más datos y cuáles sobran."
  - "Optimizar imágenes y contenido multimedia sin estropearlos."
  - "Detectar JavaScript, CSS, fuentes y terceros innecesarios."
  - "Explicar para qué sirven la caché y la compresión, y qué problema traen."
  - "Usar la IA para buscar optimizaciones, y rechazar las que no convengan."
  - "Comparar una web antes y después con datos comparables."
requirements:
  - "Chrome o Chromium, con DevTools y Lighthouse."
  - "Visual Studio Code y Git."
  - "GitHub Copilot u otro asistente de IA."
  - "PixelStore, el proyecto de partida. Se clona en la sesión 2."
priorKnowledge:
  - "El ciclo de vida y la idea de no gastar recursos de más (UD2)."
  - "Leer un diff y revisar lo que propone un agente (Digitalización, UD4)."
  - "Qué es un indicador y por qué hace falta una medida de partida (UD1)."
date: "2026-08-29"
---

<div class="checkpoint">
  <p class="checkpoint-label">La misión · siete pasos hasta una web demostrablemente mejor</p>
  <ol>
    <li>Entender qué consume una web.</li>
    <li>Medir el estado inicial y guardarlo.</li>
    <li>Optimizar imágenes y multimedia.</li>
    <li>Revisar JavaScript, CSS, fuentes y terceros.</li>
    <li>Entender caché, compresión y datos.</li>
    <li>Aplicar los cambios sobre el proyecto.</li>
    <li>Volver a medir y comprobar que nada se ha roto.</li>
  </ol>
</div>

## Sesión 1 · Una web también consume recursos

### ¿Qué vamos a aprender?

Cuando visitamos una web parece que solo pasa una cosa: escribimos una dirección y aparece la página. Lo que ocurre en realidad es esto:

<figure class="diagram">
  <figcaption>Lo que pasa entre la dirección y la pantalla</figcaption>
  <ol class="flow">
    <li>Navegador</li>
    <li>Internet</li>
    <li>Servidor</li>
    <li>Archivos</li>
    <li>Internet</li>
    <li>Navegador</li>
    <li>Procesamiento</li>
    <li>Pantalla</li>
  </ol>
</figure>

Para mostrar una página pueden transferirse HTML, CSS, JavaScript, imágenes, vídeos, fuentes, datos, publicidad y scripts de terceros. Y todo eso necesita almacenamiento, redes, servidores, procesamiento, dispositivos y electricidad.

#### Una idea importante

Imaginad dos páginas que ofrecen exactamente el mismo servicio:

<div class="compare-pair">
  <div>
    <p class="compare-label">Web A</p>
    <p class="compare-body">12 MB transferidos.</p>
  </div>
  <div>
    <p class="compare-label">Web B</p>
    <p class="compare-body">1,5 MB transferidos.</p>
  </div>
</div>

Si el usuario puede hacer exactamente lo mismo en las dos, ¿hacían falta los otros 10,5 MB? Probablemente no. Esa es la idea central de la unidad:

<p class="term">No transferir, almacenar ni procesar lo que no necesitamos</p>

#### Pero cuidado

Eso **no** significa que la web más pequeña sea siempre la mejor. Una web también tiene que ser útil, usable, atractiva, accesible, segura y mantenible.

El objetivo es **hacer lo mismo con razonablemente menos recursos, sin degradar el servicio**. Una web que pesa poco porque le hemos quitado la mitad del contenido no está optimizada: está rota.

---

### ¿Dónde se desperdician recursos?

| Desperdicio | Cómo se ve |
| ----------- | ---------- |
| Imágenes sobredimensionadas | Se muestra a 400 × 300 y se descarga a 6000 × 4000 |
| Formatos poco adecuados | 4 MB cuando otra versión casi idéntica pesa 300 KB |
| JavaScript innecesario | Una librería enorme para usar una única función |
| Vídeos automáticos | El usuario entra y empieza a bajarse un vídeo que quizá no quería ver |
| Scripts de terceros | Publicidad, analytics, mapas, chats, widgets, trackers |
| Fuentes de más | Cinco familias por cuatro pesos, cuando se usan dos |
| Datos innecesarios | La API devuelve 10.000 productos y el usuario ve 20 |

### Primera tarea · ¿Dónde mirarías?

Para cada situación, decid qué optimizaríais primero.

| Situación                                                  | Posible mejora |
| ---------------------------------------------------------- | -------------- |
| Imagen de 8 MB usada como miniatura                        |                |
| 15 fuentes diferentes                                      |                |
| Vídeo 4K que arranca solo                                  |                |
| La API devuelve 20.000 registros                           |                |
| Librería de 500 KB para mostrar una fecha                  |                |
| Mapa externo que se carga aunque nadie lo abra             |                |
| Imágenes fuera de pantalla que se cargan de inmediato      |                |

---

### Rendimiento y sostenibilidad

Muchas optimizaciones que reducen recursos mejoran a la vez la velocidad, la experiencia de usuario, el tiempo de carga, el consumo de datos móviles del usuario y el coste de infraestructura.

<figure class="diagram">
  <figcaption>Una misma decisión, varios efectos</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Imagen más ligera</li>
    <li>Menos transferencia</li>
    <li>Menos tiempo de descarga</li>
    <li>Menos datos del usuario</li>
  </ol>
</figure>

Por eso **rendimiento y sostenibilidad suelen apuntar en la misma dirección**. Pero no son lo mismo, y conviene no confundirlos: una web puede ser rapidísima porque tiene un servidor enorme detrás.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Entiendes que una web usa recursos físicos y sabes nombrar cuáles.</li>
    <li>Identificas al menos cinco desperdicios habituales.</li>
    <li>Sabes que reducir recursos no puede empeorar la funcionalidad.</li>
    <li>Sabes en qué se parecen y en qué no rendimiento y sostenibilidad.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Una página que pesa 10 MB, ¿es necesariamente mala?</li>
    <li>¿Qué problema tiene enviar una imagen de 6000 px para mostrarla a 300 px?</li>
    <li>¿Por qué hay que vigilar también los servicios de terceros?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · No necesariamente. Depende del contenido y del servicio que da. 10 MB de vídeo pedido por el usuario no es lo mismo que 10 MB de fuentes que nadie usa.</p>
  <p>2 · Que transferimos muchos más datos de los que el usuario puede aprovechar: la pantalla no puede mostrar esa información.</p>
  <p>3 · Porque añaden peticiones, transferencias, procesamiento y dependencias que no controlamos nosotros.</p>
</details>

---

## Sesión 2 · Primero medir, después optimizar

### No podemos mejorar lo que no conocemos

Imaginad que decimos «he hecho la web más sostenible». La pregunta correcta es **¿cómo lo sabes?**

Por eso el proceso es siempre este, y en este orden:

<figure class="diagram">
  <figcaption>El ciclo de la unidad</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Medir</li>
    <li>Modificar</li>
    <li>Volver a medir</li>
    <li>Comparar</li>
  </ol>
</figure>

### Chrome DevTools

Abrid la web y pulsad **F12**, o entrad por Herramientas de desarrollador. Nos interesa sobre todo el panel **Network**.

Cada vez que se carga una página el navegador pide recursos, y ahí vemos el nombre, el tipo, el tamaño, el tiempo, el servidor y el número de peticiones:

| Recurso    | Tipo   | Tamaño |
| ---------- | ------ | -----: |
| index.html | HTML   |  15 KB |
| style.css  | CSS    |  35 KB |
| app.js     | JS     | 480 KB |
| hero.jpg   | Imagen | 4,2 MB |
| logo.png   | Imagen | 800 KB |

¿Qué salta a la vista? Casi seguro `hero.jpg`, con sus 4,2 MB. Una sola imagen puede pesar más que todo el código de la página.

También veremos el número de peticiones. Que sean 180 en lugar de 20 no significa automáticamente que la web esté mal, pero obliga a preguntar si todas hacen falta.

### Lighthouse

Lighthouse es una herramienta automatizada integrada en Chrome que audita rendimiento, accesibilidad, buenas prácticas y SEO.

No usaremos su puntuación como una verdad. Es una **herramienta de diagnóstico**: sirve para saber dónde mirar, no para saber si hemos acabado.

Un *Performance* de 92 no significa que la web sea «un 92 % sostenible». Y un 100 tampoco significa que no quede nada por mejorar: significa que esa herramienta, con esos criterios, no ha encontrado nada. Lo que importa es lo que hay detrás del número.

<details class="aside aside--help">
  <summary>Estoy atascado · no sé leer el panel Network</summary>
  <ol>
    <li>Recargad con el panel ya abierto. Si lo abrís después, no habrá capturado nada.</li>
    <li>Marcad <em>Disable cache</em> para la medición inicial, o la segunda carga os dará cifras mucho menores que no son comparables.</li>
    <li>Mirad la barra de abajo: ahí están el número de peticiones y el total transferido. Esas dos son vuestras métricas principales.</li>
    <li>Ordenad por la columna de tamaño, de mayor a menor. Los tres primeros suelen explicar la mitad del peso.</li>
    <li>Usad los filtros por tipo —Img, JS, CSS, Font— para sacar el subtotal de cada categoría.</li>
    <li>Anotad también en qué condiciones medisteis. Si luego medís con otra red u otro perfil, la comparación no vale.</li>
  </ol>
</details>

### Segunda tarea · Auditoría inicial

Trabajaremos sobre **PixelStore**, una tienda de periféricos que funciona perfectamente y transfiere mucho más de lo que necesita.

```bash
git clone https://github.com/MarcSemperLloret/webssos.git pixelstore
cd pixelstore
python -m http.server 8080
```

Abridla en <http://localhost:8080>. No vale abrir el `index.html` con doble clic: el catálogo se carga con `fetch` y eso no funciona sobre `file://`.

**Todavía no modificamos nada.** Primero se anota el punto de partida.

| Indicador                     | Antes |
| ----------------------------- | ----: |
| Transferencia total           |       |
| Número de peticiones          |       |
| Tamaño total de imágenes      |       |
| JavaScript transferido        |       |
| CSS transferido               |       |
| Lighthouse Performance        |       |

Después, los cinco recursos más pesados:

| Recurso | Tamaño | ¿Parece necesario? |
| ------- | -----: | ------------------ |
|         |        |                    |
|         |        |                    |
|         |        |                    |
|         |        |                    |
|         |        |                    |

### Tercera tarea · Formular una hipótesis

Antes de tocar nada: ¿dónde creéis que está el mayor margen? Elegid **tres problemas** y justificad por qué empezaríais por ahí.

<p class="write-line"></p>
<p class="write-line"></p>
<p class="write-line"></p>

Esto no es un trámite. Al final de la unidad compararéis vuestra hipótesis con lo que de verdad ocurrió, y acertar o fallar dice bastante sobre lo que habéis aprendido.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Tenéis la tabla de métricas iniciales, completa y guardada.</li>
    <li>Habéis anotado en qué condiciones medisteis.</li>
    <li>Tenéis los cinco recursos más pesados identificados.</li>
    <li>Tenéis escrita vuestra hipótesis de los tres problemas principales.</li>
    <li>No habéis modificado todavía ni una línea.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué se mide antes de optimizar?</li>
    <li>¿Qué significa exactamente un Lighthouse Performance de 92?</li>
    <li>¿Por qué hay que anotar las condiciones de la medición?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque sin punto de partida no se puede demostrar ninguna mejora. Sin el «antes», el «después» no dice nada.</p>
  <p>2 · Que esa herramienta, con esos criterios y en esas condiciones, puntúa así el rendimiento. No es un porcentaje de sostenibilidad ni una nota del producto.</p>
  <p>3 · Porque una medición con caché, con otra red o con otro perfil no es comparable. Comparar dos cosas medidas distinto no demuestra nada.</p>
</details>

---

## Sesión 3 · Imágenes: casi siempre, el primer objetivo

### Una imagen puede ser enorme

Una foto de 6000 × 4000 que pesa 8,5 MB y que en la web aparece a 600 × 400. Estamos enviando información que el usuario no puede llegar a ver.

Sobre una imagen podemos actuar en tres frentes.

**Resolución.** No servir una imagen mucho mayor de lo que se va a mostrar.

**Formato.** No hay un formato perfecto para todo:

| Formato | Va bien para |
| ------- | ------------ |
| SVG | Iconos, logotipos, gráficos vectoriales |
| WebP / AVIF | Fotografías e imágenes web, con archivos bastante menores |
| PNG | Cuando hace falta transparencia u otras características concretas; no suele ser el más ligero |
| JPEG | Fotografía, cuando no se puede usar un formato moderno |

**Calidad.** Una imagen al 100 % de calidad puede pesar muchísimo más que la misma al 80 %, con una diferencia visual que casi nadie percibe. El objetivo no es destrozar la imagen para que pese 3 KB: es **encontrar un equilibrio razonable**.

#### Responsive images

Un móvil no necesita la misma resolución que una pantalla grande. HTML permite ofrecer varias versiones y dejar que el navegador elija, con `srcset`.

#### Lazy loading

Una página con 30 imágenes de las que al abrirla se ven 4. ¿Hace falta descargar las otras 26 ya? Casi nunca:

```html
<img src="producto.webp" loading="lazy" alt="Zapatilla de running azul">
```

---

### Cuarta tarea · Optimizar las imágenes

De cada imagen hay que comprobar cuatro cosas: resolución, tamaño, formato y si necesita cargarse de inmediato. La primera la hacemos juntos.

<p class="stage">Paso 1 · Te enseño uno</p>

#### La imagen de cabecera

<dl class="worked">
  <dt>¿A qué tamaño se muestra?</dt>
  <dd>Ocupa el ancho del contenedor: como mucho 1200 px. El archivo son 4000 px. Sobran 2800 px de ancho que ningún usuario verá.</dd>
  <dt>¿Qué formato tiene y cuál le convendría?</dt>
  <dd>Es un JPEG. Al ser una fotografía, WebP o AVIF darán un archivo bastante menor con calidad equivalente.</dd>
  <dt>¿Qué calidad necesita?</dt>
  <dd>Está guardada al 100 %. Es una imagen decorativa detrás de un texto: al 80 % nadie notará la diferencia.</dd>
  <dt>¿Debe cargarse de inmediato?</dt>
  <dd>Sí. Es lo primero que se ve, así que aquí <code>lazy</code> sería contraproducente: retrasaría justo lo que el usuario está esperando.</dd>
  <dt>Resultado</dt>
  <dd>4,8 MB → unos 180 KB, sin tocar el diseño.</dd>
</dl>

Fijaos en la última pregunta. `loading="lazy"` no es bueno por sí solo: en la imagen de cabecera empeora la experiencia. Optimizar es decidir, no aplicar recetas.

<p class="stage stage--guided">Paso 2 · Lo hacemos juntos</p>

Ahora las miniaturas del catálogo, con las mismas cuatro preguntas.

<dl class="answer">
  <dt>¿A qué tamaño se muestran?</dt>
  <dd></dd>
  <dt>Formato actual y formato propuesto</dt>
  <dd></dd>
  <dt>¿Cuáles se ven al abrir la página?</dt>
  <dd></dd>
  <dt>Decisión</dt>
  <dd></dd>
</dl>

<p class="stage stage--solo">Paso 3 · Hazlo tú</p>

El resto de las imágenes del proyecto. Anotad cada una:

| Imagen | Antes | Después | Reducción |
| ------ | ----: | ------: | --------: |
|        |       |         |           |
|        |       |         |           |
|        |       |         |           |

No buscamos la reducción más grande posible: la imagen tiene que **seguir viéndose bien**. Si alguien nota que la web ha empeorado, la optimización ha fallado aunque la cifra sea espectacular.

Y una observación que conviene tener presente: si una imagen baja de 5 MB a 400 KB, esos 4,6 MB se ahorran en **cada visita**. Una decisión pequeña de desarrollo escala con el número de usuarios, para bien y para mal.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 3</p>
  <ul class="checklist">
    <li>Sabéis qué resolución real necesita cada imagen.</li>
    <li>Habéis elegido formato con un criterio, no por costumbre.</li>
    <li>Habéis decidido qué se carga de inmediato y qué no, y por qué.</li>
    <li>La página se sigue viendo igual de bien.</li>
    <li>Tenéis anotado el antes y el después de cada imagen.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué no se pone <code>loading="lazy"</code> en la imagen de cabecera?</li>
    <li>¿Qué formato elegiríais para un logotipo, y por qué?</li>
    <li>¿Qué significa <code>srcset</code>?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque es lo primero que ve el usuario. Retrasar su carga empeora justo la parte que estaba esperando.</p>
  <p>2 · SVG: es vectorial, así que se ve nítido a cualquier tamaño y suele pesar muy poco.</p>
  <p>3 · Ofrecer varias versiones de la misma imagen para que el navegador descargue la que corresponde al dispositivo.</p>
</details>

---

## Sesión 4 · JavaScript, CSS, fuentes y terceros

### Más código no es mejor aplicación

Necesitamos mostrar una fecha y para ello añadimos una librería enorme. La pregunta es si hacía falta.

Cada dependencia añade código, tamaño, mantenimiento, vulnerabilidades y actualizaciones. Eso ya apareció en Ciberseguridad. Aquí se añade otra cosa: **también aumenta los recursos necesarios para ejecutar la aplicación**.

No se trata de pensar que JavaScript es malo: permite construir aplicaciones extraordinarias. La pregunta es si estamos cargando y ejecutando más de lo necesario. Los sospechosos habituales son el código que no se usa, las bibliotecas innecesarias, las funcionalidades que se cargan aunque nadie las abra, los scripts duplicados y el código de terceros.

#### Terceros

Una página puede cargar analytics, un chat, un mapa, un vídeo, publicidad, widgets sociales y tracking. De cada uno hay que preguntar tres cosas: ¿lo necesitamos?, ¿tiene que cargarse de inmediato?, ¿podría cargarse cuando el usuario lo pida?

<div class="compare-pair">
  <div>
    <p class="compare-label">Opción A</p>
    <p class="compare-body">Se abre la web y se carga el mapa externo de inmediato, lo mire quien lo mire.</p>
  </div>
  <div>
    <p class="compare-label">Opción B</p>
    <p class="compare-body">Se muestra un botón «Ver mapa». Solo se carga si alguien lo pulsa.</p>
  </div>
</div>

Si la mayoría de los usuarios nunca abren el mapa, la segunda opción evita trabajo que no servía para nada.

#### Fuentes

Una fuente también hay que descargarla. Es fácil acabar cargando cinco pesos de Roboto y tres de Montserrat cuando la web usa Regular y Bold. Los otros seis archivos son transferencia pura sin contrapartida.

#### CSS

Reglas duplicadas, frameworks enormes, estilos que ya no se usan. No hace falta obsesionarse con cada byte, pero sí evitar grandes cantidades de código que no pinta nada.

### Quinta tarea · Revisar código y dependencias

Revisad las cuatro categorías y rellenad la tabla: ¿hay alguna biblioteca o fichero especialmente grande? ¿Hay frameworks o estilos que apenas se usan? ¿Cuántas fuentes se descargan? ¿Qué servicios externos aparecen?

| Recurso | ¿Necesario?  | Acción |
| ------- | ------------ | ------ |
|         | Sí/No/Dudoso |        |
|         |              |        |
|         |              |        |
|         |              |        |

### Sexta tarea · Vuestro criterio contra el de la IA

Ahora sí, Copilot. Pero primero habéis hecho la revisión vosotros, igual que en la auditoría de seguridad.

<div class="prompt">
  <p class="prompt-label">Prompt estructurado</p>
  <p class="flow-role">Tarea</p>
  <p>Analiza este proyecto buscando oportunidades para reducir transferencia de datos, JavaScript innecesario, dependencias, recursos multimedia, fuentes y peticiones de terceros. No modifiques nada.</p>
  <p class="flow-role">Formato de salida</p>
  <ol>
    <li>Archivo.</li>
    <li>Problema.</li>
    <li>Mejora propuesta.</li>
    <li>Beneficio esperado.</li>
    <li>Riesgo de aplicar el cambio.</li>
  </ol>
  <p class="flow-role">Restricción</p>
  <p>Si una propuesta puede afectar a la funcionalidad, al diseño o a la accesibilidad, dilo explícitamente en lugar de omitirlo.</p>
</div>

Clasificad cada propuesta como **aceptar**, **rechazar** o **investigar**, y elegid al menos una que **no** aplicaríais, explicando por qué. Esa es la que más cuenta: rechazar bien una optimización demuestra más criterio que aceptarlas todas.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 4</p>
  <ul class="checklist">
    <li>Habéis identificado JavaScript reducible y CSS que sobra.</li>
    <li>Sabéis cuántas fuentes se descargan y cuántas se usan.</li>
    <li>Tenéis la lista de terceros y qué aporta cada uno.</li>
    <li>Tenéis las propuestas de la IA clasificadas.</li>
    <li>Tenéis al menos una recomendación rechazada, con su motivo escrito.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué revisáis vosotros antes de preguntar a la IA?</li>
    <li>Un mapa al final de la página, ¿cuándo debería cargarse?</li>
    <li>¿Qué coste tiene una dependencia, aparte de sus kilobytes?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para desarrollar criterio. Si empezáis por la IA solo aprendéis a leer su respuesta, no a encontrar el problema.</p>
  <p>2 · Cuando el usuario lo pida. Si la mayoría no lo abre, cargarlo siempre es trabajo desperdiciado en todas esas visitas.</p>
  <p>3 · Mantenimiento, actualizaciones, superficie de vulnerabilidad y tiempo de ejecución. Los kilobytes suelen ser lo de menos.</p>
</details>

---

## Sesión 5 · Caché, compresión y datos

### ¿Hay que descargar siempre lo mismo?

Un usuario entra hoy y descarga el logotipo. Cambia de página. ¿Hace falta volver a descargar exactamente el mismo archivo? No necesariamente. Para eso está la:

<p class="term">Caché</p>

Guardar temporalmente un recurso para reutilizarlo sin volver a pedirlo.

<div class="compare-pair">
  <div>
    <p class="compare-label">Primera visita</p>
    <p class="compare-body">Servidor → logo.webp → navegador.</p>
  </div>
  <div>
    <p class="compare-label">Siguientes visitas</p>
    <p class="compare-body">Caché → logo.webp. Sin salir a la red.</p>
  </div>
</div>

Esto reduce peticiones, transferencia y latencia. Pero trae su propio problema: si modificamos `style.css` y el navegador conserva la versión antigua, el usuario ve una web rota. Por eso hay que gestionar cuándo un recurso deja de ser válido.

No entraremos en configuración avanzada. Basta con entender **qué problema resuelve la caché y qué problema crea**.

### Compresión

Los recursos de texto —HTML, CSS, JavaScript, JSON— pueden comprimirse durante la transferencia con tecnologías como gzip o Brotli.

<figure class="diagram">
  <figcaption>Qué hace la compresión</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Archivo</li>
    <li>Comprimir</li>
    <li>Transferir menos datos</li>
    <li>Descomprimir</li>
  </ol>
</figure>

Pero no todo se comprime otra vez: un AVIF ya viene fuertemente comprimido, y volver a comprimirlo apenas aporta nada mientras consume tiempo de CPU en los dos extremos.

> **La optimización también tiene coste.** No hacemos trabajo que no produce un beneficio razonable.

### Datos: el mismo principio, en el backend

Un endpoint que devuelve 50.000 productos cuando la interfaz muestra 20:

```http
GET /productos
```

Una solución es la **paginación**: pedir solo lo que hace falta ahora.

```http
GET /productos?page=1&size=20
```

Y lo mismo con las columnas. Si necesitamos nombre, precio e imagen, quizá no hacía falta:

```sql
SELECT *
```

Vuelve a aparecer el principio de la unidad: **procesar y transferir solo lo necesario**.

### Séptima tarea · Más allá del frontend

| Situación                                               | Posible mejora |
| ------------------------------------------------------- | -------------- |
| La API devuelve 50.000 filas                            |                |
| La web pide los mismos datos cada segundo               |                |
| El navegador descarga siempre los mismos recursos       |                |
| El JSON trae campos que nunca se usan                   |                |
| El servidor envía HTML, CSS y JS sin comprimir          |                |
| Se descargan 40 imágenes que están fuera de pantalla    |                |

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 5</p>
  <ul class="checklist">
    <li>Sabes explicar qué resuelve la caché y qué problema introduce.</li>
    <li>Sabes qué tipo de recursos se comprimen y cuáles no merece la pena.</li>
    <li>Entiendes por qué paginar reduce recursos en los dos extremos.</li>
    <li>Has localizado en el proyecto al menos un caso de datos de más.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Habéis cambiado el CSS y algunos usuarios siguen viendo el diseño viejo. ¿Qué ha pasado?</li>
    <li>¿Por qué no tiene sentido comprimir un AVIF otra vez?</li>
    <li>¿Qué gana el servidor al paginar, además del ancho de banda?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Su navegador tiene cacheada la versión anterior y todavía la considera válida. Es el precio de la caché mal gestionada.</p>
  <p>2 · Porque ya está fuertemente comprimido: se gasta CPU para ahorrar prácticamente nada.</p>
  <p>3 · Trabajo. Consultar y serializar 20 registros en lugar de 50.000 ahorra base de datos, memoria y tiempo de proceso.</p>
</details>

---

## Sesión 6 · Optimizar nuestra web

Ya tenemos suficiente información. Volvemos al proyecto con un objetivo: **reducir recursos sin empeorar el servicio**.

### Planificar antes de tocar

| Problema | Cambio | Resultado esperado |
| -------- | ------ | ------------------ |
|          |        |                    |
|          |        |                    |
|          |        |                    |
|          |        |                    |

Priorizad lo de **alto impacto y bajo esfuerzo**. Una imagen de cabecera de 5 MB tiene impacto alto y dificultad baja, así que debería estar entre las primeras acciones. Una reescritura del framework tiene impacto dudoso y esfuerzo enorme.

### Aplicar al menos cinco optimizaciones

Y que toquen varias categorías, no cinco imágenes:

| Categoría | Ejemplos |
| --------- | -------- |
| Multimedia | Comprimir, cambiar formato, reducir resolución, lazy loading |
| Código | Eliminar una dependencia, reducir JavaScript, quitar CSS muerto |
| Recursos | Reducir fuentes, retirar un tercero, cargar bajo demanda |
| Datos | Reducir la respuesta, paginar, evitar consultas repetidas |

### Trabajar con la IA, no delegarle

Podéis pedir ayuda a Copilot para hacer los cambios, con el mismo procedimiento de Digitalización:

<figure class="diagram">
  <figcaption>Cómo se aplica un cambio</figcaption>
  <ol class="flow">
    <li>Problema</li>
    <li>Propuesta de la IA</li>
    <li>Revisar</li>
    <li>Modificar</li>
    <li>Medir</li>
  </ol>
</figure>

<div class="compare-pair">
  <div>
    <p class="compare-label">No</p>
    <p class="compare-body">«Copilot, optimiza toda la web.»</p>
  </div>
  <div>
    <p class="compare-label">Sí</p>
    <p class="compare-body">«La imagen hero pesa 4,8 MB y se muestra a un máximo de 1200 px. Propón una estrategia para reducir transferencia manteniendo una calidad visual razonable. No modifiques nada todavía.»</p>
  </div>
</div>

### Git como red de seguridad

Antes de empezar y después de cada bloque de cambios:

```bash
git status
git diff
```

Tenéis que poder responder en todo momento a una pregunta: **¿qué hemos modificado exactamente?** Si no lo sabéis, tampoco podréis explicar a qué se debe la mejora.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 6</p>
  <ul class="checklist">
    <li>Tenéis el plan escrito antes de los cambios, con el resultado esperado.</li>
    <li>Al menos cinco optimizaciones aplicadas, en varias categorías.</li>
    <li>Cada cambio está en el historial de Git y sabéis explicarlo.</li>
    <li>La web sigue abriendo y funcionando.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué se prioriza por impacto y esfuerzo, y no por facilidad?</li>
    <li>¿Qué diferencia una petición útil a la IA de una inútil?</li>
    <li>¿Para qué sirve <code>git diff</code> aquí?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque el tiempo es limitado. Empezar por lo fácil suele significar acabar sin tocar lo que de verdad pesaba.</p>
  <p>2 · La útil da el dato concreto, la restricción y el criterio de calidad. La inútil delega la decisión entera.</p>
  <p>3 · Para saber exactamente qué cambió, atribuir la mejora al cambio correcto y encontrar el culpable si algo se rompe.</p>
</details>

---

## Sesión 7 · ¿Realmente hemos mejorado?

Repetid la medición inicial **exactamente igual**: mismas herramientas, mismas condiciones, misma configuración de caché.

| Indicador              | Antes | Después | Cambio |
| ---------------------- | ----: | ------: | -----: |
| Transferencia total    |       |         |        |
| Número de peticiones   |       |         |        |
| Imágenes               |       |         |        |
| JavaScript             |       |         |        |
| CSS                    |       |         |        |
| Lighthouse Performance |       |         |        |

Para la reducción porcentual, de 9,4 MB a 2,3 MB:

<p class="single-node single-node--mono">(9,4 − 2,3) / 9,4 × 100 = 75,5 %</p>

No hay que memorizar la fórmula. Podéis usar calculadora, hoja de cálculo o la IA.

### Una reducción enorme también puede ser un fracaso

Imaginad que quitamos todas las imágenes. La transferencia baja un 90 %. ¿Es mejor la web? Probablemente hemos destruido el diseño, la información y la utilidad.

Por eso, además de medir, hay que comprobar: ¿la web sigue funcionando?, ¿mantiene su calidad visual?, ¿sigue siendo usable?, ¿hemos eliminado alguna funcionalidad importante?

### Octava tarea · Auditoría visual

Revisad en móvil y en escritorio: enlaces, imágenes, formularios, funcionalidades, consola y errores.

No podemos declarar una optimización exitosa si hemos roto la aplicación. Una web rota pesa muy poco.

<details class="aside aside--help">
  <summary>Estoy atascado · he optimizado y algo se ve mal</summary>
  <ol>
    <li>Mirad primero la consola del navegador. Un 404 de un recurso que renombrasteis explica la mitad de los casos.</li>
    <li>Mirad <code>git diff</code>: casi siempre el problema está en un cambio que hicisteis de paso, no en el que perseguíais.</li>
    <li>Si es una imagen borrosa, os habéis pasado bajando resolución o calidad. Volved atrás un escalón, no al original.</li>
    <li>Si algo aparece tarde o a saltos, revisad a qué le pusisteis <code>lazy</code>: no va en lo que se ve al abrir.</li>
    <li>Si dejó de funcionar un botón, mirad qué dependencia quitasteis. Que no aparezca en el HTML no significa que no se use.</li>
    <li>Si no lo encontráis, deshaced el último cambio y volved a aplicarlos de uno en uno midiendo entre medias.</li>
  </ol>
</details>

### Novena tarea · Revisar los cambios con IA

Ahora la IA revisa **solo lo que habéis tocado**:

<div class="prompt">
  <p class="prompt-label">Prompt estructurado</p>
  <p class="flow-role">Tarea</p>
  <p>Revisa exclusivamente los cambios realizados en este repositorio. No modifiques el código.</p>
  <p class="flow-role">Busca</p>
  <ol>
    <li>Posibles regresiones.</li>
    <li>Recursos que siguen siendo innecesarios.</li>
    <li>Optimizaciones dudosas o arriesgadas.</li>
    <li>Funcionalidades que podrían haberse roto.</li>
  </ol>
</div>

Clasificad otra vez: aceptar, rechazar o investigar.

### Sobre el CO₂ por visita

Existen herramientas que estiman gramos de CO₂ por página. Pueden servir como aproximación, pero ese valor depende de muchos supuestos sobre electricidad, redes, dispositivos, centros de datos y comportamiento del usuario.

> **No presentéis una estimación como si fuera una medición.**

En esta unidad damos prioridad a lo que podemos observar directamente: bytes transferidos, número de peticiones, tamaños por categoría y rendimiento. Si además queréis dar una estimación de CO₂, decid con qué herramienta y con qué supuestos. Eso es exactamente lo contrario del greenwashing de la primera unidad.

---

### Producto final

Entregaréis el **repositorio** con la versión optimizada y **una única página o diapositiva** con cuatro bloques.

#### A · Diagnóstico inicial

Los tres principales problemas que encontrasteis.

#### B · Cambios realizados

| Cambio | Motivo |
| ------ | ------ |
|        |        |
|        |        |
|        |        |
|        |        |
|        |        |

#### C · Antes y después

| Métrica       | Antes | Después |
| ------------- | ----: | ------: |
| Transferencia |       |         |
| Peticiones    |       |         |
| Imágenes      |       |         |
| JavaScript    |       |         |
| Rendimiento   |       |         |

#### D · Una decisión que NO tomasteis

Por ejemplo: «Copilot recomendó eliminar X, pero decidimos mantenerlo porque…». Este bloque no es relleno: es donde se ve si entendisteis la unidad.

### Presentación

Unos **3 minutos** por pareja, para responder a cuatro preguntas:

* ¿Cuál era el mayor desperdicio?
* ¿Qué cambio produjo la mayor mejora? ¿Coincide con vuestra hipótesis de la sesión 2?
* ¿Qué habéis decidido mantener aunque consuma recursos?
* ¿Cómo demostráis que la versión nueva es mejor?

### Evaluación

| Criterio                                   | Puntos |
| ------------------------------------------ | -----: |
| Auditoría inicial correcta                 |    1,5 |
| Identificación y priorización de problemas |    1,5 |
| **Calidad técnica de las optimizaciones**  |  **3** |
| **Comparación cuantitativa antes/después** |  **2** |
| Mantenimiento de funcionalidad y calidad   |      1 |
| Uso crítico de IA                          |    0,5 |
| Claridad de la entrega                     |    0,5 |

No obtiene mejor nota quien consigue la página más pequeña, ni quien saca un Lighthouse de 100. La obtiene quien logra **una mejora importante y demostrable sin degradar el producto**.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · entrega</p>
  <ul class="checklist">
    <li>Guardasteis las métricas iniciales y volvisteis a medir en condiciones comparables.</li>
    <li>Habéis optimizado varias categorías, no solo imágenes.</li>
    <li>La página sigue funcionando en móvil y en escritorio, sin errores en consola.</li>
    <li>Podéis explicar por qué hicisteis cada cambio.</li>
    <li>No afirmáis impactos que no podéis medir.</li>
    <li>Habéis revisado críticamente las recomendaciones de la IA.</li>
    <li>Podéis demostrar el resultado con datos.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Una web que pesa menos, ¿es necesariamente mejor?</li>
    <li>¿Por qué hay que medir antes de optimizar?</li>
    <li>¿Qué suele convenir revisar primero en una web muy pesada?</li>
    <li>¿Para qué sirve la caché?</li>
    <li>¿Por qué hay que vigilar los scripts de terceros?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · No. Hay que mantener funcionalidad, usabilidad, accesibilidad y calidad. Una web rota pesa poquísimo.</p>
  <p>2 · Porque sin situación inicial no se puede demostrar la mejora.</p>
  <p>3 · Las imágenes y el resto de contenido multimedia suelen ser el mayor bloque, pero eso hay que confirmarlo midiendo, no suponiéndolo.</p>
  <p>4 · Para reutilizar recursos en lugar de descargarlos otra vez mientras siguen siendo válidos.</p>
  <p>5 · Porque añaden transferencia, procesamiento, dependencias y cuestiones de privacidad que no controlamos.</p>
</details>

---

## Lo que debes recordar

### El método

Cuando una página va lenta o consume demasiado, no se empieza cambiando cosas a ver qué pasa:

<figure class="diagram">
  <figcaption>El ciclo completo</figcaption>
  <ol class="flow">
    <li>Medir</li>
    <li>Identificar</li>
    <li>Priorizar</li>
    <li>Optimizar</li>
    <li>Volver a medir</li>
    <li>Comprobar que nada se ha roto</li>
  </ol>
</figure>

Y se aplican dos reglas a la vez, no una:

> **No transferir, almacenar ni procesar lo que no necesitamos.**

> **No sacrificar una funcionalidad útil solo para bajar una métrica.**

El objetivo es el **uso razonable de recursos para dar un buen servicio**. Ni derrochar ni empobrecer el producto.

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Transferencia de datos | Cuánta información viaja por la red en cada visita |
| Petición | Cada recurso que el navegador pide al servidor |
| DevTools | Las herramientas del navegador para analizar una web |
| Network | El panel donde se ven las peticiones y lo que pesa cada una |
| Lighthouse | La auditoría automática de Chrome: diagnóstico, no veredicto |
| Lazy loading | Retrasar la carga de un recurso hasta que haga falta |
| Responsive images | Servir la versión de la imagen que corresponde al dispositivo |
| WebP / AVIF | Formatos modernos que dan archivos bastante menores |
| Caché | Guardar un recurso para reutilizarlo sin volver a pedirlo |
| Compresión | Reducir el tamaño de lo que se transfiere |
| Dependencia | Software externo del que pasa a depender el nuestro |
| Tercero | Un servicio de otra organización cargado en nuestra web |
| Paginación | Servir los datos por trozos, en vez de todos de golpe |
| Regresión | Algo que funcionaba y hemos roto al cambiar otra cosa |
| Optimización | Un cambio que reduce recursos sin degradar el servicio |
| Software sostenible | Software diseñado y operado contando también con los recursos que consume |

---
title: "Desarrollo web y software sostenible"
label: "UD3 · Proyecto"
section: "ud-03"
order: 3
lang: "es"
summary: "Una web no necesita consumir más recursos de los necesarios para dar un buen servicio. Aprendemos a medir una página, detectar el desperdicio, optimizarla y demostrar con datos si de verdad la hemos mejorado."
duration: "6 horas · 6 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Optimización y comparación de la web. Una actividad acumulativa por unidad, con evidencias y aportación individual."
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
  - "Guía de arranque y materiales de esta unidad, enlazados en la página."
  - "Carpeta o documento de actividad compartido con el docente."
priorKnowledge:
  - "Las unidades anteriores de este módulo. No se requiere Servidor, Intermodular ni el otro módulo transversal."
date: "2026-09-09"
---

<p class="lead">Optimización y comparación de la web. Cada sesión introduce los conceptos que necesita y continúa una misma actividad de la unidad. Conserva sus resultados para revisarlos y utilizarlos después.</p>

## Cómo trabajar esta unidad

Son 6 sesiones de una hora: 10 minutos de explicación, 45 de trabajo guiado y 5 de cierre. Si el periodo del centro es de 55 minutos, se ajusta el trabajo a 40 minutos. Los ejemplos ampliados son material de consulta durante la práctica; no añaden otra clase teórica ni tareas obligatorias.

Abre la [guía de arranque y evaluación](/es/docencia/talleres-transversales/). Incluye archivos, herramientas y alternativas de acceso. Para los casos utiliza la [ficha común](/teaching/transversales/casos.pdf). No se necesita el CRUD de Servidor ni el workflow de Intermodular. Quien ya conozca una herramienta utiliza ese conocimiento para justificar y comprobar la actividad nueva, sin repetir una entrega ya evaluada.

## Actividad y criterios de evaluación

**Optimización y comparación de la web.** Guarda el trabajo en `sostenibilidad/ud3/`, y redacta la actividad en Word, LibreOffice o un documento en línea; exporta la entrega a PDF. Cada sesión añade su avance, comprobación y pendiente; no se entrega un informe diferente por sesión. Cuando haya código, enlaza el repositorio y la versión o adjunta la carpeta identificada según el canal del aula. Nunca incluyas credenciales.

Esta actividad se valora sobre 10 puntos y aporta **6/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Cada integrante registra y explica su aportación. La rúbrica se conoce desde el inicio:

| Criterio                                   | Puntos |
| ------------------------------------------ | -----: |
| Auditoría inicial correcta                 |    1,5 |
| Identificación y priorización de problemas |    1,5 |
| **Calidad técnica de las optimizaciones**  |  **3** |
| **Comparación cuantitativa antes/después** |  **2** |
| Mantenimiento de funcionalidad y calidad   |      1 |
| Uso crítico de IA                          |    0,5 |
| Claridad de la entrega                     |    0,5 |

En cada criterio, una evidencia ausente no permite acreditar el logro; una evidencia incompleta requiere revisión; una evidencia correcta permite comprobar el resultado; el logro completo añade una justificación coherente y reconoce sus límites. Los puntos se asignan según el grado de logro del criterio, no por cantidad de archivos, commits o texto. Consulta la guía para revisar y volver a presentar los criterios pendientes.

## Sesión 1 · Una web también consume recursos

**Punto de partida.** Actividad «Optimización y comparación de la web», sesión 1 de 6. Abre los materiales enlazados y crea el registro de la unidad. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una web consume recursos al enviar archivos, ejecutar código y utilizar dispositivos y servidores. El tamaño transferido es una magnitud observable; la huella ambiental completa exige considerar más factores. Mejorar rendimiento puede ayudar, pero una página rápida no es automáticamente sostenible.

PixelStore es un proyecto de laboratorio que ya funciona. Nuestro objetivo es conservar su utilidad reduciendo recursos innecesarios. Una imagen excesivamente grande puede ser candidata; eliminar el catálogo para que la página pese menos destruye el servicio que debemos mantener.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### ¿Dónde se desperdician recursos?

| Desperdicio | Cómo se ve |
| ----------- | ---------- |
| Imágenes sobredimensionadas | Se muestra a 400 × 300 y se descarga a 6000 × 4000 |
| Formatos poco adecuados | 4 MB cuando otra versión casi idéntica pesa 300 KB |
| JavaScript innecesario | Una librería enorme para usar una única función |
| Vídeos automáticos | El usuario entra y empieza a bajarse un vídeo que quizá no quería ver |
| Scripts de terceros | Publicidad, analytics, mapas, chats, widgets, trackers |
| Fuentes de más | Cinco familias por cuatro pesos, cuando se usan dos |
| Datos innecesarios | La API devuelve 10.000 productos y el usuario ve 20 |

#### Rendimiento y sostenibilidad

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

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre la ficha de PixelStore y crea el registro de UD3. Escribe qué funciones debe conservar la tienda: catálogo, imágenes útiles, enlaces, formulario y el recorrido disponible en esta versión.
2. Dibuja una visita con navegador, red y servidor. Enumera archivos que podrían descargarse: HTML, CSS, JavaScript, imágenes, fuentes y recursos externos.
3. Usa la página de ejemplo de la guía o la vista proporcionada en el aula para localizar tres posibles desperdicios. Todavía son hipótesis; escribe qué medirías para confirmarlas.
4. Clasifica una propuesta en reducir tamaño, evitar descarga o evitar procesamiento. Explica una consecuencia negativa posible, como perder legibilidad o funcionalidad.
5. Prepara la tabla de medición con recurso, tamaño, peticiones, condición de prueba y observación. Reserva columnas antes/después sin rellenarlas con las cifras de ejemplo.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

El objetivo conserva el servicio y las hipótesis se podrán contrastar. No necesitas conocimientos de agentes de Digitalización para realizar la práctica.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 1»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 2 · Primero medir, después optimizar

**Punto de partida.** Actividad «Optimización y comparación de la web», sesión 2 de 6. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una medida de partida permite comparar un cambio. Si medimos una vez con caché y otra sin ella, quizá comparemos condiciones distintas en vez de versiones. **DevTools** es el conjunto de herramientas del navegador; su pestaña Red muestra peticiones, respuestas y transferencia.

**Lighthouse** ejecuta comprobaciones y produce indicadores bajo unas condiciones determinadas. Su puntuación no equivale a porcentaje de sostenibilidad. Hoy guardaremos versión, configuración y resultados para repetir el procedimiento después de optimizar.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### Chrome DevTools

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

#### Lighthouse

Lighthouse es una herramienta automatizada integrada en Chrome que audita rendimiento, accesibilidad, buenas prácticas y SEO.

No usaremos su puntuación como una verdad. Es una **herramienta de diagnóstico**: sirve para saber dónde mirar, no para saber si hemos acabado.

Un *Performance* de 92 no significa que la web sea «un 92 % sostenible». Y un 100 tampoco significa que no quede nada por mejorar: significa que esa herramienta, con esos criterios, no ha encontrado nada. Lo que importa es lo que hay detrás del número.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Sigue la [guía de PixelStore](/es/docencia/talleres-transversales/#pixelstore): descarga o clona la versión `main`, abre su carpeta y arráncala con el servidor local indicado. Visita la URL HTTP, no el archivo mediante doble clic.
2. Comprueba que el catálogo aparece. Si falta, revisa la consola y las respuestas de Red antes de medir. No tomes como referencia una página que no terminó de cargar.
3. Abre Red, activa la condición de caché indicada en la guía y recarga. Anota transferencia total, número de peticiones y los cinco recursos mayores. Guarda una captura con las condiciones.
4. Ejecuta Lighthouse con el perfil acordado. Registra sus valores como resultados de esa herramienta, separados de los bytes observados en Red.
5. Elige tres problemas de mayor prioridad y escribe una hipótesis de mejora para cada uno. Guarda la tabla inicial y la versión del proyecto antes de tocar archivos.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La medición es reproducible y la página funciona. Cada hipótesis menciona un recurso observado, no una recomendación genérica del asistente.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 2»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 3 · Imágenes: casi siempre, el primer objetivo

**Punto de partida.** Actividad «Optimización y comparación de la web», sesión 3 de 6. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una imagen puede transferir muchos más píxeles de los que se muestran. Reducir dimensiones o cambiar formato puede disminuir bytes, pero hay que comprobar legibilidad y calidad. La primera imagen visible y una imagen situada al final de la página tampoco tienen la misma prioridad de carga.

El experimento cambia una cosa cada vez: elegimos una imagen medida, aplicamos una mejora y volvemos a observarla. Así podemos relacionar el resultado con la modificación y conservar una versión adecuada si una compresión mayor deteriora el producto.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### Una imagen puede ser enorme

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

##### Responsive images

Un móvil no necesita la misma resolución que una pantalla grande. HTML permite ofrecer varias versiones y dejar que el navegador elija, con `srcset`.

##### Lazy loading

Una página con 30 imágenes de las que al abrirla se ven 4. ¿Hace falta descargar las otras 26 ya? Casi nunca:

```html
<img src="producto.webp" loading="lazy" alt="Zapatilla de running azul">
```

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Selecciona una imagen entre los recursos más pesados. Localiza su archivo en el proyecto y la referencia que lo utiliza, mediante la búsqueda del editor. Conserva una copia inicial fuera de la carpeta servida.
2. Compara dimensiones del archivo con su tamaño visible. Abre la herramienta de conversión indicada en la guía y exporta una versión con resolución suficiente; conserva el original de trabajo.
3. Actualiza la referencia al archivo exportado. Recarga y comprueba en Red que responde correctamente y que ya no se solicita la versión anterior por esa referencia.
4. Compara bytes y aspecto en móvil y escritorio. Si se ve borrosa, aumenta calidad o resolución y repite la medida. Registra una versión aceptada y una alternativa descartada si realmente la probaste.
5. Repite el procedimiento en otra imagen y razona si puede cargarse de forma diferida. No apliques `loading="lazy"` automáticamente a la imagen principal visible al abrir la página.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La reducción está medida y las imágenes conservan su función. Puedes localizar el cambio en el archivo y explicar por qué elegiste esa calidad.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 3»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 4 · Código, terceros, caché y datos

**Punto de partida.** Actividad «Optimización y comparación de la web», sesión 4 de 6. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Las dependencias y los recursos externos añaden transferencias y ejecución. Que un archivo parezca grande no demuestra que sobre: puede sostener una función de la tienda. Revisaremos usos concretos antes de retirarlo.

La **caché** permite reutilizar respuestas; la **compresión** reduce tamaño durante el transporte. Su configuración pertenece al servidor y hoy se estudia mediante ejemplos, no se exige implantarla en el servidor local sencillo. La misma idea de evitar trabajo innecesario sirve para datos: pedir solo lo que se necesita, sin programar una API nueva en esta actividad.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### ¿Hay que descargar siempre lo mismo?

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

#### Compresión

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

#### Datos: el mismo principio, en el backend

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

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Selecciona un script o recurso externo de la medición. Localiza dónde se incluye y qué función visible aporta. Si no lo sabes, investiga antes de borrarlo.
2. Prueba una mejora acotada sobre un recurso del cliente: retirar una inclusión confirmada como innecesaria o posponer un elemento que no se necesita al inicio. Guarda el punto anterior.
3. Repite el recorrido que utiliza ese recurso y revisa consola y Red. Si se rompe una función, restaura el cambio y registra por qué la propuesta no era adecuada.
4. Compara dos recomendaciones, una propia y otra del asistente o de la ficha preparada. Clasifícalas en aceptar, rechazar o investigar con un motivo observable. La guía de revisión explica el procedimiento sin remitir a Digitalización.
5. Resuelve los ejemplos de caché, compresión y datos del material de consulta: indica qué recurso ahorrarían y quién tendría que configurar la solución. Separa estas propuestas de los cambios que sí has implementado.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La evidencia distingue una optimización real del cliente de una propuesta para el servidor. No se exige Nginx, paginación de Spring ni CI.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 4»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 5 · Optimizar nuestra web

**Punto de partida.** Actividad «Optimización y comparación de la web», sesión 5 de 6. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Optimizar requiere priorizar cambios por su efecto probable, coste y riesgo. Varias modificaciones sin comprobar pueden ocultar cuál produjo una mejora o rompió una función. Por eso el registro conserva una fila por cambio y sus resultados.

Un asistente puede sugerir una optimización, pero la persona que trabaja decide si procede. Comparar archivos antes/después y ejecutar el recorrido afectado permite revisar la propuesta aunque no se haya cursado el módulo de IA. La guía incluye cómo realizar esa comparación.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Revisa las hipótesis iniciales y las mejoras ya probadas. Ordena los pendientes por evidencia de consumo y facilidad de comprobación.
2. Completa las cinco optimizaciones acotadas de la actividad, contando las ya realizadas en las sesiones 3 y 4. Distribúyelas entre recursos cuando las mediciones lo justifiquen; no inventes cambios para rellenar categorías.
3. Para cada modificación guarda motivo, archivo, medida y resultado funcional. Si utilizas IA, pide una propuesta limitada a ese recurso antes de aceptar la edición.
4. Compara con la versión inicial mediante el editor o Git, siguiendo la guía. Revisa que no se han borrado secciones ni añadido dependencias ajenas al objetivo.
5. Recorre la tienda en móvil y escritorio. Corrige enlaces rotos, imágenes ausentes o errores de consola antes de pasar a la comparación final; registra cualquier objetivo pendiente con su causa.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Existe un registro de cambios medidos y comprobados. Una propuesta rechazada con fundamento también informa del criterio, pero no se presenta como una optimización aplicada.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 5»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 6 · ¿Realmente hemos mejorado?

**Punto de partida.** Actividad «Optimización y comparación de la web», sesión 6 de 6. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una comparación antes/después necesita el mismo procedimiento y una interpretación. La reducción relativa se calcula como `(antes − después) / antes × 100`. Si pasamos de 10 MB a 7 MB, hemos reducido un 30 % esa transferencia; eso no equivale a medir una reducción del 30 % de la huella de carbono.

La utilidad se conserva como condición de la mejora. La tabla de recursos y la prueba funcional deben leerse juntas. Las estimaciones ambientales adicionales requieren explicar su modelo y supuestos, y no forman parte de las medidas obligatorias de esta actividad.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Repite la medición inicial con la misma condición de caché, perfil y recorrido. Anota la versión final y guarda resultados de Red y Lighthouse por separado.
2. Completa antes/después de transferencia, peticiones y tamaños por categoría. Calcula la variación de las magnitudes comparables; no trates puntos de Lighthouse como porcentaje de sostenibilidad.
3. Repite las funciones que definiste en la primera sesión. Pide a otra pareja que compruebe una acción sin explicarle cómo ha cambiado el código.
4. Resume en una página diagnóstico, cambios, comparación y una decisión descartada. Enlaza las mediciones completas y el registro de modificaciones.
5. Entrega el proyecto y el informe de la actividad. Cada integrante explica un cambio y su comprobación. Describe lo demostrado como reducción de recursos observados y declara los límites de las pruebas.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La mejora está respaldada por medidas comparables y mantiene el producto. No se exige estimar emisiones ni producir otro informe por cada sesión.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 6»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. La actividad de la unidad queda lista para valorar con su rúbrica; las correcciones se documentan en el mismo registro.

## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

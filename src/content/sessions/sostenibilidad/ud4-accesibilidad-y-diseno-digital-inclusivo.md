---
title: "Accesibilidad y diseño digital inclusivo"
label: "UD4 · Proyecto"
section: "ud-04"
order: 4
lang: "es"
summary: "¿Puede utilizar tu web todo el mundo? Una aplicación puede funcionar perfectamente y ser inutilizable para bastante gente. Aprendemos a encontrar esas barreras, a corregirlas y a demostrar que la web es mejor después."
duration: "4 horas · 4 sesiones"
modality: "Individual o parejas"
deliverable: "Web corregida y una auditoría breve de accesibilidad antes/después."
outcomes:
  - "Detectar barreras de accesibilidad probando la web, no solo puntuándola."
  - "Explicar los cuatro principios de la WCAG con ejemplos propios."
  - "Usar el teclado como primera prueba de accesibilidad de cualquier interfaz."
  - "Escribir HTML semántico y textos alternativos que sirvan para algo."
  - "Priorizar las barreras por a quién afectan y cuánto le impiden hacer."
  - "Corregir y demostrar la mejora con evidencia, no con una puntuación."
requirements:
  - "Chrome o Chromium, con DevTools y Lighthouse."
  - "La extensión axe DevTools."
  - "Editor de código y Git."
  - "PixelStore, rama barreras. Se clona en la sesión 1."
priorKnowledge:
  - "HTML y CSS a nivel de escribir una página completa."
  - "Medir con DevTools y guardar un estado inicial (UD3)."
  - "Que la dimensión social de la sostenibilidad también se evalúa (UD1)."
date: "2026-08-29"
---

### ¿Qué tiene que ver esto con sostenibilidad?

Cuando desarrollamos una web nos preguntamos si funciona, si se ve bien y si es rápida. Falta una pregunta:

> **¿Puede utilizarla cualquier persona?**

Una aplicación puede ser técnicamente impecable y resultar inutilizable para alguien que no puede usar un ratón, una persona con baja visión, alguien que navega con lector de pantalla, una persona con daltonismo, alguien con dificultades cognitivas, alguien que se ha roto un brazo esta semana o cualquiera que intente usar el móvil a pleno sol.

La accesibilidad es la:

<p class="term">Dimensión social de la sostenibilidad</p>

En la UD1 vimos que una empresa tiene impactos ambientales, sociales y de gobernanza. En la UD2 y la UD3 trabajamos el ambiental. Este es el social, y es el que más directamente depende de vosotros: lo decidís al escribir el HTML.

No tiene mucho sentido construir un servicio muy eficiente, muy rápido y muy moderno si una parte de sus usuarios no puede utilizarlo.

## Sesión 1 · Experimentar las barreras

### Primero, úsala normal

Antes de estudiar ninguna norma vamos a hacer otra cosa. Volvemos a **PixelStore**, la tienda de la unidad anterior, en la rama que trae carrito y modal:

```bash
git clone -b barreras https://github.com/MarcSemperLloret/webssos.git pixelstore-a11y
cd pixelstore-a11y
python -m http.server 8080
```

Si ya la teníais clonada, basta con `git fetch origin` y `git switch barreras`.

Aparentemente funciona: tiene menú, productos, imágenes, formulario, botones, modal y carrito. Usadla unos minutos con normalidad, como usuarios.

<dl class="answer">
  <dt>¿Parece fácil de utilizar?</dt>
  <dd></dd>
  <dt>¿Detectáis algún problema?</dt>
  <dd></dd>
</dl>

### Ahora guarda el ratón

Apartadlo físicamente de la mesa. Vais a usar exactamente la misma página **solo con el teclado**.

| Tecla | Qué hace |
| ----- | -------- |
| `Tab` | Pasa al siguiente elemento interactivo |
| `Shift` + `Tab` | Vuelve al anterior |
| `Enter` | Activa enlaces y botones |
| `Espacio` | Activa botones, marca casillas |
| `Esc` | Cierra lo que esté abierto |

Intentad hacer cinco cosas, en este orden:

<figure class="diagram">
  <figcaption>El recorrido de un usuario cualquiera</figcaption>
  <ol class="flow">
    <li>Recorrer el menú</li>
    <li>Abrir un producto</li>
    <li>Añadirlo al carrito</li>
    <li>Completar el formulario</li>
    <li>Abrir y cerrar el modal</li>
  </ol>
</figure>

Y ahora responded, con la mano quieta:

* ¿Podéis llegar a todos los controles?
* ¿Sabéis en todo momento dónde está el foco?
* ¿Hay algún elemento al que no podéis acceder?
* ¿El orden de navegación tiene sentido?
* ¿Podéis cerrar el modal?

Anotad al menos **dos problemas**.

<p class="write-line"></p>
<p class="write-line"></p>

<details class="aside aside--help">
  <summary>Estoy atascado · me he quedado encerrado y no puedo seguir</summary>
  <p>Enhorabuena: acabáis de encontrar un problema, no de tener uno. Antes de rescataros con el ratón, anotad exactamente dónde os quedasteis.</p>
  <ol>
    <li>Si el foco desaparece y no sabéis dónde está, probad a seguir pulsando <code>Tab</code> y mirad si reaparece más abajo. Un foco invisible es un fallo, no un misterio.</li>
    <li>Si el modal no se cierra con <code>Esc</code> ni llegáis al botón de cerrar, eso es una trampa de foco. Es de los problemas más graves que existen.</li>
    <li>Si al pulsar <code>Enter</code> sobre algo que parece un botón no pasa nada, mirad el HTML: probablemente sea un <code>div</code>.</li>
    <li>Si el foco salta a un sitio raro, comparad el orden del HTML con el orden visual. Suelen no coincidir.</li>
    <li>Para desbloquearos sin ratón: <code>F6</code> o <code>Ctrl</code> + <code>L</code> os llevan a la barra de direcciones y podéis recargar.</li>
  </ol>
</details>

### Lo que acabáis de descubrir

Una web no debería exigir un ratón para usar sus funciones principales. Se navega con teclado por discapacidad motora, por una lesión temporal, con un dispositivo adaptado, con un lector de pantalla o simplemente por preferencia.

> **La funcionalidad principal tiene que poder manejarse con el teclado.**

#### El foco

Cuando pulsáis `Tab`, algún elemento recibe el **foco**. Y tenéis que poder ver cuál.

Si el CSS contiene esto:

```css
*:focus {
    outline: none;
}
```

hemos eliminado la única señal que le dice al usuario dónde está. La página se ve más limpia y se vuelve muchísimo más difícil de usar. Es una de las líneas de CSS más dañinas que existen.

### Segunda prueba · las imágenes

Mirad las imágenes de la página e imaginad que no podéis verlas. ¿Cómo sabríais qué representan?

```html
<img src="portatil.jpg" alt="Portátil gris de 14 pulgadas">
```

Pero no todo `alt` sirve. `alt="imagen"` no aporta nada, y `alt="imagen123.jpg"` tampoco. Una imagen puramente decorativa puede llevar `alt=""`, precisamente para que el lector de pantalla la ignore en lugar de leer un nombre de fichero.

La pregunta correcta no es «¿qué se ve aquí?», sino:

> **¿Qué información perdería el usuario si no pudiera ver esta imagen?**

### Tercera prueba · el color

Imaginad un formulario donde lo único que indica el error es el color del borde:

<div class="compare-pair">
  <div>
    <p class="compare-label">Insuficiente</p>
    <p class="compare-body">Borde verde si el campo es correcto, rojo si no lo es. Y nada más.</p>
  </div>
  <div>
    <p class="compare-label">Suficiente</p>
    <p class="compare-body">El borde cambia de color <em>y además</em> aparece un mensaje que dice qué pasa.</p>
  </div>
</div>

La información no debería depender **únicamente del color**. Se puede reforzar con texto, iconos, mensajes, patrones o etiquetas.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 1</p>
  <ul class="checklist">
    <li>Habéis recorrido la web entera sin tocar el ratón.</li>
    <li>Tenéis anotados al menos dos problemas concretos, con el paso donde ocurren.</li>
    <li>Sabéis explicar qué es el foco y por qué debe verse.</li>
    <li>Sabéis para qué sirve <code>alt</code> y cuándo debe ir vacío.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Una web que funciona técnicamente, ¿es accesible?</li>
    <li>¿Qué tecla recorre los controles de una página?</li>
    <li>¿Todas las imágenes necesitan una descripción?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · No. Que el código haga lo que se le pidió no dice nada sobre si una persona puede usarlo.</p>
  <p>2 · <code>Tab</code>, y <code>Shift</code> + <code>Tab</code> para volver atrás.</p>
  <p>3 · No. Las decorativas llevan <code>alt=""</code> para que el lector de pantalla las salte. Lo que no vale es no poner el atributo.</p>
</details>

---

## Sesión 2 · Las cuatro ideas de la accesibilidad

### WCAG

Existe un conjunto internacional de recomendaciones:

<p class="term">WCAG · Web Content Accessibility Guidelines</p>

No vamos a memorizar sus criterios. Nos interesan los cuatro principios que los ordenan, y que se recuerdan por sus iniciales en inglés:

<p class="term">POUR</p>

| Principio | La pregunta | Problemas típicos |
| --------- | ----------- | ----------------- |
| **P**erceptible | ¿Puede el usuario recibir la información? | Imágenes sin alternativa, contraste bajo, vídeo sin subtítulos, información solo por color |
| **O**perable | ¿Puede manejar la interfaz? | Botones inalcanzables con teclado, foco invisible, menús que exigen ratón, controles diminutos |
| **U**nderstandable | ¿Entiende qué pasa y qué debe hacer? | Errores incomprensibles, navegación inconsistente, formularios sin instrucciones |
| **R**obust | ¿Puede interpretarlo la tecnología que usa? | HTML no semántico, componentes inventados que ninguna tecnología asistiva reconoce |

#### Perceptible

<div class="compare-pair">
  <div>
    <p class="compare-label">Mal</p>
    <p class="compare-body">«Los campos rojos son obligatorios.»</p>
  </div>
  <div>
    <p class="compare-label">Bien</p>
    <p class="compare-body">«Los campos marcados con * son obligatorios.»</p>
  </div>
</div>

#### Comprensible

<div class="compare-pair">
  <div>
    <p class="compare-label">Mal</p>
    <p class="compare-body">«Error 483.»</p>
  </div>
  <div>
    <p class="compare-label">Bien</p>
    <p class="compare-body">«La contraseña debe contener al menos 8 caracteres.»</p>
  </div>
</div>

Un buen mensaje de error no dice que algo ha fallado: dice cómo arreglarlo.

#### Robusto

Esto puede parecer un botón:

```html
<div onclick="comprar()">Comprar</div>
```

Pero semánticamente sigue siendo un `div`: no recibe foco, no responde a `Enter`, y un lector de pantalla no lo anuncia como botón. Lo correcto es:

```html
<button onclick="comprar()">Comprar</button>
```

El navegador y las tecnologías asistivas ya saben qué es un botón. Reconstruirlo a mano significa reconstruir también todo lo que un botón hace gratis.

### HTML semántico

HTML no sirve solo para colocar cosas en pantalla: describe **qué es cada cosa**. `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<button>`, `<label>`, `<form>`, `<h1>`, `<h2>`.

Usar el elemento correcto casi siempre es mejor que reconstruirlo todo a base de `<div>`.

#### Formularios

<div class="compare-pair">
  <div>
    <p class="compare-label">Solo se ve</p>
    <p class="compare-body"><code>&lt;input type="text" placeholder="Correo"&gt;</code></p>
  </div>
  <div>
    <p class="compare-label">Además se entiende</p>
    <p class="compare-body"><code>&lt;label for="email"&gt;Correo electrónico&lt;/label&gt;</code><br><code>&lt;input id="email" type="email"&gt;</code></p>
  </div>
</div>

El `placeholder` desaparece en cuanto se empieza a escribir. La etiqueta no. Y la relación entre etiqueta y campo queda declarada, no sugerida visualmente.

#### Jerarquía de títulos

No se elige `h1`, `h4` o `h2` por el tamaño de letra que traen. Los encabezados describen la estructura del documento:

<figure class="diagram">
  <figcaption>Una jerarquía que tiene sentido</figcaption>
  <ol class="flow">
    <li>h1 · Tienda</li>
    <li>h2 · Ordenadores</li>
    <li>h3 · Portátiles · h3 · Sobremesa</li>
    <li>h2 · Accesorios</li>
  </ol>
</figure>

Un usuario de lector de pantalla navega saltando entre encabezados. Si la jerarquía está rota, ha perdido el índice del documento. Del tamaño se encarga el CSS.

### ARIA

Quizá encontréis atributos como `aria-label`, `aria-expanded` o `role`. ARIA sirve para dar información adicional sobre componentes que HTML no cubre.

Pero hay una regla que ahorra muchos problemas:

> **Si existe un elemento HTML nativo que hace el trabajo, úsalo antes que ARIA.**

Primero HTML correcto. Después, y solo si hace falta, ARIA. Un `div` con cinco atributos ARIA suele ser peor que un `button`.

### Primera tarea · Clasificar barreras

Marcad qué principio afecta a cada problema. Puede afectar a más de uno; lo que se evalúa es el razonamiento.

| Problema                                 | P | O | U | R |
| ---------------------------------------- | - | - | - | - |
| Imagen sin texto alternativo             |   |   |   |   |
| Botón imposible de usar con teclado      |   |   |   |   |
| Mensaje de error incomprensible          |   |   |   |   |
| `div` usado como botón                   |   |   |   |   |
| Contraste muy bajo                       |   |   |   |   |
| Foco invisible                           |   |   |   |   |

WCAG no es una colección arbitraria de reglas. Detrás de cada criterio hay una de estas cuatro preguntas: ¿puedo percibirlo?, ¿puedo utilizarlo?, ¿puedo entenderlo?, ¿puede interpretarlo la tecnología que uso?

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 2</p>
  <ul class="checklist">
    <li>Sabéis explicar los cuatro principios con vuestras palabras.</li>
    <li>Tenéis un ejemplo propio de cada uno.</li>
    <li>Sabéis por qué un <code>button</code> es mejor que un <code>div</code> con <code>onclick</code>.</li>
    <li>Tenéis la tabla de clasificación completa.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué significan las cuatro letras de POUR?</li>
    <li>¿Por qué un <code>placeholder</code> no sustituye a un <code>label</code>?</li>
    <li>¿Cuándo se usa ARIA?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Perceptible, Operable, Understandable (comprensible) y Robust (robusto).</p>
  <p>2 · Porque desaparece al escribir, muchas tecnologías asistivas no lo tratan como nombre del campo, y suele tener contraste insuficiente.</p>
  <p>3 · Cuando no existe un elemento HTML nativo que haga el trabajo. Nunca para arreglar un elemento mal elegido.</p>
</details>

---

## Sesión 3 · Auditar la web

Volvemos a la web problemática, ahora con método. No vamos a comprobarlo todo: vamos a combinar tres aproximaciones, y ninguna basta sola.

<figure class="diagram">
  <figcaption>Las tres capas de una auditoría</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Automática</li>
    <li>Manual</li>
    <li>Razonamiento</li>
  </ol>
</figure>

### Lo que detecta una herramienta, y lo que no

Lighthouse y axe DevTools encuentran contraste insuficiente, atributos ausentes, estructura incorrecta, nombres accesibles que faltan y algunos problemas de ARIA. Es mucho, y en poco tiempo.

Pero supongamos que sacáis esto:

<p class="single-node single-node--mono">Accessibility 100</p>

¿Significa que la web es accesible? No. Significa que esa herramienta no ha encontrado nada de lo que sabe buscar. Ninguna herramienta automática puede juzgar si un `alt` describe de verdad la imagen, si la navegación se entiende, si el orden del foco es lógico, si un mensaje es suficientemente claro o si la interacción resulta usable.

> **Automatizar una auditoría no sustituye a probar la web.**

### Qué revisamos

| Bloque | Preguntas |
| ------ | --------- |
| Teclado | ¿Llego a todo? ¿El foco se ve? ¿El orden tiene sentido? ¿Puedo cerrar lo que abro? |
| Imágenes | ¿Tienen alternativa cuando la necesitan? ¿Esa alternativa sirve de algo? |
| Formularios | ¿Cada campo tiene etiqueta? ¿Los errores se entienden y dicen cómo corregirse? |
| Color y contraste | ¿Se lee bien? ¿El color es el único indicador de algo? |
| HTML | ¿Es semántico? ¿Los encabezados tienen jerarquía? ¿Los controles son controles reales? |

### Segunda tarea · La auditoría

Ejecutad Lighthouse y axe DevTools y **guardad el resultado inicial**. Pero no copiéis la lista: para cada problema importante hay que decir a quién afecta y cuánto. El primero lo hacemos juntos.

<p class="stage">Paso 1 · Te enseño uno</p>

<dl class="worked">
  <dt>Problema</dt>
  <dd>El botón «Añadir al carrito» es un <code>div</code> con <code>onclick</code>. No recibe foco y no responde a <code>Enter</code>.</dd>
  <dt>¿A quién afecta?</dt>
  <dd>A cualquiera que no use ratón: teclado, lector de pantalla, conmutador, control por voz. También a quien tenga una lesión temporal.</dd>
  <dt>¿Qué le impide hacer?</dt>
  <dd>Comprar. No es que le cueste más: no puede completar la acción principal del sitio.</dd>
  <dt>¿Cómo lo hemos detectado?</dt>
  <dd>Con el teclado, en la sesión 1. Lighthouse no lo marcó: para la herramienta es un <code>div</code> perfectamente válido.</dd>
  <dt>Prioridad</dt>
  <dd>Alta. Bloquea la tarea principal y la corrección es de una línea.</dd>
</dl>

Fijaos en dos cosas. La prioridad no sale de la gravedad técnica sino de **qué deja de poder hacer una persona**. Y el problema más grave de la página no lo encontró la herramienta automática: lo encontrasteis vosotros apartando el ratón.

<p class="stage stage--guided">Paso 2 · Lo hacemos juntos</p>

Coged ahora el problema del foco invisible y rellenad las mismas cinco filas.

<dl class="answer">
  <dt>Problema</dt>
  <dd></dd>
  <dt>¿A quién afecta?</dt>
  <dd></dd>
  <dt>¿Qué le impide hacer?</dt>
  <dd></dd>
  <dt>¿Cómo lo hemos detectado?</dt>
  <dd></dd>
  <dt>Prioridad</dt>
  <dd></dd>
</dl>

<p class="stage stage--solo">Paso 3 · Hazlo tú</p>

Completad entre cinco y ocho problemas.

| Problema | A quién afecta | Qué le impide hacer | Cómo lo detectamos | Prioridad |
| -------- | -------------- | ------------------- | ------------------ | --------- |
|          |                |                     |                    |           |
|          |                |                     |                    |           |
|          |                |                     |                    |           |
|          |                |                     |                    |           |
|          |                |                     |                    |           |

### Priorizar

No todos los errores pesan igual:

<div class="compare-pair">
  <div>
    <p class="compare-label">Problema A</p>
    <p class="compare-body">Un usuario no puede completar una compra sin ratón.</p>
  </div>
  <div>
    <p class="compare-label">Problema B</p>
    <p class="compare-body">Una imagen decorativa tiene una descripción poco elegante.</p>
  </div>
</div>

Los dos son fallos de accesibilidad. Solo uno impide usar el producto. Priorizad cruzando tres cosas: **impacto**, **frecuencia** y **dificultad de corrección**.

### Tercera tarea · La IA como ayudante

<div class="prompt">
  <p class="prompt-label">Prompt estructurado</p>
  <p class="flow-role">Tarea</p>
  <p>Revisa este componente desde el punto de vista de la accesibilidad. No modifiques todavía el código.</p>
  <p class="flow-role">Alcance</p>
  <p>Revisa HTML semántico, navegación por teclado, nombres accesibles, formularios, gestión del foco y uso del color.</p>
  <p class="flow-role">Formato de salida</p>
  <ol>
    <li>Problema.</li>
    <li>Evidencia en el código: archivo y línea.</li>
    <li>A qué usuarios afecta.</li>
    <li>Corrección propuesta.</li>
  </ol>
  <p class="flow-role">Restricción</p>
  <p>No propongas atributos ARIA si existe un elemento HTML nativo que resuelva el problema.</p>
</div>

Copilot puede detectar un problema real, pasar otro por alto, exagerar la gravedad de un tercero, recomendar ARIA innecesaria o proponer una solución incorrecta. Clasificad cada recomendación importante como **aceptar**, **rechazar** o **investigar**. La decisión sigue siendo vuestra.

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 3</p>
  <ul class="checklist">
    <li>Resultado inicial de Lighthouse y axe, guardado.</li>
    <li>Prueba manual con teclado, documentada.</li>
    <li>Entre cinco y ocho problemas, cada uno con su usuario afectado.</li>
    <li>Prioridad asignada y justificada.</li>
    <li>Al menos un problema que la herramienta automática no detectó.</li>
    <li>Plan de corrección escrito. Todavía sin tocar el código.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>Un Lighthouse de accesibilidad de 100, ¿qué demuestra?</li>
    <li>¿Qué tres cosas se cruzan para priorizar una barrera?</li>
    <li>Nombrad un problema que ninguna herramienta automática puede detectar.</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que esa herramienta no ha encontrado ninguno de los problemas que sabe buscar. No que la web sea utilizable.</p>
  <p>2 · Impacto, frecuencia y dificultad de corrección.</p>
  <p>3 · Si un <code>alt</code> describe realmente la imagen, si el orden del foco es lógico, o si un mensaje se entiende. Todo eso requiere juicio.</p>
</details>

---

## Sesión 4 · Corregir y comprobar

El objetivo de hoy es convertir el diagnóstico en evidencia:

<figure class="diagram">
  <figcaption>Lo que hay que poder demostrar</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Auditoría</li>
    <li>Cambio</li>
    <li>Evidencia</li>
  </ol>
</figure>

No basta con decir «hemos mejorado la accesibilidad». Hay que enseñar qué problema existía y qué cambió.

### Las correcciones habituales

**Navegación por teclado.** Un `div` con `onclick` pasa a ser un `button`, y con él llegan gratis el foco, la activación con `Enter` y `Espacio`, y el anuncio correcto en un lector de pantalla.

**El foco.** No lo elimines sin sustituirlo:

```css
button:focus-visible {
    outline: 3px solid;
    outline-offset: 3px;
}
```

Lo importante no es copiar ese CSS: es que el usuario pueda ver dónde está.

**Formularios.** Cada campo con su `label` asociado por `for` e `id`. Y los errores, así:

<div class="compare-pair">
  <div>
    <p class="compare-label">Antes</p>
    <p class="compare-body">«Error.»</p>
  </div>
  <div>
    <p class="compare-label">Después</p>
    <p class="compare-body">«Introduce un correo electrónico válido.»</p>
  </div>
</div>

**Imágenes.** Tres preguntas: si es informativa, necesita una alternativa útil; si es decorativa, `alt=""`; si contiene información compleja, probablemente esa información deba estar también en el contenido de la página.

**Color y contraste.** Que se lea en condiciones distintas, y que el color nunca sea el único portador de un estado: acompañadlo siempre de texto o de un icono con su propio significado.

### ¿Y si la corrección afea el diseño?

Accesible no significa feo. Un buen diseño puede ser atractivo, usable y accesible a la vez, y conseguir las tres es exactamente en qué consiste el oficio. Si vuestra única forma de hacer accesible algo es estropearlo, casi siempre hay una tercera opción que no habéis buscado.

<details class="aside aside--help">
  <summary>Estoy atascado · lo he corregido y no sé si ha servido</summary>
  <ol>
    <li>Volved a hacer la prueba del teclado desde el principio. Es la comprobación más rápida y la que más problemas destapa.</li>
    <li>Comprobad el cambio en el elemento concreto, no en la puntuación global. Lighthouse puede subir sin que el problema esté resuelto.</li>
    <li>Si cambiasteis un <code>div</code> por un <code>button</code>, revisad que el CSS siga aplicándose: los botones traen estilos propios del navegador.</li>
    <li>Si añadisteis <code>label</code>, comprobad que el <code>for</code> coincide exactamente con el <code>id</code>. Un error de una letra lo deja sin efecto y no da ningún aviso.</li>
    <li>Si pusisteis ARIA, quitadla y probad si funciona igual. Si funciona igual, sobraba.</li>
  </ol>
</details>

### Cuarta tarea · La segunda auditoría

Repetid Lighthouse y axe, la navegación con teclado, los formularios, el foco y las imágenes, y revisad uno a uno los problemas que identificasteis al principio.

| Problema           | Antes        | Cambio                 | Después   |
| ------------------ | ------------ | ---------------------- | --------- |
| Navegación teclado | No funciona  | Botones semánticos     | Funciona  |
| Foco               | Invisible    | Estilo `focus-visible` | Visible   |
| Imágenes           | Sin `alt`    | Alternativas revisadas | Corregido |
| Formulario         | Sin `label`  | Etiquetas asociadas    | Corregido |
| Contraste          | Insuficiente | Colores ajustados      | Mejorado  |

### Quinta tarea · La prueba cruzada

Intercambiad el ordenador con otra pareja. **No expliquéis qué habéis cambiado.**

La otra pareja tiene que navegar solo con teclado, completar el formulario, encontrar los controles principales e interpretar los mensajes de error.

Si necesitan que les expliquéis cómo se usa vuestra web, todavía hay un problema de diseño. Y es la prueba más honesta de toda la unidad, porque nadie es buen juez de la interfaz que acaba de tocar.

---

### Por qué esto importa profesionalmente

La accesibilidad no es solo una buena práctica voluntaria. En Europa hay requisitos legales para determinados productos y servicios digitales.

Desde el **28 de junio de 2025**, el Acta Europea de Accesibilidad aplica requisitos comunes a servicios de comercio electrónico, banca, transporte, comunicaciones electrónicas y libros electrónicos, entre otros ámbitos. No todas las empresas ni todas las situaciones tienen las mismas obligaciones, y no hace falta que os convirtáis en abogados.

Pero sí conviene entender esto:

> **La accesibilidad puede ser un requisito técnico, social y legal del producto que estáis desarrollando.**

### Producto final

Entregaréis el **repositorio corregido** y una **auditoría de dos páginas como máximo**.

#### Página 1 · Diagnóstico

El resultado inicial de las herramientas automáticas y entre cinco y ocho problemas. De cada uno: descripción, usuario afectado, prioridad y evidencia.

#### Página 2 · Mejora

Las correcciones realizadas, el resultado posterior y la comparación antes/después. Más dos cosas que valen tanto como el resto:

* **Un problema que la herramienta automática no detectó.**
* **Una recomendación de la IA que aceptasteis, rechazasteis o modificasteis**, y por qué.

### Evaluación

| Criterio                                       | Puntos |
| ---------------------------------------------- | -----: |
| Detección razonada de barreras                 |      2 |
| Comprensión de los principios de accesibilidad |    1,5 |
| Priorización de problemas                      |      1 |
| **Calidad técnica de las correcciones**        | **2,5** |
| **Comprobación manual y automática**           | **1,5** |
| Uso crítico de IA                              |    0,5 |
| Claridad de la entrega                         |      1 |

No obtiene mejor nota quien saque un Lighthouse de 100: una puntuación automática no demuestra por sí sola que una página sea accesible. Lo que se evalúa es esta cadena completa:

<figure class="diagram">
  <figcaption>Lo que sí puntúa</figcaption>
  <ol class="flow">
    <li>Barrera</li>
    <li>Usuario afectado</li>
    <li>Evidencia</li>
    <li>Prioridad</li>
    <li>Corrección</li>
    <li>Comprobación</li>
  </ol>
</figure>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · entrega</p>
  <ul class="checklist">
    <li>Auditoría inicial guardada, automática y manual.</li>
    <li>Entre cinco y ocho barreras, cada una con su usuario afectado.</li>
    <li>Correcciones aplicadas y verificadas una a una.</li>
    <li>Un problema documentado que las herramientas no detectaron.</li>
    <li>Una recomendación de IA discutida, no solo aceptada.</li>
    <li>Otra pareja ha podido usar vuestra web sin explicaciones.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Cuál es la prueba de accesibilidad más rápida que podéis hacer en cinco minutos?</li>
    <li>¿Por qué un <code>button</code> ahorra trabajo frente a un <code>div</code> con <code>onclick</code>?</li>
    <li>¿Qué añade la prueba cruzada que no da ninguna herramienta?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Apartar el ratón e intentar usar la web solo con el teclado.</p>
  <p>2 · Porque trae foco, activación con teclado y anuncio correcto en tecnologías asistivas sin escribir una línea. Reconstruirlo significa reimplementar todo eso.</p>
  <p>3 · Alguien que no sabe cómo funciona vuestra interfaz. Vosotros ya no podéis no saberlo.</p>
</details>

---

## Lo que debes recordar

### Las cuatro preguntas

No hacen falta cientos de criterios WCAG. Bastan cuatro preguntas:

<figure class="diagram">
  <figcaption>POUR, en cuatro preguntas</figcaption>
  <ol class="flow">
    <li>¿Puedo percibirlo?</li>
    <li>¿Puedo utilizarlo?</li>
    <li>¿Puedo entenderlo?</li>
    <li>¿Puede interpretarlo la tecnología que uso?</li>
  </ol>
</figure>

Y antes de publicar cualquier web:

> **Aparta el ratón e intenta usarla solo con el teclado.** Es la mejor prueba de accesibilidad que se puede hacer en menos de cinco minutos.

### La checklist para vuestro trabajo

| Área | Preguntas |
| ---- | --------- |
| Teclado | ¿Se usa sin ratón? ¿El foco se ve? ¿El orden tiene sentido? |
| HTML | ¿Es semántico? ¿Los botones son botones? ¿La jerarquía de encabezados tiene sentido? |
| Imágenes | ¿Tienen alternativa cuando la necesitan, y vacía cuando no? |
| Formularios | ¿Cada campo tiene etiqueta? ¿Los errores dicen cómo corregirse? |
| Color | ¿Hay contraste suficiente? ¿Dependo solo del color? |
| Contenido | ¿Los textos y las acciones se entienden? |
| Automatización | ¿Qué dicen Lighthouse y axe? ¿He probado además a mano? |

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| Accesibilidad | Diseñar sin barreras innecesarias para usar el producto |
| WCAG | Las recomendaciones internacionales de accesibilidad web |
| POUR | Perceptible, Operable, Comprensible y Robusto |
| Foco | El elemento que recibe el teclado en cada momento, y que debe verse |
| Trampa de foco | Cuando el teclado entra en un componente y no puede salir |
| `alt` | La alternativa textual de una imagen; vacía si es decorativa |
| HTML semántico | Usar el elemento que significa lo que la cosa es |
| Nombre accesible | El texto con el que una tecnología asistiva anuncia un control |
| ARIA | Información adicional para lo que HTML no cubre; nunca un parche |
| Contraste | La diferencia de luminosidad entre texto y fondo |
| Tecnología asistiva | Lector de pantalla, conmutador, ampliador, control por voz |
| axe | Extensión de auditoría automática de accesibilidad |
| EAA | El Acta Europea de Accesibilidad, aplicable desde junio de 2025 |

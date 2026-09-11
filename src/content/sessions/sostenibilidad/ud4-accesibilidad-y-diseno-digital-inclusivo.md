---
title: "Accesibilidad y diseño digital inclusivo"
label: "UD4 · Proyecto"
section: "ud-04"
order: 4
lang: "es"
summary: "¿Puede utilizar tu web todo el mundo? Una aplicación puede funcionar perfectamente y ser inutilizable para bastante gente. Aprendemos a encontrar esas barreras, a corregirlas y a demostrar que la web es mejor después."
duration: "4 horas · 4 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Auditoría y mejora de accesibilidad. Una actividad acumulativa por unidad, con evidencias y aportación individual."
outcomes:
  - "Detectar barreras de accesibilidad probando la web, no solo puntuándola."
  - "Explicar los cuatro principios de la WCAG con ejemplos propios."
  - "Usar el teclado como primera prueba de accesibilidad de cualquier interfaz."
  - "Escribir HTML semántico y textos alternativos que sirvan para algo."
  - "Priorizar las barreras por a quién afectan y cuánto le impiden hacer."
  - "Corregir y demostrar la mejora con evidencia, no con una puntuación."
requirements:
  - "Guía de arranque y materiales de esta unidad, enlazados en la página."
  - "Materiales del caso y herramientas indicadas en la unidad."
priorKnowledge:
  - "Las unidades anteriores de este módulo. No se requiere Servidor, Intermodular ni el otro módulo transversal."
date: "2026-09-09"
---

<p class="lead">Auditoría y mejora de accesibilidad. Cada sesión introduce los conceptos que necesita y continúa una misma actividad de la unidad. Conserva sus resultados para revisarlos y utilizarlos después.</p>

## Cómo trabajar esta unidad

Son 4 sesiones de una hora: 10 minutos de explicación, 45 de trabajo guiado y 5 de cierre. Los ejemplos ampliados son material de consulta durante la práctica; no añaden otra clase teórica ni tareas obligatorias.

Abre la [guía de arranque y evaluación](/es/docencia/talleres-transversales/). Incluye archivos, herramientas y alternativas de acceso. Para los casos utiliza la [ficha común](/teaching/transversales/casos.pdf). No se necesita el CRUD de Servidor ni el workflow de Intermodular. Quien ya conozca una herramienta utiliza ese conocimiento para justificar y comprobar la actividad nueva, sin repetir un trabajo ya evaluado.

## Actividad y criterios de evaluación

**Auditoría y mejora de accesibilidad.** La actividad se construye durante las sesiones de la unidad: cada avance incorpora el resultado, su comprobación y las decisiones que lo justifican. Cada integrante debe poder explicar su aportación.

Esta actividad se valora sobre 10 puntos y aporta **4/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Cada integrante registra y explica su aportación. La rúbrica se conoce desde el inicio:

| Criterio                                       | Puntos |
| ---------------------------------------------- | -----: |
| Detección razonada de barreras                 |      2 |
| Comprensión de los principios de accesibilidad |    1,5 |
| Priorización de problemas                      |      1 |
| **Calidad técnica de las correcciones**        | **2,5** |
| **Comprobación manual y automática**           | **1,5** |
| Uso crítico de IA                              |    0,5 |
| Claridad del trabajo                         |      1 |

En cada criterio, una evidencia ausente no permite acreditar el logro; una evidencia incompleta requiere revisión; una evidencia correcta permite comprobar el resultado; el logro completo añade una justificación coherente y reconoce sus límites. Los puntos se asignan según el grado de logro del criterio, no por cantidad de archivos, commits o texto. Consulta la guía para revisar y volver a presentar los criterios pendientes.

## Sesión 1 · Experimentar las barreras

**Punto de partida.** Actividad «Auditoría y mejora de accesibilidad», sesión 1 de 4. Abre los materiales enlazados y crea el registro de la unidad. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

La accesibilidad permite que personas con capacidades y formas de interacción distintas utilicen el producto. El **foco** indica qué elemento recibe el teclado; debe verse y moverse en un orden comprensible. Un control que solo responde al ratón puede impedir completar una compra.

Trabajaremos con la rama `barreras` de PixelStore, preparada para esta actividad. No es la continuación automática de la versión optimizada: conserva tu trabajo de UD3 y abre esta copia separada. Así las mediciones y correcciones de una actividad no se pierden al comenzar otra.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Sigue el apartado de accesibilidad de la guía para obtener una copia `pixelstore-a11y` de la rama `barreras`. Arráncala en el puerto 8081 y abre su URL. No cambies de rama sobre modificaciones sin guardar de UD3.
2. Recorre menú, productos, carrito y formulario con ratón para reconocer el servicio. Escribe qué resultado debería poder conseguir también una persona que usa teclado.
3. Aparta el ratón y repite con Tab, Shift+Tab, Enter, Espacio y Escape. Registra dónde se pierde el foco, no se alcanza un control o no se puede cerrar un diálogo.
4. Anota al menos dos barreras con paso exacto, resultado esperado, resultado observado y usuario afectado. Una captura ayuda, pero no sustituye describir la secuencia de teclas.
5. Revisa una imagen informativa y un mensaje de error. Explica qué información se pierde si no se ve la imagen o no se distingue el color. Guarda la evidencia inicial antes de corregir.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Hay barreras reproducibles y una explicación de su impacto. No se pide utilizar un lector de pantalla sin haber mostrado antes cómo hacerlo.


## Sesión 2 · Las cuatro ideas de la accesibilidad

**Punto de partida.** Actividad «Auditoría y mejora de accesibilidad», sesión 2 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Las pautas de accesibilidad organizan requisitos en cuatro principios: perceptible, operable, comprensible y robusto. Sirven para clasificar problemas, pero citar una sigla no los resuelve. HTML semántico aporta comportamiento y significado: un `button` no es solo una caja con apariencia de botón.

**ARIA** describe roles, estados y propiedades a tecnologías de apoyo. No añade por sí sola interacción de teclado. Antes de utilizarla, comprobamos si un elemento HTML nativo cubre la necesidad y qué nombre, rol y estado debe comunicar el control.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### WCAG

Existe un conjunto internacional de recomendaciones:

<p class="term">WCAG · Web Content Accessibility Guidelines</p>

La versión vigente es la **WCAG 2.2**, publicada por el W3C. Es la referencia que usan las herramientas y la que citan los requisitos legales.

No vamos a memorizar sus criterios. Nos interesan los cuatro principios que los ordenan, y que se recuerdan por sus iniciales en inglés:

<p class="term">POUR</p>

| Principio | La pregunta | Problemas típicos |
| --------- | ----------- | ----------------- |
| **P**erceptible | ¿Puede el usuario recibir la información? | Imágenes sin alternativa, contraste bajo, vídeo sin subtítulos, información solo por color |
| **O**perable | ¿Puede manejar la interfaz? | Botones inalcanzables con teclado, foco invisible, menús que exigen ratón, controles diminutos |
| **U**nderstandable | ¿Entiende qué pasa y qué debe hacer? | Errores incomprensibles, navegación inconsistente, formularios sin instrucciones |
| **R**obust | ¿Puede interpretarlo la tecnología que usa? | HTML no semántico, componentes inventados que ninguna tecnología asistiva reconoce |

##### Perceptible

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

##### Comprensible

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

##### Robusto

Esto puede parecer un botón:

```html
<div onclick="comprar()">Comprar</div>
```

Semánticamente, sin embargo, sigue siendo un `div`: no recibe foco, no responde a `Enter`, y un lector de pantalla no lo anuncia como botón. Lo correcto es:

```html
<button onclick="comprar()">Comprar</button>
```

El navegador y las tecnologías asistivas ya saben qué es un botón. Reconstruirlo a mano significa reconstruir también todo lo que un botón hace gratis.

#### HTML semántico

HTML no sirve solo para colocar cosas en pantalla: describe **qué es cada cosa**. `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<button>`, `<label>`, `<form>`, `<h1>`, `<h2>`.

Usar el elemento correcto casi siempre es mejor que reconstruirlo todo a base de `<div>`.

##### Formularios

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

El `placeholder` desaparece en cuanto se empieza a escribir; la etiqueta permanece. La relación entre etiqueta y campo queda declarada, no sugerida visualmente.

##### Jerarquía de títulos

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

#### ARIA

Es posible que aparezcan atributos como `aria-label`, `aria-expanded` o `role`. ARIA sirve para dar información adicional sobre componentes que HTML no cubre.

Existe una regla que evita la mayoría de los problemas:

> **Si existe un elemento HTML nativo que hace el trabajo, úsalo antes que ARIA.**

Primero HTML correcto. Después, y solo si hace falta, ARIA. Un `div` con cinco atributos ARIA suele ser peor que un `button`.

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Clasifica las barreras registradas según los cuatro principios y explica una clasificación. Si afecta a varios, señala el principal y justifica la relación.
2. Localiza un control que parezca botón y consulta su HTML en el inspector. Compara su etiqueta con un botón nativo y anota las diferencias de teclado y significado.
3. Aplica la corrección resuelta de la guía a un control de tu copia: etiqueta semántica, texto reconocible y foco visible. Conserva las clases necesarias para mantener el diseño.
4. Repite el recorrido de teclado y comprueba la vista de accesibilidad del inspector: nombre y rol del control. No concluyas que ARIA sobra solo porque visualmente nada cambia al quitarla.
5. Registra barrera, cambio y resultado. Revisa si la corrección mantiene la función del control y el aspecto usable antes de continuar con otros elementos.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Has corregido y comprobado una barrera concreta. Puedes explicar qué aporta HTML y qué información añade, cuando es necesaria, ARIA.


## Sesión 3 · Auditar la web

**Punto de partida.** Actividad «Auditoría y mejora de accesibilidad», sesión 3 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Una herramienta automática detecta ciertos problemas, pero no puede decidir por completo si el recorrido de una persona es usable. La auditoría combina pruebas automáticas con tareas manuales y conserva la evidencia de cada hallazgo.

La prioridad depende del efecto sobre el acceso. Un fallo que impide cerrar un diálogo puede bloquear toda una tarea. Es más útil describir esa consecuencia que recopilar avisos sin comprobarlos. La puntuación global ayuda a orientarse, pero no certifica accesibilidad por sí sola.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Ejecuta Lighthouse y, si está disponible en el aula, axe siguiendo la guía. Guarda fecha, URL y resultados iniciales de la copia de accesibilidad.
2. Elige avisos que puedas localizar en la página. Para cada uno identifica elemento, usuario afectado, evidencia y comprobación necesaria; no conviertas cada aviso automáticamente en un fallo confirmado.
3. Añade los hallazgos manuales y completa una matriz de cinco a ocho barreras distintas. Evita contar varias veces el mismo problema solo porque lo detecten dos herramientas.
4. Ordena las barreras por bloqueo de tareas e impacto. Continúa corrigiendo las prioritarias con cambios pequeños y repite la prueba específica después de cada uno.
5. Contrasta una propuesta con el asistente o la ficha de revisión del aula. Acepta, modifica o rechaza con un motivo y evidencia; el diagnóstico sigue siendo responsabilidad de la pareja.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

La matriz integra pruebas manuales y automáticas, con prioridades y primeras correcciones. Los hallazgos no confirmados están identificados como tales.


## Sesión 4 · Corregir y comprobar

**Punto de partida.** Actividad «Auditoría y mejora de accesibilidad», sesión 4 de 4. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

La corrección termina cuando la persona puede realizar la tarea y la información necesaria llega también a las tecnologías de apoyo. Un formulario necesita etiquetas asociadas y errores comprensibles; el foco debe verse; una imagen informativa necesita una alternativa útil. No todo se resuelve cambiando colores o añadiendo atributos.

Repetiremos las pruebas sobre los mismos elementos y pediremos otra revisión. El resultado demuestra mejoras concretas; no permite afirmar cumplimiento total de todas las pautas si no se ha realizado esa evaluación completa.

<details class="aside aside--extra">
<summary>Consultar ejemplos y conceptos de esta sesión</summary>

#### Las correcciones habituales

**Navegación por teclado.** Un `div` con `onclick` pasa a ser un `button`, y con él llegan gratis el foco, la activación con `Enter` y `Espacio`, y el anuncio correcto en un lector de pantalla.

**El foco.** No lo elimines sin sustituirlo:

```css
button:focus-visible {
    outline: 3px solid;
    outline-offset: 3px;
}
```

Lo importante no es copiar ese CSS: es que el usuario pueda ver dónde está.

**Formularios.** Cada campo con su `label` asociado mediante `for` e `id`. Los errores se declaran así:

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

</details>

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre la matriz priorizada y completa las correcciones pendientes que puedan verificarse en el tiempo disponible. Identifica por separado lo corregido y lo pendiente.
2. Repite navegación, formulario, diálogo y comprobación de nombre/rol/estado. Si cambiaste una etiqueta o estilo, verifica también que no se rompió una función anterior.
3. Ejecuta de nuevo las herramientas con las mismas condiciones. Para cada barrera completa antes, cambio y después; una mejora global de puntuación no sustituye esta fila.
4. Intercambia el ordenador con otra pareja y pídele un recorrido definido sin explicaciones. Registra dónde necesita ayuda y corrige o documenta el problema observado.
5. Entrega proyecto y matriz resumida en diagnóstico y mejoras, con enlaces a las pruebas. Cada integrante explica una corrección. Describe el alcance revisado y evita declarar que toda la web es accesible por haber pasado una herramienta.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:**

Se evalúa barrera → impacto → corrección → comprobación. No se vuelve a evaluar el ahorro de transferencia de UD3 como si fuera esta actividad.


## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

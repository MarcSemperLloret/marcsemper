---
title: "Cerrar y publicar la versión"
label: "UD3 · Publicar"
section: "ud-03"
order: 3
lang: "es"
summary: "Escribir el README que hace comprensible el repositorio para quien llega de fuera, publicar la primera versión con nombre, y auditar el rastro de trabajo del compañero contra la definición de terminado."
duration: "3 horas · 1 sesión"
modality: "Taller · el 80 % de la sesión es trabajo del alumnado"
deliverable: "README profesional, versión v1.0.0 publicada como release, y una auditoría cruzada con sus issues abiertas."
date: "2026-09-09"
outcomes:
  - "Escribir un README dirigido a quien no conoce el proyecto ni a quien lo hizo."
  - "Etiquetar una versión y publicarla como release con sus notas."
  - "Explicar qué significan las tres cifras de un número de versión."
  - "Auditar un repositorio ajeno contra la definición de terminado y comunicar los hallazgos por issues."
  - "Reconocer en vuestro propio rastro lo que se va a mirar en la defensa."
requirements:
  - "El portfolio de la UD2 publicado, con los cinco checks en verde."
priorKnowledge:
  - "El circuito completo y el pipeline propio de las unidades anteriores."
---

<p class="lead">El primer proyecto se acaba hoy. Acabar no es dejar de tocarlo: es dejarlo en un estado que otra persona pueda entender, y ponerle un nombre a ese estado para poder volver a él.</p>

<div class="rule">
  <p class="rule-label">Lo que queda por hacer no es código</p>
  <p>Vuestro portfolio funciona, está publicado y tiene cinco puertas vigilándolo. Le faltan las dos cosas que separan un proyecto de clase de un proyecto que se puede enseñar: una puerta de entrada para quien llega sin contexto, y un punto en la historia al que se pueda señalar y decir «esto es la versión 1».</p>
</div>

## Sesión 6 · Cerrar el primer proyecto

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>Alguien abre vuestro repositorio sin conoceros. ¿Cuánto tarda en saber qué es y en verlo funcionando?</li>
    <li>Vuestro portfolio de hoy y el de dentro de dos meses serán distintos. ¿Cómo señalaríais el de hoy?</li>
    <li>Si os pidiera la prueba de que habéis trabajado nueve horas repartidas en seis semanas, ¿qué me enseñaríais?</li>
  </ol>
</div>

---

### Se explica

#### El README es la portada, no la documentación

Un repositorio público recibe dos tipos de visita: quien va a usar el proyecto y quien va a decidir si le interesáis vosotros. Los dos leen lo mismo, los dos dedican menos de un minuto, y los dos se van si en ese minuto no entienden qué están mirando.

<div class="compare-pair">
  <div>
    <p class="compare-label">README de clase</p>
    <p class="compare-body">«Proyecto de la primera evaluación del módulo de Proyecto Intermodular. Alumno: … Curso: 2.º DAW.» Está escrito para el profesor, que ya sabe todo eso. A cualquier otro lector no le dice nada.</p>
  </div>
  <div>
    <p class="compare-label">README de portfolio</p>
    <p class="compare-body">Qué es, un enlace para verlo funcionando, con qué está hecho y cómo se publica. Está escrito para alguien que no os conoce y que decide en un minuto si sigue leyendo.</p>
  </div>
</div>

El vuestro va a tener seis apartados y ninguno más. Un README largo no se lee.

| Apartado | Qué contiene | Error habitual |
| -------- | ------------ | -------------- |
| **Título y una frase** | Qué es esto, en una línea, sin adjetivos | Poner el nombre del módulo en lugar del proyecto |
| **Enlace a la web** | La URL pública, arriba del todo y visible | Enterrarlo al final o no ponerlo |
| **Captura** | Una imagen de la página real | Sin ninguna, obligando a abrir el enlace para saber si merece la pena |
| **Cómo está hecho** | Tecnologías, en una lista corta y honesta | Inflar la lista con cosas que se usaron cinco minutos |
| **Cómo se despliega** | Qué lo dispara, quién lo hace y adónde va | Explicarlo como si el lector conociera vuestro repositorio |
| **Qué comprueba el CI** | Las cuatro comprobaciones, en una frase cada una | No mencionarlo, que es tirar a la basura lo mejor que tenéis |

<div class="rule">
  <p class="rule-label">El apartado que os diferencia</p>
  <p>El último. Cualquiera de vuestra promoción puede enseñar una web con su nombre; casi ninguno va a poder enseñar un repositorio donde cada cambio pasó por una pull request que no se podía fusionar si el HTML era inválido, si había un enlace muerto o si la accesibilidad bajaba de 90. Eso no se cuenta solo: hay que escribirlo.</p>
</div>

#### Una versión es un punto al que se puede volver

<p class="term">Etiqueta (tag)</p>

Un nombre puesto a un commit concreto. A diferencia de una rama, no se mueve: `v1.0.0` apunta hoy y dentro de dos años exactamente al mismo estado del proyecto.

<p class="term">Release</p>

La publicación de una etiqueta, con un título y unas notas que cuentan qué hay dentro. La etiqueta es para la máquina; la release es para las personas.

Sin versiones, la única forma de referirse al proyecto es «como estaba el martes» o pegar un identificador de commit de cuarenta caracteres. Con versiones se puede decir «lo que enseñé en la entrevista era la 1.0» y volver a verlo exactamente igual.

#### Las tres cifras

<dl class="worked">
  <dt>La forma</dt>
  <dd><code>MAYOR.MENOR.PARCHE</code>, por ejemplo <code>1.4.2</code>. Cada cifra responde a una pregunta distinta.</dd>
  <dt>Sube el parche</dt>
  <dd>Habéis arreglado algo sin añadir nada: un enlace roto, un contraste insuficiente, una errata. De <code>1.0.0</code> a <code>1.0.1</code>.</dd>
  <dt>Sube la menor</dt>
  <dd>Hay algo nuevo que antes no estaba, y lo de antes sigue funcionando igual. Una sección más en el portfolio: de <code>1.0.1</code> a <code>1.1.0</code>.</dd>
  <dt>Sube la mayor</dt>
  <dd>Algo cambia de forma incompatible con lo anterior. En vuestro portfolio será raro; en la API de la segunda evaluación, no.</dd>
  <dt>Y las cifras de la derecha se ponen a cero</dt>
  <dd>De <code>1.4.2</code>, al añadir una sección, se pasa a <code>1.5.0</code>. No a <code>1.5.2</code>.</dd>
</dl>

Hoy publicáis la `1.0.0`, y no porque el portfolio esté terminado: porque **está completo para lo que prometía**. Un proyecto que nunca llega a la 1.0 es un proyecto que su autor no se atreve a dar por bueno.

#### Lo que voy a mirar en diciembre

No lo guardo en secreto, porque no es una trampa: es la definición de terminado de la UD1 aplicada a seis semanas de trabajo.

<figure class="diagram">
  <figcaption>El rastro que se evalúa</figcaption>
  <ol class="flow">
    <li><span class="flow-role">Ritmo</span>Commits y pull requests repartidos por semanas, no concentrados en dos noches.</li>
    <li><span class="flow-role">Trazabilidad</span>Cada pull request dice qué issue cierra, y cada issue se cerró desde su pull request.</li>
    <li><span class="flow-role">Puertas</span>Ninguna fusión con checks en rojo, ningún commit directo a la rama principal.</li>
    <li><span class="flow-role">Revisión</span>Revisiones vuestras en el repositorio de vuestra pareja que dicen qué se comprobó.</li>
    <li><span class="flow-role">Cierre</span>Una versión publicada con notas que se entienden sin abrir el código.</li>
  </ol>
</figure>

Hoy vais a auditar ese rastro en el repositorio de otra persona, que es la mejor manera de aprender a mirar el vuestro.

---

### Se trabaja

#### Bloque A · El README, por el circuito de siempre

<p class="stage stage--solo">Individual: issue, rama, pull request</p>

**1 · La issue.** «Escribir el README del portfolio», con criterio de aceptación: *una persona que no conoce el proyecto entiende qué es, lo ve funcionando y sabe cómo se publica, sin preguntar nada*.

**2 · La captura.** Antes de escribir, haced una captura de vuestro portfolio ya terminado y guardadla en el repositorio, por ejemplo en `docs/portada.png`. Que no pese diez megas: el job de calidad de la UD2 os lo va a recordar si se os va la mano.

**3 · Escribid los seis apartados.** Sin rellenos y sin disculpas. Nada de «es un proyecto sencillo hecho para clase»: quien lee decide eso solo.

<details class="aside aside--help">
  <summary>Cómo se escribe el apartado del despliegue sin sonar a manual interno</summary>
  <p>Mal: «Se ejecuta el workflow de Azure». Bien: «Cada cambio que entra en <code>main</code> se publica automáticamente en Azure Static Web Apps mediante GitHub Actions; las pull requests se publican antes en un entorno temporal para poder revisarlas.» Dos frases, y el lector ya sabe cómo funciona vuestro despliegue sin abrir un solo fichero.</p>
</details>

**4 · Insignias, si queréis.** Una línea bajo el título que muestra en vivo si el CI está en verde:

```markdown
![CI](https://github.com/VUESTRO-USUARIO/portfolio/actions/workflows/ci.yml/badge.svg)
```

No es decoración: es la primera cosa que mira alguien que sabe de esto.

**5 · Pull request, revisión y fusión.** Como siempre. Y aquí la revisión de vuestra pareja es más útil que nunca, porque es literalmente el lector para el que estáis escribiendo: pedidle que os diga qué **no** entendió.

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación del bloque A</p>
  <ul class="checklist">
    <li>Los seis apartados, en ese orden, y ninguno más.</li>
    <li>La URL pública visible sin hacer scroll.</li>
    <li>La captura se ve en el repositorio, no es un enlace roto.</li>
    <li>Vuestra pareja ha dicho qué parte no entendió, y lo habéis corregido.</li>
  </ul>
</div>

#### Bloque B · La versión 1.0.0

<p class="stage stage--solo">Individual, desde <code>main</code> actualizada</p>

**1 · La etiqueta.** Se pone sobre `main`, con el README ya fusionado:

```bash
git switch main
git pull
git tag -a v1.0.0 -m "Primera version publica del portfolio"
git push origin v1.0.0
```

La `-a` crea una etiqueta con autor, fecha y mensaje, no solo un puntero. Y el `push` de la etiqueta es aparte: `git push` a secas no la sube.

**2 · La release.** En GitHub: pestaña **Releases** → **Draft a new release** → en **Choose a tag** elegid `v1.0.0` → título `v1.0.0 · Portfolio publicado`.

**3 · Las notas.** Pulsad **Generate release notes**: GitHub redacta un borrador con las pull requests fusionadas. No lo dejéis así. Ese borrador es materia prima, y encima de él escribís tres o cuatro líneas que respondan a lo único que le importa a quien lo lea: **qué puede hacer con esta versión que antes no podía**.

<div class="compare-pair">
  <div>
    <p class="compare-label">Notas generadas</p>
    <p class="compare-body">«Merge pull request #12 from usuario/12-seccion-proyectos». Cierto, y no le dice nada a nadie que no estuviera dentro del proyecto.</p>
  </div>
  <div>
    <p class="compare-label">Notas escritas</p>
    <p class="compare-body">«Primera versión pública. Portfolio con presentación, proyectos y contacto, desplegado automáticamente en Azure. Cada cambio pasa por cuatro comprobaciones: HTML válido, enlaces vivos, formato y un mínimo de accesibilidad de 90.»</p>
  </div>
</div>

**4 · Publicad** con **Publish release**, y comprobad que aparece en la portada del repositorio, a la derecha.

#### Bloque C · Auditoría cruzada

<p class="stage stage--guided">Por parejas, cada uno sobre el repositorio del otro</p>

Esto no es revisar una pull request: es mirar seis semanas de trabajo de golpe. Recorred el repositorio de vuestra pareja con esta lista y **anotad la evidencia concreta**, no la impresión.

| Qué se comprueba | Dónde se mira | Qué se anota |
| ---------------- | ------------- | ------------ |
| Ritmo de trabajo | Pestaña Insights → Commits, o el listado de pull requests con sus fechas | En cuántas semanas distintas hay actividad |
| Trazabilidad | Cada pull request cerrada | Cuántas dicen qué issue cierran y cuántas no |
| Puertas respetadas | Historial de <code>main</code> | Si hay algún commit que no venga de una fusión |
| Calidad del README | Abrirlo como si no conocierais el proyecto | Qué no se entiende, exactamente |
| La release | Pestaña Releases | Si las notas se entienden sin abrir el código |

**Cómo se comunica lo que encontréis.** Abriendo **issues en su repositorio**. Podéis hacerlo aunque no seáis colaboradores: es público. Una issue por hallazgo, con el mismo formato que usáis para las vuestras: título con verbo, y en el cuerpo qué habéis visto y dónde.

<div class="rule">
  <p class="rule-label">Una auditoría no es una lista de defectos</p>
  <p>Se abren issues de lo que se puede arreglar, y se dice también lo que está bien, porque el que lo hizo necesita saber qué conservar. Una auditoría que solo señala fallos se lee como un ataque y se ignora entera. Y al revés: una que solo dice «está todo bien» no ha mirado.</p>
</div>

<dl class="answer">
  <dt>Semanas distintas con actividad en el repositorio auditado</dt>
  <dd></dd>
  <dt>Pull requests sin issue asociada</dt>
  <dd></dd>
  <dt>Lo que no se entendió del README, con la frase exacta</dt>
  <dd></dd>
  <dt>Lo mejor que habéis visto, y por qué</dt>
  <dd></dd>
</dl>

#### Bloque D · Responder a la auditoría

<p class="stage stage--solo">Individual, en vuestro repositorio</p>

Ahora tenéis issues abiertas por otra persona en vuestro propio proyecto. Es la primera vez, y es exactamente lo que os va a pasar en un trabajo.

1. Leedlas todas antes de contestar ninguna.
2. Las que aceptéis, al tablero y a arreglar por el circuito de siempre.
3. Las que no, se cierran **con un comentario que explica por qué**. «No lo veo» no es una respuesta; «la captura pesa 800 KB a propósito porque el job de calidad no se queja y la calidad de imagen importa aquí» sí lo es.
4. Si habéis arreglado algo, publicad `v1.0.1` repitiendo el bloque B. Es un parche: nada nuevo, algo corregido.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>README con los seis apartados, <code>v1.0.0</code> publicada con notas escritas, y la auditoría del compañero hecha con sus issues abiertas.</span></div>
  <div><strong>Si lo tenéis</strong><span>Las issues que os han abierto, contestadas todas: arregladas o cerradas con motivo.</span></div>
  <div><strong>Reto</strong><span>Haced que la insignia del CI no sea lo único automático de vuestro README: añadid al final una línea que enlace a la última release, y comprobad que sigue siendo correcta después de publicar la <code>v1.0.1</code>.</span></div>
</div>

---

### Cierre

<div class="checkpoint">
  <p class="checkpoint-label">Producto de la unidad</p>
  <ul class="checklist">
    <li>README de seis apartados, entrado por pull request y revisado.</li>
    <li><code>v1.0.0</code> etiquetada y publicada como release, con notas escritas por vosotros.</li>
    <li>Una auditoría hecha en el repositorio de vuestra pareja, con sus issues.</li>
    <li>Las issues que os abrieron a vosotros, todas contestadas.</li>
    <li>El primer proyecto de la evaluación, cerrado.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Para quién se escribe un README, y qué apartado es el que os diferencia del resto?</li>
    <li>¿Qué diferencia hay entre una etiqueta y una rama?</li>
    <li>Habéis arreglado un enlace roto. ¿Qué versión sale?</li>
    <li>Habéis añadido una sección nueva a la <code>1.2.3</code>. ¿Qué versión sale?</li>
    <li>¿Cómo se puede abrir una issue en el repositorio de otra persona sin ser colaborador?</li>
    <li>¿Qué se hace con una issue de la auditoría con la que no estáis de acuerdo?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Para alguien que no conoce el proyecto ni a quien lo hizo. El apartado que os diferencia es el de qué comprueba el CI: casi nadie de vuestra promoción va a poder enseñar eso.</p>
  <p>2 · La rama se mueve según se trabaja; la etiqueta señala un commit concreto y no se mueve nunca.</p>
  <p>3 · Un parche: <code>1.0.1</code>. Nada nuevo, algo corregido.</p>
  <p>4 · <code>1.3.0</code>. Sube la menor y el parche vuelve a cero.</p>
  <p>5 · Porque el repositorio es público. Escribir en su código exigiría permiso; abrir una issue, no.</p>
  <p>6 · Se cierra con un comentario que explica el motivo. Lo que no se hace es cerrarla en silencio.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 7</p>
  <ul class="checklist">
    <li>Vuestro portfolio tiene una release publicada y un README que vuestra pareja entendió.</li>
    <li>Las issues de la auditoría están todas cerradas, arregladas o contestadas.</li>
    <li>Traéis pensado qué datos gestionaría el CRUD del segundo proyecto: en la sesión 7 empieza, y el circuito ya no se explica, se usa.</li>
  </ul>
</div>

## Lo que debes recordar

### El método

| Idea | Por qué |
| ---- | ------- |
| **El README se escribe para quien no os conoce** | Es la única página que van a leer antes de decidir si siguen. Un README dirigido al profesor no sirve el día que el lector es otro |
| **Lo que comprueba vuestro CI hay que contarlo** | Es lo mejor que tenéis y no se ve desde fuera. Si no está escrito, no existe |
| **Una versión es un punto fijo** | Permite decir «esto es lo que enseñé» y volver a verlo idéntico dentro de dos años |
| **Las notas generadas son un borrador** | Cuentan qué pull requests entraron. Quien lee quiere saber qué puede hacer ahora que antes no podía |
| **Llegar a la 1.0 es una decisión** | No significa terminado: significa completo para lo que prometía |
| **Una issue en un repositorio ajeno no necesita permiso** | Por eso la revisión cruzada funciona sin dar acceso de escritura a nadie |

### El vocabulario de la unidad

| Concepto | Significa |
| -------- | --------- |
| README | La portada del repositorio. Se lee en menos de un minuto o no se lee |
| Etiqueta | Un nombre fijo puesto a un commit concreto. No se mueve nunca |
| Release | La publicación de una etiqueta, con título y notas, dirigida a personas |
| Versionado semántico | <code>MAYOR.MENOR.PARCHE</code>: incompatible, añadido, corregido |
| Notas de versión | Qué puede hacer alguien con esta versión que antes no podía |
| Insignia | Imagen que muestra en vivo el estado del CI en el README |
| Auditoría | Mirar el rastro completo de un proyecto contra una lista acordada, y comunicar lo hallado por issues |

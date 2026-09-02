---
title: "Arquitectura por capas con Spring"
label: "UD4 · Arquitectar"
section: "ud-04"
order: 4
lang: "es"
summary: "Reorganizar un controller que ya hace demasiado en capas con responsabilidades claras, y comprobar por primera vez la lógica con tests automáticos."
duration: "12 horas · 2 semanas · 6 sesiones"
modality: "Refactorización guiada · 50 % guía / 50 % autonomía"
deliverable: "La aplicación reorganizada en controller, service y repository, con los primeros tests del service en verde."
date: "2026-09-02"
outcomes:
  - "Reconocer los síntomas de un controller que acumula responsabilidades."
  - "Separar controller, service y repository y justificar qué va en cada capa."
  - "Usar inyección de dependencias en lugar de construir colaboradores a mano."
  - "Situar las reglas de negocio en el service y protegerlas con tests."
  - "Escribir tests unitarios de un service con JUnit."
requirements:
  - "La API rediseñada de la UD3."
priorKnowledge:
  - "DTO, validación y errores centralizados."
  - "Interfaces y clases en Java."
---

<p class="lead">El código funciona y ya no se puede tocar sin miedo. Esta unidad no añade funcionalidad: la reorganiza, y por primera vez deja tests que avisan cuando algo se rompe.</p>

<div class="rule">
  <p class="rule-label">Progresión de autonomía</p>
  <p>Andamiaje medio. La primera separación se hace en común; la refactorización final la dirige el alumnado con una lista de criterios.</p>
</div>

## Semana 8 · Cuando funcionar ya no es suficiente

## Sesión 22 · El controller monstruoso

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> a reconocer, con medidas y no con intuición, que una clase hace demasiado.</li>
    <li><strong>2. Haz:</strong> levanta el mapa de problemas de tu propio controlador.</li>
    <li><strong>3. Comprueba:</strong> sabes decir, para cada línea, qué responsabilidad cumple y qué la haría cambiar.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántas líneas tiene hoy tu <code>TareaController</code>? Míralo antes de seguir leyendo.</li>
    <li>¿Qué código está repetido entre tu controlador de tareas y el de proyectos?</li>
    <li>Si quisieras comprobar la regla «una tarea nace sin completar», ¿qué tendrías que arrancar?</li>
  </ol>
</div>

### La unidad más rara del curso

Esta unidad **no añade ni una funcionalidad**. Al terminar, tu API responderá exactamente lo mismo que hoy: mismas rutas, mismos códigos, mismo JSON. Tu colección de Postman seguirá en verde sin tocar una sola petición.

Y aun así es de las más importantes, porque lo que cambia es **quién puede seguir tocando ese código dentro de seis meses**.

<div class="rule">
  <p class="rule-label">Qué es una refactorización</p>
  <p>Cambiar cómo está escrito el código <strong>sin cambiar lo que hace</strong>. Si el comportamiento observable cambia, no has refactorizado: has hecho otra cosa y probablemente la has roto.</p>
  <p>Por eso esta unidad llega después de la UD3 y no antes. Refactorizar sin una forma de comprobar que nada se ha roto es reescribir a ciegas, y tú ya tienes esa forma: la colección.</p>
</div>

### Mide antes de opinar

«Este código es un desastre» no es un diagnóstico: es una impresión. Vamos a sustituirla por números y por hechos.

<p class="stage">Medida 1 · Cuenta las responsabilidades</p>

Abre tu `TareaController` y clasifica **cada línea** en una de estas categorías:

| Categoría | Qué es |
| :--- | :--- |
| **Web** | Leer la petición, elegir el código de estado, construir la respuesta |
| **Datos** | Guardar, buscar, recorrer, filtrar, borrar de la lista |
| **Reglas** | Decidir qué se puede hacer y qué no, o qué valor toma algo |
| **Traducción** | Pasar de DTO a modelo o al revés |
| **Infraestructura** | Generar identificadores, construir URLs |

Cuenta cuántas categorías distintas aparecen. En un controlador salido de la UD3 salen normalmente **cuatro o cinco**.

<p class="stage">Medida 2 · Cuenta los motivos de cambio</p>

Esta es mejor que contar líneas. Pregúntate qué tendría que ocurrir en el mundo para tener que abrir este archivo:

<figure class="diagram">
  <figcaption>Cosas que te obligan a tocar el mismo archivo</figcaption>
  <ol class="flow flow--before">
    <li>Cambia una ruta o un código de estado · motivo <strong>web</strong></li>
    <li>Se pasa de una lista en memoria a una base de datos · motivo <strong>almacenamiento</strong></li>
    <li>Cambia una regla, como qué prioridad tiene una tarea nueva · motivo <strong>negocio</strong></li>
    <li>Se publica un campo distinto · motivo <strong>contrato</strong></li>
  </ol>
</figure>

Cuatro motivos independientes, cuatro personas distintas que podrían tocar el mismo archivo la misma semana, y cuatro oportunidades de romper algo que no tiene nada que ver con lo que se venía a cambiar.

<p class="term">Una clase, un motivo de cambio</p>

Es el principio de responsabilidad única, y se enuncia así y no como «una clase hace una cosa», que no significa nada. La pregunta útil siempre es: **¿qué tendría que pasar para que tuviera que abrir este archivo?** Si hay más de una respuesta, hay más de una clase.

<p class="stage">Medida 3 · Busca lo repetido</p>

Pon tu `TareaController` y tu `ProyectoController` uno al lado del otro. Vas a encontrar, casi seguro:

* Un método `buscar(id)` privado, prácticamente idéntico.
* Un campo `siguienteId` y la misma línea que lo incrementa.
* La misma estructura de bucle para filtrar.
* El mismo `throw new RecursoNoEncontradoException(...)`.

<div class="rule">
  <p class="rule-label">Por qué duplicar es caro</p>
  <p>No por escribirlo dos veces: eso son treinta segundos. Es caro porque <strong>el día que haya que corregirlo, se corregirá en uno solo</strong>.</p>
  <p>Y el que quede sin corregir no dará error: seguirá funcionando como funcionaba, que es exactamente lo que hace que nadie lo encuentre.</p>
</div>

### Las tres preguntas que delatan el problema

Las medidas dicen que hay algo raro. Estas tres preguntas dicen **qué te va a costar**.

<p class="stage">Pregunta 1 · ¿Cómo pruebo una regla?</p>

Quieres comprobar que una tarea nueva nace sin completar. Hoy, para comprobarlo, necesitas: compilar el proyecto, arrancar Tomcat, abrir un puerto, abrir Postman, escribir un JSON, enviarlo y mirar la respuesta.

Todo eso **para comprobar un `false`**.

Y no es solo que sea lento: es que si falla, no sabes si ha fallado la regla, la ruta, el mapper, la validación o el JSON que escribiste. La prueba no señala el culpable.

<p class="stage">Pregunta 2 · ¿Y si esa regla la necesita otro?</p>

Imagina tres peticiones perfectamente razonables:

1. Importar tareas desde un CSV.
2. Crear tareas automáticamente cada lunes.
3. Crear una tarea desde otra parte de la aplicación, sin HTTP.

Las tres tienen que aplicar las mismas reglas: asignar el id, nacer sin completar, comprobar que el proyecto existe.

Hoy **esas reglas viven dentro de un método anotado con `@PostMapping`**. Solo se pueden ejecutar si alguien hace una petición HTTP. Las tres situaciones te obligarían a copiar el código, y ya sabes lo que pasa con el código copiado.

<p class="stage">Pregunta 3 · ¿Qué pasa en la UD5?</p>

Dentro de dos unidades, la lista en memoria se sustituye por PostgreSQL. Mira tu controlador y responde honestamente: **¿cuántos métodos tendrías que tocar?**

Todos los que mencionen `tareas`. Es decir, todos. Un cambio de almacenamiento acaba tocando la capa web, que no tiene nada que ver con dónde se guardan los datos.

### Adónde vamos

La solución no es un truco de Spring: es una idea vieja y sencilla. Separar por **motivo de cambio**.

<figure class="diagram">
  <figcaption>Tres capas, tres motivos de cambio</figcaption>
  <ol class="flow flow--row flow--chain">
    <li><strong>Controller</strong><br>habla HTTP</li>
    <li><strong>Service</strong><br>decide reglas</li>
    <li><strong>Repository</strong><br>guarda y recupera</li>
  </ol>
</figure>

| Capa | Cambia cuando… | No sabe nada de… |
| :--- | :--- | :--- |
| Controller | Cambia una ruta, un código o el contrato | Dónde se guardan los datos |
| Service | Cambia una regla de negocio | HTTP, ni de SQL |
| Repository | Cambia el almacenamiento | Reglas de negocio |

Fíjate en la columna de la derecha, que es la que de verdad importa: **el service no sabrá que existe HTTP**. Por eso se podrá probar sin arrancar un servidor, y por eso el CSV y la tarea programada podrán reutilizarlo.

Hoy no escribimos nada de eso. Hoy lo diagnosticamos, porque una refactorización que no sabes justificar es un capricho.

### Práctica guiada · El mapa de tu controlador

Coge tu `TareaController` y produce esta tabla. Una fila por método:

| Método | Web | Datos | Reglas | Traducción | Infra |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `lista()` | | | | | |
| `detalle()` | | | | | |
| `crear()` | | | | | |
| `reemplazar()` | | | | | |
| `modificar()` | | | | | |
| `eliminar()` | | | | | |

Marca cada casilla donde ese método haga algo de esa categoría. Después responde:

1. ¿Cuál es el método con más casillas marcadas? ¿Por qué crees que es ese?
2. ¿Hay alguna columna marcada en **todos** los métodos? ¿Qué significa eso?
3. Si mañana cambias de almacenamiento, ¿cuántas casillas se ven afectadas?

### Ahora tú · El inventario de problemas

Escribe un archivo `PROBLEMAS.md` con cuatro apartados. Sé concreto: nada de «está desordenado».

<p class="stage stage--solo">1 · Responsabilidades mezcladas</p>

Lista, con número de línea, los sitios donde una misma clase hace cosas de categorías distintas. Formato: *«líneas 34-41: el método `crear` decide una regla de negocio y además construye una URL»*.

<p class="stage stage--solo">2 · Lógica duplicada</p>

Lista lo que está repetido entre tus controladores, con las dos ubicaciones. Para cada uno, escribe **qué pasaría si alguien corrigiera solo una de las dos copias**.

<p class="stage stage--solo">3 · Puntos difíciles de probar</p>

Lista las reglas de negocio de tu aplicación y, para cada una, qué haría falta arrancar para comprobarla hoy.

<p class="stage stage--solo">4 · Efecto de un cambio</p>

Elige uno de estos tres cambios y **cuenta exactamente cuántos archivos y métodos tendrías que tocar**:

* Pasar de lista en memoria a base de datos.
* Que una tarea nueva nazca con prioridad `media` en lugar de sin prioridad.
* Publicar un campo nuevo en la respuesta.

Este archivo es la justificación de la unidad entera. En la sesión 27 lo repasarás y tendrás que poder tachar cada línea.

### Reto · Diagnostica sin ver el código

Un compañero te describe su API así, sin enseñarte nada:

> «Tengo dos controladores. En cada uno, un `ArrayList` y un contador. Cuando creo algo compruebo dentro del `@PostMapping` que el nombre no esté repetido recorriendo la lista. Para el informe mensual tengo un tercer controlador que también recorre las dos listas, así que las tiene declaradas como `static` para poder acceder a ellas desde fuera.»

1. Enumera **al menos cuatro** problemas distintos, ordenados por gravedad.
2. Uno de ellos es bastante peor que los demás y no es la duplicación. Identifícalo y explica qué le va a ocurrir el día que dos peticiones lleguen a la vez.
3. Para cada problema, di en qué capa debería vivir eso según el mapa de hoy.
4. Tu compañero responde: «pero funciona, lo he probado». ¿Qué le contestas? Escribe la respuesta en dos frases, sin condescendencia y con un argumento que pueda comprobar él mismo.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La tabla de categorías por método completa y las tres preguntas respondidas.</span></div>
  <div><strong>Si lo tienes</strong><span><code>PROBLEMAS.md</code> con los cuatro apartados, concretos y con números de línea.</span></div>
  <div><strong>Reto</strong><span>El diagnóstico a ciegas con los cuatro problemas priorizados y el peor identificado.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 22</p>
  <ul class="checklist">
    <li>Sabes enunciar la responsabilidad única como «un motivo de cambio» y no como «hacer una cosa».</li>
    <li>Has clasificado cada método de tu controlador por categorías.</li>
    <li>Tienes localizada la lógica duplicada entre tus dos controladores.</li>
    <li>Puedes explicar por qué hoy no se puede probar una regla sin arrancar el servidor.</li>
    <li><code>PROBLEMAS.md</code> está escrito y es concreto.</li>
    <li>Sabes qué es una refactorización y qué la distingue de reescribir.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Cuál es la pregunta que revela si una clase tiene demasiadas responsabilidades?</li>
    <li>¿Por qué es cara la duplicación, si escribirla dos veces cuesta poco?</li>
    <li>Nombra dos situaciones que necesitarían tus reglas de negocio sin pasar por HTTP.</li>
    <li>¿Qué tiene que seguir igual después de una refactorización?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · «¿Qué tendría que ocurrir para que tuviera que abrir este archivo?» Si hay más de una respuesta independiente, hay más de una responsabilidad.</p>
  <p>2 · Porque el día que haya que corregir algo se corregirá en una sola de las copias, y la otra seguirá funcionando como funcionaba, sin dar error y sin que nadie la encuentre.</p>
  <p>3 · Una importación desde un archivo, una tarea programada, otra parte de la aplicación llamando directamente. Ninguna hace una petición HTTP.</p>
  <p>4 · El comportamiento observable: las mismas rutas, los mismos códigos y el mismo JSON. Si eso cambia, no ha sido una refactorización.</p>
</details>

## Sesión 23 · Arquitectura por capas

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> qué va exactamente en cada capa y en qué dirección se permiten las dependencias.</li>
    <li><strong>2. Haz:</strong> extrae el repositorio y el servicio de tu controlador de tareas, paso a paso.</li>
    <li><strong>3. Comprueba:</strong> la colección sigue en verde sin haber tocado ni una petición.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>De tu mapa de ayer: ¿qué categorías aparecían en el método <code>crear</code>?</li>
    <li>¿Qué significa que dos cosas tengan «motivos de cambio distintos»?</li>
    <li>¿Qué tiene que seguir igual al terminar hoy?</li>
  </ol>
</div>

### Las tres capas, sin misticismo

<figure class="diagram">
  <figcaption>Quién llama a quién. Y solo en esa dirección</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>Controller</li>
    <li>Service</li>
    <li>Repository</li>
  </ol>
</figure>

| Capa | Su única pregunta | Vocabulario que usa |
| :--- | :--- | :--- |
| **Controller** | ¿Cómo se expresa esto en HTTP? | Rutas, códigos, DTO, cabeceras |
| **Service** | ¿Qué se puede hacer y con qué reglas? | Tareas, proyectos, «no se puede si…» |
| **Repository** | ¿Cómo guardo y recupero esto? | Listas hoy; tablas y consultas en la UD5 |

<div class="rule">
  <p class="rule-label">La regla de la dirección</p>
  <p>El controller conoce al service. El service conoce al repository. <strong>Y nunca al revés.</strong></p>
  <p>Un repository que llamara a un service, o un service que supiera qué es un código 404, rompería justo lo que se gana: que cada capa pueda cambiar sin arrastrar a las otras.</p>
</div>

La consecuencia más útil, y la que hay que retener: **el service no sabe que existe HTTP**. Ni códigos de estado, ni `ResponseEntity`, ni DTO. Recibe y devuelve objetos del modelo. Por eso mañana lo podrá usar una importación de CSV, y por eso en tres sesiones lo probarás sin arrancar nada.

### Paso 1 · Extrae el repositorio

Empezamos por abajo, porque es la capa que menos depende de las demás.

```java
package com.ejemplo.gestor.repository;

import com.ejemplo.gestor.model.Tarea;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class TareaRepository {

    private final List<Tarea> tareas = new ArrayList<>();
    private int siguienteId = 1;

    public List<Tarea> findAll() {
        return new ArrayList<>(tareas);
    }

    public Optional<Tarea> findById(int id) {
        for (Tarea tarea : tareas) {
            if (tarea.getId() == id) {
                return Optional.of(tarea);
            }
        }
        return Optional.empty();
    }

    public Tarea save(Tarea tarea) {
        if (tarea.getId() == 0) {
            tarea.setId(siguienteId);
            siguienteId = siguienteId + 1;
            tareas.add(tarea);
        }
        return tarea;
    }

    public boolean deleteById(int id) {
        return tareas.removeIf(tarea -> tarea.getId() == id);
    }

    public boolean existsById(int id) {
        return findById(id).isPresent();
    }
}
```

<dl class="worked">
  <dt>Por qué estos nombres y no otros</dt>
  <dd>Son los de Spring Data JPA. En la UD5 esta clase entera desaparecerá y se sustituirá por una interfaz que Spring implementa sola, y si los nombres coinciden, <strong>el service no se enterará del cambio</strong>. Estás preparando ese momento sin saberlo.</dd>
  <dt>Por qué <code>findAll</code> devuelve una copia</dt>
  <dd>Porque si devuelves la lista original, quien la reciba puede añadir o borrar elementos por su cuenta y saltarse el repositorio entero. La copia protege el dato de quien no debería tocarlo.</dd>
  <dt>Por qué el contador vive aquí</dt>
  <dd>Generar identificadores es una responsabilidad del almacenamiento. En la UD5 lo hará la base de datos, y de nuevo nadie más se enterará.</dd>
</dl>

<p class="term">Optional</p>

Una caja que puede contener un valor o estar vacía. Sustituye a devolver `null`, con una ventaja: **el tipo te obliga a considerar el caso vacío**, en lugar de dejarlo al olvido. Se consulta con `isPresent()`, se abre con `get()`, y tiene atajos como `orElseThrow()`.

Es también lo que devuelve `JpaRepository.findById` en la UD5, así que empezamos con él ya.

### Paso 2 · Extrae el servicio

Aquí van las reglas y la coordinación.

```java
package com.ejemplo.gestor.service;

import com.ejemplo.gestor.error.RecursoNoEncontradoException;
import com.ejemplo.gestor.model.Tarea;
import com.ejemplo.gestor.repository.TareaRepository;

import java.util.List;

public class TareaService {

    private final TareaRepository repositorio = new TareaRepository();

    public List<Tarea> listar() {
        return repositorio.findAll();
    }

    public Tarea obtener(int id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("tarea", id));
    }

    public Tarea crear(Tarea tarea) {
        // Regla: una tarea nace sin completar, lo pida quien lo pida.
        tarea.setCompletada(false);
        return repositorio.save(tarea);
    }

    public Tarea reemplazar(int id, Tarea datos) {
        Tarea existente = obtener(id);
        existente.setTitulo(datos.getTitulo());
        existente.setPrioridad(datos.getPrioridad());
        existente.setProyectoId(datos.getProyectoId());
        existente.setCompletada(datos.isCompletada());
        return existente;
    }

    public void eliminar(int id) {
        repositorio.deleteById(id);
    }
}
```

<dl class="worked">
  <dt><code>orElseThrow</code></dt>
  <dd>«Dame el valor, y si la caja está vacía, lanza esto.» Sustituye el <code>if (tarea == null)</code> por una línea que además obliga a decidir qué pasa cuando no está.</dd>
  <dt>Por qué <code>obtener</code> lanza y no devuelve <code>null</code></dt>
  <dd>Porque «pedir una tarea que no existe» es un error del que llama, y quien llama no debería tener que acordarse de comprobarlo. Además, así <code>reemplazar</code> reutiliza <code>obtener</code> y hereda gratis el mismo comportamiento.</dd>
  <dt>La línea del comentario</dt>
  <dd>Esa regla estaba antes dentro de un <code>@PostMapping</code>. Ahora vive donde se puede reutilizar y donde se puede probar. Es literalmente el problema de ayer, resuelto.</dd>
</dl>

<div class="rule">
  <p class="rule-label">¿Puede el service lanzar una excepción que acabará siendo un 404?</p>
  <p>Sí, y conviene entender por qué no rompe la regla de la dirección. <code>RecursoNoEncontradoException</code> <strong>no habla de HTTP</strong>: dice «esto que me pides no existe», que es una afirmación del dominio y sería igual de cierta desde una importación de CSV.</p>
  <p>Quien la traduce a un <code>404</code> es el manejador de la sesión 20, que sí es capa web. El service dice qué ha pasado; el controller decide cómo se cuenta eso por HTTP.</p>
</div>

### Paso 3 · Adelgaza el controlador

```java
@RestController
@RequestMapping("/tareas")
public class TareaController {

    private final TareaService servicio = new TareaService();

    @GetMapping
    public List<TareaResponse> lista() {
        return TareaMapper.aRespuestas(servicio.listar());
    }

    @GetMapping("/{id}")
    public TareaResponse detalle(@PathVariable(name = "id") int id) {
        return TareaMapper.aRespuesta(servicio.obtener(id));
    }

    @PostMapping
    public ResponseEntity<TareaResponse> crear(
            @Valid @RequestBody TareaRequest peticion) {

        Tarea creada = servicio.crear(TareaMapper.aModelo(peticion));

        URI ubicacion = ServletUriComponentsBuilder
                .fromCurrentRequest().path("/{id}")
                .buildAndExpand(creada.getId()).toUri();

        return ResponseEntity.created(ubicacion)
                .body(TareaMapper.aRespuesta(creada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable(name = "id") int id) {
        servicio.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
```

Cada método hace ahora tres cosas y solo tres: **traducir lo que entra, llamar al servicio, traducir lo que sale**. No hay bucles, no hay listas, no hay reglas.

<div class="rule">
  <p class="rule-label">Dónde queda el mapper</p>
  <p>En la capa web, junto al controlador. Traduce entre DTO y modelo, y los DTO <strong>son</strong> el contrato HTTP: si el service usara el mapper, sabría de la existencia de un contrato web que no le incumbe.</p>
  <p>La regla práctica: <strong>los DTO no cruzan hacia dentro.</strong> Al service entran y salen objetos del modelo.</p>
</div>

### La comprobación · nada ha cambiado

Este es el momento de la sesión.

1. Arranca la aplicación.
2. Ejecuta la colección entera de Postman.
3. **Verde de arriba abajo, sin haber tocado ni una petición.**

Has movido de sitio casi todo el código de tu API y quien la consume no se ha enterado de nada. Eso es una refactorización, y esa colección que escribiste en la UD2 es lo que te ha permitido hacerla sin miedo.

<div class="rule">
  <p class="rule-label">Si algo sale en rojo</p>
  <p>No cambies la colección. La colección describe lo que tu API prometía y sigue siendo correcta: <strong>lo que está mal es la refactorización</strong>. Ese rojo es exactamente el aviso para el que la escribiste.</p>
</div>

### Lo que chirría, y es a propósito

Mira estas dos líneas:

```java
private final TareaService servicio = new TareaService();
private final TareaRepository repositorio = new TareaRepository();
```

Funcionan, y tienen tres problemas serios:

<figure class="diagram">
  <figcaption>Lo que rompe construir los colaboradores a mano</figcaption>
  <ol class="flow flow--before">
    <li>El controller <strong>elige</strong> qué servicio usa, así que no se le puede dar otro</li>
    <li>El service decide qué repositorio usa, así que en la UD5 habrá que abrirlo para cambiarlo</li>
    <li class="is-error">Para probar el service en la sesión 26 hará falta su repositorio de verdad, con sus datos</li>
  </ol>
</figure>

Déjalas así hoy. Mañana desaparecen, y entenderás qué se gana porque habrás sentido qué molesta.

### Ahora tú · Las capas de proyectos

1. Crea `ProyectoRepository` con los mismos cinco métodos y los mismos nombres.
2. Crea `ProyectoService` con sus casos de uso.
3. Adelgaza `ProyectoController` hasta que ningún método tenga bucles ni listas.
4. Mueve al service la regla del `409` de la UD3 —el nombre repetido— y explica en un comentario por qué es una regla y no una validación de formato.
5. Ejecuta la colección entera y comprueba que sigue verde.

### Reto · La ruta que cruza dos recursos

`GET /proyectos/{id}/tareas` es interesante porque toca dos recursos a la vez. Tiene que responder `404` si el proyecto no existe y `200` con `[]` si existe y no tiene tareas.

1. Decide **en qué service vive** ese caso de uso, y justifícalo. Hay dos respuestas defendibles.
2. Ese service va a necesitar saber de los dos repositorios, o de otro service. Decide cuál de las dos opciones y explica el criterio.
3. Impleméntalo.
4. Responde: si un service puede llamar a otro service, ¿qué peligro aparece? Piensa en dos servicios que se llamen entre sí.
5. Comprueba con la colección que los dos casos siguen respondiendo lo mismo que en la UD3.

La pregunta 4 no la vamos a resolver hoy, pero tienes que saber verla venir.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Tareas separada en tres capas y la colección en verde.</span></div>
  <div><strong>Si lo tienes</strong><span>Proyectos separado también, con la regla del 409 movida al service.</span></div>
  <div><strong>Reto</strong><span>La ruta anidada resuelta con su decisión justificada y el peligro de la dependencia mutua descrito.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 23</p>
  <ul class="checklist">
    <li>Existen los paquetes <code>repository</code> y <code>service</code>.</li>
    <li>Ningún controlador contiene una lista, un bucle de búsqueda ni un contador.</li>
    <li>Ningún service menciona HTTP, códigos de estado ni DTO.</li>
    <li>La colección entera sigue en verde sin haber tocado ninguna petición.</li>
    <li>Sabes explicar por qué una excepción de dominio en el service no rompe la regla de la dirección.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿En qué dirección se permiten las dependencias entre capas?</li>
    <li>¿Por qué los DTO no entran al service?</li>
    <li>¿Qué gana <code>findAll</code> devolviendo una copia de la lista?</li>
    <li>¿Qué demuestra que la colección siga en verde después de mover todo el código?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Del controller al service y del service al repository. Nunca al revés: una capa no conoce a la que la llama.</p>
  <p>2 · Porque los DTO son el contrato HTTP, y el service no debe saber que existe una API web. Si los conociera, no se podría reutilizar desde una importación de archivos o una tarea programada.</p>
  <p>3 · Que nadie de fuera pueda añadir ni borrar elementos saltándose el repositorio. La lista original queda protegida.</p>
  <p>4 · Que el comportamiento observable no ha cambiado, que es la definición de refactorización. Si algo saliera en rojo, lo incorrecto sería el cambio, no la colección.</p>
</details>

## Sesión 24 · Inyección de dependencias

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> quién construye tus objetos cuando no los construyes tú, y qué se gana con ello.</li>
    <li><strong>2. Haz:</strong> quita todos los <code>new</code> de tus capas y saca el repositorio a una interfaz.</li>
    <li><strong>3. Comprueba:</strong> cambias la implementación del repositorio sin tocar una línea del service.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuántos <code>new</code> hay hoy en tus controladores y servicios?</li>
    <li>De la UD1: ¿qué hace <code>@ComponentScan</code> y qué paquetes recorre?</li>
    <li>Si quisieras probar tu service con datos falsos, ¿podrías hoy? ¿Por qué no?</li>
  </ol>
</div>

### El problema de decidir tú quién es tu colaborador

```java
private final TareaRepository repositorio = new TareaRepository();
```

Esa línea dice tres cosas a la vez, y solo una es asunto del service:

<figure class="diagram">
  <figcaption>Lo que decide una sola línea</figcaption>
  <ol class="flow flow--before">
    <li><strong>Necesito un repositorio.</strong> Esto sí es asunto suyo</li>
    <li>Y va a ser <strong>exactamente este</strong>, nunca otro</li>
    <li>Y lo construyo yo, <strong>ahora</strong>, sin que nadie pueda intervenir</li>
  </ol>
</figure>

Las dos últimas son decisiones que el service no debería estar tomando. Y tienen consecuencias concretas: en la UD5 habrá que abrirlo para cambiar el repositorio, y en la sesión 26 no se podrá probar sin arrastrar el almacenamiento de verdad.

<p class="term">Inversión de control</p>

Que **no seas tú quien construye y conecta los objetos**, sino algo externo. Tú declaras qué necesitas; otro te lo da ya montado.

Es la misma idea del framework de la UD1: no llamas tú, te llaman a ti. Aquí, además, no construyes tú: te construyen.

### El contenedor de Spring

<p class="term">Bean</p>

Un objeto que crea y administra Spring, en lugar de crearlo tú con <code>new</code>.

Al arrancar, y gracias al `@ComponentScan` que ya conoces desde la UD1, Spring recorre tus paquetes buscando clases marcadas, crea **una instancia de cada una** y las guarda. Después mira qué necesita cada una y se las va pasando.

<figure class="diagram">
  <figcaption>Qué ocurre al arrancar la aplicación</figcaption>
  <ol class="flow flow--before">
    <li>Recorre los paquetes buscando clases marcadas como componentes</li>
    <li>Ve que <code>TareaService</code> necesita un <code>TareaRepository</code> en su constructor</li>
    <li>Crea primero el repositorio, porque no necesita nada</li>
    <li>Crea el servicio pasándole ese repositorio</li>
    <li>Crea el controlador pasándole ese servicio</li>
  </ol>
</figure>

Ese orden lo calcula solo. Tú nunca escribes «primero esto y luego aquello».

#### Los estereotipos

Marcar una clase es poner una anotación. Hay varias y **todas hacen lo mismo**: registrar la clase como componente. Se diferencian en lo que le cuentan a quien lee el código.

| Anotación | Para | Añade además |
| :--- | :--- | :--- |
| `@Component` | Cualquier cosa | Nada. Es la genérica |
| `@Service` | Lógica de negocio | Nada técnico: comunica la intención |
| `@Repository` | Acceso a datos | Traduce excepciones de persistencia. Importará en la UD5 |
| `@RestController` | Capa web | Lo que ya sabes desde la UD1 |

Usa la que corresponde a la capa. No es decorativo: alguien que abra tu proyecto sabrá qué es cada clase sin leerla.

### Paso 1 · Marca y pide por constructor

```java
package com.ejemplo.gestor.repository;

import org.springframework.stereotype.Repository;

@Repository
public class TareaRepository {
    // igual que ayer
}
```

```java
package com.ejemplo.gestor.service;

import org.springframework.stereotype.Service;

@Service
public class TareaService {

    private final TareaRepository repositorio;

    public TareaService(TareaRepository repositorio) {
        this.repositorio = repositorio;
    }

    // los métodos, sin cambiar
}
```

```java
@RestController
@RequestMapping("/tareas")
public class TareaController {

    private final TareaService servicio;

    public TareaController(TareaService servicio) {
        this.servicio = servicio;
    }

    // los métodos, sin cambiar
}
```

Ni un `new`. Cada clase **declara lo que necesita** en su constructor y Spring se lo entrega al arrancar.

<div class="rule">
  <p class="rule-label">No hace falta <code>@Autowired</code></p>
  <p>Lo verás en mucho código y en muchos tutoriales. Desde hace años, si una clase tiene <strong>un solo constructor</strong>, Spring lo usa sin que se lo pidas.</p>
  <p>Escribirlo no está mal, pero es ruido. Si lo ves en un ejemplo antiguo, ya sabes qué es.</p>
</div>

<p class="stage">Compruébalo</p>

Añade esto temporalmente al service y arranca:

```java
public TareaService(TareaRepository repositorio) {
    this.repositorio = repositorio;
    System.out.println("Construyendo TareaService con " + repositorio);
}
```

Verás la línea **una sola vez**, al arrancar, y no una por petición. Haz cinco peticiones: no aparece más. Los beans son **únicos y compartidos** por toda la aplicación.

<div class="rule">
  <p class="rule-label">La consecuencia de que sean únicos</p>
  <p>Como hay una sola instancia atendiendo a todos, <strong>un bean no debe guardar datos de una petición concreta</strong>. Si tu service tuviera un campo «la tarea que estoy procesando», dos usuarios simultáneos se pisarían.</p>
  <p>El <code>ArrayList</code> del repositorio sí es estado compartido, y es intencionado: es el almacén, y es de todos. En la UD5 ese papel lo hará la base de datos.</p>
</div>

### Por constructor, y no de otra forma

Verás una alternativa muy extendida:

```java
@Autowired
private TareaRepository repositorio;
```

Funciona. Y es peor, por tres motivos que conviene saber defender:

<div class="compare-pair">
  <div>
    <p class="compare-label">Por campo</p>
    <p class="compare-body">El campo no puede ser <code>final</code>. Las dependencias quedan escondidas en mitad de la clase. Y para probarla sin Spring hay que recurrir a reflexión.</p>
  </div>
  <div>
    <p class="compare-label">Por constructor</p>
    <p class="compare-body">Los campos son <code>final</code>. El constructor enumera todo lo que la clase necesita. Y se puede construir a mano en un test, pasándole lo que quieras.</p>
  </div>
</div>

Hay un cuarto motivo, y es el mejor: **un constructor con seis parámetros se ve feo**, y eso es información. Está diciendo que la clase depende de demasiadas cosas. Con inyección por campo, esa misma clase tiene seis anotaciones repartidas y nadie lo nota.

### Paso 2 · Saca el repositorio a una interfaz

Esto es lo que de verdad compras hoy.

```java
package com.ejemplo.gestor.repository;

import com.ejemplo.gestor.model.Tarea;

import java.util.List;
import java.util.Optional;

public interface TareaRepository {

    List<Tarea> findAll();

    Optional<Tarea> findById(int id);

    Tarea save(Tarea tarea);

    boolean deleteById(int id);

    boolean existsById(int id);
}
```

Y la implementación de hoy:

```java
package com.ejemplo.gestor.repository;

import org.springframework.stereotype.Repository;

@Repository
public class TareaRepositorioEnMemoria implements TareaRepository {
    // exactamente el código de ayer
}
```

**El service no cambia ni una línea.** Sigue pidiendo un `TareaRepository` en su constructor; lo que ocurre es que ahora eso es un contrato y no una clase concreta, y Spring le pasa la única implementación que encuentra.

<div class="rule">
  <p class="rule-label">Lo que acabas de dejar preparado</p>
  <p>En la UD5, <code>TareaRepositorioEnMemoria</code> se borra y en su lugar aparece una interfaz que extiende <code>JpaRepository</code>. Spring la implementa solo.</p>
  <p>Y el service, que ya depende de una interfaz con esos mismos nombres de método, <strong>no se entera</strong>. Cambias dónde se guardan los datos sin abrir la capa que decide las reglas. Eso es exactamente lo que prometían las capas, y hoy es cuando se cobra.</p>
</div>

<p class="stage">Demuéstralo ahora mismo</p>

Crea una segunda implementación que registre cada llamada:

```java
@Repository
@Primary
public class TareaRepositorioConRegistro implements TareaRepository {

    private final TareaRepositorioEnMemoria interno =
            new TareaRepositorioEnMemoria();

    @Override
    public Optional<Tarea> findById(int id) {
        System.out.println("Buscando la tarea " + id);
        return interno.findById(id);
    }

    // el resto, delegando igual
}
```

Arranca y haz una petición: aparece el mensaje. **Has cambiado la implementación del almacenamiento sin tocar el service ni el controller.** Después bórrala o quítale las anotaciones.

`@Primary` es lo que resuelve el empate cuando hay dos candidatos. Sin ella, la aplicación no arranca y dice que hay más de un bean del mismo tipo — pruébalo, porque es un error que te vas a encontrar.

### Cuando el contenedor se queja

| Lo que ves al arrancar | Qué significa | Qué haces |
| :--- | :--- | :--- |
| `NoSuchBeanDefinitionException` | Pide algo que nadie ha registrado | ¿Falta la anotación? ¿La clase está fuera del paquete principal? |
| `NoUniqueBeanDefinitionException` | Hay dos candidatos y no sabe cuál | Marca uno con `@Primary`, o distingue con `@Qualifier` |
| `The dependencies of some of the beans form a cycle` | Dos clases se necesitan mutuamente | Rediseña: es un problema tuyo, no de Spring |

La primera fila enlaza directamente con la UD1: si tu clase no cuelga del paquete de la clase principal, `@ComponentScan` no la ve, y aquí el síntoma ya no es un `404` silencioso sino un error de arranque bien explicado. Ha mejorado.

<div class="rule">
  <p class="rule-label">La tercera fila es la respuesta al reto de ayer</p>
  <p>Preguntábamos qué peligro aparece si un service llama a otro service. Este: que <code>ProyectoService</code> necesite a <code>TareaService</code> y <code>TareaService</code> necesite a <code>ProyectoService</code>. Spring no puede construir ninguno de los dos, porque cada uno necesita al otro terminado.</p>
  <p>Y hace bien en negarse. Una dependencia circular casi siempre significa que <strong>las responsabilidades están mal repartidas</strong>: hay un tercer concepto que no has nombrado, o una de las dos clases está haciendo algo que no le toca.</p>
</div>

### Ahora tú · Quita todos los `new`

1. Marca con su estereotipo todas tus clases de service y repository.
2. Pásalas todas a inyección por constructor.
3. Saca `ProyectoRepository` a interfaz con su implementación en memoria.
4. Comprueba que no queda ningún `new` de un colaborador en controladores ni servicios. El `new Tarea()` de un mapper sí puede quedarse: eso no es un colaborador, es un dato.
5. Ejecuta la colección: verde otra vez, sin tocar nada.

### Reto · Provoca los tres errores

Uno a uno, provócalos, **lee el mensaje entero** y anótalo con tus palabras. Este reto es de diagnóstico, no de código.

1. Quita el `@Service` de `TareaService`. ¿Qué error sale y en qué momento?
2. Deja dos implementaciones de `TareaRepository` sin `@Primary`. ¿Qué error sale? ¿Nombra las dos candidatas el mensaje?
3. Haz que `TareaService` reciba un `ProyectoService` y que `ProyectoService` reciba un `TareaService`. Arranca.

Para cada uno responde: **¿el error aparece al arrancar o al hacer la primera petición?** Y después, la pregunta que importa:

> ¿Por qué es una buena noticia que estos tres fallos se detecten al arrancar y no durante una petición de un usuario?

Deja los tres arreglados antes de terminar.

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Sin ningún <code>new</code> de colaboradores, todo por constructor, y la colección en verde.</span></div>
  <div><strong>Si lo tienes</strong><span>Los dos repositorios sacados a interfaz, con la implementación en memoria detrás.</span></div>
  <div><strong>Reto</strong><span>Los tres errores del contenedor provocados, leídos y explicados, incluida la dependencia circular.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 24</p>
  <ul class="checklist">
    <li>Ninguna clase construye a sus colaboradores con <code>new</code>.</li>
    <li>Todas las dependencias se piden por constructor y sus campos son <code>final</code>.</li>
    <li>Cada clase lleva el estereotipo de su capa.</li>
    <li>Los repositorios son interfaces con una implementación en memoria detrás.</li>
    <li>Has comprobado que los beans se construyen una sola vez.</li>
    <li>Sabes reconocer los tres errores típicos del contenedor.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué tres cosas decidía la línea con <code>new</code>, y cuál de ellas sí era asunto de la clase?</li>
    <li>Da dos motivos para preferir la inyección por constructor a la de campo.</li>
    <li>¿Por qué un bean no debe guardar datos de una petición concreta?</li>
    <li>¿Qué significa que Spring se niegue a arrancar por una dependencia circular?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Que necesita un colaborador, cuál exactamente y quién lo construye. Solo la primera le corresponde: las otras dos las decide ahora el contenedor.</p>
  <p>2 · Los campos pueden ser <code>final</code> y el constructor enumera todas las dependencias a la vista; además la clase se puede construir a mano en un test. Y un constructor con demasiados parámetros avisa de que la clase depende de demasiadas cosas.</p>
  <p>3 · Porque hay una sola instancia atendiendo a todas las peticiones, así que dos usuarios simultáneos se pisarían los datos.</p>
  <p>4 · Que dos clases se necesitan mutuamente y ninguna se puede construir primero. Casi siempre indica que las responsabilidades están mal repartidas y falta un concepto por nombrar.</p>
</details>

## Semana 9 · Reglas protegidas por pruebas

## Sesión 25 · Reglas de negocio en el service

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> repartir reglas entre controllers y repositories hace imposible saber dónde se decide el comportamiento.</li>
    <li><strong>Construye:</strong> casos de uso y reglas de negocio concentrados en servicios comprobables.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **distinguir coordinación de casos de uso, reglas de negocio y acceso a datos**.

### 2. El problema

Repartir reglas entre controllers y repositories hace imposible saber dónde se decide el comportamiento.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido casos de uso y reglas de negocio concentrados en servicios comprobables.</li>
    <li>Puedes explicar qué parte resuelve el problema de partida.</li>
    <li>Has probado al menos un caso correcto y un caso límite o de error.</li>
    <li>El cambio queda integrado en la aplicación común del curso.</li>
  </ul>
</div>

### 8. Antes de irte

1. ¿Qué problema resolvía la decisión principal de hoy?
2. ¿Qué parte podrías modificar mañana sin volver a consultar el ejemplo?
3. ¿Qué prueba distingue una solución que parece funcionar de una que realmente funciona?

<div class="rule">
  <p class="rule-label">Estado del material</p>
  <p>La secuencia, el objetivo y la evidencia ya están definidos. La explicación, el código guiado, la actividad y el reto se completarán al desarrollar esta sesión.</p>
</div>

## Sesión 26 · Primeros tests del service con JUnit

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> comprobar a mano en Postman cada regla después de cada cambio no es sostenible ni demuestra nada al día siguiente.</li>
    <li><strong>Construye:</strong> una clase de tests que cubre el camino correcto y al menos un caso de error de una regla del service.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **escribir tests unitarios que comprueban una regla de negocio sin arrancar el servidor**.

### 2. El problema

Comprobar a mano en Postman cada regla después de cada cambio no es sostenible ni demuestra nada al día siguiente.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido una clase de tests que cubre el camino correcto y al menos un caso de error de una regla del service.</li>
    <li>Puedes explicar qué parte resuelve el problema de partida.</li>
    <li>Has probado al menos un caso correcto y un caso límite o de error.</li>
    <li>El cambio queda integrado en la aplicación común del curso.</li>
  </ul>
</div>

### 8. Antes de irte

1. ¿Qué problema resolvía la decisión principal de hoy?
2. ¿Qué parte podrías modificar mañana sin volver a consultar el ejemplo?
3. ¿Qué prueba distingue una solución que parece funcionar de una que realmente funciona?

<div class="rule">
  <p class="rule-label">Estado del material</p>
  <p>La secuencia, el objetivo y la evidencia ya están definidos. La explicación, el código guiado, la actividad y el reto se completarán al desarrollar esta sesión.</p>
</div>

## Sesión 27 · Refactorización completa

<div class="today-box">
  <p class="today-label">Plan de la sesión · estructura publicada</p>
  <ol class="today-steps">
    <li><strong>Comprende:</strong> una arquitectura solo se aprende cuando se aplica sobre suficiente código real.</li>
    <li><strong>Construye:</strong> la aplicación organizada en controller, service, repository, model y dto.</li>
    <li><strong>Comprueba:</strong> demuestra el resultado sin depender del ejemplo guiado.</li>
  </ol>
</div>

### 1. Qué vamos a conseguir

Al terminar serás capaz de **transformar la aplicación conservando su comportamiento observable**.

### 2. El problema

Una arquitectura solo se aprende cuando se aplica sobre suficiente código real.

### 3–6. Itinerario de trabajo

1. **Concepto mínimo necesario.** Aislaremos las ideas imprescindibles antes de introducir código nuevo.
2. **Lo hacemos juntos.** Construiremos un primer caso sobre el gestor de proyectos e incidencias y explicaremos cada decisión.
3. **Tu turno.** Modificarás el caso guiado con un requisito que obliga a transferir lo aprendido.
4. **Reto.** Resolverás una variante sin solución completa y registrarás cómo la has comprobado.

### 7. Comprueba que funciona

<div class="checkpoint">
  <p class="checkpoint-label">Evidencia prevista</p>
  <ul class="checklist">
    <li>Has obtenido la aplicación organizada en controller, service, repository, model y dto.</li>
    <li>Puedes explicar qué parte resuelve el problema de partida.</li>
    <li>Has probado al menos un caso correcto y un caso límite o de error.</li>
    <li>El cambio queda integrado en la aplicación común del curso.</li>
  </ul>
</div>

### 8. Antes de irte

1. ¿Qué problema resolvía la decisión principal de hoy?
2. ¿Qué parte podrías modificar mañana sin volver a consultar el ejemplo?
3. ¿Qué prueba distingue una solución que parece funcionar de una que realmente funciona?

<div class="rule">
  <p class="rule-label">Estado del material</p>
  <p>La secuencia, el objetivo y la evidencia ya están definidos. La explicación, el código guiado, la actividad y el reto se completarán al desarrollar esta sesión.</p>
</div>

## Lo que debes recordar

Esta página cerrará la unidad con el mapa conceptual, las decisiones que deben poder justificarse, preguntas de recuperación y una comprobación final del producto.

<div class="checkpoint">
  <p class="checkpoint-label">Resultados de la unidad</p>
  <ul class="checklist">
    <li>Reconocer los síntomas de un controller que acumula responsabilidades.</li>
    <li>Separar controller, service y repository y justificar qué va en cada capa.</li>
    <li>Usar inyección de dependencias en lugar de construir colaboradores a mano.</li>
    <li>Situar las reglas de negocio en el service y protegerlas con tests.</li>
    <li>Escribir tests unitarios de un service con JUnit.</li>
  </ul>
</div>

> El cierre se completará después de desarrollar las sesiones, para que resuma exactamente el material publicado y no un temario teórico distinto.

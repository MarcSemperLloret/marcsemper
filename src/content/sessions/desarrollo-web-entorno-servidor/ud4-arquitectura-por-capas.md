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
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> a distinguir tres cosas que se confunden siempre: coordinar, decidir y acceder a datos.</li>
    <li><strong>2. Haz:</strong> dale por fin un sitio a la regla que arrastras desde la sesión 19.</li>
    <li><strong>3. Comprueba:</strong> tu API rechaza una tarea de un proyecto que no existe, con el código que hayas decidido.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>De la sesión 19: ¿por qué una anotación de validación no puede comprobar que el proyecto 7 existe?</li>
    <li>¿Qué diferencia hay entre lo que hace tu controller y lo que hace tu service?</li>
    <li>Enumera las reglas de negocio que tiene hoy tu aplicación. ¿Dónde está escrita cada una?</li>
  </ol>
</div>

### Tres cosas que no son la misma

«Lógica de negocio» se usa para todo, y dentro de un service conviven tres cosas distintas:

| Es… | Responde a… | Ejemplo |
| :--- | :--- | :--- |
| **Coordinación** | ¿En qué orden se hacen los pasos? | Buscar el proyecto, crear la tarea, guardarla |
| **Regla de negocio** | ¿Se puede hacer esto? ¿Qué valor toma? | Una tarea nace sin completar; no puede haber dos proyectos con el mismo nombre |
| **Acceso a datos** | ¿Cómo lo guardo y lo recupero? | Recorrer la lista, o mañana una consulta SQL |

La tercera ya está fuera desde la sesión 23. Hoy separamos las dos primeras, que siguen mezcladas.

<p class="term">Caso de uso</p>

Una cosa completa que alguien quiere hacer con la aplicación: «crear una tarea», «cerrar una incidencia», «listar los proyectos activos». Es la unidad en la que se piensa un service: **un método público por caso de uso**, con el nombre que usaría una persona.

### Validación o regla de negocio

Esta es la distinción de la sesión, y tiene una prueba que la decide:

<div class="rule">
  <p class="rule-label">La pregunta que las separa</p>
  <p><strong>¿Se puede responder mirando solo el objeto que ha llegado?</strong></p>
  <p>Si <strong>sí</strong>, es <em>validación</em>: una regla de formato, y va en el DTO con una anotación. «El título no puede estar vacío» se decide mirando el título.</p>
  <p>Si <strong>no</strong>, porque hace falta consultar datos, es una <em>regla de negocio</em>: va en el service. «El proyecto debe existir» exige mirar los proyectos que hay.</p>
</div>

| Regla | ¿Basta con el objeto? | Dónde vive |
| :--- | :---: | :--- |
| El título no está vacío | Sí | DTO, `@NotBlank` |
| La prioridad es baja, media o alta | Sí | DTO, anotación propia |
| La fecha de fin no es anterior a la de inicio | Sí, mira dos campos | DTO, restricción de clase |
| El proyecto al que pertenece existe | **No** | Service |
| No hay otro proyecto con ese nombre | **No** | Service |
| Un proyecto archivado no admite tareas nuevas | **No** | Service |
| Solo el autor puede borrar su comentario | **No** | Service, y en la UD9 con seguridad |

Fíjate en que la frontera **no es la dificultad de la regla**, sino de dónde sale la información para decidirla.

### La regla que llevaba dos unidades esperando

En la sesión 19 la encontraste, viste por qué una anotación no podía con ella y la dejaste apuntada. Hoy tiene sitio:

```java
@Service
public class TareaService {

    private final TareaRepository repositorio;
    private final ProyectoRepository proyectos;

    public TareaService(TareaRepository repositorio, ProyectoRepository proyectos) {
        this.repositorio = repositorio;
        this.proyectos = proyectos;
    }

    public Tarea crear(Tarea tarea) {
        // Regla: toda tarea pertenece a un proyecto que existe.
        if (!proyectos.existsById(tarea.getProyectoId())) {
            throw new ReglaDeNegocioException(
                    "No existe el proyecto " + tarea.getProyectoId());
        }
        // Regla: una tarea nace sin completar.
        tarea.setCompletada(false);
        return repositorio.save(tarea);
    }
}
```

Y la excepción, junto a las de la UD3:

```java
package com.ejemplo.gestor.error;

public class ReglaDeNegocioException extends RuntimeException {

    public ReglaDeNegocioException(String mensaje) {
        super(mensaje);
    }
}
```

Con su manejador, que ya sabes escribir:

```java
@ExceptionHandler(ReglaDeNegocioException.class)
public ResponseEntity<ErrorResponse> reglaIncumplida(
        ReglaDeNegocioException ex, HttpServletRequest peticion) {

    return construir(HttpStatus.CONFLICT, ex.getMessage(), peticion, List.of());
}
```

<div class="rule">
  <p class="rule-label">Fíjate en lo que <em>no</em> hay en el service</p>
  <p>No aparece <code>409</code>, ni <code>ResponseEntity</code>, ni nada de HTTP. El service dice <strong>qué regla se ha incumplido</strong>; el manejador decide con qué código se cuenta eso.</p>
  <p>Si mañana esta misma regla la aplica una importación de CSV, la excepción tendrá exactamente el mismo sentido y nadie hablará de códigos de estado.</p>
</div>

#### ¿400, 404 o 409?

Es la discusión que dejaste abierta en la sesión 19, y ahora toca cerrarla. Las tres posturas son defendibles:

<div class="compare-pair">
  <div>
    <p class="compare-label">404 Not Found</p>
    <p class="compare-body">«El proyecto que nombras no existe.» Tiene el problema de que la ruta era <code>/tareas</code>: quien lo reciba puede creer que no existe la ruta de tareas.</p>
  </div>
  <div>
    <p class="compare-label">409 Conflict</p>
    <p class="compare-body">«Tu petición es válida pero choca con el estado de los datos.» Encaja con la definición y no se confunde con la ruta. Es la que usamos aquí.</p>
  </div>
</div>

También se defiende un `400`, argumentando que el cliente ha enviado un dato incorrecto. **Elige una, escríbela en `DECISIONES.md` y aplícala igual en toda la API.** Lo que no vale es que una regla parecida responda `409` en un recurso y `400` en otro.

### El service que solo coordina

Cuando un caso de uso crece, conviene ver sus dos mitades separadas:

```java
public Tarea crear(Tarea tarea) {
    comprobarQueElProyectoExiste(tarea.getProyectoId());
    comprobarQueElProyectoAdmiteTareas(tarea.getProyectoId());
    tarea.setCompletada(false);
    return repositorio.save(tarea);
}

private void comprobarQueElProyectoExiste(int proyectoId) {
    if (!proyectos.existsById(proyectoId)) {
        throw new ReglaDeNegocioException("No existe el proyecto " + proyectoId);
    }
}

private void comprobarQueElProyectoAdmiteTareas(int proyectoId) {
    Proyecto proyecto = proyectos.findById(proyectoId).orElseThrow();
    if (!proyecto.isActivo()) {
        throw new ReglaDeNegocioException(
                "El proyecto " + proyectoId + " está archivado y no admite tareas");
    }
}
```

El método público **se lee como el enunciado del caso de uso**: comprueba esto, comprueba aquello, aplica esta regla, guarda. Cada regla tiene un nombre, y ese nombre es documentación que no se desactualiza.

<div class="rule">
  <p class="rule-label">Un método público por caso de uso, con nombre de negocio</p>
  <p><code>crear</code>, <code>cerrar</code>, <code>archivar</code>, <code>reasignar</code>. No <code>procesarDatos</code>, no <code>gestionar</code>, no <code>hacerTodo</code>.</p>
  <p>La prueba: si le lees el nombre del método a alguien que conoce el negocio pero no programa, ¿entiende qué hace? Si no, el nombre está describiendo el código en lugar del propósito.</p>
</div>

### Las reglas que dependen del estado

Hay una familia entera que solo aparece cuando algo puede estar en varias situaciones. Son las que más se olvidan:

<figure class="diagram">
  <figcaption>Estados de una incidencia y qué se permite en cada uno</figcaption>
  <ol class="flow flow--row flow--chain">
    <li><strong>abierta</strong><br>se edita, se cierra</li>
    <li><strong>en curso</strong><br>se edita, se cierra</li>
    <li><strong>cerrada</strong><br>solo se reabre</li>
  </ol>
</figure>

De ahí salen reglas que ninguna anotación puede expresar: «una incidencia cerrada no se puede editar», «no se puede cerrar dos veces», «solo se reabre lo que está cerrado».

Y llevan a una pregunta que conviene hacerse pronto: si alguien envía un `PATCH` cambiando el estado de `abierta` a `cerrada`, ¿es eso una modificación cualquiera o **es un caso de uso propio**? Casi siempre lo segundo, y por eso `POST /incidencias/41/cierre` de la sesión 14 tenía sentido: porque detrás hay reglas que un cambio de campo genérico se salta.

### Ahora tú · El inventario de reglas

1. Escribe la tabla de **todas** las reglas de tu aplicación, con este formato:

| Regla | ¿Basta el objeto? | Dónde vive hoy | Dónde debería vivir |
| :--- | :---: | :--- | :--- |

2. Mueve al service todas las que no estén en su sitio.
3. Implementa como mínimo estas tres:
   * Una tarea pertenece a un proyecto que existe.
   * No hay dos proyectos con el mismo nombre.
   * Un proyecto inactivo no admite tareas nuevas.
4. Dales nombre propio: un método privado por regla, con un nombre que se lea.
5. Añade a la colección una petición por regla que la incumpla, comprobando código y mensaje.

### Reto · La regla que se cuela por la puerta de atrás

Tienes la regla «un proyecto inactivo no admite tareas nuevas» implementada en `crear`. Ahora piensa:

1. ¿Qué pasa si alguien crea una tarea en un proyecto activo y **después** se archiva el proyecto?
2. ¿Qué pasa si alguien usa `PUT /tareas/41` para cambiarle el `proyectoId` a uno inactivo? ¿Pasa por tu regla?
3. Localiza **todos** los caminos por los que una tarea puede acabar asociada a un proyecto inactivo. Hay al menos tres.
4. Decide qué hacer con cada uno: ¿se prohíbe, se permite, se avisa? No todas las respuestas tienen que ser «prohibir».
5. Implementa tu decisión y añade una prueba por camino.

Y la pregunta de fondo, que se responde en dos frases:

> Cuando una regla hay que repetirla en tres métodos distintos, ¿es que la regla está mal puesta, o es que falta un concepto en tu modelo?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>La tabla de reglas completa y las tres reglas implementadas en el service.</span></div>
  <div><strong>Si lo tienes</strong><span>Cada regla con su método privado y su nombre de negocio, y una petición de incumplimiento por regla en la colección.</span></div>
  <div><strong>Reto</strong><span>Los tres caminos hacia el proyecto inactivo localizados y resueltos con una decisión escrita.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 25</p>
  <ul class="checklist">
    <li>Sabes decidir si algo es validación o regla de negocio con la pregunta del objeto.</li>
    <li>Ninguna regla de negocio vive ya en un controlador.</li>
    <li>La regla del proyecto inexistente está implementada, con su código de estado decidido y escrito.</li>
    <li>Cada caso de uso es un método público con nombre de negocio.</li>
    <li>Ningún service menciona códigos de estado.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué pregunta separa una validación de una regla de negocio?</li>
    <li>¿Por qué el service lanza una excepción en vez de devolver un código?</li>
    <li>¿Qué es un caso de uso y cómo se refleja en el código?</li>
    <li>Da un ejemplo de regla que solo existe porque algo puede estar en varios estados.</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Si se puede decidir mirando solo el objeto que ha llegado, es validación y va en el DTO. Si hace falta consultar datos, es una regla de negocio y va en el service.</p>
  <p>2 · Porque el service no sabe que existe HTTP. Dice qué regla se ha incumplido, y traducir eso a un código es trabajo de la capa web, que es la única que habla ese idioma.</p>
  <p>3 · Algo completo que alguien quiere hacer con la aplicación. Se refleja como un método público del service, con un nombre que entendería alguien del negocio.</p>
  <p>4 · Que una incidencia cerrada no se pueda editar, o que solo se reabra lo que está cerrado. Dependen de la situación actual del recurso, no de los datos enviados.</p>
</details>

## Sesión 26 · Primeros tests del service con JUnit

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> a comprobar una regla sin arrancar el servidor, sin base de datos y sin Postman.</li>
    <li><strong>2. Haz:</strong> escribe tu primer test, con un repositorio falso construido a mano.</li>
    <li><strong>3. Comprueba:</strong> rompes una regla a propósito y el test lo dice en menos de un segundo.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>¿Cuánto tardas hoy en comprobar que una tarea nace sin completar? Cuéntalo en pasos.</li>
    <li>De la sesión 24: ¿por qué se prefiere la inyección por constructor?</li>
    <li>¿Qué tipo pide hoy el constructor de tu service: una clase o una interfaz?</li>
  </ol>
</div>

### Las dos respuestas de antes se cobran hoy

Aquellas dos decisiones de la sesión 24 parecían burocracia. Hoy se ve para qué eran:

<figure class="diagram">
  <figcaption>Por qué se puede probar tu service</figcaption>
  <ol class="flow flow--before">
    <li>Pide sus dependencias <strong>por constructor</strong>, así que puedo construirlo yo</li>
    <li>Pide una <strong>interfaz</strong>, así que puedo darle lo que quiera que la cumpla</li>
    <li>No sabe nada de HTTP, así que <strong>no hace falta arrancar nada</strong></li>
  </ol>
</figure>

Sin esas tres, lo de hoy sería imposible. Con ellas, un test cabe en diez líneas.

### Qué es y qué no es un test

<p class="term">Test unitario</p>

Un trozo de código que ejecuta otro trozo de código y **comprueba automáticamente** que el resultado es el esperado. Si lo es, calla. Si no, avisa.

Lo importante es «automáticamente». Comprobar a mano en Postman también es probar, y tiene tres problemas: lo haces tú, lo haces cuando te acuerdas, y **mañana ya no queda constancia de que lo hiciste**.

<div class="compare-pair">
  <div>
    <p class="compare-label">Comprobar en Postman</p>
    <p class="compare-body">Arrancar, escribir un JSON, enviar, leer. Diez segundos si todo va bien, y si falla no sabes si es la regla, la ruta, el mapper o el JSON.</p>
  </div>
  <div>
    <p class="compare-label">Un test unitario</p>
    <p class="compare-body">Milisegundos, sin arrancar nada, señalando exactamente qué regla ha fallado y con qué valores.</p>
  </div>
</div>

Los dos hacen falta: la colección comprueba **el contrato HTTP**, y los tests comprueban **la lógica**. Comprueban cosas distintas.

### Ya tienes las herramientas instaladas

Mira el `pom.xml`: `spring-boot-starter-test` está desde el primer día, porque lo puso `start.spring.io`. Trae JUnit 5 y todo lo necesario.

Y mira `src/test/java`: existe desde la UD1, con una clase generada dentro. Es la carpeta gemela de `src/main/java`, y **el código de tests no se empaqueta con la aplicación**.

<div class="rule">
  <p class="rule-label">La estructura se copia, no se inventa</p>
  <p>El test de <code>com.ejemplo.gestor.service.TareaService</code> va en el mismo paquete, dentro de <code>src/test/java</code>, y se llama <code>TareaServiceTest</code>.</p>
  <p>Mismo paquete, mismo nombre más <code>Test</code>. Así se encuentran sin buscarlos y Maven los ejecuta sin configurar nada.</p>
</div>

### El repositorio falso

Para probar el service hace falta darle un repositorio. Podrías darle el de memoria, pero entonces estarías probando dos clases a la vez y, si falla, no sabrías cuál.

<p class="term">Doble de prueba</p>

Una implementación de mentira que se pone en lugar de la de verdad, para controlar exactamente qué datos ve el código que estás probando.

Como tu repositorio es una interfaz, escribir uno es directo:

```java
package com.ejemplo.gestor.service;

import com.ejemplo.gestor.model.Proyecto;
import com.ejemplo.gestor.repository.ProyectoRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

class ProyectoRepositorioFalso implements ProyectoRepository {

    private final List<Proyecto> proyectos = new ArrayList<>();

    /** Prepara el escenario del test: estos proyectos existen y ninguno más. */
    void con(Proyecto... iniciales) {
        proyectos.addAll(List.of(iniciales));
    }

    @Override
    public boolean existsById(int id) {
        return findById(id).isPresent();
    }

    @Override
    public Optional<Proyecto> findById(int id) {
        return proyectos.stream().filter(p -> p.getId() == id).findFirst();
    }

    @Override
    public List<Proyecto> findAll() {
        return new ArrayList<>(proyectos);
    }

    @Override
    public Proyecto save(Proyecto proyecto) {
        proyectos.add(proyecto);
        return proyecto;
    }

    @Override
    public boolean deleteById(int id) {
        return proyectos.removeIf(p -> p.getId() == id);
    }
}
```

Vive en `src/test/java`, así que no se publica con la aplicación.

<details class="aside aside--extra">
  <summary>Existen librerías que generan estos dobles</summary>
  <p>La más usada se llama <strong>Mockito</strong>, y ya está en tu proyecto dentro de <code>spring-boot-starter-test</code>. Con ella, lo de arriba se escribe en una línea por comportamiento.</p>
  <p>Lo hacemos a mano primero porque un doble escrito por ti se entiende sin aprender una sintaxis nueva, y porque así ves que no hay magia: es una clase normal que implementa la misma interfaz. Cuando en la UD11 se ordene la estrategia de pruebas, sabrás qué te está generando la librería.</p>
</details>

### Tu primer test

```java
package com.ejemplo.gestor.service;

import com.ejemplo.gestor.error.ReglaDeNegocioException;
import com.ejemplo.gestor.model.Proyecto;
import com.ejemplo.gestor.model.Tarea;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TareaServiceTest {

    @Test
    @DisplayName("Una tarea nueva nace sin completar")
    void unaTareaNuevaNaceSinCompletar() {
        // Preparar
        ProyectoRepositorioFalso proyectos = new ProyectoRepositorioFalso();
        proyectos.con(new Proyecto(7, "Web corporativa", "", true));
        TareaService servicio =
                new TareaService(new TareaRepositorioFalso(), proyectos);

        Tarea entrada = new Tarea();
        entrada.setTitulo("Revisar el login");
        entrada.setProyectoId(7);
        entrada.setCompletada(true);   // el cliente insiste

        // Actuar
        Tarea creada = servicio.crear(entrada);

        // Comprobar
        assertFalse(creada.isCompletada());
    }

    @Test
    @DisplayName("No se puede crear una tarea en un proyecto que no existe")
    void noSePuedeCrearEnUnProyectoInexistente() {
        ProyectoRepositorioFalso proyectos = new ProyectoRepositorioFalso();
        // Escenario: no hay ningún proyecto.
        TareaService servicio =
                new TareaService(new TareaRepositorioFalso(), proyectos);

        Tarea entrada = new Tarea();
        entrada.setTitulo("Revisar el login");
        entrada.setProyectoId(999);

        ReglaDeNegocioException error = assertThrows(
                ReglaDeNegocioException.class,
                () -> servicio.crear(entrada));

        assertEquals("No existe el proyecto 999", error.getMessage());
    }
}
```

<dl class="worked">
  <dt>Las tres zonas · preparar, actuar, comprobar</dt>
  <dd>Todo test tiene esta forma: se monta el escenario, se ejecuta <strong>una sola</strong> acción, y se comprueba el resultado. Si te cuesta separarlas, normalmente es que el test está probando dos cosas a la vez.</dd>
  <dt><code>@DisplayName</code></dt>
  <dd>El nombre que se ve al ejecutar. Escríbelo como una frase que afirme lo que debe pasar: cuando falle, ese texto es lo que vas a leer, y quieres que te diga qué se ha roto sin abrir el código.</dd>
  <dt><code>assertThrows</code></dt>
  <dd>Comprueba que algo falla, y falla <strong>como debe</strong>. Devuelve la excepción capturada, así que se puede comprobar además el mensaje. Un test que verifica los errores vale tanto como uno que verifica los aciertos.</dd>
  <dt>Por qué no hay ninguna anotación de Spring</dt>
  <dd>Porque no hace falta. Este test no arranca la aplicación, no levanta el contenedor y no toca un puerto: <strong>construye tres objetos Java y llama a un método</strong>. Por eso tarda milisegundos.</dd>
</dl>

### Ejecútalos

Desde el IDE, con el botón de la clase. Desde el terminal:

```bash
./mvnw test
```

```text
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Fíjate en el tiempo total. Ahora compáralo con arrancar la aplicación y comprobar esas dos cosas en Postman.

<p class="stage">La prueba de que sirven</p>

Ve a `TareaService` y **borra la línea** `tarea.setCompletada(false)`. Ejecuta los tests.

```text
[ERROR] Una tarea nueva nace sin completar
expected: <false> but was: <true>
```

El nombre te dice qué regla se ha roto, y el mensaje qué valor esperaba. Sin arrancar nada, sin escribir un JSON y sin acordarte de comprobarlo. **Devuelve la línea.**

<div class="rule">
  <p class="rule-label">Qué merece un test y qué no</p>
  <p><strong>Sí:</strong> las reglas de negocio, los casos de error, los límites, y todo lo que alguien pueda romper sin darse cuenta.</p>
  <p><strong>No:</strong> los <em>getters</em>, los mappers triviales, ni que Spring funcione. Un test que solo comprueba que Java asigna un campo no protege de nada y hay que mantenerlo igual.</p>
  <p>El criterio: <strong>¿me enteraría si alguien rompiera esto?</strong> Si la respuesta es no, hay que escribir el test.</p>
</div>

### Ahora tú · Cubre tus reglas

1. Crea `TareaRepositorioFalso` y `ProyectoRepositorioFalso` en `src/test/java`.
2. Escribe un test por cada regla de la tabla de la sesión 25. Como mínimo cinco.
3. Cada uno con su `@DisplayName` en forma de frase afirmativa.
4. Al menos dos deben usar `assertThrows` y comprobar el mensaje.
5. Ejecuta `./mvnw test` y deja todo en verde.

### Reto · Rompe y demuestra

Este reto mide si tus tests valen algo.

1. Haz una lista de las **cinco reglas** de tu aplicación.
2. Para cada una, ve al código y **rómpela a propósito**, de una en una: invierte una condición, borra una línea, cambia un valor.
3. Ejecuta los tests y anota: ¿falló alguno? ¿Cuál? ¿El mensaje te dijo qué se había roto?
4. Rellena esta tabla:

| Regla | ¿La detectó un test? | ¿El mensaje era útil? |
| :--- | :---: | :---: |

5. Toda fila con un «no» en la primera columna es **un agujero en tu suite**. Escribe el test que falta.
6. Restaura el código y comprueba que todo vuelve a verde.

Y una reflexión final, para escribir:

> Si un compañero entra mañana en tu proyecto, cambia una línea y ejecuta los tests, ¿qué le protegería y qué no?

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Los dos dobles escritos y dos tests en verde, uno de ellos con <code>assertThrows</code>.</span></div>
  <div><strong>Si lo tienes</strong><span>Cinco tests, uno por regla, con nombres legibles y mensajes comprobados.</span></div>
  <div><strong>Reto</strong><span>Las cinco reglas rotas una a una, la tabla completa y los agujeros tapados.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 26</p>
  <ul class="checklist">
    <li>Existe <code>src/test/java</code> con tests que reflejan la estructura de paquetes.</li>
    <li>Los tests construyen el service a mano, sin arrancar Spring.</li>
    <li>Hay al menos un doble de prueba escrito por ti.</li>
    <li>Al menos dos tests comprueban que algo falla como debe.</li>
    <li>Has roto una regla a propósito y un test lo ha detectado.</li>
    <li><code>./mvnw test</code> pasa en verde.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Qué dos decisiones de la sesión 24 hacen posible probar el service?</li>
    <li>¿Por qué se usa un repositorio falso y no el de memoria?</li>
    <li>¿Cuáles son las tres zonas de un test?</li>
    <li>¿Qué comprueba la colección de Postman que no comprueban estos tests, y al revés?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Pedir las dependencias por constructor, que permite construirlo a mano, y depender de una interfaz, que permite pasarle una implementación de mentira.</p>
  <p>2 · Para probar una sola clase cada vez. Con el repositorio real estarías probando dos, y si el test fallara no sabrías cuál de las dos tiene el fallo.</p>
  <p>3 · Preparar el escenario, ejecutar una sola acción y comprobar el resultado.</p>
  <p>4 · La colección comprueba el contrato HTTP: rutas, códigos y formato. Los tests comprueban la lógica de negocio sin pasar por la web. Ninguno sustituye al otro.</p>
</details>

## Sesión 27 · Refactorización completa

<div class="today-box">
  <p class="today-label">Hoy · Hoja de ruta</p>
  <ol class="today-steps">
    <li><strong>1. Aprende:</strong> a terminar una refactorización, que no es lo mismo que empezarla.</li>
    <li><strong>2. Haz:</strong> aplica la arquitectura a toda la aplicación y tacha uno a uno los problemas que apuntaste.</li>
    <li><strong>3. Comprueba:</strong> la colección y los tests, los dos en verde, y el comportamiento idéntico al del primer día.</li>
  </ol>
</div>

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · 5 minutos, sin apuntes</p>
  <ol>
    <li>Abre tu <code>PROBLEMAS.md</code> de la sesión 22. ¿Cuántos puntos siguen sin resolver?</li>
    <li>¿Qué tenía que seguir igual al terminar esta unidad?</li>
    <li>¿Cuántos tests tienes hoy y cuántas reglas de negocio?</li>
  </ol>
</div>

<div class="rule">
  <p class="rule-label">Cómo es esta sesión</p>
  <p>Sesión de cierre. No hay contenido nuevo: hay <strong>una lista de criterios y tu propio inventario de problemas</strong>. La refactorización la diriges tú.</p>
</div>

### Terminar es tachar

Una refactorización a medias es peor que no haberla empezado: deja dos formas de hacer lo mismo conviviendo, y quien llegue después no sabrá cuál es la buena.

Abre `PROBLEMAS.md`. Para cada línea, una de tres:

<figure class="diagram">
  <figcaption>Qué hacer con cada problema apuntado</figcaption>
  <ol class="flow flow--before">
    <li><strong>Resuelto:</strong> táchalo y escribe en qué clase vive ahora eso</li>
    <li><strong>Sigue vivo:</strong> resuélvelo hoy</li>
    <li><strong>Ya no aplica:</strong> explica por qué dejó de ser un problema</li>
  </ol>
</figure>

No vale dejar líneas sin marcar. Ese documento es la justificación de la unidad y hoy es su comprobación.

### Especificación · el estado final

#### Estructura del proyecto

```text
com.ejemplo.gestor
├── controller     · habla HTTP y nada más
├── dto            · lo que se acepta y lo que se publica
├── mapper         · traduce entre DTO y modelo
├── service        · casos de uso y reglas de negocio
├── repository     · interfaces, con su implementación en memoria
├── model          · lo que maneja tu código
├── validacion     · anotaciones propias
└── error          · excepciones, formato y manejador
```

#### Reglas que se comprueban

| # | Criterio | Cómo se verifica |
| :---: | :--- | :--- |
| 1 | Ningún controlador tiene listas, bucles de búsqueda ni contadores | Búscalos |
| 2 | Ningún controlador contiene una regla de negocio | Léelos entero |
| 3 | Ningún service menciona HTTP, códigos, DTO ni `ResponseEntity` | Busca `Response` en el paquete |
| 4 | Ningún repository conoce reglas de negocio | Léelos |
| 5 | No queda ningún `new` de un colaborador | Busca `new` en controller y service |
| 6 | Todas las dependencias se piden por constructor y son `final` | Léelas |
| 7 | Los repositorios son interfaces | Míralos |
| 8 | Cada clase lleva el estereotipo de su capa | Míralos |
| 9 | Cada caso de uso es un método público con nombre de negocio | Lee los nombres en voz alta |
| 10 | Cada regla de negocio tiene su test | Cuenta reglas y cuenta tests |

<details class="aside aside--help">
  <summary>Estoy atascado · el controlador de la ruta anidada</summary>
  <p><code>GET /proyectos/{id}/tareas</code> es el que suele quedarse a medias, porque toca dos recursos y es tentador resolverlo con dos llamadas desde el controlador.</p>
  <p>Si tu controlador llama a dos servicios y decide algo entre medias, eso es coordinación, y la coordinación es del service. Decide en cuál vive el caso de uso y déjalo ahí entero.</p>
</details>

### La doble comprobación

Esta unidad se cierra con dos pruebas que dicen cosas distintas:

<div class="compare-pair">
  <div>
    <p class="compare-label">La colección</p>
    <p class="compare-body">Demuestra que <strong>no has cambiado nada</strong> para quien consume la API. Es la prueba de que fue una refactorización.</p>
  </div>
  <div>
    <p class="compare-label">Los tests</p>
    <p class="compare-body">Demuestran que <strong>las reglas siguen siendo las que decidiste</strong>, y lo demostrarán otra vez dentro de seis meses.</p>
  </div>
</div>

Las dos tienen que estar en verde. Y hay una tercera comprobación, la más honesta:

<div class="rule">
  <p class="rule-label">La prueba del cambio pequeño</p>
  <p>Elige uno de estos y cronométralo de verdad:</p>
  <ol>
    <li>Que una tarea nueva nazca con prioridad <code>media</code>.</li>
    <li>Publicar un campo nuevo en la respuesta de proyectos.</li>
    <li>Añadir un filtro por prioridad al listado de tareas.</li>
  </ol>
  <p>Apunta <strong>cuántos archivos has tenido que abrir y cuánto has tardado</strong>. Compáralo con la estimación que hiciste en el apartado 4 de <code>PROBLEMAS.md</code>, cuando todo estaba en el controlador. Esa diferencia es el resultado de la unidad.</p>
</div>

### Entrega de la unidad

1. **El proyecto** con la estructura de la especificación.
2. **`PROBLEMAS.md`** revisado, con cada línea tachada o justificada.
3. **Los tests**, con al menos uno por regla de negocio, en verde con `./mvnw test`.
4. **La colección**, en verde y sin ninguna petición modificada desde la UD3.
5. **`DECISIONES.md`** ampliado con tres:
   * Dónde vive el caso de uso de la ruta anidada y por qué.
   * Qué código de estado devuelve una regla de negocio incumplida en tu API, y por qué ese.
   * Qué regla te costó más colocar y qué duda tuviste.

### Autoevaluación · pásale el código a otro

La comprobación final de esta unidad no la puede hacer quien escribió el código.

1. Intercambia el proyecto con un compañero.
2. Sin preguntarle nada, y solo mirando los nombres de las clases y de los métodos, que responda por escrito:
   * ¿Dónde se decide qué prioridad tiene una tarea nueva?
   * ¿Dónde habría que tocar para cambiar de almacenamiento?
   * ¿Dónde se decide qué código de estado devuelve un error?
   * ¿Qué reglas de negocio tiene esta aplicación?
3. Cada respuesta equivocada señala **un nombre confuso o una responsabilidad mal colocada**. Anótalas.
4. Corrige tu proyecto con lo que salga de ahí.

La cuarta pregunta es la mejor: si tu compañero puede enumerar tus reglas de negocio leyendo los nombres de tus métodos y tus tests, la arquitectura está haciendo su trabajo.

### Lo que sigue faltando

| Lo que sigue mal | Se arregla en |
| :--- | :--- |
| Al reiniciar se pierde todo | UD5, con PostgreSQL |
| Buscar recorre la lista entera, una por una | UD5, con consultas |
| No hay forma de relacionar datos más allá de guardar un id | UD5, con relaciones |
| Nadie garantiza que dos operaciones simultáneas no se pisen | UD5, con transacciones |

Y fíjate en lo que **no** aparece en esa tabla: ni el contrato, ni las reglas, ni la estructura. Eso ya está.

<div class="rule">
  <p class="rule-label">Por qué la UD5 va a ser más fácil de lo que parece</p>
  <p>Tu service pide una interfaz. En la UD5 se borra la implementación en memoria y se pone otra que habla con PostgreSQL.</p>
  <p><strong>El service, el controller, los DTO, el mapper y los tests no se tocan.</strong> Cambiar la base de datos entera va a ser un cambio localizado, y eso es exactamente lo que has construido estas dos semanas.</p>
</div>

<div class="practice-levels">
  <div><strong>Objetivo mínimo</strong><span>Los diez criterios cumplidos y las dos comprobaciones en verde.</span></div>
  <div><strong>Si lo tienes</strong><span><code>PROBLEMAS.md</code> tachado línea a línea y la prueba del cambio pequeño cronometrada.</span></div>
  <div><strong>Reto</strong><span>La revisión cruzada con un compañero, con las respuestas equivocadas convertidas en correcciones.</span></div>
</div>

<div class="checkpoint">
  <p class="checkpoint-label">Checkpoint · fin de la sesión 27</p>
  <ul class="checklist">
    <li>Los diez criterios de la especificación se cumplen en toda la aplicación.</li>
    <li><code>PROBLEMAS.md</code> no tiene ninguna línea sin tachar ni justificar.</li>
    <li><code>./mvnw test</code> pasa en verde y hay al menos un test por regla.</li>
    <li>La colección pasa en verde sin haber modificado ninguna petición desde la UD3.</li>
    <li>Has cronometrado un cambio pequeño y lo has comparado con la estimación de la sesión 22.</li>
    <li>Otra persona ha sabido responder dónde vive cada cosa mirando solo los nombres.</li>
  </ul>
</div>

<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · 2 minutos, sin mirar</p>
  <ol>
    <li>¿Por qué una refactorización a medias es peor que no haberla hecho?</li>
    <li>¿Qué demuestra la colección y qué demuestran los tests?</li>
    <li>¿Cuántos archivos habría que tocar para cambiar de almacenamiento?</li>
    <li>¿Qué mide la prueba del cambio pequeño?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque deja dos formas de hacer lo mismo conviviendo, y quien llegue después no sabrá cuál es la buena ni por qué hay dos.</p>
  <p>2 · La colección demuestra que el comportamiento observable no ha cambiado. Los tests demuestran que las reglas de negocio siguen siendo las decididas, y lo seguirán demostrando en el futuro.</p>
  <p>3 · La implementación del repositorio. El service, el controller, los DTO, el mapper y los tests se quedan como están.</p>
  <p>4 · El coste real de mantener el código: cuántos archivos hay que abrir y cuánto se tarda en un cambio pequeño, comparado con lo que costaba antes.</p>
</details>

## Lo que debes recordar

### El método

Las tres unidades anteriores enseñaron a diseñar **lo que se ve desde fuera**. Esta enseña a colocar lo que hay detrás, y se decide con una sola pregunta repetida:

<figure class="diagram">
  <figcaption>Dónde va cada trozo de código</figcaption>
  <ol class="flow">
    <li>¿Esto habla de rutas, códigos o formato? Va al <strong>controller</strong></li>
    <li>¿Decide si algo se puede hacer, o qué valor toma? Va al <strong>service</strong></li>
    <li>¿Guarda, busca o recupera? Va al <strong>repository</strong></li>
    <li>¿Traduce entre el contrato y el modelo? Va al <strong>mapper</strong></li>
    <li>Si encaja en dos sitios, <strong>es que son dos cosas</strong>: sepáralas</li>
  </ol>
</figure>

El paso cinco es el que hay que aplicar cuando se duda, y casi siempre acierta.

### La idea más importante

> **Una clase debe tener un solo motivo de cambio. No «hacer una cosa», que no significa nada: un motivo de cambio, que sí se puede comprobar preguntando qué tendría que ocurrir en el mundo para tener que abrir ese archivo.**

De ahí sale todo lo demás. Por eso el controller no guarda datos, por eso el service no sabe qué es un 404, por eso el repositorio es una interfaz, y por eso ahora se puede probar una regla sin arrancar un servidor.

<p class="term">Refactorizar es cambiar cómo, no qué</p>

Al terminar la unidad, tu API responde exactamente lo que respondía. Si algo hubiera cambiado, no habría sido una refactorización, y la colección de la UD2 es lo que te permitió saberlo en diez segundos.

### Las decisiones que tienes que saber justificar

| Decisión | Lo que tienes que poder decir |
| :--- | :--- |
| Tres capas y no dos | Cambiar el almacenamiento, cambiar una regla y cambiar el contrato son motivos distintos |
| Las dependencias van en un solo sentido | Si una capa conociera a la que la llama, no se podría cambiar sin arrastrarla |
| Los DTO no cruzan al service | El service debe poder usarse sin que exista una API web |
| El service lanza excepciones, no códigos | Dice qué ha pasado; traducirlo a HTTP es de la capa web |
| Inyección por constructor | Campos `final`, dependencias a la vista, y la clase se puede construir en un test |
| El repositorio es una interfaz | Permite cambiar el almacenamiento sin abrir el service, que es justo lo que hará la UD5 |
| Validación en el DTO, regla en el service | Si basta el objeto que llegó, es formato; si hay que consultar datos, es negocio |
| Un método público por caso de uso | El nombre lo tiene que entender alguien que conozca el negocio y no programe |
| Tests del service sin Spring | Prueban la lógica en milisegundos y señalan qué regla se ha roto |
| Un doble de prueba en vez del repositorio real | Para probar una clase cada vez y saber cuál falla |

### Al terminar deberías poder responder

1. ¿Cuál es la pregunta que revela si una clase tiene demasiadas responsabilidades?
2. ¿Por qué duplicar es caro, si escribirlo dos veces cuesta poco?
3. ¿Qué es una refactorización y qué la distingue de reescribir?
4. Nombra dos situaciones que necesitarían tus reglas sin pasar por HTTP.
5. ¿En qué dirección se permiten las dependencias entre capas?
6. ¿Por qué el service no conoce los DTO?
7. ¿Por qué puede el service lanzar una excepción que acabará siendo un 404?
8. ¿Qué tres cosas decide una línea con `new`, y cuál de ellas sí es asunto de la clase?
9. Da dos motivos para preferir la inyección por constructor.
10. ¿Por qué un bean no debe guardar datos de una petición concreta?
11. ¿Qué significan `NoSuchBeanDefinitionException` y `NoUniqueBeanDefinitionException`?
12. ¿Qué indica una dependencia circular sobre el diseño?
13. ¿Qué pregunta separa una validación de una regla de negocio?
14. ¿Qué es un caso de uso y cómo se refleja en el código?
15. ¿Qué dos decisiones de la sesión 24 hacen posible probar el service?
16. ¿Por qué se usa un doble y no el repositorio de memoria?
17. ¿Cuáles son las tres zonas de un test?
18. ¿Qué comprueba la colección que no comprueban los tests, y al revés?
19. ¿Qué merece un test y qué no?
20. ¿Cuántos archivos habría que tocar para cambiar de almacenamiento?

Si además puedes coger un controlador ajeno lleno de lógica y decir, método a método, qué se lleva a dónde, tienes lo que esta unidad quería darte.

### El vocabulario de la unidad

| Concepto | Significa |
| :--- | :--- |
| Refactorizar | Cambiar cómo está escrito el código sin cambiar lo que hace |
| Motivo de cambio | Lo que tendría que ocurrir para tener que abrir un archivo |
| Responsabilidad única | Una clase, un motivo de cambio |
| Capa | Un grupo de clases con el mismo motivo de cambio |
| Controller | Habla HTTP: rutas, códigos, cabeceras, DTO |
| Service | Casos de uso y reglas de negocio. No sabe que existe HTTP |
| Repository | Guarda y recupera. No sabe de reglas |
| Regla de la dirección | Controller conoce al service, el service al repository, nunca al revés |
| Caso de uso | Algo completo que alguien quiere hacer con la aplicación |
| Regla de negocio | Decisión que necesita consultar datos, no solo mirar el objeto recibido |
| Inversión de control | Que no seas tú quien construye y conecta los objetos |
| Contenedor | Lo que crea los beans, los conecta y los administra |
| Bean | Un objeto gestionado por Spring |
| Estereotipo | `@Service`, `@Repository`, `@Component`: marcan la clase y su papel |
| Inyección por constructor | Declarar en el constructor lo que la clase necesita |
| Singleton | Una sola instancia de cada bean, compartida por toda la aplicación |
| Dependencia circular | Dos clases que se necesitan mutuamente. Spring se niega, y hace bien |
| `Optional` | Una caja que puede tener valor o estar vacía. Obliga a considerar el vacío |
| Test unitario | Código que ejecuta código y comprueba el resultado automáticamente |
| Doble de prueba | Implementación de mentira que controla qué datos ve lo que estás probando |
| Preparar, actuar, comprobar | Las tres zonas de todo test |

### Comprobación final del producto

<div class="checkpoint">
  <p class="checkpoint-label">Comprobación final · con el proyecto delante</p>
  <ul class="checklist">
    <li>Ningún controlador tiene listas, bucles de búsqueda, contadores ni reglas.</li>
    <li>Ningún service menciona HTTP, códigos de estado ni DTO.</li>
    <li>No queda ningún <code>new</code> de un colaborador.</li>
    <li>Los repositorios son interfaces con su implementación en memoria detrás.</li>
    <li>Cada regla de negocio tiene su test, y <code>./mvnw test</code> pasa en verde.</li>
    <li>La colección pasa en verde sin ninguna petición modificada desde la UD3.</li>
    <li><code>PROBLEMAS.md</code> está tachado línea a línea.</li>
  </ul>
</div>

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

### La siguiente unidad

Cuatro unidades, cuatro preguntas:

<figure class="diagram">
  <figcaption>El recorrido hasta aquí</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>UD1 · que responda</li>
    <li>UD2 · que responda bien</li>
    <li>UD3 · que esté bien diseñada</li>
    <li>UD4 · que se pueda mantener</li>
  </ol>
</figure>

Queda la quinta, y es la que lleva cuatro unidades apareciendo al final de cada cierre:

> **¿Y esto dónde se guarda?**

Cada vez que has reiniciado la aplicación se ha perdido todo. Lo has anotado como defecto conocido en la UD1, en la UD2 y en la UD3, y ha llegado el momento.

| Lo que sigue mal | Se arregla en |
| :--- | :--- |
| Al reiniciar se pierde todo | UD5, con PostgreSQL |
| Buscar recorre la lista entera, uno por uno | UD5, con consultas |
| Las relaciones son un `id` suelto que nadie garantiza | UD5, con integridad referencial |
| Dos operaciones simultáneas pueden pisarse | UD5, con transacciones |

Y aquí se cobra el trabajo de estas dos semanas: **cambiar de almacenamiento va a ser un cambio localizado**. Se borra la implementación en memoria, aparece una interfaz que extiende `JpaRepository`, y el service, el controller, los DTO, el mapper y los tests se quedan exactamente como están.

Si al terminar la UD5 has tenido que abrir el controlador, algo se colocó mal aquí.

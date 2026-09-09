---
title: "Cloud y arquitecturas modernas"
label: "UD3 · Proyecto"
section: "ud-03"
order: 3
lang: "es"
summary: "Publica tu primera aplicación en Internet. De localhost a un dominio propio con HTTPS, pasando por una máquina virtual, Nginx, reglas de red, DNS y certificados."
duration: "5 horas · 5 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Sitio de laboratorio y arquitectura. Una actividad acumulativa por unidad, con evidencias y aportación individual."
date: "2026-09-09"
outcomes:
  - "Publicar una web real, accesible desde cualquier dispositivo de Internet."
  - "Explicar la diferencia entre IaaS, PaaS y SaaS con un ejemplo propio."
  - "Abrir un puerto en el firewall de la nube y en el del sistema, y saber por qué son dos."
  - "Asociar un nombre DNS y servir la web por HTTPS."
  - "Dibujar y defender la arquitectura que habéis montado."
requirements:
  - "Guía de arranque y materiales de esta unidad, enlazados en la página."
  - "Carpeta o documento de actividad compartido con el docente."
priorKnowledge:
  - "Las unidades anteriores de este módulo. No se requiere Servidor, Intermodular ni el otro módulo transversal."
---

<p class="lead">Sitio de laboratorio y arquitectura. Cada sesión introduce los conceptos que necesita y continúa una misma actividad de la unidad. Conserva sus resultados para revisarlos y utilizarlos después.</p>

## Cómo trabajar esta unidad

Son 5 sesiones de una hora: 10 minutos de explicación, 45 de trabajo guiado y 5 de cierre. Si el periodo del centro es de 55 minutos, se ajusta el trabajo a 40 minutos. Los ejemplos ampliados son material de consulta durante la práctica; no añaden otra clase teórica ni tareas obligatorias.

Abre la [guía de arranque y evaluación](/es/docencia/talleres-transversales/). Incluye archivos, herramientas y alternativas de acceso. Para los casos utiliza la [ficha común](/teaching/transversales/casos.pdf). No se necesita el CRUD de Servidor ni el workflow de Intermodular. Quien ya conozca una herramienta utiliza ese conocimiento para justificar y comprobar la actividad nueva, sin repetir una entrega ya evaluada.

## Actividad y criterios de evaluación

**Sitio de laboratorio y arquitectura.** Guarda el trabajo en `digitalizacion/ud3/`, y redacta la actividad en Word, LibreOffice o un documento en línea; exporta la entrega a PDF. Cada sesión añade su avance, comprobación y pendiente; no se entrega un informe diferente por sesión. Cuando haya código, enlaza el repositorio y la versión o adjunta la carpeta identificada según el canal del aula. Nunca incluyas credenciales.

Esta actividad se valora sobre 10 puntos y aporta **5/30 de la calificación del módulo**. La nota del módulo se obtiene sumando cada nota de actividad multiplicada por sus horas y dividiendo entre 30. Las preguntas y revisiones forman parte de la actividad; no hay un examen adicional. Cada integrante registra y explica su aportación. La rúbrica se conoce desde el inicio:

<table>
  <thead>
    <tr>
      <th>Criterio</th>
      <th class="align-right">Puntos</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Web correctamente publicada</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Configuración correcta de VM y Nginx</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>DNS y HTTPS funcionando</td>
      <td class="align-right">2</td>
    </tr>
    <tr>
      <td>Comprensión de la arquitectura</td>
      <td class="align-right"><strong>3</strong></td>
    </tr>
    <tr>
      <td>Calidad y claridad de la memoria</td>
      <td class="align-right">1</td>
    </tr>
  </tbody>
</table>

En cada criterio, una evidencia ausente no permite acreditar el logro; una evidencia incompleta requiere revisión; una evidencia correcta permite comprobar el resultado; el logro completo añade una justificación coherente y reconoce sus límites. Los puntos se asignan según el grado de logro del criterio, no por cantidad de archivos, commits o texto. Consulta la guía para revisar y volver a presentar los criterios pendientes.

## Sesión 1 · Del portátil a una máquina en Azure

**Punto de partida.** Actividad «Sitio de laboratorio y arquitectura», sesión 1 de 5. Abre los materiales enlazados y crea el registro de la unidad. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

La **nube** permite utilizar recursos de un proveedor por red. En IaaS administramos una máquina virtual y su sistema; en PaaS el proveedor gestiona más infraestructura y desplegamos la aplicación; en SaaS utilizamos un programa terminado. Hoy usaremos una máquina Ubuntu para observar esas responsabilidades, con un sitio estático proporcionado.

Una máquina virtual es un ordenador definido por software. Su IP identifica una interfaz en la red; SSH permite abrir una terminal remota cifrada. Los comandos escritos en esa terminal actúan en Ubuntu, no en tu Windows. Identificar dónde estás evita modificar el equipo equivocado.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre la [guía de arranque](/es/docencia/talleres-transversales/#cloud) y descarga el sitio inicial. Extrae el ZIP, abre `index.html` y cambia el nombre de la empresa. Guarda una copia en la carpeta de la UD3.
2. Sigue el apartado GitHub de la guía para crear un repositorio y subir los archivos, con `index.html` en su raíz. Comprueba los archivos desde GitHub; si ya tenías un sitio, utiliza una copia de laboratorio y conserva su autoría.
3. Utiliza el entorno Ubuntu asignado o crea la VM siguiendo la ficha de cloud. Registra proveedor, sistema, usuario e IP, junto con quién administra y revisa el coste. La cuenta personal no es requisito si el centro proporciona el entorno.
4. Desde la terminal local ejecuta el comando SSH de la ficha, sustituyendo usuario, ruta de clave e IP por los de tu entorno. Comprueba con `whoami` y `hostname` que estás dentro de Ubuntu.
5. Actualiza la lista de paquetes con `sudo apt update`. Guarda el resultado y dibuja portátil → conexión SSH → VM. Si la conexión falla, revisa IP, usuario, clave y acceso al puerto 22 en ese orden.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

El sitio inicial está disponible y puedes identificar el entorno remoto. Nunca incluyas la clave privada en la entrega. Registra una incidencia de acceso sin inventar un despliegue completado.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 1»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 2 · Nginx y abrir la puerta a Internet

**Punto de partida.** Actividad «Sitio de laboratorio y arquitectura», sesión 2 de 5. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un **servidor web** recibe una petición HTTP y devuelve un recurso, como un archivo HTML. Nginx realizará esa función. Instalarlo no basta para acceder desde Internet: la red del proveedor y el sistema operativo deben permitir el tráfico al puerto correspondiente.

La raíz del sitio es la carpeta donde Nginx busca los archivos. Si sirve su bienvenida en vez de tu página, no demuestra que tu código esté roto: puede estar seleccionando otro sitio. Comprobaremos primero el servicio, luego la conexión y después el contenido, para no cambiar varias cosas a la vez.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Conecta por SSH y abre el bloque «Publicar con Nginx» de la guía. Ejecuta sus comandos de instalación y comprueba `systemctl status nginx`; pulsa `q` para salir de la vista del estado.
2. Comprueba la respuesta local con `curl -I http://localhost`. Después permite HTTP en la regla de red del entorno. Si UFW está activo, aplica también la regla indicada en la guía.
3. Copia el sitio desde su repositorio público a `/var/www/mi-sitio` siguiendo la guía. Comprueba con `ls` que `index.html` está directamente dentro de esa carpeta.
4. Crea la configuración de Nginx con la plantilla proporcionada. Actívala, ejecuta `sudo nginx -t` y recarga solo si la comprobación es correcta. Si informa una línea errónea, corrígela antes de continuar.
5. Abre la IP pública desde el navegador y busca el nombre de tu empresa. Guarda una captura y explica el recorrido petición → regla de red → Nginx → archivo. Distingue un fallo de conexión de una página equivocada.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La IP sirve vuestro sitio y el mapa identifica sus dos niveles de control de red. Se evalúa la arquitectura y su comprobación, no un workflow de CI.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 2»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 3 · Un nombre propio y HTTPS

**Punto de partida.** Actividad «Sitio de laboratorio y arquitectura», sesión 3 de 5. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

**DNS** relaciona un nombre con una dirección, de modo que el visitante no tenga que recordar la IP. Un registro A apunta un nombre a una IPv4. Cambiar DNS no copia la web: el contenido sigue en la máquina que la sirve.

**HTTPS** utiliza TLS para proteger la comunicación y comprobar la identidad del servidor mediante su certificado. No corrige los errores del código ni garantiza que una empresa sea fiable. El nombre solicitado debe coincidir con el del certificado. Primero comprobaremos DNS y HTTP; después añadiremos HTTPS para poder localizar los fallos.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Obtén el nombre de laboratorio proporcionado por el centro o configura el subdominio siguiendo la guía. Anota el nombre y la IP a la que debe apuntar; no compartas el token del proveedor DNS.
2. Comprueba la resolución con `nslookup TU_NOMBRE`. Compara la dirección devuelta con la IP pública actual de la VM. Si difieren, revisa el registro antes de tocar Nginx.
3. Sustituye `server_name` por ese nombre en la configuración del sitio. Comprueba y recarga Nginx; visita primero `http://TU_NOMBRE` y confirma que aparece tu página.
4. Sigue los pasos de Certbot de la guía y permite el puerto 443. El entorno debe aceptar el desafío de validación; si no puede hacerlo, registra el paso exacto y utiliza el entorno docente preparado.
5. Abre `https://TU_NOMBRE`, inspecciona el certificado y anota nombre, emisor y fecha de caducidad. Comprueba que imágenes y estilos cargan también y que HTTP redirige si activaste esa opción.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

Nombre, resolución y certificado corresponden al mismo sitio. Explica qué protege HTTPS y qué no. La evidencia no incluye secretos DNS ni claves SSH.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 3»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 4 · Mantener y endurecer

**Punto de partida.** Actividad «Sitio de laboratorio y arquitectura», sesión 4 de 5. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Mantener una web implica actualizar sus archivos y comprobar que sigue funcionando. Un cambio pequeño permite relacionar lo observado con lo que se ha modificado. El historial identifica una versión, pero actualizar con Git no comprueba por sí solo que la web responda.

El mantenimiento incluye paquetes del sistema, configuración y recursos contratados. Detener una VM puede dejar otros recursos asociados activos: por eso el cierre requiere revisar el inventario del entorno y su coste, no solo cerrar la terminal SSH.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Abre el sitio en local y cambia una frase visible. Guarda, comprueba el HTML y sube la actualización a su repositorio siguiendo la guía. Anota la versión o commit que contiene el cambio.
2. En Ubuntu entra en `/var/www/mi-sitio` y actualiza únicamente ese repositorio con el procedimiento de la guía. Confirma que el archivo incorpora la frase nueva.
3. Visita la URL pública y recarga sin caché. Si ves una versión antigua, compara primero el archivo del servidor y después la respuesta del navegador.
4. Revisa las reglas de acceso: la administración SSH debe estar limitada al acceso de aula previsto; HTTP y HTTPS sirven al público. Describe para qué existe cada puerto permitido.
5. Completa el inventario del entorno y el procedimiento acordado de conservación o retirada. Guarda la URL, versión, resultado y pendientes; coordina la fecha de retirada para que la actividad pueda evaluarse.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La actualización se puede relacionar con una versión concreta y se ha comprobado desde el navegador. No hace falta construir automatización de despliegue.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 4»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. Este avance forma parte de la actividad de la unidad, no de una segunda entrega independiente.

## Sesión 5 · Explicar la arquitectura

**Punto de partida.** Actividad «Sitio de laboratorio y arquitectura», sesión 5 de 5. Abre el avance de la sesión anterior; los pasos de hoy indican qué conservar y qué completar. La [guía de arranque](/es/docencia/talleres-transversales/) permite preparar las herramientas sin depender de otros módulos.

### Se explica

<p class="stage stage--brief">10 minutos · contexto, explicación y ejemplo</p>

Un diagrama de arquitectura es útil si permite seguir una petición y localizar responsabilidades. El navegador consulta DNS, conecta con la dirección obtenida y solicita contenido a Nginx. El certificado interviene en la conexión HTTPS; GitHub conserva el código, pero no es quien sirve esta web de laboratorio.

Después de montar una VM podemos comparar su coste de administración con un servicio gestionado. Elegir IaaS para aprender no significa que sea siempre la mejor decisión empresarial. La elección debe considerar necesidad, mantenimiento, acceso y límites del servicio.

### Se trabaja

<p class="stage stage--guided">45 minutos · trabajo guiado sobre la actividad</p>

1. Dibuja el recorrido completo usando los nombres reales de vuestro entorno. Separa la ruta del visitante de la ruta que seguisteis para actualizar el código.
2. Para cada pieza añade una responsabilidad: resolver nombre, filtrar tráfico, servir archivo, cifrar conexión o conservar versión. Elimina las flechas cuyo significado no puedas explicar.
3. Completa una tabla IaaS/PaaS/SaaS con qué administraríais en cada modelo y un uso posible para la empresa. No hace falta contratar otras opciones.
4. Pide a otra pareja que explique qué comprobaría si el sitio responde por IP pero no por nombre. Utiliza su respuesta para detectar y corregir huecos del diagrama.
5. Entrega sitio, URL y documento de arquitectura con comprobaciones. Cada integrante explica una pieza y una incidencia resuelta. Enlaza el registro de sesiones, sin redactar otra memoria del mismo despliegue.

### Cierre

<p class="stage">5 minutos · comprobar y guardar el avance</p>

La actividad demuestra publicación y comprensión de la arquitectura. La alternativa elegida debe justificarse; una URL por sí sola no explica el trabajo.

**Entrega de la sesión.** Actualiza el documento de la actividad de UD3 (Word, LibreOffice o documento en línea) y conserva una versión en PDF con «Sesión 5»: resultado, enlace o archivo de evidencia, comprobación y pendiente. Cada integrante identifica su aportación. Comparte el PDF y los enlaces a las evidencias por el canal del aula; si el trabajo está en GitHub, identifica el commit y comprueba el acceso del docente. La actividad de la unidad queda lista para valorar con su rúbrica; las correcciones se documentan en el mismo registro.

## Lo que debes recordar

La actividad se sostiene en una decisión explicada y una evidencia que otra persona pueda comprobar. Conserva el contexto, el procedimiento y sus límites; una captura sin condiciones o un resultado de IA sin revisar no sustituyen esa explicación.

Reutiliza los resultados de esta unidad cuando el plan final los necesite, enlazando su versión. No vuelvas a redactar las mismas pruebas ni conviertas datos ficticios o estimaciones en mediciones reales.

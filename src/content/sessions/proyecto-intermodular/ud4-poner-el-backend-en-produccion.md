---
title: "Poner el backend en producción"
label: "UD4 · Conectar"
section: "ud-04"
order: 4
lang: "es"
summary: "Publicar el backend de Servidor en AWS Academy: CI, artefacto trazable, EC2 y PostgreSQL local, contrato y persistencia comprobados durante las sesiones."
duration: "18 horas · 6 sesiones de 3 h"
modality: "Taller · 25 min de explicación, 140 min de trabajo guiado y 15 min de cierre"
deliverable: "Backend publicado con persistencia, CI y contrato comprobados."
date: "2026-09-09"
outcomes: ["Configurar el CI de Java sobre el repositorio existente.", "Desplegar el artefacto y diagnosticar su arranque.", "Comprobar el contrato publicado con la colección de Servidor.", "Preparar PostgreSQL aislado para CI y persistente en producción.", "Identificar versión, configuración y evidencias del producto compartido."]
requirements: ["Portfolio publicado con pipeline.", "Repositorio de Spring Boot creado en Servidor y su wrapper de Maven.", "Java 21 y colección de peticiones existente.", "Clase AWS Academy Learner Lab asignada y presupuesto disponible."]
priorKnowledge:
  - "El flujo de integración completo: issue, rama, pull request, revisión, fusión y despliegue."
  - "De Servidor: controladores REST, DTO, validación y manejo de errores."
---

<p class="lead">La API desarrollada en Servidor se ejecuta actualmente en la estación de trabajo de quien la programó. El objeto de esta unidad es publicarla en AWS Academy Learner Lab bajo una URL comprobable durante las sesiones. El CI valida el artefacto y la publicación es manual y trazable. La integración desde el portfolio requiere HTTPS válido.</p>

<div class="rule">
  <p class="rule-label">Delimitación de competencias evaluativas</p>
  <p>El código de la API corresponde al módulo de <strong>Servidor</strong>: su arquitectura por capas, sus validaciones, su tratamiento de errores y sus pruebas. Los defectos técnicos se corrigen en ese mismo repositorio y su evaluación pertenece a dicho módulo. En Proyecto Intermodular se evalúa que ese código resida en un repositorio sometido a un flujo de integración, que un pipeline lo compile y ejecute sus pruebas antes de autorizar la fusión, que se encuentre desplegado y que una colección de peticiones verifique su contrato; el cliente completo se aborda tras las unidades 33 y 34 de Servidor. Una implementación técnicamente excelente que solo se ejecute en un entorno local no supera los criterios de esta unidad.</p>
</div>

<div class="rule">
  <p class="rule-label">Incorporación de la persistencia dentro del trimestre</p>
  <p>El artefacto desplegado es el mismo CRUD seleccionado y desarrollado en Servidor. La primera publicación puede mantener el estado en memoria, con la consiguiente pérdida de los datos en cada reinicio del proceso: no constituye un defecto, pero debe documentarse en el README para conocimiento de quien consulte el proyecto. PostgreSQL se incorpora en la UD5 de Servidor, dentro todavía del <strong>primer trimestre</strong>, y a partir de ese momento la versión persistente se publica mediante el mismo procedimiento de artefacto aprobado y despliegue manual. En ningún caso se crea una segunda API.</p>
</div>

### Los hitos compartidos del primer trimestre

| Lo que entrega Servidor | Lo que se trabaja aquí |
| --- | --- |
| CRUD en memoria con DTO, validación y errores, al terminar la UD3 | Repositorio del backend, CI y primera puesta en producción |
| Capas y tests de servicio, en la UD4 | Ejecutar las pruebas en cada pull request y comprobar que un fallo bloquea la fusión |
| CRUD con PostgreSQL y tests de repositorio, en la UD5 | Configurar la base de datos del entorno desplegado, sus variables y el entorno de pruebas del CI; publicar la misma API persistente |
| Versión del primer trimestre revisada y defendida, en la UD6 | Identificar el mismo commit desplegado y conservar las evidencias del workflow, CI, revisiones y puesta en producción |

La secuencia está coordinada con Servidor: ninguna sesión exige contenidos que no se hayan impartido allí previamente, y cada una opera sobre la versión del backend disponible en esa fecha. El flujo de integración construido en estas seis sesiones permanece operativo y se aplica a cada incremento del backend hasta el cierre del trimestre. Si al llegar a la sesión 11 la UD5 de Servidor no estuviera completa, se publica el estado disponible y las mejoras posteriores se incorporan por el mismo procedimiento. La entrega del trimestre requiere persistencia comprobada en el entorno publicado. La parada automática de Learner Lab no penaliza la disponibilidad fuera de las sesiones; se conservan fecha, versión y evidencias.

## Sesión 7 · El CI del repositorio de Servidor

**Antes de empezar.** La API de Servidor ya tiene DTO, validaciones y respuestas de error. Hoy le montas la compilación y las pruebas automáticas, con el Maven Wrapper que ya trae el proyecto.

<div class="checkpoint checkpoint--start">
  <p class="checkpoint-label">Antes de empezar · sin apuntes</p>
  <ol>
    <li>La API se ejecuta en el entorno local. ¿Qué condiciones serían necesarias para que la consumiera una persona ajena al aula?</li>
    <li>El pipeline del portfolio comprueba HTML, enlaces, formato y accesibilidad. ¿Qué tendría que comprobar el de una API?</li>
    <li>¿Qué directorios de un proyecto Java no deben incorporarse nunca a un repositorio de código, y por qué?</li>
  </ol>
</div>

---

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Reutilizar el repositorio desde el primer día

El backend ya está en GitHub desde Servidor 1. Conservamos ese repositorio, sus ramas y su historial; no se copia a otro para Intermodular. El portfolio puede tener su propio repositorio de presentación. Si el cliente del producto vive dentro del backend, también se conserva esa estructura: un monorepo puede configurar rutas de trabajo por job.

#### Qué hace el CI de Java

Maven lee pom.xml, compila el código, ejecuta las pruebas y construye el JAR. GitHub Actions repetirá ese proceso en un runner limpio. El wrapper fija Maven, pero para reproducir la construcción también deben coincidir Java, dependencias y configuración.

Un artefacto es el resultado construido, en este caso el JAR. No se guarda en Git: el workflow lo genera y lo entrega al despliegue. Las pruebas se implementan en Servidor; aquí se comprueba que el proceso las ejecuta y que su fallo bloquea la fusión.

#### Antes de publicar

Primero se reproduce verify en local y después en CI. Un fallo local se registra y se corrige sobre la misma rama del producto. Un fallo del runner puede deberse a Java, permisos del wrapper o configuración; los logs permiten distinguirlo de un defecto de implementación.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · El repositorio de la API

1. Abre la carpeta del backend de Servidor. Ejecuta `git remote -v`, `git status` y `git log -5 --oneline`; comprueba que es el repositorio utilizado desde la sesión 1, con su historial. No ejecutes git init ni crees otro remoto.
2. En main actualizada, crea una rama para la issue del CI. Ejecuta `.\mvnw.cmd -B verify` en PowerShell (`./mvnw -B verify` en Linux/macOS). Si falla, guarda el mensaje causal y corrige la configuración o enlaza la issue técnica; conserva el trabajo útil de la sesión.
3. Abre pom.xml y anota Java 21, la versión del proyecto y la presencia del wrapper. Revisa que target y credenciales no se rastrean. `git status` permite ver qué subirás; el historial de Servidor se conserva completo.
4. Comprueba las reglas configuradas en Intermodular 2 también en el backend. Si aún falta el check de Java, se añadirá después de su primera ejecución. La política de revisión debe ser la misma en ambos módulos.
5. Continúa con el workflow del bloque B. El código que compilamos es el CRUD con DTO y errores disponible después de Servidor 12.

#### Bloque B · El CI que compila

<p class="stage stage--solo">Trabajo individual, por el flujo establecido: issue, rama, pull request</p>

Crea el archivo `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    name: Compilar y probar
    runs-on: ubuntu-latest
    steps:
      - name: Descargar el repositorio
        uses: actions/checkout@v4

      - name: Preparar Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "21"
          cache: maven

      - name: Compilar y ejecutar los tests
        run: bash ./mvnw -B verify
```

<dl class="worked">
  <dt><code>distribution</code> y <code>java-version</code></dt>
  <dd><strong>Debe declararse la versión registrada en el paso 2</strong>, no el valor 21 del ejemplo. El runner no aprovisiona ningún JDK por defecto: la distribución y la versión se declaran de forma explícita. Si el valor declarado no coincide con el que especifica el <code>pom.xml</code>, la compilación falla con un mensaje que no menciona ninguna de las dos versiones.</dd>
  <dt><code>cache: maven</code></dt>
  <dd>Conserva entre ejecuciones el repositorio local de dependencias. Sin esta directiva, cada pull request vuelve a descargar el árbol completo de dependencias, con el consiguiente incremento de la duración del job.</dd>
  <dt><code>./mvnw</code></dt>
  <dd>El <em>Maven Wrapper</em> incluido en el proyecto. Utiliza la versión de Maven declarada por el propio proyecto y no la instalada en la máquina anfitriona, lo que garantiza una construcción equivalente en el runner y en cualquier entorno local.</dd>
  <dt><code>-B</code></dt>
  <dd>Modo por lotes (<em>batch</em>): suprime el coloreado y los indicadores de progreso, que en un registro no interactivo generan ruido y dificultan el diagnóstico.</dd>
  <dt><code>verify</code></dt>
  <dd>Fase del ciclo de vida de Maven que compila el código, ejecuta las pruebas y construye el artefacto empaquetado. El fallo de cualquiera de las tres etapas determina el fallo del job.</dd>
</dl>

<details class="aside aside--help">
  <summary>Si el job falla con «permission denied» al ejecutar <code>./mvnw</code></summary>
  <p>Es la incidencia más frecuente de esta sesión y no guarda relación con el código de la aplicación. El runner ejecuta Linux, donde un archivo requiere el bit de permiso de ejecución; el sistema de archivos de Windows no conserva ese atributo, de modo que el wrapper se incorporó al repositorio sin él. Se corrige registrando el permiso en el índice de Git y publicando el cambio:</p>
  <p><code>git update-index --chmod=+x mvnw</code>, después commit y push.</p>
  <p>Conviene retener la causa: es la primera manifestación práctica de que el entorno de construcción no coincide con el entorno de desarrollo, diferencia que reaparecerá en otros contextos.</p>
</details>

<details class="aside aside--help">
  <summary>Si el proyecto no incorpora <code>mvnw</code></summary>
  <p>Utiliza <code>mvn -B verify</code>, sin el prefijo <code>./</code>: los runners incorporan Maven preinstalado. La construcción se completa, pero la solución es inferior, dado que la versión de la herramienta la determina la máquina y no el proyecto. Restaura los archivos del wrapper desde el historial o desde la plantilla de Servidor, conservando el código y el repositorio actuales.</p>
</details>

**Provocación controlada de fallos.** Introduce las dos alteraciones siguientes en una rama de diagnóstico, sin fusionarlas, y restaura su estado antes de aprobar la pull request:

| Alteración introducida | Propiedad que demuestra |
| ---------------------- | ----------------------- |
| Supresión de un punto y coma en una clase | El pipeline impide la integración de código que no compila |
| Inversión temporal de una aserción de prueba | El pipeline impide la integración de código que compila pero incumple su especificación |

El segundo caso constituye la diferencia sustancial entre este pipeline y el del portfolio: la validación no se limita a la corrección sintáctica del artefacto, sino que verifica su comportamiento.

#### Bloque C · Comprobación obligatoria y primer recorrido del flujo

<p class="stage stage--solo">Trabajo individual</p>

1. Fusiona la pull request que incorpora el CI.
2. Accede a **Settings → Rules → Rulesets → main protegida → Edit → Require status checks** e incorpora **Compilar y probar**.
3. Abre tres issues correspondientes a los siguientes incrementos previstos de la API y recorre al menos una de forma completa por el flujo de integración.

<div class="checkpoint">
  <p class="checkpoint-label">Lista de verificación de la sesión 7</p>
  <ul class="checklist">
    <li>El repositorio de la API existe, es público y no contiene la carpeta de construcción.</li>
    <li>Cada pull request muestra el check «Compilar y probar».</li>
    <li>La comprobación es obligatoria y se ha verificado una pull request bloqueada por una prueba fallida.</li>
    <li>Una issue de la API recorrida entera.</li>
  </ul>
</div>

---

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>


<div class="checkpoint checkpoint--recall">
  <p class="checkpoint-label">Antes de cerrar · sin mirar</p>
  <ol>
    <li>¿Por qué el directorio de construcción no se incorpora al repositorio?</li>
    <li>¿Qué hace <code>verify</code> que no haría solo compilar?</li>
    <li>¿Para qué sirve <code>cache: maven</code>?</li>
    <li>¿Por qué el wrapper produce una construcción equivalente en el runner y en el entorno local?</li>
  </ol>
</div>

<details class="aside aside--extra">
  <summary>Ver respuestas</summary>
  <p>1 · Porque se regenera con un comando, pesa, cambia entera en cada compilación y provoca conflictos. Al repositorio va lo que escribe una persona.</p>
  <p>2 · Ejecuta los tests y construye el artefacto, además de compilar.</p>
  <p>3 · Para reutilizar las dependencias ya descargadas y no bajarlas en cada ejecución.</p>
  <p>4 · Porque fija la versión de Maven en el propio proyecto, en lugar de usar la que tenga instalada cada máquina.</p>
</details>

<div class="checkpoint checkpoint--weekly">
  <p class="checkpoint-label">Antes de la sesión 8</p>
  <ul class="checklist">
    <li>La API se ejecuta en el entorno local y responde a una petición efectuada desde el navegador.</li>
    <li>Es posible identificar el puerto en el que escucha —el proceso lo indica al arrancar— y la ruta que devuelve la colección de datos.</li>
    <li>El check de compilación está en verde en <code>main</code>.</li>
  </ul>
</div>

## Sesión 8 · La API en una URL

**Antes de empezar.** El backend de Servidor tiene CI y una versión revisada en `main`. Hoy publicarás su JAR en una EC2 de AWS Academy Learner Lab. Conservamos el repositorio y el contrato existentes.

**Preparación del docente antes de esta clase.** Crear la clase Learner Lab, matricular o invitar al alumnado y comprobar un acceso de estudiante. Tener AWS Academy no significa tener ya un laboratorio asignado. La preparación de cuentas y la resolución de invitaciones se hacen antes del taller. El nombre DNS necesario para HTTPS también debe acordarse con antelación; el alumnado no tiene que comprar un dominio.

**Recorrido de hoy:** descargar el JAR aprobado → entrar en el laboratorio → crear una máquina → copiar el JAR → arrancarlo → comprobar su URL → detener la máquina. En las siguientes sesiones se reutiliza esa máquina.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### El entorno de este curso

Vas a pasar por tres pantallas distintas. No necesitas abrir una cuenta nueva en la web comercial de AWS:

| Pantalla | Cómo reconocerla | Para qué la utilizas |
| --- | --- | --- |
| AWS Academy / LMS | Lista de cursos y menú Módulos | Entrar en la clase a la que te ha invitado el docente |
| Learner Lab | Botones Start Lab, End Lab, AWS Details y un temporizador | Activar la sesión, ver el presupuesto y recuperar la clave de acceso |
| Consola AWS | Buscador de servicios y selector de región arriba | Crear y detener tu máquina EC2 |

**EC2** es el servicio de máquinas virtuales; una **instancia** es tu máquina concreta. La **región** indica dónde se aloja. El **grupo de seguridad** es su filtro de conexiones. El **JAR** contiene tu aplicación Java. La clave **PEM** permite identificarte al entrar por SSH y debe mantenerse privada.

Usaremos **AWS Academy Learner Lab**, sin una cuenta personal de pago. El docente debe crear la clase e invitar al alumnado antes del taller. La cuenta docente no se comparte: cada estudiante utiliza el entorno asignado. Comprueba allí el presupuesto y las fechas, sin dar por supuesto un importe universal.

La sesión dura cuatro horas por defecto y puede renovarse con **Start Lab** antes de finalizar. Al terminar, EC2 se detiene; las instancias que estaban encendidas se vuelven a iniciar al abrir otra sesión, según la guía del laboratorio. El disco se conserva mientras dure el curso y haya presupuesto. La IP pública puede cambiar. Se evalúa una publicación de laboratorio comprobada durante las sesiones, con fecha, versión y evidencias conservadas; no se exige disponibilidad permanente.

El temporizador mide **esta sesión**, no una cuota de cuatro horas semanales. El dinero indicado es el presupuesto total de tu laboratorio para la clase: **no se repone cada día ni al pulsar Start Lab**. El indicador de gasto puede actualizarse con retraso; un valor de cero no demuestra que todos los recursos sean gratuitos.

La configuración de referencia es **Ubuntu 24.04 LTS, t3.small, 8 GiB de disco y región us-east-1**. Usaremos Java 21, Nginx y systemd. En la sesión 12 PostgreSQL utilizará el disco de esa misma máquina y escuchará solo en localhost. No necesitamos RDS, balanceador, NAT Gateway ni IP elástica. El almacenamiento puede seguir generando consumo con la instancia detenida; revisa inventario y presupuesto al cerrar.

#### CI y publicación son pasos distintos

GitHub Actions compila, prueba y conserva el JAR. Después, una persona publica ese mismo artefacto aprobado y registra su commit. Es **integración continua y despliegue manual trazable**, no despliegue continuo automático. Learner Lab restringe IAM: no se crean usuarios ni roles propios para conectar GitHub con AWS. No copies credenciales temporales del laboratorio a GitHub ni instales un runner persistente en una máquina expuesta.

#### HTTP de prueba y HTTPS del producto

La primera comprobación utiliza HTTP y datos ficticios sin autenticación. No envíes contraseñas, tokens ni datos personales por esa conexión. Antes de integrar un cliente servido por GitHub Pages o activar autenticación, hace falta **HTTPS válido**: el navegador bloquea las peticiones de una página HTTPS a una API HTTP. Abrir 443 por sí solo no instala TLS. El procedimiento de nombre y certificado aparece al final de esta sesión.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Conservar el artefacto aprobado

Mediante PR añade estos pasos al final del job de la sesión 7, después de `verify`. El ejemplo presupone un único módulo Maven y un JAR ejecutable de Spring Boot. Si hay varios módulos, fija la ruta concreta del backend.

```yaml
      - name: Preparar el artefacto de main
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        shell: bash
        run: |
          mkdir -p entrega
          mapfile -t jars < <(find target -maxdepth 1 -type f -name '*.jar' ! -name '*-sources.jar' ! -name '*-javadoc.jar')
          test "${#jars[@]}" -eq 1
          cp "${jars[0]}" entrega/app.jar
          printf '%s\n' "$GITHUB_SHA" > entrega/commit.txt
          (cd entrega && sha256sum app.jar > app.jar.sha256)

      - name: Conservar el JAR verificado
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: actions/upload-artifact@v4
        with:
          name: backend-${{ github.sha }}
          path: entrega/
          retention-days: 14
```

Fusiona la PR y espera al CI de `main`. Descarga desde **Actions → ejecución correcta → Artifacts** el archivo de esa ejecución. Extrae `app.jar`, `commit.txt` y `app.jar.sha256` en una carpeta de entrega. Comprueba que el commit corresponde a `main` y que el JAR es ejecutable. No compiles otra versión para publicar. Conserva el artefacto fuera de la retención temporal de Actions si lo necesitas para recuperación.

**Cómo encontrarlo:** en tu repositorio de GitHub abre **Actions**, pulsa la ejecución de **CI** asociada al último commit aprobado de `main` y espera el indicador verde. Al final de su página aparece **Artifacts**, con un archivo llamado `backend-` seguido del commit. Descárgalo y utiliza **Extraer todo** en Windows; no trabajes dentro del ZIP. Si no aparece, comprueba que estás en una ejecución posterior a la fusión en `main`, no en la ejecución de la PR, y que terminó el paso de subida del artefacto.

**Antes de seguir:** debes ver tres archivos sueltos en la carpeta extraída: `app.jar`, `commit.txt` y `app.jar.sha256`. Abre `commit.txt`: es el identificador de la versión que vas a publicar. No abras ni descomprimas el JAR.

#### Bloque B · Crear el entorno una sola vez

**1 · Entrar en tu clase.** En AWS Academy abre el LMS y la clase indicada por el docente. En **Módulos**, pulsa **Lanzamiento del Laboratorio para el alumnado de AWS Academy**. Si no ves la clase o hay un requisito inicial pendiente, comunícalo al docente; no elijas otro curso ni crees una cuenta de pago.

**2 · Activar la sesión.** Pulsa **Start Lab** una vez y espera. El indicador junto a **AWS** debe ponerse verde; en el primer acceso puede necesitar varios minutos. No pulses Reset. Cuando esté listo, pulsa **AWS** para abrir la consola en otra pestaña. Si el navegador bloquea esa ventana, permite la apertura de la consola para esta página. Mantén abierta la pestaña del laboratorio.

**3 · Elegir la región y el servicio.** En la esquina superior derecha de la consola selecciona **Estados Unidos (Norte de Virginia) / US East (N. Virginia), us-east-1**. En el buscador superior escribe **EC2**, abre ese servicio y pulsa **Lanzar instancia / Launch instance**. Si ves recursos vacíos o errores de permisos, comprueba la región antes de crear nada más.

**4 · Completar la máquina.** Despliega cada apartado del formulario y utiliza esta tabla. Cambiar la imagen del sistema puede restablecer otros campos: revisa la red otra vez al terminar.

| Campo del formulario | Valor de esta práctica | Qué significa |
| --- | --- | --- |
| Nombre / Name | `intermodular-TU_IDENTIFICADOR` | Una etiqueta para reconocer tu máquina; sustituye el identificador |
| Imagen / AMI | Ubuntu Server **24.04 LTS**, sin Pro ni Marketplace | El sistema operativo que instala nuestra plantilla |
| Arquitectura | **64 bits (x86)** | Debe coincidir con la imagen y el tipo de máquina |
| Tipo / Instance type | **t3.small** | Dos CPU virtuales y 2 GiB de memoria; no significa que sea gratis |
| Número de instancias | **1** | No necesitas una máquina por ejecución ni por sesión |
| Almacenamiento / Storage | **8 GiB, gp3**, un volumen | El disco donde quedan aplicación y base de datos |
| Par de claves / Key pair | **vockey**, ya existente | La clave del laboratorio para conectarte por SSH |

El JDK de la plantilla es Java 21: si el proyecto exige otra versión, acuerda y verifica la adaptación antes de continuar. Si no aparece una opción exacta, pregunta antes de elegir una máquina mayor o de pago diferente.

**5 · Guardar la clave privada.** Vuelve a la pestaña Learner Lab y abre **AWS Details → Download PEM**. Guarda el archivo, normalmente `labsuser.pem`, en una carpeta privada de tu equipo, fuera del repositorio y de las entregas. También puedes usar ese PEM con OpenSSH en Windows; PPK corresponde a otras herramientas, como PuTTY. Regresa a la consola sin cerrar el laboratorio.

**6 · Configurar red y acceso.** En **Configuraciones de red / Network settings**, utiliza **Editar / Edit** si necesitas ver todos los campos. Conserva la VPC predeterminada y una subred pública predeterminada, con **Asignación automática de IP pública: Habilitar / Enable**. Crea un grupo de seguridad para esta práctica. Sus únicas reglas iniciales son:

| Tipo | Puerto | Origen | Uso |
| --- | --- | --- | --- |
| SSH | 22 | La IP pública de administración facilitada por el docente, con `/32` si es una sola IP | Tu terminal entra en Ubuntu |
| HTTP | 80 | Anywhere-IPv4, `0.0.0.0/0` | Consultar la demo desde Internet |

El menú **Mi IP / My IP** puede rellenar la dirección que ve la consola, pero debes contrastarla con la indicada para tu conexión de aula. No uses tu IP privada de Windows ni dejes SSH en **Anywhere / Cualquier lugar**. Si cambias de red, puede hacer falta actualizar esa regla. No abras 5432 ni 8080: la base y Spring Boot se comunican dentro de la máquina.

**7 · Preparar el arranque.** Abre **Detalles avanzados / Advanced details**. En **Especificación de crédito / Credit specification**, elige **Estándar / Standard**. Conserva **IMDSv2 obligatorio** y deja el perfil de IAM sin seleccionar. Al final aparece **Datos de usuario / User data**: es un cuadro para un script de arranque, no tus datos personales.

Descarga la [plantilla de preparación de EC2](/teaching/downloads/intermodular-ec2-init.sh). Ábrela como texto en VS Code o Bloc de notas, copia todo desde `#!/bin/bash` hasta el final y pégalo en ese cuadro. Si el enlace muestra texto en el navegador, también puedes copiarlo desde ahí. **No ejecutes el archivo en Windows**, no pegues la dirección del enlace y no marques que está codificado en base64. La plantilla prepara Java, Nginx, PostgreSQL y systemd; no crea otra API ni descarga el código del alumno.

**8 · Revisar y lanzar.** Contrasta imagen, tamaño, disco, número de máquinas y reglas con las tablas anteriores. Pulsa **Lanzar instancia / Launch instance** una vez. Anota el ID que empieza por `i-` y abre sus detalles. En **Instancias / Instances**, espera a que figure **En ejecución / Running**. Ese estado solo confirma que la máquina está encendida; no garantiza que haya terminado la instalación.

**9 · Comprobar la instalación.** Selecciona tu instancia y abre **Acciones → Monitoreo y solución de problemas → Obtener registro del sistema / Actions → Monitor and troubleshoot → Get system log**. Actualiza el registro hasta ver `INTERMODULAR_INFRASTRUCTURE_READY`. Es el mensaje final de nuestra plantilla. Si hay un error o no aparece tras varios minutos, conserva el mensaje y revísalo con el docente. No lances otra máquina para ocultar el fallo.

**10 · Guardar la dirección.** En los detalles de la instancia copia **Dirección IPv4 pública / Public IPv4 address**. Esa dirección sustituirá `IP_ACTUAL` en los comandos. La IPv4 privada y el ID `i-...` no sirven para conectarte desde tu portátil por Internet. La página web puede devolver **502 Bad Gateway** en este punto: Nginx está preparado, pero todavía no hemos instalado el JAR.

No lances otra instancia en cada sesión. Anota su ID y grupo de seguridad. La plantilla se ejecuta una vez sobre una máquina nueva, no sobre una base con datos.

#### Bloque C · Publicar el JAR de esa ejecución

**Este bloque empieza en Windows.** Abre la carpeta que contiene los tres archivos extraídos del artefacto, haz clic derecho en una zona vacía y elige **Abrir en Terminal**. Utiliza PowerShell, no la terminal del servidor ni la de otro repositorio. Ejecuta primero `Get-ChildItem`: debes ver `app.jar`, `commit.txt` y `app.jar.sha256`.

Antes de copiar comandos, prepara estas sustituciones:

| Marcador | Qué escribir en su lugar |
| --- | --- |
| `RUTA_A_LA_CLAVE.pem` | La ruta completa del PEM descargado, conservando las comillas; por ejemplo, `C:\Users\TuUsuario\Claves\labsuser.pem` |
| `IP_ACTUAL` | La IPv4 pública que acabas de copiar; sin `http://`, sin comillas y sin el nombre de otro equipo |
| `ubuntu` | Se conserva: es el usuario de la imagen Ubuntu de esta práctica |

Escribe un comando cada vez. Espera a que termine y comprueba el resultado antes del siguiente:

```powershell
Get-FileHash ./app.jar -Algorithm SHA256
scp -i "RUTA_A_LA_CLAVE.pem" ./app.jar ./commit.txt ./app.jar.sha256 ubuntu@IP_ACTUAL:/home/ubuntu/
ssh -i "RUTA_A_LA_CLAVE.pem" ubuntu@IP_ACTUAL
```

El primer comando muestra el hash: compáralo con el texto de `app.jar.sha256`; mayúsculas y minúsculas no cambian su valor. `scp` **copia archivos** y vuelve a PowerShell al terminar; `ssh` **abre una terminal en Ubuntu**. Ninguno pide la contraseña de PostgreSQL. En la primera conexión contrasta la huella SSH con la publicada por la instancia en su registro de arranque antes de aceptarla. No desactives esa comprobación.

**Cambio de terminal: ahora estás en Ubuntu.** El indicador suele parecerse a `ubuntu@ip-...:~$`, en lugar de `PS C:\...>`. No copies esos indicadores ni los signos `$` de un ejemplo. Ejecuta `whoami`: debe responder `ubuntu`. Los siguientes comandos actúan en la máquina de AWS:

```bash
cd /home/ubuntu
sha256sum -c app.jar.sha256
sudo install -o root -g intermodular -m 640 app.jar /opt/intermodular/app.jar
sudo install -o root -g intermodular -m 640 commit.txt /opt/intermodular/commit.txt
sudo systemctl enable intermodular
sudo systemctl restart intermodular
sudo systemctl status intermodular --no-pager
sudo journalctl -u intermodular -n 60 --no-pager
```

**Qué debes ver:** `sha256sum` muestra `app.jar: OK`; `systemctl status` indica **active (running)** y los logs terminan mostrando el arranque de Spring Boot sin una excepción. Un estado activo momentáneo no basta si el proceso se reinicia continuamente: revisa también los logs. Para volver a PowerShell escribe `exit`. Cerrar SSH no detiene la API, porque la mantiene systemd.

| Mensaje al conectar o copiar | Qué revisar antes de repetir |
| --- | --- |
| `No such file` o archivo no encontrado | Carpeta de la terminal, nombre real del archivo y ruta completa del PEM |
| `Permission denied (publickey)` | Usuario `ubuntu`, PEM de ese laboratorio y clave `vockey` seleccionada al crear la máquina |
| `Connection timed out` | Laboratorio activo, EC2 encendida, IP pública actual y regla SSH desde la IP correcta |
| Aviso sobre permisos del PEM | Con el docente, restringe su lectura a tu cuenta de Windows; no compartas ni subas la clave |
| No se reconoce `ssh` o `scp` | Comprueba la preparación del cliente OpenSSH de Windows con el docente antes de seguir |

La primera publicación conserva la configuración en memoria de Servidor; no adelantes JPA ni cambies de proyecto. Si la versión ya necesita base de datos, prepara primero la configuración de la sesión 12. El servicio mantiene Java escuchando en **127.0.0.1:8080**; Nginx recibe el tráfico de Internet en el puerto 80. No uses una terminal que haya que dejar abierta para mantener la API.

Para actualizar, detén primero `intermodular`, conserva el JAR y `commit.txt` anteriores como recuperación, verifica el nuevo hash, instala ambos archivos y arranca el servicio. Si falla la comprobación, restaura la pareja anterior y registra el incidente. Un cambio de esquema necesita además su plan de recuperación de datos.

#### Bloque D · Comprobar y diagnosticar

En Ubuntu prueba una ruta real del proyecto contra `http://127.0.0.1:8080`, después contra `http://127.0.0.1` y finalmente desde otro equipo contra `http://IP_ACTUAL`. `/api/estado` pertenece solo a la demo docente y no tiene que existir en tu API.

Por ejemplo, **solo si tu colección ya utiliza `/tareas`**, ejecuta en Ubuntu `curl -i http://127.0.0.1:8080/tareas` y después `curl -i http://127.0.0.1/tareas`. En tu navegador de Windows abre `http://IP_ACTUAL/tareas`, sustituyendo la IP. Si tu ruta es otra, utiliza exactamente la de tu colección en las tres comprobaciones. Un estado 200 y la respuesta esperada acreditan la consulta; una colección vacía puede devolver `[]` correctamente. Una ruta que exige permisos puede devolver 401 o 403, lo que requiere comprobar el contrato y no inventar un fallo de red.

| Observación | Primera comprobación |
| --- | --- |
| El servicio no arranca | `journalctl -u intermodular`: JDK, JAR, configuración y base de datos |
| Spring responde directamente, pero Nginx devuelve 502 | Puerto y dirección del backend, configuración y registro de Nginx |
| Responde dentro de EC2, pero fuera agota el tiempo | IP actual, instancia encendida y regla HTTP del grupo de seguridad |
| Responde 404 | Ruta del contrato y prefijo; no demuestra que todo el servidor esté caído |

Registra ejecución de CI, commit, hash, IP/URL, fecha y petición con resultado. Un `curl localhost` no acredita acceso público.

#### Bloque E · HTTPS antes del cliente y la autenticación

El docente debe proporcionar o acordar un **nombre DNS público que pueda administrar**. Su registro A debe apuntar a la IP actual de EC2. El nombre público de AWS no es un dominio que el alumno pueda administrar para emitir su propio certificado.

Con el nombre preparado, cambia `server_name _;` en `/etc/nginx/sites-available/default` por ese nombre, comprueba `sudo nginx -t` y recarga Nginx. Autoriza TCP/443 en el grupo de seguridad manteniendo 80 para la validación HTTP. En Ubuntu:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d NOMBRE_ACORDADO
sudo certbot renew --dry-run
```

El titular debe revisar las condiciones del emisor al configurar el certificado. Comprueba desde otro equipo nombre, certificado válido y redirección a HTTPS. Si cambia la IP, actualiza DNS y comprueba de nuevo. La instalación anterior usa los paquetes de Ubuntu; consulta las [instrucciones oficiales de Certbot](https://certbot.eff.org/instructions) para otras opciones de instalación y no mezcles paquetes apt y snap.

Si aún no existe un nombre y certificado válidos, conserva la evidencia HTTP y registra **HTTPS pendiente**. No presentes el cliente de GitHub Pages ni la autenticación como completados, ni resuelvas el contenido mixto desactivando protecciones. La integración posterior requiere resolver este requisito.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

Comprueba la ruta pública, relaciona el JAR con el commit aprobado y explica CI frente a publicación manual. Anota si HTTPS está comprobado o pendiente. Antes de cerrar, revisa presupuesto e inventario y detén la instancia desde EC2 si has terminado; cerrar SSH no la apaga. Mantén el disco para la siguiente sesión. Al reabrir el laboratorio comprueba estado, IP y URL antes de repetir la colección.

**Apagado al terminar:** en **EC2 → Instancias**, selecciona solo tu máquina por nombre e ID y pulsa **Estado de la instancia → Detener instancia → Detener**. Espera a ver **Detenida / Stopped**. Después vuelve a la pestaña Learner Lab, pulsa **End Lab** y confirma el cierre. **Detener** conserva el disco; **Terminar / Terminate** elimina la máquina y puede borrar sus datos; **Reset** restablece el entorno. No son botones equivalentes. Conservar el disco mantiene un coste de almacenamiento aunque no haya cómputo.

**Al empezar otro día:** abre el mismo laboratorio con **Start Lab**, espera el indicador verde y entra en EC2 en **us-east-1**. Localiza el ID guardado. Si está detenida, usa **Estado de la instancia → Iniciar instancia**; no vuelvas a pulsar Lanzar instancia. Copia la IPv4 pública actual, comprueba el arranque y actualiza los destinos de SSH, la colección y DNS si procede. Conserva `vockey` y el disco: no repitas los datos de usuario, la creación de la base ni el esquema inicial.

Si la clase de AWS Academy ya terminó o se agotó el presupuesto, consulta al docente: crear otra instancia no recupera los archivos. Conserva fuera del laboratorio el código, el artefacto aprobado y las copias de datos que necesites.


## Sesión 9 · Comprobar el contrato publicado

**Antes de empezar.** Tienes una API publicada y una colección de peticiones. Hoy comprobarás que la versión pública conserva el contrato que funciona en local.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

Un **contrato de API** especifica qué puede solicitar un programa consumidor y qué obtendrá a cambio: método, ruta, campos y códigos de estado HTTP. Esas respuestas ya están implementadas en Servidor. En esta sesión se verifica que la versión publicada cumple el mismo contrato que la local, sin reimplementar sus controladores.

El consumidor puede ser Bruno, una prueba o un navegador. Para detectar un cambio incompatible no hace falta haber programado todavía una interfaz. El cliente completo con fetch y CORS se trabajará después de las sesiones 33–34 de Servidor, en Intermodular 18. Ahora utilizamos la colección que ya conoce el grupo.

**La URL base determina el destino, no el contrato.** La ruta `/tareas` debe mantener su denominación en el entorno local y en producción. El prefijo de versión `/api/v1` se introduce en Servidor 32 y no procede incorporarlo antes por analogía con otras fuentes. Un código 404 puede indicar una ruta incorrecta aunque el proceso haya arrancado sin incidencias.

La demostración consiste en enviar la misma petición a dos entornos, comparar sus estados y campos y localizar el commit que produjo la respuesta pública. El resultado se documenta una vez y sirve a los dos módulos.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Preparar dos entornos de la misma colección

1. Abre la colección de Servidor. Conserva sus peticiones; crea los entornos `local` y `produccion` con una variable `baseUrl` en cada uno.
2. Local usa `http://localhost:8080`; el entorno publicado usa la URL comprobada de Intermodular 8 (HTTP solo para el laboratorio sin credenciales; HTTPS antes de autenticación o del cliente de Pages). Retira la barra final si las rutas ya empiezan por `/`.
3. Cambia una petición a `{{baseUrl}}/tu-ruta-real`. Elige una lectura de Servidor que ya funcione, no una ruta inventada.
4. Envía con cada entorno y anota estado, Content-Type y estructura del JSON. Los ids y datos pueden diferir; los tipos y nombres de campos deben cumplir el mismo contrato.

#### Bloque B · Escribir un caso comprobable

1. En la descripción del contrato de la API añade una tabla con método, ruta, entrada mínima, estado esperado y campos de respuesta.
2. Selecciona tres casos ya implementados: lectura correcta, recurso inexistente y entrada inválida. Copia ejemplos de tu API y elimina datos sensibles.
3. Ejecuta cada caso en ambos entornos. Si difieren, comprueba primero versión desplegada y configuración; después abre una issue con petición y respuesta que reproduzcan el fallo.
4. La corrección de implementación se realiza sobre el código compartido de Servidor. Intermodular conserva la prueba que detectó el desajuste y la PR que lo corrige.

#### Bloque C · Enlazar el producto desde el portfolio

1. Actualiza la ficha existente con qué resuelve el producto, el repositorio y su estado actual. Utiliza el tema elegido al principio de Servidor.
2. Añade un enlace al contrato y a una ruta GET pública de demostración. No necesitas construir hoy un formulario ni un cliente CRUD.
3. Abre los enlaces desde la web publicada. Si el backend aún usa memoria, indica que los datos se reinician; esa limitación cambiará al publicar PostgreSQL.
4. Lleva la modificación por issue, rama y PR. La persona revisora sigue los enlaces y reproduce uno de los casos del contrato.

#### Bloque D · Registrar la compatibilidad

Anota los dos entornos usados y el SHA del backend desplegado en las comprobaciones de la sesión. Enlaza la descripción del contrato de la API y las peticiones existentes, sin copiarlas a otra colección. Comprueba que una persona que llegue al README pueda localizar producto, versión y forma de probarlo.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** La API publicada está contrastada con la colección: rutas, estados y datos coinciden con el contrato, y las diferencias encontradas están identificadas. Explica por qué terminar un despliegue no demuestra por sí solo que el producto funciona.

## Sesión 10 · Preparar la transición a persistencia

**Antes de empezar.** La API aún utiliza memoria. Hoy prepararás los casos y las tareas que permitirán comprobar su transición a PostgreSQL.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

La API ya está publicada y su contrato está comprobado. En Servidor todavía trabaja en memoria: los datos se pierden al reiniciar. Antes de incorporar PostgreSQL necesitamos una referencia del comportamiento actual y un plan para verificar que el cambio conserva las operaciones del producto.

Una transición tiene un punto de partida, un cambio y una comprobación posterior. Preparar sus casos ahora permite detectar después si un fallo procede del contrato, de la configuración o del almacenamiento.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado</p>

#### Bloque A · Comprobar la versión actual

Arranca la API publicada y repite alta, listado, detalle, modificación y borrado con la colección existente. Anota para cada operación el estado HTTP y el resultado esperado. Identifica el commit desplegado y comprueba que coincide con el código revisado.

#### Bloque B · Observar el límite de la memoria

Crea un dato ficticio en local, reinicia la aplicación y vuelve a consultarlo. Explica por qué desaparece. Escribe el resultado que esperarás cuando se incorpore persistencia: el dato debe seguir disponible tras un reinicio, sin volver a crearlo.

#### Bloque C · Preparar los casos de transición

Añade casos de identificador inexistente, datos inválidos y relación entre dos recursos del dominio. Separa las reglas que ya puedes ejecutar de las comprobaciones de persistencia pendientes. Conserva la colección actual como referencia del contrato; todavía no añadas configuración JPA a la aplicación.

#### Bloque D · Organizar el cambio

En el tablero prepara las tareas de configurar el entorno de pruebas, conectar la base de datos y verificar los datos tras reiniciar. Marca qué tarea depende de la implementación de Servidor. Añade criterios de aceptación observables y revisa con tu pareja que ninguna tarjeta dé por realizado un cambio futuro.

#### Bloque E · Ensayar la revisión

Tu pareja ejecuta dos casos de la colección sin pedirte instrucciones adicionales. Corrige los datos o pasos ambiguos y comprueba que las tareas pendientes indican cómo se reconocerá su finalización. Deja la versión publicada funcionando como referencia.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** el contrato actual está comprobado, has observado la pérdida de datos al reiniciar y tienes preparados los casos y las tareas para verificar la futura persistencia. Debes poder distinguir lo que funciona hoy de lo que se comprobará al incorporar PostgreSQL.

## Sesión 11 · Preparar el CI de la versión persistente

**Antes de empezar.** En Servidor ya has conectado PostgreSQL y trabajado el acceso a los datos. Hoy prepararás una base de pruebas aislada para ejecutar esa versión en CI.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

En Servidor 19–20 el proyecto comienza a utilizar PostgreSQL. El código deja de bastar para arrancar: también necesita una base de datos. Si el pipeline no prepara esa dependencia, puede fallar aunque la implementación sea correcta.

Un **servicio del job** es un contenedor que GitHub Actions crea para esa ejecución. Tendrá una base de datos vacía, credenciales ficticias y un comprobador de disponibilidad. Al terminar el job se descarta. La base de pruebas del CI nunca es la de producción.

El trabajo de Servidor es escribir pruebas que verifiquen las reglas y, en su sesión 22, las consultas. Aquí aseguramos que se ejecutan con el entorno correcto y que un fallo impide fusionar. No cambiamos una aserción para conseguir un check verde.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Reproducir la construcción local

1. Abre el repositorio de backend existente y crea una issue para preparar PostgreSQL en CI. Anota qué dependencia añadió la versión de Servidor y qué error aparece en el runner.
2. Ejecuta `.\mvnw.cmd -B verify` en PowerShell, con PostgreSQL local encendido y las variables del README. En Linux/macOS utiliza `./mvnw -B verify`.
3. Separa un fallo de conexión de un fallo de test leyendo el primer mensaje causal. Guarda ese fragmento sin contraseñas.

#### Bloque B · Preparar PostgreSQL en el job

En `.github/workflows/ci.yml`, añade `services` y `env` dentro del job `build`, al mismo nivel que `runs-on` y `steps`. Conserva las etapas de checkout, Java y verify de la sesión 7. Declara la misma versión mayor de PostgreSQL que emplea el proyecto; 16 es el valor del ejemplo.

```yaml
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: gestor_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: prueba_ci
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres -d gestor_test"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      SPRING_PROFILES_ACTIVE: test
      SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/gestor_test
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: prueba_ci
      TEST_DB_PASSWORD: prueba_ci
      SPRING_JPA_HIBERNATE_DDL_AUTO: create-drop
      SPRING_SQL_INIT_MODE: never
```

El ejemplo está indentado para pegarlo dentro del job. `create-drop` se permite aquí porque el contenedor es exclusivo y desechable. Nunca lo copies a la configuración del servicio desplegado en EC2. El perfil `test` de Servidor 22 reutilizará este entorno; hasta entonces verifica las pruebas ya disponibles.

#### Bloque C · Comprobar el aislamiento

1. Sube la rama y abre la PR. En Actions localiza la creación del servicio, su comprobación de disponibilidad y la ejecución Maven.
2. Revisa el informe de tests: debe indicar cuántas pruebas se ejecutaron. Un build sin pruebas no demuestra las reglas del producto.
3. En una rama de prueba cambia temporalmente el nombre de la base de datos a uno inexistente. Comprueba que falla por conexión, no por compilación. Restaura el nombre antes de fusionar.
4. Confirma que `Compilar y probar` sigue siendo obligatorio. Al llegar los tests JPA de Servidor 22, ejecútalos en este mismo job; no abras otro proyecto de pruebas.

#### Bloque D · Conservar las evidencias

En las comprobaciones de la sesión enlaza la ejecución correcta y el fallo controlado. Documenta por qué la contraseña del contenedor de pruebas es ficticia y dónde se configura la de producción. La siguiente sesión prepara la base del backend público y comprobará que sus datos sobreviven al reinicio.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

**Al terminar la sesión:** El CI prepara una base aislada, ejecuta las pruebas existentes y permite localizar su resultado. Explica qué recursos crea el job y cómo distingues pruebas superadas de pruebas no ejecutadas.

## Sesión 12 · La base de datos del backend publicado

**Antes de empezar.** Servidor ya ha preparado JPA, PostgreSQL y pruebas de repositorio. CI utiliza una base aislada. Hoy publicamos esa versión con PostgreSQL en la EC2 de la sesión 8, conservando datos ficticios en su disco.

### Se explica

<p class="stage stage--brief">25 minutos · explicación y demostración</p>

#### Una base privada para una API pública

El cliente accede a la API, no directamente a PostgreSQL. La base escucha en **localhost:5432** y no se abre ese puerto en el grupo de seguridad. Usamos una base y un usuario exclusivos del proyecto, distintos de desarrollo y CI. La aplicación no utiliza el superusuario `postgres`.

API y base comparten máquina para reducir coste y complejidad del taller. Esta decisión no proporciona alta disponibilidad: una avería o retirada del disco afecta a ambas. Detener EC2 conserva el disco; terminarla puede eliminarlo. Persistencia tras reinicio tampoco equivale a copia recuperable.

#### Presupuesto y duración

PostgreSQL instalado en la EC2 se detiene con ella. No se crea un RDS que pueda seguir consumiendo entre sesiones. El disco y la IPv4 pública cuando esté asignada tienen costes propios. Revisa el presupuesto, que puede actualizarse con retraso. El entorno no garantiza conservar datos después del final de la clase ni al agotar el presupuesto.

### Se trabaja

<p class="stage stage--guided">140 minutos · trabajo guiado sobre el producto compartido</p>

#### Bloque A · Preparar PostgreSQL en la EC2

Conecta por SSH con el procedimiento de la sesión 8. **Estos comandos se ejecutan en Ubuntu, no en PowerShell.** Si no recuerdas dónde estás, ejecuta `whoami`; debe responder `ubuntu`. La plantilla ya instaló PostgreSQL. Primero consulta el estado del servicio y los puertos:

```bash
sudo systemctl status postgresql --no-pager
sudo ss -lnt
```

Es normal que el servicio general `postgresql` aparezca como **active (exited)**: Ubuntu lo utiliza para gestionar los clústeres. Comprueba también el puerto 5432 en la salida de `ss`; una conexión SQL correcta en el siguiente paso confirma que la base responde. Debe escuchar en `127.0.0.1:5432` o `[::1]:5432`, que son direcciones del propio equipo, no en `0.0.0.0:5432`. Si aparece en todas las interfaces, revisa la configuración con el docente antes de continuar.

Ahora ejecuta `sudo -u postgres psql`. **Entras en otro programa:** el indicador cambia a `postgres=#`. `sudo -u postgres` ejecuta el cliente como administrador de PostgreSQL; no cambia permanentemente el usuario SSH. Introduce las líneas siguientes una a una. Las sentencias SQL terminan con punto y coma; las órdenes que empiezan por barra inversa no lo necesitan:

```sql
CREATE ROLE intermodular LOGIN;
\password intermodular
CREATE DATABASE intermodular OWNER intermodular;
\q
```

Son comandos de primera instalación. Si la base existe, inspecciónala y reutilízala: no la borres ni repitas su creación a ciegas. El ejemplo presupone un proyecto por instancia; un servidor compartido necesita usuarios, bases y permisos propios por proyecto.

**Qué debes ver:** `CREATE ROLE` tras crear el usuario y `CREATE DATABASE` tras crear la base. `\password intermodular` solicita dos veces la nueva contraseña: es normal que no aparezcan caracteres al escribir. Guárdala de forma privada porque la necesitarás en el bloque siguiente. `\q` sale de psql y te devuelve al indicador `ubuntu@...$`. Si te equivocas y psql queda esperando completar una sentencia, cancélala con Ctrl+C antes de volver a escribirla; no pegues comandos Linux en el indicador SQL.

#### Bloque B · Configuración externa del servicio

**En la terminal Ubuntu, fuera de psql**, ejecuta `sudo nano /etc/intermodular.env`. Abres un editor de texto dentro de la terminal; ya no estás escribiendo órdenes del sistema. El archivo puede estar vacío porque lo creó la plantilla. Pega estas cinco líneas:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://127.0.0.1:5432/intermodular
SPRING_DATASOURCE_USERNAME=intermodular
SPRING_DATASOURCE_PASSWORD=CONTRASENA_REAL_SOLO_EN_EL_SERVIDOR
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
SPRING_SQL_INIT_MODE=never
```

Sustituye el marcador por la contraseña real; para este ejercicio utiliza una contraseña aleatoria larga con letras y números. Conserva propietario root y permisos 600. El repositorio solo contiene una plantilla ficticia. No muestres el archivo en capturas ni incidencias.

La contraseña debe ser **la misma** que acabas de asignar a `intermodular`; no generes una distinta para este archivo. No pegues las marcas del bloque de código ni espacios alrededor del signo `=`. En nano, guarda con **Ctrl+O**, confirma el nombre con **Enter** y sal con **Ctrl+X**. Para revisar permisos sin mostrar los secretos, ejecuta `sudo stat -c '%U %a' /etc/intermodular.env`: debe indicar `root 600`. Editar el archivo no actualiza por sí solo el proceso; lo reiniciarás después de preparar el esquema.

La conexión utiliza loopback dentro del mismo sistema; no atraviesa Internet. Esta arquitectura no valida TLS de base de datos. Si más adelante separas PostgreSQL o usas RDS, revisa red, permisos y TLS: no reutilices sin cambios esta URL.

#### Bloque C · Crear el esquema de forma controlada

1. Revisa y prueba el esquema de la versión de Servidor en una base vacía de ensayo. Con `pg_dump` exporta estructura sin propietarios ni privilegios. En PowerShell, desde el repositorio:

```powershell
pg_dump --host=localhost --port=5432 --username=postgres --schema-only --no-owner --no-privileges --file=docs/esquema-inicial.sql gestor_db
```

Comprueba que no contiene contraseñas ni datos y revísalo mediante PR. El PostgreSQL del servidor debe admitir la versión del volcado; adapta exportación o herramientas si el proyecto utiliza una versión posterior, sin editar a ciegas un volcado incompatible.

**Aquí vuelves al equipo local:** abre una segunda pestaña PowerShell en la carpeta de tu repositorio, conservando la sesión SSH en la primera. Comprueba que existe la carpeta `docs` y sustituye `gestor_db` por tu base de desarrollo real. Este `localhost` es tu portátil; el `localhost` escrito dentro de SSH es la EC2. Si PowerShell no reconoce `pg_dump`, utiliza la ruta de las herramientas PostgreSQL preparadas para Servidor con ayuda del docente.

2. Copia el script aprobado a `/home/ubuntu/esquema-inicial.sql` con `scp`, como el artefacto. Confirma que la base de destino está vacía y aplícalo como el usuario del proyecto:

En la pestaña **PowerShell local**, desde el repositorio, copia:

```powershell
scp -i "RUTA_A_LA_CLAVE.pem" ./docs/esquema-inicial.sql ubuntu@IP_ACTUAL:/home/ubuntu/
```

Vuelve a la pestaña **SSH de Ubuntu**. Primero ejecuta `psql -h 127.0.0.1 -U intermodular -d intermodular -W -c '\dt'`. En una base nueva debe indicar que no hay relaciones. Si ya hay tablas, detente y revisa qué se instaló; no borres nada para forzar que el ejemplo encaje. Solo para la primera instalación en una base vacía:

```bash
psql -h 127.0.0.1 -U intermodular -d intermodular -W -v ON_ERROR_STOP=1 --single-transaction -f /home/ubuntu/esquema-inicial.sql
```

La contraseña se introduce cuando se solicita, no en el comando. No vuelvas a aplicar el esquema inicial sobre tablas con datos.

`-U` elige usuario, `-d` elige base, `-W` pide contraseña y `-f` lee el archivo SQL. El comando termina y vuelve al shell. Se detiene ante el primer error y utiliza una transacción para evitar dejar medio esquema aplicado. Repite la consulta `\dt` para comprobar las tablas antes de arrancar el backend.

3. Publica el JAR del CI correcto de `main` con la sesión 8 y reinicia `intermodular`. Comprueba en `journalctl` que valida el esquema. Corrige las discrepancias revisando versiones; no sustituyas `validate` por `update` o `create-drop`.
4. Para cambios posteriores prepara scripts incrementales revisados y ensayados sobre una copia. No sustituyas la API de Servidor por la demo docente.

#### Bloque D · Verificar persistencia y conservar una copia

1. Crea un dato ficticio con la colección contra la URL publicada y guarda el identificador. Si la ruta necesita autenticación, utiliza HTTPS ya validado.
2. Reinicia el backend con `sudo systemctl restart intermodular`. Espera su arranque y consulta el identificador: debe seguir presente.
3. En Ubuntu ejecuta primero `sudo systemctl restart postgresql` y después `sudo systemctl restart intermodular`. Espera el arranque y repite la consulta desde la colección del equipo local. Registra qué reiniciaste y el resultado; esto no demuestra recuperación de un disco perdido.
4. En una comprobación acordada con el docente, detén e inicia EC2. Espera el arranque, actualiza IP y DNS si han cambiado y consulta de nuevo. No termines la instancia ni uses Reset.
5. Genera una copia con el usuario del proyecto y descárgala a una carpeta privada fuera del repositorio:

```bash
pg_dump -h 127.0.0.1 -U intermodular -W -d intermodular -Fc -f /home/ubuntu/intermodular.dump
chmod 600 /home/ubuntu/intermodular.dump
```

Desde el equipo local descarga con `scp -i "RUTA_A_LA_CLAVE.pem" ubuntu@IP_ACTUAL:/home/ubuntu/intermodular.dump .`. Para acreditar recuperación, restaura en una base vacía de ensayo y consulta el identificador. Una copia sin prueba de restauración solo acredita la exportación.

### Cierre

<p class="stage">15 minutos · comprobación del resultado</p>

Entrega JAR/commit, petición pública y comprobaciones antes y después del reinicio. Añade ubicación privada de la copia y resultado de restauración si lo has realizado. Se evalúa persistencia comprobada durante las sesiones, sin exigir disponibilidad permanente. Ninguna contraseña ni clave SSH forma parte de la entrega.

Si Servidor aún no termina la persistencia, prepara base, esquema revisado y variables. Ejecuta las comprobaciones cuando esté disponible la versión persistente; la entrega del trimestre requiere realizarlas. No inventes resultados ni sustituyas el producto por un ejemplo independiente.


## Lo que debes recordar

| Decisión | Comprobación |
| --- | --- |
| Conservar el repositorio de Servidor | Historial, remoto y aportaciones continúan desde el comienzo |
| Ejecutar las pruebas en CI | El informe muestra tests ejecutados y un fallo bloquea la fusión |
| Identificar el artefacto | El despliegue corresponde a un commit y una ejecución concretos |
| Separar construcción, publicación y arranque | El CI conserva el JAR aprobado, una persona lo publica y se comprueba la respuesta de su ruta |
| Mantener entornos separados | Desarrollo, CI y producción usan bases y credenciales propias |
| Preparar el esquema | validate comprueba la estructura; el script revisado prepara sus cambios |
| Reutilizar el contrato | La misma colección se ejecuta contra local y producción |
| Coordinar el cierre | La versión completa se comprueba con Servidor 27–28 e Intermodular 14 |

### Vocabulario que utilizarás

Un **artefacto** es el resultado construido. Un **entorno** reúne servicios y configuración de una ejecución. Un **contrato** describe peticiones y respuestas y puede comprobarse con tests. Un **script incremental** modifica una versión del esquema conservando los datos previstos. Una **release** identifica una versión y declara qué se ha comprobado y qué queda pendiente.

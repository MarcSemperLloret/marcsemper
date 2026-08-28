---
title: "Cloud y arquitecturas modernas"
label: "UD3 · Proyecto"
section: "ud-03"
order: 3
lang: "es"
summary: "Publica tu primera aplicación en Internet. De localhost a un dominio propio con HTTPS, pasando por una máquina virtual, Nginx, reglas de red, DNS y certificados."
duration: "4–5 horas"
modality: "Individual o parejas"
deliverable: "Una página web accesible públicamente mediante HTTPS y una breve memoria técnica."
date: "2026-08-28"
---

## 1. El reto

Hasta ahora estamos acostumbrados a desarrollar aplicaciones en nuestro ordenador.

Por ejemplo:

<figure class="diagram">
  <figcaption>Desarrollo en local</figcaption>
  <ol class="flow flow--row">
    <li>Nuestro código</li>
    <li>localhost</li>
    <li>http://localhost:5500</li>
  </ol>
</figure>

Esto funciona para desarrollar.

Pero hay un problema evidente:

> Nadie fuera de nuestro ordenador puede acceder a la aplicación.

Cuando una aplicación pasa a estar disponible para usuarios reales hablamos de **ponerla en producción** o **desplegarla**.

Nuestro objetivo será pasar de:

<p class="single-node single-node--mono">localhost</p>

a algo parecido a:

<p class="single-node single-node--mono">https://miweb.duckdns.org</p>

accesible desde cualquier dispositivo conectado a Internet.

---

## 2. ¿Qué vamos a construir?

Al terminar tendremos algo parecido a esto:

<figure class="diagram">
  <figcaption>La arquitectura completa que vamos a montar</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 540" role="img" aria-labelledby="build-title build-desc" preserveAspectRatio="xMidYMid meet">
    <title id="build-title">Arquitectura del despliegue</title>
    <desc id="build-desc">Desde Internet, un nombre DNS apunta a una IP pública. Esa IP corresponde a una máquina virtual Ubuntu alojada en Azure, en la que Nginx sirve nuestra web.</desc>
    <defs>
      <marker id="build-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 56 L 360 86" marker-end="url(#build-arrow)" />
      <path d="M 360 148 L 360 178" marker-end="url(#build-arrow)" />
      <path d="M 360 228 L 360 258" marker-end="url(#build-arrow)" />
      <path d="M 360 352 L 360 378" marker-end="url(#build-arrow)" />
      <path d="M 360 428 L 360 454" marker-end="url(#build-arrow)" />
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="280" y="12" width="160" height="44" rx="3" />
      <text x="360" y="34">Internet</text>
    </g>
    <g class="diagram-node">
      <rect x="240" y="92" width="240" height="56" rx="3" />
      <text x="360" y="112">Nombre DNS</text>
      <text class="diagram-subtext" x="360" y="132">miweb.duckdns.org</text>
    </g>
    <g class="diagram-node">
      <rect x="270" y="184" width="180" height="44" rx="3" />
      <text x="360" y="206">IP pública</text>
    </g>
    <g class="diagram-node diagram-node--container">
      <rect x="180" y="264" width="360" height="260" rx="3" />
      <text x="360" y="286">AZURE</text>
    </g>
    <g class="diagram-node">
      <rect x="230" y="308" width="260" height="44" rx="3" />
      <text x="360" y="330">Máquina virtual · Ubuntu</text>
    </g>
    <g class="diagram-node">
      <rect x="230" y="384" width="260" height="44" rx="3" />
      <text x="360" y="406">Nginx</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="230" y="460" width="260" height="44" rx="3" />
      <text x="360" y="482">Nuestra web</text>
    </g>
  </svg>
</figure>

Además:

<figure class="diagram">
  <figcaption>Cómo llega el código al servidor</figcaption>
  <ol class="flow flow--row">
    <li>Nuestro PC</li>
    <li>GitHub</li>
    <li>Servidor Azure</li>
  </ol>
</figure>

Y protegeremos la comunicación:

<figure class="diagram">
  <figcaption>De una conexión abierta a una cifrada</figcaption>
  <ol class="flow flow--row flow--chain">
    <li>HTTP</li>
    <li>HTTPS</li>
    <li>TLS</li>
  </ol>
</figure>

---

## 3. Antes de empezar: ¿qué es realmente «la nube»?

La nube no es algo mágico.

Cuando utilizamos cloud seguimos utilizando:

* procesadores;
* memoria RAM;
* discos;
* redes;
* servidores.

La diferencia es que esos recursos están en los centros de datos de otra empresa y podemos crearlos y administrarlos a través de Internet.

Empresas conocidas que ofrecen servicios cloud son:

* Microsoft Azure;
* Amazon Web Services;
* Google Cloud.

---

## 4. IaaS, PaaS y SaaS

Cloud ofrece distintos niveles de control.

### IaaS — Infrastructure as a Service

El proveedor nos proporciona infraestructura.

Por ejemplo:

> Una máquina virtual.

Nosotros nos ocupamos de:

* sistema operativo;
* servidor web;
* actualizaciones;
* aplicación;
* configuración.

Eso es precisamente lo que utilizaremos.

<figure class="diagram">
  <figcaption>IaaS · todo lo que queda bajo nuestra responsabilidad</figcaption>
  <ol class="flow">
    <li>Azure</li>
    <li>Máquina virtual</li>
    <li>Ubuntu</li>
    <li>Nginx</li>
    <li>Nuestra web</li>
  </ol>
</figure>

### PaaS — Platform as a Service

El proveedor administra más componentes.

Nosotros nos preocupamos principalmente de nuestra aplicación.

Por ejemplo:

<figure class="diagram">
  <figcaption>PaaS · la plataforma se ocupa del resto</figcaption>
  <ol class="flow flow--row">
    <li>Código</li>
    <li>Azure App Service</li>
    <li>Internet</li>
  </ol>
</figure>

No necesitamos instalar manualmente Nginx ni administrar todo el servidor.

### SaaS — Software as a Service

Utilizamos directamente una aplicación que administra otra empresa.

Ejemplos:

* Gmail;
* Microsoft 365;
* Canva;
* GitHub.

### Una pregunta importante

¿Por qué utilizaremos IaaS si PaaS podría ser más sencillo?

Porque queremos comprender qué ocurre realmente cuando desplegamos una aplicación.

Al administrar una VM veremos:

* sistema operativo;
* red;
* puertos;
* firewall;
* servidor HTTP;
* DNS;
* certificados;
* HTTPS.

Después podremos valorar por qué existen servicios que automatizan todo esto.

---

## 5. Primera parte — Crear nuestra web

Necesitamos algo que publicar.

Crearemos una web sencilla.

Puede ser:

* portfolio;
* página de una empresa ficticia;
* presentación personal profesional;
* página sobre un proyecto;
* pequeña landing page.

Podéis utilizar un asistente de IA para ayudaros a crearla.

Pero hay una condición:

> Tenéis que entender qué habéis generado.

Como mínimo debe contener:

* HTML;
* CSS;
* alguna imagen;
* diseño razonablemente cuidado.

No necesitamos backend en esta actividad.

---

## 6. Guardar el proyecto en GitHub

Cuando trabajamos profesionalmente no solemos copiar proyectos mediante pendrive.

Utilizamos sistemas de control de versiones.

Subid vuestra web a un repositorio de GitHub.

Nuestro flujo será:

<figure class="diagram">
  <figcaption>Del portátil a producción</figcaption>
  <ol class="flow">
    <li>Código local</li>
    <li>Git</li>
    <li>GitHub</li>
    <li>Servidor de producción</li>
  </ol>
</figure>

GitHub no será nuestro servidor web.

Será el lugar desde el cual obtendremos el código.

---

## 7. Crear un servidor en Azure

Vamos a crear una **máquina virtual Linux** en Azure.

Una máquina virtual es un ordenador creado mediante software que dispone de:

* CPU;
* RAM;
* disco;
* sistema operativo;
* interfaz de red.

Pero no está debajo de nuestra mesa.

Se ejecuta en infraestructura de Microsoft.

Utilizaremos:

> Ubuntu Server.

---

## 8. Una advertencia importante: el cloud cuesta dinero

En un ordenador del aula podemos dejar una máquina encendida sin pensar demasiado en su coste directo.

En cloud normalmente pagamos por los recursos utilizados.

Por ejemplo:

* tiempo de CPU;
* memoria;
* almacenamiento;
* tráfico;
* direcciones IP;
* determinados servicios.

Por tanto:

> **No creéis recursos más grandes de lo necesario.**

Elegiremos una VM pequeña suficiente para servir nuestra página.

Cuando terminemos la actividad podremos detener o eliminar los recursos que ya no necesitemos.

Esta también es una competencia profesional: **controlar costes cloud**.

---

## 9. Acceder al servidor mediante SSH

Nuestro servidor no tendrá una pantalla física delante de nosotros.

Lo administraremos remotamente mediante **SSH**.

Conceptualmente:

<figure class="diagram">
  <figcaption>Una consola remota y cifrada</figcaption>
  <ol class="flow">
    <li>Nuestro ordenador</li>
    <li>Conexión cifrada por SSH</li>
    <li>Servidor Ubuntu</li>
  </ol>
</figure>

SSH suele utilizar:

<p class="single-node single-node--mono">TCP/22</p>

Siempre que sea posible utilizaremos **autenticación mediante clave SSH** en lugar de una contraseña.

---

## 10. Preparar el servidor

Una vez conectados:

```bash
sudo apt update
sudo apt upgrade
```

¿Por qué hacemos esto?

Porque un servidor que acabamos de crear puede tener paquetes pendientes de actualizar.

Mantener el software actualizado es una de las medidas básicas de seguridad.

---

## 11. Instalar Nginx

Nuestro servidor existe.

Pero todavía no sabe responder como servidor web.

Instalaremos:

```bash
sudo apt install nginx
```

Nginx es un servidor web.

Su función básica será:

<figure class="diagram">
  <figcaption>Qué hace un servidor web</figcaption>
  <ol class="flow">
    <li>Navegador</li>
    <li>Petición HTTP</li>
    <li>Nginx</li>
    <li>Archivo HTML</li>
    <li>Navegador</li>
  </ol>
</figure>

Comprobad que está funcionando:

```bash
sudo systemctl status nginx
```

---

## 12. Primer problema: Internet no puede entrar

Tenemos Nginx instalado.

Sin embargo, puede ocurrir que desde nuestro ordenador la dirección

<p class="single-node single-node--mono">http://IP_PUBLICA</p>

no funcione.

¿Por qué?

Porque tenemos diferentes capas de seguridad.

<figure class="diagram">
  <figcaption>Las capas que una petición debe atravesar</figcaption>
  <ol class="flow">
    <li>Internet</li>
    <li>Firewall y reglas de red de Azure</li>
    <li>Firewall de Linux</li>
    <li>Nginx</li>
  </ol>
</figure>

Para que HTTP funcione necesitamos permitir <code>TCP/80</code>, y posteriormente, para HTTPS, <code>TCP/443</code>.

---

## 13. Network Security Group de Azure

Azure permite controlar qué tráfico puede llegar a nuestra máquina mediante reglas de red.

Pensad en ellas como un portero:

<figure class="diagram">
  <figcaption>La decisión que toma una regla de red</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 270" role="img" aria-labelledby="nsg-title nsg-desc" preserveAspectRatio="xMidYMid meet">
    <title id="nsg-title">Cómo decide una regla de red</title>
    <desc id="nsg-desc">Cuando llega una conexión, la regla comprueba si está permitida. Si lo está, entra. Si no lo está, queda bloqueada.</desc>
    <defs>
      <marker id="nsg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 56 L 360 86" marker-end="url(#nsg-arrow)" />
      <path d="M 360 140 L 360 176" />
      <path d="M 185 176 L 535 176" />
      <path d="M 185 176 L 185 198" marker-end="url(#nsg-arrow)" />
      <path d="M 535 176 L 535 198" marker-end="url(#nsg-arrow)" />
    </g>
    <text class="diagram-label" x="185" y="166">Sí</text>
    <text class="diagram-label" x="535" y="166">No</text>
    <g class="diagram-node">
      <rect x="270" y="12" width="180" height="44" rx="3" />
      <text x="360" y="34">Llega conexión</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="250" y="92" width="220" height="48" rx="3" />
      <text x="360" y="116">¿Está permitida?</text>
    </g>
    <g class="diagram-node diagram-node--ok">
      <rect x="95" y="204" width="180" height="44" rx="3" />
      <text x="185" y="226">Entra</text>
    </g>
    <g class="diagram-node diagram-node--danger">
      <rect x="445" y="204" width="180" height="44" rx="3" />
      <text x="535" y="226">Bloqueada</text>
    </g>
  </svg>
</figure>

Microsoft documenta precisamente que para publicar una aplicación web en una VM debe permitirse tráfico TCP al puerto 80 en el NSG.

En esta actividad abriremos únicamente lo necesario:

<table>
  <thead>
    <tr>
      <th>Servicio</th>
      <th class="align-right">Puerto</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SSH</td>
      <td class="align-right">22</td>
    </tr>
    <tr>
      <td>HTTP</td>
      <td class="align-right">80</td>
    </tr>
    <tr>
      <td>HTTPS</td>
      <td class="align-right">443</td>
    </tr>
  </tbody>
</table>

No debemos abrir puertos simplemente «por si acaso».

---

## 14. Firewall de Ubuntu

También podemos tener un firewall dentro del propio servidor.

Comprobad:

```bash
sudo ufw status
```

Y permitid el perfil necesario para Nginx:

```bash
sudo ufw allow 'Nginx Full'
```

Más adelante reflexionaremos sobre por qué podemos tener seguridad tanto **fuera de la VM** como **dentro de la VM**.

---

## 15. Primera comprobación

Acceded a <code>http://IP_PUBLICA</code>.

Si aparece la página de bienvenida de Nginx:

> Tenemos nuestro primer servidor web público.

Pero todavía no contiene nuestro proyecto.

---

## 16. Llevar nuestro código al servidor

Instalad Git:

```bash
sudo apt install git
```

Clonad vuestro repositorio:

```bash
sudo git clone URL_REPOSITORIO /var/www/mi-sitio
```

Ahora tenemos:

<figure class="diagram">
  <figcaption>El código ya vive en el servidor</figcaption>
  <ol class="flow flow--row">
    <li>GitHub</li>
    <li>git clone</li>
    <li>/var/www/mi-sitio</li>
  </ol>
</figure>

---

## 17. Decir a Nginx dónde está nuestra web

Crearemos:

```bash
sudo nano /etc/nginx/sites-available/mi-sitio
```

Configuración inicial:

```nginx
server {
    listen 80;

    server_name _;

    root /var/www/mi-sitio;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Habilitamos el sitio:

```bash
sudo ln -s /etc/nginx/sites-available/mi-sitio \
/etc/nginx/sites-enabled/mi-sitio
```

Comprobamos antes de reiniciar:

```bash
sudo nginx -t
```

Si todo es correcto:

```bash
sudo systemctl reload nginx
```

---

## 18. ¿Por qué hacemos `nginx -t`?

Imaginad que modificamos la configuración de un servidor utilizado por miles de personas.

Tenemos un error: un punto y coma de menos, o una llave mal cerrada.

Si reiniciamos directamente podemos dejar el servicio fuera de funcionamiento.

Por eso primero:

<figure class="diagram">
  <figcaption>Comprobar antes de aplicar</figcaption>
  <ol class="flow">
    <li>Comprobamos la configuración</li>
    <li><code>nginx -t</code></li>
    <li>Si es válida</li>
    <li><code>reload</code></li>
  </ol>
</figure>

Es una buena práctica que aparece continuamente en administración de sistemas.

---

## 19. Ya tenemos nuestra web en Internet

Acceded de nuevo a <code>http://IP_PUBLICA</code>.

Ahora debería aparecer vuestro proyecto.

Hemos conseguido:

<figure class="diagram">
  <figcaption>La cadena completa, de momento</figcaption>
  <ol class="flow">
    <li>Código</li>
    <li>GitHub</li>
    <li>Servidor cloud</li>
    <li>Nginx</li>
    <li>Internet</li>
  </ol>
</figure>

Pero tenemos dos problemas.

La dirección es algo parecido a <code>20.73.184.26</code>, y además aparece <code>http://</code>.

Vamos a solucionar ambos.

---

## 20. DNS: los humanos no queremos recordar IP

Internet funciona utilizando direcciones IP.

Pero sería incómodo tener que recordar <code>142.250.184.14</code> en lugar de <code>google.com</code>.

DNS permite asociar nombres con direcciones.

Simplificando:

<figure class="diagram">
  <figcaption>De un nombre a una dirección</figcaption>
  <ol class="flow flow--row">
    <li>miweb.duckdns.org</li>
    <li>DNS</li>
    <li>20.73.184.26</li>
  </ol>
</figure>

---

## 21. Crear nuestro nombre

Utilizaremos DuckDNS para disponer de un subdominio gratuito.

Elegid algo como:

<p class="single-node single-node--mono">alumno-daw.duckdns.org</p>

y asociadlo con la IP pública de vuestro servidor.

Estamos realizando conceptualmente algo equivalente a:

<figure class="diagram">
  <figcaption>La asociación que acabamos de crear</figcaption>
  <ol class="flow flow--row">
    <li>Nombre DNS</li>
    <li>Dirección IP</li>
  </ol>
</figure>

---

## 22. Configurar Nginx para nuestro nombre

Modificad:

```bash
sudo nano /etc/nginx/sites-available/mi-sitio
```

y cambiad:

```nginx
server_name _;
```

por:

```nginx
server_name alumno-daw.duckdns.org;
```

Después:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Comprobad <code>http://alumno-daw.duckdns.org</code>.

---

## 23. Todavía tenemos un problema

Nuestro navegador muestra <code>HTTP</code>.

Cuando utilizamos HTTP, la comunicación entre navegador y servidor no está protegida mediante TLS.

Queremos <code>HTTPS</code>.

---

## 24. ¿Qué aporta HTTPS?

HTTPS proporciona principalmente tres propiedades.

### Confidencialidad

Un tercero no debería poder leer fácilmente la comunicación entre cliente y servidor.

### Integridad

Permite detectar modificaciones de la información durante la comunicación.

### Autenticación

El certificado ayuda al navegador a comprobar que está hablando con el servidor correspondiente al nombre solicitado.

---

## 25. Certificados digitales

Para utilizar HTTPS necesitamos un certificado válido para nuestro nombre.

Utilizaremos:

> Let's Encrypt.

Let's Encrypt es una autoridad certificadora que permite obtener certificados TLS de forma automatizada y gratuita.

Para emitir el certificado debe comprobar que realmente controlamos <code>alumno-daw.duckdns.org</code>.

Para ello puede realizar un desafío HTTP.

Simplificando:

<figure class="diagram">
  <figcaption>Cómo se demuestra que el dominio es nuestro</figcaption>
  <ol class="flow">
    <li>Let's Encrypt pregunta: ¿controlas este dominio?</li>
    <li>Nuestro servidor responde al desafío</li>
    <li>Let's Encrypt lo comprueba</li>
    <li>Emite el certificado</li>
  </ol>
</figure>

---

## 26. Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

Después:

```bash
sudo certbot --nginx
```

Certbot:

* solicitará el certificado;
* realizará la validación;
* configurará Nginx;
* podrá configurar la redirección a HTTPS.

Para que la validación HTTP funcione, el nombre DNS debe resolver correctamente hacia nuestro servidor y el puerto 80 debe ser accesible.

---

## 27. Abrir HTTPS

Recordad que disponer de un certificado no hace automáticamente accesible <code>TCP/443</code>.

Debéis comprobar también las reglas de red de Azure.

Después probad:

<p class="single-node single-node--mono">https://alumno-daw.duckdns.org</p>

---

## 28. ¿Qué ha cambiado realmente?

Antes:

<figure class="diagram">
  <figcaption>Antes · sin cifrar</figcaption>
  <ol class="flow flow--before">
    <li>Navegador</li>
    <li>HTTP</li>
    <li>Nginx</li>
  </ol>
</figure>

Ahora:

<figure class="diagram">
  <figcaption>Después · protegido por TLS</figcaption>
  <ol class="flow">
    <li>Navegador</li>
    <li>HTTPS</li>
    <li>TLS cifra la comunicación</li>
    <li>Nginx</li>
  </ol>
</figure>

---

## 29. Comprobar el certificado

Desde el navegador:

1. acceded al sitio;
2. abrid la información del certificado;
3. comprobad para qué nombre se ha emitido;
4. observad quién lo ha emitido;
5. comprobad su periodo de validez.

No queremos únicamente «que salga el candado».

Queremos entender **por qué el navegador confía en nuestra conexión**.

---

## 30. Actualizar nuestra web

Ahora modificad algo visible en vuestro proyecto local. Por ejemplo, una versión 2.

Haced:

```bash
git add .
git commit
git push
```

Y después en el servidor:

```bash
cd /var/www/mi-sitio
sudo git pull
```

Comprobad que la nueva versión aparece públicamente.

Nuestro proceso actual es:

<figure class="diagram">
  <figcaption>El despliegue, todavía manual</figcaption>
  <ol class="flow">
    <li>Desarrollador</li>
    <li>GitHub</li>
    <li><code>git pull</code></li>
    <li>Servidor</li>
    <li>Producción</li>
  </ol>
</figure>

Más adelante, en una empresa, este proceso puede automatizarse mediante **CI/CD**.

Por ejemplo:

<figure class="diagram">
  <figcaption>El mismo camino, automatizado</figcaption>
  <ol class="flow flow--row">
    <li>git push</li>
    <li>tests</li>
    <li>build</li>
    <li>deploy</li>
  </ol>
</figure>

No lo implementaremos ahora.

Lo importante es comprender qué problema resuelve.

---

## 31. Seguridad básica

Antes de considerar terminado el servidor, revisad:

#### ¿SSH está abierto innecesariamente a todo Internet?

Siempre que sea posible, limitad su acceso.

#### ¿Utilizamos clave SSH?

Preferible a contraseñas débiles.

#### ¿El sistema está actualizado?

```bash
sudo apt update
sudo apt upgrade
```

#### ¿Tenemos abiertos únicamente los puertos necesarios?

Normalmente <code>22</code>, <code>80</code> y <code>443</code>.

#### ¿HTTPS funciona?

Debe hacerlo.

#### ¿HTTP redirige a HTTPS?

Comprobadlo.

---

## 32. Ocultar información innecesaria

Podemos evitar que Nginx publique su versión.

Editad:

```bash
sudo nano /etc/nginx/nginx.conf
```

Dentro de `http`:

```nginx
server_tokens off;
```

Después:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Esto reduce información expuesta, pero recordad:

> **No sustituye a mantener el software actualizado ni a configurar correctamente la seguridad.**

---

## 33. El mapa completo

Al terminar habremos construido:

<figure class="diagram">
  <figcaption>Todo lo que hay entre el desarrollador y el usuario</figcaption>
  <svg class="diagram-svg" viewBox="0 0 720 764" role="img" aria-labelledby="map-title map-desc" preserveAspectRatio="xMidYMid meet">
    <title id="map-title">Mapa completo del despliegue</title>
    <desc id="map-desc">El desarrollador publica en GitHub y accede por SSH a una máquina en Azure, protegida por reglas de red, donde Ubuntu ejecuta Nginx que sirve la web. La comunicación llega al usuario a través de TLS y DNS.</desc>
    <defs>
      <marker id="map-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path class="diagram-arrowhead" d="M 0 0 L 10 5 L 0 10 z" />
      </marker>
    </defs>
    <g class="diagram-edges">
      <path d="M 360 56 L 360 82" marker-end="url(#map-arrow)" />
      <path d="M 360 132 L 360 158" marker-end="url(#map-arrow)" />
      <path d="M 360 208 L 360 234" marker-end="url(#map-arrow)" />
      <path d="M 360 326 L 360 346" marker-end="url(#map-arrow)" />
      <path d="M 360 394 L 360 414" marker-end="url(#map-arrow)" />
      <path d="M 360 462 L 360 482" marker-end="url(#map-arrow)" />
      <path d="M 360 540 L 360 562" marker-end="url(#map-arrow)" />
      <path d="M 360 608 L 360 630" marker-end="url(#map-arrow)" />
      <path d="M 360 676 L 360 698" marker-end="url(#map-arrow)" />
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="270" y="12" width="180" height="44" rx="3" />
      <text x="360" y="34">Desarrollador</text>
    </g>
    <g class="diagram-node">
      <rect x="270" y="88" width="180" height="44" rx="3" />
      <text x="360" y="110">GitHub</text>
    </g>
    <g class="diagram-node">
      <rect x="290" y="164" width="140" height="44" rx="3" />
      <text x="360" y="186">SSH</text>
    </g>
    <g class="diagram-node diagram-node--container">
      <rect x="170" y="240" width="380" height="300" rx="3" />
      <text x="360" y="262">AZURE</text>
    </g>
    <g class="diagram-node">
      <rect x="215" y="284" width="290" height="42" rx="3" />
      <text x="360" y="305">Reglas de red</text>
    </g>
    <g class="diagram-node">
      <rect x="215" y="352" width="290" height="42" rx="3" />
      <text x="360" y="373">Máquina virtual Ubuntu</text>
    </g>
    <g class="diagram-node">
      <rect x="215" y="420" width="290" height="42" rx="3" />
      <text x="360" y="441">Nginx</text>
    </g>
    <g class="diagram-node diagram-node--data">
      <rect x="215" y="488" width="290" height="42" rx="3" />
      <text x="360" y="509">Web</text>
    </g>
    <g class="diagram-node">
      <rect x="310" y="568" width="100" height="40" rx="3" />
      <text x="360" y="588">TLS</text>
    </g>
    <g class="diagram-node">
      <rect x="310" y="636" width="100" height="40" rx="3" />
      <text x="360" y="656">DNS</text>
    </g>
    <g class="diagram-node diagram-node--accent">
      <rect x="270" y="704" width="180" height="44" rx="3" />
      <text x="360" y="726">Usuario</text>
    </g>
  </svg>
</figure>

Cada elemento resuelve un problema diferente.

---

## 34. Actividad final: explica tu arquitectura

Incluid en vuestra memoria un dibujo de vuestra arquitectura.

Después explicad con **una frase** la función de cada elemento:

| Elemento | Función |
| --- | --- |
| Azure | |
| Máquina virtual | |
| Ubuntu | |
| SSH | |
| Nginx | |
| GitHub | |
| IP pública | |
| DNS | |
| Puerto 80 | |
| Puerto 443 | |
| Certificado TLS | |
| HTTPS | |

No copiéis definiciones de Internet.

Explicadlo como si se lo estuvierais contando a otro alumno.

---

## 35. Preguntas de reflexión

Responded brevemente.

#### 1. ¿Por qué nuestra VM de Azure es un ejemplo de IaaS?

<p class="write-line"></p>

#### 2. ¿Qué diferencia existe entre tener una IP pública y disponer de un dominio?

<p class="write-line"></p>

#### 3. ¿Qué ocurriría si cerramos el puerto 80?

<p class="write-line"></p>

#### 4. ¿Qué ocurriría si cerramos el puerto 443?

<p class="write-line"></p>

#### 5. ¿Qué función tiene Nginx?

<p class="write-line"></p>

#### 6. ¿Por qué necesitamos DNS?

<p class="write-line"></p>

#### 7. ¿Por qué necesitamos un certificado para HTTPS?

<p class="write-line"></p>

#### 8. ¿Qué diferencia hay entre el firewall de Ubuntu y las reglas de red de Azure?

<p class="write-line"></p>

#### 9. ¿Por qué no es buena idea abrir todos los puertos?

<p class="write-line"></p>

#### 10. ¿Qué ventaja tendría automatizar `git pull` y el despliegue después de cada cambio validado?

<p class="write-line"></p>

---

## 36. Producto final

Debe existir realmente:

**1. Repositorio GitHub** con vuestra web.

**2. Máquina virtual** desplegada en Azure.

**3. Web pública** accesible desde Internet.

**4. Nombre DNS** similar a:

<p class="single-node single-node--mono">https://nombre.duckdns.org</p>

**5. HTTPS** con certificado válido.

**6. Memoria breve.** No queremos una memoria de veinte páginas.

Incluid:

* arquitectura;
* capturas que demuestren los hitos;
* comandos importantes;
* explicación de qué hace cada componente;
* problemas encontrados y cómo los resolvisteis;
* respuestas a las preguntas finales.

---

## 37. Evaluación

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

### Importante

No basta con copiar comandos hasta que funcione.

La parte con mayor peso de la actividad es:

> **ser capaces de explicar qué habéis construido y por qué funciona.**

---

## 38. Lo que debes recordar

Un despliegue web que parecía simplemente «subir mi página a Internet» en realidad implica:

<figure class="diagram">
  <figcaption>Todo lo que hay detrás de publicar una página</figcaption>
  <ol class="flow">
    <li>Código</li>
    <li>Control de versiones</li>
    <li>Cloud</li>
    <li>Máquina virtual</li>
    <li>Sistema operativo</li>
    <li>Servidor web</li>
    <li>Red</li>
    <li>Firewall</li>
    <li>DNS</li>
    <li>TLS / HTTPS</li>
    <li>Usuario</li>
  </ol>
</figure>

Cuando en una oferta de trabajo aparezcan conceptos como **Azure, AWS, VM, IaaS, Linux, Nginx, SSH, DNS, TLS o CI/CD**, ya no serán palabras abstractas.

Habréis utilizado buena parte de ellos para publicar vuestra propia aplicación.

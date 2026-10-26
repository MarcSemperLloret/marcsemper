---
title: "Cloud y arquitecturas modernas"
label: "UD3 · Proyecto"
section: "ud-03"
order: 3
lang: "es"
summary: "Comprende la nube mediante casos escritos: modelos de servicio, arquitectura web, incidencias, costes y decisiones de empresa. Sin cuentas ni despliegues."
duration: "5 horas · 5 sesiones"
modality: "Taller de una hora · 10 min de explicación, 45 min de trabajo y 5 min de cierre"
deliverable: "Dossier de decisiones sobre cloud. Cinco fichas breves realizadas en clase."
date: "2026-09-09"
outcomes:
  - "Distinguir IaaS, PaaS y SaaS y sus responsabilidades."
  - "Representar el recorrido de una petición web y la función de sus componentes."
  - "Proponer comprobaciones razonadas ante incidencias descritas."
  - "Comparar costes y limitaciones con datos de un caso."
  - "Justificar una solución para una pequeña empresa y reconocer sus límites."
requirements:
  - "Papel y bolígrafo o un editor de documentos local."
  - "Enunciados y datos incluidos en cada sesión. No se necesitan cuentas, Internet ni instalaciones."
priorKnowledge:
  - "Las unidades anteriores de este módulo. No se requiere Servidor ni Intermodular."
---

<p class="lead">Cinco actividades escritas para comprender cómo se organiza un servicio digital y decidir cuándo conviene utilizar la nube. Todos los casos y datos necesarios aparecen en esta unidad.</p>

## Cómo trabajar esta unidad

Cada sesión se completa en una hora: **10 minutos de explicación, 45 de trabajo y 5 de cierre**. Se puede trabajar en papel o en un documento local. No hay que abrir cuentas, programar, instalar herramientas ni utilizar servicios cloud. Tampoco hay deberes adicionales.

Conserva las cinco fichas en un único **Dossier de decisiones sobre cloud**, con nombre, fecha y número de sesión. Cada ficha ocupa aproximadamente una página; las tablas y los dibujos sustituyen texto cuando ayudan a explicar. Se valora el razonamiento, no la extensión. El dossier se entrega al finalizar la quinta sesión por el medio habitual del aula, también en papel si procede.

## Actividad y criterios de evaluación

La actividad se valora sobre 10 puntos y aporta **5/30 de la calificación del módulo**. Se mantiene la duración y el peso de la unidad. No hay un examen adicional ni se evalúa un despliegue real.

| Criterio | Puntos | Evidencia |
| --- | --- | --- |
| Distingue modelos y responsabilidades con una justificación correcta | 2 | Ficha 1 |
| Explica los componentes y el recorrido de una petición | 2 | Ficha 2 |
| Distingue observaciones, hipótesis y comprobaciones | 2 | Ficha 3 |
| Calcula y compara costes sin ocultar limitaciones | 2 | Ficha 4 |
| Propone una solución coherente y revisa sus decisiones | 2 | Ficha 5 |

En cada criterio: **0 puntos**, respuesta ausente o incompatible con los datos; **1 punto**, respuesta parcialmente correcta pero con errores o justificación incompleta; **2 puntos**, respuesta correcta, justificada y ajustada al caso. Se pueden utilizar medios puntos para desempeños intermedios. Una conclusión alternativa puede obtener la puntuación completa si respeta los datos y explica sus límites. Tras el feedback, corrige la misma ficha y conserva el cambio.

## Sesión 1 · Qué estamos contratando

**Punto de partida.** Ficha 1 de 5. Solo necesitas el enunciado y un soporte para escribir.

### Se explica

<p class="stage stage--brief">10 minutos · conceptos y ejemplo</p>

La **nube** permite acceder por red a recursos y servicios de un proveedor. No significa que los datos carezcan de ubicación física. Un servidor del propio negocio también puede ofrecer servicios por red sin ser un servicio cloud contratado.

En **IaaS**, alquilamos infraestructura: por ejemplo, una máquina virtual. El proveedor mantiene el equipo físico; el cliente administra el sistema operativo y su aplicación. En **PaaS**, el proveedor gestiona además la plataforma de ejecución; el cliente sigue siendo responsable de su código, datos y configuración. En **SaaS**, utilizamos una aplicación terminada; seguimos gestionando usuarios, permisos y uso de los datos. Externalizar tareas no elimina todas las responsabilidades.

**Ejemplo resuelto:** una peluquería contrata una aplicación de citas lista para usar. Es SaaS porque utiliza el programa del proveedor. La peluquería debe decidir quién puede consultar los datos de los clientes.

### Se trabaja

<p class="stage stage--guided">45 minutos · ficha escrita</p>

1. **Clasificar (15 min).** Para cada caso escribe IaaS, PaaS o SaaS y una frase que lo justifique: A) alquilar una VM e instalar Linux y una web; B) subir una aplicación propia a una plataforma que mantiene el sistema; C) usar un correo empresarial terminado; D) contratar una aplicación de facturación lista para usar.
2. **Repartir responsabilidades (15 min).** En el caso A y en el B, indica quién mantiene el equipo físico, quién actualiza el sistema operativo y quién corrige un error del código propio. Añade quién decide los permisos de los usuarios en el caso D.
3. **Elegir (10 min).** Una academia de idiomas con seis empleados necesita gestionar citas. No tiene personal técnico y le sirve una aplicación estándar. Recomienda un modelo y justifica dos ventajas y una limitación.
4. **Revisar (5 min).** Corrige esta frase en dos o tres líneas: «Si contrato la nube, el proveedor se encarga de toda la seguridad».

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:** entrega o guarda una ficha con cuatro clasificaciones, el reparto de responsabilidades y tu recomendación. Comprueba que has explicado por qué, sin limitarte a escribir siglas.

## Sesión 2 · Cómo llega una web al cliente

**Punto de partida.** Ficha 2 de 5. El caso es ficticio y no hay que visitar ninguna dirección.

### Se explica

<p class="stage stage--brief">10 minutos · conceptos y ejemplo</p>

El **navegador** solicita contenido. **DNS** permite obtener una dirección IP a partir de un nombre. Un **servidor web** recibe peticiones y devuelve contenido. Una aplicación **backend** procesa reglas y consultas; una **base de datos** conserva información. Una web estática puede funcionar sin backend propio ni base de datos.

**HTTPS** protege la comunicación mediante TLS y permite comprobar la identidad del servidor mediante un certificado válido para el nombre solicitado. No garantiza que el negocio sea honrado ni que su aplicación carezca de errores. Un **firewall** filtra conexiones según reglas: visitar una web y administrar su servidor son usos distintos.

### Se trabaja

<p class="stage stage--guided">45 minutos · ficha escrita</p>

**Caso:** Librería Faro quiere mostrar dirección, horario y catálogo informativo. No habrá compras, cuentas de usuario ni consultas a existencias en tiempo real. La persona responsable actualizará el catálogo una vez al mes.

1. **Seleccionar (10 min).** De esta lista, elige las piezas necesarias para consultar la web: navegador, DNS, servidor web, HTTPS, backend propio, base de datos. Justifica qué piezas omitirías para este caso.
2. **Dibujar (15 min).** Dibuja la consulta DNS por separado y después el recorrido navegador → servidor web → respuesta. Etiqueta las flechas y señala dónde se protege la comunicación con HTTPS. No hace falta dibujar el funcionamiento interno de TLS.
3. **Explicar (10 min).** Escribe una frase con la función de DNS, servidor web y HTTPS. Explica por qué guardar archivos en el portátil no los hace accesibles al público.
4. **Cambiar el caso (10 min).** Ahora la librería quiere reservas con existencias actualizadas. Añade al dibujo una aplicación y una base de datos. Explica qué haría cada una y por qué la base de datos no necesita admitir conexiones directas de los visitantes.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:** guarda ambos dibujos y sus explicaciones. Comprueba que DNS no aparece enviando los archivos de la web y que distingues consulta de información y procesamiento de reservas.

## Sesión 3 · Investigar antes de cambiar cosas

**Punto de partida.** Ficha 3 de 5. Utiliza únicamente las observaciones del enunciado; no ejecutes comandos ni pruebes servidores reales.

### Se explica

<p class="stage stage--brief">10 minutos · conceptos y ejemplo</p>

Una **observación** describe lo que sabemos; una **hipótesis** propone una causa posible; una **comprobación** permite obtener información para aceptarla o descartarla. Un síntoma rara vez demuestra por sí solo una causa. Es mejor comprobar una cosa cada vez que cambiar toda la configuración.

**Ejemplo resuelto:** «El navegador indica que el certificado ha caducado» es una observación. «La renovación pudo fallar» es una hipótesis. Revisar las fechas del certificado y el registro de renovación sería una comprobación. Desactivar la validación del navegador no soluciona el certificado.

### Se trabaja

<p class="stage stage--guided">45 minutos · ficha escrita</p>

Completa una tabla con **observación, hipótesis, primera comprobación y resultado que apoyaría la hipótesis** para estos cuatro casos. Dedica unos ocho minutos a cada uno:

- **A · Nombre equivocado.** La ficha de inventario indica que el servidor actual tiene la dirección ficticia 203.0.113.20. El informe de resolución del nombre devuelve 203.0.113.10.
- **B · Error 404.** La portada abre correctamente por HTTPS, pero el enlace a `/catalogo.html` devuelve 404. No sabemos todavía si el archivo existe ni si el enlace está bien escrito.
- **C · Certificado.** La fecha del equipo es correcta. El informe del navegador dice que el certificado del sitio caducó ayer.
- **D · Sin conexión exterior.** El informe del servidor muestra una respuesta HTTP local correcta. Desde fuera de la red la conexión agota el tiempo de espera. No conocemos el estado de las reglas de red.

**Comparar (8 min).** Elige el caso D y propone otra causa posible además de un bloqueo del firewall. Escribe qué dato necesitarías para distinguirlas. La dirección de acceso podría ser incorrecta o el servicio podría escuchar solo conexiones locales; no des ninguna causa por confirmada.

**Revisar (5 min).** Subraya las conclusiones que los datos sí permiten sostener y cambia las afirmaciones excesivas. Un 404 no demuestra que el servidor entero esté caído.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:** la tabla incluye cuatro casos y distingue hechos de explicaciones posibles. No se pide resolver una avería real ni inventar resultados de pruebas.

## Sesión 4 · Cuánto cuesta y qué incluye

**Punto de partida.** Ficha 4 de 5. Todos los precios son **supuestos didácticos**, no tarifas reales de proveedores. Puedes calcular a mano o con calculadora.

### Se explica

<p class="stage stage--brief">10 minutos · conceptos y ejemplo</p>

El coste de un servicio incluye tanto la contratación como el tiempo dedicado a mantenerlo. Una comparación necesita el mismo periodo y aclarar qué incluye cada opción. Un presupuesto de clase no predice una factura real: puede omitir impuestos, tráfico o trabajo adicional.

**Ejemplo:** una cuota de 8 € al mes y media hora de mantenimiento valorada a 20 €/hora suman 18 € mensuales en el modelo del ejercicio. El tiempo valorado representa un coste de trabajo, aunque no sea una factura del proveedor.

### Se trabaja

<p class="stage stage--guided">45 minutos · ficha escrita</p>

**Caso:** Librería Faro necesita la web informativa de la sesión 2. Las tres propuestas cumplen sus necesidades actuales. El presupuesto mensual total es de 35 €. Se valora el mantenimiento a **20 €/hora**. Ignora impuestos y alta inicial en los cálculos.

| Propuesta ficticia | Cuota mensual | Mantenimiento mensual | Condición |
| --- | --- | --- | --- |
| A · VM administrada por la librería | 10 € | 2 horas | Permite instalar software propio |
| B · Alojamiento gestionado del sitio | 18 € | 0,5 horas | Solo admite el sitio informativo |
| C · Constructor web SaaS | 25 € | 0,25 horas | Plantillas limitadas; exportación incompleta |

1. **Calcular (15 min).** Para cada propuesta calcula cuota + horas × 20, y después el total de doce meses. Muestra las operaciones y las unidades.
2. **Comparar (10 min).** Indica cuáles cumplen el presupuesto de 35 €. Recomienda una para la web actual utilizando coste y al menos una condición de la tabla.
3. **Cambiar una condición (10 min).** La librería necesita ahora una aplicación propia que, según el enunciado, solo admite A. Explica por qué la opción más barata del caso anterior puede dejar de servir y qué tendría que revisar la empresa antes de decidir.
4. **Reconocer límites (10 min).** Escribe dos costes que faltan en el modelo y dos preguntas que harías al proveedor. Incluye cómo recuperar los datos y qué ocurre al terminar el contrato.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:** hay tres cálculos mensuales, tres anuales y una recomendación justificada. Para revisar las operaciones, los totales mensuales son A: 50 €, B: 28 € y C: 30 €. Corrige los errores explicando su origen.

## Sesión 5 · Recomendar una solución

**Punto de partida.** Ficha 5 de 5. Recupera las fichas anteriores. Todo se termina y entrega durante esta hora.

### Se explica

<p class="stage stage--brief">10 minutos · conceptos y ejemplo</p>

Una recomendación conecta necesidades con decisiones. Debe indicar qué resuelve, quién se responsabiliza y qué podría hacerla cambiar. Más componentes no implican una arquitectura mejor. Una tienda pequeña y una plataforma de reservas pueden necesitar soluciones distintas.

Los servicios alojados dependen de la conexión para su acceso remoto. Las copias, la exportación de datos y un procedimiento ante incidencias deben planificarse; contratar un servicio no demuestra que esos mecanismos existan o se hayan probado.

### Se trabaja

<p class="stage stage--guided">45 minutos · ficha final</p>

**Caso final:** la librería mantiene su web informativa, tiene tres empleados y carece de personal técnico. Puede gastar 35 € mensuales según el modelo de la sesión 4. El catálogo no contiene datos personales. Las reservas en línea se aplazan. Una mañana sin web es asumible, pero la empresa necesita conservar una copia del contenido para cambiar de proveedor.

1. **Recomendar (10 min).** Elige A, B o C de la sesión 4. Escribe entre cuatro y seis líneas con dos necesidades del caso, el coste mensual y una limitación. Si eliges una opción que incumple una condición, debes resolver esa incompatibilidad sin inventar presupuesto adicional.
2. **Representar (10 min).** Dibuja la arquitectura propuesta y explica DNS, alojamiento y HTTPS. Indica qué gestionaría la librería y qué gestionaría el proveedor, señalando cualquier condición contractual que habría que confirmar.
3. **Planificar (10 min).** Completa tres filas: actualización del catálogo, interrupción del servicio y cambio de proveedor. Para cada una escribe responsable, acción prevista y evidencia que pedirías para comprobarla. Son medidas propuestas, no pruebas realizadas.
4. **Revisar el dossier (10 min).** Comprueba las cinco fichas con la rúbrica. Corrige al menos una respuesta y explica qué has cambiado y por qué; si no encuentras errores, mejora una justificación concreta.
5. **Entregar (5 min).** Ordena las cinco fichas y añade una conclusión de tres líneas: decisión principal, limitación y dato que todavía faltaría confirmar.

### Cierre

<p class="stage">5 minutos · comprobar el resultado</p>

**Al terminar la sesión:** entrega las cinco fichas. Explica brevemente una decisión si el docente te lo solicita durante la revisión. La evidencia es tu análisis escrito: no se requieren URL pública, capturas de portales ni despliegues.

## Lo que debes recordar

IaaS, PaaS y SaaS reparten responsabilidades de forma diferente. Una arquitectura debe responder a una necesidad; un diagnóstico distingue datos de hipótesis; una comparación de costes necesita supuestos explícitos. Estos ejercicios permiten explicar y decidir, pero no acreditan experiencia práctica administrando un servicio cloud.

En la UD4 de IA se utilizará un sitio inicial descargable y abierto en local. No depende de haber publicado nada en esta unidad.

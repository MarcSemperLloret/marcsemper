# Guía del repositorio

Sitio docente en Astro. El contenido de las clases vive en `src/content/sessions/<modulo>/<ud>.md`:
un fichero por unidad, dividido en sesiones por encabezados `##`.

## Registro de las sesiones

Estas reglas son normativas para cualquier texto de `src/content/sessions/`. Se extrajeron de la
reescritura de `proyecto-intermodular/ud1` y `ud2` (commits `6c14d4c` y `5432f0f`), que son la
referencia de estilo del corpus. El resto de módulos todavía no las cumple.

### 1. Persona gramatical

- **Segunda persona del singular** en todo lo que se dirige al alumnado: «crea el archivo»,
  «accede a la pestaña», «tu repositorio», `TU-USUARIO`.
- **Nunca segunda del plural.** Ni `vosotros`, ni `vuestro`, ni imperativos en `-ad/-id`
  («abrid», «comprobad», «fijaos»), ni el pronombre `os`.
- **Nunca primera del singular del profesor.** Nada de «yo las miro», «no me fío», «os hago leer
  esto». Lo que se evalúa se enuncia de forma impersonal: «los registros incorporan marcas
  temporales auditables».
- Se admite la **primera del plural didáctica** en la parte expositiva: «analizaremos»,
  «provocaremos deliberadamente dos fallos».

### 2. Registro

Técnico-académico y explicativo. No coloquial, no cómplice, no publicitario.

Fórmulas prohibidas, por ser marcas de redacción automática o de oralidad:

- Remates coloquiales: «da igual», «no pasa nada», «sale gratis», «y ya está», «de sobra»,
  «tal cual», «un montón», «se nota», «a las prisas», «se come una tarde», «media tarde».
- Metáforas caseras: «la tubería lleva agua», «el escaparate», «aunque os pique», «a ojo».
- La revelación en dos tiempos: «no es un requisito: es un deseo», «no es una comodidad: es la
  única dirección». Enúnciese la afirmación directamente.
- Aperturas conversacionales de frase: «Y los programas…», «Pero si alguien te pregunta…».
- La frase corta de remate como golpe de efecto («Hoy no.», «Verde otra vez.»).
- El guion largo como aparte irónico. Se admite solo como inciso sintáctico normal.
- Preguntas retóricas respondidas por el propio texto («¿Por qué? Porque…»).

### 3. Rigor conceptual

Si un fenómeno tiene nombre en la disciplina, **se nombra y después se explica**. No se describe
en lenguaje llano algo que ya tiene término propio:

| En vez de | Se escribe |
| --- | --- |
| «desplegar el primer día con la web vacía» | **Walking Skeleton**, y el principio de *fail-early* |
| «una copia de trabajo donde romper cosas» | **rama de funcionalidad** (*Feature Branch Workflow*) |
| «no hay ninguna contraseña guardada» | **credenciales efímeras OIDC** frente a secretos estáticos |
| «verde y sin embargo 404» | **fallo de pipeline** frente a **fallo semántico o funcional** |
| «el despliegue no llegó a sustituirla» | **atomicidad** de la publicación |
| «un fichero que se puede abrir y versionar» | **infraestructura como código (IaC)**, flujo declarativo |

Los términos ingleses aceptados por la industria van en cursiva la primera vez (*issue*,
*pull request*, *runner*, *code review*) y no se traducen a media frase.

El recorrido obligatorio issue → rama → pull request → revisión → despliegue se denomina
**flujo de integración continua**, nunca «circuito». La única excepción es el sentido corriente
de la palabra en Servidor —«el circuito completo de conversiones», el viaje de ida y vuelta de
un dato—, que no designa el flujo de trabajo y se conserva. El título de la UD1 de Proyecto
Intermodular mantiene «circuito» porque de su nombre de fichero sale la URL pública.

### 4. Etiquetas y encabezados

`rule-label`, `checkpoint-label` y `compare-label` llevan **sintagma nominal descriptivo**, nunca
frase ingeniosa ni sentencia:

- «Las fechas se miran» → «Trazabilidad y constancia en el desarrollo»
- «Verde no significa que funcione» → «La limitación de un pipeline sin validación automatizada»
- «Seis, ni una más» → «Dimensionamiento y granularidad de las tareas»
- «Comprobación del bloque B» → «Lista de verificación del bloque B»

### 5. Lo que no se toca al corregir el registro

La arquitectura pedagógica es correcta y se conserva: la secuencia `Se explica` / `Se trabaja` /
`Cierre`, los bloques con su carga horaria, las listas de verificación, los `details` de errores
frecuentes, las preguntas sin respuesta en `dl.answer` y el orden de los pasos prácticos. Se
reescribe **cómo está dicho**, no qué se enseña ni en qué orden.

## Marcado

Dentro de un bloque HTML el Markdown no se procesa: usa `<code>`, no acentos graves, y escapa las
etiquetas que documentes (`&lt;head&gt;`). `scripts/check-sessions.mjs` falla la compilación
cuando eso se incumple, junto con la sintaxis de alertas de GitHub y el TeX suelto.

## Comprobaciones

```bash
npm run check:register   # registro y persona gramatical (informativo)
npm run build            # check-sessions + astro check + astro build
```

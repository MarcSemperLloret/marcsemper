/**
 * Fails the build when a session writes a live HTML tag inside a raw HTML block.
 *
 * Markdown does not process backticks inside an HTML block, so this line, which
 * looks like it documents two elements:
 *
 *     <li>Los metadatos del `<head>`, y el `<title>` de la pestaña.</li>
 *
 * puts a real `<title>` into the page. The browser then swallows the rest of the
 * document as the title text, and the session renders empty from that point on.
 * Nothing reports it: the Markdown compiles, `astro check` passes and the build
 * succeeds. It is only visible by opening the page.
 *
 * Inside an HTML block, tags have to be written escaped: `&lt;head&gt;`.
 *
 * It also checks that each unit still has the shape the content loader splits
 * it into. A `##` heading that is neither a class nor a week divider, sitting
 * between two classes, would silently land on a page it does not belong to, so
 * it fails the build here instead.
 *
 * Three more failures share that same shape — the Markdown compiles, the build
 * succeeds, and the defect is only visible by opening the page:
 *
 *   - Backticks inside an HTML block. Markdown does not read them there, so
 *     `<li>Configura `ddl-auto`</li>` prints the backticks. Use <code>.
 *   - GitHub's alert syntax (`> [!NOTE]`). This site's Markdown pipeline does
 *     not implement it, so the marker is printed as text.
 *   - TeX left in the prose (`$	o$`, `$$…$$`). Nothing renders maths here.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

import { splitUnit, FENCE } from "../plugins/unit-split.mjs";

const ROOT = "src/content";

/**
 * Tags that either swallow the content after them or inject a live control into
 * the page. These are the ones worth failing a build over.
 */
const DANGEROUS = new Set([
  "html", "head", "body", "title", "meta", "base", "link", "script", "style",
  "template", "iframe", "object", "embed", "frame", "frameset", "noscript",
  "form", "input", "button", "select", "option", "textarea", "label",
  "fieldset", "legend", "output", "datalist", "optgroup"
]);

const TAG = /<\/?([a-zA-Z][a-zA-Z0-9]*)/g;

/** `> [!NOTE]`, `> [!WARNING]`… GitHub renders these; this site does not. */
const ALERT = /^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i;

/** `$	o$`, `$\le 2$`, `$$	ext{…}$$`: TeX with no renderer behind it. */
const TEX = /\$\$?[^$]*\\[a-zA-Z]+[^$]*\$\$?/;

function markdownFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) found.push(...markdownFiles(path));
    else if (entry.endsWith(".md")) found.push(path);
  }
  return found;
}

function scan(path) {
  const problems = [];
  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  let inHtmlBlock = false;
  let inSvg = false;
  // The marker that opened the current code block, or undefined outside one.
  // Tracked exactly as `unit-split.mjs` tracks it: a fence closes only on a
  // line of the same character, at least as long, and with nothing after it.
  // Toggling on any ``` instead would disagree with the split about where a
  // block ends, which is how a nested ```bash once swallowed a whole session.
  let fence;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Fenced code is shown verbatim and escaped by the compiler, so anything
    // inside it is fine however it is written.
    const fenceMatch = FENCE.exec(line);
    if (fenceMatch) {
      const [, marker, rest] = fenceMatch;
      if (!fence) fence = marker;
      else if (
        marker[0] === fence[0] &&
        marker.length >= fence.length &&
        rest.trim() === ""
      ) {
        fence = undefined;
      }
      return;
    }
    if (fence) return;

    // Neither of these is read inside an HTML block or out of it, so they are
    // checked on every line of prose.
    if (ALERT.test(trimmed)) {
      problems.push({
        line: index + 1,
        reason: "aviso [!NOTE] de GitHub",
        advice: 'aquí no se renderiza: usa <div class="rule">',
        text: trimmed
      });
    }
    if (TEX.test(line)) {
      problems.push({
        line: index + 1,
        reason: "fórmula TeX",
        advice: "no hay renderizador de matemáticas: escríbelo en texto",
        text: trimmed
      });
    }

    // A blank line closes an HTML block; a line starting with `<` opens one.
    if (trimmed === "") {
      inHtmlBlock = false;
      return;
    }
    if (!inHtmlBlock && trimmed.startsWith("<")) inHtmlBlock = true;
    if (!inHtmlBlock) return;

    // Hand-written diagrams legitimately use <title> and <desc> for their
    // accessible names.
    if (trimmed.includes("<svg")) inSvg = true;
    const wasInSvg = inSvg;
    if (trimmed.includes("</svg>")) inSvg = false;
    if (wasInSvg) return;

    // A backtick stuck to a tag is the giveaway: the author wrote Markdown code
    // syntax somewhere Markdown does not read it.
    if (trimmed.includes("`<")) {
      problems.push({
        line: index + 1,
        reason: "código con backticks",
        advice: "escríbelo como &lt;etiqueta&gt;",
        text: trimmed
      });
      return;
    }

    // Any other backtick here is the same mistake with a milder outcome: it
    // does not break the page, it just prints the backticks on it.
    if (trimmed.includes("`")) {
      problems.push({
        line: index + 1,
        reason: "backticks dentro de un bloque HTML",
        advice: "Markdown no los lee aquí: usa <code>…</code>",
        text: trimmed
      });
      return;
    }

    for (const [match, tag] of trimmed.matchAll(TAG)) {
      const name = tag.toLowerCase();
      // `</h1>` is the same heading as `<h1>`; report the line once.
      if (name === "h1" && match[1] === "/") continue;
      if (DANGEROUS.has(name)) {
        problems.push({
          line: index + 1,
          reason: `<${tag}> en vivo`,
          advice: "escríbelo como &lt;etiqueta&gt;",
          text: trimmed
        });
      } else if (name === "h1") {
        // The page title is already the only <h1>. A second one, which happens
        // inside a mockup of a browser window, joins the real document outline
        // and leaves the page with two top-level headings.
        problems.push({
          line: index + 1,
          reason: "<h1> en vivo: la página ya tiene el suyo",
          advice: 'si es una maqueta usa <p class="demo-title">; si lo estás citando, &lt;h1&gt;',
          text: trimmed
        });
      }
    }
  });

  return problems;
}

/**
 * A unit whose sections the loader cannot place. `splitUnit` reports them
 * rather than guessing, because guessing would move a section onto another
 * page without saying so.
 */
function scanShape(path) {
  if (!path.includes(`${sep}sessions${sep}`)) return [];
  const body = readFileSync(path, "utf8").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  return splitUnit(body).strays.map((stray) => ({
    line: stray.line,
    reason: `la sección "${stray.heading}" no es una sesión ni un divisor de semana`,
    text: `## ${stray.heading}`
  }));
}

let total = 0;
let strays = 0;

for (const path of markdownFiles(ROOT)) {
  for (const problem of scan(path)) {
    total += 1;
    const where = `${path.split(sep).join("/")}:${problem.line}`;
    console.error(`${where}\n  ${problem.reason} — ${problem.advice}`);
    console.error(`  ${problem.text.slice(0, 120)}\n`);
  }
  for (const problem of scanShape(path)) {
    strays += 1;
    const where = `${path.split(sep).join("/")}:${problem.line}`;
    console.error(`${where}\n  ${problem.reason}`);
    console.error(`  ${problem.text.slice(0, 120)}\n`);
  }
}

if (strays > 0) {
  console.error(
    `${strays} sección/es de nivel ## sin sitio dentro de su unidad.\n` +
      "Una unidad se publica como: introducción, sesiones (## Sesión N · Título),\n" +
      "divisores opcionales (## Semana N · …) y un cierre al final. Una sección\n" +
      "suelta entre dos sesiones acabaría dentro de la página equivocada."
  );
  process.exit(1);
}

if (total > 0) {
  console.error(
    `${total} problema(s) de marcado que el compilador no puede detectar.\n` +
      "Dentro de un bloque HTML, Markdown no lee nada: un `<head>` inserta la\n" +
      "etiqueta de verdad y un `código` imprime los backticks. Y ni los avisos\n" +
      "[!NOTE] de GitHub ni las fórmulas TeX tienen aquí quien los renderice."
  );
  process.exit(1);
}

console.log("Unidades revisadas: marcado limpio y todas las secciones ubicadas.");

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
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

import { splitUnit } from "../plugins/unit-split.mjs";

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
  let inFence = false;
  let inSvg = false;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Fenced code is shown verbatim and escaped by the compiler, so anything
    // inside it is fine however it is written.
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence;
      return;
    }
    if (inFence) return;

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
    `${total} etiqueta(s) HTML problemática(s) dentro de un bloque HTML.\n` +
      "Dentro de un bloque HTML los backticks no escapan nada: hay que escribir\n" +
      "&lt;head&gt; en lugar de `<head>`, o el navegador se come el resto de la página."
  );
  process.exit(1);
}

console.log("Unidades revisadas: sin tags HTML vivos y con todas las secciones ubicadas.");

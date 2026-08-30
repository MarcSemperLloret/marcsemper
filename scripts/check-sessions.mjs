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
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

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
      problems.push({ line: index + 1, reason: "código con backticks", text: trimmed });
      return;
    }

    for (const [, tag] of trimmed.matchAll(TAG)) {
      if (DANGEROUS.has(tag.toLowerCase())) {
        problems.push({ line: index + 1, reason: `<${tag}> en vivo`, text: trimmed });
      }
    }
  });

  return problems;
}

let total = 0;

for (const path of markdownFiles(ROOT)) {
  for (const problem of scan(path)) {
    total += 1;
    const where = `${path.split(sep).join("/")}:${problem.line}`;
    console.error(`${where}\n  ${problem.reason} — escríbelo como &lt;etiqueta&gt;`);
    console.error(`  ${problem.text.slice(0, 120)}\n`);
  }
}

if (total > 0) {
  console.error(
    `${total} etiqueta(s) HTML viva(s) dentro de un bloque HTML.\n` +
      "Dentro de un bloque HTML los backticks no escapan nada: hay que escribir\n" +
      "&lt;head&gt; en lugar de `<head>`, o el navegador se come el resto de la página."
  );
  process.exit(1);
}

console.log("Sesiones revisadas: ningún tag HTML vivo dentro de un bloque HTML.");

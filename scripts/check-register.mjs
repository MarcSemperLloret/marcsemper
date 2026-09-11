/**
 * Reports register defects in the session prose: the grammatical person drifting
 * between "tú", "vosotros" and the teacher's own "yo", and the colloquial or
 * conversational formulas that CLAUDE.md rules out.
 *
 * This one is advisory. Unlike check-sessions.mjs, nothing here breaks a page:
 * every hit is a judgement about how a sentence is written, and a rewrite is the
 * only fix. Run it to size the work and to check a file after rewriting it.
 *
 *   node scripts/check-register.mjs                 whole corpus, summary
 *   node scripts/check-register.mjs proyecto        only matching paths, with lines
 *   node scripts/check-register.mjs --strict        exit 1 if anything is found
 *
 * Code fences are stripped before scanning, so commands and YAML never count.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

const ROOT = "src/content/sessions";

/** Spanish needs its own boundaries: \b breaks on á, é, í, ó, ú and ñ. */
const L = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";
const w = (body) => new RegExp(`(?<![${L}])(?:${body})(?![${L}])`, "gi");

const IMPERATIVE_PL =
  "abrid|mirad|haced|poned|cread|leed|probad|dejad|copiad|coged|entrad|buscad|" +
  "comprobad|fijaos|volved|subid|escribid|pulsad|elegid|cambiad|revisad|apuntad|" +
  "contestad|anotad|recordad|usad|utilizad|esperad|repetid|borrad|añadid|quitad|" +
  "enviad|ejecutad|instalad|moved|guardad|seleccionad|acceded|tened|preguntad|daos|quedaos";

const RULES = [
  ["persona: vosotros", w(`vuestr[oa]s?|os|${IMPERATIVE_PL}`)],
  // Los numerales "seis", "dieciséis" y "veintiséis" terminan en -éis sin ser verbos.
  ["persona: vosotros", new RegExp(`(?<![${L}])(?!(?:dieci|veinti)?séis(?![${L}]))[${L}]+(?:áis|éis)(?![${L}])`, "g")],
  ["persona: yo del profesor", w("yo|miro|no cuento")],
  ["persona: yo del profesor", /\b(me f[ií]o|os (hago|pido|aviso|dejo|cuento)|no me lo he inventado)\b/gi],
  ["coloquialismo", w("da igual|no pasa nada|sale gratis|y ya está|de sobra|tal cual|un montón|se nota|a las prisas|media tarde|a ojo|sin más|de golpe")],
  ["coloquialismo", /\b(la tuber[ií]a|os pique|ni una m[áa]s|se come[n]? (una|media|dos)|el d[ií]a que hay prisa)\b/gi],
  ["revelación «no es X: es Y»", /no es (un|una|el|la|lo)[^.:;\n]{0,60}: es\b/gi],
  ["apertura conversacional", /(?:^|\. )(?:Y|Pero) [a-záéíóúñ]/gm],
  ["pregunta retórica autorrespondida", /\?\s+(Porque|No\.|S[ií]\.)/g],
];

const files = [];
for (const dir of readdirSync(ROOT)) {
  const d = join(ROOT, dir);
  if (!statSync(d).isDirectory()) continue;
  for (const f of readdirSync(d)) if (f.endsWith(".md")) files.push(join(d, f));
}

const args = process.argv.slice(2);
const strict = args.includes("--strict");
const filter = args.find((a) => !a.startsWith("--"));

let total = 0;
const rows = [];

for (const file of files) {
  const raw = readFileSync(file, "utf8");
  // Blank out fenced code so commands and YAML never register.
  const text = raw.replace(/^```[\s\S]*?^```/gm, (b) => b.replace(/[^\n]/g, " "));
  const lines = text.split("\n");

  const byRule = new Map();
  const samples = [];
  for (const [name, re] of RULES) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      byRule.set(name, (byRule.get(name) ?? 0) + 1);
      const line = text.slice(0, m.index).split("\n").length;
      if (samples.length < 400) samples.push({ name, line, text: lines[line - 1]?.trim() ?? "" });
      if (m[0].length === 0) re.lastIndex++;
    }
  }
  const n = [...byRule.values()].reduce((a, b) => a + b, 0);
  total += n;
  const words = text.split(/\s+/).length;
  rows.push({ file, n, words, byRule, samples });
}

const shown = rows.filter((r) => (filter ? r.file.split(sep).join("/").includes(filter) : true));
shown.sort((a, b) => b.n / b.words - a.n / a.words);

if (filter) {
  for (const r of shown) {
    if (!r.n) continue;
    console.log(`\n${r.file.split(sep).join("/")}  (${r.n} hallazgos)`);
    for (const s of r.samples) {
      const snippet = s.text.length > 96 ? `${s.text.slice(0, 96)}…` : s.text;
      console.log(`  ${String(s.line).padStart(4)}  ${s.name.padEnd(30)} ${snippet}`);
    }
  }
} else {
  console.log(`${"fichero".padEnd(60)} ${"palabras".padStart(8)} ${"hallazgos".padStart(9)} ${"por 10k".padStart(8)}`);
  for (const r of shown) {
    const rel = r.file.split(sep).join("/").replace(`${ROOT}/`, "");
    const per = ((r.n * 10000) / r.words).toFixed(1);
    console.log(`${rel.padEnd(60)} ${String(r.words).padStart(8)} ${String(r.n).padStart(9)} ${per.padStart(8)}`);
  }
}

console.log(`\n${total} hallazgos en ${rows.length} ficheros. Criterio: CLAUDE.md § Registro de las sesiones.`);
if (strict && total > 0) process.exit(1);

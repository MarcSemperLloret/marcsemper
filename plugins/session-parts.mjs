/**
 * Turns each top-level `##` section of a teaching session into a collapsible
 * <details>, so a unit of 1500 lines opens as a list of its sessions instead of
 * a wall of text.
 *
 * It runs at build time as a Sätteri hast plugin because the site ships no
 * client JavaScript (`script-src 'none'`), so the accordion has to be native
 * HTML and the contents rail has to be styled from the `[open]` state alone.
 *
 * A `##` heading whose section holds nothing but thematic breaks is a grouping
 * label ("## Semana 2 · Texto, listas, rutas y navegación"), not a session. It
 * stays a plain heading and is drawn as a divider in the reading column.
 *
 * The outline is written back into the frontmatter as `sessionOutline` so the
 * layout builds the rail from the same numbering the accordion uses, rather
 * than re-deriving it from the Markdown and drifting.
 */

/** Whitespace, comments and rules do not make a section worth collapsing. */
function isMeaningful(node) {
  if (node.type === "text") return node.value.trim() !== "";
  if (node.type === "comment") return false;
  if (node.type === "element") return node.tagName !== "hr";
  return true;
}

/**
 * Only teaching sessions get the accordion. Blog posts are single-topic and
 * short enough to read straight through.
 */
function isSession(ctx) {
  const path = ctx.fileURL ? decodeURI(ctx.fileURL.pathname) : "";
  return path.includes("/content/sessions/");
}

export function sessionParts() {
  return {
    name: "session-parts",
    element: {
      filter: ["h2"],
      visit(node, ctx) {
        if (!isSession(ctx)) return;

        const parent = ctx.parent(node);
        // Only headings that structure the document itself, never one that
        // happens to sit inside an aside or a figure.
        if (!parent || parent.type !== "root") return;

        const astro = ctx.data.astro;
        const outline = (astro.frontmatter.sessionOutline ??= []);

        const siblings = parent.children;
        const start = ctx.indexOf(node);
        const body = [];
        for (let i = start + 1; i < siblings.length; i += 1) {
          const sibling = siblings[i];
          if (sibling.type === "element" && sibling.tagName === "h2") break;
          body.push(sibling);
        }

        const text = ctx.textContent(node);

        if (!body.some(isMeaningful)) {
          ctx.setProperty(node, "className", ["session-part-group"]);
          outline.push({ text, group: true });
          return;
        }

        const part = outline.filter((item) => !item.group).length + 1;
        outline.push({ text, group: false, part });

        ctx.insertBefore(node, {
          type: "element",
          tagName: "details",
          properties: {
            className: ["session-part"],
            // Native exclusive accordion: opening a session closes the one
            // before it, so the page is never longer than one session.
            name: "session-part",
            dataPart: String(part),
            open: part === 1
          },
          children: [
            {
              type: "element",
              tagName: "summary",
              properties: { className: ["session-part-summary"] },
              // The heading keeps its own text, and therefore its id: the
              // slug is derived after this plugin runs and anchors already
              // published must not move.
              children: [structuredClone(node)]
            },
            {
              type: "element",
              tagName: "div",
              properties: { className: ["session-part-body"] },
              children: body.map((child) => structuredClone(child))
            }
          ]
        });

        // The originals are moved, not copied: the clones above are what the
        // serializer sees.
        for (const child of body) ctx.removeNode(child);
        ctx.removeNode(node);
      }
    }
  };
}

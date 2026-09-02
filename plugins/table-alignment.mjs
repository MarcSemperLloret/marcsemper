/**
 * Turns Markdown table column alignment into classes.
 *
 * A `| :---: |` column is compiled to `style="text-align: center"` on every
 * cell, and the site's Content-Security-Policy (`style-src 'self'`) drops
 * inline styles, so the alignment silently did nothing in production while
 * working perfectly in `astro dev`, where the policy is not emitted.
 *
 * The classes it maps onto already exist in global.css, and some units apply
 * them by hand for this very reason. Doing it here means a plain Markdown
 * table aligns correctly without the author thinking about the policy.
 */

const ALIGNMENTS = {
  left: "align-left",
  center: "align-center",
  right: "align-right"
};

export function tableAlignment() {
  return {
    name: "table-alignment",
    element: [
      {
        filter: ["table"],
        visit(node, ctx) {
          ctx.wrapNode(node, {
            type: "element",
            tagName: "div",
            properties: { className: ["table-scroll"] },
            children: []
          });
        }
      },
      {
        filter: ["th", "td"],
        visit(node, ctx) {
          const style = node.properties?.style;
          if (typeof style !== "string") return;

          const match = /text-align:\s*(left|center|right)/i.exec(style);
          if (!match) return;

          const existing = node.properties?.className;
          const classes = Array.isArray(existing)
            ? existing.slice()
            : typeof existing === "string" && existing
              ? existing.split(/\s+/)
              : [];
          classes.push(ALIGNMENTS[match[1].toLowerCase()]);

          ctx.setProperty(node, "className", classes);
          ctx.setProperty(node, "style", null);
        }
      }
    ]
  };
}

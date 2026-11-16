(() => {
  const lab = document.querySelector("[data-grid-lab]");
  if (!lab) return;

  const controls = lab.querySelector("[data-grid-controls]");
  const mode = addSelect("Columnas", [
    ["fit", "auto-fit"], ["fixed", "3 columnas fijas"], ["ratio", "2fr 1fr"], ["fill", "auto-fill"]
  ], "fit");
  const width = addSelect("Ancho máximo del ejemplo", [
    ["12", "12 rem"], ["20", "20 rem"], ["28", "28 rem"], ["36", "36 rem"]
  ], "36");
  const count = addSelect("Tarjetas", [["6", "6 tarjetas"], ["2", "2 tarjetas"]], "6");
  const track = lab.querySelector("[data-grid-track]");
  const code = lab.querySelector("[data-grid-code]");
  const status = lab.querySelector("[data-grid-status]");
  const templates = {
    fixed: "repeat(3, 1fr)",
    ratio: "2fr 1fr",
    fit: "repeat(auto-fit, minmax(min(100%, 8rem), 1fr))",
    fill: "repeat(auto-fill, minmax(min(100%, 8rem), 1fr))"
  };

  function addSelect(name, options, initial) {
    const label = document.createElement("label");
    const select = document.createElement("select");
    label.textContent = name;
    for (const [value, text] of options) select.add(new Option(text, value));
    select.value = initial;
    label.append(select);
    controls.append(label);
    return select;
  }

  function measure() {
    const columns = getComputedStyle(track).gridTemplateColumns
      .split(" ")
      .filter((size) => Number.parseFloat(size) > 0).length;
    const empty = Math.max(0, columns - Number(count.value));
    const tracks = columns === 1 ? "1 columna" : `${columns} columnas`;
    const vacant = empty === 1 ? " · 1 pista vacía" : ` · ${empty} pistas vacías`;
    const message = `${track.clientWidth} px de ancho disponible · ${tracks}${empty ? vacant : ""}`;
    if (status.textContent !== message) status.textContent = message;
  }

  function update() {
    track.className = `grid-lab-track grid-lab-${mode.value} grid-lab-width-${width.value}`;
    Array.from(track.children).forEach((card, index) => {
      card.hidden = index >= Number(count.value);
    });
    code.textContent = `.catalogo {
    display: grid;
    grid-template-columns: ${templates[mode.value]};
    gap: 0.75rem;
}`;
    measure();
  }

  controls.addEventListener("change", update);
  controls.hidden = false;
  update();
  new ResizeObserver(measure).observe(track);
})();

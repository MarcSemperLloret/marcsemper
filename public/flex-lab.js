/* Class-based states respect the site's CSP; the example also works as a
   static illustration when scripting is unavailable. */
(function () {
  "use strict";
  document.querySelectorAll("[data-flex-lab]").forEach(function (lab) {
    var controls = lab.querySelector("[data-lab-controls]");
    var track = lab.querySelector("[data-lab-track]");
    var code = lab.querySelector("[data-lab-code]");
    var status = lab.querySelector("[data-lab-status]");
    var fields = [
      ["direction", "Dirección", ["row", "column"]],
      ["justify", "Espacio en el eje principal", ["flex-start", "center", "flex-end", "space-between"]],
      ["align", "Alineación transversal", ["flex-start", "center", "flex-end", "stretch"]],
      ["wrap", "Salto de línea", ["nowrap", "wrap"]],
      ["width", "Ancho disponible", ["amplio", "estrecho"]]
    ];
    var selects = {};
    fields.forEach(function (field) {
      var label = document.createElement("label");
      label.appendChild(document.createTextNode(field[1]));
      var select = document.createElement("select");
      field[2].forEach(function (value) {
        var option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
      select.addEventListener("change", update);
      selects[field[0]] = select;
      label.appendChild(select);
      controls.appendChild(label);
    });
    function update() {
      var state = {};
      fields.forEach(function (field) { state[field[0]] = selects[field[0]].value; });
      track.className = "css-lab-track";
      fields.forEach(function (field) { track.classList.add("lab-" + field[0] + "-" + state[field[0]]); });
      code.textContent = ".menu {\n    display: flex;\n    flex-direction: " + state.direction + ";\n    justify-content: " + state.justify + ";\n    align-items: " + state.align + ";\n    flex-wrap: " + state.wrap + ";\n    gap: 1rem;\n}\n/* Ancho del ejemplo: " + (state.width === "estrecho" ? "14rem" : "100%") + ";\n   min-height: 16rem; box-sizing: border-box;\n   padding: 1rem; border: 2px solid;\n   Hijos: flex: 0 0 auto; padding: 0.6rem; */";
      status.textContent = state.direction === "row"
        ? "Fila: eje principal horizontal; eje transversal vertical."
        : "Columna: eje principal vertical; eje transversal horizontal.";
      status.textContent += state.wrap === "wrap"
        ? " Cada línea reparte su propio espacio."
        : " Sin saltos: si los hijos no caben, desbordan dentro del ejemplo.";
    }
    update();
  });
})();

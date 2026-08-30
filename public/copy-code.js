/**
 * Adds a copy button to every code block in a teaching session.
 *
 * This is the only script the site serves, and it is why the policy allows
 * `script-src 'self'` rather than 'none'. It is a progressive enhancement: if
 * it never runs, the page is exactly what it was, because the buttons only
 * exist once this has added them.
 *
 * It sets no inline styles — `style-src 'self'` would drop them — so every
 * state is a class defined in global.css.
 */
(function () {
  "use strict";

  var blocks = document.querySelectorAll(".session-content pre > code");
  if (blocks.length === 0) return;

  var english = document.documentElement.lang === "en";
  var IDLE = english ? "Copy" : "Copiar";
  var DONE = english ? "Copied" : "Copiado";
  var FAILED = english ? "Press Ctrl+C" : "Pulsa Ctrl+C";

  /** Reads the language off the `language-*` class Prism leaves behind. */
  function languageOf(code) {
    var match = /language-([a-z0-9]+)/i.exec(code.className || "");
    if (!match || match[1] === "text") return "";
    return match[1].toUpperCase();
  }

  /**
   * The clipboard API needs a secure context. Over https that is always the
   * case; a page opened straight from disk falls through to the rejection
   * path, which selects the code so the keyboard shortcut still works.
   */
  function writeToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return Promise.reject(new Error("clipboard unavailable"));
  }

  Array.prototype.forEach.call(blocks, function (code) {
    var pre = code.parentNode;
    if (!pre || pre.querySelector(".copy-code")) return;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "copy-code";
    button.textContent = IDLE;
    // Every block would otherwise be a button called "Copiar", and a session
    // has ninety of them.
    var language = languageOf(code);
    button.setAttribute(
      "aria-label",
      english
        ? language ? "Copy the " + language + " code" : "Copy the code"
        : language ? "Copiar el código " + language : "Copiar el código"
    );

    var timer;

    function settle(label, state) {
      button.textContent = label;
      button.classList.remove("is-copied", "is-failed");
      if (state) button.classList.add(state);

      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        button.textContent = IDLE;
        button.classList.remove("is-copied", "is-failed");
      }, 2000);
    }

    button.addEventListener("click", function () {
      writeToClipboard(code.textContent).then(
        function () {
          settle(DONE, "is-copied");
        },
        function () {
          // Leave the code selected so the keyboard shortcut still works.
          var selection = window.getSelection();
          if (selection) {
            var range = document.createRange();
            range.selectNodeContents(code);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          settle(FAILED, "is-failed");
        }
      );
    });

    pre.appendChild(button);
  });
})();

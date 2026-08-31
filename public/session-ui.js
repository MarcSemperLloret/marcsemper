/**
 * The two behaviours a page of teaching material adds on top of its markup: a
 * copy button on every code block, and keeping an opened panel in view.
 *
 * Both are progressive enhancements. If this never runs the page is exactly
 * what it was: the buttons only exist once this has added them, and the panels
 * are native <details> that open perfectly well on their own.
 *
 * It sets no inline styles — `style-src 'self'` would drop them — so every
 * state is a class defined in global.css.
 */
(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /*
     Opening a panel low on the screen used to leave its summary at the very
     bottom, with everything it just revealed below the fold. When the opened
     panel does not fit as it lies, its summary is brought up under the header;
     when it already fits, the page is left alone.

     The offset matches the `scroll-margin-top` the headings use, so an opened
     panel lands where an anchor jump would.
   */
  var HEADER = 96;

  Array.prototype.forEach.call(
    document.querySelectorAll(".session-content details"),
    function (panel) {
      panel.addEventListener("toggle", function () {
        if (!panel.open) return;
        var summary = panel.querySelector("summary") || panel;
        // `toggle` fires before the browser has laid the panel out again.
        window.requestAnimationFrame(function () {
          var top = summary.getBoundingClientRect().top;
          var bottom = panel.getBoundingClientRect().bottom;
          var fits = top >= HEADER && bottom <= window.innerHeight;
          if (fits) return;
          summary.scrollIntoView({
            block: "start",
            behavior: reduceMotion ? "auto" : "smooth"
          });
        });
      });
    }
  );

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

/**
 * Search over the teaching material, in the reader's browser.
 *
 * The site is static and serves no server, so the index is a JSON file fetched
 * the first time someone types. Everything here is progressive enhancement: the
 * form is hidden in the markup and only revealed once this file runs, so a
 * reader without JavaScript sees the course list rather than a dead box.
 */
(function () {
  "use strict";

  var root = document.querySelector("[data-teaching-search]");
  if (!root || !window.fetch) return;

  var form = root.querySelector("form");
  var input = root.querySelector("input[type=search]");
  var status = root.querySelector("[data-search-status]");
  var output = root.querySelector("[data-search-results]");
  var courses = {};
  try {
    courses = JSON.parse(root.getAttribute("data-courses") || "{}");
  } catch (error) {
    courses = {};
  }
  var only = root.getAttribute("data-course") || "";
  var text = JSON.parse(root.getAttribute("data-strings"));

  var index = null;
  var loading = null;

  /** Accents are optional when typing in a hurry, so neither side keeps them. */
  function fold(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function load() {
    if (loading) return loading;
    loading = fetch("/teaching-search.json")
      .then(function (response) {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then(function (data) {
        index = data
          .filter(function (entry) {
            return !only || entry.c === only;
          })
          .map(function (entry) {
            entry._t = fold(entry.l + " " + entry.t);
            entry._h = fold((entry.p || "") + " " + (entry.h || ""));
            return entry;
          });
        return index;
      });
    return loading;
  }

  /**
   * Every word typed has to appear somewhere in the entry. A word found in the
   * title counts for more than one found in a heading, so "grid" puts the
   * session called Grid above the sessions that merely mention it.
   */
  function search(query) {
    var words = fold(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];

    var hits = [];
    for (var i = 0; i < index.length; i += 1) {
      var entry = index[i];
      var score = 0;
      var matchedAll = true;
      for (var w = 0; w < words.length; w += 1) {
        if (entry._t.indexOf(words[w]) >= 0) score += 4;
        else if (entry._h.indexOf(words[w]) >= 0) score += 1;
        else {
          matchedAll = false;
          break;
        }
      }
      if (matchedAll) hits.push({ entry: entry, score: score });
    }

    hits.sort(function (a, b) {
      return b.score - a.score;
    });
    return hits.slice(0, 20);
  }

  function subtitle(entry) {
    var parts = [];
    if (entry.p) parts.push(entry.p);
    if (courses[entry.c]) parts.push(courses[entry.c]);
    return parts.join(" · ");
  }

  function render(hits, query) {
    output.textContent = "";
    if (hits.length === 0) {
      status.textContent = text.none.replace("%s", query);
      return;
    }
    status.textContent =
      hits.length === 1 ? text.one : text.many.replace("%s", String(hits.length));

    var list = document.createElement("ol");
    list.className = "search-results";
    hits.forEach(function (hit) {
      var entry = hit.entry;
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.href = entry.u;

      var label = document.createElement("span");
      label.className = "search-label";
      label.textContent = entry.l;

      var title = document.createElement("span");
      title.className = "search-title";
      title.textContent = entry.t;

      var where = document.createElement("small");
      where.textContent = subtitle(entry);

      var body = document.createElement("span");
      body.className = "search-body";
      body.appendChild(title);
      body.appendChild(where);

      link.appendChild(label);
      link.appendChild(body);
      item.appendChild(link);
      list.appendChild(item);
    });
    output.appendChild(list);
  }

  var pending;
  function update() {
    var query = input.value.trim();
    if (query.length < 2) {
      output.textContent = "";
      status.textContent = "";
      return;
    }
    status.textContent = text.searching;
    load()
      .then(function () {
        // The reader kept typing while the index was in flight.
        if (input.value.trim() !== query) return;
        render(search(query), query);
      })
      .catch(function () {
        status.textContent = text.failed;
      });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    update();
  });

  input.addEventListener("input", function () {
    window.clearTimeout(pending);
    pending = window.setTimeout(update, 120);
  });

  // Warm the index on first focus so the first keystroke already has it.
  input.addEventListener("focus", load, { once: true });

  root.hidden = false;
})();

(function () {
  "use strict";

  var data = window.TXSWAP_RELEASES;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  var longDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  function parseDate(iso) {
    // "2026-10-03" seul serait lu en UTC : midi évite de changer de jour.
    return new Date(iso.length === 10 ? iso + "T12:00:00" : iso);
  }

  function megabytes(bytes) {
    return Math.round(bytes / 1048576) + " Mo";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Dernière version : API GitHub, repli statique ---------- */

  function applyLatest(rel) {
    var apkUrl = "https://github.com/" + data.repo + "/releases/download/v" + rel.version + "/" + rel.file;
    var values = {
      version: "v" + rel.version,
      date: longDate.format(parseDate(rel.date)),
      size: megabytes(rel.size),
      file: rel.file,
      sha: rel.sha256,
    };
    Object.keys(values).forEach(function (key) {
      document.querySelectorAll('[data-latest="' + key + '"]').forEach(function (el) {
        el.textContent = values[key];
      });
    });
    document.querySelectorAll('[data-latest="apk"]').forEach(function (el) {
      el.href = apkUrl;
    });
    document.querySelectorAll("[data-latest-value]").forEach(function (el) {
      if (!el.dataset.touched) el.value = values.version;
    });
  }

  function fromApi(release) {
    var apk = (release.assets || []).filter(function (a) {
      return /\.apk$/i.test(a.name);
    })[0];
    if (!apk) return null;
    var sha = (apk.digest || "").replace(/^sha256:/, "");
    return {
      version: release.tag_name.replace(/^v/, ""),
      date: release.published_at,
      file: apk.name,
      size: apk.size,
      sha256: sha || null,
      url: release.html_url,
    };
  }

  function loadReleases() {
    return fetch("https://api.github.com/repos/" + data.repo + "/releases?per_page=20", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then(function (res) {
        if (!res.ok) throw new Error("GitHub " + res.status);
        return res.json();
      })
      .then(function (list) {
        return list
          .filter(function (r) { return !r.draft && !r.prerelease; })
          .map(fromApi)
          .filter(Boolean);
      });
  }

  /* ---------- Journal des versions ---------- */

  var kinds = { new: "Nouveau", better: "Amélioré", fix: "Corrigé" };

  function renderChangelog(published) {
    var root = document.querySelector("[data-changelog]");
    if (!root) return;

    var known = {};
    data.changelog.forEach(function (e) { known[e.version] = true; });

    // Une version publiée sur GitHub mais pas encore décrite ici.
    var extra = (published || [])
      .filter(function (r) { return !known[r.version]; })
      .map(function (r) {
        return { version: r.version, date: r.date, title: null, items: [], url: r.url };
      });

    var entries = extra.concat(data.changelog);
    var latest = published && published.length ? published[0].version : data.fallback.version;

    root.innerHTML = entries.map(function (e) {
      var items = e.items.length
        ? '<ul class="cl-items">' + e.items.map(function (it) {
            return '<li><span class="cl-kind cl-' + it[0] + ' mono">' + kinds[it[0]] + "</span>" + escapeHtml(it[1]) + "</li>";
          }).join("") + "</ul>"
        : '<p class="cl-pending">Les notes de cette version sont sur <a href="' + escapeHtml(e.url) + '" rel="noopener">GitHub</a>.</p>';
      return (
        '<article class="cl-entry reveal">' +
          '<header class="cl-head">' +
            '<h3 class="cl-version mono">v' + escapeHtml(e.version) + "</h3>" +
            (e.version === latest ? '<span class="cl-latest mono">Dernière</span>' : "") +
            '<time class="mono" datetime="' + escapeHtml(e.date.slice(0, 10)) + '">' + longDate.format(parseDate(e.date)) + "</time>" +
          "</header>" +
          (e.title ? '<p class="cl-title">' + escapeHtml(e.title) + "</p>" : "") +
          items +
        "</article>"
      );
    }).join("");

    observeReveals(root);
  }

  /* ---------- Le grand livre du hero ---------- */

  function setupLedger() {
    var ledger = document.querySelector(".ledger");
    if (!ledger) return;
    var gapEl = ledger.querySelector("[data-gap]");

    function total(side) {
      var sum = 0;
      ledger.querySelectorAll('[data-side="' + side + '"] input:checked').forEach(function (i) {
        sum += Math.round(parseFloat(i.dataset.v) * 100);
      });
      return sum;
    }

    function update() {
      var me = total("me");
      var them = total("them");
      ledger.querySelector('[data-total="me"]').textContent = euro.format(me / 100);
      ledger.querySelector('[data-total="them"]').textContent = euro.format(them / 100);
      var gap = them - me;
      if (gap === 0) {
        gapEl.textContent = "Équilibré";
      } else {
        gapEl.textContent = "+" + euro.format(Math.abs(gap) / 100) + " côté " + (gap > 0 ? "Camille" : "Moi");
      }
      gapEl.classList.toggle("is-even", gap === 0);
      if (!reduceMotion) {
        gapEl.classList.remove("bump");
        void gapEl.offsetWidth;
        gapEl.classList.add("bump");
      }
    }

    ledger.addEventListener("change", update);
  }

  /* ---------- Copier ---------- */

  function setupCopy() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.dataset.copy;
        var src = document.querySelector('[data-latest="' + key + '"]') || document.querySelector('[data-copy-src="' + key + '"]');
        if (!src || !navigator.clipboard) return;
        navigator.clipboard.writeText(src.textContent.trim()).then(function () {
          var label = btn.textContent;
          btn.textContent = "Copié";
          btn.classList.add("is-done");
          setTimeout(function () {
            btn.textContent = label;
            btn.classList.remove("is-done");
          }, 1600);
        });
      });
    });
  }

  /* ---------- Agrandir une capture ---------- */

  function setupLightbox() {
    var dialog = document.querySelector(".lightbox");
    if (!dialog || typeof dialog.showModal !== "function") return;
    var big = dialog.querySelector("img");

    document.querySelectorAll("[data-zoom]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        big.src = img.currentSrc || img.src;
        big.alt = img.alt;
        dialog.showModal();
      });
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest(".lightbox-close")) dialog.close();
    });
  }

  /* ---------- Formulaire de contact → ticket GitHub pré-rempli ---------- */

  // Un modèle par type (.github/ISSUE_TEMPLATE) : c'est lui qui pose
  // l'étiquette, le paramètre `labels` n'étant appliqué qu'aux membres du dépôt.
  var issueKinds = {
    bug: { template: "bug.md", prefix: "[Bug] ", label: "Bug" },
    reconnaissance: { template: "reconnaissance.md", prefix: "[Reconnaissance] ", label: "Carte mal reconnue" },
    idee: { template: "idee.md", prefix: "[Idée] ", label: "Idée" },
    question: { template: "question.md", prefix: "[Question] ", label: "Question" },
  };

  function setupIssueForm() {
    var form = document.querySelector("[data-issue-form]");
    if (!form) return;
    var errorEl = form.querySelector("[data-form-error]");

    form.querySelectorAll("[data-latest-value]").forEach(function (el) {
      el.addEventListener("input", function () { el.dataset.touched = "1"; });
    });

    function syncKind() {
      var kind = form.elements.kind.value;
      form.querySelectorAll("[data-only]").forEach(function (el) { el.hidden = el.dataset.only !== kind; });
      form.querySelectorAll("[data-hide]").forEach(function (el) { el.hidden = el.dataset.hide === kind; });
    }
    form.addEventListener("change", function (e) {
      if (e.target.name === "kind") syncKind();
    });
    syncKind();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var kind = issueKinds[f.kind.value];
      var title = f.title.value.trim();
      var description = f.body.value.trim();

      var missing = !title ? f.title : !description ? f.body : null;
      if (missing) {
        errorEl.textContent = !title ? "Ajoute un résumé en une ligne." : "Décris le problème ou l'idée en quelques mots.";
        errorEl.hidden = false;
        missing.focus();
        return;
      }
      errorEl.hidden = true;

      var lines = ["**Type** : " + kind.label];
      if (f.kind.value !== "idee") {
        lines.push("**Version de l'app** : " + (f.version.value.trim() || "?"));
        lines.push("**Téléphone et Android** : " + (f.device.value.trim() || "?"));
      }
      if (f.kind.value === "reconnaissance") {
        lines.push("**Carte concernée** : " + (f.card.value.trim() || "?"));
      }
      lines.push("", "### Description", "", description, "", "---", "_Préparé depuis le site txSwap._");

      var url = "https://github.com/" + data.repo + "/issues/new" +
        "?template=" + encodeURIComponent(kind.template) +
        "&title=" + encodeURIComponent(kind.prefix + title) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  /* ---------- Apparition au défilement ---------- */

  // Le masquage initial (.js .reveal) est posé par le script du <head>.
  var io = null;
  if (!reduceMotion && "IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  }

  function observeReveals(scope) {
    scope.querySelectorAll(".reveal:not(.is-in)").forEach(function (el) {
      if (io) io.observe(el);
      else el.classList.add("is-in");
    });
  }

  /* ---------- Démarrage ---------- */

  applyLatest(data.fallback);
  renderChangelog(null);
  setupLedger();
  setupCopy();
  setupLightbox();
  setupIssueForm();
  observeReveals(document);

  loadReleases()
    .then(function (published) {
      if (!published.length) return;
      var latest = published[0];
      if (!latest.sha256) {
        latest.sha256 = latest.version === data.fallback.version ? data.fallback.sha256 : "voir la page de la version sur GitHub";
      }
      applyLatest(latest);
      renderChangelog(published);
    })
    .catch(function () {
      // Hors-ligne ou quota atteint : la version de repli est déjà affichée.
    });
})();

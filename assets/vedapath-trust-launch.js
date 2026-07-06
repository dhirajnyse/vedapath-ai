(function () {
  const app = document.querySelector("[data-trust-launch-app]");
  if (!app) return;

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function slug(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function chip(value) {
    return '<span class="tl-chip ' + slug(value) + '">' + escapeHtml(value) + '</span>';
  }

  function metricGrid(metrics) {
    return '<div class="tl-metrics">' + metrics.map(function (metric) {
      return '<div class="tl-field"><span>' + escapeHtml(metric.label) + '</span><strong>' + escapeHtml(metric.value) + '</strong></div>';
    }).join("") + '</div>';
  }

  function renderShell(left, main, side) {
    app.innerHTML = '<section class="tl-grid"><aside class="tl-panel">' + left + '</aside><main class="tl-main">' + main + '</main><aside class="tl-panel">' + side + '</aside></section>';
  }

  function recordPacket(record) {
    return [
      "VedaPath Citation Packet",
      "Link id: " + record.linkId,
      "Citation: " + record.citation,
      "Family: " + record.family,
      "Anchor: #" + record.passageAnchor,
      "Status: " + record.status,
      "Rights: " + record.rights,
      "Boundary: " + record.boundary
    ].join("\n");
  }

  function renderRecord(record) {
    return '<article class="tl-card tl-record" id="' + escapeHtml(record.passageAnchor || record.id) + '">' +
      chip(record.status) + '<h3>' + escapeHtml(record.title) + '</h3>' +
      '<p><strong>' + escapeHtml(record.citation) + '</strong> | ' + escapeHtml(record.family) + '</p>' +
      '<p>' + escapeHtml(record.summary) + '</p>' +
      '<div class="tl-fields"><div class="tl-field"><span>Link id</span><strong>' + escapeHtml(record.linkId || record.id) + '</strong></div>' +
      '<div class="tl-field"><span>Rights</span><strong>' + escapeHtml(record.rights || "unknown") + '</strong></div>' +
      '<div class="tl-field"><span>Confidence</span><strong>' + escapeHtml(record.confidence || "unknown") + '</strong></div>' +
      '<div class="tl-field"><span>Boundary</span><strong>' + escapeHtml(record.boundary || "Do not overclaim.") + '</strong></div></div>' +
    '</article>';
  }

  function renderLinks(data) {
    let selectedId = data.records[0].id;
    function selected() {
      return data.records.find(function (record) { return record.id === selectedId; }) || data.records[0];
    }
    function paint() {
      const record = selected();
      const left = '<span class="tl-eyebrow">Citation anchors</span><h2>Pick a source</h2><div class="tl-list">' +
        data.records.map(function (item) {
          return '<button class="tl-button' + (item.id === selectedId ? " is-active" : "") + '" data-record="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.citation) + '</button>';
        }).join("") + '</div>';
      const main = '<article class="tl-card"><span class="tl-eyebrow green">Deep link layer</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        renderRecord(record) +
        '<article class="tl-card"><span class="tl-eyebrow">Copyable packet</span><textarea class="tl-textarea" readonly>' + escapeHtml(recordPacket(record)) + '</textarea><div class="tl-actions"><button class="tl-button primary" data-copy type="button">Copy Citation Packet</button><a class="tl-button green" href="#' + escapeHtml(record.passageAnchor) + '">Jump To Anchor</a></div></article>';
      const side = '<span class="tl-eyebrow green">Rules</span><h2>Link discipline</h2><div class="tl-stack">' +
        data.linkRules.map(function (rule, index) {
          return '<article class="tl-step"><span class="tl-number">' + (index + 1) + '</span><h3>' + escapeHtml(rule.title) + '</h3><p>' + escapeHtml(rule.copy) + '</p></article>';
        }).join("") + '</div><article class="tl-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-record]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-record");
          paint();
        });
      });
    }
    paint();
  }

  function renderRights(data) {
    const left = '<span class="tl-eyebrow">Rights lanes</span><h2>Before public use</h2><div class="tl-list">' +
      data.lanes.map(function (lane) {
        return '<article class="tl-step">' + chip(lane.status) + '<h3>' + escapeHtml(lane.lane) + '</h3><p>' + escapeHtml(lane.use) + '</p></article>';
      }).join("") + '</div>';
    const rows = data.records.map(function (record) {
      return '<div class="tl-table-row"><strong>' + escapeHtml(record.citation) + '</strong><span>' + escapeHtml(record.family) + '</span><span>' + chip(record.rights) + '</span><span>' + escapeHtml((record.missingFields || []).join(", ") || "None") + '</span></div>';
    }).join("");
    const main = '<article class="tl-card"><span class="tl-eyebrow green">Rights matrix</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
      '<div class="tl-table"><div class="tl-table-row tl-table-head"><span>Citation</span><span>Family</span><span>Rights</span><span>Missing</span></div>' + rows + '</div>';
    const side = '<span class="tl-eyebrow green">Checklist</span><h2>Release discipline</h2><div class="tl-stack">' +
      data.checklist.map(function (item, index) {
        return '<article class="tl-step"><span class="tl-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="tl-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
    renderShell(left, main, side);
  }

  function renderHistory(data) {
    const storageKey = "vedapathReviewerDecisionHistoryV417";
    let filter = "all";
    function saved() {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    }
    function entries() {
      const all = data.decisions.concat(saved());
      return filter === "all" ? all : all.filter(function (item) { return item.status === filter; });
    }
    function exportText(items) {
      return items.map(function (item) {
        return [item.id, item.status, item.owner, item.citation, item.decision, item.risk, item.next].join(" | ");
      }).join("\n");
    }
    function paint() {
      const items = entries();
      const left = '<span class="tl-eyebrow">Decision filters</span><h2>Review trail</h2><div class="tl-list">' +
        data.filters.map(function (item) {
          return '<button class="tl-button' + (item === filter ? " is-active" : "") + '" data-filter="' + escapeHtml(item) + '" type="button">' + escapeHtml(item) + '</button>';
        }).join("") + '</div><button class="tl-button green" data-add-local type="button">Add Local Review Note</button>';
      const main = '<article class="tl-card"><span class="tl-eyebrow green">Reviewer memory</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        '<div class="tl-stack">' + items.map(function (item) {
          return '<article class="tl-card tl-record">' + chip(item.status) + '<h3>' + escapeHtml(item.citation) + '</h3><p><strong>' + escapeHtml(item.owner) + '</strong> | ' + escapeHtml(item.decision) + '</p><p>Risk: ' + escapeHtml(item.risk) + '</p><p>Next: ' + escapeHtml(item.next) + '</p></article>';
        }).join("") + '</div>';
      const side = '<span class="tl-eyebrow green">Export</span><h2>Visible audit</h2><textarea class="tl-textarea" readonly>' + escapeHtml(exportText(items)) + '</textarea><div class="tl-actions"><button class="tl-button primary" data-copy type="button">Copy History</button></div><article class="tl-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-filter]").forEach(function (button) {
        button.addEventListener("click", function () {
          filter = button.getAttribute("data-filter");
          paint();
        });
      });
      app.querySelector("[data-add-local]")?.addEventListener("click", function () {
        const local = saved();
        const next = {
          id: "local-review-" + Date.now(),
          status: "needs-edition",
          owner: "Local reviewer",
          citation: "Bhagavad Gita 2.48",
          decision: "Add source edition note before pilot use.",
          risk: "Rights posture incomplete.",
          next: "Review edition field."
        };
        localStorage.setItem(storageKey, JSON.stringify([next].concat(local).slice(0, 8)));
        paint();
      });
    }
    paint();
  }

  function renderScore(data) {
    let selectedId = data.candidates[0].id;
    function selected() {
      return data.candidates.find(function (item) { return item.id === selectedId; }) || data.candidates[0];
    }
    function factorHtml(candidate) {
      return '<div class="tl-score-grid">' + candidate.factors.map(function (factor) {
        return '<div class="tl-field tl-score-factor"><span>' + escapeHtml(factor.label) + '</span><strong>' + escapeHtml(factor.value) + '</strong><div class="tl-progress"><span style="width:' + Math.max(0, Math.min(100, factor.value)) + '%"></span></div></div>';
      }).join("") + '</div>';
    }
    function paint() {
      const candidate = selected();
      const left = '<span class="tl-eyebrow">Candidate rank</span><h2>Query</h2><p>' + escapeHtml(data.query) + '</p><div class="tl-list">' +
        data.candidates.map(function (item) {
          return '<button class="tl-button' + (item.id === selectedId ? " is-active" : "") + '" data-score="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.citation) + ' | ' + escapeHtml(item.score) + '</button>';
        }).join("") + '</div>';
      const main = '<article class="tl-card"><span class="tl-eyebrow green">Score explanation</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        '<article class="tl-card tl-score-card"><h2>' + escapeHtml(candidate.title) + '</h2><p><strong>' + escapeHtml(candidate.citation) + '</strong> | ' + escapeHtml(candidate.family) + '</p><div class="tl-fields"><div class="tl-field"><span>Total score</span><strong>' + escapeHtml(candidate.score) + '</strong></div><div class="tl-field"><span>Decision</span><strong>' + escapeHtml(candidate.decision) + '</strong></div></div>' + factorHtml(candidate) + '</article>';
      const side = '<span class="tl-eyebrow green">Boundary</span><h2>Score is not truth</h2><p>' + escapeHtml(data.boundary) + '</p><article class="tl-card"><h3>Next</h3><p>Use this explanation beside learner answers before live retrieval ranking exists.</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-score]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-score");
          paint();
        });
      });
    }
    paint();
  }

  function renderWaitlist(data) {
    const storageKey = "vedapathPublicPilotWaitlistV419";
    let selected = data.segments[0].id;
    function saved() {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    }
    function selectedSegment() {
      return data.segments.find(function (item) { return item.id === selected; }) || data.segments[0];
    }
    function paint() {
      const entries = saved();
      const segment = selectedSegment();
      const left = '<span class="tl-eyebrow">Pilot fit</span><h2>Choose a lane</h2><div class="tl-list">' +
        data.segments.map(function (item) {
          return '<button class="tl-button' + (item.id === selected ? " is-active" : "") + '" data-segment="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.label) + '</button>';
        }).join("") + '</div>';
      const main = '<article class="tl-card"><span class="tl-eyebrow green">Waitlist gate</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        '<article class="tl-card"><h2>' + escapeHtml(segment.label) + '</h2><p>' + escapeHtml(segment.need) + '</p><label><span class="tl-muted">One line about your pilot need</span><textarea class="tl-textarea" data-wait-note>I want VedaPath to help me ask one source-first question calmly.</textarea></label><div class="tl-actions"><button class="tl-button primary" data-save-waitlist type="button">Save Local Interest</button><button class="tl-button green" data-copy-packet type="button">Copy Pilot Packet</button></div></article>' +
        '<article class="tl-card"><span class="tl-eyebrow">Local preview</span><h2>' + entries.length + ' saved interest note' + (entries.length === 1 ? "" : "s") + '</h2><p>' + (entries[0] ? escapeHtml(entries[0].segment + " | " + entries[0].note) : "No local pilot interest saved yet.") + '</p></article>';
      const side = '<span class="tl-eyebrow green">Entry rules</span><h2>Public pilot boundary</h2><div class="tl-stack">' +
        data.gates.map(function (gate, index) {
          return '<article class="tl-step"><span class="tl-number">' + (index + 1) + '</span><h3>' + escapeHtml(gate.title) + '</h3><p>' + escapeHtml(gate.copy) + '</p></article>';
        }).join("") + '</div><article class="tl-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-segment]").forEach(function (button) {
        button.addEventListener("click", function () {
          selected = button.getAttribute("data-segment");
          paint();
        });
      });
      app.querySelector("[data-save-waitlist]")?.addEventListener("click", function () {
        const note = app.querySelector("[data-wait-note]")?.value || "";
        const next = { segment: selectedSegment().label, note: note, date: new Date().toISOString() };
        localStorage.setItem(storageKey, JSON.stringify([next].concat(entries).slice(0, 5)));
        paint();
      });
      app.querySelector("[data-copy-packet]")?.addEventListener("click", function () {
        const note = app.querySelector("[data-wait-note]")?.value || "";
        const packet = "VedaPath Public Pilot Interest\nSegment: " + selectedSegment().label + "\nNeed: " + selectedSegment().need + "\nNote: " + note + "\nBoundary: " + data.boundary;
        navigator.clipboard?.writeText(packet);
      });
    }
    paint();
  }

  const renderers = {
    links: renderLinks,
    rights: renderRights,
    history: renderHistory,
    score: renderScore,
    waitlist: renderWaitlist
  };

  fetch(app.getAttribute("data-data-file"))
    .then(function (response) {
      if (!response.ok) throw new Error("Unable to load page data");
      return response.json();
    })
    .then(function (data) {
      const renderer = renderers[app.getAttribute("data-kind")];
      if (!renderer) throw new Error("Unknown trust launch surface");
      renderer(data);
      app.addEventListener("click", function (event) {
        if (!event.target.matches("[data-copy]")) return;
        const text = app.querySelector("textarea")?.value || "";
        navigator.clipboard?.writeText(text);
      });
    })
    .catch(function (error) {
      app.innerHTML = '<div class="tl-empty">Unable to load this trust launch surface: ' + escapeHtml(error.message) + '</div>';
    });
})();

(function () {
  const app = document.querySelector("[data-retrieval-app]");
  if (!app) return;

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function statusClass(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function chip(value, extra) {
    return '<span class="rp-status ' + statusClass(value) + (extra ? " " + extra : "") + '">' + escapeHtml(value) + '</span>';
  }

  function metricGrid(metrics) {
    return '<div class="rp-metrics">' + metrics.map(function (metric) {
      return '<div class="rp-metric"><span>' + escapeHtml(metric.label) + '</span><strong>' + escapeHtml(metric.value) + '</strong></div>';
    }).join("") + '</div>';
  }

  function flowSteps(items) {
    return '<div class="rp-flow-grid">' + items.map(function (item, index) {
      return '<article class="rp-flow-step"><span class="rp-number">' + (index + 1) + '</span><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.copy) + '</p></article>';
    }).join("") + '</div>';
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (_) {
        // Fall through so local HTTP demos still have a copy path.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.inset = "0 auto auto -9999px";
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } finally {
      textarea.remove();
    }
    return copied;
  }

  function showCopyResult(button, copied) {
    const originalLabel = button.getAttribute("data-label") || button.textContent;
    button.setAttribute("data-label", originalLabel);
    button.textContent = copied ? "Copied" : "Press Ctrl+C";
    button.setAttribute("aria-label", copied ? "Gate packet copied" : "Gate packet selected; press Control C to copy");
    window.setTimeout(function () {
      button.textContent = originalLabel;
      button.setAttribute("aria-label", originalLabel);
    }, 1800);
  }

  function recordCard(record) {
    return '<article class="rp-record" data-record-id="' + escapeHtml(record.id) + '">' +
      '<div class="rp-record-meta">' +
      '<div>' + chip(record.status) + '</div>' +
      '<h3>' + escapeHtml(record.title) + '</h3>' +
      '<p><strong>' + escapeHtml(record.citation) + '</strong> &middot; ' + escapeHtml(record.family) + '</p>' +
      '<p>' + escapeHtml(record.summary) + '</p>' +
      '</div>' +
      '<div class="rp-field-grid">' +
      '<div class="rp-field"><span>Confidence</span><strong>' + escapeHtml(record.confidence) + '</strong></div>' +
      '<div class="rp-field"><span>Boundary</span><strong>' + escapeHtml(record.boundary) + '</strong></div>' +
      '<div class="rp-field"><span>Missing</span><strong>' + escapeHtml((record.missingFields || []).join(", ")) + '</strong></div>' +
      '</div>' +
    '</article>';
  }

  function renderShell(left, main, side) {
    app.innerHTML = '<section class="rp-grid"><aside class="rp-panel">' + left + '</aside><main class="rp-main">' + main + '</main><aside class="rp-panel">' + side + '</aside></section>';
  }

  function renderGate(data) {
    const labels = {
      posture: "Gate posture",
      posture_question: "What may open?",
      main: "Production gate",
      decision: "Decision matrix",
      packet: "Founder packet",
      pulse: "Pilot pulse",
      copy: "Copy Gate Packet",
      ...(data.labels || {})
    };
    const action = data.primary_action || { href: "verifiedsourcerecordschema.html", label: "Open Records" };
    const left = '<span class="rp-eyebrow">' + escapeHtml(labels.posture) + '</span><h2>' + escapeHtml(labels.posture_question) + '</h2><p>' + escapeHtml(data.position) + '</p>' +
      '<div class="rp-rail-list">' + data.postures.map(function (item) {
        return '<article class="rp-rail-card">' + chip(item.decision, item.decision === "Allowed" ? "allowed" : "") + '<h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.copy) + '</p></article>';
      }).join("") + '</div>';

    const main = '<article class="rp-card"><span class="rp-eyebrow">' + escapeHtml(labels.main) + '</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' +
      flowSteps(data.flow) + '</article>' +
      '<article class="rp-card"><span class="rp-eyebrow green">' + escapeHtml(labels.decision) + '</span><div class="rp-decision-grid">' +
      data.decisions.map(function (item) {
        return '<div class="rp-field"><span>' + escapeHtml(item.label) + '</span><strong>' + escapeHtml(item.value) + '</strong><p>' + escapeHtml(item.reason) + '</p></div>';
      }).join("") + '</div></article>' +
      '<article class="rp-card"><span class="rp-eyebrow">' + escapeHtml(labels.packet) + '</span><textarea class="rp-textarea" readonly>' + escapeHtml(data.packet) + '</textarea><div class="rp-actions"><button class="rp-button primary" data-copy-packet type="button">' + escapeHtml(labels.copy) + '</button><a class="rp-button green" href="' + escapeHtml(action.href) + '">' + escapeHtml(action.label) + '</a></div></article>';

    const side = '<span class="rp-eyebrow green">Readiness</span><h2>' + escapeHtml(labels.pulse) + '</h2>' + metricGrid(data.metrics) + '<div class="rp-stack">' +
      data.locks.map(function (item) {
        return '<article class="rp-rail-card"><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.copy) + '</p></article>';
      }).join("") + '</div>';
    renderShell(left, main, side);
  }

  function renderSchema(data) {
    const left = '<span class="rp-eyebrow">Schema lanes</span><h2>Minimum fields</h2><div class="rp-rail-list">' +
      data.fields.map(function (field, index) {
        return '<article class="rp-rail-card"><span class="rp-number">' + (index + 1) + '</span><h3>' + escapeHtml(field.name) + '</h3><p>' + escapeHtml(field.why) + '</p></article>';
      }).join("") + '</div>';

    const main = '<article class="rp-card"><span class="rp-eyebrow green">Record contract</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' +
      '<div class="rp-field-grid">' + data.required.map(function (item) {
        return '<div class="rp-field"><span>' + escapeHtml(item.key) + '</span><strong>' + escapeHtml(item.value) + '</strong></div>';
      }).join("") + '</div></article>' +
      '<article class="rp-card"><span class="rp-eyebrow">Sample source records</span><div class="rp-record-grid">' +
      data.records.slice(0, 6).map(recordCard).join("") + '</div></article>' +
      '<article class="rp-card"><span class="rp-eyebrow">JSON contract</span><textarea class="rp-textarea" readonly>' + escapeHtml(JSON.stringify(data.example, null, 2)) + '</textarea></article>';

    const side = '<span class="rp-eyebrow green">Quality</span><h2>Schema pulse</h2>' + metricGrid(data.metrics) +
      '<div class="rp-stack">' + data.rules.map(function (rule) {
        return '<article class="rp-rail-card"><h3>' + escapeHtml(rule.title) + '</h3><p>' + escapeHtml(rule.copy) + '</p></article>';
      }).join("") + '</div>';
    renderShell(left, main, side);
  }

  function renderDesk(data) {
    let selectedId = data.candidates[0].id;
    function selected() {
      return data.candidates.find(function (item) { return item.id === selectedId; }) || data.candidates[0];
    }
    function paint() {
      const candidate = selected();
      const left = '<span class="rp-eyebrow">Reviewer queue</span><h2>Candidate matches</h2><div class="rp-rail-list">' +
        data.candidates.map(function (item) {
          const pressed = item.id === selectedId ? ' aria-pressed="true"' : "";
          return '<button class="rp-button" data-candidate="' + escapeHtml(item.id) + '"' + pressed + ' type="button">' + escapeHtml(item.title) + '<br><span>' + escapeHtml(item.citation) + '</span></button>';
        }).join("") + '</div>';
      const main = '<article class="rp-card"><span class="rp-eyebrow">Review before answer</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        '<article class="rp-card"><span class="rp-eyebrow green">Selected candidate</span>' + recordCard(candidate.record) + '<div class="rp-field-grid">' +
        '<div class="rp-field"><span>Match score</span><strong>' + escapeHtml(candidate.score) + '</strong></div>' +
        '<div class="rp-field"><span>Why matched</span><strong>' + escapeHtml(candidate.reason) + '</strong></div>' +
        '<div class="rp-field"><span>Decision</span><strong>' + escapeHtml(candidate.decision) + '</strong></div>' +
        '</div></article>' +
        '<article class="rp-card"><span class="rp-eyebrow">Review note</span><textarea class="rp-textarea" readonly>' + escapeHtml(candidate.packet) + '</textarea></article>';
      const side = '<span class="rp-eyebrow green">Decision gate</span><h2>Reviewer pulse</h2><div class="rp-stack">' + data.steps.map(function (step, index) {
        return '<article class="rp-rail-card"><span class="rp-number">' + (index + 1) + '</span><h3>' + escapeHtml(step.title) + '</h3><p>' + escapeHtml(step.copy) + '</p></article>';
      }).join("") + '</div>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-candidate]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-candidate");
          paint();
        });
      });
    }
    paint();
  }

  function renderQa(data) {
    let filter = "all";
    function filtered() {
      if (filter === "all") return data.records;
      return data.records.filter(function (record) { return record.status === filter || record.family.indexOf(filter) !== -1; });
    }
    function paint() {
      const rows = filtered();
      const left = '<span class="rp-eyebrow">QA filters</span><h2>Coverage view</h2><div class="rp-filter-row">' +
        data.filters.map(function (item) {
          const active = item.value === filter ? " is-active" : "";
          return '<button class="rp-button' + active + '" data-filter="' + escapeHtml(item.value) + '" type="button">' + escapeHtml(item.label) + '</button>';
        }).join("") + '</div>';
      const main = '<article class="rp-card"><span class="rp-eyebrow green">First 25 pack</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' +
        '<div class="rp-table"><div class="rp-table-row rp-table-head"><span>Citation</span><span>Source lane</span><span>Status</span><span>Risk</span></div>' +
        rows.map(function (record) {
          return '<div class="rp-table-row"><strong>' + escapeHtml(record.citation) + '</strong><span>' + escapeHtml(record.family) + '</span><span>' + chip(record.status) + '</span><span>' + escapeHtml((record.risks || []).join(", ")) + '</span></div>';
        }).join("") + '</div>';
      const side = '<span class="rp-eyebrow green">Pack pulse</span><h2>Visible, not final</h2><div class="rp-progress"><span style="width:' + data.progress + '%"></span></div><p>' + escapeHtml(data.boundary) + '</p><div class="rp-stack">' +
        data.rules.map(function (rule) {
          return '<article class="rp-rail-card"><h3>' + escapeHtml(rule.title) + '</h3><p>' + escapeHtml(rule.copy) + '</p></article>';
        }).join("") + '</div>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-filter]").forEach(function (button) {
        button.addEventListener("click", function () {
          filter = button.getAttribute("data-filter");
          paint();
        });
      });
    }
    paint();
  }

  function renderAsk(data) {
    const memoryKey = data.memoryKey || "vedapathLearnerAskFlowV414";
    let selectedId = data.questions[0].id;
    function getSelected() {
      return data.questions.find(function (item) { return item.id === selectedId; }) || data.questions[0];
    }
    function recordsFor(question) {
      return question.recordIds.map(function (id) {
        return data.records.find(function (record) { return record.id === id; });
      }).filter(Boolean);
    }
    function saveMemory(question) {
      const current = JSON.parse(localStorage.getItem(memoryKey) || "[]");
      current.unshift({ question: question.question, answerTitle: question.answerTitle, date: new Date().toISOString() });
      localStorage.setItem(memoryKey, JSON.stringify(current.slice(0, 7)));
    }
    function memoryStats() {
      const current = JSON.parse(localStorage.getItem(memoryKey) || "[]");
      return current;
    }
    function paint() {
      const question = getSelected();
      const records = recordsFor(question);
      const memory = memoryStats();
      const left = '<span class="rp-eyebrow">Start small</span><h2>One question</h2><div class="rp-rail-list">' +
        data.questions.map(function (item) {
          const active = item.id === selectedId ? " is-active" : "";
          return '<button class="rp-button' + active + '" data-question="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.label) + '</button>';
        }).join("") + '</div><label><span class="rp-mini-label">Your question</span><textarea class="rp-textarea" data-ask-input>' + escapeHtml(question.question) + '</textarea></label><button class="rp-button primary" data-run-ask type="button">Ask With Sources</button>';
      const main = '<article class="rp-card"><span class="rp-eyebrow green">Source-backed answer</span><h2>' + escapeHtml(question.answerTitle) + '</h2><p>' + escapeHtml(question.plainMeaning) + '</p>' +
        '<div class="rp-answer"><div>' + records.map(recordCard).join("") + '</div><div class="rp-card"><span class="rp-mini-label green">Carry one step</span><h3>' + escapeHtml(question.carry) + '</h3><p>' + escapeHtml(data.boundary) + '</p></div></div></article>' +
        '<article class="rp-card"><span class="rp-eyebrow">Answer packet</span><textarea class="rp-textarea" readonly>' + escapeHtml(answerPacket(question, records)) + '</textarea></article>';
      const side = '<span class="rp-eyebrow green">Local memory</span><h2>Learner pulse</h2>' + metricGrid([
        { label: "Saved asks", value: memory.length },
        { label: "Visible records", value: records.length },
        { label: "Top source", value: records[0] ? records[0].citation : "None" },
        { label: "Authority", value: "Prototype" }
      ]) + '<div class="rp-stack"><article class="rp-rail-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article><article class="rp-rail-card"><h3>Next</h3><p>Use this flow as the first learner-facing retrieval pilot before live model calls.</p></article></div>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-question]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-question");
          paint();
        });
      });
      const input = app.querySelector("[data-ask-input]");
      app.querySelector("[data-run-ask]").addEventListener("click", function () {
        const text = input.value.toLowerCase();
        const found = data.questions.find(function (item) {
          return text.includes(item.label.toLowerCase().split(" ")[0]) || text.includes(item.question.toLowerCase().split(" ")[0]);
        });
        if (found) selectedId = found.id;
        saveMemory(getSelected());
        paint();
      });
    }
    paint();
  }

  function answerPacket(question, records) {
    const primary = records[0] || {};
    return [
      "VedaPath Learner Ask Packet",
      "Question: " + question.question,
      "Answer: " + question.answerTitle,
      "Primary source: " + (primary.citation || "No source"),
      "Source family: " + (primary.family || "Unknown"),
      "Confidence: " + (primary.confidence || "Unknown"),
      "Boundary: " + (primary.boundary || "Do not overclaim."),
      "Carry: " + question.carry
    ].join("\n");
  }

  const renderers = {
    gate: renderGate,
    schema: renderSchema,
    desk: renderDesk,
    qa: renderQa,
    ask: renderAsk
  };

  fetch(app.getAttribute("data-data-file"))
    .then(function (response) {
      if (!response.ok) throw new Error("Unable to load page data");
      return response.json();
    })
    .then(function (data) {
      renderers[app.getAttribute("data-kind")](data);
      const button = app.querySelector("[data-copy-packet]");
      button?.addEventListener("click", async function () {
        const packet = app.querySelector("textarea");
        const text = packet?.value || "";
        const copied = text ? await copyText(text) : false;
        if (!copied && packet) {
          packet.focus();
          packet.select();
        }
        showCopyResult(button, copied);
      });
    })
    .catch(function (error) {
      app.innerHTML = '<div class="rp-empty">Unable to load this retrieval pilot surface: ' + escapeHtml(error.message) + '</div>';
    });
})();

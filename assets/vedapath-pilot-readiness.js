(function () {
  const app = document.querySelector("[data-pilot-readiness-app]");
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
    return '<span class="pr-chip ' + slug(value) + '">' + escapeHtml(value) + '</span>';
  }

  function metricGrid(metrics) {
    return '<div class="pr-metrics">' + metrics.map(function (metric) {
      return '<div class="pr-field"><span>' + escapeHtml(metric.label) + '</span><strong>' + escapeHtml(metric.value) + '</strong></div>';
    }).join("") + '</div>';
  }

  function renderShell(left, main, side) {
    app.innerHTML = '<section class="pr-grid"><aside class="pr-panel">' + left + '</aside><main class="pr-main">' + main + '</main><aside class="pr-panel">' + side + '</aside></section>';
  }

  function safeRead(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveLocal(key, value, limit) {
    const next = [value].concat(safeRead(key)).slice(0, limit || 8);
    localStorage.setItem(key, JSON.stringify(next));
    return next;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    }
  }

  function recordSummary(record) {
    return '<article class="pr-card pr-status"><div class="pr-actions">' + chip(record.rights || record.status) + chip(record.family) + '</div><h2>' + escapeHtml(record.title) + '</h2><p><strong>' + escapeHtml(record.citation) + '</strong></p><p>' + escapeHtml(record.allowedUse) + '</p><div class="pr-fields"><div class="pr-field"><span>Edition</span><strong>' + escapeHtml(record.edition) + '</strong></div><div class="pr-field"><span>Translator</span><strong>' + escapeHtml(record.translator) + '</strong></div><div class="pr-field"><span>Confidence</span><strong>' + escapeHtml(record.confidence) + '</strong></div><div class="pr-field"><span>Boundary</span><strong>' + escapeHtml(record.boundary) + '</strong></div></div></article>';
  }

  function renderEdition(data) {
    const key = "vedapathSourceEditionIntakeV420";
    let selectedId = data.records[0].id;
    function selected() {
      return data.records.find(function (record) { return record.id === selectedId; }) || data.records[0];
    }
    function paint() {
      const record = selected();
      const saved = safeRead(key);
      const left = '<span class="pr-eyebrow">Edition queue</span><h2>Choose source</h2><div class="pr-list">' + data.records.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-record="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.citation) + '</button>';
      }).join("") + '</div>';
      const missing = '<div class="pr-list">' + record.missingFields.map(function (field) {
        return '<article class="pr-step"><span class="pr-number">!</span><h3>' + escapeHtml(field) + '</h3><p>Must be resolved before public pilot answer expansion.</p></article>';
      }).join("") + '</div>';
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Source edition intake</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article>' + recordSummary(record) + '<article class="pr-card"><h2>Missing fields</h2>' + missing + '<label><span class="pr-muted">Local edition note</span><textarea class="pr-textarea" data-edition-note>Edition needs a public-domain or licensed translation decision before learner-facing expansion.</textarea></label><div class="pr-actions"><button class="pr-button primary" data-save-edition type="button">Save Intake Note</button><button class="pr-button green" data-copy-edition type="button">Copy Intake Packet</button></div></article>';
      const side = '<span class="pr-eyebrow green">Questions</span><h2>Before answer use</h2><div class="pr-stack">' + data.intakeQuestions.map(function (question, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(question) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local notes</h3><p>' + saved.length + ' saved edition note' + (saved.length === 1 ? "" : "s") + ' in this browser.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-record]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-record");
          paint();
        });
      });
      app.querySelector("[data-save-edition]")?.addEventListener("click", function () {
        saveLocal(key, { citation: record.citation, note: app.querySelector("[data-edition-note]")?.value || "", date: new Date().toISOString() }, 8);
        paint();
      });
      app.querySelector("[data-copy-edition]")?.addEventListener("click", function () {
        copyText(["VedaPath Source Edition Intake", record.citation, record.family, "Edition: " + record.edition, "Translator: " + record.translator, "Missing: " + record.missingFields.join(", "), "Boundary: " + record.boundary].join("\n"));
      });
    }
    paint();
  }

  function renderRightsDesk(data) {
    const key = "vedapathRightsReviewDeskV421";
    let lane = "all";
    function visible() {
      return lane === "all" ? data.records : data.records.filter(function (record) { return record.decision === lane || record.rights === lane; });
    }
    function paint() {
      const saved = safeRead(key);
      const rows = visible().map(function (record) {
        return '<div class="pr-table-row"><strong>' + escapeHtml(record.citation) + '</strong><span>' + escapeHtml(record.family) + '</span><span>' + chip(record.decision || record.rights) + '</span><span>' + escapeHtml(record.next) + '</span></div>';
      }).join("");
      const left = '<span class="pr-eyebrow">Use lanes</span><h2>Filter rights</h2><div class="pr-list"><button class="pr-button' + (lane === "all" ? " is-active" : "") + '" data-lane="all" type="button">All lanes</button>' + data.lanes.map(function (item) {
        return '<button class="pr-button' + (item.id === lane ? " is-active" : "") + '" data-lane="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.title) + '</button>';
      }).join("") + '</div>';
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Rights review</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><div class="pr-table"><div class="pr-table-row pr-table-head"><span>Citation</span><span>Family</span><span>Lane</span><span>Next</span></div>' + rows + '</div><article class="pr-card"><label><span class="pr-muted">Local rights note</span><textarea class="pr-textarea" data-rights-note>Keep this source in review until edition and use permission are recorded.</textarea></label><div class="pr-actions"><button class="pr-button primary" data-save-rights type="button">Save Rights Note</button><button class="pr-button green" data-copy-rights type="button">Copy Rights Snapshot</button></div></article>';
      const side = '<span class="pr-eyebrow green">Checklist</span><h2>Release discipline</h2><div class="pr-stack">' + data.checklist.map(function (item, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local notes</h3><p>' + saved.length + ' saved rights note' + (saved.length === 1 ? "" : "s") + '.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-lane]").forEach(function (button) {
        button.addEventListener("click", function () {
          lane = button.getAttribute("data-lane");
          paint();
        });
      });
      app.querySelector("[data-save-rights]")?.addEventListener("click", function () {
        saveLocal(key, { lane: lane, note: app.querySelector("[data-rights-note]")?.value || "", date: new Date().toISOString() }, 8);
        paint();
      });
      app.querySelector("[data-copy-rights]")?.addEventListener("click", function () {
        copyText(visible().map(function (record) { return record.citation + " | " + record.decision + " | " + record.next; }).join("\n"));
      });
    }
    paint();
  }

  function renderIdentity(data) {
    const key = "vedapathReviewerIdentityLiteV422";
    let selectedId = data.roles[0].id;
    function role() {
      return data.roles.find(function (item) { return item.id === selectedId; }) || data.roles[0];
    }
    function paint() {
      const saved = safeRead(key);
      const active = role();
      const left = '<span class="pr-eyebrow">Reviewer posture</span><h2>Choose role</h2><div class="pr-list">' + data.roles.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-role="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.title) + '</button>';
      }).join("") + '</div>';
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Identity lite</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><article class="pr-card pr-status ready">' + chip(active.id) + '<h2>' + escapeHtml(active.title) + '</h2><p>' + escapeHtml(active.scope) + '</p><label><span class="pr-muted">Conflict or limitation note</span><textarea class="pr-textarea" data-identity-note>I can review source posture for this demo, but I am not granting final scholarly or production authority.</textarea></label><div class="pr-actions"><button class="pr-button primary" data-save-identity type="button">Save Identity Note</button><button class="pr-button green" data-copy-identity type="button">Copy Identity Packet</button></div></article>';
      const side = '<span class="pr-eyebrow green">Rules</span><h2>Reviewer boundaries</h2><div class="pr-stack">' + data.rules.map(function (item, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local notes</h3><p>' + saved.length + ' identity note' + (saved.length === 1 ? "" : "s") + ' saved.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-role]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-role");
          paint();
        });
      });
      app.querySelector("[data-save-identity]")?.addEventListener("click", function () {
        saveLocal(key, { role: active.title, scope: active.scope, note: app.querySelector("[data-identity-note]")?.value || "", date: new Date().toISOString() }, 8);
        paint();
      });
      app.querySelector("[data-copy-identity]")?.addEventListener("click", function () {
        copyText(["VedaPath Reviewer Identity", active.title, "Scope: " + active.scope, "Boundary: " + data.boundary].join("\n"));
      });
    }
    paint();
  }

  function renderPromotion(data) {
    const key = "vedapathAnswerPromotionRulesV423";
    let selectedId = data.candidates[0].id;
    function candidate() {
      return data.candidates.find(function (item) { return item.id === selectedId; }) || data.candidates[0];
    }
    function statusText() {
      const checked = app.querySelectorAll("[data-gate-check]:checked").length;
      return checked === data.gates.length ? "Pilot-ready draft" : checked >= 4 ? "Review candidate" : "Keep in draft";
    }
    function paint() {
      const active = candidate();
      const saved = safeRead(key);
      const left = '<span class="pr-eyebrow">Candidates</span><h2>Choose answer</h2><div class="pr-list">' + data.candidates.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-candidate="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.title) + '</button>';
      }).join("") + '</div>';
      const checks = data.gates.map(function (item, index) {
        return '<label class="pr-check"><input type="checkbox" data-gate-check ' + (index < 3 ? "checked" : "") + '><span>' + escapeHtml(item) + '</span></label>';
      }).join("");
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Promotion rules</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><article class="pr-card pr-status"><div class="pr-actions">' + chip(active.status) + chip(active.citation) + '</div><h2>' + escapeHtml(active.title) + '</h2><p>Risk: ' + escapeHtml(active.risk) + '</p><div class="pr-form">' + checks + '</div><div class="pr-actions"><button class="pr-button primary" data-promote type="button">Evaluate Promotion</button><button class="pr-button green" data-save-promotion type="button">Save Promotion Note</button></div><div class="pr-card pr-saved" data-promotion-status><h3>Promotion posture</h3><p>Keep in draft until every gate is checked.</p></div></article>';
      const side = '<span class="pr-eyebrow green">Rule</span><h2>No silent promotion</h2><p>A useful answer pattern should not become a public pilot pattern unless the source, rights, reviewer, and boundary trail are visible.</p><article class="pr-card pr-saved"><h3>Local notes</h3><p>' + saved.length + ' saved promotion note' + (saved.length === 1 ? "" : "s") + '.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-candidate]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-candidate");
          paint();
        });
      });
      app.querySelector("[data-promote]")?.addEventListener("click", function () {
        const status = statusText();
        const panel = app.querySelector("[data-promotion-status]");
        if (panel) {
          panel.classList.toggle("ready", status === "Pilot-ready draft");
          panel.innerHTML = '<h3>Promotion posture</h3><p>' + escapeHtml(status) + '</p>';
        }
      });
      app.querySelector("[data-save-promotion]")?.addEventListener("click", function () {
        saveLocal(key, { candidate: active.title, status: statusText(), date: new Date().toISOString() }, 8);
        paint();
      });
    }
    paint();
  }

  function renderInvite(data) {
    const key = "vedapathPilotInvitePacketV424";
    let selectedId = data.segments[0].id;
    function segment() {
      return data.segments.find(function (item) { return item.id === selectedId; }) || data.segments[0];
    }
    function packet(active, note) {
      return ["VedaPath AI Pilot Invite", "Segment: " + active.title, "Promise: " + active.promise, "Message: " + note, "Boundary: " + data.boundary].join("\n");
    }
    function paint() {
      const saved = safeRead(key);
      const active = segment();
      const left = '<span class="pr-eyebrow">Invite lane</span><h2>Choose person</h2><div class="pr-list">' + data.segments.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-segment="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.title) + '</button>';
      }).join("") + '</div>';
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Pilot invite</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><article class="pr-card pr-status ready">' + chip(active.id) + '<h2>' + escapeHtml(active.title) + '</h2><p>' + escapeHtml(active.promise) + '</p><label><span class="pr-muted">Invite message</span><textarea class="pr-textarea" data-invite-note>' + escapeHtml(data.defaultNote) + '</textarea></label><div class="pr-actions"><button class="pr-button primary" data-save-invite type="button">Save Invite</button><button class="pr-button green" data-copy-invite type="button">Copy Invite Packet</button></div></article>';
      const side = '<span class="pr-eyebrow green">Gate</span><h2>Small pilot rules</h2><div class="pr-stack">' + data.gates.map(function (item, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local invites</h3><p>' + saved.length + ' invite packet' + (saved.length === 1 ? "" : "s") + ' saved in this browser.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-segment]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-segment");
          paint();
        });
      });
      app.querySelector("[data-save-invite]")?.addEventListener("click", function () {
        saveLocal(key, { segment: active.title, note: app.querySelector("[data-invite-note]")?.value || "", date: new Date().toISOString() }, 8);
        paint();
      });
      app.querySelector("[data-copy-invite]")?.addEventListener("click", function () {
        copyText(packet(active, app.querySelector("[data-invite-note]")?.value || ""));
      });
    }
    paint();
  }


  function renderTelemetryConsent(data) {
    const key = "vedapathPilotTelemetryConsentV425";
    let selectedId = data.consentModes[1].id;
    function mode() {
      return data.consentModes.find(function (item) { return item.id === selectedId; }) || data.consentModes[0];
    }
    function packet(active, note) {
      return ["VedaPath Pilot Telemetry Consent", "Mode: " + active.title, "Allowed: " + active.allowed, "Note: " + note, "Boundary: " + data.boundary].join("\n");
    }
    function paint() {
      const saved = safeRead(key);
      const active = mode();
      const left = '<span class="pr-eyebrow">Consent mode</span><h2>Choose measurement</h2><div class="pr-list">' + data.consentModes.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-consent-mode="' + escapeHtml(item.id) + '" type="button">' + escapeHtml(item.title) + '</button>';
      }).join("") + '</div><article class="pr-card"><h3>Project context</h3><p>Signals belong to VedaPath AI only. They do not transfer to another product, profile, or account.</p></article>';
      const signals = data.signals.map(function (item, index) {
        return '<label class="pr-check"><input type="checkbox" data-signal-check ' + (index < 2 ? "checked" : "") + '><span>' + escapeHtml(item) + '</span></label>';
      }).join("");
      const main = '<article class="pr-card"><span class="pr-eyebrow green">Telemetry consent</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><article class="pr-card pr-status ready">' + chip(active.id) + '<h2>' + escapeHtml(active.title) + '</h2><p>' + escapeHtml(active.promise) + '</p><p><strong>Allowed:</strong> ' + escapeHtml(active.allowed) + '</p><div class="pr-form">' + signals + '</div><label><span class="pr-muted">Visible consent note</span><textarea class="pr-textarea" data-consent-note>' + escapeHtml(data.defaultNote) + '</textarea></label><div class="pr-actions"><button class="pr-button primary" data-save-consent type="button">Save Local Consent</button><button class="pr-button green" data-copy-consent type="button">Copy Consent Packet</button><button class="pr-button" data-clear-consent type="button">Clear Local Consent</button></div></article>';
      const side = '<span class="pr-eyebrow green">Privacy gate</span><h2>Before learning</h2><div class="pr-stack">' + data.gates.map(function (item, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local consent</h3><p>' + saved.length + ' consent preview record' + (saved.length === 1 ? "" : "s") + ' saved in this browser.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-consent-mode]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-consent-mode");
          paint();
        });
      });
      app.querySelector("[data-save-consent]")?.addEventListener("click", function () {
        if (selectedId !== "no-measurement") {
          saveLocal(key, { mode: active.title, note: app.querySelector("[data-consent-note]")?.value || "", date: new Date().toISOString() }, 8);
        }
        paint();
      });
      app.querySelector("[data-copy-consent]")?.addEventListener("click", function () {
        copyText(packet(active, app.querySelector("[data-consent-note]")?.value || ""));
      });
      app.querySelector("[data-clear-consent]")?.addEventListener("click", function () {
        localStorage.removeItem(key);
        paint();
      });
    }
    paint();
  }


  function renderLaunchRoom(data) {
    const key = data.storageKey || "vedapathLaunchRoom";
    let selectedId = data.lanes[0].id;
    function selected() {
      return data.lanes.find(function (item) { return item.id === selectedId; }) || data.lanes[0];
    }
    function decisionText() {
      const checked = app.querySelectorAll("[data-launch-check]:checked").length;
      if (checked === data.checklist.length) return data.readyLabel || "Ready for founder review";
      if (checked >= Math.ceil(data.checklist.length / 2)) return "Review candidate";
      return "Keep preparing";
    }
    function packet(active, note) {
      return [
        "VedaPath Launch Review",
        "Room: " + data.title,
        "Lane: " + active.title,
        "Decision: " + decisionText(),
        "Note: " + note,
        "Boundary: " + data.boundary
      ].join("\n");
    }
    function paint() {
      const saved = safeRead(key);
      const active = selected();
      const left = '<span class="pr-eyebrow">Launch lane</span><h2>Choose focus</h2><div class="pr-list">' + data.lanes.map(function (item) {
        return '<button class="pr-button' + (item.id === selectedId ? " is-active" : "") + '" data-launch-lane="' + escapeHtml(item.id) + '" type="button"><strong>' + escapeHtml(item.title) + '</strong> <span>' + escapeHtml(item.decision) + '</span></button>';
      }).join("") + '</div><article class="pr-card"><h3>Room boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      const checks = data.checklist.map(function (item, index) {
        return '<label class="pr-check"><input type="checkbox" data-launch-check ' + (index < Math.max(2, Math.floor(data.checklist.length / 2)) ? "checked" : "") + '><span>' + escapeHtml(item) + '</span></label>';
      }).join("");
      const signals = '<div class="pr-signal-list">' + (active.signals || []).map(function (item) {
        return '<span>' + escapeHtml(item) + '</span>';
      }).join("") + '</div>';
      const main = '<article class="pr-card pr-room-intro"><span class="pr-eyebrow green">' + escapeHtml(data.title) + '</span><h2>' + escapeHtml(data.headline) + '</h2><p>' + escapeHtml(data.copy) + '</p>' + metricGrid(data.metrics) + '</article><article class="pr-card pr-status ready">' + chip(active.id) + '<h2>' + escapeHtml(active.title) + '</h2><p>' + escapeHtml(active.summary) + '</p><div class="pr-fields"><div class="pr-field"><span>Decision lane</span><strong>' + escapeHtml(active.decision) + '</strong></div><div class="pr-field"><span>Current posture</span><strong data-launch-decision>' + escapeHtml(data.readyLabel || "Review candidate") + '</strong></div></div>' + signals + '</article><article class="pr-card"><h2>Founder checks</h2><div class="pr-form">' + checks + '</div><label><span class="pr-muted">Launch note</span><textarea class="pr-textarea" data-launch-note>' + escapeHtml(data.defaultNote || "") + '</textarea></label><div class="pr-actions"><button class="pr-button primary" data-evaluate-launch type="button">Evaluate Gate</button><button class="pr-button green" data-save-launch type="button">Save Review</button><button class="pr-button" data-copy-launch type="button">Copy Packet</button><button class="pr-button" data-clear-launch type="button">Clear Local</button></div></article>';
      const side = '<span class="pr-eyebrow green">Pilot path</span><h2>Decision sequence</h2><div class="pr-stack">' + data.steps.map(function (item, index) {
        return '<article class="pr-step"><span class="pr-number">' + (index + 1) + '</span><p>' + escapeHtml(item) + '</p></article>';
      }).join("") + '</div><article class="pr-card pr-saved"><h3>Local reviews</h3><p>' + saved.length + ' saved review packet' + (saved.length === 1 ? "" : "s") + ' in this browser.</p></article><article class="pr-card"><h3>Boundary</h3><p>' + escapeHtml(data.boundary) + '</p></article>';
      renderShell(left, main, side);
      app.querySelectorAll("[data-launch-lane]").forEach(function (button) {
        button.addEventListener("click", function () {
          selectedId = button.getAttribute("data-launch-lane");
          paint();
        });
      });
      app.querySelector("[data-evaluate-launch]")?.addEventListener("click", function () {
        const target = app.querySelector("[data-launch-decision]");
        if (target) target.textContent = decisionText();
      });
      app.querySelector("[data-save-launch]")?.addEventListener("click", function () {
        saveLocal(key, { room: data.title, lane: active.title, decision: decisionText(), note: app.querySelector("[data-launch-note]")?.value || "", date: new Date().toISOString() }, 8);
        paint();
      });
      app.querySelector("[data-copy-launch]")?.addEventListener("click", function () {
        copyText(packet(active, app.querySelector("[data-launch-note]")?.value || ""));
      });
      app.querySelector("[data-clear-launch]")?.addEventListener("click", function () {
        localStorage.removeItem(key);
        paint();
      });
    }
    paint();
  }

  const renderers = {
    edition: renderEdition,
    rightsDesk: renderRightsDesk,
    identity: renderIdentity,
    promotion: renderPromotion,
    invite: renderInvite,
    telemetryConsent: renderTelemetryConsent,
    launchRoom: renderLaunchRoom
  };

  fetch(app.getAttribute("data-data-file"))
    .then(function (response) { return response.json(); })
    .then(function (data) {
      const renderer = renderers[app.getAttribute("data-kind")];
      if (renderer) renderer(data);
    })
    .catch(function () {
      app.innerHTML = '<article class="pr-card"><h2>Unable to load pilot readiness data.</h2><p>Check the local JSON file path.</p></article>';
    });
})();

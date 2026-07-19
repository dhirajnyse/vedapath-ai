(function () {
  const dataNode = document.getElementById("backendArtifactData");
  if (!dataNode) return;
  const data = JSON.parse(dataNode.textContent);
  const output = document.querySelector("[data-backend-output]");
  const render = (value) => { if (output) output.textContent = JSON.stringify(value, null, 2); };
  const safeRead = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
  };
  const safeWrite = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  };

  if (data.control === "decision") {
    document.querySelector("[data-backend-run]")?.addEventListener("click", () => {
      const decision = document.querySelector("[data-backend-decision]")?.value || "hold";
      render({ decision, scope: decision === "authorize-spike" ? "bounded-local-spike-only" : "no-implementation", deploymentAuthorized: false, publicLaunch: false, evidence: data.evidence, boundary: data.boundary });
    });
  }

  if (data.control === "provider") {
    const host = document.querySelector("[data-backend-provider-options]");
    if (host) host.innerHTML = data.patterns.map((pattern) => '<label class="backend-choice"><input type="radio" name="backendPattern" value="' + pattern.id + '" ' + (pattern.selected ? 'checked' : '') + '><strong>' + pattern.label + '</strong><small>Privacy: ' + pattern.privacy + ' · Operations: ' + pattern.operations + ' · Rollback: ' + pattern.rollback + '</small></label>').join("");
    document.querySelector("[data-backend-run]")?.addEventListener("click", () => {
      const id = document.querySelector('input[name="backendPattern"]:checked')?.value;
      const pattern = data.patterns.find((item) => item.id === id);
      render({ selectedPattern: pattern, providerVendor: "not-selected", region: "founder-review-required", credentials: false, deploymentAuthorized: false, boundary: data.boundary });
    });
  }

  if (data.control === "source") {
    const select = document.querySelector("[data-backend-source-options]");
    if (select) select.innerHTML = data.records.map((record) => '<option value="' + record.id + '">' + record.citation + ' — ' + record.title + '</option>').join("") + '<option value="unknown-source">Unknown source (no-source test)</option>';
    document.querySelector("[data-backend-run]")?.addEventListener("click", () => {
      const id = select?.value;
      const record = data.records.find((item) => item.id === id);
      render(record ? { status: 200, source: record, generatedAnswer: null, mutation: false } : { status: 404, code: "source_not_found", source: null, generatedAnswer: null, mutation: false });
    });
  }

  if (data.control === "queue") {
    const key = "vedapathMinimalReviewQueue";
    let state = safeRead(key, { tickets: data.tickets, events: [] });
    const select = document.querySelector("[data-backend-queue-options]");
    const refresh = () => {
      if (select) select.innerHTML = state.tickets.map((ticket) => '<option value="' + ticket.id + '">' + ticket.id + ' — ' + ticket.status + '</option>').join("");
      render({ storage: "browser-local-prototype", tickets: state.tickets, latestEvents: state.events.slice(-5), productionIdentity: false });
    };
    document.querySelectorAll("[data-queue-action]").forEach((button) => button.addEventListener("click", () => {
      const ticket = state.tickets.find((item) => item.id === select?.value);
      if (!ticket) return;
      const action = button.dataset.queueAction;
      const note = document.querySelector("[data-backend-note]")?.value.trim();
      const allowed = (action === "claim" && ["open", "changes-requested"].includes(ticket.status)) || (["approve", "changes-requested"].includes(action) && ticket.status === "claimed");
      if (!allowed) { render({ error: "invalid_transition", ticket }); return; }
      ticket.status = action === "claim" ? "claimed" : action;
      ticket.owner = action === "claim" ? "fixture-reviewer" : ticket.owner;
      state.events.push({ ticketId: ticket.id, action, note: note || null, at: new Date().toISOString() });
      safeWrite(key, state);
      refresh();
    }));
    refresh();
  }

  if (data.control === "consent") {
    const key = "vedapathMinimalConsentLedger";
    let events = safeRead(key, []);
    const refresh = () => render({ storage: "browser-local-prototype", appendOnly: true, telemetryEnabled: false, events: events.slice(-8), hostedWriteAuthorized: false });
    document.querySelectorAll("[data-consent-action]").forEach((button) => button.addEventListener("click", () => {
      const subject = document.querySelector("[data-backend-subject]")?.value.trim();
      const purpose = document.querySelector("[data-backend-purpose]")?.value.trim();
      if (!subject || !purpose) { render({ error: "subject_and_purpose_required" }); return; }
      events.push({ id: "consent-" + String(events.length + 1).padStart(3, "0"), type: button.dataset.consentAction, subject, purpose, scope: data.defaultScope, at: new Date().toISOString() });
      safeWrite(key, events);
      refresh();
    }));
    refresh();
  }
})();

(function () {
  const dataNode = document.getElementById("hostedCandidateData");
  if (!dataNode) return;

  const data = JSON.parse(dataNode.textContent);
  const output = document.querySelector("[data-candidate-output]");
  const render = (value) => {
    if (output) output.textContent = JSON.stringify(value, null, 2);
  };

  const launchBoundary = {
    vendor: "not-selected",
    region: "review-required",
    persistence: "ephemeral",
    deploymentAuthorized: false,
    productionStorage: false,
    telemetryEnabled: false,
    liveAi: false,
    publicLaunch: false
  };

  if (data.control === "authorization") {
    document.querySelector("[data-candidate-run]")?.addEventListener("click", () => {
      const decision = document.querySelector("[data-candidate-decision]")?.value || "hold";
      render({
        approved: decision === "authorize-candidate",
        decision,
        authorizedCapability: decision === "authorize-candidate" ? "build-and-test-provider-neutral-candidate" : "none",
        scope: "hosted-candidate-only",
        ...launchBoundary,
        note: "This does not authorize deployment, durable storage, telemetry, live AI, or public launch."
      });
    });
  }

  if (data.control === "environment") {
    document.querySelector("[data-candidate-run]")?.addEventListener("click", () => {
      const unsafe = Boolean(document.querySelector("[data-candidate-unsafe]")?.checked);
      const profile = structuredClone(data.profile);
      if (unsafe) profile.secretRefs.sessionVerifier = "literal-secret";
      const refsSafe = Object.values(profile.secretRefs).every((value) => /^binding:\/\/[A-Z][A-Z0-9_]+$/.test(value));
      render({
        approved: refsSafe && !profile.deploymentAuthorized && !profile.publicLaunch,
        violations: refsSafe ? [] : ["literal or malformed secret reference: sessionVerifier"],
        summary: {
          ...profile,
          secretRefs: Object.fromEntries(Object.keys(profile.secretRefs).map((key) => [key, "binding://[configured]"]))
        },
        boundary: data.boundary
      });
    });
  }

  if (data.control === "source") {
    const select = document.querySelector("[data-candidate-source]");
    if (select) {
      select.innerHTML = data.records.map((record) => `<option value="${record.id}">${record.citation} | ${record.title}</option>`).join("") + '<option value="unknown-source">Unknown source</option>';
    }
    document.querySelector("[data-candidate-run]")?.addEventListener("click", () => {
      const id = select?.value || "unknown-source";
      const source = data.records.find((record) => record.id === id) || null;
      render(source ? {
        status: 200,
        route: `/v1/sources/${id}`,
        source,
        generatedAnswer: null,
        mutation: false,
        ...launchBoundary
      } : {
        status: 404,
        route: `/v1/sources/${id}`,
        code: "source_not_found",
        source: null,
        generatedAnswer: null
      });
    });
  }

  if (data.control === "queue") {
    const seed = data.tickets.map((ticket) => ({ ...ticket }));
    let tickets = seed.map((ticket) => ({ ...ticket }));
    let events = [];
    const select = document.querySelector("[data-candidate-ticket]");
    const note = document.querySelector("[data-candidate-note]");
    const populate = () => {
      if (!select) return;
      select.innerHTML = tickets.map((ticket) => `<option value="${ticket.id}">${ticket.id} | ${ticket.status}</option>`).join("");
    };
    const transition = (next) => {
      const ticket = tickets.find((item) => item.id === select?.value);
      if (!ticket) return render({ ok: false, code: "ticket_not_found" });
      const allowed = { open: ["claimed"], claimed: ["approved", "changes-requested", "open"], "changes-requested": ["claimed"] };
      if (!allowed[ticket.status]?.includes(next)) return render({ ok: false, code: "invalid_transition", currentStatus: ticket.status, requested: next });
      if (["approved", "changes-requested"].includes(next) && !note?.value.trim()) return render({ ok: false, code: "decision_note_required" });
      const previous = ticket.status;
      ticket.status = next;
      ticket.owner = next === "claimed" ? "reviewer-001" : ticket.owner;
      if (next === "open") ticket.owner = null;
      const event = { sequence: events.length + 1, ticketId: ticket.id, previous, next, actor: "reviewer-001", note: note?.value.trim() || null };
      events.push(event);
      populate();
      render({ ok: true, identityMode: "fixture-session-verifier", persistence: "ephemeral", ticket, event, auditCount: events.length, ...launchBoundary });
    };
    populate();
    document.querySelectorAll("[data-queue-transition]").forEach((button) => button.addEventListener("click", () => transition(button.dataset.queueTransition)));
    document.querySelector("[data-candidate-reset]")?.addEventListener("click", () => {
      tickets = seed.map((ticket) => ({ ...ticket }));
      events = [];
      populate();
      render({ ok: true, reset: true, persistence: "ephemeral", tickets });
    });
  }

  if (data.control === "consent") {
    let events = [];
    const purpose = "private-pilot-learning";
    const scope = ["pilot-session", "source-feedback"];
    const project = () => {
      let active = false;
      let exportRequested = false;
      let deletionRequested = false;
      events.forEach((event) => {
        if (event.type === "consent.granted") active = true;
        if (event.type === "consent.withdrawn") active = false;
        if (event.type === "export.requested") exportRequested = true;
        if (event.type === "deletion.requested") deletionRequested = true;
      });
      return { purpose, active, scope, exportRequested, deletionRequested, lastSequence: events.length };
    };
    const append = (type) => {
      const event = { sequence: events.length + 1, type, subject: "pilot-participant-001", purpose, scope };
      events.push(event);
      render({ ok: true, status: 201, event, effective: project(), eventCount: events.length, appendOnly: true, persistence: "ephemeral", ...launchBoundary });
    };
    document.querySelectorAll("[data-consent-event]").forEach((button) => button.addEventListener("click", () => append(button.dataset.consentEvent)));
    document.querySelector("[data-candidate-reset]")?.addEventListener("click", () => {
      events = [];
      render({ ok: true, reset: true, effective: project(), telemetryEnabled: false, publicLaunch: false });
    });
  }

  render({
    release: `${data.version} ${data.title}`,
    ready: true,
    instruction: data.initialInstruction,
    boundary: data.boundary
  });
})();

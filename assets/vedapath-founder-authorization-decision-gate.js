(() => {
  const storageKey = "vedapath-founder-authorization-decision-gate";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("founderAuthorizationDecisionGate") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("decisionSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("decisionResultCard") : null;
  const decisionOutput = pageDocument ? pageDocument.getElementById("decisionOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("decisionChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("decisionScope") : null;

  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);

  function hasText(value, groups) {
    const text = String(value || "").toLowerCase();
    return groups.every((group) => group.some((term) => text.includes(term.toLowerCase())));
  }

  function authorizationHoldReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-execution-authorization-hold-v1" &&
      packet.hold_status === "Controlled authorization hold ready" &&
      packet.controlled_authorization_hold_ready === true &&
      packet.execution_packet_authorized === false &&
      packet.execution_authorized === false &&
      packet.execution_allowed === false &&
      packet.founder_instruction_granted === false &&
      packet.source_promotion_allowed === false &&
      packet.promotion_execution_allowed === false &&
      packet.implementation_authorized === false &&
      packet.implementation_execution_allowed === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.canonical_write_allowed === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.production_ready === false &&
      packet.production_launch_allowed === false &&
      packet.public_release_allowed === false &&
      packet.next_gate_required === "Founder authorization decision gate";
  }

  function keepsDecisionBoundary(value) {
    const text = String(value || "");
    const required = [
      /founder_authorization_decision_ready may be true/i,
      /founder_decision_recorded may be true/i,
      /execution_packet_authorized remains false/i,
      /execution_authorized remains false/i,
      /execution_allowed remains false/i,
      /founder_instruction_granted remains false/i,
      /source_promotion_allowed remains false/i,
      /promotion_execution_allowed remains false/i,
      /implementation_authorized remains false/i,
      /implementation_execution_allowed remains false/i,
      /controlled_storage_entry_allowed remains false/i,
      /storage_write_enabled remains false/i,
      /canonical_write_allowed remains false/i,
      /source_write_executed remains false/i,
      /actual_storage_write_executed remains false/i,
      /production_ready remains false/i,
      /production_launch_allowed remains false/i,
      /public_release_allowed remains false/i
    ].every((pattern) => pattern.test(text));
    const unsafe = /(execution_packet_authorized true|execution_authorized true|execution_allowed true|founder_instruction_granted true|source_promotion_allowed true|promotion_execution_allowed true|implementation_authorized true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|production_launch_allowed true|public_release_allowed true|authorize now|authorization granted|execute now|write enabled|canonical update|migration run|secret use|launch production)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function decisionMissingForState(config, state, decision = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(decision[field] || "").trim());
  }

  function idMatches(decision, holdPacket, key) {
    return !decision[key] || !holdPacket[key] || decision[key] === holdPacket[key];
  }

  function founderAuthorizationDecisionGate(config, holdPacket, decision) {
    const state = decision.decision_state || "Draft founder decision";
    const missing = decisionMissingForState(config, state, decision);
    const blocked = [];

    if (!authorizationHoldReady(holdPacket)) blocked.push("controlled authorization hold must be ready while authorization, execution, storage, canonical, public release, and production flags remain false");
    ["controlled_execution_authorization_hold_id", "controlled_execution_review_gate_id", "controlled_execution_packet_draft_id", "founder_execution_instruction_gate_id", "promotion_execution_preflight_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(decision, holdPacket, key)) blocked.push(key + " must match the controlled authorization hold");
    });

    const readyCandidate = state === "Founder decision ready";
    if (readyCandidate && !hasText(decision.decision_scope, [["record founder decision posture"], ["exact source packet"], ["authorization hold readiness"], ["do not", "authorize"], ["execution"], ["source promotion"], ["storage"], ["canonical"], ["migration"], ["account"], ["secret"], ["public release"], ["production launch"]])) {
      blocked.push("decision scope must be exact-source only and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && !hasText(decision.founder_decision_language, [["founder decision recorded"], ["move to controlled execution packet authorization draft"], ["not authorization"], ["no authorization granted"], ["no execution"]])) {
      blocked.push("founder decision language must move only to the next draft and state not authorization, no authorization granted, and no execution");
    }
    if (readyCandidate && !hasText(decision.decision_rationale, [["held authorization language"], ["specific to one source answer"], ["source record"], ["source family"], ["review gate"], ["packet draft"], ["next reviewable authorization packet only"]])) {
      blocked.push("decision rationale must keep the move specific to one source and one next reviewable draft");
    }
    if (readyCandidate && !hasText(decision.evidence_summary, [["authorization hold ready"], ["review gate"], ["packet draft"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["founder instruction"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("evidence summary must keep hold readiness and evidence visible");
    }
    if (readyCandidate && !hasText(decision.source_lock, [["controlled_execution_authorization_hold_id"], ["controlled_execution_review_gate_id"], ["controlled_execution_packet_draft_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("source lock must name the hold, review gate, packet draft, source answer, source record, and source family");
    }
    if (readyCandidate && !hasText(decision.risk_acknowledgment, [["risk remains"], ["source mismatch"], ["rights change"], ["reviewer change"], ["founder instruction expiry"], ["authorization hold expiry"], ["review gate expiry"], ["rollback missing"], ["monitoring missing"], ["code change"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on source, rights, reviewer, founder, hold, review, rollback, monitoring, code, or true authority flags");
    }
    if (readyCandidate && !keepsDecisionBoundary(decision.boundary_statement)) {
      blocked.push("boundary statement must keep decision readiness as non-authority and all authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(decision.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["future execution packet authorization draft"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, future draft, and no source state write");
    }
    if (readyCandidate && !hasText(decision.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["future execution packet authorization draft"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and future draft");
    }
    if (readyCandidate && !hasText(decision.stop_condition, [["stop"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["source-owner"], ["founder instruction expires"], ["authorization hold expires"], ["review gate expires"], ["rollback"], ["monitoring"], ["code changes"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on source mismatches, rights changes, missing evidence, expiry, missing rollback/monitoring, code changes, or any true authority flag");
    }
    if (readyCandidate && !hasText(decision.expiry_check, [["expires"], ["material source"], ["rights"], ["reviewer"], ["founder instruction"], ["authorization hold"], ["review gate"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not permanent approval"]])) {
      blocked.push("expiry check must state that founder decision expires and is not permanent approval");
    }
    if (readyCandidate && !keepsProductionBoundary(decision.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs founder decision note" && !decision.review_question) blocked.push("review question is required");
    if (state === "Return to authorization hold" && !decision.return_reason) blocked.push("return reason is required");
    if (state === "Decision hold" && !decision.hold_reason) blocked.push("hold reason is required");
    if (state === "Execution blocked" && !decision.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !decision.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Decision expired" && !decision.hold_reason) blocked.push("hold reason is required when decision expires");

    const decision_status = missing.length
      ? "Blocked: required decision fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      founder_authorization_decision_gate_id: "founder-authorization-decision-gate-" + Date.now(),
      decision_status,
      founder_authorization_decision_ready: decision_status === "Founder decision ready",
      founder_decision_recorded: decision_status === "Founder decision ready",
      execution_packet_authorized: false,
      execution_authorized: false,
      execution_allowed: false,
      founder_instruction_granted: false,
      source_promotion_allowed: false,
      promotion_execution_allowed: false,
      implementation_authorized: false,
      implementation_execution_allowed: false,
      controlled_storage_entry_allowed: false,
      storage_write_enabled: false,
      canonical_write_allowed: false,
      source_write_executed: false,
      actual_storage_write_executed: false,
      production_ready: false,
      production_launch_allowed: false,
      public_release_allowed: false,
      next_gate_required: config.boundary.next_gate_required,
      controlled_execution_authorization_hold_id: decision.controlled_execution_authorization_hold_id || holdPacket.controlled_execution_authorization_hold_id || "",
      controlled_execution_review_gate_id: decision.controlled_execution_review_gate_id || holdPacket.controlled_execution_review_gate_id || "",
      controlled_execution_packet_draft_id: decision.controlled_execution_packet_draft_id || holdPacket.controlled_execution_packet_draft_id || "",
      founder_execution_instruction_gate_id: decision.founder_execution_instruction_gate_id || holdPacket.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: decision.promotion_execution_preflight_id || holdPacket.promotion_execution_preflight_id || "",
      source_answer_id: decision.source_answer_id || holdPacket.source_answer_id || "",
      source_record_id: decision.source_record_id || holdPacket.source_record_id || "",
      source_family: decision.source_family || holdPacket.source_family || "",
      decision_actor: decision.decision_actor || "",
      founder_name: decision.founder_name || "",
      decision_scope: decision.decision_scope || "",
      founder_decision_language: decision.founder_decision_language || "",
      decision_rationale: decision.decision_rationale || "",
      evidence_summary: decision.evidence_summary || "",
      source_lock: decision.source_lock || "",
      risk_acknowledgment: decision.risk_acknowledgment || "",
      boundary_statement: decision.boundary_statement || "",
      rollback_condition: decision.rollback_condition || "",
      monitoring_condition: decision.monitoring_condition || "",
      stop_condition: decision.stop_condition || "",
      expiry_check: decision.expiry_check || "",
      production_boundary: decision.production_boundary || "",
      review_question: decision.review_question || "",
      return_reason: decision.return_reason || "",
      hold_reason: decision.hold_reason || "",
      block_reason: decision.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function founderDecisionSnapshot(decisions, config) {
    const byStatus = decisions.reduce((counts, decision) => {
      const key = decision.decision_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_decisions: decisions.length,
      ready: byStatus["Founder decision ready"] || 0,
      blocked: decisions.filter((decision) => String(decision.decision_status || "").startsWith("Blocked")).length,
      holds: byStatus["Decision hold"] || 0,
      expired: byStatus["Decision expired"] || 0,
      execution_enabled: decisions.filter((decision) => decision.execution_allowed || decision.execution_authorized || decision.execution_packet_authorized || decision.storage_write_enabled || decision.source_write_executed || decision.production_ready || decision.public_release_allowed).length
    };
  }

  function parseDecisionJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="decision-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(decision) {
    if (!resultCard) return;
    const issues = [...(decision.missing || []), ...(decision.blocked || [])];
    resultCard.dataset.state = decision.decision_status;
    resultCard.innerHTML = '<strong>' + safe(decision.decision_status) + '</strong>' +
      '<p class="muted">Decision ready: ' + safe(decision.founder_authorization_decision_ready) + ' | Authorized: ' + safe(decision.execution_packet_authorized) + ' | Production: ' + safe(decision.production_ready) + '</p>' +
      '<div class="decision-grid">' +
        card("Authorization hold", decision.controlled_execution_authorization_hold_id, decision.founder_authorization_decision_ready ? "ready" : "") +
        card("Source answer", decision.source_answer_id) +
        card("Next gate", decision.next_gate_required) +
        card("Execution", decision.execution_allowed ? "enabled" : "false", decision.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for controlled execution packet authorization draft. No authorization, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.decision_checks.map((check) =>
      '<article class="decision-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Authorization hold", config.source.controlled_execution_authorization_hold_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    const saved = parseDecisionJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(decisions) {
    localStorage.setItem(storageKey, JSON.stringify(decisions.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const decisions = readSaved();
    const snapshot = founderDecisionSnapshot(decisions, config);
    savedRoot.innerHTML = card("Saved decisions", snapshot.saved_decisions) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      decisions.slice(-4).reverse().map((decision) =>
        '<article class="decision-card ' + (decision.founder_authorization_decision_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(decision.created_at) + '</span>' +
        '<strong>' + safe(decision.decision_status) + '</strong>' +
        '<span>' + safe(decision.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathFounderAuthorizationDecisionGate = {
    founderAuthorizationDecisionGate,
    founderDecisionSnapshot,
    decisionMissingForState,
    keepsDecisionBoundary,
    keepsProductionBoundary,
    parseDecisionJson,
    authorizationHoldReady
  };

  if (!root || typeof fetch !== "function") return;

  fetch("data/vedapath-founder-authorization-decision-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        authorizationHold: root.querySelector("#decisionAuthorizationHold"),
        state: root.querySelector("#decisionState"),
        actor: root.querySelector("#decisionActor"),
        founderName: root.querySelector("#decisionFounderName"),
        authorizationHoldId: root.querySelector("#decisionAuthorizationHoldId"),
        reviewGateId: root.querySelector("#decisionReviewGateId"),
        packetDraftId: root.querySelector("#decisionPacketDraftId"),
        founderGateId: root.querySelector("#decisionFounderGateId"),
        preflightId: root.querySelector("#decisionPreflightId"),
        sourceAnswer: root.querySelector("#decisionSourceAnswer"),
        sourceRecord: root.querySelector("#decisionSourceRecord"),
        sourceFamily: root.querySelector("#decisionSourceFamily"),
        scope: root.querySelector("#decisionScopeText"),
        founderLanguage: root.querySelector("#decisionFounderLanguage"),
        rationale: root.querySelector("#decisionRationale"),
        evidence: root.querySelector("#decisionEvidence"),
        sourceLock: root.querySelector("#decisionSourceLock"),
        risk: root.querySelector("#decisionRisk"),
        boundary: root.querySelector("#decisionBoundary"),
        rollback: root.querySelector("#decisionRollback"),
        monitoring: root.querySelector("#decisionMonitoring"),
        stop: root.querySelector("#decisionStopCondition"),
        expiry: root.querySelector("#decisionExpiry"),
        production: root.querySelector("#decisionProductionBoundary"),
        question: root.querySelector("#decisionQuestion"),
        returnReason: root.querySelector("#decisionReturnReason"),
        holdReason: root.querySelector("#decisionHoldReason"),
        block: root.querySelector("#decisionBlockReason")
      };

      config.decision_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_decision;
        fields.authorizationHold.value = JSON.stringify(config.sample_authorization_hold, null, 2);
        fields.state.value = item.decision_state;
        fields.actor.value = item.decision_actor;
        fields.founderName.value = item.founder_name;
        fields.authorizationHoldId.value = item.controlled_execution_authorization_hold_id;
        fields.reviewGateId.value = item.controlled_execution_review_gate_id;
        fields.packetDraftId.value = item.controlled_execution_packet_draft_id;
        fields.founderGateId.value = item.founder_execution_instruction_gate_id;
        fields.preflightId.value = item.promotion_execution_preflight_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.decision_scope;
        fields.founderLanguage.value = item.founder_decision_language;
        fields.rationale.value = item.decision_rationale;
        fields.evidence.value = item.evidence_summary;
        fields.sourceLock.value = item.source_lock;
        fields.risk.value = item.risk_acknowledgment;
        fields.boundary.value = item.boundary_statement;
        fields.rollback.value = item.rollback_condition;
        fields.monitoring.value = item.monitoring_condition;
        fields.stop.value = item.stop_condition;
        fields.expiry.value = item.expiry_check;
        fields.production.value = item.production_boundary;
        fields.question.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildDecision() {
        return {
          decision_state: fields.state.value,
          decision_actor: fields.actor.value,
          founder_name: fields.founderName.value,
          controlled_execution_authorization_hold_id: fields.authorizationHoldId.value,
          controlled_execution_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_draft_id: fields.packetDraftId.value,
          founder_execution_instruction_gate_id: fields.founderGateId.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          decision_scope: fields.scope.value,
          founder_decision_language: fields.founderLanguage.value,
          decision_rationale: fields.rationale.value,
          evidence_summary: fields.evidence.value,
          source_lock: fields.sourceLock.value,
          risk_acknowledgment: fields.risk.value,
          boundary_statement: fields.boundary.value,
          rollback_condition: fields.rollback.value,
          monitoring_condition: fields.monitoring.value,
          stop_condition: fields.stop.value,
          expiry_check: fields.expiry.value,
          production_boundary: fields.production.value,
          review_question: fields.question.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const holdPacket = parseDecisionJson(fields.authorizationHold.value, {});
        const decision = founderAuthorizationDecisionGate(config, holdPacket, buildDecision());
        decisionOutput.value = JSON.stringify(decision, null, 2);
        renderResult(decision);
        return decision;
      }

      root.querySelector("#runDecisionGate").addEventListener("click", run);
      root.querySelector("#loadDecisionSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveDecisionGate").addEventListener("click", () => {
        const decision = run();
        writeSaved([...readSaved(), decision]);
        renderSaved(config);
      });
      root.querySelector("#clearDecisionGates").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyDecisionGate").addEventListener("click", async () => {
        if (!decisionOutput.value) run();
        await navigator.clipboard.writeText(decisionOutput.value);
      });

      loadSample();
      renderChecks(config);
      renderScope(config);
      run();
      renderSaved(config);
    });
})();

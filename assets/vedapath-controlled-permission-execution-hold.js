(() => {
  const storageKey = "vedapath-controlled-permission-execution-hold";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("controlledPermissionExecutionHold") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("executionHoldSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("executionHoldResultCard") : null;
  const output = pageDocument ? pageDocument.getElementById("executionHoldOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("executionHoldChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("executionHoldScope") : null;

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

  function founderDecisionReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-founder-permission-decision-gate-v1" &&
      packet.decision_status === "Decision ready for controlled hold" &&
      packet.controlled_founder_permission_decision_gate_ready === true &&
      packet.founder_permission_decision_recorded === true &&
      packet.controlled_permission_execution_hold_candidate_ready === true &&
      packet.permission_granted === false &&
      packet.authorization_permission_granted === false &&
      packet.permission_review_approved === false &&
      packet.founder_permission_granted === false &&
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
      packet.next_gate_required === "Controlled permission execution hold";
  }

  function hasUnsafeAuthority(value) {
    return /(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsNonExecutionHoldBoundary(value) {
    const text = String(value || "");
    const required = [
      /controlled_founder_permission_decision_gate_ready may be true/i,
      /founder_permission_decision_recorded may be true/i,
      /controlled_permission_execution_hold_candidate_ready may be true/i,
      /controlled_permission_execution_hold_ready may be true/i,
      /permission_execution_hold_recorded may be true/i,
      /permission_execution_authorization_preflight_candidate_ready may be true/i,
      /permission_granted remains false/i,
      /authorization_permission_granted remains false/i,
      /permission_review_approved remains false/i,
      /founder_permission_granted remains false/i,
      /founder_instruction_granted remains false/i,
      /execution_packet_authorized remains false/i,
      /execution_authorized remains false/i,
      /execution_allowed remains false/i,
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
    return required && !hasUnsafeAuthority(text);
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function missingForState(config, state, hold = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(hold[field] || "").trim());
  }

  function idMatches(hold, packet, key) {
    return !hold[key] || !packet[key] || hold[key] === packet[key];
  }

  function controlledPermissionExecutionHold(config, decisionPacket, hold) {
    const state = hold.hold_state || "Draft hold";
    const missing = missingForState(config, state, hold);
    const blocked = [];

    if (!founderDecisionReady(decisionPacket)) {
      blocked.push("founder permission decision must be ready while permission, authorization, execution, storage, canonical, public release, and production flags remain false");
    }

    ["controlled_founder_permission_decision_gate_id", "controlled_authorization_permission_review_gate_id", "controlled_authorization_permission_preflight_id", "founder_authorization_instruction_gate_id", "controlled_authorization_review_gate_id", "controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(hold, decisionPacket, key)) blocked.push(key + " must match the founder decision packet");
    });

    const readyCandidate = state === "Hold ready for preflight";
    if (readyCandidate && !hasText(hold.hold_scope, [["hold"], ["founder decision signal"], ["permission execution authorization preflight"], ["not permission grant"], ["not authorization"], ["not execution"], ["cannot", "promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("hold scope must be hold-only and explicitly block permission grant, authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && hasUnsafeAuthority(hold.hold_language)) {
      blocked.push("hold language must not grant permission, approve authorization, or open execution");
    }
    if (readyCandidate && !hasText(hold.hold_language, [["hold result"], ["permission execution authorization preflight"], ["hold readiness only"], ["permission is not granted"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("hold language must move only to authorization preflight and state permission is not granted, authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(hold.hold_rationale, [["founder permission decision is ready"], ["source-locked"], ["execution hold signal"], ["authorization preflight"], ["does not open"], ["operational authority"]])) {
      blocked.push("hold rationale must keep the decision source-locked and separate hold readiness from authority");
    }
    if (readyCandidate && !hasText(hold.hold_evidence_summary, [["founder decision ready"], ["permission review"], ["permission preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["founder decision"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("hold evidence summary must keep source and review evidence visible");
    }
    if (readyCandidate && !hasText(hold.evidence_lock, [["controlled_founder_permission_decision_gate_id"], ["controlled_authorization_permission_review_gate_id"], ["controlled_authorization_permission_preflight_id"], ["founder_authorization_instruction_gate_id"], ["controlled_authorization_review_gate_id"], ["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("evidence lock must name founder decision, review, preflight, instruction gate, authorization review, authorization draft, source answer, source record, and source family");
    }
    if (readyCandidate && !keepsNonExecutionHoldBoundary(hold.non_execution_hold_clause)) {
      blocked.push("non-execution hold clause must keep the hold as non-permission and all grant, authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(hold.risk_acknowledgment, [["risk remains"], ["founder decision mismatch"], ["permission review mismatch"], ["preflight mismatch"], ["founder instruction mismatch"], ["review mismatch"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["hold language ambiguity"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on mismatches, rights changes, ambiguity, missing rollback/monitoring, packet/code changes, or true authority flags");
    }
    if (readyCandidate && !hasText(hold.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["founder decision audit"], ["hold audit"], ["permission execution authorization preflight"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, audits, preflight, and no source state write");
    }
    if (readyCandidate && !hasText(hold.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["permission execution authorization preflight"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and preflight");
    }
    if (readyCandidate && !hasText(hold.stop_condition, [["stop"], ["founder decision id mismatches"], ["permission review id mismatches"], ["preflight id mismatches"], ["founder instruction id mismatches"], ["review id mismatches"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["hold language is ambiguous"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on decision/review/preflight/instruction/source mismatches, rights changes, missing evidence, ambiguity, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(hold.expiry_check, [["expires"], ["material founder decision"], ["permission review"], ["preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["rollback"], ["monitoring"], ["packet"], ["code change"], ["rechecked"], ["not permission"], ["not authorization"], ["not execution"]])) {
      blocked.push("expiry check must state that controlled permission execution hold expires and is not permission, authorization, or execution");
    }
    if (readyCandidate && !keepsProductionBoundary(hold.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs hold clarification" && !hold.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to founder decision" && !hold.return_reason) blocked.push("return reason is required");
    if (state === "Permission hold blocked" && !hold.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !hold.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !hold.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Hold paused" && !hold.hold_reason) blocked.push("hold reason is required");
    if (state === "Hold expired" && !hold.hold_reason) blocked.push("hold reason is required when hold expires");

    const hold_status = missing.length
      ? "Blocked: required execution hold fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;
    const ready = hold_status === "Hold ready for preflight";

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_permission_execution_hold_id: hold.controlled_permission_execution_hold_id || "controlled-permission-execution-hold-" + Date.now(),
      hold_status,
      controlled_founder_permission_decision_gate_ready: decisionPacket.controlled_founder_permission_decision_gate_ready === true,
      founder_permission_decision_recorded: decisionPacket.founder_permission_decision_recorded === true,
      controlled_permission_execution_hold_candidate_ready: decisionPacket.controlled_permission_execution_hold_candidate_ready === true,
      controlled_permission_execution_hold_ready: ready,
      permission_execution_hold_recorded: ready,
      permission_execution_authorization_preflight_candidate_ready: ready,
      permission_granted: false,
      authorization_permission_granted: false,
      permission_review_approved: false,
      founder_permission_granted: false,
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
      controlled_founder_permission_decision_gate_id: hold.controlled_founder_permission_decision_gate_id || decisionPacket.controlled_founder_permission_decision_gate_id || "",
      controlled_authorization_permission_review_gate_id: hold.controlled_authorization_permission_review_gate_id || decisionPacket.controlled_authorization_permission_review_gate_id || "",
      controlled_authorization_permission_preflight_id: hold.controlled_authorization_permission_preflight_id || decisionPacket.controlled_authorization_permission_preflight_id || "",
      founder_authorization_instruction_gate_id: hold.founder_authorization_instruction_gate_id || decisionPacket.founder_authorization_instruction_gate_id || "",
      controlled_authorization_review_gate_id: hold.controlled_authorization_review_gate_id || decisionPacket.controlled_authorization_review_gate_id || "",
      controlled_execution_packet_authorization_draft_id: hold.controlled_execution_packet_authorization_draft_id || decisionPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: hold.founder_authorization_decision_gate_id || decisionPacket.founder_authorization_decision_gate_id || "",
      source_answer_id: hold.source_answer_id || decisionPacket.source_answer_id || "",
      source_record_id: hold.source_record_id || decisionPacket.source_record_id || "",
      source_family: hold.source_family || decisionPacket.source_family || "",
      hold_actor: hold.hold_actor || "",
      holder_name: hold.holder_name || "",
      hold_scope: hold.hold_scope || "",
      hold_language: hold.hold_language || "",
      hold_rationale: hold.hold_rationale || "",
      hold_evidence_summary: hold.hold_evidence_summary || "",
      evidence_lock: hold.evidence_lock || "",
      non_execution_hold_clause: hold.non_execution_hold_clause || "",
      risk_acknowledgment: hold.risk_acknowledgment || "",
      rollback_condition: hold.rollback_condition || "",
      monitoring_condition: hold.monitoring_condition || "",
      stop_condition: hold.stop_condition || "",
      expiry_check: hold.expiry_check || "",
      production_boundary: hold.production_boundary || "",
      clarification_question: hold.clarification_question || "",
      return_reason: hold.return_reason || "",
      hold_reason: hold.hold_reason || "",
      block_reason: hold.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function executionHoldSnapshot(holds, config) {
    const byStatus = holds.reduce((counts, hold) => {
      const key = hold.hold_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_holds: holds.length,
      ready: byStatus["Hold ready for preflight"] || 0,
      blocked: holds.filter((hold) => String(hold.hold_status || "").startsWith("Blocked")).length,
      paused: byStatus["Hold paused"] || 0,
      expired: byStatus["Hold expired"] || 0,
      permission_granted: holds.filter((hold) => hold.permission_granted || hold.authorization_permission_granted || hold.permission_review_approved || hold.founder_permission_granted).length,
      execution_enabled: holds.filter((hold) => hold.execution_allowed || hold.execution_authorized || hold.execution_packet_authorized || hold.storage_write_enabled || hold.source_write_executed || hold.production_ready || hold.public_release_allowed).length
    };
  }

  function parseJson(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function card(label, value, tone = "") {
    return '<article class="execution-hold-card ' + safe(tone) + '"><span>' + safe(label) + '</span><strong>' + safe(value || "None") + '</strong></article>';
  }

  function renderResult(hold) {
    if (!resultCard) return;
    const issues = [...(hold.missing || []), ...(hold.blocked || [])];
    resultCard.dataset.state = hold.hold_status;
    resultCard.innerHTML = '<strong>' + safe(hold.hold_status) + '</strong>' +
      '<p class="muted">Hold ready: ' + safe(hold.controlled_permission_execution_hold_ready) + ' | Permission: ' + safe(hold.permission_granted) + ' | Execution: ' + safe(hold.execution_allowed) + '</p>' +
      '<div class="execution-hold-grid">' +
        card("Founder decision", hold.controlled_founder_permission_decision_gate_id, hold.controlled_permission_execution_hold_ready ? "ready" : "") +
        card("Source answer", hold.source_answer_id) +
        card("Next gate", hold.next_gate_required) +
        card("Production", hold.production_ready ? "open" : "false", hold.production_ready ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for permission execution authorization preflight. Permission, authorization, execution, storage write, canonical update, public release, and production launch remain false.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.hold_checks.map((check) =>
      '<article class="execution-hold-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Founder decision", config.source.controlled_founder_permission_decision_gate_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function readSaved() {
    const saved = parseJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(holds) {
    localStorage.setItem(storageKey, JSON.stringify(holds.slice(-20)));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const holds = readSaved();
    const snapshot = executionHoldSnapshot(holds, config);
    savedRoot.innerHTML = card("Saved", snapshot.saved_holds) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Permission granted", snapshot.permission_granted, snapshot.permission_granted ? "blocked" : "ready") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      holds.slice(-4).reverse().map((hold) =>
        '<article class="execution-hold-card ' + (hold.controlled_permission_execution_hold_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(hold.created_at) + '</span>' +
        '<strong>' + safe(hold.hold_status) + '</strong>' +
        '<span>' + safe(hold.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledPermissionExecutionHold = {
    controlledPermissionExecutionHold,
    executionHoldSnapshot,
    founderDecisionReady,
    hasUnsafeAuthority,
    keepsNonExecutionHoldBoundary
  };

  if (!root || !pageDocument) return;

  fetch("data/vedapath-controlled-permission-execution-hold.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        packet: pageDocument.getElementById("executionHoldDecisionPacket"),
        state: pageDocument.getElementById("executionHoldState"),
        actor: pageDocument.getElementById("executionHoldActor"),
        holder: pageDocument.getElementById("executionHoldName"),
        holdId: pageDocument.getElementById("executionHoldId"),
        founderDecisionId: pageDocument.getElementById("executionHoldFounderDecisionId"),
        permissionReviewId: pageDocument.getElementById("executionHoldPermissionReviewId"),
        preflightId: pageDocument.getElementById("executionHoldPreflightId"),
        instructionGateId: pageDocument.getElementById("executionHoldInstructionGateId"),
        reviewGateId: pageDocument.getElementById("executionHoldAuthorizationReviewGateId"),
        draftId: pageDocument.getElementById("executionHoldDraftId"),
        decisionGateId: pageDocument.getElementById("executionHoldPriorGateId"),
        sourceAnswer: pageDocument.getElementById("executionHoldSourceAnswer"),
        sourceRecord: pageDocument.getElementById("executionHoldSourceRecord"),
        sourceFamily: pageDocument.getElementById("executionHoldSourceFamily"),
        scope: pageDocument.getElementById("executionHoldScopeText"),
        language: pageDocument.getElementById("executionHoldLanguage"),
        rationale: pageDocument.getElementById("executionHoldRationale"),
        summary: pageDocument.getElementById("executionHoldSummary"),
        evidenceLock: pageDocument.getElementById("executionHoldEvidenceLock"),
        boundary: pageDocument.getElementById("executionHoldBoundary"),
        risk: pageDocument.getElementById("executionHoldRisk"),
        rollback: pageDocument.getElementById("executionHoldRollback"),
        monitoring: pageDocument.getElementById("executionHoldMonitoring"),
        stop: pageDocument.getElementById("executionHoldStopCondition"),
        expiry: pageDocument.getElementById("executionHoldExpiry"),
        production: pageDocument.getElementById("executionHoldProductionBoundary"),
        clarification: pageDocument.getElementById("executionHoldClarification"),
        returnReason: pageDocument.getElementById("executionHoldReturnReason"),
        holdReason: pageDocument.getElementById("executionHoldHoldReason"),
        blockReason: pageDocument.getElementById("executionHoldBlockReason")
      };

      fields.state.innerHTML = config.hold_states.map((state) => '<option>' + safe(state) + '</option>').join("");

      function setFields(sample = config.sample_hold) {
        fields.packet.value = JSON.stringify(config.sample_founder_decision_packet, null, 2);
        fields.state.value = sample.hold_state;
        fields.actor.value = sample.hold_actor;
        fields.holder.value = sample.holder_name;
        fields.holdId.value = sample.controlled_permission_execution_hold_id;
        fields.founderDecisionId.value = sample.controlled_founder_permission_decision_gate_id;
        fields.permissionReviewId.value = sample.controlled_authorization_permission_review_gate_id;
        fields.preflightId.value = sample.controlled_authorization_permission_preflight_id;
        fields.instructionGateId.value = sample.founder_authorization_instruction_gate_id;
        fields.reviewGateId.value = sample.controlled_authorization_review_gate_id;
        fields.draftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.scope.value = sample.hold_scope;
        fields.language.value = sample.hold_language;
        fields.rationale.value = sample.hold_rationale;
        fields.summary.value = sample.hold_evidence_summary;
        fields.evidenceLock.value = sample.evidence_lock;
        fields.boundary.value = sample.non_execution_hold_clause;
        fields.risk.value = sample.risk_acknowledgment;
        fields.rollback.value = sample.rollback_condition;
        fields.monitoring.value = sample.monitoring_condition;
        fields.stop.value = sample.stop_condition;
        fields.expiry.value = sample.expiry_check;
        fields.production.value = sample.production_boundary;
        fields.clarification.value = sample.clarification_question || "";
        fields.returnReason.value = sample.return_reason || "";
        fields.holdReason.value = sample.hold_reason || "";
        fields.blockReason.value = sample.block_reason || "";
      }

      function buildHold() {
        return {
          hold_state: fields.state.value,
          hold_actor: fields.actor.value,
          holder_name: fields.holder.value,
          controlled_permission_execution_hold_id: fields.holdId.value,
          controlled_founder_permission_decision_gate_id: fields.founderDecisionId.value,
          controlled_authorization_permission_review_gate_id: fields.permissionReviewId.value,
          controlled_authorization_permission_preflight_id: fields.preflightId.value,
          founder_authorization_instruction_gate_id: fields.instructionGateId.value,
          controlled_authorization_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_authorization_draft_id: fields.draftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          hold_scope: fields.scope.value,
          hold_language: fields.language.value,
          hold_rationale: fields.rationale.value,
          hold_evidence_summary: fields.summary.value,
          evidence_lock: fields.evidenceLock.value,
          non_execution_hold_clause: fields.boundary.value,
          risk_acknowledgment: fields.risk.value,
          rollback_condition: fields.rollback.value,
          monitoring_condition: fields.monitoring.value,
          stop_condition: fields.stop.value,
          expiry_check: fields.expiry.value,
          production_boundary: fields.production.value,
          clarification_question: fields.clarification.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.blockReason.value
        };
      }

      function run() {
        const packet = parseJson(fields.packet.value, {});
        const hold = controlledPermissionExecutionHold(config, packet, buildHold());
        renderResult(hold);
        if (output) output.value = JSON.stringify(hold, null, 2);
        return hold;
      }

      pageDocument.getElementById("runExecutionHold").addEventListener("click", run);
      pageDocument.getElementById("loadExecutionHoldSample").addEventListener("click", () => { setFields(); run(); });
      pageDocument.getElementById("saveExecutionHold").addEventListener("click", () => {
        const hold = run();
        const saved = readSaved();
        saved.push(hold);
        writeSaved(saved);
        renderSaved(config);
      });
      pageDocument.getElementById("clearExecutionHolds").addEventListener("click", () => {
        writeSaved([]);
        renderSaved(config);
      });
      pageDocument.getElementById("copyExecutionHold").addEventListener("click", () => {
        const hold = run();
        navigator.clipboard?.writeText(JSON.stringify(hold, null, 2));
      });

      renderChecks(config);
      renderScope(config);
      setFields();
      renderSaved(config);
      run();
    });
})();

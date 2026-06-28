(() => {
  const storageKey = "vedapath-founder-permission-decision-gate";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("founderPermissionDecisionGate") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("founderDecisionSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("founderDecisionResultCard") : null;
  const output = pageDocument ? pageDocument.getElementById("founderDecisionOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("founderDecisionChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("founderDecisionScope") : null;
  const handoffRoot = pageDocument ? pageDocument.getElementById("founderDecisionQuestionHandoff") : null;
  const flagsRoot = pageDocument ? pageDocument.getElementById("founderDecisionAuthorityFlags") : null;

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

  function permissionReviewReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-authorization-permission-review-gate-v2" &&
      packet.review_status === "Permission review ready" &&
      packet.controlled_authorization_permission_review_ready === true &&
      packet.permission_review_signal_recorded === true &&
      packet.founder_permission_decision_candidate_ready === true &&
      packet.review_route === "Ready for founder instruction" &&
      String(packet.founder_question || "").includes("Founder question:") &&
      String(packet.permission_question || "").includes("without granting permission") &&
      keepsAuthorityFlagAudit(packet.authority_flag_audit) &&
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
      packet.next_gate_required === "Founder permission decision gate";
  }

  function keepsAuthorityFlagAudit(value) {
    const text = String(value || "");
    const required = [
      /execution_packet_authorized=false/i,
      /execution_authorized=false/i,
      /execution_allowed=false/i,
      /founder_instruction_granted=false/i,
      /source_promotion_allowed=false/i,
      /promotion_execution_allowed=false/i,
      /implementation_authorized=false/i,
      /implementation_execution_allowed=false/i,
      /controlled_storage_entry_allowed=false/i,
      /storage_write_enabled=false/i,
      /canonical_write_allowed=false/i,
      /source_write_executed=false/i,
      /actual_storage_write_executed=false/i,
      /production_ready=false/i,
      /production_launch_allowed=false/i,
      /public_release_allowed=false/i
    ].every((pattern) => pattern.test(text));
    return required && !hasUnsafeAuthority(text);
  }

  function hasUnsafeAuthority(value) {
    return /(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsNonExecutionDecisionBoundary(value) {
    const text = String(value || "");
    const required = [
      /controlled_authorization_permission_review_ready may be true/i,
      /permission_review_signal_recorded may be true/i,
      /founder_permission_decision_candidate_ready may be true/i,
      /controlled_founder_permission_decision_gate_ready may be true/i,
      /founder_permission_decision_recorded may be true/i,
      /controlled_permission_execution_hold_candidate_ready may be true/i,
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

  function missingForState(config, state, decision = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(decision[field] || "").trim());
  }

  function idMatches(decision, packet, key) {
    return !decision[key] || !packet[key] || decision[key] === packet[key];
  }

  function founderPermissionDecisionGate(config, reviewPacket, decision) {
    const state = decision.decision_state || "Draft founder decision";
    const missing = missingForState(config, state, decision);
    const blocked = [];

    if (!permissionReviewReady(reviewPacket)) {
      blocked.push("permission review must be ready while permission, authorization, execution, storage, canonical, public release, and production flags remain false");
    }

    ["controlled_authorization_permission_review_gate_id", "controlled_authorization_permission_preflight_id", "founder_authorization_instruction_gate_id", "controlled_authorization_review_gate_id", "controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "source_answer_id", "source_record_id", "source_family", "review_route", "founder_question", "permission_question"].forEach((key) => {
      if (!idMatches(decision, reviewPacket, key)) blocked.push(key + " must match the permission review packet");
    });

    const readyCandidate = state === "Decision ready for controlled hold";
    if (readyCandidate && !keepsAuthorityFlagAudit(decision.authority_flag_audit || reviewPacket.authority_flag_audit)) {
      blocked.push("authority flag audit must preserve false execution, storage, canonical write, public release, and production flags");
    }
    if (readyCandidate && !hasText(decision.decision_scope, [["founder decision"], ["v3.4.2 permission review"], ["reviewed permission candidate"], ["founder question"], ["permission question"], ["controlled permission execution hold"], ["not permission grant"], ["not authorization"], ["not execution"], ["cannot", "promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("decision scope must be founder-decision only, preserve the v3.4.2 review questions, and explicitly block permission grant, authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && hasUnsafeAuthority(decision.founder_decision_language)) {
      blocked.push("founder decision language must not grant permission, approve authorization, or open execution");
    }
    if (readyCandidate && !hasText(decision.founder_decision_language, [["founder decision signal"], ["reviewed founder question"], ["permission question"], ["next controlled permission execution hold"], ["not permission grant"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("founder decision language must move only the reviewed question to a controlled hold and state permission grant is absent, authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(decision.decision_rationale, [["v3.4.2 permission review is ready"], ["source-locked"], ["founder question"], ["permission question"], ["founder decision signal"], ["controlled hold"], ["does not open"], ["operational authority"]])) {
      blocked.push("decision rationale must keep the v3.4.2 review source-locked, preserve questions, and separate founder decision from authority");
    }
    if (readyCandidate && !hasText(decision.decision_evidence_summary, [["permission review ready"], ["v3.4.2"], ["review route"], ["founder question"], ["permission question"], ["authority flag audit"], ["permission preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["founder decision"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("decision evidence summary must keep source, review route, questions, authority audit, and review evidence visible");
    }
    if (readyCandidate && !hasText(decision.evidence_lock, [["controlled_authorization_permission_review_gate_id"], ["controlled_authorization_permission_preflight_id"], ["founder_authorization_instruction_gate_id"], ["controlled_authorization_review_gate_id"], ["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["source_answer_id"], ["source_record_id"], ["source family"], ["review route"], ["founder question"], ["permission question"]])) {
      blocked.push("evidence lock must name review, preflight, instruction gate, review gate, authorization draft, founder decision, source answer, source record, source family, route, and questions");
    }
    if (readyCandidate && !keepsNonExecutionDecisionBoundary(decision.non_execution_decision_clause)) {
      blocked.push("non-execution decision clause must keep founder decision as non-permission and all grant, authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(decision.risk_acknowledgment, [["risk remains"], ["permission review mismatch"], ["preflight mismatch"], ["founder question mismatch"], ["permission question mismatch"], ["authority flag audit mismatch"], ["founder instruction mismatch"], ["review mismatch"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["founder language ambiguity"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on question/audit mismatches, rights changes, ambiguity, missing rollback/monitoring, packet/code changes, or true authority flags");
    }
    if (readyCandidate && !hasText(decision.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["founder decision audit"], ["controlled permission execution hold"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, founder decision audit, controlled hold, and no source state write");
    }
    if (readyCandidate && !hasText(decision.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["controlled permission execution hold"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and controlled hold");
    }
    if (readyCandidate && !hasText(decision.stop_condition, [["stop"], ["permission review id mismatches"], ["preflight id mismatches"], ["founder question mismatches"], ["permission question mismatches"], ["authority flag audit mismatches"], ["founder instruction id mismatches"], ["review id mismatches"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["founder decision language is ambiguous"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on review/preflight/question/audit/source mismatches, rights changes, missing evidence, ambiguity, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(decision.expiry_check, [["expires"], ["material permission review"], ["preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["rollback"], ["monitoring"], ["packet"], ["code change"], ["rechecked"], ["not permission"], ["not execution"]])) {
      blocked.push("expiry check must state that founder permission decision expires and is not permission or execution");
    }
    if (readyCandidate && !keepsProductionBoundary(decision.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs founder clarification" && !decision.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to permission review" && !decision.return_reason) blocked.push("return reason is required");
    if (state === "Permission decision blocked" && !decision.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !decision.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !decision.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Decision hold" && !decision.hold_reason) blocked.push("hold reason is required");
    if (state === "Decision expired" && !decision.hold_reason) blocked.push("hold reason is required when decision expires");

    const decision_status = missing.length
      ? "Blocked: required founder decision fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;
    const ready = decision_status === "Decision ready for controlled hold";

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_founder_permission_decision_gate_id: decision.controlled_founder_permission_decision_gate_id || "controlled-founder-permission-decision-gate-" + Date.now(),
      decision_status,
      controlled_authorization_permission_review_ready: reviewPacket.controlled_authorization_permission_review_ready === true,
      permission_review_signal_recorded: reviewPacket.permission_review_signal_recorded === true,
      founder_permission_decision_candidate_ready: reviewPacket.founder_permission_decision_candidate_ready === true,
      controlled_founder_permission_decision_gate_ready: ready,
      founder_permission_decision_recorded: ready,
      controlled_permission_execution_hold_candidate_ready: ready,
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
      controlled_authorization_permission_review_gate_id: decision.controlled_authorization_permission_review_gate_id || reviewPacket.controlled_authorization_permission_review_gate_id || "",
      controlled_authorization_permission_preflight_id: decision.controlled_authorization_permission_preflight_id || reviewPacket.controlled_authorization_permission_preflight_id || "",
      founder_authorization_instruction_gate_id: decision.founder_authorization_instruction_gate_id || reviewPacket.founder_authorization_instruction_gate_id || "",
      controlled_authorization_review_gate_id: decision.controlled_authorization_review_gate_id || reviewPacket.controlled_authorization_review_gate_id || "",
      controlled_execution_packet_authorization_draft_id: decision.controlled_execution_packet_authorization_draft_id || reviewPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: decision.founder_authorization_decision_gate_id || reviewPacket.founder_authorization_decision_gate_id || "",
      source_answer_id: decision.source_answer_id || reviewPacket.source_answer_id || "",
      source_record_id: decision.source_record_id || reviewPacket.source_record_id || "",
      source_family: decision.source_family || reviewPacket.source_family || "",
      review_route: decision.review_route || reviewPacket.review_route || "",
      founder_question: decision.founder_question || reviewPacket.founder_question || "",
      permission_question: decision.permission_question || reviewPacket.permission_question || "",
      authority_flag_audit: decision.authority_flag_audit || reviewPacket.authority_flag_audit || "",
      decision_actor: decision.decision_actor || "",
      founder_name: decision.founder_name || "",
      decision_scope: decision.decision_scope || "",
      founder_decision_language: decision.founder_decision_language || "",
      decision_rationale: decision.decision_rationale || "",
      decision_evidence_summary: decision.decision_evidence_summary || "",
      evidence_lock: decision.evidence_lock || "",
      non_execution_decision_clause: decision.non_execution_decision_clause || "",
      risk_acknowledgment: decision.risk_acknowledgment || "",
      rollback_condition: decision.rollback_condition || "",
      monitoring_condition: decision.monitoring_condition || "",
      stop_condition: decision.stop_condition || "",
      expiry_check: decision.expiry_check || "",
      production_boundary: decision.production_boundary || "",
      clarification_question: decision.clarification_question || "",
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
      ready: byStatus["Decision ready for controlled hold"] || 0,
      blocked: decisions.filter((decision) => String(decision.decision_status || "").startsWith("Blocked")).length,
      holds: byStatus["Decision hold"] || 0,
      expired: byStatus["Decision expired"] || 0,
      permission_granted: decisions.filter((decision) => decision.permission_granted || decision.authorization_permission_granted || decision.permission_review_approved || decision.founder_permission_granted).length,
      execution_enabled: decisions.filter((decision) => decision.execution_allowed || decision.execution_authorized || decision.execution_packet_authorized || decision.storage_write_enabled || decision.source_write_executed || decision.production_ready || decision.public_release_allowed).length
    };
  }

  function parseJson(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function card(label, value, tone = "") {
    return '<article class="founder-permission-card ' + safe(tone) + '"><span>' + safe(label) + '</span><strong>' + safe(value ?? "None") + '</strong></article>';
  }

  function renderResult(decision) {
    if (!resultCard) return;
    const issues = [...(decision.missing || []), ...(decision.blocked || [])];
    resultCard.dataset.state = decision.decision_status;
    resultCard.innerHTML = '<strong>' + safe(decision.decision_status) + '</strong>' +
      '<p class="muted">Decision ready: ' + safe(decision.controlled_founder_permission_decision_gate_ready) + ' | Permission: ' + safe(decision.permission_granted) + ' | Execution: ' + safe(decision.execution_allowed) + '</p>' +
      '<div class="founder-permission-grid">' +
        card("Review gate", decision.controlled_authorization_permission_review_gate_id, decision.controlled_founder_permission_decision_gate_ready ? "ready" : "") +
        card("Route", decision.review_route) +
        card("Source answer", decision.source_answer_id) +
        card("Next gate", decision.next_gate_required) +
        card("Production", decision.production_ready ? "open" : "false", decision.production_ready ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for controlled permission execution hold. Permission, authorization, execution, storage write, canonical update, public release, and production launch remain false.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.decision_checks.map((check) =>
      '<article class="founder-permission-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Permission review", config.source.controlled_authorization_permission_review_gate_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function renderQuestionHandoff(config) {
    if (!handoffRoot) return;
    const packet = config.sample_permission_review_packet || {};
    handoffRoot.innerHTML =
      '<article class="founder-decision-question"><span>Review route</span><strong>' + safe(packet.review_route) + '</strong><p class="muted">This route must match before the founder decision can be ready.</p></article>' +
      '<article class="founder-decision-question"><span>Founder question</span><strong>' + safe(packet.founder_question) + '</strong></article>' +
      '<article class="founder-decision-question"><span>Permission question</span><strong>' + safe(packet.permission_question) + '</strong></article>' +
      '<article class="founder-decision-question"><span>Next gate</span><strong>' + safe(config.boundary.next_gate_required) + '</strong><p class="muted">Decision readiness moves only to hold, never to execution.</p></article>';
  }

  function renderAuthorityFlags(config) {
    if (!flagsRoot) return;
    const audit = String((config.sample_permission_review_packet || {}).authority_flag_audit || "");
    const flags = [
      "execution_packet_authorized",
      "execution_authorized",
      "execution_allowed",
      "founder_instruction_granted",
      "source_promotion_allowed",
      "implementation_authorized",
      "storage_write_enabled",
      "canonical_write_allowed",
      "source_write_executed",
      "actual_storage_write_executed",
      "production_ready",
      "public_release_allowed"
    ];
    flagsRoot.innerHTML = flags.map((flag) => {
      const isFalse = new RegExp(flag + "=false", "i").test(audit);
      return '<article class="founder-decision-flag"><span>' + safe(flag) + '</span><strong>' + safe(isFalse ? "false" : "missing") + '</strong></article>';
    }).join("");
  }

  function readSaved() {
    const saved = parseJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(decisions) {
    localStorage.setItem(storageKey, JSON.stringify(decisions.slice(-20)));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const decisions = readSaved();
    const snapshot = founderDecisionSnapshot(decisions, config);
    savedRoot.innerHTML = card("Saved", snapshot.saved_decisions) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Permission granted", snapshot.permission_granted, snapshot.permission_granted ? "blocked" : "ready") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      decisions.slice(-4).reverse().map((decision) =>
        '<article class="founder-permission-card ' + (decision.controlled_founder_permission_decision_gate_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(decision.created_at) + '</span>' +
        '<strong>' + safe(decision.decision_status) + '</strong>' +
        '<span>' + safe(decision.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathFounderPermissionDecisionGate = {
    founderPermissionDecisionGate,
    founderDecisionSnapshot,
    permissionReviewReady,
    hasUnsafeAuthority,
    keepsAuthorityFlagAudit,
    keepsNonExecutionDecisionBoundary
  };

  if (!root || !pageDocument) return;

  fetch("data/vedapath-founder-permission-decision-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        packet: pageDocument.getElementById("founderDecisionReviewPacket"),
        route: pageDocument.getElementById("founderDecisionReviewRoute"),
        founderQuestion: pageDocument.getElementById("founderDecisionFounderQuestion"),
        permissionQuestion: pageDocument.getElementById("founderDecisionPermissionQuestion"),
        authorityAudit: pageDocument.getElementById("founderDecisionAuthorityAudit"),
        state: pageDocument.getElementById("founderDecisionState"),
        actor: pageDocument.getElementById("founderDecisionActor"),
        founder: pageDocument.getElementById("founderDecisionName"),
        decisionId: pageDocument.getElementById("founderDecisionId"),
        permissionReviewId: pageDocument.getElementById("founderDecisionPermissionReviewId"),
        preflightId: pageDocument.getElementById("founderDecisionPreflightId"),
        instructionGateId: pageDocument.getElementById("founderDecisionInstructionGateId"),
        reviewGateId: pageDocument.getElementById("founderDecisionAuthorizationReviewGateId"),
        draftId: pageDocument.getElementById("founderDecisionDraftId"),
        decisionGateId: pageDocument.getElementById("founderDecisionPriorGateId"),
        sourceAnswer: pageDocument.getElementById("founderDecisionSourceAnswer"),
        sourceRecord: pageDocument.getElementById("founderDecisionSourceRecord"),
        sourceFamily: pageDocument.getElementById("founderDecisionSourceFamily"),
        scope: pageDocument.getElementById("founderDecisionScopeText"),
        language: pageDocument.getElementById("founderDecisionLanguage"),
        rationale: pageDocument.getElementById("founderDecisionRationale"),
        summary: pageDocument.getElementById("founderDecisionSummary"),
        evidenceLock: pageDocument.getElementById("founderDecisionEvidenceLock"),
        boundary: pageDocument.getElementById("founderDecisionBoundary"),
        risk: pageDocument.getElementById("founderDecisionRisk"),
        rollback: pageDocument.getElementById("founderDecisionRollback"),
        monitoring: pageDocument.getElementById("founderDecisionMonitoring"),
        stop: pageDocument.getElementById("founderDecisionStopCondition"),
        expiry: pageDocument.getElementById("founderDecisionExpiry"),
        production: pageDocument.getElementById("founderDecisionProductionBoundary"),
        clarification: pageDocument.getElementById("founderDecisionClarification"),
        returnReason: pageDocument.getElementById("founderDecisionReturnReason"),
        holdReason: pageDocument.getElementById("founderDecisionHoldReason"),
        blockReason: pageDocument.getElementById("founderDecisionBlockReason")
      };

      fields.state.innerHTML = config.decision_states.map((state) => '<option>' + safe(state) + '</option>').join("");

      function setFields(sample = config.sample_decision) {
        fields.packet.value = JSON.stringify(config.sample_permission_review_packet, null, 2);
        fields.route.value = sample.review_route;
        fields.founderQuestion.value = sample.founder_question;
        fields.permissionQuestion.value = sample.permission_question;
        fields.authorityAudit.value = sample.authority_flag_audit;
        fields.state.value = sample.decision_state;
        fields.actor.value = sample.decision_actor;
        fields.founder.value = sample.founder_name;
        fields.decisionId.value = sample.controlled_founder_permission_decision_gate_id;
        fields.permissionReviewId.value = sample.controlled_authorization_permission_review_gate_id;
        fields.preflightId.value = sample.controlled_authorization_permission_preflight_id;
        fields.instructionGateId.value = sample.founder_authorization_instruction_gate_id;
        fields.reviewGateId.value = sample.controlled_authorization_review_gate_id;
        fields.draftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.scope.value = sample.decision_scope;
        fields.language.value = sample.founder_decision_language;
        fields.rationale.value = sample.decision_rationale;
        fields.summary.value = sample.decision_evidence_summary;
        fields.evidenceLock.value = sample.evidence_lock;
        fields.boundary.value = sample.non_execution_decision_clause;
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

      function buildDecision() {
        return {
          decision_state: fields.state.value,
          review_route: fields.route.value,
          founder_question: fields.founderQuestion.value,
          permission_question: fields.permissionQuestion.value,
          authority_flag_audit: fields.authorityAudit.value,
          decision_actor: fields.actor.value,
          founder_name: fields.founder.value,
          controlled_founder_permission_decision_gate_id: fields.decisionId.value,
          controlled_authorization_permission_review_gate_id: fields.permissionReviewId.value,
          controlled_authorization_permission_preflight_id: fields.preflightId.value,
          founder_authorization_instruction_gate_id: fields.instructionGateId.value,
          controlled_authorization_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_authorization_draft_id: fields.draftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          decision_scope: fields.scope.value,
          founder_decision_language: fields.language.value,
          decision_rationale: fields.rationale.value,
          decision_evidence_summary: fields.summary.value,
          evidence_lock: fields.evidenceLock.value,
          non_execution_decision_clause: fields.boundary.value,
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
        const decision = founderPermissionDecisionGate(config, packet, buildDecision());
        renderResult(decision);
        if (output) output.value = JSON.stringify(decision, null, 2);
        return decision;
      }

      pageDocument.getElementById("runFounderDecision").addEventListener("click", run);
      pageDocument.getElementById("loadFounderDecisionSample").addEventListener("click", () => { setFields(); run(); });
      pageDocument.getElementById("saveFounderDecision").addEventListener("click", () => {
        const decision = run();
        const saved = readSaved();
        saved.push(decision);
        writeSaved(saved);
        renderSaved(config);
      });
      pageDocument.getElementById("clearFounderDecisions").addEventListener("click", () => {
        writeSaved([]);
        renderSaved(config);
      });
      pageDocument.getElementById("copyFounderDecision").addEventListener("click", () => {
        const decision = run();
        navigator.clipboard?.writeText(JSON.stringify(decision, null, 2));
      });

      renderChecks(config);
      renderScope(config);
      renderQuestionHandoff(config);
      renderAuthorityFlags(config);
      setFields();
      renderSaved(config);
      run();
    });
})();

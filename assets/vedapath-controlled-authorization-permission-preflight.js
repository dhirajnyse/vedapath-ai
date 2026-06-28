(() => {
  const storageKey = "vedapath-controlled-authorization-permission-preflight";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("controlledAuthorizationPermissionPreflight") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("permissionPreflightSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("permissionPreflightResultCard") : null;
  const output = pageDocument ? pageDocument.getElementById("permissionPreflightOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("permissionPreflightChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("permissionPreflightScope") : null;
  const handoffRoot = pageDocument ? pageDocument.getElementById("permissionPreflightQuestionHandoff") : null;
  const flagsRoot = pageDocument ? pageDocument.getElementById("permissionPreflightAuthorityFlags") : null;

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

  function founderInstructionReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "founder-authorization-instruction-gate-v2" &&
      packet.instruction_status === "Founder instruction ready" &&
      packet.review_route === "Ready for founder instruction" &&
      packet.authorization_review_ready === true &&
      packet.controlled_authorization_review_gate_ready === true &&
      packet.founder_authorization_instruction_ready === true &&
      packet.founder_instruction_signal_recorded === true &&
      packet.controlled_founder_authorization_instruction_gate_ready === true &&
      hasText(packet.founder_question, [["founder question"], ["exact reviewed"], ["source-locked"], ["controlled authorization permission preflight"], ["authorization"], ["execution"], ["storage"], ["public release"], ["production"], ["false"]]) &&
      keepsAuthorityFlagAudit(packet.authority_flag_audit) &&
      packet.permission_granted !== true &&
      packet.authorization_permission_granted !== true &&
      packet.permission_review_approved !== true &&
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
      packet.next_gate_required === "Controlled authorization permission preflight";
  }

  function hasUnsafeAuthority(value) {
    return /(permission granted|permission approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsNonPermissionBoundary(value) {
    const text = String(value || "");
    const required = [
      /founder_authorization_instruction_ready may be true/i,
      /founder_instruction_signal_recorded may be true/i,
      /controlled_founder_authorization_instruction_gate_ready may be true/i,
      /controlled_authorization_permission_preflight_ready may be true/i,
      /permission_preflight_signal_recorded may be true/i,
      /permission_review_candidate_ready may be true/i,
      /permission_granted remains false/i,
      /authorization_permission_granted remains false/i,
      /permission_review_approved remains false/i,
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

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function preflightMissingForState(config, state, preflight = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(preflight[field] || "").trim());
  }

  function idMatches(preflight, packet, key) {
    return !preflight[key] || !packet[key] || preflight[key] === packet[key];
  }

  function controlledAuthorizationPermissionPreflight(config, founderInstructionPacket, preflight) {
    const state = preflight.preflight_state || "Draft preflight";
    const missing = preflightMissingForState(config, state, preflight);
    const blocked = [];

    if (!founderInstructionReady(founderInstructionPacket)) {
      blocked.push("founder instruction signal must be ready while permission, authorization, execution, storage, canonical, public release, and production flags remain false");
    }

    ["founder_authorization_instruction_gate_id", "controlled_authorization_review_gate_id", "controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(preflight, founderInstructionPacket, key)) blocked.push(key + " must match the founder instruction packet");
    });
    if (preflight.review_route && preflight.review_route !== founderInstructionPacket.review_route) {
      blocked.push("review route must carry the founder instruction packet route");
    }
    if (preflight.founder_question && preflight.founder_question !== founderInstructionPacket.founder_question) {
      blocked.push("founder question must match the founder instruction packet");
    }

    const eligibleCandidate = state === "Preflight eligible";
    if (eligibleCandidate && !hasText(preflight.preflight_scope, [["evaluate"], ["v3.4.0"], ["founder question"], ["founder instruction signal"], ["controlled authorization permission review"], ["not permission"], ["not authorization"], ["cannot", "execute"], ["promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("preflight scope must be permission-review only and explicitly block permission, authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (eligibleCandidate && hasUnsafeAuthority(preflight.permission_question)) {
      blocked.push("permission question must not grant permission, approve authorization, or open execution");
    }
    if (eligibleCandidate && !hasText(preflight.permission_question, [["controlled authorization permission review"], ["exact source packet"], ["founder question"], ["without granting permission"], ["authorization"], ["execution"], ["storage writes"], ["canonical writes"], ["public release"], ["production"]])) {
      blocked.push("permission question must ask for review language only and state that permission, authorization, execution, storage, canonical writes, public release, and production are not granted");
    }
    if (eligibleCandidate && !hasText(preflight.eligibility_summary, [["v3.4.0"], ["founder question"], ["founder instruction signal"], ["source ids"], ["locked"], ["review evidence"], ["rollback"], ["monitoring"], ["authority flag"], ["false"]])) {
      blocked.push("eligibility summary must keep source ids, review evidence, rollback, monitoring, and false authority flags visible");
    }
    if (eligibleCandidate && !hasText(preflight.evidence_lock, [["founder_authorization_instruction_gate_id"], ["controlled_authorization_review_gate_id"], ["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["source_answer_id"], ["source_record_id"], ["source family"], ["review route"], ["founder question"]])) {
      blocked.push("evidence lock must name instruction gate, review gate, authorization draft, founder decision, source answer, source record, source family, route, and founder question");
    }
    if (eligibleCandidate && !keepsNonPermissionBoundary(preflight.non_permission_clause)) {
      blocked.push("non-permission clause must keep preflight readiness as non-permission and all grant, authority, write, public release, and production flags false");
    }
    if (eligibleCandidate && !keepsAuthorityFlagAudit(preflight.authority_flag_audit)) {
      blocked.push("authority flag audit must carry every operational authority flag as false");
    }
    if (eligibleCandidate && !hasText(preflight.risk_acknowledgment, [["risk remains"], ["founder instruction mismatch"], ["review mismatch"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["permission wording ambiguity"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on mismatches, rights changes, ambiguity, missing rollback/monitoring, packet/code changes, or true authority flags");
    }
    if (eligibleCandidate && !hasText(preflight.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["controlled authorization permission review gate"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, next review gate, and no source state write");
    }
    if (eligibleCandidate && !hasText(preflight.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["controlled authorization permission review gate"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and next review gate");
    }
    if (eligibleCandidate && !hasText(preflight.stop_condition, [["stop"], ["founder instruction id mismatches"], ["review id mismatches"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["permission wording is ambiguous"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on instruction/review/source mismatches, rights changes, missing evidence, ambiguity, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (eligibleCandidate && !hasText(preflight.expiry_check, [["expires"], ["material founder instruction"], ["authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["founder decision"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not permission"]])) {
      blocked.push("expiry check must state that permission preflight expires and is not permission");
    }
    if (eligibleCandidate && !keepsProductionBoundary(preflight.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs founder clarification" && !preflight.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to instruction gate" && !preflight.return_reason) blocked.push("return reason is required");
    if (state === "Permission still blocked" && !preflight.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !preflight.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !preflight.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Preflight hold" && !preflight.hold_reason) blocked.push("hold reason is required");
    if (state === "Preflight expired" && !preflight.hold_reason) blocked.push("hold reason is required when preflight expires");

    const preflight_status = missing.length
      ? "Blocked: required permission preflight fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;
    const eligible = preflight_status === "Preflight eligible";

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_authorization_permission_preflight_id: preflight.controlled_authorization_permission_preflight_id || "controlled-authorization-permission-preflight-" + Date.now(),
      preflight_status,
      founder_authorization_instruction_ready: founderInstructionPacket.founder_authorization_instruction_ready === true,
      founder_instruction_signal_recorded: founderInstructionPacket.founder_instruction_signal_recorded === true,
      controlled_founder_authorization_instruction_gate_ready: founderInstructionPacket.controlled_founder_authorization_instruction_gate_ready === true,
      controlled_authorization_permission_preflight_ready: eligible,
      permission_preflight_signal_recorded: eligible,
      permission_review_candidate_ready: eligible,
      permission_granted: false,
      authorization_permission_granted: false,
      permission_review_approved: false,
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
      founder_authorization_instruction_gate_id: preflight.founder_authorization_instruction_gate_id || founderInstructionPacket.founder_authorization_instruction_gate_id || "",
      controlled_authorization_review_gate_id: preflight.controlled_authorization_review_gate_id || founderInstructionPacket.controlled_authorization_review_gate_id || "",
      controlled_execution_packet_authorization_draft_id: preflight.controlled_execution_packet_authorization_draft_id || founderInstructionPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: preflight.founder_authorization_decision_gate_id || founderInstructionPacket.founder_authorization_decision_gate_id || "",
      controlled_execution_authorization_hold_id: preflight.controlled_execution_authorization_hold_id || founderInstructionPacket.controlled_execution_authorization_hold_id || "",
      controlled_execution_review_gate_id: preflight.controlled_execution_review_gate_id || founderInstructionPacket.controlled_execution_review_gate_id || "",
      controlled_execution_packet_draft_id: preflight.controlled_execution_packet_draft_id || founderInstructionPacket.controlled_execution_packet_draft_id || "",
      source_answer_id: preflight.source_answer_id || founderInstructionPacket.source_answer_id || "",
      source_record_id: preflight.source_record_id || founderInstructionPacket.source_record_id || "",
      source_family: preflight.source_family || founderInstructionPacket.source_family || "",
      review_route: preflight.review_route || founderInstructionPacket.review_route || "",
      founder_question: preflight.founder_question || founderInstructionPacket.founder_question || "",
      preflight_actor: preflight.preflight_actor || "",
      reviewer_name: preflight.reviewer_name || "",
      preflight_scope: preflight.preflight_scope || "",
      permission_question: preflight.permission_question || "",
      eligibility_summary: preflight.eligibility_summary || "",
      evidence_lock: preflight.evidence_lock || "",
      non_permission_clause: preflight.non_permission_clause || "",
      authority_flag_audit: preflight.authority_flag_audit || founderInstructionPacket.authority_flag_audit || "",
      risk_acknowledgment: preflight.risk_acknowledgment || "",
      rollback_condition: preflight.rollback_condition || "",
      monitoring_condition: preflight.monitoring_condition || "",
      stop_condition: preflight.stop_condition || "",
      expiry_check: preflight.expiry_check || "",
      production_boundary: preflight.production_boundary || "",
      clarification_question: preflight.clarification_question || "",
      return_reason: preflight.return_reason || "",
      hold_reason: preflight.hold_reason || "",
      block_reason: preflight.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function permissionPreflightSnapshot(preflights, config) {
    const byStatus = preflights.reduce((counts, preflight) => {
      const key = preflight.preflight_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_preflights: preflights.length,
      eligible: byStatus["Preflight eligible"] || 0,
      blocked: preflights.filter((preflight) => String(preflight.preflight_status || "").startsWith("Blocked")).length,
      holds: byStatus["Preflight hold"] || 0,
      expired: byStatus["Preflight expired"] || 0,
      ready_questions: preflights.filter((preflight) => preflight.founder_question && preflight.controlled_authorization_permission_preflight_ready).length,
      permission_granted: preflights.filter((preflight) => preflight.permission_granted || preflight.authorization_permission_granted || preflight.permission_review_approved).length,
      execution_enabled: preflights.filter((preflight) => preflight.execution_allowed || preflight.execution_authorized || preflight.execution_packet_authorized || preflight.storage_write_enabled || preflight.source_write_executed || preflight.production_ready || preflight.public_release_allowed).length
    };
  }

  function parseJson(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function card(label, value, tone = "") {
    return '<article class="permission-preflight-card ' + safe(tone) + '"><span>' + safe(label) + '</span><strong>' + safe(value || "None") + '</strong></article>';
  }

  function renderResult(preflight) {
    if (!resultCard) return;
    const issues = [...(preflight.missing || []), ...(preflight.blocked || [])];
    resultCard.dataset.state = preflight.preflight_status;
    resultCard.innerHTML = '<strong>' + safe(preflight.preflight_status) + '</strong>' +
      '<p class="muted">Preflight ready: ' + safe(preflight.controlled_authorization_permission_preflight_ready) + ' | Permission: ' + safe(preflight.permission_granted) + ' | Execution: ' + safe(preflight.execution_allowed) + '</p>' +
      '<div class="permission-preflight-grid">' +
        card("Instruction gate", preflight.founder_authorization_instruction_gate_id, preflight.controlled_authorization_permission_preflight_ready ? "ready" : "") +
        card("Founder question", preflight.founder_question ? "carried" : "missing", preflight.founder_question ? "ready" : "blocked") +
        card("Review route", preflight.review_route) +
        card("Source answer", preflight.source_answer_id) +
        card("Next gate", preflight.next_gate_required) +
        card("Production", preflight.production_ready ? "open" : "false", preflight.production_ready ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Eligible for controlled permission review. Permission, authorization, execution, storage write, canonical update, public release, and production launch remain false.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.preflight_checks.map((check) =>
      '<article class="permission-preflight-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Instruction gate", config.source.founder_authorization_instruction_gate_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function renderQuestionHandoff(config) {
    if (!handoffRoot) return;
    const sample = config.sample_preflight || {};
    handoffRoot.innerHTML = card("Route", sample.review_route || "Missing", sample.review_route ? "ready" : "blocked") +
      card("Founder question", sample.founder_question ? "carried into preflight" : "missing", sample.founder_question ? "ready" : "blocked") +
      card("Preflight asks", "review language only") +
      card("Permission grant", "false", "ready");
  }

  function renderAuthorityFlags(config) {
    if (!flagsRoot) return;
    const flags = Object.entries(config.boundary || {}).filter(([key]) => key !== "next_gate_required");
    flagsRoot.innerHTML = flags.map(([key, value]) =>
      '<article class="permission-preflight-flag"><span>' + safe(key) + '</span><strong>' + safe(value) + '</strong></article>'
    ).join("");
  }

  function readSaved() {
    const saved = parseJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(preflights) {
    localStorage.setItem(storageKey, JSON.stringify(preflights.slice(-20)));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const preflights = readSaved();
    const snapshot = permissionPreflightSnapshot(preflights, config);
    savedRoot.innerHTML = card("Saved", snapshot.saved_preflights) +
      card("Eligible", snapshot.eligible, snapshot.eligible ? "ready" : "") +
      card("Permission granted", snapshot.permission_granted, snapshot.permission_granted ? "blocked" : "ready") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      preflights.slice(-4).reverse().map((preflight) =>
        '<article class="permission-preflight-card ' + (preflight.controlled_authorization_permission_preflight_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(preflight.created_at) + '</span>' +
        '<strong>' + safe(preflight.preflight_status) + '</strong>' +
        '<span>' + safe(preflight.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledAuthorizationPermissionPreflight = {
    controlledAuthorizationPermissionPreflight,
    permissionPreflightSnapshot,
    founderInstructionReady,
    hasUnsafeAuthority,
    keepsNonPermissionBoundary,
    keepsAuthorityFlagAudit
  };

  if (!root || !pageDocument) return;

  fetch("data/vedapath-controlled-authorization-permission-preflight.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        packet: pageDocument.getElementById("permissionPreflightFounderInstruction"),
        state: pageDocument.getElementById("permissionPreflightState"),
        actor: pageDocument.getElementById("permissionPreflightActor"),
        reviewer: pageDocument.getElementById("permissionPreflightReviewer"),
        preflightId: pageDocument.getElementById("permissionPreflightId"),
        instructionGateId: pageDocument.getElementById("permissionPreflightInstructionGateId"),
        reviewGateId: pageDocument.getElementById("permissionPreflightReviewGateId"),
        draftId: pageDocument.getElementById("permissionPreflightDraftId"),
        decisionGateId: pageDocument.getElementById("permissionPreflightDecisionGateId"),
        sourceAnswer: pageDocument.getElementById("permissionPreflightSourceAnswer"),
        sourceRecord: pageDocument.getElementById("permissionPreflightSourceRecord"),
        sourceFamily: pageDocument.getElementById("permissionPreflightSourceFamily"),
        reviewRoute: pageDocument.getElementById("permissionPreflightReviewRoute"),
        founderQuestion: pageDocument.getElementById("permissionPreflightFounderQuestion"),
        scope: pageDocument.getElementById("permissionPreflightScopeText"),
        question: pageDocument.getElementById("permissionPreflightQuestion"),
        summary: pageDocument.getElementById("permissionPreflightSummary"),
        evidence: pageDocument.getElementById("permissionPreflightEvidence"),
        boundary: pageDocument.getElementById("permissionPreflightBoundary"),
        flagAudit: pageDocument.getElementById("permissionPreflightFlagAudit"),
        risk: pageDocument.getElementById("permissionPreflightRisk"),
        rollback: pageDocument.getElementById("permissionPreflightRollback"),
        monitoring: pageDocument.getElementById("permissionPreflightMonitoring"),
        stop: pageDocument.getElementById("permissionPreflightStopCondition"),
        expiry: pageDocument.getElementById("permissionPreflightExpiry"),
        production: pageDocument.getElementById("permissionPreflightProductionBoundary"),
        clarification: pageDocument.getElementById("permissionPreflightQuestionForFounder"),
        returnReason: pageDocument.getElementById("permissionPreflightReturnReason"),
        holdReason: pageDocument.getElementById("permissionPreflightHoldReason"),
        blockReason: pageDocument.getElementById("permissionPreflightBlockReason")
      };

      fields.state.innerHTML = config.preflight_states.map((state) => '<option>' + safe(state) + '</option>').join("");

      function setFields(sample = config.sample_preflight) {
        fields.packet.value = JSON.stringify(config.sample_founder_instruction_signal, null, 2);
        fields.state.value = sample.preflight_state;
        fields.actor.value = sample.preflight_actor;
        fields.reviewer.value = sample.reviewer_name;
        fields.preflightId.value = sample.controlled_authorization_permission_preflight_id;
        fields.instructionGateId.value = sample.founder_authorization_instruction_gate_id;
        fields.reviewGateId.value = sample.controlled_authorization_review_gate_id;
        fields.draftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.reviewRoute.value = sample.review_route || "";
        fields.founderQuestion.value = sample.founder_question || "";
        fields.scope.value = sample.preflight_scope;
        fields.question.value = sample.permission_question;
        fields.summary.value = sample.eligibility_summary;
        fields.evidence.value = sample.evidence_lock;
        fields.boundary.value = sample.non_permission_clause;
        fields.flagAudit.value = sample.authority_flag_audit || config.sample_founder_instruction_signal.authority_flag_audit || "";
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

      function buildPreflight() {
        return {
          preflight_state: fields.state.value,
          preflight_actor: fields.actor.value,
          reviewer_name: fields.reviewer.value,
          controlled_authorization_permission_preflight_id: fields.preflightId.value,
          founder_authorization_instruction_gate_id: fields.instructionGateId.value,
          controlled_authorization_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_authorization_draft_id: fields.draftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          review_route: fields.reviewRoute.value,
          founder_question: fields.founderQuestion.value,
          preflight_scope: fields.scope.value,
          permission_question: fields.question.value,
          eligibility_summary: fields.summary.value,
          evidence_lock: fields.evidence.value,
          non_permission_clause: fields.boundary.value,
          authority_flag_audit: fields.flagAudit.value,
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
        const preflight = controlledAuthorizationPermissionPreflight(config, packet, buildPreflight());
        renderResult(preflight);
        if (output) output.value = JSON.stringify(preflight, null, 2);
        return preflight;
      }

      pageDocument.getElementById("runPermissionPreflight").addEventListener("click", run);
      pageDocument.getElementById("loadPermissionPreflightSample").addEventListener("click", () => { setFields(); run(); });
      pageDocument.getElementById("savePermissionPreflight").addEventListener("click", () => {
        const preflight = run();
        const saved = readSaved();
        saved.push(preflight);
        writeSaved(saved);
        renderSaved(config);
      });
      pageDocument.getElementById("clearPermissionPreflights").addEventListener("click", () => {
        writeSaved([]);
        renderSaved(config);
      });
      pageDocument.getElementById("copyPermissionPreflight").addEventListener("click", () => {
        const preflight = run();
        navigator.clipboard?.writeText(JSON.stringify(preflight, null, 2));
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

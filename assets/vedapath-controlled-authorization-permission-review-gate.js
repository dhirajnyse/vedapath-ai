(() => {
  const storageKey = "vedapath-controlled-authorization-permission-review-gate";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("controlledAuthorizationPermissionReviewGate") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("permissionReviewSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("permissionReviewResultCard") : null;
  const output = pageDocument ? pageDocument.getElementById("permissionReviewOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("permissionReviewChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("permissionReviewScope") : null;
  const handoffRoot = pageDocument ? pageDocument.getElementById("permissionReviewQuestionHandoff") : null;
  const flagsRoot = pageDocument ? pageDocument.getElementById("permissionReviewAuthorityFlags") : null;

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

  function permissionPreflightReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-authorization-permission-preflight-v2" &&
      packet.preflight_status === "Preflight eligible" &&
      packet.controlled_authorization_permission_preflight_ready === true &&
      packet.permission_preflight_signal_recorded === true &&
      packet.permission_review_candidate_ready === true &&
      packet.review_route === "Ready for founder instruction" &&
      hasText(packet.founder_question, [["founder question"], ["exact reviewed"], ["source-locked"], ["controlled authorization permission preflight"], ["authorization"], ["execution"], ["storage"], ["public release"], ["production"], ["false"]]) &&
      hasText(packet.permission_question, [["controlled authorization permission review"], ["exact source packet"], ["founder question"], ["without granting permission"], ["authorization"], ["execution"], ["storage writes"], ["canonical writes"], ["public release"], ["production"]]) &&
      keepsAuthorityFlagAudit(packet.authority_flag_audit) &&
      packet.permission_granted === false &&
      packet.authorization_permission_granted === false &&
      packet.permission_review_approved === false &&
      packet.founder_permission_granted !== true &&
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
      packet.next_gate_required === "Controlled authorization permission review gate";
  }

  function keepsAuthorityFlagAudit(value) {
    const text = String(value || "");
    return [
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
    ].every((pattern) => pattern.test(text)) && !hasUnsafeAuthority(text);
  }

  function hasUnsafeAuthority(value) {
    return /(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsNonPermissionReviewBoundary(value) {
    const text = String(value || "");
    const required = [
      /controlled_authorization_permission_preflight_ready may be true/i,
      /permission_preflight_signal_recorded may be true/i,
      /permission_review_candidate_ready may be true/i,
      /controlled_authorization_permission_review_ready may be true/i,
      /permission_review_signal_recorded may be true/i,
      /founder_permission_decision_candidate_ready may be true/i,
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

  function missingForState(config, state, review = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(review[field] || "").trim());
  }

  function idMatches(review, packet, key) {
    return !review[key] || !packet[key] || review[key] === packet[key];
  }

  function controlledAuthorizationPermissionReviewGate(config, preflightPacket, review) {
    const state = review.review_state || "Draft review";
    const missing = missingForState(config, state, review);
    const blocked = [];

    if (!permissionPreflightReady(preflightPacket)) {
      blocked.push("permission preflight must be eligible while permission, authorization, execution, storage, canonical, public release, and production flags remain false");
    }

    ["controlled_authorization_permission_preflight_id", "founder_authorization_instruction_gate_id", "controlled_authorization_review_gate_id", "controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(review, preflightPacket, key)) blocked.push(key + " must match the permission preflight packet");
    });
    if (review.review_route && review.review_route !== preflightPacket.review_route) {
      blocked.push("review route must carry the permission preflight route");
    }
    if (review.founder_question && review.founder_question !== preflightPacket.founder_question) {
      blocked.push("founder question must match the permission preflight packet");
    }
    if (review.permission_question && review.permission_question !== preflightPacket.permission_question) {
      blocked.push("permission question must match the permission preflight packet");
    }

    const readyCandidate = state === "Permission review ready";
    if (readyCandidate && !hasText(review.review_scope, [["review"], ["permission candidate"], ["controlled permission preflight"], ["v3.4.1"], ["founder question"], ["controlled authorization permission review"], ["not permission"], ["not authorization"], ["cannot", "execute"], ["promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("review scope must be permission-review only and explicitly block permission, authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && hasUnsafeAuthority(review.permission_review_language)) {
      blocked.push("permission review language must not grant permission, approve authorization, or open execution");
    }
    if (readyCandidate && !hasText(review.permission_review_language, [["later founder permission decision"], ["exact source packet"], ["founder question"], ["review readiness only"], ["permission is not granted"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("permission review language must prepare founder decision only and state permission is not granted, authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(review.review_rationale, [["permission preflight is eligible"], ["source-locked"], ["founder question"], ["permission review signal"], ["founder permission decision"], ["does not open"], ["operational authority"]])) {
      blocked.push("review rationale must keep the preflight source-locked and separate review readiness from authority");
    }
    if (readyCandidate && !hasText(review.review_evidence_summary, [["permission preflight eligible"], ["founder question"], ["review route"], ["authority flag audit"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["founder decision"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("review evidence summary must keep source and review evidence visible");
    }
    if (readyCandidate && !hasText(review.source_lock, [["controlled_authorization_permission_preflight_id"], ["founder_authorization_instruction_gate_id"], ["controlled_authorization_review_gate_id"], ["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["source_answer_id"], ["source_record_id"], ["source family"], ["review route"], ["founder question"]])) {
      blocked.push("source lock must name preflight, instruction gate, review gate, authorization draft, founder decision, source answer, source record, and source family");
    }
    if (readyCandidate && !keepsNonPermissionReviewBoundary(review.non_permission_review_clause)) {
      blocked.push("non-permission review clause must keep review readiness as non-permission and all grant, authority, write, public release, and production flags false");
    }
    if (readyCandidate && !keepsAuthorityFlagAudit(review.authority_flag_audit)) {
      blocked.push("authority flag audit must carry false authority, write, public release, and production flags");
    }
    if (readyCandidate && !hasText(review.risk_acknowledgment, [["risk remains"], ["preflight mismatch"], ["founder question mismatch"], ["review route mismatch"], ["authority flag audit mismatch"], ["founder instruction mismatch"], ["review mismatch"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["permission question ambiguity"], ["permission review ambiguity"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on mismatches, rights changes, ambiguity, missing rollback/monitoring, packet/code changes, or true authority flags");
    }
    if (readyCandidate && !hasText(review.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["founder permission decision gate"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, founder permission decision gate, and no source state write");
    }
    if (readyCandidate && !hasText(review.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["founder permission decision gate"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and founder decision gate");
    }
    if (readyCandidate && !hasText(review.stop_condition, [["stop"], ["preflight id mismatches"], ["founder instruction id mismatches"], ["review id mismatches"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["permission review is ambiguous"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on preflight/instruction/review/source mismatches, rights changes, missing evidence, ambiguity, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(review.expiry_check, [["expires"], ["material permission preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["founder decision"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not permission"]])) {
      blocked.push("expiry check must state that permission review expires and is not permission");
    }
    if (readyCandidate && !keepsProductionBoundary(review.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs reviewer clarification" && !review.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to preflight" && !review.return_reason) blocked.push("return reason is required");
    if (state === "Permission still blocked" && !review.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !review.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !review.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Review hold" && !review.hold_reason) blocked.push("hold reason is required");
    if (state === "Review expired" && !review.hold_reason) blocked.push("hold reason is required when review expires");

    const review_status = missing.length
      ? "Blocked: required permission review fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;
    const ready = review_status === "Permission review ready";

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_authorization_permission_review_gate_id: review.controlled_authorization_permission_review_gate_id || "controlled-authorization-permission-review-gate-" + Date.now(),
      review_status,
      controlled_authorization_permission_preflight_ready: preflightPacket.controlled_authorization_permission_preflight_ready === true,
      permission_preflight_signal_recorded: preflightPacket.permission_preflight_signal_recorded === true,
      permission_review_candidate_ready: preflightPacket.permission_review_candidate_ready === true,
      controlled_authorization_permission_review_ready: ready,
      permission_review_signal_recorded: ready,
      founder_permission_decision_candidate_ready: ready,
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
      controlled_authorization_permission_preflight_id: review.controlled_authorization_permission_preflight_id || preflightPacket.controlled_authorization_permission_preflight_id || "",
      founder_authorization_instruction_gate_id: review.founder_authorization_instruction_gate_id || preflightPacket.founder_authorization_instruction_gate_id || "",
      controlled_authorization_review_gate_id: review.controlled_authorization_review_gate_id || preflightPacket.controlled_authorization_review_gate_id || "",
      controlled_execution_packet_authorization_draft_id: review.controlled_execution_packet_authorization_draft_id || preflightPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: review.founder_authorization_decision_gate_id || preflightPacket.founder_authorization_decision_gate_id || "",
      source_answer_id: review.source_answer_id || preflightPacket.source_answer_id || "",
      source_record_id: review.source_record_id || preflightPacket.source_record_id || "",
      source_family: review.source_family || preflightPacket.source_family || "",
      review_route: review.review_route || preflightPacket.review_route || "",
      founder_question: review.founder_question || preflightPacket.founder_question || "",
      permission_question: review.permission_question || preflightPacket.permission_question || "",
      authority_flag_audit: review.authority_flag_audit || preflightPacket.authority_flag_audit || "",
      review_actor: review.review_actor || "",
      reviewer_name: review.reviewer_name || "",
      review_scope: review.review_scope || "",
      permission_review_language: review.permission_review_language || "",
      review_rationale: review.review_rationale || "",
      review_evidence_summary: review.review_evidence_summary || "",
      source_lock: review.source_lock || "",
      non_permission_review_clause: review.non_permission_review_clause || "",
      risk_acknowledgment: review.risk_acknowledgment || "",
      rollback_condition: review.rollback_condition || "",
      monitoring_condition: review.monitoring_condition || "",
      stop_condition: review.stop_condition || "",
      expiry_check: review.expiry_check || "",
      production_boundary: review.production_boundary || "",
      clarification_question: review.clarification_question || "",
      return_reason: review.return_reason || "",
      hold_reason: review.hold_reason || "",
      block_reason: review.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function permissionReviewSnapshot(reviews, config) {
    const byStatus = reviews.reduce((counts, review) => {
      const key = review.review_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_reviews: reviews.length,
      ready: byStatus["Permission review ready"] || 0,
      blocked: reviews.filter((review) => String(review.review_status || "").startsWith("Blocked")).length,
      holds: byStatus["Review hold"] || 0,
      expired: byStatus["Review expired"] || 0,
      ready_questions: reviews.filter((review) => review.founder_question && review.permission_question && review.review_route).length,
      permission_granted: reviews.filter((review) => review.permission_granted || review.authorization_permission_granted || review.permission_review_approved || review.founder_permission_granted).length,
      execution_enabled: reviews.filter((review) => review.execution_allowed || review.execution_authorized || review.execution_packet_authorized || review.storage_write_enabled || review.source_write_executed || review.production_ready || review.public_release_allowed).length
    };
  }

  function parseJson(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function card(label, value, tone = "") {
    const display = value === false || value === 0 ? value : (value || "None");
    return '<article class="permission-review-card ' + safe(tone) + '"><span>' + safe(label) + '</span><strong>' + safe(display) + '</strong></article>';
  }

  function renderResult(review) {
    if (!resultCard) return;
    const issues = [...(review.missing || []), ...(review.blocked || [])];
    resultCard.dataset.state = review.review_status;
    resultCard.innerHTML = '<strong>' + safe(review.review_status) + '</strong>' +
      '<p class="muted">Review ready: ' + safe(review.controlled_authorization_permission_review_ready) + ' | Permission: ' + safe(review.permission_granted) + ' | Execution: ' + safe(review.execution_allowed) + '</p>' +
      '<div class="permission-review-grid">' +
        card("Preflight", review.controlled_authorization_permission_preflight_id, review.controlled_authorization_permission_review_ready ? "ready" : "") +
        card("Route", review.review_route || "Missing", review.review_route ? "ready" : "blocked") +
        card("Founder question", review.founder_question ? "Carried" : "Missing", review.founder_question ? "ready" : "blocked") +
        card("Source answer", review.source_answer_id) +
        card("Next gate", review.next_gate_required) +
        card("Production", review.production_ready ? "open" : "false", review.production_ready ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for founder permission decision. Permission, authorization, execution, storage write, canonical update, public release, and production launch remain false.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.review_checks.map((check) =>
      '<article class="permission-review-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Preflight", config.source.controlled_authorization_permission_preflight_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function renderQuestionHandoff(config) {
    if (!handoffRoot) return;
    const packet = config.sample_permission_preflight_packet || {};
    handoffRoot.innerHTML = card("Review route", packet.review_route) +
      card("Founder question", packet.founder_question) +
      card("Permission question", packet.permission_question) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function renderAuthorityFlags(config) {
    if (!flagsRoot) return;
    const packet = config.sample_permission_preflight_packet || {};
    const flags = [
      ["Permission", packet.permission_granted],
      ["Authorization", packet.authorization_permission_granted],
      ["Execution", packet.execution_allowed],
      ["Storage", packet.storage_write_enabled],
      ["Canonical", packet.canonical_write_allowed],
      ["Public release", packet.public_release_allowed],
      ["Production", packet.production_ready],
      ["Flag audit", keepsAuthorityFlagAudit(packet.authority_flag_audit) ? "false-locked" : "missing"]
    ];
    flagsRoot.innerHTML = flags.map(([label, value]) =>
      '<article class="permission-review-flag ' + (value === false || value === "false-locked" ? "ready" : "blocked") + '">' +
      '<span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>'
    ).join("");
  }

  function readSaved() {
    const saved = parseJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(reviews) {
    localStorage.setItem(storageKey, JSON.stringify(reviews.slice(-20)));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const reviews = readSaved();
    const snapshot = permissionReviewSnapshot(reviews, config);
    savedRoot.innerHTML = card("Saved", snapshot.saved_reviews) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Question handoffs", snapshot.ready_questions, snapshot.ready_questions ? "ready" : "") +
      card("Permission granted", snapshot.permission_granted, snapshot.permission_granted ? "blocked" : "ready") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      reviews.slice(-4).reverse().map((review) =>
        '<article class="permission-review-card ' + (review.controlled_authorization_permission_review_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(review.created_at) + '</span>' +
        '<strong>' + safe(review.review_status) + '</strong>' +
        '<span>' + safe(review.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledAuthorizationPermissionReviewGate = {
    controlledAuthorizationPermissionReviewGate,
    permissionReviewSnapshot,
    permissionPreflightReady,
    hasUnsafeAuthority,
    keepsNonPermissionReviewBoundary,
    keepsAuthorityFlagAudit
  };

  if (!root || !pageDocument) return;

  fetch("data/vedapath-controlled-authorization-permission-review-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        packet: pageDocument.getElementById("permissionReviewPreflightPacket"),
        state: pageDocument.getElementById("permissionReviewState"),
        actor: pageDocument.getElementById("permissionReviewActor"),
        reviewer: pageDocument.getElementById("permissionReviewReviewer"),
        reviewId: pageDocument.getElementById("permissionReviewId"),
        preflightId: pageDocument.getElementById("permissionReviewPreflightId"),
        instructionGateId: pageDocument.getElementById("permissionReviewInstructionGateId"),
        reviewGateId: pageDocument.getElementById("permissionReviewAuthorizationReviewGateId"),
        draftId: pageDocument.getElementById("permissionReviewDraftId"),
        decisionGateId: pageDocument.getElementById("permissionReviewDecisionGateId"),
        sourceAnswer: pageDocument.getElementById("permissionReviewSourceAnswer"),
        sourceRecord: pageDocument.getElementById("permissionReviewSourceRecord"),
        sourceFamily: pageDocument.getElementById("permissionReviewSourceFamily"),
        route: pageDocument.getElementById("permissionReviewRoute"),
        founderQuestion: pageDocument.getElementById("permissionReviewFounderQuestion"),
        permissionQuestion: pageDocument.getElementById("permissionReviewPermissionQuestion"),
        scope: pageDocument.getElementById("permissionReviewScopeText"),
        language: pageDocument.getElementById("permissionReviewLanguage"),
        rationale: pageDocument.getElementById("permissionReviewRationale"),
        summary: pageDocument.getElementById("permissionReviewSummary"),
        sourceLock: pageDocument.getElementById("permissionReviewSourceLock"),
        boundary: pageDocument.getElementById("permissionReviewBoundary"),
        flagAudit: pageDocument.getElementById("permissionReviewFlagAudit"),
        risk: pageDocument.getElementById("permissionReviewRisk"),
        rollback: pageDocument.getElementById("permissionReviewRollback"),
        monitoring: pageDocument.getElementById("permissionReviewMonitoring"),
        stop: pageDocument.getElementById("permissionReviewStopCondition"),
        expiry: pageDocument.getElementById("permissionReviewExpiry"),
        production: pageDocument.getElementById("permissionReviewProductionBoundary"),
        clarification: pageDocument.getElementById("permissionReviewClarification"),
        returnReason: pageDocument.getElementById("permissionReviewReturnReason"),
        holdReason: pageDocument.getElementById("permissionReviewHoldReason"),
        blockReason: pageDocument.getElementById("permissionReviewBlockReason")
      };

      fields.state.innerHTML = config.review_states.map((state) => '<option>' + safe(state) + '</option>').join("");

      function setFields(sample = config.sample_review) {
        fields.packet.value = JSON.stringify(config.sample_permission_preflight_packet, null, 2);
        fields.state.value = sample.review_state;
        fields.actor.value = sample.review_actor;
        fields.reviewer.value = sample.reviewer_name;
        fields.reviewId.value = sample.controlled_authorization_permission_review_gate_id;
        fields.preflightId.value = sample.controlled_authorization_permission_preflight_id;
        fields.instructionGateId.value = sample.founder_authorization_instruction_gate_id;
        fields.reviewGateId.value = sample.controlled_authorization_review_gate_id;
        fields.draftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.route.value = sample.review_route;
        fields.founderQuestion.value = sample.founder_question;
        fields.permissionQuestion.value = sample.permission_question;
        fields.scope.value = sample.review_scope;
        fields.language.value = sample.permission_review_language;
        fields.rationale.value = sample.review_rationale;
        fields.summary.value = sample.review_evidence_summary;
        fields.sourceLock.value = sample.source_lock;
        fields.boundary.value = sample.non_permission_review_clause;
        fields.flagAudit.value = sample.authority_flag_audit;
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

      function buildReview() {
        return {
          review_state: fields.state.value,
          review_actor: fields.actor.value,
          reviewer_name: fields.reviewer.value,
          controlled_authorization_permission_review_gate_id: fields.reviewId.value,
          controlled_authorization_permission_preflight_id: fields.preflightId.value,
          founder_authorization_instruction_gate_id: fields.instructionGateId.value,
          controlled_authorization_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_authorization_draft_id: fields.draftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          review_route: fields.route.value,
          founder_question: fields.founderQuestion.value,
          permission_question: fields.permissionQuestion.value,
          review_scope: fields.scope.value,
          permission_review_language: fields.language.value,
          review_rationale: fields.rationale.value,
          review_evidence_summary: fields.summary.value,
          source_lock: fields.sourceLock.value,
          non_permission_review_clause: fields.boundary.value,
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
        const review = controlledAuthorizationPermissionReviewGate(config, packet, buildReview());
        renderResult(review);
        if (output) output.value = JSON.stringify(review, null, 2);
        return review;
      }

      pageDocument.getElementById("runPermissionReview").addEventListener("click", run);
      pageDocument.getElementById("loadPermissionReviewSample").addEventListener("click", () => { setFields(); run(); });
      pageDocument.getElementById("savePermissionReview").addEventListener("click", () => {
        const review = run();
        const saved = readSaved();
        saved.push(review);
        writeSaved(saved);
        renderSaved(config);
      });
      pageDocument.getElementById("clearPermissionReviews").addEventListener("click", () => {
        writeSaved([]);
        renderSaved(config);
      });
      pageDocument.getElementById("copyPermissionReview").addEventListener("click", () => {
        const review = run();
        navigator.clipboard?.writeText(JSON.stringify(review, null, 2));
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

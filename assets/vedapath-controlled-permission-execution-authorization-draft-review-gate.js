(function () {
  const configUrl = "data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json";
  const falseAuthorityFlags = [
  "permission_granted",
  "authorization_permission_granted",
  "permission_review_approved",
  "founder_permission_granted",
  "execution_packet_authorized",
  "execution_authorized",
  "execution_allowed",
  "founder_instruction_granted",
  "source_promotion_allowed",
  "promotion_execution_allowed",
  "implementation_authorized",
  "implementation_execution_allowed",
  "controlled_storage_entry_allowed",
  "storage_write_enabled",
  "canonical_write_allowed",
  "source_write_executed",
  "answer_changed",
  "retrieval_config_changed",
  "actual_storage_write_executed",
  "production_ready",
  "production_launch_allowed",
  "public_release_allowed"
];
  const draftPacketReadyFlags = [
    "founder_permission_execution_authorization_decision_ready",
    "founder_permission_execution_authorization_decision_recorded",
    "controlled_permission_execution_authorization_draft_candidate_ready",
    "controlled_permission_execution_authorization_draft_ready",
    "permission_execution_authorization_draft_recorded",
    "controlled_permission_execution_authorization_draft_review_candidate_ready"
  ];
  const handoffFields = [
    "review_route",
    "founder_question",
    "permission_question",
    "authority_flag_audit"
  ];
  const sourceIdentityFields = [
    "review_decision_gate_id",
    "controlled_permission_execution_authorization_draft_review_gate_id",
    "controlled_permission_execution_authorization_draft_gate_id",
    "founder_decision_gate_id",
    "founder_permission_execution_authorization_decision_gate_id",
    "authorization_review_gate_id",
    "permission_execution_authorization_preflight_id",
    "controlled_permission_execution_hold_id",
    "source_answer_id",
    "source_record_id",
    "source_family"
  ];
  const draftPacketTextFields = [
    "draft_scope",
    "draft_language",
    "draft_rationale",
    "draft_evidence_summary",
    "non_execution_draft_clause",
    "risk_acknowledgment",
    "rollback_condition",
    "monitoring_condition",
    "stop_condition",
    "expiry_check",
    "production_boundary",
    "clarification_question",
    "return_reason",
    "hold_reason",
    "block_reason"
  ];
  const blockedWords = /\b(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|answer changed|retrieval changed|retrieval config changed|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production now|launch production allowed|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|answer_changed true|retrieval_config_changed true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)\b/i;

  function compact(value) {
    return String(value || "").trim();
  }

  function get(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
  }

  function hasUnsafeAuthority(value) {
    return blockedWords.test(compact(value));
  }

  function allFlagsFalse(packet, flags) {
    return flags.every((flag) => get(packet, flag) === false);
  }

  function allFlagsTrue(packet, flags) {
    return flags.every((flag) => get(packet, flag) === true);
  }

  function noUnsafeDraftPacketText(packet) {
    return draftPacketTextFields.every((field) => !hasUnsafeAuthority(packet && packet[field]));
  }

  function matchesSourceHandoff(packet, config) {
    if (!packet || !config || !config.source) return false;
    return handoffFields.every((field) => compact(packet[field]) === compact(config.source[field]));
  }

  function matchesSourceIdentity(packet, config) {
    if (!packet || !config || !config.source) return false;
    return sourceIdentityFields.every((field) => compact(packet[field]) === compact(config.source[field]));
  }

  function reviewPreservesHandoff(review, draftPacket, config) {
    if (!review || !draftPacket || !config || !config.source) return false;
    const sourceOk = sourceIdentityFields.every((field) => {
      const value = compact(review[field]);
      return value && value === compact(draftPacket[field]) && value === compact(config.source[field]);
    });
    const handoffOk = handoffFields.every((field) => {
      const value = compact(review[field]);
      return value && value === compact(draftPacket[field]) && value === compact(config.source[field]);
    });
    return sourceOk && handoffOk;
  }

  function draftPacketReady(packet, config) {
    return Boolean(
      packet &&
      packet.schema_version === "controlled-permission-execution-authorization-draft-gate-v8" &&
      packet.release === "v4.0.0" &&
      packet.draft_status === "Controlled draft review candidate prepared; execution remains false." &&
      packet.next_gate_required === "Controlled permission execution authorization draft review gate re-entry" &&
      matchesSourceIdentity(packet, config) &&
      matchesSourceHandoff(packet, config) &&
      allFlagsTrue(packet, draftPacketReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags) &&
      noUnsafeDraftPacketText(packet)
    );
  }

  function keepsNonExecutionReviewBoundary(value) {
    const text = compact(value);
    if (!text || hasUnsafeAuthority(text)) return false;
    const mustMentionTrue = [
      "controlled_permission_execution_authorization_draft_review_ready may be true",
      "permission_execution_authorization_draft_review_recorded may be true",
      "founder_permission_execution_authorization_review_decision_candidate_ready may be true"
    ];
    const mustMentionFalse = falseAuthorityFlags.map((flag) => flag + " remains false");
    return mustMentionTrue.every((phrase) => text.includes(phrase)) &&
      mustMentionFalse.every((phrase) => text.includes(phrase));
  }

  function requiredMissing(config, state, review) {
    const required = (config.required_by_state && config.required_by_state[state]) || [];
    return required.filter((key) => !compact(review[key]));
  }

  function blocked(status, details) {
    return {
      draft_review_status: status,
      blocked: true,
      controlled_permission_execution_authorization_draft_review_ready: false,
      permission_execution_authorization_draft_review_recorded: false,
      founder_permission_execution_authorization_review_decision_candidate_ready: false,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      details
    };
  }

  function controlledPermissionExecutionAuthorizationDraftReviewGate(config, draftPacket, review) {
    if (!draftPacketReady(draftPacket, config)) {
      return blocked("Blocked: controlled draft packet must be the v4.0.0 non-authorizing draft candidate.", {
        next_gate_required: "Controlled permission execution authorization draft review gate re-entry"
      });
    }

    const state = compact(review && review.review_state) || "Draft review";
    const missing = requiredMissing(config, state, review || {});
    if (missing.length) {
      return blocked("Blocked: missing required fields for " + state + ".", { missing });
    }

    if (!reviewPreservesHandoff(review, draftPacket, config)) {
      return blocked("Blocked: review must preserve the v4.0.0 source identity, founder posture id, route, questions, and authority audit.", {
        required_source_identity: sourceIdentityFields,
        required_handoff: handoffFields
      });
    }

    const textFields = [
      "review_scope",
      "review_language",
      "review_notes",
      "review_evidence_summary",
      "risk_review",
      "rollback_review",
      "monitoring_review",
      "stop_condition",
      "expiry_check"
    ];
    for (const field of textFields) {
      if (hasUnsafeAuthority(review[field])) {
        return blocked("Blocked: " + field + " must not grant permission, authorization, or execution.", { field });
      }
    }

    if (!keepsNonExecutionReviewBoundary(review.non_execution_review_clause)) {
      return blocked("Blocked: non-execution review clause must keep authority false.", {});
    }

    if (!compact(review.review_scope).includes("v4.0.0") ||
        !compact(review.review_notes).includes("question handoff") ||
        !compact(review.review_notes).includes("source identity") ||
        !compact(review.review_evidence_summary).includes("authority flag audit")) {
      return blocked("Blocked: review text must name the v4.0.0 handoff, source identity, and authority audit.", {});
    }

    if (hasUnsafeAuthority(review.production_boundary) || !compact(review.production_boundary).includes("Production remains unavailable")) {
      return blocked("Blocked: production boundary must stay closed.", {});
    }

    if (state === "Needs draft review clarification") {
      return blocked("Needs clarification: answer the review question before founder decision readiness.", {
        clarification_question: review.clarification_question
      });
    }

    if (state === "Return to draft gate") {
      return blocked("Return: send packet back to draft gate.", { return_reason: review.return_reason });
    }

    if (state === "Draft review hold") {
      return blocked("Hold: draft review is paused.", { hold_reason: review.hold_reason });
    }

    if (state === "Draft review rejected" || state === "Authorization approval blocked" || state === "Execution blocked" || state === "Production forbidden") {
      return blocked("Blocked: " + (review.block_reason || state), { state });
    }

    if (state === "Draft review expired") {
      return blocked("Expired: recheck the draft packet and evidence.", { hold_reason: review.hold_reason });
    }

    if (state !== "Draft review ready for founder decision") {
      return blocked("Draft review: packet is not ready for controlled review decision.", { state });
    }

    return {
      schema_version: config.schema_version,
      release: config.release,
      draft_review_status: "Draft review ready for founder decision; execution remains false.",
      review_decision_gate_id: review.review_decision_gate_id,
      controlled_permission_execution_authorization_draft_review_gate_id: review.controlled_permission_execution_authorization_draft_review_gate_id,
      controlled_permission_execution_authorization_draft_gate_id: review.controlled_permission_execution_authorization_draft_gate_id,
      founder_decision_gate_id: review.founder_decision_gate_id,
      founder_permission_execution_authorization_decision_gate_id: review.founder_permission_execution_authorization_decision_gate_id,
      authorization_review_gate_id: review.authorization_review_gate_id,
      permission_execution_authorization_preflight_id: review.permission_execution_authorization_preflight_id,
      controlled_permission_execution_hold_id: review.controlled_permission_execution_hold_id,
      source_answer_id: review.source_answer_id,
      source_record_id: review.source_record_id,
      source_family: review.source_family,
      review_route: review.review_route,
      founder_question: review.founder_question,
      permission_question: review.permission_question,
      authority_flag_audit: review.authority_flag_audit,
      founder_permission_execution_authorization_decision_ready: draftPacket.founder_permission_execution_authorization_decision_ready === true,
      founder_permission_execution_authorization_decision_recorded: draftPacket.founder_permission_execution_authorization_decision_recorded === true,
      controlled_permission_execution_authorization_draft_candidate_ready: draftPacket.controlled_permission_execution_authorization_draft_candidate_ready === true,
      controlled_permission_execution_authorization_draft_ready: draftPacket.controlled_permission_execution_authorization_draft_ready === true,
      permission_execution_authorization_draft_recorded: draftPacket.permission_execution_authorization_draft_recorded === true,
      controlled_permission_execution_authorization_draft_review_candidate_ready: draftPacket.controlled_permission_execution_authorization_draft_review_candidate_ready === true,
      controlled_permission_execution_authorization_draft_review_ready: true,
      permission_execution_authorization_draft_review_recorded: true,
      founder_permission_execution_authorization_review_decision_candidate_ready: true,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      review_scope: review.review_scope,
      review_language: review.review_language,
      review_notes: review.review_notes,
      review_evidence_summary: review.review_evidence_summary,
      non_execution_review_clause: review.non_execution_review_clause,
      risk_review: review.risk_review,
      rollback_review: review.rollback_review,
      monitoring_review: review.monitoring_review,
      stop_condition: review.stop_condition,
      expiry_check: review.expiry_check,
      production_boundary: review.production_boundary,
      preserves_source_identity: sourceIdentityFields.every((field) => compact(review[field]) === compact(config.source[field])),
      preserves_review_route: compact(review.review_route) === compact(config.source.review_route),
      preserves_founder_question: compact(review.founder_question) === compact(config.source.founder_question),
      preserves_permission_question: compact(review.permission_question) === compact(config.source.permission_question),
      preserves_authority_flag_audit: compact(review.authority_flag_audit) === compact(config.source.authority_flag_audit),
      next_gate_required: "Controlled permission execution authorization review decision gate re-entry",
      created_at: new Date().toISOString()
    };
  }

  function reviewSnapshot(result) {
    return {
      status: result.draft_review_status,
      ready: result.controlled_permission_execution_authorization_draft_review_ready === true,
      founder_decision_candidate: result.founder_permission_execution_authorization_review_decision_candidate_ready === true,
      permission_granted: result.permission_granted === true,
      execution_allowed: result.execution_allowed === true,
      production_ready: result.production_ready === true,
      next_gate_required: result.next_gate_required || "None"
    };
  }

  function safeParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value == null ? "" : String(value);
  }

  function readValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }

  function renderCard(result) {
    const card = document.getElementById("draftReviewResultCard");
    if (!card) return;
    const snapshot = reviewSnapshot(result);
    card.dataset.state = snapshot.status || "Blocked";
    card.innerHTML = '<span>Draft review result</span>' +
      '<h2>' + snapshot.status + '</h2>' +
      '<div class="draft-review-list">' +
      '<div class="draft-review-card"><span>Review ready</span><strong>' + String(snapshot.ready) + '</strong></div>' +
      '<div class="draft-review-card"><span>Founder decision candidate</span><strong>' + String(snapshot.founder_decision_candidate) + '</strong></div>' +
      '<div class="draft-review-card"><span>Permission granted</span><strong>' + String(snapshot.permission_granted) + '</strong></div>' +
      '<div class="draft-review-card"><span>Execution allowed</span><strong>' + String(snapshot.execution_allowed) + '</strong></div>' +
      '</div>';
  }

  function renderList(id, items) {
    const root = document.getElementById(id);
    if (!root) return;
    root.innerHTML = items.map((item) => '<div class="draft-review-card"><span>' + item.label + '</span><strong>' + item.value + '</strong></div>').join("");
  }

  function loadConfig(config) {
    const review = config.sample_review;
    setValue("draftReviewPacket", JSON.stringify(config.sample_draft_packet, null, 2));
    setValue("draftReviewState", review.review_state);
    setValue("draftReviewActor", review.review_actor);
    setValue("draftReviewName", review.reviewer_name);
    setValue("draftReviewReviewDecisionId", review.review_decision_gate_id);
    setValue("draftReviewGateId", review.controlled_permission_execution_authorization_draft_review_gate_id);
    setValue("draftReviewDraftGateId", review.controlled_permission_execution_authorization_draft_gate_id);
    setValue("draftReviewDecisionId", review.founder_decision_gate_id);
    setValue("draftReviewFounderPostureId", review.founder_permission_execution_authorization_decision_gate_id);
    setValue("draftReviewReviewId", review.authorization_review_gate_id);
    setValue("draftReviewPreflightId", review.permission_execution_authorization_preflight_id);
    setValue("draftReviewHoldId", review.controlled_permission_execution_hold_id);
    setValue("draftReviewSourceAnswer", review.source_answer_id);
    setValue("draftReviewSourceRecord", review.source_record_id);
    setValue("draftReviewSourceFamily", review.source_family);
    setValue("draftReviewRoute", review.review_route);
    setValue("draftReviewFounderQuestion", review.founder_question);
    setValue("draftReviewPermissionQuestion", review.permission_question);
    setValue("draftReviewAuthorityAudit", review.authority_flag_audit);
    setValue("draftReviewScopeText", review.review_scope);
    setValue("draftReviewLanguage", review.review_language);
    setValue("draftReviewNotes", review.review_notes);
    setValue("draftReviewSummary", review.review_evidence_summary);
    setValue("draftReviewBoundary", review.non_execution_review_clause);
    setValue("draftReviewRisk", review.risk_review);
    setValue("draftReviewRollback", review.rollback_review);
    setValue("draftReviewMonitoring", review.monitoring_review);
    setValue("draftReviewStopCondition", review.stop_condition);
    setValue("draftReviewExpiry", review.expiry_check);
    setValue("draftReviewProductionBoundary", review.production_boundary);
    setValue("draftReviewClarification", review.clarification_question);
    setValue("draftReviewReturnReason", review.return_reason);
    setValue("draftReviewHoldReason", review.hold_reason);
    setValue("draftReviewBlockReason", review.block_reason);
    renderList("draftReviewScope", [
      { label: "Input", value: "v4.0.0 draft packet" },
      { label: "Output", value: "Controlled review decision candidate" },
      { label: "Founder posture", value: "Preserved" },
      { label: "Source identity", value: "Preserved" },
      { label: "Question handoff", value: "Preserved" },
      { label: "Authority", value: "Closed" }
    ]);
    renderList("draftReviewChecks", config.review_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readReview() {
    return {
      review_state: readValue("draftReviewState"),
      review_actor: readValue("draftReviewActor"),
      reviewer_name: readValue("draftReviewName"),
      review_decision_gate_id: readValue("draftReviewReviewDecisionId"),
      controlled_permission_execution_authorization_draft_review_gate_id: readValue("draftReviewGateId"),
      controlled_permission_execution_authorization_draft_gate_id: readValue("draftReviewDraftGateId"),
      founder_decision_gate_id: readValue("draftReviewDecisionId"),
      founder_permission_execution_authorization_decision_gate_id: readValue("draftReviewFounderPostureId"),
      authorization_review_gate_id: readValue("draftReviewReviewId"),
      permission_execution_authorization_preflight_id: readValue("draftReviewPreflightId"),
      controlled_permission_execution_hold_id: readValue("draftReviewHoldId"),
      source_answer_id: readValue("draftReviewSourceAnswer"),
      source_record_id: readValue("draftReviewSourceRecord"),
      source_family: readValue("draftReviewSourceFamily"),
      review_route: readValue("draftReviewRoute"),
      founder_question: readValue("draftReviewFounderQuestion"),
      permission_question: readValue("draftReviewPermissionQuestion"),
      authority_flag_audit: readValue("draftReviewAuthorityAudit"),
      review_scope: readValue("draftReviewScopeText"),
      review_language: readValue("draftReviewLanguage"),
      review_notes: readValue("draftReviewNotes"),
      review_evidence_summary: readValue("draftReviewSummary"),
      non_execution_review_clause: readValue("draftReviewBoundary"),
      risk_review: readValue("draftReviewRisk"),
      rollback_review: readValue("draftReviewRollback"),
      monitoring_review: readValue("draftReviewMonitoring"),
      stop_condition: readValue("draftReviewStopCondition"),
      expiry_check: readValue("draftReviewExpiry"),
      production_boundary: readValue("draftReviewProductionBoundary"),
      clarification_question: readValue("draftReviewClarification"),
      return_reason: readValue("draftReviewReturnReason"),
      hold_reason: readValue("draftReviewHoldReason"),
      block_reason: readValue("draftReviewBlockReason")
    };
  }

  function saved() {
    return safeParse(localStorage.getItem("vedapath-controlled-permission-execution-authorization-draft-reviews") || "[]", []);
  }

  function writeSaved(items) {
    localStorage.setItem("vedapath-controlled-permission-execution-authorization-draft-reviews", JSON.stringify(items.slice(0, 12)));
  }

  function renderSaved() {
    const list = document.getElementById("draftReviewSaved");
    if (!list) return;
    const items = saved();
    list.innerHTML = items.length ? items.map((item) => '<div class="draft-review-card"><span>' + item.created_at + '</span><strong>' + item.draft_review_status + '</strong></div>').join("") : '<p class="muted">No local draft reviews saved yet.</p>';
  }

  async function init() {
    if (typeof document === "undefined") return;
    const response = await fetch(configUrl);
    const config = await response.json();
    const state = document.getElementById("draftReviewState");
    if (state) {
      state.innerHTML = config.review_states.map((name) => '<option value="' + name + '">' + name + '</option>').join("");
    }
    loadConfig(config);
    renderSaved();
    const run = () => {
      const draftPacket = safeParse(readValue("draftReviewPacket"), {});
      const result = controlledPermissionExecutionAuthorizationDraftReviewGate(config, draftPacket, readReview());
      setValue("draftReviewOutput", JSON.stringify(result, null, 2));
      renderCard(result);
      return result;
    };
    document.getElementById("runDraftReviewGate")?.addEventListener("click", run);
    document.getElementById("loadDraftReviewSample")?.addEventListener("click", () => {
      loadConfig(config);
      run();
    });
    document.getElementById("saveDraftReviewGate")?.addEventListener("click", () => {
      const result = run();
      writeSaved([result, ...saved()]);
      renderSaved();
    });
    document.getElementById("clearDraftReviews")?.addEventListener("click", () => {
      writeSaved([]);
      renderSaved();
    });
    document.getElementById("copyDraftReviewGate")?.addEventListener("click", async () => {
      const output = readValue("draftReviewOutput");
      if (navigator.clipboard && output) await navigator.clipboard.writeText(output);
    });
    run();
  }

  window.vedapathControlledPermissionExecutionAuthorizationDraftReviewGate = {
    draftPacketReady,
    matchesSourceHandoff,
    matchesSourceIdentity,
    reviewPreservesHandoff,
    hasUnsafeAuthority,
    keepsNonExecutionReviewBoundary,
    controlledPermissionExecutionAuthorizationDraftReviewGate,
    reviewSnapshot
  };

  init().catch((error) => {
    console.error("Controlled permission execution authorization draft review gate failed", error);
  });
})();

(function () {
  const configUrl = "data/vedapath-controlled-permission-execution-authorization-review-gate.json";
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
  "actual_storage_write_executed",
  "production_ready",
  "production_launch_allowed",
  "public_release_allowed"
];
  const authorityAuditFlags = [
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
    "actual_storage_write_executed",
    "production_ready",
    "production_launch_allowed",
    "public_release_allowed"
  ];
  const preflightReadyFlags = [
    "permission_execution_authorization_preflight_ready",
    "permission_execution_authorization_preflight_recorded",
    "controlled_permission_execution_authorization_review_candidate_ready"
  ];
  const blockedWords = /\b(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production now|launch production allowed|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)\b/i;

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

  function hasText(value, groups) {
    const text = compact(value).toLowerCase();
    return groups.every((group) => group.some((item) => text.includes(String(item).toLowerCase())));
  }

  function keepsQuestionHandoff(packet) {
    return Boolean(
      packet &&
      hasText(packet.review_route, [["ready"], ["founder"]]) &&
      hasText(packet.founder_question, [["founder question"], ["source-locked"], ["authorization"], ["execution"], ["storage"], ["production"], ["remain false"]]) &&
      hasText(packet.permission_question, [["reviewer"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"]])
    );
  }

  function keepsAuthorityFlagAudit(value) {
    const text = compact(value).toLowerCase();
    return Boolean(text) && authorityAuditFlags.every((flag) => text.includes(flag.toLowerCase() + "=false"));
  }

  function preflightPacketReady(packet) {
    return Boolean(
      packet &&
      packet.schema_version === "permission-execution-authorization-preflight-v2" &&
      packet.release === "v3.4.5" &&
      packet.preflight_status === "Preflight ready for authorization review" &&
      packet.next_gate_required === "Controlled permission execution authorization review gate" &&
      allFlagsTrue(packet, preflightReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags) &&
      keepsQuestionHandoff(packet) &&
      keepsAuthorityFlagAudit(packet.authority_flag_audit)
    );
  }

  function keepsNonExecutionReviewBoundary(value) {
    const text = compact(value);
    if (!text || hasUnsafeAuthority(text)) return false;
    const mustMentionTrue = [
      "controlled_permission_execution_authorization_review_ready may be true",
      "permission_execution_authorization_review_recorded may be true",
      "founder_permission_execution_authorization_decision_candidate_ready may be true"
    ];
    const mustMentionFalse = falseAuthorityFlags.map((flag) => flag + " remains false");
    return mustMentionTrue.every((phrase) => text.includes(phrase)) &&
      mustMentionFalse.every((phrase) => text.includes(phrase));
  }

  function matchesPreflightCarry(preflightPacket, review) {
    const keys = [
      "review_route",
      "founder_question",
      "permission_question",
      "authority_flag_audit"
    ];
    return keys.every((key) => compact(preflightPacket[key]) === compact(review[key]));
  }

  function requiredMissing(config, state, review) {
    const required = (config.required_by_state && config.required_by_state[state]) || [];
    return required.filter((key) => !compact(review[key]));
  }

  function blocked(status, details) {
    return {
      review_status: status,
      blocked: true,
      controlled_permission_execution_authorization_review_ready: false,
      permission_execution_authorization_review_recorded: false,
      founder_permission_execution_authorization_decision_candidate_ready: false,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      details
    };
  }

  function controlledPermissionExecutionAuthorizationReviewGate(config, preflightPacket, review) {
    if (!preflightPacketReady(preflightPacket)) {
      return blocked("Blocked: authorization preflight must be ready and non-authorizing.", {
        next_gate_required: "Controlled permission execution authorization review gate"
      });
    }

    const state = compact(review && review.review_state) || "Draft review";
    const missing = requiredMissing(config, state, review || {});
    if (missing.length) {
      return blocked("Blocked: missing required fields for " + state + ".", { missing });
    }

    const textFields = [
      "review_scope",
      "review_language",
      "review_rationale",
      "review_evidence_summary",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
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

    if (hasUnsafeAuthority(review.production_boundary) || !compact(review.production_boundary).includes("Production remains unavailable")) {
      return blocked("Blocked: production boundary must stay closed.", {});
    }

    if (!matchesPreflightCarry(preflightPacket, review)) {
      return blocked("Blocked: question handoff and authority audit must match the v3.4.5 preflight packet.", {
        review_route: "must match",
        founder_question: "must match",
        permission_question: "must match",
        authority_flag_audit: "must match"
      });
    }

    if (!hasText(review.review_rationale, [["v3.4.5"], ["question handoff"], ["authority"], ["review"], ["not approval"]])) {
      return blocked("Blocked: review rationale must explain the v3.4.5 question handoff and non-approval boundary.", {});
    }

    if (state === "Needs review clarification") {
      return blocked("Needs clarification: answer the review question before founder-decision readiness.", {
        clarification_question: review.clarification_question
      });
    }

    if (state === "Return to authorization preflight") {
      return blocked("Return: send packet back to authorization preflight.", { return_reason: review.return_reason });
    }

    if (state === "Permission review blocked" || state === "Authorization blocked" || state === "Execution blocked" || state === "Production forbidden") {
      return blocked("Blocked: " + (review.block_reason || state), { state });
    }

    if (state === "Review paused") {
      return blocked("Paused: review is held.", { hold_reason: review.hold_reason });
    }

    if (state === "Review expired") {
      return blocked("Expired: recheck the preflight and evidence.", { hold_reason: review.hold_reason });
    }

    if (state !== "Review ready for founder authorization decision") {
      return blocked("Draft: review is not ready for founder authorization decision.", { state });
    }

    return {
      schema_version: config.schema_version,
      release: config.release,
      review_status: "Review ready for founder authorization decision",
      controlled_permission_execution_authorization_review_gate_id: review.controlled_permission_execution_authorization_review_gate_id,
      permission_execution_authorization_preflight_id: review.permission_execution_authorization_preflight_id,
      controlled_permission_execution_hold_id: review.controlled_permission_execution_hold_id,
      controlled_founder_permission_decision_gate_id: review.controlled_founder_permission_decision_gate_id,
      controlled_authorization_permission_review_gate_id: review.controlled_authorization_permission_review_gate_id,
      controlled_authorization_permission_preflight_id: review.controlled_authorization_permission_preflight_id,
      founder_authorization_instruction_gate_id: review.founder_authorization_instruction_gate_id,
      controlled_authorization_review_gate_id: review.controlled_authorization_review_gate_id,
      controlled_execution_packet_authorization_draft_id: review.controlled_execution_packet_authorization_draft_id,
      source_answer_id: review.source_answer_id,
      source_record_id: review.source_record_id,
      source_family: review.source_family,
      review_route: review.review_route,
      founder_question: review.founder_question,
      permission_question: review.permission_question,
      authority_flag_audit: review.authority_flag_audit,
      controlled_permission_execution_authorization_review_ready: true,
      permission_execution_authorization_review_recorded: true,
      founder_permission_execution_authorization_decision_candidate_ready: true,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      review_scope: review.review_scope,
      review_language: review.review_language,
      review_rationale: review.review_rationale,
      review_evidence_summary: review.review_evidence_summary,
      non_execution_review_clause: review.non_execution_review_clause,
      risk_acknowledgment: review.risk_acknowledgment,
      rollback_condition: review.rollback_condition,
      monitoring_condition: review.monitoring_condition,
      stop_condition: review.stop_condition,
      expiry_check: review.expiry_check,
      production_boundary: review.production_boundary,
      next_gate_required: "Founder permission execution authorization decision gate",
      created_at: new Date().toISOString()
    };
  }

  function reviewSnapshot(result) {
    return {
      status: result.review_status,
      ready: result.controlled_permission_execution_authorization_review_ready === true,
      founder_next: result.founder_permission_execution_authorization_decision_candidate_ready === true,
      permission_granted: result.permission_granted === true,
      execution_allowed: result.execution_allowed === true,
      production_ready: result.production_ready === true,
      next_gate_required: result.next_gate_required || null
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
    const card = document.getElementById("authorizationReviewResultCard");
    if (!card) return;
    card.dataset.state = result.review_status || "Blocked";
    const snapshot = reviewSnapshot(result);
    card.innerHTML = '<span>Review result</span>' +
      '<h2>' + snapshot.status + '</h2>' +
      '<div class="authorization-review-grid">' +
      '<div class="authorization-review-card ' + (snapshot.ready ? 'ready' : 'blocked') + '"><span>Founder decision ready</span><strong>' + String(snapshot.ready) + '</strong></div>' +
      '<div class="authorization-review-card"><span>Next gate</span><strong>' + (snapshot.next_gate_required || 'None') + '</strong></div>' +
      '<div class="authorization-review-card"><span>Permission granted</span><strong>' + String(snapshot.permission_granted) + '</strong></div>' +
      '<div class="authorization-review-card"><span>Execution allowed</span><strong>' + String(snapshot.execution_allowed) + '</strong></div>' +
      '</div>';
  }

  function renderList(id, items) {
    const root = document.getElementById(id);
    if (!root) return;
    root.innerHTML = items.map((item) => '<div class="authorization-review-card"><span>' + item.label + '</span><strong>' + item.value + '</strong></div>').join("");
  }

  function loadConfig(config) {
    const review = config.sample_review;
    setValue("authorizationReviewPreflightPacket", JSON.stringify(config.sample_preflight_packet, null, 2));
    setValue("authorizationReviewState", review.review_state);
    setValue("authorizationReviewActor", review.review_actor);
    setValue("authorizationReviewReviewer", review.reviewer_name);
    setValue("authorizationReviewId", review.controlled_permission_execution_authorization_review_gate_id);
    setValue("authorizationReviewPreflightId", review.permission_execution_authorization_preflight_id);
    setValue("authorizationReviewHoldId", review.controlled_permission_execution_hold_id);
    setValue("authorizationReviewFounderDecisionId", review.controlled_founder_permission_decision_gate_id);
    setValue("authorizationReviewPermissionReviewId", review.controlled_authorization_permission_review_gate_id);
    setValue("authorizationReviewPriorPreflightId", review.controlled_authorization_permission_preflight_id);
    setValue("authorizationReviewInstructionGateId", review.founder_authorization_instruction_gate_id);
    setValue("authorizationReviewPriorReviewGateId", review.controlled_authorization_review_gate_id);
    setValue("authorizationReviewDraftId", review.controlled_execution_packet_authorization_draft_id);
    setValue("authorizationReviewSourceAnswer", review.source_answer_id);
    setValue("authorizationReviewSourceRecord", review.source_record_id);
    setValue("authorizationReviewSourceFamily", review.source_family);
    setValue("authorizationReviewRoute", review.review_route);
    setValue("authorizationReviewFounderQuestion", review.founder_question);
    setValue("authorizationReviewPermissionQuestion", review.permission_question);
    setValue("authorizationReviewAuthorityAudit", review.authority_flag_audit);
    setValue("authorizationReviewScopeText", review.review_scope);
    setValue("authorizationReviewLanguage", review.review_language);
    setValue("authorizationReviewRationale", review.review_rationale);
    setValue("authorizationReviewSummary", review.review_evidence_summary);
    setValue("authorizationReviewBoundary", review.non_execution_review_clause);
    setValue("authorizationReviewRisk", review.risk_acknowledgment);
    setValue("authorizationReviewRollback", review.rollback_condition);
    setValue("authorizationReviewMonitoring", review.monitoring_condition);
    setValue("authorizationReviewStopCondition", review.stop_condition);
    setValue("authorizationReviewExpiry", review.expiry_check);
    setValue("authorizationReviewProductionBoundary", review.production_boundary);
    setValue("authorizationReviewClarification", review.clarification_question);
    setValue("authorizationReviewReturnReason", review.return_reason);
    setValue("authorizationReviewHoldReason", review.hold_reason);
    setValue("authorizationReviewBlockReason", review.block_reason);
    renderList("authorizationReviewScope", [
      { label: "Review", value: "Founder decision readiness only" },
      { label: "Permission", value: "False" },
      { label: "Authorization", value: "False" },
      { label: "Execution", value: "False" }
    ]);
    renderList("authorizationReviewQuestionHandoff", [
      { label: "Route", value: review.review_route },
      { label: "Founder question", value: review.founder_question },
      { label: "Permission question", value: review.permission_question }
    ]);
    renderList("authorizationReviewAuthorityFlags", authorityAuditFlags.map((flag) => ({
      label: flag,
      value: "false"
    })));
    renderList("authorizationReviewChecks", config.review_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readReview() {
    return {
      review_state: readValue("authorizationReviewState"),
      review_actor: readValue("authorizationReviewActor"),
      reviewer_name: readValue("authorizationReviewReviewer"),
      controlled_permission_execution_authorization_review_gate_id: readValue("authorizationReviewId"),
      permission_execution_authorization_preflight_id: readValue("authorizationReviewPreflightId"),
      controlled_permission_execution_hold_id: readValue("authorizationReviewHoldId"),
      controlled_founder_permission_decision_gate_id: readValue("authorizationReviewFounderDecisionId"),
      controlled_authorization_permission_review_gate_id: readValue("authorizationReviewPermissionReviewId"),
      controlled_authorization_permission_preflight_id: readValue("authorizationReviewPriorPreflightId"),
      founder_authorization_instruction_gate_id: readValue("authorizationReviewInstructionGateId"),
      controlled_authorization_review_gate_id: readValue("authorizationReviewPriorReviewGateId"),
      controlled_execution_packet_authorization_draft_id: readValue("authorizationReviewDraftId"),
      source_answer_id: readValue("authorizationReviewSourceAnswer"),
      source_record_id: readValue("authorizationReviewSourceRecord"),
      source_family: readValue("authorizationReviewSourceFamily"),
      review_route: readValue("authorizationReviewRoute"),
      founder_question: readValue("authorizationReviewFounderQuestion"),
      permission_question: readValue("authorizationReviewPermissionQuestion"),
      authority_flag_audit: readValue("authorizationReviewAuthorityAudit"),
      review_scope: readValue("authorizationReviewScopeText"),
      review_language: readValue("authorizationReviewLanguage"),
      review_rationale: readValue("authorizationReviewRationale"),
      review_evidence_summary: readValue("authorizationReviewSummary"),
      non_execution_review_clause: readValue("authorizationReviewBoundary"),
      risk_acknowledgment: readValue("authorizationReviewRisk"),
      rollback_condition: readValue("authorizationReviewRollback"),
      monitoring_condition: readValue("authorizationReviewMonitoring"),
      stop_condition: readValue("authorizationReviewStopCondition"),
      expiry_check: readValue("authorizationReviewExpiry"),
      production_boundary: readValue("authorizationReviewProductionBoundary"),
      clarification_question: readValue("authorizationReviewClarification"),
      return_reason: readValue("authorizationReviewReturnReason"),
      hold_reason: readValue("authorizationReviewHoldReason"),
      block_reason: readValue("authorizationReviewBlockReason")
    };
  }

  function saved() {
    return safeParse(localStorage.getItem("vedapath-controlled-permission-execution-authorization-reviews") || "[]", []);
  }

  function writeSaved(items) {
    localStorage.setItem("vedapath-controlled-permission-execution-authorization-reviews", JSON.stringify(items.slice(0, 12)));
  }

  function renderSaved() {
    const list = document.getElementById("authorizationReviewSaved");
    if (!list) return;
    const items = saved();
    list.innerHTML = items.length ? items.map((item) => '<div class="authorization-review-card"><span>' + item.created_at + '</span><strong>' + item.review_status + '</strong></div>').join("") : '<p class="muted">No local authorization reviews saved yet.</p>';
  }

  async function init() {
    if (typeof document === "undefined") return;
    const response = await fetch(configUrl);
    const config = await response.json();
    const state = document.getElementById("authorizationReviewState");
    if (state) {
      state.innerHTML = config.review_states.map((name) => '<option value="' + name + '">' + name + '</option>').join("");
    }
    loadConfig(config);
    renderSaved();
    const run = () => {
      const preflightPacket = safeParse(readValue("authorizationReviewPreflightPacket"), {});
      const result = controlledPermissionExecutionAuthorizationReviewGate(config, preflightPacket, readReview());
      setValue("authorizationReviewOutput", JSON.stringify(result, null, 2));
      renderCard(result);
      return result;
    };
    document.getElementById("runAuthorizationReview")?.addEventListener("click", run);
    document.getElementById("loadAuthorizationReviewSample")?.addEventListener("click", () => {
      loadConfig(config);
      run();
    });
    document.getElementById("saveAuthorizationReview")?.addEventListener("click", () => {
      const result = run();
      writeSaved([result, ...saved()]);
      renderSaved();
    });
    document.getElementById("clearAuthorizationReviews")?.addEventListener("click", () => {
      writeSaved([]);
      renderSaved();
    });
    document.getElementById("copyAuthorizationReview")?.addEventListener("click", async () => {
      const output = readValue("authorizationReviewOutput");
      if (navigator.clipboard && output) await navigator.clipboard.writeText(output);
    });
    run();
  }

  window.vedapathControlledPermissionExecutionAuthorizationReviewGate = {
    preflightPacketReady,
    hasUnsafeAuthority,
    keepsQuestionHandoff,
    keepsAuthorityFlagAudit,
    keepsNonExecutionReviewBoundary,
    controlledPermissionExecutionAuthorizationReviewGate,
    reviewSnapshot
  };

  init().catch((error) => {
    console.error("Controlled permission execution authorization review gate failed", error);
  });
})();

(function () {
  const configUrl = "data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json";
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
  const reviewReadyFlags = [
    "controlled_permission_execution_authorization_review_ready",
    "permission_execution_authorization_review_recorded",
    "founder_permission_execution_authorization_decision_candidate_ready"
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

  function authorizationReviewPacketReady(packet) {
    return Boolean(
      packet &&
      packet.schema_version === "controlled-permission-execution-authorization-review-gate-v1" &&
      packet.review_status === "Review ready for founder authorization decision" &&
      packet.next_gate_required === "Founder permission execution authorization decision gate" &&
      allFlagsTrue(packet, reviewReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags)
    );
  }

  function keepsNonExecutionDecisionBoundary(value, forwardReady) {
    const text = compact(value);
    if (!text || hasUnsafeAuthority(text)) return false;
    const mustMentionTrue = ["review_decision_recorded may be true"];
    if (forwardReady) {
      mustMentionTrue.push("review_decision_ready may be true");
      mustMentionTrue.push("founder_permission_execution_authorization_decision_candidate_ready may be true");
    }
    const mustMentionFalse = falseAuthorityFlags.map((flag) => flag + " remains false");
    return mustMentionTrue.every((phrase) => text.includes(phrase)) &&
      mustMentionFalse.every((phrase) => text.includes(phrase));
  }

  function requiredMissing(config, state, decision) {
    const required = (config.required_by_state && config.required_by_state[state]) || [];
    return required.filter((key) => !compact(decision[key]));
  }

  function blocked(status, details) {
    return {
      decision_status: status,
      blocked: true,
      review_decision_ready: false,
      review_decision_recorded: false,
      founder_permission_execution_authorization_decision_candidate_ready: false,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      details
    };
  }

  function baseDecision(config, reviewPacket, decision, status, outcome, forwardReady) {
    return {
      schema_version: config.schema_version,
      release: config.release,
      decision_status: status,
      review_decision_outcome: outcome,
      review_decision_gate_id: decision.review_decision_gate_id,
      authorization_review_gate_id: decision.authorization_review_gate_id,
      permission_execution_authorization_preflight_id: decision.permission_execution_authorization_preflight_id,
      controlled_permission_execution_hold_id: decision.controlled_permission_execution_hold_id,
      source_answer_id: decision.source_answer_id,
      source_record_id: decision.source_record_id,
      source_family: decision.source_family,
      controlled_permission_execution_authorization_review_ready: reviewPacket.controlled_permission_execution_authorization_review_ready === true,
      permission_execution_authorization_review_recorded: reviewPacket.permission_execution_authorization_review_recorded === true,
      review_decision_ready: forwardReady === true,
      review_decision_recorded: true,
      founder_permission_execution_authorization_decision_candidate_ready: forwardReady === true,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      decision_scope: decision.decision_scope,
      decision_language: decision.decision_language,
      decision_rationale: decision.decision_rationale,
      decision_evidence_summary: decision.decision_evidence_summary,
      non_execution_decision_clause: decision.non_execution_decision_clause,
      risk_acknowledgment: decision.risk_acknowledgment,
      rollback_condition: decision.rollback_condition,
      monitoring_condition: decision.monitoring_condition,
      stop_condition: decision.stop_condition,
      expiry_check: decision.expiry_check,
      production_boundary: decision.production_boundary,
      return_reason: decision.return_reason || "",
      hold_reason: decision.hold_reason || "",
      block_reason: decision.block_reason || "",
      next_gate_required: forwardReady ? "Founder permission execution authorization decision gate" : null,
      created_at: new Date().toISOString()
    };
  }

  function controlledPermissionExecutionAuthorizationReviewDecisionGate(config, reviewPacket, decision) {
    if (!authorizationReviewPacketReady(reviewPacket)) {
      return blocked("Blocked: authorization review packet must be ready and non-authorizing.", {
        next_gate_required: "Founder permission execution authorization decision gate"
      });
    }

    const state = compact(decision && decision.decision_state) || "Draft decision";
    const missing = requiredMissing(config, state, decision || {});
    if (missing.length) {
      return blocked("Blocked: missing required fields for " + state + ".", { missing });
    }

    const textFields = [
      "decision_scope",
      "decision_language",
      "decision_rationale",
      "decision_evidence_summary",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check"
    ];
    for (const field of textFields) {
      if (hasUnsafeAuthority(decision[field])) {
        return blocked("Blocked: " + field + " must not grant permission, authorization, or execution.", { field });
      }
    }

    const forwardReady = state === "Ready for founder decision";
    if (!keepsNonExecutionDecisionBoundary(decision.non_execution_decision_clause, forwardReady)) {
      return blocked("Blocked: non-execution decision clause must keep authority false.", {});
    }

    if (hasUnsafeAuthority(decision.production_boundary) || !compact(decision.production_boundary).includes("Production remains unavailable")) {
      return blocked("Blocked: production boundary must stay closed.", {});
    }

    if (state === "Hold for evidence") {
      return baseDecision(config, reviewPacket, decision, "Held for more evidence; founder route closed.", "Hold", false);
    }

    if (state === "Return to authorization review") {
      return baseDecision(config, reviewPacket, decision, "Returned to authorization review; founder route closed.", "Return", false);
    }

    if (state === "Block packet") {
      return baseDecision(config, reviewPacket, decision, "Blocked before founder decision; packet route closed.", "Block", false);
    }

    if (state === "Decision expired") {
      return blocked("Expired: recheck review packet and evidence.", { hold_reason: decision.hold_reason });
    }

    if (!forwardReady) {
      return blocked("Draft: review decision is not ready to route forward.", { state });
    }

    return baseDecision(config, reviewPacket, decision, "Ready for founder decision; no authority granted.", "Ready", true);
  }

  function decisionSnapshot(result) {
    return {
      status: result.decision_status,
      outcome: result.review_decision_outcome || "Blocked",
      ready: result.review_decision_ready === true,
      founder_next: result.founder_permission_execution_authorization_decision_candidate_ready === true,
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
    const card = document.getElementById("reviewDecisionResultCard");
    if (!card) return;
    const snapshot = decisionSnapshot(result);
    card.dataset.state = snapshot.status || "Blocked";
    card.dataset.outcome = snapshot.outcome;
    card.innerHTML = '<span>Review decision result</span>' +
      '<h2>' + snapshot.status + '</h2>' +
      '<div class="review-decision-list">' +
      '<div class="review-decision-card"><span>Outcome</span><strong>' + snapshot.outcome + '</strong></div>' +
      '<div class="review-decision-card"><span>Founder next</span><strong>' + String(snapshot.founder_next) + '</strong></div>' +
      '<div class="review-decision-card"><span>Permission granted</span><strong>' + String(snapshot.permission_granted) + '</strong></div>' +
      '<div class="review-decision-card"><span>Execution allowed</span><strong>' + String(snapshot.execution_allowed) + '</strong></div>' +
      '</div>';
  }

  function renderList(id, items) {
    const root = document.getElementById(id);
    if (!root) return;
    root.innerHTML = items.map((item) => '<div class="review-decision-card"><span>' + item.label + '</span><strong>' + item.value + '</strong></div>').join("");
  }

  function selectChoice(state) {
    document.querySelectorAll("[data-decision-state]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.decisionState === state));
    });
    setValue("reviewDecisionState", state);
  }

  function loadConfig(config) {
    const decision = config.sample_decision;
    setValue("reviewDecisionPacket", JSON.stringify(config.sample_authorization_review_packet, null, 2));
    setValue("reviewDecisionState", decision.decision_state);
    setValue("reviewDecisionActor", decision.decision_actor);
    setValue("reviewDecisionReviewer", decision.reviewer_name);
    setValue("reviewDecisionId", decision.review_decision_gate_id);
    setValue("reviewDecisionReviewId", decision.authorization_review_gate_id);
    setValue("reviewDecisionPreflightId", decision.permission_execution_authorization_preflight_id);
    setValue("reviewDecisionHoldId", decision.controlled_permission_execution_hold_id);
    setValue("reviewDecisionSourceAnswer", decision.source_answer_id);
    setValue("reviewDecisionSourceRecord", decision.source_record_id);
    setValue("reviewDecisionSourceFamily", decision.source_family);
    setValue("reviewDecisionScopeText", decision.decision_scope);
    setValue("reviewDecisionLanguage", decision.decision_language);
    setValue("reviewDecisionRationale", decision.decision_rationale);
    setValue("reviewDecisionSummary", decision.decision_evidence_summary);
    setValue("reviewDecisionBoundary", decision.non_execution_decision_clause);
    setValue("reviewDecisionRisk", decision.risk_acknowledgment);
    setValue("reviewDecisionRollback", decision.rollback_condition);
    setValue("reviewDecisionMonitoring", decision.monitoring_condition);
    setValue("reviewDecisionStopCondition", decision.stop_condition);
    setValue("reviewDecisionExpiry", decision.expiry_check);
    setValue("reviewDecisionProductionBoundary", decision.production_boundary);
    setValue("reviewDecisionReturnReason", decision.return_reason);
    setValue("reviewDecisionHoldReason", decision.hold_reason);
    setValue("reviewDecisionBlockReason", decision.block_reason);
    selectChoice(decision.decision_state);
    renderList("reviewDecisionScope", [
      { label: "Forward path", value: "Founder decision only" },
      { label: "Hold path", value: "More evidence" },
      { label: "Return path", value: "Authorization review" },
      { label: "Execution", value: "False" }
    ]);
    renderList("reviewDecisionChecks", config.decision_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readDecision() {
    return {
      decision_state: readValue("reviewDecisionState"),
      decision_actor: readValue("reviewDecisionActor"),
      reviewer_name: readValue("reviewDecisionReviewer"),
      review_decision_gate_id: readValue("reviewDecisionId"),
      authorization_review_gate_id: readValue("reviewDecisionReviewId"),
      permission_execution_authorization_preflight_id: readValue("reviewDecisionPreflightId"),
      controlled_permission_execution_hold_id: readValue("reviewDecisionHoldId"),
      source_answer_id: readValue("reviewDecisionSourceAnswer"),
      source_record_id: readValue("reviewDecisionSourceRecord"),
      source_family: readValue("reviewDecisionSourceFamily"),
      decision_scope: readValue("reviewDecisionScopeText"),
      decision_language: readValue("reviewDecisionLanguage"),
      decision_rationale: readValue("reviewDecisionRationale"),
      decision_evidence_summary: readValue("reviewDecisionSummary"),
      non_execution_decision_clause: readValue("reviewDecisionBoundary"),
      risk_acknowledgment: readValue("reviewDecisionRisk"),
      rollback_condition: readValue("reviewDecisionRollback"),
      monitoring_condition: readValue("reviewDecisionMonitoring"),
      stop_condition: readValue("reviewDecisionStopCondition"),
      expiry_check: readValue("reviewDecisionExpiry"),
      production_boundary: readValue("reviewDecisionProductionBoundary"),
      return_reason: readValue("reviewDecisionReturnReason"),
      hold_reason: readValue("reviewDecisionHoldReason"),
      block_reason: readValue("reviewDecisionBlockReason")
    };
  }

  function saved() {
    return safeParse(localStorage.getItem("vedapath-review-decision-gate-records") || "[]", []);
  }

  function writeSaved(items) {
    localStorage.setItem("vedapath-review-decision-gate-records", JSON.stringify(items.slice(0, 12)));
  }

  function renderSaved() {
    const list = document.getElementById("reviewDecisionSaved");
    if (!list) return;
    const items = saved();
    list.innerHTML = items.length ? items.map((item) => '<div class="review-decision-card"><span>' + item.created_at + '</span><strong>' + item.decision_status + '</strong></div>').join("") : '<p class="muted">No local review decisions saved yet.</p>';
  }

  async function init() {
    if (typeof document === "undefined") return;
    const response = await fetch(configUrl);
    const config = await response.json();
    const state = document.getElementById("reviewDecisionState");
    if (state) {
      state.innerHTML = config.decision_states.map((name) => '<option value="' + name + '">' + name + '</option>').join("");
    }
    document.querySelectorAll("[data-decision-state]").forEach((button) => {
      button.addEventListener("click", () => selectChoice(button.dataset.decisionState));
    });
    loadConfig(config);
    renderSaved();
    const run = () => {
      const reviewPacket = safeParse(readValue("reviewDecisionPacket"), {});
      const result = controlledPermissionExecutionAuthorizationReviewDecisionGate(config, reviewPacket, readDecision());
      setValue("reviewDecisionOutput", JSON.stringify(result, null, 2));
      renderCard(result);
      return result;
    };
    document.getElementById("runReviewDecision")?.addEventListener("click", run);
    document.getElementById("reviewDecisionState")?.addEventListener("change", (event) => selectChoice(event.target.value));
    document.getElementById("loadReviewDecisionSample")?.addEventListener("click", () => {
      loadConfig(config);
      run();
    });
    document.getElementById("saveReviewDecision")?.addEventListener("click", () => {
      const result = run();
      writeSaved([result, ...saved()]);
      renderSaved();
    });
    document.getElementById("clearReviewDecisions")?.addEventListener("click", () => {
      writeSaved([]);
      renderSaved();
    });
    document.getElementById("copyReviewDecision")?.addEventListener("click", async () => {
      const output = readValue("reviewDecisionOutput");
      if (navigator.clipboard && output) await navigator.clipboard.writeText(output);
    });
    run();
  }

  window.vedapathControlledPermissionExecutionAuthorizationReviewDecisionGate = {
    authorizationReviewPacketReady,
    hasUnsafeAuthority,
    keepsNonExecutionDecisionBoundary,
    controlledPermissionExecutionAuthorizationReviewDecisionGate,
    decisionSnapshot
  };

  init().catch((error) => {
    console.error("Controlled permission execution authorization review decision gate failed", error);
  });
})();

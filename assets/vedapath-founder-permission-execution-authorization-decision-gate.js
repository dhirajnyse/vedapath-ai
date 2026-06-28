(function () {
  const configUrl = "data/vedapath-founder-permission-execution-authorization-decision-gate.json";
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

  function authorizationReviewPacketReady(packet) {
    return Boolean(
      packet &&
      packet.schema_version === "controlled-permission-execution-authorization-review-gate-v2" &&
      packet.release === "v3.4.6" &&
      packet.review_status === "Review ready for founder authorization decision" &&
      packet.next_gate_required === "Founder permission execution authorization decision gate" &&
      allFlagsTrue(packet, reviewReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags) &&
      keepsQuestionHandoff(packet) &&
      keepsAuthorityFlagAudit(packet.authority_flag_audit)
    );
  }

  function keepsNonExecutionDecisionBoundary(value, allowDraftCandidate) {
    const text = compact(value);
    if (!text || hasUnsafeAuthority(text)) return false;
    const mustMentionTrue = [
      "founder_permission_execution_authorization_decision_ready may be true",
      "founder_permission_execution_authorization_decision_recorded may be true"
    ];
    if (allowDraftCandidate) {
      mustMentionTrue.push("controlled_permission_execution_authorization_draft_candidate_ready may be true");
    }
    const mustMentionFalse = falseAuthorityFlags.map((flag) => flag + " remains false");
    return mustMentionTrue.every((phrase) => text.includes(phrase)) &&
      mustMentionFalse.every((phrase) => text.includes(phrase));
  }

  function matchesReviewCarry(reviewPacket, decision) {
    const keys = [
      "review_route",
      "founder_question",
      "permission_question",
      "authority_flag_audit"
    ];
    return keys.every((key) => compact(reviewPacket[key]) === compact(decision[key]));
  }

  function requiredMissing(config, state, decision) {
    const required = (config.required_by_state && config.required_by_state[state]) || [];
    return required.filter((key) => !compact(decision[key]));
  }

  function blocked(status, details) {
    return {
      decision_status: status,
      blocked: true,
      founder_permission_execution_authorization_decision_ready: false,
      founder_permission_execution_authorization_decision_recorded: false,
      controlled_permission_execution_authorization_draft_candidate_ready: false,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      details
    };
  }

  function baseDecision(config, reviewPacket, decision, status, outcome, draftCandidate) {
    return {
      schema_version: config.schema_version,
      release: config.release,
      decision_status: status,
      founder_decision_outcome: outcome,
      founder_permission_execution_authorization_decision_gate_id: decision.founder_permission_execution_authorization_decision_gate_id,
      authorization_review_gate_id: decision.authorization_review_gate_id,
      permission_execution_authorization_preflight_id: decision.permission_execution_authorization_preflight_id,
      controlled_permission_execution_hold_id: decision.controlled_permission_execution_hold_id,
      controlled_founder_permission_decision_gate_id: reviewPacket.controlled_founder_permission_decision_gate_id,
      controlled_authorization_permission_review_gate_id: reviewPacket.controlled_authorization_permission_review_gate_id,
      controlled_authorization_permission_preflight_id: reviewPacket.controlled_authorization_permission_preflight_id,
      founder_authorization_instruction_gate_id: reviewPacket.founder_authorization_instruction_gate_id,
      controlled_authorization_review_gate_id: reviewPacket.controlled_authorization_review_gate_id,
      controlled_execution_packet_authorization_draft_id: reviewPacket.controlled_execution_packet_authorization_draft_id,
      source_answer_id: decision.source_answer_id,
      source_record_id: decision.source_record_id,
      source_family: decision.source_family,
      review_route: decision.review_route,
      founder_question: decision.founder_question,
      permission_question: decision.permission_question,
      authority_flag_audit: decision.authority_flag_audit,
      controlled_permission_execution_authorization_review_ready: reviewPacket.controlled_permission_execution_authorization_review_ready === true,
      permission_execution_authorization_review_recorded: reviewPacket.permission_execution_authorization_review_recorded === true,
      founder_permission_execution_authorization_decision_ready: outcome === "Draft-only",
      founder_permission_execution_authorization_decision_recorded: true,
      controlled_permission_execution_authorization_draft_candidate_ready: draftCandidate === true,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      decision_scope: decision.decision_scope,
      founder_decision_language: decision.founder_decision_language,
      decision_rationale: decision.decision_rationale,
      decision_evidence_summary: decision.decision_evidence_summary,
      non_execution_decision_clause: decision.non_execution_decision_clause,
      risk_acknowledgment: decision.risk_acknowledgment,
      rollback_condition: decision.rollback_condition,
      monitoring_condition: decision.monitoring_condition,
      stop_condition: decision.stop_condition,
      expiry_check: decision.expiry_check,
      production_boundary: decision.production_boundary,
      hold_reason: decision.hold_reason || "",
      block_reason: decision.block_reason || "",
      next_gate_required: draftCandidate ? "Controlled permission execution authorization draft gate" : null,
      created_at: new Date().toISOString()
    };
  }

  function founderPermissionExecutionAuthorizationDecisionGate(config, reviewPacket, decision) {
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
      "founder_decision_language",
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

    const isDraftOnly = state === "Draft-only founder decision recorded";
    if (!keepsNonExecutionDecisionBoundary(decision.non_execution_decision_clause, isDraftOnly)) {
      return blocked("Blocked: non-execution decision clause must keep authority false.", {});
    }

    if (hasUnsafeAuthority(decision.production_boundary) || !compact(decision.production_boundary).includes("Production remains unavailable")) {
      return blocked("Blocked: production boundary must stay closed.", {});
    }

    if (!matchesReviewCarry(reviewPacket, decision)) {
      return blocked("Blocked: founder decision must preserve the v3.4.6 review route, questions, and authority audit.", {
        review_route: "must match",
        founder_question: "must match",
        permission_question: "must match",
        authority_flag_audit: "must match"
      });
    }

    if (!hasText(decision.decision_rationale, [["v3.4.6"], ["question handoff"], ["authority"], ["draft gate"], ["not a live authorization"]])) {
      return blocked("Blocked: decision rationale must explain the v3.4.6 handoff and non-authorization boundary.", {});
    }

    if (state === "Needs founder clarification") {
      return blocked("Needs clarification: founder question must be answered before decision readiness.", {
        clarification_question: decision.clarification_question
      });
    }

    if (state === "Return to authorization review") {
      return blocked("Return: send packet back to authorization review.", { return_reason: decision.return_reason });
    }

    if (state === "Permission grant blocked" || state === "Authorization approval blocked" || state === "Execution blocked" || state === "Production forbidden") {
      return blocked("Blocked: " + (decision.block_reason || state), { state });
    }

    if (state === "Decision expired") {
      return blocked("Expired: recheck the review packet and evidence.", { hold_reason: decision.hold_reason });
    }

    if (state === "Founder hold recorded") {
      return baseDecision(config, reviewPacket, decision, "Founder hold recorded; no draft candidate.", "Hold", false);
    }

    if (state === "Founder reject recorded") {
      return baseDecision(config, reviewPacket, decision, "Founder reject recorded; packet path closed.", "Reject", false);
    }

    if (!isDraftOnly) {
      return blocked("Draft: founder decision is not ready for draft-only movement.", { state });
    }

    return baseDecision(config, reviewPacket, decision, "Draft-only founder decision recorded; execution remains false.", "Draft-only", true);
  }

  function decisionSnapshot(result) {
    return {
      status: result.decision_status,
      outcome: result.founder_decision_outcome || "Blocked",
      ready: result.founder_permission_execution_authorization_decision_ready === true,
      draft_candidate: result.controlled_permission_execution_authorization_draft_candidate_ready === true,
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
    const card = document.getElementById("founderDecisionResultCard");
    if (!card) return;
    const snapshot = decisionSnapshot(result);
    card.dataset.state = snapshot.status || "Blocked";
    card.dataset.outcome = snapshot.outcome;
    card.innerHTML = '<span>Founder decision result</span>' +
      '<h2>' + snapshot.status + '</h2>' +
      '<div class="founder-decision-list">' +
      '<div class="founder-decision-card"><span>Outcome</span><strong>' + snapshot.outcome + '</strong></div>' +
      '<div class="founder-decision-card"><span>Draft candidate</span><strong>' + String(snapshot.draft_candidate) + '</strong></div>' +
      '<div class="founder-decision-card"><span>Permission granted</span><strong>' + String(snapshot.permission_granted) + '</strong></div>' +
      '<div class="founder-decision-card"><span>Execution allowed</span><strong>' + String(snapshot.execution_allowed) + '</strong></div>' +
      '<div class="founder-decision-card"><span>Next gate</span><strong>' + snapshot.next_gate_required + '</strong></div>' +
      '</div>';
  }

  function renderList(id, items) {
    const root = document.getElementById(id);
    if (!root) return;
    root.innerHTML = items.map((item) => '<div class="founder-decision-card"><span>' + item.label + '</span><strong>' + item.value + '</strong></div>').join("");
  }

  function selectChoice(state) {
    document.querySelectorAll("[data-decision-state]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.decisionState === state));
    });
    setValue("founderDecisionState", state);
  }

  function loadConfig(config) {
    const decision = config.sample_decision;
    setValue("founderReviewPacket", JSON.stringify(config.sample_authorization_review_packet, null, 2));
    setValue("founderDecisionState", decision.decision_state);
    setValue("founderDecisionActor", decision.decision_actor);
    setValue("founderDecisionName", decision.founder_name);
    setValue("founderDecisionId", decision.founder_permission_execution_authorization_decision_gate_id);
    setValue("founderDecisionReviewId", decision.authorization_review_gate_id);
    setValue("founderDecisionPreflightId", decision.permission_execution_authorization_preflight_id);
    setValue("founderDecisionHoldId", decision.controlled_permission_execution_hold_id);
    setValue("founderDecisionSourceAnswer", decision.source_answer_id);
    setValue("founderDecisionSourceRecord", decision.source_record_id);
    setValue("founderDecisionSourceFamily", decision.source_family);
    setValue("founderDecisionRoute", decision.review_route);
    setValue("founderDecisionFounderQuestion", decision.founder_question);
    setValue("founderDecisionPermissionQuestion", decision.permission_question);
    setValue("founderDecisionAuthorityAudit", decision.authority_flag_audit);
    setValue("founderDecisionScopeText", decision.decision_scope);
    setValue("founderDecisionLanguage", decision.founder_decision_language);
    setValue("founderDecisionRationale", decision.decision_rationale);
    setValue("founderDecisionSummary", decision.decision_evidence_summary);
    setValue("founderDecisionBoundary", decision.non_execution_decision_clause);
    setValue("founderDecisionRisk", decision.risk_acknowledgment);
    setValue("founderDecisionRollback", decision.rollback_condition);
    setValue("founderDecisionMonitoring", decision.monitoring_condition);
    setValue("founderDecisionStopCondition", decision.stop_condition);
    setValue("founderDecisionExpiry", decision.expiry_check);
    setValue("founderDecisionProductionBoundary", decision.production_boundary);
    setValue("founderDecisionClarification", decision.clarification_question);
    setValue("founderDecisionReturnReason", decision.return_reason);
    setValue("founderDecisionHoldReason", decision.hold_reason);
    setValue("founderDecisionBlockReason", decision.block_reason);
    selectChoice(decision.decision_state);
    renderList("founderDecisionScope", [
      { label: "Positive path", value: "Draft-only gate" },
      { label: "Hold path", value: "More evidence" },
      { label: "Reject path", value: "Close packet" },
      { label: "Execution", value: "False" }
    ]);
    renderList("founderDecisionQuestionHandoff", [
      { label: "Route", value: decision.review_route },
      { label: "Founder question", value: decision.founder_question },
      { label: "Permission question", value: decision.permission_question }
    ]);
    renderList("founderDecisionAuthorityFlags", authorityAuditFlags.map((flag) => ({
      label: flag,
      value: "false"
    })));
    renderList("founderDecisionChecks", config.decision_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readDecision() {
    return {
      decision_state: readValue("founderDecisionState"),
      decision_actor: readValue("founderDecisionActor"),
      founder_name: readValue("founderDecisionName"),
      founder_permission_execution_authorization_decision_gate_id: readValue("founderDecisionId"),
      authorization_review_gate_id: readValue("founderDecisionReviewId"),
      permission_execution_authorization_preflight_id: readValue("founderDecisionPreflightId"),
      controlled_permission_execution_hold_id: readValue("founderDecisionHoldId"),
      source_answer_id: readValue("founderDecisionSourceAnswer"),
      source_record_id: readValue("founderDecisionSourceRecord"),
      source_family: readValue("founderDecisionSourceFamily"),
      review_route: readValue("founderDecisionRoute"),
      founder_question: readValue("founderDecisionFounderQuestion"),
      permission_question: readValue("founderDecisionPermissionQuestion"),
      authority_flag_audit: readValue("founderDecisionAuthorityAudit"),
      decision_scope: readValue("founderDecisionScopeText"),
      founder_decision_language: readValue("founderDecisionLanguage"),
      decision_rationale: readValue("founderDecisionRationale"),
      decision_evidence_summary: readValue("founderDecisionSummary"),
      non_execution_decision_clause: readValue("founderDecisionBoundary"),
      risk_acknowledgment: readValue("founderDecisionRisk"),
      rollback_condition: readValue("founderDecisionRollback"),
      monitoring_condition: readValue("founderDecisionMonitoring"),
      stop_condition: readValue("founderDecisionStopCondition"),
      expiry_check: readValue("founderDecisionExpiry"),
      production_boundary: readValue("founderDecisionProductionBoundary"),
      clarification_question: readValue("founderDecisionClarification"),
      return_reason: readValue("founderDecisionReturnReason"),
      hold_reason: readValue("founderDecisionHoldReason"),
      block_reason: readValue("founderDecisionBlockReason")
    };
  }

  function saved() {
    return safeParse(localStorage.getItem("vedapath-founder-permission-execution-authorization-decisions") || "[]", []);
  }

  function writeSaved(items) {
    localStorage.setItem("vedapath-founder-permission-execution-authorization-decisions", JSON.stringify(items.slice(0, 12)));
  }

  function renderSaved() {
    const list = document.getElementById("founderDecisionSaved");
    if (!list) return;
    const items = saved();
    list.innerHTML = items.length ? items.map((item) => '<div class="founder-decision-card"><span>' + item.created_at + '</span><strong>' + item.decision_status + '</strong></div>').join("") : '<p class="muted">No local founder decisions saved yet.</p>';
  }

  async function init() {
    if (typeof document === "undefined") return;
    const response = await fetch(configUrl);
    const config = await response.json();
    const state = document.getElementById("founderDecisionState");
    if (state) {
      state.innerHTML = config.decision_states.map((name) => '<option value="' + name + '">' + name + '</option>').join("");
    }
    document.querySelectorAll("[data-decision-state]").forEach((button) => {
      button.addEventListener("click", () => selectChoice(button.dataset.decisionState));
    });
    loadConfig(config);
    renderSaved();
    const run = () => {
      const reviewPacket = safeParse(readValue("founderReviewPacket"), {});
      const result = founderPermissionExecutionAuthorizationDecisionGate(config, reviewPacket, readDecision());
      setValue("founderDecisionOutput", JSON.stringify(result, null, 2));
      renderCard(result);
      return result;
    };
    document.getElementById("runFounderDecision")?.addEventListener("click", run);
    document.getElementById("founderDecisionState")?.addEventListener("change", (event) => selectChoice(event.target.value));
    document.getElementById("loadFounderDecisionSample")?.addEventListener("click", () => {
      loadConfig(config);
      run();
    });
    document.getElementById("saveFounderDecision")?.addEventListener("click", () => {
      const result = run();
      writeSaved([result, ...saved()]);
      renderSaved();
    });
    document.getElementById("clearFounderDecisions")?.addEventListener("click", () => {
      writeSaved([]);
      renderSaved();
    });
    document.getElementById("copyFounderDecision")?.addEventListener("click", async () => {
      const output = readValue("founderDecisionOutput");
      if (navigator.clipboard && output) await navigator.clipboard.writeText(output);
    });
    run();
  }

  window.vedapathFounderPermissionExecutionAuthorizationDecisionGate = {
    authorizationReviewPacketReady,
    hasUnsafeAuthority,
    keepsQuestionHandoff,
    keepsAuthorityFlagAudit,
    keepsNonExecutionDecisionBoundary,
    matchesReviewCarry,
    founderPermissionExecutionAuthorizationDecisionGate,
    decisionSnapshot
  };

  init().catch((error) => {
    console.error("Founder permission execution authorization decision gate failed", error);
  });
})();

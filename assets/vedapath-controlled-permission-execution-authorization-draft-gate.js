(function () {
  const configUrl = "data/vedapath-controlled-permission-execution-authorization-draft-gate.json";
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
  const decisionReadyFlags = [
    "founder_permission_execution_authorization_decision_ready",
    "founder_permission_execution_authorization_decision_recorded",
    "controlled_permission_execution_authorization_draft_candidate_ready"
  ];
  const sourceIdentityFields = [
    "founder_permission_execution_authorization_decision_gate_id",
    "review_decision_gate_id",
    "controlled_permission_execution_authorization_draft_review_gate_id",
    "controlled_permission_execution_authorization_draft_gate_id",
    "founder_decision_gate_id",
    "authorization_review_gate_id",
    "permission_execution_authorization_preflight_id",
    "controlled_permission_execution_hold_id",
    "source_answer_id",
    "source_record_id",
    "source_family"
  ];
  const handoffFields = [
    "review_route",
    "founder_question",
    "permission_question",
    "authority_flag_audit"
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

  function matchesSourceIdentity(packet, config) {
    if (!packet || !config || !config.source) return false;
    return sourceIdentityFields.every((field) => compact(packet[field]) === compact(config.source[field]));
  }

  function matchesSourceHandoff(packet, config) {
    if (!packet || !config || !config.source) return false;
    return handoffFields.every((field) => compact(packet[field]) === compact(config.source[field]));
  }

  function draftPreservesCarry(draft, decisionPacket, config) {
    if (!draft || !decisionPacket || !config || !config.source) return false;
    const sourceOk = sourceIdentityFields.every((field) => {
      const value = compact(draft[field]);
      return value && value === compact(decisionPacket[field]) && value === compact(config.source[field]);
    });
    const handoffOk = handoffFields.every((field) => {
      const value = compact(draft[field]);
      return value && value === compact(decisionPacket[field]) && value === compact(config.source[field]);
    });
    return sourceOk && handoffOk;
  }

  function founderDecisionPacketReady(packet, config) {
    return Boolean(
      packet &&
      packet.schema_version === "founder-permission-execution-authorization-decision-gate-v5" &&
      packet.release === "v3.6.7" &&
      packet.decision_status === "Draft-only founder decision recorded; execution remains false." &&
      packet.founder_decision_outcome === "Draft-only" &&
      packet.next_gate_required === "Controlled permission execution authorization draft gate" &&
      compact(packet.founder_permission_execution_authorization_decision_gate_id) === compact(config.source.founder_permission_execution_authorization_decision_gate_id) &&
      matchesSourceIdentity(packet, config) &&
      matchesSourceHandoff(packet, config) &&
      allFlagsTrue(packet, decisionReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags)
    );
  }

  function keepsNonExecutionDraftBoundary(value) {
    const text = compact(value);
    if (!text || hasUnsafeAuthority(text)) return false;
    const mustMentionTrue = [
      "founder_permission_execution_authorization_decision_ready may be true",
      "founder_permission_execution_authorization_decision_recorded may be true",
      "controlled_permission_execution_authorization_draft_candidate_ready may be true",
      "controlled_permission_execution_authorization_draft_ready may be true",
      "permission_execution_authorization_draft_recorded may be true",
      "controlled_permission_execution_authorization_draft_review_candidate_ready may be true"
    ];
    const mustMentionFalse = falseAuthorityFlags.map((flag) => flag + " remains false");
    return mustMentionTrue.every((phrase) => text.includes(phrase)) &&
      mustMentionFalse.every((phrase) => text.includes(phrase));
  }

  function requiredMissing(config, state, draft) {
    const required = (config.required_by_state && config.required_by_state[state]) || [];
    return required.filter((key) => !compact(draft[key]));
  }

  function blocked(status, details) {
    return {
      draft_status: status,
      blocked: true,
      controlled_permission_execution_authorization_draft_ready: false,
      permission_execution_authorization_draft_recorded: false,
      controlled_permission_execution_authorization_draft_review_candidate_ready: false,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      details
    };
  }

  function controlledPermissionExecutionAuthorizationDraftGate(config, decisionPacket, draft) {
    if (!founderDecisionPacketReady(decisionPacket, config)) {
      return blocked("Blocked: founder decision packet must be the v3.6.7 draft-only, non-authorizing posture packet.", {
        next_gate_required: "Controlled permission execution authorization draft gate"
      });
    }

    const state = compact(draft && draft.draft_state) || "Draft packet";
    const missing = requiredMissing(config, state, draft || {});
    if (missing.length) {
      return blocked("Blocked: missing required fields for " + state + ".", { missing });
    }

    if (!draftPreservesCarry(draft, decisionPacket, config)) {
      return blocked("Blocked: draft must preserve the v3.6.7 source ids, review route, questions, and authority audit.", {
        required_identity: sourceIdentityFields,
        required_handoff: handoffFields
      });
    }

    const textFields = [
      "draft_scope",
      "draft_language",
      "draft_rationale",
      "draft_evidence_summary",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check"
    ];
    for (const field of textFields) {
      if (hasUnsafeAuthority(draft[field])) {
        return blocked("Blocked: " + field + " must not grant permission, authorization, or execution.", { field });
      }
    }

    if (!keepsNonExecutionDraftBoundary(draft.non_execution_draft_clause)) {
      return blocked("Blocked: non-execution draft clause must keep authority false.", {});
    }

    if (!compact(draft.draft_scope).includes("v3.6.7") ||
        !hasText(draft.draft_rationale, [["v3.6.7"], ["question handoff"], ["authority flag audit"], ["source ids"], ["draft review gate"], ["not a live authorization"]]) ||
        !compact(draft.draft_evidence_summary).includes("authority flag audit")) {
      return blocked("Blocked: draft text must name the v3.6.7 handoff, source ids, draft review gate, and authority audit.", {});
    }

    if (hasUnsafeAuthority(draft.production_boundary) || !compact(draft.production_boundary).includes("Production remains unavailable")) {
      return blocked("Blocked: production boundary must stay closed.", {});
    }

    if (state === "Needs draft clarification") {
      return blocked("Needs clarification: answer the draft question before review readiness.", {
        clarification_question: draft.clarification_question
      });
    }

    if (state === "Return to founder decision") {
      return blocked("Return: send packet back to founder decision.", { return_reason: draft.return_reason });
    }

    if (state === "Draft hold") {
      return blocked("Hold: draft is paused.", { hold_reason: draft.hold_reason });
    }

    if (state === "Draft rejected" || state === "Authorization approval blocked" || state === "Execution blocked" || state === "Production forbidden") {
      return blocked("Blocked: " + (draft.block_reason || state), { state });
    }

    if (state === "Draft expired") {
      return blocked("Expired: recheck the founder decision and evidence.", { hold_reason: draft.hold_reason });
    }

    if (state !== "Controlled authorization draft prepared") {
      return blocked("Draft: packet is not ready for draft review.", { state });
    }

    return {
      schema_version: config.schema_version,
      release: config.release,
      draft_status: "Controlled draft review candidate prepared; execution remains false.",
      controlled_permission_execution_authorization_draft_gate_id: draft.controlled_permission_execution_authorization_draft_gate_id,
      founder_permission_execution_authorization_decision_gate_id: draft.founder_permission_execution_authorization_decision_gate_id,
      review_decision_gate_id: draft.review_decision_gate_id,
      controlled_permission_execution_authorization_draft_review_gate_id: draft.controlled_permission_execution_authorization_draft_review_gate_id,
      founder_decision_gate_id: draft.founder_decision_gate_id,
      authorization_review_gate_id: draft.authorization_review_gate_id,
      permission_execution_authorization_preflight_id: draft.permission_execution_authorization_preflight_id,
      controlled_permission_execution_hold_id: draft.controlled_permission_execution_hold_id,
      source_answer_id: draft.source_answer_id,
      source_record_id: draft.source_record_id,
      source_family: draft.source_family,
      review_route: draft.review_route,
      founder_question: draft.founder_question,
      permission_question: draft.permission_question,
      authority_flag_audit: draft.authority_flag_audit,
      founder_permission_execution_authorization_decision_ready: decisionPacket.founder_permission_execution_authorization_decision_ready === true,
      founder_permission_execution_authorization_decision_recorded: decisionPacket.founder_permission_execution_authorization_decision_recorded === true,
      controlled_permission_execution_authorization_draft_candidate_ready: decisionPacket.controlled_permission_execution_authorization_draft_candidate_ready === true,
      controlled_permission_execution_authorization_draft_ready: true,
      permission_execution_authorization_draft_recorded: true,
      controlled_permission_execution_authorization_draft_review_candidate_ready: true,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      draft_scope: draft.draft_scope,
      draft_language: draft.draft_language,
      draft_rationale: draft.draft_rationale,
      draft_evidence_summary: draft.draft_evidence_summary,
      non_execution_draft_clause: draft.non_execution_draft_clause,
      risk_acknowledgment: draft.risk_acknowledgment,
      rollback_condition: draft.rollback_condition,
      monitoring_condition: draft.monitoring_condition,
      stop_condition: draft.stop_condition,
      expiry_check: draft.expiry_check,
      production_boundary: draft.production_boundary,
      preserves_source_identity: sourceIdentityFields.every((field) => compact(draft[field]) === compact(config.source[field])),
      preserves_review_route: compact(draft.review_route) === compact(config.source.review_route),
      preserves_founder_question: compact(draft.founder_question) === compact(config.source.founder_question),
      preserves_permission_question: compact(draft.permission_question) === compact(config.source.permission_question),
      preserves_authority_flag_audit: compact(draft.authority_flag_audit) === compact(config.source.authority_flag_audit),
      next_gate_required: "Controlled permission execution authorization draft review gate",
      created_at: new Date().toISOString()
    };
  }

  function draftSnapshot(result) {
    return {
      status: result.draft_status,
      ready: result.controlled_permission_execution_authorization_draft_ready === true,
      review_candidate: result.controlled_permission_execution_authorization_draft_review_candidate_ready === true,
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
    const card = document.getElementById("draftGateResultCard");
    if (!card) return;
    const snapshot = draftSnapshot(result);
    card.dataset.state = snapshot.status || "Blocked";
    card.innerHTML = '<span>Draft result</span>' +
      '<h2>' + snapshot.status + '</h2>' +
      '<div class="draft-gate-list">' +
      '<div class="draft-gate-card"><span>Draft ready</span><strong>' + String(snapshot.ready) + '</strong></div>' +
      '<div class="draft-gate-card"><span>Review candidate</span><strong>' + String(snapshot.review_candidate) + '</strong></div>' +
      '<div class="draft-gate-card"><span>Permission granted</span><strong>' + String(snapshot.permission_granted) + '</strong></div>' +
      '<div class="draft-gate-card"><span>Execution allowed</span><strong>' + String(snapshot.execution_allowed) + '</strong></div>' +
      '</div>';
  }

  function renderList(id, items) {
    const root = document.getElementById(id);
    if (!root) return;
    root.innerHTML = items.map((item) => '<div class="draft-gate-card"><span>' + item.label + '</span><strong>' + item.value + '</strong></div>').join("");
  }

  function loadConfig(config) {
    const draft = config.sample_draft;
    setValue("draftDecisionPacket", JSON.stringify(config.sample_founder_decision_packet, null, 2));
    setValue("draftState", draft.draft_state);
    setValue("draftActor", draft.draft_actor);
    setValue("draftName", draft.drafter_name);
    setValue("draftGateId", draft.controlled_permission_execution_authorization_draft_gate_id);
    setValue("draftFounderPostureId", draft.founder_permission_execution_authorization_decision_gate_id);
    setValue("draftReviewDecisionId", draft.review_decision_gate_id);
    setValue("draftDraftReviewId", draft.controlled_permission_execution_authorization_draft_review_gate_id);
    setValue("draftDecisionId", draft.founder_decision_gate_id);
    setValue("draftReviewId", draft.authorization_review_gate_id);
    setValue("draftPreflightId", draft.permission_execution_authorization_preflight_id);
    setValue("draftHoldId", draft.controlled_permission_execution_hold_id);
    setValue("draftSourceAnswer", draft.source_answer_id);
    setValue("draftSourceRecord", draft.source_record_id);
    setValue("draftSourceFamily", draft.source_family);
    setValue("draftReviewRoute", draft.review_route);
    setValue("draftFounderQuestion", draft.founder_question);
    setValue("draftPermissionQuestion", draft.permission_question);
    setValue("draftAuthorityAudit", draft.authority_flag_audit);
    setValue("draftScopeText", draft.draft_scope);
    setValue("draftLanguage", draft.draft_language);
    setValue("draftRationale", draft.draft_rationale);
    setValue("draftSummary", draft.draft_evidence_summary);
    setValue("draftBoundary", draft.non_execution_draft_clause);
    setValue("draftRisk", draft.risk_acknowledgment);
    setValue("draftRollback", draft.rollback_condition);
    setValue("draftMonitoring", draft.monitoring_condition);
    setValue("draftStopCondition", draft.stop_condition);
    setValue("draftExpiry", draft.expiry_check);
    setValue("draftProductionBoundary", draft.production_boundary);
    setValue("draftClarification", draft.clarification_question);
    setValue("draftReturnReason", draft.return_reason);
    setValue("draftHoldReason", draft.hold_reason);
    setValue("draftBlockReason", draft.block_reason);
    renderList("draftGateScope", [
      { label: "Input", value: "v3.6.7 founder posture" },
      { label: "Output", value: "Review candidate" },
      { label: "Source identity", value: "Preserved" },
      { label: "Authority", value: "Closed" }
    ]);
    renderList("draftGateChecks", config.draft_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readDraft() {
    return {
      draft_state: readValue("draftState"),
      draft_actor: readValue("draftActor"),
      drafter_name: readValue("draftName"),
      controlled_permission_execution_authorization_draft_gate_id: readValue("draftGateId"),
      founder_permission_execution_authorization_decision_gate_id: readValue("draftFounderPostureId"),
      review_decision_gate_id: readValue("draftReviewDecisionId"),
      controlled_permission_execution_authorization_draft_review_gate_id: readValue("draftDraftReviewId"),
      founder_decision_gate_id: readValue("draftDecisionId"),
      authorization_review_gate_id: readValue("draftReviewId"),
      permission_execution_authorization_preflight_id: readValue("draftPreflightId"),
      controlled_permission_execution_hold_id: readValue("draftHoldId"),
      source_answer_id: readValue("draftSourceAnswer"),
      source_record_id: readValue("draftSourceRecord"),
      source_family: readValue("draftSourceFamily"),
      review_route: readValue("draftReviewRoute"),
      founder_question: readValue("draftFounderQuestion"),
      permission_question: readValue("draftPermissionQuestion"),
      authority_flag_audit: readValue("draftAuthorityAudit"),
      draft_scope: readValue("draftScopeText"),
      draft_language: readValue("draftLanguage"),
      draft_rationale: readValue("draftRationale"),
      draft_evidence_summary: readValue("draftSummary"),
      non_execution_draft_clause: readValue("draftBoundary"),
      risk_acknowledgment: readValue("draftRisk"),
      rollback_condition: readValue("draftRollback"),
      monitoring_condition: readValue("draftMonitoring"),
      stop_condition: readValue("draftStopCondition"),
      expiry_check: readValue("draftExpiry"),
      production_boundary: readValue("draftProductionBoundary"),
      clarification_question: readValue("draftClarification"),
      return_reason: readValue("draftReturnReason"),
      hold_reason: readValue("draftHoldReason"),
      block_reason: readValue("draftBlockReason")
    };
  }

  function saved() {
    return safeParse(localStorage.getItem("vedapath-controlled-permission-execution-authorization-drafts") || "[]", []);
  }

  function writeSaved(items) {
    localStorage.setItem("vedapath-controlled-permission-execution-authorization-drafts", JSON.stringify(items.slice(0, 12)));
  }

  function renderSaved() {
    const list = document.getElementById("draftGateSaved");
    if (!list) return;
    const items = saved();
    list.innerHTML = items.length ? items.map((item) => '<div class="draft-gate-card"><span>' + item.created_at + '</span><strong>' + item.draft_status + '</strong></div>').join("") : '<p class="muted">No local draft packets saved yet.</p>';
  }

  async function init() {
    if (typeof document === "undefined") return;
    const response = await fetch(configUrl);
    const config = await response.json();
    const state = document.getElementById("draftState");
    if (state) {
      state.innerHTML = config.draft_states.map((name) => '<option value="' + name + '">' + name + '</option>').join("");
    }
    loadConfig(config);
    renderSaved();
    const run = () => {
      const decisionPacket = safeParse(readValue("draftDecisionPacket"), {});
      const result = controlledPermissionExecutionAuthorizationDraftGate(config, decisionPacket, readDraft());
      setValue("draftOutput", JSON.stringify(result, null, 2));
      renderCard(result);
      return result;
    };
    document.getElementById("runDraftGate")?.addEventListener("click", run);
    document.getElementById("loadDraftSample")?.addEventListener("click", () => {
      loadConfig(config);
      run();
    });
    document.getElementById("saveDraftGate")?.addEventListener("click", () => {
      const result = run();
      writeSaved([result, ...saved()]);
      renderSaved();
    });
    document.getElementById("clearDraftGates")?.addEventListener("click", () => {
      writeSaved([]);
      renderSaved();
    });
    document.getElementById("copyDraftGate")?.addEventListener("click", async () => {
      const output = readValue("draftOutput");
      if (navigator.clipboard && output) await navigator.clipboard.writeText(output);
    });
    run();
  }

  window.vedapathControlledPermissionExecutionAuthorizationDraftGate = {
    founderDecisionPacketReady,
    matchesSourceHandoff,
    matchesSourceIdentity,
    draftPreservesCarry,
    draftPreservesHandoff: draftPreservesCarry,
    hasUnsafeAuthority,
    keepsNonExecutionDraftBoundary,
    controlledPermissionExecutionAuthorizationDraftGate,
    draftSnapshot
  };

  init().catch((error) => {
    console.error("Controlled permission execution authorization draft gate failed", error);
  });
})();

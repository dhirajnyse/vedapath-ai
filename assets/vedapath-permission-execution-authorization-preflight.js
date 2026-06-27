(function () {
  const configUrl = "data/vedapath-permission-execution-authorization-preflight.json";
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
  const holdReadyFlags = [
    "controlled_permission_execution_hold_ready",
    "permission_execution_hold_recorded",
    "permission_execution_authorization_preflight_candidate_ready"
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

  function holdPacketReady(packet) {
    return Boolean(
      packet &&
      packet.schema_version === "controlled-permission-execution-hold-v1" &&
      packet.hold_status === "Hold ready for preflight" &&
      packet.next_gate_required === "Permission execution authorization preflight" &&
      allFlagsTrue(packet, holdReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags)
    );
  }

  function keepsNonExecutionPreflightBoundary(value) {
    const text = compact(value);
    if (!text || hasUnsafeAuthority(text)) return false;
    const mustMentionTrue = [
      "permission_execution_authorization_preflight_ready may be true",
      "permission_execution_authorization_preflight_recorded may be true",
      "controlled_permission_execution_authorization_review_candidate_ready may be true"
    ];
    const mustMentionFalse = falseAuthorityFlags.map((flag) => flag + " remains false");
    return mustMentionTrue.every((phrase) => text.includes(phrase)) &&
      mustMentionFalse.every((phrase) => text.includes(phrase));
  }

  function requiredMissing(config, state, preflight) {
    const required = (config.required_by_state && config.required_by_state[state]) || [];
    return required.filter((key) => !compact(preflight[key]));
  }

  function blocked(status, details) {
    return {
      preflight_status: status,
      blocked: true,
      permission_execution_authorization_preflight_ready: false,
      permission_execution_authorization_preflight_recorded: false,
      controlled_permission_execution_authorization_review_candidate_ready: false,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      details
    };
  }

  function permissionExecutionAuthorizationPreflight(config, holdPacket, preflight) {
    if (!holdPacketReady(holdPacket)) {
      return blocked("Blocked: execution hold must be ready and non-authorizing.", {
        next_gate_required: "Permission execution authorization preflight"
      });
    }

    const state = compact(preflight && preflight.preflight_state) || "Draft preflight";
    const missing = requiredMissing(config, state, preflight || {});
    if (missing.length) {
      return blocked("Blocked: missing required fields for " + state + ".", { missing });
    }

    const textFields = [
      "preflight_scope",
      "preflight_language",
      "preflight_rationale",
      "evidence_checklist",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check"
    ];
    for (const field of textFields) {
      if (hasUnsafeAuthority(preflight[field])) {
        return blocked("Blocked: " + field + " must not grant permission, authorization, or execution.", { field });
      }
    }

    if (!keepsNonExecutionPreflightBoundary(preflight.non_execution_preflight_clause)) {
      return blocked("Blocked: non-execution preflight clause must keep authority false.", {});
    }

    if (hasUnsafeAuthority(preflight.production_boundary) || !compact(preflight.production_boundary).includes("Production remains unavailable")) {
      return blocked("Blocked: production boundary must stay closed.", {});
    }

    if (state === "Needs preflight clarification") {
      return blocked("Needs clarification: answer the preflight question before review readiness.", {
        clarification_question: preflight.clarification_question
      });
    }

    if (state === "Return to execution hold") {
      return blocked("Return: send packet back to execution hold.", { return_reason: preflight.return_reason });
    }

    if (state === "Permission preflight blocked" || state === "Authorization blocked" || state === "Execution blocked" || state === "Production forbidden") {
      return blocked("Blocked: " + (preflight.block_reason || state), { state });
    }

    if (state === "Preflight paused") {
      return blocked("Paused: preflight is held.", { hold_reason: preflight.hold_reason });
    }

    if (state === "Preflight expired") {
      return blocked("Expired: recheck the hold and evidence.", { hold_reason: preflight.hold_reason });
    }

    if (state !== "Preflight ready for authorization review") {
      return blocked("Draft: preflight is not ready for authorization review.", { state });
    }

    return {
      schema_version: config.schema_version,
      release: config.release,
      preflight_status: "Preflight ready for authorization review",
      permission_execution_authorization_preflight_id: preflight.permission_execution_authorization_preflight_id,
      controlled_permission_execution_hold_id: preflight.controlled_permission_execution_hold_id,
      controlled_founder_permission_decision_gate_id: preflight.controlled_founder_permission_decision_gate_id,
      controlled_authorization_permission_review_gate_id: preflight.controlled_authorization_permission_review_gate_id,
      controlled_authorization_permission_preflight_id: preflight.controlled_authorization_permission_preflight_id,
      founder_authorization_instruction_gate_id: preflight.founder_authorization_instruction_gate_id,
      controlled_authorization_review_gate_id: preflight.controlled_authorization_review_gate_id,
      controlled_execution_packet_authorization_draft_id: preflight.controlled_execution_packet_authorization_draft_id,
      source_answer_id: preflight.source_answer_id,
      source_record_id: preflight.source_record_id,
      source_family: preflight.source_family,
      permission_execution_authorization_preflight_ready: true,
      permission_execution_authorization_preflight_recorded: true,
      controlled_permission_execution_authorization_review_candidate_ready: true,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      preflight_scope: preflight.preflight_scope,
      preflight_language: preflight.preflight_language,
      preflight_rationale: preflight.preflight_rationale,
      evidence_checklist: preflight.evidence_checklist,
      non_execution_preflight_clause: preflight.non_execution_preflight_clause,
      risk_acknowledgment: preflight.risk_acknowledgment,
      rollback_condition: preflight.rollback_condition,
      monitoring_condition: preflight.monitoring_condition,
      stop_condition: preflight.stop_condition,
      expiry_check: preflight.expiry_check,
      production_boundary: preflight.production_boundary,
      next_gate_required: "Controlled permission execution authorization review gate",
      created_at: new Date().toISOString()
    };
  }

  function preflightSnapshot(result) {
    return {
      status: result.preflight_status,
      ready: result.permission_execution_authorization_preflight_ready === true,
      review_next: result.controlled_permission_execution_authorization_review_candidate_ready === true,
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
    const card = document.getElementById("permissionPreflightResultCard");
    if (!card) return;
    card.dataset.state = result.preflight_status || "Blocked";
    const snapshot = preflightSnapshot(result);
    card.innerHTML = '<span>Preflight result</span>' +
      '<h2>' + snapshot.status + '</h2>' +
      '<div class="permission-preflight-grid">' +
      '<div class="permission-preflight-card ' + (snapshot.ready ? 'ready' : 'blocked') + '"><span>Review ready</span><strong>' + String(snapshot.ready) + '</strong></div>' +
      '<div class="permission-preflight-card"><span>Next gate</span><strong>' + (snapshot.next_gate_required || 'None') + '</strong></div>' +
      '<div class="permission-preflight-card"><span>Permission granted</span><strong>' + String(snapshot.permission_granted) + '</strong></div>' +
      '<div class="permission-preflight-card"><span>Execution allowed</span><strong>' + String(snapshot.execution_allowed) + '</strong></div>' +
      '</div>';
  }

  function renderList(id, items) {
    const root = document.getElementById(id);
    if (!root) return;
    root.innerHTML = items.map((item) => '<div class="permission-preflight-card"><span>' + item.label + '</span><strong>' + item.value + '</strong></div>').join("");
  }

  function loadConfig(config) {
    const preflight = config.sample_preflight;
    setValue("permissionPreflightHoldPacket", JSON.stringify(config.sample_hold_packet, null, 2));
    setValue("permissionPreflightState", preflight.preflight_state);
    setValue("permissionPreflightActor", preflight.preflight_actor);
    setValue("permissionPreflightReviewer", preflight.reviewer_name);
    setValue("permissionPreflightId", preflight.permission_execution_authorization_preflight_id);
    setValue("permissionPreflightHoldId", preflight.controlled_permission_execution_hold_id);
    setValue("permissionPreflightFounderDecisionId", preflight.controlled_founder_permission_decision_gate_id);
    setValue("permissionPreflightPermissionReviewId", preflight.controlled_authorization_permission_review_gate_id);
    setValue("permissionPreflightPriorPreflightId", preflight.controlled_authorization_permission_preflight_id);
    setValue("permissionPreflightInstructionGateId", preflight.founder_authorization_instruction_gate_id);
    setValue("permissionPreflightAuthorizationReviewGateId", preflight.controlled_authorization_review_gate_id);
    setValue("permissionPreflightDraftId", preflight.controlled_execution_packet_authorization_draft_id);
    setValue("permissionPreflightSourceAnswer", preflight.source_answer_id);
    setValue("permissionPreflightSourceRecord", preflight.source_record_id);
    setValue("permissionPreflightSourceFamily", preflight.source_family);
    setValue("permissionPreflightScopeText", preflight.preflight_scope);
    setValue("permissionPreflightLanguage", preflight.preflight_language);
    setValue("permissionPreflightRationale", preflight.preflight_rationale);
    setValue("permissionPreflightChecklist", preflight.evidence_checklist);
    setValue("permissionPreflightBoundary", preflight.non_execution_preflight_clause);
    setValue("permissionPreflightRisk", preflight.risk_acknowledgment);
    setValue("permissionPreflightRollback", preflight.rollback_condition);
    setValue("permissionPreflightMonitoring", preflight.monitoring_condition);
    setValue("permissionPreflightStopCondition", preflight.stop_condition);
    setValue("permissionPreflightExpiry", preflight.expiry_check);
    setValue("permissionPreflightProductionBoundary", preflight.production_boundary);
    setValue("permissionPreflightClarification", preflight.clarification_question);
    setValue("permissionPreflightReturnReason", preflight.return_reason);
    setValue("permissionPreflightHoldReason", preflight.hold_reason);
    setValue("permissionPreflightBlockReason", preflight.block_reason);
    renderList("permissionPreflightScope", [
      { label: "Preflight", value: "Review readiness only" },
      { label: "Permission", value: "False" },
      { label: "Authorization", value: "False" },
      { label: "Execution", value: "False" }
    ]);
    renderList("permissionPreflightChecks", config.preflight_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readPreflight() {
    return {
      preflight_state: readValue("permissionPreflightState"),
      preflight_actor: readValue("permissionPreflightActor"),
      reviewer_name: readValue("permissionPreflightReviewer"),
      permission_execution_authorization_preflight_id: readValue("permissionPreflightId"),
      controlled_permission_execution_hold_id: readValue("permissionPreflightHoldId"),
      controlled_founder_permission_decision_gate_id: readValue("permissionPreflightFounderDecisionId"),
      controlled_authorization_permission_review_gate_id: readValue("permissionPreflightPermissionReviewId"),
      controlled_authorization_permission_preflight_id: readValue("permissionPreflightPriorPreflightId"),
      founder_authorization_instruction_gate_id: readValue("permissionPreflightInstructionGateId"),
      controlled_authorization_review_gate_id: readValue("permissionPreflightAuthorizationReviewGateId"),
      controlled_execution_packet_authorization_draft_id: readValue("permissionPreflightDraftId"),
      source_answer_id: readValue("permissionPreflightSourceAnswer"),
      source_record_id: readValue("permissionPreflightSourceRecord"),
      source_family: readValue("permissionPreflightSourceFamily"),
      preflight_scope: readValue("permissionPreflightScopeText"),
      preflight_language: readValue("permissionPreflightLanguage"),
      preflight_rationale: readValue("permissionPreflightRationale"),
      evidence_checklist: readValue("permissionPreflightChecklist"),
      non_execution_preflight_clause: readValue("permissionPreflightBoundary"),
      risk_acknowledgment: readValue("permissionPreflightRisk"),
      rollback_condition: readValue("permissionPreflightRollback"),
      monitoring_condition: readValue("permissionPreflightMonitoring"),
      stop_condition: readValue("permissionPreflightStopCondition"),
      expiry_check: readValue("permissionPreflightExpiry"),
      production_boundary: readValue("permissionPreflightProductionBoundary"),
      clarification_question: readValue("permissionPreflightClarification"),
      return_reason: readValue("permissionPreflightReturnReason"),
      hold_reason: readValue("permissionPreflightHoldReason"),
      block_reason: readValue("permissionPreflightBlockReason")
    };
  }

  function saved() {
    return safeParse(localStorage.getItem("vedapath-permission-execution-authorization-preflights") || "[]", []);
  }

  function writeSaved(items) {
    localStorage.setItem("vedapath-permission-execution-authorization-preflights", JSON.stringify(items.slice(0, 12)));
  }

  function renderSaved() {
    const list = document.getElementById("permissionPreflightSaved");
    if (!list) return;
    const items = saved();
    list.innerHTML = items.length ? items.map((item) => '<div class="permission-preflight-card"><span>' + item.created_at + '</span><strong>' + item.preflight_status + '</strong></div>').join("") : '<p class="muted">No local preflights saved yet.</p>';
  }

  async function init() {
    if (typeof document === "undefined") return;
    const response = await fetch(configUrl);
    const config = await response.json();
    const state = document.getElementById("permissionPreflightState");
    if (state) {
      state.innerHTML = config.preflight_states.map((name) => '<option value="' + name + '">' + name + '</option>').join("");
    }
    loadConfig(config);
    renderSaved();
    const run = () => {
      const holdPacket = safeParse(readValue("permissionPreflightHoldPacket"), {});
      const result = permissionExecutionAuthorizationPreflight(config, holdPacket, readPreflight());
      setValue("permissionPreflightOutput", JSON.stringify(result, null, 2));
      renderCard(result);
      return result;
    };
    document.getElementById("runPermissionPreflight")?.addEventListener("click", run);
    document.getElementById("loadPermissionPreflightSample")?.addEventListener("click", () => {
      loadConfig(config);
      run();
    });
    document.getElementById("savePermissionPreflight")?.addEventListener("click", () => {
      const result = run();
      writeSaved([result, ...saved()]);
      renderSaved();
    });
    document.getElementById("clearPermissionPreflights")?.addEventListener("click", () => {
      writeSaved([]);
      renderSaved();
    });
    document.getElementById("copyPermissionPreflight")?.addEventListener("click", async () => {
      const output = readValue("permissionPreflightOutput");
      if (navigator.clipboard && output) await navigator.clipboard.writeText(output);
    });
    run();
  }

  window.vedapathPermissionExecutionAuthorizationPreflight = {
    holdPacketReady,
    hasUnsafeAuthority,
    keepsNonExecutionPreflightBoundary,
    permissionExecutionAuthorizationPreflight,
    preflightSnapshot
  };

  init().catch((error) => {
    console.error("Permission execution authorization preflight failed", error);
  });
})();

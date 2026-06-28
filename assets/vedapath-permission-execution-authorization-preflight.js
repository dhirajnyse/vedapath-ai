(() => {
  const configUrl = "data/vedapath-permission-execution-authorization-preflight.json";
  const storageKey = "vedapath-permission-execution-authorization-preflights";
  const pageDocument = typeof document === "undefined" ? null : document;

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

  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);

  function compact(value) {
    return String(value || "").trim();
  }

  function hasText(value, groups) {
    const text = String(value || "").toLowerCase();
    return groups.every((group) => group.some((term) => text.includes(term.toLowerCase())));
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

  function keepsAuthorityFlagAudit(value) {
    const text = String(value || "");
    return [
      "execution_packet_authorized=false",
      "execution_authorized=false",
      "execution_allowed=false",
      "founder_instruction_granted=false",
      "source_promotion_allowed=false",
      "promotion_execution_allowed=false",
      "implementation_authorized=false",
      "implementation_execution_allowed=false",
      "controlled_storage_entry_allowed=false",
      "storage_write_enabled=false",
      "canonical_write_allowed=false",
      "source_write_executed=false",
      "actual_storage_write_executed=false",
      "production_ready=false",
      "production_launch_allowed=false",
      "public_release_allowed=false"
    ].every((flag) => text.includes(flag));
  }

  function holdPacketReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-permission-execution-hold-v2" &&
      packet.release === "v3.4.4" &&
      packet.hold_status === "Hold ready for preflight" &&
      packet.next_gate_required === "Permission execution authorization preflight" &&
      allFlagsTrue(packet, holdReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags) &&
      packet.review_route === "Ready for founder instruction" &&
      hasText(packet.founder_question, [["Founder question:"], ["reviewed"], ["source-locked"], ["authorization"], ["execution"], ["storage"], ["public release"], ["production"], ["false"]]) &&
      hasText(packet.permission_question, [["reviewer"], ["controlled authorization permission review"], ["exact source packet"], ["founder question"], ["without granting permission"], ["authorization"], ["execution"], ["storage writes"], ["canonical writes"], ["public release"], ["production"]]) &&
      keepsAuthorityFlagAudit(packet.authority_flag_audit);
  }

  function idMatches(preflight, packet, key) {
    return !preflight[key] || !packet[key] || preflight[key] === packet[key];
  }

  function keepsNonExecutionPreflightBoundary(value) {
    const text = compact(value);
    if (!text || hasUnsafeAuthority(text)) return false;
    const readyMentions = [
      "controlled_permission_execution_hold_ready may be true",
      "permission_execution_hold_recorded may be true",
      "permission_execution_authorization_preflight_candidate_ready may be true",
      "permission_execution_authorization_preflight_ready may be true",
      "permission_execution_authorization_preflight_recorded may be true",
      "controlled_permission_execution_authorization_review_candidate_ready may be true"
    ];
    const falseMentions = falseAuthorityFlags.map((flag) => flag + " remains false");
    return readyMentions.every((phrase) => text.includes(phrase)) &&
      falseMentions.every((phrase) => text.includes(phrase));
  }

  function keepsProductionBoundary(value) {
    return !hasUnsafeAuthority(value) &&
      hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function requiredMissing(config, state, preflight) {
    const required = (config.required_by_state && config.required_by_state[state]) || [];
    return required.filter((key) => !compact(preflight[key]));
  }

  function blocked(status, details = {}) {
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

  function permissionExecutionAuthorizationPreflight(config, holdPacket, preflight = {}) {
    const state = compact(preflight.preflight_state) || "Draft preflight";
    const missing = requiredMissing(config, state, preflight);
    const issues = [];

    if (!holdPacketReady(holdPacket)) {
      issues.push("v3.4.4 execution hold must be ready with question handoff, authority audit, and all authority flags false");
    }

    [
      "controlled_permission_execution_hold_id",
      "controlled_founder_permission_decision_gate_id",
      "controlled_authorization_permission_review_gate_id",
      "controlled_authorization_permission_preflight_id",
      "founder_authorization_instruction_gate_id",
      "controlled_authorization_review_gate_id",
      "controlled_execution_packet_authorization_draft_id",
      "founder_authorization_decision_gate_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "review_route",
      "founder_question",
      "permission_question",
      "authority_flag_audit"
    ].forEach((key) => {
      if (!idMatches(preflight, holdPacket || {}, key)) issues.push(key + " must match the v3.4.4 hold packet");
    });

    const readyCandidate = state === "Preflight ready for authorization review";
    if (readyCandidate && !hasText(preflight.preflight_scope, [["check"], ["v3.4.4"], ["execution hold"], ["question handoff"], ["authority flag audit"], ["authorization review"], ["not permission grant"], ["not authorization approval"], ["not execution"], ["cannot", "promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      issues.push("preflight scope must be review-readiness only and preserve the v3.4.4 question handoff and authority audit");
    }
    if (readyCandidate && (hasUnsafeAuthority(preflight.preflight_language) || !hasText(preflight.preflight_language, [["preflight result"], ["question handoff"], ["authority audit"], ["review readiness only"], ["permission is not granted"], ["authorization is not approved"], ["execution is not allowed"], ["no system may run"]]))) {
      issues.push("preflight language must prepare review only and clearly deny permission, authorization approval, execution, and system run");
    }
    if (readyCandidate && !hasText(preflight.preflight_rationale, [["v3.4.4 hold"], ["ready"], ["source-locked"], ["question handoff"], ["authority flag audit"], ["review gate"], ["not approval"], ["runnable action"]])) {
      issues.push("preflight rationale must separate review readiness from approval or runnable action");
    }
    if (readyCandidate && !hasText(preflight.evidence_checklist, [["hold id"], ["founder decision"], ["permission review"], ["prior preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["source answer"], ["source record"], ["source family"], ["review route"], ["founder question"], ["permission question"], ["authority flag audit"], ["rights"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      issues.push("evidence checklist must keep route, question handoff, authority audit, source, rollback, monitoring, expiry, and production boundary visible");
    }
    if (readyCandidate && !keepsNonExecutionPreflightBoundary(preflight.non_execution_preflight_clause)) {
      issues.push("non-execution preflight clause must allow only preflight readiness and keep authority flags false");
    }
    if (readyCandidate && !hasText(preflight.risk_acknowledgment, [["risk remains"], ["hold mismatch"], ["review route mismatch"], ["founder question mismatch"], ["permission question mismatch"], ["authority flag audit mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["ambiguous"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      issues.push("risk acknowledgment must block on mismatches, ambiguity, missing controls, packet/code changes, or true authority flags");
    }
    if (readyCandidate && !hasText(preflight.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["hold audit"], ["preflight audit"], ["authorization review"], ["no source state"], ["written"]])) {
      issues.push("rollback condition must include replay, before_hash, failure review, audits, authorization review, and no source state write");
    }
    if (readyCandidate && !hasText(preflight.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["authorization review"]])) {
      issues.push("monitoring condition must keep audit receipt, stop condition, reviewer handoff, post-execution verification, and before-write check visible");
    }
    if (readyCandidate && !hasText(preflight.stop_condition, [["stop"], ["hold id mismatches"], ["review route mismatches"], ["founder question mismatches"], ["permission question mismatches"], ["authority flag audit mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["preflight language"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      issues.push("stop condition must stop on route/question/audit mismatches, source mismatch, missing controls, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(preflight.expiry_check, [["expires"], ["material hold"], ["founder decision"], ["permission review"], ["preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["rollback"], ["monitoring"], ["packet"], ["code change"], ["rechecked"], ["not permission"], ["not authorization"], ["not execution"]])) {
      issues.push("expiry check must state that preflight expires and is not permission, authorization, or execution");
    }
    if (readyCandidate && !keepsProductionBoundary(preflight.production_boundary)) {
      issues.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }

    if (state === "Needs preflight clarification" && !compact(preflight.clarification_question)) issues.push("clarification question is required");
    if (state === "Return to execution hold" && !compact(preflight.return_reason)) issues.push("return reason is required");
    if ((state === "Permission preflight blocked" || state === "Authorization blocked" || state === "Execution blocked" || state === "Production forbidden") && !compact(preflight.block_reason)) issues.push("block reason is required");
    if ((state === "Preflight paused" || state === "Preflight expired") && !compact(preflight.hold_reason)) issues.push("hold reason is required");

    if (missing.length) return blocked("Blocked: missing required fields for " + state + ".", { missing });
    if (issues.length) return blocked("Blocked: " + issues[0], { issues });
    if (state !== "Preflight ready for authorization review") return blocked("Draft: preflight is not ready for authorization review.", { state });

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
      founder_authorization_decision_gate_id: preflight.founder_authorization_decision_gate_id,
      source_answer_id: preflight.source_answer_id,
      source_record_id: preflight.source_record_id,
      source_family: preflight.source_family,
      review_route: preflight.review_route,
      founder_question: preflight.founder_question,
      permission_question: preflight.permission_question,
      authority_flag_audit: preflight.authority_flag_audit,
      permission_execution_authorization_preflight_ready: true,
      permission_execution_authorization_preflight_recorded: true,
      controlled_permission_execution_authorization_review_candidate_ready: true,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      preflight_actor: preflight.preflight_actor,
      reviewer_name: preflight.reviewer_name,
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
      permission: result.permission_granted === true,
      authorization: result.authorization_permission_granted === true,
      execution: result.execution_allowed === true,
      storage: result.storage_write_enabled === true,
      production: result.production_ready === true,
      next_gate_required: result.next_gate_required || null
    };
  }

  function safeParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function setValue(id, value) {
    const el = pageDocument ? pageDocument.getElementById(id) : null;
    if (el) el.value = value == null ? "" : String(value);
  }

  function readValue(id) {
    const el = pageDocument ? pageDocument.getElementById(id) : null;
    return el ? el.value : "";
  }

  function card(label, value, tone = "") {
    return '<article class="permission-preflight-card ' + safe(tone) + '"><span>' + safe(label) + '</span><strong>' + safe(value ?? "None") + '</strong></article>';
  }

  function renderCard(result) {
    const root = pageDocument ? pageDocument.getElementById("permissionPreflightResultCard") : null;
    if (!root) return;
    const snapshot = preflightSnapshot(result);
    root.dataset.state = snapshot.status || "Blocked";
    root.innerHTML = '<span>Preflight result</span>' +
      '<h2>' + safe(snapshot.status) + '</h2>' +
      '<p class="muted">Preflight ready: ' + safe(snapshot.ready) + ' | Permission: ' + safe(snapshot.permission) + ' | Execution: ' + safe(snapshot.execution) + '</p>' +
      '<div class="permission-preflight-grid">' +
        card("Review candidate", snapshot.review_next, snapshot.review_next ? "ready" : "blocked") +
        card("Next gate", snapshot.next_gate_required || "None") +
        card("Storage write", snapshot.storage, snapshot.storage ? "blocked" : "ready") +
        card("Production", snapshot.production, snapshot.production ? "blocked" : "ready") +
      '</div>';
  }

  function renderList(id, items) {
    const root = pageDocument ? pageDocument.getElementById(id) : null;
    if (!root) return;
    root.innerHTML = items.map((item) => card(item.label, item.value, item.tone)).join("");
  }

  function renderQuestionHandoff(config) {
    const root = pageDocument ? pageDocument.getElementById("permissionPreflightQuestionHandoff") : null;
    if (!root) return;
    const packet = config.sample_hold_packet || {};
    root.innerHTML = [
      ["Review route", packet.review_route],
      ["Founder question", packet.founder_question],
      ["Permission question", packet.permission_question]
    ].map(([label, value]) =>
      '<article class="permission-preflight-question"><strong>' + safe(label) + '</strong><span>' + safe(value) + '</span></article>'
    ).join("");
  }

  function renderAuthorityFlags(config) {
    const root = pageDocument ? pageDocument.getElementById("permissionPreflightAuthorityFlags") : null;
    if (!root) return;
    const packet = config.sample_hold_packet || {};
    const flags = [
      ["Permission grant", packet.permission_granted],
      ["Authorization grant", packet.authorization_permission_granted],
      ["Execution allowed", packet.execution_allowed],
      ["Storage write", packet.storage_write_enabled],
      ["Canonical write", packet.canonical_write_allowed],
      ["Public release", packet.public_release_allowed],
      ["Production", packet.production_ready]
    ];
    root.innerHTML = flags.map(([label, value]) =>
      '<article class="permission-preflight-flag ' + (value ? "open" : "locked") + '"><strong>' + safe(label) + '</strong><span>' + safe(value ? "open" : "false") + '</span></article>'
    ).join("");
  }

  function loadConfig(config) {
    const preflight = config.sample_preflight;
    setValue("permissionPreflightHoldPacket", JSON.stringify(config.sample_hold_packet, null, 2));
    setValue("permissionPreflightState", preflight.preflight_state);
    setValue("permissionPreflightActor", preflight.preflight_actor);
    setValue("permissionPreflightReviewer", preflight.reviewer_name);
    setValue("permissionPreflightReviewRoute", preflight.review_route);
    setValue("permissionPreflightFounderQuestion", preflight.founder_question);
    setValue("permissionPreflightPermissionQuestion", preflight.permission_question);
    setValue("permissionPreflightAuthorityAudit", preflight.authority_flag_audit);
    setValue("permissionPreflightId", preflight.permission_execution_authorization_preflight_id);
    setValue("permissionPreflightHoldId", preflight.controlled_permission_execution_hold_id);
    setValue("permissionPreflightFounderDecisionId", preflight.controlled_founder_permission_decision_gate_id);
    setValue("permissionPreflightPermissionReviewId", preflight.controlled_authorization_permission_review_gate_id);
    setValue("permissionPreflightPriorPreflightId", preflight.controlled_authorization_permission_preflight_id);
    setValue("permissionPreflightInstructionGateId", preflight.founder_authorization_instruction_gate_id);
    setValue("permissionPreflightAuthorizationReviewGateId", preflight.controlled_authorization_review_gate_id);
    setValue("permissionPreflightDraftId", preflight.controlled_execution_packet_authorization_draft_id);
    setValue("permissionPreflightPriorDecisionGateId", preflight.founder_authorization_decision_gate_id);
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
    renderQuestionHandoff(config);
    renderAuthorityFlags(config);
    renderList("permissionPreflightScope", [
      { label: "Input", value: "v3.4.4 hold packet" },
      { label: "Output", value: "Review candidate only" },
      { label: "Permission", value: "False", tone: "ready" },
      { label: "Execution", value: "False", tone: "ready" }
    ]);
    renderList("permissionPreflightChecks", config.preflight_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readPreflight() {
    return {
      preflight_state: readValue("permissionPreflightState"),
      preflight_actor: readValue("permissionPreflightActor"),
      reviewer_name: readValue("permissionPreflightReviewer"),
      review_route: readValue("permissionPreflightReviewRoute"),
      founder_question: readValue("permissionPreflightFounderQuestion"),
      permission_question: readValue("permissionPreflightPermissionQuestion"),
      authority_flag_audit: readValue("permissionPreflightAuthorityAudit"),
      permission_execution_authorization_preflight_id: readValue("permissionPreflightId"),
      controlled_permission_execution_hold_id: readValue("permissionPreflightHoldId"),
      controlled_founder_permission_decision_gate_id: readValue("permissionPreflightFounderDecisionId"),
      controlled_authorization_permission_review_gate_id: readValue("permissionPreflightPermissionReviewId"),
      controlled_authorization_permission_preflight_id: readValue("permissionPreflightPriorPreflightId"),
      founder_authorization_instruction_gate_id: readValue("permissionPreflightInstructionGateId"),
      controlled_authorization_review_gate_id: readValue("permissionPreflightAuthorizationReviewGateId"),
      controlled_execution_packet_authorization_draft_id: readValue("permissionPreflightDraftId"),
      founder_authorization_decision_gate_id: readValue("permissionPreflightPriorDecisionGateId"),
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
    if (typeof localStorage === "undefined") return [];
    const items = safeParse(localStorage.getItem(storageKey) || "[]", []);
    return Array.isArray(items) ? items : [];
  }

  function writeSaved(items) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(items.slice(0, 12)));
  }

  function renderSaved() {
    const list = pageDocument ? pageDocument.getElementById("permissionPreflightSaved") : null;
    if (!list) return;
    const items = saved();
    list.innerHTML = items.length ? items.map((item) =>
      '<div class="permission-preflight-card ' + (item.permission_execution_authorization_preflight_ready ? "ready" : "blocked") + '"><span>' + safe(item.created_at) + '</span><strong>' + safe(item.preflight_status) + '</strong><span>' + safe(item.next_gate_required || "No next gate") + '</span></div>'
    ).join("") : '<p class="muted">No local preflights saved yet.</p>';
  }

  async function init() {
    if (!pageDocument) return;
    const response = await fetch(configUrl);
    const config = await response.json();
    const state = pageDocument.getElementById("permissionPreflightState");
    if (state) {
      state.innerHTML = config.preflight_states.map((name) => '<option value="' + safe(name) + '">' + safe(name) + '</option>').join("");
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
    pageDocument.getElementById("runPermissionPreflight")?.addEventListener("click", run);
    pageDocument.getElementById("loadPermissionPreflightSample")?.addEventListener("click", () => {
      loadConfig(config);
      run();
    });
    pageDocument.getElementById("savePermissionPreflight")?.addEventListener("click", () => {
      const result = run();
      writeSaved([result, ...saved()]);
      renderSaved();
    });
    pageDocument.getElementById("clearPermissionPreflights")?.addEventListener("click", () => {
      writeSaved([]);
      renderSaved();
    });
    pageDocument.getElementById("copyPermissionPreflight")?.addEventListener("click", async () => {
      const text = readValue("permissionPreflightOutput");
      if (navigator.clipboard && text) await navigator.clipboard.writeText(text);
    });
    run();
  }

  window.vedapathPermissionExecutionAuthorizationPreflight = {
    holdPacketReady,
    hasUnsafeAuthority,
    keepsAuthorityFlagAudit,
    keepsNonExecutionPreflightBoundary,
    permissionExecutionAuthorizationPreflight,
    preflightSnapshot
  };

  init().catch((error) => {
    console.error("Permission execution authorization preflight failed", error);
  });
})();

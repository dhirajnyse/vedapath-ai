import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.2.6";
const releaseName = "Controlled Permission Execution Authorization Review Gate";
const releaseBadge = "v3.2.6 review gate";
const previousRelease = "v3.2.5 Permission Execution Authorization Preflight";
const nextGate = "Founder permission execution authorization decision gate";
const prior = JSON.parse(fs.readFileSync(path.join(root, "data", "vedapath-permission-execution-authorization-preflight.json"), "utf8"));

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

const source = {
  permission_execution_authorization_preflight_release: "v3.2.5",
  permission_execution_authorization_preflight_schema: "permission-execution-authorization-preflight-v1",
  permission_execution_authorization_preflight_id: prior.sample_preflight.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: prior.sample_preflight.controlled_permission_execution_hold_id,
  controlled_founder_permission_decision_gate_id: prior.sample_preflight.controlled_founder_permission_decision_gate_id,
  controlled_authorization_permission_review_gate_id: prior.sample_preflight.controlled_authorization_permission_review_gate_id,
  controlled_authorization_permission_preflight_id: prior.sample_preflight.controlled_authorization_permission_preflight_id,
  founder_authorization_instruction_gate_id: prior.sample_preflight.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: prior.sample_preflight.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: prior.sample_preflight.controlled_execution_packet_authorization_draft_id,
  source_answer_id: prior.sample_preflight.source_answer_id,
  source_record_id: prior.sample_preflight.source_record_id,
  source_family: prior.sample_preflight.source_family
};

const preflightPacket = {
  schema_version: "permission-execution-authorization-preflight-v1",
  release: "v3.2.5",
  preflight_status: "Preflight ready for authorization review",
  permission_execution_authorization_preflight_id: source.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: source.controlled_permission_execution_hold_id,
  controlled_founder_permission_decision_gate_id: source.controlled_founder_permission_decision_gate_id,
  controlled_authorization_permission_review_gate_id: source.controlled_authorization_permission_review_gate_id,
  controlled_authorization_permission_preflight_id: source.controlled_authorization_permission_preflight_id,
  founder_authorization_instruction_gate_id: source.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: source.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: source.controlled_execution_packet_authorization_draft_id,
  source_answer_id: source.source_answer_id,
  source_record_id: source.source_record_id,
  source_family: source.source_family,
  permission_execution_authorization_preflight_ready: true,
  permission_execution_authorization_preflight_recorded: true,
  controlled_permission_execution_authorization_review_candidate_ready: true,
  ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
  next_gate_required: "Controlled permission execution authorization review gate",
  preflight_scope: prior.sample_preflight.preflight_scope,
  preflight_language: prior.sample_preflight.preflight_language,
  preflight_rationale: prior.sample_preflight.preflight_rationale,
  evidence_checklist: prior.sample_preflight.evidence_checklist,
  non_execution_preflight_clause: prior.sample_preflight.non_execution_preflight_clause,
  risk_acknowledgment: prior.sample_preflight.risk_acknowledgment,
  rollback_condition: prior.sample_preflight.rollback_condition,
  monitoring_condition: prior.sample_preflight.monitoring_condition,
  stop_condition: prior.sample_preflight.stop_condition,
  expiry_check: prior.sample_preflight.expiry_check,
  production_boundary: prior.sample_preflight.production_boundary,
  created_at: "2026-06-28T00:00:00.000Z"
};

const config = {
  schema_version: "controlled-permission-execution-authorization-review-gate-v1",
  release,
  generated_at: "2026-06-28T00:00:00.000Z",
  title: releaseName,
  summary: "Reviews a permission execution authorization preflight for founder-decision readiness while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  source,
  review_states: [
    "Draft review",
    "Needs review clarification",
    "Review ready for founder authorization decision",
    "Return to authorization preflight",
    "Permission review blocked",
    "Authorization blocked",
    "Execution blocked",
    "Production forbidden",
    "Review paused",
    "Review expired"
  ],
  required_by_state: {
    "Draft review": [
      "permission_execution_authorization_preflight_id",
      "source_answer_id",
      "review_scope"
    ],
    "Needs review clarification": [
      "clarification_question",
      "review_language"
    ],
    "Review ready for founder authorization decision": [
      "review_actor",
      "reviewer_name",
      "controlled_permission_execution_authorization_review_gate_id",
      "permission_execution_authorization_preflight_id",
      "controlled_permission_execution_hold_id",
      "controlled_founder_permission_decision_gate_id",
      "controlled_authorization_permission_review_gate_id",
      "controlled_authorization_permission_preflight_id",
      "founder_authorization_instruction_gate_id",
      "controlled_authorization_review_gate_id",
      "controlled_execution_packet_authorization_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "review_scope",
      "review_language",
      "review_rationale",
      "review_evidence_summary",
      "non_execution_review_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to authorization preflight": ["return_reason"],
    "Permission review blocked": ["block_reason"],
    "Authorization blocked": ["block_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Review paused": ["hold_reason"],
    "Review expired": ["expiry_check", "hold_reason"]
  },
  review_checks: [
    {
      check: "Preflight ready",
      rule: "Starts only from a ready permission execution authorization preflight."
    },
    {
      check: "Review only",
      rule: "Can mark founder-decision readiness, but cannot approve authorization or execution."
    },
    {
      check: "Evidence locked",
      rule: "Requires preflight, hold, founder decision, permission review, instruction, authorization draft, and source ids."
    },
    {
      check: "No operation",
      rule: "Storage writes, canonical updates, migrations, accounts, secrets, public release, and production stay closed."
    },
    {
      check: "Founder decision next",
      rule: "Moves only to founder permission execution authorization decision, never to execution."
    },
    {
      check: "Expiry",
      rule: "Expires on preflight, hold, decision, review, instruction, source, rights, reviewer, rollback, monitoring, packet, or code change."
    }
  ],
  sample_preflight_packet: preflightPacket,
  sample_review: {
    review_state: "Review ready for founder authorization decision",
    review_actor: "Controlled authorization review gate reviewer",
    reviewer_name: "Reviewer sample",
    controlled_permission_execution_authorization_review_gate_id: "controlled-permission-execution-authorization-review-gate-sample-steady-action-bg-2-48",
    permission_execution_authorization_preflight_id: source.permission_execution_authorization_preflight_id,
    controlled_permission_execution_hold_id: source.controlled_permission_execution_hold_id,
    controlled_founder_permission_decision_gate_id: source.controlled_founder_permission_decision_gate_id,
    controlled_authorization_permission_review_gate_id: source.controlled_authorization_permission_review_gate_id,
    controlled_authorization_permission_preflight_id: source.controlled_authorization_permission_preflight_id,
    founder_authorization_instruction_gate_id: source.founder_authorization_instruction_gate_id,
    controlled_authorization_review_gate_id: source.controlled_authorization_review_gate_id,
    controlled_execution_packet_authorization_draft_id: source.controlled_execution_packet_authorization_draft_id,
    source_answer_id: source.source_answer_id,
    source_record_id: source.source_record_id,
    source_family: source.source_family,
    review_scope: "Review whether the authorization preflight language is clear enough to enter a founder permission execution authorization decision gate. This review is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
    review_language: "Review result: the preflight is ready for a founder permission execution authorization decision gate. This is decision readiness only; permission is not granted, authorization is not approved, execution is not allowed, and no system may run from it.",
    review_rationale: "The preflight has a locked hold, visible evidence, explicit stop conditions, rollback, monitoring, and production boundary. The next step is founder decision language, not a runnable authorization.",
    review_evidence_summary: "Preflight id, hold id, founder decision id, permission review id, prior preflight id, founder instruction id, authorization review id, authorization draft id, source answer id, source record id, source family, citation, rights, rollback, monitoring, stop condition, expiry, and production boundary are visible.",
    non_execution_review_clause: "Controlled permission execution authorization review gate only; permission_execution_authorization_preflight_ready may be true, permission_execution_authorization_preflight_recorded may be true, controlled_permission_execution_authorization_review_candidate_ready may be true, controlled_permission_execution_authorization_review_ready may be true, permission_execution_authorization_review_recorded may be true, and founder_permission_execution_authorization_decision_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    risk_acknowledgment: "Risk remains: preflight mismatch, hold mismatch, founder decision mismatch, permission review mismatch, instruction mismatch, review mismatch, draft mismatch, source mismatch, rights change, reviewer change, ambiguous review language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
    rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, reviewer handoff, founder decision audit, hold audit, preflight audit, and review audit must remain present before any founder authorization decision; no source state is written.",
    monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any founder authorization decision.",
    stop_condition: "Stop if preflight id mismatches, hold id mismatches, founder decision id mismatches, permission review id mismatches, instruction id mismatches, review id mismatches, draft id mismatches, source ids mismatch, rights change, reviewer evidence is missing, review language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
    expiry_check: "Controlled permission execution authorization review gate expires at the next material preflight, hold, founder decision, permission review, instruction, authorization review, authorization draft, source, rights, reviewer, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    next_gate: nextGate,
    clarification_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    permission_execution_authorization_preflight_ready: false,
    permission_execution_authorization_preflight_recorded: false,
    controlled_permission_execution_authorization_review_candidate_ready: false,
    controlled_permission_execution_authorization_review_ready: false,
    permission_execution_authorization_review_recorded: false,
    founder_permission_execution_authorization_decision_candidate_ready: false,
    ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
    next_gate_required: nextGate
  }
};

const css = fs.readFileSync(path.join(root, "assets", "vedapath-permission-execution-authorization-preflight.css"), "utf8")
  .replaceAll("permission execution authorization preflight", "controlled permission execution authorization review gate")
  .replaceAll("permission-preflight-page", "authorization-review-page")
  .replaceAll("permission-preflight", "authorization-review")
  .replaceAll("Permission Preflight", "Authorization Review");

const js = `(function () {
  const configUrl = "data/vedapath-controlled-permission-execution-authorization-review-gate.json";
  const falseAuthorityFlags = ${JSON.stringify(falseAuthorityFlags, null, 2)};
  const preflightReadyFlags = [
    "permission_execution_authorization_preflight_ready",
    "permission_execution_authorization_preflight_recorded",
    "controlled_permission_execution_authorization_review_candidate_ready"
  ];
  const blockedWords = /\\b(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production now|launch production allowed|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)\\b/i;

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

  function preflightPacketReady(packet) {
    return Boolean(
      packet &&
      packet.schema_version === "permission-execution-authorization-preflight-v1" &&
      packet.preflight_status === "Preflight ready for authorization review" &&
      packet.next_gate_required === "Controlled permission execution authorization review gate" &&
      allFlagsTrue(packet, preflightReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags)
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
      next_gate_required: "${nextGate}",
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
    keepsNonExecutionReviewBoundary,
    controlledPermissionExecutionAuthorizationReviewGate,
    reviewSnapshot
  };

  init().catch((error) => {
    console.error("Controlled permission execution authorization review gate failed", error);
  });
})();
`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Permission Execution Authorization Review Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-permission-execution-authorization-review-gate.css">
  </head>
  <body class="authorization-review-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Authorization review</span>
          </div>
        </a>
        <nav class="nav" aria-label="Project links">
          <a class="link" href="index.html">Home</a>
          <a class="link" href="build-status.html">Build</a>
          <a class="link" href="brand/brand-board.html">Brand</a>
          <a class="link" href="blueprint.html">Blueprint</a>
          <a class="link" href="citedanswerlab.html">Answers</a>
          <a class="link active" href="reviewqueuepersistence.html">Review</a>
          <a class="link" href="mantralenslab.html">Mantra</a>
          <a class="link" href="lifecompanionlab.html">Life</a>
          <a class="link" href="conversationcompanionlab.html">Talk</a>
          <a class="link" href="patterncompanionlab.html">Pattern</a>
          <a class="link" href="daily.html">Daily</a>
          <span class="version">${releaseBadge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="VedaPath Controlled Permission Execution Authorization Review Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Review is not approval</span>
          <h2>Review clearly. Authorize nothing.</h2>
          <p class="muted">This room reviews whether the preflight can move to a founder decision gate. It cannot grant permission, approve authorization, execute, store, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Preflight</strong><p>Load packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Evidence</strong><p>Check chain.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Review</strong><p>Keep boundary.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Founder</strong><p>Prepare only.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="permissionexecutionauthorizationpreflight.html">Open Authorization Preflight</a>
            <a class="button safe" href="controlledpermissionexecutionhold.html">Open Execution Hold</a>
          </div>
        </aside>

        <section class="panel authorization-review" id="controlledPermissionExecutionAuthorizationReviewGate">
          <div class="authorization-review-head">
            <div>
              <span class="eyebrow">Controlled permission execution authorization review gate</span>
              <h1>Ready for founder decision. Not authority.</h1>
              <p class="muted">A ready review here means the packet can move to founder permission execution authorization decision. It still cannot grant permission, approve authorization, run code, promote sources, store data, update canonical records, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="authorization-review-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath authorization review mark"></div>
          </div>

          <section class="authorization-review-layout">
            <div class="authorization-review-form">
              <h2>Authorization Review Gate</h2>
              <label>Authorization preflight packet<textarea id="authorizationReviewPreflightPacket"></textarea></label>
              <label>Review state<select id="authorizationReviewState"></select></label>
              <label>Review actor<input id="authorizationReviewActor" type="text" placeholder="Controlled authorization review gate reviewer"></label>
              <label>Reviewer name<input id="authorizationReviewReviewer" type="text" placeholder="Reviewer sample"></label>
              <label>Review gate id<input id="authorizationReviewId" type="text"></label>
              <label>Authorization preflight id<input id="authorizationReviewPreflightId" type="text"></label>
              <label>Execution hold id<input id="authorizationReviewHoldId" type="text"></label>
              <label>Founder decision gate id<input id="authorizationReviewFounderDecisionId" type="text"></label>
              <label>Permission review gate id<input id="authorizationReviewPermissionReviewId" type="text"></label>
              <label>Prior permission preflight id<input id="authorizationReviewPriorPreflightId" type="text"></label>
              <label>Founder instruction gate id<input id="authorizationReviewInstructionGateId" type="text"></label>
              <label>Prior authorization review gate id<input id="authorizationReviewPriorReviewGateId" type="text"></label>
              <label>Authorization draft id<input id="authorizationReviewDraftId" type="text"></label>
              <label>Source answer id<input id="authorizationReviewSourceAnswer" type="text"></label>
              <label>Source record id<input id="authorizationReviewSourceRecord" type="text"></label>
              <label>Source family<input id="authorizationReviewSourceFamily" type="text"></label>
              <label>Review scope<textarea id="authorizationReviewScopeText"></textarea></label>
              <label>Review language<textarea id="authorizationReviewLanguage"></textarea></label>
              <label>Review rationale<textarea id="authorizationReviewRationale"></textarea></label>
              <label>Review evidence summary<textarea id="authorizationReviewSummary"></textarea></label>
              <label>Non-execution review clause<textarea id="authorizationReviewBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="authorizationReviewRisk"></textarea></label>
              <label>Rollback condition<textarea id="authorizationReviewRollback"></textarea></label>
              <label>Monitoring condition<textarea id="authorizationReviewMonitoring"></textarea></label>
              <label>Stop condition<textarea id="authorizationReviewStopCondition"></textarea></label>
              <label>Expiry check<textarea id="authorizationReviewExpiry"></textarea></label>
              <label>Production boundary<textarea id="authorizationReviewProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="authorizationReviewClarification"></textarea></label>
              <label>Return reason<textarea id="authorizationReviewReturnReason"></textarea></label>
              <label>Hold reason<textarea id="authorizationReviewHoldReason"></textarea></label>
              <label>Block reason<textarea id="authorizationReviewBlockReason"></textarea></label>
              <div class="authorization-review-actions">
                <button class="button primary" id="runAuthorizationReview" type="button">Run Review</button>
                <button class="button safe" id="loadAuthorizationReviewSample" type="button">Load Sample</button>
                <button class="button" id="saveAuthorizationReview" type="button">Save Local</button>
                <button class="button" id="clearAuthorizationReviews" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="authorization-review-result" id="authorizationReviewResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Review Scope</h2>
                <div class="authorization-review-list" id="authorizationReviewScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Review Checks</h2>
            <div class="authorization-review-rules" id="authorizationReviewChecks"></div>
          </section>

          <section class="authorization-review-layout">
            <div>
              <div class="authorization-review-actions">
                <button class="button safe" id="copyAuthorizationReview" type="button">Copy Review Packet</button>
                <a class="button" href="data/vedapath-controlled-permission-execution-authorization-review-gate.json">Open JSON</a>
              </div>
              <textarea class="authorization-review-output" id="authorizationReviewOutput" aria-label="Controlled permission execution authorization review gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Reviews</h2>
              <div class="authorization-review-list" id="authorizationReviewSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Review is not authority</span>
          <h2 style="margin-top: 14px;">Founder Decision Ready, Execution False</h2>
          <p class="muted">The review can prepare founder decision language while every operational path stays locked.</p>
          <div class="progress" aria-label="Authorization review progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>10</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Founder</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Review Boundary</h2>
            <p class="authorization-review-boundary">Review signal only. Permission grant, authorization approval, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a founder decision gate. It does not authorize anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-permission-execution-authorization-review-gate.js"></script>
  </body>
</html>
`;

const docs = `# ${releaseName}

${releaseName} reviews the authorization preflight for founder-decision readiness.

It can mark:
- controlled authorization review readiness
- review record captured
- founder decision candidate readiness

It cannot mark:
- permission grant
- authorization approval
- execution approval
- storage writes
- canonical writes
- public release
- production launch

Next gate: ${nextGate}.
`;

function write(file, content) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), content);
}

function update(file, updater) {
  const full = path.join(root, file);
  const before = fs.readFileSync(full, "utf8");
  const after = updater(before);
  fs.writeFileSync(full, after);
}

function replaceAllHtmlBadges() {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".html")) {
      update(entry.name, (text) => text.replace(/<span class="version">v3\.2\.5 preflight<\/span>/g, `<span class="version">${releaseBadge}</span>`));
    }
  }
  const brandFile = path.join(root, "brand", "brand-board.html");
  if (fs.existsSync(brandFile)) {
    update(path.join("brand", "brand-board.html"), (text) => text.replace(/<span class="version">v3\.2\.5 preflight<\/span>/g, `<span class="version">${releaseBadge}</span>`));
  }
}

function updateIndex() {
  update("index.html", (text) => {
    let next = text.replace(
      "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review, founder permission decision, controlled execution hold, permission execution authorization preflight, authorization review next, and production still closed.",
      "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review, founder permission decision, controlled execution hold, permission execution authorization preflight, controlled authorization review gate, founder decision next, and production still closed."
    );
    if (!next.includes("controlledpermissionexecutionauthorizationreviewgate.html")) {
      next = next.replace(
        '<a href="permissionexecutionauthorizationpreflight.html">Authorization preflight <span>review</span></a>',
        '<a href="permissionexecutionauthorizationpreflight.html">Authorization preflight <span>review</span></a>\n              <a href="controlledpermissionexecutionauthorizationreviewgate.html">Authorization review <span>gate</span></a>'
      );
      next = next.replace(
        '<a href="permissionexecutionauthorizationpreflight.html">Authorization preflight <span>closed</span></a>',
        '<a href="permissionexecutionauthorizationpreflight.html">Authorization preflight <span>closed</span></a>\n              <a href="controlledpermissionexecutionauthorizationreviewgate.html">Authorization review <span>closed</span></a>'
      );
    }
    return next;
  });
}

function updatePreflightPage() {
  update("permissionexecutionauthorizationpreflight.html", (text) => {
    if (text.includes("controlledpermissionexecutionauthorizationreviewgate.html")) return text;
    return text.replace(
      '<a class="button safe" href="founderpermissiondecisiongate.html">Open Founder Decision</a>',
      '<a class="button safe" href="founderpermissiondecisiongate.html">Open Founder Decision</a>\n            <a class="button" href="controlledpermissionexecutionauthorizationreviewgate.html">Open Authorization Review</a>'
    );
  });
}

function updateBuildStatus() {
  update("build-status.html", (text) => {
    let next = text
      .replace("<strong>v3.2.5</strong>", `<strong>${release}</strong>`)
      .replace(
        "Permission Execution Authorization Preflight: the held decision is now checked for authorization-review readiness while permission grant, authorization approval, execution, storage, public release, and production remain false.",
        "Controlled Permission Execution Authorization Review Gate: preflight language is reviewed for founder-decision readiness while permission grant, authorization approval, execution, storage, public release, and production remain false."
      )
      .replace(
        "The trust loop now separates authorization-review readiness from actual authorization while every real write path remains closed.",
        "The trust loop now separates authorization review readiness from any founder decision or runnable authorization while every real write path remains closed."
      )
      .replace(
        "<strong>Controlled permission execution authorization review gate</strong>\n          <p>Review preflight language while permission grant and execution stay false.</p>",
        `<strong>${nextGate}</strong>\n          <p>Record founder decision language while permission grant and execution stay false.</p>`
      )
      .replace(
        '<div class="version-row"><span>Release</span><strong>v3.2.5 Permission Execution Authorization Preflight</strong></div>',
        `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>`
      )
      .replace(
        '<div class="version-row"><span>Previous</span><strong>v3.2.4 Controlled Permission Execution Hold</strong></div>',
        `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`
      )
      .replace(
        '<div class="version-row"><span>Goal</span><strong>Test the execution hold for authorization-review readiness without granting permission, authorization, or execution.</strong></div>',
        '<div class="version-row"><span>Goal</span><strong>Review preflight language without granting permission, approving authorization, or enabling execution.</strong></div>'
      )
      .replace(
        '<div class="version-row"><span>Status</span><strong>Ready for controlled permission execution authorization review gate</strong></div>',
        '<div class="version-row"><span>Status</span><strong>Ready for founder permission execution authorization decision gate</strong></div>'
      )
      .replace(
        '<li><span class="dot"></span><span>Build controlled permission execution authorization review gate.</span></li>\n              <li><span class="dot"></span><span>Review preflight language before any authorization decision.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate review readiness from any runnable operation.</span></li>',
        '<li><span class="dot"></span><span>Build founder permission execution authorization decision gate.</span></li>\n              <li><span class="dot"></span><span>Record founder decision language before any authorization draft.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate founder decision readiness from any runnable operation.</span></li>'
      );
    if (!next.includes("Phase 290: Controlled Permission Execution Authorization Review Gate")) {
      next = next.replace(
        `<article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 290: Production Implementation and Licensed Audio</strong>`,
        `<article class="phase">\n              <span class="badge done">Done</span>\n              <div>\n                <strong>Phase 290: Controlled Permission Execution Authorization Review Gate</strong>\n                <p>Reviews preflight language for founder-decision readiness while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.</p>\n              </div>\n              <span class="percent">100%</span>\n            </article>\n            <article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 291: Production Implementation and Licensed Audio</strong>`
      );
    }
    return next;
  });
}

function updateDocs() {
  update("README.md", (text) => {
    if (text.includes(`## ${release} ${releaseName}`)) return text;
    return text.replace(
      "## v3.2.5 Permission Execution Authorization Preflight",
      `## ${release} ${releaseName}\n\n${releaseName} reviews preflight language for founder-decision readiness while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.\n\n- [Controlled Permission Execution Authorization Review Gate](controlledpermissionexecutionauthorizationreviewgate.html)\n- [Controlled Permission Execution Authorization Review Gate Notes](docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_REVIEW_GATE.md)\n- [Controlled Permission Execution Authorization Review Gate Data](data/vedapath-controlled-permission-execution-authorization-review-gate.json)\n\n## v3.2.5 Permission Execution Authorization Preflight`
    );
  });
  update(path.join("docs", "PROTOTYPE_NOTES.md"), (text) => {
    if (text.includes(`## ${release} ${releaseName}`)) return text;
    return text.replace(
      "## v3.2.5 Permission Execution Authorization Preflight",
      `## ${release} ${releaseName}\n\n- Adds controlledpermissionexecutionauthorizationreviewgate.html as the review gate after authorization preflight.\n- Adds a review-gate data contract and API that keep permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.\n- Updates Home, Build, and the authorization preflight room so the next route stays visible without expanding primary navigation.\n\n## v3.2.5 Permission Execution Authorization Preflight`
    );
  });
  update(path.join("docs", "PRODUCT_BLUEPRINT.md"), (text) => {
    if (text.includes("### 309. Controlled Permission Execution Authorization Review Gate")) return text;
    return text.replace(
      "### 308. Permission Execution Authorization Preflight",
      `### 309. Controlled Permission Execution Authorization Review Gate\n\nControlled Permission Execution Authorization Review Gate reviews the authorization preflight for founder-decision readiness.\n\nIt may mark review readiness and founder-decision-candidate readiness. It must not grant permission, approve authorization, authorize execution, write storage, update canonical records, publish, or launch.\n\nThis review gate keeps the product honest: review means better evidence, not operational authority.\n\n### 308. Permission Execution Authorization Preflight`
    );
  });
}

write("data/vedapath-controlled-permission-execution-authorization-review-gate.json", JSON.stringify(config, null, 2) + "\n");
write("assets/vedapath-controlled-permission-execution-authorization-review-gate.css", css);
write("assets/vedapath-controlled-permission-execution-authorization-review-gate.js", js);
write("controlledpermissionexecutionauthorizationreviewgate.html", html);
write("docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_REVIEW_GATE.md", docs);

replaceAllHtmlBadges();
updateIndex();
updatePreflightPage();
updateBuildStatus();
updateDocs();

console.log(`${release} controlled permission execution authorization review gate applied.`);

import fs from "node:fs";
import path from "node:path";

const release = "v3.3.5";
const releaseName = "Controlled Permission Execution Authorization Review Decision Gate";
const releaseBadge = "v3.3.5 review decision";
const previousRelease = "v3.3.4 Command Shell Calm Contrast Refinement";
const previousBadge = "v3.3.4 calm contrast";
const pageFile = "controlledpermissionexecutionauthorizationreviewdecisiongate.html";
const dataFile = "data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json";
const cssFile = "assets/vedapath-controlled-permission-execution-authorization-review-decision-gate.css";
const jsFile = "assets/vedapath-controlled-permission-execution-authorization-review-decision-gate.js";
const docFile = "docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_REVIEW_DECISION_GATE.md";
const nextGate = "Controlled permission execution authorization draft gate";

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

const falseAuthority = Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));

const sampleAuthorizationReview = {
  schema_version: "controlled-permission-execution-authorization-review-gate-v1",
  release: "v3.2.6",
  review_status: "Review ready for founder authorization decision",
  controlled_permission_execution_authorization_review_gate_id: "controlled-permission-execution-authorization-review-gate-sample-steady-action-bg-2-48",
  permission_execution_authorization_preflight_id: "permission-execution-authorization-preflight-sample-steady-action-bg-2-48",
  controlled_permission_execution_hold_id: "controlled-permission-execution-hold-sample-steady-action-bg-2-48",
  controlled_founder_permission_decision_gate_id: "controlled-founder-permission-decision-gate-sample-steady-action-bg-2-48",
  controlled_authorization_permission_review_gate_id: "controlled-authorization-permission-review-gate-sample-steady-action-bg-2-48",
  controlled_authorization_permission_preflight_id: "controlled-authorization-permission-preflight-sample-steady-action-bg-2-48",
  founder_authorization_instruction_gate_id: "founder-authorization-instruction-gate-sample-steady-action-bg-2-48",
  controlled_authorization_review_gate_id: "controlled-authorization-review-gate-sample-steady-action-bg-2-48",
  controlled_execution_packet_authorization_draft_id: "controlled-execution-packet-authorization-draft-sample-steady-action-bg-2-48",
  source_answer_id: "answer-steady-action-bg-2-48",
  source_record_id: "bg-2-48-steadiness",
  source_family: "Bhagavad Gita | Smriti",
  controlled_permission_execution_authorization_review_ready: true,
  permission_execution_authorization_review_recorded: true,
  founder_permission_execution_authorization_decision_candidate_ready: true,
  ...falseAuthority,
  review_scope: "Review whether the authorization preflight language is clear enough to enter a founder permission execution authorization decision gate. This review is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  review_language: "Review result: the preflight is ready for a founder permission execution authorization decision gate. This is decision readiness only; permission is not granted, authorization is not approved, execution is not allowed, and no system may run from it.",
  review_evidence_summary: "Preflight id, hold id, founder decision id, permission review id, prior preflight id, founder instruction id, authorization review id, authorization draft id, source answer id, source record id, source family, citation, rights, rollback, monitoring, stop condition, expiry, and production boundary are visible.",
  next_gate_required: "Founder permission execution authorization decision gate",
  created_at: "2026-06-28T00:00:00.000Z"
};

const config = {
  schema_version: "controlled-permission-execution-authorization-review-decision-gate-v1",
  release,
  generated_at: "2026-06-28T00:00:00.000Z",
  title: releaseName,
  summary: "Routes a ready authorization review packet to founder decision, hold, return, or block while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  source_release: "v3.2.6 Controlled Permission Execution Authorization Review Gate",
  next_gate: nextGate,
  sample_authorization_review_packet: sampleAuthorizationReview,
  decision_states: [
    "Draft decision",
    "Ready for founder decision",
    "Hold for evidence",
    "Return to authorization review",
    "Block packet",
    "Decision expired"
  ],
  decision_modes: [
    {
      mode: "Ready",
      state: "Ready for founder decision",
      label: "Route Forward",
      summary: "Packet can move to founder decision only. Nothing may run."
    },
    {
      mode: "Hold",
      state: "Hold for evidence",
      label: "Hold",
      summary: "Pause until the evidence chain is clearer."
    },
    {
      mode: "Return",
      state: "Return to authorization review",
      label: "Return",
      summary: "Send the packet back to the authorization review room."
    },
    {
      mode: "Block",
      state: "Block packet",
      label: "Block",
      summary: "Close this review route before founder decision."
    }
  ],
  required_by_state: {
    "Draft decision": [
      "authorization_review_gate_id",
      "source_answer_id",
      "decision_scope"
    ],
    "Ready for founder decision": [
      "decision_actor",
      "reviewer_name",
      "review_decision_gate_id",
      "authorization_review_gate_id",
      "permission_execution_authorization_preflight_id",
      "controlled_permission_execution_hold_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "decision_scope",
      "decision_language",
      "decision_rationale",
      "decision_evidence_summary",
      "non_execution_decision_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Hold for evidence": [
      "hold_reason",
      "non_execution_decision_clause"
    ],
    "Return to authorization review": [
      "return_reason",
      "non_execution_decision_clause"
    ],
    "Block packet": [
      "block_reason",
      "non_execution_decision_clause"
    ],
    "Decision expired": [
      "expiry_check",
      "hold_reason"
    ]
  },
  decision_checks: [
    {
      check: "Review packet ready",
      rule: "Starts only from a ready controlled permission execution authorization review packet."
    },
    {
      check: "Decision route only",
      rule: "Reviewer can route forward, hold, return, or block without granting permission."
    },
    {
      check: "No operation",
      rule: "Execution, storage writes, canonical updates, migrations, accounts, secrets, public release, and production stay closed."
    },
    {
      check: "Founder next only",
      rule: "Forward movement can only prepare the founder decision gate, never a runnable authorization."
    },
    {
      check: "Readable reasons",
      rule: "Hold, return, block, and expiry must expose clear reasons before local save or copy."
    },
    {
      check: "Expiry",
      rule: "Expires on review, source, rights, founder, rollback, monitoring, packet, or code change."
    }
  ],
  sample_decision: {
    decision_state: "Ready for founder decision",
    decision_actor: "Controlled review decision gate",
    reviewer_name: "Reviewer sample",
    review_decision_gate_id: "controlled-permission-execution-authorization-review-decision-gate-sample-bg-2-48",
    authorization_review_gate_id: sampleAuthorizationReview.controlled_permission_execution_authorization_review_gate_id,
    permission_execution_authorization_preflight_id: sampleAuthorizationReview.permission_execution_authorization_preflight_id,
    controlled_permission_execution_hold_id: sampleAuthorizationReview.controlled_permission_execution_hold_id,
    source_answer_id: sampleAuthorizationReview.source_answer_id,
    source_record_id: sampleAuthorizationReview.source_record_id,
    source_family: sampleAuthorizationReview.source_family,
    decision_scope: "Decide whether a ready authorization review packet may move to founder permission execution authorization decision. This decision is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
    decision_language: "Review decision result: route to founder decision gate. This is routing readiness only; permission is not granted, authorization is not approved, execution is not allowed, and no system may run from it.",
    decision_rationale: "The review packet is ready, evidence ids are visible, and boundary language is explicit. The next step is founder decision only.",
    decision_evidence_summary: "Authorization review id, preflight id, execution hold id, source answer id, source record id, source family, review language, rollback, monitoring, stop condition, expiry, and production boundary are visible.",
    non_execution_decision_clause: "Controlled permission execution authorization review decision gate only; review_decision_ready may be true, review_decision_recorded may be true, and founder_permission_execution_authorization_decision_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    risk_acknowledgment: "Risk remains: authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, founder change, ambiguous decision language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
    rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, reviewer handoff, review decision audit, and review audit must remain present before founder decision; no source state is written.",
    monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before founder decision.",
    stop_condition: "Stop if authorization review id mismatches, preflight id mismatches, hold id mismatches, source ids mismatch, rights change, reviewer evidence is missing, decision language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
    expiry_check: "Review decision gate expires at the next material authorization review, preflight, hold, source, rights, founder, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    return_reason: "Return if the authorization review language is ambiguous.",
    hold_reason: "Hold until the reviewer can see the exact source and rollback chain.",
    block_reason: "Block if any authority flag becomes true.",
    next_gate: "Founder permission execution authorization decision gate"
  },
  boundary: {
    review_decision_ready: false,
    review_decision_recorded: false,
    founder_permission_execution_authorization_decision_candidate_ready: false,
    ...falseAuthority,
    next_gate_required: "Founder permission execution authorization decision gate"
  }
};

const css = `/* VedaPath controlled permission execution authorization review decision gate */
body.review-decision-page main.workspace {
  grid-template-columns: minmax(220px, 0.72fr) minmax(0, 1.9fr) minmax(230px, 0.74fr);
  gap: 16px;
}

body.review-decision-page main.workspace > aside.panel:first-child,
body.review-decision-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.review-decision,
.review-decision-head,
.review-decision-grid,
.review-decision-form,
.review-decision-actions,
.review-decision-list,
.review-decision-rules,
.review-decision-result {
  display: grid;
  gap: 12px;
}

.review-decision {
  gap: 18px;
}

.review-decision-head {
  grid-template-columns: minmax(0, 1fr) 118px;
  align-items: center;
}

.review-decision-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.review-decision-mark img {
  display: block;
  width: 100%;
}

.review-decision-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.review-decision-choice-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.review-decision-choice,
.review-decision-card,
.review-decision-result,
.review-decision-rule,
.review-decision-form,
.review-decision-output {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.review-decision-choice,
.review-decision-card,
.review-decision-result,
.review-decision-rule,
.review-decision-form {
  padding: 12px;
}

.review-decision-choice {
  min-height: 112px;
  text-align: left;
  cursor: pointer;
}

.review-decision-choice[aria-pressed="true"],
.review-decision-result[data-outcome="Ready"] {
  border-color: #0f5b4b;
  background: #edf8f3;
}

.review-decision-result[data-outcome="Hold"] {
  border-color: #e0a83b;
  background: #fff7e7;
}

.review-decision-result[data-outcome="Return"] {
  border-color: #d65a1f;
  background: #fff1e9;
}

.review-decision-result[data-outcome="Block"],
.review-decision-result[data-state^="Blocked"] {
  border-color: #a83e12;
  background: #fff1ea;
}

.review-decision-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.review-decision-form input,
.review-decision-form select,
.review-decision-form textarea,
.review-decision-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.review-decision-form textarea,
.review-decision-output {
  min-height: 90px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.review-decision-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.review-decision-list,
.review-decision-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.review-decision-card span,
.review-decision-rule span,
.review-decision-choice span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.review-decision-card strong,
.review-decision-rule strong,
.review-decision-choice strong {
  display: block;
  margin-top: 4px;
}

.review-decision-boundary {
  border-left: 4px solid var(--bhagwa);
  padding-left: 12px;
}

@media (max-width: 1080px) {
  body.review-decision-page main.workspace,
  .review-decision-grid,
  .review-decision-list,
  .review-decision-rules {
    grid-template-columns: 1fr;
  }

  .review-decision-head {
    grid-template-columns: 1fr;
  }

  .review-decision-mark {
    max-width: 150px;
  }
}

@media (max-width: 760px) {
  .review-decision-choice-grid,
  .review-decision-actions {
    grid-template-columns: 1fr;
  }
}
`;

const js = `(function () {
  const configUrl = "${dataFile}";
  const falseAuthorityFlags = ${JSON.stringify(falseAuthorityFlags, null, 2)};
  const reviewReadyFlags = [
    "controlled_permission_execution_authorization_review_ready",
    "permission_execution_authorization_review_recorded",
    "founder_permission_execution_authorization_decision_candidate_ready"
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
`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath ${releaseName}</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="${cssFile}">
    <link rel="stylesheet" href="assets/vedapath-command-shell.css">
  </head>
  <body class="review-decision-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Review decision gate</span>
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

      <main class="workspace" aria-label="VedaPath ${releaseName} workspace">
        <aside class="panel">
          <span class="eyebrow">Route, hold, return, or block</span>
          <h2>Review decision before founder decision.</h2>
          <p class="muted">This gate turns a ready authorization review into one safe route. It cannot grant permission, approve authorization, execute, store, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Review</strong><p>Load ready packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Decide</strong><p>Choose one route.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Authority stays false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Next</strong><p>Founder only if ready.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="founderpermissionexecutionauthorizationdecisiongate.html">Open Founder Decision</a>
            <a class="button" href="controlledpermissionexecutionauthorizationreviewgate.html">Open Authorization Review</a>
            <a class="button safe" href="permissionexecutionauthorizationpreflight.html">Open Preflight</a>
          </div>
        </aside>

        <section class="panel review-decision" id="controlledPermissionExecutionAuthorizationReviewDecisionGate">
          <div class="review-decision-head">
            <div>
              <span class="eyebrow">Controlled review decision gate</span>
              <h1>Route the review. Authorize nothing.</h1>
              <p class="muted">A ready route can move to founder decision only. Hold, return, and block remain first-class outcomes. Permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.</p>
            </div>
            <div class="review-decision-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath review decision mark"></div>
          </div>

          <section class="review-decision-choice-grid" aria-label="Review decision choices">
            <button class="review-decision-choice" type="button" data-decision-state="Ready for founder decision" aria-pressed="true"><span>Route</span><strong>Founder</strong><p>Move to founder decision only.</p></button>
            <button class="review-decision-choice" type="button" data-decision-state="Hold for evidence" aria-pressed="false"><span>Route</span><strong>Hold</strong><p>Wait for clearer evidence.</p></button>
            <button class="review-decision-choice" type="button" data-decision-state="Return to authorization review" aria-pressed="false"><span>Route</span><strong>Return</strong><p>Send back for review edits.</p></button>
            <button class="review-decision-choice" type="button" data-decision-state="Block packet" aria-pressed="false"><span>Route</span><strong>Block</strong><p>Close this packet route.</p></button>
          </section>

          <section class="review-decision-grid">
            <div class="review-decision-form">
              <h2>Review Decision Packet</h2>
              <label>Authorization review packet<textarea id="reviewDecisionPacket"></textarea></label>
              <label>Decision state<select id="reviewDecisionState"></select></label>
              <label>Decision actor<input id="reviewDecisionActor" type="text" placeholder="Controlled review decision gate"></label>
              <label>Reviewer name<input id="reviewDecisionReviewer" type="text" placeholder="Reviewer sample"></label>
              <label>Review decision gate id<input id="reviewDecisionId" type="text"></label>
              <label>Authorization review gate id<input id="reviewDecisionReviewId" type="text"></label>
              <label>Authorization preflight id<input id="reviewDecisionPreflightId" type="text"></label>
              <label>Execution hold id<input id="reviewDecisionHoldId" type="text"></label>
              <label>Source answer id<input id="reviewDecisionSourceAnswer" type="text"></label>
              <label>Source record id<input id="reviewDecisionSourceRecord" type="text"></label>
              <label>Source family<input id="reviewDecisionSourceFamily" type="text"></label>
              <label>Decision scope<textarea id="reviewDecisionScopeText"></textarea></label>
              <label>Decision language<textarea id="reviewDecisionLanguage"></textarea></label>
              <label>Decision rationale<textarea id="reviewDecisionRationale"></textarea></label>
              <label>Decision evidence summary<textarea id="reviewDecisionSummary"></textarea></label>
              <label>Non-execution decision clause<textarea id="reviewDecisionBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="reviewDecisionRisk"></textarea></label>
              <label>Rollback condition<textarea id="reviewDecisionRollback"></textarea></label>
              <label>Monitoring condition<textarea id="reviewDecisionMonitoring"></textarea></label>
              <label>Stop condition<textarea id="reviewDecisionStopCondition"></textarea></label>
              <label>Expiry check<textarea id="reviewDecisionExpiry"></textarea></label>
              <label>Production boundary<textarea id="reviewDecisionProductionBoundary"></textarea></label>
              <label>Return reason<textarea id="reviewDecisionReturnReason"></textarea></label>
              <label>Hold reason<textarea id="reviewDecisionHoldReason"></textarea></label>
              <label>Block reason<textarea id="reviewDecisionBlockReason"></textarea></label>
              <div class="review-decision-actions">
                <button class="button primary" id="runReviewDecision" type="button">Run Decision</button>
                <button class="button safe" id="loadReviewDecisionSample" type="button">Load Sample</button>
                <button class="button" id="saveReviewDecision" type="button">Save Local</button>
                <button class="button" id="clearReviewDecisions" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="review-decision-result" id="reviewDecisionResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Decision Scope</h2>
                <div class="review-decision-list" id="reviewDecisionScope"></div>
              </section>
              <section style="margin-top: 10px;">
                <h2>Decision Checks</h2>
                <div class="review-decision-rules" id="reviewDecisionChecks"></div>
              </section>
            </div>
          </section>

          <section class="review-decision-grid">
            <div>
              <div class="review-decision-actions">
                <button class="button safe" id="copyReviewDecision" type="button">Copy Decision Packet</button>
                <a class="button" href="${dataFile}">Open JSON</a>
              </div>
              <textarea class="review-decision-output" id="reviewDecisionOutput" aria-label="Controlled permission execution authorization review decision gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Review Decisions</h2>
              <div class="review-decision-list" id="reviewDecisionSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Decision is not authority</span>
          <h2 style="margin-top: 14px;">Founder Route Only</h2>
          <p class="muted">A positive decision prepares a founder decision gate. It still does not grant permission or approve execution.</p>
          <div class="progress" aria-label="Review decision gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Routes</span><strong>4</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Founder</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Review Decision Boundary</h2>
            <p class="review-decision-boundary">Review decision signal only. Permission grant, authorization approval, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares founder decision routing. It does not authorize or execute anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="${jsFile}"></script>
    <script src="assets/vedapath-command-shell.js" defer></script>
  </body>
</html>
`;

const doc = `# ${releaseName}

${releaseName} adds a controlled review-decision bridge after authorization review readiness.

It can route a packet to:

- founder decision
- hold for more evidence
- return to authorization review
- block the packet path

It must not grant permission, approve authorization, execute, store, update canonical records, publish, or launch production.

Next gate: ${nextGate}.
`;

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function update(file, fn) {
  fs.writeFileSync(file, fn(read(file)));
}

function walk(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, list);
    else list.push(full);
  }
  return list;
}

function insertBefore(text, marker, block) {
  if (text.includes(block.split("\n")[0])) return text;
  if (!text.includes(marker)) {
    throw new Error(`Missing insertion marker: ${marker}`);
  }
  return text.replace(marker, `${block}\n\n${marker}`);
}

function replaceFirstOrThrow(text, pattern, replacement, label) {
  const next = text.replace(pattern, replacement);
  if (next === text) {
    throw new Error(`No replacement made for ${label}`);
  }
  return next;
}

function updateBadges() {
  for (const file of walk(".")) {
    if (!file.endsWith(".html")) continue;
    update(file, (text) => text.replaceAll(previousBadge, releaseBadge));
  }
  update("assets/vedapath-command-shell.js", (text) => text.replace(`const releaseBadge = "${previousBadge}";`, `const releaseBadge = "${releaseBadge}";`));
}

function updateLinks() {
  update("index.html", (text) => {
    let next = text;
    if (!next.includes(pageFile)) {
      next = next.replace(
        '<a href="controlledpermissionexecutionauthorizationreviewgate.html">Authorization review <span>gate</span></a>',
        '<a href="controlledpermissionexecutionauthorizationreviewgate.html">Authorization review <span>gate</span></a>\n              <a href="controlledpermissionexecutionauthorizationreviewdecisiongate.html">Review decision <span>route</span></a>'
      );
      next = next.replace(
        '<a href="controlledpermissionexecutionauthorizationreviewgate.html">Authorization review <span>closed</span></a>',
        '<a href="controlledpermissionexecutionauthorizationreviewgate.html">Authorization review <span>closed</span></a>\n              <a href="controlledpermissionexecutionauthorizationreviewdecisiongate.html">Review decision <span>closed</span></a>'
      );
    }
    return next;
  });

  update("controlledpermissionexecutionauthorizationreviewgate.html", (text) => {
    if (text.includes(pageFile)) return text;
    return text.replace(
      '<a class="button primary" href="founderpermissionexecutionauthorizationdecisiongate.html">Open Founder Decision</a>\n            <a class="button" href="permissionexecutionauthorizationpreflight.html">Open Authorization Preflight</a>',
      '<a class="button primary" href="controlledpermissionexecutionauthorizationreviewdecisiongate.html">Open Review Decision</a>\n            <a class="button" href="founderpermissionexecutionauthorizationdecisiongate.html">Open Founder Decision</a>\n            <a class="button" href="permissionexecutionauthorizationpreflight.html">Open Authorization Preflight</a>'
    );
  });

  update("founderpermissionexecutionauthorizationdecisiongate.html", (text) => {
    if (text.includes(pageFile)) return text;
    return text.replace(
      '<a class="button" href="controlledpermissionexecutionauthorizationreviewgate.html">Open Authorization Review</a>\n            <a class="button safe" href="permissionexecutionauthorizationpreflight.html">Open Preflight</a>',
      '<a class="button" href="controlledpermissionexecutionauthorizationreviewdecisiongate.html">Open Review Decision</a>\n            <a class="button" href="controlledpermissionexecutionauthorizationreviewgate.html">Open Authorization Review</a>\n            <a class="button safe" href="permissionexecutionauthorizationpreflight.html">Open Preflight</a>'
    );
  });
}

function updateBuildStatus() {
  update("build-status.html", (text) => {
    let next = text;
    next = replaceFirstOrThrow(
      next,
      /(<span>Current version<\/span>\s*<strong>)[^<]+(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/,
      `$1${release}$2${releaseName}: VedaPath now routes a ready authorization review packet to founder decision, hold, return, or block while every permission, authorization, execution, storage, public release, and production flag stays false.$3`,
      "current version tile"
    );
    next = replaceFirstOrThrow(
      next,
      /(<span>Full vision progress<\/span>\s*<strong>)[^<]+(<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:)[^"]+("[^>]*><\/div><\/div>\s*<p>)[\s\S]*?(<\/p>)/,
      "$199%$299%$3The trust loop now has a calm review-decision bridge between authorization review and founder decision without opening real authority or execution.$4",
      "full vision tile"
    );
    next = replaceFirstOrThrow(
      next,
      /(<span>Next release<\/span>\s*<strong>)[\s\S]*?(<\/strong>\s*<p>)[\s\S]*?(<\/p>)/,
      `$1${nextGate}$2Draft the controlled packet from a founder decision while permission and execution remain false.$3`,
      "next release tile"
    );
    if (!next.includes(`Phase 299: ${releaseName}`)) {
      next = replaceFirstOrThrow(
        next,
        /<article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 299: Production Implementation and Licensed Audio<\/strong>\s*<p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
        `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 299: ${releaseName}</strong>
                <p>Routes ready authorization review packets to founder decision, hold, return, or block while all authority and production flags remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 300: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
        "roadmap phase 299"
      );
    }
    next = replaceFirstOrThrow(
      next,
      /<div class="version-row"><span>Release<\/span><strong>v3\.3\.4 Command Shell Calm Contrast Refinement<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v3\.3\.3 Command Shell Visual System Balance<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>Make the command shell feel calmer, more coherent, and less visually heavy\.<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>Ready to return to founder review decision gate<\/strong><\/div>/,
      `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>
            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>
            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
            <div class="version-row"><span>Goal</span><strong>Add a review decision bridge without granting authority or execution.</strong></div>
            <div class="version-row"><span>Status</span><strong>Ready for controlled permission execution authorization draft gate</strong></div>`,
      "version notes"
    );
    next = replaceFirstOrThrow(
      next,
      /<li><span class="dot"><\/span><span>Build the founder permission execution authorization review decision gate\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep the calmer type scale while adding the next trust gate\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Preserve the simple command-center flow on every page\.<\/span><\/li>/,
      '<li><span class="dot"></span><span>Build the controlled permission execution authorization draft gate.</span></li>\n              <li><span class="dot"></span><span>Draft packet language from a founder decision without granting authority.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Preserve the simple command-center flow on every page.</span></li>',
      "next checklist"
    );
    return next;
  });
}

function updateDocs() {
  const readmeBlock = `## ${release} ${releaseName}

${releaseName} routes a ready authorization review packet to founder decision, hold, return, or block while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.

- [${releaseName}](${pageFile})
- [${releaseName} Notes](${docFile})
- [${releaseName} Data](${dataFile})`;

  const notesBlock = `## ${release} ${releaseName}

- Adds ${pageFile} as the review-decision bridge after controlled authorization review readiness.
- Adds a data contract and page logic for ready, hold, return, and block routes.
- Keeps permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.
- Links the authorization review room and founder decision room through the new route.`;

  const blueprintBlock = `### 318. ${releaseName}

${releaseName} adds a review-decision bridge between controlled authorization review and founder decision.

It may route a packet forward, hold for evidence, return to authorization review, or block the packet path. It must not grant permission, approve authorization, execute, store, update canonical records, publish, or launch production.

This creates a calmer trust lane: reviewer route first, founder posture next, execution never implied.`;

  update("README.md", (text) => insertBefore(text, "## v3.3.4 Command Shell Calm Contrast Refinement", readmeBlock));
  update("docs/PROTOTYPE_NOTES.md", (text) => insertBefore(text, "## v3.3.4 Command Shell Calm Contrast Refinement", notesBlock));
  update("docs/PRODUCT_BLUEPRINT.md", (text) => insertBefore(text, "### 317. Command Shell Calm Contrast Refinement", blueprintBlock));
}

write(dataFile, `${JSON.stringify(config, null, 2)}\n`);
write(cssFile, css);
write(jsFile, js);
write(pageFile, html);
write(docFile, doc);
updateBadges();
updateLinks();
updateBuildStatus();
updateDocs();

console.log(`${release} ${releaseName} applied.`);

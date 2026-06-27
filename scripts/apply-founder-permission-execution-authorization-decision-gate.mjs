import fs from "node:fs";
import path from "node:path";

const release = "v3.2.7";
const releaseName = "Founder Permission Execution Authorization Decision Gate";
const releaseBadge = "v3.2.7 founder decision";
const previousRelease = "v3.2.6 Controlled Permission Execution Authorization Review Gate";
const pageFile = "founderpermissionexecutionauthorizationdecisiongate.html";
const dataFile = "data/vedapath-founder-permission-execution-authorization-decision-gate.json";
const cssFile = "assets/vedapath-founder-permission-execution-authorization-decision-gate.css";
const jsFile = "assets/vedapath-founder-permission-execution-authorization-decision-gate.js";
const docFile = "docs/FOUNDER_PERMISSION_EXECUTION_AUTHORIZATION_DECISION_GATE.md";
const scriptFile = "scripts/apply-founder-permission-execution-authorization-decision-gate.mjs";
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

const sampleReviewPacket = {
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
  schema_version: "founder-permission-execution-authorization-decision-gate-v1",
  release,
  generated_at: "2026-06-28T00:00:00.000Z",
  title: releaseName,
  summary: "Records founder posture after authorization review readiness while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  next_gate: nextGate,
  source: {
    authorization_review_release: "v3.2.6",
    authorization_review_schema: "controlled-permission-execution-authorization-review-gate-v1",
    authorization_review_gate_id: sampleReviewPacket.controlled_permission_execution_authorization_review_gate_id,
    source_answer_id: sampleReviewPacket.source_answer_id,
    source_record_id: sampleReviewPacket.source_record_id,
    source_family: sampleReviewPacket.source_family
  },
  decision_states: [
    "Draft decision",
    "Needs founder clarification",
    "Draft-only founder decision recorded",
    "Founder hold recorded",
    "Founder reject recorded",
    "Return to authorization review",
    "Permission grant blocked",
    "Authorization approval blocked",
    "Execution blocked",
    "Production forbidden",
    "Decision expired"
  ],
  decision_modes: [
    {
      mode: "Draft-only",
      state: "Draft-only founder decision recorded",
      label: "Draft Only",
      summary: "Founder permits only a later draft packet. Nothing may run."
    },
    {
      mode: "Hold",
      state: "Founder hold recorded",
      label: "Hold",
      summary: "Founder keeps the packet paused for more evidence."
    },
    {
      mode: "Reject",
      state: "Founder reject recorded",
      label: "Reject",
      summary: "Founder closes this packet path without execution."
    }
  ],
  required_by_state: {
    "Draft decision": [
      "authorization_review_gate_id",
      "source_answer_id",
      "decision_scope"
    ],
    "Needs founder clarification": [
      "clarification_question",
      "founder_decision_language"
    ],
    "Draft-only founder decision recorded": [
      "decision_actor",
      "founder_name",
      "founder_permission_execution_authorization_decision_gate_id",
      "authorization_review_gate_id",
      "permission_execution_authorization_preflight_id",
      "controlled_permission_execution_hold_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "decision_scope",
      "founder_decision_language",
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
    "Founder hold recorded": [
      "hold_reason",
      "founder_decision_language",
      "non_execution_decision_clause"
    ],
    "Founder reject recorded": [
      "block_reason",
      "founder_decision_language",
      "non_execution_decision_clause"
    ],
    "Return to authorization review": [
      "return_reason"
    ],
    "Permission grant blocked": [
      "block_reason"
    ],
    "Authorization approval blocked": [
      "block_reason"
    ],
    "Execution blocked": [
      "block_reason"
    ],
    "Production forbidden": [
      "block_reason",
      "production_boundary"
    ],
    "Decision expired": [
      "expiry_check",
      "hold_reason"
    ]
  },
  decision_checks: [
    {
      check: "Review ready",
      rule: "Starts only from a ready controlled permission execution authorization review packet."
    },
    {
      check: "Decision only",
      rule: "Founder may record draft-only, hold, or reject posture without granting permission."
    },
    {
      check: "No operation",
      rule: "Execution, storage writes, canonical updates, migrations, accounts, secrets, public release, and production remain closed."
    },
    {
      check: "Draft-only next",
      rule: "A positive decision can only prepare a later controlled draft gate, never a runnable action."
    },
    {
      check: "Hold and reject",
      rule: "Hold and reject remain first-class outcomes; they do not create a draft candidate."
    },
    {
      check: "Expiry",
      rule: "Expires on review, source, rights, founder, rollback, monitoring, packet, or code change."
    }
  ],
  sample_authorization_review_packet: sampleReviewPacket,
  sample_decision: {
    decision_state: "Draft-only founder decision recorded",
    decision_actor: "Founder",
    founder_name: "Founder sample",
    founder_permission_execution_authorization_decision_gate_id: "founder-permission-execution-authorization-decision-gate-sample-steady-action-bg-2-48",
    authorization_review_gate_id: sampleReviewPacket.controlled_permission_execution_authorization_review_gate_id,
    permission_execution_authorization_preflight_id: sampleReviewPacket.permission_execution_authorization_preflight_id,
    controlled_permission_execution_hold_id: sampleReviewPacket.controlled_permission_execution_hold_id,
    source_answer_id: sampleReviewPacket.source_answer_id,
    source_record_id: sampleReviewPacket.source_record_id,
    source_family: sampleReviewPacket.source_family,
    decision_scope: "Record founder posture after authorization review readiness. This decision may choose draft-only, hold, or reject. It is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
    founder_decision_language: "Founder decision result: draft-only path may be prepared for a controlled permission execution authorization draft gate. Permission is not granted, authorization is not approved, execution is not allowed, and no system may run from this decision.",
    decision_rationale: "The review packet is ready, evidence ids are visible, and boundaries are explicit. The next step is a draft gate only; it is not a live authorization.",
    decision_evidence_summary: "Authorization review id, preflight id, execution hold id, source answer id, source record id, source family, review language, rollback, monitoring, stop condition, expiry, and production boundary are visible.",
    non_execution_decision_clause: "Founder permission execution authorization decision gate only; controlled_permission_execution_authorization_review_ready may be true, permission_execution_authorization_review_recorded may be true, founder_permission_execution_authorization_decision_ready may be true, founder_permission_execution_authorization_decision_recorded may be true, and controlled_permission_execution_authorization_draft_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    risk_acknowledgment: "Risk remains: authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, founder change, ambiguous decision language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
    rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, reviewer handoff, founder decision audit, and review audit must remain present before any draft gate; no source state is written.",
    monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any controlled draft gate.",
    stop_condition: "Stop if authorization review id mismatches, preflight id mismatches, hold id mismatches, source ids mismatch, rights change, founder evidence is missing, decision language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
    expiry_check: "Founder permission execution authorization decision gate expires at the next material authorization review, preflight, hold, source, rights, founder, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    next_gate: nextGate,
    clarification_question: "",
    return_reason: "",
    hold_reason: "Hold until founder asks for more evidence.",
    block_reason: "Founder rejected this packet path."
  },
  boundary: {
    controlled_permission_execution_authorization_review_ready: false,
    permission_execution_authorization_review_recorded: false,
    founder_permission_execution_authorization_decision_ready: false,
    founder_permission_execution_authorization_decision_recorded: false,
    controlled_permission_execution_authorization_draft_candidate_ready: false,
    ...falseAuthority,
    next_gate_required: nextGate
  }
};

const css = `/* VedaPath founder permission execution authorization decision gate */
body.permission-execution-decision-page .topbar,
body.permission-execution-decision-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.permission-execution-decision-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.permission-execution-decision-page .nav .link,
body.permission-execution-decision-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.permission-execution-decision-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.permission-execution-decision-page main.workspace {
  grid-template-columns: minmax(230px, 0.74fr) minmax(0, 1.72fr) minmax(240px, 0.82fr);
  gap: 18px;
}

body.permission-execution-decision-page main.workspace > aside.panel:first-child,
body.permission-execution-decision-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.founder-decision,
.founder-decision-head,
.founder-decision-grid,
.founder-decision-form,
.founder-decision-actions,
.founder-decision-list,
.founder-decision-rules,
.founder-decision-result {
  display: grid;
  gap: 12px;
}

.founder-decision {
  gap: 18px;
}

.founder-decision-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.founder-decision-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.founder-decision-mark img {
  display: block;
  width: 100%;
}

.founder-decision-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.founder-decision-choice-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.founder-decision-choice,
.founder-decision-card,
.founder-decision-result,
.founder-decision-rule,
.founder-decision-form,
.founder-decision-output {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.founder-decision-choice,
.founder-decision-card,
.founder-decision-result,
.founder-decision-rule,
.founder-decision-form {
  padding: 12px;
}

.founder-decision-choice {
  min-height: 118px;
  text-align: left;
  cursor: pointer;
}

.founder-decision-choice[aria-pressed="true"],
.founder-decision-result[data-outcome="Draft-only"] {
  border-color: #e46a3b;
  background: #fff1e9;
}

.founder-decision-result[data-outcome="Hold"] {
  border-color: #e0a83b;
  background: #fff7e7;
}

.founder-decision-result[data-outcome="Reject"],
.founder-decision-result[data-state^="Blocked"] {
  border-color: #a83e12;
  background: #fff1ea;
}

.founder-decision-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.founder-decision-form input,
.founder-decision-form select,
.founder-decision-form textarea,
.founder-decision-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.founder-decision-form textarea,
.founder-decision-output {
  min-height: 96px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.founder-decision-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.founder-decision-list,
.founder-decision-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.founder-decision-card span,
.founder-decision-rule span,
.founder-decision-choice span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.founder-decision-card strong,
.founder-decision-rule strong,
.founder-decision-choice strong {
  display: block;
  margin-top: 4px;
}

.founder-decision-boundary {
  border-left: 4px solid var(--bhagwa);
  padding-left: 12px;
}

@media (max-width: 1080px) {
  body.permission-execution-decision-page main.workspace,
  .founder-decision-grid,
  .founder-decision-list,
  .founder-decision-rules {
    grid-template-columns: 1fr;
  }

  .founder-decision-head {
    grid-template-columns: 1fr;
  }

  .founder-decision-mark {
    max-width: 160px;
  }
}

@media (max-width: 760px) {
  body.permission-execution-decision-page .nav {
    flex-wrap: wrap;
  }

  .founder-decision-choice-grid,
  .founder-decision-actions {
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
      source_answer_id: decision.source_answer_id,
      source_record_id: decision.source_record_id,
      source_family: decision.source_family,
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
      next_gate_required: draftCandidate ? "${nextGate}" : null,
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
    keepsNonExecutionDecisionBoundary,
    founderPermissionExecutionAuthorizationDecisionGate,
    decisionSnapshot
  };

  init().catch((error) => {
    console.error("Founder permission execution authorization decision gate failed", error);
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
  </head>
  <body class="permission-execution-decision-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Founder decision gate</span>
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
          <span class="eyebrow">Founder posture, not execution</span>
          <h2>Choose draft-only, hold, or reject.</h2>
          <p class="muted">This gate records a founder decision after authorization review readiness. It cannot grant permission, approve authorization, execute, store, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Review</strong><p>Load ready packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Decision</strong><p>Choose posture.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep authority false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Next</strong><p>Draft only if chosen.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledpermissionexecutionauthorizationreviewgate.html">Open Authorization Review</a>
            <a class="button safe" href="permissionexecutionauthorizationpreflight.html">Open Preflight</a>
          </div>
        </aside>

        <section class="panel founder-decision" id="founderPermissionExecutionAuthorizationDecisionGate">
          <div class="founder-decision-head">
            <div>
              <span class="eyebrow">Founder permission execution authorization decision gate</span>
              <h1>Decide the posture. Execute nothing.</h1>
              <p class="muted">A draft-only outcome can prepare the next controlled draft gate. Hold and reject stay valid. Permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.</p>
            </div>
            <div class="founder-decision-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath founder decision mark"></div>
          </div>

          <section class="founder-decision-choice-grid" aria-label="Founder decision choices">
            <button class="founder-decision-choice" type="button" data-decision-state="Draft-only founder decision recorded" aria-pressed="true"><span>Decision path</span><strong>Draft Only</strong><p>Prepare a later draft packet. No execution.</p></button>
            <button class="founder-decision-choice" type="button" data-decision-state="Founder hold recorded" aria-pressed="false"><span>Decision path</span><strong>Hold</strong><p>Pause until more evidence is visible.</p></button>
            <button class="founder-decision-choice" type="button" data-decision-state="Founder reject recorded" aria-pressed="false"><span>Decision path</span><strong>Reject</strong><p>Close this packet path cleanly.</p></button>
          </section>

          <section class="founder-decision-grid">
            <div class="founder-decision-form">
              <h2>Founder Decision Packet</h2>
              <label>Authorization review packet<textarea id="founderReviewPacket"></textarea></label>
              <label>Decision state<select id="founderDecisionState"></select></label>
              <label>Decision actor<input id="founderDecisionActor" type="text" placeholder="Founder"></label>
              <label>Founder name<input id="founderDecisionName" type="text" placeholder="Founder sample"></label>
              <label>Founder decision gate id<input id="founderDecisionId" type="text"></label>
              <label>Authorization review gate id<input id="founderDecisionReviewId" type="text"></label>
              <label>Authorization preflight id<input id="founderDecisionPreflightId" type="text"></label>
              <label>Execution hold id<input id="founderDecisionHoldId" type="text"></label>
              <label>Source answer id<input id="founderDecisionSourceAnswer" type="text"></label>
              <label>Source record id<input id="founderDecisionSourceRecord" type="text"></label>
              <label>Source family<input id="founderDecisionSourceFamily" type="text"></label>
              <label>Decision scope<textarea id="founderDecisionScopeText"></textarea></label>
              <label>Founder decision language<textarea id="founderDecisionLanguage"></textarea></label>
              <label>Decision rationale<textarea id="founderDecisionRationale"></textarea></label>
              <label>Decision evidence summary<textarea id="founderDecisionSummary"></textarea></label>
              <label>Non-execution decision clause<textarea id="founderDecisionBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="founderDecisionRisk"></textarea></label>
              <label>Rollback condition<textarea id="founderDecisionRollback"></textarea></label>
              <label>Monitoring condition<textarea id="founderDecisionMonitoring"></textarea></label>
              <label>Stop condition<textarea id="founderDecisionStopCondition"></textarea></label>
              <label>Expiry check<textarea id="founderDecisionExpiry"></textarea></label>
              <label>Production boundary<textarea id="founderDecisionProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="founderDecisionClarification"></textarea></label>
              <label>Return reason<textarea id="founderDecisionReturnReason"></textarea></label>
              <label>Hold reason<textarea id="founderDecisionHoldReason"></textarea></label>
              <label>Reject or block reason<textarea id="founderDecisionBlockReason"></textarea></label>
              <div class="founder-decision-actions">
                <button class="button primary" id="runFounderDecision" type="button">Run Decision</button>
                <button class="button safe" id="loadFounderDecisionSample" type="button">Load Sample</button>
                <button class="button" id="saveFounderDecision" type="button">Save Local</button>
                <button class="button" id="clearFounderDecisions" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="founder-decision-result" id="founderDecisionResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Decision Scope</h2>
                <div class="founder-decision-list" id="founderDecisionScope"></div>
              </section>
              <section style="margin-top: 10px;">
                <h2>Decision Checks</h2>
                <div class="founder-decision-rules" id="founderDecisionChecks"></div>
              </section>
            </div>
          </section>

          <section class="founder-decision-grid">
            <div>
              <div class="founder-decision-actions">
                <button class="button safe" id="copyFounderDecision" type="button">Copy Decision Packet</button>
                <a class="button" href="${dataFile}">Open JSON</a>
              </div>
              <textarea class="founder-decision-output" id="founderDecisionOutput" aria-label="Founder permission execution authorization decision gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Founder Decisions</h2>
              <div class="founder-decision-list" id="founderDecisionSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Decision is not authority</span>
          <h2 style="margin-top: 14px;">Draft Candidate Only</h2>
          <p class="muted">A positive decision prepares one later draft gate. It still does not grant permission or approve execution.</p>
          <div class="progress" aria-label="Founder decision gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Choices</span><strong>3</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Draft gate</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Decision Boundary</h2>
            <p class="founder-decision-boundary">Founder decision signal only. Permission grant, authorization approval, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a controlled draft gate. It does not authorize or execute anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="${jsFile}"></script>
  </body>
</html>
`;

const doc = `# ${releaseName}

${releaseName} records founder posture after authorization review readiness.

It can record three outcomes:

- Draft-only path
- Hold for more evidence
- Reject packet path

It may mark a controlled draft candidate only when the founder chooses the draft-only path.

It must not grant permission, approve authorization, execute, store, update canonical records, publish, or launch production.

Next gate: ${nextGate}.
`;

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function update(file, fn) {
  const next = fn(read(file));
  fs.writeFileSync(file, next);
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

function updateAllHtmlBadges() {
  for (const file of walk(".")) {
    if (!file.endsWith(".html")) continue;
    const text = read(file);
    const next = text.replace(/<span class="version">v3\.2\.6 review gate<\/span>/g, `<span class="version">${releaseBadge}</span>`);
    if (next !== text) fs.writeFileSync(file, next);
  }
}

function insertBefore(text, marker, block) {
  if (text.includes(block.trim().split("\n")[0])) return text;
  return text.replace(marker, `${block}\n\n${marker}`);
}

function applyUpdates() {
  updateAllHtmlBadges();

  update("index.html", (text) => {
    let next = text;
    if (!next.includes(pageFile)) {
      next = next.replace(
        '<a href="controlledpermissionexecutionauthorizationreviewgate.html">Authorization review <span>gate</span></a>',
        '<a href="controlledpermissionexecutionauthorizationreviewgate.html">Authorization review <span>gate</span></a>\n              <a href="founderpermissionexecutionauthorizationdecisiongate.html">Founder auth decision <span>no-run</span></a>'
      );
      next = next.replace(
        '<a href="controlledpermissionexecutionauthorizationreviewgate.html">Authorization review <span>closed</span></a>',
        '<a href="controlledpermissionexecutionauthorizationreviewgate.html">Authorization review <span>closed</span></a>\n              <a href="founderpermissionexecutionauthorizationdecisiongate.html">Founder auth decision <span>closed</span></a>'
      );
    }
    return next;
  });

  update("controlledpermissionexecutionauthorizationreviewgate.html", (text) => {
    if (text.includes(pageFile)) return text;
    return text.replace(
      '<a class="button primary" href="permissionexecutionauthorizationpreflight.html">Open Authorization Preflight</a>\n            <a class="button safe" href="controlledpermissionexecutionhold.html">Open Execution Hold</a>',
      '<a class="button primary" href="founderpermissionexecutionauthorizationdecisiongate.html">Open Founder Decision</a>\n            <a class="button" href="permissionexecutionauthorizationpreflight.html">Open Authorization Preflight</a>\n            <a class="button safe" href="controlledpermissionexecutionhold.html">Open Execution Hold</a>'
    );
  });

  update("build-status.html", (text) => {
    let next = text;
    next = next.replace(
      '<strong>v3.2.6</strong>\n          <p>Controlled Permission Execution Authorization Review Gate: preflight language is reviewed for founder-decision readiness while permission grant, authorization approval, execution, storage, public release, and production remain false.</p>',
      `<strong>${release}</strong>\n          <p>${releaseName}: founder posture is recorded as draft-only, hold, or reject while permission grant, authorization approval, execution, storage, public release, and production remain false.</p>`
    );
    next = next.replace(
      '<p>The trust loop now separates authorization review readiness from any founder decision or runnable authorization while every real write path remains closed.</p>',
      '<p>The trust loop now has a founder decision gate that separates draft-only posture from permission grant, authorization approval, and execution.</p>'
    );
    next = next.replace(
      '<strong>Founder permission execution authorization decision gate</strong>\n          <p>Record founder decision language while permission grant and execution stay false.</p>',
      `<strong>${nextGate}</strong>\n          <p>Draft the controlled packet from the founder decision while permission and execution remain false.</p>`
    );
    next = next.replace(
      `<article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 291: Production Implementation and Licensed Audio</strong>\n                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>`,
      `<article class="phase">\n              <span class="badge done">Done</span>\n              <div>\n                <strong>Phase 291: ${releaseName}</strong>\n                <p>Records founder posture as draft-only, hold, or reject while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.</p>\n              </div>\n              <span class="percent">100%</span>\n            </article>\n            <article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 292: Production Implementation and Licensed Audio</strong>\n                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>`
    );
    next = next.replace(
      '<div class="version-row"><span>Release</span><strong>v3.2.6 Controlled Permission Execution Authorization Review Gate</strong></div>\n            <div class="version-row"><span>Previous</span><strong>v3.2.5 Permission Execution Authorization Preflight</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Review preflight language without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for founder permission execution authorization decision gate</strong></div>',
      `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>\n            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Record founder posture without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for controlled permission execution authorization draft gate</strong></div>`
    );
    next = next.replace(
      '<li><span class="dot"></span><span>Build founder permission execution authorization decision gate.</span></li>\n              <li><span class="dot"></span><span>Record founder decision language before any authorization draft.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate founder decision readiness from any runnable operation.</span></li>',
      '<li><span class="dot"></span><span>Build the controlled permission execution authorization draft gate.</span></li>\n              <li><span class="dot"></span><span>Draft packet language from a founder draft-only decision.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate draft readiness from any runnable authorization.</span></li>'
    );
    return next;
  });

  const readmeBlock = `## ${release} ${releaseName}

${releaseName} records founder posture after authorization review readiness while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.

- [${releaseName}](${pageFile})
- [${releaseName} Notes](${docFile})
- [${releaseName} Data](${dataFile})`;

  update("README.md", (text) => insertBefore(text, "## v3.2.6 Controlled Permission Execution Authorization Review Gate", readmeBlock));

  const notesBlock = `## ${release} ${releaseName}

- Adds ${pageFile} as the founder decision gate after authorization review.
- Adds a decision-gate data contract and API with draft-only, hold, and reject outcomes.
- Keeps permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.
- Updates Home, Build, and the authorization review room so the next route stays visible without expanding primary navigation.`;

  update("docs/PROTOTYPE_NOTES.md", (text) => insertBefore(text, "## v3.2.6 Controlled Permission Execution Authorization Review Gate", notesBlock));

  const blueprintBlock = `### 310. ${releaseName}

${releaseName} records founder posture after authorization review readiness.

It may record draft-only, hold, or reject. Draft-only means a later controlled draft gate may be prepared. It must not grant permission, approve authorization, execute, store, update canonical records, publish, or launch.

This gate turns founder agency into a visible product control without turning the AI into an authority.`;

  update("docs/PRODUCT_BLUEPRINT.md", (text) => insertBefore(text, "### 309. Controlled Permission Execution Authorization Review Gate", blueprintBlock));
}

write(dataFile, `${JSON.stringify(config, null, 2)}\n`);
write(cssFile, css);
write(jsFile, js);
write(pageFile, html);
write(docFile, doc);
applyUpdates();

console.log(`${release} ${releaseName.toLowerCase()} applied.`);

import fs from "node:fs";
import path from "node:path";

const release = "v3.2.9";
const releaseName = "Controlled Permission Execution Authorization Draft Review Gate";
const releaseBadge = "v3.2.9 draft review";
const previousRelease = "v3.2.8 Controlled Permission Execution Authorization Draft Gate";
const previousDataFile = "data/vedapath-controlled-permission-execution-authorization-draft-gate.json";
const pageFile = "controlledpermissionexecutionauthorizationdraftreviewgate.html";
const dataFile = "data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json";
const cssFile = "assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.css";
const jsFile = "assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.js";
const docFile = "docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_REVIEW_GATE.md";
const nextGate = "Founder permission execution authorization review decision gate";

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
const previous = JSON.parse(fs.readFileSync(previousDataFile, "utf8"));
const draft = previous.sample_draft;

const sampleDraftPacket = {
  schema_version: previous.schema_version,
  release: "v3.2.8",
  draft_status: "Controlled authorization draft prepared; execution remains false.",
  controlled_permission_execution_authorization_draft_gate_id: draft.controlled_permission_execution_authorization_draft_gate_id,
  founder_decision_gate_id: draft.founder_decision_gate_id,
  authorization_review_gate_id: draft.authorization_review_gate_id,
  permission_execution_authorization_preflight_id: draft.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: draft.controlled_permission_execution_hold_id,
  source_answer_id: draft.source_answer_id,
  source_record_id: draft.source_record_id,
  source_family: draft.source_family,
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true,
  controlled_permission_execution_authorization_draft_ready: true,
  permission_execution_authorization_draft_recorded: true,
  controlled_permission_execution_authorization_draft_review_candidate_ready: true,
  ...falseAuthority,
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
  next_gate_required: "Controlled permission execution authorization draft review gate",
  created_at: "2026-06-28T00:00:00.000Z"
};

const config = {
  schema_version: "controlled-permission-execution-authorization-draft-review-gate-v1",
  release,
  generated_at: "2026-06-28T00:00:00.000Z",
  title: releaseName,
  summary: "Reviews controlled authorization draft packet language for clarity, evidence visibility, and boundary integrity while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  next_gate: nextGate,
  source: {
    draft_gate_release: "v3.2.8",
    draft_gate_schema: previous.schema_version,
    controlled_permission_execution_authorization_draft_gate_id: draft.controlled_permission_execution_authorization_draft_gate_id,
    source_answer_id: draft.source_answer_id,
    source_record_id: draft.source_record_id,
    source_family: draft.source_family
  },
  review_states: [
    "Draft review",
    "Needs draft review clarification",
    "Draft review ready for founder decision",
    "Return to draft gate",
    "Draft review hold",
    "Draft review rejected",
    "Authorization approval blocked",
    "Execution blocked",
    "Production forbidden",
    "Draft review expired"
  ],
  required_by_state: {
    "Draft review": ["controlled_permission_execution_authorization_draft_gate_id", "source_answer_id", "review_scope"],
    "Needs draft review clarification": ["clarification_question", "review_language"],
    "Draft review ready for founder decision": [
      "review_actor",
      "reviewer_name",
      "controlled_permission_execution_authorization_draft_review_gate_id",
      "controlled_permission_execution_authorization_draft_gate_id",
      "founder_decision_gate_id",
      "authorization_review_gate_id",
      "permission_execution_authorization_preflight_id",
      "controlled_permission_execution_hold_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "review_scope",
      "review_language",
      "review_notes",
      "review_evidence_summary",
      "non_execution_review_clause",
      "risk_review",
      "rollback_review",
      "monitoring_review",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to draft gate": ["return_reason"],
    "Draft review hold": ["hold_reason"],
    "Draft review rejected": ["block_reason"],
    "Authorization approval blocked": ["block_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Draft review expired": ["expiry_check", "hold_reason"]
  },
  review_checks: [
    { check: "Draft packet ready", rule: "Starts only from the controlled v3.2.8 draft packet output." },
    { check: "Review only", rule: "Can mark draft review readiness, but cannot approve authorization." },
    { check: "No operation", rule: "Execution, storage, canonical updates, migrations, accounts, secrets, public release, and production remain closed." },
    { check: "Evidence preserved", rule: "Keeps draft, founder decision, authorization review, preflight, hold, and source ids visible." },
    { check: "Founder decision next", rule: "Moves only to a founder review decision gate, never to a runnable path." },
    { check: "Expiry", rule: "Expires on draft, review, source, rights, rollback, monitoring, packet, or code change." }
  ],
  sample_draft_packet: sampleDraftPacket,
  sample_review: {
    review_state: "Draft review ready for founder decision",
    review_actor: "Controlled draft review gate",
    reviewer_name: "Draft review sample",
    controlled_permission_execution_authorization_draft_review_gate_id: "controlled-permission-execution-authorization-draft-review-gate-sample-steady-action-bg-2-48",
    controlled_permission_execution_authorization_draft_gate_id: draft.controlled_permission_execution_authorization_draft_gate_id,
    founder_decision_gate_id: draft.founder_decision_gate_id,
    authorization_review_gate_id: draft.authorization_review_gate_id,
    permission_execution_authorization_preflight_id: draft.permission_execution_authorization_preflight_id,
    controlled_permission_execution_hold_id: draft.controlled_permission_execution_hold_id,
    source_answer_id: draft.source_answer_id,
    source_record_id: draft.source_record_id,
    source_family: draft.source_family,
    review_scope: "Review controlled permission execution authorization draft language for clarity, evidence visibility, and boundary integrity. This review is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
    review_language: "Review result: the controlled draft packet can move to a founder review decision gate. Permission is not granted, authorization is not approved, execution is not allowed, and no system may run from this review.",
    review_notes: "The draft language keeps source ids, founder decision id, review id, preflight id, hold id, rollback, monitoring, stop condition, expiry, and production boundary visible.",
    review_evidence_summary: "Draft gate id, founder decision id, authorization review id, preflight id, execution hold id, source answer id, source record id, source family, rollback, monitoring, stop condition, expiry, and production boundary are present.",
    non_execution_review_clause: "Controlled permission execution authorization draft review gate only; controlled_permission_execution_authorization_draft_review_ready may be true, permission_execution_authorization_draft_review_recorded may be true, and founder_permission_execution_authorization_review_decision_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    risk_review: "Risk remains: draft packet mismatch, founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous review language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
    rollback_review: "Rollback, replay, before_hash, failure review, stop condition, founder decision audit, draft audit, and draft review audit must remain present before founder review decision; no source state is written.",
    monitoring_review: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before founder review decision.",
    stop_condition: "Stop if draft gate id mismatches, founder decision id mismatches, authorization review id mismatches, preflight id mismatches, hold id mismatches, source ids mismatch, rights change, review language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
    expiry_check: "Controlled permission execution authorization draft review gate expires at the next material draft, founder decision, authorization review, preflight, hold, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    next_gate: nextGate,
    clarification_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    controlled_permission_execution_authorization_draft_review_ready: false,
    permission_execution_authorization_draft_review_recorded: false,
    founder_permission_execution_authorization_review_decision_candidate_ready: false,
    ...falseAuthority,
    next_gate_required: nextGate
  }
};

const css = `/* VedaPath controlled permission execution authorization draft review gate */
body.permission-execution-draft-review-page .topbar,
body.permission-execution-draft-review-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.permission-execution-draft-review-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.permission-execution-draft-review-page .nav .link,
body.permission-execution-draft-review-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.permission-execution-draft-review-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.permission-execution-draft-review-page main.workspace {
  grid-template-columns: minmax(230px, 0.74fr) minmax(0, 1.72fr) minmax(240px, 0.82fr);
  gap: 18px;
}

body.permission-execution-draft-review-page main.workspace > aside.panel:first-child,
body.permission-execution-draft-review-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.draft-review-gate,
.draft-review-head,
.draft-review-grid,
.draft-review-form,
.draft-review-actions,
.draft-review-list,
.draft-review-rules,
.draft-review-result {
  display: grid;
  gap: 12px;
}

.draft-review-gate {
  gap: 18px;
}

.draft-review-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.draft-review-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.draft-review-mark img {
  display: block;
  width: 100%;
}

.draft-review-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.draft-review-step-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.draft-review-step,
.draft-review-card,
.draft-review-result,
.draft-review-rule,
.draft-review-form,
.draft-review-output {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.draft-review-step,
.draft-review-card,
.draft-review-result,
.draft-review-rule,
.draft-review-form {
  padding: 12px;
}

.draft-review-step:first-child {
  border-color: #e46a3b;
  background: #fff1e9;
}

.draft-review-result[data-state="Draft review ready for founder decision; execution remains false."] {
  border-color: #b7d5ca;
  background: #f6fffb;
}

.draft-review-result[data-state^="Blocked"],
.draft-review-result[data-state^="Draft review rejected"] {
  border-color: #efb39a;
  background: #fff1ea;
}

.draft-review-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.draft-review-form input,
.draft-review-form select,
.draft-review-form textarea,
.draft-review-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.draft-review-form textarea,
.draft-review-output {
  min-height: 96px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.draft-review-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.draft-review-list,
.draft-review-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.draft-review-card span,
.draft-review-rule span,
.draft-review-step span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.draft-review-card strong,
.draft-review-rule strong,
.draft-review-step strong {
  display: block;
  margin-top: 4px;
}

.draft-review-boundary {
  border-left: 4px solid var(--bhagwa);
  padding-left: 12px;
}

@media (max-width: 1080px) {
  body.permission-execution-draft-review-page main.workspace,
  .draft-review-grid,
  .draft-review-list,
  .draft-review-rules {
    grid-template-columns: 1fr;
  }

  .draft-review-head {
    grid-template-columns: 1fr;
  }

  .draft-review-mark {
    max-width: 160px;
  }
}

@media (max-width: 760px) {
  body.permission-execution-draft-review-page .nav {
    flex-wrap: wrap;
  }

  .draft-review-step-grid,
  .draft-review-actions {
    grid-template-columns: 1fr;
  }
}
`;

const js = `(function () {
  const configUrl = "${dataFile}";
  const falseAuthorityFlags = ${JSON.stringify(falseAuthorityFlags, null, 2)};
  const draftPacketReadyFlags = [
    "founder_permission_execution_authorization_decision_ready",
    "founder_permission_execution_authorization_decision_recorded",
    "controlled_permission_execution_authorization_draft_candidate_ready",
    "controlled_permission_execution_authorization_draft_ready",
    "permission_execution_authorization_draft_recorded",
    "controlled_permission_execution_authorization_draft_review_candidate_ready"
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

  function draftPacketReady(packet) {
    return Boolean(
      packet &&
      packet.schema_version === "controlled-permission-execution-authorization-draft-gate-v1" &&
      packet.draft_status === "Controlled authorization draft prepared; execution remains false." &&
      packet.next_gate_required === "Controlled permission execution authorization draft review gate" &&
      allFlagsTrue(packet, draftPacketReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags)
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
    if (!draftPacketReady(draftPacket)) {
      return blocked("Blocked: controlled draft packet must be ready and non-authorizing.", {
        next_gate_required: "Controlled permission execution authorization draft review gate"
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
      return blocked("Draft review: packet is not ready for founder review decision.", { state });
    }

    return {
      schema_version: config.schema_version,
      release: config.release,
      draft_review_status: "Draft review ready for founder decision; execution remains false.",
      controlled_permission_execution_authorization_draft_review_gate_id: review.controlled_permission_execution_authorization_draft_review_gate_id,
      controlled_permission_execution_authorization_draft_gate_id: review.controlled_permission_execution_authorization_draft_gate_id,
      founder_decision_gate_id: review.founder_decision_gate_id,
      authorization_review_gate_id: review.authorization_review_gate_id,
      permission_execution_authorization_preflight_id: review.permission_execution_authorization_preflight_id,
      controlled_permission_execution_hold_id: review.controlled_permission_execution_hold_id,
      source_answer_id: review.source_answer_id,
      source_record_id: review.source_record_id,
      source_family: review.source_family,
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
      next_gate_required: "${nextGate}",
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
    setValue("draftReviewGateId", review.controlled_permission_execution_authorization_draft_review_gate_id);
    setValue("draftReviewDraftGateId", review.controlled_permission_execution_authorization_draft_gate_id);
    setValue("draftReviewDecisionId", review.founder_decision_gate_id);
    setValue("draftReviewReviewId", review.authorization_review_gate_id);
    setValue("draftReviewPreflightId", review.permission_execution_authorization_preflight_id);
    setValue("draftReviewHoldId", review.controlled_permission_execution_hold_id);
    setValue("draftReviewSourceAnswer", review.source_answer_id);
    setValue("draftReviewSourceRecord", review.source_record_id);
    setValue("draftReviewSourceFamily", review.source_family);
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
      { label: "Input", value: "Controlled draft packet" },
      { label: "Output", value: "Founder review decision candidate" },
      { label: "Authorization", value: "False" },
      { label: "Execution", value: "False" }
    ]);
    renderList("draftReviewChecks", config.review_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readReview() {
    return {
      review_state: readValue("draftReviewState"),
      review_actor: readValue("draftReviewActor"),
      reviewer_name: readValue("draftReviewName"),
      controlled_permission_execution_authorization_draft_review_gate_id: readValue("draftReviewGateId"),
      controlled_permission_execution_authorization_draft_gate_id: readValue("draftReviewDraftGateId"),
      founder_decision_gate_id: readValue("draftReviewDecisionId"),
      authorization_review_gate_id: readValue("draftReviewReviewId"),
      permission_execution_authorization_preflight_id: readValue("draftReviewPreflightId"),
      controlled_permission_execution_hold_id: readValue("draftReviewHoldId"),
      source_answer_id: readValue("draftReviewSourceAnswer"),
      source_record_id: readValue("draftReviewSourceRecord"),
      source_family: readValue("draftReviewSourceFamily"),
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
    hasUnsafeAuthority,
    keepsNonExecutionReviewBoundary,
    controlledPermissionExecutionAuthorizationDraftReviewGate,
    reviewSnapshot
  };

  init().catch((error) => {
    console.error("Controlled permission execution authorization draft review gate failed", error);
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
  <body class="permission-execution-draft-review-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Controlled draft review</span>
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
          <span class="eyebrow">Review is not authorization</span>
          <h2>Review the draft. Approve nothing.</h2>
          <p class="muted">This gate checks the draft packet for clarity and boundary strength. It cannot grant permission, approve authorization, execute, store, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Draft</strong><p>Load packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Review</strong><p>Check wording.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep flags false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Decision</strong><p>Founder next.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledpermissionexecutionauthorizationdraftgate.html">Open Draft Gate</a>
            <a class="button safe" href="founderpermissionexecutionauthorizationdecisiongate.html">Open Founder Decision</a>
          </div>
        </aside>

        <section class="panel draft-review-gate" id="controlledPermissionExecutionAuthorizationDraftReviewGate">
          <div class="draft-review-head">
            <div>
              <span class="eyebrow">Controlled permission execution authorization draft review gate</span>
              <h1>Review the packet. Keep authority closed.</h1>
              <p class="muted">This gate checks the draft packet before founder review decision. It can mark review readiness, but it cannot approve authorization, grant permission, execute, store, update canonical records, publish, or launch production.</p>
            </div>
            <div class="draft-review-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath controlled draft review mark"></div>
          </div>

          <section class="draft-review-step-grid" aria-label="Draft review gate flow">
            <div class="draft-review-step"><span>1</span><strong>Draft packet</strong><p>Ready input.</p></div>
            <div class="draft-review-step"><span>2</span><strong>Review language</strong><p>Clear and bounded.</p></div>
            <div class="draft-review-step"><span>3</span><strong>Evidence</strong><p>Ids stay visible.</p></div>
            <div class="draft-review-step"><span>4</span><strong>Founder next</strong><p>No runnable path.</p></div>
          </section>

          <section class="draft-review-grid">
            <div class="draft-review-form">
              <h2>Controlled Draft Review</h2>
              <label>Controlled draft packet<textarea id="draftReviewPacket"></textarea></label>
              <label>Review state<select id="draftReviewState"></select></label>
              <label>Review actor<input id="draftReviewActor" type="text" placeholder="Controlled draft review gate"></label>
              <label>Reviewer name<input id="draftReviewName" type="text" placeholder="Draft review sample"></label>
              <label>Draft review gate id<input id="draftReviewGateId" type="text"></label>
              <label>Draft gate id<input id="draftReviewDraftGateId" type="text"></label>
              <label>Founder decision gate id<input id="draftReviewDecisionId" type="text"></label>
              <label>Authorization review gate id<input id="draftReviewReviewId" type="text"></label>
              <label>Authorization preflight id<input id="draftReviewPreflightId" type="text"></label>
              <label>Execution hold id<input id="draftReviewHoldId" type="text"></label>
              <label>Source answer id<input id="draftReviewSourceAnswer" type="text"></label>
              <label>Source record id<input id="draftReviewSourceRecord" type="text"></label>
              <label>Source family<input id="draftReviewSourceFamily" type="text"></label>
              <label>Review scope<textarea id="draftReviewScopeText"></textarea></label>
              <label>Review language<textarea id="draftReviewLanguage"></textarea></label>
              <label>Review notes<textarea id="draftReviewNotes"></textarea></label>
              <label>Review evidence summary<textarea id="draftReviewSummary"></textarea></label>
              <label>Non-execution review clause<textarea id="draftReviewBoundary"></textarea></label>
              <label>Risk review<textarea id="draftReviewRisk"></textarea></label>
              <label>Rollback review<textarea id="draftReviewRollback"></textarea></label>
              <label>Monitoring review<textarea id="draftReviewMonitoring"></textarea></label>
              <label>Stop condition<textarea id="draftReviewStopCondition"></textarea></label>
              <label>Expiry check<textarea id="draftReviewExpiry"></textarea></label>
              <label>Production boundary<textarea id="draftReviewProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="draftReviewClarification"></textarea></label>
              <label>Return reason<textarea id="draftReviewReturnReason"></textarea></label>
              <label>Hold reason<textarea id="draftReviewHoldReason"></textarea></label>
              <label>Block reason<textarea id="draftReviewBlockReason"></textarea></label>
              <div class="draft-review-actions">
                <button class="button primary" id="runDraftReviewGate" type="button">Run Review</button>
                <button class="button safe" id="loadDraftReviewSample" type="button">Load Sample</button>
                <button class="button" id="saveDraftReviewGate" type="button">Save Local</button>
                <button class="button" id="clearDraftReviews" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="draft-review-result" id="draftReviewResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Review Scope</h2>
                <div class="draft-review-list" id="draftReviewScope"></div>
              </section>
              <section style="margin-top: 10px;">
                <h2>Review Checks</h2>
                <div class="draft-review-rules" id="draftReviewChecks"></div>
              </section>
            </div>
          </section>

          <section class="draft-review-grid">
            <div>
              <div class="draft-review-actions">
                <button class="button safe" id="copyDraftReviewGate" type="button">Copy Review Packet</button>
                <a class="button" href="${dataFile}">Open JSON</a>
              </div>
              <textarea class="draft-review-output" id="draftReviewOutput" aria-label="Controlled permission execution authorization draft review gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Reviews</h2>
              <div class="draft-review-list" id="draftReviewSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Review is not authority</span>
          <h2 style="margin-top: 14px;">Founder Decision Candidate</h2>
          <p class="muted">A ready review creates one later founder review decision candidate. It still does not grant permission or approve execution.</p>
          <div class="progress" aria-label="Draft review gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Input</span><strong>Draft</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Founder</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Review Boundary</h2>
            <p class="draft-review-boundary">Review signal only. Permission grant, authorization approval, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a founder review decision gate. It does not authorize or execute anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="${jsFile}"></script>
  </body>
</html>
`;

const doc = `# ${releaseName}

${releaseName} reviews controlled permission execution authorization draft language before founder review decision.

It can mark draft-review readiness and founder review decision candidate readiness.

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
    const next = text.replace(/<span class="version">v3\.2\.8 draft gate<\/span>/g, `<span class="version">${releaseBadge}</span>`);
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
        '<a href="controlledpermissionexecutionauthorizationdraftgate.html">Authorization draft <span>review-only</span></a>',
        '<a href="controlledpermissionexecutionauthorizationdraftgate.html">Authorization draft <span>review-only</span></a>\n              <a href="controlledpermissionexecutionauthorizationdraftreviewgate.html">Draft review <span>founder next</span></a>'
      );
      next = next.replace(
        '<a href="controlledpermissionexecutionauthorizationdraftgate.html">Authorization draft <span>closed</span></a>',
        '<a href="controlledpermissionexecutionauthorizationdraftgate.html">Authorization draft <span>closed</span></a>\n              <a href="controlledpermissionexecutionauthorizationdraftreviewgate.html">Draft review <span>closed</span></a>'
      );
    }
    return next;
  });

  update("controlledpermissionexecutionauthorizationdraftgate.html", (text) => {
    if (text.includes(pageFile)) return text;
    return text.replace(
      '<a class="button primary" href="founderpermissionexecutionauthorizationdecisiongate.html">Open Founder Decision</a>\n            <a class="button safe" href="controlledpermissionexecutionauthorizationreviewgate.html">Open Authorization Review</a>',
      '<a class="button primary" href="controlledpermissionexecutionauthorizationdraftreviewgate.html">Open Draft Review</a>\n            <a class="button" href="founderpermissionexecutionauthorizationdecisiongate.html">Open Founder Decision</a>\n            <a class="button safe" href="controlledpermissionexecutionauthorizationreviewgate.html">Open Authorization Review</a>'
    );
  });

  update("build-status.html", (text) => {
    let next = text;
    next = next.replace(
      '<strong>v3.2.8</strong>\n          <p>Controlled Permission Execution Authorization Draft Gate: draft packet language is prepared for later review while permission grant, authorization approval, execution, storage, public release, and production remain false.</p>',
      `<strong>${release}</strong>\n          <p>${releaseName}: draft packet language is reviewed for founder decision readiness while permission grant, authorization approval, execution, storage, public release, and production remain false.</p>`
    );
    next = next.replace(
      '<p>The trust loop now turns a founder draft-only decision into reviewable draft language while every real authority path remains closed.</p>',
      '<p>The trust loop now reviews draft packet language before founder decision readiness while every real authority path remains closed.</p>'
    );
    next = next.replace(
      '<strong>Controlled permission execution authorization draft review gate</strong>\n          <p>Review the controlled draft packet before any later authorization posture.</p>',
      `<strong>${nextGate}</strong>\n          <p>Let the founder make a review decision while approval, permission, and execution remain closed.</p>`
    );
    next = next.replace(
      `<article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 293: Production Implementation and Licensed Audio</strong>\n                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>`,
      `<article class="phase">\n              <span class="badge done">Done</span>\n              <div>\n                <strong>Phase 293: ${releaseName}</strong>\n                <p>Reviews controlled draft packet language while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.</p>\n              </div>\n              <span class="percent">100%</span>\n            </article>\n            <article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 294: Production Implementation and Licensed Audio</strong>\n                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>`
    );
    next = next.replace(
      '<div class="version-row"><span>Release</span><strong>v3.2.8 Controlled Permission Execution Authorization Draft Gate</strong></div>\n            <div class="version-row"><span>Previous</span><strong>v3.2.7 Founder Permission Execution Authorization Decision Gate</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Draft reviewable packet language without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for controlled permission execution authorization draft review gate</strong></div>',
      `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>\n            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Review controlled draft language without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for founder permission execution authorization review decision gate</strong></div>`
    );
    next = next.replace(
      '<li><span class="dot"></span><span>Build the controlled permission execution authorization draft review gate.</span></li>\n              <li><span class="dot"></span><span>Review draft packet language before later authorization posture.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate draft review from any runnable operation.</span></li>',
      '<li><span class="dot"></span><span>Build the founder permission execution authorization review decision gate.</span></li>\n              <li><span class="dot"></span><span>Let founder review posture be recorded without approval or execution.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate founder review decision from any runnable operation.</span></li>'
    );
    return next;
  });

  const readmeBlock = `## ${release} ${releaseName}

${releaseName} reviews controlled packet language after the draft gate while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.

- [${releaseName}](${pageFile})
- [${releaseName} Notes](${docFile})
- [${releaseName} Data](${dataFile})`;

  update("README.md", (text) => insertBefore(text, "## v3.2.8 Controlled Permission Execution Authorization Draft Gate", readmeBlock));

  const notesBlock = `## ${release} ${releaseName}

- Adds ${pageFile} as the review gate after controlled permission execution authorization draft.
- Adds a draft-review data contract and API that create founder review decision candidate readiness only.
- Keeps permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.
- Updates Home, Build, and the draft gate so the next route remains visible in the calmer navigation flow.`;

  update("docs/PROTOTYPE_NOTES.md", (text) => insertBefore(text, "## v3.2.8 Controlled Permission Execution Authorization Draft Gate", notesBlock));

  const blueprintBlock = `### 312. ${releaseName}

${releaseName} reviews controlled authorization packet language after draft readiness.

It may mark draft-review readiness and founder review decision candidate readiness. It must not grant permission, approve authorization, execute, store, update canonical records, publish, or launch.

This gate keeps the authorization path legible while making review a boundary, not authority.`;

  update("docs/PRODUCT_BLUEPRINT.md", (text) => insertBefore(text, "### 311. Controlled Permission Execution Authorization Draft Gate", blueprintBlock));
}

write(dataFile, `${JSON.stringify(config, null, 2)}\n`);
write(cssFile, css);
write(jsFile, js);
write(pageFile, html);
write(docFile, doc);
applyUpdates();

console.log(`${release} ${releaseName.toLowerCase()} applied.`);

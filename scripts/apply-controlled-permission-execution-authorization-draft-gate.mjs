import fs from "node:fs";
import path from "node:path";

const release = "v3.2.8";
const releaseName = "Controlled Permission Execution Authorization Draft Gate";
const releaseBadge = "v3.2.8 draft gate";
const previousRelease = "v3.2.7 Founder Permission Execution Authorization Decision Gate";
const previousDataFile = "data/vedapath-founder-permission-execution-authorization-decision-gate.json";
const pageFile = "controlledpermissionexecutionauthorizationdraftgate.html";
const dataFile = "data/vedapath-controlled-permission-execution-authorization-draft-gate.json";
const cssFile = "assets/vedapath-controlled-permission-execution-authorization-draft-gate.css";
const jsFile = "assets/vedapath-controlled-permission-execution-authorization-draft-gate.js";
const docFile = "docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_GATE.md";
const nextGate = "Controlled permission execution authorization draft review gate";

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
const decision = previous.sample_decision;

const sampleDecisionPacket = {
  schema_version: previous.schema_version,
  release: "v3.2.7",
  decision_status: "Draft-only founder decision recorded; execution remains false.",
  founder_decision_outcome: "Draft-only",
  founder_permission_execution_authorization_decision_gate_id: decision.founder_permission_execution_authorization_decision_gate_id,
  authorization_review_gate_id: decision.authorization_review_gate_id,
  permission_execution_authorization_preflight_id: decision.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: decision.controlled_permission_execution_hold_id,
  source_answer_id: decision.source_answer_id,
  source_record_id: decision.source_record_id,
  source_family: decision.source_family,
  controlled_permission_execution_authorization_review_ready: true,
  permission_execution_authorization_review_recorded: true,
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true,
  ...falseAuthority,
  decision_scope: decision.decision_scope,
  founder_decision_language: decision.founder_decision_language,
  decision_evidence_summary: decision.decision_evidence_summary,
  non_execution_decision_clause: decision.non_execution_decision_clause,
  next_gate_required: "Controlled permission execution authorization draft gate",
  created_at: "2026-06-28T00:00:00.000Z"
};

const config = {
  schema_version: "controlled-permission-execution-authorization-draft-gate-v1",
  release,
  generated_at: "2026-06-28T00:00:00.000Z",
  title: releaseName,
  summary: "Drafts the controlled permission execution authorization packet after a founder draft-only decision while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  next_gate: nextGate,
  source: {
    founder_decision_release: "v3.2.7",
    founder_decision_schema: previous.schema_version,
    founder_decision_gate_id: decision.founder_permission_execution_authorization_decision_gate_id,
    source_answer_id: decision.source_answer_id,
    source_record_id: decision.source_record_id,
    source_family: decision.source_family
  },
  draft_states: [
    "Draft packet",
    "Needs draft clarification",
    "Controlled authorization draft prepared",
    "Return to founder decision",
    "Draft hold",
    "Draft rejected",
    "Authorization approval blocked",
    "Execution blocked",
    "Production forbidden",
    "Draft expired"
  ],
  required_by_state: {
    "Draft packet": ["founder_decision_gate_id", "source_answer_id", "draft_scope"],
    "Needs draft clarification": ["clarification_question", "draft_language"],
    "Controlled authorization draft prepared": [
      "draft_actor",
      "drafter_name",
      "controlled_permission_execution_authorization_draft_gate_id",
      "founder_decision_gate_id",
      "authorization_review_gate_id",
      "permission_execution_authorization_preflight_id",
      "controlled_permission_execution_hold_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "draft_scope",
      "draft_language",
      "draft_rationale",
      "draft_evidence_summary",
      "non_execution_draft_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to founder decision": ["return_reason"],
    "Draft hold": ["hold_reason"],
    "Draft rejected": ["block_reason"],
    "Authorization approval blocked": ["block_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Draft expired": ["expiry_check", "hold_reason"]
  },
  draft_checks: [
    { check: "Decision ready", rule: "Starts only from a draft-only founder decision packet." },
    { check: "Draft only", rule: "Can prepare language for review, but cannot approve authorization." },
    { check: "No operation", rule: "Execution, storage writes, canonical updates, migrations, accounts, secrets, public release, and production remain closed." },
    { check: "Evidence attached", rule: "Keeps founder decision, authorization review, preflight, hold, and source ids visible." },
    { check: "Review next", rule: "Moves only to a later draft review gate, never to a runnable operation." },
    { check: "Expiry", rule: "Expires on decision, review, source, rights, rollback, monitoring, packet, or code change." }
  ],
  sample_founder_decision_packet: sampleDecisionPacket,
  sample_draft: {
    draft_state: "Controlled authorization draft prepared",
    draft_actor: "Controlled draft gate",
    drafter_name: "Draft reviewer sample",
    controlled_permission_execution_authorization_draft_gate_id: "controlled-permission-execution-authorization-draft-gate-sample-steady-action-bg-2-48",
    founder_decision_gate_id: decision.founder_permission_execution_authorization_decision_gate_id,
    authorization_review_gate_id: decision.authorization_review_gate_id,
    permission_execution_authorization_preflight_id: decision.permission_execution_authorization_preflight_id,
    controlled_permission_execution_hold_id: decision.controlled_permission_execution_hold_id,
    source_answer_id: decision.source_answer_id,
    source_record_id: decision.source_record_id,
    source_family: decision.source_family,
    draft_scope: "Draft controlled permission execution authorization language after a founder draft-only decision. This draft is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
    draft_language: "Draft result: a controlled permission execution authorization packet may be prepared for review. Permission is not granted, authorization is not approved, execution is not allowed, and no system may run from this draft.",
    draft_rationale: "The founder chose draft-only, the review packet is ready, and the source ids remain visible. This gate prepares reviewable wording only.",
    draft_evidence_summary: "Founder decision id, authorization review id, preflight id, execution hold id, source answer id, source record id, source family, rollback, monitoring, stop condition, expiry, and production boundary are visible.",
    non_execution_draft_clause: "Controlled permission execution authorization draft gate only; founder_permission_execution_authorization_decision_ready may be true, founder_permission_execution_authorization_decision_recorded may be true, controlled_permission_execution_authorization_draft_candidate_ready may be true, controlled_permission_execution_authorization_draft_ready may be true, permission_execution_authorization_draft_recorded may be true, and controlled_permission_execution_authorization_draft_review_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    risk_acknowledgment: "Risk remains: founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous draft language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
    rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, founder decision audit, review audit, and draft audit must remain present before any review gate; no source state is written.",
    monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any draft review gate.",
    stop_condition: "Stop if founder decision id mismatches, authorization review id mismatches, preflight id mismatches, hold id mismatches, source ids mismatch, rights change, draft language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
    expiry_check: "Controlled permission execution authorization draft gate expires at the next material founder decision, authorization review, preflight, hold, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    next_gate: nextGate,
    clarification_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    founder_permission_execution_authorization_decision_ready: false,
    founder_permission_execution_authorization_decision_recorded: false,
    controlled_permission_execution_authorization_draft_candidate_ready: false,
    controlled_permission_execution_authorization_draft_ready: false,
    permission_execution_authorization_draft_recorded: false,
    controlled_permission_execution_authorization_draft_review_candidate_ready: false,
    ...falseAuthority,
    next_gate_required: nextGate
  }
};

const css = `/* VedaPath controlled permission execution authorization draft gate */
body.permission-execution-draft-page .topbar,
body.permission-execution-draft-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.permission-execution-draft-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.permission-execution-draft-page .nav .link,
body.permission-execution-draft-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.permission-execution-draft-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.permission-execution-draft-page main.workspace {
  grid-template-columns: minmax(230px, 0.74fr) minmax(0, 1.72fr) minmax(240px, 0.82fr);
  gap: 18px;
}

body.permission-execution-draft-page main.workspace > aside.panel:first-child,
body.permission-execution-draft-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.draft-gate,
.draft-gate-head,
.draft-gate-grid,
.draft-gate-form,
.draft-gate-actions,
.draft-gate-list,
.draft-gate-rules,
.draft-gate-result {
  display: grid;
  gap: 12px;
}

.draft-gate {
  gap: 18px;
}

.draft-gate-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.draft-gate-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.draft-gate-mark img {
  display: block;
  width: 100%;
}

.draft-gate-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.draft-step-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.draft-step,
.draft-gate-card,
.draft-gate-result,
.draft-gate-rule,
.draft-gate-form,
.draft-gate-output {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.draft-step,
.draft-gate-card,
.draft-gate-result,
.draft-gate-rule,
.draft-gate-form {
  padding: 12px;
}

.draft-step:first-child {
  border-color: #e46a3b;
  background: #fff1e9;
}

.draft-gate-result[data-state="Controlled authorization draft prepared"] {
  border-color: #b7d5ca;
  background: #f6fffb;
}

.draft-gate-result[data-state^="Blocked"],
.draft-gate-result[data-state^="Draft rejected"] {
  border-color: #efb39a;
  background: #fff1ea;
}

.draft-gate-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.draft-gate-form input,
.draft-gate-form select,
.draft-gate-form textarea,
.draft-gate-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.draft-gate-form textarea,
.draft-gate-output {
  min-height: 96px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.draft-gate-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.draft-gate-list,
.draft-gate-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.draft-gate-card span,
.draft-gate-rule span,
.draft-step span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.draft-gate-card strong,
.draft-gate-rule strong,
.draft-step strong {
  display: block;
  margin-top: 4px;
}

.draft-gate-boundary {
  border-left: 4px solid var(--bhagwa);
  padding-left: 12px;
}

@media (max-width: 1080px) {
  body.permission-execution-draft-page main.workspace,
  .draft-gate-grid,
  .draft-gate-list,
  .draft-gate-rules {
    grid-template-columns: 1fr;
  }

  .draft-gate-head {
    grid-template-columns: 1fr;
  }

  .draft-gate-mark {
    max-width: 160px;
  }
}

@media (max-width: 760px) {
  body.permission-execution-draft-page .nav {
    flex-wrap: wrap;
  }

  .draft-step-grid,
  .draft-gate-actions {
    grid-template-columns: 1fr;
  }
}
`;

const js = `(function () {
  const configUrl = "${dataFile}";
  const falseAuthorityFlags = ${JSON.stringify(falseAuthorityFlags, null, 2)};
  const decisionReadyFlags = [
    "founder_permission_execution_authorization_decision_ready",
    "founder_permission_execution_authorization_decision_recorded",
    "controlled_permission_execution_authorization_draft_candidate_ready"
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

  function founderDecisionPacketReady(packet) {
    return Boolean(
      packet &&
      packet.schema_version === "founder-permission-execution-authorization-decision-gate-v1" &&
      packet.decision_status === "Draft-only founder decision recorded; execution remains false." &&
      packet.founder_decision_outcome === "Draft-only" &&
      packet.next_gate_required === "Controlled permission execution authorization draft gate" &&
      allFlagsTrue(packet, decisionReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags)
    );
  }

  function keepsNonExecutionDraftBoundary(value) {
    const text = compact(value);
    if (!text || hasUnsafeAuthority(text)) return false;
    const mustMentionTrue = [
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
    if (!founderDecisionPacketReady(decisionPacket)) {
      return blocked("Blocked: founder decision packet must be draft-only and non-authorizing.", {
        next_gate_required: "Controlled permission execution authorization draft gate"
      });
    }

    const state = compact(draft && draft.draft_state) || "Draft packet";
    const missing = requiredMissing(config, state, draft || {});
    if (missing.length) {
      return blocked("Blocked: missing required fields for " + state + ".", { missing });
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
      draft_status: "Controlled authorization draft prepared; execution remains false.",
      controlled_permission_execution_authorization_draft_gate_id: draft.controlled_permission_execution_authorization_draft_gate_id,
      founder_decision_gate_id: draft.founder_decision_gate_id,
      authorization_review_gate_id: draft.authorization_review_gate_id,
      permission_execution_authorization_preflight_id: draft.permission_execution_authorization_preflight_id,
      controlled_permission_execution_hold_id: draft.controlled_permission_execution_hold_id,
      source_answer_id: draft.source_answer_id,
      source_record_id: draft.source_record_id,
      source_family: draft.source_family,
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
      next_gate_required: "${nextGate}",
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
    setValue("draftDecisionId", draft.founder_decision_gate_id);
    setValue("draftReviewId", draft.authorization_review_gate_id);
    setValue("draftPreflightId", draft.permission_execution_authorization_preflight_id);
    setValue("draftHoldId", draft.controlled_permission_execution_hold_id);
    setValue("draftSourceAnswer", draft.source_answer_id);
    setValue("draftSourceRecord", draft.source_record_id);
    setValue("draftSourceFamily", draft.source_family);
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
      { label: "Input", value: "Founder draft-only decision" },
      { label: "Output", value: "Review candidate" },
      { label: "Authorization", value: "False" },
      { label: "Execution", value: "False" }
    ]);
    renderList("draftGateChecks", config.draft_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readDraft() {
    return {
      draft_state: readValue("draftState"),
      draft_actor: readValue("draftActor"),
      drafter_name: readValue("draftName"),
      controlled_permission_execution_authorization_draft_gate_id: readValue("draftGateId"),
      founder_decision_gate_id: readValue("draftDecisionId"),
      authorization_review_gate_id: readValue("draftReviewId"),
      permission_execution_authorization_preflight_id: readValue("draftPreflightId"),
      controlled_permission_execution_hold_id: readValue("draftHoldId"),
      source_answer_id: readValue("draftSourceAnswer"),
      source_record_id: readValue("draftSourceRecord"),
      source_family: readValue("draftSourceFamily"),
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
    hasUnsafeAuthority,
    keepsNonExecutionDraftBoundary,
    controlledPermissionExecutionAuthorizationDraftGate,
    draftSnapshot
  };

  init().catch((error) => {
    console.error("Controlled permission execution authorization draft gate failed", error);
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
  <body class="permission-execution-draft-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Controlled draft gate</span>
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
          <span class="eyebrow">Draft is not authorization</span>
          <h2>Write the packet. Run nothing.</h2>
          <p class="muted">This gate turns a founder draft-only decision into reviewable draft language. It cannot grant permission, approve authorization, execute, store, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Decision</strong><p>Load draft-only.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Draft</strong><p>Prepare wording.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep flags false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Review</strong><p>Move only to review.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="founderpermissionexecutionauthorizationdecisiongate.html">Open Founder Decision</a>
            <a class="button safe" href="controlledpermissionexecutionauthorizationreviewgate.html">Open Authorization Review</a>
          </div>
        </aside>

        <section class="panel draft-gate" id="controlledPermissionExecutionAuthorizationDraftGate">
          <div class="draft-gate-head">
            <div>
              <span class="eyebrow">Controlled permission execution authorization draft gate</span>
              <h1>Draft the packet. Keep authority closed.</h1>
              <p class="muted">This gate prepares a reviewable authorization draft from a founder draft-only decision. It cannot approve authorization, grant permission, execute, store, update canonical records, publish, or launch production.</p>
            </div>
            <div class="draft-gate-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath controlled draft mark"></div>
          </div>

          <section class="draft-step-grid" aria-label="Draft gate flow">
            <div class="draft-step"><span>1</span><strong>Founder decision</strong><p>Draft-only input.</p></div>
            <div class="draft-step"><span>2</span><strong>Draft packet</strong><p>Reviewable wording.</p></div>
            <div class="draft-step"><span>3</span><strong>Boundary</strong><p>All authority false.</p></div>
            <div class="draft-step"><span>4</span><strong>Review next</strong><p>No runnable path.</p></div>
          </section>

          <section class="draft-gate-grid">
            <div class="draft-gate-form">
              <h2>Controlled Draft Packet</h2>
              <label>Founder decision packet<textarea id="draftDecisionPacket"></textarea></label>
              <label>Draft state<select id="draftState"></select></label>
              <label>Draft actor<input id="draftActor" type="text" placeholder="Controlled draft gate"></label>
              <label>Drafter name<input id="draftName" type="text" placeholder="Draft reviewer sample"></label>
              <label>Draft gate id<input id="draftGateId" type="text"></label>
              <label>Founder decision gate id<input id="draftDecisionId" type="text"></label>
              <label>Authorization review gate id<input id="draftReviewId" type="text"></label>
              <label>Authorization preflight id<input id="draftPreflightId" type="text"></label>
              <label>Execution hold id<input id="draftHoldId" type="text"></label>
              <label>Source answer id<input id="draftSourceAnswer" type="text"></label>
              <label>Source record id<input id="draftSourceRecord" type="text"></label>
              <label>Source family<input id="draftSourceFamily" type="text"></label>
              <label>Draft scope<textarea id="draftScopeText"></textarea></label>
              <label>Draft language<textarea id="draftLanguage"></textarea></label>
              <label>Draft rationale<textarea id="draftRationale"></textarea></label>
              <label>Draft evidence summary<textarea id="draftSummary"></textarea></label>
              <label>Non-execution draft clause<textarea id="draftBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="draftRisk"></textarea></label>
              <label>Rollback condition<textarea id="draftRollback"></textarea></label>
              <label>Monitoring condition<textarea id="draftMonitoring"></textarea></label>
              <label>Stop condition<textarea id="draftStopCondition"></textarea></label>
              <label>Expiry check<textarea id="draftExpiry"></textarea></label>
              <label>Production boundary<textarea id="draftProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="draftClarification"></textarea></label>
              <label>Return reason<textarea id="draftReturnReason"></textarea></label>
              <label>Hold reason<textarea id="draftHoldReason"></textarea></label>
              <label>Block reason<textarea id="draftBlockReason"></textarea></label>
              <div class="draft-gate-actions">
                <button class="button primary" id="runDraftGate" type="button">Run Draft</button>
                <button class="button safe" id="loadDraftSample" type="button">Load Sample</button>
                <button class="button" id="saveDraftGate" type="button">Save Local</button>
                <button class="button" id="clearDraftGates" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="draft-gate-result" id="draftGateResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Draft Scope</h2>
                <div class="draft-gate-list" id="draftGateScope"></div>
              </section>
              <section style="margin-top: 10px;">
                <h2>Draft Checks</h2>
                <div class="draft-gate-rules" id="draftGateChecks"></div>
              </section>
            </div>
          </section>

          <section class="draft-gate-grid">
            <div>
              <div class="draft-gate-actions">
                <button class="button safe" id="copyDraftGate" type="button">Copy Draft Packet</button>
                <a class="button" href="${dataFile}">Open JSON</a>
              </div>
              <textarea class="draft-gate-output" id="draftOutput" aria-label="Controlled permission execution authorization draft gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Drafts</h2>
              <div class="draft-gate-list" id="draftGateSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Draft is not authority</span>
          <h2 style="margin-top: 14px;">Review Candidate Only</h2>
          <p class="muted">A ready draft creates one later review candidate. It still does not grant permission or approve execution.</p>
          <div class="progress" aria-label="Draft gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Input</span><strong>Decision</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Review</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Draft Boundary</h2>
            <p class="draft-gate-boundary">Draft signal only. Permission grant, authorization approval, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a controlled draft review gate. It does not authorize or execute anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="${jsFile}"></script>
  </body>
</html>
`;

const doc = `# ${releaseName}

${releaseName} drafts a controlled permission execution authorization packet after a founder draft-only decision.

It can prepare reviewable packet language and mark draft-review candidate readiness.

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
    const next = text.replace(/<span class="version">v3\.2\.7 founder decision<\/span>/g, `<span class="version">${releaseBadge}</span>`);
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
        '<a href="founderpermissionexecutionauthorizationdecisiongate.html">Founder auth decision <span>no-run</span></a>',
        '<a href="founderpermissionexecutionauthorizationdecisiongate.html">Founder auth decision <span>no-run</span></a>\n              <a href="controlledpermissionexecutionauthorizationdraftgate.html">Authorization draft <span>review-only</span></a>'
      );
      next = next.replace(
        '<a href="founderpermissionexecutionauthorizationdecisiongate.html">Founder auth decision <span>closed</span></a>',
        '<a href="founderpermissionexecutionauthorizationdecisiongate.html">Founder auth decision <span>closed</span></a>\n              <a href="controlledpermissionexecutionauthorizationdraftgate.html">Authorization draft <span>closed</span></a>'
      );
    }
    return next;
  });

  update("founderpermissionexecutionauthorizationdecisiongate.html", (text) => {
    if (text.includes(pageFile)) return text;
    return text.replace(
      '<a class="button primary" href="controlledpermissionexecutionauthorizationreviewgate.html">Open Authorization Review</a>\n            <a class="button safe" href="permissionexecutionauthorizationpreflight.html">Open Preflight</a>',
      '<a class="button primary" href="controlledpermissionexecutionauthorizationdraftgate.html">Open Draft Gate</a>\n            <a class="button" href="controlledpermissionexecutionauthorizationreviewgate.html">Open Authorization Review</a>\n            <a class="button safe" href="permissionexecutionauthorizationpreflight.html">Open Preflight</a>'
    );
  });

  update("build-status.html", (text) => {
    let next = text;
    next = next.replace(
      '<strong>v3.2.7</strong>\n          <p>Founder Permission Execution Authorization Decision Gate: founder posture is recorded as draft-only, hold, or reject while permission grant, authorization approval, execution, storage, public release, and production remain false.</p>',
      `<strong>${release}</strong>\n          <p>${releaseName}: draft packet language is prepared for later review while permission grant, authorization approval, execution, storage, public release, and production remain false.</p>`
    );
    next = next.replace(
      '<p>The trust loop now has a founder decision gate that separates draft-only posture from permission grant, authorization approval, and execution.</p>',
      '<p>The trust loop now turns a founder draft-only decision into reviewable draft language while every real authority path remains closed.</p>'
    );
    next = next.replace(
      '<strong>Controlled permission execution authorization draft gate</strong>\n          <p>Draft the controlled packet from the founder decision while permission and execution remain false.</p>',
      `<strong>${nextGate}</strong>\n          <p>Review the controlled draft packet before any later authorization posture.</p>`
    );
    next = next.replace(
      `<article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 292: Production Implementation and Licensed Audio</strong>\n                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>`,
      `<article class="phase">\n              <span class="badge done">Done</span>\n              <div>\n                <strong>Phase 292: ${releaseName}</strong>\n                <p>Drafts reviewable permission execution authorization packet language while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.</p>\n              </div>\n              <span class="percent">100%</span>\n            </article>\n            <article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 293: Production Implementation and Licensed Audio</strong>\n                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>`
    );
    next = next.replace(
      '<div class="version-row"><span>Release</span><strong>v3.2.7 Founder Permission Execution Authorization Decision Gate</strong></div>\n            <div class="version-row"><span>Previous</span><strong>v3.2.6 Controlled Permission Execution Authorization Review Gate</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Record founder posture without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for controlled permission execution authorization draft gate</strong></div>',
      `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>\n            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Draft reviewable packet language without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for controlled permission execution authorization draft review gate</strong></div>`
    );
    next = next.replace(
      '<li><span class="dot"></span><span>Build the controlled permission execution authorization draft gate.</span></li>\n              <li><span class="dot"></span><span>Draft packet language from a founder draft-only decision.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate draft readiness from any runnable authorization.</span></li>',
      '<li><span class="dot"></span><span>Build the controlled permission execution authorization draft review gate.</span></li>\n              <li><span class="dot"></span><span>Review draft packet language before later authorization posture.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate draft review from any runnable operation.</span></li>'
    );
    return next;
  });

  const readmeBlock = `## ${release} ${releaseName}

${releaseName} drafts reviewable packet language after a founder draft-only decision while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.

- [${releaseName}](${pageFile})
- [${releaseName} Notes](${docFile})
- [${releaseName} Data](${dataFile})`;

  update("README.md", (text) => insertBefore(text, "## v3.2.7 Founder Permission Execution Authorization Decision Gate", readmeBlock));

  const notesBlock = `## ${release} ${releaseName}

- Adds ${pageFile} as the draft gate after founder permission execution authorization decision.
- Adds a draft-gate data contract and API that create draft-review candidate readiness only.
- Keeps permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.
- Updates Home, Build, and the founder decision room so the next route stays visible without expanding primary navigation.`;

  update("docs/PROTOTYPE_NOTES.md", (text) => insertBefore(text, "## v3.2.7 Founder Permission Execution Authorization Decision Gate", notesBlock));

  const blueprintBlock = `### 311. ${releaseName}

${releaseName} drafts reviewable authorization packet language after a founder draft-only decision.

It may mark draft readiness and draft-review candidate readiness. It must not grant permission, approve authorization, execute, store, update canonical records, publish, or launch.

This gate makes the authorization path legible without making the product operationally powerful before review.`;

  update("docs/PRODUCT_BLUEPRINT.md", (text) => insertBefore(text, "### 310. Founder Permission Execution Authorization Decision Gate", blueprintBlock));
}

write(dataFile, `${JSON.stringify(config, null, 2)}\n`);
write(cssFile, css);
write(jsFile, js);
write(pageFile, html);
write(docFile, doc);
applyUpdates();

console.log(`${release} ${releaseName.toLowerCase()} applied.`);

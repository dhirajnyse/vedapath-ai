import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.2.4";
const badge = "v3.2.4 execution hold";
const previousRelease = "v3.2.3 Founder Permission Decision Gate";
const nextGate = "Permission execution authorization preflight";
const generatedAt = "2026-06-28T00:00:00.000Z";

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, value) {
  fs.writeFileSync(path.join(root, file), value);
}

function update(file, fn) {
  write(file, fn(read(file)));
}

function mustReplace(content, search, replacement, label) {
  if (!content.includes(search)) throw new Error(`Missing marker: ${label}`);
  return content.replace(search, replacement);
}

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") return [];
      return htmlFiles(full);
    }
    return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
  });
}

const decisionConfig = JSON.parse(read("data/vedapath-founder-permission-decision-gate.json"));
const decision = decisionConfig.sample_decision;

const falseAuthorityFlags = {
  permission_granted: false,
  authorization_permission_granted: false,
  permission_review_approved: false,
  founder_permission_granted: false,
  execution_packet_authorized: false,
  execution_authorized: false,
  execution_allowed: false,
  founder_instruction_granted: false,
  source_promotion_allowed: false,
  promotion_execution_allowed: false,
  implementation_authorized: false,
  implementation_execution_allowed: false,
  controlled_storage_entry_allowed: false,
  storage_write_enabled: false,
  canonical_write_allowed: false,
  source_write_executed: false,
  actual_storage_write_executed: false,
  production_ready: false,
  production_launch_allowed: false,
  public_release_allowed: false
};

const sampleFounderDecisionPacket = {
  schema_version: decisionConfig.schema_version,
  release: decisionConfig.release,
  controlled_founder_permission_decision_gate_id: decision.controlled_founder_permission_decision_gate_id,
  decision_status: "Decision ready for controlled hold",
  controlled_authorization_permission_review_ready: true,
  permission_review_signal_recorded: true,
  founder_permission_decision_candidate_ready: true,
  controlled_founder_permission_decision_gate_ready: true,
  founder_permission_decision_recorded: true,
  controlled_permission_execution_hold_candidate_ready: true,
  ...falseAuthorityFlags,
  next_gate_required: "Controlled permission execution hold",
  controlled_authorization_permission_review_gate_id: decision.controlled_authorization_permission_review_gate_id,
  controlled_authorization_permission_preflight_id: decision.controlled_authorization_permission_preflight_id,
  founder_authorization_instruction_gate_id: decision.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: decision.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: decision.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: decision.founder_authorization_decision_gate_id,
  source_answer_id: decision.source_answer_id,
  source_record_id: decision.source_record_id,
  source_family: decision.source_family,
  decision_actor: decision.decision_actor,
  founder_name: decision.founder_name,
  decision_scope: decision.decision_scope,
  founder_decision_language: decision.founder_decision_language,
  decision_rationale: decision.decision_rationale,
  decision_evidence_summary: decision.decision_evidence_summary,
  evidence_lock: decision.evidence_lock,
  non_execution_decision_clause: decision.non_execution_decision_clause,
  risk_acknowledgment: decision.risk_acknowledgment,
  rollback_condition: decision.rollback_condition,
  monitoring_condition: decision.monitoring_condition,
  stop_condition: decision.stop_condition,
  expiry_check: decision.expiry_check,
  production_boundary: decision.production_boundary,
  created_at: generatedAt
};

const sampleHold = {
  hold_state: "Hold ready for preflight",
  hold_actor: "Controlled execution hold reviewer",
  holder_name: "Holder sample",
  controlled_permission_execution_hold_id: "controlled-permission-execution-hold-sample-steady-action-bg-2-48",
  controlled_founder_permission_decision_gate_id: decision.controlled_founder_permission_decision_gate_id,
  controlled_authorization_permission_review_gate_id: decision.controlled_authorization_permission_review_gate_id,
  controlled_authorization_permission_preflight_id: decision.controlled_authorization_permission_preflight_id,
  founder_authorization_instruction_gate_id: decision.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: decision.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: decision.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: decision.founder_authorization_decision_gate_id,
  source_answer_id: decision.source_answer_id,
  source_record_id: decision.source_record_id,
  source_family: decision.source_family,
  hold_scope: "Hold the founder decision signal for a later permission execution authorization preflight only. This hold is not permission grant, not authorization, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  hold_language: "Hold result: the founder decision is held for later permission execution authorization preflight. This is hold readiness only; permission is not granted, authorization is not granted, execution is not allowed, and no system may run from it.",
  hold_rationale: "The founder permission decision is ready and source-locked. The execution hold signal only prepares a later permission execution authorization preflight; it does not open operational authority.",
  hold_evidence_summary: "Founder decision ready; permission review, permission preflight, founder instruction, authorization review, authorization draft, founder decision history, source ids, source family, citation, rights, translation, reviewer evidence, source-owner scope, rollback, monitoring, stop condition, expiry, and production boundary remain visible.",
  evidence_lock: "Locked to controlled_founder_permission_decision_gate_id controlled-founder-permission-decision-gate-sample-steady-action-bg-2-48, controlled_authorization_permission_review_gate_id controlled-authorization-permission-review-gate-sample-steady-action-bg-2-48, controlled_authorization_permission_preflight_id controlled-authorization-permission-preflight-sample-steady-action-bg-2-48, founder_authorization_instruction_gate_id founder-authorization-instruction-gate-sample-steady-action-bg-2-48, controlled_authorization_review_gate_id controlled-authorization-review-gate-sample-steady-action-bg-2-48, controlled_execution_packet_authorization_draft_id controlled-execution-packet-authorization-draft-sample-steady-action-bg-2-48, founder_authorization_decision_gate_id founder-authorization-decision-gate-sample-steady-action-bg-2-48, source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti.",
  non_execution_hold_clause: "Controlled permission execution hold only; controlled_founder_permission_decision_gate_ready may be true, founder_permission_decision_recorded may be true, controlled_permission_execution_hold_candidate_ready may be true, controlled_permission_execution_hold_ready may be true, permission_execution_hold_recorded may be true, permission_execution_authorization_preflight_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
  risk_acknowledgment: "Risk remains: founder decision mismatch, permission review mismatch, preflight mismatch, founder instruction mismatch, review mismatch, draft mismatch, source mismatch, rights change, reviewer change, hold language ambiguity, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, reviewer handoff, founder decision audit, and hold audit must remain present before any permission execution authorization preflight; no source state is written.",
  monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any permission execution authorization preflight.",
  stop_condition: "Stop if founder decision id mismatches, permission review id mismatches, preflight id mismatches, founder instruction id mismatches, review id mismatches, draft id mismatches, source ids mismatch, rights change, reviewer evidence is missing, hold language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Controlled permission execution hold expires at the next material founder decision, permission review, preflight, founder instruction, authorization review, authorization draft, source, rights, reviewer, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  next_gate: nextGate,
  clarification_question: "",
  return_reason: "",
  hold_reason: "",
  block_reason: ""
};

const config = {
  schema_version: "controlled-permission-execution-hold-v1",
  release,
  generated_at: generatedAt,
  title: "Controlled Permission Execution Hold",
  summary: "Holds a founder permission decision after decision readiness while keeping permission grant, authorization, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  source: {
    founder_permission_decision_release: decisionConfig.release,
    founder_permission_decision_schema: decisionConfig.schema_version,
    controlled_founder_permission_decision_gate_id: decision.controlled_founder_permission_decision_gate_id,
    controlled_authorization_permission_review_gate_id: decision.controlled_authorization_permission_review_gate_id,
    controlled_authorization_permission_preflight_id: decision.controlled_authorization_permission_preflight_id,
    founder_authorization_instruction_gate_id: decision.founder_authorization_instruction_gate_id,
    controlled_authorization_review_gate_id: decision.controlled_authorization_review_gate_id,
    controlled_execution_packet_authorization_draft_id: decision.controlled_execution_packet_authorization_draft_id,
    founder_authorization_decision_gate_id: decision.founder_authorization_decision_gate_id,
    source_answer_id: decision.source_answer_id,
    source_record_id: decision.source_record_id,
    source_family: decision.source_family
  },
  hold_states: [
    "Draft hold",
    "Needs hold clarification",
    "Hold ready for preflight",
    "Return to founder decision",
    "Permission hold blocked",
    "Execution blocked",
    "Production forbidden",
    "Hold paused",
    "Hold expired"
  ],
  required_by_state: {
    "Draft hold": ["controlled_founder_permission_decision_gate_id", "source_answer_id", "hold_scope"],
    "Needs hold clarification": ["clarification_question", "hold_language"],
    "Hold ready for preflight": [
      "hold_actor",
      "holder_name",
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
      "hold_scope",
      "hold_language",
      "hold_rationale",
      "hold_evidence_summary",
      "evidence_lock",
      "non_execution_hold_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to founder decision": ["return_reason"],
    "Permission hold blocked": ["block_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Hold paused": ["hold_reason"],
    "Hold expired": ["expiry_check", "hold_reason"]
  },
  hold_checks: [
    { check: "Decision ready", rule: "Starts only from a ready founder permission decision whose next gate is controlled permission execution hold." },
    { check: "Hold only", rule: "May record a hold signal, but cannot grant permission, authorization, or execution." },
    { check: "Evidence lock", rule: "Keeps founder decision, review, preflight, instruction gate, authorization draft, source answer, source record, and family locked." },
    { check: "No operation", rule: "Execution, storage, canonical writes, public release, production, accounts, secrets, and migrations remain blocked." },
    { check: "Preflight next", rule: "Moves only to permission execution authorization preflight, never to execution." },
    { check: "Expiry", rule: "Expires on decision, review, preflight, instruction, source, rights, reviewer, rollback, monitoring, packet, or code change." }
  ],
  sample_founder_decision_packet: sampleFounderDecisionPacket,
  sample_hold: sampleHold,
  boundary: {
    controlled_founder_permission_decision_gate_ready: false,
    founder_permission_decision_recorded: false,
    controlled_permission_execution_hold_candidate_ready: false,
    controlled_permission_execution_hold_ready: false,
    permission_execution_hold_recorded: false,
    permission_execution_authorization_preflight_candidate_ready: false,
    ...falseAuthorityFlags,
    next_gate_required: nextGate
  }
};

write("data/vedapath-controlled-permission-execution-hold.json", JSON.stringify(config, null, 2) + "\n");

const css = `/* VedaPath controlled permission execution hold */
body.execution-hold-page .topbar,
body.execution-hold-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.execution-hold-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.execution-hold-page .nav .link,
body.execution-hold-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.execution-hold-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.execution-hold-page main.workspace {
  grid-template-columns: minmax(210px, 0.72fr) minmax(0, 1.7fr) minmax(230px, 0.8fr);
  gap: 18px;
}

body.execution-hold-page main.workspace > aside.panel:first-child,
body.execution-hold-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.execution-hold,
.execution-hold-head,
.execution-hold-layout,
.execution-hold-form,
.execution-hold-grid,
.execution-hold-list,
.execution-hold-actions,
.execution-hold-rules {
  display: grid;
  gap: 10px;
}

.execution-hold { gap: 16px; }

.execution-hold-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.execution-hold-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.execution-hold-mark img {
  display: block;
  width: 100%;
}

.execution-hold-layout {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.execution-hold-form,
.execution-hold-card,
.execution-hold-result,
.execution-hold-output,
.execution-hold-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.execution-hold-form,
.execution-hold-card,
.execution-hold-result,
.execution-hold-rule {
  padding: 12px;
}

.execution-hold-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.execution-hold-form input,
.execution-hold-form select,
.execution-hold-form textarea,
.execution-hold-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.execution-hold-form textarea,
.execution-hold-output {
  min-height: 92px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.execution-hold-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.execution-hold-grid,
.execution-hold-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.execution-hold-card.ready,
.execution-hold-result[data-state="Hold ready for preflight"] {
  border-color: #b7d5ca;
  background: #f6fffb;
}

.execution-hold-card.blocked,
.execution-hold-result[data-state^="Blocked"] {
  border-color: #efb39a;
  background: #fff1ea;
}

.execution-hold-card span,
.execution-hold-rule span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.execution-hold-card strong,
.execution-hold-rule strong {
  display: block;
  margin-top: 4px;
}

.execution-hold-boundary {
  border-left: 4px solid var(--bhagwa);
  padding-left: 12px;
}

@media (max-width: 1050px) {
  body.execution-hold-page main.workspace,
  .execution-hold-layout,
  .execution-hold-grid,
  .execution-hold-rules {
    grid-template-columns: 1fr;
  }

  .execution-hold-head {
    grid-template-columns: 1fr;
  }

  .execution-hold-mark {
    max-width: 160px;
  }
}

@media (max-width: 760px) {
  body.execution-hold-page .nav {
    flex-wrap: wrap;
  }

  .execution-hold-actions {
    grid-template-columns: 1fr 1fr;
  }
}
`;

write("assets/vedapath-controlled-permission-execution-hold.css", css);

const js = `(() => {
  const storageKey = "vedapath-controlled-permission-execution-hold";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("controlledPermissionExecutionHold") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("executionHoldSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("executionHoldResultCard") : null;
  const output = pageDocument ? pageDocument.getElementById("executionHoldOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("executionHoldChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("executionHoldScope") : null;

  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\\\"": "&quot;",
    "'": "&#39;"
  })[char]);

  function hasText(value, groups) {
    const text = String(value || "").toLowerCase();
    return groups.every((group) => group.some((term) => text.includes(term.toLowerCase())));
  }

  function founderDecisionReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-founder-permission-decision-gate-v1" &&
      packet.decision_status === "Decision ready for controlled hold" &&
      packet.controlled_founder_permission_decision_gate_ready === true &&
      packet.founder_permission_decision_recorded === true &&
      packet.controlled_permission_execution_hold_candidate_ready === true &&
      packet.permission_granted === false &&
      packet.authorization_permission_granted === false &&
      packet.permission_review_approved === false &&
      packet.founder_permission_granted === false &&
      packet.execution_packet_authorized === false &&
      packet.execution_authorized === false &&
      packet.execution_allowed === false &&
      packet.founder_instruction_granted === false &&
      packet.source_promotion_allowed === false &&
      packet.promotion_execution_allowed === false &&
      packet.implementation_authorized === false &&
      packet.implementation_execution_allowed === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.canonical_write_allowed === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.production_ready === false &&
      packet.production_launch_allowed === false &&
      packet.public_release_allowed === false &&
      packet.next_gate_required === "Controlled permission execution hold";
  }

  function hasUnsafeAuthority(value) {
    return /(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsNonExecutionHoldBoundary(value) {
    const text = String(value || "");
    const required = [
      /controlled_founder_permission_decision_gate_ready may be true/i,
      /founder_permission_decision_recorded may be true/i,
      /controlled_permission_execution_hold_candidate_ready may be true/i,
      /controlled_permission_execution_hold_ready may be true/i,
      /permission_execution_hold_recorded may be true/i,
      /permission_execution_authorization_preflight_candidate_ready may be true/i,
      /permission_granted remains false/i,
      /authorization_permission_granted remains false/i,
      /permission_review_approved remains false/i,
      /founder_permission_granted remains false/i,
      /founder_instruction_granted remains false/i,
      /execution_packet_authorized remains false/i,
      /execution_authorized remains false/i,
      /execution_allowed remains false/i,
      /source_promotion_allowed remains false/i,
      /promotion_execution_allowed remains false/i,
      /implementation_authorized remains false/i,
      /implementation_execution_allowed remains false/i,
      /controlled_storage_entry_allowed remains false/i,
      /storage_write_enabled remains false/i,
      /canonical_write_allowed remains false/i,
      /source_write_executed remains false/i,
      /actual_storage_write_executed remains false/i,
      /production_ready remains false/i,
      /production_launch_allowed remains false/i,
      /public_release_allowed remains false/i
    ].every((pattern) => pattern.test(text));
    return required && !hasUnsafeAuthority(text);
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function missingForState(config, state, hold = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(hold[field] || "").trim());
  }

  function idMatches(hold, packet, key) {
    return !hold[key] || !packet[key] || hold[key] === packet[key];
  }

  function controlledPermissionExecutionHold(config, decisionPacket, hold) {
    const state = hold.hold_state || "Draft hold";
    const missing = missingForState(config, state, hold);
    const blocked = [];

    if (!founderDecisionReady(decisionPacket)) {
      blocked.push("founder permission decision must be ready while permission, authorization, execution, storage, canonical, public release, and production flags remain false");
    }

    ["controlled_founder_permission_decision_gate_id", "controlled_authorization_permission_review_gate_id", "controlled_authorization_permission_preflight_id", "founder_authorization_instruction_gate_id", "controlled_authorization_review_gate_id", "controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(hold, decisionPacket, key)) blocked.push(key + " must match the founder decision packet");
    });

    const readyCandidate = state === "Hold ready for preflight";
    if (readyCandidate && !hasText(hold.hold_scope, [["hold"], ["founder decision signal"], ["permission execution authorization preflight"], ["not permission grant"], ["not authorization"], ["not execution"], ["cannot", "promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("hold scope must be hold-only and explicitly block permission grant, authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && hasUnsafeAuthority(hold.hold_language)) {
      blocked.push("hold language must not grant permission, approve authorization, or open execution");
    }
    if (readyCandidate && !hasText(hold.hold_language, [["hold result"], ["permission execution authorization preflight"], ["hold readiness only"], ["permission is not granted"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("hold language must move only to authorization preflight and state permission is not granted, authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(hold.hold_rationale, [["founder permission decision is ready"], ["source-locked"], ["execution hold signal"], ["authorization preflight"], ["does not open"], ["operational authority"]])) {
      blocked.push("hold rationale must keep the decision source-locked and separate hold readiness from authority");
    }
    if (readyCandidate && !hasText(hold.hold_evidence_summary, [["founder decision ready"], ["permission review"], ["permission preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["founder decision"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("hold evidence summary must keep source and review evidence visible");
    }
    if (readyCandidate && !hasText(hold.evidence_lock, [["controlled_founder_permission_decision_gate_id"], ["controlled_authorization_permission_review_gate_id"], ["controlled_authorization_permission_preflight_id"], ["founder_authorization_instruction_gate_id"], ["controlled_authorization_review_gate_id"], ["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("evidence lock must name founder decision, review, preflight, instruction gate, authorization review, authorization draft, source answer, source record, and source family");
    }
    if (readyCandidate && !keepsNonExecutionHoldBoundary(hold.non_execution_hold_clause)) {
      blocked.push("non-execution hold clause must keep the hold as non-permission and all grant, authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(hold.risk_acknowledgment, [["risk remains"], ["founder decision mismatch"], ["permission review mismatch"], ["preflight mismatch"], ["founder instruction mismatch"], ["review mismatch"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["hold language ambiguity"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on mismatches, rights changes, ambiguity, missing rollback/monitoring, packet/code changes, or true authority flags");
    }
    if (readyCandidate && !hasText(hold.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["founder decision audit"], ["hold audit"], ["permission execution authorization preflight"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, audits, preflight, and no source state write");
    }
    if (readyCandidate && !hasText(hold.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["permission execution authorization preflight"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and preflight");
    }
    if (readyCandidate && !hasText(hold.stop_condition, [["stop"], ["founder decision id mismatches"], ["permission review id mismatches"], ["preflight id mismatches"], ["founder instruction id mismatches"], ["review id mismatches"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["hold language is ambiguous"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on decision/review/preflight/instruction/source mismatches, rights changes, missing evidence, ambiguity, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(hold.expiry_check, [["expires"], ["material founder decision"], ["permission review"], ["preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["rollback"], ["monitoring"], ["packet"], ["code change"], ["rechecked"], ["not permission"], ["not authorization"], ["not execution"]])) {
      blocked.push("expiry check must state that controlled permission execution hold expires and is not permission, authorization, or execution");
    }
    if (readyCandidate && !keepsProductionBoundary(hold.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs hold clarification" && !hold.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to founder decision" && !hold.return_reason) blocked.push("return reason is required");
    if (state === "Permission hold blocked" && !hold.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !hold.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !hold.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Hold paused" && !hold.hold_reason) blocked.push("hold reason is required");
    if (state === "Hold expired" && !hold.hold_reason) blocked.push("hold reason is required when hold expires");

    const hold_status = missing.length
      ? "Blocked: required execution hold fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;
    const ready = hold_status === "Hold ready for preflight";

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_permission_execution_hold_id: hold.controlled_permission_execution_hold_id || "controlled-permission-execution-hold-" + Date.now(),
      hold_status,
      controlled_founder_permission_decision_gate_ready: decisionPacket.controlled_founder_permission_decision_gate_ready === true,
      founder_permission_decision_recorded: decisionPacket.founder_permission_decision_recorded === true,
      controlled_permission_execution_hold_candidate_ready: decisionPacket.controlled_permission_execution_hold_candidate_ready === true,
      controlled_permission_execution_hold_ready: ready,
      permission_execution_hold_recorded: ready,
      permission_execution_authorization_preflight_candidate_ready: ready,
      permission_granted: false,
      authorization_permission_granted: false,
      permission_review_approved: false,
      founder_permission_granted: false,
      execution_packet_authorized: false,
      execution_authorized: false,
      execution_allowed: false,
      founder_instruction_granted: false,
      source_promotion_allowed: false,
      promotion_execution_allowed: false,
      implementation_authorized: false,
      implementation_execution_allowed: false,
      controlled_storage_entry_allowed: false,
      storage_write_enabled: false,
      canonical_write_allowed: false,
      source_write_executed: false,
      actual_storage_write_executed: false,
      production_ready: false,
      production_launch_allowed: false,
      public_release_allowed: false,
      next_gate_required: config.boundary.next_gate_required,
      controlled_founder_permission_decision_gate_id: hold.controlled_founder_permission_decision_gate_id || decisionPacket.controlled_founder_permission_decision_gate_id || "",
      controlled_authorization_permission_review_gate_id: hold.controlled_authorization_permission_review_gate_id || decisionPacket.controlled_authorization_permission_review_gate_id || "",
      controlled_authorization_permission_preflight_id: hold.controlled_authorization_permission_preflight_id || decisionPacket.controlled_authorization_permission_preflight_id || "",
      founder_authorization_instruction_gate_id: hold.founder_authorization_instruction_gate_id || decisionPacket.founder_authorization_instruction_gate_id || "",
      controlled_authorization_review_gate_id: hold.controlled_authorization_review_gate_id || decisionPacket.controlled_authorization_review_gate_id || "",
      controlled_execution_packet_authorization_draft_id: hold.controlled_execution_packet_authorization_draft_id || decisionPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: hold.founder_authorization_decision_gate_id || decisionPacket.founder_authorization_decision_gate_id || "",
      source_answer_id: hold.source_answer_id || decisionPacket.source_answer_id || "",
      source_record_id: hold.source_record_id || decisionPacket.source_record_id || "",
      source_family: hold.source_family || decisionPacket.source_family || "",
      hold_actor: hold.hold_actor || "",
      holder_name: hold.holder_name || "",
      hold_scope: hold.hold_scope || "",
      hold_language: hold.hold_language || "",
      hold_rationale: hold.hold_rationale || "",
      hold_evidence_summary: hold.hold_evidence_summary || "",
      evidence_lock: hold.evidence_lock || "",
      non_execution_hold_clause: hold.non_execution_hold_clause || "",
      risk_acknowledgment: hold.risk_acknowledgment || "",
      rollback_condition: hold.rollback_condition || "",
      monitoring_condition: hold.monitoring_condition || "",
      stop_condition: hold.stop_condition || "",
      expiry_check: hold.expiry_check || "",
      production_boundary: hold.production_boundary || "",
      clarification_question: hold.clarification_question || "",
      return_reason: hold.return_reason || "",
      hold_reason: hold.hold_reason || "",
      block_reason: hold.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function executionHoldSnapshot(holds, config) {
    const byStatus = holds.reduce((counts, hold) => {
      const key = hold.hold_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_holds: holds.length,
      ready: byStatus["Hold ready for preflight"] || 0,
      blocked: holds.filter((hold) => String(hold.hold_status || "").startsWith("Blocked")).length,
      paused: byStatus["Hold paused"] || 0,
      expired: byStatus["Hold expired"] || 0,
      permission_granted: holds.filter((hold) => hold.permission_granted || hold.authorization_permission_granted || hold.permission_review_approved || hold.founder_permission_granted).length,
      execution_enabled: holds.filter((hold) => hold.execution_allowed || hold.execution_authorized || hold.execution_packet_authorized || hold.storage_write_enabled || hold.source_write_executed || hold.production_ready || hold.public_release_allowed).length
    };
  }

  function parseJson(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function card(label, value, tone = "") {
    return '<article class="execution-hold-card ' + safe(tone) + '"><span>' + safe(label) + '</span><strong>' + safe(value || "None") + '</strong></article>';
  }

  function renderResult(hold) {
    if (!resultCard) return;
    const issues = [...(hold.missing || []), ...(hold.blocked || [])];
    resultCard.dataset.state = hold.hold_status;
    resultCard.innerHTML = '<strong>' + safe(hold.hold_status) + '</strong>' +
      '<p class="muted">Hold ready: ' + safe(hold.controlled_permission_execution_hold_ready) + ' | Permission: ' + safe(hold.permission_granted) + ' | Execution: ' + safe(hold.execution_allowed) + '</p>' +
      '<div class="execution-hold-grid">' +
        card("Founder decision", hold.controlled_founder_permission_decision_gate_id, hold.controlled_permission_execution_hold_ready ? "ready" : "") +
        card("Source answer", hold.source_answer_id) +
        card("Next gate", hold.next_gate_required) +
        card("Production", hold.production_ready ? "open" : "false", hold.production_ready ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for permission execution authorization preflight. Permission, authorization, execution, storage write, canonical update, public release, and production launch remain false.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.hold_checks.map((check) =>
      '<article class="execution-hold-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Founder decision", config.source.controlled_founder_permission_decision_gate_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function readSaved() {
    const saved = parseJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(holds) {
    localStorage.setItem(storageKey, JSON.stringify(holds.slice(-20)));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const holds = readSaved();
    const snapshot = executionHoldSnapshot(holds, config);
    savedRoot.innerHTML = card("Saved", snapshot.saved_holds) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Permission granted", snapshot.permission_granted, snapshot.permission_granted ? "blocked" : "ready") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      holds.slice(-4).reverse().map((hold) =>
        '<article class="execution-hold-card ' + (hold.controlled_permission_execution_hold_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(hold.created_at) + '</span>' +
        '<strong>' + safe(hold.hold_status) + '</strong>' +
        '<span>' + safe(hold.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledPermissionExecutionHold = {
    controlledPermissionExecutionHold,
    executionHoldSnapshot,
    founderDecisionReady,
    hasUnsafeAuthority,
    keepsNonExecutionHoldBoundary
  };

  if (!root || !pageDocument) return;

  fetch("data/vedapath-controlled-permission-execution-hold.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        packet: pageDocument.getElementById("executionHoldDecisionPacket"),
        state: pageDocument.getElementById("executionHoldState"),
        actor: pageDocument.getElementById("executionHoldActor"),
        holder: pageDocument.getElementById("executionHoldName"),
        holdId: pageDocument.getElementById("executionHoldId"),
        founderDecisionId: pageDocument.getElementById("executionHoldFounderDecisionId"),
        permissionReviewId: pageDocument.getElementById("executionHoldPermissionReviewId"),
        preflightId: pageDocument.getElementById("executionHoldPreflightId"),
        instructionGateId: pageDocument.getElementById("executionHoldInstructionGateId"),
        reviewGateId: pageDocument.getElementById("executionHoldAuthorizationReviewGateId"),
        draftId: pageDocument.getElementById("executionHoldDraftId"),
        decisionGateId: pageDocument.getElementById("executionHoldPriorGateId"),
        sourceAnswer: pageDocument.getElementById("executionHoldSourceAnswer"),
        sourceRecord: pageDocument.getElementById("executionHoldSourceRecord"),
        sourceFamily: pageDocument.getElementById("executionHoldSourceFamily"),
        scope: pageDocument.getElementById("executionHoldScopeText"),
        language: pageDocument.getElementById("executionHoldLanguage"),
        rationale: pageDocument.getElementById("executionHoldRationale"),
        summary: pageDocument.getElementById("executionHoldSummary"),
        evidenceLock: pageDocument.getElementById("executionHoldEvidenceLock"),
        boundary: pageDocument.getElementById("executionHoldBoundary"),
        risk: pageDocument.getElementById("executionHoldRisk"),
        rollback: pageDocument.getElementById("executionHoldRollback"),
        monitoring: pageDocument.getElementById("executionHoldMonitoring"),
        stop: pageDocument.getElementById("executionHoldStopCondition"),
        expiry: pageDocument.getElementById("executionHoldExpiry"),
        production: pageDocument.getElementById("executionHoldProductionBoundary"),
        clarification: pageDocument.getElementById("executionHoldClarification"),
        returnReason: pageDocument.getElementById("executionHoldReturnReason"),
        holdReason: pageDocument.getElementById("executionHoldHoldReason"),
        blockReason: pageDocument.getElementById("executionHoldBlockReason")
      };

      fields.state.innerHTML = config.hold_states.map((state) => '<option>' + safe(state) + '</option>').join("");

      function setFields(sample = config.sample_hold) {
        fields.packet.value = JSON.stringify(config.sample_founder_decision_packet, null, 2);
        fields.state.value = sample.hold_state;
        fields.actor.value = sample.hold_actor;
        fields.holder.value = sample.holder_name;
        fields.holdId.value = sample.controlled_permission_execution_hold_id;
        fields.founderDecisionId.value = sample.controlled_founder_permission_decision_gate_id;
        fields.permissionReviewId.value = sample.controlled_authorization_permission_review_gate_id;
        fields.preflightId.value = sample.controlled_authorization_permission_preflight_id;
        fields.instructionGateId.value = sample.founder_authorization_instruction_gate_id;
        fields.reviewGateId.value = sample.controlled_authorization_review_gate_id;
        fields.draftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.scope.value = sample.hold_scope;
        fields.language.value = sample.hold_language;
        fields.rationale.value = sample.hold_rationale;
        fields.summary.value = sample.hold_evidence_summary;
        fields.evidenceLock.value = sample.evidence_lock;
        fields.boundary.value = sample.non_execution_hold_clause;
        fields.risk.value = sample.risk_acknowledgment;
        fields.rollback.value = sample.rollback_condition;
        fields.monitoring.value = sample.monitoring_condition;
        fields.stop.value = sample.stop_condition;
        fields.expiry.value = sample.expiry_check;
        fields.production.value = sample.production_boundary;
        fields.clarification.value = sample.clarification_question || "";
        fields.returnReason.value = sample.return_reason || "";
        fields.holdReason.value = sample.hold_reason || "";
        fields.blockReason.value = sample.block_reason || "";
      }

      function buildHold() {
        return {
          hold_state: fields.state.value,
          hold_actor: fields.actor.value,
          holder_name: fields.holder.value,
          controlled_permission_execution_hold_id: fields.holdId.value,
          controlled_founder_permission_decision_gate_id: fields.founderDecisionId.value,
          controlled_authorization_permission_review_gate_id: fields.permissionReviewId.value,
          controlled_authorization_permission_preflight_id: fields.preflightId.value,
          founder_authorization_instruction_gate_id: fields.instructionGateId.value,
          controlled_authorization_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_authorization_draft_id: fields.draftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          hold_scope: fields.scope.value,
          hold_language: fields.language.value,
          hold_rationale: fields.rationale.value,
          hold_evidence_summary: fields.summary.value,
          evidence_lock: fields.evidenceLock.value,
          non_execution_hold_clause: fields.boundary.value,
          risk_acknowledgment: fields.risk.value,
          rollback_condition: fields.rollback.value,
          monitoring_condition: fields.monitoring.value,
          stop_condition: fields.stop.value,
          expiry_check: fields.expiry.value,
          production_boundary: fields.production.value,
          clarification_question: fields.clarification.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.blockReason.value
        };
      }

      function run() {
        const packet = parseJson(fields.packet.value, {});
        const hold = controlledPermissionExecutionHold(config, packet, buildHold());
        renderResult(hold);
        if (output) output.value = JSON.stringify(hold, null, 2);
        return hold;
      }

      pageDocument.getElementById("runExecutionHold").addEventListener("click", run);
      pageDocument.getElementById("loadExecutionHoldSample").addEventListener("click", () => { setFields(); run(); });
      pageDocument.getElementById("saveExecutionHold").addEventListener("click", () => {
        const hold = run();
        const saved = readSaved();
        saved.push(hold);
        writeSaved(saved);
        renderSaved(config);
      });
      pageDocument.getElementById("clearExecutionHolds").addEventListener("click", () => {
        writeSaved([]);
        renderSaved(config);
      });
      pageDocument.getElementById("copyExecutionHold").addEventListener("click", () => {
        const hold = run();
        navigator.clipboard?.writeText(JSON.stringify(hold, null, 2));
      });

      renderChecks(config);
      renderScope(config);
      setFields();
      renderSaved(config);
      run();
    });
})();
`;

write("assets/vedapath-controlled-permission-execution-hold.js", js);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Permission Execution Hold</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-permission-execution-hold.css">
  </head>
  <body class="execution-hold-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Execution hold</span>
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
          <span class="version">${badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="VedaPath Controlled Permission Execution Hold workspace">
        <aside class="panel">
          <span class="eyebrow">Hold is not execution</span>
          <h2>Hold the decision. Run nothing.</h2>
          <p class="muted">This room holds founder decision language for a later preflight. It cannot grant permission, authorize, execute, store, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Decision</strong><p>Load founder signal.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Hold</strong><p>Freeze boundary.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Check</strong><p>Keep execution false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Preflight</strong><p>Prepare only.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="founderpermissiondecisiongate.html">Open Founder Decision</a>
            <a class="button safe" href="controlledauthorizationpermissionreviewgate.html">Open Permission Review</a>
          </div>
        </aside>

        <section class="panel execution-hold" id="controlledPermissionExecutionHold">
          <div class="execution-hold-head">
            <div>
              <span class="eyebrow">Controlled permission execution hold</span>
              <h1>Hold the decision. Execute nothing.</h1>
              <p class="muted">A ready hold here means the packet can move to permission execution authorization preflight. It still cannot grant permission, authorize execution, run code, promote sources, store data, update canonical records, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="execution-hold-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath execution hold mark"></div>
          </div>

          <section class="execution-hold-layout">
            <div class="execution-hold-form">
              <h2>Controlled Execution Hold</h2>
              <label>Founder decision packet<textarea id="executionHoldDecisionPacket"></textarea></label>
              <label>Hold state<select id="executionHoldState"></select></label>
              <label>Hold actor<input id="executionHoldActor" type="text" placeholder="Controlled execution hold reviewer"></label>
              <label>Holder name<input id="executionHoldName" type="text" placeholder="Holder sample"></label>
              <label>Execution hold id<input id="executionHoldId" type="text"></label>
              <label>Founder decision gate id<input id="executionHoldFounderDecisionId" type="text"></label>
              <label>Permission review gate id<input id="executionHoldPermissionReviewId" type="text"></label>
              <label>Permission preflight id<input id="executionHoldPreflightId" type="text"></label>
              <label>Founder instruction gate id<input id="executionHoldInstructionGateId" type="text"></label>
              <label>Authorization review gate id<input id="executionHoldAuthorizationReviewGateId" type="text"></label>
              <label>Authorization draft id<input id="executionHoldDraftId" type="text"></label>
              <label>Prior founder authorization decision id<input id="executionHoldPriorGateId" type="text"></label>
              <label>Source answer id<input id="executionHoldSourceAnswer" type="text"></label>
              <label>Source record id<input id="executionHoldSourceRecord" type="text"></label>
              <label>Source family<input id="executionHoldSourceFamily" type="text"></label>
              <label>Hold scope<textarea id="executionHoldScopeText"></textarea></label>
              <label>Hold language<textarea id="executionHoldLanguage"></textarea></label>
              <label>Hold rationale<textarea id="executionHoldRationale"></textarea></label>
              <label>Hold evidence summary<textarea id="executionHoldSummary"></textarea></label>
              <label>Evidence lock<textarea id="executionHoldEvidenceLock"></textarea></label>
              <label>Non-execution hold clause<textarea id="executionHoldBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="executionHoldRisk"></textarea></label>
              <label>Rollback condition<textarea id="executionHoldRollback"></textarea></label>
              <label>Monitoring condition<textarea id="executionHoldMonitoring"></textarea></label>
              <label>Stop condition<textarea id="executionHoldStopCondition"></textarea></label>
              <label>Expiry check<textarea id="executionHoldExpiry"></textarea></label>
              <label>Production boundary<textarea id="executionHoldProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="executionHoldClarification"></textarea></label>
              <label>Return reason<textarea id="executionHoldReturnReason"></textarea></label>
              <label>Hold reason<textarea id="executionHoldHoldReason"></textarea></label>
              <label>Block reason<textarea id="executionHoldBlockReason"></textarea></label>
              <div class="execution-hold-actions">
                <button class="button primary" id="runExecutionHold" type="button">Run Hold</button>
                <button class="button safe" id="loadExecutionHoldSample" type="button">Load Sample</button>
                <button class="button" id="saveExecutionHold" type="button">Save Local</button>
                <button class="button" id="clearExecutionHolds" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="execution-hold-result" id="executionHoldResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Hold Scope</h2>
                <div class="execution-hold-list" id="executionHoldScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Hold Checks</h2>
            <div class="execution-hold-rules" id="executionHoldChecks"></div>
          </section>

          <section class="execution-hold-layout">
            <div>
              <div class="execution-hold-actions">
                <button class="button safe" id="copyExecutionHold" type="button">Copy Hold Packet</button>
                <a class="button" href="data/vedapath-controlled-permission-execution-hold.json">Open JSON</a>
              </div>
              <textarea class="execution-hold-output" id="executionHoldOutput" aria-label="Controlled permission execution hold"></textarea>
            </div>
            <div>
              <h2>Saved Local Holds</h2>
              <div class="execution-hold-list" id="executionHoldSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Hold is not authority</span>
          <h2 style="margin-top: 14px;">Hold Ready, Execution False</h2>
          <p class="muted">The hold can prepare preflight while every operational path stays locked.</p>
          <div class="progress" aria-label="Execution hold progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>9</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Preflight</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Hold Boundary</h2>
            <p class="execution-hold-boundary">Hold signal only. Permission grant, authorization, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares permission execution authorization preflight. It does not authorize anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-permission-execution-hold.js"></script>
  </body>
</html>
`;

write("controlledpermissionexecutionhold.html", html);

const notes = `# VedaPath AI Controlled Permission Execution Hold

Release: ${release}

This room holds founder decision language after controlled founder permission decision readiness.

It can record:

- controlled_permission_execution_hold_ready
- permission_execution_hold_recorded
- permission_execution_authorization_preflight_candidate_ready

It cannot grant permission, approve authorization, execute code, perform storage writes, update canonical records, publish public release, launch production, create accounts, use secrets, or migrate data.

Next gate: ${nextGate}
`;

write("docs/CONTROLLED_PERMISSION_EXECUTION_HOLD.md", notes);

const readmeBlock = `## ${release} Controlled Permission Execution Hold

Controlled Permission Execution Hold holds founder decision language after founder permission decision readiness while keeping permission grant, authorization, execution, storage writes, canonical writes, public release, and production false.

- [Controlled Permission Execution Hold](controlledpermissionexecutionhold.html)
- [Controlled Permission Execution Hold Notes](docs/CONTROLLED_PERMISSION_EXECUTION_HOLD.md)
- [Controlled Permission Execution Hold Data](data/vedapath-controlled-permission-execution-hold.json)

`;

update("README.md", (content) => {
  if (content.includes(`## ${release} Controlled Permission Execution Hold`)) return content;
  return mustReplace(content, "## v3.2.3 Founder Permission Decision Gate", readmeBlock + "## v3.2.3 Founder Permission Decision Gate", "README insertion");
});

const prototypeBlock = `## ${release} Controlled Permission Execution Hold

The controlled permission execution hold is the next layer after founder permission decision readiness.

- It starts from a ready founder permission decision packet.
- It can record hold readiness only.
- It blocks permission grant, authorization, execution, storage writes, canonical writes, public release, and production.
- It moves only to permission execution authorization preflight.

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes(`## ${release} Controlled Permission Execution Hold`)) return content;
  return mustReplace(content, "## v3.2.3 Founder Permission Decision Gate", prototypeBlock + "## v3.2.3 Founder Permission Decision Gate", "prototype notes insertion");
});

const blueprintBlock = `### 307. Controlled Permission Execution Hold

Controlled Permission Execution Hold holds founder decision language after founder permission decision readiness.

It must:

- start from a founder permission decision ready object
- preserve founder decision, review, preflight, instruction gate, authorization review, authorization draft, source answer, source record, and source family ids
- make execution hold readiness visible
- block permission grant, actual authorization, execution, storage writes, canonical writes, public release, and production
- move only to permission execution authorization preflight

Controlled Permission Execution Hold should never claim permission grant, authorization approval, execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("### 307. Controlled Permission Execution Hold")) return content;
  return mustReplace(content, "### 306. Founder Permission Decision Gate", blueprintBlock + "### 306. Founder Permission Decision Gate", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.3 founder decision<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review, founder permission decision, controlled hold next, and production still closed.", "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review, founder permission decision, controlled execution hold, authorization preflight next, and production still closed.");
  if (!content.includes('href="controlledpermissionexecutionhold.html"')) {
    content = mustReplace(content, '<a href="founderpermissiondecisiongate.html">Founder decision <span>no-execute</span></a>', '<a href="founderpermissiondecisiongate.html">Founder decision <span>no-execute</span></a>\n              <a href="controlledpermissionexecutionhold.html">Execution hold <span>no-run</span></a>', "study map execution hold link");
    content = mustReplace(content, '<a href="founderpermissiondecisiongate.html">Founder decision <span>hold-only</span></a>', '<a href="founderpermissiondecisiongate.html">Founder decision <span>hold-only</span></a>\n              <a href="controlledpermissionexecutionhold.html">Execution hold <span>closed</span></a>', "build map execution hold link");
  }
  return content;
});

update("founderpermissiondecisiongate.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.3 founder decision<\/span>/g, `<span class="version">${badge}</span>`);
  if (!content.includes('href="controlledpermissionexecutionhold.html"')) {
    content = mustReplace(content, '<a class="button safe" href="controlledauthorizationpermissionpreflight.html">Open Preflight</a>', '<a class="button safe" href="controlledauthorizationpermissionpreflight.html">Open Preflight</a>\n            <a class="button" href="controlledpermissionexecutionhold.html">Open Execution Hold</a>', "founder execution hold link");
  }
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.3 founder decision<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("<strong>v3.2.3</strong>\n          <p>Founder Permission Decision Gate: founder decision language is now recorded while permission grant, authorization, execution, storage, public release, and production remain false.</p>", "<strong>v3.2.4</strong>\n          <p>Controlled Permission Execution Hold: founder decision language is now held for preflight while permission grant, authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace('<p>The trust loop now separates founder decision readiness from actual permission grant while every real write path remains closed.</p>', '<p>The trust loop now separates execution hold readiness from actual permission grant while every real write path remains closed.</p>');
  content = content.replace("<span>Next release</span>\n          <strong>Controlled permission execution hold</strong>\n          <p>Hold the founder decision behind one more no-execution gate.</p>", "<span>Next release</span>\n          <strong>Permission execution authorization preflight</strong>\n          <p>Test the hold for preflight readiness while execution stays false.</p>");
  if (!content.includes("Phase 288: Controlled Permission Execution Hold")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 288: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 288: Controlled Permission Execution Hold</strong>
                <p>Holds founder decision language after decision readiness while permission grant, authorization, execution, storage writes, canonical writes, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 289: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.2.3 Founder Permission Decision Gate</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.2.4 Controlled Permission Execution Hold</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.2.2 Controlled Authorization Permission Review Gate</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Record founder decision language without granting permission, authorization, or execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Hold founder decision language without granting permission, authorization, or execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for controlled permission execution hold</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for permission execution authorization preflight</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Build controlled permission execution hold.</span></li>\n              <li><span class="dot"></span><span>Keep founder decision behind a no-execution handoff.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate controlled hold readiness from any runnable operation.</span></li>', '<li><span class="dot"></span><span>Build permission execution authorization preflight.</span></li>\n              <li><span class="dot"></span><span>Test hold language before any authorization draft.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate preflight readiness from any runnable operation.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.2\.3 founder decision<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} controlled permission execution hold applied.`);

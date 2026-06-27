import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.2.3";
const badge = "v3.2.3 founder decision";
const previousRelease = "v3.2.2 Controlled Authorization Permission Review Gate";
const nextGate = "Controlled permission execution hold";
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

const reviewConfig = JSON.parse(read("data/vedapath-controlled-authorization-permission-review-gate.json"));
const review = reviewConfig.sample_review;

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

const samplePermissionReviewPacket = {
  schema_version: reviewConfig.schema_version,
  release: reviewConfig.release,
  controlled_authorization_permission_review_gate_id: review.controlled_authorization_permission_review_gate_id,
  review_status: "Permission review ready",
  controlled_authorization_permission_preflight_ready: true,
  permission_preflight_signal_recorded: true,
  permission_review_candidate_ready: true,
  controlled_authorization_permission_review_ready: true,
  permission_review_signal_recorded: true,
  founder_permission_decision_candidate_ready: true,
  ...falseAuthorityFlags,
  next_gate_required: "Founder permission decision gate",
  controlled_authorization_permission_preflight_id: review.controlled_authorization_permission_preflight_id,
  founder_authorization_instruction_gate_id: review.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: review.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: review.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: review.founder_authorization_decision_gate_id,
  source_answer_id: review.source_answer_id,
  source_record_id: review.source_record_id,
  source_family: review.source_family,
  review_actor: review.review_actor,
  reviewer_name: review.reviewer_name,
  review_scope: review.review_scope,
  permission_review_language: review.permission_review_language,
  review_rationale: review.review_rationale,
  review_evidence_summary: review.review_evidence_summary,
  source_lock: review.source_lock,
  non_permission_review_clause: review.non_permission_review_clause,
  risk_acknowledgment: review.risk_acknowledgment,
  rollback_condition: review.rollback_condition,
  monitoring_condition: review.monitoring_condition,
  stop_condition: review.stop_condition,
  expiry_check: review.expiry_check,
  production_boundary: review.production_boundary,
  created_at: generatedAt
};

const sampleDecision = {
  decision_state: "Decision ready for controlled hold",
  decision_actor: "Founder",
  founder_name: "Founder sample",
  controlled_founder_permission_decision_gate_id: "controlled-founder-permission-decision-gate-sample-steady-action-bg-2-48",
  controlled_authorization_permission_review_gate_id: review.controlled_authorization_permission_review_gate_id,
  controlled_authorization_permission_preflight_id: review.controlled_authorization_permission_preflight_id,
  founder_authorization_instruction_gate_id: review.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: review.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: review.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: review.founder_authorization_decision_gate_id,
  source_answer_id: review.source_answer_id,
  source_record_id: review.source_record_id,
  source_family: review.source_family,
  decision_scope: "Make a founder decision about whether this reviewed permission candidate may move to the next controlled permission execution hold only. This decision is not permission grant, not authorization, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  founder_decision_language: "Founder decision signal: move this reviewed permission candidate to the next controlled permission execution hold for later review. This is not permission grant, authorization is not granted, execution is not allowed, and no system may run from it.",
  decision_rationale: "The permission review is ready and source-locked. The founder decision signal only selects the next controlled hold for review; it does not open operational authority.",
  decision_evidence_summary: "Permission review ready; permission preflight, founder instruction, authorization review, authorization draft, founder decision history, source ids, source family, citation, rights, translation, reviewer evidence, source-owner scope, rollback, monitoring, stop condition, expiry, and production boundary remain visible.",
  evidence_lock: "Locked to controlled_authorization_permission_review_gate_id controlled-authorization-permission-review-gate-sample-steady-action-bg-2-48, controlled_authorization_permission_preflight_id controlled-authorization-permission-preflight-sample-steady-action-bg-2-48, founder_authorization_instruction_gate_id founder-authorization-instruction-gate-sample-steady-action-bg-2-48, controlled_authorization_review_gate_id controlled-authorization-review-gate-sample-steady-action-bg-2-48, controlled_execution_packet_authorization_draft_id controlled-execution-packet-authorization-draft-sample-steady-action-bg-2-48, founder_authorization_decision_gate_id founder-authorization-decision-gate-sample-steady-action-bg-2-48, source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti.",
  non_execution_decision_clause: "Controlled founder permission decision gate only; controlled_authorization_permission_review_ready may be true, permission_review_signal_recorded may be true, founder_permission_decision_candidate_ready may be true, controlled_founder_permission_decision_gate_ready may be true, founder_permission_decision_recorded may be true, controlled_permission_execution_hold_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
  risk_acknowledgment: "Risk remains: permission review mismatch, preflight mismatch, founder instruction mismatch, review mismatch, draft mismatch, source mismatch, rights change, reviewer change, founder language ambiguity, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, reviewer handoff, and founder decision audit must remain present before any controlled permission execution hold; no source state is written.",
  monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any controlled permission execution hold.",
  stop_condition: "Stop if permission review id mismatches, preflight id mismatches, founder instruction id mismatches, review id mismatches, draft id mismatches, source ids mismatch, rights change, reviewer evidence is missing, founder decision language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Founder permission decision expires at the next material permission review, preflight, founder instruction, authorization review, authorization draft, source, rights, reviewer, rollback, monitoring, packet, or code change and must be rechecked; not permission and not execution.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  next_gate: nextGate,
  clarification_question: "",
  return_reason: "",
  hold_reason: "",
  block_reason: ""
};

const config = {
  schema_version: "controlled-founder-permission-decision-gate-v1",
  release,
  generated_at: generatedAt,
  title: "Founder Permission Decision Gate",
  summary: "Records a founder decision signal after permission review readiness while keeping permission grant, authorization, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  source: {
    permission_review_release: reviewConfig.release,
    permission_review_schema: reviewConfig.schema_version,
    controlled_authorization_permission_review_gate_id: review.controlled_authorization_permission_review_gate_id,
    controlled_authorization_permission_preflight_id: review.controlled_authorization_permission_preflight_id,
    founder_authorization_instruction_gate_id: review.founder_authorization_instruction_gate_id,
    controlled_authorization_review_gate_id: review.controlled_authorization_review_gate_id,
    controlled_execution_packet_authorization_draft_id: review.controlled_execution_packet_authorization_draft_id,
    founder_authorization_decision_gate_id: review.founder_authorization_decision_gate_id,
    source_answer_id: review.source_answer_id,
    source_record_id: review.source_record_id,
    source_family: review.source_family
  },
  decision_states: [
    "Draft founder decision",
    "Needs founder clarification",
    "Decision ready for controlled hold",
    "Return to permission review",
    "Permission decision blocked",
    "Execution blocked",
    "Production forbidden",
    "Decision hold",
    "Decision expired"
  ],
  required_by_state: {
    "Draft founder decision": ["controlled_authorization_permission_review_gate_id", "source_answer_id", "decision_scope"],
    "Needs founder clarification": ["clarification_question", "founder_decision_language"],
    "Decision ready for controlled hold": [
      "decision_actor",
      "founder_name",
      "controlled_founder_permission_decision_gate_id",
      "controlled_authorization_permission_review_gate_id",
      "controlled_authorization_permission_preflight_id",
      "founder_authorization_instruction_gate_id",
      "controlled_authorization_review_gate_id",
      "controlled_execution_packet_authorization_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "decision_scope",
      "founder_decision_language",
      "decision_rationale",
      "decision_evidence_summary",
      "evidence_lock",
      "non_execution_decision_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to permission review": ["return_reason"],
    "Permission decision blocked": ["block_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Decision hold": ["hold_reason"],
    "Decision expired": ["expiry_check", "hold_reason"]
  },
  decision_checks: [
    { check: "Review ready", rule: "Starts only from a ready permission review whose next gate is founder permission decision." },
    { check: "Decision only", rule: "May record a founder decision signal, but cannot grant permission, authorization, or execution." },
    { check: "Evidence lock", rule: "Keeps review, preflight, instruction gate, review gate, authorization draft, source answer, source record, and family locked." },
    { check: "No operation", rule: "Execution, storage, canonical writes, public release, production, accounts, secrets, and migrations remain blocked." },
    { check: "Hold next", rule: "Moves only to a controlled permission execution hold, never to execution." },
    { check: "Expiry", rule: "Expires on review, preflight, instruction, source, rights, reviewer, rollback, monitoring, packet, or code change." }
  ],
  sample_permission_review_packet: samplePermissionReviewPacket,
  sample_decision: sampleDecision,
  boundary: {
    controlled_authorization_permission_review_ready: false,
    permission_review_signal_recorded: false,
    founder_permission_decision_candidate_ready: false,
    controlled_founder_permission_decision_gate_ready: false,
    founder_permission_decision_recorded: false,
    controlled_permission_execution_hold_candidate_ready: false,
    ...falseAuthorityFlags,
    next_gate_required: nextGate
  }
};

write("data/vedapath-founder-permission-decision-gate.json", JSON.stringify(config, null, 2) + "\n");

const css = `/* VedaPath founder permission decision gate */
body.founder-permission-page .topbar,
body.founder-permission-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.founder-permission-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.founder-permission-page .nav .link,
body.founder-permission-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.founder-permission-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.founder-permission-page main.workspace {
  grid-template-columns: minmax(210px, 0.72fr) minmax(0, 1.7fr) minmax(230px, 0.8fr);
  gap: 18px;
}

body.founder-permission-page main.workspace > aside.panel:first-child,
body.founder-permission-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.founder-permission,
.founder-permission-head,
.founder-permission-layout,
.founder-permission-form,
.founder-permission-grid,
.founder-permission-list,
.founder-permission-actions,
.founder-permission-rules {
  display: grid;
  gap: 10px;
}

.founder-permission { gap: 16px; }

.founder-permission-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.founder-permission-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.founder-permission-mark img {
  display: block;
  width: 100%;
}

.founder-permission-layout {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.founder-permission-form,
.founder-permission-card,
.founder-permission-result,
.founder-permission-output,
.founder-permission-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.founder-permission-form,
.founder-permission-card,
.founder-permission-result,
.founder-permission-rule {
  padding: 12px;
}

.founder-permission-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.founder-permission-form input,
.founder-permission-form select,
.founder-permission-form textarea,
.founder-permission-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.founder-permission-form textarea,
.founder-permission-output {
  min-height: 92px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.founder-permission-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.founder-permission-grid,
.founder-permission-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.founder-permission-card.ready,
.founder-permission-result[data-state="Decision ready for controlled hold"] {
  border-color: #b7d5ca;
  background: #f6fffb;
}

.founder-permission-card.blocked,
.founder-permission-result[data-state^="Blocked"] {
  border-color: #efb39a;
  background: #fff1ea;
}

.founder-permission-card span,
.founder-permission-rule span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.founder-permission-card strong,
.founder-permission-rule strong {
  display: block;
  margin-top: 4px;
}

.founder-permission-boundary {
  border-left: 4px solid var(--bhagwa);
  padding-left: 12px;
}

@media (max-width: 1050px) {
  body.founder-permission-page main.workspace,
  .founder-permission-layout,
  .founder-permission-grid,
  .founder-permission-rules {
    grid-template-columns: 1fr;
  }

  .founder-permission-head {
    grid-template-columns: 1fr;
  }

  .founder-permission-mark {
    max-width: 160px;
  }
}

@media (max-width: 760px) {
  body.founder-permission-page .nav {
    flex-wrap: wrap;
  }

  .founder-permission-actions {
    grid-template-columns: 1fr 1fr;
  }
}
`;

write("assets/vedapath-founder-permission-decision-gate.css", css);

const js = `(() => {
  const storageKey = "vedapath-founder-permission-decision-gate";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("founderPermissionDecisionGate") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("founderDecisionSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("founderDecisionResultCard") : null;
  const output = pageDocument ? pageDocument.getElementById("founderDecisionOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("founderDecisionChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("founderDecisionScope") : null;

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

  function permissionReviewReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-authorization-permission-review-gate-v1" &&
      packet.review_status === "Permission review ready" &&
      packet.controlled_authorization_permission_review_ready === true &&
      packet.permission_review_signal_recorded === true &&
      packet.founder_permission_decision_candidate_ready === true &&
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
      packet.next_gate_required === "Founder permission decision gate";
  }

  function hasUnsafeAuthority(value) {
    return /(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsNonExecutionDecisionBoundary(value) {
    const text = String(value || "");
    const required = [
      /controlled_authorization_permission_review_ready may be true/i,
      /permission_review_signal_recorded may be true/i,
      /founder_permission_decision_candidate_ready may be true/i,
      /controlled_founder_permission_decision_gate_ready may be true/i,
      /founder_permission_decision_recorded may be true/i,
      /controlled_permission_execution_hold_candidate_ready may be true/i,
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

  function missingForState(config, state, decision = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(decision[field] || "").trim());
  }

  function idMatches(decision, packet, key) {
    return !decision[key] || !packet[key] || decision[key] === packet[key];
  }

  function founderPermissionDecisionGate(config, reviewPacket, decision) {
    const state = decision.decision_state || "Draft founder decision";
    const missing = missingForState(config, state, decision);
    const blocked = [];

    if (!permissionReviewReady(reviewPacket)) {
      blocked.push("permission review must be ready while permission, authorization, execution, storage, canonical, public release, and production flags remain false");
    }

    ["controlled_authorization_permission_review_gate_id", "controlled_authorization_permission_preflight_id", "founder_authorization_instruction_gate_id", "controlled_authorization_review_gate_id", "controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(decision, reviewPacket, key)) blocked.push(key + " must match the permission review packet");
    });

    const readyCandidate = state === "Decision ready for controlled hold";
    if (readyCandidate && !hasText(decision.decision_scope, [["founder decision"], ["reviewed permission candidate"], ["controlled permission execution hold"], ["not permission grant"], ["not authorization"], ["not execution"], ["cannot", "promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("decision scope must be founder-decision only and explicitly block permission grant, authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && hasUnsafeAuthority(decision.founder_decision_language)) {
      blocked.push("founder decision language must not grant permission, approve authorization, or open execution");
    }
    if (readyCandidate && !hasText(decision.founder_decision_language, [["founder decision signal"], ["next controlled permission execution hold"], ["not permission grant"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("founder decision language must move only to a controlled hold and state permission grant is absent, authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(decision.decision_rationale, [["permission review is ready"], ["source-locked"], ["founder decision signal"], ["controlled hold"], ["does not open"], ["operational authority"]])) {
      blocked.push("decision rationale must keep the review source-locked and separate founder decision from authority");
    }
    if (readyCandidate && !hasText(decision.decision_evidence_summary, [["permission review ready"], ["permission preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["founder decision"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("decision evidence summary must keep source and review evidence visible");
    }
    if (readyCandidate && !hasText(decision.evidence_lock, [["controlled_authorization_permission_review_gate_id"], ["controlled_authorization_permission_preflight_id"], ["founder_authorization_instruction_gate_id"], ["controlled_authorization_review_gate_id"], ["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("evidence lock must name review, preflight, instruction gate, review gate, authorization draft, founder decision, source answer, source record, and source family");
    }
    if (readyCandidate && !keepsNonExecutionDecisionBoundary(decision.non_execution_decision_clause)) {
      blocked.push("non-execution decision clause must keep founder decision as non-permission and all grant, authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(decision.risk_acknowledgment, [["risk remains"], ["permission review mismatch"], ["preflight mismatch"], ["founder instruction mismatch"], ["review mismatch"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["founder language ambiguity"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on mismatches, rights changes, ambiguity, missing rollback/monitoring, packet/code changes, or true authority flags");
    }
    if (readyCandidate && !hasText(decision.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["founder decision audit"], ["controlled permission execution hold"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, founder decision audit, controlled hold, and no source state write");
    }
    if (readyCandidate && !hasText(decision.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["controlled permission execution hold"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and controlled hold");
    }
    if (readyCandidate && !hasText(decision.stop_condition, [["stop"], ["permission review id mismatches"], ["preflight id mismatches"], ["founder instruction id mismatches"], ["review id mismatches"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["founder decision language is ambiguous"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on review/preflight/instruction/source mismatches, rights changes, missing evidence, ambiguity, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(decision.expiry_check, [["expires"], ["material permission review"], ["preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["rollback"], ["monitoring"], ["packet"], ["code change"], ["rechecked"], ["not permission"], ["not execution"]])) {
      blocked.push("expiry check must state that founder permission decision expires and is not permission or execution");
    }
    if (readyCandidate && !keepsProductionBoundary(decision.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs founder clarification" && !decision.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to permission review" && !decision.return_reason) blocked.push("return reason is required");
    if (state === "Permission decision blocked" && !decision.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !decision.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !decision.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Decision hold" && !decision.hold_reason) blocked.push("hold reason is required");
    if (state === "Decision expired" && !decision.hold_reason) blocked.push("hold reason is required when decision expires");

    const decision_status = missing.length
      ? "Blocked: required founder decision fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;
    const ready = decision_status === "Decision ready for controlled hold";

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_founder_permission_decision_gate_id: decision.controlled_founder_permission_decision_gate_id || "controlled-founder-permission-decision-gate-" + Date.now(),
      decision_status,
      controlled_authorization_permission_review_ready: reviewPacket.controlled_authorization_permission_review_ready === true,
      permission_review_signal_recorded: reviewPacket.permission_review_signal_recorded === true,
      founder_permission_decision_candidate_ready: reviewPacket.founder_permission_decision_candidate_ready === true,
      controlled_founder_permission_decision_gate_ready: ready,
      founder_permission_decision_recorded: ready,
      controlled_permission_execution_hold_candidate_ready: ready,
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
      controlled_authorization_permission_review_gate_id: decision.controlled_authorization_permission_review_gate_id || reviewPacket.controlled_authorization_permission_review_gate_id || "",
      controlled_authorization_permission_preflight_id: decision.controlled_authorization_permission_preflight_id || reviewPacket.controlled_authorization_permission_preflight_id || "",
      founder_authorization_instruction_gate_id: decision.founder_authorization_instruction_gate_id || reviewPacket.founder_authorization_instruction_gate_id || "",
      controlled_authorization_review_gate_id: decision.controlled_authorization_review_gate_id || reviewPacket.controlled_authorization_review_gate_id || "",
      controlled_execution_packet_authorization_draft_id: decision.controlled_execution_packet_authorization_draft_id || reviewPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: decision.founder_authorization_decision_gate_id || reviewPacket.founder_authorization_decision_gate_id || "",
      source_answer_id: decision.source_answer_id || reviewPacket.source_answer_id || "",
      source_record_id: decision.source_record_id || reviewPacket.source_record_id || "",
      source_family: decision.source_family || reviewPacket.source_family || "",
      decision_actor: decision.decision_actor || "",
      founder_name: decision.founder_name || "",
      decision_scope: decision.decision_scope || "",
      founder_decision_language: decision.founder_decision_language || "",
      decision_rationale: decision.decision_rationale || "",
      decision_evidence_summary: decision.decision_evidence_summary || "",
      evidence_lock: decision.evidence_lock || "",
      non_execution_decision_clause: decision.non_execution_decision_clause || "",
      risk_acknowledgment: decision.risk_acknowledgment || "",
      rollback_condition: decision.rollback_condition || "",
      monitoring_condition: decision.monitoring_condition || "",
      stop_condition: decision.stop_condition || "",
      expiry_check: decision.expiry_check || "",
      production_boundary: decision.production_boundary || "",
      clarification_question: decision.clarification_question || "",
      return_reason: decision.return_reason || "",
      hold_reason: decision.hold_reason || "",
      block_reason: decision.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function founderDecisionSnapshot(decisions, config) {
    const byStatus = decisions.reduce((counts, decision) => {
      const key = decision.decision_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_decisions: decisions.length,
      ready: byStatus["Decision ready for controlled hold"] || 0,
      blocked: decisions.filter((decision) => String(decision.decision_status || "").startsWith("Blocked")).length,
      holds: byStatus["Decision hold"] || 0,
      expired: byStatus["Decision expired"] || 0,
      permission_granted: decisions.filter((decision) => decision.permission_granted || decision.authorization_permission_granted || decision.permission_review_approved || decision.founder_permission_granted).length,
      execution_enabled: decisions.filter((decision) => decision.execution_allowed || decision.execution_authorized || decision.execution_packet_authorized || decision.storage_write_enabled || decision.source_write_executed || decision.production_ready || decision.public_release_allowed).length
    };
  }

  function parseJson(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function card(label, value, tone = "") {
    return '<article class="founder-permission-card ' + safe(tone) + '"><span>' + safe(label) + '</span><strong>' + safe(value || "None") + '</strong></article>';
  }

  function renderResult(decision) {
    if (!resultCard) return;
    const issues = [...(decision.missing || []), ...(decision.blocked || [])];
    resultCard.dataset.state = decision.decision_status;
    resultCard.innerHTML = '<strong>' + safe(decision.decision_status) + '</strong>' +
      '<p class="muted">Decision ready: ' + safe(decision.controlled_founder_permission_decision_gate_ready) + ' | Permission: ' + safe(decision.permission_granted) + ' | Execution: ' + safe(decision.execution_allowed) + '</p>' +
      '<div class="founder-permission-grid">' +
        card("Review gate", decision.controlled_authorization_permission_review_gate_id, decision.controlled_founder_permission_decision_gate_ready ? "ready" : "") +
        card("Source answer", decision.source_answer_id) +
        card("Next gate", decision.next_gate_required) +
        card("Production", decision.production_ready ? "open" : "false", decision.production_ready ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for controlled permission execution hold. Permission, authorization, execution, storage write, canonical update, public release, and production launch remain false.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.decision_checks.map((check) =>
      '<article class="founder-permission-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Permission review", config.source.controlled_authorization_permission_review_gate_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function readSaved() {
    const saved = parseJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(decisions) {
    localStorage.setItem(storageKey, JSON.stringify(decisions.slice(-20)));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const decisions = readSaved();
    const snapshot = founderDecisionSnapshot(decisions, config);
    savedRoot.innerHTML = card("Saved", snapshot.saved_decisions) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Permission granted", snapshot.permission_granted, snapshot.permission_granted ? "blocked" : "ready") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      decisions.slice(-4).reverse().map((decision) =>
        '<article class="founder-permission-card ' + (decision.controlled_founder_permission_decision_gate_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(decision.created_at) + '</span>' +
        '<strong>' + safe(decision.decision_status) + '</strong>' +
        '<span>' + safe(decision.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathFounderPermissionDecisionGate = {
    founderPermissionDecisionGate,
    founderDecisionSnapshot,
    permissionReviewReady,
    hasUnsafeAuthority,
    keepsNonExecutionDecisionBoundary
  };

  if (!root || !pageDocument) return;

  fetch("data/vedapath-founder-permission-decision-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        packet: pageDocument.getElementById("founderDecisionReviewPacket"),
        state: pageDocument.getElementById("founderDecisionState"),
        actor: pageDocument.getElementById("founderDecisionActor"),
        founder: pageDocument.getElementById("founderDecisionName"),
        decisionId: pageDocument.getElementById("founderDecisionId"),
        permissionReviewId: pageDocument.getElementById("founderDecisionPermissionReviewId"),
        preflightId: pageDocument.getElementById("founderDecisionPreflightId"),
        instructionGateId: pageDocument.getElementById("founderDecisionInstructionGateId"),
        reviewGateId: pageDocument.getElementById("founderDecisionAuthorizationReviewGateId"),
        draftId: pageDocument.getElementById("founderDecisionDraftId"),
        decisionGateId: pageDocument.getElementById("founderDecisionPriorGateId"),
        sourceAnswer: pageDocument.getElementById("founderDecisionSourceAnswer"),
        sourceRecord: pageDocument.getElementById("founderDecisionSourceRecord"),
        sourceFamily: pageDocument.getElementById("founderDecisionSourceFamily"),
        scope: pageDocument.getElementById("founderDecisionScopeText"),
        language: pageDocument.getElementById("founderDecisionLanguage"),
        rationale: pageDocument.getElementById("founderDecisionRationale"),
        summary: pageDocument.getElementById("founderDecisionSummary"),
        evidenceLock: pageDocument.getElementById("founderDecisionEvidenceLock"),
        boundary: pageDocument.getElementById("founderDecisionBoundary"),
        risk: pageDocument.getElementById("founderDecisionRisk"),
        rollback: pageDocument.getElementById("founderDecisionRollback"),
        monitoring: pageDocument.getElementById("founderDecisionMonitoring"),
        stop: pageDocument.getElementById("founderDecisionStopCondition"),
        expiry: pageDocument.getElementById("founderDecisionExpiry"),
        production: pageDocument.getElementById("founderDecisionProductionBoundary"),
        clarification: pageDocument.getElementById("founderDecisionClarification"),
        returnReason: pageDocument.getElementById("founderDecisionReturnReason"),
        holdReason: pageDocument.getElementById("founderDecisionHoldReason"),
        blockReason: pageDocument.getElementById("founderDecisionBlockReason")
      };

      fields.state.innerHTML = config.decision_states.map((state) => '<option>' + safe(state) + '</option>').join("");

      function setFields(sample = config.sample_decision) {
        fields.packet.value = JSON.stringify(config.sample_permission_review_packet, null, 2);
        fields.state.value = sample.decision_state;
        fields.actor.value = sample.decision_actor;
        fields.founder.value = sample.founder_name;
        fields.decisionId.value = sample.controlled_founder_permission_decision_gate_id;
        fields.permissionReviewId.value = sample.controlled_authorization_permission_review_gate_id;
        fields.preflightId.value = sample.controlled_authorization_permission_preflight_id;
        fields.instructionGateId.value = sample.founder_authorization_instruction_gate_id;
        fields.reviewGateId.value = sample.controlled_authorization_review_gate_id;
        fields.draftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.scope.value = sample.decision_scope;
        fields.language.value = sample.founder_decision_language;
        fields.rationale.value = sample.decision_rationale;
        fields.summary.value = sample.decision_evidence_summary;
        fields.evidenceLock.value = sample.evidence_lock;
        fields.boundary.value = sample.non_execution_decision_clause;
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

      function buildDecision() {
        return {
          decision_state: fields.state.value,
          decision_actor: fields.actor.value,
          founder_name: fields.founder.value,
          controlled_founder_permission_decision_gate_id: fields.decisionId.value,
          controlled_authorization_permission_review_gate_id: fields.permissionReviewId.value,
          controlled_authorization_permission_preflight_id: fields.preflightId.value,
          founder_authorization_instruction_gate_id: fields.instructionGateId.value,
          controlled_authorization_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_authorization_draft_id: fields.draftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          decision_scope: fields.scope.value,
          founder_decision_language: fields.language.value,
          decision_rationale: fields.rationale.value,
          decision_evidence_summary: fields.summary.value,
          evidence_lock: fields.evidenceLock.value,
          non_execution_decision_clause: fields.boundary.value,
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
        const decision = founderPermissionDecisionGate(config, packet, buildDecision());
        renderResult(decision);
        if (output) output.value = JSON.stringify(decision, null, 2);
        return decision;
      }

      pageDocument.getElementById("runFounderDecision").addEventListener("click", run);
      pageDocument.getElementById("loadFounderDecisionSample").addEventListener("click", () => { setFields(); run(); });
      pageDocument.getElementById("saveFounderDecision").addEventListener("click", () => {
        const decision = run();
        const saved = readSaved();
        saved.push(decision);
        writeSaved(saved);
        renderSaved(config);
      });
      pageDocument.getElementById("clearFounderDecisions").addEventListener("click", () => {
        writeSaved([]);
        renderSaved(config);
      });
      pageDocument.getElementById("copyFounderDecision").addEventListener("click", () => {
        const decision = run();
        navigator.clipboard?.writeText(JSON.stringify(decision, null, 2));
      });

      renderChecks(config);
      renderScope(config);
      setFields();
      renderSaved(config);
      run();
    });
})();
`;

write("assets/vedapath-founder-permission-decision-gate.js", js);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Founder Permission Decision Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-founder-permission-decision-gate.css">
  </head>
  <body class="founder-permission-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Founder decision</span>
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

      <main class="workspace" aria-label="VedaPath Founder Permission Decision Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Decision is not execution</span>
          <h2>Founder chooses. System stays closed.</h2>
          <p class="muted">This room records founder decision language after permission review readiness. It cannot grant permission, authorize, execute, store, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Review</strong><p>Load ready packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Decide</strong><p>Record signal.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep execution false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Hold</strong><p>Prepare next.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledauthorizationpermissionreviewgate.html">Open Permission Review</a>
            <a class="button safe" href="controlledauthorizationpermissionpreflight.html">Open Preflight</a>
          </div>
        </aside>

        <section class="panel founder-permission" id="founderPermissionDecisionGate">
          <div class="founder-permission-head">
            <div>
              <span class="eyebrow">Founder permission decision gate</span>
              <h1>Record the decision. Execute nothing.</h1>
              <p class="muted">A ready decision here means the packet can move to a controlled permission execution hold. It still cannot grant permission, authorize execution, run code, promote sources, store data, update canonical records, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="founder-permission-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath founder decision mark"></div>
          </div>

          <section class="founder-permission-layout">
            <div class="founder-permission-form">
              <h2>Controlled Founder Decision</h2>
              <label>Permission review packet<textarea id="founderDecisionReviewPacket"></textarea></label>
              <label>Decision state<select id="founderDecisionState"></select></label>
              <label>Decision actor<input id="founderDecisionActor" type="text" placeholder="Founder"></label>
              <label>Founder name<input id="founderDecisionName" type="text" placeholder="Founder sample"></label>
              <label>Founder decision gate id<input id="founderDecisionId" type="text"></label>
              <label>Permission review gate id<input id="founderDecisionPermissionReviewId" type="text"></label>
              <label>Permission preflight id<input id="founderDecisionPreflightId" type="text"></label>
              <label>Founder instruction gate id<input id="founderDecisionInstructionGateId" type="text"></label>
              <label>Authorization review gate id<input id="founderDecisionAuthorizationReviewGateId" type="text"></label>
              <label>Authorization draft id<input id="founderDecisionDraftId" type="text"></label>
              <label>Prior founder authorization decision id<input id="founderDecisionPriorGateId" type="text"></label>
              <label>Source answer id<input id="founderDecisionSourceAnswer" type="text"></label>
              <label>Source record id<input id="founderDecisionSourceRecord" type="text"></label>
              <label>Source family<input id="founderDecisionSourceFamily" type="text"></label>
              <label>Decision scope<textarea id="founderDecisionScopeText"></textarea></label>
              <label>Founder decision language<textarea id="founderDecisionLanguage"></textarea></label>
              <label>Decision rationale<textarea id="founderDecisionRationale"></textarea></label>
              <label>Decision evidence summary<textarea id="founderDecisionSummary"></textarea></label>
              <label>Evidence lock<textarea id="founderDecisionEvidenceLock"></textarea></label>
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
              <label>Block reason<textarea id="founderDecisionBlockReason"></textarea></label>
              <div class="founder-permission-actions">
                <button class="button primary" id="runFounderDecision" type="button">Run Decision</button>
                <button class="button safe" id="loadFounderDecisionSample" type="button">Load Sample</button>
                <button class="button" id="saveFounderDecision" type="button">Save Local</button>
                <button class="button" id="clearFounderDecisions" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="founder-permission-result" id="founderDecisionResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Decision Scope</h2>
                <div class="founder-permission-list" id="founderDecisionScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Decision Checks</h2>
            <div class="founder-permission-rules" id="founderDecisionChecks"></div>
          </section>

          <section class="founder-permission-layout">
            <div>
              <div class="founder-permission-actions">
                <button class="button safe" id="copyFounderDecision" type="button">Copy Decision Packet</button>
                <a class="button" href="data/vedapath-founder-permission-decision-gate.json">Open JSON</a>
              </div>
              <textarea class="founder-permission-output" id="founderDecisionOutput" aria-label="Founder permission decision gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Decisions</h2>
              <div class="founder-permission-list" id="founderDecisionSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Decision is not grant</span>
          <h2 style="margin-top: 14px;">Founder Ready, Execution False</h2>
          <p class="muted">The founder decision can prepare a controlled hold while every operational path stays locked.</p>
          <div class="progress" aria-label="Founder decision gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>9</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Hold</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Decision Boundary</h2>
            <p class="founder-permission-boundary">Founder decision signal only. Permission grant, authorization, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a controlled permission execution hold. It does not authorize anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-founder-permission-decision-gate.js"></script>
  </body>
</html>
`;

write("founderpermissiondecisiongate.html", html);

const notes = `# VedaPath AI Founder Permission Decision Gate

Release: ${release}

This room records founder decision language after controlled permission review readiness.

It can record:

- controlled_founder_permission_decision_gate_ready
- founder_permission_decision_recorded
- controlled_permission_execution_hold_candidate_ready

It cannot grant permission, approve authorization, execute code, perform storage writes, update canonical records, publish public release, launch production, create accounts, use secrets, or migrate data.

Next gate: ${nextGate}
`;

write("docs/FOUNDER_PERMISSION_DECISION_GATE.md", notes);

const readmeBlock = `## ${release} Founder Permission Decision Gate

Founder Permission Decision Gate records founder decision language after permission review readiness while keeping permission grant, authorization, execution, storage writes, canonical writes, public release, and production false.

- [Founder Permission Decision Gate](founderpermissiondecisiongate.html)
- [Founder Permission Decision Gate Notes](docs/FOUNDER_PERMISSION_DECISION_GATE.md)
- [Founder Permission Decision Gate Data](data/vedapath-founder-permission-decision-gate.json)

`;

update("README.md", (content) => {
  if (content.includes(`## ${release} Founder Permission Decision Gate`)) return content;
  return mustReplace(content, "## v3.2.2 Controlled Authorization Permission Review Gate", readmeBlock + "## v3.2.2 Controlled Authorization Permission Review Gate", "README insertion");
});

const prototypeBlock = `## ${release} Founder Permission Decision Gate

The founder permission decision gate is the next layer after permission review readiness.

- It starts from a ready permission review packet.
- It can record founder decision readiness only.
- It blocks permission grant, authorization, execution, storage writes, canonical writes, public release, and production.
- It moves only to a controlled permission execution hold.

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes(`## ${release} Founder Permission Decision Gate`)) return content;
  return mustReplace(content, "## v3.2.2 Controlled Authorization Permission Review Gate", prototypeBlock + "## v3.2.2 Controlled Authorization Permission Review Gate", "prototype notes insertion");
});

const blueprintBlock = `### 306. Founder Permission Decision Gate

Founder Permission Decision Gate records founder decision language after permission review readiness.

It must:

- start from a permission review ready object
- preserve review, preflight, instruction gate, review gate, authorization draft, founder decision, source answer, source record, and source family ids
- make founder decision readiness visible
- block permission grant, actual authorization, execution, storage writes, canonical writes, public release, and production
- move only to a controlled permission execution hold

Founder Permission Decision Gate should never claim permission grant, authorization approval, execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("### 306. Founder Permission Decision Gate")) return content;
  return mustReplace(content, "### 305. Controlled Authorization Permission Review Gate", blueprintBlock + "### 305. Controlled Authorization Permission Review Gate", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.2 permission review<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review, founder decision next, and production still closed.", "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review, founder permission decision, controlled hold next, and production still closed.");
  if (!content.includes('href="founderpermissiondecisiongate.html"')) {
    content = mustReplace(content, '<a href="controlledauthorizationpermissionreviewgate.html">Permission review <span>no-grant</span></a>', '<a href="controlledauthorizationpermissionreviewgate.html">Permission review <span>no-grant</span></a>\n              <a href="founderpermissiondecisiongate.html">Founder decision <span>no-execute</span></a>', "study map founder decision link");
    content = mustReplace(content, '<a href="controlledauthorizationpermissionreviewgate.html">Permission review <span>no-approval</span></a>', '<a href="controlledauthorizationpermissionreviewgate.html">Permission review <span>no-approval</span></a>\n              <a href="founderpermissiondecisiongate.html">Founder decision <span>hold-only</span></a>', "build map founder decision link");
  }
  return content;
});

update("controlledauthorizationpermissionreviewgate.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.2 permission review<\/span>/g, `<span class="version">${badge}</span>`);
  if (!content.includes('href="founderpermissiondecisiongate.html"')) {
    content = mustReplace(content, '<a class="button safe" href="founderauthorizationinstructiongate.html">Open Founder Instruction</a>', '<a class="button safe" href="founderauthorizationinstructiongate.html">Open Founder Instruction</a>\n            <a class="button" href="founderpermissiondecisiongate.html">Open Founder Decision</a>', "review founder decision link");
  }
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.2 permission review<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("<strong>v3.2.2</strong>\n          <p>Controlled Authorization Permission Review Gate: permission-candidate language is now reviewed while permission grant, authorization, execution, storage, public release, and production remain false.</p>", "<strong>v3.2.3</strong>\n          <p>Founder Permission Decision Gate: founder decision language is now recorded while permission grant, authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace('<p>The trust loop now separates permission review readiness from permission grant while every real write path remains closed.</p>', '<p>The trust loop now separates founder decision readiness from actual permission grant while every real write path remains closed.</p>');
  content = content.replace("<span>Next release</span>\n          <strong>Founder permission decision gate</strong>\n          <p>Ask for founder decision while still blocking execution.</p>", "<span>Next release</span>\n          <strong>Controlled permission execution hold</strong>\n          <p>Hold the founder decision behind one more no-execution gate.</p>");
  if (!content.includes("Phase 287: Founder Permission Decision Gate")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 287: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 287: Founder Permission Decision Gate</strong>
                <p>Records founder decision language after permission review readiness while permission grant, authorization, execution, storage writes, canonical writes, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 288: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.2.2 Controlled Authorization Permission Review Gate</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.2.3 Founder Permission Decision Gate</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.2.1 Controlled Authorization Permission Preflight</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Review permission-candidate language without granting permission, authorization, or execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Record founder decision language without granting permission, authorization, or execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for founder permission decision gate</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled permission execution hold</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Build founder permission decision gate.</span></li>\n              <li><span class="dot"></span><span>Ask for founder decision after permission review readiness.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate founder decision from actual execution permission.</span></li>', '<li><span class="dot"></span><span>Build controlled permission execution hold.</span></li>\n              <li><span class="dot"></span><span>Keep founder decision behind a no-execution handoff.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate controlled hold readiness from any runnable operation.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.2\.2 permission review<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} founder permission decision gate applied.`);

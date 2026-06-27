import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.2.1";
const badge = "v3.2.1 permission preflight";
const previousRelease = "v3.2.0 Founder Authorization Instruction Gate";
const nextGate = "Controlled authorization permission review gate";
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

const instructionConfig = JSON.parse(read("data/vedapath-founder-authorization-instruction-gate.json"));
const sampleInstruction = instructionConfig.sample_instruction;

const falseAuthorityFlags = {
  permission_granted: false,
  authorization_permission_granted: false,
  permission_review_approved: false,
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

const sampleFounderInstructionSignal = {
  schema_version: instructionConfig.schema_version,
  release: instructionConfig.release,
  founder_authorization_instruction_gate_id: sampleInstruction.founder_authorization_instruction_gate_id,
  instruction_status: "Founder instruction ready",
  authorization_review_ready: true,
  controlled_authorization_review_gate_ready: true,
  founder_authorization_instruction_ready: true,
  founder_instruction_signal_recorded: true,
  controlled_founder_authorization_instruction_gate_ready: true,
  ...falseAuthorityFlags,
  next_gate_required: "Controlled authorization permission preflight",
  controlled_authorization_review_gate_id: sampleInstruction.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: sampleInstruction.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: sampleInstruction.founder_authorization_decision_gate_id,
  controlled_execution_authorization_hold_id: sampleInstruction.controlled_execution_authorization_hold_id,
  controlled_execution_review_gate_id: sampleInstruction.controlled_execution_review_gate_id,
  controlled_execution_packet_draft_id: sampleInstruction.controlled_execution_packet_draft_id,
  founder_execution_instruction_gate_id: sampleInstruction.founder_execution_instruction_gate_id,
  promotion_execution_preflight_id: sampleInstruction.promotion_execution_preflight_id,
  source_answer_id: sampleInstruction.source_answer_id,
  source_record_id: sampleInstruction.source_record_id,
  source_family: sampleInstruction.source_family,
  instruction_actor: sampleInstruction.instruction_actor,
  founder_name: sampleInstruction.founder_name,
  instruction_scope: sampleInstruction.instruction_scope,
  founder_instruction_text: sampleInstruction.founder_instruction_text,
  instruction_rationale: sampleInstruction.instruction_rationale,
  review_evidence_summary: sampleInstruction.review_evidence_summary,
  source_lock: sampleInstruction.source_lock,
  non_authority_clause: sampleInstruction.non_authority_clause,
  risk_acknowledgment: sampleInstruction.risk_acknowledgment,
  rollback_condition: sampleInstruction.rollback_condition,
  monitoring_condition: sampleInstruction.monitoring_condition,
  stop_condition: sampleInstruction.stop_condition,
  expiry_check: sampleInstruction.expiry_check,
  production_boundary: sampleInstruction.production_boundary,
  created_at: generatedAt
};

const preflightId = "controlled-authorization-permission-preflight-sample-steady-action-bg-2-48";

const samplePreflight = {
  preflight_state: "Preflight eligible",
  preflight_actor: "Controlled permission preflight reviewer",
  reviewer_name: "Reviewer sample",
  controlled_authorization_permission_preflight_id: preflightId,
  founder_authorization_instruction_gate_id: sampleInstruction.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: sampleInstruction.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: sampleInstruction.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: sampleInstruction.founder_authorization_decision_gate_id,
  controlled_execution_authorization_hold_id: sampleInstruction.controlled_execution_authorization_hold_id,
  controlled_execution_review_gate_id: sampleInstruction.controlled_execution_review_gate_id,
  controlled_execution_packet_draft_id: sampleInstruction.controlled_execution_packet_draft_id,
  source_answer_id: sampleInstruction.source_answer_id,
  source_record_id: sampleInstruction.source_record_id,
  source_family: sampleInstruction.source_family,
  preflight_scope: "Evaluate whether this founder instruction signal is complete enough for a controlled permission review only. This preflight is not permission, not authorization, and cannot execute, promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  permission_question: "Should a reviewer prepare controlled permission review language for this exact source packet, without granting permission, authorization, execution, storage writes, canonical writes, public release, or production?",
  eligibility_summary: "Founder instruction signal is ready, source ids are locked, review evidence is visible, rollback and monitoring remain present, and every real authority flag remains false.",
  evidence_lock: "Locked to founder_authorization_instruction_gate_id founder-authorization-instruction-gate-sample-steady-action-bg-2-48, controlled_authorization_review_gate_id controlled-authorization-review-gate-sample-steady-action-bg-2-48, controlled_execution_packet_authorization_draft_id controlled-execution-packet-authorization-draft-sample-steady-action-bg-2-48, founder_authorization_decision_gate_id founder-authorization-decision-gate-sample-steady-action-bg-2-48, source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti.",
  non_permission_clause: "Controlled authorization permission preflight only; founder_authorization_instruction_ready may be true, founder_instruction_signal_recorded may be true, controlled_founder_authorization_instruction_gate_ready may be true, controlled_authorization_permission_preflight_ready may be true, permission_preflight_signal_recorded may be true, permission_review_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
  risk_acknowledgment: "Risk remains: founder instruction mismatch, review mismatch, draft mismatch, source mismatch, rights change, reviewer change, permission wording ambiguity, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, and reviewer handoff must remain present before any controlled authorization permission review gate; no source state is written.",
  monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any controlled authorization permission review gate.",
  stop_condition: "Stop if founder instruction id mismatches, review id mismatches, draft id mismatches, source ids mismatch, rights change, reviewer evidence is missing, permission wording is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Permission preflight expires at the next material founder instruction, authorization review, authorization draft, source, rights, reviewer, founder decision, rollback, monitoring, packet draft, or code change and must be rechecked; not permission.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  next_gate: nextGate,
  clarification_question: "",
  return_reason: "",
  hold_reason: "",
  block_reason: ""
};

const config = {
  schema_version: "controlled-authorization-permission-preflight-v1",
  release,
  generated_at: generatedAt,
  title: "Controlled Authorization Permission Preflight",
  summary: "Checks whether founder instruction intent is eligible for controlled permission review while keeping permission, authorization, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  source: {
    founder_instruction_release: instructionConfig.release,
    founder_instruction_schema: instructionConfig.schema_version,
    founder_authorization_instruction_gate_id: sampleInstruction.founder_authorization_instruction_gate_id,
    controlled_authorization_review_gate_id: sampleInstruction.controlled_authorization_review_gate_id,
    controlled_execution_packet_authorization_draft_id: sampleInstruction.controlled_execution_packet_authorization_draft_id,
    founder_authorization_decision_gate_id: sampleInstruction.founder_authorization_decision_gate_id,
    source_answer_id: sampleInstruction.source_answer_id,
    source_record_id: sampleInstruction.source_record_id,
    source_family: sampleInstruction.source_family
  },
  preflight_states: [
    "Draft preflight",
    "Needs founder clarification",
    "Preflight eligible",
    "Return to instruction gate",
    "Permission still blocked",
    "Execution blocked",
    "Production forbidden",
    "Preflight hold",
    "Preflight expired"
  ],
  required_by_state: {
    "Draft preflight": ["founder_authorization_instruction_gate_id", "source_answer_id", "preflight_scope"],
    "Needs founder clarification": ["clarification_question", "permission_question"],
    "Preflight eligible": [
      "preflight_actor",
      "reviewer_name",
      "controlled_authorization_permission_preflight_id",
      "founder_authorization_instruction_gate_id",
      "controlled_authorization_review_gate_id",
      "controlled_execution_packet_authorization_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "preflight_scope",
      "permission_question",
      "eligibility_summary",
      "evidence_lock",
      "non_permission_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to instruction gate": ["return_reason"],
    "Permission still blocked": ["block_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Preflight hold": ["hold_reason"],
    "Preflight expired": ["expiry_check", "hold_reason"]
  },
  preflight_checks: [
    { check: "Instruction ready", rule: "Starts only from a ready founder instruction signal whose next gate is controlled authorization permission preflight." },
    { check: "Preflight only", rule: "May mark permission review candidate readiness, but cannot grant permission or authorization." },
    { check: "Evidence lock", rule: "Keeps instruction gate, review gate, authorization draft, founder decision, source answer, source record, and family locked." },
    { check: "No operation", rule: "Execution, storage, canonical writes, public release, production, accounts, secrets, and migrations remain blocked." },
    { check: "Review next", rule: "Moves only to a controlled permission review gate, never to execution." },
    { check: "Expiry", rule: "Expires on instruction, review, draft, source, rights, reviewer, rollback, monitoring, packet, or code change." }
  ],
  sample_founder_instruction_signal: sampleFounderInstructionSignal,
  sample_preflight: samplePreflight,
  boundary: {
    founder_authorization_instruction_ready: false,
    founder_instruction_signal_recorded: false,
    controlled_founder_authorization_instruction_gate_ready: false,
    controlled_authorization_permission_preflight_ready: false,
    permission_preflight_signal_recorded: false,
    permission_review_candidate_ready: false,
    ...falseAuthorityFlags,
    next_gate_required: nextGate
  }
};

write("data/vedapath-controlled-authorization-permission-preflight.json", JSON.stringify(config, null, 2) + "\n");

const css = `/* VedaPath controlled authorization permission preflight */
body.permission-preflight-page .topbar,
body.permission-preflight-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.permission-preflight-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.permission-preflight-page .nav .link,
body.permission-preflight-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.permission-preflight-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.permission-preflight-page main.workspace {
  grid-template-columns: minmax(210px, 0.72fr) minmax(0, 1.7fr) minmax(230px, 0.8fr);
  gap: 18px;
}

body.permission-preflight-page main.workspace > aside.panel:first-child,
body.permission-preflight-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.permission-preflight,
.permission-preflight-head,
.permission-preflight-layout,
.permission-preflight-form,
.permission-preflight-grid,
.permission-preflight-list,
.permission-preflight-actions,
.permission-preflight-rules {
  display: grid;
  gap: 10px;
}

.permission-preflight { gap: 16px; }

.permission-preflight-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.permission-preflight-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.permission-preflight-mark img {
  display: block;
  width: 100%;
}

.permission-preflight-layout {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.permission-preflight-form,
.permission-preflight-card,
.permission-preflight-result,
.permission-preflight-output,
.permission-preflight-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.permission-preflight-form,
.permission-preflight-card,
.permission-preflight-result,
.permission-preflight-rule {
  padding: 12px;
}

.permission-preflight-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.permission-preflight-form input,
.permission-preflight-form select,
.permission-preflight-form textarea,
.permission-preflight-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.permission-preflight-form textarea,
.permission-preflight-output {
  min-height: 92px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.permission-preflight-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.permission-preflight-grid,
.permission-preflight-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.permission-preflight-card.ready,
.permission-preflight-result[data-state="Preflight eligible"] {
  border-color: #b7d5ca;
  background: #f6fffb;
}

.permission-preflight-card.blocked,
.permission-preflight-result[data-state^="Blocked"] {
  border-color: #efb39a;
  background: #fff1ea;
}

.permission-preflight-card span,
.permission-preflight-rule span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.permission-preflight-card strong,
.permission-preflight-rule strong {
  display: block;
  margin-top: 4px;
}

.permission-preflight-boundary {
  border-left: 4px solid var(--bhagwa);
  padding-left: 12px;
}

@media (max-width: 1050px) {
  body.permission-preflight-page main.workspace,
  .permission-preflight-layout,
  .permission-preflight-grid,
  .permission-preflight-rules {
    grid-template-columns: 1fr;
  }

  .permission-preflight-head {
    grid-template-columns: 1fr;
  }

  .permission-preflight-mark {
    max-width: 160px;
  }
}

@media (max-width: 760px) {
  body.permission-preflight-page .nav {
    flex-wrap: wrap;
  }

  .permission-preflight-actions {
    grid-template-columns: 1fr 1fr;
  }
}
`;

write("assets/vedapath-controlled-authorization-permission-preflight.css", css);

const js = `(() => {
  const storageKey = "vedapath-controlled-authorization-permission-preflight";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("controlledAuthorizationPermissionPreflight") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("permissionPreflightSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("permissionPreflightResultCard") : null;
  const output = pageDocument ? pageDocument.getElementById("permissionPreflightOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("permissionPreflightChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("permissionPreflightScope") : null;

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

  function founderInstructionReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "founder-authorization-instruction-gate-v1" &&
      packet.instruction_status === "Founder instruction ready" &&
      packet.authorization_review_ready === true &&
      packet.controlled_authorization_review_gate_ready === true &&
      packet.founder_authorization_instruction_ready === true &&
      packet.founder_instruction_signal_recorded === true &&
      packet.controlled_founder_authorization_instruction_gate_ready === true &&
      packet.permission_granted !== true &&
      packet.authorization_permission_granted !== true &&
      packet.permission_review_approved !== true &&
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
      packet.next_gate_required === "Controlled authorization permission preflight";
  }

  function hasUnsafeAuthority(value) {
    return /(permission granted|permission approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsNonPermissionBoundary(value) {
    const text = String(value || "");
    const required = [
      /founder_authorization_instruction_ready may be true/i,
      /founder_instruction_signal_recorded may be true/i,
      /controlled_founder_authorization_instruction_gate_ready may be true/i,
      /controlled_authorization_permission_preflight_ready may be true/i,
      /permission_preflight_signal_recorded may be true/i,
      /permission_review_candidate_ready may be true/i,
      /permission_granted remains false/i,
      /authorization_permission_granted remains false/i,
      /permission_review_approved remains false/i,
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

  function preflightMissingForState(config, state, preflight = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(preflight[field] || "").trim());
  }

  function idMatches(preflight, packet, key) {
    return !preflight[key] || !packet[key] || preflight[key] === packet[key];
  }

  function controlledAuthorizationPermissionPreflight(config, founderInstructionPacket, preflight) {
    const state = preflight.preflight_state || "Draft preflight";
    const missing = preflightMissingForState(config, state, preflight);
    const blocked = [];

    if (!founderInstructionReady(founderInstructionPacket)) {
      blocked.push("founder instruction signal must be ready while permission, authorization, execution, storage, canonical, public release, and production flags remain false");
    }

    ["founder_authorization_instruction_gate_id", "controlled_authorization_review_gate_id", "controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(preflight, founderInstructionPacket, key)) blocked.push(key + " must match the founder instruction packet");
    });

    const eligibleCandidate = state === "Preflight eligible";
    if (eligibleCandidate && !hasText(preflight.preflight_scope, [["evaluate"], ["founder instruction signal"], ["controlled permission review"], ["not permission"], ["not authorization"], ["cannot", "execute"], ["promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("preflight scope must be permission-review only and explicitly block permission, authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (eligibleCandidate && hasUnsafeAuthority(preflight.permission_question)) {
      blocked.push("permission question must not grant permission, approve authorization, or open execution");
    }
    if (eligibleCandidate && !hasText(preflight.permission_question, [["controlled permission review"], ["exact source packet"], ["without granting permission"], ["authorization"], ["execution"], ["storage writes"], ["canonical writes"], ["public release"], ["production"]])) {
      blocked.push("permission question must ask for review language only and state that permission, authorization, execution, storage, canonical writes, public release, and production are not granted");
    }
    if (eligibleCandidate && !hasText(preflight.eligibility_summary, [["founder instruction signal"], ["source ids"], ["locked"], ["review evidence"], ["rollback"], ["monitoring"], ["authority flag"], ["false"]])) {
      blocked.push("eligibility summary must keep source ids, review evidence, rollback, monitoring, and false authority flags visible");
    }
    if (eligibleCandidate && !hasText(preflight.evidence_lock, [["founder_authorization_instruction_gate_id"], ["controlled_authorization_review_gate_id"], ["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("evidence lock must name instruction gate, review gate, authorization draft, founder decision, source answer, source record, and source family");
    }
    if (eligibleCandidate && !keepsNonPermissionBoundary(preflight.non_permission_clause)) {
      blocked.push("non-permission clause must keep preflight readiness as non-permission and all grant, authority, write, public release, and production flags false");
    }
    if (eligibleCandidate && !hasText(preflight.risk_acknowledgment, [["risk remains"], ["founder instruction mismatch"], ["review mismatch"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["permission wording ambiguity"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on mismatches, rights changes, ambiguity, missing rollback/monitoring, packet/code changes, or true authority flags");
    }
    if (eligibleCandidate && !hasText(preflight.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["controlled authorization permission review gate"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, next review gate, and no source state write");
    }
    if (eligibleCandidate && !hasText(preflight.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["controlled authorization permission review gate"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and next review gate");
    }
    if (eligibleCandidate && !hasText(preflight.stop_condition, [["stop"], ["founder instruction id mismatches"], ["review id mismatches"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["permission wording is ambiguous"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on instruction/review/source mismatches, rights changes, missing evidence, ambiguity, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (eligibleCandidate && !hasText(preflight.expiry_check, [["expires"], ["material founder instruction"], ["authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["founder decision"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not permission"]])) {
      blocked.push("expiry check must state that permission preflight expires and is not permission");
    }
    if (eligibleCandidate && !keepsProductionBoundary(preflight.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs founder clarification" && !preflight.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to instruction gate" && !preflight.return_reason) blocked.push("return reason is required");
    if (state === "Permission still blocked" && !preflight.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !preflight.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !preflight.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Preflight hold" && !preflight.hold_reason) blocked.push("hold reason is required");
    if (state === "Preflight expired" && !preflight.hold_reason) blocked.push("hold reason is required when preflight expires");

    const preflight_status = missing.length
      ? "Blocked: required permission preflight fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;
    const eligible = preflight_status === "Preflight eligible";

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_authorization_permission_preflight_id: preflight.controlled_authorization_permission_preflight_id || "controlled-authorization-permission-preflight-" + Date.now(),
      preflight_status,
      founder_authorization_instruction_ready: founderInstructionPacket.founder_authorization_instruction_ready === true,
      founder_instruction_signal_recorded: founderInstructionPacket.founder_instruction_signal_recorded === true,
      controlled_founder_authorization_instruction_gate_ready: founderInstructionPacket.controlled_founder_authorization_instruction_gate_ready === true,
      controlled_authorization_permission_preflight_ready: eligible,
      permission_preflight_signal_recorded: eligible,
      permission_review_candidate_ready: eligible,
      permission_granted: false,
      authorization_permission_granted: false,
      permission_review_approved: false,
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
      founder_authorization_instruction_gate_id: preflight.founder_authorization_instruction_gate_id || founderInstructionPacket.founder_authorization_instruction_gate_id || "",
      controlled_authorization_review_gate_id: preflight.controlled_authorization_review_gate_id || founderInstructionPacket.controlled_authorization_review_gate_id || "",
      controlled_execution_packet_authorization_draft_id: preflight.controlled_execution_packet_authorization_draft_id || founderInstructionPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: preflight.founder_authorization_decision_gate_id || founderInstructionPacket.founder_authorization_decision_gate_id || "",
      controlled_execution_authorization_hold_id: preflight.controlled_execution_authorization_hold_id || founderInstructionPacket.controlled_execution_authorization_hold_id || "",
      controlled_execution_review_gate_id: preflight.controlled_execution_review_gate_id || founderInstructionPacket.controlled_execution_review_gate_id || "",
      controlled_execution_packet_draft_id: preflight.controlled_execution_packet_draft_id || founderInstructionPacket.controlled_execution_packet_draft_id || "",
      source_answer_id: preflight.source_answer_id || founderInstructionPacket.source_answer_id || "",
      source_record_id: preflight.source_record_id || founderInstructionPacket.source_record_id || "",
      source_family: preflight.source_family || founderInstructionPacket.source_family || "",
      preflight_actor: preflight.preflight_actor || "",
      reviewer_name: preflight.reviewer_name || "",
      preflight_scope: preflight.preflight_scope || "",
      permission_question: preflight.permission_question || "",
      eligibility_summary: preflight.eligibility_summary || "",
      evidence_lock: preflight.evidence_lock || "",
      non_permission_clause: preflight.non_permission_clause || "",
      risk_acknowledgment: preflight.risk_acknowledgment || "",
      rollback_condition: preflight.rollback_condition || "",
      monitoring_condition: preflight.monitoring_condition || "",
      stop_condition: preflight.stop_condition || "",
      expiry_check: preflight.expiry_check || "",
      production_boundary: preflight.production_boundary || "",
      clarification_question: preflight.clarification_question || "",
      return_reason: preflight.return_reason || "",
      hold_reason: preflight.hold_reason || "",
      block_reason: preflight.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function permissionPreflightSnapshot(preflights, config) {
    const byStatus = preflights.reduce((counts, preflight) => {
      const key = preflight.preflight_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_preflights: preflights.length,
      eligible: byStatus["Preflight eligible"] || 0,
      blocked: preflights.filter((preflight) => String(preflight.preflight_status || "").startsWith("Blocked")).length,
      holds: byStatus["Preflight hold"] || 0,
      expired: byStatus["Preflight expired"] || 0,
      permission_granted: preflights.filter((preflight) => preflight.permission_granted || preflight.authorization_permission_granted || preflight.permission_review_approved).length,
      execution_enabled: preflights.filter((preflight) => preflight.execution_allowed || preflight.execution_authorized || preflight.execution_packet_authorized || preflight.storage_write_enabled || preflight.source_write_executed || preflight.production_ready || preflight.public_release_allowed).length
    };
  }

  function parseJson(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function card(label, value, tone = "") {
    return '<article class="permission-preflight-card ' + safe(tone) + '"><span>' + safe(label) + '</span><strong>' + safe(value || "None") + '</strong></article>';
  }

  function renderResult(preflight) {
    if (!resultCard) return;
    const issues = [...(preflight.missing || []), ...(preflight.blocked || [])];
    resultCard.dataset.state = preflight.preflight_status;
    resultCard.innerHTML = '<strong>' + safe(preflight.preflight_status) + '</strong>' +
      '<p class="muted">Preflight ready: ' + safe(preflight.controlled_authorization_permission_preflight_ready) + ' | Permission: ' + safe(preflight.permission_granted) + ' | Execution: ' + safe(preflight.execution_allowed) + '</p>' +
      '<div class="permission-preflight-grid">' +
        card("Instruction gate", preflight.founder_authorization_instruction_gate_id, preflight.controlled_authorization_permission_preflight_ready ? "ready" : "") +
        card("Source answer", preflight.source_answer_id) +
        card("Next gate", preflight.next_gate_required) +
        card("Production", preflight.production_ready ? "open" : "false", preflight.production_ready ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Eligible for controlled permission review. Permission, authorization, execution, storage write, canonical update, public release, and production launch remain false.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.preflight_checks.map((check) =>
      '<article class="permission-preflight-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Instruction gate", config.source.founder_authorization_instruction_gate_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function readSaved() {
    const saved = parseJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(preflights) {
    localStorage.setItem(storageKey, JSON.stringify(preflights.slice(-20)));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const preflights = readSaved();
    const snapshot = permissionPreflightSnapshot(preflights, config);
    savedRoot.innerHTML = card("Saved", snapshot.saved_preflights) +
      card("Eligible", snapshot.eligible, snapshot.eligible ? "ready" : "") +
      card("Permission granted", snapshot.permission_granted, snapshot.permission_granted ? "blocked" : "ready") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      preflights.slice(-4).reverse().map((preflight) =>
        '<article class="permission-preflight-card ' + (preflight.controlled_authorization_permission_preflight_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(preflight.created_at) + '</span>' +
        '<strong>' + safe(preflight.preflight_status) + '</strong>' +
        '<span>' + safe(preflight.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledAuthorizationPermissionPreflight = {
    controlledAuthorizationPermissionPreflight,
    permissionPreflightSnapshot,
    founderInstructionReady,
    hasUnsafeAuthority,
    keepsNonPermissionBoundary
  };

  if (!root || !pageDocument) return;

  fetch("data/vedapath-controlled-authorization-permission-preflight.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        packet: pageDocument.getElementById("permissionPreflightFounderInstruction"),
        state: pageDocument.getElementById("permissionPreflightState"),
        actor: pageDocument.getElementById("permissionPreflightActor"),
        reviewer: pageDocument.getElementById("permissionPreflightReviewer"),
        preflightId: pageDocument.getElementById("permissionPreflightId"),
        instructionGateId: pageDocument.getElementById("permissionPreflightInstructionGateId"),
        reviewGateId: pageDocument.getElementById("permissionPreflightReviewGateId"),
        draftId: pageDocument.getElementById("permissionPreflightDraftId"),
        decisionGateId: pageDocument.getElementById("permissionPreflightDecisionGateId"),
        sourceAnswer: pageDocument.getElementById("permissionPreflightSourceAnswer"),
        sourceRecord: pageDocument.getElementById("permissionPreflightSourceRecord"),
        sourceFamily: pageDocument.getElementById("permissionPreflightSourceFamily"),
        scope: pageDocument.getElementById("permissionPreflightScopeText"),
        question: pageDocument.getElementById("permissionPreflightQuestion"),
        summary: pageDocument.getElementById("permissionPreflightSummary"),
        evidence: pageDocument.getElementById("permissionPreflightEvidence"),
        boundary: pageDocument.getElementById("permissionPreflightBoundary"),
        risk: pageDocument.getElementById("permissionPreflightRisk"),
        rollback: pageDocument.getElementById("permissionPreflightRollback"),
        monitoring: pageDocument.getElementById("permissionPreflightMonitoring"),
        stop: pageDocument.getElementById("permissionPreflightStopCondition"),
        expiry: pageDocument.getElementById("permissionPreflightExpiry"),
        production: pageDocument.getElementById("permissionPreflightProductionBoundary"),
        clarification: pageDocument.getElementById("permissionPreflightQuestionForFounder"),
        returnReason: pageDocument.getElementById("permissionPreflightReturnReason"),
        holdReason: pageDocument.getElementById("permissionPreflightHoldReason"),
        blockReason: pageDocument.getElementById("permissionPreflightBlockReason")
      };

      fields.state.innerHTML = config.preflight_states.map((state) => '<option>' + safe(state) + '</option>').join("");

      function setFields(sample = config.sample_preflight) {
        fields.packet.value = JSON.stringify(config.sample_founder_instruction_signal, null, 2);
        fields.state.value = sample.preflight_state;
        fields.actor.value = sample.preflight_actor;
        fields.reviewer.value = sample.reviewer_name;
        fields.preflightId.value = sample.controlled_authorization_permission_preflight_id;
        fields.instructionGateId.value = sample.founder_authorization_instruction_gate_id;
        fields.reviewGateId.value = sample.controlled_authorization_review_gate_id;
        fields.draftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.scope.value = sample.preflight_scope;
        fields.question.value = sample.permission_question;
        fields.summary.value = sample.eligibility_summary;
        fields.evidence.value = sample.evidence_lock;
        fields.boundary.value = sample.non_permission_clause;
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

      function buildPreflight() {
        return {
          preflight_state: fields.state.value,
          preflight_actor: fields.actor.value,
          reviewer_name: fields.reviewer.value,
          controlled_authorization_permission_preflight_id: fields.preflightId.value,
          founder_authorization_instruction_gate_id: fields.instructionGateId.value,
          controlled_authorization_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_authorization_draft_id: fields.draftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          preflight_scope: fields.scope.value,
          permission_question: fields.question.value,
          eligibility_summary: fields.summary.value,
          evidence_lock: fields.evidence.value,
          non_permission_clause: fields.boundary.value,
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
        const preflight = controlledAuthorizationPermissionPreflight(config, packet, buildPreflight());
        renderResult(preflight);
        if (output) output.value = JSON.stringify(preflight, null, 2);
        return preflight;
      }

      pageDocument.getElementById("runPermissionPreflight").addEventListener("click", run);
      pageDocument.getElementById("loadPermissionPreflightSample").addEventListener("click", () => { setFields(); run(); });
      pageDocument.getElementById("savePermissionPreflight").addEventListener("click", () => {
        const preflight = run();
        const saved = readSaved();
        saved.push(preflight);
        writeSaved(saved);
        renderSaved(config);
      });
      pageDocument.getElementById("clearPermissionPreflights").addEventListener("click", () => {
        writeSaved([]);
        renderSaved(config);
      });
      pageDocument.getElementById("copyPermissionPreflight").addEventListener("click", () => {
        const preflight = run();
        navigator.clipboard?.writeText(JSON.stringify(preflight, null, 2));
      });

      renderChecks(config);
      renderScope(config);
      setFields();
      renderSaved(config);
      run();
    });
})();
`;

write("assets/vedapath-controlled-authorization-permission-preflight.js", js);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Authorization Permission Preflight</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-authorization-permission-preflight.css">
  </head>
  <body class="permission-preflight-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Permission preflight</span>
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

      <main class="workspace" aria-label="VedaPath Controlled Authorization Permission Preflight workspace">
        <aside class="panel">
          <span class="eyebrow">Preflight is not permission</span>
          <h2>Check eligibility. Grant nothing.</h2>
          <p class="muted">This room checks whether a founder instruction signal is complete enough for permission review. It cannot grant permission, authorize, execute, store, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Signal</strong><p>Load instruction.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Evidence</strong><p>Lock source.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep grant false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Review</strong><p>Prepare only.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="founderauthorizationinstructiongate.html">Open Founder Instruction</a>
            <a class="button safe" href="controlledauthorizationreviewgate.html">Open Review Gate</a>
          </div>
        </aside>

        <section class="panel permission-preflight" id="controlledAuthorizationPermissionPreflight">
          <div class="permission-preflight-head">
            <div>
              <span class="eyebrow">Permission preflight</span>
              <h1>Check permission readiness. Grant nothing.</h1>
              <p class="muted">A ready preflight here means the packet can move to controlled permission review. It still cannot grant permission, authorize execution, run code, promote sources, store data, update canonical records, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="permission-preflight-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath permission preflight mark"></div>
          </div>

          <section class="permission-preflight-layout">
            <div class="permission-preflight-form">
              <h2>Controlled Permission Preflight</h2>
              <label>Founder instruction packet<textarea id="permissionPreflightFounderInstruction"></textarea></label>
              <label>Preflight state<select id="permissionPreflightState"></select></label>
              <label>Preflight actor<input id="permissionPreflightActor" type="text" placeholder="Controlled permission preflight reviewer"></label>
              <label>Reviewer name<input id="permissionPreflightReviewer" type="text" placeholder="Reviewer sample"></label>
              <label>Permission preflight id<input id="permissionPreflightId" type="text"></label>
              <label>Founder instruction gate id<input id="permissionPreflightInstructionGateId" type="text"></label>
              <label>Authorization review gate id<input id="permissionPreflightReviewGateId" type="text"></label>
              <label>Authorization draft id<input id="permissionPreflightDraftId" type="text"></label>
              <label>Founder decision gate id<input id="permissionPreflightDecisionGateId" type="text"></label>
              <label>Source answer id<input id="permissionPreflightSourceAnswer" type="text"></label>
              <label>Source record id<input id="permissionPreflightSourceRecord" type="text"></label>
              <label>Source family<input id="permissionPreflightSourceFamily" type="text"></label>
              <label>Preflight scope<textarea id="permissionPreflightScopeText"></textarea></label>
              <label>Permission question<textarea id="permissionPreflightQuestion"></textarea></label>
              <label>Eligibility summary<textarea id="permissionPreflightSummary"></textarea></label>
              <label>Evidence lock<textarea id="permissionPreflightEvidence"></textarea></label>
              <label>Non-permission clause<textarea id="permissionPreflightBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="permissionPreflightRisk"></textarea></label>
              <label>Rollback condition<textarea id="permissionPreflightRollback"></textarea></label>
              <label>Monitoring condition<textarea id="permissionPreflightMonitoring"></textarea></label>
              <label>Stop condition<textarea id="permissionPreflightStopCondition"></textarea></label>
              <label>Expiry check<textarea id="permissionPreflightExpiry"></textarea></label>
              <label>Production boundary<textarea id="permissionPreflightProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="permissionPreflightQuestionForFounder"></textarea></label>
              <label>Return reason<textarea id="permissionPreflightReturnReason"></textarea></label>
              <label>Hold reason<textarea id="permissionPreflightHoldReason"></textarea></label>
              <label>Block reason<textarea id="permissionPreflightBlockReason"></textarea></label>
              <div class="permission-preflight-actions">
                <button class="button primary" id="runPermissionPreflight" type="button">Run Preflight</button>
                <button class="button safe" id="loadPermissionPreflightSample" type="button">Load Sample</button>
                <button class="button" id="savePermissionPreflight" type="button">Save Local</button>
                <button class="button" id="clearPermissionPreflights" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="permission-preflight-result" id="permissionPreflightResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Preflight Scope</h2>
                <div class="permission-preflight-list" id="permissionPreflightScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Preflight Checks</h2>
            <div class="permission-preflight-rules" id="permissionPreflightChecks"></div>
          </section>

          <section class="permission-preflight-layout">
            <div>
              <div class="permission-preflight-actions">
                <button class="button safe" id="copyPermissionPreflight" type="button">Copy Preflight Packet</button>
                <a class="button" href="data/vedapath-controlled-authorization-permission-preflight.json">Open JSON</a>
              </div>
              <textarea class="permission-preflight-output" id="permissionPreflightOutput" aria-label="Controlled authorization permission preflight"></textarea>
            </div>
            <div>
              <h2>Saved Local Preflights</h2>
              <div class="permission-preflight-list" id="permissionPreflightSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Candidate is not permission</span>
          <h2 style="margin-top: 14px;">Permission Candidate, Not Permission</h2>
          <p class="muted">The preflight can prepare a permission review while every operational path stays locked.</p>
          <div class="progress" aria-label="Permission preflight progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>9</strong></div>
            <div class="metric"><span>Permission</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Review</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Preflight Boundary</h2>
            <p class="permission-preflight-boundary">Permission candidate only. Permission grant, authorization, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a controlled authorization permission review gate. It does not authorize anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-authorization-permission-preflight.js"></script>
  </body>
</html>
`;

write("controlledauthorizationpermissionpreflight.html", html);

const notes = `# VedaPath AI Controlled Authorization Permission Preflight

Release: ${release}

This room checks whether the founder instruction signal is eligible for controlled permission review.

It can record:

- controlled_authorization_permission_preflight_ready
- permission_preflight_signal_recorded
- permission_review_candidate_ready

It cannot grant permission, authorization, execution, storage writes, canonical writes, public release, production launch, accounts, secrets, or migration authority.

Next gate: ${nextGate}
`;

write("docs/CONTROLLED_AUTHORIZATION_PERMISSION_PREFLIGHT.md", notes);

const readmeBlock = `## ${release} Controlled Authorization Permission Preflight

Controlled Authorization Permission Preflight checks whether founder instruction intent is eligible for controlled permission review while keeping permission, authorization, execution, storage writes, canonical writes, public release, and production false.

- [Controlled Authorization Permission Preflight](controlledauthorizationpermissionpreflight.html)
- [Controlled Authorization Permission Preflight Notes](docs/CONTROLLED_AUTHORIZATION_PERMISSION_PREFLIGHT.md)
- [Controlled Authorization Permission Preflight Data](data/vedapath-controlled-authorization-permission-preflight.json)

`;

update("README.md", (content) => {
  if (content.includes(`## ${release} Controlled Authorization Permission Preflight`)) return content;
  return mustReplace(content, "## v3.2.0 Founder Authorization Instruction Gate", readmeBlock + "## v3.2.0 Founder Authorization Instruction Gate", "README insertion");
});

const prototypeBlock = `## ${release} Controlled Authorization Permission Preflight

The controlled authorization permission preflight is the next eligibility layer after founder instruction readiness.

- It starts from a ready founder instruction signal.
- It can mark permission review candidate readiness only.
- It blocks permission grant, authorization, execution, storage writes, canonical writes, public release, and production.
- It moves only to a controlled permission review gate.

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes(`## ${release} Controlled Authorization Permission Preflight`)) return content;
  return mustReplace(content, "## v3.2.0 Founder Authorization Instruction Gate", prototypeBlock + "## v3.2.0 Founder Authorization Instruction Gate", "prototype notes insertion");
});

const blueprintBlock = `### 304. Controlled Authorization Permission Preflight

Controlled Authorization Permission Preflight checks whether founder instruction intent is eligible for controlled permission review.

It must:

- start from a founder instruction ready object
- preserve instruction gate, review gate, authorization draft, founder decision, source answer, source record, and source family ids
- make permission review candidate readiness visible
- block permission grant, actual authorization, execution, storage writes, canonical writes, public release, and production
- move only to a controlled authorization permission review gate

Controlled Authorization Permission Preflight should never claim permission approval, authorization approval, execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("### 304. Controlled Authorization Permission Preflight")) return content;
  return mustReplace(content, "### 303. Founder Authorization Instruction Gate", blueprintBlock + "### 303. Founder Authorization Instruction Gate", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.0 founder instruction<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight next, and production still closed.", "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review next, and production still closed.");
  if (!content.includes('href="controlledauthorizationpermissionpreflight.html"')) {
    content = mustReplace(content, '<a href="founderauthorizationinstructiongate.html">Founder instruction <span>signal</span></a>', '<a href="founderauthorizationinstructiongate.html">Founder instruction <span>signal</span></a>\n              <a href="controlledauthorizationpermissionpreflight.html">Permission preflight <span>eligibility</span></a>', "study map preflight link");
    content = mustReplace(content, '<a href="founderauthorizationinstructiongate.html">Founder instruction <span>no-grant</span></a>', '<a href="founderauthorizationinstructiongate.html">Founder instruction <span>no-grant</span></a>\n              <a href="controlledauthorizationpermissionpreflight.html">Permission preflight <span>no-grant</span></a>', "build map preflight link");
  }
  return content;
});

update("founderauthorizationinstructiongate.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.0 founder instruction<\/span>/g, `<span class="version">${badge}</span>`);
  if (!content.includes('href="controlledauthorizationpermissionpreflight.html"')) {
    content = mustReplace(content, '<a class="button safe" href="controlledexecutionpacketauthorizationdraft.html">Open Draft</a>', '<a class="button safe" href="controlledexecutionpacketauthorizationdraft.html">Open Draft</a>\n            <a class="button" href="controlledauthorizationpermissionpreflight.html">Open Permission Preflight</a>', "instruction preflight link");
  }
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.0 founder instruction<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("<strong>v3.2.0</strong>\n          <p>Founder Authorization Instruction Gate: founder instruction intent is now recorded while founder grant, authorization, execution, storage, public release, and production remain false.</p>", "<strong>v3.2.1</strong>\n          <p>Controlled Authorization Permission Preflight: founder instruction intent is now checked for permission-review eligibility while permission, authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace('<strong>99%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>\n          <p>The trust loop now records founder instruction intent separately from founder grant while every real write path remains closed.</p>', '<strong>99%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>\n          <p>The trust loop now separates permission-review eligibility from permission grant while every real write path remains closed.</p>');
  content = content.replace("<span>Next release</span>\n          <strong>Controlled authorization permission preflight</strong>\n          <p>Evaluate permission preflight while still blocking execution.</p>", "<span>Next release</span>\n          <strong>Controlled authorization permission review gate</strong>\n          <p>Review permission language while still blocking execution.</p>");
  if (!content.includes("Phase 285: Controlled Authorization Permission Preflight")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 285: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 285: Controlled Authorization Permission Preflight</strong>
                <p>Checks founder instruction intent for permission-review eligibility while permission grant, authorization, execution, storage writes, canonical writes, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 286: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.2.0 Founder Authorization Instruction Gate</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.2.1 Controlled Authorization Permission Preflight</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.1.9 Controlled Authorization Review Gate</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Record founder instruction intent without granting authorization or execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Check permission-review eligibility without granting permission, authorization, or execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for controlled authorization permission preflight</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled authorization permission review gate</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Build controlled authorization permission preflight.</span></li>\n              <li><span class="dot"></span><span>Compare founder instruction signal against review readiness.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate permission preflight from actual execution.</span></li>', '<li><span class="dot"></span><span>Build controlled authorization permission review gate.</span></li>\n              <li><span class="dot"></span><span>Compare permission candidate language against preflight readiness.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate permission review from actual permission grant.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.2\.0 founder instruction<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} controlled authorization permission preflight applied.`);

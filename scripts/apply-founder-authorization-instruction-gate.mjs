import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.2.0";
const badge = "v3.2.0 founder instruction";
const previousRelease = "v3.1.9 Controlled Authorization Review Gate";
const nextGate = "Controlled authorization permission preflight";
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

const reviewConfig = JSON.parse(read("data/vedapath-controlled-authorization-review-gate.json"));
const review = reviewConfig.sample_review;

const falseAuthorityFlags = {
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

const source = {
  authorization_review_release: reviewConfig.release,
  authorization_review_schema: reviewConfig.schema_version,
  controlled_authorization_review_gate_id: review.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: review.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: review.founder_authorization_decision_gate_id,
  controlled_execution_authorization_hold_id: review.controlled_execution_authorization_hold_id,
  controlled_execution_review_gate_id: review.controlled_execution_review_gate_id,
  controlled_execution_packet_draft_id: review.controlled_execution_packet_draft_id,
  source_answer_id: review.source_answer_id,
  source_record_id: review.source_record_id,
  source_family: review.source_family
};

const sampleAuthorizationReview = {
  schema_version: reviewConfig.schema_version,
  release: reviewConfig.release,
  controlled_authorization_review_gate_id: review.controlled_authorization_review_gate_id,
  review_status: "Authorization review ready",
  authorization_draft_ready: true,
  controlled_execution_packet_authorization_draft_ready: true,
  authorization_review_ready: true,
  controlled_authorization_review_gate_ready: true,
  ...falseAuthorityFlags,
  next_gate_required: "Founder authorization instruction gate",
  ...review,
  created_at: generatedAt
};

const sampleInstruction = {
  instruction_state: "Founder instruction ready",
  instruction_actor: "Founder authorization instruction reviewer",
  founder_name: "Founder sample",
  founder_authorization_instruction_gate_id: "founder-authorization-instruction-gate-sample-steady-action-bg-2-48",
  controlled_authorization_review_gate_id: review.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: review.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: review.founder_authorization_decision_gate_id,
  controlled_execution_authorization_hold_id: review.controlled_execution_authorization_hold_id,
  controlled_execution_review_gate_id: review.controlled_execution_review_gate_id,
  controlled_execution_packet_draft_id: review.controlled_execution_packet_draft_id,
  founder_execution_instruction_gate_id: review.founder_execution_instruction_gate_id,
  promotion_execution_preflight_id: review.promotion_execution_preflight_id,
  source_answer_id: review.source_answer_id,
  source_record_id: review.source_record_id,
  source_family: review.source_family,
  instruction_scope: "Record founder instruction intent for this exact reviewed authorization packet only. This instruction is not authorization and cannot execute, promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  founder_instruction_text: "Founder instruction signal: prepare the next controlled authorization permission preflight for this exact source packet. This is instruction readiness only; authorization is not granted, execution is not allowed, and no system may run from it.",
  instruction_rationale: "The authorization review is ready and source-locked. The founder instruction signal only asks for the next permission preflight to be drafted; it does not open any operational authority.",
  review_evidence_summary: "Authorization review ready; authorization draft, founder decision, hold, review gate, packet draft, source ids, source family, citation, rights, translation, reviewer evidence, source-owner scope, rollback, monitoring, stop condition, expiry, and production boundary remain visible.",
  source_lock: "Locked to controlled_authorization_review_gate_id controlled-authorization-review-gate-sample-steady-action-bg-2-48, controlled_execution_packet_authorization_draft_id controlled-execution-packet-authorization-draft-sample-steady-action-bg-2-48, founder_authorization_decision_gate_id founder-authorization-decision-gate-sample-steady-action-bg-2-48, source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti.",
  non_authority_clause: "Founder authorization instruction gate only; authorization_review_ready may be true, controlled_authorization_review_gate_ready may be true, founder_authorization_instruction_ready may be true, founder_instruction_signal_recorded may be true, controlled_founder_authorization_instruction_gate_ready may be true, but founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
  risk_acknowledgment: "Risk remains: review mismatch, draft mismatch, source mismatch, rights change, reviewer change, founder instruction ambiguity, rollback missing, monitoring missing, packet mutation, code change, or any true founder grant, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, and reviewer handoff must remain present before any controlled authorization permission preflight; no source state is written.",
  monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any controlled authorization permission preflight.",
  stop_condition: "Stop if review id mismatches, draft id mismatches, source ids mismatch, rights change, reviewer evidence is missing, founder instruction is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any founder grant, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Founder authorization instruction expires at the next material authorization review, authorization draft, source, rights, reviewer, founder decision, rollback, monitoring, packet draft, or code change and must be rechecked; not approval.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  next_gate: nextGate,
  clarification_question: "",
  return_reason: "",
  hold_reason: "",
  block_reason: ""
};

const config = {
  schema_version: "founder-authorization-instruction-gate-v1",
  release,
  generated_at: generatedAt,
  title: "Founder Authorization Instruction Gate",
  summary: "Records founder instruction intent after authorization review readiness while keeping founder grant, authorization, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  source,
  instruction_states: [
    "Draft instruction",
    "Needs founder clarification",
    "Founder instruction ready",
    "Return to authorization review",
    "Instruction hold",
    "Authorization still blocked",
    "Execution blocked",
    "Production forbidden",
    "Instruction expired"
  ],
  required_by_state: {
    "Draft instruction": [
      "controlled_authorization_review_gate_id",
      "source_answer_id",
      "instruction_scope"
    ],
    "Needs founder clarification": [
      "clarification_question",
      "founder_instruction_text"
    ],
    "Founder instruction ready": [
      "instruction_actor",
      "founder_name",
      "founder_authorization_instruction_gate_id",
      "controlled_authorization_review_gate_id",
      "controlled_execution_packet_authorization_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "instruction_scope",
      "founder_instruction_text",
      "instruction_rationale",
      "review_evidence_summary",
      "source_lock",
      "non_authority_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to authorization review": ["return_reason"],
    "Instruction hold": ["hold_reason"],
    "Authorization still blocked": ["block_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Instruction expired": ["expiry_check", "hold_reason"]
  },
  instruction_checks: [
    {
      check: "Review ready",
      rule: "The instruction gate can start only from a ready authorization review object whose next gate is founder authorization instruction gate."
    },
    {
      check: "Instruction only",
      rule: "Founder instruction readiness can be recorded, but founder grant and authorization remain false."
    },
    {
      check: "Source lock intact",
      rule: "The same review gate, authorization draft, founder decision, source answer, source record, and source family must stay locked."
    },
    {
      check: "No operational authority",
      rule: "Execution, storage, canonical writes, public release, production, accounts, secrets, and migrations remain blocked."
    },
    {
      check: "Permission preflight next",
      rule: "The next step is a controlled permission preflight, not a runnable instruction."
    },
    {
      check: "Expiry",
      rule: "The instruction expires on review, draft, source, rights, reviewer, rollback, monitoring, packet, or code change."
    }
  ],
  sample_authorization_review: sampleAuthorizationReview,
  sample_instruction: sampleInstruction,
  boundary: {
    authorization_review_ready: false,
    controlled_authorization_review_gate_ready: false,
    founder_authorization_instruction_ready: false,
    founder_instruction_signal_recorded: false,
    controlled_founder_authorization_instruction_gate_ready: false,
    ...falseAuthorityFlags,
    next_gate_required: nextGate
  }
};

write("data/vedapath-founder-authorization-instruction-gate.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-founder-authorization-instruction-gate.css", `/* VedaPath founder authorization instruction gate */
body.auth-instruction-page .topbar,
body.auth-instruction-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.auth-instruction-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.auth-instruction-page .nav .link,
body.auth-instruction-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.auth-instruction-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.auth-instruction-page main.workspace {
  grid-template-columns: minmax(210px, 0.72fr) minmax(0, 1.7fr) minmax(230px, 0.8fr);
  gap: 18px;
}

body.auth-instruction-page main.workspace > aside.panel:first-child,
body.auth-instruction-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.auth-instruction,
.auth-instruction-head,
.auth-instruction-layout,
.auth-instruction-form,
.auth-instruction-grid,
.auth-instruction-list,
.auth-instruction-actions,
.auth-instruction-rules {
  display: grid;
  gap: 10px;
}

.auth-instruction { gap: 16px; }

.auth-instruction-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.auth-instruction-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.auth-instruction-mark img {
  display: block;
  width: 100%;
}

.auth-instruction-layout {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.auth-instruction-form,
.auth-instruction-card,
.auth-instruction-result,
.auth-instruction-output,
.auth-instruction-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.auth-instruction-form,
.auth-instruction-card,
.auth-instruction-result,
.auth-instruction-rule {
  padding: 12px;
}

.auth-instruction-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.auth-instruction-form input,
.auth-instruction-form select,
.auth-instruction-form textarea,
.auth-instruction-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.auth-instruction-form textarea,
.auth-instruction-output {
  min-height: 96px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.auth-instruction-grid,
.auth-instruction-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.auth-instruction-card,
.auth-instruction-result {
  border-left: 4px solid var(--gold);
}

.auth-instruction-card.ready,
.auth-instruction-result[data-state="Founder instruction ready"] {
  border-left-color: var(--green);
}

.auth-instruction-card.blocked,
.auth-instruction-result[data-state^="Blocked"],
.auth-instruction-result[data-state="Return to authorization review"],
.auth-instruction-result[data-state="Instruction hold"],
.auth-instruction-result[data-state="Authorization still blocked"],
.auth-instruction-result[data-state="Execution blocked"],
.auth-instruction-result[data-state="Production forbidden"],
.auth-instruction-result[data-state="Instruction expired"] {
  border-left-color: var(--ochre);
}

.auth-instruction-card span,
.auth-instruction-card strong,
.auth-instruction-rule span,
.auth-instruction-rule strong {
  display: block;
}

.auth-instruction-card strong {
  font-size: 18px;
  line-height: 1.18;
  overflow-wrap: anywhere;
}

.auth-instruction-card span,
.auth-instruction-rule span {
  color: var(--muted);
  font-size: 12px;
}

.auth-instruction-result strong {
  display: block;
  font-size: 24px;
}

.auth-instruction-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.auth-instruction-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.auth-instruction-list {
  max-height: 320px;
  overflow: auto;
}

.auth-instruction-output {
  min-height: 260px;
}

.auth-instruction-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  body.auth-instruction-page .topbar,
  body.auth-instruction-page header.topbar {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 12px 0 !important;
  }

  body.auth-instruction-page .nav {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  body.auth-instruction-page main.workspace {
    grid-template-columns: 1fr;
  }

  body.auth-instruction-page main.workspace > section.auth-instruction {
    order: 1;
  }

  body.auth-instruction-page main.workspace > aside.panel:first-child {
    order: 2;
  }

  body.auth-instruction-page main.workspace > aside.panel.tight {
    order: 3;
  }

  .auth-instruction-layout,
  .auth-instruction-head,
  .auth-instruction-grid,
  .auth-instruction-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .auth-instruction-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-founder-authorization-instruction-gate.js", `(() => {
  const storageKey = "vedapath-founder-authorization-instruction-gate";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("founderAuthorizationInstructionGate") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("authInstructionSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("authInstructionResultCard") : null;
  const instructionOutput = pageDocument ? pageDocument.getElementById("authInstructionOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("authInstructionChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("authInstructionScope") : null;

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

  function authorizationReviewReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-authorization-review-gate-v1" &&
      packet.review_status === "Authorization review ready" &&
      packet.authorization_review_ready === true &&
      packet.controlled_authorization_review_gate_ready === true &&
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
      packet.next_gate_required === "Founder authorization instruction gate";
  }

  function hasUnsafeAuthority(value) {
    return /(authorization granted|authorization approved|approval granted|permission granted|founder grant|grant execution|authorize now|execution approved|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsInstructionBoundary(value) {
    const text = String(value || "");
    const required = [
      /authorization_review_ready may be true/i,
      /controlled_authorization_review_gate_ready may be true/i,
      /founder_authorization_instruction_ready may be true/i,
      /founder_instruction_signal_recorded may be true/i,
      /controlled_founder_authorization_instruction_gate_ready may be true/i,
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

  function instructionMissingForState(config, state, instruction = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(instruction[field] || "").trim());
  }

  function idMatches(instruction, packet, key) {
    return !instruction[key] || !packet[key] || instruction[key] === packet[key];
  }

  function founderAuthorizationInstructionGate(config, authorizationReviewPacket, instruction) {
    const state = instruction.instruction_state || "Draft instruction";
    const missing = instructionMissingForState(config, state, instruction);
    const blocked = [];

    if (!authorizationReviewReady(authorizationReviewPacket)) {
      blocked.push("authorization review must be ready while founder grant, authorization, execution, storage, canonical, public release, and production flags remain false");
    }
    ["controlled_authorization_review_gate_id", "controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "controlled_execution_authorization_hold_id", "controlled_execution_review_gate_id", "controlled_execution_packet_draft_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(instruction, authorizationReviewPacket, key)) blocked.push(key + " must match the authorization review packet");
    });

    const readyCandidate = state === "Founder instruction ready";
    if (readyCandidate && !hasText(instruction.instruction_scope, [["record founder instruction intent"], ["exact reviewed authorization packet"], ["not authorization"], ["cannot", "execute"], ["promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("instruction scope must be exact-review only and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && hasUnsafeAuthority(instruction.founder_instruction_text)) {
      blocked.push("founder instruction text must not grant authorization, approve execution, or open production");
    }
    if (readyCandidate && !hasText(instruction.founder_instruction_text, [["founder instruction signal"], ["controlled authorization permission preflight"], ["instruction readiness only"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("founder instruction text must prepare permission preflight only and state authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(instruction.instruction_rationale, [["authorization review is ready"], ["source-locked"], ["founder instruction signal"], ["permission preflight"], ["does not open"], ["operational authority"]])) {
      blocked.push("instruction rationale must keep the review source-locked and separate intent from authority");
    }
    if (readyCandidate && !hasText(instruction.review_evidence_summary, [["authorization review ready"], ["authorization draft"], ["founder decision"], ["hold"], ["review gate"], ["packet draft"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("review evidence summary must keep source and review evidence visible");
    }
    if (readyCandidate && !hasText(instruction.source_lock, [["controlled_authorization_review_gate_id"], ["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("source lock must name the authorization review, authorization draft, founder decision, source answer, source record, and source family");
    }
    if (readyCandidate && !keepsInstructionBoundary(instruction.non_authority_clause)) {
      blocked.push("non-authority clause must keep instruction readiness as non-authority and all grant, authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(instruction.risk_acknowledgment, [["risk remains"], ["review mismatch"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["founder instruction ambiguity"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["founder grant"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on review, draft, source, rights, reviewer, ambiguity, rollback, monitoring, packet, code, or true authority flags");
    }
    if (readyCandidate && !hasText(instruction.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["controlled authorization permission preflight"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, next preflight, and no source state write");
    }
    if (readyCandidate && !hasText(instruction.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["controlled authorization permission preflight"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and next preflight");
    }
    if (readyCandidate && !hasText(instruction.stop_condition, [["stop"], ["review id mismatches"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["founder instruction is ambiguous"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["founder grant"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on review/source mismatches, rights changes, missing evidence, ambiguity, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(instruction.expiry_check, [["expires"], ["material authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["founder decision"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not approval"]])) {
      blocked.push("expiry check must state that founder authorization instruction expires and is not approval");
    }
    if (readyCandidate && !keepsProductionBoundary(instruction.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs founder clarification" && !instruction.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to authorization review" && !instruction.return_reason) blocked.push("return reason is required");
    if (state === "Instruction hold" && !instruction.hold_reason) blocked.push("hold reason is required");
    if (state === "Authorization still blocked" && !instruction.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !instruction.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !instruction.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Instruction expired" && !instruction.hold_reason) blocked.push("hold reason is required when instruction expires");

    const instruction_status = missing.length
      ? "Blocked: required founder instruction fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      founder_authorization_instruction_gate_id: instruction.founder_authorization_instruction_gate_id || "founder-authorization-instruction-gate-" + Date.now(),
      instruction_status,
      authorization_review_ready: authorizationReviewPacket.authorization_review_ready === true,
      controlled_authorization_review_gate_ready: authorizationReviewPacket.controlled_authorization_review_gate_ready === true,
      founder_authorization_instruction_ready: instruction_status === "Founder instruction ready",
      founder_instruction_signal_recorded: instruction_status === "Founder instruction ready",
      controlled_founder_authorization_instruction_gate_ready: instruction_status === "Founder instruction ready",
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
      controlled_authorization_review_gate_id: instruction.controlled_authorization_review_gate_id || authorizationReviewPacket.controlled_authorization_review_gate_id || "",
      controlled_execution_packet_authorization_draft_id: instruction.controlled_execution_packet_authorization_draft_id || authorizationReviewPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: instruction.founder_authorization_decision_gate_id || authorizationReviewPacket.founder_authorization_decision_gate_id || "",
      controlled_execution_authorization_hold_id: instruction.controlled_execution_authorization_hold_id || authorizationReviewPacket.controlled_execution_authorization_hold_id || "",
      controlled_execution_review_gate_id: instruction.controlled_execution_review_gate_id || authorizationReviewPacket.controlled_execution_review_gate_id || "",
      controlled_execution_packet_draft_id: instruction.controlled_execution_packet_draft_id || authorizationReviewPacket.controlled_execution_packet_draft_id || "",
      founder_execution_instruction_gate_id: instruction.founder_execution_instruction_gate_id || authorizationReviewPacket.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: instruction.promotion_execution_preflight_id || authorizationReviewPacket.promotion_execution_preflight_id || "",
      source_answer_id: instruction.source_answer_id || authorizationReviewPacket.source_answer_id || "",
      source_record_id: instruction.source_record_id || authorizationReviewPacket.source_record_id || "",
      source_family: instruction.source_family || authorizationReviewPacket.source_family || "",
      instruction_actor: instruction.instruction_actor || "",
      founder_name: instruction.founder_name || "",
      instruction_scope: instruction.instruction_scope || "",
      founder_instruction_text: instruction.founder_instruction_text || "",
      instruction_rationale: instruction.instruction_rationale || "",
      review_evidence_summary: instruction.review_evidence_summary || "",
      source_lock: instruction.source_lock || "",
      non_authority_clause: instruction.non_authority_clause || "",
      risk_acknowledgment: instruction.risk_acknowledgment || "",
      rollback_condition: instruction.rollback_condition || "",
      monitoring_condition: instruction.monitoring_condition || "",
      stop_condition: instruction.stop_condition || "",
      expiry_check: instruction.expiry_check || "",
      production_boundary: instruction.production_boundary || "",
      clarification_question: instruction.clarification_question || "",
      return_reason: instruction.return_reason || "",
      hold_reason: instruction.hold_reason || "",
      block_reason: instruction.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function founderInstructionSnapshot(instructions, config) {
    const byStatus = instructions.reduce((counts, instruction) => {
      const key = instruction.instruction_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_instructions: instructions.length,
      ready: byStatus["Founder instruction ready"] || 0,
      blocked: instructions.filter((instruction) => String(instruction.instruction_status || "").startsWith("Blocked")).length,
      holds: byStatus["Instruction hold"] || 0,
      expired: byStatus["Instruction expired"] || 0,
      execution_enabled: instructions.filter((instruction) => instruction.execution_allowed || instruction.execution_authorized || instruction.execution_packet_authorized || instruction.storage_write_enabled || instruction.source_write_executed || instruction.production_ready || instruction.public_release_allowed).length
    };
  }

  function parseInstructionJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="auth-instruction-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(instruction) {
    if (!resultCard) return;
    const issues = [...(instruction.missing || []), ...(instruction.blocked || [])];
    resultCard.dataset.state = instruction.instruction_status;
    resultCard.innerHTML = '<strong>' + safe(instruction.instruction_status) + '</strong>' +
      '<p class="muted">Instruction ready: ' + safe(instruction.founder_authorization_instruction_ready) + ' | Founder grant: ' + safe(instruction.founder_instruction_granted) + ' | Execution: ' + safe(instruction.execution_allowed) + '</p>' +
      '<div class="auth-instruction-grid">' +
        card("Review gate", instruction.controlled_authorization_review_gate_id, instruction.founder_authorization_instruction_ready ? "ready" : "") +
        card("Source answer", instruction.source_answer_id) +
        card("Next gate", instruction.next_gate_required) +
        card("Production", instruction.production_ready ? "open" : "false", instruction.production_ready ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for controlled authorization permission preflight. Founder grant, authorization, execution, storage write, canonical update, public release, and production launch remain false.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.instruction_checks.map((check) =>
      '<article class="auth-instruction-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Review gate", config.source.controlled_authorization_review_gate_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function readSaved() {
    const saved = parseInstructionJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(instructions) {
    localStorage.setItem(storageKey, JSON.stringify(instructions.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const instructions = readSaved();
    const snapshot = founderInstructionSnapshot(instructions, config);
    savedRoot.innerHTML = card("Saved instructions", snapshot.saved_instructions) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      instructions.slice(-4).reverse().map((instruction) =>
        '<article class="auth-instruction-card ' + (instruction.founder_authorization_instruction_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(instruction.created_at) + '</span>' +
        '<strong>' + safe(instruction.instruction_status) + '</strong>' +
        '<span>' + safe(instruction.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathFounderAuthorizationInstructionGate = {
    founderAuthorizationInstructionGate,
    founderInstructionSnapshot,
    instructionMissingForState,
    keepsInstructionBoundary,
    keepsProductionBoundary,
    hasUnsafeAuthority,
    parseInstructionJson,
    authorizationReviewReady
  };

  if (!root || typeof fetch !== "function") return;

  fetch("data/vedapath-founder-authorization-instruction-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        authorizationReview: root.querySelector("#authInstructionAuthorizationReview"),
        state: root.querySelector("#authInstructionState"),
        actor: root.querySelector("#authInstructionActor"),
        founder: root.querySelector("#authInstructionFounderName"),
        instructionGateId: root.querySelector("#authInstructionGateId"),
        reviewGateId: root.querySelector("#authInstructionReviewGateId"),
        authorizationDraftId: root.querySelector("#authInstructionDraftId"),
        decisionGateId: root.querySelector("#authInstructionDecisionGateId"),
        authorizationHoldId: root.querySelector("#authInstructionAuthorizationHoldId"),
        priorReviewGateId: root.querySelector("#authInstructionPriorReviewGateId"),
        packetDraftId: root.querySelector("#authInstructionPacketDraftId"),
        founderGateId: root.querySelector("#authInstructionFounderGateId"),
        preflightId: root.querySelector("#authInstructionPreflightId"),
        sourceAnswer: root.querySelector("#authInstructionSourceAnswer"),
        sourceRecord: root.querySelector("#authInstructionSourceRecord"),
        sourceFamily: root.querySelector("#authInstructionSourceFamily"),
        scope: root.querySelector("#authInstructionScopeText"),
        instruction: root.querySelector("#authInstructionText"),
        rationale: root.querySelector("#authInstructionRationale"),
        evidence: root.querySelector("#authInstructionEvidence"),
        sourceLock: root.querySelector("#authInstructionSourceLock"),
        boundary: root.querySelector("#authInstructionBoundary"),
        risk: root.querySelector("#authInstructionRisk"),
        rollback: root.querySelector("#authInstructionRollback"),
        monitoring: root.querySelector("#authInstructionMonitoring"),
        stop: root.querySelector("#authInstructionStopCondition"),
        expiry: root.querySelector("#authInstructionExpiry"),
        production: root.querySelector("#authInstructionProductionBoundary"),
        question: root.querySelector("#authInstructionQuestion"),
        returnReason: root.querySelector("#authInstructionReturnReason"),
        holdReason: root.querySelector("#authInstructionHoldReason"),
        block: root.querySelector("#authInstructionBlockReason")
      };

      config.instruction_states.forEach((state) => fields.state.add(new Option(state, state)));

      function loadSample() {
        const sample = config.sample_instruction;
        fields.authorizationReview.value = JSON.stringify(config.sample_authorization_review, null, 2);
        fields.state.value = sample.instruction_state;
        fields.actor.value = sample.instruction_actor;
        fields.founder.value = sample.founder_name;
        fields.instructionGateId.value = sample.founder_authorization_instruction_gate_id;
        fields.reviewGateId.value = sample.controlled_authorization_review_gate_id;
        fields.authorizationDraftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.authorizationHoldId.value = sample.controlled_execution_authorization_hold_id;
        fields.priorReviewGateId.value = sample.controlled_execution_review_gate_id;
        fields.packetDraftId.value = sample.controlled_execution_packet_draft_id;
        fields.founderGateId.value = sample.founder_execution_instruction_gate_id;
        fields.preflightId.value = sample.promotion_execution_preflight_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.scope.value = sample.instruction_scope;
        fields.instruction.value = sample.founder_instruction_text;
        fields.rationale.value = sample.instruction_rationale;
        fields.evidence.value = sample.review_evidence_summary;
        fields.sourceLock.value = sample.source_lock;
        fields.boundary.value = sample.non_authority_clause;
        fields.risk.value = sample.risk_acknowledgment;
        fields.rollback.value = sample.rollback_condition;
        fields.monitoring.value = sample.monitoring_condition;
        fields.stop.value = sample.stop_condition;
        fields.expiry.value = sample.expiry_check;
        fields.production.value = sample.production_boundary;
        fields.question.value = sample.clarification_question;
        fields.returnReason.value = sample.return_reason;
        fields.holdReason.value = sample.hold_reason;
        fields.block.value = sample.block_reason;
      }

      function buildInstruction() {
        return {
          instruction_state: fields.state.value,
          instruction_actor: fields.actor.value,
          founder_name: fields.founder.value,
          founder_authorization_instruction_gate_id: fields.instructionGateId.value,
          controlled_authorization_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_authorization_draft_id: fields.authorizationDraftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          controlled_execution_authorization_hold_id: fields.authorizationHoldId.value,
          controlled_execution_review_gate_id: fields.priorReviewGateId.value,
          controlled_execution_packet_draft_id: fields.packetDraftId.value,
          founder_execution_instruction_gate_id: fields.founderGateId.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          instruction_scope: fields.scope.value,
          founder_instruction_text: fields.instruction.value,
          instruction_rationale: fields.rationale.value,
          review_evidence_summary: fields.evidence.value,
          source_lock: fields.sourceLock.value,
          non_authority_clause: fields.boundary.value,
          risk_acknowledgment: fields.risk.value,
          rollback_condition: fields.rollback.value,
          monitoring_condition: fields.monitoring.value,
          stop_condition: fields.stop.value,
          expiry_check: fields.expiry.value,
          production_boundary: fields.production.value,
          clarification_question: fields.question.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const authorizationReviewPacket = parseInstructionJson(fields.authorizationReview.value, {});
        const instruction = founderAuthorizationInstructionGate(config, authorizationReviewPacket, buildInstruction());
        instructionOutput.value = JSON.stringify(instruction, null, 2);
        renderResult(instruction);
        return instruction;
      }

      root.querySelector("#runAuthInstruction").addEventListener("click", run);
      root.querySelector("#loadAuthInstructionSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveAuthInstruction").addEventListener("click", () => {
        const instruction = run();
        writeSaved([...readSaved(), instruction]);
        renderSaved(config);
      });
      root.querySelector("#clearAuthInstructions").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyAuthInstruction").addEventListener("click", async () => {
        if (!instructionOutput.value) run();
        await navigator.clipboard.writeText(instructionOutput.value);
      });

      loadSample();
      renderChecks(config);
      renderScope(config);
      run();
      renderSaved(config);
    });
})();
`);

write("founderauthorizationinstructiongate.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Founder Authorization Instruction Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-founder-authorization-instruction-gate.css">
  </head>
  <body class="auth-instruction-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Founder authorization instruction</span>
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

      <main class="workspace" aria-label="VedaPath Founder Authorization Instruction Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Instruction is not permission</span>
          <h2>Let founder intent become explicit, not powerful</h2>
          <p class="muted">This room records an exact founder instruction signal after review readiness. It cannot authorize, execute, store, migrate, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Review</strong><p>Load readiness.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Intent</strong><p>Name the signal.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep grant false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Preflight</strong><p>Prepare only.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledauthorizationreviewgate.html">Open Review Gate</a>
            <a class="button safe" href="controlledexecutionpacketauthorizationdraft.html">Open Draft</a>
          </div>
        </aside>

        <section class="panel auth-instruction" id="founderAuthorizationInstructionGate">
          <div class="auth-instruction-head">
            <div>
              <span class="eyebrow">Founder instruction signal</span>
              <h1>Record intent. Keep authority closed.</h1>
              <p class="muted">A ready instruction here means the reviewed packet can move to a controlled authorization permission preflight. It still cannot authorize execution, run code, promote sources, store data, update canonical records, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="auth-instruction-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath founder authorization instruction mark"></div>
          </div>

          <section class="auth-instruction-layout">
            <div class="auth-instruction-form">
              <h2>Founder Authorization Instruction</h2>
              <label>Authorization review packet<textarea id="authInstructionAuthorizationReview"></textarea></label>
              <label>Instruction state<select id="authInstructionState"></select></label>
              <label>Instruction actor<input id="authInstructionActor" type="text" placeholder="Founder authorization instruction reviewer"></label>
              <label>Founder name<input id="authInstructionFounderName" type="text" placeholder="Founder sample"></label>
              <label>Founder instruction gate id<input id="authInstructionGateId" type="text"></label>
              <label>Authorization review gate id<input id="authInstructionReviewGateId" type="text"></label>
              <label>Authorization draft id<input id="authInstructionDraftId" type="text"></label>
              <label>Founder decision gate id<input id="authInstructionDecisionGateId" type="text"></label>
              <label>Authorization hold id<input id="authInstructionAuthorizationHoldId" type="text"></label>
              <label>Prior review gate id<input id="authInstructionPriorReviewGateId" type="text"></label>
              <label>Packet draft id<input id="authInstructionPacketDraftId" type="text"></label>
              <label>Founder execution gate id<input id="authInstructionFounderGateId" type="text"></label>
              <label>Preflight id<input id="authInstructionPreflightId" type="text"></label>
              <label>Source answer id<input id="authInstructionSourceAnswer" type="text"></label>
              <label>Source record id<input id="authInstructionSourceRecord" type="text"></label>
              <label>Source family<input id="authInstructionSourceFamily" type="text"></label>
              <label>Instruction scope<textarea id="authInstructionScopeText"></textarea></label>
              <label>Founder instruction text<textarea id="authInstructionText"></textarea></label>
              <label>Instruction rationale<textarea id="authInstructionRationale"></textarea></label>
              <label>Review evidence summary<textarea id="authInstructionEvidence"></textarea></label>
              <label>Source lock<textarea id="authInstructionSourceLock"></textarea></label>
              <label>Non-authority clause<textarea id="authInstructionBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="authInstructionRisk"></textarea></label>
              <label>Rollback condition<textarea id="authInstructionRollback"></textarea></label>
              <label>Monitoring condition<textarea id="authInstructionMonitoring"></textarea></label>
              <label>Stop condition<textarea id="authInstructionStopCondition"></textarea></label>
              <label>Expiry check<textarea id="authInstructionExpiry"></textarea></label>
              <label>Production boundary<textarea id="authInstructionProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="authInstructionQuestion"></textarea></label>
              <label>Return reason<textarea id="authInstructionReturnReason"></textarea></label>
              <label>Hold reason<textarea id="authInstructionHoldReason"></textarea></label>
              <label>Block reason<textarea id="authInstructionBlockReason"></textarea></label>
              <div class="auth-instruction-actions">
                <button class="button primary" id="runAuthInstruction" type="button">Run Gate</button>
                <button class="button safe" id="loadAuthInstructionSample" type="button">Load Sample</button>
                <button class="button" id="saveAuthInstruction" type="button">Save Local</button>
                <button class="button" id="clearAuthInstructions" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="auth-instruction-result" id="authInstructionResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Instruction Scope</h2>
                <div class="auth-instruction-list" id="authInstructionScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Instruction Checks</h2>
            <div class="auth-instruction-rules" id="authInstructionChecks"></div>
          </section>

          <section class="auth-instruction-layout">
            <div>
              <div class="auth-instruction-actions">
                <button class="button safe" id="copyAuthInstruction" type="button">Copy Instruction Packet</button>
                <a class="button" href="data/vedapath-founder-authorization-instruction-gate.json">Open JSON</a>
              </div>
              <textarea class="auth-instruction-output" id="authInstructionOutput" aria-label="Founder authorization instruction gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Instructions</h2>
              <div class="auth-instruction-list" id="authInstructionSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Instruction is not grant</span>
          <h2 style="margin-top: 14px;">Founder Signal, Not Execution</h2>
          <p class="muted">The signal can prepare a permission preflight while every operational path stays locked.</p>
          <div class="progress" aria-label="Founder authorization instruction gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>9</strong></div>
            <div class="metric"><span>Grant</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Preflight</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Instruction Boundary</h2>
            <p class="auth-instruction-boundary">Instruction signal only. Founder grant, authorization, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a controlled authorization permission preflight. It does not authorize anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-founder-authorization-instruction-gate.js"></script>
  </body>
</html>
`);

write("docs/FOUNDER_AUTHORIZATION_INSTRUCTION_GATE.md", `# VedaPath AI Founder Authorization Instruction Gate

Release: ${release}

This release adds a founder authorization instruction gate after controlled authorization review readiness.

Files:

- founderauthorizationinstructiongate.html
- assets/vedapath-founder-authorization-instruction-gate.css
- assets/vedapath-founder-authorization-instruction-gate.js
- data/vedapath-founder-authorization-instruction-gate.json

The gate can record founder instruction readiness only. It cannot grant authorization, execution, source promotion, storage writes, canonical writes, migrations, account creation, secret use, public release, or production launch.

The sample instruction starts from the v3.1.9 authorization review packet and checks:

- authorization review readiness
- exact source lock continuity
- founder instruction signal wording
- non-authority language
- rollback, monitoring, stop, expiry, and production boundaries

Next gate: ${nextGate}
`);

const readmeBlock = `## ${release} Founder Authorization Instruction Gate

Founder Authorization Instruction Gate records founder instruction intent after authorization review readiness while keeping founder grant, authorization, execution, storage writes, canonical writes, public release, and production false.

- [Founder Authorization Instruction Gate](founderauthorizationinstructiongate.html)
- [Founder Authorization Instruction Gate Notes](docs/FOUNDER_AUTHORIZATION_INSTRUCTION_GATE.md)
- [Founder Authorization Instruction Gate Data](data/vedapath-founder-authorization-instruction-gate.json)

`;

update("README.md", (content) => {
  if (content.includes("Founder Authorization Instruction Gate")) return content;
  return mustReplace(content, "## v3.1.9 Controlled Authorization Review Gate", readmeBlock + "## v3.1.9 Controlled Authorization Review Gate", "README insertion");
});

const notesBlock = `## ${release} Founder Authorization Instruction Gate

The founder authorization instruction gate is the next human-intent layer after authorization review readiness.

- It starts from a ready authorization review packet.
- It can record founder instruction readiness only.
- It blocks founder grant, authorization, execution, storage writes, canonical writes, public release, and production.
- It moves only to a controlled authorization permission preflight.

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes(`${release} Founder Authorization Instruction Gate`)) return content;
  return mustReplace(content, "## v3.1.9 Controlled Authorization Review Gate", notesBlock + "## v3.1.9 Controlled Authorization Review Gate", "prototype notes insertion");
});

const blueprintBlock = `### 303. Founder Authorization Instruction Gate

Founder Authorization Instruction Gate records founder instruction intent after authorization review readiness.

It must:

- start from an authorization review ready object
- preserve authorization review, authorization draft, founder decision, source answer, source record, and source family ids
- make founder instruction readiness visible
- block founder grant, actual authorization, execution, storage writes, canonical writes, public release, and production
- move only to a controlled authorization permission preflight

Founder Authorization Instruction Gate should never claim authorization approval, founder grant, execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("### 303. Founder Authorization Instruction Gate")) return content;
  return mustReplace(content, "### 302. Controlled Authorization Review Gate", blueprintBlock + "### 302. Controlled Authorization Review Gate", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.9 review gate<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction next, and production still closed.", "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight next, and production still closed.");
  if (!content.includes('href="founderauthorizationinstructiongate.html"')) {
    content = mustReplace(content, '<a href="controlledauthorizationreviewgate.html">Authorization review <span>gate</span></a>', '<a href="controlledauthorizationreviewgate.html">Authorization review <span>gate</span></a>\n              <a href="founderauthorizationinstructiongate.html">Founder instruction <span>signal</span></a>', "study map founder instruction link");
    content = mustReplace(content, '<a href="controlledauthorizationreviewgate.html">Authorization review <span>no-authority</span></a>', '<a href="controlledauthorizationreviewgate.html">Authorization review <span>no-authority</span></a>\n              <a href="founderauthorizationinstructiongate.html">Founder instruction <span>no-grant</span></a>', "build map founder instruction link");
  }
  return content;
});

update("controlledauthorizationreviewgate.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.9 review gate<\/span>/g, `<span class="version">${badge}</span>`);
  if (!content.includes('href="founderauthorizationinstructiongate.html"')) {
    content = mustReplace(content, '<a class="button safe" href="founderauthorizationdecisiongate.html">Open Founder Decision</a>', '<a class="button safe" href="founderauthorizationdecisiongate.html">Open Founder Decision</a>\n            <a class="button" href="founderauthorizationinstructiongate.html">Open Founder Instruction</a>', "auth review founder instruction link");
  }
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.9 review gate<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("<strong>v3.1.9</strong>\n          <p>Controlled Authorization Review Gate: authorization draft language now receives review readiness while authorization, execution, storage, public release, and production remain false.</p>", "<strong>v3.2.0</strong>\n          <p>Founder Authorization Instruction Gate: founder instruction intent is now recorded while founder grant, authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace('<strong>99%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>\n          <p>The trust loop now reviews authorization language separately from actual authorization while every real write path remains closed.</p>', '<strong>99%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>\n          <p>The trust loop now records founder instruction intent separately from founder grant while every real write path remains closed.</p>');
  content = content.replace("<span>Next release</span>\n          <strong>Founder authorization instruction gate</strong>\n          <p>Ask for explicit founder instruction while still blocking execution.</p>", "<span>Next release</span>\n          <strong>Controlled authorization permission preflight</strong>\n          <p>Evaluate permission preflight while still blocking execution.</p>");
  if (!content.includes("Phase 284: Founder Authorization Instruction Gate")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 284: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 284: Founder Authorization Instruction Gate</strong>
                <p>Records founder instruction intent after authorization review readiness while founder grant, authorization, execution, storage writes, canonical writes, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 285: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.1.9 Controlled Authorization Review Gate</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.2.0 Founder Authorization Instruction Gate</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.1.8 Controlled Execution Packet Authorization Draft</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Review authorization draft language without granting authorization or execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Record founder instruction intent without granting authorization or execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for founder authorization instruction gate</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled authorization permission preflight</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Build founder authorization instruction gate.</span></li>\n              <li><span class="dot"></span><span>Require explicit founder instruction before any authorization discussion.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate founder instruction from actual execution permission.</span></li>', '<li><span class="dot"></span><span>Build controlled authorization permission preflight.</span></li>\n              <li><span class="dot"></span><span>Compare founder instruction signal against review readiness.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate permission preflight from actual execution.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.1\.9 review gate<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} founder authorization instruction gate applied.`);

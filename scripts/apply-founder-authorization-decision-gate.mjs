import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.1.7";
const badge = "v3.1.7 decision gate";
const previousRelease = "v3.1.6 Controlled Execution Authorization Hold";
const nextGate = "Controlled execution packet authorization draft";

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

const holdConfig = JSON.parse(read("data/vedapath-controlled-execution-authorization-hold.json"));
const sampleAuthorizationHold = {
  schema_version: holdConfig.schema_version,
  release: holdConfig.release,
  controlled_execution_authorization_hold_id: "controlled-execution-authorization-hold-sample-steady-action-bg-2-48",
  hold_status: "Controlled authorization hold ready",
  controlled_authorization_hold_ready: true,
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
  next_gate_required: "Founder authorization decision gate",
  ...holdConfig.sample_hold,
  created_at: "2026-06-27T00:00:00.000Z"
};

const config = {
  schema_version: "founder-authorization-decision-gate-v1",
  release,
  generated_at: "2026-06-27T00:00:00.000Z",
  title: "Founder Authorization Decision Gate",
  summary: "Records founder decision posture on held authorization language while keeping execution packet authorization, execution, storage writes, canonical writes, migrations, accounts, secrets, public release, and production disabled.",
  previous_release: previousRelease,
  source: {
    controlled_execution_authorization_hold_release: holdConfig.release,
    controlled_execution_authorization_hold_schema: holdConfig.schema_version,
    controlled_execution_authorization_hold_id: sampleAuthorizationHold.controlled_execution_authorization_hold_id,
    controlled_execution_review_gate_id: sampleAuthorizationHold.controlled_execution_review_gate_id,
    controlled_execution_packet_draft_id: sampleAuthorizationHold.controlled_execution_packet_draft_id,
    founder_execution_instruction_gate_id: sampleAuthorizationHold.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: sampleAuthorizationHold.promotion_execution_preflight_id,
    source_answer_id: sampleAuthorizationHold.source_answer_id,
    source_record_id: sampleAuthorizationHold.source_record_id,
    source_family: sampleAuthorizationHold.source_family
  },
  decision_states: [
    "Draft founder decision",
    "Needs founder decision note",
    "Founder decision ready",
    "Return to authorization hold",
    "Decision hold",
    "Execution blocked",
    "Production forbidden",
    "Decision expired"
  ],
  required_by_state: {
    "Draft founder decision": ["controlled_execution_authorization_hold_id", "source_answer_id", "decision_scope"],
    "Needs founder decision note": ["review_question", "founder_decision_language"],
    "Founder decision ready": [
      "decision_actor",
      "founder_name",
      "controlled_execution_authorization_hold_id",
      "controlled_execution_review_gate_id",
      "controlled_execution_packet_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "decision_scope",
      "founder_decision_language",
      "decision_rationale",
      "evidence_summary",
      "source_lock",
      "risk_acknowledgment",
      "boundary_statement",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to authorization hold": ["return_reason"],
    "Decision hold": ["hold_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Decision expired": ["expiry_check", "hold_reason"]
  },
  decision_checks: [
    {
      check: "Authorization hold ready",
      rule: "Founder decision gate can start only from a controlled authorization hold ready object whose next gate is founder authorization decision gate."
    },
    {
      check: "Decision posture only",
      rule: "The founder can record a decision to move language forward, but no execution packet authorization is granted here."
    },
    {
      check: "Exact source scope",
      rule: "The decision must name the hold id, review gate id, packet draft id, source answer, source record, and source family."
    },
    {
      check: "Operational blocks",
      rule: "Execution packet authorization, execution, storage, canonical writes, public release, and production stay false."
    },
    {
      check: "Rollback and monitoring",
      rule: "Rollback, replay, before_hash, monitoring, reviewer handoff, and stop conditions remain required before any future execution draft."
    },
    {
      check: "Expiry",
      rule: "The decision expires on material source, rights, reviewer, founder instruction, hold, review gate, rollback, monitoring, packet draft, or code change."
    }
  ],
  sample_authorization_hold: sampleAuthorizationHold,
  sample_decision: {
    decision_state: "Founder decision ready",
    decision_actor: "Founder authorization decision reviewer",
    founder_name: "Founder sample",
    controlled_execution_authorization_hold_id: sampleAuthorizationHold.controlled_execution_authorization_hold_id,
    controlled_execution_review_gate_id: sampleAuthorizationHold.controlled_execution_review_gate_id,
    controlled_execution_packet_draft_id: sampleAuthorizationHold.controlled_execution_packet_draft_id,
    founder_execution_instruction_gate_id: sampleAuthorizationHold.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: sampleAuthorizationHold.promotion_execution_preflight_id,
    source_answer_id: sampleAuthorizationHold.source_answer_id,
    source_record_id: sampleAuthorizationHold.source_record_id,
    source_family: sampleAuthorizationHold.source_family,
    decision_scope: "Record founder decision posture for this exact source packet only after authorization hold readiness. Do not authorize execution, source promotion, storage, canonical writes, migration, account creation, secret use, public release, or production launch.",
    founder_decision_language: "Founder decision recorded: this exact language may move to controlled execution packet authorization draft. This is not authorization, no authorization granted, and no execution may run from it.",
    decision_rationale: "The held authorization language is specific to one source answer, source record, source family, review gate, and packet draft. Moving it forward means drafting the next reviewable authorization packet only.",
    evidence_summary: "Authorization hold ready; review gate, packet draft, source ids, source family, citation, rights, translation, reviewer evidence, source-owner scope, founder instruction, rollback, monitoring, stop condition, expiry, and production boundary are visible.",
    source_lock: "Locked to controlled_execution_authorization_hold_id controlled-execution-authorization-hold-sample-steady-action-bg-2-48, controlled_execution_review_gate_id controlled-execution-review-gate-sample-steady-action-bg-2-48, controlled_execution_packet_draft_id controlled-execution-packet-draft-sample-steady-action-bg-2-48, source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti.",
    risk_acknowledgment: "Risk remains: source mismatch, rights change, reviewer change, founder instruction expiry, authorization hold expiry, review gate expiry, rollback missing, monitoring missing, code change, or any true authorization, execution, storage, canonical, public release, or production flag must block movement.",
    boundary_statement: "Founder authorization decision gate only; founder_authorization_decision_ready may be true, founder_decision_recorded may be true, but execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, founder_instruction_granted remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, and reviewer handoff must remain present before any future execution packet authorization draft; no source state is written.",
    monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any future execution packet authorization draft.",
    stop_condition: "Stop if source ids mismatch, rights change, reviewer evidence is missing, source-owner scope is missing, founder instruction expires, authorization hold expires, review gate expires, rollback is missing, monitoring is missing, code changes, or any authorization, execution, storage, canonical, public release, or production flag is true.",
    expiry_check: "Founder decision expires at the next material source, rights, reviewer, founder instruction, authorization hold, review gate, rollback, monitoring, packet draft, or code change and must be rechecked; not permanent approval.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    next_gate: nextGate,
    review_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    founder_authorization_decision_ready: false,
    founder_decision_recorded: false,
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
    next_gate_required: nextGate
  }
};

write("data/vedapath-founder-authorization-decision-gate.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-founder-authorization-decision-gate.css", `/* VedaPath founder authorization decision gate */
body.decision-page .topbar,
body.decision-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.decision-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.decision-page .nav .link,
body.decision-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.decision-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.decision-page main.workspace {
  grid-template-columns: minmax(210px, 0.72fr) minmax(0, 1.7fr) minmax(230px, 0.8fr);
  gap: 18px;
}

body.decision-page main.workspace > aside.panel:first-child,
body.decision-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.decision-gate,
.decision-head,
.decision-layout,
.decision-form,
.decision-grid,
.decision-list,
.decision-actions,
.decision-rules {
  display: grid;
  gap: 10px;
}

.decision-gate { gap: 16px; }

.decision-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.decision-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.decision-mark img {
  display: block;
  width: 100%;
}

.decision-layout {
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  align-items: start;
}

.decision-form,
.decision-card,
.decision-result,
.decision-output,
.decision-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.decision-form,
.decision-card,
.decision-result,
.decision-rule {
  padding: 12px;
}

.decision-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.decision-form input,
.decision-form select,
.decision-form textarea,
.decision-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.decision-form textarea,
.decision-output {
  min-height: 100px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.decision-grid,
.decision-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.decision-card,
.decision-result {
  border-left: 4px solid var(--gold);
}

.decision-card.ready,
.decision-result[data-state="Founder decision ready"] {
  border-left-color: var(--green);
}

.decision-card.blocked,
.decision-result[data-state="Blocked"],
.decision-result[data-state="Return to authorization hold"],
.decision-result[data-state="Decision hold"],
.decision-result[data-state="Execution blocked"],
.decision-result[data-state="Production forbidden"],
.decision-result[data-state="Decision expired"] {
  border-left-color: var(--ochre);
}

.decision-card span,
.decision-card strong,
.decision-rule span,
.decision-rule strong {
  display: block;
}

.decision-card strong {
  font-size: 18px;
  line-height: 1.18;
  overflow-wrap: anywhere;
}

.decision-card span,
.decision-rule span {
  color: var(--muted);
  font-size: 12px;
}

.decision-result strong {
  display: block;
  font-size: 24px;
}

.decision-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.decision-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.decision-list {
  max-height: 320px;
  overflow: auto;
}

.decision-output {
  min-height: 260px;
}

.decision-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  body.decision-page .topbar,
  body.decision-page header.topbar {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 12px 0 !important;
  }

  body.decision-page .nav {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  body.decision-page main.workspace {
    grid-template-columns: 1fr;
  }

  body.decision-page main.workspace > section.decision-gate {
    order: 1;
  }

  body.decision-page main.workspace > aside.panel:first-child {
    order: 2;
  }

  body.decision-page main.workspace > aside.panel.tight {
    order: 3;
  }

  .decision-layout,
  .decision-head,
  .decision-grid,
  .decision-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .decision-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-founder-authorization-decision-gate.js", `(() => {
  const storageKey = "vedapath-founder-authorization-decision-gate";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("founderAuthorizationDecisionGate") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("decisionSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("decisionResultCard") : null;
  const decisionOutput = pageDocument ? pageDocument.getElementById("decisionOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("decisionChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("decisionScope") : null;

  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\\"": "&quot;",
    "'": "&#39;"
  })[char]);

  function hasText(value, groups) {
    const text = String(value || "").toLowerCase();
    return groups.every((group) => group.some((term) => text.includes(term.toLowerCase())));
  }

  function authorizationHoldReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-execution-authorization-hold-v1" &&
      packet.hold_status === "Controlled authorization hold ready" &&
      packet.controlled_authorization_hold_ready === true &&
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
      packet.next_gate_required === "Founder authorization decision gate";
  }

  function keepsDecisionBoundary(value) {
    const text = String(value || "");
    const required = [
      /founder_authorization_decision_ready may be true/i,
      /founder_decision_recorded may be true/i,
      /execution_packet_authorized remains false/i,
      /execution_authorized remains false/i,
      /execution_allowed remains false/i,
      /founder_instruction_granted remains false/i,
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
    const unsafe = /(execution_packet_authorized true|execution_authorized true|execution_allowed true|founder_instruction_granted true|source_promotion_allowed true|promotion_execution_allowed true|implementation_authorized true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|production_launch_allowed true|public_release_allowed true|authorize now|authorization granted|execute now|write enabled|canonical update|migration run|secret use|launch production)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function decisionMissingForState(config, state, decision = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(decision[field] || "").trim());
  }

  function idMatches(decision, holdPacket, key) {
    return !decision[key] || !holdPacket[key] || decision[key] === holdPacket[key];
  }

  function founderAuthorizationDecisionGate(config, holdPacket, decision) {
    const state = decision.decision_state || "Draft founder decision";
    const missing = decisionMissingForState(config, state, decision);
    const blocked = [];

    if (!authorizationHoldReady(holdPacket)) blocked.push("controlled authorization hold must be ready while authorization, execution, storage, canonical, public release, and production flags remain false");
    ["controlled_execution_authorization_hold_id", "controlled_execution_review_gate_id", "controlled_execution_packet_draft_id", "founder_execution_instruction_gate_id", "promotion_execution_preflight_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(decision, holdPacket, key)) blocked.push(key + " must match the controlled authorization hold");
    });

    const readyCandidate = state === "Founder decision ready";
    if (readyCandidate && !hasText(decision.decision_scope, [["record founder decision posture"], ["exact source packet"], ["authorization hold readiness"], ["do not", "authorize"], ["execution"], ["source promotion"], ["storage"], ["canonical"], ["migration"], ["account"], ["secret"], ["public release"], ["production launch"]])) {
      blocked.push("decision scope must be exact-source only and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && !hasText(decision.founder_decision_language, [["founder decision recorded"], ["move to controlled execution packet authorization draft"], ["not authorization"], ["no authorization granted"], ["no execution"]])) {
      blocked.push("founder decision language must move only to the next draft and state not authorization, no authorization granted, and no execution");
    }
    if (readyCandidate && !hasText(decision.decision_rationale, [["held authorization language"], ["specific to one source answer"], ["source record"], ["source family"], ["review gate"], ["packet draft"], ["next reviewable authorization packet only"]])) {
      blocked.push("decision rationale must keep the move specific to one source and one next reviewable draft");
    }
    if (readyCandidate && !hasText(decision.evidence_summary, [["authorization hold ready"], ["review gate"], ["packet draft"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["founder instruction"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("evidence summary must keep hold readiness and evidence visible");
    }
    if (readyCandidate && !hasText(decision.source_lock, [["controlled_execution_authorization_hold_id"], ["controlled_execution_review_gate_id"], ["controlled_execution_packet_draft_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("source lock must name the hold, review gate, packet draft, source answer, source record, and source family");
    }
    if (readyCandidate && !hasText(decision.risk_acknowledgment, [["risk remains"], ["source mismatch"], ["rights change"], ["reviewer change"], ["founder instruction expiry"], ["authorization hold expiry"], ["review gate expiry"], ["rollback missing"], ["monitoring missing"], ["code change"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on source, rights, reviewer, founder, hold, review, rollback, monitoring, code, or true authority flags");
    }
    if (readyCandidate && !keepsDecisionBoundary(decision.boundary_statement)) {
      blocked.push("boundary statement must keep decision readiness as non-authority and all authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(decision.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["future execution packet authorization draft"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, future draft, and no source state write");
    }
    if (readyCandidate && !hasText(decision.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["future execution packet authorization draft"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and future draft");
    }
    if (readyCandidate && !hasText(decision.stop_condition, [["stop"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["source-owner"], ["founder instruction expires"], ["authorization hold expires"], ["review gate expires"], ["rollback"], ["monitoring"], ["code changes"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on source mismatches, rights changes, missing evidence, expiry, missing rollback/monitoring, code changes, or any true authority flag");
    }
    if (readyCandidate && !hasText(decision.expiry_check, [["expires"], ["material source"], ["rights"], ["reviewer"], ["founder instruction"], ["authorization hold"], ["review gate"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not permanent approval"]])) {
      blocked.push("expiry check must state that founder decision expires and is not permanent approval");
    }
    if (readyCandidate && !keepsProductionBoundary(decision.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs founder decision note" && !decision.review_question) blocked.push("review question is required");
    if (state === "Return to authorization hold" && !decision.return_reason) blocked.push("return reason is required");
    if (state === "Decision hold" && !decision.hold_reason) blocked.push("hold reason is required");
    if (state === "Execution blocked" && !decision.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !decision.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Decision expired" && !decision.hold_reason) blocked.push("hold reason is required when decision expires");

    const decision_status = missing.length
      ? "Blocked: required decision fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      founder_authorization_decision_gate_id: "founder-authorization-decision-gate-" + Date.now(),
      decision_status,
      founder_authorization_decision_ready: decision_status === "Founder decision ready",
      founder_decision_recorded: decision_status === "Founder decision ready",
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
      controlled_execution_authorization_hold_id: decision.controlled_execution_authorization_hold_id || holdPacket.controlled_execution_authorization_hold_id || "",
      controlled_execution_review_gate_id: decision.controlled_execution_review_gate_id || holdPacket.controlled_execution_review_gate_id || "",
      controlled_execution_packet_draft_id: decision.controlled_execution_packet_draft_id || holdPacket.controlled_execution_packet_draft_id || "",
      founder_execution_instruction_gate_id: decision.founder_execution_instruction_gate_id || holdPacket.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: decision.promotion_execution_preflight_id || holdPacket.promotion_execution_preflight_id || "",
      source_answer_id: decision.source_answer_id || holdPacket.source_answer_id || "",
      source_record_id: decision.source_record_id || holdPacket.source_record_id || "",
      source_family: decision.source_family || holdPacket.source_family || "",
      decision_actor: decision.decision_actor || "",
      founder_name: decision.founder_name || "",
      decision_scope: decision.decision_scope || "",
      founder_decision_language: decision.founder_decision_language || "",
      decision_rationale: decision.decision_rationale || "",
      evidence_summary: decision.evidence_summary || "",
      source_lock: decision.source_lock || "",
      risk_acknowledgment: decision.risk_acknowledgment || "",
      boundary_statement: decision.boundary_statement || "",
      rollback_condition: decision.rollback_condition || "",
      monitoring_condition: decision.monitoring_condition || "",
      stop_condition: decision.stop_condition || "",
      expiry_check: decision.expiry_check || "",
      production_boundary: decision.production_boundary || "",
      review_question: decision.review_question || "",
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
      ready: byStatus["Founder decision ready"] || 0,
      blocked: decisions.filter((decision) => String(decision.decision_status || "").startsWith("Blocked")).length,
      holds: byStatus["Decision hold"] || 0,
      expired: byStatus["Decision expired"] || 0,
      execution_enabled: decisions.filter((decision) => decision.execution_allowed || decision.execution_authorized || decision.execution_packet_authorized || decision.storage_write_enabled || decision.source_write_executed || decision.production_ready || decision.public_release_allowed).length
    };
  }

  function parseDecisionJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="decision-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(decision) {
    if (!resultCard) return;
    const issues = [...(decision.missing || []), ...(decision.blocked || [])];
    resultCard.dataset.state = decision.decision_status;
    resultCard.innerHTML = '<strong>' + safe(decision.decision_status) + '</strong>' +
      '<p class="muted">Decision ready: ' + safe(decision.founder_authorization_decision_ready) + ' | Authorized: ' + safe(decision.execution_packet_authorized) + ' | Production: ' + safe(decision.production_ready) + '</p>' +
      '<div class="decision-grid">' +
        card("Authorization hold", decision.controlled_execution_authorization_hold_id, decision.founder_authorization_decision_ready ? "ready" : "") +
        card("Source answer", decision.source_answer_id) +
        card("Next gate", decision.next_gate_required) +
        card("Execution", decision.execution_allowed ? "enabled" : "false", decision.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for controlled execution packet authorization draft. No authorization, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.decision_checks.map((check) =>
      '<article class="decision-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Authorization hold", config.source.controlled_execution_authorization_hold_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    const saved = parseDecisionJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(decisions) {
    localStorage.setItem(storageKey, JSON.stringify(decisions.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const decisions = readSaved();
    const snapshot = founderDecisionSnapshot(decisions, config);
    savedRoot.innerHTML = card("Saved decisions", snapshot.saved_decisions) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      decisions.slice(-4).reverse().map((decision) =>
        '<article class="decision-card ' + (decision.founder_authorization_decision_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(decision.created_at) + '</span>' +
        '<strong>' + safe(decision.decision_status) + '</strong>' +
        '<span>' + safe(decision.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathFounderAuthorizationDecisionGate = {
    founderAuthorizationDecisionGate,
    founderDecisionSnapshot,
    decisionMissingForState,
    keepsDecisionBoundary,
    keepsProductionBoundary,
    parseDecisionJson,
    authorizationHoldReady
  };

  if (!root || typeof fetch !== "function") return;

  fetch("data/vedapath-founder-authorization-decision-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        authorizationHold: root.querySelector("#decisionAuthorizationHold"),
        state: root.querySelector("#decisionState"),
        actor: root.querySelector("#decisionActor"),
        founderName: root.querySelector("#decisionFounderName"),
        authorizationHoldId: root.querySelector("#decisionAuthorizationHoldId"),
        reviewGateId: root.querySelector("#decisionReviewGateId"),
        packetDraftId: root.querySelector("#decisionPacketDraftId"),
        founderGateId: root.querySelector("#decisionFounderGateId"),
        preflightId: root.querySelector("#decisionPreflightId"),
        sourceAnswer: root.querySelector("#decisionSourceAnswer"),
        sourceRecord: root.querySelector("#decisionSourceRecord"),
        sourceFamily: root.querySelector("#decisionSourceFamily"),
        scope: root.querySelector("#decisionScopeText"),
        founderLanguage: root.querySelector("#decisionFounderLanguage"),
        rationale: root.querySelector("#decisionRationale"),
        evidence: root.querySelector("#decisionEvidence"),
        sourceLock: root.querySelector("#decisionSourceLock"),
        risk: root.querySelector("#decisionRisk"),
        boundary: root.querySelector("#decisionBoundary"),
        rollback: root.querySelector("#decisionRollback"),
        monitoring: root.querySelector("#decisionMonitoring"),
        stop: root.querySelector("#decisionStopCondition"),
        expiry: root.querySelector("#decisionExpiry"),
        production: root.querySelector("#decisionProductionBoundary"),
        question: root.querySelector("#decisionQuestion"),
        returnReason: root.querySelector("#decisionReturnReason"),
        holdReason: root.querySelector("#decisionHoldReason"),
        block: root.querySelector("#decisionBlockReason")
      };

      config.decision_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_decision;
        fields.authorizationHold.value = JSON.stringify(config.sample_authorization_hold, null, 2);
        fields.state.value = item.decision_state;
        fields.actor.value = item.decision_actor;
        fields.founderName.value = item.founder_name;
        fields.authorizationHoldId.value = item.controlled_execution_authorization_hold_id;
        fields.reviewGateId.value = item.controlled_execution_review_gate_id;
        fields.packetDraftId.value = item.controlled_execution_packet_draft_id;
        fields.founderGateId.value = item.founder_execution_instruction_gate_id;
        fields.preflightId.value = item.promotion_execution_preflight_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.decision_scope;
        fields.founderLanguage.value = item.founder_decision_language;
        fields.rationale.value = item.decision_rationale;
        fields.evidence.value = item.evidence_summary;
        fields.sourceLock.value = item.source_lock;
        fields.risk.value = item.risk_acknowledgment;
        fields.boundary.value = item.boundary_statement;
        fields.rollback.value = item.rollback_condition;
        fields.monitoring.value = item.monitoring_condition;
        fields.stop.value = item.stop_condition;
        fields.expiry.value = item.expiry_check;
        fields.production.value = item.production_boundary;
        fields.question.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildDecision() {
        return {
          decision_state: fields.state.value,
          decision_actor: fields.actor.value,
          founder_name: fields.founderName.value,
          controlled_execution_authorization_hold_id: fields.authorizationHoldId.value,
          controlled_execution_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_draft_id: fields.packetDraftId.value,
          founder_execution_instruction_gate_id: fields.founderGateId.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          decision_scope: fields.scope.value,
          founder_decision_language: fields.founderLanguage.value,
          decision_rationale: fields.rationale.value,
          evidence_summary: fields.evidence.value,
          source_lock: fields.sourceLock.value,
          risk_acknowledgment: fields.risk.value,
          boundary_statement: fields.boundary.value,
          rollback_condition: fields.rollback.value,
          monitoring_condition: fields.monitoring.value,
          stop_condition: fields.stop.value,
          expiry_check: fields.expiry.value,
          production_boundary: fields.production.value,
          review_question: fields.question.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const holdPacket = parseDecisionJson(fields.authorizationHold.value, {});
        const decision = founderAuthorizationDecisionGate(config, holdPacket, buildDecision());
        decisionOutput.value = JSON.stringify(decision, null, 2);
        renderResult(decision);
        return decision;
      }

      root.querySelector("#runDecisionGate").addEventListener("click", run);
      root.querySelector("#loadDecisionSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveDecisionGate").addEventListener("click", () => {
        const decision = run();
        writeSaved([...readSaved(), decision]);
        renderSaved(config);
      });
      root.querySelector("#clearDecisionGates").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyDecisionGate").addEventListener("click", async () => {
        if (!decisionOutput.value) run();
        await navigator.clipboard.writeText(decisionOutput.value);
      });

      loadSample();
      renderChecks(config);
      renderScope(config);
      run();
      renderSaved(config);
    });
})();
`);

write("founderauthorizationdecisiongate.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Founder Authorization Decision Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-founder-authorization-decision-gate.css">
  </head>
  <body class="decision-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Founder authorization decision gate</span>
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

      <main class="workspace" aria-label="VedaPath Founder Authorization Decision Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Decision is not execution</span>
          <h2>Record founder posture before any packet draft</h2>
          <p class="muted">This room records whether held language may move to a later authorization draft. It cannot authorize, execute, promote, store, migrate, use secrets, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Hold</strong><p>Load language.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Decision</strong><p>Record posture.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep flags false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Draft</strong><p>Move to next draft only.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledexecutionauthorizationhold.html">Open Authorization Hold</a>
            <a class="button safe" href="controlledexecutionreviewgate.html">Open Review Gate</a>
          </div>
        </aside>

        <section class="panel decision-gate" id="founderAuthorizationDecisionGate">
          <div class="decision-head">
            <div>
              <span class="eyebrow">Founder decision gate</span>
              <h1>Record the decision. Keep authority closed.</h1>
              <p class="muted">A ready decision here means the language can move to a controlled execution packet authorization draft. It still cannot authorize, execute, promote, store, update canonical records, run migrations, create accounts, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="decision-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath founder authorization decision mark"></div>
          </div>

          <section class="decision-layout">
            <div class="decision-form">
              <h2>Founder Authorization Decision</h2>
              <label>Authorization hold packet<textarea id="decisionAuthorizationHold"></textarea></label>
              <label>Decision state<select id="decisionState"></select></label>
              <label>Decision actor<input id="decisionActor" type="text" placeholder="Founder authorization decision reviewer"></label>
              <label>Founder name<input id="decisionFounderName" type="text" placeholder="Founder sample"></label>
              <label>Authorization hold id<input id="decisionAuthorizationHoldId" type="text"></label>
              <label>Review gate id<input id="decisionReviewGateId" type="text"></label>
              <label>Packet draft id<input id="decisionPacketDraftId" type="text"></label>
              <label>Founder gate id<input id="decisionFounderGateId" type="text"></label>
              <label>Preflight id<input id="decisionPreflightId" type="text"></label>
              <label>Source answer id<input id="decisionSourceAnswer" type="text"></label>
              <label>Source record id<input id="decisionSourceRecord" type="text"></label>
              <label>Source family<input id="decisionSourceFamily" type="text"></label>
              <label>Decision scope<textarea id="decisionScopeText"></textarea></label>
              <label>Founder decision language<textarea id="decisionFounderLanguage"></textarea></label>
              <label>Decision rationale<textarea id="decisionRationale"></textarea></label>
              <label>Evidence summary<textarea id="decisionEvidence"></textarea></label>
              <label>Source lock<textarea id="decisionSourceLock"></textarea></label>
              <label>Risk acknowledgment<textarea id="decisionRisk"></textarea></label>
              <label>Boundary statement<textarea id="decisionBoundary"></textarea></label>
              <label>Rollback condition<textarea id="decisionRollback"></textarea></label>
              <label>Monitoring condition<textarea id="decisionMonitoring"></textarea></label>
              <label>Stop condition<textarea id="decisionStopCondition"></textarea></label>
              <label>Expiry check<textarea id="decisionExpiry"></textarea></label>
              <label>Production boundary<textarea id="decisionProductionBoundary"></textarea></label>
              <label>Review question<textarea id="decisionQuestion"></textarea></label>
              <label>Return reason<textarea id="decisionReturnReason"></textarea></label>
              <label>Hold reason<textarea id="decisionHoldReason"></textarea></label>
              <label>Block reason<textarea id="decisionBlockReason"></textarea></label>
              <div class="decision-actions">
                <button class="button primary" id="runDecisionGate" type="button">Run Decision</button>
                <button class="button safe" id="loadDecisionSample" type="button">Load Sample</button>
                <button class="button" id="saveDecisionGate" type="button">Save Local</button>
                <button class="button" id="clearDecisionGates" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="decision-result" id="decisionResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Decision Scope</h2>
                <div class="decision-list" id="decisionScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Decision Checks</h2>
            <div class="decision-rules" id="decisionChecks"></div>
          </section>

          <section class="decision-layout">
            <div>
              <div class="decision-actions">
                <button class="button safe" id="copyDecisionGate" type="button">Copy Decision Gate</button>
                <a class="button" href="data/vedapath-founder-authorization-decision-gate.json">Open JSON</a>
              </div>
              <textarea class="decision-output" id="decisionOutput" aria-label="Founder authorization decision gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Decisions</h2>
              <div class="decision-list" id="decisionSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Decision is not authorization</span>
          <h2 style="margin-top: 14px;">Ready to Draft, Not Run</h2>
          <p class="muted">The decision moves language to the next draft only while every operational path stays locked.</p>
          <div class="progress" aria-label="Founder authorization decision gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>8</strong></div>
            <div class="metric"><span>Authorized</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Authorization draft</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Decision Boundary</h2>
            <p class="decision-boundary">Decision only. Authorization, execution, founder grant, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares the controlled execution packet authorization draft. It does not execute anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-founder-authorization-decision-gate.js"></script>
  </body>
</html>
`);

write("docs/FOUNDER_AUTHORIZATION_DECISION_GATE.md", `# VedaPath AI Founder Authorization Decision Gate

Release: ${release}

This release records founder decision posture on held authorization language without granting authorization or execution.

## Files

- data/vedapath-founder-authorization-decision-gate.json
- founderauthorizationdecisiongate.html
- assets/vedapath-founder-authorization-decision-gate.css
- assets/vedapath-founder-authorization-decision-gate.js

## What It Adds

The room:

- starts from a controlled authorization hold ready object
- records founder decision posture for one exact source packet
- allows movement only to a future controlled execution packet authorization draft
- keeps source ids, source family, evidence, risk, rollback, monitoring, stop condition, expiry, and production boundary visible
- keeps authorization, execution, founder grant, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production false

## Boundary

Founder authorization decision gate is not execution approval. It does not authorize the packet, promote source data, run storage writes, update canonical source records, run migrations, create accounts, use secrets, publish public release state, or launch production. The next release should create a controlled execution packet authorization draft while every write and production flag remains false.
`);

const readmeBlock = `<!-- VEDAPATH FOUNDER AUTHORIZATION DECISION GATE START -->
## ${release} Founder Authorization Decision Gate

This release records founder decision posture on held authorization language while all authorization, execution, promotion, storage, canonical-write, migration, account, secret, public-release, and production flags stay false.

- [Founder Authorization Decision Gate](founderauthorizationdecisiongate.html)
- [Founder Authorization Decision Gate Notes](docs/FOUNDER_AUTHORIZATION_DECISION_GATE.md)
- [Founder Authorization Decision Gate Data](data/vedapath-founder-authorization-decision-gate.json)

<!-- VEDAPATH FOUNDER AUTHORIZATION DECISION GATE END -->

`;

update("README.md", (content) => {
  if (content.includes("VEDAPATH FOUNDER AUTHORIZATION DECISION GATE START")) return content;
  return mustReplace(content, "<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD START -->", readmeBlock + "<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD START -->", "README insertion");
});

const notesBlock = `<!-- VEDAPATH FOUNDER AUTHORIZATION DECISION GATE NOTES START -->
## ${release} Founder Authorization Decision Gate

This phase records founder decision posture without granting authorization.

- Adds a founder authorization decision gate room.
- Reads a controlled authorization hold ready object.
- Requires decision scope, founder decision language, rationale, evidence summary, source lock, risk, boundary, rollback, monitoring, stop condition, production boundary, and expiry.
- Keeps execution_packet_authorized, execution_authorized, execution_allowed, founder_instruction_granted, source_promotion_allowed, promotion_execution_allowed, implementation_authorized, implementation_execution_allowed, controlled_storage_entry_allowed, storage_write_enabled, canonical_write_allowed, source_write_executed, actual_storage_write_executed, production_ready, production_launch_allowed, and public_release_allowed false.

<!-- VEDAPATH FOUNDER AUTHORIZATION DECISION GATE NOTES END -->

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes("VEDAPATH FOUNDER AUTHORIZATION DECISION GATE NOTES START")) return content;
  return mustReplace(content, "<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD NOTES START -->", notesBlock + "<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD NOTES START -->", "prototype notes insertion");
});

const blueprintBlock = `<!-- VEDAPATH FOUNDER AUTHORIZATION DECISION GATE BLUEPRINT START -->
### 300. Founder Authorization Decision Gate

VedaPath should separate a founder decision posture from execution authorization. The founder can record that exact language may move to the next draft, but the system still cannot authorize or execute.

Core requirements:

- start from a controlled authorization hold ready object
- record one exact source-specific founder decision posture
- preserve evidence, source lock, risk, rollback, monitoring, stop condition, production boundary, and expiry
- permit only a future controlled execution packet authorization draft
- block authorization, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production

Founder Authorization Decision Gate should never claim execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.
<!-- VEDAPATH FOUNDER AUTHORIZATION DECISION GATE BLUEPRINT END -->

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("VEDAPATH FOUNDER AUTHORIZATION DECISION GATE BLUEPRINT START")) return content;
  return mustReplace(content, "<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD BLUEPRINT START -->", blueprintBlock + "<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD BLUEPRINT START -->", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.6 authorization hold<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision next, and production still closed.", "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft next, and production still closed.");
  if (!content.includes('href="founderauthorizationdecisiongate.html"')) {
    content = mustReplace(content, '<a href="controlledexecutionauthorizationhold.html">Authorization hold <span>decision</span></a>', '<a href="controlledexecutionauthorizationhold.html">Authorization hold <span>decision</span></a>\n              <a href="founderauthorizationdecisiongate.html">Founder decision <span>draft</span></a>', "study map founder decision link");
    content = mustReplace(content, '<a href="controlledexecutionauthorizationhold.html">Authorization hold <span>no-execution</span></a>', '<a href="controlledexecutionauthorizationhold.html">Authorization hold <span>no-execution</span></a>\n              <a href="founderauthorizationdecisiongate.html">Founder decision <span>no-authority</span></a>', "build map founder decision link");
  }
  return content;
});

update("controlledexecutionauthorizationhold.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.6 authorization hold<\/span>/g, `<span class="version">${badge}</span>`);
  if (!content.includes('href="founderauthorizationdecisiongate.html"')) {
    content = mustReplace(content, '<a class="button safe" href="controlledexecutionpacketdraft.html">Open Packet Draft</a>', '<a class="button safe" href="controlledexecutionpacketdraft.html">Open Packet Draft</a>\n            <a class="button" href="founderauthorizationdecisiongate.html">Open Decision Gate</a>', "authorization hold decision gate link");
  }
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.6 authorization hold<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("<strong>v3.1.6</strong>\n          <p>Controlled Execution Authorization Hold: review-ready packets now get constrained founder-facing authorization language while authorization, execution, storage, public release, and production remain false.</p>", "<strong>v3.1.7</strong>\n          <p>Founder Authorization Decision Gate: held authorization language now receives founder decision posture while authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace("<strong>98%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:98%\"></div></div>\n          <p>The trust loop now holds authorization language separately from actual authorization while every real write path remains closed.</p>", "<strong>99%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:99%\"></div></div>\n          <p>The trust loop now records founder decision posture separately from actual authorization while every real write path remains closed.</p>");
  content = content.replace("<span>Next release</span>\n          <strong>Founder authorization decision gate</strong>\n          <p>Let the founder review the exact authorization language while execution remains blocked.</p>", "<span>Next release</span>\n          <strong>Controlled execution packet authorization draft</strong>\n          <p>Draft the execution-packet authorization shape while no authorization is granted.</p>");
  if (!content.includes("Phase 281: Founder Authorization Decision Gate")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 281: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 281: Founder Authorization Decision Gate</strong>
                <p>Records founder decision posture for held authorization language while authorization, execution, storage writes, canonical writes, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 282: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.1.6 Controlled Execution Authorization Hold</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.1.7 Founder Authorization Decision Gate</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.1.5 Controlled Execution Review Gate</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Hold authorization language without granting authorization or execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Record founder decision posture without granting authorization or execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for founder authorization decision gate</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled execution packet authorization draft</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Build founder authorization decision gate.</span></li>\n              <li><span class="dot"></span><span>Show exact authorization language for founder review.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Require explicit decision notes before any later execution packet.</span></li>', '<li><span class="dot"></span><span>Build controlled execution packet authorization draft.</span></li>\n              <li><span class="dot"></span><span>Use founder decision posture as draft input only.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Require another review before any authorization can be discussed.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.1\.6 authorization hold<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} founder authorization decision gate applied.`);

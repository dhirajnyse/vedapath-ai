import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.1.3";
const badge = "v3.1.3 founder gate";
const previousRelease = "v3.1.2 Promotion Execution Preflight";

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

const preflightConfig = JSON.parse(read("data/vedapath-promotion-execution-preflight.json"));
const preflight = preflightConfig.sample_preflight;

const samplePreflightPacket = {
  schema_version: preflightConfig.schema_version,
  release: preflightConfig.release,
  promotion_execution_preflight_id: "promotion-execution-preflight-sample-steady-action-bg-2-48",
  preflight_status: "Execution preflight ready",
  execution_preflight_review_ready: true,
  execution_preflight_passed: false,
  execution_authorized: false,
  execution_allowed: false,
  source_promotion_allowed: false,
  promotion_execution_allowed: false,
  implementation_authorized: false,
  implementation_execution_allowed: false,
  founder_instruction_granted: false,
  production_ready: false,
  production_launch_allowed: false,
  public_release_allowed: false,
  controlled_storage_entry_allowed: false,
  canonical_write_allowed: false,
  storage_write_enabled: false,
  source_write_executed: false,
  actual_storage_write_executed: false,
  next_gate_required: "Founder execution instruction gate",
  source_promotion_hold_review_id: preflight.source_promotion_hold_review_id,
  implementation_authorization_dry_run_id: preflight.implementation_authorization_dry_run_id,
  founder_instruction_gate_id: preflight.founder_instruction_gate_id,
  entry_dry_run_id: preflight.entry_dry_run_id,
  criteria_packet_id: preflight.criteria_packet_id,
  replay_receipt_id: preflight.replay_receipt_id,
  rollback_receipt_id: preflight.rollback_receipt_id,
  audit_receipt_id: preflight.audit_receipt_id,
  source_answer_id: preflight.source_answer_id,
  source_record_id: preflight.source_record_id,
  source_family: preflight.source_family,
  preflight_scope: preflight.preflight_scope,
  execution_conditions: preflight.execution_conditions,
  readonly_rehearsal: preflight.readonly_rehearsal,
  final_blockers: preflight.final_blockers,
  rollback_plan: preflight.rollback_plan,
  monitoring_plan: preflight.monitoring_plan,
  human_approval_check: preflight.human_approval_check,
  execution_boundary: preflight.execution_boundary,
  production_boundary: preflight.production_boundary,
  created_at: "2026-06-27T00:00:00.000Z"
};

const config = {
  schema_version: "founder-execution-instruction-gate-v1",
  release,
  generated_at: "2026-06-27T00:00:00.000Z",
  title: "Founder Execution Instruction Gate",
  summary: "Records a founder instruction review after execution preflight while keeping instruction, execution, storage, canonical writes, migrations, accounts, secrets, public release, and production disabled.",
  previous_release: previousRelease,
  source: {
    promotion_execution_preflight_release: preflightConfig.release,
    promotion_execution_preflight_schema: preflightConfig.schema_version,
    promotion_execution_preflight_id: samplePreflightPacket.promotion_execution_preflight_id,
    source_answer_id: samplePreflightPacket.source_answer_id,
    source_record_id: samplePreflightPacket.source_record_id,
    source_family: samplePreflightPacket.source_family,
    source_promotion_hold_review_id: samplePreflightPacket.source_promotion_hold_review_id,
    implementation_authorization_dry_run_id: samplePreflightPacket.implementation_authorization_dry_run_id
  },
  instruction_states: [
    "Draft founder instruction",
    "Needs founder clarification",
    "Founder instruction ready",
    "Return to preflight",
    "Founder hold",
    "Execution blocked",
    "Production forbidden",
    "Instruction expired"
  ],
  required_by_state: {
    "Draft founder instruction": ["promotion_execution_preflight_id", "source_answer_id", "founder_instruction_text"],
    "Needs founder clarification": ["clarification_question", "source_specific_scope"],
    "Founder instruction ready": [
      "founder_name",
      "founder_instruction_text",
      "source_specific_scope",
      "allowed_next_step",
      "prohibited_actions",
      "reviewer_requirement",
      "rollback_acceptance",
      "monitoring_acceptance",
      "expiry_check",
      "boundary_statement",
      "production_boundary"
    ],
    "Return to preflight": ["return_reason"],
    "Founder hold": ["hold_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Instruction expired": ["expiry_check", "hold_reason"]
  },
  instruction_checks: [
    {
      check: "Preflight ready",
      rule: "Founder instruction can only begin from an execution preflight ready packet whose next gate is founder execution instruction gate."
    },
    {
      check: "Instruction is scoped",
      rule: "The instruction must name the exact source answer and permit only a future controlled execution packet draft."
    },
    {
      check: "No authority leap",
      rule: "Founder instruction review does not grant execution, storage writes, canonical writes, migration, secrets, public release, or production."
    },
    {
      check: "Reviewer separation",
      rule: "Founder instruction and source-specific human review remain separate checks."
    },
    {
      check: "Rollback and monitoring",
      rule: "Rollback, replay, before_hash, stop condition, audit receipt, and post-execution verification must remain visible before any future write request."
    },
    {
      check: "Expiry",
      rule: "Founder instruction is not permanent; material source, rights, reviewer, or code changes require recheck."
    }
  ],
  sample_preflight_packet: samplePreflightPacket,
  sample_instruction: {
    instruction_state: "Founder instruction ready",
    instruction_actor: "Founder execution instruction reviewer",
    founder_name: "Founder review sample",
    founder_instruction_text: "Founder instruction sample: prepare a controlled execution packet for source answer answer-steady-action-bg-2-48. Do not execute, promote, store, write canonical source, run migration, create account, use secrets, or launch production.",
    promotion_execution_preflight_id: samplePreflightPacket.promotion_execution_preflight_id,
    source_answer_id: samplePreflightPacket.source_answer_id,
    source_record_id: samplePreflightPacket.source_record_id,
    source_family: samplePreflightPacket.source_family,
    source_specific_scope: "Use only source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti. No scope creep; rights, translation, reviewer evidence, and source-owner scope must be present.",
    allowed_next_step: "Draft a controlled execution packet only; no write, no source promotion, no storage, no canonical update, and no production launch.",
    prohibited_actions: "Do not execute, promote, store, write canonical source, run migration, create account, use secrets, enable durable storage, public release, or launch production.",
    reviewer_requirement: "A named human reviewer must confirm source-owner scope, rights and translation status, citation, reviewer evidence, and source-specific human approval separate from founder review.",
    rollback_acceptance: "Rollback and replay receipts, before_hash restore path, failure review, and stop condition must be visible before any future write request.",
    monitoring_acceptance: "Future execution packet must expose audit receipt, stop condition, reviewer handoff, post-execution verification, and failure review before any write.",
    expiry_check: "This founder instruction sample expires at the next material source, rights, reviewer, or code change and must be rechecked; it is not permanent approval.",
    boundary_statement: "Founder instruction gate only; founder_instruction_granted remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, or public release path is opened.",
    next_gate: "Controlled execution packet draft",
    clarification_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    founder_execution_instruction_packet_ready: false,
    founder_instruction_granted: false,
    execution_authorized: false,
    execution_allowed: false,
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
    next_gate_required: "Controlled execution packet draft"
  }
};

write("data/vedapath-founder-execution-instruction-gate.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-founder-execution-instruction-gate.css", `/* VedaPath founder execution instruction gate */
.founder-gate,
.founder-head,
.founder-layout,
.founder-form,
.founder-grid,
.founder-list,
.founder-actions,
.founder-rules {
  display: grid;
  gap: 10px;
}

.founder-gate { gap: 16px; }

.founder-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.founder-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.founder-mark img {
  display: block;
  width: 100%;
}

.founder-layout {
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  align-items: start;
}

.founder-form,
.founder-card,
.founder-result,
.founder-packet,
.founder-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.founder-form,
.founder-card,
.founder-result,
.founder-rule {
  padding: 12px;
}

.founder-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.founder-form input,
.founder-form select,
.founder-form textarea,
.founder-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.founder-form textarea,
.founder-packet {
  min-height: 100px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.founder-grid,
.founder-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.founder-card,
.founder-result {
  border-left: 4px solid var(--gold);
}

.founder-card.ready,
.founder-result[data-state="Founder instruction ready"] {
  border-left-color: var(--green);
}

.founder-card.blocked,
.founder-result[data-state="Blocked"],
.founder-result[data-state="Return to preflight"],
.founder-result[data-state="Founder hold"],
.founder-result[data-state="Execution blocked"],
.founder-result[data-state="Production forbidden"],
.founder-result[data-state="Instruction expired"] {
  border-left-color: var(--ochre);
}

.founder-card span,
.founder-card strong,
.founder-rule span,
.founder-rule strong {
  display: block;
}

.founder-card span,
.founder-rule span {
  color: var(--muted);
  font-size: 12px;
}

.founder-result strong {
  display: block;
  font-size: 24px;
}

.founder-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.founder-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.founder-list {
  max-height: 320px;
  overflow: auto;
}

.founder-packet {
  min-height: 260px;
}

.founder-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  .founder-layout,
  .founder-head,
  .founder-grid,
  .founder-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .founder-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-founder-execution-instruction-gate.js", `(() => {
  const storageKey = "vedapath-founder-execution-instruction-gate";
  const root = document.getElementById("founderExecutionInstructionGate");
  const savedRoot = document.getElementById("founderSaved");
  const resultCard = document.getElementById("founderResultCard");
  const packetOutput = document.getElementById("founderPacket");
  const checksRoot = document.getElementById("founderChecks");
  const scopeRoot = document.getElementById("founderScope");

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

  function preflightReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "promotion-execution-preflight-v1" &&
      packet.preflight_status === "Execution preflight ready" &&
      packet.execution_preflight_review_ready === true &&
      packet.execution_preflight_passed === false &&
      packet.execution_authorized === false &&
      packet.execution_allowed === false &&
      packet.source_promotion_allowed === false &&
      packet.promotion_execution_allowed === false &&
      packet.implementation_authorized === false &&
      packet.implementation_execution_allowed === false &&
      packet.founder_instruction_granted === false &&
      packet.production_ready === false &&
      packet.production_launch_allowed === false &&
      packet.public_release_allowed === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.canonical_write_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.next_gate_required === "Founder execution instruction gate";
  }

  function keepsFounderBoundary(value) {
    const text = String(value || "");
    const required = [
      /founder_instruction_granted remains false/i,
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
    const unsafe = /(founder_instruction_granted true|execution_authorized true|execution_allowed true|source_promotion_allowed true|promotion_execution_allowed true|implementation_authorized true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|production_launch_allowed true|public_release_allowed true|execute now|write enabled|canonical update|migration run|secret use|launch production)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["opened"]]);
  }

  function founderMissingForState(config, state, instruction = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(instruction[field] || "").trim());
  }

  function idMatches(instruction, packet, key) {
    return !instruction[key] || !packet[key] || instruction[key] === packet[key];
  }

  function founderExecutionInstructionGate(config, preflightPacket, instruction) {
    const state = instruction.instruction_state || "Draft founder instruction";
    const missing = founderMissingForState(config, state, instruction);
    const blocked = [];

    if (!preflightReady(preflightPacket)) blocked.push("promotion execution preflight packet must be ready while execution, storage, canonical, and production flags remain false");
    ["promotion_execution_preflight_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(instruction, preflightPacket, key)) blocked.push(key + " must match the execution preflight packet");
    });

    const readyCandidate = state === "Founder instruction ready";
    if (readyCandidate && !hasText(instruction.founder_instruction_text, [["prepare"], ["controlled execution packet"], ["source answer"], ["do not", "execute"], ["promote"], ["store"], ["canonical"], ["migration"], ["account"], ["secrets"], ["production"]])) {
      blocked.push("founder instruction must permit only a controlled execution packet draft and explicitly forbid execution, promotion, storage, canonical writes, migration, account creation, secrets, and production");
    }
    if (readyCandidate && !hasText(instruction.source_specific_scope, [["source_answer_id"], ["source_record_id"], ["source family"], ["no scope creep"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"]])) {
      blocked.push("scope must name source answer, source record, source family, no scope creep, rights, translation, reviewer evidence, and source-owner scope");
    }
    if (readyCandidate && !hasText(instruction.allowed_next_step, [["draft"], ["controlled execution packet"], ["no write"], ["no source promotion"], ["no storage"], ["no canonical"], ["no production"]])) {
      blocked.push("allowed next step must be draft-only and forbid write, promotion, storage, canonical, and production");
    }
    if (readyCandidate && !hasText(instruction.prohibited_actions, [["do not"], ["execute"], ["promote"], ["store"], ["canonical"], ["migration"], ["account"], ["secrets"], ["durable storage"], ["public release"], ["production"]])) {
      blocked.push("prohibited actions must block execution, promotion, storage, canonical writes, migration, account, secrets, durable storage, public release, and production");
    }
    if (readyCandidate && !hasText(instruction.reviewer_requirement, [["named human reviewer"], ["source-owner"], ["rights"], ["translation"], ["citation"], ["reviewer evidence"], ["source-specific human approval"], ["separate"], ["founder review"]])) {
      blocked.push("reviewer requirement must keep named human review separate from founder review");
    }
    if (readyCandidate && !hasText(instruction.rollback_acceptance, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["before any future write"]])) {
      blocked.push("rollback acceptance must include rollback, replay, before_hash, failure review, stop condition, and before-write boundary");
    }
    if (readyCandidate && !hasText(instruction.monitoring_acceptance, [["audit receipt"], ["stop condition"], ["reviewer handoff"], ["post-execution verification"], ["failure review"], ["before any write"]])) {
      blocked.push("monitoring acceptance must include audit, stop condition, reviewer handoff, post-execution verification, failure review, and before-write boundary");
    }
    if (readyCandidate && !hasText(instruction.expiry_check, [["expires"], ["material source"], ["rights"], ["reviewer"], ["code change"], ["rechecked"], ["not permanent approval"]])) {
      blocked.push("expiry check must state that the instruction expires and is not permanent approval");
    }
    if (readyCandidate && !keepsFounderBoundary(instruction.boundary_statement)) {
      blocked.push("boundary statement must keep founder grant, execution, promotion, storage, canonical, source-write, production, launch, and public release flags false");
    }
    if (readyCandidate && !keepsProductionBoundary(instruction.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, and durable storage paths closed");
    }
    if (state === "Needs founder clarification" && !instruction.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to preflight" && !instruction.return_reason) blocked.push("return reason is required");
    if (state === "Founder hold" && !instruction.hold_reason) blocked.push("hold reason is required");
    if (state === "Execution blocked" && !instruction.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !instruction.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Instruction expired" && !instruction.hold_reason) blocked.push("hold reason is required when instruction expires");

    const founder_instruction_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      founder_execution_instruction_gate_id: "founder-execution-instruction-gate-" + Date.now(),
      founder_instruction_status,
      founder_instruction_review_ready: founder_instruction_status === "Founder instruction ready",
      founder_execution_instruction_packet_ready: founder_instruction_status === "Founder instruction ready",
      founder_instruction_granted: false,
      execution_authorized: false,
      execution_allowed: false,
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
      promotion_execution_preflight_id: instruction.promotion_execution_preflight_id || preflightPacket.promotion_execution_preflight_id || "",
      source_answer_id: instruction.source_answer_id || preflightPacket.source_answer_id || "",
      source_record_id: instruction.source_record_id || preflightPacket.source_record_id || "",
      source_family: instruction.source_family || preflightPacket.source_family || "",
      instruction_actor: instruction.instruction_actor || "",
      founder_name: instruction.founder_name || "",
      founder_instruction_text: instruction.founder_instruction_text || "",
      source_specific_scope: instruction.source_specific_scope || "",
      allowed_next_step: instruction.allowed_next_step || "",
      prohibited_actions: instruction.prohibited_actions || "",
      reviewer_requirement: instruction.reviewer_requirement || "",
      rollback_acceptance: instruction.rollback_acceptance || "",
      monitoring_acceptance: instruction.monitoring_acceptance || "",
      expiry_check: instruction.expiry_check || "",
      boundary_statement: instruction.boundary_statement || "",
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

  function founderSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.founder_instruction_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Founder instruction ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Founder hold"] || 0,
      expired: byStatus["Instruction expired"] || 0,
      execution_enabled: packets.filter((packet) => packet.execution_allowed || packet.execution_authorized || packet.storage_write_enabled || packet.source_write_executed || packet.production_ready).length
    };
  }

  function parseFounderJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="founder-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.founder_instruction_status;
    resultCard.innerHTML = '<strong>' + safe(packet.founder_instruction_status) + '</strong>' +
      '<p class="muted">Instruction review ready: ' + safe(packet.founder_instruction_review_ready) + ' | Execution: ' + safe(packet.execution_allowed) + ' | Production: ' + safe(packet.production_ready) + '</p>' +
      '<div class="founder-grid">' +
        card("Preflight", packet.promotion_execution_preflight_id, packet.founder_instruction_review_ready ? "ready" : "") +
        card("Source answer", packet.source_answer_id) +
        card("Next gate", packet.next_gate_required) +
        card("Execution", packet.execution_allowed ? "enabled" : "false", packet.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready to draft a controlled execution packet. No founder grant, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.instruction_checks.map((check) =>
      '<article class="founder-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Preflight", config.source.promotion_execution_preflight_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parseFounderJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(packets) {
    localStorage.setItem(storageKey, JSON.stringify(packets.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const packets = readSaved();
    const snapshot = founderSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="founder-card ' + (packet.founder_instruction_review_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.founder_instruction_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathFounderExecutionInstructionGate = {
    founderExecutionInstructionGate,
    founderSnapshot,
    founderMissingForState,
    parseFounderJson
  };

  if (!root) return;

  fetch("data/vedapath-founder-execution-instruction-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        preflightPacket: root.querySelector("#founderPreflightPacket"),
        state: root.querySelector("#founderState"),
        actor: root.querySelector("#founderActor"),
        founder: root.querySelector("#founderName"),
        instruction: root.querySelector("#founderInstructionText"),
        preflightId: root.querySelector("#founderPreflightId"),
        sourceAnswer: root.querySelector("#founderSourceAnswer"),
        sourceRecord: root.querySelector("#founderSourceRecord"),
        sourceFamily: root.querySelector("#founderSourceFamily"),
        scope: root.querySelector("#founderScopeText"),
        allowed: root.querySelector("#founderAllowedNextStep"),
        prohibited: root.querySelector("#founderProhibitedActions"),
        reviewer: root.querySelector("#founderReviewerRequirement"),
        rollback: root.querySelector("#founderRollbackAcceptance"),
        monitoring: root.querySelector("#founderMonitoringAcceptance"),
        expiry: root.querySelector("#founderExpiryCheck"),
        boundary: root.querySelector("#founderBoundaryStatement"),
        production: root.querySelector("#founderProductionBoundary"),
        clarification: root.querySelector("#founderClarificationQuestion"),
        returnReason: root.querySelector("#founderReturnReason"),
        holdReason: root.querySelector("#founderHoldReason"),
        block: root.querySelector("#founderBlockReason")
      };

      config.instruction_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_instruction;
        fields.preflightPacket.value = JSON.stringify(config.sample_preflight_packet, null, 2);
        fields.state.value = item.instruction_state;
        fields.actor.value = item.instruction_actor;
        fields.founder.value = item.founder_name;
        fields.instruction.value = item.founder_instruction_text;
        fields.preflightId.value = item.promotion_execution_preflight_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.source_specific_scope;
        fields.allowed.value = item.allowed_next_step;
        fields.prohibited.value = item.prohibited_actions;
        fields.reviewer.value = item.reviewer_requirement;
        fields.rollback.value = item.rollback_acceptance;
        fields.monitoring.value = item.monitoring_acceptance;
        fields.expiry.value = item.expiry_check;
        fields.boundary.value = item.boundary_statement;
        fields.production.value = item.production_boundary;
        fields.clarification.value = item.clarification_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildInstruction() {
        return {
          instruction_state: fields.state.value,
          instruction_actor: fields.actor.value,
          founder_name: fields.founder.value,
          founder_instruction_text: fields.instruction.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          source_specific_scope: fields.scope.value,
          allowed_next_step: fields.allowed.value,
          prohibited_actions: fields.prohibited.value,
          reviewer_requirement: fields.reviewer.value,
          rollback_acceptance: fields.rollback.value,
          monitoring_acceptance: fields.monitoring.value,
          expiry_check: fields.expiry.value,
          boundary_statement: fields.boundary.value,
          production_boundary: fields.production.value,
          clarification_question: fields.clarification.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const preflightPacket = parseFounderJson(fields.preflightPacket.value, {});
        const packet = founderExecutionInstructionGate(config, preflightPacket, buildInstruction());
        packetOutput.value = JSON.stringify(packet, null, 2);
        renderResult(packet);
        return packet;
      }

      root.querySelector("#runFounderGate").addEventListener("click", run);
      root.querySelector("#loadFounderSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveFounderGate").addEventListener("click", () => {
        const packet = run();
        writeSaved([...readSaved(), packet]);
        renderSaved(config);
      });
      root.querySelector("#clearFounderGates").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyFounderPacket").addEventListener("click", async () => {
        if (!packetOutput.value) run();
        await navigator.clipboard.writeText(packetOutput.value);
      });

      loadSample();
      renderChecks(config);
      renderScope(config);
      run();
      renderSaved(config);
    });
})();
`);

write("founderexecutioninstructiongate.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Founder Execution Instruction Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-founder-execution-instruction-gate.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
  </head>
  <body>
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Founder execution instruction gate</span>
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

      <main class="workspace" aria-label="VedaPath Founder Execution Instruction Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Instruction is not execution</span>
          <h2>Make founder intent explicit</h2>
          <p class="muted">This room records a source-specific founder instruction for the next draft packet. It cannot execute, promote, store, migrate, use secrets, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Preflight</strong><p>Load ready packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Instruction</strong><p>Name the scope.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Reviewer</strong><p>Keep checks separate.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Boundary</strong><p>Forbid writes.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="promotionexecutionpreflight.html">Open Preflight</a>
            <a class="button safe" href="build-status.html">Open Build</a>
          </div>
        </aside>

        <section class="panel founder-gate" id="founderExecutionInstructionGate">
          <div class="founder-head">
            <div>
              <span class="eyebrow">Founder gate</span>
              <h1>Instruction with boundaries. No hidden authority.</h1>
              <p class="muted">A ready packet here means founder intent is explicit enough to draft a controlled execution packet later. It still cannot execute, promote, store, update canonical records, run migrations, create accounts, use secrets, or launch production.</p>
            </div>
            <div class="founder-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath founder execution instruction mark"></div>
          </div>

          <section class="founder-layout">
            <div class="founder-form">
              <h2>Founder Instruction Packet</h2>
              <label>Execution preflight packet<textarea id="founderPreflightPacket"></textarea></label>
              <label>Instruction state<select id="founderState"></select></label>
              <label>Instruction actor<input id="founderActor" type="text" placeholder="Founder execution instruction reviewer"></label>
              <label>Founder name<input id="founderName" type="text" placeholder="Founder review sample"></label>
              <label>Founder instruction<textarea id="founderInstructionText"></textarea></label>
              <label>Preflight id<input id="founderPreflightId" type="text"></label>
              <label>Source answer id<input id="founderSourceAnswer" type="text"></label>
              <label>Source record id<input id="founderSourceRecord" type="text"></label>
              <label>Source family<input id="founderSourceFamily" type="text"></label>
              <label>Source-specific scope<textarea id="founderScopeText"></textarea></label>
              <label>Allowed next step<textarea id="founderAllowedNextStep"></textarea></label>
              <label>Prohibited actions<textarea id="founderProhibitedActions"></textarea></label>
              <label>Reviewer requirement<textarea id="founderReviewerRequirement"></textarea></label>
              <label>Rollback acceptance<textarea id="founderRollbackAcceptance"></textarea></label>
              <label>Monitoring acceptance<textarea id="founderMonitoringAcceptance"></textarea></label>
              <label>Expiry check<textarea id="founderExpiryCheck"></textarea></label>
              <label>Boundary statement<textarea id="founderBoundaryStatement"></textarea></label>
              <label>Production boundary<textarea id="founderProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="founderClarificationQuestion"></textarea></label>
              <label>Return reason<textarea id="founderReturnReason"></textarea></label>
              <label>Hold reason<textarea id="founderHoldReason"></textarea></label>
              <label>Block reason<textarea id="founderBlockReason"></textarea></label>
              <div class="founder-actions">
                <button class="button primary" id="runFounderGate" type="button">Run Gate</button>
                <button class="button safe" id="loadFounderSample" type="button">Load Sample</button>
                <button class="button" id="saveFounderGate" type="button">Save Local</button>
                <button class="button" id="clearFounderGates" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="founder-result" id="founderResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Instruction Scope</h2>
                <div class="founder-list" id="founderScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Founder Gate Checks</h2>
            <div class="founder-rules" id="founderChecks"></div>
          </section>

          <section class="founder-layout">
            <div>
              <div class="founder-actions">
                <button class="button safe" id="copyFounderPacket" type="button">Copy Founder Packet</button>
                <a class="button" href="data/vedapath-founder-execution-instruction-gate.json">Open JSON</a>
              </div>
              <textarea class="founder-packet" id="founderPacket" aria-label="Founder execution instruction packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Founder Gates</h2>
              <div class="founder-list" id="founderSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Founder gate is not approval</span>
          <h2 style="margin-top: 14px;">Explicit Intent, Closed Execution</h2>
          <p class="muted">The gate asks what may be drafted next. It does not let any execution, storage, canonical, public release, or production path open silently.</p>
          <div class="progress" aria-label="Founder execution instruction gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>8</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Packet draft</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Founder Boundary</h2>
            <p class="founder-boundary">Founder instruction review only. Founder grant, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a controlled execution packet draft. It does not grant execution.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-founder-execution-instruction-gate.js"></script>
  </body>
</html>
`);

write("docs/FOUNDER_EXECUTION_INSTRUCTION_GATE.md", `# VedaPath AI Founder Execution Instruction Gate

Release: ${release}

This release records founder intent after execution preflight without granting execution.

## Files

- data/vedapath-founder-execution-instruction-gate.json
- founderexecutioninstructiongate.html
- assets/vedapath-founder-execution-instruction-gate.css
- assets/vedapath-founder-execution-instruction-gate.js

## What It Adds

The room:

- starts from a promotion execution preflight ready packet
- requires source-specific founder instruction text
- permits only a future controlled execution packet draft
- keeps founder instruction and named human review separate
- requires rollback, replay, before_hash, monitoring, and expiry language
- keeps execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production false

## Boundary

Founder execution instruction is not execution approval. It does not promote source data, run storage writes, update canonical source records, run migrations, create accounts, use secrets, publish public release state, or launch production. The next release should draft a controlled execution packet while every write and production flag remains false.
`);

const readmeBlock = `<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE START -->
## ${release} Founder Execution Instruction Gate

This release records a source-specific founder instruction review after execution preflight while all execution, promotion, storage, canonical-write, migration, account, secret, public-release, and production flags stay false.

- [Founder Execution Instruction Gate](founderexecutioninstructiongate.html)
- [Founder Execution Instruction Gate Notes](docs/FOUNDER_EXECUTION_INSTRUCTION_GATE.md)
- [Founder Execution Instruction Gate Data](data/vedapath-founder-execution-instruction-gate.json)

<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE END -->

`;

update("README.md", (content) => {
  if (content.includes("VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE START")) return content;
  return mustReplace(content, "<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT START -->", readmeBlock + "<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT START -->", "README insertion");
});

const notesBlock = `<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE NOTES START -->
## ${release} Founder Execution Instruction Gate

This phase captures founder instruction boundaries without enabling execution.

- Adds a founder execution instruction gate room.
- Reads a promotion execution preflight ready packet.
- Requires source-specific founder instruction, allowed next step, prohibited actions, reviewer separation, rollback, monitoring, expiry, boundary, and production boundary.
- Keeps founder_instruction_granted, execution_authorized, execution_allowed, source_promotion_allowed, promotion_execution_allowed, implementation_authorized, implementation_execution_allowed, controlled_storage_entry_allowed, storage_write_enabled, canonical_write_allowed, source_write_executed, actual_storage_write_executed, production_ready, production_launch_allowed, and public_release_allowed false.

<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE NOTES END -->

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes("VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE NOTES START")) return content;
  return mustReplace(content, "<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT NOTES START -->", notesBlock + "<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT NOTES START -->", "prototype notes insertion");
});

const blueprintBlock = `<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE BLUEPRINT START -->
### 296. Founder Execution Instruction Gate

VedaPath should never infer founder authority from product momentum. The founder execution instruction gate asks for a source-specific instruction before any controlled execution packet can even be drafted.

Core requirements:

- start from a promotion execution preflight ready packet
- name the exact source answer, source record, and source family
- permit only a future controlled execution packet draft
- keep founder instruction separate from named human review
- require rollback, replay, before_hash, monitoring, stop condition, and expiry checks
- block execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production
- route next to a controlled execution packet draft

Founder Execution Instruction Gate should never claim execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.
<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE BLUEPRINT END -->

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE BLUEPRINT START")) return content;
  return mustReplace(content, "<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT BLUEPRINT START -->", blueprintBlock + "<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT BLUEPRINT START -->", "product blueprint insertion");
});

update("index.html", (content) => {
  if (!content.includes('href="founderexecutioninstructiongate.html"')) {
    content = mustReplace(content, '<a href="promotionexecutionpreflight.html">Execution preflight <span>dry run</span></a>', '<a href="promotionexecutionpreflight.html">Execution preflight <span>dry run</span></a>\n              <a href="founderexecutioninstructiongate.html">Founder gate <span>execution</span></a>', "study map founder link");
    content = mustReplace(content, '<a href="promotionexecutionpreflight.html">Execution preflight <span>blocked</span></a>', '<a href="promotionexecutionpreflight.html">Execution preflight <span>blocked</span></a>\n              <a href="founderexecutioninstructiongate.html">Founder gate <span>instruction</span></a>', "build map founder link");
  }
  return content;
});

update("promotionexecutionpreflight.html", (content) => {
  if (!content.includes('href="founderexecutioninstructiongate.html"')) {
    content = mustReplace(content, '<a class="button safe" href="implementationauthorizationdryrun.html">Open Authorization</a>', '<a class="button safe" href="implementationauthorizationdryrun.html">Open Authorization</a>\n            <a class="button" href="founderexecutioninstructiongate.html">Open Founder Gate</a>', "preflight founder gate link");
  }
  content = content.replace("This release prepares the founder execution instruction gate. It does not grant approval.", "This release feeds the founder execution instruction gate. It does not grant approval.");
  return content;
});

update("build-status.html", (content) => {
  content = content.replace("<strong>v3.1.2</strong>\n          <p>Promotion Execution Preflight: promotion hold packets now dry-run final execution readiness while execution, promotion, storage, migrations, secrets, canonical writes, and production remain false.</p>", "<strong>v3.1.3</strong>\n          <p>Founder Execution Instruction Gate: execution preflight packets now require explicit source-specific founder instruction before any controlled execution packet can be drafted.</p>");
  content = content.replace("<strong>94%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:94%\"></div></div>\n          <p>The trust loop now dry-runs final execution readiness while every real write path remains closed.</p>", "<strong>95%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:95%\"></div></div>\n          <p>The trust loop now asks for explicit founder intent while every real write path remains closed.</p>");
  content = content.replace("<span>Next release</span>\n          <strong>Founder execution instruction gate</strong>\n          <p>Define explicit founder instruction required after preflight before any real write path.</p>", "<span>Next release</span>\n          <strong>Controlled execution packet draft</strong>\n          <p>Draft the first execution packet shape while writes and production stay blocked.</p>");
  if (!content.includes("Phase 277: Founder Execution Instruction Gate")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 277: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 277: Founder Execution Instruction Gate</strong>
                <p>Records source-specific founder instruction after execution preflight while founder grant, execution, storage writes, canonical writes, migrations, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 278: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.1.2 Promotion Execution Preflight</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.1.3 Founder Execution Instruction Gate</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.1.1 Source Promotion Hold Review</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.1.2 Promotion Execution Preflight</strong></div>');
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Dry-run execution preflight without enabling execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Make founder instruction explicit before controlled execution packet drafting.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for founder execution instruction gate</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled execution packet draft</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Define founder execution instruction requirements.</span></li>\n              <li><span class="dot"></span><span>Keep execution and production writes disabled.</span></li>\n              <li><span class="dot"></span><span>Confirm human approval is source-specific.</span></li>\n              <li><span class="dot"></span><span>Preserve rollback, monitoring, and source-owner evidence.</span></li>', '<li><span class="dot"></span><span>Draft controlled execution packet fields.</span></li>\n              <li><span class="dot"></span><span>Keep founder grant and execution disabled.</span></li>\n              <li><span class="dot"></span><span>Require reviewer, rollback, and monitoring evidence.</span></li>\n              <li><span class="dot"></span><span>Preserve storage, canonical, public release, and production blocks.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.1\.2 preflight<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} founder execution instruction gate applied.`);

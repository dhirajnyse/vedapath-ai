import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.1.4";
const badge = "v3.1.4 packet draft";
const previousRelease = "v3.1.3 Founder Execution Instruction Gate";

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

const founderConfig = JSON.parse(read("data/vedapath-founder-execution-instruction-gate.json"));
const instruction = founderConfig.sample_instruction;

const sampleFounderPacket = {
  schema_version: founderConfig.schema_version,
  release: founderConfig.release,
  founder_execution_instruction_gate_id: "founder-execution-instruction-gate-sample-steady-action-bg-2-48",
  founder_instruction_status: "Founder instruction ready",
  founder_instruction_review_ready: true,
  founder_execution_instruction_packet_ready: true,
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
  next_gate_required: "Controlled execution packet draft",
  promotion_execution_preflight_id: instruction.promotion_execution_preflight_id,
  source_answer_id: instruction.source_answer_id,
  source_record_id: instruction.source_record_id,
  source_family: instruction.source_family,
  founder_name: instruction.founder_name,
  founder_instruction_text: instruction.founder_instruction_text,
  source_specific_scope: instruction.source_specific_scope,
  allowed_next_step: instruction.allowed_next_step,
  prohibited_actions: instruction.prohibited_actions,
  reviewer_requirement: instruction.reviewer_requirement,
  rollback_acceptance: instruction.rollback_acceptance,
  monitoring_acceptance: instruction.monitoring_acceptance,
  expiry_check: instruction.expiry_check,
  boundary_statement: instruction.boundary_statement,
  production_boundary: instruction.production_boundary,
  created_at: "2026-06-27T00:00:00.000Z"
};

const config = {
  schema_version: "controlled-execution-packet-draft-v1",
  release,
  generated_at: "2026-06-27T00:00:00.000Z",
  title: "Controlled Execution Packet Draft",
  summary: "Drafts the first controlled execution packet from founder instruction while keeping authorization, execution, storage writes, canonical writes, migrations, accounts, secrets, public release, and production disabled.",
  previous_release: previousRelease,
  source: {
    founder_gate_release: founderConfig.release,
    founder_gate_schema: founderConfig.schema_version,
    founder_execution_instruction_gate_id: sampleFounderPacket.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: sampleFounderPacket.promotion_execution_preflight_id,
    source_answer_id: sampleFounderPacket.source_answer_id,
    source_record_id: sampleFounderPacket.source_record_id,
    source_family: sampleFounderPacket.source_family
  },
  packet_states: [
    "Draft controlled execution packet",
    "Needs packet review",
    "Controlled packet draft ready",
    "Return to founder gate",
    "Execution hold",
    "Execution blocked",
    "Production forbidden",
    "Draft expired"
  ],
  required_by_state: {
    "Draft controlled execution packet": ["founder_execution_instruction_gate_id", "source_answer_id", "execution_intent"],
    "Needs packet review": ["review_question", "source_context"],
    "Controlled packet draft ready": [
      "source_context",
      "execution_intent",
      "readonly_execution_plan",
      "preconditions",
      "reviewer_gates",
      "rollback_plan",
      "monitoring_plan",
      "stop_condition",
      "no_write_boundary",
      "production_boundary",
      "expiry_check"
    ],
    "Return to founder gate": ["return_reason"],
    "Execution hold": ["hold_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Draft expired": ["expiry_check", "hold_reason"]
  },
  packet_checks: [
    {
      check: "Founder gate ready",
      rule: "The draft can only start from a founder instruction ready packet whose next gate is controlled execution packet draft."
    },
    {
      check: "Draft only",
      rule: "A controlled execution packet draft describes a future review shape; it does not authorize or execute."
    },
    {
      check: "Source locked",
      rule: "The packet must name the exact source answer, source record, source family, and founder gate packet."
    },
    {
      check: "Reviewer gates",
      rule: "A named reviewer, source-owner scope, rights, translation, rollback, and monitoring checks remain required."
    },
    {
      check: "Stop condition",
      rule: "Any mismatch, missing evidence, true write flag, source change, rights change, reviewer change, or code change stops the packet."
    },
    {
      check: "No write boundary",
      rule: "Authorization, execution, source promotion, storage, canonical writes, migrations, accounts, secrets, public release, and production stay false."
    }
  ],
  sample_founder_packet: sampleFounderPacket,
  sample_packet: {
    packet_state: "Controlled packet draft ready",
    packet_actor: "Controlled execution packet drafter",
    founder_execution_instruction_gate_id: sampleFounderPacket.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: sampleFounderPacket.promotion_execution_preflight_id,
    source_answer_id: sampleFounderPacket.source_answer_id,
    source_record_id: sampleFounderPacket.source_record_id,
    source_family: sampleFounderPacket.source_family,
    source_context: "Draft is locked to source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti. Rights, translation status, citation, reviewer evidence, source-owner scope, and founder instruction must remain visible.",
    execution_intent: "Draft a future controlled execution request for reviewer inspection only. Do not execute, authorize, promote, store, write canonical source, run migration, create account, use secrets, publish public release, or launch production.",
    readonly_execution_plan: "Readonly plan only: assemble packet fields, compare source ids, check reviewer gates, inspect rollback and monitoring references, and produce a review handoff without touching storage, canonical records, accounts, secrets, migrations, public release, or production.",
    preconditions: "Founder instruction ready, promotion execution preflight ready, source answer id match, source record id match, source family match, rights and translation reviewed, source-owner scope present, reviewer evidence present, rollback plan present, and monitoring plan present.",
    reviewer_gates: "Named human reviewer must confirm source-owner scope, rights and translation status, citation, reviewer evidence, source-specific human approval, founder instruction scope, rollback reference, and monitoring plan before any future execution review.",
    rollback_plan: "Rollback plan references replay receipt, rollback receipt, before_hash restore path, failure review, stop condition, and reviewer handoff; no source state is written in this draft.",
    monitoring_plan: "Monitoring plan must expose audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and explicit before-write check.",
    stop_condition: "Stop if source ids mismatch, source text changes, rights change, reviewer evidence is missing, source-owner scope is missing, founder instruction expires, rollback is missing, monitoring is missing, or any authorization, execution, storage, canonical, public release, or production flag becomes true.",
    no_write_boundary: "Controlled execution packet draft only; controlled_execution_packet_draft_ready may be true, but execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, founder_instruction_granted remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    expiry_check: "Draft expires at the next material source, rights, reviewer, founder instruction, rollback, monitoring, or code change and must be rechecked; it is not permanent approval.",
    next_gate: "Controlled execution review gate",
    review_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    controlled_execution_packet_draft_ready: false,
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
    next_gate_required: "Controlled execution review gate"
  }
};

write("data/vedapath-controlled-execution-packet-draft.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-controlled-execution-packet-draft.css", `/* VedaPath controlled execution packet draft */
.packet-draft,
.packet-head,
.packet-layout,
.packet-form,
.packet-grid,
.packet-list,
.packet-actions,
.packet-rules {
  display: grid;
  gap: 10px;
}

.packet-draft { gap: 16px; }

.packet-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.packet-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.packet-mark img {
  display: block;
  width: 100%;
}

.packet-layout {
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  align-items: start;
}

.packet-form,
.packet-card,
.packet-result,
.packet-output,
.packet-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.packet-form,
.packet-card,
.packet-result,
.packet-rule {
  padding: 12px;
}

.packet-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.packet-form input,
.packet-form select,
.packet-form textarea,
.packet-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.packet-form textarea,
.packet-output {
  min-height: 100px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.packet-grid,
.packet-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.packet-card,
.packet-result {
  border-left: 4px solid var(--gold);
}

.packet-card.ready,
.packet-result[data-state="Controlled packet draft ready"] {
  border-left-color: var(--green);
}

.packet-card.blocked,
.packet-result[data-state="Blocked"],
.packet-result[data-state="Return to founder gate"],
.packet-result[data-state="Execution hold"],
.packet-result[data-state="Execution blocked"],
.packet-result[data-state="Production forbidden"],
.packet-result[data-state="Draft expired"] {
  border-left-color: var(--ochre);
}

.packet-card span,
.packet-card strong,
.packet-rule span,
.packet-rule strong {
  display: block;
}

.packet-card span,
.packet-rule span {
  color: var(--muted);
  font-size: 12px;
}

.packet-result strong {
  display: block;
  font-size: 24px;
}

.packet-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.packet-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.packet-list {
  max-height: 320px;
  overflow: auto;
}

.packet-output {
  min-height: 260px;
}

.packet-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  .packet-layout,
  .packet-head,
  .packet-grid,
  .packet-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .packet-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-controlled-execution-packet-draft.js", `(() => {
  const storageKey = "vedapath-controlled-execution-packet-draft";
  const root = document.getElementById("controlledExecutionPacketDraft");
  const savedRoot = document.getElementById("packetSaved");
  const resultCard = document.getElementById("packetResultCard");
  const packetOutput = document.getElementById("packetOutput");
  const checksRoot = document.getElementById("packetChecks");
  const scopeRoot = document.getElementById("packetScope");

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

  function founderInstructionReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "founder-execution-instruction-gate-v1" &&
      packet.founder_instruction_status === "Founder instruction ready" &&
      packet.founder_instruction_review_ready === true &&
      packet.founder_execution_instruction_packet_ready === true &&
      packet.founder_instruction_granted === false &&
      packet.execution_authorized === false &&
      packet.execution_allowed === false &&
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
      packet.next_gate_required === "Controlled execution packet draft";
  }

  function keepsDraftBoundary(value) {
    const text = String(value || "");
    const required = [
      /controlled_execution_packet_draft_ready may be true/i,
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
    const unsafe = /(execution_packet_authorized true|execution_authorized true|execution_allowed true|founder_instruction_granted true|source_promotion_allowed true|promotion_execution_allowed true|implementation_authorized true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|production_launch_allowed true|public_release_allowed true|execute now|write enabled|canonical update|migration run|secret use|launch production)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function packetMissingForState(config, state, packet = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(packet[field] || "").trim());
  }

  function idMatches(packetDraft, founderPacket, key) {
    return !packetDraft[key] || !founderPacket[key] || packetDraft[key] === founderPacket[key];
  }

  function controlledExecutionPacketDraft(config, founderPacket, packetDraft) {
    const state = packetDraft.packet_state || "Draft controlled execution packet";
    const missing = packetMissingForState(config, state, packetDraft);
    const blocked = [];

    if (!founderInstructionReady(founderPacket)) blocked.push("founder instruction packet must be ready while founder grant, execution, storage, canonical, public release, and production flags remain false");
    ["founder_execution_instruction_gate_id", "promotion_execution_preflight_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(packetDraft, founderPacket, key)) blocked.push(key + " must match the founder instruction packet");
    });

    const readyCandidate = state === "Controlled packet draft ready";
    if (readyCandidate && !hasText(packetDraft.source_context, [["source_answer_id"], ["source_record_id"], ["source family"], ["rights"], ["translation"], ["citation"], ["reviewer evidence"], ["source-owner"], ["founder instruction"]])) {
      blocked.push("source context must keep source ids, source family, rights, translation, citation, reviewer evidence, source-owner scope, and founder instruction visible");
    }
    if (readyCandidate && !hasText(packetDraft.execution_intent, [["future controlled execution"], ["reviewer inspection"], ["do not", "execute"], ["authorize"], ["promote"], ["store"], ["canonical"], ["migration"], ["account"], ["secrets"], ["public release"], ["production"]])) {
      blocked.push("execution intent must be future-only, reviewer-inspected, and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && !hasText(packetDraft.readonly_execution_plan, [["readonly plan"], ["assemble packet fields"], ["compare source ids"], ["reviewer gates"], ["rollback"], ["monitoring"], ["without touching"], ["storage"], ["canonical"], ["accounts"], ["secrets"], ["migrations"], ["public release"], ["production"]])) {
      blocked.push("readonly plan must assemble fields, compare source ids, check gates, and avoid all execution surfaces");
    }
    if (readyCandidate && !hasText(packetDraft.preconditions, [["founder instruction ready"], ["promotion execution preflight ready"], ["source answer id match"], ["source record id match"], ["source family match"], ["rights"], ["translation"], ["source-owner"], ["reviewer evidence"], ["rollback"], ["monitoring"]])) {
      blocked.push("preconditions must include founder, preflight, source ids, rights, translation, owner scope, reviewer evidence, rollback, and monitoring");
    }
    if (readyCandidate && !hasText(packetDraft.reviewer_gates, [["named human reviewer"], ["source-owner"], ["rights"], ["translation"], ["citation"], ["reviewer evidence"], ["source-specific human approval"], ["founder instruction"], ["rollback"], ["monitoring"]])) {
      blocked.push("reviewer gates must require named human review, source-owner scope, rights, translation, citation, evidence, founder scope, rollback, and monitoring");
    }
    if (readyCandidate && !hasText(packetDraft.rollback_plan, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["no source state"]])) {
      blocked.push("rollback plan must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, and no source state write");
    }
    if (readyCandidate && !hasText(packetDraft.monitoring_plan, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"]])) {
      blocked.push("monitoring plan must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check");
    }
    if (readyCandidate && !hasText(packetDraft.stop_condition, [["stop"], ["source ids mismatch"], ["source text changes"], ["rights change"], ["reviewer evidence"], ["source-owner"], ["founder instruction expires"], ["rollback"], ["monitoring"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on mismatches, source or rights changes, missing evidence, expiry, missing rollback/monitoring, or any true write flag");
    }
    if (readyCandidate && !keepsDraftBoundary(packetDraft.no_write_boundary)) {
      blocked.push("no-write boundary must keep authorization, execution, founder grant, promotion, storage, canonical, source-write, production, launch, and public release flags false");
    }
    if (readyCandidate && !keepsProductionBoundary(packetDraft.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (readyCandidate && !hasText(packetDraft.expiry_check, [["expires"], ["material source"], ["rights"], ["reviewer"], ["founder instruction"], ["rollback"], ["monitoring"], ["code change"], ["rechecked"], ["not permanent approval"]])) {
      blocked.push("expiry check must state that the draft expires and is not permanent approval");
    }
    if (state === "Needs packet review" && !packetDraft.review_question) blocked.push("review question is required");
    if (state === "Return to founder gate" && !packetDraft.return_reason) blocked.push("return reason is required");
    if (state === "Execution hold" && !packetDraft.hold_reason) blocked.push("hold reason is required");
    if (state === "Execution blocked" && !packetDraft.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !packetDraft.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Draft expired" && !packetDraft.hold_reason) blocked.push("hold reason is required when draft expires");

    const packet_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_execution_packet_draft_id: "controlled-execution-packet-draft-" + Date.now(),
      packet_status,
      controlled_execution_packet_draft_ready: packet_status === "Controlled packet draft ready",
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
      founder_execution_instruction_gate_id: packetDraft.founder_execution_instruction_gate_id || founderPacket.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: packetDraft.promotion_execution_preflight_id || founderPacket.promotion_execution_preflight_id || "",
      source_answer_id: packetDraft.source_answer_id || founderPacket.source_answer_id || "",
      source_record_id: packetDraft.source_record_id || founderPacket.source_record_id || "",
      source_family: packetDraft.source_family || founderPacket.source_family || "",
      packet_actor: packetDraft.packet_actor || "",
      source_context: packetDraft.source_context || "",
      execution_intent: packetDraft.execution_intent || "",
      readonly_execution_plan: packetDraft.readonly_execution_plan || "",
      preconditions: packetDraft.preconditions || "",
      reviewer_gates: packetDraft.reviewer_gates || "",
      rollback_plan: packetDraft.rollback_plan || "",
      monitoring_plan: packetDraft.monitoring_plan || "",
      stop_condition: packetDraft.stop_condition || "",
      no_write_boundary: packetDraft.no_write_boundary || "",
      production_boundary: packetDraft.production_boundary || "",
      expiry_check: packetDraft.expiry_check || "",
      review_question: packetDraft.review_question || "",
      return_reason: packetDraft.return_reason || "",
      hold_reason: packetDraft.hold_reason || "",
      block_reason: packetDraft.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function packetSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.packet_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Controlled packet draft ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Execution hold"] || 0,
      expired: byStatus["Draft expired"] || 0,
      execution_enabled: packets.filter((packet) => packet.execution_allowed || packet.execution_authorized || packet.execution_packet_authorized || packet.storage_write_enabled || packet.source_write_executed || packet.production_ready).length
    };
  }

  function parsePacketJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="packet-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.packet_status;
    resultCard.innerHTML = '<strong>' + safe(packet.packet_status) + '</strong>' +
      '<p class="muted">Draft ready: ' + safe(packet.controlled_execution_packet_draft_ready) + ' | Authorized: ' + safe(packet.execution_packet_authorized) + ' | Production: ' + safe(packet.production_ready) + '</p>' +
      '<div class="packet-grid">' +
        card("Founder gate", packet.founder_execution_instruction_gate_id, packet.controlled_execution_packet_draft_ready ? "ready" : "") +
        card("Source answer", packet.source_answer_id) +
        card("Next gate", packet.next_gate_required) +
        card("Execution", packet.execution_allowed ? "enabled" : "false", packet.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for controlled execution review. No authorization, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.packet_checks.map((check) =>
      '<article class="packet-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Founder gate", config.source.founder_execution_instruction_gate_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parsePacketJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(packets) {
    localStorage.setItem(storageKey, JSON.stringify(packets.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const packets = readSaved();
    const snapshot = packetSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="packet-card ' + (packet.controlled_execution_packet_draft_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.packet_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledExecutionPacketDraft = {
    controlledExecutionPacketDraft,
    packetSnapshot,
    packetMissingForState,
    parsePacketJson
  };

  if (!root) return;

  fetch("data/vedapath-controlled-execution-packet-draft.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        founderPacket: root.querySelector("#packetFounderPacket"),
        state: root.querySelector("#packetState"),
        actor: root.querySelector("#packetActor"),
        founderGateId: root.querySelector("#packetFounderGateId"),
        preflightId: root.querySelector("#packetPreflightId"),
        sourceAnswer: root.querySelector("#packetSourceAnswer"),
        sourceRecord: root.querySelector("#packetSourceRecord"),
        sourceFamily: root.querySelector("#packetSourceFamily"),
        context: root.querySelector("#packetSourceContext"),
        intent: root.querySelector("#packetExecutionIntent"),
        plan: root.querySelector("#packetReadonlyPlan"),
        preconditions: root.querySelector("#packetPreconditions"),
        reviewer: root.querySelector("#packetReviewerGates"),
        rollback: root.querySelector("#packetRollbackPlan"),
        monitoring: root.querySelector("#packetMonitoringPlan"),
        stop: root.querySelector("#packetStopCondition"),
        boundary: root.querySelector("#packetNoWriteBoundary"),
        production: root.querySelector("#packetProductionBoundary"),
        expiry: root.querySelector("#packetExpiryCheck"),
        review: root.querySelector("#packetReviewQuestion"),
        returnReason: root.querySelector("#packetReturnReason"),
        holdReason: root.querySelector("#packetHoldReason"),
        block: root.querySelector("#packetBlockReason")
      };

      config.packet_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_packet;
        fields.founderPacket.value = JSON.stringify(config.sample_founder_packet, null, 2);
        fields.state.value = item.packet_state;
        fields.actor.value = item.packet_actor;
        fields.founderGateId.value = item.founder_execution_instruction_gate_id;
        fields.preflightId.value = item.promotion_execution_preflight_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.context.value = item.source_context;
        fields.intent.value = item.execution_intent;
        fields.plan.value = item.readonly_execution_plan;
        fields.preconditions.value = item.preconditions;
        fields.reviewer.value = item.reviewer_gates;
        fields.rollback.value = item.rollback_plan;
        fields.monitoring.value = item.monitoring_plan;
        fields.stop.value = item.stop_condition;
        fields.boundary.value = item.no_write_boundary;
        fields.production.value = item.production_boundary;
        fields.expiry.value = item.expiry_check;
        fields.review.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildPacket() {
        return {
          packet_state: fields.state.value,
          packet_actor: fields.actor.value,
          founder_execution_instruction_gate_id: fields.founderGateId.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          source_context: fields.context.value,
          execution_intent: fields.intent.value,
          readonly_execution_plan: fields.plan.value,
          preconditions: fields.preconditions.value,
          reviewer_gates: fields.reviewer.value,
          rollback_plan: fields.rollback.value,
          monitoring_plan: fields.monitoring.value,
          stop_condition: fields.stop.value,
          no_write_boundary: fields.boundary.value,
          production_boundary: fields.production.value,
          expiry_check: fields.expiry.value,
          review_question: fields.review.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const founderPacket = parsePacketJson(fields.founderPacket.value, {});
        const packet = controlledExecutionPacketDraft(config, founderPacket, buildPacket());
        packetOutput.value = JSON.stringify(packet, null, 2);
        renderResult(packet);
        return packet;
      }

      root.querySelector("#runPacketDraft").addEventListener("click", run);
      root.querySelector("#loadPacketSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#savePacketDraft").addEventListener("click", () => {
        const packet = run();
        writeSaved([...readSaved(), packet]);
        renderSaved(config);
      });
      root.querySelector("#clearPacketDrafts").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyPacketDraft").addEventListener("click", async () => {
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

write("controlledexecutionpacketdraft.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Execution Packet Draft</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-execution-packet-draft.css">
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
            <span>Controlled execution packet draft</span>
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

      <main class="workspace" aria-label="VedaPath Controlled Execution Packet Draft workspace">
        <aside class="panel">
          <span class="eyebrow">Draft is not authority</span>
          <h2>Shape the packet before review</h2>
          <p class="muted">This room turns founder instruction into a draft packet. It cannot authorize, execute, promote, store, migrate, use secrets, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Founder</strong><p>Load instruction.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Packet</strong><p>Name the fields.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Review</strong><p>Require gates.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Stop</strong><p>Hold all writes.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="founderexecutioninstructiongate.html">Open Founder Gate</a>
            <a class="button safe" href="promotionexecutionpreflight.html">Open Preflight</a>
          </div>
        </aside>

        <section class="panel packet-draft" id="controlledExecutionPacketDraft">
          <div class="packet-head">
            <div>
              <span class="eyebrow">Packet draft</span>
              <h1>Draft the route. Keep the door closed.</h1>
              <p class="muted">A ready packet here means the controlled execution packet shape can be reviewed next. It still cannot authorize, execute, promote, store, update canonical records, run migrations, create accounts, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="packet-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath controlled execution packet mark"></div>
          </div>

          <section class="packet-layout">
            <div class="packet-form">
              <h2>Controlled Execution Packet</h2>
              <label>Founder instruction packet<textarea id="packetFounderPacket"></textarea></label>
              <label>Packet state<select id="packetState"></select></label>
              <label>Packet actor<input id="packetActor" type="text" placeholder="Controlled execution packet drafter"></label>
              <label>Founder gate id<input id="packetFounderGateId" type="text"></label>
              <label>Preflight id<input id="packetPreflightId" type="text"></label>
              <label>Source answer id<input id="packetSourceAnswer" type="text"></label>
              <label>Source record id<input id="packetSourceRecord" type="text"></label>
              <label>Source family<input id="packetSourceFamily" type="text"></label>
              <label>Source context<textarea id="packetSourceContext"></textarea></label>
              <label>Execution intent<textarea id="packetExecutionIntent"></textarea></label>
              <label>Readonly execution plan<textarea id="packetReadonlyPlan"></textarea></label>
              <label>Preconditions<textarea id="packetPreconditions"></textarea></label>
              <label>Reviewer gates<textarea id="packetReviewerGates"></textarea></label>
              <label>Rollback plan<textarea id="packetRollbackPlan"></textarea></label>
              <label>Monitoring plan<textarea id="packetMonitoringPlan"></textarea></label>
              <label>Stop condition<textarea id="packetStopCondition"></textarea></label>
              <label>No-write boundary<textarea id="packetNoWriteBoundary"></textarea></label>
              <label>Production boundary<textarea id="packetProductionBoundary"></textarea></label>
              <label>Expiry check<textarea id="packetExpiryCheck"></textarea></label>
              <label>Review question<textarea id="packetReviewQuestion"></textarea></label>
              <label>Return reason<textarea id="packetReturnReason"></textarea></label>
              <label>Hold reason<textarea id="packetHoldReason"></textarea></label>
              <label>Block reason<textarea id="packetBlockReason"></textarea></label>
              <div class="packet-actions">
                <button class="button primary" id="runPacketDraft" type="button">Run Draft</button>
                <button class="button safe" id="loadPacketSample" type="button">Load Sample</button>
                <button class="button" id="savePacketDraft" type="button">Save Local</button>
                <button class="button" id="clearPacketDrafts" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="packet-result" id="packetResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Packet Scope</h2>
                <div class="packet-list" id="packetScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Draft Checks</h2>
            <div class="packet-rules" id="packetChecks"></div>
          </section>

          <section class="packet-layout">
            <div>
              <div class="packet-actions">
                <button class="button safe" id="copyPacketDraft" type="button">Copy Draft Packet</button>
                <a class="button" href="data/vedapath-controlled-execution-packet-draft.json">Open JSON</a>
              </div>
              <textarea class="packet-output" id="packetOutput" aria-label="Controlled execution packet draft"></textarea>
            </div>
            <div>
              <h2>Saved Local Drafts</h2>
              <div class="packet-list" id="packetSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Packet draft is not execution</span>
          <h2 style="margin-top: 14px;">Ready to Review, Not Run</h2>
          <p class="muted">The packet shape becomes visible for review while every operational path stays locked.</p>
          <div class="progress" aria-label="Controlled execution packet draft progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>8</strong></div>
            <div class="metric"><span>Authorized</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Review gate</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Draft Boundary</h2>
            <p class="packet-boundary">Draft only. Authorization, execution, founder grant, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares the controlled execution review gate. It does not execute anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-execution-packet-draft.js"></script>
  </body>
</html>
`);

write("docs/CONTROLLED_EXECUTION_PACKET_DRAFT.md", `# VedaPath AI Controlled Execution Packet Draft

Release: ${release}

This release drafts the first controlled execution packet from founder instruction without granting authorization or execution.

## Files

- data/vedapath-controlled-execution-packet-draft.json
- controlledexecutionpacketdraft.html
- assets/vedapath-controlled-execution-packet-draft.css
- assets/vedapath-controlled-execution-packet-draft.js

## What It Adds

The room:

- starts from a founder instruction ready packet
- drafts source context, execution intent, readonly plan, preconditions, reviewer gates, rollback, monitoring, stop condition, no-write boundary, production boundary, and expiry
- permits only a future controlled execution review gate
- keeps authorization, execution, founder grant, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production false

## Boundary

Controlled execution packet draft is not execution approval. It does not promote source data, run storage writes, update canonical source records, run migrations, create accounts, use secrets, publish public release state, or launch production. The next release should create a controlled execution review gate while every write and production flag remains false.
`);

const readmeBlock = `<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT START -->
## ${release} Controlled Execution Packet Draft

This release drafts the first controlled execution packet from founder instruction while all authorization, execution, promotion, storage, canonical-write, migration, account, secret, public-release, and production flags stay false.

- [Controlled Execution Packet Draft](controlledexecutionpacketdraft.html)
- [Controlled Execution Packet Draft Notes](docs/CONTROLLED_EXECUTION_PACKET_DRAFT.md)
- [Controlled Execution Packet Draft Data](data/vedapath-controlled-execution-packet-draft.json)

<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT END -->

`;

update("README.md", (content) => {
  if (content.includes("VEDAPATH CONTROLLED EXECUTION PACKET DRAFT START")) return content;
  return mustReplace(content, "<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE START -->", readmeBlock + "<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE START -->", "README insertion");
});

const notesBlock = `<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT NOTES START -->
## ${release} Controlled Execution Packet Draft

This phase turns founder instruction into a draft-only controlled execution packet.

- Adds a controlled execution packet draft room.
- Reads a founder instruction ready packet.
- Requires source context, execution intent, readonly plan, preconditions, reviewer gates, rollback, monitoring, stop condition, no-write boundary, production boundary, and expiry.
- Keeps execution_packet_authorized, execution_authorized, execution_allowed, founder_instruction_granted, source_promotion_allowed, promotion_execution_allowed, implementation_authorized, implementation_execution_allowed, controlled_storage_entry_allowed, storage_write_enabled, canonical_write_allowed, source_write_executed, actual_storage_write_executed, production_ready, production_launch_allowed, and public_release_allowed false.

<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT NOTES END -->

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes("VEDAPATH CONTROLLED EXECUTION PACKET DRAFT NOTES START")) return content;
  return mustReplace(content, "<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE NOTES START -->", notesBlock + "<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE NOTES START -->", "prototype notes insertion");
});

const blueprintBlock = `<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT BLUEPRINT START -->
### 297. Controlled Execution Packet Draft

VedaPath should make the first execution packet inspectable before any execution authority exists. The controlled execution packet draft defines the future route while every operational flag remains false.

Core requirements:

- start from a founder instruction ready packet
- name exact source answer, source record, source family, and founder gate packet
- define source context, execution intent, readonly plan, preconditions, reviewer gates, rollback, monitoring, stop condition, no-write boundary, production boundary, and expiry
- permit only a future controlled execution review gate
- block authorization, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production

Controlled Execution Packet Draft should never claim execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.
<!-- VEDAPATH CONTROLLED EXECUTION PACKET DRAFT BLUEPRINT END -->

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("VEDAPATH CONTROLLED EXECUTION PACKET DRAFT BLUEPRINT START")) return content;
  return mustReplace(content, "<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE BLUEPRINT START -->", blueprintBlock + "<!-- VEDAPATH FOUNDER EXECUTION INSTRUCTION GATE BLUEPRINT START -->", "product blueprint insertion");
});

update("index.html", (content) => {
  if (!content.includes('href="controlledexecutionpacketdraft.html"')) {
    content = mustReplace(content, '<a href="founderexecutioninstructiongate.html">Founder gate <span>execution</span></a>', '<a href="founderexecutioninstructiongate.html">Founder gate <span>execution</span></a>\n              <a href="controlledexecutionpacketdraft.html">Packet draft <span>review</span></a>', "study map packet link");
    content = mustReplace(content, '<a href="founderexecutioninstructiongate.html">Founder gate <span>instruction</span></a>', '<a href="founderexecutioninstructiongate.html">Founder gate <span>instruction</span></a>\n              <a href="controlledexecutionpacketdraft.html">Packet draft <span>no-write</span></a>', "build map packet link");
  }
  return content;
});

update("founderexecutioninstructiongate.html", (content) => {
  if (!content.includes('href="controlledexecutionpacketdraft.html"')) {
    content = mustReplace(content, '<a class="button safe" href="build-status.html">Open Build</a>', '<a class="button safe" href="build-status.html">Open Build</a>\n            <a class="button" href="controlledexecutionpacketdraft.html">Open Packet Draft</a>', "founder page packet draft link");
  }
  content = content.replace("This release prepares a controlled execution packet draft. It does not grant execution.", "This release feeds the controlled execution packet draft. It does not grant execution.");
  return content;
});

update("build-status.html", (content) => {
  content = content.replace("<strong>v3.1.3</strong>\n          <p>Founder Execution Instruction Gate: execution preflight packets now require explicit source-specific founder instruction before any controlled execution packet can be drafted.</p>", "<strong>v3.1.4</strong>\n          <p>Controlled Execution Packet Draft: founder instruction now produces a reviewable packet shape while authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace("<strong>95%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:95%\"></div></div>\n          <p>The trust loop now asks for explicit founder intent while every real write path remains closed.</p>", "<strong>96%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:96%\"></div></div>\n          <p>The trust loop now shapes the first execution packet draft while every real write path remains closed.</p>");
  content = content.replace("<span>Next release</span>\n          <strong>Controlled execution packet draft</strong>\n          <p>Draft the first execution packet shape while writes and production stay blocked.</p>", "<span>Next release</span>\n          <strong>Controlled execution review gate</strong>\n          <p>Review the draft packet before any authorization can be considered.</p>");
  if (!content.includes("Phase 278: Controlled Execution Packet Draft")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 278: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 278: Controlled Execution Packet Draft</strong>
                <p>Drafts a reviewable controlled execution packet from founder instruction while authorization, execution, storage writes, canonical writes, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 279: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.1.3 Founder Execution Instruction Gate</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.1.4 Controlled Execution Packet Draft</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.1.2 Promotion Execution Preflight</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.1.3 Founder Execution Instruction Gate</strong></div>');
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Make founder instruction explicit before controlled execution packet drafting.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Draft the first controlled execution packet without enabling execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for controlled execution packet draft</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled execution review gate</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Draft controlled execution packet fields.</span></li>\n              <li><span class="dot"></span><span>Keep founder grant and execution disabled.</span></li>\n              <li><span class="dot"></span><span>Require reviewer, rollback, and monitoring evidence.</span></li>\n              <li><span class="dot"></span><span>Preserve storage, canonical, public release, and production blocks.</span></li>', '<li><span class="dot"></span><span>Build controlled execution review gate.</span></li>\n              <li><span class="dot"></span><span>Keep authorization and execution disabled.</span></li>\n              <li><span class="dot"></span><span>Inspect reviewer, rollback, monitoring, and stop conditions.</span></li>\n              <li><span class="dot"></span><span>Preserve storage, canonical, public release, and production blocks.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.1\.3 founder gate<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} controlled execution packet draft applied.`);

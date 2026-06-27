import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.0.9";
const badge = "v3.0.9 founder gate";
const previousRelease = "v3.0.8 Controlled Storage Entry Dry Run";

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, value) {
  fs.writeFileSync(path.join(root, file), value);
}

function update(file, fn) {
  write(file, fn(read(file)));
}

function replaceOrThrow(content, search, replacement, label) {
  if (!content.includes(search)) {
    throw new Error(`Missing marker: ${label}`);
  }
  return content.replace(search, replacement);
}

function replaceRegexOrThrow(content, pattern, replacement, label) {
  if (!pattern.test(content)) {
    throw new Error(`Missing pattern: ${label}`);
  }
  return content.replace(pattern, replacement);
}

function htmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") return [];
      return htmlFiles(full);
    }
    return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
  });
}

const previous = JSON.parse(read("data/vedapath-controlled-storage-entry-dry-run.json"));
const entry = previous.sample_entry;
const criteria = previous.sample_criteria_packet;

const sampleEntryDryRun = {
  schema_version: "controlled-storage-entry-dry-run-v1",
  release: previous.release,
  entry_dry_run_id: "storage-entry-dry-run-sample-steady-action-bg-2-48",
  entry_status: "Entry dry run passed",
  entry_dry_run_passed: true,
  production_ready: false,
  controlled_storage_entry_allowed: false,
  canonical_write_allowed: false,
  storage_write_enabled: false,
  source_write_executed: false,
  actual_storage_write_executed: false,
  founder_instruction_required: true,
  founder_instruction_granted: false,
  next_gate_required: "Founder storage instruction gate",
  criteria_packet_id: entry.criteria_packet_id,
  replay_receipt_id: entry.replay_receipt_id,
  rollback_receipt_id: entry.rollback_receipt_id,
  audit_receipt_id: entry.audit_receipt_id,
  source_answer_id: entry.source_answer_id,
  source_record_id: entry.source_record_id,
  source_family: entry.source_family,
  storage_target: entry.storage_target,
  schema_route: entry.schema_route,
  dry_run_plan: entry.dry_run_plan,
  receipt_chain_check: entry.receipt_chain_check,
  no_write_check: entry.no_write_check,
  rollback_simulation: entry.rollback_simulation,
  promotion_blockers: entry.promotion_blockers,
  founder_instruction_check: entry.founder_instruction_check,
  simulated_result: entry.simulated_result,
  entry_boundary: entry.entry_boundary,
  created_at: "2026-06-27T00:00:00.000Z"
};

const requiredPhrase = "I authorize VedaPath to prepare the named source-answer packet for controlled storage entry review; do not execute production writes yet.";

const config = {
  schema_version: "founder-storage-instruction-gate-v1",
  release,
  generated_at: "2026-06-27T00:00:00.000Z",
  title: "Founder Storage Instruction Gate",
  summary: "Defines the exact founder-only instruction packet required before controlled storage can move past dry run, while every real write flag remains false.",
  previous_release: previousRelease,
  source: {
    entry_dry_run_release: previous.release,
    entry_dry_run_schema: previous.schema_version,
    criteria_packet_id: criteria.criteria_packet_id,
    source_answer_id: entry.source_answer_id,
    source_record_id: entry.source_record_id,
    source_family: entry.source_family
  },
  instruction_states: [
    "Draft founder instruction",
    "Needs founder review",
    "Founder instruction gate ready",
    "Return to entry dry run",
    "Founder hold",
    "Founder instruction blocked"
  ],
  required_by_state: {
    "Draft founder instruction": ["entry_dry_run_id", "criteria_packet_id", "source_answer_id", "instruction_scope"],
    "Needs founder review": ["review_question", "instruction_scope", "allowed_action", "forbidden_actions"],
    "Founder instruction gate ready": ["required_phrase", "evidence_required", "execution_boundary", "revocation_rule"],
    "Return to entry dry run": ["return_reason"],
    "Founder hold": ["hold_reason"],
    "Founder instruction blocked": ["block_reason"]
  },
  instruction_checks: [
    {
      check: "Entry dry run ready",
      rule: "Instruction can only be prepared from a passed entry dry run with controlled_storage_entry_allowed, storage_write_enabled, canonical_write_allowed, and source_write_executed all false."
    },
    {
      check: "Founder scope",
      rule: "Scope must name founder authority, the named source-answer packet, controlled storage entry review, and the fact this is not broad production release."
    },
    {
      check: "Allowed action",
      rule: "Allowed action is preparation for a future implementation review only, not execution."
    },
    {
      check: "Forbidden actions",
      rule: "No canonical source edits, account creation, migration execution, rights-sensitive text change, or production launch."
    },
    {
      check: "Exact phrase",
      rule: "The founder phrase must explicitly authorize preparation for controlled storage entry review and say production writes must not execute yet."
    },
    {
      check: "Evidence required",
      rule: "Entry dry run, criteria packet, receipt chain, rollback simulation, and source-owner scope must be present."
    },
    {
      check: "Revocation",
      rule: "Founder can revoke before execution, returning the packet to entry dry run."
    },
    {
      check: "No-write boundary",
      rule: "Instruction gate does not grant controlled storage entry, canonical source write, storage write, or production readiness."
    }
  ],
  sample_entry_dry_run: sampleEntryDryRun,
  sample_instruction: {
    instruction_state: "Founder instruction gate ready",
    instruction_actor: "Founder review",
    instruction_note: "Define founder instruction requirements without granting storage entry.",
    entry_dry_run_id: sampleEntryDryRun.entry_dry_run_id,
    criteria_packet_id: sampleEntryDryRun.criteria_packet_id,
    replay_receipt_id: sampleEntryDryRun.replay_receipt_id,
    rollback_receipt_id: sampleEntryDryRun.rollback_receipt_id,
    audit_receipt_id: sampleEntryDryRun.audit_receipt_id,
    source_answer_id: sampleEntryDryRun.source_answer_id,
    source_record_id: sampleEntryDryRun.source_record_id,
    source_family: sampleEntryDryRun.source_family,
    instruction_scope: "Founder may authorize only preparation of controlled storage entry review for the named source-answer packet; this is not broad production release.",
    allowed_action: "Allow a future storage-entry implementation packet to be prepared for review; do not execute writes in this preview.",
    forbidden_actions: "No canonical source edits, no account creation, no migration execution, no rights-sensitive text changes, and no production launch.",
    required_phrase: requiredPhrase,
    evidence_required: "Entry dry run passed, criteria packet ready, receipt chain present, rollback simulation present, and source-owner scope present.",
    execution_boundary: "Instruction gate only; controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, and production_ready remains false.",
    revocation_rule: "Founder can revoke before storage execution; revocation returns the packet to entry dry run.",
    next_gate: "Implementation authorization dry run",
    review_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    founder_instruction_granted: false,
    controlled_storage_entry_allowed: false,
    storage_write_enabled: false,
    canonical_write_allowed: false,
    source_write_executed: false,
    actual_storage_write_executed: false,
    production_ready: false,
    next_gate_required: "Implementation authorization dry run"
  }
};

write("data/vedapath-founder-storage-instruction-gate.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-founder-storage-instruction-gate.css", `/* VedaPath founder storage instruction gate */
.founder-app,
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

.founder-app {
  gap: 16px;
}

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
  min-height: 104px;
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
.founder-result[data-state="Founder instruction gate ready"] {
  border-left-color: var(--green);
}

.founder-card.blocked,
.founder-result[data-state="Blocked"],
.founder-result[data-state="Return to entry dry run"],
.founder-result[data-state="Founder hold"],
.founder-result[data-state="Founder instruction blocked"] {
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

.founder-phrase {
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
  .founder-actions {
    grid-template-columns: 1fr;
  }
}
`);

write("assets/vedapath-founder-storage-instruction-gate.js", `(() => {
  const storageKey = "vedapath-founder-storage-instruction-gate";
  const root = document.getElementById("founderStorageInstructionGate");
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

  function entryDryRunReady(packet) {
    return Boolean(packet) &&
      packet.entry_status === "Entry dry run passed" &&
      packet.entry_dry_run_passed === true &&
      packet.production_ready === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.canonical_write_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.founder_instruction_required === true &&
      packet.founder_instruction_granted === false;
  }

  function keepsFounderBoundary(value) {
    const text = String(value || "");
    const safeBoundary = /controlled_storage_entry_allowed remains false/i.test(text) &&
      /storage_write_enabled remains false/i.test(text) &&
      /canonical_write_allowed remains false/i.test(text) &&
      /source_write_executed remains false/i.test(text) &&
      /actual_storage_write_executed remains false/i.test(text) &&
      /production_ready remains false/i.test(text);
    const unsafe = /(founder_instruction_granted true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|write enabled|production write|real storage granted)/i.test(text);
    return safeBoundary && !unsafe;
  }

  function founderMissingForState(config, state, instruction = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(instruction[field] || "").trim());
  }

  function idMatches(instruction, entryPacket, key) {
    return !instruction[key] || !entryPacket[key] || instruction[key] === entryPacket[key];
  }

  function founderInstructionGate(config, entryPacket, instruction) {
    const state = instruction.instruction_state || "Draft founder instruction";
    const missing = founderMissingForState(config, state, instruction);
    const blocked = [];
    const warnings = [];

    if (!entryDryRunReady(entryPacket)) blocked.push("entry dry run must pass while every write flag remains false");
    ["entry_dry_run_id", "criteria_packet_id", "replay_receipt_id", "rollback_receipt_id", "audit_receipt_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(instruction, entryPacket, key)) blocked.push(key + " must match the entry dry-run packet");
    });

    const readyCandidate = state === "Founder instruction gate ready";
    if (readyCandidate && !hasText(instruction.instruction_scope, [["founder"], ["named", "source-answer"], ["controlled storage"], ["review"], ["not", "broad", "production"]])) {
      blocked.push("instruction scope must be founder-only, named-packet, controlled-storage review, and not broad production");
    }
    if (readyCandidate && !hasText(instruction.allowed_action, [["future", "prepare"], ["review"], ["do not", "execute", "writes"]])) {
      blocked.push("allowed action must be future preparation for review without executing writes");
    }
    if (readyCandidate && !hasText(instruction.forbidden_actions, [["no", "canonical"], ["no", "account"], ["no", "migration"], ["no", "rights"], ["no", "production"]])) {
      blocked.push("forbidden actions must block canonical, account, migration, rights, and production moves");
    }
    if (readyCandidate && !hasText(instruction.required_phrase, [["authorize"], ["prepare"], ["controlled storage entry review"], ["do not execute production writes yet"]])) {
      blocked.push("required phrase must authorize preparation only and forbid production writes");
    }
    if (readyCandidate && !hasText(instruction.evidence_required, [["entry dry run"], ["criteria packet"], ["receipt chain"], ["rollback"], ["source-owner"]])) {
      blocked.push("evidence must include dry run, criteria, receipt chain, rollback, and source-owner scope");
    }
    if (readyCandidate && !hasText(instruction.revocation_rule, [["revoke"], ["before", "execution"], ["return", "entry dry run"]])) {
      blocked.push("revocation rule must allow return to entry dry run before execution");
    }
    if (readyCandidate && !keepsFounderBoundary(instruction.execution_boundary)) {
      blocked.push("execution boundary must keep every storage, source-write, and production flag false");
    }
    if (state === "Needs founder review" && !instruction.review_question) blocked.push("review question is required for founder review");
    if (state === "Return to entry dry run" && !instruction.return_reason) blocked.push("return reason is required");
    if (state === "Founder hold" && !instruction.hold_reason) blocked.push("hold reason is required");
    if (state === "Founder instruction blocked" && !instruction.block_reason) blocked.push("block reason is required");

    if (entryPacket.next_gate_required !== "Founder storage instruction gate") {
      warnings.push("entry dry run did not name this as the next gate");
    }

    const instruction_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      founder_instruction_gate_id: "founder-storage-instruction-gate-" + Date.now(),
      instruction_status,
      founder_instruction_gate_ready: instruction_status === "Founder instruction gate ready",
      founder_instruction_granted: false,
      production_ready: false,
      controlled_storage_entry_allowed: false,
      canonical_write_allowed: false,
      storage_write_enabled: false,
      source_write_executed: false,
      actual_storage_write_executed: false,
      next_gate_required: config.boundary.next_gate_required,
      entry_dry_run_id: instruction.entry_dry_run_id || entryPacket.entry_dry_run_id || "",
      criteria_packet_id: instruction.criteria_packet_id || entryPacket.criteria_packet_id || "",
      replay_receipt_id: instruction.replay_receipt_id || entryPacket.replay_receipt_id || "",
      rollback_receipt_id: instruction.rollback_receipt_id || entryPacket.rollback_receipt_id || "",
      audit_receipt_id: instruction.audit_receipt_id || entryPacket.audit_receipt_id || "",
      source_answer_id: instruction.source_answer_id || entryPacket.source_answer_id || "",
      source_record_id: instruction.source_record_id || entryPacket.source_record_id || "",
      source_family: instruction.source_family || entryPacket.source_family || "",
      instruction_actor: instruction.instruction_actor || "",
      instruction_note: instruction.instruction_note || "",
      instruction_scope: instruction.instruction_scope || "",
      allowed_action: instruction.allowed_action || "",
      forbidden_actions: instruction.forbidden_actions || "",
      required_phrase: instruction.required_phrase || "",
      evidence_required: instruction.evidence_required || "",
      execution_boundary: instruction.execution_boundary || "",
      revocation_rule: instruction.revocation_rule || "",
      review_question: instruction.review_question || "",
      return_reason: instruction.return_reason || "",
      hold_reason: instruction.hold_reason || "",
      block_reason: instruction.block_reason || "",
      missing,
      blocked,
      warnings,
      created_at: new Date().toISOString()
    };
  }

  function founderInstructionSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.instruction_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Founder instruction gate ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Founder hold"] || 0,
      writes_enabled: packets.filter((packet) => packet.storage_write_enabled || packet.source_write_executed || packet.controlled_storage_entry_allowed).length
    };
  }

  function parseFounderJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.instruction_status;
    resultCard.innerHTML = '<strong>' + safe(packet.instruction_status) + '</strong>' +
      '<p class="muted">Gate ready: ' + safe(packet.founder_instruction_gate_ready) + ' | Founder granted: ' + safe(packet.founder_instruction_granted) + ' | Storage writes: ' + safe(packet.storage_write_enabled) + '</p>' +
      '<div class="founder-grid">' +
        card("Entry dry run", packet.entry_dry_run_id, packet.founder_instruction_gate_ready ? "ready" : "") +
        card("Required phrase", packet.required_phrase ? "present" : "missing", packet.required_phrase ? "ready" : "blocked") +
        card("Next gate", packet.next_gate_required) +
        card("Writes", packet.source_write_executed ? "enabled" : "false", packet.source_write_executed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for implementation authorization dry run. No write permission was granted.</p>');
  }

  function card(label, value, className = "") {
    return '<article class="founder-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
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
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Required phrase", config.sample_instruction.required_phrase],
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
    const snapshot = founderInstructionSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Writes enabled", snapshot.writes_enabled, snapshot.writes_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="founder-card ' + (packet.founder_instruction_gate_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.instruction_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathFounderStorageInstructionGate = {
    founderInstructionGate,
    founderInstructionSnapshot,
    founderMissingForState,
    parseFounderJson
  };

  if (!root) return;

  fetch("data/vedapath-founder-storage-instruction-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        entryPacket: root.querySelector("#founderEntryPacket"),
        state: root.querySelector("#founderState"),
        actor: root.querySelector("#founderActor"),
        note: root.querySelector("#founderNote"),
        entryId: root.querySelector("#founderEntryId"),
        criteriaId: root.querySelector("#founderCriteriaId"),
        replayId: root.querySelector("#founderReplayId"),
        rollbackId: root.querySelector("#founderRollbackId"),
        auditId: root.querySelector("#founderAuditId"),
        sourceAnswer: root.querySelector("#founderSourceAnswer"),
        sourceRecord: root.querySelector("#founderSourceRecord"),
        sourceFamily: root.querySelector("#founderSourceFamily"),
        scope: root.querySelector("#founderScopeText"),
        allowed: root.querySelector("#founderAllowedAction"),
        forbidden: root.querySelector("#founderForbiddenActions"),
        phrase: root.querySelector("#founderRequiredPhrase"),
        evidence: root.querySelector("#founderEvidenceRequired"),
        boundary: root.querySelector("#founderExecutionBoundary"),
        revocation: root.querySelector("#founderRevocationRule"),
        review: root.querySelector("#founderReviewQuestion"),
        returnReason: root.querySelector("#founderReturnReason"),
        hold: root.querySelector("#founderHoldReason"),
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
        fields.entryPacket.value = JSON.stringify(config.sample_entry_dry_run, null, 2);
        fields.state.value = item.instruction_state;
        fields.actor.value = item.instruction_actor;
        fields.note.value = item.instruction_note;
        fields.entryId.value = item.entry_dry_run_id;
        fields.criteriaId.value = item.criteria_packet_id;
        fields.replayId.value = item.replay_receipt_id;
        fields.rollbackId.value = item.rollback_receipt_id;
        fields.auditId.value = item.audit_receipt_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.instruction_scope;
        fields.allowed.value = item.allowed_action;
        fields.forbidden.value = item.forbidden_actions;
        fields.phrase.value = item.required_phrase;
        fields.evidence.value = item.evidence_required;
        fields.boundary.value = item.execution_boundary;
        fields.revocation.value = item.revocation_rule;
        fields.review.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.hold.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildInstruction() {
        return {
          instruction_state: fields.state.value,
          instruction_actor: fields.actor.value,
          instruction_note: fields.note.value,
          entry_dry_run_id: fields.entryId.value,
          criteria_packet_id: fields.criteriaId.value,
          replay_receipt_id: fields.replayId.value,
          rollback_receipt_id: fields.rollbackId.value,
          audit_receipt_id: fields.auditId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          instruction_scope: fields.scope.value,
          allowed_action: fields.allowed.value,
          forbidden_actions: fields.forbidden.value,
          required_phrase: fields.phrase.value,
          evidence_required: fields.evidence.value,
          execution_boundary: fields.boundary.value,
          revocation_rule: fields.revocation.value,
          review_question: fields.review.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.hold.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const entryPacket = parseFounderJson(fields.entryPacket.value, {});
        const packet = founderInstructionGate(config, entryPacket, buildInstruction());
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

write("founderstorageinstructiongate.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Founder Storage Instruction Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-founder-storage-instruction-gate.css">
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
            <span>Founder storage instruction gate</span>
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

      <main class="workspace" aria-label="VedaPath Founder Storage Instruction Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Founder-only gate</span>
          <h2>Say exactly what is allowed</h2>
          <p class="muted">This room defines the founder instruction shape before any implementation can claim storage permission.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Entry</strong><p>Start from dry run.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Scope</strong><p>Name the packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Instruction</strong><p>Use exact words.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Hold</strong><p>Keep writes false.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledstorageentrydryrun.html">Open Entry Dry Run</a>
            <a class="button safe" href="controlledstoragecriteria.html">Open Criteria</a>
          </div>
        </aside>

        <section class="panel founder-app" id="founderStorageInstructionGate">
          <div class="founder-head">
            <div>
              <span class="eyebrow">Instruction gate</span>
              <h1>Name the founder instruction. Keep storage closed.</h1>
              <p class="muted">The product can prepare a review packet, but this page still grants no storage entry, no canonical write, and no production launch.</p>
            </div>
            <div class="founder-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath founder gate mark"></div>
          </div>

          <section class="founder-layout">
            <div class="founder-form">
              <h2>Founder Instruction Packet</h2>
              <label>Entry dry-run packet<textarea id="founderEntryPacket"></textarea></label>
              <label>Instruction state<select id="founderState"></select></label>
              <label>Instruction actor<input id="founderActor" type="text" placeholder="Founder review"></label>
              <label>Instruction note<textarea id="founderNote"></textarea></label>
              <label>Entry dry-run id<input id="founderEntryId" type="text"></label>
              <label>Criteria packet id<input id="founderCriteriaId" type="text"></label>
              <label>Replay receipt id<input id="founderReplayId" type="text"></label>
              <label>Rollback receipt id<input id="founderRollbackId" type="text"></label>
              <label>Audit receipt id<input id="founderAuditId" type="text"></label>
              <label>Source answer id<input id="founderSourceAnswer" type="text"></label>
              <label>Source record id<input id="founderSourceRecord" type="text"></label>
              <label>Source family<input id="founderSourceFamily" type="text"></label>
              <label>Instruction scope<textarea id="founderScopeText"></textarea></label>
              <label>Allowed action<textarea id="founderAllowedAction"></textarea></label>
              <label>Forbidden actions<textarea id="founderForbiddenActions"></textarea></label>
              <label>Required founder phrase<textarea id="founderRequiredPhrase"></textarea></label>
              <label>Evidence required<textarea id="founderEvidenceRequired"></textarea></label>
              <label>Execution boundary<textarea id="founderExecutionBoundary"></textarea></label>
              <label>Revocation rule<textarea id="founderRevocationRule"></textarea></label>
              <label>Review question<textarea id="founderReviewQuestion"></textarea></label>
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
                <h2>Gate Scope</h2>
                <div class="founder-list" id="founderScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Instruction Checks</h2>
            <div class="founder-rules" id="founderChecks"></div>
          </section>

          <section class="founder-layout">
            <div>
              <div class="founder-actions">
                <button class="button safe" id="copyFounderPacket" type="button">Copy Gate Packet</button>
                <a class="button" href="data/vedapath-founder-storage-instruction-gate.json">Open JSON</a>
              </div>
              <textarea class="founder-packet" id="founderPacket" aria-label="Founder storage instruction gate packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Gate Runs</h2>
              <div class="founder-list" id="founderSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Instruction is not execution</span>
          <h2 style="margin-top: 14px;">Permission Cannot Hide</h2>
          <p class="muted">The exact phrase can be prepared and reviewed, but this preview does not grant storage entry.</p>
          <div class="progress" aria-label="Founder storage instruction gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>6</strong></div>
            <div class="metric"><span>Writes</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Implementation dry run</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Founder Phrase</h2>
            <p class="founder-phrase">I authorize VedaPath to prepare the named source-answer packet for controlled storage entry review; do not execute production writes yet.</p>
            <p class="muted">Even this phrase only opens the next review gate, not storage itself.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-founder-storage-instruction-gate.js"></script>
  </body>
</html>
`);

write("docs/FOUNDER_STORAGE_INSTRUCTION_GATE.md", `# VedaPath AI Founder Storage Instruction Gate

Release: ${release}

This release defines the founder-only instruction gate that follows controlled storage entry dry run.

## Files

- data/vedapath-founder-storage-instruction-gate.json
- founderstorageinstructiongate.html
- assets/vedapath-founder-storage-instruction-gate.css
- assets/vedapath-founder-storage-instruction-gate.js

## What It Adds

The room:

- starts from a passed entry dry-run packet
- verifies every write and production flag remains false
- defines the founder instruction scope
- separates allowed preparation from forbidden execution
- requires an exact founder phrase
- keeps revocation and return paths visible
- exports a copyable founder instruction gate packet

## Boundary

Founder storage instruction gate is not storage execution. It does not grant controlled storage entry, production readiness, account creation, migration execution, canonical source edits, or rights-sensitive source changes. The next release should dry-run implementation authorization without writing source data.
`);

const readmeBlock = `<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE START -->
## ${release} Founder Storage Instruction Gate

This release defines the founder-only instruction gate after controlled storage entry dry run.

- [Founder Storage Instruction Gate](founderstorageinstructiongate.html)
- [Founder Storage Instruction Gate Notes](docs/FOUNDER_STORAGE_INSTRUCTION_GATE.md)
- [Founder Storage Instruction Gate Data](data/vedapath-founder-storage-instruction-gate.json)

<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE END -->

`;

update("README.md", (content) => {
  if (content.includes("VEDAPATH FOUNDER STORAGE INSTRUCTION GATE START")) return content;
  return replaceOrThrow(content, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN START -->", readmeBlock + "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN START -->", "README insertion");
});

const notesBlock = `<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE NOTES START -->
## ${release} Founder Storage Instruction Gate

This phase defines the exact founder instruction shape before storage can move beyond dry run.

- Adds a founder instruction gate room.
- Reads a passed entry dry-run packet.
- Requires scoped founder language, evidence, revocation, and a no-write boundary.
- Keeps founder_instruction_granted, controlled_storage_entry_allowed, storage_write_enabled, canonical_write_allowed, source_write_executed, actual_storage_write_executed, and production_ready false.

<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE NOTES END -->

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes("VEDAPATH FOUNDER STORAGE INSTRUCTION GATE NOTES START")) return content;
  return replaceOrThrow(content, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN NOTES START -->", notesBlock + "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN NOTES START -->", "prototype notes insertion");
});

const blueprintBlock = `<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE BLUEPRINT START -->
### 292. Founder Storage Instruction Gate

VedaPath should never let founder approval become ambiguous. The founder storage instruction gate defines the exact instruction packet required before controlled storage can move beyond dry run.

Core requirements:

- start from a passed controlled storage entry dry run
- keep every storage, source-write, and production flag false
- require named packet scope and founder-only authority
- separate preparation for review from execution
- require an exact phrase and revocation rule
- preserve return, hold, and block states

Founder Storage Instruction Gate should never claim production storage, canonical source writes, account creation, migration execution, rights-sensitive text changes, launch approval, therapy, ritual instruction, crisis support, or spiritual authority.
<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE BLUEPRINT END -->

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("VEDAPATH FOUNDER STORAGE INSTRUCTION GATE BLUEPRINT START")) return content;
  return replaceOrThrow(content, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN BLUEPRINT START -->", blueprintBlock + "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN BLUEPRINT START -->", "product blueprint insertion");
});

function updateVersionBadge(content) {
  return content.replace(/<span class="version">v3\.0\.8 entry dry run<\/span>/g, `<span class="version">${badge}</span>`);
}

update("index.html", (content) => {
  content = updateVersionBadge(content);
  content = replaceOrThrow(content, "founder instruction gates, source promotion, and production memory.", "implementation authorization dry runs, source promotion, and production memory.", "home next release sentence");
  if (!content.includes('href="founderstorageinstructiongate.html"')) {
    content = replaceOrThrow(content, '<a href="controlledstorageentrydryrun.html">Entry dry run <span>no-write</span></a>', '<a href="controlledstorageentrydryrun.html">Entry dry run <span>no-write</span></a>\n              <a href="founderstorageinstructiongate.html">Founder gate <span>instruction</span></a>', "study map founder link");
    content = replaceOrThrow(content, '<a href="controlledstorageentrydryrun.html">Entry dry run <span>gate</span></a>', '<a href="controlledstorageentrydryrun.html">Entry dry run <span>gate</span></a>\n              <a href="founderstorageinstructiongate.html">Founder gate <span>hold</span></a>', "build map founder link");
  }
  return content;
});

update("controlledstorageentrydryrun.html", (content) => {
  content = updateVersionBadge(content);
  if (!content.includes('href="founderstorageinstructiongate.html"')) {
    content = replaceOrThrow(content, '<a class="button safe" href="replayreceiptdryrun.html">Open Replay Receipt</a>', '<a class="button safe" href="replayreceiptdryrun.html">Open Replay Receipt</a>\n            <a class="button" href="founderstorageinstructiongate.html">Open Founder Gate</a>', "entry page founder link");
  }
  content = replaceOrThrow(content, "Final founder instruction remains required and not granted. No production storage, account, or canonical source write occurs.", "Founder instruction gate now defines the exact instruction shape while writes remain false. No production storage, account, or canonical source write occurs.", "entry page boundary");
  return content;
});

update("build-status.html", (content) => {
  content = updateVersionBadge(content);
  content = replaceRegexOrThrow(content, /<strong>v3\.0\.8<\/strong>\s*<p>Controlled Storage Entry Dry Run:[\s\S]*?<\/p>/, `<strong>${release}</strong>
          <p>Founder Storage Instruction Gate: the exact founder-only instruction packet is now visible before controlled storage can move beyond dry run, while every real write flag stays false.</p>`, "current version tile");
  content = replaceOrThrow(content, '<strong>90%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:90%"></div></div>\n          <p>The trust loop now dry-runs controlled storage entry while keeping the real gate closed.</p>', '<strong>91%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:91%"></div></div>\n          <p>The trust loop now defines founder instruction before any storage move can be interpreted as allowed.</p>', "full vision tile");
  content = replaceRegexOrThrow(content, /<span>Next release<\/span>\s*<strong>Founder storage instruction gate<\/strong>\s*<p>Define the explicit founder-only instruction that would be required before controlled storage can open\.<\/p>/, `<span>Next release</span>
          <strong>Implementation authorization dry run</strong>
          <p>Dry-run the next implementation authorization packet without enabling storage or canonical writes.</p>`, "next release tile");
  if (!content.includes("Phase 273: Founder Storage Instruction Gate")) {
    content = replaceOrThrow(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 273: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 273: Founder Storage Instruction Gate</strong>
                <p>Defines the exact founder-only instruction packet required before controlled storage can move beyond dry run while every write flag remains false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 274: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = replaceOrThrow(content, '<div class="version-row"><span>Release</span><strong>v3.0.8 Controlled Storage Entry Dry Run</strong></div>', `<div class="version-row"><span>Release</span><strong>${release} Founder Storage Instruction Gate</strong></div>`, "release row");
  content = replaceOrThrow(content, '<div class="version-row"><span>Previous</span><strong>v3.0.7 Controlled Storage Entry Criteria</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`, "previous row");
  content = replaceOrThrow(content, '<div class="version-row"><span>Goal</span><strong>Dry-run controlled storage entry before any source storage write.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Define founder-only storage instruction before any source storage write.</strong></div>', "goal row");
  content = replaceOrThrow(content, '<div class="version-row"><span>Status</span><strong>Ready for founder storage instruction gate</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for implementation authorization dry run</strong></div>', "status row");
  content = replaceOrThrow(content, '<li><span class="dot"></span><span>Define founder storage instruction language.</span></li>\n              <li><span class="dot"></span><span>Separate founder approval from storage execution.</span></li>\n              <li><span class="dot"></span><span>Keep pass, return, hold, and block outcomes visible.</span></li>\n              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>', '<li><span class="dot"></span><span>Dry-run implementation authorization from the founder gate.</span></li>\n              <li><span class="dot"></span><span>Keep storage execution disabled.</span></li>\n              <li><span class="dot"></span><span>Show return, hold, and block outcomes before implementation.</span></li>\n              <li><span class="dot"></span><span>Keep canonical writes blocked until explicit execution approval.</span></li>', "next checklist");
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.0\.8 entry dry run<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) {
    fs.writeFileSync(htmlFile, next);
  }
}

console.log(`${release} founder storage instruction gate applied.`);

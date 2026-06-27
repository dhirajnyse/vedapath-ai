import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.1.0";
const badge = "v3.1.0 auth dry run";
const previousRelease = "v3.0.9 Founder Storage Instruction Gate";

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

function mustReplaceRegex(content, pattern, replacement, label) {
  if (!pattern.test(content)) throw new Error(`Missing pattern: ${label}`);
  return content.replace(pattern, replacement);
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

const founder = JSON.parse(read("data/vedapath-founder-storage-instruction-gate.json"));
const founderInstruction = founder.sample_instruction;
const entryDryRun = founder.sample_entry_dry_run;

const sampleFounderGate = {
  schema_version: founder.schema_version,
  release: founder.release,
  founder_instruction_gate_id: "founder-storage-instruction-gate-sample-steady-action-bg-2-48",
  instruction_status: "Founder instruction gate ready",
  founder_instruction_gate_ready: true,
  founder_instruction_granted: false,
  production_ready: false,
  controlled_storage_entry_allowed: false,
  canonical_write_allowed: false,
  storage_write_enabled: false,
  source_write_executed: false,
  actual_storage_write_executed: false,
  next_gate_required: "Implementation authorization dry run",
  entry_dry_run_id: founderInstruction.entry_dry_run_id,
  criteria_packet_id: founderInstruction.criteria_packet_id,
  replay_receipt_id: founderInstruction.replay_receipt_id,
  rollback_receipt_id: founderInstruction.rollback_receipt_id,
  audit_receipt_id: founderInstruction.audit_receipt_id,
  source_answer_id: founderInstruction.source_answer_id,
  source_record_id: founderInstruction.source_record_id,
  source_family: founderInstruction.source_family,
  instruction_actor: founderInstruction.instruction_actor,
  instruction_note: founderInstruction.instruction_note,
  instruction_scope: founderInstruction.instruction_scope,
  allowed_action: founderInstruction.allowed_action,
  forbidden_actions: founderInstruction.forbidden_actions,
  required_phrase: founderInstruction.required_phrase,
  evidence_required: founderInstruction.evidence_required,
  execution_boundary: founderInstruction.execution_boundary,
  revocation_rule: founderInstruction.revocation_rule,
  created_at: "2026-06-27T00:00:00.000Z"
};

const config = {
  schema_version: "implementation-authorization-dry-run-v1",
  release,
  generated_at: "2026-06-27T00:00:00.000Z",
  title: "Implementation Authorization Dry Run",
  summary: "Dry-runs the implementation authorization packet after founder instruction gate while keeping execution, storage writes, canonical writes, migrations, accounts, and production launch disabled.",
  previous_release: previousRelease,
  source: {
    founder_gate_release: founder.release,
    founder_gate_schema: founder.schema_version,
    entry_dry_run_id: founderInstruction.entry_dry_run_id,
    criteria_packet_id: founderInstruction.criteria_packet_id,
    source_answer_id: founderInstruction.source_answer_id,
    source_record_id: founderInstruction.source_record_id,
    source_family: founderInstruction.source_family,
    entry_storage_target: entryDryRun.storage_target,
    entry_schema_route: entryDryRun.schema_route
  },
  authorization_states: [
    "Draft authorization",
    "Needs implementation review",
    "Authorization dry run ready",
    "Return to founder gate",
    "Implementation hold",
    "Implementation blocked",
    "Execution forbidden"
  ],
  required_by_state: {
    "Draft authorization": ["founder_instruction_gate_id", "source_answer_id", "implementation_scope"],
    "Needs implementation review": ["review_question", "implementation_scope", "operator_scope"],
    "Authorization dry run ready": ["allowed_actions", "forbidden_actions", "runtime_boundary", "rollback_required", "monitoring_required", "founder_recheck", "execution_hold"],
    "Return to founder gate": ["return_reason"],
    "Implementation hold": ["hold_reason"],
    "Implementation blocked": ["block_reason"],
    "Execution forbidden": ["block_reason", "execution_hold"]
  },
  authorization_checks: [
    {
      check: "Founder gate ready",
      rule: "Authorization dry run can only start from a founder instruction gate ready packet whose next gate is implementation authorization dry run."
    },
    {
      check: "No founder execution grant",
      rule: "Founder instruction remains a review gate; founder_instruction_granted stays false and cannot be treated as execution authority."
    },
    {
      check: "Implementation scope",
      rule: "Scope must name the future implementation packet, named source-answer record, review-only path, and no production or canonical write."
    },
    {
      check: "Operator scope",
      rule: "Operator scope must stay single-packet, preview-only, and without shared credentials or account creation."
    },
    {
      check: "Allowed actions",
      rule: "Allowed actions are planning, schema confirmation, rollback checklist, monitoring checklist, and review handoff only."
    },
    {
      check: "Forbidden actions",
      rule: "No storage writes, migration runs, account creation, canonical source edits, production flag changes, or secret use."
    },
    {
      check: "Runtime boundary",
      rule: "All write, production, and implementation execution flags remain false."
    },
    {
      check: "Rollback and monitoring",
      rule: "Rollback receipt, before_hash restore path, audit receipt, failure review, and founder recheck must be explicit."
    }
  ],
  sample_founder_gate: sampleFounderGate,
  sample_authorization: {
    authorization_state: "Authorization dry run ready",
    authorization_actor: "Implementation reviewer",
    authorization_note: "Prepare an implementation authorization dry run after founder instruction gate; do not execute storage.",
    founder_instruction_gate_id: sampleFounderGate.founder_instruction_gate_id,
    entry_dry_run_id: sampleFounderGate.entry_dry_run_id,
    criteria_packet_id: sampleFounderGate.criteria_packet_id,
    replay_receipt_id: sampleFounderGate.replay_receipt_id,
    rollback_receipt_id: sampleFounderGate.rollback_receipt_id,
    audit_receipt_id: sampleFounderGate.audit_receipt_id,
    source_answer_id: sampleFounderGate.source_answer_id,
    source_record_id: sampleFounderGate.source_record_id,
    source_family: sampleFounderGate.source_family,
    implementation_scope: "Prepare a future implementation packet for the named source-answer controlled storage entry review; no canonical write, no storage write, and no production release.",
    operator_scope: "Single named packet, preview environment only, no shared credentials, no account creation, and no durable production execution.",
    allowed_actions: "Plan implementation steps, confirm schema route, prepare rollback checklist, prepare monitoring checklist, and produce a review handoff packet.",
    forbidden_actions: "No storage write, no migration run, no account creation, no canonical source edit, no production flag change, and no secret use.",
    runtime_boundary: "Authorization dry run only; implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, and production_ready remains false.",
    rollback_required: "Rollback receipt must remain present; before_hash restore path must be verified before any future execution packet can be considered.",
    monitoring_required: "Audit receipt, failure review path, reviewer handoff, and execution stop condition must be visible before any future execution packet.",
    founder_recheck: "Founder gate must be rechecked before execution; this dry run does not convert founder review into storage authority.",
    execution_hold: "Do not execute storage writes, production writes, migrations, account creation, or canonical source changes in this release.",
    next_gate: "Source promotion hold review",
    review_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    implementation_authorized: false,
    implementation_execution_allowed: false,
    founder_instruction_granted: false,
    controlled_storage_entry_allowed: false,
    storage_write_enabled: false,
    canonical_write_allowed: false,
    source_write_executed: false,
    actual_storage_write_executed: false,
    production_ready: false,
    next_gate_required: "Source promotion hold review"
  }
};

write("data/vedapath-implementation-authorization-dry-run.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-implementation-authorization-dry-run.css", `/* VedaPath implementation authorization dry run */
.auth-app,
.auth-head,
.auth-layout,
.auth-form,
.auth-grid,
.auth-list,
.auth-actions,
.auth-rules {
  display: grid;
  gap: 10px;
}

.auth-app { gap: 16px; }

.auth-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.auth-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.auth-mark img {
  display: block;
  width: 100%;
}

.auth-layout {
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  align-items: start;
}

.auth-form,
.auth-card,
.auth-result,
.auth-packet,
.auth-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.auth-form,
.auth-card,
.auth-result,
.auth-rule {
  padding: 12px;
}

.auth-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.auth-form input,
.auth-form select,
.auth-form textarea,
.auth-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.auth-form textarea,
.auth-packet {
  min-height: 104px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.auth-grid,
.auth-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.auth-card,
.auth-result {
  border-left: 4px solid var(--gold);
}

.auth-card.ready,
.auth-result[data-state="Authorization dry run ready"] {
  border-left-color: var(--green);
}

.auth-card.blocked,
.auth-result[data-state="Blocked"],
.auth-result[data-state="Return to founder gate"],
.auth-result[data-state="Implementation hold"],
.auth-result[data-state="Implementation blocked"],
.auth-result[data-state="Execution forbidden"] {
  border-left-color: var(--ochre);
}

.auth-card span,
.auth-card strong,
.auth-rule span,
.auth-rule strong {
  display: block;
}

.auth-card span,
.auth-rule span {
  color: var(--muted);
  font-size: 12px;
}

.auth-result strong {
  display: block;
  font-size: 24px;
}

.auth-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.auth-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.auth-list {
  max-height: 320px;
  overflow: auto;
}

.auth-packet {
  min-height: 260px;
}

.auth-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  .auth-layout,
  .auth-head,
  .auth-grid,
  .auth-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .auth-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-implementation-authorization-dry-run.js", `(() => {
  const storageKey = "vedapath-implementation-authorization-dry-run";
  const root = document.getElementById("implementationAuthorizationDryRun");
  const savedRoot = document.getElementById("authSaved");
  const resultCard = document.getElementById("authResultCard");
  const packetOutput = document.getElementById("authPacket");
  const checksRoot = document.getElementById("authChecks");
  const scopeRoot = document.getElementById("authScope");

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

  function founderGateReady(packet) {
    return Boolean(packet) &&
      packet.instruction_status === "Founder instruction gate ready" &&
      packet.founder_instruction_gate_ready === true &&
      packet.founder_instruction_granted === false &&
      packet.production_ready === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.canonical_write_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.next_gate_required === "Implementation authorization dry run";
  }

  function keepsRuntimeBoundary(value) {
    const text = String(value || "");
    const required = [
      /implementation_execution_allowed remains false/i,
      /controlled_storage_entry_allowed remains false/i,
      /storage_write_enabled remains false/i,
      /canonical_write_allowed remains false/i,
      /source_write_executed remains false/i,
      /actual_storage_write_executed remains false/i,
      /production_ready remains false/i
    ].every((pattern) => pattern.test(text));
    const unsafe = /(implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|write enabled|migration run|production write|secret use)/i.test(text);
    return required && !unsafe;
  }

  function authMissingForState(config, state, authorization = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(authorization[field] || "").trim());
  }

  function idMatches(authorization, gatePacket, key) {
    return !authorization[key] || !gatePacket[key] || authorization[key] === gatePacket[key];
  }

  function implementationAuthorizationDryRun(config, founderPacket, authorization) {
    const state = authorization.authorization_state || "Draft authorization";
    const missing = authMissingForState(config, state, authorization);
    const blocked = [];
    const warnings = [];

    if (!founderGateReady(founderPacket)) blocked.push("founder instruction gate packet must be ready while every write flag remains false");
    ["founder_instruction_gate_id", "entry_dry_run_id", "criteria_packet_id", "replay_receipt_id", "rollback_receipt_id", "audit_receipt_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(authorization, founderPacket, key)) blocked.push(key + " must match the founder gate packet");
    });

    const readyCandidate = state === "Authorization dry run ready";
    if (readyCandidate && !hasText(authorization.implementation_scope, [["future", "implementation"], ["named", "source-answer"], ["review"], ["no", "canonical"], ["no", "production"]])) {
      blocked.push("implementation scope must be future-only, named-packet, review-only, and block canonical or production changes");
    }
    if (readyCandidate && !hasText(authorization.operator_scope, [["single"], ["preview"], ["no", "credentials"], ["no", "account"], ["no", "production"]])) {
      blocked.push("operator scope must stay single-packet, preview-only, and without credentials or account creation");
    }
    if (readyCandidate && !hasText(authorization.allowed_actions, [["plan"], ["schema"], ["rollback"], ["monitoring"], ["review", "handoff"]])) {
      blocked.push("allowed actions must be planning, schema confirmation, rollback, monitoring, and review handoff only");
    }
    if (readyCandidate && !hasText(authorization.forbidden_actions, [["no", "storage"], ["no", "migration"], ["no", "account"], ["no", "canonical"], ["no", "production"], ["no", "secret"]])) {
      blocked.push("forbidden actions must block storage, migration, account, canonical, production, and secret use");
    }
    if (readyCandidate && !keepsRuntimeBoundary(authorization.runtime_boundary)) {
      blocked.push("runtime boundary must keep implementation, storage, source-write, and production flags false");
    }
    if (readyCandidate && !hasText(authorization.rollback_required, [["rollback"], ["receipt"], ["before_hash"], ["restore"]])) {
      blocked.push("rollback requirement must include receipt, before_hash, and restore path");
    }
    if (readyCandidate && !hasText(authorization.monitoring_required, [["audit"], ["failure"], ["review"], ["stop"]])) {
      blocked.push("monitoring requirement must include audit, failure review, and stop condition");
    }
    if (readyCandidate && !hasText(authorization.founder_recheck, [["founder"], ["gate"], ["recheck"], ["before", "execution"]])) {
      blocked.push("founder recheck must happen before any future execution");
    }
    if (readyCandidate && !hasText(authorization.execution_hold, [["do not", "execute"], ["storage"], ["production"], ["migration"], ["account"], ["canonical"]])) {
      blocked.push("execution hold must forbid storage, production, migration, account, and canonical changes");
    }
    if (state === "Needs implementation review" && !authorization.review_question) blocked.push("review question is required");
    if (state === "Return to founder gate" && !authorization.return_reason) blocked.push("return reason is required");
    if (state === "Implementation hold" && !authorization.hold_reason) blocked.push("hold reason is required");
    if (state === "Implementation blocked" && !authorization.block_reason) blocked.push("block reason is required");
    if (state === "Execution forbidden" && !authorization.block_reason) blocked.push("block reason is required when execution is forbidden");

    if (founderPacket.founder_instruction_granted !== false) warnings.push("founder packet must never be interpreted as execution grant");

    const authorization_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      implementation_authorization_dry_run_id: "implementation-authorization-dry-run-" + Date.now(),
      authorization_status,
      implementation_authorization_dry_run_ready: authorization_status === "Authorization dry run ready",
      implementation_authorized: false,
      implementation_execution_allowed: false,
      founder_instruction_granted: false,
      production_ready: false,
      controlled_storage_entry_allowed: false,
      canonical_write_allowed: false,
      storage_write_enabled: false,
      source_write_executed: false,
      actual_storage_write_executed: false,
      next_gate_required: config.boundary.next_gate_required,
      founder_instruction_gate_id: authorization.founder_instruction_gate_id || founderPacket.founder_instruction_gate_id || "",
      entry_dry_run_id: authorization.entry_dry_run_id || founderPacket.entry_dry_run_id || "",
      criteria_packet_id: authorization.criteria_packet_id || founderPacket.criteria_packet_id || "",
      replay_receipt_id: authorization.replay_receipt_id || founderPacket.replay_receipt_id || "",
      rollback_receipt_id: authorization.rollback_receipt_id || founderPacket.rollback_receipt_id || "",
      audit_receipt_id: authorization.audit_receipt_id || founderPacket.audit_receipt_id || "",
      source_answer_id: authorization.source_answer_id || founderPacket.source_answer_id || "",
      source_record_id: authorization.source_record_id || founderPacket.source_record_id || "",
      source_family: authorization.source_family || founderPacket.source_family || "",
      authorization_actor: authorization.authorization_actor || "",
      authorization_note: authorization.authorization_note || "",
      implementation_scope: authorization.implementation_scope || "",
      operator_scope: authorization.operator_scope || "",
      allowed_actions: authorization.allowed_actions || "",
      forbidden_actions: authorization.forbidden_actions || "",
      runtime_boundary: authorization.runtime_boundary || "",
      rollback_required: authorization.rollback_required || "",
      monitoring_required: authorization.monitoring_required || "",
      founder_recheck: authorization.founder_recheck || "",
      execution_hold: authorization.execution_hold || "",
      review_question: authorization.review_question || "",
      return_reason: authorization.return_reason || "",
      hold_reason: authorization.hold_reason || "",
      block_reason: authorization.block_reason || "",
      missing,
      blocked,
      warnings,
      created_at: new Date().toISOString()
    };
  }

  function authSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.authorization_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Authorization dry run ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Implementation hold"] || 0,
      execution_enabled: packets.filter((packet) => packet.implementation_execution_allowed || packet.storage_write_enabled || packet.source_write_executed).length
    };
  }

  function parseAuthJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="auth-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.authorization_status;
    resultCard.innerHTML = '<strong>' + safe(packet.authorization_status) + '</strong>' +
      '<p class="muted">Dry run ready: ' + safe(packet.implementation_authorization_dry_run_ready) + ' | Authorized: ' + safe(packet.implementation_authorized) + ' | Execution: ' + safe(packet.implementation_execution_allowed) + '</p>' +
      '<div class="auth-grid">' +
        card("Founder gate", packet.founder_instruction_gate_id, packet.implementation_authorization_dry_run_ready ? "ready" : "") +
        card("Source answer", packet.source_answer_id) +
        card("Next gate", packet.next_gate_required) +
        card("Writes", packet.source_write_executed ? "enabled" : "false", packet.source_write_executed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for source promotion hold review. No implementation execution was authorized.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.authorization_checks.map((check) =>
      '<article class="auth-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Storage target", config.source.entry_storage_target],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parseAuthJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(packets) {
    localStorage.setItem(storageKey, JSON.stringify(packets.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const packets = readSaved();
    const snapshot = authSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="auth-card ' + (packet.implementation_authorization_dry_run_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.authorization_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathImplementationAuthorizationDryRun = {
    implementationAuthorizationDryRun,
    authSnapshot,
    authMissingForState,
    parseAuthJson
  };

  if (!root) return;

  fetch("data/vedapath-implementation-authorization-dry-run.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        founderPacket: root.querySelector("#authFounderPacket"),
        state: root.querySelector("#authState"),
        actor: root.querySelector("#authActor"),
        note: root.querySelector("#authNote"),
        gateId: root.querySelector("#authGateId"),
        entryId: root.querySelector("#authEntryId"),
        criteriaId: root.querySelector("#authCriteriaId"),
        replayId: root.querySelector("#authReplayId"),
        rollbackId: root.querySelector("#authRollbackId"),
        auditId: root.querySelector("#authAuditId"),
        sourceAnswer: root.querySelector("#authSourceAnswer"),
        sourceRecord: root.querySelector("#authSourceRecord"),
        sourceFamily: root.querySelector("#authSourceFamily"),
        scope: root.querySelector("#authImplementationScope"),
        operator: root.querySelector("#authOperatorScope"),
        allowed: root.querySelector("#authAllowedActions"),
        forbidden: root.querySelector("#authForbiddenActions"),
        runtime: root.querySelector("#authRuntimeBoundary"),
        rollback: root.querySelector("#authRollbackRequired"),
        monitoring: root.querySelector("#authMonitoringRequired"),
        recheck: root.querySelector("#authFounderRecheck"),
        hold: root.querySelector("#authExecutionHold"),
        review: root.querySelector("#authReviewQuestion"),
        returnReason: root.querySelector("#authReturnReason"),
        holdReason: root.querySelector("#authHoldReason"),
        block: root.querySelector("#authBlockReason")
      };

      config.authorization_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_authorization;
        fields.founderPacket.value = JSON.stringify(config.sample_founder_gate, null, 2);
        fields.state.value = item.authorization_state;
        fields.actor.value = item.authorization_actor;
        fields.note.value = item.authorization_note;
        fields.gateId.value = item.founder_instruction_gate_id;
        fields.entryId.value = item.entry_dry_run_id;
        fields.criteriaId.value = item.criteria_packet_id;
        fields.replayId.value = item.replay_receipt_id;
        fields.rollbackId.value = item.rollback_receipt_id;
        fields.auditId.value = item.audit_receipt_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.implementation_scope;
        fields.operator.value = item.operator_scope;
        fields.allowed.value = item.allowed_actions;
        fields.forbidden.value = item.forbidden_actions;
        fields.runtime.value = item.runtime_boundary;
        fields.rollback.value = item.rollback_required;
        fields.monitoring.value = item.monitoring_required;
        fields.recheck.value = item.founder_recheck;
        fields.hold.value = item.execution_hold;
        fields.review.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildAuthorization() {
        return {
          authorization_state: fields.state.value,
          authorization_actor: fields.actor.value,
          authorization_note: fields.note.value,
          founder_instruction_gate_id: fields.gateId.value,
          entry_dry_run_id: fields.entryId.value,
          criteria_packet_id: fields.criteriaId.value,
          replay_receipt_id: fields.replayId.value,
          rollback_receipt_id: fields.rollbackId.value,
          audit_receipt_id: fields.auditId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          implementation_scope: fields.scope.value,
          operator_scope: fields.operator.value,
          allowed_actions: fields.allowed.value,
          forbidden_actions: fields.forbidden.value,
          runtime_boundary: fields.runtime.value,
          rollback_required: fields.rollback.value,
          monitoring_required: fields.monitoring.value,
          founder_recheck: fields.recheck.value,
          execution_hold: fields.hold.value,
          review_question: fields.review.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const founderPacket = parseAuthJson(fields.founderPacket.value, {});
        const packet = implementationAuthorizationDryRun(config, founderPacket, buildAuthorization());
        packetOutput.value = JSON.stringify(packet, null, 2);
        renderResult(packet);
        return packet;
      }

      root.querySelector("#runAuthDryRun").addEventListener("click", run);
      root.querySelector("#loadAuthSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveAuthDryRun").addEventListener("click", () => {
        const packet = run();
        writeSaved([...readSaved(), packet]);
        renderSaved(config);
      });
      root.querySelector("#clearAuthDryRuns").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyAuthPacket").addEventListener("click", async () => {
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

write("implementationauthorizationdryrun.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Implementation Authorization Dry Run</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-implementation-authorization-dry-run.css">
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
            <span>Implementation authorization dry run</span>
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

      <main class="workspace" aria-label="VedaPath Implementation Authorization Dry Run workspace">
        <aside class="panel">
          <span class="eyebrow">Execution stays closed</span>
          <h2>Dry-run the implementation path</h2>
          <p class="muted">This room turns the founder gate into a review-only implementation packet. It cannot execute storage.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Gate</strong><p>Load founder gate.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Scope</strong><p>Name operator limits.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Runbook</strong><p>Plan only.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Hold</strong><p>Block execution.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="founderstorageinstructiongate.html">Open Founder Gate</a>
            <a class="button safe" href="controlledstorageentrydryrun.html">Open Entry Dry Run</a>
          </div>
        </aside>

        <section class="panel auth-app" id="implementationAuthorizationDryRun">
          <div class="auth-head">
            <div>
              <span class="eyebrow">Authorization dry run</span>
              <h1>Prepare implementation. Forbid execution.</h1>
              <p class="muted">A ready packet here means implementation can be reviewed. It still cannot write storage, run migrations, create accounts, or touch canonical source data.</p>
            </div>
            <div class="auth-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath implementation authorization mark"></div>
          </div>

          <section class="auth-layout">
            <div class="auth-form">
              <h2>Authorization Dry Run Packet</h2>
              <label>Founder gate packet<textarea id="authFounderPacket"></textarea></label>
              <label>Authorization state<select id="authState"></select></label>
              <label>Authorization actor<input id="authActor" type="text" placeholder="Implementation reviewer"></label>
              <label>Authorization note<textarea id="authNote"></textarea></label>
              <label>Founder gate id<input id="authGateId" type="text"></label>
              <label>Entry dry-run id<input id="authEntryId" type="text"></label>
              <label>Criteria packet id<input id="authCriteriaId" type="text"></label>
              <label>Replay receipt id<input id="authReplayId" type="text"></label>
              <label>Rollback receipt id<input id="authRollbackId" type="text"></label>
              <label>Audit receipt id<input id="authAuditId" type="text"></label>
              <label>Source answer id<input id="authSourceAnswer" type="text"></label>
              <label>Source record id<input id="authSourceRecord" type="text"></label>
              <label>Source family<input id="authSourceFamily" type="text"></label>
              <label>Implementation scope<textarea id="authImplementationScope"></textarea></label>
              <label>Operator scope<textarea id="authOperatorScope"></textarea></label>
              <label>Allowed actions<textarea id="authAllowedActions"></textarea></label>
              <label>Forbidden actions<textarea id="authForbiddenActions"></textarea></label>
              <label>Runtime boundary<textarea id="authRuntimeBoundary"></textarea></label>
              <label>Rollback required<textarea id="authRollbackRequired"></textarea></label>
              <label>Monitoring required<textarea id="authMonitoringRequired"></textarea></label>
              <label>Founder recheck<textarea id="authFounderRecheck"></textarea></label>
              <label>Execution hold<textarea id="authExecutionHold"></textarea></label>
              <label>Review question<textarea id="authReviewQuestion"></textarea></label>
              <label>Return reason<textarea id="authReturnReason"></textarea></label>
              <label>Hold reason<textarea id="authHoldReason"></textarea></label>
              <label>Block reason<textarea id="authBlockReason"></textarea></label>
              <div class="auth-actions">
                <button class="button primary" id="runAuthDryRun" type="button">Run Dry Run</button>
                <button class="button safe" id="loadAuthSample" type="button">Load Sample</button>
                <button class="button" id="saveAuthDryRun" type="button">Save Local</button>
                <button class="button" id="clearAuthDryRuns" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="auth-result" id="authResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Authorization Scope</h2>
                <div class="auth-list" id="authScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Authorization Checks</h2>
            <div class="auth-rules" id="authChecks"></div>
          </section>

          <section class="auth-layout">
            <div>
              <div class="auth-actions">
                <button class="button safe" id="copyAuthPacket" type="button">Copy Dry Run Packet</button>
                <a class="button" href="data/vedapath-implementation-authorization-dry-run.json">Open JSON</a>
              </div>
              <textarea class="auth-packet" id="authPacket" aria-label="Implementation authorization dry-run packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Dry Runs</h2>
              <div class="auth-list" id="authSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Dry run is not authorization</span>
          <h2 style="margin-top: 14px;">Execution Cannot Sneak In</h2>
          <p class="muted">The implementation route can be prepared for review, but it cannot run, migrate, create accounts, use secrets, or write source data.</p>
          <div class="progress" aria-label="Implementation authorization dry run progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>7</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Promotion hold</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Execution Hold</h2>
            <p class="auth-boundary">Do not execute storage writes, production writes, migrations, account creation, or canonical source changes in this release.</p>
            <p class="muted">This release prepares the next review lane. It does not open the lane.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-implementation-authorization-dry-run.js"></script>
  </body>
</html>
`);

write("docs/IMPLEMENTATION_AUTHORIZATION_DRY_RUN.md", `# VedaPath AI Implementation Authorization Dry Run

Release: ${release}

This release dry-runs the implementation authorization packet after the founder storage instruction gate.

## Files

- data/vedapath-implementation-authorization-dry-run.json
- implementationauthorizationdryrun.html
- assets/vedapath-implementation-authorization-dry-run.css
- assets/vedapath-implementation-authorization-dry-run.js

## What It Adds

The room:

- starts from a founder instruction gate ready packet
- confirms founder review is not execution authority
- checks implementation and operator scope
- separates allowed planning from forbidden execution
- requires rollback, monitoring, founder recheck, and execution hold text
- keeps implementation, storage, source-write, and production flags false
- exports a copyable implementation authorization dry-run packet

## Boundary

Implementation authorization dry run is not implementation authorization. It does not grant execution, storage writes, migration runs, account creation, secret use, canonical source edits, or production launch. The next release should review source promotion hold conditions before any execution path exists.
`);

const readmeBlock = `<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN START -->
## ${release} Implementation Authorization Dry Run

This release dry-runs the implementation authorization packet after founder instruction gate.

- [Implementation Authorization Dry Run](implementationauthorizationdryrun.html)
- [Implementation Authorization Dry Run Notes](docs/IMPLEMENTATION_AUTHORIZATION_DRY_RUN.md)
- [Implementation Authorization Dry Run Data](data/vedapath-implementation-authorization-dry-run.json)

<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN END -->

`;

update("README.md", (content) => {
  if (content.includes("VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN START")) return content;
  return mustReplace(content, "<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE START -->", readmeBlock + "<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE START -->", "README insertion");
});

const notesBlock = `<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN NOTES START -->
## ${release} Implementation Authorization Dry Run

This phase dry-runs implementation authorization without permitting implementation execution.

- Adds an implementation authorization dry-run room.
- Reads a founder instruction gate ready packet.
- Requires implementation scope, operator scope, allowed planning actions, forbidden execution actions, rollback, monitoring, founder recheck, and execution hold text.
- Keeps implementation_authorized, implementation_execution_allowed, founder_instruction_granted, controlled_storage_entry_allowed, storage_write_enabled, canonical_write_allowed, source_write_executed, actual_storage_write_executed, and production_ready false.

<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN NOTES END -->

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes("VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN NOTES START")) return content;
  return mustReplace(content, "<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE NOTES START -->", notesBlock + "<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE NOTES START -->", "prototype notes insertion");
});

const blueprintBlock = `<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN BLUEPRINT START -->
### 293. Implementation Authorization Dry Run

VedaPath should prove implementation can be prepared without being allowed to execute. The implementation authorization dry run turns founder instruction into a review-only packet.

Core requirements:

- start from a founder instruction gate ready packet
- keep founder review separate from execution authority
- define implementation scope and operator scope
- permit planning, schema confirmation, rollback checklist, monitoring checklist, and review handoff only
- forbid storage writes, migrations, account creation, canonical source edits, production flags, and secret use
- require rollback, monitoring, founder recheck, and execution hold text

Implementation Authorization Dry Run should never claim production storage, implementation execution, canonical source writes, migration execution, account creation, secret handling, launch approval, therapy, ritual instruction, crisis support, or spiritual authority.
<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN BLUEPRINT END -->

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN BLUEPRINT START")) return content;
  return mustReplace(content, "<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE BLUEPRINT START -->", blueprintBlock + "<!-- VEDAPATH FOUNDER STORAGE INSTRUCTION GATE BLUEPRINT START -->", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/v3\.0\.9 founder gate/g, badge);
  content = mustReplace(content, "implementation authorization dry runs, source promotion, and production memory.", "source promotion hold review, execution readiness, and production memory.", "home next release sentence");
  if (!content.includes('href="implementationauthorizationdryrun.html"')) {
    content = mustReplace(content, '<a href="founderstorageinstructiongate.html">Founder gate <span>instruction</span></a>', '<a href="founderstorageinstructiongate.html">Founder gate <span>instruction</span></a>\n              <a href="implementationauthorizationdryrun.html">Authorization <span>dry run</span></a>', "study map auth link");
    content = mustReplace(content, '<a href="founderstorageinstructiongate.html">Founder gate <span>hold</span></a>', '<a href="founderstorageinstructiongate.html">Founder gate <span>hold</span></a>\n              <a href="implementationauthorizationdryrun.html">Authorization <span>execution hold</span></a>', "build map auth link");
  }
  return content;
});

update("founderstorageinstructiongate.html", (content) => {
  content = content.replace(/v3\.0\.9 founder gate/g, badge);
  if (!content.includes('href="implementationauthorizationdryrun.html"')) {
    content = mustReplace(content, '<a class="button safe" href="controlledstoragecriteria.html">Open Criteria</a>', '<a class="button safe" href="controlledstoragecriteria.html">Open Criteria</a>\n            <a class="button" href="implementationauthorizationdryrun.html">Open Auth Dry Run</a>', "founder page auth link");
  }
  content = content.replace("Even this phrase only opens the next review gate, not storage itself.", "This phrase opens the implementation authorization dry run, not storage itself.");
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/v3\.0\.9 founder gate/g, badge);
  content = mustReplaceRegex(content, /<strong>v3\.0\.9<\/strong>\s*<p>Founder Storage Instruction Gate:[\s\S]*?<\/p>/, `<strong>${release}</strong>
          <p>Implementation Authorization Dry Run: founder gate packets now become review-only implementation packets while execution, storage, migration, account, and canonical writes remain false.</p>`, "current version tile");
  content = mustReplace(content, '<strong>91%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:91%"></div></div>\n          <p>The trust loop now defines founder instruction before any storage move can be interpreted as allowed.</p>', '<strong>92%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:92%"></div></div>\n          <p>The trust loop now dry-runs implementation authorization while execution remains forbidden.</p>', "full vision tile");
  content = mustReplaceRegex(content, /<span>Next release<\/span>\s*<strong>Implementation authorization dry run<\/strong>\s*<p>Dry-run the next implementation authorization packet without enabling storage or canonical writes\.<\/p>/, `<span>Next release</span>
          <strong>Source promotion hold review</strong>
          <p>Review promotion hold conditions before any source packet can approach an execution path.</p>`, "next release tile");
  if (!content.includes("Phase 274: Implementation Authorization Dry Run")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 274: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 274: Implementation Authorization Dry Run</strong>
                <p>Turns founder gate packets into review-only implementation packets while execution, storage writes, migrations, accounts, and canonical source edits remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 275: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = mustReplace(content, '<div class="version-row"><span>Release</span><strong>v3.0.9 Founder Storage Instruction Gate</strong></div>', `<div class="version-row"><span>Release</span><strong>${release} Implementation Authorization Dry Run</strong></div>`, "release row");
  content = mustReplace(content, '<div class="version-row"><span>Previous</span><strong>v3.0.8 Controlled Storage Entry Dry Run</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`, "previous row");
  content = mustReplace(content, '<div class="version-row"><span>Goal</span><strong>Define founder-only storage instruction before any source storage write.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Dry-run implementation authorization without enabling execution.</strong></div>', "goal row");
  content = mustReplace(content, '<div class="version-row"><span>Status</span><strong>Ready for implementation authorization dry run</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for source promotion hold review</strong></div>', "status row");
  content = mustReplace(content, '<li><span class="dot"></span><span>Dry-run implementation authorization from the founder gate.</span></li>\n              <li><span class="dot"></span><span>Keep storage execution disabled.</span></li>\n              <li><span class="dot"></span><span>Show return, hold, and block outcomes before implementation.</span></li>\n              <li><span class="dot"></span><span>Keep canonical writes blocked until explicit execution approval.</span></li>', '<li><span class="dot"></span><span>Define source promotion hold conditions.</span></li>\n              <li><span class="dot"></span><span>Separate review-ready packets from execution-ready packets.</span></li>\n              <li><span class="dot"></span><span>Keep execution paths blocked until final approval.</span></li>\n              <li><span class="dot"></span><span>Preserve rollback, monitoring, and founder recheck evidence.</span></li>', "next checklist");
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.0\.9 founder gate<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} implementation authorization dry run applied.`);

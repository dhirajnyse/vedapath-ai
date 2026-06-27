import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.1.2";
const badge = "v3.1.2 preflight";
const previousRelease = "v3.1.1 Source Promotion Hold Review";

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

const holdConfig = JSON.parse(read("data/vedapath-source-promotion-hold-review.json"));
const hold = holdConfig.sample_hold;

const sampleHoldReview = {
  schema_version: holdConfig.schema_version,
  release: holdConfig.release,
  source_promotion_hold_review_id: "source-promotion-hold-review-sample-steady-action-bg-2-48",
  promotion_status: "Promotion hold review ready",
  source_promotion_hold_review_ready: true,
  source_promotion_allowed: false,
  promotion_execution_allowed: false,
  implementation_authorized: false,
  implementation_execution_allowed: false,
  founder_instruction_granted: false,
  production_ready: false,
  controlled_storage_entry_allowed: false,
  canonical_write_allowed: false,
  storage_write_enabled: false,
  source_write_executed: false,
  actual_storage_write_executed: false,
  next_gate_required: "Promotion execution preflight",
  implementation_authorization_dry_run_id: hold.implementation_authorization_dry_run_id,
  founder_instruction_gate_id: hold.founder_instruction_gate_id,
  entry_dry_run_id: hold.entry_dry_run_id,
  criteria_packet_id: hold.criteria_packet_id,
  replay_receipt_id: hold.replay_receipt_id,
  rollback_receipt_id: hold.rollback_receipt_id,
  audit_receipt_id: hold.audit_receipt_id,
  source_answer_id: hold.source_answer_id,
  source_record_id: hold.source_record_id,
  source_family: hold.source_family,
  promotion_actor: hold.promotion_actor,
  promotion_note: hold.promotion_note,
  promotion_scope: hold.promotion_scope,
  hold_conditions: hold.hold_conditions,
  source_integrity_check: hold.source_integrity_check,
  rights_and_translation_check: hold.rights_and_translation_check,
  reviewer_evidence_required: hold.reviewer_evidence_required,
  promotion_boundary: hold.promotion_boundary,
  rollback_reference: hold.rollback_reference,
  founder_recheck: hold.founder_recheck,
  created_at: "2026-06-27T00:00:00.000Z"
};

const config = {
  schema_version: "promotion-execution-preflight-v1",
  release,
  generated_at: "2026-06-27T00:00:00.000Z",
  title: "Promotion Execution Preflight",
  summary: "Dry-runs final execution readiness after source promotion hold review while keeping execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, and production disabled.",
  previous_release: previousRelease,
  source: {
    source_promotion_hold_release: holdConfig.release,
    source_promotion_hold_schema: holdConfig.schema_version,
    source_promotion_hold_review_id: sampleHoldReview.source_promotion_hold_review_id,
    implementation_authorization_dry_run_id: sampleHoldReview.implementation_authorization_dry_run_id,
    source_answer_id: sampleHoldReview.source_answer_id,
    source_record_id: sampleHoldReview.source_record_id,
    source_family: sampleHoldReview.source_family,
    entry_dry_run_id: sampleHoldReview.entry_dry_run_id,
    criteria_packet_id: sampleHoldReview.criteria_packet_id
  },
  preflight_states: [
    "Draft execution preflight",
    "Needs execution preflight review",
    "Execution preflight ready",
    "Return to promotion hold",
    "Execution hold",
    "Execution blocked",
    "Production forbidden"
  ],
  required_by_state: {
    "Draft execution preflight": ["source_promotion_hold_review_id", "source_answer_id", "preflight_scope"],
    "Needs execution preflight review": ["review_question", "preflight_scope", "execution_conditions"],
    "Execution preflight ready": [
      "execution_conditions",
      "readonly_rehearsal",
      "final_blockers",
      "rollback_plan",
      "monitoring_plan",
      "human_approval_check",
      "execution_boundary",
      "production_boundary"
    ],
    "Return to promotion hold": ["return_reason"],
    "Execution hold": ["hold_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "execution_boundary"]
  },
  preflight_checks: [
    {
      check: "Promotion hold ready",
      rule: "Execution preflight can only start from a source promotion hold review ready packet whose next gate is promotion execution preflight."
    },
    {
      check: "No promotion grant",
      rule: "Promotion hold review remains review-only; source promotion and promotion execution stay false."
    },
    {
      check: "Preflight scope",
      rule: "Scope must name a future execution packet, the named source-answer packet, and all forbidden execution routes."
    },
    {
      check: "Final blockers",
      rule: "Missing rights, owner scope, reviewer evidence, rollback, monitoring, founder recheck, or any true write flag blocks execution."
    },
    {
      check: "Human approval",
      rule: "Human approval must be explicit, named, source-specific, and separate from founder review."
    },
    {
      check: "Execution boundary",
      rule: "Preflight readiness never enables execution, storage, canonical writes, migrations, accounts, secrets, or production."
    }
  ],
  sample_hold_review: sampleHoldReview,
  sample_preflight: {
    preflight_state: "Execution preflight ready",
    preflight_actor: "Execution preflight reviewer",
    preflight_note: "Dry-run final execution preflight after promotion hold; do not execute.",
    source_promotion_hold_review_id: sampleHoldReview.source_promotion_hold_review_id,
    implementation_authorization_dry_run_id: sampleHoldReview.implementation_authorization_dry_run_id,
    founder_instruction_gate_id: sampleHoldReview.founder_instruction_gate_id,
    entry_dry_run_id: sampleHoldReview.entry_dry_run_id,
    criteria_packet_id: sampleHoldReview.criteria_packet_id,
    replay_receipt_id: sampleHoldReview.replay_receipt_id,
    rollback_receipt_id: sampleHoldReview.rollback_receipt_id,
    audit_receipt_id: sampleHoldReview.audit_receipt_id,
    source_answer_id: sampleHoldReview.source_answer_id,
    source_record_id: sampleHoldReview.source_record_id,
    source_family: sampleHoldReview.source_family,
    preflight_scope: "Dry-run whether the named source-answer packet has enough evidence to enter a future execution packet; do not execute, promote, store, write canonical source, run migration, create account, use secrets, or launch production.",
    execution_conditions: "All prerequisites are review-only: promotion hold ready, source integrity visible, rights and translation reviewed, reviewer evidence present, rollback plan present, monitoring plan present, human approval check present, and founder recheck present.",
    readonly_rehearsal: "Run a dry rehearsal only; produce an execution plan and failure path without touching storage, canonical source, accounts, secrets, migrations, or production.",
    final_blockers: "Block execution when rights review is missing, source owner scope is missing, reviewer evidence is missing, rollback plan is missing, monitoring plan is missing, founder recheck is missing, or any write flag would become true.",
    rollback_plan: "Rollback and replay receipts remain the restore reference; before_hash restore path and failure review are documented, but no source state is written.",
    monitoring_plan: "If a future execution packet exists, it must expose audit receipt, stop condition, failure review, reviewer handoff, and post-execution verification before any write is allowed.",
    human_approval_check: "Human approval must be explicit, named, source-specific, and separate from founder review; this preflight is not approval.",
    execution_boundary: "Execution preflight only; execution_preflight_passed remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, and production_ready remains false.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, or durable storage path is opened.",
    next_gate: "Founder execution instruction gate",
    review_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    execution_preflight_passed: false,
    execution_authorized: false,
    execution_allowed: false,
    source_promotion_allowed: false,
    promotion_execution_allowed: false,
    implementation_authorized: false,
    implementation_execution_allowed: false,
    founder_instruction_granted: false,
    controlled_storage_entry_allowed: false,
    storage_write_enabled: false,
    canonical_write_allowed: false,
    source_write_executed: false,
    actual_storage_write_executed: false,
    production_ready: false,
    production_launch_allowed: false,
    public_release_allowed: false,
    next_gate_required: "Founder execution instruction gate"
  }
};

write("data/vedapath-promotion-execution-preflight.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-promotion-execution-preflight.css", `/* VedaPath promotion execution preflight */
.preflight-app,
.preflight-head,
.preflight-layout,
.preflight-form,
.preflight-grid,
.preflight-list,
.preflight-actions,
.preflight-rules {
  display: grid;
  gap: 10px;
}

.preflight-app { gap: 16px; }

.preflight-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.preflight-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.preflight-mark img {
  display: block;
  width: 100%;
}

.preflight-layout {
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  align-items: start;
}

.preflight-form,
.preflight-card,
.preflight-result,
.preflight-packet,
.preflight-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.preflight-form,
.preflight-card,
.preflight-result,
.preflight-rule {
  padding: 12px;
}

.preflight-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.preflight-form input,
.preflight-form select,
.preflight-form textarea,
.preflight-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.preflight-form textarea,
.preflight-packet {
  min-height: 104px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.preflight-grid,
.preflight-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.preflight-card,
.preflight-result {
  border-left: 4px solid var(--gold);
}

.preflight-card.ready,
.preflight-result[data-state="Execution preflight ready"] {
  border-left-color: var(--green);
}

.preflight-card.blocked,
.preflight-result[data-state="Blocked"],
.preflight-result[data-state="Return to promotion hold"],
.preflight-result[data-state="Execution hold"],
.preflight-result[data-state="Execution blocked"],
.preflight-result[data-state="Production forbidden"] {
  border-left-color: var(--ochre);
}

.preflight-card span,
.preflight-card strong,
.preflight-rule span,
.preflight-rule strong {
  display: block;
}

.preflight-card span,
.preflight-rule span {
  color: var(--muted);
  font-size: 12px;
}

.preflight-result strong {
  display: block;
  font-size: 24px;
}

.preflight-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.preflight-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.preflight-list {
  max-height: 320px;
  overflow: auto;
}

.preflight-packet {
  min-height: 260px;
}

.preflight-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  .preflight-layout,
  .preflight-head,
  .preflight-grid,
  .preflight-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .preflight-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-promotion-execution-preflight.js", `(() => {
  const storageKey = "vedapath-promotion-execution-preflight";
  const root = document.getElementById("promotionExecutionPreflight");
  const savedRoot = document.getElementById("preflightSaved");
  const resultCard = document.getElementById("preflightResultCard");
  const packetOutput = document.getElementById("preflightPacket");
  const checksRoot = document.getElementById("preflightChecks");
  const scopeRoot = document.getElementById("preflightScope");

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

  function holdReviewReady(packet) {
    return Boolean(packet) &&
      packet.promotion_status === "Promotion hold review ready" &&
      packet.source_promotion_hold_review_ready === true &&
      packet.source_promotion_allowed === false &&
      packet.promotion_execution_allowed === false &&
      packet.implementation_authorized === false &&
      packet.implementation_execution_allowed === false &&
      packet.founder_instruction_granted === false &&
      packet.production_ready === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.canonical_write_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.next_gate_required === "Promotion execution preflight";
  }

  function keepsExecutionBoundary(value) {
    const text = String(value || "");
    const required = [
      /execution_preflight_passed remains false/i,
      /execution_authorized remains false/i,
      /execution_allowed remains false/i,
      /source_promotion_allowed remains false/i,
      /promotion_execution_allowed remains false/i,
      /implementation_execution_allowed remains false/i,
      /controlled_storage_entry_allowed remains false/i,
      /storage_write_enabled remains false/i,
      /canonical_write_allowed remains false/i,
      /source_write_executed remains false/i,
      /actual_storage_write_executed remains false/i,
      /production_ready remains false/i
    ].every((pattern) => pattern.test(text));
    const unsafe = /(execution_preflight_passed true|execution_authorized true|execution_allowed true|source_promotion_allowed true|promotion_execution_allowed true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|execute now|write enabled|production write|canonical update|migration run|secret use)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["opened"]]);
  }

  function preflightMissingForState(config, state, preflight = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(preflight[field] || "").trim());
  }

  function idMatches(preflight, holdPacket, key) {
    return !preflight[key] || !holdPacket[key] || preflight[key] === holdPacket[key];
  }

  function promotionExecutionPreflight(config, holdPacket, preflight) {
    const state = preflight.preflight_state || "Draft execution preflight";
    const missing = preflightMissingForState(config, state, preflight);
    const blocked = [];
    const warnings = [];

    if (!holdReviewReady(holdPacket)) blocked.push("source promotion hold review packet must be ready while promotion, execution, storage, and production flags remain false");
    ["source_promotion_hold_review_id", "implementation_authorization_dry_run_id", "founder_instruction_gate_id", "entry_dry_run_id", "criteria_packet_id", "replay_receipt_id", "rollback_receipt_id", "audit_receipt_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(preflight, holdPacket, key)) blocked.push(key + " must match the source promotion hold packet");
    });

    const readyCandidate = state === "Execution preflight ready";
    if (readyCandidate && !hasText(preflight.preflight_scope, [["named", "source-answer"], ["future", "execution", "packet"], ["do not", "execute"], ["promote"], ["store"], ["canonical"], ["migration"], ["account"], ["secrets"], ["production"]])) {
      blocked.push("preflight scope must be future-only, named-packet, and explicitly block execution, promotion, storage, canonical writes, migration, accounts, secrets, and production");
    }
    if (readyCandidate && !hasText(preflight.execution_conditions, [["promotion hold"], ["source integrity"], ["rights"], ["translation"], ["reviewer evidence"], ["rollback plan"], ["monitoring plan"], ["human approval"], ["founder"]])) {
      blocked.push("execution conditions must include promotion hold, source integrity, rights, translation, reviewer evidence, rollback, monitoring, human approval, and founder recheck");
    }
    if (readyCandidate && !hasText(preflight.readonly_rehearsal, [["dry rehearsal"], ["execution plan"], ["failure path"], ["without touching"], ["storage"], ["canonical"], ["accounts"], ["secrets"], ["migrations"], ["production"]])) {
      blocked.push("readonly rehearsal must produce a plan and failure path without touching execution surfaces");
    }
    if (readyCandidate && !hasText(preflight.final_blockers, [["rights review"], ["source owner"], ["reviewer evidence"], ["rollback"], ["monitoring"], ["founder"], ["write flag"]])) {
      blocked.push("final blockers must include rights, source owner, reviewer evidence, rollback, monitoring, founder, and write-flag blockers");
    }
    if (readyCandidate && !hasText(preflight.rollback_plan, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["no source state"]])) {
      blocked.push("rollback plan must include rollback, replay, before_hash, failure review, and no source state write");
    }
    if (readyCandidate && !hasText(preflight.monitoring_plan, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before any write"]])) {
      blocked.push("monitoring plan must include audit, stop condition, failure review, handoff, post-execution verification, and before-write boundary");
    }
    if (readyCandidate && !hasText(preflight.human_approval_check, [["human approval"], ["explicit"], ["named"], ["source-specific"], ["separate"], ["founder review"], ["not approval"]])) {
      blocked.push("human approval check must be explicit, named, source-specific, separate from founder review, and not treated as approval");
    }
    if (readyCandidate && !keepsExecutionBoundary(preflight.execution_boundary)) {
      blocked.push("execution boundary must keep preflight pass, execution, promotion, storage, source-write, canonical, and production flags false");
    }
    if (readyCandidate && !keepsProductionBoundary(preflight.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, and durable storage paths closed");
    }
    if (state === "Needs execution preflight review" && !preflight.review_question) blocked.push("review question is required");
    if (state === "Return to promotion hold" && !preflight.return_reason) blocked.push("return reason is required");
    if (state === "Execution hold" && !preflight.hold_reason) blocked.push("hold reason is required");
    if (state === "Execution blocked" && !preflight.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !preflight.block_reason) blocked.push("block reason is required when production is forbidden");

    if (holdPacket.promotion_execution_allowed !== false) warnings.push("promotion hold review must never be interpreted as promotion execution");

    const preflight_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      promotion_execution_preflight_id: "promotion-execution-preflight-" + Date.now(),
      preflight_status,
      execution_preflight_review_ready: preflight_status === "Execution preflight ready",
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
      next_gate_required: config.boundary.next_gate_required,
      source_promotion_hold_review_id: preflight.source_promotion_hold_review_id || holdPacket.source_promotion_hold_review_id || "",
      implementation_authorization_dry_run_id: preflight.implementation_authorization_dry_run_id || holdPacket.implementation_authorization_dry_run_id || "",
      founder_instruction_gate_id: preflight.founder_instruction_gate_id || holdPacket.founder_instruction_gate_id || "",
      entry_dry_run_id: preflight.entry_dry_run_id || holdPacket.entry_dry_run_id || "",
      criteria_packet_id: preflight.criteria_packet_id || holdPacket.criteria_packet_id || "",
      replay_receipt_id: preflight.replay_receipt_id || holdPacket.replay_receipt_id || "",
      rollback_receipt_id: preflight.rollback_receipt_id || holdPacket.rollback_receipt_id || "",
      audit_receipt_id: preflight.audit_receipt_id || holdPacket.audit_receipt_id || "",
      source_answer_id: preflight.source_answer_id || holdPacket.source_answer_id || "",
      source_record_id: preflight.source_record_id || holdPacket.source_record_id || "",
      source_family: preflight.source_family || holdPacket.source_family || "",
      preflight_actor: preflight.preflight_actor || "",
      preflight_note: preflight.preflight_note || "",
      preflight_scope: preflight.preflight_scope || "",
      execution_conditions: preflight.execution_conditions || "",
      readonly_rehearsal: preflight.readonly_rehearsal || "",
      final_blockers: preflight.final_blockers || "",
      rollback_plan: preflight.rollback_plan || "",
      monitoring_plan: preflight.monitoring_plan || "",
      human_approval_check: preflight.human_approval_check || "",
      execution_boundary: preflight.execution_boundary || "",
      production_boundary: preflight.production_boundary || "",
      review_question: preflight.review_question || "",
      return_reason: preflight.return_reason || "",
      hold_reason: preflight.hold_reason || "",
      block_reason: preflight.block_reason || "",
      missing,
      blocked,
      warnings,
      created_at: new Date().toISOString()
    };
  }

  function preflightSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.preflight_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Execution preflight ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Execution hold"] || 0,
      execution_enabled: packets.filter((packet) => packet.execution_allowed || packet.execution_authorized || packet.storage_write_enabled || packet.source_write_executed || packet.production_ready).length
    };
  }

  function parsePreflightJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="preflight-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.preflight_status;
    resultCard.innerHTML = '<strong>' + safe(packet.preflight_status) + '</strong>' +
      '<p class="muted">Preflight ready: ' + safe(packet.execution_preflight_review_ready) + ' | Execution: ' + safe(packet.execution_allowed) + ' | Production: ' + safe(packet.production_ready) + '</p>' +
      '<div class="preflight-grid">' +
        card("Promotion hold", packet.source_promotion_hold_review_id, packet.execution_preflight_review_ready ? "ready" : "") +
        card("Source answer", packet.source_answer_id) +
        card("Next gate", packet.next_gate_required) +
        card("Execution", packet.execution_allowed ? "enabled" : "false", packet.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for founder execution instruction gate. No execution, storage write, canonical update, or production release was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.preflight_checks.map((check) =>
      '<article class="preflight-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Promotion hold", config.source.source_promotion_hold_review_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parsePreflightJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(packets) {
    localStorage.setItem(storageKey, JSON.stringify(packets.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const packets = readSaved();
    const snapshot = preflightSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="preflight-card ' + (packet.execution_preflight_review_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.preflight_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathPromotionExecutionPreflight = {
    promotionExecutionPreflight,
    preflightSnapshot,
    preflightMissingForState,
    parsePreflightJson
  };

  if (!root) return;

  fetch("data/vedapath-promotion-execution-preflight.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        holdPacket: root.querySelector("#preflightHoldPacket"),
        state: root.querySelector("#preflightState"),
        actor: root.querySelector("#preflightActor"),
        note: root.querySelector("#preflightNote"),
        holdId: root.querySelector("#preflightHoldId"),
        authId: root.querySelector("#preflightAuthId"),
        gateId: root.querySelector("#preflightGateId"),
        entryId: root.querySelector("#preflightEntryId"),
        criteriaId: root.querySelector("#preflightCriteriaId"),
        replayId: root.querySelector("#preflightReplayId"),
        rollbackId: root.querySelector("#preflightRollbackId"),
        auditId: root.querySelector("#preflightAuditId"),
        sourceAnswer: root.querySelector("#preflightSourceAnswer"),
        sourceRecord: root.querySelector("#preflightSourceRecord"),
        sourceFamily: root.querySelector("#preflightSourceFamily"),
        scope: root.querySelector("#preflightScopeText"),
        conditions: root.querySelector("#preflightExecutionConditions"),
        rehearsal: root.querySelector("#preflightReadonlyRehearsal"),
        blockers: root.querySelector("#preflightFinalBlockers"),
        rollback: root.querySelector("#preflightRollbackPlan"),
        monitoring: root.querySelector("#preflightMonitoringPlan"),
        human: root.querySelector("#preflightHumanApproval"),
        boundary: root.querySelector("#preflightExecutionBoundary"),
        production: root.querySelector("#preflightProductionBoundary"),
        review: root.querySelector("#preflightReviewQuestion"),
        returnReason: root.querySelector("#preflightReturnReason"),
        holdReason: root.querySelector("#preflightHoldReason"),
        block: root.querySelector("#preflightBlockReason")
      };

      config.preflight_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_preflight;
        fields.holdPacket.value = JSON.stringify(config.sample_hold_review, null, 2);
        fields.state.value = item.preflight_state;
        fields.actor.value = item.preflight_actor;
        fields.note.value = item.preflight_note;
        fields.holdId.value = item.source_promotion_hold_review_id;
        fields.authId.value = item.implementation_authorization_dry_run_id;
        fields.gateId.value = item.founder_instruction_gate_id;
        fields.entryId.value = item.entry_dry_run_id;
        fields.criteriaId.value = item.criteria_packet_id;
        fields.replayId.value = item.replay_receipt_id;
        fields.rollbackId.value = item.rollback_receipt_id;
        fields.auditId.value = item.audit_receipt_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.preflight_scope;
        fields.conditions.value = item.execution_conditions;
        fields.rehearsal.value = item.readonly_rehearsal;
        fields.blockers.value = item.final_blockers;
        fields.rollback.value = item.rollback_plan;
        fields.monitoring.value = item.monitoring_plan;
        fields.human.value = item.human_approval_check;
        fields.boundary.value = item.execution_boundary;
        fields.production.value = item.production_boundary;
        fields.review.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildPreflight() {
        return {
          preflight_state: fields.state.value,
          preflight_actor: fields.actor.value,
          preflight_note: fields.note.value,
          source_promotion_hold_review_id: fields.holdId.value,
          implementation_authorization_dry_run_id: fields.authId.value,
          founder_instruction_gate_id: fields.gateId.value,
          entry_dry_run_id: fields.entryId.value,
          criteria_packet_id: fields.criteriaId.value,
          replay_receipt_id: fields.replayId.value,
          rollback_receipt_id: fields.rollbackId.value,
          audit_receipt_id: fields.auditId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          preflight_scope: fields.scope.value,
          execution_conditions: fields.conditions.value,
          readonly_rehearsal: fields.rehearsal.value,
          final_blockers: fields.blockers.value,
          rollback_plan: fields.rollback.value,
          monitoring_plan: fields.monitoring.value,
          human_approval_check: fields.human.value,
          execution_boundary: fields.boundary.value,
          production_boundary: fields.production.value,
          review_question: fields.review.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const holdPacket = parsePreflightJson(fields.holdPacket.value, {});
        const packet = promotionExecutionPreflight(config, holdPacket, buildPreflight());
        packetOutput.value = JSON.stringify(packet, null, 2);
        renderResult(packet);
        return packet;
      }

      root.querySelector("#runExecutionPreflight").addEventListener("click", run);
      root.querySelector("#loadPreflightSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveExecutionPreflight").addEventListener("click", () => {
        const packet = run();
        writeSaved([...readSaved(), packet]);
        renderSaved(config);
      });
      root.querySelector("#clearExecutionPreflights").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyPreflightPacket").addEventListener("click", async () => {
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

write("promotionexecutionpreflight.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Promotion Execution Preflight</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-promotion-execution-preflight.css">
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
            <span>Promotion execution preflight</span>
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

      <main class="workspace" aria-label="VedaPath Promotion Execution Preflight workspace">
        <aside class="panel">
          <span class="eyebrow">Execution stays closed</span>
          <h2>Rehearse readiness before authority</h2>
          <p class="muted">This room tests whether a future execution packet has enough evidence. It cannot execute, promote, store, migrate, use secrets, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Hold</strong><p>Load promotion hold.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Rehearse</strong><p>Plan only.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Blockers</strong><p>Stop unsafe paths.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Boundary</strong><p>Forbid writes.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="sourcepromotionholdreview.html">Open Promotion Hold</a>
            <a class="button safe" href="implementationauthorizationdryrun.html">Open Authorization</a>
          </div>
        </aside>

        <section class="panel preflight-app" id="promotionExecutionPreflight">
          <div class="preflight-head">
            <div>
              <span class="eyebrow">Execution preflight</span>
              <h1>Prepare the path. Keep execution closed.</h1>
              <p class="muted">A ready packet here means the final preflight review is coherent. It still cannot execute, promote, store, update canonical records, run migrations, create accounts, use secrets, or launch production.</p>
            </div>
            <div class="preflight-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath promotion execution preflight mark"></div>
          </div>

          <section class="preflight-layout">
            <div class="preflight-form">
              <h2>Execution Preflight Packet</h2>
              <label>Promotion hold packet<textarea id="preflightHoldPacket"></textarea></label>
              <label>Preflight state<select id="preflightState"></select></label>
              <label>Preflight actor<input id="preflightActor" type="text" placeholder="Execution preflight reviewer"></label>
              <label>Preflight note<textarea id="preflightNote"></textarea></label>
              <label>Promotion hold id<input id="preflightHoldId" type="text"></label>
              <label>Authorization dry-run id<input id="preflightAuthId" type="text"></label>
              <label>Founder gate id<input id="preflightGateId" type="text"></label>
              <label>Entry dry-run id<input id="preflightEntryId" type="text"></label>
              <label>Criteria packet id<input id="preflightCriteriaId" type="text"></label>
              <label>Replay receipt id<input id="preflightReplayId" type="text"></label>
              <label>Rollback receipt id<input id="preflightRollbackId" type="text"></label>
              <label>Audit receipt id<input id="preflightAuditId" type="text"></label>
              <label>Source answer id<input id="preflightSourceAnswer" type="text"></label>
              <label>Source record id<input id="preflightSourceRecord" type="text"></label>
              <label>Source family<input id="preflightSourceFamily" type="text"></label>
              <label>Preflight scope<textarea id="preflightScopeText"></textarea></label>
              <label>Execution conditions<textarea id="preflightExecutionConditions"></textarea></label>
              <label>Readonly rehearsal<textarea id="preflightReadonlyRehearsal"></textarea></label>
              <label>Final blockers<textarea id="preflightFinalBlockers"></textarea></label>
              <label>Rollback plan<textarea id="preflightRollbackPlan"></textarea></label>
              <label>Monitoring plan<textarea id="preflightMonitoringPlan"></textarea></label>
              <label>Human approval check<textarea id="preflightHumanApproval"></textarea></label>
              <label>Execution boundary<textarea id="preflightExecutionBoundary"></textarea></label>
              <label>Production boundary<textarea id="preflightProductionBoundary"></textarea></label>
              <label>Review question<textarea id="preflightReviewQuestion"></textarea></label>
              <label>Return reason<textarea id="preflightReturnReason"></textarea></label>
              <label>Hold reason<textarea id="preflightHoldReason"></textarea></label>
              <label>Block reason<textarea id="preflightBlockReason"></textarea></label>
              <div class="preflight-actions">
                <button class="button primary" id="runExecutionPreflight" type="button">Run Preflight</button>
                <button class="button safe" id="loadPreflightSample" type="button">Load Sample</button>
                <button class="button" id="saveExecutionPreflight" type="button">Save Local</button>
                <button class="button" id="clearExecutionPreflights" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="preflight-result" id="preflightResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Preflight Scope</h2>
                <div class="preflight-list" id="preflightScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Execution Preflight Checks</h2>
            <div class="preflight-rules" id="preflightChecks"></div>
          </section>

          <section class="preflight-layout">
            <div>
              <div class="preflight-actions">
                <button class="button safe" id="copyPreflightPacket" type="button">Copy Preflight Packet</button>
                <a class="button" href="data/vedapath-promotion-execution-preflight.json">Open JSON</a>
              </div>
              <textarea class="preflight-packet" id="preflightPacket" aria-label="Promotion execution preflight packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Preflights</h2>
              <div class="preflight-list" id="preflightSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Preflight is not execution</span>
          <h2 style="margin-top: 14px;">Execution Cannot Sneak In</h2>
          <p class="muted">This room prepares a future founder decision lane, but every real execution, write, storage, canonical, and production path remains closed.</p>
          <div class="progress" aria-label="Promotion execution preflight progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>7</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Founder gate</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Execution Boundary</h2>
            <p class="preflight-boundary">Preflight only. Execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares the founder execution instruction gate. It does not grant approval.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-promotion-execution-preflight.js"></script>
  </body>
</html>
`);

write("docs/PROMOTION_EXECUTION_PREFLIGHT.md", `# VedaPath AI Promotion Execution Preflight

Release: ${release}

This release dry-runs final execution readiness after source promotion hold review.

## Files

- data/vedapath-promotion-execution-preflight.json
- promotionexecutionpreflight.html
- assets/vedapath-promotion-execution-preflight.css
- assets/vedapath-promotion-execution-preflight.js

## What It Adds

The room:

- starts from a source promotion hold review ready packet
- prepares a future execution decision packet without granting execution
- checks preflight scope, execution conditions, readonly rehearsal, final blockers, rollback, monitoring, human approval, execution boundary, and production boundary
- keeps execution, source promotion, storage, canonical writes, migrations, accounts, secrets, public release, and production false
- exports a copyable promotion execution preflight packet

## Boundary

Promotion execution preflight is not execution approval. It does not promote source data, run storage writes, update canonical source records, run migrations, create accounts, use secrets, or launch production. The next release should define a founder execution instruction gate while every write and production flag remains false.
`);

const readmeBlock = `<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT START -->
## ${release} Promotion Execution Preflight

This release dry-runs final execution readiness after source promotion hold review while all execution, promotion, storage, canonical-write, migration, account, secret, and production flags stay false.

- [Promotion Execution Preflight](promotionexecutionpreflight.html)
- [Promotion Execution Preflight Notes](docs/PROMOTION_EXECUTION_PREFLIGHT.md)
- [Promotion Execution Preflight Data](data/vedapath-promotion-execution-preflight.json)

<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT END -->

`;

update("README.md", (content) => {
  if (content.includes("VEDAPATH PROMOTION EXECUTION PREFLIGHT START")) return content;
  return mustReplace(content, "<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW START -->", readmeBlock + "<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW START -->", "README insertion");
});

const notesBlock = `<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT NOTES START -->
## ${release} Promotion Execution Preflight

This phase dry-runs final execution readiness without enabling execution.

- Adds a promotion execution preflight room.
- Reads a source promotion hold review ready packet.
- Requires preflight scope, execution conditions, readonly rehearsal, final blockers, rollback plan, monitoring plan, human approval check, execution boundary, and production boundary.
- Keeps execution_preflight_passed, execution_authorized, execution_allowed, source_promotion_allowed, promotion_execution_allowed, implementation_execution_allowed, controlled_storage_entry_allowed, storage_write_enabled, canonical_write_allowed, source_write_executed, actual_storage_write_executed, production_ready, production_launch_allowed, and public_release_allowed false.

<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT NOTES END -->

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes("VEDAPATH PROMOTION EXECUTION PREFLIGHT NOTES START")) return content;
  return mustReplace(content, "<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW NOTES START -->", notesBlock + "<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW NOTES START -->", "prototype notes insertion");
});

const blueprintBlock = `<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT BLUEPRINT START -->
### 295. Promotion Execution Preflight

VedaPath should never let a reviewed promotion hold look like execution authority. The promotion execution preflight proves the final readiness checklist can be assembled while execution remains closed.

Core requirements:

- start from a source promotion hold review ready packet
- define the future execution packet scope without executing it
- rehearse readonly execution planning and failure paths only
- require rights, source-owner scope, reviewer evidence, rollback, monitoring, founder recheck, and source-specific human approval
- block all write flags, storage writes, canonical writes, migrations, accounts, secrets, public release, and production
- route next to a founder execution instruction gate

Promotion Execution Preflight should never claim execution approval, source promotion, production storage, migration execution, account creation, secret handling, launch approval, therapy, ritual instruction, crisis support, or spiritual authority.
<!-- VEDAPATH PROMOTION EXECUTION PREFLIGHT BLUEPRINT END -->

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("VEDAPATH PROMOTION EXECUTION PREFLIGHT BLUEPRINT START")) return content;
  return mustReplace(content, "<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW BLUEPRINT START -->", blueprintBlock + "<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW BLUEPRINT START -->", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/v3\.1\.1 promotion hold/g, badge);
  content = content.replace(
    "promotion execution preflight, execution readiness, and production memory.",
    "founder execution instruction, execution readiness, and production memory."
  );
  if (!content.includes('href="promotionexecutionpreflight.html"')) {
    content = mustReplace(content, '<a href="sourcepromotionholdreview.html">Promotion hold <span>review</span></a>', '<a href="sourcepromotionholdreview.html">Promotion hold <span>review</span></a>\n              <a href="promotionexecutionpreflight.html">Execution preflight <span>dry run</span></a>', "study map preflight link");
    content = mustReplace(content, '<a href="sourcepromotionholdreview.html">Promotion hold <span>source</span></a>', '<a href="sourcepromotionholdreview.html">Promotion hold <span>source</span></a>\n              <a href="promotionexecutionpreflight.html">Execution preflight <span>blocked</span></a>', "build map preflight link");
  }
  return content;
});

update("sourcepromotionholdreview.html", (content) => {
  content = content.replace(/v3\.1\.1 promotion hold/g, badge);
  if (!content.includes('href="promotionexecutionpreflight.html"')) {
    content = mustReplace(content, '<a class="button primary" href="implementationauthorizationdryrun.html">Open Authorization</a>', '<a class="button primary" href="implementationauthorizationdryrun.html">Open Authorization</a>\n            <a class="button" href="promotionexecutionpreflight.html">Open Preflight</a>', "promotion page preflight link");
  }
  content = content.replace("This release prepares the next preflight review. It does not open execution.", "This release feeds the promotion execution preflight. It does not open execution.");
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/v3\.1\.1 promotion hold/g, badge);
  content = content.replace("<strong>v3.1.1</strong>\n          <p>Source Promotion Hold Review: authorization dry-run packets now move into a review-only promotion hold while promotion, execution, storage, canonical writes, and production remain false.</p>", "<strong>v3.1.2</strong>\n          <p>Promotion Execution Preflight: promotion hold packets now dry-run final execution readiness while execution, promotion, storage, migrations, secrets, canonical writes, and production remain false.</p>");
  content = content.replace("<strong>93%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:93%\"></div></div>\n          <p>The trust loop now reviews promotion hold conditions before a source packet can approach any execution preflight.</p>", "<strong>94%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:94%\"></div></div>\n          <p>The trust loop now dry-runs final execution readiness while every real write path remains closed.</p>");
  content = content.replace("<span>Next release</span>\n          <strong>Promotion execution preflight</strong>\n          <p>Dry-run the final execution preflight while writes and production stay blocked.</p>", "<span>Next release</span>\n          <strong>Founder execution instruction gate</strong>\n          <p>Define explicit founder instruction required after preflight before any real write path.</p>");
  if (!content.includes("Phase 276: Promotion Execution Preflight")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 276: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 276: Promotion Execution Preflight</strong>
                <p>Dry-runs final execution readiness after source promotion hold review while execution, promotion, storage writes, migrations, secrets, canonical writes, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 277: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.1.1 Source Promotion Hold Review</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.1.2 Promotion Execution Preflight</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.1.0 Implementation Authorization Dry Run</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.1.1 Source Promotion Hold Review</strong></div>');
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Review source promotion hold conditions before any execution path.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Dry-run execution preflight without enabling execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for promotion execution preflight</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for founder execution instruction gate</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Dry-run promotion execution preflight.</span></li>\n              <li><span class="dot"></span><span>Keep source promotion and storage writes disabled.</span></li>\n              <li><span class="dot"></span><span>Confirm rollback, reviewer evidence, and founder recheck.</span></li>\n              <li><span class="dot"></span><span>Preserve production and canonical source blocks.</span></li>', '<li><span class="dot"></span><span>Define founder execution instruction requirements.</span></li>\n              <li><span class="dot"></span><span>Keep execution and production writes disabled.</span></li>\n              <li><span class="dot"></span><span>Confirm human approval is source-specific.</span></li>\n              <li><span class="dot"></span><span>Preserve rollback, monitoring, and source-owner evidence.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.1\.1 promotion hold<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} promotion execution preflight applied.`);

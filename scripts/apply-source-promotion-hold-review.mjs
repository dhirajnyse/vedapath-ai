import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.1.1";
const badge = "v3.1.1 promotion hold";
const previousRelease = "v3.1.0 Implementation Authorization Dry Run";

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

const authConfig = JSON.parse(read("data/vedapath-implementation-authorization-dry-run.json"));
const source = authConfig.source;
const sampleAuthorizationDryRun = {
  schema_version: authConfig.schema_version,
  release: authConfig.release,
  implementation_authorization_dry_run_id: "implementation-authorization-dry-run-sample-steady-action-bg-2-48",
  authorization_status: "Authorization dry run ready",
  implementation_authorization_dry_run_ready: true,
  implementation_authorized: false,
  implementation_execution_allowed: false,
  founder_instruction_granted: false,
  production_ready: false,
  controlled_storage_entry_allowed: false,
  canonical_write_allowed: false,
  storage_write_enabled: false,
  source_write_executed: false,
  actual_storage_write_executed: false,
  next_gate_required: "Source promotion hold review",
  founder_instruction_gate_id: authConfig.sample_authorization.founder_instruction_gate_id,
  entry_dry_run_id: authConfig.sample_authorization.entry_dry_run_id,
  criteria_packet_id: authConfig.sample_authorization.criteria_packet_id,
  replay_receipt_id: authConfig.sample_authorization.replay_receipt_id,
  rollback_receipt_id: authConfig.sample_authorization.rollback_receipt_id,
  audit_receipt_id: authConfig.sample_authorization.audit_receipt_id,
  source_answer_id: authConfig.sample_authorization.source_answer_id,
  source_record_id: authConfig.sample_authorization.source_record_id,
  source_family: authConfig.sample_authorization.source_family,
  authorization_actor: authConfig.sample_authorization.authorization_actor,
  authorization_note: authConfig.sample_authorization.authorization_note,
  implementation_scope: authConfig.sample_authorization.implementation_scope,
  operator_scope: authConfig.sample_authorization.operator_scope,
  allowed_actions: authConfig.sample_authorization.allowed_actions,
  forbidden_actions: authConfig.sample_authorization.forbidden_actions,
  runtime_boundary: authConfig.sample_authorization.runtime_boundary,
  rollback_required: authConfig.sample_authorization.rollback_required,
  monitoring_required: authConfig.sample_authorization.monitoring_required,
  founder_recheck: authConfig.sample_authorization.founder_recheck,
  execution_hold: authConfig.sample_authorization.execution_hold,
  created_at: "2026-06-27T00:00:00.000Z"
};

const config = {
  schema_version: "source-promotion-hold-review-v1",
  release,
  generated_at: "2026-06-27T00:00:00.000Z",
  title: "Source Promotion Hold Review",
  summary: "Reviews promotion hold conditions after implementation authorization dry run while keeping source promotion, promotion execution, storage writes, canonical writes, and production launch disabled.",
  previous_release: previousRelease,
  source: {
    implementation_authorization_release: authConfig.release,
    implementation_authorization_schema: authConfig.schema_version,
    implementation_authorization_dry_run_id: sampleAuthorizationDryRun.implementation_authorization_dry_run_id,
    source_answer_id: source.source_answer_id,
    source_record_id: source.source_record_id,
    source_family: source.source_family,
    entry_dry_run_id: source.entry_dry_run_id,
    criteria_packet_id: source.criteria_packet_id,
    entry_schema_route: source.entry_schema_route
  },
  promotion_states: [
    "Draft promotion hold",
    "Needs source promotion review",
    "Promotion hold review ready",
    "Return to authorization dry run",
    "Promotion hold",
    "Promotion blocked",
    "Execution path forbidden"
  ],
  required_by_state: {
    "Draft promotion hold": ["implementation_authorization_dry_run_id", "source_answer_id", "promotion_scope"],
    "Needs source promotion review": ["review_question", "promotion_scope", "hold_conditions"],
    "Promotion hold review ready": [
      "hold_conditions",
      "source_integrity_check",
      "rights_and_translation_check",
      "reviewer_evidence_required",
      "promotion_boundary",
      "rollback_reference",
      "founder_recheck"
    ],
    "Return to authorization dry run": ["return_reason"],
    "Promotion hold": ["hold_reason"],
    "Promotion blocked": ["block_reason"],
    "Execution path forbidden": ["block_reason", "promotion_boundary"]
  },
  promotion_checks: [
    {
      check: "Authorization dry run ready",
      rule: "Promotion hold review can only start from an implementation authorization dry-run packet whose next gate is source promotion hold review."
    },
    {
      check: "Promotion scope",
      rule: "Scope must name one source-answer packet, keep it on hold, and explicitly avoid execution, storage, production, and canonical updates."
    },
    {
      check: "Source integrity",
      rule: "Source answer, source record, source family, citation route, and no-content-mutation boundary must remain visible."
    },
    {
      check: "Rights and translation",
      rule: "Missing public rights or translation review keeps the packet on hold."
    },
    {
      check: "Reviewer evidence",
      rule: "Implementation authorization, founder gate, receipt chain, rollback reference, reviewer evidence, and source-owner scope must be present."
    },
    {
      check: "Promotion boundary",
      rule: "Promotion hold review never enables source promotion, promotion execution, implementation execution, storage, canonical writes, or production."
    }
  ],
  sample_authorization_dry_run: sampleAuthorizationDryRun,
  sample_hold: {
    promotion_state: "Promotion hold review ready",
    promotion_actor: "Source promotion reviewer",
    promotion_note: "Review promotion hold conditions after implementation authorization dry run; do not promote or execute.",
    implementation_authorization_dry_run_id: sampleAuthorizationDryRun.implementation_authorization_dry_run_id,
    founder_instruction_gate_id: sampleAuthorizationDryRun.founder_instruction_gate_id,
    entry_dry_run_id: sampleAuthorizationDryRun.entry_dry_run_id,
    criteria_packet_id: sampleAuthorizationDryRun.criteria_packet_id,
    replay_receipt_id: sampleAuthorizationDryRun.replay_receipt_id,
    rollback_receipt_id: sampleAuthorizationDryRun.rollback_receipt_id,
    audit_receipt_id: sampleAuthorizationDryRun.audit_receipt_id,
    source_answer_id: sampleAuthorizationDryRun.source_answer_id,
    source_record_id: sampleAuthorizationDryRun.source_record_id,
    source_family: sampleAuthorizationDryRun.source_family,
    promotion_scope: "Review whether the named source-answer packet can remain on the promotion hold lane; do not promote to execution, storage, production, or canonical source update.",
    hold_conditions: "Hold until source text, source family, citation, reviewer evidence, rights and translation status, rollback reference, and founder recheck are all present.",
    source_integrity_check: "Source answer id, source record id, source family, citation, and source text route must match the reviewed packet; no content mutation is allowed.",
    rights_and_translation_check: "Rights and translation status must be reviewed before any public or stored source text promotion; missing rights keeps the packet on hold.",
    reviewer_evidence_required: "Implementation authorization dry run ready, founder gate ready, receipt chain present, rollback reference present, reviewer evidence present, and source-owner scope present.",
    promotion_boundary: "Promotion hold only; source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, and production_ready remains false.",
    rollback_reference: "Rollback receipt and replay receipt remain the rollback reference; no new source state is written and the source packet is not written in this review.",
    founder_recheck: "Founder gate and implementation authorization dry run must be rechecked before any future promotion execution packet.",
    next_gate: "Promotion execution preflight",
    review_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
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
    next_gate_required: "Promotion execution preflight"
  }
};

write("data/vedapath-source-promotion-hold-review.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-source-promotion-hold-review.css", `/* VedaPath source promotion hold review */
.promotion-app,
.promotion-head,
.promotion-layout,
.promotion-form,
.promotion-grid,
.promotion-list,
.promotion-actions,
.promotion-rules {
  display: grid;
  gap: 10px;
}

.promotion-app { gap: 16px; }

.promotion-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.promotion-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.promotion-mark img {
  display: block;
  width: 100%;
}

.promotion-layout {
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  align-items: start;
}

.promotion-form,
.promotion-card,
.promotion-result,
.promotion-packet,
.promotion-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.promotion-form,
.promotion-card,
.promotion-result,
.promotion-rule {
  padding: 12px;
}

.promotion-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.promotion-form input,
.promotion-form select,
.promotion-form textarea,
.promotion-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.promotion-form textarea,
.promotion-packet {
  min-height: 104px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.promotion-grid,
.promotion-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.promotion-card,
.promotion-result {
  border-left: 4px solid var(--gold);
}

.promotion-card.ready,
.promotion-result[data-state="Promotion hold review ready"] {
  border-left-color: var(--green);
}

.promotion-card.blocked,
.promotion-result[data-state="Blocked"],
.promotion-result[data-state="Return to authorization dry run"],
.promotion-result[data-state="Promotion hold"],
.promotion-result[data-state="Promotion blocked"],
.promotion-result[data-state="Execution path forbidden"] {
  border-left-color: var(--ochre);
}

.promotion-card span,
.promotion-card strong,
.promotion-rule span,
.promotion-rule strong {
  display: block;
}

.promotion-card span,
.promotion-rule span {
  color: var(--muted);
  font-size: 12px;
}

.promotion-result strong {
  display: block;
  font-size: 24px;
}

.promotion-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.promotion-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.promotion-list {
  max-height: 320px;
  overflow: auto;
}

.promotion-packet {
  min-height: 260px;
}

.promotion-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  .promotion-layout,
  .promotion-head,
  .promotion-grid,
  .promotion-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .promotion-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-source-promotion-hold-review.js", `(() => {
  const storageKey = "vedapath-source-promotion-hold-review";
  const root = document.getElementById("sourcePromotionHoldReview");
  const savedRoot = document.getElementById("promotionSaved");
  const resultCard = document.getElementById("promotionResultCard");
  const packetOutput = document.getElementById("promotionPacket");
  const checksRoot = document.getElementById("promotionChecks");
  const scopeRoot = document.getElementById("promotionScope");

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

  function authorizationDryRunReady(packet) {
    return Boolean(packet) &&
      packet.authorization_status === "Authorization dry run ready" &&
      packet.implementation_authorization_dry_run_ready === true &&
      packet.implementation_authorized === false &&
      packet.implementation_execution_allowed === false &&
      packet.founder_instruction_granted === false &&
      packet.production_ready === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.canonical_write_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.next_gate_required === "Source promotion hold review";
  }

  function keepsPromotionBoundary(value) {
    const text = String(value || "");
    const required = [
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
    const unsafe = /(source_promotion_allowed true|promotion_execution_allowed true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|promote now|write enabled|production write|canonical update)/i.test(text);
    return required && !unsafe;
  }

  function promotionMissingForState(config, state, promotion = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(promotion[field] || "").trim());
  }

  function idMatches(promotion, authorizationPacket, key) {
    return !promotion[key] || !authorizationPacket[key] || promotion[key] === authorizationPacket[key];
  }

  function sourcePromotionHoldReview(config, authorizationPacket, promotion) {
    const state = promotion.promotion_state || "Draft promotion hold";
    const missing = promotionMissingForState(config, state, promotion);
    const blocked = [];
    const warnings = [];

    if (!authorizationDryRunReady(authorizationPacket)) blocked.push("implementation authorization dry-run packet must be ready while every execution and write flag remains false");
    ["implementation_authorization_dry_run_id", "founder_instruction_gate_id", "entry_dry_run_id", "criteria_packet_id", "replay_receipt_id", "rollback_receipt_id", "audit_receipt_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(promotion, authorizationPacket, key)) blocked.push(key + " must match the authorization dry-run packet");
    });

    const readyCandidate = state === "Promotion hold review ready";
    if (readyCandidate && !hasText(promotion.promotion_scope, [["named", "source-answer"], ["hold"], ["do not", "promote"], ["execution"], ["storage"], ["production"], ["canonical"]])) {
      blocked.push("promotion scope must name the source-answer packet, keep it on hold, and block execution, storage, production, and canonical updates");
    }
    if (readyCandidate && !hasText(promotion.hold_conditions, [["source text"], ["source family"], ["citation"], ["reviewer evidence"], ["rights"], ["translation"], ["rollback"], ["founder"]])) {
      blocked.push("hold conditions must include source text, source family, citation, reviewer evidence, rights, translation, rollback, and founder recheck");
    }
    if (readyCandidate && !hasText(promotion.source_integrity_check, [["source answer"], ["source record"], ["source family"], ["citation"], ["no content mutation"]])) {
      blocked.push("source integrity must include source answer, source record, source family, citation, and no content mutation");
    }
    if (readyCandidate && !hasText(promotion.rights_and_translation_check, [["rights"], ["translation"], ["reviewed"], ["missing"], ["hold"]])) {
      blocked.push("rights and translation check must keep missing review on hold");
    }
    if (readyCandidate && !hasText(promotion.reviewer_evidence_required, [["implementation authorization"], ["founder gate"], ["receipt chain"], ["rollback"], ["reviewer evidence"], ["source-owner"]])) {
      blocked.push("reviewer evidence must include implementation authorization, founder gate, receipt chain, rollback, reviewer evidence, and source-owner scope");
    }
    if (readyCandidate && !keepsPromotionBoundary(promotion.promotion_boundary)) {
      blocked.push("promotion boundary must keep promotion, execution, storage, source-write, canonical, and production flags false");
    }
    if (readyCandidate && !hasText(promotion.rollback_reference, [["rollback receipt"], ["replay receipt"], ["no new source state"], ["not written"]])) {
      blocked.push("rollback reference must keep rollback and replay receipts visible while no new source state is written");
    }
    if (readyCandidate && !hasText(promotion.founder_recheck, [["founder"], ["implementation authorization"], ["rechecked"], ["before"], ["promotion execution"]])) {
      blocked.push("founder and implementation authorization must be rechecked before promotion execution");
    }
    if (state === "Needs source promotion review" && !promotion.review_question) blocked.push("review question is required");
    if (state === "Return to authorization dry run" && !promotion.return_reason) blocked.push("return reason is required");
    if (state === "Promotion hold" && !promotion.hold_reason) blocked.push("hold reason is required");
    if (state === "Promotion blocked" && !promotion.block_reason) blocked.push("block reason is required");
    if (state === "Execution path forbidden" && !promotion.block_reason) blocked.push("block reason is required when execution path is forbidden");

    if (authorizationPacket.implementation_execution_allowed !== false) warnings.push("authorization dry run must never be interpreted as implementation execution");

    const promotion_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      source_promotion_hold_review_id: "source-promotion-hold-review-" + Date.now(),
      promotion_status,
      source_promotion_hold_review_ready: promotion_status === "Promotion hold review ready",
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
      next_gate_required: config.boundary.next_gate_required,
      implementation_authorization_dry_run_id: promotion.implementation_authorization_dry_run_id || authorizationPacket.implementation_authorization_dry_run_id || "",
      founder_instruction_gate_id: promotion.founder_instruction_gate_id || authorizationPacket.founder_instruction_gate_id || "",
      entry_dry_run_id: promotion.entry_dry_run_id || authorizationPacket.entry_dry_run_id || "",
      criteria_packet_id: promotion.criteria_packet_id || authorizationPacket.criteria_packet_id || "",
      replay_receipt_id: promotion.replay_receipt_id || authorizationPacket.replay_receipt_id || "",
      rollback_receipt_id: promotion.rollback_receipt_id || authorizationPacket.rollback_receipt_id || "",
      audit_receipt_id: promotion.audit_receipt_id || authorizationPacket.audit_receipt_id || "",
      source_answer_id: promotion.source_answer_id || authorizationPacket.source_answer_id || "",
      source_record_id: promotion.source_record_id || authorizationPacket.source_record_id || "",
      source_family: promotion.source_family || authorizationPacket.source_family || "",
      promotion_actor: promotion.promotion_actor || "",
      promotion_note: promotion.promotion_note || "",
      promotion_scope: promotion.promotion_scope || "",
      hold_conditions: promotion.hold_conditions || "",
      source_integrity_check: promotion.source_integrity_check || "",
      rights_and_translation_check: promotion.rights_and_translation_check || "",
      reviewer_evidence_required: promotion.reviewer_evidence_required || "",
      promotion_boundary: promotion.promotion_boundary || "",
      rollback_reference: promotion.rollback_reference || "",
      founder_recheck: promotion.founder_recheck || "",
      review_question: promotion.review_question || "",
      return_reason: promotion.return_reason || "",
      hold_reason: promotion.hold_reason || "",
      block_reason: promotion.block_reason || "",
      missing,
      blocked,
      warnings,
      created_at: new Date().toISOString()
    };
  }

  function promotionSnapshot(packets, config) {
    const byStatus = packets.reduce((counts, packet) => {
      const key = packet.promotion_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_packets: packets.length,
      ready: byStatus["Promotion hold review ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Promotion hold"] || 0,
      promotion_enabled: packets.filter((packet) => packet.source_promotion_allowed || packet.promotion_execution_allowed || packet.storage_write_enabled || packet.source_write_executed).length
    };
  }

  function parsePromotionJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="promotion-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(packet) {
    if (!resultCard) return;
    const issues = [...(packet.missing || []), ...(packet.blocked || [])];
    resultCard.dataset.state = packet.promotion_status;
    resultCard.innerHTML = '<strong>' + safe(packet.promotion_status) + '</strong>' +
      '<p class="muted">Hold review ready: ' + safe(packet.source_promotion_hold_review_ready) + ' | Promotion: ' + safe(packet.source_promotion_allowed) + ' | Execution: ' + safe(packet.promotion_execution_allowed) + '</p>' +
      '<div class="promotion-grid">' +
        card("Authorization", packet.implementation_authorization_dry_run_id, packet.source_promotion_hold_review_ready ? "ready" : "") +
        card("Source answer", packet.source_answer_id) +
        card("Next gate", packet.next_gate_required) +
        card("Promotion", packet.source_promotion_allowed ? "enabled" : "false", packet.source_promotion_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for promotion execution preflight review. No source promotion, storage write, or production execution was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.promotion_checks.map((check) =>
      '<article class="promotion-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Authorization", config.source.implementation_authorization_dry_run_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parsePromotionJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(packets) {
    localStorage.setItem(storageKey, JSON.stringify(packets.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const packets = readSaved();
    const snapshot = promotionSnapshot(packets, config);
    savedRoot.innerHTML = card("Saved packets", snapshot.saved_packets) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Promotion enabled", snapshot.promotion_enabled, snapshot.promotion_enabled ? "blocked" : "ready") +
      packets.slice(-4).reverse().map((packet) =>
        '<article class="promotion-card ' + (packet.source_promotion_hold_review_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(packet.created_at) + '</span>' +
        '<strong>' + safe(packet.promotion_status) + '</strong>' +
        '<span>' + safe(packet.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathSourcePromotionHoldReview = {
    sourcePromotionHoldReview,
    promotionSnapshot,
    promotionMissingForState,
    parsePromotionJson
  };

  if (!root) return;

  fetch("data/vedapath-source-promotion-hold-review.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        authorizationPacket: root.querySelector("#promotionAuthorizationPacket"),
        state: root.querySelector("#promotionState"),
        actor: root.querySelector("#promotionActor"),
        note: root.querySelector("#promotionNote"),
        authId: root.querySelector("#promotionAuthId"),
        gateId: root.querySelector("#promotionGateId"),
        entryId: root.querySelector("#promotionEntryId"),
        criteriaId: root.querySelector("#promotionCriteriaId"),
        replayId: root.querySelector("#promotionReplayId"),
        rollbackId: root.querySelector("#promotionRollbackId"),
        auditId: root.querySelector("#promotionAuditId"),
        sourceAnswer: root.querySelector("#promotionSourceAnswer"),
        sourceRecord: root.querySelector("#promotionSourceRecord"),
        sourceFamily: root.querySelector("#promotionSourceFamily"),
        scope: root.querySelector("#promotionScopeText"),
        hold: root.querySelector("#promotionHoldConditions"),
        integrity: root.querySelector("#promotionSourceIntegrity"),
        rights: root.querySelector("#promotionRightsTranslation"),
        evidence: root.querySelector("#promotionReviewerEvidence"),
        boundary: root.querySelector("#promotionBoundary"),
        rollback: root.querySelector("#promotionRollbackReference"),
        recheck: root.querySelector("#promotionFounderRecheck"),
        review: root.querySelector("#promotionReviewQuestion"),
        returnReason: root.querySelector("#promotionReturnReason"),
        holdReason: root.querySelector("#promotionHoldReason"),
        block: root.querySelector("#promotionBlockReason")
      };

      config.promotion_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_hold;
        fields.authorizationPacket.value = JSON.stringify(config.sample_authorization_dry_run, null, 2);
        fields.state.value = item.promotion_state;
        fields.actor.value = item.promotion_actor;
        fields.note.value = item.promotion_note;
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
        fields.scope.value = item.promotion_scope;
        fields.hold.value = item.hold_conditions;
        fields.integrity.value = item.source_integrity_check;
        fields.rights.value = item.rights_and_translation_check;
        fields.evidence.value = item.reviewer_evidence_required;
        fields.boundary.value = item.promotion_boundary;
        fields.rollback.value = item.rollback_reference;
        fields.recheck.value = item.founder_recheck;
        fields.review.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildPromotion() {
        return {
          promotion_state: fields.state.value,
          promotion_actor: fields.actor.value,
          promotion_note: fields.note.value,
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
          promotion_scope: fields.scope.value,
          hold_conditions: fields.hold.value,
          source_integrity_check: fields.integrity.value,
          rights_and_translation_check: fields.rights.value,
          reviewer_evidence_required: fields.evidence.value,
          promotion_boundary: fields.boundary.value,
          rollback_reference: fields.rollback.value,
          founder_recheck: fields.recheck.value,
          review_question: fields.review.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const authorizationPacket = parsePromotionJson(fields.authorizationPacket.value, {});
        const packet = sourcePromotionHoldReview(config, authorizationPacket, buildPromotion());
        packetOutput.value = JSON.stringify(packet, null, 2);
        renderResult(packet);
        return packet;
      }

      root.querySelector("#runPromotionHold").addEventListener("click", run);
      root.querySelector("#loadPromotionSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#savePromotionHold").addEventListener("click", () => {
        const packet = run();
        writeSaved([...readSaved(), packet]);
        renderSaved(config);
      });
      root.querySelector("#clearPromotionHolds").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyPromotionPacket").addEventListener("click", async () => {
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

write("sourcepromotionholdreview.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Source Promotion Hold Review</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-source-promotion-hold-review.css">
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
            <span>Source promotion hold review</span>
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

      <main class="workspace" aria-label="VedaPath Source Promotion Hold Review workspace">
        <aside class="panel">
          <span class="eyebrow">Promotion stays closed</span>
          <h2>Review the hold before the next step</h2>
          <p class="muted">This room keeps a source-answer packet on a promotion hold lane after authorization dry run. It cannot promote, store, or execute.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Authorization</strong><p>Load dry run.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Evidence</strong><p>Check receipts.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Rights</strong><p>Keep missing review on hold.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Boundary</strong><p>Block execution.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="implementationauthorizationdryrun.html">Open Authorization</a>
            <a class="button safe" href="founderstorageinstructiongate.html">Open Founder Gate</a>
          </div>
        </aside>

        <section class="panel promotion-app" id="sourcePromotionHoldReview">
          <div class="promotion-head">
            <div>
              <span class="eyebrow">Promotion hold review</span>
              <h1>Hold promotion. Protect the source.</h1>
              <p class="muted">A ready packet here means promotion hold conditions are reviewed. It still cannot promote source data, execute implementation, write storage, update canonical records, or launch production.</p>
            </div>
            <div class="promotion-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath source promotion hold mark"></div>
          </div>

          <section class="promotion-layout">
            <div class="promotion-form">
              <h2>Promotion Hold Packet</h2>
              <label>Authorization dry-run packet<textarea id="promotionAuthorizationPacket"></textarea></label>
              <label>Promotion state<select id="promotionState"></select></label>
              <label>Promotion actor<input id="promotionActor" type="text" placeholder="Source promotion reviewer"></label>
              <label>Promotion note<textarea id="promotionNote"></textarea></label>
              <label>Authorization dry-run id<input id="promotionAuthId" type="text"></label>
              <label>Founder gate id<input id="promotionGateId" type="text"></label>
              <label>Entry dry-run id<input id="promotionEntryId" type="text"></label>
              <label>Criteria packet id<input id="promotionCriteriaId" type="text"></label>
              <label>Replay receipt id<input id="promotionReplayId" type="text"></label>
              <label>Rollback receipt id<input id="promotionRollbackId" type="text"></label>
              <label>Audit receipt id<input id="promotionAuditId" type="text"></label>
              <label>Source answer id<input id="promotionSourceAnswer" type="text"></label>
              <label>Source record id<input id="promotionSourceRecord" type="text"></label>
              <label>Source family<input id="promotionSourceFamily" type="text"></label>
              <label>Promotion scope<textarea id="promotionScopeText"></textarea></label>
              <label>Hold conditions<textarea id="promotionHoldConditions"></textarea></label>
              <label>Source integrity check<textarea id="promotionSourceIntegrity"></textarea></label>
              <label>Rights and translation check<textarea id="promotionRightsTranslation"></textarea></label>
              <label>Reviewer evidence required<textarea id="promotionReviewerEvidence"></textarea></label>
              <label>Promotion boundary<textarea id="promotionBoundary"></textarea></label>
              <label>Rollback reference<textarea id="promotionRollbackReference"></textarea></label>
              <label>Founder recheck<textarea id="promotionFounderRecheck"></textarea></label>
              <label>Review question<textarea id="promotionReviewQuestion"></textarea></label>
              <label>Return reason<textarea id="promotionReturnReason"></textarea></label>
              <label>Hold reason<textarea id="promotionHoldReason"></textarea></label>
              <label>Block reason<textarea id="promotionBlockReason"></textarea></label>
              <div class="promotion-actions">
                <button class="button primary" id="runPromotionHold" type="button">Run Hold Review</button>
                <button class="button safe" id="loadPromotionSample" type="button">Load Sample</button>
                <button class="button" id="savePromotionHold" type="button">Save Local</button>
                <button class="button" id="clearPromotionHolds" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="promotion-result" id="promotionResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Promotion Scope</h2>
                <div class="promotion-list" id="promotionScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Promotion Hold Checks</h2>
            <div class="promotion-rules" id="promotionChecks"></div>
          </section>

          <section class="promotion-layout">
            <div>
              <div class="promotion-actions">
                <button class="button safe" id="copyPromotionPacket" type="button">Copy Hold Packet</button>
                <a class="button" href="data/vedapath-source-promotion-hold-review.json">Open JSON</a>
              </div>
              <textarea class="promotion-packet" id="promotionPacket" aria-label="Source promotion hold review packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Holds</h2>
              <div class="promotion-list" id="promotionSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Hold is not promotion</span>
          <h2 style="margin-top: 14px;">No Promotion Can Sneak In</h2>
          <p class="muted">The source packet can be reviewed for a future preflight, but it cannot promote, execute, store, update canonical records, or launch production.</p>
          <div class="progress" aria-label="Source promotion hold review progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>7</strong></div>
            <div class="metric"><span>Promotion</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Preflight</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Promotion Boundary</h2>
            <p class="promotion-boundary">Promotion hold only. Source promotion, promotion execution, storage writes, canonical writes, source writes, and production launch remain false.</p>
            <p class="muted">This release prepares the next preflight review. It does not open execution.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-source-promotion-hold-review.js"></script>
  </body>
</html>
`);

write("docs/SOURCE_PROMOTION_HOLD_REVIEW.md", `# VedaPath AI Source Promotion Hold Review

Release: ${release}

This release reviews source-promotion hold conditions after the implementation authorization dry run.

## Files

- data/vedapath-source-promotion-hold-review.json
- sourcepromotionholdreview.html
- assets/vedapath-source-promotion-hold-review.css
- assets/vedapath-source-promotion-hold-review.js

## What It Adds

The room:

- starts from an implementation authorization dry-run ready packet
- keeps the source-answer packet on a promotion hold lane
- checks promotion scope, source integrity, rights, translation, reviewer evidence, rollback, and founder recheck
- keeps source promotion, promotion execution, implementation execution, storage, canonical writes, source writes, and production false
- exports a copyable source promotion hold review packet

## Boundary

Source promotion hold review is not source promotion, execution approval, storage approval, canonical source update, or production launch. The next release should dry-run promotion execution preflight while every write and production flag remains false.
`);

const readmeBlock = `<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW START -->
## ${release} Source Promotion Hold Review

This release reviews promotion hold conditions after implementation authorization dry run while all promotion, execution, storage, canonical-write, and production flags stay false.

- [Source Promotion Hold Review](sourcepromotionholdreview.html)
- [Source Promotion Hold Review Notes](docs/SOURCE_PROMOTION_HOLD_REVIEW.md)
- [Source Promotion Hold Review Data](data/vedapath-source-promotion-hold-review.json)

<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW END -->

`;

update("README.md", (content) => {
  if (content.includes("VEDAPATH SOURCE PROMOTION HOLD REVIEW START")) return content;
  return mustReplace(content, "<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN START -->", readmeBlock + "<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN START -->", "README insertion");
});

const notesBlock = `<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW NOTES START -->
## ${release} Source Promotion Hold Review

This phase reviews promotion hold conditions before any source packet can approach an execution preflight.

- Adds a source promotion hold review room.
- Reads an implementation authorization dry-run ready packet.
- Requires promotion scope, hold conditions, source integrity, rights, translation, reviewer evidence, rollback reference, and founder recheck.
- Keeps source_promotion_allowed, promotion_execution_allowed, implementation_authorized, implementation_execution_allowed, founder_instruction_granted, controlled_storage_entry_allowed, storage_write_enabled, canonical_write_allowed, source_write_executed, actual_storage_write_executed, and production_ready false.

<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW NOTES END -->

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes("VEDAPATH SOURCE PROMOTION HOLD REVIEW NOTES START")) return content;
  return mustReplace(content, "<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN NOTES START -->", notesBlock + "<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN NOTES START -->", "prototype notes insertion");
});

const blueprintBlock = `<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW BLUEPRINT START -->
### 294. Source Promotion Hold Review

VedaPath should treat a ready implementation dry run as a review condition, not permission to promote. The source promotion hold review keeps the named source-answer packet on hold until source integrity, rights, translation, reviewer evidence, rollback, and founder recheck are visible.

Core requirements:

- start from an implementation authorization dry-run ready packet
- keep the source-answer packet on a promotion hold lane
- verify source answer, source record, source family, citation route, and no-content-mutation boundary
- require rights and translation review before any public or stored source text promotion
- require reviewer evidence, receipt chain, rollback reference, source-owner scope, and founder recheck
- keep promotion, execution, storage writes, canonical writes, source writes, and production false

Source Promotion Hold Review should never claim source promotion, execution approval, canonical source update, production storage, migration execution, account creation, secret handling, launch approval, therapy, ritual instruction, crisis support, or spiritual authority.
<!-- VEDAPATH SOURCE PROMOTION HOLD REVIEW BLUEPRINT END -->

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("VEDAPATH SOURCE PROMOTION HOLD REVIEW BLUEPRINT START")) return content;
  return mustReplace(content, "<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN BLUEPRINT START -->", blueprintBlock + "<!-- VEDAPATH IMPLEMENTATION AUTHORIZATION DRY RUN BLUEPRINT START -->", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/v3\.1\.0 auth dry run/g, badge);
  content = content.replace(
    "source promotion hold review, execution readiness, and production memory.",
    "promotion execution preflight, execution readiness, and production memory."
  );
  if (!content.includes('href="sourcepromotionholdreview.html"')) {
    content = mustReplace(content, '<a href="implementationauthorizationdryrun.html">Authorization <span>dry run</span></a>', '<a href="implementationauthorizationdryrun.html">Authorization <span>dry run</span></a>\n              <a href="sourcepromotionholdreview.html">Promotion hold <span>review</span></a>', "study map promotion link");
    content = mustReplace(content, '<a href="implementationauthorizationdryrun.html">Authorization <span>execution hold</span></a>', '<a href="implementationauthorizationdryrun.html">Authorization <span>execution hold</span></a>\n              <a href="sourcepromotionholdreview.html">Promotion hold <span>source</span></a>', "build map promotion link");
  }
  return content;
});

update("implementationauthorizationdryrun.html", (content) => {
  content = content.replace(/v3\.1\.0 auth dry run/g, badge);
  if (!content.includes('href="sourcepromotionholdreview.html"')) {
    content = mustReplace(content, '<a class="button safe" href="controlledstorageentrydryrun.html">Open Entry Dry Run</a>', '<a class="button safe" href="controlledstorageentrydryrun.html">Open Entry Dry Run</a>\n            <a class="button" href="sourcepromotionholdreview.html">Open Promotion Hold</a>', "implementation page promotion link");
  }
  content = content.replace("This release prepares the next review lane. It does not open the lane.", "This release feeds the source promotion hold review. It does not open execution.");
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/v3\.1\.0 auth dry run/g, badge);
  content = content.replace("<strong>v3.1.0</strong>\n          <p>Implementation Authorization Dry Run: founder gate packets now become review-only implementation packets while execution, storage, migration, account, and canonical writes remain false.</p>", "<strong>v3.1.1</strong>\n          <p>Source Promotion Hold Review: authorization dry-run packets now move into a review-only promotion hold while promotion, execution, storage, canonical writes, and production remain false.</p>");
  content = content.replace("<strong>92%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:92%\"></div></div>\n          <p>The trust loop now dry-runs implementation authorization while execution remains forbidden.</p>", "<strong>93%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:93%\"></div></div>\n          <p>The trust loop now reviews promotion hold conditions before a source packet can approach any execution preflight.</p>");
  content = content.replace("<span>Next release</span>\n          <strong>Source promotion hold review</strong>\n          <p>Review promotion hold conditions before any source packet can approach an execution path.</p>", "<span>Next release</span>\n          <strong>Promotion execution preflight</strong>\n          <p>Dry-run the final execution preflight while writes and production stay blocked.</p>");
  if (!content.includes("Phase 275: Source Promotion Hold Review")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 275: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 275: Source Promotion Hold Review</strong>
                <p>Reviews promotion hold conditions after implementation authorization dry run while source promotion, execution, storage writes, canonical writes, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 276: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.1.0 Implementation Authorization Dry Run</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.1.1 Source Promotion Hold Review</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.0.9 Founder Storage Instruction Gate</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.1.0 Implementation Authorization Dry Run</strong></div>');
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Dry-run implementation authorization without enabling execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Review source promotion hold conditions before any execution path.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for source promotion hold review</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for promotion execution preflight</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Define source promotion hold conditions.</span></li>\n              <li><span class="dot"></span><span>Separate review-ready packets from execution-ready packets.</span></li>\n              <li><span class="dot"></span><span>Keep execution paths blocked until final approval.</span></li>\n              <li><span class="dot"></span><span>Preserve rollback, monitoring, and founder recheck evidence.</span></li>', '<li><span class="dot"></span><span>Dry-run promotion execution preflight.</span></li>\n              <li><span class="dot"></span><span>Keep source promotion and storage writes disabled.</span></li>\n              <li><span class="dot"></span><span>Confirm rollback, reviewer evidence, and founder recheck.</span></li>\n              <li><span class="dot"></span><span>Preserve production and canonical source blocks.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.1\.0 auth dry run<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} source promotion hold review applied.`);

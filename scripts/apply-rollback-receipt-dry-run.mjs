import fs from "node:fs";
import path from "node:path";

const release = "v3.0.5";
const badge = `${release} rollback receipt`;

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.writeFileSync(file, content, "utf8");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function upsertBlock(content, start, end, block, before) {
  const wrapped = `${start}\n${block.trimEnd()}\n${end}`;
  if (content.includes(start)) {
    return content.replace(new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`), wrapped);
  }
  const index = content.indexOf(before);
  if (index === -1) return `${content.trimEnd()}\n\n${wrapped}\n`;
  return `${content.slice(0, index)}${wrapped}\n\n${content.slice(index)}`;
}

function updateVersionBadge(content) {
  return content.replace(/<span class="version">[^<]*<\/span>/g, `<span class="version">${badge}</span>`);
}

function updateAllHtmlShells() {
  for (const file of fs.readdirSync(".")) {
    if (!file.endsWith(".html")) continue;
    write(file, updateVersionBadge(read(file)));
  }
  const brandFile = path.join("brand", "brand-board.html");
  if (fs.existsSync(brandFile)) {
    write(brandFile, updateVersionBadge(read(brandFile)));
  }
}

function auditReceiptData() {
  return JSON.parse(read("data/vedapath-audit-receipt-dry-run.json"));
}

function sampleAuditReceipt(config) {
  const receipt = config.sample_receipt || {};
  const design = config.sample_storage_design || {};
  return {
    schema_version: config.schema_version,
    release: config.release,
    audit_receipt_id: "audit-receipt-sample-rollback",
    audit_status: "Audit receipt ready",
    production_ready: false,
    canonical_write_allowed: false,
    storage_write_enabled: false,
    source_write_executed: false,
    immutable_receipt_ready: true,
    rollback_receipt_required: true,
    storage_design_id: design.storage_design_id || "",
    release_review_id: design.release_review_id || "",
    dry_run_audit_id: design.dry_run_audit_id || "",
    implementation_task_id: design.implementation_task_id || "",
    source_answer_id: receipt.source_answer_id || design.source_answer_id || "",
    source_record_id: receipt.source_record_id || design.source_record_id || "",
    source_family: design.source_family || "Bhagavad Gita | Smriti",
    owner_decision_id: design.owner_decision_id || "",
    audit_state: receipt.audit_state || "Audit receipt ready",
    receipt_actor: receipt.receipt_actor || "Audit dry-run reviewer",
    receipt_note: receipt.receipt_note || "Dry-run an immutable receipt for a future non-canonical source answer write.",
    packet_id: receipt.packet_id || "future-write-packet-answer-steady-action-bg-2-48",
    before_hash: receipt.before_hash || "sha256:before-placeholder-answer-steady-action-bg-2-48",
    after_hash: receipt.after_hash || "sha256:after-placeholder-answer-steady-action-bg-2-48",
    reason: receipt.reason || "Prove receipt shape before enabling storage writes.",
    rollback_receipt_plan: receipt.rollback_receipt_plan || "Create rollback receipt before promotion; restore before_hash state and discard after_hash packet.",
    replay_key: receipt.replay_key || "replay:source-answer:answer-steady-action-bg-2-48:receipt-dry-run",
    write_boundary: receipt.write_boundary || "Dry run only; no source write occurs, canonical_write_allowed remains false, and storage_write_enabled remains false.",
    missing: [],
    blocked: [],
    warnings: [
      "Rollback receipt dry run only; not production write approval.",
      config.audit_policy
    ],
    storage_design: design,
    created_at: "2026-06-27T00:00:00.000Z"
  };
}

function writeRollbackData() {
  const auditConfig = auditReceiptData();
  const audit = sampleAuditReceipt(auditConfig);
  const rollback = {
    rollback_state: "Rollback receipt ready",
    rollback_actor: "Rollback dry-run reviewer",
    rollback_note: "Prove restore and discard behavior before any write is allowed.",
    audit_receipt_id: audit.audit_receipt_id,
    source_answer_id: audit.source_answer_id,
    source_record_id: audit.source_record_id,
    before_hash: audit.before_hash,
    after_hash: audit.after_hash,
    restore_action: "Restore the source-answer preview to before_hash and mark the after_hash packet discarded.",
    discard_action: "Discard the future write packet and keep canonical source data unchanged.",
    rollback_reason: "Prove a future write can be undone before storage writes are allowed.",
    verification_step: "Compare source_answer_id, before_hash, after_hash, and packet id; confirm source_write_executed remains false.",
    replay_key: `${audit.replay_key}:rollback`,
    rollback_boundary: "Dry run only; no source write occurs, canonical_write_allowed remains false, and storage_write_enabled remains false.",
    review_question: "",
    return_reason: "",
    block_reason: ""
  };

  write("data/vedapath-rollback-receipt-dry-run.json", JSON.stringify({
    product: "VedaPath AI",
    release,
    status: "rollback receipt dry run v1",
    schema_version: "rollback-receipt-dry-run-v1",
    audit_receipt_dataset: "data/vedapath-audit-receipt-dry-run.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_rollback_receipt_store: "vedapath-rollback-receipt-dry-run-v1",
    warning: "This gate dry-runs rollback receipts only. It does not write canonical source records, execute storage writes, create accounts, bypass reviewer approval, provide therapy, give ritual instruction, or become spiritual authority.",
    rollback_policy: "A rollback receipt can be marked ready only from a ready audit receipt. It must prove restore action, discard action, reason, verification, replay key, and boundary while source writes remain false.",
    rollback_states: [
      "Draft rollback receipt",
      "Needs rollback review",
      "Rollback receipt ready",
      "Return to audit receipt",
      "Rollback receipt blocked"
    ],
    required_by_state: {
      "Draft rollback receipt": ["rollback_actor", "rollback_note"],
      "Needs rollback review": ["rollback_actor", "rollback_note", "review_question"],
      "Rollback receipt ready": [
        "rollback_actor",
        "rollback_note",
        "audit_receipt_id",
        "source_answer_id",
        "before_hash",
        "after_hash",
        "restore_action",
        "discard_action",
        "rollback_reason",
        "verification_step",
        "replay_key",
        "rollback_boundary"
      ],
      "Return to audit receipt": ["rollback_actor", "rollback_note", "return_reason"],
      "Rollback receipt blocked": ["rollback_actor", "rollback_note", "block_reason"]
    },
    rollback_checks: [
      { check: "Audit receipt", rule: "Input audit receipt must be ready and still no-write." },
      { check: "Hash pair", rule: "Rollback receipt repeats before and after hashes." },
      { check: "Restore action", rule: "Receipt names how to return to before_hash." },
      { check: "Discard action", rule: "Receipt names how to discard after_hash packet." },
      { check: "Verification", rule: "Receipt says how a reviewer confirms no source write." },
      { check: "Replay key", rule: "Receipt can be replayed from audit and source identifiers." },
      { check: "Boundary", rule: "Receipt does not imply production storage readiness." }
    ],
    sample_audit_receipt: audit,
    sample_rollback: rollback
  }, null, 2));
}

function writeRollbackCss() {
  write("assets/vedapath-rollback-receipt-dry-run.css", `/* VedaPath rollback receipt dry run */
.rollback-app,
.rollback-head,
.rollback-layout,
.rollback-form,
.rollback-grid,
.rollback-list,
.rollback-actions,
.rollback-rules {
  display: grid;
  gap: 10px;
}

.rollback-app {
  gap: 16px;
}

.rollback-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.rollback-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.rollback-mark img {
  display: block;
  width: 100%;
}

.rollback-layout {
  grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
  align-items: start;
}

.rollback-form,
.rollback-card,
.rollback-result,
.rollback-packet,
.rollback-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.rollback-form,
.rollback-card,
.rollback-result,
.rollback-rule {
  padding: 12px;
}

.rollback-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.rollback-form input,
.rollback-form select,
.rollback-form textarea,
.rollback-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.rollback-form textarea,
.rollback-packet {
  min-height: 112px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.rollback-grid,
.rollback-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.rollback-card,
.rollback-result {
  border-left: 4px solid var(--gold);
}

.rollback-card.ready,
.rollback-result[data-state="Rollback receipt ready"] {
  border-left-color: var(--green);
}

.rollback-card.blocked,
.rollback-result[data-state="Blocked"],
.rollback-result[data-state="Return to audit receipt"],
.rollback-result[data-state="Rollback receipt blocked"] {
  border-left-color: var(--ochre);
}

.rollback-card span,
.rollback-card strong,
.rollback-rule span,
.rollback-rule strong {
  display: block;
}

.rollback-card span,
.rollback-rule span {
  color: var(--muted);
  font-size: 12px;
}

.rollback-result strong {
  display: block;
  font-size: 24px;
}

.rollback-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.rollback-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.rollback-list {
  max-height: 320px;
  overflow: auto;
}

.rollback-packet {
  min-height: 260px;
}

@media (max-width: 980px) {
  .rollback-layout,
  .rollback-head,
  .rollback-grid,
  .rollback-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .rollback-actions {
    grid-template-columns: 1fr;
  }
}
`);
}

function writeRollbackJs() {
  write("assets/vedapath-rollback-receipt-dry-run.js", `const rollbackRoot = document.getElementById("rollbackReceiptDryRun");

if (rollbackRoot) {
  initRollbackReceiptDryRun().catch((error) => {
    rollbackRoot.innerHTML = '<article class="rollback-result"><strong>Rollback receipt dry run could not load.</strong></article>';
    console.error(error);
  });
}

function rollbackSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseRollbackJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function rollbackMissingForState(config, rollback) {
  const required = config.required_by_state?.[rollback.rollback_state] || [];
  return required.filter((field) => !String(rollback[field] ?? "").trim());
}

function hasRollbackHash(value) {
  return /^sha256:[a-z0-9._:-]{12,}$/i.test(String(value || "").trim());
}

function hasRestoreAction(value) {
  const text = String(value || "");
  return /restore/i.test(text) && /(before_hash|before hash|before)/i.test(text);
}

function hasDiscardAction(value) {
  const text = String(value || "");
  return /discard/i.test(text) && /(after_hash|after hash|packet|canonical source data unchanged)/i.test(text);
}

function hasRollbackReason(value) {
  return String(value || "").trim().length >= 16;
}

function hasVerification(value) {
  const text = String(value || "");
  return /(compare|confirm|verify|check)/i.test(text) && /(source_write_executed remains false|no source write|canonical_write_allowed remains false|source data remains unchanged)/i.test(text);
}

function hasRollbackReplayKey(value) {
  return /(replay:|replay)/i.test(String(value || "")) && /(rollback|source-answer|receipt|source)/i.test(String(value || ""));
}

function keepsRollbackBoundary(value) {
  const text = String(value || "");
  const safe = /(dry run only|no source write|canonical_write_allowed remains false|storage_write_enabled remains false|writes remain blocked)/i.test(text);
  const unsafe = /(source write executed|write executed|storage_write_enabled true|canonical_write_allowed true|production write|changed source)/i.test(text);
  return safe && !unsafe;
}

function rollbackReceiptDryRun(config, auditReceipt, rollback) {
  const missing = rollbackMissingForState(config, rollback);
  const blocked = [];
  const warnings = [];
  const audit = auditReceipt || {};
  const state = rollback.rollback_state || "Draft rollback receipt";
  const ready = state === "Rollback receipt ready";

  if (!auditReceipt || typeof auditReceipt !== "object" || Array.isArray(auditReceipt)) missing.push("audit receipt");
  if (audit.canonical_write_allowed !== false) blocked.push("audit receipt must keep canonical_write_allowed false");
  if (audit.production_ready === true) blocked.push("audit receipt cannot already be production ready");
  if (audit.storage_write_enabled !== false) blocked.push("audit receipt must keep storage_write_enabled false");
  if (audit.source_write_executed !== false) blocked.push("audit receipt must keep source_write_executed false");
  if (ready && (audit.audit_status !== "Audit receipt ready" || audit.immutable_receipt_ready !== true)) blocked.push("audit receipt is not ready");
  if (ready && !hasRollbackHash(rollback.before_hash)) blocked.push("before hash must be a sha256 placeholder");
  if (ready && !hasRollbackHash(rollback.after_hash)) blocked.push("after hash must be a sha256 placeholder");
  if (ready && rollback.before_hash === rollback.after_hash) blocked.push("before and after hashes must differ");
  if (ready && audit.before_hash && rollback.before_hash !== audit.before_hash) blocked.push("before hash must match audit receipt");
  if (ready && audit.after_hash && rollback.after_hash !== audit.after_hash) blocked.push("after hash must match audit receipt");
  if (ready && audit.source_answer_id && rollback.source_answer_id && rollback.source_answer_id !== audit.source_answer_id) blocked.push("source_answer_id must match audit receipt");
  if (ready && !hasRestoreAction(rollback.restore_action)) blocked.push("restore action must return to before_hash");
  if (ready && !hasDiscardAction(rollback.discard_action)) blocked.push("discard action must discard after_hash packet");
  if (ready && !hasRollbackReason(rollback.rollback_reason)) blocked.push("rollback reason must be explicit");
  if (ready && !hasVerification(rollback.verification_step)) blocked.push("verification step must prove no source write");
  if (ready && !hasRollbackReplayKey(rollback.replay_key)) blocked.push("replay key must include rollback context");
  if (ready && !keepsRollbackBoundary(rollback.rollback_boundary)) blocked.push("rollback boundary must keep source writes blocked");
  if (Array.isArray(audit.blocked) && audit.blocked.length > 0) warnings.push("Audit receipt still carries blocked items.");
  if (Array.isArray(audit.warnings)) warnings.push(...audit.warnings);

  const rollback_status = missing.length || blocked.length ? "Blocked" : state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    rollback_receipt_id: "rollback-receipt-dry-run-" + Date.now(),
    rollback_status,
    production_ready: false,
    canonical_write_allowed: false,
    storage_write_enabled: false,
    source_write_executed: false,
    rollback_receipt_ready: rollback_status === "Rollback receipt ready",
    replay_receipt_required: true,
    audit_receipt_id: rollback.audit_receipt_id || audit.audit_receipt_id || "",
    source_answer_id: rollback.source_answer_id || audit.source_answer_id || "",
    source_record_id: rollback.source_record_id || audit.source_record_id || "",
    source_family: audit.source_family || "",
    packet_id: audit.packet_id || "",
    rollback_state: state,
    rollback_actor: rollback.rollback_actor || "",
    rollback_note: rollback.rollback_note || "",
    before_hash: rollback.before_hash || "",
    after_hash: rollback.after_hash || "",
    restore_action: rollback.restore_action || "",
    discard_action: rollback.discard_action || "",
    rollback_reason: rollback.rollback_reason || "",
    verification_step: rollback.verification_step || "",
    replay_key: rollback.replay_key || "",
    rollback_boundary: rollback.rollback_boundary || "",
    review_question: rollback.review_question || "",
    return_reason: rollback.return_reason || "",
    block_reason: rollback.block_reason || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.rollback_policy
    ],
    audit_receipt: audit,
    created_at: new Date().toISOString()
  };
}

function rollbackReceiptSnapshot(receipts, config) {
  const byStatus = receipts.reduce((counts, receipt) => {
    const key = receipt.rollback_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: receipts.length,
    rollback_receipt_ready: byStatus["Rollback receipt ready"] || 0,
    draft: byStatus["Draft rollback receipt"] || 0,
    rollback_review: byStatus["Needs rollback review"] || 0,
    returned: byStatus["Return to audit receipt"] || 0,
    blocked: byStatus.Blocked || 0,
    rollback_receipt_blocked: byStatus["Rollback receipt blocked"] || 0,
    receipts
  };
}

async function rollbackLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readRollbackStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeRollbackStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function rollbackCard(title, value, state = "") {
  return '<article class="rollback-card ' + state + '"><span>' + rollbackSafe(title) + '</span><strong>' + rollbackSafe(value || "None") + '</strong></article>';
}

function renderRollbackResult(target, packet) {
  const details = [
    ...(packet.missing || []).map((item) => "Missing: " + item),
    ...(packet.blocked || [])
  ];
  target.dataset.state = packet.rollback_status;
  target.innerHTML = '<strong>' + rollbackSafe(packet.rollback_status) + '</strong>' +
    '<p class="muted">Rollback ready: ' + rollbackSafe(packet.rollback_receipt_ready) + ' | Source write executed: ' + rollbackSafe(packet.source_write_executed) + '</p>' +
    '<div class="rollback-grid">' +
      rollbackCard("Audit receipt", packet.audit_receipt_id, packet.rollback_receipt_ready ? "ready" : "") +
      rollbackCard("Source answer", packet.source_answer_id) +
      rollbackCard("Before hash", packet.before_hash) +
      rollbackCard("After hash", packet.after_hash) +
    '</div>' +
    (details.length ? '<ul>' + details.map((item) => '<li>' + rollbackSafe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Restore, discard, verification, replay, and boundary are aligned.</p>');
}

function renderRollbackRules(target, config) {
  target.innerHTML = config.rollback_checks.map((check) => (
    '<article class="rollback-rule"><strong>' + rollbackSafe(check.check) + '</strong><span>' + rollbackSafe(check.rule) + '</span></article>'
  )).join("");
}

function renderRollbackAuditScope(target, audit) {
  const rows = [
    ["Audit status", audit.audit_status],
    ["Immutable ready", audit.immutable_receipt_ready],
    ["Storage writes", audit.storage_write_enabled],
    ["Source writes", audit.source_write_executed],
    ["Packet id", audit.packet_id],
    ["Boundary", audit.write_boundary || "No boundary"]
  ];
  target.innerHTML = rows.map(([label, value]) => rollbackCard(label, value)).join("");
}

function renderSavedRollbacks(target, receipts) {
  target.innerHTML = receipts.slice().reverse().map((receipt) => (
    '<article class="rollback-card ' + (receipt.rollback_receipt_ready ? "ready" : "blocked") + '"><span>' + rollbackSafe(receipt.created_at || "") + '</span><strong>' + rollbackSafe(receipt.rollback_status) + '</strong><span>' + rollbackSafe(receipt.source_answer_id || "") + '</span></article>'
  )).join("") || '<article class="rollback-card"><strong>No rollback receipts yet</strong><span>Run and save one dry-run receipt to begin.</span></article>';
}

async function initRollbackReceiptDryRun() {
  const config = await rollbackLoadJson("data/vedapath-rollback-receipt-dry-run.json");
  const storeKey = config.local_rollback_receipt_store;
  const stateSelect = rollbackRoot.querySelector("#rollbackState");
  const auditInput = rollbackRoot.querySelector("#rollbackAuditReceipt");
  const actorInput = rollbackRoot.querySelector("#rollbackActor");
  const noteInput = rollbackRoot.querySelector("#rollbackNote");
  const auditIdInput = rollbackRoot.querySelector("#rollbackAuditId");
  const answerInput = rollbackRoot.querySelector("#rollbackSourceAnswer");
  const recordInput = rollbackRoot.querySelector("#rollbackSourceRecord");
  const beforeInput = rollbackRoot.querySelector("#rollbackBeforeHash");
  const afterInput = rollbackRoot.querySelector("#rollbackAfterHash");
  const restoreInput = rollbackRoot.querySelector("#rollbackRestoreAction");
  const discardInput = rollbackRoot.querySelector("#rollbackDiscardAction");
  const reasonInput = rollbackRoot.querySelector("#rollbackReason");
  const verificationInput = rollbackRoot.querySelector("#rollbackVerification");
  const replayInput = rollbackRoot.querySelector("#rollbackReplayKey");
  const boundaryInput = rollbackRoot.querySelector("#rollbackBoundary");
  const questionInput = rollbackRoot.querySelector("#rollbackReviewQuestion");
  const returnInput = rollbackRoot.querySelector("#rollbackReturnReason");
  const blockInput = rollbackRoot.querySelector("#rollbackBlockReason");
  const resultTarget = rollbackRoot.querySelector("#rollbackResultCard");
  const auditScopeTarget = rollbackRoot.querySelector("#rollbackAuditScope");
  const checksTarget = rollbackRoot.querySelector("#rollbackChecks");
  const packetTarget = rollbackRoot.querySelector("#rollbackPacket");
  const savedTarget = rollbackRoot.querySelector("#rollbackSaved");

  stateSelect.innerHTML = config.rollback_states.map((state) => '<option>' + rollbackSafe(state) + '</option>').join("");

  function loadSample() {
    const sample = config.sample_rollback;
    auditInput.value = JSON.stringify(config.sample_audit_receipt, null, 2);
    stateSelect.value = sample.rollback_state;
    actorInput.value = sample.rollback_actor;
    noteInput.value = sample.rollback_note;
    auditIdInput.value = sample.audit_receipt_id;
    answerInput.value = sample.source_answer_id;
    recordInput.value = sample.source_record_id;
    beforeInput.value = sample.before_hash;
    afterInput.value = sample.after_hash;
    restoreInput.value = sample.restore_action;
    discardInput.value = sample.discard_action;
    reasonInput.value = sample.rollback_reason;
    verificationInput.value = sample.verification_step;
    replayInput.value = sample.replay_key;
    boundaryInput.value = sample.rollback_boundary;
    questionInput.value = sample.review_question;
    returnInput.value = sample.return_reason;
    blockInput.value = sample.block_reason;
  }

  function collectRollback() {
    return {
      rollback_state: stateSelect.value,
      rollback_actor: actorInput.value.trim(),
      rollback_note: noteInput.value.trim(),
      audit_receipt_id: auditIdInput.value.trim(),
      source_answer_id: answerInput.value.trim(),
      source_record_id: recordInput.value.trim(),
      before_hash: beforeInput.value.trim(),
      after_hash: afterInput.value.trim(),
      restore_action: restoreInput.value.trim(),
      discard_action: discardInput.value.trim(),
      rollback_reason: reasonInput.value.trim(),
      verification_step: verificationInput.value.trim(),
      replay_key: replayInput.value.trim(),
      rollback_boundary: boundaryInput.value.trim(),
      review_question: questionInput.value.trim(),
      return_reason: returnInput.value.trim(),
      block_reason: blockInput.value.trim()
    };
  }

  function currentPacket() {
    const audit = parseRollbackJson(auditInput.value, config.sample_audit_receipt);
    return rollbackReceiptDryRun(config, audit, collectRollback());
  }

  function render() {
    const audit = parseRollbackJson(auditInput.value, config.sample_audit_receipt);
    const packet = currentPacket();
    renderRollbackResult(resultTarget, packet);
    renderRollbackAuditScope(auditScopeTarget, audit);
    renderRollbackRules(checksTarget, config);
    packetTarget.value = JSON.stringify(packet, null, 2);
    renderSavedRollbacks(savedTarget, readRollbackStore(storeKey));
  }

  rollbackRoot.querySelector("#loadRollbackSample").addEventListener("click", () => {
    loadSample();
    render();
  });

  rollbackRoot.querySelector("#runRollbackDryRun").addEventListener("click", render);

  rollbackRoot.querySelector("#saveRollbackDryRun").addEventListener("click", () => {
    const receipts = readRollbackStore(storeKey);
    receipts.push(currentPacket());
    writeRollbackStore(storeKey, receipts);
    render();
  });

  rollbackRoot.querySelector("#clearRollbackDryRuns").addEventListener("click", () => {
    writeRollbackStore(storeKey, []);
    render();
  });

  rollbackRoot.querySelector("#copyRollbackPacket").addEventListener("click", async () => {
    packetTarget.select();
    try {
      await navigator.clipboard.writeText(packetTarget.value);
    } catch (error) {
      document.execCommand("copy");
    }
  });

  [auditInput, stateSelect, actorInput, noteInput, auditIdInput, answerInput, recordInput, beforeInput, afterInput, restoreInput, discardInput, reasonInput, verificationInput, replayInput, boundaryInput, questionInput, returnInput, blockInput].forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  loadSample();
  render();
}

window.vedapathRollbackReceiptDryRun = {
  rollbackReceiptDryRun,
  rollbackReceiptSnapshot,
  rollbackMissingForState,
  parseRollbackJson
};
`);
}

function writeRollbackPage() {
  write("rollbackreceiptdryrun.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Rollback Receipt Dry Run</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-rollback-receipt-dry-run.css">
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
            <span>Rollback receipt dry run</span>
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

      <main class="workspace" aria-label="VedaPath Rollback Receipt Dry Run workspace">
        <aside class="panel">
          <span class="eyebrow">Rollback restraint</span>
          <h2>Prove the undo path first</h2>
          <p class="muted">A rollback receipt dry run links to the audit receipt and proves restore, discard, verification, replay, and boundary before storage writes exist.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Audit</strong><p>Read receipt.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Restore</strong><p>Name before state.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Discard</strong><p>Drop after packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Replay</strong><p>Keep proof repeatable.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="auditreceiptdryrun.html">Open Audit Receipt</a>
            <a class="button safe" href="storagedesigngate.html">Open Storage Design</a>
          </div>
        </aside>

        <section class="panel rollback-app" id="rollbackReceiptDryRun">
          <div class="rollback-head">
            <div>
              <span class="eyebrow">Rollback receipt</span>
              <h1>Restore before write. Discard without damage.</h1>
              <p class="muted">This room proves the rollback receipt shape for a future source-answer write without executing that write.</p>
            </div>
            <div class="rollback-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath rollback receipt mark"></div>
          </div>

          <section class="rollback-layout">
            <div class="rollback-form">
              <h2>Rollback Receipt Dry Run</h2>
              <label>Audit receipt packet<textarea id="rollbackAuditReceipt"></textarea></label>
              <label>Rollback state<select id="rollbackState"></select></label>
              <label>Rollback actor<input id="rollbackActor" type="text" placeholder="Rollback dry-run reviewer"></label>
              <label>Rollback note<textarea id="rollbackNote"></textarea></label>
              <label>Audit receipt id<input id="rollbackAuditId" type="text"></label>
              <label>Source answer id<input id="rollbackSourceAnswer" type="text"></label>
              <label>Source record id<input id="rollbackSourceRecord" type="text"></label>
              <label>Before hash<input id="rollbackBeforeHash" type="text"></label>
              <label>After hash<input id="rollbackAfterHash" type="text"></label>
              <label>Restore action<textarea id="rollbackRestoreAction"></textarea></label>
              <label>Discard action<textarea id="rollbackDiscardAction"></textarea></label>
              <label>Rollback reason<textarea id="rollbackReason"></textarea></label>
              <label>Verification step<textarea id="rollbackVerification"></textarea></label>
              <label>Replay key<input id="rollbackReplayKey" type="text"></label>
              <label>Rollback boundary<textarea id="rollbackBoundary"></textarea></label>
              <label>Review question<textarea id="rollbackReviewQuestion"></textarea></label>
              <label>Return reason<textarea id="rollbackReturnReason"></textarea></label>
              <label>Block reason<textarea id="rollbackBlockReason"></textarea></label>
              <div class="rollback-actions">
                <button class="button primary" id="runRollbackDryRun" type="button">Run Rollback</button>
                <button class="button safe" id="loadRollbackSample" type="button">Load Sample</button>
                <button class="button" id="saveRollbackDryRun" type="button">Save Local</button>
                <button class="button" id="clearRollbackDryRuns" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="rollback-result" id="rollbackResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Audit Receipt Scope</h2>
                <div class="rollback-list" id="rollbackAuditScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Rollback Checks</h2>
            <div class="rollback-rules" id="rollbackChecks"></div>
          </section>

          <section class="rollback-layout">
            <div>
              <div class="rollback-actions">
                <button class="button safe" id="copyRollbackPacket" type="button">Copy Rollback Packet</button>
                <a class="button" href="data/vedapath-rollback-receipt-dry-run.json">Open JSON</a>
              </div>
              <textarea class="rollback-packet" id="rollbackPacket" aria-label="Rollback receipt dry-run packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Rollbacks</h2>
              <div class="rollback-list" id="rollbackSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Rollback proof</span>
          <h2 style="margin-top: 14px;">Undo Before Write</h2>
          <p class="muted">The rollback receipt proves the restore and discard path while source_write_executed stays false.</p>
          <div class="progress" aria-label="Rollback receipt dry run progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>5</strong></div>
            <div class="metric"><span>Writes</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Replay</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Rollback Rule</h2>
            <p class="muted">No source write is executed. The next release should prove replay receipts from audit plus rollback packets.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-rollback-receipt-dry-run.js"></script>
  </body>
</html>
`);
}

function updateNavigationLinks() {
  let audit = read("auditreceiptdryrun.html");
  if (!audit.includes("rollbackreceiptdryrun.html")) {
    audit = audit.replace(
      '<a class="button primary" href="storagedesigngate.html">Open Storage Design</a>\n            <a class="button safe" href="releasereviewgate.html">Open Release Review</a>',
      '<a class="button primary" href="rollbackreceiptdryrun.html">Open Rollback Receipt</a>\n            <a class="button safe" href="storagedesigngate.html">Open Storage Design</a>\n            <a class="button" href="releasereviewgate.html">Open Release Review</a>'
    );
    audit = audit.replace(
      "The next release should prove rollback receipts against this dry-run receipt.",
      "Rollback receipts can now be dry-run before replay proof begins."
    );
    write("auditreceiptdryrun.html", audit);
  }
}

function updateIndex() {
  let content = read("index.html");
  if (!content.includes('rollbackreceiptdryrun.html">Rollback receipt')) {
    content = content
      .replace(
        '<a href="auditreceiptdryrun.html">Audit receipt <span>dry run</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>',
        '<a href="auditreceiptdryrun.html">Audit receipt <span>dry run</span></a>\n              <a href="rollbackreceiptdryrun.html">Rollback receipt <span>dry run</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>'
      )
      .replace(
        '<a href="auditreceiptdryrun.html">Audit receipt <span>proof</span></a>\n            </div>',
        '<a href="auditreceiptdryrun.html">Audit receipt <span>proof</span></a>\n              <a href="rollbackreceiptdryrun.html">Rollback receipt <span>proof</span></a>\n            </div>'
      );
  }
  content = content.replace(
    "rollback proof, replay receipts, and production memory.",
    "replay proof, controlled storage, and production memory."
  );
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = updateVersionBadge(content)
    .replace('<strong>v3.0.4</strong>\n          <p>Audit Receipt Dry Run: ready storage designs now produce immutable receipt packets with before and after hashes, reason, rollback plan, replay key, and write boundary.</p>', '<strong>v3.0.5</strong>\n          <p>Rollback Receipt Dry Run: audit-ready receipts now prove restore action, discard action, verification, replay key, and rollback boundary before any source write.</p>')
    .replace('<strong>86%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:86%"></div></div>\n          <p>The trust loop now proves the audit receipt shape before any production write exists.</p>', '<strong>87%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:87%"></div></div>\n          <p>The trust loop now proves rollback behavior before any production write exists.</p>')
    .replace('<strong>Rollback receipt dry run</strong>\n          <p>Prove restore and discard behavior from audit receipts while canonical writes remain blocked.</p>', '<strong>Replay receipt dry run</strong>\n          <p>Prove repeatable replay from audit and rollback receipts while canonical writes remain blocked.</p>')
    .replace('<div class="percent">86%</div>', '<div class="percent">87%</div>');

  const rollbackPhase = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 269: Rollback Receipt Dry Run</strong>
                <p>Proves restore, discard, verification, replay key, and rollback boundary from an audit receipt while writes remain blocked.</p>
              </div>
              <span class="percent">100%</span>
            </article>
`;
  if (!content.includes("Phase 269: Rollback Receipt Dry Run")) {
    content = content.replace(
      `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 269: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
      `${rollbackPhase}            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 270: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
  }

  content = content
    .replace('<div class="version-row"><span>Release</span><strong>v3.0.4 Audit Receipt Dry Run</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.0.5 Rollback Receipt Dry Run</strong></div>')
    .replace('<div class="version-row"><span>Previous</span><strong>v3.0.3 Storage Design Gate</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.0.4 Audit Receipt Dry Run</strong></div>')
    .replace('<div class="version-row"><span>Goal</span><strong>Prove immutable receipt behavior before any source storage write.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Prove rollback behavior before any source storage write.</strong></div>')
    .replace('<div class="version-row"><span>Status</span><strong>Ready for rollback receipt dry run</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for replay receipt dry run</strong></div>')
    .replace(`<li><span class="dot"></span><span>Create rollback receipt dry-run packets.</span></li>
              <li><span class="dot"></span><span>Link rollback receipt to audit receipt id.</span></li>
              <li><span class="dot"></span><span>Verify restore and discard proof shape.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`, `<li><span class="dot"></span><span>Create replay receipt dry-run packets.</span></li>
              <li><span class="dot"></span><span>Link replay to audit and rollback receipt ids.</span></li>
              <li><span class="dot"></span><span>Verify deterministic replay proof shape.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH ROLLBACK RECEIPT DRY RUN START -->", "<!-- VEDAPATH ROLLBACK RECEIPT DRY RUN END -->", `## ${release} Rollback Receipt Dry Run

This release adds the rollback receipt dry-run layer after audit receipts.

- adds rollbackreceiptdryrun.html
- adds data/vedapath-rollback-receipt-dry-run.json
- records restore action, discard action, rollback reason, verification step, replay key, and rollback boundary
- keeps source_write_executed false, storage_write_enabled false, production_ready false, and canonical_write_allowed false
- sets the next release as replay receipt dry run`, "<!-- VEDAPATH AUDIT RECEIPT DRY RUN START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH ROLLBACK RECEIPT DRY RUN NOTES START -->", "<!-- VEDAPATH ROLLBACK RECEIPT DRY RUN NOTES END -->", `## ${release} Rollback Receipt Dry Run

This phase converts a ready audit receipt into a rollback receipt dry run.

Action taken:

- Added rollback receipt dry-run schema.
- Added receipt states for draft, review, ready, return, and blocked.
- Required restore action, discard action, rollback reason, verification, replay key, and boundary before ready.
- Added copyable rollback receipt packets and local rollback memory.
- Preserved canonical source data.`, "<!-- VEDAPATH AUDIT RECEIPT DRY RUN NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH ROLLBACK RECEIPT DRY RUN BLUEPRINT START -->", "<!-- VEDAPATH ROLLBACK RECEIPT DRY RUN BLUEPRINT END -->", `### 288. Rollback Receipt Dry Run

VedaPath should prove reversibility before it stores anything.

Rules:

- Rollback receipt dry run can start only from a ready audit receipt.
- A ready rollback must include restore action, discard action, reason, verification, replay key, and boundary.
- Rollback readiness is not production readiness.
- Source writes, storage writes, and canonical writes remain false in preview.
- The next build should dry-run replay receipts from audit and rollback packets.`, "<!-- VEDAPATH AUDIT RECEIPT DRY RUN BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/ROLLBACK_RECEIPT_DRY_RUN.md", `# VedaPath AI Rollback Receipt Dry Run

Release: ${release}

This release adds the rollback receipt dry-run layer after audit receipts.

## Files

- data/vedapath-rollback-receipt-dry-run.json
- rollbackreceiptdryrun.html
- assets/vedapath-rollback-receipt-dry-run.css
- assets/vedapath-rollback-receipt-dry-run.js

## What It Adds

The room:

- reads an audit receipt packet
- records rollback states
- repeats the before and after hash pair
- requires restore and discard actions
- requires verification that no source write occurred
- exports a copyable rollback receipt packet
- stores local rollback history only

## Boundary

Rollback receipt dry run is not production storage. No source write is executed. Production still requires replay proof, controlled storage, durable identity, and final founder instruction.
`);
}

writeRollbackData();
writeRollbackCss();
writeRollbackJs();
writeRollbackPage();
updateAllHtmlShells();
updateNavigationLinks();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} rollback receipt dry run applied.`);

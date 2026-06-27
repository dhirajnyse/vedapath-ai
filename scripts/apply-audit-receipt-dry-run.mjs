import fs from "node:fs";
import path from "node:path";

const release = "v3.0.4";
const badge = `${release} audit receipt`;

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

function storageDesignData() {
  return JSON.parse(read("data/vedapath-storage-design-gate.json"));
}

function sampleStorageDesign(config) {
  const review = config.sample_release_review || {};
  const design = config.sample_design || {};
  return {
    schema_version: config.schema_version,
    release: config.release,
    storage_design_id: "storage-design-sample-audit-receipt",
    design_status: "Storage design ready",
    production_ready: false,
    canonical_write_allowed: false,
    storage_design_ready: true,
    storage_write_enabled: false,
    release_review_id: review.release_review_id || "",
    dry_run_audit_id: review.dry_run_audit_id || "",
    implementation_task_id: review.implementation_task_id || "",
    source_answer_id: review.source_answer_id || "",
    source_record_id: review.source_record_id || "",
    source_family: review.source_family || "",
    owner_decision_id: review.owner_decision_id || "",
    design_state: design.design_state || "Storage design ready",
    architect_name: design.architect_name || "Storage architect",
    design_note: design.design_note || "Design storage controls without enabling canonical writes.",
    schema_summary: design.schema_summary || "Tables: source_answer_drafts, review_receipts, audit_receipts, rollback_receipts, replay_queue.",
    architecture_question: "",
    audit_receipt_rule: design.audit_receipt_rule || "Every accepted future write must create an immutable audit receipt with actor, packet id, source_answer_id, before hash, after hash, and reason.",
    rollback_receipt_rule: design.rollback_receipt_rule || "Every write must include a rollback receipt plan before it can be promoted.",
    replay_rule: design.replay_rule || "Storage changes must be replayable from release-review packets, source packet snapshots, and audit receipts.",
    write_boundary: design.write_boundary || "Design only; canonical_write_allowed remains false and no production source data is written.",
    return_reason: "",
    block_reason: "",
    missing: [],
    blocked: [],
    warnings: [
      "Audit receipt dry run only; not production write approval.",
      config.storage_policy
    ],
    release_review: review,
    created_at: "2026-06-27T00:00:00.000Z"
  };
}

function writeAuditData() {
  const storageConfig = storageDesignData();
  const storageDesign = sampleStorageDesign(storageConfig);
  const data = {
    product: "VedaPath AI",
    release,
    status: "audit receipt dry run v1",
    schema_version: "audit-receipt-dry-run-v1",
    storage_design_dataset: "data/vedapath-storage-design-gate.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_audit_receipt_store: "vedapath-audit-receipt-dry-run-v1",
    warning: "This gate dry-runs immutable audit receipts only. It does not write canonical source records, publish production data, create accounts, bypass reviewer approval, provide therapy, give ritual instruction, or become spiritual authority.",
    audit_policy: "An audit receipt can be marked ready only from a ready storage design. It may define actor, packet id, before hash, after hash, reason, rollback plan, replay key, and write boundary, but source writes remain false.",
    audit_states: [
      "Draft audit receipt",
      "Needs receipt review",
      "Audit receipt ready",
      "Return to storage design",
      "Audit receipt blocked"
    ],
    required_by_state: {
      "Draft audit receipt": ["receipt_actor", "receipt_note"],
      "Needs receipt review": ["receipt_actor", "receipt_note", "review_question"],
      "Audit receipt ready": [
        "receipt_actor",
        "receipt_note",
        "packet_id",
        "source_answer_id",
        "before_hash",
        "after_hash",
        "reason",
        "rollback_receipt_plan",
        "replay_key",
        "write_boundary"
      ],
      "Return to storage design": ["receipt_actor", "receipt_note", "return_reason"],
      "Audit receipt blocked": ["receipt_actor", "receipt_note", "block_reason"]
    },
    receipt_checks: [
      {
        check: "Storage design",
        rule: "Input design must be ready and still block storage writes."
      },
      {
        check: "No source write",
        rule: "Receipt dry run cannot execute or imply a source write."
      },
      {
        check: "Before hash",
        rule: "Receipt names the pre-write hash placeholder."
      },
      {
        check: "After hash",
        rule: "Receipt names the proposed post-write hash placeholder."
      },
      {
        check: "Reason",
        rule: "Receipt explains why the future packet exists."
      },
      {
        check: "Rollback link",
        rule: "Receipt points to rollback receipt planning."
      },
      {
        check: "Replay key",
        rule: "Receipt can be replayed from packet and source identifiers."
      }
    ],
    sample_storage_design: storageDesign,
    sample_receipt: {
      audit_state: "Audit receipt ready",
      receipt_actor: "Audit dry-run reviewer",
      receipt_note: "Dry-run an immutable receipt for a future non-canonical source answer write.",
      packet_id: "future-write-packet-answer-steady-action-bg-2-48",
      source_answer_id: storageDesign.source_answer_id || "answer-steady-action-bg-2-48",
      source_record_id: storageDesign.source_record_id || "bg-2-48-steadiness",
      before_hash: "sha256:before-placeholder-answer-steady-action-bg-2-48",
      after_hash: "sha256:after-placeholder-answer-steady-action-bg-2-48",
      reason: "Prove receipt shape before enabling storage writes.",
      rollback_receipt_plan: "Create rollback receipt before promotion; restore before_hash state and discard after_hash packet.",
      replay_key: "replay:source-answer:answer-steady-action-bg-2-48:receipt-dry-run",
      write_boundary: "Dry run only; no source write occurs, canonical_write_allowed remains false, and storage_write_enabled remains false.",
      review_question: "",
      return_reason: "",
      block_reason: ""
    }
  };
  write("data/vedapath-audit-receipt-dry-run.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeAuditCss() {
  write("assets/vedapath-audit-receipt-dry-run.css", `/* VedaPath audit receipt dry run */
.receipt-app,
.receipt-head,
.receipt-layout,
.receipt-form,
.receipt-grid,
.receipt-list,
.receipt-actions,
.receipt-rules {
  display: grid;
  gap: 10px;
}

.receipt-app {
  gap: 16px;
}

.receipt-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.receipt-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.receipt-mark img {
  display: block;
  width: 100%;
}

.receipt-layout {
  grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
  align-items: start;
}

.receipt-form,
.receipt-card,
.receipt-result,
.receipt-packet,
.receipt-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.receipt-form,
.receipt-card,
.receipt-result,
.receipt-rule {
  padding: 12px;
}

.receipt-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.receipt-form input,
.receipt-form select,
.receipt-form textarea,
.receipt-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.receipt-form textarea,
.receipt-packet {
  min-height: 112px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.receipt-grid,
.receipt-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.receipt-card,
.receipt-result {
  border-left: 4px solid var(--gold);
}

.receipt-card.ready,
.receipt-result[data-state="Audit receipt ready"] {
  border-left-color: var(--green);
}

.receipt-card.blocked,
.receipt-result[data-state="Blocked"],
.receipt-result[data-state="Return to storage design"],
.receipt-result[data-state="Audit receipt blocked"] {
  border-left-color: var(--ochre);
}

.receipt-card span,
.receipt-card strong,
.receipt-rule span,
.receipt-rule strong {
  display: block;
}

.receipt-card span,
.receipt-rule span {
  color: var(--muted);
  font-size: 12px;
}

.receipt-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.receipt-list {
  max-height: 290px;
  overflow: auto;
  padding-right: 3px;
}

@media (max-width: 980px) {
  .receipt-head,
  .receipt-layout,
  .receipt-grid,
  .receipt-rules {
    grid-template-columns: 1fr;
  }

  .receipt-mark {
    max-width: 150px;
  }
}

@media (max-width: 680px) {
  .receipt-actions,
  .receipt-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeAuditJs() {
  write("assets/vedapath-audit-receipt-dry-run.js", `const receiptRoot = document.getElementById("auditReceiptDryRun");

if (receiptRoot) {
  initAuditReceiptDryRun().catch((error) => {
    receiptRoot.innerHTML = '<article class="receipt-result"><strong>Audit receipt dry run could not load.</strong></article>';
    console.error(error);
  });
}

function receiptSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseReceiptJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function receiptMissingForState(config, receipt) {
  const required = config.required_by_state?.[receipt.audit_state] || [];
  return required.filter((field) => !String(receipt[field] ?? "").trim());
}

function hasReceiptHash(value) {
  return /^sha256:[a-z0-9._:-]{12,}$/i.test(String(value || "").trim());
}

function hasReason(value) {
  return String(value || "").trim().length >= 16;
}

function hasRollbackPlan(value) {
  const text = String(value || "");
  return /(rollback receipt|rollback plan|restore|discard|before_hash|after_hash)/i.test(text) && /(restore|discard|before|after|rollback)/i.test(text);
}

function hasReplayKey(value) {
  return /(replay:|replay)/i.test(String(value || "")) && /(source-answer|packet|receipt|source)/i.test(String(value || ""));
}

function keepsReceiptBoundary(value) {
  const text = String(value || "");
  const safe = /(dry run only|no source write|canonical_write_allowed remains false|storage_write_enabled remains false|writes remain blocked)/i.test(text);
  const unsafe = /(source write executed|write executed|storage_write_enabled true|canonical_write_allowed true|production write|changed source)/i.test(text);
  return safe && !unsafe;
}

function auditReceiptDryRun(config, storageDesign, receipt) {
  const missing = receiptMissingForState(config, receipt);
  const blocked = [];
  const warnings = [];
  const design = storageDesign || {};
  const state = receipt.audit_state || "Draft audit receipt";
  const ready = state === "Audit receipt ready";

  if (!storageDesign || typeof storageDesign !== "object" || Array.isArray(storageDesign)) missing.push("storage design");
  if (design.canonical_write_allowed !== false) blocked.push("storage design must keep canonical_write_allowed false");
  if (design.production_ready === true) blocked.push("storage design cannot already be production ready");
  if (design.storage_write_enabled !== false) blocked.push("storage design must keep storage_write_enabled false");
  if (ready && (design.design_status !== "Storage design ready" || design.storage_design_ready !== true)) blocked.push("storage design is not ready");
  if (ready && !hasReceiptHash(receipt.before_hash)) blocked.push("before hash must be a sha256 placeholder");
  if (ready && !hasReceiptHash(receipt.after_hash)) blocked.push("after hash must be a sha256 placeholder");
  if (ready && receipt.before_hash === receipt.after_hash) blocked.push("before and after hash placeholders must differ");
  if (ready && !hasReason(receipt.reason)) blocked.push("receipt reason must be explicit");
  if (ready && !hasRollbackPlan(receipt.rollback_receipt_plan)) blocked.push("rollback receipt plan must be explicit");
  if (ready && !hasReplayKey(receipt.replay_key)) blocked.push("replay key must be explicit");
  if (ready && !keepsReceiptBoundary(receipt.write_boundary)) blocked.push("write boundary must keep source writes blocked");
  if (ready && design.source_answer_id && receipt.source_answer_id && design.source_answer_id !== receipt.source_answer_id) blocked.push("receipt source_answer_id must match storage design");
  if (Array.isArray(design.blocked) && design.blocked.length > 0) warnings.push("Storage design still carries blocked items.");
  if (Array.isArray(design.warnings)) warnings.push(...design.warnings);

  const audit_status = missing.length || blocked.length ? "Blocked" : state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    audit_receipt_id: "audit-receipt-dry-run-" + Date.now(),
    audit_status,
    production_ready: false,
    canonical_write_allowed: false,
    storage_write_enabled: false,
    source_write_executed: false,
    immutable_receipt_ready: audit_status === "Audit receipt ready",
    rollback_receipt_required: true,
    storage_design_id: design.storage_design_id || "",
    release_review_id: design.release_review_id || "",
    dry_run_audit_id: design.dry_run_audit_id || "",
    implementation_task_id: design.implementation_task_id || "",
    source_answer_id: receipt.source_answer_id || design.source_answer_id || "",
    source_record_id: receipt.source_record_id || design.source_record_id || "",
    source_family: design.source_family || "",
    owner_decision_id: design.owner_decision_id || "",
    audit_state: state,
    receipt_actor: receipt.receipt_actor || "",
    receipt_note: receipt.receipt_note || "",
    packet_id: receipt.packet_id || "",
    before_hash: receipt.before_hash || "",
    after_hash: receipt.after_hash || "",
    reason: receipt.reason || "",
    rollback_receipt_plan: receipt.rollback_receipt_plan || "",
    replay_key: receipt.replay_key || "",
    write_boundary: receipt.write_boundary || "",
    review_question: receipt.review_question || "",
    return_reason: receipt.return_reason || "",
    block_reason: receipt.block_reason || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.audit_policy
    ],
    storage_design: design,
    created_at: new Date().toISOString()
  };
}

function auditReceiptSnapshot(receipts, config) {
  const byStatus = receipts.reduce((counts, receipt) => {
    const key = receipt.audit_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: receipts.length,
    audit_receipt_ready: byStatus["Audit receipt ready"] || 0,
    draft: byStatus["Draft audit receipt"] || 0,
    receipt_review: byStatus["Needs receipt review"] || 0,
    returned: byStatus["Return to storage design"] || 0,
    blocked: byStatus.Blocked || 0,
    audit_receipt_blocked: byStatus["Audit receipt blocked"] || 0,
    receipts
  };
}

async function receiptLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readReceiptStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeReceiptStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initAuditReceiptDryRun() {
  const config = await receiptLoadJson("data/vedapath-audit-receipt-dry-run.json");
  const storeKey = config.local_audit_receipt_store;
  let receipts = readReceiptStore(storeKey);
  let activeReceipt = null;

  const designInput = receiptRoot.querySelector("#receiptStorageDesign");
  const stateSelect = receiptRoot.querySelector("#receiptAuditState");
  const actorInput = receiptRoot.querySelector("#receiptActor");
  const noteInput = receiptRoot.querySelector("#receiptNote");
  const packetInput = receiptRoot.querySelector("#receiptPacketId");
  const answerInput = receiptRoot.querySelector("#receiptSourceAnswer");
  const recordInput = receiptRoot.querySelector("#receiptSourceRecord");
  const beforeInput = receiptRoot.querySelector("#receiptBeforeHash");
  const afterInput = receiptRoot.querySelector("#receiptAfterHash");
  const reasonInput = receiptRoot.querySelector("#receiptReason");
  const rollbackInput = receiptRoot.querySelector("#receiptRollbackPlan");
  const replayInput = receiptRoot.querySelector("#receiptReplayKey");
  const boundaryInput = receiptRoot.querySelector("#receiptBoundary");
  const questionInput = receiptRoot.querySelector("#receiptReviewQuestion");
  const returnInput = receiptRoot.querySelector("#receiptReturnReason");
  const blockInput = receiptRoot.querySelector("#receiptBlockReason");
  const resultEl = receiptRoot.querySelector("#receiptResultCard");
  const packetEl = receiptRoot.querySelector("#receiptPacket");
  const checksEl = receiptRoot.querySelector("#receiptChecks");
  const designScopeEl = receiptRoot.querySelector("#receiptDesignScope");
  const savedEl = receiptRoot.querySelector("#receiptSaved");
  const runButton = receiptRoot.querySelector("#runReceiptDryRun");
  const sampleButton = receiptRoot.querySelector("#loadReceiptSample");
  const saveButton = receiptRoot.querySelector("#saveReceiptDryRun");
  const clearButton = receiptRoot.querySelector("#clearReceiptDryRuns");
  const copyButton = receiptRoot.querySelector("#copyReceiptPacket");

  stateSelect.innerHTML = (config.audit_states || []).map((state) => '<option value="' + receiptSafe(state) + '">' + receiptSafe(state) + '</option>').join("");

  function loadSample() {
    designInput.value = JSON.stringify(config.sample_storage_design, null, 2);
    stateSelect.value = config.sample_receipt.audit_state;
    actorInput.value = config.sample_receipt.receipt_actor;
    noteInput.value = config.sample_receipt.receipt_note;
    packetInput.value = config.sample_receipt.packet_id;
    answerInput.value = config.sample_receipt.source_answer_id;
    recordInput.value = config.sample_receipt.source_record_id;
    beforeInput.value = config.sample_receipt.before_hash;
    afterInput.value = config.sample_receipt.after_hash;
    reasonInput.value = config.sample_receipt.reason;
    rollbackInput.value = config.sample_receipt.rollback_receipt_plan;
    replayInput.value = config.sample_receipt.replay_key;
    boundaryInput.value = config.sample_receipt.write_boundary;
    questionInput.value = config.sample_receipt.review_question;
    returnInput.value = config.sample_receipt.return_reason;
    blockInput.value = config.sample_receipt.block_reason;
  }

  function receiptFromForm() {
    return {
      audit_state: stateSelect.value,
      receipt_actor: actorInput.value.trim(),
      receipt_note: noteInput.value.trim(),
      packet_id: packetInput.value.trim(),
      source_answer_id: answerInput.value.trim(),
      source_record_id: recordInput.value.trim(),
      before_hash: beforeInput.value.trim(),
      after_hash: afterInput.value.trim(),
      reason: reasonInput.value.trim(),
      rollback_receipt_plan: rollbackInput.value.trim(),
      replay_key: replayInput.value.trim(),
      write_boundary: boundaryInput.value.trim(),
      review_question: questionInput.value.trim(),
      return_reason: returnInput.value.trim(),
      block_reason: blockInput.value.trim()
    };
  }

  function renderChecks() {
    checksEl.innerHTML = (config.receipt_checks || []).map((item) => (
      '<article class="receipt-rule"><span>' + receiptSafe(item.check) + '</span><strong>' + receiptSafe(item.rule) + '</strong></article>'
    )).join("");
  }

  function renderDesignScope(design) {
    designScopeEl.innerHTML = [
      ["Storage design", design.design_status || "Unknown"],
      ["Source answer", design.source_answer_id || "No source answer"],
      ["Receipt rule", design.audit_receipt_rule || "No rule"],
      ["Canonical writes", design.canonical_write_allowed === false ? "False" : "Check"],
      ["Storage writes", design.storage_write_enabled === false ? "False" : "Check"],
      ["Boundary", design.write_boundary || "No boundary"]
    ].map((row) => (
      '<article class="receipt-card ' + (row[0] === "Canonical writes" || row[0] === "Storage writes" ? "ready" : "") + '"><span>' + receiptSafe(row[0]) + '</span><strong>' + receiptSafe(row[1]) + '</strong></article>'
    )).join("");
  }

  function renderSaved() {
    savedEl.innerHTML = receipts.slice(0, 8).map((receipt) => (
      '<article class="receipt-card">' +
        '<span>' + receiptSafe(receipt.created_at) + '</span>' +
        '<strong>' + receiptSafe(receipt.audit_status) + '</strong>' +
        '<span>' + receiptSafe((receipt.source_answer_id || "receipt") + " | " + receipt.receipt_actor) + '</span>' +
      '</article>'
    )).join("") || '<article class="receipt-card"><strong>No audit receipts yet</strong><span>Dry-run and save one receipt packet to begin.</span></article>';
  }

  function renderReceipt() {
    const design = parseReceiptJson(designInput.value, {});
    const receipt = receiptFromForm();
    const result = auditReceiptDryRun(config, design, receipt);
    activeReceipt = result;
    resultEl.dataset.state = result.audit_status;
    resultEl.innerHTML = [
      '<span class="badge ' + (result.immutable_receipt_ready ? 'green' : '') + '">' + receiptSafe(result.audit_status) + '</span>',
      '<h2>Audit receipt packet</h2>',
      '<p class="muted">' + receiptSafe(result.source_answer_id || "No source answer") + '</p>',
      '<div class="receipt-grid">',
      '<article class="receipt-card"><span>Missing</span><strong>' + receiptSafe(result.missing.length ? result.missing.join(", ") : "None") + '</strong></article>',
      '<article class="receipt-card"><span>Blocked</span><strong>' + receiptSafe(result.blocked.length ? result.blocked.join(", ") : "None") + '</strong></article>',
      '<article class="receipt-card"><span>Receipt ready</span><strong>' + receiptSafe(result.immutable_receipt_ready ? "Ready" : "No") + '</strong></article>',
      '<article class="receipt-card"><span>Source write</span><strong>False</strong></article>',
      '</div>'
    ].join("");
    packetEl.value = JSON.stringify(result, null, 2);
    renderDesignScope(design);
  }

  [designInput, stateSelect, actorInput, noteInput, packetInput, answerInput, recordInput, beforeInput, afterInput, reasonInput, rollbackInput, replayInput, boundaryInput, questionInput, returnInput, blockInput].forEach((el) => {
    el.addEventListener("input", renderReceipt);
    el.addEventListener("change", renderReceipt);
  });

  runButton.addEventListener("click", renderReceipt);
  sampleButton.addEventListener("click", () => {
    loadSample();
    renderReceipt();
  });
  saveButton.addEventListener("click", () => {
    if (!activeReceipt) renderReceipt();
    receipts = [activeReceipt, ...receipts].slice(0, 24);
    writeReceiptStore(storeKey, receipts);
    renderSaved();
  });
  clearButton.addEventListener("click", () => {
    receipts = [];
    writeReceiptStore(storeKey, receipts);
    renderSaved();
  });
  copyButton.addEventListener("click", () => {
    packetEl.focus();
    packetEl.select();
    const original = copyButton.textContent;
    const done = () => {
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 1200);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(packetEl.value).then(done).catch(() => {});
      return;
    }
    try {
      document.execCommand("copy");
      done();
    } catch (error) {}
  });

  loadSample();
  renderChecks();
  renderSaved();
  renderReceipt();
}

if (typeof window !== "undefined") {
  window.vedapathAuditReceiptDryRun = {
    auditReceiptDryRun,
    auditReceiptSnapshot,
    receiptMissingForState,
    parseReceiptJson
  };
}
`);
}

function writeAuditPage() {
  write("auditreceiptdryrun.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Audit Receipt Dry Run</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-audit-receipt-dry-run.css">
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
            <span>Audit receipt dry run</span>
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

      <main class="workspace" aria-label="VedaPath Audit Receipt Dry Run workspace">
        <aside class="panel">
          <span class="eyebrow">Receipt restraint</span>
          <h2>Prove the receipt before the write</h2>
          <p class="muted">A storage design can create an audit receipt dry run. The receipt names the future packet, hashes, reason, rollback plan, and replay key while source data remains still.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Design</strong><p>Read storage gate.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Draft</strong><p>Name packet and hashes.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Check</strong><p>Confirm no write.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Export</strong><p>Copy receipt packet.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="storagedesigngate.html">Open Storage Design</a>
            <a class="button safe" href="releasereviewgate.html">Open Release Review</a>
          </div>
        </aside>

        <section class="panel receipt-app" id="auditReceiptDryRun">
          <div class="receipt-head">
            <div>
              <span class="eyebrow">Immutable audit receipt</span>
              <h1>Dry-run the receipt. Keep the data still.</h1>
              <p class="muted">This room proves the audit receipt shape for a future source-answer write without executing that write.</p>
            </div>
            <div class="receipt-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath audit receipt mark"></div>
          </div>

          <section class="receipt-layout">
            <div class="receipt-form">
              <h2>Audit Receipt Dry Run</h2>
              <label>Storage design packet<textarea id="receiptStorageDesign"></textarea></label>
              <label>Audit state<select id="receiptAuditState"></select></label>
              <label>Receipt actor<input id="receiptActor" type="text" placeholder="Audit dry-run reviewer"></label>
              <label>Receipt note<textarea id="receiptNote"></textarea></label>
              <label>Future packet id<input id="receiptPacketId" type="text"></label>
              <label>Source answer id<input id="receiptSourceAnswer" type="text"></label>
              <label>Source record id<input id="receiptSourceRecord" type="text"></label>
              <label>Before hash<input id="receiptBeforeHash" type="text"></label>
              <label>After hash<input id="receiptAfterHash" type="text"></label>
              <label>Reason<textarea id="receiptReason"></textarea></label>
              <label>Rollback receipt plan<textarea id="receiptRollbackPlan"></textarea></label>
              <label>Replay key<input id="receiptReplayKey" type="text"></label>
              <label>Write boundary<textarea id="receiptBoundary"></textarea></label>
              <label>Review question<textarea id="receiptReviewQuestion"></textarea></label>
              <label>Return reason<textarea id="receiptReturnReason"></textarea></label>
              <label>Block reason<textarea id="receiptBlockReason"></textarea></label>
              <div class="receipt-actions">
                <button class="button primary" id="runReceiptDryRun" type="button">Run Receipt</button>
                <button class="button safe" id="loadReceiptSample" type="button">Load Sample</button>
                <button class="button" id="saveReceiptDryRun" type="button">Save Local</button>
                <button class="button" id="clearReceiptDryRuns" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="receipt-result" id="receiptResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Storage Design Scope</h2>
                <div class="receipt-list" id="receiptDesignScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Receipt Checks</h2>
            <div class="receipt-rules" id="receiptChecks"></div>
          </section>

          <section class="receipt-layout">
            <div>
              <div class="receipt-actions">
                <button class="button safe" id="copyReceiptPacket" type="button">Copy Receipt Packet</button>
                <a class="button" href="data/vedapath-audit-receipt-dry-run.json">Open JSON</a>
              </div>
              <textarea class="receipt-packet" id="receiptPacket" aria-label="Audit receipt dry-run packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Receipts</h2>
              <div class="receipt-list" id="receiptSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Audit receipt</span>
          <h2 style="margin-top: 14px;">No-Write Proof</h2>
          <p class="muted">The receipt is immutable in shape but not a production event. It proves actor, reason, hash placeholders, rollback plan, replay key, and boundary.</p>
          <div class="progress" aria-label="Audit receipt dry run progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>5</strong></div>
            <div class="metric"><span>Writes</span><strong>False</strong></div>
            <div class="metric"><span>Store</span><strong>Local</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Receipt Rule</h2>
            <p class="muted">No source write is executed. The next release should prove rollback receipts against this dry-run receipt.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-audit-receipt-dry-run.js"></script>
  </body>
</html>
`);
}

function updateNavigationLinks() {
  let storage = read("storagedesigngate.html");
  if (!storage.includes("auditreceiptdryrun.html")) {
    storage = storage.replace(
      '<a class="button primary" href="releasereviewgate.html">Open Release Review</a>\n            <a class="button safe" href="productiondryrunaudit.html">Open Dry Run</a>',
      '<a class="button primary" href="auditreceiptdryrun.html">Open Audit Receipt</a>\n            <a class="button safe" href="releasereviewgate.html">Open Release Review</a>\n            <a class="button" href="productiondryrunaudit.html">Open Dry Run</a>'
    );
  }
  write("storagedesigngate.html", storage);
}

function updateIndex() {
  let content = read("index.html");
  if (!content.includes('auditreceiptdryrun.html">Audit receipt')) {
    content = content.replace(
      '<a href="storagedesigngate.html">Storage design <span>gate</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>',
      '<a href="storagedesigngate.html">Storage design <span>gate</span></a>\n              <a href="auditreceiptdryrun.html">Audit receipt <span>dry run</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>'
    );
    content = content.replace(
      '<a href="storagedesigngate.html">Storage gate <span>schema</span></a>\n            </div>',
      '<a href="storagedesigngate.html">Storage gate <span>schema</span></a>\n              <a href="auditreceiptdryrun.html">Audit receipt <span>proof</span></a>\n            </div>'
    );
  }
  content = content.replace(
    "audit receipts, rollback receipts, and production memory.",
    "rollback proof, replay receipts, and production memory."
  );
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = content
    .replace('<strong>v3.0.3</strong>\n          <p>Storage Design Gate: release-approved packets now define storage schema, immutable audit receipt, rollback receipt, replay rules, and write boundaries.</p>', '<strong>v3.0.4</strong>\n          <p>Audit Receipt Dry Run: ready storage designs now produce immutable receipt packets with before and after hashes, reason, rollback plan, replay key, and write boundary.</p>')
    .replace('<strong>85%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:85%"></div></div>\n          <p>The trust loop now has a storage design contract before any production write exists.</p>', '<strong>86%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:86%"></div></div>\n          <p>The trust loop now proves the audit receipt shape before any production write exists.</p>')
    .replace('<strong>Immutable audit receipt</strong>\n          <p>Create local audit receipt dry runs for future storage writes while canonical writes remain blocked.</p>', '<strong>Rollback receipt dry run</strong>\n          <p>Prove restore and discard behavior from audit receipts while canonical writes remain blocked.</p>')
    .replace('<div class="percent">85%</div>', '<div class="percent">86%</div>');

  const storagePhase = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 267: Storage Design Gate</strong>
                <p>Defines schema, immutable audit receipt, rollback receipt, replay rule, and write boundary while canonical writes stay blocked.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  const auditPhase = `${storagePhase}
            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 268: Audit Receipt Dry Run</strong>
                <p>Creates immutable receipt dry-run packets with actor, future packet id, before and after hashes, reason, rollback plan, replay key, and no-write boundary.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 268: Audit Receipt Dry Run")) {
    content = content.replace(storagePhase, auditPhase);
    content = content.replace("Phase 268: Production Implementation and Licensed Audio", "Phase 269: Production Implementation and Licensed Audio");
  }

  content = content
    .replace('<div class="version-row"><span>Release</span><strong>v3.0.3 Storage Design Gate</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.0.4 Audit Receipt Dry Run</strong></div>')
    .replace('<div class="version-row"><span>Previous</span><strong>v3.0.2 Release Review Gate</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.0.3 Storage Design Gate</strong></div>')
    .replace('<div class="version-row"><span>Goal</span><strong>Define storage controls before any canonical source write.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Prove immutable receipt behavior before any source storage write.</strong></div>')
    .replace('<div class="version-row"><span>Status</span><strong>Ready for immutable audit receipt dry run</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for rollback receipt dry run</strong></div>')
    .replace(`<li><span class="dot"></span><span>Create audit receipt dry run packets.</span></li>
              <li><span class="dot"></span><span>Add before and after hash placeholders.</span></li>
              <li><span class="dot"></span><span>Define receipt replay and rollback proof.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`, `<li><span class="dot"></span><span>Create rollback receipt dry-run packets.</span></li>
              <li><span class="dot"></span><span>Link rollback receipt to audit receipt id.</span></li>
              <li><span class="dot"></span><span>Verify restore and discard proof shape.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH AUDIT RECEIPT DRY RUN START -->", "<!-- VEDAPATH AUDIT RECEIPT DRY RUN END -->", `## ${release} Audit Receipt Dry Run

This release adds the immutable audit receipt dry-run layer after storage design.

- adds auditreceiptdryrun.html
- adds data/vedapath-audit-receipt-dry-run.json
- records actor, future packet id, before hash, after hash, reason, rollback plan, replay key, and write boundary
- keeps source_write_executed false, storage_write_enabled false, production_ready false, and canonical_write_allowed false
- sets the next release as rollback receipt dry run`, "<!-- VEDAPATH STORAGE DESIGN GATE START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH AUDIT RECEIPT DRY RUN NOTES START -->", "<!-- VEDAPATH AUDIT RECEIPT DRY RUN NOTES END -->", `## ${release} Audit Receipt Dry Run

This phase converts a ready storage design into an immutable audit receipt dry run.

Action taken:

- Added audit receipt dry-run schema.
- Added receipt states for draft, review, ready, return, and blocked.
- Required actor, packet id, source answer id, before hash, after hash, reason, rollback plan, replay key, and write boundary before ready.
- Added copyable audit receipt packets and local receipt memory.
- Preserved canonical source data.`, "<!-- VEDAPATH STORAGE DESIGN GATE NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH AUDIT RECEIPT DRY RUN BLUEPRINT START -->", "<!-- VEDAPATH AUDIT RECEIPT DRY RUN BLUEPRINT END -->", `### 287. Audit Receipt Dry Run

VedaPath should prove auditability before it stores anything.

Rules:

- Audit receipt dry run can start only from a ready storage design.
- A ready receipt must include actor, packet id, source answer id, before hash, after hash, reason, rollback plan, replay key, and write boundary.
- Receipt readiness is not production readiness.
- Source writes, storage writes, and canonical writes remain false in preview.
- The next build should dry-run rollback receipts against audit receipts.`, "<!-- VEDAPATH STORAGE DESIGN GATE BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/AUDIT_RECEIPT_DRY_RUN.md", `# VedaPath AI Audit Receipt Dry Run

Release: ${release}

This release adds the immutable audit receipt dry-run layer after storage design.

## Files

- data/vedapath-audit-receipt-dry-run.json
- auditreceiptdryrun.html
- assets/vedapath-audit-receipt-dry-run.css
- assets/vedapath-audit-receipt-dry-run.js

## What It Adds

The room:

- reads a storage design packet
- records audit receipt states
- names a future write packet without executing it
- requires before and after hash placeholders
- requires reason, rollback plan, replay key, and write boundary
- exports a copyable audit receipt packet
- stores local receipt history only

## Boundary

Audit receipt dry run is not production storage. No source write is executed. Production still requires rollback receipts, controlled storage, and final founder instruction.
`);
}

writeAuditData();
writeAuditCss();
writeAuditJs();
writeAuditPage();
updateAllHtmlShells();
updateNavigationLinks();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} audit receipt dry run applied.`);

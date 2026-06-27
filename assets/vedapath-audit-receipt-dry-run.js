const receiptRoot = document.getElementById("auditReceiptDryRun");

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

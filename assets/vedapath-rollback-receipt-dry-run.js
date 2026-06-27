const rollbackRoot = document.getElementById("rollbackReceiptDryRun");

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

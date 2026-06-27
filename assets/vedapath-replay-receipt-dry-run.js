const replayRoot = document.getElementById("replayReceiptDryRun");

if (replayRoot) {
  initReplayReceiptDryRun().catch((error) => {
    replayRoot.innerHTML = '<article class="replay-result"><strong>Replay receipt dry run could not load.</strong></article>';
    console.error(error);
  });
}

function replaySafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseReplayJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function replayMissingForState(config, replay) {
  const required = config.required_by_state?.[replay.replay_state] || [];
  return required.filter((field) => !String(replay[field] ?? "").trim());
}

function hasReplayHash(value) {
  return /^sha256:[a-z0-9._:-]{12,}$/i.test(String(value || "").trim());
}

function hasSourceSnapshot(value) {
  return /(source|snapshot|foundation|answer)/i.test(String(value || "")) && String(value || "").trim().length >= 12;
}

function hasReplaySequence(value) {
  const text = String(value || "");
  return /(load|compare|confirm|verify|replay)/i.test(text) && /(audit|rollback|source_answer_id|hash|source_write_executed)/i.test(text);
}

function hasDeterministicCheck(value) {
  const text = String(value || "");
  return /(same|deterministic|recreate|repeat)/i.test(text) && /(rollback_receipt_id|audit_receipt_id|source_answer_id|before_hash|after_hash|proof)/i.test(text);
}

function hasExpectedResult(value) {
  const text = String(value || "");
  return /(source_write_executed false|canonical_write_allowed false|storage_write_enabled false|no-write|no write)/i.test(text) && /(returns|result|expected|proof)/i.test(text);
}

function hasReplayVerification(value) {
  const text = String(value || "");
  return /(compare|confirm|verify|check)/i.test(text) && /(source_write_executed remains false|canonical source data remains unchanged|canonical_write_allowed remains false|no source write)/i.test(text);
}

function hasReplayKey(value) {
  return /(replay:|replay)/i.test(String(value || "")) && /(rollback|audit|source-answer|receipt|source)/i.test(String(value || ""));
}

function keepsReplayBoundary(value) {
  const text = String(value || "");
  const safe = /(dry run only|no source write|canonical_write_allowed remains false|storage_write_enabled remains false|writes remain blocked)/i.test(text);
  const unsafe = /(source write executed|write executed|storage_write_enabled true|canonical_write_allowed true|production write|changed source)/i.test(text);
  return safe && !unsafe;
}

function replayReceiptDryRun(config, rollbackReceipt, replay) {
  const missing = replayMissingForState(config, replay);
  const blocked = [];
  const warnings = [];
  const rollback = rollbackReceipt || {};
  const state = replay.replay_state || "Draft replay receipt";
  const ready = state === "Replay receipt ready";

  if (!rollbackReceipt || typeof rollbackReceipt !== "object" || Array.isArray(rollbackReceipt)) missing.push("rollback receipt");
  if (rollback.canonical_write_allowed !== false) blocked.push("rollback receipt must keep canonical_write_allowed false");
  if (rollback.production_ready === true) blocked.push("rollback receipt cannot already be production ready");
  if (rollback.storage_write_enabled !== false) blocked.push("rollback receipt must keep storage_write_enabled false");
  if (rollback.source_write_executed !== false) blocked.push("rollback receipt must keep source_write_executed false");
  if (ready && (rollback.rollback_status !== "Rollback receipt ready" || rollback.rollback_receipt_ready !== true)) blocked.push("rollback receipt is not ready");
  if (ready && !hasReplayHash(replay.before_hash)) blocked.push("before hash must be a sha256 placeholder");
  if (ready && !hasReplayHash(replay.after_hash)) blocked.push("after hash must be a sha256 placeholder");
  if (ready && replay.before_hash === replay.after_hash) blocked.push("before and after hashes must differ");
  if (ready && rollback.before_hash && replay.before_hash !== rollback.before_hash) blocked.push("before hash must match rollback receipt");
  if (ready && rollback.after_hash && replay.after_hash !== rollback.after_hash) blocked.push("after hash must match rollback receipt");
  if (ready && rollback.source_answer_id && replay.source_answer_id && replay.source_answer_id !== rollback.source_answer_id) blocked.push("source_answer_id must match rollback receipt");
  if (ready && rollback.audit_receipt_id && replay.audit_receipt_id && replay.audit_receipt_id !== rollback.audit_receipt_id) blocked.push("audit_receipt_id must match rollback receipt");
  if (ready && !hasSourceSnapshot(replay.source_snapshot_ref)) blocked.push("source snapshot reference must be explicit");
  if (ready && !hasReplaySequence(replay.replay_sequence)) blocked.push("replay sequence must be explicit");
  if (ready && !hasDeterministicCheck(replay.deterministic_check)) blocked.push("deterministic check must be explicit");
  if (ready && !hasExpectedResult(replay.expected_result)) blocked.push("expected result must prove no write");
  if (ready && !hasReplayVerification(replay.verification_step)) blocked.push("verification step must prove no source write");
  if (ready && !hasReplayKey(replay.replay_key)) blocked.push("replay key must include replay context");
  if (ready && !keepsReplayBoundary(replay.replay_boundary)) blocked.push("replay boundary must keep source writes blocked");
  if (Array.isArray(rollback.blocked) && rollback.blocked.length > 0) warnings.push("Rollback receipt still carries blocked items.");
  if (Array.isArray(rollback.warnings)) warnings.push(...rollback.warnings);

  const replay_status = missing.length || blocked.length ? "Blocked" : state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    replay_receipt_id: "replay-receipt-dry-run-" + Date.now(),
    replay_status,
    production_ready: false,
    canonical_write_allowed: false,
    storage_write_enabled: false,
    source_write_executed: false,
    replay_receipt_ready: replay_status === "Replay receipt ready",
    storage_control_required: true,
    rollback_receipt_id: replay.rollback_receipt_id || rollback.rollback_receipt_id || "",
    audit_receipt_id: replay.audit_receipt_id || rollback.audit_receipt_id || "",
    source_answer_id: replay.source_answer_id || rollback.source_answer_id || "",
    source_record_id: replay.source_record_id || rollback.source_record_id || "",
    source_family: rollback.source_family || "",
    replay_state: state,
    replay_actor: replay.replay_actor || "",
    replay_note: replay.replay_note || "",
    before_hash: replay.before_hash || "",
    after_hash: replay.after_hash || "",
    source_snapshot_ref: replay.source_snapshot_ref || "",
    replay_sequence: replay.replay_sequence || "",
    deterministic_check: replay.deterministic_check || "",
    expected_result: replay.expected_result || "",
    verification_step: replay.verification_step || "",
    replay_key: replay.replay_key || "",
    replay_boundary: replay.replay_boundary || "",
    review_question: replay.review_question || "",
    return_reason: replay.return_reason || "",
    block_reason: replay.block_reason || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.replay_policy
    ],
    rollback_receipt: rollback,
    created_at: new Date().toISOString()
  };
}

function replayReceiptSnapshot(receipts, config) {
  const byStatus = receipts.reduce((counts, receipt) => {
    const key = receipt.replay_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: receipts.length,
    replay_receipt_ready: byStatus["Replay receipt ready"] || 0,
    draft: byStatus["Draft replay receipt"] || 0,
    replay_review: byStatus["Needs replay review"] || 0,
    returned: byStatus["Return to rollback receipt"] || 0,
    blocked: byStatus.Blocked || 0,
    replay_receipt_blocked: byStatus["Replay receipt blocked"] || 0,
    receipts
  };
}

async function replayLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readReplayStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeReplayStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function replayCard(title, value, state = "") {
  return '<article class="replay-card ' + state + '"><span>' + replaySafe(title) + '</span><strong>' + replaySafe(value || "None") + '</strong></article>';
}

function renderReplayResult(target, packet) {
  const details = [
    ...(packet.missing || []).map((item) => "Missing: " + item),
    ...(packet.blocked || [])
  ];
  target.dataset.state = packet.replay_status;
  target.innerHTML = '<strong>' + replaySafe(packet.replay_status) + '</strong>' +
    '<p class="muted">Replay ready: ' + replaySafe(packet.replay_receipt_ready) + ' | Source write executed: ' + replaySafe(packet.source_write_executed) + '</p>' +
    '<div class="replay-grid">' +
      replayCard("Rollback receipt", packet.rollback_receipt_id, packet.replay_receipt_ready ? "ready" : "") +
      replayCard("Audit receipt", packet.audit_receipt_id) +
      replayCard("Source answer", packet.source_answer_id) +
      replayCard("Expected", packet.expected_result) +
    '</div>' +
    (details.length ? '<ul>' + details.map((item) => '<li>' + replaySafe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Chain ids, hashes, sequence, expected result, verification, replay, and boundary are aligned.</p>');
}

function renderReplayRules(target, config) {
  target.innerHTML = config.replay_checks.map((check) => (
    '<article class="replay-rule"><strong>' + replaySafe(check.check) + '</strong><span>' + replaySafe(check.rule) + '</span></article>'
  )).join("");
}

function renderReplayRollbackScope(target, rollback) {
  const rows = [
    ["Rollback status", rollback.rollback_status],
    ["Rollback ready", rollback.rollback_receipt_ready],
    ["Storage writes", rollback.storage_write_enabled],
    ["Source writes", rollback.source_write_executed],
    ["Audit receipt", rollback.audit_receipt_id],
    ["Boundary", rollback.rollback_boundary || "No boundary"]
  ];
  target.innerHTML = rows.map(([label, value]) => replayCard(label, value)).join("");
}

function renderSavedReplays(target, receipts) {
  target.innerHTML = receipts.slice().reverse().map((receipt) => (
    '<article class="replay-card ' + (receipt.replay_receipt_ready ? "ready" : "blocked") + '"><span>' + replaySafe(receipt.created_at || "") + '</span><strong>' + replaySafe(receipt.replay_status) + '</strong><span>' + replaySafe(receipt.source_answer_id || "") + '</span></article>'
  )).join("") || '<article class="replay-card"><strong>No replay receipts yet</strong><span>Run and save one replay proof to begin.</span></article>';
}

async function initReplayReceiptDryRun() {
  const config = await replayLoadJson("data/vedapath-replay-receipt-dry-run.json");
  const storeKey = config.local_replay_receipt_store;
  const stateSelect = replayRoot.querySelector("#replayState");
  const rollbackInput = replayRoot.querySelector("#replayRollbackReceipt");
  const actorInput = replayRoot.querySelector("#replayActor");
  const noteInput = replayRoot.querySelector("#replayNote");
  const rollbackIdInput = replayRoot.querySelector("#replayRollbackId");
  const auditIdInput = replayRoot.querySelector("#replayAuditId");
  const answerInput = replayRoot.querySelector("#replaySourceAnswer");
  const recordInput = replayRoot.querySelector("#replaySourceRecord");
  const beforeInput = replayRoot.querySelector("#replayBeforeHash");
  const afterInput = replayRoot.querySelector("#replayAfterHash");
  const snapshotInput = replayRoot.querySelector("#replaySnapshotRef");
  const sequenceInput = replayRoot.querySelector("#replaySequence");
  const deterministicInput = replayRoot.querySelector("#replayDeterministic");
  const expectedInput = replayRoot.querySelector("#replayExpectedResult");
  const verificationInput = replayRoot.querySelector("#replayVerification");
  const replayKeyInput = replayRoot.querySelector("#replayKey");
  const boundaryInput = replayRoot.querySelector("#replayBoundary");
  const questionInput = replayRoot.querySelector("#replayReviewQuestion");
  const returnInput = replayRoot.querySelector("#replayReturnReason");
  const blockInput = replayRoot.querySelector("#replayBlockReason");
  const resultTarget = replayRoot.querySelector("#replayResultCard");
  const rollbackScopeTarget = replayRoot.querySelector("#replayRollbackScope");
  const checksTarget = replayRoot.querySelector("#replayChecks");
  const packetTarget = replayRoot.querySelector("#replayPacket");
  const savedTarget = replayRoot.querySelector("#replaySaved");

  stateSelect.innerHTML = config.replay_states.map((state) => '<option>' + replaySafe(state) + '</option>').join("");

  function loadSample() {
    const sample = config.sample_replay;
    rollbackInput.value = JSON.stringify(config.sample_rollback_receipt, null, 2);
    stateSelect.value = sample.replay_state;
    actorInput.value = sample.replay_actor;
    noteInput.value = sample.replay_note;
    rollbackIdInput.value = sample.rollback_receipt_id;
    auditIdInput.value = sample.audit_receipt_id;
    answerInput.value = sample.source_answer_id;
    recordInput.value = sample.source_record_id;
    beforeInput.value = sample.before_hash;
    afterInput.value = sample.after_hash;
    snapshotInput.value = sample.source_snapshot_ref;
    sequenceInput.value = sample.replay_sequence;
    deterministicInput.value = sample.deterministic_check;
    expectedInput.value = sample.expected_result;
    verificationInput.value = sample.verification_step;
    replayKeyInput.value = sample.replay_key;
    boundaryInput.value = sample.replay_boundary;
    questionInput.value = sample.review_question;
    returnInput.value = sample.return_reason;
    blockInput.value = sample.block_reason;
  }

  function collectReplay() {
    return {
      replay_state: stateSelect.value,
      replay_actor: actorInput.value.trim(),
      replay_note: noteInput.value.trim(),
      rollback_receipt_id: rollbackIdInput.value.trim(),
      audit_receipt_id: auditIdInput.value.trim(),
      source_answer_id: answerInput.value.trim(),
      source_record_id: recordInput.value.trim(),
      before_hash: beforeInput.value.trim(),
      after_hash: afterInput.value.trim(),
      source_snapshot_ref: snapshotInput.value.trim(),
      replay_sequence: sequenceInput.value.trim(),
      deterministic_check: deterministicInput.value.trim(),
      expected_result: expectedInput.value.trim(),
      verification_step: verificationInput.value.trim(),
      replay_key: replayKeyInput.value.trim(),
      replay_boundary: boundaryInput.value.trim(),
      review_question: questionInput.value.trim(),
      return_reason: returnInput.value.trim(),
      block_reason: blockInput.value.trim()
    };
  }

  function currentPacket() {
    const rollback = parseReplayJson(rollbackInput.value, config.sample_rollback_receipt);
    return replayReceiptDryRun(config, rollback, collectReplay());
  }

  function render() {
    const rollback = parseReplayJson(rollbackInput.value, config.sample_rollback_receipt);
    const packet = currentPacket();
    renderReplayResult(resultTarget, packet);
    renderReplayRollbackScope(rollbackScopeTarget, rollback);
    renderReplayRules(checksTarget, config);
    packetTarget.value = JSON.stringify(packet, null, 2);
    renderSavedReplays(savedTarget, readReplayStore(storeKey));
  }

  replayRoot.querySelector("#loadReplaySample").addEventListener("click", () => {
    loadSample();
    render();
  });

  replayRoot.querySelector("#runReplayDryRun").addEventListener("click", render);

  replayRoot.querySelector("#saveReplayDryRun").addEventListener("click", () => {
    const receipts = readReplayStore(storeKey);
    receipts.push(currentPacket());
    writeReplayStore(storeKey, receipts);
    render();
  });

  replayRoot.querySelector("#clearReplayDryRuns").addEventListener("click", () => {
    writeReplayStore(storeKey, []);
    render();
  });

  replayRoot.querySelector("#copyReplayPacket").addEventListener("click", async () => {
    packetTarget.select();
    try {
      await navigator.clipboard.writeText(packetTarget.value);
    } catch (error) {
      document.execCommand("copy");
    }
  });

  [rollbackInput, stateSelect, actorInput, noteInput, rollbackIdInput, auditIdInput, answerInput, recordInput, beforeInput, afterInput, snapshotInput, sequenceInput, deterministicInput, expectedInput, verificationInput, replayKeyInput, boundaryInput, questionInput, returnInput, blockInput].forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  loadSample();
  render();
}

window.vedapathReplayReceiptDryRun = {
  replayReceiptDryRun,
  replayReceiptSnapshot,
  replayMissingForState,
  parseReplayJson
};

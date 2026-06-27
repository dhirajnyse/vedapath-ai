import fs from "node:fs";
import path from "node:path";

const release = "v3.0.6";
const badge = `${release} replay receipt`;

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

function rollbackReceiptData() {
  return JSON.parse(read("data/vedapath-rollback-receipt-dry-run.json"));
}

function sampleRollbackReceipt(config) {
  const rollback = config.sample_rollback || {};
  const audit = config.sample_audit_receipt || {};
  return {
    schema_version: config.schema_version,
    release: config.release,
    rollback_receipt_id: "rollback-receipt-sample-replay",
    rollback_status: "Rollback receipt ready",
    production_ready: false,
    canonical_write_allowed: false,
    storage_write_enabled: false,
    source_write_executed: false,
    rollback_receipt_ready: true,
    replay_receipt_required: true,
    audit_receipt_id: rollback.audit_receipt_id || audit.audit_receipt_id || "",
    source_answer_id: rollback.source_answer_id || audit.source_answer_id || "",
    source_record_id: rollback.source_record_id || audit.source_record_id || "",
    source_family: audit.source_family || "Bhagavad Gita | Smriti",
    packet_id: audit.packet_id || "",
    rollback_state: rollback.rollback_state || "Rollback receipt ready",
    rollback_actor: rollback.rollback_actor || "Rollback dry-run reviewer",
    rollback_note: rollback.rollback_note || "Prove restore and discard behavior before any write is allowed.",
    before_hash: rollback.before_hash || audit.before_hash || "",
    after_hash: rollback.after_hash || audit.after_hash || "",
    restore_action: rollback.restore_action || "Restore to before_hash.",
    discard_action: rollback.discard_action || "Discard after_hash packet.",
    rollback_reason: rollback.rollback_reason || "Prove a future write can be undone before storage writes are allowed.",
    verification_step: rollback.verification_step || "Confirm source_write_executed remains false.",
    replay_key: rollback.replay_key || "replay:source-answer:answer-steady-action-bg-2-48:receipt-dry-run:rollback",
    rollback_boundary: rollback.rollback_boundary || "Dry run only; no source write occurs, canonical_write_allowed remains false, and storage_write_enabled remains false.",
    missing: [],
    blocked: [],
    warnings: [
      "Replay receipt dry run only; not production write approval.",
      config.rollback_policy
    ],
    audit_receipt: audit,
    created_at: "2026-06-27T00:00:00.000Z"
  };
}

function writeReplayData() {
  const rollbackConfig = rollbackReceiptData();
  const rollback = sampleRollbackReceipt(rollbackConfig);
  const replay = {
    replay_state: "Replay receipt ready",
    replay_actor: "Replay dry-run reviewer",
    replay_note: "Replay the audit and rollback chain without touching source data.",
    rollback_receipt_id: rollback.rollback_receipt_id,
    audit_receipt_id: rollback.audit_receipt_id,
    source_answer_id: rollback.source_answer_id,
    source_record_id: rollback.source_record_id,
    before_hash: rollback.before_hash,
    after_hash: rollback.after_hash,
    source_snapshot_ref: "source-answer-foundation:answer-steady-action-bg-2-48@preview",
    replay_sequence: "1. Load audit receipt. 2. Load rollback receipt. 3. Compare source_answer_id and hash pair. 4. Confirm source_write_executed remains false.",
    deterministic_check: "The same audit_receipt_id, rollback_receipt_id, source_answer_id, before_hash, and after_hash recreate the same no-write proof.",
    expected_result: "Replay returns rollback_receipt_ready true, source_write_executed false, canonical_write_allowed false, and storage_write_enabled false.",
    verification_step: "Compare chain ids and hash pair; confirm source_write_executed remains false and canonical source data remains unchanged.",
    replay_key: `${rollback.replay_key}:replay`,
    replay_boundary: "Dry run only; no source write occurs, canonical_write_allowed remains false, and storage_write_enabled remains false.",
    review_question: "",
    return_reason: "",
    block_reason: ""
  };

  write("data/vedapath-replay-receipt-dry-run.json", JSON.stringify({
    product: "VedaPath AI",
    release,
    status: "replay receipt dry run v1",
    schema_version: "replay-receipt-dry-run-v1",
    rollback_receipt_dataset: "data/vedapath-rollback-receipt-dry-run.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_replay_receipt_store: "vedapath-replay-receipt-dry-run-v1",
    warning: "This gate dry-runs replay receipts only. It does not write canonical source records, execute storage writes, create accounts, bypass reviewer approval, provide therapy, give ritual instruction, or become spiritual authority.",
    replay_policy: "A replay receipt can be marked ready only from a ready rollback receipt. It must prove chain ids, hash pair, source snapshot, deterministic sequence, expected result, verification, replay key, and boundary while source writes remain false.",
    replay_states: [
      "Draft replay receipt",
      "Needs replay review",
      "Replay receipt ready",
      "Return to rollback receipt",
      "Replay receipt blocked"
    ],
    required_by_state: {
      "Draft replay receipt": ["replay_actor", "replay_note"],
      "Needs replay review": ["replay_actor", "replay_note", "review_question"],
      "Replay receipt ready": [
        "replay_actor",
        "replay_note",
        "rollback_receipt_id",
        "audit_receipt_id",
        "source_answer_id",
        "before_hash",
        "after_hash",
        "source_snapshot_ref",
        "replay_sequence",
        "deterministic_check",
        "expected_result",
        "verification_step",
        "replay_key",
        "replay_boundary"
      ],
      "Return to rollback receipt": ["replay_actor", "replay_note", "return_reason"],
      "Replay receipt blocked": ["replay_actor", "replay_note", "block_reason"]
    },
    replay_checks: [
      { check: "Rollback receipt", rule: "Input rollback receipt must be ready and still no-write." },
      { check: "Chain ids", rule: "Replay names rollback, audit, and source answer ids." },
      { check: "Hash pair", rule: "Replay repeats before and after hashes." },
      { check: "Source snapshot", rule: "Replay points to a stable source snapshot reference." },
      { check: "Determinism", rule: "Replay says why the same packet produces the same proof." },
      { check: "Expected result", rule: "Replay declares the no-write result it expects." },
      { check: "Boundary", rule: "Replay does not imply production storage readiness." }
    ],
    sample_rollback_receipt: rollback,
    sample_replay: replay
  }, null, 2));
}

function writeReplayCss() {
  write("assets/vedapath-replay-receipt-dry-run.css", `/* VedaPath replay receipt dry run */
.replay-app,
.replay-head,
.replay-layout,
.replay-form,
.replay-grid,
.replay-list,
.replay-actions,
.replay-rules {
  display: grid;
  gap: 10px;
}

.replay-app {
  gap: 16px;
}

.replay-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.replay-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.replay-mark img {
  display: block;
  width: 100%;
}

.replay-layout {
  grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
  align-items: start;
}

.replay-form,
.replay-card,
.replay-result,
.replay-packet,
.replay-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.replay-form,
.replay-card,
.replay-result,
.replay-rule {
  padding: 12px;
}

.replay-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.replay-form input,
.replay-form select,
.replay-form textarea,
.replay-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.replay-form textarea,
.replay-packet {
  min-height: 112px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.replay-grid,
.replay-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.replay-card,
.replay-result {
  border-left: 4px solid var(--gold);
}

.replay-card.ready,
.replay-result[data-state="Replay receipt ready"] {
  border-left-color: var(--green);
}

.replay-card.blocked,
.replay-result[data-state="Blocked"],
.replay-result[data-state="Return to rollback receipt"],
.replay-result[data-state="Replay receipt blocked"] {
  border-left-color: var(--ochre);
}

.replay-card span,
.replay-card strong,
.replay-rule span,
.replay-rule strong {
  display: block;
}

.replay-card span,
.replay-rule span {
  color: var(--muted);
  font-size: 12px;
}

.replay-result strong {
  display: block;
  font-size: 24px;
}

.replay-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.replay-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.replay-list {
  max-height: 320px;
  overflow: auto;
}

.replay-packet {
  min-height: 260px;
}

@media (max-width: 980px) {
  .replay-layout,
  .replay-head,
  .replay-grid,
  .replay-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .replay-actions {
    grid-template-columns: 1fr;
  }
}
`);
}

function writeReplayJs() {
  write("assets/vedapath-replay-receipt-dry-run.js", `const replayRoot = document.getElementById("replayReceiptDryRun");

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
`);
}

function writeReplayPage() {
  write("replayreceiptdryrun.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Replay Receipt Dry Run</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-replay-receipt-dry-run.css">
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
            <span>Replay receipt dry run</span>
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

      <main class="workspace" aria-label="VedaPath Replay Receipt Dry Run workspace">
        <aside class="panel">
          <span class="eyebrow">Replay restraint</span>
          <h2>Repeat the proof without changing the source</h2>
          <p class="muted">A replay receipt dry run proves the audit and rollback chain can be repeated from stable ids, hashes, source snapshot, expected result, and boundary.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Chain</strong><p>Read rollback.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Snapshot</strong><p>Name source state.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Replay</strong><p>Repeat proof.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Verify</strong><p>Confirm no write.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="rollbackreceiptdryrun.html">Open Rollback Receipt</a>
            <a class="button safe" href="auditreceiptdryrun.html">Open Audit Receipt</a>
          </div>
        </aside>

        <section class="panel replay-app" id="replayReceiptDryRun">
          <div class="replay-head">
            <div>
              <span class="eyebrow">Replay receipt</span>
              <h1>Replay the proof. Keep the source still.</h1>
              <p class="muted">This room proves repeatability from audit plus rollback receipts without executing a source write.</p>
            </div>
            <div class="replay-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath replay receipt mark"></div>
          </div>

          <section class="replay-layout">
            <div class="replay-form">
              <h2>Replay Receipt Dry Run</h2>
              <label>Rollback receipt packet<textarea id="replayRollbackReceipt"></textarea></label>
              <label>Replay state<select id="replayState"></select></label>
              <label>Replay actor<input id="replayActor" type="text" placeholder="Replay dry-run reviewer"></label>
              <label>Replay note<textarea id="replayNote"></textarea></label>
              <label>Rollback receipt id<input id="replayRollbackId" type="text"></label>
              <label>Audit receipt id<input id="replayAuditId" type="text"></label>
              <label>Source answer id<input id="replaySourceAnswer" type="text"></label>
              <label>Source record id<input id="replaySourceRecord" type="text"></label>
              <label>Before hash<input id="replayBeforeHash" type="text"></label>
              <label>After hash<input id="replayAfterHash" type="text"></label>
              <label>Source snapshot ref<input id="replaySnapshotRef" type="text"></label>
              <label>Replay sequence<textarea id="replaySequence"></textarea></label>
              <label>Deterministic check<textarea id="replayDeterministic"></textarea></label>
              <label>Expected result<textarea id="replayExpectedResult"></textarea></label>
              <label>Verification step<textarea id="replayVerification"></textarea></label>
              <label>Replay key<input id="replayKey" type="text"></label>
              <label>Replay boundary<textarea id="replayBoundary"></textarea></label>
              <label>Review question<textarea id="replayReviewQuestion"></textarea></label>
              <label>Return reason<textarea id="replayReturnReason"></textarea></label>
              <label>Block reason<textarea id="replayBlockReason"></textarea></label>
              <div class="replay-actions">
                <button class="button primary" id="runReplayDryRun" type="button">Run Replay</button>
                <button class="button safe" id="loadReplaySample" type="button">Load Sample</button>
                <button class="button" id="saveReplayDryRun" type="button">Save Local</button>
                <button class="button" id="clearReplayDryRuns" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="replay-result" id="replayResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Rollback Receipt Scope</h2>
                <div class="replay-list" id="replayRollbackScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Replay Checks</h2>
            <div class="replay-rules" id="replayChecks"></div>
          </section>

          <section class="replay-layout">
            <div>
              <div class="replay-actions">
                <button class="button safe" id="copyReplayPacket" type="button">Copy Replay Packet</button>
                <a class="button" href="data/vedapath-replay-receipt-dry-run.json">Open JSON</a>
              </div>
              <textarea class="replay-packet" id="replayPacket" aria-label="Replay receipt dry-run packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Replays</h2>
              <div class="replay-list" id="replaySaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Replay proof</span>
          <h2 style="margin-top: 14px;">Repeatable Trust</h2>
          <p class="muted">The replay receipt proves the same chain produces the same no-write result.</p>
          <div class="progress" aria-label="Replay receipt dry run progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>5</strong></div>
            <div class="metric"><span>Writes</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Storage</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Replay Rule</h2>
            <p class="muted">No source write is executed. The next release should define controlled storage entry criteria from replay proof.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-replay-receipt-dry-run.js"></script>
  </body>
</html>
`);
}

function updateNavigationLinks() {
  let rollback = read("rollbackreceiptdryrun.html");
  if (!rollback.includes("replayreceiptdryrun.html")) {
    rollback = rollback.replace(
      '<a class="button primary" href="auditreceiptdryrun.html">Open Audit Receipt</a>\n            <a class="button safe" href="storagedesigngate.html">Open Storage Design</a>',
      '<a class="button primary" href="replayreceiptdryrun.html">Open Replay Receipt</a>\n            <a class="button safe" href="auditreceiptdryrun.html">Open Audit Receipt</a>\n            <a class="button" href="storagedesigngate.html">Open Storage Design</a>'
    );
    rollback = rollback.replace(
      "The next release should prove replay receipts from audit plus rollback packets.",
      "Replay receipts can now prove the audit plus rollback chain before storage criteria begin."
    );
    write("rollbackreceiptdryrun.html", rollback);
  }
}

function updateIndex() {
  let content = read("index.html");
  if (!content.includes('replayreceiptdryrun.html">Replay receipt')) {
    content = content
      .replace(
        '<a href="rollbackreceiptdryrun.html">Rollback receipt <span>dry run</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>',
        '<a href="rollbackreceiptdryrun.html">Rollback receipt <span>dry run</span></a>\n              <a href="replayreceiptdryrun.html">Replay receipt <span>dry run</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>'
      )
      .replace(
        '<a href="rollbackreceiptdryrun.html">Rollback receipt <span>proof</span></a>\n            </div>',
        '<a href="rollbackreceiptdryrun.html">Rollback receipt <span>proof</span></a>\n              <a href="replayreceiptdryrun.html">Replay receipt <span>proof</span></a>\n            </div>'
      );
  }
  content = content.replace(
    "replay proof, controlled storage, and production memory.",
    "controlled storage, source promotion, and production memory."
  );
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = updateVersionBadge(content)
    .replace('<strong>v3.0.5</strong>\n          <p>Rollback Receipt Dry Run: audit-ready receipts now prove restore action, discard action, verification, replay key, and rollback boundary before any source write.</p>', '<strong>v3.0.6</strong>\n          <p>Replay Receipt Dry Run: rollback-ready receipts now prove deterministic chain replay, source snapshot, expected result, verification, replay key, and no-write boundary.</p>')
    .replace('<strong>87%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:87%"></div></div>\n          <p>The trust loop now proves rollback behavior before any production write exists.</p>', '<strong>88%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:88%"></div></div>\n          <p>The trust loop now proves repeatable replay before any production write exists.</p>')
    .replace('<strong>Replay receipt dry run</strong>\n          <p>Prove repeatable replay from audit and rollback receipts while canonical writes remain blocked.</p>', '<strong>Controlled storage entry criteria</strong>\n          <p>Define the final entry checklist for controlled storage while canonical writes remain blocked.</p>')
    .replace('<div class="percent">87%</div>', '<div class="percent">88%</div>');

  const replayPhase = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 270: Replay Receipt Dry Run</strong>
                <p>Proves deterministic replay from audit and rollback packets with source snapshot, expected result, verification, replay key, and no-write boundary.</p>
              </div>
              <span class="percent">100%</span>
            </article>
`;
  if (!content.includes("Phase 270: Replay Receipt Dry Run")) {
    content = content.replace(
      `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 270: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
      `${replayPhase}            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 271: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
  }

  content = content
    .replace('<div class="version-row"><span>Release</span><strong>v3.0.5 Rollback Receipt Dry Run</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.0.6 Replay Receipt Dry Run</strong></div>')
    .replace('<div class="version-row"><span>Previous</span><strong>v3.0.4 Audit Receipt Dry Run</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.0.5 Rollback Receipt Dry Run</strong></div>')
    .replace('<div class="version-row"><span>Goal</span><strong>Prove rollback behavior before any source storage write.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Prove repeatable replay before any source storage write.</strong></div>')
    .replace('<div class="version-row"><span>Status</span><strong>Ready for replay receipt dry run</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled storage entry criteria</strong></div>')
    .replace(`<li><span class="dot"></span><span>Create replay receipt dry-run packets.</span></li>
              <li><span class="dot"></span><span>Link replay to audit and rollback receipt ids.</span></li>
              <li><span class="dot"></span><span>Verify deterministic replay proof shape.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`, `<li><span class="dot"></span><span>Define controlled storage entry criteria.</span></li>
              <li><span class="dot"></span><span>Require audit, rollback, and replay receipts.</span></li>
              <li><span class="dot"></span><span>Define promotion-blocking failure states.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH REPLAY RECEIPT DRY RUN START -->", "<!-- VEDAPATH REPLAY RECEIPT DRY RUN END -->", `## ${release} Replay Receipt Dry Run

This release adds the replay receipt dry-run layer after rollback receipts.

- adds replayreceiptdryrun.html
- adds data/vedapath-replay-receipt-dry-run.json
- records chain ids, source snapshot ref, replay sequence, deterministic check, expected result, verification, replay key, and boundary
- keeps source_write_executed false, storage_write_enabled false, production_ready false, and canonical_write_allowed false
- sets the next release as controlled storage entry criteria`, "<!-- VEDAPATH ROLLBACK RECEIPT DRY RUN START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH REPLAY RECEIPT DRY RUN NOTES START -->", "<!-- VEDAPATH REPLAY RECEIPT DRY RUN NOTES END -->", `## ${release} Replay Receipt Dry Run

This phase converts a ready rollback receipt into a replay receipt dry run.

Action taken:

- Added replay receipt dry-run schema.
- Added receipt states for draft, review, ready, return, and blocked.
- Required chain ids, source snapshot, deterministic sequence, expected result, verification, replay key, and boundary before ready.
- Added copyable replay receipt packets and local replay memory.
- Preserved canonical source data.`, "<!-- VEDAPATH ROLLBACK RECEIPT DRY RUN NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH REPLAY RECEIPT DRY RUN BLUEPRINT START -->", "<!-- VEDAPATH REPLAY RECEIPT DRY RUN BLUEPRINT END -->", `### 289. Replay Receipt Dry Run

VedaPath should prove repeatability before it stores anything.

Rules:

- Replay receipt dry run can start only from a ready rollback receipt.
- A ready replay must include chain ids, source snapshot, deterministic sequence, expected result, verification, replay key, and boundary.
- Replay readiness is not production readiness.
- Source writes, storage writes, and canonical writes remain false in preview.
- The next build should define controlled storage entry criteria from the full receipt chain.`, "<!-- VEDAPATH ROLLBACK RECEIPT DRY RUN BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/REPLAY_RECEIPT_DRY_RUN.md", `# VedaPath AI Replay Receipt Dry Run

Release: ${release}

This release adds the replay receipt dry-run layer after rollback receipts.

## Files

- data/vedapath-replay-receipt-dry-run.json
- replayreceiptdryrun.html
- assets/vedapath-replay-receipt-dry-run.css
- assets/vedapath-replay-receipt-dry-run.js

## What It Adds

The room:

- reads a rollback receipt packet
- records replay states
- checks rollback, audit, and source-answer ids
- repeats the before and after hash pair
- requires a source snapshot reference
- requires deterministic replay and expected no-write result
- exports a copyable replay receipt packet
- stores local replay history only

## Boundary

Replay receipt dry run is not production storage. No source write is executed. Production still requires controlled storage criteria, durable identity, source-owner authority, and final founder instruction.
`);
}

writeReplayData();
writeReplayCss();
writeReplayJs();
writeReplayPage();
updateAllHtmlShells();
updateNavigationLinks();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} replay receipt dry run applied.`);

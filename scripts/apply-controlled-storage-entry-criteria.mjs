import fs from "node:fs";
import path from "node:path";

const release = "v3.0.7";
const badge = `${release} storage criteria`;

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

function replayReceiptData() {
  return JSON.parse(read("data/vedapath-replay-receipt-dry-run.json"));
}

function sampleReplayReceipt(config) {
  const replay = config.sample_replay || {};
  const rollback = config.sample_rollback_receipt || {};
  return {
    schema_version: config.schema_version,
    release: config.release,
    replay_receipt_id: "replay-receipt-sample-storage-entry",
    replay_status: "Replay receipt ready",
    production_ready: false,
    canonical_write_allowed: false,
    storage_write_enabled: false,
    source_write_executed: false,
    replay_receipt_ready: true,
    storage_control_required: true,
    rollback_receipt_id: replay.rollback_receipt_id || rollback.rollback_receipt_id || "",
    audit_receipt_id: replay.audit_receipt_id || rollback.audit_receipt_id || "",
    source_answer_id: replay.source_answer_id || rollback.source_answer_id || "",
    source_record_id: replay.source_record_id || rollback.source_record_id || "",
    source_family: rollback.source_family || "Bhagavad Gita | Smriti",
    before_hash: replay.before_hash || rollback.before_hash || "",
    after_hash: replay.after_hash || rollback.after_hash || "",
    source_snapshot_ref: replay.source_snapshot_ref || "source-answer-foundation:answer-steady-action-bg-2-48@preview",
    replay_sequence: replay.replay_sequence || "",
    deterministic_check: replay.deterministic_check || "",
    expected_result: replay.expected_result || "",
    verification_step: replay.verification_step || "",
    replay_key: replay.replay_key || "",
    replay_boundary: replay.replay_boundary || "Dry run only; no source write occurs, canonical_write_allowed remains false, and storage_write_enabled remains false.",
    missing: [],
    blocked: [],
    warnings: [
      "Storage criteria only; not production storage approval.",
      config.replay_policy
    ],
    rollback_receipt: rollback,
    created_at: "2026-06-27T00:00:00.000Z"
  };
}

function writeCriteriaData() {
  const replayConfig = replayReceiptData();
  const replayReceipt = sampleReplayReceipt(replayConfig);
  const sampleCriteria = {
    criteria_state: "Entry criteria ready",
    criteria_actor: "Storage criteria reviewer",
    criteria_note: "Define the entry gate from replay proof without enabling storage writes.",
    replay_receipt_id: replayReceipt.replay_receipt_id,
    rollback_receipt_id: replayReceipt.rollback_receipt_id,
    audit_receipt_id: replayReceipt.audit_receipt_id,
    source_answer_id: replayReceipt.source_answer_id,
    source_record_id: replayReceipt.source_record_id,
    source_family: replayReceipt.source_family,
    immutable_audit_receipt: "Required: immutable audit receipt with actor, packet id, before hash, after hash, reason, and no-write boundary.",
    rollback_receipt_rule: "Required: rollback receipt proves restore action, discard action, verification, and rollback boundary.",
    replay_receipt_rule: "Required: replay receipt proves deterministic chain replay from audit and rollback receipts.",
    source_owner_scope: "Required: source owner scope is explicit and excludes canonical citation or rights-sensitive fields until final approval.",
    reviewer_identity_rule: "Required: durable reviewer identity and second-review rule exist before storage entry.",
    schema_contract_rule: "Required: storage schema separates draft packets, audit receipts, rollback receipts, replay receipts, and canonical source records.",
    consent_delete_rule: "Required: consent, export, deletion, and local-memory boundaries are visible before any durable user-linked storage.",
    failure_state_rule: "Required: missing receipt, hash mismatch, owner ambiguity, unsafe boundary, or founder hold blocks entry.",
    rollback_rehearsal_rule: "Required: rehearsal shows rollback can restore before_hash and discard after_hash without changing canonical data.",
    founder_instruction_rule: "Founder instruction is required before real storage entry; not granted in this preview build.",
    entry_boundary: "Criteria only; controlled_storage_entry_allowed remains false, canonical_write_allowed remains false, storage_write_enabled remains false, and source_write_executed remains false.",
    review_question: "",
    return_reason: "",
    block_reason: ""
  };

  write("data/vedapath-controlled-storage-entry-criteria.json", JSON.stringify({
    product: "VedaPath AI",
    release,
    status: "controlled storage entry criteria v1",
    schema_version: "controlled-storage-entry-criteria-v1",
    replay_receipt_dataset: "data/vedapath-replay-receipt-dry-run.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_criteria_store: "vedapath-controlled-storage-entry-criteria-v1",
    warning: "This release defines storage entry criteria only. It does not write canonical source records, enable storage writes, create accounts, bypass reviewer approval, provide therapy, give ritual instruction, or become spiritual authority.",
    criteria_policy: "Entry criteria can be marked ready only from a ready replay receipt. The criteria packet must prove complete receipt chain, source-owner scope, reviewer identity, schema contract, consent and deletion rules, failure states, rollback rehearsal, founder-instruction boundary, and no-write entry boundary.",
    criteria_states: [
      "Draft criteria",
      "Needs criteria review",
      "Entry criteria ready",
      "Return to replay receipt",
      "Entry criteria blocked"
    ],
    required_by_state: {
      "Draft criteria": ["criteria_actor", "criteria_note"],
      "Needs criteria review": ["criteria_actor", "criteria_note", "review_question"],
      "Entry criteria ready": [
        "criteria_actor",
        "criteria_note",
        "replay_receipt_id",
        "rollback_receipt_id",
        "audit_receipt_id",
        "source_answer_id",
        "immutable_audit_receipt",
        "rollback_receipt_rule",
        "replay_receipt_rule",
        "source_owner_scope",
        "reviewer_identity_rule",
        "schema_contract_rule",
        "consent_delete_rule",
        "failure_state_rule",
        "rollback_rehearsal_rule",
        "founder_instruction_rule",
        "entry_boundary"
      ],
      "Return to replay receipt": ["criteria_actor", "criteria_note", "return_reason"],
      "Entry criteria blocked": ["criteria_actor", "criteria_note", "block_reason"]
    },
    criteria_checks: [
      { check: "Receipt chain", rule: "Audit, rollback, and replay receipts are all named and ready." },
      { check: "No-write proof", rule: "Replay receipt still has source_write_executed, storage_write_enabled, and canonical_write_allowed false." },
      { check: "Owner scope", rule: "Source-owner scope is explicit before any controlled storage path." },
      { check: "Reviewer identity", rule: "Durable reviewer and second-review rules are defined before storage entry." },
      { check: "Schema contract", rule: "Drafts, receipts, replay, and canonical records remain separated." },
      { check: "Consent and deletion", rule: "User-linked storage requires consent, export, and deletion boundaries." },
      { check: "Failure states", rule: "Missing receipts, hash mismatch, unsafe boundary, or founder hold block entry." },
      { check: "Founder instruction", rule: "Final founder instruction remains required before any real storage entry." }
    ],
    sample_replay_receipt: replayReceipt,
    sample_criteria: sampleCriteria
  }, null, 2));
}

function writeCriteriaCss() {
  write("assets/vedapath-controlled-storage-entry-criteria.css", `/* VedaPath controlled storage entry criteria */
.criteria-app,
.criteria-head,
.criteria-layout,
.criteria-form,
.criteria-grid,
.criteria-list,
.criteria-actions,
.criteria-rules {
  display: grid;
  gap: 10px;
}

.criteria-app {
  gap: 16px;
}

.criteria-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.criteria-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.criteria-mark img {
  display: block;
  width: 100%;
}

.criteria-layout {
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  align-items: start;
}

.criteria-form,
.criteria-card,
.criteria-result,
.criteria-packet,
.criteria-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.criteria-form,
.criteria-card,
.criteria-result,
.criteria-rule {
  padding: 12px;
}

.criteria-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.criteria-form input,
.criteria-form select,
.criteria-form textarea,
.criteria-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.criteria-form textarea,
.criteria-packet {
  min-height: 104px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.criteria-grid,
.criteria-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.criteria-card,
.criteria-result {
  border-left: 4px solid var(--gold);
}

.criteria-card.ready,
.criteria-result[data-state="Entry criteria ready"] {
  border-left-color: var(--green);
}

.criteria-card.blocked,
.criteria-result[data-state="Blocked"],
.criteria-result[data-state="Return to replay receipt"],
.criteria-result[data-state="Entry criteria blocked"] {
  border-left-color: var(--ochre);
}

.criteria-card span,
.criteria-card strong,
.criteria-rule span,
.criteria-rule strong {
  display: block;
}

.criteria-card span,
.criteria-rule span {
  color: var(--muted);
  font-size: 12px;
}

.criteria-result strong {
  display: block;
  font-size: 24px;
}

.criteria-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.criteria-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.criteria-list {
  max-height: 320px;
  overflow: auto;
}

.criteria-packet {
  min-height: 260px;
}

@media (max-width: 980px) {
  .criteria-layout,
  .criteria-head,
  .criteria-grid,
  .criteria-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .criteria-actions {
    grid-template-columns: 1fr;
  }
}
`);
}

function writeCriteriaJs() {
  write("assets/vedapath-controlled-storage-entry-criteria.js", `const criteriaRoot = document.getElementById("controlledStorageEntryCriteria");

if (criteriaRoot) {
  initControlledStorageEntryCriteria().catch((error) => {
    criteriaRoot.innerHTML = '<article class="criteria-result"><strong>Storage criteria could not load.</strong></article>';
    console.error(error);
  });
}

function criteriaSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseCriteriaJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function criteriaMissingForState(config, criteria) {
  const required = config.required_by_state?.[criteria.criteria_state] || [];
  return required.filter((field) => !String(criteria[field] ?? "").trim());
}

function hasCriteriaText(value, words) {
  const text = String(value || "").toLowerCase();
  return words.every((group) => group.some((word) => text.includes(word)));
}

function keepsEntryBoundary(value) {
  const text = String(value || "");
  const safe = /(criteria only|controlled_storage_entry_allowed remains false|canonical_write_allowed remains false|storage_write_enabled remains false|source_write_executed remains false|no source write)/i.test(text);
  const unsafe = /(controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|production write|write enabled)/i.test(text);
  return safe && !unsafe;
}

function replayReceiptReady(receipt) {
  return receipt &&
    receipt.replay_status === "Replay receipt ready" &&
    receipt.replay_receipt_ready === true &&
    receipt.production_ready === false &&
    receipt.canonical_write_allowed === false &&
    receipt.storage_write_enabled === false &&
    receipt.source_write_executed === false;
}

function controlledStorageEntryCriteria(config, replayReceipt, criteria) {
  const missing = criteriaMissingForState(config, criteria);
  const blocked = [];
  const warnings = [];
  const replay = replayReceipt || {};
  const state = criteria.criteria_state || "Draft criteria";
  const ready = state === "Entry criteria ready";

  if (!replayReceipt || typeof replayReceipt !== "object" || Array.isArray(replayReceipt)) missing.push("replay receipt");
  if (replay.production_ready === true) blocked.push("replay receipt cannot already be production ready");
  if (replay.canonical_write_allowed !== false) blocked.push("replay receipt must keep canonical_write_allowed false");
  if (replay.storage_write_enabled !== false) blocked.push("replay receipt must keep storage_write_enabled false");
  if (replay.source_write_executed !== false) blocked.push("replay receipt must keep source_write_executed false");
  if (ready && !replayReceiptReady(replay)) blocked.push("replay receipt is not ready");
  if (ready && replay.replay_receipt_id && criteria.replay_receipt_id && criteria.replay_receipt_id !== replay.replay_receipt_id) blocked.push("replay receipt id must match input receipt");
  if (ready && replay.rollback_receipt_id && criteria.rollback_receipt_id && criteria.rollback_receipt_id !== replay.rollback_receipt_id) blocked.push("rollback receipt id must match replay receipt");
  if (ready && replay.audit_receipt_id && criteria.audit_receipt_id && criteria.audit_receipt_id !== replay.audit_receipt_id) blocked.push("audit receipt id must match replay receipt");
  if (ready && replay.source_answer_id && criteria.source_answer_id && criteria.source_answer_id !== replay.source_answer_id) blocked.push("source answer id must match replay receipt");
  if (ready && !hasCriteriaText(criteria.immutable_audit_receipt, [["audit"], ["immutable", "receipt"], ["actor", "packet", "hash"]])) blocked.push("immutable audit receipt rule is too vague");
  if (ready && !hasCriteriaText(criteria.rollback_receipt_rule, [["rollback"], ["restore", "discard"], ["verification", "boundary"]])) blocked.push("rollback receipt rule must name restore, discard, verification, and boundary");
  if (ready && !hasCriteriaText(criteria.replay_receipt_rule, [["replay"], ["deterministic", "repeat"], ["audit", "rollback"]])) blocked.push("replay receipt rule must prove deterministic chain replay");
  if (ready && !hasCriteriaText(criteria.source_owner_scope, [["source owner", "owner"], ["scope"], ["exclude", "blocked", "canonical", "rights"]])) blocked.push("source-owner scope must exclude blocked canonical or rights-sensitive fields");
  if (ready && !hasCriteriaText(criteria.reviewer_identity_rule, [["reviewer"], ["identity", "durable"], ["second", "review"]])) blocked.push("reviewer identity rule must include durable identity and second review");
  if (ready && !hasCriteriaText(criteria.schema_contract_rule, [["schema"], ["draft", "receipt"], ["canonical"]])) blocked.push("schema contract must separate drafts, receipts, and canonical records");
  if (ready && !hasCriteriaText(criteria.consent_delete_rule, [["consent"], ["export", "deletion", "delete"], ["user", "memory", "storage"]])) blocked.push("consent and deletion rule must be explicit");
  if (ready && !hasCriteriaText(criteria.failure_state_rule, [["missing", "mismatch", "unsafe", "founder", "block"], ["block", "blocks", "blocked"]])) blocked.push("failure-state rule must name blocking conditions");
  if (ready && !hasCriteriaText(criteria.rollback_rehearsal_rule, [["rollback"], ["before_hash"], ["after_hash"], ["canonical"]])) blocked.push("rollback rehearsal must reference before_hash, after_hash, and canonical data");
  if (ready && !hasCriteriaText(criteria.founder_instruction_rule, [["founder"], ["required"], ["not granted", "final", "before"]])) blocked.push("founder instruction rule must say final instruction is required and not granted");
  if (ready && !keepsEntryBoundary(criteria.entry_boundary)) blocked.push("entry boundary must keep storage and canonical writes false");
  if (Array.isArray(replay.blocked) && replay.blocked.length > 0) warnings.push("Replay receipt still carries blocked items.");
  if (Array.isArray(replay.warnings)) warnings.push(...replay.warnings);

  const criteria_status = missing.length || blocked.length ? "Blocked" : state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    criteria_packet_id: "storage-entry-criteria-" + Date.now(),
    criteria_status,
    criteria_ready: criteria_status === "Entry criteria ready",
    production_ready: false,
    controlled_storage_entry_allowed: false,
    canonical_write_allowed: false,
    storage_write_enabled: false,
    source_write_executed: false,
    replay_receipt_id: criteria.replay_receipt_id || replay.replay_receipt_id || "",
    rollback_receipt_id: criteria.rollback_receipt_id || replay.rollback_receipt_id || "",
    audit_receipt_id: criteria.audit_receipt_id || replay.audit_receipt_id || "",
    source_answer_id: criteria.source_answer_id || replay.source_answer_id || "",
    source_record_id: criteria.source_record_id || replay.source_record_id || "",
    source_family: criteria.source_family || replay.source_family || "",
    criteria_state: state,
    criteria_actor: criteria.criteria_actor || "",
    criteria_note: criteria.criteria_note || "",
    immutable_audit_receipt: criteria.immutable_audit_receipt || "",
    rollback_receipt_rule: criteria.rollback_receipt_rule || "",
    replay_receipt_rule: criteria.replay_receipt_rule || "",
    source_owner_scope: criteria.source_owner_scope || "",
    reviewer_identity_rule: criteria.reviewer_identity_rule || "",
    schema_contract_rule: criteria.schema_contract_rule || "",
    consent_delete_rule: criteria.consent_delete_rule || "",
    failure_state_rule: criteria.failure_state_rule || "",
    rollback_rehearsal_rule: criteria.rollback_rehearsal_rule || "",
    founder_instruction_rule: criteria.founder_instruction_rule || "",
    entry_boundary: criteria.entry_boundary || "",
    review_question: criteria.review_question || "",
    return_reason: criteria.return_reason || "",
    block_reason: criteria.block_reason || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.criteria_policy
    ],
    replay_receipt: replay,
    created_at: new Date().toISOString()
  };
}

function criteriaSnapshot(packets, config) {
  const byStatus = packets.reduce((counts, packet) => {
    const key = packet.criteria_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: packets.length,
    criteria_ready: byStatus["Entry criteria ready"] || 0,
    draft: byStatus["Draft criteria"] || 0,
    review: byStatus["Needs criteria review"] || 0,
    returned: byStatus["Return to replay receipt"] || 0,
    blocked: byStatus.Blocked || 0,
    entry_blocked: byStatus["Entry criteria blocked"] || 0,
    packets
  };
}

async function criteriaLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readCriteriaStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeCriteriaStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function criteriaCard(title, value, state = "") {
  return '<article class="criteria-card ' + state + '"><span>' + criteriaSafe(title) + '</span><strong>' + criteriaSafe(value || "None") + '</strong></article>';
}

function renderCriteriaResult(target, packet) {
  const details = [
    ...(packet.missing || []).map((item) => "Missing: " + item),
    ...(packet.blocked || [])
  ];
  target.dataset.state = packet.criteria_status;
  target.innerHTML = '<strong>' + criteriaSafe(packet.criteria_status) + '</strong>' +
    '<p class="muted">Criteria ready: ' + criteriaSafe(packet.criteria_ready) + ' | Storage writes: ' + criteriaSafe(packet.storage_write_enabled) + ' | Source writes: ' + criteriaSafe(packet.source_write_executed) + '</p>' +
    '<div class="criteria-grid">' +
      criteriaCard("Replay receipt", packet.replay_receipt_id, packet.criteria_ready ? "ready" : "") +
      criteriaCard("Rollback receipt", packet.rollback_receipt_id, packet.criteria_ready ? "ready" : "") +
      criteriaCard("Audit receipt", packet.audit_receipt_id, packet.criteria_ready ? "ready" : "") +
      criteriaCard("Source answer", packet.source_answer_id, packet.criteria_ready ? "ready" : "") +
    '</div>' +
    (details.length ? '<ul>' + details.map((item) => '<li>' + criteriaSafe(item) + '</li>').join("") + '</ul>' : '<p class="muted">All criteria checks pass while writes remain false.</p>');
}

function renderReplayScope(target, replay) {
  const rows = [
    ["Replay status", replay.replay_status],
    ["Replay ready", replay.replay_receipt_ready],
    ["Production ready", replay.production_ready],
    ["Canonical write", replay.canonical_write_allowed],
    ["Storage write", replay.storage_write_enabled],
    ["Source write", replay.source_write_executed],
    ["Before hash", replay.before_hash],
    ["After hash", replay.after_hash],
    ["Snapshot", replay.source_snapshot_ref]
  ];
  target.innerHTML = rows.map(([label, value]) => criteriaCard(label, value)).join("");
}

function renderCriteriaRules(target, checks) {
  target.innerHTML = checks.map((item) => (
    '<article class="criteria-rule"><span>' + criteriaSafe(item.check) + '</span><strong>' + criteriaSafe(item.rule) + '</strong></article>'
  )).join("");
}

function renderSavedCriteria(target, packets, config) {
  const snapshot = criteriaSnapshot(packets, config);
  if (!packets.length) {
    target.innerHTML = '<article class="criteria-card"><strong>No saved criteria packets yet.</strong><span>Save a packet to preview local storage-entry history.</span></article>';
    return;
  }
  target.innerHTML =
    '<div class="criteria-grid">' +
      criteriaCard("Saved packets", snapshot.count) +
      criteriaCard("Ready", snapshot.criteria_ready, "ready") +
      criteriaCard("Blocked", snapshot.blocked + snapshot.entry_blocked, snapshot.blocked ? "blocked" : "") +
      criteriaCard("Returned", snapshot.returned) +
    '</div>' +
    packets.slice(-6).reverse().map((packet) => (
      '<article class="criteria-card ' + (packet.criteria_ready ? "ready" : "") + '">' +
      '<span>' + criteriaSafe(packet.created_at) + '</span>' +
      '<strong>' + criteriaSafe(packet.criteria_status) + '</strong>' +
      '<span>' + criteriaSafe(packet.source_answer_id) + '</span>' +
      '</article>'
    )).join("");
}

async function initControlledStorageEntryCriteria() {
  const config = await criteriaLoadJson("data/vedapath-controlled-storage-entry-criteria.json");
  const storeKey = config.local_criteria_store;
  const replayInput = criteriaRoot.querySelector("#criteriaReplayReceipt");
  const stateSelect = criteriaRoot.querySelector("#criteriaState");
  const actorInput = criteriaRoot.querySelector("#criteriaActor");
  const noteInput = criteriaRoot.querySelector("#criteriaNote");
  const replayIdInput = criteriaRoot.querySelector("#criteriaReplayId");
  const rollbackIdInput = criteriaRoot.querySelector("#criteriaRollbackId");
  const auditIdInput = criteriaRoot.querySelector("#criteriaAuditId");
  const answerInput = criteriaRoot.querySelector("#criteriaSourceAnswer");
  const recordInput = criteriaRoot.querySelector("#criteriaSourceRecord");
  const familyInput = criteriaRoot.querySelector("#criteriaSourceFamily");
  const auditRuleInput = criteriaRoot.querySelector("#criteriaAuditRule");
  const rollbackRuleInput = criteriaRoot.querySelector("#criteriaRollbackRule");
  const replayRuleInput = criteriaRoot.querySelector("#criteriaReplayRule");
  const ownerInput = criteriaRoot.querySelector("#criteriaOwnerScope");
  const identityInput = criteriaRoot.querySelector("#criteriaReviewerIdentity");
  const schemaInput = criteriaRoot.querySelector("#criteriaSchemaContract");
  const consentInput = criteriaRoot.querySelector("#criteriaConsentDelete");
  const failureInput = criteriaRoot.querySelector("#criteriaFailureStates");
  const rehearsalInput = criteriaRoot.querySelector("#criteriaRollbackRehearsal");
  const founderInput = criteriaRoot.querySelector("#criteriaFounderInstruction");
  const boundaryInput = criteriaRoot.querySelector("#criteriaEntryBoundary");
  const questionInput = criteriaRoot.querySelector("#criteriaReviewQuestion");
  const returnInput = criteriaRoot.querySelector("#criteriaReturnReason");
  const blockInput = criteriaRoot.querySelector("#criteriaBlockReason");
  const resultTarget = criteriaRoot.querySelector("#criteriaResultCard");
  const replayScopeTarget = criteriaRoot.querySelector("#criteriaReplayScope");
  const rulesTarget = criteriaRoot.querySelector("#criteriaChecks");
  const packetTarget = criteriaRoot.querySelector("#criteriaPacket");
  const savedTarget = criteriaRoot.querySelector("#criteriaSaved");

  stateSelect.innerHTML = config.criteria_states.map((state) => '<option value="' + criteriaSafe(state) + '">' + criteriaSafe(state) + '</option>').join("");
  renderCriteriaRules(rulesTarget, config.criteria_checks || []);

  function loadSample() {
    const criteria = config.sample_criteria;
    replayInput.value = JSON.stringify(config.sample_replay_receipt, null, 2);
    stateSelect.value = criteria.criteria_state;
    actorInput.value = criteria.criteria_actor;
    noteInput.value = criteria.criteria_note;
    replayIdInput.value = criteria.replay_receipt_id;
    rollbackIdInput.value = criteria.rollback_receipt_id;
    auditIdInput.value = criteria.audit_receipt_id;
    answerInput.value = criteria.source_answer_id;
    recordInput.value = criteria.source_record_id;
    familyInput.value = criteria.source_family;
    auditRuleInput.value = criteria.immutable_audit_receipt;
    rollbackRuleInput.value = criteria.rollback_receipt_rule;
    replayRuleInput.value = criteria.replay_receipt_rule;
    ownerInput.value = criteria.source_owner_scope;
    identityInput.value = criteria.reviewer_identity_rule;
    schemaInput.value = criteria.schema_contract_rule;
    consentInput.value = criteria.consent_delete_rule;
    failureInput.value = criteria.failure_state_rule;
    rehearsalInput.value = criteria.rollback_rehearsal_rule;
    founderInput.value = criteria.founder_instruction_rule;
    boundaryInput.value = criteria.entry_boundary;
    questionInput.value = criteria.review_question;
    returnInput.value = criteria.return_reason;
    blockInput.value = criteria.block_reason;
  }

  function currentCriteria() {
    return {
      criteria_state: stateSelect.value,
      criteria_actor: actorInput.value,
      criteria_note: noteInput.value,
      replay_receipt_id: replayIdInput.value,
      rollback_receipt_id: rollbackIdInput.value,
      audit_receipt_id: auditIdInput.value,
      source_answer_id: answerInput.value,
      source_record_id: recordInput.value,
      source_family: familyInput.value,
      immutable_audit_receipt: auditRuleInput.value,
      rollback_receipt_rule: rollbackRuleInput.value,
      replay_receipt_rule: replayRuleInput.value,
      source_owner_scope: ownerInput.value,
      reviewer_identity_rule: identityInput.value,
      schema_contract_rule: schemaInput.value,
      consent_delete_rule: consentInput.value,
      failure_state_rule: failureInput.value,
      rollback_rehearsal_rule: rehearsalInput.value,
      founder_instruction_rule: founderInput.value,
      entry_boundary: boundaryInput.value,
      review_question: questionInput.value,
      return_reason: returnInput.value,
      block_reason: blockInput.value
    };
  }

  function currentPacket() {
    const replayReceipt = parseCriteriaJson(replayInput.value, {});
    return controlledStorageEntryCriteria(config, replayReceipt, currentCriteria());
  }

  function render() {
    const replayReceipt = parseCriteriaJson(replayInput.value, {});
    const packet = currentPacket();
    renderCriteriaResult(resultTarget, packet);
    renderReplayScope(replayScopeTarget, replayReceipt);
    packetTarget.value = JSON.stringify(packet, null, 2);
    renderSavedCriteria(savedTarget, readCriteriaStore(storeKey), config);
  }

  criteriaRoot.querySelector("#loadCriteriaSample").addEventListener("click", () => {
    loadSample();
    render();
  });

  criteriaRoot.querySelector("#runCriteriaCheck").addEventListener("click", render);

  criteriaRoot.querySelector("#saveCriteriaPacket").addEventListener("click", () => {
    const packets = readCriteriaStore(storeKey);
    packets.push(currentPacket());
    writeCriteriaStore(storeKey, packets);
    render();
  });

  criteriaRoot.querySelector("#clearCriteriaPackets").addEventListener("click", () => {
    writeCriteriaStore(storeKey, []);
    render();
  });

  criteriaRoot.querySelector("#copyCriteriaPacket").addEventListener("click", async () => {
    packetTarget.select();
    try {
      await navigator.clipboard.writeText(packetTarget.value);
    } catch (error) {
      document.execCommand("copy");
    }
  });

  [
    replayInput,
    stateSelect,
    actorInput,
    noteInput,
    replayIdInput,
    rollbackIdInput,
    auditIdInput,
    answerInput,
    recordInput,
    familyInput,
    auditRuleInput,
    rollbackRuleInput,
    replayRuleInput,
    ownerInput,
    identityInput,
    schemaInput,
    consentInput,
    failureInput,
    rehearsalInput,
    founderInput,
    boundaryInput,
    questionInput,
    returnInput,
    blockInput
  ].forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  loadSample();
  render();
}

window.vedapathControlledStorageEntryCriteria = {
  controlledStorageEntryCriteria,
  criteriaSnapshot,
  criteriaMissingForState,
  parseCriteriaJson
};
`);
}

function writeCriteriaPage() {
  write("controlledstoragecriteria.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Storage Entry Criteria</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-storage-entry-criteria.css">
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
            <span>Controlled storage criteria</span>
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

      <main class="workspace" aria-label="VedaPath Controlled Storage Entry Criteria workspace">
        <aside class="panel">
          <span class="eyebrow">Storage restraint</span>
          <h2>Define the gate before touching storage</h2>
          <p class="muted">This room converts replay proof into explicit entry criteria while every write flag remains false.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Receipt chain</strong><p>Audit, rollback, replay.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Authority</strong><p>Owner and reviewer rules.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Storage contract</strong><p>Schema and failure states.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Boundary</strong><p>No write yet.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="replayreceiptdryrun.html">Open Replay Receipt</a>
            <a class="button safe" href="storagedesigngate.html">Open Storage Design</a>
          </div>
        </aside>

        <section class="panel criteria-app" id="controlledStorageEntryCriteria">
          <div class="criteria-head">
            <div>
              <span class="eyebrow">Entry criteria</span>
              <h1>Name every gate. Keep every write off.</h1>
              <p class="muted">The product can become stronger only when storage entry has a visible checklist, visible blockers, and a founder boundary.</p>
            </div>
            <div class="criteria-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath controlled storage mark"></div>
          </div>

          <section class="criteria-layout">
            <div class="criteria-form">
              <h2>Criteria Packet</h2>
              <label>Replay receipt packet<textarea id="criteriaReplayReceipt"></textarea></label>
              <label>Criteria state<select id="criteriaState"></select></label>
              <label>Criteria actor<input id="criteriaActor" type="text" placeholder="Storage criteria reviewer"></label>
              <label>Criteria note<textarea id="criteriaNote"></textarea></label>
              <label>Replay receipt id<input id="criteriaReplayId" type="text"></label>
              <label>Rollback receipt id<input id="criteriaRollbackId" type="text"></label>
              <label>Audit receipt id<input id="criteriaAuditId" type="text"></label>
              <label>Source answer id<input id="criteriaSourceAnswer" type="text"></label>
              <label>Source record id<input id="criteriaSourceRecord" type="text"></label>
              <label>Source family<input id="criteriaSourceFamily" type="text"></label>
              <label>Immutable audit receipt rule<textarea id="criteriaAuditRule"></textarea></label>
              <label>Rollback receipt rule<textarea id="criteriaRollbackRule"></textarea></label>
              <label>Replay receipt rule<textarea id="criteriaReplayRule"></textarea></label>
              <label>Source owner scope<textarea id="criteriaOwnerScope"></textarea></label>
              <label>Reviewer identity rule<textarea id="criteriaReviewerIdentity"></textarea></label>
              <label>Schema contract rule<textarea id="criteriaSchemaContract"></textarea></label>
              <label>Consent and deletion rule<textarea id="criteriaConsentDelete"></textarea></label>
              <label>Failure-state rule<textarea id="criteriaFailureStates"></textarea></label>
              <label>Rollback rehearsal rule<textarea id="criteriaRollbackRehearsal"></textarea></label>
              <label>Founder instruction rule<textarea id="criteriaFounderInstruction"></textarea></label>
              <label>Entry boundary<textarea id="criteriaEntryBoundary"></textarea></label>
              <label>Review question<textarea id="criteriaReviewQuestion"></textarea></label>
              <label>Return reason<textarea id="criteriaReturnReason"></textarea></label>
              <label>Block reason<textarea id="criteriaBlockReason"></textarea></label>
              <div class="criteria-actions">
                <button class="button primary" id="runCriteriaCheck" type="button">Run Criteria</button>
                <button class="button safe" id="loadCriteriaSample" type="button">Load Sample</button>
                <button class="button" id="saveCriteriaPacket" type="button">Save Local</button>
                <button class="button" id="clearCriteriaPackets" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="criteria-result" id="criteriaResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Replay Proof Scope</h2>
                <div class="criteria-list" id="criteriaReplayScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Entry Checks</h2>
            <div class="criteria-rules" id="criteriaChecks"></div>
          </section>

          <section class="criteria-layout">
            <div>
              <div class="criteria-actions">
                <button class="button safe" id="copyCriteriaPacket" type="button">Copy Criteria Packet</button>
                <a class="button" href="data/vedapath-controlled-storage-entry-criteria.json">Open JSON</a>
              </div>
              <textarea class="criteria-packet" id="criteriaPacket" aria-label="Controlled storage entry criteria packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Criteria</h2>
              <div class="criteria-list" id="criteriaSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">No-write gate</span>
          <h2 style="margin-top: 14px;">Storage Entry Is Still Closed</h2>
          <p class="muted">This release defines the criteria. It does not grant controlled storage entry or execute a write.</p>
          <div class="progress" aria-label="Controlled storage criteria progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Criteria</span><strong>10</strong></div>
            <div class="metric"><span>Writes</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Entry dry run</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Founder Boundary</h2>
            <p class="muted">Final founder instruction is required before any real storage entry. This preview deliberately does not grant it.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-storage-entry-criteria.js"></script>
  </body>
</html>
`);
}

function updateNavigationLinks() {
  let replay = read("replayreceiptdryrun.html");
  if (!replay.includes("controlledstoragecriteria.html")) {
    replay = replay.replace(
      '<a class="button primary" href="rollbackreceiptdryrun.html">Open Rollback Receipt</a>\n            <a class="button safe" href="auditreceiptdryrun.html">Open Audit Receipt</a>',
      '<a class="button primary" href="controlledstoragecriteria.html">Open Storage Criteria</a>\n            <a class="button safe" href="rollbackreceiptdryrun.html">Open Rollback Receipt</a>\n            <a class="button" href="auditreceiptdryrun.html">Open Audit Receipt</a>'
    );
    replay = replay.replace(
      "The next release should define controlled storage entry criteria from replay proof.",
      "Storage entry criteria now define the next gate from replay proof while writes remain false."
    );
    write("replayreceiptdryrun.html", replay);
  }
}

function updateIndex() {
  let content = read("index.html");
  if (!content.includes('controlledstoragecriteria.html">Storage criteria')) {
    content = content
      .replace(
        '<a href="replayreceiptdryrun.html">Replay receipt <span>dry run</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>',
        '<a href="replayreceiptdryrun.html">Replay receipt <span>dry run</span></a>\n              <a href="controlledstoragecriteria.html">Storage criteria <span>entry gate</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>'
      )
      .replace(
        '<a href="replayreceiptdryrun.html">Replay receipt <span>proof</span></a>\n            </div>',
        '<a href="replayreceiptdryrun.html">Replay receipt <span>proof</span></a>\n              <a href="controlledstoragecriteria.html">Storage criteria <span>gate</span></a>\n            </div>'
      );
  }
  content = content.replace(
    "controlled storage, source promotion, and production memory.",
    "controlled storage dry runs, source promotion, and production memory."
  );
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = updateVersionBadge(content)
    .replace(/<strong>v3\.0\.6<\/strong>\s*<p>Replay Receipt Dry Run:[\s\S]*?<\/p>/, '<strong>v3.0.7</strong>\n          <p>Controlled Storage Entry Criteria: replay-ready receipts now feed a visible checklist for source-owner scope, reviewer identity, schema contract, consent, failure states, rollback rehearsal, founder boundary, and no-write entry.</p>')
    .replace(/<strong>88%<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:88%"><\/div><\/div>\s*<p>The trust loop now proves repeatable replay before any production write exists\.<\/p>/, '<strong>89%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:89%"></div></div>\n          <p>The trust loop now defines the exact storage entry criteria before any production write exists.</p>')
    .replace(/<strong>Controlled storage entry criteria<\/strong>\s*<p>Define the final entry checklist for controlled storage while canonical writes remain blocked\.<\/p>/, '<strong>Controlled storage entry dry run</strong>\n          <p>Run the criteria packet against a no-write storage-entry simulation.</p>')
    .replace('<div class="percent">88%</div>', '<div class="percent">89%</div>');

  const criteriaPhase = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 271: Controlled Storage Entry Criteria</strong>
                <p>Defines the final entry checklist from replay proof: receipt chain, source-owner scope, reviewer identity, schema contract, consent, failure states, rollback rehearsal, founder boundary, and no-write entry.</p>
              </div>
              <span class="percent">100%</span>
            </article>
`;
  if (!content.includes("Phase 271: Controlled Storage Entry Criteria")) {
    content = content.replace(
      `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 271: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
      `${criteriaPhase}            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 272: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
  }

  content = content
    .replace('<div class="version-row"><span>Release</span><strong>v3.0.6 Replay Receipt Dry Run</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.0.7 Controlled Storage Entry Criteria</strong></div>')
    .replace('<div class="version-row"><span>Previous</span><strong>v3.0.5 Rollback Receipt Dry Run</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.0.6 Replay Receipt Dry Run</strong></div>')
    .replace('<div class="version-row"><span>Goal</span><strong>Prove repeatable replay before any source storage write.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Define controlled storage entry criteria before any source storage write.</strong></div>')
    .replace('<div class="version-row"><span>Status</span><strong>Ready for controlled storage entry criteria</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled storage entry dry run</strong></div>')
    .replace(`<li><span class="dot"></span><span>Define controlled storage entry criteria.</span></li>
              <li><span class="dot"></span><span>Require audit, rollback, and replay receipts.</span></li>
              <li><span class="dot"></span><span>Define promotion-blocking failure states.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`, `<li><span class="dot"></span><span>Run a no-write storage-entry dry run.</span></li>
              <li><span class="dot"></span><span>Use the criteria packet as input.</span></li>
              <li><span class="dot"></span><span>Show pass, return, hold, and block outcomes.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY CRITERIA START -->", "<!-- VEDAPATH CONTROLLED STORAGE ENTRY CRITERIA END -->", `## ${release} Controlled Storage Entry Criteria

This release adds the controlled storage entry criteria layer after replay receipts.

- adds controlledstoragecriteria.html
- adds data/vedapath-controlled-storage-entry-criteria.json
- requires audit, rollback, and replay receipt chain
- defines source-owner scope, reviewer identity, schema contract, consent and deletion rules, failure states, rollback rehearsal, founder instruction rule, and entry boundary
- keeps controlled_storage_entry_allowed false, source_write_executed false, storage_write_enabled false, production_ready false, and canonical_write_allowed false
- sets the next release as controlled storage entry dry run`, "<!-- VEDAPATH REPLAY RECEIPT DRY RUN START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY CRITERIA NOTES START -->", "<!-- VEDAPATH CONTROLLED STORAGE ENTRY CRITERIA NOTES END -->", `## ${release} Controlled Storage Entry Criteria

This phase turns replay proof into a visible storage-entry checklist.

Action taken:

- Added controlled storage entry criteria schema.
- Added criteria states for draft, review, ready, return, and blocked.
- Required receipt chain, no-write proof, source-owner scope, reviewer identity, schema contract, consent, deletion, failure states, rollback rehearsal, founder instruction, and entry boundary.
- Added copyable criteria packets and local criteria history.
- Preserved canonical source data and kept all write flags false.`, "<!-- VEDAPATH REPLAY RECEIPT DRY RUN NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY CRITERIA BLUEPRINT START -->", "<!-- VEDAPATH CONTROLLED STORAGE ENTRY CRITERIA BLUEPRINT END -->", `### 290. Controlled Storage Entry Criteria

VedaPath should define the gate before it attempts any storage entry.

Rules:

- Entry criteria can start only from a ready replay receipt.
- A ready criteria packet must include receipt chain, owner scope, reviewer identity, schema contract, consent and deletion rules, failure states, rollback rehearsal, founder instruction, and no-write entry boundary.
- Criteria readiness is not controlled storage entry.
- Source writes, storage writes, and canonical writes remain false in preview.
- The next build should run a no-write storage-entry dry run from this criteria packet.`, "<!-- VEDAPATH REPLAY RECEIPT DRY RUN BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/CONTROLLED_STORAGE_ENTRY_CRITERIA.md", `# VedaPath AI Controlled Storage Entry Criteria

Release: ${release}

This release adds the controlled storage entry criteria layer after replay receipts.

## Files

- data/vedapath-controlled-storage-entry-criteria.json
- controlledstoragecriteria.html
- assets/vedapath-controlled-storage-entry-criteria.css
- assets/vedapath-controlled-storage-entry-criteria.js

## What It Adds

The room:

- reads a replay receipt packet
- confirms audit, rollback, and replay receipt chain
- keeps all write flags false
- defines owner scope and reviewer identity rules
- defines schema contract and consent/delete rules
- defines failure states and rollback rehearsal
- keeps founder instruction required and not granted in preview
- exports a copyable criteria packet

## Boundary

Controlled storage entry criteria is not production storage. It does not grant controlled storage entry, write canonical source data, create accounts, or change source records. The next release should dry-run storage entry against this criteria packet while writes remain blocked.
`);
}

writeCriteriaData();
writeCriteriaCss();
writeCriteriaJs();
writeCriteriaPage();
updateAllHtmlShells();
updateNavigationLinks();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} controlled storage entry criteria applied.`);

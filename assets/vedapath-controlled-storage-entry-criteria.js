const criteriaRoot = document.getElementById("controlledStorageEntryCriteria");

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

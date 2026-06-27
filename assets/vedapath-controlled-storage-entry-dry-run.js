const entryRoot = document.getElementById("controlledStorageEntryDryRun");

if (entryRoot) {
  initControlledStorageEntryDryRun().catch((error) => {
    entryRoot.innerHTML = '<article class="entry-result"><strong>Storage entry dry run could not load.</strong></article>';
    console.error(error);
  });
}

function entrySafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseEntryJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function entryMissingForState(config, entry) {
  const required = config.required_by_state?.[entry.entry_state] || [];
  return required.filter((field) => !String(entry[field] ?? "").trim());
}

function hasEntryText(value, groups) {
  const text = String(value || "").toLowerCase();
  return groups.every((group) => group.some((word) => text.includes(word)));
}

function keepsEntryDryRunBoundary(value) {
  const text = String(value || "");
  const safe = /(dry run only|controlled_storage_entry_allowed remains false|canonical_write_allowed remains false|storage_write_enabled remains false|source_write_executed remains false|no source write)/i.test(text);
  const unsafe = /(controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|production write|write enabled|real storage entry granted)/i.test(text);
  return safe && !unsafe;
}

function criteriaPacketReady(packet) {
  return packet &&
    packet.criteria_status === "Entry criteria ready" &&
    packet.criteria_ready === true &&
    packet.production_ready === false &&
    packet.controlled_storage_entry_allowed === false &&
    packet.canonical_write_allowed === false &&
    packet.storage_write_enabled === false &&
    packet.source_write_executed === false;
}

function controlledStorageEntryDryRun(config, criteriaPacket, entry) {
  const missing = entryMissingForState(config, entry);
  const blocked = [];
  const warnings = [];
  const criteria = criteriaPacket || {};
  const state = entry.entry_state || "Draft entry dry run";
  const passed = state === "Entry dry run passed";

  if (!criteriaPacket || typeof criteriaPacket !== "object" || Array.isArray(criteriaPacket)) missing.push("criteria packet");
  if (criteria.production_ready === true) blocked.push("criteria packet cannot already be production ready");
  if (criteria.controlled_storage_entry_allowed !== false) blocked.push("criteria packet must keep controlled_storage_entry_allowed false");
  if (criteria.canonical_write_allowed !== false) blocked.push("criteria packet must keep canonical_write_allowed false");
  if (criteria.storage_write_enabled !== false) blocked.push("criteria packet must keep storage_write_enabled false");
  if (criteria.source_write_executed !== false) blocked.push("criteria packet must keep source_write_executed false");
  if (passed && !criteriaPacketReady(criteria)) blocked.push("criteria packet is not ready");
  if (passed && criteria.criteria_packet_id && entry.criteria_packet_id && entry.criteria_packet_id !== criteria.criteria_packet_id) blocked.push("criteria packet id must match input criteria");
  if (passed && criteria.replay_receipt_id && entry.replay_receipt_id && entry.replay_receipt_id !== criteria.replay_receipt_id) blocked.push("replay receipt id must match criteria");
  if (passed && criteria.rollback_receipt_id && entry.rollback_receipt_id && entry.rollback_receipt_id !== criteria.rollback_receipt_id) blocked.push("rollback receipt id must match criteria");
  if (passed && criteria.audit_receipt_id && entry.audit_receipt_id && entry.audit_receipt_id !== criteria.audit_receipt_id) blocked.push("audit receipt id must match criteria");
  if (passed && criteria.source_answer_id && entry.source_answer_id && entry.source_answer_id !== criteria.source_answer_id) blocked.push("source answer id must match criteria");
  if (passed && !hasEntryText(entry.storage_target, [["storage"], ["source", "answer", "record", "draft"]])) blocked.push("storage target must be explicit");
  if (passed && !hasEntryText(entry.schema_route, [["draft"], ["audit"], ["rollback"], ["replay"], ["criteria"], ["founder"], ["canonical"]])) blocked.push("schema route must show the full non-canonical path");
  if (passed && !hasEntryText(entry.dry_run_plan, [["simulate", "dry run"], ["no"], ["database", "table", "account", "source"], ["write"]])) blocked.push("dry-run plan must say no database, table, account, or source write");
  if (passed && !hasEntryText(entry.receipt_chain_check, [["audit"], ["rollback"], ["replay"], ["criteria"], ["pass", "ready", "present"]])) blocked.push("receipt chain check must prove all receipts are present");
  if (passed && !hasEntryText(entry.no_write_check, [["controlled_storage_entry_allowed false"], ["storage_write_enabled false"], ["canonical_write_allowed false"], ["source_write_executed false"]])) blocked.push("no-write check must keep every write flag false");
  if (passed && !hasEntryText(entry.rollback_simulation, [["restore"], ["before_hash"], ["discard"], ["after_hash"], ["canonical"]])) blocked.push("rollback simulation must restore before_hash and discard after_hash");
  if (passed && !hasEntryText(entry.promotion_blockers, [["founder"], ["production", "durable", "migration", "rights"], ["not granted", "missing", "blocked"]])) blocked.push("promotion blockers must keep final launch gaps visible");
  if (passed && !hasEntryText(entry.founder_instruction_check, [["founder"], ["required"], ["not granted"]])) blocked.push("founder instruction check must remain not granted");
  if (passed && !hasEntryText(entry.simulated_result, [["dry run"], ["pass", "would"], ["real", "controlled"], ["closed", "false", "not"]])) blocked.push("simulated result must not grant real storage entry");
  if (passed && !keepsEntryDryRunBoundary(entry.entry_boundary)) blocked.push("entry boundary must keep storage and canonical writes false");
  if (Array.isArray(criteria.blocked) && criteria.blocked.length > 0) warnings.push("Criteria packet still carries blocked items.");
  if (Array.isArray(criteria.warnings)) warnings.push(...criteria.warnings);

  const entry_status = missing.length || blocked.length ? "Blocked" : state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    entry_dry_run_id: "storage-entry-dry-run-" + Date.now(),
    entry_status,
    entry_dry_run_passed: entry_status === "Entry dry run passed",
    production_ready: false,
    controlled_storage_entry_allowed: false,
    canonical_write_allowed: false,
    storage_write_enabled: false,
    source_write_executed: false,
    actual_storage_write_executed: false,
    founder_instruction_required: true,
    founder_instruction_granted: false,
    next_gate_required: "Founder storage instruction gate",
    criteria_packet_id: entry.criteria_packet_id || criteria.criteria_packet_id || "",
    replay_receipt_id: entry.replay_receipt_id || criteria.replay_receipt_id || "",
    rollback_receipt_id: entry.rollback_receipt_id || criteria.rollback_receipt_id || "",
    audit_receipt_id: entry.audit_receipt_id || criteria.audit_receipt_id || "",
    source_answer_id: entry.source_answer_id || criteria.source_answer_id || "",
    source_record_id: entry.source_record_id || criteria.source_record_id || "",
    source_family: entry.source_family || criteria.source_family || "",
    entry_state: state,
    entry_actor: entry.entry_actor || "",
    entry_note: entry.entry_note || "",
    storage_target: entry.storage_target || "",
    schema_route: entry.schema_route || "",
    dry_run_plan: entry.dry_run_plan || "",
    receipt_chain_check: entry.receipt_chain_check || "",
    no_write_check: entry.no_write_check || "",
    rollback_simulation: entry.rollback_simulation || "",
    promotion_blockers: entry.promotion_blockers || "",
    founder_instruction_check: entry.founder_instruction_check || "",
    simulated_result: entry.simulated_result || "",
    entry_boundary: entry.entry_boundary || "",
    review_question: entry.review_question || "",
    return_reason: entry.return_reason || "",
    hold_reason: entry.hold_reason || "",
    block_reason: entry.block_reason || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.entry_policy
    ],
    criteria_packet: criteria,
    created_at: new Date().toISOString()
  };
}

function entryDryRunSnapshot(packets, config) {
  const byStatus = packets.reduce((counts, packet) => {
    const key = packet.entry_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: packets.length,
    passed: byStatus["Entry dry run passed"] || 0,
    draft: byStatus["Draft entry dry run"] || 0,
    review: byStatus["Needs entry review"] || 0,
    returned: byStatus["Return to criteria"] || 0,
    founder_hold: byStatus["Founder hold"] || 0,
    blocked: byStatus.Blocked || 0,
    entry_blocked: byStatus["Entry dry run blocked"] || 0,
    packets
  };
}

async function entryLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readEntryStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeEntryStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function entryCard(title, value, state = "") {
  return '<article class="entry-card ' + state + '"><span>' + entrySafe(title) + '</span><strong>' + entrySafe(value || "None") + '</strong></article>';
}

function renderEntryResult(target, packet) {
  const details = [
    ...(packet.missing || []).map((item) => "Missing: " + item),
    ...(packet.blocked || [])
  ];
  target.dataset.state = packet.entry_status;
  target.innerHTML = '<strong>' + entrySafe(packet.entry_status) + '</strong>' +
    '<p class="muted">Dry run passed: ' + entrySafe(packet.entry_dry_run_passed) + ' | Controlled entry: ' + entrySafe(packet.controlled_storage_entry_allowed) + ' | Source writes: ' + entrySafe(packet.source_write_executed) + '</p>' +
    '<div class="entry-grid">' +
      entryCard("Criteria packet", packet.criteria_packet_id, packet.entry_dry_run_passed ? "ready" : "") +
      entryCard("Replay receipt", packet.replay_receipt_id, packet.entry_dry_run_passed ? "ready" : "") +
      entryCard("Founder granted", packet.founder_instruction_granted) +
      entryCard("Next gate", packet.next_gate_required) +
    '</div>' +
    (details.length ? '<ul>' + details.map((item) => '<li>' + entrySafe(item) + '</li>').join("") + '</ul>' : '<p class="muted">The simulated gate passes, but all real write and entry flags remain false.</p>');
}

function renderCriteriaScope(target, criteria) {
  const rows = [
    ["Criteria status", criteria.criteria_status],
    ["Criteria ready", criteria.criteria_ready],
    ["Production ready", criteria.production_ready],
    ["Controlled entry", criteria.controlled_storage_entry_allowed],
    ["Canonical write", criteria.canonical_write_allowed],
    ["Storage write", criteria.storage_write_enabled],
    ["Source write", criteria.source_write_executed],
    ["Criteria packet", criteria.criteria_packet_id],
    ["Source answer", criteria.source_answer_id]
  ];
  target.innerHTML = rows.map(([label, value]) => entryCard(label, value)).join("");
}

function renderEntryRules(target, checks) {
  target.innerHTML = checks.map((item) => (
    '<article class="entry-rule"><span>' + entrySafe(item.check) + '</span><strong>' + entrySafe(item.rule) + '</strong></article>'
  )).join("");
}

function renderSavedEntries(target, packets, config) {
  const snapshot = entryDryRunSnapshot(packets, config);
  if (!packets.length) {
    target.innerHTML = '<article class="entry-card"><strong>No saved entry dry runs yet.</strong><span>Save a packet to preview local entry-gate history.</span></article>';
    return;
  }
  target.innerHTML =
    '<div class="entry-grid">' +
      entryCard("Saved packets", snapshot.count) +
      entryCard("Passed", snapshot.passed, "ready") +
      entryCard("Founder hold", snapshot.founder_hold) +
      entryCard("Blocked", snapshot.blocked + snapshot.entry_blocked, snapshot.blocked ? "blocked" : "") +
    '</div>' +
    packets.slice(-6).reverse().map((packet) => (
      '<article class="entry-card ' + (packet.entry_dry_run_passed ? "ready" : "") + '">' +
      '<span>' + entrySafe(packet.created_at) + '</span>' +
      '<strong>' + entrySafe(packet.entry_status) + '</strong>' +
      '<span>' + entrySafe(packet.source_answer_id) + '</span>' +
      '</article>'
    )).join("");
}

async function initControlledStorageEntryDryRun() {
  const config = await entryLoadJson("data/vedapath-controlled-storage-entry-dry-run.json");
  const storeKey = config.local_entry_store;
  const criteriaInput = entryRoot.querySelector("#entryCriteriaPacket");
  const stateSelect = entryRoot.querySelector("#entryState");
  const actorInput = entryRoot.querySelector("#entryActor");
  const noteInput = entryRoot.querySelector("#entryNote");
  const criteriaIdInput = entryRoot.querySelector("#entryCriteriaId");
  const replayIdInput = entryRoot.querySelector("#entryReplayId");
  const rollbackIdInput = entryRoot.querySelector("#entryRollbackId");
  const auditIdInput = entryRoot.querySelector("#entryAuditId");
  const answerInput = entryRoot.querySelector("#entrySourceAnswer");
  const recordInput = entryRoot.querySelector("#entrySourceRecord");
  const familyInput = entryRoot.querySelector("#entrySourceFamily");
  const targetInput = entryRoot.querySelector("#entryStorageTarget");
  const routeInput = entryRoot.querySelector("#entrySchemaRoute");
  const planInput = entryRoot.querySelector("#entryDryRunPlan");
  const chainInput = entryRoot.querySelector("#entryReceiptChain");
  const noWriteInput = entryRoot.querySelector("#entryNoWriteCheck");
  const rollbackInput = entryRoot.querySelector("#entryRollbackSimulation");
  const blockersInput = entryRoot.querySelector("#entryPromotionBlockers");
  const founderInput = entryRoot.querySelector("#entryFounderInstruction");
  const resultInput = entryRoot.querySelector("#entrySimulatedResult");
  const boundaryInput = entryRoot.querySelector("#entryBoundary");
  const questionInput = entryRoot.querySelector("#entryReviewQuestion");
  const returnInput = entryRoot.querySelector("#entryReturnReason");
  const holdInput = entryRoot.querySelector("#entryHoldReason");
  const blockInput = entryRoot.querySelector("#entryBlockReason");
  const resultTarget = entryRoot.querySelector("#entryResultCard");
  const criteriaScopeTarget = entryRoot.querySelector("#entryCriteriaScope");
  const rulesTarget = entryRoot.querySelector("#entryChecks");
  const packetTarget = entryRoot.querySelector("#entryPacket");
  const savedTarget = entryRoot.querySelector("#entrySaved");

  stateSelect.innerHTML = config.entry_states.map((state) => '<option value="' + entrySafe(state) + '">' + entrySafe(state) + '</option>').join("");
  renderEntryRules(rulesTarget, config.entry_checks || []);

  function loadSample() {
    const entry = config.sample_entry;
    criteriaInput.value = JSON.stringify(config.sample_criteria_packet, null, 2);
    stateSelect.value = entry.entry_state;
    actorInput.value = entry.entry_actor;
    noteInput.value = entry.entry_note;
    criteriaIdInput.value = entry.criteria_packet_id;
    replayIdInput.value = entry.replay_receipt_id;
    rollbackIdInput.value = entry.rollback_receipt_id;
    auditIdInput.value = entry.audit_receipt_id;
    answerInput.value = entry.source_answer_id;
    recordInput.value = entry.source_record_id;
    familyInput.value = entry.source_family;
    targetInput.value = entry.storage_target;
    routeInput.value = entry.schema_route;
    planInput.value = entry.dry_run_plan;
    chainInput.value = entry.receipt_chain_check;
    noWriteInput.value = entry.no_write_check;
    rollbackInput.value = entry.rollback_simulation;
    blockersInput.value = entry.promotion_blockers;
    founderInput.value = entry.founder_instruction_check;
    resultInput.value = entry.simulated_result;
    boundaryInput.value = entry.entry_boundary;
    questionInput.value = entry.review_question;
    returnInput.value = entry.return_reason;
    holdInput.value = entry.hold_reason;
    blockInput.value = entry.block_reason;
  }

  function currentEntry() {
    return {
      entry_state: stateSelect.value,
      entry_actor: actorInput.value,
      entry_note: noteInput.value,
      criteria_packet_id: criteriaIdInput.value,
      replay_receipt_id: replayIdInput.value,
      rollback_receipt_id: rollbackIdInput.value,
      audit_receipt_id: auditIdInput.value,
      source_answer_id: answerInput.value,
      source_record_id: recordInput.value,
      source_family: familyInput.value,
      storage_target: targetInput.value,
      schema_route: routeInput.value,
      dry_run_plan: planInput.value,
      receipt_chain_check: chainInput.value,
      no_write_check: noWriteInput.value,
      rollback_simulation: rollbackInput.value,
      promotion_blockers: blockersInput.value,
      founder_instruction_check: founderInput.value,
      simulated_result: resultInput.value,
      entry_boundary: boundaryInput.value,
      review_question: questionInput.value,
      return_reason: returnInput.value,
      hold_reason: holdInput.value,
      block_reason: blockInput.value
    };
  }

  function currentPacket() {
    const criteriaPacket = parseEntryJson(criteriaInput.value, {});
    return controlledStorageEntryDryRun(config, criteriaPacket, currentEntry());
  }

  function render() {
    const criteriaPacket = parseEntryJson(criteriaInput.value, {});
    const packet = currentPacket();
    renderEntryResult(resultTarget, packet);
    renderCriteriaScope(criteriaScopeTarget, criteriaPacket);
    packetTarget.value = JSON.stringify(packet, null, 2);
    renderSavedEntries(savedTarget, readEntryStore(storeKey), config);
  }

  entryRoot.querySelector("#loadEntrySample").addEventListener("click", () => {
    loadSample();
    render();
  });

  entryRoot.querySelector("#runEntryDryRun").addEventListener("click", render);

  entryRoot.querySelector("#saveEntryDryRun").addEventListener("click", () => {
    const packets = readEntryStore(storeKey);
    packets.push(currentPacket());
    writeEntryStore(storeKey, packets);
    render();
  });

  entryRoot.querySelector("#clearEntryDryRuns").addEventListener("click", () => {
    writeEntryStore(storeKey, []);
    render();
  });

  entryRoot.querySelector("#copyEntryPacket").addEventListener("click", async () => {
    packetTarget.select();
    try {
      await navigator.clipboard.writeText(packetTarget.value);
    } catch (error) {
      document.execCommand("copy");
    }
  });

  [
    criteriaInput,
    stateSelect,
    actorInput,
    noteInput,
    criteriaIdInput,
    replayIdInput,
    rollbackIdInput,
    auditIdInput,
    answerInput,
    recordInput,
    familyInput,
    targetInput,
    routeInput,
    planInput,
    chainInput,
    noWriteInput,
    rollbackInput,
    blockersInput,
    founderInput,
    resultInput,
    boundaryInput,
    questionInput,
    returnInput,
    holdInput,
    blockInput
  ].forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  loadSample();
  render();
}

window.vedapathControlledStorageEntryDryRun = {
  controlledStorageEntryDryRun,
  entryDryRunSnapshot,
  entryMissingForState,
  parseEntryJson
};

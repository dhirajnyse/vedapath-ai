import fs from "node:fs";
import path from "node:path";

const release = "v3.0.8";
const badge = `${release} entry dry run`;

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

function criteriaData() {
  return JSON.parse(read("data/vedapath-controlled-storage-entry-criteria.json"));
}

function sampleCriteriaPacket(config) {
  const criteria = config.sample_criteria || {};
  return {
    schema_version: config.schema_version,
    release: config.release,
    criteria_packet_id: "criteria-packet-sample-entry-dry-run",
    criteria_status: "Entry criteria ready",
    criteria_ready: true,
    production_ready: false,
    controlled_storage_entry_allowed: false,
    canonical_write_allowed: false,
    storage_write_enabled: false,
    source_write_executed: false,
    ...criteria,
    missing: [],
    blocked: [],
    warnings: [
      "Entry dry run only; not production storage approval.",
      config.criteria_policy
    ],
    replay_receipt: config.sample_replay_receipt,
    created_at: "2026-06-27T00:00:00.000Z"
  };
}

function writeEntryData() {
  const criteriaConfig = criteriaData();
  const criteriaPacket = sampleCriteriaPacket(criteriaConfig);
  const sampleEntry = {
    entry_state: "Entry dry run passed",
    entry_actor: "Storage entry dry-run reviewer",
    entry_note: "Run the criteria packet against the entry gate without enabling writes.",
    criteria_packet_id: criteriaPacket.criteria_packet_id,
    replay_receipt_id: criteriaPacket.replay_receipt_id,
    rollback_receipt_id: criteriaPacket.rollback_receipt_id,
    audit_receipt_id: criteriaPacket.audit_receipt_id,
    source_answer_id: criteriaPacket.source_answer_id,
    source_record_id: criteriaPacket.source_record_id,
    source_family: criteriaPacket.source_family,
    storage_target: "Controlled source-answer storage preview.",
    schema_route: "Draft packet to audit receipt to rollback receipt to replay receipt to criteria packet to founder instruction gate; canonical records stay unchanged.",
    dry_run_plan: "Simulate entry validation only; no database write, no table write, no account write, and no source record write.",
    receipt_chain_check: "Pass: audit, rollback, replay, and criteria ids are present and ready.",
    no_write_check: "Pass: controlled_storage_entry_allowed false, storage_write_enabled false, canonical_write_allowed false, and source_write_executed false.",
    rollback_simulation: "Pass: restore before_hash, discard after_hash, and keep canonical source data unchanged.",
    promotion_blockers: "Founder instruction missing; production identity, durable storage, migration, monitoring, and rights review are not granted in this preview.",
    founder_instruction_check: "Founder instruction is required and not granted in this preview.",
    simulated_result: "Would pass the no-write entry dry run, but real controlled storage remains closed.",
    entry_boundary: "Dry run only; controlled_storage_entry_allowed remains false, canonical_write_allowed remains false, storage_write_enabled remains false, and source_write_executed remains false.",
    review_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  };

  write("data/vedapath-controlled-storage-entry-dry-run.json", JSON.stringify({
    product: "VedaPath AI",
    release,
    status: "controlled storage entry dry run v1",
    schema_version: "controlled-storage-entry-dry-run-v1",
    criteria_dataset: "data/vedapath-controlled-storage-entry-criteria.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_entry_store: "vedapath-controlled-storage-entry-dry-run-v1",
    warning: "This release runs a storage-entry simulation only. It does not write canonical source records, enable storage writes, create accounts, bypass reviewer approval, provide therapy, give ritual instruction, or become spiritual authority.",
    entry_policy: "A controlled storage entry dry run can pass only from ready entry criteria. It must prove criteria readiness, receipt chain, schema route, dry-run plan, no-write check, rollback simulation, promotion blockers, founder instruction check, simulated result, and entry boundary while all real write flags remain false.",
    entry_states: [
      "Draft entry dry run",
      "Needs entry review",
      "Entry dry run passed",
      "Return to criteria",
      "Founder hold",
      "Entry dry run blocked"
    ],
    required_by_state: {
      "Draft entry dry run": ["entry_actor", "entry_note"],
      "Needs entry review": ["entry_actor", "entry_note", "review_question"],
      "Entry dry run passed": [
        "entry_actor",
        "entry_note",
        "criteria_packet_id",
        "replay_receipt_id",
        "rollback_receipt_id",
        "audit_receipt_id",
        "source_answer_id",
        "storage_target",
        "schema_route",
        "dry_run_plan",
        "receipt_chain_check",
        "no_write_check",
        "rollback_simulation",
        "promotion_blockers",
        "founder_instruction_check",
        "simulated_result",
        "entry_boundary"
      ],
      "Return to criteria": ["entry_actor", "entry_note", "return_reason"],
      "Founder hold": ["entry_actor", "entry_note", "hold_reason"],
      "Entry dry run blocked": ["entry_actor", "entry_note", "block_reason"]
    },
    entry_checks: [
      { check: "Criteria packet", rule: "Input criteria packet must be ready and still no-write." },
      { check: "Receipt chain", rule: "Audit, rollback, replay, criteria, and source ids are present." },
      { check: "Schema route", rule: "Route separates drafts, receipts, replay, criteria, founder gate, and canonical records." },
      { check: "No-write check", rule: "Controlled storage, storage writes, canonical writes, and source writes remain false." },
      { check: "Rollback rehearsal", rule: "Dry run can restore before_hash and discard after_hash without source changes." },
      { check: "Promotion blockers", rule: "Founder instruction and production readiness gaps remain visible." },
      { check: "Founder instruction", rule: "Final founder instruction is required and not granted in preview." },
      { check: "Entry boundary", rule: "Passing the dry run is not permission to write." }
    ],
    sample_criteria_packet: criteriaPacket,
    sample_entry: sampleEntry
  }, null, 2));
}

function writeEntryCss() {
  write("assets/vedapath-controlled-storage-entry-dry-run.css", `/* VedaPath controlled storage entry dry run */
.entry-app,
.entry-head,
.entry-layout,
.entry-form,
.entry-grid,
.entry-list,
.entry-actions,
.entry-rules {
  display: grid;
  gap: 10px;
}

.entry-app {
  gap: 16px;
}

.entry-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.entry-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.entry-mark img {
  display: block;
  width: 100%;
}

.entry-layout {
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  align-items: start;
}

.entry-form,
.entry-card,
.entry-result,
.entry-packet,
.entry-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.entry-form,
.entry-card,
.entry-result,
.entry-rule {
  padding: 12px;
}

.entry-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.entry-form input,
.entry-form select,
.entry-form textarea,
.entry-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.entry-form textarea,
.entry-packet {
  min-height: 104px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.entry-grid,
.entry-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.entry-card,
.entry-result {
  border-left: 4px solid var(--gold);
}

.entry-card.ready,
.entry-result[data-state="Entry dry run passed"] {
  border-left-color: var(--green);
}

.entry-card.blocked,
.entry-result[data-state="Blocked"],
.entry-result[data-state="Return to criteria"],
.entry-result[data-state="Founder hold"],
.entry-result[data-state="Entry dry run blocked"] {
  border-left-color: var(--ochre);
}

.entry-card span,
.entry-card strong,
.entry-rule span,
.entry-rule strong {
  display: block;
}

.entry-card span,
.entry-rule span {
  color: var(--muted);
  font-size: 12px;
}

.entry-result strong {
  display: block;
  font-size: 24px;
}

.entry-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.entry-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.entry-list {
  max-height: 320px;
  overflow: auto;
}

.entry-packet {
  min-height: 260px;
}

@media (max-width: 980px) {
  .entry-layout,
  .entry-head,
  .entry-grid,
  .entry-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .entry-actions {
    grid-template-columns: 1fr;
  }
}
`);
}

function writeEntryJs() {
  write("assets/vedapath-controlled-storage-entry-dry-run.js", `const entryRoot = document.getElementById("controlledStorageEntryDryRun");

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
`);
}

function writeEntryPage() {
  write("controlledstorageentrydryrun.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Storage Entry Dry Run</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-storage-entry-dry-run.css">
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
            <span>Controlled storage entry dry run</span>
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

      <main class="workspace" aria-label="VedaPath Controlled Storage Entry Dry Run workspace">
        <aside class="panel">
          <span class="eyebrow">Dry-run only</span>
          <h2>Test the gate without opening it</h2>
          <p class="muted">This room simulates controlled storage entry from the criteria packet while keeping storage, canonical, and source writes false.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Criteria</strong><p>Load ready packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Route</strong><p>Trace schema path.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Simulate</strong><p>Run no-write gate.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Hold</strong><p>Founder gate remains.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledstoragecriteria.html">Open Criteria</a>
            <a class="button safe" href="replayreceiptdryrun.html">Open Replay Receipt</a>
          </div>
        </aside>

        <section class="panel entry-app" id="controlledStorageEntryDryRun">
          <div class="entry-head">
            <div>
              <span class="eyebrow">Entry simulation</span>
              <h1>Pass the dry run. Keep storage closed.</h1>
              <p class="muted">A pass here means the gate shape is coherent. It still does not grant controlled storage entry.</p>
            </div>
            <div class="entry-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath controlled storage entry mark"></div>
          </div>

          <section class="entry-layout">
            <div class="entry-form">
              <h2>Entry Dry Run Packet</h2>
              <label>Criteria packet<textarea id="entryCriteriaPacket"></textarea></label>
              <label>Entry state<select id="entryState"></select></label>
              <label>Entry actor<input id="entryActor" type="text" placeholder="Storage entry dry-run reviewer"></label>
              <label>Entry note<textarea id="entryNote"></textarea></label>
              <label>Criteria packet id<input id="entryCriteriaId" type="text"></label>
              <label>Replay receipt id<input id="entryReplayId" type="text"></label>
              <label>Rollback receipt id<input id="entryRollbackId" type="text"></label>
              <label>Audit receipt id<input id="entryAuditId" type="text"></label>
              <label>Source answer id<input id="entrySourceAnswer" type="text"></label>
              <label>Source record id<input id="entrySourceRecord" type="text"></label>
              <label>Source family<input id="entrySourceFamily" type="text"></label>
              <label>Storage target<textarea id="entryStorageTarget"></textarea></label>
              <label>Schema route<textarea id="entrySchemaRoute"></textarea></label>
              <label>Dry-run plan<textarea id="entryDryRunPlan"></textarea></label>
              <label>Receipt chain check<textarea id="entryReceiptChain"></textarea></label>
              <label>No-write check<textarea id="entryNoWriteCheck"></textarea></label>
              <label>Rollback simulation<textarea id="entryRollbackSimulation"></textarea></label>
              <label>Promotion blockers<textarea id="entryPromotionBlockers"></textarea></label>
              <label>Founder instruction check<textarea id="entryFounderInstruction"></textarea></label>
              <label>Simulated result<textarea id="entrySimulatedResult"></textarea></label>
              <label>Entry boundary<textarea id="entryBoundary"></textarea></label>
              <label>Review question<textarea id="entryReviewQuestion"></textarea></label>
              <label>Return reason<textarea id="entryReturnReason"></textarea></label>
              <label>Hold reason<textarea id="entryHoldReason"></textarea></label>
              <label>Block reason<textarea id="entryBlockReason"></textarea></label>
              <div class="entry-actions">
                <button class="button primary" id="runEntryDryRun" type="button">Run Entry</button>
                <button class="button safe" id="loadEntrySample" type="button">Load Sample</button>
                <button class="button" id="saveEntryDryRun" type="button">Save Local</button>
                <button class="button" id="clearEntryDryRuns" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="entry-result" id="entryResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Criteria Scope</h2>
                <div class="entry-list" id="entryCriteriaScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Entry Checks</h2>
            <div class="entry-rules" id="entryChecks"></div>
          </section>

          <section class="entry-layout">
            <div>
              <div class="entry-actions">
                <button class="button safe" id="copyEntryPacket" type="button">Copy Entry Packet</button>
                <a class="button" href="data/vedapath-controlled-storage-entry-dry-run.json">Open JSON</a>
              </div>
              <textarea class="entry-packet" id="entryPacket" aria-label="Controlled storage entry dry-run packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Entry Runs</h2>
              <div class="entry-list" id="entrySaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Simulation pass</span>
          <h2 style="margin-top: 14px;">Passing Is Not Permission</h2>
          <p class="muted">The dry run can pass while real storage remains closed and final founder instruction remains absent.</p>
          <div class="progress" aria-label="Controlled storage entry dry run progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>6</strong></div>
            <div class="metric"><span>Writes</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Founder gate</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Founder Boundary</h2>
            <p class="muted">Final founder instruction remains required and not granted. No production storage, account, or canonical source write occurs.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-storage-entry-dry-run.js"></script>
  </body>
</html>
`);
}

function updateNavigationLinks() {
  let criteria = read("controlledstoragecriteria.html");
  if (!criteria.includes("controlledstorageentrydryrun.html")) {
    criteria = criteria.replace(
      '<a class="button primary" href="replayreceiptdryrun.html">Open Replay Receipt</a>\n            <a class="button safe" href="storagedesigngate.html">Open Storage Design</a>',
      '<a class="button primary" href="controlledstorageentrydryrun.html">Open Entry Dry Run</a>\n            <a class="button safe" href="replayreceiptdryrun.html">Open Replay Receipt</a>\n            <a class="button" href="storagedesigngate.html">Open Storage Design</a>'
    );
    criteria = criteria.replace(
      "This release defines the criteria. It does not grant controlled storage entry or execute a write.",
      "The entry dry run now tests these criteria while still blocking every real write."
    );
    criteria = criteria.replace(
      "Final founder instruction is required before any real storage entry. This preview deliberately does not grant it.",
      "Entry dry run can pass, but final founder instruction still remains required before any real storage entry."
    );
    write("controlledstoragecriteria.html", criteria);
  }
}

function updateIndex() {
  let content = read("index.html");
  if (!content.includes('controlledstorageentrydryrun.html">Entry dry run')) {
    content = content
      .replace(
        '<a href="controlledstoragecriteria.html">Storage criteria <span>entry gate</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>',
        '<a href="controlledstoragecriteria.html">Storage criteria <span>entry gate</span></a>\n              <a href="controlledstorageentrydryrun.html">Entry dry run <span>no-write</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>'
      )
      .replace(
        '<a href="controlledstoragecriteria.html">Storage criteria <span>gate</span></a>\n            </div>',
        '<a href="controlledstoragecriteria.html">Storage criteria <span>gate</span></a>\n              <a href="controlledstorageentrydryrun.html">Entry dry run <span>gate</span></a>\n            </div>'
      );
  }
  content = content.replace(
    "controlled storage dry runs, source promotion, and production memory.",
    "founder instruction gates, source promotion, and production memory."
  );
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = updateVersionBadge(content)
    .replace(/<strong>v3\.0\.7<\/strong>\s*<p>Controlled Storage Entry Criteria:[\s\S]*?<\/p>/, '<strong>v3.0.8</strong>\n          <p>Controlled Storage Entry Dry Run: ready criteria packets now run through a no-write entry simulation with schema route, rollback rehearsal, promotion blockers, founder hold, and every real write flag false.</p>')
    .replace(/<strong>89%<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:89%"><\/div><\/div>\s*<p>The trust loop now defines the exact storage entry criteria before any production write exists\.<\/p>/, '<strong>90%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:90%"></div></div>\n          <p>The trust loop now dry-runs controlled storage entry while keeping the real gate closed.</p>')
    .replace(/<strong>Controlled storage entry dry run<\/strong>\s*<p>Run the criteria packet against a no-write storage-entry simulation\.<\/p>/, '<strong>Founder storage instruction gate</strong>\n          <p>Define the explicit founder-only instruction that would be required before controlled storage can open.</p>')
    .replace('<div class="percent">89%</div>', '<div class="percent">90%</div>');

  const entryPhase = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 272: Controlled Storage Entry Dry Run</strong>
                <p>Runs ready criteria packets through a no-write storage-entry simulation with schema route, rollback rehearsal, promotion blockers, founder hold, and every real write flag false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
`;
  if (!content.includes("Phase 272: Controlled Storage Entry Dry Run")) {
    content = content.replace(
      `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 272: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
      `${entryPhase}            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 273: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
  }

  content = content
    .replace('<div class="version-row"><span>Release</span><strong>v3.0.7 Controlled Storage Entry Criteria</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.0.8 Controlled Storage Entry Dry Run</strong></div>')
    .replace('<div class="version-row"><span>Previous</span><strong>v3.0.6 Replay Receipt Dry Run</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.0.7 Controlled Storage Entry Criteria</strong></div>')
    .replace('<div class="version-row"><span>Goal</span><strong>Define controlled storage entry criteria before any source storage write.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Dry-run controlled storage entry before any source storage write.</strong></div>')
    .replace('<div class="version-row"><span>Status</span><strong>Ready for controlled storage entry dry run</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for founder storage instruction gate</strong></div>')
    .replace(`<li><span class="dot"></span><span>Run a no-write storage-entry dry run.</span></li>
              <li><span class="dot"></span><span>Use the criteria packet as input.</span></li>
              <li><span class="dot"></span><span>Show pass, return, hold, and block outcomes.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`, `<li><span class="dot"></span><span>Define founder storage instruction language.</span></li>
              <li><span class="dot"></span><span>Separate founder approval from storage execution.</span></li>
              <li><span class="dot"></span><span>Keep pass, return, hold, and block outcomes visible.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN START -->", "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN END -->", `## ${release} Controlled Storage Entry Dry Run

This release adds the controlled storage entry dry-run layer after storage criteria.

- adds controlledstorageentrydryrun.html
- adds data/vedapath-controlled-storage-entry-dry-run.json
- runs ready criteria packets through a no-write storage-entry simulation
- proves schema route, receipt chain, dry-run plan, no-write check, rollback simulation, promotion blockers, founder instruction check, simulated result, and entry boundary
- keeps controlled_storage_entry_allowed false, source_write_executed false, storage_write_enabled false, production_ready false, and canonical_write_allowed false
- sets the next release as founder storage instruction gate`, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY CRITERIA START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN NOTES START -->", "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN NOTES END -->", `## ${release} Controlled Storage Entry Dry Run

This phase tests storage-entry readiness without opening storage.

Action taken:

- Added controlled storage entry dry-run schema.
- Added entry states for draft, review, passed, return, founder hold, and blocked.
- Required criteria packet readiness, schema route, receipt chain, dry-run plan, no-write check, rollback simulation, promotion blockers, founder instruction check, simulated result, and entry boundary.
- Added copyable entry dry-run packets and local entry history.
- Preserved canonical source data and kept all write flags false.`, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY CRITERIA NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN BLUEPRINT START -->", "<!-- VEDAPATH CONTROLLED STORAGE ENTRY DRY RUN BLUEPRINT END -->", `### 291. Controlled Storage Entry Dry Run

VedaPath should prove the entry gate can be tested without opening it.

Rules:

- Entry dry run can start only from a ready criteria packet.
- A passed entry dry run must include schema route, receipt chain, no-write check, rollback simulation, promotion blockers, founder instruction check, simulated result, and entry boundary.
- Passing the dry run is not controlled storage permission.
- Source writes, storage writes, controlled storage entry, and canonical writes remain false in preview.
- The next build should define the founder storage instruction gate before any real entry could be considered.`, "<!-- VEDAPATH CONTROLLED STORAGE ENTRY CRITERIA BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/CONTROLLED_STORAGE_ENTRY_DRY_RUN.md", `# VedaPath AI Controlled Storage Entry Dry Run

Release: ${release}

This release adds the controlled storage entry dry-run layer after storage criteria.

## Files

- data/vedapath-controlled-storage-entry-dry-run.json
- controlledstorageentrydryrun.html
- assets/vedapath-controlled-storage-entry-dry-run.css
- assets/vedapath-controlled-storage-entry-dry-run.js

## What It Adds

The room:

- reads a criteria packet
- confirms the packet is ready and still no-write
- checks schema route and receipt chain
- simulates storage entry without storage writes
- checks rollback rehearsal and promotion blockers
- keeps founder instruction required and not granted
- exports a copyable entry dry-run packet

## Boundary

Controlled storage entry dry run is not production storage. Passing the simulation does not grant controlled storage entry, write canonical source data, create accounts, or change source records. The next release should define the founder storage instruction gate.
`);
}

writeEntryData();
writeEntryCss();
writeEntryJs();
writeEntryPage();
updateAllHtmlShells();
updateNavigationLinks();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} controlled storage entry dry run applied.`);

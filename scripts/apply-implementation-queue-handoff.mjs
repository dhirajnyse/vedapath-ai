import fs from "node:fs";
import path from "node:path";

const release = "v3.0.0";
const badge = `${release} queue`;

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

function pointReviewNavToQueue(content, isBrandPage = false) {
  const prefix = isBrandPage ? "../" : "";
  return content
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}implementationqueue.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`)
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}sourceownerapproval.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`)
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}reviewqueuepersistence\\.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`);
}

function updateAllHtmlShells() {
  for (const file of fs.readdirSync(".")) {
    if (!file.endsWith(".html")) continue;
    write(file, pointReviewNavToQueue(updateVersionBadge(read(file))));
  }
  const brandFile = path.join("brand", "brand-board.html");
  if (fs.existsSync(brandFile)) {
    write(brandFile, pointReviewNavToQueue(updateVersionBadge(read(brandFile)), true));
  }
}

function activateReviewLane(file) {
  if (!fs.existsSync(file)) return;
  let content = read(file);
  content = content.replace(
    '<a class="link" href="reviewqueuepersistence.html">Review</a>',
    '<a class="link active" href="reviewqueuepersistence.html">Review</a>'
  );
  write(file, content);
}

function ownerConfig() {
  return JSON.parse(read("data/vedapath-source-owner-approval-lane.json"));
}

function ownerDecisionPacket(config) {
  const owner = config.sample_owner_decision;
  const reviewPacket = config.sample_review_packet;
  return {
    schema_version: config.schema_version,
    release: config.release,
    owner_decision_id: "source-owner-decision-sample-implementation-queue",
    owner_status: "Owner approved for implementation queue",
    production_ready: false,
    implementation_queue_ready: true,
    proposal_id: reviewPacket.proposal_id,
    source_answer_id: reviewPacket.source_answer_id,
    source_record_id: reviewPacket.source_record_id,
    source_family: reviewPacket.source_family,
    source_owner: owner.owner_name,
    decision_state: owner.decision_state,
    owner_note: owner.owner_note,
    approval_scope: owner.approval_scope,
    blocked_field_disposition: owner.blocked_field_disposition,
    return_reason: owner.return_reason,
    rejection_reason: owner.rejection_reason,
    rollback_instruction: owner.rollback_instruction,
    implementation_guard: owner.implementation_guard,
    missing: [],
    blocked: [],
    warnings: [
      "Blocked fields remain outside owner approval scope.",
      config.approval_policy
    ],
    review_packet_status: "Ready for source owner",
    reviewed_diff_count: reviewPacket.reviewed_diff_count,
    blocked_field_count: reviewPacket.blocked_field_count,
    review_packet: reviewPacket,
    created_at: "2026-06-27T00:00:00.000Z"
  };
}

function writeQueueData() {
  const config = ownerConfig();
  const ownerPacket = ownerDecisionPacket(config);
  const data = {
    product: "VedaPath AI",
    release,
    status: "implementation queue handoff v1",
    schema_version: "implementation-queue-handoff-v1",
    owner_lane_dataset: "data/vedapath-source-owner-approval-lane.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_queue_store: "vedapath-implementation-queue-v1",
    warning: "This queue creates scoped implementation tasks only. It does not edit canonical records, publish source data, bypass reviewer or owner approval, verify rights, certify scholarship, provide therapy, give ritual instruction, or become spiritual authority.",
    queue_policy: "An implementation task may be drafted only from an owner-approved packet. Canonical writes remain blocked until production storage, immutable audit, rollback controls, and final release approval exist.",
    task_states: [
      "Draft implementation task",
      "Needs engineering review",
      "Ready for production dry run",
      "Returned to owner",
      "Blocked"
    ],
    required_by_state: {
      "Draft implementation task": ["implementer_name", "task_note"],
      "Needs engineering review": ["implementer_name", "task_note", "engineering_question"],
      "Ready for production dry run": [
        "implementer_name",
        "task_note",
        "implementation_plan",
        "test_plan",
        "rollback_plan",
        "canonical_write_guard"
      ],
      "Returned to owner": ["implementer_name", "task_note", "return_reason"],
      "Blocked": ["implementer_name", "task_note", "block_reason"]
    },
    canonical_write_guard_options: [
      "Canonical writes blocked",
      "Dry-run only",
      "Needs production storage",
      "Needs final release approval"
    ],
    sample_owner_packet: ownerPacket,
    sample_queue_task: {
      task_state: "Ready for production dry run",
      implementer_name: "Implementation lead",
      task_note: "Prepare a dry-run task for the approved boundary/readiness fields only.",
      implementation_plan: "Create a non-canonical patch packet for review_state, readiness, and boundary copy only.",
      engineering_question: "",
      test_plan: "Check that source, citation, and canonical text fields remain unchanged; verify generated packet can be discarded cleanly.",
      rollback_plan: "Rollback by deleting the implementation task and keeping source-answer records unchanged.",
      canonical_write_guard: "Canonical writes blocked",
      return_reason: "",
      block_reason: ""
    }
  };
  write("data/vedapath-implementation-queue-handoff.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeQueueCss() {
  write("assets/vedapath-implementation-queue-handoff.css", `/* VedaPath implementation queue handoff */
.queue-app,
.queue-head,
.queue-layout,
.queue-form,
.queue-grid,
.queue-list,
.queue-actions,
.queue-rules {
  display: grid;
  gap: 10px;
}

.queue-app {
  gap: 16px;
}

.queue-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.queue-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.queue-mark img {
  display: block;
  width: 100%;
}

.queue-layout {
  grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
  align-items: start;
}

.queue-form,
.queue-card,
.queue-result,
.queue-packet,
.queue-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.queue-form,
.queue-card,
.queue-result,
.queue-rule {
  padding: 12px;
}

.queue-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.queue-form input,
.queue-form select,
.queue-form textarea,
.queue-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.queue-form textarea,
.queue-packet {
  min-height: 116px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.queue-grid,
.queue-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.queue-card,
.queue-result {
  border-left: 4px solid var(--gold);
}

.queue-card.ready,
.queue-result[data-state="Ready for production dry run"] {
  border-left-color: var(--green);
}

.queue-card.blocked,
.queue-result[data-state="Blocked"],
.queue-result[data-state="Returned to owner"] {
  border-left-color: var(--ochre);
}

.queue-card span,
.queue-card strong,
.queue-rule span,
.queue-rule strong {
  display: block;
}

.queue-card span,
.queue-rule span {
  color: var(--muted);
  font-size: 12px;
}

.queue-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.queue-list {
  max-height: 290px;
  overflow: auto;
  padding-right: 3px;
}

@media (max-width: 980px) {
  .queue-head,
  .queue-layout,
  .queue-grid,
  .queue-rules {
    grid-template-columns: 1fr;
  }

  .queue-mark {
    max-width: 150px;
  }
}

@media (max-width: 680px) {
  .queue-actions,
  .queue-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeQueueJs() {
  write("assets/vedapath-implementation-queue-handoff.js", `const queueRoot = document.getElementById("implementationQueueHandoff");

if (queueRoot) {
  initImplementationQueueHandoff().catch((error) => {
    queueRoot.innerHTML = '<article class="queue-result"><strong>Implementation queue could not load.</strong></article>';
    console.error(error);
  });
}

function queueSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseQueueJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function queueMissingForState(config, task) {
  const required = config.required_by_state?.[task.task_state] || [];
  return required.filter((field) => !String(task[field] ?? "").trim());
}

function guardBlocksCanonical(value) {
  return /(blocked|dry-run|storage|final release)/i.test(String(value || ""));
}

function implementationQueueHandoff(config, ownerPacket, task) {
  const missing = queueMissingForState(config, task);
  const blocked = [];
  const warnings = [];
  const isDryRunReady = task.task_state === "Ready for production dry run";
  const ownerReady = ownerPacket?.owner_status === "Owner approved for implementation queue" || ownerPacket?.implementation_queue_ready === true;

  if (!ownerPacket || typeof ownerPacket !== "object") missing.push("owner packet");
  if (isDryRunReady && !ownerReady) blocked.push("owner packet is not approved for implementation queue");
  if (isDryRunReady && !guardBlocksCanonical(task.canonical_write_guard)) blocked.push("canonical write guard must block source mutation");
  if (ownerPacket?.production_ready === true) warnings.push("Queue treats production readiness as false until storage and audit exist.");
  if (Number(ownerPacket?.blocked_field_count || 0) > 0) warnings.push("Blocked fields remain out of implementation scope.");

  const canAdvance = missing.length === 0 && blocked.length === 0;
  const task_status = !canAdvance ? "Blocked" : task.task_state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    implementation_task_id: "implementation-task-" + Date.now(),
    task_status,
    production_ready: false,
    canonical_write_allowed: false,
    dry_run_ready: task_status === "Ready for production dry run",
    proposal_id: ownerPacket?.proposal_id || "",
    source_answer_id: ownerPacket?.source_answer_id || "",
    source_record_id: ownerPacket?.source_record_id || "",
    source_family: ownerPacket?.source_family || "",
    source_owner: ownerPacket?.source_owner || "",
    task_state: task.task_state,
    implementer_name: task.implementer_name || "",
    task_note: task.task_note || "",
    implementation_plan: task.implementation_plan || "",
    engineering_question: task.engineering_question || "",
    test_plan: task.test_plan || "",
    rollback_plan: task.rollback_plan || "",
    canonical_write_guard: task.canonical_write_guard || "",
    return_reason: task.return_reason || "",
    block_reason: task.block_reason || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.queue_policy
    ],
    owner_status: ownerPacket?.owner_status || "Unknown",
    owner_decision_id: ownerPacket?.owner_decision_id || "",
    created_at: new Date().toISOString()
  };
}

function implementationQueueSnapshot(tasks, config) {
  const byStatus = tasks.reduce((counts, task) => {
    const key = task.task_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: tasks.length,
    blocked: byStatus.Blocked || 0,
    draft: byStatus["Draft implementation task"] || 0,
    engineering_review: byStatus["Needs engineering review"] || 0,
    dry_run_ready: byStatus["Ready for production dry run"] || 0,
    returned: byStatus["Returned to owner"] || 0,
    tasks
  };
}

async function queueLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readQueueStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeQueueStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initImplementationQueueHandoff() {
  const config = await queueLoadJson("data/vedapath-implementation-queue-handoff.json");
  const storeKey = config.local_queue_store;
  let tasks = readQueueStore(storeKey);
  let activeTask = null;

  const ownerInput = queueRoot.querySelector("#queueOwnerPacket");
  const stateSelect = queueRoot.querySelector("#queueTaskState");
  const implementerInput = queueRoot.querySelector("#queueImplementer");
  const noteInput = queueRoot.querySelector("#queueNote");
  const planInput = queueRoot.querySelector("#queuePlan");
  const questionInput = queueRoot.querySelector("#queueQuestion");
  const testInput = queueRoot.querySelector("#queueTestPlan");
  const rollbackInput = queueRoot.querySelector("#queueRollback");
  const guardInput = queueRoot.querySelector("#queueGuard");
  const returnInput = queueRoot.querySelector("#queueReturnReason");
  const blockInput = queueRoot.querySelector("#queueBlockReason");
  const resultEl = queueRoot.querySelector("#queueResult");
  const packetEl = queueRoot.querySelector("#queuePacket");
  const scopeEl = queueRoot.querySelector("#queueScope");
  const rulesEl = queueRoot.querySelector("#queueRules");
  const savedEl = queueRoot.querySelector("#queueSaved");
  const reviewButton = queueRoot.querySelector("#reviewQueueTask");
  const sampleButton = queueRoot.querySelector("#loadQueueSample");
  const saveButton = queueRoot.querySelector("#saveQueueTask");
  const clearButton = queueRoot.querySelector("#clearQueueTasks");
  const copyButton = queueRoot.querySelector("#copyQueuePacket");

  stateSelect.innerHTML = (config.task_states || []).map((state) => '<option value="' + queueSafe(state) + '">' + queueSafe(state) + '</option>').join("");

  function loadSample() {
    ownerInput.value = JSON.stringify(config.sample_owner_packet, null, 2);
    stateSelect.value = config.sample_queue_task.task_state;
    implementerInput.value = config.sample_queue_task.implementer_name;
    noteInput.value = config.sample_queue_task.task_note;
    planInput.value = config.sample_queue_task.implementation_plan;
    questionInput.value = config.sample_queue_task.engineering_question;
    testInput.value = config.sample_queue_task.test_plan;
    rollbackInput.value = config.sample_queue_task.rollback_plan;
    guardInput.value = config.sample_queue_task.canonical_write_guard;
    returnInput.value = config.sample_queue_task.return_reason;
    blockInput.value = config.sample_queue_task.block_reason;
  }

  function taskFromForm() {
    return {
      task_state: stateSelect.value,
      implementer_name: implementerInput.value.trim(),
      task_note: noteInput.value.trim(),
      implementation_plan: planInput.value.trim(),
      engineering_question: questionInput.value.trim(),
      test_plan: testInput.value.trim(),
      rollback_plan: rollbackInput.value.trim(),
      canonical_write_guard: guardInput.value.trim(),
      return_reason: returnInput.value.trim(),
      block_reason: blockInput.value.trim()
    };
  }

  function renderScope(ownerPacket) {
    const reviewPacket = ownerPacket?.review_packet;
    const proposal = reviewPacket?.proposal;
    const diffs = proposal?.diffs || [];
    const blockedFields = proposal?.blocked_fields || [];
    scopeEl.innerHTML = [
      '<article class="queue-card ready"><span>Owner status</span><strong>' + queueSafe(ownerPacket?.owner_status || "Unknown") + '</strong><span>Scope</span><strong>' + queueSafe(ownerPacket?.approval_scope || "No scope") + '</strong></article>',
      ...diffs.map((diff) => '<article class="queue-card ready"><span>Allowed dry-run field</span><strong>' + queueSafe(diff.field) + '</strong><span>Proposed</span><strong>' + queueSafe(diff.proposed_value) + '</strong></article>'),
      ...blockedFields.map((field) => '<article class="queue-card blocked"><span>Never write</span><strong>' + queueSafe(field.field) + '</strong><span>Reason</span><strong>' + queueSafe(field.reason) + '</strong></article>')
    ].join("");
  }

  function renderRules() {
    rulesEl.innerHTML = [
      ["Store", storeKey],
      ["Task states", (config.task_states || []).join(", ")],
      ["Canonical writes", "Always false in this preview"],
      ["Boundary", config.warning]
    ].map((row) => '<article class="queue-rule"><span>' + queueSafe(row[0]) + '</span><strong>' + queueSafe(row[1]) + '</strong></article>').join("");
  }

  function renderSaved() {
    savedEl.innerHTML = tasks.slice(0, 8).map((task) => (
      '<article class="queue-card">' +
        '<span>' + queueSafe(task.created_at) + '</span>' +
        '<strong>' + queueSafe(task.task_status) + '</strong>' +
        '<span>' + queueSafe((task.source_answer_id || "task") + " | " + task.implementer_name) + '</span>' +
      '</article>'
    )).join("") || '<article class="queue-card"><strong>No implementation tasks yet</strong><span>Review and save one task to begin.</span></article>';
  }

  function renderTask() {
    const ownerPacket = parseQueueJson(ownerInput.value, {});
    const task = taskFromForm();
    const result = implementationQueueHandoff(config, ownerPacket, task);
    activeTask = result;
    resultEl.dataset.state = result.task_status;
    resultEl.innerHTML = [
      '<span class="badge ' + (result.task_status === "Ready for production dry run" ? 'green' : '') + '">' + queueSafe(result.task_status) + '</span>',
      '<h2>Implementation task packet</h2>',
      '<p class="muted">' + queueSafe(result.source_answer_id || "No source answer") + '</p>',
      '<div class="queue-grid">',
      '<article class="queue-card"><span>Missing</span><strong>' + queueSafe(result.missing.length ? result.missing.join(", ") : "None") + '</strong></article>',
      '<article class="queue-card"><span>Blocked</span><strong>' + queueSafe(result.blocked.length ? result.blocked.join(", ") : "None") + '</strong></article>',
      '<article class="queue-card"><span>Dry run</span><strong>' + queueSafe(result.dry_run_ready ? "Ready" : "No") + '</strong></article>',
      '<article class="queue-card"><span>Canonical write</span><strong>False</strong></article>',
      '</div>'
    ].join("");
    packetEl.value = JSON.stringify(result, null, 2);
    renderScope(ownerPacket);
  }

  [ownerInput, stateSelect, implementerInput, noteInput, planInput, questionInput, testInput, rollbackInput, guardInput, returnInput, blockInput].forEach((el) => {
    el.addEventListener("input", renderTask);
    el.addEventListener("change", renderTask);
  });

  reviewButton.addEventListener("click", renderTask);
  sampleButton.addEventListener("click", () => {
    loadSample();
    renderTask();
  });
  saveButton.addEventListener("click", () => {
    if (!activeTask) renderTask();
    tasks = [activeTask, ...tasks].slice(0, 24);
    writeQueueStore(storeKey, tasks);
    renderSaved();
  });
  clearButton.addEventListener("click", () => {
    tasks = [];
    writeQueueStore(storeKey, tasks);
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
  renderRules();
  renderSaved();
  renderTask();
}

if (typeof window !== "undefined") {
  window.vedapathImplementationQueueHandoff = {
    implementationQueueHandoff,
    implementationQueueSnapshot,
    queueMissingForState,
    parseQueueJson
  };
}
`);
}

function writeQueuePage() {
  write("implementationqueue.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Implementation Queue Handoff</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-implementation-queue-handoff.css">
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
            <span>Implementation queue</span>
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

      <main class="workspace" aria-label="VedaPath Implementation Queue workspace">
        <aside class="panel">
          <span class="eyebrow">Implementation control</span>
          <h2>Turn approval into a task</h2>
          <p class="muted">Owner approval can become an implementation task only when canonical writes remain blocked and rollback stays clear.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Receive</strong><p>Read the owner packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Draft</strong><p>Create a bounded task.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Guard</strong><p>Block canonical writes.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Queue</strong><p>Save dry-run handoff.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button safe" href="sourceownerapproval.html">Open Owner Lane</a>
            <a class="button" href="proposaldiffreview.html">Open Diff Review</a>
          </div>
        </aside>

        <section class="panel queue-app" id="implementationQueueHandoff">
          <div class="queue-head">
            <div>
              <span class="eyebrow">Implementation queue handoff</span>
              <h1>Queue the task. Keep source data still.</h1>
              <p class="muted">This room converts owner-approved packets into local implementation tasks. It can prepare a production dry run, but it cannot write canonical records.</p>
            </div>
            <div class="queue-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath implementation queue mark"></div>
          </div>

          <section class="queue-layout">
            <div class="queue-form">
              <h2>Implementation Task</h2>
              <label>Owner packet<textarea id="queueOwnerPacket"></textarea></label>
              <label>Task state<select id="queueTaskState"></select></label>
              <label>Implementer name<input id="queueImplementer" type="text" placeholder="Implementation lead"></label>
              <label>Task note<textarea id="queueNote"></textarea></label>
              <label>Implementation plan<textarea id="queuePlan"></textarea></label>
              <label>Engineering question<textarea id="queueQuestion"></textarea></label>
              <label>Test plan<textarea id="queueTestPlan"></textarea></label>
              <label>Rollback plan<textarea id="queueRollback"></textarea></label>
              <label>Canonical write guard<input id="queueGuard" type="text" placeholder="Canonical writes blocked"></label>
              <label>Return reason<textarea id="queueReturnReason"></textarea></label>
              <label>Block reason<textarea id="queueBlockReason"></textarea></label>
              <div class="queue-actions">
                <button class="button primary" id="reviewQueueTask" type="button">Review Task</button>
                <button class="button safe" id="loadQueueSample" type="button">Load Sample</button>
                <button class="button" id="saveQueueTask" type="button">Save Local</button>
                <button class="button" id="clearQueueTasks" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="queue-result" id="queueResult" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Allowed Scope</h2>
                <div class="queue-list" id="queueScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Queue Rules</h2>
            <div class="queue-rules" id="queueRules"></div>
          </section>

          <section class="queue-layout">
            <div>
              <div class="queue-actions">
                <button class="button safe" id="copyQueuePacket" type="button">Copy Task Packet</button>
                <a class="button" href="data/vedapath-implementation-queue-handoff.json">Open JSON</a>
              </div>
              <textarea class="queue-packet" id="queuePacket" aria-label="Implementation task packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Tasks</h2>
              <div class="queue-list" id="queueSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Queue handoff</span>
          <h2 style="margin-top: 14px;">Production Boundary</h2>
          <p class="muted">This page creates dry-run tasks only. Production source writes remain false until storage, audit, rollback, and final approval exist.</p>
          <div class="progress" aria-label="Implementation queue progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>5</strong></div>
            <div class="metric"><span>Writes</span><strong>False</strong></div>
            <div class="metric"><span>Store</span><strong>Local</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Queue Rule</h2>
            <p class="muted">A queued implementation task is not a release. It is a dry-run packet that can be reviewed, returned, blocked, or discarded.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-implementation-queue-handoff.js"></script>
  </body>
</html>
`);
}

function updateFlowLinks() {
  let owner = read("sourceownerapproval.html");
  if (!owner.includes("implementationqueue.html")) {
    owner = owner.replace(
      '<a class="button safe" href="proposaldiffreview.html">Open Diff Review</a>\n            <a class="button" href="sourceupdateproposalbridge.html">Open Proposal Bridge</a>',
      '<a class="button primary" href="implementationqueue.html">Open Implementation Queue</a>\n            <a class="button safe" href="proposaldiffreview.html">Open Diff Review</a>\n            <a class="button" href="sourceupdateproposalbridge.html">Open Proposal Bridge</a>'
    );
  }
  write("sourceownerapproval.html", owner);

  for (const file of ["proposaldiffreview.html", "reviewqueuepersistence.html", "reviewidentitygate.html", "sourceupdateproposalbridge.html"]) {
    let content = read(file);
    if (!content.includes("implementationqueue.html") && content.includes("Open Owner Lane")) {
      content = content.replace(
        '<a class="button safe" href="sourceownerapproval.html">Open Owner Lane</a>',
        '<a class="button safe" href="sourceownerapproval.html">Open Owner Lane</a>\n            <a class="button" href="implementationqueue.html">Open Queue</a>'
      );
    }
    write(file, content);
  }
}

function updateIndex() {
  let content = read("index.html");
  if (!content.includes('implementationqueue.html">Implementation')) {
    content = content.replace(
      '<a href="sourceownerapproval.html">Owner approval <span>lane</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>',
      '<a href="sourceownerapproval.html">Owner approval <span>lane</span></a>\n              <a href="implementationqueue.html">Implementation <span>queue</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>'
    );
  }
  if (!content.includes('implementationqueue.html">Queue handoff')) {
    content = content.replace(
      '<a href="sourceownerapproval.html">Owner lane <span>scope</span></a>\n            </div>',
      '<a href="sourceownerapproval.html">Owner lane <span>scope</span></a>\n              <a href="implementationqueue.html">Queue handoff <span>tasks</span></a>\n            </div>'
    );
  }
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = content
    .replace('<strong>v2.9.9</strong>\n          <p>Source Owner Approval Lane: reviewed source proposals now get owner scope, return/reject paths, rollback instructions, and implementation-queue packets.</p>', '<strong>v3.0.0</strong>\n          <p>Implementation Queue Handoff: owner-approved packets now become scoped dry-run tasks with canonical writes blocked.</p>')
    .replace('<strong>80%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:80%"></div></div>\n          <p>The trust loop now has owner approval scope before implementation queue handoff.</p>', '<strong>82%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:82%"></div></div>\n          <p>The trust loop now carries owner approval into implementation tasks without touching canonical data.</p>')
    .replace('<strong>Implementation queue handoff</strong>\n          <p>Turn owner-approved packets into implementation tasks without touching canonical source data.</p>', '<strong>Production dry-run audit</strong>\n          <p>Add immutable task IDs, dry-run results, and release-review gates before storage work.</p>');

  const ownerPhase = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 263: Source Owner Approval Lane</strong>
                <p>Adds owner scope, return and rejection paths, rollback instructions, implementation guards, and copyable owner packets.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  const queuePhase = `${ownerPhase}
            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 264: Implementation Queue Handoff</strong>
                <p>Turns owner-approved packets into scoped dry-run implementation tasks while canonical writes stay blocked.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 264: Implementation Queue Handoff")) {
    content = content.replace(ownerPhase, queuePhase);
    content = content.replace("Phase 264: Production Implementation and Licensed Audio", "Phase 265: Production Implementation and Licensed Audio");
  }

  content = content
    .replace('<div class="version-row"><span>Release</span><strong>v2.9.9 Source Owner Approval Lane</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.0.0 Implementation Queue Handoff</strong></div>')
    .replace('<div class="version-row"><span>Previous</span><strong>v2.9.8 Proposal Diff Review Room</strong></div>', '<div class="version-row"><span>Previous</span><strong>v2.9.9 Source Owner Approval Lane</strong></div>')
    .replace('<div class="version-row"><span>Goal</span><strong>Let source owners approve implementation scope without editing canonical records.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Turn owner-approved packets into dry-run tasks without canonical writes.</strong></div>')
    .replace('<div class="version-row"><span>Status</span><strong>Ready for implementation queue handoff</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for production dry-run audit</strong></div>')
    .replace(`<li><span class="dot"></span><span>Build implementation queue handoff.</span></li>
              <li><span class="dot"></span><span>Add accepted, returned, and rejected owner lanes to review dashboard.</span></li>
              <li><span class="dot"></span><span>Export owner approval packets with immutable IDs.</span></li>
              <li><span class="dot"></span><span>Keep canonical source records untouched until production storage.</span></li>`, `<li><span class="dot"></span><span>Add immutable task IDs and dry-run result history.</span></li>
              <li><span class="dot"></span><span>Create release-review gates for queued tasks.</span></li>
              <li><span class="dot"></span><span>Separate completed dry runs from production storage.</span></li>
              <li><span class="dot"></span><span>Keep canonical source records untouched until production storage.</span></li>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH IMPLEMENTATION QUEUE HANDOFF START -->", "<!-- VEDAPATH IMPLEMENTATION QUEUE HANDOFF END -->", `## ${release} Implementation Queue Handoff

This release turns source-owner approval into dry-run implementation tasks.

- adds \`implementationqueue.html\`
- adds \`data/vedapath-implementation-queue-handoff.json\`
- creates task states for draft, engineering review, dry run, returned, and blocked
- requires implementation plan, test plan, rollback plan, and canonical-write guard before dry run
- keeps production readiness false and canonical source writes blocked`, "<!-- VEDAPATH SOURCE OWNER APPROVAL LANE START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH IMPLEMENTATION QUEUE HANDOFF NOTES START -->", "<!-- VEDAPATH IMPLEMENTATION QUEUE HANDOFF NOTES END -->", `## ${release} Implementation Queue Handoff

This phase adds a local queue between owner approval and production dry run.

Action taken:

- Added implementation queue schema.
- Added task states, engineering review, returned, blocked, and dry-run-ready paths.
- Required implementation, test, rollback, and canonical-write guard fields.
- Added copyable implementation task packets.
- Preserved canonical source data.`, "<!-- VEDAPATH SOURCE OWNER APPROVAL LANE NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH IMPLEMENTATION QUEUE HANDOFF BLUEPRINT START -->", "<!-- VEDAPATH IMPLEMENTATION QUEUE HANDOFF BLUEPRINT END -->", `### 283. Implementation Queue Handoff

VedaPath should convert source-owner approval into scoped engineering work without mutating source records.

Rules:

- Queue tasks can come only from owner-approved packets.
- Canonical writes remain false in preview.
- Dry-run readiness requires implementation, test, rollback, and guard fields.
- Returned or blocked tasks remain visible instead of disappearing.
- The next build should add production dry-run audit history.`, "<!-- VEDAPATH SOURCE OWNER APPROVAL LANE BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/IMPLEMENTATION_QUEUE_HANDOFF.md", `# VedaPath AI Implementation Queue Handoff

Release: ${release}

This release adds the task layer after source-owner approval.

## Files

- \`data/vedapath-implementation-queue-handoff.json\`
- \`implementationqueue.html\`
- \`assets/vedapath-implementation-queue-handoff.css\`
- \`assets/vedapath-implementation-queue-handoff.js\`

## What It Adds

The room:

- reads a source-owner decision packet
- creates scoped implementation tasks
- blocks canonical writes by design
- requires implementation plan, test plan, rollback plan, and canonical-write guard before dry-run readiness
- exports a copyable implementation packet
- stores local task history only

## Boundary

An implementation task is not a source release. It is a local dry-run handoff packet. Production source records still require storage, audit, rollback controls, and release approval.
`);
}

writeQueueData();
writeQueueCss();
writeQueueJs();
writeQueuePage();
updateAllHtmlShells();
for (const file of ["implementationqueue.html", "sourceownerapproval.html", "proposaldiffreview.html", "reviewqueuepersistence.html", "reviewidentitygate.html", "sourceupdateproposalbridge.html"]) {
  activateReviewLane(file);
}
updateFlowLinks();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} implementation queue handoff applied.`);

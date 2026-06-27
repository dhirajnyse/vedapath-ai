const queueRoot = document.getElementById("implementationQueueHandoff");

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

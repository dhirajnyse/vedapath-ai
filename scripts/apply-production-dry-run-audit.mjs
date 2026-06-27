import fs from "node:fs";
import path from "node:path";

const release = "v3.0.1";
const badge = `${release} dry run`;

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

function insertAfter(content, needle, insertion) {
  if (content.includes(insertion.trim())) return content;
  if (!content.includes(needle)) return content;
  return content.replace(needle, `${needle}\n${insertion}`);
}

function queueData() {
  return JSON.parse(read("data/vedapath-implementation-queue-handoff.json"));
}

function sampleImplementationTask(config) {
  const ownerPacket = config.sample_owner_packet;
  const queueTask = config.sample_queue_task;
  return {
    schema_version: config.schema_version,
    release: config.release,
    implementation_task_id: "implementation-task-sample-dry-run",
    task_status: "Ready for production dry run",
    production_ready: false,
    canonical_write_allowed: false,
    dry_run_ready: true,
    proposal_id: ownerPacket.proposal_id,
    source_answer_id: ownerPacket.source_answer_id,
    source_record_id: ownerPacket.source_record_id,
    source_family: ownerPacket.source_family,
    source_owner: ownerPacket.source_owner,
    task_state: queueTask.task_state,
    implementer_name: queueTask.implementer_name,
    task_note: queueTask.task_note,
    implementation_plan: queueTask.implementation_plan,
    engineering_question: queueTask.engineering_question,
    test_plan: queueTask.test_plan,
    rollback_plan: queueTask.rollback_plan,
    canonical_write_guard: queueTask.canonical_write_guard,
    return_reason: queueTask.return_reason,
    block_reason: queueTask.block_reason,
    missing: [],
    blocked: [],
    warnings: [
      "Dry-run task only; not a release.",
      "Canonical source-answer data remains untouched."
    ],
    owner_status: ownerPacket.owner_status,
    owner_decision_id: ownerPacket.owner_decision_id,
    owner_packet: ownerPacket,
    created_at: "2026-06-27T00:00:00.000Z"
  };
}

function writeAuditData() {
  const config = queueData();
  const task = sampleImplementationTask(config);
  const data = {
    product: "VedaPath AI",
    release,
    status: "production dry-run audit v1",
    schema_version: "production-dry-run-audit-v1",
    implementation_queue_dataset: "data/vedapath-implementation-queue-handoff.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_audit_store: "vedapath-production-dry-run-audit-v1",
    warning: "This room records dry-run evidence only. It does not write canonical source records, publish production data, bypass owner approval, certify scholarship, provide therapy, give ritual instruction, or become spiritual authority.",
    audit_policy: "A queued implementation task may enter release review only after dry-run evidence proves canonical writes stayed blocked, rollback is clear, and the source-answer dataset remains unchanged.",
    audit_states: [
      "Not run",
      "Dry run passed",
      "Dry run needs fixes",
      "Release review blocked",
      "Ready for release review"
    ],
    required_by_state: {
      "Not run": ["auditor_name", "audit_note"],
      "Dry run passed": [
        "auditor_name",
        "audit_note",
        "dry_run_result",
        "rollback_evidence",
        "canonical_diff_evidence"
      ],
      "Dry run needs fixes": ["auditor_name", "audit_note", "fix_request"],
      "Release review blocked": ["auditor_name", "audit_note", "block_reason"],
      "Ready for release review": [
        "auditor_name",
        "audit_note",
        "dry_run_result",
        "rollback_evidence",
        "canonical_diff_evidence",
        "release_reviewer"
      ]
    },
    dry_run_checks: [
      {
        check: "Owner approval",
        rule: "The task must come from an owner-approved implementation packet."
      },
      {
        check: "Canonical write guard",
        rule: "Canonical writes must be blocked by the task and audit result."
      },
      {
        check: "Rollback",
        rule: "The dry run must describe how to discard the packet cleanly."
      },
      {
        check: "Source diff",
        rule: "The canonical source-answer dataset must remain unchanged."
      },
      {
        check: "Release review",
        rule: "A named reviewer is required before the task can leave dry run."
      }
    ],
    sample_implementation_task: task,
    sample_audit: {
      audit_state: "Ready for release review",
      auditor_name: "Dry-run reviewer",
      audit_note: "Dry run is ready for release review because source writes remain blocked and rollback is clear.",
      dry_run_result: "No production write executed; task packet can be discarded cleanly.",
      fix_request: "",
      block_reason: "",
      rollback_evidence: "Rollback is deletion of the dry-run packet; canonical source-answer data remains unchanged.",
      canonical_diff_evidence: "No canonical source diff; source-answer dataset unchanged.",
      release_reviewer: "Release reviewer"
    }
  };
  write("data/vedapath-production-dry-run-audit.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeAuditCss() {
  write("assets/vedapath-production-dry-run-audit.css", `/* VedaPath production dry-run audit */
.audit-app,
.audit-head,
.audit-layout,
.audit-form,
.audit-grid,
.audit-list,
.audit-actions,
.audit-rules {
  display: grid;
  gap: 10px;
}

.audit-app {
  gap: 16px;
}

.audit-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.audit-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.audit-mark img {
  display: block;
  width: 100%;
}

.audit-layout {
  grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
  align-items: start;
}

.audit-form,
.audit-card,
.audit-result,
.audit-packet,
.audit-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.audit-form,
.audit-card,
.audit-result,
.audit-rule {
  padding: 12px;
}

.audit-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.audit-form input,
.audit-form select,
.audit-form textarea,
.audit-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.audit-form textarea,
.audit-packet {
  min-height: 112px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.audit-grid,
.audit-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.audit-card,
.audit-result {
  border-left: 4px solid var(--gold);
}

.audit-card.ready,
.audit-result[data-state="Ready for release review"],
.audit-result[data-state="Dry run passed"] {
  border-left-color: var(--green);
}

.audit-card.blocked,
.audit-result[data-state="Blocked"],
.audit-result[data-state="Release review blocked"],
.audit-result[data-state="Dry run needs fixes"] {
  border-left-color: var(--ochre);
}

.audit-card span,
.audit-card strong,
.audit-rule span,
.audit-rule strong {
  display: block;
}

.audit-card span,
.audit-rule span {
  color: var(--muted);
  font-size: 12px;
}

.audit-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.audit-list {
  max-height: 290px;
  overflow: auto;
  padding-right: 3px;
}

@media (max-width: 980px) {
  .audit-head,
  .audit-layout,
  .audit-grid,
  .audit-rules {
    grid-template-columns: 1fr;
  }

  .audit-mark {
    max-width: 150px;
  }
}

@media (max-width: 680px) {
  .audit-actions,
  .audit-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeAuditJs() {
  write("assets/vedapath-production-dry-run-audit.js", `const dryRunRoot = document.getElementById("productionDryRunAudit");

if (dryRunRoot) {
  initProductionDryRunAudit().catch((error) => {
    dryRunRoot.innerHTML = '<article class="audit-result"><strong>Production dry-run audit could not load.</strong></article>';
    console.error(error);
  });
}

function dryRunSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseDryRunJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function dryRunMissingForState(config, audit) {
  const required = config.required_by_state?.[audit.audit_state] || [];
  return required.filter((field) => !String(audit[field] ?? "").trim());
}

function guardBlocksCanonical(value) {
  return /(blocked|dry-run|storage|final release)/i.test(String(value || ""));
}

function provesNoCanonicalDiff(value) {
  return /(no canonical source diff|no source diff|unchanged|zero|none)/i.test(String(value || ""));
}

function productionDryRunAudit(config, implementationTask, audit) {
  const missing = dryRunMissingForState(config, audit);
  const blocked = [];
  const warnings = [];
  const task = implementationTask || {};
  const state = audit.audit_state || "Not run";
  const needsDryRunProof = state === "Dry run passed" || state === "Ready for release review";

  if (!implementationTask || typeof implementationTask !== "object" || Array.isArray(implementationTask)) missing.push("implementation task");
  if (task.canonical_write_allowed !== false) blocked.push("implementation task must keep canonical_write_allowed false");
  if (task.production_ready === true) blocked.push("implementation task cannot already be production ready");
  if (needsDryRunProof && (task.task_status !== "Ready for production dry run" || task.dry_run_ready !== true)) blocked.push("implementation task is not dry-run ready");
  if (needsDryRunProof && !guardBlocksCanonical(task.canonical_write_guard)) blocked.push("canonical write guard not proven");
  if (needsDryRunProof && !provesNoCanonicalDiff(audit.canonical_diff_evidence)) blocked.push("canonical diff evidence must prove no source data change");
  if (Array.isArray(task.blocked) && task.blocked.length > 0) warnings.push("Implementation task still carries blocked items.");
  if (Array.isArray(task.warnings)) warnings.push(...task.warnings);

  const audit_status = missing.length || blocked.length ? "Blocked" : state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    dry_run_audit_id: "dry-run-audit-" + Date.now(),
    audit_status,
    production_ready: false,
    canonical_write_allowed: false,
    release_review_ready: audit_status === "Ready for release review",
    implementation_task_id: task.implementation_task_id || "",
    source_answer_id: task.source_answer_id || "",
    source_record_id: task.source_record_id || "",
    source_family: task.source_family || "",
    owner_decision_id: task.owner_decision_id || "",
    audit_state: state,
    auditor_name: audit.auditor_name || "",
    audit_note: audit.audit_note || "",
    dry_run_result: audit.dry_run_result || "",
    fix_request: audit.fix_request || "",
    block_reason: audit.block_reason || "",
    rollback_evidence: audit.rollback_evidence || "",
    canonical_diff_evidence: audit.canonical_diff_evidence || "",
    release_reviewer: audit.release_reviewer || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.audit_policy
    ],
    implementation_task: task,
    created_at: new Date().toISOString()
  };
}

function dryRunAuditSnapshot(audits, config) {
  const byStatus = audits.reduce((counts, audit) => {
    const key = audit.audit_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: audits.length,
    blocked: byStatus.Blocked || 0,
    not_run: byStatus["Not run"] || 0,
    passed: byStatus["Dry run passed"] || 0,
    needs_fixes: byStatus["Dry run needs fixes"] || 0,
    release_review_ready: byStatus["Ready for release review"] || 0,
    audits
  };
}

async function dryRunLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readDryRunStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeDryRunStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initProductionDryRunAudit() {
  const config = await dryRunLoadJson("data/vedapath-production-dry-run-audit.json");
  const storeKey = config.local_audit_store;
  let audits = readDryRunStore(storeKey);
  let activeAudit = null;

  const taskInput = dryRunRoot.querySelector("#dryRunTaskPacket");
  const stateSelect = dryRunRoot.querySelector("#dryRunState");
  const auditorInput = dryRunRoot.querySelector("#dryRunAuditor");
  const noteInput = dryRunRoot.querySelector("#dryRunNote");
  const resultInput = dryRunRoot.querySelector("#dryRunResult");
  const fixInput = dryRunRoot.querySelector("#dryRunFixRequest");
  const blockInput = dryRunRoot.querySelector("#dryRunBlockReason");
  const rollbackInput = dryRunRoot.querySelector("#dryRunRollback");
  const diffInput = dryRunRoot.querySelector("#dryRunDiffEvidence");
  const reviewerInput = dryRunRoot.querySelector("#dryRunReviewer");
  const resultEl = dryRunRoot.querySelector("#dryRunResultCard");
  const packetEl = dryRunRoot.querySelector("#dryRunPacket");
  const checksEl = dryRunRoot.querySelector("#dryRunChecks");
  const taskScopeEl = dryRunRoot.querySelector("#dryRunTaskScope");
  const savedEl = dryRunRoot.querySelector("#dryRunSaved");
  const runButton = dryRunRoot.querySelector("#runDryRunAudit");
  const sampleButton = dryRunRoot.querySelector("#loadDryRunSample");
  const saveButton = dryRunRoot.querySelector("#saveDryRunAudit");
  const clearButton = dryRunRoot.querySelector("#clearDryRunAudits");
  const copyButton = dryRunRoot.querySelector("#copyDryRunPacket");

  stateSelect.innerHTML = (config.audit_states || []).map((state) => '<option value="' + dryRunSafe(state) + '">' + dryRunSafe(state) + '</option>').join("");

  function loadSample() {
    taskInput.value = JSON.stringify(config.sample_implementation_task, null, 2);
    stateSelect.value = config.sample_audit.audit_state;
    auditorInput.value = config.sample_audit.auditor_name;
    noteInput.value = config.sample_audit.audit_note;
    resultInput.value = config.sample_audit.dry_run_result;
    fixInput.value = config.sample_audit.fix_request;
    blockInput.value = config.sample_audit.block_reason;
    rollbackInput.value = config.sample_audit.rollback_evidence;
    diffInput.value = config.sample_audit.canonical_diff_evidence;
    reviewerInput.value = config.sample_audit.release_reviewer;
  }

  function auditFromForm() {
    return {
      audit_state: stateSelect.value,
      auditor_name: auditorInput.value.trim(),
      audit_note: noteInput.value.trim(),
      dry_run_result: resultInput.value.trim(),
      fix_request: fixInput.value.trim(),
      block_reason: blockInput.value.trim(),
      rollback_evidence: rollbackInput.value.trim(),
      canonical_diff_evidence: diffInput.value.trim(),
      release_reviewer: reviewerInput.value.trim()
    };
  }

  function renderChecks() {
    checksEl.innerHTML = (config.dry_run_checks || []).map((item) => (
      '<article class="audit-rule"><span>' + dryRunSafe(item.check) + '</span><strong>' + dryRunSafe(item.rule) + '</strong></article>'
    )).join("");
  }

  function renderTaskScope(task) {
    taskScopeEl.innerHTML = [
      ["Task status", task.task_status || "Unknown"],
      ["Source answer", task.source_answer_id || "No source answer"],
      ["Owner status", task.owner_status || "Unknown"],
      ["Canonical writes", String(task.canonical_write_allowed === false ? "False" : "Check")],
      ["Rollback", task.rollback_plan || "No rollback plan"],
      ["Guard", task.canonical_write_guard || "No guard"]
    ].map((row) => (
      '<article class="audit-card ' + (row[0] === "Canonical writes" ? "ready" : "") + '"><span>' + dryRunSafe(row[0]) + '</span><strong>' + dryRunSafe(row[1]) + '</strong></article>'
    )).join("");
  }

  function renderSaved() {
    savedEl.innerHTML = audits.slice(0, 8).map((audit) => (
      '<article class="audit-card">' +
        '<span>' + dryRunSafe(audit.created_at) + '</span>' +
        '<strong>' + dryRunSafe(audit.audit_status) + '</strong>' +
        '<span>' + dryRunSafe((audit.source_answer_id || "audit") + " | " + audit.auditor_name) + '</span>' +
      '</article>'
    )).join("") || '<article class="audit-card"><strong>No dry-run audits yet</strong><span>Run and save one audit to begin.</span></article>';
  }

  function renderAudit() {
    const task = parseDryRunJson(taskInput.value, {});
    const audit = auditFromForm();
    const result = productionDryRunAudit(config, task, audit);
    activeAudit = result;
    resultEl.dataset.state = result.audit_status;
    resultEl.innerHTML = [
      '<span class="badge ' + (result.release_review_ready ? 'green' : '') + '">' + dryRunSafe(result.audit_status) + '</span>',
      '<h2>Dry-run audit packet</h2>',
      '<p class="muted">' + dryRunSafe(result.source_answer_id || "No source answer") + '</p>',
      '<div class="audit-grid">',
      '<article class="audit-card"><span>Missing</span><strong>' + dryRunSafe(result.missing.length ? result.missing.join(", ") : "None") + '</strong></article>',
      '<article class="audit-card"><span>Blocked</span><strong>' + dryRunSafe(result.blocked.length ? result.blocked.join(", ") : "None") + '</strong></article>',
      '<article class="audit-card"><span>Release review</span><strong>' + dryRunSafe(result.release_review_ready ? "Ready" : "No") + '</strong></article>',
      '<article class="audit-card"><span>Canonical write</span><strong>False</strong></article>',
      '</div>'
    ].join("");
    packetEl.value = JSON.stringify(result, null, 2);
    renderTaskScope(task);
  }

  [taskInput, stateSelect, auditorInput, noteInput, resultInput, fixInput, blockInput, rollbackInput, diffInput, reviewerInput].forEach((el) => {
    el.addEventListener("input", renderAudit);
    el.addEventListener("change", renderAudit);
  });

  runButton.addEventListener("click", renderAudit);
  sampleButton.addEventListener("click", () => {
    loadSample();
    renderAudit();
  });
  saveButton.addEventListener("click", () => {
    if (!activeAudit) renderAudit();
    audits = [activeAudit, ...audits].slice(0, 24);
    writeDryRunStore(storeKey, audits);
    renderSaved();
  });
  clearButton.addEventListener("click", () => {
    audits = [];
    writeDryRunStore(storeKey, audits);
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
  renderAudit();
}

if (typeof window !== "undefined") {
  window.vedapathProductionDryRunAudit = {
    productionDryRunAudit,
    dryRunAuditSnapshot,
    dryRunMissingForState,
    parseDryRunJson
  };
}
`);
}

function writeAuditPage() {
  write("productiondryrunaudit.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Production Dry-Run Audit</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-production-dry-run-audit.css">
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
            <span>Production dry run</span>
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

      <main class="workspace" aria-label="VedaPath Production Dry-Run Audit workspace">
        <aside class="panel">
          <span class="eyebrow">Production restraint</span>
          <h2>Prove before release review</h2>
          <p class="muted">A queued implementation task can move forward only after the dry run proves no canonical source data changed.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Receive</strong><p>Read the task packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Run</strong><p>Record dry-run evidence.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Prove</strong><p>Show rollback and no diff.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Gate</strong><p>Send to release review.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button safe" href="implementationqueue.html">Open Queue</a>
            <a class="button" href="sourceownerapproval.html">Open Owner Lane</a>
          </div>
        </aside>

        <section class="panel audit-app" id="productionDryRunAudit">
          <div class="audit-head">
            <div>
              <span class="eyebrow">Production dry-run audit</span>
              <h1>Run the audit. Keep production still.</h1>
              <p class="muted">This room records dry-run results, rollback evidence, canonical-diff evidence, and release-review readiness. It cannot write source records.</p>
            </div>
            <div class="audit-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath dry-run audit mark"></div>
          </div>

          <section class="audit-layout">
            <div class="audit-form">
              <h2>Dry-Run Audit</h2>
              <label>Implementation task packet<textarea id="dryRunTaskPacket"></textarea></label>
              <label>Audit state<select id="dryRunState"></select></label>
              <label>Auditor name<input id="dryRunAuditor" type="text" placeholder="Dry-run reviewer"></label>
              <label>Audit note<textarea id="dryRunNote"></textarea></label>
              <label>Dry-run result<textarea id="dryRunResult"></textarea></label>
              <label>Fix request<textarea id="dryRunFixRequest"></textarea></label>
              <label>Block reason<textarea id="dryRunBlockReason"></textarea></label>
              <label>Rollback evidence<textarea id="dryRunRollback"></textarea></label>
              <label>Canonical diff evidence<textarea id="dryRunDiffEvidence"></textarea></label>
              <label>Release reviewer<input id="dryRunReviewer" type="text" placeholder="Release reviewer"></label>
              <div class="audit-actions">
                <button class="button primary" id="runDryRunAudit" type="button">Run Audit</button>
                <button class="button safe" id="loadDryRunSample" type="button">Load Sample</button>
                <button class="button" id="saveDryRunAudit" type="button">Save Local</button>
                <button class="button" id="clearDryRunAudits" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="audit-result" id="dryRunResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Task Scope</h2>
                <div class="audit-list" id="dryRunTaskScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Dry-Run Checks</h2>
            <div class="audit-rules" id="dryRunChecks"></div>
          </section>

          <section class="audit-layout">
            <div>
              <div class="audit-actions">
                <button class="button safe" id="copyDryRunPacket" type="button">Copy Audit Packet</button>
                <a class="button" href="data/vedapath-production-dry-run-audit.json">Open JSON</a>
              </div>
              <textarea class="audit-packet" id="dryRunPacket" aria-label="Production dry-run audit packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Audits</h2>
              <div class="audit-list" id="dryRunSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Dry-run audit</span>
          <h2 style="margin-top: 14px;">Production Boundary</h2>
          <p class="muted">The preview can say a task is ready for release review. It still cannot write canonical source data or become production authority.</p>
          <div class="progress" aria-label="Dry-run audit progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>5</strong></div>
            <div class="metric"><span>Writes</span><strong>False</strong></div>
            <div class="metric"><span>Store</span><strong>Local</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Audit Rule</h2>
            <p class="muted">A passed dry run is not production approval. It is evidence for a future release-review gate.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-production-dry-run-audit.js"></script>
  </body>
</html>
`);
}

function updateFlowLinks() {
  const files = [
    "implementationqueue.html",
    "sourceownerapproval.html",
    "proposaldiffreview.html",
    "reviewqueuepersistence.html",
    "reviewidentitygate.html",
    "sourceupdateproposalbridge.html"
  ];

  for (const file of files) {
    let content = read(file);
    content = insertAfter(
      content,
      '<a class="button primary" href="implementationqueue.html">Open Implementation Queue</a>',
      '            <a class="button" href="productiondryrunaudit.html">Open Dry Run</a>'
    );
    content = insertAfter(
      content,
      '<a class="button" href="implementationqueue.html">Open Queue</a>',
      '            <a class="button" href="productiondryrunaudit.html">Open Dry Run</a>'
    );
    content = insertAfter(
      content,
      '<a class="button safe" href="implementationqueue.html">Open Queue</a>',
      '            <a class="button" href="productiondryrunaudit.html">Open Dry Run</a>'
    );
    content = insertAfter(
      content,
      '<a class="button" href="proposaldiffreview.html">Open Diff Review</a>',
      '            <a class="button" href="productiondryrunaudit.html">Open Dry Run</a>'
    );
    content = insertAfter(
      content,
      '<a class="button primary" href="sourceownerapproval.html">Open Owner Lane</a>',
      '            <a class="button" href="implementationqueue.html">Open Queue</a>\n            <a class="button" href="productiondryrunaudit.html">Open Dry Run</a>'
    );
    write(file, content);
  }
}

function updateIndex() {
  let content = read("index.html");
  if (!content.includes('productiondryrunaudit.html">Dry-run audit')) {
    content = content.replace(
      '<a href="implementationqueue.html">Implementation <span>queue</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>',
      '<a href="implementationqueue.html">Implementation <span>queue</span></a>\n              <a href="productiondryrunaudit.html">Dry-run audit <span>gate</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>'
    );
  }
  if (!content.includes('productiondryrunaudit.html">Dry run')) {
    content = content.replace(
      '<a href="implementationqueue.html">Queue handoff <span>tasks</span></a>\n            </div>',
      '<a href="implementationqueue.html">Queue handoff <span>tasks</span></a>\n              <a href="productiondryrunaudit.html">Dry run <span>audit</span></a>\n            </div>'
    );
  }
  content = content.replace(
    "real retrieval, reviewed sources, and production memory.",
    "release review, storage controls, and production memory."
  );
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = content
    .replace('<strong>v3.0.0</strong>\n          <p>Implementation Queue Handoff: owner-approved packets now become scoped dry-run tasks with canonical writes blocked.</p>', '<strong>v3.0.1</strong>\n          <p>Production Dry-Run Audit: implementation tasks now record dry-run results, rollback evidence, canonical-diff evidence, and release-review readiness.</p>')
    .replace('<strong>82%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:82%"></div></div>\n          <p>The trust loop now carries owner approval into implementation tasks without touching canonical data.</p>', '<strong>83%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:83%"></div></div>\n          <p>The trust loop now proves dry-run behavior before release review or storage work begins.</p>')
    .replace('<strong>Production dry-run audit</strong>\n          <p>Add immutable task IDs, dry-run results, and release-review gates before storage work.</p>', '<strong>Release review gate</strong>\n          <p>Add final release-review decisions before production storage work begins.</p>')
    .replace('<div class="percent">82%</div>', '<div class="percent">83%</div>');

  const queuePhase = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 264: Implementation Queue Handoff</strong>
                <p>Turns owner-approved packets into scoped dry-run implementation tasks while canonical writes stay blocked.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  const dryRunPhase = `${queuePhase}
            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 265: Production Dry-Run Audit</strong>
                <p>Adds dry-run result history, rollback evidence, canonical-diff evidence, and release-review readiness while writes remain blocked.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 265: Production Dry-Run Audit")) {
    content = content.replace(queuePhase, dryRunPhase);
    content = content.replace("Phase 265: Production Implementation and Licensed Audio", "Phase 266: Production Implementation and Licensed Audio");
  }

  content = content
    .replace('<div class="version-row"><span>Release</span><strong>v3.0.0 Implementation Queue Handoff</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.0.1 Production Dry-Run Audit</strong></div>')
    .replace('<div class="version-row"><span>Previous</span><strong>v2.9.9 Source Owner Approval Lane</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.0.0 Implementation Queue Handoff</strong></div>')
    .replace('<div class="version-row"><span>Goal</span><strong>Turn owner-approved packets into dry-run tasks without canonical writes.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Prove dry-run behavior before release review or storage work.</strong></div>')
    .replace('<div class="version-row"><span>Status</span><strong>Ready for production dry-run audit</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for release review gate</strong></div>')
    .replace(`<li><span class="dot"></span><span>Add immutable task IDs and dry-run result history.</span></li>
              <li><span class="dot"></span><span>Create release-review gates for queued tasks.</span></li>
              <li><span class="dot"></span><span>Separate completed dry runs from production storage.</span></li>
              <li><span class="dot"></span><span>Keep canonical source records untouched until production storage.</span></li>`, `<li><span class="dot"></span><span>Create release-review gate decisions.</span></li>
              <li><span class="dot"></span><span>Add reviewer sign-off and return paths.</span></li>
              <li><span class="dot"></span><span>Separate dry-run pass from production storage approval.</span></li>
              <li><span class="dot"></span><span>Keep canonical source records untouched until storage controls exist.</span></li>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH PRODUCTION DRY RUN AUDIT START -->", "<!-- VEDAPATH PRODUCTION DRY RUN AUDIT END -->", `## ${release} Production Dry-Run Audit

This release turns queued implementation work into dry-run evidence before release review.

- adds productiondryrunaudit.html
- adds data/vedapath-production-dry-run-audit.json
- records dry-run result, rollback evidence, canonical-diff evidence, and release reviewer
- keeps production readiness false and canonical source writes blocked
- sets the next release as release review gate`, "<!-- VEDAPATH IMPLEMENTATION QUEUE HANDOFF START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH PRODUCTION DRY RUN AUDIT NOTES START -->", "<!-- VEDAPATH PRODUCTION DRY RUN AUDIT NOTES END -->", `## ${release} Production Dry-Run Audit

This phase adds a dry-run audit layer after implementation queue handoff.

Action taken:

- Added production dry-run audit schema.
- Added audit states for not run, passed, needs fixes, blocked, and ready for release review.
- Required dry-run result, rollback evidence, canonical-diff evidence, and release reviewer before release review.
- Added copyable audit packets and local audit memory.
- Preserved canonical source data.`, "<!-- VEDAPATH IMPLEMENTATION QUEUE HANDOFF NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH PRODUCTION DRY RUN AUDIT BLUEPRINT START -->", "<!-- VEDAPATH PRODUCTION DRY RUN AUDIT BLUEPRINT END -->", `### 284. Production Dry-Run Audit

VedaPath should prove implementation behavior before any release review or storage work begins.

Rules:

- Dry-run audits can start only from queued implementation tasks.
- Canonical writes remain false in preview.
- Passed dry runs must show result evidence, rollback evidence, and no canonical source diff.
- Ready-for-release-review audits require a named reviewer.
- The next build should create a release-review gate with return and sign-off paths.`, "<!-- VEDAPATH IMPLEMENTATION QUEUE HANDOFF BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/PRODUCTION_DRY_RUN_AUDIT.md", `# VedaPath AI Production Dry-Run Audit

Release: ${release}

This release adds the dry-run audit layer after implementation queue handoff.

## Files

- data/vedapath-production-dry-run-audit.json
- productiondryrunaudit.html
- assets/vedapath-production-dry-run-audit.css
- assets/vedapath-production-dry-run-audit.js

## What It Adds

The room:

- reads a queued implementation task
- records dry-run result evidence
- requires rollback evidence
- requires canonical-diff evidence before release review
- names the release reviewer
- exports a copyable audit packet
- stores local audit history only

## Boundary

A dry-run pass is not production approval. It is evidence for release review. Canonical source records still require storage controls, immutable audit, rollback controls, and final release approval.
`);
}

writeAuditData();
writeAuditCss();
writeAuditJs();
writeAuditPage();
updateAllHtmlShells();
updateFlowLinks();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} production dry-run audit applied.`);

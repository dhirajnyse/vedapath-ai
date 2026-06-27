const dryRunRoot = document.getElementById("productionDryRunAudit");

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

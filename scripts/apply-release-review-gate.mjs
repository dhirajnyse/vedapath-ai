import fs from "node:fs";
import path from "node:path";

const release = "v3.0.2";
const badge = `${release} review gate`;

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

function dryRunData() {
  return JSON.parse(read("data/vedapath-production-dry-run-audit.json"));
}

function sampleDryRunAudit(config) {
  return {
    schema_version: config.schema_version,
    release: config.release,
    dry_run_audit_id: "dry-run-audit-sample-release-review",
    audit_status: "Ready for release review",
    production_ready: false,
    canonical_write_allowed: false,
    release_review_ready: true,
    implementation_task_id: config.sample_implementation_task.implementation_task_id,
    source_answer_id: config.sample_implementation_task.source_answer_id,
    source_record_id: config.sample_implementation_task.source_record_id,
    source_family: config.sample_implementation_task.source_family,
    owner_decision_id: config.sample_implementation_task.owner_decision_id,
    audit_state: config.sample_audit.audit_state,
    auditor_name: config.sample_audit.auditor_name,
    audit_note: config.sample_audit.audit_note,
    dry_run_result: config.sample_audit.dry_run_result,
    fix_request: config.sample_audit.fix_request,
    block_reason: config.sample_audit.block_reason,
    rollback_evidence: config.sample_audit.rollback_evidence,
    canonical_diff_evidence: config.sample_audit.canonical_diff_evidence,
    release_reviewer: config.sample_audit.release_reviewer,
    missing: [],
    blocked: [],
    warnings: [
      "Release review can approve storage design only, not production writes.",
      config.audit_policy
    ],
    implementation_task: config.sample_implementation_task,
    created_at: "2026-06-27T00:00:00.000Z"
  };
}

function writeGateData() {
  const config = dryRunData();
  const data = {
    product: "VedaPath AI",
    release,
    status: "release review gate v1",
    schema_version: "release-review-gate-v1",
    dry_run_dataset: "data/vedapath-production-dry-run-audit.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_review_store: "vedapath-release-review-gate-v1",
    warning: "This gate records release-review decisions only. It does not write canonical source records, publish production data, bypass source owner approval, certify scholarship, provide therapy, give ritual instruction, or become spiritual authority.",
    review_policy: "A release reviewer may approve the next storage-design step only after a dry-run audit is ready for release review. Production readiness and canonical writes remain false until storage controls, immutable audit, rollback receipts, and final founder instruction exist.",
    review_states: [
      "Not reviewed",
      "Approved for storage design",
      "Return to dry run",
      "Release blocked",
      "Founder hold"
    ],
    required_by_state: {
      "Not reviewed": ["reviewer_name", "review_note"],
      "Approved for storage design": [
        "reviewer_name",
        "review_note",
        "signoff_summary",
        "storage_boundary",
        "rollback_confirmed",
        "canonical_diff_confirmed"
      ],
      "Return to dry run": ["reviewer_name", "review_note", "return_reason"],
      "Release blocked": ["reviewer_name", "review_note", "block_reason"],
      "Founder hold": ["reviewer_name", "review_note", "hold_reason"]
    },
    gate_checks: [
      {
        check: "Dry-run readiness",
        rule: "The incoming audit must be ready for release review."
      },
      {
        check: "No source write",
        rule: "Canonical write permission must remain false."
      },
      {
        check: "Rollback evidence",
        rule: "Reviewer confirms the rollback evidence is clear."
      },
      {
        check: "Canonical diff evidence",
        rule: "Reviewer confirms the source-answer dataset stayed unchanged."
      },
      {
        check: "Storage boundary",
        rule: "Approval can only move the work into storage design."
      }
    ],
    sample_dry_run_audit: sampleDryRunAudit(config),
    sample_review: {
      review_state: "Approved for storage design",
      reviewer_name: "Release reviewer",
      review_note: "Dry-run evidence is clear enough to design storage controls without approving production writes.",
      signoff_summary: "Approve storage-design planning only; canonical source-answer data remains untouched.",
      storage_boundary: "Storage design only; no canonical writes, no production publish, and no final release.",
      rollback_confirmed: "Confirmed: rollback is deletion of the dry-run packet and no source-answer data changed.",
      canonical_diff_confirmed: "Confirmed: no canonical source diff and source-answer dataset unchanged.",
      return_reason: "",
      block_reason: "",
      hold_reason: ""
    }
  };
  write("data/vedapath-release-review-gate.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeGateCss() {
  write("assets/vedapath-release-review-gate.css", `/* VedaPath release review gate */
.gate-app,
.gate-head,
.gate-layout,
.gate-form,
.gate-grid,
.gate-list,
.gate-actions,
.gate-rules {
  display: grid;
  gap: 10px;
}

.gate-app {
  gap: 16px;
}

.gate-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.gate-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.gate-mark img {
  display: block;
  width: 100%;
}

.gate-layout {
  grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
  align-items: start;
}

.gate-form,
.gate-card,
.gate-result,
.gate-packet,
.gate-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.gate-form,
.gate-card,
.gate-result,
.gate-rule {
  padding: 12px;
}

.gate-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.gate-form input,
.gate-form select,
.gate-form textarea,
.gate-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.gate-form textarea,
.gate-packet {
  min-height: 112px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.gate-grid,
.gate-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gate-card,
.gate-result {
  border-left: 4px solid var(--gold);
}

.gate-card.ready,
.gate-result[data-state="Approved for storage design"] {
  border-left-color: var(--green);
}

.gate-card.blocked,
.gate-result[data-state="Blocked"],
.gate-result[data-state="Release blocked"],
.gate-result[data-state="Return to dry run"],
.gate-result[data-state="Founder hold"] {
  border-left-color: var(--ochre);
}

.gate-card span,
.gate-card strong,
.gate-rule span,
.gate-rule strong {
  display: block;
}

.gate-card span,
.gate-rule span {
  color: var(--muted);
  font-size: 12px;
}

.gate-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.gate-list {
  max-height: 290px;
  overflow: auto;
  padding-right: 3px;
}

@media (max-width: 980px) {
  .gate-head,
  .gate-layout,
  .gate-grid,
  .gate-rules {
    grid-template-columns: 1fr;
  }

  .gate-mark {
    max-width: 150px;
  }
}

@media (max-width: 680px) {
  .gate-actions,
  .gate-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeGateJs() {
  write("assets/vedapath-release-review-gate.js", `const gateRoot = document.getElementById("releaseReviewGate");

if (gateRoot) {
  initReleaseReviewGate().catch((error) => {
    gateRoot.innerHTML = '<article class="gate-result"><strong>Release review gate could not load.</strong></article>';
    console.error(error);
  });
}

function gateSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseGateJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function gateMissingForState(config, review) {
  const required = config.required_by_state?.[review.review_state] || [];
  return required.filter((field) => !String(review[field] ?? "").trim());
}

function confirmsNoDiff(value) {
  const text = String(value || "");
  const badChange = /(changed source|source changed|canonical diff exists|write executed|mutated|modified canonical)/i.test(text);
  const clearNoChange = /(no canonical source diff|no source diff|unchanged|no source-answer data changed|not changed|none|zero|confirmed)/i.test(text);
  return clearNoChange && !badChange;
}

function keepsStorageDesignOnly(value) {
  return /(storage design only|no canonical writes|no production|blocked|design only)/i.test(String(value || ""));
}

function releaseReviewGate(config, dryRunAudit, review) {
  const missing = gateMissingForState(config, review);
  const blocked = [];
  const warnings = [];
  const audit = dryRunAudit || {};
  const state = review.review_state || "Not reviewed";
  const approving = state === "Approved for storage design";

  if (!dryRunAudit || typeof dryRunAudit !== "object" || Array.isArray(dryRunAudit)) missing.push("dry-run audit");
  if (audit.canonical_write_allowed !== false) blocked.push("dry-run audit must keep canonical_write_allowed false");
  if (audit.production_ready === true) blocked.push("dry-run audit cannot already be production ready");
  if (approving && (audit.audit_status !== "Ready for release review" || audit.release_review_ready !== true)) blocked.push("dry-run audit is not ready for release review");
  if (approving && !confirmsNoDiff(review.canonical_diff_confirmed)) blocked.push("canonical diff confirmation must prove no source data change");
  if (approving && !confirmsNoDiff(review.rollback_confirmed)) blocked.push("rollback confirmation must be explicit");
  if (approving && !keepsStorageDesignOnly(review.storage_boundary)) blocked.push("storage boundary must limit approval to storage design only");
  if (Array.isArray(audit.blocked) && audit.blocked.length > 0) warnings.push("Dry-run audit still carries blocked items.");
  if (Array.isArray(audit.warnings)) warnings.push(...audit.warnings);

  const review_status = missing.length || blocked.length ? "Blocked" : state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    release_review_id: "release-review-" + Date.now(),
    review_status,
    production_ready: false,
    canonical_write_allowed: false,
    storage_design_ready: review_status === "Approved for storage design",
    dry_run_audit_id: audit.dry_run_audit_id || "",
    implementation_task_id: audit.implementation_task_id || "",
    source_answer_id: audit.source_answer_id || "",
    source_record_id: audit.source_record_id || "",
    source_family: audit.source_family || "",
    owner_decision_id: audit.owner_decision_id || "",
    review_state: state,
    reviewer_name: review.reviewer_name || "",
    review_note: review.review_note || "",
    signoff_summary: review.signoff_summary || "",
    storage_boundary: review.storage_boundary || "",
    rollback_confirmed: review.rollback_confirmed || "",
    canonical_diff_confirmed: review.canonical_diff_confirmed || "",
    return_reason: review.return_reason || "",
    block_reason: review.block_reason || "",
    hold_reason: review.hold_reason || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.review_policy
    ],
    dry_run_audit: audit,
    created_at: new Date().toISOString()
  };
}

function releaseReviewSnapshot(reviews, config) {
  const byStatus = reviews.reduce((counts, review) => {
    const key = review.review_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: reviews.length,
    approved_for_storage_design: byStatus["Approved for storage design"] || 0,
    returned: byStatus["Return to dry run"] || 0,
    blocked: byStatus.Blocked || 0,
    release_blocked: byStatus["Release blocked"] || 0,
    founder_hold: byStatus["Founder hold"] || 0,
    reviews
  };
}

async function gateLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readGateStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeGateStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initReleaseReviewGate() {
  const config = await gateLoadJson("data/vedapath-release-review-gate.json");
  const storeKey = config.local_review_store;
  let reviews = readGateStore(storeKey);
  let activeReview = null;

  const auditInput = gateRoot.querySelector("#gateDryRunAudit");
  const stateSelect = gateRoot.querySelector("#gateReviewState");
  const reviewerInput = gateRoot.querySelector("#gateReviewer");
  const noteInput = gateRoot.querySelector("#gateNote");
  const signoffInput = gateRoot.querySelector("#gateSignoff");
  const storageInput = gateRoot.querySelector("#gateStorageBoundary");
  const rollbackInput = gateRoot.querySelector("#gateRollbackConfirmed");
  const diffInput = gateRoot.querySelector("#gateDiffConfirmed");
  const returnInput = gateRoot.querySelector("#gateReturnReason");
  const blockInput = gateRoot.querySelector("#gateBlockReason");
  const holdInput = gateRoot.querySelector("#gateHoldReason");
  const resultEl = gateRoot.querySelector("#gateResultCard");
  const packetEl = gateRoot.querySelector("#gatePacket");
  const checksEl = gateRoot.querySelector("#gateChecks");
  const auditScopeEl = gateRoot.querySelector("#gateAuditScope");
  const savedEl = gateRoot.querySelector("#gateSaved");
  const reviewButton = gateRoot.querySelector("#runReleaseReview");
  const sampleButton = gateRoot.querySelector("#loadReleaseReviewSample");
  const saveButton = gateRoot.querySelector("#saveReleaseReview");
  const clearButton = gateRoot.querySelector("#clearReleaseReviews");
  const copyButton = gateRoot.querySelector("#copyReleaseReviewPacket");

  stateSelect.innerHTML = (config.review_states || []).map((state) => '<option value="' + gateSafe(state) + '">' + gateSafe(state) + '</option>').join("");

  function loadSample() {
    auditInput.value = JSON.stringify(config.sample_dry_run_audit, null, 2);
    stateSelect.value = config.sample_review.review_state;
    reviewerInput.value = config.sample_review.reviewer_name;
    noteInput.value = config.sample_review.review_note;
    signoffInput.value = config.sample_review.signoff_summary;
    storageInput.value = config.sample_review.storage_boundary;
    rollbackInput.value = config.sample_review.rollback_confirmed;
    diffInput.value = config.sample_review.canonical_diff_confirmed;
    returnInput.value = config.sample_review.return_reason;
    blockInput.value = config.sample_review.block_reason;
    holdInput.value = config.sample_review.hold_reason;
  }

  function reviewFromForm() {
    return {
      review_state: stateSelect.value,
      reviewer_name: reviewerInput.value.trim(),
      review_note: noteInput.value.trim(),
      signoff_summary: signoffInput.value.trim(),
      storage_boundary: storageInput.value.trim(),
      rollback_confirmed: rollbackInput.value.trim(),
      canonical_diff_confirmed: diffInput.value.trim(),
      return_reason: returnInput.value.trim(),
      block_reason: blockInput.value.trim(),
      hold_reason: holdInput.value.trim()
    };
  }

  function renderChecks() {
    checksEl.innerHTML = (config.gate_checks || []).map((item) => (
      '<article class="gate-rule"><span>' + gateSafe(item.check) + '</span><strong>' + gateSafe(item.rule) + '</strong></article>'
    )).join("");
  }

  function renderAuditScope(audit) {
    auditScopeEl.innerHTML = [
      ["Dry-run status", audit.audit_status || "Unknown"],
      ["Source answer", audit.source_answer_id || "No source answer"],
      ["Release review", audit.release_review_ready === true ? "Ready" : "No"],
      ["Canonical writes", audit.canonical_write_allowed === false ? "False" : "Check"],
      ["Rollback evidence", audit.rollback_evidence || "No evidence"],
      ["Canonical diff", audit.canonical_diff_evidence || "No evidence"]
    ].map((row) => (
      '<article class="gate-card ' + (row[0] === "Canonical writes" || row[0] === "Release review" ? "ready" : "") + '"><span>' + gateSafe(row[0]) + '</span><strong>' + gateSafe(row[1]) + '</strong></article>'
    )).join("");
  }

  function renderSaved() {
    savedEl.innerHTML = reviews.slice(0, 8).map((review) => (
      '<article class="gate-card">' +
        '<span>' + gateSafe(review.created_at) + '</span>' +
        '<strong>' + gateSafe(review.review_status) + '</strong>' +
        '<span>' + gateSafe((review.source_answer_id || "review") + " | " + review.reviewer_name) + '</span>' +
      '</article>'
    )).join("") || '<article class="gate-card"><strong>No release reviews yet</strong><span>Review and save one gate packet to begin.</span></article>';
  }

  function renderReview() {
    const audit = parseGateJson(auditInput.value, {});
    const review = reviewFromForm();
    const result = releaseReviewGate(config, audit, review);
    activeReview = result;
    resultEl.dataset.state = result.review_status;
    resultEl.innerHTML = [
      '<span class="badge ' + (result.storage_design_ready ? 'green' : '') + '">' + gateSafe(result.review_status) + '</span>',
      '<h2>Release review packet</h2>',
      '<p class="muted">' + gateSafe(result.source_answer_id || "No source answer") + '</p>',
      '<div class="gate-grid">',
      '<article class="gate-card"><span>Missing</span><strong>' + gateSafe(result.missing.length ? result.missing.join(", ") : "None") + '</strong></article>',
      '<article class="gate-card"><span>Blocked</span><strong>' + gateSafe(result.blocked.length ? result.blocked.join(", ") : "None") + '</strong></article>',
      '<article class="gate-card"><span>Storage design</span><strong>' + gateSafe(result.storage_design_ready ? "Ready" : "No") + '</strong></article>',
      '<article class="gate-card"><span>Canonical write</span><strong>False</strong></article>',
      '</div>'
    ].join("");
    packetEl.value = JSON.stringify(result, null, 2);
    renderAuditScope(audit);
  }

  [auditInput, stateSelect, reviewerInput, noteInput, signoffInput, storageInput, rollbackInput, diffInput, returnInput, blockInput, holdInput].forEach((el) => {
    el.addEventListener("input", renderReview);
    el.addEventListener("change", renderReview);
  });

  reviewButton.addEventListener("click", renderReview);
  sampleButton.addEventListener("click", () => {
    loadSample();
    renderReview();
  });
  saveButton.addEventListener("click", () => {
    if (!activeReview) renderReview();
    reviews = [activeReview, ...reviews].slice(0, 24);
    writeGateStore(storeKey, reviews);
    renderSaved();
  });
  clearButton.addEventListener("click", () => {
    reviews = [];
    writeGateStore(storeKey, reviews);
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
  renderReview();
}

if (typeof window !== "undefined") {
  window.vedapathReleaseReviewGate = {
    releaseReviewGate,
    releaseReviewSnapshot,
    gateMissingForState,
    parseGateJson
  };
}
`);
}

function writeGatePage() {
  write("releasereviewgate.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Release Review Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-release-review-gate.css">
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
            <span>Release review gate</span>
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

      <main class="workspace" aria-label="VedaPath Release Review Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Release restraint</span>
          <h2>Approve the next step, not production</h2>
          <p class="muted">A reviewer can approve storage design, return the packet to dry run, block it, or place it on founder hold.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Receive</strong><p>Read dry-run evidence.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Check</strong><p>Confirm no source diff.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Decide</strong><p>Approve, return, block, or hold.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Record</strong><p>Copy review packet.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button safe" href="productiondryrunaudit.html">Open Dry Run</a>
            <a class="button" href="implementationqueue.html">Open Queue</a>
          </div>
        </aside>

        <section class="panel gate-app" id="releaseReviewGate">
          <div class="gate-head">
            <div>
              <span class="eyebrow">Release review gate</span>
              <h1>Review the evidence. Keep the door narrow.</h1>
              <p class="muted">This room turns a ready dry-run audit into a release-review decision. Approval means storage design can begin, not production writes.</p>
            </div>
            <div class="gate-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath release review mark"></div>
          </div>

          <section class="gate-layout">
            <div class="gate-form">
              <h2>Release Review</h2>
              <label>Dry-run audit packet<textarea id="gateDryRunAudit"></textarea></label>
              <label>Review state<select id="gateReviewState"></select></label>
              <label>Reviewer name<input id="gateReviewer" type="text" placeholder="Release reviewer"></label>
              <label>Review note<textarea id="gateNote"></textarea></label>
              <label>Signoff summary<textarea id="gateSignoff"></textarea></label>
              <label>Storage boundary<textarea id="gateStorageBoundary"></textarea></label>
              <label>Rollback confirmed<textarea id="gateRollbackConfirmed"></textarea></label>
              <label>Canonical diff confirmed<textarea id="gateDiffConfirmed"></textarea></label>
              <label>Return reason<textarea id="gateReturnReason"></textarea></label>
              <label>Block reason<textarea id="gateBlockReason"></textarea></label>
              <label>Founder hold reason<textarea id="gateHoldReason"></textarea></label>
              <div class="gate-actions">
                <button class="button primary" id="runReleaseReview" type="button">Review Gate</button>
                <button class="button safe" id="loadReleaseReviewSample" type="button">Load Sample</button>
                <button class="button" id="saveReleaseReview" type="button">Save Local</button>
                <button class="button" id="clearReleaseReviews" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="gate-result" id="gateResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Dry-Run Evidence</h2>
                <div class="gate-list" id="gateAuditScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Gate Checks</h2>
            <div class="gate-rules" id="gateChecks"></div>
          </section>

          <section class="gate-layout">
            <div>
              <div class="gate-actions">
                <button class="button safe" id="copyReleaseReviewPacket" type="button">Copy Review Packet</button>
                <a class="button" href="data/vedapath-release-review-gate.json">Open JSON</a>
              </div>
              <textarea class="gate-packet" id="gatePacket" aria-label="Release review packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Reviews</h2>
              <div class="gate-list" id="gateSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Review gate</span>
          <h2 style="margin-top: 14px;">Storage Boundary</h2>
          <p class="muted">This page can approve storage design only. Production source writes remain false until a later storage and founder-release gate exists.</p>
          <div class="progress" aria-label="Release review gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>5</strong></div>
            <div class="metric"><span>Writes</span><strong>False</strong></div>
            <div class="metric"><span>Store</span><strong>Local</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Gate Rule</h2>
            <p class="muted">Release review is not launch approval. It is the last review checkpoint before storage design begins.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-release-review-gate.js"></script>
  </body>
</html>
`);
}

function updateNavigationLinks() {
  let dryRun = read("productiondryrunaudit.html");
  if (!dryRun.includes("releasereviewgate.html")) {
    dryRun = dryRun.replace(
      '<a class="button safe" href="implementationqueue.html">Open Queue</a>\n            <a class="button" href="sourceownerapproval.html">Open Owner Lane</a>',
      '<a class="button primary" href="releasereviewgate.html">Open Release Review</a>\n            <a class="button safe" href="implementationqueue.html">Open Queue</a>\n            <a class="button" href="sourceownerapproval.html">Open Owner Lane</a>'
    );
  }
  write("productiondryrunaudit.html", dryRun);

  let queue = read("implementationqueue.html");
  if (!queue.includes("releasereviewgate.html")) {
    queue = queue.replace(
      '<a class="button" href="productiondryrunaudit.html">Open Dry Run</a>',
      '<a class="button" href="productiondryrunaudit.html">Open Dry Run</a>\n            <a class="button" href="releasereviewgate.html">Open Release Review</a>'
    );
  }
  write("implementationqueue.html", queue);
}

function updateIndex() {
  let content = read("index.html");
  if (!content.includes('releasereviewgate.html">Release review')) {
    content = content.replace(
      '<a href="productiondryrunaudit.html">Dry-run audit <span>gate</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>',
      '<a href="productiondryrunaudit.html">Dry-run audit <span>gate</span></a>\n              <a href="releasereviewgate.html">Release review <span>gate</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>'
    );
  }
  if (!content.includes('releasereviewgate.html">Review gate')) {
    content = content.replace(
      '<a href="productiondryrunaudit.html">Dry run <span>audit</span></a>\n            </div>',
      '<a href="productiondryrunaudit.html">Dry run <span>audit</span></a>\n              <a href="releasereviewgate.html">Review gate <span>signoff</span></a>\n            </div>'
    );
  }
  content = content.replace(
    "release review, storage controls, and production memory.",
    "storage design, immutable audit, and production memory."
  );
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = content
    .replace('<strong>v3.0.1</strong>\n          <p>Production Dry-Run Audit: implementation tasks now record dry-run results, rollback evidence, canonical-diff evidence, and release-review readiness.</p>', '<strong>v3.0.2</strong>\n          <p>Release Review Gate: ready dry-run audits now become human review decisions for storage design, return, block, or founder hold.</p>')
    .replace('<strong>83%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:83%"></div></div>\n          <p>The trust loop now proves dry-run behavior before release review or storage work begins.</p>', '<strong>84%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:84%"></div></div>\n          <p>The trust loop now has a final review decision before storage design begins.</p>')
    .replace('<strong>Release review gate</strong>\n          <p>Add final release-review decisions before production storage work begins.</p>', '<strong>Storage design gate</strong>\n          <p>Design storage controls, audit receipts, and rollback rules without enabling canonical writes.</p>')
    .replace('<div class="percent">83%</div>', '<div class="percent">84%</div>');

  const dryRunPhase = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 265: Production Dry-Run Audit</strong>
                <p>Adds dry-run result history, rollback evidence, canonical-diff evidence, and release-review readiness while writes remain blocked.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  const reviewPhase = `${dryRunPhase}
            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 266: Release Review Gate</strong>
                <p>Adds human release-review decisions for storage design, return to dry run, block, or founder hold while writes remain blocked.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 266: Release Review Gate")) {
    content = content.replace(dryRunPhase, reviewPhase);
    content = content.replace("Phase 266: Production Implementation and Licensed Audio", "Phase 267: Production Implementation and Licensed Audio");
  }

  content = content
    .replace('<div class="version-row"><span>Release</span><strong>v3.0.1 Production Dry-Run Audit</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.0.2 Release Review Gate</strong></div>')
    .replace('<div class="version-row"><span>Previous</span><strong>v3.0.0 Implementation Queue Handoff</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.0.1 Production Dry-Run Audit</strong></div>')
    .replace('<div class="version-row"><span>Goal</span><strong>Prove dry-run behavior before release review or storage work.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Add a human release gate before storage design begins.</strong></div>')
    .replace('<div class="version-row"><span>Status</span><strong>Ready for release review gate</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for storage design gate</strong></div>')
    .replace(`<li><span class="dot"></span><span>Create release-review gate decisions.</span></li>
              <li><span class="dot"></span><span>Add reviewer sign-off and return paths.</span></li>
              <li><span class="dot"></span><span>Separate dry-run pass from production storage approval.</span></li>
              <li><span class="dot"></span><span>Keep canonical source records untouched until storage controls exist.</span></li>`, `<li><span class="dot"></span><span>Design storage schema without enabling writes.</span></li>
              <li><span class="dot"></span><span>Add immutable audit receipt requirements.</span></li>
              <li><span class="dot"></span><span>Define rollback receipt and replay rules.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH RELEASE REVIEW GATE START -->", "<!-- VEDAPATH RELEASE REVIEW GATE END -->", `## ${release} Release Review Gate

This release adds the final human review step before storage design.

- adds releasereviewgate.html
- adds data/vedapath-release-review-gate.json
- records approve-for-storage-design, return, block, and founder-hold decisions
- keeps production readiness false and canonical source writes blocked
- sets the next release as storage design gate`, "<!-- VEDAPATH PRODUCTION DRY RUN AUDIT START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH RELEASE REVIEW GATE NOTES START -->", "<!-- VEDAPATH RELEASE REVIEW GATE NOTES END -->", `## ${release} Release Review Gate

This phase adds a release-review layer after production dry-run audit.

Action taken:

- Added release review gate schema.
- Added review states for not reviewed, approved for storage design, returned, blocked, and founder hold.
- Required signoff, storage boundary, rollback confirmation, and canonical-diff confirmation before storage design.
- Added copyable release-review packets and local review memory.
- Preserved canonical source data.`, "<!-- VEDAPATH PRODUCTION DRY RUN AUDIT NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH RELEASE REVIEW GATE BLUEPRINT START -->", "<!-- VEDAPATH RELEASE REVIEW GATE BLUEPRINT END -->", `### 285. Release Review Gate

VedaPath should require a human release decision before storage design begins.

Rules:

- Release review can start only from dry-run audits ready for release review.
- Approval means storage design only, not production writes.
- Reviewers can return to dry run, block the release, or place founder hold.
- Canonical writes remain false in preview.
- The next build should design storage controls without enabling canonical writes.`, "<!-- VEDAPATH PRODUCTION DRY RUN AUDIT BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/RELEASE_REVIEW_GATE.md", `# VedaPath AI Release Review Gate

Release: ${release}

This release adds the human release-review layer after production dry-run audit.

## Files

- data/vedapath-release-review-gate.json
- releasereviewgate.html
- assets/vedapath-release-review-gate.css
- assets/vedapath-release-review-gate.js

## What It Adds

The room:

- reads a dry-run audit packet
- records release-review decisions
- approves storage design only
- supports return to dry run, release block, and founder hold
- requires rollback and canonical-diff confirmation
- exports a copyable release-review packet
- stores local review history only

## Boundary

Release review is not production approval. It is a human checkpoint before storage design. Canonical source records still require storage controls, immutable audit, rollback receipts, and final founder instruction.
`);
}

writeGateData();
writeGateCss();
writeGateJs();
writeGatePage();
updateAllHtmlShells();
updateNavigationLinks();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} release review gate applied.`);

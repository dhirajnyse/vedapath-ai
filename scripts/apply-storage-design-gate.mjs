import fs from "node:fs";
import path from "node:path";

const release = "v3.0.3";
const badge = `${release} storage gate`;

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

function releaseReviewData() {
  return JSON.parse(read("data/vedapath-release-review-gate.json"));
}

function sampleReleaseReview(config) {
  const dryRun = config.sample_dry_run_audit || {};
  const review = config.sample_review || {};
  return {
    schema_version: config.schema_version,
    release: config.release,
    release_review_id: "release-review-sample-storage-design",
    review_status: "Approved for storage design",
    production_ready: false,
    canonical_write_allowed: false,
    storage_design_ready: true,
    dry_run_audit_id: dryRun.dry_run_audit_id || "dry-run-audit-sample-release-review",
    implementation_task_id: dryRun.implementation_task_id || "",
    source_answer_id: dryRun.source_answer_id || "",
    source_record_id: dryRun.source_record_id || "",
    source_family: dryRun.source_family || "",
    owner_decision_id: dryRun.owner_decision_id || "",
    review_state: review.review_state || "Approved for storage design",
    reviewer_name: review.reviewer_name || "Release reviewer",
    review_note: review.review_note || "Dry-run evidence is clear enough to design storage controls without approving production writes.",
    signoff_summary: review.signoff_summary || "Approve storage-design planning only; canonical source-answer data remains untouched.",
    storage_boundary: review.storage_boundary || "Storage design only; no canonical writes, no production publish, and no final release.",
    rollback_confirmed: review.rollback_confirmed || "Confirmed: rollback is deletion of the dry-run packet and no source-answer data changed.",
    canonical_diff_confirmed: review.canonical_diff_confirmed || "Confirmed: no canonical source diff and source-answer dataset unchanged.",
    return_reason: "",
    block_reason: "",
    hold_reason: "",
    missing: [],
    blocked: [],
    warnings: [
      "Storage design only; not production write approval.",
      config.review_policy
    ],
    dry_run_audit: dryRun,
    created_at: "2026-06-27T00:00:00.000Z"
  };
}

function writeStorageData() {
  const reviewConfig = releaseReviewData();
  const data = {
    product: "VedaPath AI",
    release,
    status: "storage design gate v1",
    schema_version: "storage-design-gate-v1",
    release_review_dataset: "data/vedapath-release-review-gate.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_storage_design_store: "vedapath-storage-design-gate-v1",
    warning: "This gate designs storage controls only. It does not write canonical source records, publish production data, create accounts, bypass reviewer approval, provide therapy, give ritual instruction, or become spiritual authority.",
    storage_policy: "A storage design can be marked ready only from an approved release-review packet. It may define schema, audit receipt, rollback receipt, and replay rules, but canonical writes remain false.",
    design_states: [
      "Draft storage design",
      "Needs architecture review",
      "Storage design ready",
      "Return to release review",
      "Storage design blocked"
    ],
    required_by_state: {
      "Draft storage design": ["architect_name", "design_note"],
      "Needs architecture review": ["architect_name", "design_note", "architecture_question"],
      "Storage design ready": [
        "architect_name",
        "design_note",
        "schema_summary",
        "audit_receipt_rule",
        "rollback_receipt_rule",
        "replay_rule",
        "write_boundary"
      ],
      "Return to release review": ["architect_name", "design_note", "return_reason"],
      "Storage design blocked": ["architect_name", "design_note", "block_reason"]
    },
    storage_checks: [
      {
        check: "Release approval",
        rule: "Input review must be approved for storage design."
      },
      {
        check: "Schema boundary",
        rule: "Schema defines records without enabling writes."
      },
      {
        check: "Immutable audit",
        rule: "Every future write must create an audit receipt."
      },
      {
        check: "Rollback receipt",
        rule: "Rollback must be recorded before production mutation is allowed."
      },
      {
        check: "Replay rule",
        rule: "Changes must be replayable from source packets and receipts."
      }
    ],
    sample_release_review: sampleReleaseReview(reviewConfig),
    sample_design: {
      design_state: "Storage design ready",
      architect_name: "Storage architect",
      design_note: "Design storage controls without enabling canonical writes.",
      schema_summary: "Tables: source_answer_drafts, review_receipts, audit_receipts, rollback_receipts, replay_queue.",
      architecture_question: "",
      audit_receipt_rule: "Every accepted future write must create an immutable audit receipt with actor, packet id, source_answer_id, before hash, after hash, and reason.",
      rollback_receipt_rule: "Every write must include a rollback receipt plan with before state, restore action, and discard path before it can be promoted.",
      replay_rule: "Storage changes must be replayable from release-review packets, source packet snapshots, and audit receipts.",
      write_boundary: "Design only; canonical_write_allowed remains false and no production source data is written.",
      return_reason: "",
      block_reason: ""
    }
  };
  write("data/vedapath-storage-design-gate.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeStorageCss() {
  write("assets/vedapath-storage-design-gate.css", `/* VedaPath storage design gate */
.storage-app,
.storage-head,
.storage-layout,
.storage-form,
.storage-grid,
.storage-list,
.storage-actions,
.storage-rules {
  display: grid;
  gap: 10px;
}

.storage-app {
  gap: 16px;
}

.storage-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.storage-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.storage-mark img {
  display: block;
  width: 100%;
}

.storage-layout {
  grid-template-columns: minmax(0, 0.96fr) minmax(0, 1.04fr);
  align-items: start;
}

.storage-form,
.storage-card,
.storage-result,
.storage-packet,
.storage-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.storage-form,
.storage-card,
.storage-result,
.storage-rule {
  padding: 12px;
}

.storage-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.storage-form input,
.storage-form select,
.storage-form textarea,
.storage-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.storage-form textarea,
.storage-packet {
  min-height: 112px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.storage-grid,
.storage-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.storage-card,
.storage-result {
  border-left: 4px solid var(--gold);
}

.storage-card.ready,
.storage-result[data-state="Storage design ready"] {
  border-left-color: var(--green);
}

.storage-card.blocked,
.storage-result[data-state="Blocked"],
.storage-result[data-state="Return to release review"],
.storage-result[data-state="Storage design blocked"] {
  border-left-color: var(--ochre);
}

.storage-card span,
.storage-card strong,
.storage-rule span,
.storage-rule strong {
  display: block;
}

.storage-card span,
.storage-rule span {
  color: var(--muted);
  font-size: 12px;
}

.storage-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.storage-list {
  max-height: 290px;
  overflow: auto;
  padding-right: 3px;
}

@media (max-width: 980px) {
  .storage-head,
  .storage-layout,
  .storage-grid,
  .storage-rules {
    grid-template-columns: 1fr;
  }

  .storage-mark {
    max-width: 150px;
  }
}

@media (max-width: 680px) {
  .storage-actions,
  .storage-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeStorageJs() {
  write("assets/vedapath-storage-design-gate.js", `const storageRoot = document.getElementById("storageDesignGate");

if (storageRoot) {
  initStorageDesignGate().catch((error) => {
    storageRoot.innerHTML = '<article class="storage-result"><strong>Storage design gate could not load.</strong></article>';
    console.error(error);
  });
}

function storageSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseStorageJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function storageMissingForState(config, design) {
  const required = config.required_by_state?.[design.design_state] || [];
  return required.filter((field) => !String(design[field] ?? "").trim());
}

function keepsWriteBoundary(value) {
  const text = String(value || "");
  const hasBoundary = /(design only|canonical_write_allowed remains false|no production|blocked|no canonical writes|no production source data is written)/i.test(text);
  const badWrite = /(write enabled|production write|canonical_write_allowed true|mutated|changed source|source data changed)/i.test(text);
  return hasBoundary && !badWrite;
}

function hasAuditReceiptRule(value) {
  const text = String(value || "");
  return /(audit receipt|immutable)/i.test(text) && /(actor|packet|hash|reason|source_answer_id)/i.test(text);
}

function hasRollbackReceiptRule(value) {
  const text = String(value || "");
  return /(rollback receipt|rollback plan|before state|restore action|discard path)/i.test(text) && /(before|restore|discard|rollback)/i.test(text);
}

function hasReplayRule(value) {
  const text = String(value || "");
  return /replay/i.test(text) && /(packet|receipt|source snapshot|audit)/i.test(text);
}

function storageDesignGate(config, releaseReview, design) {
  const missing = storageMissingForState(config, design);
  const blocked = [];
  const warnings = [];
  const review = releaseReview || {};
  const state = design.design_state || "Draft storage design";
  const ready = state === "Storage design ready";

  if (!releaseReview || typeof releaseReview !== "object" || Array.isArray(releaseReview)) missing.push("release review");
  if (review.canonical_write_allowed !== false) blocked.push("release review must keep canonical_write_allowed false");
  if (review.production_ready === true) blocked.push("release review cannot already be production ready");
  if (ready && (review.review_status !== "Approved for storage design" || review.storage_design_ready !== true)) blocked.push("release review is not approved for storage design");
  if (ready && !keepsWriteBoundary(design.write_boundary)) blocked.push("write boundary must keep canonical writes blocked");
  if (ready && !hasAuditReceiptRule(design.audit_receipt_rule)) blocked.push("audit receipt rule must be explicit");
  if (ready && !hasRollbackReceiptRule(design.rollback_receipt_rule)) blocked.push("rollback receipt rule must be explicit");
  if (ready && !hasReplayRule(design.replay_rule)) blocked.push("replay rule must be explicit");
  if (Array.isArray(review.blocked) && review.blocked.length > 0) warnings.push("Release review still carries blocked items.");
  if (Array.isArray(review.warnings)) warnings.push(...review.warnings);

  const design_status = missing.length || blocked.length ? "Blocked" : state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    storage_design_id: "storage-design-" + Date.now(),
    design_status,
    production_ready: false,
    canonical_write_allowed: false,
    storage_design_ready: design_status === "Storage design ready",
    storage_write_enabled: false,
    release_review_id: review.release_review_id || "",
    dry_run_audit_id: review.dry_run_audit_id || "",
    implementation_task_id: review.implementation_task_id || "",
    source_answer_id: review.source_answer_id || "",
    source_record_id: review.source_record_id || "",
    source_family: review.source_family || "",
    owner_decision_id: review.owner_decision_id || "",
    design_state: state,
    architect_name: design.architect_name || "",
    design_note: design.design_note || "",
    schema_summary: design.schema_summary || "",
    architecture_question: design.architecture_question || "",
    audit_receipt_rule: design.audit_receipt_rule || "",
    rollback_receipt_rule: design.rollback_receipt_rule || "",
    replay_rule: design.replay_rule || "",
    write_boundary: design.write_boundary || "",
    return_reason: design.return_reason || "",
    block_reason: design.block_reason || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.storage_policy
    ],
    release_review: review,
    created_at: new Date().toISOString()
  };
}

function storageDesignSnapshot(designs, config) {
  const byStatus = designs.reduce((counts, design) => {
    const key = design.design_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: designs.length,
    storage_design_ready: byStatus["Storage design ready"] || 0,
    draft: byStatus["Draft storage design"] || 0,
    architecture_review: byStatus["Needs architecture review"] || 0,
    returned: byStatus["Return to release review"] || 0,
    blocked: byStatus.Blocked || 0,
    storage_design_blocked: byStatus["Storage design blocked"] || 0,
    designs
  };
}

async function storageLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readStorageStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeStorageStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initStorageDesignGate() {
  const config = await storageLoadJson("data/vedapath-storage-design-gate.json");
  const storeKey = config.local_storage_design_store;
  let designs = readStorageStore(storeKey);
  let activeDesign = null;

  const reviewInput = storageRoot.querySelector("#storageReleaseReview");
  const stateSelect = storageRoot.querySelector("#storageDesignState");
  const architectInput = storageRoot.querySelector("#storageArchitect");
  const noteInput = storageRoot.querySelector("#storageNote");
  const schemaInput = storageRoot.querySelector("#storageSchema");
  const questionInput = storageRoot.querySelector("#storageQuestion");
  const auditRuleInput = storageRoot.querySelector("#storageAuditRule");
  const rollbackRuleInput = storageRoot.querySelector("#storageRollbackRule");
  const replayRuleInput = storageRoot.querySelector("#storageReplayRule");
  const boundaryInput = storageRoot.querySelector("#storageBoundary");
  const returnInput = storageRoot.querySelector("#storageReturnReason");
  const blockInput = storageRoot.querySelector("#storageBlockReason");
  const resultEl = storageRoot.querySelector("#storageResultCard");
  const packetEl = storageRoot.querySelector("#storagePacket");
  const checksEl = storageRoot.querySelector("#storageChecks");
  const reviewScopeEl = storageRoot.querySelector("#storageReviewScope");
  const savedEl = storageRoot.querySelector("#storageSaved");
  const runButton = storageRoot.querySelector("#runStorageDesign");
  const sampleButton = storageRoot.querySelector("#loadStorageSample");
  const saveButton = storageRoot.querySelector("#saveStorageDesign");
  const clearButton = storageRoot.querySelector("#clearStorageDesigns");
  const copyButton = storageRoot.querySelector("#copyStoragePacket");

  stateSelect.innerHTML = (config.design_states || []).map((state) => '<option value="' + storageSafe(state) + '">' + storageSafe(state) + '</option>').join("");

  function loadSample() {
    reviewInput.value = JSON.stringify(config.sample_release_review, null, 2);
    stateSelect.value = config.sample_design.design_state;
    architectInput.value = config.sample_design.architect_name;
    noteInput.value = config.sample_design.design_note;
    schemaInput.value = config.sample_design.schema_summary;
    questionInput.value = config.sample_design.architecture_question;
    auditRuleInput.value = config.sample_design.audit_receipt_rule;
    rollbackRuleInput.value = config.sample_design.rollback_receipt_rule;
    replayRuleInput.value = config.sample_design.replay_rule;
    boundaryInput.value = config.sample_design.write_boundary;
    returnInput.value = config.sample_design.return_reason;
    blockInput.value = config.sample_design.block_reason;
  }

  function designFromForm() {
    return {
      design_state: stateSelect.value,
      architect_name: architectInput.value.trim(),
      design_note: noteInput.value.trim(),
      schema_summary: schemaInput.value.trim(),
      architecture_question: questionInput.value.trim(),
      audit_receipt_rule: auditRuleInput.value.trim(),
      rollback_receipt_rule: rollbackRuleInput.value.trim(),
      replay_rule: replayRuleInput.value.trim(),
      write_boundary: boundaryInput.value.trim(),
      return_reason: returnInput.value.trim(),
      block_reason: blockInput.value.trim()
    };
  }

  function renderChecks() {
    checksEl.innerHTML = (config.storage_checks || []).map((item) => (
      '<article class="storage-rule"><span>' + storageSafe(item.check) + '</span><strong>' + storageSafe(item.rule) + '</strong></article>'
    )).join("");
  }

  function renderReviewScope(review) {
    reviewScopeEl.innerHTML = [
      ["Release review", review.review_status || "Unknown"],
      ["Source answer", review.source_answer_id || "No source answer"],
      ["Storage design", review.storage_design_ready === true ? "Ready" : "No"],
      ["Canonical writes", review.canonical_write_allowed === false ? "False" : "Check"],
      ["Production", review.production_ready === false ? "False" : "Check"],
      ["Boundary", review.storage_boundary || "No boundary"]
    ].map((row) => (
      '<article class="storage-card ' + (row[0] === "Canonical writes" || row[0] === "Storage design" ? "ready" : "") + '"><span>' + storageSafe(row[0]) + '</span><strong>' + storageSafe(row[1]) + '</strong></article>'
    )).join("");
  }

  function renderSaved() {
    savedEl.innerHTML = designs.slice(0, 8).map((design) => (
      '<article class="storage-card">' +
        '<span>' + storageSafe(design.created_at) + '</span>' +
        '<strong>' + storageSafe(design.design_status) + '</strong>' +
        '<span>' + storageSafe((design.source_answer_id || "storage") + " | " + design.architect_name) + '</span>' +
      '</article>'
    )).join("") || '<article class="storage-card"><strong>No storage designs yet</strong><span>Design and save one gate packet to begin.</span></article>';
  }

  function renderDesign() {
    const review = parseStorageJson(reviewInput.value, {});
    const design = designFromForm();
    const result = storageDesignGate(config, review, design);
    activeDesign = result;
    resultEl.dataset.state = result.design_status;
    resultEl.innerHTML = [
      '<span class="badge ' + (result.storage_design_ready ? 'green' : '') + '">' + storageSafe(result.design_status) + '</span>',
      '<h2>Storage design packet</h2>',
      '<p class="muted">' + storageSafe(result.source_answer_id || "No source answer") + '</p>',
      '<div class="storage-grid">',
      '<article class="storage-card"><span>Missing</span><strong>' + storageSafe(result.missing.length ? result.missing.join(", ") : "None") + '</strong></article>',
      '<article class="storage-card"><span>Blocked</span><strong>' + storageSafe(result.blocked.length ? result.blocked.join(", ") : "None") + '</strong></article>',
      '<article class="storage-card"><span>Storage ready</span><strong>' + storageSafe(result.storage_design_ready ? "Ready" : "No") + '</strong></article>',
      '<article class="storage-card"><span>Writes enabled</span><strong>False</strong></article>',
      '</div>'
    ].join("");
    packetEl.value = JSON.stringify(result, null, 2);
    renderReviewScope(review);
  }

  [reviewInput, stateSelect, architectInput, noteInput, schemaInput, questionInput, auditRuleInput, rollbackRuleInput, replayRuleInput, boundaryInput, returnInput, blockInput].forEach((el) => {
    el.addEventListener("input", renderDesign);
    el.addEventListener("change", renderDesign);
  });

  runButton.addEventListener("click", renderDesign);
  sampleButton.addEventListener("click", () => {
    loadSample();
    renderDesign();
  });
  saveButton.addEventListener("click", () => {
    if (!activeDesign) renderDesign();
    designs = [activeDesign, ...designs].slice(0, 24);
    writeStorageStore(storeKey, designs);
    renderSaved();
  });
  clearButton.addEventListener("click", () => {
    designs = [];
    writeStorageStore(storeKey, designs);
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
  renderDesign();
}

if (typeof window !== "undefined") {
  window.vedapathStorageDesignGate = {
    storageDesignGate,
    storageDesignSnapshot,
    storageMissingForState,
    parseStorageJson
  };
}
`);
}

function writeStoragePage() {
  write("storagedesigngate.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Storage Design Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-storage-design-gate.css">
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
            <span>Storage design gate</span>
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

      <main class="workspace" aria-label="VedaPath Storage Design Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Storage restraint</span>
          <h2>Design storage without writes</h2>
          <p class="muted">A reviewed packet can define schema, receipts, rollback, and replay rules. It still cannot write source records.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Receive</strong><p>Read release review.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Model</strong><p>Define storage shape.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Receipt</strong><p>Require audit and rollback.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Gate</strong><p>Keep writes closed.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="releasereviewgate.html">Open Release Review</a>
            <a class="button safe" href="productiondryrunaudit.html">Open Dry Run</a>
          </div>
        </aside>

        <section class="panel storage-app" id="storageDesignGate">
          <div class="storage-head">
            <div>
              <span class="eyebrow">Storage design gate</span>
              <h1>Design the storage. Keep writes closed.</h1>
              <p class="muted">This room turns an approved release-review packet into a storage design contract: schema, immutable audit receipt, rollback receipt, replay rule, and write boundary.</p>
            </div>
            <div class="storage-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath storage design mark"></div>
          </div>

          <section class="storage-layout">
            <div class="storage-form">
              <h2>Storage Design</h2>
              <label>Release review packet<textarea id="storageReleaseReview"></textarea></label>
              <label>Design state<select id="storageDesignState"></select></label>
              <label>Architect name<input id="storageArchitect" type="text" placeholder="Storage architect"></label>
              <label>Design note<textarea id="storageNote"></textarea></label>
              <label>Schema summary<textarea id="storageSchema"></textarea></label>
              <label>Architecture question<textarea id="storageQuestion"></textarea></label>
              <label>Audit receipt rule<textarea id="storageAuditRule"></textarea></label>
              <label>Rollback receipt rule<textarea id="storageRollbackRule"></textarea></label>
              <label>Replay rule<textarea id="storageReplayRule"></textarea></label>
              <label>Write boundary<textarea id="storageBoundary"></textarea></label>
              <label>Return reason<textarea id="storageReturnReason"></textarea></label>
              <label>Block reason<textarea id="storageBlockReason"></textarea></label>
              <div class="storage-actions">
                <button class="button primary" id="runStorageDesign" type="button">Design Gate</button>
                <button class="button safe" id="loadStorageSample" type="button">Load Sample</button>
                <button class="button" id="saveStorageDesign" type="button">Save Local</button>
                <button class="button" id="clearStorageDesigns" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="storage-result" id="storageResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Release Review Scope</h2>
                <div class="storage-list" id="storageReviewScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Storage Checks</h2>
            <div class="storage-rules" id="storageChecks"></div>
          </section>

          <section class="storage-layout">
            <div>
              <div class="storage-actions">
                <button class="button safe" id="copyStoragePacket" type="button">Copy Storage Packet</button>
                <a class="button" href="data/vedapath-storage-design-gate.json">Open JSON</a>
              </div>
              <textarea class="storage-packet" id="storagePacket" aria-label="Storage design packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Designs</h2>
              <div class="storage-list" id="storageSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Storage gate</span>
          <h2 style="margin-top: 14px;">Write Boundary</h2>
          <p class="muted">Storage design is a contract, not a launch. Production source writes remain false until immutable audit, rollback proof, and final founder instruction exist.</p>
          <div class="progress" aria-label="Storage design gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>5</strong></div>
            <div class="metric"><span>Writes</span><strong>False</strong></div>
            <div class="metric"><span>Store</span><strong>Local</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Storage Rule</h2>
            <p class="muted">No canonical source-answer data changes in this release. The product gains a storage plan, not production memory.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-storage-design-gate.js"></script>
  </body>
</html>
`);
}

function updateNavigationLinks() {
  let review = read("releasereviewgate.html");
  if (!review.includes("storagedesigngate.html")) {
    review = review.replace(
      '<a class="button safe" href="productiondryrunaudit.html">Open Dry Run</a>\n            <a class="button" href="implementationqueue.html">Open Queue</a>',
      '<a class="button primary" href="storagedesigngate.html">Open Storage Design</a>\n            <a class="button safe" href="productiondryrunaudit.html">Open Dry Run</a>\n            <a class="button" href="implementationqueue.html">Open Queue</a>'
    );
  }
  write("releasereviewgate.html", review);

  let dryRun = read("productiondryrunaudit.html");
  if (!dryRun.includes("storagedesigngate.html")) {
    dryRun = dryRun.replace(
      '<a class="button primary" href="releasereviewgate.html">Open Release Review</a>',
      '<a class="button primary" href="releasereviewgate.html">Open Release Review</a>\n            <a class="button" href="storagedesigngate.html">Open Storage Design</a>'
    );
  }
  write("productiondryrunaudit.html", dryRun);
}

function updateIndex() {
  let content = read("index.html");
  if (!content.includes('storagedesigngate.html">Storage design')) {
    content = content.replace(
      '<a href="releasereviewgate.html">Release review <span>gate</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>',
      '<a href="releasereviewgate.html">Release review <span>gate</span></a>\n              <a href="storagedesigngate.html">Storage design <span>gate</span></a>\n              <a href="mantralenslab.html">Mantra <span>lens</span></a>'
    );
    content = content.replace(
      '<a href="releasereviewgate.html">Review gate <span>signoff</span></a>\n            </div>',
      '<a href="releasereviewgate.html">Review gate <span>signoff</span></a>\n              <a href="storagedesigngate.html">Storage gate <span>schema</span></a>\n            </div>'
    );
  }
  content = content.replace(
    "storage design, immutable audit, and production memory.",
    "audit receipts, rollback receipts, and production memory."
  );
  write("index.html", content);
}

function updateBuildStatus() {
  let content = read("build-status.html");
  content = content
    .replace('<strong>v3.0.2</strong>\n          <p>Release Review Gate: ready dry-run audits now become human review decisions for storage design, return, block, or founder hold.</p>', '<strong>v3.0.3</strong>\n          <p>Storage Design Gate: release-approved packets now define storage schema, immutable audit receipt, rollback receipt, replay rules, and write boundaries.</p>')
    .replace('<strong>84%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:84%"></div></div>\n          <p>The trust loop now has a final review decision before storage design begins.</p>', '<strong>85%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:85%"></div></div>\n          <p>The trust loop now has a storage design contract before any production write exists.</p>')
    .replace('<strong>Storage design gate</strong>\n          <p>Design storage controls, audit receipts, and rollback rules without enabling canonical writes.</p>', '<strong>Immutable audit receipt</strong>\n          <p>Create local audit receipt dry runs for future storage writes while canonical writes remain blocked.</p>')
    .replace('<div class="percent">84%</div>', '<div class="percent">85%</div>');

  const reviewPhase = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 266: Release Review Gate</strong>
                <p>Adds human release-review decisions for storage design, return to dry run, block, or founder hold while writes remain blocked.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  const storagePhase = `${reviewPhase}
            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 267: Storage Design Gate</strong>
                <p>Defines schema, immutable audit receipt, rollback receipt, replay rule, and write boundary while canonical writes stay blocked.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 267: Storage Design Gate")) {
    content = content.replace(reviewPhase, storagePhase);
    content = content.replace("Phase 267: Production Implementation and Licensed Audio", "Phase 268: Production Implementation and Licensed Audio");
  }

  content = content
    .replace('<div class="version-row"><span>Release</span><strong>v3.0.2 Release Review Gate</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.0.3 Storage Design Gate</strong></div>')
    .replace('<div class="version-row"><span>Previous</span><strong>v3.0.1 Production Dry-Run Audit</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.0.2 Release Review Gate</strong></div>')
    .replace('<div class="version-row"><span>Goal</span><strong>Add a human release gate before storage design begins.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Define storage controls before any canonical source write.</strong></div>')
    .replace('<div class="version-row"><span>Status</span><strong>Ready for storage design gate</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for immutable audit receipt dry run</strong></div>')
    .replace(`<li><span class="dot"></span><span>Design storage schema without enabling writes.</span></li>
              <li><span class="dot"></span><span>Add immutable audit receipt requirements.</span></li>
              <li><span class="dot"></span><span>Define rollback receipt and replay rules.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`, `<li><span class="dot"></span><span>Create audit receipt dry run packets.</span></li>
              <li><span class="dot"></span><span>Add before and after hash placeholders.</span></li>
              <li><span class="dot"></span><span>Define receipt replay and rollback proof.</span></li>
              <li><span class="dot"></span><span>Keep canonical writes blocked until final founder instruction.</span></li>`);
  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH STORAGE DESIGN GATE START -->", "<!-- VEDAPATH STORAGE DESIGN GATE END -->", `## ${release} Storage Design Gate

This release adds the storage design layer after release review.

- adds storagedesigngate.html
- adds data/vedapath-storage-design-gate.json
- defines source-answer draft tables, review receipts, audit receipts, rollback receipts, and replay queue
- keeps storage_write_enabled false, production_ready false, and canonical_write_allowed false
- sets the next release as immutable audit receipt dry run`, "<!-- VEDAPATH RELEASE REVIEW GATE START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH STORAGE DESIGN GATE NOTES START -->", "<!-- VEDAPATH STORAGE DESIGN GATE NOTES END -->", `## ${release} Storage Design Gate

This phase converts an approved release-review packet into a storage design contract.

Action taken:

- Added storage design gate schema.
- Added design states for draft, architecture review, ready, return, and blocked.
- Required schema summary, audit receipt rule, rollback receipt rule, replay rule, and write boundary before ready.
- Added copyable storage design packets and local design memory.
- Preserved canonical source data.`, "<!-- VEDAPATH RELEASE REVIEW GATE NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH STORAGE DESIGN GATE BLUEPRINT START -->", "<!-- VEDAPATH STORAGE DESIGN GATE BLUEPRINT END -->", `### 286. Storage Design Gate

VedaPath should design storage before it writes anything.

Rules:

- Storage design can start only from a release-review packet approved for storage design.
- A ready design must include schema, immutable audit receipt rule, rollback receipt rule, replay rule, and write boundary.
- Storage design readiness is not production readiness.
- Canonical writes remain false in preview.
- The next build should dry-run immutable audit receipts before any production storage work.`, "<!-- VEDAPATH RELEASE REVIEW GATE BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/STORAGE_DESIGN_GATE.md", `# VedaPath AI Storage Design Gate

Release: ${release}

This release adds the storage design layer after release review.

## Files

- data/vedapath-storage-design-gate.json
- storagedesigngate.html
- assets/vedapath-storage-design-gate.css
- assets/vedapath-storage-design-gate.js

## What It Adds

The room:

- reads a release-review packet
- records storage design states
- defines draft source-answer storage boundaries
- requires immutable audit receipt rules
- requires rollback receipt rules
- requires replay rules
- exports a copyable storage design packet
- stores local design history only

## Boundary

Storage design is not production storage. Canonical source records remain unchanged. Production still requires immutable audit dry runs, rollback proof, controlled storage, and final founder instruction.
`);
}

writeStorageData();
writeStorageCss();
writeStorageJs();
writeStoragePage();
updateAllHtmlShells();
updateNavigationLinks();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} storage design gate applied.`);

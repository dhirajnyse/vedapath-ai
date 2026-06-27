const storageRoot = document.getElementById("storageDesignGate");

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

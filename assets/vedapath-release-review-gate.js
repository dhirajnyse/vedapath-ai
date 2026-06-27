const gateRoot = document.getElementById("releaseReviewGate");

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

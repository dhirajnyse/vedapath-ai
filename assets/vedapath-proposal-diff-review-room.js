const diffRoot = document.getElementById("proposalDiffReviewRoom");

if (diffRoot) {
  initProposalDiffReviewRoom().catch((error) => {
    diffRoot.innerHTML = '<article class="diff-result"><strong>Proposal diff review room could not load.</strong></article>';
    console.error(error);
  });
}

function diffSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseDiffJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function missingForState(config, review) {
  const required = config.required_by_state?.[review.decision_state] || [];
  return required.filter((field) => !String(review[field] ?? "").trim());
}

function reviewProposalDiff(config, proposal, review) {
  const missing = missingForState(config, review);
  const warnings = [];
  const blocked = [];

  if (!proposal || typeof proposal !== "object") missing.push("proposal packet");
  if (proposal && proposal.missing && proposal.missing.length) blocked.push("proposal has missing requirements");
  if (proposal && proposal.blocked_fields && proposal.blocked_fields.length && review.decision_state !== "Rejected" && review.decision_state !== "Request revision") {
    warnings.push("Proposal contains blocked fields; keep them out of approval scope.");
  }
  if (review.decision_state === "Approved for production backlog" && proposal && proposal.blocked_fields && proposal.blocked_fields.length) {
    blocked.push("blocked fields must be resolved before production backlog");
  }

  const canAdvance = missing.length === 0 && blocked.length === 0;
  const local_status = !canAdvance ? "Blocked" : review.decision_state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    review_id: "proposal-review-" + Date.now(),
    local_status,
    production_ready: false,
    proposal_id: proposal?.proposal_id || "",
    source_answer_id: proposal?.source_answer_id || "",
    decision_state: review.decision_state,
    reviewer_name: review.reviewer_name || "",
    source_owner: review.source_owner || "",
    second_reviewer: review.second_reviewer || "",
    review_note: review.review_note || "",
    revision_reason: review.revision_reason || "",
    rejection_reason: review.rejection_reason || "",
    rollback_note: review.rollback_note || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.review_policy
    ],
    reviewed_diff_count: proposal?.diffs?.length || 0,
    blocked_field_count: proposal?.blocked_fields?.length || 0,
    created_at: new Date().toISOString()
  };
}

function diffReviewSnapshot(reviews, config) {
  const byStatus = reviews.reduce((counts, review) => {
    const key = review.local_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: reviews.length,
    blocked: byStatus.Blocked || 0,
    request_revision: byStatus["Request revision"] || 0,
    rejected: byStatus.Rejected || 0,
    ready_for_source_owner: byStatus["Ready for source owner"] || 0,
    approved_for_production_backlog: byStatus["Approved for production backlog"] || 0,
    reviews
  };
}

async function diffLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readDiffStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeDiffStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initProposalDiffReviewRoom() {
  const config = await diffLoadJson("data/vedapath-proposal-diff-review-room.json");
  const storeKey = config.local_review_store;
  let reviews = readDiffStore(storeKey);
  let activeReview = null;

  const proposalInput = diffRoot.querySelector("#diffProposalPacket");
  const decisionSelect = diffRoot.querySelector("#diffDecisionState");
  const reviewerInput = diffRoot.querySelector("#diffReviewer");
  const ownerInput = diffRoot.querySelector("#diffSourceOwner");
  const secondInput = diffRoot.querySelector("#diffSecondReviewer");
  const noteInput = diffRoot.querySelector("#diffReviewNote");
  const revisionInput = diffRoot.querySelector("#diffRevisionReason");
  const rejectionInput = diffRoot.querySelector("#diffRejectionReason");
  const rollbackInput = diffRoot.querySelector("#diffRollbackNote");
  const resultEl = diffRoot.querySelector("#diffResult");
  const packetEl = diffRoot.querySelector("#diffPacket");
  const diffList = diffRoot.querySelector("#diffList");
  const rulesEl = diffRoot.querySelector("#diffRules");
  const savedEl = diffRoot.querySelector("#diffSaved");
  const reviewButton = diffRoot.querySelector("#reviewDiff");
  const sampleButton = diffRoot.querySelector("#loadDiffSample");
  const saveButton = diffRoot.querySelector("#saveDiffReview");
  const copyButton = diffRoot.querySelector("#copyDiffReview");
  const clearButton = diffRoot.querySelector("#clearDiffReviews");

  decisionSelect.innerHTML = (config.decision_states || []).map((state) => '<option value="' + diffSafe(state) + '">' + diffSafe(state) + '</option>').join("");

  function loadSample() {
    proposalInput.value = JSON.stringify(config.sample_proposal, null, 2);
    decisionSelect.value = config.sample_review.decision_state;
    reviewerInput.value = config.sample_review.reviewer_name;
    ownerInput.value = config.sample_review.source_owner;
    secondInput.value = config.sample_review.second_reviewer;
    noteInput.value = config.sample_review.review_note;
    revisionInput.value = config.sample_review.revision_reason;
    rejectionInput.value = config.sample_review.rejection_reason;
    rollbackInput.value = config.sample_review.rollback_note;
  }

  function reviewFromForm() {
    return {
      decision_state: decisionSelect.value,
      reviewer_name: reviewerInput.value.trim(),
      source_owner: ownerInput.value.trim(),
      second_reviewer: secondInput.value.trim(),
      review_note: noteInput.value.trim(),
      revision_reason: revisionInput.value.trim(),
      rejection_reason: rejectionInput.value.trim(),
      rollback_note: rollbackInput.value.trim()
    };
  }

  function renderDiffs(proposal) {
    const diffs = proposal?.diffs || [];
    const blocked = proposal?.blocked_fields || [];
    diffList.innerHTML = [
      ...diffs.map((diff) => (
        '<article class="diff-card safe">' +
          '<span>Editable diff</span><strong>' + diffSafe(diff.field) + '</strong>' +
          '<span>Current</span><strong>' + diffSafe(diff.current_value) + '</strong>' +
          '<span>Proposed</span><strong>' + diffSafe(diff.proposed_value) + '</strong>' +
        '</article>'
      )),
      ...blocked.map((field) => (
        '<article class="diff-card blocked">' +
          '<span>Blocked field</span><strong>' + diffSafe(field.field) + '</strong>' +
          '<span>Attempted</span><strong>' + diffSafe(field.attempted_value) + '</strong>' +
          '<span>Reason</span><strong>' + diffSafe(field.reason) + '</strong>' +
        '</article>'
      ))
    ].join("");
  }

  function renderRules() {
    rulesEl.innerHTML = [
      ["Store", storeKey],
      ["States", (config.decision_states || []).join(", ")],
      ["Production", "Always false in this preview"],
      ["Boundary", config.warning]
    ].map((row) => '<article class="diff-rule"><span>' + diffSafe(row[0]) + '</span><strong>' + diffSafe(row[1]) + '</strong></article>').join("");
  }

  function renderSaved() {
    savedEl.innerHTML = reviews.slice(0, 8).map((review) => (
      '<article class="diff-card">' +
        '<span>' + diffSafe(review.created_at) + '</span>' +
        '<strong>' + diffSafe(review.local_status) + '</strong>' +
        '<span>' + diffSafe((review.source_answer_id || "proposal") + " | " + review.reviewer_name) + '</span>' +
      '</article>'
    )).join("") || '<article class="diff-card"><strong>No saved diff reviews yet</strong><span>Review and save one proposal to begin.</span></article>';
  }

  function renderReview() {
    const proposal = parseDiffJson(proposalInput.value, {});
    const review = reviewFromForm();
    const result = reviewProposalDiff(config, proposal, review);
    activeReview = result;
    resultEl.dataset.state = result.local_status;
    resultEl.innerHTML = [
      '<span class="badge ' + (result.local_status === "Blocked" ? '' : 'green') + '">' + diffSafe(result.local_status) + '</span>',
      '<h2>Diff review decision</h2>',
      '<p class="muted">' + diffSafe(result.source_answer_id || "No source answer") + '</p>',
      '<div class="diff-grid">',
      '<article class="diff-card"><span>Missing</span><strong>' + diffSafe(result.missing.length ? result.missing.join(", ") : "None") + '</strong></article>',
      '<article class="diff-card"><span>Blocked</span><strong>' + diffSafe(result.blocked.length ? result.blocked.join(", ") : "None") + '</strong></article>',
      '<article class="diff-card"><span>Diffs reviewed</span><strong>' + diffSafe(result.reviewed_diff_count) + '</strong></article>',
      '<article class="diff-card"><span>Blocked fields</span><strong>' + diffSafe(result.blocked_field_count) + '</strong></article>',
      '</div>'
    ].join("");
    packetEl.value = JSON.stringify(result, null, 2);
    renderDiffs(proposal);
  }

  [proposalInput, decisionSelect, reviewerInput, ownerInput, secondInput, noteInput, revisionInput, rejectionInput, rollbackInput].forEach((el) => {
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
    writeDiffStore(storeKey, reviews);
    renderSaved();
  });
  clearButton.addEventListener("click", () => {
    reviews = [];
    writeDiffStore(storeKey, reviews);
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
  renderReview();
}

if (typeof window !== "undefined") {
  window.vedapathProposalDiffReviewRoom = {
    reviewProposalDiff,
    diffReviewSnapshot,
    missingForState,
    parseDiffJson
  };
}

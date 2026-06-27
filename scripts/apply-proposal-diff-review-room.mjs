import fs from "node:fs";
import path from "node:path";

const release = "v2.9.8";
const badge = `${release} diff review`;

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
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}proposaldiffreview.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`)
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
  let content = read(file);
  content = content.replace(
    '<a class="link" href="reviewqueuepersistence.html">Review</a>',
    '<a class="link active" href="reviewqueuepersistence.html">Review</a>'
  );
  write(file, content);
}

function proposalBridgeConfig() {
  return JSON.parse(read("data/vedapath-source-update-proposal-bridge.json"));
}

function writeDiffReviewData() {
  const bridge = proposalBridgeConfig();
  const data = {
    product: "VedaPath AI",
    release,
    status: "proposal diff review room v1",
    schema_version: "proposal-diff-review-room-v1",
    proposal_bridge_dataset: "data/vedapath-source-update-proposal-bridge.json",
    source_dataset: "data/vedapath-source-answer-foundation.json",
    local_review_store: "vedapath-proposal-diff-reviews-v1",
    warning: "This room reviews draft source-update proposals only. It does not approve production publishing, edit canonical data, verify scholarship, approve rights, provide therapy, give ritual instruction, or become spiritual authority.",
    review_policy: "A source proposal can move through local review states, but production still requires source-owner approval, durable identity, immutable audit, rollback readiness, and controlled storage before canonical records change.",
    decision_states: [
      "Needs diff review",
      "Request revision",
      "Rejected",
      "Ready for source owner",
      "Approved for production backlog"
    ],
    required_by_state: {
      "Needs diff review": ["reviewer_name", "review_note"],
      "Request revision": ["reviewer_name", "review_note", "revision_reason"],
      "Rejected": ["reviewer_name", "review_note", "rejection_reason"],
      "Ready for source owner": ["reviewer_name", "review_note", "source_owner", "rollback_note"],
      "Approved for production backlog": ["reviewer_name", "review_note", "source_owner", "rollback_note", "second_reviewer"]
    },
    blocked_approval_conditions: [
      "proposal has missing requirements",
      "proposal attempts blocked fields",
      "source owner is blank",
      "rollback note is blank",
      "second reviewer is blank for production backlog"
    ],
    sample_proposal: {
      schema_version: bridge.schema_version,
      release: bridge.release,
      proposal_id: "source-proposal-sample-diff-review",
      status: "Draft proposal only",
      source_answer_id: bridge.sample_proposal.source_answer_id,
      source_record_id: "bg-2-48-steadiness",
      source: "Bhagavad Gita 2.48",
      source_family: "Bhagavad Gita | Smriti",
      audit_packet: bridge.sample_audit_packet,
      diffs: [
        {
          field: "review_state",
          current_value: "reviewed-preview",
          proposed_value: "source-update-proposed"
        },
        {
          field: "readiness",
          current_value: "answer-preview-ready",
          proposed_value: "needs-source-owner-review"
        },
        {
          field: "boundary",
          current_value: "Reflection support only; not therapy, medical advice, or command language.",
          proposed_value: "Reflection support only; not therapy, medical advice, ritual instruction, or spiritual authority."
        }
      ],
      blocked_fields: [
        {
          field: "source",
          attempted_value: "Bhagavad Gita 2.48 - edited directly",
          reason: "Canonical or rights-sensitive field requires a separate source-owner process."
        }
      ],
      missing: [],
      warnings: [
        bridge.proposal_policy
      ],
      production_requirements: bridge.production_requirements,
      created_at: "2026-06-27T00:00:00.000Z"
    },
    sample_review: {
      decision_state: "Ready for source owner",
      reviewer_name: "Founder review",
      source_owner: "Source reviewer",
      second_reviewer: "",
      review_note: "Diff is clear enough for source-owner review, but blocked source field must remain out of scope.",
      revision_reason: "",
      rejection_reason: "",
      rollback_note: "Rollback by discarding this proposal packet; canonical source record remains unchanged in preview."
    }
  };
  write("data/vedapath-proposal-diff-review-room.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeDiffReviewCss() {
  write("assets/vedapath-proposal-diff-review-room.css", `/* VedaPath proposal diff review room */
.diff-app,
.diff-head,
.diff-layout,
.diff-form,
.diff-grid,
.diff-list,
.diff-actions,
.diff-rules {
  display: grid;
  gap: 10px;
}

.diff-app {
  gap: 16px;
}

.diff-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.diff-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.diff-mark img {
  display: block;
  width: 100%;
}

.diff-layout {
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  align-items: start;
}

.diff-form,
.diff-card,
.diff-result,
.diff-packet,
.diff-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.diff-form,
.diff-card,
.diff-result,
.diff-rule {
  padding: 12px;
}

.diff-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.diff-form input,
.diff-form select,
.diff-form textarea,
.diff-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.diff-form textarea,
.diff-packet {
  min-height: 126px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.diff-grid,
.diff-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.diff-card,
.diff-result {
  border-left: 4px solid var(--gold);
}

.diff-card.safe,
.diff-result[data-state="Ready for source owner"],
.diff-result[data-state="Approved for production backlog"] {
  border-left-color: var(--green);
}

.diff-card.blocked,
.diff-result[data-state="Rejected"],
.diff-result[data-state="Request revision"] {
  border-left-color: var(--ochre);
}

.diff-card span,
.diff-card strong,
.diff-rule span,
.diff-rule strong {
  display: block;
}

.diff-card span,
.diff-rule span {
  color: var(--muted);
  font-size: 12px;
}

.diff-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.diff-list {
  max-height: 290px;
  overflow: auto;
  padding-right: 3px;
}

@media (max-width: 980px) {
  .diff-head,
  .diff-layout,
  .diff-grid,
  .diff-rules {
    grid-template-columns: 1fr;
  }

  .diff-mark {
    max-width: 150px;
  }
}

@media (max-width: 680px) {
  .diff-actions,
  .diff-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeDiffReviewJs() {
  write("assets/vedapath-proposal-diff-review-room.js", `const diffRoot = document.getElementById("proposalDiffReviewRoom");

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
`);
}

function writeDiffReviewPage() {
  write("proposaldiffreview.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Proposal Diff Review Room</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-proposal-diff-review-room.css">
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
            <span>Proposal diff review</span>
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

      <main class="workspace" aria-label="VedaPath Proposal Diff Review workspace">
        <aside class="panel">
          <span class="eyebrow">Proposal control</span>
          <h2>Review the diff before approval</h2>
          <p class="muted">A draft source proposal needs a decision state, source-owner path, rejection option, and rollback note before it can move forward.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Read</strong><p>Inspect the proposal packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Decide</strong><p>Choose a review state.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Explain</strong><p>Add reason and rollback.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Save</strong><p>Keep local review history.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button safe" href="sourceupdateproposalbridge.html">Open Proposal Bridge</a>
            <a class="button" href="reviewidentitygate.html">Open Identity Gate</a>
          </div>
        </aside>

        <section class="panel diff-app" id="proposalDiffReviewRoom">
          <div class="diff-head">
            <div>
              <span class="eyebrow">Proposal diff review room</span>
              <h1>Approve the path, not the source record.</h1>
              <p class="muted">This room reviews draft source proposals. It can move a proposal toward source-owner review, request revision, reject it, or keep it blocked, while production readiness stays false.</p>
            </div>
            <div class="diff-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath diff review mark"></div>
          </div>

          <section class="diff-layout">
            <div class="diff-form">
              <h2>Review Decision</h2>
              <label>Proposal packet<textarea id="diffProposalPacket"></textarea></label>
              <label>Decision state<select id="diffDecisionState"></select></label>
              <label>Reviewer name<input id="diffReviewer" type="text" placeholder="Founder review"></label>
              <label>Source owner<input id="diffSourceOwner" type="text" placeholder="Source reviewer"></label>
              <label>Second reviewer<input id="diffSecondReviewer" type="text" placeholder="Required for production backlog"></label>
              <label>Review note<textarea id="diffReviewNote"></textarea></label>
              <label>Revision reason<textarea id="diffRevisionReason"></textarea></label>
              <label>Rejection reason<textarea id="diffRejectionReason"></textarea></label>
              <label>Rollback note<textarea id="diffRollbackNote"></textarea></label>
              <div class="diff-actions">
                <button class="button primary" id="reviewDiff" type="button">Review Diff</button>
                <button class="button safe" id="loadDiffSample" type="button">Load Sample</button>
                <button class="button" id="saveDiffReview" type="button">Save Local</button>
                <button class="button" id="clearDiffReviews" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="diff-result" id="diffResult" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Diffs and Blocks</h2>
                <div class="diff-list" id="diffList"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Review Rules</h2>
            <div class="diff-rules" id="diffRules"></div>
          </section>

          <section class="diff-layout">
            <div>
              <div class="diff-actions">
                <button class="button safe" id="copyDiffReview" type="button">Copy Review Packet</button>
                <a class="button" href="data/vedapath-proposal-diff-review-room.json">Open JSON</a>
              </div>
              <textarea class="diff-packet" id="diffPacket" aria-label="Proposal diff review packet"></textarea>
            </div>
            <div>
              <h2>Saved Local Reviews</h2>
              <div class="diff-list" id="diffSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Review phase</span>
          <h2 style="margin-top: 14px;">Production Boundary</h2>
          <p class="muted">This room never makes a source record production-ready. It only clarifies the next review state and what must be true before production storage.</p>
          <div class="progress" aria-label="Proposal diff review progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>5</strong></div>
            <div class="metric"><span>Ready</span><strong>False</strong></div>
            <div class="metric"><span>Store</span><strong>Local</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Source Rule</h2>
            <p class="muted">Approving a review path is not approving the source record. Canonical changes still require durable identity, audit, owner review, and rollback readiness.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-proposal-diff-review-room.js"></script>
  </body>
</html>
`);
}

function updateFlowPages() {
  const links = [
    ["sourceupdateproposalbridge.html", '<a class="button safe" href="reviewidentitygate.html">Open Identity Gate</a>', '<a class="button" href="proposaldiffreview.html">Open Diff Review</a>'],
    ["reviewidentitygate.html", '<a class="button" href="sourceupdateproposalbridge.html">Open Proposal Bridge</a>', '<a class="button" href="proposaldiffreview.html">Open Diff Review</a>'],
    ["reviewqueuepersistence.html", '<a class="button" href="sourceupdateproposalbridge.html">Open Proposal Bridge</a>', '<a class="button" href="proposaldiffreview.html">Open Diff Review</a>']
  ];
  for (const [file, anchor, addition] of links) {
    let content = updateVersionBadge(read(file));
    if (!content.includes('href="proposaldiffreview.html"')) {
      content = content.replace(anchor, `${anchor}\n            ${addition}`);
    }
    write(file, content);
  }
}

function updateIndex() {
  let content = pointReviewNavToQueue(updateVersionBadge(read("index.html")));
  if (!content.includes('href="proposaldiffreview.html">Diff review')) {
    content = content.replace(
      '<a href="sourceupdateproposalbridge.html">Source proposal <span>diff</span></a>',
      '<a href="sourceupdateproposalbridge.html">Source proposal <span>diff</span></a>\n              <a href="proposaldiffreview.html">Diff review <span>states</span></a>'
    );
  }
  if (!content.includes('href="proposaldiffreview.html">Diff')) {
    content = content.replace(
      '<a href="sourceupdateproposalbridge.html">Proposal <span>bridge</span></a>',
      '<a href="sourceupdateproposalbridge.html">Proposal <span>bridge</span></a>\n              <a href="proposaldiffreview.html">Diff <span>review</span></a>'
    );
  }
  write("index.html", content);
}

function updateBuildStatus() {
  let content = pointReviewNavToQueue(updateVersionBadge(read("build-status.html")));
  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Proposal Diff Review Room: draft source proposals now get decision states, rejection paths, rollback notes, and local review packets.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>79%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:79%"></div></div>
          <p>The trust loop now has draft proposal review states before any production storage plan.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Source owner approval lane</strong>
          <p>Add a dedicated owner-review lane that accepts, rejects, or returns proposal packets.</p>`);

  const phaseBlock = `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 262: Proposal Diff Review Room</strong>
                <p>Adds local decision states, source-owner path, revision and rejection reasons, rollback note, and copyable review packets.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 262: Proposal Diff Review Room")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 262: Production Implementation and Licensed Audio<\/strong>\s*<p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
      `            ${phaseBlock}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 263: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
  }

  content = content
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Proposal Diff Review Room</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.9.7 Source Update Proposal Bridge</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Review draft source diffs before owner approval.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for source owner approval lane</strong></div>`)
    .replace(/<li><span class="dot"><\/span><span>Add approval states for draft source proposals\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Require source-owner review before production\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Add rollback note and rejection reason fields\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep canonical source records unchanged in preview\.<\/span><\/li>/, `<li><span class="dot"></span><span>Create a source-owner approval lane.</span></li>
              <li><span class="dot"></span><span>Separate returned, rejected, and accepted proposals.</span></li>
              <li><span class="dot"></span><span>Add owner handoff packet export.</span></li>
              <li><span class="dot"></span><span>Keep canonical records untouched until production storage.</span></li>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH PROPOSAL DIFF REVIEW ROOM START -->", "<!-- VEDAPATH PROPOSAL DIFF REVIEW ROOM END -->", `## ${release} Proposal Diff Review Room

This release adds a review layer for draft source-update proposals.

- adds \`data/vedapath-proposal-diff-review-room.json\`
- adds \`proposaldiffreview.html\`
- adds local decision states for draft source proposals
- requires reviewer notes, source-owner path, rollback note, and rejection or revision reasons where needed
- keeps production readiness false in preview
- keeps canonical source records unchanged`, "<!-- VEDAPATH SOURCE UPDATE PROPOSAL BRIDGE START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH PROPOSAL DIFF REVIEW ROOM NOTES START -->", "<!-- VEDAPATH PROPOSAL DIFF REVIEW ROOM NOTES END -->", `## ${release} Proposal Diff Review Room

This phase adds a local decision layer between draft source proposals and owner approval.

Action taken:

- Added proposal diff review schema.
- Added review states, revision path, rejection path, source-owner path, and rollback note.
- Added copyable review packets.
- Preserved canonical source data.
- Set the next phase as source owner approval lane.`, "<!-- VEDAPATH SOURCE UPDATE PROPOSAL BRIDGE NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH PROPOSAL DIFF REVIEW ROOM BLUEPRINT START -->", "<!-- VEDAPATH PROPOSAL DIFF REVIEW ROOM BLUEPRINT END -->", `### 281. Proposal Diff Review Room

VedaPath should make source proposal review explicit before owner approval.

Rules:

- A proposal review can request revision, reject, move to source owner, or mark for production backlog.
- Production readiness remains false in preview.
- Approval-path states require source owner and rollback note.
- Production-backlog state also requires a second reviewer.
- The next build should create a dedicated source-owner approval lane.`, "<!-- VEDAPATH SOURCE UPDATE PROPOSAL BRIDGE BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/PROPOSAL_DIFF_REVIEW_ROOM.md", `# VedaPath AI Proposal Diff Review Room

Release: ${release}

This release reviews draft source-update proposals before they reach a source owner.

## Files

- \`data/vedapath-proposal-diff-review-room.json\`
- \`proposaldiffreview.html\`
- \`assets/vedapath-proposal-diff-review-room.css\`
- \`assets/vedapath-proposal-diff-review-room.js\`

## What It Adds

The room:

- reads a source proposal packet
- shows editable diffs and blocked fields
- adds review states
- requires review notes, owner path, rollback note, and rejection or revision reasons where needed
- exports a review packet
- stores local review history only

## Boundary

This room does not approve production source changes. Canonical records stay unchanged until durable identity, immutable audit, source-owner approval, controlled storage, and rollback handling exist.
`);
}

writeDiffReviewData();
writeDiffReviewCss();
writeDiffReviewJs();
writeDiffReviewPage();
updateAllHtmlShells();
for (const file of ["reviewqueuepersistence.html", "reviewidentitygate.html", "sourceupdateproposalbridge.html", "proposaldiffreview.html"]) {
  activateReviewLane(file);
}
updateFlowPages();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} proposal diff review room applied.`);

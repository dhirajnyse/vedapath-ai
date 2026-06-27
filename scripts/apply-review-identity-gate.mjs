import fs from "node:fs";
import path from "node:path";

const release = "v2.9.6";
const badge = `${release} identity`;

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
    .replace(new RegExp(`<a class="link(?: active)?" href="${escapeRegex(prefix)}reviewidentitygate\\.html">Review<\\/a>`, "g"), `<a class="link" href="${prefix}reviewqueuepersistence.html">Review</a>`)
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

function activateQueueNav() {
  const file = "reviewqueuepersistence.html";
  let content = read(file);
  content = content.replace(
    '<a class="link" href="reviewqueuepersistence.html">Review</a>',
    '<a class="link active" href="reviewqueuepersistence.html">Review</a>'
  );
  write(file, content);
}

function activateIdentityNav() {
  const file = "reviewidentitygate.html";
  let content = read(file);
  content = content.replace(
    '<a class="link" href="reviewqueuepersistence.html">Review</a>',
    '<a class="link active" href="reviewqueuepersistence.html">Review</a>'
  );
  write(file, content);
}

function writeIdentityData() {
  const data = {
    product: "VedaPath AI",
    release,
    status: "reviewer identity and audit gate v1",
    schema_version: "review-identity-gate-v1",
    queue_dataset: "data/vedapath-review-queue-persistence.json",
    ticket_bridge_dataset: "data/vedapath-review-ticket-bridge.json",
    local_identity_store: "vedapath-review-identity-profile-v1",
    warning: "This is a reviewer identity and audit prototype only. It is not production authentication, scholar approval, canonical source validation, therapy, ritual instruction, emergency support, or spiritual authority.",
    production_boundary: "A local review decision can be allowed, but an accepted source update remains proposal-only until production identity, permissions, second review, durable storage, and immutable audit history exist.",
    roles: [
      {
        id: "founder-review",
        label: "Founder review",
        purpose: "Final product judgment before a reviewed change affects the trusted MVP.",
        authority: ["claim", "block", "accept", "close", "request-second-review"],
        cannot: ["silently-rewrite-source", "override-rights-gap"],
        evidence_focus: ["decision note", "source trace", "boundary note", "second reviewer when accepting"]
      },
      {
        id: "source-reviewer",
        label: "Source reviewer",
        purpose: "Checks citation, source family, rights, and whether the passage supports the answer.",
        authority: ["claim", "block", "recommend-accept", "request-second-review"],
        cannot: ["approve-interpretation-alone", "publish-final-answer"],
        evidence_focus: ["citation", "source family", "rights state", "passage fit"]
      },
      {
        id: "retrieval-reviewer",
        label: "Retrieval reviewer",
        purpose: "Checks whether retrieval found the right record and ranked it for the right reason.",
        authority: ["claim", "block", "recommend-accept"],
        cannot: ["approve-source-record", "rewrite-boundary"],
        evidence_focus: ["query intent", "candidate id", "retrieval reason", "miss pattern"]
      },
      {
        id: "mantra-reviewer",
        label: "Mantra reviewer",
        purpose: "Checks Sanskrit, transliteration, verse boundaries, and recitation caution.",
        authority: ["claim", "block", "recommend-accept"],
        cannot: ["give-ritual-instruction", "approve-modern-claim"],
        evidence_focus: ["verse line", "transliteration", "word boundary", "chant caution"]
      },
      {
        id: "interpretation-reviewer",
        label: "Interpretation reviewer",
        purpose: "Checks commentary boundaries and whether multiple views are separated honestly.",
        authority: ["claim", "block", "recommend-accept"],
        cannot: ["flatten-schools", "claim-unanimity"],
        evidence_focus: ["interpretation layer", "tradition note", "disagreement note", "overclaim boundary"]
      },
      {
        id: "source-intake",
        label: "Source intake",
        purpose: "Prepares candidate records before they enter review.",
        authority: ["claim", "block"],
        cannot: ["accept", "close", "publish-final-answer"],
        evidence_focus: ["record completeness", "missing fields", "rights note", "source owner"]
      }
    ],
    actions: [
      {
        id: "claim",
        label: "Claim review",
        meaning: "A reviewer takes responsibility for checking a record.",
        required_fields: ["reviewer_name", "role_id"],
        requires_second_review: false,
        production_status: "allowed-local-action"
      },
      {
        id: "block",
        label: "Block change",
        meaning: "The reviewer stops progress until a gap is resolved.",
        required_fields: ["reviewer_name", "role_id", "decision_note"],
        requires_second_review: false,
        production_status: "allowed-local-action"
      },
      {
        id: "recommend-accept",
        label: "Recommend accept",
        meaning: "A specialist says the record is ready for founder or second review.",
        required_fields: ["reviewer_name", "role_id", "evidence_note", "boundary_note"],
        requires_second_review: true,
        production_status: "proposal-only"
      },
      {
        id: "accept",
        label: "Accept update",
        meaning: "The decision may inform a source record update after production gates exist.",
        required_fields: ["reviewer_name", "role_id", "decision_note", "evidence_note", "boundary_note"],
        requires_second_review: true,
        production_status: "proposal-only"
      },
      {
        id: "close",
        label: "Close ticket",
        meaning: "No active work remains, with a visible closure reason.",
        required_fields: ["reviewer_name", "role_id", "decision_note"],
        requires_second_review: false,
        production_status: "allowed-local-action"
      }
    ],
    audit_packet_fields: [
      "schema_version",
      "release",
      "decision_id",
      "queue_id",
      "ticket_id",
      "action_id",
      "role_id",
      "reviewer_name",
      "second_reviewer",
      "decision_note",
      "evidence_note",
      "boundary_note",
      "gate_status",
      "missing",
      "warnings",
      "created_at"
    ],
    production_rules: {
      two_reviewer_acceptance: true,
      immutable_audit_required: true,
      durable_identity_required: true,
      source_update_requires_ticket: true,
      accepted_local_decision_is_proposal: true
    },
    sample_decision: {
      queue_id: "queue-direct-source-candidate",
      ticket_id: "ticket-direct-source-candidate",
      action_id: "accept",
      role_id: "founder-review",
      reviewer_name: "Founder review",
      second_reviewer: "",
      decision_note: "Accept only as a proposal until the second reviewer and durable audit exist.",
      evidence_note: "Bhagavad Gita 2.48 is cited as the source candidate and the boundary is reflection support, not authority.",
      boundary_note: "Do not turn local review into final source truth."
    }
  };
  write("data/vedapath-review-identity-gate.json", `${JSON.stringify(data, null, 2)}\n`);
}

function writeIdentityCss() {
  write("assets/vedapath-review-identity-gate.css", `/* VedaPath reviewer identity gate */
.identity-app,
.identity-head,
.identity-layout,
.identity-roles,
.identity-form,
.identity-grid,
.identity-result,
.identity-rules,
.identity-audit,
.identity-actions {
  display: grid;
  gap: 10px;
}

.identity-app {
  gap: 16px;
}

.identity-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.identity-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.identity-mark img {
  display: block;
  width: 100%;
}

.identity-layout {
  grid-template-columns: minmax(220px, 0.76fr) minmax(0, 1.24fr);
  align-items: start;
}

.identity-roles {
  max-height: 680px;
  overflow: auto;
  padding-right: 3px;
}

.identity-role,
.identity-field,
.identity-result,
.identity-rule,
.identity-audit,
.identity-packet {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.identity-role,
.identity-field,
.identity-result,
.identity-rule,
.identity-audit {
  padding: 12px;
}

.identity-role {
  border-left: 4px solid var(--gold);
}

.identity-role.active {
  border-color: #f09f79;
  border-left-color: var(--bhagwa);
  background: #fff0e7;
}

.identity-role span,
.identity-role strong,
.identity-field span,
.identity-field strong,
.identity-rule span,
.identity-rule strong,
.identity-audit span,
.identity-audit strong {
  display: block;
}

.identity-role span,
.identity-field span,
.identity-rule span,
.identity-audit span {
  color: var(--muted);
  font-size: 12px;
}

.identity-role strong,
.identity-field strong,
.identity-rule strong,
.identity-audit strong {
  margin-top: 4px;
}

.identity-form {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(255, 253, 248, 0.82);
  padding: 12px;
}

.identity-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.identity-form input,
.identity-form select,
.identity-form textarea,
.identity-packet {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.identity-form textarea {
  min-height: 82px;
  margin-top: 0;
}

.identity-grid,
.identity-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.identity-grid .wide {
  grid-column: 1 / -1;
}

.identity-actions {
  grid-template-columns: repeat(3, minmax(0, max-content));
  align-items: center;
}

.identity-result {
  border-left: 4px solid var(--gold);
}

.identity-result[data-gate="Blocked"] {
  border-left-color: var(--ochre);
}

.identity-result[data-gate="Proposal only"] {
  border-left-color: var(--bhagwa);
}

.identity-result[data-gate="Allowed"] {
  border-left-color: var(--green);
}

.identity-packet {
  min-height: 220px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

@media (max-width: 980px) {
  .identity-head,
  .identity-layout,
  .identity-grid,
  .identity-rules {
    grid-template-columns: 1fr;
  }

  .identity-mark {
    max-width: 150px;
  }

  .identity-roles {
    max-height: none;
  }
}

@media (max-width: 680px) {
  .identity-actions,
  .identity-actions .button {
    width: 100%;
    grid-template-columns: 1fr;
  }
}
`);
}

function writeIdentityJs() {
  write("assets/vedapath-review-identity-gate.js", `const identityRoot = document.getElementById("reviewIdentityGate");

if (identityRoot) {
  initReviewIdentityGate().catch((error) => {
    identityRoot.innerHTML = '<article class="identity-result"><strong>Reviewer identity gate could not load.</strong></article>';
    console.error(error);
  });
}

function identitySafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function roleFor(config, roleId) {
  return (config.roles || []).find((role) => role.id === roleId);
}

function actionFor(config, actionId) {
  return (config.actions || []).find((action) => action.id === actionId);
}

function hasValue(value) {
  return String(value ?? "").trim().length > 0;
}

function validateGateDecision(config, decision) {
  const role = roleFor(config, decision.role_id);
  const action = actionFor(config, decision.action_id);
  const missing = [];
  const warnings = [];

  if (!role) missing.push("known reviewer role");
  if (!action) missing.push("known gate action");

  if (action) {
    for (const field of action.required_fields || []) {
      if (!hasValue(decision[field])) missing.push(field);
    }
  }

  const roleAuthority = role ? role.authority || [] : [];
  const allowedByRole = role && action && roleAuthority.includes(action.id);
  const recommendedByRole = role && action && action.id === "accept" && roleAuthority.includes("recommend-accept");

  if (role && action && !allowedByRole && !recommendedByRole) {
    missing.push("role authority for " + action.label);
  }

  const needsSecondReview = Boolean(action && action.requires_second_review);
  if (needsSecondReview && !hasValue(decision.second_reviewer)) {
    warnings.push("Second reviewer is required before production update.");
  }

  if (action && action.id === "accept" && config.production_rules?.accepted_local_decision_is_proposal) {
    warnings.push("Accepted local decision remains proposal-only until production storage and identity exist.");
  }

  if (role && Array.isArray(role.cannot) && role.cannot.includes("accept") && action && action.id === "accept") {
    missing.push("role cannot accept");
  }

  const baseAllowed = missing.length === 0;
  const productionReady = baseAllowed && (!needsSecondReview || hasValue(decision.second_reviewer)) && action?.production_status !== "proposal-only";
  const gate_status = !baseAllowed ? "Blocked" : productionReady ? "Allowed" : action?.id === "accept" || needsSecondReview ? "Proposal only" : "Allowed";

  return {
    passed: baseAllowed,
    production_ready: productionReady,
    gate_status,
    role: role ? role.label : "Unknown role",
    action: action ? action.label : "Unknown action",
    missing,
    warnings
  };
}

function buildAuditPacket(config, decision, gate) {
  return {
    schema_version: config.schema_version,
    release: config.release,
    decision_id: "identity-gate-" + Date.now(),
    queue_id: decision.queue_id || "manual-review",
    ticket_id: decision.ticket_id || "manual-ticket",
    action_id: decision.action_id,
    role_id: decision.role_id,
    reviewer_name: decision.reviewer_name,
    second_reviewer: decision.second_reviewer || "",
    decision_note: decision.decision_note || "",
    evidence_note: decision.evidence_note || "",
    boundary_note: decision.boundary_note || "",
    gate_status: gate.gate_status,
    production_ready: gate.production_ready,
    missing: gate.missing,
    warnings: gate.warnings,
    created_at: new Date().toISOString()
  };
}

async function gateLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readIdentityProfile(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (error) {
    return fallback;
  }
}

function writeIdentityProfile(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initReviewIdentityGate() {
  const config = await gateLoadJson("data/vedapath-review-identity-gate.json");
  const profile = readIdentityProfile(config.local_identity_store, {});

  const rolesEl = identityRoot.querySelector("#identityRoles");
  const roleSelect = identityRoot.querySelector("#gateRole");
  const actionSelect = identityRoot.querySelector("#gateAction");
  const reviewerInput = identityRoot.querySelector("#gateReviewer");
  const secondInput = identityRoot.querySelector("#gateSecondReviewer");
  const decisionInput = identityRoot.querySelector("#gateDecisionNote");
  const evidenceInput = identityRoot.querySelector("#gateEvidenceNote");
  const boundaryInput = identityRoot.querySelector("#gateBoundaryNote");
  const resultEl = identityRoot.querySelector("#gateResult");
  const packetEl = identityRoot.querySelector("#gatePacket");
  const rulesEl = identityRoot.querySelector("#gateRules");
  const validateButton = identityRoot.querySelector("#validateGate");
  const saveButton = identityRoot.querySelector("#saveGateProfile");
  const sampleButton = identityRoot.querySelector("#loadGateSample");
  const copyButton = identityRoot.querySelector("#copyGatePacket");

  roleSelect.innerHTML = (config.roles || []).map((role) => '<option value="' + identitySafe(role.id) + '">' + identitySafe(role.label) + '</option>').join("");
  actionSelect.innerHTML = (config.actions || []).map((action) => '<option value="' + identitySafe(action.id) + '">' + identitySafe(action.label) + '</option>').join("");

  roleSelect.value = profile.role_id || config.sample_decision.role_id;
  reviewerInput.value = profile.reviewer_name || config.sample_decision.reviewer_name;
  actionSelect.value = config.sample_decision.action_id;
  decisionInput.value = config.sample_decision.decision_note;
  evidenceInput.value = config.sample_decision.evidence_note;
  boundaryInput.value = config.sample_decision.boundary_note;

  function decisionFromForm() {
    return {
      ...config.sample_decision,
      role_id: roleSelect.value,
      action_id: actionSelect.value,
      reviewer_name: reviewerInput.value.trim(),
      second_reviewer: secondInput.value.trim(),
      decision_note: decisionInput.value.trim(),
      evidence_note: evidenceInput.value.trim(),
      boundary_note: boundaryInput.value.trim()
    };
  }

  function renderRoles() {
    rolesEl.innerHTML = (config.roles || []).map((role) => (
      '<article class="identity-role ' + (role.id === roleSelect.value ? 'active' : '') + '">' +
        '<span>' + identitySafe(role.id) + '</span>' +
        '<strong>' + identitySafe(role.label) + '</strong>' +
        '<p class="muted">' + identitySafe(role.purpose) + '</p>' +
        '<span>Authority: ' + identitySafe((role.authority || []).join(", ")) + '</span>' +
      '</article>'
    )).join("");
  }

  function renderRules() {
    rulesEl.innerHTML = [
      ["Two reviewer acceptance", config.production_rules.two_reviewer_acceptance ? "Required" : "Not required"],
      ["Durable identity", config.production_rules.durable_identity_required ? "Required" : "Not required"],
      ["Immutable audit", config.production_rules.immutable_audit_required ? "Required" : "Not required"],
      ["Accepted local decision", config.production_rules.accepted_local_decision_is_proposal ? "Proposal only" : "Production candidate"]
    ].map((row) => '<article class="identity-rule"><span>' + identitySafe(row[0]) + '</span><strong>' + identitySafe(row[1]) + '</strong></article>').join("");
  }

  function renderGate() {
    const decision = decisionFromForm();
    const gate = validateGateDecision(config, decision);
    const packet = buildAuditPacket(config, decision, gate);
    resultEl.dataset.gate = gate.gate_status;
    resultEl.innerHTML = [
      '<span class="badge ' + (gate.gate_status === "Allowed" ? 'green' : '') + '">' + identitySafe(gate.gate_status) + '</span>',
      '<h2>' + identitySafe(gate.action) + '</h2>',
      '<p class="muted">Role: ' + identitySafe(gate.role) + '</p>',
      '<div class="identity-grid">',
      '<div class="identity-field"><span>Missing</span><strong>' + identitySafe(gate.missing.length ? gate.missing.join(", ") : "None") + '</strong></div>',
      '<div class="identity-field"><span>Warnings</span><strong>' + identitySafe(gate.warnings.length ? gate.warnings.join(" | ") : "None") + '</strong></div>',
      '</div>'
    ].join("");
    packetEl.value = JSON.stringify(packet, null, 2);
    renderRoles();
  }

  roleSelect.addEventListener("change", renderGate);
  actionSelect.addEventListener("change", renderGate);
  [reviewerInput, secondInput, decisionInput, evidenceInput, boundaryInput].forEach((input) => {
    input.addEventListener("input", renderGate);
  });

  validateButton.addEventListener("click", renderGate);
  saveButton.addEventListener("click", () => {
    writeIdentityProfile(config.local_identity_store, {
      role_id: roleSelect.value,
      reviewer_name: reviewerInput.value.trim()
    });
    renderGate();
  });
  sampleButton.addEventListener("click", () => {
    const sample = config.sample_decision;
    roleSelect.value = sample.role_id;
    actionSelect.value = sample.action_id;
    reviewerInput.value = sample.reviewer_name;
    secondInput.value = sample.second_reviewer;
    decisionInput.value = sample.decision_note;
    evidenceInput.value = sample.evidence_note;
    boundaryInput.value = sample.boundary_note;
    renderGate();
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

  renderRules();
  renderGate();
}

if (typeof window !== "undefined") {
  window.vedapathReviewIdentityGate = {
    validateGateDecision,
    buildAuditPacket,
    roleFor,
    actionFor
  };
}
`);
}

function writeIdentityPage() {
  write("reviewidentitygate.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Reviewer Identity Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-review-identity-gate.css">
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
            <span>Reviewer identity</span>
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

      <main class="workspace" aria-label="VedaPath Reviewer Identity Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Review authority</span>
          <h2>Identity before approval</h2>
          <p class="muted">The queue stores review work. This gate asks whether a decision has the right role, evidence, boundary, and production caution.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Role</strong><p>Name who is reviewing.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Action</strong><p>Choose the decision type.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Evidence</strong><p>Keep the source visible.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Audit</strong><p>Copy a decision packet.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button safe" href="reviewqueuepersistence.html">Open Queue</a>
            <a class="button" href="data/vedapath-review-identity-gate.json">Open JSON</a>
          </div>
        </aside>

        <section class="panel identity-app" id="reviewIdentityGate">
          <div class="identity-head">
            <div>
              <span class="eyebrow">Reviewer identity gate</span>
              <h1>Approval needs a named boundary.</h1>
              <p class="muted">This prototype turns local queue decisions into audit-shaped packets. It allows some actions locally, but keeps accepted updates proposal-only until production identity and second review exist.</p>
            </div>
            <div class="identity-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath identity mark"></div>
          </div>

          <section class="identity-layout">
            <div>
              <h2>Reviewer Roles</h2>
              <div class="identity-roles" id="identityRoles"></div>
            </div>
            <div class="identity-form">
              <h2>Decision Gate</h2>
              <div class="identity-grid">
                <label>Reviewer name<input id="gateReviewer" type="text" placeholder="Founder review"></label>
                <label>Reviewer role<select id="gateRole"></select></label>
                <label>Action<select id="gateAction"></select></label>
                <label>Second reviewer<input id="gateSecondReviewer" type="text" placeholder="Required before production accept"></label>
                <label class="wide">Decision note<textarea id="gateDecisionNote"></textarea></label>
                <label class="wide">Evidence note<textarea id="gateEvidenceNote"></textarea></label>
                <label class="wide">Boundary note<textarea id="gateBoundaryNote"></textarea></label>
              </div>
              <div class="identity-actions">
                <button class="button primary" id="validateGate" type="button">Validate Gate</button>
                <button class="button safe" id="saveGateProfile" type="button">Save Identity</button>
                <button class="button" id="loadGateSample" type="button">Load Sample</button>
              </div>
              <section class="identity-result" id="gateResult" data-gate="Blocked"></section>
              <div class="identity-actions">
                <button class="button safe" id="copyGatePacket" type="button">Copy Audit Packet</button>
              </div>
              <textarea class="identity-packet" id="gatePacket" aria-label="Identity gate audit packet"></textarea>
            </div>
          </section>

          <section>
            <h2>Production Rules</h2>
            <div class="identity-rules" id="gateRules"></div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Governance phase</span>
          <h2 style="margin-top: 14px;">Audit Boundary</h2>
          <p class="muted">Local identity is useful for product learning, but it is not authentication. Production must know who acted, what they saw, and why the decision changed state.</p>
          <div class="progress" aria-label="Reviewer identity gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Roles</span><strong>6</strong></div>
            <div class="metric"><span>Actions</span><strong>5</strong></div>
            <div class="metric"><span>Accept</span><strong>2-step</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Production Rule</h2>
            <p class="muted">No accepted local review should rewrite a source record until it has durable identity, second review when needed, and immutable audit history.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-review-identity-gate.js"></script>
  </body>
</html>
`);
}

function updateReviewQueuePage() {
  let content = updateVersionBadge(read("reviewqueuepersistence.html"));
  if (!content.includes('href="reviewidentitygate.html">Open Identity Gate')) {
    content = content.replace(
      '<a class="button safe" href="reviewticketbridge.html">Open Ticket Bridge</a>',
      '<a class="button safe" href="reviewticketbridge.html">Open Ticket Bridge</a>\n            <a class="button" href="reviewidentitygate.html">Open Identity Gate</a>'
    );
  }
  content = content.replace('<div class="metric"><span>Next</span><strong>Audit</strong></div>', '<div class="metric"><span>Gate</span><strong>Identity</strong></div>');
  write("reviewqueuepersistence.html", content);
}

function updateIndex() {
  let content = pointReviewNavToQueue(updateVersionBadge(read("index.html")));
  if (!content.includes('href="reviewidentitygate.html">Identity gate')) {
    content = content.replace(
      '<a href="reviewqueuepersistence.html">Review queue <span>history</span></a>',
      '<a href="reviewqueuepersistence.html">Review queue <span>history</span></a>\n              <a href="reviewidentitygate.html">Identity gate <span>audit</span></a>'
    );
  }
  if (!content.includes('href="reviewidentitygate.html">Identity <span>gate</span></a>')) {
    content = content.replace(
      '<a href="reviewqueuepersistence.html">Queue <span>audit</span></a>',
      '<a href="reviewqueuepersistence.html">Queue <span>audit</span></a>\n              <a href="reviewidentitygate.html">Identity <span>gate</span></a>'
    );
  }
  write("index.html", content);
}

function updateBuildStatus() {
  let content = pointReviewNavToQueue(updateVersionBadge(read("build-status.html")));
  content = content
    .replace(/<span>Current version<\/span>\s*<strong>[^<]+<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Current version</span>
          <strong>${release}</strong>
          <p>Reviewer Identity Gate: roles, action authority, second-review rules, and copyable audit packets now sit beside the review queue.</p>`)
    .replace(/<span>Full vision progress<\/span>\s*<strong>[^<]+<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:[^"]+"><\/div><\/div>\s*<p>[\s\S]*?<\/p>/, `<span>Full vision progress</span>
          <strong>75%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:75%"></div></div>
          <p>The trust loop now has queue persistence plus reviewer identity and audit gates.</p>`)
    .replace(/<span>Next release<\/span>\s*<strong>[\s\S]*?<\/strong>\s*<p>[\s\S]*?<\/p>/, `<span>Next release</span>
          <strong>Source update proposal bridge</strong>
          <p>Connect accepted review packets to draft source-record updates without publishing automatically.</p>`);

  const phaseBlock = `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 260: Reviewer Identity and Audit Gate</strong>
                <p>Adds reviewer roles, action authority, second-review requirements, and copyable audit packets for queue decisions.</p>
              </div>
              <span class="percent">100%</span>
            </article>`;
  if (!content.includes("Phase 260: Reviewer Identity and Audit Gate")) {
    content = content.replace(
      /            <article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 260: Production Implementation and Licensed Audio<\/strong>\s*<p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
      `            ${phaseBlock}
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 261: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
    );
  }

  content = content
    .replace(/<div class="version-row"><span>Release<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Release</span><strong>${release} Reviewer Identity and Audit Gate</strong></div>`)
    .replace(/<div class="version-row"><span>Previous<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Previous</span><strong>v2.9.5 Reviewer Queue Persistence</strong></div>`)
    .replace(/<div class="version-row"><span>Goal<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Goal</span><strong>Define who can approve review work and what evidence is required.</strong></div>`)
    .replace(/<div class="version-row"><span>Status<\/span><strong>[^<]+<\/strong><\/div>/, `<div class="version-row"><span>Status</span><strong>Ready for source update proposal bridge</strong></div>`)
    .replace(/<li><span class="dot"><\/span><span>Add reviewer identity and role boundaries\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Define immutable production audit requirements\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Require two-step approval for accepted source updates\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep queue records separate from answer rendering\.<\/span><\/li>/, `<li><span class="dot"></span><span>Turn accepted audit packets into draft source updates.</span></li>
              <li><span class="dot"></span><span>Require source diff preview before save.</span></li>
              <li><span class="dot"></span><span>Keep source proposals separate from canonical records.</span></li>
              <li><span class="dot"></span><span>Preserve the simple review queue as the entry point.</span></li>`);

  write("build-status.html", content);
}

function updateDocs() {
  let readme = read("README.md");
  readme = upsertBlock(readme, "<!-- VEDAPATH REVIEW IDENTITY GATE START -->", "<!-- VEDAPATH REVIEW IDENTITY GATE END -->", `## ${release} Reviewer Identity and Audit Gate

This release adds a governance layer beside the review queue.

- adds \`data/vedapath-review-identity-gate.json\`
- adds \`reviewidentitygate.html\`
- defines reviewer roles and action authority
- validates required decision, evidence, and boundary fields
- keeps accepted local decisions proposal-only until production identity, second review, durable storage, and immutable audit history exist
- exports copyable audit packets for future source-update proposals`, "<!-- VEDAPATH REVIEW QUEUE PERSISTENCE START -->");
  write("README.md", readme);

  let notes = read("docs/PROTOTYPE_NOTES.md");
  notes = upsertBlock(notes, "<!-- VEDAPATH REVIEW IDENTITY GATE NOTES START -->", "<!-- VEDAPATH REVIEW IDENTITY GATE NOTES END -->", `## ${release} Reviewer Identity and Audit Gate

This phase makes review decisions more accountable without adding production authentication yet.

Action taken:

- Added reviewer role and authority schema.
- Added a focused identity gate room.
- Added a browser validator for claim, block, recommend, accept, and close decisions.
- Added copyable audit packets.
- Preserved Review navigation on the queue so the main workflow stays simple.`, "<!-- VEDAPATH REVIEW QUEUE PERSISTENCE NOTES START -->");
  write("docs/PROTOTYPE_NOTES.md", notes);

  let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
  blueprint = upsertBlock(blueprint, "<!-- VEDAPATH REVIEW IDENTITY GATE BLUEPRINT START -->", "<!-- VEDAPATH REVIEW IDENTITY GATE BLUEPRINT END -->", `### 279. Reviewer Identity and Audit Gate

VedaPath should never treat review as anonymous authority.

Rules:

- Every review action needs a role and named reviewer.
- Accepting a local review decision remains proposal-only.
- Production source updates need durable identity, permission, audit history, and second review where required.
- Specialist reviewers can recommend; founder review can decide product readiness.
- The next build should convert accepted audit packets into draft source update proposals, not automatic changes.`, "<!-- VEDAPATH REVIEW QUEUE PERSISTENCE BLUEPRINT START -->");
  write("docs/PRODUCT_BLUEPRINT.md", blueprint);

  write("docs/REVIEW_IDENTITY_GATE.md", `# VedaPath AI Reviewer Identity and Audit Gate

Release: ${release}

This release adds a governance layer beside the browser-local review queue.

## Files

- \`data/vedapath-review-identity-gate.json\`
- \`reviewidentitygate.html\`
- \`assets/vedapath-review-identity-gate.css\`
- \`assets/vedapath-review-identity-gate.js\`

## What It Adds

The identity gate defines:

- reviewer roles
- action authority
- required evidence fields
- second-review requirements
- production boundaries
- copyable audit packets

## Boundary

This is not authentication. It is a product contract for how review should behave before production accounts, permissions, durable storage, and immutable audit logs are added.
`);
}

writeIdentityData();
writeIdentityCss();
writeIdentityJs();
writeIdentityPage();
updateAllHtmlShells();
activateQueueNav();
activateIdentityNav();
updateReviewQueuePage();
updateIndex();
updateBuildStatus();
updateDocs();

console.log(`${release} reviewer identity gate applied.`);

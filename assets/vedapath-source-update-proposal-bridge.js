const proposalRoot = document.getElementById("sourceUpdateProposalBridge");

if (proposalRoot) {
  initSourceUpdateProposalBridge().catch((error) => {
    proposalRoot.innerHTML = '<article class="proposal-result"><strong>Source update proposal bridge could not load.</strong></article>';
    console.error(error);
  });
}

function proposalSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseProposalJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function findSourceRecord(sourceRecords, id) {
  return (sourceRecords || []).find((record) => record.id === id);
}

function buildSourceProposal(config, sourceRecords, auditPacket, sourceAnswerId, proposedUpdates, blockedAttempt = {}) {
  const record = findSourceRecord(sourceRecords, sourceAnswerId);
  const missing = [];
  const warnings = [];
  const allowedActions = config.allowed_packet_actions || [];

  if (!record) missing.push("known source answer record");
  if (!auditPacket || typeof auditPacket !== "object") missing.push("audit packet");
  if (auditPacket && !allowedActions.includes(auditPacket.action_id)) {
    missing.push("accepted or recommended audit action");
  }
  if (auditPacket && auditPacket.missing && auditPacket.missing.length) {
    missing.push("clear identity gate missing fields");
  }
  if (auditPacket && !auditPacket.second_reviewer && auditPacket.action_id === "accept") {
    warnings.push("Second reviewer should be present before source-owner review.");
  }

  const editable = new Set(config.editable_fields || []);
  const blocked = new Set(config.blocked_fields || []);
  const diffs = [];
  const blocked_fields = [];

  for (const [field, next] of Object.entries(proposedUpdates || {})) {
    if (!editable.has(field)) {
      blocked_fields.push({ field, attempted_value: next, reason: "Field is not editable in this proposal bridge." });
      continue;
    }
    const current = record ? record[field] : undefined;
    if (current !== next) {
      diffs.push({ field, current_value: current ?? "", proposed_value: next });
    }
  }

  for (const [field, next] of Object.entries(blockedAttempt || {})) {
    if (blocked.has(field) || !editable.has(field)) {
      blocked_fields.push({ field, attempted_value: next, reason: "Canonical or rights-sensitive field requires a separate source-owner process." });
    }
  }

  if (!diffs.length) missing.push("at least one editable field change");
  warnings.push(config.proposal_policy);

  const status = missing.length ? "Blocked" : "Draft proposal only";
  return {
    schema_version: config.schema_version,
    release: config.release,
    proposal_id: "source-proposal-" + Date.now(),
    status,
    source_answer_id: sourceAnswerId,
    source_record_id: record ? record.source_record_id : "",
    source: record ? record.source : "",
    source_family: record ? record.source_family : "",
    audit_packet: auditPacket,
    diffs,
    blocked_fields,
    missing,
    warnings,
    production_requirements: config.production_requirements || [],
    created_at: new Date().toISOString()
  };
}

function proposalSnapshot(proposals, config) {
  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: proposals.length,
    proposals
  };
}

async function proposalLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readProposalStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeProposalStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initSourceUpdateProposalBridge() {
  const [config, sourceData, identityData] = await Promise.all([
    proposalLoadJson("data/vedapath-source-update-proposal-bridge.json"),
    proposalLoadJson("data/vedapath-source-answer-foundation.json"),
    proposalLoadJson("data/vedapath-review-identity-gate.json")
  ]);

  const sourceRecords = sourceData.records || [];
  const proposalStore = config.local_proposal_store;
  let proposals = readProposalStore(proposalStore);

  const recordSelect = proposalRoot.querySelector("#proposalRecord");
  const auditInput = proposalRoot.querySelector("#proposalAuditPacket");
  const updatesInput = proposalRoot.querySelector("#proposalUpdates");
  const blockedInput = proposalRoot.querySelector("#proposalBlockedAttempt");
  const resultEl = proposalRoot.querySelector("#proposalResult");
  const sourceEl = proposalRoot.querySelector("#proposalSource");
  const diffsEl = proposalRoot.querySelector("#proposalDiffs");
  const packetEl = proposalRoot.querySelector("#proposalPacket");
  const rulesEl = proposalRoot.querySelector("#proposalRules");
  const savedEl = proposalRoot.querySelector("#proposalSaved");
  const buildButton = proposalRoot.querySelector("#buildProposal");
  const sampleButton = proposalRoot.querySelector("#loadProposalSample");
  const saveButton = proposalRoot.querySelector("#saveProposal");
  const copyButton = proposalRoot.querySelector("#copyProposalPacket");
  const clearButton = proposalRoot.querySelector("#clearProposalStore");

  let activeProposal = null;

  recordSelect.innerHTML = sourceRecords.map((record) => '<option value="' + proposalSafe(record.id) + '">' + proposalSafe(record.source + " | " + record.question) + '</option>').join("");

  function loadSample() {
    recordSelect.value = config.sample_proposal.source_answer_id;
    auditInput.value = JSON.stringify(config.sample_audit_packet || identityData.sample_decision || {}, null, 2);
    updatesInput.value = JSON.stringify(config.sample_proposal.proposed_updates, null, 2);
    blockedInput.value = JSON.stringify(config.sample_proposal.blocked_update_attempt, null, 2);
  }

  function currentRecord() {
    return findSourceRecord(sourceRecords, recordSelect.value);
  }

  function renderSource() {
    const record = currentRecord();
    if (!record) return;
    sourceEl.innerHTML = [
      ["Answer ID", record.id],
      ["Source", record.source],
      ["Family", record.source_family],
      ["Current review state", record.review_state],
      ["Current readiness", record.readiness],
      ["Boundary", record.boundary]
    ].map((row) => '<article class="proposal-source-card"><span>' + proposalSafe(row[0]) + '</span><strong>' + proposalSafe(row[1]) + '</strong></article>').join("");
  }

  function renderRules() {
    rulesEl.innerHTML = [
      ["Editable fields", (config.editable_fields || []).join(", ")],
      ["Blocked fields", (config.blocked_fields || []).join(", ")],
      ["Allowed packets", (config.allowed_packet_actions || []).join(", ")],
      ["Local store", proposalStore]
    ].map((row) => '<article class="proposal-rule"><span>' + proposalSafe(row[0]) + '</span><strong>' + proposalSafe(row[1]) + '</strong></article>').join("");
  }

  function renderSaved() {
    savedEl.innerHTML = proposals.slice(0, 8).map((proposal) => (
      '<article class="proposal-source-card">' +
        '<span>' + proposalSafe(proposal.created_at) + '</span>' +
        '<strong>' + proposalSafe(proposal.source || proposal.source_answer_id) + '</strong>' +
        '<span>' + proposalSafe(proposal.status + " | " + proposal.diffs.length + " proposed changes") + '</span>' +
      '</article>'
    )).join("") || '<article class="proposal-source-card"><strong>No saved proposals yet</strong><span>Build and save one draft proposal to begin.</span></article>';
  }

  function renderProposal(proposal) {
    activeProposal = proposal;
    resultEl.dataset.status = proposal.status;
    resultEl.innerHTML = [
      '<span class="badge ' + (proposal.status === "Blocked" ? '' : 'green') + '">' + proposalSafe(proposal.status) + '</span>',
      '<h2>Source update proposal</h2>',
      '<p class="muted">' + proposalSafe(proposal.source || "No source record") + '</p>',
      '<div class="proposal-grid">',
      '<article class="proposal-source-card"><span>Missing</span><strong>' + proposalSafe(proposal.missing.length ? proposal.missing.join(", ") : "None") + '</strong></article>',
      '<article class="proposal-source-card"><span>Blocked fields</span><strong>' + proposalSafe(proposal.blocked_fields.length) + '</strong></article>',
      '</div>'
    ].join("");
    diffsEl.innerHTML = [
      ...proposal.diffs.map((diff) => (
        '<article class="proposal-diff">' +
          '<div><span>Editable field</span><strong>' + proposalSafe(diff.field) + '</strong></div>' +
          '<div><span>Current</span><strong>' + proposalSafe(diff.current_value) + '</strong><span>Proposed</span><strong>' + proposalSafe(diff.proposed_value) + '</strong></div>' +
        '</article>'
      )),
      ...proposal.blocked_fields.map((field) => (
        '<article class="proposal-diff blocked">' +
          '<div><span>Blocked field</span><strong>' + proposalSafe(field.field) + '</strong></div>' +
          '<div><span>Attempted</span><strong>' + proposalSafe(field.attempted_value) + '</strong><span>Reason</span><strong>' + proposalSafe(field.reason) + '</strong></div>' +
        '</article>'
      ))
    ].join("");
    packetEl.value = JSON.stringify(proposal, null, 2);
  }

  function buildFromInputs() {
    const auditPacket = parseProposalJson(auditInput.value, {});
    const updates = parseProposalJson(updatesInput.value, {});
    const blockedAttempt = parseProposalJson(blockedInput.value, {});
    const proposal = buildSourceProposal(config, sourceRecords, auditPacket, recordSelect.value, updates, blockedAttempt);
    renderProposal(proposal);
  }

  recordSelect.addEventListener("change", () => {
    renderSource();
    buildFromInputs();
  });
  buildButton.addEventListener("click", buildFromInputs);
  sampleButton.addEventListener("click", () => {
    loadSample();
    renderSource();
    buildFromInputs();
  });
  saveButton.addEventListener("click", () => {
    if (!activeProposal) buildFromInputs();
    proposals = [activeProposal, ...proposals].slice(0, 24);
    writeProposalStore(proposalStore, proposals);
    renderSaved();
  });
  clearButton.addEventListener("click", () => {
    proposals = [];
    writeProposalStore(proposalStore, proposals);
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
  renderSource();
  renderRules();
  renderSaved();
  buildFromInputs();
}

if (typeof window !== "undefined") {
  window.vedapathSourceUpdateProposalBridge = {
    buildSourceProposal,
    proposalSnapshot,
    findSourceRecord,
    parseProposalJson
  };
}

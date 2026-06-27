const ownerRoot = document.getElementById("sourceOwnerApprovalLane");

if (ownerRoot) {
  initSourceOwnerApprovalLane().catch((error) => {
    ownerRoot.innerHTML = '<article class="owner-result"><strong>Source owner approval lane could not load.</strong></article>';
    console.error(error);
  });
}

function ownerSafe(value) {
  return String(value ?? "").replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[char]);
}

function parseOwnerJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function sourceOwnerMissingForState(config, decision) {
  const required = config.required_by_state?.[decision.decision_state] || [];
  return required.filter((field) => !String(decision[field] ?? "").trim());
}

function ownerBlockedFields(reviewPacket) {
  const proposal = reviewPacket?.proposal;
  if (proposal && Array.isArray(proposal.blocked_fields)) return proposal.blocked_fields;
  if (Number(reviewPacket?.blocked_field_count || 0) > 0) {
    return [{ field: "blocked fields", reason: "Review packet reports blocked fields." }];
  }
  return [];
}

function dispositionExcludesBlocked(value) {
  return /(exclude|out of scope|do not edit|unchanged|not edit)/i.test(String(value || ""));
}

function sourceOwnerApprove(config, reviewPacket, ownerDecision) {
  const missing = sourceOwnerMissingForState(config, ownerDecision);
  const warnings = [];
  const blocked = [];
  const blockedFields = ownerBlockedFields(reviewPacket);
  const isApproval = ownerDecision.decision_state === "Owner approved for implementation queue";
  const packetStatus = reviewPacket?.local_status || reviewPacket?.decision_state || "";
  const readyForOwner = packetStatus === "Ready for source owner";

  if (!reviewPacket || typeof reviewPacket !== "object") missing.push("review packet");

  if (isApproval && !readyForOwner) {
    blocked.push("review packet is not ready for source owner");
  }

  if (isApproval && blockedFields.length) {
    if (!dispositionExcludesBlocked(ownerDecision.blocked_field_disposition)) {
      blocked.push("blocked field disposition must exclude canonical edits");
    }
    warnings.push("Blocked fields remain outside owner approval scope.");
  }

  if (reviewPacket?.production_ready === true) {
    warnings.push("Owner lane treats production readiness as false until implementation storage exists.");
  }

  const canAdvance = missing.length === 0 && blocked.length === 0;
  const owner_status = !canAdvance ? "Blocked" : ownerDecision.decision_state;

  return {
    schema_version: config.schema_version,
    release: config.release,
    owner_decision_id: "source-owner-decision-" + Date.now(),
    owner_status,
    production_ready: false,
    implementation_queue_ready: owner_status === "Owner approved for implementation queue",
    proposal_id: reviewPacket?.proposal_id || reviewPacket?.proposal?.proposal_id || "",
    source_answer_id: reviewPacket?.source_answer_id || reviewPacket?.proposal?.source_answer_id || "",
    source_record_id: reviewPacket?.source_record_id || reviewPacket?.proposal?.source_record_id || "",
    source_family: reviewPacket?.source_family || reviewPacket?.proposal?.source_family || "",
    source_owner: ownerDecision.owner_name || "",
    decision_state: ownerDecision.decision_state,
    owner_note: ownerDecision.owner_note || "",
    approval_scope: ownerDecision.approval_scope || "",
    blocked_field_disposition: ownerDecision.blocked_field_disposition || "",
    return_reason: ownerDecision.return_reason || "",
    rejection_reason: ownerDecision.rejection_reason || "",
    rollback_instruction: ownerDecision.rollback_instruction || "",
    implementation_guard: ownerDecision.implementation_guard || "",
    missing,
    blocked,
    warnings: [
      ...warnings,
      config.approval_policy
    ],
    review_packet_status: packetStatus || "Unknown",
    reviewed_diff_count: Number(reviewPacket?.reviewed_diff_count || reviewPacket?.proposal?.diffs?.length || 0),
    blocked_field_count: blockedFields.length,
    created_at: new Date().toISOString()
  };
}

function sourceOwnerSnapshot(decisions, config) {
  const byStatus = decisions.reduce((counts, decision) => {
    const key = decision.owner_status || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});

  return {
    schema_version: config.schema_version,
    release: config.release,
    exported_at: new Date().toISOString(),
    count: decisions.length,
    blocked: byStatus.Blocked || 0,
    returned: byStatus["Return to reviewer"] || 0,
    rejected: byStatus["Owner rejected"] || 0,
    approved_for_implementation_queue: byStatus["Owner approved for implementation queue"] || 0,
    decisions
  };
}

async function ownerLoadJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to load " + url);
  return response.json();
}

function readOwnerStore(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch (error) {
    return [];
  }
}

function writeOwnerStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value, null, 2));
}

async function initSourceOwnerApprovalLane() {
  const config = await ownerLoadJson("data/vedapath-source-owner-approval-lane.json");
  const storeKey = config.local_owner_store;
  let decisions = readOwnerStore(storeKey);
  let activeDecision = null;

  const packetInput = ownerRoot.querySelector("#ownerReviewPacket");
  const decisionSelect = ownerRoot.querySelector("#ownerDecisionState");
  const ownerInput = ownerRoot.querySelector("#ownerName");
  const noteInput = ownerRoot.querySelector("#ownerNote");
  const scopeInput = ownerRoot.querySelector("#ownerScope");
  const dispositionInput = ownerRoot.querySelector("#ownerBlockedDisposition");
  const returnInput = ownerRoot.querySelector("#ownerReturnReason");
  const rejectionInput = ownerRoot.querySelector("#ownerRejectionReason");
  const rollbackInput = ownerRoot.querySelector("#ownerRollback");
  const guardInput = ownerRoot.querySelector("#ownerGuard");
  const resultEl = ownerRoot.querySelector("#ownerResult");
  const packetEl = ownerRoot.querySelector("#ownerPacket");
  const scopeList = ownerRoot.querySelector("#ownerScopeList");
  const rulesEl = ownerRoot.querySelector("#ownerRules");
  const savedEl = ownerRoot.querySelector("#ownerSaved");
  const reviewButton = ownerRoot.querySelector("#reviewOwnerLane");
  const sampleButton = ownerRoot.querySelector("#loadOwnerSample");
  const saveButton = ownerRoot.querySelector("#saveOwnerDecision");
  const clearButton = ownerRoot.querySelector("#clearOwnerDecisions");
  const copyButton = ownerRoot.querySelector("#copyOwnerPacket");

  decisionSelect.innerHTML = (config.decision_states || []).map((state) => '<option value="' + ownerSafe(state) + '">' + ownerSafe(state) + '</option>').join("");

  function loadSample() {
    packetInput.value = JSON.stringify(config.sample_review_packet, null, 2);
    decisionSelect.value = config.sample_owner_decision.decision_state;
    ownerInput.value = config.sample_owner_decision.owner_name;
    noteInput.value = config.sample_owner_decision.owner_note;
    scopeInput.value = config.sample_owner_decision.approval_scope;
    dispositionInput.value = config.sample_owner_decision.blocked_field_disposition;
    returnInput.value = config.sample_owner_decision.return_reason;
    rejectionInput.value = config.sample_owner_decision.rejection_reason;
    rollbackInput.value = config.sample_owner_decision.rollback_instruction;
    guardInput.value = config.sample_owner_decision.implementation_guard;
  }

  function decisionFromForm() {
    return {
      decision_state: decisionSelect.value,
      owner_name: ownerInput.value.trim(),
      owner_note: noteInput.value.trim(),
      approval_scope: scopeInput.value.trim(),
      blocked_field_disposition: dispositionInput.value.trim(),
      return_reason: returnInput.value.trim(),
      rejection_reason: rejectionInput.value.trim(),
      rollback_instruction: rollbackInput.value.trim(),
      implementation_guard: guardInput.value.trim()
    };
  }

  function renderScope(reviewPacket) {
    const diffs = reviewPacket?.proposal?.diffs || [];
    const blocked = ownerBlockedFields(reviewPacket);
    scopeList.innerHTML = [
      ...diffs.map((diff) => (
        '<article class="owner-card ready">' +
          '<span>Reviewable field</span><strong>' + ownerSafe(diff.field) + '</strong>' +
          '<span>Proposed</span><strong>' + ownerSafe(diff.proposed_value) + '</strong>' +
        '</article>'
      )),
      ...blocked.map((field) => (
        '<article class="owner-card blocked">' +
          '<span>Out of scope</span><strong>' + ownerSafe(field.field) + '</strong>' +
          '<span>Reason</span><strong>' + ownerSafe(field.reason) + '</strong>' +
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
    ].map((row) => '<article class="owner-rule"><span>' + ownerSafe(row[0]) + '</span><strong>' + ownerSafe(row[1]) + '</strong></article>').join("");
  }

  function renderSaved() {
    savedEl.innerHTML = decisions.slice(0, 8).map((decision) => (
      '<article class="owner-card">' +
        '<span>' + ownerSafe(decision.created_at) + '</span>' +
        '<strong>' + ownerSafe(decision.owner_status) + '</strong>' +
        '<span>' + ownerSafe((decision.source_answer_id || "proposal") + " | " + decision.source_owner) + '</span>' +
      '</article>'
    )).join("") || '<article class="owner-card"><strong>No owner decisions yet</strong><span>Review and save one owner packet to begin.</span></article>';
  }

  function renderDecision() {
    const reviewPacket = parseOwnerJson(packetInput.value, {});
    const ownerDecision = decisionFromForm();
    const result = sourceOwnerApprove(config, reviewPacket, ownerDecision);
    activeDecision = result;
    resultEl.dataset.state = result.owner_status;
    resultEl.innerHTML = [
      '<span class="badge ' + (result.owner_status === "Owner approved for implementation queue" ? 'green' : '') + '">' + ownerSafe(result.owner_status) + '</span>',
      '<h2>Owner decision packet</h2>',
      '<p class="muted">' + ownerSafe(result.source_answer_id || "No source answer") + '</p>',
      '<div class="owner-grid">',
      '<article class="owner-card"><span>Missing</span><strong>' + ownerSafe(result.missing.length ? result.missing.join(", ") : "None") + '</strong></article>',
      '<article class="owner-card"><span>Blocked</span><strong>' + ownerSafe(result.blocked.length ? result.blocked.join(", ") : "None") + '</strong></article>',
      '<article class="owner-card"><span>Implementation queue</span><strong>' + ownerSafe(result.implementation_queue_ready ? "Ready" : "No") + '</strong></article>',
      '<article class="owner-card"><span>Production ready</span><strong>False</strong></article>',
      '</div>'
    ].join("");
    packetEl.value = JSON.stringify(result, null, 2);
    renderScope(reviewPacket);
  }

  [packetInput, decisionSelect, ownerInput, noteInput, scopeInput, dispositionInput, returnInput, rejectionInput, rollbackInput, guardInput].forEach((el) => {
    el.addEventListener("input", renderDecision);
    el.addEventListener("change", renderDecision);
  });

  reviewButton.addEventListener("click", renderDecision);
  sampleButton.addEventListener("click", () => {
    loadSample();
    renderDecision();
  });
  saveButton.addEventListener("click", () => {
    if (!activeDecision) renderDecision();
    decisions = [activeDecision, ...decisions].slice(0, 24);
    writeOwnerStore(storeKey, decisions);
    renderSaved();
  });
  clearButton.addEventListener("click", () => {
    decisions = [];
    writeOwnerStore(storeKey, decisions);
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
  renderDecision();
}

if (typeof window !== "undefined") {
  window.vedapathSourceOwnerApprovalLane = {
    sourceOwnerApprove,
    sourceOwnerSnapshot,
    sourceOwnerMissingForState,
    ownerBlockedFields,
    parseOwnerJson
  };
}

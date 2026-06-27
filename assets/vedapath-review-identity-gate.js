const identityRoot = document.getElementById("reviewIdentityGate");

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

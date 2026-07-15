const REQUIRED_BOOLEAN_EVIDENCE = [
  "privateAccessConfirmed",
  "dataResidencyDocumented",
  "redactedLoggingConfirmed",
  "managedSecretsAvailable",
  "reviewerIdentityReady",
  "durableQueueReady",
  "privacyReviewComplete",
  "rightsReviewComplete",
  "recoveryPlanTested"
];

const SAFE_DECISIONS = new Set(["pending", "approve-private-implementation", "reject"]);

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function evaluateInfrastructureAuthorization(input = {}) {
  const blockers = [];
  const provider = cleanText(input.provider);
  const region = cleanText(input.region);
  const shutdownOwner = cleanText(input.shutdownOwner);
  const incidentOwner = cleanText(input.incidentOwner);
  const decision = cleanText(input.founderDecision) || "pending";
  const monthlyBudgetCapUsd = Number(input.monthlyBudgetCapUsd);

  if (!provider) blockers.push("provider-required");
  if (!region) blockers.push("region-required");
  if (!shutdownOwner) blockers.push("shutdown-owner-required");
  if (!incidentOwner) blockers.push("incident-owner-required");
  if (!Number.isFinite(monthlyBudgetCapUsd) || monthlyBudgetCapUsd <= 0) blockers.push("positive-budget-cap-required");
  if (Number.isFinite(monthlyBudgetCapUsd) && monthlyBudgetCapUsd > 500) blockers.push("budget-cap-exceeds-private-pilot-limit");
  if (!SAFE_DECISIONS.has(decision)) blockers.push("unsupported-founder-decision");

  for (const key of REQUIRED_BOOLEAN_EVIDENCE) {
    if (input[key] !== true) blockers.push(`${key}-required`);
  }

  if (input.publicAccess === true) blockers.push("public-access-forbidden");
  if (Number(input.invitationsIssued || 0) !== 0) blockers.push("invitations-must-remain-zero");
  if (Array.isArray(input.writeRoutes) && input.writeRoutes.length > 0) blockers.push("write-routes-forbidden");

  const evidenceComplete = blockers.length === 0;
  const privatelyAuthorized = evidenceComplete && decision === "approve-private-implementation";
  const status = decision === "reject"
    ? "rejected"
    : privatelyAuthorized
      ? "authorized-for-private-implementation"
      : evidenceComplete
        ? "ready-for-founder-decision"
        : "blocked-incomplete-evidence";

  return {
    schema: "vedapath.infrastructure-authorization.v1",
    status,
    evidenceComplete,
    privatelyAuthorized,
    provider: provider || "unselected",
    region: region || "unselected",
    monthlyBudgetCapUsd: Number.isFinite(monthlyBudgetCapUsd) ? monthlyBudgetCapUsd : null,
    shutdownOwner: shutdownOwner || "unassigned",
    incidentOwner: incidentOwner || "unassigned",
    blockers,
    deploymentActivated: false,
    invitationsIssued: 0,
    externalParticipants: 0,
    publicLaunch: "blocked"
  };
}

export function authorizationSummary(result) {
  if (!result || result.schema !== "vedapath.infrastructure-authorization.v1") {
    throw new TypeError("A VedaPath infrastructure authorization result is required.");
  }

  return {
    status: result.status,
    provider: result.provider,
    region: result.region,
    budgetCap: result.monthlyBudgetCapUsd,
    blockers: [...result.blockers],
    deploymentActivated: false,
    invitationsIssued: 0,
    publicLaunch: "blocked"
  };
}

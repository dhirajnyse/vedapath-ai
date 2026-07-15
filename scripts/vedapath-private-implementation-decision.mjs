const REQUIRED_CHECKS = [
  "readiness",
  "provider",
  "region",
  "budget",
  "shutdownOwner",
  "incidentOwner",
  "manifest",
  "privateMode",
  "founderDecision"
];

function safeLabel(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9 .:_-]{2,79}$/i.test(value);
}

export function evaluatePrivateImplementationDecision(input = {}) {
  const checks = {
    readiness: input.readinessStatus === "ready-for-private-implementation-not-activation",
    provider: safeLabel(input.providerCandidate),
    region: safeLabel(input.region),
    budget: Number(input.monthlyBudgetCapUsd) > 0 && Number(input.monthlyBudgetCapUsd) <= 500,
    shutdownOwner: safeLabel(input.shutdownOwner),
    incidentOwner: safeLabel(input.incidentOwner),
    manifest: input.manifestStatus === "valid-dry-run",
    privateMode: input.environmentMode === "private-dry-run",
    founderDecision: input.founderDecision === "authorize-bounded-implementation"
  };
  const blockers = REQUIRED_CHECKS.filter((name) => !checks[name]);

  if (input.publicAccess === true) blockers.push("public-access-forbidden");
  if (Number(input.invitationsIssued || 0) !== 0) blockers.push("invitations-must-remain-zero");
  if (Array.isArray(input.writeRoutes) && input.writeRoutes.length) blockers.push("write-routes-forbidden");

  const rejected = input.founderDecision === "reject-private-implementation";
  const implementationAuthorized = !rejected && blockers.length === 0;
  return {
    schema: "vedapath.private-implementation-decision.v1",
    status: rejected
      ? "rejected"
      : implementationAuthorized
        ? "implementation-authorized-deployment-closed"
        : "pending-or-blocked",
    checks,
    blockers,
    implementationAuthorized,
    deploymentActivated: false,
    providerAccountCreated: false,
    credentialsProvisioned: false,
    writeRoutesEnabled: false,
    invitationsIssued: 0,
    externalParticipants: 0,
    publicLaunch: "blocked"
  };
}

export function implementationDecisionPacket(result) {
  if (!result || result.schema !== "vedapath.private-implementation-decision.v1") {
    throw new TypeError("A VedaPath private implementation decision is required.");
  }
  return [
    "VedaPath Private Infrastructure Implementation Decision",
    `Status: ${result.status}`,
    `Evidence checks: ${Object.values(result.checks).filter(Boolean).length}/${REQUIRED_CHECKS.length}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Implementation authorized: ${result.implementationAuthorized}`,
    "Deployment activated: false",
    "Credentials provisioned: false",
    "Invitations issued: 0",
    "Public launch: blocked"
  ].join("\n");
}

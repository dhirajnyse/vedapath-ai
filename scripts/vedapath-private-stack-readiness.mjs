const REQUIRED_POSTURE = {
  identityMode: "pseudonymous-only",
  rightsMode: "reviewed-source-only",
  queueMode: "review-events-only",
  privacyMode: "local-first",
  incidentMode: "tested",
  rollbackMode: "manual-owner"
};

function namedOwner(value) {
  return /^owner:[a-z0-9][a-z0-9-]{2,47}$/.test(String(value || ""));
}

export function evaluatePrivateStackReadiness(input = {}) {
  const blockers = [];
  const assessedAt = Number(input.assessedAt);
  const expiresAt = Number(input.expiresAt);
  const checks = Object.fromEntries(
    Object.entries(REQUIRED_POSTURE).map(([key, expected]) => [key, input[key] === expected])
  );

  if (input.authorizationStatus !== "one-private-session-authorized-not-started") blockers.push("bounded-founder-authorization-required");
  if (!/^stack-candidate:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.stackId || ""))) blockers.push("candidate-stack-id-required");
  if (input.origin !== "private-demo-origin") blockers.push("private-demo-origin-required");
  if (!Object.values(checks).every(Boolean)) blockers.push("required-stack-posture-incomplete");
  if (!namedOwner(input.operationsOwner)) blockers.push("named-operations-owner-required");
  if (!namedOwner(input.privacyOwner)) blockers.push("named-privacy-owner-required");
  if (!namedOwner(input.securityOwner)) blockers.push("named-security-owner-required");
  if (!Number.isInteger(assessedAt) || !Number.isInteger(expiresAt) || expiresAt <= assessedAt || expiresAt - assessedAt > 24 * 60 * 60) blockers.push("readiness-expiry-must-be-within-24-hours");
  if (Number(input.maximumParticipants) !== 1) blockers.push("maximum-participants-must-equal-one");
  if (Number(input.maximumSessions) !== 1) blockers.push("maximum-sessions-must-equal-one");
  const writeRoutes = Array.isArray(input.writeRoutes) ? input.writeRoutes : [];
  if (writeRoutes.length !== 1 || writeRoutes[0] !== "POST /review-events") blockers.push("review-event-write-route-only");
  if (input.credentialsPresent === true) blockers.push("credentials-must-remain-absent");
  if (input.providerConnected === true) blockers.push("provider-must-remain-disconnected");
  if (input.deploymentActive === true) blockers.push("deployment-must-remain-inactive");
  if (input.invitationIssued === true) blockers.push("invitation-must-remain-unissued");
  if (input.sessionStarted === true) blockers.push("session-must-remain-not-started");
  if (input.publicAccess === true) blockers.push("public-access-forbidden");

  const ready = blockers.length === 0;
  return {
    schema: "vedapath.private-stack-readiness.v1",
    status: ready ? "private-stack-ready-no-activation" : "private-stack-readiness-blocked",
    ready,
    checks,
    blockers,
    maximumParticipants: ready ? 1 : 0,
    maximumSessions: ready ? 1 : 0,
    credentialsPresent: false,
    providerConnected: false,
    deploymentActive: false,
    invitationIssued: false,
    sessionStarted: false,
    publicAccess: false,
    publicLaunch: "blocked"
  };
}

export function privateStackReadinessPacket(result) {
  if (!result || result.schema !== "vedapath.private-stack-readiness.v1") {
    throw new TypeError("A VedaPath private stack readiness result is required.");
  }
  return [
    "VedaPath Private Stack Readiness Gate",
    `Status: ${result.status}`,
    `Posture checks: ${Object.values(result.checks).filter(Boolean).length}/${Object.keys(result.checks).length}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Maximum participants: ${result.maximumParticipants}`,
    `Maximum sessions: ${result.maximumSessions}`,
    "Credentials present: false",
    "Provider connected: false",
    "Deployment active: false",
    "Invitation issued: false",
    "Session started: false",
    "Public launch: blocked"
  ].join("\n");
}

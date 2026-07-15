const REQUIRED_EVIDENCE = {
  activationDecision: "one-private-invitation-authorized-not-issued",
  invitationDryRun: "invitation-dry-run-valid-not-issued",
  revocationReceipt: "revocation-drill-valid-no-live-invitation",
  sessionSandbox: "sandbox-session-complete-no-participant-created",
  incidentDrill: "incident-drill-passed-no-live-incident"
};

export function evaluateFounderPrivatePilotDecision(evidence = {}) {
  const checks = Object.fromEntries(
    Object.entries(REQUIRED_EVIDENCE).map(([key, expected]) => [key, evidence[key] === expected])
  );
  const blockers = Object.keys(checks).filter((key) => !checks[key]);
  if (!/^owner:[a-z0-9][a-z0-9-]{2,47}$/.test(String(evidence.pilotOwner || ""))) blockers.push("named-pilot-owner-required");
  if (!/^owner:[a-z0-9][a-z0-9-]{2,47}$/.test(String(evidence.shutdownOwner || ""))) blockers.push("named-shutdown-owner-required");
  if (Number(evidence.maximumParticipants) !== 1) blockers.push("maximum-participants-must-equal-one");
  if (Number(evidence.maximumSessions) !== 1) blockers.push("maximum-sessions-must-equal-one");
  if (!Number.isInteger(Number(evidence.authorizationExpiresAt)) || !Number.isInteger(Number(evidence.decidedAt)) || Number(evidence.authorizationExpiresAt) <= Number(evidence.decidedAt) || Number(evidence.authorizationExpiresAt) - Number(evidence.decidedAt) > 72 * 60 * 60) blockers.push("authorization-expiry-must-be-within-72-hours");
  if (evidence.invitationIssued === true) blockers.push("invitation-must-remain-unissued");
  if (evidence.sessionStarted === true) blockers.push("session-must-remain-not-started");
  if (Number(evidence.externalParticipants || 0) !== 0) blockers.push("external-participants-must-be-zero");
  if (evidence.publicAccess === true) blockers.push("public-access-forbidden");
  if (Array.isArray(evidence.writeRoutes) && evidence.writeRoutes.some((route) => route !== "POST /review-events")) blockers.push("unapproved-write-route");

  const complete = blockers.length === 0;
  const rejected = evidence.founderDecision === "reject-private-pilot";
  const authorized = complete && evidence.founderDecision === "authorize-one-bounded-private-session";
  if (!rejected && evidence.founderDecision !== "authorize-one-bounded-private-session") blockers.push("founder-decision-required");

  return {
    schema: "vedapath.founder-private-pilot-decision.v1",
    status: rejected ? "private-pilot-rejected" : authorized ? "one-private-session-authorized-not-started" : "private-pilot-decision-blocked",
    checks,
    blockers: [...new Set(blockers)],
    completedChecks: Object.values(checks).filter(Boolean).length,
    totalChecks: Object.keys(REQUIRED_EVIDENCE).length,
    pilotAuthorized: authorized,
    maximumParticipants: authorized ? 1 : 0,
    maximumSessions: authorized ? 1 : 0,
    invitationIssued: false,
    sessionStarted: false,
    participantCreated: false,
    credentialsIssued: false,
    externalParticipants: 0,
    publicAccess: false,
    publicLaunch: "blocked"
  };
}

export function founderPrivatePilotDecisionPacket(result) {
  if (!result || result.schema !== "vedapath.founder-private-pilot-decision.v1") {
    throw new TypeError("A VedaPath founder private pilot decision is required.");
  }
  return [
    "VedaPath Founder Private Pilot Go/No-Go",
    `Status: ${result.status}`,
    `Evidence: ${result.completedChecks}/${result.totalChecks}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Pilot authorized: ${result.pilotAuthorized}`,
    `Maximum participants: ${result.maximumParticipants}`,
    `Maximum sessions: ${result.maximumSessions}`,
    "Invitation issued: false",
    "Session started: false",
    "Participant created: false",
    "Credentials issued: false",
    "External participants: 0",
    "Public launch: blocked"
  ].join("\n");
}

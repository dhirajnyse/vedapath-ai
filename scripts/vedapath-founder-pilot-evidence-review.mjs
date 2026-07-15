const REQUIRED_EVIDENCE = {
  founderAuthorization: "one-private-session-authorized-not-started",
  stackReadiness: "private-stack-ready-no-activation",
  invitationAdapter: "one-invitation-adapter-ready-not-sent",
  consentHandshake: "consent-handshake-fixture-valid-no-participant",
  sessionObservability: "first-session-observability-ready-no-live-session"
};

const REQUIRED_ACKNOWLEDGEMENTS = [
  "identity-is-pseudonymous",
  "rights-are-reviewed-source-only",
  "consent-is-fixture-only",
  "telemetry-is-local-aggregate-only",
  "execution-needs-separate-audit"
];

function namedOwner(value) {
  return /^owner:[a-z0-9][a-z0-9-]{2,47}$/.test(String(value || ""));
}

export function evaluateFounderPilotEvidenceReview(input = {}) {
  const blockers = [];
  const reviewedAt = Number(input.reviewedAt);
  const expiresAt = Number(input.expiresAt);
  const evidenceChecks = Object.fromEntries(
    Object.entries(REQUIRED_EVIDENCE).map(([key, expected]) => [key, input[key] === expected])
  );
  const acknowledgements = Array.isArray(input.acknowledgements) ? input.acknowledgements : [];

  for (const key of Object.keys(evidenceChecks)) if (!evidenceChecks[key]) blockers.push(`evidence:${key}`);
  for (const acknowledgement of REQUIRED_ACKNOWLEDGEMENTS) if (!acknowledgements.includes(acknowledgement)) blockers.push(`acknowledgement:${acknowledgement}`);
  if (acknowledgements.some((item) => !REQUIRED_ACKNOWLEDGEMENTS.includes(item))) blockers.push("unknown-acknowledgement");
  if (!namedOwner(input.founderOwner)) blockers.push("named-founder-owner-required");
  if (!namedOwner(input.privacyOwner)) blockers.push("named-privacy-owner-required");
  if (!namedOwner(input.securityOwner)) blockers.push("named-security-owner-required");
  if (!Number.isInteger(reviewedAt) || !Number.isInteger(expiresAt) || expiresAt <= reviewedAt || expiresAt - reviewedAt > 24 * 60 * 60) blockers.push("review-expiry-must-be-within-24-hours");
  if (Number(input.maximumParticipants) !== 1) blockers.push("maximum-participants-must-equal-one");
  if (Number(input.maximumSessions) !== 1) blockers.push("maximum-sessions-must-equal-one");
  if (input.credentialsIssued === true) blockers.push("credentials-must-remain-unissued");
  if (input.invitationIssued === true) blockers.push("invitation-must-remain-unissued");
  if (input.sessionStarted === true) blockers.push("session-must-remain-not-started");
  if (input.participantCreated === true) blockers.push("participant-must-remain-uncreated");
  if (input.providerConnected === true) blockers.push("provider-must-remain-disconnected");
  if (input.publicAccess === true) blockers.push("public-access-forbidden");

  const rejected = input.founderDecision === "reject-pilot-evidence";
  const approved = blockers.length === 0 && input.founderDecision === "approve-evidence-keep-execution-disabled";
  if (!rejected && input.founderDecision !== "approve-evidence-keep-execution-disabled") blockers.push("founder-decision-required");

  return {
    schema: "vedapath.founder-pilot-evidence-review.v1",
    status: rejected ? "private-pilot-evidence-rejected" : approved ? "private-pilot-evidence-approved-execution-disabled" : "private-pilot-evidence-review-blocked",
    approved,
    evidenceChecks,
    blockers: [...new Set(blockers)],
    completedEvidence: Object.values(evidenceChecks).filter(Boolean).length,
    totalEvidence: Object.keys(evidenceChecks).length,
    acknowledgementCount: REQUIRED_ACKNOWLEDGEMENTS.filter((item) => acknowledgements.includes(item)).length,
    maximumParticipants: approved ? 1 : 0,
    maximumSessions: approved ? 1 : 0,
    credentialsIssued: false,
    invitationIssued: false,
    sessionStarted: false,
    participantCreated: false,
    providerConnected: false,
    externalParticipants: 0,
    publicAccess: false,
    publicLaunch: "blocked",
    nextAction: approved ? "separate-audited-execution-decision" : "resolve-evidence-blockers"
  };
}

export function founderPilotEvidenceReviewPacket(result) {
  if (!result || result.schema !== "vedapath.founder-pilot-evidence-review.v1") {
    throw new TypeError("A VedaPath founder pilot evidence review is required.");
  }
  return [
    "VedaPath Founder Pilot Evidence Review",
    `Status: ${result.status}`,
    `Evidence: ${result.completedEvidence}/${result.totalEvidence}`,
    `Acknowledgements: ${result.acknowledgementCount}/${REQUIRED_ACKNOWLEDGEMENTS.length}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Maximum participants: ${result.maximumParticipants}`,
    `Maximum sessions: ${result.maximumSessions}`,
    "Credentials issued: false",
    "Invitation issued: false",
    "Session started: false",
    "Participant created: false",
    "Provider connected: false",
    "Public launch: blocked",
    `Next action: ${result.nextAction}`
  ].join("\n");
}

const REQUIRED_EVIDENCE = [
  "infrastructureAuthorization",
  "deploymentManifest",
  "reviewerIdentity",
  "durableQueue",
  "securityReview",
  "privacyReview",
  "rightsReview",
  "recoveryDrill"
];

export function assessPrivatePilotReadiness(evidence = {}) {
  const checks = {
    infrastructureAuthorization: evidence.infrastructureAuthorization === "authorized-for-private-implementation",
    deploymentManifest: evidence.deploymentManifest === "valid-dry-run",
    reviewerIdentity: evidence.reviewerIdentity === "contract-verified-provider-unconnected",
    durableQueue: evidence.durableQueue === "ledger-verified-provider-unconnected",
    securityReview: evidence.securityReview === "complete",
    privacyReview: evidence.privacyReview === "complete",
    rightsReview: evidence.rightsReview === "complete",
    recoveryDrill: evidence.recoveryDrill === "complete"
  };
  const blockers = REQUIRED_EVIDENCE.filter((key) => !checks[key]);

  if (evidence.publicAccess === true) blockers.push("publicAccess");
  if (Number(evidence.invitationsIssued || 0) !== 0) blockers.push("invitationsIssued");
  if (Number(evidence.externalParticipants || 0) !== 0) blockers.push("externalParticipants");

  const implementationReady = blockers.length === 0;
  return {
    schema: "vedapath.private-pilot-readiness.v1",
    status: implementationReady
      ? "ready-for-private-implementation-not-activation"
      : "blocked-before-private-implementation",
    checks,
    blockers,
    completedChecks: Object.values(checks).filter(Boolean).length,
    totalChecks: REQUIRED_EVIDENCE.length,
    implementationReady,
    activationAuthorized: false,
    deploymentActivated: false,
    invitationsIssued: 0,
    externalParticipants: 0,
    publicLaunch: "blocked"
  };
}

export function readinessPacket(result) {
  if (!result || result.schema !== "vedapath.private-pilot-readiness.v1") {
    throw new TypeError("A VedaPath private pilot readiness result is required.");
  }
  return [
    "VedaPath Private Pilot Readiness Control Room",
    `Status: ${result.status}`,
    `Evidence: ${result.completedChecks}/${result.totalChecks}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    "Activation authorized: false",
    "Deployment activated: false",
    "Invitations issued: 0",
    "External participants: 0",
    "Public launch: blocked"
  ].join("\n");
}

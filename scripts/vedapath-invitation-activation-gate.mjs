const REQUIRED_EVIDENCE = {
  implementationDecision: "implementation-authorized-deployment-closed",
  secretBindings: "verified-live-provider-bound",
  reviewerAccounts: "verified-live-accounts-no-invites",
  queueCutover: "verified-live-durable-queue",
  privateEndpoint: "healthy-private-endpoint",
  securityReview: "complete-against-live-stack",
  privacyReview: "complete-against-live-stack",
  rightsReview: "complete-against-live-stack",
  recoveryDrill: "complete-against-live-stack",
  shutdownDrill: "complete",
  telemetryConsent: "approved-minimal-aggregate",
  founderDecision: "authorize-one-private-invitation"
};

export function evaluateInvitationActivationGate(evidence = {}) {
  const checks = Object.fromEntries(
    Object.entries(REQUIRED_EVIDENCE).map(([key, expected]) => [key, evidence[key] === expected])
  );
  const blockers = Object.keys(checks).filter((key) => !checks[key]);
  if (evidence.publicAccess === true) blockers.push("public-access-forbidden");
  if (Number(evidence.existingInvitations || 0) !== 0) blockers.push("existing-invitations-must-be-zero");
  if (Number(evidence.externalParticipants || 0) !== 0) blockers.push("external-participants-must-be-zero");
  if (Array.isArray(evidence.writeRoutes) && evidence.writeRoutes.some((route) => route !== "POST /review-events")) {
    blockers.push("unapproved-write-route");
  }

  const singleInvitationAuthorized = blockers.length === 0;
  return {
    schema: "vedapath.invitation-activation-decision.v1",
    status: singleInvitationAuthorized
      ? "one-private-invitation-authorized-not-issued"
      : "activation-blocked",
    checks,
    blockers,
    completedChecks: Object.values(checks).filter(Boolean).length,
    totalChecks: Object.keys(REQUIRED_EVIDENCE).length,
    singleInvitationAuthorized,
    invitationIssued: false,
    maximumInvitations: singleInvitationAuthorized ? 1 : 0,
    externalParticipants: 0,
    publicAccess: false,
    publicLaunch: "blocked"
  };
}

export function invitationActivationPacket(result) {
  if (!result || result.schema !== "vedapath.invitation-activation-decision.v1") {
    throw new TypeError("A VedaPath invitation activation decision is required.");
  }
  return [
    "VedaPath Invitation Activation Decision Gate",
    `Status: ${result.status}`,
    `Evidence: ${result.completedChecks}/${result.totalChecks}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Single invitation authorized: ${result.singleInvitationAuthorized}`,
    "Invitation issued: false",
    `Maximum invitations: ${result.maximumInvitations}`,
    "External participants: 0",
    "Public launch: blocked"
  ].join("\n");
}

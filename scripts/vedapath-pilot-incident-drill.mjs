import { createHash } from "node:crypto";

const INCIDENT_TYPES = new Set(["consent-mismatch", "privacy-leak", "rights-hold", "session-boundary-breach"]);

function digest(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

export function runPilotIncidentDrill(input = {}) {
  const blockers = [];
  const detectedAt = Number(input.detectedAt);
  const containedAt = Number(input.containedAt);
  const shutdownAt = Number(input.shutdownAt);
  const recoveredAt = Number(input.recoveredAt);

  if (input.sandboxStatus !== "sandbox-session-complete-no-participant-created") blockers.push("completed-session-sandbox-required");
  if (!INCIDENT_TYPES.has(input.incidentType)) blockers.push("allowlisted-incident-type-required");
  if (input.severity !== "drill-only") blockers.push("drill-only-severity-required");
  if (!/^owner:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.incidentOwner || ""))) blockers.push("named-incident-owner-required");
  if (!/^owner:[a-z0-9][a-z0-9-]{2,47}$/.test(String(input.privacyOwner || ""))) blockers.push("named-privacy-owner-required");
  if (![detectedAt, containedAt, shutdownAt, recoveredAt].every(Number.isInteger) || !(detectedAt <= containedAt && containedAt <= shutdownAt && shutdownAt <= recoveredAt)) blockers.push("incident-timeline-invalid");
  if (Number.isInteger(detectedAt) && Number.isInteger(containedAt) && containedAt - detectedAt > 15 * 60) blockers.push("containment-sla-exceeded");
  if (Number.isInteger(detectedAt) && Number.isInteger(shutdownAt) && shutdownAt - detectedAt > 30 * 60) blockers.push("shutdown-sla-exceeded");
  if (Number.isInteger(detectedAt) && Number.isInteger(recoveredAt) && recoveredAt - detectedAt > 60 * 60) blockers.push("recovery-sla-exceeded");
  if (input.liveIncident === true) blockers.push("live-incident-forbidden");
  if (input.externalNotifications === true) blockers.push("external-notifications-forbidden");
  if (input.providerMutation === true) blockers.push("provider-mutation-forbidden");
  if (input.durableWrite === true) blockers.push("durable-write-forbidden");
  if (Number(input.externalParticipants || 0) !== 0) blockers.push("external-participants-must-be-zero");
  if (input.publicAccess === true) blockers.push("public-access-forbidden");

  const timeline = { detectedAt, containedAt, shutdownAt, recoveredAt };
  const passed = blockers.length === 0;
  return {
    schema: "vedapath.pilot-incident-drill.v1",
    status: passed ? "incident-drill-passed-no-live-incident" : "incident-drill-blocked",
    passed,
    blockers,
    incidentType: input.incidentType || null,
    timeline,
    evidenceDigest: passed ? digest({ incidentType: input.incidentType, timeline, incidentOwner: input.incidentOwner, privacyOwner: input.privacyOwner }) : null,
    liveIncident: false,
    externalNotifications: 0,
    providerMutations: 0,
    durableWrites: 0,
    externalParticipants: 0,
    publicAccess: false,
    publicLaunch: "blocked"
  };
}

export function pilotIncidentDrillPacket(result) {
  if (!result || result.schema !== "vedapath.pilot-incident-drill.v1") {
    throw new TypeError("A VedaPath pilot incident drill result is required.");
  }
  return [
    "VedaPath Pilot Incident Drill",
    `Status: ${result.status}`,
    `Blockers: ${result.blockers.length ? result.blockers.join(", ") : "none"}`,
    `Evidence digest: ${result.evidenceDigest || "not-created"}`,
    "Live incident: false",
    "External notifications: 0",
    "Provider mutations: 0",
    "Durable writes: 0",
    "External participants: 0",
    "Public launch: blocked"
  ].join("\n");
}

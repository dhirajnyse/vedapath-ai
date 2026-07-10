import { evaluateReviewerCapability } from "./vedapath-reviewer-authorization.mjs";

const actions = Object.freeze({
  "claim-source": { capability: "claim-source-work", status: "source-review" },
  "claim-rights": { capability: "claim-rights-work", status: "rights-review" },
  "route-source": { capability: "route-source", status: "source-review" },
  "route-rights": { capability: "route-rights", status: "rights-review" },
  "hold": { capability: "hold-candidate", status: "hold" },
  "source-evidence-ready": { capability: "mark-source-evidence-ready", status: "evidence-ready" },
  "rights-evidence-ready": { capability: "mark-rights-evidence-ready", status: "evidence-ready" }
});

function clean(value, max = 120) {
  return String(value || "").trim().slice(0, max);
}

export function normalizeRightsQueueRecord(input = {}) {
  return {
    id: clean(input.id, 80),
    citation: clean(input.citation),
    family: clean(input.family),
    rights_state: clean(input.rights_state, 40) || "needs-review",
    source_state: clean(input.source_state, 40) || "draft",
    status: ["new", "source-review", "rights-review", "hold", "evidence-ready"].includes(input.status) ? input.status : "new",
    review_lane: clean(input.review_lane),
    publication_state: "blocked",
    registry_merge: "manual-only"
  };
}

export function applyRightsQueueAction(record, action, reviewer = {}, options = {}) {
  const current = normalizeRightsQueueRecord(record);
  const rule = actions[action];
  if (!rule) {
    return { ok: false, record: current, decision: { preview_allowed: false, production_allowed: false, reason: "Unknown queue action." }, event: null };
  }
  const decision = evaluateReviewerCapability({ role: reviewer.role, operation: rule.capability });
  if (!decision.preview_allowed) return { ok: false, record: current, decision, event: null };
  const next = { ...current, status: rule.status, publication_state: "blocked", registry_merge: "manual-only" };
  const event = {
    schema: "vedapath.rights-queue-event.v1",
    release: "v4.9.0",
    candidate_id: next.id,
    action,
    from: current.status,
    to: next.status,
    reviewer_role: decision.role,
    identity_verified: false,
    occurred_at: String(options.now || "preview-session")
  };
  return { ok: true, record: next, decision, event };
}

export const rightsQueueBoundary = Object.freeze({
  release: "v4.9.0",
  persistence: "session-memory-only",
  approval: "unavailable",
  publication: "blocked",
  registry_merge: "manual-only",
  supported_actions: Object.keys(actions)
});


const candidateIdPattern = /^[a-z0-9][a-z0-9-]{2,79}$/;
const allowedRightsStates = new Set(["citation-only", "public-domain", "permission-recorded", "needs-review", "blocked"]);
const usableRightsStates = new Set(["citation-only", "public-domain", "permission-recorded"]);
const required = ["candidate_id", "citation", "family", "edition_note", "summary", "boundary", "rights_state", "rights_evidence", "review_lane"];

function clean(value, max) {
  return String(value || "").trim().slice(0, max);
}

export function validateSourceIntake(input = {}) {
  const candidate = {
    schema: "vedapath.source-intake.v1",
    candidate_id: clean(input.candidate_id, 80).toLowerCase(),
    citation: clean(input.citation, 120),
    family: clean(input.family, 120),
    edition_note: clean(input.edition_note, 240),
    summary: clean(input.summary, 500),
    boundary: clean(input.boundary, 500),
    rights_state: clean(input.rights_state, 40),
    rights_evidence: clean(input.rights_evidence, 600),
    review_lane: clean(input.review_lane, 100),
    reviewer_state: "draft",
    publication_state: "blocked",
    registry_merge: "manual-only",
    translation_text_included: false
  };
  const errors = [];

  for (const field of required) {
    if (!candidate[field]) errors.push({ field, code: "required", message: field.replace(/_/g, " ") + " is required." });
  }
  if (candidate.candidate_id && !candidateIdPattern.test(candidate.candidate_id)) {
    errors.push({ field: "candidate_id", code: "format", message: "Use lowercase letters, numbers, and hyphens." });
  }
  if (candidate.rights_state && !allowedRightsStates.has(candidate.rights_state)) {
    errors.push({ field: "rights_state", code: "rights_lane", message: "Choose a known rights lane." });
  }
  if (input.translation_text || input.full_text || input.verse_text) {
    errors.push({ field: "translation_text", code: "prohibited", message: "Translation text is outside this intake contract." });
  }
  const readyForRightsReview = errors.length === 0 && usableRightsStates.has(candidate.rights_state);
  return {
    ok: errors.length === 0,
    ready_for_rights_review: readyForRightsReview,
    errors,
    candidate
  };
}

export const sourceIntakeContract = Object.freeze({
  schema: "vedapath.source-intake.v1",
  required: required.slice(),
  allowed_rights_states: Array.from(allowedRightsStates),
  usable_rights_states: Array.from(usableRightsStates),
  publication_state: "blocked",
  reviewer_state: "draft"
});

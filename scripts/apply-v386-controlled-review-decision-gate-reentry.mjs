import fs from "node:fs";

const release = "v3.8.6";
const inputRelease = "v3.8.5";
const releaseBadge = "v3.8.6 decision";
const releaseName = "Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const previousRelease = "v3.8.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry";
const nextGate = "Founder permission execution authorization decision gate re-entry";
const inputNextGate = "Controlled permission execution authorization review decision gate re-entry";

const dataFile = "data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json";
const draftReviewDataFile = "data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json";
const jsFile = "assets/vedapath-controlled-permission-execution-authorization-review-decision-gate.js";
const cssFile = "assets/vedapath-controlled-permission-execution-authorization-review-decision-gate.css";
const pageFile = "controlledpermissionexecutionauthorizationreviewdecisiongate.html";
const docFile = "docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_REVIEW_DECISION_GATE.md";

const falseAuthorityFlags = [
  "permission_granted",
  "authorization_permission_granted",
  "permission_review_approved",
  "founder_permission_granted",
  "execution_packet_authorized",
  "execution_authorized",
  "execution_allowed",
  "founder_instruction_granted",
  "source_promotion_allowed",
  "promotion_execution_allowed",
  "implementation_authorized",
  "implementation_execution_allowed",
  "controlled_storage_entry_allowed",
  "storage_write_enabled",
  "canonical_write_allowed",
  "source_write_executed",
  "actual_storage_write_executed",
  "production_ready",
  "production_launch_allowed",
  "public_release_allowed"
];

const sourceIdentityFields = [
  "review_decision_gate_id",
  "controlled_permission_execution_authorization_draft_review_gate_id",
  "controlled_permission_execution_authorization_draft_gate_id",
  "founder_decision_gate_id",
  "founder_permission_execution_authorization_decision_gate_id",
  "authorization_review_gate_id",
  "permission_execution_authorization_preflight_id",
  "controlled_permission_execution_hold_id",
  "source_answer_id",
  "source_record_id",
  "source_family"
];

const handoffFields = [
  "review_route",
  "founder_question",
  "permission_question",
  "authority_flag_audit"
];

const read = (path) => fs.readFileSync(path, "utf8");
const write = (path, value) => fs.writeFileSync(path, value, "utf8");
const readJson = (path) => JSON.parse(read(path));
const writeJson = (path, value) => write(path, `${JSON.stringify(value, null, 2)}\n`);
const clone = (value) => JSON.parse(JSON.stringify(value));
const falseFlags = Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));

function replaceAll(path, replacements) {
  let text = read(path);
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  write(path, text);
}

function replaceOnce(path, from, to) {
  const text = read(path);
  if (
    path === "build-status.html" &&
    from.includes("Phase 346: Controlled Permission Execution Authorization Review Decision Gate Re-entry") &&
    text.includes("Phase 347: Founder Permission Execution Authorization Decision Gate Re-entry")
  ) {
    return;
  }
  if (
    (path === "README.md" || path === "docs/PROTOTYPE_NOTES.md") &&
    text.includes("## v3.8.6 Controlled Permission Execution Authorization Review Decision Gate Re-entry")
  ) {
    return;
  }
  if (!text.includes(from)) {
    throw new Error(`Missing expected text in ${path}: ${from.slice(0, 120)}`);
  }
  write(path, text.replace(from, to));
}

function prependBefore(path, marker, block) {
  const text = read(path);
  if (text.includes(block.trim().split("\n")[0])) return;
  if (!text.includes(marker)) {
    throw new Error(`Missing insertion marker in ${path}: ${marker}`);
  }
  write(path, text.replace(marker, `${block.trimEnd()}\n\n${marker}`));
}

function appendIfMissing(path, marker, block) {
  const text = read(path);
  if (text.includes(marker)) return;
  write(path, `${text.trimEnd()}\n\n${block.trim()}\n`);
}

const data = readJson(dataFile);
const draftReviewData = readJson(draftReviewDataFile);
const priorReview = clone(draftReviewData.sample_review);

const source = {
  draft_review_gate_release: inputRelease,
  draft_review_gate_schema: draftReviewData.schema_version,
  draft_gate_release: draftReviewData.source.draft_gate_release || priorReview.draft_gate_release,
  draft_gate_schema: draftReviewData.source.draft_gate_schema || priorReview.draft_gate_schema,
  ...Object.fromEntries(sourceIdentityFields.map((field) => [field, draftReviewData.source[field] || priorReview[field]])),
  ...Object.fromEntries(handoffFields.map((field) => [field, draftReviewData.source[field] || priorReview[field]]))
};

const sampleDraftReviewPacket = {
  schema_version: draftReviewData.schema_version,
  release: draftReviewData.release,
  draft_review_status: "Draft review ready for founder decision; execution remains false.",
  review_state: "Draft review ready for founder decision",
  review_actor: "Controlled draft review gate",
  reviewer_name: "Draft review sample",
  ...source,
  review_scope: priorReview.review_scope,
  review_language: priorReview.review_language,
  review_notes: priorReview.review_notes,
  review_evidence_summary: priorReview.review_evidence_summary,
  non_execution_review_clause: priorReview.non_execution_review_clause,
  risk_review: priorReview.risk_review,
  rollback_review: priorReview.rollback_review,
  monitoring_review: priorReview.monitoring_review,
  stop_condition: priorReview.stop_condition,
  expiry_check: priorReview.expiry_check,
  production_boundary: priorReview.production_boundary,
  clarification_question: priorReview.clarification_question,
  return_reason: priorReview.return_reason,
  hold_reason: priorReview.hold_reason,
  block_reason: priorReview.block_reason,
  controlled_permission_execution_authorization_draft_review_ready: true,
  permission_execution_authorization_draft_review_recorded: true,
  founder_permission_execution_authorization_review_decision_candidate_ready: true,
  ...falseFlags,
  preserves_source_identity: true,
  preserves_review_route: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  next_gate_required: inputNextGate,
  draft_gate_release: source.draft_gate_release,
  draft_gate_schema: source.draft_gate_schema,
  next_gate: inputNextGate,
  created_at: "2026-07-03T00:00:00.000Z"
};

const sampleDecision = {
  decision_state: "Ready for founder decision",
  decision_actor: "Controlled review decision gate",
  reviewer_name: "Review decision sample",
  ...source,
  decision_scope: "Decide whether the v3.8.5 draft-review packet may move to founder permission execution authorization decision gate re-entry. This decision is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  decision_language: "Review decision result: route the v3.8.5 draft-review packet to founder decision gate re-entry only. This is routing readiness only; permission grant remains closed, authorization approval remains closed, execution remains closed, and no system may run from it.",
  decision_rationale: "The v3.8.5 draft-review packet is ready, the question handoff and source identity are intact, founder posture id is preserved, evidence ids are visible, and authority stays closed. The next step is founder decision re-entry only.",
  decision_evidence_summary: "The v3.8.5 draft-review packet preserves review decision gate id, draft review gate id, draft gate id, founder decision id, founder posture id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, authority flag audit, rollback, monitoring, stop condition, expiry, and production boundary.",
  non_execution_decision_clause: "Controlled permission execution authorization review decision gate re-entry only; review_decision_ready may be true, review_decision_recorded may be true, controlled_permission_execution_authorization_review_decision_ready may be true, and founder_permission_execution_authorization_decision_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, founder_instruction_granted remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false.",
  risk_acknowledgment: "Risk remains: v3.8.5 draft-review packet mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, founder posture id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous decision language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback if the v3.8.5 draft-review packet, route, source identity, founder posture id, questions, audit, or non-execution boundary no longer match the incoming packet.",
  monitoring_condition: "Monitor only the frozen v3.8.5 draft-review packet, route, source identity, founder posture id, questions, authority audit, and false authority flags before routing to founder decision.",
  stop_condition: "Stop if the v3.8.5 draft-review packet, review decision id, draft review gate id, draft gate id, founder posture id, review route, founder question, permission question, authority flag audit, founder decision id, authorization review id, preflight id, hold id, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Controlled permission execution authorization review decision gate re-entry expires at the next material v3.8.5 draft-review packet, review decision, draft review, draft, founder decision, authorization review, preflight, hold, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  return_reason: "Return if the v3.8.5 draft-review language loses founder posture id, route, question, audit, or source identity clarity.",
  hold_reason: "Hold until the reviewer can see the exact v3.8.5 draft-review packet, founder posture id, source ids, route, questions, and authority audit.",
  block_reason: "Block if any authority flag becomes true or the v3.8.5 handoff is changed.",
  controlled_permission_execution_authorization_draft_review_ready: true,
  permission_execution_authorization_draft_review_recorded: true,
  founder_permission_execution_authorization_review_decision_candidate_ready: true,
  review_decision_ready: true,
  review_decision_recorded: true,
  controlled_permission_execution_authorization_review_decision_ready: true,
  founder_permission_execution_authorization_decision_candidate_ready: true,
  ...falseFlags,
  next_gate_required: nextGate
};

data.schema_version = "controlled-permission-execution-authorization-review-decision-gate-v6";
data.release = release;
data.input_release = inputRelease;
data.generated_at = "2026-07-03";
data.title = releaseName;
data.summary = "Re-enters the review decision gate from the v3.8.5 draft-review packet, preserves founder posture id, source identity, route, questions, and authority audit, and routes founder, hold, return, or block while every permission, authorization, execution, storage, public release, and production path remains disabled.";
data.previous_release = previousRelease;
data.source_release = previousRelease;
data.next_gate = nextGate;
data.source = source;
data.decision_modes = {
  "Ready for founder decision": {
    state: "Ready for founder decision",
    summary: "Prepare a founder decision candidate only. This is still not permission, authorization, or execution."
  },
  "Hold for evidence": {
    state: "Hold for evidence",
    summary: "Keep the packet held until the v3.8.5 draft-review evidence is visible and stable."
  },
  "Return to draft review": {
    state: "Return to draft review",
    summary: "Send the packet back to the v3.8.5 draft-review gate."
  },
  "Block packet": {
    state: "Block packet",
    summary: "Close this packet route because trust evidence, source identity, or boundary text is unsafe."
  }
};
data.decision_checks = [
  { check: "Input packet", rule: "Starts only from the v3.8.5 non-authorizing draft-review output." },
  { check: "Identity continuity", rule: "Preserves review decision id, draft review id, draft gate id, founder posture id, founder decision id, authorization review id, preflight id, hold id, and source ids." },
  { check: "Question continuity", rule: "Preserves review route, founder question, permission question, and authority flag audit." },
  { check: "Forward limit", rule: "Forward route may create only founder decision candidate readiness." },
  { check: "Authority boundary", rule: "Permission, authorization, execution, storage, canonical writes, public release, and production remain false." }
];
data.sample_draft_review_packet = sampleDraftReviewPacket;
data.sample_decision = sampleDecision;
data.boundary = {
  review_decision_ready: false,
  review_decision_recorded: false,
  controlled_permission_execution_authorization_review_decision_ready: false,
  founder_permission_execution_authorization_decision_candidate_ready: false,
  ...falseFlags,
  next_gate_required: nextGate
};
writeJson(dataFile, data);

replaceAll(jsFile, [
  ["controlled-permission-execution-authorization-draft-review-gate-v5", "controlled-permission-execution-authorization-draft-review-gate-v6"],
  ["v3.8.1", inputRelease],
  ["v3.7.7", inputRelease]
]);

replaceAll(pageFile, [
  ["v3.8.2 decision", releaseBadge],
  ["v3.8.2", release],
  ["v3.8.1", inputRelease],
  ["v3.7.8 decision", releaseBadge],
  ["v3.7.8", release],
  ["v3.7.7", inputRelease],
  ["Decide the reviewed packet. Keep authority closed.", "Choose one route. Keep authority closed."],
  ["Route the review. Preserve the calm.", "Choose the route. Open no gate."],
  ["A positive result prepares a founder decision candidate only.", "A positive result prepares one founder decision candidate only."]
]);

appendIfMissing(
  cssFile,
  "VEDAPATH v3.8.6 CONTROLLED REVIEW DECISION GATE RE-ENTRY",
  `
/* VEDAPATH v3.8.6 CONTROLLED REVIEW DECISION GATE RE-ENTRY */
body.review-decision-page.vp-command-shell-ready main.workspace {
  grid-template-columns: minmax(178px, 0.42fr) minmax(0, 3.08fr) minmax(190px, 0.46fr);
  gap: 18px;
}

body.review-decision-page.vp-command-shell-ready .review-decision {
  padding: clamp(18px, 1.55vw, 28px);
  gap: 14px;
  background:
    radial-gradient(circle at 92% 8%, rgba(20, 92, 74, 0.055), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 253, 0.99), rgba(255, 253, 249, 0.965));
  box-shadow: 0 22px 54px rgba(35, 43, 35, 0.055);
}

body.review-decision-page.vp-command-shell-ready .review-decision-head {
  grid-template-columns: minmax(0, 1fr) 70px;
  min-height: 72px;
}

body.review-decision-page.vp-command-shell-ready .review-decision h1 {
  max-width: 650px;
  font-size: clamp(21px, 1.12vw, 27px);
  line-height: 1.12;
}

body.review-decision-page.vp-command-shell-ready .review-decision-head .muted {
  max-width: 880px;
  font-size: 0.88rem;
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice-grid,
body.review-decision-page.vp-command-shell-ready .review-decision-relay,
body.review-decision-page.vp-command-shell-ready .review-decision-list,
body.review-decision-page.vp-command-shell-ready .review-decision-rules {
  gap: 9px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice,
body.review-decision-page.vp-command-shell-ready .review-decision-card,
body.review-decision-page.vp-command-shell-ready .review-decision-rule,
body.review-decision-page.vp-command-shell-ready .review-decision-result,
body.review-decision-page.vp-command-shell-ready .review-decision-form {
  border-color: rgba(86, 99, 80, 0.15);
  background:
    linear-gradient(180deg, rgba(255, 255, 252, 0.985), rgba(255, 254, 250, 0.945)),
    linear-gradient(90deg, rgba(20, 92, 74, 0.018), transparent);
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice {
  min-height: 62px;
  padding: 12px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice[aria-pressed="true"] {
  background:
    linear-gradient(180deg, rgba(237, 248, 243, 0.98), rgba(255, 253, 248, 0.96));
}

body.review-decision-page.vp-command-shell-ready .review-decision-relay div {
  min-height: 54px;
  padding: 10px 12px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-form {
  max-height: 560px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-form h2,
body.review-decision-page.vp-command-shell-ready .review-decision-result h2,
body.review-decision-page.vp-command-shell-ready aside.panel > h2 {
  font-size: clamp(17px, 0.98vw, 21px);
  line-height: 1.16;
}

body.review-decision-page.vp-command-shell-ready .review-decision-form textarea {
  min-height: 58px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-card span,
body.review-decision-page.vp-command-shell-ready .review-decision-rule span,
body.review-decision-page.vp-command-shell-ready .review-decision-choice span,
body.review-decision-page.vp-command-shell-ready .review-decision-relay span,
body.review-decision-page.vp-command-shell-ready .review-decision-relay p {
  font-size: 11px;
}
`
);

replaceAll("assets/vedapath-command-shell.js", [
  ['const releaseBadge = "v3.8.5 review";', `const releaseBadge = "${releaseBadge}";`]
]);

replaceAll("build-status.html", [
  ["v3.8.5 review", releaseBadge],
  ["<strong>v3.8.5</strong>\n          <p>Controlled Permission Execution Authorization Draft Review Gate Re-entry: the review gate now receives the v3.8.4 controlled draft packet and prepares one review-decision candidate while every authority flag stays false.</p>", `<strong>${release}</strong>\n          <p>${releaseName}: the decision gate now receives the v3.8.5 draft-review packet and routes only to founder decision, hold, return, or block while every authority flag stays false.</p>`],
  ["The trust chain now reviews the v3.8.4 controlled draft packet without turning readiness into permission, authorization, execution, storage, public release, or production.", "The trust chain now routes the v3.8.5 draft-review packet without turning route readiness into permission, authorization, execution, storage, public release, or production."],
  ["<strong>Controlled permission execution authorization review decision gate re-entry</strong>\n          <p>Route the v3.8.5 draft-review packet to review decision, hold, return, or block while every authority flag remains false.</p>", `<strong>${nextGate}</strong>\n          <p>Receive the v3.8.6 review-decision packet and record founder posture while every authority flag remains false.</p>`]
]);

replaceOnce(
  "build-status.html",
  `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 346: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
                <p>Route the v3.8.5 draft-review packet to founder decision, hold, return, or block while every authority and production flag remains false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
  `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 346: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
                <p>Route the v3.8.5 draft-review packet to founder decision, hold, return, or block while every authority and production flag remains false.</p>
              </div>
              <div class="percent">100%</div>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 347: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
                <p>Receive the v3.8.6 review-decision packet and record founder posture while permission, authorization, execution, storage, public release, and production remain false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`
);

replaceAll("build-status.html", [
  ["<div class=\"version-row\"><span>Release</span><strong>v3.8.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong></div>", `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>`],
  ["<div class=\"version-row\"><span>Previous</span><strong>v3.8.4 Controlled Permission Execution Authorization Draft Gate Re-entry</strong></div>", `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`],
  ["<div class=\"version-row\"><span>Goal</span><strong>Review the v3.8.4 controlled draft packet and prepare one review-decision candidate without granting permission, approving authorization, or enabling execution.</strong></div>", "<div class=\"version-row\"><span>Goal</span><strong>Route the v3.8.5 draft-review packet to founder decision, hold, return, or block without granting permission, approving authorization, or enabling execution.</strong></div>"],
  ["<div class=\"version-row\"><span>Status</span><strong>Ready for controlled review decision gate re-entry</strong></div>", "<div class=\"version-row\"><span>Status</span><strong>Ready for founder decision gate re-entry</strong></div>"],
  ["<li><span class=\"dot\"></span><span>Re-enter the controlled permission execution authorization draft gate.</span></li>\n              <li><span class=\"dot\"></span><span>Receive the v3.8.5 draft-review packet without granting authorization or execution.</span></li>\n              <li><span class=\"dot\"></span><span>Prepare one controlled draft candidate only from draft-only posture.</span></li>\n              <li><span class=\"dot\"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>", "<li><span class=\"dot\"></span><span>Re-enter the founder permission execution authorization decision gate.</span></li>\n              <li><span class=\"dot\"></span><span>Receive the v3.8.6 review-decision packet without granting authorization or execution.</span></li>\n              <li><span class=\"dot\"></span><span>Record founder posture only: draft-only, hold, return, or reject.</span></li>\n              <li><span class=\"dot\"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>"],
  ["<li><span class=\"dot\"></span><span>Re-enter the controlled permission execution authorization review decision gate.</span></li>\n              <li><span class=\"dot\"></span><span>Receive the v3.8.5 draft-review packet without granting authorization or execution.</span></li>\n              <li><span class=\"dot\"></span><span>Route only to founder decision, hold, return, or block.</span></li>\n              <li><span class=\"dot\"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>", "<li><span class=\"dot\"></span><span>Re-enter the founder permission execution authorization decision gate.</span></li>\n              <li><span class=\"dot\"></span><span>Receive the v3.8.6 review-decision packet without granting authorization or execution.</span></li>\n              <li><span class=\"dot\"></span><span>Record founder posture only: draft-only, hold, return, or reject.</span></li>\n              <li><span class=\"dot\"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>"]
]);

const readmeEntry = `## ${release} ${releaseName}

- Re-enters the controlled review-decision gate from the v3.8.5 draft-review packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit.
- Routes only to founder decision, hold, return, or block while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.
- Refines the review-decision UI into a calmer routing desk with current v3.8.5 input language, softer decision cards, tighter type rhythm, and the v3.8.6 command-shell badge.
- Updates [Controlled Permission Execution Authorization Review Decision Gate](${pageFile}), [Controlled Permission Execution Authorization Review Decision Gate Data](${dataFile}), and [Controlled Permission Execution Authorization Review Decision Gate Notes](${docFile}).

`;
prependBefore("README.md", "## v3.8.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry", readmeEntry);

const notesEntry = `## ${release} ${releaseName}

- Re-enters the controlled review-decision gate from the v3.8.5 draft-review packet.
- Routes the packet to founder decision, hold, return, or block while every grant remains false.
- Adds calmer decision polish: current v3.8.5 incoming packet, one founder decision candidate, softer route cards, tighter review desk copy, current command-shell badge, and no authority opening.
- Keeps permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.

`;
prependBefore("docs/PROTOTYPE_NOTES.md", "## v3.8.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry", notesEntry);

write(docFile, `# ${releaseName}

Controlled Permission Execution Authorization Review Decision Gate Re-entry receives the v3.8.5 controlled draft-review packet and turns it into a founder decision candidate route, hold, return, or block.

Version: ${release}

Input: ${previousRelease} output

Next gate: ${nextGate}.

It can route a packet to:

- founder decision
- hold for more evidence
- return to draft review
- block the packet path

Every accepted decision must preserve:

- review decision gate id
- draft review gate id
- draft gate id
- founder decision id
- founder posture gate id
- authorization review id
- preflight id
- hold id
- review route
- founder question
- permission question
- source ids
- authority flag audit

Forward routing may mark review-decision readiness and founder decision candidate readiness only. It must not grant permission, approve authorization, execute, store, update canonical records, publish, or launch production.

## v3.8.6 Re-entry Notes

- Accept only the v3.8.5 controlled draft-review packet.
- Route only to founder decision, hold, return, or block.
- Keep permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.
- Preserve the v3.8.5 route, source ids, source family, questions, founder posture id, and authority audit.
- Keep the room visually quiet: one incoming packet, four visible routes, one outgoing founder decision candidate, zero authority leakage.
`);

console.log(`${release} ${releaseName} applied.`);


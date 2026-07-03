import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");
const write = (path, value) => fs.writeFileSync(path, value, "utf8");
const readJson = (path) => JSON.parse(read(path));
const writeJson = (path, value) => write(path, `${JSON.stringify(value, null, 2)}\n`);
const clone = (value) => JSON.parse(JSON.stringify(value));

function replaceAll(path, replacements) {
  let text = read(path);
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  write(path, text);
}

function replaceOnce(path, from, to) {
  const text = read(path);
  if (path === "build-status.html" && from.includes("Phase 345: Controlled Permission Execution Authorization Draft Review Gate Re-entry") && text.includes("Phase 346: Controlled Permission Execution Authorization Review Decision Gate Re-entry")) {
    return;
  }
  if ((path === "README.md" || path === "docs/PROTOTYPE_NOTES.md") && text.includes("## v3.8.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry")) {
    return;
  }
  if (!text.includes(from)) {
    throw new Error(`Missing expected text in ${path}: ${from.slice(0, 90)}`);
  }
  write(path, text.replace(from, to));
}

function appendIfMissing(path, marker, block) {
  const text = read(path);
  if (text.includes(marker)) return;
  write(path, `${text.trimEnd()}\n\n${block.trim()}\n`);
}

const draftGatePath = "data/vedapath-controlled-permission-execution-authorization-draft-gate.json";
const reviewGatePath = "data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json";
const draftGate = readJson(draftGatePath);
const oldReviewGate = readJson(reviewGatePath);

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

function draftOutputFromGate(config) {
  const draft = config.sample_draft;
  const decision = config.sample_founder_decision_packet;
  return {
    schema_version: config.schema_version,
    release: config.release,
    draft_status: "Controlled draft review candidate prepared; execution remains false.",
    controlled_permission_execution_authorization_draft_gate_id: draft.controlled_permission_execution_authorization_draft_gate_id,
    founder_permission_execution_authorization_decision_gate_id: draft.founder_permission_execution_authorization_decision_gate_id,
    review_decision_gate_id: draft.review_decision_gate_id,
    controlled_permission_execution_authorization_draft_review_gate_id: draft.controlled_permission_execution_authorization_draft_review_gate_id,
    founder_decision_gate_id: draft.founder_decision_gate_id,
    authorization_review_gate_id: draft.authorization_review_gate_id,
    permission_execution_authorization_preflight_id: draft.permission_execution_authorization_preflight_id,
    controlled_permission_execution_hold_id: draft.controlled_permission_execution_hold_id,
    source_answer_id: draft.source_answer_id,
    source_record_id: draft.source_record_id,
    source_family: draft.source_family,
    review_route: draft.review_route,
    founder_question: draft.founder_question,
    permission_question: draft.permission_question,
    authority_flag_audit: draft.authority_flag_audit,
    founder_permission_execution_authorization_decision_ready: decision.founder_permission_execution_authorization_decision_ready === true,
    founder_permission_execution_authorization_decision_recorded: decision.founder_permission_execution_authorization_decision_recorded === true,
    controlled_permission_execution_authorization_draft_candidate_ready: decision.controlled_permission_execution_authorization_draft_candidate_ready === true,
    controlled_permission_execution_authorization_draft_ready: true,
    permission_execution_authorization_draft_recorded: true,
    controlled_permission_execution_authorization_draft_review_candidate_ready: true,
    ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
    draft_scope: draft.draft_scope,
    draft_language: draft.draft_language,
    draft_rationale: draft.draft_rationale,
    draft_evidence_summary: draft.draft_evidence_summary,
    non_execution_draft_clause: draft.non_execution_draft_clause,
    risk_acknowledgment: draft.risk_acknowledgment,
    rollback_condition: draft.rollback_condition,
    monitoring_condition: draft.monitoring_condition,
    stop_condition: draft.stop_condition,
    expiry_check: draft.expiry_check,
    production_boundary: draft.production_boundary,
    preserves_source_identity: true,
    preserves_review_route: true,
    preserves_founder_question: true,
    preserves_permission_question: true,
    preserves_authority_flag_audit: true,
    next_gate_required: "Controlled permission execution authorization draft review gate re-entry",
    created_at: "2026-07-03T00:00:00.000Z"
  };
}

const source = {
  draft_gate_release: "v3.8.4",
  draft_gate_schema: draftGate.schema_version,
  ...Object.fromEntries(sourceIdentityFields.map((field) => [field, draftGate.source[field]])),
  review_route: draftGate.source.review_route,
  founder_question: draftGate.source.founder_question,
  permission_question: draftGate.source.permission_question,
  authority_flag_audit: draftGate.source.authority_flag_audit
};

const sampleDraftPacket = draftOutputFromGate(draftGate);
const sampleReview = {
  ...clone(oldReviewGate.sample_review),
  review_state: "Draft review ready for founder decision",
  review_actor: "Controlled draft review gate",
  reviewer_name: "Draft review sample",
  ...Object.fromEntries(sourceIdentityFields.map((field) => [field, source[field]])),
  review_route: source.review_route,
  founder_question: source.founder_question,
  permission_question: source.permission_question,
  authority_flag_audit: source.authority_flag_audit,
  review_scope: "Review the v3.8.4 controlled permission execution authorization draft candidate for clarity, source identity preservation, founder posture id preservation, question handoff integrity, and boundary strength. This review is not permission grant, not authorization approval, not execution, and cannot promote, store, change canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  review_language: "Review result: the v3.8.4 controlled draft candidate can move only to the controlled permission execution authorization review decision gate re-entry. Permission grant remains closed, authorization approval remains closed, execution remains closed, and no system may run from this review.",
  review_notes: "The question handoff and source identity stay intact: founder posture id, review decision id, draft review id, draft gate id, review route, founder question, permission question, source ids, and authority flag audit match the v3.8.4 controlled draft packet.",
  review_evidence_summary: "The v3.8.4 controlled draft packet exposes the v3.8.3 founder posture id, review decision id, draft review id, draft gate id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, authority flag audit, rollback, monitoring, stop condition, expiry, and production boundary before review-decision readiness.",
  risk_review: "Risk remains: v3.8.4 controlled draft mismatch, v3.8.3 founder posture id mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous review language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_review: "Rollback review passes only when before_hash, v3.8.4 draft audit, v3.8.3 founder posture audit, draft-review audit, question handoff audit, source identity audit, and failure review remain visible and no source state is written.",
  monitoring_review: "Monitoring review keeps audit receipt, stop condition, failure review, reviewer handoff, v3.8.3 founder posture id, source identity, authority flag audit, and before-write check visible before any controlled review decision gate.",
  stop_condition: "Stop if the v3.8.4 draft gate id mismatches, v3.8.3 founder posture id mismatches, review decision id mismatches, draft review gate id mismatches, review route mismatches, founder question mismatches, permission question mismatches, authority flag audit mismatches, founder decision id mismatches, authorization review id mismatches, preflight id mismatches, hold id mismatches, source ids mismatch, rights change, review language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Controlled permission execution authorization draft review gate re-entry expires at the next material v3.8.4 controlled draft, v3.8.3 founder posture, review decision, draft, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
  clarification_question: "Which exact v3.8.4 controlled draft packet should this review carry forward, and which single authority boundary should remain most visible?",
  return_reason: "Return if the v3.8.4 controlled draft packet loses route, question, audit, founder posture id, or source identity clarity.",
  hold_reason: "Hold until the reviewer can see the exact v3.8.4 controlled draft packet, source ids, route, questions, founder posture id, and authority audit.",
  block_reason: "Block if any authority flag becomes true or the v3.8.4 handoff is changed.",
  controlled_permission_execution_authorization_draft_review_ready: true,
  permission_execution_authorization_draft_review_recorded: true,
  founder_permission_execution_authorization_review_decision_candidate_ready: true,
  ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
  next_gate_required: "Controlled permission execution authorization review decision gate re-entry",
  draft_gate_release: "v3.8.4",
  draft_gate_schema: draftGate.schema_version,
  next_gate: "Controlled permission execution authorization review decision gate re-entry"
};

const reviewGate = {
  ...oldReviewGate,
  schema_version: "controlled-permission-execution-authorization-draft-review-gate-v6",
  release: "v3.8.5",
  generated_at: "2026-07-03",
  title: "Controlled Permission Execution Authorization Draft Review Gate Re-entry",
  summary: "Re-enters the controlled draft review gate from the v3.8.4 controlled draft packet, verifies source identity, founder posture id, route, questions, and authority audit, and prepares only controlled review-decision candidate language while every permission, authorization, execution, storage, public release, and production path remains disabled.",
  previous_release: "v3.8.4 Controlled Permission Execution Authorization Draft Gate Re-entry",
  source_release: "v3.8.4 Controlled Permission Execution Authorization Draft Gate Re-entry",
  next_gate: "Controlled permission execution authorization review decision gate re-entry",
  source,
  review_checks: [
    { check: "Input packet", rule: "Starts only from the v3.8.4 controlled draft candidate output." },
    { check: "Source identity", rule: "Preserves founder posture id, review decision id, draft review id, draft gate id, source ids, route, questions, and authority audit." },
    { check: "Review only", rule: "Can mark draft-review readiness, but cannot approve authorization or grant permission." },
    { check: "No operation", rule: "Execution, storage, canonical updates, migrations, accounts, secrets, public release, and production remain closed." },
    { check: "Review-decision next", rule: "Moves only to the controlled review-decision gate re-entry, never to a runnable path." },
    { check: "Expiry", rule: "Expires on draft, review, source, rights, rollback, monitoring, packet, or code change." }
  ],
  sample_draft_packet: sampleDraftPacket,
  sample_review: sampleReview,
  boundary: {
    ...oldReviewGate.boundary,
    controlled_permission_execution_authorization_draft_review_ready: false,
    permission_execution_authorization_draft_review_recorded: false,
    founder_permission_execution_authorization_review_decision_candidate_ready: false,
    ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
    next_gate_required: "Controlled permission execution authorization review decision gate re-entry"
  },
  input_release: "v3.8.4"
};

writeJson(reviewGatePath, reviewGate);

replaceAll("assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.js", [
  ["controlled-permission-execution-authorization-draft-gate-v5", "controlled-permission-execution-authorization-draft-gate-v6"],
  ["v3.8.0", "v3.8.4"],
  ["v3.7.6", "v3.8.4"]
]);

replaceAll("controlledpermissionexecutionauthorizationdraftreviewgate.html", [
  ["VedaPath Controlled Permission Execution Authorization Draft Review Gate", "VedaPath Controlled Permission Execution Authorization Draft Review Gate Re-entry"],
  ["v3.8.1 review", "v3.8.5 review"],
  ["v3.8.1", "v3.8.5"],
  ["v3.8.0", "v3.8.4"],
  ["v3.7.7 review", "v3.8.5 review"],
  ["v3.7.7", "v3.8.5"],
  ["v3.7.6", "v3.8.4"],
  ["Review one draft. Decide nothing.", "Review the draft. Decide nothing."],
  ["Review one draft. Preserve trust.", "Review calmly. Decide nothing yet."],
  ["Controlled draft review re-entry", "Controlled draft review desk"]
]);

replaceAll("assets/vedapath-command-shell.js", [
  ['const releaseBadge = "v3.8.4 draft";', 'const releaseBadge = "v3.8.5 review";']
]);

appendIfMissing(
  "assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.css",
  "VEDAPATH v3.8.5 CONTROLLED DRAFT REVIEW GATE RE-ENTRY",
  `
/* VEDAPATH v3.8.5 CONTROLLED DRAFT REVIEW GATE RE-ENTRY */
body.permission-execution-draft-review-page.vp-command-shell-ready main.workspace {
  grid-template-columns: minmax(186px, 0.48fr) minmax(0, 2.74fr) minmax(206px, 0.5fr);
  gap: 18px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-gate {
  padding: clamp(18px, 1.6vw, 28px);
  gap: 14px;
  background:
    linear-gradient(180deg, rgba(255, 255, 253, 0.99), rgba(255, 253, 249, 0.965)),
    radial-gradient(circle at 96% 2%, rgba(20, 92, 74, 0.06), transparent 26%);
  box-shadow: 0 22px 54px rgba(45, 38, 28, 0.055);
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-gate h1 {
  max-width: 620px;
  font-size: clamp(21px, 1.12vw, 26px);
  line-height: 1.12;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-head {
  grid-template-columns: minmax(0, 1fr) 72px;
  min-height: 72px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-mark {
  padding: 8px;
  box-shadow: 0 14px 30px rgba(91, 45, 24, 0.055);
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step-grid,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay {
  gap: 9px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay > div,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-card,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-result,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-rule,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form {
  border-color: rgba(86, 99, 80, 0.15);
  background:
    linear-gradient(180deg, rgba(255, 255, 252, 0.985), rgba(255, 254, 250, 0.945)),
    linear-gradient(90deg, rgba(20, 92, 74, 0.02), transparent);
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form {
  max-height: 570px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form h2,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-result h2 {
  font-size: 17px;
  line-height: 1.16;
}

body.permission-execution-draft-review-page.vp-command-shell-ready aside.panel > h2 {
  font-size: clamp(17px, 0.98vw, 21px);
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay p,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-card span,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step span {
  font-size: 11px;
}
`
);

replaceAll("build-status.html", [
  ["v3.8.4 draft", "v3.8.5 review"],
  ["<strong>v3.8.4</strong>\n          <p>Controlled Permission Execution Authorization Draft Gate Re-entry: the draft gate now receives the v3.8.3 founder posture packet and prepares one draft-review candidate while every authority flag stays false.</p>", "<strong>v3.8.5</strong>\n          <p>Controlled Permission Execution Authorization Draft Review Gate Re-entry: the review gate now receives the v3.8.4 controlled draft packet and prepares one review-decision candidate while every authority flag stays false.</p>"],
  ["The trust chain now carries the v3.8.3 founder posture into controlled draft language without turning readiness into permission, authorization, execution, storage, public release, or production.", "The trust chain now reviews the v3.8.4 controlled draft packet without turning readiness into permission, authorization, execution, storage, public release, or production."],
  ["<strong>Controlled permission execution authorization draft review gate re-entry</strong>\n          <p>Review the v3.8.4 controlled draft packet before any later authorization posture while every authority flag remains false.</p>", "<strong>Controlled permission execution authorization review decision gate re-entry</strong>\n          <p>Route the v3.8.5 draft-review packet to review decision, hold, return, or block while every authority flag remains false.</p>"]
]);

const phase345Old = `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 345: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
                <p>Review the v3.8.4 controlled draft packet before any later authorization posture while every authority and production flag remains false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`;

const phase345New = `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 345: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
                <p>Review the v3.8.4 controlled draft packet before any later authorization posture while every authority and production flag remains false.</p>
              </div>
              <div class="percent">100%</div>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 346: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
                <p>Route the v3.8.5 draft-review packet to founder decision, hold, return, or block while every authority and production flag remains false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`;
replaceOnce("build-status.html", phase345Old, phase345New);

replaceAll("build-status.html", [
  ["<div class=\"version-row\"><span>Release</span><strong>v3.8.4 Controlled Permission Execution Authorization Draft Gate Re-entry</strong></div>", "<div class=\"version-row\"><span>Release</span><strong>v3.8.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong></div>"],
  ["<div class=\"version-row\"><span>Previous</span><strong>v3.8.3 Founder Permission Execution Authorization Decision Gate Re-entry</strong></div>", "<div class=\"version-row\"><span>Previous</span><strong>v3.8.4 Controlled Permission Execution Authorization Draft Gate Re-entry</strong></div>"],
  ["<div class=\"version-row\"><span>Goal</span><strong>Prepare controlled draft-review candidate language from the v3.8.3 founder posture packet without granting permission, approving authorization, or enabling execution.</strong></div>", "<div class=\"version-row\"><span>Goal</span><strong>Review the v3.8.4 controlled draft packet and prepare one review-decision candidate without granting permission, approving authorization, or enabling execution.</strong></div>"],
  ["<div class=\"version-row\"><span>Status</span><strong>Ready for controlled draft review gate re-entry</strong></div>", "<div class=\"version-row\"><span>Status</span><strong>Ready for controlled review decision gate re-entry</strong></div>"],
  ["<li><span class=\"dot\"></span><span>Receive the v3.8.4 controlled draft packet without granting authorization or execution.</span></li>", "<li><span class=\"dot\"></span><span>Receive the v3.8.5 draft-review packet without granting authorization or execution.</span></li>"],
  ["<li><span class=\"dot\"></span><span>Re-enter the controlled permission execution authorization draft review gate.</span></li>\n              <li><span class=\"dot\"></span><span>Receive the v3.8.4 controlled draft packet without granting authorization or execution.</span></li>\n              <li><span class=\"dot\"></span><span>Preserve source identity, founder posture id, questions, route, and authority audit.</span></li>\n              <li><span class=\"dot\"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>", "<li><span class=\"dot\"></span><span>Re-enter the controlled permission execution authorization review decision gate.</span></li>\n              <li><span class=\"dot\"></span><span>Receive the v3.8.5 draft-review packet without granting authorization or execution.</span></li>\n              <li><span class=\"dot\"></span><span>Route only to founder decision, hold, return, or block.</span></li>\n              <li><span class=\"dot\"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>"]
]);

const readmeEntry = `## v3.8.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry

- Re-enters the controlled draft review gate from the v3.8.4 controlled draft packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit.
- Produces only controlled review-decision candidate language while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.
- Refines the draft-review UI into a calmer review desk with current v3.8.4 input language, smaller type rhythm, softer relay surfaces, and the v3.8.5 command-shell badge.
- Updates [Controlled Permission Execution Authorization Draft Review Gate](controlledpermissionexecutionauthorizationdraftreviewgate.html), [Controlled Permission Execution Authorization Draft Review Gate Data](data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json), and [Controlled Permission Execution Authorization Draft Review Gate Notes](docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_REVIEW_GATE.md).

`;
replaceOnce("README.md", "## v3.8.4 Controlled Permission Execution Authorization Draft Gate Re-entry", `${readmeEntry}## v3.8.4 Controlled Permission Execution Authorization Draft Gate Re-entry`);

const protoEntry = `## v3.8.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry

- Re-enters the controlled draft review gate from the v3.8.4 controlled draft packet.
- Preserves founder posture id, source identity, route, questions, and authority audit before review-decision candidate readiness.
- Adds calmer draft-review polish: current v3.8.4 incoming packet, one review-decision candidate, tighter review-desk copy, current command-shell badge, and no authority opening.
- Keeps permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.

`;
replaceOnce("docs/PROTOTYPE_NOTES.md", "## v3.8.4 Controlled Permission Execution Authorization Draft Gate Re-entry", `${protoEntry}## v3.8.4 Controlled Permission Execution Authorization Draft Gate Re-entry`);

write("docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_REVIEW_GATE.md", `# Controlled Permission Execution Authorization Draft Review Gate Re-entry

Controlled Permission Execution Authorization Draft Review Gate Re-entry accepts the v3.8.4 controlled draft packet and turns it into controlled review-decision candidate language only.

## What This Release Does

- Requires schema \`controlled-permission-execution-authorization-draft-gate-v6\`.
- Requires release \`v3.8.4\`.
- Requires next gate \`Controlled permission execution authorization draft review gate re-entry\`.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, and authority flag audit.
- Emits \`controlled_permission_execution_authorization_draft_review_ready\`, \`permission_execution_authorization_draft_review_recorded\`, and \`founder_permission_execution_authorization_review_decision_candidate_ready\` as true only after all checks pass.
- Keeps permission, authorization, execution, storage, canonical, public release, and production flags false.

## v3.8.5 Re-entry

- Receives the v3.8.4 controlled draft packet produced from the v3.8.3 founder posture.
- Blocks older draft packets, unsafe review language, changed source ids, changed questions, changed authority audit, or any true authority flag.
- Produces only a controlled review-decision candidate; it does not grant permission, approve authorization, or enable execution.
- Keeps the draft-review room visually calmer: current incoming draft, verified identity, outgoing review-decision candidate, and smaller command-shell rhythm.

## Previous Re-entry

The v3.7.7 re-entry accepted the v3.7.6 controlled draft packet. v3.8.5 advances the same gate pattern to the current v3.8.4 draft packet without opening authority.

## Boundary

This is not permission grant, authorization approval, execution, storage write, canonical update, public release, or production launch.

## Next Gate

Controlled Permission Execution Authorization Review Decision Gate Re-entry.
`);


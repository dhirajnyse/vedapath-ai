import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const paths = {
  reviewData: path.join(root, "data", "vedapath-controlled-permission-execution-authorization-review-decision-gate.json"),
  founderData: path.join(root, "data", "vedapath-founder-permission-execution-authorization-decision-gate.json"),
  founderPage: path.join(root, "founderpermissionexecutionauthorizationdecisiongate.html"),
  founderJs: path.join(root, "assets", "vedapath-founder-permission-execution-authorization-decision-gate.js"),
  founderCss: path.join(root, "assets", "vedapath-founder-permission-execution-authorization-decision-gate.css"),
  commandShellJs: path.join(root, "assets", "vedapath-command-shell.js"),
  buildStatus: path.join(root, "build-status.html"),
  founderDoc: path.join(root, "docs", "FOUNDER_PERMISSION_EXECUTION_AUTHORIZATION_DECISION_GATE.md"),
  blueprint: path.join(root, "docs", "PRODUCT_BLUEPRINT.md"),
  prototypeNotes: path.join(root, "docs", "PROTOTYPE_NOTES.md"),
  readme: path.join(root, "README.md")
};

const release = "v3.9.1";
const releaseName = "Founder Permission Execution Authorization Decision Gate Re-entry";
const releaseFull = `${release} ${releaseName}`;
const previousRelease = "v3.9.0";
const previousReleaseName = "Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const previousReleaseFull = `${previousRelease} ${previousReleaseName}`;
const nextRelease = "Controlled Permission Execution Authorization Draft Gate Re-entry";
const generatedAt = "2026-07-04";
const createdAt = "2026-07-04T00:00:00.000Z";

const trueReviewFlags = [
  "controlled_permission_execution_authorization_draft_review_ready",
  "permission_execution_authorization_draft_review_recorded",
  "founder_permission_execution_authorization_review_decision_candidate_ready",
  "review_decision_ready",
  "review_decision_recorded",
  "controlled_permission_execution_authorization_review_decision_ready",
  "founder_permission_execution_authorization_decision_candidate_ready"
];

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

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function write(filePath, content) {
  fs.writeFileSync(filePath, content);
}

function readJson(filePath) {
  return JSON.parse(read(filePath));
}

function writeJson(filePath, data) {
  write(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function replaceRequired(content, search, replacement, label) {
  if (search instanceof RegExp) {
    if (!search.test(content)) {
      throw new Error(`Missing pattern for ${label}`);
    }
    return content.replace(search, replacement);
  }
  if (!content.includes(search)) {
    throw new Error(`Missing text for ${label}`);
  }
  return content.replace(search, replacement);
}

function replaceOrVerify(content, search, replacement, verify, label) {
  const hasVerify = verify instanceof RegExp ? verify.test(content) : content.includes(verify);
  if (search instanceof RegExp) {
    if (search.test(content)) return content.replace(search, replacement);
    if (hasVerify) return content;
    throw new Error(`Missing pattern for ${label}`);
  }
  if (content.includes(search)) return content.replace(search, replacement);
  if (hasVerify) return content;
  throw new Error(`Missing text for ${label}`);
}

function replaceEvery(content, search, replacement) {
  return content.split(search).join(replacement);
}

function flagObject(value) {
  return falseAuthorityFlags.reduce((flags, key) => {
    flags[key] = value;
    return flags;
  }, {});
}

function trueFlagObject(keys) {
  return keys.reduce((flags, key) => {
    flags[key] = true;
    return flags;
  }, {});
}

function falseFlagSentence() {
  return falseAuthorityFlags.map((flag) => `${flag} remains false`).join("; ");
}

const reviewData = readJson(paths.reviewData);
const reviewSource = reviewData.source || {};
const reviewSample = reviewData.sample_decision || {};

const sampleReviewDecisionPacket = {
  ...reviewSample,
  schema_version: reviewData.schema_version,
  release: previousRelease,
  input_release: reviewData.input_release || "v3.8.9",
  generated_at: reviewData.generated_at || generatedAt,
  created_at: createdAt,
  decision_status: "Ready for founder decision; no authority granted.",
  review_decision_outcome: "Ready",
  next_gate_required: "Founder permission execution authorization decision gate re-entry",
  decision_preserves_question_handoff: true,
  decision_preserves_source_identity: true,
  decision_preserves_authority_flag_audit: true,
  decision_preserves_review_ready_flags: true,
  decision_preserves_false_authority_flags: true,
  preserves_review_route: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  preserves_source_identity: true,
  ...trueFlagObject(trueReviewFlags),
  ...flagObject(false)
};

const source = {
  ...reviewSource,
  review_decision_release: previousRelease,
  review_decision_schema: reviewData.schema_version,
  founder_permission_execution_authorization_decision_gate_id:
    reviewSource.founder_permission_execution_authorization_decision_gate_id ||
    "founder-permission-execution-authorization-decision-gate-reentry",
  controlled_permission_execution_authorization_draft_gate_id:
    reviewSource.controlled_permission_execution_authorization_draft_gate_id ||
    "controlled-permission-execution-authorization-draft-gate-reentry"
};

const founderDecision = {
  founder_permission_execution_authorization_decision_id:
    "founder-permission-execution-authorization-decision-v391",
  release,
  input_release: previousRelease,
  decision_type: "Draft-only founder posture",
  decision_state: "Draft-only founder decision recorded",
  founder_decision_status: "Draft-only founder posture recorded; no authority granted.",
  decision_actor: "Founder",
  founder_name: "Founder sample",
  founder_selected_posture: "Draft-only",
  decision_scope:
    "A founder posture over the v3.9.0 review-decision packet. This may prepare a later draft candidate only; it grants no permission, authorization, execution, storage, publication, or production.",
  founder_decision_language:
    "I approve only the drafting of a controlled authorization candidate from the v3.9.0 review-decision packet. This is not permission, not execution, not storage approval, not public release, and not production authorization.",
  decision_rationale:
    "v3.9.0 review-decision packet preserves the question handoff, authority flag audit, source ids, and founder posture id. Route to the controlled draft gate as draft-only preparation, not a live authorization.",
  non_execution_decision_clause:
    `review_decision_ready may be true; review_decision_recorded may be true; founder_permission_execution_authorization_decision_candidate_ready may be true; founder_permission_execution_authorization_decision_ready may be true; founder_permission_execution_authorization_decision_recorded may be true; controlled_permission_execution_authorization_draft_candidate_ready may be true; ${falseFlagSentence()}.`,
  production_boundary:
    "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  founder_permission_execution_authorization_review_decision_candidate_ready: true,
  founder_permission_execution_authorization_decision_candidate_ready: true,
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true,
  controlled_permission_execution_authorization_draft_ready: false,
  controlled_permission_execution_authorization_draft_recorded: false,
  next_gate_required: "Controlled permission execution authorization draft gate re-entry",
  next_gate: "Controlled permission execution authorization draft gate re-entry",
  previous_gate: "Founder permission execution authorization decision gate re-entry",
  review_decision_gate_id: source.review_decision_gate_id,
  controlled_permission_execution_authorization_draft_review_gate_id:
    source.controlled_permission_execution_authorization_draft_review_gate_id,
  controlled_permission_execution_authorization_draft_gate_id:
    source.controlled_permission_execution_authorization_draft_gate_id,
  founder_decision_gate_id: source.founder_decision_gate_id,
  founder_permission_execution_authorization_decision_gate_id:
    source.founder_permission_execution_authorization_decision_gate_id,
  authorization_review_gate_id: source.authorization_review_gate_id,
  permission_execution_authorization_preflight_id:
    source.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: source.controlled_permission_execution_hold_id,
  source_answer_id: source.source_answer_id,
  source_record_id: source.source_record_id,
  source_passage_id: source.source_passage_id || "bhagavad-gita-2-48",
  source_phrase_id: source.source_phrase_id || "bg-2-48-yogastha-kuru",
  source_question_id: source.source_question_id || "q-calm-results-uncertain",
  source_family: source.source_family || "Bhagavad Gita | Smriti",
  source_reference: source.source_reference || "Bhagavad Gita 2.48",
  review_route: source.review_route,
  founder_question: source.founder_question,
  permission_question: source.permission_question,
  authority_flag_audit: source.authority_flag_audit,
  founder_question_id: source.founder_question_id,
  permission_execution_authorization_question_id: source.permission_execution_authorization_question_id,
  authorization_policy_route_id: source.authorization_policy_route_id,
  source_identity_fields: source.source_identity_fields || reviewSample.source_identity_fields,
  authority_flag_audit: source.authority_flag_audit || reviewSample.authority_flag_audit,
  sample_route_packet: source.sample_route_packet || reviewSample.sample_route_packet,
  sample_founder_question_handoff:
    source.sample_founder_question_handoff || reviewSample.sample_founder_question_handoff,
  sample_permission_execution_authorization_question_handoff:
    source.sample_permission_execution_authorization_question_handoff ||
    reviewSample.sample_permission_execution_authorization_question_handoff,
  ...trueFlagObject(trueReviewFlags),
  ...flagObject(false)
};

const founderData = {
  schema_version: "founder-permission-execution-authorization-decision-gate-v6",
  release,
  input_release: previousRelease,
  generated_at: generatedAt,
  title: "Founder Permission Execution Authorization Decision Gate",
  summary:
    "Receives the v3.9.0 controlled review-decision packet and lets a founder record only a draft posture. Permission, authorization, execution, storage, publication, and production stay false.",
  source,
  policies: {
    allowed_decision_postures: [
      "Draft-only",
      "Hold",
      "Return to review",
      "Reject"
    ],
    prohibited_postures: [
      "Grant permission",
      "Authorize execution",
      "Approve storage",
      "Publish publicly",
      "Move to production"
    ],
    next_gate_when_draft_only: "Controlled permission execution authorization draft gate re-entry",
    all_authority_flags_remain_false: falseAuthorityFlags
  },
  sample_review_decision_packet: sampleReviewDecisionPacket,
  sample_authorization_review_packet: sampleReviewDecisionPacket,
  sample_decision: founderDecision
};

writeJson(paths.founderData, founderData);

let founderJs = read(paths.founderJs);
founderJs = replaceEvery(founderJs, '"v3.8.6"', '"v3.9.0"');
founderJs = replaceEvery(founderJs, "v3.8.6", "v3.9.0");
write(paths.founderJs, founderJs);

let page = read(paths.founderPage);
page = replaceEvery(page, "v3.8.7 founder", "v3.9.1 founder");
page = replaceEvery(page, "v3.8.7", "v3.9.1");
page = replaceEvery(page, "v3.8.6", "v3.9.0");
page = replaceEvery(page, "Choose posture. Grant nothing.", "Record posture. Open no gate.");
const founderHeroOld =
  "This founder desk receives the v3.9.0 review-decision packet and records one posture only. It cannot grant permission, approve authorization, execute, store, publish, or launch.";
const founderHeroNew =
  "This founder desk receives the v3.9.0 review-decision packet and records one posture only. It can prepare a draft lane, but it cannot grant permission, approve authorization, execute, store, publish, or launch.";
if (page.includes(founderHeroOld)) {
  page = page.replace(founderHeroOld, founderHeroNew);
} else if (!page.includes(founderHeroNew)) {
  throw new Error("Missing founder page hero copy");
}

const founderPanelOld =
  "A draft-only outcome can prepare the next controlled draft gate from the v3.9.0 review-decision packet only. Hold, return, and reject stay first-class. Permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.";
const founderPanelNew =
  "A draft-only posture can prepare the next controlled draft gate from the v3.9.0 review-decision packet only. Hold, return, and reject stay first-class. Permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.";
if (page.includes(founderPanelOld)) {
  page = page.replace(founderPanelOld, founderPanelNew);
} else if (!page.includes(founderPanelNew)) {
  throw new Error("Missing founder panel intro");
}
write(paths.founderPage, page);

let css = read(paths.founderCss);
const cssAppend = `

/* VEDAPATH v3.9.1 FOUNDER DECISION RE-ENTRY */
body {
  background:
    linear-gradient(90deg, rgba(20, 92, 74, 0.035) 1px, transparent 1px),
    linear-gradient(0deg, rgba(20, 92, 74, 0.03) 1px, transparent 1px),
    #fffaf0;
  background-size: 18px 18px;
}

.command-main {
  background: rgba(255, 250, 240, 0.72);
}

.founder-decision-shell {
  grid-template-columns: minmax(180px, 0.42fr) minmax(0, 3fr) minmax(190px, 0.48fr);
  gap: 18px;
  padding-top: 20px;
}

.founder-decision-main,
.founder-decision-rail,
.founder-decision-side {
  border-color: rgba(91, 55, 36, 0.14);
  background: rgba(255, 253, 247, 0.9);
  box-shadow: 0 18px 42px rgba(69, 43, 26, 0.07);
}

.founder-decision-side {
  background: rgba(255, 253, 247, 0.78);
}

.founder-decision-rail {
  background: rgba(255, 253, 247, 0.82);
}

.founder-decision-hero {
  grid-template-columns: minmax(0, 1fr) 68px;
  gap: 22px;
  align-items: start;
}

.founder-decision-hero h1 {
  max-width: 760px;
  font-size: 2rem;
  line-height: 1.12;
  letter-spacing: 0;
}

.founder-decision-hero p {
  max-width: 900px;
  font-size: 0.98rem;
  line-height: 1.56;
  color: #5d483b;
}

.founder-decision-mark {
  width: 62px;
  height: 62px;
  padding: 8px;
  border-color: rgba(214, 90, 31, 0.2);
  background: rgba(255, 244, 224, 0.9);
  box-shadow: none;
}

.founder-decision-proof {
  margin-top: 20px;
  grid-template-columns: repeat(4, minmax(130px, 1fr));
  gap: 10px;
  padding: 12px;
  background: rgba(255, 252, 246, 0.84);
}

.founder-decision-proof div {
  min-height: 70px;
  padding: 10px 12px;
  border-color: rgba(91, 55, 36, 0.13);
  background: rgba(255, 253, 248, 0.86);
}

.founder-decision-proof span,
.founder-decision-form label,
.founder-decision-rail .eyebrow,
.founder-decision-side .eyebrow {
  font-size: 0.68rem;
  letter-spacing: 0;
}

.founder-decision-proof strong,
.founder-decision-form strong,
.founder-decision-rail strong {
  font-size: 0.92rem;
}

.founder-decision-form {
  margin-top: 18px;
  padding: 16px;
  background: rgba(255, 253, 247, 0.9);
}

.founder-decision-choice-grid {
  grid-template-columns: repeat(4, minmax(120px, 1fr));
  gap: 10px;
}

.founder-decision-choice {
  min-height: 78px;
  padding: 11px;
  border-color: rgba(91, 55, 36, 0.13);
  background: rgba(255, 253, 248, 0.9);
}

.founder-decision-choice.is-selected {
  border-color: rgba(214, 90, 31, 0.5);
  background: rgba(214, 90, 31, 0.08);
}

.founder-decision-choice p,
.founder-decision-form textarea,
.founder-decision-output,
.founder-decision-side p,
.founder-decision-rail p {
  font-size: 0.9rem;
  line-height: 1.5;
}

.founder-decision-output {
  min-height: 176px;
  max-height: 260px;
  background: rgba(255, 252, 246, 0.92);
}

.founder-decision-action {
  gap: 10px;
}

.founder-decision-action button {
  min-height: 40px;
  padding: 9px 13px;
  border-radius: 7px;
  font-size: 0.88rem;
}

.founder-decision-side .stat,
.founder-decision-side .step,
.founder-decision-rail .step {
  padding: 10px 11px;
  border-color: rgba(91, 55, 36, 0.13);
  background: rgba(255, 253, 248, 0.86);
}

.founder-decision-side h2,
.founder-decision-rail h2,
.founder-decision-form h2 {
  font-size: 1.2rem;
  line-height: 1.15;
  letter-spacing: 0;
}

@media (max-width: 1180px) {
  .founder-decision-shell {
    grid-template-columns: 1fr;
  }

  .founder-decision-side,
  .founder-decision-rail {
    max-height: none;
    overflow: visible;
  }
}

@media (max-width: 760px) {
  .founder-decision-hero,
  .founder-decision-proof,
  .founder-decision-choice-grid {
    grid-template-columns: 1fr;
  }

  .founder-decision-hero h1 {
    font-size: 1.65rem;
  }

  .founder-decision-mark {
    width: 58px;
    height: 58px;
  }
}
`;

if (!css.includes("VEDAPATH v3.9.1 FOUNDER DECISION RE-ENTRY")) {
  css += cssAppend;
}
write(paths.founderCss, css);

let commandShell = read(paths.commandShellJs);
if (commandShell.includes('const releaseBadge = "v3.9.0 decision";')) {
  commandShell = commandShell.replace(
    'const releaseBadge = "v3.9.0 decision";',
    'const releaseBadge = "v3.9.1 founder";'
  );
} else if (!commandShell.includes('const releaseBadge = "v3.9.1 founder";')) {
  throw new Error("Missing command shell badge");
}
write(paths.commandShellJs, commandShell);

let build = read(paths.buildStatus);
build = replaceOrVerify(
  build,
  '<span class="version">v3.9.0 decision</span>',
  '<span class="version">v3.9.1 founder</span>',
  '<span class="version">v3.9.1 founder</span>',
  "build version badge"
);
build = replaceOrVerify(
  build,
  /<strong>v3\.9\.0<\/strong>\s*<p>Controlled Permission Execution Authorization Review Decision Gate Re-entry: the decision gate now receives the v3\.8\.9 draft-review packet and routes only to founder decision, hold, return, or block while every authority flag stays false\.<\/p>/,
  `<strong>${release}</strong>
          <p>${releaseName}: the founder gate now receives the ${previousRelease} review-decision packet and records only a draft posture while permission, authorization, execution, storage, public release, and production stay false.</p>`,
  `${releaseName}: the founder gate now receives the ${previousRelease} review-decision packet`,
  "build current version card"
);
build = replaceOrVerify(
  build,
  "The trust chain now routes the v3.8.9 draft-review packet without turning route readiness into permission, authorization, execution, storage, public release, or production.",
  "The trust chain now routes the v3.9.0 review-decision packet into a founder posture gate while preserving question handoff, authority flag audit, source ids, and all false execution flags.",
  "The trust chain now routes the v3.9.0 review-decision packet into a founder posture gate",
  "build full vision copy"
);
build = replaceOrVerify(
  build,
  /<strong>Founder permission execution authorization decision gate re-entry<\/strong>\s*<p>Receive the v3\.9\.0 review-decision packet and record founder posture while every authority flag remains false\.<\/p>/,
  `<strong>${nextRelease}</strong>
          <p>Receive the ${release} founder posture packet and prepare draft-only controlled language while every authority flag remains false.</p>`,
  `Receive the ${release} founder posture packet and prepare draft-only controlled language`,
  "build next release card"
);
build = replaceOrVerify(
  build,
  /<article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 351: Founder Permission Execution Authorization Decision Gate Re-entry<\/strong>\s*<p>Receive the v3\.9\.0 review-decision packet and record founder posture while permission, authorization, execution, storage, public release, and production remain false\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
  `<article class="phase">
        <span class="badge done">Done</span>
        <div>
          <strong>Phase 351: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
          <p>Receives the ${previousRelease} review-decision packet and records founder posture while permission, authorization, execution, storage, public release, and production remain false.</p>
        </div>
        <div class="percent">100%</div>
      </article>
      <article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 352: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
          <p>Receive the ${release} founder posture packet and prepare draft-only controlled language while permission, authorization, execution, storage, public release, and production remain false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  "Phase 352: Controlled Permission Execution Authorization Draft Gate Re-entry",
  "build roadmap phase 351"
);
build = replaceOrVerify(
  build,
  /<div class="version-row"><span>Release<\/span><strong>v3\.9\.0 Controlled Permission Execution Authorization Review Decision Gate Re-entry<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v3\.8\.9 Controlled Permission Execution Authorization Draft Review Gate Re-entry<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>Ready for founder decision gate re-entry<\/strong><\/div>/,
  `<div class="version-row"><span>Release</span><strong>${releaseFull}</strong></div>
        <div class="version-row"><span>Previous</span><strong>${previousReleaseFull}</strong></div>
        <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
        <div class="version-row"><span>Goal</span><strong>Record a founder posture from the ${previousRelease} review-decision packet while every authority flag remains false.</strong></div>
        <div class="version-row"><span>Status</span><strong>Ready for controlled draft gate re-entry</strong></div>`,
  releaseFull,
  "build version notes"
);
build = replaceOrVerify(
  build,
  /<li><span class="dot"><\/span><span>Re-enter the founder permission execution authorization decision gate\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Receive the v3\.9\.0 review-decision packet without granting authorization or execution\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Record founder posture only: draft-only, hold, return, or reject\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep storage, canonical writes, public release, and production disabled\.<\/span><\/li>/,
  `<li><span class="dot"></span><span>Re-enter controlled permission execution authorization draft gate.</span></li>
              <li><span class="dot"></span><span>Receive the ${release} founder posture packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Prepare draft-only controlled language, not a live command.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  "Re-enter controlled permission execution authorization draft gate.",
  "build checklist"
);
write(paths.buildStatus, build);

const founderDoc = `# Founder Permission Execution Authorization Decision Gate

Release: ${releaseFull}

Input: ${previousReleaseFull}

## Purpose

This gate receives the controlled review-decision packet and lets the founder record one posture:

- Draft-only
- Hold
- Return to review
- Reject

It does not grant permission, authorization, execution, storage, canonical writes, public release, deployment, production, or external publication.

## Product Rule

The founder posture can prepare a later controlled draft candidate only. It is not a live authorization and it cannot execute any system action.

## Required Preserved Fields

- Question handoff from source to permission review.
- Source identity fields.
- Authority flag audit.
- Review-ready flags.
- Every false authority flag remains false.

## Next Gate

${nextRelease}
`;
write(paths.founderDoc, founderDoc);

let blueprint = read(paths.blueprint);
const blueprintSection = `## ${release} Founder Decision Gate

The founder decision gate now re-enters after the ${previousRelease} review-decision packet. It lets the founder record only a posture: Draft-only, Hold, Return, or Reject.

Design intent:

- Keep the page calm and compact.
- Make the central action easy to understand.
- Show that the founder is deciding posture, not granting authority.
- Route only to the controlled draft gate when draft-only is selected.
- Keep permission, authorization, execution, storage, public release, and production false.

Next release: ${nextRelease}.

`;
if (!blueprint.includes(`## ${release} Founder Decision Gate`)) {
  blueprint = replaceRequired(
    blueprint,
    `## ${previousRelease} Controlled Review Decision Gate`,
    `${blueprintSection}## ${previousRelease} Controlled Review Decision Gate`,
    "blueprint v391 section"
  );
}
write(paths.blueprint, blueprint);

let prototypeNotes = read(paths.prototypeNotes);
const prototypeSection = `## ${releaseFull}

This release re-enters the founder decision gate after the ${previousRelease} review-decision packet.

- Records only a founder posture.
- Keeps every real authority and execution flag false.
- Tightens the gate UI with calmer type, lighter cards, and a clearer proof strip.
- Sets the next release to ${nextRelease}.

`;
if (!prototypeNotes.includes(`## ${releaseFull}`)) {
  prototypeNotes = replaceRequired(
    prototypeNotes,
    `## ${previousReleaseFull}`,
    `${prototypeSection}## ${previousReleaseFull}`,
    "prototype notes v391 section"
  );
}
write(paths.prototypeNotes, prototypeNotes);

let readme = read(paths.readme);
const readmeSection = `## ${releaseFull}

VedaPath now re-enters the founder decision gate from the ${previousRelease} review-decision packet. The founder can record a draft-only, hold, return, or reject posture while every permission, authorization, execution, storage, public release, and production flag remains false.

Open:

- [Founder decision gate](./founderpermissionexecutionauthorizationdecisiongate.html)
- [Build status](./build-status.html)

`;
if (!readme.includes(`## ${releaseFull}`)) {
  readme = replaceRequired(
    readme,
    `## ${previousReleaseFull}`,
    `${readmeSection}## ${previousReleaseFull}`,
    "readme v391 section"
  );
}
write(paths.readme, readme);

console.log(`${releaseFull} applied.`);

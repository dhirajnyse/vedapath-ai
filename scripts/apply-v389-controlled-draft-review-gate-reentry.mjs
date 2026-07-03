import fs from "node:fs";

const release = "v3.8.9";
const inputRelease = "v3.8.8";
const founderInputRelease = "v3.8.7";
const releaseBadge = "v3.8.9 review";
const releaseName = "Controlled Permission Execution Authorization Draft Review Gate Re-entry";
const previousRelease = "v3.8.8 Controlled Permission Execution Authorization Draft Gate Re-entry";
const nextGate = "Controlled permission execution authorization review decision gate re-entry";
const nextRelease = "Controlled permission execution authorization review decision gate re-entry";
const nextReleaseVersion = "v3.9.0 Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const generatedAt = "2026-07-04";

const files = {
  draftGateData: "data/vedapath-controlled-permission-execution-authorization-draft-gate.json",
  reviewGateData: "data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json",
  reviewGateJs: "assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.js",
  reviewGateCss: "assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.css",
  reviewGateHtml: "controlledpermissionexecutionauthorizationdraftreviewgate.html",
  commandShellJs: "assets/vedapath-command-shell.js",
  buildStatus: "build-status.html",
  readme: "README.md",
  prototypeNotes: "docs/PROTOTYPE_NOTES.md",
  productBlueprint: "docs/PRODUCT_BLUEPRINT.md",
  gateDoc: "docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_REVIEW_GATE.md"
};

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

const draftPacketReadyFlags = [
  "founder_permission_execution_authorization_decision_ready",
  "founder_permission_execution_authorization_decision_recorded",
  "controlled_permission_execution_authorization_draft_candidate_ready",
  "controlled_permission_execution_authorization_draft_ready",
  "permission_execution_authorization_draft_recorded",
  "controlled_permission_execution_authorization_draft_review_candidate_ready"
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

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, text) {
  fs.writeFileSync(file, text.endsWith("\n") ? text : `${text}\n`);
}

function readJson(file) {
  return JSON.parse(read(file));
}

function writeJson(file, value) {
  write(file, JSON.stringify(value, null, 2));
}

function replaceRequired(text, search, replace, label) {
  if (!text.includes(search)) {
    throw new Error(`Missing ${label}: ${search.slice(0, 120)}`);
  }
  return text.replace(search, replace);
}

function replaceRegexRequired(text, pattern, replace, label) {
  if (!pattern.test(text)) {
    throw new Error(`Missing ${label}: ${pattern}`);
  }
  return text.replace(pattern, replace);
}

function insertBefore(text, marker, insertion, label) {
  if (text.includes(insertion.trim().split("\n")[0])) return text;
  if (!text.includes(marker)) throw new Error(`Missing marker for ${label}: ${marker}`);
  return text.replace(marker, `${insertion}\n${marker}`);
}

function falseFlagObject() {
  return Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));
}

function trueFlagObject() {
  return Object.fromEntries(draftPacketReadyFlags.map((flag) => [flag, true]));
}

function pickSource(source) {
  return Object.fromEntries(sourceIdentityFields.map((key) => [key, source[key]]));
}

const draftGate = readJson(files.draftGateData);
const previousReviewGate = readJson(files.reviewGateData);
const source = draftGate.source;
const draft = draftGate.sample_draft;

const sourcePacket = {
  ...pickSource(source),
  review_route: source.review_route,
  founder_question: source.founder_question,
  permission_question: source.permission_question,
  authority_flag_audit: source.authority_flag_audit
};

const sampleDraftPacket = {
  schema_version: draftGate.schema_version,
  release: inputRelease,
  draft_status: "Controlled draft review candidate prepared; execution remains false.",
  ...sourcePacket,
  ...trueFlagObject(),
  ...falseFlagObject(),
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
  created_at: `${generatedAt}T00:00:00.000Z`
};

const sampleReview = {
  ...previousReviewGate.sample_review,
  review_state: "Draft review ready for founder decision",
  review_actor: "Controlled draft review gate",
  reviewer_name: "Draft review sample",
  ...sourcePacket,
  review_scope: `Review the ${inputRelease} controlled permission execution authorization draft candidate for clarity, source identity preservation, founder posture id preservation, question handoff integrity, and boundary strength. This review is not permission grant, not authorization approval, not execution, and cannot promote, store, change canonical records, migrate, create accounts, use secrets, publish public release, or launch production.`,
  review_language: `Review result: the ${inputRelease} controlled draft candidate can move only to the controlled permission execution authorization review decision gate re-entry. Permission grant remains closed, authorization approval remains closed, execution remains closed, and no system may run from this review.`,
  review_notes: `The question handoff and source identity stay intact: founder posture id, review decision id, draft review id, draft gate id, review route, founder question, permission question, source ids, and authority flag audit match the ${inputRelease} controlled draft packet.`,
  review_evidence_summary: `The ${inputRelease} controlled draft packet exposes the ${founderInputRelease} founder posture id, review decision id, draft review id, draft gate id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, authority flag audit, rollback, monitoring, stop condition, expiry, and production boundary before review-decision readiness.`,
  non_execution_review_clause: `Controlled permission execution authorization draft review gate re-entry only; controlled_permission_execution_authorization_draft_review_ready may be true, permission_execution_authorization_draft_review_recorded may be true, and founder_permission_execution_authorization_review_decision_candidate_ready may be true, but ${falseAuthorityFlags.map((flag) => `${flag} remains false`).join(", ")}.`,
  risk_review: `Risk remains: ${inputRelease} controlled draft mismatch, ${founderInputRelease} founder posture id mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous review language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.`,
  rollback_review: `Rollback review passes only when before_hash, ${inputRelease} draft audit, ${founderInputRelease} founder posture audit, draft-review audit, question handoff audit, source identity audit, and failure review remain visible and no source state is written.`,
  monitoring_review: `Monitoring review keeps audit receipt, stop condition, failure review, reviewer handoff, ${founderInputRelease} founder posture id, source identity, authority flag audit, and before-write check visible before any controlled review decision gate.`,
  stop_condition: `Stop if the ${inputRelease} draft gate id mismatches, ${founderInputRelease} founder posture id mismatches, review decision id mismatches, draft review gate id mismatches, review route mismatches, founder question mismatches, permission question mismatches, authority flag audit mismatches, founder decision id mismatches, authorization review id mismatches, preflight id mismatches, hold id mismatches, source ids mismatch, rights change, review language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.`,
  expiry_check: `Controlled permission execution authorization draft review gate re-entry expires at the next material ${inputRelease} controlled draft, ${founderInputRelease} founder posture, review decision, draft, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.`,
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  clarification_question: `Which exact ${inputRelease} controlled draft packet should this review carry forward, and which single authority boundary should remain most visible?`,
  return_reason: `Return if the ${inputRelease} controlled draft packet loses route, question, audit, founder posture id, or source identity clarity.`,
  hold_reason: `Hold until the reviewer can see the exact ${inputRelease} controlled draft packet, source ids, route, questions, founder posture id, and authority audit.`,
  block_reason: `Block if any authority flag becomes true or the ${inputRelease} handoff is changed.`,
  controlled_permission_execution_authorization_draft_review_ready: true,
  permission_execution_authorization_draft_review_recorded: true,
  founder_permission_execution_authorization_review_decision_candidate_ready: true,
  ...falseFlagObject(),
  next_gate_required: nextGate,
  draft_gate_release: inputRelease,
  draft_gate_schema: draftGate.schema_version,
  next_gate: nextGate,
  created_at: `${generatedAt}T00:00:00.000Z`
};

const reviewGate = {
  ...previousReviewGate,
  schema_version: previousReviewGate.schema_version,
  release,
  generated_at: generatedAt,
  title: releaseName,
  summary: `Re-enters the controlled draft review gate from the ${inputRelease} controlled draft packet, verifies source identity, founder posture id, route, questions, and authority audit, and prepares only controlled review-decision candidate language while every permission, authorization, execution, storage, public release, and production path remains disabled.`,
  previous_release: previousRelease,
  source_release: previousRelease,
  next_gate: nextGate,
  source: {
    draft_gate_release: inputRelease,
    draft_gate_schema: draftGate.schema_version,
    ...sourcePacket
  },
  review_checks: [
    {
      check: "Input packet",
      rule: `Starts only from the ${inputRelease} controlled draft candidate output.`
    },
    {
      check: "Source identity",
      rule: "Preserves founder posture id, review decision id, draft review id, draft gate id, source ids, route, questions, and authority audit."
    },
    {
      check: "Review only",
      rule: "Can mark draft-review readiness, but cannot approve authorization or grant permission."
    },
    {
      check: "No operation",
      rule: "Execution, storage, canonical updates, migrations, accounts, secrets, public release, and production remain closed."
    },
    {
      check: "Review-decision next",
      rule: "Moves only to the controlled review-decision gate re-entry, never to a runnable path."
    },
    {
      check: "Expiry",
      rule: "Expires on draft, review, source, rights, rollback, monitoring, packet, or code change."
    }
  ],
  sample_draft_packet: sampleDraftPacket,
  sample_review: sampleReview,
  boundary: {
    controlled_permission_execution_authorization_draft_review_ready: false,
    permission_execution_authorization_draft_review_recorded: false,
    founder_permission_execution_authorization_review_decision_candidate_ready: false,
    ...falseFlagObject(),
    next_gate_required: nextGate
  },
  input_release: inputRelease
};

writeJson(files.reviewGateData, reviewGate);

let js = read(files.reviewGateJs);
js = js.split("v3.8.4").join(inputRelease);
js = js.split("v3.8.3").join(founderInputRelease);
write(files.reviewGateJs, js);

let html = read(files.reviewGateHtml);
html = html
  .split("Re-entry Re-entry Re-entry Re-entry").join("Re-entry")
  .split("v3.8.5 review").join(releaseBadge)
  .split("v3.8.4").join(inputRelease)
  .split("v3.8.3").join(founderInputRelease)
  .split("Review the draft. Decide nothing.").join("Review one draft. Keep authority closed.")
  .split("Controlled draft review desk").join("Quiet draft review desk")
  .split("Review calmly. Decide nothing yet.").join("Review the draft. Keep the door closed.")
  .split("VedaPath now reviews").join("VedaPath reviews")
  .split("A ready review creates one controlled review-decision candidate.").join("A ready review creates one controlled review-decision candidate only.")
  .split("<strong>v3.8.5</strong>").join(`<strong>${release}</strong>`);
write(files.reviewGateHtml, html);

let css = read(files.reviewGateCss);
const cssMarker = `/* VEDAPATH ${release} CONTROLLED DRAFT REVIEW GATE RE-ENTRY */`;
if (!css.includes(cssMarker)) {
  css += `

${cssMarker}
body.permission-execution-draft-review-page.vp-command-shell-ready main.workspace {
  grid-template-columns: minmax(176px, 0.44fr) minmax(0, 2.86fr) minmax(196px, 0.46fr);
  gap: 18px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-gate {
  padding: clamp(18px, 1.45vw, 26px);
  gap: 13px;
  border-color: rgba(20, 92, 74, 0.16);
  background:
    linear-gradient(180deg, rgba(255, 255, 253, 0.992), rgba(255, 253, 248, 0.972)),
    radial-gradient(circle at 100% 0%, rgba(224, 168, 59, 0.07), transparent 24%);
  box-shadow: 0 20px 48px rgba(45, 38, 28, 0.05);
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-gate h1 {
  max-width: 620px;
  font-size: clamp(22px, 1.06vw, 27px);
  line-height: 1.12;
  letter-spacing: 0;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-head {
  grid-template-columns: minmax(0, 1fr) 68px;
  min-height: 70px;
  align-items: center;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-head .muted {
  max-width: 760px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-mark {
  padding: 7px;
  border-radius: 10px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay > div,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-card,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-result,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-rule,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form {
  border-color: rgba(37, 66, 58, 0.14);
  background:
    linear-gradient(180deg, rgba(255, 255, 253, 0.99), rgba(255, 254, 250, 0.955)),
    linear-gradient(90deg, rgba(20, 92, 74, 0.018), transparent);
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step-grid,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-list,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-rules {
  gap: 8px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form {
  max-height: 550px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form h2,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-result h2 {
  font-size: 16px;
  line-height: 1.18;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-card strong,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-rule strong,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step strong,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay strong {
  font-size: 13px;
  line-height: 1.22;
  letter-spacing: 0;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-card span,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-rule span,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step span,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay span {
  font-size: 10.5px;
}
`;
}
write(files.reviewGateCss, css);

let commandShell = read(files.commandShellJs);
commandShell = replaceRequired(commandShell, 'const releaseBadge = "v3.8.8 draft";', `const releaseBadge = "${releaseBadge}";`, "command shell release badge");
write(files.commandShellJs, commandShell);

let build = read(files.buildStatus);
build = replaceRequired(build, '<span class="version">v3.8.8 draft</span>', `<span class="version">${releaseBadge}</span>`, "build badge");
build = replaceRegexRequired(
  build,
  /<strong>v3\.8\.8<\/strong>\s*<p>Controlled Permission Execution Authorization Draft Gate Re-entry: the draft gate now receives the v3\.8\.7 founder posture packet and prepares one draft-review candidate while every authority flag stays false\.<\/p>/,
  `<strong>${release}</strong>\n          <p>${releaseName}: the review gate now receives the ${inputRelease} controlled draft packet and prepares one review-decision candidate while every authority flag stays false.</p>`,
  "current release card"
);
build = replaceRequired(
  build,
  "The trust chain now carries the v3.8.7 founder posture into controlled draft language without turning readiness into permission, authorization, execution, storage, public release, or production.",
  `The trust chain now reviews the ${inputRelease} controlled draft packet without turning review readiness into permission, authorization, execution, storage, public release, or production.`,
  "full vision copy"
);
build = replaceRegexRequired(
  build,
  /<strong>Controlled permission execution authorization draft review gate re-entry<\/strong>\s*<p>Review the v3\.8\.8 controlled draft packet before any later authorization posture while every authority flag remains false\.<\/p>/,
  `<strong>${nextRelease}</strong>\n          <p>Route the ${release} draft-review packet to founder decision, hold, return, or block while every authority flag remains false.</p>`,
  "next release card"
);
build = replaceRegexRequired(
  build,
  /<article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 349: Controlled Permission Execution Authorization Draft Review Gate Re-entry<\/strong>\s*<p>Review the v3\.8\.8 controlled draft packet while permission, authorization, execution, storage, public release, and production remain false\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
  `<article class="phase">\n              <span class="badge done">Done</span>\n              <div>\n                <strong>Phase 349: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>\n                <p>Review the ${inputRelease} controlled draft packet into one review-decision candidate while permission, authorization, execution, storage, public release, and production remain false.</p>\n              </div>\n              <div class="percent">100%</div>\n            </article>\n            <article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 350: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>\n                <p>Route the ${release} draft-review packet to founder decision, hold, return, or block while permission, authorization, execution, storage, public release, and production remain false.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>`,
  "phase 349 roadmap"
);
build = replaceRequired(
  build,
  '<div class="version-row"><span>Release</span><strong>v3.8.8 Controlled Permission Execution Authorization Draft Gate Re-entry</strong></div>',
  `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>`,
  "version release row"
);
build = replaceRequired(
  build,
  '<div class="version-row"><span>Previous</span><strong>v3.8.7 Founder Permission Execution Authorization Decision Gate Re-entry</strong></div>',
  `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`,
  "version previous row"
);
build = replaceRequired(
  build,
  '<div class="version-row"><span>Goal</span><strong>Prepare controlled draft-review candidate language from the v3.8.7 founder posture packet without granting permission, approving authorization, or enabling execution.</strong></div>',
  `<div class="version-row"><span>Goal</span><strong>Review the ${inputRelease} controlled draft packet into one review-decision candidate without granting permission, approving authorization, or enabling execution.</strong></div>`,
  "version goal row"
);
build = replaceRequired(
  build,
  '<div class="version-row"><span>Status</span><strong>Ready for controlled draft review gate re-entry</strong></div>',
  '<div class="version-row"><span>Status</span><strong>Ready for controlled review decision gate re-entry</strong></div>',
  "version status row"
);
build = replaceRequired(
  build,
  '<li><span class="dot"></span><span>Re-enter the controlled permission execution authorization draft review gate.</span></li>\n              <li><span class="dot"></span><span>Receive the v3.8.8 controlled draft packet without granting authorization or execution.</span></li>\n              <li><span class="dot"></span><span>Preserve founder posture id, source ids, route, questions, and authority audit.</span></li>\n              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>',
  `<li><span class="dot"></span><span>Re-enter the controlled permission execution authorization review decision gate.</span></li>\n              <li><span class="dot"></span><span>Receive the ${release} draft-review packet without granting authorization or execution.</span></li>\n              <li><span class="dot"></span><span>Route only to founder decision, hold, return, or block.</span></li>\n              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  "next checklist"
);
write(files.buildStatus, build);

const releaseNote = `## ${release} ${releaseName}
- Re-enters the controlled draft-review gate from the ${inputRelease} controlled draft packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit.
- Produces only controlled review-decision candidate language while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.
- Softens the draft-review page into a quieter review desk with smaller headings, current ${inputRelease} input language, warmer source cards, and the ${releaseBadge} command-shell badge.
- Updates the build tracker, product blueprint, prototype notes, README, and draft-review gate contract for the next ${nextReleaseVersion}.
`;

let readme = read(files.readme);
readme = insertBefore(readme, "## v3.8.8 Controlled Permission Execution Authorization Draft Gate Re-entry", releaseNote, "README release note");
write(files.readme, readme);

let prototypeNotes = read(files.prototypeNotes);
prototypeNotes = insertBefore(prototypeNotes, "## v3.8.8 Controlled Permission Execution Authorization Draft Gate Re-entry", releaseNote, "prototype notes release note");
write(files.prototypeNotes, prototypeNotes);

let productBlueprint = read(files.productBlueprint);
const blueprintSection = `### 362. Controlled Permission Execution Authorization Draft Review Gate Re-entry

Controlled Permission Execution Authorization Draft Review Gate Re-entry should receive the ${inputRelease} controlled draft packet and prepare only controlled review-decision candidate language while every authority flag remains false.

- accept only the ${inputRelease} controlled draft packet
- preserve founder posture id, source ids, route, questions, and authority audit
- output draft-review readiness and review-decision candidate readiness only
- keep permission, authorization, execution, storage, canonical writes, public release, and production false
- move only to the controlled review decision gate re-entry
- present the page as a calm review desk with restrained type, clean cards, and no authority implication
`;
productBlueprint = insertBefore(productBlueprint, "## Strategic Difference", blueprintSection, "product blueprint section");
write(files.productBlueprint, productBlueprint);

const gateDoc = `# Controlled Permission Execution Authorization Draft Review Gate

## ${release} Re-entry

Controlled Permission Execution Authorization Draft Review Gate Re-entry receives the ${inputRelease} controlled draft packet and turns it into one controlled review-decision candidate.

This is review readiness only. It is not permission grant, authorization approval, execution, storage, canonical write, public release, or production.

## Input

- Schema: controlled-permission-execution-authorization-draft-gate-v6
- Release: ${inputRelease}
- Status: Controlled draft review candidate prepared; execution remains false.
- Required handoff: founder posture id, review decision id, draft review id, draft gate id, source ids, route, founder question, permission question, and authority flag audit.

## Output

- controlled_permission_execution_authorization_draft_review_ready=true
- permission_execution_authorization_draft_review_recorded=true
- founder_permission_execution_authorization_review_decision_candidate_ready=true
- permission_granted=false
- authorization_permission_granted=false
- permission_review_approved=false
- founder_permission_granted=false
- execution_packet_authorized=false
- execution_authorized=false
- execution_allowed=false
- storage_write_enabled=false
- canonical_write_allowed=false
- production_ready=false
- public_release_allowed=false

## Product Rule

The review page should feel like a quiet desk: one draft, one identity check, one boundary, one next review-decision candidate. It must never look or sound like a launch console.

## Next Gate

${nextReleaseVersion}
`;
write(files.gateDoc, gateDoc);

console.log(`${release} controlled draft review gate re-entry applied.`);

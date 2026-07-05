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

const release = "v3.9.9";
const releaseName = "Founder Permission Execution Authorization Decision Gate Re-entry";
const releaseFull = `${release} ${releaseName}`;
const previousRelease = "v3.9.8";
const previousReleaseName = "Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const previousReleaseFull = `${previousRelease} ${previousReleaseName}`;
const nextRelease = "v4.0.0 Controlled Permission Execution Authorization Draft Gate Re-entry";
const generatedAt = "2026-07-05";
const createdAt = "2026-07-05T00:00:00.000Z";

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
  "answer_changed",
  "retrieval_config_changed",
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
    if (!search.test(content)) throw new Error(`Missing pattern for ${label}`);
    return content.replace(search, replacement);
  }
  if (!content.includes(search)) throw new Error(`Missing text for ${label}`);
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

function trueFlagObject(keys) {
  return keys.reduce((flags, key) => {
    flags[key] = true;
    return flags;
  }, {});
}

function flagObject(value) {
  return falseAuthorityFlags.reduce((flags, key) => {
    flags[key] = value;
    return flags;
  }, {});
}

function falseFlagSentence() {
  return falseAuthorityFlags.map((flag) => `${flag} remains false`).join("; ");
}

const reviewData = readJson(paths.reviewData);
const currentFounderData = readJson(paths.founderData);
const reviewSource = reviewData.source || {};
const reviewSample = reviewData.sample_decision || {};

const sampleReviewDecisionPacket = {
  ...reviewSample,
  schema_version: reviewData.schema_version,
  release: previousRelease,
  input_release: reviewData.input_release || "v3.9.7",
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
  ...currentFounderData.sample_decision,
  founder_permission_execution_authorization_decision_id:
    "founder-permission-execution-authorization-decision-v399",
  release,
  input_release: previousRelease,
  decision_type: "Draft-only founder posture",
  decision_state: "Draft-only founder decision recorded",
  founder_decision_status: "Draft-only founder posture recorded; no authority granted.",
  decision_actor: "Founder",
  founder_name: "Founder sample",
  founder_selected_posture: "Draft-only",
  decision_scope:
    `A founder posture over the ${previousRelease} review-decision packet. This may prepare a later draft candidate only; it grants no permission, authorization, execution, storage, publication, or production.`,
  founder_decision_language:
    `I choose only draft preparation from the ${previousRelease} review-decision packet. This is not permission, not authorization approval, not execution, not storage approval, not public release, and not production authorization.`,
  decision_rationale:
    `${previousRelease} review-decision packet preserves the question handoff, authority flag audit, source ids, and founder posture id. Route to the controlled draft gate as draft-only preparation, not a live authorization.`,
  decision_evidence_summary:
    `${previousRelease} review-decision packet preserves the ready route, source identity, founder posture id, authority audit, questions, false authority flags, and production boundary.`,
  non_execution_decision_clause:
    `review_decision_ready may be true; review_decision_recorded may be true; founder_permission_execution_authorization_decision_candidate_ready may be true; founder_permission_execution_authorization_decision_ready may be true; founder_permission_execution_authorization_decision_recorded may be true; controlled_permission_execution_authorization_draft_candidate_ready may be true; ${falseFlagSentence()}.`,
  risk_acknowledgment:
    `Risk remains: ${previousRelease} review-decision packet mismatch, review decision id mismatch, source mismatch, route mismatch, question mismatch, authority flag audit mismatch, rights change, ambiguous decision language, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.`,
  rollback_condition:
    `Rollback if the ${previousRelease} review-decision packet, route, source identity, founder posture id, questions, audit, or non-execution boundary no longer match the incoming packet.`,
  monitoring_condition:
    `Monitor only the frozen ${previousRelease} review-decision packet, route, source identity, founder posture id, questions, authority audit, and false authority flags before preparing a controlled draft candidate.`,
  stop_condition:
    `Stop if the ${previousRelease} review-decision packet, review decision id, draft review id, draft gate id, founder posture id, review route, founder question, permission question, authority flag audit, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, storage, canonical, public release, or production flag is true.`,
  expiry_check:
    `Founder permission execution authorization decision gate re-entry expires at the next material ${previousRelease} review-decision packet, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.`,
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
  ...currentFounderData,
  schema_version: "founder-permission-execution-authorization-decision-gate-v7",
  release,
  input_release: previousRelease,
  generated_at: generatedAt,
  title: "Founder Permission Execution Authorization Decision Gate",
  summary:
    `Receives the ${previousRelease} controlled review-decision packet and lets a founder record only a draft posture. Permission, authorization, execution, storage, publication, and production stay false.`,
  source,
  policies: {
    ...(currentFounderData.policies || {}),
    next_gate_when_draft_only: "Controlled permission execution authorization draft gate re-entry",
    all_authority_flags_remain_false: falseAuthorityFlags
  },
  sample_review_decision_packet: sampleReviewDecisionPacket,
  sample_authorization_review_packet: sampleReviewDecisionPacket,
  sample_decision: founderDecision
};

writeJson(paths.founderData, founderData);

let founderJs = read(paths.founderJs);
if (!founderJs.includes('"answer_changed"')) {
  founderJs = founderJs.replace(
    '  "source_write_executed",\n  "actual_storage_write_executed",',
    '  "source_write_executed",\n  "answer_changed",\n  "retrieval_config_changed",\n  "actual_storage_write_executed",'
  );
}
if (!founderJs.includes("const reviewTextFields")) {
  founderJs = replaceRequired(
    founderJs,
    `  const handoffFields = [
    "review_route",
    "founder_question",
    "permission_question",
    "authority_flag_audit"
  ];
  const blockedWords`,
    `  const handoffFields = [
    "review_route",
    "founder_question",
    "permission_question",
    "authority_flag_audit"
  ];
  const reviewTextFields = [
    "decision_scope",
    "decision_language",
    "decision_rationale",
    "decision_evidence_summary",
    "non_execution_decision_clause",
    "risk_acknowledgment",
    "rollback_condition",
    "monitoring_condition",
    "stop_condition",
    "expiry_check",
    "production_boundary",
    "return_reason",
    "hold_reason",
    "block_reason"
  ];
  const blockedWords`,
    "review text field guard"
  );
}
if (!founderJs.includes("function noUnsafeReviewPacketText")) {
  founderJs = replaceRequired(
    founderJs,
    `  function matchesSourceIdentity(packet, decision) {`,
    `  function noUnsafeReviewPacketText(packet) {
    return reviewTextFields.every((field) => !hasUnsafeAuthority(packet && packet[field]));
  }

  function matchesSourceIdentity(packet, decision) {`,
    "review unsafe text guard"
  );
}
founderJs = replaceOrVerify(
  founderJs,
  `      keepsQuestionHandoff(packet) &&
      keepsAuthorityFlagAudit(packet.authority_flag_audit)
    );`,
  `      keepsQuestionHandoff(packet) &&
      keepsAuthorityFlagAudit(packet.authority_flag_audit) &&
      noUnsafeReviewPacketText(packet)
    );`,
  "noUnsafeReviewPacketText(packet)",
  "review packet unsafe text condition"
);
founderJs = replaceEvery(founderJs, "controlled-permission-execution-authorization-review-decision-gate-v6", reviewData.schema_version);
founderJs = replaceEvery(founderJs, `"v3.9.4"`, `"${previousRelease}"`);
founderJs = replaceEvery(founderJs, "v3.9.4", previousRelease);
founderJs = replaceEvery(founderJs, "v3.9.5", release);
founderJs = replaceEvery(founderJs, "the v3.9.8 route", `the ${previousRelease} route`);
write(paths.founderJs, founderJs);

let page = read(paths.founderPage);
page = replaceEvery(page, "v3.9.5 founder", "v3.9.9 founder");
page = replaceEvery(page, "v3.9.5", release);
page = replaceEvery(page, "v3.9.4", previousRelease);
page = replaceEvery(page, "Choose posture. Grant nothing.", "Founder posture. Nothing opens.");
page = replaceEvery(
  page,
  `This founder desk receives the ${previousRelease} review-decision packet and records one posture only. It can prepare a draft lane, but it cannot grant permission, approve authorization, execute, store, publish, or launch.`,
  `This founder desk receives the ${previousRelease} review-decision packet and records one posture only. Draft-only prepares a later draft candidate; hold, return, and reject remain clean stops.`
);
page = replaceEvery(
  page,
  `This founder desk receives the ${previousRelease} review-decision packet and records one posture only. A draft-only posture prepares a later draft candidate; hold, return, and reject remain clean stops.`,
  `This founder desk receives the ${previousRelease} review-decision packet and records one posture only. Draft-only prepares a later draft candidate; hold, return, and reject remain clean stops.`
);
page = replaceEvery(
  page,
  `A draft-only posture can prepare the next controlled draft gate from the ${previousRelease} review-decision packet only. Hold, return, and reject stay first-class. Permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.`,
  `The founder can choose Draft-only, Hold, Return, or Reject from the ${previousRelease} review-decision packet. The page records posture only: no permission grant, no authorization approval, no execution, no answer change, no retrieval change, no storage, no public release, no production.`
);
page = replaceEvery(
  page,
  `The founder can choose Draft-only, Hold, Return, or Reject from the ${previousRelease} review-decision packet. The page records posture only: no permission grant, no authorization approval, no execution, no storage, no public release, no production.`,
  `The founder can choose Draft-only, Hold, Return, or Reject from the ${previousRelease} review-decision packet. The page records posture only: no permission grant, no authorization approval, no execution, no answer change, no retrieval change, no storage, no public release, no production.`
);
page = replaceEvery(page, "v3.9.8 review decision", `${previousRelease} review decision`);
write(paths.founderPage, page);

let css = read(paths.founderCss);
const cssAppend = `

/* VEDAPATH v3.9.9 FOUNDER POSTURE RE-ENTRY */
body.permission-execution-decision-page {
  --founder-ivory: rgba(255, 253, 248, 0.96);
  --founder-warm: rgba(255, 247, 237, 0.88);
  --founder-green-line: rgba(20, 92, 74, 0.16);
}

body.vp-command-shell-ready.permission-execution-decision-page main.workspace {
  grid-template-columns: minmax(188px, 0.46fr) minmax(0, 2.55fr) minmax(202px, 0.52fr);
  gap: 18px;
}

body.permission-execution-decision-page .founder-decision {
  border-color: var(--founder-green-line);
  background:
    radial-gradient(circle at 92% 6%, rgba(20, 92, 74, 0.07), transparent 24%),
    linear-gradient(180deg, var(--founder-ivory), var(--founder-warm));
}

body.permission-execution-decision-page .founder-decision .founder-decision-head {
  grid-template-columns: minmax(0, 1fr) 78px;
  min-height: 92px;
}

body.permission-execution-decision-page .founder-decision .founder-decision-head h1 {
  max-width: 780px;
  font-size: clamp(1.72rem, 1.55vw, 2.18rem);
  line-height: 1.1;
}

body.permission-execution-decision-page .founder-decision .muted,
body.permission-execution-decision-page .founder-decision-form label,
body.permission-execution-decision-page .founder-decision-output p,
body.permission-execution-decision-page .founder-decision-card span {
  color: rgba(91, 70, 56, 0.84);
}

body.permission-execution-decision-page .founder-decision-choice-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

body.permission-execution-decision-page .founder-decision-choice,
body.permission-execution-decision-page .founder-decision-meridian article,
body.permission-execution-decision-page .founder-decision-form,
body.permission-execution-decision-page .founder-decision-output,
body.permission-execution-decision-page .founder-decision-card {
  background: rgba(255, 252, 247, 0.84);
  border-color: rgba(86, 99, 80, 0.15);
  box-shadow: 0 14px 38px rgba(42, 38, 28, 0.045);
}

body.permission-execution-decision-page .founder-decision-choice[aria-pressed="true"] {
  background: linear-gradient(180deg, rgba(255, 241, 232, 0.92), rgba(255, 252, 246, 0.88));
  border-color: rgba(214, 90, 31, 0.42);
}

body.permission-execution-decision-page .founder-decision-meridian {
  align-items: stretch;
}

body.permission-execution-decision-page .founder-decision-choice strong,
body.permission-execution-decision-page .founder-decision-meridian strong,
body.permission-execution-decision-page .founder-decision-card strong {
  font-size: 0.94rem;
  line-height: 1.25;
}

body.permission-execution-decision-page .founder-decision-choice p,
body.permission-execution-decision-page .founder-decision-meridian p,
body.permission-execution-decision-page .founder-decision-form input,
body.permission-execution-decision-page .founder-decision-form select,
body.permission-execution-decision-page .founder-decision-form textarea {
  font-size: 0.88rem;
}

body.permission-execution-decision-page .founder-decision-form {
  max-height: 570px;
}

body.permission-execution-decision-page .founder-decision-mark {
  border-radius: 0.85rem;
  background: linear-gradient(145deg, rgba(255, 247, 234, 0.92), rgba(244, 230, 207, 0.44));
}

@media (max-width: 1280px) {
  body.permission-execution-decision-page .founder-decision-choice-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`;
if (!css.includes("VEDAPATH v3.9.9 FOUNDER POSTURE RE-ENTRY")) {
  css += cssAppend;
}
write(paths.founderCss, css);

let commandShell = read(paths.commandShellJs);
commandShell = replaceOrVerify(
  commandShell,
  'const releaseBadge = "v3.9.8 decision";',
  'const releaseBadge = "v3.9.9 founder";',
  'const releaseBadge = "v3.9.9 founder";',
  "command shell badge"
);
write(paths.commandShellJs, commandShell);

let build = read(paths.buildStatus);
build = replaceOrVerify(
  build,
  '<span class="version">v3.9.8 decision</span>',
  '<span class="version">v3.9.9 founder</span>',
  '<span class="version">v3.9.9 founder</span>',
  "build version badge"
);
build = replaceOrVerify(
  build,
  /<strong>v3\.9\.8<\/strong>\s*<p>Controlled Permission Execution Authorization Review Decision Gate Re-entry:[\s\S]*?<\/p>/,
  `<strong>${release}</strong>
          <p>${releaseName}: the founder gate receives the ${previousRelease} review-decision packet and records only founder posture while permission, authorization, execution, storage, public release, and production stay false.</p>`,
  `${releaseName}: the founder gate receives the ${previousRelease} review-decision packet`,
  "build current version card"
);
build = replaceOrVerify(
  build,
  "The trust chain now routes the v3.9.7 draft-review packet as one calm handoff while preserving question handoff, source identity, founder posture id, authority flag audit, and all false execution flags.",
  `The trust chain now records founder posture from the ${previousRelease} review-decision packet while preserving question handoff, source identity, authority flag audit, and all false execution flags.`,
  `The trust chain now records founder posture from the ${previousRelease} review-decision packet`,
  "build full vision copy"
);
build = replaceOrVerify(
  build,
  /<strong>Founder Permission Execution Authorization Decision Gate Re-entry<\/strong>\s*<p>Receive the v3\.9\.8 review-decision packet and record founder posture while every authority flag remains false\.<\/p>/,
  `<strong>${nextRelease}</strong>
          <p>Receive the ${release} founder posture packet and prepare draft-only controlled language while every authority flag remains false.</p>`,
  `Receive the ${release} founder posture packet and prepare draft-only controlled language`,
  "build next release card"
);
build = replaceOrVerify(
  build,
  /<article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 359: Founder Permission Execution Authorization Decision Gate Re-entry<\/strong>\s*<p>Receive the v3\.9\.8 review-decision packet and record founder posture while every authority flag remains false\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
  `<article class="phase">
        <span class="badge done">Done</span>
        <div>
          <strong>Phase 359: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
          <p>Receives the ${previousRelease} review-decision packet and records founder posture while permission, authorization, execution, storage, public release, and production remain false.</p>
        </div>
        <div class="percent">100%</div>
      </article>
      <article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 360: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
          <p>Receive the ${release} founder posture packet and prepare draft-only controlled language while every authority flag remains false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  "Phase 360: Controlled Permission Execution Authorization Draft Gate Re-entry",
  "build roadmap phase"
);
build = replaceOrVerify(
  build,
  /<div class="version-row"><span>Release<\/span><strong>v3\.9\.8 Controlled Permission Execution Authorization Review Decision Gate Re-entry<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v3\.9\.7 Controlled Permission Execution Authorization Draft Review Gate Re-entry<\/strong><\/div>\s*<div class="version-row"><span>Commit<\/span><strong>See GitHub history<\/strong><\/div>\s*<div class="version-row"><span>Goal<\/span><strong>[\s\S]*?<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>Ready for founder decision gate re-entry<\/strong><\/div>/,
  `<div class="version-row"><span>Release</span><strong>${releaseFull}</strong></div>
        <div class="version-row"><span>Previous</span><strong>${previousReleaseFull}</strong></div>
        <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
        <div class="version-row"><span>Goal</span><strong>Record founder posture from the ${previousRelease} review-decision packet while every authority flag remains false.</strong></div>
        <div class="version-row"><span>Status</span><strong>Ready for controlled draft gate re-entry</strong></div>`,
  releaseFull,
  "build version notes"
);
build = replaceOrVerify(
  build,
  /<li><span class="dot"><\/span><span>Re-enter founder permission execution authorization decision gate\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Receive the v3\.9\.8 review-decision packet without granting authorization or execution\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Record founder posture only: draft-only, hold, return, or reject\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep storage, canonical writes, public release, and production disabled\.<\/span><\/li>/,
  `<li><span class="dot"></span><span>Re-enter controlled permission execution authorization draft gate.</span></li>
              <li><span class="dot"></span><span>Receive the ${release} founder posture packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Prepare draft-only controlled language, not a live command.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  `Receive the ${release} founder posture packet without granting authorization or execution.`,
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
- Make the incoming ${previousRelease} packet visible.
- Treat Hold, Return, and Reject as clean product outcomes.
- Let Draft-only prepare the next controlled draft gate without becoming permission.
- Keep permission, authorization, execution, storage, public release, and production false.

Next release: ${nextRelease}.

`;
if (!blueprint.includes(`## ${release} Founder Decision Gate`)) {
  blueprint = replaceRequired(
    blueprint,
    `## ${previousRelease} Controlled Review Decision Gate`,
    `${blueprintSection}## ${previousRelease} Controlled Review Decision Gate`,
    "blueprint v399 section"
  );
}
write(paths.blueprint, blueprint);

let prototypeNotes = read(paths.prototypeNotes);
const prototypeSection = `## ${releaseFull}

This release re-enters the founder decision gate after the ${previousRelease} review-decision packet.

- Records only a founder posture.
- Accepts Draft-only, Hold, Return, and Reject as visible states.
- Keeps every permission, authorization, execution, storage, public release, and production flag false.
- Sets the next release to ${nextRelease}.

`;
if (!prototypeNotes.includes(`## ${releaseFull}`)) {
  prototypeNotes = replaceRequired(
    prototypeNotes,
    `## ${previousReleaseFull}`,
    `${prototypeSection}## ${previousReleaseFull}`,
    "prototype notes v399 section"
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
    "readme v399 section"
  );
}
write(paths.readme, readme);

console.log(`${releaseFull} applied.`);

import fs from "node:fs";

const release = "v4.0.3";
const inputRelease = "v4.0.2";
const releaseBadge = "v4.0.3 founder";
const releaseName = "Founder Permission Execution Authorization Decision Gate Re-entry";
const previousRelease = "v4.0.2 Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const nextRelease = "v4.0.4 Controlled Permission Execution Authorization Draft Gate Re-entry";
const nextGate = "Controlled permission execution authorization draft gate re-entry";
const inputNextGate = "Founder permission execution authorization decision gate re-entry";
const generatedAt = "2026-07-05";

const dataFile = "data/vedapath-founder-permission-execution-authorization-decision-gate.json";
const reviewDataFile = "data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json";
const jsFile = "assets/vedapath-founder-permission-execution-authorization-decision-gate.js";
const cssFile = "assets/vedapath-founder-permission-execution-authorization-decision-gate.css";
const pageFile = "founderpermissionexecutionauthorizationdecisiongate.html";
const shellFile = "assets/vedapath-command-shell.js";
const buildFile = "build-status.html";
const readmeFile = "README.md";
const notesFile = "docs/PROTOTYPE_NOTES.md";
const blueprintFile = "docs/PRODUCT_BLUEPRINT.md";
const docFile = "docs/FOUNDER_PERMISSION_EXECUTION_AUTHORIZATION_DECISION_GATE.md";

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

const reviewReadyFlags = [
  "controlled_permission_execution_authorization_draft_review_ready",
  "permission_execution_authorization_draft_review_recorded",
  "founder_permission_execution_authorization_review_decision_candidate_ready",
  "review_decision_ready",
  "review_decision_recorded",
  "controlled_permission_execution_authorization_review_decision_ready",
  "founder_permission_execution_authorization_decision_candidate_ready"
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

const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, value) => fs.writeFileSync(file, value, "utf8");
const readJson = (file) => JSON.parse(read(file));
const writeJson = (file, value) => write(file, `${JSON.stringify(value, null, 2)}\n`);
const clone = (value) => JSON.parse(JSON.stringify(value));
const falseFlags = Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));
const trueReviewFlags = Object.fromEntries(reviewReadyFlags.map((flag) => [flag, true]));
const falseFlagSentence = falseAuthorityFlags.map((flag) => `${flag} remains false`).join(", ");

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function replaceRequired(text, from, to, label) {
  ensure(text.includes(from), `Missing ${label}: ${from.slice(0, 180)}`);
  return text.replace(from, to);
}

function replaceRegex(text, pattern, to, label) {
  ensure(pattern.test(text), `Missing ${label}`);
  return text.replace(pattern, to);
}

function appendIfMissing(file, marker, block) {
  const text = read(file);
  if (text.includes(marker)) return;
  write(file, `${text.trimEnd()}\n\n${block.trim()}\n`);
}

function prependSection(file, heading, body) {
  const text = read(file);
  if (text.includes(heading)) return;
  write(file, `${body.trim()}\n\n${text}`);
}

function copyFields(source, fields) {
  return Object.fromEntries(fields.map((field) => [field, source[field]]));
}

const reviewData = readJson(reviewDataFile);
const currentData = readJson(dataFile);
const reviewPacket = clone(reviewData.sample_decision);

ensure(reviewData.release === inputRelease, `Expected ${inputRelease} review-decision data.`);
ensure(reviewData.schema_version === "controlled-permission-execution-authorization-review-decision-gate-v8", "Expected v8 review-decision schema.");
ensure(reviewPacket.next_gate_required === inputNextGate, "Review decision sample does not point to founder gate.");
ensure(reviewPacket.founder_permission_execution_authorization_decision_candidate_ready === true, "Review packet is not ready for founder decision.");
falseAuthorityFlags.forEach((flag) => ensure(reviewPacket[flag] === false, `Review packet must keep ${flag}=false.`));

const source = {
  review_decision_release: inputRelease,
  review_decision_schema: reviewData.schema_version,
  founder_permission_execution_authorization_decision_release: release,
  founder_permission_execution_authorization_decision_schema: "founder-permission-execution-authorization-decision-gate-v8",
  ...copyFields(reviewData.source, sourceIdentityFields),
  ...copyFields(reviewData.source, handoffFields),
  answer_changed: false,
  retrieval_config_changed: false
};

const sampleReviewDecisionPacket = {
  ...reviewPacket,
  schema_version: reviewData.schema_version,
  release: inputRelease,
  input_release: reviewData.input_release,
  decision_status: "Ready for founder decision; no authority granted.",
  review_decision_outcome: "Ready",
  next_gate_required: inputNextGate,
  decision_preserves_question_handoff: true,
  decision_preserves_source_identity: true,
  decision_preserves_authority_flag_audit: true,
  decision_preserves_answer_boundary: true,
  decision_preserves_retrieval_boundary: true,
  preserves_review_route: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  preserves_source_identity: true,
  ...trueReviewFlags,
  ...falseFlags
};

const sampleDecision = {
  decision_state: "Draft-only founder decision recorded",
  decision_actor: "Founder",
  founder_name: "Founder sample",
  founder_selected_posture: "Draft-only",
  founder_permission_execution_authorization_decision_id:
    "founder-permission-execution-authorization-decision-v403",
  release,
  input_release: inputRelease,
  review_decision_release: inputRelease,
  review_decision_schema: reviewData.schema_version,
  decision_type: "Draft-only founder posture",
  founder_decision_status: "Draft-only founder posture recorded; no authority granted.",
  ...source,
  decision_scope:
    `A founder posture over the ${inputRelease} review-decision packet. Draft-only may prepare a later controlled draft candidate only; it grants no permission, authorization, answer change, retrieval change, execution, storage, publication, or production.`,
  founder_decision_language:
    `I choose only draft preparation from the ${inputRelease} review-decision packet. This is not permission, not authorization approval, not answer change, not retrieval change, not execution, not storage approval, not public release, and not production authorization.`,
  decision_rationale:
    `${inputRelease} review-decision packet preserves the question handoff, source identity, founder posture id, answer_changed=false, retrieval_config_changed=false, and authority flag audit. Route to the controlled draft gate as draft-only preparation, not a live authorization.`,
  decision_evidence_summary:
    `${inputRelease} review-decision packet preserves the ready route, source identity, founder posture id, questions, answer_changed=false, retrieval_config_changed=false, authority audit, false authority flags, and production boundary.`,
  non_execution_decision_clause:
    `review_decision_ready may be true; review_decision_recorded may be true; founder_permission_execution_authorization_decision_candidate_ready may be true; founder_permission_execution_authorization_decision_ready may be true; founder_permission_execution_authorization_decision_recorded may be true; controlled_permission_execution_authorization_draft_candidate_ready may be true; ${falseFlagSentence}.`,
  risk_acknowledgment:
    `Risk remains: ${inputRelease} review-decision packet mismatch, review decision id mismatch, source mismatch, route mismatch, question mismatch, answer state mismatch, retrieval state mismatch, authority flag audit mismatch, rights change, ambiguous decision language, packet mutation, code change, or any true permission, authorization, answer change, retrieval change, execution, storage, canonical, public release, or production flag must block movement.`,
  rollback_condition:
    `Rollback if the ${inputRelease} review-decision packet, route, source identity, founder posture id, questions, answer state, retrieval state, audit, or non-execution boundary no longer match the incoming packet.`,
  monitoring_condition:
    `Monitor only the frozen ${inputRelease} review-decision packet, route, source identity, founder posture id, questions, answer_changed=false, retrieval_config_changed=false, authority audit, and false authority flags before preparing a controlled draft candidate.`,
  stop_condition:
    `Stop if the ${inputRelease} review-decision packet, review decision id, draft review id, draft gate id, founder posture id, review route, founder question, permission question, authority flag audit, answer state, retrieval state, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, answer change, retrieval change, execution, storage, canonical, public release, or production flag is true.`,
  expiry_check:
    `Founder permission execution authorization decision gate re-entry expires at the next material ${inputRelease} review-decision packet, source, answer state, retrieval state, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, not answer change, not retrieval change, and not execution.`,
  production_boundary:
    "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  clarification_question:
    "Should this exact v4.0.2 review-decision packet move into draft-only controlled language, or should it be held, returned, or rejected?",
  return_reason:
    `Return if the ${inputRelease} review-decision packet loses source identity, answer boundary, retrieval boundary, question handoff, or authority audit clarity.`,
  hold_reason:
    `Hold until the founder can see the exact ${inputRelease} review-decision packet, source ids, route, questions, answer_changed=false, retrieval_config_changed=false, and authority audit.`,
  block_reason:
    `Block if any authority, answer-change, retrieval-change, storage, public release, or production flag becomes true or the ${inputRelease} handoff is changed.`,
  ...trueReviewFlags,
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true,
  controlled_permission_execution_authorization_draft_ready: false,
  controlled_permission_execution_authorization_draft_recorded: false,
  ...falseFlags,
  next_gate_required: nextGate,
  next_gate: nextGate,
  previous_gate: inputNextGate,
  created_at: `${generatedAt}T00:00:00.000Z`
};

const data = {
  ...currentData,
  schema_version: "founder-permission-execution-authorization-decision-gate-v8",
  release,
  input_release: inputRelease,
  generated_at: generatedAt,
  title: releaseName,
  summary:
    `Receives the ${inputRelease} controlled review-decision packet and lets a founder record only posture. Draft-only prepares a later controlled draft candidate; hold, return, and reject stop cleanly. Permission, authorization, answer changes, retrieval changes, execution, storage, publication, and production stay false.`,
  previous_release: previousRelease,
  source_release: previousRelease,
  next_gate: nextGate,
  source,
  decision_states: [
    "Draft decision",
    "Draft-only founder decision recorded",
    "Founder hold recorded",
    "Return to review decision",
    "Founder reject recorded",
    "Needs founder clarification",
    "Permission grant blocked",
    "Authorization approval blocked",
    "Execution blocked",
    "Production forbidden",
    "Decision expired"
  ],
  decision_checks: [
    { check: "Input packet", rule: `Starts only from the ${inputRelease} non-authorizing review-decision output.` },
    { check: "Founder posture only", rule: "Draft-only, hold, return, and reject are postures, not authority grants." },
    { check: "Identity continuity", rule: "Preserves review decision id, draft review id, draft gate id, founder posture id, authorization review id, preflight id, hold id, and source ids." },
    { check: "Answer and retrieval locks", rule: "Requires answer_changed=false and retrieval_config_changed=false in incoming and outgoing packets." },
    { check: "Forward limit", rule: "Draft-only may create only a controlled draft candidate; it cannot execute or write." },
    { check: "Authority boundary", rule: "Permission, authorization, answer changes, retrieval changes, execution, storage, canonical writes, public release, and production remain false." }
  ],
  policies: {
    ...(currentData.policies || {}),
    input_release_required: inputRelease,
    input_schema_required: reviewData.schema_version,
    next_gate_when_draft_only: nextGate,
    all_authority_flags_remain_false: falseAuthorityFlags
  },
  required_by_state: {
    ...(currentData.required_by_state || {}),
    "Draft-only founder decision recorded": [
      "decision_actor",
      "founder_name",
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
      "source_family",
      "review_route",
      "founder_question",
      "permission_question",
      "authority_flag_audit",
      "decision_scope",
      "founder_decision_language",
      "decision_rationale",
      "decision_evidence_summary",
      "non_execution_decision_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ]
  },
  sample_review_decision_packet: sampleReviewDecisionPacket,
  sample_authorization_review_packet: sampleReviewDecisionPacket,
  sample_decision: sampleDecision,
  boundary: {
    review_decision_ready: false,
    review_decision_recorded: false,
    founder_permission_execution_authorization_decision_candidate_ready: false,
    founder_permission_execution_authorization_decision_ready: false,
    founder_permission_execution_authorization_decision_recorded: false,
    controlled_permission_execution_authorization_draft_candidate_ready: false,
    ...falseFlags,
    next_gate_required: nextGate
  }
};

writeJson(dataFile, data);

let js = read(jsFile);
js = js.split("controlled-permission-execution-authorization-review-decision-gate-v7").join("controlled-permission-execution-authorization-review-decision-gate-v8");
js = js.split("founder-permission-execution-authorization-decision-gate-v7").join("founder-permission-execution-authorization-decision-gate-v8");
js = js.split("v3.9.8").join(inputRelease);
js = js.split("v3.9.9").join(release);
js = replaceRegex(
  js,
  /  const blockedWords = .*?;\r?\n/s,
  '  const blockedWords = /\\b(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|answer changed|answer change allowed|retrieval changed|retrieval config changed|retrieval change allowed|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production now|launch production allowed|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|answer_changed true|retrieval_config_changed true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)\\b/i;\n',
  "blocked words"
);
if (!js.includes("function decisionHasNoAuthorityFlags")) {
  js = replaceRequired(
    js,
    "  function matchesReviewCarry(reviewPacket, decision) {",
    `  function decisionHasNoAuthorityFlags(decision) {
    if (!decision) return false;
    return falseAuthorityFlags.every((flag) => get(decision, flag) === undefined || get(decision, flag) === false);
  }

  function matchesReviewCarry(reviewPacket, decision) {`,
    "decision authority guard insertion"
  );
}
if (!js.includes("founder decision input may not carry true authority")) {
  js = replaceRequired(
    js,
    '    const state = compact(decision && decision.decision_state) || "Draft decision";',
    `    const state = compact(decision && decision.decision_state) || "Draft decision";
    if (!decisionHasNoAuthorityFlags(decision || {})) {
      return blocked("Blocked: founder decision input may not carry true authority, answer-change, retrieval-change, execution, storage, public release, or production flags.", {});
    }`,
    "runtime authority guard"
  );
}
js = replaceRegex(
  js,
  /    const textFields = \[[\s\S]*?\n    \];/,
  `    const textFields = [
      "decision_scope",
      "founder_decision_language",
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
    ];`,
  "decision text fields"
);
js = js.split("must not grant permission, authorization, or execution.").join("must not grant permission, authorization, answer changes, retrieval changes, execution, storage, public release, or production.");
js = js.split("Blocked: review decision packet must be the v4.0.2 non-authorizing decision packet.").join("Blocked: review decision packet must be the v4.0.2 non-authorizing review-decision packet.");
js = js.split("Blocked: founder decision must preserve the v4.0.2 route, questions, source ids, founder posture id, and authority audit.").join("Blocked: founder decision must preserve the v4.0.2 route, questions, source ids, founder posture id, answer state, retrieval state, and authority audit.");
if (!js.includes("answer_changed=false, retrieval_config_changed=false, authority audit")) {
  js = replaceRegex(
    js,
    /    if \(!hasText\(decision\.decision_rationale,[\s\S]*?      return blocked\("Blocked: decision rationale must explain the v4\.0\.2 handoff, founder posture id, source ids, authority audit, and non-authorization boundary\.", \{\}\);\r?\n    \}/,
    `    if (!hasText(decision.decision_rationale, [["v4.0.2"], ["question handoff"], ["authority flag audit"], ["source identity"], ["founder posture id"], ["answer_changed=false"], ["retrieval_config_changed=false"], ["draft gate"], ["not a live authorization"]])) {
      return blocked("Blocked: decision rationale must explain the v4.0.2 handoff, founder posture id, source identity, answer_changed=false, retrieval_config_changed=false, authority audit, and non-authorization boundary.", {});
    }`,
    "founder rationale check"
  );
}
js = js.split('{ label: "Input", value: "v4.0.2 review decision" }').join('{ label: "Input", value: "v4.0.2 review decision" }');
js = js.split('{ label: "Authority", value: "All false" }').join('{ label: "Locks", value: "Authority, answer, retrieval false" }');
if (!js.includes("decisionHasNoAuthorityFlags,")) {
  js = replaceRequired(js, "    matchesReviewCarry,\n", "    matchesReviewCarry,\n    decisionHasNoAuthorityFlags,\n", "decision authority export");
}
write(jsFile, js);

let page = read(pageFile);
page = page.split("v3.9.9 founder").join(releaseBadge);
page = page.split("v3.9.9").join(release);
page = page.split("v3.9.8").join(inputRelease);
page = page.split("Founder posture. Nothing opens.").join("Founder posture. Nothing opens.");
page = page.split("This founder desk receives the v4.0.2 review-decision packet and records one posture only. Draft-only prepares a later draft candidate; hold, return, and reject remain clean stops.").join("This founder desk receives the v4.0.2 review-decision packet and records one posture only. Draft-only prepares a later controlled draft candidate; hold, return, and reject remain clean stops.");
page = page.split("The founder can choose Draft-only, Hold, Return, or Reject from the v4.0.2 review-decision packet. The page records posture only: no permission grant, no authorization approval, no execution, no answer change, no retrieval change, no storage, no public release, no production.").join("The founder can choose Draft-only, Hold, Return, or Reject from the v4.0.2 review-decision packet. The page records posture only: no permission grant, no authorization approval, no answer change, no retrieval change, no execution, no storage, no public release, no production.");
page = page.split("Prepare a later draft packet. No authority.").join("Prepare a later draft packet. No authority, no write.");
page = page.split("Draft-only, hold, return, or reject without authority.").join("Draft-only, hold, return, or reject without authority, answer change, or retrieval change.");
page = page.split("Founder decision signal only. Permission grant, authorization approval, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.").join("Founder decision signal only. Permission grant, authorization approval, answer changes, retrieval changes, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.");
write(pageFile, page);

appendIfMissing(
  cssFile,
  "VEDAPATH v4.0.3 FOUNDER DECISION GATE RE-ENTRY",
  `
/* VEDAPATH v4.0.3 FOUNDER DECISION GATE RE-ENTRY */
body.permission-execution-decision-page.vp-command-shell-ready main.workspace {
  grid-template-columns: minmax(176px, 0.32fr) minmax(0, 3.3fr) minmax(188px, 0.38fr);
  gap: 15px;
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision {
  padding: clamp(17px, 1.05vw, 22px);
  background:
    linear-gradient(180deg, rgba(255, 255, 252, 0.995), rgba(252, 250, 244, 0.98)),
    radial-gradient(circle at 100% 0%, rgba(20, 92, 74, 0.05), transparent 30%);
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision .founder-decision-head {
  align-items: start;
  grid-template-columns: minmax(0, 1fr) 54px;
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision .founder-decision-head h1 {
  max-width: 760px;
  font-size: clamp(1.5rem, 1.45vw, 1.95rem);
  line-height: 1.08;
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-mark {
  width: 54px;
  height: 54px;
  box-shadow: 0 10px 24px rgba(124, 55, 23, 0.1);
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-choice-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-choice {
  min-height: 58px;
  padding: 9px 10px;
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-choice p,
body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-meridian p,
body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-form textarea,
body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-form input,
body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-form select {
  font-size: 0.85rem;
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-meridian {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-grid {
  gap: 10px;
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-form {
  max-height: 500px;
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-form textarea {
  min-height: 50px;
}

body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-result {
  background: linear-gradient(180deg, rgba(255, 251, 245, 0.92), rgba(255, 255, 252, 0.9));
}

@media (max-width: 1180px) {
  body.permission-execution-decision-page.vp-command-shell-ready main.workspace {
    grid-template-columns: 1fr;
  }

  body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-choice-grid,
  body.permission-execution-decision-page.vp-command-shell-ready .founder-decision-meridian {
    grid-template-columns: 1fr 1fr;
  }
}
`
);

let shell = read(shellFile);
shell = replaceRegex(shell, /const releaseBadge = ".*?";/, `const releaseBadge = "${releaseBadge}";`, "command shell release badge");
write(shellFile, shell);

let build = read(buildFile);
build = build.split('<span class="version">v4.0.2 decision</span>').join(`<span class="version">${releaseBadge}</span>`);
build = replaceRequired(
  build,
  `<span>Current version</span>
          <strong>v4.0.2</strong>
          <p>Controlled Permission Execution Authorization Review Decision Gate Re-entry: the decision gate receives the v4.0.1 draft-review packet and routes only to founder decision, hold, return, or block while permission, authorization, answer changes, retrieval changes, execution, storage, public release, and production stay false.</p>`,
  `<span>Current version</span>
          <strong>${release}</strong>
          <p>${releaseName}: the founder gate receives the ${inputRelease} review-decision packet and records only founder posture while permission, authorization, answer changes, retrieval changes, execution, storage, public release, and production stay false.</p>`,
  "build current version card"
);
build = replaceRequired(
  build,
  `<p>The trust chain now routes the v4.0.1 draft-review packet as a calm handoff while preserving question handoff, source identity, answer boundaries, retrieval boundaries, authority flag audit, review route, and all false authority flags.</p>`,
  `<p>The trust chain now records founder posture from the ${inputRelease} review-decision packet while preserving question handoff, source identity, answer boundary, retrieval boundary, authority flag audit, review route, and all false authority flags.</p>`,
  "build full vision card"
);
build = replaceRequired(
  build,
  `<strong>v4.0.3 Founder Permission Execution Authorization Decision Gate Re-entry</strong>
          <p>Receive the v4.0.2 review-decision packet and record founder posture while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.</p>`,
  `<strong>${nextRelease}</strong>
          <p>Receive the ${release} founder posture packet and prepare draft-only controlled language while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.</p>`,
  "build next release card"
);
build = replaceRequired(
  build,
  `<article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 363: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
          <p>Receives the v4.0.2 review-decision packet and records founder posture while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  `<article class="phase">
        <span class="badge done">Done</span>
        <div>
          <strong>Phase 363: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
          <p>Receives the ${inputRelease} review-decision packet and records founder posture while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.</p>
        </div>
        <div class="percent">100%</div>
      </article>
      <article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 364: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
          <p>Receives the ${release} founder posture packet and prepares draft-only controlled language while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  "build phase 363"
);
build = replaceRegex(
  build,
  /<div class="version-row"><span>Release<\/span><strong>v4\.0\.2 Controlled Permission Execution Authorization Review Decision Gate Re-entry<\/strong><\/div>\s*<div class="version-row"><span>Previous<\/span><strong>v4\.0\.1 Controlled Permission Execution Authorization Draft Review Gate Re-entry<\/strong><\/div>/,
  `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>
            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`,
  "build version notes release"
);
build = replaceRegex(
  build,
  /<div class="version-row"><span>Goal<\/span><strong>Route the v4\.0\.1 draft-review packet to founder decision, hold, return, or block without granting permission, approving authorization, changing answers, changing retrieval, or enabling execution\.<\/strong><\/div>\s*<div class="version-row"><span>Status<\/span><strong>Ready for founder decision gate re-entry<\/strong><\/div>/,
  `<div class="version-row"><span>Goal</span><strong>Record founder posture from the ${inputRelease} review-decision packet without granting permission, authorization, answer changes, retrieval changes, or execution.</strong></div>
            <div class="version-row"><span>Status</span><strong>Ready for controlled draft gate re-entry</strong></div>`,
  "build version notes goal"
);
build = replaceRegex(
  build,
  /<li><span class="dot"><\/span><span>Re-enter founder permission execution authorization decision gate\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Receive the v4\.0\.2 review-decision packet without granting authorization or execution\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Record founder posture only: draft-only, hold, return, or reject\.<\/span><\/li>\s*<li><span class="dot"><\/span><span>Keep answer changes, retrieval changes, storage, canonical writes, public release, and production disabled\.<\/span><\/li>/,
  `<li><span class="dot"></span><span>Receive the ${release} founder posture packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Prepare draft-only controlled language from the recorded founder posture.</span></li>
              <li><span class="dot"></span><span>Preserve source identity, answer boundary, retrieval boundary, route, questions, and authority audit.</span></li>
              <li><span class="dot"></span><span>Keep every permission, answer-change, retrieval-change, execution, storage, public release, and production flag false.</span></li>
              <li><span class="dot"></span><span>Route only a controlled draft candidate to draft-review re-entry.</span></li>`,
  "build checklist"
);
write(buildFile, build);

prependSection(
  readmeFile,
  `## ${release} ${releaseName}`,
  `## ${release} ${releaseName}

- Re-enters the founder gate from the ${inputRelease} review-decision packet and records only founder posture: draft-only, hold, return, or reject.
- Draft-only prepares only the next controlled draft candidate; permission, authorization, answer changes, retrieval changes, execution, storage, public release, and production remain false.
- Refines the founder decision screen into a quieter decision table with smaller typography, clearer lock language, and the ${releaseBadge} command-shell badge.
- Updates [Founder Permission Execution Authorization Decision Gate](founderpermissionexecutionauthorizationdecisiongate.html), [Founder Permission Execution Authorization Decision Gate Data](data/vedapath-founder-permission-execution-authorization-decision-gate.json), and [Founder Permission Execution Authorization Decision Gate Notes](docs/FOUNDER_PERMISSION_EXECUTION_AUTHORIZATION_DECISION_GATE.md).`
);

prependSection(
  notesFile,
  `## ${release} ${releaseName}`,
  `## ${release} ${releaseName}

- Re-enters the founder decision gate from the ${inputRelease} controlled review-decision packet.
- Records founder posture only; draft-only, hold, return, and reject remain non-authorizing decisions.
- Adds runtime guards for true authority flags, answer_changed=true, retrieval_config_changed=true, unsafe authority language, stale review-decision packets, and source/question/audit drift.
- Updates the command shell badge, build tracker, founder gate data, founder gate UI, and founder gate documentation.
- Sets the next release to ${nextRelease}.`
);

prependSection(
  blueprintFile,
  `## ${release} Founder Decision Gate`,
  `## ${release} Founder Decision Gate

${releaseName} should receive the ${inputRelease} review-decision packet and record only founder posture while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.

### Product posture

The founder can choose draft-only, hold, return, or reject. Draft-only means the next gate may prepare controlled draft language. It is still not permission, not authorization, not answer change, not retrieval change, not execution, not storage, not public release, and not production.

### UX posture

The page should feel like one calm decision table: input packet, posture choices, locks, result, and copyable handoff. Typography should stay compact and consistent with the command shell.

Next release: ${nextRelease}.`
);

write(
  docFile,
  `# Founder Permission Execution Authorization Decision Gate

Release: ${release} ${releaseName}

Input: ${previousRelease}

Next: ${nextRelease}

## Purpose

This gate receives the ${inputRelease} controlled review-decision packet and records only a founder posture. A draft-only posture may prepare a later controlled draft candidate, but it does not grant permission, approve authorization, change answers, alter retrieval, execute, write storage, update canonical records, publish, or launch production.

## Allowed Postures

- Draft-only founder decision recorded
- Founder hold recorded
- Return to review decision
- Founder reject recorded

## Required Locks

Every outgoing packet must keep permission, authorization, answer-change, retrieval-change, execution, storage, canonical-write, public-release, and production flags false.

## Runtime Checks

- Input packet must be ${inputRelease} with schema ${reviewData.schema_version}.
- Input packet must point to ${inputNextGate}.
- Source identity, route, questions, and authority audit must carry through unchanged.
- answer_changed and retrieval_config_changed must remain false.
- Unsafe authority language blocks the packet.

## Boundary

Founder posture is a decision signal only. It is not authority. Production remains closed.
`
);

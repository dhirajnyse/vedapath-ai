import fs from "node:fs";

const release = "v4.0.2";
const inputRelease = "v4.0.1";
const releaseBadge = "v4.0.2 decision";
const releaseName = "Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const previousRelease = "v4.0.1 Controlled Permission Execution Authorization Draft Review Gate Re-entry";
const nextRelease = "v4.0.3 Founder Permission Execution Authorization Decision Gate Re-entry";
const nextGate = "Founder permission execution authorization decision gate re-entry";
const inputNextGate = "Controlled permission execution authorization review decision gate re-entry";
const generatedAt = "2026-07-05";

const dataFile = "data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json";
const draftReviewDataFile = "data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json";
const jsFile = "assets/vedapath-controlled-permission-execution-authorization-review-decision-gate.js";
const cssFile = "assets/vedapath-controlled-permission-execution-authorization-review-decision-gate.css";
const pageFile = "controlledpermissionexecutionauthorizationreviewdecisiongate.html";
const shellFile = "assets/vedapath-command-shell.js";
const buildFile = "build-status.html";
const readmeFile = "README.md";
const notesFile = "docs/PROTOTYPE_NOTES.md";
const blueprintFile = "docs/PRODUCT_BLUEPRINT.md";
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
  "answer_changed",
  "retrieval_config_changed",
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

function insertBefore(text, marker, block, label) {
  const firstLine = block.trim().split("\n")[0];
  if (text.includes(firstLine)) return text;
  ensure(text.includes(marker), `Missing marker for ${label}: ${marker}`);
  return text.replace(marker, `${block.trimEnd()}\n\n${marker}`);
}

function appendIfMissing(path, marker, block) {
  const text = read(path);
  if (text.includes(marker)) return;
  write(path, `${text.trimEnd()}\n\n${block.trim()}\n`);
}

const data = readJson(dataFile);
const draftReviewData = readJson(draftReviewDataFile);
const priorReview = clone(draftReviewData.sample_review);

ensure(draftReviewData.release === inputRelease, `Expected ${inputRelease} draft-review data.`);
ensure(priorReview.next_gate_required === inputNextGate, "Draft-review sample does not point to review decision gate.");

const source = {
  draft_review_gate_release: inputRelease,
  draft_review_gate_schema: draftReviewData.schema_version,
  draft_gate_release: draftReviewData.source.draft_gate_release || priorReview.draft_gate_release,
  draft_gate_schema: draftReviewData.source.draft_gate_schema || priorReview.draft_gate_schema,
  founder_decision_release: draftReviewData.source.founder_decision_release || priorReview.founder_decision_release,
  founder_decision_schema: draftReviewData.source.founder_decision_schema || priorReview.founder_decision_schema,
  ...Object.fromEntries(sourceIdentityFields.map((field) => [field, draftReviewData.source[field] || priorReview[field]])),
  ...Object.fromEntries(handoffFields.map((field) => [field, draftReviewData.source[field] || priorReview[field]])),
  answer_changed: false,
  retrieval_config_changed: false
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
  next_gate: inputNextGate,
  created_at: `${generatedAt}T00:00:00.000Z`
};

const sampleDecision = {
  decision_state: "Ready for founder decision",
  decision_actor: "Controlled review decision gate",
  reviewer_name: "Review decision sample",
  ...source,
  decision_scope: `Decide whether the ${inputRelease} draft-review packet may move to founder permission execution authorization decision gate re-entry. This decision is not permission grant, not authorization approval, not answer change, not retrieval change, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.`,
  decision_language: `Review decision result: route the ${inputRelease} draft-review packet to founder decision gate re-entry only. This is routing readiness only; permission grant remains closed, authorization approval remains closed, answer change remains closed, retrieval change remains closed, execution remains closed, and no system may run from it.`,
  decision_rationale: `The ${inputRelease} draft-review packet is ready, the question handoff and source identity are intact, founder posture id is preserved, answer_changed=false, retrieval_config_changed=false, evidence ids are visible, and authority stays closed. The next step is founder decision re-entry only.`,
  decision_evidence_summary: `The ${inputRelease} draft-review packet preserves review decision gate id, draft review gate id, draft gate id, founder decision id, founder posture id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, authority flag audit, answer_changed=false, retrieval_config_changed=false, rollback, monitoring, stop condition, expiry, and production boundary.`,
  non_execution_decision_clause: `Controlled permission execution authorization review decision gate re-entry only; review_decision_ready may be true, review_decision_recorded may be true, controlled_permission_execution_authorization_review_decision_ready may be true, and founder_permission_execution_authorization_decision_candidate_ready may be true, but ${falseFlagSentence}.`,
  risk_acknowledgment: `Risk remains: ${inputRelease} draft-review packet mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, founder posture id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, answer state mismatch, retrieval state mismatch, founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous decision language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, answer change, retrieval change, execution, storage, canonical, public release, or production flag must block movement.`,
  rollback_condition: `Rollback if the ${inputRelease} draft-review packet, route, source identity, founder posture id, questions, authority audit, answer state, retrieval state, or non-execution boundary no longer match the incoming packet.`,
  monitoring_condition: `Monitor only the frozen ${inputRelease} draft-review packet, route, source identity, founder posture id, questions, authority audit, answer_changed=false, retrieval_config_changed=false, and false authority flags before routing to founder decision.`,
  stop_condition: `Stop if the ${inputRelease} draft-review packet, review decision id, draft review gate id, draft gate id, founder posture id, review route, founder question, permission question, authority flag audit, answer state, retrieval state, founder decision id, authorization review id, preflight id, hold id, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, answer change, retrieval change, execution, storage, canonical, public release, or production flag is true.`,
  expiry_check: `Controlled permission execution authorization review decision gate re-entry expires at the next material ${inputRelease} draft-review packet, review decision, draft review, draft, founder decision, authorization review, preflight, hold, source, answer state, retrieval state, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, not answer change, not retrieval change, and not execution.`,
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  return_reason: `Return if the ${inputRelease} draft-review language loses founder posture id, route, question, audit, source identity, answer boundary, or retrieval boundary clarity.`,
  hold_reason: `Hold until the reviewer can see the exact ${inputRelease} draft-review packet, founder posture id, source ids, route, questions, answer_changed=false, retrieval_config_changed=false, and authority audit.`,
  block_reason: `Block if any authority flag becomes true or the ${inputRelease} handoff is changed.`,
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

data.schema_version = "controlled-permission-execution-authorization-review-decision-gate-v8";
data.release = release;
data.input_release = inputRelease;
data.generated_at = generatedAt;
data.title = releaseName;
data.summary = `Re-enters the review decision gate from the ${inputRelease} draft-review packet, preserves founder posture id, source identity, route, questions, answer boundary, retrieval boundary, and authority audit, and routes founder, hold, return, or block while every permission, authorization, answer change, retrieval change, execution, storage, public release, and production path remains disabled.`;
data.previous_release = previousRelease;
data.source_release = previousRelease;
data.next_gate = nextGate;
data.source = source;
data.decision_modes = {
  "Ready for founder decision": {
    state: "Ready for founder decision",
    summary: "Prepare a founder decision candidate only. This is still not permission, authorization, answer change, retrieval change, or execution."
  },
  "Hold for evidence": {
    state: "Hold for evidence",
    summary: `Keep the packet held until the ${inputRelease} draft-review evidence, answer boundary, and retrieval boundary are visible and stable.`
  },
  "Return to draft review": {
    state: "Return to draft review",
    summary: `Send the packet back to the ${inputRelease} draft-review gate.`
  },
  "Block packet": {
    state: "Block packet",
    summary: "Close this packet route because trust evidence, source identity, answer boundary, retrieval boundary, or boundary text is unsafe."
  }
};
data.decision_checks = [
  { check: "Input packet", rule: `Starts only from the ${inputRelease} non-authorizing draft-review output.` },
  { check: "Identity continuity", rule: "Preserves review decision id, draft review id, draft gate id, founder posture id, founder decision id, authorization review id, preflight id, hold id, and source ids." },
  { check: "Question continuity", rule: "Preserves review route, founder question, permission question, and authority flag audit." },
  { check: "Answer and retrieval locks", rule: "Requires answer_changed=false and retrieval_config_changed=false in the incoming packet and outgoing decision." },
  { check: "Forward limit", rule: "Forward route may create only founder decision candidate readiness." },
  { check: "Authority boundary", rule: "Permission, authorization, answer changes, retrieval changes, execution, storage, canonical writes, public release, and production remain false." }
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

let js = read(jsFile);
js = js.split("v3.9.8").join(release);
js = js.split("v3.9.7").join(inputRelease);
js = js.split("controlled-permission-execution-authorization-review-decision-gate-v7").join("controlled-permission-execution-authorization-review-decision-gate-v8");
js = js.split("controlled-permission-execution-authorization-draft-review-gate-v7").join(draftReviewData.schema_version);
js = replaceRegex(
  js,
  /  const blockedWords = .*?;\r?\n/s,
  '  const blockedWords = /\\b(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|answer changed|answer change allowed|retrieval changed|retrieval config changed|retrieval change allowed|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production now|launch production allowed|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|answer_changed true|retrieval_config_changed true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)\\b/i;\n',
  "blocked words"
);
if (!js.includes("function decisionHasNoAuthorityFlags")) {
  js = replaceRequired(
    js,
    "  function decisionPreservesHandoff(decision, reviewPacket, config) {",
    `  function decisionHasNoAuthorityFlags(decision) {
    if (!decision) return false;
    return falseAuthorityFlags.every((flag) => get(decision, flag) === undefined || get(decision, flag) === false);
  }

  function decisionPreservesHandoff(decision, reviewPacket, config) {`,
    "decisionHasNoAuthorityFlags insertion"
  );
}
if (!js.includes("decision input may not carry true authority")) {
  js = replaceRequired(
    js,
    '    const state = compact(decision && decision.decision_state) || "Draft decision";',
    `    const state = compact(decision && decision.decision_state) || "Draft decision";
    if (!decisionHasNoAuthorityFlags(decision || {})) {
      return blocked("Blocked: decision input may not carry true authority, answer-change, retrieval-change, execution, storage, public release, or production flags.", {});
    }`,
    "runtime authority-flag guard"
  );
}
js = replaceRegex(
  js,
  /    const textFields = \[[\s\S]*?\n    \];/,
  `    const textFields = [
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
    ];`,
  "decision text fields"
);
js = js.split("must not grant permission, authorization, or execution.").join("must not grant permission, authorization, answer changes, retrieval changes, execution, storage, public release, or production.");
js = replaceRegex(
  js,
  /    if \(!compact\(decision\.decision_scope\)\.includes\("v4\.0\.1"\) \|\|[\s\S]*?      return blocked\("Blocked: decision text must name the v4\.0\.1 handoff, founder posture id, source identity, and authority audit\.", \{\}\);\r?\n    \}/,
  `    if (!compact(decision.decision_scope).includes("v4.0.1") ||
        !compact(decision.decision_rationale).includes("question handoff") ||
        !compact(decision.decision_rationale).includes("source identity") ||
        !compact(decision.decision_rationale).includes("founder posture id") ||
        !compact(decision.decision_evidence_summary).includes("authority flag audit") ||
        !compact(decision.decision_evidence_summary).includes("answer_changed=false") ||
        !compact(decision.decision_evidence_summary).includes("retrieval_config_changed=false")) {
      return blocked("Blocked: decision text must name the v4.0.1 handoff, founder posture id, source identity, answer_changed=false, retrieval_config_changed=false, and authority audit.", {});
    }`,
  "handoff evidence check"
);
js = js.split('{ label: "Input", value: "v4.0.1 draft-review packet" }').join('{ label: "Input", value: "v4.0.1 draft-review packet" }');
if (!js.includes("decisionHasNoAuthorityFlags,")) {
  js = replaceRequired(js, "    decisionPreservesHandoff,\n", "    decisionPreservesHandoff,\n    decisionHasNoAuthorityFlags,\n", "decisionHasNoAuthorityFlags export");
}
write(jsFile, js);

let page = read(pageFile);
page = page.split("v3.9.8 decision").join(releaseBadge);
page = page.split("v3.9.8").join(release);
page = page.split("v3.9.7").join(inputRelease);
page = page.split("Choose one route. Let nothing leak.").join("Choose one route. Keep it non-authorizing.");
page = page.split("preserves posture, source ids, questions, and authority audit, then chooses one quiet next path with every lock visible.").join("preserves posture, source ids, questions, answer state, retrieval state, and authority audit, then chooses one quiet next path with every lock visible.");
page = page.split("Posture, questions, audit.").join("Posture, answer, retrieval, audit.");
page = page.split("Route the review. Keep authority still.").join("Route the review. Keep every lock still.");
page = page.split("A forward route prepares one founder decision candidate only, never permission or execution.").join("A forward route prepares one founder decision candidate only, never permission, answer change, retrieval change, or execution.");
page = page.split("Review ready, execution false.").join("Review ready; answer, retrieval, execution false.");
page = page.split("Posture, source, audit").join("Posture, source, answer, audit");
page = page.split("Founder Route, Still Gentle").join("Founder Route, Still Non-Authorizing");
page = page.split("It still does not grant permission or approve execution.").join("It still does not grant permission, change answers, alter retrieval, or approve execution.");
page = page.split("Permission grant, authorization approval, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.").join("Permission grant, authorization approval, answer changes, retrieval changes, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.");
write(pageFile, page);

appendIfMissing(
  cssFile,
  "VEDAPATH v4.0.2 CONTROLLED REVIEW DECISION GATE RE-ENTRY",
  `
/* VEDAPATH v4.0.2 CONTROLLED REVIEW DECISION GATE RE-ENTRY */
body.review-decision-page.vp-command-shell-ready main.workspace {
  grid-template-columns: minmax(180px, 0.34fr) minmax(0, 3.28fr) minmax(190px, 0.4fr);
  gap: 15px;
}

body.review-decision-page.vp-command-shell-ready .review-decision {
  padding: clamp(17px, 1.05vw, 22px);
  background:
    linear-gradient(180deg, rgba(255, 255, 252, 0.995), rgba(252, 250, 244, 0.98)),
    radial-gradient(circle at 100% 0%, rgba(20, 92, 74, 0.048), transparent 30%);
}

body.review-decision-page.vp-command-shell-ready .review-decision h1 {
  max-width: 720px;
  font-size: clamp(1.46rem, 1.4vw, 1.88rem);
  line-height: 1.08;
}

body.review-decision-page.vp-command-shell-ready .review-decision-head {
  align-items: start;
}

body.review-decision-page.vp-command-shell-ready .review-decision-mark {
  width: 48px;
  height: 48px;
  box-shadow: 0 10px 24px rgba(124, 55, 23, 0.1);
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice {
  min-height: 50px;
  padding: 9px 10px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice span,
body.review-decision-page.vp-command-shell-ready .review-decision-card span,
body.review-decision-page.vp-command-shell-ready .review-decision-relay span {
  color: rgba(69, 42, 29, 0.62);
}

body.review-decision-page.vp-command-shell-ready .review-decision-relay {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-grid {
  gap: 10px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-form {
  max-height: 492px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-form textarea {
  min-height: 50px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-output {
  min-height: 220px;
}

body.review-decision-page.vp-command-shell-ready aside.panel.tight {
  background: linear-gradient(180deg, rgba(255, 255, 252, 0.98), rgba(252, 248, 240, 0.94));
}

@media (max-width: 1180px) {
  body.review-decision-page.vp-command-shell-ready main.workspace {
    grid-template-columns: 1fr;
  }

  body.review-decision-page.vp-command-shell-ready .review-decision-choice-grid,
  body.review-decision-page.vp-command-shell-ready .review-decision-relay {
    grid-template-columns: 1fr 1fr;
  }
}
`
);

let shell = read(shellFile);
shell = replaceRegex(shell, /const releaseBadge = ".*?";/, `const releaseBadge = "${releaseBadge}";`, "command shell release badge");
write(shellFile, shell);

let build = read(buildFile);
build = build.split('<span class="version">v4.0.1 review</span>').join(`<span class="version">${releaseBadge}</span>`);
build = replaceRequired(
  build,
  `<span>Current version</span>
          <strong>v4.0.1</strong>
          <p>Controlled Permission Execution Authorization Draft Review Gate Re-entry: the draft-review gate receives the v4.0.0 controlled draft packet and prepares one review-decision candidate while permission, authorization, answer changes, retrieval changes, execution, storage, public release, and production stay false.</p>`,
  `<span>Current version</span>
          <strong>${release}</strong>
          <p>${releaseName}: the decision gate receives the ${inputRelease} draft-review packet and routes only to founder decision, hold, return, or block while permission, authorization, answer changes, retrieval changes, execution, storage, public release, and production stay false.</p>`,
  "build current version card"
);
build = replaceRequired(
  build,
  `<p>The trust chain now reviews the v4.0.0 controlled draft as a calm handoff while preserving question handoff, source identity, answer boundaries, retrieval boundaries, authority flag audit, draft scope, and all false execution flags.</p>`,
  `<p>The trust chain now routes the ${inputRelease} draft-review packet as a calm handoff while preserving question handoff, source identity, answer boundaries, retrieval boundaries, authority flag audit, review route, and all false authority flags.</p>`,
  "build full vision text"
);
build = replaceRequired(
  build,
  `<strong>v4.0.2 Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
          <p>Route the v4.0.1 draft-review packet to founder decision, hold, return, or block while every authority, answer-change, and retrieval-change flag remains false.</p>`,
  `<strong>${nextRelease}</strong>
          <p>Receive the ${release} review-decision packet and record founder posture while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.</p>`,
  "build next release card"
);
build = replaceRequired(
  build,
  `<article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 362: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
          <p>Route the v4.0.1 draft-review packet to founder decision, hold, return, or block while every authority, answer-change, and retrieval-change flag remains false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  `<article class="phase">
        <span class="badge done">Done</span>
        <div>
          <strong>Phase 362: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
          <p>Routes the ${inputRelease} draft-review packet to founder decision, hold, return, or block while every authority, answer-change, and retrieval-change flag remains false.</p>
        </div>
        <div class="percent">100%</div>
      </article>
      <article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 363: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
          <p>Receives the ${release} review-decision packet and records founder posture while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  "build phase 362"
);
build = replaceRequired(
  build,
  `<div class="version-row"><span>Release</span><strong>v4.0.1 Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong></div>
        <div class="version-row"><span>Previous</span><strong>v4.0.0 Controlled Permission Execution Authorization Draft Gate Re-entry</strong></div>
        <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
        <div class="version-row"><span>Goal</span><strong>Review the v4.0.0 controlled draft packet into one review-decision candidate while every authority, answer-change, retrieval-change, and production flag remains false.</strong></div>
        <div class="version-row"><span>Status</span><strong>Ready for controlled review decision gate re-entry</strong></div>`,
  `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>
        <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>
        <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
        <div class="version-row"><span>Goal</span><strong>Route the ${inputRelease} draft-review packet to founder decision, hold, return, or block without granting permission, approving authorization, changing answers, changing retrieval, or enabling execution.</strong></div>
        <div class="version-row"><span>Status</span><strong>Ready for founder decision gate re-entry</strong></div>`,
  "build version rows"
);
build = replaceRequired(
  build,
  `<li><span class="dot"></span><span>Re-enter controlled permission execution authorization review decision gate.</span></li>
              <li><span class="dot"></span><span>Receive the v4.0.1 draft-review packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Choose only founder decision, hold, return, or block as the next posture.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  `<li><span class="dot"></span><span>Re-enter founder permission execution authorization decision gate.</span></li>
              <li><span class="dot"></span><span>Receive the ${release} review-decision packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Record founder posture only: draft-only, hold, return, or reject.</span></li>
              <li><span class="dot"></span><span>Keep answer changes, retrieval changes, storage, canonical writes, public release, and production disabled.</span></li>`,
  "build checklist"
);
write(buildFile, build);

const readmeEntry = `## ${release} ${releaseName}

- Re-enters the controlled review-decision gate from the ${inputRelease} draft-review packet.
- Preserves founder posture id, founder decision schema, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, answer boundary, retrieval boundary, and authority audit.
- Routes only to founder decision, hold, return, or block while permission grant, authorization approval, answer changes, retrieval changes, execution, storage writes, canonical writes, public release, and production remain false.
- Refines the review-decision page into a quieter routing desk: one incoming review packet, four visible routes, one outgoing founder decision candidate, and the ${releaseBadge} command-shell badge.
- Updates [Controlled Permission Execution Authorization Review Decision Gate](controlledpermissionexecutionauthorizationreviewdecisiongate.html), [Controlled Permission Execution Authorization Review Decision Gate Data](data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json), and [Controlled Permission Execution Authorization Review Decision Gate Notes](docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_REVIEW_DECISION_GATE.md).

`;
let readme = read(readmeFile);
readme = insertBefore(readme, "## v4.0.1 Controlled Permission Execution Authorization Draft Review Gate Re-entry", readmeEntry, "README v4.0.1 marker");
write(readmeFile, readme);

const notesEntry = `## ${release} ${releaseName}

- Re-enters the controlled review-decision gate from the ${inputRelease} draft-review packet.
- Routes only to founder decision, hold, return, or block while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.
- Softens the decision room into a calm routing desk: one incoming review packet, four route choices, one founder decision candidate, and visible answer/retrieval locks.
- Sets the build tracker to Phase 363: founder decision gate re-entry.

`;
let notes = read(notesFile);
notes = insertBefore(notes, "## v4.0.1 Controlled Permission Execution Authorization Draft Review Gate Re-entry", notesEntry, "prototype notes v4.0.1 marker");
write(notesFile, notes);

const blueprintEntry = `## ${release} Controlled Review Decision Gate

Controlled Permission Execution Authorization Review Decision Gate Re-entry should receive the ${inputRelease} draft-review packet and route only to founder decision, hold, return, or block while every authority flag remains false.

Release intent:

- accept only the ${inputRelease} controlled draft-review output
- preserve founder posture id, founder decision schema, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, answer boundary, retrieval boundary, and authority audit
- output review-decision readiness and founder decision candidate readiness only after the handoff stays intact
- keep permission grant, authorization approval, answer changes, retrieval changes, execution, storage writes, canonical writes, public release, and production unavailable
- move only to the founder permission execution authorization decision gate re-entry
- make the review-decision gate feel like a quiet routing desk: one incoming review packet, four route choices, one outgoing founder decision candidate, zero authority leakage

Next release: ${nextRelease}.

`;
let blueprint = read(blueprintFile);
blueprint = insertBefore(blueprint, "## v4.0.1 Controlled Draft Review Gate", blueprintEntry, "blueprint v4.0.1 marker");
write(blueprintFile, blueprint);

write(docFile, `# ${releaseName}

Controlled Permission Execution Authorization Review Decision Gate Re-entry receives the ${inputRelease} controlled draft-review packet and turns it into a founder decision candidate route, hold, return, or block.

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
- answer_changed=false
- retrieval_config_changed=false
- authority flag audit

Forward routing may mark review-decision readiness and founder decision candidate readiness only. It must not grant permission, approve authorization, change answers, change retrieval, execute, store, update canonical records, publish, or launch production.

## ${release} Re-entry Notes

- Accept only the ${inputRelease} controlled draft-review packet.
- Route only to founder decision, hold, return, or block.
- Keep permission, authorization approval, answer changes, retrieval changes, execution, storage writes, canonical writes, public release, and production false.
- Preserve the ${inputRelease} route, source ids, source family, questions, founder posture id, answer/retrieval locks, and authority audit.
- Keep the room visually quiet: one incoming review packet, four visible routes, one outgoing founder decision candidate, zero authority leakage.
`);

console.log(`${release} ${releaseName} applied.`);

import fs from "node:fs";

const release = "v3.7.5";
const inputRelease = "v3.7.4";
const releaseName = "Founder Permission Execution Authorization Decision Gate Re-entry";
const releaseBadge = "v3.7.5 founder";
const previousRelease = "v3.7.4 Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const nextRelease = "Controlled Permission Execution Authorization Draft Gate Re-entry";
const dataFile = "data/vedapath-founder-permission-execution-authorization-decision-gate.json";
const reviewDataFile = "data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json";
const jsFile = "assets/vedapath-founder-permission-execution-authorization-decision-gate.js";
const cssFile = "assets/vedapath-founder-permission-execution-authorization-decision-gate.css";
const pageFile = "founderpermissionexecutionauthorizationdecisiongate.html";
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
  "actual_storage_write_executed",
  "production_ready",
  "production_launch_allowed",
  "public_release_allowed"
];

const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, content) => fs.writeFileSync(file, content);
const readJson = (file) => JSON.parse(read(file));

function replaceAll(text, pairs) {
  let next = text;
  for (const [from, to] of pairs) {
    next = next.split(from).join(to);
  }
  return next;
}

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) {
    throw new Error(`Missing replacement target: ${label}`);
  }
  return text.replace(from, to);
}

function insertBefore(text, marker, block, label) {
  if (text.includes(block.trim().split("\n")[0])) return text;
  if (!text.includes(marker)) {
    throw new Error(`Missing insertion marker: ${label}`);
  }
  return text.replace(marker, `${block}\n\n${marker}`);
}

const data = readJson(dataFile);
const reviewData = readJson(reviewDataFile);
const reviewDecision = reviewData.sample_decision;

const sampleReviewDecisionPacket = {
  schema_version: reviewData.schema_version,
  release: reviewData.release,
  decision_status: "Ready for founder decision; no authority granted.",
  review_decision_outcome: "Ready",
  ...reviewDecision,
  preserves_review_route: true,
  preserves_source_identity: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  next_gate_required: "Founder permission execution authorization decision gate",
  created_at: "2026-07-02T00:00:00.000Z"
};

data.release = release;
data.generated_at = "2026-07-02";
data.title = releaseName;
data.summary = "Re-enters the founder decision gate from the v3.7.4 review-decision packet, preserves source identity, route, questions, and authority audit, and records draft-only, hold, return, or reject posture while every permission, authorization, execution, storage, public release, and production path remains disabled.";
data.previous_release = previousRelease;
data.source_release = previousRelease;
data.next_gate = "Controlled permission execution authorization draft gate re-entry";
data.input_release = inputRelease;
data.source = {
  review_decision_release: inputRelease,
  review_decision_schema: reviewData.schema_version,
  review_decision_gate_id: sampleReviewDecisionPacket.review_decision_gate_id,
  controlled_permission_execution_authorization_draft_review_gate_id: sampleReviewDecisionPacket.controlled_permission_execution_authorization_draft_review_gate_id,
  controlled_permission_execution_authorization_draft_gate_id: sampleReviewDecisionPacket.controlled_permission_execution_authorization_draft_gate_id,
  founder_decision_gate_id: sampleReviewDecisionPacket.founder_decision_gate_id,
  founder_permission_execution_authorization_decision_gate_id: sampleReviewDecisionPacket.founder_permission_execution_authorization_decision_gate_id,
  authorization_review_gate_id: sampleReviewDecisionPacket.authorization_review_gate_id,
  permission_execution_authorization_preflight_id: sampleReviewDecisionPacket.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: sampleReviewDecisionPacket.controlled_permission_execution_hold_id,
  source_answer_id: sampleReviewDecisionPacket.source_answer_id,
  source_record_id: sampleReviewDecisionPacket.source_record_id,
  source_family: sampleReviewDecisionPacket.source_family,
  review_route: sampleReviewDecisionPacket.review_route,
  founder_question: sampleReviewDecisionPacket.founder_question,
  permission_question: sampleReviewDecisionPacket.permission_question,
  authority_flag_audit: sampleReviewDecisionPacket.authority_flag_audit
};

data.decision_checks = [
  { check: "Input packet", rule: "Must be the v3.7.4 review-decision packet." },
  { check: "Source identity", rule: "All gate ids, founder posture id, and source ids must match the incoming review decision." },
  { check: "Question handoff", rule: "Route, founder question, and permission question must remain unchanged." },
  { check: "Authority audit", rule: "Every authority audit flag must remain false." },
  { check: "Founder posture", rule: "Draft-only, hold, return, and reject are decisions, not permissions." },
  { check: "Production boundary", rule: "Production remains unavailable." }
];

data.sample_review_decision_packet = sampleReviewDecisionPacket;
data.sample_authorization_review_packet = sampleReviewDecisionPacket;
data.sample_decision = {
  ...data.sample_decision,
  decision_state: "Draft-only founder decision recorded",
  decision_actor: "Founder",
  founder_name: "Founder sample",
  review_decision_gate_id: sampleReviewDecisionPacket.review_decision_gate_id,
  controlled_permission_execution_authorization_draft_review_gate_id: sampleReviewDecisionPacket.controlled_permission_execution_authorization_draft_review_gate_id,
  controlled_permission_execution_authorization_draft_gate_id: sampleReviewDecisionPacket.controlled_permission_execution_authorization_draft_gate_id,
  founder_decision_gate_id: sampleReviewDecisionPacket.founder_decision_gate_id,
  founder_permission_execution_authorization_decision_gate_id: sampleReviewDecisionPacket.founder_permission_execution_authorization_decision_gate_id,
  authorization_review_gate_id: sampleReviewDecisionPacket.authorization_review_gate_id,
  permission_execution_authorization_preflight_id: sampleReviewDecisionPacket.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: sampleReviewDecisionPacket.controlled_permission_execution_hold_id,
  source_answer_id: sampleReviewDecisionPacket.source_answer_id,
  source_record_id: sampleReviewDecisionPacket.source_record_id,
  source_family: sampleReviewDecisionPacket.source_family,
  review_route: sampleReviewDecisionPacket.review_route,
  founder_question: sampleReviewDecisionPacket.founder_question,
  permission_question: sampleReviewDecisionPacket.permission_question,
  authority_flag_audit: sampleReviewDecisionPacket.authority_flag_audit,
  decision_scope: "Record founder posture for the v3.7.4 review-decision packet only. The record may create one later controlled draft candidate, but it cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, launch production, or run any system.",
  founder_decision_language: "Founder posture: draft-only record for the v3.7.4 review-decision packet. It may feed one later controlled draft gate only. It grants nothing; every permission, authorization, execution, storage, canonical, public release, and production flag remains false.",
  decision_rationale: "The v3.7.4 review-decision packet is ready for founder posture because the question handoff, authority flag audit, founder posture id, source ids, and draft gate lineage are intact. This is not a live authorization; it is only a posture record for the next controlled draft gate.",
  decision_evidence_summary: "Input release v3.7.4 has review_decision_ready=true, review_decision_recorded=true, founder decision candidate ready=true, and every authority, execution, storage, canonical, public release, and production flag false.",
  non_execution_decision_clause: "Founder permission execution authorization decision gate only; review_decision_ready may be true, review_decision_recorded may be true, founder_permission_execution_authorization_decision_candidate_ready may be true, founder_permission_execution_authorization_decision_ready may be true, founder_permission_execution_authorization_decision_recorded may be true, controlled_permission_execution_authorization_draft_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, founder_instruction_granted remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false.",
  risk_acknowledgment: "Risk remains: v3.7.4 review-decision packet mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, founder posture id mismatch, route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, source mismatch, rights change, ambiguous founder language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback by returning to the v3.7.4 review-decision gate and requiring a fresh non-authorizing review decision packet before any founder posture is recorded again.",
  monitoring_condition: "Monitor only the frozen v3.7.4 packet ids, route, questions, source ids, authority audit, and false authority flags before preparing a later controlled draft candidate.",
  stop_condition: "Stop if the v3.7.4 review-decision packet, review decision id, draft review gate id, draft gate id, founder posture id, route, founder question, permission question, authority flag audit, incoming founder id, authorization review id, preflight id, hold id, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Founder permission execution authorization decision gate expires at the next material v3.7.4 review-decision packet, draft review, draft, founder posture, authorization review, preflight, hold, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  clarification_question: "Which single founder posture should be recorded for the v3.7.4 review-decision packet: draft-only, hold, return, or reject?",
  return_reason: "Return if the v3.7.4 review-decision language loses route, question, audit, founder posture id, or source identity clarity.",
  hold_reason: "Hold until the founder can see the exact v3.7.4 review-decision packet, founder posture id, source ids, route, questions, and authority audit.",
  block_reason: "Block if any language implies permission, authorization, execution, storage, canonical write, public release, or production launch.",
  next_gate: "Controlled permission execution authorization draft gate re-entry",
  release
};

write(dataFile, `${JSON.stringify(data, null, 2)}\n`);

let js = read(jsFile);
js = replaceAll(js, [
  ['packet.release === "v3.7.0"', 'packet.release === "v3.7.4"'],
  ["the v3.7.0 non-authorizing decision packet", "the v3.7.4 non-authorizing decision packet"],
  ["preserve the v3.7.0 route", "preserve the v3.7.4 route"],
  ['[["v3.7.0"],', '[["v3.7.4"],'],
  ["the v3.7.0 handoff", "the v3.7.4 handoff"],
  ['{ label: "Input", value: "v3.7.0 review decision" }', '{ label: "Input", value: "v3.7.4 review decision" }']
]);
write(jsFile, js);

let html = read(pageFile);
html = replaceAll(html, [
  ["<title>VedaPath Founder Permission Execution Authorization Decision Gate Re-entry</title>", "<title>VedaPath Founder Decision Re-entry</title>"],
  ["<span>Founder decision gate</span>", "<span>Founder decision re-entry</span>"],
  ['<span class="version">v3.7.1 founder</span>', `<span class="version">${releaseBadge}</span>`],
  ["This gate receives the v3.7.0 review-decision packet and records founder posture only.", "This gate receives the v3.7.4 review-decision packet and records founder posture only."],
  ["<h2>Founder posture, nothing unlocked.</h2>", "<h2>Choose posture. Keep product still.</h2>"],
  ["Record posture. Preserve the packet. Grant nothing.", "Choose posture. Keep authority closed."],
  ["from the v3.7.0 review-decision packet", "from the v3.7.4 review-decision packet"],
  ["Incoming packet</span>\n              <strong>v3.7.0 review decision</strong>", "Incoming packet</span>\n              <strong>v3.7.4 review decision</strong>"],
  ["<div class=\"metric\"><span>Current</span><strong>v3.7.1</strong></div>", `<div class="metric"><span>Current</span><strong>${release}</strong></div>`],
  ["<div class=\"metric\"><span>Input</span><strong>v3.7.0</strong></div>", `<div class="metric"><span>Input</span><strong>${inputRelease}</strong></div>`]
]);
html = replaceOnce(
  html,
  '<button class="founder-decision-choice" type="button" data-decision-state="Founder hold recorded" aria-pressed="false"><span>Decision path</span><strong>Hold</strong><p>Pause until more evidence is visible.</p></button>\n            <button class="founder-decision-choice" type="button" data-decision-state="Founder reject recorded" aria-pressed="false"><span>Decision path</span><strong>Reject</strong><p>Close this packet path cleanly.</p></button>',
  '<button class="founder-decision-choice" type="button" data-decision-state="Founder hold recorded" aria-pressed="false"><span>Decision path</span><strong>Hold</strong><p>Pause until more evidence is visible.</p></button>\n            <button class="founder-decision-choice" type="button" data-decision-state="Return to review decision" aria-pressed="false"><span>Decision path</span><strong>Return</strong><p>Send the packet back for review-decision repair.</p></button>\n            <button class="founder-decision-choice" type="button" data-decision-state="Founder reject recorded" aria-pressed="false"><span>Decision path</span><strong>Reject</strong><p>Close this packet path cleanly.</p></button>',
  "founder return choice"
);
write(pageFile, html);

let css = read(cssFile);
css += `

/* VEDAPATH v3.7.5 FOUNDER DECISION RE-ENTRY */
body.vp-command-shell-ready.permission-execution-decision-page main.workspace {
  grid-template-columns: minmax(208px, 0.52fr) minmax(0, 2.28fr) minmax(214px, 0.58fr);
}

body.permission-execution-decision-page .founder-decision {
  gap: 15px;
  border-color: rgba(20, 92, 74, 0.16);
  background:
    radial-gradient(circle at 94% 6%, rgba(224, 168, 59, 0.08), transparent 24%),
    linear-gradient(135deg, rgba(255, 255, 252, 0.99), rgba(255, 249, 241, 0.93));
}

body.permission-execution-decision-page .founder-decision-head {
  min-height: 104px;
}

body.permission-execution-decision-page .founder-decision h1 {
  max-width: 760px;
  font-size: clamp(1.64rem, 1.42vw, 2.12rem);
  line-height: 1.1;
}

body.permission-execution-decision-page .founder-decision-head .muted {
  max-width: 900px;
  font-size: 0.92rem;
}

body.permission-execution-decision-page .founder-decision-choice-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

body.permission-execution-decision-page .founder-decision-choice {
  min-height: 78px;
  padding: 12px;
}

body.permission-execution-decision-page .founder-decision-choice strong {
  font-size: 0.96rem;
}

body.permission-execution-decision-page .founder-decision-choice p {
  font-size: 0.88rem;
  line-height: 1.45;
}

body.permission-execution-decision-page .founder-decision-meridian article {
  padding: 12px;
}

body.permission-execution-decision-page .founder-decision-form {
  max-height: 650px;
}

body.permission-execution-decision-page .founder-decision-form textarea {
  min-height: 70px;
}

body.permission-execution-decision-page .founder-decision-output {
  min-height: 260px;
}

@media (max-width: 1280px) {
  body.permission-execution-decision-page .founder-decision-choice-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  body.permission-execution-decision-page .founder-decision-choice-grid {
    grid-template-columns: 1fr;
  }
}
`;
write(cssFile, css);

let commandShell = read("assets/vedapath-command-shell.js");
commandShell = replaceOnce(commandShell, 'const releaseBadge = "v3.7.4 decision";', `const releaseBadge = "${releaseBadge}";`, "command shell badge");
write("assets/vedapath-command-shell.js", commandShell);

let build = read("build-status.html");
build = replaceAll(build, [
  ['<span class="version">v3.7.4 decision</span>', `<span class="version">${releaseBadge}</span>`],
  ["<strong>v3.7.4</strong>\n          <p>Controlled Permission Execution Authorization Review Decision Gate Re-entry: the review decision gate now receives the v3.7.3 draft-review packet and routes only to founder decision, hold, return, or block while authority stays closed.</p>", `<strong>${release}</strong>\n          <p>${releaseName}: the founder decision gate now receives the v3.7.4 review-decision packet and records draft-only, hold, return, or reject posture while authority stays closed.</p>`],
  ["The trust chain now carries the v3.7.3 draft-review packet into review decision without turning routing readiness into permission, authorization, execution, storage, public release, or production.", "The trust chain now carries the v3.7.4 review-decision packet into founder posture without turning decision readiness into permission, authorization, execution, storage, public release, or production."],
  ["<strong>Founder permission execution authorization decision gate re-entry</strong>\n          <p>Receive the v3.7.4 review-decision packet and record founder posture while every authority flag remains false.</p>", "<strong>Controlled permission execution authorization draft gate re-entry</strong>\n          <p>Receive the v3.7.5 founder posture packet and prepare controlled draft candidate language while every authority flag remains false.</p>"],
  ['<div class="version-row"><span>Release</span><strong>v3.7.4 Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong></div>\n            <div class="version-row"><span>Previous</span><strong>v3.7.3 Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Route the v3.7.3 draft-review packet without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for founder decision gate re-entry</strong></div>', `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>\n            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Record founder posture from the v3.7.4 review-decision packet without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for controlled draft gate re-entry</strong></div>`],
  ["<li><span class=\"dot\"></span><span>Re-enter the founder permission execution authorization decision gate.</span></li>\n              <li><span class=\"dot\"></span><span>Receive the v3.7.4 review-decision packet without granting authorization or execution.</span></li>\n              <li><span class=\"dot\"></span><span>Preserve source identity, founder posture id, review decision id, questions, route, and authority audit.</span></li>\n              <li><span class=\"dot\"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>", "<li><span class=\"dot\"></span><span>Re-enter the controlled permission execution authorization draft gate.</span></li>\n              <li><span class=\"dot\"></span><span>Receive the v3.7.5 founder posture packet without granting authorization or execution.</span></li>\n              <li><span class=\"dot\"></span><span>Preserve source identity, founder posture id, review decision id, questions, route, and authority audit.</span></li>\n              <li><span class=\"dot\"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>"]
]);
build = replaceOnce(
  build,
  '<article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 335: Founder Permission Execution Authorization Decision Gate Re-entry</strong>\n                <p>Receive the v3.7.4 review-decision packet and record founder posture while permission, authorization, execution, storage, public release, and production remain false.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>',
  '<article class="phase">\n              <span class="badge done">Done</span>\n              <div>\n                <strong>Phase 335: Founder Permission Execution Authorization Decision Gate Re-entry</strong>\n                <p>Receive the v3.7.4 review-decision packet and record founder posture while permission, authorization, execution, storage, public release, and production remain false.</p>\n              </div>\n              <div class="percent">100%</div>\n            </article>\n            <article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 336: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>\n                <p>Receive the v3.7.5 founder posture packet and prepare controlled draft candidate language while every authority and production flag remains false.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>',
  "build phase 335"
);
write("build-status.html", build);

const readmeBlock = `## ${release} ${releaseName}

- Re-enters the founder decision gate from the v3.7.4 review-decision packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit.
- Records draft-only, hold, return, or reject posture while permission, authorization, execution, storage writes, canonical writes, public release, and production remain false.
- Refines the founder decision UI with current v3.7.4 input language, clearer four-choice posture controls, tighter title rhythm, and a clearer v3.7.5 command-shell badge.
- Updates [Founder Permission Execution Authorization Decision Gate](${pageFile}), [Founder Permission Execution Authorization Decision Gate Data](${dataFile}), and [Founder Permission Execution Authorization Decision Gate Notes](${docFile}).`;

let readme = read("README.md");
readme = insertBefore(readme, "## v3.7.4 Controlled Permission Execution Authorization Review Decision Gate Re-entry", readmeBlock, "README v3.7.4");
write("README.md", readme);

const notesBlock = `## ${release} ${releaseName}

- Re-enters the founder decision gate from the v3.7.4 review-decision packet.
- Preserves founder posture id, source identity, route, questions, and authority audit while every grant remains false.
- Adds calmer founder-decision polish: current v3.7.4 incoming packet, four visible posture choices, tighter title rhythm, current command-shell badge, and one outgoing controlled draft candidate only.
- Keeps permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.`;

let notes = read("docs/PROTOTYPE_NOTES.md");
notes = insertBefore(notes, "## v3.7.4 Controlled Permission Execution Authorization Review Decision Gate Re-entry", notesBlock, "prototype notes v3.7.4");
write("docs/PROTOTYPE_NOTES.md", notes);

const blueprintBlock = `### 352. Founder Permission Execution Authorization Decision Gate Re-entry

Founder Permission Execution Authorization Decision Gate Re-entry should receive the v3.7.4 review-decision packet and record founder posture as draft-only, hold, return, or reject while every authority flag remains false.

It should:

- accept only the v3.7.4 controlled permission execution authorization review-decision output
- preserve founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit
- output founder posture readiness and controlled draft candidate readiness only when the draft-only posture is explicit
- keep permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production unavailable
- move only to the controlled permission execution authorization draft gate re-entry
- make the founder decision room feel like a calm founder desk: one reviewed packet, one posture record, zero authority leakage`;

let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
blueprint = insertBefore(blueprint, "## Strategic Difference", blueprintBlock, "blueprint strategic difference");
write("docs/PRODUCT_BLUEPRINT.md", blueprint);

const doc = `# ${releaseName}

Version: ${release}

Founder Permission Execution Authorization Decision Gate Re-entry receives the v3.7.4 controlled review-decision packet and records founder posture after review-decision readiness.

It can record four outcomes:

- Draft-only path
- Hold for more evidence
- Return to review decision
- Reject packet path

It may mark a controlled draft candidate only when the founder chooses the draft-only path. This is a posture record, not a permission grant or execution approval.

It must preserve:

- Founder posture id
- Review decision gate id
- Controlled draft review gate id
- Controlled draft gate id
- Founder decision gate id
- Authorization review gate id
- Permission execution authorization preflight id
- Controlled permission execution hold id
- Source answer id
- Source record id
- Source family
- Review route
- Founder question
- Permission question
- Authority flag audit

It must not grant permission, approve authorization, execute, store, update canonical records, publish, or launch production.

If route, questions, source identity, founder posture id, or authority audit drift, the decision blocks.

Next gate: Controlled permission execution authorization draft gate re-entry.

## v3.7.5 Re-entry Notes

- Accept only the v3.7.4 controlled review-decision packet as input.
- Record draft-only, hold, return, or reject as founder posture only.
- Prepare one controlled draft candidate only from an explicit draft-only posture.
- Keep permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.
- Preserve the v3.7.4 route, source ids, source family, questions, founder posture id, and authority audit.
`;
write(docFile, doc);

console.log(`${release} ${releaseName} applied.`);

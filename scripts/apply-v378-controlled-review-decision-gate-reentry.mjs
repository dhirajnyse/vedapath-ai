import fs from "node:fs";

const release = "v3.7.8";
const inputRelease = "v3.7.7";
const releaseName = "Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const releaseBadge = "v3.7.8 decision";
const previousRelease = "v3.7.7 Controlled Permission Execution Authorization Draft Review Gate Re-entry";
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
const draftReviewData = readJson(draftReviewDataFile);
const reviewPacket = draftReviewData.sample_review;

const sampleDraftReviewPacket = {
  schema_version: draftReviewData.schema_version,
  release: draftReviewData.release,
  draft_review_status: "Draft review ready for founder decision; execution remains false.",
  ...reviewPacket,
  preserves_source_identity: true,
  preserves_review_route: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  next_gate_required: inputNextGate,
  created_at: "2026-07-02T00:00:00.000Z"
};

const source = {
  draft_review_gate_release: inputRelease,
  draft_review_gate_schema: draftReviewData.schema_version,
  draft_gate_release: draftReviewData.source.draft_gate_release || reviewPacket.draft_gate_release || "v3.7.6",
  draft_gate_schema: draftReviewData.source.draft_gate_schema || reviewPacket.draft_gate_schema,
  review_decision_gate_id: sampleDraftReviewPacket.review_decision_gate_id,
  controlled_permission_execution_authorization_draft_review_gate_id: sampleDraftReviewPacket.controlled_permission_execution_authorization_draft_review_gate_id,
  controlled_permission_execution_authorization_draft_gate_id: sampleDraftReviewPacket.controlled_permission_execution_authorization_draft_gate_id,
  founder_decision_gate_id: sampleDraftReviewPacket.founder_decision_gate_id,
  founder_permission_execution_authorization_decision_gate_id: sampleDraftReviewPacket.founder_permission_execution_authorization_decision_gate_id,
  authorization_review_gate_id: sampleDraftReviewPacket.authorization_review_gate_id,
  permission_execution_authorization_preflight_id: sampleDraftReviewPacket.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: sampleDraftReviewPacket.controlled_permission_execution_hold_id,
  source_answer_id: sampleDraftReviewPacket.source_answer_id,
  source_record_id: sampleDraftReviewPacket.source_record_id,
  source_family: sampleDraftReviewPacket.source_family,
  review_route: sampleDraftReviewPacket.review_route,
  founder_question: sampleDraftReviewPacket.founder_question,
  permission_question: sampleDraftReviewPacket.permission_question,
  authority_flag_audit: sampleDraftReviewPacket.authority_flag_audit
};

const falseFlags = Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));

data.release = release;
data.input_release = inputRelease;
data.generated_at = "2026-07-02";
data.title = releaseName;
data.summary = "Re-enters the review decision gate from the v3.7.7 draft-review packet, preserves founder posture id, source identity, route, questions, and authority audit, and routes founder, hold, return, or block while every permission, authorization, execution, storage, public release, and production path remains disabled.";
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
    summary: "Keep the packet held until the v3.7.7 draft-review evidence is visible and stable."
  },
  "Return to draft review": {
    state: "Return to draft review",
    summary: "Send the packet back to the v3.7.7 draft-review gate."
  },
  "Block packet": {
    state: "Block packet",
    summary: "Close this packet route because trust evidence, source identity, or boundary text is unsafe."
  }
};
data.decision_checks = [
  { check: "Input packet", rule: "Starts only from the v3.7.7 non-authorizing draft-review output." },
  { check: "Identity continuity", rule: "Preserves review decision id, draft review id, draft gate id, founder posture id, founder decision id, authorization review id, preflight id, hold id, and source ids." },
  { check: "Question continuity", rule: "Preserves review route, founder question, permission question, and authority flag audit." },
  { check: "Forward limit", rule: "Forward route may create only founder decision candidate readiness." },
  { check: "Authority boundary", rule: "Permission, authorization, execution, storage, canonical writes, public release, and production remain false." }
];
data.sample_draft_review_packet = sampleDraftReviewPacket;
data.sample_decision = {
  decision_state: "Ready for founder decision",
  decision_actor: "Controlled review decision gate",
  reviewer_name: "Review decision sample",
  ...source,
  decision_scope: "Decide whether the v3.7.7 draft-review packet may move to founder permission execution authorization decision gate re-entry. This decision is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  decision_language: "Review decision result: route the v3.7.7 draft-review packet to founder decision gate re-entry only. This is routing readiness only; permission grant remains closed, authorization approval remains closed, execution remains closed, and no system may run from it.",
  decision_rationale: "The v3.7.7 draft-review packet is ready, the question handoff and source identity are intact, founder posture id is preserved, evidence ids are visible, and authority stays closed. The next step is founder decision re-entry only.",
  decision_evidence_summary: "The v3.7.7 draft-review packet preserves review decision gate id, draft review gate id, draft gate id, founder decision id, founder posture id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, authority flag audit, rollback, monitoring, stop condition, expiry, and production boundary.",
  non_execution_decision_clause: "Controlled permission execution authorization review decision gate re-entry only; review_decision_ready may be true, review_decision_recorded may be true, controlled_permission_execution_authorization_review_decision_ready may be true, and founder_permission_execution_authorization_decision_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, founder_instruction_granted remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false.",
  risk_acknowledgment: "Risk remains: v3.7.7 draft-review packet mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, founder posture id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous decision language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback if the v3.7.7 draft-review packet, route, source identity, founder posture id, questions, audit, or non-execution boundary no longer match the incoming packet.",
  monitoring_condition: "Monitor only the frozen v3.7.7 draft-review packet, route, source identity, founder posture id, questions, authority audit, and false authority flags before routing to founder decision.",
  stop_condition: "Stop if the v3.7.7 draft-review packet, review decision id, draft review gate id, draft gate id, founder posture id, review route, founder question, permission question, authority flag audit, founder decision id, authorization review id, preflight id, hold id, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Controlled permission execution authorization review decision gate re-entry expires at the next material v3.7.7 draft-review packet, review decision, draft review, draft, founder decision, authorization review, preflight, hold, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  return_reason: "Return if the v3.7.7 draft-review language loses founder posture id, route, question, audit, or source identity clarity.",
  hold_reason: "Hold until the reviewer can see the exact v3.7.7 draft-review packet, founder posture id, source ids, route, questions, and authority audit.",
  block_reason: "Block if any authority flag becomes true or the v3.7.7 handoff is changed.",
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
data.boundary = {
  review_decision_ready: false,
  review_decision_recorded: false,
  controlled_permission_execution_authorization_review_decision_ready: false,
  founder_permission_execution_authorization_decision_candidate_ready: false,
  ...falseFlags,
  next_gate_required: nextGate
};
write(dataFile, `${JSON.stringify(data, null, 2)}\n`);

let js = read(jsFile);
js = replaceAll(js, [
  ["v3.7.3", inputRelease],
  ['packet.next_gate_required === "Controlled permission execution authorization review decision gate"', `packet.next_gate_required === "${inputNextGate}"`],
  ['next_gate_required: "Controlled permission execution authorization review decision gate"', `next_gate_required: "${inputNextGate}"`],
  ['next_gate_required: forwardReady ? "Founder permission execution authorization decision gate" : null', `next_gate_required: forwardReady ? "${nextGate}" : null`],
  ['{ label: "Input", value: "v3.7.7 draft-review packet" }', `{ label: "Input", value: "${inputRelease} draft-review packet" }`]
]);
write(jsFile, js);

let html = read(pageFile);
html = replaceAll(html, [
  ['<span class="version">v3.7.4 decision</span>', `<span class="version">${releaseBadge}</span>`],
  ["This gate receives the v3.7.3 draft-review packet, preserves founder posture, source ids, questions, and authority audit, then chooses one safe next path.", "This gate receives the v3.7.7 draft-review packet, preserves founder posture, source ids, questions, and authority audit, then chooses one safe next path."],
  ["<h2>Route the reviewed packet. Grant nothing.</h2>", "<h2>Decide the reviewed packet. Keep authority closed.</h2>"],
  ["<h1>Route the review. Keep the product still.</h1>", "<h1>Route the review. Preserve the calm.</h1>"],
  ["Load v3.7.3 packet.", "Load v3.7.7 packet."],
  ["v3.7.3 draft-review packet", "v3.7.7 draft-review packet"],
  ["<div class=\"metric\"><span>Current</span><strong>v3.7.4</strong></div>", `<div class="metric"><span>Current</span><strong>${release}</strong></div>`],
  ["<div class=\"metric\"><span>Input</span><strong>v3.7.3</strong></div>", `<div class="metric"><span>Input</span><strong>${inputRelease}</strong></div>`]
]);
write(pageFile, html);

let css = read(cssFile);
css += `

/* v3.7.8 review-decision re-entry polish */
body.review-decision-page.vp-command-shell-ready main.workspace {
  grid-template-columns: minmax(176px, 0.4fr) minmax(0, 2.85fr) minmax(184px, 0.44fr);
}

body.review-decision-page .review-decision {
  background:
    radial-gradient(circle at 96% 4%, rgba(224, 168, 59, 0.08), transparent 25%),
    linear-gradient(135deg, rgba(255, 255, 252, 0.98), rgba(255, 249, 241, 0.94));
}

body.review-decision-page .review-decision-head {
  min-height: 86px;
}

body.review-decision-page .review-decision h1 {
  font-size: clamp(1.62rem, 1.34vw, 2rem);
  line-height: 1.1;
}

body.review-decision-page .review-decision-head .muted {
  max-width: 980px;
  font-size: 0.9rem;
}

body.review-decision-page .review-decision-choice-grid {
  gap: 10px;
}

body.review-decision-page .review-decision-choice {
  min-height: 66px;
  padding: 12px;
}

body.review-decision-page .review-decision-relay {
  gap: 10px;
}

body.review-decision-page .review-decision-relay div {
  min-height: 56px;
  padding: 12px;
}

body.review-decision-page .review-decision-card,
body.review-decision-page .review-decision-rule {
  background: rgba(255, 253, 248, 0.86);
}

body.review-decision-page .review-decision-form {
  max-height: 650px;
}

body.review-decision-page .review-decision-form textarea {
  min-height: 62px;
}
`;
write(cssFile, css);

let commandShell = read("assets/vedapath-command-shell.js");
commandShell = replaceOnce(commandShell, 'const releaseBadge = "v3.7.7 review";', `const releaseBadge = "${releaseBadge}";`, "command shell badge");
write("assets/vedapath-command-shell.js", commandShell);

let build = read("build-status.html");
build = replaceAll(build, [
  ['<span class="version">v3.7.7 review</span>', `<span class="version">${releaseBadge}</span>`],
  ["<strong>v3.7.7</strong>\n          <p>Controlled Permission Execution Authorization Draft Review Gate Re-entry: the draft-review gate now receives the v3.7.6 controlled draft packet and prepares one controlled review-decision candidate while authority stays closed.</p>", `<strong>${release}</strong>\n          <p>${releaseName}: the review-decision gate now receives the v3.7.7 draft-review packet and routes only to founder decision, hold, return, or block while authority stays closed.</p>`],
  ["The trust chain now reviews the v3.7.6 controlled draft packet without turning review readiness into permission, authorization, execution, storage, public release, or production.", "The trust chain now carries the v3.7.7 draft-review packet into a controlled route decision without turning routing readiness into permission, authorization, execution, storage, public release, or production."],
  ["<strong>Controlled permission execution authorization review decision gate re-entry</strong>\n          <p>Route the v3.7.7 draft-review packet to review decision, hold, return, or block while every authority flag remains false.</p>", `<strong>${nextGate}</strong>\n          <p>Receive the v3.7.8 review-decision packet and record founder posture while every authority flag remains false.</p>`],
  ['<div class="version-row"><span>Release</span><strong>v3.7.7 Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong></div>\n            <div class="version-row"><span>Previous</span><strong>v3.7.6 Controlled Permission Execution Authorization Draft Gate Re-entry</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Prepare controlled review-decision candidate language from the v3.7.6 controlled draft packet without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for controlled review decision gate re-entry</strong></div>', `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>\n            <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>\n            <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>\n            <div class="version-row"><span>Goal</span><strong>Route the v3.7.7 draft-review packet without granting permission, approving authorization, or enabling execution.</strong></div>\n            <div class="version-row"><span>Status</span><strong>Ready for founder decision gate re-entry</strong></div>`],
  ["<li><span class=\"dot\"></span><span>Re-enter the controlled permission execution authorization review decision gate.</span></li>\n              <li><span class=\"dot\"></span><span>Receive the v3.7.7 draft-review packet without granting authorization or execution.</span></li>\n              <li><span class=\"dot\"></span><span>Preserve source identity, founder posture id, review decision id, questions, route, and authority audit.</span></li>\n              <li><span class=\"dot\"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>", "<li><span class=\"dot\"></span><span>Re-enter the founder permission execution authorization decision gate.</span></li>\n              <li><span class=\"dot\"></span><span>Receive the v3.7.8 review-decision packet without granting authorization or execution.</span></li>\n              <li><span class=\"dot\"></span><span>Preserve source identity, founder posture id, review decision id, questions, route, and authority audit.</span></li>\n              <li><span class=\"dot\"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>"]
]);
build = replaceOnce(
  build,
  '<article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 338: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>\n                <p>Receive the v3.7.7 draft-review packet and route it to review decision, hold, return, or block while every authority and production flag remains false.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>',
  '<article class="phase">\n              <span class="badge done">Done</span>\n              <div>\n                <strong>Phase 338: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>\n                <p>Receive the v3.7.7 draft-review packet and route it to review decision, hold, return, or block while every authority and production flag remains false.</p>\n              </div>\n              <div class="percent">100%</div>\n            </article>\n            <article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 339: Founder Permission Execution Authorization Decision Gate Re-entry</strong>\n                <p>Receive the v3.7.8 review-decision packet and record founder posture while permission, authorization, execution, storage, public release, and production remain false.</p>\n              </div>\n              <div class="percent">0%</div>\n            </article>',
  "build phase 338"
);
write("build-status.html", build);

const readmeBlock = `## ${release} ${releaseName}

- Re-enters the controlled review-decision gate from the v3.7.7 draft-review packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit.
- Routes only to founder decision, hold, return, or block while permission, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.
- Refines the review-decision UI with current v3.7.7 input language, calmer decision copy, tighter relay surfaces, and a current v3.7.8 command-shell badge.
- Updates [Controlled Permission Execution Authorization Review Decision Gate](${pageFile}), [Controlled Permission Execution Authorization Review Decision Gate Data](${dataFile}), and [Controlled Permission Execution Authorization Review Decision Gate Notes](${docFile}).`;

let readme = read("README.md");
readme = insertBefore(readme, "## v3.7.7 Controlled Permission Execution Authorization Draft Review Gate Re-entry", readmeBlock, "README v3.7.7");
write("README.md", readme);

const notesBlock = `## ${release} ${releaseName}

- Re-enters the controlled review-decision gate from the v3.7.7 draft-review packet.
- Routes the packet to founder decision, hold, return, or block while every grant remains false.
- Adds calmer review-decision polish: current v3.7.7 incoming packet, tighter relay surfaces, smaller decision title rhythm, current command-shell badge, and one outgoing founder decision candidate only.
- Keeps permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.`;

let notes = read("docs/PROTOTYPE_NOTES.md");
notes = insertBefore(notes, "## v3.7.7 Controlled Permission Execution Authorization Draft Review Gate Re-entry", notesBlock, "prototype notes v3.7.7");
write("docs/PROTOTYPE_NOTES.md", notes);

const blueprintBlock = `### 356. Controlled Permission Execution Authorization Review Decision Gate Re-entry

Controlled Permission Execution Authorization Review Decision Gate Re-entry should receive the v3.7.7 draft-review packet and route only to founder decision, hold, return, or block while every authority flag remains false.

It should:

- accept only the v3.7.7 controlled draft-review output
- preserve founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit
- output review-decision readiness and founder decision candidate readiness only when the forward route is explicit
- keep permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production unavailable
- move only to the founder permission execution authorization decision gate re-entry
- make the review-decision room feel like a quiet routing desk: one reviewed packet, four choices, zero authority leakage`;

let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
blueprint = insertBefore(blueprint, "## Strategic Difference", blueprintBlock, "blueprint strategic difference");
write("docs/PRODUCT_BLUEPRINT.md", blueprint);

const doc = `# ${releaseName}

Controlled Permission Execution Authorization Review Decision Gate Re-entry receives the v3.7.7 controlled draft-review packet and turns it into a founder decision candidate route, hold, return, or block.

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

## v3.7.8 Re-entry Notes

- Accept only the v3.7.7 controlled draft-review packet.
- Route only to founder decision, hold, return, or block.
- Keep permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.
- Preserve the v3.7.7 route, source ids, source family, questions, founder posture id, and authority audit.
`;
write(docFile, doc);

console.log(`${release} ${releaseName} applied.`);

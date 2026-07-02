import fs from "node:fs";

const release = "v3.7.6";
const inputRelease = "v3.7.5";
const releaseBadge = "v3.7.6 draft";
const releaseName = "Controlled Permission Execution Authorization Draft Gate Re-entry";
const previousRelease = "v3.7.5 Founder Permission Execution Authorization Decision Gate Re-entry";
const nextGate = "Controlled permission execution authorization draft review gate re-entry";
const draftDataFile = "data/vedapath-controlled-permission-execution-authorization-draft-gate.json";
const founderDataFile = "data/vedapath-founder-permission-execution-authorization-decision-gate.json";
const jsFile = "assets/vedapath-controlled-permission-execution-authorization-draft-gate.js";
const cssFile = "assets/vedapath-controlled-permission-execution-authorization-draft-gate.css";
const pageFile = "controlledpermissionexecutionauthorizationdraftgate.html";
const shellFile = "assets/vedapath-command-shell.js";
const buildFile = "build-status.html";
const readmeFile = "README.md";
const notesFile = "docs/PROTOTYPE_NOTES.md";
const blueprintFile = "docs/PRODUCT_BLUEPRINT.md";
const draftDocFile = "docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_GATE.md";

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
  for (const [from, to] of pairs) next = next.split(from).join(to);
  return next;
}

function replaceOnce(text, from, to, label) {
  if (!text.includes(from)) throw new Error(`Missing replacement target: ${label}`);
  return text.replace(from, to);
}

function insertBefore(text, marker, block, label) {
  const firstLine = block.trim().split("\n")[0];
  if (text.includes(firstLine)) return text;
  if (!text.includes(marker)) throw new Error(`Missing insertion marker: ${label}`);
  return text.replace(marker, `${block}\n\n${marker}`);
}

const draftData = readJson(draftDataFile);
const founderData = readJson(founderDataFile);
const founderDecision = founderData.sample_decision;

const readyFlags = {
  review_decision_ready: true,
  review_decision_recorded: true,
  founder_permission_execution_authorization_decision_candidate_ready: true,
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true
};

const falseFlags = Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));

const sampleFounderDecisionPacket = {
  schema_version: founderData.schema_version,
  release: founderData.release,
  decision_status: "Draft-only founder decision recorded; execution remains false.",
  founder_decision_outcome: "Draft-only",
  ...founderDecision,
  ...readyFlags,
  ...falseFlags,
  preserves_review_route: true,
  preserves_source_identity: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  next_gate_required: "Controlled permission execution authorization draft gate re-entry",
  created_at: "2026-07-02T00:00:00.000Z"
};

const falseClause = falseAuthorityFlags.map((flag) => `${flag} remains false`).join(", ");
const draftClause = `Controlled permission execution authorization draft gate re-entry only; founder_permission_execution_authorization_decision_ready may be true, founder_permission_execution_authorization_decision_recorded may be true, controlled_permission_execution_authorization_draft_candidate_ready may be true, controlled_permission_execution_authorization_draft_ready may be true, permission_execution_authorization_draft_recorded may be true, and controlled_permission_execution_authorization_draft_review_candidate_ready may be true, but ${falseClause}.`;

draftData.release = release;
draftData.generated_at = "2026-07-02";
draftData.title = releaseName;
draftData.summary = "Re-enters the controlled draft gate from the v3.7.5 founder posture packet, preserves source identity, route, questions, and authority audit, and prepares only draft-review candidate language while every permission, authorization, execution, storage, public release, and production path remains disabled.";
draftData.previous_release = previousRelease;
draftData.source_release = previousRelease;
draftData.input_release = inputRelease;
draftData.next_gate = nextGate;
draftData.source = {
  founder_decision_release: inputRelease,
  founder_decision_schema: founderData.schema_version,
  founder_permission_execution_authorization_decision_gate_id: founderDecision.founder_permission_execution_authorization_decision_gate_id,
  review_decision_gate_id: founderDecision.review_decision_gate_id,
  controlled_permission_execution_authorization_draft_review_gate_id: founderDecision.controlled_permission_execution_authorization_draft_review_gate_id,
  controlled_permission_execution_authorization_draft_gate_id: founderDecision.controlled_permission_execution_authorization_draft_gate_id,
  founder_decision_gate_id: founderDecision.founder_decision_gate_id,
  authorization_review_gate_id: founderDecision.authorization_review_gate_id,
  permission_execution_authorization_preflight_id: founderDecision.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: founderDecision.controlled_permission_execution_hold_id,
  source_answer_id: founderDecision.source_answer_id,
  source_record_id: founderDecision.source_record_id,
  source_family: founderDecision.source_family,
  review_route: founderDecision.review_route,
  founder_question: founderDecision.founder_question,
  permission_question: founderDecision.permission_question,
  authority_flag_audit: founderDecision.authority_flag_audit
};
draftData.draft_checks = [
  { check: "Input packet", rule: "Must be the v3.7.5 draft-only founder posture packet." },
  { check: "Source identity", rule: "All gate ids, founder posture id, and source ids must match the incoming founder decision." },
  { check: "Question handoff", rule: "Route, founder question, permission question, and authority flag audit must remain unchanged." },
  { check: "Draft language", rule: "Draft-review language can be prepared, but it cannot imply permission, authorization, execution, storage, public release, or production." },
  { check: "Authority audit", rule: "Every authority audit flag must remain false." },
  { check: "Next gate", rule: "The only forward path is the controlled draft-review gate re-entry." }
];
draftData.sample_founder_decision_packet = sampleFounderDecisionPacket;
draftData.sample_draft = {
  ...draftData.sample_draft,
  draft_state: "Controlled authorization draft prepared",
  draft_actor: "Controlled draft gate",
  drafter_name: "Draft reviewer sample",
  controlled_permission_execution_authorization_draft_gate_id: founderDecision.controlled_permission_execution_authorization_draft_gate_id,
  founder_permission_execution_authorization_decision_gate_id: founderDecision.founder_permission_execution_authorization_decision_gate_id,
  review_decision_gate_id: founderDecision.review_decision_gate_id,
  controlled_permission_execution_authorization_draft_review_gate_id: founderDecision.controlled_permission_execution_authorization_draft_review_gate_id,
  founder_decision_gate_id: founderDecision.founder_decision_gate_id,
  authorization_review_gate_id: founderDecision.authorization_review_gate_id,
  permission_execution_authorization_preflight_id: founderDecision.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: founderDecision.controlled_permission_execution_hold_id,
  source_answer_id: founderDecision.source_answer_id,
  source_record_id: founderDecision.source_record_id,
  source_family: founderDecision.source_family,
  review_route: founderDecision.review_route,
  founder_question: founderDecision.founder_question,
  permission_question: founderDecision.permission_question,
  authority_flag_audit: founderDecision.authority_flag_audit,
  draft_scope: "Prepare reviewable wording for the v3.7.5 founder posture packet only. The draft can be inspected by the next review gate, but it cannot grant permission, approve authorization, execute, store, update canonical records, publish, launch, or run any production path.",
  draft_language: "Controlled draft-review candidate for the v3.7.5 founder posture packet: preserve the reviewed source ids, route, founder question, permission question, and authority audit. The draft is only language for review. It does not open execution, storage, canonical writes, public release, or production.",
  draft_rationale: "The v3.7.5 founder posture is draft-only and source-locked. It can become reviewable language because the question handoff, source ids, founder posture id, and authority flag audit are intact. This is not a live authorization; it is only a controlled draft candidate for the next draft review gate.",
  draft_evidence_summary: "Input release v3.7.5 has founder_permission_execution_authorization_decision_ready=true, founder_permission_execution_authorization_decision_recorded=true, controlled draft candidate ready=true, the authority flag audit preserved, and every authority, execution, storage, canonical, public release, and production flag false.",
  non_execution_draft_clause: draftClause,
  risk_acknowledgment: "Risk remains: v3.7.5 founder posture mismatch, founder posture id mismatch, review decision id mismatch, draft review id mismatch, draft gate id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, source id mismatch, rights change, ambiguous draft language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback by returning to the v3.7.5 founder decision gate and requiring a fresh non-authorizing founder posture before any draft-review candidate is prepared again.",
  monitoring_condition: "Monitor only the frozen v3.7.5 founder posture id, route, questions, source ids, authority audit, and false authority flags before preparing the controlled draft review candidate.",
  stop_condition: "Stop if the v3.7.5 founder posture id, founder decision id, review decision gate id, draft review gate id, draft gate id, review route, founder question, permission question, authority flag audit, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Controlled permission execution authorization draft gate re-entry expires at the next material v3.7.5 founder posture, review decision, draft review, draft, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  next_gate: nextGate,
  clarification_question: "Which exact v3.7.5 founder posture packet should this draft-review candidate carry, and which single draft boundary should remain most visible?",
  return_reason: "Return if the v3.7.5 founder posture packet loses route, question, audit, founder posture id, or source identity clarity.",
  hold_reason: "Hold until the reviewer can see the exact v3.7.5 founder posture packet, source ids, route, questions, and authority audit.",
  block_reason: "Block if any authority flag becomes true or the v3.7.5 handoff is changed.",
  release
};
draftData.boundary = {
  ...draftData.boundary,
  next_gate_required: nextGate,
  permission_granted: false,
  authorization_permission_granted: false,
  permission_review_approved: false,
  founder_permission_granted: false,
  execution_authorized: false,
  execution_allowed: false,
  storage_write_enabled: false,
  canonical_write_allowed: false,
  production_ready: false,
  public_release_allowed: false
};
write(draftDataFile, `${JSON.stringify(draftData, null, 2)}\n`);

let js = read(jsFile);
js = replaceAll(js, [
  ['packet.release === "v3.7.1"', 'packet.release === "v3.7.5"'],
  ['packet.next_gate_required === "Controlled permission execution authorization draft gate"', 'packet.next_gate_required === "Controlled permission execution authorization draft gate re-entry"'],
  ["the v3.7.1 draft-only, non-authorizing posture packet", "the v3.7.5 draft-only, non-authorizing posture packet"],
  ["preserve the v3.7.1 source ids", "preserve the v3.7.5 source ids"],
  ['compact(draft.draft_scope).includes("v3.7.1")', 'compact(draft.draft_scope).includes("v3.7.5")'],
  ['[["v3.7.1"], ["question handoff"]', '[["v3.7.5"], ["question handoff"]'],
  ["the v3.7.1 handoff", "the v3.7.5 handoff"],
  ['next_gate_required: "Controlled permission execution authorization draft gate"', 'next_gate_required: "Controlled permission execution authorization draft gate re-entry"'],
  ['next_gate_required: "Controlled permission execution authorization draft review gate"', `next_gate_required: "${nextGate}"`],
  ['{ label: "Input", value: "v3.7.1 founder posture" }', '{ label: "Input", value: "v3.7.5 founder posture" }']
]);
write(jsFile, js);

let html = read(pageFile);
html = replaceAll(html, [
  ['<span class="version">v3.7.2 draft</span>', `<span class="version">${releaseBadge}</span>`],
  ["the v3.7.1 founder posture", "the v3.7.5 founder posture"],
  ["v3.7.1 founder posture", "v3.7.5 founder posture"],
  ["VedaPath now carries the v3.7.1 founder posture", "VedaPath now carries the v3.7.5 founder posture"],
  ["<strong>v3.7.1 founder posture</strong>", "<strong>v3.7.5 founder posture</strong>"],
  ['<div class="metric"><span>Current</span><strong>v3.7.2</strong></div>', `<div class="metric"><span>Current</span><strong>${release}</strong></div>`],
  ['<div class="metric"><span>Input</span><strong>v3.7.1</strong></div>', `<div class="metric"><span>Input</span><strong>${inputRelease}</strong></div>`],
  ["Draft the review candidate. Keep authority closed.", "Draft one review candidate. Keep authority closed."],
  ["Founder posture becomes reviewable language.", "Founder posture becomes one reviewable draft."],
  ["This gate receives the v3.7.5 founder posture, keeps source identity intact, and prepares only a draft-review candidate.", "This gate receives the v3.7.5 founder posture, keeps source identity intact, and prepares one draft-review candidate only."],
  ["No execution, storage, release, or production.", "No execution, storage, release, or production opens."]
]);
write(pageFile, html);

const cssMarker = "/* VEDAPATH v3.7.6 CONTROLLED DRAFT GATE RE-ENTRY */";
const cssBlock = `

${cssMarker}
body.permission-execution-draft-page.vp-command-shell-ready main.workspace {
  grid-template-columns: minmax(214px, 0.54fr) minmax(0, 2.24fr) minmax(218px, 0.58fr);
}

body.permission-execution-draft-page .draft-gate {
  border-color: rgba(20, 92, 74, 0.16);
  background:
    radial-gradient(circle at 92% 8%, rgba(224, 168, 59, 0.08), transparent 24%),
    linear-gradient(135deg, rgba(255, 255, 252, 0.99), rgba(255, 250, 244, 0.94));
}

body.permission-execution-draft-page .draft-gate h1 {
  max-width: 730px;
  font-size: clamp(1.55rem, 1.34vw, 2rem);
  line-height: 1.1;
}

body.permission-execution-draft-page .draft-gate-head {
  min-height: 96px;
}

body.permission-execution-draft-page .draft-step-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

body.permission-execution-draft-page .draft-step,
body.permission-execution-draft-page .draft-relay div,
body.permission-execution-draft-page .draft-gate-card,
body.permission-execution-draft-page .draft-gate-form,
body.permission-execution-draft-page .draft-gate-result {
  box-shadow: 0 12px 34px rgba(33, 24, 16, 0.035);
}

body.permission-execution-draft-page .draft-relay div {
  border-left-color: rgba(20, 92, 74, 0.32);
}

body.permission-execution-draft-page .draft-gate-form label {
  gap: 6px;
}

body.permission-execution-draft-page .draft-gate-form input,
body.permission-execution-draft-page .draft-gate-form select,
body.permission-execution-draft-page .draft-gate-form textarea {
  min-height: 42px;
}

body.permission-execution-draft-page .draft-gate-result .draft-gate-list {
  gap: 10px;
}

@media (max-width: 980px) {
  body.permission-execution-draft-page .draft-step-grid,
  body.permission-execution-draft-page .draft-gate-result .draft-gate-list {
    grid-template-columns: 1fr;
  }
}
`;
let css = read(cssFile);
const cssMarkerIndex = css.indexOf(cssMarker);
if (cssMarkerIndex !== -1) css = css.slice(0, cssMarkerIndex).trimEnd();
css += cssBlock;
write(cssFile, css);

let shell = read(shellFile);
shell = shell.replace(/const releaseBadge = "v3\.7\.\d+ [^"]+";/, `const releaseBadge = "${releaseBadge}";`);
write(shellFile, shell);

let build = read(buildFile);
const releaseRow = `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>`;
if (!build.includes(releaseRow)) {
  build = replaceAll(build, [
    ['<span class="version">v3.7.5 founder</span>', `<span class="version">${releaseBadge}</span>`],
    ["<strong>v3.7.5</strong>\n          <p>Founder Permission Execution Authorization Decision Gate Re-entry: the founder decision gate now receives the v3.7.4 review-decision packet and records draft-only, hold, return, or reject posture while authority stays closed.</p>", `<strong>${release}</strong>\n          <p>Controlled Permission Execution Authorization Draft Gate Re-entry: the draft gate now receives the v3.7.5 founder posture packet and prepares one draft-review candidate while authority stays closed.</p>`],
    ["The trust chain now carries the v3.7.4 review-decision packet into founder posture without turning decision readiness into permission, authorization, execution, storage, public release, or production.", "The trust chain now carries the v3.7.5 founder posture into controlled draft language without turning draft readiness into permission, authorization, execution, storage, public release, or production."],
    ["<strong>Controlled permission execution authorization draft gate re-entry</strong>\n          <p>Receive the v3.7.5 founder posture packet and prepare controlled draft candidate language while every authority flag remains false.</p>", `<strong>Controlled permission execution authorization draft review gate re-entry</strong>\n          <p>Review the v3.7.6 controlled draft packet before any later authorization posture while every authority flag remains false.</p>`]
  ]);
  build = replaceOnce(
    build,
    `<article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 336: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
                <p>Receive the v3.7.5 founder posture packet and prepare controlled draft candidate language while every authority and production flag remains false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
    `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 336: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
                <p>Receive the v3.7.5 founder posture packet and prepare controlled draft candidate language while every authority and production flag remains false.</p>
              </div>
              <div class="percent">100%</div>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 337: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
                <p>Receive the v3.7.6 controlled draft packet and prepare review-decision candidate language while every authority and production flag remains false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
    "phase 336 update"
  );
  build = replaceAll(build, [
    ["v3.7.5 Founder Permission Execution Authorization Decision Gate Re-entry", `${release} ${releaseName}`],
    ["v3.7.4 Controlled Permission Execution Authorization Review Decision Gate Re-entry", previousRelease],
    ["Record founder posture from the v3.7.4 review-decision packet without granting permission, approving authorization, or enabling execution.", "Prepare controlled draft-review candidate language from the v3.7.5 founder posture packet without granting permission, approving authorization, or enabling execution."],
    ["Ready for controlled draft gate re-entry", "Ready for controlled draft review gate re-entry"],
    ["Re-enter the controlled permission execution authorization draft gate.", "Re-enter the controlled permission execution authorization draft review gate."],
    ["Receive the v3.7.5 founder posture packet without granting authorization or execution.", "Receive the v3.7.6 controlled draft packet without granting authorization or execution."]
  ]);
}
write(buildFile, build);

const readmeBlock = `## v3.7.6 Controlled Permission Execution Authorization Draft Gate Re-entry

- Re-enters the controlled draft gate from the v3.7.5 founder posture packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit.
- Prepares one draft-review candidate only while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.
- Refines the draft gate UI with current v3.7.5 input language, a quieter draft heading, calmer relay cards, and a clearer v3.7.6 command-shell badge.`;
let readme = read(readmeFile);
readme = insertBefore(readme, "## v3.7.5 Founder Permission Execution Authorization Decision Gate Re-entry", readmeBlock, "README v3.7.5");
write(readmeFile, readme);

const notesBlock = `## v3.7.6 Controlled Permission Execution Authorization Draft Gate Re-entry

- Re-enters the controlled draft gate from the v3.7.5 founder posture packet.
- Preserves founder posture id, source identity, route, questions, and authority audit before draft-review candidate readiness.
- Adds calmer draft-gate polish: current v3.7.5 incoming packet, one reviewable draft candidate, tighter title rhythm, current command-shell badge, and no authority opening.`;
let notes = read(notesFile);
notes = insertBefore(notes, "## v3.7.5 Founder Permission Execution Authorization Decision Gate Re-entry", notesBlock, "prototype notes v3.7.5");
write(notesFile, notes);

const blueprintBlock = `### 353. Controlled Permission Execution Authorization Draft Gate Re-entry

Controlled Permission Execution Authorization Draft Gate Re-entry should receive the v3.7.5 founder posture packet and prepare only controlled draft-review candidate language while every authority flag remains false.

It should:

- accept only the v3.7.5 founder permission execution authorization decision output
- preserve founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit
- output controlled draft readiness and draft-review candidate readiness only after the handoff stays intact
- keep permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production unavailable
- move only to the controlled permission execution authorization draft review gate re-entry
- make the draft gate feel like a calm writing desk where posture can become reviewable language without becoming authority`;
let blueprint = read(blueprintFile);
blueprint = insertBefore(blueprint, "## Strategic Difference", blueprintBlock, "blueprint strategic marker");
write(blueprintFile, blueprint);

const draftDoc = `# Controlled Permission Execution Authorization Draft Gate

Controlled Permission Execution Authorization Draft Gate Re-entry accepts the v3.7.5 founder posture packet and turns it into draft-review candidate language only.

It must not grant permission, approve authorization, execute, store, write canonical records, publish, launch production, or imply founder instruction.

## v3.7.6 Re-entry

- Requires release \`v3.7.5\`.
- Preserves the v3.7.5 founder posture gate id before any draft candidate can be prepared.
- Preserves review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, and authority flag audit.
- Outputs \`controlled_permission_execution_authorization_draft_ready=true\`, \`permission_execution_authorization_draft_recorded=true\`, and \`controlled_permission_execution_authorization_draft_review_candidate_ready=true\` only for reviewable draft language.
- Keeps every permission, authorization, execution, storage, canonical write, public release, and production flag false.
- Moves only to the controlled permission execution authorization draft review gate re-entry.

## v3.7.2 Re-entry

- Re-anchors the draft gate to the latest v3.7.1 founder decision output.
- Preserves founder posture id, source identity, route, questions, and authority audit before draft-review candidate readiness.
- Adds calmer draft-room polish: current v3.7.1 incoming packet, softer review-room surface, smaller title rhythm, current command-shell badge, and one outgoing draft-review candidate only.

## v3.6.8 Re-entry

- Re-anchors the draft gate to the latest v3.6.7 founder decision output.
- Preserves founder posture id, source identity, route, questions, and authority audit before draft-review candidate readiness.
- Adds calmer draft-room polish: current v3.6.7 incoming packet, softer review-room surface, smaller title rhythm, current command-shell badge, and one outgoing draft-review candidate only.

## v3.6.4 Re-entry

- Re-anchors the draft gate to the latest v3.6.3 founder decision output.
- Preserves founder posture id, source identity, route, questions, and authority audit before draft-review candidate readiness.
- Adds calmer draft-room polish: current v3.6.3 incoming packet, softer review-room surface, smaller title rhythm, and one outgoing draft-review candidate only.
`;
write(draftDocFile, draftDoc);

console.log(`${release} ${releaseName} applied.`);

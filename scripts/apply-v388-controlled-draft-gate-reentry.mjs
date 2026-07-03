import fs from "node:fs";

const release = "v3.8.8";
const inputRelease = "v3.8.7";
const releaseBadge = "v3.8.8 draft";
const releaseName = "Controlled Permission Execution Authorization Draft Gate Re-entry";
const previousRelease = "v3.8.7 Founder Permission Execution Authorization Decision Gate Re-entry";
const nextRelease = "v3.8.9 Controlled Permission Execution Authorization Draft Review Gate Re-entry";
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

function replaceRequired(text, from, to, label = from) {
  if (!text.includes(from)) throw new Error(`Missing replacement target: ${label}`);
  return text.replace(from, to);
}

function replaceAllRequired(text, from, to, label = from) {
  if (!text.includes(from)) throw new Error(`Missing replacement target: ${label}`);
  return text.split(from).join(to);
}

function replaceAllIfPresent(text, from, to) {
  return text.includes(from) ? text.split(from).join(to) : text;
}

function requireText(text, target, label = target) {
  if (!text.includes(target)) throw new Error(`Missing expected text: ${label}`);
  return text;
}

function replaceRegex(text, regex, to, label) {
  if (!regex.test(text)) throw new Error(`Missing regex replacement target: ${label}`);
  return text.replace(regex, to);
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
const falseFlags = Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));
const sourceFields = {
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

const sampleFounderDecisionPacket = {
  schema_version: founderData.schema_version,
  release: founderData.release,
  decision_status: "Draft-only founder decision recorded; execution remains false.",
  founder_decision_outcome: "Draft-only",
  ...founderDecision,
  review_decision_ready: true,
  review_decision_recorded: true,
  controlled_permission_execution_authorization_review_decision_ready: true,
  founder_permission_execution_authorization_decision_candidate_ready: true,
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true,
  ...falseFlags,
  preserves_review_route: true,
  preserves_source_identity: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  next_gate_required: "Controlled permission execution authorization draft gate re-entry",
  created_at: "2026-07-04T00:00:00.000Z"
};

const falseClause = falseAuthorityFlags.map((flag) => `${flag} remains false`).join(", ");
const draftClause = `Controlled permission execution authorization draft gate re-entry only; founder_permission_execution_authorization_decision_ready may be true, founder_permission_execution_authorization_decision_recorded may be true, controlled_permission_execution_authorization_draft_candidate_ready may be true, controlled_permission_execution_authorization_draft_ready may be true, permission_execution_authorization_draft_recorded may be true, and controlled_permission_execution_authorization_draft_review_candidate_ready may be true, but ${falseClause}.`;

draftData.schema_version = "controlled-permission-execution-authorization-draft-gate-v6";
draftData.release = release;
draftData.generated_at = "2026-07-04";
draftData.title = releaseName;
draftData.summary = `Re-enters the controlled draft gate from the ${inputRelease} founder posture packet, preserves source identity, founder posture id, route, questions, and authority audit, and prepares one draft-review candidate while every permission, authorization, execution, storage, public release, and production path remains disabled.`;
draftData.previous_release = previousRelease;
draftData.source_release = previousRelease;
draftData.input_release = inputRelease;
draftData.next_gate = nextGate;
draftData.source = sourceFields;
draftData.draft_checks = [
  { check: "Input packet", rule: `Must be the ${inputRelease} draft-only founder posture packet.` },
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
  ...sourceFields,
  draft_scope: `Prepare reviewable wording for the ${inputRelease} founder posture packet only. The draft can be inspected by the next review gate, but it cannot grant permission, approve authorization, execute, store, update canonical records, publish, launch, or run any production path.`,
  draft_language: `Controlled draft-review candidate for the ${inputRelease} founder posture packet: preserve the reviewed source ids, founder posture id, route, founder question, permission question, and authority audit. The draft is only language for review. It does not open execution, storage, canonical writes, public release, or production.`,
  draft_rationale: `The ${inputRelease} founder posture is draft-only and source-locked. It can become reviewable language because the question handoff, source ids, founder posture id, and authority flag audit are intact. This is not a live authorization; it is only a controlled draft candidate for the next draft review gate.`,
  draft_evidence_summary: `Input release ${inputRelease} has founder_permission_execution_authorization_decision_ready=true, founder_permission_execution_authorization_decision_recorded=true, controlled draft candidate ready=true, the authority flag audit preserved, and every authority, execution, storage, canonical, public release, and production flag false.`,
  non_execution_draft_clause: draftClause,
  risk_acknowledgment: `Risk remains: ${inputRelease} founder posture mismatch, founder posture id mismatch, review decision id mismatch, draft review id mismatch, draft gate id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, source id mismatch, rights change, ambiguous draft language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.`,
  rollback_condition: `Rollback by returning to the ${inputRelease} founder decision gate and requiring a fresh non-authorizing founder posture before any draft-review candidate is prepared again.`,
  monitoring_condition: `Monitor only the frozen ${inputRelease} founder posture id, route, questions, source ids, authority audit, and false authority flags before preparing the controlled draft review candidate.`,
  stop_condition: `Stop if the ${inputRelease} founder posture id, founder decision id, review decision gate id, draft review gate id, draft gate id, review route, founder question, permission question, authority flag audit, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, storage, canonical, public release, or production flag is true.`,
  expiry_check: `Controlled permission execution authorization draft gate re-entry expires at the next material ${inputRelease} founder posture, review decision, draft review, draft, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.`,
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  next_gate: nextGate,
  next_gate_required: nextGate,
  clarification_question: `Which exact ${inputRelease} founder posture packet should this draft-review candidate carry, and which single draft boundary should remain most visible?`,
  return_reason: `Return if the ${inputRelease} founder posture packet loses route, question, audit, founder posture id, or source identity clarity.`,
  hold_reason: `Hold until the reviewer can see the exact ${inputRelease} founder posture packet, source ids, route, questions, and authority audit.`,
  block_reason: `Block if any authority flag becomes true or the ${inputRelease} handoff is changed.`,
  release
};
draftData.boundary = {
  ...draftData.boundary,
  next_gate_required: nextGate,
  ...falseFlags
};
write(draftDataFile, `${JSON.stringify(draftData, null, 2)}\n`);

let js = read(jsFile);
if (js.includes('packet.release === "v3.8.3"')) {
  js = replaceAllRequired(js, 'packet.release === "v3.8.3"', `packet.release === "${inputRelease}"`, "draft gate packet release");
} else {
  requireText(js, `packet.release === "${inputRelease}"`, "draft gate packet release");
}
js = replaceAllIfPresent(js, "v3.8.3", inputRelease);
write(jsFile, js);

let html = read(pageFile);
if (html.includes('<span class="version">v3.8.4 draft</span>')) {
  html = replaceAllRequired(html, '<span class="version">v3.8.4 draft</span>', `<span class="version">${releaseBadge}</span>`, "page version badge");
} else {
  requireText(html, `<span class="version">${releaseBadge}</span>`, "page version badge");
}
html = replaceAllIfPresent(html, "v3.8.3 founder posture", `${inputRelease} founder posture`);
html = replaceAllIfPresent(html, "<strong>v3.8.3</strong>", `<strong>${inputRelease}</strong>`);
if (html.includes("<strong>v3.8.4</strong>")) {
  html = replaceAllRequired(html, "<strong>v3.8.4</strong>", `<strong>${release}</strong>`, "page current release");
} else {
  requireText(html, `<strong>${release}</strong>`, "page current release");
}
html = html.replace("Draft calmly. Review before authority.", "Draft one careful packet.");
html = html.replace("One posture becomes one reviewable draft.", "One posture, one quiet draft.");
html = html.replace("Controlled draft desk", "Quiet draft desk");
html = html.replace("This release prepares a controlled draft review gate. It does not authorize or execute anything.", "This release prepares a controlled draft-review gate. It does not authorize, execute, store, publish, or launch.");
write(pageFile, html);

let css = read(cssFile);
const cssBlock = `
/* VEDAPATH v3.8.8 CONTROLLED DRAFT GATE RE-ENTRY */
body.permission-execution-draft-page .draft-gate {
  background:
    radial-gradient(circle at 94% 8%, rgba(224, 168, 59, 0.075), transparent 24%),
    radial-gradient(circle at 0% 100%, rgba(20, 92, 74, 0.04), transparent 30%),
    linear-gradient(135deg, rgba(255, 255, 253, 0.99), rgba(255, 251, 246, 0.96));
}

body.permission-execution-draft-page .draft-gate h1 {
  font-size: clamp(1.55rem, 1.35vw, 2rem);
  letter-spacing: 0;
}

body.permission-execution-draft-page .draft-gate-head {
  align-items: center;
}

body.permission-execution-draft-page .draft-relay,
body.permission-execution-draft-page .draft-step-grid {
  gap: 12px;
}

body.permission-execution-draft-page .draft-relay div,
body.permission-execution-draft-page .draft-step,
body.permission-execution-draft-page .draft-gate-card,
body.permission-execution-draft-page .draft-gate-form,
body.permission-execution-draft-page .draft-gate-result {
  border-color: rgba(86, 99, 80, 0.14);
  box-shadow: 0 16px 34px rgba(33, 24, 16, 0.032);
}

body.permission-execution-draft-page .draft-gate-form textarea {
  min-height: 66px;
}

body.permission-execution-draft-page .draft-gate-output {
  min-height: 230px;
}
`;
if (!css.includes("VEDAPATH v3.8.8 CONTROLLED DRAFT GATE RE-ENTRY")) {
  css = `${css.trim()}\n\n${cssBlock.trim()}\n`;
}
write(cssFile, css);

let shell = read(shellFile);
shell = replaceRegex(shell, /const releaseBadge = "v3\.\d+\.\d+ [^"]+";/, `const releaseBadge = "${releaseBadge}";`, "command shell release badge");
write(shellFile, shell);

let build = read(buildFile);
build = replaceAllRequired(build, `<span class="version">v3.8.7 founder</span>`, `<span class="version">${releaseBadge}</span>`, "build version badge");
build = replaceRequired(
  build,
  `<strong>v3.8.7</strong>
          <p>Founder Permission Execution Authorization Decision Gate Re-entry: the founder gate now receives the v3.8.6 review-decision packet and records draft-only, hold, return, or reject posture while every authority flag stays false.</p>`,
  `<strong>${release}</strong>
          <p>${releaseName}: the draft gate now receives the ${inputRelease} founder posture packet and prepares one draft-review candidate while every authority flag stays false.</p>`,
  "build current version card"
);
build = replaceRequired(
  build,
  "The trust chain now carries the v3.8.6 review-decision packet into founder posture without turning readiness into permission, authorization, execution, storage, public release, or production.",
  `The trust chain now carries the ${inputRelease} founder posture into controlled draft language without turning readiness into permission, authorization, execution, storage, public release, or production.`,
  "build full vision copy"
);
build = replaceRequired(
  build,
  `<strong>Controlled permission execution authorization draft gate re-entry</strong>
          <p>Use the founder posture packet to prepare controlled draft language while every execution path remains closed.</p>`,
  `<strong>Controlled permission execution authorization draft review gate re-entry</strong>
          <p>Review the ${release} controlled draft packet before any later authorization posture while every authority flag remains false.</p>`,
  "build next release card"
);
build = replaceRegex(
  build,
  /<article class="phase">\s*(?:<span class="badge later">Later<\/span>\s*)?<div>\s*<strong>Phase 348: Controlled Permission Execution Authorization Draft Gate Re-entry<\/strong>\s*<p>Use the v3\.8\.7 founder posture packet to prepare controlled draft language while authority, storage, public release, and production remain false\.<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
  `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 348: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
                <p>Use the v3.8.7 founder posture packet to prepare controlled draft language while authority, storage, public release, and production remain false.</p>
              </div>
              <div class="percent">100%</div>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 349: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
                <p>Review the v3.8.8 controlled draft packet while permission, authorization, execution, storage, public release, and production remain false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
  "phase 348 update"
);
build = replaceRequired(build, `<div class="version-row"><span>Release</span><strong>v3.8.7 Founder Permission Execution Authorization Decision Gate Re-entry</strong></div>`, `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>`, "build version release row");
build = replaceRequired(build, `<div class="version-row"><span>Previous</span><strong>v3.8.6 Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong></div>`, `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`, "build version previous row");
build = replaceRequired(build, `<div class="version-row"><span>Goal</span><strong>Record founder posture for the v3.8.6 review-decision packet without granting permission, approving authorization, or enabling execution.</strong></div>`, `<div class="version-row"><span>Goal</span><strong>Prepare controlled draft-review candidate language from the ${inputRelease} founder posture packet without granting permission, approving authorization, or enabling execution.</strong></div>`, "build goal row");
build = replaceRequired(build, `<div class="version-row"><span>Status</span><strong>Ready for controlled draft gate re-entry</strong></div>`, `<div class="version-row"><span>Status</span><strong>Ready for controlled draft review gate re-entry</strong></div>`, "build status row");
build = replaceRequired(
  build,
  `<li><span class="dot"></span><span>Re-enter the controlled permission execution authorization draft gate.</span></li>
              <li><span class="dot"></span><span>Receive the v3.8.7 founder posture packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Preserve source identity, founder posture id, questions, route, and authority audit.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  `<li><span class="dot"></span><span>Re-enter the controlled permission execution authorization draft review gate.</span></li>
              <li><span class="dot"></span><span>Receive the ${release} controlled draft packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Preserve founder posture id, source ids, route, questions, and authority audit.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  "build checklist"
);
write(buildFile, build);

const readmeBlock = `## ${release} ${releaseName}

- Re-enters the controlled draft gate from the ${inputRelease} founder posture packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit.
- Prepares one draft-review candidate only while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.
- Softens the draft page into a quieter writing desk: smaller title rhythm, calmer input copy, current ${inputRelease} handoff language, and the ${releaseBadge} command-shell badge.
- Updates [Controlled Permission Execution Authorization Draft Gate](controlledpermissionexecutionauthorizationdraftgate.html), [Controlled Permission Execution Authorization Draft Gate Data](data/vedapath-controlled-permission-execution-authorization-draft-gate.json), and [Controlled Permission Execution Authorization Draft Gate Notes](docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_GATE.md).`;
let readme = read(readmeFile);
readme = insertBefore(readme, "## v3.8.7 Founder Permission Execution Authorization Decision Gate Re-entry", readmeBlock, "README v3.8.7");
write(readmeFile, readme);

const notesBlock = `## ${release} ${releaseName}

- Re-enters the controlled draft gate from the ${inputRelease} founder posture packet.
- Prepares one controlled draft-review candidate while every authority, execution, storage, public release, and production flag remains false.
- Adds quieter draft-gate polish: one careful packet, current founder-posture input, softer cards, and a current command-shell badge.
- Sets the build tracker to Phase 349: controlled draft review gate re-entry.`;
let notes = read(notesFile);
notes = insertBefore(notes, "## v3.8.7 Founder Permission Execution Authorization Decision Gate Re-entry", notesBlock, "prototype notes v3.8.7");
write(notesFile, notes);

const blueprintBlock = `### 361. Controlled Permission Execution Authorization Draft Gate Re-entry

Controlled Permission Execution Authorization Draft Gate Re-entry should receive the ${inputRelease} founder posture packet and prepare only controlled draft-review candidate language while every authority flag remains false.

It should:

- accept only the ${inputRelease} founder permission execution authorization decision output
- preserve founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit
- output controlled draft readiness and draft-review candidate readiness only after the handoff stays intact
- keep permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production unavailable
- move only to the controlled permission execution authorization draft review gate re-entry
- make the draft gate feel like a quiet writing desk where founder posture becomes reviewable language without becoming authority`;
let blueprint = read(blueprintFile);
blueprint = insertBefore(blueprint, "## Strategic Difference", blueprintBlock, "blueprint strategic marker");
write(blueprintFile, blueprint);

let draftDoc = read(draftDocFile);
draftDoc = draftDoc.replace(
  "Controlled Permission Execution Authorization Draft Gate Re-entry accepts the v3.8.3 founder posture packet and turns it into draft-review candidate language only.",
  `Controlled Permission Execution Authorization Draft Gate Re-entry accepts the ${inputRelease} founder posture packet and turns it into draft-review candidate language only.`
);
const draftDocBlock = `## ${release} Re-entry

- Requires schema \`founder-permission-execution-authorization-decision-gate-v6\`.
- Requires release \`${inputRelease}\`.
- Preserves the ${inputRelease} founder posture gate id before any draft candidate can be prepared.
- Preserves review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, and authority flag audit.
- Outputs \`controlled_permission_execution_authorization_draft_ready=true\`, \`permission_execution_authorization_draft_recorded=true\`, and \`controlled_permission_execution_authorization_draft_review_candidate_ready=true\` only for reviewable draft language.
- Keeps every permission, authorization, execution, storage, canonical write, public release, and production flag false.
- Moves only to the controlled permission execution authorization draft review gate re-entry.`;
draftDoc = insertBefore(draftDoc, "## v3.8.4 Re-entry", draftDocBlock, "draft doc v3.8.4 marker");
write(draftDocFile, draftDoc);

console.log(`${release} ${releaseName} applied`);

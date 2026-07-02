import fs from "node:fs";

const release = "v3.7.9";
const inputRelease = "v3.7.8";
const releaseName = "Founder Permission Execution Authorization Decision Gate Re-entry";
const releaseBadge = "v3.7.9 founder";
const previousRelease = "v3.7.8 Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const nextGate = "Controlled permission execution authorization draft gate re-entry";
const inputNextGate = "Founder permission execution authorization decision gate re-entry";

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

const sourceFields = [
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
  "authority_flag_audit"
];

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function write(path, value) {
  fs.writeFileSync(path, value);
}

function readJson(path) {
  return JSON.parse(read(path));
}

function writeJson(path, value) {
  write(path, `${JSON.stringify(value, null, 2)}\n`);
}

function replaceRequired(text, from, to, label = from) {
  if (!text.includes(from)) {
    throw new Error(`Missing expected text for ${label}`);
  }
  return text.replace(from, to);
}

function insertBefore(text, marker, block) {
  if (text.includes(block.trim())) return text;
  return replaceRequired(text, marker, `${block}\n${marker}`, marker);
}

function allFalse() {
  return Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));
}

function pickSource(packet) {
  return Object.fromEntries(sourceFields.map((key) => [key, packet[key]]));
}

function nonExecutionClause() {
  const allowedTrue = [
    "review_decision_ready may be true",
    "review_decision_recorded may be true",
    "founder_permission_execution_authorization_decision_candidate_ready may be true",
    "founder_permission_execution_authorization_decision_ready may be true",
    "founder_permission_execution_authorization_decision_recorded may be true",
    "controlled_permission_execution_authorization_draft_candidate_ready may be true"
  ];
  const falseClauses = falseAuthorityFlags.map((flag) => `${flag} remains false`);
  return `Founder permission execution authorization decision gate re-entry only; ${allowedTrue.join(", ")}, but ${falseClauses.join(", ")}.`;
}

const reviewPath = "data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json";
const founderPath = "data/vedapath-founder-permission-execution-authorization-decision-gate.json";
const reviewData = readJson(reviewPath);
const founderData = readJson(founderPath);
const incomingDecision = reviewData.sample_decision;

const sampleReviewDecisionPacket = {
  schema_version: reviewData.schema_version,
  release: inputRelease,
  input_release: reviewData.input_release,
  decision_status: "Ready for founder decision; no authority granted.",
  review_decision_outcome: "Ready",
  ...incomingDecision,
  next_gate_required: inputNextGate,
  preserves_review_route: true,
  preserves_source_identity: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  created_at: "2026-07-02T00:00:00.000Z"
};

const sampleDecision = {
  ...pickSource(sampleReviewDecisionPacket),
  decision_state: "Draft-only founder decision recorded",
  decision_actor: "Founder",
  founder_name: "Founder sample",
  decision_scope: `Record founder posture for the ${inputRelease} review-decision packet only. The record may create one later controlled draft candidate, but it cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, launch production, or run any system.`,
  founder_decision_language: `Founder posture: draft-only record for the ${inputRelease} review-decision packet. It may feed one later controlled draft gate only. It grants nothing; every permission, authorization, execution, storage, canonical, public release, and production flag remains false.`,
  decision_rationale: `The ${inputRelease} review-decision packet is ready for founder posture because the question handoff, authority flag audit, founder posture id, source ids, and draft gate lineage are intact. This is not a live authorization; it is only a posture record for the next controlled draft gate.`,
  decision_evidence_summary: `Input release ${inputRelease} has review_decision_ready=true, review_decision_recorded=true, founder decision candidate ready=true, and every authority, execution, storage, canonical, public release, and production flag false.`,
  non_execution_decision_clause: nonExecutionClause(),
  risk_acknowledgment: `Risk remains: ${inputRelease} review-decision packet mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, founder posture id mismatch, route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, source mismatch, rights change, ambiguous founder language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.`,
  rollback_condition: `Rollback by returning to the ${inputRelease} review-decision gate and requiring a fresh non-authorizing review decision packet before any founder posture is recorded again.`,
  monitoring_condition: `Monitor only the frozen ${inputRelease} packet ids, route, questions, source ids, authority audit, and false authority flags before preparing a later controlled draft candidate.`,
  stop_condition: `Stop if the ${inputRelease} review-decision packet, review decision id, draft review gate id, draft gate id, founder posture id, route, founder question, permission question, authority flag audit, incoming founder id, authorization review id, preflight id, hold id, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, storage, canonical, public release, or production flag is true.`,
  expiry_check: `Founder permission execution authorization decision gate re-entry expires at the next material ${inputRelease} review-decision packet, draft review, draft, founder posture, authorization review, preflight, hold, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.`,
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  clarification_question: `Which single founder posture should be recorded for the ${inputRelease} review-decision packet: draft-only, hold, return, or reject?`,
  return_reason: `Return if the ${inputRelease} review-decision language loses route, question, audit, founder posture id, or source identity clarity.`,
  hold_reason: `Hold until the founder can see the exact ${inputRelease} review-decision packet, founder posture id, source ids, route, questions, and authority audit.`,
  block_reason: "Block if any language implies permission, authorization, execution, storage, canonical write, public release, or production launch.",
  review_decision_ready: true,
  review_decision_recorded: true,
  controlled_permission_execution_authorization_review_decision_ready: true,
  founder_permission_execution_authorization_decision_candidate_ready: true,
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true,
  ...allFalse(),
  next_gate: nextGate,
  next_gate_required: nextGate,
  release
};

founderData.schema_version = "founder-permission-execution-authorization-decision-gate-v6";
founderData.release = release;
founderData.input_release = inputRelease;
founderData.generated_at = "2026-07-02";
founderData.title = releaseName;
founderData.summary = `Re-enters the founder decision gate from the ${inputRelease} review-decision packet, preserves source identity, founder posture id, route, questions, and authority audit, and records draft-only, hold, return, or reject posture while every permission, authorization, execution, storage, public release, and production path remains disabled.`;
founderData.previous_release = previousRelease;
founderData.source_release = previousRelease;
founderData.next_gate = nextGate;
founderData.source = {
  review_decision_release: inputRelease,
  review_decision_schema: reviewData.schema_version,
  ...pickSource(sampleReviewDecisionPacket)
};
founderData.decision_modes = [
  {
    mode: "Draft-only",
    state: "Draft-only founder decision recorded",
    label: "Draft Only",
    summary: "Founder records only a later draft candidate. Nothing may run."
  },
  {
    mode: "Hold",
    state: "Founder hold recorded",
    label: "Hold",
    summary: "Founder keeps the packet paused for more evidence."
  },
  {
    mode: "Return",
    state: "Return to review decision",
    label: "Return",
    summary: "Founder sends the packet back to review-decision repair."
  },
  {
    mode: "Reject",
    state: "Founder reject recorded",
    label: "Reject",
    summary: "Founder closes this packet path without execution."
  }
];
founderData.decision_checks = [
  {
    check: "Input packet",
    rule: `Must be the ${inputRelease} review-decision packet.`
  },
  {
    check: "Source identity",
    rule: "All gate ids, founder posture id, and source ids must match the incoming review decision."
  },
  {
    check: "Question handoff",
    rule: "Route, founder question, and permission question must remain unchanged."
  },
  {
    check: "Authority audit",
    rule: "Every authority audit flag must remain false."
  },
  {
    check: "Founder posture",
    rule: "Draft-only, hold, return, and reject are decisions, not permissions."
  },
  {
    check: "Production boundary",
    rule: "Production remains unavailable."
  }
];
founderData.sample_review_decision_packet = sampleReviewDecisionPacket;
founderData.sample_authorization_review_packet = sampleReviewDecisionPacket;
founderData.sample_decision = sampleDecision;
founderData.boundary = {
  review_decision_ready: false,
  review_decision_recorded: false,
  controlled_permission_execution_authorization_review_decision_ready: false,
  founder_permission_execution_authorization_decision_candidate_ready: false,
  founder_permission_execution_authorization_decision_ready: false,
  founder_permission_execution_authorization_decision_recorded: false,
  controlled_permission_execution_authorization_draft_candidate_ready: false,
  ...allFalse(),
  next_gate_required: nextGate
};
writeJson(founderPath, founderData);

let gateJs = read("assets/vedapath-founder-permission-execution-authorization-decision-gate.js");
gateJs = gateJs.replaceAll("v3.7.4", inputRelease);
gateJs = gateJs.replaceAll(
  'packet.next_gate_required === "Founder permission execution authorization decision gate"',
  `packet.next_gate_required === "${inputNextGate}"`
);
gateJs = gateJs.replaceAll(
  'next_gate_required: "Founder permission execution authorization decision gate"',
  `next_gate_required: "${inputNextGate}"`
);
write("assets/vedapath-founder-permission-execution-authorization-decision-gate.js", gateJs);

let page = read("founderpermissionexecutionauthorizationdecisiongate.html");
page = page.replaceAll("v3.7.4", inputRelease).replaceAll("v3.7.5", release);
page = page.replaceAll("v3.7.9 founder", releaseBadge);
page = page.replace("Choose posture. Keep product still.", "Choose posture. Preserve the calm.");
page = page.replace("Choose posture. Keep authority closed.", "Choose posture. Keep the chain calm.");
page = page.replace(
  "This gate receives the v3.7.8 review-decision packet and records founder posture only. It cannot grant permission, approve authorization, execute, store, publish, or launch.",
  "This gate receives the v3.7.8 review-decision packet and records founder posture only. It cannot grant permission, approve authorization, execute, store, publish, or launch."
);
page = page.replace(
  "Draft-only, hold, or reject without authority.",
  "Draft-only, hold, return, or reject without authority."
);
page = page.replace("v3.7.8 review decision", "v3.7.8 review decision");
write("founderpermissionexecutionauthorizationdecisiongate.html", page);

let css = read("assets/vedapath-founder-permission-execution-authorization-decision-gate.css");
const cssBlock = `
/* VEDAPATH v3.7.9 FOUNDER DECISION RE-ENTRY */
body.vp-command-shell-ready.permission-execution-decision-page main.workspace {
  grid-template-columns: minmax(206px, 0.52fr) minmax(0, 2.3fr) minmax(214px, 0.58fr);
}

body.permission-execution-decision-page .founder-decision {
  gap: 14px;
  border-color: rgba(20, 92, 74, 0.16);
  background:
    radial-gradient(circle at 94% 6%, rgba(20, 92, 74, 0.072), transparent 23%),
    linear-gradient(135deg, rgba(255, 255, 252, 0.99), rgba(255, 250, 244, 0.94));
}

body.permission-execution-decision-page .founder-decision h1 {
  max-width: 740px;
  font-size: clamp(1.58rem, 1.34vw, 2.02rem);
}

body.permission-execution-decision-page .founder-decision-head .muted,
body.permission-execution-decision-page .founder-decision p {
  line-height: 1.55;
}

body.permission-execution-decision-page .founder-decision-choice,
body.permission-execution-decision-page .founder-decision-meridian article,
body.permission-execution-decision-page .founder-decision-card,
body.permission-execution-decision-page .founder-decision-result,
body.permission-execution-decision-page .handoff-quiet {
  background: rgba(255, 255, 252, 0.78);
  box-shadow: 0 10px 28px rgba(35, 43, 31, 0.042);
}

body.permission-execution-decision-page .founder-decision-choice[aria-pressed="true"] {
  border-color: rgba(214, 90, 31, 0.52);
  background: linear-gradient(180deg, rgba(255, 238, 228, 0.86), rgba(255, 253, 248, 0.9));
}

body.permission-execution-decision-page .founder-decision-form {
  max-height: 620px;
}
`;
if (!css.includes("VEDAPATH v3.7.9 FOUNDER DECISION RE-ENTRY")) {
  css = `${css.trim()}\n\n${cssBlock.trim()}\n`;
  write("assets/vedapath-founder-permission-execution-authorization-decision-gate.css", css);
}

let commandShell = read("assets/vedapath-command-shell.js");
commandShell = replaceRequired(commandShell, 'const releaseBadge = "v3.7.8 decision";', `const releaseBadge = "${releaseBadge}";`);
write("assets/vedapath-command-shell.js", commandShell);

let build = read("build-status.html");
build = build.replaceAll("v3.7.8 decision", releaseBadge);
build = replaceRequired(build, "<strong>v3.7.8</strong>", `<strong>${release}</strong>`, "build current version");
build = replaceRequired(
  build,
  "<p>Controlled Permission Execution Authorization Review Decision Gate Re-entry: the review-decision gate now receives the v3.7.7 draft-review packet and routes only to founder decision, hold, return, or block while authority stays closed.</p>",
  `<p>${releaseName}: the founder gate now receives the ${inputRelease} review-decision packet and records draft-only, hold, return, or reject posture while every authority flag stays false.</p>`
);
build = replaceRequired(
  build,
  "<p>The trust chain now carries the v3.7.7 draft-review packet into a controlled route decision without turning routing readiness into permission, authorization, execution, storage, public release, or production.</p>",
  `<p>The trust chain now carries the ${inputRelease} review-decision packet into founder posture without turning readiness into permission, authorization, execution, storage, public release, or production.</p>`
);
build = replaceRequired(
  build,
  "<strong>Founder permission execution authorization decision gate re-entry</strong>",
  "<strong>Controlled permission execution authorization draft gate re-entry</strong>"
);
build = replaceRequired(
  build,
  "<p>Receive the v3.7.8 review-decision packet and record founder posture while every authority flag remains false.</p>",
  "<p>Use the founder posture packet to prepare controlled draft language while every execution path remains closed.</p>"
);
const oldPhase339 = `<article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 339: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
                <p>Receive the v3.7.8 review-decision packet and record founder posture while permission, authorization, execution, storage, public release, and production remain false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`;
const newPhase339 = `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 339: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
                <p>Receive the v3.7.8 review-decision packet and record founder posture while permission, authorization, execution, storage, public release, and production remain false.</p>
              </div>
              <div class="percent">100%</div>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 340: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
                <p>Use the v3.7.9 founder posture packet to prepare controlled draft language while authority, storage, public release, and production remain false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`;
build = replaceRequired(build, oldPhase339, newPhase339, "phase 339");
build = replaceRequired(
  build,
  '<div class="version-row"><span>Release</span><strong>v3.7.8 Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong></div>',
  `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>`
);
build = replaceRequired(
  build,
  '<div class="version-row"><span>Previous</span><strong>v3.7.7 Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong></div>',
  `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`
);
build = replaceRequired(
  build,
  "<div class=\"version-row\"><span>Goal</span><strong>Route the v3.7.7 draft-review packet without granting permission, approving authorization, or enabling execution.</strong></div>",
  `<div class="version-row"><span>Goal</span><strong>Record founder posture for the ${inputRelease} review-decision packet without granting permission, approving authorization, or enabling execution.</strong></div>`
);
build = replaceRequired(
  build,
  '<div class="version-row"><span>Status</span><strong>Ready for founder decision gate re-entry</strong></div>',
  '<div class="version-row"><span>Status</span><strong>Ready for controlled draft gate re-entry</strong></div>'
);
build = replaceRequired(
  build,
  `<ul class="checklist">
              <li><span class="dot"></span><span>Re-enter the founder permission execution authorization decision gate.</span></li>
              <li><span class="dot"></span><span>Receive the v3.7.8 review-decision packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Preserve source identity, founder posture id, review decision id, questions, route, and authority audit.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>
            </ul>`,
  `<ul class="checklist">
              <li><span class="dot"></span><span>Re-enter the controlled permission execution authorization draft gate.</span></li>
              <li><span class="dot"></span><span>Receive the v3.7.9 founder posture packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Preserve source identity, founder posture id, questions, route, and authority audit.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>
            </ul>`
);
write("build-status.html", build);

const readmeEntry = `## ${release} ${releaseName}

- Re-enters the founder decision gate from the ${inputRelease} review-decision packet.
- Preserves source identity, founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, route, questions, and authority audit.
- Records draft-only, hold, return, or reject as founder posture only while permission, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.
- Refreshes the founder decision UI copy, current input language, command-shell badge, and build tracker for the next controlled draft gate.
- Updates [Founder Permission Execution Authorization Decision Gate](founderpermissionexecutionauthorizationdecisiongate.html), [Founder Permission Execution Authorization Decision Gate Data](data/vedapath-founder-permission-execution-authorization-decision-gate.json), and [Founder Permission Execution Authorization Decision Gate Notes](docs/FOUNDER_PERMISSION_EXECUTION_AUTHORIZATION_DECISION_GATE.md).
`;
let readme = read("README.md");
readme = insertBefore(readme, "## v3.7.8 Controlled Permission Execution Authorization Review Decision Gate Re-entry", readmeEntry);
write("README.md", readme);

const notesEntry = `## ${release} ${releaseName}

- Re-enters the founder decision gate from the ${inputRelease} review-decision packet.
- Records draft-only, hold, return, or reject while every grant remains false.
- Adds calmer founder posture polish: current ${inputRelease} incoming packet, shorter decision title rhythm, current command-shell badge, and one outgoing controlled draft candidate only.
- Keeps permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.
`;
let prototypeNotes = read("docs/PROTOTYPE_NOTES.md");
prototypeNotes = insertBefore(prototypeNotes, "## v3.7.8 Controlled Permission Execution Authorization Review Decision Gate Re-entry", notesEntry);
write("docs/PROTOTYPE_NOTES.md", prototypeNotes);

const blueprintEntry = `### 357. Founder Permission Execution Authorization Decision Gate Re-entry

Founder Permission Execution Authorization Decision Gate Re-entry should receive the v3.7.8 review-decision packet and record founder posture as draft-only, hold, return, or reject while every authority flag remains false.

It should:

- accept only the v3.7.8 controlled permission execution authorization review-decision output
- preserve founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit
- output founder posture readiness and controlled draft candidate readiness only when the draft-only posture is explicit
- keep permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production unavailable
- move only to the controlled permission execution authorization draft gate re-entry
- make the founder decision room feel like a calm founder desk: one current reviewed packet, one posture record, zero authority leakage
`;
let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
blueprint = insertBefore(blueprint, "## Strategic Difference", blueprintEntry);
write("docs/PRODUCT_BLUEPRINT.md", blueprint);

const founderNotes = `# ${releaseName}

Version: ${release}

${releaseName} receives the ${inputRelease} controlled review-decision packet and records founder posture after review-decision readiness.

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

Next gate: ${nextGate}.

## ${release} Re-entry Notes

- Accept only the ${inputRelease} controlled review-decision packet as input.
- Record draft-only, hold, return, or reject as founder posture only.
- Prepare one controlled draft candidate only from an explicit draft-only posture.
- Keep permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.
- Preserve the ${inputRelease} route, source ids, source family, questions, founder posture id, and authority audit.
`;
write("docs/FOUNDER_PERMISSION_EXECUTION_AUTHORIZATION_DECISION_GATE.md", founderNotes);

console.log(`${release} ${releaseName} applied`);

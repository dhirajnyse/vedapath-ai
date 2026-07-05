import fs from "node:fs";

const release = "v4.0.0";
const inputRelease = "v3.9.9";
const releaseBadge = "v4.0.0 draft";
const releaseName = "Controlled Permission Execution Authorization Draft Gate Re-entry";
const previousRelease = "v3.9.9 Founder Permission Execution Authorization Decision Gate Re-entry";
const nextRelease = "v4.0.1 Controlled Permission Execution Authorization Draft Review Gate Re-entry";
const nextGate = "Controlled permission execution authorization draft review gate re-entry";
const generatedAt = "2026-07-05";

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
  "answer_changed",
  "retrieval_config_changed",
  "actual_storage_write_executed",
  "production_ready",
  "production_launch_allowed",
  "public_release_allowed"
];

const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, content) => fs.writeFileSync(file, content);
const readJson = (file) => JSON.parse(read(file));
const writeJson = (file, data) => write(file, `${JSON.stringify(data, null, 2)}\n`);

function replaceRequired(text, from, to, label = from) {
  if (!text.includes(from)) {
    if (text.includes(to)) return text;
    throw new Error(`Missing replacement target: ${label}`);
  }
  return text.replace(from, to);
}

function replaceOrVerify(text, from, to, verify, label) {
  if (text.includes(from)) return text.replace(from, to);
  if (text.includes(verify)) return text;
  throw new Error(`Missing replacement target: ${label}`);
}

function replaceAllIfPresent(text, from, to) {
  return text.includes(from) ? text.split(from).join(to) : text;
}

function replaceRegexRequired(text, regex, to, label) {
  if (!regex.test(text)) throw new Error(`Missing regex replacement target: ${label}`);
  return text.replace(regex, to);
}

function insertBefore(text, marker, block, label) {
  const firstLine = block.trim().split("\n")[0];
  if (text.includes(firstLine)) return text;
  if (!text.includes(marker)) throw new Error(`Missing insertion marker: ${label}`);
  return text.replace(marker, `${block.trim()}\n\n${marker}`);
}

function falseFlagObject() {
  return Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));
}

function falseFlagSentence() {
  return falseAuthorityFlags.map((flag) => `${flag} remains false`).join(", ");
}

const draftData = readJson(draftDataFile);
const founderData = readJson(founderDataFile);
const founderDecision = founderData.sample_decision;

if (founderData.release !== inputRelease || founderDecision.release !== inputRelease) {
  throw new Error(`Expected founder decision release ${inputRelease}`);
}

const falseFlags = falseFlagObject();
const sourceFields = {
  founder_decision_release: inputRelease,
  founder_decision_schema: founderData.schema_version,
  founder_permission_execution_authorization_decision_gate_id:
    founderDecision.founder_permission_execution_authorization_decision_gate_id,
  review_decision_gate_id: founderDecision.review_decision_gate_id,
  controlled_permission_execution_authorization_draft_review_gate_id:
    founderDecision.controlled_permission_execution_authorization_draft_review_gate_id,
  controlled_permission_execution_authorization_draft_gate_id:
    founderDecision.controlled_permission_execution_authorization_draft_gate_id,
  founder_decision_gate_id: founderDecision.founder_decision_gate_id,
  authorization_review_gate_id: founderDecision.authorization_review_gate_id,
  permission_execution_authorization_preflight_id:
    founderDecision.permission_execution_authorization_preflight_id,
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
  ...founderDecision,
  schema_version: founderData.schema_version,
  release: founderData.release,
  input_release: founderData.input_release,
  decision_status: "Draft-only founder decision recorded; execution remains false.",
  founder_decision_outcome: "Draft-only",
  next_gate_required: "Controlled permission execution authorization draft gate re-entry",
  review_decision_ready: true,
  review_decision_recorded: true,
  controlled_permission_execution_authorization_review_decision_ready: true,
  founder_permission_execution_authorization_decision_candidate_ready: true,
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true,
  preserves_review_route: true,
  preserves_source_identity: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  created_at: `${generatedAt}T00:00:00.000Z`,
  ...falseFlags
};

const draftClause = `Controlled permission execution authorization draft gate re-entry only; founder_permission_execution_authorization_decision_ready may be true, founder_permission_execution_authorization_decision_recorded may be true, controlled_permission_execution_authorization_draft_candidate_ready may be true, controlled_permission_execution_authorization_draft_ready may be true, permission_execution_authorization_draft_recorded may be true, and controlled_permission_execution_authorization_draft_review_candidate_ready may be true, but ${falseFlagSentence()}.`;

draftData.schema_version = "controlled-permission-execution-authorization-draft-gate-v8";
draftData.release = release;
draftData.generated_at = generatedAt;
draftData.title = releaseName;
draftData.summary = `Re-enters the controlled draft gate from the ${inputRelease} founder posture packet, preserves source identity, founder posture id, route, questions, and authority audit, and prepares one reviewable draft while every permission, authorization, execution, answer change, retrieval change, storage, public release, and production path remains disabled.`;
draftData.previous_release = previousRelease;
draftData.source_release = previousRelease;
draftData.input_release = inputRelease;
draftData.next_gate = nextGate;
draftData.source = sourceFields;
draftData.draft_checks = [
  { check: "Input packet", rule: `Must be the ${inputRelease} draft-only founder posture packet.` },
  { check: "Source identity", rule: "All gate ids, founder posture id, and source ids must match the incoming founder decision." },
  { check: "Question handoff", rule: "Route, founder question, permission question, and authority flag audit must remain unchanged." },
  { check: "Draft language", rule: "Draft-review language can be prepared, but it cannot imply permission, authorization, execution, answer changes, retrieval changes, storage, public release, or production." },
  { check: "Authority audit", rule: "Every authority, answer-change, retrieval-change, and production flag must remain false." },
  { check: "Next gate", rule: "The only forward path is the controlled draft-review gate re-entry." }
];
draftData.sample_founder_decision_packet = sampleFounderDecisionPacket;
draftData.sample_draft = {
  ...draftData.sample_draft,
  draft_state: "Controlled authorization draft prepared",
  draft_actor: "Controlled draft gate",
  drafter_name: "Draft reviewer sample",
  ...sourceFields,
  draft_scope: `Prepare reviewable wording for the ${inputRelease} founder posture packet only. The draft can be inspected by the next review gate, but it cannot grant permission, approve authorization, execute, change an answer, change retrieval, store, update canonical records, publish, launch, or run any production path.`,
  draft_language: `Controlled draft-review candidate for the ${inputRelease} founder posture packet: preserve the reviewed source ids, founder posture id, route, founder question, permission question, and authority audit. The draft is only language for review. It does not open execution, answer changes, retrieval changes, storage, canonical writes, public release, or production.`,
  draft_rationale: `The ${inputRelease} founder posture is draft-only and source-locked. It can become reviewable language because the question handoff, source ids, founder posture id, and authority flag audit are intact. This is not a live authorization; it is only a controlled draft candidate for the next draft review gate.`,
  draft_evidence_summary: `Input release ${inputRelease} has founder_permission_execution_authorization_decision_ready=true, founder_permission_execution_authorization_decision_recorded=true, controlled draft candidate ready=true, the authority flag audit preserved, answer_changed=false, retrieval_config_changed=false, and every authority, execution, storage, canonical, public release, and production flag false.`,
  controlled_permission_execution_authorization_draft_ready: true,
  permission_execution_authorization_draft_recorded: true,
  controlled_permission_execution_authorization_draft_review_candidate_ready: true,
  non_execution_draft_clause: draftClause,
  risk_acknowledgment: `Risk remains: ${inputRelease} founder posture mismatch, founder posture id mismatch, review decision id mismatch, draft review id mismatch, draft gate id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, source id mismatch, answer-change mismatch, retrieval-change mismatch, rights change, ambiguous draft language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, answer change, retrieval change, storage, canonical, public release, or production flag must block movement.`,
  rollback_condition: `Rollback by returning to the ${inputRelease} founder decision gate and requiring a fresh non-authorizing founder posture before any draft-review candidate is prepared again.`,
  monitoring_condition: `Monitor only the frozen ${inputRelease} founder posture id, route, questions, source ids, authority audit, answer_changed=false, retrieval_config_changed=false, and false authority flags before preparing the controlled draft review candidate.`,
  stop_condition: `Stop if the ${inputRelease} founder posture id, founder decision id, review decision gate id, draft review id, draft gate id, review route, founder question, permission question, authority flag audit, source ids, answer state, retrieval state, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, answer change, retrieval change, storage, canonical, public release, or production flag is true.`,
  expiry_check: `Controlled permission execution authorization draft gate re-entry expires at the next material ${inputRelease} founder posture, review decision, draft review, draft, source, answer, retrieval, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.`,
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  next_gate: nextGate,
  next_gate_required: nextGate,
  clarification_question: `Which exact ${inputRelease} founder posture packet should this draft-review candidate carry, and which single draft boundary should remain most visible?`,
  return_reason: `Return if the ${inputRelease} founder posture packet loses route, question, audit, founder posture id, source identity, answer-change, or retrieval-change clarity.`,
  hold_reason: `Hold until the reviewer can see the exact ${inputRelease} founder posture packet, source ids, route, questions, authority audit, answer_changed=false, and retrieval_config_changed=false.`,
  block_reason: `Block if any authority flag becomes true or the ${inputRelease} handoff is changed.`,
  release,
  founder_decision_release: inputRelease,
  founder_decision_schema: founderData.schema_version,
  ...falseFlags
};
draftData.boundary = {
  ...draftData.boundary,
  next_gate_required: nextGate,
  ...falseFlags
};
writeJson(draftDataFile, draftData);

let js = read(jsFile);
if (!js.includes('"answer_changed"')) {
  js = replaceRequired(
    js,
    '  "source_write_executed",\n  "actual_storage_write_executed",',
    '  "source_write_executed",\n  "answer_changed",\n  "retrieval_config_changed",\n  "actual_storage_write_executed",',
    "false authority answer/retrieval flags"
  );
}
if (!js.includes("const founderPacketTextFields")) {
  js = replaceRequired(
    js,
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
  const founderPacketTextFields = [
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
  ];
  const blockedWords`,
    "founder packet text fields"
  );
}
js = replaceRegexRequired(
  js,
  /const blockedWords = .*?;\n/s,
  'const blockedWords = /\\b(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|answer changed|retrieval changed|retrieval config changed|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production now|launch production allowed|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|answer_changed true|retrieval_config_changed true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)\\b/i;\n',
  "blocked authority words"
);
if (!js.includes("function noUnsafeFounderPacketText")) {
  js = replaceRequired(
    js,
    `  function matchesSourceIdentity(packet, config) {`,
    `  function noUnsafeFounderPacketText(packet) {
    return founderPacketTextFields.every((field) => !hasUnsafeAuthority(packet && packet[field]));
  }

  function matchesSourceIdentity(packet, config) {`,
    "founder unsafe text guard"
  );
}
js = replaceOrVerify(
  js,
  `      matchesSourceHandoff(packet, config) &&
      allFlagsTrue(packet, decisionReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags)
    );`,
  `      matchesSourceHandoff(packet, config) &&
      allFlagsTrue(packet, decisionReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags) &&
      noUnsafeFounderPacketText(packet)
    );`,
  "noUnsafeFounderPacketText(packet)",
  "founder packet unsafe text condition"
);
js = replaceAllIfPresent(js, "founder-permission-execution-authorization-decision-gate-v6", founderData.schema_version);
js = replaceAllIfPresent(js, "controlled-permission-execution-authorization-draft-gate-v7", "controlled-permission-execution-authorization-draft-gate-v8");
js = replaceAllIfPresent(js, "v3.9.5", inputRelease);
js = replaceAllIfPresent(js, "v3.9.6", release);
write(jsFile, js);

let html = read(pageFile);
html = replaceAllIfPresent(html, "v3.9.6 draft", releaseBadge);
html = replaceAllIfPresent(html, "v3.9.6", release);
html = replaceAllIfPresent(html, "v3.9.5", inputRelease);
html = replaceAllIfPresent(html, "One posture. One draft. No power opens.", "One posture. One draft. Nothing opens.");
html = replaceAllIfPresent(html, "Carry one posture into review.", "Draft carefully. Nothing opens.");
html = replaceAllIfPresent(html, "Controlled writing desk", "Controlled draft desk");
html = replaceAllIfPresent(
  html,
  `VedaPath carries the ${inputRelease} founder posture into one reviewable draft, then stops before authority, execution, storage, public release, or production.`,
  `VedaPath carries the ${inputRelease} founder posture into one reviewable draft, then stops before authority, answer changes, retrieval changes, execution, storage, public release, or production.`
);
html = replaceAllIfPresent(
  html,
  `This gate receives the ${inputRelease} founder posture, keeps source identity intact, and prepares one reviewable draft only.`,
  `This gate receives the ${inputRelease} founder posture, keeps source identity and answer boundaries intact, and prepares one reviewable draft only.`
);
html = replaceAllIfPresent(
  html,
  "Draft signal only. Permission grant, authorization approval, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.",
  "Draft signal only. Permission grant, authorization approval, answer changes, retrieval changes, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false."
);
write(pageFile, html);

let css = read(cssFile);
const cssBlock = `
/* VEDAPATH v4.0.0 CONTROLLED DRAFT DESK */
body.permission-execution-draft-page .draft-gate {
  border-color: rgba(20, 92, 74, 0.2);
  background:
    radial-gradient(circle at 92% 5%, rgba(20, 92, 74, 0.08), transparent 22%),
    radial-gradient(circle at 4% 90%, rgba(224, 168, 59, 0.12), transparent 24%),
    linear-gradient(180deg, rgba(255, 255, 252, 0.99), rgba(255, 251, 246, 0.96));
}

body.permission-execution-draft-page .draft-gate h1 {
  max-width: 760px;
  font-size: clamp(1.72rem, 2.25vw, 2.35rem);
  line-height: 1.08;
  letter-spacing: 0;
}

body.permission-execution-draft-page .draft-gate-head {
  min-height: 110px;
  align-items: center;
}

body.permission-execution-draft-page .draft-gate-mark {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  box-shadow: 0 12px 28px rgba(168, 62, 18, 0.1);
}

body.permission-execution-draft-page .draft-step-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

body.permission-execution-draft-page .draft-step,
body.permission-execution-draft-page .draft-relay div,
body.permission-execution-draft-page .draft-gate-form,
body.permission-execution-draft-page .draft-gate-result,
body.permission-execution-draft-page .draft-gate-rules div,
body.permission-execution-draft-page .draft-gate-list div {
  border-color: rgba(20, 92, 74, 0.12);
  background: rgba(255, 255, 253, 0.88);
}

body.permission-execution-draft-page .draft-step strong,
body.permission-execution-draft-page .draft-relay strong,
body.permission-execution-draft-page .draft-gate-card strong {
  font-weight: 760;
}

body.permission-execution-draft-page .draft-gate-grid {
  gap: 16px;
}

body.permission-execution-draft-page .draft-gate-form textarea {
  min-height: 54px;
}

body.permission-execution-draft-page .draft-gate-form textarea#draftDecisionPacket,
body.permission-execution-draft-page .draft-gate-output {
  font-size: 0.79rem;
  line-height: 1.45;
}

@media (max-width: 1120px) {
  body.permission-execution-draft-page .draft-step-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`;
if (!css.includes("VEDAPATH v4.0.0 CONTROLLED DRAFT DESK")) {
  css = `${css.trim()}\n\n${cssBlock.trim()}\n`;
}
write(cssFile, css);

let shell = read(shellFile);
shell = replaceRegexRequired(shell, /const releaseBadge = "v\d+\.\d+\.\d+ [^"]+";/, `const releaseBadge = "${releaseBadge}";`, "command shell release badge");
write(shellFile, shell);

let build = read(buildFile);
build = replaceRequired(build, '<span class="version">v3.9.9 founder</span>', `<span class="version">${releaseBadge}</span>`, "build version badge");
build = replaceRequired(
  build,
  `<strong>v3.9.9</strong>
          <p>Founder Permission Execution Authorization Decision Gate Re-entry: the founder gate receives the v3.9.8 review-decision packet and records only founder posture while permission, authorization, execution, storage, public release, and production stay false.</p>`,
  `<strong>${release}</strong>
          <p>${releaseName}: the draft gate receives the ${inputRelease} founder posture packet and prepares one reviewable draft while permission, authorization, answer changes, retrieval changes, execution, storage, public release, and production stay false.</p>`,
  "build current version card"
);
build = replaceRequired(
  build,
  "The trust chain now records founder posture from the v3.9.8 review-decision packet while preserving question handoff, source identity, authority flag audit, and all false execution flags.",
  `The trust chain now carries the ${inputRelease} founder posture into controlled draft language while preserving question handoff, source identity, answer boundaries, retrieval boundaries, authority flag audit, and all false execution flags.`,
  "build full vision copy"
);
build = replaceRequired(
  build,
  `<strong>v4.0.0 Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
          <p>Receive the v3.9.9 founder posture packet and prepare draft-only controlled language while every authority flag remains false.</p>`,
  `<strong>${nextRelease}</strong>
          <p>Review the ${release} draft packet before any later authorization posture while every authority flag remains false.</p>`,
  "build next release card"
);
build = replaceRequired(
  build,
  `<article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 360: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
          <p>Receive the v3.9.9 founder posture packet and prepare draft-only controlled language while every authority flag remains false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  `<article class="phase">
        <span class="badge done">Done</span>
        <div>
          <strong>Phase 360: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
          <p>Receives the ${inputRelease} founder posture packet and prepares controlled draft-review candidate language while every authority, answer-change, retrieval-change, and production flag remains false.</p>
        </div>
        <div class="percent">100%</div>
      </article>
      <article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 361: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
          <p>Review the ${release} controlled draft packet while permission, authorization, execution, storage, public release, and production remain false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  "build phase 360 update"
);
build = replaceRequired(build, `<div class="version-row"><span>Release</span><strong>v3.9.9 Founder Permission Execution Authorization Decision Gate Re-entry</strong></div>`, `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>`, "version release row");
build = replaceRequired(build, `<div class="version-row"><span>Previous</span><strong>v3.9.8 Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong></div>`, `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`, "version previous row");
build = replaceRequired(build, `<div class="version-row"><span>Goal</span><strong>Record founder posture from the v3.9.8 review-decision packet while every authority flag remains false.</strong></div>`, `<div class="version-row"><span>Goal</span><strong>Prepare controlled draft-review candidate language from the ${inputRelease} founder posture packet while every authority, answer-change, retrieval-change, and production flag remains false.</strong></div>`, "version goal row");
build = replaceRequired(build, `<div class="version-row"><span>Status</span><strong>Ready for controlled draft gate re-entry</strong></div>`, `<div class="version-row"><span>Status</span><strong>Ready for controlled draft review gate re-entry</strong></div>`, "version status row");
build = replaceRequired(
  build,
  `<li><span class="dot"></span><span>Re-enter controlled permission execution authorization draft gate.</span></li>
              <li><span class="dot"></span><span>Receive the v3.9.9 founder posture packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Prepare draft-only controlled language, not a live command.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  `<li><span class="dot"></span><span>Re-enter controlled permission execution authorization draft review gate.</span></li>
              <li><span class="dot"></span><span>Receive the ${release} draft packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Preserve source ids, route, questions, founder posture id, answer boundaries, retrieval boundaries, and authority audit.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  "next build checklist"
);
write(buildFile, build);

const readmeBlock = `## ${release} ${releaseName}

- Re-enters the controlled draft gate from the ${inputRelease} founder posture packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, answer boundaries, retrieval boundaries, and authority audit.
- Prepares one draft-review candidate only while permission grant, authorization approval, answer changes, retrieval changes, execution, storage writes, canonical writes, public release, and production remain false.
- Polishes the draft page into a quieter writing desk: one posture, one reviewable draft, visible locks, and the ${releaseBadge} command-shell badge.
- Updates [Controlled Permission Execution Authorization Draft Gate](controlledpermissionexecutionauthorizationdraftgate.html), [Controlled Permission Execution Authorization Draft Gate Data](data/vedapath-controlled-permission-execution-authorization-draft-gate.json), and [Controlled Permission Execution Authorization Draft Gate Notes](docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_GATE.md).`;
let readme = read(readmeFile);
readme = insertBefore(readme, "## v3.9.9 Founder Permission Execution Authorization Decision Gate Re-entry", readmeBlock, "README v3.9.9");
write(readmeFile, readme);

const notesBlock = `## ${release} ${releaseName}

- Re-enters the controlled draft gate from the ${inputRelease} founder posture packet.
- Prepares one controlled draft-review candidate while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.
- Simplifies the draft gate into a quiet writing desk: one posture, one reviewable draft, visible locks, and tighter type rhythm.
- Sets the build tracker to Phase 361: controlled draft review gate re-entry.`;
let notes = read(notesFile);
notes = insertBefore(notes, "## v3.9.9 Founder Permission Execution Authorization Decision Gate Re-entry", notesBlock, "prototype notes v3.9.9");
write(notesFile, notes);

const blueprintBlock = `## v4.0.0 Controlled Draft Gate

Controlled Permission Execution Authorization Draft Gate Re-entry receives the ${inputRelease} founder posture packet and prepares only controlled draft-review candidate language while every authority flag remains false.

Release intent:

- accept only the ${inputRelease} founder permission execution authorization decision output
- preserve founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, answer boundaries, retrieval boundaries, and authority audit
- output controlled draft readiness and draft-review candidate readiness only after the handoff stays intact
- keep permission grant, authorization approval, answer changes, retrieval changes, execution, storage writes, canonical writes, public release, and production unavailable
- move only to the controlled permission execution authorization draft review gate re-entry
- make the draft gate feel like a quiet writing desk where founder posture becomes reviewable language without becoming authority

Next release: ${nextRelease}.`;
let blueprint = read(blueprintFile);
blueprint = insertBefore(blueprint, "## v3.9.9 Founder Decision Gate", blueprintBlock, "blueprint v3.9.9 marker");
write(blueprintFile, blueprint);

let draftDoc = read(draftDocFile);
draftDoc = replaceAllIfPresent(
  draftDoc,
  "Controlled Permission Execution Authorization Draft Gate Re-entry accepts the v3.9.5 founder posture packet and turns it into draft-review candidate language only.",
  `Controlled Permission Execution Authorization Draft Gate Re-entry accepts the ${inputRelease} founder posture packet and turns it into draft-review candidate language only.`
);
const draftDocBlock = `## ${release} Re-entry

- Requires schema \`${founderData.schema_version}\`.
- Requires release \`${inputRelease}\`.
- Preserves the ${inputRelease} founder posture gate id before any draft candidate can be prepared.
- Preserves review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, answer boundaries, retrieval boundaries, and authority flag audit.
- Outputs \`controlled_permission_execution_authorization_draft_ready=true\`, \`permission_execution_authorization_draft_recorded=true\`, and \`controlled_permission_execution_authorization_draft_review_candidate_ready=true\` only for reviewable draft language.
- Keeps every permission, authorization, answer-change, retrieval-change, execution, storage, canonical write, public release, and production flag false.
- Moves only to the controlled permission execution authorization draft review gate re-entry.`;
draftDoc = insertBefore(draftDoc, "## v3.9.6 Re-entry", draftDocBlock, "draft doc v3.9.6 marker");
write(draftDocFile, draftDoc);

console.log(`${release} ${releaseName} applied`);

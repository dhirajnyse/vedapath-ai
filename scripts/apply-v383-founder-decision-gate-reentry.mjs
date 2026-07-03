import fs from "node:fs";

const release = "v3.8.3";
const releaseName = "Founder Permission Execution Authorization Decision Gate Re-entry";
const previousRelease = "v3.8.2 Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const nextGate = "Controlled permission execution authorization draft gate re-entry";
const today = "2026-07-03";

const readJson = (path) => JSON.parse(fs.readFileSync(path, "utf8"));
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const replaceAll = (value, from, to) => value.split(from).join(to);

const founderPath = "data/vedapath-founder-permission-execution-authorization-decision-gate.json";
const reviewDecisionPath = "data/vedapath-controlled-permission-execution-authorization-review-decision-gate.json";
const htmlPath = "founderpermissionexecutionauthorizationdecisiongate.html";
const jsPath = "assets/vedapath-founder-permission-execution-authorization-decision-gate.js";
const cssPath = "assets/vedapath-founder-permission-execution-authorization-decision-gate.css";
const shellPath = "assets/vedapath-command-shell.js";
const buildPath = "build-status.html";
const readmePath = "README.md";
const notesPath = "docs/PROTOTYPE_NOTES.md";
const docPath = "docs/FOUNDER_PERMISSION_EXECUTION_AUTHORIZATION_DECISION_GATE.md";

const falseFlags = [
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

const review = readJson(reviewDecisionPath);
const founder = readJson(founderPath);
const source = {
  review_decision_release: review.release,
  review_decision_schema: review.schema_version,
  review_decision_gate_id: review.source.review_decision_gate_id,
  controlled_permission_execution_authorization_draft_review_gate_id: review.source.controlled_permission_execution_authorization_draft_review_gate_id,
  controlled_permission_execution_authorization_draft_gate_id: review.source.controlled_permission_execution_authorization_draft_gate_id,
  founder_decision_gate_id: review.source.founder_decision_gate_id,
  founder_permission_execution_authorization_decision_gate_id: review.source.founder_permission_execution_authorization_decision_gate_id,
  authorization_review_gate_id: review.source.authorization_review_gate_id,
  permission_execution_authorization_preflight_id: review.source.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: review.source.controlled_permission_execution_hold_id,
  source_answer_id: review.source.source_answer_id,
  source_record_id: review.source.source_record_id,
  source_family: review.source.source_family,
  review_route: review.source.review_route,
  founder_question: review.source.founder_question,
  permission_question: review.source.permission_question,
  authority_flag_audit: review.source.authority_flag_audit
};

const reviewPacket = {
  ...review.sample_decision,
  schema_version: review.schema_version,
  release: review.release,
  input_release: review.input_release,
  review_decision_gate_release: review.release,
  review_decision_gate_schema: review.schema_version,
  decision_status: "Ready for founder decision; no authority granted.",
  review_decision_outcome: "Ready",
  preserves_review_route: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  preserves_source_identity: true,
  decision_scope: "Record that the v3.8.2 review-decision packet may move to founder permission execution authorization decision gate re-entry only. This is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  decision_language: "Review decision result: route the v3.8.2 review-decision packet to founder decision gate re-entry only. This is routing readiness only; permission grant remains closed, authorization approval remains closed, execution remains closed, and no system may run from it.",
  decision_rationale: "The v3.8.2 review-decision packet is ready, the question handoff and source identity are intact, founder posture id is preserved, source ids are visible, and authority stays closed. The next step is founder decision re-entry only.",
  decision_evidence_summary: "The v3.8.2 review-decision packet preserves review decision gate id, draft review gate id, draft gate id, founder decision id, founder posture id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, authority flag audit, rollback, monitoring, stop condition, expiry, and production boundary.",
  risk_acknowledgment: "Risk remains: v3.8.2 review-decision packet mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, founder posture id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous decision language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback if the v3.8.2 review-decision packet, route, source identity, founder posture id, questions, audit, or non-execution boundary no longer match the incoming packet.",
  monitoring_condition: "Monitor only the frozen v3.8.2 review-decision packet, route, source identity, founder posture id, questions, authority audit, and false authority flags before routing to founder decision.",
  stop_condition: "Stop if the v3.8.2 review-decision packet, review decision id, draft review gate id, draft gate id, founder posture id, review route, founder question, permission question, authority flag audit, founder decision id, authorization review id, preflight id, hold id, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Controlled permission execution authorization review decision gate re-entry expires at the next material v3.8.2 review-decision packet, review decision, draft review, draft, founder decision, authorization review, preflight, hold, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
  return_reason: "Return if the v3.8.2 review-decision language loses founder posture id, route, question, audit, or source identity clarity.",
  hold_reason: "Hold until the reviewer can see the exact v3.8.2 review-decision packet, founder posture id, source ids, route, questions, and authority audit.",
  block_reason: "Block if any authority flag becomes true or the v3.8.2 handoff is changed.",
  next_gate_required: "Founder permission execution authorization decision gate re-entry",
  created_at: `${today}T00:00:00.000Z`
};

const sampleDecision = {
  review_decision_gate_id: source.review_decision_gate_id,
  controlled_permission_execution_authorization_draft_review_gate_id: source.controlled_permission_execution_authorization_draft_review_gate_id,
  controlled_permission_execution_authorization_draft_gate_id: source.controlled_permission_execution_authorization_draft_gate_id,
  founder_decision_gate_id: source.founder_decision_gate_id,
  founder_permission_execution_authorization_decision_gate_id: source.founder_permission_execution_authorization_decision_gate_id,
  authorization_review_gate_id: source.authorization_review_gate_id,
  permission_execution_authorization_preflight_id: source.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: source.controlled_permission_execution_hold_id,
  source_answer_id: source.source_answer_id,
  source_record_id: source.source_record_id,
  source_family: source.source_family,
  review_route: source.review_route,
  founder_question: source.founder_question,
  permission_question: source.permission_question,
  authority_flag_audit: source.authority_flag_audit,
  decision_state: "Draft-only founder decision recorded",
  decision_actor: "Founder",
  founder_name: "Founder sample",
  decision_scope: "Record founder posture for the v3.8.2 review-decision packet only. The record may create one later controlled draft candidate, but it cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, launch production, or run any system.",
  founder_decision_language: "Founder posture: draft-only record for the v3.8.2 review-decision packet. It may feed one later controlled draft gate only. It grants nothing; every permission, authorization, execution, storage, canonical, public release, and production flag remains false.",
  decision_rationale: "The v3.8.2 review-decision packet is ready for founder posture because the question handoff, authority flag audit, founder posture id, source ids, and draft gate lineage are intact. This is not a live authorization; it is only a posture record for the next controlled draft gate.",
  decision_evidence_summary: "Input release v3.8.2 has review_decision_ready=true, review_decision_recorded=true, founder decision candidate ready=true, and every authority, execution, storage, canonical, public release, and production flag false.",
  non_execution_decision_clause: "Founder permission execution authorization decision gate re-entry only; review_decision_ready may be true, review_decision_recorded may be true, founder_permission_execution_authorization_decision_candidate_ready may be true, founder_permission_execution_authorization_decision_ready may be true, founder_permission_execution_authorization_decision_recorded may be true, controlled_permission_execution_authorization_draft_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, founder_instruction_granted remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false.",
  risk_acknowledgment: "Risk remains: v3.8.2 review-decision packet mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, founder posture id mismatch, route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, source mismatch, rights change, ambiguous founder language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback by returning to the v3.8.2 review-decision gate and requiring a fresh non-authorizing review decision packet before any founder posture is recorded again.",
  monitoring_condition: "Monitor only the frozen v3.8.2 packet ids, route, questions, source ids, authority audit, and false authority flags before preparing a later controlled draft candidate.",
  stop_condition: "Stop if the v3.8.2 review-decision packet, review decision id, draft review gate id, draft gate id, founder posture id, route, founder question, permission question, authority flag audit, incoming founder id, authorization review id, preflight id, hold id, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Founder permission execution authorization decision gate re-entry expires at the next material v3.8.2 review-decision packet, draft review, draft, founder posture, authorization review, preflight, hold, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  clarification_question: "Which single founder posture should be recorded for the v3.8.2 review-decision packet: draft-only, hold, return, or reject?",
  return_reason: "Return if the v3.8.2 review-decision language loses route, question, audit, founder posture id, or source identity clarity.",
  hold_reason: "Hold until the founder can see the exact v3.8.2 review-decision packet, founder posture id, source ids, route, questions, and authority audit.",
  block_reason: "Block if any language implies permission, authorization, execution, storage, canonical write, public release, or production launch.",
  review_decision_ready: true,
  review_decision_recorded: true,
  controlled_permission_execution_authorization_review_decision_ready: true,
  founder_permission_execution_authorization_decision_candidate_ready: true,
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true,
  ...Object.fromEntries(falseFlags.map((flag) => [flag, false])),
  next_gate: nextGate,
  next_gate_required: nextGate,
  release
};

founder.release = release;
founder.input_release = review.release;
founder.generated_at = today;
founder.summary = "Re-enters the founder decision gate from the v3.8.2 review-decision packet, preserves source identity, founder posture id, route, questions, and authority audit, and records draft-only, hold, return, or reject posture while every permission, authorization, execution, storage, public release, and production path remains disabled.";
founder.previous_release = previousRelease;
founder.source_release = previousRelease;
founder.next_gate = nextGate;
founder.source = source;
founder.decision_checks = founder.decision_checks.map((item) =>
  item.check === "Input packet"
    ? { ...item, rule: "Must be the v3.8.2 review-decision packet." }
    : item
);
founder.sample_review_decision_packet = reviewPacket;
founder.sample_authorization_review_packet = reviewPacket;
founder.sample_decision = sampleDecision;
founder.boundary = {
  ...founder.boundary,
  review_decision_ready: false,
  review_decision_recorded: false,
  controlled_permission_execution_authorization_review_decision_ready: false,
  founder_permission_execution_authorization_decision_candidate_ready: false,
  founder_permission_execution_authorization_decision_ready: false,
  founder_permission_execution_authorization_decision_recorded: false,
  controlled_permission_execution_authorization_draft_candidate_ready: false,
  ...Object.fromEntries(falseFlags.map((flag) => [flag, false])),
  next_gate_required: nextGate
};
writeJson(founderPath, founder);

let js = fs.readFileSync(jsPath, "utf8");
js = replaceAll(js, "v3.7.8", "v3.8.2");
js = replaceAll(js, "v3.7.9", "v3.8.3");
js = replaceAll(js, "controlled-permission-execution-authorization-review-decision-gate-v5", "controlled-permission-execution-authorization-review-decision-gate-v6");
fs.writeFileSync(jsPath, js);

let html = fs.readFileSync(htmlPath, "utf8");
html = replaceAll(html, "v3.7.9 founder", "v3.8.3 founder");
html = replaceAll(html, "v3.7.9", "v3.8.3");
html = replaceAll(html, "v3.7.8", "v3.8.2");
html = replaceAll(html, "Choose posture. Keep the chain calm.", "Choose posture. Keep authority closed.");
html = replaceAll(html, "A draft-only outcome can prepare the next controlled draft gate from the v3.8.2 review-decision packet.", "A draft-only outcome can prepare the next controlled draft gate from the v3.8.2 review-decision packet only.");
html = html.replace('      <link rel="stylesheet" href="assets/vedapath-command-shell.css">', '    <link rel="stylesheet" href="assets/vedapath-command-shell.css">');
html = html.replace('      <script src="assets/vedapath-command-shell.js" defer></script>', '    <script src="assets/vedapath-command-shell.js" defer></script>');
fs.writeFileSync(htmlPath, html);

fs.appendFileSync(cssPath, `

/* VEDAPATH v3.8.3 FOUNDER DECISION RE-ENTRY */
body.vp-command-shell-ready.permission-execution-decision-page main.workspace {
  grid-template-columns: minmax(188px, 0.48fr) minmax(0, 2.36fr) minmax(206px, 0.54fr);
  gap: 18px;
}

body.permission-execution-decision-page .founder-decision {
  gap: 13px;
  border-color: rgba(20, 92, 74, 0.15);
  background:
    radial-gradient(circle at 94% 6%, rgba(20, 92, 74, 0.068), transparent 23%),
    linear-gradient(135deg, rgba(255, 255, 252, 0.992), rgba(255, 250, 245, 0.95));
}

body.permission-execution-decision-page .founder-decision-head {
  grid-template-columns: minmax(0, 1fr) 82px;
  min-height: 92px;
}

body.permission-execution-decision-page .founder-decision h1 {
  max-width: 720px;
  font-size: clamp(1.5rem, 1.22vw, 1.88rem);
  line-height: 1.12;
}

body.permission-execution-decision-page .founder-decision-head .muted {
  max-width: 920px;
  font-size: 0.9rem;
  line-height: 1.56;
}

body.permission-execution-decision-page .founder-decision-choice-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

body.permission-execution-decision-page .founder-decision-choice {
  min-height: 72px;
  padding: 11px;
}

body.permission-execution-decision-page .founder-decision-choice strong,
body.permission-execution-decision-page .founder-decision-meridian strong,
body.permission-execution-decision-page .founder-decision-card strong,
body.permission-execution-decision-page .founder-decision-rule strong {
  font-size: 0.94rem;
}

body.permission-execution-decision-page .founder-decision-choice p,
body.permission-execution-decision-page .founder-decision-meridian p,
body.permission-execution-decision-page .founder-decision-form input,
body.permission-execution-decision-page .founder-decision-form select,
body.permission-execution-decision-page .founder-decision-form textarea,
body.permission-execution-decision-page .founder-decision-output {
  font-size: 0.88rem;
}

body.permission-execution-decision-page .founder-decision-meridian article {
  padding: 11px;
}

body.permission-execution-decision-page .founder-decision-form {
  max-height: 585px;
  background: rgba(255, 255, 252, 0.76);
}

body.permission-execution-decision-page .founder-decision-form textarea {
  min-height: 62px;
}

body.permission-execution-decision-page .founder-decision-output {
  min-height: 236px;
}

body.permission-execution-decision-page .handoff-quiet h2,
body.permission-execution-decision-page .founder-decision-form h2,
body.permission-execution-decision-page .founder-decision-grid h2,
body.permission-execution-decision-page aside.panel h2 {
  font-size: clamp(0.98rem, 0.92vw, 1.16rem);
}

@media (max-width: 1280px) {
  body.permission-execution-decision-page .founder-decision-choice-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
`);

let shell = fs.readFileSync(shellPath, "utf8");
shell = shell.replace('const releaseBadge = "v3.8.2 decision";', 'const releaseBadge = "v3.8.3 founder";');
fs.writeFileSync(shellPath, shell);

let build = fs.readFileSync(buildPath, "utf8");
build = build.replace('<span class="version">v3.8.2 decision</span>', '<span class="version">v3.8.3 founder</span>');
build = build.replace('<strong>v3.8.2</strong>\n          <p>Controlled Permission Execution Authorization Review Decision Gate Re-entry: the decision gate now receives the v3.8.1 draft-review packet and routes only to founder decision, hold, return, or block while every authority flag stays false.</p>', '<strong>v3.8.3</strong>\n          <p>Founder Permission Execution Authorization Decision Gate Re-entry: the founder gate now receives the v3.8.2 review-decision packet and records draft-only, hold, return, or reject posture while every authority flag stays false.</p>');
build = build.replace("The trust chain now routes the v3.8.1 draft-review packet without turning route readiness into permission, authorization, execution, storage, public release, or production.", "The trust chain now records founder posture from the v3.8.2 review-decision packet without turning posture into permission, authorization, execution, storage, public release, or production.");
build = build.replace("<strong>Founder permission execution authorization decision gate re-entry</strong>\n          <p>Receive the v3.8.2 review-decision packet and record founder posture while every authority flag remains false.</p>", "<strong>Controlled permission execution authorization draft gate re-entry</strong>\n          <p>Receive the v3.8.3 founder posture packet and prepare one controlled draft candidate while every authority flag remains false.</p>");
build = build.replace(`<article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 343: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
                <p>Receive the v3.8.2 review-decision packet and record founder posture while permission, authorization, execution, storage, public release, and production remain false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 343: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
                <p>Receive the v3.8.2 review-decision packet and record founder posture while permission, authorization, execution, storage, public release, and production remain false.</p>
              </div>
              <div class="percent">100%</div>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 344: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
                <p>Receive the v3.8.3 founder posture packet and prepare one controlled draft candidate while every grant, approval, execution, storage, public release, and production flag remains false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`);
build = build.replace('<div class="version-row"><span>Release</span><strong>v3.8.2 Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.8.3 Founder Permission Execution Authorization Decision Gate Re-entry</strong></div>');
build = build.replace('<div class="version-row"><span>Previous</span><strong>v3.8.1 Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong></div>', '<div class="version-row"><span>Previous</span><strong>v3.8.2 Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong></div>');
build = build.replace('<div class="version-row"><span>Goal</span><strong>Route the v3.8.1 draft-review packet to founder decision, hold, return, or block without granting permission, approving authorization, or enabling execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Record founder posture from the v3.8.2 review-decision packet without granting permission, approving authorization, enabling execution, or opening production.</strong></div>');
build = build.replace('<div class="version-row"><span>Status</span><strong>Ready for founder decision gate re-entry</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled draft gate re-entry</strong></div>');
build = build.replace(`<li><span class="dot"></span><span>Re-enter the founder permission execution authorization decision gate.</span></li>
              <li><span class="dot"></span><span>Receive the v3.8.2 review-decision packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Record founder posture only: draft-only, hold, return, or reject.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`, `<li><span class="dot"></span><span>Re-enter the controlled permission execution authorization draft gate.</span></li>
              <li><span class="dot"></span><span>Receive the v3.8.3 founder posture packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Prepare one controlled draft candidate only from draft-only posture.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`);
fs.writeFileSync(buildPath, build);

const readme = fs.readFileSync(readmePath, "utf8");
fs.writeFileSync(readmePath, readme.replace("# VedaPath AI\n", `# VedaPath AI\n\n## ${release} ${releaseName}\n\n- Re-enters the founder decision gate from the v3.8.2 review-decision packet.\n- Records draft-only, hold, return, or reject as founder posture only; permission, authorization, execution, storage, public release, and production remain false.\n- Refines the founder decision room into a quieter posture desk with smaller type, tighter route cards, and the v3.8.3 command-shell badge.\n\n`));

const notes = fs.readFileSync(notesPath, "utf8");
fs.writeFileSync(notesPath, notes.replace("# VedaPath AI Prototype Notes\n", `# VedaPath AI Prototype Notes\n\n## ${release} ${releaseName}\n\n- Upgrades the founder decision gate to accept the v3.8.2 controlled review-decision packet.\n- Keeps the only forward motion as a controlled draft candidate from explicit draft-only posture.\n- Blocks older v3.7.8 handoffs and preserves all false authority and production flags.\n\n`));

fs.writeFileSync(docPath, `# ${releaseName}

Version: ${release}

Founder Permission Execution Authorization Decision Gate Re-entry receives the v3.8.2 controlled review-decision packet and records founder posture after review-decision readiness.

It can record four outcomes:

- Draft-only path
- Hold for more evidence
- Return to review decision
- Reject packet path

It may mark a controlled draft candidate only when the founder chooses the draft-only path. This is a posture record, not a permission grant or execution approval.

It must preserve source identity, founder posture id, route, questions, and authority flag audit.

It must not grant permission, approve authorization, execute, store, update canonical records, publish, or launch production.

Next gate: ${nextGate}.

## v3.8.3 Re-entry Notes

- Accept only the v3.8.2 controlled review-decision packet as input.
- Record draft-only, hold, return, or reject as founder posture only.
- Prepare one controlled draft candidate only from an explicit draft-only posture.
- Keep permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.
- Preserve the v3.8.2 route, source ids, source family, questions, founder posture id, and authority audit.
`);

console.log(`${release} ${releaseName} applied.`);

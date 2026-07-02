import fs from "node:fs";

const release = "v3.7.7";
const inputRelease = "v3.7.6";
const releaseBadge = "v3.7.7 review";
const releaseName = "Controlled Permission Execution Authorization Draft Review Gate Re-entry";
const previousRelease = "v3.7.6 Controlled Permission Execution Authorization Draft Gate Re-entry";
const nextGate = "Controlled permission execution authorization review decision gate re-entry";
const inputNextGate = "Controlled permission execution authorization draft review gate re-entry";

const draftDataFile = "data/vedapath-controlled-permission-execution-authorization-draft-gate.json";
const reviewDataFile = "data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json";
const jsFile = "assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.js";
const cssFile = "assets/vedapath-controlled-permission-execution-authorization-draft-review-gate.css";
const pageFile = "controlledpermissionexecutionauthorizationdraftreviewgate.html";
const shellFile = "assets/vedapath-command-shell.js";
const buildFile = "build-status.html";
const readmeFile = "README.md";
const notesFile = "docs/PROTOTYPE_NOTES.md";
const blueprintFile = "docs/PRODUCT_BLUEPRINT.md";
const reviewDocFile = "docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_REVIEW_GATE.md";

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

const readyFlags = {
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true,
  controlled_permission_execution_authorization_draft_ready: true,
  permission_execution_authorization_draft_recorded: true,
  controlled_permission_execution_authorization_draft_review_candidate_ready: true
};

const reviewReadyFlags = {
  controlled_permission_execution_authorization_draft_review_ready: true,
  permission_execution_authorization_draft_review_recorded: true,
  founder_permission_execution_authorization_review_decision_candidate_ready: true
};

const falseFlags = Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));
const falseClause = falseAuthorityFlags.map((flag) => `${flag} remains false`).join(", ");
const reviewClause = `Controlled permission execution authorization draft review gate re-entry only; controlled_permission_execution_authorization_draft_review_ready may be true, permission_execution_authorization_draft_review_recorded may be true, and founder_permission_execution_authorization_review_decision_candidate_ready may be true, but ${falseClause}.`;

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

function sourceFromDraft(draft, draftData) {
  return {
    draft_gate_release: inputRelease,
    draft_gate_schema: draftData.schema_version,
    review_decision_gate_id: draft.review_decision_gate_id,
    controlled_permission_execution_authorization_draft_review_gate_id: draft.controlled_permission_execution_authorization_draft_review_gate_id,
    controlled_permission_execution_authorization_draft_gate_id: draft.controlled_permission_execution_authorization_draft_gate_id,
    founder_decision_gate_id: draft.founder_decision_gate_id,
    founder_permission_execution_authorization_decision_gate_id: draft.founder_permission_execution_authorization_decision_gate_id,
    authorization_review_gate_id: draft.authorization_review_gate_id,
    permission_execution_authorization_preflight_id: draft.permission_execution_authorization_preflight_id,
    controlled_permission_execution_hold_id: draft.controlled_permission_execution_hold_id,
    source_answer_id: draft.source_answer_id,
    source_record_id: draft.source_record_id,
    source_family: draft.source_family,
    review_route: draft.review_route,
    founder_question: draft.founder_question,
    permission_question: draft.permission_question,
    authority_flag_audit: draft.authority_flag_audit
  };
}

const draftData = readJson(draftDataFile);
const reviewData = readJson(reviewDataFile);
const draft = draftData.sample_draft;
const source = sourceFromDraft(draft, draftData);

const sampleDraftPacket = {
  schema_version: draftData.schema_version,
  release: inputRelease,
  draft_status: "Controlled draft review candidate prepared; execution remains false.",
  ...source,
  ...readyFlags,
  ...falseFlags,
  draft_scope: draft.draft_scope,
  draft_language: draft.draft_language,
  draft_rationale: draft.draft_rationale,
  draft_evidence_summary: draft.draft_evidence_summary,
  non_execution_draft_clause: draft.non_execution_draft_clause,
  risk_acknowledgment: draft.risk_acknowledgment,
  rollback_condition: draft.rollback_condition,
  monitoring_condition: draft.monitoring_condition,
  stop_condition: draft.stop_condition,
  expiry_check: draft.expiry_check,
  production_boundary: draft.production_boundary,
  preserves_source_identity: true,
  preserves_review_route: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  next_gate_required: inputNextGate,
  created_at: "2026-07-02T00:00:00.000Z"
};

reviewData.release = release;
reviewData.generated_at = "2026-07-02";
reviewData.title = releaseName;
reviewData.summary = "Re-enters the controlled draft review gate from the v3.7.6 controlled draft packet, verifies source identity, founder posture id, route, questions, and authority audit, and prepares only controlled review-decision candidate language while every permission, authorization, execution, storage, public release, and production path remains disabled.";
reviewData.previous_release = previousRelease;
reviewData.source_release = previousRelease;
reviewData.next_gate = nextGate;
reviewData.source = source;
reviewData.review_checks = [
  { check: "Input packet", rule: "Starts only from the v3.7.6 controlled draft candidate output." },
  { check: "Source identity", rule: "Preserves founder posture id, review decision id, draft review id, draft gate id, source ids, route, questions, and authority audit." },
  { check: "Review only", rule: "Can mark draft-review readiness, but cannot approve authorization or grant permission." },
  { check: "No operation", rule: "Execution, storage, canonical updates, migrations, accounts, secrets, public release, and production remain closed." },
  { check: "Review-decision next", rule: "Moves only to the controlled review-decision gate re-entry, never to a runnable path." },
  { check: "Expiry", rule: "Expires on draft, review, source, rights, rollback, monitoring, packet, or code change." }
];
reviewData.sample_draft_packet = sampleDraftPacket;
reviewData.sample_review = {
  ...reviewData.sample_review,
  review_state: "Draft review ready for founder decision",
  review_actor: "Controlled draft review gate",
  reviewer_name: "Draft review sample",
  ...source,
  review_scope: "Review the v3.7.6 controlled permission execution authorization draft candidate for clarity, source identity preservation, founder posture id preservation, question handoff integrity, and boundary strength. This review is not permission grant, not authorization approval, not execution, and cannot promote, store, change canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  review_language: "Review result: the v3.7.6 controlled draft candidate can move only to the controlled permission execution authorization review decision gate re-entry. Permission grant remains closed, authorization approval remains closed, execution remains closed, and no system may run from this review.",
  review_notes: "The question handoff and source identity stay intact: founder posture id, review decision id, draft review id, draft gate id, review route, founder question, permission question, source ids, and authority flag audit match the v3.7.6 controlled draft packet.",
  review_evidence_summary: "The v3.7.6 controlled draft packet exposes the v3.7.5 founder posture id, review decision id, draft review id, draft gate id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, authority flag audit, rollback, monitoring, stop condition, expiry, and production boundary before review-decision readiness.",
  non_execution_review_clause: reviewClause,
  risk_review: "Risk remains: v3.7.6 controlled draft mismatch, v3.7.5 founder posture id mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous review language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_review: "Rollback review passes only when before_hash, v3.7.6 draft audit, v3.7.5 founder posture audit, draft-review audit, question handoff audit, source identity audit, and failure review remain visible and no source state is written.",
  monitoring_review: "Monitoring review keeps audit receipt, stop condition, failure review, reviewer handoff, v3.7.5 founder posture id, source identity, authority flag audit, and before-write check visible before any controlled review decision gate.",
  stop_condition: "Stop if the v3.7.6 draft gate id mismatches, v3.7.5 founder posture id mismatches, review decision id mismatches, draft review gate id mismatches, review route mismatches, founder question mismatches, permission question mismatches, authority flag audit mismatches, founder decision id mismatches, authorization review id mismatches, preflight id mismatches, hold id mismatches, source ids mismatch, rights change, review language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Controlled permission execution authorization draft review gate re-entry expires at the next material v3.7.6 controlled draft, v3.7.5 founder posture, review decision, draft, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  next_gate: nextGate,
  clarification_question: "Which exact v3.7.6 controlled draft packet should this review carry forward, and which single authority boundary should remain most visible?",
  return_reason: "Return if the v3.7.6 controlled draft packet loses route, question, audit, founder posture id, or source identity clarity.",
  hold_reason: "Hold until the reviewer can see the exact v3.7.6 controlled draft packet, source ids, route, questions, founder posture id, and authority audit.",
  block_reason: "Block if any authority flag becomes true or the v3.7.6 handoff is changed.",
  ...reviewReadyFlags,
  ...falseFlags,
  next_gate_required: nextGate
};
reviewData.boundary = {
  ...reviewData.boundary,
  controlled_permission_execution_authorization_draft_review_ready: false,
  permission_execution_authorization_draft_review_recorded: false,
  founder_permission_execution_authorization_review_decision_candidate_ready: false,
  ...falseFlags,
  next_gate_required: nextGate
};
write(reviewDataFile, `${JSON.stringify(reviewData, null, 2)}\n`);

let js = read(jsFile);
js = replaceAll(js, [
  ['packet.release === "v3.7.2"', `packet.release === "${inputRelease}"`],
  ['packet.next_gate_required === "Controlled permission execution authorization draft review gate"', `packet.next_gate_required === "${inputNextGate}"`],
  ['next_gate_required: "Controlled permission execution authorization draft review gate"', `next_gate_required: "${inputNextGate}"`],
  ['next_gate_required: "Controlled permission execution authorization review decision gate"', `next_gate_required: "${nextGate}"`],
  ['next_gate_required: "Controlled permission execution authorization review decision gate re-entry"', `next_gate_required: "${nextGate}"`],
  ['{ label: "Input", value: "v3.7.2 draft packet" }', `{ label: "Input", value: "${inputRelease} draft packet" }`]
]);
js = js.split("v3.7.2").join(inputRelease);
js = js.split("Controlled permission execution authorization review decision gate\"").join(`${nextGate}"`);
write(jsFile, js);

let html = read(pageFile);
html = replaceAll(html, [
  ['<span>Controlled draft review</span>', '<span>Draft review gate</span>'],
  ['<span class="version">v3.7.3 review</span>', `<span class="version">${releaseBadge}</span>`],
  ["Review the draft. Grant nothing.", "Review one draft. Decide nothing."],
  ["This gate receives the v3.7.2 controlled draft candidate, checks source identity, founder posture id, and questions, then prepares only a controlled review-decision candidate.", "This gate receives the v3.7.6 controlled draft packet, checks source identity, founder posture id, route, questions, and authority audit, then prepares only a controlled review-decision candidate."],
  ["<strong>Draft</strong><p>v3.7.2 input.</p>", `<strong>Draft</strong><p>${inputRelease} input.</p>`],
  ["Review the draft. Preserve trust. Grant nothing.", "Review one draft. Preserve trust."],
  ["VedaPath now reviews the v3.7.2 controlled draft candidate as a source-identity handoff, not a permission. The output can only be a controlled review-decision candidate.", "VedaPath now reviews the v3.7.6 controlled draft packet as a source-identity handoff, not a permission. The output can only be a controlled review-decision candidate."],
  ["<strong>Draft candidate</strong><p>v3.7.2 only.</p>", `<strong>Draft candidate</strong><p>${inputRelease} only.</p>`],
  ["<strong>v3.7.2 draft candidate</strong>", `<strong>${inputRelease} draft packet</strong>`],
  ['<div class="metric"><span>Current</span><strong>v3.7.3</strong></div>', `<div class="metric"><span>Current</span><strong>${release}</strong></div>`],
  ['<div class="metric"><span>Input</span><strong>v3.7.2</strong></div>', `<div class="metric"><span>Input</span><strong>${inputRelease}</strong></div>`],
  ["A ready review creates one controlled review decision candidate. The route, questions, and authority locks stay visible.", "A ready review creates one controlled review-decision candidate. The route, questions, source ids, and authority locks stay visible."]
]);
write(pageFile, html);

const cssMarker = "/* VEDAPATH v3.7.7 CONTROLLED DRAFT REVIEW GATE RE-ENTRY */";
const cssBlock = `

${cssMarker}
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-gate {
  gap: 15px;
  border-color: rgba(20, 92, 74, 0.18);
  background:
    linear-gradient(180deg, rgba(255, 255, 253, 0.985), rgba(255, 253, 248, 0.955)),
    radial-gradient(circle at 92% 0%, rgba(224, 168, 59, 0.085), transparent 28%);
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-gate h1 {
  max-width: 660px;
  font-size: clamp(22px, 1.26vw, 28px);
  line-height: 1.12;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-head {
  grid-template-columns: minmax(0, 1fr) 78px;
  min-height: 78px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay > div,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-card,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-result {
  padding: 12px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay > div strong {
  font-size: 14px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form h2 {
  font-size: 18px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form {
  max-height: 600px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form textarea:first-of-type {
  min-height: 132px;
}
`;
let css = read(cssFile);
const markerIndex = css.indexOf(cssMarker);
if (markerIndex !== -1) css = css.slice(0, markerIndex).trimEnd();
css += cssBlock;
write(cssFile, css);

let shell = read(shellFile);
shell = shell.replace(/const releaseBadge = "v3\.7\.\d+ [^"]+";/, `const releaseBadge = "${releaseBadge}";`);
write(shellFile, shell);

let build = read(buildFile);
build = replaceAll(build, [
  ['<span class="version">v3.7.6 draft</span>', `<span class="version">${releaseBadge}</span>`],
  ["<strong>v3.7.6</strong>\n          <p>Controlled Permission Execution Authorization Draft Gate Re-entry: the draft gate now receives the v3.7.5 founder posture packet and prepares one draft-review candidate while authority stays closed.</p>", `<strong>${release}</strong>\n          <p>${releaseName}: the draft-review gate now receives the v3.7.6 controlled draft packet and prepares one controlled review-decision candidate while authority stays closed.</p>`],
  ["The trust chain now carries the v3.7.5 founder posture into controlled draft language without turning draft readiness into permission, authorization, execution, storage, public release, or production.", "The trust chain now reviews the v3.7.6 controlled draft packet without turning review readiness into permission, authorization, execution, storage, public release, or production."],
  ["<strong>Controlled permission execution authorization draft review gate re-entry</strong>\n          <p>Review the v3.7.6 controlled draft packet before any later authorization posture while every authority flag remains false.</p>", `<strong>Controlled permission execution authorization review decision gate re-entry</strong>\n          <p>Route the v3.7.7 draft-review packet to review decision, hold, return, or block while every authority flag remains false.</p>`]
]);
build = replaceOnce(
  build,
  `<article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 337: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
                <p>Receive the v3.7.6 controlled draft packet and prepare review-decision candidate language while every authority and production flag remains false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
  `<article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 337: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
                <p>Receive the v3.7.6 controlled draft packet and prepare review-decision candidate language while every authority and production flag remains false.</p>
              </div>
              <div class="percent">100%</div>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 338: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
                <p>Receive the v3.7.7 draft-review packet and route it to review decision, hold, return, or block while every authority and production flag remains false.</p>
              </div>
              <div class="percent">0%</div>
            </article>`,
  "phase 337 update"
);
build = replaceAll(build, [
  ["v3.7.6 Controlled Permission Execution Authorization Draft Gate Re-entry", `${release} ${releaseName}`],
  ["v3.7.5 Founder Permission Execution Authorization Decision Gate Re-entry", previousRelease],
  ["Prepare controlled draft-review candidate language from the v3.7.5 founder posture packet without granting permission, approving authorization, or enabling execution.", "Prepare controlled review-decision candidate language from the v3.7.6 controlled draft packet without granting permission, approving authorization, or enabling execution."],
  ["Ready for controlled draft review gate re-entry", "Ready for controlled review decision gate re-entry"],
  ["Re-enter the controlled permission execution authorization draft review gate.", "Re-enter the controlled permission execution authorization review decision gate."],
  ["Receive the v3.7.6 controlled draft packet without granting authorization or execution.", "Receive the v3.7.7 draft-review packet without granting authorization or execution."]
]);
write(buildFile, build);

const readmeBlock = `## ${release} ${releaseName}

- Re-enters the controlled draft review gate from the v3.7.6 controlled draft packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit.
- Produces only controlled review-decision candidate language while permission, authorization, execution, storage writes, canonical writes, public release, and production remain false.
- Refines the draft-review UI with current v3.7.6 input language, a narrower review surface, clearer relay cards, and a current v3.7.7 command-shell badge.
- Updates [Controlled Permission Execution Authorization Draft Review Gate](${pageFile}), [Controlled Permission Execution Authorization Draft Review Gate Data](${reviewDataFile}), and [Controlled Permission Execution Authorization Draft Review Gate Notes](${reviewDocFile}).`;
let readme = read(readmeFile);
readme = insertBefore(readme, "## v3.7.6 Controlled Permission Execution Authorization Draft Gate Re-entry", readmeBlock, "README v3.7.6");
write(readmeFile, readme);

const notesBlock = `## ${release} ${releaseName}

- Re-enters the controlled draft review gate from the v3.7.6 controlled draft packet.
- Preserves founder posture id, source identity, route, questions, and authority audit before review-decision candidate readiness.
- Adds calmer draft-review polish: current v3.7.6 incoming packet, narrower review room, tighter relay cards, current command-shell badge, and one outgoing controlled review-decision candidate only.
- Keeps permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.`;
let notes = read(notesFile);
notes = insertBefore(notes, "## v3.7.6 Controlled Permission Execution Authorization Draft Gate Re-entry", notesBlock, "prototype notes v3.7.6");
write(notesFile, notes);

const blueprintBlock = `### 354. Controlled Permission Execution Authorization Draft Review Gate Re-entry

Controlled Permission Execution Authorization Draft Review Gate Re-entry should receive the v3.7.6 controlled draft packet and prepare only controlled review-decision candidate language while every authority flag remains false.

It should:

- accept only the v3.7.6 controlled permission execution authorization draft output
- preserve founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit
- output draft-review readiness and review-decision candidate readiness only after the handoff stays intact
- keep permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production unavailable
- move only to the controlled permission execution authorization review decision gate re-entry
- make the draft-review room feel like a calm verification desk: one incoming draft, one identity check, one review-decision candidate, zero authority leakage`;
let blueprint = read(blueprintFile);
blueprint = insertBefore(blueprint, "## Strategic Difference", blueprintBlock, "blueprint strategic marker");
write(blueprintFile, blueprint);

const reviewDoc = `# Controlled Permission Execution Authorization Draft Review Gate Re-entry

Controlled Permission Execution Authorization Draft Review Gate Re-entry accepts the v3.7.6 controlled draft packet and turns it into controlled review-decision candidate language only.

## What This Release Does

- Requires schema \`controlled-permission-execution-authorization-draft-gate-v5\`.
- Requires release \`v3.7.6\`.
- Requires next gate \`${inputNextGate}\`.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, and authority flag audit.
- Emits \`controlled_permission_execution_authorization_draft_review_ready\`, \`permission_execution_authorization_draft_review_recorded\`, and \`founder_permission_execution_authorization_review_decision_candidate_ready\` as true only after all checks pass.
- Keeps permission, authorization, execution, storage, canonical, public release, and production flags false.

## v3.7.7 Re-entry

- Receives the v3.7.6 controlled draft packet produced from the v3.7.5 founder posture.
- Blocks older draft packets, unsafe review language, changed source ids, changed questions, changed authority audit, or any true authority flag.
- Produces only a controlled review-decision candidate; it does not grant permission, approve authorization, or enable execution.
- Keeps the draft-review room visually narrow, current, and calm: incoming draft, verified identity, outgoing review-decision candidate.

## Previous Re-entry

The v3.7.3 re-entry accepted the v3.7.2 controlled draft packet. v3.7.7 advances the same gate pattern to the current v3.7.6 draft packet without opening authority.

## Boundary

This is not permission grant, authorization approval, execution, storage write, canonical update, public release, or production launch.

## Next Gate

Controlled Permission Execution Authorization Review Decision Gate Re-entry.
`;
write(reviewDocFile, reviewDoc);

console.log(`${release} ${releaseName} applied.`);

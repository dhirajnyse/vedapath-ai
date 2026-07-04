import fs from "node:fs";

const release = "v3.9.8";
const inputRelease = "v3.9.7";
const releaseBadge = "v3.9.8 decision";
const releaseName = "Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const previousRelease = "v3.9.7 Controlled Permission Execution Authorization Draft Review Gate Re-entry";
const nextRelease = "v3.9.9 Founder Permission Execution Authorization Decision Gate Re-entry";
const nextGate = "Founder permission execution authorization decision gate re-entry";
const inputNextGate = "Controlled permission execution authorization review decision gate re-entry";
const generatedAt = "2026-07-04";

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

function replaceRequired(text, from, to, label) {
  if (!text.includes(from)) {
    throw new Error(`Missing ${label}: ${from.slice(0, 160)}`);
  }
  return text.replace(from, to);
}

function insertBefore(text, marker, block, label) {
  const firstLine = block.trim().split("\n")[0];
  if (text.includes(firstLine)) return text;
  if (!text.includes(marker)) {
    throw new Error(`Missing marker for ${label}: ${marker}`);
  }
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

const source = {
  draft_review_gate_release: inputRelease,
  draft_review_gate_schema: draftReviewData.schema_version,
  draft_gate_release: draftReviewData.source.draft_gate_release || priorReview.draft_gate_release,
  draft_gate_schema: draftReviewData.source.draft_gate_schema || priorReview.draft_gate_schema,
  ...Object.fromEntries(sourceIdentityFields.map((field) => [field, draftReviewData.source[field] || priorReview[field]])),
  ...Object.fromEntries(handoffFields.map((field) => [field, draftReviewData.source[field] || priorReview[field]]))
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
  decision_scope: `Decide whether the ${inputRelease} draft-review packet may move to founder permission execution authorization decision gate re-entry. This decision is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.`,
  decision_language: `Review decision result: route the ${inputRelease} draft-review packet to founder decision gate re-entry only. This is routing readiness only; permission grant remains closed, authorization approval remains closed, execution remains closed, and no system may run from it.`,
  decision_rationale: `The ${inputRelease} draft-review packet is ready, the question handoff and source identity are intact, founder posture id is preserved, evidence ids are visible, and authority stays closed. The next step is founder decision re-entry only.`,
  decision_evidence_summary: `The ${inputRelease} draft-review packet preserves review decision gate id, draft review gate id, draft gate id, founder decision id, founder posture id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, authority flag audit, rollback, monitoring, stop condition, expiry, and production boundary.`,
  non_execution_decision_clause: `Controlled permission execution authorization review decision gate re-entry only; review_decision_ready may be true, review_decision_recorded may be true, controlled_permission_execution_authorization_review_decision_ready may be true, and founder_permission_execution_authorization_decision_candidate_ready may be true, but ${falseFlagSentence}.`,
  risk_acknowledgment: `Risk remains: ${inputRelease} draft-review packet mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, founder posture id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous decision language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.`,
  rollback_condition: `Rollback if the ${inputRelease} draft-review packet, route, source identity, founder posture id, questions, audit, or non-execution boundary no longer match the incoming packet.`,
  monitoring_condition: `Monitor only the frozen ${inputRelease} draft-review packet, route, source identity, founder posture id, questions, authority audit, and false authority flags before routing to founder decision.`,
  stop_condition: `Stop if the ${inputRelease} draft-review packet, review decision id, draft review gate id, draft gate id, founder posture id, review route, founder question, permission question, authority flag audit, founder decision id, authorization review id, preflight id, hold id, source ids, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, storage, canonical, public release, or production flag is true.`,
  expiry_check: `Controlled permission execution authorization review decision gate re-entry expires at the next material ${inputRelease} draft-review packet, review decision, draft review, draft, founder decision, authorization review, preflight, hold, source, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.`,
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  return_reason: `Return if the ${inputRelease} draft-review language loses founder posture id, route, question, audit, or source identity clarity.`,
  hold_reason: `Hold until the reviewer can see the exact ${inputRelease} draft-review packet, founder posture id, source ids, route, questions, and authority audit.`,
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

data.schema_version = "controlled-permission-execution-authorization-review-decision-gate-v7";
data.release = release;
data.input_release = inputRelease;
data.generated_at = generatedAt;
data.title = releaseName;
data.summary = `Re-enters the review decision gate from the ${inputRelease} draft-review packet, preserves founder posture id, source identity, route, questions, and authority audit, and routes founder, hold, return, or block while every permission, authorization, execution, storage, public release, and production path remains disabled.`;
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
    summary: `Keep the packet held until the ${inputRelease} draft-review evidence is visible and stable.`
  },
  "Return to draft review": {
    state: "Return to draft review",
    summary: `Send the packet back to the ${inputRelease} draft-review gate.`
  },
  "Block packet": {
    state: "Block packet",
    summary: "Close this packet route because trust evidence, source identity, or boundary text is unsafe."
  }
};
data.decision_checks = [
  { check: "Input packet", rule: `Starts only from the ${inputRelease} non-authorizing draft-review output.` },
  { check: "Identity continuity", rule: "Preserves review decision id, draft review id, draft gate id, founder posture id, founder decision id, authorization review id, preflight id, hold id, and source ids." },
  { check: "Question continuity", rule: "Preserves review route, founder question, permission question, and authority flag audit." },
  { check: "Forward limit", rule: "Forward route may create only founder decision candidate readiness." },
  { check: "Authority boundary", rule: "Permission, authorization, execution, storage, canonical writes, public release, and production remain false." }
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
js = js.split("v3.9.3").join(inputRelease);
js = js.split("v3.9.4").join(release);
js = js.split("controlled-permission-execution-authorization-draft-review-gate-v6").join(draftReviewData.schema_version);
js = js.split('"source_write_executed",\n    "actual_storage_write_executed"').join('"source_write_executed",\n    "answer_changed",\n    "retrieval_config_changed",\n    "actual_storage_write_executed"');
write(jsFile, js);

let page = read(pageFile);
page = page.split("v3.9.4 decision").join(releaseBadge);
page = page.split("v3.9.4").join(release);
page = page.split("v3.9.3").join(inputRelease);
page = page.split("Choose one route. Keep the room quiet.").join("Choose one route. Let nothing leak.");
page = page.split("preserves posture, source ids, questions, and authority audit, then chooses one quiet next path.").join("preserves posture, source ids, questions, and authority audit, then chooses one quiet next path with every lock visible.");
page = page.split("Route the review without opening authority.").join("Route the review. Keep authority still.");
page = page.split("A forward route prepares one founder decision candidate only, never an approval.").join("A forward route prepares one founder decision candidate only, never permission or execution.");
page = page.split("Founder Route, Still Closed").join("Founder Route, Still Gentle");
write(pageFile, page);

appendIfMissing(
  cssFile,
  "VEDAPATH v3.9.8 CONTROLLED REVIEW DECISION GATE RE-ENTRY",
  `
/* VEDAPATH v3.9.8 CONTROLLED REVIEW DECISION GATE RE-ENTRY */
body.review-decision-page.vp-command-shell-ready main.workspace {
  grid-template-columns: minmax(172px, 0.32fr) minmax(0, 3.36fr) minmax(188px, 0.4fr);
  align-items: start;
  gap: 16px;
}

body.review-decision-page.vp-command-shell-ready .review-decision {
  padding: clamp(18px, 1.14vw, 23px);
  gap: 12px;
  border-color: rgba(20, 92, 74, 0.12);
  background:
    linear-gradient(180deg, rgba(255, 255, 252, 0.998), rgba(255, 254, 250, 0.985)),
    radial-gradient(circle at 100% 0%, rgba(20, 92, 74, 0.055), transparent 32%);
  box-shadow: none;
}

body.review-decision-page.vp-command-shell-ready .review-decision-head {
  grid-template-columns: minmax(0, 1fr) 54px;
  min-height: 52px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-mark {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

body.review-decision-page.vp-command-shell-ready .review-decision h1 {
  max-width: 760px;
  font-size: clamp(19px, 0.88vw, 23px);
  line-height: 1.1;
  letter-spacing: 0;
}

body.review-decision-page.vp-command-shell-ready .review-decision-head .muted,
body.review-decision-page.vp-command-shell-ready .review-decision p,
body.review-decision-page.vp-command-shell-ready aside.panel .muted {
  max-width: 980px;
  font-size: 0.83rem;
  line-height: 1.52;
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice,
body.review-decision-page.vp-command-shell-ready .review-decision-card,
body.review-decision-page.vp-command-shell-ready .review-decision-rule,
body.review-decision-page.vp-command-shell-ready .review-decision-result,
body.review-decision-page.vp-command-shell-ready .review-decision-form,
body.review-decision-page.vp-command-shell-ready .review-decision-relay div {
  border-color: rgba(74, 93, 75, 0.14);
  background: rgba(255, 255, 252, 0.975);
  box-shadow: none;
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice {
  min-height: 54px;
  padding: 9px 11px;
  border-left: 3px solid rgba(224, 168, 59, 0.3);
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice strong,
body.review-decision-page.vp-command-shell-ready .review-decision-card strong,
body.review-decision-page.vp-command-shell-ready .review-decision-relay strong {
  font-size: 0.9rem;
}

body.review-decision-page.vp-command-shell-ready .review-decision-choice[aria-pressed="true"] {
  border-color: rgba(213, 92, 31, 0.32);
  border-left-color: rgba(213, 92, 31, 0.9);
  background: linear-gradient(180deg, rgba(255, 247, 239, 0.95), rgba(250, 255, 251, 0.94));
}

body.review-decision-page.vp-command-shell-ready .review-decision-relay {
  grid-template-columns: 1fr 1fr 1fr;
}

body.review-decision-page.vp-command-shell-ready .review-decision-form {
  max-height: 488px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-form h2,
body.review-decision-page.vp-command-shell-ready .review-decision-result h2,
body.review-decision-page.vp-command-shell-ready aside.panel > h2 {
  font-size: clamp(15px, 0.82vw, 18px);
  line-height: 1.15;
}

body.review-decision-page.vp-command-shell-ready .review-decision-form label {
  font-size: 11px;
  gap: 5px;
}

body.review-decision-page.vp-command-shell-ready .review-decision-form textarea {
  min-height: 52px;
}
`
);

let shell = read("assets/vedapath-command-shell.js");
shell = replaceRequired(shell, 'const releaseBadge = "v3.9.7 review";', `const releaseBadge = "${releaseBadge}";`, "command shell release badge");
write("assets/vedapath-command-shell.js", shell);

let build = read("build-status.html");
build = replaceRequired(build, '<span class="version">v3.9.7 review</span>', `<span class="version">${releaseBadge}</span>`, "build version badge");
build = replaceRequired(
  build,
  `<strong>v3.9.7</strong>
          <p>Controlled Permission Execution Authorization Draft Review Gate Re-entry: the draft-review gate receives the v3.9.6 controlled draft packet and prepares one review-decision candidate while permission, authorization, execution, storage, public release, and production stay false.</p>`,
  `<strong>${release}</strong>
          <p>${releaseName}: the decision gate receives the ${inputRelease} draft-review packet and routes only to founder decision, hold, return, or block while permission, authorization, execution, storage, public release, and production stay false.</p>`,
  "current release card"
);
build = replaceRequired(
  build,
  `<p>The trust chain now reviews the v3.9.6 controlled draft as a calm handoff while preserving question handoff, source identity, authority flag audit, draft scope, and all false execution flags.</p>`,
  `<p>The trust chain now routes the ${inputRelease} draft-review packet as one calm handoff while preserving question handoff, source identity, founder posture id, authority flag audit, and all false execution flags.</p>`,
  "full vision progress text"
);
build = replaceRequired(
  build,
  `<strong>Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
          <p>Route the v3.9.7 draft-review packet to founder decision, hold, return, or block while every authority flag remains false.</p>`,
  `<strong>${nextRelease.replace("v3.9.9 ", "")}</strong>
          <p>Receive the ${release} review-decision packet and record founder posture while every authority flag remains false.</p>`,
  "next release card"
);
build = replaceRequired(
  build,
  `<article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 358: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
          <p>Route the v3.9.7 draft-review packet to founder decision, hold, return, or block while every authority flag remains false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  `<article class="phase">
        <span class="badge done">Done</span>
        <div>
          <strong>Phase 358: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
          <p>Routes the ${inputRelease} draft-review packet to founder decision, hold, return, or block while every authority flag remains false.</p>
        </div>
        <div class="percent">100%</div>
      </article>
      <article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 359: Founder Permission Execution Authorization Decision Gate Re-entry</strong>
          <p>Receive the ${release} review-decision packet and record founder posture while every authority flag remains false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  "phase 358 update"
);
build = replaceRequired(
  build,
  `<div class="version-row"><span>Release</span><strong>v3.9.7 Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong></div>
        <div class="version-row"><span>Previous</span><strong>v3.9.6 Controlled Permission Execution Authorization Draft Gate Re-entry</strong></div>
        <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
        <div class="version-row"><span>Goal</span><strong>Review the v3.9.6 controlled draft packet into one review-decision candidate while every authority flag remains false.</strong></div>
        <div class="version-row"><span>Status</span><strong>Ready for controlled review decision gate re-entry</strong></div>`,
  `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>
        <div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>
        <div class="version-row"><span>Commit</span><strong>See GitHub history</strong></div>
        <div class="version-row"><span>Goal</span><strong>Route the ${inputRelease} draft-review packet to founder decision, hold, return, or block without granting permission, approving authorization, or enabling execution.</strong></div>
        <div class="version-row"><span>Status</span><strong>Ready for founder decision gate re-entry</strong></div>`,
  "version notes rows"
);
build = replaceRequired(
  build,
  `<li><span class="dot"></span><span>Re-enter controlled permission execution authorization review decision gate.</span></li>
              <li><span class="dot"></span><span>Receive the v3.9.7 draft-review packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Choose only founder decision, hold, return, or block as the next posture.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  `<li><span class="dot"></span><span>Re-enter founder permission execution authorization decision gate.</span></li>
              <li><span class="dot"></span><span>Receive the ${release} review-decision packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Record founder posture only: draft-only, hold, return, or reject.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  "next checklist"
);
write("build-status.html", build);

const readmeEntry = `## ${release} ${releaseName}

- Re-enters the controlled review-decision gate from the ${inputRelease} draft-review packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit.
- Routes only to founder decision, hold, return, or block while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.
- Refines the review-decision page into a calmer routing desk with current ${inputRelease} input language, four clear routes, softer source cards, and the ${releaseBadge} command-shell badge.
- Updates the build tracker, product blueprint, prototype notes, README, and review-decision gate contract for the next founder decision gate re-entry.

`;
let readme = read("README.md");
readme = insertBefore(readme, "## v3.9.7 Controlled Permission Execution Authorization Draft Review Gate Re-entry", readmeEntry, "README v3.9.7 marker");
write("README.md", readme);

const notesEntry = `## ${release} ${releaseName}

- Re-enters the controlled review-decision gate from the ${inputRelease} draft-review packet.
- Routes the packet to founder decision, hold, return, or block while every grant remains false.
- Adds calmer routing polish: one incoming review packet, four visible route choices, one outgoing founder decision candidate, restrained type, and current command-shell language.
- Keeps permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.

`;
let notes = read("docs/PROTOTYPE_NOTES.md");
notes = insertBefore(notes, "## v3.9.7 Controlled Permission Execution Authorization Draft Review Gate Re-entry", notesEntry, "prototype notes v3.9.7 marker");
write("docs/PROTOTYPE_NOTES.md", notes);

const blueprintEntry = `## ${release} Controlled Review Decision Gate

Controlled Permission Execution Authorization Review Decision Gate Re-entry should receive the ${inputRelease} draft-review packet and route only to founder decision, hold, return, or block while every authority flag remains false.

Release intent:

- accept only the ${inputRelease} controlled draft-review output
- preserve founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, and authority audit
- output founder decision candidate readiness only when the route is forward
- keep permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production unavailable
- make the review-decision room feel like a quiet routing desk: one incoming packet, four choices, one next gate, zero authority leakage

`;
let blueprint = read("docs/PRODUCT_BLUEPRINT.md");
blueprint = insertBefore(blueprint, "## v3.9.7 Controlled Draft Review Gate", blueprintEntry, "blueprint v3.9.7 marker");
write("docs/PRODUCT_BLUEPRINT.md", blueprint);

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
- authority flag audit

Forward routing may mark review-decision readiness and founder decision candidate readiness only. It must not grant permission, approve authorization, execute, store, update canonical records, publish, or launch production.

## ${release} Re-entry Notes

- Accept only the ${inputRelease} controlled draft-review packet.
- Route only to founder decision, hold, return, or block.
- Keep permission, authorization approval, execution, storage writes, canonical writes, public release, and production false.
- Preserve the ${inputRelease} route, source ids, source family, questions, founder posture id, and authority audit.
- Keep the room visually quiet: one incoming packet, four visible routes, one outgoing founder decision candidate, zero authority leakage.
`);

console.log(`${release} ${releaseName} applied.`);

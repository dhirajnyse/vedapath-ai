import fs from "node:fs";

const release = "v4.0.1";
const inputRelease = "v4.0.0";
const releaseBadge = "v4.0.1 review";
const releaseName = "Controlled Permission Execution Authorization Draft Review Gate Re-entry";
const previousRelease = "v4.0.0 Controlled Permission Execution Authorization Draft Gate Re-entry";
const nextRelease = "v4.0.2 Controlled Permission Execution Authorization Review Decision Gate Re-entry";
const nextGate = "Controlled permission execution authorization review decision gate re-entry";
const generatedAt = "2026-07-05";

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

function replaceRequired(text, from, to, label = from) {
  if (!text.includes(from)) {
    if (text.includes(to)) return text;
    throw new Error(`Missing replacement target: ${label}`);
  }
  return text.replace(from, to);
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
  return text.replace(marker, `${block}\n\n${marker}`);
}

function falseFlagObject() {
  return Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));
}

function falseFlagSentence() {
  return falseAuthorityFlags.map((flag) => `${flag} remains false`).join(", ");
}

const draftData = readJson(draftDataFile);
const reviewData = readJson(reviewDataFile);
const sourceDraft = draftData.sample_draft;

if (draftData.release !== inputRelease || sourceDraft.release !== inputRelease) {
  throw new Error(`Expected controlled draft release ${inputRelease}`);
}

const falseFlags = falseFlagObject();

const sourceFields = {
  draft_gate_release: inputRelease,
  draft_gate_schema: draftData.schema_version,
  founder_decision_release: sourceDraft.founder_decision_release,
  founder_decision_schema: sourceDraft.founder_decision_schema,
  review_decision_gate_id: sourceDraft.review_decision_gate_id,
  controlled_permission_execution_authorization_draft_review_gate_id:
    sourceDraft.controlled_permission_execution_authorization_draft_review_gate_id,
  controlled_permission_execution_authorization_draft_gate_id:
    sourceDraft.controlled_permission_execution_authorization_draft_gate_id,
  founder_decision_gate_id: sourceDraft.founder_decision_gate_id,
  founder_permission_execution_authorization_decision_gate_id:
    sourceDraft.founder_permission_execution_authorization_decision_gate_id,
  authorization_review_gate_id: sourceDraft.authorization_review_gate_id,
  permission_execution_authorization_preflight_id: sourceDraft.permission_execution_authorization_preflight_id,
  controlled_permission_execution_hold_id: sourceDraft.controlled_permission_execution_hold_id,
  source_answer_id: sourceDraft.source_answer_id,
  source_record_id: sourceDraft.source_record_id,
  source_family: sourceDraft.source_family,
  review_route: sourceDraft.review_route,
  founder_question: sourceDraft.founder_question,
  permission_question: sourceDraft.permission_question,
  authority_flag_audit: sourceDraft.authority_flag_audit,
  answer_changed: sourceDraft.answer_changed,
  retrieval_config_changed: sourceDraft.retrieval_config_changed
};

const sampleDraftPacket = {
  ...sourceDraft,
  schema_version: draftData.schema_version,
  release: draftData.release,
  draft_status: "Controlled draft review candidate prepared; execution remains false.",
  founder_permission_execution_authorization_decision_ready: true,
  founder_permission_execution_authorization_decision_recorded: true,
  controlled_permission_execution_authorization_draft_candidate_ready: true,
  controlled_permission_execution_authorization_draft_ready: true,
  permission_execution_authorization_draft_recorded: true,
  controlled_permission_execution_authorization_draft_review_candidate_ready: true,
  preserves_source_identity: true,
  preserves_review_route: true,
  preserves_founder_question: true,
  preserves_permission_question: true,
  preserves_authority_flag_audit: true,
  next_gate_required: "Controlled permission execution authorization draft review gate re-entry",
  created_at: "2026-07-05T00:00:00.000Z",
  ...falseFlags
};

const reviewClause = `Controlled permission execution authorization draft review gate re-entry only; controlled_permission_execution_authorization_draft_review_ready may be true, permission_execution_authorization_draft_review_recorded may be true, and founder_permission_execution_authorization_review_decision_candidate_ready may be true, but ${falseFlagSentence()}.`;

reviewData.schema_version = "controlled-permission-execution-authorization-draft-review-gate-v8";
reviewData.release = release;
reviewData.generated_at = generatedAt;
reviewData.title = releaseName;
reviewData.summary = `Re-enters the controlled draft review gate from the ${inputRelease} controlled draft packet, checks source identity, founder posture id, route, questions, draft scope, answer boundary, retrieval boundary, and authority audit, and prepares only controlled review-decision candidate language while every permission, authorization, execution, storage, public release, and production path remains disabled.`;
reviewData.previous_release = previousRelease;
reviewData.source_release = previousRelease;
reviewData.input_release = inputRelease;
reviewData.next_gate = nextGate;
reviewData.source = sourceFields;
reviewData.review_checks = [
  { check: "Input packet", rule: `Starts only from the ${inputRelease} controlled draft candidate output.` },
  { check: "Source identity", rule: "Preserves founder posture id, review decision id, draft review id, draft gate id, source ids, route, questions, answer boundary, retrieval boundary, and authority audit." },
  { check: "Draft meaning", rule: "Checks that the draft stays reviewable language, not permission, authorization, answer change, retrieval change, or execution." },
  { check: "Review only", rule: "Can mark draft-review readiness, but cannot approve authorization or grant permission." },
  { check: "No operation", rule: "Execution, answer changes, retrieval changes, storage, canonical updates, migrations, accounts, secrets, public release, and production remain closed." },
  { check: "Decision next", rule: "Moves only to the controlled review-decision gate re-entry, never to a runnable path." }
];
reviewData.sample_draft_packet = sampleDraftPacket;
reviewData.sample_review = {
  review_state: "Draft review ready for founder decision",
  review_actor: "Controlled draft review gate",
  reviewer_name: "Draft review sample",
  ...sourceFields,
  review_scope: `Review the ${inputRelease} controlled permission execution authorization draft candidate for clarity, source identity preservation, founder posture id preservation, question handoff integrity, answer boundary, retrieval boundary, draft boundary strength, and non-authorizing language. This review is not permission grant, not authorization approval, not answer change, not retrieval change, not execution, and cannot promote, store, change canonical records, migrate, create accounts, use secrets, publish public release, or launch production.`,
  review_language: `Review result: the ${inputRelease} controlled draft candidate can move only to the controlled permission execution authorization review decision gate re-entry. Permission grant remains closed, authorization approval remains closed, answer change remains closed, retrieval change remains closed, execution remains closed, and no system may run from this review.`,
  review_notes: `The question handoff and source identity stay intact: founder posture id, founder decision release, review decision id, draft review id, draft gate id, review route, founder question, permission question, source ids, draft scope, answer boundary, retrieval boundary, and authority flag audit match the ${inputRelease} controlled draft packet.`,
  review_evidence_summary: `The ${inputRelease} controlled draft packet exposes the v3.9.9 founder posture id, founder decision schema, review decision id, draft review id, draft gate id, authorization review id, preflight id, hold id, source answer id, source record id, source family, review route, founder question, permission question, authority flag audit, answer_changed=false, retrieval_config_changed=false, rollback, monitoring, stop condition, expiry, and production boundary before review-decision readiness.`,
  non_execution_review_clause: reviewClause,
  risk_review: `Risk remains: ${inputRelease} controlled draft mismatch, v3.9.9 founder posture id mismatch, review decision id mismatch, draft review gate id mismatch, draft gate id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, answer boundary mismatch, retrieval boundary mismatch, founder decision mismatch, authorization review mismatch, preflight mismatch, hold mismatch, source mismatch, rights change, ambiguous review language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, answer change, retrieval change, execution, storage, canonical, public release, or production flag must block movement.`,
  rollback_review: `Rollback review passes only when before_hash, ${inputRelease} draft audit, v3.9.9 founder posture audit, answer boundary audit, retrieval boundary audit, draft-review audit, question handoff audit, source identity audit, and failure review remain visible and no source state is written.`,
  monitoring_review: `Monitoring review keeps audit receipt, stop condition, failure review, reviewer handoff, v3.9.9 founder posture id, source identity, answer_changed=false, retrieval_config_changed=false, authority flag audit, and before-write check visible before any controlled review decision gate.`,
  stop_condition: `Stop if the ${inputRelease} draft gate id mismatches, v3.9.9 founder posture id mismatches, review decision id mismatches, draft review gate id mismatches, review route mismatches, founder question mismatches, permission question mismatches, authority flag audit mismatches, answer state changes, retrieval state changes, founder decision id mismatches, authorization review id mismatches, preflight id mismatches, hold id mismatches, source ids mismatch, rights change, review language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, answer change, retrieval change, execution, storage, canonical, public release, or production flag is true.`,
  expiry_check: `Controlled permission execution authorization draft review gate re-entry expires at the next material ${inputRelease} controlled draft, v3.9.9 founder posture, review decision, draft, source, answer state, retrieval state, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.`,
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  clarification_question: `Which exact ${inputRelease} controlled draft packet should this review carry forward, and which single authority boundary should remain most visible?`,
  return_reason: `Return if the ${inputRelease} controlled draft packet loses route, question, audit, founder posture id, source identity, answer boundary, or retrieval boundary clarity.`,
  hold_reason: `Hold until the reviewer can see the exact ${inputRelease} controlled draft packet, source ids, route, questions, founder posture id, answer_changed=false, retrieval_config_changed=false, and authority audit.`,
  block_reason: `Block if any authority flag becomes true or the ${inputRelease} handoff is changed.`,
  controlled_permission_execution_authorization_draft_review_ready: true,
  permission_execution_authorization_draft_review_recorded: true,
  founder_permission_execution_authorization_review_decision_candidate_ready: true,
  ...falseFlags,
  next_gate_required: nextGate,
  next_gate: nextGate,
  created_at: "2026-07-05T00:00:00.000Z"
};
reviewData.boundary = {
  ...reviewData.boundary,
  next_gate_required: nextGate,
  ...falseFlags
};
write(reviewDataFile, `${JSON.stringify(reviewData, null, 2)}\n`);

let js = read(jsFile);
js = replaceAllIfPresent(js, "v3.9.6", inputRelease);
js = replaceAllIfPresent(js, "v3.9.7", release);
js = replaceAllIfPresent(js, "controlled-permission-execution-authorization-draft-gate-v7", draftData.schema_version);
js = replaceAllIfPresent(js, "controlled-permission-execution-authorization-draft-review-gate-v7", "controlled-permission-execution-authorization-draft-review-gate-v8");
js = replaceRegexRequired(
  js,
  /const blockedWords = .*?;\n/s,
  'const blockedWords = /\\b(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|answer changed|retrieval changed|retrieval config changed|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production now|launch production allowed|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|answer_changed true|retrieval_config_changed true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)\\b/i;\n',
  "draft review blocked words"
);
if (!js.includes("const draftPacketTextFields = [")) {
  js = js.replace(
    "  const blockedWords = ",
    `  const draftPacketTextFields = [
    "draft_scope",
    "draft_language",
    "draft_rationale",
    "draft_evidence_summary",
    "non_execution_draft_clause",
    "risk_acknowledgment",
    "rollback_condition",
    "monitoring_condition",
    "stop_condition",
    "expiry_check",
    "production_boundary",
    "clarification_question",
    "return_reason",
    "hold_reason",
    "block_reason"
  ];
  const blockedWords = `
  );
}
if (!js.includes("function noUnsafeDraftPacketText(packet)")) {
  js = js.replace(
    "  function matchesSourceHandoff(packet, config) {",
    `  function noUnsafeDraftPacketText(packet) {
    return draftPacketTextFields.every((field) => !hasUnsafeAuthority(packet && packet[field]));
  }

  function matchesSourceHandoff(packet, config) {`
  );
}
js = js.replace(
  "      allFlagsTrue(packet, draftPacketReadyFlags) &&\n      allFlagsFalse(packet, falseAuthorityFlags)",
  "      allFlagsTrue(packet, draftPacketReadyFlags) &&\n      allFlagsFalse(packet, falseAuthorityFlags) &&\n      noUnsafeDraftPacketText(packet)"
);
write(jsFile, js);

let html = read(pageFile);
html = replaceAllIfPresent(html, "v3.9.7 review", releaseBadge);
html = replaceAllIfPresent(html, "v3.9.7", release);
html = replaceAllIfPresent(html, "v3.9.6", inputRelease);
html = replaceAllIfPresent(
  html,
  "Review one draft. Keep the light soft.",
  "Review one draft. Keep every lock visible."
);
html = replaceAllIfPresent(
  html,
  "Review the draft. Let nothing rush.",
  "Review softly. Decide later."
);
html = replaceAllIfPresent(
  html,
  `VedaPath reviews the ${inputRelease} controlled draft as one calm handoff: source identity intact, questions intact, authority closed, and only the next decision candidate prepared.`,
  `VedaPath reviews the ${inputRelease} controlled draft as one calm handoff: source identity intact, questions intact, answer changes closed, retrieval changes closed, authority closed, and only the next decision candidate prepared.`
);
html = replaceAllIfPresent(html, "Source ids intact.", "Source ids steady.");
html = replaceAllIfPresent(html, "Authority closed.", "Locks stay closed.");
html = replaceAllIfPresent(html, "Review decision next.", "Decision review next.");
html = replaceAllIfPresent(html, "Draft candidate, not permission.", "Draft candidate, not permission.");
html = replaceAllIfPresent(html, "Review signal only, held gently.", "Review signal only, held gently.");
html = replaceAllIfPresent(
  html,
  "Permission grant, authorization approval, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.",
  "Permission grant, authorization approval, answer changes, retrieval changes, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false."
);
write(pageFile, html);

let css = read(cssFile);
const cssBlock = `
/* VEDAPATH v4.0.1 CONTROLLED DRAFT REVIEW GATE RE-ENTRY */
body.permission-execution-draft-review-page.vp-command-shell-ready main.workspace {
  grid-template-columns: minmax(180px, 0.42fr) minmax(0, 3fr) minmax(196px, 0.44fr);
  gap: 16px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-gate {
  padding: 24px;
  gap: 12px;
  border-color: rgba(20, 92, 74, 0.18);
  background:
    linear-gradient(180deg, rgba(255, 255, 253, 0.996), rgba(255, 253, 249, 0.982)),
    linear-gradient(90deg, rgba(20, 92, 74, 0.022), transparent 42%);
  box-shadow: 0 18px 42px rgba(45, 38, 28, 0.035);
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-gate h1 {
  max-width: 680px;
  font-size: clamp(1.62rem, 1.82vw, 2.05rem);
  line-height: 1.08;
  letter-spacing: 0;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-head {
  grid-template-columns: minmax(0, 1fr) 64px;
  min-height: 66px;
  align-items: start;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-head .muted {
  max-width: 82ch;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-mark {
  padding: 8px;
  border-radius: 8px;
  background: linear-gradient(145deg, rgba(255, 250, 242, 0.94), rgba(255, 238, 220, 0.84));
  box-shadow: none;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step-grid {
  grid-template-columns: repeat(4, minmax(112px, 1fr));
  gap: 8px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay {
  gap: 8px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay > div,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-card,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-result,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-rule,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form {
  padding: 12px;
  border-color: rgba(37, 66, 58, 0.12);
  background:
    linear-gradient(180deg, rgba(255, 255, 253, 0.988), rgba(255, 254, 251, 0.958)),
    linear-gradient(90deg, rgba(20, 92, 74, 0.018), transparent);
  box-shadow: none;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay > div {
  border-left-width: 2px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form {
  max-height: 520px;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form h2,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-result h2,
body.permission-execution-draft-review-page.vp-command-shell-ready aside.panel > h2 {
  font-size: 0.98rem;
  line-height: 1.18;
  letter-spacing: 0;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-card strong,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-rule strong,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step strong,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay strong {
  font-size: 0.84rem;
  line-height: 1.24;
  letter-spacing: 0;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-card span,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-rule span,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-step span,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay span {
  font-size: 0.68rem;
}

body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-form textarea:first-of-type,
body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-output {
  min-height: 136px;
}

@media (max-width: 1180px) {
  body.permission-execution-draft-review-page.vp-command-shell-ready main.workspace,
  body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-grid,
  body.permission-execution-draft-review-page.vp-command-shell-ready .draft-review-relay {
    grid-template-columns: 1fr;
  }
}
`;
if (!css.includes("VEDAPATH v4.0.1 CONTROLLED DRAFT REVIEW GATE RE-ENTRY")) {
  css = `${css.trim()}\n\n${cssBlock.trim()}\n`;
}
write(cssFile, css);

let shell = read(shellFile);
shell = replaceRegexRequired(shell, /const releaseBadge = "v\d+\.\d+\.\d+ [^"]+";/, `const releaseBadge = "${releaseBadge}";`, "command shell release badge");
write(shellFile, shell);

let build = read(buildFile);
build = replaceRequired(build, '<span class="version">v4.0.0 draft</span>', `<span class="version">${releaseBadge}</span>`, "build version badge");
build = replaceRequired(
  build,
  `<strong>v4.0.0</strong>
          <p>Controlled Permission Execution Authorization Draft Gate Re-entry: the draft gate receives the v3.9.9 founder posture packet and prepares one reviewable draft while permission, authorization, answer changes, retrieval changes, execution, storage, public release, and production stay false.</p>`,
  `<strong>${release}</strong>
          <p>${releaseName}: the draft-review gate receives the ${inputRelease} controlled draft packet and prepares one review-decision candidate while permission, authorization, answer changes, retrieval changes, execution, storage, public release, and production stay false.</p>`,
  "build current version card"
);
build = replaceRequired(
  build,
  "The trust chain now carries the v3.9.9 founder posture into controlled draft language while preserving question handoff, source identity, answer boundaries, retrieval boundaries, authority flag audit, and all false execution flags.",
  `The trust chain now reviews the ${inputRelease} controlled draft as a calm handoff while preserving question handoff, source identity, answer boundaries, retrieval boundaries, authority flag audit, draft scope, and all false execution flags.`,
  "build full vision copy"
);
build = replaceRequired(
  build,
  `<strong>v4.0.1 Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
          <p>Review the v4.0.0 draft packet before any later authorization posture while every authority flag remains false.</p>`,
  `<strong>${nextRelease}</strong>
          <p>Route the ${release} draft-review packet to founder decision, hold, return, or block while every authority, answer-change, and retrieval-change flag remains false.</p>`,
  "build next release card"
);
build = replaceRequired(
  build,
  `<article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 361: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
          <p>Review the v4.0.0 controlled draft packet while permission, authorization, execution, storage, public release, and production remain false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  `<article class="phase">
        <span class="badge done">Done</span>
        <div>
          <strong>Phase 361: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
          <p>Reviews the ${inputRelease} controlled draft packet into one review-decision candidate while permission, authorization, answer-change, retrieval-change, execution, storage, public release, and production remain false.</p>
        </div>
        <div class="percent">100%</div>
      </article>
      <article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 362: Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong>
          <p>Route the ${release} draft-review packet to founder decision, hold, return, or block while every authority, answer-change, and retrieval-change flag remains false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  "build phase 361 update"
);
build = replaceRequired(build, `<div class="version-row"><span>Release</span><strong>v4.0.0 Controlled Permission Execution Authorization Draft Gate Re-entry</strong></div>`, `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>`, "version release row");
build = replaceRequired(build, `<div class="version-row"><span>Previous</span><strong>v3.9.9 Founder Permission Execution Authorization Decision Gate Re-entry</strong></div>`, `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`, "version previous row");
build = replaceRequired(build, `<div class="version-row"><span>Goal</span><strong>Prepare controlled draft-review candidate language from the v3.9.9 founder posture packet while every authority, answer-change, retrieval-change, and production flag remains false.</strong></div>`, `<div class="version-row"><span>Goal</span><strong>Review the ${inputRelease} controlled draft packet into one review-decision candidate while every authority, answer-change, retrieval-change, and production flag remains false.</strong></div>`, "version goal row");
build = replaceRequired(build, `<div class="version-row"><span>Status</span><strong>Ready for controlled draft review gate re-entry</strong></div>`, `<div class="version-row"><span>Status</span><strong>Ready for controlled review decision gate re-entry</strong></div>`, "version status row");
build = replaceRequired(
  build,
  `<li><span class="dot"></span><span>Re-enter controlled permission execution authorization draft review gate.</span></li>
              <li><span class="dot"></span><span>Receive the v4.0.0 draft packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Preserve source ids, route, questions, founder posture id, answer boundaries, retrieval boundaries, and authority audit.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  `<li><span class="dot"></span><span>Re-enter controlled permission execution authorization review decision gate.</span></li>
              <li><span class="dot"></span><span>Receive the ${release} draft-review packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Choose only founder decision, hold, return, or block as the next posture.</span></li>
              <li><span class="dot"></span><span>Keep storage, canonical writes, public release, and production disabled.</span></li>`,
  "next build checklist"
);
write(buildFile, build);

const readmeBlock = `## ${release} ${releaseName}

- Re-enters the controlled draft-review gate from the ${inputRelease} controlled draft packet.
- Preserves founder posture id, founder decision schema, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, draft scope, answer boundary, retrieval boundary, and authority audit.
- Prepares one controlled review-decision candidate only while permission grant, authorization approval, answer changes, retrieval changes, execution, storage writes, canonical writes, public release, and production remain false.
- Refines the draft-review page into a calmer desk: one incoming draft, one identity check, one boundary, one next decision candidate, and the ${releaseBadge} command-shell badge.
- Updates [Controlled Permission Execution Authorization Draft Review Gate](controlledpermissionexecutionauthorizationdraftreviewgate.html), [Controlled Permission Execution Authorization Draft Review Gate Data](data/vedapath-controlled-permission-execution-authorization-draft-review-gate.json), and [Controlled Permission Execution Authorization Draft Review Gate Notes](docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_REVIEW_GATE.md).`;
let readme = read(readmeFile);
readme = insertBefore(readme, "## v4.0.0 Controlled Permission Execution Authorization Draft Gate Re-entry", readmeBlock, "README v4.0.0");
write(readmeFile, readme);

const notesBlock = `## ${release} ${releaseName}

- Re-enters the controlled draft-review gate from the ${inputRelease} controlled draft packet.
- Produces one review-decision candidate while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.
- Softens the review desk with calmer copy, tighter card rhythm, quieter side panels, and smaller supporting type.
- Sets the build tracker to Phase 362: controlled review decision gate re-entry.`;
let notes = read(notesFile);
notes = insertBefore(notes, "## v4.0.0 Controlled Permission Execution Authorization Draft Gate Re-entry", notesBlock, "prototype notes v4.0.0");
write(notesFile, notes);

const blueprintBlock = `## v4.0.1 Controlled Draft Review Gate

Controlled Permission Execution Authorization Draft Review Gate Re-entry should receive the ${inputRelease} controlled draft packet and prepare only one controlled review-decision candidate while every authority flag remains false.

Release intent:

- accept only the ${inputRelease} controlled draft candidate output
- preserve founder posture id, founder decision schema, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source ids, route, questions, draft scope, answer boundary, retrieval boundary, and authority audit
- output draft-review readiness and review-decision candidate readiness only after the handoff stays intact
- keep permission grant, authorization approval, answer changes, retrieval changes, execution, storage writes, canonical writes, public release, and production unavailable
- move only to the controlled permission execution authorization review decision gate re-entry
- make the review gate feel like a calm inspection desk: one incoming draft, one identity check, one boundary, one next decision candidate

Next release: ${nextRelease}.`;
let blueprint = read(blueprintFile);
blueprint = insertBefore(blueprint, "## v4.0.0 Controlled Draft Gate", blueprintBlock, "blueprint v4.0.0 marker");
write(blueprintFile, blueprint);

const reviewDocBlock = `## ${release} Re-entry

Controlled Permission Execution Authorization Draft Review Gate Re-entry receives the ${inputRelease} controlled draft packet and turns it into one controlled review-decision candidate.

This is review readiness only. It is not permission grant, authorization approval, answer change, retrieval change, execution, storage, canonical write, public release, or production.

Input:

- Schema: ${draftData.schema_version}
- Release: ${inputRelease}
- Status: Controlled draft review candidate prepared; execution remains false.
- Required handoff: founder posture id, review decision id, draft review id, draft gate id, source ids, route, founder question, permission question, draft scope, answer boundary, retrieval boundary, and authority flag audit.

Output:

- controlled_permission_execution_authorization_draft_review_ready=true
- permission_execution_authorization_draft_review_recorded=true
- founder_permission_execution_authorization_review_decision_candidate_ready=true
- permission_granted=false
- authorization_permission_granted=false
- permission_review_approved=false
- founder_permission_granted=false
- execution_packet_authorized=false
- execution_authorized=false
- execution_allowed=false
- answer_changed=false
- retrieval_config_changed=false
- storage_write_enabled=false
- canonical_write_allowed=false
- production_ready=false
- public_release_allowed=false

Product rule: the review page should feel like a calm inspection desk: one draft, one identity check, one boundary, one next review-decision candidate. It must never look or sound like a launch console.

Next gate: ${nextRelease}.`;
let reviewDoc = read(reviewDocFile);
reviewDoc = insertBefore(reviewDoc, "## v3.9.7 Re-entry", reviewDocBlock, "review doc v3.9.7 marker");
write(reviewDocFile, reviewDoc);

console.log(`${release} ${releaseName} applied`);

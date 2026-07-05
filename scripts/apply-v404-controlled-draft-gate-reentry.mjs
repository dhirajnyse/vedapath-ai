import fs from "node:fs";

const release = "v4.0.4";
const inputRelease = "v4.0.3";
const releaseBadge = "v4.0.4 draft";
const releaseName = "Controlled Permission Execution Authorization Draft Gate Re-entry";
const previousRelease = "v4.0.3 Founder Permission Execution Authorization Decision Gate Re-entry";
const nextRelease = "v4.0.5 Controlled Permission Execution Authorization Draft Review Gate Re-entry";
const nextGate = "Controlled permission execution authorization draft review gate re-entry";
const generatedAt = "2026-07-05";
const expectedFounderSchema = "founder-permission-execution-authorization-decision-gate-v8";
const draftSchema = "controlled-permission-execution-authorization-draft-gate-v9";

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

const sourceKeys = [
  "founder_permission_execution_authorization_decision_gate_id",
  "review_decision_gate_id",
  "controlled_permission_execution_authorization_draft_review_gate_id",
  "controlled_permission_execution_authorization_draft_gate_id",
  "founder_decision_gate_id",
  "authorization_review_gate_id",
  "permission_execution_authorization_preflight_id",
  "controlled_permission_execution_hold_id",
  "source_answer_id",
  "source_record_id",
  "source_passage_id",
  "source_phrase_id",
  "source_question_id",
  "source_reference",
  "source_family",
  "review_route",
  "founder_question",
  "permission_question",
  "authority_flag_audit",
  "answer_changed",
  "retrieval_config_changed"
];

const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, content) => fs.writeFileSync(file, content);
const readJson = (file) => JSON.parse(read(file));
const writeJson = (file, data) => write(file, `${JSON.stringify(data, null, 2)}\n`);

function falseFlagObject() {
  return Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false]));
}

function falseFlagSentence() {
  return falseAuthorityFlags.map((flag) => `${flag} remains false`).join(", ");
}

function replaceRegexRequired(text, regex, replacement, label) {
  if (!regex.test(text)) {
    if (text.includes(replacement)) return text;
    throw new Error(`Missing regex target: ${label}`);
  }
  return text.replace(regex, replacement);
}

function prependOnce(file, heading, block) {
  const text = read(file);
  if (text.includes(heading)) return;
  write(file, `${block.trim()}\n\n${text}`);
}

function insertBeforeOnce(file, heading, marker, block) {
  const text = read(file);
  if (text.includes(heading)) return;
  if (!text.includes(marker)) throw new Error(`Missing marker ${marker} in ${file}`);
  write(file, text.replace(marker, `${block.trim()}\n\n${marker}`));
}

const falseFlags = falseFlagObject();
const draftData = readJson(draftDataFile);
const founderData = readJson(founderDataFile);
const founderDecision = founderData.sample_decision;

if (founderData.release !== inputRelease || founderDecision.release !== inputRelease) {
  throw new Error(`Expected founder release ${inputRelease}`);
}

if (
  founderData.schema_version !== expectedFounderSchema ||
  founderDecision.founder_permission_execution_authorization_decision_schema !== expectedFounderSchema
) {
  throw new Error(`Expected founder schema ${expectedFounderSchema}`);
}

const sourceFields = Object.fromEntries(
  sourceKeys
    .filter((key) => Object.prototype.hasOwnProperty.call(founderDecision, key))
    .map((key) => [key, founderDecision[key]])
);

Object.assign(sourceFields, {
  founder_decision_release: inputRelease,
  founder_decision_schema: expectedFounderSchema,
  answer_changed: false,
  retrieval_config_changed: false
});

const sampleFounderDecisionPacket = {
  ...founderDecision,
  schema_version: expectedFounderSchema,
  release: inputRelease,
  input_release: founderData.input_release,
  decision_status: "Draft-only founder posture recorded; no authority granted.",
  founder_decision_outcome: "Draft-only",
  next_gate_required: "Controlled permission execution authorization draft gate re-entry",
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

Object.assign(draftData, {
  schema_version: draftSchema,
  release,
  input_release: inputRelease,
  generated_at: generatedAt,
  title: releaseName,
  summary: `Re-enters the controlled draft gate from the ${inputRelease} founder posture packet, preserves source identity, founder posture id, route, questions, answer boundaries, retrieval boundaries, and authority audit, and prepares one reviewable draft while every permission, authorization, execution, answer change, retrieval change, storage, public release, and production path remains disabled.`,
  previous_release: previousRelease,
  source_release: previousRelease,
  next_gate: nextGate,
  source: sourceFields,
  draft_checks: [
    { check: "Input packet", rule: `Must be the ${inputRelease} draft-only founder posture packet.` },
    { check: "Source identity", rule: "All gate ids, founder posture id, source ids, source family, and source reference must match the incoming founder decision." },
    { check: "Question handoff", rule: "Route, founder question, permission question, answer boundary, retrieval boundary, and authority flag audit must remain unchanged." },
    { check: "Draft language", rule: "Draft-review language can be prepared, but it cannot imply permission, authorization, execution, answer changes, retrieval changes, storage, public release, or production." },
    { check: "Authority audit", rule: "Every authority, answer-change, retrieval-change, and production flag must remain false." },
    { check: "Next gate", rule: "The only forward path is the controlled draft-review gate re-entry." }
  ],
  sample_founder_decision_packet: sampleFounderDecisionPacket
});

draftData.sample_draft = {
  ...draftData.sample_draft,
  draft_state: "Controlled authorization draft prepared",
  draft_actor: "Controlled draft gate",
  drafter_name: "Draft reviewer sample",
  schema_version: draftSchema,
  release,
  input_release: inputRelease,
  ...sourceFields,
  draft_scope: `Prepare reviewable wording for the ${inputRelease} founder posture packet only. The draft can be inspected by the next review gate, but it cannot grant permission, approve authorization, execute, change an answer, change retrieval, store, update canonical records, publish, launch, or run any production path.`,
  draft_language: `Controlled draft-review candidate for the ${inputRelease} founder posture packet: preserve the reviewed source identity, founder posture id, route, founder question, permission question, answer_changed=false, retrieval_config_changed=false, and authority audit. The draft is only language for review. It does not open execution, answer changes, retrieval changes, storage, canonical writes, public release, or production.`,
  draft_rationale: `The ${inputRelease} founder posture is draft-only and source-locked. It can become reviewable language because the question handoff, source identity, founder posture id, answer_changed=false, retrieval_config_changed=false, and authority flag audit are intact. This is not a live authorization; it is only a controlled draft candidate for the next draft review gate.`,
  draft_evidence_summary: `Input release ${inputRelease} has founder_permission_execution_authorization_decision_ready=true, founder_permission_execution_authorization_decision_recorded=true, controlled draft candidate ready=true, source identity preserved, question handoff preserved, authority flag audit preserved, answer_changed=false, retrieval_config_changed=false, and every authority, execution, storage, canonical, public release, and production flag false.`,
  non_execution_draft_clause: draftClause,
  risk_acknowledgment: `Risk remains: ${inputRelease} founder posture mismatch, founder posture id mismatch, review decision id mismatch, draft review id mismatch, draft gate id mismatch, review route mismatch, founder question mismatch, permission question mismatch, authority flag audit mismatch, source identity mismatch, answer-change mismatch, retrieval-change mismatch, rights change, ambiguous draft language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, answer change, retrieval change, storage, canonical, public release, or production flag must block movement.`,
  rollback_condition: `Rollback by returning to the ${inputRelease} founder decision gate and requiring a fresh non-authorizing founder posture before any draft-review candidate is prepared again.`,
  monitoring_condition: `Monitor only the frozen ${inputRelease} founder posture id, route, questions, source identity, authority audit, answer_changed=false, retrieval_config_changed=false, and false authority flags before preparing the controlled draft review candidate.`,
  stop_condition: `Stop if the ${inputRelease} founder posture id, founder decision id, review decision gate id, draft review id, draft gate id, review route, founder question, permission question, authority flag audit, source identity, answer state, retrieval state, rights, rollback, monitoring, packet text, or code changes, or if any permission, authorization, execution, answer change, retrieval change, storage, canonical, public release, or production flag is true.`,
  expiry_check: `Controlled permission execution authorization draft gate re-entry expires at the next material ${inputRelease} founder posture, review decision, draft review, draft, source, answer, retrieval, rights, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, not answer change, not retrieval change, and not execution.`,
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  next_gate: nextGate,
  next_gate_required: nextGate,
  clarification_question: `Which exact ${inputRelease} founder posture packet should this draft-review candidate carry, and which single draft boundary should remain most visible?`,
  return_reason: `Return if the ${inputRelease} founder posture packet loses route, question, audit, founder posture id, source identity, answer-change, or retrieval-change clarity.`,
  hold_reason: `Hold until the reviewer can see the exact ${inputRelease} founder posture packet, source identity, route, questions, authority audit, answer_changed=false, and retrieval_config_changed=false.`,
  block_reason: `Block if any authority flag becomes true or the ${inputRelease} handoff is changed.`,
  controlled_permission_execution_authorization_draft_ready: true,
  permission_execution_authorization_draft_recorded: true,
  controlled_permission_execution_authorization_draft_review_candidate_ready: true,
  ...falseFlags
};

draftData.boundary = {
  ...draftData.boundary,
  next_gate_required: nextGate,
  ...falseFlags
};

writeJson(draftDataFile, draftData);

const js = String.raw`(function () {
  const configUrl = "data/vedapath-controlled-permission-execution-authorization-draft-gate.json";
  const release = "${release}";
  const inputRelease = "${inputRelease}";
  const draftSchema = "${draftSchema}";
  const founderSchema = "${expectedFounderSchema}";
  const falseAuthorityFlags = ${JSON.stringify(falseAuthorityFlags, null, 2)};
  const decisionReadyFlags = [
    "founder_permission_execution_authorization_decision_ready",
    "founder_permission_execution_authorization_decision_recorded",
    "controlled_permission_execution_authorization_draft_candidate_ready"
  ];
  const sourceIdentityFields = [
    "founder_permission_execution_authorization_decision_gate_id",
    "review_decision_gate_id",
    "controlled_permission_execution_authorization_draft_review_gate_id",
    "controlled_permission_execution_authorization_draft_gate_id",
    "founder_decision_gate_id",
    "authorization_review_gate_id",
    "permission_execution_authorization_preflight_id",
    "controlled_permission_execution_hold_id",
    "source_answer_id",
    "source_record_id",
    "source_passage_id",
    "source_phrase_id",
    "source_question_id",
    "source_reference",
    "source_family"
  ];
  const handoffFields = [
    "review_route",
    "founder_question",
    "permission_question",
    "authority_flag_audit",
    "answer_changed",
    "retrieval_config_changed"
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
  const draftTextFields = [
    "draft_scope",
    "draft_language",
    "draft_rationale",
    "draft_evidence_summary",
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
  const blockedWords = /\b(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|answer change allowed|answer changed true|answer_changed true|retrieval change allowed|retrieval changed true|retrieval_config_changed true|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production now|launch production allowed|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)\b/i;

  function compact(value) {
    return String(value == null ? "" : value).trim();
  }

  function get(obj, key) {
    return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
  }

  function hasUnsafeAuthority(value) {
    return blockedWords.test(compact(value));
  }

  function allFlagsFalse(packet, flags) {
    return flags.every((flag) => get(packet, flag) === false);
  }

  function allFlagsTrue(packet, flags) {
    return flags.every((flag) => get(packet, flag) === true);
  }

  function hasText(value, groups) {
    const text = compact(value).toLowerCase();
    return groups.every((group) => group.some((item) => text.includes(String(item).toLowerCase())));
  }

  function noUnsafeText(packet, fields) {
    return fields.every((field) => !hasUnsafeAuthority(packet && packet[field]));
  }

  function matchesSourceIdentity(packet, config) {
    if (!packet || !config || !config.source) return false;
    return sourceIdentityFields.every((field) => {
      if (config.source[field] == null) return true;
      return compact(packet[field]) === compact(config.source[field]);
    });
  }

  function matchesSourceHandoff(packet, config) {
    if (!packet || !config || !config.source) return false;
    return handoffFields.every((field) => get(packet, field) === get(config.source, field));
  }

  function draftPreservesCarry(draft, decisionPacket, config) {
    if (!draft || !decisionPacket || !config || !config.source) return false;
    const sourceOk = sourceIdentityFields.every((field) => {
      if (config.source[field] == null) return true;
      const value = compact(draft[field]);
      return value && value === compact(decisionPacket[field]) && value === compact(config.source[field]);
    });
    const handoffOk = handoffFields.every((field) => get(draft, field) === get(decisionPacket, field) && get(draft, field) === get(config.source, field));
    return sourceOk && handoffOk;
  }

  function draftHasNoAuthorityFlags(draft) {
    return allFlagsFalse(draft || {}, falseAuthorityFlags);
  }

  function founderDecisionPacketReady(packet, config) {
    return Boolean(
      packet &&
      packet.schema_version === founderSchema &&
      packet.release === inputRelease &&
      packet.founder_selected_posture === "Draft-only" &&
      (packet.founder_decision_status === "Draft-only founder posture recorded; no authority granted." ||
        packet.decision_status === "Draft-only founder posture recorded; no authority granted.") &&
      packet.founder_decision_outcome === "Draft-only" &&
      packet.next_gate_required === "Controlled permission execution authorization draft gate re-entry" &&
      compact(packet.founder_permission_execution_authorization_decision_gate_id) === compact(config.source.founder_permission_execution_authorization_decision_gate_id) &&
      matchesSourceIdentity(packet, config) &&
      matchesSourceHandoff(packet, config) &&
      allFlagsTrue(packet, decisionReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags) &&
      noUnsafeText(packet, founderPacketTextFields)
    );
  }

  function keepsNonExecutionDraftBoundary(value) {
    const text = compact(value);
    if (!text || hasUnsafeAuthority(text)) return false;
    const mustMentionTrue = [
      "founder_permission_execution_authorization_decision_ready may be true",
      "founder_permission_execution_authorization_decision_recorded may be true",
      "controlled_permission_execution_authorization_draft_candidate_ready may be true",
      "controlled_permission_execution_authorization_draft_ready may be true",
      "permission_execution_authorization_draft_recorded may be true",
      "controlled_permission_execution_authorization_draft_review_candidate_ready may be true"
    ];
    const mustMentionFalse = falseAuthorityFlags.map((flag) => flag + " remains false");
    return mustMentionTrue.every((phrase) => text.includes(phrase)) &&
      mustMentionFalse.every((phrase) => text.includes(phrase));
  }

  function requiredMissing(config, state, draft) {
    const required = (config.required_by_state && config.required_by_state[state]) || [];
    return required.filter((key) => !compact(draft[key]));
  }

  function blocked(status, details) {
    return {
      draft_status: status,
      blocked: true,
      controlled_permission_execution_authorization_draft_ready: false,
      permission_execution_authorization_draft_recorded: false,
      controlled_permission_execution_authorization_draft_review_candidate_ready: false,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      details
    };
  }

  function controlledPermissionExecutionAuthorizationDraftGate(config, decisionPacket, draft) {
    if (!config || config.schema_version !== draftSchema || config.release !== release || config.input_release !== inputRelease) {
      return blocked("Blocked: draft gate config must be the current controlled v4.0.4 packet.", {});
    }

    if (!founderDecisionPacketReady(decisionPacket, config)) {
      return blocked("Blocked: founder decision packet must be the v4.0.3 draft-only, non-authorizing posture packet.", {
        next_gate_required: "Controlled permission execution authorization draft gate re-entry"
      });
    }

    const state = compact(draft && draft.draft_state) || "Draft packet";
    const missing = requiredMissing(config, state, draft || {});
    if (missing.length) {
      return blocked("Blocked: missing required fields for " + state + ".", { missing });
    }

    if (!draftHasNoAuthorityFlags(draft)) {
      return blocked("Blocked: draft cannot contain any true permission, authorization, answer-change, retrieval-change, execution, storage, public release, or production flag.", {});
    }

    if (!draftPreservesCarry(draft, decisionPacket, config)) {
      return blocked("Blocked: draft must preserve the v4.0.3 source identity, review route, questions, answer boundary, retrieval boundary, and authority audit.", {
        required_identity: sourceIdentityFields,
        required_handoff: handoffFields
      });
    }

    for (const field of draftTextFields) {
      if (hasUnsafeAuthority(draft[field])) {
        return blocked("Blocked: " + field + " must not grant permission, authorization, answer change, retrieval change, or execution.", { field });
      }
    }

    if (!keepsNonExecutionDraftBoundary(draft.non_execution_draft_clause)) {
      return blocked("Blocked: non-execution draft clause must keep every authority flag false.", {});
    }

    if (!compact(draft.draft_scope).includes(inputRelease) ||
        !hasText(draft.draft_rationale, [[inputRelease], ["question handoff"], ["authority flag audit"], ["source identity", "source ids"], ["answer_changed=false"], ["retrieval_config_changed=false"], ["draft review gate"], ["not a live authorization"]]) ||
        !hasText(draft.draft_evidence_summary, [["authority flag audit"], ["answer_changed=false"], ["retrieval_config_changed=false"]])) {
      return blocked("Blocked: draft text must name the v4.0.3 handoff, source identity, answer/retrieval locks, draft review gate, and authority audit.", {});
    }

    if (hasUnsafeAuthority(draft.production_boundary) || !compact(draft.production_boundary).includes("Production remains unavailable")) {
      return blocked("Blocked: production boundary must stay closed.", {});
    }

    if (state === "Needs draft clarification") {
      return blocked("Needs clarification: answer the draft question before review readiness.", {
        clarification_question: draft.clarification_question
      });
    }

    if (state === "Return to founder decision") {
      return blocked("Return: send packet back to founder decision.", { return_reason: draft.return_reason });
    }

    if (state === "Draft hold") {
      return blocked("Hold: draft is paused.", { hold_reason: draft.hold_reason });
    }

    if (state === "Draft rejected" || state === "Authorization approval blocked" || state === "Execution blocked" || state === "Production forbidden") {
      return blocked("Blocked: " + (draft.block_reason || state), { state });
    }

    if (state === "Draft expired") {
      return blocked("Expired: recheck the founder decision and evidence.", { hold_reason: draft.hold_reason });
    }

    if (state !== "Controlled authorization draft prepared") {
      return blocked("Draft: packet is not ready for draft review.", { state });
    }

    return {
      schema_version: config.schema_version,
      release: config.release,
      input_release: config.input_release,
      draft_status: "Controlled draft review candidate prepared; all authority remains false.",
      controlled_permission_execution_authorization_draft_gate_id: draft.controlled_permission_execution_authorization_draft_gate_id,
      founder_permission_execution_authorization_decision_gate_id: draft.founder_permission_execution_authorization_decision_gate_id,
      review_decision_gate_id: draft.review_decision_gate_id,
      controlled_permission_execution_authorization_draft_review_gate_id: draft.controlled_permission_execution_authorization_draft_review_gate_id,
      founder_decision_gate_id: draft.founder_decision_gate_id,
      authorization_review_gate_id: draft.authorization_review_gate_id,
      permission_execution_authorization_preflight_id: draft.permission_execution_authorization_preflight_id,
      controlled_permission_execution_hold_id: draft.controlled_permission_execution_hold_id,
      source_answer_id: draft.source_answer_id,
      source_record_id: draft.source_record_id,
      source_passage_id: draft.source_passage_id,
      source_phrase_id: draft.source_phrase_id,
      source_question_id: draft.source_question_id,
      source_reference: draft.source_reference,
      source_family: draft.source_family,
      review_route: draft.review_route,
      founder_question: draft.founder_question,
      permission_question: draft.permission_question,
      authority_flag_audit: draft.authority_flag_audit,
      founder_permission_execution_authorization_decision_ready: decisionPacket.founder_permission_execution_authorization_decision_ready === true,
      founder_permission_execution_authorization_decision_recorded: decisionPacket.founder_permission_execution_authorization_decision_recorded === true,
      controlled_permission_execution_authorization_draft_candidate_ready: decisionPacket.controlled_permission_execution_authorization_draft_candidate_ready === true,
      controlled_permission_execution_authorization_draft_ready: true,
      permission_execution_authorization_draft_recorded: true,
      controlled_permission_execution_authorization_draft_review_candidate_ready: true,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
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
      preserves_source_identity: matchesSourceIdentity(draft, config),
      preserves_review_route: compact(draft.review_route) === compact(config.source.review_route),
      preserves_founder_question: compact(draft.founder_question) === compact(config.source.founder_question),
      preserves_permission_question: compact(draft.permission_question) === compact(config.source.permission_question),
      preserves_authority_flag_audit: compact(draft.authority_flag_audit) === compact(config.source.authority_flag_audit),
      preserves_answer_boundary: draft.answer_changed === false,
      preserves_retrieval_boundary: draft.retrieval_config_changed === false,
      next_gate_required: "Controlled permission execution authorization draft review gate re-entry",
      created_at: new Date().toISOString()
    };
  }

  function draftSnapshot(result) {
    return {
      status: result.draft_status,
      ready: result.controlled_permission_execution_authorization_draft_ready === true,
      review_candidate: result.controlled_permission_execution_authorization_draft_review_candidate_ready === true,
      permission_granted: result.permission_granted === true,
      answer_changed: result.answer_changed === true,
      retrieval_config_changed: result.retrieval_config_changed === true,
      execution_allowed: result.execution_allowed === true,
      production_ready: result.production_ready === true,
      next_gate_required: result.next_gate_required || "None"
    };
  }

  function safeParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value == null ? "" : String(value);
  }

  function readValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
  }

  function renderCard(result) {
    const card = document.getElementById("draftGateResultCard");
    if (!card) return;
    const snapshot = draftSnapshot(result);
    card.dataset.state = snapshot.status || "Blocked";
    card.innerHTML = '<span>Draft result</span>' +
      '<h2>' + snapshot.status + '</h2>' +
      '<div class="draft-gate-list">' +
      '<div class="draft-gate-card"><span>Draft ready</span><strong>' + String(snapshot.ready) + '</strong></div>' +
      '<div class="draft-gate-card"><span>Review candidate</span><strong>' + String(snapshot.review_candidate) + '</strong></div>' +
      '<div class="draft-gate-card"><span>Permission granted</span><strong>' + String(snapshot.permission_granted) + '</strong></div>' +
      '<div class="draft-gate-card"><span>Answer changed</span><strong>' + String(snapshot.answer_changed) + '</strong></div>' +
      '<div class="draft-gate-card"><span>Retrieval changed</span><strong>' + String(snapshot.retrieval_config_changed) + '</strong></div>' +
      '<div class="draft-gate-card"><span>Execution allowed</span><strong>' + String(snapshot.execution_allowed) + '</strong></div>' +
      '</div>';
  }

  function renderList(id, items) {
    const root = document.getElementById(id);
    if (!root) return;
    root.innerHTML = items.map((item) => '<div class="draft-gate-card"><span>' + item.label + '</span><strong>' + item.value + '</strong></div>').join("");
  }

  function loadConfig(config) {
    const draft = config.sample_draft;
    setValue("draftDecisionPacket", JSON.stringify(config.sample_founder_decision_packet, null, 2));
    setValue("draftState", draft.draft_state);
    setValue("draftActor", draft.draft_actor);
    setValue("draftName", draft.drafter_name);
    setValue("draftGateId", draft.controlled_permission_execution_authorization_draft_gate_id);
    setValue("draftFounderPostureId", draft.founder_permission_execution_authorization_decision_gate_id);
    setValue("draftReviewDecisionId", draft.review_decision_gate_id);
    setValue("draftDraftReviewId", draft.controlled_permission_execution_authorization_draft_review_gate_id);
    setValue("draftDecisionId", draft.founder_decision_gate_id);
    setValue("draftReviewId", draft.authorization_review_gate_id);
    setValue("draftPreflightId", draft.permission_execution_authorization_preflight_id);
    setValue("draftHoldId", draft.controlled_permission_execution_hold_id);
    setValue("draftSourceAnswer", draft.source_answer_id);
    setValue("draftSourceRecord", draft.source_record_id);
    setValue("draftSourcePassage", draft.source_passage_id);
    setValue("draftSourcePhrase", draft.source_phrase_id);
    setValue("draftSourceQuestion", draft.source_question_id);
    setValue("draftSourceReference", draft.source_reference);
    setValue("draftSourceFamily", draft.source_family);
    setValue("draftReviewRoute", draft.review_route);
    setValue("draftFounderQuestion", draft.founder_question);
    setValue("draftPermissionQuestion", draft.permission_question);
    setValue("draftAuthorityAudit", draft.authority_flag_audit);
    setValue("draftAnswerChanged", String(draft.answer_changed));
    setValue("draftRetrievalChanged", String(draft.retrieval_config_changed));
    setValue("draftScopeText", draft.draft_scope);
    setValue("draftLanguage", draft.draft_language);
    setValue("draftRationale", draft.draft_rationale);
    setValue("draftSummary", draft.draft_evidence_summary);
    setValue("draftBoundary", draft.non_execution_draft_clause);
    setValue("draftRisk", draft.risk_acknowledgment);
    setValue("draftRollback", draft.rollback_condition);
    setValue("draftMonitoring", draft.monitoring_condition);
    setValue("draftStopCondition", draft.stop_condition);
    setValue("draftExpiry", draft.expiry_check);
    setValue("draftProductionBoundary", draft.production_boundary);
    setValue("draftClarification", draft.clarification_question);
    setValue("draftReturnReason", draft.return_reason);
    setValue("draftHoldReason", draft.hold_reason);
    setValue("draftBlockReason", draft.block_reason);
    renderList("draftGateScope", [
      { label: "Input", value: "v4.0.3 founder posture" },
      { label: "Output", value: "Draft review candidate" },
      { label: "Source", value: "Preserved" },
      { label: "Answer", value: "Unchanged" },
      { label: "Retrieval", value: "Unchanged" },
      { label: "Authority", value: "Closed" }
    ]);
    renderList("draftGateChecks", config.draft_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readDraft() {
    return {
      draft_state: readValue("draftState"),
      draft_actor: readValue("draftActor"),
      drafter_name: readValue("draftName"),
      controlled_permission_execution_authorization_draft_gate_id: readValue("draftGateId"),
      founder_permission_execution_authorization_decision_gate_id: readValue("draftFounderPostureId"),
      review_decision_gate_id: readValue("draftReviewDecisionId"),
      controlled_permission_execution_authorization_draft_review_gate_id: readValue("draftDraftReviewId"),
      founder_decision_gate_id: readValue("draftDecisionId"),
      authorization_review_gate_id: readValue("draftReviewId"),
      permission_execution_authorization_preflight_id: readValue("draftPreflightId"),
      controlled_permission_execution_hold_id: readValue("draftHoldId"),
      source_answer_id: readValue("draftSourceAnswer"),
      source_record_id: readValue("draftSourceRecord"),
      source_passage_id: readValue("draftSourcePassage"),
      source_phrase_id: readValue("draftSourcePhrase"),
      source_question_id: readValue("draftSourceQuestion"),
      source_reference: readValue("draftSourceReference"),
      source_family: readValue("draftSourceFamily"),
      review_route: readValue("draftReviewRoute"),
      founder_question: readValue("draftFounderQuestion"),
      permission_question: readValue("draftPermissionQuestion"),
      authority_flag_audit: readValue("draftAuthorityAudit"),
      answer_changed: compact(readValue("draftAnswerChanged")).toLowerCase() === "true",
      retrieval_config_changed: compact(readValue("draftRetrievalChanged")).toLowerCase() === "true",
      draft_scope: readValue("draftScopeText"),
      draft_language: readValue("draftLanguage"),
      draft_rationale: readValue("draftRationale"),
      draft_evidence_summary: readValue("draftSummary"),
      non_execution_draft_clause: readValue("draftBoundary"),
      risk_acknowledgment: readValue("draftRisk"),
      rollback_condition: readValue("draftRollback"),
      monitoring_condition: readValue("draftMonitoring"),
      stop_condition: readValue("draftStopCondition"),
      expiry_check: readValue("draftExpiry"),
      production_boundary: readValue("draftProductionBoundary"),
      clarification_question: readValue("draftClarification"),
      return_reason: readValue("draftReturnReason"),
      hold_reason: readValue("draftHoldReason"),
      block_reason: readValue("draftBlockReason"),
      ...Object.fromEntries(falseAuthorityFlags.filter((flag) => flag !== "answer_changed" && flag !== "retrieval_config_changed").map((flag) => [flag, false]))
    };
  }

  function saved() {
    return safeParse(localStorage.getItem("vedapath-controlled-permission-execution-authorization-drafts") || "[]", []);
  }

  function writeSaved(items) {
    localStorage.setItem("vedapath-controlled-permission-execution-authorization-drafts", JSON.stringify(items.slice(0, 12)));
  }

  function renderSaved() {
    const list = document.getElementById("draftGateSaved");
    if (!list) return;
    const items = saved();
    list.innerHTML = items.length ? items.map((item) => '<div class="draft-gate-card"><span>' + item.created_at + '</span><strong>' + item.draft_status + '</strong></div>').join("") : '<p class="muted">No local draft packets saved yet.</p>';
  }

  async function init() {
    if (typeof document === "undefined") return;
    const response = await fetch(configUrl);
    const config = await response.json();
    const state = document.getElementById("draftState");
    if (state) {
      state.innerHTML = config.draft_states.map((name) => '<option value="' + name + '">' + name + '</option>').join("");
    }
    loadConfig(config);
    renderSaved();
    const run = () => {
      const decisionPacket = safeParse(readValue("draftDecisionPacket"), {});
      const result = controlledPermissionExecutionAuthorizationDraftGate(config, decisionPacket, readDraft());
      setValue("draftOutput", JSON.stringify(result, null, 2));
      renderCard(result);
      return result;
    };
    document.getElementById("runDraftGate")?.addEventListener("click", run);
    document.getElementById("loadDraftSample")?.addEventListener("click", () => {
      loadConfig(config);
      run();
    });
    document.getElementById("saveDraftGate")?.addEventListener("click", () => {
      const result = run();
      writeSaved([result, ...saved()]);
      renderSaved();
    });
    document.getElementById("clearDraftGates")?.addEventListener("click", () => {
      writeSaved([]);
      renderSaved();
    });
    document.getElementById("copyDraftGate")?.addEventListener("click", async () => {
      const output = readValue("draftOutput");
      if (navigator.clipboard && output) await navigator.clipboard.writeText(output);
    });
    run();
  }

  window.vedapathControlledPermissionExecutionAuthorizationDraftGate = {
    founderDecisionPacketReady,
    matchesSourceHandoff,
    matchesSourceIdentity,
    draftPreservesCarry,
    draftPreservesHandoff: draftPreservesCarry,
    draftHasNoAuthorityFlags,
    hasUnsafeAuthority,
    keepsNonExecutionDraftBoundary,
    controlledPermissionExecutionAuthorizationDraftGate,
    draftSnapshot
  };

  init().catch((error) => {
    console.error("Controlled permission execution authorization draft gate failed", error);
  });
})();`;

write(jsFile, `${js}\n`);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Permission Execution Authorization Draft Gate Re-entry</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-permission-execution-authorization-draft-gate.css">
    <link rel="stylesheet" href="assets/vedapath-command-shell.css">
  </head>
  <body class="permission-execution-draft-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Controlled draft gate</span>
          </div>
        </a>
        <nav class="nav" aria-label="Project links">
          <a class="link" href="index.html">Home</a>
          <a class="link" href="build-status.html">Build</a>
          <a class="link" href="brand/brand-board.html">Brand</a>
          <a class="link" href="blueprint.html">Blueprint</a>
          <a class="link" href="citedanswerlab.html">Answers</a>
          <a class="link active" href="reviewqueuepersistence.html">Review</a>
          <a class="link" href="mantralenslab.html">Mantra</a>
          <a class="link" href="lifecompanionlab.html">Life</a>
          <a class="link" href="conversationcompanionlab.html">Talk</a>
          <a class="link" href="patterncompanionlab.html">Pattern</a>
          <a class="link" href="daily.html">Daily</a>
          <span class="version">${releaseBadge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="VedaPath Controlled Permission Execution Authorization Draft Gate workspace">
        <aside class="panel draft-side-panel">
          <span class="eyebrow">Quiet draft boundary</span>
          <h2>One founder posture becomes one reviewable draft.</h2>
          <p class="muted">The gate receives the ${inputRelease} founder posture, keeps source identity and answer/retrieval locks intact, and prepares draft language only.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Receive</strong><p>${inputRelease} founder posture.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Preserve</strong><p>Source, route, questions, audit.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Draft</strong><p>Review candidate only.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Lock</strong><p>No authority opens.</p></div></div>
          </div>
          <div class="button-row">
            <a class="button primary" href="controlledpermissionexecutionauthorizationdraftreviewgate.html">Open Draft Review</a>
            <a class="button" href="founderpermissionexecutionauthorizationdecisiongate.html">Open Founder Decision</a>
          </div>
        </aside>

        <section class="panel draft-gate" id="controlledPermissionExecutionAuthorizationDraftGate">
          <div class="draft-gate-head">
            <div>
              <span class="eyebrow">Controlled draft desk</span>
              <h1>Write the draft. Open nothing.</h1>
              <p class="muted">VedaPath carries the ${inputRelease} founder posture into one reviewable draft, then stops before authority, answer changes, retrieval changes, execution, storage, public release, or production.</p>
            </div>
            <div class="draft-gate-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath controlled draft mark"></div>
          </div>

          <section class="draft-step-grid" aria-label="Draft gate flow">
            <div class="draft-step"><span>1</span><strong>Founder posture</strong><p>Draft-only input.</p></div>
            <div class="draft-step"><span>2</span><strong>Source handoff</strong><p>No id or wording drift.</p></div>
            <div class="draft-step"><span>3</span><strong>Draft review</strong><p>Candidate only.</p></div>
            <div class="draft-step"><span>4</span><strong>Authority locks</strong><p>Still false.</p></div>
          </section>

          <section class="draft-relay" aria-label="Controlled draft relay">
            <div>
              <span>Incoming</span>
              <strong>${inputRelease} founder posture</strong>
              <p>Draft-only, source-locked, non-authorizing.</p>
            </div>
            <div>
              <span>Carried forward</span>
              <strong>Source, route, questions, audit</strong>
              <p>Answer and retrieval locks remain false.</p>
            </div>
            <div>
              <span>Outgoing</span>
              <strong>Draft review candidate</strong>
              <p>No execution, storage, release, or production opens.</p>
            </div>
          </section>

          <section class="draft-gate-grid">
            <div class="draft-gate-form">
              <h2>Draft Packet</h2>
              <label>Founder decision packet<textarea id="draftDecisionPacket"></textarea></label>
              <label>Draft state<select id="draftState"></select></label>
              <div class="draft-form-pair">
                <label>Draft actor<input id="draftActor" type="text" placeholder="Controlled draft gate"></label>
                <label>Drafter name<input id="draftName" type="text" placeholder="Draft reviewer sample"></label>
              </div>
              <label>Draft gate id<input id="draftGateId" type="text"></label>
              <label>Founder posture gate id<input id="draftFounderPostureId" type="text"></label>
              <label>Review decision gate id<input id="draftReviewDecisionId" type="text"></label>
              <label>Draft review gate id<input id="draftDraftReviewId" type="text"></label>
              <label>Founder decision gate id<input id="draftDecisionId" type="text"></label>
              <label>Authorization review gate id<input id="draftReviewId" type="text"></label>
              <label>Authorization preflight id<input id="draftPreflightId" type="text"></label>
              <label>Execution hold id<input id="draftHoldId" type="text"></label>
              <label>Source answer id<input id="draftSourceAnswer" type="text"></label>
              <label>Source record id<input id="draftSourceRecord" type="text"></label>
              <label>Source passage id<input id="draftSourcePassage" type="text"></label>
              <label>Source phrase id<input id="draftSourcePhrase" type="text"></label>
              <label>Source question id<input id="draftSourceQuestion" type="text"></label>
              <label>Source reference<input id="draftSourceReference" type="text"></label>
              <label>Source family<input id="draftSourceFamily" type="text"></label>
              <label>Review route<input id="draftReviewRoute" type="text"></label>
              <label>Founder question<textarea id="draftFounderQuestion"></textarea></label>
              <label>Permission question<textarea id="draftPermissionQuestion"></textarea></label>
              <label>Authority flag audit<textarea id="draftAuthorityAudit"></textarea></label>
              <div class="draft-form-pair">
                <label>Answer changed<input id="draftAnswerChanged" type="text"></label>
                <label>Retrieval changed<input id="draftRetrievalChanged" type="text"></label>
              </div>
              <label>Draft scope<textarea id="draftScopeText"></textarea></label>
              <label>Draft language<textarea id="draftLanguage"></textarea></label>
              <label>Draft rationale<textarea id="draftRationale"></textarea></label>
              <label>Draft evidence summary<textarea id="draftSummary"></textarea></label>
              <label>Non-execution draft clause<textarea id="draftBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="draftRisk"></textarea></label>
              <label>Rollback condition<textarea id="draftRollback"></textarea></label>
              <label>Monitoring condition<textarea id="draftMonitoring"></textarea></label>
              <label>Stop condition<textarea id="draftStopCondition"></textarea></label>
              <label>Expiry check<textarea id="draftExpiry"></textarea></label>
              <label>Production boundary<textarea id="draftProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="draftClarification"></textarea></label>
              <label>Return reason<textarea id="draftReturnReason"></textarea></label>
              <label>Hold reason<textarea id="draftHoldReason"></textarea></label>
              <label>Block reason<textarea id="draftBlockReason"></textarea></label>
              <div class="draft-gate-actions">
                <button class="button primary" id="runDraftGate" type="button">Run Draft</button>
                <button class="button safe" id="loadDraftSample" type="button">Load Sample</button>
                <button class="button" id="saveDraftGate" type="button">Save Local</button>
                <button class="button" id="clearDraftGates" type="button">Clear Local</button>
              </div>
            </div>
            <div class="draft-gate-review">
              <section class="draft-gate-result" id="draftGateResultCard" data-state="Blocked"></section>
              <section>
                <h2>Draft Scope</h2>
                <div class="draft-gate-list" id="draftGateScope"></div>
              </section>
              <section>
                <h2>Draft Checks</h2>
                <div class="draft-gate-rules" id="draftGateChecks"></div>
              </section>
            </div>
          </section>

          <section class="draft-gate-grid draft-output-grid">
            <div>
              <div class="draft-gate-actions">
                <button class="button safe" id="copyDraftGate" type="button">Copy Draft Packet</button>
                <a class="button" href="data/vedapath-controlled-permission-execution-authorization-draft-gate.json">Open JSON</a>
              </div>
              <textarea class="draft-gate-output" id="draftOutput" aria-label="Controlled permission execution authorization draft gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Drafts</h2>
              <div class="draft-gate-list" id="draftGateSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight draft-right-panel">
          <span class="badge green">Draft is not authority</span>
          <h2>Draft Review Candidate</h2>
          <p class="muted">One prepared draft can move to review. Every real authority lock stays visible and closed.</p>
          <div class="progress" aria-label="Draft gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>Input</span><strong>${inputRelease}</strong></div>
            <div class="metric"><span>Answer</span><strong>False</strong></div>
            <div class="metric"><span>Retrieval</span><strong>False</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Review</strong></div>
          </div>
          <section class="panel tight boundary">
            <h2>Draft Boundary</h2>
            <p class="draft-gate-boundary">Draft signal only. Permission grant, authorization approval, answer changes, retrieval changes, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a controlled draft-review gate. It does not authorize, execute, store, publish, or launch.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-permission-execution-authorization-draft-gate.js"></script>
    <script src="assets/vedapath-command-shell.js" defer></script>
  </body>
</html>
`;

write(pageFile, html);

let css = read(cssFile);
const cssBlock = `
/* VEDAPATH v4.0.4 CONTROLLED DRAFT DESK RE-ENTRY */
body.permission-execution-draft-page {
  --draft-page-line: rgba(20, 92, 74, 0.16);
  --draft-page-warm-line: rgba(214, 90, 31, 0.18);
}

body.permission-execution-draft-page .workspace {
  grid-template-columns: minmax(190px, 0.42fr) minmax(0, 2.35fr) minmax(210px, 0.46fr);
  gap: 14px;
  align-items: start;
}

body.permission-execution-draft-page .panel,
body.permission-execution-draft-page .draft-gate {
  border-radius: 8px;
  border-color: rgba(20, 92, 74, 0.12);
  box-shadow: 0 18px 50px rgba(53, 34, 23, 0.05);
}

body.permission-execution-draft-page .draft-gate {
  background:
    linear-gradient(180deg, rgba(255, 255, 253, 0.98), rgba(255, 252, 246, 0.96)),
    repeating-linear-gradient(90deg, rgba(20, 92, 74, 0.035) 0, rgba(20, 92, 74, 0.035) 1px, transparent 1px, transparent 18px);
}

body.permission-execution-draft-page .draft-gate-head {
  min-height: 88px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(20, 92, 74, 0.1);
}

body.permission-execution-draft-page .draft-gate h1 {
  max-width: 760px;
  font-size: clamp(1.62rem, 1.85vw, 2.05rem);
  line-height: 1.08;
  letter-spacing: 0;
}

body.permission-execution-draft-page .draft-gate-head .muted {
  max-width: 880px;
  font-size: 0.98rem;
}

body.permission-execution-draft-page .draft-gate-mark {
  width: 58px;
  height: 58px;
  border-radius: 8px;
  box-shadow: 0 14px 28px rgba(168, 62, 18, 0.08);
}

body.permission-execution-draft-page .draft-step-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

body.permission-execution-draft-page .draft-step,
body.permission-execution-draft-page .draft-relay div,
body.permission-execution-draft-page .draft-gate-card {
  border-radius: 8px;
  border-color: var(--draft-page-line);
  background: rgba(255, 255, 252, 0.86);
}

body.permission-execution-draft-page .draft-step {
  min-height: 110px;
}

body.permission-execution-draft-page .draft-step strong,
body.permission-execution-draft-page .draft-relay strong,
body.permission-execution-draft-page .draft-gate-card strong {
  font-weight: 740;
}

body.permission-execution-draft-page .draft-gate-grid {
  gap: 14px;
}

body.permission-execution-draft-page .draft-gate-form,
body.permission-execution-draft-page .draft-gate-result,
body.permission-execution-draft-page .draft-gate-rules div,
body.permission-execution-draft-page .draft-right-panel .metric,
body.permission-execution-draft-page .draft-side-panel .sprint-step {
  border-radius: 8px;
  border-color: rgba(214, 90, 31, 0.16);
  background: rgba(255, 255, 252, 0.9);
}

body.permission-execution-draft-page .draft-gate-form {
  max-height: 640px;
  overflow: auto;
}

body.permission-execution-draft-page .draft-form-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

body.permission-execution-draft-page .draft-gate-form label {
  font-size: 0.82rem;
  color: rgba(73, 47, 36, 0.82);
}

body.permission-execution-draft-page .draft-gate-form input,
body.permission-execution-draft-page .draft-gate-form select,
body.permission-execution-draft-page .draft-gate-form textarea {
  border-radius: 8px;
  font-size: 0.86rem;
}

body.permission-execution-draft-page .draft-gate-form textarea {
  min-height: 54px;
}

body.permission-execution-draft-page .draft-gate-form textarea#draftDecisionPacket,
body.permission-execution-draft-page .draft-gate-output {
  min-height: 190px;
  font-size: 0.78rem;
  line-height: 1.44;
}

body.permission-execution-draft-page .draft-gate-review {
  display: grid;
  gap: 12px;
}

body.permission-execution-draft-page .draft-output-grid {
  border-top: 1px solid rgba(20, 92, 74, 0.1);
  padding-top: 14px;
}

body.permission-execution-draft-page .draft-side-panel h2,
body.permission-execution-draft-page .draft-right-panel h2 {
  font-size: clamp(1.15rem, 1.2vw, 1.35rem);
}

@media (max-width: 1200px) {
  body.permission-execution-draft-page .workspace {
    grid-template-columns: 1fr;
  }

  body.permission-execution-draft-page .draft-step-grid,
  body.permission-execution-draft-page .draft-form-pair {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  body.permission-execution-draft-page .draft-step-grid,
  body.permission-execution-draft-page .draft-form-pair {
    grid-template-columns: 1fr;
  }
}
`;

if (!css.includes("VEDAPATH v4.0.4 CONTROLLED DRAFT DESK RE-ENTRY")) {
  css = `${css.trim()}\n\n${cssBlock.trim()}\n`;
}
write(cssFile, css);

let shell = read(shellFile);
shell = replaceRegexRequired(shell, /const releaseBadge = "v\d+\.\d+\.\d+ [^"]+";/, `const releaseBadge = "${releaseBadge}";`, "command shell release badge");
write(shellFile, shell);

let build = read(buildFile);
build = build.replace('<span class="version">v4.0.3 founder</span>', `<span class="version">${releaseBadge}</span>`);
build = replaceRegexRequired(
  build,
  /<article class="tile">\s*<span>Current version<\/span>\s*<strong>v4\.0\.3<\/strong>\s*<p>[\s\S]*?<\/p>\s*<\/article>/,
  `<article class="tile">
          <span>Current version</span>
          <strong>${release}</strong>
          <p>${releaseName}: the draft gate receives the ${inputRelease} founder posture packet and prepares one reviewable draft while permission, authorization, answer changes, retrieval changes, execution, storage, public release, and production stay false.</p>
        </article>`,
  "build current tile"
);
build = replaceRegexRequired(
  build,
  /<article class="tile">\s*<span>Full vision progress<\/span>\s*<strong>99%<\/strong>\s*<div class="progress" aria-hidden="true"><div class="bar" style="width:99%"><\/div><\/div>\s*<p>[\s\S]*?<\/p>\s*<\/article>/,
  `<article class="tile">
          <span>Full vision progress</span>
          <strong>99%</strong>
          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>
          <p>The trust chain now carries the ${inputRelease} founder posture into controlled draft language while preserving source identity, answer boundaries, retrieval boundaries, questions, audit, and every false authority flag.</p>
        </article>`,
  "build full vision tile"
);
build = replaceRegexRequired(
  build,
  /<article class="tile">\s*<span>Next release<\/span>\s*<strong>v4\.0\.4 Controlled Permission Execution Authorization Draft Gate Re-entry<\/strong>\s*<p>[\s\S]*?<\/p>\s*<\/article>/,
  `<article class="tile">
          <span>Next release</span>
          <strong>${nextRelease}</strong>
          <p>Review the ${release} draft packet before any later authorization posture while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.</p>
        </article>`,
  "build next tile"
);
build = replaceRegexRequired(
  build,
  /<article class="phase">\s*<span class="badge later">Later<\/span>\s*<div>\s*<strong>Phase 364: Controlled Permission Execution Authorization Draft Gate Re-entry<\/strong>\s*<p>[\s\S]*?<\/p>\s*<\/div>\s*<div class="percent">0%<\/div>\s*<\/article>/,
  `<article class="phase">
        <span class="badge done">Done</span>
        <div>
          <strong>Phase 364: Controlled Permission Execution Authorization Draft Gate Re-entry</strong>
          <p>Receives the ${inputRelease} founder posture packet and prepares draft-review candidate language while source identity, answer boundaries, retrieval boundaries, questions, audit, and every authority flag stay unchanged.</p>
        </div>
        <div class="percent">100%</div>
      </article>
      <article class="phase">
        <span class="badge later">Later</span>
        <div>
          <strong>Phase 365: Controlled Permission Execution Authorization Draft Review Gate Re-entry</strong>
          <p>Review the ${release} controlled draft packet while permission, authorization, answer changes, retrieval changes, execution, storage, public release, and production remain false.</p>
        </div>
        <div class="percent">0%</div>
      </article>`,
  "phase 364"
);
build = build.replace(`<div class="version-row"><span>Release</span><strong>v4.0.3 Founder Permission Execution Authorization Decision Gate Re-entry</strong></div>`, `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>`);
build = build.replace(`<div class="version-row"><span>Previous</span><strong>v4.0.2 Controlled Permission Execution Authorization Review Decision Gate Re-entry</strong></div>`, `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
build = build.replace(`<div class="version-row"><span>Goal</span><strong>Record founder posture from the v4.0.2 review-decision packet without granting permission, authorization, answer changes, retrieval changes, or execution.</strong></div>`, `<div class="version-row"><span>Goal</span><strong>Prepare controlled draft-review candidate language from the ${inputRelease} founder posture packet without granting permission, authorization, answer changes, retrieval changes, or execution.</strong></div>`);
build = build.replace(`<div class="version-row"><span>Status</span><strong>Ready for controlled draft gate re-entry</strong></div>`, `<div class="version-row"><span>Status</span><strong>Ready for controlled draft review gate re-entry</strong></div>`);
build = replaceRegexRequired(
  build,
  /<ul class="checklist">\s*<li><span class="dot"><\/span><span>Receive the v4\.0\.3 founder posture packet without granting authorization or execution\.<\/span><\/li>[\s\S]*?<li><span class="dot"><\/span><span>Route only a controlled draft candidate to draft-review re-entry\.<\/span><\/li>\s*<\/ul>/,
  `<ul class="checklist">
              <li><span class="dot"></span><span>Re-enter controlled permission execution authorization draft review gate.</span></li>
              <li><span class="dot"></span><span>Receive the ${release} draft packet without granting authorization or execution.</span></li>
              <li><span class="dot"></span><span>Preserve source identity, answer boundary, retrieval boundary, route, questions, and authority audit.</span></li>
              <li><span class="dot"></span><span>Keep every permission, answer-change, retrieval-change, execution, storage, public release, and production flag false.</span></li>
              <li><span class="dot"></span><span>Route only a reviewed candidate forward after draft-review re-entry.</span></li>
            </ul>`,
  "next checklist"
);
write(buildFile, build);

prependOnce(
  readmeFile,
  `## ${release} ${releaseName}`,
  `## ${release} ${releaseName}

- Re-enters the controlled draft gate from the ${inputRelease} founder posture packet.
- Preserves founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source identity, route, questions, answer boundaries, retrieval boundaries, and authority audit.
- Prepares one draft-review candidate only while permission grant, authorization approval, answer changes, retrieval changes, execution, storage writes, canonical writes, public release, and production remain false.
- Polishes the draft gate into a calmer writing desk: one posture, one reviewable draft, visible locks, compact type, and the ${releaseBadge} command-shell badge.
- Updates [Controlled Permission Execution Authorization Draft Gate](controlledpermissionexecutionauthorizationdraftgate.html), [Controlled Permission Execution Authorization Draft Gate Data](data/vedapath-controlled-permission-execution-authorization-draft-gate.json), and [Controlled Permission Execution Authorization Draft Gate Notes](docs/CONTROLLED_PERMISSION_EXECUTION_AUTHORIZATION_DRAFT_GATE.md).`
);

prependOnce(
  notesFile,
  `## ${release} ${releaseName}`,
  `## ${release} ${releaseName}

- Re-enters the controlled draft gate from the ${inputRelease} founder posture packet.
- Prepares one controlled draft-review candidate while every authority, answer-change, retrieval-change, execution, storage, public release, and production flag remains false.
- Simplifies the draft surface into a quiet writing desk: one posture, one reviewable draft, visible locks, and tighter type rhythm.
- Sets the build tracker to Phase 365: controlled draft review gate re-entry.`
);

prependOnce(
  blueprintFile,
  `## ${release} Controlled Draft Gate`,
  `## ${release} Controlled Draft Gate

Controlled Permission Execution Authorization Draft Gate Re-entry receives the ${inputRelease} founder posture packet and prepares only controlled draft-review candidate language while every authority flag remains false.

Release intent:

- accept only the ${inputRelease} founder permission execution authorization decision output
- preserve founder posture id, review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source identity, route, questions, answer boundaries, retrieval boundaries, and authority audit
- output controlled draft readiness and draft-review candidate readiness only after the handoff stays intact
- keep permission grant, authorization approval, answer changes, retrieval changes, execution, storage writes, canonical writes, public release, and production unavailable
- move only to the controlled permission execution authorization draft review gate re-entry
- make the draft gate feel like a quiet writing desk where founder posture becomes reviewable language without becoming authority

Next release: ${nextRelease}.`
);

let draftDoc = read(draftDocFile);
draftDoc = draftDoc.replace(
  "Controlled Permission Execution Authorization Draft Gate Re-entry accepts the v3.9.9 founder posture packet and turns it into draft-review candidate language only.",
  `Controlled Permission Execution Authorization Draft Gate Re-entry accepts the ${inputRelease} founder posture packet and turns it into draft-review candidate language only.`
);
write(draftDocFile, draftDoc);
insertBeforeOnce(
  draftDocFile,
  `## ${release} Re-entry`,
  "## v4.0.0 Re-entry",
  `## ${release} Re-entry

- Requires schema \`${expectedFounderSchema}\`.
- Requires release \`${inputRelease}\`.
- Preserves the ${inputRelease} founder posture gate id before any draft candidate can be prepared.
- Preserves review decision id, draft review id, draft gate id, founder decision id, authorization review id, preflight id, hold id, source answer id, source record id, source family, source reference, review route, founder question, permission question, answer boundaries, retrieval boundaries, and authority flag audit.
- Outputs \`controlled_permission_execution_authorization_draft_ready=true\`, \`permission_execution_authorization_draft_recorded=true\`, and \`controlled_permission_execution_authorization_draft_review_candidate_ready=true\` only for reviewable draft language.
- Keeps every permission, authorization, answer-change, retrieval-change, execution, storage, canonical write, public release, and production flag false.
- Moves only to the controlled permission execution authorization draft review gate re-entry.`
);

console.log(`${release} ${releaseName} applied`);

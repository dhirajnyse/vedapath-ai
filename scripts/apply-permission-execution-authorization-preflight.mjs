import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.2.5";
const releaseName = "Permission Execution Authorization Preflight";
const releaseBadge = "v3.2.5 preflight";
const previousRelease = "v3.2.4 Controlled Permission Execution Hold";
const nextGate = "Controlled permission execution authorization review gate";
const priorDataPath = path.join(root, "data", "vedapath-controlled-permission-execution-hold.json");
const prior = JSON.parse(fs.readFileSync(priorDataPath, "utf8"));

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

const source = {
  controlled_permission_execution_hold_release: "v3.2.4",
  controlled_permission_execution_hold_schema: "controlled-permission-execution-hold-v1",
  controlled_permission_execution_hold_id: prior.sample_hold.controlled_permission_execution_hold_id,
  controlled_founder_permission_decision_gate_id: prior.sample_hold.controlled_founder_permission_decision_gate_id,
  controlled_authorization_permission_review_gate_id: prior.sample_hold.controlled_authorization_permission_review_gate_id,
  controlled_authorization_permission_preflight_id: prior.sample_hold.controlled_authorization_permission_preflight_id,
  founder_authorization_instruction_gate_id: prior.sample_hold.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: prior.sample_hold.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: prior.sample_hold.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: prior.sample_hold.founder_authorization_decision_gate_id,
  source_answer_id: prior.sample_hold.source_answer_id,
  source_record_id: prior.sample_hold.source_record_id,
  source_family: prior.sample_hold.source_family
};

const holdPacket = {
  schema_version: "controlled-permission-execution-hold-v1",
  release: "v3.2.4",
  hold_status: "Hold ready for preflight",
  controlled_permission_execution_hold_id: source.controlled_permission_execution_hold_id,
  controlled_founder_permission_decision_gate_id: source.controlled_founder_permission_decision_gate_id,
  controlled_authorization_permission_review_gate_id: source.controlled_authorization_permission_review_gate_id,
  controlled_authorization_permission_preflight_id: source.controlled_authorization_permission_preflight_id,
  founder_authorization_instruction_gate_id: source.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: source.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: source.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: source.founder_authorization_decision_gate_id,
  source_answer_id: source.source_answer_id,
  source_record_id: source.source_record_id,
  source_family: source.source_family,
  controlled_founder_permission_decision_gate_ready: true,
  founder_permission_decision_recorded: true,
  controlled_permission_execution_hold_candidate_ready: true,
  controlled_permission_execution_hold_ready: true,
  permission_execution_hold_recorded: true,
  permission_execution_authorization_preflight_candidate_ready: true,
  ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
  next_gate_required: "Permission execution authorization preflight",
  hold_scope: prior.sample_hold.hold_scope,
  hold_language: prior.sample_hold.hold_language,
  hold_rationale: prior.sample_hold.hold_rationale,
  hold_evidence_summary: prior.sample_hold.hold_evidence_summary,
  evidence_lock: prior.sample_hold.evidence_lock,
  non_execution_hold_clause: prior.sample_hold.non_execution_hold_clause,
  risk_acknowledgment: prior.sample_hold.risk_acknowledgment,
  rollback_condition: prior.sample_hold.rollback_condition,
  monitoring_condition: prior.sample_hold.monitoring_condition,
  stop_condition: prior.sample_hold.stop_condition,
  expiry_check: prior.sample_hold.expiry_check,
  production_boundary: prior.sample_hold.production_boundary,
  created_at: "2026-06-28T00:00:00.000Z"
};

const config = {
  schema_version: "permission-execution-authorization-preflight-v1",
  release,
  generated_at: "2026-06-28T00:00:00.000Z",
  title: releaseName,
  summary: "Tests a controlled execution hold for authorization-review readiness while keeping permission grant, authorization, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  source,
  preflight_states: [
    "Draft preflight",
    "Needs preflight clarification",
    "Preflight ready for authorization review",
    "Return to execution hold",
    "Permission preflight blocked",
    "Authorization blocked",
    "Execution blocked",
    "Production forbidden",
    "Preflight paused",
    "Preflight expired"
  ],
  required_by_state: {
    "Draft preflight": [
      "controlled_permission_execution_hold_id",
      "source_answer_id",
      "preflight_scope"
    ],
    "Needs preflight clarification": [
      "clarification_question",
      "preflight_language"
    ],
    "Preflight ready for authorization review": [
      "preflight_actor",
      "reviewer_name",
      "permission_execution_authorization_preflight_id",
      "controlled_permission_execution_hold_id",
      "controlled_founder_permission_decision_gate_id",
      "controlled_authorization_permission_review_gate_id",
      "controlled_authorization_permission_preflight_id",
      "founder_authorization_instruction_gate_id",
      "controlled_authorization_review_gate_id",
      "controlled_execution_packet_authorization_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "preflight_scope",
      "preflight_language",
      "preflight_rationale",
      "evidence_checklist",
      "non_execution_preflight_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to execution hold": ["return_reason"],
    "Permission preflight blocked": ["block_reason"],
    "Authorization blocked": ["block_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Preflight paused": ["hold_reason"],
    "Preflight expired": ["expiry_check", "hold_reason"]
  },
  preflight_checks: [
    {
      check: "Hold ready",
      rule: "Starts only from a controlled execution hold whose next gate is permission execution authorization preflight."
    },
    {
      check: "Preflight only",
      rule: "Can mark review readiness, but cannot grant permission, approve authorization, or execute."
    },
    {
      check: "Evidence complete",
      rule: "Requires hold id, founder decision, permission review, prior preflight, instruction gate, authorization review, authorization draft, and source ids."
    },
    {
      check: "No write path",
      rule: "Storage writes, canonical updates, migrations, accounts, secrets, public release, and production stay closed."
    },
    {
      check: "Review next",
      rule: "Moves only to a controlled permission execution authorization review gate, never to execution."
    },
    {
      check: "Expiry",
      rule: "Expires on hold, decision, review, preflight, instruction, source, rights, reviewer, rollback, monitoring, packet, or code change."
    }
  ],
  sample_hold_packet: holdPacket,
  sample_preflight: {
    preflight_state: "Preflight ready for authorization review",
    preflight_actor: "Controlled preflight reviewer",
    reviewer_name: "Reviewer sample",
    permission_execution_authorization_preflight_id: "permission-execution-authorization-preflight-sample-steady-action-bg-2-48",
    controlled_permission_execution_hold_id: source.controlled_permission_execution_hold_id,
    controlled_founder_permission_decision_gate_id: source.controlled_founder_permission_decision_gate_id,
    controlled_authorization_permission_review_gate_id: source.controlled_authorization_permission_review_gate_id,
    controlled_authorization_permission_preflight_id: source.controlled_authorization_permission_preflight_id,
    founder_authorization_instruction_gate_id: source.founder_authorization_instruction_gate_id,
    controlled_authorization_review_gate_id: source.controlled_authorization_review_gate_id,
    controlled_execution_packet_authorization_draft_id: source.controlled_execution_packet_authorization_draft_id,
    founder_authorization_decision_gate_id: source.founder_authorization_decision_gate_id,
    source_answer_id: source.source_answer_id,
    source_record_id: source.source_record_id,
    source_family: source.source_family,
    preflight_scope: "Check whether the controlled execution hold has enough locked evidence to enter a later controlled permission execution authorization review gate. This preflight is not permission grant, not authorization approval, not execution, and cannot promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
    preflight_language: "Preflight result: the held founder decision is ready for controlled permission execution authorization review. This is review readiness only; permission is not granted, authorization is not approved, execution is not allowed, and no system may run from it.",
    preflight_rationale: "The hold is ready, source ids are locked, and the boundary remains explicit. The next step is a review gate, not an approval or runnable action.",
    evidence_checklist: "Hold id, founder decision id, permission review id, prior preflight id, founder instruction id, authorization review id, authorization draft id, source answer id, source record id, source family, citation, rights, rollback, monitoring, stop condition, expiry, and production boundary are visible.",
    non_execution_preflight_clause: "Permission execution authorization preflight only; controlled_permission_execution_hold_ready may be true, permission_execution_hold_recorded may be true, permission_execution_authorization_preflight_candidate_ready may be true, permission_execution_authorization_preflight_ready may be true, permission_execution_authorization_preflight_recorded may be true, and controlled_permission_execution_authorization_review_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    risk_acknowledgment: "Risk remains: hold mismatch, founder decision mismatch, permission review mismatch, prior preflight mismatch, instruction mismatch, review mismatch, draft mismatch, source mismatch, rights change, reviewer change, ambiguous preflight language, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
    rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, reviewer handoff, founder decision audit, hold audit, and preflight audit must remain present before any controlled permission execution authorization review; no source state is written.",
    monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any controlled permission execution authorization review.",
    stop_condition: "Stop if hold id mismatches, founder decision id mismatches, permission review id mismatches, prior preflight id mismatches, instruction id mismatches, review id mismatches, draft id mismatches, source ids mismatch, rights change, reviewer evidence is missing, preflight language is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
    expiry_check: "Permission execution authorization preflight expires at the next material hold, founder decision, permission review, prior preflight, founder instruction, authorization review, authorization draft, source, rights, reviewer, rollback, monitoring, packet, or code change and must be rechecked; not permission, not authorization, and not execution.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    next_gate: nextGate,
    clarification_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    controlled_permission_execution_hold_ready: false,
    permission_execution_hold_recorded: false,
    permission_execution_authorization_preflight_candidate_ready: false,
    permission_execution_authorization_preflight_ready: false,
    permission_execution_authorization_preflight_recorded: false,
    controlled_permission_execution_authorization_review_candidate_ready: false,
    ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
    next_gate_required: nextGate
  }
};

const css = `/* VedaPath permission execution authorization preflight */
body.permission-preflight-page .topbar,
body.permission-preflight-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.permission-preflight-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.permission-preflight-page .nav .link,
body.permission-preflight-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.permission-preflight-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.permission-preflight-page main.workspace {
  grid-template-columns: minmax(210px, 0.72fr) minmax(0, 1.7fr) minmax(230px, 0.8fr);
  gap: 18px;
}

body.permission-preflight-page main.workspace > aside.panel:first-child,
body.permission-preflight-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.permission-preflight,
.permission-preflight-head,
.permission-preflight-layout,
.permission-preflight-form,
.permission-preflight-grid,
.permission-preflight-list,
.permission-preflight-actions,
.permission-preflight-rules {
  display: grid;
  gap: 10px;
}

.permission-preflight { gap: 16px; }

.permission-preflight-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.permission-preflight-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.permission-preflight-mark img {
  display: block;
  width: 100%;
}

.permission-preflight-layout {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.permission-preflight-form,
.permission-preflight-card,
.permission-preflight-result,
.permission-preflight-output,
.permission-preflight-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.permission-preflight-form,
.permission-preflight-card,
.permission-preflight-result,
.permission-preflight-rule {
  padding: 12px;
}

.permission-preflight-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.permission-preflight-form input,
.permission-preflight-form select,
.permission-preflight-form textarea,
.permission-preflight-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.permission-preflight-form textarea,
.permission-preflight-output {
  min-height: 92px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.permission-preflight-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.permission-preflight-grid,
.permission-preflight-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.permission-preflight-card.ready,
.permission-preflight-result[data-state="Preflight ready for authorization review"] {
  border-color: #b7d5ca;
  background: #f6fffb;
}

.permission-preflight-card.blocked,
.permission-preflight-result[data-state^="Blocked"] {
  border-color: #efb39a;
  background: #fff1ea;
}

.permission-preflight-card span,
.permission-preflight-rule span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.permission-preflight-card strong,
.permission-preflight-rule strong {
  display: block;
  margin-top: 4px;
}

.permission-preflight-boundary {
  border-left: 4px solid var(--bhagwa);
  padding-left: 12px;
}

@media (max-width: 1050px) {
  body.permission-preflight-page main.workspace,
  .permission-preflight-layout,
  .permission-preflight-grid,
  .permission-preflight-rules {
    grid-template-columns: 1fr;
  }

  .permission-preflight-head {
    grid-template-columns: 1fr;
  }

  .permission-preflight-mark {
    max-width: 160px;
  }
}

@media (max-width: 760px) {
  body.permission-preflight-page .nav {
    flex-wrap: wrap;
  }

  .permission-preflight-actions {
    grid-template-columns: 1fr 1fr;
  }
}
`;

const js = `(function () {
  const configUrl = "data/vedapath-permission-execution-authorization-preflight.json";
  const falseAuthorityFlags = ${JSON.stringify(falseAuthorityFlags, null, 2)};
  const holdReadyFlags = [
    "controlled_permission_execution_hold_ready",
    "permission_execution_hold_recorded",
    "permission_execution_authorization_preflight_candidate_ready"
  ];
  const preflightReadyFlags = [
    "permission_execution_authorization_preflight_ready",
    "permission_execution_authorization_preflight_recorded",
    "controlled_permission_execution_authorization_review_candidate_ready"
  ];
  const blockedWords = /\\b(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production now|launch production allowed|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)\\b/i;

  function compact(value) {
    return String(value || "").trim();
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

  function holdPacketReady(packet) {
    return Boolean(
      packet &&
      packet.schema_version === "controlled-permission-execution-hold-v1" &&
      packet.hold_status === "Hold ready for preflight" &&
      packet.next_gate_required === "Permission execution authorization preflight" &&
      allFlagsTrue(packet, holdReadyFlags) &&
      allFlagsFalse(packet, falseAuthorityFlags)
    );
  }

  function keepsNonExecutionPreflightBoundary(value) {
    const text = compact(value);
    if (!text || hasUnsafeAuthority(text)) return false;
    const mustMentionTrue = [
      "permission_execution_authorization_preflight_ready may be true",
      "permission_execution_authorization_preflight_recorded may be true",
      "controlled_permission_execution_authorization_review_candidate_ready may be true"
    ];
    const mustMentionFalse = falseAuthorityFlags.map((flag) => flag + " remains false");
    return mustMentionTrue.every((phrase) => text.includes(phrase)) &&
      mustMentionFalse.every((phrase) => text.includes(phrase));
  }

  function requiredMissing(config, state, preflight) {
    const required = (config.required_by_state && config.required_by_state[state]) || [];
    return required.filter((key) => !compact(preflight[key]));
  }

  function blocked(status, details) {
    return {
      preflight_status: status,
      blocked: true,
      permission_execution_authorization_preflight_ready: false,
      permission_execution_authorization_preflight_recorded: false,
      controlled_permission_execution_authorization_review_candidate_ready: false,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      details
    };
  }

  function permissionExecutionAuthorizationPreflight(config, holdPacket, preflight) {
    if (!holdPacketReady(holdPacket)) {
      return blocked("Blocked: execution hold must be ready and non-authorizing.", {
        next_gate_required: "Permission execution authorization preflight"
      });
    }

    const state = compact(preflight && preflight.preflight_state) || "Draft preflight";
    const missing = requiredMissing(config, state, preflight || {});
    if (missing.length) {
      return blocked("Blocked: missing required fields for " + state + ".", { missing });
    }

    const textFields = [
      "preflight_scope",
      "preflight_language",
      "preflight_rationale",
      "evidence_checklist",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check"
    ];
    for (const field of textFields) {
      if (hasUnsafeAuthority(preflight[field])) {
        return blocked("Blocked: " + field + " must not grant permission, authorization, or execution.", { field });
      }
    }

    if (!keepsNonExecutionPreflightBoundary(preflight.non_execution_preflight_clause)) {
      return blocked("Blocked: non-execution preflight clause must keep authority false.", {});
    }

    if (hasUnsafeAuthority(preflight.production_boundary) || !compact(preflight.production_boundary).includes("Production remains unavailable")) {
      return blocked("Blocked: production boundary must stay closed.", {});
    }

    if (state === "Needs preflight clarification") {
      return blocked("Needs clarification: answer the preflight question before review readiness.", {
        clarification_question: preflight.clarification_question
      });
    }

    if (state === "Return to execution hold") {
      return blocked("Return: send packet back to execution hold.", { return_reason: preflight.return_reason });
    }

    if (state === "Permission preflight blocked" || state === "Authorization blocked" || state === "Execution blocked" || state === "Production forbidden") {
      return blocked("Blocked: " + (preflight.block_reason || state), { state });
    }

    if (state === "Preflight paused") {
      return blocked("Paused: preflight is held.", { hold_reason: preflight.hold_reason });
    }

    if (state === "Preflight expired") {
      return blocked("Expired: recheck the hold and evidence.", { hold_reason: preflight.hold_reason });
    }

    if (state !== "Preflight ready for authorization review") {
      return blocked("Draft: preflight is not ready for authorization review.", { state });
    }

    return {
      schema_version: config.schema_version,
      release: config.release,
      preflight_status: "Preflight ready for authorization review",
      permission_execution_authorization_preflight_id: preflight.permission_execution_authorization_preflight_id,
      controlled_permission_execution_hold_id: preflight.controlled_permission_execution_hold_id,
      controlled_founder_permission_decision_gate_id: preflight.controlled_founder_permission_decision_gate_id,
      controlled_authorization_permission_review_gate_id: preflight.controlled_authorization_permission_review_gate_id,
      controlled_authorization_permission_preflight_id: preflight.controlled_authorization_permission_preflight_id,
      founder_authorization_instruction_gate_id: preflight.founder_authorization_instruction_gate_id,
      controlled_authorization_review_gate_id: preflight.controlled_authorization_review_gate_id,
      controlled_execution_packet_authorization_draft_id: preflight.controlled_execution_packet_authorization_draft_id,
      source_answer_id: preflight.source_answer_id,
      source_record_id: preflight.source_record_id,
      source_family: preflight.source_family,
      permission_execution_authorization_preflight_ready: true,
      permission_execution_authorization_preflight_recorded: true,
      controlled_permission_execution_authorization_review_candidate_ready: true,
      ...Object.fromEntries(falseAuthorityFlags.map((flag) => [flag, false])),
      preflight_scope: preflight.preflight_scope,
      preflight_language: preflight.preflight_language,
      preflight_rationale: preflight.preflight_rationale,
      evidence_checklist: preflight.evidence_checklist,
      non_execution_preflight_clause: preflight.non_execution_preflight_clause,
      risk_acknowledgment: preflight.risk_acknowledgment,
      rollback_condition: preflight.rollback_condition,
      monitoring_condition: preflight.monitoring_condition,
      stop_condition: preflight.stop_condition,
      expiry_check: preflight.expiry_check,
      production_boundary: preflight.production_boundary,
      next_gate_required: "${nextGate}",
      created_at: new Date().toISOString()
    };
  }

  function preflightSnapshot(result) {
    return {
      status: result.preflight_status,
      ready: result.permission_execution_authorization_preflight_ready === true,
      review_next: result.controlled_permission_execution_authorization_review_candidate_ready === true,
      permission_granted: result.permission_granted === true,
      execution_allowed: result.execution_allowed === true,
      production_ready: result.production_ready === true,
      next_gate_required: result.next_gate_required || null
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
    const card = document.getElementById("permissionPreflightResultCard");
    if (!card) return;
    card.dataset.state = result.preflight_status || "Blocked";
    const snapshot = preflightSnapshot(result);
    card.innerHTML = '<span>Preflight result</span>' +
      '<h2>' + snapshot.status + '</h2>' +
      '<div class="permission-preflight-grid">' +
      '<div class="permission-preflight-card ' + (snapshot.ready ? 'ready' : 'blocked') + '"><span>Review ready</span><strong>' + String(snapshot.ready) + '</strong></div>' +
      '<div class="permission-preflight-card"><span>Next gate</span><strong>' + (snapshot.next_gate_required || 'None') + '</strong></div>' +
      '<div class="permission-preflight-card"><span>Permission granted</span><strong>' + String(snapshot.permission_granted) + '</strong></div>' +
      '<div class="permission-preflight-card"><span>Execution allowed</span><strong>' + String(snapshot.execution_allowed) + '</strong></div>' +
      '</div>';
  }

  function renderList(id, items) {
    const root = document.getElementById(id);
    if (!root) return;
    root.innerHTML = items.map((item) => '<div class="permission-preflight-card"><span>' + item.label + '</span><strong>' + item.value + '</strong></div>').join("");
  }

  function loadConfig(config) {
    const preflight = config.sample_preflight;
    setValue("permissionPreflightHoldPacket", JSON.stringify(config.sample_hold_packet, null, 2));
    setValue("permissionPreflightState", preflight.preflight_state);
    setValue("permissionPreflightActor", preflight.preflight_actor);
    setValue("permissionPreflightReviewer", preflight.reviewer_name);
    setValue("permissionPreflightId", preflight.permission_execution_authorization_preflight_id);
    setValue("permissionPreflightHoldId", preflight.controlled_permission_execution_hold_id);
    setValue("permissionPreflightFounderDecisionId", preflight.controlled_founder_permission_decision_gate_id);
    setValue("permissionPreflightPermissionReviewId", preflight.controlled_authorization_permission_review_gate_id);
    setValue("permissionPreflightPriorPreflightId", preflight.controlled_authorization_permission_preflight_id);
    setValue("permissionPreflightInstructionGateId", preflight.founder_authorization_instruction_gate_id);
    setValue("permissionPreflightAuthorizationReviewGateId", preflight.controlled_authorization_review_gate_id);
    setValue("permissionPreflightDraftId", preflight.controlled_execution_packet_authorization_draft_id);
    setValue("permissionPreflightSourceAnswer", preflight.source_answer_id);
    setValue("permissionPreflightSourceRecord", preflight.source_record_id);
    setValue("permissionPreflightSourceFamily", preflight.source_family);
    setValue("permissionPreflightScopeText", preflight.preflight_scope);
    setValue("permissionPreflightLanguage", preflight.preflight_language);
    setValue("permissionPreflightRationale", preflight.preflight_rationale);
    setValue("permissionPreflightChecklist", preflight.evidence_checklist);
    setValue("permissionPreflightBoundary", preflight.non_execution_preflight_clause);
    setValue("permissionPreflightRisk", preflight.risk_acknowledgment);
    setValue("permissionPreflightRollback", preflight.rollback_condition);
    setValue("permissionPreflightMonitoring", preflight.monitoring_condition);
    setValue("permissionPreflightStopCondition", preflight.stop_condition);
    setValue("permissionPreflightExpiry", preflight.expiry_check);
    setValue("permissionPreflightProductionBoundary", preflight.production_boundary);
    setValue("permissionPreflightClarification", preflight.clarification_question);
    setValue("permissionPreflightReturnReason", preflight.return_reason);
    setValue("permissionPreflightHoldReason", preflight.hold_reason);
    setValue("permissionPreflightBlockReason", preflight.block_reason);
    renderList("permissionPreflightScope", [
      { label: "Preflight", value: "Review readiness only" },
      { label: "Permission", value: "False" },
      { label: "Authorization", value: "False" },
      { label: "Execution", value: "False" }
    ]);
    renderList("permissionPreflightChecks", config.preflight_checks.map((item) => ({ label: item.check, value: item.rule })));
  }

  function readPreflight() {
    return {
      preflight_state: readValue("permissionPreflightState"),
      preflight_actor: readValue("permissionPreflightActor"),
      reviewer_name: readValue("permissionPreflightReviewer"),
      permission_execution_authorization_preflight_id: readValue("permissionPreflightId"),
      controlled_permission_execution_hold_id: readValue("permissionPreflightHoldId"),
      controlled_founder_permission_decision_gate_id: readValue("permissionPreflightFounderDecisionId"),
      controlled_authorization_permission_review_gate_id: readValue("permissionPreflightPermissionReviewId"),
      controlled_authorization_permission_preflight_id: readValue("permissionPreflightPriorPreflightId"),
      founder_authorization_instruction_gate_id: readValue("permissionPreflightInstructionGateId"),
      controlled_authorization_review_gate_id: readValue("permissionPreflightAuthorizationReviewGateId"),
      controlled_execution_packet_authorization_draft_id: readValue("permissionPreflightDraftId"),
      source_answer_id: readValue("permissionPreflightSourceAnswer"),
      source_record_id: readValue("permissionPreflightSourceRecord"),
      source_family: readValue("permissionPreflightSourceFamily"),
      preflight_scope: readValue("permissionPreflightScopeText"),
      preflight_language: readValue("permissionPreflightLanguage"),
      preflight_rationale: readValue("permissionPreflightRationale"),
      evidence_checklist: readValue("permissionPreflightChecklist"),
      non_execution_preflight_clause: readValue("permissionPreflightBoundary"),
      risk_acknowledgment: readValue("permissionPreflightRisk"),
      rollback_condition: readValue("permissionPreflightRollback"),
      monitoring_condition: readValue("permissionPreflightMonitoring"),
      stop_condition: readValue("permissionPreflightStopCondition"),
      expiry_check: readValue("permissionPreflightExpiry"),
      production_boundary: readValue("permissionPreflightProductionBoundary"),
      clarification_question: readValue("permissionPreflightClarification"),
      return_reason: readValue("permissionPreflightReturnReason"),
      hold_reason: readValue("permissionPreflightHoldReason"),
      block_reason: readValue("permissionPreflightBlockReason")
    };
  }

  function saved() {
    return safeParse(localStorage.getItem("vedapath-permission-execution-authorization-preflights") || "[]", []);
  }

  function writeSaved(items) {
    localStorage.setItem("vedapath-permission-execution-authorization-preflights", JSON.stringify(items.slice(0, 12)));
  }

  function renderSaved() {
    const list = document.getElementById("permissionPreflightSaved");
    if (!list) return;
    const items = saved();
    list.innerHTML = items.length ? items.map((item) => '<div class="permission-preflight-card"><span>' + item.created_at + '</span><strong>' + item.preflight_status + '</strong></div>').join("") : '<p class="muted">No local preflights saved yet.</p>';
  }

  async function init() {
    if (typeof document === "undefined") return;
    const response = await fetch(configUrl);
    const config = await response.json();
    const state = document.getElementById("permissionPreflightState");
    if (state) {
      state.innerHTML = config.preflight_states.map((name) => '<option value="' + name + '">' + name + '</option>').join("");
    }
    loadConfig(config);
    renderSaved();
    const run = () => {
      const holdPacket = safeParse(readValue("permissionPreflightHoldPacket"), {});
      const result = permissionExecutionAuthorizationPreflight(config, holdPacket, readPreflight());
      setValue("permissionPreflightOutput", JSON.stringify(result, null, 2));
      renderCard(result);
      return result;
    };
    document.getElementById("runPermissionPreflight")?.addEventListener("click", run);
    document.getElementById("loadPermissionPreflightSample")?.addEventListener("click", () => {
      loadConfig(config);
      run();
    });
    document.getElementById("savePermissionPreflight")?.addEventListener("click", () => {
      const result = run();
      writeSaved([result, ...saved()]);
      renderSaved();
    });
    document.getElementById("clearPermissionPreflights")?.addEventListener("click", () => {
      writeSaved([]);
      renderSaved();
    });
    document.getElementById("copyPermissionPreflight")?.addEventListener("click", async () => {
      const output = readValue("permissionPreflightOutput");
      if (navigator.clipboard && output) await navigator.clipboard.writeText(output);
    });
    run();
  }

  window.vedapathPermissionExecutionAuthorizationPreflight = {
    holdPacketReady,
    hasUnsafeAuthority,
    keepsNonExecutionPreflightBoundary,
    permissionExecutionAuthorizationPreflight,
    preflightSnapshot
  };

  init().catch((error) => {
    console.error("Permission execution authorization preflight failed", error);
  });
})();
`;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Permission Execution Authorization Preflight</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-permission-execution-authorization-preflight.css">
  </head>
  <body class="permission-preflight-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Authorization preflight</span>
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

      <main class="workspace" aria-label="VedaPath Permission Execution Authorization Preflight workspace">
        <aside class="panel">
          <span class="eyebrow">Preflight is not approval</span>
          <h2>Check readiness. Approve nothing.</h2>
          <p class="muted">This room checks whether the held decision can enter a later authorization review. It cannot grant permission, approve authorization, execute, store, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Hold</strong><p>Load locked hold.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Evidence</strong><p>Check ids.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep false flags.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Review</strong><p>Prepare only.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledpermissionexecutionhold.html">Open Execution Hold</a>
            <a class="button safe" href="founderpermissiondecisiongate.html">Open Founder Decision</a>
          </div>
        </aside>

        <section class="panel permission-preflight" id="permissionExecutionAuthorizationPreflight">
          <div class="permission-preflight-head">
            <div>
              <span class="eyebrow">Permission execution authorization preflight</span>
              <h1>Ready for review. Not ready to run.</h1>
              <p class="muted">A ready preflight here means the packet can move to a controlled permission execution authorization review gate. It still cannot grant permission, approve authorization, run code, promote sources, store data, update canonical records, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="permission-preflight-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath authorization preflight mark"></div>
          </div>

          <section class="permission-preflight-layout">
            <div class="permission-preflight-form">
              <h2>Authorization Preflight</h2>
              <label>Execution hold packet<textarea id="permissionPreflightHoldPacket"></textarea></label>
              <label>Preflight state<select id="permissionPreflightState"></select></label>
              <label>Preflight actor<input id="permissionPreflightActor" type="text" placeholder="Controlled preflight reviewer"></label>
              <label>Reviewer name<input id="permissionPreflightReviewer" type="text" placeholder="Reviewer sample"></label>
              <label>Preflight id<input id="permissionPreflightId" type="text"></label>
              <label>Execution hold id<input id="permissionPreflightHoldId" type="text"></label>
              <label>Founder decision gate id<input id="permissionPreflightFounderDecisionId" type="text"></label>
              <label>Permission review gate id<input id="permissionPreflightPermissionReviewId" type="text"></label>
              <label>Prior preflight id<input id="permissionPreflightPriorPreflightId" type="text"></label>
              <label>Founder instruction gate id<input id="permissionPreflightInstructionGateId" type="text"></label>
              <label>Authorization review gate id<input id="permissionPreflightAuthorizationReviewGateId" type="text"></label>
              <label>Authorization draft id<input id="permissionPreflightDraftId" type="text"></label>
              <label>Source answer id<input id="permissionPreflightSourceAnswer" type="text"></label>
              <label>Source record id<input id="permissionPreflightSourceRecord" type="text"></label>
              <label>Source family<input id="permissionPreflightSourceFamily" type="text"></label>
              <label>Preflight scope<textarea id="permissionPreflightScopeText"></textarea></label>
              <label>Preflight language<textarea id="permissionPreflightLanguage"></textarea></label>
              <label>Preflight rationale<textarea id="permissionPreflightRationale"></textarea></label>
              <label>Evidence checklist<textarea id="permissionPreflightChecklist"></textarea></label>
              <label>Non-execution preflight clause<textarea id="permissionPreflightBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="permissionPreflightRisk"></textarea></label>
              <label>Rollback condition<textarea id="permissionPreflightRollback"></textarea></label>
              <label>Monitoring condition<textarea id="permissionPreflightMonitoring"></textarea></label>
              <label>Stop condition<textarea id="permissionPreflightStopCondition"></textarea></label>
              <label>Expiry check<textarea id="permissionPreflightExpiry"></textarea></label>
              <label>Production boundary<textarea id="permissionPreflightProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="permissionPreflightClarification"></textarea></label>
              <label>Return reason<textarea id="permissionPreflightReturnReason"></textarea></label>
              <label>Hold reason<textarea id="permissionPreflightHoldReason"></textarea></label>
              <label>Block reason<textarea id="permissionPreflightBlockReason"></textarea></label>
              <div class="permission-preflight-actions">
                <button class="button primary" id="runPermissionPreflight" type="button">Run Preflight</button>
                <button class="button safe" id="loadPermissionPreflightSample" type="button">Load Sample</button>
                <button class="button" id="savePermissionPreflight" type="button">Save Local</button>
                <button class="button" id="clearPermissionPreflights" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="permission-preflight-result" id="permissionPreflightResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Preflight Scope</h2>
                <div class="permission-preflight-list" id="permissionPreflightScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Preflight Checks</h2>
            <div class="permission-preflight-rules" id="permissionPreflightChecks"></div>
          </section>

          <section class="permission-preflight-layout">
            <div>
              <div class="permission-preflight-actions">
                <button class="button safe" id="copyPermissionPreflight" type="button">Copy Preflight Packet</button>
                <a class="button" href="data/vedapath-permission-execution-authorization-preflight.json">Open JSON</a>
              </div>
              <textarea class="permission-preflight-output" id="permissionPreflightOutput" aria-label="Permission execution authorization preflight"></textarea>
            </div>
            <div>
              <h2>Saved Local Preflights</h2>
              <div class="permission-preflight-list" id="permissionPreflightSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Review ready is not authority</span>
          <h2 style="margin-top: 14px;">Preflight Ready, Execution False</h2>
          <p class="muted">The preflight can prepare authorization review while every operational path stays locked.</p>
          <div class="progress" aria-label="Authorization preflight progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>10</strong></div>
            <div class="metric"><span>Execution</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Review</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Preflight Boundary</h2>
            <p class="permission-preflight-boundary">Preflight signal only. Permission grant, authorization approval, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a controlled authorization review gate. It does not authorize anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-permission-execution-authorization-preflight.js"></script>
  </body>
</html>
`;

const docs = `# ${releaseName}

${releaseName} tests the controlled execution hold for authorization-review readiness.

It can mark:
- permission execution authorization preflight readiness
- preflight record captured
- controlled authorization review candidate readiness

It cannot mark:
- permission grant
- authorization approval
- execution approval
- storage writes
- canonical writes
- public release
- production launch

Next gate: ${nextGate}.
`;

function write(file, content) {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), content);
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function update(file, updater) {
  const full = path.join(root, file);
  const before = fs.readFileSync(full, "utf8");
  const after = updater(before);
  fs.writeFileSync(full, after);
}

function replaceAllHtmlBadges() {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".html")) {
      update(entry.name, (text) => text.replace(/<span class="version">v3\.2\.4 execution hold<\/span>/g, `<span class="version">${releaseBadge}</span>`));
    }
  }
  const brandFile = path.join(root, "brand", "brand-board.html");
  if (fs.existsSync(brandFile)) {
    update(path.join("brand", "brand-board.html"), (text) => text.replace(/<span class="version">v3\.2\.4 execution hold<\/span>/g, `<span class="version">${releaseBadge}</span>`));
  }
}

function updateIndex() {
  update("index.html", (text) => {
    let next = text.replace(
      "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review, founder permission decision, controlled execution hold, authorization preflight next, and production still closed.",
      "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review, founder permission decision, controlled execution hold, permission execution authorization preflight, authorization review next, and production still closed."
    );
    if (!next.includes("permissionexecutionauthorizationpreflight.html")) {
      next = next.replace(
        '<a href="controlledpermissionexecutionhold.html">Execution hold <span>no-run</span></a>',
        '<a href="controlledpermissionexecutionhold.html">Execution hold <span>no-run</span></a>\n              <a href="permissionexecutionauthorizationpreflight.html">Authorization preflight <span>review</span></a>'
      );
      next = next.replace(
        '<a href="controlledpermissionexecutionhold.html">Execution hold <span>closed</span></a>',
        '<a href="controlledpermissionexecutionhold.html">Execution hold <span>closed</span></a>\n              <a href="permissionexecutionauthorizationpreflight.html">Authorization preflight <span>closed</span></a>'
      );
    }
    return next;
  });
}

function updateHoldPage() {
  update("controlledpermissionexecutionhold.html", (text) => {
    if (text.includes("permissionexecutionauthorizationpreflight.html")) return text;
    return text.replace(
      '<a class="button safe" href="controlledauthorizationpermissionreviewgate.html">Open Permission Review</a>',
      '<a class="button safe" href="controlledauthorizationpermissionreviewgate.html">Open Permission Review</a>\n            <a class="button" href="permissionexecutionauthorizationpreflight.html">Open Authorization Preflight</a>'
    );
  });
}

function updateBuildStatus() {
  update("build-status.html", (text) => {
    let next = text
      .replace("<strong>v3.2.4</strong>", `<strong>${release}</strong>`)
      .replace(
        "Controlled Permission Execution Hold: founder decision language is now held for preflight while permission grant, authorization, execution, storage, public release, and production remain false.",
        "Permission Execution Authorization Preflight: the held decision is now checked for authorization-review readiness while permission grant, authorization approval, execution, storage, public release, and production remain false."
      )
      .replace(
        "The trust loop now separates execution hold readiness from actual permission grant while every real write path remains closed.",
        "The trust loop now separates authorization-review readiness from actual authorization while every real write path remains closed."
      )
      .replace(
        "<strong>Permission execution authorization preflight</strong>\n          <p>Test the hold for preflight readiness while execution stays false.</p>",
        "<strong>Controlled permission execution authorization review gate</strong>\n          <p>Review preflight language while permission grant and execution stay false.</p>"
      )
      .replace(
        '<div class="version-row"><span>Release</span><strong>v3.2.4 Controlled Permission Execution Hold</strong></div>',
        `<div class="version-row"><span>Release</span><strong>${release} ${releaseName}</strong></div>`
      )
      .replace(
        '<div class="version-row"><span>Previous</span><strong>v3.2.3 Founder Permission Decision Gate</strong></div>',
        `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`
      )
      .replace(
        '<div class="version-row"><span>Goal</span><strong>Hold founder decision language without granting permission, authorization, or execution.</strong></div>',
        '<div class="version-row"><span>Goal</span><strong>Test the execution hold for authorization-review readiness without granting permission, authorization, or execution.</strong></div>'
      )
      .replace(
        '<div class="version-row"><span>Status</span><strong>Ready for permission execution authorization preflight</strong></div>',
        '<div class="version-row"><span>Status</span><strong>Ready for controlled permission execution authorization review gate</strong></div>'
      )
      .replace(
        '<li><span class="dot"></span><span>Build permission execution authorization preflight.</span></li>\n              <li><span class="dot"></span><span>Test hold language before any authorization draft.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate preflight readiness from any runnable operation.</span></li>',
        '<li><span class="dot"></span><span>Build controlled permission execution authorization review gate.</span></li>\n              <li><span class="dot"></span><span>Review preflight language before any authorization decision.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization approval, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate review readiness from any runnable operation.</span></li>'
      );
    if (!next.includes("Phase 289: Permission Execution Authorization Preflight")) {
      next = next.replace(
        `<article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 289: Production Implementation and Licensed Audio</strong>`,
        `<article class="phase">\n              <span class="badge done">Done</span>\n              <div>\n                <strong>Phase 289: Permission Execution Authorization Preflight</strong>\n                <p>Tests the execution hold for authorization-review readiness while permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production remain false.</p>\n              </div>\n              <span class="percent">100%</span>\n            </article>\n            <article class="phase">\n              <span class="badge later">Later</span>\n              <div>\n                <strong>Phase 290: Production Implementation and Licensed Audio</strong>`
      );
    }
    return next;
  });
}

function updateDocs() {
  update("README.md", (text) => {
    if (text.includes(`## ${release} ${releaseName}`)) return text;
    return text.replace(
      "## v3.2.4 Controlled Permission Execution Hold",
      `## ${release} ${releaseName}\n\n${releaseName} tests a controlled execution hold for authorization-review readiness while keeping permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.\n\n- [Permission Execution Authorization Preflight](permissionexecutionauthorizationpreflight.html)\n- [Permission Execution Authorization Preflight Notes](docs/PERMISSION_EXECUTION_AUTHORIZATION_PREFLIGHT.md)\n- [Permission Execution Authorization Preflight Data](data/vedapath-permission-execution-authorization-preflight.json)\n\n## v3.2.4 Controlled Permission Execution Hold`
    );
  });
  update(path.join("docs", "PROTOTYPE_NOTES.md"), (text) => {
    if (text.includes(`## ${release} ${releaseName}`)) return text;
    return text.replace(
      "## v3.2.4 Controlled Permission Execution Hold",
      `## ${release} ${releaseName}\n\n- Adds permissionexecutionauthorizationpreflight.html as a review-readiness gate after the execution hold.\n- Adds a preflight data contract and API that keep permission grant, authorization approval, execution, storage writes, canonical writes, public release, and production false.\n- Updates Home, Build, and the execution hold room so the next route is visible without expanding the primary navigation.\n\n## v3.2.4 Controlled Permission Execution Hold`
    );
  });
  update(path.join("docs", "PRODUCT_BLUEPRINT.md"), (text) => {
    if (text.includes("### 308. Permission Execution Authorization Preflight")) return text;
    return text.replace(
      "### 307. Controlled Permission Execution Hold",
      `### 308. Permission Execution Authorization Preflight\n\nPermission Execution Authorization Preflight tests whether a controlled execution hold has enough locked evidence to move into a later authorization review gate.\n\nIt may mark preflight readiness and review-candidate readiness. It must not grant permission, approve authorization, authorize execution, write storage, update canonical records, publish, or launch.\n\nThe preflight exists to keep founders honest: review readiness is useful, but it is still not authority.\n\n### 307. Controlled Permission Execution Hold`
    );
  });
}

write("data/vedapath-permission-execution-authorization-preflight.json", JSON.stringify(config, null, 2) + "\n");
write("assets/vedapath-permission-execution-authorization-preflight.css", css);
write("assets/vedapath-permission-execution-authorization-preflight.js", js);
write("permissionexecutionauthorizationpreflight.html", html);
write("docs/PERMISSION_EXECUTION_AUTHORIZATION_PREFLIGHT.md", docs);

replaceAllHtmlBadges();
updateIndex();
updateHoldPage();
updateBuildStatus();
updateDocs();

console.log(`${release} permission execution authorization preflight applied.`);

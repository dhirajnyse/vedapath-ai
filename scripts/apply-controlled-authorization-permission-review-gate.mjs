import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.2.2";
const badge = "v3.2.2 permission review";
const previousRelease = "v3.2.1 Controlled Authorization Permission Preflight";
const nextGate = "Founder permission decision gate";
const generatedAt = "2026-06-28T00:00:00.000Z";

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, value) {
  fs.writeFileSync(path.join(root, file), value);
}

function update(file, fn) {
  write(file, fn(read(file)));
}

function mustReplace(content, search, replacement, label) {
  if (!content.includes(search)) throw new Error(`Missing marker: ${label}`);
  return content.replace(search, replacement);
}

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") return [];
      return htmlFiles(full);
    }
    return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
  });
}

const preflightConfig = JSON.parse(read("data/vedapath-controlled-authorization-permission-preflight.json"));
const preflight = preflightConfig.sample_preflight;

const falseAuthorityFlags = {
  permission_granted: false,
  authorization_permission_granted: false,
  permission_review_approved: false,
  founder_permission_granted: false,
  execution_packet_authorized: false,
  execution_authorized: false,
  execution_allowed: false,
  founder_instruction_granted: false,
  source_promotion_allowed: false,
  promotion_execution_allowed: false,
  implementation_authorized: false,
  implementation_execution_allowed: false,
  controlled_storage_entry_allowed: false,
  storage_write_enabled: false,
  canonical_write_allowed: false,
  source_write_executed: false,
  actual_storage_write_executed: false,
  production_ready: false,
  production_launch_allowed: false,
  public_release_allowed: false
};

const samplePermissionPreflightPacket = {
  schema_version: preflightConfig.schema_version,
  release: preflightConfig.release,
  controlled_authorization_permission_preflight_id: preflight.controlled_authorization_permission_preflight_id,
  preflight_status: "Preflight eligible",
  founder_authorization_instruction_ready: true,
  founder_instruction_signal_recorded: true,
  controlled_founder_authorization_instruction_gate_ready: true,
  controlled_authorization_permission_preflight_ready: true,
  permission_preflight_signal_recorded: true,
  permission_review_candidate_ready: true,
  ...falseAuthorityFlags,
  next_gate_required: "Controlled authorization permission review gate",
  founder_authorization_instruction_gate_id: preflight.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: preflight.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: preflight.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: preflight.founder_authorization_decision_gate_id,
  controlled_execution_authorization_hold_id: preflight.controlled_execution_authorization_hold_id,
  controlled_execution_review_gate_id: preflight.controlled_execution_review_gate_id,
  controlled_execution_packet_draft_id: preflight.controlled_execution_packet_draft_id,
  source_answer_id: preflight.source_answer_id,
  source_record_id: preflight.source_record_id,
  source_family: preflight.source_family,
  preflight_actor: preflight.preflight_actor,
  reviewer_name: preflight.reviewer_name,
  preflight_scope: preflight.preflight_scope,
  permission_question: preflight.permission_question,
  eligibility_summary: preflight.eligibility_summary,
  evidence_lock: preflight.evidence_lock,
  non_permission_clause: preflight.non_permission_clause,
  risk_acknowledgment: preflight.risk_acknowledgment,
  rollback_condition: preflight.rollback_condition,
  monitoring_condition: preflight.monitoring_condition,
  stop_condition: preflight.stop_condition,
  expiry_check: preflight.expiry_check,
  production_boundary: preflight.production_boundary,
  created_at: generatedAt
};

const sampleReview = {
  review_state: "Permission review ready",
  review_actor: "Controlled permission reviewer",
  reviewer_name: "Reviewer sample",
  controlled_authorization_permission_review_gate_id: "controlled-authorization-permission-review-gate-sample-steady-action-bg-2-48",
  controlled_authorization_permission_preflight_id: preflight.controlled_authorization_permission_preflight_id,
  founder_authorization_instruction_gate_id: preflight.founder_authorization_instruction_gate_id,
  controlled_authorization_review_gate_id: preflight.controlled_authorization_review_gate_id,
  controlled_execution_packet_authorization_draft_id: preflight.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: preflight.founder_authorization_decision_gate_id,
  source_answer_id: preflight.source_answer_id,
  source_record_id: preflight.source_record_id,
  source_family: preflight.source_family,
  review_scope: "Review this exact permission candidate from the controlled permission preflight only. This review is not permission, not authorization, and cannot execute, promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
  permission_review_language: "Review result for later founder permission decision: this permission candidate is coherent enough to ask for an explicit founder permission decision. This is review readiness only; permission is not granted, authorization is not granted, execution is not allowed, and no system may run from it.",
  review_rationale: "The permission preflight is eligible and source-locked. The permission review signal only prepares a founder permission decision question; it does not open any operational authority.",
  review_evidence_summary: "Permission preflight eligible; founder instruction, authorization review, authorization draft, founder decision, source ids, source family, citation, rights, translation, reviewer evidence, source-owner scope, rollback, monitoring, stop condition, expiry, and production boundary remain visible.",
  source_lock: "Locked to controlled_authorization_permission_preflight_id controlled-authorization-permission-preflight-sample-steady-action-bg-2-48, founder_authorization_instruction_gate_id founder-authorization-instruction-gate-sample-steady-action-bg-2-48, controlled_authorization_review_gate_id controlled-authorization-review-gate-sample-steady-action-bg-2-48, controlled_execution_packet_authorization_draft_id controlled-execution-packet-authorization-draft-sample-steady-action-bg-2-48, founder_authorization_decision_gate_id founder-authorization-decision-gate-sample-steady-action-bg-2-48, source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti.",
  non_permission_review_clause: "Controlled authorization permission review gate only; controlled_authorization_permission_preflight_ready may be true, permission_preflight_signal_recorded may be true, permission_review_candidate_ready may be true, controlled_authorization_permission_review_ready may be true, permission_review_signal_recorded may be true, founder_permission_decision_candidate_ready may be true, but permission_granted remains false, authorization_permission_granted remains false, permission_review_approved remains false, founder_permission_granted remains false, founder_instruction_granted remains false, execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
  risk_acknowledgment: "Risk remains: preflight mismatch, founder instruction mismatch, review mismatch, draft mismatch, source mismatch, rights change, reviewer change, permission review ambiguity, rollback missing, monitoring missing, packet mutation, code change, or any true permission, authorization, execution, storage, canonical, public release, or production flag must block movement.",
  rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, and reviewer handoff must remain present before any founder permission decision gate; no source state is written.",
  monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any founder permission decision gate.",
  stop_condition: "Stop if preflight id mismatches, founder instruction id mismatches, review id mismatches, draft id mismatches, source ids mismatch, rights change, reviewer evidence is missing, permission review is ambiguous, rollback is missing, monitoring is missing, code changes, packet text mutates, or any permission, authorization, execution, storage, canonical, public release, or production flag is true.",
  expiry_check: "Permission review expires at the next material permission preflight, founder instruction, authorization review, authorization draft, source, rights, reviewer, founder decision, rollback, monitoring, packet draft, or code change and must be rechecked; not permission.",
  production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
  next_gate: nextGate,
  clarification_question: "",
  return_reason: "",
  hold_reason: "",
  block_reason: ""
};

const config = {
  schema_version: "controlled-authorization-permission-review-gate-v1",
  release,
  generated_at: generatedAt,
  title: "Controlled Authorization Permission Review Gate",
  summary: "Reviews permission-candidate language after preflight eligibility while keeping permission, authorization, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  source: {
    permission_preflight_release: preflightConfig.release,
    permission_preflight_schema: preflightConfig.schema_version,
    controlled_authorization_permission_preflight_id: preflight.controlled_authorization_permission_preflight_id,
    founder_authorization_instruction_gate_id: preflight.founder_authorization_instruction_gate_id,
    controlled_authorization_review_gate_id: preflight.controlled_authorization_review_gate_id,
    controlled_execution_packet_authorization_draft_id: preflight.controlled_execution_packet_authorization_draft_id,
    founder_authorization_decision_gate_id: preflight.founder_authorization_decision_gate_id,
    source_answer_id: preflight.source_answer_id,
    source_record_id: preflight.source_record_id,
    source_family: preflight.source_family
  },
  review_states: [
    "Draft review",
    "Needs reviewer clarification",
    "Permission review ready",
    "Return to preflight",
    "Permission still blocked",
    "Execution blocked",
    "Production forbidden",
    "Review hold",
    "Review expired"
  ],
  required_by_state: {
    "Draft review": ["controlled_authorization_permission_preflight_id", "source_answer_id", "review_scope"],
    "Needs reviewer clarification": ["clarification_question", "permission_review_language"],
    "Permission review ready": [
      "review_actor",
      "reviewer_name",
      "controlled_authorization_permission_review_gate_id",
      "controlled_authorization_permission_preflight_id",
      "founder_authorization_instruction_gate_id",
      "controlled_authorization_review_gate_id",
      "controlled_execution_packet_authorization_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "review_scope",
      "permission_review_language",
      "review_rationale",
      "review_evidence_summary",
      "source_lock",
      "non_permission_review_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to preflight": ["return_reason"],
    "Permission still blocked": ["block_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Review hold": ["hold_reason"],
    "Review expired": ["expiry_check", "hold_reason"]
  },
  review_checks: [
    { check: "Preflight eligible", rule: "Starts only from a ready permission preflight whose next gate is controlled permission review." },
    { check: "Review only", rule: "May mark permission review readiness, but cannot grant permission, approve permission, or authorize execution." },
    { check: "Evidence lock", rule: "Keeps preflight, instruction gate, review gate, authorization draft, founder decision, source answer, source record, and family locked." },
    { check: "No operation", rule: "Execution, storage, canonical writes, public release, production, accounts, secrets, and migrations remain blocked." },
    { check: "Founder next", rule: "Moves only to a founder permission decision gate, never to execution." },
    { check: "Expiry", rule: "Expires on preflight, instruction, review, draft, source, rights, reviewer, rollback, monitoring, packet, or code change." }
  ],
  sample_permission_preflight_packet: samplePermissionPreflightPacket,
  sample_review: sampleReview,
  boundary: {
    controlled_authorization_permission_preflight_ready: false,
    permission_preflight_signal_recorded: false,
    permission_review_candidate_ready: false,
    controlled_authorization_permission_review_ready: false,
    permission_review_signal_recorded: false,
    founder_permission_decision_candidate_ready: false,
    ...falseAuthorityFlags,
    next_gate_required: nextGate
  }
};

write("data/vedapath-controlled-authorization-permission-review-gate.json", JSON.stringify(config, null, 2) + "\n");

const css = `/* VedaPath controlled authorization permission review gate */
body.permission-review-page .topbar,
body.permission-review-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.permission-review-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.permission-review-page .nav .link,
body.permission-review-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.permission-review-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.permission-review-page main.workspace {
  grid-template-columns: minmax(210px, 0.72fr) minmax(0, 1.7fr) minmax(230px, 0.8fr);
  gap: 18px;
}

body.permission-review-page main.workspace > aside.panel:first-child,
body.permission-review-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.permission-review,
.permission-review-head,
.permission-review-layout,
.permission-review-form,
.permission-review-grid,
.permission-review-list,
.permission-review-actions,
.permission-review-rules {
  display: grid;
  gap: 10px;
}

.permission-review { gap: 16px; }

.permission-review-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.permission-review-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.permission-review-mark img {
  display: block;
  width: 100%;
}

.permission-review-layout {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.permission-review-form,
.permission-review-card,
.permission-review-result,
.permission-review-output,
.permission-review-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.permission-review-form,
.permission-review-card,
.permission-review-result,
.permission-review-rule {
  padding: 12px;
}

.permission-review-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.permission-review-form input,
.permission-review-form select,
.permission-review-form textarea,
.permission-review-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.permission-review-form textarea,
.permission-review-output {
  min-height: 92px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.permission-review-actions {
  grid-template-columns: repeat(4, minmax(0, max-content));
  align-items: center;
}

.permission-review-grid,
.permission-review-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.permission-review-card.ready,
.permission-review-result[data-state="Permission review ready"] {
  border-color: #b7d5ca;
  background: #f6fffb;
}

.permission-review-card.blocked,
.permission-review-result[data-state^="Blocked"] {
  border-color: #efb39a;
  background: #fff1ea;
}

.permission-review-card span,
.permission-review-rule span {
  display: block;
  color: var(--muted);
  font-size: 12px;
}

.permission-review-card strong,
.permission-review-rule strong {
  display: block;
  margin-top: 4px;
}

.permission-review-boundary {
  border-left: 4px solid var(--bhagwa);
  padding-left: 12px;
}

@media (max-width: 1050px) {
  body.permission-review-page main.workspace,
  .permission-review-layout,
  .permission-review-grid,
  .permission-review-rules {
    grid-template-columns: 1fr;
  }

  .permission-review-head {
    grid-template-columns: 1fr;
  }

  .permission-review-mark {
    max-width: 160px;
  }
}

@media (max-width: 760px) {
  body.permission-review-page .nav {
    flex-wrap: wrap;
  }

  .permission-review-actions {
    grid-template-columns: 1fr 1fr;
  }
}
`;

write("assets/vedapath-controlled-authorization-permission-review-gate.css", css);

const js = `(() => {
  const storageKey = "vedapath-controlled-authorization-permission-review-gate";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("controlledAuthorizationPermissionReviewGate") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("permissionReviewSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("permissionReviewResultCard") : null;
  const output = pageDocument ? pageDocument.getElementById("permissionReviewOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("permissionReviewChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("permissionReviewScope") : null;

  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\\\"": "&quot;",
    "'": "&#39;"
  })[char]);

  function hasText(value, groups) {
    const text = String(value || "").toLowerCase();
    return groups.every((group) => group.some((term) => text.includes(term.toLowerCase())));
  }

  function permissionPreflightReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-authorization-permission-preflight-v1" &&
      packet.preflight_status === "Preflight eligible" &&
      packet.controlled_authorization_permission_preflight_ready === true &&
      packet.permission_preflight_signal_recorded === true &&
      packet.permission_review_candidate_ready === true &&
      packet.permission_granted === false &&
      packet.authorization_permission_granted === false &&
      packet.permission_review_approved === false &&
      packet.founder_permission_granted !== true &&
      packet.execution_packet_authorized === false &&
      packet.execution_authorized === false &&
      packet.execution_allowed === false &&
      packet.founder_instruction_granted === false &&
      packet.source_promotion_allowed === false &&
      packet.promotion_execution_allowed === false &&
      packet.implementation_authorized === false &&
      packet.implementation_execution_allowed === false &&
      packet.controlled_storage_entry_allowed === false &&
      packet.storage_write_enabled === false &&
      packet.canonical_write_allowed === false &&
      packet.source_write_executed === false &&
      packet.actual_storage_write_executed === false &&
      packet.production_ready === false &&
      packet.production_launch_allowed === false &&
      packet.public_release_allowed === false &&
      packet.next_gate_required === "Controlled authorization permission review gate";
  }

  function hasUnsafeAuthority(value) {
    return /(permission granted|permission approved|review approved|authorization granted|authorization approved|approval granted|execution approved|execution authorized|authorize execution|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|permission_granted true|authorization_permission_granted true|permission_review_approved true|founder_permission_granted true|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsNonPermissionReviewBoundary(value) {
    const text = String(value || "");
    const required = [
      /controlled_authorization_permission_preflight_ready may be true/i,
      /permission_preflight_signal_recorded may be true/i,
      /permission_review_candidate_ready may be true/i,
      /controlled_authorization_permission_review_ready may be true/i,
      /permission_review_signal_recorded may be true/i,
      /founder_permission_decision_candidate_ready may be true/i,
      /permission_granted remains false/i,
      /authorization_permission_granted remains false/i,
      /permission_review_approved remains false/i,
      /founder_permission_granted remains false/i,
      /founder_instruction_granted remains false/i,
      /execution_packet_authorized remains false/i,
      /execution_authorized remains false/i,
      /execution_allowed remains false/i,
      /source_promotion_allowed remains false/i,
      /promotion_execution_allowed remains false/i,
      /implementation_authorized remains false/i,
      /implementation_execution_allowed remains false/i,
      /controlled_storage_entry_allowed remains false/i,
      /storage_write_enabled remains false/i,
      /canonical_write_allowed remains false/i,
      /source_write_executed remains false/i,
      /actual_storage_write_executed remains false/i,
      /production_ready remains false/i,
      /production_launch_allowed remains false/i,
      /public_release_allowed remains false/i
    ].every((pattern) => pattern.test(text));
    return required && !hasUnsafeAuthority(text);
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function missingForState(config, state, review = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(review[field] || "").trim());
  }

  function idMatches(review, packet, key) {
    return !review[key] || !packet[key] || review[key] === packet[key];
  }

  function controlledAuthorizationPermissionReviewGate(config, preflightPacket, review) {
    const state = review.review_state || "Draft review";
    const missing = missingForState(config, state, review);
    const blocked = [];

    if (!permissionPreflightReady(preflightPacket)) {
      blocked.push("permission preflight must be eligible while permission, authorization, execution, storage, canonical, public release, and production flags remain false");
    }

    ["controlled_authorization_permission_preflight_id", "founder_authorization_instruction_gate_id", "controlled_authorization_review_gate_id", "controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(review, preflightPacket, key)) blocked.push(key + " must match the permission preflight packet");
    });

    const readyCandidate = state === "Permission review ready";
    if (readyCandidate && !hasText(review.review_scope, [["review"], ["permission candidate"], ["controlled permission preflight"], ["not permission"], ["not authorization"], ["cannot", "execute"], ["promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("review scope must be permission-review only and explicitly block permission, authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && hasUnsafeAuthority(review.permission_review_language)) {
      blocked.push("permission review language must not grant permission, approve authorization, or open execution");
    }
    if (readyCandidate && !hasText(review.permission_review_language, [["later founder permission decision"], ["review readiness only"], ["permission is not granted"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("permission review language must prepare founder decision only and state permission is not granted, authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(review.review_rationale, [["permission preflight is eligible"], ["source-locked"], ["permission review signal"], ["founder permission decision"], ["does not open"], ["operational authority"]])) {
      blocked.push("review rationale must keep the preflight source-locked and separate review readiness from authority");
    }
    if (readyCandidate && !hasText(review.review_evidence_summary, [["permission preflight eligible"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["founder decision"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("review evidence summary must keep source and review evidence visible");
    }
    if (readyCandidate && !hasText(review.source_lock, [["controlled_authorization_permission_preflight_id"], ["founder_authorization_instruction_gate_id"], ["controlled_authorization_review_gate_id"], ["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("source lock must name preflight, instruction gate, review gate, authorization draft, founder decision, source answer, source record, and source family");
    }
    if (readyCandidate && !keepsNonPermissionReviewBoundary(review.non_permission_review_clause)) {
      blocked.push("non-permission review clause must keep review readiness as non-permission and all grant, authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(review.risk_acknowledgment, [["risk remains"], ["preflight mismatch"], ["founder instruction mismatch"], ["review mismatch"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["permission review ambiguity"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on mismatches, rights changes, ambiguity, missing rollback/monitoring, packet/code changes, or true authority flags");
    }
    if (readyCandidate && !hasText(review.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["founder permission decision gate"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, founder permission decision gate, and no source state write");
    }
    if (readyCandidate && !hasText(review.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["founder permission decision gate"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and founder decision gate");
    }
    if (readyCandidate && !hasText(review.stop_condition, [["stop"], ["preflight id mismatches"], ["founder instruction id mismatches"], ["review id mismatches"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["permission review is ambiguous"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["permission"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on preflight/instruction/review/source mismatches, rights changes, missing evidence, ambiguity, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(review.expiry_check, [["expires"], ["material permission preflight"], ["founder instruction"], ["authorization review"], ["authorization draft"], ["source"], ["rights"], ["reviewer"], ["founder decision"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not permission"]])) {
      blocked.push("expiry check must state that permission review expires and is not permission");
    }
    if (readyCandidate && !keepsProductionBoundary(review.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs reviewer clarification" && !review.clarification_question) blocked.push("clarification question is required");
    if (state === "Return to preflight" && !review.return_reason) blocked.push("return reason is required");
    if (state === "Permission still blocked" && !review.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !review.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !review.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Review hold" && !review.hold_reason) blocked.push("hold reason is required");
    if (state === "Review expired" && !review.hold_reason) blocked.push("hold reason is required when review expires");

    const review_status = missing.length
      ? "Blocked: required permission review fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;
    const ready = review_status === "Permission review ready";

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_authorization_permission_review_gate_id: review.controlled_authorization_permission_review_gate_id || "controlled-authorization-permission-review-gate-" + Date.now(),
      review_status,
      controlled_authorization_permission_preflight_ready: preflightPacket.controlled_authorization_permission_preflight_ready === true,
      permission_preflight_signal_recorded: preflightPacket.permission_preflight_signal_recorded === true,
      permission_review_candidate_ready: preflightPacket.permission_review_candidate_ready === true,
      controlled_authorization_permission_review_ready: ready,
      permission_review_signal_recorded: ready,
      founder_permission_decision_candidate_ready: ready,
      permission_granted: false,
      authorization_permission_granted: false,
      permission_review_approved: false,
      founder_permission_granted: false,
      execution_packet_authorized: false,
      execution_authorized: false,
      execution_allowed: false,
      founder_instruction_granted: false,
      source_promotion_allowed: false,
      promotion_execution_allowed: false,
      implementation_authorized: false,
      implementation_execution_allowed: false,
      controlled_storage_entry_allowed: false,
      storage_write_enabled: false,
      canonical_write_allowed: false,
      source_write_executed: false,
      actual_storage_write_executed: false,
      production_ready: false,
      production_launch_allowed: false,
      public_release_allowed: false,
      next_gate_required: config.boundary.next_gate_required,
      controlled_authorization_permission_preflight_id: review.controlled_authorization_permission_preflight_id || preflightPacket.controlled_authorization_permission_preflight_id || "",
      founder_authorization_instruction_gate_id: review.founder_authorization_instruction_gate_id || preflightPacket.founder_authorization_instruction_gate_id || "",
      controlled_authorization_review_gate_id: review.controlled_authorization_review_gate_id || preflightPacket.controlled_authorization_review_gate_id || "",
      controlled_execution_packet_authorization_draft_id: review.controlled_execution_packet_authorization_draft_id || preflightPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: review.founder_authorization_decision_gate_id || preflightPacket.founder_authorization_decision_gate_id || "",
      source_answer_id: review.source_answer_id || preflightPacket.source_answer_id || "",
      source_record_id: review.source_record_id || preflightPacket.source_record_id || "",
      source_family: review.source_family || preflightPacket.source_family || "",
      review_actor: review.review_actor || "",
      reviewer_name: review.reviewer_name || "",
      review_scope: review.review_scope || "",
      permission_review_language: review.permission_review_language || "",
      review_rationale: review.review_rationale || "",
      review_evidence_summary: review.review_evidence_summary || "",
      source_lock: review.source_lock || "",
      non_permission_review_clause: review.non_permission_review_clause || "",
      risk_acknowledgment: review.risk_acknowledgment || "",
      rollback_condition: review.rollback_condition || "",
      monitoring_condition: review.monitoring_condition || "",
      stop_condition: review.stop_condition || "",
      expiry_check: review.expiry_check || "",
      production_boundary: review.production_boundary || "",
      clarification_question: review.clarification_question || "",
      return_reason: review.return_reason || "",
      hold_reason: review.hold_reason || "",
      block_reason: review.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function permissionReviewSnapshot(reviews, config) {
    const byStatus = reviews.reduce((counts, review) => {
      const key = review.review_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_reviews: reviews.length,
      ready: byStatus["Permission review ready"] || 0,
      blocked: reviews.filter((review) => String(review.review_status || "").startsWith("Blocked")).length,
      holds: byStatus["Review hold"] || 0,
      expired: byStatus["Review expired"] || 0,
      permission_granted: reviews.filter((review) => review.permission_granted || review.authorization_permission_granted || review.permission_review_approved || review.founder_permission_granted).length,
      execution_enabled: reviews.filter((review) => review.execution_allowed || review.execution_authorized || review.execution_packet_authorized || review.storage_write_enabled || review.source_write_executed || review.production_ready || review.public_release_allowed).length
    };
  }

  function parseJson(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function card(label, value, tone = "") {
    return '<article class="permission-review-card ' + safe(tone) + '"><span>' + safe(label) + '</span><strong>' + safe(value || "None") + '</strong></article>';
  }

  function renderResult(review) {
    if (!resultCard) return;
    const issues = [...(review.missing || []), ...(review.blocked || [])];
    resultCard.dataset.state = review.review_status;
    resultCard.innerHTML = '<strong>' + safe(review.review_status) + '</strong>' +
      '<p class="muted">Review ready: ' + safe(review.controlled_authorization_permission_review_ready) + ' | Permission: ' + safe(review.permission_granted) + ' | Execution: ' + safe(review.execution_allowed) + '</p>' +
      '<div class="permission-review-grid">' +
        card("Preflight", review.controlled_authorization_permission_preflight_id, review.controlled_authorization_permission_review_ready ? "ready" : "") +
        card("Source answer", review.source_answer_id) +
        card("Next gate", review.next_gate_required) +
        card("Production", review.production_ready ? "open" : "false", review.production_ready ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for founder permission decision. Permission, authorization, execution, storage write, canonical update, public release, and production launch remain false.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.review_checks.map((check) =>
      '<article class="permission-review-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Preflight", config.source.controlled_authorization_permission_preflight_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function readSaved() {
    const saved = parseJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(reviews) {
    localStorage.setItem(storageKey, JSON.stringify(reviews.slice(-20)));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const reviews = readSaved();
    const snapshot = permissionReviewSnapshot(reviews, config);
    savedRoot.innerHTML = card("Saved", snapshot.saved_reviews) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Permission granted", snapshot.permission_granted, snapshot.permission_granted ? "blocked" : "ready") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      reviews.slice(-4).reverse().map((review) =>
        '<article class="permission-review-card ' + (review.controlled_authorization_permission_review_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(review.created_at) + '</span>' +
        '<strong>' + safe(review.review_status) + '</strong>' +
        '<span>' + safe(review.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledAuthorizationPermissionReviewGate = {
    controlledAuthorizationPermissionReviewGate,
    permissionReviewSnapshot,
    permissionPreflightReady,
    hasUnsafeAuthority,
    keepsNonPermissionReviewBoundary
  };

  if (!root || !pageDocument) return;

  fetch("data/vedapath-controlled-authorization-permission-review-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        packet: pageDocument.getElementById("permissionReviewPreflightPacket"),
        state: pageDocument.getElementById("permissionReviewState"),
        actor: pageDocument.getElementById("permissionReviewActor"),
        reviewer: pageDocument.getElementById("permissionReviewReviewer"),
        reviewId: pageDocument.getElementById("permissionReviewId"),
        preflightId: pageDocument.getElementById("permissionReviewPreflightId"),
        instructionGateId: pageDocument.getElementById("permissionReviewInstructionGateId"),
        reviewGateId: pageDocument.getElementById("permissionReviewAuthorizationReviewGateId"),
        draftId: pageDocument.getElementById("permissionReviewDraftId"),
        decisionGateId: pageDocument.getElementById("permissionReviewDecisionGateId"),
        sourceAnswer: pageDocument.getElementById("permissionReviewSourceAnswer"),
        sourceRecord: pageDocument.getElementById("permissionReviewSourceRecord"),
        sourceFamily: pageDocument.getElementById("permissionReviewSourceFamily"),
        scope: pageDocument.getElementById("permissionReviewScopeText"),
        language: pageDocument.getElementById("permissionReviewLanguage"),
        rationale: pageDocument.getElementById("permissionReviewRationale"),
        summary: pageDocument.getElementById("permissionReviewSummary"),
        sourceLock: pageDocument.getElementById("permissionReviewSourceLock"),
        boundary: pageDocument.getElementById("permissionReviewBoundary"),
        risk: pageDocument.getElementById("permissionReviewRisk"),
        rollback: pageDocument.getElementById("permissionReviewRollback"),
        monitoring: pageDocument.getElementById("permissionReviewMonitoring"),
        stop: pageDocument.getElementById("permissionReviewStopCondition"),
        expiry: pageDocument.getElementById("permissionReviewExpiry"),
        production: pageDocument.getElementById("permissionReviewProductionBoundary"),
        clarification: pageDocument.getElementById("permissionReviewClarification"),
        returnReason: pageDocument.getElementById("permissionReviewReturnReason"),
        holdReason: pageDocument.getElementById("permissionReviewHoldReason"),
        blockReason: pageDocument.getElementById("permissionReviewBlockReason")
      };

      fields.state.innerHTML = config.review_states.map((state) => '<option>' + safe(state) + '</option>').join("");

      function setFields(sample = config.sample_review) {
        fields.packet.value = JSON.stringify(config.sample_permission_preflight_packet, null, 2);
        fields.state.value = sample.review_state;
        fields.actor.value = sample.review_actor;
        fields.reviewer.value = sample.reviewer_name;
        fields.reviewId.value = sample.controlled_authorization_permission_review_gate_id;
        fields.preflightId.value = sample.controlled_authorization_permission_preflight_id;
        fields.instructionGateId.value = sample.founder_authorization_instruction_gate_id;
        fields.reviewGateId.value = sample.controlled_authorization_review_gate_id;
        fields.draftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.scope.value = sample.review_scope;
        fields.language.value = sample.permission_review_language;
        fields.rationale.value = sample.review_rationale;
        fields.summary.value = sample.review_evidence_summary;
        fields.sourceLock.value = sample.source_lock;
        fields.boundary.value = sample.non_permission_review_clause;
        fields.risk.value = sample.risk_acknowledgment;
        fields.rollback.value = sample.rollback_condition;
        fields.monitoring.value = sample.monitoring_condition;
        fields.stop.value = sample.stop_condition;
        fields.expiry.value = sample.expiry_check;
        fields.production.value = sample.production_boundary;
        fields.clarification.value = sample.clarification_question || "";
        fields.returnReason.value = sample.return_reason || "";
        fields.holdReason.value = sample.hold_reason || "";
        fields.blockReason.value = sample.block_reason || "";
      }

      function buildReview() {
        return {
          review_state: fields.state.value,
          review_actor: fields.actor.value,
          reviewer_name: fields.reviewer.value,
          controlled_authorization_permission_review_gate_id: fields.reviewId.value,
          controlled_authorization_permission_preflight_id: fields.preflightId.value,
          founder_authorization_instruction_gate_id: fields.instructionGateId.value,
          controlled_authorization_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_authorization_draft_id: fields.draftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          review_scope: fields.scope.value,
          permission_review_language: fields.language.value,
          review_rationale: fields.rationale.value,
          review_evidence_summary: fields.summary.value,
          source_lock: fields.sourceLock.value,
          non_permission_review_clause: fields.boundary.value,
          risk_acknowledgment: fields.risk.value,
          rollback_condition: fields.rollback.value,
          monitoring_condition: fields.monitoring.value,
          stop_condition: fields.stop.value,
          expiry_check: fields.expiry.value,
          production_boundary: fields.production.value,
          clarification_question: fields.clarification.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.blockReason.value
        };
      }

      function run() {
        const packet = parseJson(fields.packet.value, {});
        const review = controlledAuthorizationPermissionReviewGate(config, packet, buildReview());
        renderResult(review);
        if (output) output.value = JSON.stringify(review, null, 2);
        return review;
      }

      pageDocument.getElementById("runPermissionReview").addEventListener("click", run);
      pageDocument.getElementById("loadPermissionReviewSample").addEventListener("click", () => { setFields(); run(); });
      pageDocument.getElementById("savePermissionReview").addEventListener("click", () => {
        const review = run();
        const saved = readSaved();
        saved.push(review);
        writeSaved(saved);
        renderSaved(config);
      });
      pageDocument.getElementById("clearPermissionReviews").addEventListener("click", () => {
        writeSaved([]);
        renderSaved(config);
      });
      pageDocument.getElementById("copyPermissionReview").addEventListener("click", () => {
        const review = run();
        navigator.clipboard?.writeText(JSON.stringify(review, null, 2));
      });

      renderChecks(config);
      renderScope(config);
      setFields();
      renderSaved(config);
      run();
    });
})();
`;

write("assets/vedapath-controlled-authorization-permission-review-gate.js", js);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Authorization Permission Review Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-authorization-permission-review-gate.css">
  </head>
  <body class="permission-review-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Permission review</span>
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
          <span class="version">${badge}</span>
        </nav>
      </header>

      <main class="workspace" aria-label="VedaPath Controlled Authorization Permission Review Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Review is not permission</span>
          <h2>Review the words. Grant nothing.</h2>
          <p class="muted">This room reviews permission-candidate language from preflight. It cannot grant permission, authorize, execute, store, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Preflight</strong><p>Load candidate.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Review</strong><p>Check words.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep grant false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Founder</strong><p>Prepare only.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledauthorizationpermissionpreflight.html">Open Permission Preflight</a>
            <a class="button safe" href="founderauthorizationinstructiongate.html">Open Founder Instruction</a>
          </div>
        </aside>

        <section class="panel permission-review" id="controlledAuthorizationPermissionReviewGate">
          <div class="permission-review-head">
            <div>
              <span class="eyebrow">Permission review gate</span>
              <h1>Review permission language. Grant nothing.</h1>
              <p class="muted">A ready review here means the packet can move to a founder permission decision gate. It still cannot grant permission, authorize execution, run code, promote sources, store data, update canonical records, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="permission-review-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath permission review mark"></div>
          </div>

          <section class="permission-review-layout">
            <div class="permission-review-form">
              <h2>Controlled Permission Review</h2>
              <label>Permission preflight packet<textarea id="permissionReviewPreflightPacket"></textarea></label>
              <label>Review state<select id="permissionReviewState"></select></label>
              <label>Review actor<input id="permissionReviewActor" type="text" placeholder="Controlled permission reviewer"></label>
              <label>Reviewer name<input id="permissionReviewReviewer" type="text" placeholder="Reviewer sample"></label>
              <label>Permission review gate id<input id="permissionReviewId" type="text"></label>
              <label>Permission preflight id<input id="permissionReviewPreflightId" type="text"></label>
              <label>Founder instruction gate id<input id="permissionReviewInstructionGateId" type="text"></label>
              <label>Authorization review gate id<input id="permissionReviewAuthorizationReviewGateId" type="text"></label>
              <label>Authorization draft id<input id="permissionReviewDraftId" type="text"></label>
              <label>Founder decision gate id<input id="permissionReviewDecisionGateId" type="text"></label>
              <label>Source answer id<input id="permissionReviewSourceAnswer" type="text"></label>
              <label>Source record id<input id="permissionReviewSourceRecord" type="text"></label>
              <label>Source family<input id="permissionReviewSourceFamily" type="text"></label>
              <label>Review scope<textarea id="permissionReviewScopeText"></textarea></label>
              <label>Permission review language<textarea id="permissionReviewLanguage"></textarea></label>
              <label>Review rationale<textarea id="permissionReviewRationale"></textarea></label>
              <label>Review evidence summary<textarea id="permissionReviewSummary"></textarea></label>
              <label>Source lock<textarea id="permissionReviewSourceLock"></textarea></label>
              <label>Non-permission review clause<textarea id="permissionReviewBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="permissionReviewRisk"></textarea></label>
              <label>Rollback condition<textarea id="permissionReviewRollback"></textarea></label>
              <label>Monitoring condition<textarea id="permissionReviewMonitoring"></textarea></label>
              <label>Stop condition<textarea id="permissionReviewStopCondition"></textarea></label>
              <label>Expiry check<textarea id="permissionReviewExpiry"></textarea></label>
              <label>Production boundary<textarea id="permissionReviewProductionBoundary"></textarea></label>
              <label>Clarification question<textarea id="permissionReviewClarification"></textarea></label>
              <label>Return reason<textarea id="permissionReviewReturnReason"></textarea></label>
              <label>Hold reason<textarea id="permissionReviewHoldReason"></textarea></label>
              <label>Block reason<textarea id="permissionReviewBlockReason"></textarea></label>
              <div class="permission-review-actions">
                <button class="button primary" id="runPermissionReview" type="button">Run Review</button>
                <button class="button safe" id="loadPermissionReviewSample" type="button">Load Sample</button>
                <button class="button" id="savePermissionReview" type="button">Save Local</button>
                <button class="button" id="clearPermissionReviews" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="permission-review-result" id="permissionReviewResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Review Scope</h2>
                <div class="permission-review-list" id="permissionReviewScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Review Checks</h2>
            <div class="permission-review-rules" id="permissionReviewChecks"></div>
          </section>

          <section class="permission-review-layout">
            <div>
              <div class="permission-review-actions">
                <button class="button safe" id="copyPermissionReview" type="button">Copy Review Packet</button>
                <a class="button" href="data/vedapath-controlled-authorization-permission-review-gate.json">Open JSON</a>
              </div>
              <textarea class="permission-review-output" id="permissionReviewOutput" aria-label="Controlled authorization permission review gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Reviews</h2>
              <div class="permission-review-list" id="permissionReviewSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Review is not grant</span>
          <h2 style="margin-top: 14px;">Review Ready, Permission False</h2>
          <p class="muted">The review can prepare a founder permission decision while every operational path stays locked.</p>
          <div class="progress" aria-label="Permission review gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>9</strong></div>
            <div class="metric"><span>Permission</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Founder</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Review Boundary</h2>
            <p class="permission-review-boundary">Permission review signal only. Permission grant, authorization, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a founder permission decision gate. It does not authorize anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-authorization-permission-review-gate.js"></script>
  </body>
</html>
`;

write("controlledauthorizationpermissionreviewgate.html", html);

const notes = `# VedaPath AI Controlled Authorization Permission Review Gate

Release: ${release}

This room reviews permission-candidate language after controlled permission preflight eligibility.

It can record:

- controlled_authorization_permission_review_ready
- permission_review_signal_recorded
- founder_permission_decision_candidate_ready

It cannot grant permission, approve permission, authorize execution, perform storage writes, update canonical records, publish public release, launch production, create accounts, use secrets, or migrate data.

Next gate: ${nextGate}
`;

write("docs/CONTROLLED_AUTHORIZATION_PERMISSION_REVIEW_GATE.md", notes);

const readmeBlock = `## ${release} Controlled Authorization Permission Review Gate

Controlled Authorization Permission Review Gate reviews permission-candidate language after preflight eligibility while keeping permission grant, authorization, execution, storage writes, canonical writes, public release, and production false.

- [Controlled Authorization Permission Review Gate](controlledauthorizationpermissionreviewgate.html)
- [Controlled Authorization Permission Review Gate Notes](docs/CONTROLLED_AUTHORIZATION_PERMISSION_REVIEW_GATE.md)
- [Controlled Authorization Permission Review Gate Data](data/vedapath-controlled-authorization-permission-review-gate.json)

`;

update("README.md", (content) => {
  if (content.includes(`## ${release} Controlled Authorization Permission Review Gate`)) return content;
  return mustReplace(content, "## v3.2.1 Controlled Authorization Permission Preflight", readmeBlock + "## v3.2.1 Controlled Authorization Permission Preflight", "README insertion");
});

const prototypeBlock = `## ${release} Controlled Authorization Permission Review Gate

The controlled authorization permission review gate is the next review layer after permission preflight eligibility.

- It starts from a ready permission preflight packet.
- It can mark permission review readiness only.
- It blocks permission grant, authorization, execution, storage writes, canonical writes, public release, and production.
- It moves only to a founder permission decision gate.

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes(`## ${release} Controlled Authorization Permission Review Gate`)) return content;
  return mustReplace(content, "## v3.2.1 Controlled Authorization Permission Preflight", prototypeBlock + "## v3.2.1 Controlled Authorization Permission Preflight", "prototype notes insertion");
});

const blueprintBlock = `### 305. Controlled Authorization Permission Review Gate

Controlled Authorization Permission Review Gate reviews permission-candidate language after preflight eligibility.

It must:

- start from a permission preflight eligible object
- preserve preflight, instruction gate, review gate, authorization draft, founder decision, source answer, source record, and source family ids
- make permission review readiness visible
- block permission grant, actual authorization, execution, storage writes, canonical writes, public release, and production
- move only to a founder permission decision gate

Controlled Authorization Permission Review Gate should never claim permission approval, authorization approval, execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("### 305. Controlled Authorization Permission Review Gate")) return content;
  return mustReplace(content, "### 304. Controlled Authorization Permission Preflight", blueprintBlock + "### 304. Controlled Authorization Permission Preflight", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.1 permission preflight<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review next, and production still closed.", "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction, permission preflight, permission review, founder decision next, and production still closed.");
  if (!content.includes('href="controlledauthorizationpermissionreviewgate.html"')) {
    content = mustReplace(content, '<a href="controlledauthorizationpermissionpreflight.html">Permission preflight <span>eligibility</span></a>', '<a href="controlledauthorizationpermissionpreflight.html">Permission preflight <span>eligibility</span></a>\n              <a href="controlledauthorizationpermissionreviewgate.html">Permission review <span>no-grant</span></a>', "study map permission review link");
    content = mustReplace(content, '<a href="controlledauthorizationpermissionpreflight.html">Permission preflight <span>no-grant</span></a>', '<a href="controlledauthorizationpermissionpreflight.html">Permission preflight <span>no-grant</span></a>\n              <a href="controlledauthorizationpermissionreviewgate.html">Permission review <span>no-approval</span></a>', "build map permission review link");
  }
  return content;
});

update("controlledauthorizationpermissionpreflight.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.1 permission preflight<\/span>/g, `<span class="version">${badge}</span>`);
  if (!content.includes('href="controlledauthorizationpermissionreviewgate.html"')) {
    content = mustReplace(content, '<a class="button primary" href="founderauthorizationinstructiongate.html">Open Founder Instruction</a>', '<a class="button primary" href="founderauthorizationinstructiongate.html">Open Founder Instruction</a>\n            <a class="button" href="controlledauthorizationpermissionreviewgate.html">Open Permission Review</a>', "preflight permission review link");
  }
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/<span class="version">v3\.2\.1 permission preflight<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("<strong>v3.2.1</strong>\n          <p>Controlled Authorization Permission Preflight: founder instruction intent is now checked for permission-review eligibility while permission, authorization, execution, storage, public release, and production remain false.</p>", "<strong>v3.2.2</strong>\n          <p>Controlled Authorization Permission Review Gate: permission-candidate language is now reviewed while permission grant, authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace('<strong>99%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>\n          <p>The trust loop now separates permission-review eligibility from permission grant while every real write path remains closed.</p>', '<strong>99%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>\n          <p>The trust loop now separates permission review readiness from permission grant while every real write path remains closed.</p>');
  content = content.replace("<span>Next release</span>\n          <strong>Controlled authorization permission review gate</strong>\n          <p>Review permission language while still blocking execution.</p>", "<span>Next release</span>\n          <strong>Founder permission decision gate</strong>\n          <p>Ask for founder decision while still blocking execution.</p>");
  if (!content.includes("Phase 286: Controlled Authorization Permission Review Gate")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 286: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 286: Controlled Authorization Permission Review Gate</strong>
                <p>Reviews permission-candidate language after preflight eligibility while permission grant, authorization, execution, storage writes, canonical writes, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 287: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.2.1 Controlled Authorization Permission Preflight</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.2.2 Controlled Authorization Permission Review Gate</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.2.0 Founder Authorization Instruction Gate</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Check permission-review eligibility without granting permission, authorization, or execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Review permission-candidate language without granting permission, authorization, or execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for controlled authorization permission review gate</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for founder permission decision gate</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Build controlled authorization permission review gate.</span></li>\n              <li><span class="dot"></span><span>Compare permission candidate language against preflight readiness.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate permission review from actual permission grant.</span></li>', '<li><span class="dot"></span><span>Build founder permission decision gate.</span></li>\n              <li><span class="dot"></span><span>Ask for founder decision after permission review readiness.</span></li>\n              <li><span class="dot"></span><span>Keep permission grant, authorization, execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate founder decision from actual execution permission.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.2\.1 permission preflight<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} controlled authorization permission review gate applied.`);

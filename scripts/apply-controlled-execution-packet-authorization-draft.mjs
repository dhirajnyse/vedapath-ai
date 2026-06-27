import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.1.8";
const badge = "v3.1.8 auth draft";
const previousRelease = "v3.1.7 Founder Authorization Decision Gate";
const nextGate = "Controlled authorization review gate";

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

const decisionConfig = JSON.parse(read("data/vedapath-founder-authorization-decision-gate.json"));
const source = decisionConfig.source;
const sampleFounderDecision = {
  schema_version: decisionConfig.schema_version,
  release: decisionConfig.release,
  founder_authorization_decision_gate_id: "founder-authorization-decision-gate-sample-steady-action-bg-2-48",
  decision_status: "Founder decision ready",
  founder_authorization_decision_ready: true,
  founder_decision_recorded: true,
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
  next_gate_required: "Controlled execution packet authorization draft",
  ...decisionConfig.sample_decision,
  created_at: "2026-06-27T00:00:00.000Z"
};

const authorityFlags = [
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

const config = {
  schema_version: "controlled-execution-packet-authorization-draft-v1",
  release,
  generated_at: "2026-06-27T00:00:00.000Z",
  title: "Controlled Execution Packet Authorization Draft",
  summary: "Drafts the next reviewable authorization packet from a founder decision while keeping authorization, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  source: {
    founder_authorization_decision_release: decisionConfig.release,
    founder_authorization_decision_schema: decisionConfig.schema_version,
    founder_authorization_decision_gate_id: sampleFounderDecision.founder_authorization_decision_gate_id,
    controlled_execution_authorization_hold_id: source.controlled_execution_authorization_hold_id,
    controlled_execution_review_gate_id: source.controlled_execution_review_gate_id,
    controlled_execution_packet_draft_id: source.controlled_execution_packet_draft_id,
    founder_execution_instruction_gate_id: source.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: source.promotion_execution_preflight_id,
    source_answer_id: source.source_answer_id,
    source_record_id: source.source_record_id,
    source_family: source.source_family
  },
  draft_states: [
    "Draft packet",
    "Needs authorization draft evidence",
    "Authorization draft ready",
    "Return to founder decision",
    "Draft hold",
    "Authorization blocked",
    "Execution blocked",
    "Production forbidden",
    "Draft expired"
  ],
  required_by_state: {
    "Draft packet": ["founder_authorization_decision_gate_id", "source_answer_id", "draft_scope"],
    "Needs authorization draft evidence": ["review_question", "authorization_draft_language"],
    "Authorization draft ready": [
      "draft_actor",
      "draft_name",
      "founder_authorization_decision_gate_id",
      "controlled_execution_authorization_hold_id",
      "controlled_execution_review_gate_id",
      "controlled_execution_packet_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "draft_scope",
      "authorization_draft_language",
      "draft_rationale",
      "review_evidence_summary",
      "source_lock",
      "non_authority_clause",
      "risk_acknowledgment",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to founder decision": ["return_reason"],
    "Draft hold": ["hold_reason"],
    "Authorization blocked": ["block_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Draft expired": ["expiry_check", "hold_reason"]
  },
  draft_checks: [
    {
      check: "Founder decision ready",
      rule: "The draft can start only from a founder decision ready object whose next gate is controlled execution packet authorization draft."
    },
    {
      check: "Draft only",
      rule: "The packet can be ready for review, but execution packet authorization is not granted in this room."
    },
    {
      check: "Exact source lock",
      rule: "The draft must preserve founder decision, hold, review gate, packet draft, source answer, source record, and source family."
    },
    {
      check: "No operational authority",
      rule: "Execution, storage, canonical writes, public release, production, accounts, secrets, and migrations remain blocked."
    },
    {
      check: "Reviewable packet",
      rule: "The result must be a controlled authorization review candidate, not a runnable instruction."
    },
    {
      check: "Expiry",
      rule: "The draft expires on source, rights, reviewer, founder decision, hold, review, rollback, monitoring, packet, or code change."
    }
  ],
  sample_founder_decision: sampleFounderDecision,
  sample_draft: {
    draft_state: "Authorization draft ready",
    draft_actor: "Controlled authorization packet drafter",
    draft_name: "Authorization draft sample",
    controlled_execution_packet_authorization_draft_id: "controlled-execution-packet-authorization-draft-sample-steady-action-bg-2-48",
    founder_authorization_decision_gate_id: sampleFounderDecision.founder_authorization_decision_gate_id,
    controlled_execution_authorization_hold_id: source.controlled_execution_authorization_hold_id,
    controlled_execution_review_gate_id: source.controlled_execution_review_gate_id,
    controlled_execution_packet_draft_id: source.controlled_execution_packet_draft_id,
    founder_execution_instruction_gate_id: source.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: source.promotion_execution_preflight_id,
    source_answer_id: source.source_answer_id,
    source_record_id: source.source_record_id,
    source_family: source.source_family,
    draft_scope: "Draft an execution packet authorization review object for this exact source packet only after founder decision readiness. This draft is not authorization and cannot execute, promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
    authorization_draft_language: "Proposed authorization language for later review: a reviewer may evaluate whether this exact source answer can enter a controlled authorization review gate. This is draft text only; authorization is not granted, execution is not allowed, and no system may run from it.",
    draft_rationale: "The founder decision moved exact held language forward for packet drafting only. The draft keeps the same source answer, source record, source family, authorization hold, review gate, rollback, monitoring, stop condition, expiry, and production boundary visible.",
    review_evidence_summary: "Founder decision ready; authorization hold, review gate, packet draft, source ids, source family, citation, rights, translation, reviewer evidence, source-owner scope, founder instruction, rollback, monitoring, stop condition, expiry, and production boundary remain visible.",
    source_lock: "Locked to founder_authorization_decision_gate_id founder-authorization-decision-gate-sample-steady-action-bg-2-48, controlled_execution_authorization_hold_id controlled-execution-authorization-hold-sample-steady-action-bg-2-48, controlled_execution_review_gate_id controlled-execution-review-gate-sample-steady-action-bg-2-48, controlled_execution_packet_draft_id controlled-execution-packet-draft-sample-steady-action-bg-2-48, source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti.",
    non_authority_clause: "Controlled execution packet authorization draft only; authorization_draft_ready may be true, controlled_execution_packet_authorization_draft_ready may be true, but execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, founder_instruction_granted remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    risk_acknowledgment: "Risk remains: source mismatch, rights change, reviewer change, founder decision expiry, authorization hold expiry, review gate expiry, rollback missing, monitoring missing, packet mutation, code change, or any true authorization, execution, storage, canonical, public release, or production flag must block movement.",
    rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, and reviewer handoff must remain present before any controlled authorization review gate; no source state is written.",
    monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any controlled authorization review gate.",
    stop_condition: "Stop if source ids mismatch, rights change, reviewer evidence is missing, source-owner scope is missing, founder decision expires, authorization hold expires, review gate expires, rollback is missing, monitoring is missing, code changes, packet text mutates, or any authorization, execution, storage, canonical, public release, or production flag is true.",
    expiry_check: "Authorization draft expires at the next material source, rights, reviewer, founder decision, authorization hold, review gate, rollback, monitoring, packet draft, or code change and must be rechecked; not approval.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    next_gate: nextGate,
    review_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    authorization_draft_ready: false,
    controlled_execution_packet_authorization_draft_ready: false,
    ...Object.fromEntries(authorityFlags.map((flag) => [flag, false])),
    next_gate_required: nextGate
  }
};

write("data/vedapath-controlled-execution-packet-authorization-draft.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-controlled-execution-packet-authorization-draft.css", `/* VedaPath controlled execution packet authorization draft */
body.auth-draft-page .topbar,
body.auth-draft-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.auth-draft-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.auth-draft-page .nav .link,
body.auth-draft-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.auth-draft-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.auth-draft-page main.workspace {
  grid-template-columns: minmax(210px, 0.72fr) minmax(0, 1.7fr) minmax(230px, 0.8fr);
  gap: 18px;
}

body.auth-draft-page main.workspace > aside.panel:first-child,
body.auth-draft-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.auth-draft,
.auth-draft-head,
.auth-draft-layout,
.auth-draft-form,
.auth-draft-grid,
.auth-draft-list,
.auth-draft-actions,
.auth-draft-rules {
  display: grid;
  gap: 10px;
}

.auth-draft { gap: 16px; }

.auth-draft-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.auth-draft-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.auth-draft-mark img {
  display: block;
  width: 100%;
}

.auth-draft-layout {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.auth-draft-form,
.auth-draft-card,
.auth-draft-result,
.auth-draft-output,
.auth-draft-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.auth-draft-form,
.auth-draft-card,
.auth-draft-result,
.auth-draft-rule {
  padding: 12px;
}

.auth-draft-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.auth-draft-form input,
.auth-draft-form select,
.auth-draft-form textarea,
.auth-draft-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.auth-draft-form textarea,
.auth-draft-output {
  min-height: 96px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.auth-draft-grid,
.auth-draft-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.auth-draft-card,
.auth-draft-result {
  border-left: 4px solid var(--gold);
}

.auth-draft-card.ready,
.auth-draft-result[data-state="Authorization draft ready"] {
  border-left-color: var(--green);
}

.auth-draft-card.blocked,
.auth-draft-result[data-state^="Blocked"],
.auth-draft-result[data-state="Return to founder decision"],
.auth-draft-result[data-state="Draft hold"],
.auth-draft-result[data-state="Authorization blocked"],
.auth-draft-result[data-state="Execution blocked"],
.auth-draft-result[data-state="Production forbidden"],
.auth-draft-result[data-state="Draft expired"] {
  border-left-color: var(--ochre);
}

.auth-draft-card span,
.auth-draft-card strong,
.auth-draft-rule span,
.auth-draft-rule strong {
  display: block;
}

.auth-draft-card strong {
  font-size: 18px;
  line-height: 1.18;
  overflow-wrap: anywhere;
}

.auth-draft-card span,
.auth-draft-rule span {
  color: var(--muted);
  font-size: 12px;
}

.auth-draft-result strong {
  display: block;
  font-size: 24px;
}

.auth-draft-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.auth-draft-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.auth-draft-list {
  max-height: 320px;
  overflow: auto;
}

.auth-draft-output {
  min-height: 260px;
}

.auth-draft-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  body.auth-draft-page .topbar,
  body.auth-draft-page header.topbar {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 12px 0 !important;
  }

  body.auth-draft-page .nav {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  body.auth-draft-page main.workspace {
    grid-template-columns: 1fr;
  }

  body.auth-draft-page main.workspace > section.auth-draft {
    order: 1;
  }

  body.auth-draft-page main.workspace > aside.panel:first-child {
    order: 2;
  }

  body.auth-draft-page main.workspace > aside.panel.tight {
    order: 3;
  }

  .auth-draft-layout,
  .auth-draft-head,
  .auth-draft-grid,
  .auth-draft-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .auth-draft-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-controlled-execution-packet-authorization-draft.js", `(() => {
  const storageKey = "vedapath-controlled-execution-packet-authorization-draft";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("controlledExecutionPacketAuthorizationDraft") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("authDraftSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("authDraftResultCard") : null;
  const draftOutput = pageDocument ? pageDocument.getElementById("authDraftOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("authDraftChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("authDraftScope") : null;

  const safe = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\\"": "&quot;",
    "'": "&#39;"
  })[char]);

  function hasText(value, groups) {
    const text = String(value || "").toLowerCase();
    return groups.every((group) => group.some((term) => text.includes(term.toLowerCase())));
  }

  function founderDecisionReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "founder-authorization-decision-gate-v1" &&
      packet.decision_status === "Founder decision ready" &&
      packet.founder_authorization_decision_ready === true &&
      packet.founder_decision_recorded === true &&
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
      packet.next_gate_required === "Controlled execution packet authorization draft";
  }

  function keepsDraftBoundary(value) {
    const text = String(value || "");
    const required = [
      /authorization_draft_ready may be true/i,
      /controlled_execution_packet_authorization_draft_ready may be true/i,
      /execution_packet_authorized remains false/i,
      /execution_authorized remains false/i,
      /execution_allowed remains false/i,
      /founder_instruction_granted remains false/i,
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
    const unsafe = /(authorization granted|authorize now|execution approved|execute now|run now|run from it|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function draftMissingForState(config, state, draft = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(draft[field] || "").trim());
  }

  function idMatches(draft, packet, key) {
    return !draft[key] || !packet[key] || draft[key] === packet[key];
  }

  function controlledExecutionPacketAuthorizationDraft(config, founderDecisionPacket, draft) {
    const state = draft.draft_state || "Draft packet";
    const missing = draftMissingForState(config, state, draft);
    const blocked = [];

    if (!founderDecisionReady(founderDecisionPacket)) {
      blocked.push("founder authorization decision must be ready while authorization, execution, storage, canonical, public release, and production flags remain false");
    }
    ["founder_authorization_decision_gate_id", "controlled_execution_authorization_hold_id", "controlled_execution_review_gate_id", "controlled_execution_packet_draft_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(draft, founderDecisionPacket, key)) blocked.push(key + " must match the founder decision packet");
    });

    const readyCandidate = state === "Authorization draft ready";
    if (readyCandidate && !hasText(draft.draft_scope, [["draft an execution packet authorization review object"], ["exact source packet"], ["founder decision readiness"], ["not authorization"], ["cannot", "execute"], ["promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("draft scope must be exact-source only and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && !hasText(draft.authorization_draft_language, [["proposed authorization language"], ["later review"], ["controlled authorization review gate"], ["draft text only"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("authorization draft language must be proposed text only and state authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(draft.draft_rationale, [["founder decision"], ["packet drafting only"], ["same source answer"], ["source record"], ["source family"], ["authorization hold"], ["review gate"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("draft rationale must keep the packet tied to the founder decision and source chain");
    }
    if (readyCandidate && !hasText(draft.review_evidence_summary, [["founder decision ready"], ["authorization hold"], ["review gate"], ["packet draft"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["founder instruction"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("review evidence summary must keep source and review evidence visible");
    }
    if (readyCandidate && !hasText(draft.source_lock, [["founder_authorization_decision_gate_id"], ["controlled_execution_authorization_hold_id"], ["controlled_execution_review_gate_id"], ["controlled_execution_packet_draft_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("source lock must name the founder decision, hold, review gate, packet draft, source answer, source record, and source family");
    }
    if (readyCandidate && !keepsDraftBoundary(draft.non_authority_clause)) {
      blocked.push("non-authority clause must keep draft readiness as non-authority and all authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(draft.risk_acknowledgment, [["risk remains"], ["source mismatch"], ["rights change"], ["reviewer change"], ["founder decision expiry"], ["authorization hold expiry"], ["review gate expiry"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on source, rights, reviewer, founder, hold, review, rollback, monitoring, packet, code, or true authority flags");
    }
    if (readyCandidate && !hasText(draft.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["controlled authorization review gate"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, next review gate, and no source state write");
    }
    if (readyCandidate && !hasText(draft.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["controlled authorization review gate"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and next review gate");
    }
    if (readyCandidate && !hasText(draft.stop_condition, [["stop"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["source-owner"], ["founder decision expires"], ["authorization hold expires"], ["review gate expires"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on source mismatches, rights changes, missing evidence, expiry, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(draft.expiry_check, [["expires"], ["material source"], ["rights"], ["reviewer"], ["founder decision"], ["authorization hold"], ["review gate"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not approval"]])) {
      blocked.push("expiry check must state that authorization draft expires and is not approval");
    }
    if (readyCandidate && !keepsProductionBoundary(draft.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs authorization draft evidence" && !draft.review_question) blocked.push("review question is required");
    if (state === "Return to founder decision" && !draft.return_reason) blocked.push("return reason is required");
    if (state === "Draft hold" && !draft.hold_reason) blocked.push("hold reason is required");
    if (state === "Authorization blocked" && !draft.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !draft.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !draft.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Draft expired" && !draft.hold_reason) blocked.push("hold reason is required when draft expires");

    const draft_status = missing.length
      ? "Blocked: required authorization draft fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_execution_packet_authorization_draft_id: draft.controlled_execution_packet_authorization_draft_id || "controlled-execution-packet-authorization-draft-" + Date.now(),
      draft_status,
      authorization_draft_ready: draft_status === "Authorization draft ready",
      controlled_execution_packet_authorization_draft_ready: draft_status === "Authorization draft ready",
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
      founder_authorization_decision_gate_id: draft.founder_authorization_decision_gate_id || founderDecisionPacket.founder_authorization_decision_gate_id || "",
      controlled_execution_authorization_hold_id: draft.controlled_execution_authorization_hold_id || founderDecisionPacket.controlled_execution_authorization_hold_id || "",
      controlled_execution_review_gate_id: draft.controlled_execution_review_gate_id || founderDecisionPacket.controlled_execution_review_gate_id || "",
      controlled_execution_packet_draft_id: draft.controlled_execution_packet_draft_id || founderDecisionPacket.controlled_execution_packet_draft_id || "",
      founder_execution_instruction_gate_id: draft.founder_execution_instruction_gate_id || founderDecisionPacket.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: draft.promotion_execution_preflight_id || founderDecisionPacket.promotion_execution_preflight_id || "",
      source_answer_id: draft.source_answer_id || founderDecisionPacket.source_answer_id || "",
      source_record_id: draft.source_record_id || founderDecisionPacket.source_record_id || "",
      source_family: draft.source_family || founderDecisionPacket.source_family || "",
      draft_actor: draft.draft_actor || "",
      draft_name: draft.draft_name || "",
      draft_scope: draft.draft_scope || "",
      authorization_draft_language: draft.authorization_draft_language || "",
      draft_rationale: draft.draft_rationale || "",
      review_evidence_summary: draft.review_evidence_summary || "",
      source_lock: draft.source_lock || "",
      non_authority_clause: draft.non_authority_clause || "",
      risk_acknowledgment: draft.risk_acknowledgment || "",
      rollback_condition: draft.rollback_condition || "",
      monitoring_condition: draft.monitoring_condition || "",
      stop_condition: draft.stop_condition || "",
      expiry_check: draft.expiry_check || "",
      production_boundary: draft.production_boundary || "",
      review_question: draft.review_question || "",
      return_reason: draft.return_reason || "",
      hold_reason: draft.hold_reason || "",
      block_reason: draft.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function authorizationDraftSnapshot(drafts, config) {
    const byStatus = drafts.reduce((counts, draft) => {
      const key = draft.draft_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_drafts: drafts.length,
      ready: byStatus["Authorization draft ready"] || 0,
      blocked: drafts.filter((draft) => String(draft.draft_status || "").startsWith("Blocked")).length,
      holds: byStatus["Draft hold"] || 0,
      expired: byStatus["Draft expired"] || 0,
      execution_enabled: drafts.filter((draft) => draft.execution_allowed || draft.execution_authorized || draft.execution_packet_authorized || draft.storage_write_enabled || draft.source_write_executed || draft.production_ready || draft.public_release_allowed).length
    };
  }

  function parseDraftJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="auth-draft-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(draft) {
    if (!resultCard) return;
    const issues = [...(draft.missing || []), ...(draft.blocked || [])];
    resultCard.dataset.state = draft.draft_status;
    resultCard.innerHTML = '<strong>' + safe(draft.draft_status) + '</strong>' +
      '<p class="muted">Draft ready: ' + safe(draft.authorization_draft_ready) + ' | Authorized: ' + safe(draft.execution_packet_authorized) + ' | Production: ' + safe(draft.production_ready) + '</p>' +
      '<div class="auth-draft-grid">' +
        card("Founder decision", draft.founder_authorization_decision_gate_id, draft.authorization_draft_ready ? "ready" : "") +
        card("Source answer", draft.source_answer_id) +
        card("Next gate", draft.next_gate_required) +
        card("Execution", draft.execution_allowed ? "enabled" : "false", draft.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for controlled authorization review gate. No authorization, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.draft_checks.map((check) =>
      '<article class="auth-draft-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Founder decision", config.source.founder_authorization_decision_gate_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function readSaved() {
    const saved = parseDraftJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(drafts) {
    localStorage.setItem(storageKey, JSON.stringify(drafts.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const drafts = readSaved();
    const snapshot = authorizationDraftSnapshot(drafts, config);
    savedRoot.innerHTML = card("Saved drafts", snapshot.saved_drafts) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      drafts.slice(-4).reverse().map((draft) =>
        '<article class="auth-draft-card ' + (draft.authorization_draft_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(draft.created_at) + '</span>' +
        '<strong>' + safe(draft.draft_status) + '</strong>' +
        '<span>' + safe(draft.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledExecutionPacketAuthorizationDraft = {
    controlledExecutionPacketAuthorizationDraft,
    authorizationDraftSnapshot,
    draftMissingForState,
    keepsDraftBoundary,
    keepsProductionBoundary,
    parseDraftJson,
    founderDecisionReady
  };

  if (!root || typeof fetch !== "function") return;

  fetch("data/vedapath-controlled-execution-packet-authorization-draft.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        founderDecision: root.querySelector("#authDraftFounderDecision"),
        state: root.querySelector("#authDraftState"),
        actor: root.querySelector("#authDraftActor"),
        name: root.querySelector("#authDraftName"),
        draftId: root.querySelector("#authDraftId"),
        decisionGateId: root.querySelector("#authDraftDecisionGateId"),
        authorizationHoldId: root.querySelector("#authDraftAuthorizationHoldId"),
        reviewGateId: root.querySelector("#authDraftReviewGateId"),
        packetDraftId: root.querySelector("#authDraftPacketDraftId"),
        founderGateId: root.querySelector("#authDraftFounderGateId"),
        preflightId: root.querySelector("#authDraftPreflightId"),
        sourceAnswer: root.querySelector("#authDraftSourceAnswer"),
        sourceRecord: root.querySelector("#authDraftSourceRecord"),
        sourceFamily: root.querySelector("#authDraftSourceFamily"),
        scope: root.querySelector("#authDraftScopeText"),
        language: root.querySelector("#authDraftLanguage"),
        rationale: root.querySelector("#authDraftRationale"),
        evidence: root.querySelector("#authDraftEvidence"),
        sourceLock: root.querySelector("#authDraftSourceLock"),
        boundary: root.querySelector("#authDraftBoundary"),
        risk: root.querySelector("#authDraftRisk"),
        rollback: root.querySelector("#authDraftRollback"),
        monitoring: root.querySelector("#authDraftMonitoring"),
        stop: root.querySelector("#authDraftStopCondition"),
        expiry: root.querySelector("#authDraftExpiry"),
        production: root.querySelector("#authDraftProductionBoundary"),
        question: root.querySelector("#authDraftQuestion"),
        returnReason: root.querySelector("#authDraftReturnReason"),
        holdReason: root.querySelector("#authDraftHoldReason"),
        block: root.querySelector("#authDraftBlockReason")
      };

      config.draft_states.forEach((state) => fields.state.add(new Option(state, state)));

      function loadSample() {
        const sample = config.sample_draft;
        fields.founderDecision.value = JSON.stringify(config.sample_founder_decision, null, 2);
        fields.state.value = sample.draft_state;
        fields.actor.value = sample.draft_actor;
        fields.name.value = sample.draft_name;
        fields.draftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.authorizationHoldId.value = sample.controlled_execution_authorization_hold_id;
        fields.reviewGateId.value = sample.controlled_execution_review_gate_id;
        fields.packetDraftId.value = sample.controlled_execution_packet_draft_id;
        fields.founderGateId.value = sample.founder_execution_instruction_gate_id;
        fields.preflightId.value = sample.promotion_execution_preflight_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.scope.value = sample.draft_scope;
        fields.language.value = sample.authorization_draft_language;
        fields.rationale.value = sample.draft_rationale;
        fields.evidence.value = sample.review_evidence_summary;
        fields.sourceLock.value = sample.source_lock;
        fields.boundary.value = sample.non_authority_clause;
        fields.risk.value = sample.risk_acknowledgment;
        fields.rollback.value = sample.rollback_condition;
        fields.monitoring.value = sample.monitoring_condition;
        fields.stop.value = sample.stop_condition;
        fields.expiry.value = sample.expiry_check;
        fields.production.value = sample.production_boundary;
        fields.question.value = sample.review_question;
        fields.returnReason.value = sample.return_reason;
        fields.holdReason.value = sample.hold_reason;
        fields.block.value = sample.block_reason;
      }

      function buildDraft() {
        return {
          draft_state: fields.state.value,
          draft_actor: fields.actor.value,
          draft_name: fields.name.value,
          controlled_execution_packet_authorization_draft_id: fields.draftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          controlled_execution_authorization_hold_id: fields.authorizationHoldId.value,
          controlled_execution_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_draft_id: fields.packetDraftId.value,
          founder_execution_instruction_gate_id: fields.founderGateId.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          draft_scope: fields.scope.value,
          authorization_draft_language: fields.language.value,
          draft_rationale: fields.rationale.value,
          review_evidence_summary: fields.evidence.value,
          source_lock: fields.sourceLock.value,
          non_authority_clause: fields.boundary.value,
          risk_acknowledgment: fields.risk.value,
          rollback_condition: fields.rollback.value,
          monitoring_condition: fields.monitoring.value,
          stop_condition: fields.stop.value,
          expiry_check: fields.expiry.value,
          production_boundary: fields.production.value,
          review_question: fields.question.value,
          return_reason: fields.returnReason.value,
          hold_reason: fields.holdReason.value,
          block_reason: fields.block.value
        };
      }

      function run() {
        const founderDecisionPacket = parseDraftJson(fields.founderDecision.value, {});
        const draft = controlledExecutionPacketAuthorizationDraft(config, founderDecisionPacket, buildDraft());
        draftOutput.value = JSON.stringify(draft, null, 2);
        renderResult(draft);
        return draft;
      }

      root.querySelector("#runAuthDraft").addEventListener("click", run);
      root.querySelector("#loadAuthDraftSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveAuthDraft").addEventListener("click", () => {
        const draft = run();
        writeSaved([...readSaved(), draft]);
        renderSaved(config);
      });
      root.querySelector("#clearAuthDrafts").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyAuthDraft").addEventListener("click", async () => {
        if (!draftOutput.value) run();
        await navigator.clipboard.writeText(draftOutput.value);
      });

      loadSample();
      renderChecks(config);
      renderScope(config);
      run();
      renderSaved(config);
    });
})();
`);

write("controlledexecutionpacketauthorizationdraft.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Execution Packet Authorization Draft</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-execution-packet-authorization-draft.css">
  </head>
  <body class="auth-draft-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Controlled authorization draft</span>
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

      <main class="workspace" aria-label="VedaPath Controlled Execution Packet Authorization Draft workspace">
        <aside class="panel">
          <span class="eyebrow">Draft is not authority</span>
          <h2>Shape the packet without opening the gate</h2>
          <p class="muted">This room converts founder decision posture into reviewable draft language. It cannot authorize, execute, store, migrate, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Decision</strong><p>Load posture.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Draft</strong><p>Write packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep flags false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Review</strong><p>Move to review only.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="founderauthorizationdecisiongate.html">Open Founder Decision</a>
            <a class="button safe" href="controlledexecutionauthorizationhold.html">Open Hold</a>
          </div>
        </aside>

        <section class="panel auth-draft" id="controlledExecutionPacketAuthorizationDraft">
          <div class="auth-draft-head">
            <div>
              <span class="eyebrow">Authorization draft packet</span>
              <h1>Draft the packet. Do not authorize.</h1>
              <p class="muted">A ready draft here means the language can move to a controlled authorization review gate. It still cannot authorize execution, run code, promote sources, store data, update canonical records, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="auth-draft-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath controlled authorization draft mark"></div>
          </div>

          <section class="auth-draft-layout">
            <div class="auth-draft-form">
              <h2>Controlled Authorization Draft</h2>
              <label>Founder decision packet<textarea id="authDraftFounderDecision"></textarea></label>
              <label>Draft state<select id="authDraftState"></select></label>
              <label>Draft actor<input id="authDraftActor" type="text" placeholder="Controlled authorization packet drafter"></label>
              <label>Draft name<input id="authDraftName" type="text" placeholder="Authorization draft sample"></label>
              <label>Authorization draft id<input id="authDraftId" type="text"></label>
              <label>Founder decision gate id<input id="authDraftDecisionGateId" type="text"></label>
              <label>Authorization hold id<input id="authDraftAuthorizationHoldId" type="text"></label>
              <label>Review gate id<input id="authDraftReviewGateId" type="text"></label>
              <label>Packet draft id<input id="authDraftPacketDraftId" type="text"></label>
              <label>Founder gate id<input id="authDraftFounderGateId" type="text"></label>
              <label>Preflight id<input id="authDraftPreflightId" type="text"></label>
              <label>Source answer id<input id="authDraftSourceAnswer" type="text"></label>
              <label>Source record id<input id="authDraftSourceRecord" type="text"></label>
              <label>Source family<input id="authDraftSourceFamily" type="text"></label>
              <label>Draft scope<textarea id="authDraftScopeText"></textarea></label>
              <label>Authorization draft language<textarea id="authDraftLanguage"></textarea></label>
              <label>Draft rationale<textarea id="authDraftRationale"></textarea></label>
              <label>Review evidence summary<textarea id="authDraftEvidence"></textarea></label>
              <label>Source lock<textarea id="authDraftSourceLock"></textarea></label>
              <label>Non-authority clause<textarea id="authDraftBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="authDraftRisk"></textarea></label>
              <label>Rollback condition<textarea id="authDraftRollback"></textarea></label>
              <label>Monitoring condition<textarea id="authDraftMonitoring"></textarea></label>
              <label>Stop condition<textarea id="authDraftStopCondition"></textarea></label>
              <label>Expiry check<textarea id="authDraftExpiry"></textarea></label>
              <label>Production boundary<textarea id="authDraftProductionBoundary"></textarea></label>
              <label>Review question<textarea id="authDraftQuestion"></textarea></label>
              <label>Return reason<textarea id="authDraftReturnReason"></textarea></label>
              <label>Hold reason<textarea id="authDraftHoldReason"></textarea></label>
              <label>Block reason<textarea id="authDraftBlockReason"></textarea></label>
              <div class="auth-draft-actions">
                <button class="button primary" id="runAuthDraft" type="button">Run Draft</button>
                <button class="button safe" id="loadAuthDraftSample" type="button">Load Sample</button>
                <button class="button" id="saveAuthDraft" type="button">Save Local</button>
                <button class="button" id="clearAuthDrafts" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="auth-draft-result" id="authDraftResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Draft Scope</h2>
                <div class="auth-draft-list" id="authDraftScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Draft Checks</h2>
            <div class="auth-draft-rules" id="authDraftChecks"></div>
          </section>

          <section class="auth-draft-layout">
            <div>
              <div class="auth-draft-actions">
                <button class="button safe" id="copyAuthDraft" type="button">Copy Draft Packet</button>
                <a class="button" href="data/vedapath-controlled-execution-packet-authorization-draft.json">Open JSON</a>
              </div>
              <textarea class="auth-draft-output" id="authDraftOutput" aria-label="Controlled execution packet authorization draft"></textarea>
            </div>
            <div>
              <h2>Saved Local Drafts</h2>
              <div class="auth-draft-list" id="authDraftSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Draft is not authorization</span>
          <h2 style="margin-top: 14px;">Ready to Review, Not Run</h2>
          <p class="muted">The packet may move to a review gate only while every operational path stays locked.</p>
          <div class="progress" aria-label="Controlled authorization draft progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>9</strong></div>
            <div class="metric"><span>Authorized</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Review gate</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Draft Boundary</h2>
            <p class="auth-draft-boundary">Draft only. Authorization, execution, founder grant, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a controlled authorization review gate. It does not authorize anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-execution-packet-authorization-draft.js"></script>
  </body>
</html>
`);

write("docs/CONTROLLED_EXECUTION_PACKET_AUTHORIZATION_DRAFT.md", `# VedaPath AI Controlled Execution Packet Authorization Draft

Release: ${release}
Previous: ${previousRelease}

This release drafts a reviewable authorization packet from a founder decision. It does not grant authorization.

## Files

- controlledexecutionpacketauthorizationdraft.html
- assets/vedapath-controlled-execution-packet-authorization-draft.css
- assets/vedapath-controlled-execution-packet-authorization-draft.js
- data/vedapath-controlled-execution-packet-authorization-draft.json

## Boundary

- authorization_draft_ready may be true.
- controlled_execution_packet_authorization_draft_ready may be true.
- execution_packet_authorized remains false.
- execution_authorized remains false.
- execution_allowed remains false.
- storage_write_enabled remains false.
- canonical_write_allowed remains false.
- source_write_executed remains false.
- production_ready remains false.
- production_launch_allowed remains false.
- public_release_allowed remains false.

Next gate: ${nextGate}
`);

const readmeBlock = `## ${release} Controlled Execution Packet Authorization Draft

Controlled execution packet authorization draft turns founder decision posture into a reviewable draft packet while keeping authorization, execution, storage writes, canonical writes, public release, and production disabled.

- [Controlled Execution Packet Authorization Draft](controlledexecutionpacketauthorizationdraft.html)
- [Controlled Execution Packet Authorization Draft Notes](docs/CONTROLLED_EXECUTION_PACKET_AUTHORIZATION_DRAFT.md)
- [Controlled Execution Packet Authorization Draft Data](data/vedapath-controlled-execution-packet-authorization-draft.json)

`;

update("README.md", (content) => {
  if (content.includes("Controlled Execution Packet Authorization Draft")) return content;
  return mustReplace(content, "## v3.1.7 Founder Authorization Decision Gate", readmeBlock + "## v3.1.7 Founder Authorization Decision Gate", "README insertion");
});

const notesBlock = `## ${release} Controlled Execution Packet Authorization Draft

The controlled execution packet authorization draft is the first reviewable packet shape after founder decision posture.

- It starts from a founder decision ready packet.
- It can mark authorization draft readiness only.
- It blocks authorization, execution, storage writes, canonical writes, public release, and production.
- It moves only to a controlled authorization review gate.

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes(`${release} Controlled Execution Packet Authorization Draft`)) return content;
  return mustReplace(content, "## v3.1.7 Founder Authorization Decision Gate", notesBlock + "## v3.1.7 Founder Authorization Decision Gate", "prototype notes insertion");
});

const blueprintBlock = `### 301. Controlled Execution Packet Authorization Draft

Controlled Execution Packet Authorization Draft turns founder decision posture into reviewable authorization packet language.

It must:

- start from a founder authorization decision ready object
- preserve source answer, source record, source family, hold, review gate, and packet draft ids
- make authorization draft readiness visible
- block actual authorization, execution, storage writes, canonical writes, public release, and production
- move only to a controlled authorization review gate

Controlled Execution Packet Authorization Draft should never claim execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("### 301. Controlled Execution Packet Authorization Draft")) return content;
  return mustReplace(content, "### 300. Founder Authorization Decision Gate", blueprintBlock + "### 300. Founder Authorization Decision Gate", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.7 decision gate<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft next, and production still closed.", "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, review gate next, and production still closed.");
  if (!content.includes('href="controlledexecutionpacketauthorizationdraft.html"')) {
    content = mustReplace(content, '<a href="founderauthorizationdecisiongate.html">Founder decision <span>draft</span></a>', '<a href="founderauthorizationdecisiongate.html">Founder decision <span>draft</span></a>\n              <a href="controlledexecutionpacketauthorizationdraft.html">Authorization draft <span>review</span></a>', "study map auth draft link");
    content = mustReplace(content, '<a href="founderauthorizationdecisiongate.html">Founder decision <span>no-authority</span></a>', '<a href="founderauthorizationdecisiongate.html">Founder decision <span>no-authority</span></a>\n              <a href="controlledexecutionpacketauthorizationdraft.html">Authorization draft <span>no-execution</span></a>', "build map auth draft link");
  }
  return content;
});

update("founderauthorizationdecisiongate.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.7 decision gate<\/span>/g, `<span class="version">${badge}</span>`);
  if (!content.includes('href="controlledexecutionpacketauthorizationdraft.html"')) {
    content = mustReplace(content, '<a class="button primary" href="controlledexecutionauthorizationhold.html">Open Authorization Hold</a>', '<a class="button primary" href="controlledexecutionauthorizationhold.html">Open Authorization Hold</a>\n            <a class="button" href="controlledexecutionpacketauthorizationdraft.html">Open Authorization Draft</a>', "founder decision auth draft link");
  }
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.7 decision gate<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("<strong>v3.1.7</strong>\n          <p>Founder Authorization Decision Gate: held authorization language now receives founder decision posture while authorization, execution, storage, public release, and production remain false.</p>", "<strong>v3.1.8</strong>\n          <p>Controlled Execution Packet Authorization Draft: founder decision posture now becomes a reviewable authorization draft while authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace('<strong>99%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>\n          <p>The trust loop now records founder decision posture separately from actual authorization while every real write path remains closed.</p>', '<strong>99%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>\n          <p>The trust loop now drafts authorization language separately from actual authorization while every real write path remains closed.</p>');
  content = content.replace("<span>Next release</span>\n          <strong>Controlled execution packet authorization draft</strong>\n          <p>Draft the execution-packet authorization shape while no authorization is granted.</p>", "<span>Next release</span>\n          <strong>Controlled authorization review gate</strong>\n          <p>Review the draft packet for readiness while no authorization is granted.</p>");
  if (!content.includes("Phase 282: Controlled Execution Packet Authorization Draft")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 282: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 282: Controlled Execution Packet Authorization Draft</strong>
                <p>Turns founder decision posture into a reviewable authorization draft while authorization, execution, storage writes, canonical writes, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 283: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.1.7 Founder Authorization Decision Gate</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.1.8 Controlled Execution Packet Authorization Draft</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.1.6 Controlled Execution Authorization Hold</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Record founder decision posture without granting authorization or execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Draft authorization packet language without granting authorization or execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for controlled execution packet authorization draft</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for controlled authorization review gate</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Build controlled execution packet authorization draft.</span></li>\n              <li><span class="dot"></span><span>Use founder decision posture as draft input only.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Require another review before any authorization can be discussed.</span></li>', '<li><span class="dot"></span><span>Build controlled authorization review gate.</span></li>\n              <li><span class="dot"></span><span>Compare the draft packet against founder decision posture.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Require explicit human review before any authorization can be discussed.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.1\.7 decision gate<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} controlled execution packet authorization draft applied.`);

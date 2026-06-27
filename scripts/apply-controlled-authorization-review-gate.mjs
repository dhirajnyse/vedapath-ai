import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.1.9";
const badge = "v3.1.9 review gate";
const previousRelease = "v3.1.8 Controlled Execution Packet Authorization Draft";
const nextGate = "Founder authorization instruction gate";
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

const draftConfig = JSON.parse(read("data/vedapath-controlled-execution-packet-authorization-draft.json"));
const draft = draftConfig.sample_draft;
const source = {
  authorization_draft_release: draftConfig.release,
  authorization_draft_schema: draftConfig.schema_version,
  controlled_execution_packet_authorization_draft_id: draft.controlled_execution_packet_authorization_draft_id,
  founder_authorization_decision_gate_id: draft.founder_authorization_decision_gate_id,
  controlled_execution_authorization_hold_id: draft.controlled_execution_authorization_hold_id,
  controlled_execution_review_gate_id: draft.controlled_execution_review_gate_id,
  controlled_execution_packet_draft_id: draft.controlled_execution_packet_draft_id,
  founder_execution_instruction_gate_id: draft.founder_execution_instruction_gate_id,
  promotion_execution_preflight_id: draft.promotion_execution_preflight_id,
  source_answer_id: draft.source_answer_id,
  source_record_id: draft.source_record_id,
  source_family: draft.source_family
};

const falseAuthorityFlags = {
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

const sampleAuthorizationDraft = {
  schema_version: draftConfig.schema_version,
  release: draftConfig.release,
  controlled_execution_packet_authorization_draft_id: draft.controlled_execution_packet_authorization_draft_id,
  draft_status: "Authorization draft ready",
  authorization_draft_ready: true,
  controlled_execution_packet_authorization_draft_ready: true,
  ...falseAuthorityFlags,
  next_gate_required: "Controlled authorization review gate",
  ...draft,
  created_at: generatedAt
};

const config = {
  schema_version: "controlled-authorization-review-gate-v1",
  release,
  generated_at: generatedAt,
  title: "Controlled Authorization Review Gate",
  summary: "Reviews an authorization draft packet for readiness while keeping authorization, execution, storage writes, canonical writes, public release, and production disabled.",
  previous_release: previousRelease,
  source,
  review_states: [
    "Review draft",
    "Needs review evidence",
    "Authorization review ready",
    "Return to authorization draft",
    "Review hold",
    "Authorization still blocked",
    "Execution blocked",
    "Production forbidden",
    "Review expired"
  ],
  required_by_state: {
    "Review draft": [
      "controlled_execution_packet_authorization_draft_id",
      "source_answer_id",
      "review_scope"
    ],
    "Needs review evidence": [
      "review_question",
      "draft_comparison"
    ],
    "Authorization review ready": [
      "review_actor",
      "reviewer_name",
      "controlled_authorization_review_gate_id",
      "controlled_execution_packet_authorization_draft_id",
      "founder_authorization_decision_gate_id",
      "controlled_execution_authorization_hold_id",
      "controlled_execution_review_gate_id",
      "controlled_execution_packet_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "review_scope",
      "draft_comparison",
      "authorization_review_language",
      "review_rationale",
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
    "Return to authorization draft": [
      "return_reason"
    ],
    "Review hold": [
      "hold_reason"
    ],
    "Authorization still blocked": [
      "block_reason"
    ],
    "Execution blocked": [
      "block_reason"
    ],
    "Production forbidden": [
      "block_reason",
      "production_boundary"
    ],
    "Review expired": [
      "expiry_check",
      "hold_reason"
    ]
  },
  review_checks: [
    {
      check: "Authorization draft ready",
      rule: "The review can start only from a ready authorization draft object whose next gate is controlled authorization review gate."
    },
    {
      check: "Review only",
      rule: "The review can mark readiness for founder instruction, but it cannot grant authorization."
    },
    {
      check: "Source lock intact",
      rule: "The same authorization draft, founder decision, hold, review gate, packet draft, source answer, source record, and source family must stay locked."
    },
    {
      check: "No operational authority",
      rule: "Execution, storage, canonical writes, public release, production, accounts, secrets, and migrations remain blocked."
    },
    {
      check: "Founder instruction next",
      rule: "The next step is founder authorization instruction review, not a runnable instruction."
    },
    {
      check: "Expiry",
      rule: "The review expires on draft, source, rights, reviewer, founder decision, hold, rollback, monitoring, packet, or code change."
    }
  ],
  sample_authorization_draft: sampleAuthorizationDraft,
  sample_review: {
    review_state: "Authorization review ready",
    review_actor: "Controlled authorization reviewer",
    reviewer_name: "Reviewer sample",
    controlled_authorization_review_gate_id: "controlled-authorization-review-gate-sample-steady-action-bg-2-48",
    controlled_execution_packet_authorization_draft_id: draft.controlled_execution_packet_authorization_draft_id,
    founder_authorization_decision_gate_id: draft.founder_authorization_decision_gate_id,
    controlled_execution_authorization_hold_id: draft.controlled_execution_authorization_hold_id,
    controlled_execution_review_gate_id: draft.controlled_execution_review_gate_id,
    controlled_execution_packet_draft_id: draft.controlled_execution_packet_draft_id,
    founder_execution_instruction_gate_id: draft.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: draft.promotion_execution_preflight_id,
    source_answer_id: draft.source_answer_id,
    source_record_id: draft.source_record_id,
    source_family: draft.source_family,
    review_scope: "Review this exact authorization draft for founder authorization instruction readiness only. This review is not authorization and cannot execute, promote, store, update canonical records, migrate, create accounts, use secrets, publish public release, or launch production.",
    draft_comparison: "Compared the authorization draft with the founder decision posture, the same source answer, source record, source family, authorization hold, review gate, packet draft, non-authority clause, expiry, production boundary, and false authority flags.",
    authorization_review_language: "Review result for later founder instruction: this draft is coherent enough to ask for an explicit founder authorization instruction. This is review readiness only; authorization is not granted, execution is not allowed, and no system may run from it.",
    review_rationale: "The authorization draft preserves the same source chain, founder decision, authorization hold, review gate, packet draft, rollback, monitoring, stop condition, expiry, and production boundary. The review only prepares a founder instruction question.",
    review_evidence_summary: "Authorization draft ready; founder decision, hold, review gate, packet draft, source ids, source family, citation, rights, translation, reviewer evidence, source-owner scope, rollback, monitoring, stop condition, expiry, and production boundary remain visible.",
    source_lock: "Locked to controlled_execution_packet_authorization_draft_id controlled-execution-packet-authorization-draft-sample-steady-action-bg-2-48, founder_authorization_decision_gate_id founder-authorization-decision-gate-sample-steady-action-bg-2-48, controlled_execution_authorization_hold_id controlled-execution-authorization-hold-sample-steady-action-bg-2-48, controlled_execution_review_gate_id controlled-execution-review-gate-sample-steady-action-bg-2-48, controlled_execution_packet_draft_id controlled-execution-packet-draft-sample-steady-action-bg-2-48, source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti.",
    non_authority_clause: "Controlled authorization review gate only; authorization_draft_ready may be true, controlled_execution_packet_authorization_draft_ready may be true, authorization_review_ready may be true, controlled_authorization_review_gate_ready may be true, but execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, founder_instruction_granted remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    risk_acknowledgment: "Risk remains: draft mismatch, source mismatch, rights change, reviewer change, founder decision expiry, authorization hold expiry, review gate expiry, rollback missing, monitoring missing, packet mutation, code change, or any true authorization, execution, storage, canonical, public release, or production flag must block movement.",
    rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, and reviewer handoff must remain present before any founder authorization instruction gate; no source state is written.",
    monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any founder authorization instruction gate.",
    stop_condition: "Stop if draft id mismatches, source ids mismatch, rights change, reviewer evidence is missing, source-owner scope is missing, founder decision expires, authorization hold expires, review gate expires, rollback is missing, monitoring is missing, code changes, packet text mutates, or any authorization, execution, storage, canonical, public release, or production flag is true.",
    expiry_check: "Authorization review expires at the next material authorization draft, source, rights, reviewer, founder decision, authorization hold, review gate, rollback, monitoring, packet draft, or code change and must be rechecked; not approval.",
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
    authorization_review_ready: false,
    controlled_authorization_review_gate_ready: false,
    ...falseAuthorityFlags,
    next_gate_required: nextGate
  }
};

write("data/vedapath-controlled-authorization-review-gate.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-controlled-authorization-review-gate.css", `/* VedaPath controlled authorization review gate */
body.auth-review-page .topbar,
body.auth-review-page header.topbar {
  height: auto !important;
  min-height: var(--vp-header-height, 74px);
  padding: 0 !important;
}

body.auth-review-page .nav {
  gap: 5px;
  overflow: visible;
  flex-wrap: nowrap;
}

body.auth-review-page .nav .link,
body.auth-review-page .nav a {
  padding-left: 9px;
  padding-right: 9px;
}

body.auth-review-page .nav .version {
  margin-left: 6px;
  padding-left: 12px;
  padding-right: 12px;
}

body.auth-review-page main.workspace {
  grid-template-columns: minmax(210px, 0.72fr) minmax(0, 1.7fr) minmax(230px, 0.8fr);
  gap: 18px;
}

body.auth-review-page main.workspace > aside.panel:first-child,
body.auth-review-page main.workspace > aside.panel.tight {
  position: static;
  max-height: none;
  overflow: visible;
}

.auth-review,
.auth-review-head,
.auth-review-layout,
.auth-review-form,
.auth-review-grid,
.auth-review-list,
.auth-review-actions,
.auth-review-rules {
  display: grid;
  gap: 10px;
}

.auth-review { gap: 16px; }

.auth-review-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.auth-review-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.auth-review-mark img {
  display: block;
  width: 100%;
}

.auth-review-layout {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
}

.auth-review-form,
.auth-review-card,
.auth-review-result,
.auth-review-output,
.auth-review-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.auth-review-form,
.auth-review-card,
.auth-review-result,
.auth-review-rule {
  padding: 12px;
}

.auth-review-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.auth-review-form input,
.auth-review-form select,
.auth-review-form textarea,
.auth-review-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.auth-review-form textarea,
.auth-review-output {
  min-height: 96px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.auth-review-grid,
.auth-review-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.auth-review-card,
.auth-review-result {
  border-left: 4px solid var(--gold);
}

.auth-review-card.ready,
.auth-review-result[data-state="Authorization review ready"] {
  border-left-color: var(--green);
}

.auth-review-card.blocked,
.auth-review-result[data-state^="Blocked"],
.auth-review-result[data-state="Return to authorization draft"],
.auth-review-result[data-state="Review hold"],
.auth-review-result[data-state="Authorization still blocked"],
.auth-review-result[data-state="Execution blocked"],
.auth-review-result[data-state="Production forbidden"],
.auth-review-result[data-state="Review expired"] {
  border-left-color: var(--ochre);
}

.auth-review-card span,
.auth-review-card strong,
.auth-review-rule span,
.auth-review-rule strong {
  display: block;
}

.auth-review-card strong {
  font-size: 18px;
  line-height: 1.18;
  overflow-wrap: anywhere;
}

.auth-review-card span,
.auth-review-rule span {
  color: var(--muted);
  font-size: 12px;
}

.auth-review-result strong {
  display: block;
  font-size: 24px;
}

.auth-review-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.auth-review-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.auth-review-list {
  max-height: 320px;
  overflow: auto;
}

.auth-review-output {
  min-height: 260px;
}

.auth-review-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  body.auth-review-page .topbar,
  body.auth-review-page header.topbar {
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 12px 0 !important;
  }

  body.auth-review-page .nav {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  body.auth-review-page main.workspace {
    grid-template-columns: 1fr;
  }

  body.auth-review-page main.workspace > section.auth-review {
    order: 1;
  }

  body.auth-review-page main.workspace > aside.panel:first-child {
    order: 2;
  }

  body.auth-review-page main.workspace > aside.panel.tight {
    order: 3;
  }

  .auth-review-layout,
  .auth-review-head,
  .auth-review-grid,
  .auth-review-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .auth-review-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-controlled-authorization-review-gate.js", `(() => {
  const storageKey = "vedapath-controlled-authorization-review-gate";
  const pageDocument = typeof document === "undefined" ? null : document;
  const root = pageDocument ? pageDocument.getElementById("controlledAuthorizationReviewGate") : null;
  const savedRoot = pageDocument ? pageDocument.getElementById("authReviewSaved") : null;
  const resultCard = pageDocument ? pageDocument.getElementById("authReviewResultCard") : null;
  const reviewOutput = pageDocument ? pageDocument.getElementById("authReviewOutput") : null;
  const checksRoot = pageDocument ? pageDocument.getElementById("authReviewChecks") : null;
  const scopeRoot = pageDocument ? pageDocument.getElementById("authReviewScope") : null;

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

  function authorizationDraftReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-execution-packet-authorization-draft-v1" &&
      packet.draft_status === "Authorization draft ready" &&
      packet.authorization_draft_ready === true &&
      packet.controlled_execution_packet_authorization_draft_ready === true &&
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
      packet.next_gate_required === "Controlled authorization review gate";
  }

  function keepsReviewBoundary(value) {
    const text = String(value || "");
    const required = [
      /authorization_draft_ready may be true/i,
      /controlled_execution_packet_authorization_draft_ready may be true/i,
      /authorization_review_ready may be true/i,
      /controlled_authorization_review_gate_ready may be true/i,
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
    const unsafe = hasUnsafeAuthority(text);
    return required && !unsafe;
  }

  function hasUnsafeAuthority(value) {
    return /(authorization granted|authorization approved|approval granted|permission granted|authorize now|execution approved|execute now|run now|storage enabled|canonical update|canonical write allowed|migration run|secret use|account creation allowed|public release allowed|launch production|production launch allowed|founder_instruction_granted true|execution_allowed true|execution_authorized true|execution_packet_authorized true|storage_write_enabled true|canonical_write_allowed true|production_ready true|public_release_allowed true)/i.test(String(value || ""));
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function reviewMissingForState(config, state, review = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(review[field] || "").trim());
  }

  function idMatches(review, packet, key) {
    return !review[key] || !packet[key] || review[key] === packet[key];
  }

  function controlledAuthorizationReviewGate(config, authorizationDraftPacket, review) {
    const state = review.review_state || "Review draft";
    const missing = reviewMissingForState(config, state, review);
    const blocked = [];

    if (!authorizationDraftReady(authorizationDraftPacket)) {
      blocked.push("authorization draft must be ready while authorization, execution, storage, canonical, public release, and production flags remain false");
    }
    ["controlled_execution_packet_authorization_draft_id", "founder_authorization_decision_gate_id", "controlled_execution_authorization_hold_id", "controlled_execution_review_gate_id", "controlled_execution_packet_draft_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(review, authorizationDraftPacket, key)) blocked.push(key + " must match the authorization draft packet");
    });

    const readyCandidate = state === "Authorization review ready";
    if (readyCandidate && !hasText(review.review_scope, [["review this exact authorization draft"], ["founder authorization instruction readiness"], ["review is not authorization"], ["cannot", "execute"], ["promote"], ["store"], ["canonical"], ["migrate"], ["account"], ["secret"], ["public release"], ["production"]])) {
      blocked.push("review scope must be exact-draft only and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && !hasText(review.draft_comparison, [["authorization draft"], ["founder decision"], ["same source answer"], ["source record"], ["source family"], ["authorization hold"], ["review gate"], ["packet draft"], ["non-authority"], ["false authority flags"]])) {
      blocked.push("draft comparison must tie the review to the founder decision, exact source chain, non-authority clause, and false authority flags");
    }
    if (readyCandidate && hasUnsafeAuthority(review.authorization_review_language)) {
      blocked.push("authorization review language must not grant authorization, approve execution, or open production");
    }
    if (readyCandidate && !hasText(review.authorization_review_language, [["later founder instruction"], ["explicit founder authorization instruction"], ["review readiness only"], ["authorization is not granted"], ["execution is not allowed"], ["no system may run"]])) {
      blocked.push("authorization review language must prepare a later founder instruction and state authorization is not granted, execution is not allowed, and no system may run");
    }
    if (readyCandidate && !hasText(review.review_rationale, [["authorization draft"], ["same source chain"], ["founder decision"], ["authorization hold"], ["review gate"], ["packet draft"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"], ["founder instruction question"]])) {
      blocked.push("review rationale must keep the packet tied to the draft, source chain, and founder instruction question");
    }
    if (readyCandidate && !hasText(review.review_evidence_summary, [["authorization draft ready"], ["founder decision"], ["hold"], ["review gate"], ["packet draft"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("review evidence summary must keep source and review evidence visible");
    }
    if (readyCandidate && !hasText(review.source_lock, [["controlled_execution_packet_authorization_draft_id"], ["founder_authorization_decision_gate_id"], ["controlled_execution_authorization_hold_id"], ["controlled_execution_review_gate_id"], ["controlled_execution_packet_draft_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("source lock must name the authorization draft, founder decision, hold, review gate, packet draft, source answer, source record, and source family");
    }
    if (readyCandidate && !keepsReviewBoundary(review.non_authority_clause)) {
      blocked.push("non-authority clause must keep review readiness as non-authority and all authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(review.risk_acknowledgment, [["risk remains"], ["draft mismatch"], ["source mismatch"], ["rights change"], ["reviewer change"], ["founder decision expiry"], ["authorization hold expiry"], ["review gate expiry"], ["rollback missing"], ["monitoring missing"], ["packet mutation"], ["code change"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on draft, source, rights, reviewer, founder, hold, review, rollback, monitoring, packet, code, or true authority flags");
    }
    if (readyCandidate && !hasText(review.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["founder authorization instruction gate"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, next founder gate, and no source state write");
    }
    if (readyCandidate && !hasText(review.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["founder authorization instruction gate"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and next founder gate");
    }
    if (readyCandidate && !hasText(review.stop_condition, [["stop"], ["draft id mismatches"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["source-owner"], ["founder decision expires"], ["authorization hold expires"], ["review gate expires"], ["rollback"], ["monitoring"], ["code changes"], ["packet text mutates"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on draft/source mismatches, rights changes, missing evidence, expiry, missing rollback/monitoring, code changes, packet mutation, or any true authority flag");
    }
    if (readyCandidate && !hasText(review.expiry_check, [["expires"], ["material authorization draft"], ["source"], ["rights"], ["reviewer"], ["founder decision"], ["authorization hold"], ["review gate"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not approval"]])) {
      blocked.push("expiry check must state that authorization review expires and is not approval");
    }
    if (readyCandidate && !keepsProductionBoundary(review.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs review evidence" && !review.review_question) blocked.push("review question is required");
    if (state === "Return to authorization draft" && !review.return_reason) blocked.push("return reason is required");
    if (state === "Review hold" && !review.hold_reason) blocked.push("hold reason is required");
    if (state === "Authorization still blocked" && !review.block_reason) blocked.push("block reason is required");
    if (state === "Execution blocked" && !review.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !review.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Review expired" && !review.hold_reason) blocked.push("hold reason is required when review expires");

    const review_status = missing.length
      ? "Blocked: required authorization review fields missing"
      : blocked.length
        ? "Blocked: " + blocked[0]
        : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_authorization_review_gate_id: review.controlled_authorization_review_gate_id || "controlled-authorization-review-gate-" + Date.now(),
      review_status,
      authorization_draft_ready: authorizationDraftPacket.authorization_draft_ready === true,
      controlled_execution_packet_authorization_draft_ready: authorizationDraftPacket.controlled_execution_packet_authorization_draft_ready === true,
      authorization_review_ready: review_status === "Authorization review ready",
      controlled_authorization_review_gate_ready: review_status === "Authorization review ready",
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
      controlled_execution_packet_authorization_draft_id: review.controlled_execution_packet_authorization_draft_id || authorizationDraftPacket.controlled_execution_packet_authorization_draft_id || "",
      founder_authorization_decision_gate_id: review.founder_authorization_decision_gate_id || authorizationDraftPacket.founder_authorization_decision_gate_id || "",
      controlled_execution_authorization_hold_id: review.controlled_execution_authorization_hold_id || authorizationDraftPacket.controlled_execution_authorization_hold_id || "",
      controlled_execution_review_gate_id: review.controlled_execution_review_gate_id || authorizationDraftPacket.controlled_execution_review_gate_id || "",
      controlled_execution_packet_draft_id: review.controlled_execution_packet_draft_id || authorizationDraftPacket.controlled_execution_packet_draft_id || "",
      founder_execution_instruction_gate_id: review.founder_execution_instruction_gate_id || authorizationDraftPacket.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: review.promotion_execution_preflight_id || authorizationDraftPacket.promotion_execution_preflight_id || "",
      source_answer_id: review.source_answer_id || authorizationDraftPacket.source_answer_id || "",
      source_record_id: review.source_record_id || authorizationDraftPacket.source_record_id || "",
      source_family: review.source_family || authorizationDraftPacket.source_family || "",
      review_actor: review.review_actor || "",
      reviewer_name: review.reviewer_name || "",
      review_scope: review.review_scope || "",
      draft_comparison: review.draft_comparison || "",
      authorization_review_language: review.authorization_review_language || "",
      review_rationale: review.review_rationale || "",
      review_evidence_summary: review.review_evidence_summary || "",
      source_lock: review.source_lock || "",
      non_authority_clause: review.non_authority_clause || "",
      risk_acknowledgment: review.risk_acknowledgment || "",
      rollback_condition: review.rollback_condition || "",
      monitoring_condition: review.monitoring_condition || "",
      stop_condition: review.stop_condition || "",
      expiry_check: review.expiry_check || "",
      production_boundary: review.production_boundary || "",
      review_question: review.review_question || "",
      return_reason: review.return_reason || "",
      hold_reason: review.hold_reason || "",
      block_reason: review.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function authorizationReviewSnapshot(reviews, config) {
    const byStatus = reviews.reduce((counts, review) => {
      const key = review.review_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_reviews: reviews.length,
      ready: byStatus["Authorization review ready"] || 0,
      blocked: reviews.filter((review) => String(review.review_status || "").startsWith("Blocked")).length,
      holds: byStatus["Review hold"] || 0,
      expired: byStatus["Review expired"] || 0,
      execution_enabled: reviews.filter((review) => review.execution_allowed || review.execution_authorized || review.execution_packet_authorized || review.storage_write_enabled || review.source_write_executed || review.production_ready || review.public_release_allowed).length
    };
  }

  function parseReviewJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="auth-review-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(review) {
    if (!resultCard) return;
    const issues = [...(review.missing || []), ...(review.blocked || [])];
    resultCard.dataset.state = review.review_status;
    resultCard.innerHTML = '<strong>' + safe(review.review_status) + '</strong>' +
      '<p class="muted">Review ready: ' + safe(review.authorization_review_ready) + ' | Authorized: ' + safe(review.execution_packet_authorized) + ' | Production: ' + safe(review.production_ready) + '</p>' +
      '<div class="auth-review-grid">' +
        card("Authorization draft", review.controlled_execution_packet_authorization_draft_id, review.authorization_review_ready ? "ready" : "") +
        card("Source answer", review.source_answer_id) +
        card("Next gate", review.next_gate_required) +
        card("Execution", review.execution_allowed ? "enabled" : "false", review.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for founder authorization instruction gate. No authorization, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.review_checks.map((check) =>
      '<article class="auth-review-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    scopeRoot.innerHTML = card("Source family", config.source.source_family) +
      card("Source answer", config.source.source_answer_id) +
      card("Authorization draft", config.source.controlled_execution_packet_authorization_draft_id) +
      card("Next gate", config.boundary.next_gate_required);
  }

  function readSaved() {
    const saved = parseReviewJson(localStorage.getItem(storageKey), []);
    return Array.isArray(saved) ? saved : [];
  }

  function writeSaved(reviews) {
    localStorage.setItem(storageKey, JSON.stringify(reviews.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const reviews = readSaved();
    const snapshot = authorizationReviewSnapshot(reviews, config);
    savedRoot.innerHTML = card("Saved reviews", snapshot.saved_reviews) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      reviews.slice(-4).reverse().map((review) =>
        '<article class="auth-review-card ' + (review.authorization_review_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(review.created_at) + '</span>' +
        '<strong>' + safe(review.review_status) + '</strong>' +
        '<span>' + safe(review.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledAuthorizationReviewGate = {
    controlledAuthorizationReviewGate,
    authorizationReviewSnapshot,
    reviewMissingForState,
    keepsReviewBoundary,
    hasUnsafeAuthority,
    keepsProductionBoundary,
    parseReviewJson,
    authorizationDraftReady
  };

  if (!root || typeof fetch !== "function") return;

  fetch("data/vedapath-controlled-authorization-review-gate.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        authorizationDraft: root.querySelector("#authReviewAuthorizationDraft"),
        state: root.querySelector("#authReviewState"),
        actor: root.querySelector("#authReviewActor"),
        reviewer: root.querySelector("#authReviewerName"),
        reviewGateId: root.querySelector("#authReviewGateId"),
        authorizationDraftId: root.querySelector("#authReviewDraftId"),
        decisionGateId: root.querySelector("#authReviewDecisionGateId"),
        authorizationHoldId: root.querySelector("#authReviewAuthorizationHoldId"),
        priorReviewGateId: root.querySelector("#authReviewPriorReviewGateId"),
        packetDraftId: root.querySelector("#authReviewPacketDraftId"),
        founderGateId: root.querySelector("#authReviewFounderGateId"),
        preflightId: root.querySelector("#authReviewPreflightId"),
        sourceAnswer: root.querySelector("#authReviewSourceAnswer"),
        sourceRecord: root.querySelector("#authReviewSourceRecord"),
        sourceFamily: root.querySelector("#authReviewSourceFamily"),
        scope: root.querySelector("#authReviewScopeText"),
        comparison: root.querySelector("#authReviewComparison"),
        language: root.querySelector("#authReviewLanguage"),
        rationale: root.querySelector("#authReviewRationale"),
        evidence: root.querySelector("#authReviewEvidence"),
        sourceLock: root.querySelector("#authReviewSourceLock"),
        boundary: root.querySelector("#authReviewBoundary"),
        risk: root.querySelector("#authReviewRisk"),
        rollback: root.querySelector("#authReviewRollback"),
        monitoring: root.querySelector("#authReviewMonitoring"),
        stop: root.querySelector("#authReviewStopCondition"),
        expiry: root.querySelector("#authReviewExpiry"),
        production: root.querySelector("#authReviewProductionBoundary"),
        question: root.querySelector("#authReviewQuestion"),
        returnReason: root.querySelector("#authReviewReturnReason"),
        holdReason: root.querySelector("#authReviewHoldReason"),
        block: root.querySelector("#authReviewBlockReason")
      };

      config.review_states.forEach((state) => fields.state.add(new Option(state, state)));

      function loadSample() {
        const sample = config.sample_review;
        fields.authorizationDraft.value = JSON.stringify(config.sample_authorization_draft, null, 2);
        fields.state.value = sample.review_state;
        fields.actor.value = sample.review_actor;
        fields.reviewer.value = sample.reviewer_name;
        fields.reviewGateId.value = sample.controlled_authorization_review_gate_id;
        fields.authorizationDraftId.value = sample.controlled_execution_packet_authorization_draft_id;
        fields.decisionGateId.value = sample.founder_authorization_decision_gate_id;
        fields.authorizationHoldId.value = sample.controlled_execution_authorization_hold_id;
        fields.priorReviewGateId.value = sample.controlled_execution_review_gate_id;
        fields.packetDraftId.value = sample.controlled_execution_packet_draft_id;
        fields.founderGateId.value = sample.founder_execution_instruction_gate_id;
        fields.preflightId.value = sample.promotion_execution_preflight_id;
        fields.sourceAnswer.value = sample.source_answer_id;
        fields.sourceRecord.value = sample.source_record_id;
        fields.sourceFamily.value = sample.source_family;
        fields.scope.value = sample.review_scope;
        fields.comparison.value = sample.draft_comparison;
        fields.language.value = sample.authorization_review_language;
        fields.rationale.value = sample.review_rationale;
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

      function buildReview() {
        return {
          review_state: fields.state.value,
          review_actor: fields.actor.value,
          reviewer_name: fields.reviewer.value,
          controlled_authorization_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_authorization_draft_id: fields.authorizationDraftId.value,
          founder_authorization_decision_gate_id: fields.decisionGateId.value,
          controlled_execution_authorization_hold_id: fields.authorizationHoldId.value,
          controlled_execution_review_gate_id: fields.priorReviewGateId.value,
          controlled_execution_packet_draft_id: fields.packetDraftId.value,
          founder_execution_instruction_gate_id: fields.founderGateId.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          review_scope: fields.scope.value,
          draft_comparison: fields.comparison.value,
          authorization_review_language: fields.language.value,
          review_rationale: fields.rationale.value,
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
        const authorizationDraftPacket = parseReviewJson(fields.authorizationDraft.value, {});
        const review = controlledAuthorizationReviewGate(config, authorizationDraftPacket, buildReview());
        reviewOutput.value = JSON.stringify(review, null, 2);
        renderResult(review);
        return review;
      }

      root.querySelector("#runAuthReview").addEventListener("click", run);
      root.querySelector("#loadAuthReviewSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveAuthReview").addEventListener("click", () => {
        const review = run();
        writeSaved([...readSaved(), review]);
        renderSaved(config);
      });
      root.querySelector("#clearAuthReviews").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyAuthReview").addEventListener("click", async () => {
        if (!reviewOutput.value) run();
        await navigator.clipboard.writeText(reviewOutput.value);
      });

      loadSample();
      renderChecks(config);
      renderScope(config);
      run();
      renderSaved(config);
    });
})();
`);

write("controlledauthorizationreviewgate.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Authorization Review Gate</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-authorization-review-gate.css">
  </head>
  <body class="auth-review-page">
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Controlled authorization review</span>
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

      <main class="workspace" aria-label="VedaPath Controlled Authorization Review Gate workspace">
        <aside class="panel">
          <span class="eyebrow">Review is not permission</span>
          <h2>Check the draft before any founder instruction</h2>
          <p class="muted">This room reviews the controlled authorization draft. It can mark review readiness only; it cannot authorize, execute, promote, store, migrate, use secrets, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Draft</strong><p>Load packet.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Compare</strong><p>Check source lock.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep flags false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Founder</strong><p>Ask later.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledexecutionpacketauthorizationdraft.html">Open Authorization Draft</a>
            <a class="button safe" href="founderauthorizationdecisiongate.html">Open Founder Decision</a>
          </div>
        </aside>

        <section class="panel auth-review" id="controlledAuthorizationReviewGate">
          <div class="auth-review-head">
            <div>
              <span class="eyebrow">Authorization review gate</span>
              <h1>Review the draft. Keep permission closed.</h1>
              <p class="muted">A ready review here means the draft can move to a founder authorization instruction gate. It still cannot authorize execution, run code, promote sources, store data, update canonical records, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="auth-review-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath controlled authorization review mark"></div>
          </div>

          <section class="auth-review-layout">
            <div class="auth-review-form">
              <h2>Controlled Authorization Review</h2>
              <label>Authorization draft packet<textarea id="authReviewAuthorizationDraft"></textarea></label>
              <label>Review state<select id="authReviewState"></select></label>
              <label>Review actor<input id="authReviewActor" type="text" placeholder="Controlled authorization reviewer"></label>
              <label>Reviewer name<input id="authReviewerName" type="text" placeholder="Reviewer sample"></label>
              <label>Authorization review gate id<input id="authReviewGateId" type="text"></label>
              <label>Authorization draft id<input id="authReviewDraftId" type="text"></label>
              <label>Founder decision gate id<input id="authReviewDecisionGateId" type="text"></label>
              <label>Authorization hold id<input id="authReviewAuthorizationHoldId" type="text"></label>
              <label>Prior review gate id<input id="authReviewPriorReviewGateId" type="text"></label>
              <label>Packet draft id<input id="authReviewPacketDraftId" type="text"></label>
              <label>Founder gate id<input id="authReviewFounderGateId" type="text"></label>
              <label>Preflight id<input id="authReviewPreflightId" type="text"></label>
              <label>Source answer id<input id="authReviewSourceAnswer" type="text"></label>
              <label>Source record id<input id="authReviewSourceRecord" type="text"></label>
              <label>Source family<input id="authReviewSourceFamily" type="text"></label>
              <label>Review scope<textarea id="authReviewScopeText"></textarea></label>
              <label>Draft comparison<textarea id="authReviewComparison"></textarea></label>
              <label>Authorization review language<textarea id="authReviewLanguage"></textarea></label>
              <label>Review rationale<textarea id="authReviewRationale"></textarea></label>
              <label>Review evidence summary<textarea id="authReviewEvidence"></textarea></label>
              <label>Source lock<textarea id="authReviewSourceLock"></textarea></label>
              <label>Non-authority clause<textarea id="authReviewBoundary"></textarea></label>
              <label>Risk acknowledgment<textarea id="authReviewRisk"></textarea></label>
              <label>Rollback condition<textarea id="authReviewRollback"></textarea></label>
              <label>Monitoring condition<textarea id="authReviewMonitoring"></textarea></label>
              <label>Stop condition<textarea id="authReviewStopCondition"></textarea></label>
              <label>Expiry check<textarea id="authReviewExpiry"></textarea></label>
              <label>Production boundary<textarea id="authReviewProductionBoundary"></textarea></label>
              <label>Review question<textarea id="authReviewQuestion"></textarea></label>
              <label>Return reason<textarea id="authReviewReturnReason"></textarea></label>
              <label>Hold reason<textarea id="authReviewHoldReason"></textarea></label>
              <label>Block reason<textarea id="authReviewBlockReason"></textarea></label>
              <div class="auth-review-actions">
                <button class="button primary" id="runAuthReview" type="button">Run Review</button>
                <button class="button safe" id="loadAuthReviewSample" type="button">Load Sample</button>
                <button class="button" id="saveAuthReview" type="button">Save Local</button>
                <button class="button" id="clearAuthReviews" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="auth-review-result" id="authReviewResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Review Scope</h2>
                <div class="auth-review-list" id="authReviewScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Review Checks</h2>
            <div class="auth-review-rules" id="authReviewChecks"></div>
          </section>

          <section class="auth-review-layout">
            <div>
              <div class="auth-review-actions">
                <button class="button safe" id="copyAuthReview" type="button">Copy Review Packet</button>
                <a class="button" href="data/vedapath-controlled-authorization-review-gate.json">Open JSON</a>
              </div>
              <textarea class="auth-review-output" id="authReviewOutput" aria-label="Controlled authorization review gate"></textarea>
            </div>
            <div>
              <h2>Saved Local Reviews</h2>
              <div class="auth-review-list" id="authReviewSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Review is not authorization</span>
          <h2 style="margin-top: 14px;">Ready for Founder, Not Run</h2>
          <p class="muted">The review can say the draft is coherent enough for a founder instruction gate while every operational path stays locked.</p>
          <div class="progress" aria-label="Controlled authorization review gate progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>9</strong></div>
            <div class="metric"><span>Authorized</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Founder gate</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Review Boundary</h2>
            <p class="auth-review-boundary">Review only. Authorization, execution, founder grant, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares a founder authorization instruction gate. It does not authorize anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-authorization-review-gate.js"></script>
  </body>
</html>
`);

write("docs/CONTROLLED_AUTHORIZATION_REVIEW_GATE.md", `# VedaPath AI Controlled Authorization Review Gate

Release: ${release}

This release adds a controlled review gate for authorization draft packets.

Files:

- controlledauthorizationreviewgate.html
- assets/vedapath-controlled-authorization-review-gate.css
- assets/vedapath-controlled-authorization-review-gate.js
- data/vedapath-controlled-authorization-review-gate.json

The review gate can mark review readiness only. It cannot authorize execution, source promotion, storage writes, canonical writes, migrations, account creation, secret use, public release, or production launch.

The sample review starts from the v3.1.8 authorization draft packet and checks:

- authorization draft readiness
- source lock continuity
- draft comparison against founder decision posture
- non-authority language
- rollback, monitoring, stop, expiry, and production boundaries

Next gate: ${nextGate}
`);

const readmeBlock = `## ${release} Controlled Authorization Review Gate

Controlled Authorization Review Gate reviews the authorization draft packet for founder-instruction readiness while keeping authorization, execution, storage writes, canonical writes, public release, and production false.

- [Controlled Authorization Review Gate](controlledauthorizationreviewgate.html)
- [Controlled Authorization Review Gate Notes](docs/CONTROLLED_AUTHORIZATION_REVIEW_GATE.md)
- [Controlled Authorization Review Gate Data](data/vedapath-controlled-authorization-review-gate.json)

`;

update("README.md", (content) => {
  if (content.includes("Controlled Authorization Review Gate")) return content;
  return mustReplace(content, "## v3.1.8 Controlled Execution Packet Authorization Draft", readmeBlock + "## v3.1.8 Controlled Execution Packet Authorization Draft", "README insertion");
});

const notesBlock = `## ${release} Controlled Authorization Review Gate

The controlled authorization review gate is the next review layer after authorization draft readiness.

- It starts from a ready authorization draft packet.
- It can mark authorization review readiness only.
- It blocks authorization, execution, storage writes, canonical writes, public release, and production.
- It moves only to a founder authorization instruction gate.

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes(`${release} Controlled Authorization Review Gate`)) return content;
  return mustReplace(content, "## v3.1.8 Controlled Execution Packet Authorization Draft", notesBlock + "## v3.1.8 Controlled Execution Packet Authorization Draft", "prototype notes insertion");
});

const blueprintBlock = `### 302. Controlled Authorization Review Gate

Controlled Authorization Review Gate reviews authorization draft packet language for founder-instruction readiness.

It must:

- start from an authorization draft ready object
- preserve authorization draft, founder decision, hold, review gate, packet draft, source answer, source record, and source family ids
- make authorization review readiness visible
- block actual authorization, execution, storage writes, canonical writes, public release, and production
- move only to a founder authorization instruction gate

Controlled Authorization Review Gate should never claim authorization approval, execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("### 302. Controlled Authorization Review Gate")) return content;
  return mustReplace(content, "### 301. Controlled Execution Packet Authorization Draft", blueprintBlock + "### 301. Controlled Execution Packet Authorization Draft", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.8 auth draft<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, review gate next, and production still closed.", "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision, authorization draft, authorization review, founder instruction next, and production still closed.");
  if (!content.includes('href="controlledauthorizationreviewgate.html"')) {
    content = mustReplace(content, '<a href="controlledexecutionpacketauthorizationdraft.html">Authorization draft <span>review</span></a>', '<a href="controlledexecutionpacketauthorizationdraft.html">Authorization draft <span>review</span></a>\n              <a href="controlledauthorizationreviewgate.html">Authorization review <span>gate</span></a>', "study map auth review link");
    content = mustReplace(content, '<a href="controlledexecutionpacketauthorizationdraft.html">Authorization draft <span>no-execution</span></a>', '<a href="controlledexecutionpacketauthorizationdraft.html">Authorization draft <span>no-execution</span></a>\n              <a href="controlledauthorizationreviewgate.html">Authorization review <span>no-authority</span></a>', "build map auth review link");
  }
  return content;
});

update("controlledexecutionpacketauthorizationdraft.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.8 auth draft<\/span>/g, `<span class="version">${badge}</span>`);
  if (!content.includes('href="controlledauthorizationreviewgate.html"')) {
    content = mustReplace(content, '<a class="button primary" href="founderauthorizationdecisiongate.html">Open Founder Decision</a>', '<a class="button primary" href="founderauthorizationdecisiongate.html">Open Founder Decision</a>\n            <a class="button" href="controlledauthorizationreviewgate.html">Open Review Gate</a>', "auth draft review gate link");
  }
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.8 auth draft<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("<strong>v3.1.8</strong>\n          <p>Controlled Execution Packet Authorization Draft: founder decision posture now becomes a reviewable authorization draft while authorization, execution, storage, public release, and production remain false.</p>", "<strong>v3.1.9</strong>\n          <p>Controlled Authorization Review Gate: authorization draft language now receives review readiness while authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace('<strong>99%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>\n          <p>The trust loop now drafts authorization language separately from actual authorization while every real write path remains closed.</p>', '<strong>99%</strong>\n          <div class="progress" aria-hidden="true"><div class="bar" style="width:99%"></div></div>\n          <p>The trust loop now reviews authorization language separately from actual authorization while every real write path remains closed.</p>');
  content = content.replace("<span>Next release</span>\n          <strong>Controlled authorization review gate</strong>\n          <p>Review the draft packet for readiness while no authorization is granted.</p>", "<span>Next release</span>\n          <strong>Founder authorization instruction gate</strong>\n          <p>Ask for explicit founder instruction while still blocking execution.</p>");
  if (!content.includes("Phase 283: Controlled Authorization Review Gate")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 283: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 283: Controlled Authorization Review Gate</strong>
                <p>Reviews authorization draft language for founder-instruction readiness while authorization, execution, storage writes, canonical writes, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 284: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.1.8 Controlled Execution Packet Authorization Draft</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.1.9 Controlled Authorization Review Gate</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.1.7 Founder Authorization Decision Gate</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Draft authorization packet language without granting authorization or execution.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Review authorization draft language without granting authorization or execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for controlled authorization review gate</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for founder authorization instruction gate</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Build controlled authorization review gate.</span></li>\n              <li><span class="dot"></span><span>Compare the draft packet against founder decision posture.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Require explicit human review before any authorization can be discussed.</span></li>', '<li><span class="dot"></span><span>Build founder authorization instruction gate.</span></li>\n              <li><span class="dot"></span><span>Require explicit founder instruction before any authorization discussion.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Separate founder instruction from actual execution permission.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.1\.8 auth draft<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} controlled authorization review gate applied.`);

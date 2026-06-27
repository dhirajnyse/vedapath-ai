import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const release = "v3.1.6";
const badge = "v3.1.6 authorization hold";
const previousRelease = "v3.1.5 Controlled Execution Review Gate";
const nextGate = "Founder authorization decision gate";

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

const reviewConfig = JSON.parse(read("data/vedapath-controlled-execution-review-gate.json"));
const sampleReviewGate = {
  schema_version: reviewConfig.schema_version,
  release: reviewConfig.release,
  controlled_execution_review_gate_id: "controlled-execution-review-gate-sample-steady-action-bg-2-48",
  review_status: "Controlled review ready",
  controlled_execution_review_ready: true,
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
  next_gate_required: "Controlled execution authorization hold",
  ...reviewConfig.sample_review,
  created_at: "2026-06-27T00:00:00.000Z"
};

const config = {
  schema_version: "controlled-execution-authorization-hold-v1",
  release,
  generated_at: "2026-06-27T00:00:00.000Z",
  title: "Controlled Execution Authorization Hold",
  summary: "Holds authorization language behind a passed review gate while keeping execution packet authorization, execution, storage writes, canonical writes, migrations, accounts, secrets, public release, and production disabled.",
  previous_release: previousRelease,
  source: {
    controlled_execution_review_gate_release: reviewConfig.release,
    controlled_execution_review_gate_schema: reviewConfig.schema_version,
    controlled_execution_review_gate_id: sampleReviewGate.controlled_execution_review_gate_id,
    controlled_execution_packet_draft_id: sampleReviewGate.controlled_execution_packet_draft_id,
    founder_execution_instruction_gate_id: sampleReviewGate.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: sampleReviewGate.promotion_execution_preflight_id,
    source_answer_id: sampleReviewGate.source_answer_id,
    source_record_id: sampleReviewGate.source_record_id,
    source_family: sampleReviewGate.source_family
  },
  hold_states: [
    "Draft authorization hold",
    "Needs founder authorization language",
    "Controlled authorization hold ready",
    "Return to review gate",
    "Authorization hold",
    "Execution blocked",
    "Production forbidden",
    "Hold expired"
  ],
  required_by_state: {
    "Draft authorization hold": ["controlled_execution_review_gate_id", "source_answer_id", "authorization_scope"],
    "Needs founder authorization language": ["review_question", "founder_authorization_language"],
    "Controlled authorization hold ready": [
      "hold_actor",
      "holder_name",
      "controlled_execution_review_gate_id",
      "controlled_execution_packet_draft_id",
      "source_answer_id",
      "source_record_id",
      "source_family",
      "authorization_scope",
      "founder_authorization_language",
      "review_evidence_summary",
      "source_lock",
      "risk_acknowledgment",
      "boundary_statement",
      "rollback_condition",
      "monitoring_condition",
      "stop_condition",
      "expiry_check",
      "production_boundary"
    ],
    "Return to review gate": ["return_reason"],
    "Authorization hold": ["hold_reason"],
    "Execution blocked": ["block_reason"],
    "Production forbidden": ["block_reason", "production_boundary"],
    "Hold expired": ["expiry_check", "hold_reason"]
  },
  hold_checks: [
    {
      check: "Review gate ready",
      rule: "Authorization hold can start only from a controlled review ready object whose next gate is controlled execution authorization hold."
    },
    {
      check: "Hold only",
      rule: "The hold can prepare authorization language for a later founder decision gate; it cannot authorize or execute."
    },
    {
      check: "Founder language constrained",
      rule: "Founder-facing authorization language must say no authorization is granted in this release."
    },
    {
      check: "Source locked",
      rule: "The hold must name the exact review gate, packet draft, source answer, source record, and source family."
    },
    {
      check: "Operational blocks",
      rule: "Execution packet authorization, execution, storage, canonical writes, public release, and production stay false."
    },
    {
      check: "Expiry",
      rule: "The hold expires on material source, rights, reviewer, founder instruction, review gate, rollback, monitoring, packet draft, or code change."
    }
  ],
  sample_review_gate: sampleReviewGate,
  sample_hold: {
    hold_state: "Controlled authorization hold ready",
    hold_actor: "Controlled authorization holder",
    holder_name: "Authorization hold sample",
    controlled_execution_review_gate_id: sampleReviewGate.controlled_execution_review_gate_id,
    controlled_execution_packet_draft_id: sampleReviewGate.controlled_execution_packet_draft_id,
    founder_execution_instruction_gate_id: sampleReviewGate.founder_execution_instruction_gate_id,
    promotion_execution_preflight_id: sampleReviewGate.promotion_execution_preflight_id,
    source_answer_id: sampleReviewGate.source_answer_id,
    source_record_id: sampleReviewGate.source_record_id,
    source_family: sampleReviewGate.source_family,
    authorization_scope: "Hold authorization language only for source answer answer-steady-action-bg-2-48 after controlled review readiness. Do not authorize execution, source promotion, storage, canonical writes, migration, account creation, secret use, public release, or production launch.",
    founder_authorization_language: "Founder may later review authorization language for this exact source packet. This hold is not authorization, no authorization granted, and no execution may run from it.",
    review_evidence_summary: "Review gate ready; source ids, source family, citation, rights, translation, reviewer evidence, source-owner scope, founder instruction, rollback, monitoring, stop condition, expiry, and production boundary are visible.",
    source_lock: "Locked to controlled_execution_review_gate_id controlled-execution-review-gate-sample-steady-action-bg-2-48, controlled_execution_packet_draft_id controlled-execution-packet-draft-sample-steady-action-bg-2-48, source_answer_id answer-steady-action-bg-2-48, source_record_id bg-2-48-steadiness, and source family Bhagavad Gita | Smriti.",
    risk_acknowledgment: "Risk remains: source mismatch, rights change, reviewer change, founder instruction expiry, rollback missing, monitoring missing, code change, or any true authorization, execution, storage, canonical, public release, or production flag must block movement.",
    boundary_statement: "Controlled execution authorization hold only; controlled_authorization_hold_ready may be true, but execution_packet_authorized remains false, execution_authorized remains false, execution_allowed remains false, founder_instruction_granted remains false, source_promotion_allowed remains false, promotion_execution_allowed remains false, implementation_authorized remains false, implementation_execution_allowed remains false, controlled_storage_entry_allowed remains false, storage_write_enabled remains false, canonical_write_allowed remains false, source_write_executed remains false, actual_storage_write_executed remains false, production_ready remains false, production_launch_allowed remains false, and public_release_allowed remains false.",
    rollback_condition: "Rollback, replay, before_hash, failure review, stop condition, and reviewer handoff must remain present before any future founder authorization decision; no source state is written.",
    monitoring_condition: "Audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, and before-write check must remain visible before any future authorization decision.",
    stop_condition: "Stop if source ids mismatch, rights change, reviewer evidence is missing, source-owner scope is missing, founder instruction expires, review gate expires, rollback is missing, monitoring is missing, code changes, or any authorization, execution, storage, canonical, public release, or production flag is true.",
    expiry_check: "Authorization hold expires at the next material source, rights, reviewer, founder instruction, review gate, rollback, monitoring, packet draft, or code change and must be rechecked; not permanent approval.",
    production_boundary: "Production remains unavailable; production_ready remains false, production_launch_allowed remains false, public_release_allowed remains false, and no production migration, account, secret, durable storage, public release, or launch path is opened.",
    next_gate: nextGate,
    review_question: "",
    return_reason: "",
    hold_reason: "",
    block_reason: ""
  },
  boundary: {
    controlled_authorization_hold_ready: false,
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
    next_gate_required: nextGate
  }
};

write("data/vedapath-controlled-execution-authorization-hold.json", JSON.stringify(config, null, 2) + "\n");

write("assets/vedapath-controlled-execution-authorization-hold.css", `/* VedaPath controlled execution authorization hold */
.auth-hold,
.auth-head,
.auth-layout,
.auth-form,
.auth-grid,
.auth-list,
.auth-actions,
.auth-rules {
  display: grid;
  gap: 10px;
}

.auth-hold { gap: 16px; }

.auth-head {
  grid-template-columns: minmax(0, 1fr) 126px;
  align-items: center;
}

.auth-mark {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff3e4;
  padding: 10px;
}

.auth-mark img {
  display: block;
  width: 100%;
}

.auth-layout {
  grid-template-columns: minmax(0, 0.98fr) minmax(0, 1.02fr);
  align-items: start;
}

.auth-form,
.auth-card,
.auth-result,
.auth-output,
.auth-rule {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.auth-form,
.auth-card,
.auth-result,
.auth-rule {
  padding: 12px;
}

.auth-form label {
  display: grid;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 850;
}

.auth-form input,
.auth-form select,
.auth-form textarea,
.auth-output {
  width: 100%;
  border: 1px solid #efc1aa;
  border-radius: 8px;
  background: #fffaf4;
  color: var(--ink);
  padding: 10px;
}

.auth-form textarea,
.auth-output {
  min-height: 100px;
  resize: vertical;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
}

.auth-grid,
.auth-rules {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.auth-card,
.auth-result {
  border-left: 4px solid var(--gold);
}

.auth-card.ready,
.auth-result[data-state="Controlled authorization hold ready"] {
  border-left-color: var(--green);
}

.auth-card.blocked,
.auth-result[data-state="Blocked"],
.auth-result[data-state="Return to review gate"],
.auth-result[data-state="Authorization hold"],
.auth-result[data-state="Execution blocked"],
.auth-result[data-state="Production forbidden"],
.auth-result[data-state="Hold expired"] {
  border-left-color: var(--ochre);
}

.auth-card span,
.auth-card strong,
.auth-rule span,
.auth-rule strong {
  display: block;
}

.auth-card span,
.auth-rule span {
  color: var(--muted);
  font-size: 12px;
}

.auth-result strong {
  display: block;
  font-size: 24px;
}

.auth-result ul {
  margin: 10px 0 0;
  padding-left: 18px;
}

.auth-actions {
  grid-template-columns: repeat(2, minmax(0, max-content));
  justify-content: start;
}

.auth-list {
  max-height: 320px;
  overflow: auto;
}

.auth-output {
  min-height: 260px;
}

.auth-boundary {
  border: 1px dashed rgba(168, 62, 18, 0.38);
  border-radius: 8px;
  background: #fff7ea;
  padding: 12px;
  font-weight: 850;
}

@media (max-width: 980px) {
  .auth-layout,
  .auth-head,
  .auth-grid,
  .auth-rules {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .auth-actions { grid-template-columns: 1fr; }
}
`);

write("assets/vedapath-controlled-execution-authorization-hold.js", `(() => {
  const storageKey = "vedapath-controlled-execution-authorization-hold";
  const root = document.getElementById("controlledExecutionAuthorizationHold");
  const savedRoot = document.getElementById("authSaved");
  const resultCard = document.getElementById("authResultCard");
  const authOutput = document.getElementById("authOutput");
  const checksRoot = document.getElementById("authChecks");
  const scopeRoot = document.getElementById("authScope");

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

  function reviewGateReady(packet) {
    return Boolean(packet) &&
      packet.schema_version === "controlled-execution-review-gate-v1" &&
      packet.review_status === "Controlled review ready" &&
      packet.controlled_execution_review_ready === true &&
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
      packet.next_gate_required === "Controlled execution authorization hold";
  }

  function keepsHoldBoundary(value) {
    const text = String(value || "");
    const required = [
      /controlled_authorization_hold_ready may be true/i,
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
    const unsafe = /(execution_packet_authorized true|execution_authorized true|execution_allowed true|founder_instruction_granted true|source_promotion_allowed true|promotion_execution_allowed true|implementation_authorized true|implementation_execution_allowed true|controlled_storage_entry_allowed true|storage_write_enabled true|canonical_write_allowed true|source_write_executed true|actual_storage_write_executed true|production_ready true|production_launch_allowed true|public_release_allowed true|authorize now|authorization granted|execute now|write enabled|canonical update|migration run|secret use|launch production)/i.test(text);
    return required && !unsafe;
  }

  function keepsProductionBoundary(value) {
    return hasText(value, [["production_ready remains false"], ["production_launch_allowed remains false"], ["public_release_allowed remains false"], ["no", "production", "migration"], ["account"], ["secret"], ["durable", "storage"], ["public release"], ["launch"], ["opened"]]);
  }

  function holdMissingForState(config, state, hold = {}) {
    return (config.required_by_state[state] || []).filter((field) => !String(hold[field] || "").trim());
  }

  function idMatches(hold, reviewGate, key) {
    return !hold[key] || !reviewGate[key] || hold[key] === reviewGate[key];
  }

  function controlledExecutionAuthorizationHold(config, reviewGate, hold) {
    const state = hold.hold_state || "Draft authorization hold";
    const missing = holdMissingForState(config, state, hold);
    const blocked = [];

    if (!reviewGateReady(reviewGate)) blocked.push("controlled review gate must be ready while authorization, execution, storage, canonical, public release, and production flags remain false");
    ["controlled_execution_review_gate_id", "controlled_execution_packet_draft_id", "founder_execution_instruction_gate_id", "promotion_execution_preflight_id", "source_answer_id", "source_record_id", "source_family"].forEach((key) => {
      if (!idMatches(hold, reviewGate, key)) blocked.push(key + " must match the controlled review gate");
    });

    const readyCandidate = state === "Controlled authorization hold ready";
    if (readyCandidate && !hasText(hold.authorization_scope, [["hold authorization language only"], ["source answer"], ["after controlled review readiness"], ["do not", "authorize"], ["execution"], ["source promotion"], ["storage"], ["canonical"], ["migration"], ["account"], ["secret"], ["public release"], ["production launch"]])) {
      blocked.push("authorization scope must hold language only and explicitly block authorization, execution, promotion, storage, canonical writes, migration, accounts, secrets, public release, and production");
    }
    if (readyCandidate && !hasText(hold.founder_authorization_language, [["founder"], ["later review authorization language"], ["exact source packet"], ["not authorization"], ["no authorization granted"], ["no execution"]])) {
      blocked.push("founder authorization language must be future-facing and state not authorization, no authorization granted, and no execution");
    }
    if (readyCandidate && !hasText(hold.review_evidence_summary, [["review gate ready"], ["source ids"], ["source family"], ["citation"], ["rights"], ["translation"], ["reviewer evidence"], ["source-owner"], ["founder instruction"], ["rollback"], ["monitoring"], ["stop condition"], ["expiry"], ["production boundary"]])) {
      blocked.push("review evidence summary must keep review gate readiness and evidence visible");
    }
    if (readyCandidate && !hasText(hold.source_lock, [["controlled_execution_review_gate_id"], ["controlled_execution_packet_draft_id"], ["source_answer_id"], ["source_record_id"], ["source family"]])) {
      blocked.push("source lock must name the review gate, packet draft, source answer, source record, and source family");
    }
    if (readyCandidate && !hasText(hold.risk_acknowledgment, [["risk remains"], ["source mismatch"], ["rights change"], ["reviewer change"], ["founder instruction expiry"], ["rollback missing"], ["monitoring missing"], ["code change"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"], ["block"]])) {
      blocked.push("risk acknowledgment must block on source, rights, reviewer, founder, rollback, monitoring, code, or true authority flags");
    }
    if (readyCandidate && !keepsHoldBoundary(hold.boundary_statement)) {
      blocked.push("boundary statement must keep hold readiness as the only true readiness flag and all authority, write, public release, and production flags false");
    }
    if (readyCandidate && !hasText(hold.rollback_condition, [["rollback"], ["replay"], ["before_hash"], ["failure review"], ["stop condition"], ["reviewer handoff"], ["future founder authorization decision"], ["no source state"], ["written"]])) {
      blocked.push("rollback condition must include rollback, replay, before_hash, failure review, stop condition, reviewer handoff, future founder decision, and no source state write");
    }
    if (readyCandidate && !hasText(hold.monitoring_condition, [["audit receipt"], ["stop condition"], ["failure review"], ["reviewer handoff"], ["post-execution verification"], ["before-write"], ["future authorization decision"]])) {
      blocked.push("monitoring condition must include audit receipt, stop condition, failure review, reviewer handoff, post-execution verification, before-write check, and future authorization decision");
    }
    if (readyCandidate && !hasText(hold.stop_condition, [["stop"], ["source ids mismatch"], ["rights change"], ["reviewer evidence"], ["source-owner"], ["founder instruction expires"], ["review gate expires"], ["rollback"], ["monitoring"], ["code changes"], ["authorization"], ["execution"], ["storage"], ["canonical"], ["public release"], ["production"], ["true"]])) {
      blocked.push("stop condition must stop on source mismatches, rights changes, missing evidence, expiry, missing rollback/monitoring, code changes, or any true authority flag");
    }
    if (readyCandidate && !hasText(hold.expiry_check, [["expires"], ["material source"], ["rights"], ["reviewer"], ["founder instruction"], ["review gate"], ["rollback"], ["monitoring"], ["packet draft"], ["code change"], ["rechecked"], ["not permanent approval"]])) {
      blocked.push("expiry check must state that authorization hold expires and is not permanent approval");
    }
    if (readyCandidate && !keepsProductionBoundary(hold.production_boundary)) {
      blocked.push("production boundary must keep production, launch, public release, migration, account, secret, durable storage, and launch paths closed");
    }
    if (state === "Needs founder authorization language" && !hold.review_question) blocked.push("review question is required");
    if (state === "Return to review gate" && !hold.return_reason) blocked.push("return reason is required");
    if (state === "Authorization hold" && !hold.hold_reason) blocked.push("hold reason is required");
    if (state === "Execution blocked" && !hold.block_reason) blocked.push("block reason is required");
    if (state === "Production forbidden" && !hold.block_reason) blocked.push("block reason is required when production is forbidden");
    if (state === "Hold expired" && !hold.hold_reason) blocked.push("hold reason is required when hold expires");

    const hold_status = missing.length || blocked.length ? "Blocked" : state;

    return {
      schema_version: config.schema_version,
      release: config.release,
      controlled_execution_authorization_hold_id: "controlled-execution-authorization-hold-" + Date.now(),
      hold_status,
      controlled_authorization_hold_ready: hold_status === "Controlled authorization hold ready",
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
      controlled_execution_review_gate_id: hold.controlled_execution_review_gate_id || reviewGate.controlled_execution_review_gate_id || "",
      controlled_execution_packet_draft_id: hold.controlled_execution_packet_draft_id || reviewGate.controlled_execution_packet_draft_id || "",
      founder_execution_instruction_gate_id: hold.founder_execution_instruction_gate_id || reviewGate.founder_execution_instruction_gate_id || "",
      promotion_execution_preflight_id: hold.promotion_execution_preflight_id || reviewGate.promotion_execution_preflight_id || "",
      source_answer_id: hold.source_answer_id || reviewGate.source_answer_id || "",
      source_record_id: hold.source_record_id || reviewGate.source_record_id || "",
      source_family: hold.source_family || reviewGate.source_family || "",
      hold_actor: hold.hold_actor || "",
      holder_name: hold.holder_name || "",
      authorization_scope: hold.authorization_scope || "",
      founder_authorization_language: hold.founder_authorization_language || "",
      review_evidence_summary: hold.review_evidence_summary || "",
      source_lock: hold.source_lock || "",
      risk_acknowledgment: hold.risk_acknowledgment || "",
      boundary_statement: hold.boundary_statement || "",
      rollback_condition: hold.rollback_condition || "",
      monitoring_condition: hold.monitoring_condition || "",
      stop_condition: hold.stop_condition || "",
      expiry_check: hold.expiry_check || "",
      production_boundary: hold.production_boundary || "",
      review_question: hold.review_question || "",
      return_reason: hold.return_reason || "",
      hold_reason: hold.hold_reason || "",
      block_reason: hold.block_reason || "",
      missing,
      blocked,
      created_at: new Date().toISOString()
    };
  }

  function authorizationHoldSnapshot(holds, config) {
    const byStatus = holds.reduce((counts, hold) => {
      const key = hold.hold_status || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    return {
      release: config.release,
      saved_holds: holds.length,
      ready: byStatus["Controlled authorization hold ready"] || 0,
      blocked: byStatus.Blocked || 0,
      holds: byStatus["Authorization hold"] || 0,
      expired: byStatus["Hold expired"] || 0,
      execution_enabled: holds.filter((hold) => hold.execution_allowed || hold.execution_authorized || hold.execution_packet_authorized || hold.storage_write_enabled || hold.source_write_executed || hold.production_ready || hold.public_release_allowed).length
    };
  }

  function parseAuthJson(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function card(label, value, className = "") {
    return '<article class="auth-card ' + className + '"><span>' + safe(label) + '</span><strong>' + safe(value) + '</strong></article>';
  }

  function renderResult(hold) {
    if (!resultCard) return;
    const issues = [...(hold.missing || []), ...(hold.blocked || [])];
    resultCard.dataset.state = hold.hold_status;
    resultCard.innerHTML = '<strong>' + safe(hold.hold_status) + '</strong>' +
      '<p class="muted">Hold ready: ' + safe(hold.controlled_authorization_hold_ready) + ' | Authorized: ' + safe(hold.execution_packet_authorized) + ' | Production: ' + safe(hold.production_ready) + '</p>' +
      '<div class="auth-grid">' +
        card("Review gate", hold.controlled_execution_review_gate_id, hold.controlled_authorization_hold_ready ? "ready" : "") +
        card("Source answer", hold.source_answer_id) +
        card("Next gate", hold.next_gate_required) +
        card("Execution", hold.execution_allowed ? "enabled" : "false", hold.execution_allowed ? "blocked" : "ready") +
      '</div>' +
      (issues.length ? '<ul>' + issues.map((item) => '<li>' + safe(item) + '</li>').join("") + '</ul>' : '<p class="muted">Ready for founder authorization decision gate. No authorization, execution, storage write, canonical update, public release, or production launch was enabled.</p>');
  }

  function renderChecks(config) {
    if (!checksRoot) return;
    checksRoot.innerHTML = config.hold_checks.map((check) =>
      '<article class="auth-rule"><strong>' + safe(check.check) + '</strong><span>' + safe(check.rule) + '</span></article>'
    ).join("");
  }

  function renderScope(config) {
    if (!scopeRoot) return;
    const items = [
      ["Schema", config.schema_version],
      ["Release", config.release],
      ["Review gate", config.source.controlled_execution_review_gate_id],
      ["Source answer", config.source.source_answer_id],
      ["Source family", config.source.source_family],
      ["Next gate", config.boundary.next_gate_required]
    ];
    scopeRoot.innerHTML = items.map(([label, value]) => card(label, value)).join("");
  }

  function readSaved() {
    return parseAuthJson(localStorage.getItem(storageKey), []);
  }

  function writeSaved(holds) {
    localStorage.setItem(storageKey, JSON.stringify(holds.slice(-8), null, 2));
  }

  function renderSaved(config) {
    if (!savedRoot) return;
    const holds = readSaved();
    const snapshot = authorizationHoldSnapshot(holds, config);
    savedRoot.innerHTML = card("Saved holds", snapshot.saved_holds) +
      card("Ready", snapshot.ready, snapshot.ready ? "ready" : "") +
      card("Blocked", snapshot.blocked, snapshot.blocked ? "blocked" : "") +
      card("Execution enabled", snapshot.execution_enabled, snapshot.execution_enabled ? "blocked" : "ready") +
      holds.slice(-4).reverse().map((hold) =>
        '<article class="auth-card ' + (hold.controlled_authorization_hold_ready ? "ready" : "blocked") + '">' +
        '<span>' + safe(hold.created_at) + '</span>' +
        '<strong>' + safe(hold.hold_status) + '</strong>' +
        '<span>' + safe(hold.source_answer_id) + '</span>' +
        '</article>'
      ).join("");
  }

  window.vedapathControlledExecutionAuthorizationHold = {
    controlledExecutionAuthorizationHold,
    authorizationHoldSnapshot,
    holdMissingForState,
    parseAuthJson,
    reviewGateReady
  };

  if (!root) return;

  fetch("data/vedapath-controlled-execution-authorization-hold.json")
    .then((response) => response.json())
    .then((config) => {
      const fields = {
        reviewGate: root.querySelector("#authReviewGate"),
        state: root.querySelector("#authState"),
        actor: root.querySelector("#authActor"),
        holderName: root.querySelector("#authHolderName"),
        reviewGateId: root.querySelector("#authReviewGateId"),
        packetDraftId: root.querySelector("#authPacketDraftId"),
        founderGateId: root.querySelector("#authFounderGateId"),
        preflightId: root.querySelector("#authPreflightId"),
        sourceAnswer: root.querySelector("#authSourceAnswer"),
        sourceRecord: root.querySelector("#authSourceRecord"),
        sourceFamily: root.querySelector("#authSourceFamily"),
        scope: root.querySelector("#authScopeText"),
        founderLanguage: root.querySelector("#authFounderLanguage"),
        evidence: root.querySelector("#authEvidence"),
        sourceLock: root.querySelector("#authSourceLock"),
        risk: root.querySelector("#authRisk"),
        boundary: root.querySelector("#authBoundary"),
        rollback: root.querySelector("#authRollback"),
        monitoring: root.querySelector("#authMonitoring"),
        stop: root.querySelector("#authStopCondition"),
        expiry: root.querySelector("#authExpiry"),
        production: root.querySelector("#authProductionBoundary"),
        question: root.querySelector("#authQuestion"),
        returnReason: root.querySelector("#authReturnReason"),
        holdReason: root.querySelector("#authHoldReason"),
        block: root.querySelector("#authBlockReason")
      };

      config.hold_states.forEach((state) => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        fields.state.appendChild(option);
      });

      function loadSample() {
        const item = config.sample_hold;
        fields.reviewGate.value = JSON.stringify(config.sample_review_gate, null, 2);
        fields.state.value = item.hold_state;
        fields.actor.value = item.hold_actor;
        fields.holderName.value = item.holder_name;
        fields.reviewGateId.value = item.controlled_execution_review_gate_id;
        fields.packetDraftId.value = item.controlled_execution_packet_draft_id;
        fields.founderGateId.value = item.founder_execution_instruction_gate_id;
        fields.preflightId.value = item.promotion_execution_preflight_id;
        fields.sourceAnswer.value = item.source_answer_id;
        fields.sourceRecord.value = item.source_record_id;
        fields.sourceFamily.value = item.source_family;
        fields.scope.value = item.authorization_scope;
        fields.founderLanguage.value = item.founder_authorization_language;
        fields.evidence.value = item.review_evidence_summary;
        fields.sourceLock.value = item.source_lock;
        fields.risk.value = item.risk_acknowledgment;
        fields.boundary.value = item.boundary_statement;
        fields.rollback.value = item.rollback_condition;
        fields.monitoring.value = item.monitoring_condition;
        fields.stop.value = item.stop_condition;
        fields.expiry.value = item.expiry_check;
        fields.production.value = item.production_boundary;
        fields.question.value = item.review_question;
        fields.returnReason.value = item.return_reason;
        fields.holdReason.value = item.hold_reason;
        fields.block.value = item.block_reason;
      }

      function buildHold() {
        return {
          hold_state: fields.state.value,
          hold_actor: fields.actor.value,
          holder_name: fields.holderName.value,
          controlled_execution_review_gate_id: fields.reviewGateId.value,
          controlled_execution_packet_draft_id: fields.packetDraftId.value,
          founder_execution_instruction_gate_id: fields.founderGateId.value,
          promotion_execution_preflight_id: fields.preflightId.value,
          source_answer_id: fields.sourceAnswer.value,
          source_record_id: fields.sourceRecord.value,
          source_family: fields.sourceFamily.value,
          authorization_scope: fields.scope.value,
          founder_authorization_language: fields.founderLanguage.value,
          review_evidence_summary: fields.evidence.value,
          source_lock: fields.sourceLock.value,
          risk_acknowledgment: fields.risk.value,
          boundary_statement: fields.boundary.value,
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
        const reviewGate = parseAuthJson(fields.reviewGate.value, {});
        const hold = controlledExecutionAuthorizationHold(config, reviewGate, buildHold());
        authOutput.value = JSON.stringify(hold, null, 2);
        renderResult(hold);
        return hold;
      }

      root.querySelector("#runAuthHold").addEventListener("click", run);
      root.querySelector("#loadAuthSample").addEventListener("click", () => {
        loadSample();
        run();
      });
      root.querySelector("#saveAuthHold").addEventListener("click", () => {
        const hold = run();
        writeSaved([...readSaved(), hold]);
        renderSaved(config);
      });
      root.querySelector("#clearAuthHolds").addEventListener("click", () => {
        localStorage.removeItem(storageKey);
        renderSaved(config);
      });
      root.querySelector("#copyAuthHold").addEventListener("click", async () => {
        if (!authOutput.value) run();
        await navigator.clipboard.writeText(authOutput.value);
      });

      loadSample();
      renderChecks(config);
      renderScope(config);
      run();
      renderSaved(config);
    });
})();
`);

write("controlledexecutionauthorizationhold.html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>VedaPath Controlled Execution Authorization Hold</title>
    <link rel="stylesheet" href="assets/vedapath-sprint.css">
    <link rel="stylesheet" href="assets/vedapath-controlled-execution-authorization-hold.css">
    <link rel="stylesheet" href="assets/vedapath-cohesive.css">
    <link rel="stylesheet" href="assets/vedapath-polish.css">
    <link rel="stylesheet" href="assets/vedapath-focus.css">
  </head>
  <body>
    <div class="shell" id="top">
      <header class="topbar">
        <a class="brand" href="index.html#top" aria-label="VedaPath AI home">
          <img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath AI logo concept">
          <div>
            <strong>VedaPath AI</strong>
            <span>Controlled execution authorization hold</span>
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

      <main class="workspace" aria-label="VedaPath Controlled Execution Authorization Hold workspace">
        <aside class="panel">
          <span class="eyebrow">Hold is not authority</span>
          <h2>Prepare language before any decision</h2>
          <p class="muted">This room holds authorization language after review. It can say the language is ready for a later founder decision, but it cannot authorize, execute, promote, store, migrate, use secrets, publish, or launch.</p>
          <div class="sprint-list">
            <div class="sprint-step active"><span class="step-index">1</span><div><strong>Review</strong><p>Load gate.</p></div></div>
            <div class="sprint-step"><span class="step-index">2</span><div><strong>Language</strong><p>Constrain wording.</p></div></div>
            <div class="sprint-step"><span class="step-index">3</span><div><strong>Boundary</strong><p>Keep flags false.</p></div></div>
            <div class="sprint-step"><span class="step-index">4</span><div><strong>Decision</strong><p>Wait for founder.</p></div></div>
          </div>
          <div class="button-row" style="margin-top: 16px;">
            <a class="button primary" href="controlledexecutionreviewgate.html">Open Review Gate</a>
            <a class="button safe" href="controlledexecutionpacketdraft.html">Open Packet Draft</a>
          </div>
        </aside>

        <section class="panel auth-hold" id="controlledExecutionAuthorizationHold">
          <div class="auth-head">
            <div>
              <span class="eyebrow">Authorization hold</span>
              <h1>Hold the language. Keep execution closed.</h1>
              <p class="muted">A ready hold here means the authorization language can go to a founder decision gate next. It still cannot authorize, execute, promote, store, update canonical records, run migrations, create accounts, use secrets, publish public release, or launch production.</p>
            </div>
            <div class="auth-mark"><img src="assets/vedapath-3d-logo-concept.png" alt="VedaPath controlled execution authorization hold mark"></div>
          </div>

          <section class="auth-layout">
            <div class="auth-form">
              <h2>Controlled Authorization Hold</h2>
              <label>Review gate packet<textarea id="authReviewGate"></textarea></label>
              <label>Hold state<select id="authState"></select></label>
              <label>Hold actor<input id="authActor" type="text" placeholder="Controlled authorization holder"></label>
              <label>Holder name<input id="authHolderName" type="text" placeholder="Authorization hold sample"></label>
              <label>Review gate id<input id="authReviewGateId" type="text"></label>
              <label>Packet draft id<input id="authPacketDraftId" type="text"></label>
              <label>Founder gate id<input id="authFounderGateId" type="text"></label>
              <label>Preflight id<input id="authPreflightId" type="text"></label>
              <label>Source answer id<input id="authSourceAnswer" type="text"></label>
              <label>Source record id<input id="authSourceRecord" type="text"></label>
              <label>Source family<input id="authSourceFamily" type="text"></label>
              <label>Authorization scope<textarea id="authScopeText"></textarea></label>
              <label>Founder authorization language<textarea id="authFounderLanguage"></textarea></label>
              <label>Review evidence summary<textarea id="authEvidence"></textarea></label>
              <label>Source lock<textarea id="authSourceLock"></textarea></label>
              <label>Risk acknowledgment<textarea id="authRisk"></textarea></label>
              <label>Boundary statement<textarea id="authBoundary"></textarea></label>
              <label>Rollback condition<textarea id="authRollback"></textarea></label>
              <label>Monitoring condition<textarea id="authMonitoring"></textarea></label>
              <label>Stop condition<textarea id="authStopCondition"></textarea></label>
              <label>Expiry check<textarea id="authExpiry"></textarea></label>
              <label>Production boundary<textarea id="authProductionBoundary"></textarea></label>
              <label>Review question<textarea id="authQuestion"></textarea></label>
              <label>Return reason<textarea id="authReturnReason"></textarea></label>
              <label>Hold reason<textarea id="authHoldReason"></textarea></label>
              <label>Block reason<textarea id="authBlockReason"></textarea></label>
              <div class="auth-actions">
                <button class="button primary" id="runAuthHold" type="button">Run Hold</button>
                <button class="button safe" id="loadAuthSample" type="button">Load Sample</button>
                <button class="button" id="saveAuthHold" type="button">Save Local</button>
                <button class="button" id="clearAuthHolds" type="button">Clear Local</button>
              </div>
            </div>
            <div>
              <section class="auth-result" id="authResultCard" data-state="Blocked"></section>
              <section style="margin-top: 10px;">
                <h2>Hold Scope</h2>
                <div class="auth-list" id="authScope"></div>
              </section>
            </div>
          </section>

          <section>
            <h2>Hold Checks</h2>
            <div class="auth-rules" id="authChecks"></div>
          </section>

          <section class="auth-layout">
            <div>
              <div class="auth-actions">
                <button class="button safe" id="copyAuthHold" type="button">Copy Authorization Hold</button>
                <a class="button" href="data/vedapath-controlled-execution-authorization-hold.json">Open JSON</a>
              </div>
              <textarea class="auth-output" id="authOutput" aria-label="Controlled execution authorization hold"></textarea>
            </div>
            <div>
              <h2>Saved Local Holds</h2>
              <div class="auth-list" id="authSaved"></div>
            </div>
          </section>
        </section>

        <aside class="panel tight">
          <span class="badge green">Hold is not execution</span>
          <h2 style="margin-top: 14px;">Ready to Decide, Not Run</h2>
          <p class="muted">The hold prepares exact language for a later founder decision while every operational path stays locked.</p>
          <div class="progress" aria-label="Controlled execution authorization hold progress 100 percent"><div class="bar" style="--score:100%"></div></div>
          <div class="metric-grid">
            <div class="metric"><span>Current</span><strong>${release}</strong></div>
            <div class="metric"><span>States</span><strong>8</strong></div>
            <div class="metric"><span>Authorized</span><strong>False</strong></div>
            <div class="metric"><span>Next</span><strong>Founder decision</strong></div>
          </div>
          <section class="panel tight boundary" style="margin-top: 16px;">
            <h2>Authorization Boundary</h2>
            <p class="auth-boundary">Hold only. Authorization, execution, founder grant, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production launch remain false.</p>
            <p class="muted">This release prepares the founder authorization decision gate. It does not execute anything.</p>
          </section>
        </aside>
      </main>
    </div>
    <script src="assets/vedapath-controlled-execution-authorization-hold.js"></script>
  </body>
</html>
`);

write("docs/CONTROLLED_EXECUTION_AUTHORIZATION_HOLD.md", `# VedaPath AI Controlled Execution Authorization Hold

Release: ${release}

This release holds authorization language after the controlled execution review gate without granting authorization or execution.

## Files

- data/vedapath-controlled-execution-authorization-hold.json
- controlledexecutionauthorizationhold.html
- assets/vedapath-controlled-execution-authorization-hold.css
- assets/vedapath-controlled-execution-authorization-hold.js

## What It Adds

The room:

- starts from a controlled review ready object
- prepares founder-facing authorization language for a later decision gate
- keeps source ids, source family, evidence, risk, rollback, monitoring, stop condition, expiry, and production boundary visible
- permits only a future founder authorization decision gate
- keeps authorization, execution, founder grant, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production false

## Boundary

Controlled execution authorization hold is not execution approval. It does not authorize the packet, promote source data, run storage writes, update canonical source records, run migrations, create accounts, use secrets, publish public release state, or launch production. The next release should create a founder authorization decision gate while every write and production flag remains false.
`);

const readmeBlock = `<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD START -->
## ${release} Controlled Execution Authorization Hold

This release holds authorization language behind the review gate while all authorization, execution, promotion, storage, canonical-write, migration, account, secret, public-release, and production flags stay false.

- [Controlled Execution Authorization Hold](controlledexecutionauthorizationhold.html)
- [Controlled Execution Authorization Hold Notes](docs/CONTROLLED_EXECUTION_AUTHORIZATION_HOLD.md)
- [Controlled Execution Authorization Hold Data](data/vedapath-controlled-execution-authorization-hold.json)

<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD END -->

`;

update("README.md", (content) => {
  if (content.includes("VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD START")) return content;
  return mustReplace(content, "<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE START -->", readmeBlock + "<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE START -->", "README insertion");
});

const notesBlock = `<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD NOTES START -->
## ${release} Controlled Execution Authorization Hold

This phase prepares founder-facing authorization language without granting authorization.

- Adds a controlled execution authorization hold room.
- Reads a controlled review ready object.
- Requires constrained authorization scope, founder language, evidence summary, source lock, risk, boundary, rollback, monitoring, stop condition, production boundary, and expiry.
- Keeps execution_packet_authorized, execution_authorized, execution_allowed, founder_instruction_granted, source_promotion_allowed, promotion_execution_allowed, implementation_authorized, implementation_execution_allowed, controlled_storage_entry_allowed, storage_write_enabled, canonical_write_allowed, source_write_executed, actual_storage_write_executed, production_ready, production_launch_allowed, and public_release_allowed false.

<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD NOTES END -->

`;

update("docs/PROTOTYPE_NOTES.md", (content) => {
  if (content.includes("VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD NOTES START")) return content;
  return mustReplace(content, "<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE NOTES START -->", notesBlock + "<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE NOTES START -->", "prototype notes insertion");
});

const blueprintBlock = `<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD BLUEPRINT START -->
### 299. Controlled Execution Authorization Hold

VedaPath should distinguish authorization language from authorization itself. The authorization hold can prepare founder-facing wording, but it cannot authorize or execute.

Core requirements:

- start from a controlled review ready object
- hold exact source-specific authorization language for later founder decision
- keep review evidence, source lock, risk, rollback, monitoring, stop condition, production boundary, and expiry visible
- permit only a future founder authorization decision gate
- block authorization, execution, source promotion, storage writes, canonical writes, migrations, accounts, secrets, public release, and production

Controlled Execution Authorization Hold should never claim execution approval, storage permission, canonical source authority, migration authority, production authority, therapy, ritual instruction, crisis support, or spiritual authority.
<!-- VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD BLUEPRINT END -->

`;

update("docs/PRODUCT_BLUEPRINT.md", (content) => {
  if (content.includes("VEDAPATH CONTROLLED EXECUTION AUTHORIZATION HOLD BLUEPRINT START")) return content;
  return mustReplace(content, "<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE BLUEPRINT START -->", blueprintBlock + "<!-- VEDAPATH CONTROLLED EXECUTION REVIEW GATE BLUEPRINT START -->", "product blueprint insertion");
});

update("index.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.5 review gate<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("The product surface now has a controlled route: packet draft, review gate, authorization hold next, and production still closed.", "The product surface now has a controlled route: packet draft, review gate, authorization hold, founder decision next, and production still closed.");
  if (!content.includes('href="controlledexecutionauthorizationhold.html"')) {
    content = mustReplace(content, '<a href="controlledexecutionreviewgate.html">Review gate <span>hold</span></a>', '<a href="controlledexecutionreviewgate.html">Review gate <span>hold</span></a>\n              <a href="controlledexecutionauthorizationhold.html">Authorization hold <span>decision</span></a>', "study map authorization hold link");
    content = mustReplace(content, '<a href="controlledexecutionreviewgate.html">Review gate <span>no-authority</span></a>', '<a href="controlledexecutionreviewgate.html">Review gate <span>no-authority</span></a>\n              <a href="controlledexecutionauthorizationhold.html">Authorization hold <span>no-execution</span></a>', "build map authorization hold link");
  }
  return content;
});

update("controlledexecutionreviewgate.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.5 review gate<\/span>/g, `<span class="version">${badge}</span>`);
  if (!content.includes('href="controlledexecutionauthorizationhold.html"')) {
    content = mustReplace(content, '<a class="button safe" href="founderexecutioninstructiongate.html">Open Founder Gate</a>', '<a class="button safe" href="founderexecutioninstructiongate.html">Open Founder Gate</a>\n            <a class="button" href="controlledexecutionauthorizationhold.html">Open Authorization Hold</a>', "review gate authorization hold link");
  }
  return content;
});

update("build-status.html", (content) => {
  content = content.replace(/<span class="version">v3\.1\.5 review gate<\/span>/g, `<span class="version">${badge}</span>`);
  content = content.replace("<strong>v3.1.5</strong>\n          <p>Controlled Execution Review Gate: packet drafts now receive source, evidence, boundary, rollback, monitoring, and expiry review while authorization, execution, storage, public release, and production remain false.</p>", "<strong>v3.1.6</strong>\n          <p>Controlled Execution Authorization Hold: review-ready packets now get constrained founder-facing authorization language while authorization, execution, storage, public release, and production remain false.</p>");
  content = content.replace("<strong>97%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:97%\"></div></div>\n          <p>The trust loop now reviews the packet draft while every real write path remains closed.</p>", "<strong>98%</strong>\n          <div class=\"progress\" aria-hidden=\"true\"><div class=\"bar\" style=\"width:98%\"></div></div>\n          <p>The trust loop now holds authorization language separately from actual authorization while every real write path remains closed.</p>");
  content = content.replace("<span>Next release</span>\n          <strong>Controlled execution authorization hold</strong>\n          <p>Hold authorization behind review evidence before any execution can be considered.</p>", "<span>Next release</span>\n          <strong>Founder authorization decision gate</strong>\n          <p>Let the founder review the exact authorization language while execution remains blocked.</p>");
  if (!content.includes("Phase 280: Controlled Execution Authorization Hold")) {
    content = mustReplace(content, `            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 280: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, `            <article class="phase">
              <span class="badge done">Done</span>
              <div>
                <strong>Phase 280: Controlled Execution Authorization Hold</strong>
                <p>Holds constrained founder-facing authorization language behind review readiness while authorization, execution, storage writes, canonical writes, public release, and production remain false.</p>
              </div>
              <span class="percent">100%</span>
            </article>
            <article class="phase">
              <span class="badge later">Later</span>
              <div>
                <strong>Phase 281: Production Implementation and Licensed Audio</strong>
                <p>Backend storage, account consent, reviewed source records, reviewer operations, audio rights, and launch sequencing after founder direction.</p>
              </div>
              <div class="percent">0%</div>
            </article>`, "roadmap phase insertion");
  }
  content = content.replace('<div class="version-row"><span>Release</span><strong>v3.1.5 Controlled Execution Review Gate</strong></div>', '<div class="version-row"><span>Release</span><strong>v3.1.6 Controlled Execution Authorization Hold</strong></div>');
  content = content.replace('<div class="version-row"><span>Previous</span><strong>v3.1.4 Controlled Execution Packet Draft</strong></div>', `<div class="version-row"><span>Previous</span><strong>${previousRelease}</strong></div>`);
  content = content.replace('<div class="version-row"><span>Goal</span><strong>Review the controlled execution packet before any authorization can be considered.</strong></div>', '<div class="version-row"><span>Goal</span><strong>Hold authorization language without granting authorization or execution.</strong></div>');
  content = content.replace('<div class="version-row"><span>Status</span><strong>Ready for controlled execution authorization hold</strong></div>', '<div class="version-row"><span>Status</span><strong>Ready for founder authorization decision gate</strong></div>');
  content = content.replace('<li><span class="dot"></span><span>Build controlled execution authorization hold.</span></li>\n              <li><span class="dot"></span><span>Require review-gate readiness before any authorization question.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Prepare founder review of authorization language only.</span></li>', '<li><span class="dot"></span><span>Build founder authorization decision gate.</span></li>\n              <li><span class="dot"></span><span>Show exact authorization language for founder review.</span></li>\n              <li><span class="dot"></span><span>Keep execution, storage, canonical writes, public release, and production disabled.</span></li>\n              <li><span class="dot"></span><span>Require explicit decision notes before any later execution packet.</span></li>');
  return content;
});

for (const htmlFile of htmlFiles(root)) {
  const content = fs.readFileSync(htmlFile, "utf8");
  const next = content.replace(/<span class="version">v3\.1\.5 review gate<\/span>/g, `<span class="version">${badge}</span>`);
  if (next !== content) fs.writeFileSync(htmlFile, next);
}

console.log(`${release} controlled execution authorization hold applied.`);
